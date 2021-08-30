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
        'url': surveyPage.path + 'lib/KO/Image/1.0/leaflet.js'
    }, {
        'type': 'stylesheet',
        'url': pageLayout.themePath + 'css/leaflet.css'
    }];
}


image.prototype.build = function() {
    var compRTL = this.getProperty("compRTL");
    var containerwidth = this.getProperty("containerwidth");
    var height = this.getProperty("containerheight");
    if (compRTL == true) {
        var alignDiv = "";
    } else {
        var alignDiv = "center";
    }
    if (pageLayout.deviceType.toUpperCase() == 'PC' || pageLayout.deviceType.toUpperCase() == 'OTHERDEVICE') {
        this.component = $("<div id='image-map' style='width: " + containerwidth + "%;  height: " + height + "px;  border: 1px solid #ccc;  margin-bottom: 10px;'></div> ");
    } else {
        this.component = $('<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button><button class="pswp__button pswp__button--share" title="Share"></button><button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button><button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div><div style="width: 100%;  height:100%;  margin-bottom: 10px;"><img src="' + this.getProperty("largeimage") + '" class="imageZoom img-fluid" /></div>');
    }


    this.deferred.resolve();
}

image.prototype.render = function() {

    this.componentContainer = $('<div>');
    this.componentdiv = $("<div class='col-sm-12 question-component'>");
    this.componentContainer.append(this.nativeContainer.find(".question-text").clone());
    this.componentContainer.attr('id', 'qc_' + this.questionFullName); //change to be more identifable with question?
    this.componentContainer.addClass('qcContainer');
    this.componentdiv.append(this.component);
    this.componentContainer.append(this.componentdiv);
    this.nativeContainer.after(this.componentContainer);
    this.nativeContainer.hide();
    if (pageLayout.deviceType.toUpperCase() == 'PC' || pageLayout.deviceType.toUpperCase() == 'OTHERDEVICE') {
        var map = L.map('image-map', {
            minZoom: this.getProperty("minzoom"),
            maxZoom: this.getProperty("maxzoom"),
            center: [0, 0],
            zoom: this.getProperty("zoom"),
            crs: L.CRS.Simple,
            zoomControl: false
        });
        map.addControl(L.control.zoom({
            position: this.getProperty("zoomposition")
        }));
        if (typeof surveyPlatform == "undefined") {
            var w = this.getProperty('width'),
                h = this.getProperty('height'),
                url = this.getProperty('smallimage');
        } else if (surveyPlatform == "Nfield") {
            var w = this.getProperty('width'),
                h = this.getProperty('height'),
                url = pageLayout.questions.find("img").attr("src").split("?")[0];
        }

        var southWest = map.unproject([0, h], map.getMaxZoom() - 1);
        var northEast = map.unproject([w, 0], map.getMaxZoom() - 1);
        var bounds = new L.LatLngBounds(southWest, northEast);
        L.imageOverlay(url, bounds).addTo(map);
        map.setMaxBounds(bounds);
        var that = this;
        map.on("zoomend", function(e) {
            if (map.getZoom() == 2) {
                L.imageOverlay(that.getProperty('largeimage'), bounds).addTo(map);
            }
            if (map.getZoom() == 1) {
                L.imageOverlay(url, bounds).addTo(map);
            }

        });

        var compRTL = this.getProperty("compRTL");
        if (compRTL == true) {
            this.componentContainer.css("direction", 'rtl');
        }
        $("#image-map").css("left", this.getProperty("containerleftposition") + "%");
        $(".leaflet-container").css("background", this.getProperty("containerbgcolor"));
        $(".leaflet-container").css("border", this.getProperty("containerbgcolor"));
        map._onResize();

        //Increase zoom button zise for mobiles
        switch (pageLayout.deviceType.toUpperCase()) {
            case "LARGETABLET":
            case "MEDIUMTABLET":
            case "SMALLTABLET":
            case "SMARTPHONETOUCH":
                $(".leaflet-bar a").css({
                    "width": this.getProperty("zoombtnsize") + "px",
                    "height": this.getProperty("zoombtnsize") + "px",
                    "line-height": this.getProperty("zoombtnsize") + "px"
                });
            case "PC":
            case "OTHERDEVICE":
            default:
        }

        if (typeof surveyPlatform != "undefined" && surveyPlatform == "Nfield") {
            this.label.find("img").hide();
        }
    }else{
		
		
            // build items array
            var items = [];
            var that = this;

            $("body").on("click", ".imageZoom", function(e) {
                e.stopPropagation();
				e.preventDefault();
                items = [];
                items.length = 0;
                var img = new Image();
				
                img.src = $(this).attr('src');
                items.push({
                    src: $(this).attr('src'),
                    w: img.width,
                    h: img.height
                });
                var pswpElement = document.querySelectorAll('.pswp')[0];
                var options = {
                    history: false,
                    focus: false,
                    shareEl: false,
                    showAnimationDuration: 0,
                    hideAnimationDuration: 0
                };
                var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
                gallery.init();
            });
	}	

}


image.prototype.toolOptions = function() {
    $.extend(this.options, this.options.image);
    
            return {
                'minzoom': 1,
                'maxzoom': 4,
                'zoom': 1,
                'containerwidth': 100,
                'containerheight': 400,
                'containerleftposition': 0,
                'containerbgcolor': 0xffffff,
                'containerbordercolor': 0xffffff,
                'zoomposition': 'topleft'

            }
}