import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { fromAddr, toAddr, subject, textBody, htmlSanitized, attachments } =
    await req.json();

  console.log({
    fromAddr: fromAddr.address,
    toAddr: toAddr[0].address,
    subject,
    textBody,
    htmlSanitized,
    attachments,
  });
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 },
      );
    }

    verifyToken(token);
    const address = await prisma.address.findUnique({
      where: { address: toAddr[0].address },
    });

    if (!address) {
      return NextResponse.json(
        { error: `Address not found for`, toAddr },
        { status: 404 },
      );
    }

    const now = new Date();

    if (address.expiresAt > now) {
      const newTtl = new Date(now.getTime() + 1000 * 60 * 60);
      await prisma.address.update({
        where: { address: toAddr[0].address },
        data: { expiresAt: newTtl },
      });
    }

    const savedEmail = await prisma.message.create({
      data: {
        address: {
          connect: {
            address: toAddr[0].address,
          },
        },
        fromAddr: fromAddr.address,
        subject,
        textBody,
        htmlSanitized,
        r2KeyEml: `email-${Date.now()}.eml`,
        r2KeysAttach: attachments,
      },
    });

    return NextResponse.json(
      { message: "Email saved successfully", emailId: savedEmail.id },
      { status: 200 },
    );
  } catch (e) {
    console.error("Error saving email:", e);
    return NextResponse.json(
      { error: "Failed to save email", details: e },
      { status: 500 },
    );
  }
}
