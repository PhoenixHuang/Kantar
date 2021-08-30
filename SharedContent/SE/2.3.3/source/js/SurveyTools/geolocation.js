/**
 * geolocation class
 * Inherits from SESurveyTool
 */
function geolocation(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
geolocation.prototype = Object.create(SESurveyTool.prototype);
geolocation.prototype.type = function(){
    return "geolocation";
}

geolocation.prototype.getDependencies = function(){
    
	return [
		{'type':'script', 'url' : '//maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=initialize'},
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/Geolocation/h5utils.js'},
		{'type':'stylesheet', 'url' : pageLayout.themePath + 'css/html5demos.css'}
	];	
}

geolocation.prototype.setResponses = function (){
   this.inputs.filter('textarea').val(this.latlng);
}
geolocation.prototype.build = function(){  
		var mapContainer=$("<article>");
		var p=$("<p>");
		p.text(this.getProperty("geoText"));
		var span=$("<span>");
		span.attr('id','status');
		span.text(this.getProperty("findText"));
		p.append(span);
		mapContainer.append(p);
		this.component=mapContainer;
		this.deferred.resolve();
}

 geolocation.prototype.render = function(){
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer); 
		this.showmap=this.getProperty("showMap");
		if (navigator.geolocation) {
		    var that=this;
            navigator.geolocation.getCurrentPosition(function (position) {
				var s = $('#status');
				if (s.className == 'success') {
					return;
				}
				s.text(that.getProperty("successText"));
				s.addClass('success');
				
				that.latlng='('+position.coords.latitude+', '+position.coords.longitude+')';
				if (that.showmap) {
					that.latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					var mapcanvas = $("<div></div>");
					mapcanvas.attr('id','mapcanvas');
                    mapcanvas.css({height:that.getProperty("canvasHeight")+"px",width:that.getProperty("canvasWidth")+"px"});
					$("article").append(mapcanvas);

					var myOptions = {
						zoom: 15,
						center: that.latlng,
						mapTypeControl: false,
						navigationControlOptions: {
							style: google.maps.NavigationControlStyle.SMALL
						},
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
					var marker = new google.maps.Marker({
						position: that.latlng,
						map: map,
						title: "You are here! (at least within a " + position.coords.accuracy + " meter radius)"
					});


					geocoder = new google.maps.Geocoder();
					geocoder.geocode({
						'latLng': that.latlng
					}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							//console.log(results)
							if (results[1]) {
								//formatted address
								console.log(results[0].formatted_address);
								//find country name
								for (var i = 0; i < results[0].address_components.length; i++) {
									console.log(results[0].address_components[i].types);
									for (var b = 0; b < results[0].address_components[i].types.length - 1; b++) {

										//there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate

										if (results[0].address_components[i].types[b] == "country") {
											//this is the object you are looking for
											addrs = results[0].address_components[i];
											break;
										}
									}
								}
								//country data
								//console.log("Country: "+addrs.short_name + "-->" + addrs.long_name);
							} else {
								console.log("No results found");
							}
						} else {
							console.log("Geocoder failed due to: " + status);
						}
					});
				}		   	
			}, function (error) {
				var s = $('#status');
						 
				switch(error.code) {
					case error.PERMISSION_DENIED:
							s.text(that.getProperty("errorText1"));
							break;
					case error.POSITION_UNAVAILABLE:
							s.text(that.getProperty("errorText2"));
							break;
					case error.TIMEOUT:
							s.text(that.getProperty("errorText3"));
							break;
					case error.UNKNOWN_ERROR:
							s.text(that.getProperty("errorText4"));
							break;
				}
				s.addClass('fail');
				that.latlng=s.text();
	    });
        } else {
             var s = $('#status');
			  s.text(this.getProperty("noSupportText"));
			  s.addClass('fail');
			  this.latlng=s.text();
        } 
        this.nativeContainer.hide();
		var compRTL=this.getProperty("compRTL");
		//alert(compRTL);
		if(compRTL == true){
			this.componentContainer.css( "direction", 'rtl' );
		}
}
geolocation.prototype.toolOptions = function() {
        $.extend(this.options, eval("this.options."+geolocation.prototype.type()));
		switch(pageLayout.deviceType.toUpperCase()) {
            case "LARGETABLET":
            case "MEDIUMTABLET":
            case "SMALLTABLET":
            case "SMARTPHONETOUCH":
			    if(this.orientation==0||this.orientation==180) 
                return  {
						'showMap' : true,
						'geoText' : "Finding your location:",
						'findText' : "checking...",
						'successText' : "found you!",
						'noSupportText' : "browser does not support geolocation",
						'errorText1' : "User denied the request for Geolocation.",
						'errorText2' : "Location information is unavailable.",
						'errorText3' : "The request to get user location timed out.",
						'errorText4' : "An unknown error occurred.",
						'canvasHeight' : 400,
						'canvasWidth' : 560,
						'compRTL':false						
				    }
				else
				 return {
						'showMap' : true,
						'geoText' : "Finding your location:",
						'findText' : "checking...",
						'successText' : "found you!",
						'noSupportText' : "browser does not support geolocation",
						'errorText1' : "User denied the request for Geolocation.",
						'errorText2' : "Location information is unavailable.",
						'errorText3' : "The request to get user location timed out.",
						'errorText4' : "An unknown error occurred.",
						'canvasHeight' : 400,
						'canvasWidth' : 560,
						'compRTL':false						
				    }
            case "PC":
            case "OTHERDEVICE":
            default:
                return {
						'showMap' : true,
						'geoText' : "Finding your location:",
						'findText' : "checking...",
						'successText' : "found you!",
						'noSupportText' : "browser does not support geolocation",
						'errorText1' : "User denied the request for Geolocation.",
						'errorText2' : "Location information is unavailable.",
						'errorText3' : "The request to get user location timed out.",
						'errorText4' : "An unknown error occurred.",
						'canvasHeight' : 400,
						'canvasWidth' : 560,
						'compRTL':false	 	
                }
        }
}
function initialize(){
}