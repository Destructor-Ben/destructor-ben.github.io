<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements";
  import RainbowBorder from "./RainbowBorder.svelte";

  import type { Snippet } from "svelte";

  let { children, href }: { children: Snippet, href: string } = $props();

  let element: HTMLElement;
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
    isHovered = element.matches(':hover');
  })
</script>

<RainbowBorder --opacity={isHovered ? "1" : "0"}>
  <a class="button" href={href} onmouseenter={handleOnMouseEnter} onmouseleave={handleOnMouseExit} bind:this={element}>
    {@render children()}
  </a>
</RainbowBorder>
