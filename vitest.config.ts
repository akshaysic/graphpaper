import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Every story runs as a test in Chromium, once per theme, with the accessibility check from addon-a11y.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: (['light', 'dark'] as const).map((theme) => ({
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
        // preview.tsx reads this as the starting theme, so the accessibility check covers both.
        define: { 'import.meta.env.GP_THEME': JSON.stringify(theme) },
        test: {
          name: `storybook-${theme}`,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      })),
    },
  }),
);
