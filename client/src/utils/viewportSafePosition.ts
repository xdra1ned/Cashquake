/**
 * Viewport-safe positioning utility.
 *
 * Given an anchor element's bounding rect and desired popup dimensions,
 * returns a {top, left, placement} guaranteed to remain fully inside the
 * visible viewport (with an optional margin).
 *
 * Usage:
 *   const anchorEl = buttonRef.current;
 *   const rect = anchorEl.getBoundingClientRect();
 *   const pos = getSafePosition(rect, 280, 180, 'top');
 *   // → { top: 420, left: 80, placement: 'bottom' }  (flipped if 'top' would clip)
 */

export type Placement = 'top' | 'bottom' | 'left' | 'right';

export interface SafePosition {
  top: number;
  left: number;
  placement: Placement;
}

/**
 * Returns the ideal {top, left} for a popup given the anchor's rect,
 * flipping placement if the preferred side would render outside the viewport.
 *
 * @param anchor         - DOMRect of the triggering element
 * @param popupWidth     - desired popup width in px
 * @param popupHeight    - desired popup height in px
 * @param preferred      - preferred placement direction
 * @param margin         - minimum gap from viewport edges, default 8px
 */
export function getSafePosition(
  anchor: DOMRect,
  popupWidth: number,
  popupHeight: number,
  preferred: Placement = 'top',
  margin = 8
): SafePosition {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Candidate positions for each placement
  const candidates: Record<Placement, { top: number; left: number }> = {
    top: {
      top: anchor.top - popupHeight - margin,
      left: anchor.left + anchor.width / 2 - popupWidth / 2,
    },
    bottom: {
      top: anchor.bottom + margin,
      left: anchor.left + anchor.width / 2 - popupWidth / 2,
    },
    left: {
      top: anchor.top + anchor.height / 2 - popupHeight / 2,
      left: anchor.left - popupWidth - margin,
    },
    right: {
      top: anchor.top + anchor.height / 2 - popupHeight / 2,
      left: anchor.right + margin,
    },
  };

  /** Check whether a placement fits without clipping on the primary axis */
  function fits(p: Placement): boolean {
    const { top, left } = candidates[p];
    switch (p) {
      case 'top':    return top >= margin;
      case 'bottom': return top + popupHeight <= vh - margin;
      case 'left':   return left >= margin;
      case 'right':  return left + popupWidth <= vw - margin;
    }
  }

  // Try preferred first, then cycle through alternatives
  const order: Placement[] = [preferred, ...(['top', 'bottom', 'left', 'right'] as Placement[]).filter(p => p !== preferred)];
  const chosen = order.find(fits) ?? preferred;

  const { top, left } = candidates[chosen];

  // Clamp to viewport regardless
  return {
    top: Math.max(margin, Math.min(top, vh - popupHeight - margin)),
    left: Math.max(margin, Math.min(left, vw - popupWidth - margin)),
    placement: chosen,
  };
}
