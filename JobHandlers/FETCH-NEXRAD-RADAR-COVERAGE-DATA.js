// 

var tools = require('./JobTools');
var request = require("request");

tools.emit("JOB-LOG", "FETCHING-NEXRAD-RADAR-COVERAGE-DATA");

tools.client.llen("NEXRAD-SITE", function (err, len) {

	var counter = len;

	for (var i = 0; i < 2; i += 1) {
	
		tools.client.lindex("NEXRAD-SITE", i, function (err, result) {
	
			if (err) {
				return console.error(err);
			}
			var site = JSON.parse(result);
			
			var siteKey = site.site.substring(1,4);
		
			var url = "http://radar.weather.gov/ridge/radar.php?rid=" + siteKey + "&product=N0R&overlay=01000000&loop=no";
		
			var index = i*1;
 
			request({
			  uri: url,
			}, function(error, response, body) {
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
				
				tools.client.lset("NEXRAD-SITE", index, JSON.stringify(site));
				
			});

		});
	
	}
	
});
