var employees = { 	"Julie" : { fullName: "Julie Donie",      number: "15126190419", roles: ["Admin","Supervisor"] },
					"Steve" : { fullName: "Steve Donie",      number: "15127977822", roles: ["Admin"] },
					"Alexa" : { fullName: "Alexa Villalobos", number: "12176498591", roles: ["Admin","Supervisor"] } 
			};

var clients = ["Binder","Donie"];

function lookupEmployee() {
	for (var employee in employees) {
		if (employees[employee].number == currentCall.callerID) {
			log ("########################################## found Employee " + employee);
			return employee;
		}
	}
	log ("########################################## no employee found");
	return null;
}

function handleTextDirectInput() {
	var result = ask("Reply with clientname, hours, and (optional) date. For example 'Binder 4.5' or 'Davenport 3.25 7-21' If you omit the date, it uses today's date.",
	{
		choices: "[ANY]",
		timeout: 300.0,
		onChoice: function (event) { 
			handleTimeEntry (event.value);
		}
	});
}

function handleKnownEmployee(employee) {
	if (isValidTimeEntry(currentCall.InitialText)) {
		handleTimeEntry(currentCall.InitialText);
	} else {
		handleTextDirectInput();
	}
}

function isValidTimeEntry(timeEntryString) {
	log ("########################################## checking for valid time entry in '" + timeEntryString + "'");
	var parts = timeEntryString.split(" ");
	if (parts.length < 2 || parts.length > 3) {
		return false;
	}
	var client = parts[0];
	var hours = parts[1];
	var date = "today";
	if (parts.length == 3) {
		date = parts[2];
	}
	if (isValidClient(client) && isValidHours(hours) && isValidDate(date)){
		return true;
	}
	var message = "Something doesn't compute: ";
	if (!isValidClient(client)){
		message += "'" + client + "' is not a known client. ";
	}
	if (!isValidHours(hours)){
		message += " I don't understand '" + hours + "' as an hours value. ";
	}
	if (!isValidDate(date)){
		message += " I don't understand '" + date + "' as a date value.";
	}
	say(message);
	return false;
}

function handleRegistration(newUserName) {
	say ("Thanks for registering " + newUserName + ". I need to verify your registration.");
	// send text to Supervisors, with new user name and number. If they confirm, save new user.
}

// This can either be two parts, (client and hours), or three parts (client, hours, date)
function handleTimeEntry(timeEntryString) {
	if (isValidTimeEntry(timeEntryString)){
		var timeEntry = parseTimeEntry(timeEntryString);
		say ("OK, recorded that " + timeEntry.employee + " worked " + timeEntry.hours + " at " + timeEntry.client + " on " + timeEntry.date);
	}
}

// This should always have three parts - client, hours, date. Requires that currentCall.callerID is a known employee number.
function parseTimeEntry(timeEntryString) {
	log ("########################################## parsing time entry in '" + timeEntryString + "'");
	var parts = timeEntryString.split(" ");
	var parsedClient = parts[0];
	var parsedHours = parseFloat(parts[1]);
	var parsedDate = parseDate(parts[2]);
	
	return { 
		employee: lookupEmployee(),
		hours: parsedHours,
		client: parsedClient,
		date: parsedDate
	}
}

function isValidClient(clientName) {
	return clients.contains(clientName);
}

function isValidHours(hours) {
	return (parseFloat(hours) != NaN);
}

function isValidDate(dateString) {
	return (parseDate(dateString) != null);
}

// parseDate can handle two kinds of dates - either 'today' or mm-dd.
// It returns a full javascript Date object that is set to current time on 
// the date specified in the current year, or null if it is not a valid date.
function parseDate(dateString) {
	log ("########################################## parsing date '" + dateString + "'");
	var parts = dateString.split("-");
	if (parts.length < 1 || parts.length > 2) {
		return null;
	}
	if (parts.length == 1) {
		if (parts[0] == "today") {
			return new Date();
		}
	}
	if (parts.length == 2) {
		var monthPart = parts[0];
		var dayPart = parts[1];
		if (parseInt(monthPart) == NaN || parseInt(dayPart) == NaN) {
			return null
		}
		var finalDate = new Date();
		
		finalDate.setFullYear(finalDate.getFullYear(),parseInt(monthPart),parseInt(dayPart));
		return finalDate;
	}
	return null;
}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
// MAIN
answer();

log ("########################################## receiving " + currentCall.channel + " call from " + currentCall.callerID);

var employee = lookupEmployee();

if (employee == null) {
	employee = ask ("Welcome to the Fertile Ground Time Tracker. I don't recognize your phone number. Reply with your name to register.",
	{
		choices: "[ANY]",
		timeout: 90.0,
		onChoice: function (event) {
			handleRegistration(event.value);
		}
	});
} else {
	handleKnownEmployee(employee);
}
