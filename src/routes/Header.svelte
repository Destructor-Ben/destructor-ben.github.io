<script>
  import RainbowBorder from "$lib/components/RainbowBorder.svelte";
</script>

<header>
  <RainbowBorder>
    <a href="/" class="button">Home</a>
  </RainbowBorder>
  
  <RainbowBorder>
    <a href="/projects" class="button">Projects</a>
  </RainbowBorder>
</header>

<style>
  header {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;

    display: flex;
    align-items: center;
    justify-content: start;
    gap: 0.5em;
    padding: 0.75em;

    background-color: var(--col-mg);
    border-bottom: var(--border);
    box-shadow: var(--shadow-lg);
    
    z-index: 1;
  }
</style>
