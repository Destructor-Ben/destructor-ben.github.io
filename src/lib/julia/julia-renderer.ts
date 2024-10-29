import Logger from "./julia-logger";
import Fractal from "./fractal";
import FractalType from "./fractal-type";

import VertShader from "./shaders/vert.glsl?raw";
import FragShaderJulia from "./shaders/frag-julia.glsl?raw";

import { mat4 } from "gl-matrix";

// TODO: config, animations, streamlined rendering
export default class JuliaRenderer {
  private canvas: HTMLCanvasElement | null;
  private gl: WebGL2RenderingContext | null = null;
  private vertexBuffer: WebGLBuffer | null = null;

  private fractals = new Map<FractalType, Fractal>();
  private fractal = FractalType.None;
  private config: any = {}

  constructor(canvas: HTMLCanvasElement) {
    Logger.log("Initializing...");

    // Initialize OpenGL
    this.canvas = canvas;
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

  prepare() {
    const gl = this.gl;
    if (!gl) {
      return;
    }

    // Prepare screen clearing
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Create the fullscreen quad
    const bufferData = [
      1.0, 1.0, 1.0, 1.0,
      -1.0, 1.0, -1.0, 1.0,
      1.0, -1.0, 1.0, -1.0,
      -1.0, -1.0, -1.0, -1.0,
    ];
  
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(bufferData),
      gl.STATIC_DRAW,
    );

    // Setup the vertex attribute array
    // LLTT - Each character is one float, L is location, T is texcoord
    const floatSize = 32 / 8;
    const locationSize = floatSize * 2;
    const texCoordSize = floatSize * 2;
    const vertexSize = locationSize + texCoordSize;

    gl.vertexAttribPointer(
      0, // Location - constant
      2, // Pull out 2 values
      gl.FLOAT, // Type is 32 bit float
      false, // Don't normalize
      vertexSize, // Stride - Size of one vertex
      0, // Offset - How many bytes from the start of the vertex
    );

    gl.vertexAttribPointer(
      1, // Location - constant
      2, // Pull out 2 values
      gl.FLOAT, // Type is 32 bit float
      false, // Don't normalize
      vertexSize, // Stride - Size of one vertex
      locationSize, // Offset - How many bytes from the start of the vertex
    );

    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);

    // Create fractals
    this.prepareFractals(gl);
  }

  prepareFractals(gl: WebGL2RenderingContext) {
    // Julia
    this.fractals.set(FractalType.Julia, new Fractal(
      gl,
      VertShader,
      FragShaderJulia,
      (gl, program, config) => {
        // Get uniform locations
        // TODO: probably cache these, also null checks
        const transformLocation = gl.getUniformLocation(program, "uTransform");
        const realLocation = gl.getUniformLocation(program, "uReal");
        const imaginaryLocation = gl.getUniformLocation(program, "uImaginary");

        // Create transform matrix
        if (!this.canvas) {
          return;
        }

        const transform = mat4.create();
        const aspectRatio = this.canvas.width / this.canvas.height;
        const scale = 1; // TODO: make this customizable
        const halfWidth = scale / 2;
        const halfHeight = halfWidth * aspectRatio;

        mat4.ortho(transform, -halfWidth, halfWidth, -halfHeight, halfHeight, -1, 1);

        // Set uniforms
        gl.uniformMatrix4fv(transformLocation, false, transform)
        gl.uniform1f(realLocation, config.real);
        gl.uniform1f(imaginaryLocation, config.imaginary);
      }
    ));

    // TODO: Mandelbrot
    //this.fractals.set(FractalType.Mandelbrot, new Fractal());    
  }

  destroy() {
    Logger.log("Destroying...");

    this.fractals.forEach((v, _k, _map) => {
      v.destroy();
    });

    this.gl?.deleteBuffer(this.vertexBuffer);
    this.gl = null;
    this.canvas = null;

    Logger.log("Successfully destroyed");
  }

  setFractal(fractal: FractalType, config: any) {
    this.fractal = fractal;
    this.config = config;
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
      this.fractals.get(this.fractal)?.updateShader(this.config);
    }
    else {
      gl.useProgram(null);
    }

    // Render
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
