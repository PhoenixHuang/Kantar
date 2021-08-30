/**
 * datepicker class
 * Inherits from SESurveyTool
 */
function datepicker(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
datepicker.prototype = Object.create(SESurveyTool.prototype);
datepicker.prototype.type = function(){
    return "datepicker";
}
datepicker.prototype.getDependencies = function(){
    
	
	$("head").append("<script src='"+surveyPage.path+"lib/KO/DatePicker/yahoo/yahoo.js'><!-- // SE --></script><script src='"+surveyPage.path+"lib/KO/DatePicker/event/event.js'><!-- // SE --></script><script src='"+surveyPage.path+"lib/KO/DatePicker/dom/dom.js'><!-- // SE --></script><script src='"+surveyPage.path+"lib/KO/DatePicker/intouchcalendar.js'><!-- // SE --></script><script src='"+surveyPage.path+"lib/KO/DatePicker/calendar/calendar-min.js'><!-- // SE --></script><script src='"+surveyPage.path+"lib/KO/DatePicker/setTheIntouchCalendar.js'><!-- // SE --></script> <script src='"+surveyPage.path+"lib/KO/DatePicker/jquery.maskedinput-1.2.6-co.min.js'><!-- // SE --></script>")
	
	var viewrtlcssfile;
    if (this.getProperty("vCompLangType")=="rtl")
	   viewrtlcssfile=surveyPage.path +'lib/KO/DatePicker/calendar/css/calendar_rtl.css';
    else
       	viewrtlcssfile=surveyPage.path +'lib/KO/DatePicker/calendar/css/calendar_ltr.css';
		
    return [
		{'type':'stylesheet', 'url' :viewrtlcssfile  }
    ];
}


datepicker.prototype.build = function(){
		
		intouchCal = null;
		reqValidation = this.getProperty("vCompValidation");
		calIconPath = surveyPage.path+'lib/KO/DatePicker/Calendar.png'; 
		spritesPath = surveyPage.path+'lib/KO/DatePicker/NavIcons.png'; 
		calLayout = this.getProperty("vCompLangType");
		enableDisableTextInput =this.getProperty("vCompEnableTextInput"); 
		minDate = this.getProperty("vCompMinDate"); 
		maxDate = this.getProperty("vCompMaxDate"); 
		pageDate = this.getProperty("vCompPageDate"); 
		calTitle = this.getProperty("vCompTile"); 
		needYearNav ="false";
		qName="_Q"+this.getProperty("vCompQName"); 
		dateFormat =this.getProperty("vCompDateFormat"); 
		monthsLong = this.getProperty("vCompMonthsLong");
		monthsShort = this.getProperty("vCompMonthsShort");
		daysShort = this.getProperty("vCompDaysShort");
		calBGColor = '';
		alcolColor1 = '';
		alcolColor2 = '';
		dateTextColor = '';
		selMonthText = this.getProperty("vCompSelectMonthText");
		yearText = this.getProperty("vCompYearText");
		submitText = this.getProperty("vCompSubmitText");
		cancelText = this.getProperty("vCompCancelText");
		invalidYearText = this.getProperty("vCompInvalidYearText");
		intouchCalendarInit();
		this.deferred.resolve();		 
}

datepicker.prototype.render = function(){
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer);
		//this.nativeContainer.hide();
		$('#qc_'+this.questionFullName).hide();
    }

	