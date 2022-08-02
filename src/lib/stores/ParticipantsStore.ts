import { derived, get, Readable, Writable, writable } from "svelte/store";
import type JitsiTrack from "../JitsiTypes/modules/RTC/JitsiTrack";
import { addEventListeners, removeEventListeners } from "../Utils/Utils";
import type JitsiLocalTrack from "../JitsiTypes/modules/RTC/JitsiLocalTrack";

export interface ParticipantsStore{
	store: Readable<any>;
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

export interface Events {
	audio: any;
	video: any;
	//TODO: more concrete types
}

export function createSingleParticipantStore(islocal: boolean): any{
	const statusStore = writable({
		JitsiID: '',

		videoEnabled: true,
		audioEnabled: true,
		displayName: '',

		isLocal: islocal,
	})
	//this stores all the tracks for this participant
	const tracksStore: Writable<Events> = writable();

	//this stores the current audio level of the participant (one participant could only have 1 audio track)
	const audioLevelStore = writable(0.0);

	const participantStore: Readable<{}> = derived([statusStore, tracksStore, audioLevelStore], ([$status, $track, $audioLevel], set) => {
		set({
			status: $status,
			tracks: $track,
			audioLevel: $audioLevel,

		})
	}, {})

	const events: Events = {
		audio: {
			track: {
				TRACK_AUDIO_LEVEL_CHANGED: (audiolevel) => {
					audioLevelStore.set(audiolevel);
				},
				TRACK_MUTE_CHANGED: (track) => {
					statusStore.update((allFields) => ({
						...allFields,
						audioEnabled: !track.isMuted(),
					}))
				}
			}
		},
		video: {
			track: {
				TRACK_MUTE_CHANGED: (track) => {
					statusStore.update((allFields) => ({
						...allFields,
						videoEnabled: !track.isMuted(),
					}))
				}
			}
		}
	}
	return {
		store: participantStore,
		setID: (id: string) => {
			statusStore.update((allFields) => ({
				...allFields, id
			}))
		},
		setRole: (role: string) => {
			statusStore.update((allFields) => ({
				...allFields, role
			}))
		},
		setAudioEnabled: (enabled: boolean) => {
			const tracks = get(tracksStore);
			if (tracks.audio){
				if (enabled){
					tracks.audio.unmute();
				}else{
					tracks.audio.mute();
				}
			}
		},
		setVideoEnabled: (enabled: boolean) => {
			const tracks = get(tracksStore);
			if (tracks.video){
				if (enabled){
					tracks.video.unmute();
				}else{
					tracks.video.mute();
				}
			}
		},
		addTrack: (track: JitsiLocalTrack) => {
			if (track){
				const trackType = track.getType()
				if (events[trackType]){
					addEventListeners(track, events[trackType]);
				}
				statusStore.update((allFields) => ({
					...allFields,
					//videoEnabled, audioEnabled etc
					[`${trackType}Enabled`]: !track.isMuted(),
				}))
				tracksStore.update((allFields) => ({
					...allFields,
					//audio, video etc
					[trackType]: track,
				}))
			}
		},
		removeTrack: (track: JitsiTrack) => {
			if (track){
				const trackType = track.getType()
				if (events[trackType]){
					removeEventListeners(track, events[trackType]);
				}

				tracksStore.update((allFields) => ({
					...allFields,
					//audio, video etc
					[trackType]: undefined,
				}))
			}
		},
		statusStore: {subscribe: statusStore.subscribe},
		tracksStore: {subscribe: tracksStore.subscribe},
		audioLevelStore: {subscribe: audioLevelStore.subscribe},
	}
}

export function createParticipantsStore() {
	const store = writable({});

	const {subscribe, update, set} = store;
	//this allows us to change the participant with the ID
	const updateParticipant = (id: string, updateFunc: (participant: any) => any) => {
		let participant = get(store)[id];
		if (participant){
			updateFunc(participant)
		}else{
			store.update(($allFields) => {
				if (!$allFields[id]){
					console.warn(`Participant ${id} should not exist`);
				}
				participant = createParticipantsStore()
				updateFunc(participant)

				return {
					...$allFields,
					[id]: participant,
				}
			})

		}
	}
	return {
		subscribe, update, updateParticipant, set
	}
}
