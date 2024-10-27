const frameRate = 10;

const vertexShaderSource = `
precision highp float;

attribute vec4 VertexPosition;

varying vec2 TexCoord;

void main() {
  gl_Position = VertexPosition;
  TexCoord = VertexPosition.xy;
}
`;

// TODO: allow swapping the shader to change fractals
// TODO: move these into separate files
// Background colour is (1, 4, 9) (rgb)
const fragmentShaderSource = `
precision highp float;

uniform float Real;
uniform float Imaginary;

varying vec2 TexCoord;

float Julia(float x, float y, float cx, float cy, float radius)
{
    float radiusSquared = radius * radius;

    for (int iteration = 0; iteration < 100; iteration++)
    { 
        // The point escaped
        if (x * x + y * y >= radiusSquared)
        {
            // Smoothing formula
            float z = x * x + y * y;
            float ret = float(iteration) + 1.0 - log(log(z)) / log(2.0);
            return ret < 0.0 ? 0.0 : ret;
        }

        // Update position
        float tempX = x * x - y * y;
        y = 2.0 * x * y + cy;
        x = tempX + cx;
    }

    // If the point never escaped
    return -1.0;
}

void main() {
  float fractalValue = Julia(TexCoord.x, TexCoord.y, Real, Imaginary, 4.0);
  gl_FragColor = vec4(fractalValue, fractalValue, fractalValue, 1.0);
}
`;

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

function easeInOutQuad(t: number) {
  if (t < 0.5) {
      return 2 * t * t;
  } else {
      return -1 + (4 - 2 * t) * t;
  }
}

// TODO: change to JuliaRenderer
// TODO: allow not rendering every frame
// TODO: animations
// TODO: config and also animations
export default class Julia
{
  canvas: HTMLCanvasElement | null;
  gl: WebGL2RenderingContext | null;
  intervalID: number | null = null;

  vertexBuffer: WebGLBuffer | null = null;
  vertexShader: WebGLShader | null = null;
  fragmentShader: WebGLShader | null = null;
  glProgram: WebGLProgram | null = null;
  
  frameCount = 0;
  real = 0;
  imaginary = 0;

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
      this.render();
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

  render() {
    const gl = this.gl;
    if (!gl)
      return;

    if (!this.glProgram)
      return;

    // Clear
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Animate values
    // -0.7, 0.27015 and 0.355, 0.355 are both cool
    let t = (this.frameCount / 100) % 1;
    t = easeInOutQuad(t);

    this.real = lerp(-0.7, 0.355, t);
    this.imaginary = lerp(0.27015, 0.355, t);
    console.log(`${t} ${this.real} ${this.imaginary}`);

    // Draw fullscreen quad with shader
    const location1 = gl.getUniformLocation(this.glProgram, "Real");
    const location2 = gl.getUniformLocation(this.glProgram, "Imaginary");
    gl.uniform1f(location1, this.real);
    gl.uniform1f(location2, this.imaginary);
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
