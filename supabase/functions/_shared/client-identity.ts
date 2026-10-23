// Derives the rate-limit identity for an edge function request.
//
// Supabase Edge Functions are served behind Cloudflare, which overwrites
// `cf-connecting-ip` with the address of the connecting client. Callers can
// prepend arbitrary values to `x-forwarded-for`, so that header (and its
// leftmost entry in particular) is never used as a quota key.
//
// When the trusted header is missing or malformed, every such request shares a
// single global bucket so that stripping the header cannot mint fresh quotas.

export const TRUSTED_CLIENT_IP_HEADER = "cf-connecting-ip";
export const GLOBAL_RATE_LIMIT_BUCKET = "global";

const IPV4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
const IPV6 = /^[0-9a-f:.]{2,45}$/i;

function isIpAddress(value: string): boolean {
  if (IPV4.test(value)) return true;
  return value.includes(":") && IPV6.test(value);
}

export function getRateLimitIdentity(headers: Headers): string {
  const raw = headers.get(TRUSTED_CLIENT_IP_HEADER)?.trim();
  if (raw && isIpAddress(raw)) {
    return `ip:${raw.toLowerCase()}`;
  }
  return GLOBAL_RATE_LIMIT_BUCKET;
}
