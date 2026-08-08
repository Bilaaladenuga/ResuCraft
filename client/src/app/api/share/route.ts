import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

/* ============================================
   Share link store (Upstash Redis)
   POST { payload }  -> { code }
   GET  ?code=xxxx   -> { payload }
   Links expire after 30 days.
   If Redis is not configured, POST returns 503
   and the client falls back to hash-embedded links.
   ============================================ */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = REDIS_URL && REDIS_TOKEN
    ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
    : null;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SHARE_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const MAX_PAYLOAD = 200_000; // 200KB safety cap
const CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function makeCode(len = 10): string {
    const rand = new Uint8Array(len);
    crypto.getRandomValues(rand);
    let code = '';
    for (let i = 0; i < len; i++) {
        code += CODE_CHARS[rand[i] % CODE_CHARS.length];
    }
    return code;
}

export async function POST(request: NextRequest) {
    if (!redis) {
        return NextResponse.json(
            { ok: false, error: 'Share store unavailable' },
            { status: 503 }
        );
    }
    try {
        const body = await request.json();
        const payload = typeof body?.payload === 'string' ? body.payload.trim() : '';
        if (!payload || payload.length < 8 || payload.length > MAX_PAYLOAD) {
            return NextResponse.json(
                { ok: false, error: 'Invalid payload' },
                { status: 400 }
            );
        }
        const code = makeCode();
        await redis.set(`share:${code}`, payload, { ex: SHARE_TTL_SECONDS });
        return NextResponse.json({ ok: true, code });
    } catch (err) {
        console.error('Share link create failed:', err);
        return NextResponse.json(
            { ok: false, error: 'Failed to create share link' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    if (!redis) {
        return NextResponse.json(
            { ok: false, error: 'Share store unavailable' },
            { status: 503 }
        );
    }
    const code = request.nextUrl.searchParams.get('c') || '';
    if (!code || !/^[A-Za-z0-9]{4,16}$/.test(code)) {
        return NextResponse.json(
            { ok: false, error: 'Invalid share code' },
            { status: 400 }
        );
    }
    try {
        const payload = await redis.get(`share:${code}`);
        if (!payload) {
            return NextResponse.json(
                { ok: false, error: 'Link expired or not found' },
                { status: 404 }
            );
        }
        return NextResponse.json({ ok: true, payload });
    } catch (err) {
        console.error('Share link fetch failed:', err);
        return NextResponse.json(
            { ok: false, error: 'Failed to load share link' },
            { status: 500 }
        );
    }
}
