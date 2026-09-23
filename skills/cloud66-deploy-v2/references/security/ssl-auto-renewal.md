# SSL auto-renewal


## Overview

Cloud 66 automatically renews Let's Encrypt certificates (both [standard and wildcard](../security/ssl.md)) before they expire. Most of the time you don't need to do anything — but when an auto-renewal misses, knowing the schedule, the manual force-renewal trick, and the common DNS-01 failure modes lets you fix it before your cert actually lapses.

This page covers:

- [When auto-renewal runs](#renewal-schedule)
- [Forcing an immediate renewal attempt](#forcing-a-renewal)
- [DNS-01 and Cloudflare-specific failures](#dns-01-and-cloudflare-troubleshooting)

Standard (non-wildcard) certificates validate over the **HTTP-01** challenge; wildcard certificates use **DNS-01**, which is what this page's troubleshooting section covers. For certificate setup see [Adding SSL certificates](../security/ssl.md); for HTTP-01 problems see [Troubleshooting SSL certificates](../security/troubleshooting-ssl.md). If your standard certificate sits behind a Cloudflare proxy, see [Configuring Let's Encrypt with Cloudflare](../security/ssl.md#configuring-lets-encrypt-with-cloudflare) — the orange-cloud proxy affects HTTP-01, not the DNS-01 flow below.

## Renewal schedule

Cloud 66's renewal scheduler runs **twice a week — Mondays and Thursdays at 14:00 UTC** — and attempts to renew any certificate whose expiry is **within 30 days**.

What this means in practice:

- The first renewal attempt happens 30 days before expiry, on the next Monday or Thursday at 14:00 UTC.
- If that attempt fails (e.g. transient DNS issue, upstream Let's Encrypt error), the scheduler retries on the next scheduled run.
- With twice-weekly runs over a 30-day window, that's up to roughly 8 scheduled attempts before the cert actually expires — but that only helps if the underlying problem (DNS, Cloudflare proxy, account scope) is fixed in between.

The 14:00 schedule is UTC year-round (it doesn't shift with daylight saving). If you're monitoring renewals from your dashboard, expect renewal activity in the timeline during those windows.

## Forcing a renewal

If you've fixed an upstream issue (e.g. removed a Cloudflare proxy, updated a DNS provider credential) and don't want to wait until the next Mon/Thu run, you can trigger an immediate renewal attempt:

1. Open your application in your [Cloud 66 Dashboard](https://app.cloud66.com/)
2. Click *Web* → *SSL Certificate* in the left-hand nav
3. Click the existing certificate to open its configuration
4. Make a no-op change (e.g. toggle SSL termination off and back on, or re-save the same domain list)
5. Click *Update*

1. Open your application in your [Cloud 66 Dashboard](https://app.cloud66.com/)
2. Click *Application* → *SSL Certificate* in the left-hand nav
3. Click the existing certificate to open its configuration
4. Make a no-op change (e.g. toggle SSL termination off and back on, or re-save the same domain list)
5. Click *Update*

Updating the certificate configuration kicks off a fresh renewal attempt outside the scheduled window. Watch the timeline for the outcome.

Let's Encrypt enforces [rate limits](https://letsencrypt.org/docs/rate-limits/) per registered domain. Avoid repeated force-renewals on the same domain in a short window; you can be locked out of issuance for up to a week.

## DNS-01 and Cloudflare troubleshooting

[Wildcard certificates](../security/ssl.md#wildcard-certificates) use the DNS-01 challenge — Let's Encrypt asks Cloud 66 to add a TXT record to your domain via the [DNS provider](../security/dns-providers.md) you registered. The most common failures aren't with Cloud 66 or Let's Encrypt; they're at the DNS provider side.

### Cloudflare API token permissions and scope

On DNS-01, failures on Cloudflare-managed domains are almost always the API token rather than the orange-cloud proxy — a proxied record still resolves from public DNS, and the proxy doesn't block the TXT lookups Let's Encrypt makes. So if renewals are failing only on Cloudflare-managed domains, check the API token you registered with Cloud 66 first:

1. The Cloudflare API token you registered with Cloud 66 has both **Zone:Read** and **DNS:Edit** permissions on the relevant zone.
2. The token's **Zone Resources** scope includes the specific zone — a token scoped to a different zone will fail silently with a permission error.
3. The token has not expired.

### CNAME flattening

Cloudflare's [CNAME flattening](https://developers.cloudflare.com/dns/cname-flattening/) on the apex of your zone can interact poorly with DNS-01 if the challenge record is placed somewhere that resolves through a flattened CNAME. The fix is to keep the `_acme-challenge.<domain>` record on a non-flattened name (this is the default for sub-domains; only the zone apex flattens).

### Account / zone scope mismatch

If you have multiple Cloudflare accounts (e.g. one personal, one corporate), make sure the API token you registered with Cloud 66 belongs to the account that owns the zone for the domain on the certificate. A token from another account will not find the zone and the challenge add will fail.

### Verifying the TXT record manually

To check whether the challenge record was actually created during the last renewal attempt, query DNS directly from your local machine:

```bash
dig +short TXT _acme-challenge.<your-domain>
```

If the record is missing during a renewal window, check the application timeline first to confirm Cloud 66 actually attempted the DNS write — a missing record can mean the write was never made (e.g. an invalid API token) as well as the provider dropping it. Once you've confirmed a write was attempted, the failure is on the DNS provider or credential side. If the record is present but renewal still fails, it's a propagation timing issue (Let's Encrypt queried before the record was visible) and the next scheduled run will likely succeed.

## Related

- [Adding SSL certificates to apps](../security/ssl.md)
- [Troubleshooting SSL certificates](../security/troubleshooting-ssl.md) — HTTP-01 challenge problems
- [DNS providers](../security/dns-providers.md) — registering Cloudflare and other providers