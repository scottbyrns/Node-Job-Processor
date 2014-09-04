var tools = require("./JobTools");

var apiKey = "8604607825a25aabbdfc8713f27c81997bc16844";
var url = "https://api.sendhub.com/v1/messages/?username=" + "2088678553" + "&api_key=" + apiKey;


tools.client.on("message", function (channel, message) {

	var parts = message.split(":");

	var request = require("request");

	request({
	  url: url,
	  method: "POST",
	  json: {
  		  contacts: [
			  parts[0]
		  ],
		  text: parts[1]
	  }
	}, function _callback(err, res, body) {
	  var result = body;
	  console.log(arguments);
	});

	
	
});

tools.client.subscribe("SEND-SMS");