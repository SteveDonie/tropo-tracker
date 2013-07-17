say ("Welcome to the Fertile Ground Time Tracker");

var workerName = ask("What is your name?",{
	choices:"Julie, Alexa, Chereya, Janna, Jamie Jack, Allison, Reed, Bo, Tatiana",
	timeouts: 10.0,
	attempts: 3,
	onBadChoice: function(event) {
        say("I'm sorry,  I don't know that name.");
    },
    onChoice: function(event) {
        say("Thanks " + event.value + ".");
    }
});
	
var clientName = ask("What client are you reporting time for?",{
	choices:"",
	timeouts: 10.0,
	attempts: 3,
	onBadChoice: function(event) {
        say("I'm sorry,  I don't know that client.");
    },
    onChoice: function(event) {
        say("OK " + workerName + ". You worked at " + event.value + ".");
    }
});


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
