/**
 * qcrowpickertext class
 * Inherits from SESurveyTool
 */
function qcrowpickertext(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
qcrowpickertext.prototype = Object.create(SESurveyTool.prototype);
qcrowpickertext.prototype.type = function(){
    return "qcrowpickertext";
}
qcrowpickertext.prototype.getDependencies = function(){
    return [
        {'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcomponent/RowPicker.js'},
        //{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QFactory.js'},
		//{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QContainer.js'},
		{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QWidget.js'} 
    ];
}
qcrowpickertext.prototype.setInitialResponses = function (){
    var dimResp = [];
    var q = this;
    $.each(q.inputs, function(i,e) {
        if ($(e).is(":checked")) {
			if(typeof surveyPlatform=="undefined"){      // This code belongs to Dimensions
				if ($(e).attr('otherid') != '') {
					var otherVal = q.inputs.filter('[id='+$(e).attr('otherid')+']').val();
					dimResp.push({rowIndex:i,input:otherVal});
				}else dimResp.push({rowIndex:i})
				 
			}else if(surveyPlatform=="Nfield"){     // This code belongs to Nfield
				if (q.inputs.filter('textarea').val() != '') {
					var otherVal = q.inputs.filter('textarea').val();
					dimResp.push({rowIndex:i,input:otherVal});
				}else dimResp.push({rowIndex:i})
			}
			
           
        }
    });
    this.component.setDimenResp(dimResp);
}
qcrowpickertext.prototype.setResponses = function (){
    var response = this.getResponse();
    if (response == null) return;
    this.clearInputs(); // need to clear the responses before setting them.
    var allResp = [];
    $.each($(response.Value), function(i,e) { // Sets categories

		if(typeof surveyPlatform !="undefined" && surveyPlatform=="Nfield"){     // This code belongs to Nfield
			if(typeof response[$("#"+e.toUpperCase()).val()] !="undefined")
			$("#"+e.toUpperCase()+"-open").val(response[$("#"+e.toUpperCase()).val()]);
		}
        allResp.push(e);
    });
    this.inputs.filter('input[type!=text]').val(allResp);
	if(typeof surveyPlatform =="undefined"){     // This code belongs to Nfield
		this.setOtherSpecify(response);
	}	
}
qcrowpickertext.prototype.build = function(){
        var rowArray = [];
        var imgsrc, label;

        $.each(this.inputs, function (i, e) {
            var el = $(e);
            var elType = (el).attr('type');
            if(typeof surveyPlatform=="undefined"){      // This code belongs to Dimensions
				if (elType == 'text' || elType == 'textarea') return true;
			}else if(surveyPlatform=="Nfield"){     // This code belongs to Nfield
				if (elType == 'text' || elType == 'textarea'||el.filter('textarea').attr("class")=="mrEdit") return true;
			}

            label = el.parent().find('label').clone();
            imgsrc = label.find('img');
            imgsrc.remove();
             
			label.find("span").removeClass('mrSingleText');
            label.find("span").removeClass('mrMultipleText'); 
			if(typeof surveyPlatform=="undefined"){      // This code belongs to Dimensions
				var rowLabel = label.html()
				var rowDescription = label.text()
				var rowIsRadio = ((elType=="radio" || el.attr('isexclusive')=="true") ? true : false)
			}else if(surveyPlatform=="Nfield"){     // This code belongs to Nfield
				if(typeof label.text().split("|")[1]!="undefined" && label.text().split("|")[1].toLowerCase().trim()=="exclusive")
				var isexclusive=true
				var rowLabel = label.html().split("|")[0]
				var rowDescription = label.text().split("|")[0]
				var rowIsRadio = ((elType=="radio" || isexclusive==true) ? true : false)
			}
            // Create the row array
            rowArray.push(
                {	id:el.attr('value'),
                    label: rowLabel,  // this gets the styles from the html
                    description:rowDescription,  // just grab the text for tooltip purposes
                    image:imgsrc.attr('src'),
                    isRadio: rowIsRadio
                }
            );
			if(typeof surveyPlatform=="undefined"){      // This code belongs to Dimensions
				if (el.attr('isexclusive')=="true") {
					rowArray[rowArray.length-1].ownRow = true;
					//rowArray[rowArray.length-1].type = 'radiocheck';
					rowArray[rowArray.length-1].description = '';
				}
				if (el.attr('otherid') != '') {
					rowArray[rowArray.length-1].type = 'kantarother';
					rowArray[rowArray.length-1].ownRow = true;
					rowArray[rowArray.length-1].description = '';
				}
			}else if(surveyPlatform=="Nfield"){     // This code belongs to Nfield
				if (isexclusive==true) {
					rowArray[rowArray.length-1].ownRow = true;
					//rowArray[rowArray.length-1].type = 'radiocheck';
					rowArray[rowArray.length-1].description = '';
				}
				if (typeof label.text().split("|")[1]!="undefined" && label.text().split("|")[1].toLowerCase().trim().indexOf("other") > -1){
					rowArray[rowArray.length-1].type = 'kantarother';
					rowArray[rowArray.length-1].ownRow = true;
					rowArray[rowArray.length-1].description = '';
				}
			}
        });

        this.component = new RowPicker();
        this.component.rowArray(rowArray);
        this.component.baseTool="rowpicker";
        this.component.params(this.params());
        this.deferred.resolve();

}
qcrowpickertext.prototype.toolOptions = function() {
        $.extend(this.options, eval("this.options."+qcrowpickertext.prototype.type()));
		if(typeof surveyPlatform=="undefined"){      // This code belongs to Dimensions
			var rowBtnLabelPlacement = "bottom"
		}else if(surveyPlatform=="Nfield"){     // This code belongs to Nfield
			var rowBtnLabelPlacement = "center overlay"
		}
		switch(pageLayout.deviceType.toUpperCase()) {
            case "LARGETABLET":
            case "MEDIUMTABLET":
            case "SMALLTABLET":
            case "SMARTPHONETOUCH":
				if(this.orientation==0||this.orientation==180) 
				return  {
//                    'rowBtnBckgrndColorDown' : 0x9fcc3b,
                    'rowContainLabel' : "Row Container Label",
                    'rowBtnShowLabel' : true,
                    'rowBtnUseTooltip' : false,
                    'rowContainWidth' : 768,
                    'rowContainType' : "vertical layout",
                    'rowContainPadding' : 0,
                    'rowContainHgap' : 2,
                    'rowContainVgap' : 2,
                    'rowContainHoffset' : 0,
                    'rowContainVoffset' : 0,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 0,
//                    'rowContainBorderColor' : 0x5b5f65,
//                    'rowContainBckgrndColor' : 0xf1f1f1,
                    'rowBtnDefaultType' : "Text",
                    'rowBtnWidth' : 720,
                    'rowBtnHeight' : 88,
                    'rowBtnBorderStyle' : "solid",
                    'rowBtnBorderRadius' : 12,
                    'rowBtnShowBckgrnd' : true,
//                    'rowBtnBckgrndColorUp' : 0xffffff,
                    'rowBtnLabelPlacement' : "center overlay",
                    'rowBtnLabelHalign' : "center",
                    'rowBtnLabelFontSize' : 36,
                    'rowBtnLabelHoffset' : 0,
                    'rowBtnLabelVoffset' : 0,
//                    'rowBtnLabelColorUp' : 0x5b5f65,
//                    'rowBtnLabelColorDown' : 0xffffff,
                    'rowBtnImgHoffset' : 0,
                    'rowBtnImgVoffset' : 0,
                    'rowShowStamp' : false,
                    'rowStampImp' : "",
                    'rowStampWidth' : 30,
                    'rowStampHeight' : 30,
                    'rowStampHoffset' : 0,
                    'rowStampVoffset' : 0,
                    'rowKantBtnLabelWidth' : 100,
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
                    'rowContainHeight' : 768,
                    'tooltipWidth' : 100,
                    'tooltipBorderWidth' : 1,
//                    'tooltipBorderColor' : 0xcccccc,
//                    'tooltipBckgrndColor' : 0xf8f8f8,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 15,
//                    'tooltipFontColor' : 0x000000,
                    'zoomImp' : "",
                    'zoomWidth' : 20,
                    'zoomHeight' : 20,
                    'zoomBorderWidth' : 1,
//                    'zoomBorderColor' : 0xcccccc,
//                    'zoomBckgrndColor' : 0xf5f5f5,
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
                    'rowContainLabelPadding' : 5,
//                    'rowContainLabelColor' : 0x333333,
                    'rowBtnPadding' : 5,
                    'rowBtnBorderWidthUp' : 2,
                    'rowBtnBorderWidthOver' : 2,
                    'rowBtnBorderWidthDown' : 2,
//                    'rowBtnBorderColorUp' : 0xd2d3d5,
//                    'rowBtnBorderColorOver' : 0xa6a8ab,
//                    'rowBtnBorderColorDown' : 0xffffff,
//                    'rowBtnBckgrndColorOver' : 0xf2f2f2,
                    'rowRadShowImp' : false,
                    'rowRadImpUp' : "",
                    'rowRadImpOver' : "",
                    'rowRadImpDown' : "",
                    'rowChkShowImp' : false,
                    'rowChkImpUp' : "",
                    'rowChkImpOver' : "",
                    'rowChkImpDown' : "",
                    'rowBtnLabelOvrWidth' : false,
                    'rowBtnLabelWidth' : 125,
//                    'rowBtnLabelColorOver' : 0x5b5f65,
                    'rowBtnLabelOverlayShowBckgrnd' : false,
//                    'rowBtnLabelOverlayBckgrndColor' : 0xeeeeee,
                    'rowBtnLabelOverlayPadding' : 4,
                    'rowTxtBtnAdjustHeightType' : "all",
                    'rowRadChckLabelHalign' : "left",
                    'rowRadChckLabelWidth' : 350,
                    'rowRadChckLabelFontSize' : 30,
//                    'rowRadChckLabelColorUp' : 0x555555,
//                    'rowRadChckLabelColorOver' : 0x000000,
//                    'rowRadChckLabelColorDown' : 0xffffff,
                    'rowBtnReverseScaleAlpha' : false,
                    'rowBtnMouseOverDownShadow' : false,
                    'rowBtnMouseOverBounce' : false,
                    'rowBtnMouseOverScale' : 100,
                    'rowBtnMouseDownScale' : 100,
                    'rowBtnMouseDownAlpha' : 100,
                    'zoomActionType' : "click append image",
                    'rowKntrInputTxtAreaWidth' : 250,
                    'rowKntrInputLabelHalign' : "left",
                    'rowKntrInputLabelWidth' : 250,
                    'rowKntrInputLabelHoffset' : 0,
                    'rowKntrInputLabelVoffset' : 10,
                    'rowKntrInputLabelFontSize' : 30,
//                    'rowKntrInputLabelColorUp' : 0x555555,
//                    'rowKntrInputLabelColorOver' : 0x000000,
//                    'rowKntrInputLabelColorDown' : 0x000000,
                    'rowOtherShowLabel' : false,
                    'rowOtherInputHalign' : "left",
                    'rowOtherInputFontSize' : 30,
//                    'rowOtherInputColor' : 0x555555,
                    'rowOtherMsgWidth' : 100,
                    'rowOtherMinVal' : 1,
                    'rowOtherMaxVal' : 100,
                    'rowRadChckLabelHoffset' : 0,
                    'rowRadChckLabelVoffset' : 10,
                    'zoomGalleryBorderStyle' : "solid",
                    'zoomGalleryBorderWidth' : 1,
                    'zoomGalleryBorderColor' : 0xcccccc
				}
				else
				return {
//                  'rowBtnBckgrndColorDown' : 0xffffff,
                    'rowContainLabel' : "Row Container Label",
                    'rowBtnShowLabel' : true,
                    'rowBtnUseTooltip' : false,
                    'rowContainWidth' : 768,
					'rowBtnWidth' : 680,
                    'rowBtnHeight' : 44,
                    'rowContainType' : "vertical layout",
                    'rowContainPadding' : 20,
                    'rowContainHgap' : 5,
                    'rowContainVgap' : 5,
                    'rowContainHoffset' : 0,
                    'rowContainVoffset' : 0,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 0,
//                    'rowContainBorderColor' : 0xa6a8ab,
//                    'rowContainBckgrndColor' : 0xffffff,
                    'rowBtnDefaultType' : "text",
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
                    'rowStampWidth' : 30,
                    'rowStampHeight' : 30,
                    'rowStampHoffset' : 0,
                    'rowStampVoffset' : 0,
                    'rowKantBtnLabelWidth' : 125,
                    'rowZoomHoffset' : 1,
                    'rowZoomVoffset' : -8,
                    'zoomGalleryPadding' : 10,
                    'zoomGalleryHoffset' : 0,
                    'zoomGalleryVoffset' : 0,
                    'compCapValue' : 0,
                    'rowContainHeight' : 500,
                    'tooltipWidth' : 150,
                    'tooltipBorderWidth' : 2,
//                    'tooltipBorderColor' : 0xa6a8ab,
//                    'tooltipBckgrndColor' : 0xffffff,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 18,
//                    'tooltipFontColor' : 0x5b5f65,
                    'zoomWidth' : 20,
                    'zoomHeight' : 20,
                    'zoomBorderWidth' : 1,
//                    'zoomBorderColor' : 0xa6a8ab,
//                    'zoomBckgrndColor' : 0xffffff,
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
                    'rowBtnBorderWidthOver' : 4,
                    'rowBtnBorderWidthDown' : 4,
//                    'rowBtnBorderColorUp' : 0xd2d3d5,
//                    'rowBtnBorderColorOver' : 0xa6a8ab,
//                    'rowBtnBorderColorDown' : 0x9fcc3b,
//                    'rowBtnBckgrndColorOver' : 0xffffff,
                    'rowRadShowImp' : false,
                    'rowChkShowImp' : false,
                    'rowBtnLabelOvrWidth' : false,
                    'rowBtnLabelWidth' : 125,
//                    'rowBtnLabelColorOver' : 0x5b5f65,
                    'rowBtnLabelOverlayShowBckgrnd' : false,
//                    'rowBtnLabelOverlayBckgrndColor' : 0xffffff,
                    'rowBtnLabelOverlayPadding' : 8,
                    'rowTxtBtnAdjustHeightType' : "all",
                    'rowRadChckLabelHalign' : "left",
                    'rowRadChckLabelWidth' : 400,
                    'rowRadChckLabelFontSize' : 14,
//                    'rowRadChckLabelColorUp' : 0x5b5f65,
//                    'rowRadChckLabelColorOver' : 0x5b5f65,
//                    'rowRadChckLabelColorDown' : 0x5b5f65,
                    'rowBtnReverseScaleAlpha' : false,
                    'rowBtnMouseOverDownShadow' : false,
                    'rowBtnMouseOverBounce' : false,
                    'rowBtnMouseOverScale' : 100,
                    'rowBtnMouseDownScale' : 100,
                    'rowBtnMouseDownAlpha' : 100,
                    'zoomActionType' : "click append image",
                    'rowKntrInputTxtAreaWidth' : 125,
                    'rowKntrInputLabelHalign' : "left",
                    'rowKntrInputLabelWidth' : 150,
                    'rowKntrInputLabelHoffset' : 0,
                    'rowKntrInputLabelVoffset' : 7,
                    'rowKntrInputLabelFontSize' : 14,
//                    'rowKntrInputLabelColorUp' : 0x555555,
//                    'rowKntrInputLabelColorOver' : 0x000000,
//                    'rowKntrInputLabelColorDown' : 0x000000,
                    'rowOtherShowLabel' : false,
                    'rowOtherInputHalign' : "left",
                    'rowOtherInputFontSize' : 14,
//                    'rowOtherInputColor' : 0x5b5f65,
                    'rowOtherMsgWidth' : 100,
                    'rowRadChckLabelHoffset' : 0,
                    'rowRadChckLabelVoffset' : 5,
                    'zoomGalleryBorderStyle' : "none",
                    'zoomGalleryBorderWidth' : 0
//                    'zoomGalleryBorderColor' : 0xa6a8ab
                }
				
            case "PC":
            case "OTHERDEVICE":
            default:
                return {
//                    'rowBtnBckgrndColorDown' : 0xffffff,
                    'rowContainLabel' : "Row Container Label",
                    'rowBtnShowLabel' : true,
                    'rowBtnUseTooltip' : false,
                    'rowContainWidth' : 870,
					'rowBtnWidth' : 800,
                    'rowBtnHeight' : 80,
                    'rowContainType' : "vertical layout",
                    'rowContainPadding' : 20,
                    'rowContainHgap' : 5,
                    'rowContainVgap' : 5,
                    'rowContainHoffset' : 0,
                    'rowContainVoffset' : 0,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 0,
//                    'rowContainBorderColor' : 0xa6a8ab,
//                    'rowContainBckgrndColor' : 0xffffff,
                    'rowBtnDefaultType' : "text",
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
                    'rowStampWidth' : 30,
                    'rowStampHeight' : 30,
                    'rowStampHoffset' : 0,
                    'rowStampVoffset' : 0,
                    'rowKantBtnLabelWidth' : 125,
                    'rowZoomHoffset' : 1,
                    'rowZoomVoffset' : -8,
                    'zoomGalleryPadding' : 10,
                    'zoomGalleryHoffset' : 0,
                    'zoomGalleryVoffset' : 0,
                    'compCapValue' : 0,
                    'rowContainHeight' : 500,
                    'tooltipWidth' : 150,
                    'tooltipBorderWidth' : 2,
//                    'tooltipBorderColor' : 0xa6a8ab,
//                    'tooltipBckgrndColor' : 0xffffff,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 18,
//                    'tooltipFontColor' : 0x5b5f65,
                    'zoomWidth' : 20,
                    'zoomHeight' : 20,
                    'zoomBorderWidth' : 1,
//                    'zoomBorderColor' : 0xa6a8ab,
//                    'zoomBckgrndColor' : 0xffffff,
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
                    'rowBtnBorderWidthOver' : 4,
                    'rowBtnBorderWidthDown' : 4,
//                    'rowBtnBorderColorUp' : 0xd2d3d5,
//                    'rowBtnBorderColorOver' : 0xa6a8ab,
//                    'rowBtnBorderColorDown' : 0x9fcc3b,
//                    'rowBtnBckgrndColorOver' : 0xffffff,
                    'rowRadShowImp' : false,
                    'rowChkShowImp' : false,
                    'rowBtnLabelOvrWidth' : false,
                    'rowBtnLabelWidth' : 125,
//                    'rowBtnLabelColorOver' : 0x5b5f65,
                    'rowBtnLabelOverlayShowBckgrnd' : false,
//                    'rowBtnLabelOverlayBckgrndColor' : 0xffffff,
                    'rowBtnLabelOverlayPadding' : 8,
                    'rowTxtBtnAdjustHeightType' : "all",
                    'rowRadChckLabelHalign' : "left",
                    'rowRadChckLabelWidth' : 600,
                    'rowRadChckLabelFontSize' : 14,
//                    'rowRadChckLabelColorUp' : 0x5b5f65,
//                    'rowRadChckLabelColorOver' : 0x5b5f65,
//                    'rowRadChckLabelColorDown' : 0x5b5f65,
                    'rowBtnReverseScaleAlpha' : false,
                    'rowBtnMouseOverDownShadow' : false,
                    'rowBtnMouseOverBounce' : false,
                    'rowBtnMouseOverScale' : 100,
                    'rowBtnMouseDownScale' : 100,
                    'rowBtnMouseDownAlpha' : 100,
                    'zoomActionType' : "click append image",
                    'rowKntrInputTxtAreaWidth' : 125,
                    'rowKntrInputLabelHalign' : "left",
                    'rowKntrInputLabelWidth' : 150,
                    'rowKntrInputLabelHoffset' : 0,
                    'rowKntrInputLabelVoffset' : 7,
                    'rowKntrInputLabelFontSize' : 14,
//                    'rowKntrInputLabelColorUp' : 0x555555,
//                    'rowKntrInputLabelColorOver' : 0x000000,
//                    'rowKntrInputLabelColorDown' : 0x000000,
                    'rowOtherShowLabel' : false,
                    'rowOtherInputHalign' : "left",
                    'rowOtherInputFontSize' : 14,
//                    'rowOtherInputColor' : 0x5b5f65,
                    'rowOtherMsgWidth' : 100,
                    'rowRadChckLabelHoffset' : 0,
                    'rowRadChckLabelVoffset' : 5,
                    'zoomGalleryBorderStyle' : "none",
                    'zoomGalleryBorderWidth' : 0
//                    'zoomGalleryBorderColor' : 0xa6a8ab
                }
        }
}