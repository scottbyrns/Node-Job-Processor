var fs = require('fs');

var xml2js = require('xml2js');

var parser = new xml2js.Parser();

var tools = require('./JobHandlers/JobTools');

var Router = {
	routes: {}
}

Router.on = function (route, destination) {
	Router.routes[route] = true;//destination;
}

Router.route = function (route) {
	if (Router.routes[route]) {
		

		var exec = require('child_process').exec;
		var child = exec('node ./JobHandlers/' + route + '.js');
		child.stdout.on('data', function(data) {
		  console.log('stdout: ' + data);
		});
		child.stderr.on('data', function(data) {
		  console.log('stdout: ' + data);
		});
		child.on('close', function(code) {
		  // console.log(route + '-DID-CLOSE-' + (code == 0 ? "NORMALY" : "UNEXPECTEDLY"));
		  nrp.emit("JOB-LOG", route + '-DID-CLOSE-' + (code == 0 ? "NORMALY" : "UNEXPECTEDLY"));
		  // Router.routes[route](route);
		});
		

	}
}



var NRP = require('node-redis-pubsub')
  , config = { port: 6379       // Port of your remote Redis server
             , host: 'svns.mobi' // Redis server host, defaults to 127.0.0.1
             // , auth: 'password' // Password
             // , scope: ''    // Use a scope to prevent two NRPs from sharing messages
             }
  , nrp = new NRP(config);      // This is the NRP client




  var handlers;


fs.readFile(__dirname + '/JobHandlers.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
		handlers = result.handlers.handler;
		// console.error(err);
		//         console.dir(result);
		//         console.log('Done');
		
		for (var i = 0, len = result.handlers.handler.length; i < len; i += 1) {
			console.log("Registering route: ", result.handlers.handler[i].event[0]);
			Router.on(result.handlers.handler[i].event[0]);
		}
		
    });
});



var a = tools.client.llen('JOB-PROCESSOR-STACK', function (err, count) {
	var processorId = count;

	nrp.on("JOB-PROCESSOR-" + processorId, function (m) {
    	  if (m == "QUIT") {
			  console.log("Quitting by command.");
    		  process.exit(0);
    	  }
		  Router.route(message);
	});

    nrp.on("EVENT", function (message) {
  	  Router.route(message);
    });

    nrp.on("LIST-AVAILABLE-JOBS", function (message) {
  	  if (message === processorId) {
		  for (var i = 0, len = handlers.length; i < len; i += 1) {
			  tools.client.publish("AVAILABLE-JOB", handlers[i].event);
		  }
  	  }
    });
	
	tools.client.rpush('JOB-PROCESSOR-STACK', 1, function () {
	
		tools.client.publish("JOB-PROCESSORS", processorId);
	
	});
	
});




  // Router.on("UPDATE-SWMF-MAGNETOSPHERE-AND-IONOSPHERE-DATA");
  // Router.on("PERSIST-NEXRAD-SITES");
  // Router.on("FETCH-NEXRAD-RADAR-SWEEPS");
  // Router.on("PUT-NEXRAD-ON-WEBSITE");
  // Router.on("FETCH-NEXRAD-RADAR-COVERAGE-DATA");
  // Router.on("UPDATE-CBX-N0R-0");
  // Router.on("UPDATE-SDO-0304");
  // Router.on("GEO-CACHE-NEXRAD-DATA");
  // Router.on("FETCH-SATELLITE-DATA");
  // Router.on("SATELLITE-DATA-READY-FOR-PROCESSING");


  