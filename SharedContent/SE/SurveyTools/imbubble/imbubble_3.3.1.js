/**
 * toggle class
 * Inherits from SESurveyTool
 */
function imbubble(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
imbubble.prototype = Object.create(SESurveyTool.prototype);

imbubble.prototype.type = function() {
    return "imbubble";
}
imbubble.prototype.getDependencies = function() {
    return [{
            'type': 'stylesheet',
            'url': 'https://fonts.googleapis.com/icon?family=Material+Icons'
        }, {
            'type': 'stylesheet',
            'url': 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700'
        }, {
            'type': 'stylesheet',
            'url' : surveyPage.path + 'lib/KO/imbubble/1.0/css/bootstrap.min.css'
        }, {
            'type': 'stylesheet',
            'url' : surveyPage.path + 'lib/KO/imbubble/1.0/css/bootstrap-material-design.css'
        }, {
            'type': 'stylesheet',
            'url' : surveyPage.path + 'lib/KO/imbubble/1.0/css/ripples.min.css'
        }, {
            'type': 'stylesheet',
            'url' : surveyPage.path + 'lib/KO/imbubble/2.0/css/customstyles.css'
        }, {
            'type': 'stylesheet',
            'url' : surveyPage.path + 'lib/KO/imbubble/1.0/jquery.cssemoticons.css'
        }, {
            'type': 'script',
            'url' : surveyPage.path + 'lib/KO/imbubble/1.0/js/bootstrap.min.js'
        }, {
            'type': 'script',
            'url' : surveyPage.path + 'lib/KO/imbubble/1.0/js/ripples.min.js'
        }, {
            'type': 'script',
            'url' : surveyPage.path + 'lib/KO/imbubble/1.0/js/material.min.js'
        }, {
            'type': 'script',
            'url' : surveyPage.path + 'lib/KO/imbubble/1.0/jquery.cssemoticons.min.js'
        }

    ];
}

imbubble.prototype.build = function() {
    var isstudio, isonlnsrvy, sendIcon, nextIcon, prevIcon;
    this.question_object = [];
	if(isRTL){
		var displayStyle = 'block';
	}else{
		var displayStyle = 'flex';
	}
    isstudio = location.href.search(/question\.htm/i) > 0;
    isonlnsrvy = location.href.search(/\.com/i) > 0;
    if (isstudio || isonlnsrvy) {
        sendIcon = "<i class='material-icons'>&#xE163;</i>";
		if(isRTL){
			nextIcon = "<i class='fa fa-chevron-left fa-1x'></i><!--[if gte IE 8]><i class='material-icons'>&#xE314;</i><![endif]-->";
			prevIcon = "<i class='fa fa-chevron-right fa-1x'></i><!--[if gte IE 8]><i class='material-icons'>&#xE315;</i><![endif]-->";
		}else{
			nextIcon = "<i class='fa fa-chevron-right fa-1x'></i><!--[if gte IE 8]><i class='material-icons'>&#xE315;</i><![endif]-->";
			prevIcon = "<i class='fa fa-chevron-left fa-1x'></i><!--[if gte IE 8]><i class='material-icons'>&#xE314;</i><![endif]-->";
		}
        
    } else {

        sendIcon = "<img src='" + surveyPage.path + "lib/KO/imbubble/images/ic_send_black_48dp_1x.png' width='25' height='25'>";
		if(isRTL){
			nextIcon = "<img src='" + surveyPage.path + "lib/KO/imbubble/images/ic_navigate_before_black_48dp_1x.png' width='25' height='25'>";
			prevIcon = "<img src='" + surveyPage.path + "lib/KO/imbubble/images/ic_navigate_next_black_48dp_1x.png' width='25' height='25'>";
		}else{
			nextIcon = "<img src='" + surveyPage.path + "lib/KO/imbubble/images/ic_navigate_next_black_48dp_1x.png' width='25' height='25'>";
			prevIcon = "<img src='" + surveyPage.path + "lib/KO/imbubble/images/ic_navigate_before_black_48dp_1x.png' width='25' height='25'>";
		}
        
    }
    this.component = $("<br/><br/><div class='container'><div class='row'><div class='col-sm-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2 col-xl-6 col-xl-offset-3'><div class='panel panel-success'><div class='panel-heading'>" + this.nativeContainer.find('.mrQuestionText').clone().html() + "</div><div class='panel-body'><div class='row'><div class='col-sm-12' id='conversation-block'></div></div><div class='row'><hr class='col-sm-12' align='center' /></div><div class='row'><form class='form-group col-sm-12' style='margin: 0px; padding: 0px;width: 100%;'><div class='form-group label-floating' style='margin: 0px;'><div class='input-group' style='margin-left: 10px;'><textarea id='response' class='form-control' placeholder='" + this.getProperty("placeholdertext") + "'></textarea><!--<p class='help-block'>This is an information about what you are writing</p>--><span class='input-group-btn'><button type='button'  class='btn btn-raised btn-fab btn-fab-mini' id='sendBtn'>" + sendIcon + "</button></span></div></div></form></div></div><div class='panel-footer' style='display: "+displayStyle+";background-color: white; padding: 0;'><div class='col-xs-6' style='padding: 0;'><a id='prev' class=' theme-standard-bg-color2 theme-standard-font-color1 hoverable' style='width: 100%;text-align: center; padding:10px 0px;'>" + prevIcon + "</a></div><div class='col-xs-6' style='padding: 0;'><a id='next' class='hoverable theme-bg-color theme-standard-font-color3' style='width: 100%;text-align: center; padding:10px 0px;'>" + nextIcon + "</a></div></div></div></div></div></div>");

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
    var counter = 0
    $.each(this.subquestions, function(i, e) {
        var label = e.label;
        if (e.inputs[0].value == "") {
            if (counter == 0) {
                counter++;
            } else
                label.find(".mrErrorText").remove()
        }
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
    $(".bubble").emoticonize();
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
                $("#conversation-block").append("<div class='row'><i class='material-icons' style='float:right; color:#e0e0e0;'>&#xE6DD;</i><div class='bubble responseTxt'>" + that.question_object[that.currentQuestion].value + "</div></div>");
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
                    if (that.getProperty("endtext") != "")
                        that.askQuestion(that.getProperty("endtext"), that.currentQuestion);
                    if (that.getProperty("autosubmit")) {
						$("#mrForm").submit();
                    }

                }, 400);
            }
        }
    }
}

imbubble.prototype.askQuestion = function(Question1, questionNo) {
    $("#conversation-block").append("<div class='row'><i class='material-icons' style='float:left;margin-top:10px; color:#e0e0e0;'>&#xE853;</i><div class='bubble questionTxt'>" + Question1 + "</div></div>");
    this.currentQuestion = questionNo;
}

imbubble.prototype.render = function() {
    this.componentContainer = $('<section>');
    //this.componentContainer.append(this.label);
    //this.componentContainer.append(this.nativeContainer.find('.mrQuestionText').clone())
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
		$("#mrForm").submit();
    });
    $("#sendBtn").click(function() {
        var resp = document.getElementById('response').value;
        resp = resp.trim();
        if (resp != "" && resp != " ") {
            that.submitResponse(document.getElementById('response').value);
        }
        $(".bubble").emoticonize();
        $(".css-emoticon").css("font-size", "20px");
    });

    $.each(this.question_object, function(i, e) {
        if (that.question_object[i].value === "") {
            that.askQuestion(that.question_object[i].key, i);
            return false;
        }
        if (that.question_object.length == (i + 1)) {
            setTimeout(function() {
                //that.askQuestion("Thanks for your feedback !", that.currentQuestion);
                $("#response").attr("placeholder", "");
                $("#response").attr("disabled", "disabled");
                $("#sendBtn").attr("disabled", "disabled");
                $("#next").show();
            }, 400);
        }

        $("#conversation-block").append("<div class='row'><i class='material-icons' style='float:left;margin-top:10px; color:#e0e0e0;'>&#xE853;</i><div class='bubble questionTxt'>" + e.key + "</div></div>");

        $("#conversation-block").append("<div class='row'><i class='material-icons' style='float:right; color:#e0e0e0;'>&#xE6DD;</i><div class='bubble responseTxt'>" + e.value + "</div></div>");

    });
    $("form").attr("class", "");
    $(".footer1").css("display", "none");
    $(".footer2").css("display", "none");
    $(".nextNavButton").css("display", "none");
    $(".previousNavButton").css("display", "none");
    $("#container_IMBubbleTest").css("display", "none");

    pageLayout.tempNext.hide();

    $("body").css("background-color", "#999");
    $(".container").css("background-color", "#999");
    $(".qcContainer").css("background-color", "#999")
    $("#response").keypress(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) { //Enter keycode
            $("#sendBtn").click();
            $(".bubble").emoticonize();
            $(".css-emoticon").css("font-size", "20px");
        }
    });

	var linecolor = this.getProperty("headerbackgroundcolor");
    $('.form-control, .form-group .form-control').css({"background-image": "-webkit-gradient(linear, left top, left bottom, from("+linecolor+"), to("+linecolor+")), -webkit-gradient(linear, left top, left bottom, from(#D2D2D2), to(#D2D2D2))","background-image": "-webkit-linear-gradient("+linecolor+", "+linecolor+"), -webkit-linear-gradient(#D2D2D2, #D2D2D2)","background-image": "-o-linear-gradient("+linecolor+", "+linecolor+"), -o-linear-gradient(#D2D2D2, #D2D2D2)","background-image": "linear-gradient("+linecolor+", "+linecolor+"), linear-gradient(#D2D2D2, #D2D2D2)"});

}


imbubble.prototype.applyCustomParams = function() {
    var that = this;
    $(".panel-heading").css("background-color", this.getProperty("headerbackgroundcolor"));
    $("#sendBtn").css("background-color", this.getProperty("sendbuttonbackgroundcolor"));
    //$("#sendBtn:hover").css("background-color","#000000 !important")
    $('#sendBtn').hover(function() {
        $("#sendBtn").css("background-color", that.getProperty("sendbuttonbackgroundhovercolor"));
    }, function() {
        $("#sendBtn").css("background-color", that.getProperty("sendbuttonbackgroundcolor"));
    });
}


imbubble.prototype.toolOptions = function() {
    $.extend(this.options, this.options.imbubble);
    return {
        'shownext': false,
        'autosubmit': false,
        //'headerbackgroundcolor':"#4caf50",
        //'sendbuttonbackgroundcolor':"#4caf50",
        'endtext': "",
        'placeholdertext': "Type response here..."
    }
}