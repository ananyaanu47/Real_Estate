# Copilot instructions for this workspace

## Project context
- This repository is intended to be a local, single-user real-estate owner portal, not a public marketplace. Keep the product centered on fast property organization, presentation, and admin workflows.
- Follow the product brief as the source of truth for scope: dashboard, property listing, property details, edit/create flows, presentation mode, favorites, reports, backup/restore, and settings.

## Architecture to preserve
- Prefer a clear split between frontend and backend:
  - frontend/: React + TypeScript + Vite + Tailwind + shadcn/ui
  - backend/: Node.js + Express + Prisma + SQLite
  - database/: schema and migrations
  - uploads/{images,videos,documents}/: local media storage
  - backups/: export snapshots
- Keep UI concerns in the frontend and persistence/business logic in the backend. Avoid embedding database access directly in components.

## Domain model conventions
- Treat property as the core domain object and model it with explicit fields for status, type, price, location, specs, amenities, notes, and media.
- Status is a first-class concept: available, reserved, and sold. Sold properties should remain visible but appear in sold-focused views and reports.
- Keep media as structured data: store metadata in the database and files on disk, using server endpoints for upload/download.

## UX and workflow expectations
- The property listing experience is the most important workflow. Any changes should preserve fast search, filter, sort, and card/list views.
- Presentation mode should be a dedicated experience with minimal chrome, larger media, and no admin controls.
- Dashboard cards and reports should reflect the same underlying property counts and status data; do not duplicate logic in separate screens.

## Implementation guidance
- Reuse shared UI patterns for property cards, status badges, filters, media galleries, and detail summaries instead of creating one-off screens.
- Build search/filter/sort as reusable query helpers so the listing page, favorites page, and dashboard views all use the same logic.
- Keep backup/restore as a first-class admin operation that includes the SQLite database and media folders.
- When adding a feature, keep the future extension path in mind: separate services and DTOs now so multi-user or cloud-ready architecture can be introduced later without a rewrite.
