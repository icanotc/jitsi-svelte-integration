import { derived, writable } from "svelte/store";

interface ParticipantsStore{
	store: typeof writable<any>;
	setID: (id: string) => void;
	setVideoEnabled: (enabled: boolean) => void;
	setAudioEnabled: (enabled: boolean) => void;
	setDisplayName: (name: string) => void;
	addTrack: (track: JitsiTrack) => void;
	removeTrack: (track: JitsiTrack) => void;
	getTracks: () => JitsiTrack[];
	getTrack: (trackID: string) => JitsiTrack;
	getID: () => string;

}


function createSingleParticipantStore(): ParticipantsStore{
	const statusStore = writable({
		id: '',

		videoEnabled: true,
		audioEnabled: true,
		displayName: '',

		isLocal: false,
	})
	//this stores all the tracks for this participant
	const tracksStore = writable({});

	//this stores the current audio level of the participant (one participant could only have 1 audio track)
	const audioLevelStore = writable(0.0);

	const mainStore = derived([statusStore, tracksStore, audioLevelStore], ([$status, $track, $audioLevel], set) => {
		set({
			status: $status,
			tracks: $track,
			audioLevel: $audioLevel,

		})
	})

	const events = {
		audio: {

		},
		video: {

		}
	}
}