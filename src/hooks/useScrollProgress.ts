import { useEffect, useState, type RefObject } from 'react';

const DEFAULT_END = 150;

/** 0..1 across start..end px of scroll in the element, or the window when ref is null. */
export function useScrollProgress(ref: RefObject<HTMLElement> | null, options?: { start?: number; end?: number }): number {
  const start = options?.start || 0;
  const end = options?.end == null ? DEFAULT_END : options.end;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref && ref.current;
    const target: HTMLElement | Window = element || window;
    let frame = 0;

    function read() {
      frame = 0;
      const scrolled = element ? element.scrollTop : window.scrollY;
      // `|| 1` guards a zero-length range, as bundle.js does.
      setProgress(clamp((scrolled - start) / (end - start || 1), 0, 1));
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(read);
    }

    read();
    target.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      target.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, start, end]);

  return progress;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
