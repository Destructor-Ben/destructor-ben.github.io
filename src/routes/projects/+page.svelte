<script>
  import ProjectCard from "./ProjectCard.svelte";

  import JuliaThumbnail from "$lib/img/thumbnails/julia.png";
  import tMLThumbnail from "$lib/img/thumbnails/tml.png";
  import PFPThumbnail from "$lib/img/pfp.png";
  import TerrariaThumbnail from "$lib/img/thumbnails/terraria.png";
  import MinecraftThumbnail from "$lib/img/thumbnails/minecraft.png";
  import HOI4Thumbnail from "$lib/img/thumbnails/hoi4.png";
  import MDBThumbnail from "$lib/img/thumbnails/mdb.png";

  const projects = [
    {
      name: "Julia",
      summary: "Online fractal renderer",
      previewImage: JuliaThumbnail,
      url: "/projects/julia",
    },
    {
      name: "Minecraft Remake",
      summary: "A Minecraft-like game in C++",
      previewImage: MinecraftThumbnail,
      url: "https://github.com/Destructor-Ben/Minecraft-Remake",
    },
    {
      name: "tModLoader",
      summary: "My contributions to tML",
      previewImage: tMLThumbnail,
      url: "https://github.com/tModLoader/tModLoader/commits/1.4.4/?author=Destructor-Ben"
    },
    {
      name: "This Website",
      summary: "My personal website",
      previewImage: PFPThumbnail,
      url: "https://github.com/Destructor-Ben/destructor-ben.github.io"
    },
    {
      name: "Terraria Mods",
      summary: "My mods for Terraria",
      previewImage: TerrariaThumbnail,
      url: "https://github.com/stars/Destructor-Ben/lists/terraria-mods",
    },
    {
      name: "Minecraft Mods",
      summary: "My mods for Minecraft",
      previewImage: MinecraftThumbnail,
      url: "https://github.com/stars/Destructor-Ben/lists/minecraft-mods",
    },
    {
      name: "Hearts of Iron Mods",
      summary: "My mods for HOI4",
      previewImage: HOI4Thumbnail,
      url: "https://github.com/stars/Destructor-Ben/lists/hearts-of-iron-iv-mods",
    },
    {
      name: "Movie Database",
      summary: "CLI movie database for school assignment",
      previewImage: MDBThumbnail,
      url: "https://github.com/Destructor-Ben/L2COSC-Movie-Database"
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
