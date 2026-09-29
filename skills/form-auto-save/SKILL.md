---
name: form-auto-save
description: Automatic form submission after user input changes using a debounce mechanism to prevent excessive server requests. Creates a seamless auto-save experience for forms with rich text editors or multiple fields.
---

# Form Auto Save Skill

## Overview
The Form Auto Save pattern provides automatic form submission after user input changes, using a debounce mechanism to prevent excessive server requests. This creates a seamless "auto-save" experience for users editing forms.

## When to Use
- Long-form editing interfaces where users expect automatic saving
- Forms with rich text editors or multiple fields
- Edit pages where users might navigate away and expect changes to persist
- Forms that benefit from progressive saving without explicit "Save" button clicks

## Implementation

### 1. Stimulus Controller
The pattern uses a Stimulus controller (`form-auto-save`) that handles the auto-save logic.

**Controller Location:** `app/javascript/controllers/form_auto_save_controller.js`

**Key Features:**
- Debounce time of 8 seconds (configurable via `static DEBOUNCE_TIME`)
- Listens to both `change` and `lexxy:change` events (for custom components)
- Uses passive event listeners for better performance
- Provides `cancel()` and `submit()` methods for programmatic control
- Counts successful saves in `countValue`, which system specs wait on

**Controller Code Pattern:**
```javascript
import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static DEBOUNCE_TIME = 8000
  static values = { count: Number }

  connect() {
    this.element.addEventListener('change', this.#debounceSubmit.bind(this), { passive: true })
    this.element.addEventListener('lexxy:change', this.#debounceSubmit.bind(this), { passive: true })
    this.element.addEventListener('turbo:submit-end', ({ detail }) => { if (detail.success) this.countValue++ })
  }

  cancel() {
    clearTimeout(this.debounceTimer)
  }

  submit() {
    this.element.requestSubmit()
  }

  #debounceSubmit() {
    this.#debounce(this.submit.bind(this))
  }

  #debounce(callback) {
    clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(callback, this.constructor.DEBOUNCE_TIME)
  }
}
```

### 2. View Integration
Attach the controller to the form element using Stimulus data attributes.

**Required Attributes:**
- `data: { controller: 'form-auto-save' }` - Attaches the Stimulus controller
- `data: { turbo_permanent: true }` - Optional but recommended to preserve form state during Turbo navigation

**Example (Slim):**
```slim
= simple_form_for resource, html: { data: { controller: 'form-auto-save', turbo_permanent: true } } do |f|
  = f.input :field_name
  = f.rich_text_area :content
```

## Important Considerations

### Debounce Time
- Default: 8 seconds (8000ms)
- Adjust via `static DEBOUNCE_TIME` in the controller if needed
- Consider user experience: too short = excessive requests, too long = lost changes

### Event Listeners
- Listens to `change` events (standard HTML input changes)
- Listens to `lexxy:change` events (custom component events, like rich text editors)
- Uses passive listeners for better scroll performance

### Turbo Permanent
- `turbo_permanent: true` keeps the form element across Turbo navigation
- Prevents loss of unsaved changes when user navigates
- Critical for forms with auto-save to maintain debounce timers

### Form Validation
- Ensure backend validation handles partial saves gracefully
- Consider whether all fields should be required or allow partial completion
- Provide clear error feedback if auto-save fails

## Testing

Wait on the controller's `countValue`, not on sleep timers. It goes up when Turbo reports a successful submission, so it covers the debounce and the round trip. `turbo_permanent: true` keeps the form, and its count, when the response redirects.

### Auto Save Helper
**File:** `spec/support/helpers/form_auto_save_helper.rb`
```ruby
module FormAutoSaveHelper
  def expect_auto_save
    form = find("[data-controller~='form-auto-save']")
    count = form['data-form-auto-save-count-value'].to_i
    yield
    expect(page).to have_css("[data-form-auto-save-count-value='#{count + 1}']", wait: 10)
  end
end
```

Include it for system specs in `spec/support/helpers.rb` with `c.include FormAutoSaveHelper, type: :system`. The `wait:` must be longer than `DEBOUNCE_TIME`.

### System Spec Example
```ruby
require 'rails_helper'

RSpec.describe 'Form Auto Save', :js do
  it 'automatically saves form after changes' do
    resource = create(:resource)
    visit edit_resource_path(resource)

    expect_auto_save do
      fill_in 'Field name', with: 'Updated value'
    end

    expect(resource.reload.field_name).to eq('Updated value')
  end

  it 'debounces multiple rapid changes' do
    resource = create(:resource)
    visit edit_resource_path(resource)

    expect_auto_save do
      fill_in 'Field name', with: 'First'
      fill_in 'Field name', with: 'Second'
      fill_in 'Field name', with: 'Final'
    end

    # Should only save once with final value
    expect(resource.reload.field_name).to eq('Final')
  end
end
```

## Common Issues

### Issue: Form doesn't auto-save
**Check:**
- Controller properly attached: `data: { controller: 'form-auto-save' }`
- Form fields trigger `change` events (text inputs may need blur)
- Network requests in browser DevTools

### Issue: Too many requests
**Solutions:**
- Increase `DEBOUNCE_TIME`
- Check for unnecessary event triggers
- Verify debounce logic is working

### Issue: Lost changes on navigation
**Solutions:**
- Add `turbo_permanent: true` to form
- Ensure form has stable `id` attribute
- Consider adding "unsaved changes" warning

## Related Patterns
- **Dynamic Forms:** Fields that change as the form is filled in belong to the `dynamic-forms` skill (the turbo_form gem)
- **Stimulus Values:** If you need per-instance debounce times
- **Form Validation:** Consider inline validation with auto-save

## References
- Stimulus Controller API: https://stimulus.hotwired.dev/
- Turbo Permanent: https://turbo.hotwired.dev/handbook/building#persisting-elements-across-page-loads
