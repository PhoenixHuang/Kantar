/**
 * jplayer class
 * Inherits from SESurveyTool
 */
function jplayer(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
jplayer.prototype = Object.create(SESurveyTool.prototype);
jplayer.prototype.type = function() {
    return "jplayer";
}
jplayer.prototype.setResponses = function() {
    if (this.getProperty("filetype").toLowerCase() == 'video') {
        if (this.getProperty("videotype").toLowerCase() == 'slider') {
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
        } else {
            $.each(this.inputs.filter('textarea'), function(i, e) {
                $(e).val('Normal video')
            });
        }
    }
    if (this.getProperty("filetype").toLowerCase() == 'audio') {
        $.each(this.inputs.filter('textarea'), function(i, e) {
            $(e).val('Normal audio')
        });
    }
}
jplayer.prototype.getDependencies = function() {
    return [{
        "type": "script",
        "url": pageLayout.sharedContent + "LAF/Lib/jwPlayer/local/jwplayer.js"
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
        "url": pageLayout.sharedContent + "LAF/Lib/jwPlayer/js/jwkey.js"
    }, {
        'type': 'script',
        'url' : surveyPage.path + 'lib/KO/jwplayer/jwplayer.js'
    }, {
        "type": "stylesheet",
        "url": pageLayout.sharedContent + "LAF/Lib/jwPlayer/css/jwplayer.css"
    }, {
        "type": "stylesheet",
        'url' : pageLayout.themePath + 'css/videoplayer_v6.css'
       // 'url': pageLayout.sharedContent + 'SE/dev/LAF/Themes/green/1.2/css/videoplayer_v6.css'
    }];
}
jplayer.prototype.build = function() {

    this.component = $("<div id='videocontainer' > </div>");
    this.deferred.resolve();
}

jplayer.prototype.render = function() {
    this.componentContainer = $('<div>');
    this.componentContainer.append(this.label);
    this.componentContainer.attr('id', 'qc_' + this.questionFullName); //change to be more identifable with question?
    this.componentContainer.addClass('qcContainer');
    this.componentContainer.append(this.component);
    this.nativeContainer.after(this.componentContainer);
    var filetype = this.getProperty("filetype").toLowerCase();
	//fix for Chrome blank screen issue: 12-Nov-2015
	var chrome = /chrome/.test(navigator.userAgent.toLowerCase());
   
   if(chrome && pageLayout.deviceType.toUpperCase() == 'PC'){
      var primary = 'html5';
   }else{
      var primary = this.getProperty("primary");
      }

	  
    if (filetype == 'audio') {
        props = {
            "filetype": this.getProperty("filetype").toLowerCase(),
            "source": this.getProperty("source"),
            "videotype": this.getProperty("videotype").toLowerCase(),
            "controls": this.getProperty("controls"),
            "hlsenabled": this.getProperty("hlsenabled"),
            "aspectratio": this.getProperty("aspectratio"),
            "primary": primary,
            "stretching": this.getProperty("stretching"),
            "width": this.getProperty("width"),
            "height": 40,
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
            "playerposition": this.getProperty("playerposition"),
            "hidenext": this.getProperty("hidenext"),
            "image": this.getProperty("imageposter"),
            "androidhls": this.getProperty("androidhls"),
            "operaminierror": this.getProperty("operaminierror")
        }

    } else {
        var videotype = this.getProperty("videotype").toLowerCase();
        if (videotype == "normal") {
            props = {
                "filetype": this.getProperty("filetype").toLowerCase(),
                "source": this.getProperty("source"),
                "videotype": this.getProperty("videotype").toLowerCase(),
                "controls": this.getProperty("controls"),
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
                "playerposition": this.getProperty("playerposition"),
                "hidenext": this.getProperty("hidenext"),
                "image": this.getProperty("imageposter"),
                "androidhls": this.getProperty("androidhls"),
                "operaminierror": this.getProperty("operaminierror")
            }
        } else if (videotype == "slider") {

            props = {
                "filetype": this.getProperty("filetype").toLowerCase(),
                "source": this.getProperty("source"),
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
                /* Slider Properties*/
                "sliderminimumvalue": this.getProperty("sliderminimumvalue"),
                "slidermaximumvalue": this.getProperty("slidermaximumvalue"),
                "sliderdefaultvalue": this.getProperty("sliderdefaultvalue"),
                "slidermovestep": this.getProperty("slidermovestep"),
                "sliderstarttext": this.getProperty("sliderstarttext"),
                "sliderendtext": this.getProperty("sliderendtext"),
                "slidermiddletext": this.getProperty("slidermiddletext"),
                "sliderplaybutton": this.getProperty("sliderplaybutton")
            }
        }
    }
    this.jwplayerapp = new JWPlayer();
    this.jwplayerapp.init(props);
    this.componentContainer.attr('style', 'padding-bottom: 20px !important');
    $('.mrErrorText').attr('style', 'position: initial !important');
    this.nativeContainer.hide();

}
jplayer.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + jplayer.prototype.type()));
    switch (pageLayout.deviceType.toUpperCase()) {
        case "LARGETABLET":
        case "MEDIUMTABLET":
        case "SMALLTABLET":
        case "SMARTPHONETOUCH":
            if (this.orientation == 0 || this.orientation == 180) {
                return {
                    'filetype': 'video',
                    'controls': true,
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
                    'operaminierror': "Video not supported on your device"
                }
            } else {
                return {
                    'filetype': 'video',
                    'controls': true,
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
                    'operaminierror': "Video not supported on your device"
                }
            }
        case "PC":
        case "OTHERDEVICE":
        default:
            return {
                'filetype': 'video',
                'controls': true,
                'videotype': 'normal',
                'playername': "vidPlayer",
                'aspectratio': "16:9",
                'primary': "flash",
                'stretching': "uniform",
                'maxwidth': 800,
                'maxheight': 450,
                'minwidth': 320,
                'minheight': 180,
                'width': 800,
                'height': 450,
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
                'androidhls': false,
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
                'operaminierror': "Video not supported on your device"
            }
    }

}