/**
 * dropdown class
 * Inherits from SESurveyTool
 */
function dropdown(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
dropdown.prototype = Object.create(SESurveyTool.prototype);
dropdown.prototype.type = function() {
    return "dropdown";
}
dropdown.prototype.getDependencies = function() {
    return [];
}

dropdown.prototype.setInitialResponses = function() {
    

}
dropdown.prototype.setResponses = function() {
  
}
dropdown.prototype.build = function() {
	this.deferred.resolve();
}
dropdown.prototype.render = function() {
    
	//this.nativeContainer.hide();
	if(deviceType=='PC'){
		var style = $('<style>.active span:hover{background-color: '+this.getProperty("hoverbackgroundcolor")+';color:'+this.getProperty("hoverfontcolor")+';} .selected span{ background-color: '+this.getProperty("selectedbackgroundcolor")+';color:'+this.getProperty("selectedfontcolor")+' !important;} </style>');
		$('html > head').append(style);
		this.nativeContainer.find('select').css("display","none").addClass("mdb-select").material_select();
		var onMouseDown = function(e) {
            // preventing the default still allows the scroll, but blocks the blur.
            // We're inside the scrollbar if the clientX is >= the clientWidth.
            if (e.clientX >= e.target.clientWidth || e.clientY >= e.target.clientHeight) {
                e.preventDefault();
            }
        };
		var ie = window.navigator.userAgent.search(/(MSIE|Trident|Edge)/);
		if(ie > -1){
			$('select').siblings('input.select-dropdown').on('mousedown', onMouseDown);
		}
		
	}
	
}


dropdown.prototype.toolOptions = function() {
    return {
	   hoverbackgroundcolor:"#ccc",
	   hoverfontcolor:"#00838f",
	   selectedbackgroundcolor:"#00838f",
	   selectedfontcolor:"#FFFFFF"
	}
}