/**
 * virtualhighlighter class
 * Inherits from SESurveyTool
 */
function virtualhighlighter(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
virtualhighlighter.prototype = Object.create(SESurveyTool.prototype);
virtualhighlighter.prototype.type = function(){
    return "virtualhighlighter";
}

virtualhighlighter.prototype.getDependencies = function(){
    return [
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/FreehandHighlighter/FreeHandApp_v39.js'},
		{'type':'script', 'url' : pageLayout.sharedContent+'LAF/Lib/Excanvas/excanvas.js'}
	];	
}

virtualhighlighter.prototype.setResponses = function (){
   
    var response =$('#_QO').val()
	$.each(this.inputs.filter('textarea'), function (i, e) {
		  $(e).val(response.slice(i*4000,(i+1)*4000))  
			
	});

}
virtualhighlighter.prototype.build = function(){
var compRTL=this.getProperty("compRTL");
		if(compRTL == true){
			var alignDiv = "right";	
		}else{
			var alignDiv = "";	
		}
		
        var compType=this.getProperty("compType");
		this.component = $("<div id='KOFHparent'><center style='text-align:"+alignDiv+"'><canvas id='KOFHCanvas' ></canvas><br /><span><input id='KOFHclearBtn' type='button' value='Clear' style='background: #006666;color: #fff;border: solid 2px #FFF;padding-Left: 10px;padding-Right: 10px; padding-Top: 5px;padding-Bottom: 5px; border-Radius: 5px;cursor:pointer; '></input><input id='KOFHnoopnBtn' type='button' value='Noopinion' style='background: #006666;color: #fff;border: solid 2px #FFF;padding-Left: 10px;padding-Right: 10px; padding-Top: 5px;padding-Bottom: 5px; border-Radius: 5px;cursor:pointer; '> </input><input id='KOFHshowGrid' type='button' value='Show Grid' style='background: #006666;color: #fff;border: solid 2px #FFF;padding-Left: 10px;padding-Right: 10px; padding-Top: 5px;padding-Bottom: 5px; border-Radius: 5px; cursor:pointer;'> </input>          </span><br /><textarea id='KOFHdata' cols='50' rows='5'></textarea><textarea name='_QOE' id='_QO' cols='50' rows='5'></textarea></center></div><div id='KOFHpreloader' style='text-align:center;'><img src='"+pageLayout.themePath+"images/ajax-loader.gif' /></div>");
        
		this.deferred.resolve();
}

virtualhighlighter.prototype.render = function(){
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer);
		$('#_QO').hide();
		$("#survey").css("position","static");
		var compRTL=this.getProperty("compRTL");
		if(compRTL == true){
			this.componentContainer.css( "direction", 'rtl' );
		}
		
		var freehandApp =  new FreeHandApplication()
		var fhProperties;
                    
        
		
		fhProperties={
			 "imgPath":this.getProperty("imgPath") ,
			 "imgWidth":this.getProperty("imgWidth"), "imgHeight":this.getProperty("imgHeight"),
			 "cellSize":this.getProperty("cellSize"),
			 "drawColor":this.getProperty("drawColor"),
			 "alpha":this.getProperty("alpha"),
			 "lineWidth":this.getProperty("lineWidth"),
			 "debuggerMode":this.getProperty("debuggerMode"),
			 "gridColor":this.getProperty("gridColor"),
			 "autoDimensions":this.getProperty("autoDimensions"),
			 "noopnbtnhide":this.getProperty("noOpinionHide"),
			 "parentID":this.getProperty("parentID"),
			 "canvasID":this.getProperty("canvasID"),
			 "imagePreloader":this.getProperty("imagePreloader"),
			 "clearButton":this.getProperty("clear"),
			 "noOpnButton":this.getProperty("noOpinion"),
			 "showGridButton":this.getProperty("showGrid"),
			 "dataTextArea":this.getProperty("dataTextArea"),
			 "jsQid":"_QOE",
			 "cursorPath":this.getProperty("cursorPath"),
			 "buttonBGColor":this.getProperty("clearNoopinionBGColor"),
			 "buttonTextColor":this.getProperty("clearNoopinionTextColor"),
			 "clearButtonHide":this.getProperty("clearHide"),
			 "clearLabel":this.getProperty("clearLabel"),
			 "showLabel":this.getProperty("showGridLabel"),
			 "showLabe2":this.getProperty("hideGridLabel"),
			 "noOpinionLabel":this.getProperty("noOpinionLabel"),
			 "textAreaID":this.getProperty("textAreaID")
            }

		freehandApp.init(fhProperties);
        this.nativeContainer.hide();
    }
virtualhighlighter.prototype.toolOptions = function() {
        $.extend(this.options, eval("this.options."+virtualhighlighter.prototype.type()));
		switch(pageLayout.deviceType.toUpperCase()) {
            case "LARGETABLET":
            case "MEDIUMTABLET":
            case "SMALLTABLET":
            case "SMARTPHONETOUCH":
                if(this.orientation==0||this.orientation==180) 
				return  {
                        'imgPath' : "",
                        'imgWidth' : "",
                        'imgHeight':"",
						'cellSize' : 20,
//						'drawColor' : "#ffff00",
						'alpha' : 0.5,
						'lineWidth' : 6,
						'debuggerMode' : false,
//						'gridColor' : "#000000",
						'autoDimensions' : true,
						'noOpinionHide' : false,
//						'clearNoopinionBGColor' : "#8EA85F",
//						'clearNoopinionTextColor' : "#FFFFFF",
						'clearHide' : false,
						'clearLabel' : "Clear",
						'showGridLabel' : "Show Grid",
						'hideGridLabel' : "Hide Grid",
						'noOpinionLabel' : "No Opinion",
						'cursorPath': "http://cdn.tns-global.com/Multimedia/AP/UI/pen4.ico", 
                        'parentID':'KOFHparent' ,
						'canvasID':'KOFHCanvas' , 
						'imagePreloader':'KOFHpreloader' , 
						'clear':'KOFHclearBtn',
						'noOpinion':'KOFHnoopnBtn' , 
						'showGrid':'KOFHshowGrid' ,
						'dataTextArea':'KOFHdata',
                        'textAreaID':'_QO',
						'compRTL':false
				    }
				else
                	return  {
                        'imgPath' : "",
                        'imgWidth' : "",
                        'imgHeight':"",
						'cellSize' : 20,
//						'drawColor' : "#ffff00",
						'alpha' : 0.5,
						'lineWidth' : 6,
						'debuggerMode' : false,
//						'gridColor' : "#000000",
						'autoDimensions' : true,
						'noOpinionHide' : false,
//						'clearNoopinionBGColor' : "#8EA85F",
//						'clearNoopinionTextColor' : "#FFFFFF",
						'clearHide' : false,
						'clearLabel' : "Clear",
						'showGridLabel' : "Show Grid",
						'hideGridLabel' : "Hide Grid",
						'noOpinionLabel' : "No Opinion",
						'cursorPath': "http://cdn.tns-global.com/Multimedia/AP/UI/pen4.ico", 
                        'parentID':'KOFHparent' ,
						'canvasID':'KOFHCanvas' , 
						'imagePreloader':'KOFHpreloader' , 
						'clear':'KOFHclearBtn',
						'noOpinion':'KOFHnoopnBtn' , 
						'showGrid':'KOFHshowGrid' ,
						'dataTextArea':'KOFHdata',
                        'textAreaID':'_QO',
						'compRTL':false			
				    }			
            case "PC":
            case "OTHERDEVICE":
            default:
                return {
                        'imgPath' : "",
                        'imgWidth' : "",
                        'imgHeight':"",
						'cellSize' : 20,
//						'drawColor' : "#ffff00",
						'alpha' : 0.5,
						'lineWidth' : 6,
						'debuggerMode' : false,
//						'gridColor' : "#000000",
						'autoDimensions' : true,
						'noOpinionHide' : false,
//						'clearNoopinionBGColor' : "#8EA85F",
//						'clearNoopinionTextColor' : "#FFFFFF",
						'clearHide' : false,
						'clearLabel' : "Clear",
						'showGridLabel' : "Show Grid",
						'hideGridLabel' : "Hide Grid",
						'noOpinionLabel' : "No Opinion",
						'cursorPath': "http://cdn.tns-global.com/Multimedia/AP/UI/pen4.ico", 
                        'parentID':'KOFHparent' ,
						'canvasID':'KOFHCanvas' , 
						'imagePreloader':'KOFHpreloader' , 
						'clear':'KOFHclearBtn',
						'noOpinion':'KOFHnoopnBtn' , 
						'showGrid':'KOFHshowGrid' ,
						'dataTextArea':'KOFHdata',
                        'textAreaID':'_QO',
						'compRTL':false
                }
        }
}