import { Role, TripStatus } from "@prisma/client";
import { decode } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pingBodySchema } from "./schema";

export const runtime = "nodejs";

async function resolveDriverUser(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) return null;
    const decoded = await decode({
      token: auth.slice(7),
      secret,
    });
    if (decoded?.id && decoded.role === Role.driver) {
      return { id: decoded.id as string };
    }
  }

  const session = await getServerSession(authOptions);
  if (session?.user?.id && session.user.role === Role.driver) {
    return { id: session.user.id };
  }

  return null;
}

export async function POST(request: Request) {
  const user = await resolveDriverUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = pingBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const driver = await prisma.driver.findUnique({
    where: { userId: user.id },
  });
  if (!driver) {
    return NextResponse.json({ error: "Driver profile not found" }, { status: 403 });
  }

  const trip = await prisma.trip.findFirst({
    where: {
      driverId: driver.id,
      status: TripStatus.IN_PROGRESS,
    },
    orderBy: { updatedAt: "desc" },
  });
  if (!trip) {
    return NextResponse.json({ error: "No active trip for this driver" }, { status: 409 });
  }

  const { latitude, longitude, speed, recordedAt } = parsed.data;
  const ping = await prisma.locationPing.create({
    data: {
      tripId: trip.id,
      latitude,
      longitude,
      speed: speed ?? null,
      recordedAt: recordedAt ? new Date(recordedAt) : undefined,
    },
  });

  return NextResponse.json(
    {
      id: ping.id,
      tripId: ping.tripId,
      recordedAt: ping.recordedAt.toISOString(),
    },
    { status: 201 },
  );
}
