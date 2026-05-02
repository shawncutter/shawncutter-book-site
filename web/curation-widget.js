/**
 * P2L BookWriter — Curation Widget + Theme Editor Drawer (Sprint O3)
 *
 * Task 1: Curation Backlog card on the Topics page.
 *   Reads window.topicsData.validation and shows counts with filter shortcuts.
 *   Collapsible, collapsed by default, state persisted to localStorage.
 *   "Curate →" filters All Themes to themes missing descriptions.
 *   "Review →" filters All Themes to auto-added themes.
 *
 * Task 2: Theme editor drawer.
 *   Long-press (>500ms) OR gear-icon click on any theme card opens a
 *   slide-in drawer on the right side. The drawer lets the author edit
 *   description, arc_focus, and related_themes for a theme, then saves
 *   via POST /api/topics.
 *
 * Public API exposed as window.curationWidget = { render() }.
 * render() is idempotent — calling it a second time re-renders.
 */
(function () {
    'use strict';

    // -----------------------------------------------------------------------
    // Constants
    // -----------------------------------------------------------------------
    const STORAGE_KEY_COLLAPSED = 'p2l.curation.backlogCollapsed';
    const ARC_OPTIONS = ['forged', 'fractured', 'forging', 'foundry'];

    // -----------------------------------------------------------------------
    // Curation filter state
    // -----------------------------------------------------------------------
    // Tracks which curation filter is active: null | 'needs-description' | 'auto-added'
    let activeCurationFilter = null;

    // -----------------------------------------------------------------------
    // Utility: safely escape text for HTML insertion
    // -----------------------------------------------------------------------
    function esc(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // -----------------------------------------------------------------------
    // Task 1 — Curation Backlog card
    // -----------------------------------------------------------------------

    function render() {
        const topicsData = window.topicsData;
        if (!topicsData) return;

        // Remove any old render
        const oldCard = document.getElementById('curation-backlog-card');
        if (oldCard) oldCard.remove();

        // Anchor: insert before the "Themes by Arc" hero section, which is
        // the first direct child div of #topics after the header row.
        const topicsSection = document.getElementById('topics');
        if (!topicsSection) return;

        // Find the "Themes by Arc" block — it's the first mb-10 div sibling
        const themesHero = topicsSection.querySelector('.mb-10.bg-gradient-to-r');
        if (!themesHero) return;

        const validation = topicsData.validation || {};
        const missingDesc = (validation.themes_missing_description || []).length;
        const orphan = (validation.themes_orphan || []).length;
        const missingBio = (validation.people_missing_bio || []).length;
        const autoAdded = (validation.themes_auto_added || []).length;

        const isCollapsed = localStorage.getItem(STORAGE_KEY_COLLAPSED) !== 'false';

        const card = document.createElement('div');
        card.id = 'curation-backlog-card';
        card.className = 'mb-6 bg-gray-800 border border-yellow-700/50 rounded-lg overflow-hidden';

        card.innerHTML = `
            <button id="curation-backlog-toggle"
                class="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-gray-750 transition-colors"
                aria-expanded="${!isCollapsed}"
                aria-controls="curation-backlog-body">
                <span class="flex items-center gap-2 text-yellow-400 font-semibold text-sm">
                    <span class="text-base">&#9888;</span>
                    Curation Backlog
                </span>
                <span id="curation-backlog-chevron" class="text-gray-400 text-xs transition-transform ${isCollapsed ? '' : 'rotate-180'}">&#9660;</span>
            </button>
            <div id="curation-backlog-body"
                class="px-5 pb-4 ${isCollapsed ? 'hidden' : ''}">
                <div class="grid grid-cols-1 gap-2 pt-1 text-sm">
                    <div class="flex items-center justify-between py-2 border-b border-gray-700">
                        <span class="text-gray-300">
                            <span id="curation-missing-desc-count" class="font-bold text-yellow-400">${missingDesc}</span>
                            theme${missingDesc !== 1 ? 's' : ''} need a description
                        </span>
                        ${missingDesc > 0 ? `<button id="curation-btn-missing-desc" class="text-xs px-3 py-1 rounded bg-yellow-700/30 text-yellow-300 hover:bg-yellow-700/50 transition-colors" aria-label="Filter themes missing descriptions">Curate &#8594;</button>` : '<span class="text-xs text-gray-600">all done</span>'}
                    </div>
                    <div class="flex items-center justify-between py-2 border-b border-gray-700">
                        <span class="text-gray-300">
                            <span class="font-bold text-orange-400">${orphan}</span>
                            theme${orphan !== 1 ? 's' : ''} have no stories (orphan)
                        </span>
                    </div>
                    <div class="flex items-center justify-between py-2 border-b border-gray-700">
                        <span class="text-gray-300">
                            <span class="font-bold text-blue-400">${missingBio}</span>
                            ${missingBio !== 1 ? 'people' : 'person'} need a bio
                        </span>
                    </div>
                    <div class="flex items-center justify-between py-2">
                        <span class="text-gray-300">
                            <span id="curation-auto-added-count" class="font-bold text-purple-400">${autoAdded}</span>
                            theme${autoAdded !== 1 ? 's' : ''} were auto-discovered
                        </span>
                        ${autoAdded > 0 ? `<button id="curation-btn-auto-added" class="text-xs px-3 py-1 rounded bg-purple-700/30 text-purple-300 hover:bg-purple-700/50 transition-colors" aria-label="Filter auto-discovered themes">Review &#8594;</button>` : '<span class="text-xs text-gray-600">none yet</span>'}
                    </div>
                </div>
            </div>
        `;

        themesHero.parentElement.insertBefore(card, themesHero);

        // Wire toggle
        const toggleBtn = card.querySelector('#curation-backlog-toggle');
        const body = card.querySelector('#curation-backlog-body');
        const chevron = card.querySelector('#curation-backlog-chevron');

        toggleBtn.addEventListener('click', () => {
            const collapsed = !body.classList.contains('hidden');
            body.classList.toggle('hidden', collapsed);
            chevron.style.transform = collapsed ? '' : 'rotate(180deg)';
            toggleBtn.setAttribute('aria-expanded', String(!collapsed));
            localStorage.setItem(STORAGE_KEY_COLLAPSED, String(collapsed));
        });

        // Wire "Curate →" button
        const curateMissingDesc = card.querySelector('#curation-btn-missing-desc');
        if (curateMissingDesc) {
            curateMissingDesc.addEventListener('click', () => {
                applyCurationFilter('needs-description', validation.themes_missing_description || []);
            });
        }

        // Wire "Review →" button
        const reviewAutoAdded = card.querySelector('#curation-btn-auto-added');
        if (reviewAutoAdded) {
            reviewAutoAdded.addEventListener('click', () => {
                applyCurationFilter('auto-added', validation.themes_auto_added || []);
            });
        }
    }

    /**
     * Applies a curation filter to the All Themes grid.
     * If the same filter is already active, clicking again clears it (toggle).
     *
     * @param {string} filterType - 'needs-description' | 'auto-added'
     * @param {string[]} themeNames - list of theme names to show
     */
    function applyCurationFilter(filterType, themeNames) {
        const container = document.getElementById('all-themes-container');
        if (!container) return;

        // Toggle off if clicking the same filter again
        if (activeCurationFilter === filterType) {
            activeCurationFilter = null;
            clearCurationFilter(container);
            return;
        }

        activeCurationFilter = filterType;
        const nameSet = new Set(themeNames.map(n => n.toLowerCase()));

        container.querySelectorAll(':scope > div').forEach(card => {
            const h4 = card.querySelector('h4');
            const cardName = h4 ? h4.textContent.trim().toLowerCase() : '';
            const show = nameSet.has(cardName);
            card.style.display = show ? '' : 'none';
        });

        // Mark filtered cards so CSS or other logic can spot them
        container.querySelectorAll(':scope > div').forEach(card => {
            card.toggleAttribute('data-needs-curation', filterType === 'needs-description');
            card.toggleAttribute('data-auto-added', filterType === 'auto-added');
        });

        // Scroll All Themes section into view
        const allThemesSection = container.closest('.mb-10');
        if (allThemesSection) {
            allThemesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function clearCurationFilter(container) {
        if (!container) return;
        container.querySelectorAll(':scope > div').forEach(card => {
            card.style.display = '';
            card.removeAttribute('data-needs-curation');
            card.removeAttribute('data-auto-added');
        });
    }

    // -----------------------------------------------------------------------
    // Task 2 — Theme editor drawer
    // -----------------------------------------------------------------------

    /**
     * Initialise the drawer — wires long-press and gear-icon events on all
     * theme cards in #all-themes-container. Must be called AFTER renderTopics()
     * has populated the container. We call it at the end of our render(), and
     * also expose it so external code can call it after re-renders.
     */
    function initThemeEditor() {
        const container = document.getElementById('all-themes-container');
        if (!container) return;

        // Remove any existing listener to avoid double-binding on re-render
        const newContainer = container.cloneNode(true);
        container.parentNode.replaceChild(newContainer, container);

        // Re-wire the original click → filterByTheme on the cloned container
        newContainer.addEventListener('click', (e) => {
            // Gear icon click → open editor
            const gearBtn = e.target.closest('[data-theme-edit-btn]');
            if (gearBtn) {
                e.stopPropagation();
                const themeName = gearBtn.closest('[data-theme-name]')?.dataset.themeName;
                if (themeName) openThemeEditor(themeName);
                return;
            }

            // Normal card click → filterByTheme (existing behaviour)
            const card = e.target.closest('[data-theme-name]');
            if (card && typeof window.filterByTheme === 'function') {
                window.filterByTheme(card.dataset.themeName);
            }
        });

        // Long-press detection
        let pressTimer = null;
        newContainer.addEventListener('pointerdown', (e) => {
            const card = e.target.closest('[data-theme-name]');
            if (!card) return;
            const gearBtn = e.target.closest('[data-theme-edit-btn]');
            if (gearBtn) return; // gear handles its own click
            pressTimer = setTimeout(() => {
                pressTimer = null;
                openThemeEditor(card.dataset.themeName);
            }, 500);
        });
        newContainer.addEventListener('pointerup', () => {
            if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
        });
        newContainer.addEventListener('pointerleave', () => {
            if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
        });
        newContainer.addEventListener('pointermove', () => {
            // Cancel long-press on any move to avoid accidental triggers
            if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
        });
    }

    /**
     * Rebuild theme cards so they carry data-theme-name and a hover gear button.
     * Called immediately after renderTopics() populates #all-themes-container.
     */
    function decorateThemeCards() {
        const container = document.getElementById('all-themes-container');
        if (!container) return;
        const topicsData = window.topicsData;
        if (!topicsData) return;

        container.querySelectorAll(':scope > div').forEach(card => {
            // Find the theme name from the h4 text (the renderTopics code uses h4)
            const h4 = card.querySelector('h4');
            if (!h4) return;
            const themeName = h4.textContent.trim();

            // Stamp data attribute for event delegation
            card.setAttribute('data-theme-name', themeName);

            // Remove inline onclick (we handle clicks via delegation now)
            card.removeAttribute('onclick');

            // Inject gear button if not already present
            if (!card.querySelector('[data-theme-edit-btn]')) {
                const gearBtn = document.createElement('button');
                gearBtn.setAttribute('data-theme-edit-btn', '');
                gearBtn.setAttribute('aria-label', `Edit theme ${themeName}`);
                gearBtn.className =
                    'absolute top-2 right-2 text-gray-500 hover:text-gray-200 ' +
                    'opacity-0 group-hover:opacity-100 transition-opacity text-base z-10 ' +
                    'bg-gray-700 hover:bg-gray-600 rounded p-0.5 leading-none';
                gearBtn.textContent = '⚙'; // ⚙
                card.appendChild(gearBtn);
            }
        });
    }

    // -----------------------------------------------------------------------
    // Drawer open / close
    // -----------------------------------------------------------------------

    function openThemeEditor(themeName) {
        const topicsData = window.topicsData;
        if (!topicsData || !themeName) return;
        const themes = topicsData.themes || {};
        const themeData = themes[themeName] || {};

        const drawer = document.getElementById('theme-editor-drawer');
        if (!drawer) return;

        // Populate fields
        drawer.querySelector('#thed-name').textContent = esc(themeName);

        const descEl = drawer.querySelector('#thed-description');
        descEl.value = themeData.description || '';

        // Arc focus checkboxes
        const arcFocus = Array.isArray(themeData.arc_focus) ? themeData.arc_focus : [];
        ARC_OPTIONS.forEach(arc => {
            const cb = drawer.querySelector(`#thed-arc-${arc}`);
            if (cb) cb.checked = arcFocus.includes(arc);
        });

        // Related themes
        const relatedEl = drawer.querySelector('#thed-related');
        relatedEl.value = Array.isArray(themeData.related_themes)
            ? themeData.related_themes.join(', ')
            : '';

        // Store active theme name on the drawer for Save to read
        drawer.dataset.activeTheme = themeName;

        // Slide in + show backdrop
        drawer.classList.remove('translate-x-full');
        drawer.classList.add('translate-x-0');
        drawer.setAttribute('aria-hidden', 'false');
        const backdrop = document.getElementById('thed-backdrop');
        if (backdrop) backdrop.classList.remove('hidden');
        descEl.focus();
    }

    function closeThemeEditor() {
        const drawer = document.getElementById('theme-editor-drawer');
        if (!drawer) return;
        drawer.classList.remove('translate-x-0');
        drawer.classList.add('translate-x-full');
        drawer.setAttribute('aria-hidden', 'true');
        const backdrop = document.getElementById('thed-backdrop');
        if (backdrop) backdrop.classList.add('hidden');
    }

    async function saveThemeEdits() {
        const drawer = document.getElementById('theme-editor-drawer');
        if (!drawer) return;
        const themeName = drawer.dataset.activeTheme;
        if (!themeName) return;

        const topicsData = window.topicsData;
        if (!topicsData) return;

        const description = drawer.querySelector('#thed-description').value.trim();
        const arcFocus = ARC_OPTIONS.filter(arc => {
            const cb = drawer.querySelector(`#thed-arc-${arc}`);
            return cb && cb.checked;
        });
        const relatedRaw = drawer.querySelector('#thed-related').value;
        const relatedThemes = relatedRaw
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);

        // Build immutable update — copy topicsData, update the theme entry
        const updatedTheme = Object.assign({}, topicsData.themes[themeName] || {}, {
            description,
            arc_focus: arcFocus,
            related_themes: relatedThemes
        });

        const updatedThemes = Object.assign({}, topicsData.themes, {
            [themeName]: updatedTheme
        });

        const updatedTopicsData = Object.assign({}, topicsData, {
            themes: updatedThemes
        });

        const saveBtn = drawer.querySelector('#thed-save-btn');
        if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving…'; }

        try {
            const res = await fetch('/api/topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topics: updatedTopicsData })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                console.error('Theme save failed:', errData.error || res.status);
                showDrawerStatus('Save failed: ' + (errData.error || res.status), 'red');
                return;
            }

            // Update in-memory data and re-render
            window.topicsData = updatedTopicsData;

            // Ask renderTopics to re-run (it lives in the main inline script)
            if (typeof window.renderTopics === 'function') {
                window.renderTopics();
            }

            // Re-decorate cards and re-init editor bindings after render
            decorateThemeCards();
            initThemeEditor();

            // Re-render the curation backlog with refreshed data
            render();

            closeThemeEditor();
        } catch (e) {
            console.error('Theme save error:', e);
            showDrawerStatus('Network error', 'red');
        } finally {
            if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save'; }
        }
    }

    function showDrawerStatus(msg, color) {
        const el = document.getElementById('thed-status');
        if (!el) return;
        el.textContent = msg;
        el.className = color === 'red' ? 'text-xs text-red-400 mt-1' : 'text-xs text-green-400 mt-1';
        el.classList.remove('hidden');
        setTimeout(() => el.classList.add('hidden'), 3000);
    }

    // -----------------------------------------------------------------------
    // Wire drawer buttons (called once on DOMContentLoaded / page ready)
    // -----------------------------------------------------------------------

    function initDrawerControls() {
        const drawer = document.getElementById('theme-editor-drawer');
        if (!drawer) return;

        drawer.querySelector('#thed-cancel-btn')?.addEventListener('click', closeThemeEditor);
        drawer.querySelector('#thed-close-btn')?.addEventListener('click', closeThemeEditor);
        drawer.querySelector('#thed-save-btn')?.addEventListener('click', saveThemeEdits);

        // Close on backdrop click (clicking outside drawer)
        document.getElementById('thed-backdrop')?.addEventListener('click', closeThemeEditor);

        // Keyboard escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawer.getAttribute('aria-hidden') === 'false') {
                closeThemeEditor();
            }
        });
    }

    // -----------------------------------------------------------------------
    // Public API
    // -----------------------------------------------------------------------

    /**
     * render() — call after renderTopics() fires.
     * Renders the curation backlog card and decorates theme cards for editing.
     */
    function renderAll() {
        render();
        decorateThemeCards();
        initThemeEditor();
    }

    window.curationWidget = {
        render: renderAll,
        openThemeEditor,
        closeThemeEditor
    };

    // Wire drawer controls as soon as the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDrawerControls);
    } else {
        initDrawerControls();
    }

}());
