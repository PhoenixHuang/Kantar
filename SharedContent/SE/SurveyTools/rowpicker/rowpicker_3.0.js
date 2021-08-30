/**
 * rowpicker class
 * Inherits from SESurveyTool
 */
function rowpicker(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
rowpicker.prototype = Object.create(SESurveyTool.prototype);
rowpicker.prototype.type = function() {
    return "rowpicker";
}
rowpicker.prototype.getDependencies = function() {
    return [];
}

rowpicker.prototype.setInitialResponses = function() {
    this.dimResp = [];
    var that = this;
    var q = this;
    $.each(q.inputs, function(i, e) {
        if ($(e).is(":checked")) {
            that.dimResp.push(i);
        }
    });

}
rowpicker.prototype.setResponses = function() {

    var that = this;
    var allResp = [];
    if (this.result == null) return;
    $.each(this.result, function(i, e) {

        if (typeof surveyPlatform == "undefined") {
            allResp.push(e.id);
            if (e.id == "Other") {
                that.result.Other = e.value;

            }
        } else if (surveyPlatform == "Nfield") {
            if (typeof e.value != "undefined")
                $("#" + e.id.toUpperCase() + "-open").val(e.value);
            allResp.push(e.id);
        }

    });

    this.inputs.filter('input[type!=text]').val(allResp);
    if (typeof surveyPlatform == "undefined") {
        this.setOtherSpecify(this.result);
    }

}
rowpicker.prototype.build = function() {
    var that = this;
    var rowArray = [];
    var imgsrc, label;
    var checkedCount = 0;
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
            checkedCount++;
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

        label = el.parent().find('label').clone();
        imgsrc = label.find('img');
        imgsrc.remove();

        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            var rowLabel = label.html()
            var rowDescription = label.html()
            var rowIsRadio = ((elType == "radio" || el.attr('isexclusive') == "true") ? true : false)
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            if (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim() == "exclusive")
                var isexclusive = true
            var rowLabel = label.html().split("|")[0]
            var rowDescription = label.text().split("|")[0]
            var rowIsRadio = ((elType == "radio" || isexclusive == true) ? true : false)
        }
        // Create the row array
        rowArray.push({
            id: el.attr('value'),
            title: rowDescription,
            //subtitle:rowDescription,
            //description:"Lorem ipsum dolor sit amet, nec ad conceptam interpretaris, mea ne solet repudiandae. Laudem nost",
            image: imgsrc.attr('src'),
            //stamp:imgsrc.attr('src'),
            isRadio: rowIsRadio,
            defaultChecked: defaultChecked
        });
        

        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            if (el.attr('isexclusive') == "true") {
                //rowArray[rowArray.length-1]. uitype = 'default';
                rowArray[rowArray.length - 1].extrasmall = {
                    width: 100
                };
                rowArray[rowArray.length - 1].small = {
                    width: 100
                };
                rowArray[rowArray.length - 1].medium = {
                    width: 100
                };
                rowArray[rowArray.length - 1].large = {
                    width: 100
                };
                rowArray[rowArray.length - 1].extralarge = {
                    width: 100
                };
            }
            if (el.attr('otherid') != '') {
                rowArray[rowArray.length - 1].title = label.text();
                rowArray[rowArray.length - 1].uitype = 'input';
                //rowArray[rowArray.length-1].placeholder= 'please specify...',
                rowArray[rowArray.length - 1].extrasmall = {
                    width: 100
                };
                rowArray[rowArray.length - 1].small = {
                    width: 100
                };
                rowArray[rowArray.length - 1].medium = {
                    width: 100
                };
                rowArray[rowArray.length - 1].large = {
                    width: 100
                };
                rowArray[rowArray.length - 1].extralarge = {
                    width: 100
                };
                rowArray[rowArray.length - 1].isRadio = false;
                rowArray[rowArray.length - 1].defaultValue = otherVal;
            }
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            if (isexclusive == true) {
                //rowArray[rowArray.length-1]. uitype = 'default';
                rowArray[rowArray.length - 1].extrasmall = {
                    width: 100
                };
                rowArray[rowArray.length - 1].small = {
                    width: 100
                };
                rowArray[rowArray.length - 1].medium = {
                    width: 100
                };
                rowArray[rowArray.length - 1].large = {
                    width: 100
                };
                rowArray[rowArray.length - 1].extralarge = {
                    width: 100
                };
            }
            if (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim().indexOf("other") > -1) {
                rowArray[rowArray.length - 1].uitype = 'input';
                rowArray[rowArray.length - 1].extrasmall = {
                    width: 100
                };
                rowArray[rowArray.length - 1].small = {
                    width: 100
                };
                rowArray[rowArray.length - 1].medium = {
                    width: 100
                };
                rowArray[rowArray.length - 1].large = {
                    width: 100
                };
                rowArray[rowArray.length - 1].extralarge = {
                    width: 100
                };
                rowArray[rowArray.length - 1].isRadio = false;
                rowArray[rowArray.length - 1].defaultValue = otherVal;
            }
        }
    });
    this.deferred.resolve();

    var container = document.getElementById("container_" + this.questionFullName);

    this.result = [];
    var that = this;
    this.toolParams = {
        rowArray: rowArray,
        //style: { maxWidth: '1000px' },
        onSelect: function(selectArray, mandBool, isDefault) {
            console.log("\n");
            console.log(selectArray);
            console.log("mandBool: " + mandBool);
            console.log("isDefault: " + isDefault + "\n");
            that.result = selectArray;

            var isSingle = that.inputs.first().attr('type');
            if (isSingle == 'radio') {
                if (that.getProperty("clicktosubmit")) {
                    if (checkedCount < 1) {
                        pageLayout.next.click();
                    }
                    checkedCount = 0;
                }
            }
        }
    }

    
    new QArts.RowPicker($.extend(this.toolParams, this.options), container);
}



rowpicker.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + rowpicker.prototype.type()));
    return {
        row: {
            uitype: "stamp",
            inputonly: true,
            //pricolor:"#9FCC3B",
            //pridarkcolor:"#9FCC3B",
            //prilightcolor:"#dbe5db",
            extrasmall: {
                displayimg: true,
                displaydescr: false,
                imgwidth: 200
            },
            small: {
                displayimg: true,
                displaydescr: false
            },
            medium: {
                displayimg: true,
                displaydescr: false
            },
            large: {
                displayimg: true,
                displaydescr: false
            },
            extralarge: {
                displayimg: true,
                displaydescr: false
            }
        },
        grid: {
            extrasmall: {
                hgap: 0,
                vgap: 0
            },
            small: {
                width: 50,
                hgap: 0,
                vgap: 0
            },
            medium: {
                width: 25,
                hgap: 0,
                vgap: 0
            },
            large: {
                width: 25,
                hgap: 0,
                vgap: 0
            },
            extralarge: {
                width: 25,
                hgap: 0,
                vgap: 0
            }
        },
        clicktosubmit: false
    }
}