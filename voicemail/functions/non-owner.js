exports.handler = function (event, context, callback) {
  const response = new Twilio.twiml.VoiceResponse();

  console.log('Digits: ', context);

  // convert speech result to lower case and set a default value
  const speechResult =
    (context.SpeechResult && context.SpeechResult.toLowerCase()) || "";

  // what does caller want to do?
  if (context.Digits === "1" || speechResult.includes('message')){
    // caller wants to leave a message
    response.say(`Please leave a message after the beep.
      Press the hash key when finished.`);
    response.record({
      action: "/recording-done",
      recordingStatusCallback: "/recording-ready",
      recordingStatusCallbackEvent: "completed",
      finishOnKey: "#",
      transcribe: true,
      transcribeCallback: '/transcription-ready'
    });
    response.say("I did not receive a recording.");
    callback(null, response);
  } else {
    response.say("Invalid Entry. Goodbye!");
    callback(null, response);
  }
};
