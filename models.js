// Data Models and Storage Management

class DataStore {
    constructor() {
        this.storageKey = 'career_visualizer_data';
        this.data = this.loadData();
    }

    // Initialize default data structure
    getDefaultData() {
        return {
            employments: [],
            assignments: [],
            tags: [],
            nextId: 1
        };
    }

    // Load data from localStorage
    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                // Ensure all required properties exist
                return {
                    employments: data.employments || [],
                    assignments: data.assignments || [],
                    tags: data.tags || [],
                    nextId: data.nextId || 1
                };
            }
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
        }
        return this.getDefaultData();
    }

    // Save data to localStorage
    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            return true;
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
            return false;
        }
    }

    // Get next available ID
    getNextId() {
        return this.data.nextId++;
    }

    // Employment methods
    createEmployment(employmentData) {
        const employment = {
            id: this.getNextId(),
            title: employmentData.title,
            company: employmentData.company,
            startDate: employmentData.startDate,
            endDate: employmentData.endDate || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.data.employments.push(employment);
        this.saveData();
        return employment;
    }

    updateEmployment(id, updates) {
        const index = this.data.employments.findIndex(emp => emp.id === id);
        if (index !== -1) {
            this.data.employments[index] = {
                ...this.data.employments[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveData();
            return this.data.employments[index];
        }
        return null;
    }

    deleteEmployment(id) {
        // Also delete related assignments and tags
        this.data.assignments = this.data.assignments.filter(assignment => {
            if (assignment.employmentId === id) {
                // Delete tags for this assignment
                this.data.tags = this.data.tags.filter(tag => tag.assignmentId !== assignment.id);
                return false;
            }
            return true;
        });

        this.data.employments = this.data.employments.filter(emp => emp.id !== id);
        this.saveData();
        return true;
    }

    getEmployments() {
        return [...this.data.employments].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    }

    getEmployment(id) {
        return this.data.employments.find(emp => emp.id === id);
    }

    // Assignment methods
    createAssignment(assignmentData) {
        const assignment = {
            id: this.getNextId(),
            employmentId: assignmentData.employmentId,
            title: assignmentData.title,
            description: assignmentData.description || '',
            startDate: assignmentData.startDate,
            endDate: assignmentData.endDate || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.data.assignments.push(assignment);
        this.saveData();
        return assignment;
    }

    updateAssignment(id, updates) {
        const index = this.data.assignments.findIndex(assignment => assignment.id === id);
        if (index !== -1) {
            this.data.assignments[index] = {
                ...this.data.assignments[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveData();
            return this.data.assignments[index];
        }
        return null;
    }

    deleteAssignment(id) {
        // Also delete related tags
        this.data.tags = this.data.tags.filter(tag => tag.assignmentId !== id);
        this.data.assignments = this.data.assignments.filter(assignment => assignment.id !== id);
        this.saveData();
        return true;
    }

    getAssignments(employmentId = null) {
        let assignments = [...this.data.assignments];
        if (employmentId !== null) {
            assignments = assignments.filter(assignment => assignment.employmentId === employmentId);
        }
        return assignments.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    }

    getAssignment(id) {
        return this.data.assignments.find(assignment => assignment.id === id);
    }

    // Tag methods
    createTag(tagData) {
        const tag = {
            id: this.getNextId(),
            assignmentId: tagData.assignmentId,
            name: tagData.name,
            category: tagData.category,
            description: tagData.description || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.data.tags.push(tag);
        this.saveData();
        return tag;
    }

    updateTag(id, updates) {
        const index = this.data.tags.findIndex(tag => tag.id === id);
        if (index !== -1) {
            this.data.tags[index] = {
                ...this.data.tags[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveData();
            return this.data.tags[index];
        }
        return null;
    }

    deleteTag(id) {
        this.data.tags = this.data.tags.filter(tag => tag.id !== id);
        this.saveData();
        return true;
    }

    getTags(assignmentId = null, category = null) {
        let tags = [...this.data.tags];
        
        if (assignmentId !== null) {
            tags = tags.filter(tag => tag.assignmentId === assignmentId);
        }
        
        if (category && category !== 'all') {
            tags = tags.filter(tag => tag.category === category);
        }
        
        return tags.sort((a, b) => a.name.localeCompare(b.name));
    }

    getTag(id) {
        return this.data.tags.find(tag => tag.id === id);
    }

    // Utility methods
    getTagsByCategory() {
        const tagsByCategory = {};
        this.data.tags.forEach(tag => {
            if (!tagsByCategory[tag.category]) {
                tagsByCategory[tag.category] = [];
            }
            tagsByCategory[tag.category].push(tag);
        });
        return tagsByCategory;
    }

    getTagCounts() {
        const counts = {};
        
        // First, group tags by employment and tag key to avoid double counting
        const tagsByEmploymentAndKey = {};
        
        this.data.tags.forEach(tag => {
            const assignment = this.getAssignment(tag.assignmentId);
            if (!assignment) return;
            
            const key = `${tag.name}_${tag.category}`;
            const employmentId = assignment.employmentId;
            
            if (!tagsByEmploymentAndKey[key]) {
                tagsByEmploymentAndKey[key] = {};
            }
            
            if (!tagsByEmploymentAndKey[key][employmentId]) {
                tagsByEmploymentAndKey[key][employmentId] = {
                    tag: tag,
                    assignments: []
                };
            }
            
            tagsByEmploymentAndKey[key][employmentId].assignments.push(assignment);
        });
        
        // Calculate counts and durations based on employments, not individual assignments
        Object.keys(tagsByEmploymentAndKey).forEach(key => {
            const [name, category] = key.split('_');
            
            if (!counts[key]) {
                counts[key] = {
                    name: name,
                    category: category,
                    count: 0,
                    totalMonths: 0
                };
            }
            
            Object.keys(tagsByEmploymentAndKey[key]).forEach(employmentId => {
                const employment = this.getEmployment(parseInt(employmentId));
                const tagData = tagsByEmploymentAndKey[key][employmentId];
                
                if (employment) {
                    counts[key].count++;
                    
                    // Use employment duration, but limit it to the actual assignment periods within that employment
                    const assignments = tagData.assignments;
                    let earliestStart = null;
                    let latestEnd = null;
                    
                    assignments.forEach(assignment => {
                        const assignmentStart = assignment.startDate;
                        const assignmentEnd = assignment.endDate || employment.endDate;
                        
                        if (!earliestStart || assignmentStart < earliestStart) {
                            earliestStart = assignmentStart;
                        }
                        
                        if (!latestEnd || !assignmentEnd || (assignmentEnd && assignmentEnd > latestEnd)) {
                            latestEnd = assignmentEnd;
                        }
                    });
                    
                    // Calculate duration using the span of assignments with this tag within the employment
                    const [startYear, startMonth] = earliestStart.split('-').map(Number);
                    let endYear, endMonth;
                    
                    if (latestEnd) {
                        [endYear, endMonth] = latestEnd.split('-').map(Number);
                    } else {
                        const now = new Date();
                        endYear = now.getFullYear();
                        endMonth = now.getMonth() + 1;
                    }
                    
                    const diffMonths = (endYear - startYear) * 12 + (endMonth - startMonth);
                    counts[key].totalMonths += Math.max(0, diffMonths);
                }
            });
        });
        
        return Object.values(counts);
    }

    // Export/Import methods
    exportData() {
        const exportData = {
            version: '1.0.0',
            exportDate: new Date().toISOString(),
            data: this.data
        };
        return JSON.stringify(exportData, null, 2);
    }

    importData(jsonData) {
        try {
            const imported = JSON.parse(jsonData);
            
            // Validate imported data structure
            if (!imported.data || typeof imported.data !== 'object') {
                throw new Error('Invalid data format');
            }

            const newData = {
                employments: imported.data.employments || [],
                assignments: imported.data.assignments || [],
                tags: imported.data.tags || [],
                nextId: imported.data.nextId || 1
            };

            // Ensure all IDs are numbers and find the highest ID
            let maxId = 0;
            [...newData.employments, ...newData.assignments, ...newData.tags].forEach(item => {
                if (item.id && typeof item.id === 'number') {
                    maxId = Math.max(maxId, item.id);
                }
            });
            newData.nextId = maxId + 1;

            this.data = newData;
            this.saveData();
            return { success: true, message: 'Data imported successfully' };
        } catch (error) {
            console.error('Error importing data:', error);
            return { success: false, message: `Import failed: ${error.message}` };
        }
    }

    // Clear all data
    clearAllData() {
        this.data = this.getDefaultData();
        this.saveData();
        return true;
    }

    // Get employment with related assignments and tags
    getEmploymentWithRelatedData(employmentId) {
        const employment = this.getEmployment(employmentId);
        if (!employment) return null;

        const assignments = this.getAssignments(employmentId).map(assignment => ({
            ...assignment,
            tags: this.getTags(assignment.id)
        }));

        return {
            ...employment,
            assignments
        };
    }

    // Get timeline data for visualization
    getTimelineData() {
        return this.getEmployments().map(employment => ({
            ...employment,
            assignments: this.getAssignments(employment.id).map(assignment => ({
                ...assignment,
                tags: this.getTags(assignment.id)
            }))
        }));
    }

    // Search functionality
    searchTags(query) {
        const lowerQuery = query.toLowerCase();
        return this.data.tags.filter(tag => 
            tag.name.toLowerCase().includes(lowerQuery) ||
            tag.description.toLowerCase().includes(lowerQuery) ||
            tag.category.toLowerCase().includes(lowerQuery)
        );
    }

    searchAssignments(query) {
        const lowerQuery = query.toLowerCase();
        return this.data.assignments.filter(assignment =>
            assignment.title.toLowerCase().includes(lowerQuery) ||
            assignment.description.toLowerCase().includes(lowerQuery)
        );
    }

    searchEmployments(query) {
        const lowerQuery = query.toLowerCase();
        return this.data.employments.filter(employment =>
            employment.title.toLowerCase().includes(lowerQuery) ||
            employment.company.toLowerCase().includes(lowerQuery)
        );
    }
}

// Utility functions for date formatting and validation
const DateUtils = {
    formatDate(dateString) {
        if (!dateString) return 'Present';
        // Handle YYYY-MM format
        const [year, month] = dateString.split('-');
        const date = new Date(year, month - 1, 1);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
        });
    },

    formatDateRange(startDate, endDate) {
        const start = this.formatDate(startDate);
        const end = this.formatDate(endDate);
        return `${start} - ${end}`;
    },

    calculateDuration(startDate, endDate) {
        // Handle YYYY-MM format
        const [startYear, startMonth] = startDate.split('-').map(Number);
        let endYear, endMonth;
        
        if (endDate) {
            [endYear, endMonth] = endDate.split('-').map(Number);
        } else {
            const now = new Date();
            endYear = now.getFullYear();
            endMonth = now.getMonth() + 1;
        }
        
        const diffMonths = (endYear - startYear) * 12 + (endMonth - startMonth);
        
        if (diffMonths < 1) {
            return '< 1 month';
        } else if (diffMonths < 12) {
            return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
        } else {
            const years = Math.floor(diffMonths / 12);
            const remainingMonths = diffMonths % 12;
            let result = `${years} year${years > 1 ? 's' : ''}`;
            if (remainingMonths > 0) {
                result += `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
            }
            return result;
        }
    },

    isValidDateRange(startDate, endDate) {
        if (!startDate) return false;
        if (endDate) {
            // Handle YYYY-MM format comparison
            const [startYear, startMonth] = startDate.split('-').map(Number);
            const [endYear, endMonth] = endDate.split('-').map(Number);
            
            if (startYear > endYear || (startYear === endYear && startMonth > endMonth)) {
                return false;
            }
        }
        return true;
    }
};

// Tag categories and their display properties
const TagCategories = {
    'skill': {
        label: 'Skills',
        className: 'skill',
        color: '#ea580c',
        backgroundColor: '#fed7aa'
    },
    'test target tech': {
        label: 'Test Target Tech',
        className: 'test-target-tech',
        color: '#2563eb',
        backgroundColor: '#dbeafe'
    },
    'test tech': {
        label: 'Test Tech',
        className: 'test-tech',
        color: '#059669',
        backgroundColor: '#dcfce7'
    }
};

// Initialize global data store
const dataStore = new DataStore();