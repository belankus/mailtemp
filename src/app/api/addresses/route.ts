import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/upstash";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"), // Limit 5 requests per IP per 1 hour
  analytics: true,
});

function randomID(len = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < len; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown"; // Get User IP
  const domain = process.env.NEXT_PUBLIC_DOMAIN || "example.com";
  const local = `${randomID()}-${randomID()}`;
  const address = `${local}@${domain}`;
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // expires in 1 hour

  /* --- Rate Limitter ---
    This is to avoid spamming activity on creating address, for security.

    You can fix the error by providing UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN on .env obtained
    from Upstash https://console.upstash.com/redis/

    Or you can simply remove try - catch code block below (not recommended for production)
  */
  try {
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        {
          status: 429,
        },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Upstash token is Invalid. Please check src/app/api/addresses/route.ts on line 28 (Rate Limitter part) to fix this error.",
      },
      {
        status: 500,
      },
    );
  }

  const existingAddress = await prisma.address.findUnique({
    where: { address },
  });

  if (existingAddress) {
    return NextResponse.json(
      { error: "Address already exists" },
      { status: 400 },
    );
  }

  try {
    const newAddress = await prisma.address.upsert({
      where: { address },
      update: {
        lastAccessAt: new Date(),
        expiresAt: expiresAt,
      },
      create: {
        address,
        token,
        expiresAt,
      },
    });

    return NextResponse.json({ address: newAddress.address, token, expiresAt });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 },
    );
  }
}
