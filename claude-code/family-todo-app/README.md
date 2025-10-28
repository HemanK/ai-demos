# 📋 GenAI Family ToDo App

A sophisticated task management application featuring multi-agent AI architecture, natural language processing, and intelligent task analysis.

## ✨ Features

### Core Features
- ✅ **Task Management**: Create, edit, delete, and manage tasks
- 📊 **Smart Filtering**: Filter by category, priority, status, and family member
- 🔄 **Flexible Sorting**: Sort by due date, priority, creation date, or member
- 💾 **Export/Import**: Backup and restore tasks via JSON
- 📱 **Mobile-First**: Responsive design optimized for iPhone Chrome, Mac Chrome, and iPhone Safari
- ♿ **Accessible**: WCAG 2.1 Level AA compliant

### AI-Powered Features (Coming Soon)
- 🤖 **Natural Language Entry**: "Buy milk tomorrow morning" → Auto-populated task
- 📅 **Daily Briefing**: AI-generated summary of today's and tomorrow's tasks
- ⚠️ **Risk Analysis**: Identifies tasks at risk of missing deadlines
- 🎯 **Smart Suggestions**: AI-powered category and priority recommendations

## 🚀 Quick Start

### Option 1: Open Directly
1. Double-click `index.html` to open in your browser
2. Start adding tasks!

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js
npx http-server
```

Then open: `http://localhost:8000`

### Option 3: GitHub Pages
1. Push this repository to GitHub
2. Enable GitHub Pages in repository settings
3. Your app will be live at: `https://yourusername.github.io/repository-name/`

## 📖 User Guide

### Adding a Task

**Option A: Quick Natural Language Entry**
1. Click "Add Task"
2. Type in natural language: `"Pay electric bill Friday high priority"`
3. Click "Parse with AI"
4. Review and save

**Option B: Manual Entry**
1. Click "Add Task"
2. Fill in the form fields
3. Click "Save Task"

### Managing Tasks

**Filter Tasks**
- Use the dropdown filters to show specific categories, priorities, or statuses
- Select a family member to see only their tasks

**Update Task Status**
- Click "Start" to mark a task as in-progress
- Click "Complete" to mark as done
- Click "Edit" to modify details
- Click "Delete" to remove

### Backup & Sync

**Export Tasks**
1. Click "📤 Export"
2. Save the JSON file to your device

**Import Tasks**
1. Click "📥 Import"
2. Select a previously exported JSON file
3. Tasks will be merged with existing ones

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Storage**: localStorage with JSON export/import
- **AI Integration**: Ready for Claude API (not yet implemented)
- **Design**: Mobile-first responsive design

### Project Structure
```
family-todo-app/
├── index.html              # Main app interface
├── css/
│   └── main.css            # Mobile-first styles (WCAG 2.1 AA)
├── js/
│   ├── config.js           # App configuration
│   ├── utils.js            # Utility functions
│   ├── storage.js          # localStorage wrapper
│   ├── taskManager.js      # Task CRUD operations
│   ├── ui.js               # DOM rendering
│   ├── app.js              # App initialization
│   ├── agents/             # AI agents (coming soon)
│   ├── tools/              # Agent tools (coming soon)
│   └── ai/                 # AI integration (coming soon)
├── docs/
│   ├── PRD.md              # Product Requirements Document
│   ├── ARCHITECTURE.md     # Detailed architecture
│   └── FEEDBACK_2025-10-27.md # User feedback log
└── README.md               # This file
```

### Key Design Principles
1. **Modularity**: Small, single-responsibility functions
2. **Testability**: Easy to unit test each component
3. **Maintainability**: Clear code structure and documentation
4. **Extensibility**: Add new features without major rewrites
5. **Accessibility**: WCAG 2.1 Level AA compliant
6. **Performance**: Optimized for 1000+ tasks

## 🤖 AI Integration (Roadmap)

### Current Status
- ✅ Architecture designed for multi-agent system
- ✅ Rule-based parsing as fallback
- ⏳ Claude API integration (coming soon)
- ⏳ SmartParser Agent (coming soon)
- ⏳ Risk Advisor Agent (coming soon)

### How to Enable AI Features
1. Get your Claude API key from: https://console.anthropic.com/
2. Open `js/config.js`
3. Set `CONFIG.AI.ENABLED = true`
4. Add your API key handling (see ARCHITECTURE.md)

## 📊 Data Storage

### localStorage
- Tasks are automatically saved to your browser's localStorage
- Data persists between sessions
- **Capacity**: ~5-10MB (sufficient for 1000+ tasks)

### Data Privacy
- All data stays on your device
- No data is sent to any server (unless AI features are enabled)
- Export your data anytime for full control

### Limitations
- Data is browser-specific (Chrome vs Safari have separate storage)
- Clearing browser data will delete tasks (use Export regularly!)
- No automatic sync across devices (manual export/import required)

## 🛠️ Development

### Code Quality
- **Lines of Code**: ~2,970 lines (HTML, CSS, JS)
- **Browser Support**: Modern browsers (ES6+)
- **No Dependencies**: Vanilla JavaScript (no frameworks)
- **Documentation**: Comprehensive inline comments

### Future Enhancements
- [ ] Full AI agent implementation
- [ ] OpenAI provider support
- [ ] Real-time collaboration
- [ ] Backend sync (Firebase/Supabase)
- [ ] Calendar integration
- [ ] Recurring tasks
- [ ] Subtasks and checklists
- [ ] File attachments
- [ ] Email notifications

## 📝 License

This is a portfolio project demonstrating AI/GenAI implementation patterns. Feel free to learn from and adapt the code for your own projects.

## 🔗 Links

- **Documentation**: [PRD.md](./docs/PRD.md) | [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **Repository**: https://github.com/HemanK/ai-demos/tree/main/claude-code/family-todo-app
- **Portfolio**: More AI projects at https://github.com/HemanK/ai-demos

## 🙋 Support

For questions or issues:
1. Check the [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for technical details
2. Review the [PRD.md](./docs/PRD.md) for feature specifications
3. Open an issue on GitHub (if repository is public)

---

**Built with** ❤️ **using GenAI Multi-Agent Architecture**
