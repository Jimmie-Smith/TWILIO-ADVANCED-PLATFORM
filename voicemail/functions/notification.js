exports.handler = async (context, event, callback) => {
  const config = require(Runtime.getAssets()["/config.js"].path);
  const response = new Twilio.twiml.VoiceResponse();

  const gather = response.gather({
    input: "dtmf speech",
    action: `/owner?sid=${event.sid}`,
    numDigits: "1",
    timeout: config.timeout,
    speechTimeout: "auto",
    hints: "play, exit",
  });
  gather.say(`You have a new message. To play it, press 1 or say "play".
                To exit, press 0 or say "exit".`);

  return callback(null, response);
};
