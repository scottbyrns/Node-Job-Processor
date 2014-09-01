var tools = require('./JobTools');

var exec = require('child_process').exec;
var child = exec('cp -f /tmp/*-N0R.gif /root/RobotCloud/src/www/weather/NEXRAD/');

child.stdout.on('data', function(data) {
  console.log('stdout: ' + data);
});
child.stderr.on('data', function(data) {
  console.log('stdout: ' + data);
});
child.on('close', function(code) {
	tools.emit("EVENT", "DID-PUT-NEXRAD-ON-WEBSITE");
	tools.shutdown();
});
