# Product Roadmap — Journaling App

**Last Updated:** March 2026
**Current Version:** v0.1.0 (MVP)

---

## Vision

Build the best personal journaling experience on the web — distraction-free, private by default, and intelligent enough to help users reflect, grow, and understand themselves over time.

---

## Current State (v0.1.0)

The MVP delivers a clean, markdown-based journaling app with:
- Create, edit, and delete journal entries
- Write / Preview / Split view modes
- Real-time markdown rendering (GFM)
- Local storage persistence
- Word & character count
- PWA installable

---

## Roadmap Overview

| Quarter | Theme | Focus |
|---------|-------|-------|
| Q2 2026 | **Foundation** | Polish, search, tags, export |
| Q3 2026 | **Intelligence** | AI insights, mood tracking, prompts |
| Q4 2026 | **Sync & Collaboration** | Cloud sync, multi-device, sharing |
| Q1 2027 | **Growth** | Mobile apps, community, premium |

---

## Q2 2026 — Foundation

*Goal: Turn the MVP into a complete, polished daily journaling tool.*

### 1. Search & Filter
**Priority:** Critical
**Effort:** Medium

- Full-text search across all entries
- Filter by date range (today, this week, this month, custom)
- Highlight matched terms in search results
- Keyboard shortcut (`Cmd/Ctrl + F`) to open search

### 2. Tags & Organization
**Priority:** High
**Effort:** Medium

- Add tags to entries (e.g. `#gratitude`, `#work`, `#health`)
- Tag autocomplete from existing tags
- Filter sidebar by tag
- Tag cloud / overview page showing all tags and entry counts

### 3. Dark Mode
**Priority:** High
**Effort:** Low

- System-preference detection (`prefers-color-scheme`)
- Manual toggle in settings
- Smooth theme transition
- Persist user preference

### 4. Export & Backup
**Priority:** High
**Effort:** Medium

- Export single entry as Markdown (`.md`) or PDF
- Export all entries as a ZIP archive of `.md` files
- Export all entries as a single PDF journal
- Import entries from Markdown files

### 5. Rich Editor Toolbar
**Priority:** Medium
**Effort:** Medium

- Formatting toolbar: bold, italic, heading, list, blockquote, code
- Keyboard shortcuts for all formatting actions
- Image drag-and-drop into entries (base64 embedded)
- Table insertion helper

### 6. UX & Polish
**Priority:** Medium
**Effort:** Low–Medium

- Persist editor view mode (write/split/preview) across sessions
- Keyboard navigation: `↑/↓` to move between entries in sidebar
- Confirm dialog before deleting an entry
- Undo delete (toast notification with "Undo" action)
- Entry sort options: newest, oldest, alphabetical
- Responsive / mobile-friendly layout

---

## Q3 2026 — Intelligence

*Goal: Use AI to make the journal a tool for self-understanding and reflection.*

### 7. AI Writing Prompts
**Priority:** High
**Effort:** Medium

- Daily contextual prompts to help users start writing
- Prompts based on time of day, day of week, recent entry themes
- Prompt categories: Gratitude, Reflection, Goals, Creativity, Mindfulness
- "Inspire me" button inside the editor

### 8. Mood Tracking
**Priority:** High
**Effort:** Medium

- Optional mood selector when creating/saving an entry (emoji scale or 1–5)
- Mood history chart (line graph over time)
- Monthly mood summary on dashboard
- Correlate mood with tags or writing patterns

### 9. AI-Powered Insights
**Priority:** High
**Effort:** High

- Weekly summary: key themes, recurring topics, sentiment trend
- Highlight streaks and milestones ("You've written 7 days in a row!")
- Sentiment analysis on entries (positive / neutral / negative)
- "On this day" flashback — surface entries from 1 year ago, 1 month ago

### 10. Smart Templates
**Priority:** Medium
**Effort:** Low

- Pre-built templates: Daily log, Weekly review, Gratitude list, Meeting notes, Dream journal
- Custom template creation and saving
- Template picker when creating a new entry

### 11. Writing Stats Dashboard
**Priority:** Medium
**Effort:** Medium

- Total words written (all time / this month / this week)
- Writing streak calendar (GitHub-style heatmap)
- Average entry length, most productive time of day
- Tag frequency chart

---

## Q4 2026 — Sync & Sharing

*Goal: Make the journal accessible anywhere and enable intentional sharing.*

### 12. User Accounts & Authentication
**Priority:** Critical
**Effort:** High

- Sign up / log in with email + password or OAuth (Google, GitHub)
- Session management and secure token storage
- Account settings: display name, email, password change
- Account deletion with data export

### 13. Cloud Sync
**Priority:** Critical
**Effort:** High

- Real-time sync across all devices via backend API
- Offline-first: continue writing without internet, sync when reconnected
- Conflict resolution for simultaneous edits
- End-to-end encryption option for maximum privacy

### 14. Multi-Device Support
**Priority:** High
**Effort:** Medium

- Seamless experience on desktop, tablet, and mobile
- Fully responsive redesign optimized for touch
- Native-feel swipe gestures on mobile

### 15. Selective Sharing
**Priority:** Medium
**Effort:** Medium

- Share a single entry via a public read-only link
- Set link expiry (24h, 7d, 30d, never)
- Password-protect shared links
- Revoke shared links at any time

### 16. Collaborative Journals
**Priority:** Low
**Effort:** High

- Invite others to contribute to a shared journal (e.g. family journal, couple's diary)
- Per-user color coding of entries
- Comment threads on shared entries

---

## Q1 2027 — Growth

*Goal: Expand reach, build community, and introduce a sustainable revenue model.*

### 17. Native Mobile Apps
**Priority:** High
**Effort:** High

- iOS and Android apps (React Native or native)
- Widget for quick entry capture from home screen
- Lock-screen / notification reminders to write
- Face ID / fingerprint lock for app privacy

### 18. Reminders & Streaks
**Priority:** High
**Effort:** Low–Medium

- Daily reminder notifications (push / email)
- Custom reminder schedule (time of day, days of week)
- Streak rewards and milestone badges
- Streak freeze for planned breaks

### 19. Freemium / Premium Tier
**Priority:** High
**Effort:** Medium

| Feature | Free | Premium |
|---------|------|---------|
| Entries | Unlimited | Unlimited |
| Devices | 1 | Unlimited |
| Cloud sync | — | ✓ |
| AI insights | Limited | Full |
| Export (PDF) | — | ✓ |
| End-to-end encryption | — | ✓ |
| Custom themes | — | ✓ |
| Priority support | — | ✓ |

### 20. Integrations
**Priority:** Medium
**Effort:** Medium

- Apple Health / Google Fit mood correlation
- Notion export
- Zapier / Make webhook triggers (e.g. "new entry created")
- Readwise integration for highlights from books

### 21. Custom Themes & Fonts
**Priority:** Low
**Effort:** Low

- Curated editor themes (Sepia, Midnight, Forest, Ocean)
- Font pickers: serif, sans-serif, monospace options
- Adjustable font size and line spacing
- Full-screen focus / zen mode

---

## Ongoing / Always-On

These items are worked on continuously across all quarters:

- **Performance**: Fast load times, smooth animations, low memory footprint
- **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, screen reader support
- **Security**: Regular dependency audits, penetration testing, secure data handling
- **User research**: Monthly user interviews and usability sessions
- **Analytics**: Privacy-respecting usage analytics to guide prioritization

---

## Success Metrics

| Metric | Q2 Target | Q3 Target | Q4 Target |
|--------|-----------|-----------|-----------|
| Daily Active Users | 500 | 2,000 | 8,000 |
| 7-Day Retention | 30% | 40% | 50% |
| Avg. entries / user / week | 3 | 4 | 5 |
| NPS Score | 40 | 50 | 60 |
| Premium Conversion | — | — | 5% |

---

## How We Prioritize

Features are scored on three axes:

1. **User Impact** — How much does this improve the daily journaling experience?
2. **Strategic Value** — Does this help us retain users, grow, or generate revenue?
3. **Effort** — How much engineering time is required?

Features with high impact + high strategic value + low effort are shipped first.

---

*This roadmap is a living document. Priorities may shift based on user feedback, usage data, and market conditions.*
