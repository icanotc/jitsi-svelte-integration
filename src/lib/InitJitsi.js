import "./vender/lib-jitsi-meet.min.js";

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

    const confOptions = {

    };


    JitsiMeetJS.init(confOptions)

    let connection = new JitsiMeetJS.JitsiConnection(null, null, DEFAULT_JITSI_CONFIG);

    connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
    connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
    connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, disconnect);

    connection.connect();



    function onConnectionSuccess()
    {

    }
    function onConnectionFailed()
    {

    }
    function disconnect()
    {

    }
}