/**
 * videoplayer class
 * Inherits from SESurveyTool
 */
function videoplayer(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
videoplayer.prototype = Object.create(SESurveyTool.prototype);
videoplayer.prototype.type = function(){
    return "videoplayer";
}
videoplayer.prototype.getDependencies = function(){
    return [
		
		{'type':'script', 'url' :  pageLayout.sharedContent+'LAF/Lib/Video/video.js'},
		{'type':'script', 'url' :  pageLayout.sharedContent+'LAF/Lib/jQueryUI/jquery-ui.js'},
		{'type':'script', 'url' :  pageLayout.sharedContent+'LAF/Lib/jQueryUI/jquery.ui.touch-punch.js'},
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/videoplayer/videoplayer.js'},
		{'type':'stylesheet', 'url' : pageLayout.themePath + 'css/jquery-ui.css'},
		{'type':'stylesheet', 'url' : pageLayout.themePath + 'css/video-js.css'},
		{'type':'stylesheet', 'url' : pageLayout.themePath + 'css/videoplayer_v6.css'}
    ];
}
videoplayer.prototype.build = function(){
		var videotype = this.getProperty("videotype");
		if(videotype == "Normal"){
		this.component = $("<div id='wrapper'><div id='vidParent' ></div><div id='slider' style='position:relative;width:50%;margin:auto;margin-top:20px;min-width:250px;'><div id='slider-ui' ></div><span id='min' class='tick'></span><span id='max' class='tick' style='left:100%;'></span><textarea id='output' style='position:absolute;top:40px;width:100%;height:60px;'></textarea></div></div>");
		}else if(videotype == "Slider"){
		this.component = $("<div id='wrapper'><div id='vidParent' ></div><div id='slider' style='position:relative;width:50%;margin:auto;margin-top:20px;min-width:250px;'><div id='slider-ui' ></div><span id='min' class='tick'></span><span id='mid' class='tick' style='left:50%;'></span><span id='max' class='tick' style='left:100%;'></span></div><div id='playBtn' class='playBtnClass'><img id='playIcon' class='playIconClass' src='"+pageLayout.themePath+"se/images/dummy.gif' width='1' height='1' /><span id='playText' class='playTextClass'>Play</span></div><div style='margin:auto;width:50%;bottom:10px;padding:20px;'><textarea id='output' style='position:relative;top:40px;width:100%;height:60px;'></textarea></div></div>");
		}
		this.deferred.resolve();		 
}
videoplayer.prototype.render = function(){
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer);
		var videotype = this.getProperty("videotype");
		var props;
		if(videotype == "Normal"){
			props ={
            "videoID":this.getProperty("videoID"),
            "videoParent":this.getProperty("videoParent"),
            "source":{
                "mp4":this.getProperty("mp4Path"),
                "webm":this.getProperty("webmPath")
            },
            "preload":this.getProperty("preload"),
            "width":this.getProperty("width"),
            "height":this.getProperty("height"),
            "controls": this.getProperty("controls"),
            "autoplay":this.getProperty("autoplay"),
            "autosbmt":this.getProperty("autoSubmit"),
            "playBtnBGColor":this.getProperty("playBtnBGColor"),
            "WaterMark":{
                "color":this.getProperty("color"),
                "backgroundColor":this.getProperty("backgroundColor"),
                "isRequired":this.getProperty("isRequired"),
                "text":this.getProperty("text")
            },
            "navbtn":this.getProperty("navigationShow"),
            "nextButtonId":this.getProperty("nextButtonId"),
            "output":{
                "id":this.getProperty("id"),
                "visible":this.getProperty("visible")
            },
            "slider":{
                "visible":this.getProperty("visible"),
                "min":this.getProperty("min"),
                "max":this.getProperty("max"),
                "step":this.getProperty("step"),
                "value":this.getProperty("value"),
                "ratingInterval":this.getProperty("ratingInterval"),
                "start":this.getProperty("start"),
                "end":this.getProperty("end"),
                "middle":this.getProperty("middle")
			},
            "playButton":this.getProperty("playButton")
		 }

		}else if(videotype == "Slider"){
		props ={
			"videoID":this.getProperty("videoID"),
			"videoParent":this.getProperty("videoParent"),
			"source":
				{
				"mp4":this.getProperty("mp4Path"),
				"webm":this.getProperty("webmPath")
				},
			"preload":this.getProperty("preload"),
			"width":this.getProperty("width"),
			"height":this.getProperty("height"),
			"controls": this.getProperty("slidercontrols"),
			"autoplay":this.getProperty("autoplay"),
			"autosbmt":this.getProperty("autoSubmit"),
			"playBtnBGColor":this.getProperty("playBtnBGColor"),
			"WaterMark":
				{
				 "color":this.getProperty("color"),
				 "backgroundColor":this.getProperty("backgroundColor"),
				 "isRequired":this.getProperty("isRequired"),
				 "text":this.getProperty("text")
				},
			"navbtn":this.getProperty("navigationShow"),
			"nextButtonId":this.getProperty("nextButtonId"),
			"output":
				{
				"id":this.getProperty("id"),
				 "visible":this.getProperty("visible")
				},
			"slider":
				{
				"visible":this.getProperty("slidervisible"),
				 "min":this.getProperty("min"),
				 "max":this.getProperty("max"),
				 "step":this.getProperty("step"),
				 "value":this.getProperty("value"),
				 "ratingInterval":this.getProperty("ratingInterval"),
				 "start":this.getProperty("start"),
				 "end":this.getProperty("end"),
				 "middle":this.getProperty("middle")
				},
			"playButton":this.getProperty("sliderplayButton")
}
		}
		var videoplayerapp = new VideoPlayer();
		videoplayerapp.init(props);
	    this.nativeContainer.hide();
    }
videoplayer.prototype.toolOptions = function() {
        $.extend(this.options, eval("this.options."+videoplayer.prototype.type()));
		switch(pageLayout.deviceType.toUpperCase()) {
            case "LARGETABLET":
            case "MEDIUMTABLET":
            case "SMALLTABLET":
            case "SMARTPHONETOUCH":
                return  {	'isSkinRequired' : false,
							'skinImage' : pageLayout.themePath+"se/images/skin.png",
							'top' : 34,
							'left' : 36,
							'right' :35,
							'bottom' : 130,
							'width-slider' : 729,
							'height-slilder' : 413,
							'videoID' : "vidPlayer",
							'videoParent' : "vidParent",
							'preload' : "auto",
							'width' : 500,
							'height' : 280,
							'controls' : true,
							'slidercontrols' : false,
							'autoplay' : false,
//							'playBtnBGColor' : "#FF00FF",
//							'color' : "#FFFFFF",
//							'backgroundColor' : "#FF00FF",
							'isRequired' : true,
							'text' : "test",
							'nextButtonId' : "standardnav",
							'id' : "output",
							'visible' : true,
							'min' : -50,
							'max' : 50,
							'step' : 1,
							'value' : 0,
							'ratingInterval' : 500,
							'start' : "Boring",
							'end' : "Interesting",
							'middle' : "Neither interesting nor boring",
							'playButton' : false,
							'sliderplayButton' : true,	
							'slidervisible' : true,
							'navigationShow': true,
							'autoSubmit':false
							 

				}
            case "PC":
            case "OTHERDEVICE":
            default:
                return {	'isSkinRequired' : false,
							'skinImage' : pageLayout.themePath+"se/images/skin.png",
							'top' : 34,
							'left' : 36,
							'right' :35,
							'bottom' : 130,
							'width-slider' : 729,
							'height-slilder' : 413,
							'videoID' : "vidPlayer",
							'videoParent' : "vidParent",
							'preload' : "auto",
							'width' : 500,
							'height' : 280,
							'controls' : true,
							'slidercontrols' : false,
							'autoplay' : false,
//							'playBtnBGColor' : "#FF00FF",
//							'color' : "#FFFFFF",
//							'backgroundColor' : "#FF00FF",
							'isRequired' : true,
							'text' : "",
							'nextButtonId' : "standardnav",
							'id' : "output",
							'visible' : false,
							'min' : -50,
							'max' : 50,
							'step' : 1,
							'value' : 0,
							'ratingInterval' : 500,
							'start' : "Boring",
							'end' : "Interesting",
							'middle' : "Neither interesting nor boring",
							'playButton' : false,
							'sliderplayButton' : true,	
							'slidervisible' : true,
							'navigationShow': true,
							'autoSubmit':false

                }
        }
}