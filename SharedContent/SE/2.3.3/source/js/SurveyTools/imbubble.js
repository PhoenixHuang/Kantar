/**
 * toggle class
 * Inherits from SESurveyTool
 */
 
function imbubble(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
imbubble.prototype = Object.create(SESurveyTool.prototype);

imbubble.prototype.type = function(){
    return "imbubble";
}
imbubble.prototype.getDependencies = function(){
    return [ 
		{
			'type': 'stylesheet',
			'url' : 'https://fonts.googleapis.com/icon?family=Material+Icons'
		},{
			'type': 'stylesheet',
			'url' : 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700'
		},{
			'type': 'stylesheet',
			'url' : surveyPage.path + 'lib/KO/imbubble/css/bootstrap.min.css'
		},{
			'type': 'stylesheet',
			'url' : surveyPage.path + 'lib/KO/imbubble/css/bootstrap-material-design.css'
		},{
			'type': 'stylesheet',
			'url' : surveyPage.path + 'lib/KO/imbubble/css/ripples.min.css'
		},{
			'type': 'script',
			'url' : surveyPage.path + 'lib/KO/imbubble/js/bootstrap.min.js'
		},{
			'type': 'script',
			'url' : surveyPage.path + 'lib/KO/imbubble/js/ripples.min.js'
		},{
			'type': 'script',
			'url' : surveyPage.path + 'lib/KO/imbubble/js/material.min.js'
		},{
			'type': 'stylesheet',
			'url' : surveyPage.path + 'lib/KO/imbubble/css/customstyles.css'
		}
		
    ];
}

imbubble.prototype.build = function() {
    var isstudio, isonlnsrvy, sendIcon, nextIcon, prevIcon;
    this.question_object = [];

    isstudio = location.href.search(/question\.htm/i) > 0;
    isonlnsrvy = location.href.search(/\.com/i) > 0;
    if (isstudio || isonlnsrvy) {
        sendIcon = "<i class='material-icons'>send</i><!--[if gte IE 8]><i class='material-icons'>&#xE163;</i><![endif]-->";
        nextIcon = "<i class='material-icons'>keyboard_arrow_right</i><!--[if gte IE 8]><i class='material-icons'>&#xE315;</i><![endif]-->";
        prevIcon = "<i class='material-icons'>keyboard_arrow_left</i><!--[if gte IE 8]><i class='material-icons'>&#xE314;</i><![endif]-->";
    } else {

        sendIcon = "<img src='" + surveyPage.path + "lib/KO/imbubble/images/ic_send_black_48dp_1x.png' width='25' height='25'>";
        nextIcon = "<img src='" + surveyPage.path + "lib/KO/imbubble/images/ic_navigate_next_black_48dp_1x.png' width='25' height='25'>";
        prevIcon = "<img src='" + surveyPage.path + "lib/KO/imbubble/images/ic_navigate_before_black_48dp_1x.png' width='25' height='25'>";
    }

    this.component = $("<br/><br/><div class='container'><div class='row'><div class='col-sm-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2 col-xl-6 col-xl-offset-3'><div class='panel panel-success'><div class='panel-heading'>" + this.label.html() + "</div><div class='panel-body'><div class='row'><div class='col-sm-12' id='conversation-block'></div></div><div class='row'><hr class='col-sm-12' align='center' /></div><div class='row'><form class='form-group col-sm-12' style='margin: 0px; padding: 0px;'><div class='form-group label-floating' style='margin: 0px;'><div class='input-group' style='margin-left: 10px;'><textarea id='response' class='form-control' placeholder='Write response here...'></textarea><!--<p class='help-block'>This is an information about what you are writing</p>--><span class='input-group-btn'><button type='button'  class='btn btn-success btn-raised btn-fab btn-fab-mini' id='sendBtn'>" + sendIcon + "</button></span></div></div></form></div></div><div class='panel-footer' style='display: flex;background-color: white;'><div class='col-xs-6'><a id='prev'>" + prevIcon + "</a></div><div class='col-xs-6'><a id='next'>" + nextIcon + "</a></div></div></div></div></div></div>");

    // Create questions and columns to build
    var that = this;
    $.each(this.nativeContainer.find('tr'), function(i, e) {
        var el = $(e);
        var inputs = $(e).find('textarea');
        if (inputs.length <= 0) {
            $.each(el.find('td.mrGridQuestionText'), function(x, td) {
                that.columnheaders.push({
                    'id': String(that.columnheaders.length),
                    'label': td
                });
            });
        } else {
            that.makeSubQuestion(el, inputs);
        }


    });

    // Build up Subquestion object
    var that = this;
    $.each(this.subquestions, function(i, e) {
        var label = e.label;
        that.question_object.push({
            "key": label.html(),
            "value": e.inputs[0].value
        });
    });
    $(function() {
        $.material.init();
    });

    this.deferred.resolve();
    if (!this.getProperty("shownext"))
	$("#next").hide();
	
    $("#surveyButtons").hide();
}

imbubble.prototype.makeSubQuestion = function(el, inputs) {
    var rowLabel = el.find('td:first span');
    var rowImg = el.find('img')
    rowImg.hide();
    var rowType = inputs.eq(0).attr('type');

    this.subquestions.push({
        'id': String(this.subquestions.length),
        'type': rowType,
        'label': rowLabel,
        'image': rowImg.attr('src'),
        'inputs': inputs
    });
}

imbubble.prototype.submitResponse = function(response) {
    var that = this;
    if (response != "") {
        if (that.currentQuestion <= that.question_object.length) {
            if (typeof that.question_object[that.currentQuestion] !== "undefined") {
                that.question_object[that.currentQuestion].value = response;
                $("#conversation-block").append("<div class='row'><i class='material-icons' style='float:right; color:#e0e0e0;'>bubble_chart</i><div class='bubble responseTxt'>" + that.question_object[that.currentQuestion].value + "</div></div>");
                that.subquestions[that.currentQuestion].inputs.val(that.question_object[that.currentQuestion].value);
            }
            that.currentQuestion++;
            $("#response").val("").focus();
            if (typeof that.question_object[that.currentQuestion] !== "undefined")
                setTimeout(function() {
                    that.askQuestion(that.question_object[that.currentQuestion].key, that.currentQuestion);
                }, 400);
            else
                $("#next").show();
            if (that.currentQuestion == that.question_object.length) {
                setTimeout(function() {
                    that.askQuestion("Thanks for your feedback !", that.currentQuestion);
					if(that.getProperty("autosubmit")){
					 pageLayout.next.click();
					}
					
                }, 400);
            }
        }
    }
}

imbubble.prototype.askQuestion = function(Question1, questionNo) {
    $("#conversation-block").append("<div class='row'><i class='material-icons' style='float:left;margin-top:10px; color:#e0e0e0;'>account_circle</i><div class='bubble questionTxt'>" + Question1 + "</div></div>");
    this.currentQuestion = questionNo;
}

imbubble.prototype.render = function() {
    this.componentContainer = $('<section>');
    //this.componentContainer.append(this.label);
    this.componentContainer.attr('id', 'qc_' + this.questionFullName); //change to be more identifable with question?
    this.componentContainer.addClass('qcContainer');
    this.componentContainer.append(this.component);
    this.nativeContainer.after(this.componentContainer);
    this.nativeContainer.hide();

    this.applyCustomParams();
    var that = this;
    $("#prev").click(function() {
        pageLayout.prev.click();
    });
    $("#next").click(function() {
        pageLayout.next.click();
    });
    $("#sendBtn").click(function() {
        var resp = document.getElementById('response').value;
		resp = resp.trim(); 
		if(resp != "" && resp != " "){
			that.submitResponse(document.getElementById('response').value);
		}
    });

    $.each(this.question_object, function(i, e) {
        if (that.question_object[i].value === "") {
            that.askQuestion(that.question_object[i].key, i);
            return false;
        }
        if (that.question_object.length == (i + 1)){
            setTimeout(function() {
                //that.askQuestion("Thanks for your feedback !", that.currentQuestion);
				$("#response").attr("placeholder","");
				$("#response").attr("disabled","disabled");
				$("#sendBtn").attr("disabled","disabled");	
				$("#next").show();
            }, 400);		    
		}	

        $("#conversation-block").append("<div class='row'><i class='material-icons' style='float:left;margin-top:10px; color:#e0e0e0;'>account_circle</i><div class='bubble questionTxt'>" + e.key + "</div></div>");

        $("#conversation-block").append("<div class='row'><i class='material-icons' style='float:right; color:#e0e0e0;'>bubble_chart</i><div class='bubble responseTxt'>" + e.value + "</div></div>");

    });
}

imbubble.prototype.applyCustomParams = function() {
    $(".panel-heading").css("background-color",this.getProperty("headerbackgroundcolor"));
	$("#sendBtn").css("background-color",this.getProperty("sendbuttonbackgroundcolor"));
}


imbubble.prototype.toolOptions = function() {
        $.extend(this.options, eval("this.options."+imbubble.prototype.type()));
		switch(pageLayout.deviceType.toUpperCase()) {
            case "LARGETABLET":
            case "MEDIUMTABLET":
            case "SMALLTABLET":
            case "SMARTPHONETOUCH":
			    if(this.orientation==0||this.orientation==180) 
				return  {
                    'shownext':false,
					'autosubmit':false,
					'headerbackgroundcolor':"#4caf50",
					'sendbuttonbackgroundcolor':"#4caf50"
                }
				else
				return {
                     'shownext':false,
					'autosubmit':false,
					'headerbackgroundcolor':"#4caf50",
					'sendbuttonbackgroundcolor':"#4caf50"
                }
            case "PC":
            case "OTHERDEVICE":
            default:
                return {
                     'shownext':false,
					'autosubmit':false,
					'headerbackgroundcolor':"#4caf50",
					'sendbuttonbackgroundcolor':"#4caf50"
                }
        }
}
	