/**
 * dynamiclist class
 * Inherits from SESurveyTool
 */
function dynamiclist(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
dynamiclist.prototype = Object.create(SESurveyTool.prototype);
dynamiclist.prototype.type = function(){
    return "dynamiclist";
}
dynamiclist.prototype.getDependencies = function(){
    return [		
		/*{'type':'script', 'url' : surveyPage.path+'lib/KO/DynamicList/dynamiclist.js'},
		{'type':'script', 'url' : surveyPage.path+'lib/KO/DynamicList/jquery.js'},
		{'type':'script', 'url' : surveyPage.path+'lib/KO/DynamicList/jquery-1.js'},
		{'type':'script', 'url' : surveyPage.path+'lib/KO/DynamicList/jquery_autocomplete.js'},
		{'type':'stylesheet', 'url' : surveyPage.path+'lib/KO/DynamicList/main.css'}*/
    ];
}

dynamiclist.prototype.setResponses = function (){
 formSubmitFun()   
}
var optionsInputStr="";
var otherOptionsInputStr="";


dynamiclist.prototype.build = function(){
        $("head").append("<script src="+surveyPage.path+"lib/KO/DynamicList/dynamiclist.js><!-- // SE --></script>");
		$("head").append("<script src="+surveyPage.path+"lib/KO/DynamicList/jquery.js><!-- // SE --></script>");
		$("head").append("<script src="+surveyPage.path+"lib/KO/DynamicList/jquery-1.js><!-- // SE --></script>");
		$("head").append("<script src="+surveyPage.path+"lib/KO/DynamicList/jquery_autocomplete.js><!-- // SE --></script>");
		$("head").append("<link rel='stylesheet' type='text/css' href="+surveyPage.path+"lib/KO/DynamicList/main.css />");
		
		
		
		
        this.deferred.resolve();		 
}

dynamiclist.prototype.render = function(){
        /*this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
		this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer);*/
		
		//this.nativeContainer.hide();
		
		$.each(this.inputs, function (i, e) {
		   var el = $(e);
            label = el.parent().find('label').clone();
			if(el.attr("type")=="text")
			return true;
			
			 if($.trim((el).attr('value'))=="OTHERLIST")
			  {otherOptionsInputStr=otherOptionsInputStr+(el).attr('value')+"$"+$.trim(label.text())+"|"
              optionsInputStr=optionsInputStr+"|";
			  return true;
			  }
			 else
			 optionsInputStr=optionsInputStr+$.trim(label.text())+"^"
		});
		
		
		if (this.getProperty("QNames")=="SingleDynamic")
		{
		 otherOptionsInputStr = otherOptionsInputStr.substring(0, otherOptionsInputStr.length - 1);
		 optionsInputStr = optionsInputStr.substring(0, optionsInputStr.length - 2);
		}
		else{
		otherOptionsInputStr = otherOptionsInputStr.substring(0, otherOptionsInputStr.length - 1);
		optionsInputStr = optionsInputStr.substring(0, optionsInputStr.length - 1);
		optionsInputStr=optionsInputStr.split("|");
		optionsInputStr[0] = optionsInputStr[0].substring(0, optionsInputStr[0].length - 1);
		optionsInputStr[1] = optionsInputStr[1].substring(0, optionsInputStr[1].length - 1);
		optionsInputStr=optionsInputStr[0]+"|"+optionsInputStr[1];
		}
		qOptionsArr = new Array(); 
		divCreatedArr = new Array(); 
		minCharsType = this.getProperty("MinChars");
		layoutType = this.getProperty("VCompLayout"); 
		pageQName = this.getProperty("VPageName"); 
		inputQObjs = this.getProperty("QNames");
		var dl = new dynamiclist1();
		
    }