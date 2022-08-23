exports.handler = async (context, event, callback) => {
  const client = context.getTwilioClient();

  const from = context.TWILIO_NUMBER;
  const to = context.OWNER_NUMBER;

  class RecordingLookupError extends Error {
    constructor(message) {
      super(message);
      this.name = "RecordingLookupError";
    }
  }
  const deleteMessage = async (recordingSid) => {
    try {
      const result = await client.recordings(recordingSid).remove();
      if (result === true) {
        client.messages
          .create({ to, from, body: "Message deleted." })
          .then((result) => {
            console.log("Delete success");
            console.log(result.sid);
            return callback(null, "");
          });
      } else {
        client.messages
          .create({ to, from, body: "Error occurred." })
          .then((result) => {
            console.log("Error deleting message");
            console.log(result.sid);
            return callback(null, "");
          });
      }
    } catch (error) {
      console.error(error);
      if (error instanceof RecordingLookupError) {
        return callback(null, response);
      }
    }
  };
  // Logic for when a message comes in
  const smsRes = event.Body && event.Body.toLowerCase();

  // Actions based on SMS responses
  if (smsRes === "delete") {
    // Get recordings
    const recording = (await client.recordings.list({ limit: 1 })).shift();
    if (!recording) {
      // Error handling if no recordings
      client.messages
        .create({ to, from, body: "Error occurred. No recording found." })
        .then(() => {
          console.log("No recording found");
          return callback(null, "");
        });
    } else {
      // Call deleteMessage function
      deleteMessage(recording.sid);
    }
  } else {
    client.messages
      .create({
        to,
        from,
        body: "Error occurred. Please call in to your voicemail to complete your action.",
      })
      .then((result) => {
        console.log(result.sid);
        return callback(null, "");
      });
  }
};
