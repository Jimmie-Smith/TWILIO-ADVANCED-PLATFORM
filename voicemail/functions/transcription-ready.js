exports.handler = async function (context, event, callback) {
  // console.log('Transcription: ', event);
  const client = context.getTwilioClient();
  //Getting our helper library for aync functions

  context.DOMAIN_NAME =
    `https://${context.DOMAIN_NAME}.ngrok.io`;

  const messageParams = {
    from: context.TWILIO_NUMBER,
    to: context.OWNER_NUMBER,
    body: `You have a new voicemail. Dial in to your mailbox at ${context.OWNER_NUMBER} to listen Message Transcription: ${event.TranscriptionText} Message From${event.Caller}. Reply DELETE to delete this message.`,
  };

  client.messages
    .create(messageParams)
    .then((result) => {
      console.log("Created message using callback");
      console.log(result.sid);
      return callback(null, "");
    })
    .catch((error) => {
      console.error(error);
      return callback(error);
    });
};
