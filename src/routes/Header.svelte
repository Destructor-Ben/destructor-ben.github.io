<script>
  import RainbowLink from "$lib/components/RainbowLink.svelte";
</script>

<header>
  <RainbowLink href="/">Home</RainbowLink>
  <RainbowLink href="/projects">Projects</RainbowLink>
  <RainbowLink href="https://github.com/Destructor-Ben">GitHub</RainbowLink>
  <RainbowLink href="https://discord.gg/uQzTRx2V8Y">Discord Server</RainbowLink>
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

    border-bottom: var(--border);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    background: color-mix(in srgb, var(--col-mg) 80%, #0000);
    
    z-index: 1;
  }
</style>
