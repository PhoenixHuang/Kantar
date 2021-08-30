/**
 * hidespecials class
 * Inherits from SESurveyTool
 */
function hidespecials(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
hidespecials.prototype = Object.create(SESurveyTool.prototype);
hidespecials.prototype.type = function() {
    return "hidespecials";
}
hidespecials.prototype.getDependencies = function() {
    return [];
}

hidespecials.prototype.setInitialResponses = function() {
    

}
hidespecials.prototype.setResponses = function() {
  if($(".mrQuestionText").find(".mrErrorText").length!=0){
	//$( "input[isExclusive=true]" ).parent().parent().show();
	$( "input[isExclusive=true]" ).each(function( index ) {
		  $(this).parent().parent().show();
		});
	
	}
}
hidespecials.prototype.build = function() {
    
	this.deferred.resolve();
}
hidespecials.prototype.render = function() {

	
    
	if($(".mrQuestionText").find(".mrErrorText").length==0&&this.getProperty("hidespecials")){
		
		$( "input[isExclusive=true]" ).each(function( index ) {
		  $(this).parent().parent().hide();
		});
	//$( "input[isExclusive=true]" ).parent().parent().hide();
	}
	this.nativeContainer.show();
	
	$.each(this.inputs, function(i, e) {
	   if ($(e).is(":checked")) {
	     $( "input[isExclusive=true]" ).each(function( index ) {
		  $(this).parent().parent().show();
		});
		return false;
	   }
	});
}


hidespecials.prototype.toolOptions = function() {
    
}