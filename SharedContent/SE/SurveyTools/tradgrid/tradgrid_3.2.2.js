/**  
 * tradgrid class
 * Inherits from SESurveyTool
 */
function tradgrid(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
tradgrid.prototype = Object.create(SESurveyTool.prototype);
tradgrid.prototype.type = function() {
    return "tradgrid";
}
tradgrid.prototype.getDependencies = function() {
    if (this.getProperty("answertype") != null) {
		return [{
			"type": "script",
			"url": pageLayout.resolveFilePath(surveyPage.path + "lib/ILayouts/tg/" + surveyPage.toolVersion.tradgrid.idversion + "/Rules/tg_" + this.getProperty("answertype") + ".js")
		}];
	}else{
		return [];
	}
	
}
tradgrid.prototype.setInitialResponses = function() {

}
tradgrid.prototype.setResponses = function() {
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
                if (typeof f.uitype != "undefined" && (f.uitype == "input" || f.uitype == "mdinput")) {
                    $("#" + that.subquestions[i].inputs[0].id.split("-")[0] + "-" + f.id.split("-")[1] + "-open").val(f.value);
                }
            });
        }
    });
}
tradgrid.prototype.build = function() {
    pageLayout.content.show();
	this.isstudio = location.href.search(/question\.htm/i) > 0;
    var captype = this.options.row.captype;
    var capvalue = this.options.row.capvalue;
    if (captype == 'min' || captype == 'hard') {
        pageLayout.next.hide();
    }


    var rowArray = [],
        colArray = [],
        that = this;
    this.checkedCount = 0;

    /* intelligent rules otherspecify and exclusive temp array */
    var othersArray = [];
    var exclusiveArray = [];

    // Create questions and columns to build
    this.buildArraysFromGrid();

    var rs = {};
    var wordArray = [];
    rs.mWlen = 0, rs.mNumW = 0, rs.mALen = 0, rs.aAlen = 0, rs.aLen = 0, totalVal = 0;
    // Build up row array
    $.each(this.subquestions, function(i, e) {
        var label = e.label;
		var otherid=that.subquestions[i].inputs.filter('input[type!=text]').length;
        var initResponseId = [];
        label.find('span').removeClass('mrQuestionText');
        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        label.find("span").remove();
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            var qid = e.id;
            var inputs = that.subquestions[i].inputs.filter('input[type!=text]');
            $.each(inputs, function(j, f) {
			    if($(f).attr('otherid')!=''){
				 othercnt++;
				 otherid=parseInt($(f).attr("colid"))
				}
                if ($(f).is(":checked")) {
                    that.flag = 1;
                    if ($(f).attr('otherid') != ''){
                        initResponseId.push({
                            index: j,//parseInt($(f).attr("colid")),
                            value: e.inputs.filter('[id=' + $(f).attr('otherid') + ']').val()
                        });
						
                    }else{
						if(parseInt($(f).attr("colid"))>otherid){
						  indexval=parseInt($(f).attr("colid"))-othercnt;
						}else{
						  indexval=parseInt($(f).attr("colid"))
						}
						initResponseId.push({
                            index: indexval
                        });
					}	
                }
            });
			var rowtitle=label.html()
			
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            var subqid = e.inputs.filter('input[type!=text]').eq(0).attr("value");
            subqid = subqid.split("-");
            var qid = subqid[0] + '-' + e.id;
            var inputs = that.subquestions[i].inputs.filter('input[type!=text]');
            $.each(inputs, function(j, f) {
				if($("#" + f.id + "-open").length != 0){
				 othercnt++;
				 otherid=parseInt($(f).attr("colid"))
				}
                if ($(f).is(":checked")) {
                    that.flag = 1;
                    if ($("#" + f.id + "-open").length != 0)
                        initResponseId.push({
                            index: j,//parseInt($(f).attr("colid")),
                            value: $("#" + f.id + "-open").val()
                        });
                    else{
                        if(parseInt($(f).attr("colid"))>otherid){
						  indexval=parseInt($(f).attr("colid"))-othercnt;
						}else{
						  indexval=parseInt($(f).attr("colid"))
						}
						initResponseId.push({
                            index: indexval
                        });
					}
                }
            });
			var rowtitle= label.html()
			rowtitle=rowtitle.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        }
        rowArray.push({
            id: qid,
            title: rowtitle,
            //subtitle: label.text(),
            //description: "Lorem ipsum dolor sit amet, nec ad conceptam interpretaris, mea ne solet repudiandae. Laudem nost",
            image: e.image
            //defaultChecked: initResponseId
        });
        if (that.getProperty("row$displaytitle") == false)
            rowArray[i].title = "";

        if (that.getProperty("row$delabelrt") != "null" || that.getProperty("row$delabellt") != "null") {
            rowArray[rowArray.length - 1].delabelrt = that.getProperty("row$delabelrt");
            rowArray[rowArray.length - 1].delabellt = that.getProperty("row$delabellt");
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
    });

    if (wordArray.length > 0) {
        rs.mWlen = (wordArray.sort(function(a, b) {
            return b.length - a.length;
        })[0]).length;
    }
    rs.aAlen = totalVal / rowArray.length;
    rs.aLen = rowArray.length;
    console.log(rs);


    var cs = {};
    var wordArray = [];
    cs.mWlen = 0, cs.mNumW = 0, cs.mALen = 0, cs.aAlen = 0, cs.aLen = 0, totalVal = 0;
    // Build up column array()
    $.each(this.columnheaders, function(i, e) {
        var label = $(e.label);
        var inputs = that.subquestions[0].inputs.filter('input[type!=text]');
        label.find('span').removeClass('mrQuestionText');
        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        label.find("span").attr('style', '');

        var image = label.find('img');
        image.hide();
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            var colLabel = label.html();
            var colDescription = label.text();
            var colIsRadio = $(that.subquestions[0].inputs[i]).attr('isexclusive') == "true";
            var colIsRadio = $(that.subquestions[0].inputs[i]).attr('type') == "radio"
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            var colLabel = label.html().split("|")[0];
			colLabel=colLabel.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            var colDescription = label.text().split("|")[0];
            var colIsRadio = (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim() == "exclusive") ? true : false
            colIsRadio = $(that.subquestions[0].inputs[i]).attr('type') == "radio";
        }
        colArray.push({
            id: inputs[i].value,
            title: colLabel, //colLabel,
            subtitle: colLabel,
            image: image.attr('src'),
            isRadio: colIsRadio || colIsRadio
        });
        /*if (that.getProperty("column$displaytitle") == false) {
            colArray[i].title = "";
            colArray[i].subtitle = "";
        }*/
		if (typeof surveyPlatform == "undefined") {
			if (that.getProperty("column$displaytitle") == false && !($(inputs[i]).attr('isexclusive') == "true"|| $(inputs[i]).attr('otherid') != '')){
				colArray[i].title = "";
				colArray[i].subtitle = "";
			}
		}else if (surveyPlatform == "Nfield") {
			if (that.getProperty("column$displaytitle") == false && !((typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim() == "exclusive") || (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim() == "other"))){
				colArray[i].title = "";
				colArray[i].subtitle = "";
			}
		}

        if (that.getProperty("column$uitype") == "slider column" || that.getProperty("column$uitype") == "imgslider column") {
            colArray[colArray.length - 1].title = "";
        } else {
            colArray[colArray.length - 1].subtitle = "";
        }

        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            if ($(that.subquestions[0].inputs[i]).attr('isexclusive') == "true") {
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
				
                exclusiveArray.push(colArray.length - 1);
                if (!colIsRadio)
                    that.options.tradgrid.row.collapseautonext = false;

                if ($(".mrQuestionText").find(".mrErrorText").length == 0 && that.getProperty("hidespecials") && that.checkedCount == 0)
                    colArray.splice(colArray.length - 1, 1);
                //colArray[colArray.length-1].title= "None of the above",
                colArray[colArray.length - 1].isRadio = true
                if (that.getProperty("column$uitype") == "slider column" || that.getProperty("column$uitype") == "imgslider column" || that.getProperty("column$uitype") == "star") {
                    colArray[colArray.length - 1].uitype = that.getProperty("exuitype");
                }

            }
            if ($(inputs[i]).attr('otherid') != '') {
                othersArray.push(colArray.length - 1);
                
                colArray[colArray.length - 1].isRadio = false,
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
            if (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim() == "other") {
                othersArray.push(colArray.length - 1);
                colArray[colArray.length - 1].isRadio = false,
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
                exclusiveArray.push(colArray.length - 1);
                if ($(".mrQuestionText").find(".mrErrorText").length == 0 && that.getProperty("hidespecials") && that.checkedCount == 0)
                    colArray.splice(colArray.length - 1, 1);

                if (that.getProperty("column$uitype") == "slider column" || that.getProperty("column$uitype") == "imgslider column" || that.getProperty("column$uitype") == "star") {
                    colArray[colArray.length - 1].uitype = that.getProperty("exuitype");
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
    if (wordArray.length > 0) {
        cs.mWlen = (wordArray.sort(function(a, b) {
            return b.length - a.length;
        })[0]).length;
    }
    cs.aAlen = totalVal / colArray.length;
    cs.aLen = colArray.length;
    console.log(cs);
	//this.deferred.resolve();
	
    if (this.questionFullName.indexOf(".") >= 0)
        var container = document.getElementById("container_" + this.questionName);
    else
        var container = document.getElementById("container_" + this.questionFullName);
    this.response = [];
    var that = this;
	if(that.getProperty('rowGrid$all$gridtype')=="pagination"){
		if(!(that.subquestions.length==1))
		that.bindNavigations()
	}
    this.toolParams = {
        rowArray: rowArray,
        columnArray: colArray,
        //style: { maxWidth: '1000px' },
         onSelect: function(selectArray, mandBool) {
				console.log(selectArray, mandBool);
				that.response = selectArray;
				that.mandBool=mandBool;
			 if(that.subquestions.length>1&& that.getProperty('row$autonext')){	
				if (selectArray[that.subquestions.length - 1].length > 0) {
					if (that.radio && that.flag == 0) {
						pageLayout.next.click();
					}
				}
			}
			// if(mandBool)
			   // pageLayout.next.click();
        },
        onNavSelect: function(scrollIndex) {
		   
			if (rowArray.length>1&&scrollIndex == 0) {
                pageLayout.prev.click();
            }
			if(that.mandBool){
				if (scrollIndex == rowArray.length - 1) {
					pageLayout.next.click();
				}
			}

        },
		next: (that.subquestions.length==1)?pageLayout.next:document.getElementById("dgNext"),
        back: (that.subquestions.length==1)?pageLayout.prev:document.getElementById("dgPrev")
    }
	if(this.getProperty('rowGrid$all$gridtype')=="pagination"){
		that.toolParams.next=(that.subquestions.length==1)?pageLayout.next:document.getElementById("dgNext")
		that.toolParams.back= (that.subquestions.length==1)?pageLayout.prev:document.getElementById("dgPrev")
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
    }else{
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
            //console.log(rp_text(rs));	

            $.each(eval("tg_" + that.getProperty("answertype").replace(/-/g, "_") + "(rs,cs)"), function(index, value, url) {
                if (value.c) {
                    if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
                        that.url = pageLayout.resolveFilePath(surveyPage.path + "lib/ILayouts/tg/" + surveyPage.toolVersion.tradgrid.idversion + value.s);
                    } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
                        that.url = pageLayout.resolveFilePath(pageLayout.sharedContent + "SE/lib/ILayouts/tg/" + surveyPage.toolVersion.tradgrid.idversion + value.s);
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
						beforeSend: function(){
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
                // to push rule parameters
                $.extend(true, that.options, data.s);

                $.each(othersArray, function(index, value) {
                    if(typeof data.x.open != "undefined" && !(that.customProps.hasOwnProperty('otherextralargewidth')||that.customProps.hasOwnProperty('otherlargewidth')||that.customProps.hasOwnProperty('othermediumwidth')||that.customProps.hasOwnProperty('othersmallwidth')||that.customProps.hasOwnProperty('otherextrasmallwidth')))
					   $.extend(true, that.toolParams.colArray[value], data.x.open)
                });
				if(typeof data.x.ex != "undefined")
                  data.x.ex.uitype = "swatches";
                $.each(exclusiveArray, function(index, value) {
                    if(typeof data.x.ex != "undefined" && !(that.customProps.hasOwnProperty('exextralargewidth')||that.customProps.hasOwnProperty('exlargewidth')||that.customProps.hasOwnProperty('exmediumwidth')||that.customProps.hasOwnProperty('exsmallwidth')||that.customProps.hasOwnProperty('exextrasmallwidth')))
					   $.extend(true, that.toolParams.colArray[value], data.x.ex)
                });


                if (that.options.tradgrid.column.uitype == "slider column" || that.options.tradgrid.column.uitype == "imgslider column") {
                    $.each(that.toolParams.columnArray, function(i, value) {
                        that.toolParams.columnArray[i].title = "";
                    });
                } else {
                    $.each(that.toolParams.columnArray, function(i, value) {
                        that.toolParams.columnArray[i].subtitle = "";
                    });
                }

                //to push themes over rule parameters
                $.extend(true, that.options, eval("surveyPage.themeRuleSetprops." + tradgrid.prototype.type()));

                that.options.column.extrasmall.sldrendoffset = 2;
                that.options.column.small.sldrendoffset = 2;
                that.options.column.medium.sldrendoffset = 2;
                that.options.column.large.sldrendoffset = 2;
                that.options.column.extralarge.sldrendoffset = 2;

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
                new QArts.TradGrid($.extend(true, that.toolParams, that.options), container);
                pageLayout.hideLoader();
            }

            
            $.support.cors = true;
            var get_jsonp = function(){
                if ( window['styles'] === undefined ) {
                        jsonp(that.url);
                    return true;
                } else {
                    return false;
                }
            }

            // repeatedly attempt to get jsonp data and stop once get_jsonp returns true
            var interval = setInterval(function(){
                var result = get_jsonp();
                if ( result )  {
                    clearInterval(interval);
                } 
            },100);
        }
		loadrules();
    } else {
        new QArts.TradGrid($.extend(true, this.toolParams, this.options), container);
    }
	 this.deferred.resolve();
	if($('.nextNavButton').length > 0)
		$(".nextNavButton").css("width", "50%");
	else
		$("#surveyButtons #dgNext, #surveyButtons #dgPrev").css({"width":"50%","text-align": "center","float":"right"});
		
	//$(".__flexgrid_row").css("padding","0px");	
	if($('.nextNavButton').length > 0)
		$(".nextNavButton").css("width", "50%");
	else
		$("#surveyButtons #dgNext, #surveyButtons #dgPrev").css({"width":"50%","text-align": "center","float":"right"});
}

tradgrid.prototype.navNextButton = function() {
	if($('.nextNavButton').length > 0)
		var themeNextBGColor = "";
	else
		var themeNextBGColor = "theme-bg-color";
	
    if (typeof navNextButton === "string") return navNextButton;
    if (this.isstudio) {
        return "<a id='dgNext' class='"+themeNextBGColor+" hoverable theme-standard-font-color3' style='display: block;'><img src='" + pageLayout.themePath + "images/Next.png' height='56'></a>";
    } else {
        return "<a id='dgNext' class='"+themeNextBGColor+" hoverable theme-standard-font-color3' style='display: block;'><i class='fa fa-chevron-right fa-1x' style='padding-top: 1.1rem;padding-bottom: 1.1rem;'></i></a>";
    }

}
tradgrid.prototype.navPrevButton = function() {
	
	if($('.previousNavButton').length > 0)
			var themePrevBGColor = "";
		else
			var themePrevBGColor = "theme-standard-bg-color2";
	
    if (typeof navPrevButton === "string") return navPrevButton;
    if (this.isstudio) {
        return '<a id="dgPrev" class="'+themePrevBGColor+' theme-standard-font-color1 hoverable" style="display: block;"><img src="' + pageLayout.themePath + 'images/Prev.png" height="56"></a>';
    } else {
        return '<a id="dgPrev" class="'+themePrevBGColor+' theme-standard-font-color1 hoverable" style="display: block;"><i class="fa fa-chevron-left fa-1x" style="padding-top: 1.1rem;padding-bottom: 1.1rem;"></i></a>';
    }

}
tradgrid.prototype.bindNavigations = function() {
    $('[name=_NNext]').hide();
    $('[name=_NPrev]').hide();
    $('.tempNext').hide();
    $('.tempPrev').hide();


    if (typeof surveyPlatform != "undefined" && surveyPlatform == "Nfield") { // This code belongs to Nfield
        $('[name=button-next]').hide();
        $('[name=button-back]').hide();
    }

	if($('.nextNavButton').length > 0)
		$('.nextNavButton').append(this.navNextButton());
	else
		$('#surveyButtons').append(this.navNextButton());

    var showdgprev = this.getProperty("showDGprev");
    if (showdgprev == null || (showdgprev != null && showdgprev == true)) {
		if($('.previousNavButton').length > 0)
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


}


tradgrid.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + tradgrid.prototype.type()));
    return {
        row: {
            basecolor: "#d9d9d9",
            captype: 'none',
            capvalue: 3,
            uitype: 'default',
            animtype: 'top',
            delabelrt: "",
            delabellt: "",
			//prilightcolor:"#dbe5db",
            //enablezoom:true,
            extrasmall: {
                center: true,
                displayimg: true,
                displaydescr: false,
				titlesize:12,
				txtpaddinglr:5
            },
            small: {
                center: true,
                displayimg: true,
                displaydescr: false,
				titlesize:12,
				txtpaddinglr:5
            },
            medium: {
                center: true,
                displayimg: true,
                displaydescr: false,
				txtpaddinglr:5
            },
            large: {
                center: true,
                displayimg: true,
                displaydescr: false,
				txtpaddinglr:5
            },
            extralarge: {
                center: true,
                displayimg: true,
                displaydescr: false,
				txtpaddinglr:5
            }
        },
        column: {
            uitype: "scale",
            animtype: 'top',
            sldrdisplaysubtitle: true,
			sldrsnap:true,
            //enablezoom:true,
            extrasmall: {
                sldrdisplayimg: true,
                sldrendoffset: 2,
                center: true,
				labeldisplaytype:"ends",
				titlesize:12
            },
            small: {
                sldrdisplayimg: true,
                sldrendoffset: 2,
                center: true,
				labeldisplaytype:"ends",
				titlesize:12
            },
            medium: {
                sldrdisplayimg: true,
                sldrendoffset: 2,
                center: true,
				labeldisplaytype:"ends"
            },
            large: {
                sldrdisplayimg: true,
                sldrendoffset: 2,
                center: true,
				labeldisplaytype:"ends"
            },
            extralarge: {
                sldrdisplayimg: true,
                sldrendoffset: 2,
                center: true,
				labeldisplaytype:"ends"
            }            
        },
        rowGrid: {
		    
            extrasmall: {
                gridtype:"grid",
				width: 100
            },
            small: {
                gridtype:"grid",
				width: 100
            },
            medium: {
                gridtype:"grid",
				width: 50
            },
            large: {
                gridtype:"grid",
				width: 50
            },
            extralarge: {
                gridtype:"grid",
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