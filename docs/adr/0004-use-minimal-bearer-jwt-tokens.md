# ADR 0004: Use minimal Bearer JWT tokens

- Status: Accepted
- Date: 2026-08-25

## Context

The challenge requires JWT authentication but does not define token contents,
expiration, or transport. Protected API routes need a stateless way to identify
an authenticated user without exposing sensitive or frequently changing data.

## Decision

Issue signed JWTs after a successful email and password login. Send them through
the `Authorization: Bearer <token>` header. Use the user ID as the `sub` claim and
let the JWT library add only the standard `iat` and `exp` claims.

Read the signing secret and expiration from environment variables, with a default
expiration of one day. Do not include email, profile, password data, or the hash in
the token.

## Alternatives considered

### Include email and profile in the token

This can reduce database reads for authorization, but those values can become
stale before the token expires. The current challenge does not define role-based
authorization, so they provide no required benefit.

### Cookie-based server sessions

Server sessions can offer straightforward revocation and secure HttpOnly cookies,
but conflict with the challenge's explicit JWT requirement and add session state.

## Reasoning

A minimal token limits duplicated user data and avoids treating a signed payload
as encrypted. Bearer headers match the required Axios interceptor flow and keep
authentication independent from browser-only cookie behavior.

## Trade-offs

- A stolen token remains usable until it expires.
- Local browser storage used by the frontend is accessible to successful XSS.
- Changing a user's profile does not invalidate an existing token.
- Token revocation would require additional state or a shorter lifetime.
