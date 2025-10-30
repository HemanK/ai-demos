/**
 * UI Module
 * Handles all rendering and DOM manipulation
 */

const UI = {
  // Current filters and sort
  currentFilters: {
    category: 'all',
    priority: 'all',
    status: 'all',
    member: 'all'
  },
  currentSort: 'dueDate',

  // Pagination
  currentPage: 1,
  tasksPerPage: 20,

  /**
   * Initialize UI
   */
  init() {
    this.renderTaskList();
    this.updateStats();
    console.log('UI initialized');
  },

  /**
   * Render all tasks in the task list with pagination
   */
  renderTaskList() {
    const taskListEl = document.getElementById('task-list');
    if (!taskListEl) return;

    // Get filtered and sorted tasks
    const allTasks = TaskManager.getFilteredTasks(this.currentFilters, this.currentSort);

    // Clear existing content
    taskListEl.innerHTML = '';

    // Show empty state if no tasks
    if (allTasks.length === 0) {
      const message = this.isFiltered()
        ? 'No tasks match the current filters.'
        : 'No tasks yet. Add one to get started!';

      taskListEl.innerHTML = `
        <div class="empty-state">
          <p>📝 ${message}</p>
        </div>
      `;
      this.renderPaginationControls(0, 0);
      return;
    }

    // Calculate pagination
    const totalTasks = allTasks.length;
    const totalPages = Math.ceil(totalTasks / this.tasksPerPage);

    // Ensure current page is valid
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    // Get tasks for current page
    const startIdx = (this.currentPage - 1) * this.tasksPerPage;
    const endIdx = startIdx + this.tasksPerPage;
    const tasksToShow = allTasks.slice(startIdx, endIdx);

    // Render each task
    tasksToShow.forEach(task => {
      const taskCard = this.createTaskCard(task);
      taskListEl.appendChild(taskCard);
    });

    // Render pagination controls
    this.renderPaginationControls(totalTasks, totalPages);
  },

  /**
   * Check if any filters are active
   * @returns {boolean} True if filtered
   */
  isFiltered() {
    return (
      this.currentFilters.category !== 'all' ||
      this.currentFilters.priority !== 'all' ||
      this.currentFilters.status !== 'all' ||
      this.currentFilters.member !== 'all'
    );
  },

  /**
   * Create a task card element
   * @param {Object} task - Task object
   * @returns {HTMLElement} Task card element
   */
  createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card status-${task.status} priority-${task.priority.toLowerCase()}`;
    card.dataset.taskId = task.id;

    // Status emoji
    const statusInfo = CONFIG.STATUS[task.status];
    const priorityInfo = CONFIG.PRIORITIES[task.priority];
    const categoryInfo = Utils.getCategoryInfo(task.category);

    // Overdue check
    const isOverdue = task.status !== 'completed' && Utils.isOverdue(task.dueDate);
    const overdueClass = isOverdue ? 'text-danger' : '';

    card.innerHTML = `
      <div class="task-header">
        <h3 class="task-title">${Utils.escapeHtml(task.title)}</h3>
        <span class="task-status-badge" style="background-color: ${statusInfo.color}; color: white;">
          ${statusInfo.emoji} ${statusInfo.label}
        </span>
      </div>

      <div class="task-meta">
        <span>${categoryInfo.emoji} ${categoryInfo.name}${task.subcategory ? ` / ${Utils.escapeHtml(task.subcategory)}` : ''}</span>
        <span>${priorityInfo.emoji} ${priorityInfo.label}</span>
        <span>👤 ${Utils.getMemberName(task.assignedTo)}</span>
        <span class="${overdueClass}">
          📅 ${Utils.getRelativeDateLabel(task.dueDate)}
          ${isOverdue ? '⚠️' : ''}
        </span>
        ${task.timeOfDay ? `<span>🕐 ${task.timeOfDay}</span>` : ''}
      </div>

      ${task.description ? `
        <p class="task-description">${Utils.escapeHtml(task.description)}</p>
      ` : ''}

      <div class="task-actions">
        ${task.status !== 'completed' ? `
          <button class="btn btn-small btn-secondary" onclick="UI.handleCompleteTask('${task.id}')">
            ✅ Complete
          </button>
          ${task.status === 'pending' ? `
            <button class="btn btn-small btn-secondary" onclick="UI.handleStartTask('${task.id}')">
              ⚙️ Start
            </button>
          ` : ''}
        ` : ''}
        <button class="btn btn-small btn-secondary" onclick="UI.handleEditTask('${task.id}')">
          ✏️ Edit
        </button>
        <button class="btn btn-small btn-secondary" onclick="UI.handleDeleteTask('${task.id}')">
          🗑️ Delete
        </button>
      </div>
    `;

    return card;
  },

  /**
   * Render pagination controls
   * @param {number} totalTasks - Total number of tasks
   * @param {number} totalPages - Total number of pages
   */
  renderPaginationControls(totalTasks, totalPages) {
    const paginationEl = document.getElementById('pagination-controls');
    if (!paginationEl) return;

    // Hide if no tasks or only one page
    if (totalPages <= 1) {
      paginationEl.innerHTML = '';
      paginationEl.style.display = 'none';
      return;
    }

    paginationEl.style.display = 'flex';

    // Calculate range
    const startIdx = (this.currentPage - 1) * this.tasksPerPage + 1;
    const endIdx = Math.min(this.currentPage * this.tasksPerPage, totalTasks);

    let html = `
      <div class="pagination-info">
        Showing ${startIdx}-${endIdx} of ${totalTasks} tasks
      </div>
      <div class="pagination-buttons">
    `;

    // Previous button
    if (this.currentPage > 1) {
      html += `<button class="btn btn-small" onclick="UI.prevPage()">← Previous</button>`;
    } else {
      html += `<button class="btn btn-small" disabled>← Previous</button>`;
    }

    // Page numbers (show max 5 pages at a time)
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust if at the end
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // First page + ellipsis if needed
    if (startPage > 1) {
      html += `<button class="btn btn-small" onclick="UI.goToPage(1)">1</button>`;
      if (startPage > 2) {
        html += `<span class="pagination-ellipsis">...</span>`;
      }
    }

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      if (i === this.currentPage) {
        html += `<button class="btn btn-small btn-primary">${i}</button>`;
      } else {
        html += `<button class="btn btn-small" onclick="UI.goToPage(${i})">${i}</button>`;
      }
    }

    // Last page + ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        html += `<span class="pagination-ellipsis">...</span>`;
      }
      html += `<button class="btn btn-small" onclick="UI.goToPage(${totalPages})">${totalPages}</button>`;
    }

    // Next button
    if (this.currentPage < totalPages) {
      html += `<button class="btn btn-small" onclick="UI.nextPage()">Next →</button>`;
    } else {
      html += `<button class="btn btn-small" disabled>Next →</button>`;
    }

    html += `
      </div>
    `;

    paginationEl.innerHTML = html;
  },

  /**
   * Navigate to a specific page
   * @param {number} pageNum - Page number
   */
  goToPage(pageNum) {
    this.currentPage = pageNum;
    this.renderTaskList();
    // Scroll to top of task list
    const taskSection = document.querySelector('.task-list-section');
    if (taskSection) {
      taskSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  /**
   * Navigate to next page
   */
  nextPage() {
    this.currentPage++;
    this.renderTaskList();
    const taskSection = document.querySelector('.task-list-section');
    if (taskSection) {
      taskSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  /**
   * Navigate to previous page
   */
  prevPage() {
    this.currentPage--;
    this.renderTaskList();
    const taskSection = document.querySelector('.task-list-section');
    if (taskSection) {
      taskSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  /**
   * Update statistics in header
   */
  updateStats() {
    const stats = TaskManager.getStats();

    const pendingEl = document.getElementById('stat-pending');
    const overdueEl = document.getElementById('stat-overdue');
    const completedEl = document.getElementById('stat-completed');

    if (pendingEl) pendingEl.textContent = stats.pending + stats.inProgress;
    if (overdueEl) overdueEl.textContent = stats.overdue;
    if (completedEl) completedEl.textContent = stats.completedToday;
  },

  /**
   * Update filters
   * @param {string} filterType - Filter type (category, priority, status, member)
   * @param {string} value - Filter value
   */
  updateFilter(filterType, value) {
    this.currentFilters[filterType] = value;
    this.currentPage = 1; // Reset to first page when filtering
    this.renderTaskList();
  },

  /**
   * Update sort
   * @param {string} sortBy - Sort field
   */
  updateSort(sortBy) {
    this.currentSort = sortBy;
    this.currentPage = 1; // Reset to first page when sorting
    this.renderTaskList();
  },

  /**
   * Open task modal for adding new task
   */
  openAddTaskModal() {
    const modal = document.getElementById('task-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('task-form');

    if (!modal || !form) return;

    // Reset form
    form.reset();

    // Set default values
    document.getElementById('task-due-date').value = Utils.getDefaultDueDate();
    document.getElementById('task-priority').value = 'Medium';
    document.getElementById('task-urgency').value = 'Medium';
    document.getElementById('task-status').value = 'pending';
    document.getElementById('task-id').value = '';

    // Set current user
    const currentUser = document.getElementById('current-user').value;
    if (currentUser && currentUser !== 'all') {
      document.getElementById('task-assigned').value = currentUser;
    }

    // Update modal title
    if (modalTitle) modalTitle.textContent = 'Add New Task';

    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    // Focus on first input
    document.getElementById('task-title')?.focus();
  },

  /**
   * Open task modal for editing existing task
   * @param {string} taskId - Task ID
   */
  openEditTaskModal(taskId) {
    const modal = document.getElementById('task-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('task-form');

    if (!modal || !form) return;

    // Get task
    const task = TaskManager.getTaskById(taskId);
    if (!task) {
      Utils.showToast('Task not found', 'error');
      return;
    }

    // Populate form
    document.getElementById('task-id').value = task.id;
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-description').value = task.description || '';
    document.getElementById('task-category').value = task.category;
    const subcategoryEl = document.getElementById('task-subcategory');
    if (subcategoryEl) subcategoryEl.value = task.subcategory || '';
    document.getElementById('task-assigned').value = task.assignedTo;
    document.getElementById('task-due-date').value = task.dueDate;
    document.getElementById('task-time').value = task.timeOfDay || '';
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-urgency').value = task.urgency;
    document.getElementById('task-status').value = task.status;
    document.getElementById('task-notes').value = task.notes || '';

    // Update modal title
    if (modalTitle) modalTitle.textContent = 'Edit Task';

    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    // Focus on title
    document.getElementById('task-title')?.focus();
  },

  /**
   * Close task modal
   */
  closeTaskModal() {
    const modal = document.getElementById('task-modal');
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');

    // Clear NL input and status
    const nlInput = document.getElementById('nl-input');
    const nlStatus = document.getElementById('ai-parse-status');
    if (nlInput) nlInput.value = '';
    if (nlStatus) nlStatus.innerHTML = '';
  },

  /**
   * Save task (create or update)
   */
  saveTask() {
    const form = document.getElementById('task-form');
    if (!form || !form.checkValidity()) {
      form?.reportValidity();
      return;
    }

    const taskId = document.getElementById('task-id').value;
    const taskData = {
      title: document.getElementById('task-title').value,
      description: document.getElementById('task-description').value,
      category: document.getElementById('task-category').value,
      subcategory: document.getElementById('task-subcategory')?.value || '',
      assignedTo: document.getElementById('task-assigned').value,
      dueDate: document.getElementById('task-due-date').value,
      timeOfDay: document.getElementById('task-time').value,
      priority: document.getElementById('task-priority').value,
      urgency: document.getElementById('task-urgency').value,
      status: document.getElementById('task-status').value,
      notes: document.getElementById('task-notes').value
    };

    let result;
    if (taskId) {
      // Update existing task
      result = TaskManager.updateTask(taskId, taskData);
    } else {
      // Create new task
      result = TaskManager.createTask(taskData);
    }

    if (result.success) {
      this.closeTaskModal();
      this.renderTaskList();
      this.updateStats();
      Utils.showToast(taskId ? 'Task updated successfully' : 'Task created successfully', 'success');
    } else {
      Utils.showToast(`Error: ${result.error}`, 'error');
    }
  },

  /**
   * Handle complete task action
   * @param {string} taskId - Task ID
   */
  handleCompleteTask(taskId) {
    const result = TaskManager.completeTask(taskId);
    if (result.success) {
      this.renderTaskList();
      this.updateStats();
      Utils.showToast('Task marked as completed', 'success');
    } else {
      Utils.showToast(`Error: ${result.error}`, 'error');
    }
  },

  /**
   * Handle start task action
   * @param {string} taskId - Task ID
   */
  handleStartTask(taskId) {
    const result = TaskManager.startTask(taskId);
    if (result.success) {
      this.renderTaskList();
      this.updateStats();
      Utils.showToast('Task started', 'success');
    } else {
      Utils.showToast(`Error: ${result.error}`, 'error');
    }
  },

  /**
   * Handle edit task action
   * @param {string} taskId - Task ID
   */
  handleEditTask(taskId) {
    this.openEditTaskModal(taskId);
  },

  /**
   * Handle delete task action
   * @param {string} taskId - Task ID
   */
  handleDeleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    const result = TaskManager.deleteTask(taskId);
    if (result.success) {
      this.renderTaskList();
      this.updateStats();
      Utils.showToast('Task deleted', 'success');
    } else {
      Utils.showToast(`Error: ${result.error}`, 'error');
    }
  },

  /**
   * Handle export tasks
   * Exports currently filtered/visible tasks with custom filename modal
   */
  handleExport() {
    try {
      // Get currently filtered tasks (what user sees on screen)
      const filteredTasks = TaskManager.getFilteredTasks(this.currentFilters, this.currentSort);

      // Check if user wants to export all or just filtered
      let tasksToExport;
      let filenamePrefix;
      let exportType;

      if (this.isFiltered() && filteredTasks.length < TaskManager.tasks.length) {
        // Ask user: export all or just filtered?
        const exportFiltered = confirm(
          `Export only the ${filteredTasks.length} filtered tasks you see on screen?\n\n` +
          `Click OK to export filtered tasks (${filteredTasks.length}).\n` +
          `Click Cancel to export ALL tasks (${TaskManager.tasks.length}).`
        );

        if (exportFiltered) {
          tasksToExport = filteredTasks;
          filenamePrefix = 'filtered';
          exportType = 'filtered';
        } else {
          tasksToExport = TaskManager.getAllTasks();
          filenamePrefix = CONFIG.EXPORT.FILENAME_PREFIX;
          exportType = 'all';
        }
      } else {
        // No filters active, export all
        tasksToExport = TaskManager.getAllTasks();
        filenamePrefix = CONFIG.EXPORT.FILENAME_PREFIX;
        exportType = 'all';
      }

      // Store export data for later use
      this.pendingExport = {
        tasks: tasksToExport,
        prefix: filenamePrefix,
        exportType: exportType
      };

      // Open filename modal instead of using prompt()
      this.openFilenameModal(tasksToExport.length, filenamePrefix);

    } catch (e) {
      console.error('Export error:', e);
      Utils.showToast('Error exporting tasks', 'error');
    }
  },

  /**
   * Open filename modal for export
   * @param {number} taskCount - Number of tasks to export
   * @param {string} prefix - Filename prefix
   */
  openFilenameModal(taskCount, prefix) {
    const modal = document.getElementById('filename-modal');
    if (!modal) return;

    // Generate default filename with shorter format: prefix-MMDD.json
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const defaultFilename = `${prefix}-${month}${day}.json`;

    // Populate modal
    const filenameInput = document.getElementById('export-filename');
    const taskCountEl = document.getElementById('export-task-count');
    const charCountEl = document.getElementById('filename-char-count');

    if (filenameInput) {
      filenameInput.value = defaultFilename;
      filenameInput.focus();
      filenameInput.select();

      // Update character count
      if (charCountEl) {
        charCountEl.textContent = `${defaultFilename.length} chars`;
      }

      // Add input listener for character count
      filenameInput.addEventListener('input', (e) => {
        if (charCountEl) {
          charCountEl.textContent = `${e.target.value.length} chars`;
        }
      });
    }

    if (taskCountEl) {
      taskCountEl.textContent = `${taskCount} task${taskCount !== 1 ? 's' : ''}`;
    }

    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  },

  /**
   * Close filename modal
   */
  closeFilenameModal() {
    const modal = document.getElementById('filename-modal');
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');

    // Clear pending export
    this.pendingExport = null;

    // Collapse help if expanded
    const helpContent = document.getElementById('export-help-content');
    if (helpContent) {
      helpContent.style.display = 'none';
      const icon = document.getElementById('help-toggle-icon');
      if (icon) icon.textContent = '▶';
    }
  },

  /**
   * Confirm and execute export
   */
  confirmExport() {
    if (!this.pendingExport) {
      console.error('Export error: No pending export data');
      Utils.showToast('Export error: No data to export', 'error');
      return;
    }

    try {
      const filenameInput = document.getElementById('export-filename');
      let filename = filenameInput?.value.trim() || 'tasks.json';

      // Ensure .json extension
      if (!filename.endsWith('.json')) {
        filename += '.json';
      }

      // Get current user info
      const currentUserSelect = document.getElementById('current-user');
      const userId = currentUserSelect?.value || 'all';
      const userMember = CONFIG.FAMILY_MEMBERS.find(m => m.id === userId);
      const userName = userMember ? userMember.name : 'All Members';

      // Prepare metadata
      const metadata = {
        userId: userId,
        userName: userName,
        exportType: this.pendingExport.exportType || 'all'
      };

      console.log('Generating JSON export...', { taskCount: this.pendingExport.tasks.length, filename });

      // Generate JSON with metadata
      const jsonData = Storage.exportToJSON(this.pendingExport.tasks, metadata);

      if (!jsonData) {
        throw new Error('Failed to generate JSON data');
      }

      const blob = new Blob([jsonData], { type: CONFIG.EXPORT.MIME_TYPE });
      const url = URL.createObjectURL(blob);

      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Clean up DOM
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('Export successful:', filename);

      // Mark backup completed
      Storage.markBackupCompleted();

      // Close modal
      this.closeFilenameModal();

      // Show success message (green toast)
      Utils.showToast(`✓ Exported ${this.pendingExport.tasks.length} tasks to ${filename}`, 'success', 4000);

    } catch (e) {
      console.error('Export error:', e);
      Utils.showToast(`Export failed: ${e.message || 'Unknown error'}`, 'error');
    }
  },

  /**
   * Toggle export help section
   */
  toggleExportHelp() {
    const helpContent = document.getElementById('export-help-content');
    const icon = document.getElementById('help-toggle-icon');

    if (!helpContent || !icon) return;

    if (helpContent.style.display === 'none') {
      helpContent.style.display = 'block';
      icon.textContent = '▼';
    } else {
      helpContent.style.display = 'none';
      icon.textContent = '▶';
    }
  },

  /**
   * Show briefing modal with HTML content
   * @param {string} html - HTML content to display
   */
  showBriefingModal(html) {
    const modal = document.getElementById('briefing-modal');
    const content = document.getElementById('briefing-content');

    if (!modal || !content) return;

    content.innerHTML = html;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  },

  /**
   * Close briefing modal
   */
  closeBriefingModal() {
    const modal = document.getElementById('briefing-modal');
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  },

  /**
   * Handle edit task from briefing modal
   * Closes briefing first, then opens edit modal
   * @param {string} taskId - Task ID
   */
  handleEditTaskFromBriefing(taskId) {
    this.closeBriefingModal();
    // Wait for modal close animation (300ms) before opening edit
    setTimeout(() => {
      this.openEditTaskModal(taskId);
    }, 350);
  },

  /**
   * Show risk modal with HTML content
   * @param {string} html - HTML content to display
   */
  showRiskModal(html) {
    const modal = document.getElementById('risk-modal');
    const content = document.getElementById('risk-content');

    if (!modal || !content) return;

    content.innerHTML = html;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  },

  /**
   * Close risk modal
   */
  closeRiskModal() {
    const modal = document.getElementById('risk-modal');
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  },

  /**
   * Handle edit task from risk modal
   * Closes risk first, then opens edit modal
   * @param {string} taskId - Task ID
   */
  handleEditTaskFromRisk(taskId) {
    this.closeRiskModal();
    // Wait for modal close animation (300ms) before opening edit
    setTimeout(() => {
      this.openEditTaskModal(taskId);
    }, 350);
  },

  /**
   * Handle import tasks
   * Shows confirmation modal unless auto-import is enabled
   * @param {File} file - File object
   */
  handleImport(file) {
    if (!file) return;

    const filename = file.name;  // Store filename
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonString = e.target.result;

        // Check if auto-import is enabled
        const autoImport = localStorage.getItem('autoImport') === 'true';

        if (autoImport) {
          // Import directly without confirmation
          this.executeImport(jsonString);
        } else {
          // Show confirmation modal with filename
          this.showImportConfirmation(jsonString, filename);
        }
      } catch (err) {
        console.error('Import error:', err);
        Utils.showToast('Error reading file', 'error');
      }
    };

    reader.onerror = () => {
      Utils.showToast('Error reading file', 'error');
    };

    reader.readAsText(file);
  },

  /**
   * Show import confirmation modal with metadata
   * @param {string} jsonString - JSON string to import
   * @param {string} filename - Filename of the imported file
   */
  showImportConfirmation(jsonString, filename = 'Unknown file') {
    try {
      const data = JSON.parse(jsonString);
      const metadata = data.metadata || {};
      const currentTaskCount = TaskManager.tasks.length;

      // Build metadata display HTML with filename at top
      let metadataHTML = `<div style="background-color: var(--bg-tertiary); padding: var(--spacing-sm); border-radius: var(--radius-sm); margin-bottom: var(--spacing-md); word-break: break-all;">
        <strong>📄 File:</strong> ${Utils.escapeHtml(filename)}
      </div>`;

      metadataHTML += '<h3 style="margin-bottom: var(--spacing-md);">Export Details:</h3>';
      metadataHTML += '<div class="import-metadata-row">';
      metadataHTML += '<span class="import-metadata-label">Exported:</span>';
      metadataHTML += `<span class="import-metadata-value">${metadata.exportDateDisplay || 'Unknown'}</span>`;
      metadataHTML += '</div>';

      metadataHTML += '<div class="import-metadata-row">';
      metadataHTML += '<span class="import-metadata-label">Device:</span>';
      metadataHTML += `<span class="import-metadata-value">${metadata.device || 'Unknown'}</span>`;
      metadataHTML += '</div>';

      metadataHTML += '<div class="import-metadata-row">';
      metadataHTML += '<span class="import-metadata-label">User:</span>';
      metadataHTML += `<span class="import-metadata-value">${metadata.userName || 'Unknown'}</span>`;
      metadataHTML += '</div>';

      metadataHTML += '<div class="import-metadata-row">';
      metadataHTML += '<span class="import-metadata-label">Tasks in File:</span>';
      metadataHTML += `<span class="import-metadata-value">${metadata.taskCount || data.tasksCount || 0}</span>`;
      metadataHTML += '</div>';

      metadataHTML += '<div class="import-metadata-row">';
      metadataHTML += '<span class="import-metadata-label">Export Type:</span>';
      metadataHTML += `<span class="import-metadata-value">${metadata.exportType || 'all'}</span>`;
      metadataHTML += '</div>';

      metadataHTML += '<h3 style="margin-top: var(--spacing-md); margin-bottom: var(--spacing-md);">Current App:</h3>';
      metadataHTML += '<div class="import-metadata-row">';
      metadataHTML += '<span class="import-metadata-label">Current Tasks:</span>';
      metadataHTML += `<span class="import-metadata-value">${currentTaskCount}</span>`;
      metadataHTML += '</div>';

      // Update modal content
      const metadataEl = document.getElementById('import-metadata');
      if (metadataEl) metadataEl.innerHTML = metadataHTML;

      // Update warning text
      const warningEl = document.getElementById('import-warning-text');
      if (warningEl) {
        warningEl.textContent = `This will replace your current ${currentTaskCount} task${currentTaskCount !== 1 ? 's' : ''} with ${metadata.taskCount || data.tasksCount || 0} task${(metadata.taskCount || data.tasksCount) !== 1 ? 's' : ''} from the file.`;
      }

      // Store JSON for later import
      this.pendingImport = jsonString;

      // Show modal
      const modal = document.getElementById('import-confirm-modal');
      if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
      }
    } catch (err) {
      console.error('Error parsing import file:', err);
      Utils.showToast('Invalid JSON file', 'error');
    }
  },

  /**
   * Cancel import and close modal
   */
  cancelImport() {
    const modal = document.getElementById('import-confirm-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
    this.pendingImport = null;
  },

  /**
   * Confirm import after user reviews metadata
   */
  confirmImportAfterReview() {
    if (!this.pendingImport) return;

    // Store the JSON string before clearing
    const jsonToImport = this.pendingImport;

    // Check if user wants to enable auto-import
    const autoImportCheckbox = document.getElementById('auto-import-checkbox');
    if (autoImportCheckbox && autoImportCheckbox.checked) {
      localStorage.setItem('autoImport', 'true');
    }

    // Close modal (this clears this.pendingImport)
    this.cancelImport();

    // Execute import with the stored JSON string
    this.executeImport(jsonToImport);
  },

  /**
   * Execute the actual import
   * @param {string} jsonString - JSON string to import
   */
  executeImport(jsonString) {
    try {
      const result = TaskManager.importTasks(jsonString, true); // merge=true

      if (result.success) {
        this.renderTaskList();
        this.updateStats();
        Utils.showToast(`Imported ${result.imported} tasks`, 'success');
      } else {
        Utils.showToast(`Import error: ${result.error}`, 'error');
      }
    } catch (err) {
      console.error('Import error:', err);
      Utils.showToast('Error importing tasks', 'error');
    }
  }
};

// Make UI globally available
if (typeof window !== 'undefined') {
  window.UI = UI;
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UI;
}
