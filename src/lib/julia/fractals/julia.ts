import type { Config } from "../julia-config";

export const functionDetails = {
  uniforms: `
  uniform float uReal;
  uniform float uImaginary;
  uniform float uRadiusSquared;
  uniform int uMaxIterations;`,
  function: `
  float cx = uReal;
  float cy = uImaginary;

  for (int iteration = 0; iteration < 1000; iteration++)
  {
    if (iteration >= uMaxIterations)
      break;

    float sqrDst = x * x + y * y;

    // The point escaped
    if (sqrDst >= uRadiusSquared)
    {
      // Smoothing formula
      float ret = float(iteration) + 1.0 - log(log(sqrDst)) / log(2.0);
      return ret < 0.0 ? 0.0 : ret;
    }

    // Update position
    float tempX = x * x - y * y + cx;
    y = 2.0 * x * y + cy;
    x = tempX;
  }

  // If the point never escaped
  return -1.0;
  `
}

export function updateUniforms(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
) {
  return {
    real: gl.getUniformLocation(program, "uReal"),
    imaginary: gl.getUniformLocation(program, "uImaginary"),
    radiusSquared: gl.getUniformLocation(program, "uRadiusSquared"),
    maxIterations: gl.getUniformLocation(program, "uMaxIterations"),
  };
}

export function updateShader(
  gl: WebGL2RenderingContext,
  uniformLocations: any,
  config: Config,
) {
  gl.uniform1f(uniformLocations.real, config.real);
  gl.uniform1f(uniformLocations.imaginary, config.imaginary);
  gl.uniform1f(uniformLocations.radiusSquared, config.radius * config.radius);
  gl.uniform1i(uniformLocations.maxIterations, config.maxIterations);
}
