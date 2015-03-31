var net = require('net');
var port = 3000;
var fs = require('fs');
var chalk = require("chalk");

var date;
var topic;
var Info = function(first, surname, email){
	this.first_name = first;
	this.surname = surname;
	this.email = email;
};

var server = net.createServer(function(socket) {

	// A nice message upon sign-in
	socket.write(chalk.bgCyan("Welcome to the Hipster Meetup App!")+"\n");

	// To define date and time if it's been set
	fs.readFile("date_topic.json", function(err, data){
		if (err) {
			console.log(err);
		} else {
			var d_t = JSON.parse(data);
			date = d_t[0];
			topic = d_t[1];
		}
	})


	// To read the current attendees list and give a headcount 
	fs.readFile("attendees.json", function(err, data){
		if (err) {
			console.log(err);
		} else {
			var attendees = JSON.parse(data);
		}
		if (date != undefined && topic != undefined && date != "[]" && topic != "[]") {
		socket.write("The next meetup at on " + date + " about " + topic + ". There are currently " + attendees.length + " person(s) attending. If you would like to attend, please write in this exact order:\n RSVP first_name surname email\nDon't worry. This is only for the organizers.\n");
		} else {
			socket.write("There are currently no meetups. Please check back later for updates.\n");
		}
	});

	socket.on("data", function(data){
		var input = data.toString().trim().split(" ");
		if (input[0].toUpperCase()==="RSVP" && input.length === 4 && input[3].search('@') != -1 && date != "[]"){
			fs.readFile("attendees.json", function(err, data){
				if (err) {
					console.log(err);
				} else {
					var attendees = JSON.parse(data);
				}
				var newName = new Info(input[1], input[2], input[3]);
				attendees.push(newName);
				var attendeesJson = JSON.stringify(attendees);

				fs.writeFile("attendees.json", attendeesJson, function(err){
					if (err){
						console.log(err);
					} else if (attendees.length < 2){
						socket.write(chalk.bgMagenta("Congratulations "+input[1]+"!") + " You are the first name on list. Save the date: " + date);
					} else {
						socket.write(chalk.bgGreen("Congratulations "+input[1]+"!") + " Your name has been added to the list. There are now " + attendees.length + " attending the meetup on " + date + " about " + topic + ". Save the date!");
					}
				});
			});
		} else if (input[0].toUpperCase()==="RSVP" && input.length < 4) {
			socket.write(chalk.red("Oops.") + " It looks like you are missing some information. Please make sure you provided in this exact order:\n RSVP first_name surname email");
		} else if (input[0].toUpperCase()==="RSVP" && input.length > 4) {
			socket.write(chalk.red("Oops.") + " It looks like you have given too much information. Please make sure you provided only this information with no misspellings:\n RSVP first_name surname email");
		} else if (input[0].toUpperCase()==="RSVP" && input.length === 4) {
			socket.write(chalk.red("Please make sure you provided in this exact order with a real email address:\n RSVP first_name surname email\n") + "Otherwise, there are no events to signup for so try again later.");
		} else if (input[0]==="2556//attendee/list//") {
			fs.readFile("attendees.json", function(err, data){
				if (err) {
					console.log(err);
				} else {
					var attendees = JSON.parse(data);
					socket.write("There are currently " + attendees.length +" attendee(s). Here's their info: " + data.toString());
				}
			});
		} else if (input[0].search('2556//date/') === 0) {
			var settings = input.join().split("/");
			console.log(settings);
			date = settings[3];
			topic = settings[4];
			var date_topic = JSON.stringify([date, topic]);
			fs.writeFile("date_topic.json", date_topic, function(err){
				if (err){
					console.log(err);
				} else {
					console.log("Date and topic have been updated.");
				}
			});
			socket.write("Your date has been set to: " + date + ".\n The topic has been set to: "+ topic + ".")
		} else if (input[0]==="2556//clear/rsvps//") {
			var attendeesJson = JSON.stringify([]);
			fs.writeFile("attendees.json", attendeesJson, function(err){
				if (err){
					console.log(err);
				} else {
					console.log("RSVP list has been cleared.")
				} 
			});
			socket.write(chalk.green("Your RSVP list has been cleared."));
		} else {
			socket.write(chalk.red("ERROR!") + " Please try your input again.");
		}
	});

	socket.on("end", function() {
		console.log("Disconnected from client.");
	});
});

server.listen(port, function(){
	console.log("Listening on port " + port);
});






