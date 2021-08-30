/**
 * dropdownlist class
 * Inherits from SESurveyTool
 */
function dropdownlist(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
dropdownlist.prototype = Object.create(SESurveyTool.prototype);
dropdownlist.prototype.type = function(){
    return "dropdownlist";
}
dropdownlist.prototype.getDependencies = function(){
    return [
		{'type':'stylesheet', 'url' : surveyPage.path + 'lib/KO/DropDownList/dropdownliststyle.css'}
    ];
}


dropdownlist.prototype.build = function(){
		
        this.deferred.resolve();		 
}

dropdownlist.prototype.render = function(){
        this.componentContainer = $('<div>');
        //this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append(this );
        this.nativeContainer.after(this.componentContainer);
		/*$("option[value='']").hide();
		$("select").change(function(){
		  alert("Hello");
		 if($("option[value='']").is(":selected"))
		   $("option[value='']").hide();
		 else
           	$("option[value='']").show();	 
		});*/
        //this.nativeContainer.hide();
    }