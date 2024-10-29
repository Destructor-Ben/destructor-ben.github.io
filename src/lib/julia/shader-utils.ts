import Logger from "./julia-logger";

export function createShader(
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string,
) {
  const shader = gl?.createShader(type);
  if (!shader) {
    Logger.error(`Failed to create shader (shader type ${type})`);
    return null;
  }

  // Compile shader
  gl?.shaderSource(shader, source);
  gl?.compileShader(shader);

  // Check complication
  if (!gl?.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const infoLog = gl?.getShaderInfoLog(shader);
    Logger.error(`An error occurred while compiling the shaders: ${infoLog}`);

    gl?.deleteShader(shader);
    return null;
  }

  return shader;
}

export function createProgram(
  gl: WebGL2RenderingContext,
  vert: WebGLShader,
  frag: WebGLShader,
) {
  const program = gl.createProgram();
  if (!program) {
    Logger.error("Failed to create shader program");
    return null;
  }

  // Link the shaders
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);

  // Error checking
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const infoLog = gl?.getProgramInfoLog(program);
    Logger.error(`An error occurred while linking the shaders: ${infoLog}`);

    return null;
  }

  return program;
}

export function createProgramFromSource(
  gl: WebGL2RenderingContext,
  vertSource: string,
  fragSource: string,
) {
  const vertShader = createShader(gl, gl.VERTEX_SHADER, vertSource);
  const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragSource);

  // Don't need to make error message because it is already handled
  if (!vertShader || !fragShader) {
    return null;
  }

  const program = createProgram(gl, vertShader, fragShader);

  // Delete vert and frag shaders
  // Only done in this function because the other one can have the shaders reused
  // This one can't
  gl.deleteShader(vertShader);
  gl.deleteShader(fragShader);

  return program;
}
