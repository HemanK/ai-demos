/**
 * Application Entry Point
 * Initializes the app and sets up event listeners
 */

const App = {
  /**
   * Initialize the application
   */
  init() {
    console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION} initializing...`);

    // Check if storage is available
    if (!Storage.init()) {
      alert('Warning: localStorage is not available. Your data will not be saved.');
    }

    // Initialize managers
    TaskManager.init();
    UI.init();

    // Set up event listeners
    this.setupEventListeners();

    console.log(`${CONFIG.APP_NAME} initialized successfully`);
  },

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Add Task button
    const addTaskBtn = document.getElementById('add-task-btn');
    if (addTaskBtn) {
      addTaskBtn.addEventListener('click', () => {
        UI.openAddTaskModal();
      });
    }

    // Save Task button
    const saveTaskBtn = document.getElementById('save-task-btn');
    if (saveTaskBtn) {
      saveTaskBtn.addEventListener('click', () => {
        UI.saveTask();
      });
    }

    // Cancel Task button
    const cancelTaskBtn = document.getElementById('cancel-task-btn');
    if (cancelTaskBtn) {
      cancelTaskBtn.addEventListener('click', () => {
        UI.closeTaskModal();
      });
    }

    // Modal close button
    const modalClose = document.getElementById('modal-close');
    if (modalClose) {
      modalClose.addEventListener('click', () => {
        UI.closeTaskModal();
      });
    }

    // Modal overlay click (close modal)
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', () => {
        UI.closeTaskModal();
      });
    }

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('task-modal');
        if (modal && modal.classList.contains('active')) {
          UI.closeTaskModal();
        }
      }
    });

    // Category filter
    const filterCategory = document.getElementById('filter-category');
    if (filterCategory) {
      filterCategory.addEventListener('change', (e) => {
        UI.updateFilter('category', e.target.value);
      });
    }

    // Priority filter
    const filterPriority = document.getElementById('filter-priority');
    if (filterPriority) {
      filterPriority.addEventListener('change', (e) => {
        UI.updateFilter('priority', e.target.value);
      });
    }

    // Status filter
    const filterStatus = document.getElementById('filter-status');
    if (filterStatus) {
      filterStatus.addEventListener('change', (e) => {
        UI.updateFilter('status', e.target.value);
      });
    }

    // Sort by
    const sortBy = document.getElementById('sort-by');
    if (sortBy) {
      sortBy.addEventListener('change', (e) => {
        UI.updateSort(e.target.value);
      });
    }

    // Current user selector
    const currentUser = document.getElementById('current-user');
    if (currentUser) {
      currentUser.addEventListener('change', (e) => {
        UI.updateFilter('member', e.target.value);
      });
    }

    // Export button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        UI.handleExport();
      });
    }

    // Import button
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');
    if (importBtn && importFile) {
      importBtn.addEventListener('click', () => {
        importFile.click();
      });

      importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          UI.handleImport(file);
          // Reset file input
          importFile.value = '';
        }
      });
    }

    // Natural Language Parse button
    const parseNLBtn = document.getElementById('parse-nl-btn');
    if (parseNLBtn) {
      parseNLBtn.addEventListener('click', () => {
        this.handleNaturalLanguageParse();
      });
    }

    // Daily Briefing button
    const dailyBriefingBtn = document.getElementById('daily-briefing-btn');
    if (dailyBriefingBtn) {
      dailyBriefingBtn.addEventListener('click', () => {
        this.handleDailyBriefing();
      });
    }

    // Risk Analysis button
    const riskAnalysisBtn = document.getElementById('risk-analysis-btn');
    if (riskAnalysisBtn) {
      riskAnalysisBtn.addEventListener('click', () => {
        this.handleRiskAnalysis();
      });
    }

    // Form submission (in case user hits Enter)
    const taskForm = document.getElementById('task-form');
    if (taskForm) {
      taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        UI.saveTask();
      });
    }

    console.log('Event listeners set up');
  },

  /**
   * Handle natural language parsing
   * This is a placeholder for AI integration
   */
  handleNaturalLanguageParse() {
    const nlInput = document.getElementById('nl-input');
    const statusEl = document.getElementById('ai-parse-status');

    if (!nlInput || !statusEl) return;

    const text = nlInput.value.trim();
    if (!text) {
      Utils.showToast('Please enter some text to parse', 'error');
      return;
    }

    // Check if AI is enabled
    if (!CONFIG.AI.ENABLED) {
      // Fallback: Simple rule-based parsing
      this.simpleNaturalLanguageParse(text);
      return;
    }

    // TODO: Call AI SmartParser agent
    Utils.showLoading('Parsing with AI...');

    // For now, use simple parsing
    setTimeout(() => {
      this.simpleNaturalLanguageParse(text);
      Utils.hideLoading();
    }, 500);
  },

  /**
   * Simple rule-based natural language parsing (fallback when AI is not available)
   * @param {string} text - Input text
   */
  simpleNaturalLanguageParse(text) {
    const statusEl = document.getElementById('ai-parse-status');

    try {
      // Extract title (first part before keywords)
      let title = text.split(/\b(tomorrow|today|next week|friday|monday|high|low|priority)/i)[0].trim();

      // Extract due date
      let dueDate = Utils.getDefaultDueDate();
      if (/\btoday\b/i.test(text)) {
        dueDate = Utils.formatDate(new Date());
      } else if (/\btomorrow\b/i.test(text)) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dueDate = Utils.formatDate(tomorrow);
      } else if (/\bnext friday\b/i.test(text)) {
        const nextFriday = new Date();
        nextFriday.setDate(nextFriday.getDate() + ((5 + 7 - nextFriday.getDay()) % 7) + 7);
        dueDate = Utils.formatDate(nextFriday);
      }

      // Extract priority
      let priority = 'Medium';
      if (/\bhigh\s*priority\b/i.test(text) || /\burgent\b/i.test(text)) {
        priority = 'High';
      } else if (/\blow\s*priority\b/i.test(text)) {
        priority = 'Low';
      }

      // Extract time of day
      let timeOfDay = '';
      if (/\bmorning\b/i.test(text)) {
        timeOfDay = 'Morning';
      } else if (/\bafternoon\b/i.test(text)) {
        timeOfDay = 'Afternoon';
      } else if (/\bevening\b/i.test(text)) {
        timeOfDay = 'Evening';
      } else if (/\bnight\b/i.test(text)) {
        timeOfDay = 'Night';
      }

      // Guess category based on keywords
      let category = 'Other';
      if (/\b(buy|shop|purchase|grocery|groceries|store)\b/i.test(text)) {
        category = 'Shopping';
      } else if (/\b(pay|bill|payment|invoice)\b/i.test(text)) {
        category = 'Bills';
      } else if (/\b(clean|fix|repair|home|house)\b/i.test(text)) {
        category = 'Household';
      } else if (/\b(insurance|policy|claim)\b/i.test(text)) {
        category = 'Insurance';
      } else if (/\b(invest|stock|portfolio)\b/i.test(text)) {
        category = 'Investments';
      } else if (/\b(work|meeting|project|deadline)\b/i.test(text)) {
        category = 'Work';
      }

      // Populate form
      document.getElementById('task-title').value = title || text;
      document.getElementById('task-due-date').value = dueDate;
      document.getElementById('task-priority').value = priority;
      document.getElementById('task-urgency').value = priority;
      if (timeOfDay) {
        document.getElementById('task-time').value = timeOfDay;
      }
      document.getElementById('task-category').value = category;

      // Show success message
      if (statusEl) {
        statusEl.className = 'status-message status-success';
        statusEl.textContent = '✓ Parsed successfully! Review and adjust the fields below.';
      }

      // Scroll to form
      document.getElementById('task-title')?.focus();
    } catch (e) {
      console.error('Parse error:', e);
      if (statusEl) {
        statusEl.className = 'status-message status-error';
        statusEl.textContent = '✗ Could not parse. Please fill the form manually.';
      }
    }
  },

  /**
   * Handle daily briefing
   * This is a placeholder for AI integration
   */
  handleDailyBriefing() {
    if (!CONFIG.AI.ENABLED) {
      // Show simple briefing
      this.showSimpleDailyBriefing();
      return;
    }

    // TODO: Call AI Daily Briefing agent
    Utils.showLoading('Generating daily briefing...');

    setTimeout(() => {
      this.showSimpleDailyBriefing();
      Utils.hideLoading();
    }, 500);
  },

  /**
   * Show simple daily briefing (fallback)
   */
  showSimpleDailyBriefing() {
    const stats = TaskManager.getStats();
    const today = Utils.formatDate(new Date());
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = Utils.formatDate(tomorrow);

    const todayTasks = TaskManager.tasks.filter(t => t.status !== 'completed' && t.dueDate === today);
    const tomorrowTasks = TaskManager.tasks.filter(t => t.status !== 'completed' && t.dueDate === tomorrowStr);

    let message = `📅 Daily Briefing\n\n`;
    message += `📊 Overview:\n`;
    message += `• ${stats.pending + stats.inProgress} pending tasks\n`;
    message += `• ${stats.overdue} overdue tasks\n`;
    message += `• ${stats.completedToday} completed today\n\n`;

    message += `TODAY (${todayTasks.length} tasks):\n`;
    if (todayTasks.length === 0) {
      message += `✓ All caught up!\n`;
    } else {
      todayTasks.slice(0, 5).forEach(t => {
        message += `• ${t.title} (${t.priority})\n`;
      });
      if (todayTasks.length > 5) {
        message += `... and ${todayTasks.length - 5} more\n`;
      }
    }

    message += `\nTOMORROW (${tomorrowTasks.length} tasks):\n`;
    if (tomorrowTasks.length === 0) {
      message += `✓ Nothing scheduled\n`;
    } else {
      tomorrowTasks.slice(0, 5).forEach(t => {
        message += `• ${t.title} (${t.priority})\n`;
      });
      if (tomorrowTasks.length > 5) {
        message += `... and ${tomorrowTasks.length - 5} more\n`;
      }
    }

    alert(message);
  },

  /**
   * Handle risk analysis
   * This is a placeholder for AI integration
   */
  handleRiskAnalysis() {
    if (!CONFIG.AI.ENABLED) {
      // Show simple risk analysis
      this.showSimpleRiskAnalysis();
      return;
    }

    // TODO: Call AI Risk Advisor agent
    Utils.showLoading('Analyzing risks...');

    setTimeout(() => {
      this.showSimpleRiskAnalysis();
      Utils.hideLoading();
    }, 500);
  },

  /**
   * Show simple risk analysis (fallback)
   */
  showSimpleRiskAnalysis() {
    const stats = TaskManager.getStats();
    const overdueTasks = TaskManager.tasks.filter(t => t.status !== 'completed' && Utils.isOverdue(t.dueDate));

    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    const upcomingHighPriority = TaskManager.tasks.filter(t => {
      if (t.status === 'completed') return false;
      const dueDate = Utils.parseDate(t.dueDate);
      return t.priority === 'High' && dueDate >= today && dueDate <= threeDaysFromNow;
    });

    let message = `⚠️ Risk Analysis\n\n`;

    if (overdueTasks.length > 0) {
      message += `🔴 ${overdueTasks.length} OVERDUE tasks:\n`;
      overdueTasks.slice(0, 5).forEach(t => {
        message += `• ${t.title} (due ${Utils.formatDateHuman(t.dueDate)})\n`;
      });
      if (overdueTasks.length > 5) {
        message += `... and ${overdueTasks.length - 5} more\n`;
      }
      message += `\n`;
    } else {
      message += `✅ No overdue tasks!\n\n`;
    }

    if (upcomingHighPriority.length > 0) {
      message += `🟡 ${upcomingHighPriority.length} HIGH PRIORITY tasks due in 3 days:\n`;
      upcomingHighPriority.slice(0, 5).forEach(t => {
        message += `• ${t.title} (due ${Utils.getRelativeDateLabel(t.dueDate)})\n`;
      });
      if (upcomingHighPriority.length > 5) {
        message += `... and ${upcomingHighPriority.length - 5} more\n`;
      }
    } else {
      message += `✅ No high-priority tasks due soon.\n`;
    }

    alert(message);
  }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
} else {
  // DOM already loaded
  App.init();
}

// Make App globally available
if (typeof window !== 'undefined') {
  window.App = App;
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}
