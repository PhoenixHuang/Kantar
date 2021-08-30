var NUM_EXPOSURES = 1;
var CURRENT_EXPOSURE = 1;
var jwSettings = {};
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
        adName: ''
    },
    container: null,
    mrQuestion: null,
    primary: "html5",
    quality_count: 0,
    framepoll: null,
    videoTag: null,
    currentRate: 0,
    itemData: "",
    fullData: "",
    FFevent: false, // it tells if the FF buttons has been pressed
    timeWait: 5,
    timerWait: null,
    nCompleted: 0,
    init: function(jwSettings1, affSettings1) {
        jwSettings = jwSettings1;
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

      

        videoPlayer.log("Initializing Player Version: " + jwplayer.version + ";JS Version: " + videoPlayer.version, false);

        jwplayer.utils.hasHTML5 = function() {
            return !!document.createElement('video').canPlayType;
        };
        jwplayer.utils.hasFlash = function() {
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

        videoPlayer.container = $("#vidcontainer");


        videoPlayer.container.css({
            "width": videoPlayer.settings.width + "%",
            "height": videoPlayer.settings.height
        });


        // DISPLAY FAST FORWARD BTN
        if (videoPlayer.settings.fastforward === false) {
            $(".btn-fast").remove();
        }

        if ((jwplayer.utils.hasHTML5() === true) || (jwplayer.utils.hasFlash() === true)) {
            // PLAY BUTTON ON CLICK
            $(document).on('click', '#vidcontainer .bt-play', function() {
                self.startPlayback();

                $("#vidcontainer .bt-play").addClass("remove");

                if (videoPlayer.settings.controlsRate === false) {
                    // TIME RATE
                    self.videoTag = $('video');
                    //self.currentRate = 1;					

                    if (self.videoTag.playbackRate && self.currentRate === 0) {


                        self.videoTag.playbackRate = 1;

                        $('.ct-rate button.btn-play').on('click', function() {
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

                        $(".ct-rate button.btn-fast").on("click", function() {
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

                        $(".ct-rate button.btn-rewind").on("click", function() {
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
                }
            });

            $('#introTxt').html(videoPlayer.settings.messagePlay1);
            $("#affContainer").appendTo("#affWrap");
            $("#affProgressbar").appendTo("#affWrap");
            $("#errPosLight,#errPosition,#errLight,#affWait").appendTo("#affWrap");
            $("#vidcontainer, #introTxt").addClass("hideContainer");
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
        if (self.timeIsRunning === false) {
            self.jwPlayerFirstFrame();
        }
        $("#vidcontainer .bt-play").addClass("hide-play");
        $('.ct-rate button.btn-play').addClass("pause");
        videoPlayer.log("Started playback at: " + videoPlayer.playerInstance.getPosition(), true);
        self.playerInstance.play();
    },
    setupJWPlayer: function() {
        var self = this;

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
            height: "auto",
            autostart: videoPlayer.settings.autostart,
            androidhls: videoPlayer.settings.androidhls,
            aspectratio: videoPlayer.settings.aspectRatio,
            playlist: videoPlayer.settings.playlist,
            primary: videoPlayer.primary,
            wmode: 'transparent',
            preload: videoPlayer.settings.preload

        });

        // TIME RATE
        if (jwplayer().getEnvironment().OS.iPad === true) {
            // keep time rate
        } else if (jwplayer().getEnvironment().OS.mobile === true) {
            $("#vidcontainer.time-rate").removeClass("time-rate");
        }

        self.playerInstance.on('ready', function() {
            videoPlayer.onReady()
        });
        self.playerInstance.on('time', function(d) {
            videoPlayer.onTime(d)
        });
        self.playerInstance.on('play', function(d) {
            videoPlayer.onPlay(d)
        });
        self.playerInstance.on('pause', function(d) {
            videoPlayer.onPause(d)
        });
        self.playerInstance.on('playlistItem', function(d) {
            videoPlayer.onPlaylistItem(d)
        });
        self.playerInstance.on('complete', function() {
            videoPlayer.onComplete()
        });
        self.playerInstance.on('buffer', function(data) {
            var bufferData = data.type + " at: " + videoPlayer.playerInstance.getPosition(); //+ ", reason: " + data.reason + ", oldstate: " + data.oldstate;
            videoPlayer.log(bufferData, true);
        });
    },
    log: function(msg, record) {
        var self = this;

        if (videoPlayer.hasConsole) {
            console.log(msg);
        }

        if (videoPlayer.mrQuestion && videoPlayer.recordLogs === true && record === true) {
            self.itemData += msg + ";";
        }
    },
    forceLog: function(msg) {
        var self = this;
        self.itemData += msg + ";";
    },
    doSubmit: function() {
        var self = this;
        videoPlayer.log("Watched Entire Video(s): true", false);
        videoPlayer.mrQuestion.val(self.fullData);
        document.forms[0].submit();
    },
    onReady: function() {
        //videoPlayer.log("\n\n" + "Rendering Mode: " + jwplayer().getProvider().name, true);
    },
    onPlaylistItem: function() {

    },
    onPause: function() {
        $("#vidcontainer .bt-play").removeClass("hide-play");
    },
    playbackEndPosition: "",
    playbackEnd: false,
    isRewinded: false,
    onTime: function(e) {
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

                self.timerWait = setInterval(function() {
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
    onPlay: function(event) {
        var self = this;
        //videoPlayer.log("Started playback at: " + videoPlayer.playerInstance.getPosition(), true);

        if (self.playbackEnd === true) {
            jwplayer().seek(jwplayer().getDuration());
            $(".ct-rate").addClass("hide");
        } else {
            $(".ct-rate").removeClass("hide");
            $('#introTxt').css("visibility", "hidden");
        }
    },
    onComplete: function() {
        var self = this;

        videoPlayer.recordLogs = true;
        videoPlayer.log("Completed playback at: " + videoPlayer.playerInstance.getPosition(), true);
        self.jwPlayerLastFrame();
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

        if (jwplayer().getPlaylistIndex() === jwplayer().getPlaylist().length - 1) {
            self.settings.playCount--;
            if (self.settings.playCount > 0) {

                if (!self.settings.controlsRate) {
                    // controlsRate = false and playCount = 2
                    $('#introTxt').html(self.settings.messagePlay2);
                } else {
                    if (self.FFevent) {
                        $('#introTxt').html(self.settings.messagePlay3);
                        self.settings.controlsRate = false;
                    } else {
                        $('#introTxt').html(self.settings.messagePlay2);
                    }
                }

                $('#introTxt').css("visibility", "visible");
                self.playerInstance.remove();
                self.setupJWPlayer();
            } else {
                self.doSubmit();
            }
        }
    },
    onContinue: function() {
        $(".question-text").hide();
        $("#affContainer").addClass("hideContainer");
        $("#vidcontainer, #introTxt").removeClass("hideContainer");
        videoPlayer.setupJWPlayer();
    },
    osDetection: function() {
        var self = this;
    },
    fetchUserAgent: function() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return userAgent.toLowerCase();
    },
    isIE: function() {
        var self = this;
        var UA = self.fetchUserAgent();
        return (UA.indexOf('msie') != -1) ? parseInt(UA.split('msie')[1]) : false;
    },
    isWindowsPhone: function() { // 8.0 and below
        var self = this;
        var UA = self.fetchUserAgent();
        return ((UA.indexOf('windows phone') != -1)) ? true : false;
    },
    isOldWindowsPhone: function() { // 8.0 and below
        var self = this;
        var UA = self.fetchUserAgent();
        return ((UA.indexOf('windows phone 8.0') === -1) && (UA.indexOf('windows phone os 7') === -1)) ? false : true;
    },
    isOldIos: function() { // 7.0 and below
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
    jwPlayerFirstFrame: function(plItem) {
        var self = this;
        self.log("jwPlayerFirstFrame", false);
        self.timeIsRunning = true;
        self.startTime = self.getTimeNow();

        if (videoPlayer.mrQuestion) {
            videoPlayer.mrQuestion.val(videoPlayer.mrQuestion.val() + self.startTime + ":");
        }
    },
    jwPlayerLastFrame: function(plItem) {
        var self = this;
        self.log(self.streamingDurantion, false);

        self.log("video ended");
        if (videoPlayer.mrQuestion) {
            videoPlayer.mrQuestion.val(videoPlayer.mrQuestion.val() + self.endTime + ";");
        }
    },
    getTimeNow: function() {
        var d = new Date();
        var n = d.getTime();
        return n;
    }
};




$.fn.center = function(playerwidth) {
    this.css({
        "text-align": "center",
        "margin": "auto"
    });
    return this;
}