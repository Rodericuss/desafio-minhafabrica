# ADR 0005: Seed the admin with an idempotent script

- Status: Accepted
- Date: 2026-08-25

## Context

The challenge requires an initial admin user and permits either a script or an API
route. A seed route would create a production attack surface unless carefully
disabled or separately authenticated.

## Decision

Provide the `npm run seed:admin --workspace=backend` command. Read admin data from
environment variables and call the same User Service used by the CRUD.

Treat an existing normalized email as a successful no-op. Do not silently change
the existing name, password, or profile.

## Alternatives considered

### Public or secret seed route

A route can be convenient on a hosted environment, but adds HTTP exposure and a
secret or environment switch that must be protected after first use.

### Upsert the admin directly with Mongoose

An upsert is compact, but bypasses the Service's validation and password hashing
rules and can unexpectedly reset credentials on repeated deployments.

## Reasoning

An explicit command has a smaller production attack surface. Reusing the Service
guarantees the same bcrypt and validation behavior, while the no-op policy makes
repeated deployments predictable.

## Trade-offs

- Deployment must run the seed command explicitly.
- Losing the original password requires a separate, intentional reset process.
- If the email already belongs to a non-admin user, the script does not promote it
  silently; an operator must resolve that state.
