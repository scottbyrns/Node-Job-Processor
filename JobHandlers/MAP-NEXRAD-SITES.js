var tools = require('./JobTools');
var databaseUrl = "mongodb://svns.mobi:27017/geodb"; // "username:password@example.com/mydb"
// var collections = ["Accounts", "Robots"]
var pixels = require("get-pixels");

var Db = require('mongodb').Db;

// var documents = [
//     {name: "Awesome burger bar", loc: [50, 50]}
//   , {name: "Not an Awesome burger bar", loc: [10, 10]}
//   , {name: "More or less an Awesome burger bar", loc: [45, 45]}
// ]

var unmap = function (lat, lon, xllcorner, yllcorner) {
	var ycoord = -1 * (((la/xyperpixel) - xllcorner)+191-1)
	var xcoord = (((yllcorner-lon)/xyperpixel) / -1)+158-1
	return {
		x:xcoord,
		y:ycoord
	}
}

var map = function (Mi, Lat, xyperpixel, xllcorner, yllcorner, xcoord, ycoord) {
    var maxMix = Mi-1;
  	if (Lat<32.57) var maxMiy = Mi-1;
  	else	var maxMiy = Mi+Math.round(((Lat-32.57)*5.7)/2);
   var MiPerPixelx = Mi/311;
    var MiPerPixely = maxMiy/255
    var xx=0;
    var yy=0;
    var zz=0;
    var aa=0;
    var xMi=0;
    var yMi=0;
    var xMiOrigin=0;
    var yMiOrigin=0;
    var xlat=0;
    var ylon=0;
    var LatOrigin=0;
    var LonOrigin=0;
    var AzOrigin=0;
    var DegOrigin=0;
    var FromRadar=0;

	
	
	// FROM http://radar.weather.gov/ridge/XYdistance.js
	//Note, xcoord and ycoord are distance from the beginning of the window.
	//Different browsers may add a pixel here or there, and my fudge factors
	//(the 170 and 158) may not be valid for all browsers.
		xMi= (xcoord-300-158+1)*MiPerPixelx;
		yMi=-(ycoord-275-191+1)*MiPerPixely;
		xlat= (ycoord-191+1)*xyperpixel;
		ylon= -(xcoord-158+1)*xyperpixel;


		// if (Math.abs(xMi)>maxMix || Math.abs(yMi)>maxMiy) {
		//
		// 	return {
		// 		z: 0,
		// 		a: 0,
		// 		a2: 0,
		// 		lony : 0,
		// 		lotx : 0
		// 	};
		//
		// } else {
			xx=xMi-xMiOrigin;
			yy=yMi-yMiOrigin;
			la=(xllcorner-xlat).toFixed(3);
			lo=(yllcorner-ylon).toFixed(3);
			zz=Math.round(Math.sqrt(xx*xx+yy*yy)-.01);
			aa=450-Math.round(Math.atan2(yy,xx)*57.29);
			if (aa>359) aa-=360;
			if (zz<1)	aa="0";
			xx=Math.round(xx);
			yy=Math.round(yy);
			// Turn -0 into +0
			if (xx == 0) xx=0;
			if (yy == 0) yy=0;
			if (zz == 0) zz=0;
			if (aa>=348.75 || aa<11.25) var aatxt = 'North';
			if (aa>=11.25 && aa<33.75) var aatxt = 'North Northeast';
			if (aa>=33.75 && aa<56.25) var aatxt = 'Northeast';
			if (aa>=56.25 && aa<78.75) var aatxt = 'East Northeast';
			if (aa>=78.75 && aa<101.25) var aatxt = 'East';
			if (aa>=101.25 && aa<123.75) var aatxt = 'East Southeast';
			if (aa>=123.75 && aa<146.25) var aatxt = 'Southeast';
			if (aa>=146.25 && aa<168.75) var aatxt = 'South Southeast';
			if (aa>=168.75 && aa<191.25) var aatxt = 'South';
			if (aa>=191.25 && aa<213.75) var aatxt = 'South Southwest';
			if (aa>=213.75 && aa<236.25) var aatxt = 'Southwest';
			if (aa>=236.25 && aa<258.75) var aatxt = 'West Southwest';
			if (aa>=258.75 && aa<281.25) var aatxt = 'West';
			if (aa>=281.25 && aa<303.75) var aatxt = 'West Northwest';
			if (aa>=303.75 && aa<326.25) var aatxt = 'Northwest';
			if (aa>=326.25 && aa<348.75) var aatxt = 'North Northwest';
			
			return {
				distance: zz,
				direction: aatxt,
				degrees: aa,
				lon : lo,
				lat : la
			};
			// document.myform.z.value = zz + ' Mi Away';
			// document.myform.a.value = aatxt;
			// document.myform.a2.value = aa + ' Degrees';
			// document.myform.lony.value = lo;
			// document.myform.latx.value = la;
		// }
};
Db.connect(databaseUrl, function(err, db) {
    if(err) return console.dir(err)
    var collection = db.collection('NEXRAD');




tools.client.llen("NEXRAD-SITE", function (err, len) {

	var counter = len;

	// for (var i = 0; i < len; i += 1) {
	//
	// }


	loadData(counter-1);
	
});

var loadData = function (z) {
	
	if (z<0) {return;}

	tools.client.lindex("NEXRAD-SITE", z, function (err, result) {
		
		if (err) {
			return console.error(err);
		}
		
		var site = JSON.parse(result);
		
		// var rawData = [];
		try {
		
			pixels("/tmp/" + site.site + "-N0R.gif", function (err, pixels) {
				if (err) {
					loadData(--z);
					return console.error(err);
				}
				console.log("got pixels", pixels.shape.slice());
				var shape = pixels.shape.slice();
			
			    //Get array shape
			     var nx = pixels.shape[0], 
			         ny = pixels.shape[1];
					 var raw = [];

			     //Loop over all cells
			     for(var i=1; i<nx-1; ++i) {
			       for(var j=1; j<ny-1; ++j) {
				   
					   var coordinate = map(site.coverage.mi, site.coverage.lat, site.coverage.xyperpixel, site.coverage.xllcorner, site.coverage.yllcorner, i, j);
					   var pixel = [];
					   for (var k = 0; k < 4; k += 1) {
						   pixel[k] = pixels.get(i, j, k);
					   }
					   if (coordinate.lat == "" || coordinate.lon == "") {
				   	
					   }
					   else {
				   
						   raw.push({
		 						   reading: {
		 						   	 							   pixel: pixel
		 						   },
		 						   reference: coordinate,
		 						   geo: {
									   type: "Point",
									   coordinates: [1*coordinate.lat, 1*coordinate.lon]
		 						   }
		  					   });
					   }

					   					   //
					   // rawData.push({
					   // 						   reading: {
					   // 							   pixel: pixel
					   // 						   },
					   // 						   reference: coordinate,
					   // 						   loc: [coordinate.lat, coordinate.lon]
					   // })
				   
			       }
			     }
			 

					 // MONGO

					     collection.ensureIndex({"geo.loc": "2dsphere"}, {min: -500, max: 500, w:1}, function(err, result) {
					       if(err) return console.dir(err);


				     	  				       collection.insert(raw, {w:1}, function(err, result) {
				     	  				         if(err) return console.dir(err)
											 
												 loadData(--z);
				     	  				 		  //
				     	  				 		  // 				 	    db.collection('places').find({loc: {$near: [50,50], $maxDistance: 10}}).toArray(function(err, docs) {
				     	  				 		  // 				 	      if(err) return console.dir(err)
				     	  				 		  // // console.log(docs);
				     	  				 		  // 				 	      // assert.equal(docs.length, 2);
				     	  				 		  // 				 	    });

				     	  				       });
					     });

			 

			 
			 
			 
			
			});
		
		}
		catch (e) {
			console.error(e);
			loadData(--z);
		}
	});

	
}
//
//
// Db.connect(databaseUrl, function(err, db) {
//     if(err) return console.dir(err)
//     var collection = db.collection('places');
//
//     collection.ensureIndex({loc: "2d"}, {min: -500, max: 500, w:1}, function(err, result) {
//       if(err) return console.dir(err);
//
//       collection.insert(documents, {w:1}, function(err, result) {
//         if(err) return console.dir(err)
//
// 	    db.collection('places').find({loc: {$near: [50,50], $maxDistance: 10}}).toArray(function(err, docs) {
// 	      if(err) return console.dir(err)
// 		  // console.log(docs);
// 	      // assert.equal(docs.length, 2);
// 	    });
//
//       });
//     });
// });
});
