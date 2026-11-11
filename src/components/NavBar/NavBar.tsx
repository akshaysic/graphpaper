import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

import { clamp } from '../../utils/clamp';
import { cx } from '../../utils/cx';
import { CtaTab } from '../CtaTab';
import type { Action } from '../types';

export interface NavBarLink {
  label: string;
  href?: string;
  current?: boolean;
}

/**
 * Built to the Navigation rules in design/README.md (v1.1), not ported from bundle.js.
 * progress 0..1 over the first 150px of scroll turns the bar solid with its border.
 * band is the ground of the band below the bar at the top of the page.
 */
export interface NavBarProps {
  brand?: string | ReactNode;
  brandHref?: string;
  links?: NavBarLink[];
  cta?: Action;
  progress?: number;
  position?: 'static' | 'sticky' | 'fixed';
  band?: 'ground' | 'paper';
  skipTo?: string;
  label?: string;
  className?: string;
}

// Matches the 767px breakpoint in components.css, where the links fold into the Menu sheet.
const PHONE_QUERY = '(max-width: 767px)';
const FOCUSABLE = 'a[href], button:not([disabled])';

export function NavBar({
  brand,
  brandHref = '/',
  links = [],
  cta,
  progress = 0,
  position = 'sticky',
  band = 'ground',
  skipTo = '#content',
  label = 'Main',
  className,
}: NavBarProps) {
  const p = clamp(progress, 0, 1);
  const [open, setOpen] = useState(false);
  const sheetId = useId();
  const menuRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // While the sheet is open, focus starts inside it, the page behind does not scroll,
  // and widening past the phone breakpoint closes it, since the links are back in the bar.
  useEffect(() => {
    if (!open) return undefined;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = 'hidden';
    // Focus lands on Close, where Menu was, so the reader's place does not jump.
    closeRef.current?.focus();
    const query = window.matchMedia(PHONE_QUERY);
    const closeWhenWide = (event: MediaQueryListEvent) => {
      if (!event.matches) setOpen(false);
    };
    query.addEventListener('change', closeWhenWide);
    return () => {
      root.style.overflow = overflow;
      query.removeEventListener('change', closeWhenWide);
    };
  }, [open]);

  function close() {
    setOpen(false);
    menuRef.current?.focus();
  }

  // Esc closes; Tab and Shift+Tab wrap between the first and last controls in the sheet.
  function onSheetKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab' || !sheetRef.current) return;
    const items = Array.from(sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  // The wordmark and the action tab appear in the bar and again in the sheet's top row.
  const brandNode = (onClick?: () => void) =>
    typeof brand === 'string' ? (
      <a className="gp-nav__brand body" href={brandHref} onClick={onClick}>
        <span className="gp-nav__text">{brand}</span>
      </a>
    ) : (
      (brand ?? null)
    );

  const ctaNode = (onClick?: () => void) =>
    cta ? (
      <div className="gp-nav__cta">
        <CtaTab
          size="s"
          corner="bl"
          href={cta.href}
          onClick={() => {
            onClick?.();
            cta.onClick?.();
          }}
        >
          {cta.label}
        </CtaTab>
      </div>
    ) : null;

  const linkItems = (variant: 'bar' | 'sheet') =>
    links.map((link, index) => (
      <li key={index}>
        <a
          className={cx('gp-nav__link', variant === 'sheet' ? 'gp-sheet__link title' : 'body')}
          href={link.href || '#'}
          aria-current={link.current ? 'page' : undefined}
          onClick={variant === 'sheet' ? () => setOpen(false) : undefined}
        >
          <span className="gp-nav__text">{link.label}</span>
        </a>
      </li>
    ));

  return (
    <>
      <a className="gp-skip body" href={skipTo}>
        Skip to content
      </a>
      {/* Rule 8: the bar stays light over dark bands, so it carries its own theme. */}
      <header
        className={cx('gp-navbar', `gp-navbar--${position}`, band === 'paper' && 'gp-navbar--paper', p >= 1 && 'is-solid', className)}
        data-theme="light"
        style={{ '--p': p }}
      >
        <nav className="gp-nav" aria-label={label}>
          {brandNode()}
          {links.length ? <ul className="gp-nav__links">{linkItems('bar')}</ul> : null}
          {links.length ? (
            <button
              ref={menuRef}
              type="button"
              className="gp-nav__menu body"
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls={open ? sheetId : undefined}
              onClick={() => setOpen(true)}
            >
              <span className="gp-nav__text">Menu</span>
            </button>
          ) : null}
          {ctaNode()}
        </nav>
      </header>
      {open ? (
        <div ref={sheetRef} id={sheetId} className="gp-sheet" role="dialog" aria-modal="true" aria-label="Menu" data-theme="light" onKeyDown={onSheetKeyDown}>
          {/* The bar's own row: wordmark, Close where Menu was, and the action tab. */}
          <div className="gp-sheet__bar gp-nav">
            {brandNode(() => setOpen(false))}
            <button ref={closeRef} type="button" className="gp-sheet__close body" onClick={close}>
              <span className="gp-nav__text">Close</span>
            </button>
            {ctaNode(() => setOpen(false))}
          </div>
          <ul className="gp-sheet__links">{linkItems('sheet')}</ul>
        </div>
      ) : null}
    </>
  );
}
