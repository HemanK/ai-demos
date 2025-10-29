/**
 * Task Manager
 * Handles all CRUD operations for tasks
 */

const TaskManager = {
  // In-memory task storage (synced with localStorage)
  tasks: [],

  /**
   * Initialize task manager
   * Load tasks from storage
   */
  init() {
    this.tasks = Storage.getTasks();
    console.log(`TaskManager initialized with ${this.tasks.length} tasks`);

    // Check if backup reminder is needed
    if (Storage.shouldRemindBackup() && this.tasks.length > 0) {
      setTimeout(() => {
        Utils.showToast('💾 Reminder: Export your tasks to backup your data', 'info', 5000);
      }, 3000);
    }
  },

  /**
   * Get all tasks
   * @returns {Array} Array of task objects
   */
  getAllTasks() {
    return [...this.tasks];
  },

  /**
   * Get task by ID
   * @param {string} taskId - Task ID
   * @returns {Object|null} Task object or null if not found
   */
  getTaskById(taskId) {
    return this.tasks.find(task => task.id === taskId) || null;
  },

  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @returns {Object} Result {success: boolean, task: Object, error: string}
   */
  createTask(taskData) {
    try {
      // Validate task data
      const validation = Utils.validateTask(taskData);
      if (!validation.valid) {
        return {
          success: false,
          task: null,
          error: validation.errors.join(', ')
        };
      }

      // Create task object
      const task = {
        id: Utils.generateId(),
        title: taskData.title.trim(),
        description: taskData.description?.trim() || '',
        category: taskData.category,
        subcategory: taskData.subcategory?.trim() || '',
        assignedTo: taskData.assignedTo,
        dueDate: taskData.dueDate,
        timeOfDay: taskData.timeOfDay || '',
        priority: taskData.priority,
        urgency: taskData.urgency,
        status: taskData.status || 'pending',
        notes: taskData.notes?.trim() || '',
        createdAt: new Date().toISOString(),
        createdFrom: Utils.getDeviceInfo(), // Track which device created this task
        updatedAt: new Date().toISOString(),
        completedAt: null
      };

      // Add to tasks array
      this.tasks.push(task);

      // Save to storage
      const saved = Storage.saveTasks(this.tasks);
      if (!saved) {
        // Rollback
        this.tasks = this.tasks.filter(t => t.id !== task.id);
        return {
          success: false,
          task: null,
          error: 'Failed to save task to storage'
        };
      }

      console.log('Task created:', task.id);
      return {
        success: true,
        task: task,
        error: null
      };
    } catch (e) {
      console.error('Error creating task:', e);
      return {
        success: false,
        task: null,
        error: 'Unexpected error creating task'
      };
    }
  },

  /**
   * Update an existing task
   * @param {string} taskId - Task ID
   * @param {Object} updates - Updated fields
   * @returns {Object} Result {success: boolean, task: Object, error: string}
   */
  updateTask(taskId, updates) {
    try {
      const taskIndex = this.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) {
        return {
          success: false,
          task: null,
          error: 'Task not found'
        };
      }

      // Get existing task
      const existingTask = this.tasks[taskIndex];

      // Merge updates
      const updatedTask = {
        ...existingTask,
        ...updates,
        id: existingTask.id, // Ensure ID doesn't change
        createdAt: existingTask.createdAt, // Preserve creation date
        updatedAt: new Date().toISOString()
      };

      // If status changed to completed, set completedAt
      if (updates.status === 'completed' && existingTask.status !== 'completed') {
        updatedTask.completedAt = new Date().toISOString();
      }

      // If status changed from completed, clear completedAt
      if (updates.status && updates.status !== 'completed' && existingTask.status === 'completed') {
        updatedTask.completedAt = null;
      }

      // Validate updated task
      const validation = Utils.validateTask(updatedTask);
      if (!validation.valid) {
        return {
          success: false,
          task: null,
          error: validation.errors.join(', ')
        };
      }

      // Update in array
      this.tasks[taskIndex] = updatedTask;

      // Save to storage
      const saved = Storage.saveTasks(this.tasks);
      if (!saved) {
        // Rollback
        this.tasks[taskIndex] = existingTask;
        return {
          success: false,
          task: null,
          error: 'Failed to save task to storage'
        };
      }

      console.log('Task updated:', taskId);
      return {
        success: true,
        task: updatedTask,
        error: null
      };
    } catch (e) {
      console.error('Error updating task:', e);
      return {
        success: false,
        task: null,
        error: 'Unexpected error updating task'
      };
    }
  },

  /**
   * Delete a task
   * @param {string} taskId - Task ID
   * @returns {Object} Result {success: boolean, error: string}
   */
  deleteTask(taskId) {
    try {
      const taskIndex = this.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) {
        return {
          success: false,
          error: 'Task not found'
        };
      }

      // Store task for potential rollback
      const deletedTask = this.tasks[taskIndex];

      // Remove from array
      this.tasks.splice(taskIndex, 1);

      // Save to storage
      const saved = Storage.saveTasks(this.tasks);
      if (!saved) {
        // Rollback
        this.tasks.splice(taskIndex, 0, deletedTask);
        return {
          success: false,
          error: 'Failed to save changes to storage'
        };
      }

      console.log('Task deleted:', taskId);
      return {
        success: true,
        error: null
      };
    } catch (e) {
      console.error('Error deleting task:', e);
      return {
        success: false,
        error: 'Unexpected error deleting task'
      };
    }
  },

  /**
   * Get tasks filtered and sorted
   * @param {Object} filters - Filter criteria
   * @param {string} sortBy - Sort field
   * @returns {Array} Filtered and sorted tasks
   */
  getFilteredTasks(filters, sortBy) {
    let filtered = Utils.filterTasks(this.tasks, filters);
    let sorted = Utils.sortTasks(filtered, sortBy);
    return sorted;
  },

  /**
   * Get task statistics
   * @returns {Object} Statistics
   */
  getStats() {
    const today = Utils.formatDate(new Date());

    const stats = {
      total: this.tasks.length,
      pending: this.tasks.filter(t => t.status === 'pending').length,
      inProgress: this.tasks.filter(t => t.status === 'in-progress').length,
      completed: this.tasks.filter(t => t.status === 'completed').length,
      overdue: this.tasks.filter(t => t.status !== 'completed' && Utils.isOverdue(t.dueDate)).length,
      completedToday: this.tasks.filter(t => t.completedAt && Utils.isToday(t.completedAt.split('T')[0])).length,
      dueToday: this.tasks.filter(t => t.status !== 'completed' && Utils.isToday(t.dueDate)).length,
      dueTomorrow: this.tasks.filter(t => t.status !== 'completed' && Utils.isTomorrow(t.dueDate)).length
    };

    return stats;
  },

  /**
   * Get tasks by member
   * @param {string} memberId - Member ID
   * @returns {Array} Tasks assigned to member
   */
  getTasksByMember(memberId) {
    if (memberId === 'all') {
      return this.tasks;
    }
    return this.tasks.filter(t => t.assignedTo === memberId);
  },

  /**
   * Get tasks by category
   * @param {string} category - Category name
   * @returns {Array} Tasks in category
   */
  getTasksByCategory(category) {
    return this.tasks.filter(t => t.category === category);
  },

  /**
   * Get tasks by status
   * @param {string} status - Status value
   * @returns {Array} Tasks with status
   */
  getTasksByStatus(status) {
    return this.tasks.filter(t => t.status === status);
  },

  /**
   * Mark task as completed
   * @param {string} taskId - Task ID
   * @returns {Object} Result {success: boolean, task: Object, error: string}
   */
  completeTask(taskId) {
    return this.updateTask(taskId, {
      status: 'completed',
      completedAt: new Date().toISOString()
    });
  },

  /**
   * Mark task as in-progress
   * @param {string} taskId - Task ID
   * @returns {Object} Result {success: boolean, task: Object, error: string}
   */
  startTask(taskId) {
    return this.updateTask(taskId, {
      status: 'in-progress'
    });
  },

  /**
   * Export all tasks
   * @returns {string} JSON string
   */
  exportTasks() {
    return Storage.exportToJSON(this.tasks);
  },

  /**
   * Import tasks from JSON
   * @param {string} jsonString - JSON string
   * @param {boolean} merge - If true, merge with existing tasks. If false, replace all tasks.
   * @returns {Object} Result {success: boolean, imported: number, error: string}
   */
  importTasks(jsonString, merge = true) {
    const result = Storage.importFromJSON(jsonString);

    if (!result.success) {
      return {
        success: false,
        imported: 0,
        error: result.error
      };
    }

    try {
      if (merge) {
        // Merge: Add imported tasks, skip duplicates (by ID)
        const existingIds = new Set(this.tasks.map(t => t.id));
        const newTasks = result.tasks.filter(t => !existingIds.has(t.id));
        this.tasks = [...this.tasks, ...newTasks];

        console.log(`Imported ${newTasks.length} new tasks (${result.tasks.length - newTasks.length} duplicates skipped)`);
      } else {
        // Replace all tasks
        this.tasks = result.tasks;
        console.log(`Replaced all tasks with ${result.tasks.length} imported tasks`);
      }

      // Save to storage
      const saved = Storage.saveTasks(this.tasks);
      if (!saved) {
        return {
          success: false,
          imported: 0,
          error: 'Failed to save imported tasks to storage'
        };
      }

      return {
        success: true,
        imported: result.tasks.length,
        error: null
      };
    } catch (e) {
      console.error('Error importing tasks:', e);
      return {
        success: false,
        imported: 0,
        error: 'Unexpected error during import'
      };
    }
  },

  /**
   * Clear all tasks
   * @returns {boolean} Success status
   */
  clearAllTasks() {
    try {
      this.tasks = [];
      return Storage.saveTasks(this.tasks);
    } catch (e) {
      console.error('Error clearing tasks:', e);
      return false;
    }
  }
};

// Make TaskManager globally available
if (typeof window !== 'undefined') {
  window.TaskManager = TaskManager;
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TaskManager;
}
