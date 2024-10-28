<script lang="ts">
  import NZFlag from "$lib/assets/img/nz-flag.png";
  import ProfilePicture from "$lib/assets/img/pfp.png";

  import JuliaRenderer from "$lib/julia/julia-renderer";
  import Fractal from "$lib/julia/fractal";
  import JuliaVert from "$lib/julia/vert.glsl?raw";
  import JuliaFrag from "$lib/julia/frag-julia.glsl?raw";

  let juliaCanvas: HTMLCanvasElement;

  // Create the julia renderer
  $effect(() => {
    const julia = new JuliaRenderer(juliaCanvas);
    const fractal = new Fractal(JuliaVert, JuliaFrag);
    julia.setFractal(fractal);
    julia.render();

    return () => {
      julia.destroy();
    }
  })
</script>

<svelte:head>
  <title>Destructor_Ben</title>
</svelte:head>

<div id="intro">
  <!-- Appears behind everything -->
  <canvas id="julia-canvas" bind:this={juliaCanvas} width=500 height=500></canvas>

  <!-- Basic info about me -->
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
  <a href="#more-about-me">See More</a>
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

  #julia-canvas {
    position: fixed;

    z-index: -1;
  }

  #intro {

  }

  #more-about-me {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 46px;

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
