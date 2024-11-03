<script lang="ts">
  import JuliaRenderer from "$lib/julia/julia-renderer";
  import FractalType from "$lib/julia/fractal-type";

  // #region Renderer Setup

  // Default settings
  let config = $state({
    real: 0,
    imaginary: 0,
    width: 960,
    height: 540,
    maxIterations: 100,
    radius: 4,
    translationX: 0,
    translationY: 0,
    rotation: 0,
    scale: 1,
  });
  
  // Create the renderer
  let canvas: HTMLCanvasElement;
  let renderer: JuliaRenderer;

  $effect(() => {
    renderer = new JuliaRenderer(canvas);

    return () => {
      renderer.destroy();
    }
  })

  // Resize viewport when canvas size changed
  $effect(() => {
    renderer.resize(config.width, config.height);
  })

  // Render the fractal
  $effect(() => {
    renderer.setFractal(FractalType.Julia, config);
    renderer.render();
  });

  // #endregion

  // #region Mouse and Keybind Control

  let useMouseForCoords = $state(false);

  // Setup hooks
  $effect(() => {
    canvas.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keypress", handleKeyPress)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keypress", handleKeyPress)
    }
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

    config.real = mouseReal;
    config.imaginary = mouseImaginary;
  }

  // Toggle whether mouse movement is used
  function handleKeyPress(event: KeyboardEvent)
  {
    if (event.code === "KeyM")
    {
      useMouseForCoords = !useMouseForCoords;
    }
  }

  // #endregion
</script>

<svelte:head>
  <title>Julia - Destructor_Ben</title>
</svelte:head>

<div class="root">
  <h1>Julia - Fractal Renderer</h1>
  <hr />

  <canvas id="julia-canvas" width={config.width} height={config.height} bind:this={canvas}></canvas>

  <!-- Inputs -->
  <h1>Settings</h1>
  <hr />
  <div class="inputs">
    <div>
      <h2>Image</h2>
      
      <label>
        <input type="range" bind:value={config.width} min=100 max=1000 />
        <input type="number" bind:value={config.width} />
        <span>Width</span>
      </label>
      
      <label>
        <input type="range" bind:value={config.height} min=100 max=1000 />
        <input type="number" bind:value={config.height} />
        <span>Height</span>
      </label>
    </div>

    <div>
      <h2>Coordinates</h2>

      <label>
        <input type="checkbox" bind:checked={useMouseForCoords} />
        <span>Use mouse for coordinates - Press m to toggle</span>
      </label>

      <label>
        <input type="range" bind:value={config.real} min=-2 max=2 step=0.01 disabled={useMouseForCoords} />
        <input type="number" bind:value={config.real} disabled={useMouseForCoords} />
        <span>Real Component</span>
      </label>
      
      <label>
        <input type="range" bind:value={config.imaginary} min=-2 max=2 step=0.01 disabled={useMouseForCoords} />
        <input type="number" bind:value={config.imaginary} disabled={useMouseForCoords} />
        <span>Imaginary Component</span>
      </label>
    </div>

    <div>
      <h2>Camera</h2>

      <label>
        <input type="range" bind:value={config.translationX} min=-2 max=2 step=0.01 />
        <input type="number" bind:value={config.translationX} />
        <span>Translation X</span>
      </label>

      <label>
        <input type="range" bind:value={config.translationY} min=-2 max=2 step=0.01 />
        <input type="number" bind:value={config.translationY} />
        <span>Translation Y</span>
      </label>

      <label>
        <input type="range" bind:value={config.rotation} min={-Math.PI} max={Math.PI} step=0.01 />
        <input type="number" bind:value={config.rotation} />
        <span>Rotation</span>
      </label>

      <label>
        <input type="range" bind:value={config.scale} min=0.001 max=10 step=0.01 />
        <input type="number" bind:value={config.scale} />
        <span>Scale</span>
      </label>
    </div>
  </div>
</div>

<style>
  .root {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5em;

    canvas {
      border: var(--border);
      border-radius: 1em;
      margin: 0.5em;
      height: 540px;
    }
  }

  .inputs {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;

    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 0.5em;

      label {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1em;
        width: 100%;
      }
    }
  }

  /* Temporary */
  input {
    color: black;
  }
</style>