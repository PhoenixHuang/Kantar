/**
 * qcclickandfly class
 * Inherits from SESurveyTool
 */
function qcclickandfly(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
qcclickandfly.prototype = Object.create(SESurveyTool.prototype);
qcclickandfly.prototype.type = function(){
    return "qcclickandfly";
}
qcclickandfly.prototype.getDependencies = function(){
    return [
        {'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcomponent/ClicknFly/ClicknFly.js'}
        //{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QFactory.js'},
		//{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QContainer.js'},
		//{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QWidget.js'} 
    ];
}
qcclickandfly.prototype.setInitialResponses = function (){
    var dimResp = [];
    var q = this;
    $.each(q.inputs, function(i,e) {
        if ($(e).is(":checked")) {
            dimResp.push({rowIndex:i})
        }
    });
    this.component.setDimenResp(dimResp);
}
qcclickandfly.prototype.setResponses = function (){
    var response = this.getResponse();
    if (response == null) return;
    var allResp = [];
    $.each($(response.Value), function(i,e) { // Sets categories
        allResp.push(e);
    });
    this.inputs.filter('input[type!=text]').val(allResp);
}
qcclickandfly.prototype.build = function(){
        this.component = new ClicknFly();
		var finalparams=this.params();
		this.params()
		var rowArray = [],
            that = this;

        $.each(this.inputs, function (i, e) {
            var el = $(e);
            var elType = (el).attr('type');
            if (elType == 'text' || elType == 'textarea') return true;

            var label = el.parent().find('label').clone();
            var imgsrc = label.find('img');
            var btnType = (imgsrc.length == 0) ? 'text' : 'default';
            imgsrc.remove();
			label.find('span').removeClass('mrQuestionText');
            label.find("span").removeClass('mrSingleText');
            label.find("span").removeClass('mrMultipleText');
            // Create the row array
            rowArray.push({
                id: el.attr('value'),
                label: label.html(),  // this gets the styles from the html
                description: label.text(),  // just grab the text for tooltip purposes
                image: imgsrc.attr('src'),
                type: btnType,
                isRadio: ((elType=="radio" || el.attr('isexclusive')=="true") ? true : false)
            });

            // Radio Check only Allowed on Last Item in Array
            if (el.attr('isexclusive')=="true") {
                if (that.maxVal > 1 && that.inputs.length == (i + 1)) {
                    rowArray[rowArray.length-1].type = 'radiocheck';
                    rowArray[rowArray.length-1].description = '';
                    that.options.dkRadChckEnable = true;
                }
            }
        });

        
        this.component.rowArray(rowArray);
        this.component.baseTool="clicknfly";
        this.setRuntimeProps();
        this.component.params(finalparams);
        this.deferred.resolve();
}
qcclickandfly.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options."+qcclickandfly.prototype.type()));
	switch(pageLayout.deviceType.toUpperCase()) {
        case "LARGETABLET":
        case "MEDIUMTABLET":
        case "SMALLTABLET":
        case "SMARTPHONETOUCH":
            if(this.orientation==0||this.orientation==180) 
			return  {
                'rowBtnUseZoom' : false,
//                'rowBtnBckgrndColorDown' : 0xffffff,
                'rowContainLabel' : "Row Container Label",
                'rowBtnShowLabel' : true,
                'rowBtnUseTooltip' : false,
                'rowContainWidth' : 738,
                'rowContainType' : "horizontal grid layout",
                'rowContainPadding' : 0,
                'rowContainHgap' : 0,
                'rowContainVgap' : 2,
                'rowContainHoffset' : 0,
                'rowContainVoffset' : 0,
                'rowContainBorderStyle' : "none",
                'rowContainBorderWidth' : 0,
//                'rowContainBorderColor' : 0x5b5f65,
//                'rowContainBckgrndColor' : 0xf1f1f1,
                'rowBtnDefaultType' : "Base",
                'rowBtnBorderStyle' : "solid",
                'rowBtnBorderRadius' : 12,
                'rowBtnShowBckgrnd' : true,
//                'rowBtnBckgrndColorUp' : 0xffffff,
                'rowBtnLabelPlacement' : "bottom",
                'rowBtnLabelHalign' : "center",
                'rowBtnLabelFontSize' : 28,
                'rowBtnLabelHoffset' : 0,
                'rowBtnLabelVoffset' : 0,
//                'rowBtnLabelColorUp' : 0x5b5f65,
//                'rowBtnLabelColorDown' : 0x5b5f65,
                'rowBtnImgHoffset' : 0,
                'rowBtnImgVoffset' : 0,
                'rowShowStamp' : false,
                'rowStampWidth' : 30,
                'rowStampHeight' : 30,
                'rowStampHoffset' : 0,
                'rowStampVoffset' : 0,
                'rowKantBtnLabelWidth' : 100,
                'rowZoomHoffset' : 0,
                'rowZoomVoffset' : 0,
//                'zoomOverlayBckgrndColor' : 0x000000,
                'zoomOverlayAlpha' : 80,
                'zoomGalleryPadding' : 10,
                'zoomGalleryHoffset' : 0,
                'zoomGalleryVoffset' : 0,
                'compCapValue' : 0,
                'rowContainHeight' : 768,
                'tooltipWidth' : 100,
                'tooltipBorderWidth' : 1,
//                'tooltipBorderColor' : 0xcccccc,
//                'tooltipBckgrndColor' : 0xf8f8f8,
                'tooltipLabelHalign' : "left",
                'tooltipFontSize' : 15,
//                'tooltipFontColor' : 0x000000,
                'zoomWidth' : 20,
                'zoomHeight' : 20,
                'zoomBorderWidth' : 1,
//                'zoomBorderColor' : 0xcccccc,
//                'zoomBckgrndColor' : 0xf5f5f5,
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
                'rowContainLabelPadding' : 10,
//                'rowContainLabelColor' : 0x333333,
                'rowBtnPadding' : 5,
                'rowBtnBorderWidthUp' : 2,
                'rowBtnBorderWidthOver' : 4,
                'rowBtnBorderWidthDown' : 4,
//                'rowBtnBorderColorUp' : 0xd2d3d5,
//                'rowBtnBorderColorOver' : 0xa6a8ab,
//                'rowBtnBorderColorDown' : 0x9fcc3b,
//                'rowBtnBckgrndColorOver' : 0xffffff,
                'rowRadShowImp' : false,
                'rowChkShowImp' : false,
                'rowBtnLabelOvrWidth' : false,
                'rowBtnLabelWidth' : 125,
//                'rowBtnLabelColorOver' : 0x5b5f65,
                'rowBtnLabelOverlayShowBckgrnd' : false,
//                'rowBtnLabelOverlayBckgrndColor' : 0xeeeeee,
                'rowBtnLabelOverlayPadding' : 5,
                'rowTxtBtnAdjustHeightType' : "none",
                'rowRadChckLabelHalign' : "left",
                'rowRadChckLabelWidth' : 1000,
                'rowRadChckLabelFontSize' : 15,
//                'rowRadChckLabelColorUp' : 0x555555,
//                'rowRadChckLabelColorOver' : 0x000000,
//                'rowRadChckLabelColorDown' : 0xffffff,
                'rowBtnReverseScaleAlpha' : true,
                'rowBtnMouseOverDownShadow' : false,
                'rowBtnMouseOverBounce' : false,
                'rowBtnMouseOverScale' : 102,
                'rowBtnMouseDownScale' : 100,
                'rowBtnMouseDownAlpha' : 50,
                'zoomActionType' : "click append image",
                'rowKntrInputTxtAreaWidth' : 125,
                'rowKntrInputLabelHalign' : "left",
                'rowKntrInputLabelWidth' : 150,
                'rowKntrInputLabelHoffset' : 0,
                'rowKntrInputLabelVoffset' : 2,
                'rowKntrInputLabelFontSize' : 15,
//                'rowKntrInputLabelColorUp' : 0x555555,
//                'rowKntrInputLabelColorOver' : 0x000000,
//                'rowKntrInputLabelColorDown' : 0x000000,
                'rowOtherShowLabel' : false,
                'rowOtherInputHalign' : "left",
                'rowOtherInputFontSize' : 12,
//                'rowOtherInputColor' : 0x555555,
                'rowOtherMsgWidth' : 100,
                'rowRadChckLabelHoffset' : 0,
                'rowRadChckLabelVoffset' : 0,
                'zoomGalleryBorderStyle' : "solid",
                'zoomGalleryBorderWidth' : 1,
//                'zoomGalleryBorderColor' : 0xcccccc,
                'bucketHoffset' : 0,
                'bucketVoffset' : 0,
//                'bucketPrimBckgrndColor' : 0xf2f2f2,
//                'bucketSecBckgrndColor' : 0xf2f2f2,
                'bucketBorderStyle' : 'Solid',
                'bucketBorderWidth' : 2,
//                'bucketBorderColor' : 0xd2d3d5,
                'bucketShowSingleMarker' : false,
                'bucketMultiContainType' : 'Grow',
                'dkRadChckLabelHalign' : 'Center',
                'dkRadChckLabelWidth' : 500,
                'rowContainNumRowPerCol' : 1
            }
			else
			return {
//                'rowBtnBckgrndColorDown' : 0xffffff,
                'rowContainLabel' : "Row Container Label",
                'rowBtnShowLabel' : true,
                'rowBtnUseTooltip' : false,
                'rowContainWidth' : 970,
                'rowContainType' : "horizontal grid layout",
                'rowContainPadding' : 5,
                'rowContainHgap' : 0,
                'rowContainVgap' : 2,
                'rowContainHoffset' : 0,
                'rowContainVoffset' : 0,
                'rowContainBorderStyle' : "none",
                'rowContainBorderWidth' : 0,
//                'rowContainBorderColor' : 0xa6a8ab,
//                'rowContainBckgrndColor' : 0xffffff,
                'rowBtnDefaultType' : "Base",
                'rowBtnBorderStyle' : "solid",
                'rowBtnBorderRadius' : 6,
                'rowBtnShowBckgrnd' : true,
//                'rowBtnBckgrndColorUp' : 0xffffff,
                'rowBtnLabelPlacement' : "bottom",
                'rowBtnLabelHalign' : "center",
                'rowBtnLabelFontSize' : 18,
                'rowBtnLabelHoffset' : 0,
                'rowBtnLabelVoffset' : 0,
//                'rowBtnLabelColorUp' : 0x5b5f65,
//                'rowBtnLabelColorDown' : 0x5b5f65,
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
//                'zoomOverlayBckgrndColor' : 0x000000,
                'zoomOverlayAlpha' : 80,
                'zoomGalleryPadding' : 10,
                'zoomGalleryHoffset' : 0,
                'zoomGalleryVoffset' : 0,
                'compCapValue' : 0,
                'rowContainHeight' : 500,
                'tooltipWidth' : 150,
                'tooltipBorderWidth' : 2,
//                'tooltipBorderColor' : 0xa6a8ab,
//                'tooltipBckgrndColor' : 0xffffff,
                'tooltipLabelHalign' : "left",
                'tooltipFontSize' : 18,
//                'tooltipFontColor' : 0x5b5f65,
                'zoomWidth' : 20,
                'zoomHeight' : 20,
                'zoomBorderWidth' : 1,
//                'zoomBorderColor' : 0xa6a8ab,
//                'zoomBckgrndColor' : 0xffffff,
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
//                'rowContainLabelColor' : 0x5b5f65,
                'rowBtnPadding' : 10,
                'rowBtnBorderWidthUp' : 2,
                'rowBtnBorderWidthOver' : 4,
                'rowBtnBorderWidthDown' : 4,
//                'rowBtnBorderColorUp' : 0xd2d3d5,
//                'rowBtnBorderColorOver' : 0xa6a8ab,
//                'rowBtnBorderColorDown' : 0x9fcc3b,
//                'rowBtnBckgrndColorOver' : 0xffffff,
                'rowRadShowImp' : false,
                'rowChkShowImp' : false,
                'rowBtnLabelOvrWidth' : false,
                'rowBtnLabelWidth' : 125,
//                'rowBtnLabelColorOver' : 0x5b5f65,
                'rowBtnLabelOverlayShowBckgrnd' : false,
//                'rowBtnLabelOverlayBckgrndColor' : 0xffffff,
                'rowBtnLabelOverlayPadding' : 8,
                'rowTxtBtnAdjustHeightType' : "none", // TODO - Does not match documented behaviour & appears to be case sensitive
                'rowRadChckLabelHalign' : "left",
                'rowRadChckLabelWidth' : 1000,
                'rowRadChckLabelFontSize' : 18,
//                'rowRadChckLabelColorUp' : 0x5b5f65,
//                'rowRadChckLabelColorOver' : 0x5b5f65,
//                'rowRadChckLabelColorDown' : 0x5b5f65,
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
                'rowKntrInputLabelVoffset' : 2,
                'rowKntrInputLabelFontSize' : 15,
//                'rowKntrInputLabelColorUp' : 0x555555,
//                'rowKntrInputLabelColorOver' : 0x000000,
//                'rowKntrInputLabelColorDown' : 0x000000,
                'rowOtherShowLabel' : false,
                'rowOtherInputHalign' : "left",
                'rowOtherInputFontSize' : 14,
//                'rowOtherInputColor' : 0x5b5f65,
                'rowOtherMsgWidth' : 100,
                'rowRadChckLabelHoffset' : 0,
                'rowRadChckLabelVoffset' : 0,
                'zoomGalleryBorderStyle' : "none",
                'zoomGalleryBorderWidth' : 0,
//                'zoomGalleryBorderColor' : 0xa6a8ab,
                'bucketHoffset' : 0,
                'bucketVoffset' : 0,
//                'bucketPrimBckgrndColor' : 0xf2f2f2,
//                'bucketSecBckgrndColor' : 0xf2f2f2,
                'bucketBorderStyle' : 'Solid',
                'bucketBorderWidth' : 2,
//                'bucketBorderColor' : 0xd2d3d5,
                'bucketShowSingleMarker' : false,
                'bucketMultiContainType' : 'Grow',
                'dkRadChckLabelHalign' : 'Center',
                'dkRadChckLabelWidth' : 500,
                'rowContainNumRowPerCol' : 1
            }
        case "PC":
        case "OTHERDEVICE":
        default:
            return {
//                'rowBtnBckgrndColorDown' : 0xffffff,
                'rowContainLabel' : "Row Container Label",
                'rowBtnShowLabel' : true,
                'rowBtnUseTooltip' : false,
                'rowContainWidth' : 970,
                'rowContainType' : "horizontal grid layout",
                'rowContainPadding' : 5,
                'rowContainHgap' : 0,
                'rowContainVgap' : 2,
                'rowContainHoffset' : 0,
                'rowContainVoffset' : 0,
                'rowContainBorderStyle' : "none",
                'rowContainBorderWidth' : 0,
//                'rowContainBorderColor' : 0xa6a8ab,
//                'rowContainBckgrndColor' : 0xffffff,
                'rowBtnDefaultType' : "Base",
                'rowBtnBorderStyle' : "solid",
                'rowBtnBorderRadius' : 6,
                'rowBtnShowBckgrnd' : true,
//                'rowBtnBckgrndColorUp' : 0xffffff,
                'rowBtnLabelPlacement' : "bottom",
                'rowBtnLabelHalign' : "center",
                'rowBtnLabelFontSize' : 18,
                'rowBtnLabelHoffset' : 0,
                'rowBtnLabelVoffset' : 0,
//                'rowBtnLabelColorUp' : 0x5b5f65,
//                'rowBtnLabelColorDown' : 0x5b5f65,
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
//                'zoomOverlayBckgrndColor' : 0x000000,
                'zoomOverlayAlpha' : 80,
                'zoomGalleryPadding' : 10,
                'zoomGalleryHoffset' : 0,
                'zoomGalleryVoffset' : 0,
                'compCapValue' : 0,
                'rowContainHeight' : 500,
                'tooltipWidth' : 150,
                'tooltipBorderWidth' : 2,
//                'tooltipBorderColor' : 0xa6a8ab,
//                'tooltipBckgrndColor' : 0xffffff,
                'tooltipLabelHalign' : "left",
                'tooltipFontSize' : 18,
//                'tooltipFontColor' : 0x5b5f65,
                'zoomWidth' : 20,
                'zoomHeight' : 20,
                'zoomBorderWidth' : 1,
//                'zoomBorderColor' : 0xa6a8ab,
//                'zoomBckgrndColor' : 0xffffff,
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
//                'rowContainLabelColor' : 0x5b5f65,
                'rowBtnPadding' : 10,
                'rowBtnBorderWidthUp' : 2,
                'rowBtnBorderWidthOver' : 4,
                'rowBtnBorderWidthDown' : 4,
//                'rowBtnBorderColorUp' : 0xd2d3d5,
//                'rowBtnBorderColorOver' : 0xa6a8ab,
//                'rowBtnBorderColorDown' : 0x9fcc3b,
//                'rowBtnBckgrndColorOver' : 0xffffff,
                'rowRadShowImp' : false,
                'rowChkShowImp' : false,
                'rowBtnLabelOvrWidth' : false,
                'rowBtnLabelWidth' : 125,
//                'rowBtnLabelColorOver' : 0x5b5f65,
                'rowBtnLabelOverlayShowBckgrnd' : false,
//                'rowBtnLabelOverlayBckgrndColor' : 0xffffff,
                'rowBtnLabelOverlayPadding' : 8,
                'rowTxtBtnAdjustHeightType' : "none", // TODO - Does not match documented behaviour & appears to be case sensitive
                'rowRadChckLabelHalign' : "left",
                'rowRadChckLabelWidth' : 1000,
                'rowRadChckLabelFontSize' : 18,
//                'rowRadChckLabelColorUp' : 0x5b5f65,
//                'rowRadChckLabelColorOver' : 0x5b5f65,
//                'rowRadChckLabelColorDown' : 0x5b5f65,
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
                'rowKntrInputLabelVoffset' : 2,
                'rowKntrInputLabelFontSize' : 15,
//                'rowKntrInputLabelColorUp' : 0x555555,
//                'rowKntrInputLabelColorOver' : 0x000000,
//                'rowKntrInputLabelColorDown' : 0x000000,
                'rowOtherShowLabel' : false,
                'rowOtherInputHalign' : "left",
                'rowOtherInputFontSize' : 14,
//                'rowOtherInputColor' : 0x5b5f65,
                'rowOtherMsgWidth' : 100,
                'rowRadChckLabelHoffset' : 0,
                'rowRadChckLabelVoffset' : 0,
                'zoomGalleryBorderStyle' : "none",
                'zoomGalleryBorderWidth' : 0,
//                'zoomGalleryBorderColor' : 0xa6a8ab,
                'bucketHoffset' : 0,
                'bucketVoffset' : 0,
//                'bucketPrimBckgrndColor' : 0xf2f2f2,
//                'bucketSecBckgrndColor' : 0xf2f2f2,
                'bucketBorderStyle' : 'Solid',
                'bucketBorderWidth' : 2,
//                'bucketBorderColor' : 0xd2d3d5,
                'bucketShowSingleMarker' : false,
                'bucketMultiContainType' : 'Grow',
                'dkRadChckLabelHalign' : 'Center',
                'dkRadChckLabelWidth' : 500,
                'rowContainNumRowPerCol' : 1
            }
    }
}
