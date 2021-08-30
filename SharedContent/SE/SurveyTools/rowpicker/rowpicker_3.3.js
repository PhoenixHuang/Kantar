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
    if (this.getProperty("answertype") != null) {
        return [{
            "type": "script",
            "url": pageLayout.resolveFilePath(surveyPage.path + "lib/ILayouts/rp/" + surveyPage.toolVersion.rowpicker.idversion + "/Rules/rp_" + this.getProperty("answertype") + ".js")
        }];
    } else {
        return [];
    }
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
    this.inputs.filter('input[type=text]').val("");
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
    pageLayout.content.show();

    var captype = this.options.rowpicker.row.captype;
    var capvalue = this.options.rowpicker.row.capvalue;
    if (captype == 'min' || captype == 'hard') {
        pageLayout.next.hide();
    }

    var that = this;
    var rowArray = [];
    var imgsrc, label;
    this.checkedCount = 0;

    /* intelligent rules otherspecify and exclusive temp array */
    var othersArray = [];
    var exclusiveArray = [];

    var rs = {};
    var wordArray = [];
    rs.mWlen = 0, rs.mNumW = 0, rs.mALen = 0, rs.aAlen = 0, rs.aLen = 0, totalVal = 0;


    $.each(this.inputs.filter('input[type!=text]'), function(i, e) {
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
            console.log($(e));
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

        label = el.parent().find('label').clone();
        imgsrc = label.find('img');
        imgsrc.remove();

        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            var grouptitle = $(".mrShowText").eq(el.attr("id").split("_")[2].substring(1)).html();
            var rowLabel = label.html()
            //var rowDescription = label.html()
            if ($.trim(label.text()).length == 0)
                var rowDescription = $.trim(label.text());
            else
                var rowDescription = $.trim(label.html());
            var rowIsRadio = ((elType == "radio" || el.attr('isexclusive') == "true") ? true : false)
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            var grouptitle = "";
            if (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim() == "exclusive")
                var isexclusive = true
            var rowLabel = label.html().split("|")[0]
            var rowDescription = label.text().split("|")[0]
            if ($.trim(label.text().split("|")[0]).length == 0)
                var rowDescription = $.trim(label.text().split("|")[0]);
            else
                var rowDescription = $.trim(label.html().split("|")[0]);
            rowDescription = rowDescription.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            var rowIsRadio = ((elType == "radio" || isexclusive == true) ? true : false)
        }
        if (that.getProperty("groupgrid$collapseexclusive") == true) {
            rowIsRadio = true;
        }
        // Create the row array
        rowArray.push({
            grouptitle: grouptitle,
            id: el.attr('value'),
            title: rowDescription,
            //subtitle:rowDescription,
            //description:"Lorem ipsum dolor sit amet, nec ad conceptam interpretaris, mea ne solet repudiandae. Laudem nost",
            image: imgsrc.attr('src'),
            //stamp:imgsrc.attr('src'),
            isRadio: rowIsRadio,
            defaultChecked: defaultChecked
        });

        if (typeof surveyPlatform == "undefined") {
            if (that.getProperty("row$displaytitle") == false && !(el.attr('isexclusive') == "true" || el.attr('otherid') != '' || typeof rowArray[i].image == 'undefined')) {
                rowArray[i].title = "";
            }
        } else if (surveyPlatform == "Nfield") {
            if (that.getProperty("row$displaytitle") == false && !(isexclusive == true || (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim().indexOf("other") > -1) || typeof rowArray[i].image == 'undefined')) {
                rowArray[i].title = "";
            }
        }

        /* Rule set calculations*/
        var ansString = $.trim(label.text());
        totalVal = totalVal + ansString.length;
        if (ansString.length > rs.mALen) {
            rs.mALen = ansString.length;
        }

        if ($.trim(ansString) != "") {
            var ansStringSplit = $.trim(ansString).split(" ");
            if (ansStringSplit.length > rs.mNumW) {
                rs.mNumW = ansStringSplit.length;
            }
        } else {
            var ansStringSplit = [];
        }

        $.merge(wordArray, ansStringSplit);

        /* End Rule set calculations*/

        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            if (el.attr('isexclusive') == "true") {
                rowArray[rowArray.length - 1].extrasmall = {
                    width: that.getProperty("exextrasmallwidth")
                };
                rowArray[rowArray.length - 1].small = {
                    width: that.getProperty("exsmallwidth")
                };
                rowArray[rowArray.length - 1].medium = {
                    width: that.getProperty("exmediumwidth")
                };
                rowArray[rowArray.length - 1].large = {
                    width: that.getProperty("exlargewidth")
                };
                rowArray[rowArray.length - 1].extralarge = {
                    width: that.getProperty("exextralargewidth")
                };

                exclusiveArray.push(rowArray.length - 1);
                if ($(".mrQuestionText").find(".mrErrorText").length == 0 && that.getProperty("hidespecials") && that.checkedCount == 0)
                    rowArray.splice(rowArray.length - 1, 1);
            }
            if (el.attr('otherid') != '') {
                othersArray.push(rowArray.length - 1);
                rowArray[rowArray.length - 1].title = label.text();
                rowArray[rowArray.length - 1].uitype = that.getProperty("otheruitype");

                rowArray[rowArray.length - 1].extrasmall = {
                    width: that.getProperty("otherextrasmallwidth")
                };
                rowArray[rowArray.length - 1].small = {
                    width: that.getProperty("othersmallwidth")
                };
                rowArray[rowArray.length - 1].medium = {
                    width: that.getProperty("othermediumwidth")
                };
                rowArray[rowArray.length - 1].large = {
                    width: that.getProperty("otherlargewidth")
                };
                rowArray[rowArray.length - 1].extralarge = {
                    width: that.getProperty("otherextralargewidth")
                };
                if (elType == "radio")
                    rowArray[rowArray.length - 1].isRadio = true;
                else
                    rowArray[rowArray.length - 1].isRadio = false;
                rowArray[rowArray.length - 1].defaultValue = otherVal;
            }
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            if (isexclusive == true) {
                rowArray[rowArray.length - 1].extrasmall = {
                    width: that.getProperty("exextrasmallwidth")
                };
                rowArray[rowArray.length - 1].small = {
                    width: that.getProperty("exsmallwidth")
                };
                rowArray[rowArray.length - 1].medium = {
                    width: that.getProperty("exmediumwidth")
                };
                rowArray[rowArray.length - 1].large = {
                    width: that.getProperty("exlargewidth")
                };
                rowArray[rowArray.length - 1].extralarge = {
                    width: that.getProperty("exextralargewidth")
                };

                exclusiveArray.push(rowArray.length - 1);
                if ($(".mrQuestionText").find(".mrErrorText").length == 0 && that.getProperty("hidespecials") && that.checkedCount == 0)
                    rowArray.splice(rowArray.length - 1, 1);
            }
            if (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim().indexOf("other") > -1) {
                othersArray.push(rowArray.length - 1);
                rowArray[rowArray.length - 1].uitype = that.getProperty("otheruitype");
                rowArray[rowArray.length - 1].extrasmall = {
                    width: that.getProperty("otherextrasmallwidth")
                };
                rowArray[rowArray.length - 1].small = {
                    width: that.getProperty("othersmallwidth")
                };
                rowArray[rowArray.length - 1].medium = {
                    width: that.getProperty("othermediumwidth")
                };
                rowArray[rowArray.length - 1].large = {
                    width: that.getProperty("otherlargewidth")
                };
                rowArray[rowArray.length - 1].extralarge = {
                    width: that.getProperty("otherextralargewidth")
                };
                if (elType == "radio")
                    rowArray[rowArray.length - 1].isRadio = true;
                else
                    rowArray[rowArray.length - 1].isRadio = false;
                rowArray[rowArray.length - 1].defaultValue = otherVal;
            }
        }
    });


    if (wordArray.length > 0) {
        rs.mWlen = (wordArray.sort(function(a, b) {
            return b.length - a.length;
        })[0]).length;
    }
    rs.aAlen = totalVal / rowArray.length;
    rs.aLen = rowArray.length;
    console.log(rs);

    this.deferred.resolve();
    if (this.questionFullName.indexOf(".") >= 0)
        var container = document.getElementById("container_" + this.questionName);
    else
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

            if (captype == 'min') {
                if (selectArray.length >= capvalue) {
                    pageLayout.next.show();
                } else {
                    pageLayout.next.hide();
                }
            }
            if (captype == 'max') {
                if (selectArray.length <= capvalue) {
                    pageLayout.next.show();
                } else {
                    pageLayout.next.hide();
                }
            }
            if (captype == 'hard') {
                if (selectArray.length == capvalue) {
                    pageLayout.next.show();
                } else {
                    pageLayout.next.hide();
                }
            }

            var isSingle = that.inputs.first().attr('type');
            if (isSingle == 'radio') {
                if (that.getProperty("clicktosubmit")) {
                    if (that.checkedCount < 1) {
                        if (typeof selectArray[0].inputonly != "undefined" && selectArray[0].inputonly && !that.getProperty("openendclicktosubmit")) {

                        } else {
                            pageLayout.next.click();
                        }
                    }
                    that.checkedCount = 0;
                }
            }
        }
    }


    if (this.getProperty("answertype") != null && rowArray.length < 1000) {

        pageLayout.showLoader();
        var that = this;

        function loadrules() {
            pageLayout.showLoader();
            var fnstring = "rp_" + that.getProperty("answertype").replace(/-/g, "_");
            $.each(window[fnstring](rs), function(index, value, url) {
                if (value.c) {
                    if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
                        that.url = pageLayout.resolveFilePath(surveyPage.path + "lib/ILayouts/rp/" + surveyPage.toolVersion.rowpicker.idversion + value.s);
                    } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
                        that.url = pageLayout.resolveFilePath(pageLayout.sharedContent + "SE/lib/ILayouts/rp/" + surveyPage.toolVersion.rowpicker.idversion + value.s);
                    }
                    return false;
                }

            });
            this.rulesetParams = {};

            var jsonp = function(url) {

                // once the styles function is called, remove the script from the page, remove the function definition from the window object, and run updateOptions
                var callbackName = 'styles';
                window[callbackName] = function(data) {
                    delete window[callbackName];
                    updateOptions(data);
                };

                jQuery.ajax({
                    type: "GET",
                    url: that.url,
                    contentType: "application/json",
                    dataType: "jsonp",
                    jsonpCallback: 'styles',
                    crossDomain: true,
                    beforeSend: function() {
                        pageLayout.showLoader();
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        console.log(xhr.status);
                        console.log(thrownError);
                        console.log(ajaxOptions);
                    }
                })

            }
            var updateOptions = function(data) {
                pageLayout.showLoader();
                console.log(data);
                // to push rule parameters
                data.s.grid.extrasmall.padding = 15;
                data.s.grid.small.padding = 15;
                data.s.grid.medium.padding = 30;
                data.s.grid.large.padding = 30;
                data.s.grid.extralarge.padding = 30;
                data.s.row.inputonly = true;
                data.x.open.inputonly = true;
                $.extend(true, that.options, data.s);

                $.each(othersArray, function(index, value) {
                    if (typeof data.x.open != "undefined" && !(that.customProps.hasOwnProperty('otherextralargewidth') || that.customProps.hasOwnProperty('otherlargewidth') || that.customProps.hasOwnProperty('othermediumwidth') || that.customProps.hasOwnProperty('othersmallwidth') || that.customProps.hasOwnProperty('otherextrasmallwidth')))
                        $.extend(true, that.toolParams.rowArray[value], data.x.open)
                });
                if (typeof data.x.ex != "undefined")
                    data.x.ex.uitype = "swatches";
                $.each(exclusiveArray, function(index, value) {
                    if (typeof data.x.ex != "undefined" && !(that.customProps.hasOwnProperty('exextralargewidth') || that.customProps.hasOwnProperty('exlargewidth') || that.customProps.hasOwnProperty('exmediumwidth') || that.customProps.hasOwnProperty('exsmallwidth') || that.customProps.hasOwnProperty('exextrasmallwidth')))
                        $.extend(true, that.toolParams.rowArray[value], data.x.ex)

                });


                //set uitype to swatches
                that.options.rowpicker.row.uitype = "swatches";
                //hide images when answertype "text" 
                if (that.getProperty("answertype").toLowerCase().indexOf("text") != -1) {
                    that.options.rowpicker.row.extrasmall.displayimg = false;
                    that.options.rowpicker.row.small.displayimg = false;
                    that.options.rowpicker.row.medium.displayimg = false;
                    that.options.rowpicker.row.large.displayimg = false;
                    that.options.rowpicker.row.extralarge.displayimg = false;
                }
                //to push themes over rule parameters
                $.extend(true, that.options, surveyPage.themeRuleSetprops.rowpicker);

                //to push custom parameters over rule parameters
                for (var i in that.customProps) {
                    var splitparam = i.split("$")


                    $.each(splitparam, function(key, value) {
                        splitparam[key] = value.toLowerCase();
                        if (value.toLowerCase() == "rowgrid")
                            splitparam[key] = "rowGrid"
                        if (value.toLowerCase() == "columngrid")
                            splitparam[key] = "columnGrid"
                        if (value.toLowerCase() == "groupgrid")
                            splitparam[key] = "groupGrid"
                    });
                    if (splitparam.length == 1)
                        that.options[splitparam[0]] = that.customProps[i];
                    else if (splitparam.length == 2)
                        that.options[splitparam[0]][splitparam[1]] = that.customProps[i];
                    else if (splitparam.length == 3) {
                        if (splitparam[1].toLowerCase() == "all") {
                            splitparam[1] = "extrasmall";
                            that.options[splitparam[0]][splitparam[1]][splitparam[2]] = that.customProps[i];
                            splitparam[1] = "small";
                            that.options[splitparam[0]][splitparam[1]][splitparam[2]] = that.customProps[i];
                            splitparam[1] = "medium";
                            that.options[splitparam[0]][splitparam[1]][splitparam[2]] = that.customProps[i];
                            splitparam[1] = "large";
                            that.options[splitparam[0]][splitparam[1]][splitparam[2]] = that.customProps[i];
                            splitparam[1] = "extralarge";
                            that.options[splitparam[0]][splitparam[1]][splitparam[2]] = that.customProps[i];

                        } else {
                            that.options[splitparam[0]][splitparam[1]][splitparam[2]] = that.customProps[i];
                        }
                    }

                }

                $.extend(true, that.options, that.customProps);

                //that.deferred.resolve();

                new QArts.RowPicker($.extend(true, that.toolParams, that.options), container);
                pageLayout.hideLoader();
            }

            $.support.cors = true;

            var get_jsonp = function() {
                if (window['styles'] === undefined) {
                    jsonp(that.url);
                    return true;
                } else {
                    return false;
                }
            }

            // repeatedly attempt to get jsonp data and stop once get_jsonp returns true
            var interval = setInterval(function() {
                var result = get_jsonp();
                if (result) {
                    clearInterval(interval);
                }
            }, 100);
        }
        loadrules();
        /*$.when(
            $.getScript(pageLayout.resolveFilePath(surveyPage.path + "lib/ILayouts/rp/" + surveyPage.toolVersion.rowpicker.idversion + "/Rules/rp_" + this.getProperty("answertype") + ".js"))
        ).then(loadrules);*/
    } else {
        //this.deferred.resolve();
        new QArts.RowPicker($.extend(true, this.toolParams, this.options), container);
    }

}


rowpicker.prototype.toolOptions = function() {
    $.extend(this.options, this.options.rowpicker);
    return {
        row: {
            uitype: "swatches",
            inputonly: true,
            extrasmall: {
                displayimg: true,
                displaydescr: false,
                imgwidth: 200,
                center: true
            },
            small: {
                displayimg: true,
                displaydescr: false,
                center: true
            },
            medium: {
                displayimg: true,
                displaydescr: false,
                center: true
            },
            large: {
                displayimg: true,
                displaydescr: false,
                center: true
            },
            extralarge: {
                displayimg: true,
                displaydescr: false,
                center: true
            }
        },
        column: {},
        rowGrid: {},
        columnGrid: {},
        groupGrid: {},
        bucketGrid: {},
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
        groupGrid: {
            uitype: "arrow",
            collapseopen: false,
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
        exsmallwidth: 50,
        exmediumwidth: 25,
        exlargewidth: 25,
        exextralargewidth: 25,
        clicktosubmit: false,
        userules: false,
        hidespecials: false,
        openendclicktosubmit: true
    }
}