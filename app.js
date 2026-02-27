// Main Application Logic

class CareerVisualizer {
    constructor() {
        this.currentEmploymentId = null;
        this.currentAssignmentId = null;
        this.currentEditingIds = {
            employment: null,
            assignment: null,
            tag: null
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderEmployments();
        this.renderTimeline();
        this.renderTagsOverview();
    }

    // Event Binding
    bindEvents() {
        // Header actions
        document.getElementById('export-btn').addEventListener('click', () => this.exportData());
        document.getElementById('import-btn').addEventListener('click', () => this.openImportDialog());
        document.getElementById('import-file').addEventListener('change', (e) => this.importData(e));
        document.getElementById('concise-view-btn').addEventListener('click', () => this.openConciseViewModal());

        // Employment actions
        document.getElementById('add-employment-btn').addEventListener('click', () => this.openEmploymentModal());
        
        // Modal close events
        document.querySelectorAll('.close, .close-modal').forEach(element => {
            element.addEventListener('click', (e) => this.closeModal(e));
        });

        // Form submissions
        document.getElementById('employment-form').addEventListener('submit', (e) => this.handleEmploymentSubmit(e));
        document.getElementById('assignment-form').addEventListener('submit', (e) => this.handleAssignmentSubmit(e));
        document.getElementById('tag-form').addEventListener('submit', (e) => this.handleTagSubmit(e));

        // Tag filters
        document.querySelectorAll('.tag-filter').forEach(filter => {
            filter.addEventListener('click', (e) => this.handleTagFilter(e));
        });

        // Concise view event handlers
        this.bindConciseViewEvents();

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e);
            }
        });
    }

    // Employment Management
    openEmploymentModal(employmentId = null) {
        const modal = document.getElementById('employment-modal');
        const title = document.getElementById('employment-modal-title');
        const form = document.getElementById('employment-form');

        this.currentEditingIds.employment = employmentId;

        if (employmentId) {
            const employment = dataStore.getEmployment(employmentId);
            title.textContent = 'Edit Employment';
            document.getElementById('emp-title').value = employment.title;
            document.getElementById('emp-company').value = employment.company;
            document.getElementById('emp-start-date').value = employment.startDate;
            document.getElementById('emp-end-date').value = employment.endDate || '';
        } else {
            title.textContent = 'Add Employment';
            form.reset();
        }

        modal.classList.add('active');
    }

    handleEmploymentSubmit(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('emp-title').value,
            company: document.getElementById('emp-company').value,
            startDate: document.getElementById('emp-start-date').value,
            endDate: document.getElementById('emp-end-date').value || null
        };

        // Validate date range
        if (!DateUtils.isValidDateRange(formData.startDate, formData.endDate)) {
            alert('Invalid date range. End date must be after start date.');
            return;
        }

        if (this.currentEditingIds.employment) {
            dataStore.updateEmployment(this.currentEditingIds.employment, formData);
        } else {
            dataStore.createEmployment(formData);
        }

        this.closeModal();
        this.renderEmployments();
        this.renderTimeline();
    }

    deleteEmployment(employmentId) {
        if (confirm('Are you sure? This will also delete all related assignments and tags.')) {
            dataStore.deleteEmployment(employmentId);
            this.renderEmployments();
            this.renderTimeline();
            this.renderTagsOverview();
        }
    }

    // Assignment Management
    openAssignmentModal(employmentId, assignmentId = null) {
        const modal = document.getElementById('assignment-modal');
        const title = document.getElementById('assignment-modal-title');
        const form = document.getElementById('assignment-form');

        this.currentEmploymentId = employmentId;
        this.currentEditingIds.assignment = assignmentId;

        if (assignmentId) {
            const assignment = dataStore.getAssignment(assignmentId);
            title.textContent = 'Edit Assignment';
            document.getElementById('assign-title').value = assignment.title;
            document.getElementById('assign-description').value = assignment.description;
            document.getElementById('assign-start-date').value = assignment.startDate;
            document.getElementById('assign-end-date').value = assignment.endDate || '';
        } else {
            title.textContent = 'Add Assignment';
            form.reset();
        }

        modal.classList.add('active');
    }

    handleAssignmentSubmit(e) {
        e.preventDefault();
        
        const formData = {
            employmentId: this.currentEmploymentId,
            title: document.getElementById('assign-title').value,
            description: document.getElementById('assign-description').value,
            startDate: document.getElementById('assign-start-date').value,
            endDate: document.getElementById('assign-end-date').value || null
        };

        // Validate date range
        if (!DateUtils.isValidDateRange(formData.startDate, formData.endDate)) {
            alert('Invalid date range. End date must be after start date.');
            return;
        }

        if (this.currentEditingIds.assignment) {
            dataStore.updateAssignment(this.currentEditingIds.assignment, formData);
        } else {
            dataStore.createAssignment(formData);
        }

        this.closeModal();
        this.renderEmployments();
        this.renderTimeline();
    }

    deleteAssignment(assignmentId) {
        if (confirm('Are you sure? This will also delete all related tags.')) {
            dataStore.deleteAssignment(assignmentId);
            this.renderEmployments();
            this.renderTimeline();
            this.renderTagsOverview();
        }
    }

    // Tag Management
    openTagModal(assignmentId, tagId = null) {
        const modal = document.getElementById('tag-modal');
        const title = document.getElementById('tag-modal-title');
        const form = document.getElementById('tag-form');

        this.currentAssignmentId = assignmentId;
        this.currentEditingIds.tag = tagId;

        if (tagId) {
            const tag = dataStore.getTag(tagId);
            title.textContent = 'Edit Experience Tag';
            document.getElementById('tag-name').value = tag.name;
            document.getElementById('tag-category').value = tag.category;
            document.getElementById('tag-description').value = tag.description;
        } else {
            title.textContent = 'Add Experience Tag';
            form.reset();
        }

        modal.classList.add('active');
    }

    handleTagSubmit(e) {
        e.preventDefault();
        
        const formData = {
            assignmentId: this.currentAssignmentId,
            name: document.getElementById('tag-name').value,
            category: document.getElementById('tag-category').value,
            description: document.getElementById('tag-description').value
        };

        if (this.currentEditingIds.tag) {
            dataStore.updateTag(this.currentEditingIds.tag, formData);
        } else {
            dataStore.createTag(formData);
        }

        this.closeModal();
        this.renderEmployments();
        this.renderTagsOverview();
    }

    deleteTag(tagId) {
        if (confirm('Are you sure you want to delete this tag?')) {
            dataStore.deleteTag(tagId);
            this.renderEmployments();
            this.renderTagsOverview();
        }
    }

    // Modal Management
    closeModal(e = null) {
        if (e) e.preventDefault();
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        this.currentEmploymentId = null;
        this.currentAssignmentId = null;
        this.currentEditingIds = { employment: null, assignment: null, tag: null };
    }

    // Rendering Methods
    renderEmployments() {
        const container = document.getElementById('employment-list');
        const employments = dataStore.getEmployments();

        if (employments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No employment history yet</h3>
                    <p>Start by adding your first employment experience.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = employments.map(employment => {
            const assignments = dataStore.getAssignments(employment.id);
            const duration = DateUtils.calculateDuration(employment.startDate, employment.endDate);
            
            return `
                <div class="employment-card" data-employment-id="${employment.id}">
                    <div class="employment-header">
                        <div class="employment-info">
                            <h3>${this.escapeHtml(employment.title)}</h3>
                            <div class="company">${this.escapeHtml(employment.company)}</div>
                            <div class="dates">
                                ${DateUtils.formatDateRange(employment.startDate, employment.endDate)} 
                                (${duration})
                            </div>
                        </div>
                        <div class="employment-actions">
                            <button class="btn btn-small btn-secondary" onclick="app.openEmploymentModal(${employment.id})">
                                Edit
                            </button>
                            <button class="btn btn-small btn-danger" onclick="app.deleteEmployment(${employment.id})">
                                Delete
                            </button>
                        </div>
                    </div>
                    
                    <div class="assignments-section">
                        <div class="assignments-header">
                            <h4>Assignments (${assignments.length})</h4>
                            <button class="btn btn-small btn-primary" onclick="app.openAssignmentModal(${employment.id})">
                                Add Assignment
                            </button>
                        </div>
                        <div class="assignments-list">
                            ${this.renderAssignments(assignments)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderAssignments(assignments) {
        if (assignments.length === 0) {
            return `
                <div class="empty-state">
                    <p>No assignments yet. Add your first assignment to start tracking experiences.</p>
                </div>
            `;
        }

        return assignments.map(assignment => {
            const tags = dataStore.getTags(assignment.id);
            const duration = DateUtils.calculateDuration(assignment.startDate, assignment.endDate);
            
            return `
                <div class="assignment-card" data-assignment-id="${assignment.id}">
                    <div class="assignment-header">
                        <div class="assignment-info">
                            <h4>${this.escapeHtml(assignment.title)}</h4>
                            <div class="dates">
                                ${DateUtils.formatDateRange(assignment.startDate, assignment.endDate)} 
                                (${duration})
                            </div>
                        </div>
                        <div class="assignment-actions">
                            <button class="btn btn-small btn-secondary" onclick="app.openAssignmentModal(${assignment.employmentId}, ${assignment.id})">
                                Edit
                            </button>
                            <button class="btn btn-small btn-danger" onclick="app.deleteAssignment(${assignment.id})">
                                Delete
                            </button>
                        </div>
                    </div>
                    
                    ${assignment.description ? `
                        <div class="assignment-description">
                            ${this.escapeHtml(assignment.description)}
                        </div>
                    ` : ''}
                    
                    <div class="tags-section">
                        <div class="tags-header">
                            <h5>Experience Tags (${tags.length})</h5>
                            <button class="btn btn-small btn-primary" onclick="app.openTagModal(${assignment.id})">
                                Add Tag
                            </button>
                        </div>
                        <div class="tags-list">
                            ${this.renderTags(tags)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderTags(tags) {
        if (tags.length === 0) {
            return '<p class="empty-state">No experience tags yet.</p>';
        }

        return tags.map(tag => {
            const categoryInfo = TagCategories[tag.category] || {};
            return `
                <span class="tag ${categoryInfo.className || ''}" title="${this.escapeHtml(tag.description)}">
                    ${this.escapeHtml(tag.name)}
                    <button class="tag-remove" onclick="app.deleteTag(${tag.id})" title="Remove tag">×</button>
                </span>
            `;
        }).join('');
    }

    renderTimeline() {
        const container = document.getElementById('timeline');
        const timelineData = dataStore.getTimelineData();

        if (timelineData.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>Your career timeline will appear here once you add employment history.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = timelineData.map(employment => {
            const duration = DateUtils.calculateDuration(employment.startDate, employment.endDate);
            
            // Count unique tags by creating a Set of tag names+categories combination
            const uniqueTags = new Set();
            employment.assignments.forEach(assignment => {
                assignment.tags.forEach(tag => {
                    uniqueTags.add(`${tag.name}_${tag.category}`);
                });
            });
            const uniqueTagsCount = uniqueTags.size;
            
            return `
                <div class="timeline-item">
                    <h3>${this.escapeHtml(employment.title)}</h3>
                    <div class="timeline-company">${this.escapeHtml(employment.company)}</div>
                    <div class="timeline-dates">
                        ${DateUtils.formatDateRange(employment.startDate, employment.endDate)} (${duration})
                    </div>
                    <div class="timeline-summary">
                        ${employment.assignments.length} assignment${employment.assignments.length !== 1 ? 's' : ''}, 
                        ${uniqueTagsCount} unique experience tag${uniqueTagsCount !== 1 ? 's' : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderTagsOverview() {
        const container = document.getElementById('tags-cloud');
        const tagCounts = dataStore.getTagCounts();
        const activeFilter = document.querySelector('.tag-filter.active').dataset.category;

        const filteredTags = activeFilter === 'all' 
            ? tagCounts 
            : tagCounts.filter(tag => tag.category === activeFilter);

        if (filteredTags.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No experience tags found for the selected category.</p>
                </div>
            `;
            return;
        }

        // Sort alphabetically by name
        filteredTags.sort((a, b) => a.name.localeCompare(b.name));

        container.innerHTML = filteredTags.map(tag => {
            const categoryInfo = TagCategories[tag.category] || {};
            const duration = this.formatDurationFromMonths(tag.totalMonths);
            return `
                <div class="tag-cloud-item ${categoryInfo.className || ''}"
                     style="background-color: ${categoryInfo.backgroundColor || '#e9ecef'};">
                    ${this.escapeHtml(tag.name)}
                    <div class="tag-stats">
                        <span class="duration">${duration}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Tag Filter Management
    handleTagFilter(e) {
        document.querySelectorAll('.tag-filter').forEach(filter => {
            filter.classList.remove('active');
        });
        e.target.classList.add('active');
        this.renderTagsOverview();
    }

    // Export/Import functionality
    exportData() {
        try {
            const jsonData = dataStore.exportData();
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `career-visualizer-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            
            alert('Data exported successfully!');
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export data. Please try again.');
        }
    }

    openImportDialog() {
        document.getElementById('import-file').click();
    }

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const result = dataStore.importData(event.target.result);
                if (result.success) {
                    this.renderEmployments();
                    this.renderTimeline();
                    this.renderTagsOverview();
                    alert(result.message);
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Import error:', error);
                alert('Failed to import data. Please check the file format.');
            }
        };
        reader.readAsText(file);
        
        // Reset the file input
        e.target.value = '';
    }

    // ===== CONCISE VIEW FUNCTIONALITY =====
    
    bindConciseViewEvents() {
        // Category filters in concise view modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-filter')) {
                document.querySelectorAll('.category-filter').forEach(filter => {
                    filter.classList.remove('active');
                });
                e.target.classList.add('active');
                this.renderTagSelectionGrid();
            }
        });

        // Concise view modal actions
        document.getElementById('select-all-tags').addEventListener('click', () => this.selectAllTags());
        document.getElementById('clear-all-tags').addEventListener('click', () => this.clearAllTags());
        document.getElementById('generate-report').addEventListener('click', () => this.generateConciseReport());
        document.getElementById('export-report').addEventListener('click', () => this.exportConciseReport());
        document.getElementById('back-to-selection').addEventListener('click', () => this.showTagSelection());
    }

    openConciseViewModal() {
        const modal = document.getElementById('concise-view-modal');
        this.showTagSelection();
        this.renderTagSelectionGrid();
        modal.classList.add('active');
    }

    showTagSelection() {
        document.querySelector('.tag-selection-section').style.display = 'block';
        document.getElementById('concise-report-results').style.display = 'none';
    }

    renderTagSelectionGrid() {
        const container = document.getElementById('tag-selection-grid');
        const activeFilter = document.querySelector('.category-filter.active').dataset.category;
        
        // Get all unique tags
        const allTags = dataStore.getTags();
        const uniqueTags = {};
        
        allTags.forEach(tag => {
            const key = `${tag.name}_${tag.category}`;
            if (!uniqueTags[key]) {
                uniqueTags[key] = {
                    name: tag.name,
                    category: tag.category,
                    count: 0,
                    tagIds: []
                };
            }
            uniqueTags[key].count++;
            uniqueTags[key].tagIds.push(tag.id);
        });

        // Filter by selected category
        const filteredTags = Object.values(uniqueTags).filter(tag => 
            activeFilter === 'all' || tag.category === activeFilter
        );

        // Sort alphabetically
        filteredTags.sort((a, b) => a.name.localeCompare(b.name));

        if (filteredTags.length === 0) {
            container.innerHTML = '<p class="empty-message">No tags found for the selected category.</p>';
            return;
        }

        container.innerHTML = filteredTags.map(tag => {
            const categoryInfo = TagCategories[tag.category] || {};
            return `
                <div class="tag-checkbox-item">
                    <input type="checkbox" id="tag-${tag.name}_${tag.category}" 
                           value="${tag.name}_${tag.category}" 
                           data-name="${this.escapeHtml(tag.name)}" 
                           data-category="${tag.category}">
                    <label for="tag-${tag.name}_${tag.category}" 
                           class="tag-label ${categoryInfo.className || ''}"
                           style="background-color: ${categoryInfo.backgroundColor || '#e9ecef'};">
                        ${this.escapeHtml(tag.name)}
                        <span class="tag-count">(${tag.count})</span>
                    </label>
                </div>
            `;
        }).join('');
    }

    selectAllTags() {
        const checkboxes = document.querySelectorAll('#tag-selection-grid input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = true);
    }

    clearAllTags() {
        const checkboxes = document.querySelectorAll('#tag-selection-grid input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
    }

    generateConciseReport() {
        const selectedTags = this.getSelectedTags();
        
        if (selectedTags.length === 0) {
            alert('Please select at least one tag to generate a report.');
            return;
        }

        // Get assignments that have any of the selected tags
        const assignmentMap = new Map();
        const allTags = dataStore.getTags();

        selectedTags.forEach(selectedTag => {
            allTags.forEach(tag => {
                if (tag.name === selectedTag.name && tag.category === selectedTag.category) {
                    const assignment = dataStore.getAssignment(tag.assignmentId);
                    if (assignment) {
                        if (!assignmentMap.has(assignment.id)) {
                            const employment = dataStore.getEmployment(assignment.employmentId);
                            assignmentMap.set(assignment.id, {
                                assignment: assignment,
                                employment: employment,
                                matchedTags: []
                            });
                        }
                        assignmentMap.get(assignment.id).matchedTags.push(tag);
                    }
                }
            });
        });

        // Convert to array and sort by start date (newest first)
        const reportData = Array.from(assignmentMap.values())
            .sort((a, b) => new Date(b.assignment.startDate) - new Date(a.assignment.startDate));

        this.renderConciseReport(reportData, selectedTags);
    }

    getSelectedTags() {
        const checkboxes = document.querySelectorAll('#tag-selection-grid input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => ({
            name: cb.dataset.name,
            category: cb.dataset.category
        }));
    }

    renderConciseReport(reportData, selectedTags) {
        const reportContent = document.getElementById('report-content');
        
        // Calculate totals - group by employment to avoid double-counting overlapping assignments
        let totalMonths = 0;
        const employmentGroups = new Map();
        
        // Group assignments by employment
        reportData.forEach(item => {
            if (!employmentGroups.has(item.employment.id)) {
                employmentGroups.set(item.employment.id, {
                    employment: item.employment,
                    assignments: []
                });
            }
            employmentGroups.get(item.employment.id).assignments.push(item);
        });
        
        // For each employment, use the employment duration (not sum of assignments)
        // to prevent overlapping assignments from being counted multiple times
        employmentGroups.forEach(group => {
            const employmentDuration = DateUtils.calculateDuration(group.employment.startDate, group.employment.endDate);
            const employmentMonths = this.parseDurationToMonths(employmentDuration);
            totalMonths += employmentMonths;
        });

        const totalDuration = this.formatDurationFromMonths(totalMonths);

        // Generate report HTML
        const reportHtml = `
            <div class="report-summary">
                <div class="summary-stats">
                    <div class="stat-item">
                        <span class="stat-label">Selected Tags:</span>
                        <span class="stat-value">${selectedTags.length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Matching Assignments:</span>
                        <span class="stat-value">${reportData.length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total Duration:</span>
                        <span class="stat-value">${totalDuration}</span>
                    </div>
                </div>
                
                <div class="selected-tags-list">
                    <h5>Selected Tags:</h5>
                    <div class="tags-display">
                        ${selectedTags.map(tag => {
                            const categoryInfo = TagCategories[tag.category] || {};
                            return `
                                <span class="selected-tag ${categoryInfo.className || ''}"
                                      style="background-color: ${categoryInfo.backgroundColor || '#e9ecef'};">
                                    ${this.escapeHtml(tag.name)}
                                </span>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>

            <div class="assignments-list">
                ${reportData.map(item => {
                    const duration = DateUtils.calculateDuration(item.assignment.startDate, item.assignment.endDate);
                    const dateRange = DateUtils.formatDateRange(item.assignment.startDate, item.assignment.endDate);
                    
                    return `
                        <div class="assignment-report-item">
                            <div class="assignment-header">
                                <h5>${this.escapeHtml(item.assignment.title)}</h5>
                                <div class="assignment-meta">
                                    <span class="company">${this.escapeHtml(item.employment.company)}</span>
                                    <span class="duration">${duration}</span>
                                </div>
                            </div>
                            <div class="assignment-period">${dateRange}</div>
                            ${item.assignment.description ? `<div class="assignment-description">${this.escapeHtml(item.assignment.description)}</div>` : ''}
                            <div class="matched-tags">
                                <strong>Matched Tags:</strong>
                                ${item.matchedTags.map(tag => {
                                    const categoryInfo = TagCategories[tag.category] || {};
                                    return `
                                        <span class="matched-tag ${categoryInfo.className || ''}"
                                              style="background-color: ${categoryInfo.backgroundColor || '#e9ecef'};">
                                            ${this.escapeHtml(tag.name)}
                                        </span>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        reportContent.innerHTML = reportHtml;
        
        // Show results and hide selection
        document.querySelector('.tag-selection-section').style.display = 'none';
        document.getElementById('concise-report-results').style.display = 'block';
    }

    parseDurationToMonths(durationText) {
        // Parse duration text back to months for calculations
        if (durationText.includes('< 1 month')) return 0.5;
        
        let totalMonths = 0;
        const yearMatch = durationText.match(/(\d+)\s+years?/);
        const monthMatch = durationText.match(/(\d+)\s+months?/);
        
        if (yearMatch) totalMonths += parseInt(yearMatch[1]) * 12;
        if (monthMatch) totalMonths += parseInt(monthMatch[1]);
        
        return totalMonths;
    }

    exportConciseReport() {
        const reportContent = document.getElementById('report-content');
        const timestamp = new Date().toISOString().split('T')[0];
        
        // Create a simplified version for export
        const reportText = reportContent.innerText;
        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `assignment-summary-report-${timestamp}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    // Utility Methods
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDurationFromMonths(totalMonths) {
        if (totalMonths === 0) {
            return '0 months';
        } else if (totalMonths < 12) {
            return `${totalMonths} month${totalMonths > 1 ? 's' : ''}`;
        } else {
            const years = Math.floor(totalMonths / 12);
            const remainingMonths = totalMonths % 12;
            let result = `${years} year${years > 1 ? 's' : ''}`;
            if (remainingMonths > 0) {
                result += `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
            }
            return result;
        }
    }

    // Search functionality (can be extended)
    searchAll(query) {
        const results = {
            employments: dataStore.searchEmployments(query),
            assignments: dataStore.searchAssignments(query),
            tags: dataStore.searchTags(query)
        };
        return results;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CareerVisualizer();
});

// Add some sample data for demonstration (only if no data exists)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const employments = dataStore.getEmployments();
        if (employments.length === 0) {
            // Create sample data
            const sampleEmployment = dataStore.createEmployment({
                title: 'Senior Software Engineer',
                company: 'Tech Innovations Inc.',
                startDate: '2023-01-15',
                endDate: null
            });

            const sampleAssignment = dataStore.createAssignment({
                employmentId: sampleEmployment.id,
                title: 'Web Application Development',
                description: 'Developed and maintained customer-facing web applications using modern frameworks.',
                startDate: '2023-01-15',
                endDate: '2023-12-31'
            });

            dataStore.createTag({
                assignmentId: sampleAssignment.id,
                name: 'React',
                category: 'test target tech',
                description: 'Frontend framework for building user interfaces'
            });

            dataStore.createTag({
                assignmentId: sampleAssignment.id,
                name: 'Jest',
                category: 'test tech',
                description: 'JavaScript testing framework'
            });

            dataStore.createTag({
                assignmentId: sampleAssignment.id,
                name: 'Team Leadership',
                category: 'skill',
                description: 'Leading and mentoring development teams'
            });

            // Refresh the UI
            window.app.renderEmployments();
            window.app.renderTimeline();
            window.app.renderTagsOverview();
        }
    }, 100);
});