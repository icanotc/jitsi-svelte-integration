import { derived, get, writable } from "svelte/store";
import { createParticipantsStore, createSingleParticipantStore } from "./ParticipantsStore";
import type JitsiConnection from "../JitsiTypes/JitsiConnection";
import type JitsiTrack from "../JitsiTypes/modules/RTC/JitsiTrack";
import type JitsiRemoteTrack from "../JitsiTypes/modules/RTC/JitsiRemoteTrack";
import { addEventListeners, removeEventListeners } from "../Utils/Utils";
import { connection } from "../js/InitJitsi";

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

	const conferenceStateStore = writable(ConferenceState.INITIAL);
	const permitEntryStore = writable(false); 	//this store determines if someone has the perms to join a meeting

	const localParticipantStore = createSingleParticipantStore(true);
	const remoteParticipantsStore = createParticipantsStore()

	let localParticipantID

	localParticipantStore.statusStore.subscribe(status => {
		localParticipantID = status.JitsiID
	})

	const cachedTrackPartcipants = new Map<JitsiTrack, string>()

	const store = derived(
		connectionStore,
		($connection: JitsiConnection, set) => {

			if (!$connection) throw new Error("connection is not defined at create conference store")

			const conference = $connection.initJitsiConference(conferenceId, null)

			const setStatus = (state: ConferenceState): void => {
				switch (state) {
					case ConferenceState.JOINING:
						localParticipantStore.setID(conferenceId.myUserId())
						break
					case ConferenceState.JOINED:
						set(conference)
						break
					default:
						set(null)
				}
			}

			const addTrack = (track: JitsiRemoteTrack): void => {
				let pID = track.getParticipantId()
				if (!pID) pID = cachedTrackPartcipants.get(track)

				if (!pID) {
					console.warn(`Track ${track} has no participant ID`)
					return
				}

				cachedTrackPartcipants.set(track, pID)
				remoteParticipantsStore.updateParticipant(pID, (pStore) => {
					pStore.addTrack(track)
				})
			}

			const removeTrack = (track: JitsiRemoteTrack): void => {
				let pID = track.getParticipantId()

				if (!pID) pID = cachedTrackPartcipants.get(track)
				if(!pID) {
					console.warn(`Track ${track} has no participant ID`)
					return
				}

				cachedTrackPartcipants.set(track, pID)
				remoteParticipantsStore.updateParticipant(pID, (pStore) => {
					pStore.removeTrack(track)
				})
			}

			const events = { conference: {}}

			events.conference = {
				//Events that affect the participant's status in the conference

				CONFERENCE_JOINED: () => setStatus(ConferenceState.JOINED),
				CONFERENCE_LEFT: () => {
					removeEventListeners( conference, events)
					setStatus(ConferenceState.LEFT)
				},
				CONFERENCE_FAILED: () => setStatus(ConferenceState.FAILED),
				CONFERENCE_ERROR: (errorCode) => {
					console.error('Jitsi conference error', errorCode)
					setStatus(ConferenceState.ERROR)
				},
				KICKED: () => setStatus(ConferenceState.KICKED),
					//Events that can be used to update participant's metadata

				USER_JOINED: (pId, participant) => {
					remoteParticipantsStore.updateParticipant(pId, (pStore) => {
						pStore.updateFieldsFromJitsiParticipant(participant)
					})
				},
				USER_LEFT: (pId) => {
					remoteParticipantsStore.update((($participants) => {
						return {
							...$participants,
							[pId]: undefined
						}
					}))
				},
				USER_ROLE_CHANGED: (pId, role) => {
					if (pId === localParticipantID) {
						localParticipantStore.setRole(role)
					} else {
						remoteParticipantsStore.updateParticipant(pId, (pStore) => {
							pStore.setRole(role)
						})
					}
				},

				TRACK_ADDED: (track) => addTrack(track),
				TRACK_REMOVED: (track) => removeTrack(track),
			}

			//add all the event listeners
			addEventListeners(conference, events)

			setStatus(ConferenceState.JOINING)
			conference.join()

			return () => {
				const state = get(conferenceStateStore)

				if (state === ConferenceState.JOINED || state === ConferenceState.JOINING) {
					const connection = get(connectionStore)

					//clean up if connection is null, something wrong probably happend
					if(!connection){
						setStatus(ConferenceState.LEFT)
						removeEventListeners(conference, events)
						return;
					}

					// if connection is not null
					setStatus(ConferenceState.LEAVING)
					conference.leave().then(() => console.log("OMG WE LEFT THE CONFERENCE", conferenceId))
					.catch((err) => {
						//alright this will set to ConferenceState.LEFT with the callback
						setStatus(ConferenceState.LEFT)
						console.warn("OMG WE FAILED TO LEAVE THE CONFERENCE", conferenceId, err)
					})
				}else{
					//cleaning up even if state is not JOINED or JOINING
					setStatus(ConferenceState.LEFT)
					removeEventListeners(conference, events)
				}
			}
		},
		//initial value
		null
	)

	const allParticipantsStore = derived(
		[localParticipantStore, remoteParticipantsStore, store],
		([$localParticipant, $remoteParticipants, $store], set) => {
			if(!$store) {
				set({}) //if conference store is null then we assume it has no participant
				return
			}

			const participants = {}

			for (const [id, store] of Object.entries($remoteParticipants)) {
				participants[id] = store
			}

			set(participants)

		},
		{}
	)

	return {
		subscribe: store.subscribe,
		state: conferenceStateStore,
		localParticipant: localParticipantStore,
		participants: allParticipantsStore,
		permitEntry: (permit) => permitEntryStore.set(permit),
	}
}
//this sets up a store with multiple conferences
function createConferecesStore(connectionStore){
	const store = writable({})

	const join = (conferenceID) => {
		store.update(($store) => {
			return {...$store,
				[conferenceID]: createConferenceStore(conferenceID, connectionStore)
			}
		})
	}
}
