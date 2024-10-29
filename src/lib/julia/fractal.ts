import Logger from "./julia-logger";
import { createProgramFromSource } from "./shader-utils";

export default class Fractal {
  gl: WebGL2RenderingContext;
  program: WebGLProgram | null = null;
  updateCallback: (gl: WebGL2RenderingContext, program: WebGLProgram, config: Object) => void;

  // TODO: reduce the boilerplate for shader code by using string interpolation
  constructor(
    gl: WebGL2RenderingContext,
    vertSource: string,
    fragSource: string,
    updateCallback: (gl: WebGL2RenderingContext, program: WebGLProgram, config: Object) => void,
  ) {
    this.gl = gl;
    this.updateCallback = updateCallback;

    if (!gl) {
      return;
    }

    // Create the program
    const program = createProgramFromSource(this.gl, vertSource, fragSource);
    if (!program) {
      Logger.error("Unable to create fractal shader");
      return;
    }

    this.program = program;
  }

  destroy() {
    this.gl?.deleteProgram(this.program);
  }

  updateShader(config: Object) {
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
}
