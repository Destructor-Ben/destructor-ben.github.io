<script lang="ts">
  import SocialIcon from "./SocialIcon.svelte";

  import DiscordIcon from "$lib/img/contact-logos/discord.svg";
  import GitHubIcon from "$lib/img/contact-logos/github.svg";
  import SteamIcon from "$lib/img/contact-logos/steam.svg";
  import YouTubeIcon from "$lib/img/contact-logos/youtube.svg";

  const socials = [
    {
      name: "Discord",
      icon: DiscordIcon,
      url: "https://discord.gg/uQzTRx2V8Y",
    },
    {
      name: "GitHub",
      icon: GitHubIcon,
      url: "https://github.com/Destructor-Ben",
    },
    {
      name: "Steam",
      icon: SteamIcon,
      url: "https://steamcommunity.com/profiles/76561198271975249",
    },
    {
      name: "YouTube",
      icon: YouTubeIcon,
      url: "https://youtube.com/@destructor-ben",
    },
  ];
</script>

<h1>Socials</h1>
<hr />

<div id="socials-list">
  {#each socials as social}
    <div class="social">
      <h3>{social.name}</h3>
      <SocialIcon icon={social.icon} url={social.url} />
    </div>
  {/each}
</div>

<style>
  #socials-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5em;

    .social {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 30em;
      padding: 0.25em 2em;
      
      border-radius: 1em;
      border: var(--border);
    }
  }
</style>