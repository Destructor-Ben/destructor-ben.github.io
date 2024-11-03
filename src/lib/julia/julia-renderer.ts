import Logger from "./julia-logger";
import FractalType from "./fractal-type";
import { mat4 } from "gl-matrix";
import { createProgramFromSource } from "./shader-utils";
import VertSource from "./shaders/vert.glsl?raw";
import FragSource from "./shaders/frag.glsl?raw";

// TODO: scaling, rotating, and translating
// TODO: image size settings
// TODO: colour, falloff, and background settings
// TODO: non escaping point colour settings
// TODO: multilayering settings
// TODO: escape radius and max iter settings
// TODO: animation with keyframes and different interpolation types
// TODO: mandelbrot
// TODO: random helpful article - https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context#creating_the_square_plane
export default class JuliaRenderer {
  private gl: WebGL2RenderingContext | null = null;
  private vertexBuffer: WebGLBuffer | null = null;
  private program: WebGLProgram | null = null;
  private uniformLocations: any = {};
  private fractal = FractalType.None;
  private config: any = {};

  constructor(canvas: HTMLCanvasElement) {
    Logger.log("Initializing...");

    // Initialize OpenGL
    const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

    if (!gl) {
      Logger.error("Unable to initialize WebGL 2");
      return;
    }

    this.gl = gl;
    Logger.log(gl.getParameter(gl.VERSION));
    Logger.log(gl.getParameter(gl.SHADING_LANGUAGE_VERSION));

    // Create gl resources
    this.prepare();

    Logger.log("Successfully initialized");
  }

  private prepare() {
    const gl = this.gl;
    if (!gl) {
      return;
    }

    // Prepare screen clearing
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Create the fullscreen quad
    const bufferData = [
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      -1.0,
    ];

    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(bufferData),
      gl.STATIC_DRAW,
    );

    // Setup the vertex attribute array
    const floatSize = 32 / 8;
    const vertexSize = floatSize * 2;

    gl.vertexAttribPointer(
      0, // Location - constant
      2, // Pull out 2 values
      gl.FLOAT, // Type is 32 bit float
      false, // Don't normalize
      vertexSize, // Stride - Size of one vertex
      0, // Offset - How many bytes from the start of the vertex
    );

    gl.enableVertexAttribArray(0);

    // Compile fractal shader
    this.compileShader(gl);
  }

  private compileShader(gl: WebGL2RenderingContext) {
    // Delete existing shader
    if (this.program)
      gl.deleteProgram(this.program);

    // Return if we don't have a fractal active
    if (this.fractal === FractalType.None)
      return;

    // Sub in values for frag source
    const fragSource = this.createFragmentSource(FragSource);

    // Create the program
    const program = createProgramFromSource(gl, VertSource, fragSource);
    if (!program) {
      Logger.error("Unable to create fractal shader");
      return;
    }

    this.program = program;

    // Update uniforms
    this.updateUniforms(gl);
  }

  private updateUniforms(gl: WebGL2RenderingContext) {
    if (!this.program)
      return;

    switch (this.fractal) {
      case FractalType.Julia:
        this.updateUniformsJulia(gl, this.program);
        break;
      default:
        break;
    }

    // Update the transform uniform location
    this.uniformLocations.transform = gl.getUniformLocation(this.program, "uTransform");
  }

  private updateUniformsJulia(gl: WebGL2RenderingContext, program: WebGLProgram) {
    this.uniformLocations = {
      real: gl.getUniformLocation(program, "uReal"),
      imaginary: gl.getUniformLocation(program, "uImaginary"),
    };
  }
  
  // TODO: finish
  private createFragmentSource(source: string) {
    // TODO: This is temporary
    const juliaConfig = {
      paramUniforms: `
      uniform float uReal;
      uniform float uImaginary;`,
      paramFuncDef: "float cx, float cy",
      paramFuncUsage: "uReal, uImaginary",
    }

    const config = this.config;
    // Add commas at the start of the parameters
    let paramsDef = juliaConfig.paramFuncDef;
    if (paramsDef.length > 0)
      paramsDef = ", " + paramsDef;
    
    let paramsUsage = juliaConfig.paramFuncUsage;
    if (paramsUsage.length > 0)
      paramsUsage = ", " + paramsUsage;
  
    // Fractal type params
    source = source.replace("{{params_uniforms}}", juliaConfig.paramUniforms);
    source = source.replace("{{params_def}}", paramsDef);
    source = source.replace("{{params_call}}", paramsUsage);

    // Calculation params
    source = source.replace("{{max_iterations}}", config.maxIterations);
    source = source.replace("{{radius_squared}}", (config.radius * config.radius).toFixed(1));

    return source;
  }

  destroy() {
    Logger.log("Destroying...");

    this.gl?.deleteProgram(this.program);
    this.gl?.deleteBuffer(this.vertexBuffer);
    this.gl = null;

    Logger.log("Successfully destroyed");
  }

  setFractal(fractal: FractalType, config: any) {
    this.fractal = fractal;
    this.config = config;

    // TODO: only recompile when certain config values are changed
    if (this.gl)
      this.compileShader(this.gl);
  }

  render() {
    const gl = this.gl;
    if (!gl) {
      return;
    }

    // Clear
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Update the shader
    if (this.fractal !== FractalType.None) {
      gl.useProgram(this.program);
      this.updateShader(gl);
    } else {
      gl.useProgram(null);
    }

    // Render
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  resize(width: number, height: number) {
    this.gl?.viewport(0, 0, width, height);
  }

  private updateShader(gl: WebGL2RenderingContext) {
    this.updateTransform(gl);
  
    switch (this.fractal) {
      case FractalType.Julia:
        this.updateJulia(gl);
        break;
      default:
        break;
    }
  }

  private updateTransform(gl: WebGL2RenderingContext) {
    const transform = mat4.create();

    // Scale
    const scale = 1 / this.config.scale; // TODO: put the config scale in here, we reciprocate because of some reason
    mat4.scale(transform, transform, [scale, scale, scale])

    // Rotation
    mat4.rotate(transform, transform, this.config.rotation, [0, 0, 1]);
  
    // Translation
    mat4.translate(transform, transform, [
      this.config.translationX as number,
      this.config.translationY as number,
      0
    ]);
    
    // Aspect ratio
    const aspectRatio = this.config.width / this.config.height;
    mat4.scale(transform, transform, [aspectRatio, 1, 1]);
  
    gl.uniformMatrix4fv(this.uniformLocations.transform, false, transform);
  }

  private updateJulia(gl: WebGL2RenderingContext) {
    gl.uniform1f(this.uniformLocations.real, this.config.real);
    gl.uniform1f(this.uniformLocations.imaginary, this.config.imaginary);
  }
}
