exports.handler = function (context, event, callback) {
  const config = require(Runtime.getAssets()["/config.js"].path);
  const response = new Twilio.twiml.VoiceResponse();

  if (event.Caller === context.OWNER_NUMBER) {
    /* let them listen to voicemail, delete or save messages */
    const gather = response.gather({
      input: "dtmf speech",
      action: "/owner",
      numDigits: 1,
      speechTimeout: config.timeout,
      timeout: config.timeout,
      hints: "play, exit",
    });
    gather.say(
      'Hi, welcome to your voicemail. If you would like to listen to your messages, please press 1 or say "play". If you would like to hang up, please press 0 or say "exit".'
    );
    response.say("We didn't receive any input. Goodbye!");
  } else {
    /* let the caller leave a message */
    const gather = response.gather({
      input: 'dtmf speech',
      action: '/non-owner',
      numDigits: '1',
      speechTimeout: 'auto',
      timeout: config.timeout,
      hints: 'message, exit'
    });
    gather.say(
      'Hello, welcome to this voicemail. If you would like to leave a message, please press 1 or say "message". If you would like to hang up, please press 0 or say "exit".'
    );
    response.say(
      "We didn't receive any input. Goodbye!"
    );
  }
  callback(null, response);
};
