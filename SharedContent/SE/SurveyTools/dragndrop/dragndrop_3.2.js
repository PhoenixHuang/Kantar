/**
 * dragndrop class
 * Inherits from SESurveyTool
 */
function dragndrop(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
dragndrop.prototype = Object.create(SESurveyTool.prototype);
dragndrop.prototype.type = function() {
    return "dragndrop";
}
dragndrop.prototype.getDependencies = function() {
    if (this.getProperty("answertype") != null) {
		return [{
			"type": "script",
			"url": pageLayout.resolveFilePath(surveyPage.path + "lib/ILayouts/dd/" + surveyPage.toolVersion.dragndrop.idversion + "/Rules/dd_" + this.getProperty("answertype") + ".js")
		}];
	}else{
		return [];
	}
}
dragndrop.prototype.setInitialResponses = function() {

}
dragndrop.prototype.setResponses = function() {
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
dragndrop.prototype.build = function() {
     pageLayout.content.show();
    if (this.getProperty("hidenextbutton"))
        pageLayout.next.hide();
    var rowArray = [],
        colArray = [],
        that = this;

    // Create questions and columns to build
    this.buildArraysFromGrid();

    // Build up row array
    var rs = {};
    var wordArray = [];
    rs.mWlen = 0, rs.mNumW = 0, rs.mALen = 0, rs.aAlen = 0, rs.aLen = 0, totalVal = 0;
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
			var rowtitle=($.trim(label.text()).length==0)?$.trim(label.text()):$.trim(label.html());
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
			var rowtitle=($.trim(label.text()).length==0)?$.trim(label.text()):$.trim(label.html());
			rowtitle=rowtitle.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        }
        rowArray.push({
            id: qid,
            title: rowtitle,
            //subtitle: label.text(),
            //description: "Lorem ipsum dolor sit amet, nec ad conceptam interpretaris, mea ne solet repudiandae. Laudem nost",
            image: e.image,
            defaultChecked: initResponseId
        });
		if(that.getProperty("row$displaytitle")==false)
		rowArray[i].title="";
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
			if($.trim(label.text()).length==0)
			 var colLabel = $.trim(label.text());
			else 
              var colLabel = $.trim(label.html());
            var colDescription = label.text();
            var colIsRadio = $(that.subquestions[0].inputs[i]).attr('isexclusive') == "true";
            var colIsRadio = $(that.subquestions[0].inputs[i]).attr('type') == "radio"
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            if($.trim(label.text().split("|")[0]).length==0)
			  var colLabel =$.trim(label.text().split("|")[0]);
			else  
			  var colLabel = $.trim(label.html().split("|")[0]);
            colLabel=colLabel.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
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
		if(that.getProperty("column$displaytitle")==false)
		colArray[i].title="";

        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            if ($(that.subquestions[0].inputs[i]).attr('isexclusive') == "true") {
                colArray[colArray.length - 1].isRadio = true
            }
            if ($(inputs[i]).attr('otherid') != '') {
                colArray[colArray.length - 1].uitype = 'mdinput',
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
                colArray[colArray.length - 1].uitype = 'mdinput',
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

    if (this.getProperty("tracktype") == "zone") {
        var color = this.getProperty("slidercolors");
        color = color.split("$");
        $.each(color, function(key, value) {
            //alert( key + ": " + value );
            colArray[key].seccolor = value;
        });
    }
	if (this.getProperty("capvalue") != "") {
        var capvalues = this.getProperty("capvalue").split("$");
        $.each(capvalues, function(key, value) {
            colArray[key].capvalue = value;
        });
    }
	
	//Setting MB Love hate dropzone header colors
	if (this.getProperty("useaffinity")) {
        var color = "#000000$#2A0000$#550000$#7F0000$#AA0000$#D40000$#FF0000";
        color = color.split("$");
        $.each(color, function(key, value) {
            //alert( key + ": " + value );
            colArray[key].seccolor = value;
        });
    }
	//End Setting MB Love hate dropzone header colors

    if (wordArray.length > 0) {
        cs.mWlen = (wordArray.sort(function(a, b) {
            return b.length - a.length;
        })[0]).length;
    }
    cs.aAlen = totalVal / colArray.length;
    cs.aLen = colArray.length;
    console.log(cs);


    if (this.questionFullName.indexOf(".") >= 0)
        var container = document.getElementById("container_" + this.questionName);
    else
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
            if (that.getProperty("hidenextbutton")) {
                if (mandBool) {
                    pageLayout.next.show();
                }
            }

        }
    }
    this.deferred.resolve();


    if ((this.getProperty("answertype") != null && (this.getProperty("answertype") == "MB" || this.getProperty("answertype") == "MB-pag")) || (this.getProperty("answertype") != null && this.columnheaders.length < 7)) {
        var that = this;
		pageLayout.showLoader();
        function loadrules() {
			pageLayout.showLoader();
            //console.log(rp_text(rs));	

            $.each(eval("dd_" + that.getProperty("answertype").replace(/-/g, "_") + "(rs,cs)"), function(index, value, url) {
                if (value.c) {
                    if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
                        that.url = pageLayout.resolveFilePath(surveyPage.path + "lib/ILayouts/dd/" + surveyPage.toolVersion.dragndrop.idversion + value.s);
                    } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
                        that.url = pageLayout.resolveFilePath(pageLayout.sharedContent + "SE/lib/ILayouts/dd/" + surveyPage.toolVersion.dragndrop.idversion + value.s);
                    }

                    return false;
                }

            });
            this.rulesetParams = {};

            var updateOptions = function(data) {
				pageLayout.showLoader();
                console.log(data);
                // to push rule parameters
                $.extend(true, that.options, data.s);
				// displayimg=true for extrasmall in MB,pag and MB-pag answertypes to fix image missing issue
				if(that.customProps.answertype=='pag' || that.customProps.answertype=='MB-pag'||that.customProps.answertype=='MB')
				  that.options.dragndrop.column.extrasmall.displayimg=true
				// added padding=5 for extrasmall, small and medium in pag and MB-pag answertypes to fix pagenation overlap issue
				if(that.customProps.answertype=='pag' || that.customProps.answertype=='MB-pag'){
				  that.options.rowGrid.extrasmall.padding=5; 
				  that.options.rowGrid.small.padding=5;
				  that.options.rowGrid.medium.padding=5;				  
				}

                //to push themes over rule parameters
                $.extend(true, that.options, eval("surveyPage.themeRuleSetprops." + dragndrop.prototype.type()));
				
				 //to add padding to the top of navigations
					 that.options.columnGrid.extrasmall.padding=10;
					 that.options.columnGrid.small.padding=10;
					 that.options.columnGrid.medium.padding=10;
					 that.options.columnGrid.large.padding=10;
					 that.options.columnGrid.extralarge.padding=10;

                //Setting row down color to #FFFFFF
                that.options.dragndrop.row.downcolor = "#FFFFFF";

                //to push custom parameters over rule parameters
                for (var i in that.customProps) {
                    var splitparam = i.split("$")

                    $.each(splitparam, function(key, value) {
                        splitparam[key] = value.toLowerCase();
                        if (value.toLowerCase() == "rowgrid")
                            splitparam[key] = "rowGrid";
                        if (value.toLowerCase() == "columngrid")
                            splitparam[key] = "columnGrid";
                        if (value.toLowerCase() == "bucketgrid")
                            splitparam[key] = "bucketGrid";
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
				
				//MB Love hate dropzone header title color to white
				if (that.getProperty("useaffinity")||that.getProperty("tracktype")=='zone') {
					that.options.dragndrop.column.titlecolor = "#FFFFFF";
				}
				//End MB Love hate dropzone header title color to white

                //that.deferred.resolve();
				pageLayout.hideLoader();
                new QArts.DragnDrop($.extend(true, that.toolParams, that.options), container);
				
            }

            $.support.cors = true;
            $.when(
                jQuery.ajax({
                    type: "GET",
                    url: that.url,
                    contentType: "application/json",
                    dataType: "jsonp",
					jsonpCallback: 'styles',
                    crossDomain: true,
						beforeSend: function(){
						 pageLayout.showLoader();
					   },
                    error: function(xhr, ajaxOptions, thrownError) {
                        console.log(xhr.status);
						console.log(thrownError);
						console.log(ajaxOptions);
                    }
                })
            ).then(updateOptions);
        }
		loadrules();
        /*$.when(
            $.getScript(pageLayout.resolveFilePath(surveyPage.path + "lib/ILayouts/dd/" + surveyPage.toolVersion.dragndrop.idversion + "/Rules/dd_" + this.getProperty("answertype") + ".js"))
        ).then(loadrules);*/
    } else {
		//MB Love hate dropzone header title color to white
		if (that.getProperty("useaffinity")||that.getProperty("tracktype")=='zone') {
			that.options.dragndrop.column.titlecolor = "#FFFFFF";
		}
		//End MB Love hate dropzone header title color to white

        //Setting row down color to #FFFFFF
        that.options.dragndrop.row.downcolor = "#FFFFFF";
        new QArts.DragnDrop($.extend(true, this.toolParams, this.options), container);
    }

}
dragndrop.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + dragndrop.prototype.type()));
    return {
        row: {
            issingle: true,
            lockpos: false,
            animtype: 'right',
            downcolor: '#FFFFFF',
            //pridarkcolor:'#26a69a',
            extrasmall: {
                displayimg: true,
				center:true
            },
            small: {
                displayimg: true,
				center:true
            },
            medium: {
                displayimg: true,
				center:true
            },
            large: {
                displayimg: true,
				center:true
            },
            extralarge: {
                displayimg: true,
				center:true
            }
        },
        column: {
            //hovercolor:'#26a69a',
            extrasmall: {
                bucketautoclose: false,
                bucketinitopen: true,
                displayimg: true,
				center:true
            },
            small: {
                bucketautoclose: false,
                bucketinitopen: true,
                displayimg: true,
				center:true
            },
            medium: {
                bucketautoclose: false,
                bucketinitopen: true,
                displayimg: true,
				center:true
            },
            large: {
                bucketautoclose: false,
                bucketinitopen: true,
                displayimg: true,
				center:true
            },
            extralarge: {
                bucketautoclose: false,
                bucketinitopen: true,
                displayimg: true,
				center:true
            }
        },
        rowGrid: {
            issequential: false,
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
                width: 33.33333333333333,
                hgap: 5,
                vgap: 5
            },
            extralarge: {
                width: 33.33333333333333,
                hgap: 5,
                vgap: 5
            }
        },
        columnGrid: {
            extrasmall: {
                width: 100
            },
            small: {
                width: 100,
                hgap: 5,
                vgap: 5
            },
            medium: {
                width: 50,
                hgap: 5,
                vgap: 5
            },
            large: {
                width: 33.33333333333333,
                hgap: 5,
                vgap: 5
            },
            extralarge: {
                width: 33.33333333333333,
                hgap: 5,
                vgap: 5
            }
        },
        bucketGrid: {
            extrasmall: {},
            small: {},
            medium: {},
            large: {},
            extralarge: {}
        },
        hidenextbutton: true,
		capvalue: ""
    }
}