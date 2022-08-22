exports.handler = function (context, event, callback) {
  const client = context.getTwilioClient(); 
  //Getting our helper library for aync functions

  context.DOMAIN_NAME = 'https://b6c7-2603-9000-870b-4e71-841f-b392-f253-8b64.ngrok.io'

  const callParams = {
    to: context.OWNER_NUMBER,
    from: context.TWILIO_NUMBER,
    url: `${context.DOMAIN_NAME}/notification?sid=${event.RecordingSid}`,
  };

  /* Here, we're setting our call parameters to put in when we make our call. Notice how we've formatted the domain. It's querying notification with a '?', then finishing the domain with the sid=${event.RecordingSid} variable. This should be all we need to playback the recording we just made */

  client.calls
    .create(callParams)
    .then((call) => {
      console.log("Call created:", call.sid);
      return callback(null, "");
    })
    .catch((error) => {
      console.error(error);
    });

    /* so we've created our call here. this block of code will make the call, then send it back to notification.js, which will then query our owner.js file for the event sid, which just so happens to be the message we sent! */
};
