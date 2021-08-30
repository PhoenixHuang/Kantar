/**
 * video_sniffer class
 * Inherits from SESurveyTool
 */
function video_sniffer(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
video_sniffer.prototype = Object.create(SESurveyTool.prototype);
video_sniffer.prototype.type = function(){
    return "video_sniffer";
}
video_sniffer.prototype.getDependencies = function(){
    return [
		{'type':'script', 'url' : '[%SharedContentBase%]LAF/swfobject/2.2/swfobject.js'}
    ];
}

video_sniffer.prototype.build = function() {
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

    var h264 = this.nativeContainer.find('.questionContainer[questionname$=".h264"]').find(':input');
    var webm = this.nativeContainer.find('.questionContainer[questionname$=".webm"]').find(':input');
    var ogg = this.nativeContainer.find('.questionContainer[questionname$=".ogg"]').find(':input');
    var html5video = this.nativeContainer.find('.questionContainer[questionname$=".html5video"]').find(':input');
    var videoSupport = this.set_supported_video_formats();

    h264.val(videoSupport.h264);
    webm.val(videoSupport.webm);
    ogg.val(videoSupport.ogg);
    html5video.val(videoSupport.html5video);

    this.deferred.resolve();
}

video_sniffer.prototype.set_supported_video_formats = function() {
  var returnObj = {};
  returnObj.h264 = "undefined";
  returnObj.webm = "undefined";
  returnObj.ogg = "undefined";
  var v = document.createElement("video");
  if (v.canPlayType) {
      returnObj.h264 = v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') || "undefined";
      returnObj.webm = v.canPlayType('video/webm; codecs="vp8, vorbis"') || "undefined";
      returnObj.ogg = v.canPlayType('video/ogg; codecs="theora, vorbis"') || "undefined";
  }
  // IE 9 hack added to eliminate HTML5 support from IE 9. JW Player has removed support as of v6.11
  var IE9 = document.all /* IE */ && document.addEventListener /* IE >= 9 */ && !window.atob /* IE < 10 */;
  returnObj.html5video = !!v.canPlayType && !IE9;
  return returnObj;
}

video_sniffer.prototype.resolveLocation = function(hostVal){
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
video_sniffer.prototype.render = function(){
    //only do all of this if video_sniffer is only question on the page. if it is just hide native container.
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
