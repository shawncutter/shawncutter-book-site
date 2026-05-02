/* Person (and future: Location) detail modal + editor metadata panel
 * autocomplete datalists + backlinks panel (Sprint O — O2.1, O2.2, O2.4).
 *
 * Exposes:
 *   window.personModal = { open(slug), close() }
 *
 * Also populates the datalists for:
 *   #meta-people-list    — curated person names from topicsData.people
 *   #meta-locations-list — location names from topicsData.locations
 *   #meta-related-list   — story filenames from window.allStories
 *
 * And renders the backlinks panel in the editor when a story is open.
 * Called from window.editorAPI.onStoryChange (see editor.js integration note
 * below), falling back to a MutationObserver on #editor-title.
 */
(function setupPersonModal() {
    // -----------------------------------------------------------------------
    // Person modal
    // -----------------------------------------------------------------------
    const modal = document.getElementById('person-modal');
    const nameEl = document.getElementById('person-modal-name');
    const roleEl = document.getElementById('person-modal-role');
    const bioEl = document.getElementById('person-modal-bio');
    const storiesEl = document.getElementById('person-modal-stories');
    const closeBtn = document.getElementById('person-modal-close');

    function open(slug) {
        const td = window.topicsData;
        if (!td || !td.people) return;
        const person = td.people[slug];
        if (!person) return;

        const stories = (person.stories || []).map(file => {
            const s = (window.allStories || []).find(x => x.file === file);
            return s || { file, title: file.split('/').pop().replace('.md', ''), arc: '' };
        }).sort((a, b) => (a.date_event || '9999').localeCompare(b.date_event || '9999'));

        nameEl.textContent = person.name || slug;
        roleEl.textContent = person.role ? `${person.role} — ${stories.length} ${stories.length === 1 ? 'story' : 'stories'}` : `${stories.length} ${stories.length === 1 ? 'story' : 'stories'}`;

        if (person.bio) {
            bioEl.textContent = person.bio;
            bioEl.classList.remove('hidden');
        } else {
            bioEl.classList.add('hidden');
        }

        const arcColors = { forged: '#f59e0b', fractured: '#ef4444', forging: '#3b82f6', foundry: '#10b981' };

        if (!stories.length) {
            storiesEl.innerHTML = '<p class="text-sm text-gray-500 italic">No stories tagged with this person yet. Add people: frontmatter in the Story Editor.</p>';
        } else {
            const byArc = {};
            stories.forEach(s => {
                const a = s.arc || 'unknown';
                byArc[a] = byArc[a] || [];
                byArc[a].push(s);
            });
            storiesEl.innerHTML = Object.entries(byArc).map(([arc, list]) => {
                const color = arcColors[arc] || '#6b7280';
                return `<div class="mb-3">
                    <p class="text-xs font-semibold mb-1" style="color:${color}">${arc.toUpperCase()}</p>
                    <div class="space-y-1">
                        ${list.map(s => `<div class="flex items-center gap-2 px-2 py-1.5 bg-gray-900 rounded cursor-pointer hover:bg-gray-700 story-link" data-file="${s.file}">
                            <span class="text-sm text-white flex-1 truncate">${s.title}</span>
                            ${s.date_event ? `<span class="text-xs text-gray-500">${s.date_event.slice(0,4)}</span>` : ''}
                            <span class="text-xs text-gray-500">${s.word_count ? Math.round(s.word_count/100)/10 + 'K' : ''}</span>
                        </div>`).join('')}
                    </div>
                </div>`;
            }).join('');
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');

        // Wire story clicks after render
        storiesEl.querySelectorAll('.story-link').forEach(el => {
            el.addEventListener('click', () => {
                const file = el.dataset.file;
                const story = (window.allStories || []).find(s => s.file === file)
                    || { file, title: file.split('/').pop(), arc: 'forged' };
                close();
                if (window.editorAPI?.openStory) window.editorAPI.openStory(story);
            });
        });
    }

    function close() {
        if (!modal) return;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (modal) {
        modal.addEventListener('click', e => { if (e.target === modal) close(); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) close();
        });
    }

    window.personModal = { open, close };

    // -----------------------------------------------------------------------
    // Populate datalists for editor metadata panel inputs
    // -----------------------------------------------------------------------
    function populateDataLists() {
        const td = window.topicsData;
        const stories = window.allStories || [];

        // People
        const peopleList = document.getElementById('meta-people-list');
        if (peopleList && td?.people) {
            peopleList.innerHTML = Object.values(td.people)
                .map(p => `<option value="${(p.name || '').replace(/"/g, '&quot;')}">`)
                .join('');
        }

        // Locations
        const locList = document.getElementById('meta-locations-list');
        if (locList && td?.locations) {
            locList.innerHTML = Object.values(td.locations)
                .map(l => `<option value="${(l.name || '').replace(/"/g, '&quot;')}">`)
                .join('');
        }

        // Related stories
        const relList = document.getElementById('meta-related-list');
        if (relList && stories.length) {
            relList.innerHTML = stories
                .map(s => `<option value="${s.file}" label="${s.title}">`)
                .join('');
        }
    }

    // -----------------------------------------------------------------------
    // Backlinks panel
    // -----------------------------------------------------------------------
    function renderBacklinks(currentStory) {
        const panel = document.getElementById('backlinks-panel');
        const list = document.getElementById('backlinks-list');
        if (!panel || !list || !currentStory) return;

        const stories = window.allStories || [];
        const file = currentStory.file;

        // Direct related_to references
        const direct = (currentStory.related_to || [])
            .map(f => stories.find(s => s.file === f) || { file: f, title: f.split('/').pop() });

        // Inverse: stories that reference THIS one
        const inverse = stories.filter(s =>
            s.file !== file && (s.related_to || []).includes(file)
        );

        // Shared themes (2+)
        const myThemes = new Set(currentStory.themes || []);
        const shared = stories.filter(s =>
            s.file !== file &&
            !direct.find(d => d.file === s.file) &&
            !inverse.find(i => i.file === s.file) &&
            (s.themes || []).filter(t => myThemes.has(t)).length >= 2
        ).slice(0, 3);

        if (!direct.length && !inverse.length && !shared.length) {
            panel.classList.add('hidden');
            return;
        }

        const storyLink = (s, note) => `<div class="flex items-center gap-2 cursor-pointer hover:text-blue-400 story-link-backlink" data-file="${s.file}">
            <span class="text-sm text-gray-300 truncate flex-1">${s.title || s.file}</span>
            <span class="text-xs text-gray-600">${note}</span>
        </div>`;

        list.innerHTML = [
            ...direct.map(s => storyLink(s, 'linked')),
            ...inverse.map(s => storyLink(s, 'referenced by')),
            ...shared.map(s => storyLink(s, 'shared themes')),
        ].join('');

        list.querySelectorAll('.story-link-backlink').forEach(el => {
            el.addEventListener('click', () => {
                const s = stories.find(x => x.file === el.dataset.file);
                if (s && window.editorAPI?.openStory) window.editorAPI.openStory(s);
            });
        });

        panel.classList.remove('hidden');
    }

    // Wire backlinks + datalists whenever a story opens (poll for story change)
    let lastStory = null;
    function checkStoryChange() {
        const current = window.editorAPI?.currentStory;
        if (current && current !== lastStory) {
            lastStory = current;
            populateDataLists();
            renderBacklinks(current);
        }
    }
    setInterval(checkStoryChange, 800);

    // Wire person pill clicks on the Topics page (re-runs after Topics renders)
    document.addEventListener('click', e => {
        const pill = e.target.closest('[data-person-slug]');
        if (pill) {
            e.preventDefault();
            window.personModal.open(pill.dataset.personSlug);
        }
    });
})();
