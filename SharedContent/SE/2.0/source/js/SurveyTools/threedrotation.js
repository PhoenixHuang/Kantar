/**
 * 3D Rotation class
 * Inherits from SESurveyTool
 */
function threedrotation(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
threedrotation.prototype = Object.create(SESurveyTool.prototype);
threedrotation.prototype.type = function(){
    return "threedrotation";
}
threedrotation.prototype.getDependencies = function(){
    return [
		
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/3drotation/swfobject.js'},
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/3drotation/rotatetool.js'},
		{'type':'stylesheet', 'url' : surveyPage.path + 'lib/KO/3drotation/style.css'}
	 ];
}


threedrotation.prototype.build = function(){
        this.component = $("<div id='flashborder'><div id='flashcontent'></div></div>");
		this.deferred.resolve();
}


threedrotation.prototype.render = function(){
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer);
		
		var strImageBaseRotateTool = surveyPage.path + "lib/KO/3DRotation/rotateTool.swf";
		var configJSpath = this.getProperty("configJSpath");
		var configXMLpath = this.getProperty("configXMLpath");
    	var navbtnhide = this.getProperty("navbtnhide");
		var swfURLFor3dRotation = strImageBaseRotateTool;
		var backPackURLFor3dRotation = escape(configJSpath);
	
		if (swfobject.hasFlashPlayerVersion('9.0.115')) {
        var flashvars = {};
        flashvars.path = backPackURLFor3dRotation;
        var params = {};
        params.scale = 'noScale';
        params.salign = 'lt';
        params.allowScriptAccess = 'always';
        params.allowFullScreen = 'true';
        var attributes = {};
        attributes.id = 'myFlash';
        attributes.name = 'myFlash';
        swfobject.embedSWF(swfURLFor3dRotation, 'flashcontent', '600', '450', '10.0.0', 'expressInstall.swf', flashvars, params, attributes);
		} else {
        if (typeof (RotateTool) == 'undefined') {
        alert('rotatetool.js not loaded!');
        } else {
        var jsParams = {};
        jsParams.path = configXMLpath;
        jsParams.target = 'flashcontent';
        jsParams.targetWidth = '600';
        jsParams.targetHeight = '450';
        RotateTool.add(jsParams);
        }
        }
		if (navbtnhide == "true"){
		pageLayout.next.hide();
		setTimeout(	function() {pageLayout.next.show();},this.getProperty("navbtnhidetime"));
		}
		
		this.nativeContainer.hide();
    }