var fs = require('fs');

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







  Router.on("UPDATE-SWMF-MAGNETOSPHERE-AND-IONOSPHERE-DATA");
  
  

  Router.on("PERSIST-NEXRAD-SITES");
  Router.on("FETCH-NEXRAD-RADAR-SWEEPS");
  Router.on("PUT-NEXRAD-ON-WEBSITE");
  Router.on("FETCH-NEXRAD-RADAR-COVERAGE-DATA");
    
  Router.on("UPDATE-CBX-N0R-0");
  
  
  
  
  Router.on("UPDATE-SDO-0304");
  
  
  Router.on("GEO-CACHE-NEXRAD-DATA");
  
  Router.on("FETCH-SATELLITE-DATA");
  
  Router.on("SATELLITE-DATA-READY-FOR-PROCESSING");



  
  nrp.on("EVENT", function (message) {
	  Router.route(message);
  });
  
  nrp.on("JOBS", function (m) {
	  if (m == "QUIT") {
		  process.exit(0);
	  }
  })
  
  
  