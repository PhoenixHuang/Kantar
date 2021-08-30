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
	    {'type':'script', 'url' : pageLayout.sharedContent+'LAF/Lib/jQueryUI/1.11.0/jquery-ui.min.js'},
		{'type':'script', 'url' : pageLayout.sharedContent+'LAF/Lib/jquery/jquery.maskedinput-1.2.6-co.min.js'},
		{'type':'stylesheet', 'url' :pageLayout.themePath+"css/1.10.4/jquery-ui-custom.css" }
    ];
}

calendar.prototype.setResponses = function (){
   
	   $.each(this.inputs.filter('textarea'), function (i, e) {
		  $(e).val($("#datepicker").val())  
			
	   });
}

calendar.prototype.build = function(){
			var compRTL=this.getProperty("compRTL");
			if(compRTL == true){
				this.component = "<div style='direction:ltr !important; text-align:right;'><style>.ui-datepicker-trigger{position: relative;margin-right:2px;top: "+this.getProperty("calendarVOffset")+"px;}</style><br/><br/><input id='datepicker' class='datepicker' type='text' style='direction:rtl;'></div>";	
			}else{
				this.component = "<style>.ui-datepicker-trigger{position: relative;top: "+this.getProperty("calendarVOffset")+"px;}</style><br/><br/><input id='datepicker' class='datepicker' type='text'>";
			}
		   
		   this.deferred.resolve();  		 
}

calendar.prototype.render = function(){
		var compRTL=this.getProperty("compRTL");
		if(compRTL == true){
		compRTL = true;
		}else{
		compRTL == false
		}
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer);
		$("#datepicker").css({border:'2px solid #8EA85F'});
		$("#datepicker").css({borderRadius:'4px',color:'#000000',width:this.getProperty("textInputWidth")+'px',height:this.getProperty("textInputHeight")+'px',marginRight:'2px'});
		var dateFormat = this.getProperty("dateFormat");
		dateFormat = dateFormat.toLowerCase();
        var n = dateFormat.indexOf("yyyy");
		if(n != -1){
		dateFormat = dateFormat.replace("yyyy", "yy");
		}
	    $( "#ui-datepicker-div" ).remove();
		var givenDate = this.inputs.filter('textarea').val();
		$("#datepicker").val(givenDate);
		if(this.getProperty("minDate")==null||this.getProperty("maxDate")==null){
		  if(this.getProperty("disableTextInput"))
		    $('#datepicker').attr('disabled', true);		   
		  var that=this;
		  $("#datepicker").datepicker({
		    showOn: 'button',
			isRTL:compRTL,
		    buttonImage: pageLayout.themePath+"se/images/"+this.getProperty("calendarImage"),
            buttonImageOnly: true,
			defaultDate:givenDate,
			dayNames:eval("["+this.getProperty("dayNames")+"]"),
			dayNamesMin:eval("["+this.getProperty("dayNamesMin")+"]"),
			dayNamesShort:eval("["+this.getProperty("dayNamesShort")+"]"),
			monthNames:eval("["+this.getProperty("monthNames")+"]"),
			monthNamesShort:eval("["+this.getProperty("monthNamesShort")+"]"),
			changeMonth: (this.getProperty("yearMonthChange"))?true:false,
			changeYear: (this.getProperty("yearMonthChange"))?true:false,
			yearRange: "1900:2099",
			dateFormat: dateFormat,
			beforeShow: function(date) {
				$(".ui-datepicker").css('font-size',parseInt(that.getProperty("calendarSize")) );	
				}
		  });
		 //$('#datepicker').mask("99/99/9999", {placeholder: "mm/dd/yyyy"});
        }
		else{
		  if(this.getProperty("disableTextInput"))
		    $('#datepicker').attr('disabled', true);
			  
		  var date1 =this.getProperty("minDate");
		  var date2 =this.getProperty("maxDate");
          var that=this;		  
		  $("#datepicker").datepicker({
				showOn: 'button',
				isRTL:compRTL,
				buttonImage: pageLayout.themePath+"se/images/"+this.getProperty("calendarImage"),
                buttonImageOnly: true,
				defaultDate: givenDate,
				dayNames:eval("["+this.getProperty("dayNames")+"]"),
			    dayNamesMin:eval("["+this.getProperty("dayNamesMin")+"]"),
			    dayNamesShort:eval("["+this.getProperty("dayNamesShort")+"]"),
			    monthNames:eval("["+this.getProperty("monthNames")+"]"),
			    monthNamesShort:eval("["+this.getProperty("monthNamesShort")+"]"),
				changeMonth: (this.getProperty("yearMonthChange"))?true:false,
			    changeYear: (this.getProperty("yearMonthChange"))?true:false,
			    yearRange: "1900:2099",
				beforeShow: function(date) {
					$(".ui-datepicker").css('font-size',parseInt(that.getProperty("calendarSize")) );
					return {
						dateFormat: dateFormat,
						minDate: date1,
						maxDate: date2						
					}
				}
			});
		}
		this.nativeContainer.hide();

		if(compRTL == true){
			this.componentContainer.css( "direction", 'rtl' );
		}
		
		
    }
calendar.prototype.toolOptions = function() {
$.extend(this.options, eval("this.options."+calendar.prototype.type()));
switch(pageLayout.deviceType.toUpperCase()) {
        case "LARGETABLET":
        case "MEDIUMTABLET":
        case "SMALLTABLET":
        case "SMARTPHONETOUCH":
            if(this.orientation==0||this.orientation==180) 
			return {
			        'calendarImage':"mobile/calendarIcon.png",
					'disableTextInput': true,
					'yearMonthChange':true,
					'dateFormat':"mm/dd/yyyy",
					'dayNames':"'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'",
					'dayNamesMin':"'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'",
					'dayNamesShort':"'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'",
					'monthNames':"'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'",
					'monthNamesShort':"'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'",
					'calendarSize':22,
					'calendarVOffset':16,
					'textInputHeight': 22,
					'textInputWidth': 300,
					'compRTL':false
            }
			else
			return {
			        'calendarImage':'mobile/calendarIcon.png',
				   'disableTextInput': true,
					'yearMonthChange':true,
					'dateFormat':"mm/dd/yyyy",
					'dayNames':"'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'",
					'dayNamesMin':"'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'",
					'dayNamesShort':"'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'",
					'monthNames':"'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'",
					'monthNamesShort':"'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'",
					'calendarSize':18,
					'calendarVOffset':20,
					'textInputHeight': 30,
					'textInputWidth': 300,
					'compRTL':false
            }
        case "PC":
        case "OTHERDEVICE":
        default:
            return {
                    'calendarImage':'calendarIcon.png',
					'disableTextInput': true,
					'yearMonthChange':true,
					'dateFormat':"mm/dd/yyyy",
					'dayNames':"'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'",
					'dayNamesMin':"'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'",
					'dayNamesShort':"'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'",
					'monthNames':"'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'",
					'monthNamesShort':"'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'",
					'calendarSize':12,
					'calendarVOffset':8,
					'textInputHeight': 16,
					'textInputWidth': 170,
					'compRTL':false
            }
    }
}	
	