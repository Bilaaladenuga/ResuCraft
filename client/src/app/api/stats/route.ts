import { NextRequest, NextResponse } from 'next/server';
import {
    ALL_EVENTS,
    StatsEvent,
    incrementEvent,
    getPublicStats,
    getActivity,
} from '../../../lib/statsStore';

export const runtime = 'nodejs';
// Never statically prerender — stats must be fresh on every request.
export const dynamic = 'force-dynamic';

export const revalidate = 0;

const VALID_EVENTS = new Set<string>(ALL_EVENTS);

export async function GET() {
    const [stats, activity] = await Promise.all([getPublicStats(), getActivity()]);
    return NextResponse.json({ ...stats, activity });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const event = body?.event as string;

        if (!event || !VALID_EVENTS.has(event)) {
            return NextResponse.json({ success: false, error: 'Unknown event' }, { status: 400 });
        }

        await incrementEvent(event as StatsEvent);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }
}
