<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();

  let rainbow: HTMLElement;

  let rainbowSize = $state(1000);

  function getRainbowSize()
  {
    return Math.max(rainbow.clientWidth, rainbow.clientHeight);
  }

  $effect(() => {
    rainbowSize = getRainbowSize();
  });
</script>

<div class="rainbow-container">
  <div class="rainbow" bind:this={rainbow} style="--size: {-rainbowSize}px;"></div>

  {@render children()}
</div>

<style>
  @keyframes border-animation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .rainbow-container {
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    padding: var(--padding, 4px);
    border-radius: var(--border-radius, 1000rem);

    width: var(--width);
    height: var(--height);
  }
  
  /* Rainbow border - spinning div cropped to the parent */
  .rainbow {
    content: "";
    display: block;
    position: absolute;
    border-radius: 100%;

    z-index: -1;
    --final-scale: var(--size);
    top: var(--final-scale);
    left: var(--final-scale);
    right: var(--final-scale);
    bottom: var(--final-scale);

    transition-property: opacity;
    transition-duration: var(--rainbow-fade-speed, 500ms);
    opacity: var(--opacity, 1);

    animation: border-animation var(--rainbow-speed, 3s) linear infinite;
    background: conic-gradient(
      var(--col-rainbow-1),
      var(--col-rainbow-2),
      var(--col-rainbow-3),
      var(--col-rainbow-4),
      var(--col-rainbow-5),
      var(--col-rainbow-1)
    );
  }
</style>