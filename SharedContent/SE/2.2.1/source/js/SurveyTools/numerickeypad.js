/**
 * numerickeypad class
 * Inherits from SESurveyTool
 */
function numerickeypad(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
numerickeypad.prototype = Object.create(SESurveyTool.prototype);
numerickeypad.prototype.type = function(){
    return "numerickeypad";
}
numerickeypad.prototype.setResponses = function (){
   this.inputs.val($('#numpad').val());
}
numerickeypad.prototype.getDependencies = function(){
    return [
    ];
}


numerickeypad.prototype.build = function(){
		//this.component = $("<input type='number' step='any' id='numpad'></input>");
        var keyboardcontainer=document.createElement("input");
		$(keyboardcontainer).attr('id','numpad');
		$(keyboardcontainer).attr('type','number');
		$(keyboardcontainer).attr('step','any');
		if(this.getProperty("showDecimal")!='true')
		$(keyboardcontainer).attr('pattern','[0-9]*');
		this.component=$(keyboardcontainer);		
        this.deferred.resolve();		 
}

numerickeypad.prototype.render = function(){
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append($('<br><br>'));
		this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer);
        $('#numpad').val(this.inputs.val());
		this.nativeContainer.hide();
    }