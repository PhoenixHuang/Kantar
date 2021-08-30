/**
 * sniffer class
 * Inherits from SESurveyTool
 */
function sniffer(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
sniffer.prototype = Object.create(SESurveyTool.prototype);
sniffer.prototype.type = function(){
    return "sniffer";
}
sniffer.prototype.getDependencies = function(){
    return [
		{'type':'script', 'url' : '[%SharedContentBase%]LAF/swfobject/2.2/swfobject.js'}
    ];
}

sniffer.prototype.build = function() {

    var hostname = this.nativeContainer.find('.questionContainer[questionname$=".hostname"]').find(':input');
    var ua = this.nativeContainer.find('.questionContainer[questionname$=".UA"]').find(':input');
    var screenres = this.nativeContainer.find('.questionContainer[questionname$=".screenres"]').find(':input');
    var flashVersion = this.nativeContainer.find('.questionContainer[questionname$=".flashVers"]').find(':input');

    var hostVal = (document.location.hostname) ? document.location.hostname.toLowerCase() : "unknown";
    hostname.val(hostVal);
    this.resolveLocation(hostVal);
    ua.val(navigator.userAgent);
    screenres.val((window.screen)? window.screen.width+';'+window.screen.height : "unknown");
    var versionObj = swfobject.getFlashPlayerVersion();
    flashVersion.val(versionObj.major + '.' + versionObj.minor + '.' + versionObj.release);

    this.deferred.resolve();
}

sniffer.prototype.resolveLocation = function(hostVal){
    var serverLocation = this.nativeContainer.find('.questionContainer[questionname$=".location"]').find(':input');
    var locationVal = "unknown";
    if (hostVal.indexOf('grpitsrv') > 0) {
        locationVal = "scripting";
    }else {
        var tier = hostVal.substr(0, 1).toLowerCase();
        if (tier == "p") {
            locationVal = "preview";
        } else if (tier == "s") {
            locationVal = "live";
        }
    }
    serverLocation.val([locationVal]);
}
sniffer.prototype.render = function(){
    //only do all of this if sniffer is only question on the page. if it is just hide native container.
    var parent = this.nativeContainer.parent();
    if (!parent.hasClass('questionContainer')) {
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id', 'qc_' + this.questionFullName);
        this.componentContainer.addClass('qcContainer');
        this.nativeContainer.after(this.componentContainer);
        loadScript.push('document.forms[0].submit()'); //todo update to new survey page method
    }
    this.nativeContainer.hide();
}
