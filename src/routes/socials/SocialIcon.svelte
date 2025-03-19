<script lang="ts">
  import RainbowLink from "$lib/components/RainbowLink.svelte";

  let { icon, url }: { icon: string, url: string } = $props();
</script>

<RainbowLink href={url} className="contact-icon">
  <img src={icon} alt="Icon">
</RainbowLink>

<style>
  :global(.contact-icon) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1em !important;

    img {
      width: 2.5em;
      height: 2.5em;
    }
  }
</style>