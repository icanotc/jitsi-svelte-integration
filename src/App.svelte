<script>
import './main.css'
import './resize.ts'
import { overlayEnabled, imgURL } from "./stores/Overlay.js";
import Overlay from "./components/Overlay.svelte";
import ControlBar from "./components/ControlBar.svelte";
let Mute_Unmute = true
let video = true


</script>
<link rel="stylesheet" href = "main.css" />

<p> test</p>
<main>
    <div style=" width: 500px; height: 500px;" class="item">
        <div class="resizer ne"></div>
        <div class="resizer nw"></div>
        <div class="resizer se"></div>
        <div class="resizer sw"></div>
        </div>
    
    
    
    
        <script  src="./resize.ts">

        </script>
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
