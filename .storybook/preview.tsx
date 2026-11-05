import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import type { Decorator, Preview } from '@storybook/react-vite';
import { useSyncExternalStore, type PropsWithChildren } from 'react';
import { themes } from 'storybook/theming';

import '../src/tokens/tokens.css';
import '../src/styles/components.css';
import './docs.css';
import { getTheme, subscribeTheme } from './theme-store';

const VIEWPORTS = {
  phone: { name: 'Phone 390', styles: { width: '390px', height: '844px' }, type: 'mobile' },
  tablet: { name: 'Tablet 768', styles: { width: '768px', height: '1024px' }, type: 'tablet' },
  desktop: { name: 'Desktop 1440', styles: { width: '1440px', height: '900px' }, type: 'desktop' },
} as const;

const withTheme: Decorator = (Story, context) => (
  <div
    data-theme={context.globals.theme}
    style={{
      background: 'var(--ground)',
      color: 'var(--ink)',
      // Fill the canvas so a dark theme has no light edge; inside docs the story sits inline.
      minHeight: context.viewMode === 'docs' ? undefined : '100vh',
    }}
  >
    <Story />
  </div>
);

function ThemedDocsContainer({ children, context }: PropsWithChildren<DocsContainerProps>) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme);
  return (
    <div data-theme={theme} className="gp-docs">
      <DocsContainer context={context} theme={theme === 'dark' ? themes.dark : themes.light}>
        {children}
      </DocsContainer>
    </div>
  );
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Graphpaper theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [withTheme],
  parameters: {
    layout: 'fullscreen',
    viewport: { options: VIEWPORTS },
    a11y: { test: 'error' },
    docs: { container: ThemedDocsContainer },
    options: {
      storySort: {
        order: [
          'Foundations',
          ['Read me first', 'Overview', 'Colors', 'Type', 'Spacing and radius', 'Motion'],
          'Actions',
          'Navigation',
          'Type',
          'Canvas',
          'Content',
          'Sections',
          'Motion',
        ],
      },
    },
  },
};

// Storybook reads the default export.
export default preview;
