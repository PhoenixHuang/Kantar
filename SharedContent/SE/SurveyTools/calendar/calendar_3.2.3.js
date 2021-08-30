/**
 * autosum class
 * Inherits from SESurveyTool
 */
function calendar(questionContainers, json, globalOpts) {

    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
calendar.prototype = Object.create(SESurveyTool.prototype);
calendar.prototype.type = function() {
    return "calendar";
}
calendar.prototype.getDependencies = function() {
	var customcalendar = this.getProperty("customcalendar");
    if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
		   var DeviceType = pageLayout.deviceType.toUpperCase();
		} else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
			if(isMobile.any()) {
				var DeviceType = "MOBILE";
			}else{
				var DeviceType = "PC";
			}
		}
    if (DeviceType == "PC" || DeviceType == "OTHERDEVICE") {
        return [];
    } else {
        if (detectIE() == false && customcalendar == false) {
            return [{
                'type': 'stylesheet',
                'url': surveyPage.path  + 'lib/KO/calendar/1.0/moment.css'
            }, {
                'type': 'script',
                'url': surveyPage.path + 'lib/KO/calendar/1.0/moment.min.js'
            }];
        } else {
            return [];
        }
    }
}
calendar.prototype.setInitialResponses = function() {
    //var inputData = this.nativeContainer.find('input').val();
    //this.component.find('input').val(inputData);
}

calendar.prototype.setResponses = function() {
	if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
       var DeviceType = pageLayout.deviceType.toUpperCase();
    } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
		if(isMobile.any()) {
		   var DeviceType = "MOBILE";
		}else{
			var DeviceType = "PC";
		}		
    }
    var customcalendar = this.getProperty("customcalendar");
	
	if (DeviceType == "PC" || DeviceType == "OTHERDEVICE") {
		var inputVal = this.component.find('input').val();
		this.nativeContainer.find('input,textarea').val(inputVal);
		
	} else {
        if (detectIE() == false && customcalendar == false) {
			var inputVal = this.component.find('input').attr("data-date");
			this.nativeContainer.find('input,textarea').val(inputVal);
        } else {
			var inputVal = this.component.find('input').val();
			this.nativeContainer.find('input,textarea').val(inputVal);
        }
    }

}

calendar.prototype.build = function() {
    
	if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
       var DeviceType = pageLayout.deviceType.toUpperCase();
    } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
		if(isMobile.any()) {
		   var DeviceType = "MOBILE";
		}else{
			var DeviceType = "PC";
		}		
    }
	
    var questionname = this.questionFullName;
    var placeholder = this.getProperty("placeholder");
    var formatdisplay = this.getProperty("formatdisplay");
	formatdisplay = formatdisplay.toLowerCase();
    var selectyears = this.getProperty("selectyears");
    var calendarweekdaydisplay = this.getProperty("calendarweekdaydisplay");
    var calendardatedisplay = this.getProperty("calendardatedisplay");
    var calendardayselected = this.getProperty("calendardayselected");
    var calendarbuttontoday = this.getProperty("calendarbuttontoday");
	var customcalendar = this.getProperty("customcalendar");
	
    if (DeviceType == "PC" || DeviceType == "OTHERDEVICE") {
        
        $("<style>.md-form label{left:0.8rem;} .picker__box .picker__header .picker__date-display .picker__weekday-display,.picker__weekday-display{background-color:" + calendarweekdaydisplay + "} .picker__box .picker__header .picker__date-display,.picker__date-display{background-color:" + calendardatedisplay + "}.picker__box .picker__table .picker--focused, .picker__box .picker__table .picker__day--selected, .picker__box .picker__table .picker__day--selected:hover,.picker--focused .picker__day--selected, .picker__day--selected, .picker__day--selected:hover{background-color:" + calendardayselected + "} .picker__box .picker__footer .picker__button--today:before, .picker__button--today:before{border-top:.66em solid " + calendarbuttontoday + "}.picker__box .picker__table .picker__day.picker__day--today{color:" + calendarbuttontoday + ";}</style>").appendTo("head")

        this.inputcontainer = '<div class="md-form" style="margin-top: 1rem;"><input type="text" value="" class="datepicker form-control" id="date_' + this.questionFullName + '" /> <label for="date_' + this.questionFullName + '">' + placeholder + '</label></div>';


    } else {
        if (detectIE() == false && customcalendar == false) {
			formatdisplay = formatdisplay.toUpperCase();
            this.inputcontainer = '<div class="md-form" style="margin-top: 1rem;"><input type="date" value="" data-date="" data-date-format="' + formatdisplay + '" id="date_' + this.questionFullName + '"/> <label for="date_' + this.questionFullName + '">' + placeholder + '</label></div>';
        } else {
            $("<style>.md-form label{left:0.8rem;} .picker__box .picker__header .picker__date-display .picker__weekday-display,.picker__weekday-display{background-color:" + calendarweekdaydisplay + "} .picker__box .picker__header .picker__date-display,.picker__date-display{background-color:" + calendardatedisplay + "}.picker__box .picker__table .picker--focused, .picker__box .picker__table .picker__day--selected, .picker__box .picker__table .picker__day--selected:hover,.picker--focused .picker__day--selected, .picker__day--selected, .picker__day--selected:hover{background-color:" + calendardayselected + "} .picker__box .picker__footer .picker__button--today:before, .picker__button--today:before{border-top:.66em solid " + calendarbuttontoday + "}.picker__box .picker__table .picker__day.picker__day--today{color:" + calendarbuttontoday + ";}</style>").appendTo("head")

			this.inputcontainer = '<div class="md-form" style="margin-top: 1rem;"><input type="text" value="" class="datepicker form-control" id="date_' + this.questionFullName + '" /> <label for="date_' + this.questionFullName + '">' + placeholder + '</label></div>';
        }
    }


    this.deferred.resolve();
}

calendar.prototype.render = function() {
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
		   var DeviceType = pageLayout.deviceType.toUpperCase();
		} else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
			if(isMobile.any()) {
				var DeviceType = "MOBILE";
			}else{
				var DeviceType = "PC";
			}
		}
        var questionname = (this.questionFullName).replace(".", "\\.");
        var formatdisplay = this.getProperty("formatdisplay");
        var selectyears = this.getProperty("selectyears");
        var placeholder = this.getProperty("placeholder");
		var customcalendar = this.getProperty("customcalendar");
		
		var mindate = this.getProperty("mindate");
		var maxdate = this.getProperty("maxdate");
		
		var today = this.getProperty("today");
		var clear = this.getProperty("clear");
		var closeTxt = this.getProperty("close");
		
		var showMonthsShort = this.getProperty("showmonthsshort");
		var showWeekdaysFull = this.getProperty("showweekdaysfull");

		var labelmonthnext = this.getProperty("labelmonthnext");
		var labelmonthprev = this.getProperty("labelmonthprev");
		var labelmonthselect = this.getProperty("labelmonthselect");
		var labelyearselect = this.getProperty("labelyearselect");

		var formatsubmit = (this.getProperty("formatsubmit")).toLowerCase();
		var hiddenprefix = this.getProperty("hiddenprefix");
		var hiddensuffix = this.getProperty("hiddensuffix");
		var hiddenname = this.getProperty("hiddenname");
		var editable = this.getProperty("editable");
		var selectMonths = this.getProperty("selectmonths");
		var firstday = this.getProperty("firstday");
		var closeonclear = this.getProperty("closeonclear");
		var closeonselect = this.getProperty("closeonselect");
		
		eval('var disable='+this.getProperty("disable"));
		
		var monthsFull = [];
		var monthsShort = [];
		var weekdaysFull = [];
		var weekdaysShort = [];
		
		var monthsF = (this.getProperty("monthsfull")).split(",");
		var monthsS = (this.getProperty("monthsshort")).split(",");
		var weekdaysF = (this.getProperty("weekdaysfull")).split(",");
		var weekdaysS = (this.getProperty("weekdaysshort")).split(",");
		$.each(monthsF, function (index, value) {
			monthsFull.push(value)
		});
		$.each(monthsS, function (index, value) {
			monthsShort.push(value)
		});
		$.each(weekdaysF, function (index, value) {
			weekdaysFull.push(value)
		});
		$.each(weekdaysS, function (index, value) {
			weekdaysShort.push(value)
		});

		//console.log(monthsF[1]);
		
        this.componentContainer = $('<div>');
        //this.componentContainer.append(this.label);
        this.componentContainer.append(this.nativeContainer.find(".question-text").clone());
        this.componentContainer.attr('id', 'qc_' + this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
        this.component = $("<div class='col-sm-12 question-component'>");


        this.component.append(this.inputcontainer);
        this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer);
        this.nativeContainer.hide();

        if (DeviceType == "PC" || DeviceType == "OTHERDEVICE") {
            formatdisplay = formatdisplay.toLowerCase();
			if(formatsubmit == '')
				formatsubmit = formatdisplay;
            $('.datepicker').pickadate({
                selectYears: selectyears,
				selectMonths : selectMonths,
                format: formatdisplay,
				min:mindate,
				max:maxdate,
				monthsFull: monthsFull,
				monthsShort: monthsShort,
				weekdaysFull: weekdaysFull,
				weekdaysShort: weekdaysShort,
				showMonthsShort:showMonthsShort,
				showWeekdaysFull:showWeekdaysFull,
				today: today,
				clear: clear,
				close: closeTxt,
				labelMonthNext: labelmonthnext,
				labelMonthPrev: labelmonthprev,
				labelMonthSelect: labelmonthselect,
				labelYearSelect: labelyearselect,
				formatSubmit: formatsubmit,
				hiddenPrefix: hiddenprefix,
				hiddenSuffix: hiddensuffix,
				hiddenName: hiddenname,
				editable: editable,
				firstDay: firstday,
				closeOnSelect: closeonselect,
				closeOnClear: closeonclear,
				disable:disable
            });
			
			// Set Initial Responses
			var inputData = this.nativeContainer.find('input').val();
			this.component.find('input').val(inputData);
			if(inputData != ""){
				this.component.find("label[for='date_" + questionname+"']").addClass("active");
			}
        } else {

            if (detectIE() == false && customcalendar == false) {
                var input = this.component.find('input');
                if (input.attr("value") == '') {
                    this.component.find("input + label").html(placeholder);
                } else {
                    this.component.find("input + label").html("");
                }
                var that = this
                input.on("change", function() {
                    that.component.find("input + label").html("");
                    this.setAttribute(
                        "data-date",
                        moment(this.value, 'YYYY-MM-DD')
                        .format(this.getAttribute("data-date-format"))
                    );
                }).trigger("change");
                if (this.component.find("input").attr('data-date') == 'Invalid date') {
                    this.component.find("input").attr('data-date', placeholder);
                }
				
				// Set Initial Responses
				var inputData = this.nativeContainer.find('input').val();
				this.component.find('input').val(inputData);
				if(inputData != ""){
					this.component.find('input[type="date"]').attr('data-date',inputData);
				}
            }else{
				formatdisplay = formatdisplay.toLowerCase();
				if(formatsubmit == '')
					formatsubmit = formatdisplay;
				$('.datepicker').pickadate({
					selectYears: selectyears,
					format: formatdisplay,
					min:mindate,
					max:maxdate,
					monthsFull: monthsFull,
					monthsShort: monthsShort,
					weekdaysFull: weekdaysFull,
					weekdaysShort: weekdaysShort,
					showMonthsShort:showMonthsShort,
					showWeekdaysFull:showWeekdaysFull,
					today: today,
					clear: clear,
					close: closeTxt,
					labelMonthNext: labelmonthnext,
					labelMonthPrev: labelmonthprev,
					labelMonthSelect: labelmonthselect,
					labelYearSelect: labelyearselect,
					formatSubmit: formatsubmit,
					hiddenPrefix: hiddenprefix,
					hiddenSuffix: hiddensuffix,
					hiddenName: hiddenname,
					editable: editable,
					firstday: firstday,
					closeOnSelect: closeonselect,
					closeOnClear: closeonclear,
					disable:disable
				});
				
				// Set Initial Responses
				var inputData = this.nativeContainer.find('input').val();
				this.component.find('input').val(inputData);
				if(inputData != ""){
					this.component.find("label[for='date_" + questionname+"']").addClass("active");
				}
			}
        }
		
		$('.picker__frame').css({"max-width":this.getProperty("calendarwidth")+"px","width":"100%"})
		
    }
    /**
     * detect IE
     * returns version of IE or false, if browser is not Internet Explorer
     */
function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

calendar.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + calendar.prototype.type()));

    return {
        'placeholder': 'Please select date',
        'formatdisplay': 'mm/dd/yyyy',
        'compRTL': false,
		'customcalendar':false,
		'mindate':'',
		'maxdate':'',
		'monthsfull': 'January, February, March, April, May, June, July, August, September, October, November, December',
		'monthsshort': 'Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec',
		'weekdaysfull': 'Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday',
		'weekdaysshort': 'Sun, Mon, Tue, Wed, Thu, Fri, Sat',
		'showmonthsshort': false,
		'showweekdaysfull': false,
		'calendarwidth': 300,

		// Buttons
		'today': 'Today',
		'clear': 'Clear',
		'close': 'Close',

		// Accessibility labels
		'labelmonthnext': 'Next month',
		'labelmonthprev': 'Previous month',
		'labelmonthselect': 'Select a month',
		'labelyearselect': 'Select a year',

		// Formats
		'formatsubmit': '',
		'hiddenprefix': undefined,
		'hiddensuffix': '_submit',
		'hiddenname': undefined,

		// Editable input
		'editable': undefined,

		// Dropdown selectors
		'selectyears': 200,
		'selectmonths': true,

		// First day of the week
		'firstday': 0,

		// Disable dates
		'disable': false,

		// Close on a user action
		'closeonselect': true,
		'closeonclear': true,
    }
}

var isMobile = { 
	Android: function() { 
		return navigator.userAgent.match(/Android/i); 
	}, 
	BlackBerry: function() { 
		return navigator.userAgent.match(/BlackBerry/i); 
	}, 
	iOS: function() { 
		return navigator.userAgent.match(/iPhone|iPad|iPod/i); 
	}, 
	Opera: function() { 
		return navigator.userAgent.match(/Opera Mini/i); 
	}, 
	Windows: function() { 
		return navigator.userAgent.match(/IEMobile/i); 
	}, 
	any: function() { 
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); 
	} 
}; 