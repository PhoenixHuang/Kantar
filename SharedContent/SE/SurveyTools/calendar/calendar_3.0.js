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
        if (detectIE() == false) {
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
    console.log('test');
    //var inputData = this.nativeContainer.find('input').val();
    //this.component.find('input').val(inputData);
}

calendar.prototype.setResponses = function() {
    var inputVal = this.component.find('input').val();
    this.nativeContainer.find('input,textarea').val(inputVal);
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
    var dateformat = this.getProperty("dateformat");
    var selectyears = this.getProperty("selectyears");

    if (DeviceType == "PC" || DeviceType == "OTHERDEVICE") {
        dateformat = dateformat.toLowerCase();
        var calendarweekdaydisplay = this.getProperty("calendarweekdaydisplay");
        var calendardatedisplay = this.getProperty("calendardatedisplay");
        var calendardayselected = this.getProperty("calendardayselected");
        var calendarbuttontoday = this.getProperty("calendarbuttontoday");

        $("<style>.picker__weekday-display{background-color:" + calendarweekdaydisplay + "} .picker__date-display{background-color:" + calendardatedisplay + "}.picker--focused .picker__day--selected, .picker__day--selected, .picker__day--selected:hover{background-color:" + calendardayselected + "} .picker__button--today:before{border-top:.66em solid " + calendarbuttontoday + "}</style>").appendTo("head")

        this.inputcontainer = '<div class="md-form" style="margin-top: 1rem;"><input type="text" value="" class="datepicker form-control" id="date_' + this.questionFullName + '" /> <label for="date_' + this.questionFullName + '">' + placeholder + '</label></div>';


    } else {
        if (detectIE() == false) {
			dateformat = dateformat.toUpperCase();
            this.inputcontainer = '<div class="md-form" style="margin-top: 1rem;"><input type="date" value="" data-date="" data-date-format="' + dateformat + '" id="date_' + this.questionFullName + '"/> <label for="date_' + this.questionFullName + '">' + placeholder + '</label></div>';
        } else {
            this.inputcontainer = '<div class="md-form" style="margin-top: 1rem;"><input type="date" value="" id="date_' + this.questionFullName + '"/> <label for="date_' + this.questionFullName + '" style="top: -1.3rem;">' + placeholder + '</label></div>';
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
        var questionname = this.questionFullName;
        var dateformat = this.getProperty("dateformat");
        var selectyears = this.getProperty("selectyears");
        var placeholder = this.getProperty("placeholder");

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
            dateformat = dateformat.toLowerCase();
            $('.datepicker').pickadate({
                selectYears: selectyears,
                format: dateformat
            });
			
			// Set Initial Responses
			var inputData = this.nativeContainer.find('input').val();
			this.component.find('input').val(inputData);
			if(inputData != ""){
				this.component.find('.picker').next('label').addClass('active');
			}
        } else {

            if (detectIE() == false) {
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
				// Set Initial Responses
				var inputData = this.nativeContainer.find('input').val();
				this.component.find('input').val(inputData);
			}
        }
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
        'dateformat': 'mm/dd/yyyy',
        'selectyears': 200,
        'compRTL': false
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