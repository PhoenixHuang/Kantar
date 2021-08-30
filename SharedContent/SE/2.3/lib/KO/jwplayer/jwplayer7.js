function JWPlayer() {

    var properties;
    var playerInstance;
    var inputData;
    var playlist = [];
    var width;
    var height;
    var minWidth;
    var minHeight;
    var consideringSize = .7;
    var ratio;
    var output = '';
    var container = $("#videocontainer");
    var playerpopup;
    var slider;
    var playerdiv;
    var sliderInterval;
    var currentPLIndex = 0;
    var onTimeSliderData = {};
    var customplayimage;
	var device = pageLayout.deviceType.toUpperCase();
	if(device == "LARGETABLET" || device == "MEDIUMTABLET" || device == "SMALLTABLET" || device == "SMARTPHONETOUCH"){
		buttonWidth = 128;
		pauseBtnPos = 130;
		buttonPath = pageLayout.sharedContent + "SE/dev/LAF/Themes/green/1.2/se/images/mobile/play-pause.png";
	}else{
		buttonWidth = 64;
		pauseBtnPos = 65;
		buttonPath = pageLayout.sharedContent + "SE/dev/LAF/Themes/green/1.2/se/images/play-pause.png";
	}

    function init(props) {
        intialize();
        properties = props;

        if (properties.filetype == 'audio') {
            if (properties.hidenext)
                pageLayout.next.hide();

            playerpopup = $("<div class='player-skin'/>");
            customplaybutoon = $("<div style='text-align: center;'/>");
            customplayimage = $("<div style='height: "+buttonWidth+"px; width:"+buttonWidth+"px; margin: auto; background: url(" + buttonPath + ") 0 0;background-position: 0px 0px;'/>");
            customplaybutoon.append(customplayimage);
            $(customplayimage).bind("click", playPauseAudio)
            playerdiv = $("<div id='" + properties.playername + "' class='videoplayer' readonly='true' />");
            playerpopup.append(playerdiv);
            container.append(playerpopup);
            playerpopup.append(customplaybutoon);
            playerpopup.center(properties.width);
            //Slider
            if (properties.videotype == 'slider') {
                updateSlider();
            } else {
                //if there are no controls, then video to play automatically 
                if (!properties.controls) {
                    properties.autoplay = true
                    properties.primary = 'html5'
                }
                //if auto play is not enable controls must be enabled
                if (!properties.autoplay) {
                    properties.controls = true
                }

                if (properties.autoplay) {
                    customplayimage.css("background-position", pauseBtnPos+"px 0px");
                }
				
            }
			
            setAudioProperties();
            startAudio();


        } else {
            if (properties.hidenext)
                pageLayout.next.hide();

            playerpopup = $("<div class='player-skin'/>");
            playerdiv = $("<div id='" + properties.playername + "' class='videoplayer' readonly='true'/>");
            playerpopup.append(playerdiv);
            container.append(playerpopup);
            playerpopup.center(properties.width);
            //Slider
            if (properties.videotype == 'slider') {
                sliderInterval = properties.ratinginterval;
                updateSlider();
            } else {
                //if there are no controls, then video to play automatically 
                if (!properties.controls) {
                    properties.autoplay = true
                }
                //if auto play is not enable controls must be enabled
                if (!properties.autoplay) {
                    properties.controls = true
                }
            }
            setProperties();
            startvideo();
        }
    }

    $.fn.center = function(playerwidth) {
        this.css("position", "absolute");
        if (properties.playerposition.toLowerCase() == "center") {
            this.css("left", (($("#survey").width() - (playerwidth + 30)) / 2) + "px");
        }
        return this;
    }

    function intialize() {
        videoPlaySeq = [];
        videoPlaySeqsArr = [];
        duration = [];
        output = '';
    }

    function setProperties() {
        totalVideos = properties.source.split(",")

        for (ii = 0; ii < totalVideos.length; ii++) {
            var source = {
                "image": properties.image,
                "sources": []
            };
            var url = totalVideos[ii];
            url = url.substring(url.toLowerCase().indexOf("multimedia"));
            var initialtype = url.replace(/^.*\.([0-9a-z]+)$/i, "$1");
            //console.log('Country Code: ' + properties.countryCode);
		
            if (properties.countryCode == "CN") {
                source["sources"].push({
                    "file": "http://cdn.tns-global.com/" + url

                });
            } else {
                //HLS link
                if (window.location.protocol == "https:"){

                source["sources"].push({
                  //  "file": "http://wpc.16f8b.edgecastcdn.net/8316F8B/origin.tns-global.com/" + url + ".m3u8"
				    "file": "https://16f8b.https.cdn.softlayer.net/8316F8B/origin.tns-global.com/" + url + ".m3u8"

                });
				}else{
				 source["sources"].push({
                  //  "file": "http://wpc.16f8b.edgecastcdn.net/8316F8B/origin.tns-global.com/" + url + ".m3u8"
				    "file": "http://16f8b.http.cdn.softlayer.net/8316F8B/origin.tns-global.com/" + url + ".m3u8"

                });
				}

                //RTMP link
                source["sources"].push({
                    "file": "rtmp://fms.16f8b.edgecastcdn.net/8016F8B/origin.tns-global.com/" + url
                });

                //Normal MP4 link
               if (window.location.protocol == "https:"){
                source["sources"].push({
                    "file": "https://16f8b.https.cdn.softlayer.net/8016F8B/origin.tns-global.com/" + url
                });
				}else{
				 source["sources"].push({
                    "file": "http://16f8b.http.cdn.softlayer.net/8016F8B/origin.tns-global.com/" + url
                });
				}
            }


            playlist.push(source);
        }

        width = properties.width;
        height = properties.height;


        updateDimensions();

        $(window).resize(function() {
            updateDimensions();
        });
    }

    function setAudioProperties() {
        totalAudios = properties.source.split(",")

        for (ii = 0; ii < totalAudios.length; ii++) {
            var source = {
                "image": properties.image,
                "sources": []
            };
            var url = totalAudios[ii];
            url = url.substring(url.toLowerCase().indexOf("multimedia"));
            var initialtype = url.replace(/^.*\.([0-9a-z]+)$/i, "$1");

            if (properties.countryCode == "CN") {
                source["sources"].push({
                    "file": "http://cdn.tns-global.com/" + url

                });
            } else {
					if (window.location.protocol == "https:"){
						source["sources"].push({
							"file": "https://16f8b.https.cdn.softlayer.net/8016F8B/origin.tns-global.com/" + url
						});
				   }else{
						source["sources"].push({
							"file": "http://16f8b.http.cdn.softlayer.net/8016F8B/origin.tns-global.com/" + url
						});
				   }            
			   }


            playlist.push(source);
        }

        width = properties.width;
        height = properties.height;


        updateDimensions();

        $(window).resize(function() {
            updateDimensions();
        });
    }

    function updateSlider() {
        slider = $("<div id='slider'/>");
        slider.append($("<div id='slider-ui'  style='height:1.1em;'>"));
        slider.append($("<span id='min' class='tick'>").text(properties.sliderstarttext));
        slider.append($("<span id='mid' class='tick' style='left:50%;'>").text(properties.slidermiddletext));
        slider.append($("<span id='max' class='tick' style='left:100%;'>").text(properties.sliderendtext));
        container.after(slider);
        if (properties.sliderplaybutton) {
            var playBtn = $("<div id='playBtn' class='playBtnClass'>").css("margin-top", "26px");
            $(playBtn).bind("click", playSliderVideo)
            playBtn.append($("<img id='playIcon' class='playIconClass' src='" + pageLayout.themePath + "se/images/dummy.gif' width='1' height='1'>"));
            playBtn.append($("<span id='playText' class='playTextClass'>"));
            slider.after(playBtn);
        } else {
            if (!properties.controls) {
                properties.autoplay = true
            }
        }

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


        var winWidth = window.innerWidth || document.documentElement.clientWidth;
        var winHeight = window.innerHeight || document.documentElement.clientHeight;

        height = Math.floor(winHeight * consideringSize);
        width = Math.floor(winWidth * consideringSize);

        var ratios = properties.aspectratio.indexOf(":") > 0 ? properties.aspectratio.split(":") : [16, 9];
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

        playerpopup.css({
            "max-width": Math.min(properties.maxwidth, properties.width),
            "max-height": Math.min(properties.maxheight, properties.height),
            "width": width,
            "height": height,
            "min-width": properties.minwidth,
            "min-height": properties.minheight,
            "margin-top": 20
        });
        playerpopup.center(Math.min(width, properties.width));
        container.css({
            "height": Math.min(height, properties.height) + 50
        });

        if (properties.videotype == 'slider') {
            slider.css({
                "max-width": Math.min(properties.maxwidth, properties.width),
                "width": width,
                "min-width": properties.minwidth,
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

    function onPlaylistItem(item) {
        currentPLIndex = item.index;
        if (properties.videotype == 'slider') {
            counter = 0;
        }

    }

    function onComplete() {
        // console.log('onComplete');
        if (properties.filetype == 'audio') {
            customplayimage.css("background-position", "0px 0px");
        }
        if (typeof jwplayer(properties.playername).getPlaylistIndex === "function") {
            if (typeof jwplayer(properties.playername).getPlaylist === "function") {
                if (currentPLIndex === jwplayer(properties.playername).getPlaylist().length - 1) {
                    doSubmit();
                }
            }
        }
        if (properties.filetype == 'video') {
            if (properties.videotype == 'slider') {
                var videoLength = jwplayer(properties.playername).getDuration();
                sliderDataCalculation(videoLength);
            }
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

    function doSubmit() {
        if (properties.hidenext)
            pageLayout.next.show();

        if (properties.autosubmit)
            pageLayout.next.click();
    }


    function startAudio() {

        var events = {
            onPlaylistItem: onPlaylistItem,
            onComplete: onComplete
        }

        playerInstance = jwplayer(properties.playername).setup({
            'playlist': playlist,
            'controls': false,
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
            'screencolor': '0f0f0f',
            events: events
        });
    }


    function startvideo() {
        if (properties.videotype == 'slider') {
            var events = {
                onPlay: onPlay,
                onTime: onTime,
                onPlaylistItem: onPlaylistItem,
                onComplete: onComplete
            }
        } else {
            var events = {
                onPlaylistItem: onPlaylistItem,
                onComplete: onComplete
            }
        }

        playerInstance = jwplayer(properties.playername).setup({
            'playlist': playlist,
            'controls': properties.controls,
            'aspectratio': properties.aspectratio,
            'primary': properties.primary,
            'visualplaylist': properties.visualplaylist,
            'stretching': properties.stretching,
            'image': properties.image,
            'rtmp': {
                'subscribe': properties.rtmpsubscribe,
                'bufferlength': properties.rtmpbufferlength
            },
            'width': "100%",
            'autostart': properties.autoplay,
            'fallback': properties.fallback,
            'skin': properties.skin,
            'androidhls': properties.androidhls,
            'backcolor': '666666',
            'frontcolor': 'FFFFFF',
            'lightcolor': 'FFFFFF',
            'screencolor': '0f0f0f',
            events: events
        });
    }

    function onPlay() {
        $("#slider-ui").slider({
            slide: function(event, ui) {
                return true;
            }
        });
    }

    function onTime(event) {
        var sliderVal = $("#slider-ui").slider('value');
        var pos = event.position;
        if (properties.developermode) {
            //console.log(pos + ' -- ' + sliderVal);
        }
        onTimeSliderData[pos] = sliderVal;
    }

    function playSliderVideo() {
        playerInstance.play(true);
        document.getElementById("playBtn").style.visibility = "hidden";
    }

    function getData() {
        var state = jwplayer(properties.playername).getState();
        var elapsed = jwplayer(properties.playername).getPosition();
        if (state == 'PLAYING' || state == 'playing') {
            sliderDataCalculation(elapsed)
        }
        return output;
    }

    // Audio events
    function playPauseAudio() {
        var state = jwplayer(properties.playername).getState();
        if (state == 'PLAYING' || state == 'playing') {
            playerInstance.pause(true);
            customplayimage.css("background-position", "0px 0px");
        } else {
            playerInstance.play(true);
            customplayimage.css("background-position", pauseBtnPos+"px 0px");
        }

    }


    return {
        init: init,
        getData: getData
    }

}