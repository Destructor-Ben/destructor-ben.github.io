import Logger from "./julia-logger";
import Fractal from "./fractal";
import FractalType from "./fractal-type";

import { mat4 } from "gl-matrix";

// TODO: scaling, rotating, and translating
// TODO: image size settings
// TODO: colour, falloff, and background settings
// TODO: non escaping point colour settings
// TODO: multilayering settings
// TODO: escape radius and max iter settings
// TODO: animation with keyframes and different interpolation types
// TODO: random helpful article - https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context#creating_the_square_plane
export default class JuliaRenderer {
  private gl: WebGL2RenderingContext | null = null;
  private vertexBuffer: WebGLBuffer | null = null;

  private fractals = new Map<FractalType, Fractal>();
  private fractal = FractalType.None;
  private compileConfig: any = {};
  private dynamicConfig: any = {};

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
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
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
    this.fractals.set(
      FractalType.Julia,
      new Fractal(
        gl,
        {
          paramUniforms: `
          uniform float uReal;
          uniform float uImaginary;`,
          paramFuncDef: "float cx, float cy",
          paramFuncUsage: "uReal, uImaginary",
          maxIterations: 100,
          radius: 4,
        },
        (gl, program, config) => {
          // Get uniform locations
          // TODO: probably cache these, also null checks
          const transformLocation = gl.getUniformLocation(
            program,
            "uTransform",
          );
          const realLocation = gl.getUniformLocation(program, "uReal");
          const imaginaryLocation = gl.getUniformLocation(
            program,
            "uImaginary",
          );

          // Create transform matrix
          const aspectRatio = config.width / config.height;
          const scale = 1;
          const halfWidth = scale / 2;
          const halfHeight = halfWidth * aspectRatio;

          const transform = mat4.create();
          mat4.ortho(
            transform,
            -halfWidth,
            halfWidth,
            -halfHeight,
            halfHeight,
            -1,
            1,
          );

          // Set uniforms
          gl.uniformMatrix4fv(transformLocation, false, transform);
          gl.uniform1f(realLocation, config.real);
          gl.uniform1f(imaginaryLocation, config.imaginary);
        },
      ),
    );

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

    Logger.log("Successfully destroyed");
  }

  getCurrentFractal() {
    if (this.fractal !== FractalType.None) {
      return this.fractals.get(this.fractal);
    }
    else {
      return null;
    }
  }

  setFractal(fractal: FractalType, dynamicConfig: any, compileConfig: any) {
    this.fractal = fractal;
    this.dynamicConfig = dynamicConfig;
    this.compileConfig = compileConfig;

    // TODO: recompile only some of the time
    this.getCurrentFractal()?.compileShader(this.compileConfig);
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
      this.getCurrentFractal()?.updateShader(this.dynamicConfig);
    } else {
      gl.useProgram(null);
    }

    // Render
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
