/**
 * Browser Polyfills for Node.js modules
 * Fixes compatibility issues with blockchain libraries
 */

// Buffer polyfill for browser compatibility
import { Buffer } from 'buffer';

// Make Buffer available globally
if (typeof globalThis !== 'undefined') {
  globalThis.Buffer = Buffer;
}

if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = window;
}

// Process polyfill
if (typeof process === 'undefined') {
  (globalThis as any).process = {
    env: {},
    nextTick: (fn: Function) => setTimeout(fn, 0),
    browser: true,
    version: '',
    versions: { node: '' }
  };
}

export { Buffer };