# MailTemp

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MailTemp is a free, open-source, and self-hosted service that provides temporary email addresses that auto-expire after 1 hour of inactivity. Protect your privacy and keep your primary inbox clean.

## Features

- Temporary email addresses that auto-expire after 1 hour of inactivity
- No accounts or sign-ups required
- Use existing email addresses or generate a new one
- Access tokens for viewing a temporary inbox
- Remote images, scripts, and other active content may be blocked by default
- Attachments may be restricted or unavailable
- Operational logs may be retained briefly for troubleshooting and security, then deleted

## How to use

1. Generate a temporary email address or use an existing one
2. Use the address to sign up for a service or receive an email
3. Access the temporary inbox using the provided token
4. The inbox will auto-expire after 1 hour of inactivity

## Development

This project uses the following technologies:

- Next.js
- Tailwind CSS
- Prisma
- Redis (Docker Compose)

To run the project locally:

_Pre-requisite :_

1. Having PostgreSQL running on Your Machine
2. Run Redis for the address creation rate limiter
3. Clone and run this service [mailtemp-worker](https://github.com/belankus/mailtemp-worker)

_Run the App :_

1. Clone the repository
2. Create `.env` file from `.env.example`
3. Set `DATABASE_URL` and `REDIS_URL` for your local services
4. Run `bun install`
5. Run `bunx prisma migrate dev`
6. Run `bun run dev`
7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

For local API requests outside the proxy, include `X-Real-IP: 127.0.0.1`.
Browser address creation should be tested through your Caddy proxy, which supplies this header.

## Docker Compose deployment

Requires an ARM64 Linux server with Docker Engine and Compose. The stack includes Next.js, Redis, PostgreSQL,
a one-off Prisma migration service. Your existing Caddy container handles HTTPS
through the existing external Docker network `proxy`. This stack publishes no host ports.

1. Copy `compose.yaml` and `.env.example` to a directory on the server,
   then copy `.env.example` to `.env`. No source code or build tools are required.
2. Set a strong URL-safe `POSTGRES_PASSWORD` (random hex is suitable), the existing
   Worker `API_TOKEN`, email domain `NEXT_PUBLIC_DOMAIN`, and R2 `BASE_STORAGE_URL`.
3. Ensure your Caddy container is attached to the existing `proxy` network, and
   add the site configuration shown below to its Caddyfile. Point the web hostname
   to that server and reload Caddy.
4. After the GitHub Actions publish job succeeds, run `docker compose pull`, then
   `docker compose up -d` and inspect `docker compose ps` and
   `docker compose logs migrate app`.
5. Open the configured site and check `/api/health`.

### GitHub Actions / GHCR

`.github/workflows/publish-image.yml` builds on `ubuntu-latest` with QEMU and Buildx
on pushes to `main`, or a manual run from `main`. It publishes `linux/arm64` images:

- `ghcr.io/belankus/mailtemp:latest`: Next.js application.
- `ghcr.io/belankus/mailtemp-migrate:latest`: one-off Prisma migration service.

The runner/QEMU/Buildx/GHCR pattern follows the
[successful sitrack-v2 publish run](https://github.com/belankus/sitrack-v2/actions/runs/31452119700),
with ARM64 as the only target platform.

Both images also receive `sha-<full-commit-sha>` tags. CI uses the automatic
`GITHUB_TOKEN` with `packages: write`; no registry password secret is required.
In a fork, CI uses the fork's repository name; update `APP_IMAGE` and
`MIGRATE_IMAGE` in `.env` to match.

Make both GHCR packages public for anonymous pulls. If keeping them private,
authenticate on the server with `docker login ghcr.io -u YOUR_GITHUB_USERNAME`
and enter a personal access token (classic) with `read:packages` at the password
prompt. Never put the token in Compose or commit it.

Wait for the entire workflow to succeed before pulling: the two images are
published separately. For a fixed release or rollback, set `IMAGE_TAG` to the
same successful `sha-<full-commit-sha>` for both images. A rollback does not undo
database migrations; verify schema compatibility first.

For a local source build, use `docker build --target runner -t mailtemp:local .`
and `docker build --target migrate -t mailtemp-migrate:local .` on ARM64, then set
`APP_IMAGE=mailtemp`, `MIGRATE_IMAGE=mailtemp-migrate`, and `IMAGE_TAG=local`.

Leave `DATABASE_URL` unset for the bundled PostgreSQL. To retain your existing
database, set its full URL (including any required SSL parameters); `localhost`
inside a container is not your host. The bundled PostgreSQL still starts but is
unused in that case. Back up an existing database before running migrations.
Use `prisma migrate deploy`, never `migrate reset`, for production.

The migration image uses the same build as the app. Startup waits for a healthy
database, successful migrations, and healthy Redis. The app health endpoint checks
PostgreSQL; Redis failure deliberately blocks only new address creation with 503.
The limiter allows five creations per IP in a rolling hour, returns 429 with
`Retry-After`, and stores its state in Redis with TTL and AOF persistence.
Upstash counters are not imported. AOF's default sync policy can lose roughly the
last second of counters after an abrupt host failure.

### Proxy and client IP

Add this site block to your existing Caddy configuration:

```caddyfile
mail.example.com {
    reverse_proxy mailtemp:3000 {
        header_up X-Real-IP {client_ip}
    }
}
```

`mailtemp` is the app's network alias on `proxy`, avoiding the generic `app` name
shared by other Compose projects. Only the app joins `proxy`; Redis, PostgreSQL,
and migrations remain on the project's default network. Do not publish their ports.
Containers on `proxy` must be trusted because they can reach the app directly.

Caddy must overwrite `X-Real-IP` with the connecting client's address; otherwise
address creation returns 503 or the limiter can trust spoofed input. The app ignores
user-supplied `X-Forwarded-For`. This example expects browsers to connect
directly to Caddy: use **DNS only** for the web hostname if it is hosted on Cloudflare.
Cloudflare Email Routing, the Worker and R2 are unaffected by that DNS setting.

If using Cloudflare's orange-cloud proxy or another load balancer, configure
Caddy `trusted_proxies` with that provider's actual source CIDRs and `client_ip_headers`
with its verified client-IP header before enabling it. Never trust all source IPs.
Without this configuration, visitors would share their proxy's rate limit.

### Cloudflare and migration from Vercel

Keep Worker code, R2 bindings, bucket and Email Routing/MX unchanged. Keep the
Worker's `API_TOKEN` identical to the app's token. If the web hostname changes,
update Worker `API_URL` to the new HTTPS origin; otherwise keep it unchanged.
The Worker still POSTs to `/api/save-email` and calls `/api/cleanup-expired`
every 30 minutes. Cleanup currently removes database records, not R2 objects.

First test the new deployment with a test inbox, incoming email, attachment
download and authenticated cleanup. Keep Vercel/Upstash available until traffic
has moved and the new deployment is stable. With the same database and schema,
rollback is a DNS/API_URL change back to Vercel. Do not switch back to an old
database after the new database has received writes without reconciling the data.

For a database move, take and verify a backup, briefly stop writes and Worker
cleanup, restore into the new PostgreSQL, then switch app and Worker traffic
together. Do not run two writable copies. Existing inbox tokens and R2 keys must
be retained. Database migration is an operational step, not automatic data copying.

### Updates, backup and tests

For an update, wait for CI to succeed, then run `docker compose pull` and
`docker compose up -d`. Compose runs the migration service before starting the app.
Keep the previous successful commit SHA for rollback.
`docker compose down` retains data; **`docker compose down -v` deletes volumes**.
Back up PostgreSQL off-host and test restores. Example commands in a Linux shell:

```sh
docker compose exec -T postgres pg_dump -U mailtemp -d mailtemp -Fc > mailtemp.dump
# Restore only into an empty target database:
docker compose exec -T postgres pg_restore -U mailtemp -d mailtemp --no-owner < mailtemp.dump
```

Run `bun test` for IP validation. For the integration test, use a disposable Redis
instance and run `TEST_REDIS_URL=redis://127.0.0.1:6379 bun test` (Linux shell).
It verifies concurrent requests, separate quotas, expiry, TTL and retry timing.
Without `TEST_REDIS_URL`, the integration test is explicitly skipped.
Also run `bun run lint` and `bun run build`. At deployment, verify the sixth
creation returns 429, forged headers do not bypass the proxy, Redis outages return
503 for creation while existing inboxes work, and a restart preserves data.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
