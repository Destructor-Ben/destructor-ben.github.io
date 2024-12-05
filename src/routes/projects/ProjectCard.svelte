<script lang="ts">
  import RainbowBorder from "$lib/components/RainbowBorder.svelte";

  let { name, summary, previewImage, url }: { name: string, summary: string, previewImage: string, url: string } = $props();

  let container: HTMLElement;
  let isHovered = $state(false);

  function handleOnMouseEnter()
  {
    isHovered = true;
  }

  function handleOnMouseExit()
  {
    isHovered = false;
  }

  $effect(() => {
    isHovered = container.matches(':hover');
  })
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="container" onmouseenter={handleOnMouseEnter} onmouseleave={handleOnMouseExit} bind:this={container}>
  <div class="card">
    <RainbowBorder --border-radius="calc(2em + 4px)" --opacity={isHovered ? "1" : "0"} --height=100%>
      <a href={url}>
        <h2>{name}</h2>
        <img src={previewImage} alt={name} />
        <p>{summary}</p>
      </a>
    </RainbowBorder>
  </div>
</div>

<style>
  .container {
    /* Original border radius + padding */
    border-radius: calc(2em + 4px);
    
    /* Hover animation */
    &:hover .card {
      transform: translate(0, -0.5em);

      a {
        background-color: var(--col-fg);
      }
    }

    &:active .card {
      a {
        background-color: var(--col-highlight);
      }
    }
  }

  .card {
    width: 100%;
    height: 100%;

    transition-property: transform;

    &, * {
      text-decoration: none;
    }

    a {
      background-color: var(--col-mg);
      border: var(--border);
      border-radius: 2em;
      
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;

      width: 100%;
      height: 100%;
      gap: 0.5em;
      padding: 1em;

      transition-property: background-color;

      img {
        height: 100px;
        border-radius: 1.5em;
      }
    }
  }
</style>