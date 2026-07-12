import type * as ReactType from 'react';

declare global {
  interface Window {
    React: typeof ReactType;
  }
  var React: typeof ReactType;
  var process: { env: { ENV?: string; API_BASE_URL?: string; USE_MOCK?: string } };
}
