
## Goal
Make every CTA on the site reliably navigate, raise accessibility to AA across all routes, and produce a Lighthouse performance + SEO report with fixes applied for the highest-impact findings.

## Scope (routes covered)
`/`, `/services`, `/our-work`, `/about`, `/contact`, `/privacy`, `/terms`, `/login`, `/admin/*`, `/404`

## Workstream 1 — CTA & navigation audit
Read every component that renders a button or link and verify it routes to the intended destination at mobile (375), tablet (768), and desktop (1280).

Components to audit:
- `Hero.tsx`, `EnhancedHero.tsx`, `AboutHero.tsx`
- `CTAButton.tsx`, `SimpleCTA.tsx`
- `Navbar.tsx` (desktop nav, mobile sheet, "Get a Quote")
- `Footer.tsx` (all column links, legal links, social)
- `Services.tsx`, `IndustriesStrip.tsx`, `WhyChooseUs.tsx`, `WhyChooseUsDetailed.tsx`
- `PortfolioTeaser.tsx`, `ProjectCard.tsx`, `ProjectGallery.tsx`
- `TestimonialsHome.tsx`, `Testimonials.tsx`
- `CertificationsSection.tsx`, `CompanyValues.tsx`, `CompanyStory.tsx`, `TeamSection.tsx`
- `ContactInfo.tsx`, `ContactMap.tsx`, `ServiceAreaMap.tsx`

For each CTA confirm: it is an `<a>`/`<Link>` (not a bare `<button>` masquerading as navigation), it points to a real route in `App.tsx`, it scrolls to top on navigation, and external links carry `target="_blank" rel="noopener noreferrer"`. Add missing `Link` wrappers or `onClick` handlers where buttons currently no-op. Phone/email CTAs use `tel:` / `mailto:`.

Verification: Playwright walk of each page at 375 and 1280 — click every visible CTA, assert resulting URL, screenshot.

## Workstream 2 — Accessibility audit + fixes
Static read pass + Playwright + axe-core run on each route. Fix in priority order:

Critical
- Icon-only buttons missing `aria-label` (Navbar hamburger, social icons, close buttons, theme/menu toggles)
- Images missing meaningful `alt` (industry tiles, portfolio cards, team photos, hero decoration → `alt=""`)
- Form inputs without associated labels (`SecureContactForm`, `SecureQuoteWidget`, `ContactFormMain`)
- Non-interactive elements with `onClick` lacking role + keyboard handlers
- Color-contrast failures from arbitrary Tailwind grays — replace with semantic tokens (`text-muted-foreground`, `text-foreground`)
- Single `<main>` per route; verify landmark structure
- Focus-visible rings on all interactive elements

Warning
- Heading order (one `h1` per page, no skipped levels)
- Tap targets ≥ 44×44 on mobile (Navbar icon button, footer social)
- `h-screen` → `h-dvh` where used for full-height sections
- Skip-to-content link restored as a single visually-hidden anchor (since `SkipLinks.tsx` was removed)
- `lang="en"` on `<html>`, `prefers-reduced-motion` respected by fiber animation (already partially handled — verify)
- ARIA on Sheet/Dialog (shadcn already correct — confirm no custom widgets bypass)

Verification: axe-core run via Playwright on every route; zero critical violations target.

## Workstream 3 — Lighthouse performance + SEO audit
Run Lighthouse (mobile profile, simulated throttling) via Playwright + `lighthouse` CLI against each route on `localhost:8080`. Capture: Performance, Accessibility, Best Practices, SEO scores plus the failing audits.

Report deliverable: a table per page with scores and the specific failing audits (LCP element, CLS sources, unused JS, image sizing, missing meta description, canonical, etc.).

Apply the highest-impact fixes:
- LCP image preload (hero image) + `fetchpriority="high"`
- Convert hero + industry tiles to AVIF/WebP via `vite-imagetools` if not already
- Add explicit `width`/`height` to every `<img>` to eliminate CLS
- Lazy-load below-the-fold images (`loading="lazy"`, `decoding="async"`)
- Code-split admin routes and Three/WebGL fiber renderers
- Ensure `SEO.tsx` emits unique `<title>`, meta description, canonical, `og:*`, `twitter:*`, JSON-LD per route — fill gaps on Privacy/Terms/Login/404
- `robots.txt` + `sitemap.xml` sanity check (sitemap edge function already exists — verify routes listed)

Out of scope: SEO content rewriting, new copy, redesign work, hero card or color changes.

## Technical notes
- All link routing through `react-router-dom` `<Link>` / `useNavigate`; never raw `window.location` for internal nav.
- New `aria-label`s and alt text use existing copy tone; no design token changes.
- Lighthouse run script lands in `/tmp/` (not committed). Findings summarized inline in chat.
- No schema changes, no new dependencies beyond `lighthouse` + `axe-core` as dev-only audit tools (run from `/tmp/`, not added to `package.json`).

## Deliverables
1. CTA audit table (route × CTA × destination × pass/fail) + fixes applied
2. a11y violations list (before/after) + fixes applied
3. Lighthouse score table per route + applied perf/SEO fixes + remaining recommendations

Plan Mode first — approve before I switch to build.
