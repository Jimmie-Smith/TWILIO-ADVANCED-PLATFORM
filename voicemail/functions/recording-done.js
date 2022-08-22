exports.handler = function (context, event, callback) {
    // say goodbye to the caller after recording was finished
    const response = new Twilio.twiml.VoiceResponse();
    response.say('Your message was recorded. Goodbye!');
    return callback(null, response);
  };