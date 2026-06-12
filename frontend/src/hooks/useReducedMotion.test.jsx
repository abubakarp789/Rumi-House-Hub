import { act, renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { useReducedMotion } from './useReducedMotion';

it('tracks prefers-reduced-motion changes', () => {
  let listener;
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: (_event, callback) => { listener = callback; },
    removeEventListener: vi.fn()
  });

  const { result } = renderHook(() => useReducedMotion());
  expect(result.current).toBe(false);

  act(() => listener({ matches: true }));
  expect(result.current).toBe(true);
});
