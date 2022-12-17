import { send, GPTapi } from "../index.js";
import Timeout from "./Timeout.js";
import { oraPromise } from 'ora'
import { ADDRGETNETWORKPARAMS } from "dns";

async function GPTrespond(event) {
	let message = {};
	let prompt = "";

	if (event.body.substring(0,8) == "jarvis, ") {
		if(!Timeout.inTimeout(event.senderID)) {
			prompt = event.body.substring(8);

			try {
	
				//get ChatGPT response
				message.body = await oraPromise(GPTapi.sendMessage(prompt), {
					text: prompt
				});
	
				//send message
				send(message, event.threadID, event.messageID);
	
			} catch(err) {
				console.error(`Could not get ChatGPT response: ${err}`);
			}
		} else {
			message.body = "Sorry, it's been less than 30 seconds since you sent the last request."
			send(message, event.threadID);
		}
	}
}

export {GPTrespond};