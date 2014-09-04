var tools = require('./JobTools');
var databaseUrl = "mongodb://svns.mobi:27017/geodb"; // "username:password@example.com/mydb"
var Db = require('mongodb').Db;

Db.connect(databaseUrl, function(err, db) {

	
    if(err) return console.dir(err)
    var collection = db.collection('NEXRAD');

	

	tools.client.on("message", function (channel, messages) {
		if (channel == "NEXRAD-LOOKUP") {
			console.log(arguments);
			var location = messages.split(":");
			location[0] *= 1;
			location[1] *= 1;			
			

			
			collection.findOne({
			
		        "geo.loc": {
		           $nearSphere: location
		        }

			
			} , function (err, curosr) {
				// var cursor = collection.findOne({}, function () {
					console.log(arguments);
				// });

				// cursor.each(function () {
				// 	console.log(arguments[1]);
				// });

			});	
		}		
	});
	tools.client.subscribe("NEXRAD-LOOKUP");

});