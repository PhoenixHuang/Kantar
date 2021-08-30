/**  
 * rating class
 * Inherits from SESurveyTool
 */
function rating(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
rating.prototype = Object.create(SESurveyTool.prototype);
rating.prototype.type = function() {
    return "rating";
}
rating.prototype.getDependencies = function() {
    return [];
}
rating.prototype.setInitialResponses = function() {

}
rating.prototype.setResponses = function() {
    if (this.response == null) return;
    this.clearInputs(); // need to clear the responses before setting them.
    var that = this;

    $.each(this.response, function(i, e) {
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            $.each(e, function(j, f) {
                var inputs = that.inputs;
                var multi = inputs.filter('input[type=checkbox]');
                if (multi) inputs.filter('[value=' + f.id + ']').val($.makeArray(f.id));
                else inputs.val($.makeArray(f.id));
                if (inputs.filter('[value=' + f.id + ']').attr('otherid') != '') {
                    that.inputs.filter('[id=' + inputs.filter('[value=' + f.id + ']').attr('otherid') + ']').val(f.value);
                }
            });
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            $.each(e, function(j, f) {
                var inputs = that.inputs;

                var multi = inputs[0].type == "checkbox";
                if (multi) inputs.filter('[value=' + that.inputs[0].value.split("-")[0] + "-" + f.id.split("-")[1] + ']').val($.makeArray(that.inputs[0].value.split("-")[0] + "-" + f.id.split("-")[1]));
                else inputs.filter('[value=' + that.inputs[0].value.split("-")[0] + "-" + f.id.split("-")[1] + ']').val($.makeArray(that.inputs[0].value.split("-")[0] + "-" + f.id.split("-")[1]));
                if (typeof f.uitype != "undefined" && (f.uitype == "input" || f.uitype == "mdinput")) {
                    $("#" + that.inputs[0].id.split("-")[0] + "-" + f.id.split("-")[1] + "-open").val(f.value);
                }
            });
        }
    });

}
rating.prototype.build = function() {
    pageLayout.content.show();

    var that = this;
    var rowArray = [];
    var colArray = []
    var imgsrc, label;
    this.checkedCount = 0;
    var initResponseId = [];

    if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
        $.each(this.inputs.filter('input[type!=text]'), function(j, f) {
            if ($(f).is(":checked")) {
                that.checkedCount++;

                if ($(f).attr('otherid') != '') {

                    initResponseId.push({
                        index: j,
                        value: that.inputs.filter('[id=' + $(f).attr('otherid') + ']').val()
                    });
                } else {
                    initResponseId.push({
                        index: j
                    });
                }
            }
        });
    } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
        $.each(this.inputs.filter('input[type!=text]'), function(j, f) {
            if ($(f).is(":checked")) {
                if ($("#" + f.id + "-open").length != 0)
                    initResponseId.push({
                        index: j,
                        value: $("#" + f.id + "-open").val()
                    });
                else
                    initResponseId.push({
                        index: j
                    });
            }
        });
    }

    rowArray.push({
        id: "",
        title: "",
        image: "",
        defaultChecked: initResponseId
    });



    $.each(this.inputs, function(i, e) {
        var el = $(e);
        var otherVal = "";
        var defaultChecked = false;
        var elType = (el).attr('type');
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            if (elType == 'text' || elType == 'textarea') return true;
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            if (elType == 'text' || elType == 'textarea' || el.filter('textarea').attr("class") == "mrEdit") return true;
        }


        if ($(e).is(":checked")) {
            that.checkedCount++;
            defaultChecked = true;
            if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
                if ($(e).attr('otherid') != '') {
                    otherVal = that.inputs.filter('[id=' + $(e).attr('otherid') + ']').val();
                }
            } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
                if (typeof $("#" + $(e).attr("id") + "-open").val() != 'undefined') {
                    otherVal = $("#" + $(e).attr("id") + "-open").val();
                }
            }
        }

        label = el.parent().find('label:last').clone();
        imgsrc = label.find('img');
        imgsrc.remove();

        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            var rowLabel = label.html()
            if ($.trim(label.text()).length == 0)
                var rowDescription = $.trim(label.text());
            else
                var rowDescription = $.trim(label.html());
            var rowIsRadio = ((elType == "radio" || el.attr('isexclusive') == "true") ? true : false)

        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            if (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim() == "exclusive")
                var isexclusive = true
            var rowLabel = label.html().split("|")[0]
            var rowDescription = label.text().split("|")[0]
            if ($.trim(label.text().split("|")[0]).length == 0)
                var rowDescription = $.trim(label.text().split("|")[0]);
            else
                var rowDescription = $.trim(label.html().split("|")[0]);
            rowDescription=rowDescription.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
			var rowIsRadio = ((elType == "radio" || isexclusive == true) ? true : false)
        }
        console.log("rowIsRadio: " + rowIsRadio);
        // Create the row array
        colArray.push({
            id: el.attr('value'),
            //title: rowDescription,
			subtitle: rowDescription,
            image: imgsrc.attr('src'),
            isRadio: rowIsRadio
        });
		//if(that.getProperty("column$displaytitle")==false)
		//colArray[i].subtitle="";
		
		if (typeof surveyPlatform == "undefined") {
			if (that.getProperty("column$displaytitle") == false && !($(that.inputs[i]).attr('isexclusive') == "true"|| $(that.inputs[i]).attr('otherid') != '')){
				colArray[i].subtitle="";
			}
		}else if (surveyPlatform == "Nfield") {
			if (that.getProperty("column$displaytitle") == false && !((typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim() == "exclusive") || (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim() == "other"))){
				colArray[i].subtitle="";
			}
		}

        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            if ($(that.inputs[i]).attr('isexclusive') == "true") {
				colArray[colArray.length - 1].extrasmall = {
                    width: that.getProperty("exextrasmallwidth")
                };
                colArray[colArray.length - 1].small = {
                    width: that.getProperty("exsmallwidth")
                };
                colArray[colArray.length - 1].medium = {
                    width: that.getProperty("exmediumwidth")
                };
                colArray[colArray.length - 1].large = {
                    width: that.getProperty("exlargewidth")
                };
                colArray[colArray.length - 1].extralarge = {
                    width: that.getProperty("exextralargewidth")
                };
                if (!rowIsRadio)
                    that.options.rating.row.collapseautonext = false;

                if ($(".mrQuestionText").find(".mrErrorText").length == 0 && that.getProperty("hidespecials") && that.checkedCount == 0)
                    colArray.splice(colArray.length - 1, 1);

                colArray[colArray.length - 1].isRadio = true
                colArray[colArray.length - 1].uitype = that.getProperty("exuitype");

            }
            if ($(that.inputs[i]).attr('otherid') != '') {
                colArray[colArray.length - 1].uitype = that.getProperty("otheruitype");
              
                colArray[colArray.length - 1].extrasmall = {
                    width: that.getProperty("otherextrasmallwidth")
                };
                colArray[colArray.length - 1].small = {
                    width: that.getProperty("othersmallwidth")
                };
                colArray[colArray.length - 1].medium = {
                    width: that.getProperty("othermediumwidth")
                };
                colArray[colArray.length - 1].large = {
                    width: that.getProperty("otherlargewidth")
                };
                colArray[colArray.length - 1].extralarge = {
                    width: that.getProperty("otherextralargewidth")
                };
            }
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            if (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().indexOf("other") >= 0) {
                colArray[colArray.length - 1].uitype = that.getProperty("otheruitype");
              
                colArray[colArray.length - 1].extrasmall = {
                    width: that.getProperty("otherextrasmallwidth")
                };
                colArray[colArray.length - 1].small = {
                    width: that.getProperty("othersmallwidth")
                };
                colArray[colArray.length - 1].medium = {
                    width: that.getProperty("othermediumwidth")
                };
                colArray[colArray.length - 1].large = {
                    width: that.getProperty("otherlargewidth")
                };
                colArray[colArray.length - 1].extralarge = {
                    width: that.getProperty("otherextralargewidth")
                };
            }

            if (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim() == "exclusive") {
				colArray[colArray.length - 1].extrasmall = {
                    width: that.getProperty("exextrasmallwidth")
                };
                colArray[colArray.length - 1].small = {
                    width: that.getProperty("exsmallwidth")
                };
                colArray[colArray.length - 1].medium = {
                    width: that.getProperty("exmediumwidth")
                };
                colArray[colArray.length - 1].large = {
                    width: that.getProperty("exlargewidth")
                };
                colArray[colArray.length - 1].extralarge = {
                    width: that.getProperty("exextralargewidth")
                };
                if ($(".mrQuestionText").find(".mrErrorText").length == 0 && that.getProperty("hidespecials") && that.checkedCount == 0)
                    colArray.splice(colArray.length - 1, 1);

                colArray[colArray.length - 1].uitype = that.getProperty("exuitype");
            }
        }


    });


    if (this.questionFullName.indexOf(".") >= 0)
        var container = document.getElementById("container_" + this.questionName);
    else
        var container = document.getElementById("container_" + this.questionFullName);

    this.response = [];
    var that = this;
    this.toolParams = {
        rowArray: rowArray,
        columnArray: colArray,
        onSelect: function(selectArray, mandBool) {
            that.response = selectArray;
        }
    }

    this.deferred.resolve();

    new QArts.GridMatrix($.extend(true, this.toolParams, this.options), container);

}
rating.prototype.toolOptions = function() {
    $.extend(this.options, this.options.rating);
    return {
        row: {
            basecolor: "#d9d9d9",
            captype: 'none',
            capvalue: 3,
            uitype: 'default',
			// pricolor:"#26a69a",
			// pridarkcolor:"#186860",
			// prilightcolor:"#dbe5db",
            extrasmall: {},
            small: {},
            medium: {},
            large: {},
            extralarge: {}
        },
        column: {
            uitype: "slider column",
			// pricolor:"#26a69a",
			// pridarkcolor:"#186860",
			// prilightcolor:"#dbe5db",
			// downcolor:"#aadeee",
			sldrsnap:true,
			sldrdisplaysubtitle: true,
            extrasmall: {
                sldrdisplayimg: true,
				sldrendlabelwidth:30
				},
            small: {
                sldrdisplayimg: true,
				sldrendlabelwidth:30
				},
            medium: {
                sldrdisplayimg: true
				},
            large: {
                sldrdisplayimg: true
				},
            extralarge: {
                sldrdisplayimg: true
				}
        },
        rowGrid: {
            extrasmall: {
                width: 100
            },
            small: {
                width: 100
            },
            medium: {
                width: 100
            },
            large: {
                width: 100
            },
            extralarge: {
                width: 100
            }
        },
        columnGrid: {
            extrasmall: {},
            small: {},
            medium: {},
            large: {},
            extralarge: {}
        },
		otheruitype: "mdinput",
		otherextrasmallwidth: 100,
		othersmallwidth: 100,
		othermediumwidth: 100,
		otherlargewidth: 100,
		otherextralargewidth: 100,
		exextrasmallwidth: 100,
		exsmallwidth: 100,
		exmediumwidth: 50,
		exlargewidth: 50,
		exextralargewidth: 50,
        exuitype: "default",
        hidespecials: false
    }
}