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
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/Clickspot/excanvas.js'}
	];	
}


clickspot.prototype.build = function(){
        
		this.component = $("<center> <div id='csPreloader'> Image loading... <div> <img src='"+surveyPage.path +"lib/KO/Clickspot/preloader.gif' id='preloader_image' /> </div> </div> </center>	<center> <div id='appHolder'> <canvas id='CSCanvas' > </canvas>	<div> </div>	<span> 	<input id='CSClearBtn' type='button' value='Reset All'> </input>	<input id='CSUndoBtn' type='button' value='Undo Last'> </input>	</span> </div> </center>");
        
		this.deferred.resolve();
}

clickspot.prototype.render = function(){
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer);
		
		 minClicks = this.getProperty("vCompMinClicks"); 
		 autoSubmitMilliSec = this.getProperty("vCompAutoSubMilliSec"); 
		 clickSpotImageSrc =this.options.vCompImageName ; 
		 useImageDimensions = true;
		 clickSpotAppWidth = 220; 
		 clickSpotAppHeight =400 ;
		 maxClicks =this.getProperty("vCompMaxClicks") ;
		 spotRadius = this.getProperty("vCompSpotRadius");
		 spotFillColor = this.getProperty("vCompSpotFillColor"); 
		 spotStrokeWidth =this.getProperty("vCompSpotStrokeWidth") ;
		 spotStrokeColor = this.getProperty("vCompSpotStrokeColor"); 
		 globalCheck = "true"; 
		 csQName = this.getProperty("vCompQName");
		 intouchClickSpotApp = null;
		 resetLabel = this.getProperty("resetLabel"); 
		 undoLabel =this.getProperty("undoLabel");
		 buttonBGColor = this.getProperty("undoResetBGColor"); 
		 buttonTextColor = this.getProperty("undoResetTextColor"); 
		 showReset = this.getProperty("showReset"); 
		 showUndo = this.getProperty("showUndo");
		function init() { if(intouchClickSpotApp == null) { intouchClickSpotApp = new intouchClickSpot(); }  	}
        init();
		this.nativeContainer.hide();
    }
clickspot.prototype.toolOptions = function() {
        switch(pageLayout.deviceType.toUpperCase()) {
            case "LARGETABLET":
            case "MEDIUMTABLET":
            case "SMALLTABLET":
            case "SMARTPHONETOUCH":
                return  {
                        'vCompQName' : "",
                        'vCompImageName' : "",
						'vCompMaxClicks' : 3,
						'vCompSpotRadius' : 15,
						'vCompSpotFillColor' : "#0000FF",
						'vCompSpotStrokeWidth' : 3,
						'vCompSpotStrokeColor' : "#000000",
						'vCompAutoSubMilliSec' : "",
						'vCompMinClicks' : 3,
						'undoResetBGColor' : "#8EA85F",
						'undoResetTextColor' : "#FFFFFF",
						'resetLabel' : "Reset All",
						'undoLabel' : "Undo Last",
						'showReset' : true,
						'showUndo' : true						
				    }
            case "PC":
            case "OTHERDEVICE":
            default:
                return {
				        'vCompQName' : "",
                        'vCompImageName' : "",
						'vCompMaxClicks' : 3,
						'vCompSpotRadius' : 15,
						'vCompSpotFillColor' : "#0000FF",
						'vCompSpotStrokeWidth' : 3,
						'vCompSpotStrokeColor' : "#000000",
						'vCompAutoSubMilliSec' : "",
						'vCompMinClicks' : 3,
						'undoResetBGColor' : "#8EA85F",
						'undoResetTextColor' : "#FFFFFF",
						'resetLabel' : "Reset All",
						'undoLabel' : "Undo Last",
						'showReset' : true,
						'showUndo' : true	
                }
        }
}