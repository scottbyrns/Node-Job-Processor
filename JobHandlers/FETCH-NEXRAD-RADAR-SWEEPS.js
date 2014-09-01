var tools = require('./JobTools');

tools.emit("JOB-LOG", "FETCHING-NEXRAD-RADAR-SWEEPS");

tools.client.llen("NEXRAD-SITE", function (err, len) {

	var counter = len;

	for (var i = 0; i < len; i += 1) {
	
		tools.client.lindex("NEXRAD-SITE", i, function (err, result) {
	
			if (err) {
				return console.error(err);
			}
			var site = JSON.parse(result);
			
			var siteKey = site.site.substring(1,4);
		
			var url = "http://radar.weather.gov/ridge/RadarImg/N0R/" + siteKey + "_N0R_0.gif";
		
			tools.download(url, "/tmp/" + site.site + "-N0R.gif", function () {
				console.log("Did fetch NEXRAD site: " + site.site);
				tools.emit("EVENT", "DID-FETCH-NEXRAD-" + site.site);
				counter -= 1;
				if (counter == 0) {
					tools.emit("EVENT", "NEXRAD-SWEEP-WAS-FETCHED");
					tools.shutdown();
				}
			});

		});
	
	}
	
});
