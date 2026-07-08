# Architecture Context

## Stack

| Layer | Technology | Role |
|-------|-----------|------|
| Framework | Next.js (App Router) | Application framework with static export |
| Language | TypeScript | Type-safe development |
| Styling | TailwindCSS | Utility-first CSS |
| UI Components | shadcn/ui | Accessible, customizable components |
| Animations | Framer Motion | Smooth page and component animations |
| Charts | Recharts (primary), D3.js (advanced) | Data visualization |
| State | Zustand | Client-side state management |
| Data Processing | Native browser APIs, Web Workers | Parse and process JSON data |
| Caching | IndexedDB (optional) | Cache processed data |
| Deployment | Vercel / Netlify / Static Hosting | Host static export |

## System Boundaries

- **Landing Page**: Static marketing page explaining the product and how to use it.
- **Dashboard**: All analytics components live here; data processing is isolated.
- **Data Processing Layer**: Parses JSON, processes statistics, generates derived data.
- **Visualization Layer**: Renders charts, heatmaps, calendars, and word clouds.
- **Export Layer**: Handles exporting charts and data to various formats.
- **No Backend**: The application has no server-side components. Everything runs client-side.

## Storage Model

- **Browser Memory**: Uploaded JSON file exists only in memory during the session.
- **localStorage**: Stores user preferences (theme, view settings, favorite views).
- **IndexedDB** (optional): Can cache processed data for faster reloads.
- **Session Storage**: Temporary state for current dashboard session.
- **URL Parameters**: Shareable state for filters and search queries.

## Architecture Principles

### Zero Backend
- No API calls to any external service.
- No data sent to any server.
- Everything is computed in the browser.

### Privacy First
- User data never leaves the browser.
- No tracking of uploaded data.
- No analytics on what users watch.

### Performance First
- Process large files in Web Workers.
- Virtual scrolling for long lists.
- Lazy loading for heavy components.
- Memoization of expensive computations.

### Progressive Enhancement
- Core features work without JavaScript? (No, but we provide fallback UX).
- YouTube API enrichment is optional.
- Dark/light mode works across all browsers.

## Data Flow

1. **Upload**: User uploads watch-history.json via file input.
2. **Parse**: FileReader reads the file as text → JSON.parse() → validate structure.
3. **Process**: Data processed by analytics workers:
   - Extract metadata
   - Compute statistics
   - Generate derived datasets
   - Build aggregation structures
4. **Store**: Processed data stored in Zustand store (memory only).
5. **Visualize**: Dashboard components subscribe to store and render visualizations.
6. **Filter/Search**: User interactions trigger re-computation of filtered datasets.
7. **Export**: Export functions generate PNG/PDF/CSV from current view.

## API Surface

**No APIs. Everything is client-side.**

## Invariants

1. Never send user data to any external server.
2. Validate uploaded JSON structure before processing.
3. Handle malformed JSON gracefully with user feedback.
4. Maintain TypeScript strict mode throughout.
5. All chart components must handle empty states.
6. Processing must work for 100,000+ records.
7. Dark/light mode must be supported for all components.
8. All exports must work client-side (no server assistance).

## Performance Considerations

- **Web Workers**: Heavy processing (parsing, aggregating) should be offloaded to Web Workers.
- **Memoization**: Use useMemo and useCallback for expensive computations.
- **Virtual Scrolling**: For channel lists and video lists with large datasets.
- **Lazy Loading**: Load chart libraries only when needed.
- **Debouncing**: For search and filter inputs.
- **Bundle Splitting**: Separate chart libraries into different chunks.

## Security

- **XSS Protection**: Sanitize video titles before rendering (dangerouslySetInnerHTML should be avoided).
- **File Validation**: Validate file size and structure before processing.
- **CSP**: Implement Content Security Policy headers.
- **No eval**: Never use eval() or new Function() for processing.

## Deployment Strategy

### Static Export
- `next export` generates static HTML files.
- Deploy to any static hosting provider.
- No server required.
- Fast CDN delivery.

### Build Process
1. `npm run build` → Next.js build
2. `npm run export` → Static export
3. Deploy `out/` directory to host

### Environment Variables
- All env vars must be prefixed with `NEXT_PUBLIC_` if used client-side.
- No sensitive keys required (since no backend).
- YouTube API key (optional) should be client-side compatible.

## Development Workflow

1. Component-driven development.
2. Use Storybook for component library (optional).
3. Test data processing with sample JSON files.
4. Performance testing with large datasets.
5. Lighthouse audits for performance and accessibility.
6. TypeScript compilation checks on each commit.