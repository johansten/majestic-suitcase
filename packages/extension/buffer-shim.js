import * as buffer from 'buffer';
if (!globalThis.Buffer) {
  Object.defineProperty(globalThis, 'Buffer', {
    value: buffer.Buffer,
    writable: false,
    configurable: false,
  });
}
