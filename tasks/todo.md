# Invite / Share Feature

## Goal
Users can invite friends to TaskTurtle via a personal invite link.
- User clicks "Share" in nav → modal with copyable invite link
- Friend opens link → login page shows "Invited by <Name>" + stores token
- Friend signs up → token is redeemed, relationship recorded

## Tasks

### Step 1: Schema ✅ (pending migration)
- [ ] Add `Invite` model (token, inviterId, usedAt, usedByUserId)
- [ ] Add `invites Invite[]` and optional `referredById String?` to User

### Step 2: API routes
- [ ] `POST /api/invite` — create or return existing invite token for auth'd user
- [ ] `GET /api/invite/[token]` — public: validate token, return inviter name/image
- [ ] `POST /api/invite/[token]/redeem` — auth'd: mark invite used, set referredBy

### Step 3: ShareModal component
- [ ] `src/components/ShareModal.tsx` — copy link, Web Share API, friends-joined count

### Step 4: Layout — Share entry point
- [ ] Add Share button to sidebar (desktop) and more sheet (mobile)
- [ ] Wire ShareModal open state

### Step 5: Login page — invite capture
- [ ] Read `?invite=<token>` from URL
- [ ] Store token in `localStorage` as `pendingInviteToken`
- [ ] Show "You were invited by <Name>" banner if token is valid

### Step 6: Post-auth redeem
- [ ] In layout.tsx `useEffect`, read `localStorage.pendingInviteToken`, call redeem, clear it

## Files touched
1. `prisma/schema.prisma`
2. `src/app/api/invite/route.ts` (new)
3. `src/app/api/invite/[token]/route.ts` (new)
4. `src/components/ShareModal.tsx` (new)
5. `src/app/(dashboard)/layout.tsx`
6. `src/app/(auth)/login/page.tsx`
