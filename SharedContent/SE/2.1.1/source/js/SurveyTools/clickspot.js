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
		this.component = $("<center> <br/><br/><div id='csPreloader'> <div> <img src='"+pageLayout.themePath+"images/ajax-loader.gif' id='preloader_image' /> </div> </div> </center>	<center> <div id='appHolder'> <canvas id='CSCanvas' > </canvas>	<div> </div>	<span> 	<input id='CSClearBtn' type='button' value='Reset All'> </input>	<input id='CSUndoBtn' type='button' value='Undo Last'> </input>	</span> </div> </center>");
        
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
		 clickSpotImageSrc =this.options.ImageName ; 
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
		this.nativeContainer.hide();
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
						'showUndo' : true						
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
						'showUndo' : true	
                }
        }
}