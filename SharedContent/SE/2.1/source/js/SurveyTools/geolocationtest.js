/**
 * geolocationtest class
 * Inherits from SESurveyTool
 */
function geolocationtest(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
geolocationtest.prototype = Object.create(SESurveyTool.prototype);
geolocationtest.prototype.type = function(){
    return "geolocationtest";
}

geolocationtest.prototype.getDependencies = function(){
    
	return [
		{'type':'script', 'url' : 'http://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=initialize'},
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/Geolocation/h5utils.js'},
		{'type':'stylesheet', 'url' : surveyPage.path + 'lib/KO/Geolocation/html5demos.css'}
	];	
}

geolocationtest.prototype.build = function(){
		//this.component = $("<article><p>Finding your location: <span id='status'>checking...</span></p> </article>");	  
		var mapContainer=document.createElement("article");
		var p=document.createElement("p");
		$(p).text("Finding your location:")
		var span=document.createElement("span");
		$(span).attr('id','status');
		$(span).text("checking...");
		$(p).append(span);
		$(mapContainer).append(p);
		this.component=$(mapContainer);
		this.deferred.resolve();
}

geolocationtest.prototype.success=function (position) {
			  var s = document.querySelector('#status');
			  if (s.className == 'success') {  
				return;
			  }
			  s.innerHTML = "found you!";
			  s.className = 'success';
			  var mapcanvas = document.createElement('div');
			  mapcanvas.id = 'mapcanvas';
			  mapcanvas.style.height = '400px';
			  mapcanvas.style.width = '560px';
			  document.querySelector('article').appendChild(mapcanvas);
			  latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			  var myOptions = {
				zoom: 15,
				center: latlng,
				mapTypeControl: false,
				navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
				mapTypeId: google.maps.MapTypeId.ROADMAP
			  };
			  var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
			  var marker = new google.maps.Marker({
				  position: latlng, 
				  map: map, 
				  title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
			  });
			  
			  
				geocoder = new google.maps.Geocoder();
				geocoder.geocode({'latLng': latlng}, function(results, status) {
                 if (status == google.maps.GeocoderStatus.OK) {
				  //console.log(results)
					if (results[1]) {
					 //formatted address
					 console.log(results[0].formatted_address);
					//find country name
						 for (var i=0; i<results[0].address_components.length; i++) {
						 console.log(results[0].address_components[i].types);
						for (var b=0;b<results[0].address_components[i].types.length-1;b++) {

						//there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
						
							if (results[0].address_components[i].types[b] == "country") {
								//this is the object you are looking for
								addrs= results[0].address_components[i];
								break;
							}
						}
					}
					//country data
					//alert("Country: "+addrs.short_name + "-->" + addrs.long_name);
					} else {
					  alert("No results found");
					}
				  } else {
					alert("Geocoder failed due to: " + status);
				  }
				});
        }
		

geolocationtest.prototype.showError=function (error) {
			  var s = document.querySelector('#status');
			 
			  switch(error.code) {
				case error.PERMISSION_DENIED:
					s.innerHTML = "User denied the request for Geolocation."
					break;
				case error.POSITION_UNAVAILABLE:
					s.innerHTML = "Location information is unavailable."
					break;
				case error.TIMEOUT:
					s.innerHTML = "The request to get user location timed out."
					break;
				case error.UNKNOWN_ERROR:
					s.innerHTML = "An unknown error occurred."
					break;
              }
			  s.className = 'fail';
			  latlng=s.innerHTML;
	    }

geolocationtest.prototype.render = function(){
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer); 
			  
		if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.success, this.showError);
        } else {
             var s = document.querySelector('#status');
			  s.innerHTML = 'browser do not support geolocation';
			  s.className = 'fail';
			  latlng=s.innerHTML;
        }

        this.nativeContainer.hide();
    }
geolocationtest.prototype.toolOptions = function() {
        switch(pageLayout.deviceType.toUpperCase()) {
            case "LARGETABLET":
            case "MEDIUMTABLET":
            case "SMALLTABLET":
            case "SMARTPHONETOUCH":
                return  {
                        					
				    }
            case "PC":
            case "OTHERDEVICE":
            default:
                return {
                        	
                }
        }
}

  function initialize() {}
  
