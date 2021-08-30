/**
 * dragnflag class
 * Inherits from SESurveyTool
 */
function dragnflag(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
dragnflag.prototype = Object.create(SESurveyTool.prototype);
dragnflag.prototype.type = function() {
    return "dragnflag";
}
dragnflag.prototype.getDependencies = function() {
    return [];
}
dragnflag.prototype.setInitialResponses = function() {
    console.log("setInitialResponses not implemented for " + this.type());
    return null;
}
dragnflag.prototype.setResponses = function() {
    if (this.response == null) return;
    this.clearInputs(); // need to clear the responses before setting them.
    var that = this;
    console.log(this.response);
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
dragnflag.prototype.build = function() {
    if(this.getProperty("hidenextbutton"))
    $(".tempNext").hide();
    var rowArray = [],
        columnArray = [],
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
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            var rowId = e.id
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            var subqid = e.inputs.filter('input[type!=text]').eq(0).attr("value");
            subqid = subqid.split("-");
            var rowId = subqid[0] + '-' + e.id
        }
        label.find('.mrErrorText').remove();
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
        rowArray.push({
            id: rowId,
            title: label.html(),
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
        var label = $(e.label);
        label.find('span').removeClass('mrQuestionText');
        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        label.find("span").attr('style', '');
        label.find('.mrErrorText').remove();
        var image = label.find('img');
        image.hide();
        columnArray.push({
            id: $(that.subquestions[0].inputs[i]).val(),
            title: label.html(),
            //subtitle: "Lorem ipsum",
            description: label.text(),
            image: image.attr('src')
        });
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
    cs.aAlen = totalVal / columnArray.length;
    cs.aLen = columnArray.length;
    console.log(cs);
	
	if(this.options.column.tracktype=="zone"){
	     var color=this.getProperty("slidercolors");
		 color=color.split("$");
		 $.each( color, function( key, value ) {
            //alert( key + ": " + value );
			columnArray[key].seccolor=value;
		});		 
	}	 
    if(this.questionFullName.indexOf(".")>=0)
	 var container = document.getElementById("container_" + this.questionName);
	else
     var container = document.getElementById("container_" + this.questionFullName);
    this.response = [];
    var that = this;
    container.style.minHeight = "500px"
    this.toolParams = {
        rowArray: rowArray,
        columnArray: columnArray,
        onSelect: function(selectArray, mandBool, isDefault) {
            console.log(selectArray);
            console.log("mandBool: " + mandBool);
            console.log("isDefault: " + isDefault);
            that.response = selectArray;
			if(that.getProperty("hidenextbutton")){
			   if(selectArray[that.subquestions.length-1].length>0){
			    $(".tempNext").show();
			   }
			}
        }
    }
	this.deferred.resolve();
	
	if(this.getProperty("answertype")!=null){ 
	    var that = this;
		
        function loadrules(){  
		   //console.log(rp_text(rs));	
		      
		   $.each(eval("df_"+that.getProperty("answertype").replace(/-/g , "_")+"(rs,cs)"), function( index, value, url) {
		   //$.each(eval("QArts.rules['"+that.getProperty("answertype")+"']"+"(rs,cs)"), function( index, value, url) {
			  if (value.c){
			   if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
					 that.url=pageLayout.resolveFilePath(surveyPage.path+"lib/ILayouts/df/"+surveyPage.toolVersion.dragnflag.idversion+value.s);
				} else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
					that.url=pageLayout.resolveFilePath(pageLayout.scriptContent+"SE/lib/ILayouts/df/"+surveyPage.toolVersion.dragnflag.idversion+value.s);
				}
			   
				return false; 
			   }
			   
			});
		   this.rulesetParams={};
		   	   
				var updateOptions = function(data) {
				    console.log(data);
					// to push rule parameters
					$.extend(true, that.options, data.s);	
					
					//to push themes over rule parameters
					 $.extend(true, that.options, eval("surveyPage.themeRuleSetprops."+ dragnflag.prototype.type()));

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
					new QArts.DragnFlag($.extend(true,that.toolParams, that.options), container);
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
         $.getScript( pageLayout.resolveFilePath(surveyPage.path+ "lib/ILayouts/df/"+surveyPage.toolVersion.dragnflag.idversion+"/Rules/df_"+this.getProperty("answertype")+".js"))
		).then(loadrules); 	
   }   
  else{ 
   new QArts.DragnFlag($.extend(true,this.toolParams, this.options), container);
   }
}
dragnflag.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + dragnflag.prototype.type()));
    return {
        row: {
            uitype: "img pin",
            animtype: 'bottom',
            //pricolor:"#9FCC3B",
            //pridarkcolor:"#327E04",
            //prilightcolor:"#dbe5db",
            extrasmall: {
                scale: 65,
                displayimg: true
            },
            small: {
                scale: 65,
                displayimg: true
            },
            medium: {
                scale: 80,
                displayimg: true
            },
            large: {
                scale: 80,
                displayimg: true
            },
            extralarge: {
                scale: 80,
                displayimg: true
            }
        },
        column: {
            //pricolor:"#9FCC3B",
            //pridarkcolor:"#327E04",
            //prilightcolor:"#dbe5db",
            extrasmall: {
                vgap: 250,
                displayimg: true
            },
            small: {
                vgap: 250,
                displayimg: true
            },
            medium: {
                vgap: 300,
                displayimg: true
            },
            large: {
                vgap: 400,
                displayimg: true
            },
            extralarge: {
                vgap: 400,
                displayimg: true
            }
        },
		hidenextbutton: false
    }
}