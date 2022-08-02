import type JitsiConnection from "../JitsiTypes/JitsiConnection";
import type JitsiTrack from "../JitsiTypes/modules/RTC/JitsiTrack";
import type JitsiConference from "../JitsiTypes/JitsiConference";

//this function takes the connection, and then add everything under the event object to it
export function addEventListeners(jitsiObject: JitsiConnection | JitsiTrack | JitsiConference, events: any): void {

	for (const eventType in Object.keys(events)) {
		//the key would be the connection name eg, see below for details

		for (const [eventName, callback] of Object.entries(events[eventType])) {
		    //this adds a event listener to the type and name.
			//eg the object is like "connection: { CONNECTION_ESTABLISHED: () => {}}"
			//so it adds a event listener as connection.CONNECTION_ESTABLISHED
			//see doc: https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-ljm-api/#jitsimeetjs
			console.log("adding event listener: ", eventType, eventName)
				// @ts-ignore events[eventType][eventName]'s callback is too unkown instead of a function
			jitsiObject.addEventListener(JitsiMeetJS[eventType][eventName], callback);

		}
	}
}

export function removeEventListeners(connection: JitsiConnection | JitsiTrack | JitsiConference, events: any): void {
	for (const eventType in Object.keys(events)) {
		for (const [eventName, callback] of Object.entries(events[eventType])) {
			console.log("adding event listener: ", eventType, eventName)
			// @ts-ignore events[eventType][eventName]'s callback is too unkown instead of a function
			jitsiObject.removeEventListener(JitsiMeetJS[eventType][eventName], callback);
		}
	}
}