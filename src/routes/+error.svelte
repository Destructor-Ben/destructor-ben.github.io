<script>
  import { page } from "$app/stores";
</script>

<div>
  <h1>An error occurred</h1>
  <h2>{$page.status} - {$page.error?.message}</h2>
  <p>Navigate back <a href="/">Home</a></p>
</div>

<style>
  div {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
  }
</style>
