/**
 * gridmatrix class
 * Inherits from SESurveyTool
 */
function gridmatrix(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
gridmatrix.prototype = Object.create(SESurveyTool.prototype);
gridmatrix.prototype.type = function() {
    return "gridmatrix";
}
gridmatrix.prototype.getDependencies = function() {
    return [];
}
gridmatrix.prototype.setInitialResponses = function() {

}
gridmatrix.prototype.setResponses = function() {
    if (this.response == null) return;
    this.clearInputs(); // need to clear the responses before setting them.
    var that = this;
    $.each(this.response, function(i, e) {
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            $.each(e, function(j, f) {
                var inputs = that.subquestions[i].inputs;
                var multi = inputs.filter('input[type=checkbox]');
                if (multi) inputs.filter('[value=' + f.id + ']').val($.makeArray(f.id));
                else inputs.val($.makeArray(f.id));
                if (inputs.filter('[value=' + f.id + ']').attr('otherid') != '') {
                    that.inputs.filter('[id=' + inputs.filter('[value=' + f.id + ']').attr('otherid') + ']').val(f.value);
                }
            });
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            $.each(e, function(j, f) {
                var inputs = that.subquestions[i].inputs;

                var multi = inputs[0].type == "checkbox";
                if (multi) inputs.filter('[value=' + that.subquestions[i].inputs[0].value.split("-")[0] + "-" + f.id.split("-")[1] + ']').val($.makeArray(that.subquestions[i].inputs[0].value.split("-")[0] + "-" + f.id.split("-")[1]));
                else inputs.filter('[value=' + that.subquestions[i].inputs[0].value.split("-")[0] + "-" + f.id.split("-")[1] + ']').val($.makeArray(that.subquestions[i].inputs[0].value.split("-")[0] + "-" + f.id.split("-")[1]));
                if (typeof f.uitype != "undefined" && f.uitype == "input") {
                    $("#" + that.subquestions[i].inputs[0].id.split("-")[0] + "-" + f.id.split("-")[1] + "-open").val(f.value);
                }
            });
        }
    });
}
gridmatrix.prototype.build = function() {
    var rowArray = [],
        colArray = [],
        that = this;

    // Create questions and columns to build
    this.buildArraysFromGrid();

    // Build up row array
    $.each(this.subquestions, function(i, e) {
        var label = e.label;
        var initResponseId = [];
        label.find('span').removeClass('mrQuestionText');
        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        label.find("span").remove();
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            var qid = e.id;

            $.each(e.inputs, function(j, f) {
                if ($(f).is(":checked")) {
                    if ($(f).attr('otherid') != '')
                        initResponseId.push({
                            index: parseInt($(f).attr("colid")),
                            value: e.inputs.filter('[id=' + $(f).attr('otherid') + ']').val()
                        });
                    else
                        initResponseId.push({
                            index: parseInt($(f).attr("colid"))
                        });
                }
            });
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            var subqid = e.inputs.filter('input[type!=text]').eq(0).attr("value");
            subqid = subqid.split("-");
            var qid = subqid[0] + '-' + e.id;
            $.each(e.inputs, function(j, f) {
                if ($(f).is(":checked")) {
                    if ($("#" + f.id + "-open").length != 0)
                        initResponseId.push({
                            index: parseInt($(f).attr("colid")),
                            value: $("#" + f.id + "-open").val()
                        });
                    else
                        initResponseId.push({
                            index: parseInt($(f).attr("colid"))
                        });
                }
            });
        }
        rowArray.push({
            id: qid,
            title: label.html(),
            //subtitle: label.text(),
            description: "Lorem ipsum dolor sit amet, nec ad conceptam interpretaris, mea ne solet repudiandae. Laudem nost",
            image: e.image,
            defaultChecked: initResponseId
        });
    });

    // Build up column array
    $.each(this.columnheaders, function(i, e) {
        var label = $(e.label);
        var inputs = that.subquestions[0].inputs.filter('input[type!=text]')
        label.find('span').removeClass('mrQuestionText');
        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        label.find("span").attr('style', '');

        var image = label.find('img');
        image.hide();
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            var colLabel = label.text();
            var colDescription = label.text();
            var colIsRadio = $(that.subquestions[0].inputs[i]).attr('isexclusive') == "true";
            var colIsRadio = $(that.subquestions[0].inputs[i]).attr('type') == "radio"
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            var colLabel = label.html().split("|")[0];
            var colDescription = label.text().split("|")[0];
            var colIsRadio = (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim() == "exclusive") ? true : false
            colIsRadio = $(that.subquestions[0].inputs[i]).attr('type') == "radio";
        }
        colArray.push({
            id: $(that.subquestions[0].inputs[i]).val(),
            title: colLabel,
            //subtitle: "PG Golden State Warriors",
            image: image.attr('src'),
            isRadio: colIsRadio || colIsRadio
        });
		// if (that.getProperty("downstate")) {
            // colArray[colArray.length - 1].stamp = surveyPage.imagesPath + "img.png";
        // }
		
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            if ($(that.subquestions[0].inputs[i]).attr('isexclusive') == "true") {
                //colArray[colArray.length-1].title= "None of the above",
                colArray[colArray.length - 1].isRadio = true,
                    //colArray[colArray.length-1].uitype= 'default',
                    colArray[colArray.length - 1].extrasmall = {
                        width: '100%'
                    },
                    colArray[colArray.length - 1].small = {
                        width: '100%'
                    },
                    colArray[colArray.length - 1].medium = {
                        width: '100%'
                    },
                    colArray[colArray.length - 1].large = {
                        width: '100%'
                    },
                    colArray[colArray.length - 1].extralarge = {
                        width: '100%'
                    }
            }
            if ($(inputs[i]).attr('otherid') != '') {
                colArray[colArray.length - 1].uitype = 'input',
                    colArray[colArray.length - 1].title = "Other, please specify",
                    //subtitle: "PF Golden State Warriors",
                    colArray[colArray.length - 1].isRadio = false,
                    colArray[colArray.length - 1].extrasmall = {
                        width: 100
                    },
                    colArray[colArray.length - 1].small = {
                        width: 100
                    },
                    colArray[colArray.length - 1].medium = {
                        width: 100
                    },
                    colArray[colArray.length - 1].large = {
                        width: 100
                    },
                    colArray[colArray.length - 1].extralarge = {
                        width: 100
                    }
            }
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            if (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim() == "other") {
                colArray[colArray.length - 1].uitype = 'input',
                    colArray[colArray.length - 1].title = "Other, please specify",
                    //subtitle: "PF Golden State Warriors",
                    colArray[colArray.length - 1].isRadio = false,
                    colArray[colArray.length - 1].extrasmall = {
                        width: 100
                    },
                    colArray[colArray.length - 1].small = {
                        width: 100
                    },
                    colArray[colArray.length - 1].medium = {
                        width: 100
                    },
                    colArray[colArray.length - 1].large = {
                        width: 100
                    },
                    colArray[colArray.length - 1].extralarge = {
                        width: 100
                    }
            }
        }
    });


    var container = document.getElementById("container_" + this.questionFullName);
    this.response = [];
    var that = this;
    this.toolParams = {
        rowArray: rowArray,
        columnArray: colArray,
        //style: { maxWidth: '1000px' },
        onSelect: function(selectArray, mandBool) {
            console.log(selectArray, mandBool);
            that.response = selectArray;
        }
    }
	
	
    new QArts.GridMatrix($.extend(true, this.toolParams, this.options), container);
    this.deferred.resolve();
}
gridmatrix.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + gridmatrix.prototype.type()));
    return {
        row: {
            basecolor: "#d9d9d9",
            captype: 'none',
            capvalue: 3,
            uitype: 'default',
            animtype: 'top',
            //enablezoom:true,
            extrasmall: {
                center: false,
                displayimg: true,
                displaydescr: false
            },
            small: {
                center: false,
                displayimg: true,
                displaydescr: false
            },
            medium: {
                center: true,
                displayimg: true,
                displaydescr: false
            },
            large: {
                center: true,
                displayimg: true,
                displaydescr: false
            },
            extralarge: {
                center: true,
                displayimg: true,
                displaydescr: false
            }
        },
        column: {
            uitype: "stamp",
            animtype: 'top',
            //enablezoom:true,
            extrasmall: {},
            small: {},
            medium: {},
            large: {},
            extralarge: {}
            //pricolor:"#9FCC3B",
            //pridarkcolor:"#9FCC3B",
            //prilightcolor:"#dbe5db",
        },
        rowGrid: {
            extrasmall: {
                width: 100
            },
            small: {
                width: 100
            },
            medium: {
                width: 50
            },
            large: {
                width: 50
            },
            extralarge: {
                width: 50
            }
        },
        columnGrid: {
            extrasmall: {
                width: 100,
                hgap: 0,
                vgap: 0,
                padding: 0
            },
            small: {
                width: 100,
                hgap: 0,
                vgap: 0,
                padding: 0
            },
            medium: {
                width: 50,
                hgap: 0,
                vgap: 0,
                padding: 0
            },
            large: {
                width: 50,
                hgap: 0,
                vgap: 0,
                padding: 0
            },
            extralarge: {
                width: 50,
                hgap: 0,
                vgap: 0,
                padding: 0
            }
        }
    }
}