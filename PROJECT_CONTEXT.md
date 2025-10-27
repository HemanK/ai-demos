# GenAI Family ToDo App - Project Context

## 📋 Project Overview

**Goal**: Build a sophisticated GenAI-powered family task management app that demonstrates AI/GenAI mastery for portfolio, LinkedIn articles, and YouTube content.

**Primary Objectives** (in priority order):
1. 🎓 **Learn & Demonstrate AI/GenAI Concepts**: Agents, SubAgents, Tools, Agent Framework
2. 📱 **Create Usable App**: Actually use it daily on Mac & iPhone (Chrome)
3. 📄 **Professional Artifacts**: Showcase-worthy PRD, architecture, code for employers/investors
4. 🎬 **Content Creation**: Material for LinkedIn articles and YouTube videos
5. 💼 **Portfolio Piece**: Demonstrate to potential employers, investors, co-founders

## 🎯 Key Requirements

### User Needs
- 5 family members can create, assign, delegate tasks
- Categories: Shopping, Household, Bills, Insurance, Investments, Work, Other (customizable)
- Priority: High/Medium/Low
- Urgency: High/Medium/Low
- Due dates with calendar tracking
- Filter & sort by member, date, category, priority, urgency
- Color-coded status (pending, in-progress, completed)

### AI/GenAI Features (Priority Order)
1. **NLP Entry** (Priority 1): "Buy milk tomorrow morning" → Auto-populate task form
2. **Daily Briefing** (Priority 2): AI-generated summary and recommendations
3. **Risk Analyzer** (Priority 3): Identify tasks at risk of missing deadlines

### Technical Stack
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Storage**: localStorage + Export/Import (backend later)
- **AI**: Claude API integration
- **Testing**: Unit tests + agent behavior tests
- **Design**: Mobile-first (iPhone Chrome, Mac Safari)

## 🤖 AI/GenAI Architecture

### Agent Framework
```
TaskMaster Agent (Main Orchestrator)
    │
    ├── SmartParser (NLP SubAgent) - Natural language → Structured data
    ├── CategoryWizard (Categorization SubAgent) - Auto-categorization
    ├── RiskAdvisor (Risk Analysis SubAgent) - Identify at-risk tasks
    └── TeamCoordinator (Delegation SubAgent) - Suggest assignments
```

### Tools (Functions Agents Can Use)
- Date Extractor: Parse "next Friday" → ISO date
- Priority Detector: Extract priority from text
- Category Matcher: Semantic similarity to categories
- Workload Analyzer: Calculate tasks per member
- Risk Scorer: Score based on deadline, priority, workload

### AI Integration
- **API**: Claude API (Sonnet for complex, Haiku for simple)
- **Cost**: ~$0.01-0.05 per AI-powered task entry
- **Error Handling**: Graceful degradation (manual fallback if AI fails)
- **Token Tracking**: Monitor usage and costs

## 📁 File Locations

**Repository**: https://github.com/HemanK/ai-demos
**Branch**: `claude/family-todo-app-011CUWmV6BWpuQqzmaCSjxLm`

**Local Path**: `/home/user/ai-demos/`

### Current File Structure
```
/home/user/ai-demos/
├── PROJECT_CONTEXT.md          ← You are here (session continuity)
├── docs/
│   └── PRD.md                  ← Comprehensive 12-page PRD
└── .git/                       ← Git repository
```

### Planned Structure
```
/home/user/ai-demos/
├── PROJECT_CONTEXT.md
├── README.md
├── index.html
├── docs/
│   ├── PRD.md                  ✅ DONE
│   └── ARCHITECTURE.md         ✅ DONE
├── css/
│   ├── main.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── storage.js
│   ├── taskManager.js
│   ├── ui.js
│   ├── utils.js
│   ├── agents/
│   │   ├── agentFramework.js
│   │   ├── taskMasterAgent.js
│   │   ├── smartParser.js
│   │   ├── categoryWizard.js
│   │   ├── riskAdvisor.js
│   │   └── teamCoordinator.js
│   ├── tools/
│   │   ├── dateCalculator.js
│   │   ├── categoryMatcher.js
│   │   ├── workloadAnalyzer.js
│   │   └── riskScorer.js
│   └── ai/
│       ├── claudeClient.js
│       └── prompts.js
└── tests/
    ├── taskManager.test.js
    ├── agents.test.js
    └── tools.test.js
```

## 🔑 Key Decisions Made

### Technical Decisions
- ✅ **localStorage** for now (not Google Sheets) - simpler, add backend later
- ✅ **Vanilla JS** (no frameworks) - cleaner for portfolio showcase
- ✅ **Friendlier agent names** (SmartParser vs NLPParserSubAgent)
- ✅ **Mobile-first design** (iPhone Chrome primary, Mac Safari secondary)
- ✅ **Export/Import** for cross-device sync until backend ready
- ✅ **Simple dropdown** for user selection (no authentication yet)

### Scope Decisions
- ✅ **Start with Simple & Moderate complexity** (Calendar view & recurring tasks later)
- ✅ **AI is optional enhancement** (manual entry always works)
- ✅ **Focus on usability** (not just a tech demo - actually useful)
- ✅ **Token-conscious** (documentation in files, not in chat)

### Content Strategy
- ✅ **PRD serves dual purpose**: Product spec + educational content
- ✅ **Reusable templates**: Can adapt for future AI projects
- ✅ **Modern startup tone**: Professional but accessible
- ✅ **Explain AI concepts**: Assume reader has basics, no elementary stuff

## 📊 Current Status

### Completed ✅
- [x] Project planning and requirements gathering
- [x] Comprehensive PRD (12 pages, ~12,000 words)
- [x] Git repository setup
- [x] Branch created: `claude/family-todo-app-011CUWmV6BWpuQqzmaCSjxLm`
- [x] Initial commit and push to GitHub
- [x] PROJECT_CONTEXT.md for session continuity
- [x] Architecture documentation with 10+ Mermaid diagrams (40+ pages)
- [x] All documentation pushed to GitHub

### In Progress 🔄
- [ ] Awaiting user review and approval of architecture

### Next Steps ⏭️
1. Set up project file structure (directories, placeholder files)
3. Implement core agent framework
4. Build SmartParser (NLP Entry - Priority 1)
5. Build RiskAdvisor (Priority 3)
6. Build Daily Briefing (Priority 2)
7. Implement task CRUD operations
8. Build mobile-first UI
9. Add Export/Import functionality
10. Write comprehensive tests
11. Create README
12. Test on Mac Safari and iPhone Chrome

## 💡 AI/GenAI Concepts Being Demonstrated

1. **Agent Architecture**: Autonomous components using LLMs for decisions
2. **Multi-Agent Orchestration**: TaskMaster coordinates specialized SubAgents
3. **Tool Use (Function Calling)**: Agents invoke deterministic functions
4. **Prompt Engineering**: Specialized prompts per SubAgent, few-shot examples
5. **Agentic Workflows**: Multi-step processes with intermediate decisions
6. **Graceful Degradation**: System works even when AI fails
7. **Cost-Aware AI**: Token tracking, caching, tiered intelligence
8. **Domain-Specific Agents**: Specialized for NLP, categorization, risk analysis

## 🎬 Content Creation Plan

### LinkedIn Articles (2-3 planned)
1. "Building a Multi-Agent AI System in a Weekend"
2. "Practical Prompt Engineering: Lessons from a Family ToDo App"
3. "Why Your AI Side Project Needs Graceful Degradation"

### YouTube Videos (1-2 planned)
1. "I Built an AI-Powered ToDo App with Agents, SubAgents, and Tools"
   - Live demo (5 min)
   - Code walkthrough (10 min)
   - Agent architecture explanation (5 min)

## 🔄 Session Continuity Instructions

### To Resume in a New Session:

**If you're continuing this work**, use this prompt:
```
I'm continuing work on the GenAI-powered Family ToDo app.

Please review:
1. /home/user/ai-demos/PROJECT_CONTEXT.md
2. /home/user/ai-demos/docs/PRD.md
3. Recent git commits (git log)

Current status: [check PROJECT_CONTEXT.md for latest status]
Next step: [check "Next Steps" section above]

Continue from where we left off. Use the TodoWrite tool to track progress.
```

**What I'll do**:
1. Read PROJECT_CONTEXT.md and PRD.md
2. Check git log for recent work
3. Update todo list
4. Continue seamlessly

### Important Context
- **Timeline**: Aiming for working app in 1-2 days
- **API Key**: User has Claude API key ready
- **Token Budget**: 200,000 tokens per session (currently ~40k used)
- **Testing Philosophy**: Unit tests for code + agent behavior tests
- **Documentation**: Professional quality for portfolio showcase

## 📱 Cross-Device Access

### Viewing on iPhone
1. **This conversation**: Go to `claude.com/code` in Chrome/Safari on iPhone
2. **The code/files**: Visit https://github.com/HemanK/ai-demos/tree/claude/family-todo-app-011CUWmV6BWpuQqzmaCSjxLm
3. **The app (once built)**: Open index.html in iPhone Chrome

### Syncing Data Between Devices
- **Short term**: Use Export/Import feature (manual)
- **Long term**: Add backend (Firebase/Supabase) for automatic sync

## 🎯 Success Criteria

### Functional
- Family can manage 100+ tasks effectively
- <30 seconds to create a task (vs 2+ min manually)
- >80% AI suggestion acceptance rate

### Portfolio
- PRD reviewed positively by 3+ technical peers
- Clean code suitable for GitHub showcase
- 2+ LinkedIn articles published
- 1+ YouTube video with >100 views
- Used in 3+ job interviews

### Technical
- >80% test coverage
- <2s load time, <3s AI response time
- <1% data loss rate
- Works on iPhone Chrome and Mac Safari

## 📞 Contact & Resources

**Claude API**: https://console.anthropic.com/
**Repository**: https://github.com/HemanK/ai-demos
**Documentation**: All in `/docs/` directory

---

**Last Updated**: 2025-10-27 (Session 1 - Documentation Phase Complete)
**Status**: ✅ All documentation complete and pushed to GitHub
**Next Session**: Review architecture, then begin implementation
