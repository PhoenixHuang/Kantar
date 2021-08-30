 /**
  * magazine class
  * Inherits from SESurveyTool
  */
 function magazine(questionContainers, json, globalOpts) {
     SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
 }
 magazine.prototype = Object.create(SESurveyTool.prototype);
 magazine.prototype.type = function() {
     return "magazine";
 }

 magazine.prototype.getDependencies = function() {
	  switch (pageLayout.deviceType.toUpperCase()) {
         case "LARGETABLET":
         case "MEDIUMTABLET":
         case "SMALLTABLET":
         case "SMARTPHONETOUCH":
			var skinPath = pageLayout.themePath + 'css/Magazine/default-skin/default-skin-large.css';
			break;
         case "PC":
         case "OTHERDEVICE":
         default:
			var skinPath = pageLayout.themePath + 'css/Magazine/default-skin/default-skin.css';
     }
		
		return [{
			 'type': 'stylesheet', 'url': pageLayout.themePath + 'css/Magazine/css/photoswipe.css'
		 }, {
			 'type': 'stylesheet', 'url':skinPath
		 }, {
			 'type': 'script',
			 'url': pageLayout.sharedContent + 'LAF/Lib/Magazine/js/photoswipe.js'
		 }, {
			 'type': 'script',
			 'url': pageLayout.sharedContent + 'LAF/Lib/Magazine/js/photoswipe-ui-default.js'
		 }, {
			'type': 'script',
			'url': surveyPage.path + 'lib/KO/Magazine/1.0/lib/datacapture.js'
		 }];
	
 }

 magazine.prototype.setResponses = function() {
     var viewed = this.photoSwipeTool.getViewed();
     var zoomed = this.photoSwipeTool.getZoomed();

     this.clearInputs();
	 for (i = 0; i < viewed.length; i++) {
         
         var inputs = this.subquestions[i].inputs;
         var multi = inputs.filter('input[type=checkbox]');
		 var viewedID=$(multi[0]).attr("id");
		 var notViewedID=$(multi[multi.length-1]).attr("id");
		 if(viewed[i] == 1){
			$("#"+viewedID).prop('checked', true);
		 }else{
			 $("#"+notViewedID).prop('checked', true);
		 }

     }
 }
 magazine.prototype.build = function() {
     this.component = $('<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true" id="pswpid"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button id="nextButton" title="'+this.getProperty("nextButtonLabel")+'">'+this.getProperty("nextButtonLabel")+'</button><button class="pswp__button pswp__button--share" title="Share"></button><button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button><button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div> <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center" style="text-align: center;"></div></div></div> </div></div>');
     this.deferred.resolve();
	 
 }
 magazine.prototype.render = function() {
     this.componentContainer = $('<div>');
     this.componentContainer.append(this.label);
     this.componentContainer.attr('id', 'qc_' + this.questionFullName); //change to be more identifable with question?
     this.componentContainer.addClass('qcContainer');
     this.componentContainer.append(this.component);
     $("form").after(this.componentContainer);
	 $("#nextButton").on('click touchstart',function(){pageLayout.next.click()});
	 $("#nextButton").css({"float":"right","margin-top": "9px",  "background-color":"#000","color":"#fff","border":"0px"});

     props = {
         "percentpagesubmit": this.getProperty("percentpagesubmit"),
         "closeenabletime": this.getProperty("closeenabletime"),
         "closesubmittime": this.getProperty("closesubmittime"),
         "comprtl": this.getProperty("comprtl"),
         "index": this.getProperty("index"),
         "imageheight": this.getProperty("imageheight"),
         "imagewidth": this.getProperty("imagewidth"),
		 "imagetitle": this.getProperty("imagetitle"),
         "loop": this.getProperty("loop"),
         "closeonscroll": this.getProperty("closeonscroll"),
         "closeonverticaldrag": this.getProperty("closeonverticaldrag"),
         "closebutton": this.getProperty("closebutton"),
         "caption": this.getProperty("caption"),
         "fullscreen": this.getProperty("fullscreen"),
         "zoom": this.getProperty("zoom"),
         "counter": this.getProperty("counter"),
         "arrow": this.getProperty("arrow"),
         "preloader": this.getProperty("preloader"),
         "showhideopacity": this.getProperty("showhideopacity"),
         "showanimationduration": this.getProperty("showanimationduration"),
         "hideanimationduration": this.getProperty("hideanimationduration"),
         "bgopacity": this.getProperty("bgopacity"),
         "spacing": this.getProperty("spacing"),
         "allowpantonext": this.getProperty("allowpantonext"),
         "maxspreadzoom": this.getProperty("maxspreadzoom"),
         "pinchtoclose": this.getProperty("pinchtoclose"),
         "mouseused": this.getProperty("mouseused"),
         "esckey": this.getProperty("esckey"),
         "arrowkeys": this.getProperty("arrowkeys"),
         "closeElClasses": this.getProperty("closeElClasses"),
         "errormsg": this.getProperty("errormsg"),
         "focus": this.getProperty("focus"),
         "modal": this.getProperty("modal"),
         "barssize": this.getProperty("barssize"),
         "taptoclose": this.getProperty("taptoclose"),
         "taptotogglecontrols": this.getProperty("taptotogglecontrols"),
         "clicktoclosenonzoomable": this.getProperty("clicktoclosenonzoomable"),
		 "nextButtonLabel":this.getProperty("nextButtonLabel")
     }

     this.buildArraysFromGrid();
     this.photoSwipeTool = new PhotoSwipeTool();
     this.photoSwipeTool.init(props, this.subquestions);

     this.nativeContainer.hide();

 }
 magazine.prototype.toolOptions = function() {
     $.extend(this.options, eval("this.options." + magazine.prototype.type()));
     switch (pageLayout.deviceType.toUpperCase()) {
         case "LARGETABLET":
         case "MEDIUMTABLET":
         case "SMALLTABLET":
         case "SMARTPHONETOUCH":
             return {
                 'percentpagesubmit': 'null',
                 'closeenabletime': 'null',
                 'closesubmittime': 'null',
                 'imagewidth': 768,
                 'imageheight': 1024,
				 'imagetitle':'Image Title',
                 'index': 0, //index of the image to be started
                 //'comprtl': true,
                 'loop': false, // This will be able to swipe from last to first image
                 'closeonscroll': false, //Close gallery on page scroll. Option works just for devices without hardware touch support.
                 'closeonverticaldrag': false, // Close gallery when dragging vertically and when image is not zoomed. Always false when mouse is used.
                 'history': false, // If set to false disables history module (back button to close gallery, unique URL for each slide). You can also just exclude history.js module from your build.
                 'closebutton': true,
                 'caption': true,
                 'fullscreen': true,
                 'zoom': true,
                 'counter': true,
                 'arrow': true,
                 'preloader': true, // Lazy loading of nearby slides based on direction of movemen
                 'showhideopacity': false, //If set to false: background opacity and image scale will be animated (image opacity is always 1). If set to true: root PhotoSwipe element opacity and image scale will be animated.
                 'showanimationduration': 333, //Initial zoom-in transition duration in milliseconds. Set to 0 to disable
                 'hideanimationduration': 333, // The same as the previous option, just for closing (zoom-out) transition
                 'bgopacity': 1, //Background opacity. Should be a number from 0 to 1, e.g. 0.7
                 'spacing': 0.12, // Spacing ratio between slides. For example, 0.12 will render as a 12% of sliding viewport width
                 'allowpantonext': true, //Allow swipe navigation to next/prev item when current item is zoomed. Option is always false on devices that don't have hardware touch support
                 'maxspreadzoom': 2, //Maximum zoom level when performing spread (zoom) gesture. 2 means that image can be zoomed 2x from original size
                 'pinchtoclose': false, //Pinch to close gallery gesture. The gallery’s background will gradually fade out as the user zooms out
                 'mouseused': false, // Option allows you to predefine if mouse was used or not. Some PhotoSwipe feature depend on it, for example default UI left/right arrows will be displayed only after mouse is used. If set to false, PhotoSwipe will start detecting when mouse is used by itself, mouseUsed event triggers when mouse is found.
                 'esckey': false, //esc keyboard key to close PhotoSwipe. Option can be changed dynamically 
                 'arrowkeys': false, //Keyboard left or right arrow key navigation. Option can be changed dynamically (yourPhotoSwipeInstance.options.arrowKeys = false;)
                 'closeElClasses': [],
                 'errormsg': "The image could not be loaded.", // Error message when image was not loaded. %url% will be replaced by URL of image.
                 'focus': true, //Will set focus on PhotoSwipe element after it's open.
                 'modal': true, // Controls whether PhotoSwipe should expand to take up the entire viewport. If false, the PhotoSwipe element will take the size of the positioned parent of the template. 
                 'barssize': 44, // Top and Bottom bars height
                 'taptoclose': false, // Tap on sliding area should close gallery
                 'taptotogglecontrols': true, // Tap should toggle visibility of controls
                 'clicktoclosenonzoomable': true, // Mouse click on image should close the gallery, only when image is smaller than size of the viewport
				 'nextButtonLabel':"Continue"
             }
         case "PC":
         case "OTHERDEVICE":
         default:
             return {
                 'percentpagesubmit': 'null',
                 'closeenabletime': 'null',
                 'closesubmittime': 'null',
                 'imagewidth': 768,
                 'imageheight': 1024,
				 'imagetitle':'Image Title',
                 'index': 0, //index of the image to be started
                 //'comprtl': true,
                 'loop': false, // This will be able to swipe from last to first image
                 'closeonscroll': false, //Close gallery on page scroll. Option works just for devices without hardware touch support.
                 'closeonverticaldrag': false, // Close gallery when dragging vertically and when image is not zoomed. Always false when mouse is used.
                 'history': false, // If set to false disables history module (back button to close gallery, unique URL for each slide). You can also just exclude history.js module from your build.
                 'closebutton': true,
                 'caption': true,
                 'fullscreen': true,
                 'zoom': true,
                 'counter': true,
                 'arrow': true,
                 'preloader': true, // Lazy loading of nearby slides based on direction of movemen
                 'showhideopacity': false, //If set to false: background opacity and image scale will be animated (image opacity is always 1). If set to true: root PhotoSwipe element opacity and image scale will be animated.
                 'showanimationduration': 333, //Initial zoom-in transition duration in milliseconds. Set to 0 to disable
                 'hideanimationduration': 333, // The same as the previous option, just for closing (zoom-out) transition
                 'bgopacity': 1, //Background opacity. Should be a number from 0 to 1, e.g. 0.7
                 'spacing': 0.12, // Spacing ratio between slides. For example, 0.12 will render as a 12% of sliding viewport width
                 'allowpantonext': true, //Allow swipe navigation to next/prev item when current item is zoomed. Option is always false on devices that don't have hardware touch support
                 'maxspreadzoom': 2, //Maximum zoom level when performing spread (zoom) gesture. 2 means that image can be zoomed 2x from original size
                 'pinchtoclose': false, //Pinch to close gallery gesture. The gallery’s background will gradually fade out as the user zooms out
                 'mouseused': false, // Option allows you to predefine if mouse was used or not. Some PhotoSwipe feature depend on it, for example default UI left/right arrows will be displayed only after mouse is used. If set to false, PhotoSwipe will start detecting when mouse is used by itself, mouseUsed event triggers when mouse is found.
                 'esckey': false, //esc keyboard key to close PhotoSwipe. Option can be changed dynamically 
                 'arrowkeys': false, //Keyboard left or right arrow key navigation. Option can be changed dynamically (yourPhotoSwipeInstance.options.arrowKeys = false;)
                 'closeElClasses': [],
                 'errormsg': "The image could not be loaded.", // Error message when image was not loaded. %url% will be replaced by URL of image.
                 'focus': true, //Will set focus on PhotoSwipe element after it's open.
                 'modal': true, // Controls whether PhotoSwipe should expand to take up the entire viewport. If false, the PhotoSwipe element will take the size of the positioned parent of the template. 
                 'barssize': 88, // Top and Bottom bars height
                 'taptoclose': false, // Tap on sliding area should close gallery
                 'taptotogglecontrols': true, // Tap should toggle visibility of controls
                 'clicktoclosenonzoomable': true, // Mouse click on image should close the gallery, only when image is smaller than size of the viewport
                 'nextButtonLabel':"Continue"
             }
     }
 }