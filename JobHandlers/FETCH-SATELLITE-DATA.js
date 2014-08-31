var tools = require('./JobTools');

var satelliteList = "http://www.satellite-calculations.com/Satellite/satellitelist.php";

// var j = schedule.scheduleJob(rule, function(){
	tools.download(satelliteList, "satelliteList.php.raw", function () {
		console.log("Satellite List Loaded");
	    tools.emit('EVENT', "SATELLITE-DATA-READY-FOR-PROCESSING");
	});
