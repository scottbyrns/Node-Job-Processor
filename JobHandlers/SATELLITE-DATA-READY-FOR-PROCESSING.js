var tools = require('./JobTools');

var cheerio = require('cheerio');
var fs = require('fs');

fs.readFile('satelliteList.php.raw', 'utf8', function (err, fileContents) {
	
	if (err) {
	
		return console.log(err);
	
	}
	
	$ = cheerio.load(fileContents);
	
	var rows = $("#main tbody tr").each(function(i, elem) {
		
		$(this).find("td").each(function (i, elem) {
			
			console.log($(this).text());
			
		});
		
		// fruits[i] = $(this).text();
	});;
	
});






tools.shutdown();