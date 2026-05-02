/* Faceted story explorer (Sprint O5.1)
 *
 * Exposes:
 *   window.storySearch = { applyFilters(), getState(), setState(partial), reset() }
 *
 * Depends on (loaded earlier in the page):
 *   - window.allStories        (array of story objects from _index.json)
 *   - window.topicsData        (themes/people objects from _topics.json)
 *   - displayFilteredStories() (defined in web/index.html inline script)
 *
 * URL sync:
 *   On applyFilters(): window.history.replaceState with query params
 *   On page load: reads params and calls setState(parsedParams)
 *
 * Facet state:
 *   {
 *     text: '',
 *     arcs: [],           // [] = all; multi-select
 *     statuses: [],       // [] = all
 *     themes: [],         // multi-select from topicsData
 *     people: [],         // multi-select from topicsData
 *     wordCountMin: 0,
 *     wordCountMax: Infinity,
 *     yearMin: null,
 *     yearMax: null,
 *     hasFeedback: false,
 *   }
 */
(function setupStorySearch() {
    'use strict';

    // ------------------------------------------------------------------ state

    const DEFAULT_STATE = Object.freeze({
        text: '',
        arcs: [],
        statuses: [],
        themes: [],
        people: [],
        wordCountMin: 0,
        wordCountMax: Infinity,
        yearMin: null,
        yearMax: null,
        hasFeedback: false,
    });

    let _state = { ...DEFAULT_STATE };

    // ------------------------------------------------------------------ helpers

    function cloneState(s) {
        return {
            text: s.text,
            arcs: [...s.arcs],
            statuses: [...s.statuses],
            themes: [...s.themes],
            people: [...s.people],
            wordCountMin: s.wordCountMin,
            wordCountMax: s.wordCountMax,
            yearMin: s.yearMin,
            yearMax: s.yearMax,
            hasFeedback: s.hasFeedback,
        };
    }

    function eventYear(story) {
        if (!story.date_event) return null;
        const y = parseInt(String(story.date_event).slice(0, 4), 10);
        return isNaN(y) ? null : y;
    }

    // ------------------------------------------------------------------ filtering

    function filterStories(stories, state) {
        return stories.filter(s => {
            // text
            if (state.text) {
                const term = state.text.toLowerCase();
                const match =
                    (s.title || '').toLowerCase().includes(term) ||
                    (s.file || '').toLowerCase().includes(term) ||
                    (s.excerpt || '').toLowerCase().includes(term) ||
                    (s.themes || []).some(t => t.toLowerCase().includes(term)) ||
                    (s.people || []).some(p => p.toLowerCase().includes(term));
                if (!match) return false;
            }

            // arcs multi-select
            if (state.arcs.length > 0 && !state.arcs.includes(s.arc)) return false;

            // statuses multi-select
            if (state.statuses.length > 0 && !state.statuses.includes(s.status)) return false;

            // themes multi-select (story must have ALL selected themes)
            if (state.themes.length > 0) {
                const storyThemes = (s.themes || []).map(t => t.toLowerCase());
                const allMatch = state.themes.every(t => storyThemes.includes(t.toLowerCase()));
                if (!allMatch) return false;
            }

            // people multi-select (story must have ALL selected people)
            if (state.people.length > 0) {
                const storyPeople = (s.people || []).map(p => p.toLowerCase());
                const allMatch = state.people.every(p => storyPeople.includes(p.toLowerCase()));
                if (!allMatch) return false;
            }

            // word count
            const wc = s.word_count || 0;
            if (wc < state.wordCountMin) return false;
            if (state.wordCountMax !== Infinity && wc > state.wordCountMax) return false;

            // year range
            const yr = eventYear(s);
            if (state.yearMin !== null && yr !== null && yr < state.yearMin) return false;
            if (state.yearMax !== null && yr !== null && yr > state.yearMax) return false;

            // has feedback
            if (state.hasFeedback && !(s.feedback_count > 0)) return false;

            return true;
        });
    }

    // ------------------------------------------------------------------ URL sync

    function stateToParams(state) {
        const p = new URLSearchParams();
        if (state.text) p.set('q', state.text);
        if (state.arcs.length) p.set('arc', state.arcs.join(','));
        if (state.statuses.length) p.set('status', state.statuses.join(','));
        if (state.themes.length) p.set('theme', state.themes.join(','));
        if (state.people.length) p.set('person', state.people.join(','));
        if (state.wordCountMin > 0) p.set('wmin', String(state.wordCountMin));
        if (state.wordCountMax !== Infinity) p.set('wmax', String(state.wordCountMax));
        if (state.yearMin !== null) p.set('ymin', String(state.yearMin));
        if (state.yearMax !== null) p.set('ymax', String(state.yearMax));
        if (state.hasFeedback) p.set('feedback', '1');
        return p;
    }

    function paramsToState(params) {
        const partial = {};
        if (params.has('q')) partial.text = params.get('q');
        if (params.has('arc')) partial.arcs = params.get('arc').split(',').filter(Boolean);
        if (params.has('status')) partial.statuses = params.get('status').split(',').filter(Boolean);
        if (params.has('theme')) partial.themes = params.get('theme').split(',').filter(Boolean);
        if (params.has('person')) partial.people = params.get('person').split(',').filter(Boolean);
        if (params.has('wmin')) {
            const v = parseInt(params.get('wmin'), 10);
            if (!isNaN(v)) partial.wordCountMin = v;
        }
        if (params.has('wmax')) {
            const v = parseInt(params.get('wmax'), 10);
            if (!isNaN(v)) partial.wordCountMax = v;
        }
        if (params.has('ymin')) {
            const v = parseInt(params.get('ymin'), 10);
            if (!isNaN(v)) partial.yearMin = v;
        }
        if (params.has('ymax')) {
            const v = parseInt(params.get('ymax'), 10);
            if (!isNaN(v)) partial.yearMax = v;
        }
        if (params.get('feedback') === '1') partial.hasFeedback = true;
        return partial;
    }

    function syncUrl(state) {
        const params = stateToParams(state);
        const qs = params.toString();
        const base = window.location.pathname;
        const newUrl = qs ? `${base}?${qs}` : base;
        try {
            window.history.replaceState(null, '', newUrl);
        } catch (_) {
            // Silently ignore in static file:// contexts
        }
    }

    // ------------------------------------------------------------------ public API

    function applyFilters() {
        const stories = window.allStories || [];
        const filtered = filterStories(stories, _state);
        syncUrl(_state);
        if (typeof displayFilteredStories === 'function') {
            displayFilteredStories(filtered);
        }
        _notifyPanel();
    }

    function getState() {
        return cloneState(_state);
    }

    function setState(partial) {
        _state = Object.assign(cloneState(_state), partial);
    }

    function reset() {
        _state = { ...DEFAULT_STATE };
    }

    // ------------------------------------------------------------------ panel update notifications

    let _panelUpdateCallback = null;

    function onPanelUpdate(cb) {
        _panelUpdateCallback = cb;
    }

    function _notifyPanel() {
        if (typeof _panelUpdateCallback === 'function') {
            _panelUpdateCallback(cloneState(_state));
        }
    }

    // ------------------------------------------------------------------ page-load URL init

    function initFromUrl() {
        const params = new URLSearchParams(window.location.search);
        if (params.toString()) {
            const partial = paramsToState(params);
            setState(partial);
        }
    }

    // ------------------------------------------------------------------ export

    window.storySearch = {
        applyFilters,
        getState,
        setState,
        reset,
        // internal: used by the facet panel
        _onPanelUpdate: onPanelUpdate,
        _filterStories: filterStories,   // exposed for tests
        _paramsToState: paramsToState,   // exposed for tests
        _stateToParams: stateToParams,   // exposed for tests
    };

    // Init from URL params once DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFromUrl);
    } else {
        initFromUrl();
    }

})();
