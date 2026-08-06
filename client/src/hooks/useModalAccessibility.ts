'use client';
import { useEffect, useRef } from 'react';

/**
 * Adds standard dialog accessibility to a modal:
 * - role="dialog" + aria-modal + aria-label on the dialog element
 * - Moves focus into the dialog on open (first input if present, else first control)
 * - Traps Tab focus inside the dialog (only when it's the topmost modal)
 * - Closes on Escape (only when it's the topmost modal)
 * - Restores focus to the previously-focused element on close
 *
 * Attach the returned ref to the inner dialog element (the card, not the overlay).
 */
export function useModalAccessibility(
    isOpen: boolean,
    onClose: () => void,
    label?: string
) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const onCloseRef = useRef(onClose);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);

    // Keep the latest onClose without re-running the effect (parents pass inline arrows)
    useEffect(() => {
        onCloseRef.current = onClose;
    });

    useEffect(() => {
        if (!isOpen) return;

        const dialog = dialogRef.current;
        if (!dialog) return;

        const isTopmost = () => {
            const overlays = Array.from(
                document.querySelectorAll<HTMLElement>('.modal-overlay, .modal-backdrop')
            );
            if (overlays.length === 0) return true;
            return overlays[overlays.length - 1] === dialog.closest('.modal-overlay, .modal-backdrop');
        };

        // Remember what had focus before the modal opened
        previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

        // Dialog semantics
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('tabindex', '-1');
        if (label) dialog.setAttribute('aria-label', label);

        const getFocusables = () =>
            Array.from(
                dialog.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            ).filter(el => el.offsetParent !== null || el === document.activeElement);

        // Initial focus: prefer the first input/select/textarea, else the first control
        const items = getFocusables();
        const initial =
            items.find(el => el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') ||
            items[0];
        (initial || dialog).focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isTopmost()) return; // let the topmost modal handle Escape/Tab
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                onCloseRef.current();
                return;
            }
            if (e.key === 'Tab') {
                const list = getFocusables();
                if (list.length === 0) {
                    e.preventDefault();
                    return;
                }
                const first = list[0];
                const last = list[list.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown, true);
        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
            // Restore focus to where the user was before opening
            previouslyFocusedRef.current?.focus?.();
        };
    }, [isOpen, label]);

    return dialogRef;
}
