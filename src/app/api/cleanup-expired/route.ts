import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 },
      );
    }

    verifyToken(token);
    const now = new Date();

    const expiredAddresses = await prisma.address.findMany({
      where: { expiresAt: { lt: now } },
      include: { messages: true },
    });

    for (const addr of expiredAddresses) {
      await prisma.message.deleteMany({ where: { addressId: addr.address } });

      await prisma.address.delete({ where: { address: addr.address } });

      console.log(`Deleted expired address: ${addr.address}`);
    }

    return NextResponse.json(
      { message: "Expired emails cleaned successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error during cleanup:", err);
    return NextResponse.json(
      { error: "Failed to clean expired emails" },
      { status: 500 },
    );
  }
}
