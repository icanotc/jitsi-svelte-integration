import { derived, writable } from "svelte/store";
import { createParticipantsStore, createSingleParticipantStore } from "./ParticipantsStore";
import type JitsiConnection from "../JitsiTypes/JitsiConnection";
import type JitsiTrack from "../JitsiTypes/modules/RTC/JitsiTrack";
import type JitsiRemoteTrack from "../JitsiTypes/modules/RTC/JitsiRemoteTrack";
import { addEventListeners, removeEventListeners } from "../Utils/Utils";

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

			if ($connection) {

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

				const addTrack = (track: JitsiRemoteTrack) => {
					let pID = track.getParticipantId()

					if (!pID) {
						pID = cachedTrackPartcipants.get(track)
					}
					if (pID) {
						cachedTrackPartcipants.set(track, pID)
						remoteParticipantsStore.updateParticipant(pID, (pStore) => {
							pStore.addTrack(track)
						})
					}else{
						console.warn(`Track ${track} has no participant ID`)
					}
				}

				const removeTrack = (track: JitsiRemoteTrack) => {
					let pID = track.getParticipantId()

					if (!pID) {
						pID = cachedTrackPartcipants.get(track)
					}
					if (pID) {
						cachedTrackPartcipants.set(track, pID)
						remoteParticipantsStore.updateParticipant(pID, (pStore) => {
							pStore.removeTrack(track)
						})
					}else{
						console.warn(`Track ${track} has no participant ID`)
					}
				}

				const events = {
					conference: {

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
								return omit($participants, [pId])
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

						/**
						 * "Track" events: we get notified whenever a remote participant adds an
						 * audio or video track to the conference, and we can then attach it to
						 * the local representation of the corresponding participant.
						 */

						TRACK_ADDED: (track) => {
							addTrack(track)
						},
						TRACK_REMOVED: (track) => {
							removeTrack(track)
						},
					},
				}
			}

			//add all the event listeners
			addEventListeners(conference, events)

		}
	)

}

function createConferecesStore()
