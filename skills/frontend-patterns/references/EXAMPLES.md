# Frontend Patterns - Detailed Examples

## Slim Template Examples

### Basic Partial with Locals
```slim
-# app/views/users/_user_card.html.slim
-# locals: (user:, active: false, show_actions: true)

.user-card class=class_names('user-card--active': active)
  .user-card__header
    h3.user-card__name = user.name
    = render 'shared/status_badge', status: user.status if user.status

  .user-card__body
    p.user-card__email = user.email
    p.user-card__role = user.role.titleize

  - if show_actions
    .user-card__actions
      = link_to 'Edit', edit_user_path(user), class: 'btn btn--sm btn--outline'
      = button_to 'Delete', user_path(user), method: :delete, class: 'btn btn--sm btn--danger', 
        data: { turbo_confirm: 'Are you sure?' }
```

### Collection Rendering with Empty State
```slim
-# app/views/time_entries/index.html.slim

.time-entries
  h1.page-title Time Entries

  - if @time_entries.any?
    .time-entries__list
      = render partial: 'time_entry', collection: @time_entries
  - else
    = render 'shared/empty_state', 
      title: 'No time entries yet', 
      message: 'Start tracking your time by creating your first entry.',
      action: { text: 'New Entry', path: new_time_entry_path }
```

### Complex Form Example
```slim
-# app/views/projects/_form.html.slim

= simple_form_for @project, html: { class: 'project-form' } do |f|
  .form__section
    h2.form__section-title Basic Information
    
    = f.input :name, 
      placeholder: 'Project name',
      input_html: { autofocus: true }
    
    = f.input :client_id, 
      collection: @clients,
      label_method: :name,
      value_method: :id,
      prompt: 'Select a client...',
      include_blank: false
    
    = f.input :status,
      collection: Project.statuses.keys,
      label_method: ->(status) { status.titleize },
      include_blank: false

  .form__section
    h2.form__section-title Details
    
    = f.input :description,
      as: :text,
      input_html: { 
        rows: 4,
        placeholder: 'Describe this project...',
        data: { controller: 'auto-save', auto_save_url_value: auto_save_project_path(@project) }
      }
    
    = f.input :start_date,
      as: :date,
      html5: true
    
    = f.input :end_date,
      as: :date,
      html5: true,
      hint: 'Optional'

  .form__section
    h2.form__section-title Settings
    
    = f.input :billable,
      as: :boolean,
      wrapper_html: { class: 'form__checkbox' }
    
    = f.input :hourly_rate,
      as: :decimal,
      input_html: { 
        step: 0.01,
        min: 0,
        placeholder: '0.00'
      },
      wrapper_html: { class: 'form__field--narrow' }

  .form__actions
    = link_to 'Cancel', :back, class: 'btn btn--outline'
    = f.submit 'Save Project', class: 'btn btn--primary', data: { disable_with: 'Saving...' }
```

### Conditional Rendering Patterns
```slim
-# Show/hide based on authorization
- if policy(@project).update?
  = link_to 'Edit', edit_project_path(@project), class: 'btn btn--primary'

-# Show/hide based on state
- if @time_entry.running?
  = button_to 'Stop', stop_time_entry_path(@time_entry), class: 'btn btn--danger'
- else
  = button_to 'Start', start_time_entry_path(@time_entry), class: 'btn btn--primary'

-# Conditional classes
.time-entry class=class_names(
  'time-entry--running': @time_entry.running?,
  'time-entry--billable': @time_entry.billable?,
  'time-entry--approved': @time_entry.approved?
)
  / ... content
```

## Simple Form Examples

### Search/Filter Form (Non-Model)
```slim
-# app/views/time_entries/_filters.html.slim

= simple_form_for :filters, url: time_entries_path, method: :get, html: { class: 'filters-form' } do |f|
  .filters-form__fields
    = f.input :project_id,
      collection: @projects,
      prompt: 'All projects',
      include_blank: 'All projects',
      label: false,
      input_html: { data: { controller: 'auto-submit' } }
    
    = f.input :date_from,
      as: :date,
      html5: true,
      label: 'From',
      wrapper_html: { class: 'form__field--inline' }
    
    = f.input :date_to,
      as: :date,
      html5: true,
      label: 'To',
      wrapper_html: { class: 'form__field--inline' }
    
    = f.input :status,
      collection: ['pending', 'approved', 'rejected'],
      prompt: 'All statuses',
      include_blank: 'All statuses',
      label: false

  .filters-form__actions
    = link_to 'Clear', time_entries_path, class: 'btn btn--sm btn--text'
    = f.submit 'Filter', class: 'btn btn--sm btn--primary'
```

### Bulk Action Form
```slim
-# app/views/time_entries/index.html.slim

= simple_form_for :bulk_action, 
  url: bulk_approve_time_entries_path, 
  method: :post, 
  html: { id: 'bulk-action-form' },
  data: { turbo_frame: '_top' } do |f|
  
  .bulk-actions
    = f.button 'Approve Selected', 
      class: 'btn btn--sm btn--primary',
      data: { disable_with: 'Processing...' }

table.time-entries-table
  thead
    tr
      th
        = check_box_tag 'select_all', 
          '1', 
          false,
          data: { controller: 'bulk-select', action: 'bulk-select#toggleAll' }
      th Description
      th Duration
      th Date
  
  tbody
    - @time_entries.each do |entry|
      tr
        td
          = check_box_tag 'entry_ids[]', 
            entry.id, 
            false,
            form: 'bulk-action-form',
            data: { bulk_select_target: 'checkbox' }
        td = entry.description
        td = entry.duration_formatted
        td = entry.date
```

### Modal Form with External Submit
```slim
-# app/views/time_entries/_reject_modal.html.slim

.modal data-controller="modal"
  .modal__dialog
    .modal__header
      h2.modal__title Reject Time Entry
      button.modal__close type="button" data-action="modal#close" ×

    .modal__body
      = simple_form_for @time_entry,
        url: reject_time_entry_path(@time_entry),
        method: :post,
        html: { id: 'reject-form' },
        data: { turbo_frame: '_top' } do |f|
        
        = f.input :rejection_reason,
          as: :text,
          input_html: { 
            rows: 3,
            required: true,
            placeholder: 'Please provide a reason for rejection...'
          },
          label: 'Reason'

    .modal__footer
      = button_tag 'Cancel', 
        type: 'button',
        class: 'btn btn--outline',
        data: { action: 'modal#close' }
      
      = button_tag 'Reject Entry',
        type: 'submit',
        form: 'reject-form',
        class: 'btn btn--danger',
        data: { disable_with: 'Rejecting...' }
```

### Nested Attributes Form
```slim
-# app/views/invoices/_form.html.slim

= simple_form_for @invoice do |f|
  = f.input :client_id, collection: @clients
  = f.input :due_date, as: :date

  .invoice-lines
    h3 Line Items
    
    .invoice-lines__list data-controller="nested-fields"
      = f.simple_fields_for :line_items do |line_form|
        .invoice-line data-nested_fields_target="item"
          = line_form.input :description, wrapper_html: { class: 'form__field--inline' }
          = line_form.input :quantity, wrapper_html: { class: 'form__field--narrow' }
          = line_form.input :rate, wrapper_html: { class: 'form__field--narrow' }
          = line_form.input :_destroy, as: :hidden
          
          = button_tag 'Remove',
            type: 'button',
            class: 'btn btn--sm btn--danger',
            data: { action: 'nested-fields#remove' }
      
      = button_tag 'Add Line Item',
        type: 'button',
        class: 'btn btn--sm btn--outline',
        data: { action: 'nested-fields#add' }

  .form__actions
    = link_to 'Cancel', :back, class: 'btn btn--outline'
    = f.submit 'Save Invoice', class: 'btn btn--primary'
```

## Stimulus Controller Examples

### Auto-Submit Controller
```javascript
// app/javascript/controllers/auto_submit_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    delay: { type: Number, default: 300 }
  }

  connect() {
    this.timeout = null
  }

  submit() {
    clearTimeout(this.timeout)
    
    this.timeout = setTimeout(() => {
      this.element.requestSubmit()
    }, this.delayValue)
  }

  disconnect() {
    clearTimeout(this.timeout)
  }
}
```

Usage:
```slim
= simple_form_for :search, url: search_path, method: :get,
  html: { data: { controller: 'auto-submit' } } do |f|
  
  = f.input :query,
    input_html: { data: { action: 'input->auto-submit#submit' } }
```

### Bulk Select Controller
```javascript
// app/javascript/controllers/bulk_select_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["checkbox", "selectAll"]

  toggleAll(event) {
    const checked = event.target.checked
    this.checkboxTargets.forEach(checkbox => {
      checkbox.checked = checked
    })
  }

  updateSelectAll() {
    if (!this.hasSelectAllTarget) return
    
    const allChecked = this.checkboxTargets.every(cb => cb.checked)
    const someChecked = this.checkboxTargets.some(cb => cb.checked)
    
    this.selectAllTarget.checked = allChecked
    this.selectAllTarget.indeterminate = someChecked && !allChecked
  }
}
```

Usage:
```slim
.bulk-select data-controller="bulk-select"
  = check_box_tag 'select_all', '1', false,
    data: { 
      bulk_select_target: 'selectAll',
      action: 'bulk-select#toggleAll'
    }
  
  - @items.each do |item|
    = check_box_tag 'item_ids[]', item.id, false,
      data: { 
        bulk_select_target: 'checkbox',
        action: 'change->bulk-select#updateSelectAll'
      }
```

### Toggle Controller
```javascript
// app/javascript/controllers/toggle_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content"]
  static classes = ["hidden"]

  toggle() {
    this.contentTargets.forEach(content => {
      content.classList.toggle(this.hiddenClass)
    })
  }

  show() {
    this.contentTargets.forEach(content => {
      content.classList.remove(this.hiddenClass)
    })
  }

  hide() {
    this.contentTargets.forEach(content => {
      content.classList.add(this.hiddenClass)
    })
  }
}
```

Usage:
```slim
.expandable data-controller="toggle" data-toggle-hidden-class="hidden"
  button.expandable__trigger data-action="toggle#toggle" Toggle Details
  
  .expandable__content.hidden data-toggle-target="content"
    p Additional details here...
```

## Layout Patterns

### Page Header with Actions
```slim
-# app/views/projects/show.html.slim

.page-header
  .page-header__content
    h1.page-title = @project.name
    p.page-subtitle = @project.client.name
  
  .page-header__actions
    - if policy(@project).update?
      = link_to 'Edit', edit_project_path(@project), class: 'btn btn--outline'
    - if policy(@project).destroy?
      = button_to 'Delete', project_path(@project), 
        method: :delete,
        class: 'btn btn--danger',
        data: { turbo_confirm: 'Are you sure?' }
```

### Tabbed Navigation
```slim
-# app/views/projects/show.html.slim

nav.tabs
  = link_to 'Overview', project_path(@project), 
    class: class_names('tabs__tab', 'tabs__tab--active': current_page?(project_path(@project)))
  
  = link_to 'Time Entries', project_time_entries_path(@project),
    class: class_names('tabs__tab', 'tabs__tab--active': current_page?(project_time_entries_path(@project)))
  
  = link_to 'Team', project_team_path(@project),
    class: class_names('tabs__tab', 'tabs__tab--active': current_page?(project_team_path(@project)))
  
  = link_to 'Settings', edit_project_path(@project),
    class: class_names('tabs__tab', 'tabs__tab--active': current_page?(edit_project_path(@project)))
```

### Card Grid Layout
```slim
-# app/views/projects/index.html.slim

.projects
  .projects__header
    h1.page-title Projects
    = link_to 'New Project', new_project_path, class: 'btn btn--primary'

  .card-grid
    - @projects.each do |project|
      = render 'project_card', project: project
```

```slim
-# app/views/projects/_project_card.html.slim
-# locals: (project:)

.card
  .card__header
    h3.card__title = link_to project.name, project_path(project)
    = render 'shared/status_badge', status: project.status
  
  .card__body
    p.card__client = project.client.name
    p.card__date = "Created #{time_ago_in_words(project.created_at)} ago"
  
  .card__footer
    .card__stats
      span.stat
        strong = project.time_entries_count
        |  entries
      span.stat
        strong = number_to_currency(project.total_revenue)
        |  revenue
```
