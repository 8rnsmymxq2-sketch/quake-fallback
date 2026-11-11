/* global process, console, fetch, URL, AbortSignal */
// Dependency-free check: fails unless the site's snapshot was refreshed within 180 seconds without error.
const STALE_AFTER_MS = 180_000;

export function checkSnapshot(body, now) {
  if (!body || typeof body !== "object" || body.schema !== 1) return { ok: false, reason: "invalid-snapshot" };
  if (body.lastError !== null) return { ok: false, reason: "fetch-failed" };
  const last = Date.parse(body.lastSuccessAt ?? "");
  if (Number.isNaN(last)) return { ok: false, reason: "never-succeeded" };
  if (now - last > STALE_AFTER_MS) return { ok: false, reason: "stale" };
  return { ok: true, reason: "fresh" };
}

async function main() {
  const base = process.env.SITE_URL;
  if (!base) { console.log("SITE_URL not set; nothing to check"); return; }
  if (!/^https:\/\/[a-z0-9.-]+\/?$/i.test(base)) throw new Error("SITE_URL must be an https origin");
  let result;
  try {
    const response = await fetch(new URL("/data/quake-feed.json", base), { signal: AbortSignal.timeout(15_000), redirect: "error" });
    result = response.ok ? checkSnapshot(await response.json(), Date.now()) : { ok: false, reason: `http-${response.status}` };
  } catch {
    result = { ok: false, reason: "unreachable" };
  }
  console.log(JSON.stringify(result));
  if (!result.ok) process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
