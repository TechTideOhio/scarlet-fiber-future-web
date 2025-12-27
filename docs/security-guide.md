# Security Guide

Comprehensive security documentation for the Buckeye DataCom website.

## Table of Contents

1. [Security Overview](#security-overview)
2. [Input Validation](#input-validation)
3. [Rate Limiting](#rate-limiting)
4. [Row Level Security (RLS)](#row-level-security-rls)
5. [Edge Function Security](#edge-function-security)
6. [Bot Protection](#bot-protection)
7. [Security Headers](#security-headers)
8. [Incident Response](#incident-response)

---

## Security Overview

### Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Input       │  │ Rate Limit  │  │ Honeypot Detection  │  │
│  │ Sanitization│  │ (Client)    │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    EDGE FUNCTIONS                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Zod Schema  │  │ Rate Limit  │  │ Error Sanitization  │  │
│  │ Validation  │  │ (Server)    │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  RLS POLICIES                        │    │
│  │  • Role-based access control                        │    │
│  │  • Public INSERT on submissions                     │    │
│  │  • Admin-only SELECT/UPDATE/DELETE                  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Input Validation

### Frontend Validation

All user inputs are validated on the frontend using:

```typescript
// src/utils/security.ts
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '')           // Remove angle brackets
    .replace(/javascript:/gi, '')   // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '')     // Remove event handlers
    .replace(/script/gi, 'blocked') // Replace script tags
    .replace(/iframe/gi, 'blocked') // Replace iframe tags
    .replace(/object/gi, 'blocked') // Replace object tags
    .replace(/embed/gi, 'blocked'); // Replace embed tags
};
```

### Backend Validation (Edge Functions)

All edge functions use Zod schemas for validation:

```typescript
// Contact email schema
const contactEmailSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(254).trim().toLowerCase(),
  phone: z.string().max(20).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  message: z.string().min(10).max(2000).trim(),
});
```

### Validation Rules

| Field | Validation Rules |
|-------|------------------|
| Name | 2-100 characters, trimmed |
| Email | Valid email, max 254 chars, lowercase |
| Phone | Max 20 characters, numeric with formatting |
| Company | Max 100 characters |
| Message | 10-2000 characters |
| Project Size | 100-1,000,000 sq ft |

---

## Rate Limiting

### Frontend Rate Limiting

```typescript
// 5 second cooldown between submissions
if (now - lastSubmitTime < 5000) {
  toast({ title: "Please wait", variant: "destructive" });
  return;
}

// 5 attempts maximum
if (submitAttempts >= 5) {
  toast({ title: "Too many attempts", variant: "destructive" });
  return;
}
```

### Backend Rate Limiting

Edge functions implement IP-based rate limiting:

```typescript
const RATE_LIMIT = 5;  // requests per window
const RATE_WINDOW = 60 * 1000;  // 1 minute

// Returns X-RateLimit headers:
// X-RateLimit-Limit: 5
// X-RateLimit-Remaining: 3
// X-RateLimit-Reset: 45
```

### Rate Limit Responses

| Status | Meaning |
|--------|---------|
| 200 | Request successful |
| 429 | Rate limit exceeded |

---

## Row Level Security (RLS)

### Policy Overview

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `contact_submissions` | Admin only | Public | Admin only | Admin only |
| `quote_requests` | Admin only | Public | Admin only | Admin only |
| `projects` | Public (published) | Admin only | Admin only | Admin only |
| `team_members` | Public (published) | Admin only | Admin only | Admin only |
| `testimonials` | Public (published) | Admin only | Admin only | Admin only |
| `user_roles` | Self only | Admin only | Admin only | Admin only |

### Role-Based Access

```sql
-- Admin check function (security definer to prevent recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Example admin-only policy
CREATE POLICY "Admin select" ON public.contact_submissions
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
```

### Important Security Notes

1. **Never store roles in the users/profiles table** - Use a separate `user_roles` table
2. **Use security definer functions** - Prevents RLS recursion issues
3. **Always use auth.uid()** - Never trust client-provided user IDs

---

## Edge Function Security

### CORS Configuration

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
```

### Error Handling

Never expose internal errors to clients:

```typescript
catch (error: any) {
  console.error("Internal error:", error); // Log for debugging
  return new Response(
    JSON.stringify({ error: "An error occurred" }), // Generic message to client
    { status: 500 }
  );
}
```

### Environment Variables

| Variable | Description | Access Level |
|----------|-------------|--------------|
| `SUPABASE_URL` | Supabase project URL | Auto-configured |
| `SUPABASE_ANON_KEY` | Anonymous key | Auto-configured |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | Auto-configured |
| `RESEND_API_KEY` | Email API key | Secret |
| `ADMIN_EMAIL` | Admin notification email | Secret |

---

## Bot Protection

### Honeypot Fields

Hidden form fields that bots fill but humans don't see:

```tsx
{/* Honeypot field - hidden from real users */}
<div className="absolute -left-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
  <input
    type="text"
    name="website"
    value={honeypot}
    onChange={(e) => setHoneypot(e.target.value)}
    tabIndex={-1}
    autoComplete="off"
  />
</div>
```

### How It Works

1. Field is visually hidden (off-screen, opacity 0)
2. Has `aria-hidden="true"` for screen readers
3. Has `tabIndex={-1}` to skip in tab order
4. If filled, submission is silently rejected
5. Fake success shown to not alert bots

### File Upload Security

```typescript
// Allowed file types
const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

// Suspicious extension check
const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js', '.jar'];

// Double extension check (e.g., file.pdf.exe)
const extensionCount = (fileName.match(/\./g) || []).length;
if (extensionCount > 1) {
  reject("Files with multiple extensions are not allowed");
}
```

---

## Security Headers

### Recommended Headers

Add to your deployment configuration:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### HTTPS

All traffic should be served over HTTPS. Lovable handles this automatically for published apps.

---

## Incident Response

### Security Issue Detected

1. **Identify** - Determine the scope and nature of the issue
2. **Contain** - Disable affected functionality if necessary
3. **Investigate** - Review logs and database for impact
4. **Remediate** - Apply fixes and patches
5. **Document** - Record incident and resolution

### Monitoring

Check regularly:
- Edge function logs for errors
- Database for unusual patterns
- Rate limit hits
- Failed validation attempts

### Log Locations

| Log Type | Location |
|----------|----------|
| Edge Function Logs | Supabase Dashboard > Edge Functions |
| Database Logs | Supabase Dashboard > Logs |
| Auth Logs | Supabase Dashboard > Authentication |
| Client Errors | Browser Console |

### Emergency Contacts

Document your security contacts and escalation procedures here.

---

## Security Checklist

### Before Launch

- [ ] All RLS policies enabled and tested
- [ ] Input validation on frontend AND backend
- [ ] Rate limiting configured
- [ ] Honeypot fields active
- [ ] Error messages don't leak internal info
- [ ] HTTPS enforced
- [ ] Secrets not in code
- [ ] Admin access properly restricted

### Weekly Review

- [ ] Check edge function error logs
- [ ] Review rate limit hits
- [ ] Monitor for unusual database activity
- [ ] Verify RLS policies still active
- [ ] Check for dependency updates

### After Security Incident

- [ ] Document the incident
- [ ] Identify root cause
- [ ] Implement fix
- [ ] Verify fix works
- [ ] Update monitoring if needed
- [ ] Notify affected users if required
