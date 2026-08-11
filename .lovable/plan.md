# Unified Interaction Language

Goal: one consistent, premium feel for every hover, press, focus, and overlay — with zero changes to colours, type, spacing, radius, or layout.

## Audit findings (current state)

Verified by reading the shadcn primitives, all page components, and the CSS layers.

Buttons
- `ui/button.tsx` base uses only `transition-colors`; no press feedback anywhere; focus ring uses `ring-ring` (generic), not the brand ring used on the landing page.
- `CTAButton.tsx` and `SimpleCTA.tsx` use `transition-all` with their own hover treatments; other CTAs (Login, contact forms, NotFound) only shift background colour. Inconsistent.

Links
- Footer, Services, WhyChooseUs, PortfolioTeaser, ContactInfo links all use `transition-colors` colour-only hover. No underline-from-center anywhere. Navbar desktop links differ again (`transition-all` + colour).

Cards
- `ProjectCard.tsx` lifts and shadows on hover; `TeamMemberCard.tsx` only `transition-shadow`; `CompanyValues`, `IndustriesStrip`, `ContactInfo`, admin `Dashboard` tiles have no hover state at all. Inconsistent.

Overlays
- Modals/toasts/dropdowns/sheets use Radix + `tailwindcss-animate` keyframes (already animated, not snapping). `ProjectModal` close button has its own hover.
- Toast close/action buttons have `transition-opacity` only, and focus rings differ from buttons.

Forms and controls
- `input.tsx` / `textarea.tsx` have no `transition-colors` on border; `switch.tsx` thumb has `transition-transform` but track uses `transition-colors` only; `checkbox.tsx` / `radio-group.tsx` have no press or check transition.

Global
- No `prefers-reduced-motion` guard covering app-wide transitions (only hero/accessibility CSS handles it partially).
- No reusable glow utility; `styles/components.css` has an old ad-hoc "button glow" comment block.

Framer Motion is **not** installed. Rather than adding a new animation dependency for modals/toasts, the spec is implemented with the existing Radix `data-state` + `tailwindcss-animate` system, which already gives spring-like scale/fade entrances. Behaviour matches the requested feel (no snapping, ~200–300ms, scale 0.95 → 1, toast slide-up); only the implementation mechanism differs. Say the word if you want the real `framer-motion` dependency added instead.

## Unified Interaction Spec to enforce

Timing: all interaction transitions use `cubic-bezier(0.4, 0, 0.2, 1)`; 150ms for colour-only, 200ms for buttons, 300ms for cards and glow.

Buttons (every variant): `transition-all duration-200`, `active:scale-[0.97]`, brand focus ring (`focus-visible:ring-2` in scarlet with offset), disabled `opacity-50 pointer-events-none`, no hover effect when disabled.

Primary glow: new `.glow-brand` utility built from the existing scarlet token (`0 0 12px 2px` at 25% → `0 0 20px 6px` at 35% on hover). Applied to exactly one CTA per view: Home hero "Start Your Project", Services page CTA, Our Work CTA, About CTA, Contact form submit, Login sign-in, NotFound "Back Home". Never on secondary, ghost, icon, or disabled buttons.

Links: shared `.link-underline` utility — a scarlet pseudo-element scaling from center on hover/focus-visible. Applied to all nav, footer, and inline text links. Existing tap-target sizes (`min-h-11`) stay untouched.

Cards: `transition-all duration-300`, `hover:-translate-y-1`, shadow step up within the existing token scale, and `hover:border-buckeye-scarlet/30` where a border already exists. Transform-only, so no layout shift. Selected/filter-active items get a scaled-down glow.

Nav drawer items: `active:bg-buckeye-gray-100` plus a left scarlet accent border on press — using existing tokens.

Overlays: keep Radix scale/fade for dialogs, slide-up for toasts, fade for overlays; normalise durations to 300ms and align toast/dialog close buttons to the button focus-ring and press rules.

Inputs and controls: inputs get `transition-colors duration-150` with scarlet focus border; switch gets `transition-all duration-200`; checkbox/radio get `active:scale-90` and an opacity-transitioned check icon.

Reduced motion: one global block zeroing transition/animation durations app-wide.

## Files to change

- `src/styles/components.css` — add `.glow-brand`, `.link-underline`, card-hover helper; remove the stale glow comment block.
- `src/styles/base.css` — global timing-function default + `prefers-reduced-motion` guard.
- `src/components/ui/`: `button.tsx`, `input.tsx`, `textarea.tsx`, `switch.tsx`, `checkbox.tsx`, `radio-group.tsx`, `dialog.tsx`, `toast.tsx`, `dropdown-menu.tsx`, `sheet.tsx`, `card.tsx`.
- `src/components/`: `CTAButton.tsx`, `SimpleCTA.tsx`, `Navbar.tsx`, `Footer.tsx`, `ProjectCard.tsx`, `ProjectModal.tsx`, `TeamMemberCard.tsx`, `CompanyValues.tsx`, `IndustriesStrip.tsx`, `ContactInfo.tsx`, `ContactMap.tsx`, `Services.tsx`, `WhyChooseUs.tsx`, `PortfolioTeaser.tsx`, `TestimonialsHome.tsx`, `AccessibilityControls.tsx`, `contact/ContactFormMain.tsx`, `SecureContactForm.tsx`, `SecureQuoteWidget.tsx`.
- `src/pages/`: `Index.tsx`, `Services.tsx`, `OurWork.tsx`, `About.tsx`, `Contact.tsx`, `Login.tsx`, `NotFound.tsx`, `Privacy.tsx`, `Terms.tsx`, `admin/Dashboard.tsx`.

Explicitly untouched: the hero card and its content (`EnhancedHero`, `HeroAnimation*`, fiber components) stay static per your earlier request — the only hero change is adding `.glow-brand` to the single primary CTA, which is a static box-shadow plus hover, no motion.

## Verification

Playwright pass at 375px and 1280px: hover, focus-visible ring uniformity, press scale, no layout shift on hover (transform-only), reduced-motion emulation, and a count confirming exactly one `.glow-brand` element per route.
