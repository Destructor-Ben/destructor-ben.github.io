<div class="container">
  <slot />
</div>

<!-- TODO: Fix this, maybe make it a rainbow border link and rainbow border button? or just make it customizable -->

<style>
  @keyframes border-animation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .container {
    display: inline-block;
    padding: 4px;
    border-radius: 30px;
    position: relative;
    overflow: hidden;
    z-index: -1;

    /* The rainbow border, which is a spinning rectangle cropped to the root element */
    &::before {
      content: "";
      display: block;
      position: absolute;
      border-radius: 100%;
      --size: -300px;
      z-index: -2;
      top: var(--size);
      left: var(--size);
      right: var(--size);
      bottom: var(--size);
      animation: border-animation 10s linear infinite;
      background: conic-gradient(
        var(--col1),
        var(--col2),
        var(--col3),
        var(--col4),
        var(--col5),
        var(--col1)
      );
    }
  }
</style>
