# YouTube History Insights Agent Rules

This directory contains the project documentation for the YouTube History Insights analytics dashboard.

Read the following files in order before implementing or making any architectural decision:

1. `instructions.md` — core project requirements and feature details
2. `project-overview.md` — product scope, goals, and workflow
3. `architecture-context.md` — system stack, boundaries, and storage model
4. `ui-context.md` — frontend design expectations and interaction rules
5. `code-standards.md` — implementation conventions
6. `ai-workflow-rules.md` — development workflow and phase order
7. `progress-tracker.md` — current status and next steps

Update `progress-tracker.md` after each meaningful implementation change.

If implementation changes the architecture, scope, or standards documented in the context files, update the relevant file before continuing.

## Key Changes from CoffeeMart Nepal

| Aspect | Old (CoffeeMart Nepal) | New (YouTube History Insights) |
|--------|----------------------|-------------------------------|
| Product | Commercial coffee consultation booking | YouTube history analytics dashboard |
| Target | Business owners/cafe planners | YouTube power users, data enthusiasts, developers |
| Core Action | Book FREE consultation | Upload watch-history.json and view analytics |
| Architecture | Full-stack (React + Express + MySQL) | Client-side only (Next.js static export) |
| Data Storage | MySQL + Prisma | Browser memory only |
| Backend | Required | None |
| Email | Required | Not needed |
| Privacy | Data stored on server | Data never leaves browser |
| Deployment | cPanel Shared Hosting | Vercel/Netlify/Static Export |
| Tech Stack | React + Vite, Node.js, MySQL | Next.js, React, TypeScript |
| Key Feature | Consultation booking | 16+ analytics dashboard sections |