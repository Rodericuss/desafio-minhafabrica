# ADR 0002: Use JavaScript in the backend

- Status: Accepted
- Date: 2026-08-25

## Context

The challenge requires Node.js, Express, MongoDB, and Mongoose in the backend. TypeScript is explicitly required only in the frontend, and the suggested backend entry point is `app.js`. The candidate decided to keep the backend in JavaScript.

## Decision

Implement the backend in modern JavaScript with ES modules. Use Node.js directly in development and production, with its native watch mode during development.

Keep the Controller, Service, Repository, and Model boundaries explicit through focused modules, clear names, runtime validation, and tests rather than adding a compilation layer.

## Alternatives considered

### TypeScript

TypeScript could provide compile-time contracts between layers and better editor feedback. It would also require compiler configuration, type declarations, and a build step that the challenge does not require.

### JavaScript with CommonJS

CommonJS is widely understood in existing Node.js applications, but ES modules align the backend with current JavaScript module syntax and with the frontend's import and export syntax.

## Reasoning

JavaScript follows the challenge more directly, reduces setup and deployment steps, and keeps the backend easier to explain under the project deadline. Runtime validation remains mandatory because neither JavaScript nor TypeScript can trust external HTTP input automatically.

## Trade-offs

- There is no compile-time verification of contracts between backend layers.
- Refactors require stronger tests and careful review.
- Runtime validation and clear module boundaries become even more important.
- The backend has no compilation output; production executes the source files directly.
