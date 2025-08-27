import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: "Email and token are required" },
        { status: 400 },
      );
    }

    const address = await prisma.address.findUnique({
      where: { address: email },
      include: { messages: true },
    });

    if (!address) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    if (address.token !== token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    if (new Date() > address.expiresAt) {
      return NextResponse.json(
        { error: "Email has expired. Please create new one!" },
        { status: 410 },
      );
    }

    return NextResponse.json({ messages: address.messages }, { status: 200 });
  } catch (err) {
    console.error("use-email API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
