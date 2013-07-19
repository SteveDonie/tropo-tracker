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

function handleTextDirectInput() {
	var result = ask("Reply with clientname, hours, and date (optional) i.e 'Binder 4.5' or 'Davenport 3.25 7-21' If you omit the date, it uses today's date.",
	{
		choices: "[ANY]",
		timeout: 300.0,
		onChoice: function (event) { 
			say("Thanks - recorded " + event.value);
		}
	});
}

// MAIN
answer();

log ("########################################## receiving " + currentCall.channel + " call from " + currentCall.callerID);

var worker = lookupWorker(currentCall.callerID);

if (worker == null) {
	worker = ask ("Welcome to the Fertile Ground Time Tracker. What is your name?",
		{
		choices: listOptions(workers),
		timeout: 90.0
		});
}
var flowMethod = ask("Hi " + worker + ". There are two ways to interact with this system by SMS. You can use 1) the interview method or 2) the direct entry method.");
if (flowMethod.value == "1") {
	handleTextInterview();
} else if (flowMethod.value == "2") {
	handleTextDirectInput();
}
