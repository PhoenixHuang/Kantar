function JWPlayer() {

    var properties, playerInstance, totalVideos, timeInterval;
    var playlist = [];
    var width, height, minWidth, minHeight, consideringSize = .7;
    var ratio, output = '';
    var container = $("#videocontainer");
    var playerpopup, slider, playerdiv, sliderInterval, currentPLIndex = 0;
    var onTimeSliderData = {};
    var onTimeNormalData = [];
    var skipped = false;
    var fileNames = [];
    var customplayimage, ffVideo = false,
        currentPlayCount = 0,
        skipCount = 0;
    var device = pageLayout.deviceType.toUpperCase();
    var normalVideoOutput = "";

    if (device == "LARGETABLET" || device == "MEDIUMTABLET" || device == "SMALLTABLET" || device == "SMARTPHONETOUCH") {
        buttonWidth = 128;
        bufferFont = 30;
        playButtonPath = pageLayout.themePath + "se/images/mobile/play.png";
        pauseButtonPath = pageLayout.themePath + "se/images/mobile/pause.png";
    } else {
        buttonWidth = 64;
        bufferFont = 14;
        playButtonPath = pageLayout.themePath + "se/images/play.png";
        pauseButtonPath = pageLayout.themePath + "se/images/pause.png";
    }

    function init(props) {
        properties = props;
        initialize();

        if (properties.filetype == 'audio') {


            playerpopup = $("<div class='player-skin'/>");
            customplaybutoon = $("<div style='text-align: center;'/>");
            customplayimage = $("<div style='height: " + buttonWidth + "px; width:" + buttonWidth + "px; margin: auto; background: url(" + playButtonPath + ");'/>");
            customplaybutoon.append(customplayimage);
            $(customplayimage).bind("click", playPauseAudio)
            playerdiv = $("<div id='" + properties.playername + "' class='videoplayer' readonly='true'/>");
            playerpopup.append(playerdiv);
            container.append(playerpopup);
            playerpopup.append(customplaybutoon);
            playerpopup.center(properties.width);
            playerpopup.append('<div class="loading"><div class="spinner"><div class="message" style="font-size:' + bufferFont + 'px;">' + properties.buffertext + '</div></div></div>');
            //Slider
            if (properties.videotype == 'slider') {
                updateSlider();
            } else {
                //if there are no controls, then video to play automatically 
                if (!properties.controls) {
                    //properties.autoplay = true
                    properties.primary = 'html5'
                }
                //if auto play is not enable controls must be enabled
                if (!properties.autoplay) {
                    properties.controls = true
                }

                if (properties.autoplay) {
                    if (device == "LARGETABLET" || device == "MEDIUMTABLET" || device == "SMALLTABLET" || device == "SMARTPHONETOUCH") {
                        customplayimage.css("background", "url(" + playButtonPath + ")");
                    } else {
                        customplayimage.css("background", "url(" + pauseButtonPath + ")");
                    }

                }

            }

            setAudioProperties();
            startAudio();

        } else {

            playerpopup = $("<div class='player-skin'/>");
            playerdiv = $("<div id='" + properties.playername + "' class='videoplayer' readonly='true'/>");
            playerpopup.append(playerdiv);
            container.append(playerpopup);
            playerpopup.center(properties.width);
            playerpopup.append('<div class="loading"><div class="spinner"><div class="message" style="font-size:' + bufferFont + 'px;">' + properties.buffertext + '</div></div></div>');
            //Slider
            if (properties.videotype == 'slider') {
                sliderInterval = properties.ratinginterval;
                updateSlider();
            } else {
                //if there are no controls, then video to play automatically 
                if (!properties.controls) {
                   // properties.autoplay = true
                }
            }
            setProperties();
            startvideo();


        }
    }

    $(document).on('click', '.bt-play', function() {
        $(".bt-play").addClass("hide-play");
        playerInstance.play(true);
    });

    function initialize() {
        $('.question-component').css('padding-bottom', '2.9375rem');
        output = '';
        onTimeSliderData = {};
        onTimeNormalData = [];
        totalVideos = properties.source.split(",");
        //Code for Hide next button
        if (properties.hidenext)
            pageLayout.next.hide();

        //Code for Play Countr
        if (properties.playcount > 1 && properties.videotype == 'normal') {
            pageLayout.next.hide();

            //pageLayout.prev.before("<div class='tempDiv'>&nbsp;</div>");
            pageLayout.prev.hide();
        }
        //Close code for Play Countr
    }

    $.fn.center = function(playerwidth) {
        this.css({
            "text-align": "center",
            "margin": "auto"
        });
        return this;
    }


    function setProperties() {

        for (ii = 0; ii < totalVideos.length; ii++) {
            var source = {
                "image": properties.image,
                "sources": []
            };
            var url = totalVideos[ii];

            url = url.substring(url.toLowerCase().indexOf(properties.urlcheck+"/"));
            var fileNameArray = url.split("/");
            var filenameSplit = (fileNameArray[fileNameArray.length - 1]).split(".");
            fileNames.push(filenameSplit[0]);

            var initialtype = url.replace(/^.*\.([0-9a-z]+)$/i, "$1");

            var checkMultimedia = url.toLowerCase().indexOf(properties.urlcheck+"/");

            if (checkMultimedia < 0) {
                if (properties.othercdn) {
                    url = url.replace('https://', '');
                    url = url.replace('http://', '');
                    if (window.location.protocol == "https:") {
                        if (url.indexOf("https:") < 0) {
                            url = 'https://' + url
                        }
                    } else {
                        if (url.indexOf("http:") < 0) {
                            url = 'http://' + url
                        }
                    }

                    source["sources"].push({
                        "file": url
                    });
                } else {
                    url = url.replace('https://', '');
                    url = url.replace('http://', '');
					if(url.indexOf(properties.port+"/") != -1){
						url = (url.split(properties.port+"/"))[1];
					}
					
                    //HLS link
                    if (window.location.protocol == "https:") {

                        source["sources"].push({
                            "file": "https://"+properties.cdndomain+"/"+properties.hlsport+"/" + url + ".m3u8"

                        });

                    } else {
                        source["sources"].push({
                            "file": "http://"+properties.cdndomain+"/"+properties.hlsport+"/" + url + ".m3u8"

                        });
                    }

                    //Normal MP4 link
                    if (window.location.protocol == "https:") {
                        source["sources"].push({
                            "file": "https://"+properties.cdndomain+"/"+properties.port+"/" + url
                        });
                    } else {
                        source["sources"].push({
                            "file": "http://"+properties.cdndomain+"/"+properties.port+"/" + url
                        });
                    }
                }
            } else {

                if (properties.othercdn) {
                    if (window.location.protocol == "https:") {
                        source["sources"].push({
                            "file": properties.othercdnurl + url

                        });
                    } else {
                        source["sources"].push({
                            "file": properties.othercdnurl + url

                        });
                    }

                } else {
                    //HLS link
                    if (window.location.protocol == "https:") {

                        source["sources"].push({
                            "file": "https://"+properties.cdndomain+"/"+properties.hlsport+"/"+properties.origindomain+"/" + url + ".m3u8"

                        });
                    } else {
                        source["sources"].push({
                            "file": "http://"+properties.cdndomain+"/"+properties.hlsport+"/"+properties.origindomain+"/" + url + ".m3u8"

                        });
                    }

                    //Normal MP4 link
                    if (window.location.protocol == "https:") {
                        source["sources"].push({
                            "file": "https://"+properties.cdndomain+"/"+properties.port+"/"+properties.origindomain+"/" + url
                        });
                    } else {
                        source["sources"].push({
                            "file": "http://"+properties.cdndomain+"/"+properties.port+"/"+properties.origindomain+"/" + url
                        });
                    }
                }
            }



            playlist.push(source);
        }

        width = properties.width;
        height = properties.height;


        updateDimensions();
    }

    function setAudioProperties() {
        totalAudios = properties.source.split(",")

        for (ii = 0; ii < totalAudios.length; ii++) {
            var source = {
                "image": properties.image,
                "sources": []
            };
            var url = totalAudios[ii];
            url = url.substring(url.toLowerCase().indexOf(properties.urlcheck+"/"));

            var fileNameArray = url.split("/");
            var filenameSplit = (fileNameArray[fileNameArray.length - 1]).split(".");
            fileNames.push(filenameSplit[0]);

            var initialtype = url.replace(/^.*\.([0-9a-z]+)$/i, "$1");

            var checkMultimedia = url.toLowerCase().indexOf(properties.urlcheck+"/");

            if (checkMultimedia < 0) {
                if (properties.othercdn) {
                    url = url.replace('https://', '');
                    url = url.replace('http://', '');
                    if (window.location.protocol == "https:") {
                        if (url.indexOf("https:") < 0) {
                            url = 'https://' + url
                        }
                    } else {
                        if (url.indexOf("http:") < 0) {
                            url = 'http://' + url
                        }
                    }

                    source["sources"].push({
                        "file": url
                    });
                } else {
                    url = url.replace('https://', '');
                    url = url.replace('http://', '');
					if(url.indexOf(properties.port+"/") != -1){
						url = (url.split(properties.port+"/"))[1];
					}
                    //Normal MP4 link
                    if (window.location.protocol == "https:") {
                        source["sources"].push({
                            "file": "https://"+properties.cdndomain+"/"+properties.port+"/" + url
                        });
                    } else {
                        source["sources"].push({
                            "file": "http://"+properties.cdndomain+"/"+properties.port+"/" + url
                        });
                    }
                }
            } else {

                if (properties.othercdn) {
                    if (window.location.protocol == "https:") {
                        source["sources"].push({
                            "file": properties.othercdnurl + url

                        });
                    } else {
                        source["sources"].push({
                            "file": properties.othercdnurl + url

                        });
                    }

                } else {
                    //Normal MP4 link
                    if (window.location.protocol == "https:") {
                        source["sources"].push({
                            "file": "https://"+properties.cdndomain+"/"+properties.port+"/"+properties.origindomain+"/" + url
                        });
                    } else {
                        source["sources"].push({
                            "file": "http://"+properties.cdndomain+"/"+properties.port+"/"+properties.origindomain+"/" + url
                        });
                    }
                }
            }


            playlist.push(source);
        }

        width = properties.width;
        height = properties.height;


        updateDimensions();
    }

    function updateSlider() {
        slider = $("<div id='slider'/>");
        slider.append($("<div id='slider-ui' style='height:1.1em;'>"));
		if (properties.sliderplaybutton) {
            var playBtn = $("<div id='playBtn' class='playBtnClass'>").css("margin-top", "-12px");
            $(playBtn).bind("click", playSliderVideo)
            playBtn.append($("<img id='playIcon' class='playIconClass' src='" + pageLayout.themePath + "se/images/dummy.gif' width='1' height='1'>"));
            playBtn.append($("<span id='playText' class='playTextClass'>"));
            slider.append(playBtn);
        } else {
            if (!properties.controls) {
                properties.autoplay = true
            }
        }

        slider.append($("<div id='min' class='slidertext' style='text-align:left'>").text(properties.sliderstarttext));
        slider.append($("<div id='mid' class='slidertext'>").text(properties.slidermiddletext));
        slider.append($("<div id='max' class='slidertext' style='text-align:right'>").text(properties.sliderendtext));
        container.after(slider);
        
        $("#slider-ui").slider({
            range: "min",
            value: properties.sliderdefaultvalue,
            min: properties.sliderminimumvalue,
            max: properties.slidermaximumvalue,
            step: properties.slidermovestep,
            slide: function(event, ui) {
                return false;
            }
        });
    }

    function updateDimensions() {

		container.css({
            "width": properties.width + "%",
            "height": properties.height + "px"
        });
		
        if (properties.videotype == 'slider') {
            slider.css({
                "width": properties.width + "%",
                "margin-top": 15,
                "margin-left": 15
            });
            slider.center(Math.min(width, properties.width));
        }
        if (properties.filetype == 'audio') {
            //$('#' + properties.playername + '_wrapper').css( "width", width+"px" );
            $('#' + properties.playername + '_wrapper').width(width);
            $('#' + properties.playername).width(width);
        }
    }


    function sliderDataCalculation(videoLength) {
        if (properties.developermode) {
            console.log('Complete Ontime Object: ' + JSON.stringify(onTimeSliderData));
        }

        var eachVideoData = '';
        var i = 0;
        var sumInterval = 0;
        do {
            var lookup = lowerKeyFinder(onTimeSliderData);
            eachVideoData = eachVideoData + ',' + Math.floor(i) + "$" + onTimeSliderData[lookup(i)];

            i = (sumInterval + sliderInterval) / 1000;
            sumInterval = sumInterval + sliderInterval;

        } while (i <= Math.floor(videoLength));

        while (eachVideoData.charAt(0) === ',')
            eachVideoData = eachVideoData.slice(1);
        output = output + '~' + eachVideoData

        while (output.charAt(0) === '~')
            output = output.slice(1);
        if (properties.developermode) {
            console.log('Complete Output' + output);
        }

        // Reset data after calculation
        onTimeSliderData = {};
        videoLength = 0;
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

    function startAudio() {

        playerInstance = jwplayer(properties.playername).setup({
            'playlist': playlist,
            'controls': false,
			'visualplaylist':properties.visualplaylist,
			'nextUpDisplay':properties.nextUpDisplay,
			'preload': properties.preload,
            'aspectratio': properties.aspectratio,
            'primary': properties.primary,
            'stretching': properties.stretching,
            'image': properties.image,
            'rtmp': {
                'subscribe': properties.rtmpsubscribe,
                'bufferlength': properties.rtmpbufferlength
            },
            'width': properties.width,
            'height': properties.height,
            'autostart': properties.autoplay,
            'fallback': properties.fallback,
            'skin': properties.skin,
            'androidhls': properties.androidhls,
            'backcolor': '666666',
            'frontcolor': 'FFFFFF',
            'lightcolor': 'FFFFFF',
            'screencolor': '0f0f0f'
        });
		jwplayer(properties.playername).on('play', function(event) {
                onPlayAudio();
            });
            jwplayer(properties.playername).on('playlistItem', function(event) {
                onPlaylistItem(event.index);
            });
            jwplayer(properties.playername).on('complete', function(event) {
                onComplete();
            });
		jwplayer(properties.playername).on('time', function(event) {
                onTimeNormalVideo(event);
            });
    }

    function startvideo() {
        skipped = false;
        playerInstance = jwplayer(properties.playername).setup({
            'playlist': playlist,
			'visualplaylist':properties.visualplaylist,
			'nextUpDisplay':properties.nextUpDisplay,
			'preload': properties.preload,
            'controls': properties.controls,
            'aspectratio': properties.aspectratio,
            'primary': properties.primary,
            'stretching': properties.stretching,
            'image': properties.image,
            'rtmp': {
                'subscribe': properties.rtmpsubscribe,
                'bufferlength': properties.rtmpbufferlength
            },
            'width': "100%",
			'height': properties.height,
            'autostart': properties.autoplay,
            'fallback': properties.fallback,
            'skin': properties.skin,
            'androidhls': properties.androidhls,
            'backcolor': '666666',
            'frontcolor': 'FFFFFF',
            'lightcolor': 'FFFFFF',
            'screencolor': '0f0f0f'
        });
        if (properties.videotype == 'slider') {
            jwplayer(properties.playername).on('play', function(event) {
                onPlaySlider();
            });
            jwplayer(properties.playername).on('time', function(event) {
                onTimeSliderVideo(event);
            });
            jwplayer(properties.playername).on('playlistItem', function(event) {
                onPlaylistItem(event.index);
            });
            jwplayer(properties.playername).on('complete', function(event) {
                onComplete();
            });
        } else {
            jwplayer(properties.playername).on('ready', function(event) {
                onReadyNormal();
            });
            jwplayer(properties.playername).on('play', function(event) {
                onPlayNormal();
            });
            jwplayer(properties.playername).on('playlistItem', function(event) {
                onPlaylistItem(event.index);
            });
            jwplayer(properties.playername).on('time', function(event) {
                onTimeNormalVideo(event);
            });
            jwplayer(properties.playername).on('complete', function(event) {
                onComplete();
            });
        }

    }

    function onReadyNormal() {
		
        if (properties.skipdetection || properties.controls == false) {
            $('.jw-display-icon-display').css("display", "none");
            $('#bt-play').attr("class", "bt-play");
            $('#bt-play').prop("class", "bt-play");
        }

    }

    function onPlayAudio() {
        customplayimage.css("background", "url(" + pauseButtonPath + ")");
		properties.componentContainer.find('.mrErrorText').remove();
        timeInterval = window.setInterval(checkBuffering, 100);
    }

    function onPlayNormal() {
		$('html, body').animate({
			scrollTop: (container.offset().top)
		},500);
        $(".bt-play").addClass("hide-play");
        properties.componentContainer.find('.mrErrorText').remove();
        timeInterval = window.setInterval(checkBuffering, 100);
    }

    function onPlaySlider() {
		$('html, body').animate({
			scrollTop: (container.offset().top)
		},500);
        $(".bt-play").addClass("hide-play");
        $("#slider-ui").slider({
            slide: function(event, ui) {
                return true;
            }
        });
        timeInterval = window.setInterval(checkBuffering, 100);
    }

    function onPlaylistItem(currentIndex) {
        currentPLIndex = currentIndex;
        if (properties.videotype == 'slider') {
            counter = 0;
        }

    }

    function onComplete() {
        window.clearInterval(timeInterval);
        if (properties.filetype == 'audio') {
            customplayimage.css("background", "url(" + playButtonPath + ")");
        }

        //Slider data calculation in onComplete
        if (properties.filetype == 'video' && properties.videotype == 'slider') {
            var videoLength = jwplayer(properties.playername).getDuration();
            sliderDataCalculation(videoLength);
        }

        //Code for Play Count
        if (properties.videotype == 'normal') {
            if (properties.skipdetection) {
                //Code for skip detection
                normalVideoOutput += "Current Play Count:" + (currentPlayCount + 1) + ";";
                var duplessData = [];
                $.each(onTimeNormalData, function(i, el) {
                    if ($.inArray(el, duplessData) === -1) duplessData.push(el);
                });
                var withoutDup = parseInt(duplessData.length);

                var videoDuration = parseInt(Math.floor(jwplayer(properties.playername).getDuration()));
                normalVideoOutput += "Total "+ properties.filetype + " Length: " + videoDuration + "sec;";

                if (withoutDup < videoDuration) {

                    skipped = true;

                    normalVideoOutput += "Watched "+ properties.filetype + " " + fileNames[currentPLIndex] + " Length: " + withoutDup + "sec;";
                    onTimeNormalData.length = 0;

                    normalVideoOutput += "Check Markers: false;";
                    for (var c = 0; c < videoDuration; c++) {
                        if (duplessData.indexOf(c) == "-1") {
                            normalVideoOutput += "M" + (c + 1) + ":" + "0; ";
                        } else {
                            normalVideoOutput += "M" + (c + 1) + ":" + "1; ";
                        }
                    }
                } else {
                    normalVideoOutput += "Watched "+ properties.filetype + " " + fileNames[currentPLIndex] + " Length: " + (withoutDup - 1) + "sec;";
                    normalVideoOutput += "Check Markers: true;";
                    for (var c = 0; c < videoDuration; c++) {
                        if (duplessData.indexOf(c) == "-1") {
                            normalVideoOutput += "M" + (c + 1) + ":" + "0; ";
                        } else {
                            normalVideoOutput += "M" + (c + 1) + ":" + "1; ";
                        }
                    }

                    onTimeNormalData.length = 0;
                }

                if (totalVideos.length == (currentPLIndex + 1)) {

                    if (skipped) {
                        properties.componentContainer.find('.mrErrorText').remove();
                        properties.componentContainer.find('.mrQuestionText').before("<span class=\"mrErrorText\">" + properties.skipdetectionmessage + "<br/></span>");

                        skipCount++;
                        if (skipCount >= 2) {
                            normalVideoOutput = "Watched Entire "+ properties.filetype + " " + currentPLIndex + ": false; User: disqualified";
                            pageLayout.next.click();
                        }

                    } else {
                        currentPlayCount++;
                    }
                    playCountFunction();
                }

            } else {
                if (totalVideos.length == (currentPLIndex + 1)) {
                    currentPlayCount++;
                    playCountFunction();
                }
            }
        } else {
            if (currentPLIndex === jwplayer(properties.playername).getPlaylist().length - 1) {
                //Close code for Play Countr
                doSubmit();
            }
        }

    }

    function onTimeSliderVideo(eve) {
        var sliderVal = $("#slider-ui").slider('value');
        var pos = eve.position;
        if (properties.developermode) {
            console.log(pos + ' -- ' + sliderVal);
        }
        onTimeSliderData[pos] = sliderVal;
    }

    function onTimeNormalVideo(eve) {
        onTimeNormalData.push(Math.floor(eve.position));
    }

    function playSliderVideo() {
        playerInstance.play(true);
        document.getElementById("playBtn").style.visibility = "hidden";
    }


    function doSubmit() {

        if (properties.hidenext)
            pageLayout.next.show();

        if (properties.autosubmit)
            pageLayout.next.click();

    }

    function getData() {
        var state = jwplayer(properties.playername).getState();
        var elapsed = jwplayer(properties.playername).getPosition();
        if (state == 'PLAYING' || state == 'playing') {
            sliderDataCalculation(elapsed)
        }
        if (properties.videotype == 'normal' && properties.skipdetection) {
            output = normalVideoOutput + output;
        } else if (properties.videotype == 'normal') {
            output = "Normal video";
        }
        return output;
    }

    // Audio events
    function playPauseAudio() {
        var state = jwplayer(properties.playername).getState();
        if (state == 'PLAYING' || state == 'playing') {
            playerInstance.pause(true);
            customplayimage.css("background", "url(" + playButtonPath + ")");
        } else {
            playerInstance.play(true);
            customplayimage.css("background", "url(" + pauseButtonPath + ")");
        }

    }

    function playCountFunction() {
        if (currentPlayCount < properties.playcount) {
            if (skipped == false) {
                properties.componentContainer.find('.mrErrorText').remove();
                properties.componentContainer.find('.mrQuestionText').before("<span class=\"mrErrorText\" style='color:blue;'>" + properties.playcountmessage + "<br/></span>");
            }
			if(properties.filetype == "video"){
				startvideo();
			}else if(properties.filetype == "audio"){
				startAudio();
			}
        } else {
            $(".tempDiv").remove();
            if ($('.mrPrev').length > 0) {
                pageLayout.prev.show();
            }
            pageLayout.next.show();
            normalVideoOutput += "Watched Entire "+ properties.filetype + "(s): true;";

            if (properties.autosubmit)
                pageLayout.next.click();
        }
    }

    function checkBuffering() {
        var videoState = jwplayer(properties.playername).getState();
        if (videoState == 'BUFFERING' || videoState == 'buffering') {
            displayBlock();
        } else {
            displayNone();
        }
    }

    function displayBlock() {
        $(".loading").css("display", "block");
    }

    function displayNone() {
        $(".loading").css("display", "none");
    }

    return {
        init: init,
        getData: getData
    }

}