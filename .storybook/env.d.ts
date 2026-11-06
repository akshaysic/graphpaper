/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Set only by the dark test pass in vitest.config.ts.
  readonly GP_THEME?: 'light' | 'dark';
}
