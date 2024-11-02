<script lang="ts">
  import NZFlag from "$lib/img/nz-flag.png";
  import ProfilePicture from "$lib/img/pfp.png";
  import JuliaCanvas from "$lib/components/JuliaCanvas.svelte";
  import JuliaRenderer from "$lib/julia/julia-renderer";
  import FractalType from "$lib/julia/fractal-type";
  import { lerp, polyEaseOut } from "$lib/julia/math-utils";

  const startCoords = [5, 5];
  const endCoords = [0.276, 0.483];

  const startScale = 1;
  // TODO: don't hardcode
  const endScale = 0.8;// TODO: maybe not shape into pfp? 160 / 613; // Profile height / canvas height

  let width = $state(0);
  let height = $state(0);

  let real = $state(startCoords[0]);
  let imaginary = $state(startCoords[1]);

  let scale = $state(startScale);

  let animationComplete = $state(false);

  let canvas: any;

  // Resize the canvas
  // TODO: maybe clean up
  $effect(() => {
    window.addEventListener('resize', OnResize);

    return () => {
      window.removeEventListener('resize', OnResize);
    }
  });

  $effect(() => {
    OnResize()
  })

  function OnResize() {
    width = window.innerWidth;
    height = window.innerHeight - 82;// TODO: don't hardcode
  }

  // Render the fractal
  $effect(() => {
    const renderer: JuliaRenderer = canvas.GetRenderer();
    renderer.setFractal(FractalType.Julia, {
      real: real,
      imaginary: imaginary,
      width: width,
      height: height,
      maxIterations: 100,
      radius: 4,
      translationX: 0,
      translationY: 0,
      rotation: 0,
      scale: scale,
    });

    renderer.render();
  });

  // Animate the fractal
  $effect(() => {
    console.log("Starting animation...")

    let iterations = 0;
    const fps = 60;
    const animationSeconds = 4;
    const maxIterations = fps * animationSeconds;
    const millisecondsPerFrame = 1 / fps * 1000;

    // Start animation
    const intervalID = setInterval(() => {
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

  function UpdateFractal(t: number) {
    const t3 = polyEaseOut(t, 3);
    const t2 = polyEaseOut(t, 2);

    real = lerp(startCoords[0], endCoords[0], t3);
    imaginary = lerp(startCoords[1], endCoords[1], t3);
    scale = lerp(startScale, endScale, t2);
  }
</script>

<svelte:head>
  <title>Destructor_Ben</title>
</svelte:head>

<!-- Appears behind everything -->
<JuliaCanvas width={width} height={height} class={animationComplete ? "anim-complete" : ""} bind:this={canvas} />

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

  :global(canvas) {
    position: fixed;
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
  #intro, #more-about-me, :global(canvas) {
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

  :global(canvas) {
    opacity: 1;

    &.anim-complete {
      opacity: 0;
    }
  }
</style>
