<script context="module">
	import {browser} from '$app/env'
	import JitsiMeetJS from 'lib-jitsi-meet';



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
		console.log("lmao")
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
