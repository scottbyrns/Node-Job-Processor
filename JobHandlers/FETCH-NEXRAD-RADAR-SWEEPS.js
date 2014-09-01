var tools = require('./JobTools');

tools.emit("JOB-LOG", "FETCHING-NEXRAD-RADAR-SWEEPS");

var len = tools.client.count("NEXRAD-SITE");

for (var i = 0; i < len; i += 1) {
	
	tools.client.lindex("NEXRAD-SITE", i, function (err, result) {
	
		if (err) {
			return console.error(err);
		}
		var site = JSON.parse(result);
		var siteKey = site.name.substr(1, 3);
		
		var url = "http://radar.weather.gov/ridge/RadarImg/N0R/" + siteKey + "_N0R_0.gif";
		
		if (i + 1 == len) {
			
			tools.download(url, siteKey + "-N0R.gif", function () {
				tools.emit("EVENT", "NEXRAD-SWEEP-WAS-FETCHED");
				tools.shutdown();
			});
			
		}
		else {
			
			tools.download(url, "/tmp/" + siteKey + "-N0R.gif", function () {
			
			});
			
		}
		
	});
	
}