const express		= require('express');
const app			= express();
const bodyParser	= require('body-parser');
//const cookieParser 	= require('cookie-parser');
const path 			= require('path');
const fs = require("fs");
//const fileUpload = require('express-fileupload');

app.use(bodyParser.urlencoded({ extended: true, limit:'50mb' }));
app.use(bodyParser.json({limit:'50mb'}));
//app.use(cookieParser());
//app.use(fileUpload({useTempFiles: true}));

var port = process.env.PORT || 4000;	//set port

//Routes for the api
var router = express.Router();		//get an instance of the express router
var isLocked = true;
var userKey = "0000";

router.use(function (req, res, next) {
	//do logging
	next();//make sure we go to the next routes and dont stop here
});

//Calendar routes
// Get updated saved calendar file GET
router.route("/getCal").get(function(req, res){
	if(isLocked == false){
		res.sendFile(__dirname+'/public/js/exportedCalendar.json');
	}
});
//send new cal updates and change file/ POST
router.route("/calSync").post(function(req, res){
	if(isLocked == false){
		fs.writeFile("public/js/exportedCalendar.json", JSON.stringify(req.body), 'utf-8', function(err){
			if(err){
				console.log('An error occured while writing your file.');
				return console.log(err);
			} else {
				res.json(req.body);
			}
		});
	}
});
// if user presses sync button, backup the externalCalendar
router.route("/calBackup").post(function(req, res){
	if(isLocked == false){
		//add date time stamp to captured structure
		const currentDate = new Date();
		const year = currentDate.getFullYear(); // 4-digit year
		const month = currentDate.getMonth() + 1; // Month (0-11, so add 1 for 1-12)
		const day = currentDate.getDate(); // Day of the month (1-31)
		const hours = currentDate.getHours(); // Hours (0-23)
		const minutes = currentDate.getMinutes(); // Minutes (0-59)
		const seconds = currentDate.getSeconds(); // Seconds (0-59)
		const milliseconds = currentDate.getMilliseconds(); // Milliseconds (0-999)
		const period = hours >= 12 ? 'PM' : 'AM';
		const dayOfWeek = currentDate.getDay(); // Day of the week (0 for Sunday, 6 for Saturday)
		const timestamp = ((month)+""+(day)+""+(year)+"_"+(hours)+"-"+(minutes)+"-"+(seconds)+""+(period))
		//console.log("timestamp ", timestamp)

		fs.writeFile("backup/exportedCalendar_"+timestamp+".json", JSON.stringify(req.body), 'utf-8', function(err){
			if(err){
				console.log('An error occured while writing your file.');
				return console.log(err);
			} else {
				res.json({message:"Calendar successfully backed up and syncronized."});
			}
		});
	}
	
});
// lock screen routes
router.route("/unlockCal").post(function(req, res){
	if(isLocked == true){
		//console.log("lock pass code from user", req.body.userEntry);
		if(req.body.userEntry == userKey){
			isLocked = false;
			res.send({redirect:true});
		} else {
			res.status(403).send({message:"This passcode is incorrect."});
		}
	} else {
		res.status(404).send({message: "Error"});
	}
});
router.route("/lockCal").post(function(req, res){
	if(isLocked == false){
		if(req.body != undefined && req.body != "" && req.body != " "){
			isLocked = true;
			res.send({redirect:true});
		} else {
			res.send(403).send({message:"You must provide a value."});
		}
		
	} else {
		res.status(404).send({message: "Error"});
	}
});
router.route("/changePasscode").post(function (req, res){
	if(isLocked == false && req.body != undefined && req.body != "" && req.body != " "){
		userKey = req.body.newpass;
		isLocked = true;
		res.send({redirect:true});
	} else {
		res.status(403).send({message: "You must provide a value."});
	}
});
//
app.route("/").get(function(req, res){
	if(isLocked == true){
		res.sendFile(__dirname+'/pages/LockScreen/index.html');
	} else if(isLocked == false) {
		res.sendFile(__dirname+'/pages/Home/index.html');
	}
});
app.route("/js/calendar.js").get(function(req, res){
	if(isLocked == true){
		res.redirect("/404/");
	} else if(isLocked == false) {
		res.sendFile(__dirname+'/public/js/calendar.js');
	}
});
app.route("/js/main.js").get(function(req, res){
	if(isLocked == true){
		res.redirect("/404/");
	} else if(isLocked == false) {
		res.sendFile(__dirname+'/public/js/main.js');
	}
});
app.route("/js/snowflakes.js").get(function(req, res){
	if(isLocked == true){
		res.redirect("/404/");
	} else if(isLocked == false) {
		res.sendFile(__dirname+'/public/js/snowflakes.js');
	}
});
app.route("/js/exportedCalendar.json").get(function(req, res){
	if(isLocked == true){
		res.redirect("/404/");
	} else if(isLocked == false) {
		res.sendFile(__dirname+'/public/js/exportedCalendar.json');
	}
});
app.route("/Years/{*splat}").get(function(req, res){
	if(isLocked == true){
		res.redirect("/404/");
	} else if(isLocked == false){
		res.sendFile(__dirname+'/public/'+req.path);
	}
});

// API Routes
app.use('/api', router);
app.use(express.static(__dirname + '/public'));

// The 404 Handler
app.use((req, res, next) => {
  	res.status(404).sendFile(__dirname+'/pages/404/index.html');
});

//START THE server
//=====================================================
app.listen(port);
console.log('Calendar is running on port: ', port);