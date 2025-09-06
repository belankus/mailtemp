// app/api/download-attachment/route.ts

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const attachmentKey = searchParams.get("attachmentKey");
    const token = searchParams.get("token");
    const messageId = searchParams.get("messageId");

    // Validate required parameters
    if (!attachmentKey || !token || !messageId) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: attachmentKey, token, or messageId",
        },
        { status: 400 },
      );
    }

    // Verify token and get user/inbox information
    const inbox = await prisma.address.findFirst({
      where: {
        token: token,
      },
      select: {
        address: true,
        token: true,
      },
    });

    if (!inbox) {
      return NextResponse.json(
        {
          error: "Invalid or expired token",
        },
        { status: 401 },
      );
    }

    // Verify the message belongs to this inbox
    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        addressId: inbox.address, // Ensure the message belongs to the authenticated inbox
      },
      select: {
        id: true,
        r2KeysAttach: true,
      },
    });

    if (!message) {
      return NextResponse.json(
        {
          error: "Message not found or access denied",
        },
        { status: 404 },
      );
    }

    // Verify the attachment key exists in the message's attachments
    if (
      !message.r2KeysAttach ||
      !message.r2KeysAttach.includes(attachmentKey)
    ) {
      return NextResponse.json(
        {
          error: "Attachment not found in message",
        },
        { status: 404 },
      );
    }

    const baseStorage = process.env.BASE_STORAGE_URL;
    if (!baseStorage) {
      return NextResponse.json(
        {
          error: "BASE_STORAGE environment variable not configured",
        },
        { status: 500 },
      );
    }

    // Construct the storage URL
    const storageUrl = `${baseStorage}/${encodeURIComponent(attachmentKey)}`;

    // Fetch the file from storage
    const response = await fetch(storageUrl);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Attachment not found" },
          { status: 404 },
        );
      }
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
      return NextResponse.json(
        {
          error: `Failed to fetch attachment: ${response.statusText}`,
        },
        { status: response.status },
      );
    }

    // Get headers from the storage response
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const contentDisposition =
      response.headers.get("content-disposition") ||
      `attachment; filename="${decodeURIComponent(attachmentKey)}"`;

    // Return the file stream with appropriate headers
    return new NextResponse(response.body, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
        ...(response.headers.get("content-length") && {
          "Content-Length": response.headers.get("content-length")!,
        }),
      },
    });
  } catch (error) {
    console.error("Error downloading attachment:", error);
    return NextResponse.json(
      {
        error: "Internal server error while downloading attachment",
      },
      { status: 500 },
    );
  }
}
