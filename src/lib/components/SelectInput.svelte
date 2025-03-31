<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet,
    value: any,
    options: { id: any, name: string }[],
  }

  let { children, value = $bindable(), options }: Props = $props();
</script>

<!-- TODO: dropdown arrow -->
<div class="input">
  <select bind:value={value}>
    {#each options as option (option.id)}
      <option value={option.id}>{option.name}</option>
    {/each}
  </select>

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

  select {
    appearance: none;
    -webkit-appearance: none;

    width: 10em;
    background-color: var(--col-fg);
    border: var(--border);
    border-radius: 1000rem;
    padding: 0.25em 0.5em;

    option {
      background-color: var(--col-fg);
      border: var(--border);
      border-radius: 1000rem;
      padding: 0.25em 0.5em;
    }
  }
</style>