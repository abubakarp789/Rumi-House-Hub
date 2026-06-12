import { afterEach, expect, it, vi } from 'vitest';
import { supportsWebGL } from './webgl';

afterEach(() => vi.restoreAllMocks());

it('returns false when a WebGL context cannot be created', () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  expect(supportsWebGL()).toBe(false);
});

it('returns true when WebGL2 is available', () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation((name) => (
    name === 'webgl2' ? {} : null
  ));
  expect(supportsWebGL()).toBe(true);
});
