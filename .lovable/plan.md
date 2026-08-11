# Consistency Audit: Align the whole app to the landing page

## Consistency Spec (extracted from the landing page)

Source of truth: `Navbar.tsx`, `Footer.tsx`, `ProjectModal.tsx` (opened from `PortfolioTeaser`), plus the landing sections.

**Tokens**
- Colors only from `buckeye-scarlet`, `buckeye-black`, `buckeye-gray`, `white`, `gray-300/400/700/800`, and semantic tokens (`bg-background`, `text-foreground`, `muted`, `destructive`). No raw hex.
- Type: display serif (Fraunces) for headings via global CSS, Inter body.

**Buttons / CTAs**
- Primary: `bg-buckeye-scarlet text-white text-sm font-semibold rounded-md px-5 py-2.5 min-h-11 hover:bg-buckeye-scarlet/90 transition-colors`.
- Text links: `text-gray-300 hover:text-white transition-colors` (dark) / `text-buckeye-gray hover:text-buckeye-scarlet transition-colors` (light).
- Radius: `rounded-md` everywhere; `rounded-full` only for small badges/pills.
- Motion: `transition-colors` or `transition-all duration-300` only. No scale, no pulse.

**Nav**
- Fixed, `z-50`, transparent on home hero, `bg-white shadow-md py-3` when scrolled or off-home; mobile overlay `bg-buckeye-black`, 500ms slide, body scroll lock, `aria-expanded`/`aria-label`.

**Modal**
- Custom overlay pattern: dark backdrop, close button `absolute right-4 top-4 p-2 text-buckeye-gray hover:text-buckeye-scarlet transition-colors`, media `rounded-lg`, pill badge `bg-buckeye-scarlet text-white text-sm px-3 py-1 rounded-full font-medium`, scroll lock + Escape close.

**Footer / sections**
- `bg-buckeye-black py-14`, container `px-4 lg:px-8`, section headings `text-sm font-semibold uppercase tracking-wider` with `border-l-2 border-buckeye-scarlet pl-2`.

## Deviations found and fixes

| Component | Deviation | Fix |
|---|---|---|
| `SimpleCTA.tsx` | Hardcoded `hover:bg-[#990000]`, `font-bold py-4 px-8` | Use spec primary button classes (`hover:bg-buckeye-scarlet/90`, `font-semibold`, `px-8 py-4` kept for hero-scale CTA) |
| `Testimonials.tsx` | Raw hex `#BB0000` / `#E5E5E5` on stars; component is unused (dead file) | Delete the unused file (landing uses `TestimonialsHome`) |
| `CTAButton.tsx` | Own size scale (`py-2.5 px-6`, `text-base/lg`), `font-medium`, `transition-all` | Normalize to spec: `text-sm font-semibold`, `min-h-11`, `transition-colors`, keep 3 variants |
| `NotFound.tsx` | `animate-pulse` on the 404 numeral, `border-buckeye-gray text-white` outline button | Remove pulse; outline button matches spec outline variant |
| `AccessibilityControls.tsx` | `hover:scale-105`, `focus:ring` (not `focus-visible`), `rounded` / `rounded-full`, `bg-black/80` | Align to spec: remove scale, `focus-visible:ring-2 focus-visible:ring-buckeye-scarlet`, `rounded-md`, `bg-buckeye-black/80` |
| `Login.tsx` | shadcn defaults with `bg-muted/30`, `bg-primary/10` circle | Keep semantic tokens (they resolve to brand scarlet) but standardize submit button and back-link to spec classes |
| `PageErrorBoundary.tsx`, `SecureQuoteWidget.tsx`, `ServiceAreaMap.tsx`, `ProjectCard.tsx`, `Services.tsx`, `OurWork.tsx` | Mixed `rounded-xl/2xl`, ad-hoc button paddings, `focus:` instead of `focus-visible:` | Normalize radii to `rounded-md` (media stays `rounded-lg`), buttons to spec, focus rings to `focus-visible:ring-2 ring-buckeye-scarlet ring-offset-2` |
| Forms (`SecureContactForm`, `ContactFormMain`) | Submit button uses default shadcn sizing | Apply spec primary button classes; keep validation logic untouched |

Data-table / dashboard surfaces in `pages/admin/Dashboard.tsx` inherit the closest spec patterns: `border-border`, `text-sm`, row hover `hover:bg-muted/50`, headings uppercase tracking-wider.

## Ambiguities and choices
- Landing has both `transition-colors` (nav/footer) and `transition-all duration-300` (CTA). Chose `transition-colors` for links/icon buttons, `transition-all duration-300` for CTAs.
- Landing modal is a custom overlay, not shadcn `Dialog`. Chose to keep the custom pattern as canonical rather than migrating to `DialogContent`, so no new behaviour is introduced.
- Semantic tokens vs `buckeye-*` utilities: kept semantic tokens on auth/admin surfaces (they already map to scarlet) and `buckeye-*` on marketing pages, matching current landing usage.

## Scope guardrails
No new colors, spacing scales, animations, or interactions. Hero card and its colors untouched. Business logic, routing, and backend calls unchanged.

## Output
After the refactor: the spec above, the changed-file list with reasons, and the ambiguity decisions.
