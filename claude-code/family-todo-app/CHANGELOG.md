# Changelog

All notable changes to the Family ToDo App will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.1.0] - 2025-10-30 - PRODUCTION READY ✅

### Critical Bug Fixes (Session 2 - Oct 30, 2025)

#### 1. Import REPLACE Bug (CRITICAL)
- **Fixed:** Import was MERGING tasks instead of REPLACING them
- **Root cause:** `importTasks()` was called with `merge=true` instead of `false`
- **Impact:**
  - Deleted tasks on one device persisted after import on another device
  - Edits made on one device not reflected after import
  - Task counts mismatched between devices
- **Fix:** Changed to REPLACE mode - now properly replaces ALL tasks with imported data
- **Success message:** "✓ Replaced all tasks with X imported tasks"
- **Files:** `js/ui.js`

#### 2. Export Null Reference Error
- **Fixed:** Red error appearing after successful export: "Cannot read properties of null (reading 'tasks')"
- **Root cause:** Accessing `this.pendingExport.tasks.length` AFTER `closeFilenameModal()` set it to null
- **Fix:** Store task count in local variable before closing modal
- **Files:** `js/ui.js`

#### 3. Corrupted Task Cleanup
- **Fixed:** Null/undefined tasks accumulating in localStorage causing count mismatches
- **Root cause:** Deleted tasks leaving corrupted entries in storage
- **Fix:** Triple-layer filtering:
  - Clean corrupted tasks when loading from storage (`getTasks()`)
  - Clean corrupted tasks before saving to storage (`saveTasks()`)
  - Clean corrupted tasks before exporting (`handleExport()`)
- **Console warnings:** Now shows "Filtered out X corrupted/null tasks" when detected
- **Files:** `js/storage.js`, `js/ui.js`

#### 4. Invalid JSON Import Error
- **Fixed:** "Invalid JSON file" error when importing
- **Root cause:** `confirmImportAfterReview()` called `cancelImport()` which cleared `this.pendingImport`, then tried to pass null to `executeImport()`
- **Fix:** Store JSON string in local variable before calling `cancelImport()`
- **Files:** `js/ui.js`

#### 5. 404 Errors on App Startup
- **Fixed:** Console errors for missing files: `js/tools/dateExtractor.js` and `js/tools/priorityDetector.js`
- **Root cause:** HTML referenced non-existent files (planned for v2.0 Advanced AI features)
- **Fix:** Removed script tags, added comment noting deferral to v2.0
- **Files:** `index.html`

### Enhancements (Session 2 - Oct 30, 2025)

#### 1. JSON Export Metadata
- **Added comprehensive metadata** to all JSON exports:
  - Export date/time (ISO + display format)
  - Device/browser information (auto-detected)
  - User who exported (from current user dropdown)
  - Task count
  - App version
  - Export type (all/filtered)
- **Backward compatible:** Works with old JSON files without metadata
- **Browser detection:** Identifies Mac, Windows, Linux, iPhone, iPad, Android + Chrome, Safari, Firefox, Edge
- **Files:** `js/storage.js`, `js/ui.js`

#### 2. Import Confirmation Modal
- **Shows metadata before importing:**
  - Full filename (prominently at top)
  - Export date/time
  - Device/browser that created export
  - User who exported
  - Task count in file
  - Current task count in app
- **Warning message:** Clear explanation that import will replace all current tasks
- **Auto-import setting:** "Don't ask again" checkbox for power users
- **Files:** `index.html`, `css/main.css`, `js/ui.js`

#### 3. Modal Layering Fix
- **Fixed:** Edit modal appearing behind Daily Briefing/Risk Analysis modals
- **Solution:** Added separate handlers with 350ms delay for smooth transitions:
  - `handleEditTaskFromBriefing()` - Closes briefing, waits, opens edit
  - `handleEditTaskFromRisk()` - Closes risk, waits, opens edit
- **Files:** `js/ui.js`, `js/app.js`

#### 4. Dashboard Stat Card Visual Improvements
- **Changed** from gray background to blue gradient with white text
- **Added** subtle shadow for depth
- **Improved** contrast and readability on all devices
- **CSS:** `background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)`
- **Files:** `css/main.css`

#### 5. Enhanced Export Logging
- **Console debugging:** Added detailed preparation logs showing:
  - Total tasks in TaskManager
  - Tasks being prepared for export
  - Valid tasks after filtering nulls
  - Number of corrupted tasks filtered
- **Success indicators:** Checkmark (✓) in toast messages for clarity
- **Files:** `js/ui.js`

### Technical Improvements (Session 2)

- **Data integrity:** Automatic cleanup of corrupted/null tasks
- **Cross-device sync:** Import now properly replaces data for true sync
- **Defensive programming:** Added null checks and validation throughout
- **Better error messages:** Specific reasons instead of generic errors
- **Console logging:** Detailed debugging information for troubleshooting

### Files Changed (Session 2)

**JavaScript Modules:**
- `js/ui.js` - Import REPLACE fix, export null fix, modal handlers, import confirmation, logging
- `js/storage.js` - Metadata generation, browser detection, corrupted task filtering
- `js/app.js` - Modal layering fixes for briefing/risk

**HTML/CSS:**
- `index.html` - Import confirmation modal, removed non-existent script tags
- `css/main.css` - Import modal styles, stat card improvements

### Known Issues (Low Priority)

- **aria-hidden focus warning:** "Blocked aria-hidden on an element because its descendant retained focus"
  - Impact: None (accessibility warning only)
  - Cause: Modal focus management
  - Status: Deferred to v1.2 or v1.3 cleanup

### Testing Summary

**Tested on:** Mac Chrome, iPhone Chrome/Safari
**Test scenarios:**
- ✅ Export creates file with metadata
- ✅ Export shows green success toast (no red errors)
- ✅ Import shows filename and metadata confirmation
- ✅ Import REPLACES all tasks (deleted tasks removed, edits applied)
- ✅ Task counts match between devices after import
- ✅ Modal layering works correctly (edit modal on top)
- ✅ No 404 errors on app startup
- ✅ Corrupted tasks automatically cleaned

### Migration Notes

**No data migration required for v1.1.0 bug fixes** - all changes are runtime fixes and enhancements.

**Import behavior change:**
- **Old behavior:** Imported tasks were MERGED with existing tasks
- **New behavior:** Imported tasks REPLACE all existing tasks
- **Warning:** Users should export before importing to have a backup

---

## [1.1.0] - 2025-10-29 - Initial v1.1.0 Release

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
