import { writable } from "svelte/store";

export enum ConnectionStates {
	INITIAL,
	CONNECTING,
	CONNECTED,
	DISCONNECTING,
	DISCONNECTED,
	FAILED,
}

export function createConnectionStore(config: any, roomName){
	if(!config){
		throw new Error('please add a config object')
	}

	const currentState = writable(ConnectionStates.INITIAL);

	const connectionStore = writable()

	config.bosh = "?room=" + roomName

	const connection = new JitsiMeetJS.JitsiConnection(config)


	const setStatus = (state: ConnectionStates): void => {
		currentState.set(state)
		connectionStore.set(state === ConnectionStates.CONNECTED? connection : null)
	}

	const events = {
		connection: {
			CONNECTION_ESTABLISHED: setStatus(ConnectionStates.CONNECTED),
			CONNECTION_FAILED: setStatus(ConnectionStates.FAILED),
			CONNECTION_DISCONNECTED: setStatus(ConnectionStates.DISCONNECTED),
			WRONG_STATE: () => {
				console.error('jitsi connection has wrong state')
				setStatus(ConnectionStates.FAILED)
			},
		}
	}


}