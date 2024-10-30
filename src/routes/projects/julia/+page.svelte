<script lang="ts">
  import JuliaRenderer from "$lib/julia/julia-renderer";
  import FractalType from "$lib/julia/fractal-type";

  // Image settings
  let imageWidth = $state(960);
  let imageHeight = $state(540);

  // Coordinates
  let useMouseForCoords = $state(false);
  let real = $state(0);
  let imaginary = $state(0);

  // Camera
  let translationX = $state(0);
  let translationY = $state(0);
  let rotation = $state(0);
  let scale = $state(1);

  // TODO: maybe make a JuliaCanvas component
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

  // When the canvas is resized we need to change the viewport size
  $effect(() => {
    renderer.resize(imageWidth, imageHeight);
  })

  // Render the fractal when the input changes
  $effect(() => {
    // Set the fractal info
    renderer.setFractal(FractalType.Julia, {
      real: real,
      imaginary: imaginary,
      width: imageWidth,
      height: imageHeight,
      maxIterations: 100,
      radius: 4,
      translationX: translationX,
      translationY: translationY,
      rotation: rotation,
      scale: scale,
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

<div class="root">
  <h1>Julia - Fractal Renderer</h1>
  <hr />

  <canvas id="julia-canvas" width={imageWidth} height={imageHeight} bind:this={canvas}></canvas>

  <!-- Inputs -->
  <h1>Settings</h1>
  <hr />
  <div class="inputs">
    <div>
      <h2>Image</h2>
      
      <label>
        <input type="range" bind:value={imageWidth} min=100 max=1000 />
        <input type="number" bind:value={imageWidth} />
        <span>Width</span>
      </label>
      
      <label>
        <input type="range" bind:value={imageHeight} min=100 max=1000 />
        <input type="number" bind:value={imageHeight} />
        <span>height</span>
      </label>
    </div>

    <div>
      <h2>Coordinates</h2>

      <label>
        <input type="checkbox" bind:checked={useMouseForCoords} />
        <span>Use mouse for coordinates - Press m to toggle</span>
      </label>

      <label>
        <input type="range" bind:value={real} min=-2 max=2 step=0.01 disabled={useMouseForCoords} />
        <input type="number" bind:value={real} disabled={useMouseForCoords} />
        <span>Real Component</span>
      </label>
      
      <label>
        <input type="range" bind:value={imaginary} min=-2 max=2 step=0.01 disabled={useMouseForCoords} />
        <input type="number" bind:value={imaginary} disabled={useMouseForCoords} />
        <span>Imaginary Component</span>
      </label>
    </div>

    <div>
      <h2>Camera</h2>

      <label>
        <input type="range" bind:value={translationX} min=-2 max=2 step=0.01 />
        <input type="number" bind:value={translationX} />
        <span>Translation X</span>
      </label>

      <label>
        <input type="range" bind:value={translationY} min=-2 max=2 step=0.01 />
        <input type="number" bind:value={translationY} />
        <span>Translation Y</span>
      </label>

      <label>
        <input type="range" bind:value={rotation} min={-Math.PI} max={Math.PI} step=0.01 />
        <input type="number" bind:value={rotation} />
        <span>Rotation</span>
      </label>

      <label>
        <input type="range" bind:value={scale} min=0.001 max=10 step=0.01 />
        <input type="number" bind:value={scale} />
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