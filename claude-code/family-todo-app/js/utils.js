/**
 * Utility Functions
 * Helper functions used throughout the application
 */

const Utils = {
  /**
   * Generate a unique ID for tasks
   * @returns {string} Unique ID
   */
  generateId() {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Format date to YYYY-MM-DD
   * @param {Date} date - Date object
   * @returns {string} Formatted date string
   */
  formatDate(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Parse date string to Date object
   * @param {string} dateStr - Date string (YYYY-MM-DD)
   * @returns {Date} Date object
   */
  parseDate(dateStr) {
    return new Date(dateStr + 'T00:00:00');
  },

  /**
   * Get default due date (Friday of current week)
   * If today is Friday or later, returns next Friday
   * @returns {string} Date string (YYYY-MM-DD)
   */
  getDefaultDueDate() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sunday, 5=Friday
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7;

    const friday = new Date(today);
    if (daysUntilFriday === 0) {
      // Today is Friday, use next Friday
      friday.setDate(today.getDate() + 7);
    } else {
      friday.setDate(today.getDate() + daysUntilFriday);
    }

    return this.formatDate(friday);
  },

  /**
   * Check if a date is overdue
   * @param {string} dueDateStr - Due date string (YYYY-MM-DD)
   * @returns {boolean} True if overdue
   */
  isOverdue(dueDateStr) {
    const dueDate = this.parseDate(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  },

  /**
   * Check if a date is today
   * @param {string} dateStr - Date string (YYYY-MM-DD)
   * @returns {boolean} True if today
   */
  isToday(dateStr) {
    const date = this.parseDate(dateStr);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },

  /**
   * Check if a date is tomorrow
   * @param {string} dateStr - Date string (YYYY-MM-DD)
   * @returns {boolean} True if tomorrow
   */
  isTomorrow(dateStr) {
    const date = this.parseDate(dateStr);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  },

  /**
   * Get relative date label (e.g., "Today", "Tomorrow", "Overdue")
   * @param {string} dateStr - Date string (YYYY-MM-DD)
   * @returns {string} Relative date label
   */
  getRelativeDateLabel(dateStr) {
    if (this.isToday(dateStr)) return 'Today';
    if (this.isTomorrow(dateStr)) return 'Tomorrow';
    if (this.isOverdue(dateStr)) return 'Overdue';

    const date = this.parseDate(dateStr);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 14) return 'Next week';

    return this.formatDateHuman(dateStr);
  },

  /**
   * Format date for human-readable display
   * @param {string} dateStr - Date string (YYYY-MM-DD)
   * @returns {string} Formatted date (e.g., "Jan 15, 2025")
   */
  formatDateHuman(dateStr) {
    const date = this.parseDate(dateStr);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  },

  /**
   * Escape HTML to prevent XSS
   * @param {string} unsafe - Unsafe string
   * @returns {string} Escaped string
   */
  escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return '';
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /**
   * Debounce function to limit execution rate
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Deep clone an object
   * @param {Object} obj - Object to clone
   * @returns {Object} Cloned object
   */
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Get member name by ID
   * @param {string} memberId - Member ID
   * @returns {string} Member name
   */
  getMemberName(memberId) {
    const member = CONFIG.FAMILY_MEMBERS.find(m => m.id === memberId);
    return member ? member.name : 'Unknown';
  },

  /**
   * Get category info by ID
   * @param {string} categoryId - Category ID
   * @returns {Object} Category object
   */
  getCategoryInfo(categoryId) {
    return CONFIG.CATEGORIES.find(c => c.id === categoryId) || CONFIG.CATEGORIES[CONFIG.CATEGORIES.length - 1];
  },

  /**
   * Show toast notification
   * @param {string} message - Message to display
   * @param {string} type - Toast type ('success', 'error', 'info')
   * @param {number} duration - Duration in milliseconds
   */
  showToast(message, type = 'info', duration = CONFIG.UI.TOAST_DURATION) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');

    container.appendChild(toast);

    // Auto-remove after duration
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        container.removeChild(toast);
      }, 300);
    }, duration);
  },

  /**
   * Show loading overlay
   * @param {string} message - Loading message (optional)
   */
  showLoading(message = 'Processing with AI...') {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      const textEl = overlay.querySelector('.loading-text');
      if (textEl) textEl.textContent = message;
      overlay.style.display = 'flex';
    }
  },

  /**
   * Hide loading overlay
   */
  hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  },

  /**
   * Validate task data
   * @param {Object} task - Task object
   * @returns {Object} Validation result {valid: boolean, errors: string[]}
   */
  validateTask(task) {
    const errors = [];

    if (!task.title || task.title.trim() === '') {
      errors.push('Title is required');
    }

    if (!task.category) {
      errors.push('Category is required');
    }

    if (!task.assignedTo) {
      errors.push('Assigned member is required');
    }

    if (!task.dueDate) {
      errors.push('Due date is required');
    }

    if (!task.priority) {
      errors.push('Priority is required');
    }

    if (!task.urgency) {
      errors.push('Urgency is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Sort tasks by a given field
   * @param {Array} tasks - Array of tasks
   * @param {string} sortBy - Field to sort by ('dueDate', 'priority', 'created', 'member')
   * @returns {Array} Sorted tasks
   */
  sortTasks(tasks, sortBy) {
    const sortedTasks = [...tasks];

    switch (sortBy) {
      case 'dueDate':
        return sortedTasks.sort((a, b) => {
          return new Date(a.dueDate) - new Date(b.dueDate);
        });

      case 'priority':
        const priorityOrder = { High: 0, Medium: 1, Low: 2 };
        return sortedTasks.sort((a, b) => {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

      case 'created':
        return sortedTasks.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

      case 'member':
        return sortedTasks.sort((a, b) => {
          return this.getMemberName(a.assignedTo).localeCompare(this.getMemberName(b.assignedTo));
        });

      default:
        return sortedTasks;
    }
  },

  /**
   * Filter tasks based on criteria
   * @param {Array} tasks - Array of tasks
   * @param {Object} filters - Filter criteria
   * @returns {Array} Filtered tasks
   */
  filterTasks(tasks, filters) {
    return tasks.filter(task => {
      // Category filter
      if (filters.category && filters.category !== 'all' && task.category !== filters.category) {
        return false;
      }

      // Priority filter
      if (filters.priority && filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }

      // Status filter
      if (filters.status && filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }

      // Member filter
      if (filters.member && filters.member !== 'all' && task.assignedTo !== filters.member) {
        return false;
      }

      return true;
    });
  }
};

// Make Utils globally available
if (typeof window !== 'undefined') {
  window.Utils = Utils;
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}
