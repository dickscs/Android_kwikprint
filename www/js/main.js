/*
 *	main.js	
 *	
 *	javascript for main.js
 */
 

	var g_uid ;  // Firebase UID gobal variable
	var g_userRef ; // Firebase user Reference gobal variable
	var g_photoDataURI ; // Photo of the use 
	var g_printList = [] ; // Printer List
	var g_messageList = [] ; // Message List 
	
	function logout() {
		firebase.auth().signOut().then(function() {
			window.sessionStorage.setItem("firebaseUser", null); // Clear user session storage 
			window.sessionStorage.setItem("gpsChecked", null);
			//window.location = "login.html";
			window.location = "index.html#pageLogin";
		}, function(error) {
			// An error happened 
			alert("Logout Failed");
		});
	}
	
	
	$(document).ready( function() {
		if (typeof(window.cordova)!="undefined") {	 // Check Phonegap or browser
			document.addEventListener("deviceready", onDeviceReady, false);    // For Phone Gap
		} else {	// For testing in chrome		
			onDeviceReady();	// For Browser
		}
	}); 
	

	function reloadFirebase() {
		$.mobile.loading('show'); // Show loading 	
		
		if (sessionStorage.getItem("firebaseUser")) {
			var fuser =  JSON.parse(sessionStorage.getItem("firebaseUser"));			
			var uid = fuser.uid ;
			g_uid = uid ;
//alert("firebase user : " + uid); 		
			// Retrieve user info from firebase database 
			var ref = firebaseDB.ref("users/" + uid);
			g_userRef = ref; 
					
			ref.once("value", function(data) {			
//alert("data " + data.val().user_name);
//alert("data : " + JSON.stringify(data.val()));	
				fdb_userInfo = data.val();		
				$("#userEmail").html(data.val().email_address ) ;
				$("#userName").html(data.val().user_name) ;
				// User Profile data
				$("#p_emailAddress").val(data.val().email_address);
				$("#p_userName").val(data.val().user_name);
				$("#p_phoneno").val(data.val().phone_no);
//alert("img : " + data.val().avatar_image);				
				if (data.val().avatar_image) { g_photoDataURI = data.val().avatar_image ; }
				// Fill the photo
				$("#userPhoto").attr("src", g_photoDataURI); //.load(function() { this.width; }); 
				fillCanvas();				
				//$('#p_photoCanvas')[0].getContext('2d').drawImage( $("#userPhoto"), 0, 0, 100, 100 ) ;
				$("#p_bal").html(data.val().account_balance);
				
				$.mobile.loading( "hide") ;	
//alert("user name " + $("#p_userName").val());				
			}, function(err) { 
				alert("Error " + err) ;
			});	
	
		}
			
	}
	
// Load Database Message
	function loadMessageList(){
		$.mobile.loading('show'); // Show loading 	
		
		var ref = firebaseDB.ref("last_message/" );
//console.log(ref);		
		//ref.orderByChild("datetime").on("child_added", function(snapshot) {
		//ref.child(g_uid).startAt().limitToFirst(100).on("child_added", function(snapshot) {
		ref.child(g_uid).orderByChild("order").limitToLast(100).on("child_added", function(snapshot) {
			var data = snapshot.val();
			data.uid = snapshot.key ;  // Add user ID to the data list
//console.log("key : " + snapshot.key);
//console.log("uid : " + data.uid);			
			var ref2 = firebaseDB.ref("users/" + data.uid).once("value", function(snapshot2) {
				var udata = snapshot2.val();
//console.log("udata:");
//console.log(data);				
				if (udata) {
					data.user_name = udata.user_name;
//console.log("user name : " + data.user_name );		
					data.email_address = udata.email_address;
					data.phone_no = udata.phone_no;
					data.avatar_image = udata.avatar_image;
//console.log(data.avatar_image);		

					mhtml = // "<li style='height:60px ; padding:0px; vertical-align:top; margin:0;'>" +
							//"<div style='width:60px;height:60px;display:inline;float:left;'>" +
							//"<img style='width:60px;height:60px;' src='" + data.avatar_image +  "'> </div>" + 
							//"<div style='width:100%; display:inline-block;text-align:top; margin:5px 0px 0px 20px;'>" + data.user_name + 
							//"<div style='float:right;margin-right:70px;text-align:right;'>" + data.datetime + "</div>" +
							//"<div style='display:block;margin:0px 0px 0px 0px;'>" + data.message_header + "</div>" +
							"<li class='msg_list'>" + 
							"<div style='float:left;'>" +
							"<img class='msg_img' src='" + data.avatar_image +  "'> </div>" + 
							"<div class='msg_owner'><b>" + data.user_name + "</b>" + 
							"<div class='msg_date'>" + data.datetime + "</div>" +
							"<div class='msg_txt' ><a href='#'>" + data.message_header + "</a></div>" +
							"</div>" + 
							"</li>" ;
		
	//console.log("html " + mhtml);
					
					$("#messageList").append(mhtml).listview("refresh");
				
				}
		
			}, function(error) {
				console.log( error);
			}) ;
			
			g_messageList.push(data);
			
		
			
		}, function(error) {
			console.log( error);
		});
		
/*		
		ref.once("value", function(data) {
			userMsg = data.val();	
console.log(userMsg);			
			if (userMsg) {
console.log("makearray");				
console.log( $.makeArray( $.makeArray($.makeArray(userMsg)[0])[0] ));
				
				arr = $.map(userMsg, function(value, key) {
					return [ [key, value] ];
				});
console.log("array");			
console.log(arr[1,0]);
			}

				
		}, function(err) {
			console.error("Message list error : " + err);
		});
*/		
		
	}
	
	
	function onDeviceReady() {

		if ( sessionStorage.getItem("gpsChecked")==null ) {

			gpsCheck();
			sessionStorage.setItem("gpsChecked" ,"true");	
		} 

		reloadFirebase();
loadMessageList();		
		
		//setTimeout(gpsCheck,1000);
		// Direct to user profile page when user's photo is clicked
		$("#userPhoto").on("click", function() {
			$.mobile.pageContainer.pagecontainer("change", "#userProfile") ;
		});
	
	} // End Device Ready


	$(document).ready(function($) {
	
		//gpsCheck();
		function getMyLoc() {
			//setTimeout(gpsCheck,2000);
			//gpsCheck();
			$.mobile.loading('show'); // Show loading 	
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition( function(pos) {
					var latlng  = new google.maps.LatLng(  pos.coords.latitude,  pos.coords.longitude);
					var geocoder = geocoder = new google.maps.Geocoder();
					geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                		if (status == google.maps.GeocoderStatus.OK) {
                    		if (results[1]) {
                        		//alert("Location: " + results[1].formatted_address);
								//return { "lat" :  pos.coords.latitude, "lng" :  pos.coords.longitude, "addr" : results[1].formatted_address};
								$("#pr_lat").val(pos.coords.latitude);
								$("#pr_long").val(pos.coords.longitude);
								$("#pr_addr").val(results[1].formatted_address.substring(0,60));
								$.mobile.loading('hide'); // Hide loading 	
                    		}
                		}

           			});
				}	
				, function(err) {
					console.log(err.message);
					$.mobile.loading('hide'); // Hide loading 	
					alert("Can't get location.\Try again later, make sure GPS is turned ON.\n" + err.message);
				} 
				, {maximumAge: 300000, enableHighAccuracy:true, timeout: 15000} );  // Wait 15 seconds for location finding
			}				
		
		}
		
		$("#btn_getlocation").on("click", function () {
			if (confirm("Are you sure to fill in current location data?")) {			
				getMyLoc();
				return ; 
			}
		});
		
		
	});
	
	function gpsCheck() {
		//var deferred =  $.Deferred();

		try {
			cordova.plugins.diagnostic.isGpsLocationEnabled(function(enabled){
			//cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
//cordova.plugins.diagnostic.switchToLocationSettings();			
			//Diagnostic.isLocationEnabled(function(enabled) {
				console.log("GPS location is " + (enabled ? "enabled" : "disabled"));
				if (!enabled) {
					alert("Please turn on the GPS now.");
					cordova.plugins.diagnostic.switchToLocationSettings();	
				}
			}, function(error){
				alert("Please enable the GPS first !");		
				console.error("The following error occurred: " + error);
				cordova.plugins.diagnostic.switchToLocationSettings();		
			});
		} catch (e) {
			console.error("GPS error : " + e) ;
			alert("Please make sure your GPS is turned ON.\n\n" + e);
			try {
				cordova.plugins.diagnostic.switchToLocationSettings();	
			} catch (e) {
				console.log(e);
			}
		}
	}
	
	function fillCanvas() {
		var myCanvas = document.getElementById('p_photoCanvas');
		var ctx = myCanvas.getContext('2d');
		var img = new Image;
		img.onload = function(){
			ctx.drawImage(img,0,0); // Or at whatever offset you like
		};
		img.src = g_photoDataURI;
		$("#userPhoto").attr('src', g_photoDataURI);	
	}
		

		
		// Init. Printer Edit screen
		function editPrn(idx) {
				idx -- ; 
				sessionStorage.editType = "EDIT" ; 
//alert( "prn : " + JSON.stringify( g_printList[idx] ) ) ;
				$.mobile.pageContainer.pagecontainer("change", "#editPrinter");
				$("#pr_brandName").val(g_printList[idx].brand) ;
				$("#pr_model").val(g_printList[idx].model) ;
				$("#pr_desc").val(g_printList[idx].description) ;	
				$("#pr_price").val(g_printList[idx].price) ;	
//alert(g_printList[idx].price);				
				$("#pr_long").val(g_printList[idx].location_longitude) ;	
				$("#pr_lat").val(g_printList[idx].location_latitude) ;	
				$("#pr_addr").val(g_printList[idx].location_address) ;	
				$("#pr_printerID").val(g_printList[idx].printerID);
//alert($("#pr_printerID").val());		
		}

			
		// Load and preview Image
		$(function() {  // old 
		//$(document).on('mobileinit', function()  {	
		//$(document).on('pageinit', function()  {	
			
			// Load and Preview Picture
			$('#p_selectPhoto').change(function(e) {
				var file = e.target.files[0],
				imageType = /image.*/;
                
				var reader = new FileReader();
				reader.onload = function(e){
					var $img = $('<img>', { src: e.target.result });		
					var canvas = $('#p_photoCanvas')[0];
					canvas.width = 100; // clear canvas and set the size to 100
					canvas.height = 100;
					var context = canvas.getContext('2d');
					$img.load(function(ev) {	
						$('#p_photoCanvas')[0].getContext('2d').drawImage(this, 0, 0, 100, 100);
//console.log("resize:"+canvas.toDataURL('image/jpeg'));		
						$('#p_photoSmall')[0].getContext('2d').drawImage(this, 0, 0, 20, 20);
					});
				};
				reader.readAsDataURL(file);
        
			});			
		
			// Function for Saving User Profile
			//$("#saveProfile").click( function() { 
			$("#userProfile_form").on("submit", function() { 
				event.preventDefault(); 		// Disable default form submit action 
//alert("save : " + $("#p_photoCanvas")[0].toDataURL("image/jpeg") );
				var imgData = $("#p_photoCanvas")[0].toDataURL("image/jpeg") ;
				var imgDataSmall = $("#p_photoSmall")[0].toDataURL("image/jpeg") ;
				//g_userRef.child("avatar_file_url").set( {"image" : imgData})
				//g_userRef.child("avatar_file_url").set( imgData)
				g_userRef.update({ 	
					"avatar_image" : imgData,  
					"avatar_image_small" : imgDataSmall,
					"phone_no" : $("#p_phoneno").val(),
					"user_name" : $("#p_userName").val(),
					"Last_Update_date" : getCurrentDateTime()
				}) 
				.then( function() {
					//alert("saved");
					reloadFirebase();
					$.mobile.pageContainer.pagecontainer("change", "#mainPage");
				}, function(error) {
					alert("Error : " + error ); 
					//var errorMessage = error.message ;
				});
			}) ;
	
			// Show Printer Edit Screen
			$("#editPrinter").on("pageshow", function(event) {
			//$.mobile.document.on( "pageshow", "#editPrinter", function() {
	
				if ( sessionStorage.editType == "ADD") {
					$("#peditHeader").html("Add Printer") ;
					
					$("#pr_brandName").val("") ;
					$("#pr_model").val("") ;
					$("#pr_desc").val("");
					$("#pr_price").val("");
					$("#pr_long").val("");
					$("#pr_lat").val("");
					$("#pr_addr").val("");
					$("#pr_printerID").val("");
					//$("#peditPname").html("New Printer");
				} else {
					$("#peditHeader").html("Edit Printer") ;
					//$("#peditPname").html("Printer:");
					$("#peditHeader").append('<a data-role="button" href="#pedit-panel" data-icon="bars" class="ui-btn-right" data-iconpos="notext">Edit</a>').enhanceWithin();
					$.mobile.resetActivePageHeight();
				}
			
			});
		
			// Delete Printer Clicked
			$("#btn_pdelete").on("click", function () {	
				if (confirm("Are you sure to delete this printer?")) {
					sessionStorage.editType = "DELETE";
					//$("#printEdit_form").submit();
					savePrinterData();
				} 
				return false;
			});
			
			// Function Save Printer Data 
			savePrinterData = function() {
						
				var prn_model = $("#pr_model").val();
				var prn_brand = $("#pr_brandName").val();
				var prn_desc = $("#pr_desc").val();
				var prn_price = $("#pr_price").val();
				var prn_address = $("#pr_addr").val();
				var prn_long = $("#pr_long").val();
				var prn_lat = $("#pr_lat").val();
				//alert("save printer : " + $("#p_photoCanva
				if ( sessionStorage.editType == "ADD") {	// Add a printer 
				// Get a key for a new Post.
					var newPrinterIDKey = firebaseDB.ref().child('printer_info').push().key;
					var postData= {"brand": prn_brand, "model" : prn_model, "userID" : g_uid, "description" : prn_desc, 
								"printer_status" : "Available", "price" : prn_price, 
								"location_address" : prn_address, "location_longitude" : prn_long, "location_latitude" : prn_lat } ;
					var updates = {};
					updates['/printer_info/' + newPrinterIDKey] = postData;

					//firebase.database().ref().update(updates).then(function() {
					firebaseDB.ref().update(updates).then(function() {
						$.mobile.pageContainer.pagecontainer("change", "#myPrinter");
					}, function (error) {  
						var errorcode = error.code; 
						var errorMessage = error.message;
						alert("Error : " + errorMessage);
					});
				} else if ( sessionStorage.editType == "EDIT") {
					var ref = firebaseDB.ref("printer_info/" + $("#pr_printerID").val() );
					var postData= {"brand": prn_brand, "model" : prn_model, "userID" : g_uid, "description" : prn_desc, 
								"printer_status" : "Available", "price" : prn_price, 
								"location_address" : prn_address, "location_longitude" : prn_long, "location_latitude" : prn_lat } ;
					ref.update(postData).then(function() {
						//getPrinterList();
						$.mobile.pageContainer.pagecontainer("change", "#myPrinter");
					}, function (error) {  
						var errorcode = error.code; 
						var errorMessage = error.message;
						alert("Error : " + errorMessage);
					});
				} else if ( sessionStorage.editType == "DELETE") {
					var ref = firebaseDB.ref("printer_info/" + $("#pr_printerID").val() );					
					ref.remove();
					//getPrinterList();
					$.mobile.pageContainer.pagecontainer("change", "#myPrinter");
				}
				sessionStorage.editType = ""; // Reset Edit type session variable
			};
			
			// Function for Saving Printer Info
			$("#printEdit_form").on("submit",  function() { 
				event.preventDefault(); 		// Disable default form submit action 
				savePrinterData();
			});
			
			// Retrieve printer_info 
			function getPrinterList() {		
				var ref = firebaseDB.ref("printer_info");
				var cnt = 0;
//alert("list printer");
				$.mobile.loading('show'); // Show loading 	
				var k = $("#printul li").size();	
				for ( i =1; i <= k;  i++ ) 	$("#printul li").eq(1).remove(); 	// Delete List Items Before load data
				//for ( i =1; i <= k;  i++ ) 	$("#printul li").last().remove(); 	// Delete List Items Before load data
				g_printList=[];  // Clear Printer List Array
				ref.orderByChild("userID").equalTo(g_uid).limitToFirst(20).on("child_added", function(snapshot) { 		
					// Fill Printer List
					cnt ++ ;
					var data = snapshot.val();
					var ls = "<li><a href='#'><h2>" + cnt + ") " + data.brand + "_" + data.model + "</h2>" +
							 "<p>" + data.description + "</p></a>" +
							 "<a href='javascript:editPrn(" + cnt + ");' data-rel='popup' data-position-to='window' data-transition='pop' data-icon='edit'>Edit Printer</a></li>";
					
					$("#printul").append(ls).listview("refresh");
					data.printerID = snapshot.key; // Add key value to  printer list data 
					g_printList.push(data);		
					//$("Printer "+ cnt ).insertAfter("#PrintListHeader");
					$.mobile.loading('hide'); // Show loading 	
			
				});
				$.mobile.loading('hide'); // Show loading 	
			}
					
			//$("#myPrinter").one("pageshow", function() {
			$(document).on("pageshow", "#myPrinter" , function(event) {
//				history.replaceState({}, "Kwik Prin","main.html");
//alert("his" + window.history);				
				getPrinterList();
			});
			
			$(document).on("pageshow", "#editPrinter" , function(event) {
				history.replaceState({}, "Kwik Print","main.html");		// return to main screen when back button is pressed
			});
			
		
		});
		
		