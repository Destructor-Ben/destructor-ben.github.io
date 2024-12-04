<script lang="ts">
  import RainbowBorder from "$lib/components/RainbowBorder.svelte";

  // TODO: add rainbow border

  let { name, summary, previewImage, url }: { name: string, summary: string, previewImage: string, url: string } = $props();
</script>

<div>
  <a href={url}>
    <h2>{name}</h2>
    <img src={previewImage} alt={name} />
    <p>{summary}</p>
  </a>
</div>

<style>
  div {
    &, a {
      border-radius: 2em;
    }
    
    a {
      text-decoration: none;
      background-color: var(--col-mg);
      border-radius: 2em;
      border: var(--border);

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 0.5em;
      padding: 0.5em;

      transition-property: transform, background-color;

      img {
        height: 100px;
        border-radius: 1.5em;
      }
    }
    
    &:hover {
      a {
        transform: translate(0, -0.5em);
        background-color: var(--col-fg);
      }
    }

    &:active {
      a {
        background-color: var(--col-highlight);
      }
    }
  }
</style>