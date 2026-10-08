---
name: routing-patterns
description: >-
  RoleModel's conventions for `config/routes.rb` — route concerns that pass the parent type with `parent_resource.name.classify`, `scope shallow: true`, explicit `only:`/`except:`, singular resources for state changes, and `resolve` for form objects. Use when adding, generating, reviewing, or reorganizing Rails routes, adding a nested resource or route concern, or when a polymorphic path helper or `url_for` can't find a route.
metadata:
  triggers: "rails routes, routes.rb, route helper, nested routes, resourceful routing, route concern, shallow nesting, resolve, parent_resource, member route, collection route"
---

# Routing Patterns

These are the RoleModel defaults. Where a project's routes or `docs/conventions/` disagree, follow the project.

## Layout of `routes.rb`

Concerns first, then resources inside `scope shallow: true`, then sessions and admin, then mounted engines, then `resolve` blocks, then `root`.

```ruby
Rails.application.routes.draw do
  concern :commentable do
    resources :comments, commentable_type: parent_resource.name.classify
  end

  concern :duplicatable do
    resources :duplications, only: %i[create], duplicatable_type: parent_resource.name.classify
  end

  scope shallow: true do
    resources :projects, concerns: %i[commentable duplicatable] do
      resources :tasks, except: %i[index], concerns: %i[commentable turbo_form] do
        resource :completion, only: %i[create destroy], module: :tasks
      end
    end
  end

  resolve('TaskImport') { |import| [import.project, :task_imports] }

  root 'dashboard#index'
end
```

## Rules

- **Shared children go in a concern** that passes the parent's class with `parent_resource.name.classify`, never a hard-coded string. The controller side is `resource_for` from `rolemodel_rails`; read `polymorphic-parent-resources` before writing it.
- **Wrap nested resources in `scope shallow: true`** so member routes are `/tasks/:id`, not `/projects/:project_id/tasks/:id`.
- **Every `resources` line declares `only:` or `except:`** unless it really serves all seven actions.
- **State changes are singular nested resources**, not member routes: `resource :completion, only: %i[create destroy], module: :tasks` instead of `patch :complete, on: :member`. The controller side is in `controller-patterns`.
- **Dynamic forms use the `:turbo_form` concern** that the `turbo_form` gem defines. Apply it; never define it. See `dynamic-forms`.
- **Form objects and wrapper models get a `resolve` block** so `form_with model:` and `url_for` produce the right path.
- **Engines that expose data are mounted behind a constraint** (an admin check), and dev-only engines are mounted only outside production.

## Gotchas

- **Shallow member routes inherit the first parent's defaults.** When a concern with member actions is applied to several parents, Rails draws `/comments/:id` once per parent and only the first is reachable. Every member request therefore carries the first-drawn parent's `commentable_type`. Controllers must read the `*_type` param on collection actions only; see `polymorphic-parent-resources`.
- **Route defaults can't be overridden from the request.** They are merged into `params` last, which is what makes passing the parent type through a default safe.
- **`param: :slug` changes the controller's key** to `params[:slug]`, and nested routes become `:<parent>_slug`.

## Checking your work

Run `bin/rails routes -c <controller>` or `bin/rails routes -g <path fragment>` after every change and confirm the paths, verbs, and helper names are what the views and specs expect.
