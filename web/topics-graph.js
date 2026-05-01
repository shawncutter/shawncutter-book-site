/* Topics page visualizations: D3 force-directed network graph + cluster cards.
 *
 * Extracted from web/index.html in Wave B-4 (S1.5 cleanup).
 *
 * Exposes:
 *   window.topicsGraph = { renderNetworkGraph, renderClusters }
 *
 * Reads:
 *   window.topicsData         (set by the dashboard's loadData/loadTopicsData)
 *   d3                        (loaded via CDN as a global)
 *
 * Calls:
 *   window.openExpansionModal (cluster card click → expansion modal in index.html)
 *
 * Both functions are no-ops until window.topicsData is populated; they're safe
 * to call early.
 */
(function setupTopicsGraph() {
    function renderNetworkGraph() {
        const topicsData = window.topicsData;
        if (!topicsData) return;

        const container = document.getElementById('network-graph');
        if (!container) return;

        // Get width - use fallback if container is hidden (clientWidth = 0)
        let width = container.clientWidth;
        if (width === 0) {
            width = container.parentElement?.clientWidth || 800;
        }
        if (width === 0) width = 800;

        const height = 400;

        container.innerHTML = '';

        const nodes = [];
        const links = [];
        const nodeMap = {};

        Object.entries(topicsData.themes || {}).forEach(([theme, data]) => {
            const id = `theme-${theme}`;
            const count = data.stories ? data.stories.length : 0;
            nodeMap[id] = { id, name: theme, type: 'theme', count };
            nodes.push(nodeMap[id]);
        });

        Object.entries(topicsData.people || {}).forEach(([person, data]) => {
            const id = `person-${person}`;
            const count = data.stories ? data.stories.length : 0;
            nodeMap[id] = { id, name: data.name || person, type: 'person', count };
            nodes.push(nodeMap[id]);
        });

        const storySet = new Set();
        Object.values(topicsData.themes || {}).forEach(themeData => {
            const stories = themeData.stories || [];
            stories.slice(0, 3).forEach(s => storySet.add(s));
        });

        storySet.forEach(story => {
            const id = `story-${story}`;
            const shortName = story.replace(/^bk1?-/, '').replace('.md', '').substring(0, 20);
            nodeMap[id] = { id, name: shortName, type: 'story', fullName: story };
            nodes.push(nodeMap[id]);
        });

        Object.entries(topicsData.themes || {}).forEach(([theme, themeData]) => {
            const stories = themeData.stories || [];
            stories.slice(0, 3).forEach(story => {
                const storyId = `story-${story}`;
                if (nodeMap[storyId]) {
                    links.push({ source: `theme-${theme}`, target: storyId });
                }
            });
        });

        Object.entries(topicsData.people || {}).forEach(([person, personData]) => {
            const stories = personData.stories || [];
            stories.forEach(story => {
                const storyId = `story-${story}`;
                if (nodeMap[storyId]) {
                    links.push({ source: `person-${person}`, target: storyId });
                }
            });
        });

        const svg = d3.select('#network-graph')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(80))
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(30));

        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('stroke', '#4b5563')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', 1);

        const node = svg.append('g')
            .selectAll('circle')
            .data(nodes)
            .enter().append('circle')
            .attr('r', d => d.type === 'theme' ? 12 : d.type === 'person' ? 10 : 6)
            .attr('fill', d => d.type === 'theme' ? '#3b82f6' : d.type === 'person' ? '#a855f7' : '#22c55e')
            .attr('stroke', '#1f2937')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        const label = svg.append('g')
            .selectAll('text')
            .data(nodes)
            .enter().append('text')
            .text(d => d.name)
            .attr('font-size', d => d.type === 'story' ? '8px' : '10px')
            .attr('fill', '#9ca3af')
            .attr('text-anchor', 'middle')
            .attr('dy', d => d.type === 'theme' ? 25 : 20);

        node.append('title')
            .text(d => d.fullName || d.name);

        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('cx', d => d.x = Math.max(20, Math.min(width - 20, d.x)))
                .attr('cy', d => d.y = Math.max(20, Math.min(height - 20, d.y)));

            label
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        });

        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
    }

    function renderClusters() {
        const topicsData = window.topicsData;
        if (!topicsData || !topicsData.clusters) return;

        const container = document.getElementById('clusters-container');
        if (!container) return;

        let html = '';
        const clusterKeys = Object.keys(topicsData.clusters);

        clusterKeys.forEach((key, idx) => {
            const cluster = topicsData.clusters[key];
            const storyCount = cluster.stories ? cluster.stories.length : 0;
            const colors = ['from-purple-900/30 to-blue-900/30', 'from-blue-900/30 to-green-900/30',
                           'from-green-900/30 to-yellow-900/30', 'from-pink-900/30 to-red-900/30',
                           'from-yellow-900/30 to-orange-900/30', 'from-red-900/30 to-pink-900/30'];
            const colorClass = colors[idx % colors.length];
            const borderColors = ['border-purple-500', 'border-blue-500', 'border-green-500',
                                 'border-pink-500', 'border-yellow-500', 'border-red-500'];
            const borderColor = borderColors[idx % borderColors.length];

            html += `
                <div class="group relative bg-gradient-to-br ${colorClass} rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-gray-600/20 hover:scale-105 border-l-4 ${borderColor} overflow-hidden cluster-card" data-key="${key}">
                    <div class="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 group-hover:bg-white/10 transition"></div>

                    <div class="relative z-10">
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex-1">
                                <h4 class="font-bold text-lg text-gray-100 mb-1">${cluster.title}</h4>
                                <p class="text-xs text-gray-400">Chapter candidate</p>
                            </div>
                            <span class="text-2xl font-bold text-gray-400 opacity-20 group-hover:opacity-40 transition">${idx + 1}</span>
                        </div>

                        <p class="text-sm text-gray-300 mb-4 leading-relaxed">${cluster.description}</p>

                        <div class="flex items-center justify-between mb-4 p-3 bg-black/30 rounded">
                            <span class="text-sm font-semibold text-gray-300">Stories in cluster</span>
                            <span class="text-2xl font-bold text-white">${storyCount}</span>
                        </div>

                        <p class="text-xs text-gray-400 italic mb-4">💡 ${cluster.potential_expansion}</p>

                        <button class="w-full py-2 px-3 rounded bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition">
                            Explore & Combine →
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        document.querySelectorAll('.cluster-card').forEach(card => {
            card.addEventListener('click', () => {
                const key = card.dataset.key;
                if (typeof window.openExpansionModal === 'function') {
                    window.openExpansionModal(topicsData.clusters[key], key);
                }
            });
        });
    }

    window.topicsGraph = { renderNetworkGraph, renderClusters };
})();
