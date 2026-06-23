
# Buckeye DataCom — Full Buildout Plan

Scope: turn the existing 5-page React/Vite + Supabase site into a finished, production-ready landing site. No backend schema changes. No business-logic changes — UI/UX, routing, copy, and configuration only.

## 1. Home page — natural scroll narrative (`src/pages/Index.tsx`)

Remove the three forced `h-screen` blocks. New flow, top to bottom:

1. `<Hero />` — keep as-is, full viewport (`min-h-dvh`)
2. `<StatsStrip />` — full-width band
3. `<Services />` — three service cards
4. **NEW** `<IndustriesStrip />` — icon row: Corporate, Healthcare, Education, Manufacturing, Retail, Government (lucide icons, no new images)
5. `<WhyChooseUs />`
6. **NEW** `<TestimonialsHome />` — 3 short client quotes (static copy, plain cards)
7. **NEW** `<PortfolioTeaser />` — pulls top 3 published `projects` from Supabase (reuses `ProjectCard`), "View all work →" links to `/our-work`
8. `<SimpleCTA />` — wired to `/contact`
9. `<Footer />` (new expanded version, see §3)

Drop the `h-1/3` / `h-2/3` / `h-1/2` math. Each section gets its own `py-16 md:py-24`.

## 2. Navbar — desktop links + mobile hamburger (`src/components/Navbar.tsx`)

- Below `lg`: current hamburger overlay, unchanged.
- `lg:` and up: horizontal nav — Home · Services (with dropdown: Fiber, Low-Voltage, AI Monitoring) · Our Work · About · Contact — plus a red **Get a Quote** button routing to `/contact`.
- Hamburger button hidden at `lg:` (`lg:hidden`).
- Active route gets a scarlet underline. Color states already adapt to `isScrolled`; reuse that.

## 3. Footer — expanded (`src/components/Footer.tsx`)

Replace current 2-column footer with 4 columns on `md+`:

- **Buckeye DataCom** — address, phone, email, short tagline
- **Services** — links to `/services` deep anchors (#fiber, #low-voltage, #ai-monitoring)
- **Company** — About, Our Work, Contact, Login
- **Legal** — Privacy Policy (`/privacy`), Terms of Service (`/terms`)

Bottom bar: copyright + "Serving Central Ohio & surrounding regions". No social icons unless handles are provided later.

## 4. Legal pages

Two new routes, both registered in `src/App.tsx` with `PageErrorBoundary`:

- `src/pages/Privacy.tsx` — standard privacy policy scoped to Buckeye DataCom: what's collected via the contact/quote forms (name, email, phone, message), how it's stored (Lovable Cloud / Supabase), email handling via edge functions, no third-party sale, contact-to-delete instructions.
- `src/pages/Terms.tsx` — standard site terms: use of site, intellectual property, no warranty, governing law (Ohio), contact.

Both use `Navbar`, prose layout (`max-w-3xl prose`), `Footer`, and the existing `SEO` component with `noindex={false}` and canonical URLs.

The pages carry a visible "This page is maintained by Buckeye DataCom" qualifier and ask the user to review the boilerplate before publishing — no compliance/certification claims are made.

## 5. Fix Google Maps embed on `/contact`

Root cause: `src/components/SecurityHeaders.tsx` injects a meta CSP with `default-src 'self'` and no `frame-src` exception, so the Google Maps `<iframe>` is blocked.

Fix: in `SecurityHeaders.tsx`, add `frame-src https://www.google.com https://maps.google.com;` to the CSP `content`. Also drop `frame-ancestors` and `X-Frame-Options` from the meta tag (they're invalid in meta — that's the recurring console error).

## 6. Wire every CTA

Audit and fix to ensure every visible CTA navigates correctly. Wrap `CTAButton`s in `<Link to="/contact">` (or add `onClick={() => navigate('/contact')}`) in:

- `src/components/SimpleCTA.tsx`
- `src/components/TeamSection.tsx` ("Meet Our Team")
- `src/pages/OurWork.tsx` ("Start Your Project")
- Any other unwired `CTAButton` instance found in the audit.

The Services-page sticky CTA already routes — verify only.

## 7. Cleanup pass

- Remove `<SecurityHeaders />` duplicate render in `src/pages/Contact.tsx` (it's already rendered globally in `App.tsx`).
- Delete `src/components/QuoteWidget` reference if any stale import remains (it was deleted earlier).

## Technical notes

- No database migrations. No new tables. Existing `projects` and `team_members` tables are reused.
- No new dependencies. Icons via existing `lucide-react`. Routing via existing `react-router-dom`.
- All colors via existing `buckeye-scarlet` / `buckeye-black` / `buckeye-gray` tokens — no hardcoded hex.
- Mobile-first: each new section uses `py-16 md:py-24`, grids collapse to single column under `md`, tap targets ≥ 44px on the new nav + footer links.
- SEO: new `/privacy` and `/terms` pages get `SEO` + `BreadcrumbSchema` entries, plus additions to `src/config/seo.ts`.

## Acceptance checks

- Home scrolls naturally with 9 sections; no horizontal scroll at 375px; no `h-screen` mathematical splits.
- Desktop nav visible at ≥1024px; hamburger replaces it below.
- Footer shows 4 columns at `md+`, has working Privacy/Terms links.
- `/privacy` and `/terms` render with Navbar + Footer.
- `/contact` Google Map renders (no CSP refusal in console).
- Every primary CTA navigates to `/contact`.
- All 7 routes (`/`, `/services`, `/our-work`, `/about`, `/contact`, `/privacy`, `/terms`) return 200 in a Playwright sweep with no new console errors.

## Out of scope

- Backend schema, auth flows, admin dashboard internals.
- Blog/resources section.
- New imagery or photography.
- Hero animation system changes.
- Visual redesign of existing components beyond layout/wiring.
