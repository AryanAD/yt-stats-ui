# YouTube History Insights

## Overview

YouTube History Insights is a privacy-first, client-side analytics dashboard that transforms a user's exported YouTube watch history (from Google Takeout) into a comprehensive, interactive data visualization experience. 

The application processes all data locally in the browser—never uploading personal information to any server—and delivers detailed insights across 16+ dashboard sections, including watch timelines, channel analytics, keyword analysis, viewing streaks, session analytics, and more.

The goal is to create the most detailed YouTube history analytics website available, serving as both a practical tool for users and a polished portfolio project.

## Vision

Google allows users to export their YouTube watch history through Google Takeout. However, there is currently no modern, comprehensive application that allows users to deeply analyze their own YouTube viewing habits.

This project aims to solve that problem by providing a beautiful, interactive dashboard that extracts every possible statistic from a user's watch-history.json file.

## Core Philosophy: Privacy First

- **No server uploads**: The application should never upload user history to any server.
- **Everything happens in the browser**: The uploaded JSON file only exists in browser memory.
- **Zero storage cost**: No backend required means zero infrastructure costs.
- **Zero privacy concerns**: Data never leaves the user's device.
- **Instant processing**: No network latency for data processing.
- **Works offline** (future possibility).

## Target Users

- Anyone with Google Takeout data
- Data enthusiasts
- YouTube power users
- Developers
- Productivity enthusiasts
- Digital minimalists
- People curious about their viewing habits

## Core User Flow

1. User visits the landing page.
2. Landing page explains the process: export from Google Takeout and upload watch-history.json.
3. User uploads their JSON file.
4. Browser parses and processes the data (in memory).
5. Interactive dashboard appears with 16+ analytics sections.
6. User explores insights, filters data, and exports findings.

## Dashboard Sections

### 1. Overview
General statistics: total videos watched, unique channels, first/latest watch, average videos per day/week/month, and more.

### 2. Watch Timeline
Visual timeline with charts (daily/monthly/yearly views) and GitHub-style contribution heatmap.

### 3. Daily Habits
Analysis of most active hours, weekdays, months, and seasons with distribution charts.

### 4. Channel Analytics
Detailed metrics for every watched channel including videos watched, first/last watched, and frequency.

### 5. Creator Analytics (Future Enhancement)
Enriched creator data via YouTube API including subscriber count, total views, upload frequency, and category.

### 6. Video Analytics
Statistics on video titles, repeated watches, and viewing patterns.

### 7. Keyword Analysis
Word cloud and frequency ranking of keywords from video titles, with n-gram support (bigrams, trigrams).

### 8. Topic Detection
Automatic interest categorization with visualization (pie chart, treemap, radar chart).

### 9. Viewing Streaks
Longest daily streak, current streak, longest binge session, and most videos in a single day.

### 10. Session Analytics
Group watches into sessions (gap > 45 minutes) and analyze session length, videos per session, and daily sessions.

### 11. Search & Filtering
Powerful search by title, channel, keyword, date, month, year, category, and creator.

### 12. Calendar Explorer
Interactive calendar drill-down: year → month → day → videos watched.

### 13. Heatmaps
Visualize viewing patterns across hours, days, months, and weekdays.

### 14. Interactive Maps (Future)
World map visualization of creator countries and content origins.

### 15. Statistics
Interesting facts and metrics about viewing habits.

### 16. YouTube API Enhancement (Optional)
Optional enrichment using YouTube Data API for additional metadata (duration, views, likes, etc.).

### 17. Achievement System
Fun badges for completing milestones (Night Owl, GeoGuessr Master, Tech Addict, etc.).

### 18. Export Features
Export charts and data as PNG, PDF, CSV, JSON summary, and shareable statistics images.

## Technology Stack

| Layer | Technology | Role |
|-------|-----------|------|
| Framework | Next.js | Application framework |
| Language | TypeScript | Type-safe development |
| Styling | TailwindCSS | Utility-first CSS |
| UI Components | shadcn/ui | Accessible component library |
| Animations | Framer Motion | Smooth animations |
| Charts | Recharts, D3.js | Data visualization |
| State Management | Zustand | Global state |
| Deployment | Vercel/Netlify | Static hosting |
| Build Output | Static Export | Fully static site |

## Success Criteria

1. Application processes watch-history.json entirely in the browser.
2. User data never leaves the browser.
3. Dashboard displays 16+ comprehensive analytics sections.
4. Performance handles 100,000+ records efficiently.
5. Modern, responsive, and accessible UI with dark/light modes.
6. Charts and visualizations are interactive and beautiful.
7. Export functionality works for PNG, PDF, CSV.
8. Achievements and gamification add delight.
9. SEO-friendly landing page drives organic traffic.
10. Codebase is clean, modular, and well-documented.