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
    return [];
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
        rowArray.push({
            id: e.inputs[0].name,
            title: label.html(),
            //subtitle: label.text(),
            //description: "Lorem ipsum dolor sit amet, nec ad conceptam interpretaris, mea ne solet repudiandae. Laudem nost",
            image: e.image,
            stamp: e.image,
            isRadio: true,
            defaultValue: e.inputs.val()
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
	
    if(this.questionFullName.indexOf(".")>=0)
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
	
	if(this.getProperty("answertype")!=null){ 
	    var that = this;
        function loadrules(){  			
           
		   //console.log(rp_text(rs));	
		      
		   $.each(eval("ls_"+that.getProperty("answertype").replace(/-/g , "_")+"(rs)"), function( index, value, url) {
			  if (value.c){
			   if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
					 that.url=pageLayout.resolveFilePath(surveyPage.path+"lib/ILayouts/ls/"+surveyPage.toolVersion.linkedslider.idversion+value.s);
				} else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
					that.url=pageLayout.resolveFilePath(pageLayout.scriptContent+"SE/lib/ILayouts/ls/"+surveyPage.toolVersion.linkedslider.idversion+value.s);
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
					 $.extend(true, that.options, eval("surveyPage.themeRuleSetprops."+ linkedslider.prototype.type()));

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
					new QArts.LinkedSlider($.extend(true,that.toolParams, that.options), container);
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
         $.getScript( pageLayout.resolveFilePath(surveyPage.path+ "lib/ILayouts/ls/"+surveyPage.toolVersion.linkedslider.idversion+"/Rules/ls_"+this.getProperty("answertype")+".js"))
		).then(loadrules); 	
   }   
  else{ 
   new QArts.LinkedSlider($.extend(true,this.toolParams, this.options), container);
   }
	
}


linkedslider.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + linkedslider.prototype.type()));
    return {
        row: {
            suffix: "",
            animtype: 'left',
			remainstr: 'Remaining',
            //maxPool: 10,
            //pricolor:"#9FCC3B",
            //pridarkcolor:"#327E04",
            extrasmall: {
                dir: 'row',
                width: 125,
				displayimg:true
            },
            small: {
                dir: 'row',
                width: 150,
				displayimg:true
            },
            medium: {
                dir: 'row',
                width: 175,
				displayimg:true
            },
            large: {
                dir: 'row',
                width: 175,
				displayimg:true
            },
            extralarge: {
                dir: 'row',
                width: 175,
				displayimg:true
            }
        },
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