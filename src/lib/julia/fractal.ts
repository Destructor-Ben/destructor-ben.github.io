import Logger from "./julia-logger";
import { createProgramFromSource } from "./shader-utils";

import VertSource from "./shaders/vert.glsl?raw";
import FragSource from "./shaders/frag.glsl?raw";

// Annoyingly, these have to have 2 configs, one for uniforms,
// another from parameters that are subbed into the source before compilation
// TODO: what even is the point of this class if I can just modify the shader easily?
export default class Fractal {
  gl: WebGL2RenderingContext;
  program: WebGLProgram | null = null;
  updateCallback: (
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    config: any,
  ) => void;

  constructor(
    gl: WebGL2RenderingContext,
    compileConfig: any,
    updateCallback: (
      gl: WebGL2RenderingContext,
      program: WebGLProgram,
      config: any,
    ) => void,
  ) {
    this.gl = gl;
    this.updateCallback = updateCallback;

    if (!gl) {
      return;
    }

    this.compileShader(compileConfig);
  }

  createFragmentSource(source: string, config: any) {
    // Add commas at the start of the parameters
    let paramsDef = config.paramFuncDef;
    if (paramsDef.length > 0)
      paramsDef = ", " + paramsDef;
    
    let paramsUsage = config.paramFuncUsage;
    if (paramsUsage.length > 0)
      paramsUsage = ", " + paramsUsage;
  
    // Fractal type params
    source = source.replace("{{params_uniforms}}", config.paramUniforms);
    source = source.replace("{{params_def}}", paramsDef);
    source = source.replace("{{params_call}}", paramsUsage);

    // Calculation params
    source = source.replace("{{max_iterations}}", config.maxIterations);
    source = source.replace("{{radius_squared}}", (config.radius * config.radius).toFixed(1));

    console.log(source);

    return source;
  }

  compileShader(config: any) {
    // Delete existing shader
    if (this.program)
      this.destroy();

    // Sub in values for frag source
    const fragSource = this.createFragmentSource(FragSource, config);

    // Create the program
    const program = createProgramFromSource(this.gl, VertSource, fragSource);
    if (!program) {
      Logger.error("Unable to create fractal shader");
      return;
    }

    this.program = program;
  }

  updateShader(config: any) {
    // Null checks
    const gl = this.gl;
    if (!gl) {
      return;
    }

    const program = this.program;
    if (!program) {
      return;
    }

    // Set the program to be active and let the shader update it's parameters
    gl.useProgram(program);
    this.updateCallback(gl, program, config);
  }

  destroy() {
    this.gl?.deleteProgram(this.program);
  }
}
