exports.handler = async function (context, event, callback) {
  const client = context.getTwilioClient();
  //Getting our helper library for aync functions

  context.DOMAIN_NAME = `https://${context.DOMAIN_NAME}.ngrok.io`;

  // const callParams = {
  //   to: context.OWNER_NUMBER,
  //   from: context.TWILIO_NUMBER,
  //   url: `${context.DOMAIN_NAME}/notification?sid=${event.RecordingSid}`,
  // };

  // const messageParams = {
  //   from: context.TWILIO_NUMBER,
  //   to: context.OWNER_NUMBER,
  //   body: `You have a new message`
  // };

  /* Here, we're setting our call parameters to put in when we make our call. Notice how we've formatted the domain. It's querying notification with a '?', then finishing the domain with the sid=${event.RecordingSid} variable. This should be all we need to playback the recording we just made */

  // client.calls
  //   .create(callParams)
  //   .then((call) => {
  //     console.log("Call created:", call.sid);
  //     return callback(null, "");
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
  // client.messages
  // .create(messageParams)
  // .then((result) => {
  //   console.log('Created message using callback');
  //   console.log(result.sid);
  //   return callback(null, '');
  // })
  // .catch((error) => {
  //   console.error(error);
  //   return callback(error);
  // });

  // Get recordings and initialize a variable with how many there are

  const recordings = (await client.recordings.list({limit:20}));

  // client.recordings.list({limit: 20})
  // .then(recordings => recordings.forEach(r => console.log(r.sid)
  // )).then((results) => results.forEach(r => {
  //   recordingArray.push(r.sid);
  //   console.log(recordingArray);
  // }));

  /* The code here should be commented out becausr the code is wrong in the example provided on the website itself. It tries to add the await keyword to a helper function when the code itself is not asyncronous */

  const numRecordings = recordings.length;
  const messageText = numRecordings !== 1 ? "messages" : "message";
  //   // For testing, set the scheduled time for one hour from current time
  const sendWhen = new Date(new Date().getTime() + 61 * 60000);
  // Schedule a message alert to check the voicemail
  client.messages
    .create({
      messagingServiceSid: context.SERVICE_SID,
      body: `You have ${numRecordings} ${messageText}. Please check your voicemail.`,
      sendAt: sendWhen.toISOString(),
      scheduleType: "fixed",
      to: context.OWNER_NUMBER,
    })
    .then((message) => {
      console.log(message.sid);
      return callback(null, "");
    })
    .catch((error) => {
      console.error(error);
      return callback(error);
    });

  /* so we've created our call here. this block of code will make the call, then send it back to notification.js, which will then query our owner.js file for the event sid, which just so happens to be the message we sent! */
};
