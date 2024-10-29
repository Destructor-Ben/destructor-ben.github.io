<script lang="ts">
  import JuliaRenderer from "$lib/julia/julia-renderer";
  import FractalType from "$lib/julia/fractal-type";

  let useMouseForCoords = $state(false);
  let real = $state(0);
  let imaginary = $state(0);

  let canvas: HTMLCanvasElement;
  let renderer: JuliaRenderer;

  // Setup the renderer
  $effect(() => {
    renderer = new JuliaRenderer(canvas);

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

  // Render the fractal when the input changes
  $effect(() => {
    // Set the fractal info
    renderer.setFractal(FractalType.Julia, {
      real: real,
      imaginary: imaginary
    });

    // Draw
    renderer.render();
  })

  // Recalculates the mouse movement
  function handleMouseMove(event: MouseEvent) {
    if (!useMouseForCoords)
      return;

    const canvasSize = canvas.getBoundingClientRect();

    const x = event.clientX - canvasSize.x;
    const y = event.clientY- canvasSize.y;

    const width = canvasSize.width;
    const height = canvasSize.height;

    // Normalize to coordinate space for fractal
    const mouseReal = (x - width / 2) / width * 2;
    const mouseImaginary = (y - height / 2) / height * 2;

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