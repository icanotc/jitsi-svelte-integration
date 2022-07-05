<script>

  import {onMount} from "svelte"
  import JitsiMeetJS from "@solyd/lib-jitsi-meet"


  onMount(() => {
    console.log(JitsiMeetJS)
    JitsiMeetJS.init()
  })



</script>

<main>
  <div class="font-bold">
    amogus
  </div>
</main>

<style global>
  @tailwind utilities;
  @tailwind components;
  @tailwind base;
</style>