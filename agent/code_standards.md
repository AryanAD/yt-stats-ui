# Code Standards

## General

- Keep modules small and single-purpose.
- Fix root causes — do not layer workarounds.
- Do not mix unrelated concerns in one component or route.
- Respect the system boundaries defined in `architecture-context.md`.
- **All data processing must happen client-side. No data should be sent to any server.**

## Frontend

- Use Next.js + React + TypeScript for the application.
- Use functional components and hooks.
- Use TailwindCSS for styling with shadcn/ui components.
- Use Framer Motion for animations.
- Keep landing UI separate from dashboard UI.
- Implement dark and light mode support.
- Ensure mobile-first responsive design.
- All text fields: Use system fonts or Inter.

## Data Processing

- Parse JSON files using native browser APIs.
- Process data in Web Workers for large files (100,000+ records).
- Use IndexedDB for caching processed data when appropriate.
- Never send user data to any external server.
- Validate file structure before processing.
- Handle malformed JSON gracefully.

## Charts & Visualizations

- Use Recharts for standard charts (line, bar, pie, area).
- Use D3.js for advanced visualizations (heatmaps, treemaps).
- Implement loading skeletons for all chart components.
- Make charts interactive with tooltips and drill-downs.
- Support exporting charts as PNG/PDF.

## Performance

- Handle 100,000+ history records efficiently.
- Parse files within seconds.
- Use memoization for expensive computations.
- Implement virtual scrolling for long lists.
- Lazy-load heavy components.
- Use debouncing for search/filter operations.

## State Management

- Use Zustand for global state management.
- Keep state minimal and derived data computed on the fly.
- Use URL parameters for filter/search state.
- Persist user preferences (theme, view settings) in localStorage.

## File Organization

- `app/` — Next.js app router pages
- `components/` — Reusable UI components
  - `components/ui/` — shadcn/ui components
  - `components/dashboard/` — Dashboard-specific components
  - `components/charts/` — Chart components
  - `components/landing/` — Landing page components
- `lib/` — Utilities and helpers
  - `lib/analytics/` — Data processing logic
  - `lib/charts/` — Chart configuration
  - `lib/types/` — TypeScript type definitions
- `hooks/` — Custom React hooks
- `public/` — Static assets
- `workers/` — Web Workers for heavy processing

## TypeScript Standards

- Use strict TypeScript configuration.
- Define interfaces for all data structures.
- Use type guards for runtime type checking.
- Avoid `any`; use `unknown` and type narrowing.
- Export reusable types from a central types file.

## Testing

- Test data processing functions with sample JSON files.
- Test chart rendering with mock data.
- Test file upload and parsing flow.
- Test responsiveness of dashboard components.
- Keep tests focused and reliable.

## Accessibility

- Follow WCAG 2.1 AA standards.
- Use semantic HTML elements.
- Provide proper ARIA labels.
- Support keyboard navigation.
- Maintain sufficient color contrast.
- Provide focus indicators.

## SEO

- Implement proper meta tags on landing page.
- Use Next.js metadata API.
- Generate Open Graph images.
- Implement structured data.
- Use semantic HTML for content.

## Performance Budget

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90
- Bundle Size: < 500KB (initial load)