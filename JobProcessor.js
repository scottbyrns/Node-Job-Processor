var fs = require('fs');

var Router = {
	routes: {}
}

Router.on = function (route, destination) {
	Router.routes[route] = destination;
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
		  console.log('closing code: ' + code);
		  Router.routes[route](route);
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







  Router.on("UPDATE-SWMF-MAGNETOSPHERE-AND-IONOSPHERE-DATA", function () {
	
  });
  
  
  
  
  
  Router.on("UPDATE-CBX-N0R-0", function () {

  });
  
  
  
  
  Router.on("UPDATE-SDO-0304", function (route) {

  });
  
  
  
  
  Router.on("FETCH-SATELLITE-DATA", function () {
  	
  });
  
  Router.on("SATELLITE-DATA-READY-FOR-PROCESSING", function () {
  	
  });

  console.log(Router);



  
  nrp.on("EVENT", function (message) {
	  Router.route(message);
  });
  
  nrp.on("JOBS", function (m) {
	  if (m == "QUIT") {
		  process.exit(0);
	  }
  })
  
  
  
  //
//
//
// nrp.on("SCHEDULE-EVENT", function (message) {
//   // say("SCHEDULE-EVENT", message);
//   });
//   nrp.on("JOB-NODE-" + nodeUUID, function (message) {
// 	  // say("JOB-NODE-" + nodeUUID, message);
//   	  if (message == "SHUTDOWN") {
//   		  nrp.emit("EVENT", "JOBE-NODE-" + nodeUUID + "-SHUTTING-DOWN");
//   		  exit(0);
//   	  }
// 	  if (message == "PAUSE") {
// 		  paused = true;
// 		  nrp.emit("EVENT", "JOB-NODE-" + nodeUUID + "-DID-PAUSE");
// 	  }
// 	  if (message == "RESUME" || message == "START") {
// 		  paused = false;
// 		  nrp.emit("EVENT", "JOB-NODE-" + nodeUUID + "-DID-" + message);
// 	  }
//
// 	  if (message == "HELP") {
// 		  nrp.emit("EVENT", {
// 			  message: "JOB-NODE-" + nodeUUID,
// 			  inputs: {
// 				  system: ["PAUSE", "RESUME", "START", "SHUTDOWN"],
// 				  space: ["FETCH-SATELLITE-DATA", "UPDATE-SDO-0304"]
// 			  }
// 		  });
// 	  }
//   });
//
//   nrp.emit("EVENT", "NODE-" + nodeUUID + "-JOINED-JOB-POOL");
//
//
//