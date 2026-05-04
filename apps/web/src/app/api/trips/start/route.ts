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

  const driver = await prisma.driver.findUnique({
    where: { userId: decoded.id as string },
    include: { bus: { include: { routes: { take: 1 } } } },
  });

  if (!driver) {
    return NextResponse.json({ error: "Driver profile not found" }, { status: 404 });
  }

  const route = driver.bus?.routes[0];
  if (!route) {
    return NextResponse.json({ error: "No route assigned to this bus" }, { status: 409 });
  }

  const existingTrip = await prisma.trip.findFirst({
    where: { driverId: driver.id, status: "IN_PROGRESS" },
  });

  if (existingTrip) {
    return NextResponse.json({ error: "A trip is already in progress" }, { status: 409 });
  }

  const trip = await prisma.trip.create({
    data: {
      driverId: driver.id,
      busId: driver.busId,
      routeId: route.id,
      status: "IN_PROGRESS",
      startedAt: new Date(),
    },
  });

  return NextResponse.json({ tripId: trip.id, status: trip.status }, { status: 201 });
}
