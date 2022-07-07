<script>
    import { overlayEnabled } from "/src/stores/Overlay.js"
    export let url, hidden


    let image = url.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = e => {
        url = e.target.result;
    };




</script>

<div class="w-screen h-screen fixed top-0 left-0 flex justify-center items-center">

    <div class="text-white rounded-md px-8 py-10 relative max-w-lg opacity-70 ">
        <!-- where prez goes  -->
        <img src={url} class="border-8 border-black">
        
        <button class="absolute top-2 right-3 text4xl text-gray-300 hover:-translate-y-0.5 transtion-transform {hidden? 'hidden' : ''}" on:click={() => overlayEnabled.set(false)}>&times; </button>
    </div>

</div>


