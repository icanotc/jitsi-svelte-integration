
<script context="module">
	import {browser} from '$app/env'

	//import {JitsiMeetJS} from "../lib/vender/lib-jitsi-meet.min.js"


	export const prerender = true;
	
</script>



<script lang="ts">
	const options = {
		hosts: {
			domain: '127.0.0.1',
			muc: '127.0.0.1:10000'
		},
		bosh: '//127.0.0.1:51941/http-bind'
	};
	const confOptions = {

	};

	console.log(browser)
	if (browser) {
		JitsiMeetJS.init(confOptions)

		let connection = new JitsiMeetJS.JitsiConnection(null, null, options);

		connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
		connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
		connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, disconnect);

		connection.connect();

		console.log("lmao")
	}

	function onConnectionSuccess() 
	{

	}
	function onConnectionFailed() 
	{

	}
	function disconnect() 
	{

	}

	function handleClick() 
	{
		alert('clicked')
	}

	var Mute_Unmute = true
	let string = "Mute";

	
	


	function handleClicks() {
		Mute_Unmute = !Mute_Unmute

		if (Mute_Unmute)
		{
			string = "Unmute";
		}
		else 
		{
			string = "Mute"	
		}

		

	}

	


</script>



<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>



<section>
	<h1 class="text-3xl font-bold underline">
		Hello world!
	</h1>
	<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={handleClick}>
		Click me
	</button>

	<button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" on:click={handleClicks}>
	{string}
	</button> 


</section>
