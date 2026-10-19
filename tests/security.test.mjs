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
