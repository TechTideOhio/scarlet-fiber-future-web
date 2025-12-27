# Admin Guide

Guide for managing the Buckeye DataCom website content and submissions.

## Table of Contents

1. [Overview](#overview)
2. [Managing Contact Submissions](#managing-contact-submissions)
3. [Managing Quote Requests](#managing-quote-requests)
4. [Managing Projects](#managing-projects)
5. [Managing Team Members](#managing-team-members)
6. [Managing Testimonials](#managing-testimonials)
7. [User Role Management](#user-role-management)

---

## Overview

### Accessing the Backend

All data management is done through the Lovable Cloud interface. Access it by clicking "View Backend" in the Lovable editor or using the Cloud tab.

### Data Structure

| Table | Purpose | Public Access |
|-------|---------|---------------|
| `contact_submissions` | Contact form submissions | Insert only |
| `quote_requests` | Quote calculator submissions | Insert only |
| `projects` | Portfolio projects | Read (published) |
| `team_members` | Team member profiles | Read (published) |
| `testimonials` | Customer testimonials | Read (published) |
| `user_roles` | Admin role assignments | None |

---

## Managing Contact Submissions

### Viewing Submissions

1. Open Lovable Cloud > Database
2. Select `contact_submissions` table
3. View all submissions with filters available

### Submission Fields

| Field | Description |
|-------|-------------|
| `id` | Unique identifier (UUID) |
| `name` | Submitter's name |
| `email` | Submitter's email |
| `phone` | Phone number (optional) |
| `company` | Company name (optional) |
| `message` | Contact message |
| `status` | new, read, replied, archived |
| `admin_notes` | Internal notes |
| `created_at` | Submission timestamp |
| `updated_at` | Last update timestamp |

### Status Workflow

```
new → read → replied → archived
         ↘     ↗
          archived
```

1. **new** - Fresh submission, needs attention
2. **read** - Admin has viewed
3. **replied** - Response sent to customer
4. **archived** - Completed/closed

### Updating Submissions

1. Click on a submission row
2. Update `status` field as needed
3. Add `admin_notes` for internal tracking
4. Save changes

---

## Managing Quote Requests

### Viewing Quotes

1. Open Lovable Cloud > Database
2. Select `quote_requests` table
3. Sort by `estimated_price` to see largest opportunities

### Quote Fields

| Field | Description |
|-------|-------------|
| `id` | Unique identifier |
| `name` | Requester's name |
| `email` | Requester's email |
| `phone` | Phone number |
| `company` | Company name |
| `project_type` | Type of project |
| `project_size` | Size in sq ft |
| `estimated_price` | Calculated estimate |
| `file_name` | Uploaded floor plan name |
| `additional_notes` | Customer notes |
| `status` | Workflow status |
| `admin_notes` | Internal notes |

### Quote Workflow

1. Review new quote requests daily
2. Contact customer within 24 hours
3. Schedule site visit if needed
4. Provide detailed quote
5. Update status and notes

---

## Managing Projects

### Adding a New Project

1. Open `projects` table
2. Click "Insert Row"
3. Fill required fields:

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Project name |
| `slug` | Yes | URL-friendly identifier (e.g., "office-building-fiber") |
| `description` | Yes | Short description |
| `type` | Yes | Project category |
| `image_url` | No | Main project image URL |
| `industry` | No | Industry category |
| `details` | No | Full project description |
| `features` | No | Array of feature strings |
| `display_order` | No | Sort order (lower = first) |
| `status` | Yes | draft, published, archived |

### Project Status

| Status | Visibility |
|--------|------------|
| `draft` | Not visible on website |
| `published` | Visible on website |
| `archived` | Not visible, kept for records |

### Image Guidelines

- Use high-quality images (1200x800 minimum)
- Optimize for web (compress to < 500KB)
- Use descriptive filenames
- Host on Supabase Storage or external CDN

### Reordering Projects

Update `display_order` field:
- Lower numbers appear first
- Use increments of 10 for easy reordering

---

## Managing Team Members

### Adding Team Members

1. Open `team_members` table
2. Insert new row with:

| Field | Description |
|-------|-------------|
| `name` | Full name |
| `role` | Job title |
| `bio` | Brief biography |
| `image_url` | Profile photo URL |
| `email` | Contact email |
| `linkedin_url` | LinkedIn profile URL |
| `display_order` | Sort order |
| `is_published` | Show on website |

### Profile Photo Guidelines

- Square aspect ratio (400x400 minimum)
- Professional headshot
- Consistent style across team
- WebP or JPEG format

### Visibility

Set `is_published` to:
- `true` - Visible on website
- `false` - Hidden from website

---

## Managing Testimonials

### Adding Testimonials

| Field | Description |
|-------|-------------|
| `name` | Customer name |
| `quote` | Testimonial text |
| `company` | Customer's company |
| `position` | Customer's job title |
| `image_url` | Customer photo (optional) |
| `rating` | 1-5 star rating |
| `is_featured` | Show in featured section |
| `is_published` | Visible on website |
| `display_order` | Sort order |

### Best Practices

- Get written permission before publishing
- Use real names and companies when possible
- Feature diverse industries
- Update regularly with fresh testimonials

---

## User Role Management

### Role Types

| Role | Permissions |
|------|-------------|
| `user` | Basic access (not used currently) |
| `moderator` | Content management |
| `admin` | Full access |

### Adding an Admin

1. User must have an account (auth.users)
2. Open `user_roles` table
3. Insert new row:
   - `user_id`: The user's UUID from auth.users
   - `role`: `admin`

### Security Notes

⚠️ **Important Security Rules:**

1. Never check admin status on the client side
2. Never use localStorage for authentication
3. Always verify roles server-side via RLS
4. Use the `has_role()` function for policy checks
5. Roles must be in `user_roles` table, not profiles

### Removing Admin Access

1. Find the user in `user_roles` table
2. Delete their admin role row
3. They will immediately lose admin access

---

## Email Notifications

### Admin Emails

Admins receive email notifications for:
- New contact form submissions
- New quote requests

Configure `ADMIN_EMAIL` secret to receive these.

### Email Troubleshooting

| Issue | Solution |
|-------|----------|
| No emails | Check RESEND_API_KEY secret |
| Spam folder | Verify domain in Resend |
| Wrong recipient | Check ADMIN_EMAIL secret |

---

## Data Export

### Exporting Data

1. Open the relevant table
2. Click the export button
3. Choose format (CSV/JSON)
4. Download file

### Backup Recommendations

- Export submissions weekly
- Keep backups in secure location
- Document export procedures

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Can't see data | Check your admin role is set |
| Can't edit | Verify RLS policies allow your role |
| Changes not saving | Check for validation errors |
| Slow queries | Add database indexes |

### Getting Help

1. Check edge function logs for errors
2. Review database logs
3. Test with browser dev tools
4. Contact development team
