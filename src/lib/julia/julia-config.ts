import FalloffType from "./falloff-type";
import FractalType from "./fractal-type";

export const defaultConfig: Config = {
  fractal: FractalType.Julia,
  width: 960,
  height: 540,

  translationX: 0,
  translationY: 0,
  rotation: 0,
  scale: 1,

  maxIterations: 100,
  radius: 4,

  fractalColorR: 1,
  fractalColorG: 1,
  fractalColorB: 1,
  fractalColorA: 1,
  backgroundColorR: 0,
  backgroundColorG: 0,
  backgroundColorB: 0,
  backgroundColorA: 0,

  setColorR: 0,
  setColorG: 0,
  setColorB: 0,
  setColorA: 1,
  setValue: 0,
  useSetColorOverValue: false,
  
  falloffType: FalloffType.Sigmoid,
  falloffStrength: 5,

  real: -0.8727786784188099,
  imaginary: -0.2595344618589833,

  exponent: 2,
};

export interface Config {
  // Fractal
  fractal: FractalType;
  
  // Julia
  real: number;
  imaginary: number;

  // Mandelbrot
  exponent: number;

  // Calculation
  maxIterations: number;
  radius: number;

  // Image
  width: number;
  height: number;

  // Transformation
  translationX: number;
  translationY: number;
  rotation: number;
  scale: number;

  // Colors
  fractalColorR: number;
  fractalColorG: number;
  fractalColorB: number;
  fractalColorA: number;
  backgroundColorR: number;
  backgroundColorG: number;
  backgroundColorB: number;
  backgroundColorA: number;

  setColorR: number;
  setColorG: number;
  setColorB: number;
  setColorA: number;
  setValue: number;
  useSetColorOverValue: boolean;
  
  // Falloff
  falloffType: FalloffType;
  falloffStrength: number;
}
