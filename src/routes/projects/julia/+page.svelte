<script lang="ts">
  import JuliaRenderer from "$lib/julia/julia-renderer";
  import Fractal from "$lib/julia/fractal";
  import JuliaVert from "$lib/julia/vert.glsl?raw";
  import JuliaFrag from "$lib/julia/frag-julia.glsl?raw";

  let useMouseForCoords = $state(false);
  let real = $state(0);
  let imaginary = $state(0);

  let canvas: HTMLCanvasElement;

  // Setup the renderer
  $effect(() => {
    const renderer = new JuliaRenderer(canvas);
    const fractal = new Fractal(JuliaVert, JuliaFrag, (gl, program) => {
      // Set the fractal location
      // -0.7, 0.27015 and 0.355, 0.355 are both cool
      const realLocation = gl.getUniformLocation(program, "Real");
      const imaginaryLocation = gl.getUniformLocation(program, "Imaginary");
      gl.uniform1f(realLocation, real);
      gl.uniform1f(imaginaryLocation, imaginary);
    });

    renderer.setFractal(fractal);
    renderer.render();

    return () => {
      renderer.destroy();
    }
  })

  // Mouse and keybind control
  $effect(() => {
    canvas.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keypress", handleKeyPress)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keypress", handleKeyPress)
    }
  })

  function handleMouseMove(event: MouseEvent) {
    if (!useMouseForCoords)
      return;

    const x = event.clientX;
    const y = event.clientY;

    // Normalize to coordinate space for fractal
    // TODO: do this properly
    const width = canvas.width;
    const height = canvas.height;

    const mouseReal = (x - width) / width;
    const mouseImaginary = (y - height) / height;

    real = mouseReal;
    imaginary = mouseImaginary;
  }

  // Toggle whether mouse movement is used
  function handleKeyPress(event: KeyboardEvent)
  {
    if (event.code === "KeyM")
    {
      useMouseForCoords = !useMouseForCoords;
    }
  }
</script>

<svelte:head>
  <title>Julia - Destructor_Ben</title>
</svelte:head>

<h1>Julia Renderer</h1>

<!-- Inputs -->
<div>
  <label>
    <input type="checkbox" bind:checked={useMouseForCoords} />
    <span>Use mouse for coordinates - Press m to toggle</span>
  </label>

  <label>
    <input type="number" bind:value={real} disabled={useMouseForCoords} />
    <span>Real Component</span>
  </label>
  
  <label>
    <input type="number" bind:value={imaginary} disabled={useMouseForCoords} />
    <span>Imaginary Component</span>
  </label>
</div>

<canvas id="julia-canvas" width="960" height="540" bind:this={canvas}></canvas>

<style>
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
  }

  canvas {
    width: 50%;
  }
</style>