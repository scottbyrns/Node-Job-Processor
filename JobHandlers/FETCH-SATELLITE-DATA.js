var tools = require('./JobTools');

var satelliteList = "http://www.satellite-calculations.com/Satellite/satellitelist.php";

tools.download(satelliteList, "satelliteList.php.raw", function () {

    tools.emit('EVENT', "SATELLITE-DATA-READY-FOR-PROCESSING");
	tools.shutdown();

});
