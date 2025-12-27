# API Documentation

Reference documentation for Buckeye DataCom edge functions and endpoints.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
   - [Contact Email](#send-contact-email)
   - [Quote Email](#send-quote-email)
   - [Health Check](#health-check)
   - [Sitemap](#sitemap)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)

---

## Overview

### Base URL

```
https://jejwgmqscdbvdpmygjde.supabase.co/functions/v1
```

### Common Headers

All requests should include:

```http
Content-Type: application/json
```

### CORS

All endpoints support CORS with the following headers:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type
```

---

## Authentication

### Public Endpoints

These endpoints do not require authentication:

- `POST /send-contact-email`
- `POST /send-quote-email`
- `GET /health-check`
- `GET /sitemap`

All public endpoints have `verify_jwt = false` in the configuration.

### Authenticated Endpoints

Future admin endpoints will require JWT authentication:

```http
Authorization: Bearer <jwt_token>
```

---

## Endpoints

### Send Contact Email

Send confirmation and notification emails for contact form submissions.

**Endpoint:** `POST /send-contact-email`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-123-4567",
  "company": "ACME Corp",
  "message": "I'm interested in fiber optic installation for our new office building."
}
```

**Field Validation:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | Yes | 2-100 characters |
| `email` | string | Yes | Valid email, max 254 chars |
| `phone` | string | No | Max 20 characters |
| `company` | string | No | Max 100 characters |
| `message` | string | Yes | 10-2000 characters |

**Success Response (200):**

```json
{
  "success": true
}
```

**Validation Error (400):**

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "email", "message": "Invalid email address" },
    { "field": "message", "message": "Message must be at least 10 characters" }
  ]
}
```

**Rate Limit Error (429):**

```json
{
  "error": "Too many requests. Please try again later."
}
```

**Response Headers:**

```http
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 45
```

---

### Send Quote Email

Send confirmation and notification emails for quote requests.

**Endpoint:** `POST /send-quote-email`

**Request Body:**

```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "phone": "+1-555-987-6543",
  "projectType": "Commercial",
  "projectSize": 5000,
  "estimatedPrice": 12500,
  "fileName": "floorplan.pdf",
  "notes": "We need installation completed by Q2"
}
```

**Field Validation:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | No | Max 100 characters |
| `email` | string | No | Valid email, max 254 chars |
| `phone` | string | No | Max 20 characters |
| `projectType` | string | No | Max 100 characters |
| `projectSize` | number | Yes | 100-1,000,000 |
| `estimatedPrice` | number | Yes | 0-2,500,000 |
| `fileName` | string | No | Max 255 characters |
| `notes` | string | No | Max 500 characters |

**Success Response (200):**

```json
{
  "success": true
}
```

**Error Responses:** Same as contact email endpoint.

---

### Health Check

Check system health and service status.

**Endpoint:** `GET /health-check`

**Success Response (200):**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "services": {
    "database": {
      "status": "connected",
      "latency": 45
    },
    "email": {
      "status": "configured",
      "configured": true
    }
  },
  "uptime": 86400
}
```

**Degraded Response (200):**

```json
{
  "status": "degraded",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "services": {
    "database": {
      "status": "connected",
      "latency": 45
    },
    "email": {
      "status": "not_configured",
      "configured": false
    }
  },
  "uptime": 86400
}
```

**Unhealthy Response (503):**

```json
{
  "status": "unhealthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "services": {
    "database": {
      "status": "error"
    },
    "email": {
      "status": "unknown",
      "configured": false
    }
  },
  "uptime": 0
}
```

**Status Meanings:**

| Status | HTTP Code | Description |
|--------|-----------|-------------|
| `healthy` | 200 | All services operational |
| `degraded` | 200 | Some services have issues |
| `unhealthy` | 503 | Critical services down |

**Response Headers:**

```http
Cache-Control: no-cache, no-store, must-revalidate
```

---

### Sitemap

Generate XML sitemap for SEO.

**Endpoint:** `GET /sitemap`

**Response:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://buckeye-datacom.com/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Additional URLs -->
</urlset>
```

**Content Type:**

```http
Content-Type: application/xml
```

---

## Error Handling

### Error Response Format

```json
{
  "error": "Error message",
  "details": [
    {
      "field": "fieldName",
      "message": "Specific error message"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Validation error |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
| 503 | Service unavailable |

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Validation failed" | Invalid input | Check field requirements |
| "Too many requests" | Rate limit hit | Wait and retry |
| "An error occurred" | Internal error | Check logs |

---

## Rate Limiting

### Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/send-contact-email` | 5 requests | 1 minute |
| `/send-quote-email` | 10 requests | 1 minute |
| `/health-check` | No limit | - |
| `/sitemap` | No limit | - |

### Rate Limit Headers

All rate-limited endpoints return these headers:

```http
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 45
```

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests per window |
| `X-RateLimit-Remaining` | Requests remaining in window |
| `X-RateLimit-Reset` | Seconds until window resets |

### Rate Limit Exceeded

When rate limit is exceeded:

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 30

{
  "error": "Too many requests. Please try again later."
}
```

---

## Code Examples

### JavaScript/TypeScript (using Supabase client)

```typescript
import { supabase } from '@/integrations/supabase/client';

// Send contact email
const { data, error } = await supabase.functions.invoke('send-contact-email', {
  body: {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, I need a quote.',
  },
});

if (error) {
  console.error('Error:', error);
}
```

### cURL

```bash
# Send contact email
curl -X POST \
  'https://jejwgmqscdbvdpmygjde.supabase.co/functions/v1/send-contact-email' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, I need a quote for my project."
  }'

# Check health
curl 'https://jejwgmqscdbvdpmygjde.supabase.co/functions/v1/health-check'
```

### Python

```python
import requests

response = requests.post(
    'https://jejwgmqscdbvdpmygjde.supabase.co/functions/v1/send-contact-email',
    json={
        'name': 'John Doe',
        'email': 'john@example.com',
        'message': 'Hello, I need a quote.'
    }
)

print(response.json())
```

---

## Changelog

### v1.0.0

- Initial release
- Contact email endpoint with Zod validation
- Quote email endpoint with Zod validation
- Health check endpoint
- Sitemap endpoint
- Rate limiting on all email endpoints
