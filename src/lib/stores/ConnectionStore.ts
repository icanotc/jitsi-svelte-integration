import { get, writable } from "svelte/store";
import { addEventListeners, removeEventListeners } from "../Utils/Utils";

export type customConnectionStore = {
	subscribe: (callback: (value: any) => void) => void;
	state: ConnectionStates;
}

export enum ConnectionStates {
	INITIAL,
	CONNECTING,
	CONNECTED,
	DISCONNECTING,
	DISCONNECTED,
	FAILED,
}

export function createConnectionStore(config: any, roomName): customConnectionStore{
	if(!config){
		throw new Error('please add a config object')
	}

	const currentState = writable(ConnectionStates.INITIAL);

	//this stores the connection object
	const connectionStore = writable()

	config.bosh = "?room=" + roomName

	const connection = new JitsiMeetJS.JitsiConnection(config)


	const setStatus = (state: ConnectionStates): void => {
		currentState.set(state)
		connectionStore.set(state === ConnectionStates.CONNECTED? connection : null)
	}

	const events = {
		connection: {
			CONNECTION_ESTABLISHED: () => {
				console.log("connection established, YAY!!!")
				setStatus(ConnectionStates.CONNECTED)
			},
			CONNECTION_FAILED: () => {
				console.error("ok buddy ur bad, connection failed")
				setStatus(ConnectionStates.FAILED)
			},
			CONNECTION_DISCONNECTED: () => {
				console.log("connection disconnected, lmao")
				removeEventListeners(connection, events)
				setStatus(ConnectionStates.DISCONNECTED)
			},
			WRONG_STATE: () => {
				console.error('jitsi connection has wrong state')
				setStatus(ConnectionStates.FAILED)
			},
		}
	}
	//this is the connection.addEventListener equivalent but for the events object
	addEventListeners(connection, events)

	setStatus(ConnectionStates.CONNECTING)
	connection.connect()

	const disconnect = () => {
		if (get(currentState) === ConnectionStates.CONNECTED || get(currentState) === ConnectionStates.CONNECTING) {
			setStatus(ConnectionStates.DISCONNECTING)
			connection.disconnect()
			removeEventListeners(connection, events)
		}else{
			//if we are not connected, clean up the event listeners still
			removeEventListeners(connection, events)
		}
	}

	return {
		subscribe: connectionStore.subscribe,
		state: get(currentState),
	}
}
