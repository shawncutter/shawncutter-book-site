/* Backlog UI (load, render, modal, status cycling, CRUD).
 *
 * Extracted from web/index.html in Wave B-4 (S1.5 cleanup).
 *
 * Owns the #backlog section: stats, filtered/sorted list, add/edit modal,
 * quick status cycle button, and the lazy-load on first nav click.
 *
 * Depends on (loaded earlier in the page):
 *   - DOM:        #btn-add-backlog, #backlog-modal*, #backlog-priority-filter,
 *                 #backlog-status-filter, #backlog-items, #backlog-{total,todo,in-progress,done}
 *   - window.showSaveStatus(message, color)  (defined in the inline bootstrap script)
 *
 * Storage:
 *   GET  ../LexDocs/_backlog.json
 *   POST /api/backlog  { action: add|update|delete, item, id }
 */
(function setupBacklog() {
    let backlogData = null;
    let editingBacklogId = null;
    let currentPriorityFilter = 'all';
    let currentBacklogStatusFilter = 'all';

    function notify(msg, color) {
        if (typeof window.showSaveStatus === 'function') {
            window.showSaveStatus(msg, color);
        }
    }

    function escapeHtml(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
        }[c]));
    }

    async function loadBacklogData() {
        try {
            const res = await fetch('../LexDocs/_backlog.json');
            const raw = await res.json();
            const items = (raw.items || raw.backlog || []).map(item => ({
                ...item,
                status: item.status === 'planned' ? 'todo'
                      : item.status === 'completed' ? 'done'
                      : item.status || 'todo'
            }));
            backlogData = { metadata: raw.metadata || {}, items };
            renderBacklog();
            updateBacklogStats();
        } catch (e) {
            console.error('Error loading backlog:', e);
            backlogData = { metadata: {}, items: [] };
            renderBacklog();
        }
    }

    function updateBacklogStats() {
        if (!backlogData) return;
        const items = backlogData.items;
        document.getElementById('backlog-total').textContent = items.length;
        document.getElementById('backlog-todo').textContent = items.filter(i => i.status === 'todo').length;
        document.getElementById('backlog-in-progress').textContent = items.filter(i => i.status === 'in_progress').length;
        document.getElementById('backlog-done').textContent = items.filter(i => i.status === 'done').length;
    }

    function renderBacklog() {
        if (!backlogData) return;
        const container = document.getElementById('backlog-items');

        let items = backlogData.items.filter(item => {
            const priorityMatch = currentPriorityFilter === 'all' || item.priority === currentPriorityFilter;
            const statusMatch = currentBacklogStatusFilter === 'all' || item.status === currentBacklogStatusFilter;
            return priorityMatch && statusMatch;
        });

        const priorityOrder = { 'P3': 1, 'P4': 2, 'P5': 3, 'P6': 4, 'P7': 5, 'P8': 6, 'P9': 7, 'quick': 8 };
        const statusOrder = { 'in_progress': 1, 'todo': 2, 'done': 3 };
        items.sort((a, b) => {
            const pDiff = (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
            if (pDiff !== 0) return pDiff;
            return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
        });

        if (items.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No items match the current filters</p>';
            return;
        }

        let html = '';
        let currentPriority = '';

        items.forEach(item => {
            if (item.priority !== currentPriority) {
                currentPriority = item.priority;
                const priorityLabels = {
                    'P3': 'P3 - Publishing & Export',
                    'P4': 'P4 - Writing Experience',
                    'P5': 'P5 - Organization',
                    'P6': 'P6 - Analytics',
                    'P7': 'P7 - Collaboration',
                    'P8': 'P8 - Infrastructure',
                    'P9': 'P9 - Platform Expansion',
                    'quick': 'Quick Wins'
                };
                html += `<h3 class="text-lg font-bold mt-6 mb-2 text-gray-300">${priorityLabels[currentPriority] || currentPriority}</h3>`;
            }

            const statusColors = {
                'todo': 'bg-yellow-900 border-yellow-700 text-yellow-300',
                'in_progress': 'bg-blue-900 border-blue-700 text-blue-300',
                'done': 'bg-green-900 border-green-700 text-green-300'
            };
            const statusLabels = { 'todo': 'To Do', 'in_progress': 'In Progress', 'done': 'Done' };

            html += `
                <div class="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-4 hover:border-gray-600 cursor-pointer backlog-item" data-id="${escapeHtml(item.id)}">
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <span class="${item.status === 'done' ? 'line-through text-gray-500' : ''}">${escapeHtml(item.title)}</span>
                            <span class="text-xs px-2 py-0.5 rounded ${statusColors[item.status]} border">${escapeHtml(statusLabels[item.status])}</span>
                        </div>
                        ${item.category ? `<span class="text-xs text-gray-500">${escapeHtml(item.category)}</span>` : ''}
                        ${item.description ? `<p class="text-sm text-gray-400 mt-1">${escapeHtml(item.description)}</p>` : ''}
                    </div>
                    <div class="flex gap-2">
                        <button class="backlog-status-btn px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600" data-id="${escapeHtml(item.id)}" data-action="cycle">
                            ⟳
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        container.querySelectorAll('.backlog-item').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target.classList.contains('backlog-status-btn')) return;
                const id = parseInt(el.dataset.id);
                openBacklogModal(id);
            });
        });

        container.querySelectorAll('.backlog-status-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const item = backlogData.items.find(i => i.id === id);
                if (!item) return;

                const cycle = { 'todo': 'in_progress', 'in_progress': 'done', 'done': 'todo' };
                const newStatus = cycle[item.status] || 'todo';

                await updateBacklogItem(id, { status: newStatus });
            });
        });
    }

    function openBacklogModal(id = null) {
        editingBacklogId = id;
        const modal = document.getElementById('backlog-modal');
        const deleteBtn = document.getElementById('backlog-modal-delete');

        if (id) {
            const item = backlogData.items.find(i => i.id === id);
            if (!item) return;

            document.getElementById('backlog-modal-title').textContent = 'Edit Backlog Item';
            document.getElementById('backlog-item-title').value = item.title || '';
            document.getElementById('backlog-item-priority').value = item.priority || 'P4';
            document.getElementById('backlog-item-status').value = item.status || 'todo';
            document.getElementById('backlog-item-category').value = item.category || '';
            document.getElementById('backlog-item-description').value = item.description || '';
            deleteBtn.classList.remove('hidden');
        } else {
            document.getElementById('backlog-modal-title').textContent = 'Add Backlog Item';
            document.getElementById('backlog-item-title').value = '';
            document.getElementById('backlog-item-priority').value = 'P4';
            document.getElementById('backlog-item-status').value = 'todo';
            document.getElementById('backlog-item-category').value = '';
            document.getElementById('backlog-item-description').value = '';
            deleteBtn.classList.add('hidden');
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.getElementById('backlog-item-title').focus();
    }

    function closeBacklogModal() {
        const modal = document.getElementById('backlog-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        editingBacklogId = null;
    }

    async function saveBacklogItem() {
        const title = document.getElementById('backlog-item-title').value.trim();
        if (!title) {
            alert('Please enter a title');
            return;
        }

        const item = {
            title,
            priority: document.getElementById('backlog-item-priority').value,
            status: document.getElementById('backlog-item-status').value,
            category: document.getElementById('backlog-item-category').value.trim(),
            description: document.getElementById('backlog-item-description').value.trim()
        };

        try {
            const action = editingBacklogId ? 'update' : 'add';
            const res = await fetch('/api/backlog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, item, id: editingBacklogId })
            });

            if (res.ok) {
                const data = await res.json();
                backlogData = data.backlog;
                renderBacklog();
                updateBacklogStats();
                closeBacklogModal();
                notify(editingBacklogId ? 'Item updated!' : 'Item added!', 'green');
            } else {
                notify('Failed to save', 'yellow');
            }
        } catch (e) {
            notify('Error: ' + e.message, 'yellow');
        }
    }

    async function updateBacklogItem(id, updates) {
        try {
            const res = await fetch('/api/backlog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update', item: updates, id })
            });

            if (res.ok) {
                const data = await res.json();
                backlogData = data.backlog;
                renderBacklog();
                updateBacklogStats();
            }
        } catch (e) {
            console.error('Error updating backlog item:', e);
        }
    }

    async function deleteBacklogItem() {
        if (!editingBacklogId) return;
        if (!confirm('Delete this item?')) return;

        try {
            const res = await fetch('/api/backlog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', id: editingBacklogId })
            });

            if (res.ok) {
                const data = await res.json();
                backlogData = data.backlog;
                renderBacklog();
                updateBacklogStats();
                closeBacklogModal();
                notify('Item deleted', 'green');
            }
        } catch (e) {
            notify('Error: ' + e.message, 'yellow');
        }
    }

    // Wire up DOM event listeners. The HTML is already in the document by the time
    // this script (loaded at end of <body>) runs.
    document.getElementById('btn-add-backlog').addEventListener('click', () => openBacklogModal());
    document.getElementById('backlog-modal-cancel').addEventListener('click', closeBacklogModal);
    document.getElementById('backlog-modal-save').addEventListener('click', saveBacklogItem);
    document.getElementById('backlog-modal-delete').addEventListener('click', deleteBacklogItem);

    document.getElementById('backlog-priority-filter').addEventListener('change', (e) => {
        currentPriorityFilter = e.target.value;
        renderBacklog();
    });

    document.getElementById('backlog-status-filter').addEventListener('change', (e) => {
        currentBacklogStatusFilter = e.target.value;
        renderBacklog();
    });

    // Lazy load on first nav click
    document.querySelector('[data-section="backlog"]').addEventListener('click', () => {
        if (!backlogData) {
            loadBacklogData();
        }
    });
})();
