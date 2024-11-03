export function lerp(a: number, b: number, t: number) {
  return a + t * (b - a);
}

export function polyEaseOut(x: number, p: number) {
  return 1 - Math.pow(1 - x, p);
}