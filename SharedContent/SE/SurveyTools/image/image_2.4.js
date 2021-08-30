/**
 * image class
 * Inherits from SESurveyTool
 */
function image(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
image.prototype = Object.create(SESurveyTool.prototype);
image.prototype.type = function() {
    return "image";
}
image.prototype.getDependencies = function() {
		return [{
			'type': 'script',
			'url': surveyPage.path + 'lib/KO/Image/leaflet.js'
		}, {
			'type': 'stylesheet',
			'url': pageLayout.themePath + 'css/leaflet.css'
		}];
}


image.prototype.build = function() {
	var compRTL = this.getProperty("compRTL");
	var containerwidth = this.getProperty("containerwidth");
	var height=this.getProperty("containerheight");
    if (compRTL == true) {
        var alignDiv = "";
    } else {
        var alignDiv = "center";
    }
    this.component = $("<div id='image-map' style='width: "+containerwidth+"%;  height: "+height+"px;  border: 1px solid #ccc;  margin-bottom: 10px;'></div> ");


    this.deferred.resolve();
}

image.prototype.render = function() {

    this.componentContainer = $('<div>');
    this.componentContainer.append(this.label);
    this.componentContainer.attr('id', 'qc_' + this.questionFullName); //change to be more identifable with question?
    this.componentContainer.addClass('qcContainer');
    this.componentContainer.append(this.component);
    this.nativeContainer.after(this.componentContainer);
	
    var map = L.map('image-map', {
        minZoom: this.getProperty("minzoom"),
        maxZoom: this.getProperty("maxzoom"),
        center: [0, 0],
        zoom:this.getProperty("zoom"),
        crs: L.CRS.Simple,
		zoomControl: false
    });
	map.addControl(L.control.zoom({position: this.getProperty("zoomposition")}));
	
	if(typeof surveyPlatform=="undefined"){
		var w =this.getProperty('width'),
        h =this.getProperty('height'),
        url = this.getProperty('smallimage');
	}else if(surveyPlatform=="Nfield"){
		var w = this.getProperty('width'),
        h = this.getProperty('height'),
        url = pageLayout.questions.find("img").attr("src").split("?")[0];
	}
    
    var southWest = map.unproject([0, h], map.getMaxZoom() - 1);
    var northEast = map.unproject([w, 0], map.getMaxZoom() - 1);
    var bounds = new L.LatLngBounds(southWest, northEast);
    L.imageOverlay(url, bounds).addTo(map);	
    map.setMaxBounds(bounds);	
     var that=this;
	map.on("zoomend", function (e) {  	
	if(map.getZoom()==2) 
	{	 
	 L.imageOverlay(that.getProperty('largeimage'), bounds).addTo(map);
	}
	if(map.getZoom()==1) 
	{	 
	 L.imageOverlay(url, bounds).addTo(map);
	}
	
	});
	
    this.nativeContainer.hide();
    var compRTL = this.getProperty("compRTL");
    if (compRTL == true) {
       this.componentContainer.css("direction", 'rtl');
    }
	$("#image-map").css("left",this.getProperty("containerleftposition")+"%");
	$(".leaflet-container").css("background",this.getProperty("containerbgcolor"));
	$(".leaflet-container").css("border",this.getProperty("containerbgcolor"));
	map._onResize();
	
	//Increase zoom button zise for mobiles
	switch (pageLayout.deviceType.toUpperCase()) {
        case "LARGETABLET":
        case "MEDIUMTABLET":
        case "SMALLTABLET":
        case "SMARTPHONETOUCH":
            $(".leaflet-bar a").css({"width": this.getProperty("zoombtnsize")+"px", "height": this.getProperty("zoombtnsize")+"px","line-height": this.getProperty("zoombtnsize")+"px"});				
        case "PC":
        case "OTHERDEVICE":
        default:
    }
	
	if(typeof surveyPlatform != "undefined" && surveyPlatform=="Nfield"){
			this.label.find("img").hide();
		}
		
}

						
image.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + image.prototype.type()));
    switch (pageLayout.deviceType.toUpperCase()) {
        case "LARGETABLET":
        case "MEDIUMTABLET":
        case "SMALLTABLET":
        case "SMARTPHONETOUCH":
            if (this.orientation == 0 || this.orientation == 180){
                return {
                    'minzoom': 1,
                    'maxzoom': 4,
                    'zoom': 1,
					'zoombtnsize':64,
					'containerwidth':70,
					'containerheight':300,
					'containerleftposition':0,
				    'containerbgcolor':0xffffff,
				    'containerbordercolor':0xffffff,
					'zoomposition':'topleft'
                } 
			}else{
                return {
                    'minzoom': 1,
                    'maxzoom': 4,
                    'zoom': 1,
					'zoombtnsize':64,
					'containerwidth':70,
					'containerheight':300,
					'containerleftposition':0,
				    'containerbgcolor':0xffffff,
				    'containerbordercolor':0xffffff,
					'zoomposition':'topleft'

                }
			}
				
        case "PC":
        case "OTHERDEVICE":
        default:
            return {
                'minzoom': 1,
                'maxzoom': 4,
                'zoom': 1,
				'containerwidth':50,
				'containerheight':400,
				'containerleftposition':0,
				'containerbgcolor':0xffffff,
				'containerbordercolor':0xffffff,
				'zoomposition':'topleft'

            }
    }
}