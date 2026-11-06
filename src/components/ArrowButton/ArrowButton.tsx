import { cx } from '../../utils/cx';

export interface ArrowButtonProps {
  direction?: 'prev' | 'next';
  label?: string;
  onClick?: () => void;
  className?: string;
}

export function ArrowButton({ direction, label, onClick, className }: ArrowButtonProps) {
  const isPrev = direction === 'prev';
  return (
    <button type="button" className={cx('gp-arrow', 'intro', className)} onClick={onClick} aria-label={label || (isPrev ? 'Previous' : 'Next')}>
      <span aria-hidden="true">{isPrev ? '←' : '→'}</span>
    </button>
  );
}
