## Design Playbook

Use this playbook when the user is asking about the visual design, styling, or UI appearance of a specific part of the app. The primary trigger is a **screenshot** — the user pastes or attaches an image of the app and wants to know where it lives in the codebase and which files control its appearance.

There are two modes:

- **Screenshot locator** — the user provided a screenshot (or described a visible UI element precisely enough to locate it); identify where it is in the app and return links to the relevant view and stylesheet files
- **Design language overview** — the user asked a general question about the app's look and feel without referencing a specific screen (e.g. "what fonts and colors does the app use", "describe the design language")

---

### Step 1: Identify the mode

If the user attached or described a screenshot, or named a visible UI element, page section, or feature → **Screenshot locator**

If the user asked about "design language", "style guide", "fonts and colors", or something similarly general → **Design language overview**

---

### Screenshot locator

#### Step 2: Read the screenshot

Look at what is visible in the image. Note:

- Page-level landmarks: sidebar/nav items, page title, breadcrumbs, tab bar
- Key components: cards, tables, forms, modals, badges, buttons
- Any text that reveals the route or resource name
- URL bar if visible

#### Step 3: Map to the app's routing conventions

Use what you observed to infer the controller and action. Common patterns:

- Sidebar nav item highlighted → likely the index action for that resource
- A form → likely `new` or `edit`
- A detail view → likely `show`
- A modal or partial overlay → look for a matching partial in the views directory

Read `TERMINOLOGY.md` from the project root (if it exists) to resolve any ambiguous terms to model/controller names.

#### Step 4: Locate the view files

1. Search the `app/views/` directory for templates matching the inferred controller and action. Check for:
   - The action template (e.g. `index.html.slim`, `show.html.erb`)
   - Any partials rendered by that template
   - Shared partials in `app/views/shared/` or `app/views/layouts/`

2. If a sidebar or nav is visible, check `app/views/layouts/` and `app/views/shared/` for the nav partial.

3. Note all file paths found.

#### Step 5: Locate the stylesheet files

For each view and partial identified:

1. Check `app/assets/stylesheets/` for a CSS or SCSS file matching the component or view name.
2. Check for any design system override directories that may apply.
3. Check for base layout or utility stylesheets that govern the overall page structure visible in the screenshot.
4. Note any design system utility classes used in the templates — these are styled by the design system, not local stylesheets.

#### Output by depth

**Pamphlet** — One sentence naming the page/feature and the primary template file. No lists, no headings.

**Novella** — The structured format below. No prose narrative, just the labelled sections:

> **Identified location:** one sentence describing where this screen is in the app (e.g. "This is the Partners index page, rendered by `PartnersController#index`.")
>
> **View files:**
> - `app/views/partners/index.html.slim` — primary template
> - `app/views/shared/_sidebar.html.slim` — left navigation
> - *(list all relevant partials)*
>
> **Stylesheet files:**
> - `app/assets/stylesheets/components/_card.scss` — card layout and styles
> - `app/assets/stylesheets/core/layout.scss` — page-level structure
> - *(list only files that are genuinely relevant to what's visible)*
>
> **Design system classes in use:** *(if any — one line listing class names seen in the templates that come from the design system rather than local stylesheets)*

**Novel** — Everything in the Novella format, plus:
- The controller and action responsible for rendering this screen, with a file reference (`app/controllers/foo_controller.rb:line`)
- All partials rendered by the primary template, each with a brief description of what it contributes
- Any Stimulus controllers attached to elements visible in the screenshot, with the JS file path
- A "where to make changes" note: which file to edit for layout changes vs. styling changes vs. behaviour changes

If the screenshot cannot be matched with confidence, say so and ask the user for more context (e.g. the page title, URL, or a description of what they were doing).

---

### Design language overview

When the user wants a general description of the app's visual design rather than a specific screen:

1. Search `app/assets/stylesheets/` for theme or token files that define brand colors, typography, and spacing.
2. Look for any design system token definitions available in the project (e.g. a `tokens.json` or similar).
3. Check for component override stylesheets that show where the app diverges from a base design system.

**Pamphlet** — One plain paragraph covering the typeface(s) and the two or three most prominent brand colors. No file references, no token names.

**Novella** — Prose covering the full color palette (primary, neutrals, brand colors, alert states), typography choices (font families and their roles), spacing feel, and the visual personality of the app (e.g. flat vs shadowed, sharp vs rounded). Name the source files at the end in a single line but don't enumerate every token.

**Novel** — Everything in the Novella, plus:
- Font families listed with their CSS variable names and Google Fonts source
- Complete color palette with HSL values and CSS variable names for each color role (primary, neutral, brand colors, alert states)
- An explanation of the color scale system (`color-scale.scss`) and how light/dark mode overrides work
- Chart and time-breakdown colors listed separately, since they fall outside the semantic scale
- File references for every theme file involved: `almanac-theme-core.scss`, `almanac-theme-light.scss`, `almanac-theme-dark.scss`, `color-scale.scss`

---

### Agent-triggered mode

If the input began with `depth:`, skip all of the above and return this structured block:

```
WHAT: one-sentence description of what is visible
WHERE: key view and stylesheet paths
HOW: CSS classes and token values that define its appearance
CONNECTS TO: related components or design patterns
```
