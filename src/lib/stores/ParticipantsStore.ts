import type { writable } from 'svelte/store';

interface ParticipantsStore{
	store: typeof writable<any>;
	setID: (id: string) => void;
	setVideoEnabled: (enabled: boolean) => void;
	setAudioEnabled: (enabled: boolean) => void;
	setDisplayName: (name: string) => void;
	addTrack: (track: JitsiTrack) => void;
	removeTrack: (track: JitsiTrack) => void;
	getTracks: () => JitsiTrack[];

}


function createSingleParticipantStore(){

}