<footer>
  <div>
    <div>Copyright © 2024 Destructor_Ben. Licensed under the MIT License.</div>
    <div>Made with SvelteKit</div>
  </div>
</footer>

<style>
  footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1em;
    padding: 1em;

    background-color: var(--col-mg);
    border-top: var(--border);

    z-index: 1;

    & > div {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
