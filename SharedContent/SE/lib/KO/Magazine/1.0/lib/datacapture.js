function PhotoSwipeTool() {

    var properties;
    var pswp;
    var vudata = new Array();
    var zomdata = new Array();
	var noofimages;

    function init(props, subquestions) {
        intialize();
        properties = props;

        createPhotoSwipe(subquestions);
    }



    function intialize() {

    }


    function createPhotoSwipe(subquestions) {

        var pswpElement = document.querySelectorAll('.pswp')[0];
        var items = [];

        $.each(subquestions, function(i, e) {
            var label = e.label;
            label.find('span').removeClass('mrQuestionText');
			
			if (typeof label.find('img').attr("title") == 'undefined')
                ImgCaption = properties.imagetitle
            else
                ImgCaption = label.find('img').attr("title")
			
            if (typeof label.find('img').attr("width") == 'undefined')
                imgWidth = properties.imagewidth
            else
                imgWidth = label.find('img').attr("width")

            if (typeof label.find('img').attr("height") == 'undefined')
                imgHeight = properties.imageheight
            else
                imgHeight = label.find('img').attr("height")


            ImgURL = e.image
            ImgURL = ImgURL.replace(/\\/g, '/');

            items.push({
                src: ImgURL,
                w: imgWidth,
                h: imgHeight,
                title: $.trim(ImgCaption)
            });
        });

        // define options (if needed)
        var options = {
            index: properties.index, // start at first slide
            closeOnScroll: properties.closeonscroll,
            closeOnVerticalDrag: properties.closeonverticaldrag,
            loop: properties.loop,
            history: properties.history,
            closeEl: properties.closebutton,
            captionEl: properties.caption,
            fullscreenEl: properties.fullscreen,
            zoomEl: properties.zoom,
            counterEl: true,
            arrowEl: properties.arrow,
            preloaderEl: properties.preloader,
            showHideOpacity: properties.showhideopacity,
            showAnimationDuration: properties.showanimationduration,
            hideAnimationDuration: properties.hideanimationduration,
            bgOpacity: properties.bgopacity,
            spacing: properties.spacing,
            allowPanToNext: properties.allowpantonext,
            maxSpreadZoom: properties.maxspreadzoom,
            pinchToClose: properties.pinchtoclose,
            mouseUsed: properties.mouseused,
            escKey: properties.esckey,
            arrowKeys: properties.arrowkeys,
            closeElClasses: properties.closeElClasses,
            errormsg: properties.errormsg,
            focus: properties.focus,
            modal: properties.modal,
            barsSize: {
                top: properties.barssize,
                bottom: 'auto'
            },
            tapToClose: properties.taptoclose,
            tapToToggleControls: properties.taptotogglecontrols,
            clickToCloseNonZoomable: properties.clicktoclosenonzoomable,
            shareEl: false
        };

        // Initializes and opens PhotoSwipe
        pswp = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        pswp.init();

		initialToolSetup();
		
        pswp.listen('close', function() {
            clearInterval(window.photoswipeSlideshow);
            jQuery('button.pswp__button--slideshow').off('click');

            pageLayout.next.click();
        });

		pswp.listen('beforeChange', function() {
			var imageList = $('.pswp__counter').html();
            var imageListArray = imageList.split("/");
            var currentImg = imageListArray[0].replace(" ", "");
            var totalImg = imageListArray[1].replace(" ", "");
			
			//Caliculating percent of pages
			if (properties.percentpagesubmit != "null") {
				if(noofimages+1 == currentImg){
					pageLayout.next.click();
				}
			}
		});

        pswp.listen('afterChange', function() {

            var imageList = $('.pswp__counter').html();
            var imageListArray = imageList.split("/");
            var currentImg = imageListArray[0].replace(" ", "");
            var totalImg = imageListArray[1].replace(" ", "");

            if (properties.loop == false) {
                loopControls(currentImg, totalImg)
            }
            vudata[currentImg - 1] = 1;
			
        });
		
		$( ".pswp__button--fs" ).click(function() {
		 // alert('fill')
		});
		
		if(properties.fullscreen == true){
			 $('.pswp__button--fs').attr('style', 'display: block !important');
			 options.fullscreenEl = true;
			 pswp.options.fullscreenEl = true;
		 }
		
    }

		
	function initialToolSetup(){
		
		if(properties.counter == false){
			$('.pswp__counter').css('display','none');
		}
		var imageCounter = $('.pswp__counter').html();
        var imageCounterArray = imageCounter.split("/");
        var currentImage = imageCounterArray[0].replace(" ", "");
        var totalImages = imageCounterArray[1].replace(" ", "");
        vudata.length = totalImages;
        zomdata.length = totalImages;

        for(var i=0; i<vudata.length; i++){
			vudata[i] = 0; 
		}
		for(var i=0; i<zomdata.length; i++){
			zomdata[i] = 0; 
		}

        if (properties.loop == false) {
            loopControls(currentImage, totalImages)
        }
		
		//Calculating percent of pages to sumit
		if (properties.percentpagesubmit != "null") {
			noofimages = Math.round((totalImages * properties.percentpagesubmit) / 100);
		}
		
		//Set close button enable time
		if(properties.closeenabletime != "null"){
			$('.pswp__button--close').hide();
			setTimeout(function(){ $('.pswp__button--close').show(); }, properties.closeenabletime);
		}
		
		//Set close button Submit time
		if(properties.closesubmittime != "null"){
			setTimeout(function(){ pageLayout.next.click(); }, properties.closesubmittime);
		}
		
		vudata[currentImage - 1] = 1;		
	}
    function loopControls(currentImg, totalImg) {

        if (currentImg == 1)
            $(".pswp__button--arrow--left").hide();
        else
            $(".pswp__button--arrow--left").show();

        if (currentImg == totalImg)
            $(".pswp__button--arrow--right").hide();
        else
            $(".pswp__button--arrow--right").show();
    }

    function getViewed() {
        return vudata;
    }

    function getZoomed() {
        return zomdata;
    }
    return {

        init: init,
        getViewed: getViewed,
        getZoomed: getZoomed,
    }

}