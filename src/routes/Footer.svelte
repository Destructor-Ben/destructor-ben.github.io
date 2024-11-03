<footer>
  <div>
    <div>Copyright © 2024 Destructor_Ben. MIT License. All rights reserved.</div>
    <div>Made with love & SvelteKit in Aotearoa New Zealand</div>
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
    box-shadow: var(--shadow-lg);

    z-index: 1;

    & > div {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
