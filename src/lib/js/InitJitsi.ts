export let localTracks = [];
export const remoteTracks = {};
export let connection = null;
export let isJoined: boolean = false;
export let room = null;

enum ConferenceState {
	INITIAL,
	JOINING,
	JOINED,
	LEAVING,
	LEFT,
	FAILED,
	ERROR,
	KICKED,
}

const confOptions = {

};

//bascially the main function here
export function InitJitsi() {

	console.log(JitsiMeetJS)

	const DEFAULT_JITSI_CONFIG = {
		hosts: {
			domain: 'meet.jit.si',
			muc: 'conference.meet.jit.si',
			focus: 'focus.meet.jit.si',
		},
		externalConnectUrl: 'https://meet.jit.si/http-pre-bind',
		useStunTurn: true,
		bosh: `https://meet.jit.si/http-bind`, // need to add `room=[ROOM]` when joining
		websocket: 'wss://meet.jit.si/xmpp-websocket',
		clientNode: 'http://jitsi.org/jitsimeet',
	}

	JitsiMeetJS.init(confOptions)

	let connection = new JitsiMeetJS.JitsiConnection(null, null, DEFAULT_JITSI_CONFIG);

	connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
	connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
	connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, disconnect);

	connection.connect();

	JitsiMeetJS.createLocalTracks({ devices: [ 'audio', 'video' ] })
		.then(onLocalTracks)
		.catch(error => {
			throw error;
		});


}

/**
 * Handles local tracks.
 * @param tracks Array with JitsiTrack objects
 */
function onLocalTracks(tracks) {
	localTracks = tracks;
	for (let i = 0; i < localTracks.length; i++) {
		//for each track, add a event listener for each event

		localTracks[i].addEventListener(
			JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
			audioLevel => console.log(`Audio Level local: ${audioLevel}`));

		localTracks[i].addEventListener(
			JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
			() => console.log('local track muted'));

		localTracks[i].addEventListener(
			JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
			() => console.log('local track stoped'));

		localTracks[i].addEventListener(
			JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
			deviceId => console.log(`track audio output device was changed to ${deviceId}`));

		//append the actual video to the DOM
		if (localTracks[i].getType() === 'video') {
			window.$('body').append(`<video autoplay='1' id='localVideo${i}' />`);
			localTracks[i].attach(window.$(`#localVideo${i}`)[0]);

		} else {
			window.$('body').append(`<audio autoplay='1' muted='true' id='localAudio${i}' />`);
			localTracks[i].attach(window.$(`#localAudio${i}`)[0]);
		}

		if (isJoined) {
			room.addTrack(localTracks[i]);
		}
	}
}

function onConnectionSuccess(){
	console.log('connection success')
	room = connection.initJitsiConference('conference', confOptions);

	//listen for remote tracks
	room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);
	room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, track => {
		console.log(`track removed!!!${track}`);
	});
	//when you join a conference, add the local tracks to the room
	room.on(
		JitsiMeetJS.events.conference.CONFERENCE_JOINED,
		onConferenceJoined);
	room.on(JitsiMeetJS.events.conference.USER_JOINED, id => {
		console.log('user join');
		remoteTracks[id] = [];
	});
	room.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
	room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, track => {
		console.log(`${track.getType()} - ${track.isMuted()}`);
	});
	room.on(
		JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
		(userID, displayName) => console.log(`${userID} - ${displayName}`));
	room.on(
		JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
		(userID, audioLevel) => console.log(`${userID} - ${audioLevel}`));
	room.on(
		JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED,
		() => console.log(`${room.getPhoneNumber()} - ${room.getPhonePin()}`));
	room.join();

}
function onConnectionFailed(){
	console.error('Connection Failed!');
	//ok yea being lazy here
}
function disconnect() {
	console.log('disconnect!');
	connection.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
	connection.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
	connection.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, disconnect);
}

/**
 *
 * @param id
 */
function onUserLeft(id) {
	console.log('user left');
	// if it doesnt exist, return
	if (!remoteTracks[id]) {
		return;
	}
	const tracks = remoteTracks[id];
	// get all tracks for that specific user
	for (let i = 0; i < tracks.length; i++) {
		tracks[i].detach(window.$(`#${id}${tracks[i].getType()}`));
	}
}


/**
 * Handles remote tracks
 * @param track JitsiTrack object
 */
function onRemoteTrack(track) {
	if (track.isLocal()) {
		return;
	}
	const participant = track.getParticipantId();

	if (!remoteTracks[participant]) {
		remoteTracks[participant] = [];
	}
	const idx = remoteTracks[participant].push(track);

	track.addEventListener(
		JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
		audioLevel => console.log(`Audio Level remote: ${audioLevel}`));
	track.addEventListener(
		JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
		() => console.log('remote track muted'));
	track.addEventListener(
		JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
		() => console.log('remote track stoped'));
	track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
		deviceId =>
			console.log(
				`track audio output device was changed to ${deviceId}`));
	const id = participant + track.getType() + idx;

	if (track.getType() === 'video') {
		window.$('body').append(
			`<video autoplay='1' id='${participant}video${idx}' />`);
	} else {
		window.$('body').append(
			`<audio autoplay='1' id='${participant}audio${idx}' />`);
	}
	track.attach(window.$(`#${id}`)[0]);
}

/**
 * That function is executed when the conference is joined
 */
function onConferenceJoined() {
	console.log('conference joined!');
	isJoined = true;
	for (let i = 0; i < localTracks.length; i++) {
		room.addTrack(localTracks[i]);
	}
}
