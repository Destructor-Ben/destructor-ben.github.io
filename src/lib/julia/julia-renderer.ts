import { error, log } from "./julia-logger";
import Fractal from "./fractal";

// TODO: config, animations, streamlined rendering
export default class JuliaRenderer {
  private canvas: HTMLCanvasElement | null;
  private gl: WebGL2RenderingContext | null = null;
  private vertexBuffer: WebGLBuffer | null = null;
  private fractal: Fractal | null = null;

  constructor(canvas: HTMLCanvasElement) {
    log("Initializing...");

    // Initialize OpenGL
    this.canvas = canvas;
    const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

    if (!gl) {
      error("Unable to initialize WebGL 2");
      return;
    }

    this.gl = gl;

    console.log(gl.getParameter(gl.VERSION));
    console.log(gl.getParameter(gl.SHADING_LANGUAGE_VERSION));

    // Prepare resources
    this.prepare();
    log("Successfully initialized");
  }

  prepare() {
    const gl = this.gl;
    if (!gl)
      return;

    // Prepare screen clearing
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Create the fullscreen quad
    const bufferData = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);
  
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

  }

  destroy() {
    log("Destroying...")
    
    this.setFractal(null);
    this.gl?.deleteBuffer(this.vertexBuffer);
    this.gl = null;
    this.canvas = null;

    log("Successfully destroyed")
  }

  setFractal(fractal: Fractal | null) {
    if (this.fractal)
      this.fractal.destroy();

    this.fractal = fractal;

    if (this.fractal)
      this.fractal.prepare(this.gl);
  }

  render() {
    const gl = this.gl;
    if (!gl)
      return;
    
    // Clear
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Render
    if (this.fractal)
      this.fractal.updateShader();

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
