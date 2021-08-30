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
    var time;
    var interval = parseFloat((props.ratinginterval / 1000).toFixed(1));
    var counter = 0;
    var temp = 0;
    var temp1 = 0;

    function init(props) {
        intialize();
        properties = props;

        if (properties.filetype == 'audio') {
			if (properties.hidenext)
                pageLayout.next.hide();

            playerpopup = $("<div class='player-skin'/>");
            playerdiv = $("<div id='" + properties.playername + "' class='videoplayer' readonly='true'/>");
            playerpopup.append(playerdiv);
            container.append(playerpopup);
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
            source["sources"].push({
                 "file": "http://wpc.16f8b.edgecastcdn.net/8316F8B/origin.tns-global.com/" + url + ".m3u8"
              //  "file": "http://wpc.16f8b.edgecastcdn.net/8016F8B/origin.tns-global.com/" + url
            });

            source["sources"].push({
                "file": "rtmp://fms.16f8b.edgecastcdn.net/8016F8B/origin.tns-global.com/" + url 
            });

            source["sources"].push({
                "file": "http://wpc.16f8b.edgecastcdn.net/8016F8B/origin.tns-global.com/" + url
            });

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
            source["sources"].push({
                //"file": "http://wpc.16f8b.edgecastcdn.net/8316F8B/origin.tns-global.com/" + url + ".playlist.m3u8"
                "file": "http://wpc.16f8b.edgecastcdn.net/8016F8B/origin.tns-global.com/" + url
            });

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
            slide: function(event, ui) {}
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
		console.log('onComplete');
        if (typeof jwplayer(properties.playername).getPlaylistIndex === "function") {
            if (typeof jwplayer(properties.playername).getPlaylist === "function") {
                if (currentPLIndex === jwplayer(properties.playername).getPlaylist().length - 1) {
                    doSubmit();
                }
            }
        }
        if (properties.filetype == 'video') {
            if (properties.videotype == 'slider') {
                var playlist = playerInstance.getPlaylist();
                if (playlist.length == currentPLIndex + 1) {
                    output = output
                } else {
                    output = output + '~'
                }
                counter = 0;
            }
        }
    }

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
            'controls': properties.controls,
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
                onTime: onTime,
                onPlaylistItem: onPlaylistItem,
                onComplete: onComplete
            }
        } else {
            var events = {
                //onReady: onReady,
                //onTime: onTime,
                //onPlay: onPlay,
                //onPause: onPause,
                //onDisplayClick: onDisplayClick,
                onPlaylistItem: onPlaylistItem,
                onComplete: onComplete
                    //onError: onError,
                    //onSetupError: onSetupError
            }
        }
        playerInstance = jwplayer(properties.playername).setup({
            'playlist': playlist,
            //file: "http://example.com/myVideo.mp4",
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
            //'height': properties.height,
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

    function onTime(event) {
        //console.log(event.position)
        var time = parseFloat((event.position).toFixed(1));
        if (time != temp) {
            if (time == 0.0 || time == 0.1 || time == 0.2 || time == 0.3) time = 0;
            if (time > temp1) time = temp1
            var sliderVal = $("#slider-ui").slider('value');
            //console.log(time + '==' + counter)
            if (time == counter) {
                if (output == "") {
                    output += Math.floor(time) + '$' + sliderVal;
                } else {
                    output += ',' + Math.floor(time) + '$' + sliderVal;
                }
                counter = counter + interval;
                temp = time;
            }
            temp1 = parseFloat((time + 0.1).toFixed(1));
            //console.log(time +'===='+ temp1)
        }
    }


    function playSliderVideo() {
        playerInstance.play(true);
        document.getElementById("playBtn").style.visibility = "hidden";
    }

    function getData() {
        return output;
    }

    return {
        init: init,
        getData: getData
    }

}