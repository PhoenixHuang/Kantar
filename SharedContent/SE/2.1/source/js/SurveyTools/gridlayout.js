/**
 * gridlayout class
 * Inherits from SESurveyTool
 */
function gridlayout(questionContainers, json, globalOpts) {
    var subQ=[];
	SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
gridlayout.prototype = Object.create(SESurveyTool.prototype);
gridlayout.prototype.type = function(){
    return "gridlayout";
}
gridlayout.prototype.getDependencies = function(){
    return [
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/GridLayout/GridColumns.js'},
		{'type':'stylesheet', 'url' : surveyPage.path + 'lib/KO/GridLayout/GridStyles.css'}
    ];
}



gridlayout.prototype.build = function(){
		
    var that = this;
    var promises = [];
    var row = null;
    // Create questions and columns to build
    this.buildArraysFromGrid();
	//alert(that.json.subQuestions)
    
	$.each(that.json.subQuestions,function(i,json){
			alert(json.QuestionFullName);
			alert(json.CustomProps.flaMetaType.toLowerCase());
			//json.QuestionFullName = row.attr("questionname");
			//alert(new window[json.CustomProps.flaMetaType.toLowerCase()](row,json,that.options))
            var tool = new window[json.CustomProps.flaMetaType.toLowerCase()](row,json,that.options);
			promises.push(tool.create());
			that.subQ.push(tool);
        });
	
	/*$.each(this.subquestions, function(i,e){
        var row = null;
        console.log('inputs: ' + e.inputs.length)
        $.each(e.inputs, function(ii, x){
            var jThis = $(x);
            if (jThis.is(':radio,checkbox')) {
                var label = $("<label>").html(that.columnheaders[ii].label.innerHTML);
                jThis.append(label);
            }
            if (ii==0){
                row = jThis.closest("tr").attr("questionname",jThis.attr("questionname"))
            }
        });
        $.each(that.json.subQuestions,function(i,json){
            json.QuestionFullName = row.attr("questionname");
            var tool = new window[json.CustomProps.flaMetaType.toLowerCase()](row,json,that.options);
            promises.push(tool.create());
            that.exploded.push(tool);
        });

    });*/
    $.when.apply(this,promises).then(this.deferred.resolve);
		
		
		
		/*$.each(qJSON,function(index,json){
		    //alert(json)
           //SESurveyTool.prototype.init.call( json);
			alert(json.subQuestions[0].QuestionName);
        });
		preloadScript.push('initSurveyEngine();');
		
		columnGrid(2);
        this.deferred.resolve();*/		 
}


gridlayout.prototype.render = function(){
        
       
        /*this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append(this.component);
		
		this.nativeContainer.hide();*/
    }