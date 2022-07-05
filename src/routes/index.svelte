<script context="module">
	import {browser} from '$app/env'

	import {JitsiMeetJS} from "../lib/vender/lib-jitsi-meet.min.js"


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

	function onConnectionSuccess() {

	}
	function onConnectionFailed() {

	}
	function disconnect() {

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

</section>
