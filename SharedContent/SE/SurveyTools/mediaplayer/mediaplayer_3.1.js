/** 
 * mediaplayer class
 * Inherits from SESurveyTool
 */
function mediaplayer(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
mediaplayer.prototype.output = "";
mediaplayer.prototype.currentVideoDuration = 0;
mediaplayer.prototype.currentVideo = null;
mediaplayer.prototype.onTimeNormalData = [];
mediaplayer.prototype.onTimeSliderData = {};
mediaplayer.prototype.currentPlayCount = 0;
mediaplayer.prototype.activeVideo = 0;
mediaplayer.prototype.skipped = false;


mediaplayer.prototype = Object.create(SESurveyTool.prototype);
mediaplayer.prototype.type = function() {
    return "mediaplayer";
}

mediaplayer.prototype.setResponses = function() {
	
    var skipdetection = this.getProperty("skipdetection");
    var videotype = this.getProperty("videotype");
		//Set initial response
		var initialResp = "";
        $.each(this.inputs.filter('textarea'), function(i, e) {
            initialResp += $(e).val();
        });
		initialResp = $.trim(initialResp);
		//Set response
    if (this.getProperty("filetype").toLowerCase() == 'video') {
		if (videotype == 'slider') {
			if(Object.getOwnPropertyNames(this.onTimeSliderData).length !== 0){
				this.sliderDataCalculation(this.currentVideoDuration);
			}
		}
		if(skipdetection){
			if(this.onTimeNormalData.length > 0){
					this.skipdetectionCalculation(this.currentVideo);
			}			
		}
		
		if($.trim(this.output) == ""){
			var finalOutput = initialResp;
		}else{
			var finalOutput = this.output;			
		}
        if (finalOutput.charAt(finalOutput.length - 1) == ',') {
            finalOutput = finalOutput.substr(0, finalOutput.length - 1);
        }
        $.each(this.inputs.filter('textarea'), function(i, e) {
            $(e).val(finalOutput.slice(i * 4000, (i + 1) * 4000))
        });
    }
    if (this.getProperty("filetype").toLowerCase() == 'audio') {
        $.each(this.inputs.filter('textarea'), function(i, e) {
            $(e).val('Normal audio')
        });
    }
}

mediaplayer.prototype.getDependencies = function() {
    return [{
        'type': 'stylesheet',
        'url': pageLayout.sharedContent + 'LAF/Lib/jQueryUI/jquery-ui.min.css'
    }, {
        "type": "stylesheet",
        'url': pageLayout.themePath + 'css/videoplayer_v6.css'
    }, {
        'type': 'script',
        'url': pageLayout.sharedContent + 'LAF/Lib/jQueryUI/1.11.0/jquery-ui.min.js'
    }];
}
mediaplayer.prototype.build = function() {
	var filetype = this.getProperty("filetype").toLowerCase();	
    var audioplayerprogress = this.getProperty("audioplayerprogress");
    var audioplayerwidth = this.getProperty("audioplayerwidth");
	if (filetype == 'audio') {
		$('head').append("<style>#audioplayer{width: "+audioplayerwidth+"px;height: 60px;margin: 5rem auto;border: 2px solid #e4e4e4;min-width: 286px;max-width: 480px;}#pButton{height: 60px; width: 60px; border: none; background-size: 82% 82%; background-repeat: no-repeat; background-position: center; float: left; outline: none;}.play{background: url('"+pageLayout.themePath  + "se/images/play.png');}.pause{background: url('"+pageLayout.themePath  + "se/images/pause.png');}#timeline{width: "+audioplayerprogress+"px; height: 20px; margin-top: 20px; float: left; border-radius: 15px; background: #e4e4e4;}#playhead{width: 18px;height: 18px;border-radius: 50%;margin-top: 1px;background: rgba(0, 0, 0, 1);}</style>");
	}
    this.deferred.resolve();
}
mediaplayer.prototype.render = function() {
    var filetype = this.getProperty("filetype").toLowerCase();
    var minWidth, minHeight, consideringSize = .7;
    var sourceList = this.getProperty("source").split(",");
    var sourcetype = this.getProperty("sourcetype");
    var width = this.getProperty("width");
    var height = this.getProperty("height");
    var minwidth = this.getProperty("minwidth");
    var minheight = this.getProperty("minheight");
    var maxwidth = this.getProperty("maxwidth");
    var maxheight = this.getProperty("maxheight");
    var margin = this.getProperty("margin");
    var autosubmit = this.getProperty("autosubmit");
    var autoplay = this.getProperty("autoplay");
    var videoalign = this.getProperty("videoalign");
    var hidenext = this.getProperty("hidenext");
    var controls = this.getProperty("controls");
    var videotype = this.getProperty("videotype");
    var sliderplaybutton = this.getProperty("sliderplaybutton");
    var aspectratio = this.getProperty("aspectratio");
    var imageposter = this.getProperty("imageposter");
    var playcount = this.getProperty("playcount");
    var skipdetection = this.getProperty("skipdetection");
    var skipdetectionmessage = this.getProperty("skipdetectionmessage");
    var playcountmessage = this.getProperty("playcountmessage");
    var audiosourcetype = this.getProperty("audiosourcetype");
	
    var fileNames = [];

    if (!controls || !sliderplaybutton)
        autoplay = true;
    if (hidenext)
        pageLayout.next.hide();

    if (skipdetection == true && filetype == 'video' && videotype == 'normal')
        pageLayout.next.hide();

    if (videotype == 'slider')
        controls = false;

    this.componentContainer = $('<div>').addClass('qcContainer').attr('id', 'qc_' + this.questionFullName);
    this.componentContainer.append(this.nativeContainer.find(".question-text").clone());
    this.nativeContainer.after(this.componentContainer);

    if (filetype == 'audio') {
        this.media = $('<audio preload="true" ' + (autoplay ? 'autoplay' : '') + ' id="HTML_Audio_' + this.questionFullName + '" poster="' + imageposter + '"> <source src="' + sourceList[0] + '" type="' + audiosourcetype + '"></audio>');
		this.audioContainer = $('<div id="audioplayer"><a id="pButton" class="play"></a><div id="timeline"><div id="playhead"></div></div></div>');		
		this.videoContainer = $('<div class="col-sm-12 video-wrapper VID_Contaier_' + this.questionFullName + '" style="text-align:' + videoalign + ';">').append(this.media);		
		this.media.after(this.audioContainer);		
        var pButton = this.audioContainer.find('#pButton'); // play button
        var playhead = this.audioContainer.find('#playhead'); // playhead
        var timeline = this.audioContainer.find('#timeline'); // timeline
        
        pButton.on( "click", playAudio );
		var audioDuration = this.media.get(0).duration;

    } else {
        this.media = $('<video ' + (controls ? 'controls' : '') + ' ' + (autoplay ? 'autoplay' : '') + ' id="HTML_VID_' + this.questionFullName + '" poster="' + imageposter + '"> <source src="' + sourceList[0] + '" type="' + sourcetype + '"></video>');
		this.videoContainer = $('<div class="col-sm-12 video-wrapper VID_Contaier_' + this.questionFullName + '" style="text-align:' + videoalign + ';">').append(this.media);
    }
    
    this.componentContainer.append(this.videoContainer);
	
	if (filetype == 'audio') {
		var timelineWidth = timeline.width() - playhead.width();
	}
    var media = this.media,
        that = this,
        slider = "",
        skipCount = 0;
		that.skipped = false;
        that.activeVideo = 0;
		that.currentPlayCount = 0;
    that.output = "";
	that.onTimeNormalData = [];
	that.onTimeSliderData = {};
	that.currentVideoDuration = 0;
	that.currentVideo = null;
    //Slider UI setup
    if (videotype == 'slider') {
        var sliderstarttext = this.getProperty("sliderstarttext");
        var sliderendtext = this.getProperty("sliderendtext");
        var slidermiddletext = this.getProperty("slidermiddletext");
        var sliderdefaultvalue = this.getProperty("sliderdefaultvalue");
        var sliderminimumvalue = this.getProperty("sliderminimumvalue");
        var slidermaximumvalue = this.getProperty("slidermaximumvalue");
        var slidermovestep = this.getProperty("slidermovestep");
        var sliderheight = this.getProperty("sliderheight");

        slider = $("<div id='slider' style='height:" + sliderheight + "px;'/>");
        slider.append($("<div id='slider-ui'  style='height:1.1em;'>"));
        slider.append($("<span id='min' class='tick' style='left:15%;'>").text(sliderstarttext));
        slider.append($("<span id='mid' class='tick' style='left:50%;'>").text(slidermiddletext));
        slider.append($("<span id='max' class='tick' style='left:85%;'>").text(sliderendtext));
        media.after(slider);

        var playBtn = $("<div id='playBtn' class='playBtnClass'>").css({
            "margin-top": "-7px",
            "bottom": (sliderheight - 1) + "px"
        });
        $(playBtn).bind("click", playSliderVideo)
        playBtn.append($("<img id='playIcon' class='playIconClass' src='" + pageLayout.themePath + "se/images/dummy.gif' width='1' height='1'>"));
        playBtn.append($("<span id='playText' class='playTextClass'>"));
        slider.after(playBtn);


        $("#slider-ui").slider({
            range: "min",
            value: sliderdefaultvalue,
            min: sliderminimumvalue,
            max: slidermaximumvalue,
            step: slidermovestep,
            slide: function(event, ui) {
                return false;
            }
        });
    }

    //update responsive setup for media component
    updateDimensions(media);
    $(window).resize(function() {
        updateDimensions(media);
    });
	

    //Video ended event	
    media.on('ended', function() {
		console.log("ended");
        that.activeVideo++;
        if (videotype == 'slider') {			
            that.sliderDataCalculation(this.duration);
        } else if (skipdetection) {
            that.skipdetectionCalculation(this);
        } else {
            that.output = that.output.replace("Watching video,", "Watched video,");
        }

        if (that.activeVideo <= sourceList.length) {
            if (that.activeVideo == sourceList.length) {
                playlistEnded();
            } else {
                this.src = sourceList[that.activeVideo];
                this.play();
				if(filetype=='audio')
					pButton.removeClass("play").removeClass("pause").addClass("pause");
            }

        }
		
    });

    // Video ontime update event 
    media.on('timeupdate', function() {
        if (videotype == 'slider') {
			that.currentVideoDuration = this.currentTime;
            var sliderVal = $("#slider-ui").slider('value');
            that.onTimeSliderData[this.currentTime] = sliderVal;
        }
        if (skipdetection) {
            that.onTimeNormalData.push(Math.floor(this.currentTime));
        }
		if(filetype=='audio'){
			var playPercent = timelineWidth * (this.currentTime / audioDuration);
            playhead.css("margin-left",playPercent + "px");
            if (this.currentTime == audioDuration) {
                pButton.removeClass("play").removeClass("pause").addClass("play");
            }
		}

    });

    media.on('play', function() {
		console.log("play");
		that.currentVideo = this;
        that.componentContainer.find('.mrErrorText').remove();
        if (videotype == 'slider') {
            $(".bt-play").addClass("hide-play");
            $("#slider-ui").slider({
                slide: function(event, ui) {
                    return true;
                }
            });
        } else {
            that.output += "Watching video,"
        }
		if(filetype=='audio' && autoplay === true)
			pButton.removeClass("play").removeClass("pause").addClass("pause");
    });
	
	media.on('canplaythrough', function() {
		console.log("canplaythrough");
        if(filetype=='audio'){
			audioDuration = this.duration;
		}
    });
	
	function playAudio() {
			
		
            if (media.get(0).paused) {
                media.get(0).play();
				pButton.removeClass("play").removeClass("pause").addClass("pause");
            } else { // pause music
                media.get(0).pause();
				pButton.removeClass("play").removeClass("pause").addClass("play");
            }
        }

    function playerReset() {
        that.skipped = false;
        that.activeVideo = 0;
        media.get(0).src = sourceList[0];
        media.get(0).pause();
        media.get(0).currentTime = 0;
        media.get(0).load();
    }


    //Playlist last video ended
    function playlistEnded() {
        if (skipdetection) {
            if (that.skipped) {
                that.componentContainer.find('.mrErrorText').remove();
                that.componentContainer.find('.mrQuestionText').before("<span class=\"mrErrorText\">" + skipdetectionmessage + "<br/></span>");

                skipCount++;
                if (skipCount >= 2) {
                    that.output = "Watched Entire Video(s): false; User: disqualified";
                    pageLayout.next.click();
                }

            } else {
                that.currentPlayCount++;
            }

            if (that.currentPlayCount < playcount) {
                if (that.skipped == false) {
                    that.componentContainer.find('.mrErrorText').remove();
                    that.componentContainer.find('.mrQuestionText').before("<span class=\"mrErrorText\" style='color:blue;'>" + playcountmessage + "<br/></span>");
                }
                playerReset();
            } else {
                pageLayout.next.show();
                that.output += "Watched Entire Video(s): true;";
            }
        }
        if (autosubmit)
            pageLayout.next.click();
        if (hidenext)
            pageLayout.next.show();
    }

    // Slider media play btn event
    function playSliderVideo() {
        media.get(0).play();
        $("#playBtn").hide();
    }

    //update responsive setup for media and Slider components
    function updateDimensions(media) {
        var winWidth = window.innerWidth || document.documentElement.clientWidth;
        var winHeight = window.innerHeight || document.documentElement.clientHeight;

        height = Math.floor(winHeight * consideringSize);
        width = Math.floor(winWidth * consideringSize);

        var ratios = aspectratio.indexOf(":") > 0 ? aspectratio.split(":") : [16, 9];
        ratio = ratios[0] / ratios[1];
        if (ratio >= 1) {
            height = Math.floor(width / ratio);
        } else {
            width = Math.floor(height / ratio);
        }

        //cannot be less than minimum values
        if (width < minWidth) {
            width = minWidth;
            height = Math.floor(width / ratio);
        }

        if (height < minHeight) {
            height = minHeight;
            width = Math.floor(ratio * height);
        }
		if(filetype == 'video'){
			media.css({
				"max-width": Math.min(maxwidth, width),
				"max-height": Math.min(maxheight, height),
				"width": width,
				"height": height,
				"min-width": minwidth,
				"min-height": minheight,
				"margin": margin
			});

			if (videotype == 'slider') {
				slider.css({
					"max-width": Math.min(maxwidth, width),
					"margin": "auto"
				});
			}
		}else{
			
		}
    }

    this.nativeContainer.hide();
}

mediaplayer.prototype.sliderDataCalculation = function(videoLength) {	

    var sliderInterval = this.getProperty("ratinginterval");
	var that = this;
	var eachVideoData = '';
        var i = 0;
        var sumInterval = 0;
        do {
            var lookup = lowerKeyFinder(that.onTimeSliderData);
            eachVideoData = eachVideoData + ',' + Math.floor(i) + "$" + that.onTimeSliderData[lookup(i)];

            i = (sumInterval + sliderInterval) / 1000;
            sumInterval = sumInterval + sliderInterval;

        } while (i <= Math.floor(videoLength));

        while (eachVideoData.charAt(0) === ',')
            eachVideoData = eachVideoData.slice(1);
        that.output += '~' + eachVideoData

        while (that.output.charAt(0) === '~')
            that.output = that.output.slice(1);

        // Reset data after calculation
        that.onTimeSliderData = {};
        videoLength = 0;
}

mediaplayer.prototype.skipdetectionCalculation = function(currentVideo) {
	var sourceList = this.getProperty("source").split(",");
	var that = this;
	that.output += "Current Play Count:" + (that.currentPlayCount + 1) + ";";
        var duplessData = [];
        $.each(that.onTimeNormalData, function(i, el) {
            if ($.inArray(el, duplessData) === -1) duplessData.push(el);
        });
        var withoutDup = parseInt(duplessData.length);
        var videoDuration = parseInt(Math.floor(currentVideo.duration));
        that.output += "Total Video Length: " + videoDuration + "sec;";

        var fileNameArray = sourceList[that.activeVideo - 1].split("/");
        var filenameSplit = (fileNameArray[fileNameArray.length - 1]).split(".");

        if (withoutDup < videoDuration) {
            that.skipped = true;
            that.output += "Watched Video " + filenameSplit[0] + " Length: " + withoutDup + "sec;";
            that.onTimeNormalData.length = 0;

            that.output += "Check Markers: false;";
            for (var c = 0; c < videoDuration; c++) {
                if (duplessData.indexOf(c) == "-1") {
                    that.output += "M" + (c + 1) + ":" + "0; ";
                } else {
                    that.output += "M" + (c + 1) + ":" + "1; ";
                }
            }
        } else {
            that.output += "Watched Video " + filenameSplit[0] + " Length: " + (withoutDup - 1) + "sec;";
            that.output += "Check Markers: true;";
            for (var c = 0; c < videoDuration; c++) {
                if (duplessData.indexOf(c) == "-1") {
                    that.output += "M" + (c + 1) + ":" + "0; ";
                } else {
                    that.output += "M" + (c + 1) + ":" + "1; ";
                }
            }

            that.onTimeNormalData.length = 0;
        }
}

    //Find very nearest value
    var lowerKeyFinder = function(prices) {
        var keys = Object.keys(prices);
        keys.sort(function(a, b) {
            return a - b;
        });

        return function(val) {
            var maxKey = -1;
            for (var i = 0, len = keys.length; i < len; i++) {
                if (maxKey <= 0 || keys[i] <= val) {
                    maxKey = Math.max(maxKey, keys[i]);
                }
            }
            return maxKey;
        };
    };
	
mediaplayer.prototype.toolOptions = function() {
    // $.extend(this.options, eval("this.options." + mediaplayer.prototype.type()));

    return {
        'filetype': 'video',
        'autoplay': false,
        'autosubmit': false,
        'controls': true,
        'hidenext': false,
        'source': "",
        'sourcetype': "video/mp4",
		'audiosourcetype': "audio/mp3",
        'maxwidth': 800,
        'maxheight': 450,
        'minwidth': 160,
        'minheight': 90,
        'width': 800,
        'height': 450,
        'margin': 36,
        'imageposter': "",
        'aspectratio': "16:9",
        'videoalign': 'center',
        'playcount': 1,
        'playcountmessage': "We would like you to watch the video one more time.",
        'skipdetection': false,
        'skipdetectionmessage': "The video wasn't watched in full, please play it again",
        'videotype': 'normal',
        'ratinginterval': 500,
        'sliderminimumvalue': -50,
        'slidermaximumvalue': 50,
        'sliderdefaultvalue': 0,
        'slidermovestep': 1,
        'sliderstarttext': "Boring",
        'sliderendtext': "Interesting",
        'slidermiddletext': "Neither interesting nor boring",
        'slidercontrols': false,
        'sliderplaybutton': true,
        'sliderheight': 96,
		'audioplayerwidth':254,
		'audioplayerprogress':212
    }

}