<script>

    import {onMount} from "svelte"
    import "../src/lib/vender/lib-jitsi-meet.min.js"


    onMount(() => {
        console.log(JitsiMeetJS)
        const DEFAULT_JITSI_CONFIG = {
            hosts: {
                domain: 'meet.jit.si',
                muc: 'conference.meet.jit.si',
                focus: 'focus.meet.jit.si',
            },
            externalConnectUrl: 'https://meet.jit.si/http-pre-bind',
            useStunTurn: true,
            bosh: `https://meet.jit.si/http-bind`, // need to add `room=[ROOM]` when joining
            websocket: 'wss://meet.jit.si/xmpp-websocket',
            clientNode: 'http://jitsi.org/jitsimeet',
        }

        const confOptions = {

        };


        JitsiMeetJS.init(confOptions)

        let connection = new JitsiMeetJS.JitsiConnection(null, null, DEFAULT_JITSI_CONFIG);

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