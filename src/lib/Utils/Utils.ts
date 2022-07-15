import type JitsiConnection from "../JitsiTypes/JitsiConnection";

//this function takes the connection, and then add everything under the event object to it
export function addEventListeners(connection: JitsiConnection, events: any): void {

	for (const eventType in Object.keys(events)) {
		//the key would be the connection name eg, see below for details

		for (const [eventName, callback] of Object.entries(events[eventType])) {
		    //this adds a event listener to the type and name.
			//eg the object is like "connection: { CONNECTION_ESTABLISHED: () => {}}"
			//so it adds a event listener as connection.CONNECTION_ESTABLISHED
			//see doc: https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-ljm-api/#jitsimeetjs

			connection.addEventListener(JitsiMeetJS[eventType][eventName], callback);


		}
	}
}

export function removeEventListeners(connection: JitsiConnection, events: any): void {
	for (const eventType in Object.keys(events)) {
		for (const [eventName, callback] of Object.entries(events[eventType])) {
			connection.removeEventListener(JitsiMeetJS[eventType][eventName], callback);
		}
	}
}