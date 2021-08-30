/**
 * jwcustom class
 * Inherits from SESurveyTool
 * Author: David Albers
 * David.Albers@tnsglobal.com
 * Version 1.01: 20150318
 */
function jwcustom(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}

jwcustom.prototype = Object.create(SESurveyTool.prototype);

jwcustom.prototype.type = function(){
    return "jwcustom";
}

jwcustom.prototype.getDependencies = function(){
    return [
        {"type":"script", "url" : "[%ImageCacheBase%]/images/jwPlayer/local/jwplayer.js"},
        {"type":"script", "url" : "[%ImageCacheBase%]/images/jwPlayer/js/jwkey.js"},
        {"type":"stylesheet", "url" : "[%ImageCacheBase%]/images/jwPlayer/css/jwplayer.css"}
    ];
}

jwcustom.prototype.build = function(){
    var survey = $("#survey");
    var info = $("#infoPanel");
    survey.hide();
    var qThis = this;
    var player = new VideoPlayer();

    jwcustom.prototype.videoPlayer = player;

    function VideoPlayer() {
        var that = this;
        var settings = qThis.options;
        var vCenter = settings.playerposition === "center" ? true : false;

        // Create player elements
        var background = $("<div class='background-dim' readonly='true'/>");
        var playerpopup = $("<div class='player-skin'/>");
        var playerdiv = $("<div id='" + settings.playername + "' class='videoplayer' readonly='true'/>");
        
        background.css({"height":$(document).height()});
        $("body").append(background);
        playerpopup.append(playerdiv);
        info.before(playerpopup);
        
        var interestSlider = new InterestSlider(settings);

        var playlistQuestion = qThis.nativeContainer.find(".questionContainer[questionname$='playlist']");
        var statusQuestion = qThis.nativeContainer.find(".questionContainer[questionname$='videostatus']");
        var techQuestion = qThis.nativeContainer.find(".questionContainer[questionname$='finaltech']");
        var ratingsQuestion = qThis.nativeContainer.find(".questionContainer[questionname$='videoratings']");
        var statusbox = statusQuestion.find(".mrEdit");
        var sliderbox = ratingsQuestion.find(".mrEdit");

        var techoptions = techQuestion.find(".mrMultipleText, .mrSingleText");
        var videos = playlistQuestion.find(".mrMultipleText, .mrSingleText");

        var currentPLIndex = 0;
        var playerPosition = -1;
        var playerSwitched = false;
        var videoSwitched = false;
        var currentPLValue = "";
        var currentPLDuration = -1;

        var videoState = [];
        for (var v = 0; v < videos.length; v++) {
            videoState.push([]);
        }

        if (location.host === "" || isTest === true) {
            if (typeof console !== undefined) {
                if (typeof console.log !== undefined) {
                    settings.hasconsole = true;
                }
            }
        }

        // Show any errors that may have occured causing this page to reload
        $(".mrErrorText").each(function(i, e){
            info.after($(e).text($(e).parents(".questionContainer").attr("questionname") + ": " + $(e).text() )); 
        });

        // if primary has already been set for this page, use it instead of the settings.primary value.
        var presetPrimary = $("label[for='" + techQuestion.find(":radio:checked").attr("id") + "'] span").text();
        if (presetPrimary !== "") {
            settings.primary = presetPrimary;
        }

        // Reset playlist to start at the beginning if this page is visited a 2nd time for some reason
        playlistQuestion.find(":radio:checked, :checkbox:checked").each(function(i, c) {
            $(c).attr("checked",null);
        });

        that.Initialize = function() {
            if ($.inArray(settings.primary, supportedTech()) < 0) {
                switchTech();
            }

            if (statusbox.length > 0) {
                statusbox.val("");
            }
            log("Initializing Version: " + jwplayer.version);

            if (supportedTech().length > 0) {
                setupJWPlayer();
            } else {
                settings.primary = "undefined";
                log("No suitable player found - should only get here in debug mode!");
                playerdiv.html("<p style='background-color:#ececec; font-color: #fff; width: 100%; height: 100%; margin: 0 auto;'>Error</p>");
            }
        }
        
        function InterestSlider(settings) {
            var that = this;
            var container = $("<div class='slidercontainer' />");
            var sliderdiv = $("<div class='videoslider' />");
            var innerslider = $("<div class='sliderval' />");
            var playcontainer = $("<span class='slider-playcontainer' />");
            var playbutton = $("<span class='slider-playbutton' />");
            var lowrating = $("<span class='slider-rating rating-low'>" + settings.lowratingtext + "</span>");
            var midrating = $("<span class='slider-rating rating-mid'>" + settings.midratingtext + "</span>");
            var highrating = $("<span class='slider-rating rating-high'>" + settings.highratingtext + "</span>");
            var thumb = $("<div class='slider-thumb' />");

            that.Show = function() {
                container.show();
                playcontainer.show();
                thumb.hide();
                thumb.css("left",settings.sliderinitialvalue);
                innerslider.css("width",settings.sliderinitialvalue);
            }

            that.Hide = function() {
                container.hide();
                playcontainer.show();
                thumb.hide();
            }

            that.Height = function() {
                if (settings.showslider === false) {
                    return 0;
                }
                var height = parseInt(container.outerHeight(), 10);
                height += parseInt(container.css("margin-top"), 10);
                height += parseInt(lowrating.css("margin-top"), 10);
                height += parseInt(lowrating.outerHeight(), 10);
                return height;
            }
            
            that.Value = function() {
                if (settings.showslider !== true) {
                    return 1;
                }
                return Math.round(100 * parseInt(innerslider.css("width"), 10) / parseInt(sliderdiv.css("width"), 10), 2);
            }

            if (settings.showslider === true) {
                playcontainer.append(playbutton);
                sliderdiv.append(innerslider);
                container.append(sliderdiv, lowrating, midrating, highrating, thumb, playcontainer);

                var playbuttonwidth = parseFloat(settings.sliderplaybuttonsize, 10);
                var playwidthstring = "" + settings.sliderplaybuttonsize + "";
                var playbuttonextra = playwidthstring.replace(playbuttonwidth,"");
                var playbuttonoffset = parseFloat(settings.sliderplaybuttonsize, 10) - parseFloat(settings.sliderheight, 10);
                playcontainer.css({
                    height: settings.sliderplaybuttonsize,
                    width: settings.sliderplaybuttonsize,
                    top: (parseFloat(settings.sliderborderwidth, 10) - playbuttonoffset / 2) + (playbuttonextra.length === 0 ? "px" : playbuttonextra),
                    "margin-left": -playbuttonwidth / 2 + (playbuttonextra.length === 0 ? "px" : playbuttonextra),
                    "background-color": settings.sliderplaybuttonbackgroundcolor,
                    "border-width": settings.sliderplaybuttonborderwidth,
                    "border-color": settings.sliderplaybuttonbordercolor,
                    "border-radius": settings.sliderplaybuttonborderradius,
                    "-webkit-border-radius": settings.sliderplaybuttonborderradius,
                    "-moz-border-radius": settings.sliderplaybuttonborderradius
                });

                var arrowsize = parseFloat(settings.sliderplayarrowsize, 10);
                var arrowsizestring = "" + settings.sliderplayarrowsize + ""
                var playextra = arrowsizestring.replace(arrowsize, "");
                var playborders = arrowsize / 2 + (playextra.length === 0 ? "px" : playextra);
                var arrowLeft = (parseFloat(settings.sliderplaybuttonborderwidth, 10) + Math.ceil((playbuttonwidth - .866 * arrowsize) / 2)) + (playextra.length === 0 ? "px" : playextra);
                var arrowTop = Math.floor((playbuttonwidth - arrowsize) / 2) + (playextra.length === 0 ? "px" : playextra);
                playbutton.css({
                    left: arrowLeft,
                    top: arrowTop,
                    "border-top": playborders + " solid transparent",
                    "border-bottom": playborders + " solid transparent",
                    "border-left": .866 * arrowsize + (playextra.length === 0 ? "px" : playextra) + " solid " + settings.sliderplaybuttoncolor
                });
                
                playcontainer.on("click touchstart", function(e) {
                    jwplayer(settings.playername).playlistItem(currentPLIndex);
                    playcontainer.hide();
                    thumb.show();
                    videoSwitched = false;
                });

                var thumbwidth = parseFloat(settings.sliderthumbwidth, 10);
                var thumbwidthstring = "" + settings.sliderthumbwidth + "";
                var thumbextra = thumbwidthstring.replace(thumbwidth,"");
                var thumboffset = parseFloat(settings.sliderthumbheight, 10) - parseFloat(settings.sliderheight, 10);
                thumb.css({
                    width: thumbwidthstring,
                    height: settings.sliderthumbheight,
                    left: settings.sliderinitialvalue,
                    "background-color": settings.sliderthumbcolor,
                    top: parseFloat(settings.sliderborderwidth, 10) - thumboffset / 2 + (thumbextra.length === 0 ? "px" : thumbextra),
                    "margin-left": -thumbwidth / 2 + (thumbextra.length === 0 ? "px" : thumbextra),
                    "border-radius": settings.sliderthumbborderradius,
                    "-webkit-border-radius": settings.sliderthumbborderradius,
                    "-moz-border-radius": settings.sliderthumbborderradius
                });
                innerslider.css({
                    width: settings.sliderinitialvalue,
                    "background-color": settings.slidercolor
                });
                sliderdiv.css({
                    "background-color": settings.sliderbackgroundcolor,
                    height: settings.sliderheight,
                    "border-width": settings.sliderborderwidth,
                    "border-color": settings.sliderbordercolor,
                    "border-radius": settings.sliderborderradius,
                    "-webkit-border-radius": settings.sliderborderradius,
                    "-moz-border-radius": settings.sliderborderradius
                });
                sliderdiv.on("mousedown touchstart", function(e) {
                    var clickX = (e.offsetX != null) ? e.offsetX : e.originalEvent.layerX;
                    if (e.type === "touchstart") {
                        clickX = e.originalEvent.touches[0].pageX - innerslider.offset().left;
                    }
                    var percent = Math.round(100 * clickX / parseFloat(sliderdiv.css("width"), 10), 0);
                    percent = Math.min(100, percent);
                    percent = Math.max(0, percent) + "%";
                    innerslider.css({ width: percent });
                    thumb.css({ left: percent });
                });
                thumb.on("mousedown touchstart", function(e) {
                    $(this).addClass("thumb-moveable");
                });
                $("body").on("mousemove touchmove", function(e) {
                    if (thumb.hasClass("thumb-moveable") === true) {
                        var mouseX = e.pageX;
                        if (e.type === "touchmove") {
                            mouseX = e.originalEvent.touches[0].pageX;
                        }
                        var percent = Math.round(100 * (mouseX - innerslider.offset().left) / parseInt(sliderdiv.css("width"), 10), 0);
                        percent = Math.min(100, percent);
                        percent = Math.max(0, percent) + "%";
                        thumb.css({ left: percent });
                        innerslider.css({ width: percent });
                    }
                });
                $("body").on("mouseup touchend", function(e) {
                    thumb.removeClass("thumb-moveable");
                });
                container.css({ 
                    width: settings.sliderwidth,
                    "margin-top": settings.slidermargintop
                });
                var labelwidth = parseInt(settings.sliderlabelwidth, 10);
                var widthstring = "" + settings.sliderlabelwidth + "";
                var extra = widthstring.replace(labelwidth,"");
                $(".slider-rating", container).css({
                    color: settings.sliderratinglabelcolor,
                    width: widthstring,
                    "font-size": settings.sliderlabelfontsize,
                    "margin-left": -labelwidth / 2 + (extra.length === 0 ? "px" : extra),
                    "margin-top": settings.sliderlabelmargintop
                });
                playerpopup.append(container);
            }
        }
 
        function playlist() {
            var playlist = [];
            videos.each(function(i, v){
                var source = {"sources": []};
                var url = $(v).text();
                var types = settings["alternateformats"];
                var initialtype = url.replace(/^.*\.([0-9a-z]+)$/i,"$1");
                source["sources"].push({"file": url, "type": "video/" + initialtype});
                for (var i = 0; i < types.length; i++) {
                    source["sources"].push({"file": url.replace(initialtype, types[i]), "type": "video/" + types[i]});
                }
                playlist.push(source);
            });
            return playlist;
        }

        function supportedTech() {
            var tech = [];
            techoptions.each(function(i, q){
                tech.push($(q).text());
            });
            return tech;
        }

        function setFinalTech(option) {
            settings.primary = option;
            techoptions.each(function(i, q){
                var inputId = $(q).parent().attr("for") === "" ? $(q).parent().attr("forinput") : $(q).parent().attr("for");
                var input = techQuestion.find("input#" + inputId);
                var checkSpan = input.parent().find(".checkbox, .radio");
                if (checkSpan.hasClass("checkChecked") === true) {
                    checkSpan.trigger("click");
                }
                if ($(q).text() === option) {
                    checkSpan.trigger("click");
                }
            });
        }

        that.Show = function() {
            updatePlayerPosition();
        }

        $(window).resize(updatePlayerPosition);

        function updatePlayerPosition() {
            updatePlayerHeight();
            playerpopup.center(vCenter);
            background.css({"height":$(document).height()});
        }

        function updatePlayerHeight() {
            var nativeWidth = settings.maxwidth;
            var nativeHeight = settings.maxheight;
            var ratios = settings.aspectratio.indexOf(":") > 0 ? settings.aspectratio.split(":") : [16, 9];
            var windowWidth = $(window).width();
            var windowHeight = $(window).height();
            var aspect = ratios[1] / ratios[0];
            if ($.isEmptyObject(jwplayer(settings.playername).getMeta()) === false) {
                nativeWidth = jwplayer(settings.playername).getMeta().width;
                nativeHeight = jwplayer(settings.playername).getMeta().height;
                aspect = nativeHeight / nativeWidth;
            }
            if (nativeHeight > windowHeight) {
                nativeHeight = windowHeight;
                nativeWidth = nativeHeight / aspect;
            }
            if (nativeWidth + 2 * settings.playerborderwidth > windowWidth) {
                nativeWidth = windowWidth - 2 * settings.playerborderwidth;
                nativeHeight = nativeWidth * aspect;
            }
            if (nativeHeight + interestSlider.Height() > windowHeight) {
                nativeHeight = windowHeight - interestSlider.Height();
                nativeHeight -= 2 * parseInt(settings.playerborderwidth, 10);
            }
            if (settings.addplayerstyling === true) {
                playerpopup.css({
                    "padding":settings.playerborderwidth,
                    "background":settings.playerbordercolor,
                    "border-radius":settings.playerborderradius,
                    "-webkit-border-radius": settings.playerborderradius,
                    "-moz-border-radius": settings.playerborderradius
                });
            }
            nativeWidth = nativeHeight / aspect;
            playerpopup.css({
                "max-width":Math.min(settings.maxwidth, settings.maxheight / aspect),
                "max-height":Math.min(settings.maxheight, settings.maxwidth * aspect),
                "width":nativeWidth,
                "height":nativeHeight,
                "min-width":settings.minwidth,
                "min-height":settings.minheight,
                "margin-top":settings.playerposition === "center" ? 0 : settings.playermargintop
            });
            background.css({
                background:settings.pagebackgroundcolor
            });
            playerpopup.center(vCenter);
        }

        function log(msg){
            if (settings.hasconsole){
                console.log(msg);
            }
            if (statusbox.length > 0 && settings.recordlogs === true){
                statusbox.val(statusbox.val() + msg + ";");
            }
        }

        function watchedCompletely() {
            var isComplete = true;
            for (var v = 0; v < videos.length; v++) {
                if (videoState[v].join(",").indexOf(",,") >= 0) {
                    isComplete = false;
                }
            }
            return isComplete;
        }

        function doSubmit(){
            playerpopup.hide();
            background.hide();
            if (watchedCompletely() === false){
                statusbox.val(statusbox.val() + ";false");
            } else {
                statusbox.val(statusbox.val() + ";true");
                log("Watched Entire Video(s): true");
            }
            if (typeof jwplayer(settings.playername).remove === "function") {
                jwplayer(settings.playername).remove();
            }
            sliderbox.val(videoState.join("|"));
            surveyPage.setResponsesAndSubmit();
            $(".mrNext").click();
        }

        function onReady(){
            if (typeof jwplayer(settings.playername).getRenderingMode === "function"){
                log("Rendering Mode: " + jwplayer(settings.playername).getRenderingMode());

                jwplayer(settings.playername).setVolume(settings.volume),
                setFinalTech(settings.primary);
                if (settings.showslider === true) {
                    interestSlider.Show();
                }

                // attempt to prevent players from using native fullscreen player
                $("video").each(function(i) { $(this).attr("webkit-playsinline","webkit-playsinline"); });
                
                // Entering fullscreen mode - for iPhone and iPod touch devices that can't play inline video
                $("video").on("MSFullscreenChange webkitbeginfullscreen webkitendfullscreen webkitfullscreenchange mozfullscreenchange fullscreenchange", function(e) {
                    var fullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                    if (fullscreen === true && settings.showslider === true) {
                        statusbox.val(statusbox.val() + " inline video not available for device!");
                        doSubmit();
                    }
                });

                if (supportedTech().length > 1) {
                    if(settings.primary === "flash") {
                        // flash requires a complete url, not a relative url
                        var html5path = location.protocol + "//" + location.host + settings.html5Icon;
                        jwplayer(settings.playername).addButton(html5path, settings.switchtechprefix + "HTML5", switchTech, "button1");
                    } else { 
                        jwplayer(settings.playername).addButton("'" + settings.flashicon + "'", settings.switchtechprefix + "Flash", switchTech, "button1");
                    }
                }
            }
        }

        function onTime(d){
            var duration = parseInt(d.duration);
            currentPLDuration = d.duration;
            var last = playerPosition;
            var rate = settings.samplerate;
            var samplesPerSecond = (typeof rate === "string" ? parseInt(rate, 10) / duration : 1000 / rate);
            samplesPerSecond = Math.min(settings.maxsamplespersecond, samplesPerSecond);
            playerPosition = parseInt(samplesPerSecond * d.position, 10) / samplesPerSecond;
            if (last !== playerPosition) {
                // for IE 9 issue, this sets the scale of the player
                var scale = playerdiv.width() / playerdiv.find("video").width();
                playerdiv.find("video").css({ "-ms-transform": "scale(" + scale + ")" });
                videoState[currentPLIndex][playerPosition * samplesPerSecond] = interestSlider.Value();
                
                if (isTest) {
                    console.log(playerPosition + "--" + duration);
                    console.log("playback state: " +  videoState[currentPLIndex]);
                }
            }
        }

        function onDisplayClick(event){
            if (settings.showslider === true) {
                jwplayer(settings.playername).setControls(false);

                $("#" + settings.playername + ", #" + settings.playername + "_wrapper").on("mousemove touchmove", function(e) {
                    if (jwplayer(settings.playername).getControls() !== settings.controls) {
                        jwplayer(settings.playername).setControls(settings.controls);
                    }
                });

                return false;
            }
        }

        function onPlay(event){
            log("Started playback.");
            $(".mrErrorText").hide();
            if (videoSwitched === true) {
                jwplayer(settings.playername).pause(true);
            }
            if (typeof jwplayer(settings.playername).setControls == "function"){
                jwplayer(settings.playername).setControls(settings.controls);
            }
        }

        function onPause(event){
            if (videoSwitched === false && settings.showslider === true) {
                jwplayer(settings.playername).play(true);
            }
            interestSlider.Show();
        }

        function onPlaylistItem(item){
            playerPosition = -1;
            if (playerSwitched) {
                jwplayer(settings.playername).playlistItem(currentPLIndex);
                playerSwitched = false;
            } else {
                currentPLIndex = item.index;
            }
            updatePlayerHeight();
            currentPLValue = playlistQuestion.find(".checkbox:not(.checkChecked)").siblings("input").val().replace(/_(_.+)$/,"{$1}");
            console.log(currentPLValue);
        }

        function onComplete(){
            log("Completed playback.");
            if (typeof jwplayer(settings.playername).getPlaylistIndex === "function"){
            
                videoState[currentPLIndex].unshift(currentPLValue, "d:" + currentPLDuration);

                if (playlistQuestion.find(":checkbox:eq(" + currentPLIndex + ")").attr("checked") === undefined) {
                    playlistQuestion.find(".checkbox:eq(" + currentPLIndex + ")").click();
                }
                if (typeof jwplayer(settings.playername).getPlaylist === "function"){
                    if (currentPLIndex === jwplayer(settings.playername).getPlaylist().length - 1){
                        log("Playlist complete!");
                        doSubmit();
                    } else if (settings.showslider === true) {
                        videoSwitched = true;
                        currentPLIndex++;
                    }
                }
            }
        }

        function onError(message){
            log(message);
        }

        function onSetupError(fallback, message){
            log("fallback was " + fallback.fallback);
            log(message);
        }

        function setupJWPlayer(){
            if (playlist().length === 0) {
                doSubmit();
            } else {
                jwplayer(settings.playername).setup({
                    controls: settings.controls,
                    width: settings.videowidth,
                    fallback: settings.fallback,
                    autostart: settings.autostart,
                    skin: settings.showslider ? settings.jwsliderskin : settings.jwprimaryskin,
                    aspectratio: settings.aspectratio,
                    playlist: playlist(),
                    primary: settings.primary,
                    stagevideo: settings.stagevideo,
                    events: {
                        onReady: onReady,
                        onTime: onTime,
                        onPlay: onPlay,
                        onPause: onPause,
                        onDisplayClick: onDisplayClick,
                        onPlaylistItem: onPlaylistItem,
                        onComplete: onComplete,
                        onError: onError,
                        onSetupError: onSetupError
                    }
                });
            }
        }

        function switchTech() {
            var supported = supportedTech();
            if (supported.length > 1 || $.inArray(settings.primary, supported) < 0) {
                settings.primary === supported[0] ? setFinalTech(supported[1]): setFinalTech(supported[0]);
                playerSwitched = true;
                interestSlider.Hide();
                that.Initialize();
            }
        }
    }

    // standard jquery deferred object to finalize tool build
    this.deferred.resolve();
}

jwcustom.prototype.render = function(){
    this.videoPlayer.Show();
    this.videoPlayer.Initialize();
}

jwcustom.prototype.setInitialResponses = function (){
}

jwcustom.prototype.toolOptions = function() {
    // synch directory accessible as [%synchBase%]
    var ucType = pageLayout.deviceType.toUpperCase();
    var cProps = {};
    for (var cProp in this.customProps) {
        cProps[cProp.toLowerCase()] = this.customProps[cProp];
    };
    var options = {
        playername: "vidcontainer",
        volume: 50,
        aspectratio: "16:9",
        maxwidth: 800,
        maxheight: 450,
        minwidth: 320,
        minheight: 180,
        playerposition: "top",
        addplayerstyling: true,
        switchtechprefix: "Switch to ",
        alternateformats: [],
        recordlogs: true,
        hasconsole: false,
        primary: "html5",
        autostart: true, // PC only
        fallback: true,
        controls: true,
        jwprimaryskin: pageLayout.synch + "jwplayer/skins/bekle-noprog.xml",
        jwsliderskin: pageLayout.synch + "jwplayer/skins/bekle-slider.xml",
        videowidth: "100%",
        stagevideo: false,
        flashicon: pageLayout.imageCache + "images/jwPlayer/flash.png",
        Html5icon: pageLayout.imageCache + "images/jwPlayer/html5.png",
        pagebackgroundcolor: "#191919",
        playerborderradius: 8,
        playerborderwidth: 8,
        playerbordercolor: "#505050",
        playermargintop: 50,
        showslider: false,
        slidercolor: "#152331",
        sliderbackgroundcolor: "#fff",
        sliderinitialvalue: "50%",
        sliderwidth: "75%",
        sliderheight: 20,
        sliderheight_pc: 15,
        slidermargintop: 25,
        slidermargintop_pc: 20,
        sliderborderwidth: 1,
        sliderborderradius: 10,
        sliderlabelmargintop: 20,
        sliderlabelmargintop_pc: 16,
        sliderlabelwidth: 75,
        sliderlabelfontsize: "14pt",
        sliderlabelfontsize_pc: "12pt",
        sliderthumbwidth: 20,
        sliderthumbwidth_pc: 14,
        sliderthumbheight: 35,
        sliderthumbheight_pc: 25,
        sliderthumbborderradius: 8,
        sliderthumbborderradius_pc: 5,
        sliderplayarrowsize: 25,
        sliderplayarrowsize_pc: 18,
        sliderplaybuttonsize: 50,
        sliderplaybuttonsize_pc: 36,
        sliderplaybuttonborderwidth: 2,
        sliderplaybuttonborderwidth_pc: 1,
        sliderbordercolor: "#505050",
        lowratingtext: "Boring",
        midratingtext: "Neutral",
        highratingtext: "Interesting",
        sliderratinglabelcolor: "#fff",
        sliderthumbcolor: "#505050",
        sliderplaybuttoncolor: "#000",
        sliderplaybuttonbackgroundcolor: "#fff",
        sliderplaybuttonborderradius: "100%",
        sliderplaybuttonbordercolor: "#191919",
        //samplerate: 500, // Uses DefaultSampleCount by default
        maxsamplespersecond: 5,
        defaultsamplecount: "10%"
    };

    // Apply any settings specified in custom properties to the player
    var settings = $.extend(true, options, cProps);
    
    // Default sample rate for a slider video is 500ms
    settings.defaultsamplecount = (settings.showslider === true ? 500 : settings.defaultsamplecount);

    // Default sample rate for the non-slider is 10% standard/500ms slider, but can be overridden by a specified value
    settings.samplerate = (settings.samplerate === undefined ? settings.defaultsamplecount : settings.samplerate);

    // Default skin when in Professional debug mode. Will be overridden when explicitly set with a custom property
    if (isDebug === "") {
        settings.jwprimaryskin = "http://cdn.tns-global.com/multimedia/us/212236698/jw-skins/bekle-noprog.xml";
        settings.jwsliderskin = "http://cdn.tns-global.com/multimedia/us/212236698/jw-skins/bekle-slider.xml";
    }

    // convert list to an array
    if (typeof cProps["alternateformats"] === "string") {
        cProps["alternateformats"] = (cProps["alternateformats"] === undefined || cProps["alternateformats"].length === 0 ? [] : cProps["alternateformats"].split(","));
    }

    // use the custom property specifically associated with the device type if specified (also for defaults will use the default for the specified type)
    var typeLen = ucType.length;
    for (var s in settings) {
        if (s.substr(s.length - (typeLen + 1), typeLen + 1).toUpperCase() === "_" + ucType) {
            settings[s.substr(0, s.length - (typeLen + 1))] = settings[s];
        }
    }
    switch(ucType) {
        case "SMARTPHONETOUCH":
        case "SMALLTABLET":
            settings.addplayerstyling = false;
            settings.playermargintop = 0;
        case "MEDIUMTABLET":
        case "LARGETABLET":
            settings.autostart = false;
            break;
        case "PC":
            break;
        default:
            settings.autostart = false;
            settings.addplayerstyling = false;
            settings.playermargintop = 0;
            break;
    }

    // Never auto-start a slider video.
    settings.autostart = (settings.showslider === true ? false : settings.autostart);

    // Never allow border width unless styling is specified
    settings.playerborderwidth = (settings.addplayerstyling === true ? settings.playerborderwidth : 0);

    return settings;
}

$.fn.center = function (vert) {
    this.css("position","absolute");
    if (vert === true) {
        this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
    }
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
    return this;
}