<script lang="ts">
  import SettingsImg from "$lib/img/settings.svg";

  import JuliaRenderer from "$lib/julia/julia-renderer";
  import FractalType from "$lib/julia/fractal-type";

  import { fade } from "svelte/transition";

  // Whether settings are shown
  let showSettings = $state(false);

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

  // #region Saving

  // TODO: save and load images + animations
  function SaveImage() {
    console.log("Saving image...");

    const imgLink = canvas.toDataURL("image/png");

    // Create a temporary link element and "click" it
    let link = document.createElement("a");
    link.href = imgLink;
    link.download = "Julia.png";
    link.click();

    console.log("Image saved");
  }

  function SaveAnimation() {
    console.log("Saving animation...");
    
    console.log("Animation saved");
  }

  // TODO: save and load configs

  // #endregion
</script>

<svelte:head>
  <title>Julia - Destructor_Ben</title>
</svelte:head>

<!-- TODO: sort out the sizes of the fractal and settings page properly -->

<canvas width={config.width} height={config.height} bind:this={canvas}></canvas>

<!-- Inputs -->
<div class="overlay">
  <div class="buttons">
    <button class="settings" onclick={() => showSettings = !showSettings}>
      <img src={SettingsImg} alt="Settings" width=30 height=30 class={showSettings ? "open" : ""} />
    </button>

    <button onclick={SaveImage}>Save Image - Not Working</button>
    <button onclick={SaveAnimation}>Save Animation - Not Working</button>
  </div>
  
  {#if showSettings}
    <div class="inputs" transition:fade={{ duration: 300 }}>
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
  {/if}
</div>

<style>
  canvas {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    border-radius: 1em;
    border: var(--border);
  }

  .overlay {
    position: absolute;
    padding: 1em;

    .buttons {
      display: flex;
      align-items: center;
      gap: 0.5em;

      button.settings {
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          transition-property: transform;

          &.open {
            transform: rotate(60deg);
          }
        }
      }
    }
    
    .inputs {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1em;
      margin-top: 1em;

      background-color: color-mix(in srgb, var(--col-mg) 75%, transparent);
      padding: 1em;
      border-radius: 1em;
      border: var(--border);

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
  }

  /* TODO: Temporary */
  input {
    color: black;
  }
</style>