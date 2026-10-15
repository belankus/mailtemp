import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIp, limitAddressCreation } from "@/lib/rate-limit";

function randomID(len = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < len; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(req: Request) {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || "example.com";
  const local = `${randomID()}-${randomID()}`;
  const address = `${local}@${domain}`;
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // expires in 1 hour

  try {
    const retryAfter = await limitAddressCreation(getClientIp(req.headers));
    if (retryAfter > 0) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Address creation temporarily unavailable. Please try again later.",
      },
      {
        status: 503,
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
