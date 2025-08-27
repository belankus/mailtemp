import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = req.url.split("?token=")[1];

  if (!id || !token) {
    return NextResponse.json(
      { error: "ID and token are required" },
      { status: 400 },
    );
  }

  try {
    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load message" },
      { status: 500 },
    );
  }
}
