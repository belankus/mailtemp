import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params;
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!address || !token) {
    return NextResponse.json(
      { error: "Address and token are required" },
      { status: 400 },
    );
  }

  try {
    // First verify the address exists and token matches
    const addressRecord = await prisma.address.findUnique({
      where: { address },
    });

    if (!addressRecord || addressRecord.token !== token) {
      return NextResponse.json(
        { error: "Invalid address or token" },
        { status: 401 },
      );
    }

    // Check if address is expired
    if (new Date() > addressRecord.expiresAt) {
      return NextResponse.json(
        { error: "Address has expired" },
        { status: 410 },
      );
    }

    // Update last access time
    await prisma.address.update({
      where: { address },
      data: { lastAccessAt: new Date() },
    });

    // Fetch messages with attachment info
    const messages = await prisma.message.findMany({
      where: { addressId: address },
      orderBy: { receivedAt: "desc" },
      take: 50,
      select: {
        id: true,
        fromAddr: true,
        subject: true,
        receivedAt: true,
        snippet: true,
        r2KeysAttach: true,
      },
    });

    // Transform messages to include has_attachments field
    const messagesWithAttachments = messages.map((message) => ({
      id: message.id,
      fromAddr: message.fromAddr,
      subject: message.subject,
      receivedAt: message.receivedAt.toISOString(),
      snippet: message.snippet,
      has_attachments: message.r2KeysAttach && message.r2KeysAttach.length > 0,
    }));

    return NextResponse.json(messagesWithAttachments);
  } catch (error) {
    console.error("Inbox API error:", error);
    return NextResponse.json(
      { error: "Failed to load inbox" },
      { status: 500 },
    );
  }
}
