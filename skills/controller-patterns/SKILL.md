---
name: controller-patterns
description: RoleModel's conventions for Rails controllers — Pundit authorization on every action, `params.expect`, `:unprocessable_content` on failed saves, flash wording, and state changes and bulk actions as their own namespaced RESTful controllers. Use when writing, generating, or reviewing a Rails controller, adding a controller action, adding a state transition (submit, approve, archive, activate), or adding a bulk action.
metadata:
  triggers: "rails controller, controller action, generate controller, review controller, RESTful controller, before_action, pundit authorize, strong params, state transition, bulk action"
---

# Controller Patterns

These are the RoleModel defaults. Where a project's own controllers or `docs/conventions/` disagree, follow the project.

## The shape

```ruby
class WidgetsController < ApplicationController
  before_action :set_widget, only: %i[show edit update destroy]

  def index
    @widgets = policy_scope(Widget)
  end

  def show; end

  def new
    @widget = authorize Widget.new
  end

  def create
    @widget = authorize Widget.new(widget_params)

    if @widget.save
      redirect_to @widget, notice: 'Successfully Created Widget'
    else
      render :new, status: :unprocessable_content
    end
  end

  def edit; end

  def update
    if @widget.update(widget_params)
      redirect_to @widget, notice: 'Successfully Updated Widget'
    else
      render :edit, status: :unprocessable_content
    end
  end

  def destroy
    @widget.destroy
    redirect_to widgets_url, notice: 'Successfully Deleted Widget'
  end

  private

  def set_widget
    @widget = authorize Widget.find(params[:id])
  end

  def widget_params
    params.expect(widget: [:name, :price, { part_ids: [], parts_attributes: %i[id name _destroy] }])
  end
end
```

## Rules

- **Authorize everything.** `policy_scope` for collections, `authorize Model.new(...)` when building, `authorize` inside `set_*` for existing records. No action skips Pundit.
- **Scope every `before_action`** with `only:` or `except:`. Name them `set_<resource>`, `ensure_<state>`, `require_<permission>`.
- **`params.expect`**, not `params.require(...).permit(...)`. Nested attributes include `id` and `_destroy`.
- **Failed saves render with `status: :unprocessable_content`.** Turbo ignores a re-rendered form that comes back as 200. Redirects need no status.
- **Flash wording:** `notice: 'Successfully <Created|Updated|Deleted> <Model>'` for success, `alert:` for failures.
- **No custom actions.** A state change or bulk operation gets its own controller with standard actions (below).
- **A child resource with several parents** gets one controller, not one per parent. See `polymorphic-parent-resources`.

## State changes: a namespaced resource

Submitting, approving, archiving, or activating is creating or destroying a state, not a `submit` action on the parent controller.

```ruby
# config/routes.rb
resources :orders do
  resource :submission, only: %i[create destroy], module: :orders
end

# app/controllers/orders/submissions_controller.rb
class Orders::SubmissionsController < ApplicationController
  before_action :set_order
  before_action :ensure_submittable, only: :create

  def create
    @order.submit!
    redirect_to @order, notice: 'Successfully Submitted Order'
  end

  def destroy
    @order.unsubmit!
    redirect_to @order, notice: 'Successfully Unsubmitted Order'
  end

  private

  def set_order
    @order = authorize Order.find(params[:order_id]), :submit?
  end

  def ensure_submittable
    return if @order.submittable?

    redirect_to @order, alert: 'Only draft orders with line items can be submitted'
  end
end
```

The view calls `button_to 'Submit', order_submission_path(@order)` and `button_to 'Unsubmit', order_submission_path(@order), method: :delete`.

## Bulk operations

Same idea: `Orders::BulkSubmissionsController` with only `create`, taking `order_ids[]`. Load the records through `policy_scope`, check them in `before_action`s, and redirect with a count (`"3 orders submitted"`).

## Gotchas

- `authorize` returns its argument, so `@widget = authorize Widget.find(...)` works. A bare `authorize @widget` on its own line after the assignment works too, but is easy to drop in a refactor.
- `params.expect` responds 400 when the root key is missing or a value has the wrong shape (a string where an array is declared), where `permit` would quietly drop it. A 400 from a hand-built `fetch` request usually means the body doesn't nest under the model key.
- Shallow member routes give no parent id, so `set_<parent>` belongs on collection actions only.

## Reviewing a controller

Check in this order: authorization and strong params, then RESTful structure (no custom actions, no per-parent duplicates), then status codes, then flash wording.
