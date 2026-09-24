---
name: turbo-fetch
description: Implement dynamic form updates using Turbo Streams and Stimulus. Use when forms need to update fields based on user selections without full page reloads, such as cascading dropdowns, conditional fields, or dynamic option lists.
---

# Turbo Fetch Skill

This skill documents the turbo fetch pattern for dynamically updating form fields based on user input using Turbo Streams and Stimulus.

## When to Use

Use turbo fetch when you need to:
- Update form options based on another field's selection
- Show/hide conditional fields dynamically
- Refresh parts of a form without reloading the entire page
- Implement cascading dropdowns or dependent fields

## Pattern Overview

The turbo fetch pattern consists of four components:

1. **Routes** - A routing concern that adds the turbo_fetch endpoint
2. **Controller Action** - A backend action that prepares data and renders turbo streams
3. **Stimulus Controller** - Frontend controller that triggers PATCH requests
4. **Turbo Stream View** - Template that updates specific DOM elements

## Implementation Steps

### 1. Add Routing Concern (if not already present)

In `config/routes.rb`, ensure the turbo_fetch concern exists:

```ruby
concern :turbo_fetch do
  patch :turbo_fetch, on: :collection
end
```

Then apply it to your resource:

```ruby
resources :materials, concerns: %i[turbo_fetch]
```

This creates a route: `PATCH /materials/turbo_fetch`

### 2. Implement Controller Action

Add a `turbo_fetch` action to your controller:

```ruby
class MaterialsController < ApplicationController
  def turbo_fetch
    @material = authorize Material.new(material_params)
    # The view will handle the turbo stream responses
  end

  private

  def material_params
    params.require(:material).permit(:type, :substance, ...)
  end
end
```

**Key points:**
- Creates a new instance with submitted params (doesn't save to database)
- Runs authorization if needed
- The instance will be used in the turbo stream view to determine updated options

### 3. Create Turbo Stream View

Create `app/views/[resource]/turbo_fetch.turbo_stream.slim`:

```slim
= simple_form_for @material do |f|
  = turbo_stream.update 'substance-field' do
    = f.input :substance, collection: @material.substances
  = turbo_stream.replace 'material_details', partial: dimension_fields_partial_path, locals: { f: }
```

**Available turbo stream actions:**
- `turbo_stream.update` - Replace the content inside an element
- `turbo_stream.replace` - Replace the entire element
- `turbo_stream.append` - Add content at the end
- `turbo_stream.prepend` - Add content at the beginning
- `turbo_stream.remove` - Remove an element

### 4. Setup Form with Stimulus Controller

Add the Stimulus controller to your form:

```slim
= simple_form_for resource, data: { controller: 'turbo-form', turbo_form_url_value: turbo_fetch_materials_url } do |f|
  .form-row
    = f.input :type, input_html: { data: { action: "turbo-form#perform" } }

  #substance-field.flexible
    = f.input :substance, collection: f.object.substances

  #material_details
    = render dimension_fields_partial_path, f: f
```

**Key attributes:**
- `data-controller="turbo-form"` - Activates the Stimulus controller
- `data-turbo-form-url-value` - The URL to PATCH. There is no default; set it here or per trigger.
- `data-action="turbo-form#perform"` - Triggers the fetch on field change
- Optional per-trigger params: `data-turbo-form-url-param` overrides the URL, and `data-turbo-form-query-param` (a JSON object) appends extra keys to the submitted form data

### 5. Verify Stimulus Controller Exists

The controller is installed by the rolemodel_rails generator. Don't hand-write it. Look for `app/javascript/controllers/turbo_form_controller.js`, registered as `turbo-form`. If it's missing, run `bin/rails g rolemodel:turbo:form`.

Older apps may have the same controller saved as `turbo_fetch_controller.js` and registered as `turbo-fetch`. Use whichever identifier the app's `app/javascript/controllers/index.js` registers.

### 6. System Specs

The generator also installs `spec/support/helpers/turbo_form_helper.rb`. It waits for the request to complete by watching the controller's `count` value. If `spec/support/helpers.rb` doesn't already have `c.include TurboFormHelper, type: :system`, add it.

```ruby
expect_turbo_form_request do
  select 'Steel', from: 'Type'
end
expect(page).to have_select('Substance', with_options: ['A36'])
```

## Examples from Codebase

### Materials Example

**Route:**
```ruby
resources :materials, concerns: %i[duplication turbo_fetch]
```

**Controller:**
```ruby
def turbo_fetch
  @material = authorize Material.new(material_params)
end
```

**View (`turbo_fetch.turbo_stream.slim`):**
```slim
= simple_form_for @material do |f|
  = turbo_stream.update 'substance-field' do
    = f.input :substance, collection: @material.substances, as: :tom_select, allow_create: true
  = turbo_stream.replace 'material_details', partial: dimension_fields_partial_path, locals: { f: }
```

**Form:**
```slim
= simple_form_for resource, data: { controller: 'turbo-form', turbo_form_url_value: turbo_fetch_materials_url } do |f|
  = f.input :type, input_html: { data: { action: "turbo-form#perform" } }

  #substance-field.flexible
    = f.input :substance, collection: f.object.substances

  #material_details
    = render dimension_fields_partial_path, f: f
```

## Common Patterns

### Pattern 1: Dependent Dropdown
When selecting a type, update available options in another field:
- Trigger field has `data-action="turbo-form#perform"`
- Target field has unique ID (e.g., `#substance-field`)
- Turbo stream updates the target with new collection

### Pattern 2: Conditional Field Sections
Show/hide entire form sections based on selection:
- Use `turbo_stream.replace` to swap out entire sections
- Render different partials based on the selected value

### Pattern 3: Member vs Collection Routes
Most turbo_fetch routes are on `:collection`, but for nested resources with IDs:

```ruby
resources :custom_parts, concerns: %i[turbo_fetch] do
  patch :turbo_fetch, on: :member # For child items with IDs
end
```

## Tips

1. **Target IDs**: Ensure target elements have unique, stable IDs
2. **Form Context**: The turbo stream view wraps form builder in `simple_form_for` to maintain form context
3. **Authorization**: Apply same authorization as create/update actions
4. **Don't Save**: The turbo_fetch action creates instances but never saves them
5. **Multiple Updates**: You can include multiple turbo_stream updates in one response

## Troubleshooting

**Updates not appearing:**
- Check that target element ID matches the turbo_stream selector
- Verify the Stimulus action is firing (check browser console)
- Ensure turbo_fetch route exists (run `rails routes | grep turbo_fetch`)

**Wrong data in fields:**
- Verify params are being permitted in `material_params` (or equivalent)
- Check that the model's computed properties return correct values

**Authorization errors:**
- Ensure `turbo_fetch` action runs same authorization as `new`/`create`
