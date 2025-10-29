/**
 * Application Configuration
 * Central configuration for the Family ToDo app
 */

const CONFIG = {
  // App Info
  APP_NAME: 'Family ToDo',
  VERSION: '1.0.0',

  // Storage
  STORAGE_KEY: 'familyTodoTasks',
  STORAGE_VERSION: '1.1', // Bumped for data migration

  // Family Members - CONFIGURABLE: Edit these to customize for your family/team
  FAMILY_MEMBERS: [
    { id: 'member1', name: 'M1', color: '#E3F2FD' },
    { id: 'member2', name: 'M2', color: '#E8F5E9' },
    { id: 'member3', name: 'M3', color: '#FFF9C4' },
    { id: 'member4', name: 'M4', color: '#FCE4EC' },
    { id: 'member5', name: 'M5', color: '#E0F2F1' },
    { id: 'all', name: 'All Family', color: '#F5F5F5' }
  ],

  // Legacy member name mapping (for data migration from v1.0 to v1.1)
  LEGACY_MEMBER_MAPPING: {
    'Sarah': 'member1',  // M1
    'Mike': 'member2',   // M2
    'Alex': 'member3',   // M3
    'Emma': 'member4',   // M4
    'James': 'member5'   // M5
  },

  // Task Categories - CONFIGURABLE: Add/remove categories as needed
  CATEGORIES: [
    { id: 'Shopping', name: 'Shopping', emoji: '🛒', color: '#4CAF50' },
    { id: 'Household', name: 'Household', emoji: '🏠', color: '#2196F3' },
    { id: 'Bills', name: 'Bills', emoji: '💰', color: '#F44336' },
    { id: 'Auto_Insurance', name: 'Auto Insurance', emoji: '🚗', color: '#FF5722' },
    { id: 'Health_Insurance', name: 'Health Insurance', emoji: '🏥', color: '#E91E63' },
    { id: 'Investments', name: 'Investments', emoji: '📈', color: '#FF9800' },
    { id: 'Work', name: 'Work', emoji: '💼', color: '#607D8B' },
    { id: 'Doctors', name: 'Doctors', emoji: '👨‍⚕️', color: '#00BCD4' },
    { id: 'Meds', name: 'Meds', emoji: '💊', color: '#9C27B0' },
    { id: 'Travel', name: 'Travel', emoji: '✈️', color: '#3F51B5' },
    { id: 'Project', name: 'Project', emoji: '📋', color: '#009688' },
    { id: 'Jobs', name: 'Jobs', emoji: '💼', color: '#795548' },
    { id: 'Home_2', name: 'Home 2', emoji: '🏡', color: '#8BC34A' },
    { id: 'Other', name: 'Other', emoji: '📌', color: '#757575' }
  ],

  // Priority Levels
  PRIORITIES: {
    High: { label: 'High', emoji: '🔴', color: '#F44336' },
    Medium: { label: 'Medium', emoji: '🟡', color: '#FF9800' },
    Low: { label: 'Low', emoji: '🟢', color: '#4CAF50' }
  },

  // Urgency Levels
  URGENCY: {
    High: { label: 'High', emoji: '🔴', color: '#F44336' },
    Medium: { label: 'Medium', emoji: '🟡', color: '#FF9800' },
    Low: { label: 'Low', emoji: '🟢', color: '#4CAF50' }
  },

  // Status
  STATUS: {
    pending: { label: 'Pending', emoji: '⏳', color: '#757575' },
    'in-progress': { label: 'In Progress', emoji: '⚙️', color: '#2196F3' },
    completed: { label: 'Completed', emoji: '✅', color: '#4CAF50' }
  },

  // Time of Day
  TIME_OF_DAY: {
    Morning: { label: 'Morning', emoji: '☀️', timeRange: '6am-12pm' },
    Afternoon: { label: 'Afternoon', emoji: '🌤️', timeRange: '12pm-5pm' },
    Evening: { label: 'Evening', emoji: '🌆', timeRange: '5pm-9pm' },
    Night: { label: 'Night', emoji: '🌙', timeRange: '9pm-6am' }
  },

  // AI Configuration
  AI: {
    ENABLED: false, // Will be enabled when API key is set
    PROVIDER: 'claude', // 'claude' | 'openai' | 'local'
    MODEL: {
      SmartParser: 'claude-3-5-sonnet-20241022',
      CategoryWizard: 'claude-3-haiku-20240307',
      RiskAdvisor: 'claude-3-haiku-20240307',
      TeamCoordinator: 'claude-3-haiku-20240307'
    },
    MAX_TOKENS: 1024,
    TEMPERATURE: 0.7,
    TIMEOUT: 10000 // 10 seconds
  },

  // UI Settings
  UI: {
    TOAST_DURATION: 3000, // 3 seconds
    ANIMATION_DURATION: 250, // milliseconds
    ITEMS_PER_PAGE: 50
  },

  // Date Settings
  DATE: {
    FORMAT: 'YYYY-MM-DD',
    DEFAULT_DUE_DATE: 'friday', // Default to Friday of current week
    DATE_PATTERNS: {
      today: /\btoday\b/i,
      tomorrow: /\btomorrow\b/i,
      thisWeek: /\bthis week\b/i,
      nextWeek: /\bnext week\b/i,
      friday: /\bfriday\b/i,
      monday: /\bmonday\b/i
    }
  },

  // Export/Import
  EXPORT: {
    FILENAME_PREFIX: 'family-todo-backup',
    MIME_TYPE: 'application/json',
    AUTO_BACKUP_DAYS: 7 // Remind every 7 days
  }
};

// Make CONFIG globally available (read-only)
if (typeof window !== 'undefined') {
  window.CONFIG = Object.freeze(CONFIG);
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
