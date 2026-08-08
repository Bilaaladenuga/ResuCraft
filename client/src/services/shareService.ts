import { FormData, TemplateCustomization, DEFAULT_CUSTOMIZATION } from '../types';

/* ============================================
   Resume Sharing — encode a resume into a
   shareable link + QR code.

   Two modes:
   - Short link  : payload stored server-side (Upstash) for 30 days,
                   URL = /share?c=<code>  (short enough for a QR code)
   - Hash link   : payload compressed into the URL hash itself,
                   URL = /share#d=<payload> (no backend, works offline)

   Payload format: "d1.<base64url(deflate-raw(json))>" or
                   "d0.<base64url(json)>" as a fallback when
                   CompressionStream is unavailable.
   ============================================ */

export const SHARE_VERSION = 1;
export const SHARE_TTL_DAYS = 30;

export interface SharePayload {
    v: number;
    t: string; // templateId
    d: FormData;
    c: TemplateCustomization;
}

/** Downscale a data-URL photo so shared links stay reasonably sized */
export async function downscaleImage(dataUrl: string, maxSize = 256): Promise<string> {
    try {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const el = new Image();
            el.onload = () => resolve(el);
            el.onerror = () => reject(new Error('bad image'));
            el.src = dataUrl;
        });
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return dataUrl;
        ctx.drawImage(img, 0, 0, w, h);
        return canvas.toDataURL('image/jpeg', 0.82);
    } catch {
        return dataUrl;
    }
}

async function deflate(text: string): Promise<Uint8Array> {
    const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('deflate-raw'));
    const buf = await new Response(stream).arrayBuffer();
    return new Uint8Array(buf);
}

async function inflate(bytes: Uint8Array): Promise<string> {
    // Copy into an ArrayBuffer-backed view so the Blob type-checks across TS versions
    const copy = new Uint8Array(bytes.length);
    copy.set(bytes);
    const stream = new Blob([copy]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    const buf = await new Response(stream).arrayBuffer();
    return new TextDecoder().decode(buf);
}

function bytesToBase64Url(bytes: Uint8Array): string {
    let bin = '';
    bytes.forEach(b => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(b64url: string): Uint8Array {
    const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
}

/**
 * Serialize a resume into a compact, URL-safe payload string.
 * Downscales the photo and deflates the JSON.
 */
export async function encodeSharePayload(
    formData: FormData,
    templateId: string,
    customization?: TemplateCustomization
): Promise<string> {
    let image: string | null = formData.image;
    if (image) {
        image = await downscaleImage(image, 256);
        // Never embed a multi-MB data URL in the link — drop it if still too large
        if (image.length > 120_000) image = null;
    }

    const payload: SharePayload = {
        v: SHARE_VERSION,
        t: templateId,
        d: { ...formData, image },
        c: customization || DEFAULT_CUSTOMIZATION,
    };
    const json = JSON.stringify(payload);

    // Prefer native deflate; fall back to plain base64 if unavailable
    if (typeof CompressionStream !== 'undefined' && typeof DecompressionStream !== 'undefined') {
        try {
            const bytes = await deflate(json);
            return 'd1.' + bytesToBase64Url(bytes);
        } catch {
            // fall through
        }
    }
    return 'd0.' + btoa(unescape(encodeURIComponent(json)));
}

/** Decode a payload string back into a SharePayload */
export async function decodeSharePayload(raw: string): Promise<SharePayload> {
    let json: string;
    if (raw.startsWith('d1.')) {
        const bytes = base64UrlToBytes(raw.slice(3));
        json = await inflate(bytes);
    } else if (raw.startsWith('d0.')) {
        json = decodeURIComponent(escape(atob(raw.slice(3))));
    } else {
        throw new Error('Invalid share link');
    }

    const parsed = JSON.parse(json) as SharePayload;
    if (parsed.v !== SHARE_VERSION || !parsed.t || !parsed.d) {
        throw new Error('Invalid share link');
    }
    return parsed;
}

/** Build the public share URL — short code link or hash-embedded link */
export function buildShareUrl(payload: string, shortCode?: string): string {
    const origin = typeof window !== 'undefined'
        ? window.location.origin
        : 'https://resu-craft-smoky.vercel.app';
    return shortCode ? `${origin}/share?c=${shortCode}` : `${origin}/share#d=${payload}`;
}
