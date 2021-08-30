 /**
 * flipmagazine class
 * Inherits from SESurveyTool
 */

function flipmagazine(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
flipmagazine.prototype = Object.create(SESurveyTool.prototype);
flipmagazine.prototype.type = function(){
    return "flipmagazine";
}

var servayPath = surveyPage.path;
flipmagazine.prototype.getDependencies = function(){
    return [
	     
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/flipmagazine/lib/klass.min.js'},
		//{'type':'script', 'url' : surveyPage.path + 'lib/KO/flipmagazine/lib/jquery-ui.js'},
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/flipmagazine/lib/jquery.ui.touch-punch.js'},
        {'type':'script', 'url' : surveyPage.path + 'lib/KO/flipmagazine/JS/code.photoswipe.jquery-3.0.5.min.js'},
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/flipmagazine/JS/PSevents.js'},
		//{'type':'script', 'url' : 'http://code.jquery.com/mobile/1.0rc2/jquery.mobile-1.0rc2.min.js'},
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/flipmagazine/lib/datacapture.js'},
		//{'type':'stylesheet', 'url' : 'http://code.jquery.com/mobile/1.0rc2/jquery.mobile-1.0rc2.min.css'},
		{'type':'stylesheet', 'url' :  surveyPage.path + 'lib/KO/flipmagazine/CSS/styles.css'},
		{'type':'stylesheet', 'url' :  surveyPage.path + 'lib/KO/flipmagazine/CSS/photoswipe.css'},
		{'type':'stylesheet', 'url' :  surveyPage.path + 'lib/KO/flipmagazine/CSS/jquery-mobile.css'}
    ];

}

flipmagazine.prototype.setResponses = function (){
   
    
	output=output.split("#");
	$('.mrMultiple').prop( "checked", false );
	
	for(i=0;i<output.length;i++)
	{
	 var page=output[i].split(",");
	 var inputs = this.subquestions[i].inputs;
     var multi = inputs.filter('input[type=checkbox]');
		
		  
	 if(page[0]==1)
	 {
	   var inputId=$(multi[0]).attr("id")
	   $("#"+inputId).prop( "checked", true );
	 }
	 if(page[1]==1)
	 {
	  var inputId=$(multi[1]).attr("id")
	  $("#"+inputId).prop( "checked", true );
	 }
	 if(page[0]==0&&page[1]==0)
	 {
	   var inputId=$(multi[2]).attr("id")
	   $("#"+inputId).prop( "checked", true );
	 }
	}

}
flipmagazine.prototype.build = function(){
		var imgstr="";
		var ImgURL;
		var ImgCaption;
		imageCacheBaseString = imageCacheBaseString.replace(/\\/g, '/');
		imgstr="["
		this.buildArraysFromGrid();
		$.each(this.subquestions, function (i, e) {
            var label = e.label;
            label.find('span').removeClass('mrQuestionText');
			ImgCaption=label.text();		
			ImgURL=e.image;
			ImgURL = ImgURL.replace(/\\/g, '/');
			imgstr=imgstr+"{url:'"+ImgURL+"',caption:'"+ImgCaption.trim()+"'},";
        });
		
		imgstr=imgstr.substr(0, imgstr.length-1)
		imgstr=imgstr+"]";
		nop=this.subquestions.length
		percent=this.getProperty("percentPageSubmit");
		closeBTNEnableTime=this.getProperty("closeEnableTime");
		closeBTNSubmitTime=this.getProperty("closeSubmitTime");
		var closeBtnLabel=this.getProperty("closeLabel");
		var prevBtnLabel=this.getProperty("prevLabel");
		var nextBtnLabel=this.getProperty("nextLabel");
		(function (window, PhotoSwipe) {
		  if(document.addEventListener){
		  document.addEventListener('DOMContentLoaded', function(){
          var myPhotoSwipe = Code.PhotoSwipe.attach( window.document.querySelectorAll('#Gallery a'), { enableMouseWheel: false , enableKeyboard: false } );
          }, false);
		  }
		  else
		  {
		   document.attachEvent('on'+'DOMContentLoaded', function(){
          var myPhotoSwipe = Code.PhotoSwipe.attach( window.document.querySelectorAll('#Gallery a'), { enableMouseWheel: false , enableKeyboard: false } );
          }, false);
		  }
		  
		    var options = {
                getToolbar: function () {
                    return '<!--<div class="ps-toolbar-play " style="padding-top: 12px;height: 80px;font-size: 18px;">Play</div>--><div class="ps-toolbar-previous " style="padding-top: 12px; height: 80px; font-size: 18px;">'+prevBtnLabel+'</div><div class="ps-toolbar-next " style=" padding-top: 12px;height: 80px;font-size: 18px;">'+nextBtnLabel+'</div><div class="say-hi " style="padding-top: 12px;cursor: pointer;height: 80px;font-size: 18px;" >'+closeBtnLabel+'</div>';
                },
                preventHide: true,
                captionAndToolbarAutoHideDelay: 0,
                getImageSource: function (obj) {
					return obj.url;
                },
                getImageCaption: function (obj){
                    return obj.caption;
                }
            },
		    instance = PhotoSwipe.attach(eval(imgstr),options);
		    instance.show(0);
		    var datacapObj = {instance:instance, PhotoSwipe:PhotoSwipe, nop:nop, percent:percent, closeBTNEnableTime:closeBTNEnableTime, closeBTNSubmitTime:closeBTNSubmitTime}; 
	        datacap(datacapObj);
	    }(window, window.Code.PhotoSwipe));
		
        this.deferred.resolve();		 
}

flipmagazine.prototype.render = function(){
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer);
		this.nativeContainer.hide();
    }

