/**
 * linkedslider class
 * Inherits from SESurveyTool
 */
function linkedslider(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
linkedslider.prototype = Object.create(SESurveyTool.prototype);
linkedslider.prototype.type = function() {
    return "linkedslider";
}
linkedslider.prototype.getDependencies = function() {
    if (this.getProperty("answertype") != null) {
        return [{
            "type": "script",
            "url": pageLayout.resolveFilePath(surveyPage.path + "lib/ILayouts/ls/" + surveyPage.toolVersion.linkedslider.idversion + "/Rules/ls_" + this.getProperty("answertype") + ".js")
        }];
    } else {
        return [];
    }
}
linkedslider.prototype.setInitialResponses = function() {

}
linkedslider.prototype.setResponses = function() {

    if (this.result == null) return;
    this.clearInputs();
    var that = this;

    $.each(this.result, function(i, e) {
        that.inputs.filter('input[name=' + e.id + ']').val(e.value);
    });
}
linkedslider.prototype.build = function() {
    pageLayout.content.show();
    var rowArray = [],
        that = this;
    // Create questions to build
    this.buildArraysFromGrid();

    // Build up row array
    var rs = {};
    var wordArray = [];
    rs.mWlen = 0, rs.mNumW = 0, rs.mALen = 0, rs.aAlen = 0, rs.aLen = 0, totalVal = 0;
    $.each(this.subquestions, function(i, e) {
        var label = e.label;
        label.find('span').removeClass('mrQuestionText');
        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        label.find('span').remove(); //fix to remove error span tag from label
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            var rowtitle = label.html()
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            var rowtitle = label.html()
            rowtitle = rowtitle.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        }
        rowArray.push({
            id: e.inputs[0].name,
            title: rowtitle,
            //subtitle: label.text(),
            //description: "Lorem ipsum dolor sit amet, nec ad conceptam interpretaris, mea ne solet repudiandae. Laudem nost",
            image: e.image,
            stamp: e.image,
            isRadio: true,
            defaultValue: e.inputs.val()
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

    if (this.questionFullName.indexOf(".") >= 0)
        var container = document.getElementById("container_" + this.questionName);
    else
        var container = document.getElementById("container_" + this.questionFullName);
    this.result = [];
    this.toolParams = {
        rowArray: rowArray,
        onSelect: function(selectArray, mandBool) {
            console.log(selectArray, mandBool);
            that.result = selectArray;
        }
    }
    this.deferred.resolve();
    if (typeof this.options.row.maxpool != "undefined")
        this.options.row.maxPool = this.options.row.maxpool

    if (this.getProperty("answertype") != null) {
        var that = this;

        function loadrules() {
            pageLayout.showLoader();
            var fnstring = "ls_" + that.getProperty("answertype").replace(/-/g, "_");
            $.each(window[fnstring](rs), function(index, value, url) {
                if (value.c) {
                    if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
                        that.url = pageLayout.resolveFilePath(surveyPage.path + "lib/ILayouts/ls/" + surveyPage.toolVersion.linkedslider.idversion + value.s);
                    } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
                        that.url = pageLayout.resolveFilePath(pageLayout.sharedContent + "SE/lib/ILayouts/ls/" + surveyPage.toolVersion.linkedslider.idversion + value.s);
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
                $.extend(true, that.options, data.s);

                //to push themes over rule parameters
                $.extend(true, that.options, surveyPage.themeRuleSetprops.linkedslider);

                that.options.row.extrasmall.sldrendoffset = 2;
                that.options.row.small.sldrendoffset = 2;
                that.options.row.medium.sldrendoffset = 2;
                that.options.row.large.sldrendoffset = 2;
                that.options.row.extralarge.sldrendoffset = 2;

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
                new QArts.LinkedSlider($.extend(true, that.toolParams, that.options), container);
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
         $.getScript( pageLayout.resolveFilePath(surveyPage.path+ "lib/ILayouts/ls/"+surveyPage.toolVersion.linkedslider.idversion+"/Rules/ls_"+this.getProperty("answertype")+".js"))
		).then(loadrules); */
    } else {
        new QArts.LinkedSlider($.extend(true, this.toolParams, this.options), container);
    }

}


linkedslider.prototype.toolOptions = function() {
    $.extend(this.options, this.options.linkedslider);
    return {
        row: {
            suffix: "",
            animtype: 'left',
            remainstr: 'Remaining',
            suffix: '%',
            //maxPool: 10,
            //pricolor:"#9FCC3B",
            //pridarkcolor:"#327E04",
            extrasmall: {
                dir: 'column',
                width: 125,
                displayimg: true,
                sldrendoffset: 2,
                center: true
            },
            small: {
                dir: 'column',
                width: 150,
                displayimg: true,
                sldrendoffset: 2,
                center: true
            },
            medium: {
                dir: 'row',
                width: 175,
                displayimg: true,
                sldrendoffset: 2,
                center: true
            },
            large: {
                dir: 'row',
                width: 175,
                displayimg: true,
                sldrendoffset: 2,
                center: true
            },
            extralarge: {
                dir: 'row',
                width: 175,
                displayimg: true,
                sldrendoffset: 2,
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
                hgap: 0,
                vgap: 0
            },
            medium: {
                width: 50,
                hgap: 0,
                vgap: 0
            },
            large: {
                width: 50,
                hgap: 0,
                vgap: 0
            },
            extralarge: {
                width: 50,
                hgap: 0,
                vgap: 0
            }
        }
    }
}