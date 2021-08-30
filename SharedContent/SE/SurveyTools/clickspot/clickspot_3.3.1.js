/**
 * clickspot class
 * Inherits from SESurveyTool
 */
function clickspot(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
clickspot.prototype = Object.create(SESurveyTool.prototype);
clickspot.prototype.type = function() {
    return "clickspot";
}

clickspot.prototype.getDependencies = function() {
    return [{
        'type': 'script',
        'url': surveyPage.path + 'lib/KO/Clickspot/1.4/intouchClickSpot-min.js'
    }, {
        'type': 'script',
        'url': pageLayout.sharedContent + 'LAF/Lib/Excanvas/excanvas.js'
    }];
}


clickspot.prototype.build = function() {
    var compRTL = this.getProperty("comprtl");
    if (compRTL == true) {
        var alignDiv = "";
        var alignDivClose = "";
    } else {
        var alignDiv = "<center>";
        var alignDivClose = "</center>";
    }
    //this.component = $(alignDiv+" <div id='appHolder'> <canvas id='CSCanvas' style='direction:ltr'> </canvas>	<div> </div>	<span> 	<input id='CSClearBtn' type='button' value='Reset All'> </input>	<input id='CSUndoBtn' type='button' value='Undo Last'> </input>	</span> </div> "+alignDivClose);
    this.component = $(alignDiv + " <div id='appHolder'> <canvas id='CSCanvas' style='direction:ltr'> </canvas>	<div> </div>	<span><input id='CSClearBtn' class='btn btn-rounded' type='button' value='Reset All'/><input id='CSUndoBtn' class='btn btn-rounded' type='button' value='Undo Last'/>	</span> </div> " + alignDivClose);

    this.deferred.resolve();
}

clickspot.prototype.render = function() {
    this.componentContainer = $('<div>');
    this.componentdiv = $("<div class='col-sm-12 question-component'>");
    this.componentContainer.append(this.nativeContainer.find(".question-text").clone());
    this.componentContainer.attr('id', 'qc_' + this.questionFullName); //change to be more identifable with question?
    this.componentContainer.addClass('qcContainer');
    this.componentdiv.append(this.component);
    this.componentContainer.append(this.componentdiv);
    this.nativeContainer.after(this.componentContainer);
    $(".container").css({
        "width": "100%",
        "max-width": "100%"
    });
    minClicks = this.getProperty("minclicks");
    autoSubmitMilliSec = this.getProperty("autosubmittime");
    pageLayout.showLoader()
    if (typeof surveyPlatform == "undefined") {
        clickSpotImageSrc = this.options.imagename;
    } else if (surveyPlatform == "Nfield") {
        clickSpotImageSrc = pageLayout.questions.find("img").attr("src").split("?")[0];
    }
    useImageDimensions = true;
    clickSpotAppWidth = 220;
    clickSpotAppHeight = 400;
    maxClicks = this.getProperty("maxclicks");
    spotRadius = this.getProperty("spotradius");
    spotFillColor = this.getProperty("spotfillcolor");
    spotStrokeWidth = this.getProperty("spotstrokewidth");
    spotStrokeColor = this.getProperty("spotstrokecolor");
    spotTextFont = this.getProperty("spottextfont");
    globalCheck = "true";
    intouchClickSpotApp = null;
    resetLabel = this.getProperty("resetlabel");
    undoLabel = this.getProperty("undolabel");
    buttonBGColor = this.getProperty("resetbgcolor");
    buttonBGColor1 = this.getProperty("undobgcolor");
    buttonTextColor = this.getProperty("undoresettextcolor");
    showReset = this.getProperty("showreset");
    showUndo = this.getProperty("showundo");
	imageSize = this.getProperty("imagesize");

    function init() {
        if (intouchClickSpotApp == null) {
            intouchClickSpotApp = new intouchClickSpot();
        }
    }
    init();

    if (typeof surveyPlatform != "undefined" && surveyPlatform == "Nfield") {
        this.componentContainer.find("img").hide();
    }
    this.componentContainer.find("img").hide();
    this.nativeContainer.hide();
    var compRTL = this.getProperty("comprtl");
    if (compRTL == true) {
        this.componentContainer.css("direction", 'rtl');
    }
}
clickspot.prototype.toolOptions = function() {
    $.extend(this.options, this.options.clickspot);
    switch (pageLayout.deviceType.toUpperCase()) {
        case "LARGETABLET":
        case "MEDIUMTABLET":
        case "SMALLTABLET":
        case "SMARTPHONETOUCH":
            return {
                'imagename': "",
                'maxclicks': 3,
                'spotradius': 15,
                //						'spotfillcolor' : "#0000FF",
                'spotstrokewidth': 3,
                //						'spotstrokecolor' : "#000000",
                'autosubmittime': "",
                'minclicks': 3,
                //						'undoresetbgcolor' : "#8EA85F",
                //						'undoresettextColor' : "#FFFFFF",
                'resetlabel': "Reset All",
                'undolabel': "Undo Last",
                'showreset': true,
                'showundo': true,
                'comprtl': false,
                'spottextfont': "10px verdana",
				'imagesize':0.7
            }
        case "PC":
        case "OTHERDEVICE":
        default:
            return {
                'imagename': "",
                'maxclicks': 3,
                'spotradius': 15,
                //						'spotfillcolor' : "#0000FF",
                'spotstrokewidth': 3,
                //						'spotstrokecolor' : "#000000",
                'autosubmittime': "",
                'minclicks': 3,
                //						'undoresetbgcolor' : "#8EA85F",
                //						'undoresettextcolor' : "#FFFFFF",
                'resetlabel': "Reset All",
                'undolabel': "Undo Last",
                'showreset': true,
                'showundo': true,
                'comprtl': false,
                'spottextfont': "10px verdana",
				'imagesize':0.7
            }
    }
}