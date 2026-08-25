# ADR 0006: Store the browser JWT in local storage

- Status: Accepted
- Date: 2026-08-25

## Context

The challenge requires a JWT, a centralized Axios client, and an authentication
interceptor. The Next.js frontend and Express API run as separate applications.
The browser must persist the token across navigation and page reloads.

## Decision

Store the JWT in `localStorage`. A centralized Axios request interceptor reads it
and sends `Authorization: Bearer <token>`. A response interceptor removes it and
returns to `/login` after a `401` response.

Keep the token key and storage operations in one small module. Treat frontend
route protection as user experience only; the Express middleware remains the real
security boundary.

## Alternatives considered

### HttpOnly secure cookie

An HttpOnly cookie is not readable by JavaScript and reduces direct token theft by
XSS. It would require the backend to set cross-origin cookies, credentialed CORS,
SameSite decisions, and CSRF protection. It also does not demonstrate the Bearer
interceptor flow explicitly requested by the challenge.

### Session storage

`sessionStorage` has the same JavaScript/XSS exposure and loses the session when
the browser tab closes, which is unnecessary for this case study.

### React state only

In-memory state is simple but loses authentication on every reload.

## Reasoning

Local storage keeps the required interceptor flow direct and explainable within a
separate frontend/backend architecture. The backend uses a short-lived, minimal
JWT and validates it on every protected request.

## Trade-offs

- JavaScript can read local storage, so successful XSS can steal the token.
- Visual redirects in Next.js do not protect data; only the backend middleware does.
- There is no server-side token revocation before expiration.
- A production system with stronger browser security requirements should favor an
  HttpOnly cookie design with explicit CSRF and CORS handling.
