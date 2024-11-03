<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet,
    value: boolean,
    disabled?: boolean,
  }

  // Generate random ID
  const id = `checkbox-${Math.random().toString(36).substring(2, 9)}`;

  let { children, value = $bindable(), disabled = false }: Props = $props();
</script>

<div class="input">
  <input type="checkbox"
    class="checkbox"
    bind:checked={value}
    hidden={true}
    {disabled}
    {id}
  />

  <label for={id}>
    <div class="toggle" class:active={value}>
      <div></div>
    </div>
  </label>

  <label>{@render children()}</label>
</div>

<style>
  .input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .toggle {
    width: 40px;
    height: 23px;
    border-radius: 1000rem;
    border: var(--border);

    transition-property: background-color;
    background-color: var(--col-fg);
    background: linear-gradient(
      90deg,
      var(--col-rainbow-1),
      var(--col-rainbow-2),
      var(--col-rainbow-3),
      var(--col-rainbow-4),
      var(--col-rainbow-5)
    );

    div {
      width: 15px;
      height: 15px;
      border-radius: 100%;
      background-color: var(--col-text);

      margin-left: 2.5px;
      margin-top: 2.5px;

      transition-property: margin-left;
    }
    
    &.active {
      background-color: transparent;

      div {
        margin-left: calc(40px - 15px - 2.5px - 2.5px - 0.5px);
      }
    }
  }
</style>