import Logger from "$lib/julia/julia-logger";
import FractalType from "$lib/julia/fractal-type";
import { type Config, defaultConfig } from "$lib/julia/julia-config";

import { mat4 } from "gl-matrix";
import { createProgramFromSource } from "$lib/julia/shader-utils";

import VertSource from "$lib/julia/shaders/vert.glsl?raw";
import FragSource from "$lib/julia/shaders/frag.glsl?raw";

import * as JuliaFractal from "$lib/julia/fractals/julia";

// TODO: colour, falloff, and background settings
// TODO: non escaping point colour settings
// TODO: multilayering settings
// TODO: animation with keyframes and different interpolation types
// TODO: mandelbrot
// TODO: random helpful article - https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context#creating_the_square_plane
export default class JuliaRenderer {
  private gl: WebGL2RenderingContext | null = null;
  private vertexBuffer: WebGLBuffer | null = null;
  private program: WebGLProgram | null = null;
  private uniformLocations: any = {};
  private config: Config = defaultConfig;

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

    // Compile shaders
    // If we don't now, then setting config to the default doesn't cause the shader to compile at all
    this.compileShader(gl);
  }

  private compileShader(gl: WebGL2RenderingContext) {
    // Delete existing shader
    if (this.program)
      gl.deleteProgram(this.program);

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

  private createFragmentSource(source: string) {
    switch (this.config.fractal) {
      case FractalType.Julia:
        return JuliaFractal.createFragmentSource(source, this.config);
      default:
        return FragSource;
    }
  }

  private updateUniforms(gl: WebGL2RenderingContext) {
    if (!this.program)
      return;

    switch (this.config.fractal) {
      case FractalType.Julia:
        this.uniformLocations = JuliaFractal.updateUniforms(gl, this.program);
        break;
      default:
        break;
    }

    // Update the transform uniform location
    this.uniformLocations.transform = gl.getUniformLocation(this.program, "uTransform");
  }

  destroy() {
    Logger.log("Destroying...");

    this.gl?.deleteProgram(this.program);
    this.gl?.deleteBuffer(this.vertexBuffer);
    this.gl = null;

    Logger.log("Successfully destroyed");
  }

  setFractal(config: Partial<Config>) {
    // Allow default values for the config
    const strictConfig = { ...defaultConfig, ...config };

    // Calculate now so we don't have to store the old config
    const needsRecompile = this.needsRecompile(strictConfig);

    // Set the new config
    this.config = strictConfig;

    // Only recompile when certain config values are changed
    if (this.gl && needsRecompile)
      this.compileShader(this.gl);
  }
 
  private needsRecompile(config: Config) {
    // Checks if the values are different on both configs
    const hasValueChanged = <T extends keyof Config>(name: T) => {
      return this.config[name] !== config[name];
    }

    // Check if the fractal type changed
    if (hasValueChanged("fractal"))
      return true;
    
    // Get the fields to check
    let fields: string[] = [];
    switch (this.config.fractal) {
      case FractalType.Julia:
        fields = JuliaFractal.recompileProperties;
        break;
      default:
        break;
    }

    // Check if any field requires a recompile
    for (const field of fields) {
      if (hasValueChanged(field as keyof Config))
        return true;
    }

    return false;
  }

  render() {
    const gl = this.gl;
    if (!gl) {
      return;
    }

    // Clear
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Update the shader
    if (this.program) {
      gl.useProgram(this.program);
      this.updateShader(gl);
    } else {
      Logger.warn("No program is set")
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
  
    switch (this.config.fractal) {
      case FractalType.Julia:
        JuliaFractal.updateShader(gl, this.uniformLocations, this.config);
        break;
      default:
        break;
    }
  }

  // TODO: this is fucking dodgy
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
}
