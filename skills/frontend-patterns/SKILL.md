---
name: frontend-patterns
description: RoleModel's conventions for Rails views — Slim templates, Simple Form for every form, partials with keyword locals, policy checks around actions, BEM classes over utility classes, and small single-purpose Stimulus controllers. Use when writing or reviewing Slim templates, partials, helpers, forms, or Stimulus controllers in a Rails app, or when the user mentions Slim, Simple Form, or view code.
metadata:
  triggers: "slim, slim template, partial, view helper, simple form, simple_form_for, form, stimulus, frontend, rails view"
---

# Frontend Patterns

These are the RoleModel defaults for the view layer. Where a project's views or `docs/conventions/` disagree, follow the project. CSS rules live in `optics-context` and `bem-structure`; dynamic forms in `dynamic-forms`.

## Slim

- **Partials take keyword locals:** `= render 'widget_card', widget:, compact: true`. No instance variables inside partials.
- **Helper or partial?** A single element with conditional text or classes (`status_badge(order)`) is a helper. Anything with structure is a partial.
- **Wrap every action link in a policy check:** `- if policy(widget).update?` before `= link_to 'Edit', edit_widget_path(widget)`.
- **No inline styles**, and no utility classes where a BEM element or modifier fits. Use `class_names` for conditional modifiers:

```slim
.widget-card class=class_names('widget-card--archived': widget.archived?)
  .widget-card__header
    h3.widget-card__title = widget.name
```

## Forms

**Always Simple Form.** Never `form_with` or `form_for`.

```slim
= simple_form_for @widget do |f|
  = f.input :name
  = f.association :category, prompt: 'Select a category'
  = f.input :notes, as: :text, input_html: { rows: 4 }

  .form__actions
    = link_to 'Cancel', widgets_path, class: 'btn'
    = f.submit 'Save', class: 'btn btn--primary'
```

- **Non-model forms** (search, filters, bulk actions) use a symbol: `simple_form_for :search, url: widgets_path, method: :get`. Params arrive nested: `params.dig(:search, :query)`.
- **Buttons or checkboxes outside the form** point at it with the `form` attribute: give the form `html: { id: 'bulk-form' }` and the checkbox `form: 'bulk-form'`. This is how bulk-select tables and modal footers submit.
- **Destructive buttons confirm:** `button_to 'Delete', widget, method: :delete, data: { turbo_confirm: 'Delete this widget?' }`.
- **Forms that change as they are filled in** use the `turbo_form` gem. See `dynamic-forms`.

## Stimulus

- One behavior per controller, configured through values, targets, and classes rather than hard-coded selectors.
- Remove anything added in `connect()` (listeners, timers, observers) in `disconnect()`. Turbo connects and disconnects controllers on every visit.
- Reach for a Rails or Turbo built-in first (`data-turbo-confirm`, `data-turbo-submits-with`, Turbo Frames) before writing a controller.

## Gotchas

- **A symbol form's params are nested** under the symbol. Reading `params[:query]` instead of `params.dig(:search, :query)` silently returns `nil`.
- **`link_to ... method: :delete` does nothing under Turbo** without `data-turbo-method`. Use `button_to` for anything that isn't a GET.
- **A form inside a Turbo Frame** replaces only that frame on submit. Add `data: { turbo_frame: '_top' }` when the response should replace the page.
