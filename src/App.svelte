<script>
import './main.css'
import { overlayEnabled, imgURL } from "./lib/stores/Overlay";
import Overlay from "./lib/components/Overlay.svelte";
import ControlBar from "./lib/components/ControlBar.svelte";

import {onMount} from "svelte"
import {InitJitsi} from "./lib/js/InitJitsi";
import Video from "./lib/components/Video.svelte";


    onMount(() => {
        InitJitsi()
    })

</script>



<main>
    <div class="">

<!--        <iframe src="/mirror%20mirror%20official%20testing%20slides.pdf" width="400" height="400"    frameborder="0"></iframe>-->

    <ControlBar Mute_Unmute=false, video=false>

    </ControlBar>

    {#if $overlayEnabled}
         <!-- <img src="/ceo.webp" alt="branav moment"/> don't turn on breaks everything-->
        
        <Overlay url={$imgURL} hidden={false}>
                    
        </Overlay> 

    {/if}

    </div>
</main>

<style global>
    @tailwind utilities;
    @tailwind components;
    @tailwind base;
    body {
        overflow-y: hidden; /* Hide vertical scrollbar */
        overflow-x: hidden; /* Hide horizontal scrollbar */
    }

     iframe::-webkit-scrollbar {
         display: none;
     }
</style>

