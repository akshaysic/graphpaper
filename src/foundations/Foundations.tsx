import type { CSSProperties, ReactNode } from 'react';

import tokens from '../tokens/tokens.json';
import './foundations.css';

// Every value on the Foundations pages comes from tokens.json; nothing is retyped here.

type ThemedValue = string | { light: string; dark: string };
type NamedToken = { name: string; value: ThemedValue; usage: string };
type TypeStyle = (typeof tokens.type.groups)[number]['styles'][number];

const THEMES = ['light', 'dark'] as const;
// grid-line is a translucent rule meant to sit on paper; on ground it all but disappears.
const ON_PAPER_TOKEN = 'grid-line';

export function ColorTable() {
  return <ThemedTokenTable tokens={tokens.color.tokens} renderSample={colorSwatch} />;
}

function colorSwatch(name: string) {
  const background = name === ON_PAPER_TOKEN ? `linear-gradient(var(--${name}), var(--${name})) var(--paper)` : `var(--${name})`;
  return <div className="fd-swatch" style={{ background }} />;
}

export function ShadowTable() {
  return (
    <ThemedTokenTable
      tokens={tokens.shadow.tokens}
      renderSample={(name) => <div className="fd-swatch fd-swatch--shadow" style={{ boxShadow: `var(--${name})` }} />}
    />
  );
}

export function TypeSpecimens() {
  return (
    <div className="fd-stack">
      {tokens.type.groups.map((group) => (
        <section key={group.name} className="fd-group">
          <h2 className="label fd-muted">{group.name}</h2>
          {'note' in group ? <p className="body fd-muted">{group.note}</p> : null}
          {group.styles.map((style) => (
            <article key={style.name} className="fd-type">
              <div className={`${style.name} fd-type__sample`}>{style.sample}</div>
              <dl className="fd-type__specs body">
                <dt className="label-wide">{style.name}</dt>
                <dd>{formatTypeSpecs(style)}</dd>
                <dd className="fd-muted">{style.usage}</dd>
              </dl>
            </article>
          ))}
        </section>
      ))}
      <p className="body fd-muted">Family: {tokens.type.families.sans}. {tokens.type.note}</p>
    </div>
  );
}

export function SpacingScale() {
  return (
    <div className="fd-stack">
      {tokens.spacing.tokens.map((token) => (
        <div key={token.name} className="fd-row">
          <TokenName name={token.name} value={token.value} />
          <div className="fd-measure">
            <div className="fd-bar" style={{ width: `var(--${token.name})`, height: token.name === 'grid-cell' ? `var(--${token.name})` : undefined }} />
          </div>
          <p className="body fd-muted">{token.usage}</p>
        </div>
      ))}
    </div>
  );
}

export function RadiusScale() {
  return (
    <div className="fd-radius-grid">
      {tokens.radius.tokens.map((token) => (
        <figure key={token.name} className="fd-radius">
          <div className="fd-radius__shape" style={{ borderTopLeftRadius: `var(--${token.name})` }} />
          <figcaption>
            <TokenName name={token.name} value={token.value} />
            <p className="body fd-muted">{token.usage}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function DurationDemos() {
  return (
    <div className="fd-stack">
      {tokens.duration.tokens.map((token) => (
        <MotionDemo key={token.name} name={token.name} value={token.value} usage={token.usage} style={{ '--fd-dur': `var(--${token.name})` } as CSSProperties} />
      ))}
    </div>
  );
}

export function EasingDemos() {
  return (
    <div className="fd-stack">
      {tokens.easing.tokens.map((token) => (
        <MotionDemo key={token.name} name={token.name} value={token.value} usage={token.usage} style={{ '--fd-ease': `var(--${token.name})` } as CSSProperties} />
      ))}
    </div>
  );
}

export function OpacityTable() {
  return (
    <div className="fd-stack">
      {tokens.opacity.tokens.map((token) => (
        <div key={token.name} className="fd-row">
          <TokenName name={token.name} value={token.value} />
          <div className="fd-measure">
            <div className="fd-bar fd-bar--block" style={{ opacity: `var(--${token.name})` }} />
          </div>
          <p className="body fd-muted">{token.usage}</p>
        </div>
      ))}
    </div>
  );
}

function ThemedTokenTable({ tokens: rows, renderSample }: { tokens: NamedToken[]; renderSample: (name: string) => ReactNode }) {
  return (
    <div className="fd-table" role="table" aria-label="Tokens in light and dark">
      <div className="fd-table__row fd-table__head label fd-muted" role="row">
        <span role="columnheader">Token</span>
        <span role="columnheader">Light</span>
        <span role="columnheader">Dark</span>
        <span role="columnheader">Usage</span>
      </div>
      {rows.map((token) => (
        <div key={token.name} className="fd-table__row" role="row">
          <span className="label-wide fd-table__name" role="rowheader">
            {token.name}
          </span>
          {THEMES.map((theme) => (
            <div key={theme} data-theme={theme} className="fd-themed" role="cell">
              {renderSample(token.name)}
              <code className="body">{themedValue(token.value, theme)}</code>
            </div>
          ))}
          <p className="body fd-muted" role="cell">
            {token.usage}
          </p>
        </div>
      ))}
    </div>
  );
}

function MotionDemo({ name, value, usage, style }: { name: string; value: string; usage: string; style: CSSProperties }) {
  return (
    <div className="fd-row">
      <TokenName name={name} value={value} />
      <div className="fd-motion" style={style} tabIndex={0} role="img" aria-label={`${name}: hover or focus to play`}>
        <div className="fd-motion__block" />
      </div>
      <p className="body fd-muted">{usage}</p>
    </div>
  );
}

function TokenName({ name, value }: { name: string; value: string }) {
  return (
    <div className="fd-token-name">
      <span className="label-wide">{name}</span>
      <code className="body fd-muted">{value}</code>
    </div>
  );
}

function themedValue(value: ThemedValue, theme: (typeof THEMES)[number]): string {
  return typeof value === 'string' ? value : value[theme];
}

function formatTypeSpecs(style: TypeStyle): string {
  const tracking = 'letterSpacing' in style ? style.letterSpacing : 'normal';
  return `${style.fontSize} / ${style.lineHeight}, weight ${style.fontWeight}, tracking ${tracking}`;
}
