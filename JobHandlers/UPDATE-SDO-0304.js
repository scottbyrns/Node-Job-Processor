var tools = require('./JobTools');



tools.download("http://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0304.jpg", "sdo-0304.jpg", function () {

	tools.emit("EVENT", "SDO-0304-DID-UPDATE");
	tools.shutdown();

});