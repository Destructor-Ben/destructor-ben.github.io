<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<!--
  TODO: this isn't actually a good implementation and only really works for buttons
  Also, the child component has a different transition duration
  The border might want to be removed on the child too
  The size of the spining div needs to be automatically calculated
  The border radius also needs to be automatically calculated
  -->

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
    padding: 4px;
    border-radius: 1000rem;

    /* Rainbow border - spinning div cropped to the parent */
    &::before {
      content: "";
      display: block;
      position: absolute;
      border-radius: 100%;

      /* TODO: auto calculate */
      --size: -100px;
      z-index: -1;
      top: var(--size);
      left: var(--size);
      right: var(--size);
      bottom: var(--size);

      transition-property: opacity;
      transition-duration: 500ms;
      opacity: 0;

      animation: border-animation 3s linear infinite;
      background: conic-gradient(
        var(--col-rainbow-1),
        var(--col-rainbow-2),
        var(--col-rainbow-3),
        var(--col-rainbow-4),
        var(--col-rainbow-5),
        var(--col-rainbow-1)
      );
    }

    &:hover {
      &::before {
        opacity: 1;
      }
    }
  }
</style>