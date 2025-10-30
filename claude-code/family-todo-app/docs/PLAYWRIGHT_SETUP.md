# Playwright Testing Setup for Family ToDo App

This document explains how to use Playwright for automated testing and debugging.

## Installation

```bash
# Navigate to project directory
cd /path/to/ai-demos/claude-code/family-todo-app

# Initialize npm if not already done
npm init -y

# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install
```

## Configuration

Create `playwright.config.js`:

```javascript
// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:8000', // or your GitHub Pages URL
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'iPhone Chrome',
      use: {
        ...devices['iPhone 13 Pro'],
        browserName: 'chromium',
      },
    },
    {
      name: 'Mac Chrome',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'iPhone Safari',
      use: {
        ...devices['iPhone 13 Pro'],
        browserName: 'webkit',
      },
    },
  ],
});
```

## Directory Structure

```
family-todo-app/
├── tests/
│   ├── basic.spec.js           # Basic functionality tests
│   ├── natural-language.spec.js # AI parsing tests
│   ├── pagination.spec.js      # Pagination tests
│   └── helpers.js              # Test utilities
├── playwright.config.js
└── package.json
```

---

## Test Examples

### Basic Smoke Test

```javascript
// tests/basic.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Family ToDo App - Basic Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Enable console log capture
    page.on('console', msg => console.log('BROWSER:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err));

    await page.goto('/');
  });

  test('should load app successfully', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Family ToDo');

    // Check for JavaScript errors
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });

  test('should show empty state initially', async ({ page }) => {
    const emptyState = page.locator('.empty-state');
    await expect(emptyState).toBeVisible();
  });

  test('should open add task modal', async ({ page }) => {
    await page.click('text=Add Task');

    const modal = page.locator('.task-modal');
    await expect(modal).toBeVisible();

    // Check that all expected fields are present
    await expect(page.locator('#task-category')).toBeVisible();
    await expect(page.locator('#task-subcategory')).toBeVisible();
    await expect(page.locator('#task-priority')).toBeVisible();
  });
});
```

### Natural Language Parsing Test

```javascript
// tests/natural-language.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Natural Language Parsing', () => {

  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err));
    await page.goto('/');
  });

  test('should parse "Pay bills Friday high priority"', async ({ page }) => {
    await page.click('text=Add Task');

    // Type in quick AI entry
    await page.fill('#quick-ai-entry', 'Pay bills Friday high priority');
    await page.click('text=Parse with AI');

    // Wait for parsing
    await page.waitForTimeout(500);

    // Check if fields are populated
    const title = await page.inputValue('#task-title');
    const category = await page.inputValue('#task-category');
    const priority = await page.inputValue('#task-priority');

    console.log('PARSED:', { title, category, priority });

    expect(title).toContain('bills');
    expect(category).toBe('Bills');
    expect(priority).toBe('High');
  });

  test('should parse numeric date "10/31"', async ({ page }) => {
    await page.click('text=Add Task');

    await page.fill('#quick-ai-entry', 'Doctor appointment 10/31');
    await page.click('text=Parse with AI');

    await page.waitForTimeout(500);

    const dueDate = await page.inputValue('#task-due-date');
    console.log('PARSED DATE:', dueDate);

    // Should contain 10-31 in some format (2025-10-31 or similar)
    expect(dueDate).toMatch(/10.*31/);
  });

  test('should separate priority from urgency', async ({ page }) => {
    await page.click('text=Add Task');

    await page.fill('#quick-ai-entry', 'Task with high priority but not urgent');
    await page.click('text=Parse with AI');

    await page.waitForTimeout(500);

    const priority = await page.inputValue('#task-priority');
    const urgency = await page.inputValue('#task-urgency');

    console.log('PRIORITY/URGENCY:', { priority, urgency });

    expect(priority).toBe('High');
    expect(urgency).not.toBe('High'); // Should be Medium or Low
  });
});
```

### Console Error Capture Test

```javascript
// tests/error-detection.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Error Detection', () => {

  test('should capture any console errors', async ({ page }) => {
    const consoleErrors = [];
    const pageErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push({
        message: err.message,
        stack: err.stack
      });
    });

    await page.goto('/');

    // Interact with the app
    await page.click('text=Add Task');
    await page.fill('#quick-ai-entry', 'Test task');
    await page.click('text=Parse with AI');

    // Wait for any delayed errors
    await page.waitForTimeout(2000);

    // Report all errors
    if (consoleErrors.length > 0) {
      console.log('CONSOLE ERRORS FOUND:');
      consoleErrors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err}`);
      });
    }

    if (pageErrors.length > 0) {
      console.log('PAGE ERRORS FOUND:');
      pageErrors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err.message}`);
        console.log(`     Stack: ${err.stack}`);
      });
    }

    // Assert no errors
    expect(consoleErrors, `Found ${consoleErrors.length} console errors`).toHaveLength(0);
    expect(pageErrors, `Found ${pageErrors.length} page errors`).toHaveLength(0);
  });
});
```

### HTML State Capture (for Claude Code debugging)

```javascript
// tests/state-capture.spec.js
const { test } = require('@playwright/test');
const fs = require('fs');

test.describe('State Capture for Debugging', () => {

  test('capture HTML state when bug occurs', async ({ page }) => {
    await page.goto('/');

    // Reproduce the bug
    await page.click('text=Add Task');
    await page.fill('#quick-ai-entry', 'Test task that causes issue');
    await page.click('text=Parse with AI');

    // Wait for the problematic state
    await page.waitForTimeout(1000);

    // Capture HTML state
    const html = await page.content();
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    fs.writeFileSync(`debug-state-${timestamp}.html`, html);

    // Capture localStorage
    const localStorage = await page.evaluate(() => JSON.stringify(window.localStorage));
    fs.writeFileSync(`debug-localStorage-${timestamp}.json`, localStorage);

    // Capture form values
    const formState = await page.evaluate(() => {
      return {
        title: document.getElementById('task-title')?.value,
        category: document.getElementById('task-category')?.value,
        priority: document.getElementById('task-priority')?.value,
        urgency: document.getElementById('task-urgency')?.value,
        dueDate: document.getElementById('task-due-date')?.value,
      };
    });

    console.log('FORM STATE:', JSON.stringify(formState, null, 2));

    // Capture any error messages in the DOM
    const errorMessages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.error, .status-error'))
        .map(el => el.textContent);
    });

    if (errorMessages.length > 0) {
      console.log('ERROR MESSAGES IN DOM:', errorMessages);
    }
  });
});
```

---

## Usage: Reporting Issues to Claude Code

### **Workflow:**

1. **Write a test that reproduces your issue**
2. **Run the test and capture output**
3. **Share the TEXT output with Claude Code**

### Example Commands:

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/natural-language.spec.js

# Run with detailed output
npx playwright test --reporter=line

# Run and show browser (headed mode)
npx playwright test --headed

# Run specific device configuration
npx playwright test --project="iPhone Chrome"

# Generate test code by recording actions
npx playwright codegen http://localhost:8000
```

### What to Share with Claude Code:

**Good Output:**
```
BROWSER: Parsing text: Pay bills Friday high priority
PARSED: { title: 'Pay bills', category: 'Bills', priority: 'High' }
✓ should parse "Pay bills Friday high priority" (523ms)
```

**Error Output (Even Better!):**
```
PAGE ERROR: TypeError: Cannot read property 'value' of null
     Stack: TypeError: Cannot read property 'value' of null
         at simpleNaturalLanguageParse (app.js:245:18)
         at HTMLButtonElement.<anonymous> (app.js:89:12)

CONSOLE ERRORS FOUND:
  1. Uncaught TypeError: Cannot read property 'value' of null at app.js:245

✗ should parse "Pay bills Friday high priority" (1234ms)
```

**Form State (Very Useful!):**
```
FORM STATE: {
  "title": "",
  "category": "Bills",
  "priority": "",
  "urgency": "Medium",
  "dueDate": "2025-10-31"
}
```

---

## Advanced: Visual Regression Testing

While Claude Code can't see screenshots, you can use them for your own verification:

```javascript
// tests/visual.spec.js
const { test, expect } = require('@playwright/test');

test('visual regression - task list', async ({ page }) => {
  await page.goto('/');

  // Add some test tasks
  // ... (add tasks here)

  // Take screenshot for your own comparison
  await page.screenshot({ path: 'screenshots/task-list.png', fullPage: true });

  // But also capture HTML state for Claude Code
  const html = await page.locator('#task-list').innerHTML();
  console.log('TASK LIST HTML:', html);
});
```

---

## Tips for Effective Bug Reports

### ✅ DO:
- Include console output from Playwright tests
- Share form state / localStorage JSON
- Copy exact error messages and stack traces
- Include the test code that reproduces the issue
- Specify which device configuration (iPhone Chrome, Mac Chrome, etc.)

### ❌ DON'T:
- Only say "it doesn't work" without test output
- Share only screenshots (Claude Code can't see them)
- Skip running the error detection tests

---

## Example Bug Report to Claude Code:

```
I have an issue with natural language parsing. Here's the Playwright test output:

Test: should parse "Pay bills Friday high priority"
Device: iPhone Chrome

Console output:
  BROWSER: Parsing text: Pay bills Friday high priority
  PAGE ERROR: TypeError: Cannot read property 'trim' of undefined
      at simpleNaturalLanguageParse (app.js:245:18)

Form state after parse attempt:
{
  "title": "",
  "category": "",
  "priority": "",
  "urgency": "Medium",
  "dueDate": "2025-11-01"
}

Expected: All fields should be populated
Actual: All fields are empty, error in console

The error happens at app.js:245 - looks like something is undefined when trying to call .trim()
```

**This is PERFECT for Claude Code to debug!**

---

## Next Steps

1. Should I create the Playwright setup files for you?
2. Would you like me to write specific tests for the issues you found?
3. Or do you want to describe your issues first, and I'll create tests that reproduce them?

Let me know what works best!
