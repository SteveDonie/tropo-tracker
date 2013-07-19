answer();

log ("receiving " + currentCall.channel + " call from " + currentCall.callerId);

// If this is a voice call, use the voice path. If it is SMS or IM, use the text path.

say ("Welcome to the Fertile Ground Time Tracker");


var workerName = ask("What is your name?",{
	choices:"Julie, Alexa, Chereya, Janna, Jamie Jack, Allison, Reed, Bo, Tatiana",
	timeouts: 10.0,
	attempts: 3,
	minConfidence: 0.7,
	onBadChoice: function(event) {
        say("I'm sorry,  I don't know that name.");
    },
    onChoice: function(event) {
        say("Thanks " + event.value + ".");
    }
});
	
var clientName = ask("What client are you reporting time for?",{
	choices:"Binder, ",
	timeouts: 10.0,
	attempts: 3,
	minConfidence: 0.7,
	onBadChoice: function(event) {
        say("I'm sorry,  I don't know that client.");
    },
    onChoice: function(event) {
        say("OK " + workerName.value + ". You worked at " + event.value + ".");
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
        say("Thanks " + workerName.value + ". I heard you say that you worked on " + event.value + ".");
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
        say("Thanks " + workerName.value + ". I heard you say that you worked for " + event.value + " hours.");
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
        say("Thanks " + workerName.value + ". I heard you say that you worked for " + event.value + " minutes.");
    }
});

say ("Thanks for recording your time " + workerName.value + "! " + " To summarize, you worked " + durationHours.value + " hours and " + durationMinutes.value + " minutes  at " + clientName.value + " on " + dateWorked.value + " .");

hangup();

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
