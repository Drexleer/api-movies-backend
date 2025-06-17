// Polyfills for Node.js compatibility in Railway environment
import { webcrypto } from 'crypto';

// Polyfill for crypto.randomUUID() in Node.js < 19
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    writable: false,
    configurable: true,
  });
}

// Ensure crypto is also available in global scope for older modules
if (typeof global !== 'undefined' && !global.crypto) {
  Object.defineProperty(global, 'crypto', {
    value: webcrypto,
    writable: false,
    configurable: true,
  });
}

// Additional polyfill for environments where crypto might be partially available
if (typeof crypto !== 'undefined' && typeof crypto.randomUUID !== 'function') {
  Object.defineProperty(crypto, 'randomUUID', {
    value: webcrypto.randomUUID.bind(webcrypto),
    writable: false,
    configurable: true,
  });
}

export {};
