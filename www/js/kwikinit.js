/*
 *	kwikinit.js	
 *	
 *	Kwik Print Initialize javascript  
 */
 

	///var firebaseUser;
	var fdb_userInfo ;
 
 	// Initialize Firebase
	// Kwikprint firebase login
	var config = {
		apiKey: "AIzaSyBG7xhHmpqfHyPM-wN-BcBi2pQO2oWQ3ZQ",
		authDomain: "kwik-print.firebaseapp.com",
		databaseURL: "https://kwik-print.firebaseio.com",
		storageBucket: "kwik-print.appspot.com",
		messagingSenderId: "797289120225"
	};
	
	firebase.initializeApp(config);
	
	var firebaseDB = firebase.database();
	
	var gpsChecked = false;

	///// Common Utilities 
	
	// Get current timestamp in yyyy-mm-ddThh:mm:ss.sss format
	function getCurrentDateTime() {  // Return current timestamp in string format "yyyy-mm-ddThh:mm:ss.sss"
		return  (new Date(Date.now() -  (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0,-1);
	}
	
	// Get specific URI Parameter 
	function getSearchParams(k){
		var p={};
		location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v})
		return k?p[k]:p;
	}

	// Mathemetic Degree to Radian 
	deg2rad = function(degree) {
		return degree * Math.PI / 180;
	}
	
	// Calculate Distance(km) between 2 points in latitude and longitude
	function LatLng2distance(lat1, lat2, lng1, lng2) {
		var R = 6371; // Radius of the earth in km
		
		var dLat = deg2rad(lat2-lat1);  // deg2rad below
		var dLng = deg2rad(lng2-lng1); 
		
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLng/2) * Math.sin(dLng/2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c; // Distance in km
		return d;
	}

	
	// Initialize Android Back button 
       document.addEventListener("backbutton", function (e) {
//alert("page:" + $.mobile.activePage);	   
			//if($.mobile.activePage.is('#pageLogin')){
			if ($( "body" ).pagecontainer( "getActivePage" ).is("#pageLogin, #mainPage")) {		
				//e.preventDefault();
				if (confirm("Are you sure to exit?")) {
					navigator.app.exitApp();
					
				} else {
					e.preventDefault();					
				
					return false;
				}
			} else {	
				navigator.app.backHistory(); 
				//e.preventDefault();
			}
       }, false );
	   
