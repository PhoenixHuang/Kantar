/**
 * calendar class
 * Inherits from SESurveyTool
 */
function calendar(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
calendar.prototype = Object.create(SESurveyTool.prototype);
calendar.prototype.type = function(){
    return "calendar";
}
calendar.prototype.getDependencies = function(){
    	
    return [
	    {'type':'script', 'url' : surveyPage.path + 'lib/KO/calendar/jquery-ui.min.js'},
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/calendar/jquery.maskedinput-1.2.6-co.min.js'},
		{'type':'stylesheet', 'url' :surveyPage.path + 'lib/KO/calendar/jquery-ui.min.css' }
    ];
}

calendar.prototype.setResponses = function (){
   
	   $('#_Q0').val($("#datepicker").val());
}

calendar.prototype.build = function(){
		
		   this.component = "<style>.ui-widget{font-size:0.7em;}.ui-datepicker-trigger{position: relative;top: 8px;}</style><br/><br/><input id='datepicker' class='datepicker' type='text'>";
		   
		   this.deferred.resolve();
		   		 
}

calendar.prototype.render = function(){
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer);
		$("#datepicker").css({border:'2px solid #8EA85F'});
		$("#datepicker").css({borderRadius:'4px'});
		//$("#datepicker").css({width:'200px'});
		var dateFormat = this.getProperty("dateFormat");
		dateFormat = dateFormat.toLowerCase();
        var n = dateFormat.indexOf("yyyy");
		if(n != -1){
		dateFormat = dateFormat.replace("yyyy", "yy");
		}
	    var givenDate = $("#_Q0").val();
		$("#datepicker").val(givenDate);
		if(this.getProperty("minDate")==null||this.getProperty("maxDate")==null){
		  if(this.getProperty("disableTextInput")=='true')
		    $('#datepicker').attr('disabled', true);		   
		  $("#datepicker").datepicker({
		    showOn: 'button',
		    buttonImage: surveyPage.path+"lib/KO/calendar/calendarIcon.png",
            buttonImageOnly: true,
			defaultDate:givenDate,
			dayNames:eval("["+this.getProperty("dayNames")+"]"),
			dayNamesMin:eval("["+this.getProperty("dayNamesMin")+"]"),
			dayNamesShort:eval("["+this.getProperty("dayNamesShort")+"]"),
			monthNames:eval("["+this.getProperty("monthNames")+"]"),
			monthNamesShort:eval("["+this.getProperty("monthNamesShort")+"]"),
			changeMonth: (this.getProperty("yearMonthChange")=='true')?true:false,
			changeYear: (this.getProperty("yearMonthChange")=='true')?true:false,
			yearRange: "1900:2099",
			dateFormat: dateFormat
		  });
		 //$('#datepicker').mask("99/99/9999", {placeholder: "mm/dd/yyyy"});
        }
		else{
		  if(this.getProperty("disableTextInput")=='true')
		    $('#datepicker').attr('disabled', true);
			  
		  var date1 =this.getProperty("minDate");
		  var date2 =this.getProperty("maxDate"); 
		  $("#datepicker").datepicker({
				showOn: 'button',
				buttonImage: surveyPage.path+"lib/KO/calendar/calendarIcon.png",
                buttonImageOnly: true,
				defaultDate: givenDate,
				dayNames:eval("["+this.getProperty("dayNames")+"]"),
			    dayNamesMin:eval("["+this.getProperty("dayNamesMin")+"]"),
			    dayNamesShort:eval("["+this.getProperty("dayNamesShort")+"]"),
			    monthNames:eval("["+this.getProperty("monthNames")+"]"),
			    monthNamesShort:eval("["+this.getProperty("monthNamesShort")+"]"),
				changeMonth: (this.getProperty("yearMonthChange")=='true')?true:false,
			    changeYear: (this.getProperty("yearMonthChange")=='true')?true:false,
			    yearRange: "1900:2099",
				beforeShow: function(date) {
					return {
						dateFormat: dateFormat,
						minDate: date1,
						maxDate: date2						
					}
				}
			});
		}
		this.nativeContainer.hide();
    }

	