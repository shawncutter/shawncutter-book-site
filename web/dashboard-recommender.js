/* Dashboard live recommendations (Sprint O — O1.1-O1.3).
 *
 * Replaces the three hardcoded dashboard cards ("Next Steps", "Timeline
 * Gaps", "Ready to Expand") and the hardcoded arc progress bars with
 * derivations from window.allStories / window.timelineData /
 * window.topicsData.
 *
 * Exposed as window.dashboardRecommender = { renderAll() }.
 */
(function setupDashboardRecommender() {
    const ARC_WORD_TARGET = 30000;
    const ARC_ORDER = ['forged', 'fractured', 'forging', 'foundry'];
    const ARC_COLORS = {
        forged: '#f59e0b',
        fractured: '#ef4444',
        forging: '#3b82f6',
        foundry: '#10b981',
    };
    const ARC_LABELS = {
        forged: 'FORGED',
        fractured: 'FRACTURED',
        forging: 'FORGING',
        foundry: 'FOUNDRY',
    };

    // -----------------------------------------------------------------------
    // Next Steps
    // -----------------------------------------------------------------------
    function computeNextSteps() {
        const stories = window.allStories || [];
        const steps = [];

        // Promote candidates: drafts > 1500 words
        const promotable = stories
            .filter(s => s.status === 'draft' && s.word_count > 1500 && !s.file.includes('QUESTIONS') && !s.file.startsWith('_'))
            .sort((a, b) => b.word_count - a.word_count)
            .slice(0, 2);
        for (const s of promotable) {
            steps.push(`Promote "${s.title.slice(0, 50)}" (${Math.round(s.word_count / 100) / 10}K words) to ready`);
        }

        // Partial rewrites
        const rewrites = stories.filter(s => s.rewrite_status === 'partial').slice(0, 1);
        for (const s of rewrites) {
            steps.push(`Finish rewrite of "${s.title.slice(0, 50)}"`);
        }

        // Ready to publish
        const readyToPub = stories.filter(s => s.status === 'ready' && !s.medium_url).slice(0, 1);
        for (const s of readyToPub) {
            steps.push(`Publish "${s.title.slice(0, 50)}" to Medium`);
        }

        return steps.slice(0, 3);
    }

    function renderNextSteps(el) {
        if (!el) return;
        const steps = computeNextSteps();
        if (!steps.length) {
            el.innerHTML = '<li class="text-gray-500 text-sm italic">All caught up!</li>';
            return;
        }
        el.innerHTML = steps.map(s => `<li class="text-sm text-gray-300">${s}</li>`).join('');
    }

    // -----------------------------------------------------------------------
    // Timeline Gaps
    // -----------------------------------------------------------------------
    function computeTimelineGaps() {
        const td = window.timelineData;
        if (!td || !td.events || !td.events.length) return [];
        const birthYear = td.metadata?.birth_year || 1979;

        const events = [...td.events]
            .filter(e => e.date && /^\d{4}/.test(e.date))
            .sort((a, b) => a.date.localeCompare(b.date));

        const gaps = [];
        for (let i = 1; i < events.length; i++) {
            const yearA = parseInt(events[i - 1].date.slice(0, 4), 10);
            const yearB = parseInt(events[i].date.slice(0, 4), 10);
            const months = (yearB - yearA) * 12;
            if (months > 18) {
                const ageA = yearA - birthYear;
                const ageB = yearB - birthYear;
                gaps.push(`${yearA}-${yearB} (ages ${ageA}-${ageB})`);
            }
        }
        return gaps.slice(0, 3);
    }

    function renderTimelineGaps(el) {
        if (!el) return;
        const gaps = computeTimelineGaps();
        if (!gaps.length) {
            el.innerHTML = '<li class="text-gray-500 text-sm italic">No gaps over 18 months detected.</li>';
            return;
        }
        el.innerHTML = gaps.map(g => `<li class="text-sm text-gray-300">${g}</li>`).join('');
    }

    // -----------------------------------------------------------------------
    // Ready to Expand (clusters)
    // -----------------------------------------------------------------------
    function computeReadyToExpand() {
        const td = window.topicsData;
        if (!td || !td.clusters) return [];
        const clusterList = Array.isArray(td.clusters)
            ? td.clusters
            : Object.values(td.clusters);

        return clusterList
            .filter(c => c.stories && c.stories.length > 0)
            .sort((a, b) => {
                // Prefer expansion_candidate=true, then by story count
                const aFlag = a.expansion_candidate ? 1 : 0;
                const bFlag = b.expansion_candidate ? 1 : 0;
                if (bFlag !== aFlag) return bFlag - aFlag;
                return (b.stories || []).length - (a.stories || []).length;
            })
            .slice(0, 3)
            .map(c => `${c.title} (${(c.stories || []).length} pieces)`);
    }

    function renderReadyToExpand(el) {
        if (!el) return;
        const items = computeReadyToExpand();
        if (!items.length) {
            el.innerHTML = '<li class="text-gray-500 text-sm italic">Cluster data loading…</li>';
            return;
        }
        el.innerHTML = items.map(s => `<li class="text-sm text-gray-300">${s}</li>`).join('');
    }

    // -----------------------------------------------------------------------
    // Arc progress bars
    // -----------------------------------------------------------------------
    function renderArcProgress() {
        const stories = window.allStories || [];
        ARC_ORDER.forEach(arc => {
            const arcStories = stories.filter(s => s.arc === arc);
            const words = arcStories.reduce((sum, s) => sum + (s.word_count || 0), 0);
            const pct = Math.min(100, Math.round(words / ARC_WORD_TARGET * 100));
            const kWords = (words / 1000).toFixed(0);

            const bar = document.getElementById(`arc-${arc}-bar`);
            const label = document.getElementById(`arc-${arc}-label`);
            if (bar) bar.style.width = pct + '%';
            if (label) label.textContent = `~${kWords}K / 30K words`;
        });
    }

    // -----------------------------------------------------------------------
    // Arc Status page
    // -----------------------------------------------------------------------
    function renderArcStatus() {
        const stories = window.allStories || [];
        const topicsData = window.topicsData || {};

        ARC_ORDER.forEach(arc => {
            const container = document.getElementById(`arc-status-${arc}`);
            if (!container) return;

            const arcStories = stories.filter(s => s.arc === arc && !s.file.includes('QUESTIONS') && !s.file.startsWith('_'));
            const statusCounts = { ready: 0, draft: 0, idea: 0, expanded: 0, published: 0 };
            arcStories.forEach(s => { if (statusCounts[s.status] !== undefined) statusCounts[s.status]++; });
            const words = arcStories.reduce((sum, s) => sum + (s.word_count || 0), 0);
            const pct = Math.min(100, Math.round(words / ARC_WORD_TARGET * 100));
            const color = ARC_COLORS[arc];

            // Top themes for this arc
            const arcThemes = Object.entries(topicsData.themes || {})
                .filter(([, t]) => Array.isArray(t.arc_focus) && t.arc_focus.includes(arc))
                .sort(([, a], [, b]) => (b.stories || []).length - (a.stories || []).length)
                .slice(0, 5);

            // Recently edited
            const recent = [...arcStories]
                .sort((a, b) => (b.modified || '').localeCompare(a.modified || ''))
                .slice(0, 3);

            const statusBadge = (label, count, col) => count > 0
                ? `<span class="text-xs px-2 py-0.5 rounded-full border" style="border-color:${col}40;color:${col};background:${col}15">${count} ${label}</span>`
                : '';

            container.innerHTML = `
                <div class="space-y-3">
                    <div class="flex flex-wrap gap-1">
                        ${statusBadge('ready', statusCounts.ready, '#10b981')}
                        ${statusBadge('draft', statusCounts.draft, '#f59e0b')}
                        ${statusBadge('published', statusCounts.published, '#3b82f6')}
                        ${statusBadge('expanded', statusCounts.expanded, '#8b5cf6')}
                        ${statusBadge('idea', statusCounts.idea, '#6b7280')}
                    </div>
                    <div>
                        <div class="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Words</span><span>~${(words/1000).toFixed(0)}K / 30K</span>
                        </div>
                        <div class="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                            <div class="h-full rounded-full" style="width:${pct}%;background:${color}"></div>
                        </div>
                    </div>
                    ${arcThemes.length ? `<div class="flex flex-wrap gap-1">${arcThemes.map(([name]) => `<span class="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-400">${name}</span>`).join('')}</div>` : ''}
                    ${recent.length ? `<div class="text-xs text-gray-500">Recent: ${recent.map(s => `<span class="text-gray-400">${s.title.slice(0,30)}</span>`).join(', ')}</div>` : ''}
                </div>
            `;
        });
    }

    // -----------------------------------------------------------------------
    // Top-level
    // -----------------------------------------------------------------------
    function renderAll() {
        renderNextSteps(document.getElementById('next-steps-list'));
        renderTimelineGaps(document.getElementById('timeline-gaps-list'));
        renderReadyToExpand(document.getElementById('ready-expand-list'));
        renderArcProgress();
        renderArcStatus();
    }

    window.dashboardRecommender = { renderAll, renderNextSteps, renderTimelineGaps, renderReadyToExpand, renderArcProgress, renderArcStatus };
})();
