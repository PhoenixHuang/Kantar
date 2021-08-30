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
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/DynamicList/jquery-1.js'},
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/DynamicList/jquery_autocomplete.js'},
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/DynamicList/dynamiclist.js'},
		{'type':'stylesheet', 'url' : surveyPage.path + 'lib/KO/DynamicList/main.css'}
    ];
}


dynamiclist.prototype.build = function(){
		/*inputQIds = this.getProperty("QNames") 
		qArr = inputQIds.split(",")
		alert($( ".questionContainer" ).eq(1).attr( "questionname" ));
		alert($( ".mrQuestionTable").eq(0).children().length)
		alert($( ".mrSingleText").eq(0).text())
		alert($( ".mrSingleText").length)*/
		
		
		qOptionsArr = new Array(); 
		divCreatedArr = new Array(); 
		minCharsType = this.getProperty("MinChars");
		layoutType = this.getProperty("VCompLayout"); 
		pageQName = this.getProperty("VPageName"); 
		inputQObjs = this.getProperty("QNames"); 
		var dl = new dynamiclist();
        //$().ready(function(){ var dl = new dynamiclist();});
		
        this.deferred.resolve();		 
}

dynamiclist.prototype.render = function(){
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
		this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer);
		//this.nativeContainer.hide();
    }