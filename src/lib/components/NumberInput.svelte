<script lang="ts">
  import type { Snippet } from "svelte";

  // TODO: add colouring for being disabled
  interface Props {
    children: Snippet,
    value: number,
    min: number,
    max: number,
    step?: number,
    disabled?: boolean,
    forceMinMaxNumber?: boolean,
  }

  let { children, value = $bindable(), min, max, step = 1, disabled = false, forceMinMaxNumber = false }: Props = $props();

  let numberMin = $derived(forceMinMaxNumber ? min : "");
  let numberMax = $derived(forceMinMaxNumber ? max : "");
</script>

<div class="input">
  <div>
    <input type="range"
      class="slider"
      bind:value={value}
      {min}
      {max}
      {step}
      {disabled}
    />

    <input type="number"
      class="number"
      bind:value={value}
      min={numberMin}
      max={numberMax}
      {step}
      {disabled}
    />
  </div>

  <label>{@render children()}</label>
</div>

<style>
  .input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    & > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1em;
    }
  }

input[type=range].slider {
  /* Fuck I hate css sometimes, this is so ugly :( */
  appearance: none;
  -webkit-appearance: none;
  
  width: 10em;
  height: 0.5em;
  border: var(--border);
  border-radius: 1000rem;
  
  background: linear-gradient(
    0deg,
    var(--col-rainbow-1),
    var(--col-rainbow-2),
    var(--col-rainbow-3),
    var(--col-rainbow-4),
    var(--col-rainbow-5),
    var(--col-rainbow-6)
  );

  &::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;

    width: 1.25em;
    height: 1.25em;
    border-radius: 100%;
    border: var(--border);
    cursor: pointer;
    
    background-color: var(--col-text);
  }

  &::-moz-range-thumb {

  }
}

input[type=number].number {
  width: 10em;
  background-color: var(--col-fg);
  border: var(--border);
  border-radius: 1000rem;
  padding: 0.25em 0.5em;
}
</style>