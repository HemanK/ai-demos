# Changelog

All notable changes to the Family ToDo App will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.1.0] - 2025-10-29

### Added - P0 Features (Critical Updates)

#### 1. Configurable Family Names with Data Migration
- **Changed member names from real names to M1-M5** for privacy and configurability
- **Automatic data migration** from v1.0 to v1.1 with legacy name mapping
- Storage version bumped to 1.1 with seamless upgrade path
- All existing tasks automatically migrated to new member IDs
- Configuration in `js/config.js` for easy customization
- Files: `js/config.js`, `js/storage.js`

#### 2. Expanded Categories and Subcategories
- **Expanded from 7 to 14 task categories**:
  - Added: Doctors, Meds, Travel, Project, Jobs, Auto_Insurance, Health_Insurance, Home_2
  - Existing: Shopping, Household, Bills, Investments, Work, Other
- **Subcategory field** added to all tasks (simple text input)
- Category-specific emojis and colors for better visual organization
- Updated all forms and filters to support new categories
- Files: `js/config.js`, `js/taskManager.js`, `js/ui.js`, `index.html`

#### 3. Selective Export/Import
- **Smart export**: Choose between filtered tasks or all tasks
- **Custom filename**: Prompt for user-defined export filename
- Automatic .json extension if not provided
- Export info shows count of tasks being exported
- Backup reminder system with localStorage tracking
- Files: `js/ui.js`

#### 4. Device Tracking
- **Automatic device detection** on task creation
- Tracks both device type (iPhone, Mac, Android, Windows, Linux) and browser (Chrome, Safari, Firefox, Edge)
- Stored in `createdFrom` field for troubleshooting and analytics
- User agent parsing in `Utils.getDeviceInfo()`
- Files: `js/utils.js`, `js/taskManager.js`

#### 5. Enhanced AI Natural Language Parsing
- **Numeric date parsing**: Supports formats like "10/31", "12/25"
- **Day name parsing**: Recognizes "Monday", "Tuesday", etc. with next-occurrence calculation
- **Separated priority from urgency**: Fixed bug where both fields were set incorrectly
- **Smart title/description/notes extraction**:
  - First sentence → title (max 60 chars)
  - Next 1-2 sentences → description
  - Remaining sentences → notes
- **Better keyword removal**: Cleans dates, times, priority/urgency keywords from title
- **Enhanced category detection**: Updated to recognize all 14 categories
- More intuitive natural language input processing
- Files: `js/app.js`

#### 6. Pagination for Large Task Lists
- **Automatic pagination** when 20+ tasks are present
- **Smart page controls**:
  - Shows "X-Y of Z tasks" info
  - Previous/Next buttons with disabled states
  - Page number buttons (max 5 visible with ellipsis)
  - Current page highlighted
- **Auto-scroll to top** when changing pages
- **Filter/sort integration**: Resets to page 1 when filters or sorting changes
- Hidden when not needed (≤20 tasks)
- Mobile-responsive design
- Files: `js/ui.js`, `css/main.css`, `index.html`

### Technical Improvements

- **Storage versioning system** with automatic migration
- **Error handling** with rollback mechanisms in TaskManager
- **WCAG 2.1 accessibility** maintained across all new features
- **Modular code structure** following DRY principles
- **Comprehensive inline documentation** with JSDoc comments

### Files Changed

**JavaScript Modules:**
- `js/config.js` - Member names, categories, legacy mapping, storage version
- `js/storage.js` - Data migration logic
- `js/utils.js` - Device detection utility
- `js/taskManager.js` - Subcategory and device tracking fields
- `js/ui.js` - Pagination logic, selective export, subcategory display
- `js/app.js` - Enhanced natural language parsing

**HTML/CSS:**
- `index.html` - Category/member dropdowns, subcategory field, pagination container
- `css/main.css` - Pagination styles

### Migration Notes

**From v1.0 to v1.1:**
- Automatic migration runs on first load after update
- Legacy member names mapped to new IDs:
  - Sarah → M1 (member1)
  - Mike → M2 (member2)
  - Alex → M3 (member3)
  - Emma → M4 (member4)
  - James → M5 (member5)
- All existing tasks preserved with updated member assignments
- No data loss - fully backward compatible
- Migration timestamp added to migrated tasks

### Known Limitations

- **Natural language parsing** is rule-based (not AI-powered yet) - works for common patterns
- **Pagination** shows 20 tasks per page (not configurable via UI)
- **Export/import** uses JSON format only (no CSV, Excel support)
- **No undo/redo** functionality yet

## [1.0.0] - 2025-10-27

### Initial Release - MVP

#### Core Features
- Task CRUD operations (Create, Read, Update, Delete)
- Task fields: title, description, category, assigned member, due date, time of day, priority, urgency, status, notes
- Local storage persistence
- Multi-member family support (originally 5 named members + "all")
- 7 task categories with emoji icons
- Task status tracking (pending, in-progress, completed)
- Priority and urgency levels (High, Medium, Low)
- Due date with relative labels (Today, Tomorrow, Overdue, etc.)
- Export/Import tasks (JSON format)
- Basic natural language task parsing
- Responsive design (mobile-first)
- WCAG 2.1 accessibility compliance

#### UI Components
- Dashboard with statistics (pending, overdue, completed today)
- Task list with filtering (category, priority, status, member)
- Task sorting (by due date, priority, created date, member)
- Modal form for task creation/editing
- Toast notifications
- Loading overlay
- Empty states

#### Architecture
- Vanilla JavaScript ES6+ (no frameworks)
- Modular code organization:
  - config.js - Configuration
  - utils.js - Utility functions
  - storage.js - localStorage management
  - taskManager.js - Business logic
  - ui.js - DOM manipulation
  - app.js - Initialization and orchestration
- Multi-agent architecture prepared (agents, tools folders)
- Client-side only (no backend required)

#### Browser Support
- Primary: iPhone Chrome, Mac Chrome
- Secondary: iPhone Safari
- Modern browsers with ES6+ support

### Technical Stack
- HTML5, CSS3, JavaScript ES6+
- localStorage API for data persistence
- No external dependencies
- GitHub Pages deployment ready

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR version** (X.0.0) - Incompatible API changes or major feature overhauls
- **MINOR version** (0.X.0) - New functionality in a backward-compatible manner
- **PATCH version** (0.0.X) - Backward-compatible bug fixes

## Future Versions

See [ROADMAP.md](ROADMAP.md) for planned features and enhancements.
