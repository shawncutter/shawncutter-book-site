/* Export menu (S2.5). Replaces the single "Export for Medium" button with
 * a small panel offering format × scope. Lives in the editor toolbar.
 *
 * Scope:
 *   story  →  current open story
 *   arc    →  current open story's arc
 *   all    →  full manuscript
 *
 * Formats:
 *   docx     →  GET /api/export/docx?scope=&template=&includeIdeas=
 *   pdf      →  GET /api/export/pdf?scope=&template=&includeIdeas=
 *   markdown →  download raw .md (current story only — manuscript markdown
 *               isn't a thing yet)
 *   medium   →  delegate to window.editorAPI.exportForMedium()
 *
 * In static mode, server-side formats degrade gracefully: clicking Word/PDF
 * shows a notice instead of firing a 404.
 */
(function setupExportMenu() {
    const IS_STATIC = window.location.hostname !== 'localhost' &&
                      window.location.hostname !== '127.0.0.1';

    const btn = document.getElementById('btn-export-menu');
    const panel = document.getElementById('export-menu-panel');
    if (!btn || !panel) return;

    const statusEl = document.getElementById('export-status');
    const statusText = document.getElementById('export-status-text');
    const includeIdeasEl = document.getElementById('export-include-ideas');
    const templateEl = document.getElementById('export-template');

    let activeScope = 'story';
    setActiveScope('story');
    if (!IS_STATIC) populateTemplateOptions();

    async function populateTemplateOptions() {
        try {
            const res = await fetch('/api/export/templates');
            if (!res.ok) return;
            const data = await res.json();
            if (!data.templates?.length || !templateEl) return;
            const current = templateEl.value;
            templateEl.innerHTML = '';
            for (const t of data.templates) {
                const opt = document.createElement('option');
                opt.value = t.name;
                opt.textContent = t.name;
                templateEl.appendChild(opt);
            }
            if (current && data.templates.find(t => t.name === current)) {
                templateEl.value = current;
            }
        } catch { /* fall back to hardcoded options in HTML */ }
    }

    function setActiveScope(scope) {
        activeScope = scope;
        document.querySelectorAll('.export-scope-btn').forEach(b => {
            const isActive = b.dataset.scope === scope;
            b.classList.toggle('bg-blue-700', isActive);
            b.classList.toggle('hover:bg-blue-600', isActive);
            b.classList.toggle('bg-gray-700', !isActive);
            b.classList.toggle('hover:bg-gray-600', !isActive);
        });
    }

    function showStatus(msg, kind) {
        statusEl.classList.remove('hidden');
        statusEl.classList.toggle('text-red-400', kind === 'error');
        statusEl.classList.toggle('text-yellow-400', kind === 'warn');
        statusEl.classList.toggle('text-gray-400', !kind);
        statusText.textContent = msg;
    }
    function clearStatus() {
        statusEl.classList.add('hidden');
        statusText.textContent = '';
    }

    function open() {
        panel.classList.remove('hidden');
        clearStatus();
    }
    function close() {
        panel.classList.add('hidden');
    }
    function toggle() {
        panel.classList.contains('hidden') ? open() : close();
    }

    // Resolve which scope query string to send for the chosen scope toggle.
    function resolveScope() {
        const story = window.editorAPI?.currentStory;
        if (activeScope === 'all') return 'all';
        if (activeScope === 'arc') {
            const arc = story?.arc;
            if (!arc) return null;
            return `arc:${arc}`;
        }
        // 'story'
        if (!story?.file) return null;
        return `story:${story.file}`;
    }

    async function downloadServerExport(format) {
        const scope = resolveScope();
        if (!scope) {
            showStatus('No story is open. Pick "Manuscript" or open a story first.', 'warn');
            return;
        }
        if (IS_STATIC) {
            showStatus('Server-side export unavailable in deployed mode. Try Markdown or Medium.', 'warn');
            return;
        }

        const params = new URLSearchParams({
            scope,
            includeIdeas: includeIdeasEl?.checked ? 'true' : 'false',
            template: templateEl?.value || 'memoir',
        });
        const url = `/api/export/${format}?${params.toString()}`;

        showStatus(`Compiling ${format.toUpperCase()}…`);
        try {
            const res = await fetch(url);
            if (!res.ok) {
                const err = await res.json().catch(() => ({ error: res.statusText }));
                showStatus(`Export failed: ${err.error || res.status}`, 'error');
                return;
            }
            const blob = await res.blob();
            const cd = res.headers.get('Content-Disposition') || '';
            const fnameMatch = cd.match(/filename="?([^"]+)"?/);
            const filename = fnameMatch ? fnameMatch[1] : `p2l-export.${format}`;
            triggerDownload(blob, filename);
            showStatus(`Downloaded ${filename}`);
            setTimeout(clearStatus, 2500);
        } catch (e) {
            showStatus(`Network error: ${e.message}`, 'error');
        }
    }

    async function downloadMarkdown() {
        const story = window.editorAPI?.currentStory;
        if (!story?.file) {
            showStatus('No story is open.', 'warn');
            return;
        }
        if (activeScope !== 'story') {
            showStatus('Markdown export is single-story only.', 'warn');
            return;
        }
        showStatus('Preparing Markdown…');
        try {
            const res = await fetch(`/LexDocs/${story.file}`);
            if (!res.ok) {
                showStatus(`Fetch failed: ${res.status}`, 'error');
                return;
            }
            const text = await res.text();
            const filename = story.file.split('/').pop();
            triggerDownload(new Blob([text], { type: 'text/markdown' }), filename);
            clearStatus();
        } catch (e) {
            showStatus(`Network error: ${e.message}`, 'error');
        }
    }

    function exportMedium() {
        if (activeScope !== 'story') {
            showStatus('Medium export is single-story only.', 'warn');
            return;
        }
        if (typeof window.editorAPI?.exportForMedium === 'function') {
            window.editorAPI.exportForMedium();
            showStatus('Medium-formatted markdown downloaded');
            setTimeout(clearStatus, 2000);
        } else {
            showStatus('Medium export not available.', 'error');
        }
    }

    function triggerDownload(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ---- Wire DOM ---------------------------------------------------------
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggle();
    });

    // Click outside the panel closes it
    document.addEventListener('click', (e) => {
        if (panel.classList.contains('hidden')) return;
        if (panel.contains(e.target) || btn.contains(e.target)) return;
        close();
    });

    document.querySelectorAll('.export-scope-btn').forEach(b => {
        b.addEventListener('click', () => setActiveScope(b.dataset.scope));
    });

    document.querySelectorAll('.export-format-btn').forEach(b => {
        b.addEventListener('click', () => {
            const fmt = b.dataset.format;
            if (fmt === 'markdown') return downloadMarkdown();
            if (fmt === 'medium')   return exportMedium();
            return downloadServerExport(fmt);
        });
    });

})();
