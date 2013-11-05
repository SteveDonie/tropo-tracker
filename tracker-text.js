var employees = { 	"Julie" : { fullName: "Julie Donie",      number: "15126190419", roles: ["Admin","Supervisor"] },
					"Steve" : { fullName: "Steve Donie",      number: "15127977822", roles: ["Admin"] },
					"Alexa" : { fullName: "Alexa Villalobos", number: "12176498591", roles: ["Admin","Supervisor"] } 
			};

var clients = ["Binder","Donie"];

function lookupEmployee() {
	for (var employee in employees) {
		if (employees[employee].number == currentCall.callerID) {
			log ("########################################## found Employee " + employee + "\r\n");
			return employee;
		}
	}
	log ("########################################## no employee found\r\n");
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
	var text = currentCall.initialText;
	log ("########################################## I know you! '" + employee + "' said '" + text + "'\r\n");

	if (isValidTimeEntry(text)) {
		handleTimeEntry(text);
	} else {
		handleTextDirectInput();
	}
}

// A valid time entry has either two or three parts. If no date is specified, 
// the system uses today's date.
// client hours [date]
function isValidTimeEntry(timeEntryString) {
	log ("########################################## checking for valid time entry in '" + timeEntryString + "'\r\n");
	var parts = timeEntryString.split(" ");
	if (parts.length < 2 || parts.length > 3) {
		say ("A valid response must have client and hours. It can also include the date. '" + timeEntryString + "' has " + parts.length + " words.");
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
		say ("OK, recorded that " + timeEntry.employee + " worked " + timeEntry.hours + " hours at " + timeEntry.client + " on " + timeEntry.date.toDateString());
	}
}

// This should either have three parts - (client, hours, date) or two parts (client, hours). 
// Requires that currentCall.callerID is a known employee number.
function parseTimeEntry(timeEntryString) {
	log ("########################################## parsing time entry in '" + timeEntryString + "'\r\n");
	var parts = timeEntryString.split(" ");
	var parsedClient = parts[0];
	var parsedHours = parseFloat(parts[1]);
	var date = "today";
	if (parts.length == 3) {
		date = parts[2];
	}
	var parsedDate = parseDate(date);
	
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
	return (!isNaN(hours));
}

function isValidDate(dateString) {
	return (parseDate(dateString) != null);
}

// parseDate can handle two kinds of dates - either 'today' or mm-dd.
// It returns a full javascript Date object that is set to current time on 
// the date specified in the current year, or null if it is not a valid date.
function parseDate(dateString) {
	log ("########################################## parsing date '" + dateString + "'\r\n");
	var parts = dateString.split("-");
	if (parts.length < 1 || parts.length > 2) {
		return null;
	}
	if (parts.length == 1) {
		if (parts[0] == "today") {
			return new Date();
		}
		return null;
	}
	if (parts.length == 2) {
		var monthPart = parts[0];
		var dayPart = parts[1];
		if (isNaN(monthPart) || isNaN(dayPart)) {
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
        if (this[i].toLowerCase() == obj.toLowerCase()) {
            return true;
        }
    }
    return false;
}
// MAIN
answer();

log ("########################################## receiving " + currentCall.channel + " call from " + currentCall.callerID + "\r\n");

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
