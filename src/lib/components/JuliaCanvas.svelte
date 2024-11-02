<script lang="ts">
  import JuliaRenderer from "$lib/julia/julia-renderer";

  // TODO: make spread props
  let props: {
    width: number,
    height: number,
    class: string,
  } = $props();

  let canvas: HTMLCanvasElement;
  let renderer: JuliaRenderer;

  export function GetRenderer() {
    return renderer;
  }
  
  // Setup the renderer
  $effect(() => {
    renderer = new JuliaRenderer(canvas);

    return () => {
      renderer.destroy();
    }
  })

  // When the canvas is resized we need to change the viewport size
  $effect(() => {
    renderer.resize(props.width, props.height);
  })
</script>

<canvas bind:this={canvas} width={props.width} height={props.height} class={props.class}></canvas>