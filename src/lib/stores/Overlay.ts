import { writable } from "svelte/store";

export let overlayEnabled = writable(false)

export let imgURL = writable('')