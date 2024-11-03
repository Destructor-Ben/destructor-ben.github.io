export function lerp(a: number, b: number, t: number) {
  return a + t * (b - a);
}

export function easeInSine(x: number): number {
  return 1 - Math.cos((x * Math.PI) / 2);
}

export function easeOutSine(x: number): number {
  return Math.sin((x * Math.PI) / 2);
}

export function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

export function easeInExpo(x: number): number {
  return x === 0 ? 0 : Math.pow(2, 10 * (x - 1));
}

export function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function easeInOutExpo(x: number): number {
  if (x === 0) {
    return 0;
  }

  if (x === 1) {
    return 1;
  }

  return x < 0.5
    ? Math.pow(2, 20 * x - 10) / 2
    : (2 - Math.pow(2, -20 * x + 10)) / 2;
}

export function easeInPoly(x: number, n: number): number {
  return Math.pow(x, n);
}

export function easeOutPoly(x: number, n: number): number {
  return 1 - Math.pow(1 - x, n);
}

export function easeInOutPoly(x: number, n: number): number {
  return x < 0.5 ? Math.pow(2 * x, n) / 2 : 1 - Math.pow(-2 * x + 2, n) / 2;
}
