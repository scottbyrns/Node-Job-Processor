// 

var tools = require('./JobTools');
var request = require("request");

tools.emit("JOB-LOG", "FETCHING-NEXRAD-RADAR-COVERAGE-DATA");

tools.client.llen("NEXRAD-SITE", function (err, len) {

	var counter = len;

	for (var i = 0; i < len; i += 1) {
	
		tools.client.lindex("NEXRAD-SITE", i, function (i) { return function (err, result) {
	
			if (err) {
				return console.error(err);
			}
			var site = JSON.parse(result);
			
			var siteKey = site.site.substring(1,4);
		
			var url = "http://radar.weather.gov/ridge/radar.php?rid=" + siteKey + "&product=N0R&overlay=01000000&loop=no";
		

			request({
			  uri: url,
			}, function (index, site) {
				var lindex = index;
				var place = site;
				return function(error, response, body) {
					
					try {
						var blob = body.split('<script language="JavaScript" type="text/javascript">')[1].split("</script>")[0];
						var Mi = blob.split("Mi = ")[1].split(";")[0]                ;
						var Lat = blob.split("Lat = ")[1].split(";")[0]              ;
						var xyperpixel = blob.split("xyperpixel = ")[1].split(";")[0];
						var xllcorner = blob.split("xllcorner = ")[1].split(";")[0]  ;
						var yllcorner = blob.split("yllcorner = ")[1].split(";")[0]  ;
				
						site.coverage = {
							mi: Mi,
							lat: Lat,
							xyperpixel: xyperpixel,
							xllcorner: xllcorner,
							yllcorner: yllcorner
						};
				
						tools.client.lset("NEXRAD-SITE", lindex, JSON.stringify(place), function () {
							counter -= 1;
							if (counter == 0) {
								tools.emit("EVENT", "NEXRAD-SITES-COVERAGE-WAS-FETCHED");
								tools.shutdown();
							}
						});
				
				
					}
					catch (e) {
						counter -= 1;
						console.error(site.site, lindex, e);
						if (counter == 0) {
							tools.emit("EVENT", "NEXRAD-SITES-COVERAGE-WAS-FETCHED");
							tools.shutdown();
						}
					}
				}
			}(i, site));

		}}(i));
	
	}
	
});
