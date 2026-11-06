import { useReducedMotion } from '../../hooks/useReducedMotion';
import { clamp } from '../../utils/clamp';
import { cx } from '../../utils/cx';

/** checked + onChange for a plain switch; progress 0..1 when scroll drives it. */
export interface ToggleProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  progress?: number;
  label?: string;
  className?: string;
}

export function Toggle({ checked, onChange, progress, label, className }: ToggleProps) {
  const reduced = useReducedMotion();
  const driven = progress != null;
  const position = driven ? clamp(progress, 0, 1) : checked ? 1 : 0;
  const isOn = position >= 0.5;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      aria-label={label || 'Switch view'}
      // Scroll-driven knobs follow the scroll directly, so only a clicked switch animates.
      className={cx('gp-toggle', !driven && !reduced && 'gp-toggle--animate', className)}
      style={{ '--p': position }}
      onClick={onChange ? () => onChange(!isOn) : undefined}
    >
      <span className="gp-toggle__knob" aria-hidden="true" />
    </button>
  );
}
