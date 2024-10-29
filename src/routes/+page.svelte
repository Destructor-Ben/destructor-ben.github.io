<script lang="ts">
  import NZFlag from "$lib/img/nz-flag.png";
  import ProfilePicture from "$lib/img/pfp.png";

  import JuliaRenderer from "$lib/julia/julia-renderer";
  import FractalType from "$lib/julia/fractal-type";

  let juliaCanvas: HTMLCanvasElement;

  // Create the julia renderer
  // TODO: maybe separate the renderer creation and updating, also finish integrating it properly
  $effect(() => {
    const julia = new JuliaRenderer(juliaCanvas);

    julia.setFractal(FractalType.Julia, {
      real: 0.355,
      imaginary: 0.355,
    });

    julia.render();

    return () => {
      julia.destroy();
    }
  })
</script>

<svelte:head>
  <title>Destructor_Ben</title>
</svelte:head>

<!-- Appears behind everything -->
<canvas id="julia-canvas" bind:this={juliaCanvas} width=500 height=500></canvas>

  <!-- Basic info about me -->
<div id="intro">
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
<div id="more-about-me">
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

  /* TODO: finish the julia canvas */
  #julia-canvas {
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
</style>
