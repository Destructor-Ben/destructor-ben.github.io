<script lang="ts">
  import NZFlag from "$lib/img/nz-flag.png";
  import ProfilePicture from "$lib/img/pfp.png";

  import JuliaRenderer from "$lib/julia/julia-renderer";
  import FractalType from "$lib/julia/fractal-type";

  import { lerp, polyEaseOut } from "$lib/julia/interpolation";

  // #region Animation
  // TODO: clean up the animation itself
  // Either just make a cool animation or make it shape into my pfp

  const startCoords = [5, 5];
  const endCoords = [0.276, 0.483];

  const startScale = 1;
  const endScale = 0.6;
  
  const fps = 60;
  const animationSeconds = 4;
  const maxIterations = fps * animationSeconds;
  const millisecondsPerFrame = 1 / fps * 1000;

  let animationComplete = $state(false);
  let config = $state({
    real: startCoords[0],
    imaginary: startCoords[1],
    width: 0,
    height: 0,
    maxIterations: 100,
    radius: 4,
    translationX: 0,
    translationY: 0,
    rotation: 0,
    scale: startScale,
  });

  function UpdateFractal(t: number) {
    const t3 = polyEaseOut(t, 3);
    const t2 = polyEaseOut(t, 2);

    config.real = lerp(startCoords[0], endCoords[0], t3);
    config.imaginary = lerp(startCoords[1], endCoords[1], t3);
    config.scale = lerp(startScale, endScale, t2);
  }

  // #endregion
  
  // #region Renderer

  let canvas: HTMLCanvasElement;
  let renderer: JuliaRenderer;

  // Create the renderer
  $effect(() => {
    renderer = new JuliaRenderer(canvas);

    return () => {
      renderer.destroy();
    }
  })

  // Resize the canvas when the window size changes
  $effect(() => {
    window.addEventListener('resize', OnResize);

    return () => {
      window.removeEventListener('resize', OnResize);
    }
  });

  // Set initial size
  $effect(() => {
    OnResize();
  })

  function OnResize() {
    config.width = window.innerWidth;
    config.height = window.innerHeight;
    renderer.resize(config.width, config.height);
  }

  // Render the fractal
  $effect(() => {
    renderer.setFractal(FractalType.Julia, config);
    renderer.render();
  });

  // Setup animation
  $effect(() => {
    console.log("Starting animation...")

    let iterations = 0;

    // Start animation
    const intervalID = setInterval(() => {
      // Update fractal
      const t = iterations / maxIterations;
      UpdateFractal(t);
      iterations++;

      // Stop animation
      if (iterations >= maxIterations) {
        console.log("Animation complete")
        clearInterval(intervalID);
        animationComplete = true;
      }
    }, millisecondsPerFrame);
  })

  // #endregion
</script>

<svelte:head>
  <title>Destructor_Ben</title>
</svelte:head>

<!-- Appears behind everything -->
<canvas width={config.width} height={config.height} class={animationComplete ? "anim-complete" : ""} bind:this={canvas}></canvas>

  <!-- Basic info about me -->
<div id="intro" class={animationComplete ? "anim-complete" : ""}>
  <h1>About Me - Destructor_Ben</h1>
  <hr />
  <div>
    <!-- svelte-ignore a11y_img_redundant_alt -->
    <img class="pfp" src={ProfilePicture} alt="Profile Picture" />
    <p>
      I'm a 16 year old guy from New Zealand <img
        class="nz-flag"
        src={NZFlag}
        alt="NZ Flag"
      /> with a passion for programming, electronics, and maths.
    </p>
  </div>

  <div>
    <a class="button" href="#more-about-me">See More</a>
    <a class="button" href="/projects">Projects</a>
  </div>
</div>

<!-- SVGs used in my GitHub profile -->
<div id="more-about-me" class={animationComplete ? "anim-complete" : ""}>
  <h1>More About Me</h1>
  <div>
    <img
      alt="Interests"
      src="https://raw.githubusercontent.com/Destructor-Ben/Destructor-Ben/refs/heads/main/interests.svg"
    />
    <img
      alt="Future Projects"
      src="https://raw.githubusercontent.com/Destructor-Ben/Destructor-Ben/refs/heads/main/future-projects.svg"
    />
  </div>

  <img
    alt="Tools"
    src="https://raw.githubusercontent.com/Destructor-Ben/Destructor-Ben/refs/heads/main/tools.svg"
  />
</div>

<style>
  .nz-flag {
    height: 1em;
  }

  .pfp {
    height: 10em;
  }

  canvas {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
  }

  #intro {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
    height: 100vh;

    & > div {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2em;
      padding: 2em;
      
      & > p {
        width: 50%;
      }
    }
  }

  #more-about-me {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 46px;
    padding: 1em;

    & > img {
      width: 846px;
      height: 375px;
    }

    & > div {
      display: flex;
      gap: 46px;

      & > img {
        width: 400px;
        height: 300px;
      }
    }
  }

  /* Animate the opacity */
  #intro, #more-about-me, canvas {
    transition-duration: 2s;
    transition-property: opacity;
  }

  #intro, #more-about-me {
    opacity: 0;
    z-index: -99999;

    &.anim-complete {
      opacity: 1;
      z-index: 0;
    }
  }

  canvas {
    opacity: 1;

    &.anim-complete {
      opacity: 0;
    }
  }
</style>
