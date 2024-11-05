import FractalType from "$lib/julia/fractal-type";

export const defaultConfig: Config = {
  fractal: FractalType.None,
  width: 960,
  height: 540,

  translationX: 0,
  translationY: 0,
  rotation: 0,
  scale: 1,

  maxIterations: 100,
  radius: 4,

  real: 0,
  imaginary: 0,

  exponent: 2,
}

export interface Config {
  // === Common & Required === \\
  fractal: FractalType,
  width: number,
  height: number,

  // === Common & Optional === \\
  // Transformation
  translationX: number,
  translationY: number,
  rotation: number,
  scale: number,

  // Calculations
  maxIterations: number,
  radius: number,
  
  // === Fractal Specific === \\
  // Julia
  real: number,
  imaginary: number,

  // Mandelbrot
  exponent: number,
}