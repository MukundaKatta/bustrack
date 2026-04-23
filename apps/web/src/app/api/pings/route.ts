import { type LocationPing } from '@bustrack/shared';
import { NextResponse } from 'next/server';

function isValidPing(payload: unknown): payload is LocationPing {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const ping = payload as Record<string, unknown>;

  return (
    typeof ping.latitude === 'number' &&
    Number.isFinite(ping.latitude) &&
    typeof ping.longitude === 'number' &&
    Number.isFinite(ping.longitude) &&
    (ping.speed === null || (typeof ping.speed === 'number' && Number.isFinite(ping.speed))) &&
    typeof ping.timestamp === 'string' &&
    !Number.isNaN(Date.parse(ping.timestamp))
  );
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!isValidPing(payload)) {
      return NextResponse.json(
        { error: 'Invalid ping payload. Expected latitude, longitude, speed, and timestamp.' },
        { status: 400 },
      );
    }

    // TODO(BT-05): Persist accepted pings with Prisma here once the schema work in PR #8 lands.
    // TODO: Require a driver session token before accepting pings in a future auth ticket.
    return NextResponse.json(
      {
        ok: true,
        receivedAt: new Date().toISOString(),
        ping: payload,
      },
      { status: 202 },
    );
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
}
