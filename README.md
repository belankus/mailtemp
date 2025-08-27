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
- Upstash Redis

To run the project locally:

_Pre-requisite :_

1. Having PostgreSQL running on Your Machine
2. Make an Account at [Upstash](https://upstash.com) for Rate Limitter function _(optional)_
3. Clone and run this service [mailtemp-worker](https://github.com/belankus/mailtemp-worker)

_Run the App :_

1. Clone the repository
2. Create `.env` file from `.env.example`
3. Run `pnpm install`
4. Run `pnpx prisma generate`
5. Run `pnpx prisma migrate dev`
6. Run `pnpm run dev`
7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
