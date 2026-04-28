import { NextResponse } from "next/server";
import { decode } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawToken = authHeader.slice(7);
  const decoded = await decode({ token: rawToken, secret: process.env.NEXTAUTH_SECRET! });

  if (!decoded?.id || decoded.role !== "driver") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const driver = await prisma.driver.findUnique({
    where: { userId: decoded.id as string },
    include: {
      user: { select: { name: true, email: true } },
      bus: {
        select: {
          name: true,
          plateNumber: true,
          routes: { select: { name: true }, take: 1 },
        },
      },
    },
  });

  if (!driver) {
    return NextResponse.json({ error: "Driver profile not found" }, { status: 404 });
  }

  return NextResponse.json({
    name: driver.user.name ?? driver.user.email,
    busNumber: driver.bus?.name ?? "Not assigned",
    plateNumber: driver.bus?.plateNumber ?? "",
    route: driver.bus?.routes[0]?.name ?? "No route assigned",
  });
}
