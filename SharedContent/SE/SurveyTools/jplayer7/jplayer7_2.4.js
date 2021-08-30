/**
 * jplayer7 class
 * Inherits from SESurveyTool
 */
function jplayer7(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
jplayer7.prototype.countryCode = "";

jplayer7.prototype = Object.create(SESurveyTool.prototype);
jplayer7.prototype.type = function() {
    return "jplayer7";
}
jplayer7.prototype.setResponses = function() {
    if (this.getProperty("filetype").toLowerCase() == 'video') {
        var output = "";
        $.each(this.inputs.filter('textarea'), function(i, e) {
            output += $(e).val();
        });
        var latestOutput = this.jwplayerapp.getData();

        if (latestOutput != "") {
            var latestOutputArray = latestOutput.split("~");
            latestOutput = "";
            for (var i = 0; i < latestOutputArray.length; i++) {
                if (latestOutputArray[i].charAt(0) === ',')
                    latestOutput += latestOutputArray[i].slice(1) + '~';
                else
                    latestOutput += latestOutputArray[i] + '~';
            }
            latestOutput = latestOutput.slice(0, -1);
        }

        if (latestOutput == "") {
            latestOutput = output;
        }
        $.each(this.inputs.filter('textarea'), function(i, e) {
            $(e).val('')
        });

        $.each(this.inputs.filter('textarea'), function(i, e) {
            $(e).val(latestOutput.slice(i * 4000, (i + 1) * 4000))

        });
    }
    if (this.getProperty("filetype").toLowerCase() == 'audio') {
        $.each(this.inputs.filter('textarea'), function(i, e) {
            $(e).val('Normal audio')
        });
    }
}
jplayer7.prototype.getDependencies = function() {
    return [{
            "type": "script",
            "url": pageLayout.sharedContent + "LAF/Lib/jwPlayer/7/jwplayer.js"
        }, {
            'type': 'script',
            'url': pageLayout.sharedContent + 'LAF/Lib/jQueryUI/1.11.0/jquery-ui.min.js'
        }, {
            'type': 'script',
            'url': pageLayout.sharedContent + 'LAF/Lib/jQueryUI/jquery.ui.touch-punch.js'
        }, {
            'type': 'stylesheet',
            'url': pageLayout.themePath + "css/1.10.4/jquery-ui-custom.css"
        }, {
            "type": "script",
            "url": pageLayout.sharedContent + "LAF/Lib/jwPlayer/7/jwkey.js"
        }, {
            'type': 'script',
            'url': surveyPage.path + 'lib/KO/jwplayer/jwplayer7.js'
        },
        /*{
               "type": "stylesheet",
               "url": pageLayout.sharedContent + "LAF/Lib/jwPlayer/css/jwplayer.css"
           }, */
        {
            "type": "stylesheet",
            'url' : pageLayout.themePath + 'css/videoplayer_v6.css'
            //'url': pageLayout.sharedContent + 'SE/dev/LAF/Themes/green/1.2/css/videoplayer_v6.css'
        }
    ];
}
jplayer7.prototype.build = function() {

    this.component = $("<div id='videocontainer' > <div id='bt-play'></div></div>");
   
	this.deferred.resolve();

}

jplayer7.prototype.render = function() {
    this.componentContainer = $('<div>');
    this.componentContainer.append(this.label);
    this.componentContainer.attr('id', 'qc_' + this.questionFullName); //change to be more identifable with question?
    this.componentContainer.addClass('qcContainer');
    this.componentContainer.append(this.component);
    this.nativeContainer.after(this.componentContainer);
    var filetype = this.getProperty("filetype").toLowerCase();

    //fix for Chrome blank screen issue: 12-Nov-2015
    var chrome = /chrome/.test(navigator.userAgent.toLowerCase());

    if (chrome && pageLayout.deviceType.toUpperCase() == 'PC') {
        var primary = 'html5';
    } else {
        var primary = this.getProperty("primary");
    }

    if (filetype == 'audio') {
        props = {
            "filetype": this.getProperty("filetype").toLowerCase(),
            "source": this.getProperty("source"),
            "videotype": this.getProperty("videotype").toLowerCase(),
            "controls": this.getProperty("controls"),
            "visualplaylist": this.getProperty("visualplaylist"),
            "hlsenabled": this.getProperty("hlsenabled"),
            "aspectratio": this.getProperty("aspectratio"),
            "primary": primary,
            "stretching": this.getProperty("stretching"),
            "width": this.getProperty("width"),
            "height": 1,
            "rtmpbufferlength": this.getProperty("rtmpbufferlength"),
            "rtmpsubscribe": this.getProperty("rtmpsubscribe"),
            "autoplay": this.getProperty("autoplay"),
            "fallback": this.getProperty("fallback"),
            "skin": this.getProperty("skin"),
            "playername": this.getProperty("playername"),
            "maxwidth": this.getProperty("maxwidth"),
            "maxheight": this.getProperty("maxheight"),
            "minwidth": this.getProperty("minwidth"),
            "minheight": 30,
            "autosubmit": this.getProperty("autosubmit"),
			"buffertext": this.getProperty("buffertext"),
            "playerposition": this.getProperty("playerposition"),
            "hidenext": this.getProperty("hidenext"),
            "image": this.getProperty("imageposter"),
            "androidhls": this.getProperty("androidhls"),
            "operaminierror": this.getProperty("operaminierror"),
            "playcount": this.getProperty("playcount"),
            "skipdetection": this.getProperty("skipdetection"),
            "playcountmessage": this.getProperty("playcountmessage"),
            "skipdetectionmessage": this.getProperty("skipdetectionmessage"),
            "componentContainer": this.componentContainer,
			"ischina":this.getProperty("ischina")
        }

    } else {
        var videotype = this.getProperty("videotype").toLowerCase();
        if (videotype == "normal") {
            props = {
                "filetype": this.getProperty("filetype").toLowerCase(),
                "source": this.getProperty("source"),
                "videotype": this.getProperty("videotype").toLowerCase(),
                "controls": this.getProperty("controls"),
                "visualplaylist": this.getProperty("visualplaylist"),
                "hlsenabled": this.getProperty("hlsenabled"),
                "aspectratio": this.getProperty("aspectratio"),
                "primary": primary,
                "stretching": this.getProperty("stretching"),
                "width": this.getProperty("width"),
                "height": this.getProperty("height"),
                "rtmpbufferlength": this.getProperty("rtmpbufferlength"),
                "rtmpsubscribe": this.getProperty("rtmpsubscribe"),
                "autoplay": this.getProperty("autoplay"),
                "fallback": this.getProperty("fallback"),
                "skin": this.getProperty("skin"),
                "playername": this.getProperty("playername"),
                "maxwidth": this.getProperty("maxwidth"),
                "maxheight": this.getProperty("maxheight"),
                "minwidth": this.getProperty("minwidth"),
                "minheight": this.getProperty("minheight"),
                "autosubmit": this.getProperty("autosubmit"),
				"buffertext": this.getProperty("buffertext"),
                "playerposition": this.getProperty("playerposition"),
                "hidenext": this.getProperty("hidenext"),
                "image": this.getProperty("imageposter"),
                "androidhls": this.getProperty("androidhls"),
                "operaminierror": this.getProperty("operaminierror"),
                "playcount": this.getProperty("playcount"),
                "skipdetection": this.getProperty("skipdetection"),
                "playcountmessage": this.getProperty("playcountmessage"),
                "skipdetectionmessage": this.getProperty("skipdetectionmessage"),
                "componentContainer": this.componentContainer,
			    "ischina":this.getProperty("ischina")
            }
        } else if (videotype == "slider") {

            props = {
                "filetype": this.getProperty("filetype").toLowerCase(),
                "source": this.getProperty("source"),
                "visualplaylist": this.getProperty("visualplaylist"),
                "videotype": this.getProperty("videotype").toLowerCase(),
                "controls": this.getProperty("slidercontrols"),
                "autoplay": this.getProperty("autoplay"),
                "ratinginterval": this.getProperty("ratinginterval"),
                "hlsenabled": this.getProperty("hlsenabled"),
                "aspectratio": this.getProperty("aspectratio"),
                "primary": primary,
                "stretching": this.getProperty("stretching"),
                "width": this.getProperty("width"),
                "height": this.getProperty("height"),
                "rtmpbufferlength": this.getProperty("rtmpbufferlength"),
                "rtmpsubscribe": this.getProperty("rtmpsubscribe"),
                "fallback": this.getProperty("fallback"),
                "skin": this.getProperty("skin"),
                "playername": this.getProperty("playername"),
                "maxwidth": this.getProperty("maxwidth"),
                "maxheight": this.getProperty("maxheight"),
                "minwidth": this.getProperty("minwidth"),
                "minheight": this.getProperty("minheight"),
                "autosubmit": this.getProperty("autosubmit"),
                "playerposition": this.getProperty("playerposition"),
                "hidenext": this.getProperty("hidenext"),
                "image": this.getProperty("imageposter"),
                "androidhls": this.getProperty("androidhls"),
                "operaminierror": this.getProperty("operaminierror"),
                "playcount": this.getProperty("playcount"),
                "skipdetection": this.getProperty("skipdetection"),
                "playcountmessage": this.getProperty("playcountmessage"),
                "skipdetectionmessage": this.getProperty("skipdetectionmessage"),
				"buffertext": this.getProperty("buffertext"),
                /* Slider Properties*/
                "sliderminimumvalue": this.getProperty("sliderminimumvalue"),
                "slidermaximumvalue": this.getProperty("slidermaximumvalue"),
                "sliderdefaultvalue": this.getProperty("sliderdefaultvalue"),
                "slidermovestep": this.getProperty("slidermovestep"),
                "sliderstarttext": this.getProperty("sliderstarttext"),
                "sliderendtext": this.getProperty("sliderendtext"),
                "slidermiddletext": this.getProperty("slidermiddletext"),
                "sliderplaybutton": this.getProperty("sliderplaybutton"),
                "developermode": this.getProperty("developermode"),
                "componentContainer": this.componentContainer,
			    "ischina":this.getProperty("ischina")
            }
        }
    }

    this.jwplayerapp = new JWPlayer();
    this.jwplayerapp.init(props);
    this.componentContainer.attr('style', 'padding-bottom: 20px !important');
    $('.mrErrorText').attr('style', 'position: initial !important');
    this.nativeContainer.hide();
}
jplayer7.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + jplayer7.prototype.type()));
    switch (pageLayout.deviceType.toUpperCase()) {
        case "LARGETABLET":
        case "MEDIUMTABLET":
        case "SMALLTABLET":
        case "SMARTPHONETOUCH":
            if (this.orientation == 0 || this.orientation == 180) {
                return {
                    'filetype': 'video',
                    'controls': true,
                    'visualplaylist': false,
                    'videotype': 'normal',
                    'playername': "vidPlayer",
                    'aspectratio': "16:9",
                    'primary': "html5",
                    'stretching': "uniform",
                    'maxwidth': 800,
                    'maxheight': 450,
                    'minwidth': 320,
                    'minheight': 180,
                    'width': 550,
                    'height': 300,
                    'rtmpsubscribe': false,
                    'rtmpbufferlength': "",
                    'autoplay': false,
                    'fallback': true,
                    'skin': 'glow',
                    /*roundster, bekle, five, glow, stormtrooper, vapor, six, beelden*/
                    'autosubmit': false,
                    'playerposition': "center",
                    'hidenext': false,
                    'imageposter': "",
                    'androidhls': true,
                    'playcount': 1,
                    'skipdetection': false,
                    'playcountmessage': "We would like you to watch the video one more time.",
                    'skipdetectionmessage': "The video wasn't watched in full, please play it again",
					'buffertext': "buffering...",
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
                    'operaminierror': "Video not supported on your device",
					'skipaccuracy':10,
                    'developermode': false,
					'ischina':false
                }
            } else {
                return {
                    'filetype': 'video',
                    'controls': true,
                    'visualplaylist': false,
                    'videotype': 'normal',
                    'playername': "vidPlayer",
                    'aspectratio': "16:9",
                    'primary': "html5",
                    'stretching': "uniform",
                    'maxwidth': 800,
                    'maxheight': 450,
                    'minwidth': 320,
                    'minheight': 180,
                    'width': 420,
                    'height': 210,
                    'rtmpsubscribe': false,
                    'rtmpbufferlength': "",
                    'autoplay': false,
                    'fallback': true,
                    'skin': 'glow',
                    /*roundster, bekle, five, glow, stormtrooper, vapor, six, beelden*/
                    'autosubmit': false,
                    'playerposition': "center",
                    'hidenext': false,
                    'imageposter': "",
                    'androidhls': true,
                    'playcount': 1,
                    /* value 1 to any number */
                    'skipdetection': false,
                    /* true/false */
                    'playcountmessage': "We would like you to watch the video one more time.",
                    'skipdetectionmessage': "The video wasn't watched in full, please play it again",
					'buffertext': "buffering...",
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
                    'operaminierror': "Video not supported on your device",
					'skipaccuracy':10,
                    'developermode': false,
					'ischina':false
                }
            }
        case "PC":
        case "OTHERDEVICE":
        default:
            return {
                'filetype': 'video',
                /* Video/audio */
                'controls': true,
                /* true/false */
                'visualplaylist': false,
                /* true/false */
                'videotype': 'normal',
                /* Slider/Normal */
                'playername': "vidPlayer",
                /* Any Name */
                'aspectratio': "16:9",
                /* 16:9 or 24:10 or 4:3 */
                'primary': "flash",
                /* html5/flash */
                'stretching': "uniform",
                /* uniform,fill,exactfit,bestfit,none */
                'maxwidth': 800,
                'maxheight': 450,
                'minwidth': 320,
                'minheight': 180,
                'width': 800,
                'height': 450,
                'rtmpsubscribe': false,
                /* true/false */
                'rtmpbufferlength': "",
                'autoplay': false,
                /* true/false */
                'fallback': true,
                /* true/false */
                'skin': 'glow',
                /*roundster, bekle, five, glow, stormtrooper, vapor, six, beelden*/
                'autosubmit': false,
                /* true/false */
                'playerposition': "center",
                /* left/center */
                'hidenext': false,
                /* true/false */
                'imageposter': "",
                'androidhls': false,
                /* true/false */
                'playcount': 1,
                /* value 1 to any number */
                'playcountmessage': "We would like you to watch the video one more time.",
                'skipdetection': false,
                /* true/false */
                'skipdetectionmessage': "The video wasn't watched in full, please play it again",
				'buffertext': "buffering...",

                /* Slider Values*/
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
                'operaminierror': "Video not supported on your device",
				'skipaccuracy':10,
                'developermode': true,
				/*China region detection*/
				'ischina':false
				
            }
    }

}