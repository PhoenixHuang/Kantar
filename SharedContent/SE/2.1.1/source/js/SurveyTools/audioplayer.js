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
		{'type':'stylesheet', 'url' : pageLayout.themePath + 'css/AudioPlayer.css'}
		
    ];
}

audioplayer.prototype.build = function(){
		var audio = this.getProperty("audioPath");
		audio=audio.split(",");
		var mp3="";
		for(i=0;i<audio.length-1;i++)
		mp3=audio[i]+".mp3,";
		mp3=audio[i]+".mp3";
		var ogg="";
		for(i=0;i<audio.length-1;i++)
		ogg=audio[i]+".ogg,";
		ogg=audio[i]+".ogg";
		
		var autosubmit = this.getProperty("autoSubmit");
		this.component = $("<div id='wrapper'><audio preload='auto' controls='controls'><source src='"+mp3+"' ></source><source src='"+ogg+"' ></source></audio><script type='text/javascript'>$( function()	{	$('audio' ).audioPlayer({'autosbmt':"+autosubmit+"});});</script></div>");

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
audioplayer.prototype.toolOptions = function() {
$.extend(this.options, eval("this.options."+audioplayer.prototype.type()));
switch(pageLayout.deviceType.toUpperCase()) {
        case "LARGETABLET":
        case "MEDIUMTABLET":
        case "SMALLTABLET":
        case "SMARTPHONETOUCH":
            if(this.orientation==0||this.orientation==180) 
			return {
			        'autoSubmit':true
            }
			else
			return {
			        'autoSubmit':true
            }
        case "PC":
        case "OTHERDEVICE":
        default:
            return {
                   'autoSubmit':true
            }
    }
}		