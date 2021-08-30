var NUM_EXPOSURES = 1;
var CURRENT_EXPOSURE = 1;
var jwSettings ={} ,affSettings = {};
var videoPlayer = {
    playerInstance: null,
    version: "1.4",
    debugMode: true,
    recordLogs: true,
    hasConsole: false,
    settings: {
        androidhls: false,
        aspectRatio: "16:9",
        controls: false,
        controlsRate: false,
        preload: "auto",
        autostart: false,
        customSize: false,
        width: "100%",
        height: "",
        enableAttempt: false,
        videoAttempt: 2,
        adName:''
    },
	isRecording: true,
	faceRecorder: null,
	framepoll: null,
	qualityCount: 0,
	options: null,
	playedVideos: [],
	playlistLength: 0,
    mrQuestion: null,
    primary: "html5",
    //videoRec: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //videoMarker: 1,
    //watchedEntireVideo: false,
    //hasDuration: true,
    videoTag: null,
    currentRate: 0,
    playbackRate: 0,
    itemData: "",
    fullData: "",
    FFevent: false, // it tells if the FF buttons has been pressed
    timeWait: 5,
    timerWait: null,
    nCompleted: 0,
    init: function (jwSettings1,affSettings1) {
		jwSettings = jwSettings1; affSettings = affSettings1;
        var self = this;

         // ********************************
        // SETTING UP CONSOLE
        // ********************************
        if (videoPlayer.debugMode === true) {
            if (typeof console != "undefined") {
                if (typeof console.log != "undefined") {
                    videoPlayer.hasConsole = true;
                }
            }
        }
        // ********************************
        // SETTING UP OUTPUT STRING
        // ********************************
        if (!videoPlayer.mrQuestion) {
            videoPlayer.mrQuestion = $(".mrEdit");
            videoPlayer.mrQuestion.val("");
        }

        // ********************************               
        // FOR UNSUPPORTED BROWSERS
        // ********************************      
        // IN ORDER:
        // IE8 and previous -- JW Player library is not supported for IE8 and previous versions of the browser
        // Windows Phone 8.0 and previous
       // IOS7 and previous -- JW Player 7 is not supported for IOS7 and previous versions of the device
        
        // IE8 and previous
        if ((self.isIE()) !== false && (self.isIE() <= 8)) {
            videoPlayer.mrQuestion.val("unsupportedbrowser");
            document.forms[0].submit();
            return false;
        }
        // Windows Phone 8.0 and previous
        if (self.isWindowsPhone() === true) {
            if (self.isOldWindowsPhone() === true) {
                videoPlayer.mrQuestion.val("unsupporteddevice");
                document.forms[0].submit();
                return false;
            }
        }
        else {
            // IOS7 and previous
            if (self.isOldIos() === true) {
                videoPlayer.mrQuestion.val("unsupporteddevice");
                document.forms[0].submit();
                return false;
            }
        }
        
        videoPlayer.log("Initializing Player Version: " + jwplayer.version + ";JS Version: " + videoPlayer.version, false);

        jwplayer.utils.hasHTML5 = function () {
            return !!document.createElement('video').canPlayType;
        };
        jwplayer.utils.hasFlash = function () {
            return (typeof navigator.plugins != "undefined" && typeof navigator.plugins['Shockwave Flash'] != "undefined") || (typeof window.ActiveXObject != "undefined");
        };
        
        if (typeof jwSettings == "undefined") {
            videoPlayer.log("jwSettings not found", false);
            document.forms[0].submit();
            return false;
        } else {
            videoPlayer.settings = $.extend(true, videoPlayer.settings, jwSettings);
            videoPlayer.log("jwSettings found", false);
        }

        //AUTOPLAY
        if (videoPlayer.settings.autostart === true) {
            $("#vidcontainer .bt-play").remove();
        }
        //CUSTOM SIZE
        if (!videoPlayer.settings.customSize || jwplayer.utils.isMobile() === true) {
            videoPlayer.settings.width = "100%";
            videoPlayer.settings.height = "";
        } else {
            //$("#vidcontainer").addClass("custom-size");
            videoPlayer.settings.aspectRatio = "";
            $("#vidcontainer").css({ "width": videoPlayer.settings.width, "height": videoPlayer.settings.height });
        }

        // TIME RATE
        if (jwplayer.utils.isIPad() === true) {
            // keep time rate
        } else if (jwplayer.utils.isMobile() === true) {
            $("#vidcontainer.time-rate").removeClass("time-rate");
        }
        
        // DISPLAY FAST FORWARD BTN
        if (videoPlayer.settings.fastforward === false) {
            $(".btn-fast").remove();
        }

        if ((jwplayer.utils.hasHTML5() === true) || (jwplayer.utils.hasFlash() === true)) {
            // PLAY BUTTON ON CLICK
            $(document).on('click', '#vidcontainer .bt-play', function () {
                self.startPlayback();
                               
                // TIME RATE
                self.videoTag = document.querySelector('video');
                //self.currentRate = 1;
                $("#vidcontainer .bt-play").addClass("remove");

                if (self.videoTag.playbackRate && self.currentRate === 0) {
                    

                    self.videoTag.playbackRate = 1;

                    $('.ct-rate button.btn-play').on('click', function () {
                        var previousRate = self.videoTag.playbackRate;

                        self.setCurrentRate(1);

                        if (($(this).hasClass("pause"))) {
                            videoPlayer.log("time rate paused at: " + videoPlayer.playerInstance.getPosition(), true);
                            $(this).removeClass("pause");
                            self.playerInstance.play();
                        } else {
                            videoPlayer.log("time rate selected: Normal at: " + videoPlayer.playerInstance.getPosition(), true);
                            $(this).addClass("pause");
                            self.playerInstance.pause();
                        }

                        if (previousRate !== 1) {
                            $(this).addClass("pause");
                            self.playerInstance.play();
                        }

                    });

                    $(".ct-rate button.btn-fast").on("click", function () {
                        videoPlayer.log("time rate selected: faster at: " + videoPlayer.playerInstance.getPosition(), true);
                        

                        $(".ct-rate button.btn-play").removeClass("pause");
                        self.setCurrentRate(2);

                        if (self.playbackEnd === true) {
                            jwplayer().seek(jwplayer().getDuration());
                            return;
                        } else {
                            self.FFevent = true;
                        }

                        var state = jwplayer().getState();
                        if (state === "paused") {
                            self.playerInstance.play();
                        };
                        
                    });

                    $(".ct-rate button.btn-rewind").on("click", function () {
                        videoPlayer.forceLog("time rate selected: rewind at: " + videoPlayer.playerInstance.getPosition());

                        clearInterval(self.timerWait);
                        $("body").removeClass("hide-playFF");
                        $(".ct-rate button.btn-play, .ct-rate button.btn-fast").prop("disabled", "");

                        self.isRewinded = true;
                        jwplayer().seek(0);
                        self.setCurrentRate(1);
                        $(".ct-rate button.btn-play").addClass("pause");
                        $(".btn-rewind").attr("disabled", "disabled");
                        $("body").addClass("hide-rewind");
                        self.playbackEnd = false;
                    });


                    $(".ct-rate").removeClass("hide");
                }
            });
            videoPlayer.setupJWPlayer();
			
			var params = {
				quality: "high",
				bgcolor: "#ffffff",
				allowscriptaccess: "always",
				allowfullscreen: "true"
			};
			
			var attributes = {
				id: "Facerecorder",
				name: "Facerecorder",
				align: "middle"
			};
			
			$('#introTxt').html(videoPlayer.settings.messagePlay1);		
			$("#affContainer").appendTo("#affWrap");
			$("#affProgressbar").appendTo("#affWrap");
			$("#errPosLight,#errPosition,#errLight,#affWait").appendTo("#affWrap");
			$("#vidcontainer, #introTxt").addClass("hideContainer");
			
			$('#affContinue').on('click.play', videoPlayer.runFrameQuality);
			$("input.fakeContinue").on("click.play", videoPlayer.runFrameQuality);				
			
			if (typeof affSettings == "undefined"){
				videoPlayer.log("affSettings not found");
				return false;
			}else{	
				videoPlayer.log("affSettings found");
			
				var options = $.extend({
					apiKey: "apiKey",
					projectCode: "webrtctest001",
					movieId: "just_my_shell.mp4",
					participantId: "webrtc_test_" + ((new Date()).getTime().toString()),
					viewSequence: 1,
					server: "https://labs-portal.affectiva.com",
					sessionTokenCallback: "session_token",
					sessionClosedCallback: "session_closed",
					streamingStartedCallback: "streaming_started",
					cameraDeniedCallback: "camera_denied",
					noWebCamCallback: "no_webcam",
					frameQualityReportSuccessCallback: "frameQualitySuccess",
					frameQualityReportFailureCallback: "frameQualityFailure"
				},affSettings);
				videoPlayer.options = options;
				
				NUM_EXPOSURES = videoPlayer.settings.playCount;
				
				if (typeof(swfobject) != "undefined"){
					swfobject.embedSWF(videoPlayer.options.server + "/portal/swf/Facerecorder.swf" + affSettings.frameQuality, "affEmbed", "320", "241", "10.1.0", "playerProductInstall", options, params, attributes, function(e){
						videoPlayer.faceRecorder = e.ref;
					});
				}
			}			
			
        }
    },
	runFrameQuality: function(){
		if (typeof videoPlayer.faceRecorder.frameQualityReport == "function"){
			$('#affContinue').attr('disabled',true).off("click.play");
			$("#errPosLight,#errPosition,#errLight").addClass("errHidden");
			if (videoPlayer.qualityCount >= 2){
				frameQualitySuccess({
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
					videoPlayer.faceRecorder.frameQualityReport();
				}, 500);

				videoPlayer.framepoll = setTimeout(function(){
					frameQualitySuccess({
						faceNotDetected: false,
						faceTooSmall: false,
						faceTooBlurred: false,
						faceTooDark: false,
						faceTooBright: false,
						timeout: true
					});
				},10000);
			}
			videoPlayer.qualityCount++;
		}else{
			videoPlayer.log('frameQualityReportSuccessCallback function not found.');
			videoPlayer.onContinue();
		}	
	},	
    setCurrentRate: function(rate) {
        var self = this;

        if (self.playbackEnd === true) {
            rate = 1;
        }

        self.currentRate = rate;
        self.videoTag.playbackRate = self.currentRate;
        self.videoTag.defaultPlaybackRate = self.currentRate;
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            jwplayer().seek(jwplayer().getPosition());
        }
    },
    startPlayback: function() {
        var self = this;

        $("#vidcontainer .bt-play").addClass("hide-play");
        $('.ct-rate button.btn-play').addClass("pause");
        videoPlayer.log("Started playback at: " + videoPlayer.playerInstance.getPosition(), true);
        self.playerInstance.play();
    },
    setupJWPlayer: function () {
        var self = this;
		self.playedVideos = [];
        self.timeIsRunning = false;

        $("#vidcontainer .bt-play").removeClass("hide-play remove");

        // DISPLAY CONTROLS RATE
        if (videoPlayer.settings.controlsRate === false) {
            $(".ct-rate").remove();
        }
        // ON PLAYCOUNT = 2 
        if (self.FFevent == true) {
            
        }

        

        //videoPlayer.watchedEntireVideo = false;
        self.playerInstance = jwplayer("vidPlayer");
        
        self.playerInstance.setup({
            controls: videoPlayer.settings.controls,
            width: "100%",
            height: videoPlayer.settings.height,
            autostart: videoPlayer.settings.autostart,
            androidhls: videoPlayer.settings.androidhls,
            aspectratio: videoPlayer.settings.aspectRatio,
            playlist: videoPlayer.settings.playlist,
            primary: videoPlayer.primary,
            wmode: 'transparent',
            preload: videoPlayer.settings.preload
            
        });

        self.playerInstance.on('ready', function () { videoPlayer.onReady() });
        self.playerInstance.on('time', function (d) { videoPlayer.onTime(d) });
        self.playerInstance.on('play', function (d) { videoPlayer.onPlay(d) });
        self.playerInstance.on('pause', function (d) { videoPlayer.onPause(d) });
        self.playerInstance.on('playlistItem', function (d) { videoPlayer.onPlaylistItem(d) });
        self.playerInstance.on('complete', function () { videoPlayer.onComplete() });
        self.playerInstance.on('buffer', function (data) {
            var bufferData = data.type + " at: " + videoPlayer.playerInstance.getPosition(); //+ ", reason: " + data.reason + ", oldstate: " + data.oldstate;
            videoPlayer.log(bufferData, true);
        });
		self.playlistLength = self.playerInstance.getPlaylist().length;
    },
    log: function (msg, record) {
        var self = this;

        if (videoPlayer.hasConsole) {
            console.log(msg);
        }
        //if (videoPlayer.mrQuestion && videoPlayer.recordLogs === true && record === true) {
        //    videoPlayer.mrQuestion.val(videoPlayer.mrQuestion.val() + "\n\n" + msg + ";");
        //}
        if (videoPlayer.mrQuestion && videoPlayer.recordLogs === true && record === true) {
            self.itemData += msg + ";";
        }
    },
    forceLog: function(msg) {
        var self = this;
        self.itemData += msg + ";";
    },
    //checkMarkers: function () {
    //    for (var i = 0; i < videoPlayer.videoRec.length; i++) {
    //        videoPlayer.log("Marker" + i + ":" + videoPlayer.videoRec[i], true);
    //        if (videoPlayer.videoRec[i] === 0) {
    //            videoPlayer.log("Check Markers: false", true);
    //            return false;
    //        }
    //    }
    //    videoPlayer.log("Check Markers: true", true);
    //    return true;
    //},
    doSubmit: function (stopFullDataLog) {
        var self = this;
        //if (videoPlayer.watchedEntireVideo === false) {
        //    videoPlayer.mrQuestion.val("false");
        //} else {
		if (videoPlayer.isRecording){
			videoPlayer.log("Watched Entire Video(s): true", false);
		}
		if (stopFullDataLog != true){
			videoPlayer.mrQuestion.val(self.fullData);
		}
        //}
        document.forms[0].submit();
    },
    onReady: function () {
        //videoPlayer.log("\n\n" + "Rendering Mode: " + jwplayer().getProvider().name, true);
    },
    onPause: function () {
        $("#vidcontainer .bt-play").removeClass("hide-play");
    },
    playbackEndPosition: "",
    playbackEnd: false,
    isRewinded: false,
    onTime: function (e) {
        var self = this;

        if (self.settings.controlsRate) {
            var endMargin = 0.5;
            // setiing currentRate to default if video is ff and it is close to end playback
            if ((self.currentRate == 2) && (e.position >= (self.playerInstance.getDuration() - 1.5))) {
                self.setCurrentRate(1);
            }
            if (self.playbackEndPosition === "") {
                self.playbackEndPosition = self.playerInstance.getDuration() - endMargin;
            }
            if ((e.position >= self.playbackEndPosition) && (self.playbackEnd == false)) {
                self.playbackEnd = true;

                if (self.isRewinded === false) {
                    $(".btn-rewind").removeAttr("disabled");
                }
                $(".btn-play").removeClass("pause");
                self.setCurrentRate(1);
                jwplayer().seek(jwplayer().getDuration() - endMargin).pause();
                videoPlayer.recordLogs = false;

                if (self.FFevent == true) { // has FF event
                    $("body").addClass("hide-playFF");
                    $(".ct-rate button.btn-play, .ct-rate button.btn-fast").prop("disabled", "disabled");
                } else {
                    $("body").addClass("hideRateBtn hide-playFF");
                    $(".ct-rate button.btn-play, .ct-rate button.btn-fast").prop("disabled", "disabled");
                }
                var time = self.timeWait;
                $(".loaderReplay").find("span").text(time);

                self.timerWait = setInterval(function () {
                    time -= 1;
                    console.log(time);
                    if (time < 0) {
                        clearInterval(self.timerWait);
                        jwplayer().play();
                        return;
                    }
                    $(".loaderReplay").find("span").text(time);
                }, 1000);


            }
        }
    },
    onPlay: function (event) {
        var self = this;
        //videoPlayer.log("Started playback at: " + videoPlayer.playerInstance.getPosition(), true);

        if (self.playbackEnd === true) {
            jwplayer().seek(jwplayer().getDuration());
            $(".ct-rate").addClass("hide");
        } else {
            $(".ct-rate").removeClass("hide");
            $('#introTxt').css("visibility", "hidden");
			if (self.timeIsRunning === false) {
				var plItem = jwplayer().getPlaylistItem(jwplayer().getPlaylistIndex());
				self.jwPlayerFirstFrame(plItem.file);
			}			
        }
    },
    onComplete: function () {
        var self = this;

        videoPlayer.recordLogs = true;
        videoPlayer.log("Completed playback at: " + videoPlayer.playerInstance.getPosition(), true);

        var plItem = jwplayer().getPlaylistItem(jwplayer().getPlaylistIndex());
		self.playedVideos.push(plItem.file);
        self.jwPlayerLastFrame(plItem.file);

        $(".ct-rate").addClass("hide");
        $(".btn-rewind").attr("disabled", "disabled");
        $("body").removeClass("hide-rewind");
        $("body").removeClass("hideRateBtn hide-playFF");
        $(".ct-rate button.btn-play, .ct-rate button.btn-fast").prop("disabled", "");

        self.playbackEnd = false;
        self.isRewinded = false;

        self.nCompleted += 1;
        
        self.fullData += "[id: " + self.settings.adName + ";PlayCount:" + self.nCompleted + ";controlsRate:" + self.settings.controlsRate + ";" + self.itemData + "]";
        self.itemData = "Started playback at: 0;";
        
        //if (videoPlayer.hasDuration === false) {
        //    videoPlayer.watchedEntireVideo = true;
        //}
        //else {
            //videoPlayer.watchedEntireVideo = videoPlayer.checkMarkers();
            //if (videoPlayer.watchedEntireVideo === false) {
                //if (videoPlayer.settings.enableAttempt === true) {
                //    if (videoPlayer.settings.videoAttempt > 0) {
                //        videoPlayer.settings.videoAttempt -= 1;
                //        $('#introTxt').html("The video wasn't watched in full, please play it again");
                //        $('#introTxt').css("visibility", "visible");
                //        self.playerInstance.remove();
                //        videoPlayer.setupJWPlayer();
                //        return;
                //    } else {
                //        videoPlayer.mrQuestion.val("disqualified");
                //        document.forms[0].submit();
                //        return;
                //    }
                //}
            //}
        //}

        //videoPlayer.settings.videoAttempt = 0;
        
        if (jwplayer().getPlaylistIndex() === self.playlistLength - 1) {
            videoPlayer.settings.playCount--;
            if (videoPlayer.settings.playCount > 0) {


                if (!self.settings.controlsRate) {
                    // controlsRate = false and playCount = 2
                    $('#introTxt').html(videoPlayer.settings.messagePlay2);
                } else {
                    if (self.FFevent) {
                        $('#introTxt').html(videoPlayer.settings.messagePlay3);
                        self.settings.controlsRate = false;
                    } else {
                        $('#introTxt').html(videoPlayer.settings.messagePlay2);
                    }
                }
                //videoPlayer.log("Playcount >0, restarting.", true);
                
				$('#introTxt').css("visibility", "visible");
				self.playerInstance.remove();
				if (videoPlayer.isRecording === false){
					videoPlayer.setupJWPlayer();
				}
            } else {
				if (videoPlayer.isRecording === false){
					videoPlayer.doSubmit();
				}
            }
            //videoPlayer.doSubmit();
        }
    },
	onContinue: function(){
		$("#affContainer").addClass("hideContainer");
		$("#vidcontainer, #introTxt").removeClass("hideContainer");
		videoPlayer.setupJWPlayer();
	},	
    osDetection: function () {
        var self = this;
    },
    fetchUserAgent: function () {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return userAgent.toLowerCase();
    },
    isIE: function () {
        var self = this;
        var UA = self.fetchUserAgent();
        return (UA.indexOf('msie') != -1) ? parseInt(UA.split('msie')[1]) : false;
    },
    isWindowsPhone: function () {    // 8.0 and below
        var self = this;
        var UA = self.fetchUserAgent();
        return ((UA.indexOf('windows phone') != -1)) ? true : false;
    },
    isOldWindowsPhone: function () {    // 8.0 and below
        var self = this;
        var UA = self.fetchUserAgent();
        return ((UA.indexOf('windows phone 8.0') === -1) && (UA.indexOf('windows phone os 7') === -1)) ? false : true;
    },
    isOldIos: function () {    // 7.0 and below
        var self = this;
        var UA = self.fetchUserAgent();
        if (UA.match(/ip(hone|od|ad)/)) {
            var v = (UA).match(/os (\d+)_(\d+)_?(\d+)?/);
            var version = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
            if (version[0] <= 7) {
                return true;
            }
        }
        return false;
    },
    
    // detecting duration of the streaming from pressing the play button 
    //(this will include the initial buffering) to the last frame execution.
    startTime: 0,
    endTime: 0,
    timeIsRunning: false,
    streamingDurantion: 0,
    jwPlayerFirstFrame: function (plItem) {
        var self = this;
		self.startTime = self.getTimeNow();
		self.log(plItem);
		if (plItem.indexOf(affSettings.movieId) >= 0){
			self.log("jwPlayerFirstFrame", false);
			self.timeIsRunning = true;
			
			videoPlayer.log('FirstFrame: ' + self.startTime);
			videoPlayer.faceRecorder.affFirstFrame(self.startTime);		
		}
    },
    jwPlayerLastFrame: function (plItem) {
        var self = this;
		self.endTime = self.getTimeNow();
		
		self.log(plItem);
		if (plItem.indexOf(affSettings.movieId) >= 0){
			self.log("jwPlayerLastFrame", false);

			self.streamingDurantion = ((self.endTime - self.startTime) / 1000);
			self.log("\n" + "time(s): " + self.streamingDurantion + "\n", true);
			self.log(self.streamingDurantion, false);
			self.log("video ended");
			
			videoPlayer.log('LastFrame: ' + self.endTime);
			videoPlayer.faceRecorder.affLastFrame(self.endTime);		
		}
    },
    getTimeNow: function () {
        var d = new Date();
        var n = d.getTime();
        return n;
    }
};

var session_token = function(token){
	videoPlayer.log("session started - token: " + token);
	videoPlayer.isRecording = true;
};

var streaming_started = function(){
	videoPlayer.log("streaming success");
	if (CURRENT_EXPOSURE === 1){ //first time streaming
		$("#affContinue").attr("disabled",false);
	}else{
		videoPlayer.setupJWPlayer();
	}
};

var session_closed = function(){
	videoPlayer.log("session closed");
	if (videoPlayer.isRecording){
		videoPlayer.isRecording = false;
		if (CURRENT_EXPOSURE < NUM_EXPOSURES) {
			CURRENT_EXPOSURE++;

			if (videoPlayer.playedVideos.length === videoPlayer.playlistLength){
				if (typeof videoPlayer.faceRecorder.affStartNewSessionWithVS == "function"){
					videoPlayer.faceRecorder.affStartNewSessionWithVS(videoPlayer.options.movieId,CURRENT_EXPOSURE);
				}else{
					videoPlayer.faceRecorder.affStartNewSession(videoPlayer.options.movieId);
				}
			}
		}else {
			if (videoPlayer.playedVideos.length === videoPlayer.playlistLength){
				videoPlayer.doSubmit();
			}
		}
	}	
};

var camera_denied = function(){
	videoPlayer.log("failure - camera denied");
	videoPlayer.mrQuestion.val("cameradenied");
	videoPlayer.isRecording = false;
	videoPlayer.doSubmit(true);	
};

var no_webcam = function(){
	videoPlayer.log("failure - no camera detected");
	videoPlayer.mrQuestion.val("cameranotfound");
	videoPlayer.isRecording = false;
	videoPlayer.doSubmit(true);
};

var frameQualityFailure = function(obj){
	clearTimeout(videoPlayer.framepoll);
	videoPlayer.log('Fired Event: frameQualityFailure');
	videoPlayer.mrQuestion.val("cameranotfound");
	videoPlayer.isRecording = false;
	videoPlayer.doSubmit(true);
};

var frameQualitySuccess = function(obj){
	clearTimeout(videoPlayer.framepoll);
	videoPlayer.log('Fired Event: frameQualitySuccess');
	videoPlayer.log(obj);
	videoPlayer.framepoll = null;
	$("#affWait").addClass("errHidden");
	
	if (obj.faceNotDetected === true || obj.faceTooBlurred === true){
		$("#errPosLight").css("left", ($(document).width() - 450) / 2);
		$("#errPosLight").toggleClass("errHidden");			
		$('#affContinue').removeAttr('disabled').on("click.play", affectiva.runFrameQuality);
	}else if(obj.faceTooSmall === true){
		$("#errPosition").css("left", ($(document).width() - 450) / 2);
		$("#errPosition").toggleClass("errHidden");			
		$('#affContinue').removeAttr('disabled').on("click.play", affectiva.runFrameQuality);
	}else if(obj.faceTooDark === true || obj.faceTooBright === true){
		$("#errLight").css("left", ($(document).width() - 450) / 2);
		$("#errLight").toggleClass("errHidden");
		$('#affContinue').removeAttr('disabled').on("click.play", affectiva.runFrameQuality);
	}else{
		if (obj.maxAttempts === true){
			videoPlayer.log("frameQuality has too many attempts");
		}else if(obj.timeout === true){
			videoPlayer.log("frameQuality timed out");
		}
		videoPlayer.onContinue();
	}
};