/* Cross-story search panel + Cmd+F / Cmd+Shift+F shortcuts (S1.4)
 *
 * Extracted from web/index.html in Wave B-4 (S1.5 cleanup).
 *
 * Exposes:
 *   window.crossSearchAPI = { open, close, isOpen }
 *
 * Depends on (loaded earlier in the page):
 *   - window.editorAPI.openSearch()  (CodeMirror in-doc Cmd+F)
 *   - window.editorAPI.openStory()   (open a story from a search result)
 *   - window.allStories (optional; falls back to a synthesized {file, title, arc})
 *
 * Behavior:
 *   - Cmd+Shift+F: opens cross-story modal (fetches /api/search)
 *   - Cmd+F when editor is open: opens CodeMirror's in-doc search panel
 *   - In static deploy (book.shawncutter.com): cross-story modal still opens
 *     but shows a "use Cmd+F instead" notice rather than firing a fetch.
 */
(function setupCrossSearch() {
    const isStatic = window.location.hostname !== 'localhost' &&
                     window.location.hostname !== '127.0.0.1';

    let modal = null;
    let inputEl = null;
    let resultsEl = null;
    let countEl = null;
    let debounceTimer = null;

    function buildModal() {
        if (modal) return modal;
        const el = document.createElement('div');
        el.id = 'cross-search-modal';
        el.className = 'fixed inset-0 bg-black bg-opacity-70 z-50 hidden flex items-start justify-center pt-20';
        el.innerHTML = `
            <div class="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-3xl max-h-[70vh] flex flex-col mx-4 shadow-xl">
                <div class="p-4 border-b border-gray-700 flex items-center gap-3">
                    <span class="text-gray-400">🔎</span>
                    <input id="cross-search-input" type="text"
                        placeholder="Search across all stories…"
                        class="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    <span id="cross-search-count" class="text-xs text-gray-500"></span>
                    <button id="cross-search-close" class="text-gray-400 hover:text-white text-xl px-2" aria-label="Close">&times;</button>
                </div>
                <div id="cross-search-results" class="overflow-y-auto p-2 flex-1">
                    <div class="text-sm text-gray-500 p-4">Type to search across ${isStatic ? 'all stories (static mode — limited)' : 'all stories'}…</div>
                </div>
            </div>
        `;
        document.body.appendChild(el);

        inputEl = el.querySelector('#cross-search-input');
        resultsEl = el.querySelector('#cross-search-results');
        countEl = el.querySelector('#cross-search-count');

        el.querySelector('#cross-search-close').addEventListener('click', close);
        el.addEventListener('click', (e) => { if (e.target === el) close(); });
        inputEl.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(runSearch, 250);
        });

        modal = el;
        return el;
    }

    async function runSearch() {
        const q = inputEl.value.trim();
        if (!q) {
            resultsEl.innerHTML = '<div class="text-sm text-gray-500 p-4">Type to search…</div>';
            countEl.textContent = '';
            return;
        }
        if (isStatic) {
            resultsEl.innerHTML = '<div class="text-sm text-yellow-500 p-4">Cross-story search unavailable in static/deployed mode. Use Cmd+F to search within the current story.</div>';
            countEl.textContent = '';
            return;
        }
        resultsEl.innerHTML = '<div class="text-sm text-gray-500 p-4">Searching…</div>';
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=100`);
            if (!res.ok) {
                resultsEl.innerHTML = `<div class="text-sm text-red-400 p-4">Search failed (${res.status})</div>`;
                return;
            }
            const data = await res.json();
            renderResults(data, q);
        } catch (e) {
            resultsEl.innerHTML = `<div class="text-sm text-red-400 p-4">${e.message}</div>`;
        }
    }

    function renderResults(data, q) {
        countEl.textContent = `${data.count} match${data.count === 1 ? '' : 'es'}`;
        if (!data.results.length) {
            resultsEl.innerHTML = '<div class="text-sm text-gray-500 p-4">No matches.</div>';
            return;
        }
        const needle = q.toLowerCase();
        const html = data.results.map(r => {
            const idx = r.snippet.toLowerCase().indexOf(needle);
            let snippet = r.snippet;
            if (idx >= 0) {
                const before = r.snippet.slice(0, idx);
                const match = r.snippet.slice(idx, idx + q.length);
                const after = r.snippet.slice(idx + q.length);
                snippet = `${escapeHtml(before)}<mark class="bg-yellow-600 text-black px-0.5 rounded">${escapeHtml(match)}</mark>${escapeHtml(after)}`;
            } else {
                snippet = escapeHtml(r.snippet);
            }
            return `
                <div class="cross-search-result px-3 py-2 hover:bg-gray-700 rounded cursor-pointer"
                     data-file="${escapeAttr(r.file)}" data-line="${r.line}">
                    <div class="text-sm font-semibold text-white">${escapeHtml(r.title)}</div>
                    <div class="text-xs text-gray-500 mb-1">${escapeHtml(r.file)}:${r.line}</div>
                    <div class="text-sm text-gray-300 font-mono">${snippet}</div>
                </div>
            `;
        }).join('');
        resultsEl.innerHTML = html;
        resultsEl.querySelectorAll('.cross-search-result').forEach(node => {
            node.addEventListener('click', () => {
                const file = node.dataset.file;
                const story = (window.allStories || []).find(s => s.file === file)
                    || { file, title: file.split('/').pop(), arc: 'forged' };
                close();
                if (window.editorAPI && window.editorAPI.openStory) {
                    window.editorAPI.openStory(story);
                }
            });
        });
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]));
    }
    function escapeAttr(s) { return escapeHtml(s); }

    function open() {
        buildModal();
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        inputEl.focus();
        inputEl.select();
    }
    function close() {
        if (!modal) return;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    window.crossSearchAPI = { open, close };
})();

(function wireFindShortcuts() {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    document.addEventListener('keydown', (e) => {
        const mod = isMac ? e.metaKey : e.ctrlKey;
        if (!mod) return;
        // Cmd+Shift+F: cross-story search
        if (e.shiftKey && (e.key === 'F' || e.key === 'f')) {
            e.preventDefault();
            e.stopPropagation();
            if (window.crossSearchAPI) window.crossSearchAPI.open();
            return;
        }
        // Cmd+F: in-doc search (only when editor is the active context)
        if (!e.shiftKey && (e.key === 'f' || e.key === 'F')) {
            const editorOpen = document.getElementById('editor') &&
                               !document.getElementById('editor').classList.contains('hidden');
            if (editorOpen && window.editorAPI && window.editorAPI.openSearch) {
                e.preventDefault();
                e.stopPropagation();
                window.editorAPI.openSearch();
            }
        }
    }, true);
})();
