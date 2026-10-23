import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
globalThis.window = window;
const { sanitizeInput, sanitizeHTML } = await import("../src/utils/security.ts");
const { optimizeImageUrl } = await import("../src/utils/image-url.ts");

test("sanitization removes nested executable markup while preserving ordinary text", () => {
  assert.equal(sanitizeInput(" subscription javascript consultancy "), "subscription javascript consultancy");
  assert.equal(sanitizeInput("A & B"), "A & B");
  for (const input of ['<img src=x onerror=alert(1)>', '<svg><g onload=alert(1)></g></svg>', '<iframe srcdoc="<script>alert(1)</script>"></iframe>']) {
    const parsed = new JSDOM(sanitizeHTML(input)).window.document;
    assert.equal(parsed.querySelector("script,iframe,svg,[onerror],[onload]"), null);
  }
  assert.equal(sanitizeHTML('<a href="java&#x73;cript:alert(1)">safe</a>'), '<a>safe</a>');
});

test("only the exact Unsplash HTTPS image host receives optimization parameters", () => {
  for (const value of ["https://evilunsplash.com/a", "https://unsplash.com.evil/a", "https://evil/a?unsplash.com", "https://user@images.unsplash.com/a", "/images/a.jpg"]) {
    assert.equal(optimizeImageUrl(value, "fallback", 200), value);
  }
  const result = new URL(optimizeImageUrl("https://images.unsplash.com/a?q=10#image", "fallback", 200));
  assert.equal(result.searchParams.get("q"), "80");
  assert.equal(result.searchParams.get("w"), "200");
  assert.equal(result.hash, "#image");
});

const { getRateLimitIdentity, GLOBAL_RATE_LIMIT_BUCKET } = await import("../supabase/functions/_shared/client-identity.ts");
const { readFileSync } = await import("node:fs");

test("email quota identity ignores caller-supplied x-forwarded-for", () => {
  const trusted = getRateLimitIdentity(new Headers({ "cf-connecting-ip": "203.0.113.7" }));
  assert.equal(trusted, "ip:203.0.113.7");
  for (const spoof of ["198.51.100.1", "10.0.0.1, 203.0.113.7", "attacker-chosen"]) {
    assert.equal(
      getRateLimitIdentity(new Headers({ "x-forwarded-for": spoof, "cf-connecting-ip": "203.0.113.7" })),
      trusted,
    );
  }
  assert.equal(getRateLimitIdentity(new Headers({ "cf-connecting-ip": "2001:DB8::1" })), "ip:2001:db8::1");
});

test("missing or malformed trusted client IP falls back to one global quota bucket", () => {
  for (const headers of [
    {},
    { "x-forwarded-for": "198.51.100.1" },
    { "x-real-ip": "198.51.100.2" },
    { "cf-connecting-ip": "" },
    { "cf-connecting-ip": "not-an-ip" },
    { "cf-connecting-ip": "999.1.1.1" },
  ]) {
    assert.equal(getRateLimitIdentity(new Headers(headers)), GLOBAL_RATE_LIMIT_BUCKET);
  }
});

test("email edge functions derive quota identity only from the shared trusted helper", () => {
  for (const fn of ["send-contact-email", "send-quote-email"]) {
    const source = readFileSync(new URL(`../supabase/functions/${fn}/index.ts`, import.meta.url), "utf8");
    assert.match(source, /getRateLimitIdentity\(req\.headers\)/);
    assert.doesNotMatch(source, /headers\.get\(\s*["']x-forwarded-for/i);
  }
});
