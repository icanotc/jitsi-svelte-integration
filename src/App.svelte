<script>

    import {onMount} from "svelte"
    import JitsiMeetJS from "@solyd/lib-jitsi-meet"


    onMount(() => {
        console.log(JitsiMeetJS)
        JitsiMeetJS.init()

        const options = {
            hosts: {
                domain: '127.0.0.1',
                muc: '127.0.0.1:10000'
            },
            bosh: '//127.0.0.1:51941/http-bind'
        };

        const confOptions = {

        };


        JitsiMeetJS.init(confOptions)

        let connection = new JitsiMeetJS.JitsiConnection(null, null, options);

        connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
        connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
        connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, disconnect);

        connection.connect();



        function onConnectionSuccess()
        {

        }
        function onConnectionFailed()
        {

        }
        function disconnect()
        {

        }


    })

    let Mute_Unmute = true

</script>

<main>
    <div class="">
        <h1 class="text-3xl font-bold underline">
            Hello world!
        </h1>

        <button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" on:click={() => Mute_Unmute = !Mute_Unmute}>
          {#if Mute_Unmute}  
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