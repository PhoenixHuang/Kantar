/**
 * audioplayer class
 * Inherits from SESurveyTool
 */
function audioplayer(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
audioplayer.prototype = Object.create(SESurveyTool.prototype);
audioplayer.prototype.type = function(){
    return "audioplayer";
}
audioplayer.prototype.getDependencies = function(){
    return [
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/audioplayer/JS/audioplayer.js'},
		{'type':'stylesheet', 'url' : surveyPage.path + 'lib/KO/audioplayer/css/style.css'}
		
    ];
}

audioplayer.prototype.build = function(){
		var mp4 = this.getProperty("mp4path");
		var ogg = this.getProperty("webmpath");
		var autosubmit = this.getProperty("autosubmit");
		this.component = $("<div id='wrapper'><audio preload='auto' controls='controls'><source src='"+mp4+"' ></source><source src='"+ogg+"' ></source></audio><script type='text/javascript'>$( function()	{	$('audio' ).audioPlayer({'autosbmt':"+autosubmit+"});});</script></div>");

        this.deferred.resolve();		 
}
audioplayer.prototype.render = function(){
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer);
	    this.nativeContainer.hide();
    }