<script>
import './main.css'
import { overlayEnabled, imgURL } from "./lib/stores/Overlay";
import Overlay from "./lib/components/Overlay.svelte";
import ControlBar from "./lib/components/ControlBar.svelte";
import PdfCanvas from './lib/components/PdfCanvas.svelte';

import {onMount} from "svelte"
import {InitJitsi} from "./lib/js/InitJitsi";
import Video from "./lib/components/Video.svelte";
    
    onMount(() => {
        //InitJitsi()
    })

</script>



<main>
    <div class="">
        

    <ControlBar Mute_Unmute=false, video=false>

    </ControlBar>

    {#if $overlayEnabled}
         <!-- <img src="/ceo.webp" alt="branav moment"/> don't turn on breaks everything-->
        
        <Overlay url={$imgURL} hidden={false}>
                    
        </Overlay> 

    {/if}
    </div>
    <PdfCanvas />
    
</main>

<style global>
    @tailwind utilities;
    @tailwind components;
    @tailwind base;
</style>

