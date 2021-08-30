/**
 * jplayer7 class
 * Inherits from SESurveyTool
 */
function jplayerfcdetection(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
jplayerfcdetection.prototype.countryCode = "";

jplayerfcdetection.prototype = Object.create(SESurveyTool.prototype);
jplayerfcdetection.prototype.type = function() {
    return "jplayerfcdetection";
}
jplayerfcdetection.prototype.setResponses = function() {

}

jplayerfcdetection.prototype.getDependencies = function() {
	var server = this.getProperty("server");
    if (this.getProperty("technology") == 'flash') {
        return [{
            "type": "stylesheet",
            'url': pageLayout.themePath + 'css/jplayerFC/style.css'
        }, {
            "type": "stylesheet",
            'url': server + '/portal/swf/history/history.css'
        }, {
            "type": "script",
            "url": pageLayout.sharedContent + "LAF/Lib/jwPlayer/7/jwplayer.js"
        }, {
            "type": "script",
            "url": pageLayout.sharedContent + "LAF/Lib/jwPlayer/7/jwkey.js"
        }, {
            'type': 'script',
            'url': pageLayout.sharedContent + 'SE/lib/KO/jplayerfcdetection/jw7SetupTimeRate_FC_Flash.js'
        }, {
            "type": "script",
            "url": pageLayout.sharedContent + "LAF/Lib/jplayeriosfix/ios-orientation-fix.min.js"
        }, {
            'type': 'script',
            'url': server + '/portal/swf/history/history.js'
        }, {
            'type': 'script',
            'url': server + '/portal/swf/swfobject.js'
        }];

    } else {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://labs-portal.affectiva.com/portal/js/webrtc/facerecorder-mrapi.js";
        $("head").append(s);

        return [{
            "type": "stylesheet",
            'url': pageLayout.themePath + 'css/jplayerFC/style.css'
        }, {
            "type": "script",
            "url": pageLayout.sharedContent + "LAF/Lib/jwPlayer/7/jwplayer.js"
        }, {
            "type": "script",
            "url": pageLayout.sharedContent + "LAF/Lib/jwPlayer/7/jwkey.js"
        }, {
            'type': 'script',
            'url': pageLayout.sharedContent + 'SE/lib/KO/jplayerfcdetection/jw7SetupTimeRate_FC.js'
        }, {
            "type": "script",
            "url": pageLayout.sharedContent + "LAF/Lib/jplayeriosfix/ios-orientation-fix.min.js"
        }, {
            "type": "stylesheet",
            'url': server + '/portal/swf/history/history.css'
        }, {
            "type": "script",
            "url": server + "/portal/swf/history/history.js"
        }, {
            "type": "script",
            "url": pageLayout.sharedContent + "SE/lib/KO/jplayerfcdetection/affectiva_v5.js"
        }, {
            "type": "stylesheet",
            "url": pageLayout.themePath + "css/jplayerFC/affectiva_v5.css"
        }];

    }
}
jplayerfcdetection.prototype.build = function() {
	var DeviceType = pageLayout.deviceType.toUpperCase();
	var introtxt = this.getProperty("introtxt");
	var instructionstxt = this.getProperty("instructionstxt");
	var missfaceerrortxt = this.getProperty("missfaceerrortxt");
	var facenotfiterrortxt = this.getProperty("facenotfiterrortxt");
	var darkfaceerrortxt = this.getProperty("darkfaceerrortxt");
	var uploadtxt = this.getProperty("uploadtxt");
	
	
    if (this.getProperty("technology") == 'flash') {
        this.component = $(' <div id="introTxt">'+introtxt+'</div><div id="vidcontainer"> <div id="vidPlayer"> </div><div class="bt-play"></div></div><div id="affWrap" align="center"></div><div style="display:none;"><style type="text/css"><!-- #errPosition, #errPosLight, #errLight{background-color: #fff; border: 1px solid #000; padding: 5px; position: absolute; top: 260px; width: 435px; z-index: 99;right:0; left:0; margin:auto;}#affWait{background-color: #fff; border: 1px solid #000; height: 128px; position: absolute; top: 260px; width: 128px; z-index: 100;right:0; left:0; margin:auto;}.errImage, .errText{font-size: 12px; font-weight: normal; margin-bottom: 10px; text-align: center;}.headLeft{width: 250px; padding: 0px; padding-right: 10px; display: inline-block; vertical-align: bottom;}.headRight{width: 250px; padding: 0px; padding-left: 10px; display: inline-block; vertical-align: bottom;}.headSpace{width: 380px; display: inline-block;}.visleft{width: 250px; padding: 0px; padding-right: 10px; display: inline-block; vertical-align: top;}.visright{width: 250px; padding: 0px; padding-left: 10px; display: inline-block; vertical-align: top;}.visright div, .visleft div{padding-bottom: 2px;}#affContainer{color: #000; margin: 0px; padding: 0px;}body, html, form{overflow: auto !important;}#affEmbed{position: relative;}#buttonContainer{margin: 5px 0px; padding: 0px; max-width: 380px; z-index: 100; width: 100%;}#affContent{display: inline-block; vertical-align: top;}#affContinue, .fakeContinue{height: 30px; margin: 0px; padding: 0px 10px; text-align: center; border: 1px outset black; max-width: 200px; width: 100%;}.instruct{display: block; font-size: 12px; padding: 0px; margin: 0px; font-weight: normal; text-align: left;}.hideContainer{visibility: hidden; width: 0px; height: 0px !important; overflow: hidden;}.errHidden{display: none;}#affBar{width: 200px; border: 1px solid #333; text-align: left;}#affBarBg{height: 10px; width: 20%; background-color: lightblue;}.mrQuestionText br{display: none;}//--> </style><div style="width:100%" align="center"><div id="affContainer"><div class="visuals"><span class="visleft"><div><img src="' + pageLayout.themePath + 'css/jplayerFC/perfect.jpg"/></div><div><img src="' + pageLayout.themePath + 'css/jplayerFC/dark.jpg"/></div><div><img src="' + pageLayout.themePath + 'css/jplayerFC/small.jpg"/></div></span><span id="affContent"><div id="affEmbed"></div><div><div class="instruct">'+instructionstxt+'</div></div><div align="center" id="buttonContainer"><input id="affContinue" type="button" value="Continue" disabled="disabled"/></div></span><span class="visright"><div><img src="' + pageLayout.themePath + 'css/jplayerFC/food.jpg"/></div><div><img src="' + pageLayout.themePath + 'css/jplayerFC/phone.jpg"/></div><div><img src="' + pageLayout.themePath + 'css/jplayerFC/hat.jpg"/></div></span></div></div></div><div id="errPosLight" class="errHidden"> <div class="errImage"><img src="' + pageLayout.themePath + 'css/jplayerFC/generalerror.png"/></div><div class="errText">'+missfaceerrortxt+'<input class="fakeContinue" type="button" value="Continue"/></div></div><div id="errPosition" class="errHidden"> <div class="errImage"><img src="' + pageLayout.themePath + 'css/jplayerFC/generalerror.png"/></div><div class="errText">'+facenotfiterrortxt+'<input class="fakeContinue" type="button" value="Continue"/></div></div><div id="errLight" class="errHidden"> <div class="errImage"><img src="' + pageLayout.themePath + 'css/jplayerFC/generalerror.png"/></div><div class="errText">'+darkfaceerrortxt+'<input class="fakeContinue" type="button" value="Continue"/></div></div><div id="affWait" class="errHidden"><img src="' + pageLayout.themePath + 'css/jplayerFC/processing.gif"/></div><div id="affProgressbar" class="hideContainer"><div>'+uploadtxt+' <span id="progPercent">0</span>%</div><div id="affBar"><div id="affBarBg"></div></div></div></div>');

    } else {
		
		if(DeviceType == 'PC' || DeviceType == 'OTHERDEVICE'){
			 var visleft = '<span class="visleft"><div><img src="' + pageLayout.themePath + 'css/jplayerFC/perfect.jpg"/></div><div><img src="' + pageLayout.themePath + 'css/jplayerFC/dark.jpg"/></div><div><img src="' + pageLayout.themePath + 'css/jplayerFC/small.jpg"/></div></span>';
			 
			 var visright = '<span class="visright"><div><img src="' + pageLayout.themePath + 'css/jplayerFC/food.jpg"/></div><div><img src="' + pageLayout.themePath + 'css/jplayerFC/phone.jpg"/></div><div><img src="' + pageLayout.themePath + 'css/jplayerFC/hat.jpg"/></div></span>';
			 
		}else{
			var visleft = '';
			var visright = '';			
		}
        this.component = $('<div style="display:none"><div></div><span class="mrBannerText" style=""><div class="none"><div id="quotaPath"></div></div></span></div><style type="text/css"><!--#affContainer{color: #000;margin: 0px;padding: 0px;}body, html, form{overflow: auto !important;}#affEmbed{position: relative;}#buttonContainer{margin: 5px 0px;padding: 0px;max-width:380px;z-index: 100;width: 100%;}#affContent{display: inline-block;vertical-align: top;}#affContinue{height: 30px;margin: 0px;padding: 0px 10px;text-align:center;border: 1px outset black;max-width: 200px;width: 100%;}.instruct{display: block;font-size:12px;padding:0px;margin: 0px;font-weight: normal;text-align: left;}.headLeft{width: 250px;padding: 0px;padding-right: 10px;display: inline-block;vertical-align:bottom;}.headRight{width: 250px;padding: 0px;padding-left: 10px;display: inline-block;vertical-align:bottom;}.headSpace{width: 380px;display: inline-block;}.visleft{width: 250px;padding: 0px;padding-right: 10px;display: inline-block;vertical-align: top;}.visright{width: 250px;padding: 0px;padding-left: 10px;display: inline-block;vertical-align: top;}.visright div, .visleft div{padding-bottom: 2px;}.hideContainer{visibility: hidden;width: 0px;height: 0px !important;overflow: hidden;}.errHidden{display: none;}#affBar{width: 200px;border: 1px solid #333;text-align: left;}#affBarBg{height: 10px;width: 20%;background-color: lightblue;}.mrQuestionText br{display: none;}//--></style><div id="introTxt">'+introtxt+'</div><div id="vidcontainer"><div id="vidPlayer"></div><div class="bt-play"></div></div><div id="affWrap" align="center"></div><div style="display:none;"><div style="width:100%" align="center"><div id="affContainer"><div class="visuals">'+visleft+'<span id="affContent"><div id="affEmbed"></div><div><div class="instruct">'+instructionstxt+'</div></div><div align="center" id="buttonContainer"><input id="affContinue" type="button" value="Continue" disabled="disabled"/></div></span>'+visright+'</div></div></div><div id="errPosLight" class="errHidden"><div class="errImage"><img src="' + pageLayout.themePath + 'css/jplayerFC/generalerror.png"/></div><div class="errText">'+missfaceerrortxt+'<input class="fakeContinue" type="button" value="Continue"/></div></div><div id="errPosition" class="errHidden"><div class="errImage"><img src="' + pageLayout.themePath + 'css/jplayerFC/generalerror.png"/></div><div class="errText">'+facenotfiterrortxt+'<input class="fakeContinue" type="button" value="Continue"/></div></div><div id="errLight" class="errHidden"><div class="errImage"><img src="' + pageLayout.themePath + 'css/jplayerFC/generalerror.png"/></div><div class="errText">'+darkfaceerrortxt+'<input class="fakeContinue" type="button" value="Continue"/></div></div><div id="affWait" class="errHidden"><img src="' + pageLayout.themePath + 'css/jplayerFC/processing.gif"/></div><div id="affProgressbar" class="hideContainer"><div>'+uploadtxt+' <span id="progPercent">0</span>%</div><div id="affBar"><div id="affBarBg"></div></div></div></div>');
    }

    this.deferred.resolve();
}

jplayerfcdetection.prototype.render = function() {

    this.componentContainer = $('<div>');
    this.componentdiv = $("<div class='col-sm-12 question-component'>");
    this.componentContainer.append(this.nativeContainer.find(".question-text").clone());
    this.componentContainer.attr('id', 'qc_' + this.questionFullName); //change to be more identifable with question?
    this.componentContainer.addClass('qcContainer');
    this.componentdiv.append(this.component);
    this.componentContainer.append(this.componentdiv);
    this.nativeContainer.after(this.componentContainer);
    var playlist = [];
    totalVideos = this.getProperty("sources").split(",");
    for (ii = 0; ii < totalVideos.length; ii++) {
        var source = {
            "image": this.getProperty("imageposter"),
            "sources": []
        };
        var url = totalVideos[ii];		
        url = url.substring(url.toLowerCase().indexOf("multimedia/"));
           
            var initialtype = url.replace(/^.*\.([0-9a-z]+)$/i, "$1");

            var checkMultimedia = url.toLowerCase().indexOf("multimedia/");

            if (checkMultimedia < 0) {
                if (this.getProperty("ischina")) {
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
					if(url.indexOf("8016F8B/") != -1){
						url = (url.split("8016F8B/"))[1];
					}
					
                    //HLS link
                    if (window.location.protocol == "https:") {

                        source["sources"].push({
                            "file": "https://multimedia.kantaroperations.com/8316F8B/" + url + ".m3u8"

                        });

                    } else {
                        source["sources"].push({
                            "file": "http://multimedia.kantaroperations.com/8316F8B/" + url + ".m3u8"

                        });
                    }

                    //Normal MP4 link
                    if (window.location.protocol == "https:") {
                        source["sources"].push({
                            "file": "https://multimedia.kantaroperations.com/8016F8B/" + url
                        });
                    } else {
                        source["sources"].push({
                            "file": "http://multimedia.kantaroperations.com/8016F8B/" + url
                        });
                    }
                }
            } else {

                if (this.getProperty("ischina")) {
                    if (window.location.protocol == "https:") {
                        source["sources"].push({
                            "file": "https://multimedia.kantaroperations.com/8016F8B/" + url

                        });
                    } else {
                        source["sources"].push({
                            "file": "http://multimedia.kantaroperations.com/8016F8B/" + url

                        });
                    }

                } else {
                    //HLS link
                    if (window.location.protocol == "https:") {

                        source["sources"].push({
                            "file": "https://multimedia.kantaroperations.com/8316F8B/origin.tns-global.com/" + url + ".m3u8"

                        });
                    } else {
                        source["sources"].push({
                            "file": "http://multimedia.kantaroperations.com/8316F8B/origin.tns-global.com/" + url + ".m3u8"

                        });
                    }

                    //Normal MP4 link
                    if (window.location.protocol == "https:") {
                        source["sources"].push({
                            "file": "https://multimedia.kantaroperations.com/8016F8B/origin.tns-global.com/" + url
                        });
                    } else {
                        source["sources"].push({
                            "file": "http://multimedia.kantaroperations.com/8016F8B/origin.tns-global.com/" + url
                        });
                    }
                }
            }
        playlist.push(source);
    }

    if (this.getProperty("technology") == 'flash') {
        var jwSettings = {
            playlist: playlist,
            volume: this.getProperty("volume"),
            messagePlay1: this.getProperty("messageplay1"),
            messagePlay2: this.getProperty("messageplay2"),
            messagePlay3: this.getProperty("messageplay3"),
            controlsRate: this.getProperty("controlsrate"),
            customSize: this.getProperty("customsize"),
            width: this.getProperty("width"),
            height: this.getProperty("height"),
            playCount: this.getProperty("playcount"),
            aspectRatio: this.getProperty("aspectratio"),
            gpFile: this.getProperty("gpfile"),
			androidhls: this.getProperty("androidhls"),
			hlshtml: this.getProperty("hlshtml"),
            adName: this.getProperty("adname")
        };

        var affSettings = {
            projectCode: this.getProperty("projectcode"),
            participantId: this.getProperty("participantid"),
            apiKey: this.getProperty("key"),
            viewSequence: this.getProperty("viewsequence"),
            server: this.getProperty("server"),
            frameQuality: this.getProperty("framequality"),
            movieId: this.getProperty("movieid")
        };
    } else {
        var jwSettings = {
            playlist: playlist,
            volume: this.getProperty("volume"),
            messagePlay1: this.getProperty("messageplay1"),
            messagePlay2: this.getProperty("messageplay2"),
            messagePlay3: this.getProperty("messageplay3"),
            controlsRate: this.getProperty("controlsrate"),
            customSize: this.getProperty("customsize"),
            width: this.getProperty("width"),
            height: this.getProperty("height"),
            playCount: this.getProperty("playcount"),
            aspectRatio: this.getProperty("aspectratio"),
            gpFile: this.getProperty("gpfile"),
			androidhls: this.getProperty("androidhls"),
			hlshtml: this.getProperty("hlshtml"),
            adName: this.getProperty("adname")
        };
        var affSettings = {
            project_code: this.getProperty("projectcode"),
            participant_id: this.getProperty("participantid"),
            movie_id: this.getProperty("movieid"),
			api_key: this.getProperty("key"),
			server: this.getProperty("server")
        };
    }

    videoPlayer.init(jwSettings, affSettings);
    this.nativeContainer.hide();
    pageLayout.next.hide();
    pageLayout.prev.hide();
}
jplayerfcdetection.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + jplayerfcdetection.prototype.type()));

    return {
        'sources': '',
		'technology' : 'webrtc',
        'volume': 50,
        'messageplay1': 'When you are ready to play the ad, click on the play button below.',
        'messageplay2': 'We would like you to watch the ad one more time.',
        'messageplay3': 'We would now like you to watch the ad again all the way through before continuing with the survey.  When you are ready to play the ad, click on the play button below.',
        'playcount': 2,
        'aspectratio': '16:9',
        'controlsrate': false,
        'customsize': false,
        'width': 720,
        'height': 340,
        'gpfile': '',
        'adname': 'testad_short.mp4',
        'projectcode': 'linkvideotest',
        'participantid': '53_1039483136',
        'movieid': 'testad_short',
        'key': '666a5991-fbcb-4cb8-9dca-5779d3dbe6fd',
        'viewqequence': '',
        'server': 'https://labs-portal.affectiva.com',
        'framequality': '?version=videoquality',
        'imageposter': "",
		'androidhls': true,
		'hlshtml': true,
		'ischina': false,
		'introtxt' : 'Intro Text.',
		'uploadtxt' : 'Uploading',
		'instructionstxt' : 'Select Allow in the window above.<br/>If using Google Chrome, also select Allow at the top of the browser.<p/>Your face should fill the oval and be well lit from the front.<p/>Avoid having other people in the frame while the webcam is recording.<p/>Select Continue when you are ready.',
		'missfaceerrortxt':'We cannot see your face in the oval. <p/>If using Google Chrome, make sure you have selected Allow at the top of the browser. <p/>Move your head or the camera or adjust the lighting so you can clearly see your face filling the oval. <p/>Select Continue when you are ready. <p/>',
		'facenotfiterrortxt':'Your face doesnt fill the oval. <p/>Move your head or the camera so you can clearly see your face filling the oval. <p/>Click Continue when you are ready. <p/>',
		'darkfaceerrortxt':'Its too dark to see your face. <p/>Your face should be well lit from the front. Avoid having strong lighting behind your head. <p/>Select Continue when you are ready. <p/>'
		
    }

}

