---
name: frontend-patterns
description: Frontend patterns for Rails applications using Slim templates, Stimulus JavaScript framework, CSS with Optics utilities. Use when building views, adding interactivity, styling components, or when the user mentions Slim, Stimulus, JavaScript, CSS, or frontend development.
---

# Frontend Patterns

Build Rails frontend using Slim templates, Simple Form, Stimulus controllers, and Optics CSS.

**Tech Stack:** Slim (HTML) • Simple Form (forms) • Stimulus (JavaScript) • Optics (CSS)

See [references/EXAMPLES.md](references/EXAMPLES.md) for detailed code examples.

## Slim Templates

### Core Conventions
- Use Ruby 3+ syntax ( e.g. keyword arguments with `:`)
- Keep view logic minimal - extract to helpers/partials
- Always add policy checks around actions (e.g. edit/delete links)
- **Never use inline styles**
- **Extract repeated markup into partials (DRY principle)**
- Always use locals with keyword arguments: `render 'partial', user:, active: true`

### Helpers vs Partials

**Use Helpers for:**
- Single elements with conditional text/classes
- Data formatting (dates, currency)
- Stateless logic
- Example: `status_badge(status)`

**Use Partials for:**
- Multi-element structures
- Reusable UI components
- Collection rendering
- Example: `_form.html.slim`, `_user_card.html.slim`

**Rule:** Single element = helper. Structure/layout = partial.

### Partial Organization
```
app/views/
  resource_name/
    index.html.slim           # Main views
    _form.html.slim           # Forms (shared by new/edit)
    _resource_name.html.slim  # Individual item
  shared/
    _status_badge.html.slim   # Cross-feature components
```

### Common Patterns
```slim
-# Conditional classes
.card class=class_names('card--active': active, 'card--urgent': urgent)

-# Partial with locals
= render 'user_card', user:, show_actions: true

-# Collection rendering
= render partial: 'item', collection: @items

-# Conditional rendering
- if policy(@resource).update?
  = link_to 'Edit', edit_path(@resource)
```

## Simple Form

**Always use Simple Form.** Never use `form_with` or `form_for`.

### Basic Forms

**Model form:**
```slim
= simple_form_for @user do |f|
  = f.input :name
  = f.input :email, required: true
  
  .form__actions
    = link_to 'Cancel', :back, class: 'btn btn--outline'
    = f.submit 'Save', class: 'btn btn--primary'
```

**Non-model form (search, filters, bulk actions):**
```slim
= simple_form_for :search, url: search_path, method: :get do |f|
  = f.input :query
  = f.submit 'Search', class: 'btn btn--primary'
```

**Important:** `:symbol` forms nest params: `params.dig(:search, :query)`

### Common Input Types

| Type | Example |
|------|---------|
| Text | `= f.input :name` |
| Textarea | `= f.input :description, as: :text, input_html: { rows: 4 }` |
| Association | `= f.association :project, collection: @projects, prompt: 'Select...'` |
| Select | `= f.input :type, collection: @project_types, prompt: 'Select...'` |
| Boolean | `= f.input :active, as: :boolean` |
| Date | `= f.input :start_date, as: :date` |
| Hidden | `= f.hidden_field :organization_id, value: current_user.organization_id` |

### Input Options
- `placeholder:` - Placeholder text
- `label:` - Custom label
- `hint:` - Help text below input
- `required: true` - Mark as required
- `disabled: true` - Disable input
- `input_html: {}` - HTML attributes for input element
- `wrapper_html: {}` - HTML attributes for wrapper div

### Collections
```slim
/ Basic collection
= f.input :category_id, collection: @categories

/ Custom label/value methods
= f.input :project_id, 
  collection: @projects,
  label_method: :name,
  value_method: :id,
  prompt: 'Select project...'
```

### Special Form Patterns

**Bulk action form:**
```slim
= simple_form_for :bulk_action, url: bulk_path, method: :post, html: { id: 'bulk-form' } do |f|
  = f.button 'Approve Selected', class: 'btn btn--primary'

-# Checkboxes reference form
= check_box_tag 'entry_ids[]', entry.id, false, form: 'bulk-form'
```

**Modal form with external submit:**
```slim
= simple_form_for @record, html: { id: 'modal-form' }, data: { turbo_frame: '_top' } do |f|
  = f.input :reason, as: :text, input_html: { rows: 3, required: true }

-# In modal footer
= button_tag 'Submit', type: 'submit', form: 'modal-form', class: 'btn btn--primary'
```

### Form Options
- `html: {}` - HTML attributes for form element
- `data: {}` - Data attributes (e.g., Turbo, Stimulus)
- `url:` - Form submission URL (required for `:symbol` forms)
- `method:` - HTTP method (`:get`, `:post`, `:patch`, `:delete`)

See [references/EXAMPLES.md](references/EXAMPLES.md) for complex form examples.

## Stimulus Controllers

JavaScript interactions using Stimulus framework.

### Controller Structure
```javascript
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["output", "input"]
  static values = { url: String, delay: Number }
  static classes = ["hidden", "active"]

  connect() {
    // Initialization when controller connects to DOM
  }

  disconnect() {
    // Cleanup when controller disconnects
  }

  action(event) {
    // Action methods called from HTML
  }
}
```

### Usage in Slim
```slim
.component data-controller="example" data-example-url-value="/api/endpoint"
  input data-example-target="input" data-action="input->example#search"
  .results data-example-target="output"
```

### Best Practices
- One controller per behavior (focused, composable)
- Use data attributes for configuration
- Name controllers in kebab-case in HTML
- Keep controllers simple and testable
- Clean up in `disconnect()` (timers, listeners)

See [references/EXAMPLES.md](references/EXAMPLES.md) for complete controller examples.

## CSS & Optics

### Guidelines
- **Use Optics utility classes** for spacing, typography, colors, layout
- Keep custom CSS minimal and component-scoped
- Follow BEM naming for custom components: `.block__element--modifier`
- **Never use inline styles**
- Use `class_names` helper for conditional classes

### Common Patterns
```slim
/ Layout with Optics utilities
.container.mt-4.mb-6
  .grid.grid--2-col.gap-4
    .card.p-4
      h2.text-lg.font-bold Title
      p.text-gray-600 Description

/ Custom component with BEM
.time-entry.time-entry--running
  .time-entry__header
    h3.time-entry__title = entry.description
  .time-entry__body
    span.time-entry__duration = entry.duration
```

### Conditional Classes
```slim
/ Using class_names helper
.card class=class_names(
  'card--active': @record.active?,
  'card--featured': @record.featured?
)
```

## Quick Reference

**Form actions pattern:**
```slim
.form__actions
  = link_to 'Cancel', :back, class: 'btn btn--outline'
  = f.submit 'Save', class: 'btn btn--primary'
```

**Empty state:**
```slim
- if @items.empty?
  = render 'shared/empty_state', title: 'No items', message: 'Create your first item.'
```

**Authorization check:**
```slim
- if policy(@resource).update?
  = link_to 'Edit', edit_path(@resource), class: 'btn'
```

**Turbo confirmation:**
```slim
= button_to 'Delete', path, method: :delete, data: { turbo_confirm: 'Are you sure?' }
```
