/**
 * P2L BookWriter — Split-pane Markdown Editor
 *
 * Wraps CodeMirror 6 (loaded as ES modules from esm.sh) and provides a
 * resizable, three-mode (split / source / preview) editing surface with
 * live preview rendered via `marked`. Also owns the story open/save/delete
 * lifecycle previously inlined in index.html.
 *
 * Public API (exposed as `window.editorAPI`):
 *   await editorAPI.init({ host, readOnly })
 *   editorAPI.openStory(story)         // load and display a story
 *   editorAPI.saveStory()              // persist via /api/save
 *   editorAPI.exportForMedium()        // download markdown for Medium
 *   editorAPI.deleteStory()            // delete via /api/delete
 *   editorAPI.getContent() / setContent(text)
 *   editorAPI.setReadOnly(flag)
 *   editorAPI.setViewMode('split'|'source'|'preview')
 *   editorAPI.focus()
 *   editorAPI.hasUnsavedChanges -> boolean
 *   editorAPI.currentStory -> Object | null
 *
 * Notes:
 *   - The module loads CodeMirror 6 + marked from esm.sh, keeping the
 *     project's no-build-step constraint intact.
 *   - In IS_STATIC (read-only) mode the editor still renders content but
 *     blocks edits, autosave, save, export, and delete actions.
 *   - Feedback paragraph anchors live in raw-markdown space and are
 *     unaffected by preview rendering — preserving \n\n paragraph breaks
 *     in saved content keeps the existing feedback system anchored.
 */

// CodeMirror 6 — use esm.sh `?bundle-deps` so every package resolves to the
// same singleton `@codemirror/state` (otherwise ESM dual-load breaks
// instanceof checks for extensions). Pinning all CM core packages to
// `?deps=@codemirror/state@6.5.0,@codemirror/view@6.34.1` forces the CDN
// to dedupe the shared state and view modules.
const CM_DEPS = 'deps=@codemirror/state@6.5.0,@codemirror/view@6.34.1';

const [
    cmView,
    cmState,
    cmCommands,
    cmLangMarkdown,
    cmLanguage,
    cmThemeOneDark,
    cmSearch,
    markedMod
] = await Promise.all([
    import(`https://esm.sh/@codemirror/view@6.34.1?${CM_DEPS}`),
    import('https://esm.sh/@codemirror/state@6.5.0'),
    import(`https://esm.sh/@codemirror/commands@6.7.1?${CM_DEPS}`),
    import(`https://esm.sh/@codemirror/lang-markdown@6.3.1?${CM_DEPS}`),
    import(`https://esm.sh/@codemirror/language@6.10.6?${CM_DEPS}`),
    import(`https://esm.sh/@codemirror/theme-one-dark@6.1.2?${CM_DEPS}`),
    import(`https://esm.sh/@codemirror/search@6.5.6?${CM_DEPS}`),
    import('https://esm.sh/marked@14.1.3')
]);

const {
    EditorView,
    keymap,
    lineNumbers,
    highlightActiveLine,
    highlightActiveLineGutter,
    drawSelection
} = cmView;
const { EditorState, EditorSelection, Compartment } = cmState;
const {
    defaultKeymap,
    history,
    historyKeymap,
    indentWithTab
} = cmCommands;
const { markdown, markdownLanguage } = cmLangMarkdown;
const {
    syntaxHighlighting,
    defaultHighlightStyle,
    bracketMatching
} = cmLanguage;
const { oneDark } = cmThemeOneDark;
const { search, openSearchPanel, closeSearchPanel, searchKeymap } = cmSearch;
const { marked } = markedMod;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY_RATIO = 'p2l.editor.splitRatio';
const STORAGE_KEY_VIEW = 'p2l.editor.viewMode';
const DEFAULT_RATIO = 0.5;
const MIN_RATIO = 0.15;
const MAX_RATIO = 0.85;
const PREVIEW_DEBOUNCE_MS = 150;
const AUTOSAVE_DELAY_MS = 30000;
const VIEW_MODES = Object.freeze(['split', 'source', 'preview']);

// ---------------------------------------------------------------------------
// Module state (single editor per page)
// ---------------------------------------------------------------------------

const state = {
    view: null,
    readOnlyCompartment: new Compartment(),
    editableCompartment: new Compartment(),
    isReadOnly: false,
    container: null,
    sourcePane: null,
    previewPane: null,
    splitter: null,
    toolbar: null,
    formatToolbar: null,
    previewEl: null,
    viewMode: 'split',
    ratio: DEFAULT_RATIO,
    previewTimer: null,
    autosaveTimer: null,
    lastSavedContent: '',
    syncing: false,
    currentStory: null,
    hasUnsavedChanges: false,
    initialized: false
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

marked.setOptions({ gfm: true, breaks: false });

function stripFrontmatter(text) {
    return text.replace(/^---[\s\S]*?---\n*/, '');
}

function clampRatio(r) {
    if (Number.isNaN(r)) return DEFAULT_RATIO;
    return Math.min(MAX_RATIO, Math.max(MIN_RATIO, r));
}

function loadPreferences() {
    try {
        const ratioRaw = localStorage.getItem(STORAGE_KEY_RATIO);
        if (ratioRaw !== null) state.ratio = clampRatio(parseFloat(ratioRaw));
        const viewRaw = localStorage.getItem(STORAGE_KEY_VIEW);
        if (viewRaw && VIEW_MODES.includes(viewRaw)) state.viewMode = viewRaw;
    } catch (_) { /* localStorage may be unavailable */ }
}

function persistPreferences() {
    try {
        localStorage.setItem(STORAGE_KEY_RATIO, String(state.ratio));
        localStorage.setItem(STORAGE_KEY_VIEW, state.viewMode);
    } catch (_) { /* ignore */ }
}

function showStatus(message, color = 'green') {
    if (typeof window.showSaveStatus === 'function') {
        window.showSaveStatus(message, color);
    }
}

// ---------------------------------------------------------------------------
// Preview
// ---------------------------------------------------------------------------

function renderPreview(content) {
    if (!state.previewEl) return;
    const clean = stripFrontmatter(content);
    try {
        state.previewEl.innerHTML = marked.parse(clean);
    } catch (err) {
        console.error('Markdown render failed', err);
        state.previewEl.innerHTML = '<p class="text-red-400">Preview render error</p>';
    }
}

function schedulePreview(content) {
    if (state.previewTimer) clearTimeout(state.previewTimer);
    state.previewTimer = setTimeout(() => renderPreview(content), PREVIEW_DEBOUNCE_MS);
}

function updateWordCount(content) {
    const el = document.getElementById('meta-word-count');
    if (!el) return;
    const cleanContent = stripFrontmatter(content);
    const words = cleanContent.split(/\s+/).filter(w => w.length > 0).length;
    el.textContent = words.toLocaleString();
}

function updateSaveIndicator() {
    const btn = document.getElementById('btn-save');
    if (!btn) return;
    if (state.hasUnsavedChanges) {
        btn.textContent = 'Save *';
        btn.classList.add('ring-2', 'ring-yellow-500');
    } else {
        btn.textContent = 'Save';
        btn.classList.remove('ring-2', 'ring-yellow-500');
    }
}

// ---------------------------------------------------------------------------
// View mode + splitter
// ---------------------------------------------------------------------------

function applyLayout() {
    if (!state.sourcePane || !state.previewPane || !state.splitter) return;
    if (state.viewMode === 'source') {
        state.sourcePane.style.display = '';
        state.sourcePane.style.flex = '1 1 100%';
        state.previewPane.style.display = 'none';
        state.splitter.style.display = 'none';
    } else if (state.viewMode === 'preview') {
        state.sourcePane.style.display = 'none';
        state.previewPane.style.display = '';
        state.previewPane.style.flex = '1 1 100%';
        state.splitter.style.display = 'none';
    } else {
        state.sourcePane.style.display = '';
        state.previewPane.style.display = '';
        state.splitter.style.display = '';
        const left = (state.ratio * 100).toFixed(2);
        const right = (100 - state.ratio * 100).toFixed(2);
        state.sourcePane.style.flex = `0 0 calc(${left}% - 4px)`;
        state.previewPane.style.flex = `0 0 calc(${right}% - 4px)`;
    }
    updateToolbarUI();
    updateFormatToolbarVisibility();
}

// Format toolbar is shown only in modes where the source pane is visible
// (split / source). It is also unconditionally hidden in read-only mode —
// `setReadOnly` handles that by toggling `state.formatToolbar.style.display`.
function updateFormatToolbarVisibility() {
    if (!state.formatToolbar) return;
    if (state.isReadOnly) {
        state.formatToolbar.style.display = 'none';
        return;
    }
    state.formatToolbar.style.display = state.viewMode === 'preview' ? 'none' : '';
}

function updateToolbarUI() {
    if (!state.toolbar) return;
    const buttons = state.toolbar.querySelectorAll('[data-view-mode]');
    buttons.forEach(btn => {
        const active = btn.dataset.viewMode === state.viewMode;
        btn.classList.toggle('bg-blue-600', active);
        btn.classList.toggle('text-white', active);
        btn.classList.toggle('bg-gray-700', !active);
        btn.classList.toggle('text-gray-300', !active);
    });
}

function setViewMode(mode) {
    if (!VIEW_MODES.includes(mode)) return;
    state.viewMode = mode;
    persistPreferences();
    applyLayout();
    if (mode !== 'source') renderPreview(getContent());
}

function attachSplitterDrag() {
    if (!state.splitter || !state.container) return;
    let dragging = false;

    const onMove = (clientX) => {
        if (!dragging) return;
        const rect = state.container.getBoundingClientRect();
        if (rect.width <= 0) return;
        state.ratio = clampRatio((clientX - rect.left) / rect.width);
        applyLayout();
    };

    const onDown = (ev) => {
        if (state.viewMode !== 'split') return;
        dragging = true;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
        ev.preventDefault();
    };

    const onUp = () => {
        if (!dragging) return;
        dragging = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        persistPreferences();
    };

    state.splitter.addEventListener('mousedown', onDown);
    document.addEventListener('mousemove', (ev) => onMove(ev.clientX));
    document.addEventListener('mouseup', onUp);

    state.splitter.addEventListener('touchstart', (ev) => {
        if (state.viewMode !== 'split') return;
        dragging = true;
        ev.preventDefault();
    }, { passive: false });
    document.addEventListener('touchmove', (ev) => {
        if (!dragging || !ev.touches[0]) return;
        onMove(ev.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchend', onUp);
}

// ---------------------------------------------------------------------------
// Sync scroll (best effort, fractional)
// ---------------------------------------------------------------------------

function attachSyncScroll() {
    if (!state.previewEl || !state.view) return;
    const editorScroller = state.view.scrollDOM;

    editorScroller.addEventListener('scroll', () => {
        if (state.syncing || state.viewMode !== 'split') return;
        const max = editorScroller.scrollHeight - editorScroller.clientHeight;
        if (max <= 0) return;
        const frac = editorScroller.scrollTop / max;
        const previewMax = state.previewEl.scrollHeight - state.previewEl.clientHeight;
        if (previewMax <= 0) return;
        state.syncing = true;
        state.previewEl.scrollTop = frac * previewMax;
        requestAnimationFrame(() => { state.syncing = false; });
    });

    state.previewEl.addEventListener('scroll', () => {
        if (state.syncing || state.viewMode !== 'split') return;
        const max = state.previewEl.scrollHeight - state.previewEl.clientHeight;
        if (max <= 0) return;
        const frac = state.previewEl.scrollTop / max;
        const editorMax = editorScroller.scrollHeight - editorScroller.clientHeight;
        if (editorMax <= 0) return;
        state.syncing = true;
        editorScroller.scrollTop = frac * editorMax;
        requestAnimationFrame(() => { state.syncing = false; });
    });
}

// ---------------------------------------------------------------------------
// Autosave
// ---------------------------------------------------------------------------

function scheduleAutosave() {
    if (state.isReadOnly) return;
    if (state.autosaveTimer) clearTimeout(state.autosaveTimer);
    state.autosaveTimer = setTimeout(async () => {
        if (!state.hasUnsavedChanges || !state.currentStory) return;
        try {
            await saveStory();
            showStatus('Auto-saved', 'green');
        } catch (e) {
            console.error('Autosave failed', e);
        }
    }, AUTOSAVE_DELAY_MS);
}

// ---------------------------------------------------------------------------
// CodeMirror setup
// ---------------------------------------------------------------------------

function buildExtensions(initialReadOnly) {
    const baseTheme = EditorView.theme({
        '&': { height: '100%', fontSize: '14px' },
        '.cm-scroller': {
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace',
            lineHeight: '1.55'
        },
        '.cm-content': { padding: '12px 0' },
        '.cm-gutters': { backgroundColor: '#111827', borderRight: '1px solid #1f2937' }
    }, { dark: true });

    return [
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        drawSelection(),
        bracketMatching(),
        highlightActiveLine(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        markdown({ base: markdownLanguage }),
        oneDark,
        baseTheme,
        search({ top: true }),
        keymap.of([...searchKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
        EditorView.lineWrapping,
        state.readOnlyCompartment.of(EditorState.readOnly.of(initialReadOnly)),
        state.editableCompartment.of(EditorView.editable.of(!initialReadOnly)),
        EditorView.updateListener.of((update) => {
            if (update.docChanged) {
                const content = update.state.doc.toString();
                schedulePreview(content);
                updateWordCount(content);
                state.hasUnsavedChanges = content !== state.lastSavedContent;
                updateSaveIndicator();
                scheduleAutosave();
            }
        })
    ];
}

// ---------------------------------------------------------------------------
// Markdown formatting commands
//
// Each handler operates on the active EditorView's current selection(s),
// preserving multi-cursor support via `state.changeByRange`. Inline formatters
// wrap selections; line-level formatters (headings, lists, blockquote) operate
// at line starts so the prefix appears in the right place regardless of where
// the caret sits within the line.
// ---------------------------------------------------------------------------

// Normalize a SelectionRange to a guaranteed-ordered { from, to } pair.
// CodeMirror normally guarantees range.from <= range.to, but defensive
// callers (e.g., after a setContent that maps an inverted selection through
// changes) may end up with anchor>head and unmapped from/to getters. Always
// re-derive min/max to be safe.
function orderedRange(range) {
    const a = range.from;
    const b = range.to;
    if (a <= b) return { from: a, to: b };
    return { from: b, to: a };
}

// Wrap each selection range with `prefix` / `suffix`. If the range is empty
// the prefix+suffix are inserted and the caret is placed between them.
function wrapSelection(view, prefix, suffix = prefix) {
    if (!view) return;
    view.dispatch(view.state.changeByRange(range => {
        const { from, to } = orderedRange(range);
        const text = view.state.sliceDoc(from, to);
        const insert = prefix + text + suffix;
        const innerStart = from + prefix.length;
        const innerEnd = innerStart + text.length;
        return {
            changes: { from, to, insert },
            range: EditorSelection.range(innerStart, innerEnd)
        };
    }));
    view.focus();
}

// Return start/end lines covering every line that any part of `range`
// touches. For an empty selection this is just the current line.
function selectedLineSpan(view, range) {
    const { from, to } = orderedRange(range);
    const startLine = view.state.doc.lineAt(from);
    const endLine = view.state.doc.lineAt(to);
    return { startLine, endLine };
}

// Apply `transform(lineText, lineNumber, indexInSelection)` to every line
// touched by each selection range, replacing the original lines.
function transformLines(view, transform) {
    if (!view) return;
    view.dispatch(view.state.changeByRange(range => {
        const { startLine, endLine } = selectedLineSpan(view, range);
        const lines = [];
        for (let n = startLine.number; n <= endLine.number; n++) {
            lines.push(view.state.doc.line(n));
        }
        const replaced = lines.map((line, i) => transform(line.text, line.number, i)).join('\n');
        const from = startLine.from;
        const to = endLine.to;
        // Preserve a roughly equivalent selection over the replaced span.
        return {
            changes: { from, to, insert: replaced },
            range: EditorSelection.range(from, from + replaced.length)
        };
    }));
    view.focus();
}

// Strip an existing `#`-prefix (any heading level) and a single trailing
// space from a line, so `applyHeading` can re-set the level cleanly.
function stripHeadingPrefix(text) {
    return text.replace(/^(#{1,6})\s+/, '');
}

function applyHeading(view, level) {
    if (!view) return;
    const hashes = '#'.repeat(level);
    transformLines(view, (text) => {
        const stripped = stripHeadingPrefix(text);
        // Toggle: if the line already has exactly this heading level, remove it.
        const match = text.match(/^(#{1,6})\s+/);
        if (match && match[1].length === level) return stripped;
        return `${hashes} ${stripped}`;
    });
}

function applyUnorderedList(view) {
    if (!view) return;
    transformLines(view, (text) => {
        if (/^\s*-\s+/.test(text)) return text.replace(/^(\s*)-\s+/, '$1');
        return `- ${text}`;
    });
}

function applyOrderedList(view) {
    if (!view) return;
    let counter = 0;
    transformLines(view, (text) => {
        // Toggle off if every targeted line already begins with `N. `
        if (/^\s*\d+\.\s+/.test(text)) return text.replace(/^(\s*)\d+\.\s+/, '$1');
        counter += 1;
        return `${counter}. ${text}`;
    });
}

function applyBlockquote(view) {
    if (!view) return;
    transformLines(view, (text) => {
        if (/^>\s?/.test(text)) return text.replace(/^>\s?/, '');
        return `> ${text}`;
    });
}

function applyCodeBlock(view) {
    if (!view) return;
    view.dispatch(view.state.changeByRange(range => {
        const { from, to } = orderedRange(range);
        const text = view.state.sliceDoc(from, to);
        // Always emit fenced block on its own lines, padding with newlines if
        // the surrounding content needs them.
        const before = from > 0 && view.state.sliceDoc(from - 1, from) !== '\n' ? '\n' : '';
        const after = to < view.state.doc.length && view.state.sliceDoc(to, to + 1) !== '\n' ? '\n' : '';
        const insert = `${before}\`\`\`\n${text}${text.endsWith('\n') ? '' : '\n'}\`\`\`${after}`;
        const cursor = from + before.length + 4; // place caret after the opening fence newline
        return {
            changes: { from, to, insert },
            range: EditorSelection.cursor(cursor)
        };
    }));
    view.focus();
}

function applyHorizontalRule(view) {
    if (!view) return;
    view.dispatch(view.state.changeByRange(range => {
        const { from, to } = orderedRange(range);
        const before = from > 0 && view.state.sliceDoc(from - 1, from) !== '\n' ? '\n' : '';
        const insert = `${before}---\n`;
        const pos = from + insert.length;
        return {
            changes: { from, to, insert },
            range: EditorSelection.cursor(pos)
        };
    }));
    view.focus();
}

function applyLink(view) {
    if (!view) return;
    view.dispatch(view.state.changeByRange(range => {
        const { from, to } = orderedRange(range);
        const text = view.state.sliceDoc(from, to);
        if (text.length > 0) {
            // Wrap selection as [text](url) and put caret inside the empty url.
            const insert = `[${text}](url)`;
            const urlStart = from + text.length + 3; // after `[text](`
            const urlEnd = urlStart + 3; // selects `url` placeholder
            return {
                changes: { from, to, insert },
                range: EditorSelection.range(urlStart, urlEnd)
            };
        }
        const insert = '[](url)';
        const urlStart = from + 3; // after `[](`
        const urlEnd = urlStart + 3; // selects `url`
        return {
            changes: { from, to, insert },
            range: EditorSelection.range(urlStart, urlEnd)
        };
    }));
    view.focus();
}

// Public format dispatcher. Wave B-2 (shortcuts) is expected to call this
// same entry point for keyboard bindings.
function format(action) {
    if (state.isReadOnly || !state.view) return;
    switch (action) {
        case 'bold': return wrapSelection(state.view, '**');
        case 'italic': return wrapSelection(state.view, '*');
        case 'inline-code': return wrapSelection(state.view, '`');
        case 'h1': return applyHeading(state.view, 1);
        case 'h2': return applyHeading(state.view, 2);
        case 'h3': return applyHeading(state.view, 3);
        case 'link': return applyLink(state.view);
        case 'ul': return applyUnorderedList(state.view);
        case 'ol': return applyOrderedList(state.view);
        case 'quote': return applyBlockquote(state.view);
        case 'code-block': return applyCodeBlock(state.view);
        case 'hr': return applyHorizontalRule(state.view);
        default:
            console.warn(`editorAPI.format: unknown action "${action}"`);
    }
}

// ---------------------------------------------------------------------------
// DOM construction
// ---------------------------------------------------------------------------

// Each format-toolbar entry: { action, label, title, html? }. `html` lets a
// button render an icon-like glyph (e.g. small SVG-free Unicode marks).
const FORMAT_BUTTONS = [
    { action: 'bold',       label: 'B',     title: 'Bold (Cmd+B)',           extraClass: 'font-bold' },
    { action: 'italic',     label: 'I',     title: 'Italic (Cmd+I)',         extraClass: 'italic' },
    { action: 'h1',         label: 'H1',    title: 'Heading 1' },
    { action: 'h2',         label: 'H2',    title: 'Heading 2' },
    { action: 'h3',         label: 'H3',    title: 'Heading 3' },
    { action: 'link',       label: 'Link',  title: 'Link (Cmd+K)' },
    { action: 'ul',         label: '• List', title: 'Unordered list' },
    { action: 'ol',         label: '1. List', title: 'Ordered list' },
    { action: 'quote',      label: '“ Quote', title: 'Blockquote' },
    { action: 'inline-code', label: '<code>', title: 'Inline code', extraClass: 'font-mono' },
    { action: 'code-block', label: '{ }',   title: 'Code block',             extraClass: 'font-mono' },
    { action: 'hr',         label: '— HR',  title: 'Horizontal rule' }
];

function buildFormatToolbar() {
    const bar = document.createElement('div');
    bar.className = 'flex flex-wrap items-center gap-1 mb-2 p-1 rounded border border-gray-700 bg-gray-800';
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Markdown formatting');

    FORMAT_BUTTONS.forEach(spec => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.formatAction = spec.action;
        btn.title = spec.title;
        btn.setAttribute('aria-label', spec.title);
        btn.className = [
            'px-2 py-1 text-xs rounded border border-gray-700',
            'bg-gray-800 text-gray-200 hover:bg-gray-700',
            'focus:outline-none focus:ring-1 focus:ring-blue-500',
            spec.extraClass || ''
        ].join(' ').trim();
        btn.textContent = spec.label;
        btn.addEventListener('click', (ev) => {
            ev.preventDefault();
            format(spec.action);
        });
        bar.appendChild(btn);
    });

    return bar;
}

function buildDOM(host) {
    host.innerHTML = '';
    host.classList.add('flex', 'flex-col');

    const toolbar = document.createElement('div');
    toolbar.className = 'flex items-center justify-between mb-2 gap-2 flex-wrap';
    toolbar.innerHTML = `
        <div class="flex items-center gap-2 text-sm text-gray-400">
            <span>Markdown</span>
            <span class="text-gray-600">|</span>
            <span class="text-xs text-gray-500" id="editor-filename-display"></span>
        </div>
        <div class="flex items-center gap-1" role="group" aria-label="View mode">
            <button type="button" data-view-mode="source"
                class="px-3 py-1 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600">Source</button>
            <button type="button" data-view-mode="split"
                class="px-3 py-1 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600">Split</button>
            <button type="button" data-view-mode="preview"
                class="px-3 py-1 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600">Preview</button>
        </div>
    `;

    const panes = document.createElement('div');
    panes.className = 'flex flex-1 min-h-0 w-full';

    const sourcePane = document.createElement('div');
    sourcePane.className = 'bg-gray-800 border border-gray-700 rounded-lg overflow-hidden min-h-0';
    sourcePane.style.minWidth = '0';

    const splitter = document.createElement('div');
    splitter.className = 'mx-1 cursor-col-resize bg-gray-700 hover:bg-blue-500 transition rounded';
    splitter.style.width = '6px';
    splitter.style.flex = '0 0 6px';
    splitter.setAttribute('role', 'separator');
    splitter.setAttribute('aria-orientation', 'vertical');

    const previewPane = document.createElement('div');
    previewPane.className = 'bg-gray-800 border border-gray-700 rounded-lg p-4 overflow-y-auto prose prose-invert prose-sm max-w-none min-h-0';
    previewPane.id = 'story-preview';
    previewPane.style.minWidth = '0';

    panes.appendChild(sourcePane);
    panes.appendChild(splitter);
    panes.appendChild(previewPane);

    const formatToolbar = buildFormatToolbar();

    host.appendChild(toolbar);
    host.appendChild(formatToolbar);
    host.appendChild(panes);

    state.toolbar = toolbar;
    state.formatToolbar = formatToolbar;
    state.container = panes;
    state.sourcePane = sourcePane;
    state.splitter = splitter;
    state.previewPane = previewPane;
    state.previewEl = previewPane;

    toolbar.querySelectorAll('[data-view-mode]').forEach(btn => {
        btn.addEventListener('click', () => setViewMode(btn.dataset.viewMode));
    });
}

// ---------------------------------------------------------------------------
// Story lifecycle (open / save / export / delete)
// ---------------------------------------------------------------------------

function fillMetadataFields(story) {
    const titleEl = document.getElementById('editor-title');
    const filenameEl = document.getElementById('editor-filename');
    const filenameDisp = document.getElementById('editor-filename-display');
    if (titleEl) titleEl.textContent = story.title || '';
    if (filenameEl) filenameEl.textContent = story.file || '';
    if (filenameDisp) filenameDisp.textContent = story.file || '';
    const setVal = (id, v) => {
        const el = document.getElementById(id);
        if (el) el.value = v ?? '';
    };
    setVal('meta-status', story.status || 'draft');
    setVal('meta-arc', story.arc || 'forged');
    setVal('meta-date-event', story.date_event || '');
    setVal('meta-medium-url', story.medium_url || '');
    setVal('meta-themes', (story.themes || []).join(', '));
    // Sprint O — O2.1 schema fields
    setVal('meta-people', (story.people || []).join(', '));
    setVal('meta-locations', (story.locations || []).join(', '));
    setVal('meta-related', (story.related_to || []).join(', '));
}

async function openStory(story) {
    if (!story) return;
    state.currentStory = story;

    // Hide all sections, show editor
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    const editorSection = document.getElementById('editor');
    if (editorSection) editorSection.classList.remove('hidden');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('nav-active'));

    fillMetadataFields(story);

    let content = '';
    try {
        const res = await fetch(`/LexDocs/${story.file}`);
        if (res.ok) {
            content = await res.text();
        } else {
            content = `# ${story.title}\n\nStart writing...`;
        }
    } catch (e) {
        console.error('Error loading story:', e);
        content = `# ${story.title}\n\nStart writing...`;
    }

    setContent(content);
    updateWordCount(content);
    state.hasUnsavedChanges = false;
    updateSaveIndicator();
}

function buildFrontmatter(currentStory) {
    const csvToArr = id => (document.getElementById(id)?.value || '').split(',').map(t => t.trim()).filter(Boolean);

    const metadata = {
        title: currentStory.title,
        arc: document.getElementById('meta-arc')?.value || 'forged',
        status: document.getElementById('meta-status')?.value || 'draft',
        date_event: document.getElementById('meta-date-event')?.value || '',
        medium_url: document.getElementById('meta-medium-url')?.value || '',
        themes: csvToArr('meta-themes'),
        // Sprint O — O2.1 schema passthrough fields
        people: csvToArr('meta-people'),
        locations: csvToArr('meta-locations'),
        related_to: csvToArr('meta-related'),
    };

    let fm = '---\n';
    fm += `title: "${metadata.title}"\n`;
    fm += `arc: ${metadata.arc}\n`;
    fm += `status: ${metadata.status}\n`;
    if (metadata.date_event) fm += `date_event: "${metadata.date_event}"\n`;
    if (metadata.medium_url) fm += `medium_url: "${metadata.medium_url}"\n`;
    if (metadata.themes.length) fm += `themes: [${metadata.themes.join(', ')}]\n`;
    if (metadata.people.length) fm += `people: [${metadata.people.join(', ')}]\n`;
    if (metadata.locations.length) fm += `locations: [${metadata.locations.join(', ')}]\n`;
    if (metadata.related_to.length) fm += `related_to: [${metadata.related_to.join(', ')}]\n`;
    fm += `date_written: "${new Date().toISOString().split('T')[0]}"\n`;
    fm += '---\n\n';
    return fm;
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

async function saveStory() {
    if (state.isReadOnly) return;
    if (!state.currentStory) return;

    const content = getContent();
    const frontmatter = buildFrontmatter(state.currentStory);
    const newContent = frontmatter + content.replace(/^---[\s\S]*?---\n*/, '');

    try {
        const res = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: state.currentStory.file, content: newContent })
        });
        if (res.ok) {
            showStatus('Saved!', 'green');
        } else {
            downloadFile(state.currentStory.file, newContent);
            showStatus('Downloaded (save manually)', 'yellow');
        }
    } catch (e) {
        downloadFile(state.currentStory.file, newContent);
        showStatus('Downloaded (save manually)', 'yellow');
    }

    // Update lastSavedContent to the editor's current text (without our frontmatter
    // rewrite) so input handlers compare against the live document.
    state.lastSavedContent = getContent();
    state.hasUnsavedChanges = false;
    updateSaveIndicator();
}

function exportForMedium() {
    if (!state.currentStory) return;
    const content = getContent();
    let cleanContent = stripFrontmatter(content);
    cleanContent += '\n\n---\n\n*This is part of my series documenting the journey from farm to tech to sustainable energy. Follow along at [@shawncutter](https://medium.com/@shawncutter).*';
    downloadFile(state.currentStory.file.replace('.md', '-medium.md'), cleanContent);
    showStatus('Exported for Medium', 'green');
}

async function deleteStory() {
    if (state.isReadOnly) return;
    if (!state.currentStory) return;
    if (!confirm(`Delete "${state.currentStory.title}"? This cannot be undone.`)) return;

    try {
        const res = await fetch('/api/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: state.currentStory.file })
        });
        if (res.ok) {
            showStatus('Story deleted!', 'green');
            setTimeout(() => {
                state.hasUnsavedChanges = false;
                state.currentStory = null;
                document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
                const stories = document.getElementById('stories');
                if (stories) stories.classList.remove('hidden');
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('nav-active'));
                document.querySelector('[data-section="stories"]')?.classList.add('nav-active');
                if (typeof window.loadData === 'function') window.loadData();
            }, 1000);
        } else {
            showStatus('Error deleting story', 'red');
        }
    } catch (e) {
        showStatus('Error deleting story', 'red');
    }
}

function backToStories() {
    if (state.hasUnsavedChanges && !confirm('You have unsaved changes. Leave anyway?')) return;
    state.hasUnsavedChanges = false;
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById('stories')?.classList.remove('hidden');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('nav-active'));
    document.querySelector('[data-section="stories"]')?.classList.add('nav-active');
}

// ---------------------------------------------------------------------------
// Read/write helpers
// ---------------------------------------------------------------------------

function getContent() {
    if (!state.view) return '';
    return state.view.state.doc.toString();
}

function setContent(text) {
    if (!state.view) return;
    const doc = typeof text === 'string' ? text : '';
    state.view.dispatch({
        changes: { from: 0, to: state.view.state.doc.length, insert: doc }
    });
    state.lastSavedContent = doc;
    if (state.autosaveTimer) {
        clearTimeout(state.autosaveTimer);
        state.autosaveTimer = null;
    }
    state.hasUnsavedChanges = false;
    renderPreview(doc);
    updateWordCount(doc);
    updateSaveIndicator();
}

function setReadOnly(flag) {
    state.isReadOnly = !!flag;
    if (state.view) {
        state.view.dispatch({
            effects: [
                state.readOnlyCompartment.reconfigure(
                    EditorState.readOnly.of(state.isReadOnly)
                ),
                state.editableCompartment.reconfigure(
                    EditorView.editable.of(!state.isReadOnly)
                )
            ]
        });
    }
    // In read-only mode hide the toolbar, force preview-only view, and clear
    // any pending autosave timer (per S1.1 acceptance: no toolbar, no save,
    // no autosave when IS_STATIC).
    if (state.toolbar) {
        state.toolbar.style.display = state.isReadOnly ? 'none' : '';
    }
    // The formatting toolbar is purely an editing affordance — hide it in
    // read-only mode and let `updateFormatToolbarVisibility` manage it
    // otherwise (it accounts for view-mode = preview).
    updateFormatToolbarVisibility();
    if (state.isReadOnly) {
        if (state.autosaveTimer) {
            clearTimeout(state.autosaveTimer);
            state.autosaveTimer = null;
        }
        setViewMode('preview');
    }
}

function focusEditor() { if (state.view) state.view.focus(); }

// ---------------------------------------------------------------------------
// Wiring (buttons + keyboard + beforeunload)
// ---------------------------------------------------------------------------

function wireUI() {
    document.getElementById('btn-save')?.addEventListener('click', saveStory);
    // Medium export wiring moved to web/export-menu.js (S2.5);
    // editorAPI.exportForMedium() remains exposed for the menu's "Medium" button.
    document.getElementById('btn-delete-story')?.addEventListener('click', deleteStory);
    document.getElementById('back-to-stories')?.addEventListener('click', backToStories);

    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
            const editorSection = document.getElementById('editor');
            if (state.currentStory && editorSection && !editorSection.classList.contains('hidden')) {
                e.preventDefault();
                saveStory();
            }
        }
        if (e.key === 'Escape') {
            const modal = document.getElementById('new-story-modal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        }
    });

    window.addEventListener('beforeunload', (e) => {
        if (state.hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

async function init(options = {}) {
    if (state.initialized) return window.editorAPI;

    const host = typeof options.host === 'string'
        ? document.querySelector(options.host)
        : options.host;
    if (!host) throw new Error('editorAPI.init: host element not found');

    loadPreferences();
    buildDOM(host);

    state.isReadOnly = !!options.readOnly;
    state.lastSavedContent = '';

    state.view = new EditorView({
        state: EditorState.create({
            doc: '',
            extensions: buildExtensions(state.isReadOnly)
        }),
        parent: state.sourcePane
    });

    attachSplitterDrag();
    attachSyncScroll();
    applyLayout();
    renderPreview('');
    wireUI();

    // Apply read-only side effects (toolbar hide + preview-only) consistently
    // through the same code path used at runtime.
    if (state.isReadOnly) setReadOnly(true);

    state.initialized = true;
    return window.editorAPI;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

window.editorAPI = {
    init,
    openStory,
    saveStory,
    exportForMedium,
    deleteStory,
    backToStories,
    getContent,
    setContent,
    setReadOnly,
    focus: focusEditor,
    setViewMode,
    format,
    openSearch: () => {
        if (!state.view) return false;
        openSearchPanel(state.view);
        return true;
    },
    closeSearch: () => {
        if (!state.view) return false;
        closeSearchPanel(state.view);
        return true;
    },
    get isReadOnly() { return state.isReadOnly; },
    get viewMode() { return state.viewMode; },
    get hasUnsavedChanges() { return state.hasUnsavedChanges; },
    get currentStory() { return state.currentStory; }
};

// Provide a global openStory shim (legacy callers in index.html invoke
// `openStory(...)` directly, including via inline onclick attributes).
window.openStory = (story) => openStory(story);

export default window.editorAPI;
