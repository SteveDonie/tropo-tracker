tropo-tracker
=============

use Tropo as the API for voice and SMS to create timesheets.

Project tracking with Trello at https://trello.com/b/9sxeagEb/fertile-ground-time-tracking signing in with my Google account.


Current State:
If you send an SMS message to the correct number, it will respond
- If the system recognizes your phone number, and your message contains a valid time entry, 
	it will respond by saying that it has recorded that time entry.
	-- if the message does not contain a valid time entry, it asks for a valid time entry.
	
- If the system doesn't rcognize the phone number, it asks you to register
