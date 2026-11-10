// NavBarProps and NavBar below are superseded by v1.1 (docs/V1.1.md). The current props are in src/components/NavBar/NavBar.tsx.
import type * as React from 'react';

type Corner = 'bl' | 'br' | 'tl' | 'tr';
type Action = { label: string; href?: string; onClick?: () => void };

export interface CtaTabProps { size?: 's' | 'l' | 'xl'; corner?: Corner; href?: string; onClick?: () => void; style?: React.CSSProperties; className?: string; 'aria-label'?: string; children?: React.ReactNode }
export declare function CtaTab(props: CtaTabProps): React.ReactElement;

export interface NavLinkProps { href?: string; current?: boolean; onClick?: () => void; className?: string; children?: React.ReactNode }
export declare function NavLink(props: NavLinkProps): React.ReactElement;

export interface ArrowButtonProps { direction?: 'prev' | 'next'; label?: string; onClick?: () => void; className?: string }
export declare function ArrowButton(props: ArrowButtonProps): React.ReactElement;

/** checked + onChange for a plain switch; progress 0..1 when scroll drives it. */
export interface ToggleProps { checked?: boolean; onChange?: (next: boolean) => void; progress?: number; label?: string; className?: string }
export declare function Toggle(props: ToggleProps): React.ReactElement;

/** position "sticky" or "fixed" renders two zero-height layers; place it as a direct child of the scrolling element. */
export interface NavBarProps { brand?: string | React.ReactNode; brandHref?: string; links?: { label: string; href?: string; current?: boolean }[]; cta?: Action; progress?: number; position?: 'static' | 'sticky' | 'fixed'; blend?: boolean; label?: string; className?: string }
export declare function NavBar(props: NavBarProps): React.ReactElement;

export interface SplitHeadlineProps { left: React.ReactNode; right: React.ReactNode; emphasis?: 'left' | 'right' | 'both'; joiner?: '+' | React.ReactNode; size?: 'xl' | 'l'; as?: string; style?: React.CSSProperties; className?: string }
export declare function SplitHeadline(props: SplitHeadlineProps): React.ReactElement;

export interface SectionIntroProps { title: React.ReactNode; align?: 'left' | 'center'; introPosition?: 'above' | 'below'; as?: string; className?: string; children?: React.ReactNode }
export declare function SectionIntro(props: SectionIntroProps): React.ReactElement;

export interface GraphPaperProps { as?: string; framed?: boolean; style?: React.CSSProperties; className?: string; children?: React.ReactNode }
export declare function GraphPaper(props: GraphPaperProps): React.ReactElement;

export interface NodeCardProps { type?: string; model?: string; kind?: 'media' | 'text'; src?: string; alt?: string; width?: number | string; height?: number | string; style?: React.CSSProperties; className?: string; children?: React.ReactNode }
export declare function NodeCard(props: NodeCardProps): React.ReactElement;

export interface CanvasNode { id: string; x: number; y: number; w: number; h: number; type?: string; model?: string; kind?: 'media' | 'text'; src?: string; alt?: string; text?: React.ReactNode }
export interface NodeCanvasProps { nodes: CanvasNode[]; links?: [string, string][]; nodesMobile?: CanvasNode[]; linksMobile?: [string, string][]; height?: number; draggable?: boolean; hint?: string; label?: string; className?: string }
export declare function NodeCanvas(props: NodeCanvasProps): React.ReactElement;

export interface ToolChipsProps { items: { label: string; src?: string; alt?: string }[]; layout?: 'row' | 'scatter'; positions?: { x: number; y: number }[]; height?: number; center?: { width?: number; height?: number; src?: string; alt?: string }; className?: string }
export declare function ToolChips(props: ToolChipsProps): React.ReactElement;

export interface HeaderCardProps { label: string; tone?: 'text' | 'media'; src?: string; alt?: string; action?: Action; actionStyle?: React.CSSProperties; style?: React.CSSProperties; className?: string; children?: React.ReactNode }
export declare function HeaderCard(props: HeaderCardProps): React.ReactElement;

export interface PanelProps { style?: React.CSSProperties; className?: string; children?: React.ReactNode }
export declare function Panel(props: PanelProps): React.ReactElement;

export interface MediaCardProps { title: string; src?: string; alt?: string; tags?: string[]; href?: string; onAction?: () => void; actionLabel?: string; active?: boolean; style?: React.CSSProperties; className?: string }
export declare function MediaCard(props: MediaCardProps): React.ReactElement;

export interface CardRailProps { items: MediaCardProps[]; label?: string; start?: number; cardWidth?: number; gap?: number; className?: string }
export declare function CardRail(props: CardRailProps): React.ReactElement;

/** height: its own scroll area of that height; without it, the window scrolls. */
export interface ScrollSpyListProps { items: string[]; aside?: React.ReactNode; offset?: number; height?: number; onActiveChange?: (index: number) => void; className?: string }
export declare function ScrollSpyList(props: ScrollSpyListProps): React.ReactElement;

export interface FooterSlabProps { statement?: [React.ReactNode, React.ReactNode]; name?: React.ReactNode; about?: React.ReactNode; columns?: { title: string; links: { label: string; href?: string }[] }[]; legal?: string; cta?: Action; theme?: 'light' | 'dark'; className?: string }
export declare function FooterSlab(props: FooterSlabProps): React.ReactElement;

export interface ScrollMorphProps { left?: string; right?: string; height?: number; runway?: number; size?: 'xl' | 'l'; prompt?: React.ReactNode; outputAlt?: string; labels?: { prompt?: string; output?: string; run?: string }; label?: string; className?: string }
export declare function ScrollMorph(props: ScrollMorphProps): React.ReactElement;

/** root: the scrolling element when it is not the window. */
export interface RevealProps { as?: string; root?: React.RefObject<HTMLElement>; style?: React.CSSProperties; className?: string; children?: React.ReactNode }
export declare function Reveal(props: RevealProps): React.ReactElement;

export declare function useReducedMotion(): boolean;
/** 0..1 across start..end px of scroll in the element, or the window when ref is null. */
export declare function useScrollProgress(ref: React.RefObject<HTMLElement> | null, opts?: { start?: number; end?: number }): number;

declare global {
  interface Window {
    Graphpaper: {
      CtaTab: typeof CtaTab; NavLink: typeof NavLink; ArrowButton: typeof ArrowButton; Toggle: typeof Toggle; NavBar: typeof NavBar;
      SplitHeadline: typeof SplitHeadline; SectionIntro: typeof SectionIntro; GraphPaper: typeof GraphPaper; NodeCard: typeof NodeCard;
      NodeCanvas: typeof NodeCanvas; ToolChips: typeof ToolChips; HeaderCard: typeof HeaderCard; Panel: typeof Panel;
      MediaCard: typeof MediaCard; CardRail: typeof CardRail; ScrollSpyList: typeof ScrollSpyList; FooterSlab: typeof FooterSlab;
      ScrollMorph: typeof ScrollMorph; Reveal: typeof Reveal; useReducedMotion: typeof useReducedMotion; useScrollProgress: typeof useScrollProgress;
    };
  }
}
