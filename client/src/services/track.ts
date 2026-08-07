/* ============================================
   Client-side anonymous usage tracking
   Fires anonymous event names (never resume content)
   to /api/stats. Fire-and-forget — silently no-ops
   if the network or endpoint fails.
   ============================================ */

export type TrackEvent =
    | 'resume_created'
    | 'resume_example'
    | 'pdf_export'
    | 'docx_export'
    | 'ats_check'
    | 'resume_score'
    | 'keyword_match'
    | 'cover_letter'
    | 'cover_letter_export'
    | 'ai_generation';

// Light dedupe: ignore the same event within 3 seconds.
// Prevents double-counts from quick re-clicks or effect re-runs.
const lastSentAt: Partial<Record<TrackEvent, number>> = {};
const DEDUPE_MS = 3000;

export function trackEvent(event: TrackEvent): void {
    if (typeof window === 'undefined') return;

    const now = Date.now();
    const last = lastSentAt[event];
    if (last && now - last < DEDUPE_MS) return;
    lastSentAt[event] = now;

    try {
        fetch('/api/stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event }),
            keepalive: true,
        }).catch(() => {
            /* silently ignore — tracking must never break the app */
        });
    } catch {
        /* ignore */
    }
}
