/*
 *	mapsearch.js	
 *	
 *	javascript for mapsearch.js
 *  last modify : 2017.04.28
 */
 
	
	var g_uid2 ;  	// current user 
	var g_allprinters = [] ; 	// Store all printers info into array
	var pmarker = [] ; 			// Printer Marker array 
	var pinfowindow = []; 		// Printer infowindow ;
	var g_curLat = 52.620917, g_curLng =  -1.124071 ; 	// Current position's Latitude, Longitude
	var mapOptions = {
			panControl: true, 
			zoomControl: true, 
			mapTypeControl: false, 
			scaleControl: true, 
			streetViewControl: false,  
			overviewMapControl: false, 
			center: new google.maps.LatLng(g_curLat, g_curLng), // 
			zoom: 18, 
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	
	$(document).ready( function() {
//		$( "body" ).on( "pagecontainershow", function( event, data ) {		// Capture Page change event 
		$( "body" ).on( "pagecontainertransition", function( event, data ) {		// Capture Page change event 
			if (data.toPage[0].id == "mapsearch" ) {			
				g_uid2 = window.sessionStorage.getItem("currentUID");   // get currentUID	
				if (typeof(g_map)=="undefined") {	// Init only on first time init 
					initMap();
				}
				getPrinters();	
				setTimeout( function(){$.mobile.loading("hide")}, 2000 );			
			}
		});
		 

		
    	function contentHeight() {

			if( $.mobile.activePage.attr('id')=="mapsearch") {	// Apply change when page id = "mapsearch"
				var screen = $.mobile.getScreenHeight(),
					//header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight(),
					//header = $("#mapHeader.ui-header").outerHeight();
					//footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight(),
					header = $("#mapsearch .ui-header").hasClass("ui-header-fixed") ? $("#mapsearch .ui-header").outerHeight() - 1 : $("#mapsearch .ui-header").outerHeight(),
					footer = $("#mapsearch .ui-footer").hasClass("ui-footer-fixed") ? $("#mapsearch .ui-footer").outerHeight() - 1 : $("#mapsearch .ui-footer").outerHeight(),
				//contentCurrent = $("#map-canvas.ui-content").outerHeight() - $("#map-canvas.ui-content").height();
				contentCurrent = $("#mapsearch .ui-content").outerHeight() - $("#mapsearch .ui-content").height();
				content = screen - header - footer - contentCurrent;
				////* apply result */
				//$(".ui-content").height(content);
				//$("#map-canvas.ui-content").height(content);
				$("#mapsearch .ui-content").height(content);

			}	
			
    	}
   
		// Resize Map div when resize 
		$(document).on("ready pagecontainertransition", contentHeight);	
		$(window).on("throttledresize orientationchange", contentHeight);	
   
    	function initMap() {
    		// Variable store the last location 
    		var lastLat=52.621124, lastLong=-1.124762;  // default location
    		var zoom = 18 ;
			
			contentHeight(); // Set Map Canvas size 

				// Get last Location from local storage
    		if (typeof(Storage) !== "undefined") {
    			// Code for localStorage/sessionStorage.
    			if (localStorage.getItem("lastLat")) {			// Get Last Map Position
    				lastLat = localStorage.getItem("lastLat") ;
    				lastLong = localStorage.getItem("lastLong") ;		
    			} 
				if (localStorage.getItem("mapZoom")) {		// Get Last Map zoom level
					zoom = parseInt(localStorage.getItem("mapZoom"));
				}
    		} 

			mapOptions.zoom = zoom ;
			mapOptions.center =  new google.maps.LatLng(lastLat, lastLong)
    		g_map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    		//$("#map-canvas").data("map", g_map);

    		drawMap(new google.maps.LatLng(lastLat, lastLong)); 
			// Pan to last position 
			mapOptions.center =  new google.maps.LatLng(lastLat,lastLong) ;
    		g_map.panTo(mapOptions.center);	

			// 
			google.maps.event.addDomListener(g_map, 'center_changed', function() {
				var latlng = this.getCenter(); 
				var zoom = this.getZoom();
				localStorage.setItem("lastLat", latlng.lat() );
				localStorage.setItem("lastLong", latlng.lng() );	
				localStorage.setItem("mapZoom", zoom );	
			});
			
			google.maps.event.addDomListener(g_map, 'zoom_changed', function() {
				var latlng = this.getCenter(); 
				var zoom = this.getZoom();
				localStorage.setItem("lastLat", latlng.lat() );
				localStorage.setItem("lastLong", latlng.lng() );	
				localStorage.setItem("mapZoom", zoom );	
			});
			
		} // End initMap
	
		//function drawMap(latlng) {   
		function drawMap(latlng, zoom) {   
    		
			mapOptions.center = latlng;		
    		g_map.panTo(mapOptions.center);		// Move to current Location 
        
			// Get Last Current Marker 
			var mylat, mylng ;
			var n_latlng = latlng; 
			if (localStorage.getItem("myLat") && localStorage.getItem("myLng")) {
				mylat = parseFloat(localStorage.getItem("myLat"));
				mylng = parseFloat(localStorage.getItem("myLng"));
				n_latlng = new google.maps.LatLng( mylat, mylng) ;
			} 
			
			 // Add an overlay to the map of current lat/lng
            my_marker = new google.maps.Marker({
                //position: latlng,
				position: n_latlng,
                map: g_map,
                title : "My Location",
    			draggable : true,
				label : { text: "I" },
				labelContent: "A",
				labelAnchor: new google.maps.Point(3, 30),
				labelClass: "labels", // the CSS class for the label
				labelInBackground: true,
				zIndex:99999999
            });

			var infowindow = new google.maps.InfoWindow({
				content: "<b><font color='blue'>Myself</b>",
				maxWidth : 200
			});
  
			my_marker.addListener('click', function() {
				infowindow.open(g_map, my_marker);
			});	
			// Alter current location Latitude/Longitude when "My Marker" is moved 
			my_marker.addListener('dragend', function(event) {
				g_curLat = event.latLng.lat();
				g_curLng = event.latLng.lng();			
				localStorage.setItem("myLat", g_curLat);
				localStorage.setItem("myLng", g_curLng);
			});
			
			
        }
			
		function getPrinters() {
			var ref1 = firebaseDB.ref("printer_info");
			
			var cnt = 0; 		
				
			$.mobile.loading('show'); // Show loading 	
			ref1.orderByKey().limitToFirst(100).on("child_added", function(snapshot) { 		
				var pdata = snapshot.val();
				pdata.printerID = snapshot.key; // Add key value to  printer list data 
				var uid = pdata.userID ;			
				var ref2 = firebaseDB.ref("users/" + uid).once("value", function(snapshot2) {
					var udata = snapshot2.val();
					pdata.user_name = udata.user_name;
					pdata.email_address = udata.email_address;
					pdata.phone_no = udata.phone_no;
					//pdata.data("user_name" : udata.user_name);
					// Calculate printer's distance from current location
					var dist = LatLng2distance( )
			
				});
				
				g_allprinters.push(pdata);			
				cnt ++ ;
			});
			
		}

		function gotoCurrentLocation() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition( 
				function(pos) { 
					lat = pos.coords.latitude ;
					lng = pos.coords.longitude ;
					g_curLat = pos.coords.latitude; 		// set gobal lat/lng Location
					g_curLng =  pos.coords.longitude ;

					mapOptions.center = new google.maps.LatLng( pos.coords.latitude, pos.coords.longitude) ;
					g_map.panTo(mapOptions.center);			
					my_marker.setPosition(mapOptions.center);
				}, function(err) {
					alert("Location Error : " + err.message + "\nPlease make sure GPS is turned ON" );
					console.warn(`ERROR(${err.code}): ${err.message}`);
				}, {maximumAge: 500000, enableHighAccuracy:false, timeout: 30000});
			}
		}
	
		
		//function showPrinters( myLatLng, search_radius, search_type) {
		function showPrinters( search_radius, show_avail) {

			// clear all markers
			for (var i=0; i < pmarker.length ; i++) {
				if (pmarker[i]) pmarker[i].setMap(null);
			}
			//
			pmarker = [];
			pinfowindow = [];
		
			var near_dist=9999999999.9, near_lat=0, near_lng=0;	// Store the nearest Printer Position
			
			for (i=0; i < g_allprinters.length; i++) {
				var lat = g_allprinters[i].location_latitude;
				var lng = g_allprinters[i].location_longitude;
				var location = new google.maps.LatLng ( lat, lng );
				var distance = LatLng2distance(g_curLat, lat, g_curLng, lng) ;	// Calculate the distance from my marker position
				var isAvailable = g_allprinters[i].printer_status=="Available" ;

				if (search_radius == 0) search_radius = 9999999999.9 ;
				if ( (!show_avail || isAvailable) && (distance <= search_radius) ) {   // Show printer within search Range and Availability 
				
					if ( distance < near_dist) {	// Get the nearest printer position
						near_dist = distance ;
						near_lat = lat; 
						near_lng = lng;
					}
					var ico = (isAvailable)?  "img/printer-icon2.png" : "img/printer-icon_bk.png" ;
					pmarker[i] = new google.maps.Marker({
						position: location,
						map: g_map,
						icon : ico, 
						draggable : false,
						label : "" + i,
						title : g_allprinters[i].user_name,
						idx : i, 
						userID : g_allprinters[i].userID,
						printerID : g_allprinters[i].printerID,
						address : g_allprinters[i].location_address
						
					});

					var infotext = "<b>User:"+ g_allprinters[i].user_name + " (" +  g_allprinters[i].email_address + ")</b><br>" +
								"<i>Printer:" + g_allprinters[i].brand + "_" + g_allprinters[i].model + "</i><br>" +
								"Address:" + g_allprinters[i].location_address + "<br>" ;
								
					if ( g_allprinters[i].userID != g_uid2) {  // Display Chat if user not equal to current user
						infotext += "<button onclick='goChat(\"" + g_allprinters[i].userID + "\");'>Chat with user</button>";
					}						   
					
					pinfowindow[i] =  new google.maps.InfoWindow({
						content: infotext,
						maxWidth: 400
					});
			
					//pmarker[i].addListener('click', function() {
					google.maps.event.addListener(pmarker[i], "click", function(idx) {
							return function() { 
								pinfowindow[idx].open(g_map, pmarker[idx]);
								setTimeout(function() { pinfowindow[idx].close(); }, 5000); 
							}
						}(i)
					);
					
				}	// end compare range

			}	// end for

			if (pmarker.length <=0 ) {
				alert("No printer was found in this range");
			} else {
				// Move to the nearest printer
				mapOptions.center =  new google.maps.LatLng(near_lat,near_lng) ;
				g_map.panTo(mapOptions.center);	
				$.mobile.loading('hide'); // Hide loading 	
				// Store search setting into session 
				sessionStorage.setItem("showPrinter", "Y");
				sessionStorage.setItem("radius", search_radius );
				sessionStorage.setItem("show_avail", show_avail );
			}
		} // End Show Printer 
	
		/// Menu 
		$("#mnu_curlocation").on("click", function() {
			$("#map_menu").panel("close");
			gotoCurrentLocation();	
		});
		
		$("#pSearch").on("click", function() {
			var range = $("#slider-range").val();
			var type =  $("#showAll").is(":checked");
			$("#popSearchRange").popup("close");
			$("#map_menu").panel("close");
			showPrinters(range, type) ;
		}); 
		
	
	}); // end doc ready
 
 		// Do Chat 	
	function goChat( relateID) {
		window.location.href  = "chats.html?userID=" + g_uid2 + "&relateID=" + relateID;
	}
	

	