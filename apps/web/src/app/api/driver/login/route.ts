import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { encode } from "next-auth/jwt";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: body.email } });

  if (!user || user.role !== Role.driver) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await compare(body.password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await encode({
    token: { id: user.id, email: user.email, role: user.role },
    secret: process.env.NEXTAUTH_SECRET!,
  });

  return NextResponse.json({ token });
}
