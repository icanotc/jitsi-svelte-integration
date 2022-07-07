<script>
import './main.css'
import { overlayEnabled, imgURL } from "./stores/Overlay.js";
import Overlay from "./components/Overlay.svelte";
import ControlBar from "./components/ControlBar.svelte";
let Mute_Unmute = true
let video = true


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

</main>

<style>
@tailwind utilities;
@tailwind components;
@tailwind base;
</style>
