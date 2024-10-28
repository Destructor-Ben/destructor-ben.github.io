<script lang="ts">
  let { name, summary, previewImage, url }:  {name: string, summary: string, previewImage: string, url: string} = $props();
</script>

<a href={url} class="no-style">
  <h2>{name}</h2>
  <img src={previewImage} alt={name} />
  <p>{summary}</p>
</a>

<style>
  a {
    position: relative;
    text-decoration: none;
    background-color: var(--col-fg);
    border-radius: 2em;
    border: var(--border);
    box-sizing: var(--shadow-xl);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 0.5em;
    padding: 0.5em;

    img {
      height: 100px;
      border-radius: 10px;
    }
  }
</style>