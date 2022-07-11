import { writable } from "svelte/store";

export enum ConferenceState {
	INITIAL,
	JOINING,
	JOINED,
	LEAVING,
	LEFT,
	FAILED,
	ERROR,
	KICKED,
}

function createConferenceStore(conferenceId, connectionStore) {


	const newConferenceStateStore = writable(ConferenceState.INITIAL);
	//this store determines if someone has the perms to join a meeting
	const permitEntryStore = writable(false);

	// const remoteParticipantsStore =

}

