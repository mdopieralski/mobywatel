/**
 * Wheel scrolling over the phone: the app inside scrolls first. Once the part under the pointer cannot
 * scroll any further that way (its end, or its top), the page around the phone takes over, so the visitor
 * can keep scrolling past the phone without moving the pointer. Same origin, so the frame's window can be
 * listened to. The app's scroll area has `overscroll-behavior: contain`, so the browser never does this on
 * its own and nothing scrolls twice.
 */
export function handOffScroll(frame: HTMLIFrameElement): void {
  const win = frame.contentWindow;
  const doc = frame.contentDocument;
  if (!win || !doc) {
    return;
  }
  win.addEventListener(
    'wheel',
    (event) => {
      if (event.ctrlKey) {
        return; // pinch or Ctrl+wheel zoom
      }
      const dy =
        event.deltaMode === 1
          ? event.deltaY * 16
          : event.deltaMode === 2
            ? event.deltaY * win.innerHeight
            : event.deltaY;
      if (!dy) {
        return;
      }
      // The target lives in the frame's window, so `instanceof Element` (this window's) would not match.
      const target = event.target as Node | null;
      const start =
        target?.nodeType === Node.ELEMENT_NODE ? (target as Element) : (target?.parentElement ?? null);
      for (let el = start; el; el = el.parentElement) {
        if (canScroll(el, dy, win)) {
          return;
        }
      }
      const root = doc.scrollingElement;
      if (root && canMove(root, dy)) {
        return;
      }
      window.scrollBy({ top: dy, behavior: 'instant' });
    },
    { passive: true }
  );
}

function canScroll(el: Element, dy: number, win: Window): boolean {
  return /(auto|scroll|overlay)/.test(win.getComputedStyle(el).overflowY) && canMove(el, dy);
}

/** Room left to scroll in the wheel's direction (1 px slack for fractional sizes). */
function canMove(el: Element, dy: number): boolean {
  if (el.scrollHeight <= el.clientHeight) {
    return false;
  }
  return dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0;
}
