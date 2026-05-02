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
    // Arc narrative gap detector
    //
    // Looks at stories in an arc that have date_event set, sorts them by date,
    // and finds consecutive pairs with a gap > 18 months.
    // Returns up to 2 gap strings: "Gap: 1994–1996 (ages 14-16)"
    // -----------------------------------------------------------------------
    function computeArcNarrativeGaps(arcStories) {
        const birthYear = window.timelineData?.metadata?.birth_year || 1979;

        // Collect stories that have a date_event and parse their year
        const dated = arcStories
            .map(s => {
                if (!s.date_event) return null;
                const yr = parseInt(String(s.date_event).slice(0, 4), 10);
                return isNaN(yr) ? null : { year: yr, title: s.title };
            })
            .filter(Boolean)
            .sort((a, b) => a.year - b.year);

        if (dated.length < 2) return [];

        const gaps = [];
        for (let i = 1; i < dated.length; i++) {
            const yearA = dated[i - 1].year;
            const yearB = dated[i].year;
            const diffMonths = (yearB - yearA) * 12;
            if (diffMonths > 18) {
                const ageA = yearA - birthYear;
                const ageB = yearB - birthYear;
                gaps.push(`Gap: ${yearA}–${yearB} (ages ${ageA}–${ageB})`);
            }
        }

        return gaps.slice(0, 2);
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

            // Narrative gaps — derived from stories that have date_event
            const narrativeGaps = computeArcNarrativeGaps(arcStories);

            const statusBadge = (label, count, col) => count > 0
                ? `<span class="text-xs px-2 py-0.5 rounded-full border" style="border-color:${col}40;color:${col};background:${col}15">${count} ${label}</span>`
                : '';

            const gapsHtml = narrativeGaps.length
                ? narrativeGaps
                    .map(g => `<span class="text-xs text-gray-500 italic">${g}</span>`)
                    .join('<br>')
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
                    ${gapsHtml ? `<div class="leading-5">${gapsHtml}</div>` : ''}
                    ${recent.length ? `<div class="text-xs text-gray-500">Recent: ${recent.map(s => `<span class="text-gray-400">${s.title.slice(0,30)}</span>`).join(', ')}</div>` : ''}
                </div>
            `;
        });
    }

    // -----------------------------------------------------------------------
    // Open Questions widget (Sprint O6.1)
    // -----------------------------------------------------------------------
    function renderOpenQuestions(el) {
        if (!el) return;

        // In static mode there is no server to fetch from — hide gracefully.
        const isStatic = window.location.hostname !== 'localhost' &&
                         window.location.hostname !== '127.0.0.1';
        if (isStatic) {
            const wrapper = el.closest
                ? el.closest('[id="open-questions-card"]') || el.parentElement
                : el.parentElement;
            if (wrapper) wrapper.classList.add('hidden');
            return;
        }

        el.innerHTML = '<li class="text-gray-500 text-sm italic">Loading…</li>';

        fetch('/api/open-questions')
            .then(r => r.json())
            .then(({ questions }) => {
                const card = document.getElementById('open-questions-card');
                if (!questions || questions.length === 0) {
                    if (card) card.classList.add('hidden');
                    return;
                }
                if (card) card.classList.remove('hidden');

                const ARC_LABEL = { forged: 'FORGED', fractured: 'FRACTURED', forging: 'FORGING', foundry: 'FOUNDRY' };
                const MAX_DISPLAY = 5;
                const shown = questions.slice(0, MAX_DISPLAY);

                el.innerHTML = shown.map(q => {
                    const arcLabel = ARC_LABEL[q.arc] || q.arc.toUpperCase();
                    // Truncate question text for display
                    const display = q.text.length > 80 ? q.text.slice(0, 77) + '…' : q.text;
                    // Remove bold formatting markers used in the source files
                    const clean = display.replace(/\*\*/g, '');
                    return `<li class="text-sm flex items-start gap-2 py-0.5">
                        <span class="text-xs font-mono px-1.5 py-0.5 rounded text-gray-400 bg-gray-700 shrink-0 mt-0.5">${arcLabel}</span>
                        <span class="text-gray-300 flex-1 leading-snug">${clean}</span>
                        <button class="open-question-btn shrink-0 text-xs text-blue-400 hover:text-blue-300 ml-2"
                            data-file="${q.file}" data-arc="${q.arc}">Open →</button>
                    </li>`;
                }).join('');

                // Wire "Open →" buttons
                el.querySelectorAll('.open-question-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const file = btn.dataset.file;
                        const arc = btn.dataset.arc;
                        if (window.editorAPI && typeof window.editorAPI.openStory === 'function') {
                            const arcLabel = (ARC_LABEL[arc] || arc).toUpperCase();
                            window.editorAPI.openStory({
                                file,
                                title: `${arcLabel} — Questions`,
                                arc,
                            });
                        }
                    });
                });
            })
            .catch(() => {
                el.innerHTML = '<li class="text-gray-500 text-sm italic">Could not load questions.</li>';
            });
    }

    // -----------------------------------------------------------------------
    // Ready-to-promote strip (Sprint O6.2)
    // -----------------------------------------------------------------------
    const PROMOTION_STORAGE_KEY = 'dashboardRecommender.promotionExpanded';

    function renderPromotionStrip(el) {
        if (!el) return;

        const isStatic = window.location.hostname !== 'localhost' &&
                         window.location.hostname !== '127.0.0.1';

        const stories = window.allStories || [];
        const candidates = stories
            .filter(s => s.status === 'draft' && s.word_count > 1500
                && !s.file.includes('QUESTIONS')
                && !s.file.startsWith('_'))
            .sort((a, b) => b.word_count - a.word_count);

        if (!candidates.length) {
            el.classList.add('hidden');
            return;
        }

        el.classList.remove('hidden');

        const expanded = localStorage.getItem(PROMOTION_STORAGE_KEY) === 'true';
        const count = candidates.length;

        const listHtml = candidates.map(s => {
            const kw = (s.word_count / 1000).toFixed(1);
            const title = s.title.length > 50 ? s.title.slice(0, 47) + '…' : s.title;
            const markBtn = isStatic
                ? ''
                : `<button class="mark-ready-btn text-xs px-2 py-0.5 rounded bg-green-700 hover:bg-green-600 text-white ml-2"
                      data-file="${s.file}">Mark ready →</button>`;
            return `<div class="flex items-center gap-2 text-sm py-1 border-b border-gray-700 last:border-0">
                <span class="text-gray-300 flex-1">${title}</span>
                <span class="text-gray-500 text-xs">(${kw}K)</span>
                ${markBtn}
            </div>`;
        }).join('');

        el.innerHTML = `
            <div class="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <div class="flex items-center justify-between px-4 py-2 cursor-pointer select-none promotion-toggle"
                     style="background:#1a2332;">
                    <span class="text-sm font-medium text-blue-300">
                        ${count} draft${count !== 1 ? 's' : ''} above 1500 words may be ready to promote
                    </span>
                    <span class="text-xs text-gray-400 ml-4 promotion-chevron">${expanded ? '▲ Hide' : '▼ Show'}</span>
                </div>
                <div class="promotion-list px-4 py-2 ${expanded ? '' : 'hidden'}">${listHtml}</div>
            </div>
        `;

        // Toggle expand/collapse
        el.querySelector('.promotion-toggle').addEventListener('click', () => {
            const list = el.querySelector('.promotion-list');
            const chevron = el.querySelector('.promotion-chevron');
            const isNowExpanded = list.classList.toggle('hidden');
            // isNowExpanded is true when it WAS visible and now hidden
            chevron.textContent = isNowExpanded ? '▼ Show' : '▲ Hide';
            localStorage.setItem(PROMOTION_STORAGE_KEY, isNowExpanded ? 'false' : 'true');
        });

        if (!isStatic) {
            // Wire "Mark ready →" buttons
            el.querySelectorAll('.mark-ready-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const file = btn.dataset.file;
                    promoteStoryToReady(file, btn);
                });
            });
        }
    }

    function promoteStoryToReady(file, btn) {
        btn.disabled = true;
        btn.textContent = '…';

        // Fetch current file content, update status in frontmatter, save
        fetch(`/LexDocs/${file}`)
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.text();
            })
            .then(content => {
                const updated = updateFrontmatterStatus(content, 'ready');
                return fetch('/api/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ file, content: updated }),
                });
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    btn.textContent = 'Promoted!';
                    btn.classList.remove('bg-green-700', 'hover:bg-green-600');
                    btn.classList.add('bg-gray-600');
                    // Update allStories in memory so the strip re-renders correctly
                    const story = (window.allStories || []).find(s => s.file === file);
                    if (story) story.status = 'ready';
                } else {
                    btn.disabled = false;
                    btn.textContent = 'Error';
                }
            })
            .catch(() => {
                btn.disabled = false;
                btn.textContent = 'Error';
            });
    }

    // Replaces `status: draft` (or any other status) in YAML frontmatter.
    // Returns the updated content string (immutable — original unchanged).
    function updateFrontmatterStatus(content, newStatus) {
        const fmMatch = content.match(/^(---\n)([\s\S]*?)(\n---)/);
        if (!fmMatch) return content;
        const updatedFm = fmMatch[2].replace(/^status:\s*.+$/m, `status: ${newStatus}`);
        return content.slice(0, fmMatch.index)
            + fmMatch[1] + updatedFm + fmMatch[3]
            + content.slice(fmMatch.index + fmMatch[0].length);
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
        renderOpenQuestions(document.getElementById('open-questions-list'));
        renderPromotionStrip(document.getElementById('promotion-strip'));
    }

    window.dashboardRecommender = {
        renderAll,
        renderNextSteps,
        renderTimelineGaps,
        renderReadyToExpand,
        renderArcProgress,
        renderArcStatus,
        computeArcNarrativeGaps,
        renderOpenQuestions,
        renderPromotionStrip,
    };
})();
