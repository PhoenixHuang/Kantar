/**
 * rowrank class
 * Inherits from SESurveyTool
 */
function rowrank(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
rowrank.prototype = Object.create(SESurveyTool.prototype);
rowrank.prototype.type = function() {
    return "rowrank";
}
rowrank.prototype.getDependencies = function() {
   if (this.getProperty("answertype") != null) {
		return [{
			"type": "script",
			"url": pageLayout.resolveFilePath(surveyPage.path+ "lib/ILayouts/rr/"+surveyPage.toolVersion.rowrank.idversion+"/Rules/rr_"+this.getProperty("answertype")+".js")
		}];
	}else{
		return [];
	}
}
rowrank.prototype.setInitialResponses = function() {

}
rowrank.prototype.setResponses = function() {

    if (this.result == null) return;
    this.clearInputs();
    var that = this;
    $.each(this.result, function(i, e) {
        if (typeof e != "undefined")
            that.inputs.filter('input[name=' + e.id + ']').val(i + 1);
    });
}
rowrank.prototype.build = function() {
	pageLayout.content.show();
	var captype = this.options.rowrank.row.captype;
	var capvalue = this.options.rowrank.row.capvalue;
	if(captype == 'min' || captype == 'hard'){
		pageLayout.next.hide();
	}
    var rowArray = [],
        that = this;
    // Create questions to build
    this.buildArraysFromGrid();

    var rs = {};
    var wordArray = [];
    rs.mWlen = 0, rs.mNumW = 0, rs.mALen = 0, rs.aAlen = 0, rs.aLen = 0, totalVal = 0;

    // Build up row array
    $.each(this.subquestions, function(i, e) {
        var label = e.label;
        label.find('span').removeClass('mrQuestionText');
        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        label.find('span').remove(); //fix to remove error span tag from label
		if (typeof surveyPlatform == "undefined") {// This code belongs to Dimensions
		  var rowtitle=label.html()
		} else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
			var rowtitle= label.html()
			rowtitle=rowtitle.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
		}
        rowArray.push({
            id: e.inputs[0].name,
            title: rowtitle,
            //subtitle: label.text(),
            //description: "Lorem ipsum dolor sit amet, nec ad conceptam interpretaris, mea ne solet repudiandae. Laudem nost",
            image: e.image,
            //stamp: e.image,
            isRadio: false,
            defaultRank: e.inputs.val()
        });
		if(that.getProperty("row$displaytitle")==false){
			rowArray[i].title="";
		}

        /* Rule set calculations*/
        var ansString = $.trim(label.text());
        //console.log(rowArray[0].title.text());
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
			
			if(captype == 'min'){
				if(selectArray.length >= capvalue){
					pageLayout.next.show();
				}else{
					pageLayout.next.hide();
				}
			}
			if(captype == 'max'){
				if(selectArray.length <= capvalue){
					pageLayout.next.show();
				}else{
					pageLayout.next.hide();
				}
			}
			if(captype == 'hard'){
				if(selectArray.length == capvalue){
					pageLayout.next.show();
				}else{
					pageLayout.next.hide();
				}
			}
        }
    }

    if(wordArray.length > 0){
		rs.mWlen = (wordArray.sort(function(a, b) {
			return b.length - a.length;
		})[0]).length;
	}
    rs.aAlen = totalVal / rowArray.length;
    rs.aLen = rowArray.length;
    console.log(rs);

    this.deferred.resolve();
	if(this.getProperty("answertype")!=null){ 
	    var that = this;
        function loadrules(){  			
           pageLayout.showLoader();
		   //console.log(rp_text(rs));	
		      
		   $.each(eval("rr_"+that.getProperty("answertype").replace(/-/g , "_")+"(rs)"), function( index, value, url) {
			  if (value.c){
			   if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
					that.url=pageLayout.resolveFilePath(surveyPage.path+"lib/ILayouts/rr/"+surveyPage.toolVersion.rowrank.idversion+value.s);
				} else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
				     that.url=pageLayout.resolveFilePath(pageLayout.sharedContent+"SE/lib/ILayouts/rr/"+surveyPage.toolVersion.rowrank.idversion+value.s);
				}
			   
			   
				return false; 
			   }
			   
			});
		   this.rulesetParams={};
		   	   
				var updateOptions = function(data) {
					pageLayout.showLoader();
				    console.log(data);
					// to push rule parameters
					$.extend(true, that.options, data.s);

					//set uitype to swatches
					that.options.rowrank.row.uitype="stamp";
					
					//to push themes over rule parameters
					 $.extend(true, that.options, eval("surveyPage.themeRuleSetprops."+ rowrank.prototype.type()));

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
					new QArts.RowRank($.extend(true,that.toolParams, that.options), container);
					pageLayout.hideLoader();
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
						error: function (xhr, ajaxOptions, thrownError) {
								console.log(xhr.status);
								console.log(thrownError);
								console.log(ajaxOptions);
								}
					})
				).then(updateOptions); 
        }
		loadrules();
      	/*$.when(		  
         $.getScript( pageLayout.resolveFilePath(surveyPage.path+ "lib/ILayouts/rr/"+surveyPage.toolVersion.rowrank.idversion+"/Rules/rr_"+this.getProperty("answertype")+".js"))
		).then(loadrules); */	
   }   
  else{ 
   new QArts.RowRank($.extend(true,this.toolParams, this.options), container);
   }

}


rowrank.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + rowrank.prototype.type()));
    return {
        row: {
            animtype: 'bottom',
            uitype: "stamp",
            //pricolor:"#9FCC3B",
            //pridarkcolor:"#9FCC3B",
            //prilightcolor:"#dbe5db",
            extrasmall: {
                displayimg: true,
                displaydescr: true,
                center: true,
				txtpaddingtb: 0
            },
            small: {
                displayimg: true,
                displaydescr: true,
                center: true,
				txtpaddingtb: 0
            },
            medium: {
                displayimg: true,
                displaydescr: true,
                center: true,
				txtpaddingtb: 0
            },
            large: {
                displayimg: true,
                displaydescr: true,
                center: true,
				txtpaddingtb: 0
            },
            extralarge: {
                displayimg: true,
                displaydescr: true,
                center: true,
				txtpaddingtb: 0
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