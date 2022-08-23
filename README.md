## <p style = 'text-align:center'>Getting Started  Twilio Advanced Platform</p>

### <p style = 'text-align:center'>A personal library documenting how to use advanced features with Twilio</p> </br>

### <p style = 'text-align:center'>Table of Contents</p>

- [<p style = 'text-align:center'>Getting Started  Twilio Advanced Platform</p>](#getting-started--twilio-advanced-platform)
  - [<p style = 'text-align:center'>A personal library documenting how to use advanced features with Twilio</p> </br>](#a-personal-library-documenting-how-to-use-advanced-features-with-twilio-br)
  - [<p style = 'text-align:center'>Table of Contents</p>](#table-of-contents)
  - [<p style = 'text-align:center'>Initializing a Twilio Project</p>](#initializing-a-twilio-project)
  - [<p style = 'text-align:center'>Setting Environment Variables</p>](#setting-environment-variables)
  - [<p style = 'text-align:center'>Setting a Shared Configuration File</p>](#setting-a-shared-configuration-file)
  - [<p style = 'text-align:center'>Generating Twiml In a Twilio Function (Make it Say Stuff!) :grin:</p>](#generating-twiml-in-a-twilio-function-make-it-say-stuff-grin)
  - [<p style = 'text-align:center'>Testing Your Functions Locally</p>](#testing-your-functions-locally)
  - [<p style = 'text-align:center'>Handling Input w/ Other Twilio Functions</p>](#handling-input-w-other-twilio-functions)
  - [<p style = 'text-align:center'>Making Outbound Calls</p>](#making-outbound-calls)
  - [<p style = 'text-align:center'>Deploying Your Code</p>](#deploying-your-code)
  - [<p style = 'text-align:center'>Other Resources!</p>](#other-resources)
  - [<p style = 'text-align:center'>Twilio Advanced Messaging</p>](#twilio-advanced-messaging)
  - [<p style = 'text-align:center'>Message Scheduling</p>](#message-scheduling)

</br>

---

</br>

### <p style = 'text-align:center'>Initializing a Twilio Project</p>

First, to initalize our blank twilio project, let's run this command in our terminal:

`twilio serverless:init --template=blank <PROJECT_NAME>`

**<font color = 'red'>NOTE:</font> This documentation is assuming that you already have twilio instal;led into your local environment. If not, make sure to run `npm install twilio` before trying to follow this documentation.**

After your template project has been built, you'll want to go into your project folder and rename the *blank.js* file to something more fitting.

And that's it! You're ready to write your Twilio application :smiley:

</br>

---

</br>

### <p style = 'text-align:center'>Setting Environment Variables</p>

Next, we'll want to setup environment variables to refernece important secrets without exposing them in our code.

There should be a *.env* file in your project folder. Navigate there and fill your <font color = 'lighblue'>ACCOUNT_SID</font> and <font color = 'lighblue'>AUTH_TOKEN</font>

The account sid and auth token can be found in your twilio console. If you havent created a twilio account, you can do it [here](https://www.twilio.com/login?g=%2Fconsole-zen%3F&t=9de6cbac864dd16dddf0f56899857674d172ed98651d03476c82bc96f0bf39e0)!

when you've filled out your environment variables, it should look like this:

**ACCOUNT_SID=ACxxx</br>
AUTH_TOKEN=xxxExAmPleT0k3n**

**<font color = 'red'>Note:</font>** This can be for any variable you don't want to expose in your code! Just create a variable name in the same format (**VAR_NAME=**), then fill it in with your value (**VAR_NAME=EXAMPLE-VALUE**).

</br>

---

</br>

### <p style = 'text-align:center'>Setting a Shared Configuration File</p>

Next, let's create a shared config file our functions can reuse, so that when we decide to change any of the config parameters, we only need to do it in one place.

In the **assets** folder create a file named <font color = 'lighblue'>config.private.js</font> with the following content:


![alt-text](/photo-examples/PRIVATE-CONFIG-EXAMPLE.PNG)

This is just an example of what the config could look like, there's a lot more you could configure, it's just nice to have it all in one place! :grin: Take a look at the [serverless tollkit](https://www.twilio.com/docs/labs/serverless-toolkit/configuration) to learn more about what you can do!

If we ant to pull in our config code to our twilio function, we can reference it like this:

`  const config = require(Runtime.getAssets()['/config.js'].path);

We're pulling in the assets through the `getAssets()` method, and specifying a path that is tthe config.js file that we set.

**<font color="red">Note:</font> We know that the file is name config.prvate.js, but the the file is referenced as config.js in our function. The *private* keyword is to let twilio know that this isn't accesible to other accounts without access.**

The starter twilio function below is just an example of what our code could look like. In this case we're just setting up a voicemail service.

![alt-text](/photo-examples/TWILIO-FUNC-EXAMPLE.PNG)
</br>

---

</br>

### <p style = 'text-align:center'>Generating Twiml In a Twilio Function (Make it Say Stuff!) :grin:</p>

In any any given twilio Function, if we want to generate twilio as a voice response, we want to use the `say()` method. More importantly, we want to add a prefix in front of that to give it some context. So methods like `gather.say()` or `response.say()`. Add what you want to say within quotations and we're good to go. Here's an example below:

![alt-text](/photo-examples/TWILIO-FUNC-EXAMPLE-2.PNG)

A couple of things to pay attention to:

1. When we're gathering information from a call, we want to use the `response.gather({})` method. Notice how we've assigned a const variable to it as well. we use this in the `gather.say()` method to produce twiml when we call our previously configured number.</br></br>
2. The <font color = 'lighblue'>action</font> parameter is going to reference another JS file that we have yet to create called <font color = 'lighblue'>owner.js</font> which will do some other things for our owner.</br></br>
3. The <font color = 'lighblue'>hints</font> keyword lets twilio know what words to listen for to make decisions on which actions to take. These actions willbe determined in the other JS files that we're going to make. (See #2)</br></br>
4. On the <font color = 'lighblue'>timeout</font> parameter, you'll notice that we've referenced our config file to set the timeout in which our `response.say()` method will trigger, say it's configured Twiml, then hangup.
</br> </br>

---

</br>

### <p style = 'text-align:center'>Testing Your Functions Locally</p>

Now it's time to test what we have so far. To test Locally, enter this command in your terminal:

`twilio serverless:start --live --ngrok=`

This command should take you to a screen that looks like this:

![alt-text](/photo-examples/LOCAL-TEST-EXAMPLE.PNG)

A couple things about running the command this way:

- The `--live` parameter disables caching so that we can make changes to our code without having to restart the Serverless project.

- The `--ngrok` parameter uses CLI's ngrok integration which will generate public URLs for all our Functions.

Take a note of the ***/voicemail*** Function's public URL in the output of the command above.

Then set it as your Twilio phone number's A Call Comes In webhook.

**<font color=red>NOTE:</font> I couldn't take a screenshot of the screen we're supposed to be on, but it should be in the *phone numbers* section of your Twilio console. If you click into your active numbers, you'll be able to setup a webhook for your purchased number.**
</br> </br>

---

</br>

### <p style = 'text-align:center'>Handling Input w/ Other Twilio Functions</p>

So if you noticed in the last section, we had specified the endpoints ***/owner*** and ***/non-owner*** in our twilio function which will translate the ***owner.js*** and ***non-owner.js*** after the input has been gathered from the caller.

You can use this for any busioness logice you might need, but for the sake of this example, we're going to continue using the Voicemail Call Flow.

Let's tackle the ***non-owner*** section first:

![alt-text](/photo-examples/TWILIO-FUNC-EXAMPLE-3.PNG)

**EDIT: THIS CODE IS WRONG! IF YOU'RE FORWARDING A CALL TO ANOTHER FUNCTION, PLEASE USE `CONTEXT.<PARAMETER>` TO ACCESS THE METADATA ASSOICIATED WITH THE CALL, NOT `EVENT`!!!!!!**

This is what the logic looks like for a ***non-owner*** calling our number. This is where the call gets routed to each time a non owner wants to leave a messge. It's done in pretty much the same fashion as the voicemails file.

**<font color = 'red'>NOTE:</font> you'll notice that with each function, the resonse variable is set at the top. this is the vehicle of everything we're doing as far as generating Twiml is concerned!!**

Also, if you notice on the `record()` method, we have an action called **/recording-ready** which is the file the call will be routed to after this function is finished.

Now we're going to work on the owner function for this application. Here's what the Twilio documentation says about this function:

- On line 4, we're using the `getTwilioClient()` helper method. This method returns initialized Twilio's helper library client (providing your Twilio account credentials are included in your Function's environment).
This client allows us to use native Node.js code when interacting with Twilio's APIs and helps abstract away the low-level HTTP communication that would normally entail.
We'll use it to for example to fetch the list of existing recordings or later to delete recordings.

- On line 7 we're defining a custom error class. This is just so we can return a couple of different error states later on (e.g. recording was not found vs there are no more recordings).
  
- On line 23 we're defining a helper method that finds a recording by its SID and returns an offset-th recording after that (for now the offset will always be equal to 1, i.e. we're always fetching the next recording, but that will change in the next lesson).
  
- On line 70 we are preparing the full URL of the recording for the TwiML `<Play>` verb. The original recording.uri value looks like this:

`/2010-04-01/Accounts/ACxxx/Recordings/REyyy.json`

We need it to look like this (by adding the base URL and replacing the extension with the media format we want to retrieve - wav or mp3):

https://api.twilio.com/2010-04-01/Accounts/ACxxx/Recordings/REyyy.wav

On line 79 we prepare the <Gather> that will collect next instructions from the caller after the message has finished playing.
</br> </br>

---

</br>

### <p style = 'text-align:center'>Making Outbound Calls</p>

Now we're going to modify our code more to make outbound calls. In this case, we're going to be using the **non-owner** file to do this. What I'm going to do first is create another file called **notification.js**, which will store the code that will gather the call recipients input and make a decision based on the input gathered. It looks like this:

![alt-text](/photo-examples/TWILIO-FUNC-EXAMPLE-4.PNG)

Since there isn't an action that we can set for this file, we'll have to generate through so that it can be played back when the number owner answers. Our **recording-ready** code now looks like this:

![alt-text](/photo-examples/TWILIO-FUNC-EXAMPLE-5.PNG)
</br> </br>

---

</br>

### <p style = 'text-align:center'>Deploying Your Code</p>

Now that we have our application up and running, we need to deploy. In order to deploy, run this command in your terminal:

`twilio serverless:deploy --production`

Upon successful deployment you should see the following output in your terminal:

![alt-text](/photo-examples/DEPLOY-EXAMPLE.PNG)

After this, you can replace your Twilio phone number's **A Call Comes In** webhook with the URL generated by Twilio.
</br> </br>

---

</br>

### <p style = 'text-align:center'>Other Resources!</p>
And there you have it! A little bit of everything about Twilio. Hop in to the [Twilio Serveless API](https://www.twilio.com/docs/voice/api) and [Twiml for Programmable Voice](https://www.twilio.com/docs/voice/twiml) to learn more about what you can do :grin:
</br> </br>

---

</br>

### <p style = 'text-align:center'>Twilio Advanced Messaging</p>
</br>

Programmable Messaging is a REST API that enables you to send and receive messages in your chosen programming language, as well as track sent messages, schedule SMS messages, and retrieve and modify message history.

Similarly to the app we created in Advanced Voice, we'll be using ***serverless Twilio Functions***, which means we can take advantage of the context object and its helper methods. The ***context object*** is an interface between the current execution environment and the handler method, providing access to helper methods, in addition to your environment variables. Here is the boilerplate for using this handler method:

`exports.handler = (context, event, callback) => {`</br>
  `return callback();`</br>
`}`

The helper method you will see throughout our code is `getTwilioClient()`. If your Twilio account credentials are included in your Function, this method will return an initialized Twilio REST Helper Library. This library helps you interact with Twilio's API using native Node.js code and it abstracts away the low-level HTTP communication that would normally require.

For this section, we will continue with the voicemail app for example sake. But we'll cover the basic concepts of messaging while doing so.

First you'll need a couple things:

- ***Twilio CLI*** with the serverless plugin and ***Node.js*** installed on your machine.
- Twilio Account SID, Auth Token SID, and a Twilio Phone Number accessibly via the Twilio console.

 See [initializing a twilio project](#initializing_a_twilio_project) to set up everything if you haven't done so already.

  The code we've used so far is pretty similar to the code we've used for voice with slight variations thrown, so I would suggest looking at **sms-owner.js**, **transcription-ready.js**, and **non-owner.js** to view the changes.

  The code from **transcription-ready** was copied and pasted from **recording-ready.js** so I won't write on that again.

---

</br>

### <p style = 'text-align:center'>Message Scheduling</p>
</br>

**Message Scheduling** is a feature that provides the ability to schedule an SMS, MMS, or WhatsApp message for a fixed time in the future. 

This functionality is accessible on Messaging Services. As you may recall, a Messaging Service is a higher-level bundling of messaging functionality around a common set of senders, features, and configuration that you can manage through the Console or REST API. The key difference you’ll notice between sending a message in real-time vs. scheduling a message is that there is no ***from*** parameter. That’s because the Messaging Services utilizes a pool of Twilio phone numbers from which to send. Instead of ***from***, you’ll need a ***MessagingServiceSid***. The other parameters we’ll need are ***SendAt*** and ***ScheduleType***. Optionally, you can also use ***StatusCallback***.

A couple things to understand:

- Message Scheduling is only accessible on Messaging Services, requiring you to pass a ***MessageServiceSid*** instead of a ***From*** Phone Number. If you pass a ***From*** Phone Number, the message will be sent immediately even if you’ve included the other necessary parameters.

- A message must be scheduled at least ***60 minutes*** in advance of message send time, but cannot be scheduled more than ***7 days*** in advance of the request. If your ***SendAt*** timestamp does not fit these requirements, you will receive an error when attempting to schedule.

***<h2><font color=red>First, you'll need to create a messaging service in your twilio console, then we can move on. To create a message service, you need to own two or more phone numbers!</font>***</h2>

After you've created your service, you'll need to pull the service sid number and add it as an environment variable in your .env file.

Once you have your service enabled, youll need to pass the service sid instead of the ***from*** parameter, like so:

![alt-text](/photo-examples/message-service-example.PNG)

So Notice here that, we've passed our service sid as our "from" parameter so to speak!

That should do it for sending messages. You can always search the [messages api](https://www.twilio.com/docs/voice/api/recording#fetch-a-recording-resource) on eberything that's available to you.

<h2>Note: On the last section of the messaging advanced course, the syntax for this is <font color=red>wrong!!</font> You need to put the <font color=lighblue>aysnc</font> keyword in front of the function in order to have it work. Picture below: </h2>

![alt-text](/photo-examples/syntax-error-twilio.PNG)

That should do it for advanced Twilio platform. Always reference the Twilio API docs for more info on everything available! :grin:




