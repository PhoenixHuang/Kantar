/**
 * clickspot class
 * Inherits from SESurveyTool
 */
function clickspot(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
clickspot.prototype = Object.create(SESurveyTool.prototype);
clickspot.prototype.type = function(){
    return "clickspot";
}

clickspot.prototype.getDependencies = function(){
    return [
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/Clickspot/intouchClickSpot-min.js'},
		{'type':'script', 'url' : pageLayout.sharedContent+'LAF/Lib/Excanvas/excanvas.js'}
	];	
}


clickspot.prototype.build = function(){
var compRTL=this.getProperty("compRTL");
		if(compRTL == true){
			var alignDiv = "";	
			var alignDivClose = "";
		}else{
			var alignDiv = "<center>";	
			var alignDivClose = "</center>";	
		}
		this.component = $("<center> <br/><br/><div id='csPreloader'> <div> <img src='"+pageLayout.themePath+"images/ajax-loader.gif' id='preloader_image' /> </div> </div> </center>	"+alignDiv+" <div id='appHolder'> <canvas id='CSCanvas' style='direction:ltr'> </canvas>	<div> </div>	<span> 	<input id='CSClearBtn' type='button' value='Reset All'> </input>	<input id='CSUndoBtn' type='button' value='Undo Last'> </input>	</span> </div> "+alignDivClose);
        
		this.deferred.resolve();
}

clickspot.prototype.render = function(){
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer);
		
		 minClicks = this.getProperty("MinClicks"); 
		 autoSubmitMilliSec = this.getProperty("AutoSubmitTime"); 
		 
		if(typeof surveyPlatform=="undefined"){
			clickSpotImageSrc =this.options.ImageName ; 
		}else if(surveyPlatform=="Nfield"){
			clickSpotImageSrc =pageLayout.questions.find("img").attr("src").split("?")[0] ; 
		}
		 useImageDimensions = true;
		 clickSpotAppWidth = 220; 
		 clickSpotAppHeight =400 ;
		 maxClicks =this.getProperty("MaxClicks") ;
		 spotRadius = this.getProperty("SpotRadius");
		 spotFillColor = this.getProperty("SpotFillColor"); 
		 spotStrokeWidth =this.getProperty("SpotStrokeWidth") ;
		 spotStrokeColor = this.getProperty("SpotStrokeColor"); 
		 globalCheck = "true"; 
		 intouchClickSpotApp = null;
		 resetLabel = this.getProperty("resetLabel"); 
		 undoLabel =this.getProperty("undoLabel");
		 buttonBGColor = this.getProperty("undoResetBGColor"); 
		 buttonTextColor = this.getProperty("undoResetTextColor"); 
		 showReset = this.getProperty("showReset"); 
		 showUndo = this.getProperty("showUndo");
		function init() { if(intouchClickSpotApp == null) { intouchClickSpotApp = new intouchClickSpot(); }  	}
        init();
		if(typeof surveyPlatform!="undefined" && surveyPlatform == "Nfield"){
			this.componentContainer.find("img").hide();
		}
		this.componentContainer.find("img").hide();
		this.nativeContainer.hide();
		var compRTL=this.getProperty("compRTL");
		if(compRTL == true){
			this.componentContainer.css( "direction", 'rtl' );
		}
    }
clickspot.prototype.toolOptions = function() {
        $.extend(this.options, eval("this.options."+clickspot.prototype.type()));
		switch(pageLayout.deviceType.toUpperCase()) {
            case "LARGETABLET":
            case "MEDIUMTABLET":
            case "SMALLTABLET":
            case "SMARTPHONETOUCH":
                return  {
                        'ImageName' : "",
						'MaxClicks' : 3,
						'SpotRadius' : 15,
//						'SpotFillColor' : "#0000FF",
						'SpotStrokeWidth' : 3,
//						'SpotStrokeColor' : "#000000",
						'AutoSubmitTime' : "",
						'MinClicks' : 3,
//						'undoResetBGColor' : "#8EA85F",
//						'undoResetTextColor' : "#FFFFFF",
						'resetLabel' : "Reset All",
						'undoLabel' : "Undo Last",
						'showReset' : true,
						'showUndo' : true,
						'compRTL':false						
				    }
            case "PC":
            case "OTHERDEVICE":
            default:
                return {
                        'ImageName' : "",
						'MaxClicks' : 3,
						'SpotRadius' : 15,
//						'SpotFillColor' : "#0000FF",
						'SpotStrokeWidth' : 3,
//						'SpotStrokeColor' : "#000000",
						'AutoSubmitTime' : "",
						'MinClicks' : 3,
//						'undoResetBGColor' : "#8EA85F",
//						'undoResetTextColor' : "#FFFFFF",
						'resetLabel' : "Reset All",
						'undoLabel' : "Undo Last",
						'showReset' : true,
						'showUndo' : true,
						'compRTL':false	
                }
        }
}