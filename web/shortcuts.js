/**
 * web/shortcuts.js
 *
 * Comprehensive keyboard shortcut layer for the P2L BookWriter dashboard.
 * Closes backlog-005 (system-wide shortcuts) and backlog-008 (help modal).
 *
 * Public API:
 *   window.shortcutsAPI.init()         // bootstrap; idempotent
 *   window.shortcutsAPI.openHelp()     // show help modal
 *   window.shortcutsAPI.closeHelp()    // close help modal
 *   window.shortcutsAPI.isHelpOpen()
 *
 * Design notes:
 * - Vanilla JS, no framework, no build step.
 * - Wave A's editor.js (window.editorAPI) may or may not be present.
 *   When present, we delegate to its methods. When absent, we fall back to
 *   DOM-driven legacy actions (clicking #btn-save, #btn-new-story, etc.) so
 *   the worktree works in isolation and after merges.
 * - Wave B-1 (toolbar) may add editorAPI.format(action). We probe for it; if
 *   missing, format shortcuts no-op gracefully (no errors, no preventDefault).
 * - Wave B-3 (find/replace) owns Cmd+F and Cmd+Shift+F. We do not bind those.
 * - Static-mode aware: when isStaticMode() is true (deployed at
 *   book.shawncutter.com), only navigation shortcuts (Esc, Cmd+/, Cmd+P)
 *   are registered. Editing shortcuts (Cmd+S/N/E/B/I/1/2/3) are skipped.
 * - Listener attached at the document level in CAPTURE phase so that we
 *   reliably preventDefault browser shortcuts (Cmd+S, Cmd+P) before any
 *   embedded editor (CodeMirror, textarea) sees them.
 */
(function () {
    'use strict';

    // ---------------------------------------------------------------------
    // Platform detection
    // ---------------------------------------------------------------------
    const IS_MAC = /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent || '');
    const MOD_LABEL = IS_MAC ? 'Cmd' : 'Ctrl';

    /**
     * True if the modifier (Cmd on Mac, Ctrl elsewhere) is the only
     * primary modifier pressed. Allows Shift to be combined; rejects Alt.
     */
    function hasPrimaryMod(e) {
        if (IS_MAC) return e.metaKey && !e.ctrlKey;
        return e.ctrlKey && !e.metaKey;
    }

    // ---------------------------------------------------------------------
    // Static-mode detection (matches index.html IS_STATIC heuristic).
    // We re-derive rather than reading the inline IS_STATIC const because
    // that const lives inside an IIFE-style script block.
    // ---------------------------------------------------------------------
    function isStaticMode() {
        const host = window.location.hostname;
        return host !== 'localhost' && host !== '127.0.0.1';
    }

    // ---------------------------------------------------------------------
    // Focus filtering: skip shortcuts when typing in dialog inputs.
    // The CodeMirror editor (when Wave A lands) lives inside .CodeMirror
    // and has its own keymap; we still want Cmd+S/B/I to fire there, so we
    // treat CodeMirror as "editor", NOT as "dialog input".
    // ---------------------------------------------------------------------
    function isInDialogInput() {
        const el = document.activeElement;
        if (!el) return false;
        const tag = el.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && el.isContentEditable !== true) {
            return false;
        }
        // The story editor textarea is fair game for editing shortcuts.
        if (el.id === 'story-editor') return false;
        // CodeMirror surfaces — leave editing shortcuts active.
        if (el.closest && el.closest('.CodeMirror, .cm-editor, [data-editor-root]')) {
            return false;
        }
        return true;
    }

    // ---------------------------------------------------------------------
    // editorAPI probe + safe delegators
    // ---------------------------------------------------------------------
    function api() {
        return (typeof window !== 'undefined' && window.editorAPI) || null;
    }

    function callIfFn(obj, name, ...args) {
        if (obj && typeof obj[name] === 'function') {
            try { return obj[name](...args); } catch (err) {
                console.error('[shortcuts] editorAPI.' + name + ' threw:', err);
            }
        }
        return undefined;
    }

    // ---------------------------------------------------------------------
    // Action handlers
    // ---------------------------------------------------------------------
    function actionSave() {
        const a = api();
        if (a && typeof a.saveStory === 'function') {
            callIfFn(a, 'saveStory');
            return true;
        }
        // Fallback: legacy save button (existing inline handler in index.html
        // will also fire on Cmd+S, but clicking is idempotent enough).
        const btn = document.getElementById('btn-save');
        if (btn && btn.offsetParent !== null) {
            btn.click();
            return true;
        }
        return false;
    }

    function actionNewStory() {
        // Always trigger via the existing button — preserves whatever flow
        // the page currently uses (modal open, focus on title input, etc.).
        const btn = document.getElementById('btn-new-story');
        if (btn && btn.offsetParent !== null) {
            btn.click();
            return true;
        }
        return false;
    }

    function actionExport() {
        const a = api();
        if (a && typeof a.exportForMedium === 'function') {
            callIfFn(a, 'exportForMedium');
            return true;
        }
        const btn = document.getElementById('btn-medium-export');
        if (btn && btn.offsetParent !== null) {
            btn.click();
            return true;
        }
        return false;
    }

    function actionFormat(kind) {
        const a = api();
        if (a && typeof a.format === 'function') {
            callIfFn(a, 'format', kind);
            return true;
        }
        // No-op gracefully when Wave B-1 hasn't merged yet.
        return false;
    }

    function actionTogglePreview() {
        const a = api();
        if (a && typeof a.setViewMode === 'function') {
            const current = (typeof a.viewMode === 'function') ? a.viewMode() : a.viewMode;
            // Cycle: anything-but-preview -> preview ; preview -> split.
            const next = (current === 'preview') ? 'split' : 'preview';
            callIfFn(a, 'setViewMode', next);
            return true;
        }
        // Without Wave A's editor module there's no formal split-pane.
        // No-op gracefully — user can still see the existing preview pane.
        return false;
    }

    // ---------------------------------------------------------------------
    // Help modal
    // ---------------------------------------------------------------------
    const HELP_MODAL_ID = 'shortcuts-help-modal';

    // showInStatic: true = render this group even on the static deployment
    //                       (where editing shortcuts are inactive)
    const SHORTCUT_GROUPS = [
        {
            heading: 'Editing',
            showInStatic: false,
            entries: [
                { keys: ['Mod', 'S'], label: 'Save story' },
                { keys: ['Mod', 'N'], label: 'New story' },
                { keys: ['Mod', 'E'], label: 'Export current story (for Medium)' },
                { keys: ['Mod', 'B'], label: 'Bold' },
                { keys: ['Mod', 'I'], label: 'Italic' },
                { keys: ['Mod', '1'], label: 'Heading 1' },
                { keys: ['Mod', '2'], label: 'Heading 2' },
                { keys: ['Mod', '3'], label: 'Heading 3' }
            ]
        },
        {
            heading: 'Find',
            showInStatic: false,
            entries: [
                { keys: ['Mod', 'F'], label: 'Find in document' },
                { keys: ['Mod', 'Shift', 'F'], label: 'Find across all stories' }
            ]
        },
        {
            heading: 'View',
            showInStatic: true,
            entries: [
                { keys: ['Mod', 'P'], label: 'Toggle preview / split view' }
            ]
        },
        {
            heading: 'Navigation',
            showInStatic: true,
            entries: [
                { keys: ['Mod', '/'], label: 'Show this shortcuts help' },
                { keys: ['Esc'], label: 'Close any open modal' }
            ]
        }
    ];

    function renderKeyChip(label) {
        const text = (label === 'Mod') ? MOD_LABEL : label;
        return '<kbd class="px-2 py-0.5 mx-0.5 bg-gray-700 border border-gray-600 rounded text-xs font-mono text-gray-100">'
            + text + '</kbd>';
    }

    function renderShortcutRow(entry) {
        const keysHtml = entry.keys.map(renderKeyChip).join(
            '<span class="text-gray-500 mx-0.5">+</span>'
        );
        const hint = entry.hint
            ? ' <span class="text-xs text-gray-500 ml-2">' + entry.hint + '</span>'
            : '';
        return '<div class="flex items-center justify-between py-1.5 border-b border-gray-700/50 last:border-b-0">'
            +     '<span class="text-sm text-gray-300">' + entry.label + hint + '</span>'
            +     '<span class="flex items-center">' + keysHtml + '</span>'
            +   '</div>';
    }

    function renderShortcutGroup(group, includeEditing) {
        if (!includeEditing && !group.showInStatic) return '';
        return '<div class="mb-5">'
            +    '<h4 class="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">'
            +      group.heading
            +    '</h4>'
            +    '<div>' + group.entries.map(renderShortcutRow).join('') + '</div>'
            +  '</div>';
    }

    function buildHelpModal() {
        let modal = document.getElementById(HELP_MODAL_ID);
        if (modal) return modal;

        const includeEditing = !isStaticMode();
        const inner = SHORTCUT_GROUPS.map(g => renderShortcutGroup(g, includeEditing)).join('');

        modal = document.createElement('div');
        modal.id = HELP_MODAL_ID;
        modal.className = 'fixed inset-0 bg-black bg-opacity-60 hidden items-center justify-center z-[60]';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', HELP_MODAL_ID + '-title');
        modal.innerHTML =
            '<div class="bg-gray-800 rounded-lg p-6 w-full max-w-lg border border-gray-700 shadow-2xl max-h-[85vh] overflow-y-auto">'
          +   '<div class="flex items-center justify-between mb-4">'
          +     '<h3 id="' + HELP_MODAL_ID + '-title" class="text-xl font-bold text-gray-100">Keyboard Shortcuts</h3>'
          +     '<button type="button" data-shortcuts-close '
          +             'class="text-gray-400 hover:text-gray-100 text-2xl leading-none px-2"'
          +             ' aria-label="Close">&times;</button>'
          +   '</div>'
          +   '<div class="text-gray-200">' + inner + '</div>'
          +   '<div class="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-500">'
          +     'Tip: Press ' + renderKeyChip('Esc') + ' or click outside to close.'
          +   '</div>'
          + '</div>';

        // Click outside (on backdrop) closes
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeHelp();
        });
        const closeBtn = modal.querySelector('[data-shortcuts-close]');
        if (closeBtn) closeBtn.addEventListener('click', closeHelp);

        document.body.appendChild(modal);
        return modal;
    }

    function isHelpOpen() {
        const modal = document.getElementById(HELP_MODAL_ID);
        return !!(modal && !modal.classList.contains('hidden'));
    }

    function openHelp() {
        const modal = buildHelpModal();
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        // Move focus into modal for accessibility
        const closeBtn = modal.querySelector('[data-shortcuts-close]');
        if (closeBtn) closeBtn.focus();
    }

    function closeHelp() {
        const modal = document.getElementById(HELP_MODAL_ID);
        if (!modal) return;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    // ---------------------------------------------------------------------
    // Esc handling: close any visible modal (help + any other .fixed modal
    // that uses the hidden/flex toggle convention used elsewhere in the app).
    // ---------------------------------------------------------------------
    function closeAnyOpenModal() {
        let closedSomething = false;

        if (isHelpOpen()) {
            closeHelp();
            closedSomething = true;
        }

        // Other modals follow the convention: <div class="fixed inset-0 ... hidden|flex ...">
        // We close any that are currently shown (have 'flex', not 'hidden').
        document.querySelectorAll('div.fixed.inset-0').forEach((modal) => {
            if (modal.id === HELP_MODAL_ID) return; // already handled
            if (modal.classList.contains('flex') && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                closedSomething = true;
            }
        });

        return closedSomething;
    }

    // ---------------------------------------------------------------------
    // Master keydown handler
    // ---------------------------------------------------------------------
    function handleKeyDown(e) {
        // Esc is universal: works regardless of focus, regardless of static mode.
        if (e.key === 'Escape') {
            if (closeAnyOpenModal()) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
            }
            return;
        }

        // If the user is typing in a dialog text input, do not steal keystrokes.
        if (isInDialogInput()) return;

        const isStatic = isStaticMode();

        // Cmd+/  -> help modal (always available)
        // Browser default: none meaningful, but preventDefault is harmless.
        if (hasPrimaryMod(e) && (e.key === '/' || e.key === '?')) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
            if (isHelpOpen()) closeHelp();
            else openHelp();
            return;
        }

        // Cmd+P  -> toggle preview / split (always available; pre-empts print)
        if (hasPrimaryMod(e) && !e.shiftKey && (e.key === 'p' || e.key === 'P')) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
            actionTogglePreview();
            return;
        }

        // The remaining shortcuts are editing-only — skip them in static mode.
        if (isStatic) return;

        // Cmd+F / Cmd+Shift+F  -> reserved for Wave B-3 (find/replace).
        // Don't handle them. We also don't preventDefault, so the browser's
        // native find still works until B-3 lands.

        // Cmd+S  -> save
        // When Wave A's editorAPI is present, we own this shortcut fully.
        // When it isn't, defer to the legacy inline handler (which performs
        // post-save state cleanup like resetting hasUnsavedChanges) by
        // letting the event bubble — we still preventDefault to suppress
        // the browser's "Save Page As" dialog.
        if (hasPrimaryMod(e) && !e.shiftKey && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            if (api() && typeof api().saveStory === 'function') {
                e.stopPropagation();
                if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
                actionSave();
            }
            return;
        }

        // Cmd+N  -> new story
        // (Cmd+N opens a new browser window by default. We override.)
        if (hasPrimaryMod(e) && !e.shiftKey && (e.key === 'n' || e.key === 'N')) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
            actionNewStory();
            return;
        }

        // Cmd+E  -> export for medium
        if (hasPrimaryMod(e) && !e.shiftKey && (e.key === 'e' || e.key === 'E')) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
            actionExport();
            return;
        }

        // Cmd+B  -> bold (delegates; no-op if no toolbar yet)
        if (hasPrimaryMod(e) && !e.shiftKey && (e.key === 'b' || e.key === 'B')) {
            const handled = actionFormat('bold');
            if (handled) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
            }
            return;
        }

        // Cmd+I  -> italic (delegates; no-op if no toolbar yet)
        if (hasPrimaryMod(e) && !e.shiftKey && (e.key === 'i' || e.key === 'I')) {
            const handled = actionFormat('italic');
            if (handled) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
            }
            return;
        }

        // Cmd+1 / 2 / 3  -> headings
        if (hasPrimaryMod(e) && !e.shiftKey && (e.key === '1' || e.key === '2' || e.key === '3')) {
            const handled = actionFormat('h' + e.key);
            if (handled) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
            }
            return;
        }
    }

    // ---------------------------------------------------------------------
    // Init
    // ---------------------------------------------------------------------
    let initialized = false;
    function init() {
        if (initialized) return;
        initialized = true;
        // Capture phase so we beat editor (CodeMirror, textarea) handlers
        // and reliably preventDefault browser shortcuts.
        document.addEventListener('keydown', handleKeyDown, true);
    }

    // ---------------------------------------------------------------------
    // Public API
    // ---------------------------------------------------------------------
    window.shortcutsAPI = {
        init: init,
        openHelp: openHelp,
        closeHelp: closeHelp,
        isHelpOpen: isHelpOpen,
        // Exposed for ad-hoc testing
        _platformLabel: MOD_LABEL,
        _isStaticMode: isStaticMode
    };
})();
