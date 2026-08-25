# ADR 0007: Deploy with private MongoDB on Fly and frontend on Vercel

- Status: Accepted
- Date: 2026-08-25

## Context

The challenge requires a publicly accessible application. The repository contains
an independent Next.js frontend and Express API, while MongoDB must persist data
without exposing its database port to the public internet.

## Decision

Deploy the Next.js frontend to Vercel and the Express API to Fly.io. Run MongoDB
in a separate Fly app in the same personal organization, without an HTTP or TCP
public service. Connect the API to MongoDB through Fly's private IPv6 network and
persist `/data/db` in a Fly volume.

Use one small MongoDB machine and one volume for this interview case study. Store
the database credentials, JWT secret, admin seed password, and allowed frontend
origin as encrypted platform secrets rather than repository files.

## Alternatives considered

### MongoDB Atlas

Atlas provides a managed database, automated operations, and a free tier when
available. It would require configuring another provider and a network allowlist,
and the application would depend on public cross-provider database connectivity.

### Host all layers on one platform

Keeping every layer on one provider can simplify billing and observability.
Vercel is nevertheless the most direct deployment target for this Next.js
frontend, while Fly provides private networking and a persistent volume for the
API and database.

### Expose the MongoDB port publicly

A public port would make external administration easier, but unnecessarily adds
an internet-facing database attack surface. Private access is sufficient because
only the API needs to connect to MongoDB.

## Reasoning

This separation follows the existing application boundaries and keeps the
database inaccessible from the public internet. Vercel builds the Next.js app
natively, and Fly runs the JavaScript backend directly from a small container.
No deployment-specific dependency is added to the application code.

## Trade-offs

- The application depends on two hosting providers.
- The API may have a cold start because its machine can stop while idle.
- A single MongoDB machine is not highly available and requires a backup plan for
  real production data.
- Operating MongoDB directly means updates, monitoring, and backups are our
  responsibility; a managed service would be preferable at larger scale.
- Fly's private DNS resolves running machines, so the database machine must stay
  available.
