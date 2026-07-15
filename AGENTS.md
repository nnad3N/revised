# Project guidelines

## Styling

- Use Tailwind utilities for ordinary layout and presentation: positioning, spacing, sizing, typography, colors, transitions, transforms, and responsive rules.
- Keep raw CSS for styles that are substantially clearer as CSS, such as complex masks, gradients, or browser-prefixed declarations.
- Custom class names used by raw CSS must start with `_` so they are easy to distinguish from Tailwind utilities.
- Do not add a custom class only to select an element in JavaScript. Use a descriptive `data-*` attribute instead.
- Represent UI state with `data-*` attributes and style it with Tailwind data variants. Do not toggle presentation classes from JavaScript.
- For numeric values calculated in JavaScript, write a CSS custom property and consume it with a Tailwind utility when possible.
- Prefer a short custom CSS rule over a long collection of hard-to-read arbitrary Tailwind declarations when the CSS expresses one cohesive complex effect.

Run the formatter and `pnpm typecheck` after changing components or styles.

## State and runtime context

- Use a `Context` type for a long-lived runtime object that owns identity-based resources such as DOM elements, workers, rendering contexts, event state, or mutable collections. Pass it as `ctx`.
- Mutating a runtime context is expected. Do not create shallow copies of a context to imitate immutability; its nested resources would still be shared.
- Keep calculations pure when practical. A helper that derives data should return that data and leave assignment to an explicit orchestration boundary.
- Reserve imperative names such as `set`, `update`, `sync`, `apply`, `bind`, and `render` for functions that perform mutations or side effects.
- Name data-returning helpers after the value or relationship they calculate, such as `metricsFromLayout`, `centerFromPointer`, or `progressFromIndex`. Do not give a pure function a name that implies it mutates state.
- Make changes to ordinary mutable variables visible at the call site. Avoid helpers that unexpectedly reassign module-level or closure state.
