---
name: controller-patterns
description: Review and update existing Rails controllers and generate new controllers following professional patterns and best practices. Covers RESTful conventions, authorization patterns, proper error handling, and maintainable code organization.
---

# Rails Controller Patterns

> [!IMPORTANT] Controllers should nearly always look just like the examples below. Deviations should be rare and justified.
>              Controllers should be skimmable. The patterns below are designed with that in mind.

## The Standard Controller

```ruby
class ResourcesController < ApplicationController
  before_action :set_resource, except: %i[index new create]

  def index
    @resources = policy_scope(Resource)
  end

  def new
    @resource = authorize Resource.new
  end

  def create
    @resource = authorize Resource.new(resource_params)

    if @resource.save
      redirect_to @resource, notice: 'Successfully Created Resource'
    else
      render :new, status: :unprocessable_content
    end
  end

  def update
    if @resource.update(resource_params)
      redirect_to @resource, notice: 'Successfully Updated Resource'
    else
      render :edit, status: :unprocessable_content
    end
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

## Child Resource Controller

```ruby
class ResourcesController < ApplicationController
  # NOTICE: Parent/Child resource setters use inverse conditions.
  #         Only one resource setter should run per action and they
  #         will almost always split on INDEX/NEW/CREATE
  before_action :set_parent_resource, only: %i[index new create]
  before_action :set_resource, except: %i[index new create]

  def index
    @resources = policy_scope(@parent_resource.resources)
  end

  def new
    @resource = authorize @parent_resource.resources.new
  end

  def create
    @resource = authorize @parent_resource.resources.new(resource_params)

    if @resource.save
      redirect_to @resource, notice: 'Successfully Created Resource'
    else
      render :new, status: :unprocessable_content
    end
  end

  def update
    if @resource.update(resource_params)
      redirect_to @resource, notice: 'Successfully Updated Resource'
    else
      render :edit, status: :unprocessable_content
    end
  end

  def destroy
    @resource.destroy

    redirect_to resources_url, notice: 'Successfully Deleted Resource'
  end

  private

  # NOTE: Never authorize the parent resource.
  def set_parent_resource
    @parent_resource = ParentResource.find(params[:parent_resource_id])
  end

  # NOTE: Always authorize the child resource in the set method.
  def set_resource
    @resource = authorize Resource.find(params[:id])
  end

  def resource_params
    params.expect(resource: %i[attr1 attr2])
  end
end
```

**Rules:**

- `policy_scope()` for collections (index)
- `authorize ClassName.new()` for new records (new, create)
- `authorize` in `set_*` methods for existing records
- Never skip authorization of some kind in a controller action
- Don't write empty actions - `def edit; end` is unnecessary and adds noise.
- Controllers are simply the necessary glue between view and model. The goal should be to never look at them.
- assign exactly one instance variable per action, whether that happens in a before action hook or in the action itself.
- Redirects never need explicit status, but should usually include a `notice` or `alert` flash message inline.
- Failed validations: `:unprocessable_content` (422) - This is a Requirement for Turbo to work properly.

### Before Actions

**Pattern:** Controllers should generally have either one or two `before_action` "set_*" hooks.

```ruby
# Resource loading (most common)
before_action :set_product, except: %i[index new create]

# Parent resource loading (The controller should be named after the child resource, not the parent)
# Conditions are precisely inverted, so deviations are easily noted when skimming.  That's a crucial point for hooks, generally!
before_action :set_company, only: %i[index new create]
before_action :set_employee, except: %i[index new create]
```

### Strong Parameters

**Pattern:** Define permitted attributes in a private `<resource-name>_params` method.

```ruby
def resource_params
  params.expect(
    resource: [
      :name,
      :description,
      setting_attributes: %i[id name _destroy], # singular for has_one or some kind of aggregate value object.
      addresses_attributes: [%i[id street city state zip _destroy]], # plural for has_many, note the extra array for multiple nested records.
    ]
  )
end
```

**Rules:**

- Use `params.expect(model: [...])`
- Nested attributes should map to `accepts_nested_attributes_for` or `<value-object-method-name>_attributes=` definitions on the model.
- Nested attributes should include `id` & `_destroy` for updates and deletions.

### Flash Messages

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
