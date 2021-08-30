/* Brad Brown - Affectiva Integration
http://labs.qa.affectiva.com/facerecorder_qa/doc_v2.html
*/
if (typeof affSettings == "undefined"){
	affSettings = {};
}

var affectiva = {
	version: "5.0",
	debugMode: true,
	timestamps: null,
	session: null,
	hasCamera: true,
	hasStream: null,
	ranFirstFrame: false,
	container: null,
	vic: null,
	vicMode: (typeof(VICMode) != "undefined" ? VICMode.toLowerCase() : "web"),
	polling: null,
	framepoll: null,
	quality: null,
	qualityCount: 0,
	playCount: (typeof(playcounter) != "undefined" ? playcounter : 99),
	viewSequenceCount: (typeof (affSettings.viewsequence) != "undefined" ? parseInt(affSettings.viewsequence,10) : 1),
	numStreams: 0,
	testads: (typeof(affSettings.videos) != "undefined" ? affSettings.videos.split(",") : []),
	allAds: (typeof movieFileName != "undefined" ? movieFileName.split(',') : []),
	numAds: (function() {
		if (typeof(affSettings.videos) != "undefined"){
			return affSettings.videos.length;
		}
	})(),
	doSubmit: false,
	holdSubmit: true,
	didPlay: false,
	originalMovieFileName: (typeof(movieFileName) != "undefined" ? movieFileName : "none"),
	faceRecorder: null,
	server: (typeof(affSettings.server) != "undefined" ? affSettings.server : "https://labs-portal.affectiva.com"),
	swfVersion: "10.1.0",
	xiSwfUrl: "playerProductInstall",
	params: {
		quality: "high",
		bgcolor: "#ffffff",
		allowscriptaccess: "always",
		allowfullscreen: "true"
	},
	attributes: {
		id: "Facerecorder",
		name: "Facerecorder",
		align: "middle"
	},
	flashvars: (function(){
			var movID = "movieID", iArray = null;
			if (typeof(affSettings.videos) != "undefined"){
				iArray = affSettings.videos.split(",");
				if (iArray.length > 0){
					movID = iArray[0];
				}
			}

			var flashvars = {
				movieId: movID,
				participantId: (typeof(affSettings.id) != "undefined" ? affSettings.id : "NoIdProvided"),
				sessionTokenCallback: "affectiva.eventSessionToken",
				sessionClosedCallback: "affectiva.eventSessionClosed",
				sessionAlreadyStartedCallback: "affectiva.eventSessionExists",
				streamingStartedCallback: "affectiva.eventStreamStarted",
				streamingAlreadyStartedCallback: "affectiva.eventStreamExists",
				cameraDeniedCallback: "affectiva.eventCameraDenied",
				noWebCamCallback: "affectiva.eventNoCamera",
				frameQualityReportSuccessCallback: "affectiva.eventFrameQualitySuccess",
				frameQualityReportFailureCallback: "affectiva.eventframeQualityFailure",
				projectCode: (typeof (affSettings.projectCode) != "undefined" ? affSettings.projectCode : "sas_code"),
				key: (typeof (affSettings.key) != "undefined" ? affSettings.key : "key"),
				viewSequence: (typeof (affSettings.viewsequence) != "undefined" ? parseInt(affSettings.viewsequence,10) : 1)
			};
			return flashvars;
	})(),
	embed: function(){
		if (typeof(swfobject) != "undefined"){
			swfobject.embedSWF(affectiva.server + "/portal/swf/Facerecorder.swf" + affSettings.frameQuality, "affEmbed", "320", "241", affectiva.swfVersion, affectiva.xiSwfUrl, affectiva.flashvars, affectiva.params, affectiva.attributes);
			affectiva.faceRecorder = swfobject.getObjectById("Facerecorder");
		}
	},
	initialize: function(){
		affectiva.log('initializing...');
		if(!affectiva.container)
			affectiva.container = $('#affContainer');

		if(!affectiva.timestamps){
			affectiva.timestamps = $('#_Q1');
			affectiva.timestamps.val('');
		}

		if(!affectiva.quality){
			affectiva.quality = $('#_Q2');
			affectiva.quality.val('');
		}

		if(swfobject == 'undefined'){
			setTimeout(function(){
				affectiva.initialize();
			},500);
			return false;
		}

		affectiva.faceRecorder = swfobject.getObjectById("Facerecorder");
		if( (!affectiva.faceRecorder) ){
			affectiva.embed();
			setTimeout(function(){
				affectiva.initialize();
			},500);
		}else{
			affectiva.vic = $('#viccontainer');
			affectiva.hideContainer(affectiva.vic);

			//fix mymovie object causing non loading images
			$('#affContainer img').each(function(){
				var image = $(this);
				image.attr('src',image.attr('src'));
			});

			var $wait = $("#affWait"),
				imgSrc = $wait.find("img").attr("src");

			$wait.empty().css("background-image","url('" + imgSrc + "')");

			$('#affContinue').on('click.play', affectiva.runFrameQuality);
			$("input.fakeContinue").on("click.play", affectiva.runFrameQuality);
		}
	},
	runFrameQuality: function(){
		if (typeof affectiva.faceRecorder.frameQualityReport == "function"){
			$('#affContinue').attr('disabled',true).off("click.play");
			$("#errPosLight,#errPosition,#errLight").addClass("errHidden");
			if (affectiva.qualityCount >= 2){
				affectiva.eventFrameQualitySuccess({
					faceNotDetected: false,
					faceTooSmall: false,
					faceTooBlurred: false,
					faceTooDark: false,
					faceTooBright: false,
					maxAttempts: true
				});
			}else{
				$("#affWait").css("left", ($(document).width() - 128) / 2).removeClass("errHidden");
				setTimeout(function(){
					affectiva.faceRecorder.frameQualityReport();
				}, 500);

				affectiva.framepoll = setTimeout(function(){
					affectiva.eventFrameQualitySuccess({
						faceNotDetected: false,
						faceTooSmall: false,
						faceTooBlurred: false,
						faceTooDark: false,
						faceTooBright: false,
						timeout: true
					});
				},10000);
			}
			affectiva.qualityCount++;
		}else{
			affectiva.log('frameQualityReportSuccessCallback function not found.');
			affectiva.quality.val("frameQualityReportSuccessCallback function not found.");
			affectiva.showContainer(affectiva.vic);
			affectiva.hideContainer(affectiva.container);
			if (affectiva.vicMode === "venue"){
				affectiva.container.css("display","none");
			}
		}
	},
	setFocus: function(){
		if(affectiva.vic && affectiva.hasStream){
			if(!affectiva.vic.hasClass('hideContainer')){
				affectiva.vic.attr('tabindex',-1).focus();
			}
		}
	},
	showContainer: function(object){
		if($.browser.safari){
			if(navigator.userAgent.toLowerCase().indexOf('chrome/') == -1 )
				$(object).css('position','static');
		}
		$(object).removeClass('hideContainer');
	},
	hideContainer: function(object){
		if($.browser.safari){
			if(navigator.userAgent.toLowerCase().indexOf('chrome/') == -1 )
				$(object).css('position','absolute');
		}
		$(object).addClass('hideContainer');
	},
	log: function(message){
		if (affectiva.debugMode){
			if( (typeof console != 'undefined') && (typeof console.log != 'undefined') ){
				console.log(message);
			}
		}
	},
	originalInit: (typeof(addVIC) == "function" ? addVIC : function(){alert('Error Hooking Function: addVIC');}),
	originalStop: (typeof(lastFrameEvent) == "function" ? lastFrameEvent : function(){alert('Error Hooking Function: lastFrameEvent');}),
	originalStart: (typeof(firstFrameEvent) == "function" ? firstFrameEvent : function(){alert('Error Hooking Function: firstFrameEvent');}),
	originalSubmit: (typeof(submitPageVIC) == "function" ? submitPageVIC : function(){alert('Error Hooking Function: submitPageVIC');}),
	createNewVIC: function(){
		affectiva.log("Creating New VIC");
		playcounter = 1;
		movieFileName = affectiva.allAds[0];
		if (affectiva.didPlay == true) autoplay = 1;
		affectiva.originalInit();
		if (affectiva.didPlay == false) affectiva.didPlay = true;
	},
	destroyVIC: function(){
		affectiva.log("Destroying VIC");
		swfobject.removeSWF("VICObj");
		$('#viccontainer').append("<div id='vicvideo'></div>");
	},
	firstFrame: function(currentTime){
		affectiva.log('FirstFrame: ' + currentTime);
		affectiva.faceRecorder.affFirstFrame(currentTime);
	},
	lastFrame: function(currentTime){
		affectiva.hideContainer(affectiva.vic);
		affectiva.log('LastFrame: ' + currentTime);
		affectiva.faceRecorder.affLastFrame(currentTime);
	},
	status: function(){ return affectiva.faceRecorder.affStatus(); },
	startNewSession: function(movieID){
		if (typeof affectiva.faceRecorder.affStartNewSessionWithVS == "function"){
			affectiva.faceRecorder.affStartNewSessionWithVS(movieID,affectiva.viewSequenceCount);
		}else{
			affectiva.faceRecorder.affStartNewSession(movieID);
		}
		affectiva.polling = setTimeout(function(){
			if(!affectiva.session){
				affectiva.startNewSession(movieID);
			}
		},2500);
	},
	detachCamera: function(){ affectiva.faceRecorder.affDetachCamera(); },
	eventframeQualityFailure: function(obj){
		clearTimeout(affectiva.framepoll);
		affectiva.log('Fired Event: eventframeQualityFailure');
		affectiva.hasCamera = false;
		affectiva.hideContainer(affectiva.container);
		affectiva.showContainer(affectiva.vic);
		affectiva.timestamps.val('cameraDenied');
		affectiva.quality.val("cameraDenied");
		affectiva.originalInit();
		affectiva.holdSubmit = false;
		affectiva.doSubmit = true;
		affectiva.testads = [];
		$("#affWait").addClass("errHidden");
	},
	eventFrameQualitySuccess: function(obj){
		clearTimeout(affectiva.framepoll);
		affectiva.log('Fired Event: eventFrameQualitySuccess');
		affectiva.log(obj);
		affectiva.framepoll = null;
		$("#affWait").addClass("errHidden");
		if (obj.faceNotDetected === true || obj.faceTooBlurred === true){
			$("#errPosLight").css("left", ($(document).width() - 450) / 2);
			$("#errPosLight").toggleClass("errHidden");
			affectiva.quality.val(affectiva.quality.val() + affectiva.qualityCount.toString() + ":false;");
			$('#affContinue').removeAttr('disabled').on("click.play", affectiva.runFrameQuality);
		}else if(obj.faceTooSmall === true){
			$("#errPosition").css("left", ($(document).width() - 450) / 2);
			$("#errPosition").toggleClass("errHidden");
			affectiva.quality.val(affectiva.quality.val() + affectiva.qualityCount.toString() + ":false;");
			$('#affContinue').removeAttr('disabled').on("click.play", affectiva.runFrameQuality);
		}else if(obj.faceTooDark === true || obj.faceTooBright === true){
			$("#errLight").css("left", ($(document).width() - 450) / 2);
			$("#errLight").toggleClass("errHidden");
			affectiva.quality.val(affectiva.quality.val() + affectiva.qualityCount.toString() + ":false;");
			$('#affContinue').removeAttr('disabled').on("click.play", affectiva.runFrameQuality);
		}else{
			if (obj.maxAttempts === true){
				affectiva.quality.val(affectiva.quality.val() + "frameQuality:too many attempts;");
			}else if(obj.timeout === true){
				affectiva.quality.val(affectiva.quality.val() + "frameQuality:timeout;");
			}else{
				affectiva.quality.val(affectiva.quality.val() + affectiva.qualityCount.toString() + ":true;");
			}
			affectiva.showContainer(affectiva.vic);
			affectiva.hideContainer(affectiva.container);
			if (affectiva.vicMode === "venue"){
				affectiva.container.css("display","none");
			}
		}
	},
	eventStreamStarted: function(){
		clearTimeout(affectiva.polling);
		affectiva.hasStream = affectiva.status();
		affectiva.numStreams++;
		affectiva.log('Current Stream: ' + affectiva.numStreams);
		if( affectiva.container.hasClass('hideContainer') ){
			affectiva.showContainer(affectiva.vic);
		}else{
			$('#affContinue').removeAttr('disabled');
		}
	},
	eventSessionToken: function(token){
		affectiva.holdSubmit = true;
		affectiva.session = token;
		affectiva.log('New Session: ' + affectiva.session);
		affectiva.hasCamera = true;
		affectiva.createNewVIC();
	},
	eventSessionClosed: function(){
		affectiva.log('Session Closed');
		affectiva.hasStream = affectiva.status();
		affectiva.session = null;
		affectiva.ranFirstFrame = false;
		affectiva.destroyVIC();
		affectiva.allAds.shift();
		affectiva.testads.shift();
		affectiva.holdSubmit = false;
		if (affectiva.testads.length === 0 && affectiva.allAds.length === 0){
			affectiva.playCount--;
			if (affectiva.playCount === 0){
				affectiva.doSubmit = true;
				submitPageVIC();
			}else{
				affectiva.testads = affSettings.videos.split(",");
				affectiva.allAds = affectiva.originalMovieFileName.split(',');
				affectiva.didPlay = false;
				autoplay = 0;
				mesg = mesg2;
				affectiva.viewSequenceCount++;
				affectiva.startNewSession(affectiva.testads[0]);
			}
		}else{
			if (affectiva.testads.length > 0){
				affectiva.log("More test ads found.");
				affectiva.startNewSession(affectiva.testads[0]);
			}else {
				affectiva.log("More ads found, no more test ads.");
				affectiva.showContainer(affectiva.vic);
				affectiva.createNewVIC();
			}
		}

	},
	eventSessionExists: function(){
		affectiva.log('Fired Event: eventSessionExists');
	},
	eventStreamExists: function(){
		affectiva.log('Fired Event: eventStreamExists');
	},
	eventCameraDenied: function(){
		affectiva.log('Fired Event: eventCameraDenied');
		affectiva.hasCamera = false;
		affectiva.hideContainer(affectiva.container);
		affectiva.showContainer(affectiva.vic);
		affectiva.timestamps.val('cameraDenied');
		affectiva.quality.val("cameraDenied");
		affectiva.originalInit();
		affectiva.holdSubmit = false;
		affectiva.doSubmit = true;
		affectiva.testads = [];
	},
	eventNoCamera: function(){
		affectiva.log('Fired Event: eventNoCamera');
		affectiva.hasCamera = false;
		affectiva.hideContainer(affectiva.container);
		affectiva.showContainer(affectiva.vic);
		affectiva.timestamps.val('cameraNotFound');
		affectiva.quality.val("cameraNotFound");
		affectiva.originalInit();
		affectiva.holdSubmit = false;
		affectiva.doSubmit = true;
		affectiva.testads = [];
	}
};

var firstFrameEvent = function(timer, movieName){
	var currentTime = new Date().getTime();

	if (affectiva.hasCamera === false){ return; }

	if(movieName.indexOf(affectiva.testads[0]) >= 0){
		affectiva.log('First Frame Fired for Recorded Video:' + movieName);
		if( (affectiva.hasStream) && (affectiva.session) && (affectiva.ranFirstFrame == false) ){
			affectiva.ranFirstFrame = true;
			affectiva.firstFrame(currentTime);
			affectiva.timestamps.val(affectiva.timestamps.val() + currentTime + ',');
		}
	}
};

var lastFrameEvent = function(timer, movieName){
	var currentTime = new Date().getTime();

	if (affectiva.hasCamera === false){ return; }

	if(movieName.indexOf(affectiva.testads[0]) >= 0){
		affectiva.log('Last Frame Fired for Recorded Video:' + movieName);
		if( (affectiva.hasStream) && (affectiva.session) ){
			affectiva.lastFrame(currentTime);
		}

		if( affectiva.hasCamera ){
			affectiva.timestamps.val(affectiva.timestamps.val() + currentTime + ';');
		}
	}else{
		affectiva.log("Did not record, moving along...");
		affectiva.destroyVIC();
		affectiva.allAds.shift();
		if (affectiva.testads.length === 0 && affectiva.allAds.length === 0){
			affectiva.playCount--;
			if (affectiva.playCount === 0){
				affectiva.doSubmit = true;
				submitPageVIC();
			}else{
				affectiva.testads = affSettings.videos.split(",");
				affectiva.allAds = affectiva.originalMovieFileName.split(',');
				affectiva.didPlay = false;
				autoplay = 0;
				mesg = mesg2;
				affectiva.viewSequenceCount++;
				affectiva.startNewSession(affectiva.testads[0]);
			}
		}else{
			if (affectiva.session ){
				affectiva.showContainer(affectiva.vic);
				affectiva.createNewVIC();
			}else{
				if (affectiva.testads.length > 0){
					affectiva.log("More test ads found.");
					affectiva.startNewSession(affectiva.testads[0]);
				}else {
					affectiva.log("More ads found, no more test ads.");
					affectiva.showContainer(affectiva.vic);
					affectiva.createNewVIC();
				}
			}
		}
	}
};

var submitPageVIC = function(){
	if (affectiva.doSubmit === true){
		if (affectiva.session || affectiva.holdSubmit) {
			setTimeout(submitPageVIC, 500);
		}else{
			affectiva.originalSubmit();
		}
	}
};

var addVIC = function(){
	affectiva.log('Loaded Intergration Version: ' + affectiva.version);
	affectiva.initialize();
};