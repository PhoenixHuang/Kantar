/**
 * strengthmeter class
 * Inherits from SESurveyTool
 */
function strengthmeter(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}


strengthmeter.prototype = Object.create(SESurveyTool.prototype);
strengthmeter.prototype.type = function() {
    return "strengthmeter";
}
strengthmeter.prototype.getDependencies = function() {
    return [];
}

strengthmeter.prototype.setInitialResponses = function() {
    
}

strengthmeter.prototype.setResponses = function() {
    
}

strengthmeter.prototype.build = function() {

    this.deferred.resolve();
}

strengthmeter.prototype.render = function() {
		var inpuID = this.nativeContainer.find('textarea').attr('id');
		this.componentContainer = $('<div class="col-sm-12" id="'+inpuID+'StrengthmeterText" style='+this.getProperty("textstyle")+'></div>');	
		
        this.nativeContainer.attr("id",inpuID+"StrengthmeterContainer");
		this.nativeContainer.children().eq(1).prepend(this.componentContainer); 
		$("#"+inpuID+"StrengthmeterText").text(this.getProperty("initialtext"));
		$("#"+inpuID+"StrengthmeterText").css("color",this.getProperty("initialtextcolor"));
		this.nativeContainer.find('textarea').parent().addClass("col-sm-12");
        var that=this;
	$( "#"+inpuID ).keyup(function() {
		var strengthtext=that.getProperty("strengthtext");
		strengthtext=strengthtext.split("~");
		var breakpoints=that.getProperty("breakpoints");
		breakpoints=breakpoints.split(",");	
		var textcolor=that.getProperty("textcolor");
		textcolor=textcolor.split(",");	
		
		$.each(breakpoints,function(i,a){		    
			if(i==breakpoints.length-1){
				  if($( "#"+inpuID+"StrengthmeterContainer" ).find("textarea").val().length>=a){
				  $("#"+inpuID+"StrengthmeterText").text(strengthtext[i]);
				  $("#"+inpuID+"StrengthmeterText").css("color",textcolor[i]);
				  return false;
				  }
			}
			if(i!=breakpoints.length-1){				
				if($( "#"+inpuID+"StrengthmeterContainer" ).find("textarea").val().length>=a && $( "#"+inpuID+"StrengthmeterContainer" ).find("textarea").val().length<breakpoints[i+1]){
				   $("#"+inpuID+"StrengthmeterText").text(strengthtext[i]);
				   $("#"+inpuID+"StrengthmeterText").css("color",textcolor[i]);
				  return false;
				}
			}
			if($( "#"+inpuID+"StrengthmeterContainer" ).find("textarea").val().length<1){
				$("#"+inpuID+"StrengthmeterText").text(that.getProperty("initialtext"));
				$("#"+inpuID+"StrengthmeterText").css("color",that.getProperty("initialtextcolor"));
			}
		
		});	
		if(breakpoints[0]==""){
		 $("#"+inpuID+"StrengthmeterText").text(that.getProperty("initialtext"));
		 $("#"+inpuID+"StrengthmeterText").css("color",that.getProperty("initialtextcolor"));		  
		 }
	  	
	});	
	
	
}
strengthmeter.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + strengthmeter.prototype.type()));

    return {
		breakpoints:"1,5,10",
		strengthtext:"Please add more~Please add more detail if you can~That looks good!",		
		initialtext: "Please type your answer",
		textcolor:"#000000,#000000,#000000",
		initialtextcolor:"#000000",
		textstyle:"font-weight:bold;padding:6px 12px;"
    }
}
