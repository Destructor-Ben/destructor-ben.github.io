import Logger from "./julia-logger";
import Fractal from "./fractal";
import FractalType from "./fractal-type";

// TODO: config, animations, streamlined rendering
export default class JuliaRenderer {
  private canvas: HTMLCanvasElement | null;
  private gl: WebGL2RenderingContext | null = null;
  private vertexBuffer: WebGLBuffer | null = null;

  private fractals = new Map<FractalType, Fractal>();
  private fractal = FractalType.None;
  private config: Object = {}

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
    const bufferData = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(bufferData),
      gl.STATIC_DRAW,
    );

    // Setup the vertex attribute array
    const location = 0; // Always the same, don't need to change - gl.getAttribLocation(program, "VertexPosition");
    const numComponents = 2; // Pull out 2 values per iteration
    const type = gl.FLOAT; // The data in the buffer is 32bit floats
    const normalize = false; // Don't normalize
    const stride = 0; // How many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // How many bytes inside the buffer to start from
    gl.vertexAttribPointer(
      location,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );

    gl.enableVertexAttribArray(location);

    // Create fractals
    //this.fractals.set(FractalType.Julia, new Fractal());
    //this.fractals.set(FractalType.Mandelbrot, new Fractal());
    // TODO: create the fractal types
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

  setFractal(fractal: FractalType, config: Object) {
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
