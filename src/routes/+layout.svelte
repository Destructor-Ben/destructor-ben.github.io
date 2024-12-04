<script lang="ts">
  import "$lib/style/variables.css";
  import "$lib/style/style.css";

  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";

  import type { Snippet } from "svelte";
  import { fade, fly } from "svelte/transition";

  // TODO: page animations let { children, data }: { children: Snippet, data: any } = $props();
  let { children }: { children: Snippet } = $props();
</script>

<div>
  <Header />

  <main>
    {@render children()}
  </main>

  <Footer />

  <!--
  TODO: page animations
  {#key data.pathname}
    <main in:fade={{ duration: 200, delay: 300 }} out:fade={{ duration: 200 }}>
      {@render children()}
    </main>
    <Footer />
  {/key}
  -->
</div>

<style>
  div {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1; /* Makes it grow to take up the remaining space */
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1em;
  }
</style>
