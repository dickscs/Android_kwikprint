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
	
    /*
	// Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
	
	firebase.initializeApp(config);
	*/
	//
	
	/*
	function disableBackbutton() {
alert("bttn");		
	   document.addEventListener("backbutton", function (e) {
alert("backbutton");		   
            e.preventDefault();
        }, false );
		
	*/	

	// Initialize Android Back button 
       document.addEventListener("backbutton", function (e) {
//alert("page:" + $.mobile.activePage);	   
			//if($.mobile.activePage.is('#pageLogin')){
			if ($( "body" ).pagecontainer( "getActivePage" ).is("#pageLogin")) {		
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
	   