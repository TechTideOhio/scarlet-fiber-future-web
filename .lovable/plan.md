# Mobile & Tablet UX Pass

Audited every route at 320 / 375 / 390 / 428 / 768 / 1024px with a real browser. Good news first: **no page has horizontal overflow** at any width (document scrollWidth equals viewport width on `/`, `/services`, `/our-work`, `/about`, `/contact`, `/login`, `/privacy`, `/terms`), the mobile hamburger drawer exists and is used on every page, and body scroll is already locked when it opens. The problems are tap-target size, modal behavior on phones, toast placement, and missing states.

## Audit findings

### Critical
1. **Tap targets under 44px** (measured, every page):
   - Footer links: all 17px tall (Services, Company, Legal columns, phone, email).
   - Contact page: phone/email links 20px, LinkedIn icon button 40×40.
   - `/our-work` filter buttons: 36px tall (All Projects, Cloud Integration, Data Center, …).
   - Home inline links: "All services →", "About our team →", "View all work →" ~29px.
   - Login: inputs 40px, "Sign up" button 51×20, "Back to Home" 24px.
   - Legal pages: inline email/phone links 20px.
2. **Contact form textarea renders at 14px** → iOS zooms on focus. All other inputs are already 16px.
3. **Form inputs are 40px tall** (below 44px) and have no `inputmode`/`autocomplete`, so phones show the wrong keyboard.
4. **Focused input can be hidden by the keyboard** on the contact form — no `scrollIntoView` on focus.
5. **Project modal is not a mobile sheet**: `max-h-[90vh]` (breaks with mobile browser bars), fixed `h-[400px]` hero image, close button with a ~40px hit area, stays a centered rounded dialog at 320px.
6. **Two toasters are mounted** (legacy shadcn `Toaster` + `Sonner`), and Sonner sits top-right with default styling — on a phone it lands over the fixed navbar.

### Interaction / state / a11y
7. Mobile drawer has `aria-expanded` and a labeled close button, but **no Escape-to-close, no focus trap, and focus does not return to the hamburger** on close.
8. Desktop Services dropdown is **hover-only** (fine at `lg:`, but it should also open on click/keyboard for touch-capable laptops and tablets in landscape).
9. No `:active` feedback on drawer items, filter chips, or footer links; `focus-visible` is only global CSS, not on the branded controls.
10. `/our-work` and the About team grid have **no loading skeleton and no empty state** — after the team table was cleared, the section renders nothing.

## Fixes (no new colours, fonts, or tokens)

**Tap targets** — apply the existing spec (`min-h-11`, `inline-flex items-center`, `py-2`) to footer links, contact/legal inline links, home inline CTAs, filter chips, and login controls. Inputs go to `min-h-11` with `text-base`.

**Contact form** — textarea to `text-base`, add `inputmode`/`autocomplete` per field, and scroll the focused field into view on focus (`scrollIntoView({ block: 'center' })`).

**Project modal** — below `sm`: `h-[100dvh] w-full max-w-none rounded-none inset-0 translate-x-0 translate-y-0`, image `h-56`, close button `min-h-11 min-w-11` top-right. At `sm:` and up keep the existing centered rounded dialog, changed to `max-h-[90dvh] overflow-y-auto`. Radix already handles scroll lock, overlay tap, Escape, and focus trap.

**Toasts** — remove the duplicate legacy `Toaster` from `App.tsx`, keep Sonner, and position it `bottom-center` on mobile / `bottom-right` on desktop with `pb-[env(safe-area-inset-bottom)]` offset and brand-token styling. No bottom app bar exists, so no collision offset needed.

**Mobile drawer** — keep the current slide-in structure, animation timing, and colours exactly as-is (it already matches the landing page). Add: Escape closes, focus moves to the first item on open and back to the hamburger on close, focus stays trapped inside while open, and `active:` states on items. Also make the desktop Services dropdown keyboard/click-operable in addition to hover.

**Footer** — keep the column structure; on small screens tighten to a single stacked column with `py-8 gap-6` rhythm and give every link a 44px row. No newsletter input exists, so nothing to add there.

**States** — add a skeleton grid for `/our-work` while projects load, an empty state when the list is empty, and an empty state for the About team section (currently zero rows), using existing text styles.

## Technical notes
- Files touched: `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/components/ProjectModal.tsx`, `src/components/ui/sonner.tsx`, `src/App.tsx`, `src/components/contact/*`, `src/pages/OurWork.tsx`, `src/pages/About.tsx`, `src/pages/Login.tsx`, `src/pages/Privacy.tsx`, `src/pages/Terms.tsx`, and the home section components with inline CTAs.
- Drawer keeps its CSS transform transitions rather than switching to Framer Motion `AnimatePresence`, so the animation stays byte-identical to the landing page pattern.
- Verification: re-run the 320/375/390/428/768/1024 sweep and report the remaining tap-target/overflow counts, plus a modal open/close/Escape check at 375px.
