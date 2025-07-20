---
applyTo: '**'
---

## General Guidelines
- Keep the code simple and readable.
- Use Prettier for code formatting.
## CSS
- Use class names that are descriptive and follow a consistent naming convention.
- Avoid using IDs for styling.
- Organize CSS properties in a logical order.
## Tailwind CSS
- Use utility-first classes to build components.
- Avoid using custom CSS when possible.
- Group related classes together for better readability.
## Typescript
- Use `const` and `let` instead of `var`.
- Prefer arrow functions for anonymous functions.
- Use template literals for string concatenation.
- Components and functions should be small, focused, and have a single responsibility.
- Components should ideally be "pure functions" as much as possible
- Always use semicolons.
- Follow the Prettier configuration for formatting.
- When side effects are necessary (e.g., API calls, DOM manipulation), they should be managed and isolated, ideally within custom hooks or utility functions that can be easily mocked or controlled during tests
## React
- Use single-file components (SFCs) with the `.tsx` extension.
- Use PascalCase for component names.
- Keep components small and focused.
- Do not mix JS/TS code and HTML. 
- Code should be testable. 
