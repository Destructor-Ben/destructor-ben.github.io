<script lang="ts">
  import SettingsImg from "$lib/img/settings.svg";
  import FullscreenOpenImg from "$lib/img/fullscreen-open.svg";
  import FullscreenCloseImg from "$lib/img/fullscreen-close.svg";

  import JuliaRenderer from "$lib/julia/julia-renderer";
  import FractalType from "$lib/julia/fractal-type";
  import { defaultConfig } from "$lib/julia/julia-config";

  import NumberInput from "$lib/components/NumberInput.svelte";
  import ToggleInput from "$lib/components/ToggleInput.svelte";

  import { fly } from "svelte/transition";
  import SelectInput from "$lib/components/SelectInput.svelte";

  // TODO: add option for axes overlay
  // TODO: disable selecting elements with TAB when fullscreened
  // TODO: add better controls for changing transform
  // TOOD: sensitivity controls
  // TODO: add a focus indicator
  // TODO: fix the select menu being shit

  let isFullscreen = $state(false);
  let showSettings = $state(false);

  let navbar: HTMLElement;

  const fractalTypes = Object.keys(FractalType)
                             .filter(key => typeof FractalType[key as any] === 'number')
                             .map(key => ({ id: FractalType[key as any], name: key }));

  // Resize the canvas if we entered fullscreen
  function handleResize() {
    if (!isFullscreen) {
      return;
    }

    config.width = window.innerWidth;
    config.height = window.innerHeight - navbar.clientHeight;
  }

  function toggleFullscreen() {
    isFullscreen = !isFullscreen;

    // Focus canvas and reset canvas size
    if (isFullscreen) {
      canvas.focus();
      handleResize();
    }
    else {
      config.width = defaultConfig.width;
      config.height = defaultConfig.height;
    }
  }

  // #region Renderer Setup

  // Create the renderer
  let config = $state(defaultConfig);
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

  // #region Input

  let pressedKeys: { [key: string]: boolean } = {};
  let pressedMouse = false;

  function isCanvasFocused() {
    return document.activeElement === canvas;
  }

  function canvasContainsPoint(x: number, y: number) {
    const rect = canvas.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }
  
  // Mouse input
  function handleMouseMove(event: MouseEvent) {
    if (!canvasContainsPoint(event.clientX, event.clientY) || showSettings) {
      //TODO: bring back !isCanvasFocused() || 
      // For some reason, is is false while clicking and dragging
      return;
    }

    modifyJuliaCoords(event);
    moveWithMouse(event);
  }

  function modifyJuliaCoords(event: MouseEvent) {
    if (!pressedKeys["KeyJ"]) {
      return;
    }

    const canvasSize = canvas.getBoundingClientRect();

    const x = event.clientX - canvasSize.x;
    const y = event.clientY - canvasSize.y;

    const width = canvasSize.width;
    const height = canvasSize.height;

    // Normalize to [-1 - 1] coordinate space for fractal
    config.real = (x - width / 2) / width * 2;
    config.imaginary = (y - height / 2) / height * 2;
  }

  // TODO: make this only world if the start coord is in the canvas too?
  // TODO: only move the mouse if left button is down, not all
  // TODO: stop moving if we are updating the Julia coords
  function moveWithMouse(event: MouseEvent) {
    if (!pressedMouse) {
      return;
    }
    console.log("E")

    // Scale is included so we move more when we are zoomed in and less when we are zoomed out
    // TODO: make 250 be an actual value to prevent mouse drifting
    config.translationX -= event.movementX / 250 / config.scale;
    config.translationY -= event.movementY / 250 / config.scale;
  }

  // TODO: maybe prevent defaults? also for keys?
  function handleMouseDown(event: MouseEvent) {
    pressedMouse = true;
  }

  function handleMouseUp(event: MouseEvent) {
    pressedMouse = false;
  }

  // Keyboard input
  // TODO: add WASD and arrow keys input
  function handleKeyDown(event: KeyboardEvent) {
    // Prevents repeated presses from holding a key down
    if (!pressedKeys[event.code]) {
      pressedKeys[event.code] = true;
      onKeyDown(event.code);
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    // Prevents repeated presses from holding a key down
    if (pressedKeys[event.code]) {
      pressedKeys[event.code] = false;
      onKeyUp(event.code);
    }
  }

  // These run regardless of focus or whether the mouse is over the canvas
  function onKeyDown(key: string) {
    
  }

  function onKeyUp(key: string) {
    
  }

  // Scroll wheel input
  function handleScroll(event: WheelEvent) {
    if (!isCanvasFocused() || showSettings) {
      return;
    }

    // Zooming
    event.preventDefault();

    // We want scaling to be proportional to the existing scale
    // Since adding 0.1 scale when we are already at 300 barely does anything
    // TODO: make 1000 be an actual value like the mouse
    // TODO: zoom to mouse, not center of screen
    config.scale += config.scale * -event.deltaY / 1000;
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
  <title>Julia - Fractal Renderer</title>
</svelte:head>

<svelte:window
  onresize={handleResize}
  onmousemove={handleMouseMove}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
  onkeydown={handleKeyDown}
  onkeyup={handleKeyUp} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div id="window"
  class:fullscreen={isFullscreen}
  onclick={() => canvas.focus({ preventScroll: true })}>
  <nav bind:this={navbar}>
    <div class="left">
      <button
        class="settings-toggle button"
        title="Open Settings"
        onclick={() => showSettings = !showSettings}
      >
        <img src={SettingsImg} alt="Open Settings" width=30 height=30 class:open={showSettings} />
      </button>

      <!-- TODO: saving fractal image
      <button onclick={saveImage} class="button">Save Image - Not Working</button>
      <button onclick={saveAnimation} class="button">Save Animation - Not Working</button>
      -->
    </div>
    
    <div class="centre">
      <h1>Julia - Fractal Renderer</h1>
      <a class="link" href="https://github.com/Destructor-Ben/destructor-ben.github.io/tree/main/src/lib/julia">Source Code</a>
    </div>
    
    <div class="right">
      <button
        class="fullscreen-toggle button"
        onclick={toggleFullscreen}
        title="Toggle Fullscreen"
      >
        <img src={!isFullscreen ? FullscreenOpenImg : FullscreenCloseImg} alt="Toggle Fullscreen" width=30 height=30 />
      </button>
    </div>
  </nav>

  <div class="content" style={`width: ${config.width}px; height: ${config.height}px;`}>
    <canvas
      width={config.width}
      height={config.height}
      bind:this={canvas}
      tabindex="0"
      class:settings-open={showSettings}>
    </canvas>
  
    <div class="overlay" onwheel={handleScroll}>
      <!-- Settings -->
      {#if showSettings}
        <div class="settings-window" transition:fly={{ x: '-100%', duration: 300 }}>
          <div class="settings-container">
            <h2>Image</h2>

            <p>
              Avoid messing with these because they are automatically set.
              <br />
              If you want an image at a specific resolution, fullscreen, then change the width and height.
            </p>
      
            <NumberInput bind:value={config.width} min={1} max={3840} forceMinMaxNumber={true} disabled={!isFullscreen}>
              Width
            </NumberInput>
            
            <NumberInput bind:value={config.height} min={1} max={3840} forceMinMaxNumber={true} disabled={!isFullscreen}>
              Height
            </NumberInput>

            <h2>Fractal Type</h2>

            <SelectInput bind:value={config.fractal} options={fractalTypes}>
              Fractal
            </SelectInput>

            {#if config.fractal === FractalType.Julia}
              <h2>Julia Coordinates</h2>

              <p>Hold J to change the coordinates with the mouse.</p>
        
              <NumberInput bind:value={config.real} min={-3} max={3} step={0.01}>
                Real Component
              </NumberInput>
              
              <NumberInput bind:value={config.imaginary} min={-3} max={3} step={0.01}>
                Imaginary Component
              </NumberInput>
            {/if}

            {#if config.fractal === FractalType.Mandelbrot}
              <h2>Mandelbrot Exponent</h2>

              <p>Negative and fractional exponents are allowed.</p>
              
              <NumberInput bind:value={config.exponent} min={-5} max={5} step={0.01}>
                Exponent
              </NumberInput>
            {/if}
      
            <h2>Transformation</h2>
      
            <NumberInput bind:value={config.translationX} min={-3} max={3} step={0.01}>
              Translation X
            </NumberInput>
            
            <NumberInput bind:value={config.translationY} min={-3} max={3} step={0.01}>
              Translation Y
            </NumberInput>
            
            <NumberInput bind:value={config.rotation} min={0} max={Math.PI * 2} step={0.01}>
              Rotation (Radians)
            </NumberInput>
            
            <NumberInput bind:value={config.scale} min={0.01} max={15} step={0.01}>
              Scale
            </NumberInput>

            <h2>Renderer</h2>

            <NumberInput bind:value={config.maxIterations} min={1} max={1000} step={1}>
              Iterations - Higher means more quality but slower
            </NumberInput>

            <NumberInput bind:value={config.radius} min={1} max={1000} step={0.01}>
              Escape Radius - How far a point must travel to be considered part of the set
            </NumberInput>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(main) {
    align-items: center;
  }

  #window {
    background-color: var(--col-bg);
    overflow: hidden;
    display: inline-block;
    width: fit-content;

    &:not(.fullscreen) {
      border-radius: 2em;
      border: var(--border);
    }

    &.fullscreen {
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
    }
  }

  nav {
    padding: 1em;
    background-color: var(--col-mg);
    border-bottom: var(--border);

    &, .left, .right, .centre {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1em;
    }

    .centre {
      flex-direction: column;
      gap: 0;
    }

    button.settings-toggle, button.fullscreen-toggle {
      padding: 0.5em;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    button.settings-toggle img {
      transition-property: transform;
      transform: rotate(0.00001deg);

      &.open {
        transform: rotate(60deg);
      }
    }
  }

  .content {
    position: relative;
    overflow: hidden;

    canvas, .overlay {
      width: 100%;
      height: 100%;
    }

    canvas {
      transition-property: opacity;

      &.settings-open {
        opacity: 0.5;
      }
    }

    .overlay {
      position: absolute;
      top: 0;
    }
    
    .settings-window {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: calc(100% - 2em);
      width: fit-content;

      background-color: color-mix(in srgb, var(--col-mg) 75%, transparent);
      border: var(--border);

      margin: 1em;
      padding: 1em;
      border-radius: 1em;

      /* TODO: style scrollbar */
      .settings-container {
        overflow-y: scroll;
        padding-right: 1em;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5em;

        p {
          text-align: center;
        }
      }
    }
  }
</style>