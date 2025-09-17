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

router.use(function (req, res, next) {
	//do logging
	next();//make sure we go to the next routes and dont stop here
});

//Calendar routes
// Get updated saved calendar file GET
router.route("/getCal").get(function(req, res){
	res.sendFile(__dirname+'/public/js/exportedCalendar.json');
});
//send new cal updates and change file/ POST
router.route("/calSync").post(function(req, res){
	fs.writeFile("public/js/exportedCalendar.json", JSON.stringify(req.body), 'utf-8', function(err){
		if(err){
			console.log('An error occured while writing your file.');
			return console.log(err);
		} else {
			res.json(req.body);
		}
	});
});
// if user presses sync button, backup the externalCalendar
router.route("/calBackup").post(function(req, res){
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
});

app.use('/api', router);
app.use(express.static(__dirname + '/public'));

//START THE server
//=====================================================
app.listen(port);
console.log('Calendar is running on port: ', port);