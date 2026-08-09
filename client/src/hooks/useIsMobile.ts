'use client';
import { useEffect, useState } from 'react';

/**
 * SSR-safe viewport check. Returns true once the window matches
 * `(max-width: ${breakpoint}px)`. Starts as `false` during SSR/first
 * paint to avoid hydration mismatches, then updates on mount.
 */
export function useIsMobile(breakpoint = 768): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, [breakpoint]);

    return isMobile;
}
