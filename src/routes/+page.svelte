<script lang="ts">
  import NZFlag from "$lib/img/nz-flag.png";
  import ProfilePicture from "$lib/img/pfp.png";
  
  import RainbowBorder from "$lib/components/RainbowBorder.svelte";

  import JuliaRenderer from "$lib/julia/julia-renderer";
  import FractalType from "$lib/julia/fractal-type";

  import { lerp, easeOutSine, easeOutExpo, easeOutPoly } from "$lib/julia/interpolation";

  // #region Fractal Animation
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

  let fractalAnimationComplete = $state(false);
  let config = $state({
    fractal: FractalType.Julia,
    real: startCoords[0],
    imaginary: startCoords[1],
    width: 0,
    height: 0,
    scale: startScale,
  });

  function updateFractal(t: number) {
    t = easeOutPoly(t, 4);

    config.real = lerp(startCoords[0], endCoords[0], t);
    config.imaginary = lerp(startCoords[1], endCoords[1], t);
    config.scale = lerp(startScale, endScale, t);
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

  // Set initial size
  $effect(() => {
    onResize();
  })

  // Resize the canvas when the window size changes
  function onResize() {
    config.width = window.innerWidth;
    config.height = window.innerHeight;
    renderer.resize(config.width, config.height);
  }

  // Render the fractal
  $effect(() => {
    renderer.setFractal(config);
    renderer.render();
  });

  // Setup animation
  $effect(() => {
    console.log("Starting fractal animation...")

    let iterations = 0;

    // Start animation
    const intervalID = setInterval(() => {
      // Update fractal
      const t = iterations / maxIterations;
      updateFractal(t);
      iterations++;

      // Stop animation
      if (iterations >= maxIterations) {
        console.log("Fractal animation complete")
        clearInterval(intervalID);
        fractalAnimationComplete = true;
      }
    }, millisecondsPerFrame);
  })

  // #endregion

  // #region Svg Scroll Animation

  let playingSvgSlideInAnimation = $state(false);
  let moreAboutMe: HTMLElement;

  function handleOnScroll() {
    // Don't turn the animation off if it has already played or if the other one is playing
    if (playingSvgSlideInAnimation || !fractalAnimationComplete)
      return;

    // Get the top of the element (minus the scroll amount)
    const elementTop = moreAboutMe.getBoundingClientRect().top;

    // Turn the animation on - the amount is the scroll padding
    if (elementTop <= 150) {
      playingSvgSlideInAnimation = true;
      console.log("Starting svg scroll animation...")
    }
  }

  // #endregion
</script>

<svelte:head>
  <title>Destructor_Ben</title>
</svelte:head>

<svelte:window onresize={onResize} />

<svelte:document onscroll={handleOnScroll} />

<!-- Appears behind everything -->
<canvas width={config.width} height={config.height} class:fractal-anim-complete={fractalAnimationComplete} bind:this={canvas}></canvas>

  <!-- Basic info about me -->
<div id="intro" class:fractal-anim-complete={fractalAnimationComplete}>
  <h1>About Me - Destructor_Ben</h1>
  <hr />
  <div>
    <img class="pfp" src={ProfilePicture} alt="PFP" />
    <p>
      I'm a 16 year old guy from New Zealand <img
        class="nz-flag"
        src={NZFlag}
        alt="NZ Flag"
      /> with a passion for programming, electronics, and maths.
    </p>
  </div>

  <div>
    <RainbowBorder>
      <a class="button" href="#more-about-me">See More</a>
    </RainbowBorder>
    
    <RainbowBorder>
      <a class="button" href="/projects">Projects</a>
    </RainbowBorder>
  </div>
</div>

<!-- SVGs used in my GitHub profile -->
<div id="more-about-me" bind:this={moreAboutMe} class:fractal-anim-complete={fractalAnimationComplete}>
  <h1>More About Me</h1>
  <div>
    <img
      id="about-me-svg-1"
      class="about-me-svg"
      class:animation-playing={playingSvgSlideInAnimation}
      alt="Interests"
      src="https://raw.githubusercontent.com/Destructor-Ben/Destructor-Ben/refs/heads/main/interests.svg"
    />
    <img
      id="about-me-svg-2"
      class="about-me-svg"
      class:animation-playing={playingSvgSlideInAnimation}
      alt="Future Projects"
      src="https://raw.githubusercontent.com/Destructor-Ben/Destructor-Ben/refs/heads/main/future-projects.svg"
    />
  </div>

  <img
    id="about-me-svg-3"
    class="about-me-svg"
    class:animation-playing={playingSvgSlideInAnimation}
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
    margin-top: 1em;

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
    padding: 2em;

    /* Fix overflowing */
    overflow: hidden;
    margin: -1em;

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

    &.fractal-anim-complete {
      opacity: 1;
      z-index: 0;
    }
  }

  canvas {
    opacity: 1;

    &.fractal-anim-complete {
      opacity: 0;
    }
  }

  /* Animate the about me svgs sliding in */
  @keyframes slide-in-left {
    from {
      transform: translateX(-20vw);
    }

    to {
      transform: translateX(0);
    }
  }

  @keyframes slide-in-right {
    from {
      transform: translateX(20vw);
    }

    to {
      transform: translateX(0);
    }
  }

  @keyframes slide-in-bottom {
    from {
      transform: translateY(20vw);
    }

    to {
      transform: translateY(0);
    }
  }

  #about-me-svg-1 {
    animation-name: slide-in-left;
  }
  
  #about-me-svg-2 {
    animation-name: slide-in-right;
  }
  
  #about-me-svg-3 {
    animation-name: slide-in-bottom;
  }

  .about-me-svg {
    opacity: 0;
    transition-property: opacity;

    /* Stop these from overflowing the page */
    overflow: hidden;

    /* I find this written out fully is more understandable */
    transition-duration: 2s;
    animation-duration: 2s;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
    animation-play-state: paused;

    &.animation-playing {
      opacity: 1;
      animation-play-state: running;
    }
  }
</style>
