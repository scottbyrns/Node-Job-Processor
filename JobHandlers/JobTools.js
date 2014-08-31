var JobTools = function () {

	this.redis = require('redis');




	var fs = require('fs'),
	    request = require('request');
	
	
	this.download = function(uri, filename, callback){

		filename = new Date().toISOString() + "-" + filename;

	  request.head(uri, function(err, res, body){

	    console.log('content-type:', res.headers['content-type']);
	    console.log('content-length:', res.headers['content-length']);

	    var r = request(uri).pipe(fs.createWriteStream(filename));
	    r.on('close', function () {
	    	callback(filename);
	    });
	  });
	};

	this.emit = function (c,m) {
		if (!this.client) {
			this.client = this.redis.createClient(6379, 'svns.mobi', {});
		}
		this.client.publish(c,m);
	}

	this.shutdown = function () {

		if (this.client) {
			this.client.end();
			this.client.quit();
		}
		process.exit(0);
		
	}
};

module.exports = new JobTools();
