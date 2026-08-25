# ADR 0003: Use bcryptjs for password hashing

- Status: Accepted
- Date: 2026-08-25

## Context

The application must authenticate users without storing plaintext passwords. The
challenge suggests bcryptjs, but does not mandate a password-hashing library. The
same password rule must serve the user CRUD, login, and the future admin seed.

## Decision

Use the asynchronous bcryptjs API in the User Service with a cost factor of 12.
Accept passwords with at least eight Unicode characters and reject inputs above
bcrypt's 72-byte limit instead of allowing silent truncation.

Store only the generated hash in `passwordHash`. Creation, password updates, and
the future admin seed must call the same User Service so they cannot bypass the
hashing rule.

## Alternatives considered

### Native bcrypt package

Native bcrypt offers better performance, but adds a native binary dependency and
can make installation and deployment less predictable across environments.

### Argon2id

Argon2id is a modern memory-hard option and would be preferable for a greenfield
production system with no challenge constraints. It adds another concept and
configuration surface to a short case study that explicitly points candidates
toward bcryptjs.

### Mongoose middleware

A `pre("save")` hook could hash passwords near persistence, but makes the rule
less explicit and does not naturally cover every update method. Keeping hashing
in the Service also makes reuse by the seed and authentication flow visible.

## Reasoning

bcryptjs satisfies the challenge, installs without native compilation, includes
salt generation in its hash operation, and exposes asynchronous hash and compare
functions. A cost factor of 12 is above the commonly cited minimum of 10 while
remaining practical for this small application.

Explicitly rejecting values above 72 bytes prevents two visibly different
passwords from being treated as the same truncated bcrypt input.

## Trade-offs

- bcryptjs is slower than the native bcrypt implementation.
- bcrypt has a 72-byte input limit that must remain enforced at every password
  entry point.
- A cost factor of 12 consumes CPU by design and should be benchmarked again if
  deployment hardware or authentication volume changes.
- Moving to Argon2id later requires a migration strategy or algorithm metadata
  so existing bcrypt hashes remain verifiable.
