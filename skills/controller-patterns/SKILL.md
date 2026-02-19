---
name: controller-patterns
description: Review and update existing Rails controllers and generate new controllers following professional patterns and best practices. Covers RESTful conventions, authorization patterns, proper error handling, and maintainable code organization.
---

# Rails Controller Patterns

## Quick Reference

### When to Use This Skill

- Generating new Rails controllers
- Reviewing existing controllers for best practices
- Implementing RESTful actions (index, show, new, create, edit, update, destroy)
- Adding authorization with Pundit
- Handling nested resources
- Implementing state transitions (submissions, approvals, activations)
- Bulk operations on resources

### Core Patterns at a Glance

**Standard CRUD Controller:**

```ruby
class ResourcesController < ApplicationController
  before_action :set_resource, only: %i[show edit update destroy]

  def index
    @resources = policy_scope(Resource)
  end

  def show; end

  def new
    @resource = authorize Resource.new
  end

  def create
    @resource = authorize Resource.new(resource_params)
    @resource.save ? redirect_to(@resource, notice: 'Successfully Created Resource') : render('new', status: :unprocessable_content)
  end

  def edit; end

  def update
    @resource.update(resource_params) ? redirect_to(@resource, notice: 'Successfully Updated Resource') : render('edit', status: :unprocessable_content)
  end

  def destroy
    @resource.destroy
    redirect_to resources_url, notice: 'Successfully Deleted Resource'
  end

  private

  def set_resource
    @resource = authorize Resource.find(params[:id])
  end

  def resource_params
    params.expect(resource: %i[attr1 attr2])
  end
end
```

**Namespaced State Controller:**

```ruby
class Resources::StatesController < ApplicationController
  before_action :set_resource
  before_action :ensure_valid_state, only: :create

  def create
    @resource.activate!
    redirect_to resources_path, notice: 'Resource activated.'
  end

  def destroy
    @resource.deactivate!
    redirect_to resources_path, notice: 'Resource deactivated.'
  end

  private

  def set_resource
    @resource = current_user.resources.find(params[:resource_id])
  end

  def ensure_valid_state
    redirect_to(resources_path, alert: 'Invalid state') unless @resource.can_activate?
  end
end
```

## Decision Tree

```
Need to add controller functionality?
│
├─ Standard CRUD operations (list, view, create, edit, delete)?
│  └─ Use: Standard RESTful Controller Pattern
│
├─ State transitions (submit, approve, activate, publish)?
│  └─ Use: Namespaced State Controller (create/destroy actions)
│
├─ Bulk operations (bulk submit, bulk delete)?
│  └─ Use: Namespaced Bulk Controller (create action only)
│
├─ Nested under parent resource?
│  └─ Use: Nested RESTful Controller Pattern
│
└─ Complex authorization rules?
   └─ Add: Policy scopes and explicit authorization checks
```

## Essential Patterns

### 1. Authorization (Pundit)

**Pattern:** Authorize all resource interactions using `authorize` or `policy_scope`.

```ruby
# Collections - use policy_scope
def index
  @products = policy_scope(Product)
end

# New instances - authorize the class
def new
  @product = authorize Product.new
end

# Existing instances - authorize in set method
def set_product
  @product = authorize Product.find(params[:id])
end
```

**Rules:**

- `policy_scope()` for collections (index)
- `authorize ClassName.new()` for new records (new, create)
- `authorize` in `set_*` methods for existing records
- Never skip authorization on resource operations

### 2. Before Actions

**Pattern:** Extract common setup logic with explicit action scoping.

```ruby
# Resource loading (most common)
before_action :set_product, only: %i[show edit update destroy]

# Parent resource loading (nested)
before_action :set_company
before_action :set_employee, only: %i[show edit update destroy]

# State validation
before_action :ensure_pending, only: :create
before_action :ensure_stopped, only: :create
```

**Rules:**

- Always use `only:` or `except:`
- Name descriptively: `set_[resource]`, `ensure_[state]`, `require_[permission]`
- Order matters - execute in declaration order
- Keep methods focused on single responsibility

**State Validation Example:**

```ruby
def ensure_pending
  return if @resource.pending?
  redirect_to resources_path, alert: 'Must be pending.'
end
```

### 3. RESTful Action Patterns

**Index - List all resources:**

```ruby
def index
  @resources = policy_scope(Resource)
end
```

**Show - Display one resource:**

```ruby
def show
  # Resource set via before_action
  # Load scoped associations if needed
  @related = policy_scope(@resource.related_items)
end
```

**New - Form for new resource:**

```ruby
def new
  @resource = authorize Resource.new
end
```

**Create - Save new resource:**

```ruby
def create
  @resource = authorize Resource.new(resource_params)
  if @resource.save
    redirect_to @resource, notice: 'Successfully Created Resource'
  else
    render :new, status: :unprocessable_content
  end
end
```

**Edit - Form for existing resource:**

```ruby
def edit
  # Resource set via before_action
end
```

**Update - Save changes to resource:**

```ruby
def update
  if @resource.update(resource_params)
    redirect_to @resource, notice: 'Successfully Updated Resource'
  else
    render :edit, status: :unprocessable_content
  end
end
```

**Destroy - Delete resource:**

```ruby
def destroy
  @resource.destroy
  redirect_to resources_url, notice: 'Successfully Deleted Resource'
end
```

### 4. Strong Parameters

**Pattern:** Define permitted attributes in private method.

```ruby
def resource_params
  params.expect(
    resource: [
      :simple_attr,
      :another_attr,
      nested_attrs: %i[id attr1 attr2 _destroy],
      array_attrs: [],
      multiple_ids: []
    ]
  )
end
```

**Rules:**

- Use `params.expect(model: [...])`
- Nested attributes: `{nested_attrs: %i[id attr _destroy]}`
- Arrays: `{array_attr: []}`
- Include `:id` for update, `_destroy` for deletion in nested attributes

### 5. HTTP Status Codes

```ruby
# Success - redirects (default 302, no status needed)
redirect_to @resource, notice: 'Success'

# Validation failure - render with unprocessable_content
render :new, status: :unprocessable_content    # 422
render :edit, status: :unprocessable_content   # 422

# Other statuses (rare in controllers)
head :no_content                               # 204
head :forbidden                                # 403
head :not_found                                # 404
```

**Rules:**

- Redirects never need explicit status
- Failed validations: `:unprocessable_content` (422)
- Turbo requires proper status codes for error handling

### 6. Flash Messages

**Pattern:** Consistent, user-friendly messaging.

```ruby
# Success (notice:)
redirect_to @product, notice: 'Successfully Created Product'
redirect_to @product, notice: 'Successfully Updated Product'
redirect_to products_url, notice: 'Successfully Deleted Product'

# Errors (alert:)
redirect_to products_path, alert: 'Must be pending to submit.'
redirect_to products_path, alert: 'Cannot delete active product.'
```

**Rules:**

- Format: `Successfully [Action] [Resource]`
- Use `notice:` for success
- Use `alert:` for errors/warnings
- Keep concise and action-oriented
- Title case for resource names

### 7. Naming Conventions

```ruby
# Controllers
ProductsController < ApplicationController
Admin::ProductsController < Admin::BaseController
Products::SubmissionsController < ApplicationController

# Instance variables
@product, @user         # Singular for one resource
@products, @users       # Plural for collections

# Private methods
def set_product         # Resource loading
def product_params      # Strong parameters
def ensure_pending      # State validation
def require_admin       # Authorization check
```

## Complete Examples

### Simple CRUD Controller

```ruby
class ProductsController < ApplicationController
  before_action :set_product, only: %i[show edit update destroy]

  def index
    @products = policy_scope(Product)
  end

  def show; end

  def new
    @product = authorize Product.new
  end

  def create
    @product = authorize Product.new(product_params)
    if @product.save
      redirect_to @product, notice: 'Successfully Created Product'
    else
      render :new, status: :unprocessable_content
    end
  end

  def edit; end

  def update
    if @product.update(product_params)
      redirect_to @product, notice: 'Successfully Updated Product'
    else
      render :edit, status: :unprocessable_content
    end
  end

  def destroy
    @product.destroy
    redirect_to products_url, notice: 'Successfully Deleted Product'
  end

  private

  def set_product
    @product = authorize Product.find(params[:id])
  end

  def product_params
    params.expect(product: %i[name description price])
  end
end
```

### Nested Resource Controller

```ruby
class OrderItemsController < ApplicationController
  before_action :set_order
  before_action :set_order_item, only: %i[show edit update destroy]

  def index
    @order_items = policy_scope(@order.order_items)
  end

  def new
    @order_item = authorize @order.order_items.build
  end

  def create
    @order_item = authorize @order.order_items.build(order_item_params)
    if @order_item.save
      redirect_to [@order, @order_item], notice: 'Successfully Created Order Item'
    else
      render :new, status: :unprocessable_content
    end
  end

  def update
    if @order_item.update(order_item_params)
      redirect_to [@order, @order_item], notice: 'Successfully Updated Order Item'
    else
      render :edit, status: :unprocessable_content
    end
  end

  def destroy
    @order_item.destroy
    redirect_to order_order_items_url(@order), notice: 'Successfully Deleted Order Item'
  end

  private

  def set_order
    @order = authorize Order.find(params[:order_id])
  end

  def set_order_item
    @order_item = authorize @order.order_items.find(params[:id])
  end

  def order_item_params
    params.expect(order_item: %i[product_id quantity price])
  end
end
```

## Common Mistakes

| ❌ Anti-Pattern | ✅ Correct Pattern |
| --- | --- |
| `@product = Product.new(product_params)` | `@product = authorize Product.new(product_params)` |
| `render :new, status: :unprocessable_entity` | `render :new, status: :unprocessable_content` |
| `render :new` (on validation failure) | `render :new, status: :unprocessable_content` |
| `@product = Product.new(params[:product])` | `@product = Product.new(product_params)` |
| `params.require(:product).permit(:name)` | `params.expect(product: %i[name])` |
| `redirect_to @product, notice: 'Product created!'`<br>`redirect_to @product, notice: 'Success!'` | `redirect_to @product, notice: 'Successfully Created Product'` |
| `before_action :set_product` (no scope) | `before_action :set_product, only: %i[show edit update destroy]` |
| Custom action for state changes | Namespaced controller with RESTful actions |

## Advanced Patterns

### Namespaced State Controllers

**Use When:** Actions represent state transitions (submit/unsubmit, activate/deactivate, approve/reject) on a resource.

**Pattern:** Namespace under parent resource, use `create` and `destroy` for state changes.

```ruby
# Controller: app/controllers/time_entries/submissions_controller.rb
class TimeEntries::SubmissionsController < ApplicationController
  before_action :set_time_entry
  before_action :ensure_valid_for_submission, only: :create
  before_action :ensure_submitted, only: :destroy

  def create
    @time_entry.update!(status: :submitted, submitted_at: Time.current)
    redirect_to time_entries_path, notice: 'Time entry submitted for approval.'
  end

  def destroy
    @time_entry.update!(status: :pending, submitted_at: nil)
    redirect_to time_entries_path, notice: 'Time entry unsubmitted.'
  end

  private

  def set_time_entry
    @time_entry = current_user.time_entries.find(params[:time_entry_id])
  end

  def ensure_valid_for_submission
    return if @time_entry.pending? && @time_entry.stopped?
    redirect_to time_entries_path, alert: 'Only stopped pending entries can be submitted.'
  end

  def ensure_submitted
    return if @time_entry.submitted?
    redirect_to time_entries_path, alert: 'Only submitted entries can be unsubmitted.'
  end
end

# Routes
resources :time_entries do
  resource :submission, only: [:create, :destroy], module: :time_entries
end

# Views
button_to time_entry_submission_path(@time_entry), method: :post    # Submit
button_to time_entry_submission_path(@time_entry), method: :delete  # Unsubmit
```

**Benefits:**

- RESTful (uses standard create/destroy actions)
- Clear file organization (controllers/time_entries/submissions_controller.rb)
- Validation extracted to before_actions
- Single controller handles both transitions
- Easy to test

### Bulk Operation Controllers

**Use When:** Operating on multiple records at once (bulk submit, bulk delete, bulk archive).

**Pattern:** Namespaced controller with only `create` action, validations in before_actions.

```ruby
# Controller: app/controllers/time_entries/bulk_submissions_controller.rb
class TimeEntries::BulkSubmissionsController < ApplicationController
  before_action :set_entries
  before_action :ensure_entries_present
  before_action :ensure_entries_valid

  def create
    @entries.update_all(status: TimeEntry.statuses[:submitted], submitted_at: Time.current)
    redirect_to time_entries_path, notice: "#{@entries.count} #{'entry'.pluralize(@entries.count)} submitted."
  end

  private

  def set_entries
    ids = params[:time_entry_ids] || []
    @entries = current_user.time_entries.where(id: ids)
  end

  def ensure_entries_present
    return if @entries.any?
    redirect_to time_entries_path, alert: 'No entries selected.'
  end

  def ensure_entries_valid
    invalid = @entries.reject { |e| e.pending? && e.stopped? }
    return if invalid.empty?
    redirect_to time_entries_path, alert: 'Only stopped pending entries can be submitted.'
  end
end

# Routes
resource :bulk_submissions, only: :create, module: :time_entries

# Views
form_with url: bulk_submissions_path, method: :post do |f|
  # checkboxes for time_entry_ids[]
end
```

### Scoped Collections in Show

**Use When:** Showing a resource with multiple related collections.

```ruby
def show
  @active_projects = policy_scope(@company.projects.active)
  @archived_projects = policy_scope(@company.projects.archived)
  @team_members = policy_scope(@company.users)
end
```

### Complex Nested Attributes

**Use When:** Forms accept nested records (has_many associations).

```ruby
def product_params
  params.expect(
    product: [
      :name,
      :description,
      :price,
      images_attributes: %i[id url alt_text _destroy],
      variants_attributes: %i[id sku price stock_count _destroy],
      tags: [],
      category_ids: []
    ]
  )
end
```

**Key Points:**

- Include `:id` for updating existing nested records
- Include `_destroy` for deletion via nested attributes
- Use `{ array_attr: [] }` for simple arrays
- Use `{ nested_attrs: %i[attr1 attr2] }` for nested attribute hashes

## Agent Instructions

### Generating New Controllers

1. **Identify controller type:**
   - Standard CRUD → Use Simple CRUD pattern
   - State transitions → Use Namespaced State pattern
   - Bulk operations → Use Bulk Operation pattern
   - Nested resource → Use Nested Resource pattern

2. **Apply patterns:**
   - Start with appropriate template
   - Add authorization (`authorize`, `policy_scope`)
   - Define strong parameters
   - Add before_actions with explicit scoping
   - Use correct status codes and flash messages

3. **Follow conventions:**
   - Name: `ResourcesController` or `Resources::StatesController`
   - Inherit from: `ApplicationController`
   - Instance variables: `@resource` (singular), `@resources` (plural)
   - Private methods: `set_resource`, `resource_params`

### Reviewing Existing Controllers

**Check for:**

- [ ] Authorization on all resource operations
- [ ] `before_action` with `only:`/`except:`
- [ ] Strong parameters (no direct `params[]` access)
- [ ] Status `:unprocessable_content` on validation failures
- [ ] Consistent flash messages: `Successfully [Action] [Resource]`
- [ ] Proper naming conventions
- [ ] State validations in before_actions (not in main actions)

**Priority order:** Security (authorization, params) → RESTful patterns → Status codes → Messaging
