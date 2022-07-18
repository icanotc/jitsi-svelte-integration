const roomName = "webrtchacks";
const fullRoomName = roomName;
const targetNode = document.querySelector("#meet");
const domain = "meet.jit.si";

let connection = null;
let isJoined = false;
let room = null;

let localTracks = [];
const remoteTracks = {};
let participantIds = new Set();

function onConnectionSuccess() {
  const confOptions = {
    enableLayerSuspension: true,
    p2p: {
      enabled: false
    }
  };
  room = connection.initJitsiConference(fullRoomName, confOptions);
  room.on(JitsiMeetJS.events.conference.TRACK_ADDED, (track) => {
    if (!track.isLocal()) {
      const participant = track.getParticipantId();

      if (!remoteTracks[participant]) {
        remoteTracks[participant] = [];
      }
      const idx = remoteTracks[participant].push(track);
      const id = participant + track.getType() + idx;
      const remoteVideo = document.createElement("video");
      remoteVideo.autoplay = true;
      remoteVideo.id = `${participant}_video_${id}`;
      track.attach(remoteVideo);
      targetNode.appendChild(remoteVideo);
    }
  });

  room.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, () => {
    console.log("conference joined!");
    isJoined = true;
    localTracks.forEach((track) => room.addTrack(track));
  });

  room.on(JitsiMeetJS.events.conference.USER_JOINED, (id) => {
    console.log("user joined");
    participantIds.add(id);
    room.selectParticipants(Array.from(participantIds));
  });
  room.on(JitsiMeetJS.events.conference.USER_LEFT, (id) => {
    console.log("user left");
    participantIds.delete(id);
    room.selectParticipants(Array.from(participantIds));
  });
  room.join();
  room.setReceiverVideoConstraint(720);
}

// ToDo: disconnect before closing

JitsiMeetJS.init();

document.querySelector("button#lib_jitsi_meet").onclick = () => {
  const options = {
    hosts: {
      domain: domain,
      muc: `conference.${domain}`,
      focus: `focus.${domain}`
    },
    serviceUrl: `https://${domain}/http-bind?room=${roomName}`, // Note: wss not avail on meet.jit.si
    clientNode: "http://jitsi.org/jitsimeet"
  };

  console.log(options);

  connection = new JitsiMeetJS.JitsiConnection(null, null, options);

  connection.addEventListener(
    JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
    onConnectionSuccess
  );
  connection.addEventListener(
    JitsiMeetJS.events.connection.CONNECTION_FAILED,
    () => console.log("Connection failed")
  );
  connection.addEventListener(
    JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
    () => {
      console.log("disconnect!");

      localTracks.forEach((track) => track.dispose());
      room?.leave();
      connection?.disconnect();
    }
  );

  connection.connect();

  JitsiMeetJS.createLocalTracks({ devices: ["audio", "video"] })
    .then((localTracks) => {
      const localVideoElem = document.createElement("video");
      localVideoElem.autoplay = true;
      localTracks.forEach((localTrack) => {
        console.log(localTrack);
        localTrack.attach(localVideoElem);
        if (isJoined) room.addTrack(localTrack);
      });
      targetNode.appendChild(localVideoElem);
    })
    .catch((error) => {
      throw error;
    });
};