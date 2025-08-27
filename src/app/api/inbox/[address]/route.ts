import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params;
  const token = req.url.split("?token=")[1];

  if (!address || !token) {
    return NextResponse.json(
      { error: "Address and token are required" },
      { status: 400 },
    );
  }

  try {
    const messages = await prisma.message.findMany({
      where: { address: { address } },
      orderBy: { receivedAt: "desc" },
      take: 50,
    });

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load inbox" },
      { status: 500 },
    );
  }
}
