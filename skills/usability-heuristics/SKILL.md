---
name: usability-heuristics
description: Audit UI implementations against Nielsen's 10 Usability Heuristics for User Interface Design. Produces a structured issue log with severity ratings, heuristic mappings, and remediation guidance. Use when conducting heuristic evaluations, reviewing UI code for usability compliance, or auditing existing interfaces.
metadata:
  triggers:
    - heuristic evaluation
    - usability audit
    - nielsen heuristics
    - ui audit
    - usability review
    - heuristic review
    - ux compliance
    - usability issues
---

## Overview

This skill applies **Nielsen's 10 Usability Heuristics** to review and audit user interface code. It serves two purposes:

1. **Audit mode**: Systematically evaluate existing UI code against all 10 heuristics and produce a structured issue log with severity ratings, evidence, and remediation guidance.
2. **Guidance mode**: Apply heuristics proactively when building new features to prevent usability problems before they ship.

This skill focuses on **evaluation methodology and structured reporting**. Where a heuristic overlaps with a Law of UX, this skill cross-references the relevant law rather than duplicating guidance. Use both skills together for comprehensive coverage:

- **`usability-heuristics`** (this skill) = audit methodology + structured issue log
- **`laws-of-ux`** = theoretical grounding + detailed UX principles

When reviewing code, start with the Audit Checklist to identify which heuristics are most relevant, then refer to the detailed sections for guidance and examples. Always produce findings in the Issue Log Format below.

Keywords: heuristic evaluation, usability audit, nielsen heuristics, ui audit, usability review, heuristic review, ux compliance, usability issues

---

## Issue Log Format

When conducting a heuristic evaluation, produce all findings in this structured format.

### Summary Table

Begin every audit with a severity summary:

```markdown
## Heuristic Evaluation Summary

| Severity | Count |
|----------|-------|
| Critical | X     |
| Major    | X     |
| Minor    | X     |
| Advisory | X     |
| **Total** | **X** |
```

### Severity Definitions

- **Critical**: Users cannot complete core tasks. Examples: no error recovery on form submission, no way to undo a destructive action, system provides zero feedback on async operations.
- **Major**: Users experience significant friction or confusion. Examples: no loading feedback on async operations, inconsistent navigation patterns across pages, error messages show raw technical jargon.
- **Minor**: Users are inconvenienced but can work around the issue. Examples: missing placeholder text, suboptimal tab order, no tooltip on an icon-only button.
- **Advisory**: Improvement opportunity that would enhance the experience but does not impede task completion. Examples: could add keyboard shortcuts for power users, could add empty state guidance, could improve confirmation message copy.

### Finding Format

Each finding follows this structure:

```markdown
### [H#] Heuristic Name — Finding Title

- **Severity**: Critical | Major | Minor | Advisory
- **Heuristic**: #N — Heuristic Name
- **Location**: `file_path:line_range` or component/view name
- **Description**: What the issue is and why it matters for usability.
- **Evidence**:
  ```html
  <!-- Code snippet showing the violation -->
  ```
- **Recommendation**:
  ```html
  <!-- Code snippet showing the fix -->
  ```
- **Cross-reference**: `laws-of-ux`: Law Name (if applicable)
```

### Audit Completion

End every audit with:

```markdown
## Recommendations Priority

1. **Fix immediately** (Critical): List critical findings by ID
2. **Fix soon** (Major): List major findings by ID
3. **Plan for next iteration** (Minor): List minor findings by ID
4. **Consider for enhancement** (Advisory): List advisory findings by ID
```

---

## Audit Checklist

Use this table for quick scanning. Each check maps to a heuristic and tells you what to look for in code.

| Check | Heuristic | What to Look For |
|-------|-----------|------------------|
| Loading/progress feedback on all async actions | H1: Visibility of System Status | Spinners, skeleton screens, `disabled` states, `aria-busy`, `aria-live` regions, `data-disable-with` |
| System uses plain language, not developer jargon | H2: Match Between System and Real World | Error messages, labels, help text — check for HTTP codes, model names, technical terms |
| Undo/back/cancel available for destructive or multi-step actions | H3: User Control and Freedom | Cancel buttons, undo patterns, `data-turbo-confirm`, modal close (X + Escape), back links |
| UI elements are consistent in style and behavior | H4: Consistency and Standards | Button classes, form layouts, terminology, nav patterns, design token usage |
| Dangerous actions require confirmation; inputs constrain invalid values | H5: Error Prevention | `data-turbo-confirm`, `disabled` states, input `type`/`required`/`min`/`max`/`pattern` |
| Labels, icons, and affordances are always visible | H6: Recognition Rather than Recall | Visible labels, breadcrumbs, persistent nav, icon+text combos, autocomplete |
| Shortcuts and accelerators exist for experienced users | H7: Flexibility and Efficiency of Use | Keyboard shortcuts, `accesskey`, search, bulk actions, customizable views |
| UI shows only essential information | H8: Aesthetic and Minimalist Design | Content density, competing CTAs, decorative vs functional elements, disclosure toggles |
| Error messages explain what happened and suggest a fix | H9: Help Users Recover from Errors | Flash messages, inline validation, error summaries, field-level error placement |
| Contextual help is available where needed | H10: Help and Documentation | Tooltips, `aria-describedby`, help text, empty state guidance, `<details>` elements |

---

## The 10 Usability Heuristics

### H1: Visibility of System Status

**Definition**: The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time.

**Key Takeaway**: Every user action should produce visible feedback. Async operations need loading states. State changes need visual confirmation. Users should never wonder "did that work?"

**What to look for in code:**
- Form submit buttons: check for `data-disable-with` or Stimulus controllers that show loading state
- Async data loading: look for skeleton screens, spinners, or `aria-busy="true"`
- Live regions: check for `aria-live="polite"` or `aria-live="assertive"` for dynamic content updates
- State changes: verify toast notifications, flash messages, or inline confirmation after actions
- Turbo Frames: check for loading indicators during frame replacement
- File uploads: look for progress bars or percentage indicators

**Examples:**

GOOD
```html
<form data-controller="form-submit" data-action="submit->form-submit#disable">
  <button type="submit" class="btn btn--primary"
          data-disable-with="Saving..."
          data-form-submit-target="button">
    Save Changes
  </button>
</form>

<div aria-live="polite" class="notification-area">
  <!-- Status messages appear here after actions -->
</div>
```

BAD
```html
<form>
  <button type="submit" class="btn btn--primary">Save Changes</button>
  <!-- No loading state, no disabled state, no confirmation -->
  <!-- User clicks and nothing visibly happens until page reload -->
</form>
```
No feedback on submission — user may click multiple times, causing duplicate submissions.

**Review flags:**
- Flag form submit buttons without loading/disabled states
- Flag async operations (fetch, Turbo Frame loads) without visible loading indicators
- Flag state changes (add, delete, update) without confirmation feedback
- Flag pages with no `aria-live` region for dynamic status updates
- Flag file upload inputs without progress indication

**Cross-references:** `laws-of-ux`: Doherty Threshold (response within 400ms), Goal-Gradient Effect (progress visualization)

---

### H2: Match Between System and the Real World

**Definition**: The design should speak the users' language. Use words, phrases, and concepts familiar to the user, rather than internal jargon. Follow real-world conventions, making information appear in a natural and logical order.

**Key Takeaway**: Labels, error messages, and instructions should use plain language the user understands. Information should be ordered logically from the user's perspective, not the system's.

**What to look for in code:**
- Error messages: check for HTTP status codes, model/attribute names, stack traces, or database terms
- Form labels: check for database column names used as labels (e.g., `created_at` instead of "Date created")
- Navigation ordering: verify it follows user task flow, not database schema order
- Icons: check that icons use universally understood metaphors
- Date/time formats: verify they match user locale expectations

**Examples:**

GOOD
```html
<div class="alert alert--error" role="alert">
  <p>We couldn't save your changes. Please check the highlighted fields below.</p>
</div>

<label for="start_date">Start date</label>
<input type="date" id="start_date" name="project[start_date]">
```

BAD
```html
<div class="alert alert--error" role="alert">
  <p>422 Unprocessable Entity: Validation failed: start_date can't be blank,
     end_date must be after start_date</p>
</div>

<label for="project_created_at">project_created_at</label>
<input type="text" id="project_created_at" name="project[created_at]">
```
Raw technical error message and database column name as label — users should never see system internals.

**Review flags:**
- Flag error messages containing HTTP status codes, model names, or attribute names
- Flag form labels that match database column names verbatim (snake_case, abbreviations)
- Flag icon-only actions with no text or tooltip using domain-specific metaphors
- Flag content ordered by system logic (alphabetical by field name) rather than user task flow
- Flag date/number formats that don't match user locale

**Cross-references:** `laws-of-ux`: Jakob's Law (users expect conventions from familiar interfaces)

---

### H3: User Control and Freedom

**Definition**: Users often perform actions by mistake. They need a clearly marked "emergency exit" to leave the unwanted action without having to go through an extended process.

**Key Takeaway**: Every destructive or commitment action should have an escape route. Users should be able to undo, cancel, go back, or dismiss at any point without penalty.

**What to look for in code:**
- Destructive actions (delete, remove, archive): check for confirmation dialogs (`data-turbo-confirm`)
- Multi-step forms/wizards: check for back buttons and the ability to return to previous steps
- Modals/dialogs: check for close button (X), Escape key handler, and backdrop click to dismiss
- Bulk operations: check for undo capability or confirmation before execution
- Navigation: check for cancel/back links on form pages and edit views
- Filters/search: check for clear/reset functionality

**Examples:**

GOOD
```html
<!-- Delete with confirmation -->
<a href="/projects/5" data-turbo-method="delete"
   data-turbo-confirm="Delete this project? This cannot be undone."
   class="btn btn--danger">
  Delete Project
</a>

<!-- Modal with multiple exit paths -->
<dialog class="modal" data-controller="modal"
        data-action="keydown.esc->modal#close click->modal#closeOnBackdrop">
  <button class="modal__close" data-action="click->modal#close" aria-label="Close">
    &times;
  </button>
  <div class="modal__body">
    <!-- content -->
  </div>
  <div class="modal__footer">
    <button class="btn btn--outline" data-action="click->modal#close">Cancel</button>
    <button class="btn btn--primary">Confirm</button>
  </div>
</dialog>
```

BAD
```html
<!-- Delete with no confirmation -->
<a href="/projects/5" data-turbo-method="delete" class="btn btn--danger">
  Delete
</a>

<!-- Modal with no close button and no escape handler -->
<div class="modal">
  <div class="modal__body">
    <p>Are you sure?</p>
    <button class="btn btn--primary">Yes, continue</button>
    <!-- No cancel button, no X, no escape key, no backdrop click -->
  </div>
</div>
```
Destructive action with no confirmation. Modal traps the user with only a forward path.

**Review flags:**
- Flag delete/remove/archive actions without confirmation dialogs
- Flag modals without a close button, Escape key handler, or cancel option
- Flag multi-step flows without back/previous buttons
- Flag form pages without a cancel link that returns to the previous view
- Flag bulk operations without undo or confirmation
- Flag filter/search UIs without a clear/reset option

**Cross-references:** `laws-of-ux`: Peak-End Rule (error recovery is a critical "peak" moment in the experience)

---

### H4: Consistency and Standards

**Definition**: Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform and industry conventions.

**Key Takeaway**: Maintain both internal consistency (same patterns throughout your app) and external consistency (follow platform conventions). Same function = same appearance and behavior everywhere.

**What to look for in code:**
- Button styling: check that the same action type uses the same CSS classes across all views
- Terminology: check that the same operation uses the same label everywhere (not "Save" here and "Submit" there)
- Form layouts: check for consistent label placement (above vs beside), field ordering, and validation patterns
- Navigation patterns: check for consistent menu structure, link styling, and icon usage across pages
- Design tokens: check for consistent use of tokens vs hard-coded values (see `optics-context` skill)
- Component structure: check for consistent BEM naming and HTML structure (see `bem-structure` skill)

**Examples:**

GOOD
```html
<!-- Consistent button patterns across all views -->
<!-- In projects/show -->
<div class="actions">
  <a href="/projects/5/edit" class="btn btn--primary">Edit</a>
  <a href="/projects" class="btn btn--outline">Back</a>
</div>

<!-- In tasks/show — same pattern -->
<div class="actions">
  <a href="/tasks/12/edit" class="btn btn--primary">Edit</a>
  <a href="/tasks" class="btn btn--outline">Back</a>
</div>
```

BAD
```html
<!-- In projects/show -->
<div class="actions">
  <a href="/projects/5/edit" class="btn btn--primary">Edit</a>
  <a href="/projects" class="btn btn--outline">Back</a>
</div>

<!-- In tasks/show — inconsistent -->
<div class="task-buttons">
  <button class="btn btn--secondary" onclick="location='/tasks/12/edit'">Modify</button>
  <a href="/tasks" class="link">Return to list</a>
</div>
```
Same conceptual actions ("edit" and "go back") use different labels, different HTML elements, different CSS classes, and different interaction patterns.

**Review flags:**
- Flag the same action using different labels across views ("Save" vs "Submit" vs "Update" vs "Confirm")
- Flag the same element type using different CSS classes or HTML structures across views
- Flag mixed use of design tokens and hard-coded values for the same property
- Flag navigation patterns that differ between sections of the app
- Flag custom implementations of standard platform controls (custom select, custom date picker) without matching native behavior

**Cross-references:** `laws-of-ux`: Jakob's Law (follow platform conventions), Law of Similarity (consistent styling signals relatedness), Aesthetic-Usability Effect (visual consistency increases perceived quality). Also see `optics-context` for design token consistency and `bem-structure` for CSS naming consistency.

---

### H5: Error Prevention

**Definition**: Good error messages are important, but the best designs carefully prevent problems from occurring in the first place. Either eliminate error-prone conditions, or check for them and present users with a confirmation option before they commit to the action.

**Key Takeaway**: Constrain inputs to valid values. Confirm before destructive actions. Use appropriate input types. The system should make it hard to do the wrong thing.

**What to look for in code:**
- Input types: check that fields use appropriate `type` attributes (`email`, `tel`, `url`, `number`, `date`)
- Constraints: check for `required`, `min`, `max`, `minlength`, `maxlength`, `pattern`, `step` attributes
- Destructive actions: check for confirmation dialogs before irreversible operations
- Inline validation: check for real-time validation feedback before form submission
- Disabled states: check that submit buttons are disabled until required fields are complete
- Default values: check for sensible defaults that reduce the chance of error

**Examples:**

GOOD
```html
<form data-controller="form-validation">
  <label for="email">Email address</label>
  <input type="email" id="email" name="user[email]" required
         aria-describedby="email-hint"
         data-action="blur->form-validation#validate">
  <span id="email-hint" class="hint">We'll send a confirmation to this address.</span>
  <span class="field-error" data-form-validation-target="error" hidden></span>

  <label for="age">Age</label>
  <input type="number" id="age" name="user[age]" min="13" max="120" required>

  <label for="start_date">Start date</label>
  <input type="date" id="start_date" name="project[start_date]"
         min="2024-01-01" max="2030-12-31">
</form>
```

BAD
```html
<form>
  <label for="email">Email</label>
  <input type="text" id="email" name="user[email]">
  <!-- type="text" allows any value; no required, no validation -->

  <label for="age">Age</label>
  <input type="text" id="age" name="user[age]">
  <!-- Accepts letters, negative numbers, anything -->

  <label for="start_date">Start date (YYYY-MM-DD)</label>
  <input type="text" id="start_date" name="project[start_date]">
  <!-- User must type the date in exact format with no picker -->
</form>
```
All fields use `type="text"` with no constraints — every input error will only be caught on server-side submission.

**Review flags:**
- Flag `type="text"` on fields that should use `email`, `tel`, `url`, `number`, or `date`
- Flag missing `required` attribute on fields that must be filled
- Flag numeric fields without `min`/`max` constraints
- Flag forms with no client-side validation (all validation deferred to server)
- Flag destructive actions (delete, publish, send) without confirmation
- Flag missing sensible default values where reasonable defaults exist

**Cross-references:** `laws-of-ux`: Tesler's Law (system absorbs complexity from the user), Postel's Law (accept flexible input formats)

---

### H6: Recognition Rather than Recall

**Definition**: Minimize the user's memory load by making elements, actions, and options visible. The user should not have to remember information from one part of the interface to another. Information required to use the design should be visible or easily retrievable.

**Key Takeaway**: Show, don't make them remember. Labels should be visible (not just placeholders). Navigation should persist. Previously entered information should be displayed in context.

**What to look for in code:**
- Labels vs placeholders: check that form fields have visible `<label>` elements, not just `placeholder` text
- Breadcrumbs: check for breadcrumb navigation in deep hierarchies
- Persistent navigation: check that main nav is always accessible, not hidden behind a hamburger on desktop
- Icon labels: check that icon-only buttons have visible text labels or at minimum `aria-label` and tooltip
- Autocomplete: check for typeahead/autocomplete on search and selection fields
- Context: check that edit forms display the current value, not empty fields

**Examples:**

GOOD
```html
<!-- Visible labels alongside placeholders -->
<div class="form__group">
  <label for="search" class="form__label">Search projects</label>
  <input type="search" id="search" placeholder="e.g., Marketing website"
         list="recent-searches" autocomplete="on">
  <datalist id="recent-searches">
    <option value="Marketing website">
    <option value="Q4 Report">
  </datalist>
</div>

<!-- Icon button with visible text -->
<button class="btn btn--icon-text">
  <svg aria-hidden="true"><!-- pencil icon --></svg>
  <span>Edit</span>
</button>

<!-- Breadcrumbs for deep navigation -->
<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li><a href="/projects">Projects</a></li>
    <li><a href="/projects/5">Marketing</a></li>
    <li aria-current="page">Settings</li>
  </ol>
</nav>
```

BAD
```html
<!-- Placeholder as the only label -->
<input type="text" placeholder="Search...">
<!-- Label disappears on focus — user forgets what field is for -->

<!-- Icon-only buttons with no labels -->
<div class="toolbar">
  <button><svg><!-- icon --></svg></button>
  <button><svg><!-- icon --></svg></button>
  <button><svg><!-- icon --></svg></button>
  <button><svg><!-- icon --></svg></button>
</div>
<!-- User must hover each icon to discover its purpose -->
```
Placeholder-only labels disappear when the field has focus. Icon-only toolbar forces recall of icon meanings.

**Review flags:**
- Flag form fields with `placeholder` but no visible `<label>` element
- Flag icon-only buttons without `aria-label`, `title`, or visible text
- Flag deep page hierarchies without breadcrumb navigation
- Flag main navigation hidden behind hamburger menu on desktop viewports
- Flag edit forms that display empty fields instead of pre-filled current values
- Flag dropdown/select fields where the user must remember codes or IDs

**Cross-references:** `laws-of-ux`: Miller's Law (working memory limits), Serial Position Effect (placement of key discoverable items)

---

### H7: Flexibility and Efficiency of Use

**Definition**: Shortcuts -- hidden from novice users -- may speed up the interaction for the expert user so that the design can cater to both inexperienced and experienced users. Allow users to tailor frequent actions.

**Key Takeaway**: Provide accelerators for power users without complicating the interface for beginners. Support keyboard navigation, bulk operations, and customization.

**What to look for in code:**
- Keyboard shortcuts: check for `accesskey` attributes, custom keyboard event handlers, or shortcut hint UI
- Bulk operations: check for "Select all" and batch action patterns on list views
- Search: check for a global or contextual search feature
- Tab navigation: check that all interactive elements are reachable via Tab key
- Skip links: check for "Skip to content" links for keyboard and screen reader users
- Customization: check for sortable columns, configurable views, or saved filters

**Examples:**

GOOD
```html
<!-- Skip link for keyboard users -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- List with bulk operations -->
<div class="list-controls">
  <label class="checkbox">
    <input type="checkbox" data-action="change->bulk-select#toggleAll">
    Select all
  </label>
  <div class="bulk-actions" data-bulk-select-target="actions" hidden>
    <button class="btn btn--outline" data-action="click->bulk-select#archive">
      Archive selected
    </button>
    <button class="btn btn--danger" data-action="click->bulk-select#delete">
      Delete selected
    </button>
  </div>
</div>

<!-- Keyboard shortcut hint -->
<button class="btn btn--primary" title="New project (N)">
  New Project
  <kbd class="shortcut-hint">N</kbd>
</button>
```

BAD
```html
<!-- No skip link -->
<!-- No bulk operations — each item must be managed individually -->
<ul class="project-list">
  <li>Project A <a href="/projects/1/edit">Edit</a> <a href="/projects/1" data-method="delete">Delete</a></li>
  <li>Project B <a href="/projects/2/edit">Edit</a> <a href="/projects/2" data-method="delete">Delete</a></li>
  <!-- 50 more items, each requiring individual action -->
</ul>
```
No bulk operations, no keyboard shortcuts, no skip link — inefficient for power users managing many items.

**Review flags:**
- Flag list views with no bulk selection or batch actions
- Flag applications with no keyboard shortcuts for frequent actions
- Flag pages missing "Skip to content" link
- Flag interactive elements not reachable via Tab key
- Flag search-heavy workflows without a search input
- Flag data tables without sortable columns or saved filter options

**Cross-references:** `laws-of-ux`: Pareto Principle (prioritize the 20% of actions used 80% of the time)

---

### H8: Aesthetic and Minimalist Design

**Definition**: Interfaces should not contain information that is irrelevant or rarely needed. Every extra unit of information in an interface competes with the relevant units of information and diminishes their relative visibility.

**Key Takeaway**: Show only what matters for the current task. Move secondary information behind progressive disclosure. Reduce visual noise so that primary actions and content stand out.

**What to look for in code:**
- Content density: check how much information is visible above the fold
- Competing CTAs: count the number of equally prominent action buttons per view
- Progressive disclosure: look for `<details>`/`<summary>`, expand/collapse patterns, or "Show more" links
- Decorative elements: check for elements that add visual weight but no functional value
- Whitespace: check that spacing tokens create breathing room between sections
- Tables: check column count — can any columns be hidden behind an expand or detail view?

**Examples:**

GOOD
```html
<div class="settings-section">
  <h3>Notifications</h3>
  <label class="toggle">
    <input type="checkbox" name="email_notifications" checked>
    Email notifications
  </label>
  <label class="toggle">
    <input type="checkbox" name="push_notifications">
    Push notifications
  </label>

  <details class="settings-advanced">
    <summary>Advanced notification settings</summary>
    <div class="settings-advanced__body">
      <!-- Frequency, quiet hours, per-channel settings -->
    </div>
  </details>
</div>
```

BAD
```html
<div class="settings-page">
  <h3>Notifications</h3>
  <label><input type="checkbox" checked> Email notifications</label>
  <label><input type="checkbox"> Push notifications</label>
  <label><input type="checkbox"> SMS notifications</label>
  <label><input type="checkbox"> Slack notifications</label>
  <label><input type="checkbox"> Weekly digest</label>
  <label><input type="checkbox"> Daily summary</label>

  <h4>Email frequency</h4>
  <select><option>Immediate</option><option>Hourly</option><option>Daily</option></select>

  <h4>Quiet hours</h4>
  <input type="time" name="quiet_start"> to <input type="time" name="quiet_end">

  <h4>Per-channel overrides</h4>
  <!-- 15 more fields for each notification channel -->
</div>
```
All settings dumped on one page with no hierarchy or progressive disclosure. Advanced options compete with basic ones for attention.

**Review flags:**
- Flag views with more than 2-3 equally prominent CTAs
- Flag settings or configuration pages without progressive disclosure for advanced options
- Flag dashboards where all widgets have equal visual weight
- Flag decorative images, illustrations, or icons that serve no functional purpose
- Flag data tables with more than 6-7 columns visible simultaneously
- Flag verbose body copy in action-oriented contexts (forms, dialogs, toolbars)

**Cross-references:** `laws-of-ux`: Occam's Razor (simplest solution), Law of Prägnanz (visual simplicity), Hick's Law (fewer choices speed decisions). Also see `optics-context` for minimal, token-based styling.

---

### H9: Help Users Recognize, Diagnose, and Recover from Errors

**Definition**: Error messages should be expressed in plain language (no error codes), precisely indicate the problem, and constructively suggest a solution.

**Key Takeaway**: When errors happen, tell the user what went wrong in human terms, highlight where the problem is, and offer a clear path to fix it. Never show raw system errors.

**What to look for in code:**
- Flash/toast messages: check that error content is specific and actionable, not generic ("Something went wrong")
- Form validation: check for inline errors next to the field, not just a summary at the top
- Error summary: check that form error summaries link to the offending fields
- HTTP error pages (404, 500): check for helpful content with navigation options
- Field highlighting: check for visual indicators (red border, icon) on fields with errors
- Focus management: check that focus moves to the first error on form submission failure

**Examples:**

GOOD
```html
<!-- Error summary with links to fields -->
<div class="error-summary" role="alert" tabindex="-1">
  <h3>There were 2 problems with your submission:</h3>
  <ul>
    <li><a href="#user_email">Email address is not valid</a></li>
    <li><a href="#user_password">Password must be at least 8 characters</a></li>
  </ul>
</div>

<!-- Inline field error -->
<div class="form__group form__group--error">
  <label for="user_email">Email address</label>
  <input type="email" id="user_email" class="input--error"
         aria-describedby="email-error" aria-invalid="true">
  <span id="email-error" class="field-error" role="alert">
    Please enter a valid email address, e.g., name@example.com
  </span>
</div>
```

BAD
```html
<!-- Generic error with no specifics -->
<div class="alert alert--error">
  <p>There were errors.</p>
</div>

<!-- No inline errors, no field highlighting -->
<div class="form__group">
  <label for="user_email">Email</label>
  <input type="text" id="user_email">
  <!-- User must guess which field has the error and what's wrong -->
</div>
```
Generic error banner with no indication of which fields are wrong or how to fix them.

**Review flags:**
- Flag generic error messages ("Error", "Something went wrong", "Invalid input") with no specifics
- Flag form errors displayed only as a top-of-page summary without inline field errors
- Flag error states without `aria-invalid="true"` and `aria-describedby` linking to the error message
- Flag error messages that don't suggest how to fix the problem
- Flag 404/500 error pages without navigation options or search
- Flag forms where focus does not move to the error summary or first error field on submission failure

**Cross-references:** `laws-of-ux`: Peak-End Rule (error recovery is a "peak" moment that shapes overall experience), Postel's Law (accepting flexible input reduces errors in the first place)

---

### H10: Help and Documentation

**Definition**: It's best if the system doesn't need any additional explanation. However, it may be necessary to provide documentation to help users understand how to complete their tasks. Any such information should be easy to search, focused on the user's task, list concrete steps to be carried out, and not be too large.

**Key Takeaway**: Provide contextual help where users need it — tooltips on complex fields, empty state guidance, onboarding hints. Help should be task-focused and appear in context, not require navigating to a separate page.

**What to look for in code:**
- Tooltips: check for `title`, `aria-describedby`, or Stimulus tooltip controllers on complex fields
- Empty states: check that empty lists/tables provide guidance on what to do next
- Onboarding: check for first-run hints, setup checklists, or guided tours
- Help text: check for `<span class="hint">` or similar elements below complex form fields
- Inline documentation: check for `<details>`/`<summary>` for expandable help content
- Links to docs: check for contextual "Learn more" links near complex features

**Examples:**

GOOD
```html
<!-- Empty state with guidance -->
<div class="empty-state">
  <svg class="empty-state__icon" aria-hidden="true"><!-- illustration --></svg>
  <h3>No projects yet</h3>
  <p>Projects help you organize your work and track progress with your team.</p>
  <a href="/projects/new" class="btn btn--primary">Create your first project</a>
  <a href="/help/projects" class="link">Learn more about projects</a>
</div>

<!-- Form field with contextual help -->
<div class="form__group">
  <label for="api_key">API Key</label>
  <input type="text" id="api_key" aria-describedby="api-key-help">
  <span id="api-key-help" class="hint">
    Find your API key in your
    <a href="/account/integrations" target="_blank">integration settings</a>.
  </span>
</div>
```

BAD
```html
<!-- Empty state with no guidance -->
<div class="empty-state">
  <p>No projects.</p>
</div>

<!-- Complex field with no help -->
<div class="form__group">
  <label for="cron">Schedule (cron expression)</label>
  <input type="text" id="cron" name="schedule[cron]" placeholder="* * * * *">
  <!-- No explanation of cron syntax, no link to docs, no examples -->
</div>
```
Empty state provides no guidance on what projects are or how to create one. Complex field requires specialized knowledge with no help.

**Review flags:**
- Flag empty states that say only "No items" or "No results" without guidance or a CTA
- Flag complex or technical form fields without help text or tooltip
- Flag features with no onboarding or first-run explanation
- Flag lack of `aria-describedby` on fields that have associated help text
- Flag help content that requires navigating away from the current task context
- Flag documentation-heavy fields (like cron, regex, API config) without examples or links

**Cross-references:** `laws-of-ux`: Zeigarnik Effect (motivate completion of setup and onboarding tasks)

---

## Cross-Cutting Concerns

Several heuristics reinforce each other. When auditing, group related findings rather than reporting the same issue under multiple heuristics.

### Feedback Loop: H1 + H9 + H3

These three heuristics form a complete feedback cycle:
- **H1 (Visibility)**: The system shows what is happening
- **H9 (Error Recovery)**: When something goes wrong, the system explains it clearly
- **H3 (User Control)**: The user can escape, undo, or retry

When auditing a form or workflow, check all three together. A form that lacks loading feedback (H1), shows generic errors (H9), and has no cancel button (H3) has a compounding usability problem — report it as a cluster.

### Consistency Cluster: H4 + H6 + H8

These three heuristics support each other:
- **H4 (Consistency)**: Same patterns everywhere
- **H6 (Recognition)**: Consistent patterns are recognizable
- **H8 (Minimalism)**: Consistency reduces visual noise

Inconsistent UIs force recall (violating H6) and add visual complexity (violating H8). When you find inconsistency, check whether it also causes recognition or minimalism problems.

### Prevention and Recovery: H5 + H9

These are two sides of error handling:
- **H5 (Prevention)**: Stop errors before they happen
- **H9 (Recovery)**: Help users fix errors that do happen

When auditing error handling, check both. A form that neither prevents invalid input (H5) nor explains errors clearly (H9) has a compounding problem.

### Language and Help: H2 + H10

These heuristics both address communication:
- **H2 (Real World Match)**: Use the user's language
- **H10 (Help and Documentation)**: Provide guidance where needed

If the system uses jargon (H2 violation), the need for documentation increases (H10). When fixing H2 issues, check whether H10 coverage is also needed.

---

## Companion Skills

- **`laws-of-ux`**: Use for detailed UX law guidance when a heuristic finding maps to a specific law. The heuristic evaluation provides the audit methodology; `laws-of-ux` provides the theoretical grounding and additional code-level examples.
- **`bem-structure`**: Use for CSS class naming conventions when implementing fixes for heuristic violations, especially H4 (Consistency) and H8 (Minimalism).
- **`optics-context`**: Use for design token usage when implementing visual fixes, especially for H4 (Consistency — token vs hard-coded values), H8 (Minimalism — clean styling), and H1 (Visibility — color and spacing for feedback states).
