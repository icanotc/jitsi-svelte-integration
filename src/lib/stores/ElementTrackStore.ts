import {writable, get} from 'svelte/store'

//this function is responsible for creating a new element that contains a track
//its assumed that each element (component) has a single track
//this contains 2 stores, a element store and a track store

//look for comments above each function for more info

function createElementAndTrackStore() {
	let attachedTrack: JitsiTrack | null = null;

	//these 2 stores are what contains the data for the element (the thing you see)
	//and the track (the actual audio/video track)
	const elementStore = writable(null)
	const trackStore = writable(null)


	//this detaches a track from the current element
	const detach = () => {
		const element = get(elementStore)

		if (attachedTrack) {
			attachedTrack.detach(element)
		}
	}

	const attach = () => {
		//get the current track
		const track = get(trackStore)

	}

}