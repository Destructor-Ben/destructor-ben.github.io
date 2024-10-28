<script>
  import "$lib/style/variables.css";
  import "$lib/style/style.css";

  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";
</script>

<div>
  <Header />

  <main>
    <slot />
  </main>

  <Footer />
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
