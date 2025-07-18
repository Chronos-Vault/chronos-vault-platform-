/**
 * Browser polyfills for Node.js modules
 */

// Buffer polyfill
if (typeof window !== 'undefined' && !window.Buffer) {
  import('buffer').then(({ Buffer }) => {
    window.Buffer = Buffer;
    window.global = window;
  }).catch(() => {
    // Fallback if buffer import fails
    console.warn('Buffer polyfill failed to load');
  });
}

// Process polyfill
if (typeof window !== 'undefined' && !window.process) {
  window.process = {
    env: {
      NODE_ENV: 'development'
    }
  } as any;
}