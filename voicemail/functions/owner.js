exports.handler = async (context, event, callback) => {
  const config = require(Runtime.getAssets()["/config.js"].path);
  const response = new Twilio.twiml.VoiceResponse();
  const client = context.getTwilioClient();

  // custom error class capturing recording lookup errors
  class RecordingLookupError extends Error {
    constructor(message) {
      super(message);
      this.name = "RecordingLookupError";
    }
  }

  /**
   * Get the next recorded message
   *
   * @async
   * @function getNextNthRecording
   * @param {string} recordingSid - The reference recording to be found
   * @param {number} offset - The number of records to skip afterwards
   * @return {Object} The next recording.
   */
  const getNextNthRecording = async (client, recordingSid, offset) => {
    const recordings = await client.recordings.list({
      limit: config.searchDepth,
    });
    const currentRecordingIndex = recordings.findIndex(
      (e) => e.sid === recordingSid
    );
    if (currentRecordingIndex === -1) {
      // recording was not found
      throw new RecordingLookupError("Message with ID not found.");
    } else if (currentRecordingIndex + offset === recordings.length) {
      // we're at the end of an array
      throw new RecordingLookupError("You have no more messages.");
    } else {
      return recordings[currentRecordingIndex + offset];
    }
  };

  /**
   * <Gather> TwiML helper method
   *
   * @async
   * @function ivrPrompt
   * @param {Object} response - VoiceResponse object to add the prompt to
   * @param {string} nextRecordingSid - The recording SID that should be
   *                 passed to the next invocation of this function
   * @param {string} status - Status indicating the just completed action
   * @param {string} message - Prompt message to be read out
   */
  const ivrPrompt = (response, nextRecordingSid = "", message, status) => {
    const gather = response.gather({
      input: "dtmf speech",
      action:
        `/owner?sid=${nextRecordingSid}` + (status ? `&status=${status}` : ""),
      numDigits: "1",
      timeout: config.timeout,
      speechTimeout: "auto",
      hints: "play, exit, delete",
    });
    gather.say(message);
  };

  /**
   * Play the provided recording to the caller
   *
   * @async
   * @function playRecording
   * @param {Object} recording - The Twilio Recording object to be played
   */
  const playRecording = async (recording) => {
    const recordingUri =
      client.api.baseUrl + recording.uri.replace("json", "wav");
    const timestamp = new Date(recording.dateCreated);
    const formattedDate = timestamp.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
    const call = await client.calls(recording.callSid).fetch();
    response.say(`Ok. Playing a message from ${call.fromFormatted} 
                   received on ${formattedDate}.`);
    response.play(recordingUri);
    ivrPrompt(
      response,
      recording.sid,
      `To listen to the next message, press 1 or say "play".
        To delete the message, press 2 or say "delete".
        To exit, press 0 or say "exit".`,
      "played"
    );
    return callback(null, response);
  };

  /**
   * Delete the recording
   *
   * @async
   * @function deleteRecording
   * @param {string} recordingSid - SID of the recordign to be deleted
   */
  const deleteRecording = async (recordingSid) => {
    // only advance if a message is succesfully deleted
    let nextRecordingSid = recordingSid;

    // only allow deletion of the message was already listened to
    if (event.status === "played") {
      try {
        // get the next recording sid before we delete current one
        nextRecordingSid = (await getNextNthRecording(client, recordingSid, 1))
          .sid;
      } catch (error) {
        console.error(error);
        if (error instanceof RecordingLookupError) {
          // if this is the last message, still delete it
          if (error.message === "You have no more messages.") {
            const result = await client.recordings(recordingSid).remove();
            if (result === true) {
              response.say("Message deleted.");
            } else {
              response.say(`Error occured. ${result} Goodbye.`);
              return callback(null, response);
            }
          }
          response.say(`${error.message}. Goodbye.`);
          return callback(null, response);
        }
      }
      // delete the recording
      const result = await client.recordings(recordingSid).remove();
      if (result === true) {
        response.say("Message deleted.");
      } else {
        response.say(`Error occured. ${result} Goodbye.`);
        return callback(null, response);
      }
    } else {
      response.say(`Not a valid choice.`);
    }
    ivrPrompt(
      response,
      nextRecordingSid,
      `To listen to the next message, press 1 or say "play".
          To exit, press 0 or say "exit".`
    );
    return callback(null, response);
  };

  // main function logic
  const SpeechResult =
    (event.SpeechResult && event.SpeechResult.toLowerCase()) || "";
  if (event.Digits === "1" || SpeechResult.includes("play")) {
    let recording; // the recording we will be playing
    if (!event.sid) {
      // if no SID is passed, just play the 1st recording
      recording = (await client.recordings.list({ limit: 1 })).shift();
    } else {
      // otherwise find the next recording to play
      try {
        if (event.status === "played") {
          // find the next recording following the one provided
          recording = await getNextNthRecording(client, event.sid, 1);
        } else {
          // when a recording was deleted (or nothing was played yet),
          // find the current (or the first) recording
          recording = await getNextNthRecording(client, event.sid, 0);
        }
      } catch (error) {
        console.error(error);
        if (error instanceof RecordingLookupError) {
          response.say(`${error.message}. Goodbye.`);
          return callback(null, response);
        }
      }
    }
    if (!recording) {
      response.say("There are no messages. Goodbye.");
      return callback(null, response);
    }
    playRecording(recording);
  } else if (event.Digits === "2" || SpeechResult.includes("delete")) {
    // delete the current recording
    deleteRecording(event.sid);
  } else if (event.Digits === "0" || SpeechResult.includes("exit")) {
    // caller wants to hang up
    response.say("Goodbye.");
    return callback(null, response);
  } else {
    // caller selected something else
    response.say("Invalid selection. Goodbye.");
    return callback(null, response);
  }
};
