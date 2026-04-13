/**
 * Feedback Panel UI Logic
 * Handles feedback form submission, display, and resolution
 */

const feedbackUI = {
    currentStoryFile: null,
    feedbackData: null,

    // Initialize feedback panel for a story
    async init(storyFile) {
        this.currentStoryFile = storyFile;
        await this.loadStoryContent();
        await this.loadFeedback();
        this.renderFeedbackList();
    },

    // Load story content and extract paragraphs
    async loadStoryContent() {
        try {
            const response = await fetch(`/LexDocs/${this.currentStoryFile}`);
            const markdown = await response.text();

            // Parse markdown to identify paragraphs
            const lines = markdown.split('\n');
            const paragraphs = [];
            let currentPara = '';
            let paraIndex = 1;

            lines.forEach((line, idx) => {
                if (line.trim() === '') {
                    if (currentPara.trim()) {
                        paragraphs.push({
                            id: `p${paraIndex}`,
                            content: currentPara.trim(),
                            lineStart: idx
                        });
                        paraIndex++;
                        currentPara = '';
                    }
                } else {
                    currentPara += (currentPara ? '\n' : '') + line;
                }
            });

            if (currentPara.trim()) {
                paragraphs.push({
                    id: `p${paraIndex}`,
                    content: currentPara.trim()
                });
            }

            // Populate paragraph dropdown
            const paragraphSelect = document.getElementById('feedback-paragraph');
            paragraphSelect.innerHTML = '<option value="">Select paragraph...</option>';
            paragraphs.forEach(para => {
                const option = document.createElement('option');
                option.value = para.id;
                option.textContent = `${para.id}: ${para.content.substring(0, 40)}...`;
                paragraphSelect.appendChild(option);
            });

            return paragraphs;
        } catch (e) {
            console.error('Failed to load story content:', e);
            return [];
        }
    },

    // Load feedback from server
    async loadFeedback() {
        try {
            const response = await fetch(`/api/feedback/${this.currentStoryFile}`);
            this.feedbackData = await response.json();
        } catch (e) {
            console.error('Failed to load feedback:', e);
            this.feedbackData = { feedback: [] };
        }
    },

    // Render feedback items in the panel
    renderFeedbackList() {
        const feedbackList = document.getElementById('feedback-list');
        feedbackList.innerHTML = '';

        if (!this.feedbackData.feedback || this.feedbackData.feedback.length === 0) {
            feedbackList.innerHTML = '<p class="text-gray-400 text-sm">No feedback yet</p>';
            return;
        }

        this.feedbackData.feedback.forEach(item => {
            const feedbackEl = this.createFeedbackElement(item);
            feedbackList.appendChild(feedbackEl);
        });
    },

    // Create a single feedback item element
    createFeedbackElement(item) {
        const container = document.createElement('div');
        const typeEmoji = this.getTypeEmoji(item.type);
        const resolvedClass = item.resolved ? 'opacity-60' : '';
        const resolvedBg = item.resolved ? 'bg-gray-700' : this.getTypeBgColor(item.type);

        container.className = `p-3 rounded ${resolvedBg} ${resolvedClass}`;
        container.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <span class="text-sm font-semibold">${typeEmoji} ${this.getTypeLabel(item.type)}</span>
                <span class="text-xs text-gray-400">${item.author}</span>
            </div>
            <p class="text-sm text-gray-100 mb-2">${item.content}</p>
            <p class="text-xs text-gray-400 mb-2">Paragraph: <code>${item.paragraph_id}</code></p>
            ${!item.resolved ? `
                <button class="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded resolve-feedback-btn" data-feedback-id="${item.id}">
                    Mark Resolved
                </button>
            ` : `
                <p class="text-xs text-gray-400">✓ Resolved</p>
            `}
        `;

        // Attach resolve handler
        const resolveBtn = container.querySelector('.resolve-feedback-btn');
        if (resolveBtn) {
            resolveBtn.addEventListener('click', () => this.resolveFeedback(item.id));
        }

        return container;
    },

    // Get emoji for feedback type
    getTypeEmoji(type) {
        const emojis = {
            voice_rewrite: '🎯',
            grammar: '✍️',
            add_detail: '💭',
            unclear: '❓',
            carina_note: '👋',
            approved: '✅'
        };
        return emojis[type] || '💬';
    },

    // Get label for feedback type
    getTypeLabel(type) {
        const labels = {
            voice_rewrite: 'Voice Rewrite',
            grammar: 'Grammar',
            add_detail: 'Add Detail',
            unclear: 'Unclear',
            carina_note: "Carina's Note",
            approved: 'Approved'
        };
        return labels[type] || type;
    },

    // Get background color for feedback type
    getTypeBgColor(type) {
        const colors = {
            voice_rewrite: 'bg-yellow-900',
            grammar: 'bg-red-900',
            add_detail: 'bg-blue-900',
            unclear: 'bg-purple-900',
            carina_note: 'bg-pink-900',
            approved: 'bg-green-900'
        };
        return colors[type] || 'bg-gray-700';
    },

    // Add new feedback
    async addFeedback() {
        const type = document.getElementById('feedback-type').value;
        const author = document.getElementById('feedback-author').value;
        const content = document.getElementById('feedback-content').value;
        const paragraphId = document.getElementById('feedback-paragraph').value;

        if (!type || !content || !paragraphId) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('/api/feedback/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storyFile: this.currentStoryFile,
                    author,
                    type,
                    paragraphId,
                    content
                })
            });

            const result = await response.json();
            if (result.success) {
                // Clear form
                document.getElementById('feedback-type').value = '';
                document.getElementById('feedback-content').value = '';
                document.getElementById('feedback-paragraph').value = '';

                // Reload and render
                await this.loadFeedback();
                this.renderFeedbackList();
            }
        } catch (e) {
            console.error('Failed to add feedback:', e);
            alert('Error adding feedback');
        }
    },

    // Resolve feedback
    async resolveFeedback(feedbackId) {
        try {
            const response = await fetch('/api/feedback/resolve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storyFile: this.currentStoryFile,
                    feedbackId
                })
            });

            const result = await response.json();
            if (result.success) {
                await this.loadFeedback();
                this.renderFeedbackList();
            }
        } catch (e) {
            console.error('Failed to resolve feedback:', e);
            alert('Error resolving feedback');
        }
    }
};

// Attach event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const addFeedbackBtn = document.getElementById('add-feedback-btn');
    if (addFeedbackBtn) {
        addFeedbackBtn.addEventListener('click', () => feedbackUI.addFeedback());
    }
});
