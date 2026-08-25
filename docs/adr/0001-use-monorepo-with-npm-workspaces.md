# ADR 0001: Use a monorepo with npm workspaces

- Status: Accepted
- Date: 2026-08-25

## Context

The challenge requires a backend and a frontend and permits either a monorepo or separate repositories. Both applications belong to the same delivery, will evolve together, and need shared quality commands through Biome.

## Decision

Keep the backend and frontend in one Git repository under `backend/` and `frontend/`. Use npm workspaces from the root `package.json` to manage both packages with one lockfile and workspace-aware commands.

## Alternatives considered

### Separate repositories

This isolates histories and deployments, but it would require coordinating two repositories, two review flows, and two delivery links for one small application.

### Monorepo without npm workspaces

This keeps the code together but requires independent installs and lockfiles. Root-level commands and dependency management would be less consistent.

## Reasoning

A monorepo makes the complete request flow easier to review and present. npm workspaces provide native package management without introducing a separate monorepo tool such as Turborepo or Nx.

## Trade-offs

- The frontend and backend share repository-level changes and history.
- Deployment services must be configured with the correct application root.
- Workspace configuration adds a small amount of npm-specific knowledge.
- One lockfile can change when dependencies from either application change.
