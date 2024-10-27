<script>
  import "$lib/assets/variables.css";
  import "$lib/assets/style.css";

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
    }
</style>