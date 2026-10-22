# Buckeye DataCom - Fiber Optic Solutions Website

A modern, high-performance website for a fiber optic installation and networking company. Features stunning animated fiber cable visualizations, comprehensive service information, and an intuitive user experience designed to showcase cutting-edge telecommunications solutions.

![Buckeye DataCom](public/lovable-uploads/5abebf68-15fe-4395-a93d-89fa7ac4cc89.png)

## Why this exists

**What it does.** Serves the public marketing site for Buckeye DataCom, an Ohio fiber-optic cabling and network infrastructure contractor: service pages, a project gallery, team and testimonial sections, and contact and quote-request forms. Form input is validated with Zod and sanitized with DOMPurify (`src/utils/security.ts`), submissions are stored in Supabase, and confirmation email is sent through Resend from the edge functions under `supabase/functions/`. The site is a Vite 8, React 18, TypeScript, Tailwind CSS, and shadcn/ui build that installs as a Progressive Web App.

**Who it serves.** Prospective customers in Ohio who need structured cabling, fiber installation, or network infrastructure work and want to request a quote, and the Buckeye DataCom staff who review submissions through the admin area described in [docs/admin-guide.md](docs/admin-guide.md).

**Why Alex built it.** The history begins on 2025-04-18 with Lovable-generated commits (`00bea3e`: "Use tech stack vite_react_shadcn_ts", then `08bd4a0`: "Implement the initial design for the marketing site, including color palette and calls to action"); the GitHub repository was created on 2025-06-01 and the Lovable build commits run through 2026-08-11. On 2026-10-19 Alex Cinovoj (Founder & CTO, TechTide AI · CTO & Co-Founder, CPG Playbook) took the repository through a security pass: dependency refresh plus hosted typecheck and build checks (`cf6b93e`, PR #1), parser-based HTML sanitization and image-origin validation in response to CodeQL findings (`090c33f`, PR #2), and React Router and postcss-selector-parser patches (`1cfca54`, PR #3). Rationale not recorded in repository history; see Proposed use case below.

**Real-world use case (2025-2026 evidence).** **Proposed use case.** A regional fiber and structured-cabling contractor publishes an installable marketing site and collects quote requests without operating its own server. The production bundle is built by Vite 8 (`vite` 8.3.4 in `package.json`), which ships Rolldown as its single Rust-based bundler[^1]; every form field passes through DOMPurify, whose 3.4.x line this repository tracks (3.4.17 released 2026-10-12)[^2]; the quote and contact handlers run as Supabase Edge Functions, server-side TypeScript functions on Deno that Supabase distributes globally behind a gateway that validates JWTs[^3]; and client routing uses React Router 7.18.4, released 2026-09-15 and adopted here in PR #3[^4]. What this repository verifies: the sanitization and image-origin checks run in CI on every push (`tests/security.test.mjs`, `.github/workflows/ci.yml`), the deployment target is declared in `supabase/config.toml` and `index.html` (canonical `https://buckeyedatacom.lovable.app/`), and Zod validation, rate limiting, and a honeypot field exist in the handlers and form components. What it does not verify: production quote volume or any customer outcome, which is why the scenario is labeled proposed.

[^1]: Vite team, "Vite 8.0 is out!", <https://vite.dev/blog/announcing-vite8>, published 2026-03-12.
[^2]: cure53/DOMPurify, release 3.4.17, <https://github.com/cure53/DOMPurify/releases/tag/3.4.17>, published 2026-10-12.
[^3]: Supabase, "Edge Functions" documentation, <https://supabase.com/docs/guides/functions>, page dated 2026-10-21 (accessed 2026-10-21).
[^4]: remix-run/react-router, release v7.18.4, <https://github.com/remix-run/react-router/releases/tag/react-router%407.18.4>, published 2026-09-15.

## 🚀 Features

- **Animated Hero Section** - Stunning fiber optic cable animations using CSS/SVG
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop
- **PWA Support** - Installable as a Progressive Web App with offline capabilities
- **Contact Forms** - Secure contact and quote request forms with validation
- **Email Notifications** - Automated email confirmations via Resend
- **Project Gallery** - Showcase of completed fiber optic installations
- **Team Section** - Dynamic team member display
- **Testimonials** - Customer testimonials carousel
- **Accessibility** - WCAG 2.1 AA compliant with skip links, ARIA labels, and keyboard navigation

## 🛠 Technologies Used

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, Shadcn/UI |
| **Backend** | Supabase (Database, Auth, Edge Functions) |
| **Email** | Resend |
| **Animations** | CSS and SVG animations |
| **3D Graphics** | Three.js (optional WebGL effects) |

## 📋 Prerequisites

- Node.js 18+ or Bun
- Supabase account (via Lovable Cloud)
- Resend account for email functionality

## 🔧 Environment Variables

The following environment variables are automatically configured by Lovable Cloud:

```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
VITE_SUPABASE_PROJECT_ID=<your-project-id>
```

### Edge Function Secrets

Configure these in the Lovable Cloud secrets manager:

| Secret | Description | Required |
|--------|-------------|----------|
| `RESEND_API_KEY` | Resend API key for email sending | Yes |
| `ADMIN_EMAIL` | Email address for admin notifications | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (auto-configured) | Auto |

## 🚀 Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Using Bun

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

## 📁 Project Structure

```
├── docs/                    # Documentation
│   ├── admin-guide.md       # Admin usage guide
│   ├── api-documentation.md # API reference
│   ├── design-tokens.md     # Design system docs
│   ├── security-guide.md    # Security documentation
│   └── testing-guide.md     # Testing procedures
├── public/                  # Static assets
│   ├── manifest.json        # PWA manifest
│   ├── offline.html         # Offline fallback
│   ├── robots.txt           # SEO robots file
│   └── sw.js                # Service worker
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # Shadcn/UI components
│   │   ├── contact/         # Contact form components
│   │   └── fiber/           # Fiber animation components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   ├── pages/               # Page components
│   ├── styles/              # Global styles
│   └── utils/               # Utility functions
├── supabase/
│   ├── config.toml          # Supabase configuration
│   └── functions/           # Edge functions
│       ├── health-check/    # System health endpoint
│       ├── send-contact-email/
│       ├── send-quote-email/
│       └── sitemap/
└── tailwind.config.ts       # Tailwind configuration
```

## 🔐 Security Features

- **Input Validation** - Zod schema validation on frontend and backend
- **XSS Prevention** - Input sanitization for all user inputs
- **Rate Limiting** - Frontend and backend rate limiting
- **Honeypot Fields** - Bot detection on all forms
- **RLS Policies** - Row Level Security on all database tables
- **CORS Headers** - Proper CORS configuration on edge functions

See [Security Guide](docs/security-guide.md) for detailed security documentation.

### Known advisories

- `braces` 3.0.3, [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) (stack-exhaustion denial of service through deeply nested patterns): known upstream advisory with no fixed release as of 2026-10-20. It enters `package-lock.json` only through `tailwindcss` 3.4 (`chokidar` and `micromatch`), which runs at build time and is not part of the browser bundle. A local backport now bounds parser and recursive AST depth, using the same source-preserving patch maintained in Open-SEO-Clawli. npm overrides select the patched tarball for every consumer, and builds verify file hashes and security regressions before compiling. Run `npm run security:backport` independently. See [backport provenance](vendor/braces/BACKPORT.md). The upstream version remains 3.0.3, so version-based scanners may continue reporting the advisory; the Dependabot alert is left open rather than dismissed. Dependency, secret, and CodeQL scanning are enabled for the repository.

## 📧 Email Configuration

1. Create a Resend account at [resend.com](https://resend.com)
2. Verify your domain at [resend.com/domains](https://resend.com/domains)
3. Create an API key at [resend.com/api-keys](https://resend.com/api-keys)
4. Add the API key to Lovable Cloud secrets as `RESEND_API_KEY`
5. Add your admin email as `ADMIN_EMAIL`

## 🧪 Testing

See [Testing Guide](docs/testing-guide.md) for comprehensive testing procedures including:

- Form submission testing
- Responsive layout verification
- Accessibility testing
- Email delivery testing
- Performance benchmarks

### Automated checks

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every push to `main` and every pull request:

```bash
npm ci --ignore-scripts
npx tsc --noEmit -p tsconfig.app.json
node --experimental-strip-types --test tests/security.test.mjs
npm run build
```

`npm run lint` is available but is not a CI gate; it reports 33 pre-existing errors as of PR #1.

## 📚 Documentation

- [Admin Guide](docs/admin-guide.md) - How to manage content
- [API Documentation](docs/api-documentation.md) - Edge function reference
- [Security Guide](docs/security-guide.md) - Security configuration
- [Design Tokens](docs/design-tokens.md) - Design system reference
- [Testing Guide](docs/testing-guide.md) - Testing procedures

## 🎨 Design System

This project uses a comprehensive design token system. See [Design Token Documentation](docs/design-tokens.md) for details on:

- Color palette (Buckeye Scarlet, Gray, Silver)
- Typography (Space Grotesk, Inter)
- Spacing and layout tokens
- Animation tokens

## 🌐 Deployment

The project is deployed automatically via Lovable. To deploy:

1. Click the "Publish" button in Lovable
2. Frontend changes require clicking "Update" in the publish dialog
3. Backend changes (edge functions, migrations) deploy immediately

### Custom Domain

1. Navigate to Project > Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed

## 📈 Analytics

The project includes built-in analytics tracking for:

- Form submissions and errors
- Quote calculations
- Page views and user interactions
- File uploads

## 🔄 PWA Features

- **Installable** - Add to home screen on mobile/desktop
- **Offline Support** - Basic offline functionality
- **Cache Strategy** - Intelligent caching for static assets

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit via Lovable

## 📄 License

Proprietary - Buckeye DataCom. All rights reserved.

## 🆘 Support

For issues or questions:

- Check the [documentation](docs/)
- Review the [Testing Guide](docs/testing-guide.md)
- Contact the development team

---

Built with ❤️ using [Lovable](https://lovable.dev)
