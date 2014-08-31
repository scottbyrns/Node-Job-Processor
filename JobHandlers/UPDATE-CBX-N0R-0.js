var tools = require('./JobTools');

var path = "http://radar.weather.gov/ridge/RadarImg/N0R/CBX_N0R_0.gif";
tools.download(path, "CBX-N0R-0.gif", function (filename) {
  tools.emit("EVENT", "CBX-N0R-0-DID-UPDATE");		
});