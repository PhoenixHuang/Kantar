/**
 * clickandfly class
 * Inherits from SESurveyTool
 */
function clickandfly(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
clickandfly.prototype = Object.create(SESurveyTool.prototype);
clickandfly.prototype.type = function(){
    return "clickandfly";
}
clickandfly.prototype.getDependencies = function(){
    return [
        {'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcomponent/ClicknFly.js'},
        {'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QWidget.js'},
        {'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QContainer.js'},
        {'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QFactory.js'}
    ];
}
clickandfly.prototype.setInitialResponses = function (){
    var dimResp = [];
    var q = this;
    $.each(q.inputs, function(i,e) {
        if ($(e).is(":checked")) {
            dimResp.push({rowIndex:i})
        }
    });
    this.component.setDimenResp(dimResp);
}
clickandfly.prototype.setResponses = function (){
    var response = this.getResponse();
    if (response == null) return;
    var allResp = [];
    $.each($(response.Value), function(i,e) { // Sets categories
        allResp.push(e);
    });
    this.inputs.filter('input[type!=text]').val(allResp);
}
clickandfly.prototype.build = function(){
        var rowArray = [];
        var maxWidth=0, maxHeight=0;
        var w=0, h=0, lh;
        var thisQ = this;
        this.rowContainsImages = false;

        // Block Error Messages
        if (this.nativeContainer.find('.questionContainer').length > 1) {
            if (this.nativeContainer.find(".mrErrorText").length > 0) {
                var errors = this.nativeContainer.find(".mrErrorText")[0];
                var qlabel = thisQ.label;
                qlabel.prepend($("<br>"));
                qlabel.prepend(errors);
            }
        }

        $.each(this.inputs, function (i, e) {
            var el = $(e);
            var elType = (el).attr('type');

            // No Text Items
            if (elType == 'text' || elType == 'textarea') return true;

            var label = el.parent().find('label').clone();
            var imgsrc = label.find('img');
            var btnType = (imgsrc.length == 0) ? 'text' : 'default';

            if (btnType == 'text') {
                w = pageLayout.textWidth(label) + 10; // Added Some Padding
                h = pageLayout.textHeight(label) + 10; // Added Some Padding
            } else {
                var usezoom = thisQ.getProperty("rowBtnUseZoom");
                var zoomscale = thisQ.getProperty("zoomScale");
                var defwidth = thisQ.getProperty("rowBtnWidth");
                var defheight = thisQ.getProperty("rowBtnHeight");

                var imageDim = pageLayout.imageDimensions(imgsrc, usezoom, zoomscale, defwidth, defheight);
                w = imageDim.width;
                h = imageDim.height;
                imgsrc.remove();
                if (thisQ.rowContainsImages == false) thisQ.rowContainsImages = true;
            }

            maxWidth = (w>maxWidth?w:maxWidth);
            maxHeight = (h>maxHeight?h:maxHeight);

            // Create the row array
            rowArray.push(
                {	id: el.attr('value'),
                    label: label.html(),  // this gets the styles from the html
                    description: label.text(),  // just grab the text for tooltip purposes
                    image: imgsrc.attr('src'),
                    type: btnType,
                    width: w,
                    height: h,
                    useZoom: thisQ.getProperty("rowBtnUseZoom") == true,
                    useTooltip: thisQ.getProperty("rowBtnUseTooltip") == true,
                    zoomIcon: surveyPage.options.zoomIcon,
                    isRadio: ((elType=="radio" || el.attr('isexclusive')=="true") ? true : false)
                }
            );

            // Radio Check only Allowed on Last Item in Array
            if (el.attr('isexclusive')=="true") {
                if (thisQ.maxVal > 1 && thisQ.inputs.length == i + 1) {
                    rowArray[rowArray.length-1].type = 'radiocheck';
                    thisQ.radiocheck = true;
                }
            }
        });

        // resize any items to max height/width get them to match
        $.each(rowArray, function(i, e) {
            e.width = maxWidth;
            e.height = maxHeight;
        });

        this.rowMaxWidth = maxWidth;
        this.rowMaxHeight = maxHeight;

        // Bucket (dropZone) Setup Image
        if (thisQ.getProperty("uselabelimgdropzone") == true) {
            var bucketImg = thisQ.label.find('img');
            if (bucketImg.length > 0) {

                bucketImg = $(bucketImg[0]);

                var usezoom = thisQ.getProperty("rowBtnUseZoom");
                var zoomscale = thisQ.getProperty("zoomScale");
                var defwidth = thisQ.getProperty("rowBtnWidth");
                var defheight = thisQ.getProperty("rowBtnHeight");

                var bucketImgSize = pageLayout.imageDimensions(bucketImg, usezoom, zoomscale, defwidth, defheight);

                this.bucketImage = bucketImg.attr('src');
                this.bucketImgWidth = bucketImgSize.width;
                this.bucketImgHeight = bucketImgSize.height;
                this.bucketImageZoom = thisQ.getProperty("rowBtnUseZoom") == true;
                bucketImg.remove();
            }
        }

        this.component = new ClicknFly();
        this.component.rowArray(rowArray);
        this.component.baseTool="clicknfly";
        this.setRuntimeProps();
        this.component.params(this.params());
        this.deferred.resolve();
}
clickandfly.prototype.setRuntimeProps = function () {

    if (this.nativeContainer.find('.questionContainer').length != 0) {
        if (!this.customProps.hasOwnProperty("compQuestionType")) this.options.compQuestionType = 'Single Choice';
    } else {
        if (!this.customProps.hasOwnProperty("compQuestionType")) this.options.compQuestionType = (this.maxVal == 1) ? 'Single Choice' : 'Multiple Choice';
    }

    // Bucket Image Values
    if (!this.customProps.hasOwnProperty("bucketImageWidth")) this.options.bucketImageWidth = 0
    if (!this.customProps.hasOwnProperty("bucketShowImage")) this.options.bucketShowImage = (this.bucketImage == undefined) ? false : true;
    if (this.options.bucketShowImage == true) {
        if (!this.customProps.hasOwnProperty("bucketImageImp")) this.options.bucketImageImp = this.bucketImage;
        if (!this.customProps.hasOwnProperty("bucketImageWidth")) this.options.bucketImageWidth = this.bucketImgWidth;
        if (!this.customProps.hasOwnProperty("bucketImageUseZoom")) this.options.bucketImageUseZoom = this.bucketImageZoom;
    }

    if (this.options.compQuestionType == 'Single Choice') {
        if (this.nativeContainer.find('.questionContainer').length != 0) {
            if (!this.customProps.hasOwnProperty("rowContainNumRowPerCol")) this.options.rowContainNumRowPerCol = Math.ceil(this.inputs.length / this.nativeContainer.find('.questionContainer').length)  // Each Question Must be a row
        } else {
            if (!this.customProps.hasOwnProperty("rowContainNumRowPerCol")) this.options.rowContainNumRowPerCol = this.inputs.length; // Set as single column
        }
    } else {
        var numberElms = (this.radiocheck == true ) ? this.inputs.length - 1 : this.inputs.length;
        var maxBucketWidth = this.options.rowContainWidth;
        var rows = Math.ceil(((this.rowMaxWidth + (this.options.rowBtnPadding * 2)) * numberElms) / (maxBucketWidth - 125));
        rows = (rows <= 0) ? rows = 1 : rows;

        if (this.rowContainsImages == true) {
            if (!this.customProps.hasOwnProperty("bucketMultiCropWidth")) this.options.bucketMultiCropWidth = Math.ceil(this.rowMaxWidth * 0.75);
            if (!this.customProps.hasOwnProperty("bucketMultiCropHeight")) this.options.bucketMultiCropHeight = Math.ceil(this.rowMaxHeight * 0.75);
            if (!this.customProps.hasOwnProperty("bucketMultiHeight"))  this.options.bucketMultiHeight = this.rowMaxHeight;
            if (!this.customProps.hasOwnProperty("bucketMultiDropType")) this.options.bucketMultiDropType = 'Crop';
        } else {
            if (!this.customProps.hasOwnProperty("bucketMultiHeight")) this.options.bucketMultiHeight = this.rowMaxHeight + (this.options.rowContainPadding * 2) + (this.options.rowBtnPadding * 2);
            if (!this.customProps.hasOwnProperty("bucketMultiDropType")) this.options.bucketMultiDropType = 'Anchor';
        }

        if (!this.customProps.hasOwnProperty("rowContainNumRowPerCol")) this.options.rowContainNumRowPerCol = rows;

        if (this.options.bucketShowImage == true) {
            if (!this.customProps.hasOwnProperty("bucketMultiAutoWidth")) this.options.bucketMultiAutoWidth = false;
            if (!this.customProps.hasOwnProperty("bucketMultiWidth")) this.options.bucketMultiWidth = maxBucketWidth - (this.options.bucketImageWidth + (this.options.bucketBorderWidth *2) + (this.options.rowBtnBorderWidthUp* 2) + 20);
        } else {
            if (!this.customProps.hasOwnProperty("bucketMultiAutoWidth")) this.options.bucketMultiAutoWidth = true;
        }
        if (!this.customProps.hasOwnProperty("dkRadChckEnable")) this.options.dkRadChckEnable = (this.radiocheck == true) ? true : false;
    }

}
clickandfly.prototype.toolOptions = function() {
        switch(pageLayout.deviceType.toUpperCase()) {
            case "LARGETABLET":
            case "MEDIUMTABLET":
            case "SMALLTABLET":
            case "SMARTPHONETOUCH":
                return  {
                    'rowBtnUseZoom' : false,
                    'rowBtnBckgrndColorDown' : 0xffffff,
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
                    'rowContainBorderColor' : 0x5b5f65,
                    'rowContainBckgrndColor' : 0xf1f1f1,
                    'rowBtnDefaultType' : "Base",
                    'rowBtnBorderStyle' : "solid",
                    'rowBtnBorderRadius' : 12,
                    'rowBtnShowBckgrnd' : true,
                    'rowBtnBckgrndColorUp' : 0xffffff,
                    'rowBtnLabelPlacement' : "bottom",
                    'rowBtnLabelHalign' : "center",
                    'rowBtnLabelFontSize' : 28,
                    'rowBtnLabelHoffset' : 0,
                    'rowBtnLabelVoffset' : 0,
                    'rowBtnLabelColorUp' : 0x5b5f65,
                    'rowBtnLabelColorDown' : 0x5b5f65,
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
                    'zoomOverlayBckgrndColor' : 0x000000,
                    'zoomOverlayAlpha' : 80,
                    'zoomGalleryPadding' : 10,
                    'zoomGalleryHoffset' : 0,
                    'zoomGalleryVoffset' : 0,
                    'compCapValue' : 0,
                    'rowContainHeight' : 768,
                    'tooltipWidth' : 100,
                    'tooltipBorderWidth' : 1,
                    'tooltipBorderColor' : 0xcccccc,
                    'tooltipBckgrndColor' : 0xf8f8f8,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 15,
                    'tooltipFontColor' : 0x000000,
                    'zoomWidth' : 20,
                    'zoomHeight' : 20,
                    'zoomBorderWidth' : 1,
                    'zoomBorderColor' : 0xcccccc,
                    'zoomBckgrndColor' : 0xf5f5f5,
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
                    'rowContainLabelColor' : 0x333333,
                    'rowBtnPadding' : 5,
                    'rowBtnBorderWidthUp' : 2,
                    'rowBtnBorderWidthOver' : 4,
                    'rowBtnBorderWidthDown' : 4,
                    'rowBtnBorderColorUp' : 0xd2d3d5,
                    'rowBtnBorderColorOver' : 0xa6a8ab,
                    'rowBtnBorderColorDown' : 0x9fcc3b,
                    'rowBtnBckgrndColorOver' : 0xffffff,
                    'rowRadShowImp' : false,
                    'rowChkShowImp' : false,
                    'rowBtnLabelOvrWidth' : false,
                    'rowBtnLabelWidth' : 125,
                    'rowBtnLabelColorOver' : 0x5b5f65,
                    'rowBtnLabelOverlayShowBckgrnd' : false,
                    'rowBtnLabelOverlayBckgrndColor' : 0xeeeeee,
                    'rowBtnLabelOverlayPadding' : 5,
                    'rowTxtBtnAdjustHeightType' : "none",
                    'rowRadChckLabelHalign' : "left",
                    'rowRadChckLabelWidth' : 1000,
                    'rowRadChckLabelFontSize' : 15,
                    'rowRadChckLabelColorUp' : 0x555555,
                    'rowRadChckLabelColorOver' : 0x000000,
                    'rowRadChckLabelColorDown' : 0xffffff,
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
                    'rowKntrInputLabelColorUp' : 0x555555,
                    'rowKntrInputLabelColorOver' : 0x000000,
                    'rowKntrInputLabelColorDown' : 0x000000,
                    'rowOtherShowLabel' : false,
                    'rowOtherInputHalign' : "left",
                    'rowOtherInputFontSize' : 12,
                    'rowOtherInputColor' : 0x555555,
                    'rowOtherMsgWidth' : 100,
                    'rowRadChckLabelHoffset' : 0,
                    'rowRadChckLabelVoffset' : 0,
                    'zoomGalleryBorderStyle' : "solid",
                    'zoomGalleryBorderWidth' : 1,
                    'zoomGalleryBorderColor' : 0xcccccc,
                    'bucketHoffset' : 0,
                    'bucketVoffset' : 0,
                    'bucketPrimBckgrndColor' : 0xf2f2f2,
                    'bucketSecBckgrndColor' : 0xf2f2f2,
                    'bucketBorderStyle' : 'Solid',
                    'bucketBorderWidth' : 2,
                    'bucketBorderColor' : 0xd2d3d5,
                    'bucketShowSingleMarker' : false,
                    'bucketMultiContainType' : 'Grow',
                    'dkRadChckLabelHalign' : 'Center',
                    'dkRadChckLabelWidth' : 500
                }
            case "PC":
            case "OTHERDEVICE":
            default:
                return {
                    'rowBtnBckgrndColorDown' : 0xffffff,
                    'rowContainLabel' : "Row Container Label",
                    'rowBtnShowLabel' : true,
                    'rowBtnUseTooltip' : false,
                    'rowContainWidth' : 970,
                    'rowContainType' : "horizontal grid layout",
                    'rowContainPadding' : 5,
                    'rowContainHgap' : 0,
                    'rowContainVgap' : 2,
                    //'bucketMultiHgap' : 0,
                    //'bucketMultiVgap' : 0,
                    'rowContainHoffset' : 0,
                    'rowContainVoffset' : 0,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 0,
                    'rowContainBorderColor' : 0xa6a8ab,
                    'rowContainBckgrndColor' : 0xffffff,
                    'rowBtnDefaultType' : "Base",
                    'rowBtnBorderStyle' : "solid",
                    'rowBtnBorderRadius' : 6,
                    'rowBtnShowBckgrnd' : true,
                    'rowBtnBckgrndColorUp' : 0xffffff,
                    'rowBtnLabelPlacement' : "bottom",
                    'rowBtnLabelHalign' : "center",
                    'rowBtnLabelFontSize' : 18,
                    'rowBtnLabelHoffset' : 0,
                    'rowBtnLabelVoffset' : 0,
                    'rowBtnLabelColorUp' : 0x5b5f65,
                    'rowBtnLabelColorDown' : 0x5b5f65,
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
                    'zoomOverlayBckgrndColor' : 0x000000,
                    'zoomOverlayAlpha' : 80,
                    'zoomGalleryPadding' : 10,
                    'zoomGalleryHoffset' : 0,
                    'zoomGalleryVoffset' : 0,
                    'compCapValue' : 0,
                    'rowContainHeight' : 500,
                    'tooltipWidth' : 150,
                    'tooltipBorderWidth' : 2,
                    'tooltipBorderColor' : 0xa6a8ab,
                    'tooltipBckgrndColor' : 0xffffff,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 18,
                    'tooltipFontColor' : 0x5b5f65,
                    'zoomWidth' : 20,
                    'zoomHeight' : 20,
                    'zoomBorderWidth' : 1,
                    'zoomBorderColor' : 0xa6a8ab,
                    'zoomBckgrndColor' : 0xffffff,
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
                    'rowContainLabelColor' : 0x5b5f65,
                    'rowBtnPadding' : 10,
                    'rowBtnBorderWidthUp' : 2,
                    'rowBtnBorderWidthOver' : 4,
                    'rowBtnBorderWidthDown' : 4,
                    'rowBtnBorderColorUp' : 0xd2d3d5,
                    'rowBtnBorderColorOver' : 0xa6a8ab,
                    'rowBtnBorderColorDown' : 0x9fcc3b,
                    'rowBtnBckgrndColorOver' : 0xffffff,
                    'rowRadShowImp' : false,
                    'rowChkShowImp' : false,
                    'rowBtnLabelOvrWidth' : false,
                    'rowBtnLabelWidth' : 125,
                    'rowBtnLabelColorOver' : 0x5b5f65,
                    'rowBtnLabelOverlayShowBckgrnd' : false,
                    'rowBtnLabelOverlayBckgrndColor' : 0xffffff,
                    'rowBtnLabelOverlayPadding' : 8,
                    'rowTxtBtnAdjustHeightType' : "none", // TODO - Does not match documented behaviour & appears to be case sensitive
                    'rowRadChckLabelHalign' : "left",
                    'rowRadChckLabelWidth' : 1000,
                    'rowRadChckLabelFontSize' : 18,
                    'rowRadChckLabelColorUp' : 0x5b5f65,
                    'rowRadChckLabelColorOver' : 0x5b5f65,
                    'rowRadChckLabelColorDown' : 0x5b5f65,
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
                    'rowKntrInputLabelColorUp' : 0x555555,
                    'rowKntrInputLabelColorOver' : 0x000000,
                    'rowKntrInputLabelColorDown' : 0x000000,
                    'rowOtherShowLabel' : false,
                    'rowOtherInputHalign' : "left",
                    'rowOtherInputFontSize' : 14,
                    'rowOtherInputColor' : 0x5b5f65,
                    'rowOtherMsgWidth' : 100,
                    'rowRadChckLabelHoffset' : 0,
                    'rowRadChckLabelVoffset' : 0,
                    'zoomGalleryBorderStyle' : "none",
                    'zoomGalleryBorderWidth' : 0,
                    'zoomGalleryBorderColor' : 0xa6a8ab,
                    'bucketHoffset' : 0,
                    'bucketVoffset' : 0,
                    'bucketPrimBckgrndColor' : 0xf2f2f2,
                    'bucketSecBckgrndColor' : 0xf2f2f2,
                    'bucketBorderStyle' : 'Solid',
                    'bucketBorderWidth' : 2,
                    'bucketBorderColor' : 0xd2d3d5,
                    'bucketShowSingleMarker' : false,
                    'bucketMultiContainType' : 'Grow',
                    'dkRadChckLabelHalign' : 'Center',
                    'dkRadChckLabelWidth' : 500
                }
        }
}