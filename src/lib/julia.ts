const frameRate = 10;

const vertexShaderSource = `
attribute vec4 VertexPosition;

void main() {
  gl_Position = VertexPosition;
}
`;

// TODO: implement julia here
// Background colour is (1, 4, 9) (rgb)
const fragmentShaderSource = `
void main() {
  gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
}
`;

export default class Julia
{
  canvas: HTMLCanvasElement | null;
  gl: WebGL2RenderingContext | null;
  intervalID: number | null = null;
  frameCount = 0;

  vertexBuffer: WebGLBuffer | null = null;
  vertexShader: WebGLShader | null = null;
  fragmentShader: WebGLShader | null = null;
  glProgram: WebGLProgram | null = null;

  constructor(canvas: HTMLCanvasElement) {
    console.log("[Julia] Initializing...")
  
    this.canvas = canvas;
    this.gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

    if (!this.gl)
    {
      console.error("[Julia] Unable to initialize because WebGL2 is unsupported");
      return;
    }

    this.prepare();

    this.intervalID = setInterval(() => {
      this.draw();
    }, 1000 / frameRate);
  }

  prepare() {
    const gl = this.gl;
    if (!gl)
      return;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Create the fullscreen quad
    const bufferData = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);

    // Create the shaders
    function loadShader(gl: WebGL2RenderingContext, type: GLenum, source: string) {
      const shader = gl.createShader(type);
      if (!shader)
        return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);
    
      // Check complication
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`[Julia] An error occurred while compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
      }
    
      return shader;
    }
  
    this.vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    this.fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!this.vertexShader) {
      console.error("[Julia] Failed to create vertex shader");
      return;
    }

    if (!this.fragmentShader) {
      console.error("[Julia] Failed to create fragment shader");
      return;
    }

    // Create the shader program
    this.glProgram = gl.createProgram();
    if (!this.glProgram) {
      console.error("[Julia] Failed to create shader program");
      return;
    }

    gl.attachShader(this.glProgram, this.vertexShader);
    gl.attachShader(this.glProgram, this.fragmentShader);
    gl.linkProgram(this.glProgram);

    // Error checking
    if (!gl.getProgramParameter(this.glProgram, gl.LINK_STATUS)) {
      console.error(`[Julia] Unable to initialize the shader program: ${gl.getProgramInfoLog(this.glProgram)}`);
      return;
    }

    // Enable program
    gl.useProgram(this.glProgram)

    // Setup the vertex attribute array
    const location = gl.getAttribLocation(this.glProgram, "VertexPosition");
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

    console.log("[Julia] Successfully initialized")
  }

  draw() {
    const gl = this.gl;
    if (!gl)
      return;

    // Clear
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Draw fullscreen quad with shader
    // TODO: set a uniform in the fragment shader
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Increment frame count
    this.frameCount++;
  }

  destroy() {
    console.log("[Julia] Destroying...")

    this.gl?.deleteBuffer(this.vertexBuffer);
    this.gl?.deleteShader(this.vertexShader);
    this.gl?.deleteShader(this.fragmentShader);
    this.gl?.deleteProgram(this.glProgram);

    if (this.intervalID)
      clearInterval(this.intervalID);

    this.gl = null;
    this.canvas = null;

    console.log("[Julia] Successfully destroyed")
  }
};
