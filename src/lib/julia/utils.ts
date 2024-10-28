export function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

export function easeInOutQuad(t: number) {
  if (t < 0.5) {
    return 2 * t * t;
  } else {
    return -1 + (4 - 2 * t) * t;
  }
}
