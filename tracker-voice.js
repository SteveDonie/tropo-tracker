// Main workflow is recording time
// We want to record the following information:
// - worker name
// - client name
// - date
// - duration
// - task description?

// for an initial proof of concept, just hard-code the worker names and client names into the script, or into an XML grammar.
// initial POC has no authorization or authentication
// Save the data to???

// Secondary workflows
// Registering a new user
// Approving a new user
// Finding your time worked 
// 

// Data Storage - use OData and Google AppEngine? Something else to learn!!

var workers = { 	"Julie" : { nameChoices: "Julie, Julie Donie", number: "15126190419" },
					"Steve" : { nameChoices: "Steve, Steve Donie",    number: "15127977822" },
					"Alexa" : { nameChoices: "Alexa, Alexa Villalobos",    number: "12176498591" } };

// -----------
// turn the contacts into a comma separated list of options for each contact (simple grammar)
function listOptions( theContacts )
{
  var s ='';
  for( var contact in theContacts )
  {
    if (s != '') { s = s + ", " };
    s = s + contact + " (" + theContacts[ contact ].nameChoices + ")";
  }
  return s;
}

function lookupWorker(phoneNumber) {
	for (var worker in workers) {
		if (workers[worker].number == phoneNumber) {
			return worker;
		}
	}
	return null;
}

function getAnswerToQuestion (question, options, errorMessage) {
	var event = ask(question,{
		choices: options,
		timeouts: 10.0,
		attempts: 3,
		minConfidence: 0.7,
		onBadChoice: function(event) {
			say(errorMessage);
		}
	});

	if (event.name='choice') {
		return event.value;
	} else {
		say ("This doesn't seem to be working. Sorry!");
		hangup();
		return null;
	}
}

function handleVoice() {
	say ("Welcome to the Fertile Ground Time Tracker");

	var workerName = getAnswerToQuestion("What is your name?", listOptions(workers), "I'm sorry, I don't recognize that name");
	if (workerName == null) { return; }
		
	var clientName = getAnswerToQuestion("What client are you reporting time for?", listOptions(clients),"I'm sorry, I don't know that client.");
	if (clientName == null) { return; }

	say("OK " + workerName + ". You worked at " + event.value + ".");

	var dateWorked = getAnswerToQuestion("What day are you reporting this time for?", 'https://raw.github.com/SteveDonie/tropo-tracker/master/date.xml',"I'm sorry,  I didn't understand that.");
	if (dateWorked == null) { return; }

	say("OK, just two more questions.");
	
	var durationHours = getAnswerToQuestion("How many hours did you work at " + clientName.value + " on " + dateWorked.value + " ?", 
		'https://raw.github.com/SteveDonie/tropo-tracker/master/wholenumbers.xml',
		"I'm sorry,  I didn't understand that.");
	if (durationHours == null) { return; }

	say ("Thanks. Last Question.");
		
	var durationMinutes = getAnswerToQuestion("In addition to the " + durationHours.value + " hours, how many minutes did you work at " + clientName.value + " on " + dateWorked.value + " ?",
		'https://raw.github.com/SteveDonie/tropo-tracker/master/wholenumbers.xml',
		"I'm sorry,  I didn't understand that.");
	if (durationMinutes == null) { return; }

	say ("Thanks for recording your time " + workerName + "! " + " To summarize, you worked " + durationHours.value + " hours and " + durationMinutes.value + " minutes  at " + clientName.value + " on " + dateWorked.value + " .");

	hangup();
}

// MAIN
answer();

log ("########################################## receiving " + currentCall.channel + " call from " + currentCall.callerId);

log("Incoming call info [state:" + currentCall.state() +
						",callerID:" + currentCall.callerID + 
						",calledID:" + currentCall.calledID +
						",callerName:" + currentCall.callerName + 
						",calledName:" + currentCall.calledName)

handleVoice();
