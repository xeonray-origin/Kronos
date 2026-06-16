import type * as ReactType from 'react';

declare global {
  interface Window {
    React: typeof ReactType;
  }
  var React: typeof ReactType;
}
