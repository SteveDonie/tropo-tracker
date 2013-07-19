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
		
	}
}

function handleVoice() {
	say ("Welcome to the Fertile Ground Time Tracker");

	log ("############################# asking for user name - choices are " + listOptions(workers) );
	
	
	var workerName = getAnswerToQuestion("What is your name?", listOptions(workers), "I'm sorry, I don't recognize that name");
		
	var clientName = ask("What client are you reporting time for?",{
		choices:"Binder, ",
		timeouts: 10.0,
		attempts: 3,
		minConfidence: 0.7,
		onBadChoice: function(event) {
			say("I'm sorry,  I don't know that client.");
		},
		onChoice: function(event) {
			say("OK " + workerName + ". You worked at " + event.value + ".");
		},
	});

	var dateWorked = ask("What day are you reporting this time for? Right now I understand dates like 'January first two thousand thirteen'.",{
		choices: 'https://raw.github.com/SteveDonie/tropo-tracker/master/date.xml',
		timeouts: 10.0,
		attempts: 3,
		minConfidence: 0.7,
		onBadChoice: function(event) {
			say("I'm sorry,  I didn't understand that.");
		},
		onChoice: function(event) {
			say("Thanks " + workerName + ". I heard you say that you worked on " + event.value + ".");
		}
	});

	var durationHours = ask("OK, just two more questions. How many hours did you work at " + clientName.value + " on " + dateWorked.value + " ? This should be a whole number.",{
		choices: 'https://raw.github.com/SteveDonie/tropo-tracker/master/wholenumbers.xml',
		timeouts: 10.0,
		attempts: 3,
		minConfidence: 0.7,
		onBadChoice: function(event) {
			say("I'm sorry,  I didn't understand that.");
		},
		onChoice: function(event) {
			say("Thanks " + workerName + ". I heard you say that you worked for " + event.value + " hours.");
		}
	});

	var durationMinutes = ask("Last question. In addition to the " + durationHours.value + " hours, how many minutes did you work at " + clientName.value + " on " + dateWorked.value + " ? This should be a whole number.",{
		choices: 'https://raw.github.com/SteveDonie/tropo-tracker/master/wholenumbers.xml',
		timeouts: 10.0,
		attempts: 3,
		minConfidence: 0.7,
		onBadChoice: function(event) {
			say("I'm sorry,  I didn't understand that.");
		},
		onChoice: function(event) {
			say("Thanks " + workerName + ". I heard you say that you worked for " + event.value + " minutes.");
		}
	});

	say ("Thanks for recording your time " + workerName + "! " + " To summarize, you worked " + durationHours.value + " hours and " + durationMinutes.value + " minutes  at " + clientName.value + " on " + dateWorked.value + " .");

	hangup();
}

function handleText() {
	var worker = lookupWorker(currentCall.callerId);
	if (worker == null) {
		worker = ask ("Welcome to the Fertile Ground Time Tracker. What is your name?");
	}
	var flowMethod = ask("Hi " + worker + ". There are two ways to interact with this system by SMS. You can use 1) the interview method or 2) the direct entry method.");
	if (flowMethod.value == "1") {
		handleTextInterview();
	} else if (flowMethod.value == "2") {
		handleTextDirectInput();
	}
}

// MAIN
answer();

log ("########################################## receiving " + currentCall.channel + " call from " + currentCall.callerId);

log("Incoming call info [state:" + currentCall.state() +
						",callerID:" + currentCall.callerID + 
						",calledID:" + currentCall.calledID +
						",callerName:" + currentCall.callerName + 
						",calledName:" + currentCall.calledName)


// If this is a voice call, use the voice path. If it is SMS or IM, use the text path.
if (currentCall.channel == 'TEXT') {
	handleText();
} else {
	handleVoice();
}
