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
    return [];
}
dynamicgrid.prototype.setInitialResponses = function() {

}
dynamicgrid.prototype.setResponses = function() {
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
                if (typeof f.uitype != "undefined" && (f.uitype == "input"|| f.uitype == "mdinput")) {
                    $("#" + that.subquestions[i].inputs[0].id.split("-")[0] + "-" + f.id.split("-")[1] + "-open").val(f.value);
                }
            });
        }
    });

}
dynamicgrid.prototype.build = function() {
	pageLayout.content.show();
    this.isstudio = location.href.search(/question\.htm/i) > 0;
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
        var initResponseId = [];
        var label = e.label;
        label.find('span').removeClass('mrQuestionText');
        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');

        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            var idVal = e.id
            that.flag = 0;
			var inputs = that.subquestions[i].inputs.filter('input[type!=text]');
            $.each(inputs, function(j, f) {
                if ($(f).is(":checked")) {
                    that.flag = 1;
                    if ($(f).attr('otherid') != ''){
                        initResponseId.push({
                            index: j,//parseInt($(f).attr("colid")),
                            value: e.inputs.filter('[id=' + $(f).attr('otherid') + ']').val()
                        });
                    }else
                        initResponseId.push({
                            index: parseInt($(f).attr("colid"))
                        });
                }
            });
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            var subqid = e.inputs.filter('input[type!=text]').eq(0).attr("value");
            subqid = subqid.split("-");
            var idVal = subqid[0] + '-' + e.id;
            that.flag = 0;
            var inputs = that.subquestions[i].inputs.filter('input[type!=text]');
			$.each(inputs, function(j, f) {
                if ($(f).is(":checked")) {
                    that.flag = 1;
                    if ($("#" + f.id + "-open").length != 0)
                        initResponseId.push({
                            index: j,//parseInt($(f).attr("colid")),
                            value: $("#" + f.id + "-open").val()
                        });
                    else
                        initResponseId.push({
                            index: parseInt($(f).attr("colid"))
                        });
                }
            });
        }
		
        var rowHasImg = (typeof e.image != 'undefined');
        rowArray.push({
            id: idVal,
            title: ($.trim(label.text()).length==0)?$.trim(label.text()):$.trim(label.html()),
            //subtitle: label.text(),
            //description: label.text(),
            image: e.image,
            defaultChecked: initResponseId
        });
		
		/* Rule set calculations*/
        var ansString = $.trim(label.text());
        totalVal = totalVal + ansString.length;
        if (ansString.length > rs.mALen) {
            rs.mALen = ansString.length;
        }
		
		if($.trim(ansString) != ""){
			var ansStringSplit = $.trim(ansString).split(" ");
			if (ansStringSplit.length > rs.mNumW) {
				rs.mNumW = ansStringSplit.length;
			}
		}else{
			var ansStringSplit = [];
		}

        $.merge(wordArray, ansStringSplit);

        /* End Rule set calculations*/
    });
	
	if(wordArray.length > 0){
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
            var labelTxt = label.html()
            //var descriptionTxt = label.html()
			if($.trim(label.text()).length==0)
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
			if($.trim(label.text().split("|")[0]).length==0)
			  var descriptionTxt = $.trim(label.text()).split("|")[0];
			else  
			  var descriptionTxt = $.trim(label.html().split("|")[0]);
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



       if (isexclusive && !isradio  ) {
			that.options.dynamicgrid.row.autonext= false;
            //colArray[colArray.length-1].uitype= 'default'
            /*colArray[colArray.length - 1].extrasmall = {
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
                }*/
        }
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            if ($(inputs[i]).attr('otherid') != '') {
                colArray[colArray.length - 1].uitype = 'mdinput',
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
        } else if (surveyPlatform == "Nfield") {
            if (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim().indexOf("other") > -1) {
                colArray[colArray.length - 1].uitype = 'mdinput',
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

        if($.trim(ansString) != ""){
			var ansStringSplit = $.trim(ansString).split(" ");
			if (ansStringSplit.length > cs.mNumW) {
				cs.mNumW = ansStringSplit.length;
			}
		}else{
			var ansStringSplit = [];
		}

        $.merge(wordArray, ansStringSplit);

        /* End Rule set calculations*/
		
    });
	if(wordArray.length > 0){
		cs.mWlen = (wordArray.sort(function(a, b) {
			return b.length - a.length;
		})[0]).length;
	}
    cs.aAlen = totalVal / colArray.length;
    cs.aLen = colArray.length;
    console.log(cs);
	
    this.deferred.resolve();
	if(!(that.subquestions.length==1))
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
			
            if (selectArray[that.subquestions.length - 1].length > 0) {
                if (that.radio && that.flag == 0) {
                    pageLayout.next.click();
                }
            }
        },
        onNavSelect: function(scrollIndex) {
            console.log(scrollIndex);
			if (scrollIndex == 0) {
                pageLayout.prev.click();
            }
			
            if (scrollIndex == rowArray.length - 1) {
                pageLayout.next.click();
            }

        },
        next: (that.subquestions.length==1)?pageLayout.next:document.getElementById("dgNext"),
        back: (that.subquestions.length==1)?pageLayout.prev:document.getElementById("dgPrev")
		
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
    }

	
	if(this.getProperty("answertype")!=null){ 
	    var that = this;
        function loadrules(){  			
           
		   //console.log(rp_text(rs));	
		      
		   $.each(eval("sm_"+that.getProperty("answertype").replace(/-/g , "_")+"(rs,cs)"), function( index, value, url) {
			  if (value.c){
			   if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
					 that.url=pageLayout.resolveFilePath(surveyPage.path+"lib/ILayouts/dg/"+surveyPage.toolVersion.dynamicgrid.idversion+value.s);
				} else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
					that.url=pageLayout.resolveFilePath(pageLayout.sharedContent+"SE/lib/ILayouts/dg/"+surveyPage.toolVersion.dynamicgrid.idversion+value.s);
				}
			   
				return false; 
			   }
			   
			});
		   this.rulesetParams={};
		   	   
				var updateOptions = function(data) {
				    console.log(data);
					// to push rule parameters
					$.extend(true, that.options, data.s);
					//set uitype to swatches
					that.options.dynamicgrid.column.uitype="swatches";
					
					//to push themes over rule parameters
					 $.extend(true, that.options, eval("surveyPage.themeRuleSetprops."+ dynamicgrid.prototype.type()));
					 
					 //to add padding to the top of navigations
					 that.options.columnGrid.extrasmall.padding=10;
					 that.options.columnGrid.small.padding=10;
					 that.options.columnGrid.medium.padding=10;
					 that.options.columnGrid.large.padding=10;
					 that.options.columnGrid.extralarge.padding=10;					 

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
					else if (splitparam.length == 3){
						 if(splitparam[1].toLowerCase()=="all"){				 
							splitparam[1]="extrasmall";
							that.options[splitparam[0]][splitparam[1]][splitparam[2]] = that.customProps[i];
							splitparam[1]="small";
							that.options[splitparam[0]][splitparam[1]][splitparam[2]] = that.customProps[i];
							splitparam[1]="medium";
							that.options[splitparam[0]][splitparam[1]][splitparam[2]] = that.customProps[i];
							splitparam[1]="large";
							that.options[splitparam[0]][splitparam[1]][splitparam[2]] = that.customProps[i];
							splitparam[1]="extralarge";
							that.options[splitparam[0]][splitparam[1]][splitparam[2]] = that.customProps[i];
							 
						 }else{
						   that.options[splitparam[0]][splitparam[1]][splitparam[2]] = that.customProps[i];
						 }
					}
				}
				$.extend(true,that.options, that.customProps);
					
					//that.deferred.resolve();
					new QArts.ScrollMatrix($.extend(true,that.toolParams, that.options), container);
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
						error: function (xhr, ajaxOptions, thrownError) {
								console.log(xhr.status);
								console.log(thrownError);
								console.log(ajaxOptions);
								}
					})
				).then(updateOptions); 
        }
		
      	$.when(		  
         $.getScript( pageLayout.resolveFilePath(surveyPage.path+ "lib/ILayouts/dg/"+surveyPage.toolVersion.dynamicgrid.idversion+"/Rules/sm_"+this.getProperty("answertype")+".js"))
		).then(loadrules); 	
   }   
  else{ 
   new QArts.ScrollMatrix($.extend(true, this.toolParams, this.options), container);
   }

	
	
    //new QArts.ScrollMatrix($.extend(this.toolParams, this.options), container);
	if($('.nextNavButton').length > 0)
		$(".nextNavButton").css("width", "50%");
	else
		$("#surveyButtons #dgNext, #surveyButtons #dgPrev").css({"width":"50%","text-align": "center","float":"right"});
}

dynamicgrid.prototype.navNextButton = function() {
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
dynamicgrid.prototype.navPrevButton = function() {
	
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
dynamicgrid.prototype.bindNavigations = function() {
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


dynamicgrid.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + dynamicgrid.prototype.type()));
    return {
        row: {
            basecolor: "#fafafa",
            captype: 'none',
            capvalue: 3,
            uitype: 'default',
            animtype: 'default',
			scrolltop:true,
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
            extrasmall: {displayimg: true,center:true},
            small: {displayimg: true,center:true},
            medium: {displayimg: true,center:true},
            large: {displayimg: true,center:true},
            extralarge: {displayimg: true,center:true}
            //pricolor:"#9FCC3B",
            //pridarkcolor:"#9FCC3B"
        },
        rowGrid: {
			animspeed : 250,
            extrasmall: {
                width: 100,
				center:true
            },
            small: {
                width: 100,
				center:true
            },
            medium: {
                width: 100,
				center:true
            },
            large: {
                width: 100,
				center:true
            },
            extralarge: {
                width: 100,
				center:true
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
        }
    }
}