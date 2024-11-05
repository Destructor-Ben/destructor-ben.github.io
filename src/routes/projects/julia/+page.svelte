<script lang="ts">
  import SettingsImg from "$lib/img/settings.svg";

  import JuliaRenderer from "$lib/julia/julia-renderer";
  import FractalType from "$lib/julia/fractal-type";

  import NumberInput from "$lib/components/NumberInput.svelte";
  import ToggleInput from "$lib/components/ToggleInput.svelte";

  import { fade } from "svelte/transition";

  // Whether settings are shown
  let showSettings = $state(false);

  // #region Renderer Setup

  // Default settings
  let config = $state({
    fractal: FractalType.Julia,
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
    renderer.setFractal(config);
    renderer.render();
  });

  // #endregion

  // #region Mouse and Keybind Control

  let useMouseForCoords = $state(false);
  
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
  function saveImage() {
    console.log("Saving image...");

    const imgLink = canvas.toDataURL("image/png");

    // Create a temporary link element and "click" it
    let link = document.createElement("a");
    link.href = imgLink;
    link.download = "Julia.png";
    link.click();

    console.log("Image saved");
  }

  function saveAnimation() {
    console.log("Saving animation...");
    
    console.log("Animation saved");
  }

  // TODO: save and load configs

  // #endregion
</script>

<svelte:head>
  <title>Julia - Destructor_Ben</title>
</svelte:head>

<svelte:window onkeypress={handleKeyPress} />

<!-- TODO: sort out the sizes of the fractal and settings page properly -->

<canvas width={config.width} height={config.height} bind:this={canvas} onmousemove={handleMouseMove}></canvas>

<!-- Inputs -->
<div class="overlay">
  <div class="buttons">
    <button class="settings button" onclick={() => showSettings = !showSettings}>
      <img src={SettingsImg} alt="Settings" width=30 height=30 class:open={showSettings} />
    </button>

    <button onclick={saveImage} class="button">Save Image - Not Working</button>
    <button onclick={saveAnimation} class="button">Save Animation - Not Working</button>
  </div>
  
  {#if showSettings}
    <div class="inputs" transition:fade={{ duration: 300 }}>
      <h2>Image</h2>

      <NumberInput bind:value={config.width} min={1} max={3840} forceMinMaxNumber={true}>
        Width
      </NumberInput>
      
      <NumberInput bind:value={config.height} min={1} max={3840} forceMinMaxNumber={true}>
        Height
      </NumberInput>

      <h2>Coordinates</h2>

      <ToggleInput bind:value={useMouseForCoords}>
        Use mouse for coordinates - Press M to toggle
      </ToggleInput>

      <NumberInput bind:value={config.real} min={-3} max={3} step={0.01} disabled={useMouseForCoords}>
        Real Component
      </NumberInput>
      
      <NumberInput bind:value={config.imaginary} min={-3} max={3} step={0.01} disabled={useMouseForCoords}>
        Imaginary Component
      </NumberInput>

      <h2>Transformation</h2>

      <NumberInput bind:value={config.translationX} min={-3} max={3} step={0.01}>
        Translation X
      </NumberInput>
      
      <NumberInput bind:value={config.translationY} min={-3} max={3} step={0.01}>
        Translation Y
      </NumberInput>
      
      <NumberInput bind:value={config.rotation} min={0} max={Math.PI * 2} step={0.01}>
        Rotation
      </NumberInput>
      
      <NumberInput bind:value={config.scale} min={0.01} max={15} step={0.01}>
        Scale
      </NumberInput>
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
      gap: 1em;

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

      background-color: color-mix(in srgb, var(--col-mg) 75%, transparent);
      border: var(--border);

      gap: 0.5em;
      margin-top: 1em;
      padding: 1em;
      border-radius: 1em;
    }
  }
</style>