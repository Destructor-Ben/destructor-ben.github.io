import { log, error } from "./julia-logger";

export default class Fractal {
  vertSource: string;
  fragSource: string;

  gl: WebGL2RenderingContext | null = null;
  vertexShader: WebGLShader | null = null;
  fragmentShader: WebGLShader | null = null;
  program: WebGLProgram | null = null;

  constructor(vertSource: string, fragSource: string) {
    this.vertSource = vertSource;
    this.fragSource = fragSource;
  }

  prepare(gl: WebGL2RenderingContext | null) {
    this.gl = gl;

    if (!gl)
      return;
    
    // Create the shaders
    function loadShader(type: GLenum, source: string) {
      const shader = gl?.createShader(type);
      if (!shader)
        return null;

      gl?.shaderSource(shader, source);
      gl?.compileShader(shader);
    
      // Check complication
      if (!gl?.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        error(`An error occurred while compiling the shaders: ${gl?.getShaderInfoLog(shader)}`);
        gl?.deleteShader(shader);
        return null;
      }
    
      return shader;
    }
  
    this.vertexShader = loadShader(gl?.VERTEX_SHADER, this.vertSource);
    this.fragmentShader = loadShader(gl?.FRAGMENT_SHADER, this.fragSource);

    if (!this.vertexShader) {
      error("Failed to create vertex shader");
      return;
    }

    if (!this.fragmentShader) {
      error("Failed to create fragment shader");
      return;
    }

    // Create the shader program
    this.program = gl?.createProgram();
    if (!this.program) {
      error("Failed to create shader program");
      return;
    }

    // Link the shaders
    gl.attachShader(this.program, this.vertexShader);
    gl.attachShader(this.program, this.fragmentShader);
    gl.linkProgram(this.program);

    // Error checking
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(this.program)}`);
      return;
    }

    // Enable program
    gl.useProgram(this.program)
  }

  destroy() {
    this.gl?.deleteShader(this.vertexShader);
    this.gl?.deleteShader(this.fragmentShader);
    this.gl?.deleteProgram(this.program);
  }

  updateShader() {
    const gl = this.gl;
    if (!gl)
      return;

    const program = this.program;
    if (!program)
      return;

    // -0.7, 0.27015 and 0.355, 0.355 are both cool
    const location1 = gl.getUniformLocation(program, "Real");
    const location2 = gl.getUniformLocation(program, "Imaginary");
    gl.uniform1f(location1, 0.355);
    gl.uniform1f(location2, 0.355);
  }
}