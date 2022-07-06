<script>

    import {onMount} from "svelte"
    import {InitJitsi} from "./lib/InitJitsi.js";

    let MuteStatus = true

    onMount(() => {
        InitJitsi()
    })


</script>

<main>
    <div class="">
        <h1 class="text-3xl font-bold underline">
            Hello world!
        </h1>

        <button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" on:click={() => MuteStatus = !MuteStatus}>
          {#if MuteStatus}
          <img src="snake.jpg"/>
          {:else}
          <img src="snakes.jpg"/>
          {/if}
        </button>
    </div>
</main>

<style global>
    @tailwind utilities;
    @tailwind components;
    @tailwind base;
</style>