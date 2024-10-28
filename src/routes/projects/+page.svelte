<script>
  import ProjectCard from "./ProjectCard.svelte";

  import JuliaThumbnail from "$lib/img/thumbnails/julia.png";
  import PlaceholderThumbnail from "$lib/img/pfp.png";

  // TODO: fill this out
  const projects = [
    {
      name: "Julia",
      summary: "Online fractal renderer",
      previewImage: JuliaThumbnail,
      url: "/projects/julia",
    },
    {
      name: "Placeholder",
      summary: "More to be added to this list",
      previewImage: PlaceholderThumbnail,
      url: "/projects",
    },
  ];
</script>

<svelte:head>
  <title>Projects - Destructor_Ben</title>
</svelte:head>

<h1>Projects</h1>
<hr />

<div>
  {#each projects as project}
    <ProjectCard {...project} />
  {/each}
</div>

<style>
  hr {
    margin-bottom: 1em;
  }

  div {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1em;
  }
</style>
