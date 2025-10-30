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
      const originalText = text;

      // Extract and parse date (numeric format like 10/31, 12/25)
      let dueDate = Utils.getDefaultDueDate();
      const numericDateMatch = text.match(/\b(\d{1,2})\/(\d{1,2})\b/);
      if (numericDateMatch) {
        const month = parseInt(numericDateMatch[1]);
        const day = parseInt(numericDateMatch[2]);
        const year = new Date().getFullYear();
        const parsedDate = new Date(year, month - 1, day);
        if (!isNaN(parsedDate.getTime())) {
          dueDate = Utils.formatDate(parsedDate);
        }
      }

      // Day names (Monday, Tuesday, etc.)
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      for (let i = 0; i < dayNames.length; i++) {
        const regex = new RegExp(`\\b${dayNames[i]}\\b`, 'i');
        if (regex.test(text)) {
          const today = new Date();
          const currentDay = today.getDay();
          let daysUntil = (i - currentDay + 7) % 7;
          if (daysUntil === 0) daysUntil = 7; // Next week if today
          const targetDate = new Date(today);
          targetDate.setDate(today.getDate() + daysUntil);
          dueDate = Utils.formatDate(targetDate);
          break;
        }
      }

      // Relative dates
      if (/\btoday\b/i.test(text)) {
        dueDate = Utils.formatDate(new Date());
      } else if (/\btomorrow\b/i.test(text)) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dueDate = Utils.formatDate(tomorrow);
      }

      // Extract priority (separate from urgency)
      let priority = 'Medium';
      let urgency = 'Medium';

      // Priority keywords
      if (/\bhigh\s*priority\b/i.test(text)) {
        priority = 'High';
      } else if (/\blow\s*priority\b/i.test(text)) {
        priority = 'Low';
      } else if (/\bmedium\s*priority\b/i.test(text)) {
        priority = 'Medium';
      }

      // Urgency keywords (separate from priority)
      if (/\burgent\b/i.test(text)) {
        urgency = 'High';
      } else if (/\bnot\s+urgent\b/i.test(text)) {
        urgency = 'Low';
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
      } else if (/\b(doctor|appointment|checkup|medical)\b/i.test(text)) {
        category = 'Doctors';
      } else if (/\b(medicine|medication|pills|prescription|pharmacy)\b/i.test(text)) {
        category = 'Meds';
      } else if (/\b(travel|flight|trip|vacation|hotel)\b/i.test(text)) {
        category = 'Travel';
      } else if (/\b(clean|fix|repair|home|house)\b/i.test(text)) {
        category = 'Household';
      } else if (/\b(auto|car|vehicle)\s*(insurance|policy)\b/i.test(text)) {
        category = 'Auto_Insurance';
      } else if (/\b(health|medical)\s*(insurance|policy)\b/i.test(text)) {
        category = 'Health_Insurance';
      } else if (/\b(invest|stock|portfolio)\b/i.test(text)) {
        category = 'Investments';
      } else if (/\b(work|meeting|project|deadline|job)\b/i.test(text)) {
        category = 'Work';
      }

      // Smart title/description/notes extraction
      let title = '';
      let description = '';
      let notes = '';

      // Remove date/time/priority keywords to get core task
      let cleanedText = text
        .replace(/\b\d{1,2}\/\d{1,2}\b/g, '')
        .replace(/\b(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi, '')
        .replace(/\b(morning|afternoon|evening|night)\b/gi, '')
        .replace(/\b(high|medium|low)\s*(priority|urgency)\b/gi, '')
        .replace(/\b(urgent|not urgent)\b/gi, '')
        .trim();

      // Split by punctuation or length
      const sentences = cleanedText.split(/[.!;]/).filter(s => s.trim());

      if (sentences.length === 1) {
        // Short input: everything is title
        title = sentences[0].trim().substring(0, 60); // Limit title length
      } else if (sentences.length === 2) {
        // Two parts: first is title, second is description
        title = sentences[0].trim().substring(0, 60);
        description = sentences[1].trim();
      } else if (sentences.length >= 3) {
        // Multiple parts: first is title, next 1-2 are description, rest are notes
        title = sentences[0].trim().substring(0, 60);
        description = sentences.slice(1, 3).join('. ').trim();
        notes = sentences.slice(3).join('. ').trim();
      }

      // Fallback if no good title extracted
      if (!title) {
        title = originalText.substring(0, 60);
      }

      // Populate form
      document.getElementById('task-title').value = title;
      if (description) document.getElementById('task-description').value = description;
      if (notes) document.getElementById('task-notes').value = notes;
      document.getElementById('task-due-date').value = dueDate;
      document.getElementById('task-priority').value = priority;
      document.getElementById('task-urgency').value = urgency;
      if (timeOfDay) {
        document.getElementById('task-time').value = timeOfDay;
      }
      document.getElementById('task-category').value = category;

      // Show success message
      if (statusEl) {
        statusEl.className = 'status-message status-success';
        statusEl.textContent = '✓ Parsed successfully! Title, description, and dates extracted. Review below.';
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

    // Generate HTML content
    let html = `
      <div class="briefing-section">
        <div class="briefing-stats">
          <div class="stat-card">
            <span class="stat-value">${stats.pending + stats.inProgress}</span>
            <span class="stat-label">Pending</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${stats.overdue}</span>
            <span class="stat-label">Overdue</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${stats.completedToday}</span>
            <span class="stat-label">Completed Today</span>
          </div>
        </div>
      </div>
    `;

    // Today's tasks by member
    html += '<div class="briefing-section"><h3>📅 Today</h3>';
    html += this.renderTasksByMember(todayTasks, 'No tasks for today - all caught up!');
    html += '</div>';

    // Tomorrow's tasks by member
    html += '<div class="briefing-section"><h3>📆 Tomorrow</h3>';
    html += this.renderTasksByMember(tomorrowTasks, 'Nothing scheduled for tomorrow');
    html += '</div>';

    UI.showBriefingModal(html);
  },

  /**
   * Render tasks grouped by member
   */
  renderTasksByMember(tasks, emptyMessage) {
    if (tasks.length === 0) {
      return `<p class="empty-message">${emptyMessage}</p>`;
    }

    // Group tasks by assigned member
    const tasksByMember = {};
    tasks.forEach(task => {
      const memberId = task.assignedTo || 'unassigned';
      if (!tasksByMember[memberId]) {
        tasksByMember[memberId] = [];
      }
      tasksByMember[memberId].push(task);
    });

    let html = '';

    // Render each member's tasks
    Object.keys(tasksByMember).forEach(memberId => {
      const memberTasks = tasksByMember[memberId];
      const member = CONFIG.FAMILY_MEMBERS.find(m => m.id === memberId) || { name: 'Unassigned', color: '#F5F5F5' };

      html += `
        <div class="member-group">
          <div class="member-group-header" style="background-color: ${member.color}">
            ${member.name} (${memberTasks.length} task${memberTasks.length !== 1 ? 's' : ''})
          </div>
          <ul class="task-list-simple">
      `;

      memberTasks.slice(0, 10).forEach(task => {
        html += `
          <li class="priority-${task.priority.toLowerCase()}" data-task-id="${task.id}" onclick="UI.handleEditTask('${task.id}'); UI.closeBriefingModal();">
            <div class="task-title-brief">${Utils.escapeHtml(task.title)}</div>
            <div class="task-meta-brief">
              ${Utils.getCategoryInfo(task.category).emoji} ${task.category}
              • Priority: ${task.priority}
            </div>
          </li>
        `;
      });

      if (memberTasks.length > 10) {
        html += `<li class="empty-message">... and ${memberTasks.length - 10} more tasks</li>`;
      }

      html += '</ul></div>';
    });

    return html;
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

    let html = '';

    // Overdue tasks
    if (overdueTasks.length > 0) {
      html += `
        <div class="risk-alert risk-danger">
          <strong>🔴 ${overdueTasks.length} OVERDUE Task${overdueTasks.length !== 1 ? 's' : ''}</strong>
          <p>These tasks are past their due date and need immediate attention.</p>
        </div>
        <div class="risk-section">
      `;
      html += this.renderTasksByMember(overdueTasks, '');
      html += '</div>';
    } else {
      html += `
        <div class="risk-alert risk-success">
          <strong>✅ No Overdue Tasks</strong>
          <p>All tasks are on track!</p>
        </div>
      `;
    }

    // Upcoming high-priority tasks
    if (upcomingHighPriority.length > 0) {
      html += `
        <div class="risk-alert">
          <strong>🟡 ${upcomingHighPriority.length} High-Priority Task${upcomingHighPriority.length !== 1 ? 's' : ''} Due in 3 Days</strong>
          <p>Plan ahead to ensure these critical tasks are completed on time.</p>
        </div>
        <div class="risk-section">
      `;
      html += this.renderTasksByMember(upcomingHighPriority, '');
      html += '</div>';
    } else {
      html += `
        <div class="risk-alert risk-success">
          <strong>✅ No High-Priority Tasks Due Soon</strong>
          <p>Your schedule looks manageable for the next 3 days.</p>
        </div>
      `;
    }

    UI.showRiskModal(html);
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
