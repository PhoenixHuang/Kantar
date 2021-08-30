/**
 * clickbasedhighlighter class
 * Inherits from SESurveyTool
 */
function clickbasedhighlighter(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
clickbasedhighlighter.prototype = Object.create(SESurveyTool.prototype);
clickbasedhighlighter.prototype.type = function(){
    return "clickbasedhighlighter";
}

clickbasedhighlighter.prototype.getDependencies = function(){
    return [
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/ClickbasedHighlighter/slice_v2.js'},
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/ClickbasedHighlighter/rgbcolor.js'}
	];	
}

clickbasedhighlighter.prototype.setResponses = function (){
	if(typeof surveyPlatform=="undefined"){
		var response =$('#_Q0').val()
	}else if(surveyPlatform=="Nfield"){
		var response =pageLayout.allInputs.filter("textarea").val();
	}
	var response =pageLayout.allInputs.filter("textarea").val();
	$.each(this.inputs.filter('textarea'), function (i, e) {
		  $(e).val(response)  	
	});

}
clickbasedhighlighter.prototype.build = function(){
        
		this.component = $("<center> <div id='csPreloader'>  <div> <img src='"+pageLayout.themePath+"images/ajax-loader.gif' id='preloader_image' /> </div> </div> </center>");
        
		this.deferred.resolve();
}

clickbasedhighlighter.prototype.render = function(){
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
		this.componentContainer.append($('center'))
        this.componentContainer.attr('id','qc_'+this.questionName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer);
		var hgltrClickBased =  new MakeDiv()
		var fhProperties;
        
		if(typeof surveyPlatform=="undefined"){
			var imgpath = this.getProperty("imgPath")
		}else if(surveyPlatform=="Nfield"){
			var imgpath = pageLayout.questions.find("img").attr("src").split("?")[0]
		}

		//alert(pageLayout.questions.find("img").eq(0).attr("src").split("?")[0]);
		fhProperties={

			 "imgpath":imgpath,
			 "imgwidth":this.getProperty("imgWidth"),
			 "imgheight":this.getProperty("imgHeight"),
			 "noopinion":this.getProperty("noOpinion"),
			 "sliceinfo":this.getProperty("sliceInformation"),
			 "likeslicecolor":this.getProperty("likeSliceColor"),
			 "unlikeslicecolor":this.getProperty("unlikeSliceColor"),
			 "opacityval":this.getProperty("opacityValue"),
			 "neutral":this.getProperty("neutral"),
			 "like":this.getProperty("like"),
			 "dislike":this.getProperty("dislike"),
			 "preloadimgid":"csPreloader",
			 "buttonBGColor":this.getProperty("clearNoopinionBGColor"),
			 "buttonTextColor":this.getProperty("clearNoopinionTextColor"),
			 "clearBTN":this.getProperty("clearLabel"),
			 "noopinionBTN":this.getProperty("noOpinionLabel"),
			 "clearBTNShow":this.getProperty("clearShow"),
			 "contnrId":"qc_"+this.questionName,
			 "compRTL":this.getProperty("compRTL")
            }
		        
		hgltrClickBased.init(fhProperties);
		if(typeof surveyPlatform != "undefined" && surveyPlatform=="Nfield"){
			this.label.find("img").hide();
		}
		
        this.nativeContainer.hide();
		
		var compRTL=this.getProperty("compRTL");
		if(compRTL == true){
			this.componentContainer.css( "direction", "rtl" );
		}
    }
clickbasedhighlighter.prototype.toolOptions = function() {
        $.extend(this.options, eval("this.options."+clickbasedhighlighter.prototype.type()));
		switch(pageLayout.deviceType.toUpperCase()) {
            case "LARGETABLET":
            case "MEDIUMTABLET":
            case "SMALLTABLET":
            case "SMARTPHONETOUCH":
                return  {
                        'imgPath' : "",
                        'imgWidth' : "",
                        'imgHeight' : "",
						'sliceInformation':"",
//                        'likeSliceColor' : "green",
//                        'unlikeSliceColor' : "red",
                        'opacityValue' : 0.4,
                        'like' : true,
                        'dislike' : true,
						'neutral' : true,
                        'noOpinion' : true,
//                        'clearNoopinionBGColor' : "#8EA85F",
//                        'clearNoopinionTextColor' : "#FFFFFF",
                        'clearLabel' : "Clear",
                        'noOpinionLabel' : "No-Opinion",
                        'clearShow' : true,
						'compRTL':false					
				    }
            case "PC":
            case "OTHERDEVICE":
            default:
                return {
                        'imgPath' : "",
                        'imgWidth' : "",
                        'imgHeight' : "",
						'sliceInformation':"",
//                        'likeSliceColor' : "green",
//                        'unlikeSliceColor' : "red",
                        'opacityValue' : 0.4,
                        'like' : true,
                        'dislike' : true,
						'neutral' : true,
                        'noOpinion' : true,
//                        'clearNoopinionBGColor' : "#8EA85F",
//                        'clearNoopinionTextColor' : "#FFFFFF",
                        'clearLabel' : "Clear",
                        'noOpinionLabel' : "No-Opinion",
                        'clearShow' : true,
						'compRTL':false						
                }
        }
}