
export const DEFAULT_JITSI_CONFIG = {
	hosts: {
		domain: 'meet.jit.si',
		muc: 'conference.meet.jit.si',
		focus: 'focus.meet.jit.si',
	},
	externalConnectUrl: 'https://meet.jit.si/http-pre-bind',
	enableP2P: true,
	p2p: {
		enabled: true,
		preferH264: true,
		disableH264: true,
		useStunTurn: true,
	},
	useStunTurn: true,
	bosh: `https://meet.jit.si/http-bind`, // need to add `room=[ROOM]` when joining
	websocket: 'wss://meet.jit.si/xmpp-websocket',
	clientNode: 'http://jitsi.org/jitsimeet',
}

