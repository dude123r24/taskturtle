# UI Accessibility & Usability Fixes

## Plan
Apply all 10 priority fixes from UI audit. Grouped by file to minimize touches.

## Tasks

### Fix 1: Add aria-labels to all icon-only buttons
- [ ] TaskCard.tsx — Done, Focus, Edit, Delete buttons
- [ ] EisenhowerMatrix.tsx — Bulk add button
- [ ] TasksFilterBar.tsx — Quadrant filter toggles
- [ ] layout.tsx — Hamburger menu, Avatar button
- [ ] CommandPalette.tsx — Search input, Create task
- [ ] settings/page.tsx — Calendar delete, color pickers
- [ ] QuickAddDialog.tsx — Subtask checkbox, Send update
- [ ] PriorityTaskPath.tsx — Mark done (improve existing)

### Fix 2: Add keyboard support to clickable Boxes
- [ ] TaskCard.tsx — Card click
- [ ] TodayScheduled.tsx — Task items
- [ ] PriorityTaskPath.tsx — Task items
- [ ] settings/page.tsx — Color picker boxes

### Fix 3: Set minHeight: 44 on interactive elements
- [ ] theme.ts — Global button minHeight
- [ ] TaskCard.tsx — Action buttons
- [ ] TasksFilterBar.tsx — Toggle buttons, Tabs
- [ ] QuickAddDialog.tsx — Subtask checkbox, Send button
- [ ] EisenhowerMatrix.tsx — Bulk add button
- [ ] settings/page.tsx — Color picker circles

### Fix 4: TaskCard action button spacing
- [ ] TaskCard.tsx — spacing={0} → spacing={0.5}

### Fix 5: Nav item spacing
- [ ] layout.tsx — mb: 0.5 → mb: 1

### Fix 6: Add aria-labels to Tabs/ToggleButtonGroups
- [ ] TasksFilterBar.tsx — Tabs, quadrant group, horizon group
- [ ] CommandPalette.tsx — Dialog aria-label
- [ ] QuickAddDialog.tsx — Dialog aria-labelledby

### Fix 7: Fix contrast issues in themes
- [ ] theme.ts — Verify and fix secondary text contrast

### Fix 8: Replace emoji with SVG icons
- [ ] QuickAddDialog.tsx — "📝 Updates" → EditNoteIcon
- [ ] TaskCard.tsx — "📝" in updates preview → remove emoji

### Fix 9: Add prefers-reduced-motion
- [ ] globals.css — Disable page animation
- [ ] TaskCard.tsx — Disable flash animation

### Fix 10: Increase tiny font sizes
- [ ] TaskCard.tsx — 0.65rem → 0.75rem
- [ ] EisenhowerMatrix.tsx — DroppableAction label 0.65rem → 0.8rem
