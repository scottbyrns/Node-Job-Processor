var tools = require('./JobTools');

var cheerio = require('cheerio');
var fs = require('fs');

fs.readFile('satelliteList.php.raw', 'utf8', function (err, fileContents) {
        if (err) {

                return console.log(err);

        }
        $ = cheerio.load(fileContents);

		var satellites = [];

        var rows = $("#main").find("tr").each(function(i, elem) {
			if (i == 0) {
				return;
			}
			var satellite = {};
			
                $(this).find("td").each(function (i, elem) {

					if (i == 0) {
						satellite["currentLon"] = $(this).text().replace('�', '');
					}
					if (i == 1) {
						satellite["name"] = $(this).text().replace('�', '');
					}
					if (i == 2) {
						satellite["satcat"] = $(this).text().replace('�', '');
					}
					if (i == 3) {
						satellite["launchDate"] = $(this).text().replace('�', '');
					}
					if (i == 4) {
						satellite["launchSite"] = $(this).text().replace('�', '');
					}
					if (i == 5) {
						satellite["organization"] = $(this).text().replace('�', '');
					}
					if (i == 6) {
						satellite["op"] = $(this).text().replace('�', '');
					}
					if (i == 7) {
						satellite["lat"] = $(this).text().replace('�', '');
					}

					if (i == 8) {
						satellite["lonEpoch"] = $(this).text().replace('�', '');
					}
					if (i == 9) {
						satellite["equatorialCrossingLon"] = $(this).text().replace('�', '');
					}
					if (i == 10) {
						satellite["lonDriftDegreesPerDay"] = $(this).text().replace('�', '');
					}
					if (i == 11) {
						satellite["lonRateOfChangeDegreesPer10Minutes"] = $(this).text().replace('�', '');
					}
					if (i == 12) {
						satellite["latRateOfChangeDegreesPer10Minutes"] = $(this).text().replace('�', '');
					}
					if (i == 13) {
						satellite["inclination"] = $(this).text().replace('�', '');
					}
					// if (i == 14) {
					// 	satellite[""] = $(this).text().replace('�', '');
					// }
					// if (i == 15) {
					// 	satellite[""] = $(this).text().replace('�', '');
					// }
					if (i == 16) {
						satellite["currentApogeeKM"] = $(this).text().replace('�', '');
					}

					if (i == 18) {
						satellite["currentPerigeeKM"] = $(this).text().replace('�', '');
					}

					if (i == 19) {
						satellite["currentAlitutde"] = $(this).text().replace('�', '');
					}

					if (i == 20) {
						satellite["AVRAltitutde"] = $(this).text().replace('�', '');
					}

					if (i == 21) {
						satellite["AVRDistanceFromGeoKM"] = $(this).text().replace('�', '');
					}
					

					if (i == 22) {
						satellite["numberOfOrbits"] = $(this).text().replace('�', '');
					}
					

					if (i == 23) {
						satellite["epoch"] = $(this).text().replace('�', '');
					}

					if (i == 24) {
						satellite["timeOfCalculation"] = $(this).text().replace('�', '');
					}

					if (i == 25) {
						satellite["timeSinceEpoch"] = $(this).text().replace('�', '');
					}
					if (i == 26) {
						satellite["id"] = $(this).text().replace('�', '');
					}
					if (i == 28) {
						satellite["altitudeOfEquatorCrossing"] = $(this).text().replace('�', '');
					}
					if (i == 29) {
						satellite["distanceFromGeoEquatorCrossing"] = $(this).text().replace('�', '');
					}
					// satellite.
					//                         console.log($(this).text().replace('�', ''));

                });

				satellites.push(satellite);
				
                // fruits[i] = $(this).text().replace('�', '');
        });
		
		var fs = require('fs');


		var outputFilename = 'satellites.json';

		fs.writeFile(outputFilename, JSON.stringify(satellites, null, 4), function(err) {
		    if(err) {
		      console.log(err);
		    } else {
		      console.log("JSON saved to " + outputFilename);
		    }
			tools.shutdown();
		}); 
		

		

});
