import type { Config } from "../julia-config";

export const recompileProperties = [
  "maxIterations",
];

export const functionDetails = {
  paramUniforms: "uniform float uRadiusSquared;",
  paramFuncDef: "",
  paramFuncUsage: "",
  funcImpl: `
  float cx = x;
  float cy = y;
  
  for (int iteration = 0; iteration < {{max_iterations}}; iteration++)
  { 
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

export function getFunctionParameters(config: Config) {
  return {
    max_iterations: config.maxIterations.toString(),
  }
}

export function updateUniforms(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
) {
  return {
    radiusSquared: gl.getUniformLocation(program, "uRadiusSquared"),
  };
}

export function updateShader(
  gl: WebGL2RenderingContext,
  uniformLocations: any,
  config: Config,
) {
  gl.uniform1f(uniformLocations.radiusSquared, config.radius * config.radius);
}
