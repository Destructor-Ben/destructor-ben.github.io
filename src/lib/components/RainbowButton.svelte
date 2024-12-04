<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements";
  import RainbowBorder from "./RainbowBorder.svelte";

  import type { Snippet } from "svelte";

  let { children, onclick }: { children: Snippet, onclick: MouseEventHandler<EventTarget> | undefined | null } = $props();

  let isHovered = $state(false);

  function handleOnMouseEnter()
  {
    isHovered = true;
  }

  function handleOnMouseExit()
  {
    isHovered = false;
  }
</script>

<RainbowBorder --opacity={isHovered ? "1" : "0"}>
  <button class="button" onclick={onclick} onmouseenter={handleOnMouseEnter} onmouseleave={handleOnMouseExit}>
    {@render children()}
  </button>
</RainbowBorder>