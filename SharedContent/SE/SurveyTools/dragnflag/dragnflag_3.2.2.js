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
    if (this.getProperty("answertype") != null) {
		return [{
			"type": "script",
			"url": pageLayout.resolveFilePath(surveyPage.path+ "lib/ILayouts/df/"+surveyPage.toolVersion.dragnflag.idversion+"/Rules/df_"+this.getProperty("answertype")+".js")
		}];
	}else{
		return [];
	}
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
	pageLayout.content.show();
    if(this.getProperty("hidenextbutton"))
	pageLayout.next.hide();
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
            var rowId = e.id;
			var rowtitle=label.html()
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            var subqid = e.inputs.filter('input[type!=text]').eq(0).attr("value");
            subqid = subqid.split("-");
            var rowId = subqid[0] + '-' + e.id;
			var rowtitle= label.html()
			rowtitle=rowtitle.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
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
		if(typeof e.image!="undefined")
		 e.image=e.image.replace(/\\/g, '\\\\');
        rowArray.push({
            id: rowId,
            title: rowtitle,
            //subtitle: label.text(),
            //description: label.text(),
            image: e.image,
            defaultChecked: initResponseId
        });
		if(that.getProperty("row$displaytitle")==false && typeof rowArray[i].image!=='undefined')
		rowArray[i].title="";
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
		
        columnArray.push({
            id: $(that.subquestions[0].inputs[i]).val(),
            title: "",
            subtitle: colLabel,
            description: label.text(),
            image: image.attr('src')
        });
		if(that.getProperty("column$displaytitle")==false && typeof columnArray[i].image!=='undefined'){
		 columnArray[i].title="";
		 columnArray[i].subtitle="";
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
    cs.aAlen = totalVal / columnArray.length;
    cs.aLen = columnArray.length;
    console.log(cs);
	
	if(this.options.column.tracktype=="zone" && this.getProperty("slidercolors")!=""){
	     var color=this.getProperty("slidercolors");
		 color=color.split("$");
		 $.each( color, function( key, value ) {
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
			   if(mandBool){
			    pageLayout.next.show();
			   }
			}
        }
    }
	this.deferred.resolve();
	
	if(this.getProperty("answertype")!=null){ 
	    var that = this;
		
        function loadrules(){  
		   //console.log(rp_text(rs));	
		    pageLayout.showLoader();  
		   $.each(eval("df_"+that.getProperty("answertype").replace(/-/g , "_")+"(rs,cs)"), function( index, value, url) {
		   //$.each(eval("QArts.rules['"+that.getProperty("answertype")+"']"+"(rs,cs)"), function( index, value, url) {
			  if (value.c){
			   if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
					 that.url=pageLayout.resolveFilePath(surveyPage.path+"lib/ILayouts/df/"+surveyPage.toolVersion.dragnflag.idversion+value.s);
				} else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
					that.url=pageLayout.resolveFilePath(pageLayout.sharedContent+"SE/lib/ILayouts/df/"+surveyPage.toolVersion.dragnflag.idversion+value.s);
				}
			   
				return false; 
			   }
			   
			});
		   this.rulesetParams={};
		   
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
				    console.log(data);
					pageLayout.showLoader();
					// to push rule parameters
					$.extend(true, that.options, data.s);	
					
					//to push themes over rule parameters
					 $.extend(true, that.options, eval("surveyPage.themeRuleSetprops."+ dragnflag.prototype.type()));
					 
					 that.options.column.extrasmall.endoffset=10;
					 that.options.column.small.endoffset=10;
					 that.options.column.medium.endoffset=10;
					 that.options.column.large.endoffset=10;
					 that.options.column.extralarge.endoffset=10;		

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
					pageLayout.showLoader();
					//that.deferred.resolve();
					new QArts.DragnFlag($.extend(true,that.toolParams, that.options), container);
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
      	/*$.when(		  
         $.getScript( pageLayout.resolveFilePath(surveyPage.path+ "lib/ILayouts/df/"+surveyPage.toolVersion.dragnflag.idversion+"/Rules/df_"+this.getProperty("answertype")+".js"))
		).then(loadrules);*/ 	
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
                displayimg: true,
				center:true
            },
            small: {
                scale: 65,
                displayimg: true,
				center:true
            },
            medium: {
                scale: 80,
                displayimg: true,
				center:true
            },
            large: {
                scale: 80,
                displayimg: true,
				center:true
            },
            extralarge: {
                scale: 80,
                displayimg: true,
				center:true
            }
        },
        column: {
			displaysubtitle: true,
            //pricolor:"#9FCC3B",
            //pridarkcolor:"#327E04",
            //prilightcolor:"#dbe5db",
            extrasmall: {
                vgap: 250,
                displayimg: true,
				center:true
            },
            small: {
                vgap: 250,
                displayimg: true,
				center:true
            },
            medium: {
                vgap: 300,
                displayimg: true,
				center:true
            },
            large: {
                vgap: 400,
                displayimg: true,
				center:true
            },
            extralarge: {
                vgap: 400,
                displayimg: true,
				center:true
            }
        },
		rowGrid:{},
		columnGrid:{},
		groupGrid:{},
		bucketGrid:{},
        grid: {},
		hidenextbutton: true,
		slidercolors : ""
    }
}