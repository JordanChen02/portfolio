import { useState } from 'react';

export function useCarousel(length: number) {
  const [index, setIndex] = useState(0);

  const goTo = (i: number) => setIndex(i);
  const prev = () => setIndex((i) => (i - 1 + length) % length);
  const next = () => setIndex((i) => (i + 1) % length);

  return { index, goTo, prev, next };
}
