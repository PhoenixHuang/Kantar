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
		this.checkedCount = 0;

    // Create questions and columns to build
    this.buildArraysFromGrid();

    var rs = {};
    var wordArray = [];
    rs.mWlen = 0, rs.mNumW = 0, rs.mALen = 0, rs.aAlen = 0, rs.aLen = 0, totalVal = 0;

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
				    that.checkedCount++;
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
            //description: "Lorem ipsum dolor sit amet, nec ad conceptam interpretaris, mea ne solet repudiandae. Laudem nost",
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


    var cs = {};
    var wordArray = [];
    cs.mWlen = 0, cs.mNumW = 0, cs.mALen = 0, cs.aAlen = 0, cs.aLen = 0, totalVal = 0;
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
            var colLabel = label.html();
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
			    if($(".mrQuestionText").find(".mrErrorText").length==0&&that.getProperty("hidespecials")&&that.checkedCount==0)
				colArray.splice(colArray.length-1, 1);
                //colArray[colArray.length-1].title= "None of the above",
                colArray[colArray.length - 1].isRadio = true
                //colArray[colArray.length-1].uitype= 'default',
                /*colArray[colArray.length - 1].extrasmall = {
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
                }*/
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
			
			if (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim() == "exclusive") {
				if($(".mrQuestionText").find(".mrErrorText").length==0&&that.getProperty("hidespecials")&&that.checkedCount==0)
				colArray.splice(colArray.length-1, 1);
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
        }
    }
	this.deferred.resolve();

	if(this.getProperty("answertype")!=null){ 
	    var that = this;
        function loadrules(){  			
           
		   //console.log(rp_text(rs));	
		      
		   $.each(eval("gm_"+that.getProperty("answertype").replace(/-/g , "_")+"(rs,cs)"), function( index, value, url) {
			  if (value.c){
			   if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
					 that.url=pageLayout.resolveFilePath(surveyPage.path+"lib/ILayouts/gm/"+surveyPage.toolVersion.gridmatrix.idversion+value.s);
				} else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
					that.url=pageLayout.resolveFilePath(pageLayout.scriptContent+"SE/lib/ILayouts/gm/"+surveyPage.toolVersion.gridmatrix.idversion+value.s);
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
					//that.options.gridmatrix.column.uitype="swatches";
					
					
					//to push themes over rule parameters
					 $.extend(true, that.options, eval("surveyPage.themeRuleSetprops."+ gridmatrix.prototype.type()));

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
					new QArts.GridMatrix($.extend(true,that.toolParams, that.options), container);
				}
				
				$.support.cors = true;
				$.when(
					jQuery.ajax({
						type: "GET",
						url: that.url,
						contentType: "application/json",
						dataType: "json",
						crossDomain: true,
						error: function (xhr, ajaxOptions, thrownError) {
								alert(xhr.status);
								alert(thrownError);
								}
					})
				).then(updateOptions); 
        }
		
      	$.when(		  
         $.getScript( pageLayout.resolveFilePath(surveyPage.path+ "lib/ILayouts/gm/"+surveyPage.toolVersion.gridmatrix.idversion+"/Rules/gm_"+this.getProperty("answertype")+".js"))
		).then(loadrules); 	
   }   
  else{ 
   new QArts.GridMatrix($.extend(true, this.toolParams, this.options), container);
   }
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
            uitype: "swatches",
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
        },
		hidespecials:false
    }
}