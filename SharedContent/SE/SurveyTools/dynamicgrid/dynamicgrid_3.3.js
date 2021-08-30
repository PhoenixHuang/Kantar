/**
 * dynamicgrid class
 * Inherits from SESurveyTool
 */
function dynamicgrid(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
    this.singlePunchCount = 0;
}
dynamicgrid.prototype = Object.create(SESurveyTool.prototype);
dynamicgrid.prototype.type = function() {
    return "dynamicgrid";
}
dynamicgrid.prototype.getDependencies = function() {
    if (this.getProperty("answertype") != null) {
        return [{
            "type": "script",
            "url": pageLayout.resolveFilePath(surveyPage.path + "lib/ILayouts/dg/" + surveyPage.toolVersion.dynamicgrid.idversion + "/Rules/sm_" + this.getProperty("answertype") + ".js")
        }];
    } else {
        return [];
    }
}
dynamicgrid.prototype.setInitialResponses = function() {

}
dynamicgrid.prototype.setResponses = function() {
    if (this.response == null) return;
    this.clearInputs(); // need to clear the responses before setting them.
    var that = this;
    $("textarea").val("");
    console.log(this.response);
    $.each(this.response, function(i, e) {
        var timestr = "";
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            $.each(e, function(j, f) {

                var inputs = that.subquestions[i].inputs;
                var multi = inputs.filter('input[type=checkbox]');
                //if (multi) inputs.filter('[value=' + f.id + ']').val($.makeArray(f.id));				
                if (multi) {
                    if (that.getProperty("columnexpand")) {
                        $('input[rowid=' + f.rowID + '][colid=' + f.columnID + ']').prop("checked", "checked");
                        $('input[rowid=' + f.rowID + '][colid=' + f.columnID + ']').click();
                    } else {
                        inputs.filter('[value=' + f.id + ']').val($.makeArray(f.id));
                    }
                } else {
                    //inputs.val($.makeArray(f.id));
                    if (that.getProperty("columnexpand")) {
                        $('input[rowid=' + f.rowID + '][colid=' + f.columnID + ']').prop("checked", "checked");
                        $('input[rowid=' + f.rowID + '][colid=' + f.columnID + ']').click();
                    } else {
                        inputs.val($.makeArray(f.id));
                    }
                }
                if (inputs.filter('[value=' + f.id + ']').attr('otherid') != '') {
                    that.inputs.filter('[id=' + inputs.filter('[value=' + f.id + ']').attr('otherid') + ']').val(f.value);
                }
                if (that.subquestions[0].inputs.filter('input[type=checkbox]').length <= 0 && that.getProperty("timecapture")) {
                    $("textarea").val($("textarea").val() + f.time);
                }
                //console.log(that.subquestions[0].inputs.filter('input[type=checkbox]').length );
                if (that.subquestions[0].inputs.filter('input[type=checkbox]').length > 0 && that.getProperty("timecapture")) {

                    if (e.length - 1 == j) {
                        timestr = timestr + f.id + ":" + f.time;
                        //alert(timestr);
                        that.inputs.filter('[id=' + inputs.filter('[value=' + that.timecapid + ']').attr('otherid') + ']').val(timestr);
                        inputs.filter('[value=' + that.timecapid + ']').click()
                    } else
                        timestr = timestr + f.id + ":" + f.time + "~";
                }
            });

            if (that.subquestions[0].inputs.filter('input[type=checkbox]').length <= 0 && that.getProperty("timecapture")) {
                if (i == that.subquestions.length - 1)
                    $("textarea").val($("textarea").val());
                else
                    $("textarea").val($("textarea").val() + "~");
            }


        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield

            $.each(e, function(j, f) {
                var inputs = that.subquestions[i].inputs;

                var multi = inputs[0].type == "checkbox";
                if (multi) inputs.filter('[value=' + that.subquestions[i].inputs[0].value.split("-")[0] + "-" + f.id.split("-")[1] + ']').val($.makeArray(that.subquestions[i].inputs[0].value.split("-")[0] + "-" + f.id.split("-")[1]));
                else inputs.filter('[value=' + that.subquestions[i].inputs[0].value.split("-")[0] + "-" + f.id.split("-")[1] + ']').val($.makeArray(that.subquestions[i].inputs[0].value.split("-")[0] + "-" + f.id.split("-")[1]));
                if (typeof f.uitype != "undefined" && (f.uitype == "input" || f.uitype == "mdinput")) {
                    $("#" + that.subquestions[i].inputs[0].id.split("-")[0] + "-" + f.id.split("-")[1] + "-open").val(f.value);
                }
            });
        }
    });

}
dynamicgrid.prototype.build = function() {
    this.timecapid = "";
    pageLayout.content.show();
    this.isstudio = location.href.search(/question\.htm/i) > 0;
    var rowArray = [],
        colArray = [],
        that = this;
    /* intelligent rules otherspecify and exclusive temp array */
    var othersArray = [];
    var exclusiveArray = [];
    // Create questions and columns to build
    this.buildArraysFromGrid();

    // Build up row array
    var rs = {};
    var wordArray = [];
    rs.mWlen = 0, rs.mNumW = 0, rs.mALen = 0, rs.aAlen = 0, rs.aLen = 0, totalVal = 0;
    if (that.subquestions[0].inputs.filter('input[type=checkbox]').length <= 0 && this.getProperty("timecapture")) {
        $('head').append('<style>div.col-sm-12[id^="container_"]{ padding-bottom: 0rem !important; padding-top: 0rem !important;}</style>');
        if (!this.getProperty("developermode"))
            $(".questionContainer").eq(2).hide();
    }
    $.each(this.subquestions, function(i, e) {
        var initResponseId = [];
        var label = e.label;
        var othercnt = 0;
        var otherid = that.subquestions[i].inputs.filter('input[type!=text]').length;
        label.find('span').removeClass('mrQuestionText');
        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');

        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            var idVal = e.id
            that.flag = 0;
            var inputs = that.subquestions[i].inputs.filter('input[type!=text]');
            if (!that.getProperty("timecapture")) {
                $.each(inputs, function(j, f) {
                    if ($(f).attr('otherid') != '') {
                        othercnt++;
                        otherid = parseInt($(f).attr("colid"))
                    }
                    if ($(f).is(":checked")) {
                        that.flag = 1;
                        if ($(f).attr('otherid') != '') {
                            initResponseId.push({
                                index: j, //parseInt($(f).attr("colid")),
                                value: e.inputs.filter('[id=' + $(f).attr('otherid') + ']').val()
                            });

                        } else {
                            if (parseInt($(f).attr("colid")) > otherid) {
                                indexval = parseInt($(f).attr("colid")) - othercnt;
                            } else {
                                indexval = parseInt($(f).attr("colid"))
                            }
                            initResponseId.push({
                                index: indexval
                            });
                        }
                    }
                });
            }
            var rowtitle = ($.trim(label.text()).length == 0) ? $.trim(label.text()) : $.trim(label.html());
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield

            var subqid = e.inputs.filter('input[type!=text]').eq(0).attr("value");
            subqid = subqid.split("-");
            var idVal = subqid[0] + '-' + e.id;
            that.flag = 0;
            var inputs = that.subquestions[i].inputs.filter('input[type!=text]');
            $.each(inputs, function(j, f) {
                if ($("#" + f.id + "-open").length != 0) {
                    othercnt++;
                    otherid = parseInt($(f).attr("colid"))
                }
                if ($(f).is(":checked")) {
                    that.flag = 1;
                    if ($("#" + f.id + "-open").length != 0)
                        initResponseId.push({
                            index: j, //parseInt($(f).attr("colid")),
                            value: $("#" + f.id + "-open").val()
                        });
                    else {
                        if (parseInt($(f).attr("colid")) > otherid) {
                            indexval = parseInt($(f).attr("colid")) - othercnt;
                        } else {
                            indexval = parseInt($(f).attr("colid"))
                        }
                        initResponseId.push({
                            index: indexval
                        });
                    }
                }
            });
            var rowtitle = ($.trim(label.text()).length == 0) ? $.trim(label.text()) : $.trim(label.html());
            rowtitle = rowtitle.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        }

        var rowHasImg = (typeof e.image != 'undefined');
        rowArray.push({
            id: idVal,
            title: rowtitle,
            //subtitle: label.text(),
            //description: label.text(),
            image: e.image,
            defaultChecked: initResponseId
        });
        if (that.getProperty("row$displaytitle") == false && typeof rowArray[i].image !== 'undefined')
            rowArray[i].title = "";

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
    });

    if (wordArray.length > 0) {
        rs.mWlen = (wordArray.sort(function(a, b) {
            return b.length - a.length;
        })[0]).length;
    }
    rs.aAlen = totalVal / rowArray.length;
    rs.aLen = rowArray.length;
    console.log(rs);

    // Build up column array

    var cs = {};
    var wordArray = [];
    cs.mWlen = 0, cs.mNumW = 0, cs.mALen = 0, cs.aAlen = 0, cs.aLen = 0, totalVal = 0;
    console.log("this.columnheaders" + this.columnheaders.length);
    this.scale = that.getProperty("initscale");
    $.each(this.columnheaders, function(i, e) {

        // Match columnheader Index to inputs Index by removing type=text
        var inputs = that.subquestions[0].inputs.filter('input[type!=text]')

        var label = $(e.label);

        label.find('span').removeClass('mrQuestionText');
        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        var image = label.find('img');
        image.hide();

        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            var isexclusive = $(inputs[i]).attr('isexclusive') == "true";
            var labelTxt = label.html();
            if (that.subquestions[0].inputs.filter('input[type=checkbox]').length > 0 && that.getProperty("timecapture")) {
                if ($.trim(label.text().split("_")[1]) == "time") {
                    that.timecapid = inputs[i].value;
                    return true;
                }
            }
            //var descriptionTxt = label.html()
            if ($.trim(label.text()).length == 0)
                var descriptionTxt = $.trim(label.text());
            else
                var descriptionTxt = $.trim(label.html());

        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            var ex = label.text().split("|")[1]
            if (typeof ex != "undefined")
                ex = ex.trim();
            if (typeof ex != "undefined" && ex.toLowerCase() == "exclusive")
                var isexclusive = true;
            var labelTxt = label.html().split("|")[0]
            if ($.trim(label.text().split("|")[0]).length == 0)
                var descriptionTxt = $.trim(label.text()).split("|")[0];
            else
                var descriptionTxt = $.trim(label.html().split("|")[0]);

            descriptionTxt = descriptionTxt.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        }

        //var isexclusive = $(inputs[i]).attr('isexclusive') == "true";
        var isradio = $(inputs[i]).attr('type') == "radio";
        that.radio = isradio;
        var colHasImg = (typeof image.attr('src') != 'undefined');
        colArray.push({
            id: inputs[i].value,
            title: descriptionTxt,
            //subtitle: "PG Golden State Warriors",
            image: image.attr('src'),
            isRadio: (isexclusive || isradio)
        });
        //if(that.getProperty("column$displaytitle")==false)
        //colArray[i].title="";

        if (that.getProperty("column$uitype") == "scale subtitle")
            colArray[i].subtitle = that.scale++;

        if (typeof surveyPlatform == "undefined") {
            if (that.getProperty("column$displaytitle") == false && !(isexclusive || $(inputs[i]).attr('otherid') != '' || typeof colArray[i].image == 'undefined')) {
                colArray[i].title = "";
            }
        } else if (surveyPlatform == "Nfield") {
            if (that.getProperty("column$displaytitle") == false && !(isexclusive == true || (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim().indexOf("other") > -1) || typeof colArray[i].image == 'undefined')) {
                colArray[i].title = "";
            }
        }


        if (isexclusive && !isradio) {
            that.options.dynamicgrid.row.autonext = false;
        }
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            if ($(that.subquestions[0].inputs[i]).attr('isexclusive') == "true") {
                exclusiveArray.push(colArray.length - 1);
            }
            if (isexclusive) {
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
                if (that.getProperty("column$uitype") == "slider column" || that.getProperty("column$uitype") == "imgslider column" || that.getProperty("column$uitype") == "star") {
                    colArray[colArray.length - 1].uitype = that.getProperty("exuitype");
                }
            }
            if ($(inputs[i]).attr('otherid') != '') {
                othersArray.push(colArray.length - 1);
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
        } else if (surveyPlatform == "Nfield") {
            if (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim() == "exclusive") {
                exclusiveArray.push(colArray.length - 1);
            }
            if (isexclusive) {
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
                if (that.getProperty("column$uitype") == "slider column" || that.getProperty("column$uitype") == "imgslider column" || that.getProperty("column$uitype") == "star") {
                    colArray[colArray.length - 1].uitype = that.getProperty("exuitype");
                }
            }

            if (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim().indexOf("other") > -1) {
                othersArray.push(colArray.length - 1);
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
        }
        /* Rule set calculations*/
        var ansString = $.trim(label.text());
        totalVal = totalVal + ansString.length;
        if (ansString.length > cs.mALen) {
            cs.mALen = ansString.length;
        }

        if ($.trim(ansString) != "") {
            var ansStringSplit = $.trim(ansString).split(" ");
            if (ansStringSplit.length > cs.mNumW) {
                cs.mNumW = ansStringSplit.length;
            }
        } else {
            var ansStringSplit = [];
        }

        $.merge(wordArray, ansStringSplit);

        /* End Rule set calculations*/

    });
    if (wordArray.length > 0) {
        cs.mWlen = (wordArray.sort(function(a, b) {
            return b.length - a.length;
        })[0]).length;
    }
    cs.aAlen = totalVal / colArray.length;
    cs.aLen = colArray.length;
    console.log(cs);

    this.deferred.resolve();
    if (!(that.subquestions.length == 1))
        this.bindNavigations()

    if (this.questionFullName.indexOf(".") >= 0)
        var container = document.getElementById("container_" + this.questionName);
    else
        var container = document.getElementById("container_" + this.questionFullName);

    this.sample = [];
    var that = this;
    this.response = [];
    this.toolParams = {
        rowArray: rowArray,
        columnArray: colArray,
        onSelect: function(selectArray, mandBool) {
            console.log(selectArray, mandBool);
            that.response = selectArray;
            if (that.subquestions.length > 1 && that.getProperty('row$autonext')) {
                if (selectArray[that.subquestions.length - 1].length > 0) {
                    if (that.radio && that.flag == 0) {
                        pageLayout.next.click();
                    }
                }
            }
        },
        onNavSelect: function(scrollIndex) {
            if (rowArray.length > 1 && scrollIndex == 0) {
                pageLayout.prev.click();
            }

            if (scrollIndex == rowArray.length - 1) {
                pageLayout.next.click();
            }

        },
        next: (that.subquestions.length == 1) ? pageLayout.next : document.getElementById("dgNext"),
        back: (that.subquestions.length == 1) ? pageLayout.prev : document.getElementById("dgPrev")

    }


    // Code for studio
    if (this.isstudio) {
        $("#dgNext").hover(
            function() {
                $(this).html("<img src='" + pageLayout.themePath + "images/Hover.png' height='56'>");
            },
            function() {
                $(this).html("<img src='" + pageLayout.themePath + "images/Next.png' height='56'>");
            }
        );
    } else {
        $("#dgNext").hover(function() {
            $(this).removeClass("theme-standard-font-color3").addClass("theme-standard-font-color1");
        }, function() {
            $(this).removeClass("theme-standard-font-color1").addClass("theme-standard-font-color3");
        });
    }


    if (this.getProperty("answertype") != null) {
        var that = this;

        function loadrules() {
            pageLayout.showLoader();
            var fnstring = "sm_" + that.getProperty("answertype").replace(/-/g, "_");
            $.each(window[fnstring](rs, cs), function(index, value, url) {
                if (value.c) {
                    if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
                        that.url = pageLayout.resolveFilePath(surveyPage.path + "lib/ILayouts/dg/" + surveyPage.toolVersion.dynamicgrid.idversion + value.s);
                    } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
                        that.url = pageLayout.resolveFilePath(pageLayout.sharedContent + "SE/lib/ILayouts/dg/" + surveyPage.toolVersion.dynamicgrid.idversion + value.s);
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
                data.s.columnGrid.extrasmall.padding = 15;
                data.s.columnGrid.small.padding = 15;
                $.extend(true, that.options, data.s);
                //set uitype to swatches
                $.each(othersArray, function(index, value) {
                    if (typeof data.x.open != "undefined" && !(that.customProps.hasOwnProperty('otherextralargewidth') || that.customProps.hasOwnProperty('otherlargewidth') || that.customProps.hasOwnProperty('othermediumwidth') || that.customProps.hasOwnProperty('othersmallwidth') || that.customProps.hasOwnProperty('otherextrasmallwidth')))
                        $.extend(true, that.toolParams.columnArray[value], data.x.open)
                });
                if (typeof data.x.ex != "undefined")
                    data.x.ex.uitype = "swatches";
                $.each(exclusiveArray, function(index, value) {
                    if (typeof data.x.ex != "undefined" && !(that.customProps.hasOwnProperty('exextralargewidth') || that.customProps.hasOwnProperty('exlargewidth') || that.customProps.hasOwnProperty('exmediumwidth') || that.customProps.hasOwnProperty('exsmallwidth') || that.customProps.hasOwnProperty('exextrasmallwidth')))
                        $.extend(true, that.toolParams.columnArray[value], data.x.ex)
                });

                that.options.dynamicgrid.column.uitype = "swatches";

                //to push themes over rule parameters
                $.extend(true, that.options, surveyPage.themeRuleSetprops.dynamicgrid);

                //to add padding to the top of navigations
                that.options.column.extrasmall.sldrendoffset = 2;
                that.options.column.small.sldrendoffset = 2;
                that.options.column.medium.sldrendoffset = 2;
                that.options.column.large.sldrendoffset = 2;
                that.options.column.extralarge.sldrendoffset = 2;

                that.options.columnGrid.extrasmall.padding = 10;
                that.options.columnGrid.small.padding = 10;
                that.options.columnGrid.medium.padding = 10;
                that.options.columnGrid.large.padding = 10;
                that.options.columnGrid.extralarge.padding = 10;



                //to push custom parameters over rule parameters
                for (var i in that.customProps) {
                    var splitparam = i.split("$")

                    $.each(splitparam, function(key, value) {
                        splitparam[key] = value.toLowerCase();
                        if (value.toLowerCase() == "rowgrid")
                            splitparam[key] = "rowGrid"
                        if (value.toLowerCase() == "columngrid")
                            splitparam[key] = "columnGrid"
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
                new QArts.ScrollMatrix($.extend(true, that.toolParams, that.options), container);
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
         $.getScript( pageLayout.resolveFilePath(surveyPage.path+ "lib/ILayouts/dg/"+surveyPage.toolVersion.dynamicgrid.idversion+"/Rules/sm_"+this.getProperty("answertype")+".js"))
		).then(loadrules);*/
    } else {
        new QArts.ScrollMatrix($.extend(true, this.toolParams, this.options), container);
    }



    //new QArts.ScrollMatrix($.extend(this.toolParams, this.options), container);
    if ($('.nextNavButton').length > 0)
        $(".nextNavButton").css("width", "50%");
    else
        $("#surveyButtons #dgNext, #surveyButtons #dgPrev").css({
            "width": "50%",
            "text-align": "center",
            "float": "right"
        });


}

dynamicgrid.prototype.navNextButton = function() {
    if ($('.nextNavButton').length > 0)
        var themeNextBGColor = "";
    else
        var themeNextBGColor = "theme-bg-color";

    if (typeof navNextButton === "string") return navNextButton;
    if (this.isstudio) {
        return "<a id='dgNext' class='" + themeNextBGColor + " hoverable theme-standard-font-color3' style='display: block;'><img src='" + pageLayout.themePath + "images/Next.png' height='56'></a>";
    } else {
        return "<a id='dgNext' class='" + themeNextBGColor + " hoverable theme-standard-font-color3' style='display: block;'><i class='fa fa-chevron-right fa-1x' style='padding-top: 1.1rem;padding-bottom: 1.1rem;'></i></a>";
    }

}
dynamicgrid.prototype.navPrevButton = function() {

    if ($('.previousNavButton').length > 0)
        var themePrevBGColor = "";
    else
        var themePrevBGColor = "theme-standard-bg-color2";

    if (typeof navPrevButton === "string") return navPrevButton;
    if (this.isstudio) {
        return '<a id="dgPrev" class="' + themePrevBGColor + ' theme-standard-font-color1 hoverable" style="display: block;"><img src="' + pageLayout.themePath + 'images/Prev.png" height="56"></a>';
    } else {
        return '<a id="dgPrev" class="' + themePrevBGColor + ' theme-standard-font-color1 hoverable" style="display: block;"><i class="fa fa-chevron-left fa-1x" style="padding-top: 1.1rem;padding-bottom: 1.1rem;"></i></a>';
    }

}
dynamicgrid.prototype.bindNavigations = function() {
    $('[name=_NNext]').hide();
    $('[name=_NPrev]').hide();
    $('.tempNext').hide();
    $('.tempPrev').hide();


    if (typeof surveyPlatform != "undefined" && surveyPlatform == "Nfield") { // This code belongs to Nfield
        $('[name=button-next]').hide();
        $('[name=button-back]').hide();
    }

    var showdgprev = this.getProperty("showDGprev");
    if (showdgprev == null || (showdgprev != null && showdgprev == true)) {
        if ($('.previousNavButton').length > 0)
            $('.previousNavButton').append(this.navPrevButton());
        else
            $('#surveyButtons').append(this.navPrevButton());
        //Hiding the previous button
        if (!isTest && this.inputs.filter('[type=checkbox]').length > 0) {
            //disable previous button for DG grids
            if (typeof surveyPlatform != "undefined" && surveyPlatform == "Nfield") { // This code belongs to Nfield
                $("[name='_NPrev'][type=button]").css('display', 'none');
            }
            $("[name='button-back'][type=button]").css('display', 'none');
        }
    }


    if ($('.nextNavButton').length > 0)
        $('.nextNavButton').append(this.navNextButton());
    else
        $('#surveyButtons').append(this.navNextButton());

}


dynamicgrid.prototype.toolOptions = function() {
    $.extend(this.options, this.options.dynamicgrid);
    return {
        otheruitype: "mdinput",
        otherextrasmallwidth: 100,
        othersmallwidth: 100,
        othermediumwidth: 100,
        otherlargewidth: 100,
        otherextralargewidth: 100,
        exextrasmallwidth: 100,
        exsmallwidth: 100,
        exmediumwidth: 25,
        exlargewidth: 25,
        exextralargewidth: 25,
        exuitype: "default",
        row: {
            basecolor: "#fafafa",
            captype: 'none',
            capvalue: 3,
            uitype: 'default',
            animtype: 'default',
            scrolltop: true,
            //mandatory:false,
            extrasmall: {
                displayimg: true,
                center: true
            },
            small: {
                displayimg: true,
                center: true
            },
            medium: {
                displayimg: true,
                center: true
            },
            large: {
                displayimg: true,
                center: true
            },
            extralarge: {
                displayimg: true,
                center: true
            }
            //titlecolor: "#FF0000"
        },
        column: {
            uitype: "swatches",
            animtype: 'bottom',
            inputonly: true,
            sldrsnap: true,
            extrasmall: {
                sldrendoffset: 2,
                displayimg: true,
                center: true,
                sldrendimgheight: 35,
                sldrdisplayimg: true
            },
            small: {
                sldrendoffset: 2,
                displayimg: true,
                center: true,
                sldrendimgheight: 35,
                sldrdisplayimg: true
            },
            medium: {
                sldrendoffset: 2,
                displayimg: true,
                center: true,
                sldrdisplayimg: true
            },
            large: {
                sldrendoffset: 2,
                displayimg: true,
                center: true,
                sldrdisplayimg: true
            },
            extralarge: {
                sldrendoffset: 2,
                displayimg: true,
                center: true,
                sldrdisplayimg: true
            }
            //pricolor:"#9FCC3B",
            //pridarkcolor:"#9FCC3B"
        },
        rowGrid: {
            animspeed: 250,
            extrasmall: {
                width: 100,
                center: true
            },
            small: {
                width: 100,
                center: true
            },
            medium: {
                width: 100,
                center: true
            },
            large: {
                width: 100,
                center: true
            },
            extralarge: {
                width: 100,
                center: true
            }
        },
        columnGrid: {
            extrasmall: {
                width: 100,
                hgap: 0,
                vgap: 0
            },
            small: {
                width: 100,
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
        bucketGrid: {},
        groupGrid: {},
        grid: {},
        developermode: false,
        timecapture: false,
        columnexpand: false,
        initscale: 1
    }
}