---
name: optics-context
description: Use the Optics design framework for styling applications. Apply Optics classes for layout, spacing, typography, colors, and components. Use when working on CSS, styling views, or implementing design system guidelines.
metadata:
  triggers:
    - slim
    - css
    - frontend
    - design-system
    - optics
---

## Discovering Optics Classes
When you need classes follow these steps:

1. Check `skills/optics-context/assets/components.json` for the appropriate component, modifiers, and attributes.
  - Often you may need to modify these components to better fit the context or need. Use BEM CSS structure to create modifiers and variants as needed. Use existing tokens when available to ensure consistency. 
2. If you don't find an appropriate component, search in `app/assets/stylesheets` for any relevant components.
3. If nothing is found, create a new component in a CSS file named after the page that we're on.
  - If you're creating new classes, always use existing CSS tokens. You can find these in the `skills/optics-context/assets/tokens.json` file.

### Modifying Optics Classes
When modifying Optics classes, follow these guidelines:

- Always ensure that changes align with the overall design system principles.
- Follow BEM naming conventions for any new classes.
- Add changes to the appropriate CSS file in `app/assets/stylesheets/components/overrides/{component.css}`.
- Ensure that you import any new css files in the `application.scss`

### Fixing Optics Violations
As CSS is created or modified, it's important to be looking for Optics violations. These would include:
- **Hard-coded colors**
  - `#fff`, `#FFFFFF`, `rgb(...)`, `hsl(...)`, `rgba(...)`, named colors like `white`
  - Gradients: `linear-gradient(...)` containing literals
- **Hard-coded spacing/sizing**
  - `px`, `rem`, `em`, `%` (sometimes), `vh/vw` (maybe allowed depending on policy)
  - `border-radius`, `gap`, `padding`, `margin`, `width/height` when used as spacing primitives
- **Hard-coded shadows/borders**
  - `box-shadow: 0 1px 3px rgba(...)`
  - `border: 1px solid #ddd`
- **"Almost token" mistakes**
  - `var(--op_color_primary...)` (bad separators)
  - `var(--op-color-primary-plus-one-on)` (segment order wrong)
  - Missed `--op-` prefix

When violations are found, refactor the CSS to use the appropriate Optics tokens from `skills/optics-context/assets/tokens.json`.

If no appropriate token exists, create a new token following the guidelines below.

### Creating New Optics Tokens
When creating new Optics tokens, follow these guidelines:
- Always ensure that new tokens align with the overall design system principles.
- Follow the established naming conventions for tokens.
- New tokens created within a project should use a namespace prefix related to the project to avoid conflicts. For example, a project called "Your App" might use the prefix `--ya-` for its tokens.
- Otherwise, use the standard token format as seen in the `skills/optics-context/assets/tokens.json` file.
- Occasionally, it may be helpful to create new global tokens to fit into the main Optics token set for your project. In such cases, ensure that the new token is broadly applicable and follows the established naming conventions. Usually, these tokens would be very general, such as new spacing sizes, color shades, or typography styles that could be reused across multiple parts of the application.

## Theming
To customize the application, a custom theme files that serve as overrides to the existing tokens can be provided. An example implementation of the main project CSS file would look like:
```css
@import '@rolemodel/optics';

@import 'stylesheets/theme/my_app_theme';
```
Note how the custom theme is imported after the main Optics styles, ensuring that any token overrides take precedence.

A custom theme can change any tokens, including colors, radius, fonts, and even redefine the luminosity and semantic scales.

```css
@import url('https://fonts.googleapis.com/css2?family=Coming+Soon&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Grandstander:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

:root {
  /* Colors */
  --op-color-primary-h: my-new-value;
  --op-color-primary-s: my-new-value;
  --op-color-primary-l: my-new-value;

  /* Color Scale */
  --op-color-primary-plus-two: light-dark(
    hsl(var(--op-color-primary-h) var(--op-color-primary-s) 64%),
    hsl(var(--op-color-primary-h) var(--op-color-primary-s) 32%)
  );

  /* Fonts */
  --op-font-family: 'Coming Soon', sans-serif;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme-mode='light']) {
    --op-font-family: 'Grandstander', sans-serif;
  }
}

:root[data-theme-mode='dark'] {
  --op-font-family: 'Grandstander', sans-serif;
}
```

### Color Scale Overriding
If  you need to override the provided color scales, you should redefine all the variants of that color to ensure consistency across the application. For example, if you are overriding the primary color, you should redefine all its variants like so:

```css
:root {
  --op-color-primary-h: 164;
  --op-color-primary-s: 100%;
  --op-color-primary-l: 50%;

  /* Main Scale */
  --op-color-primary-plus-two: light-dark(
    hsl(var(--op-color-primary-h) var(--op-color-primary-s) 64%),
    hsl(var(--op-color-primary-h) var(--op-color-primary-s) 32%)
  );
  --op-color-primary-plus-one: light-dark(
    hsl(var(--op-color-primary-h) var(--op-color-primary-s) 45%),
    hsl(var(--op-color-primary-h) var(--op-color-primary-s) 35%)
  );

  /* On Scale */
  --op-color-primary-on-plus-two: light-dark(
    hsl(var(--op-color-primary-h) var(--op-color-primary-s) 16%),
    hsl(var(--op-color-primary-h) var(--op-color-primary-s) 80%)
  );
  --op-color-primary-on-plus-two-alt: light-dark(
    hsl(var(--op-color-primary-h) var(--op-color-primary-s) 6%),
    hsl(var(--op-color-primary-h) var(--op-color-primary-s) 92%)
  );
  --op-color-primary-on-plus-one: light-dark(
    hsl(var(--op-color-primary-h) var(--op-color-primary-s) 100%),
    hsl(var(--op-color-primary-h) var(--op-color-primary-s) 80%)
  );
  --op-color-primary-on-plus-one-alt: light-dark(
    hsl(var(--op-color-primary-h) var(--op-color-primary-s) 95%),
    hsl(var(--op-color-primary-h) var(--op-color-primary-s) 98%)
  );
}
```

## For More Information
For more details on theming and token overrides, refer to the Optics documentation using the links below
- [Optics Repo](https://github.com/RoleModel/optics/)

### Documentation Resources
For detailed component usage, refer to:
- **Component API**: https://docs.optics.rolemodel.design/?path=/docs/components-button--docs
- **Token Reference**: https://docs.optics.rolemodel.design/?path=/docs/overview-tokens--docs
- **Color System**: https://docs.optics.rolemodel.design/?path=/docs/tokens-color-color-scale--docs

### When You Need More Information
If the user asks about specific components or advanced features not covered in this skill:
1. Use `web_fetch` or another method to retrieve the relevant documentation page
2. Extract the specific information needed
3. Apply it to the user's request

Example: For button variants, check https://docs.optics.rolemodel.design/?path=/docs/components-button--docs