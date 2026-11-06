import 'react';

// Components drive CSS through custom properties such as --p; this lets style objects set them without a cast.
declare module 'react' {
  interface CSSProperties {
    [customProperty: `--${string}`]: string | number | undefined;
  }
}
