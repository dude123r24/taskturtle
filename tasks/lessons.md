# Lessons Learned

Format: each lesson lists the **mistake**, **root cause**, and **rule** to prevent recurrence.

---

## 2026-04-09 — Untracked file caused Railway build failure

**Mistake**: Pushed code to `main` that imported `@/lib/quadrantIcons`, but the file `src/lib/quadrantIcons.tsx` was untracked in git. Local dev (`next dev`) compiled fine. Railway (which only sees what's committed) failed with `Module not found: Can't resolve '@/lib/quadrantIcons'` for two import sites.

**Root cause**:
1. Earlier commit (`4ba2930`) added imports against the file but never `git add`-ed the file itself.
2. `git status` was visible at session start showing `?? src/lib/quadrantIcons.tsx`, but I committed surrounding work without resolving the untracked entry.
3. Never ran `npm run build` locally — only relied on `next dev` and TypeScript checks. Dev mode tolerates the file because the local filesystem has it; production builds only see what's in git.

**Rule (added to CLAUDE.md → Git Hygiene)**:
- Before committing any change that touches imports, scan `git status` for `??` lines under `src/`, `lib/`, or other imported paths. Each one is a potential deploy bomb. Resolve explicitly: stage it, delete it, or `.gitignore` it.
- Before pushing for deploy or claiming a feature is complete, run `npm run build` at least once. `next dev` and `tsc --noEmit` are insufficient — they will both pass with an untracked-but-present file. Only the production build catches it.

**How to apply**:
- Treat `git status` at session start as a checklist, not a status report. Untracked files in source paths must be resolved before any commit lands.
- After a series of edits and before pushing, run the production build once. Cost: ~30s. Saves: a broken deploy and a debugging round trip.
