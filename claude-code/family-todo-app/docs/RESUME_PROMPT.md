# Resume Prompt for Future Claude Code Sessions

This document contains prompts to use when starting a new Claude Code session to continue work on the Family ToDo App.

---

## 📋 Full Version (Comprehensive)

Use this when you want complete context:

```
I'm continuing development on the Family ToDo App (GenAI-powered task manager).

PROJECT LOCATION:
- Repository: https://github.com/HemanK/ai-demos
- Branch: claude/session-011CUYNu4WJXSgZk6QcVRZpC
- Path: /claude-code/family-todo-app/

CURRENT STATUS:
- Version: 1.1.0 (production-ready)
- All P0 features implemented and committed
- Currently working on: Export UX improvements for iPhone

CONTEXT DOCUMENTS (read these first):
1. PROJECT_CONTEXT.md - Overall project context
2. PRD.md - Product requirements
3. ARCHITECTURE.md - Technical architecture
4. SESSION_LOG.md - Development history
5. CHANGELOG.md - Version history
6. ROADMAP.md - Future plans

IMMEDIATE TASK:
[Describe your current task or "Ready to receive new instructions"]

DEVELOPMENT APPROACH:
- Checkpoint commits every 15-20 minutes
- Test on iPhone Chrome (primary), Mac Chrome (secondary)
- Modular code, maintain backward compatibility
- Update CHANGELOG when making changes

Please confirm you've read the context and are ready to continue.
```

---

## 📋 Short Version (Quick Start)

Use this for quick continuation:

```
Continuing Family ToDo App development.
Repo: HemanK/ai-demos, branch: claude/session-011CUYNu4WJXSgZk6QcVRZpC
Path: /claude-code/family-todo-app/

Read: SESSION_LOG.md, CHANGELOG.md for context
Status: v1.1.0 complete

Task: [Describe your task]
Approach: Checkpoint every 15-20 min, test on iPhone Chrome

Ready to proceed?
```

---

## 🔄 Browser Switching

**Important:** You can use this prompt in ANY browser (Chrome, Comet, Edge, Safari). All context lives in GitHub, not in the browser session.

**When switching browsers:**
1. Open Claude Code in new browser
2. Use either prompt above
3. Claude will read context from GitHub
4. Continue seamlessly

**Why it works:**
- All code and docs are in GitHub repository
- Claude Code reads from git, not browser memory
- Each session is independent by design
- Your choice of browser doesn't matter

---

## 📝 Customization

**Before using, replace:**
- `[Describe your task]` → Your actual task
- `[Describe your current task...]` → Specific work item

**Optional additions:**
- Add specific file references if continuing work on particular files
- Add error messages or issues to investigate
- Add specific questions or concerns

---

## 💡 Tips for Effective Resumption

1. **Be Specific About Current Task:**
   - Bad: "Continue working"
   - Good: "Fix export filename truncation issue on iPhone"

2. **Include Any Recent Changes:**
   - "Just tested on iPhone, found issue with X"
   - "User reported bug in feature Y"

3. **Reference Specific Docs:**
   - "Per ROADMAP.md, implement P1 feature: multi-member tagging"
   - "Update CHANGELOG.md with recent fixes"

4. **Mention Testing Context:**
   - "Need to test on iPhone Chrome after these changes"
   - "Already tested on Mac, works fine there"

---

## 🎯 Common Scenarios

### Scenario 1: Bug Fixes

```
Continuing Family ToDo App development.
Repo: HemanK/ai-demos, branch: claude/session-011CUYNu4WJXSgZk6QcVRZpC
Path: /claude-code/family-todo-app/

Status: v1.1.0, found bug during iPhone testing
Issue: [Describe the bug]
Error: [Paste any error messages]

Read SESSION_LOG.md for context.
Checkpoint every 15-20 min, test on iPhone Chrome.

Ready to fix?
```

### Scenario 2: New Feature Implementation

```
Continuing Family ToDo App development.
Repo: HemanK/ai-demos, branch: claude/session-011CUYNu4WJXSgZk6QcVRZpC
Path: /claude-code/family-todo-app/

Status: v1.1.0 complete, ready for P1 features
Task: Implement [specific P1 feature from ROADMAP.md]

Read: ROADMAP.md, ARCHITECTURE.md for context
Checkpoint every 15-20 min, maintain modularity.

Ready to proceed?
```

### Scenario 3: Documentation Updates

```
Continuing Family ToDo App.
Repo: HemanK/ai-demos, branch: claude/session-011CUYNu4WJXSgZk6QcVRZpC
Path: /claude-code/family-todo-app/

Task: Update documentation
Files: [CHANGELOG.md, README.md, etc.]
Changes: [What needs updating]

Quick task, no need to read full context.
Ready?
```

---

## 📚 Key Documents Reference

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **SESSION_LOG.md** | Development history | Always (quick overview) |
| **CHANGELOG.md** | Version changes | Always (know what's changed) |
| **ROADMAP.md** | Future plans | When planning new features |
| **ARCHITECTURE.md** | Technical design | When modifying core architecture |
| **PRD.md** | Product requirements | When adding new features |
| **PROJECT_CONTEXT.md** | Overall context | First time or major changes |
| **DEPLOYMENT_OPTIONS.md** | Hosting methods | When deploying or testing |
| **PLAYWRIGHT_SETUP.md** | Testing setup | When writing tests |

---

## 🚀 Session Workflow Best Practices

1. **Start with Resume Prompt** (this file)
2. **Claude reads context** from GitHub docs
3. **Confirm understanding** before proceeding
4. **Work in focused sessions** (15-20 min checkpoints)
5. **Commit frequently** to avoid data loss
6. **Test immediately** after changes
7. **Update docs** (CHANGELOG, SESSION_LOG) as you go
8. **End with commit** ensuring all work is saved

---

## ⚠️ Important Reminders

- **Always work on branch:** `claude/session-011CUYNu4WJXSgZk6QcVRZpC`
- **Never commit to main** without explicit approval
- **Checkpoint every 15-20 minutes** (learned from session failure)
- **Test on iPhone Chrome first** (primary target)
- **Update CHANGELOG.md** for any user-facing changes
- **Maintain backward compatibility** for data migrations

---

## 📞 Getting Help Mid-Session

If Claude seems confused or lacks context:

1. Ask it to read specific doc: "Please read SESSION_LOG.md"
2. Provide file path: "Check /claude-code/family-todo-app/js/ui.js"
3. Reference commit: "See commit 8b41cec for context"
4. Paste relevant code snippet with line numbers

---

**File Location:**
```
https://github.com/HemanK/ai-demos/blob/claude/session-011CUYNu4WJXSgZk6QcVRZpC/claude-code/family-todo-app/docs/RESUME_PROMPT.md
```

**Last Updated:** October 29, 2025
**Version:** 1.1.0
