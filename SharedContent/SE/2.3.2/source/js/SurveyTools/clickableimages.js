/**
 * clickableimages class
 * Inherits from SESurveyTool
 */
function clickableimages(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
clickableimages.prototype = Object.create(SESurveyTool.prototype);
clickableimages.prototype.type = function(){
    return "clickableimages";
}
clickableimages.prototype.getDependencies = function(){
    return [
        {'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcomponent/RowPicker_2.3.2.js'},
        //{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QFactory.js'},
		//{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QContainer.js'},
		{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QWidget.js'}   
    ];
}
clickableimages.prototype.setInitialResponses = function (){
    var dimResp = [];
    var q = this;
    $.each(q.inputs, function(i,e) {
        if ($(e).is(":checked")) {
            if ($(e).attr('otherid') != '') {
                var otherVal = q.inputs.filter('[id='+$(e).attr('otherid')+']').val();
                dimResp.push({rowIndex:i,input:otherVal});
            }
            else dimResp.push({rowIndex:i})
        }
    });
    this.component.setDimenResp(dimResp);
}
clickableimages.prototype.setResponses = function (){
    var response = this.getResponse();
    if (response == null) return;
    this.clearInputs(); // need to clear the responses before setting them.
    var allResp = [];
    $.each($(response.Value), function(i,e) { // Sets categories
        allResp.push(e);
    });
    this.inputs.filter('input[type!=text]').val(allResp);

    this.setOtherSpecify(response);
}
clickableimages.prototype.build = function(){
        var rowArray = [];
        var maxWidth=0, maxHeight=0;
        var w=0, h=0, lh, imgsrc, label;
        var thisQ = this;
        var usezoom = thisQ.getProperty("rowBtnUseZoom");
        var zoomscale = thisQ.getProperty("zoomScale");
        var defwidth = thisQ.getProperty("rowBtnWidth");
        var defheight = thisQ.getProperty("rowBtnHeight");
        $.each(this.inputs, function (i, e) {
            var el = $(e);
            var elType = (el).attr('type');
            if (elType == 'text' || elType == 'textarea') return true;

            label = el.parent().find('label').clone();
            imgsrc = label.find('img');

            //var imageDim = pageLayout.imageDimensions(imgsrc, usezoom, zoomscale, defwidth, defheight);
            //w = imageDim.width;
            //h = imageDim.height;
            label.find('span').removeClass('mrQuestionText');
			label.find("span").removeClass('mrSingleText');
            label.find("span").removeClass('mrMultipleText');
			
            maxWidth = (w>maxWidth?w:maxWidth);
            maxHeight = (h>maxHeight?h:maxHeight);
            lh = label.height();
            imgsrc.remove();

            // Create the row array
            rowArray.push(
                {	id:el.attr('value'),
                    label: label.html(),  // this gets the styles from the html
                    description:label.text(),  // just grab the text for tooltip purposes
                    image:imgsrc.attr('src'),
                    width: defwidth,
                    height: defheight,
                    useZoom: usezoom,
                    useTooltip: thisQ.getProperty("rowBtnUseTooltip") == true,
                    zoomIcon: surveyPage.options.zoomIcon,
                    isRadio: ((elType=="radio" || el.attr('isexclusive')=="true") ? true : false)
                }
            );
            if (el.attr('isexclusive')=="true" || imgsrc.length <= 0) {
                rowArray[rowArray.length-1].ownRow = true;
                rowArray[rowArray.length-1].type = 'radiocheck';
                rowArray[rowArray.length-1].description = '';
            }

            if (el.attr('otherid') != '') {
                rowArray[rowArray.length-1].type = 'kantarother';
                rowArray[rowArray.length-1].ownRow = true;
                rowArray[rowArray.length-1].description = '';
            }
        });

        // resize any items to max height/width get them to match
        /*$.each(rowArray, function(i, e) {
            e.width = maxWidth;
            e.height = maxHeight;
        });*/

        this.component = new RowPicker();
        this.component.rowArray(rowArray);
        this.component.baseTool="rowpicker";
        this.component.params(this.params());
        this.deferred.resolve();

}
clickableimages.prototype.toolOptions = function() {
        $.extend(this.options, eval("this.options."+clickableimages.prototype.type()));
		switch(pageLayout.deviceType.toUpperCase()) {
            case "LARGETABLET":
            case "MEDIUMTABLET":
            case "SMALLTABLET":
            case "SMARTPHONETOUCH":
				if(this.orientation==0||this.orientation==180) 
                return  {
                    'rowBtnUseZoom' : false,
//                    'rowBtnBckgrndColorDown' : 0xffffff,
                    'rowContainLabel' : "Row Container Label",
                    'rowBtnShowLabel' : true,
                    'rowBtnUseTooltip' : false,
                    'rowContainWidth' : 768,
					'rowBtnWidth' : 150,
                    'rowBtnHeight' : 150,
                    'rowContainType' : "horizontal grid layout",
                    'rowContainPadding' : 0,
                    'rowContainHgap' : 1,
                    'rowContainVgap' : 3,
                    'rowContainHoffset' : 0,
                    'rowContainVoffset' : 0,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 0,
 //                   'rowContainBorderColor' : 0x5b5f65,
 //                   'rowContainBckgrndColor' : 0xf1f1f1,
                    'rowBtnDefaultType' : "Base",
                    'rowBtnBorderStyle' : "solid",
                    'rowBtnBorderRadius' : 12,
                    'rowBtnShowBckgrnd' : true,
//                   'rowBtnBckgrndColorUp' : 0xffffff,
                    'rowBtnLabelPlacement' : "bottom",
                    'rowBtnLabelHalign' : "center",
                    'rowBtnLabelFontSize' : 30,
                    'rowBtnLabelHoffset' : 0,
                    'rowBtnLabelVoffset' : 0,
//                    'rowBtnLabelColorUp' : 0x5b5f65,
//                    'rowBtnLabelColorDown' : 0x5b5f65,
                    'rowBtnImgHoffset' : 0,
                    'rowBtnImgVoffset' : -10,
                    'rowShowStamp' : false,
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
                    'compCapValue' : 0,
                    'rowContainHeight' : 768,
                    'tooltipWidth' : 100,
                    'tooltipBorderWidth' : 1,
//                    'tooltipBorderColor' : 0xcccccc,
//                    'tooltipBckgrndColor' : 0xf8f8f8,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 15,
//                    'tooltipFontColor' : 0x000000,
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
                    'rowContainImgImportHoffset' : 0,
                    'rowContainImgImportVoffset' : 0,
                    'rowContainShowLabel' : false,
                    'rowContainLabelHalign' : "left",
                    'rowContainLabelFontSize' : 18,
                    'rowContainLabelPadding' : 10,
//                    'rowContainLabelColor' : 0x333333,
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
//                    'rowBtnLabelOverlayBckgrndColor' : 0xeeeeee,
                    'rowBtnLabelOverlayPadding' : 5,
                    'rowTxtBtnAdjustHeightType' : "none",
                    'rowRadChckLabelHalign' : "left",
                    'rowRadChckLabelWidth' : 350,
                    'rowRadChckLabelFontSize' : 30,
//                    'rowRadChckLabelColorUp' : 0x555555,
//                    'rowRadChckLabelColorOver' : 0x000000,
//                    'rowRadChckLabelColorDown' : 0xffffff,
                    'rowBtnReverseScaleAlpha' : true,
                    'rowBtnMouseOverDownShadow' : false,
                    'rowBtnMouseOverBounce' : false,
                    'rowBtnMouseOverScale' : 102,
                    'rowBtnMouseDownScale' : 100,
                    'rowBtnMouseDownAlpha' : 100,
                    'zoomActionType' : "click append image",
                    'rowKntrInputTxtAreaWidth' : 250,
                    'rowKntrInputLabelHalign' : "left",
                    'rowKntrInputLabelWidth' : 250,
                    'rowKntrInputLabelHoffset' : 0,
                    'rowKntrInputLabelVoffset' : 8,
                    'rowKntrInputLabelFontSize' : 30,
//                    'rowKntrInputLabelColorUp' : 0x555555,
//                    'rowKntrInputLabelColorOver' : 0x000000,
//                    'rowKntrInputLabelColorDown' : 0x000000,
                    'rowOtherShowLabel' : false,
                    'rowOtherInputHalign' : "left",
                    'rowOtherInputFontSize' : 30,
//                    'rowOtherInputColor' : 0x555555,
                    'rowOtherMsgWidth' : 150,
                    'rowRadChckLabelHoffset' : 0,
                    'rowRadChckLabelVoffset' : 8,
                    'zoomGalleryBorderStyle' : "solid",
                    'zoomGalleryBorderWidth' : 1
//                    'zoomGalleryBorderColor' : 0xcccccc
				}
			 else	
				return {
//                    'rowBtnBckgrndColorDown' : 0xffffff,
                    'rowContainLabel' : "Row Container Label",
                    'rowBtnShowLabel' : true,
                    'rowBtnUseTooltip' : false,
                    'rowContainWidth' : 768,
					'rowBtnWidth' : 60,
                    'rowBtnHeight' : 60,
                    'rowContainType' : "horizontal grid layout",
                    'rowContainPadding' : 10,
                    'rowContainHgap' : 3,
                    'rowContainVgap' : 3,
                    'rowContainHoffset' : 0,
                    'rowContainVoffset' : 0,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 0,
//                    'rowContainBorderColor' : 0xa6a8ab,
//                    'rowContainBckgrndColor' : 0xffffff,
                    'rowBtnDefaultType' : "Base",
                    'rowBtnBorderStyle' : "solid",
                    'rowBtnBorderRadius' : 6,
                    'rowBtnShowBckgrnd' : true,
//                    'rowBtnBckgrndColorUp' : 0xffffff,
                    'rowBtnLabelPlacement' : "bottom",
                    'rowBtnLabelHalign' : "center",
                    'rowBtnLabelFontSize' : 14,
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
//                    'zoomOverlayBckgrndColor' : 0x000000,
                    'zoomOverlayAlpha' : 80,
                    'zoomGalleryPadding' : 10,
                    'zoomGalleryHoffset' : 0,
                    'zoomGalleryVoffset' : 0,
                    'compCapValue' : 0,
                    'rowContainHeight' : 500,
                    'tooltipWidth' : 150,
                    'tooltipBorderWidth' : 2,
//                   'tooltipBorderColor' : 0xa6a8ab,
//                    'tooltipBckgrndColor' : 0xffffff,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 18,
//                    'tooltipFontColor' : 0x5b5f65,
                    'zoomWidth' : 15,
                    'zoomHeight' : 15,
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
                    'rowTxtBtnAdjustHeightType' : "none",
                    'rowRadChckLabelHalign' : "left",
                    'rowRadChckLabelWidth' : 350,
                    'rowRadChckLabelFontSize' : 14,
//                    'rowRadChckLabelColorUp' : 0x5b5f65,
//                    'rowRadChckLabelColorOver' : 0x5b5f65,
 //                   'rowRadChckLabelColorDown' : 0x5b5f65,
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
                    'rowKntrInputLabelVoffset' : 5,
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
                    'rowRadChckLabelVoffset' : 3,
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
					'rowBtnWidth' : 190,
                    'rowBtnHeight' : 190,
                    'rowContainType' : "horizontal grid layout",
                    'rowContainPadding' : 20,
                    'rowContainHgap' : 3,
                    'rowContainVgap' : 3,
                    'rowContainHoffset' : 0,
                    'rowContainVoffset' : 0,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 0,
//                    'rowContainBorderColor' : 0xa6a8ab,
//                    'rowContainBckgrndColor' : 0xffffff,
                    'rowBtnDefaultType' : "Base",
                    'rowBtnBorderStyle' : "solid",
                    'rowBtnBorderRadius' : 6,
                    'rowBtnShowBckgrnd' : true,
//                    'rowBtnBckgrndColorUp' : 0xffffff,
                    'rowBtnLabelPlacement' : "bottom",
                    'rowBtnLabelHalign' : "center",
                    'rowBtnLabelFontSize' : 14,
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
//                    'zoomOverlayBckgrndColor' : 0x000000,
                    'zoomOverlayAlpha' : 80,
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
//                   'rowBtnBorderColorOver' : 0xa6a8ab,
//                    'rowBtnBorderColorDown' : 0x9fcc3b,
//                    'rowBtnBckgrndColorOver' : 0xffffff,
                    'rowRadShowImp' : false,
                    'rowChkShowImp' : false,
                    'rowBtnLabelOvrWidth' : false,
                    'rowBtnLabelWidth' : 125,
//                   'rowBtnLabelColorOver' : 0x5b5f65,
                    'rowBtnLabelOverlayShowBckgrnd' : false,
//                    'rowBtnLabelOverlayBckgrndColor' : 0xffffff,
                    'rowBtnLabelOverlayPadding' : 8,
                    'rowTxtBtnAdjustHeightType' : "none",
                    'rowRadChckLabelHalign' : "left",
                    'rowRadChckLabelWidth' : 500,
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