var tools = require('./JobTools');

tools.emit("JOB-LOG", "UPDATING-SWMF-MAGNETOSPHERE-AND-IONOSPHERE-DATA");

var id = (~~((new Date() - new Date("Sat Aug 30 2014 18:03:21 GMT-0600 (MDT)")) / 1000 / 300) + 6154);

var path = "http://ccmc.gsfc.nasa.gov/idl_images/idl_" + id + ".gif";



tools.download(path, "SWMF.gif", function () {

	tools.emit("EVENT", "SWMF-MAGNETOSPHERE-AND-IONOSPHERE-DATA-DID-UPDATE");
	tools.shutdown();

});
