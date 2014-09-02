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


		if (Math.abs(xMi)>maxMix || Math.abs(yMi)>maxMiy) {
			
			return {
				z: 0,
				a: 0,
				a2: 0,
				lony = 0,
				lotx = 0
			};
			
		} else {
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
				z: zz,
				a: aatxt,
				a2: aa,
				lony = lo,
				lotx = la
			};
			// document.myform.z.value = zz + ' Mi Away';
			// document.myform.a.value = aatxt;
			// document.myform.a2.value = aa + ' Degrees';
			// document.myform.lony.value = lo;
			// document.myform.latx.value = la;
		}
};