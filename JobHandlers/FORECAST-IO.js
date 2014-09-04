var apiKey = "7a93038fa0f3f62da995dc282b5602a1";
var url = "https://api.forecast.io/forecast/7a93038fa0f3f62da995dc282b5602a1/{{lat}},{{lon}}?units=si"

var tools = require("./JobTools");
var restify = require('restify');

var server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

var broadcastLimit = 5;

server.get('/track/:lat/:lon', function (req, res, next) {
	var lat = req.params.lat;
	var lon = req.params.lon;
	
	console.log(lat, lon);
	
	var request = require("request");
 
	request({
	  uri: url.replace("{{lat}}", lat).replace("{{lon}}", lon),
	  method: "GET"
	}, function(error, response, body) {
		var data = JSON.parse(body);
		var out = "There is a " + ~~(data.currently.precipProbability * 100) + "% chance of rain.\n" + data.minutely.summary;
		console.log(out);
		if (data.currently.precipProbability > 0.85 && broadcastLimit > 0) {
			//data.minutely.summary + ".\nTemp° is " + data.currently.temperature + 
			out = "There is a " + ~~(data.currently.precipProbability * 100) + "% chance of rain.\n" + data.minutely.summary;
			console.log(out);
			broadcastLimit -= 1;
			tools.client.publish("SEND-SMS", "+12088678553:" + out);			
		}
		res.send(out);
		next();
	});
	
  // res.send(req.params);
  // return next();
});

server.listen(8147, function () {
  console.log('%s listening at %s', server.name, server.url);
});