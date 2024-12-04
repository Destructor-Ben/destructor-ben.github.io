<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div class="rainbow">
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

  .rainbow {
    overflow: hidden;
    position: relative;
    display: flex;
    padding: var(--padding, 4px);
    border-radius: var(--border-radius, 1000rem);

    /* Rainbow border - spinning div cropped to the parent */
    &::before {
      content: "";
      display: block;
      position: absolute;
      border-radius: 100%;

      /* TODO: use JS to do this calculation */
      --final-scale: calc(-100% * var(--scale, 1));
      z-index: -1;
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
  }
</style>