# Testing Guide

Comprehensive testing procedures for the Buckeye DataCom website.

## Table of Contents

1. [Form Submission Testing](#form-submission-testing)
2. [Responsive Layout Testing](#responsive-layout-testing)
3. [Email Delivery Testing](#email-delivery-testing)
4. [Accessibility Testing](#accessibility-testing)
5. [Performance Testing](#performance-testing)
6. [Security Testing](#security-testing)

---

## Form Submission Testing

### Contact Form Tests

#### Valid Submission
- [ ] Fill all required fields (name, email, message)
- [ ] Submit form
- [ ] Verify success toast appears
- [ ] Check database for new `contact_submissions` record
- [ ] Verify user receives confirmation email
- [ ] Verify admin receives notification email

#### Validation Tests
| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Empty name | Leave name blank | "Name must be at least 2 characters" |
| Short name | "A" | "Name must be at least 2 characters" |
| Invalid email | "notanemail" | "Please enter a valid email address" |
| Empty email | Leave email blank | "Email is required" |
| Short message | "Hi" | "Message must be at least 10 characters" |
| Long message | 2001+ characters | "Message must be less than 2000 characters" |
| Invalid phone | "abc" | "Please enter a valid phone number" |

#### Rate Limiting Tests
- [ ] Submit form 5 times rapidly
- [ ] Verify "Too many attempts" message appears
- [ ] Wait 5 seconds between submissions
- [ ] Verify submission succeeds after cooldown

### Quote Widget Tests

#### Price Calculation
| Project Size | Expected Estimate |
|--------------|-------------------|
| 100 sq ft | $250 |
| 1,000 sq ft | $2,500 |
| 10,000 sq ft | $25,000 |
| 100,000 sq ft | $250,000 |

#### File Upload Tests
- [ ] Upload valid PDF (< 5MB) - Success
- [ ] Upload valid JPEG (< 5MB) - Success
- [ ] Upload valid PNG (< 5MB) - Success
- [ ] Upload 6MB file - Error: "File too large"
- [ ] Upload .exe file - Error: "Invalid file type"
- [ ] Upload file with double extension - Error: "Files with multiple extensions are not allowed"

---

## Responsive Layout Testing

### Breakpoints

| Device | Width | Key Elements to Verify |
|--------|-------|------------------------|
| Mobile | 320px | Hamburger menu, stacked layouts, touch targets |
| Mobile | 375px | Standard mobile layout |
| Tablet | 768px | Two-column grids where appropriate |
| Desktop | 1024px | Full navigation, sidebars visible |
| Large Desktop | 1440px | Max-width containers, centered content |

### Page-by-Page Checklist

#### Home Page
- [ ] Hero text readable at all sizes
- [ ] Fiber animation performs well
- [ ] CTA buttons accessible
- [ ] Stats strip stacks on mobile
- [ ] Services grid responsive

#### Services Page
- [ ] Service cards grid properly
- [ ] Images scale correctly
- [ ] Text remains readable

#### Our Work Page
- [ ] Project gallery grid adapts
- [ ] Modal works on mobile
- [ ] Filter buttons wrap on mobile

#### About Page
- [ ] Team member cards stack
- [ ] Timeline displays correctly
- [ ] Values section responsive

#### Contact Page
- [ ] Form usable on mobile
- [ ] Map displays correctly
- [ ] Contact info stacks

---

## Email Delivery Testing

### Prerequisites
1. Resend API key configured
2. Admin email configured
3. Domain verified in Resend

### Test Procedure

#### Contact Form Email
1. Submit contact form with valid data
2. Check user's inbox for confirmation email
3. Check admin inbox for notification email
4. Verify email content matches submission

#### Quote Request Email
1. Submit quote with email address
2. Check user's inbox for quote estimate email
3. Check admin inbox for quote notification
4. Verify price and details are correct

### Email Content Verification
- [ ] Sender displays as "Buckeye DataCom"
- [ ] Subject line is appropriate
- [ ] HTML renders correctly
- [ ] No broken images
- [ ] Links work (if any)
- [ ] Footer displays current year

### Troubleshooting

| Issue | Solution |
|-------|----------|
| No emails received | Check Resend dashboard for errors |
| Emails in spam | Verify domain in Resend |
| Wrong content | Check edge function logs |

---

## Accessibility Testing

### Automated Testing
```bash
# Run Lighthouse accessibility audit
# In Chrome DevTools > Lighthouse > Accessibility
# Target score: 90+
```

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] Tab through entire page
- [ ] Tab order is logical
- [ ] All interactive elements focusable
- [ ] Focus indicators visible
- [ ] Skip link works
- [ ] Escape closes modals
- [ ] Enter/Space activates buttons

#### Screen Reader Testing

Test with NVDA (Windows) or VoiceOver (Mac):
- [ ] Page title announced on load
- [ ] Headings structure makes sense
- [ ] Images have meaningful alt text
- [ ] Forms have proper labels
- [ ] Error messages announced
- [ ] Success messages announced
- [ ] Route changes announced

#### Color Contrast

| Element | Foreground | Background | Ratio Required |
|---------|------------|------------|----------------|
| Body text | #333 | #fff | 4.5:1 ✓ |
| Buckeye Scarlet | #BB0000 | #fff | 5.3:1 ✓ |
| Links | #BB0000 | #fff | 5.3:1 ✓ |
| White on Scarlet | #fff | #BB0000 | 5.3:1 ✓ |

#### Focus Indicators
- [ ] All interactive elements have visible focus
- [ ] Focus ring is at least 2px
- [ ] Focus color has sufficient contrast

---

## Performance Testing

### Lighthouse Scores Target

| Metric | Target |
|--------|--------|
| Performance | 90+ |
| Accessibility | 90+ |
| Best Practices | 90+ |
| SEO | 90+ |

### Core Web Vitals

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |

### Image Optimization Checklist
- [ ] Images lazy loaded
- [ ] WebP format where supported
- [ ] Appropriate sizes for breakpoints
- [ ] Alt tags present

### Animation Performance
- [ ] No jank during scroll
- [ ] Fiber animation smooth (60fps)
- [ ] No layout thrashing
- [ ] Reduced motion respected

---

## Security Testing

### Input Validation

Test these payloads in all form fields:

```
<script>alert('xss')</script>
javascript:alert(1)
"><img src=x onerror=alert(1)>
' OR '1'='1
```

Expected: All should be sanitized or rejected

### Rate Limiting

1. Send 10 rapid requests to contact form
2. Verify rate limit kicks in after 5 attempts
3. Verify 429 status returned from edge function

### Honeypot Fields

1. Inspect form HTML
2. Find hidden honeypot field
3. Fill honeypot and submit
4. Verify submission silently rejected

### CORS

```bash
# Test from different origin
curl -X OPTIONS https://your-project.supabase.co/functions/v1/send-contact-email \
  -H "Origin: https://evil.com" \
  -H "Access-Control-Request-Method: POST"
```

### RLS Policies

Verify in Supabase:
- [ ] `contact_submissions` - Public can INSERT, only admin can SELECT
- [ ] `quote_requests` - Public can INSERT, only admin can SELECT
- [ ] `projects` - Public can SELECT published, only admin can modify
- [ ] `team_members` - Public can SELECT published, only admin can modify
- [ ] `testimonials` - Public can SELECT published, only admin can modify

---

## Health Check Testing

### Endpoint
```bash
curl https://jejwgmqscdbvdpmygjde.supabase.co/functions/v1/health-check
```

### Expected Response
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "services": {
    "database": { "status": "connected", "latency": 50 },
    "email": { "status": "configured", "configured": true }
  },
  "uptime": 3600
}
```

### Status Codes
| Status | Meaning |
|--------|---------|
| 200 | All services healthy |
| 200 (degraded) | Some services have issues |
| 503 | System unhealthy |

---

## Continuous Testing

### Before Each Deploy
1. Run Lighthouse audit
2. Test forms on staging
3. Verify email delivery
4. Check responsive layouts

### Weekly
1. Full accessibility audit
2. Security scan
3. Performance monitoring review

### Monthly
1. Full regression test
2. Cross-browser testing
3. Mobile device testing
