# Buckeye DataCom - Fiber Optic Solutions Website

A modern, high-performance website for a fiber optic installation and networking company. Features stunning animated fiber cable visualizations, comprehensive service information, and an intuitive user experience designed to showcase cutting-edge telecommunications solutions.

![Buckeye DataCom](public/lovable-uploads/5abebf68-15fe-4395-a93d-89fa7ac4cc89.png)

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
| **Animations** | Framer Motion, CSS Animations |
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
