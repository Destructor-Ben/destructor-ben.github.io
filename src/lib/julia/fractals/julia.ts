import type { Config } from "../julia-config";

export const recompileProperties = [
  "maxIterations",
];

export function createFragmentSource(source: string, config: Config) {
  // TODO: This is temporary - maybe just make this file export this config and do all the fucking around with the source text done in the compile function
  const juliaConfig = {
    paramUniforms: `
    uniform float uReal;
    uniform float uImaginary;
    uniform float uRadiusSquared;`,
    paramFuncDef: "float cx, float cy",
    paramFuncUsage: "uReal, uImaginary",
  };

  // Add commas at the start of the parameters
  let paramsDef = juliaConfig.paramFuncDef;
  if (paramsDef.length > 0) {
    paramsDef = ", " + paramsDef;
  }

  let paramsUsage = juliaConfig.paramFuncUsage;
  if (paramsUsage.length > 0) {
    paramsUsage = ", " + paramsUsage;
  }

  // Fractal type params
  source = source.replace("{{params_uniforms}}", juliaConfig.paramUniforms);
  source = source.replace("{{params_def}}", paramsDef);
  source = source.replace("{{params_call}}", paramsUsage);

  // Calculation params
  source = source.replace(
    "{{max_iterations}}",
    config.maxIterations.toString(),
  );

  return source;
}

export function updateUniforms(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
) {
  return {
    real: gl.getUniformLocation(program, "uReal"),
    imaginary: gl.getUniformLocation(program, "uImaginary"),
    radiusSquared: gl.getUniformLocation(program, "uRadiusSquared"),
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
}
