/**
 * dynamiclist1 class
 * Inherits from SESurveyTool
 */
function dynamiclist1(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
dynamiclist1.prototype = Object.create(SESurveyTool.prototype);
dynamiclist1.prototype.type = function(){
    return "dynamiclist1";
}
dynamiclist1.prototype.getDependencies = function(){
    
}


dynamiclist1.prototype.build = function(){
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
        //$().ready(function(){ var dl = new dynamiclist1();});
		fromElementObj = document.getElementById('mrForm'); 
		fromElementObj.setAttribute('onSubmit',formSubmitFun())
        this.deferred.resolve();		 
}

dynamiclist1.prototype.render = function(){
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer);
		//this.nativeContainer.hide();
    }