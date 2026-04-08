# UI Polish & Audit Fixes — COMPLETE

## Tasks

### Group 1: Typography & Font Stack ✅
- [x] layout.tsx — Added `Instrument_Serif` display font as `--font-display`
- [x] theme.ts — Fixed `sharedTypography.fontFamily` to use `var(--font-sans)` (was hardcoded Inter)
- [x] theme.ts — Fixed luxury theme font to use `var(--font-sans)` (removed Plus Jakarta Sans dependency)

### Group 2: Global CSS ✅
- [x] globals.css — Fixed scrollbar colors for light themes (neutral gray instead of white-only)
- [x] globals.css — Updated Shadcn CSS vars in `:root` + `.dark` to be chromatic (purple-based, matching MUI themes)
- [x] globals.css — Added `task-check` CSS animation + `prefers-reduced-motion` guard

### Group 3: Dashboard Layout ✅
- [x] (dashboard)/layout.tsx — Fixed bottom nav label font: 0.65rem → 0.75rem
- [x] (dashboard)/layout.tsx — Added skip-to-content link (`#main-content`)
- [x] (dashboard)/layout.tsx — Added `id="main-content"` to main content Box
- [x] (dashboard)/layout.tsx — Added `aria-modal="true"` to More sheet content

### Group 4: Landing & Login ✅
- [x] page.tsx — Replaced 4-square placeholder with real Eisenhower Matrix mockup (quadrant cards with sample tasks)
- [x] page.tsx — Applied `--font-display` italic serif to hero h1 accent word "velocity."
- [x] page.tsx — Fixed sub-11px axis/label fonts (0.65rem → 0.72rem)
- [x] login/page.tsx — Replaced external gstatic Google SVG img with inline SVG (performance + reliability)
- [x] login/page.tsx — Fixed sub-11px nav link fonts (0.7rem → 0.75rem)

### Group 5: Components ✅
- [x] TaskCard.tsx — CSS `task-check-animate` on completion (replaces no animation; triggers on isDone transition)
- [x] TaskCard.tsx — Fixed chip fontSize 0.72rem → 0.75rem
- [x] TaskCard.tsx — Fixed description compact fontSize 0.7rem → 0.75rem
- [x] dashboard/page.tsx — Added `ChartEmptyState` component (icon + message + CTA)
- [x] dashboard/page.tsx — All 4 charts now show empty states instead of blank frames
- [x] dashboard/page.tsx — Pie chart uses `theme.palette.error/info/warning/disabled` (theme-aware)
- [x] dashboard/page.tsx — Added `QueryStatsIcon` import for empty state
- [x] GlassKpiStrip.tsx — Removed redundant isLuxury ternary on labelColor/valueColorDefault
- [x] PriorityTaskPath.tsx — Fixed chip fontSize 0.7rem → 0.75rem

## Result
- 0 TypeScript errors
- 9 files modified, 0 new files created
- All sub-11px font sizes fixed (in audit scope)
- No new dependencies added
