<script>
  import NZFlag from "$lib/assets/img/nz-flag.png";
</script>

<svelte:head>
  <title>Destructor_Ben</title>
</svelte:head>

<h1>Destructor_Ben</h1>
<hr />
<h2>About Me</h2>

<p>I'm a 16 year old guy from New Zealand <img class="nz-flag" src={NZFlag} alt="NZ Flag" /> with a passion for programming, electronics, and maths.</p>

<div class="about-me">
  <div>
    <img alt="Interests" src="https://raw.githubusercontent.com/Destructor-Ben/Destructor-Ben/refs/heads/main/interests.svg" />
    <img alt="Future Projects" src="https://raw.githubusercontent.com/Destructor-Ben/Destructor-Ben/refs/heads/main/future-projects.svg" />
  </div>

  <img alt="Tools" src="https://raw.githubusercontent.com/Destructor-Ben/Destructor-Ben/refs/heads/main/tools.svg" />
</div>

<style>
  .nz-flag {
    height: 1em;
  }

  .about-me {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 46px;

    &>img {
      width: 846px;
      height: 375px;
    }

    &>div {
      display: flex;
      gap: 46px;
      
      &>img {
        width: 400px;
        height: 300px;
      }
    }
  }
</style>
