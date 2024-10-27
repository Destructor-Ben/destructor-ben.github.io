<script>
  import { browser } from '$app/environment';

  function goToTop()
  {
    window.scroll(0, 0);
    history.pushState({}, "", window.location.pathname + window.location.search);
  }

  // TODO: this is a bit dodgy while loading, maybe just make an opt out for certain pages?
  // TODO: I don't even think this works properly
  function needsGoToTopButton()
  {
    if (!browser)
      return false;

    const body = document.body;
    const bodyHeight = body.getBoundingClientRect().height;
    const viewportHeight = window.innerHeight;
    return bodyHeight > viewportHeight;
  }
</script>

<footer>
  {#if needsGoToTopButton()}
    <span>You've reached the bottom</span>
    <button on:click={goToTop}>Go back to the top</button>
    <hr />
  {/if}

  <div>
    <div>Copyright © 2024 Destructor_Ben. MIT License. All rights reserved.</div>
    <div>Made with love & SvelteKit in Aotearoa New Zealand</div>
  </div>
</footer>

<style>
  footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1em;
    padding: 1em;

    background-color: var(--col-mg);
    border-top: var(--border);
    box-shadow: var(--shadow-lg);

    z-index: 1;

    & > div {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
