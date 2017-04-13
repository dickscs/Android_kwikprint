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
	   
