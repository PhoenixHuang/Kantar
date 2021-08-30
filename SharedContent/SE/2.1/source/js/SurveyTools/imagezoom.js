/**
 * imagezoom class
 * Inherits from SESurveyTool
 */
function imagezoom(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
imagezoom.prototype = Object.create(SESurveyTool.prototype);
imagezoom.prototype.type = function(){
    return "imagezoom";
}
imagezoom.prototype.getDependencies = function(){
    return [
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/JetZoom/jetzoom.js'},
		{'type':'stylesheet', 'url' : pageLayout.themePath + 'css/jetzoom.css'}
    ];
}


imagezoom.prototype.build = function(){
		this.component = $("<div style='text-align:center'><img class='jetzoom' src='"+this.getProperty("smallImagePath") +"' data-jetzoom = \"zoomImage:'"+this.getProperty("largeImagePath")+"'\"/> </div>");
        this.deferred.resolve();		 
}

imagezoom.prototype.render = function(){
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer);
		JetZoom.quickStart();
		this.nativeContainer.hide();
    }