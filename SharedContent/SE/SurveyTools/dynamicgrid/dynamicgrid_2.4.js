/**
 * dynamicgrid class
 * Inherits from SESurveyTool
 */
function dynamicgrid(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
    this.singlePunchCount = 0;
}
dynamicgrid.prototype = Object.create(SESurveyTool.prototype);
dynamicgrid.prototype.type = function(){
    return "dynamicgrid";
}
dynamicgrid.prototype.getDependencies = function(){
    return [
        {'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcomponent/BtnMatrix/BtnMatrix.js'}
        //{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QFactory.js'},
		//{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QContainer.js'},
		//{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QWidget.js'} 
    ];
}
dynamicgrid.prototype.setInitialResponses = function (){
    

    var dimResp = [];
    $.each(this.subquestions, function(rowid, e) {
        var colResp = [];
        var subQ = this;
        $.each(e.inputs.filter(":checked"), function(i, e) {
           if(typeof surveyPlatform=="undefined"){      // This code belongs to Dimensions
				if ($(e).attr('otherid') != '') {
					var otherVal = subQ.inputs.filter('[id='+$(e).attr('otherid')+']').val();
					colResp.push({index:$(e).attr("colid"), input:otherVal});
				} else {
					colResp.push({index:$(e).attr("colid")});
				}
			}else if(surveyPlatform=="Nfield"){     // This code belongs to Nfield
				if ($('#'+$(e).attr('id')+'-open').val() != '') {  
					var otherVal = $('#'+$(e).attr('id')+'-open').val();
					colResp.push({index:$(e).attr("colid"), input:otherVal});
				} else { 
					colResp.push({index:$(e).attr("colid")});
				}
			}
        });
		
        if (colResp.length>0) dimResp.push({rowIndex: rowid, colIndex:colResp});
    });
    //console.log('Initial Response: '+dimResp);
    this.component.setDimenResp(dimResp);
}
dynamicgrid.prototype.setResponses = function (){
    var response = this.getResponse();
	
    if (response == null) return;
    this.clearInputs(); // need to clear the responses before setting them.
    var that = this;

    $.each($(response.Value), function(i,e) { // Sets categories
	//alert(e);
        var resp = e.split('^');
		if(typeof surveyPlatform=="undefined"){      // This code belongs to Dimensions
			var inputs = that.subquestions[resp[0]].inputs;
			inputs.filter('[value='+resp[1]+']').val($.makeArray(resp[1]));
			if (inputs.filter('[value='+resp[1]+']').attr('otherid') != '') {
				that.inputs.filter('[id='+inputs.filter('[value='+resp[1]+']').attr('otherid')+']').val(response[e]);
			}
		}else if(surveyPlatform=="Nfield"){     // This code belongs to Nfield
			var resp1=resp[0].split('-');
			var inputs = that.subquestions[resp1[1]].inputs;		
			var temp = resp[1].split('-');		
			inputs.filter('[value='+resp1[0]+'-'+temp[1]+']').val($.makeArray(resp1[0]+'-'+temp[1]));
			if(typeof response[e] !="undefined"){
				$("#"+resp1[0].toUpperCase()+'-'+temp[1]+"-open").val(response[e]);
			}	
		}

    });
}
dynamicgrid.prototype.build = function(){
        this.component = new BtnMatrix();
		var finalparams=this.params();
		var rowArray = [],
            colArray = [],
            that = this;

        // Create questions and columns to build
        this.buildArraysFromGrid();

        // Build up row array
        var rowUseZoom = that.getProperty("rowBtnUseZoom") == true;
        var rowUseTip = that.getProperty("rowBtnUseTooltip") == true;
        this.rowImageCount = 0;
        $.each(this.subquestions, function (i, e) {
            var label = e.label;
            label.find('span').removeClass('mrQuestionText');
			label.find("span").removeClass('mrSingleText');
            label.find("span").removeClass('mrMultipleText');
			
			if(typeof surveyPlatform=="undefined"){      // This code belongs to Dimensions
				var idVal = e.id
			}else if(surveyPlatform=="Nfield"){     // This code belongs to Nfield
				var subqid=e.inputs.filter('input[type!=text]').eq(0).attr("value");
				subqid=subqid.split("-");
				var idVal = subqid[0]+'-'+e.id
			}
			var rowHasImg = (typeof e.image!='undefined');
			rowArray.push({
                id: idVal,
                label: label.html(),
                description: label.text(),
                image: e.image,
                type: (rowHasImg) ? '' : 'text',
                useZoom: rowUseZoom,
                useTooltip: rowUseTip
            });
            if (rowHasImg) that.rowImageCount++;
        });

        // Build up column array
        var colUseZoom = that.getProperty("colBtnUseZoom") == true;
        var colUseTip = that.getProperty("colBtnUseTooltip") == true;
        this.colImageCount = 0;
        var hasOther = false; // Flag Question has other
        $.each(this.columnheaders, function (i, e) {

            // Match columnheader Index to inputs Index by removing type=text
            var inputs = that.subquestions[0].inputs.filter('input[type!=text]')

            var label = $(e.label);

            label.find('span').removeClass('mrQuestionText');
			label.find("span").removeClass('mrSingleText');
            label.find("span").removeClass('mrMultipleText');
            label.find("span").attr('style','');

            var image = label.find('img');
            image.hide();
			
			if(typeof surveyPlatform=="undefined"){      // This code belongs to Dimensions
				var isexclusive = $(inputs[i]).attr('isexclusive') == "true";
				var labelTxt = label.html()
				var descriptionTxt = label.text()
			}else if(surveyPlatform=="Nfield"){     // This code belongs to Nfield
				var ex=label.text().split("|")[1]
				if(typeof ex!="undefined")
				ex=ex.trim();
				if(typeof ex!="undefined" && ex.toLowerCase()=="exclusive")
					var isexclusive=true;
				var labelTxt = label.html().split("|")[0]
				var descriptionTxt = label.text().split("|")[0]
			}
			
            //var isexclusive = $(inputs[i]).attr('isexclusive') == "true";
            var isradio = $(inputs[i]).attr('type') == "radio";
            var colHasImg = (typeof image.attr('src')!='undefined');
            colArray.push({
                id: $(inputs[i]).val(),
                label: labelTxt,
                description: descriptionTxt,
                image: image.attr('src'),
                isRadio: (isexclusive || isradio),
                useZoom: colUseZoom,
                type: (colHasImg) ? '' : 'text',
                useTooltip: colUseTip
            });

            if (colHasImg) that.colImageCount++;

            if (isexclusive) {
                colArray[colArray.length-1].type = 'radiocheck';
                colArray[colArray.length-1].ownRow = true;
            }
			if(typeof surveyPlatform=="undefined"){      // This code belongs to Dimensions
				if ($(inputs[i]).attr('otherid') != '') {
					colArray[colArray.length-1].type = 'kantarother';
					colArray[colArray.length-1].ownRow = true;
					hasOther = true;
				}
			}else if(surveyPlatform=="Nfield"){
				if (typeof label.text().split("|")[1]!="undefined" && label.text().split("|")[1].toLowerCase().trim().indexOf("other") > -1) {
					colArray[colArray.length-1].type = 'kantarother';
					colArray[colArray.length-1].ownRow = true;
					hasOther = true;
				}
				
			}

	if (colArray[colArray.length-1].isRadio)
                that.singlePunchCount++;
        });
		
		
		//break out if using images as responses
		this.images=false;	 
		$.each(this.nativeContainer.find('tr'), function (i, e) {
			var el = $(e);
			var inputs = $(e).find('input');
			$.each(el.find('td.mrGridQuestionText > span > img'), function (x, y) {
				if ($(y).is('img')) {
					that.images=true
				}
			});
		});
		
		//expand responses over row(s), max 8 per - text only
		if(this.getProperty("compContainAlignCenter")){
			var uniqueVals = [];
        if (typeof surveyPlatform == "undefined") {
            // Dimensions
            $.each(this.nativeContainer.find('input'), function(i, e) {
                var el = $(e);
                var inputs = $(e).find('value');
                var currDefVal = inputs.context.defaultValue;
                var specialResps = ["OTHER", "DK", "NA", "REF"];

                if ((currDefVal.length > 0) && ($.inArray(currDefVal, uniqueVals) === -1)) {
                    if ($.inArray(currDefVal.toUpperCase(), specialResps) === -1) {
                        uniqueVals.push(currDefVal);
                    }
                }
            });
        } else if (surveyPlatform == "Nfield") {
                                                // This code belongs to Nfield
            $.each(this.columnheaders, function(i, e) {
                var label = $(e.label);
                var isexclusive = false,
                    otherVal = false;
                var ex = label.text().split("|")[1]
                if (typeof ex != "undefined")
                    ex = ex.trim();
                if (typeof ex != "undefined" && ex.toLowerCase() == "exclusive")
                    isexclusive = true;
                if (typeof ex != "undefined" && ex.toLowerCase() == "other")
                    otherVal = true;

                if (isexclusive == false && otherVal == false) {
                    uniqueVals.push(label);
                }


            });

        }

			if (!this.customProps.hasOwnProperty("colTxtBtnAdjustHeightType")) this.options.colTxtBtnAdjustHeightType="all";
		    if (!this.customProps.hasOwnProperty("colBtnLabelFontSize")) this.options.colBtnLabelFontSize=16;
			if (!this.customProps.hasOwnProperty("rowBtnLabelFontSize")) this.options.rowBtnLabelFontSize=16;
		    if (!this.customProps.hasOwnProperty("colBtnPadding")) this.options.colBtnPadding=3;
			if (!this.customProps.hasOwnProperty("colContainType")) this.options.colContainType="horizontal grid layout";			
			//if (!this.customProps.hasOwnProperty("rowBtnPadding")) this.options.rowBtnPadding=3;
			//if (!this.customProps.hasOwnProperty("colRadChckLabelFontSize")) this.options.colRadChckLabelFontSize=14;
		    //Break auto width for responses if it contains images
		    if(!this.images){
			if (pageLayout.deviceType.toUpperCase() == "PC") {
				  var pageWidth = 970;
				  var pWidthOffset = 115;
				} else {
					var pageWidth = 738;
					if(this.orientation==0||this.orientation==180){
					   var pageWidth = 750;
					   this.options.colContainHoffset = 20;
					   var pWidthOffset = 40;
					   if (!this.customProps.hasOwnProperty("colContainHgap")) this.options.colContainHgap=2;
					    if (!this.customProps.hasOwnProperty("rowContainPadding")) this.options.rowContainPadding=10;
					}else{				
					  var pageWidth = 700;
					  var pWidthOffset = 20;
					}  
				}			
			
			var responseCount = uniqueVals.length;
			if (responseCount > 8)
				responseCount = 8 % responseCount;				
			
			if (!this.customProps.hasOwnProperty("colBtnWidth")) this.options.colBtnWidth = Math.floor(parseInt((pageWidth - pWidthOffset - (this.options.colContainHgap * (responseCount - 1)) - ((this.options.colBtnBorderWidthUp * 2 * responseCount))) / responseCount, 10));
			if((pageLayout.deviceType.toUpperCase() !== "PC")&&(this.orientation==0||this.orientation==180) )
			 this.options.colBtnWidth=this.options.colBtnWidth-5
		 }	 
		}

        this.component.rowArray(rowArray);
        this.component.columnArray(colArray);
        this.component.baseTool="btnmatrix";
        this.autoNext = ((colArray.length == this.singlePunchCount) && hasOther == false );
        this.setRuntimeProps();
        this.component.params(this.params());
        this.deferred.resolve();
}
dynamicgrid.prototype.render = function(){
    this.componentContainer = $('<div>');
    this.componentContainer.append(this.label);
    this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifiable with question?
    this.componentContainer.addClass('qcContainer');
    this.nativeContainer.after(this.componentContainer);
    if (pageLayout.showonly)
        this.component.renderSD(this.componentContainer.get(0));
    else
        this.component.renderDC(this.componentContainer.get(0));
    this.nativeContainer.hide();
    this.setInitialResponses();
    if (!pageLayout.showonly) this.bindNavigations();
    //Set Tiles and responses center to the screen
	if(this.getProperty("compContainAlignCenter")){
		var containerLeft = this.getProperty("rowContainCustomLeft")+((this.subquestions.length-1)*10);
		this.componentContainer.find('.qlayout_container:eq( 0 )').css('margin','auto');
		this.componentContainer.find('.qlayout_container:eq( 0 )').css('left',containerLeft+'px');
		this.componentContainer.find('.qlayout_container:eq( 1 )').css('margin','auto');
		
		
		
		if (pageLayout.deviceType.toUpperCase() == "PC") {
                var pageWidth = 970;
				var leftmargin=100;
            } else {
                var pageWidth = 738;
				if(this.orientation==0||this.orientation==180)
				   var leftmargin=100
                else				
				  var leftmargin=40
            }
	       //correct alignment issue if size takes up > 50% of screen
            var tileArea = $('#QRowContainer .qlayout_layout_container .qlayout_default_layout');
            if (tileArea.width() > (pageWidth / 2)) {
               this.componentContainer.find('.qlayout_container:eq( 0 )').css('margin','auto');
		       this.componentContainer.find('.qlayout_container:eq( 0 )').css('left',leftmargin+'px'); 
            }
	}
		

}
dynamicgrid.prototype.setRuntimeProps = function () {
    if (this.rowImageCount>0) {
        if (!this.customProps.hasOwnProperty("rowBtnLabelPlacement")) this.options.rowBtnLabelPlacement = "bottom overlay";
    }
    if (this.colImageCount>0) {
        if (!this.customProps.hasOwnProperty("colBtnLabelPlacement")) this.options.colBtnLabelPlacement = "bottom overlay";
    }
    if (!this.customProps.hasOwnProperty("rowContainAutoNext")) this.options.rowContainAutoNext = this.autoNext;
    if (!this.customProps.hasOwnProperty("compQuestionType")) this.options.compQuestionType = ((this.autoNext) ? 'Single Choice' : 'Multiple Choice');
}
dynamicgrid.prototype.navNextButton = function() {
    if (typeof navNextButton === "string") return navNextButton;
    return "<input class='mrNext hand' id='dgNext' style='' type='button' name='_NNext' navtype='next'>";
}
dynamicgrid.prototype.navPrevButton = function() {
    if (typeof navPrevButton === "string") return navPrevButton;
    return "<input class='mrPrev hand' id='dgPrev' style='' type='button' name='_NPrev' navtype='prev'>";
}
dynamicgrid.prototype.bindNavigations = function(){
    $('[name=_NNext]').hide();
    $('[name=_NPrev]').hide();
	
	if(typeof surveyPlatform !="undefined" && surveyPlatform=="Nfield"){     // This code belongs to Nfield
		$('[name=button-next]').hide();
		$('[name=button-back]').hide();
	}
                

    $('#surveyButtons').prepend(this.navNextButton());
    this.component.bindNavNext($("#dgNext").get(0), function () {
        $("[name='_NNext'][type=submit]").click();
          if(typeof surveyPlatform !="undefined" && surveyPlatform=="Nfield"){     // This code belongs to Nfield
				$("[name='button-next'][type=submit]").click();
			}                         
    });
    var showdgprev = this.getProperty("showDGprev");
    if (showdgprev==null || (showdgprev!=null && showdgprev==true)) {
        $('#surveyButtons').prepend(this.navPrevButton());
                                //Hiding the previous button
                                if (!isTest && this.inputs.filter('[type=checkbox]').length>0)
                                {
                                                //disable previous button for DG grids
												if(typeof surveyPlatform !="undefined" && surveyPlatform=="Nfield"){     // This code belongs to Nfield
													$("[name='_NPrev'][type=button]").css('display','none');
												} 
                                                $("[name='button-back'][type=button]").css('display','none');
                                }

        this.component.bindNavBack($("#dgPrev").get(0), function () {
            $("[name='_NPrev'][type=submit]").click();
                                                $("[name='button-back'][type=submit]").click();
        });
    }

}
dynamicgrid.prototype.toolOptions = function() {
        $.extend(this.options, eval("this.options."+dynamicgrid.prototype.type()));
		switch(pageLayout.deviceType.toUpperCase()) {
            case "LARGETABLET":
            case "MEDIUMTABLET":
            case "SMALLTABLET":
            case "SMARTPHONETOUCH":
				if(this.orientation==0||this.orientation==180) 
                return  {
                    'rowBtnUseZoom' : false,
//                    'rowBtnBckgrndColorDown' : 0xffffff,
                    'colContainLabel' : "Column Container Label",
                    'rowContainLabel' : "Row Container Label",
                    'rowBtnShowLabel' : true,
                    'rowBtnUseTooltip' : false,
                    'rowContainWidth' : 738,
                    'compQuestionType' : "Single Choice",
                    'rowContainType' : "horizontal scroll",
                    'rowContainPadding' : 5,
                    'rowContainHgap' : -178,
                    'rowContainVgap' : 10,
                    'rowContainHoffset' : 0,
                    'rowContainVoffset' : 12,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 0,
//                    'rowContainBorderColor' : 0xa6a8ab,
//                    'rowContainBckgrndColor' : 0xffffff,
                    'rowBtnDefaultType' : "Base",
                    'rowBtnWidth' : 168,
                    'rowBtnHeight' : 168,
                    'rowBtnBorderStyle' : "solid",
                    'rowBtnBorderRadius' : 6,
                    'rowBtnShowBckgrnd' : true,
//                    'rowBtnBckgrndColorUp' : 0xffffff,
                    'rowBtnLabelPlacement' : "center overlay",
                    'rowBtnLabelHalign' : "center",
                    'rowBtnLabelFontSize' : 28,
                    'rowBtnLabelHoffset' : 0,
                    'rowBtnLabelVoffset' : 0,
//                    'rowBtnLabelColorUp' : 0x5b5f65,
//                    'rowBtnLabelColorDown' : 0x5b5f65,
                    'rowBtnImgHoffset' : 0,
                    'rowBtnImgVoffset' : -10,
                    'rowShowStamp' : false,
                    'rowStampImp' : "",
                    'rowStampWidth' : 30,
                    'rowStampHeight' : 30,
                    'rowStampHoffset' : 0,
                    'rowStampVoffset' : 0,
                    'rowKantBtnLabelWidth' : 125,
                    'rowZoomHoffset' : 0,
                    'rowZoomVoffset' : 0,
//                    'zoomOverlayBckgrndColor' : 0x000000,
                    'zoomOverlayAlpha' : 80,
                    'zoomGalleryPadding' : 10,
                    'zoomGalleryHoffset' : 0,
                    'zoomGalleryVoffset' : 0,
                    'zoomCloseImp' : "",
                    'zoomCloseWidth' : 22,
                    'zoomCloseHeight' : 22,
                    'zoomCloseHoffset' : 0,
                    'zoomCloseVoffset' : 0,
                    'compCapValue' : 0,
                    'rowContainHeight' : 650,
                    'rowBckgrndShowImp' : false,
                    'rowBckgrndImpUp' : "",
                    'rowBckgrndImpDown' : "",
                    'colContainType' : "vertical layout",
                    'colContainWidth' : 738,
                    'colContainHgap' : -2,
                    'colContainVgap' : 5,
                    'colContainHoffset' : 0,
                    'colContainVoffset' : 25,
                    'colContainBorderStyle' : "none",
                    'colContainBorderWidth' : 0,
//                    'colContainBorderColor' : 0xa6a8ab,
//                    'colContainBckgrndColor' : 0xffffff,
                    'tooltipWidth' : 150,
                    'tooltipBorderWidth' : 2,
//                    'tooltipBorderColor' : 0xa6a8ab,
//                    'tooltipBckgrndColor' : 0xffffff,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 12,
//                    'tooltipFontColor' : 0x5b5f65,
                    'zoomWidth' : 20,
                    'zoomHeight' : 20,
                    'colZoomHoffset' : 0,
                    'colZoomVoffset' : 0,
                    'zoomBorderWidth' : 1,
//                   'zoomBorderColor' : "0xa6a8ab",
//                    'zoomBckgrndColor' : 0xffffff,
                    'rowContainSetRowPer' : 3,
                    'rowContainScrlEndPos' : 180,
                    'rowContainChldInitAlpha' : 100,
                    'rowContainChldEndAlpha' : 0,
                    'rowContainAutoNext' : false,
                    'colBtnDefaultType' : "Default",
                    'colBtnWidth' : 720,
                    'colBtnHeight' : 88,
                    'colBtnBorderStyle' : "solid",
                    'colBtnBorderRadius' : 6,
                    'colBtnShowBckgrnd' : true,
                    'colRadShowImp' : false,
                    'colChkShowImp' : false,
//                    'colBtnBckgrndColorUp' : 0xffffff,
//                    'colBtnBckgrndColorOver' : 0xf2f2f2,
//                    'colBtnBckgrndColorDown' : 0x9fcc3b,
                    'colRadImpUp' : "",
                    'colRadImpOver' : "",
                    'colRadImpDown' : "",
                    'colChkImpUp' : "",
                    'colChkImpOver' : "",
                    'colChkImpDown' : "",
                    'colBtnShowLabel' : true,
                    'colBtnLabelPlacement' : "center overlay",
                    'colBtnLabelHalign' : "center",
                    'colBtnLabelFontSize' : 28,
                    'colBtnLabelHoffset' : 0,
                    'colBtnLabelVoffset' : 0,
//                    'colBtnLabelColorUp' : 0x5b5f65,
//                    'colBtnLabelColorOver' : 0x5b5f65,
//                    'colBtnLabelColorDown' : 0xffffff,
                    'colBtnImgHoffset' : 0,
                    'colBtnImgVoffset' : 0,
                    'colShowStamp' : false,
                    'colStampImp' : "",
                    'colStampWidth' : 30,
                    'colStampHeight' : 30,
                    'colStampHoffset' : 0,
                    'colStampVoffset' : 0,
                    'colKantBtnLabelWidth' : 100,
                    'colRadChckLabelWidth' : 250,
                    'colOtherMinVal' : 1,
                    'colOtherMaxVal' : 100,
                    'colOtherMsgWidth' : 100,
                    'colBtnMouseOverDownShadow' : false,
                    'colBtnMouseOverBounce' : false,
                    'colBtnMouseOverScale' : 100,
                    'colBtnMouseDownScale' : 100,
                    'colBtnMouseDownAlpha' : 100,
                    'colBtnUseTooltip' : false,
                    'colBtnUseZoom' : false,
                    'compClickType' : "default",
                    'colBtnPadding' : 5,
                    'colBtnBorderWidthUp' : 2,
                    'colBtnBorderWidthOver' : 2,
                    'colBtnBorderWidthDown' : 0,
                    'compContainPos' : "relative",
                    'compRTL' : false,
                    'rowContainAutoWidth' : true,
                    'rowContainAutoHeight' : true,
                    'rowContainBckgrndDispType' : "none",
                    'rowContainImgImport' : "",
                    'rowContainImgImportHoffset' : 0,
                    'rowContainImgImportVoffset' : 0,
                    'rowContainShowLabel' : false,
                    'rowContainLabelHalign' : "left",
                    'rowContainLabelFontSize' : 18,
                    'rowContainLabelPadding' : 4,
//                    'rowContainLabelColor' : 0x5b5f65,
                    'rowBtnPadding' : 10,
                    'rowBtnBorderWidthUp' : 2,
                    'rowBtnBorderWidthDown' : 2,
//                    'rowBtnBorderColorUp' : 0xd2d3d5,
//                    'rowBtnBorderColorDown' : 0xd2d3d5,
                    'rowBtnLabelOvrWidth' : false,
                    'rowBtnLabelWidth' : 150,
                    'rowBtnLabelOverlayShowBckgrnd' : false,
//                    'rowBtnLabelOverlayBckgrndColor' : 0xffffff,
                    'rowBtnLabelOverlayPadding' : 5,
                    'rowTxtBtnAdjustHeightType' : "all",
                    'zoomActionType' : "click append image",
                    'zoomGalleryBorderStyle' : "none",
                    'zoomGalleryBorderWidth' : 0,
//                    'zoomGalleryBorderColor' : 0xa6a8ab,
                    'colContainHeight' : 400,
                    'colContainPadding' : 20,
                    'colContainBckgrndDispType' : "none",
                    'colContainImgImport' : "",
                    'colContainImgImportHoffset' : 0,
                    'colContainImgImportVoffset' : 0,
                    'colContainShowLabel' : false,
                    'colContainLabelHalign' : "left",
                    'colContainLabelFontSize' : 18,
                    'colContainLabelPadding' : 4,
//                    'colContainLabelColor' : 0x5b5f65,
                    'rowContainScrlAnimSpeed' : 500,
                    'rowContainChldEnableAlpha' : 50,
                    'rowContainGoOpaque' : false,
                    'colContainShowTopLabelHeader' : false,
//                    'colBtnBorderColorUp' : 0xd2d3d5,
//                    'colBtnBorderColorOver' : 0xa6a8ab,
//                    'colBtnBorderColorDown' : 0x5b5f65,
                    'colBtnLabelOvrWidth' : false,
                    'colBtnLabelWidth' : 125,
                    'colBtnLabelOverlayShowBckgrnd' : false,
//                    'colBtnLabelOverlayBckgrndColor' : 0xffffff,
                    'colBtnLabelOverlayPadding' : 5,
                    'colTxtBtnAdjustHeightType' : "none",
                    'colRadChckLabelHalign' : "left",
                    'colRadChckLabelFontSize' : 25,
//                    'colRadChckLabelColorUp' : 0x5b5f65,
//                    'colRadChckLabelColorOver' : 0x5b5f65,
//                    'colRadChckLabelColorDown' : 0x5b5f65,
                    'colRadChckLabelHoffset' : 0,
                    'colRadChckLabelVoffset' : 10,
                    'colKntrInputTxtAreaWidth' : 250,
                    'colKntrInputLabelHalign' : "left",
                    'colKntrInputLabelWidth' : 250,
                    'colKntrInputLabelHoffset' : 0,
                    'colKntrInputLabelVoffset' : 10,
                    'colKntrInputLabelFontSize' : 25,
//                    'colKntrInputLabelColorUp' : 0x5b5f65,
//                    'colKntrInputLabelColorOver' : 0x5b5f65,
//                    'colKntrInputLabelColorDown' : 0x5b5f65,
                    'colOtherInputHalign' : "left",
                    'colOtherInputFontSize' : 25,
					'compContainAlignCenter':false,
					'rowContainCustomLeft':100
//                    'colOtherInputColor' : 0x5b5f65
				}
			 else
			    return {
                    'rowBtnUseZoom' : false,
//                    'rowBtnBckgrndColorDown' : 0xffffff,
                    'colContainLabel' : "Column Container Label",
                    'rowContainLabel' : "Row Container Label",
                    'rowBtnShowLabel' : true,
                    'rowBtnUseTooltip' : false,
                    'rowContainWidth' : 768,
                    'compQuestionType' : "Single Choice",
                    'rowContainType' : "horizontal scroll",
                    'rowContainPadding' : 10,
                    'rowContainHgap' : -65,
                    'rowContainVgap' : 10,
                    'rowContainHoffset' : 0,
                    'rowContainVoffset' : 12,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 0,
//                    'rowContainBorderColor' : 0xa6a8ab,
//                    'rowContainBckgrndColor' : 0xffffff,
                    'rowBtnDefaultType' : "Base",
                    'rowBtnWidth' : 60,
                    'rowBtnHeight' : 50,
                    'rowBtnBorderStyle' : "solid",
                    'rowBtnBorderRadius' : 6,
                    'rowBtnShowBckgrnd' : true,
//                    'rowBtnBckgrndColorUp' : 0xffffff,
                    'rowBtnLabelPlacement' : "center overlay",
                    'rowBtnLabelHalign' : "center",
                    'rowBtnLabelFontSize' : 14,
                    'rowBtnLabelHoffset' : 0,
                    'rowBtnLabelVoffset' : 0,
//                    'rowBtnLabelColorUp' : 0x5b5f65,
//                    'rowBtnLabelColorDown' : 0x5b5f65,
                    'rowBtnImgHoffset' : 0,
                    'rowBtnImgVoffset' : 0,
                    'rowShowStamp' : false,
                    'rowStampImp' : "",
                    'rowStampWidth' : 30,
                    'rowStampHeight' : 30,
                    'rowStampHoffset' : 0,
                    'rowStampVoffset' : 0,
                    'rowKantBtnLabelWidth' : 125,
                    'rowZoomHoffset' : 0,
                    'rowZoomVoffset' : 0,
//                    'zoomOverlayBckgrndColor' : 0x000000,
                    'zoomOverlayAlpha' : 80,
                    'zoomGalleryPadding' : 10,
                    'zoomGalleryHoffset' : 0,
                    'zoomGalleryVoffset' : 0,
                    'zoomCloseImp' : "",
                    'zoomCloseWidth' : 22,
                    'zoomCloseHeight' : 22,
                    'zoomCloseHoffset' : 0,
                    'zoomCloseVoffset' : 0,
                    'compCapValue' : 0,
                    'rowContainHeight' : 560,
                    'rowBckgrndShowImp' : false,
                    'rowBckgrndImpUp' : "",
                    'rowBckgrndImpDown' : "",
                    'colContainType' : "horizontal grid layout",
                    'colContainWidth' : 768,
                    'colContainHgap' : 3,
                    'colContainVgap' : 10,
                    'colContainHoffset' : 0,
                    'colContainVoffset' : 25,
                    'colContainBorderStyle' : "none",
                    'colContainBorderWidth' : 0,
//                    'colContainBorderColor' : 0xa6a8ab,
//                    'colContainBckgrndColor' : 0xffffff,
                    'tooltipWidth' : 150,
                    'tooltipBorderWidth' : 2,
//                    'tooltipBorderColor' : 0xa6a8ab,
//                    'tooltipBckgrndColor' : 0xffffff,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 18,
//                    'tooltipFontColor' : 0x5b5f65,
                    'zoomWidth' : 20,
                    'zoomHeight' : 20,
                    'colZoomHoffset' : 0,
                    'colZoomVoffset' : 0,
                    'zoomBorderWidth' : 1,
//                   'zoomBorderColor' : "0xa6a8ab",
//                    'zoomBckgrndColor' : 0xffffff,
                    'rowContainSetRowPer' : 3,
                    'rowContainScrlEndPos' : 130,
                    'rowContainChldInitAlpha' : 100,
                    'rowContainChldEndAlpha' : 0,
                    'rowContainAutoNext' : false,
                    'colBtnDefaultType' : "Default",
                    'colBtnWidth' : 154,
                    'colBtnHeight' : 55,
                    'colBtnBorderStyle' : "solid",
                    'colBtnBorderRadius' : 6,
                    'colBtnShowBckgrnd' : true,
                    'colRadShowImp' : false,
                    'colChkShowImp' : false,
//                    'colBtnBckgrndColorUp' : 0xffffff,
//                    'colBtnBckgrndColorOver' : 0xf2f2f2,
//                    'colBtnBckgrndColorDown' : 0x9fcc3b,
                    'colRadImpUp' : "",
                    'colRadImpOver' : "",
                    'colRadImpDown' : "",
                    'colChkImpUp' : "",
                    'colChkImpOver' : "",
                    'colChkImpDown' : "",
                    'colBtnShowLabel' : true,
                    'colBtnLabelPlacement' : "center overlay",
                    'colBtnLabelHalign' : "center",
                    'colBtnLabelFontSize' : 20,
                    'colBtnLabelHoffset' : 0,
                    'colBtnLabelVoffset' : 0,
//                    'colBtnLabelColorUp' : 0x5b5f65,
//                    'colBtnLabelColorOver' : 0x5b5f65,
//                    'colBtnLabelColorDown' : 0xffffff,
                    'colBtnImgHoffset' : 0,
                    'colBtnImgVoffset' : 0,
                    'colShowStamp' : false,
                    'colStampImp' : "",
                    'colStampWidth' : 30,
                    'colStampHeight' : 30,
                    'colStampHoffset' : 0,
                    'colStampVoffset' : 0,
                    'colKantBtnLabelWidth' : 100,
                    'colRadChckLabelWidth' : 150,
                    'colOtherMinVal' : 1,
                    'colOtherMaxVal' : 100,
                    'colOtherMsgWidth' : 100,
                    'colBtnMouseOverDownShadow' : false,
                    'colBtnMouseOverBounce' : false,
                    'colBtnMouseOverScale' : 100,
                    'colBtnMouseDownScale' : 100,
                    'colBtnMouseDownAlpha' : 100,
                    'colBtnUseTooltip' : false,
                    'colBtnUseZoom' : false,
                    'compClickType' : "default",
                    'colBtnPadding' : 5,
                    'colBtnBorderWidthUp' : 2,
                    'colBtnBorderWidthOver' : 2,
                    'colBtnBorderWidthDown' : 0,
                    'compContainPos' : "relative",
                    'compRTL' : false,
                    'rowContainAutoWidth' : true,
                    'rowContainAutoHeight' : true,
                    'rowContainBckgrndDispType' : "none",
                    'rowContainImgImport' : "",
                    'rowContainImgImportHoffset' : 0,
                    'rowContainImgImportVoffset' : 0,
                    'rowContainShowLabel' : false,
                    'rowContainLabelHalign' : "left",
                    'rowContainLabelFontSize' : 18,
                    'rowContainLabelPadding' : 4,
//                    'rowContainLabelColor' : 0x5b5f65,
                    'rowBtnPadding' : 10,
                    'rowBtnBorderWidthUp' : 2,
                    'rowBtnBorderWidthDown' : 2,
//                    'rowBtnBorderColorUp' : 0xd2d3d5,
//                    'rowBtnBorderColorDown' : 0xd2d3d5,
                    'rowBtnLabelOvrWidth' : false,
                    'rowBtnLabelWidth' : 150,
                    'rowBtnLabelOverlayShowBckgrnd' : false,
//                    'rowBtnLabelOverlayBckgrndColor' : 0xffffff,
                    'rowBtnLabelOverlayPadding' : 5,
                    'rowTxtBtnAdjustHeightType' : "all",
                    'zoomActionType' : "click append image",
                    'zoomGalleryBorderStyle' : "none",
                    'zoomGalleryBorderWidth' : 0,
//                    'zoomGalleryBorderColor' : 0xa6a8ab,
                    'colContainHeight' : 400,
                    'colContainPadding' : 20,
                    'colContainBckgrndDispType' : "none",
                    'colContainImgImport' : "",
                    'colContainImgImportHoffset' : 0,
                    'colContainImgImportVoffset' : 0,
                    'colContainShowLabel' : false,
                    'colContainLabelHalign' : "left",
                    'colContainLabelFontSize' : 18,
                    'colContainLabelPadding' : 4,
//                    'colContainLabelColor' : 0x5b5f65,
                    'rowContainScrlAnimSpeed' : 500,
                    'rowContainChldEnableAlpha' : 50,
                    'rowContainGoOpaque' : false,
                    'colContainShowTopLabelHeader' : false,
//                    'colBtnBorderColorUp' : 0xd2d3d5,
//                    'colBtnBorderColorOver' : 0xa6a8ab,
//                    'colBtnBorderColorDown' : 0x5b5f65,
                    'colBtnLabelOvrWidth' : false,
                    'colBtnLabelWidth' : 125,
                    'colBtnLabelOverlayShowBckgrnd' : false,
//                    'colBtnLabelOverlayBckgrndColor' : 0xffffff,
                    'colBtnLabelOverlayPadding' : 5,
                    'colTxtBtnAdjustHeightType' : "none",
                    'colRadChckLabelHalign' : "left",
                    'colRadChckLabelFontSize' : 18,
//                    'colRadChckLabelColorUp' : 0x5b5f65,
//                    'colRadChckLabelColorOver' : 0x5b5f65,
//                    'colRadChckLabelColorDown' : 0x5b5f65,
                    'colRadChckLabelHoffset' : 0,
                    'colRadChckLabelVoffset' : 2,
                    'colKntrInputTxtAreaWidth' : 125,
                    'colKntrInputLabelHalign' : "left",
                    'colKntrInputLabelWidth' : 150,
                    'colKntrInputLabelHoffset' : 0,
                    'colKntrInputLabelVoffset' : 5,
                    'colKntrInputLabelFontSize' : 18,
//                    'colKntrInputLabelColorUp' : 0x5b5f65,
//                    'colKntrInputLabelColorOver' : 0x5b5f65,
//                    'colKntrInputLabelColorDown' : 0x5b5f65,
                    'colOtherInputHalign' : "left",
                    'colOtherInputFontSize' : 16,
					'compContainAlignCenter':false,
					'rowContainCustomLeft':40
//                    'colOtherInputColor' : 0x5b5f65
                }
            case "PC":
            case "OTHERDEVICE":
            default:
			    return {
                    'rowBtnUseZoom' : false,
//                    'rowBtnBckgrndColorDown' : 0xffffff,
                    'colContainLabel' : "Column Container Label",
                    'rowContainLabel' : "Row Container Label",
                    'rowBtnShowLabel' : true,
                    'rowBtnUseTooltip' : false,
                    'rowContainWidth' : 970,
                    'compQuestionType' : "Single Choice",
                    'rowContainType' :"horizontal scroll",
                    'rowContainPadding' : 20,
                    'rowContainHgap' : -185,
                    'rowContainVgap' : 10,
                    'rowContainHoffset' : 0,
                    'rowContainVoffset' : 12,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 0,
//                    'rowContainBorderColor' : 0xa6a8ab,
//                    'rowContainBckgrndColor' : 0xffffff,
                    'rowBtnDefaultType' :"Base",
                    'rowBtnWidth' : 180,
                    'rowBtnHeight' : 180,
                    'rowBtnBorderStyle' : "solid",
                    'rowBtnBorderRadius' : 6,
                    'rowBtnShowBckgrnd' : true,
//                    'rowBtnBckgrndColorUp' : 0xffffff,
                    'rowBtnLabelPlacement' : "center overlay",
                    'rowBtnLabelHalign' : "center",
                    'rowBtnLabelFontSize' : 18,
                    'rowBtnLabelHoffset' : 0,
                    'rowBtnLabelVoffset' : 0,
//                    'rowBtnLabelColorUp' : 0x5b5f65,
//                    'rowBtnLabelColorDown' : 0x5b5f65,
                    'rowBtnImgHoffset' : 0,
                    'rowBtnImgVoffset' : 0,
                    'rowShowStamp' : false,
                    'rowStampImp' : "",
                    'rowStampWidth' : 30,
                    'rowStampHeight' : 30,
                    'rowStampHoffset' : 0,
                    'rowStampVoffset' : 0,
                    'rowKantBtnLabelWidth' : 125,
                    'rowZoomHoffset' : 0,
                    'rowZoomVoffset' : 0,
//                    'zoomOverlayBckgrndColor' : 0x000000,
                    'zoomOverlayAlpha' : 80,
                    'zoomGalleryPadding' : 10,
                    'zoomGalleryHoffset' : 0,
                    'zoomGalleryVoffset' : 0,
                    'zoomCloseImp' : "",
                    'zoomCloseWidth' : 22,
                    'zoomCloseHeight' : 22,
                    'zoomCloseHoffset' : 0,
                    'zoomCloseVoffset' : 0,
                    'compCapValue' : 0,
                    'rowContainHeight' : 560,
                    'rowBckgrndShowImp' : false,
                    'rowBckgrndImpUp' : "",
                    'rowBckgrndImpDown' : "",
                    'colContainType' : "horizontal grid layout",
                    'colContainWidth' : 970,
                    'colContainHgap' : 3,
                    'colContainVgap' : 10,
                    'colContainHoffset' : 0,
                    'colContainVoffset' : 25,
                    'colContainBorderStyle' : "none",
                    'colContainBorderWidth' : 0,
//                    'colContainBorderColor' : 0xa6a8ab,
//                    'colContainBckgrndColor' : 0xffffff,
                    'tooltipWidth' : 150,
                    'tooltipBorderWidth' : 2,
//                    'tooltipBorderColor' : 0xa6a8ab,
//                    'tooltipBckgrndColor' : 0xffffff,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 18,
//                    'tooltipFontColor' : 0x5b5f65,
                    'zoomWidth' : 20,
                    'zoomHeight' : 20,
                    'colZoomHoffset' : 0,
                    'colZoomVoffset' : 0,
                    'zoomBorderWidth' : 1,
//                    'zoomBorderColor' : "0xa6a8ab",
//                    'zoomBckgrndColor' : 0xffffff,
                    'rowContainSetRowPer' : 3,
                    'rowContainScrlEndPos' : 200,
                    'rowContainChldInitAlpha' : 100,
                    'rowContainChldEndAlpha' : 0,
                    'rowContainAutoNext' : false,
                    'colBtnDefaultType' : "Default",
                    'colBtnWidth' : 154,
                    'colBtnHeight' : 88,
                    'colBtnBorderStyle' : "solid",
                    'colBtnBorderRadius' : 6,
                    'colBtnShowBckgrnd' : true,
                    'colRadShowImp' : false,
                    'colChkShowImp' : false,
//                    'colBtnBckgrndColorUp' : 0xffffff,
//                    'colBtnBckgrndColorOver' : 0xf2f2f2,
//                    'colBtnBckgrndColorDown' : 0x9fcc3b,
                    'colRadImpUp' : "",
                    'colRadImpOver' : "",
                    'colRadImpDown' : "",
                    'colChkImpUp' : "",
                    'colChkImpOver' : "",
                    'colChkImpDown' : "",
                    'colBtnShowLabel' : true,
                    'colBtnLabelPlacement' : "center overlay",
                    'colBtnLabelHalign' : "center",
                    'colBtnLabelFontSize' : 20,
                    'colBtnLabelHoffset' : 0,
                    'colBtnLabelVoffset' : 0,
//                    'colBtnLabelColorUp' : 0x5b5f65,
//                    'colBtnLabelColorOver' : 0x5b5f65,
//                    'colBtnLabelColorDown' : 0xffffff,
                    'colBtnImgHoffset' : 0,
                    'colBtnImgVoffset' : 0,
                    'colShowStamp' : false,
                    'colStampImp' : "",
                    'colStampWidth' : 30,
                    'colStampHeight' : 30,
                    'colStampHoffset' : 0,
                    'colStampVoffset' : 0,
                    'colKantBtnLabelWidth' : 100,
                    'colRadChckLabelWidth' : 150,
                    'colOtherMinVal' : 1,
                    'colOtherMaxVal' : 100,
                    'colOtherMsgWidth' : 100,
                    'colBtnMouseOverDownShadow' : false,
                    'colBtnMouseOverBounce' : false,
                    'colBtnMouseOverScale' : 100,
                    'colBtnMouseDownScale' : 100,
                    'colBtnMouseDownAlpha' : 100,
                    'colBtnUseTooltip' : false,
                    'colBtnUseZoom' : false,
                    'compClickType' : "default",
                    'colBtnPadding' : 5,
                    'colBtnBorderWidthUp' : 2,
                    'colBtnBorderWidthOver' : 2,
                    'colBtnBorderWidthDown' : 0,
                    'compContainPos' : "relative",
                    'compRTL' : false,
                    'rowContainAutoWidth' : true,
                    'rowContainAutoHeight' : true,
                    'rowContainBckgrndDispType' : "none",
                    'rowContainImgImport' : "",
                    'rowContainImgImportHoffset' : 0,
                    'rowContainImgImportVoffset' : 0,
                    'rowContainShowLabel' : false,
                    'rowContainLabelHalign' : "left",
                    'rowContainLabelFontSize' : 18,
                    'rowContainLabelPadding' : 4,
//                    'rowContainLabelColor' : 0x5b5f65,
                    'rowBtnPadding' : 10,
                    'rowBtnBorderWidthUp' : 2,
                    'rowBtnBorderWidthDown' : 2,
//                    'rowBtnBorderColorUp' : 0xd2d3d5,
//                    'rowBtnBorderColorDown' : 0xd2d3d5,
                    'rowBtnLabelOvrWidth' : false,
                    'rowBtnLabelWidth' : 150,
                    'rowBtnLabelOverlayShowBckgrnd' : false,
//                    'rowBtnLabelOverlayBckgrndColor' : 0xffffff,
                    'rowBtnLabelOverlayPadding' : 5,
                    'rowTxtBtnAdjustHeightType' : "all",
                    'zoomActionType' : "click append image",
                    'zoomGalleryBorderStyle' : "none",
                    'zoomGalleryBorderWidth' : 0,
//                    'zoomGalleryBorderColor' : 0xa6a8ab,
                    'colContainHeight' : 400,
                    'colContainPadding' : 20,
                    'colContainBckgrndDispType' : "none",
                    'colContainImgImport' : "",
                    'colContainImgImportHoffset' : 0,
                    'colContainImgImportVoffset' : 0,
                    'colContainShowLabel' : false,
                    'colContainLabelHalign' : "left",
                    'colContainLabelFontSize' : 18,
                    'colContainLabelPadding' : 4,
//                    'colContainLabelColor' : 0x5b5f65,
                    'rowContainScrlAnimSpeed' : 500,
                    'rowContainChldEnableAlpha' : 50,
                    'rowContainGoOpaque' : false,
                    'colContainShowTopLabelHeader' : false,
//                    'colBtnBorderColorUp' : 0xd2d3d5,
//                    'colBtnBorderColorOver' : 0xa6a8ab,
//                    'colBtnBorderColorDown' : 0x5b5f65,
                    'colBtnLabelOvrWidth' : false,
                    'colBtnLabelWidth' : 125,
                    'colBtnLabelOverlayShowBckgrnd' : false,
//                    'colBtnLabelOverlayBckgrndColor' : 0xffffff,
                    'colBtnLabelOverlayPadding' : 5,
                    'colTxtBtnAdjustHeightType' : "none",
                    'colRadChckLabelHalign' : "left",
                    'colRadChckLabelFontSize' : 18,
//                    'colRadChckLabelColorUp' : 0x5b5f65,
//                    'colRadChckLabelColorOver' : 0x5b5f65,
//                    'colRadChckLabelColorDown' : 0x5b5f65,
                    'colRadChckLabelHoffset' : 0,
                    'colRadChckLabelVoffset' : 2,
                    'colKntrInputTxtAreaWidth' : 125,
                    'colKntrInputLabelHalign' : "left",
                    'colKntrInputLabelWidth' : 150,
                    'colKntrInputLabelHoffset' : 0,
                    'colKntrInputLabelVoffset' : 4,
                    'colKntrInputLabelFontSize' : 18,
//                    'colKntrInputLabelColorUp' : 0x5b5f65,
//                    'colKntrInputLabelColorOver' : 0x5b5f65,
//                    'colKntrInputLabelColorDown' : 0x5b5f65,
                    'colOtherInputHalign' : "left",
                    'colOtherInputFontSize' : 16,
					'compContainAlignCenter':false,
					'rowContainCustomLeft':100
//                    'colOtherInputColor' : 0x5b5f65
                }
        }
}