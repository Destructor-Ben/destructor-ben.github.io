<script lang="ts">
  import NZFlag from "$lib/img/nz-flag.png";
  import ProfilePicture from "$lib/img/pfp.png";
  
  import RainbowLink from "$lib/components/RainbowLink.svelte";

  import JuliaRenderer from "$lib/julia/julia-renderer";
  import FractalType from "$lib/julia/fractal-type";

  import { lerp, easeOutSine, easeOutExpo, easeOutPoly } from "$lib/julia/interpolation";

  // #region Fractal Animation

  // TODO: clean up the animation itself
  // Either just make a cool animation or make it shape into my pfp
  // Use these colours
  /*
  --col-rainbow-1: #df406f;
  --col-rainbow-2: #fbda34;
  --col-rainbow-3: #86f9b8;
  --col-rainbow-4: #4f79f0;
  --col-rainbow-5: #8539f3;
  */

  const startCoords = [-5, -10];
  const endCoords = [-0.8727786784188099, -0.2595344618589833];

  const startScale = 0.1;
  const endScale = 0.8;

  const animationTimeMs = 4000;

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
  let startTime: number | null = null;

  function renderFractal(time: number) {
      // Update fractal
      if (!startTime)
        startTime = time;

      const progress = (time - startTime) / animationTimeMs;
      updateFractal(progress);

      // Update animation
      const handle = requestAnimationFrame(renderFractal);

      // Stop animation
      if (progress >= 1) {
        console.log("Fractal animation complete");
        cancelAnimationFrame(handle);
        fractalAnimationComplete = true;
      }
  }

  $effect(() => {
    console.log("Starting fractal animation...");
    requestAnimationFrame(renderFractal);
  });

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
    <img class="pfp" src={ProfilePicture} alt="PFP" id="intro-pfp" />
    <p id="intro-info">
      I'm a guy from New Zealand <img
        class="nz-flag"
        src={NZFlag}
        alt="NZ Flag"
      /> with a passion for programming, electronics, and maths.
    </p>
  </div>

  <div id="intro-buttons">
    <RainbowLink href="#more-about-me">See More</RainbowLink>
    <RainbowLink href="/projects">Projects</RainbowLink>
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
  /* #region Styles */

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
  
  /* #endregion */

  /* #region Intro Animation */

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

  /* Fade in animation */
  @keyframes fade-anim {
    from {
      opacity: 0;
      z-index: -999999;
      pointer-events: none;
      filter: blur(2px);
    }

    to {
      opacity: 1;
      z-index: 0;
      pointer-events: auto;
      filter: none;
    }
  }

  /* Animate the contents of the intro fading in */
  #intro {
    /* TODO: Profile picture animation *
    #intro-pfp {
      animation-name: fade-anim;
      animation-duration: 1s;
      animation-delay: 1s;
      animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
      animation-play-state: paused;
      animation-fill-mode: both;
    }*/
  
    /* Info animation */
    h1, hr, #intro-pfp, #intro-info, #intro-buttons {
      animation-name: fade-anim;
      animation-duration: 1s;
      animation-delay: 0s;
      animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
      animation-play-state: paused;
      animation-fill-mode: both;
    }

    h1 {
      animation-delay: 1.5s;
    }

    hr {
      animation-delay: 2.5s;
    }

    #intro-pfp, #intro-info {
      animation-delay: 3.5s;
    }

    #intro-buttons {
      animation-delay: 4.5s;
    }

    &.fractal-anim-complete {
      /* TODO: #intro-pfp {
        animation-play-state: running;
      }*/

      h1, hr, #intro-pfp, #intro-info, #intro-buttons {
        animation-play-state: running;
      }
    }
  }
  
  /* #endregion */

  /* #region Svg Slide Animation */

  /* Animate the about me svgs sliding in */
  @keyframes slide-in-left {
    from {
      opacity: 0;
      transform: translateX(-20vw);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slide-in-right {
    from {
      opacity: 0;
      transform: translateX(20vw);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slide-in-bottom {
    from {
      opacity: 0;
      transform: translateY(20vw);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  #about-me-svg-1 {
    animation-name: slide-in-left;
    animation-delay: 0s;
  }
  
  #about-me-svg-2 {
    animation-name: slide-in-right;
    animation-delay: 0.2s;
  }
  
  #about-me-svg-3 {
    animation-name: slide-in-bottom;
    animation-delay: 0.4s;
  }

  .about-me-svg {
    /* Stop these from overflowing the page */
    overflow: hidden;

    /* I find this written out fully is more understandable */
    animation-duration: 1.5s;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
    animation-play-state: paused;
    animation-fill-mode: both;

    &.animation-playing {
      animation-play-state: running;
    }
  }
  
  /* #endregion */
</style>
