import { NextResponse } from "next/server";
import { decode } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = await decode({
    token: authHeader.slice(7),
    secret: process.env.NEXTAUTH_SECRET!,
  });

  if (!decoded?.id || decoded.role !== "driver") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));

  const driver = await prisma.driver.findUnique({
    where: { userId: decoded.id as string },
  });

  if (!driver) {
    return NextResponse.json({ error: "Driver profile not found" }, { status: 404 });
  }

  const trip = await prisma.trip.findFirst({
    where: {
      id: body.tripId ?? undefined,
      driverId: driver.id,
      status: "IN_PROGRESS",
    },
  });

  if (!trip) {
    return NextResponse.json({ error: "No active trip found" }, { status: 404 });
  }

  const updated = await prisma.trip.update({
    where: { id: trip.id },
    data: { status: "COMPLETED", endedAt: new Date() },
  });

  return NextResponse.json({ tripId: updated.id, status: updated.status });
}
