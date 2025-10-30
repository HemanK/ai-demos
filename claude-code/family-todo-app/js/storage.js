/**
 * Storage Module
 * localStorage wrapper with error handling and data validation
 */

const Storage = {
  /**
   * Initialize storage (check if localStorage is available)
   * @returns {boolean} True if storage is available
   */
  init() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.error('localStorage not available:', e);
      Utils.showToast('Storage not available. Data won\'t persist.', 'error');
      return false;
    }
  },

  /**
   * Get all tasks from storage
   * @returns {Array} Array of task objects
   */
  getTasks() {
    try {
      const data = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);

      // Validate storage version
      if (parsed.version !== CONFIG.STORAGE_VERSION) {
        console.warn('Storage version mismatch. Migrating...');
        return this.migrateData(parsed);
      }

      return parsed.tasks || [];
    } catch (e) {
      console.error('Error reading tasks from storage:', e);
      Utils.showToast('Error loading tasks', 'error');
      return [];
    }
  },

  /**
   * Save tasks to storage
   * @param {Array} tasks - Array of task objects
   * @returns {boolean} Success status
   */
  saveTasks(tasks) {
    try {
      const data = {
        version: CONFIG.STORAGE_VERSION,
        lastModified: new Date().toISOString(),
        tasks: tasks
      };

      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Error saving tasks to storage:', e);

      // Check if quota exceeded
      if (e.name === 'QuotaExceededError') {
        Utils.showToast('Storage quota exceeded. Please export and clear old tasks.', 'error', 5000);
      } else {
        Utils.showToast('Error saving tasks', 'error');
      }

      return false;
    }
  },

  /**
   * Clear all tasks from storage
   * @returns {boolean} Success status
   */
  clearAll() {
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
      return true;
    } catch (e) {
      console.error('Error clearing storage:', e);
      return false;
    }
  },

  /**
   * Export tasks as JSON file with metadata
   * @param {Array} tasks - Array of task objects
   * @param {Object} metadata - Additional export metadata
   * @returns {string} JSON string
   */
  exportToJSON(tasks, metadata = {}) {
    const now = new Date();
    const browserInfo = this.getBrowserInfo();

    const data = {
      metadata: {
        exportDate: now.toISOString(),
        exportDateDisplay: now.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        device: browserInfo,
        user: metadata.userId || 'unknown',
        userName: metadata.userName || 'Unknown User',
        taskCount: tasks.length,
        appVersion: CONFIG.STORAGE_VERSION,
        exportType: metadata.exportType || 'all'
      },
      // Legacy fields for backward compatibility
      appName: CONFIG.APP_NAME,
      version: CONFIG.STORAGE_VERSION,
      exportedAt: now.toISOString(),
      tasksCount: tasks.length,
      tasks: tasks
    };

    return JSON.stringify(data, null, 2);
  },

  /**
   * Get browser and device information
   * @returns {string} Browser info string
   */
  getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let os = 'Unknown';

    // Detect OS
    if (ua.includes('Mac')) os = 'Mac';
    else if (ua.includes('Win')) os = 'Windows';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('iPhone')) os = 'iPhone';
    else if (ua.includes('iPad')) os = 'iPad';
    else if (ua.includes('Android')) os = 'Android';

    // Detect Browser
    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edg')) browser = 'Edge';

    return `${os} / ${browser}`;
  },

  /**
   * Import tasks from JSON string
   * @param {string} jsonString - JSON string
   * @returns {Object} Result {success: boolean, tasks: Array, error: string}
   */
  importFromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);

      // Validate structure
      if (!data.tasks || !Array.isArray(data.tasks)) {
        return {
          success: false,
          tasks: [],
          error: 'Invalid file format: tasks array not found'
        };
      }

      // Validate each task
      const validTasks = data.tasks.filter(task => {
        return task.id && task.title && task.category && task.assignedTo;
      });

      if (validTasks.length !== data.tasks.length) {
        console.warn(`${data.tasks.length - validTasks.length} invalid tasks were skipped`);
      }

      return {
        success: true,
        tasks: validTasks,
        error: null
      };
    } catch (e) {
      console.error('Error importing tasks:', e);
      return {
        success: false,
        tasks: [],
        error: 'Invalid JSON file'
      };
    }
  },

  /**
   * Migrate data from older versions
   * @param {Object} oldData - Old data structure
   * @returns {Array} Migrated tasks
   */
  migrateData(oldData) {
    console.log('Migrating data from version', oldData.version, 'to', CONFIG.STORAGE_VERSION);

    let tasks = oldData.tasks || [];

    // Migration from v1.0 to v1.1: Update legacy member names
    if (oldData.version === '1.0' || !oldData.version) {
      console.log('Applying v1.0 -> v1.1 migration: Updating member names');

      tasks = tasks.map(task => {
        // Check if assignedTo is a legacy name (old name format)
        if (task.assignedTo && CONFIG.LEGACY_MEMBER_MAPPING[task.assignedTo]) {
          const newId = CONFIG.LEGACY_MEMBER_MAPPING[task.assignedTo];
          console.log(`Migrating task "${task.title}": ${task.assignedTo} -> ${newId}`);
          return {
            ...task,
            assignedTo: newId,
            // Add migration timestamp
            migratedAt: new Date().toISOString()
          };
        }
        return task;
      });

      console.log(`Migration complete: Updated ${tasks.length} tasks`);
    }

    return tasks;
  },

  /**
   * Get storage usage statistics
   * @returns {Object} Storage stats
   */
  getStorageStats() {
    try {
      const data = localStorage.getItem(CONFIG.STORAGE_KEY);
      const sizeInBytes = new Blob([data || '']).size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);
      const tasks = this.getTasks();

      // Approximate localStorage limit (usually 5-10MB)
      const estimatedLimit = 5 * 1024; // 5MB in KB
      const usagePercent = ((sizeInKB / estimatedLimit) * 100).toFixed(1);

      return {
        taskCount: tasks.length,
        sizeKB: sizeInKB,
        usagePercent: usagePercent
      };
    } catch (e) {
      console.error('Error getting storage stats:', e);
      return {
        taskCount: 0,
        sizeKB: 0,
        usagePercent: 0
      };
    }
  },

  /**
   * Check if backup reminder is needed
   * @returns {boolean} True if reminder needed
   */
  shouldRemindBackup() {
    try {
      const lastBackup = localStorage.getItem('lastBackupDate');
      if (!lastBackup) return true;

      const lastBackupDate = new Date(lastBackup);
      const daysSinceBackup = Math.floor((new Date() - lastBackupDate) / (1000 * 60 * 60 * 24));

      return daysSinceBackup >= CONFIG.EXPORT.AUTO_BACKUP_DAYS;
    } catch (e) {
      return false;
    }
  },

  /**
   * Mark backup as completed
   */
  markBackupCompleted() {
    try {
      localStorage.setItem('lastBackupDate', new Date().toISOString());
    } catch (e) {
      console.error('Error marking backup:', e);
    }
  }
};

// Make Storage globally available
if (typeof window !== 'undefined') {
  window.Storage = Storage;
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Storage;
}
