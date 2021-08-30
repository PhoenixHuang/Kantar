/**
 * explode class
 * Inherits from SESurveyTool
 */
function explode(questionContainers, json, globalOpts) {
    this.exploded = [];
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
explode.prototype = Object.create(SESurveyTool.prototype);
explode.prototype.type = function(){
    return "explode";
}
explode.prototype.getDependencies = function(){
    var tools = [];
    $.each(this.json.subQuestions,function(i,json){
        tools.push({
            'url':surveyPage.toolsPath + json.CustomProps.flaMetaType.toLowerCase() + '.js',
            'type':'script'
        });
    });
    return tools;
}
explode.prototype.build = function(){
    var that = this;
    var promises = [];

    // Create questions and columns to build
    this.buildArraysFromGrid();
    $.each(this.subquestions, function(i,e){
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

    });
    $.when.apply(this,promises).then(this.deferred.resolve);
}
explode.prototype.render = function(){
    var that = this;
    this.componentContainer = $('<div>');
    this.componentContainer.append(this.label);
    this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
    this.componentContainer.addClass('qcContainer');
    this.nativeContainer.after(this.componentContainer);
    $.each(this.exploded,function(i,e){
        e.render();
        that.componentContainer.append(e.componentContainer);
    });
    this.nativeContainer.hide();
}
explode.prototype.setInitialResponses = function(){
    $.each(this.exploded,function(i,e){
        e.setInitialResponses();
    });
}
explode.prototype.setResponses = function(){
    $.each(this.exploded,function(i,e){
        e.setResponses();
    });
}