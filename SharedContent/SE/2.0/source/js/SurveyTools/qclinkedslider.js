/**
 * qclinkedslider class
 * Inherits from SESurveyTool
 */
function qclinkedslider(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
qclinkedslider.prototype = Object.create(SESurveyTool.prototype);
qclinkedslider.prototype.type = function(){
    return "qclinkedslider";
}
qclinkedslider.prototype.getDependencies = function(){
    return [
        {'type':'script', 'url' : 'https://www.google.com/jsapi'},
        {'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcomponent/LinkedSlider.js'},
        {'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QWidget.js'},
        {'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QContainer.js'},
        {'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QFactory.js'}
    ];
}
qclinkedslider.prototype.setInitialResponses = function (){
    var dimResp = [];
    $.each(this.inputs, function(i,e) {
        var val = $(e).val();
        if ($.isNumeric(val))
            dimResp.push({index:i, input:parseInt(val)});
    });
    this.component.setDimenResp(dimResp);
}
qclinkedslider.prototype.setResponses = function (){
    var response = this.getResponse();
    if (response == null) return;
    this.clearInputs();
    var that = this;
    $.each($(response.Value), function(i,e) {
        console.log(e)
        if (response.hasOwnProperty(e)) {
            that.inputs.filter('input[name='+e+']').val(response[e].rangeValue);
        }
    });
}
qclinkedslider.prototype.build = function(){
        var rowArray = [],
            that = this;

        // Create questions to build
        this.buildArraysFromGrid();

        // Grab the color list from custom props.
        this.chartColorList = this.getProperty("chartColorList");
        if (this.chartColorList != null) this.chartColorList = this.chartColorList.split(',');

        // Build up row array
        $.each(this.subquestions, function (i, e) {
            var label = e.label;
            label.find('span').removeClass('mrQuestionText');
            rowArray.push({
                id: e.inputs[0].name,
                label: label.html(),
                description: label.text(),
                image: e.image
            });

            if (that.chartColorList != null) { // update the slider color based on custom prop
                 rowArray[rowArray.length-1].var2 = parseInt(that.chartColorList[parseInt(e.id)], 16);
            }
        });

        this.component = new LinkedSlider();
        this.component.rowArray(rowArray);
        this.component.baseTool="linkedslider";
        this.setRuntimeProps();
        this.component.params(this.params());
        this.deferred.resolve();
}

qclinkedslider.prototype.render = function() {
    this.deferred = new $.Deferred();
    this.componentContainer = $('<div>');
    this.componentContainer.append(this.label);
    this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
    this.componentContainer.addClass('qcContainer');
    this.nativeContainer.after(this.componentContainer);
    if (pageLayout.showonly)
        this.component.renderSD(this.componentContainer.get(0));
    else
        this.component.renderDC(this.componentContainer.get(0));
    this.nativeContainer.hide();
    this.setInitialResponses();
    this.component.bindGoogleInitCallback(this.deferred.resolve);
    return this.deferred.promise();
}
qclinkedslider.prototype.toolOptions = function() {
        switch(pageLayout.deviceType.toUpperCase()) {
            case "LARGETABLET":
            case "MEDIUMTABLET":
            case "SMALLTABLET":
            case "SMARTPHONETOUCH":
                return  {
                    'rowBtnUseZoom' : false,
                    'rowBtnBckgrndColorDown' : 0xffbd1a,
                    'rowContainLabel' : "Row Container Label",
                    'rowBtnShowLabel' : true,
                    'rowBtnUseTooltip' : false,
                    'rowContainWidth' : 768,
                    'rowContainType' : "horizontal grid layout",
                    'rowContainPadding' : 20,
                    'rowContainHgap' : 20,
                    'rowContainVgap' : 40,
                    'rowContainHoffset' : 0,
                    'rowContainVoffset' : 20,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 0,
                    'rowContainBorderColor' : 0xa6a8ab,
                    'rowContainBckgrndColor' : 0xffffff,
                    'rowBtnDefaultType' : "Text",
                    'rowBtnWidth' : 125,
                    'rowBtnHeight' : 125,
                    'rowBtnBorderStyle' : "solid",
                    'rowBtnBorderRadius' : 0,
                    'rowBtnShowBckgrnd' : false,
                    'rowBtnBckgrndColorUp' : 0xf2f2f2,
                    'rowBtnLabelPlacement' : "bottom",
                    'rowBtnLabelHalign' : "left",
                    'rowBtnLabelFontSize' : 18,
                    'rowBtnLabelHoffset' : 0,
                    'rowBtnLabelVoffset' : 0,
                    'rowBtnLabelColorUp' : 0x5b5f65,
                    'rowBtnLabelColorDown' : 0x5b5f65,
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
                    'zoomOverlayBckgrndColor' : 0x000000,
                    'zoomOverlayAlpha' : 80,
                    'zoomGalleryPadding' : 10,
                    'zoomGalleryHoffset' : 0,
                    'zoomGalleryVoffset' : 0,
                    'zoomCloseImp' : "",
                    'zoomCloseWidth' : 22,
                    'zoomCloseHeight' : 22,
                    'zoomCloseHoffset' : 0,
                    'zoomCloseVoffset' : 0,
                    'rowContainHeight' : 768,
                    'tooltipWidth' : 150,
                    'tooltipBorderWidth' : 2,
                    'tooltipBorderColor' : 0xa6a8ab,
                    'tooltipBckgrndColor' : 0xffffff,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 18,
                    'tooltipFontColor' : 0x5b5f65,
                    'zoomImp' : "",
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
                    'rowBtnBorderWidthUp' : 1,
                    'rowBtnBorderWidthOver' : 1,
                    'rowBtnBorderWidthDown' : 2,
                    'rowBtnBorderColorUp' : 0xa6a8ab,
                    'rowBtnBorderColorOver' : 0x5b5f65,
                    'rowBtnBorderColorDown' : 0x5b5f65,
                    'rowBtnBckgrndColorOver' : 0xa6a8ab,
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
                    'rowBtnLabelColorOver' : 0x5b5f65,
                    'rowBtnLabelOverlayShowBckgrnd' : true,
                    'rowBtnLabelOverlayBckgrndColor' : 0xffffff,
                    'rowBtnLabelOverlayPadding' : 4,
                    'rowTxtBtnAdjustHeightType' : "none",
                    'rowRadChckLabelHalign' : "left",
                    'rowRadChckLabelWidth' : 150,
                    'rowRadChckLabelFontSize' : 18,
                    'rowRadChckLabelColorUp' : 0x5b5f65,
                    'rowRadChckLabelColorOver' : 0x5b5f65,
                    'rowRadChckLabelColorDown' : 0x5b5f65,
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
                    'rowKntrInputLabelVoffset' : 0,
                    'rowKntrInputLabelFontSize' : 18,
                    'rowKntrInputLabelColorUp' : 0x5b5f65,
                    'rowKntrInputLabelColorOver' : 0x5b5f65,
                    'rowKntrInputLabelColorDown' : 0x5b5f65,
                    'rowOtherInputHalign' : "left",
                    'rowOtherInputFontSize' : 16,
                    'rowOtherInputColor' : 0x5b5f65,
                    'rowOtherMsgWidth' : 100,
                    'rowOtherMinVal' : 1,
                    'rowOtherMaxVal' : 100,
                    'rowRadChckLabelHoffset' : 0,
                    'rowRadChckLabelVoffset' : 0,
                    'zoomGalleryBorderStyle' : "none",
                    'zoomGalleryBorderWidth' : 0,
                    'zoomGalleryBorderColor' : 0xa6a8ab,
                    'chartType' : "2D Pie Chart",
                    'rowSldrLabelVoffset' : -18,
                    'compIsMandatory' : false,
                    'compIsAutoNext' : false,
                    'rowSldrDirection' : "horizontal",
                    'rowSldrMaxVal' : 100,
                    'rowSldrPrecVal' : 0,
                    'rowSldrTrackWidth' : 268,
                    'rowSldrTrackHeight' : 18,
                    'rowSldrTrackBorderStyle' : "solid",
                    'rowSldrTrackBorderWidth' : 14,
                    'rowSldrTrackBorderRadius' : 28,
                    'rowSldrTrackBorderColor' : 0xf2f2f2,
                    'rowSldrTrackColor' : 0xd2d3d5,
                    'rowSldrTrackShowImp' : false,
                    'rowSldrTrackImp' : "",
                    'rowSldrShowLabel' : true,
                    'rowSldrLabelHalign' : "left",
                    'rowSldrLabelWidth' : 200,
                    'rowSldrLabelFontSize' : 28,
                    'rowSldrLabelColor' : 0x5b5f65,
                    'rowSldrLabelHoffset' : -10,
                    'rowSldrTickWidth' : 2,
                    'rowSldrTickHeight' : 8,
                    'rowSldrTickColor' : 0xf2f2f2,
                    'rowSldrTickLabCustomCnt' : 5,
                    'rowSldrTickLabWidth' : 80,
                    'rowSldrTickLabOffset' : -94,
                    'rowSldrTickLabFontSize' : 22,
                    'rowSldrTickLabColor' : 0x5b5f65,
                    'rowSldrHndleShowBckgrnd' : true,
                    'rowSldrHndleShowImg' : false,
                    'rowSldrHndleSnapType' : "none",
                    'rowSldrHndleWidth' : 77,
                    'rowSldrHndleHeight' : 105,
                    'rowSldrHndlePadding' : 0,
                    'rowSldrHndleBorderStyle' : "solid",
                    'rowSldrHndleBorderWidth' : 1,
                    'rowSldrHndleBorderRadius' : 0,
                    'rowSldrHndleBorderColorUp' : 0xa6a8ab,
                    'rowSldrHndleColorUp' : 0xf2f2f2,
                    'rowSldrHndleColorDown' : 0xa6a8ab,
                    'rowSldrHndleShowImp' : true,
                    'rowSldrHndleLabDisplay' : true,
                    'rowSldrHndleLabFontSize' : 5,
                    'rowSldrHndleLabFontColor' : 0xffffff,
                    'rowSldrHndleLabInitTxt' : "",
                    'rowSldrHndleLabWidth' : 100,
                    'rowSldrHndleLabHoffset' : 0,
                    'rowSldrHndleLabVoffset' : 20,
                    'rowSldrShowEndImg' : false,
                    'rowSldrImgEndWidth' : 100,
                    'rowSldrImgEndHeight' : 100,
                    'rowSldrImgEndHoffset' : 0,
                    'rowSldrImgEndVoffset' : 0,
                    'chartPosition' : "top",
                    'chartLegendPosition' : "right",
                    'chartSize' : 94,
                    'chartFontSize' : 28,
                    'chartRemainText' : "Remaining",
                    'chartWidth' : 768,
                    'chartHeight' : 435,
                    'chartHoffset' : 0,
                    'chartVoffset' : 0,
                    'rowSldrHndleShowLabelBckgrnd' : false,
                    'rowSldrHndleLabBckgrndColor' : 0xffffff
				}
            case "PC":
            case "OTHERDEVICE":
            default:
                return {
                    'rowBtnUseZoom' : false,
                    'rowBtnBckgrndColorDown' : 0xffbd1a,
                    'rowContainLabel' : "Row Container Label",
                    'rowBtnShowLabel' : true,
                    'rowBtnUseTooltip' : false,
                    'rowContainWidth' : 460,
                    'rowContainType' : "vertical grid layout",
                    'rowContainPadding' : 20,
                    'rowContainHgap' : 0,
                    'rowContainVgap' : 20,
                    'rowContainHoffset' : 0,
                    'rowContainVoffset' : 0,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 0,
                    'rowContainBorderColor' : 0xa6a8ab,
                    'rowContainBckgrndColor' : 0xffffff,
                    'rowBtnDefaultType' : "Text",
                    'rowBtnWidth' : 125,
                    'rowBtnHeight' : 125,
                    'rowBtnBorderStyle' : "solid",
                    'rowBtnBorderRadius' : 0,
                    'rowBtnShowBckgrnd' : false,
                    'rowBtnBckgrndColorUp' : 0xf2f2f2,
                    'rowBtnLabelPlacement' : "bottom",
                    'rowBtnLabelHalign' : "left",
                    'rowBtnLabelFontSize' : 18,
                    'rowBtnLabelHoffset' : 0,
                    'rowBtnLabelVoffset' : 0,
                    'rowBtnLabelColorUp' : 0x5b5f65,
                    'rowBtnLabelColorDown' : 0x5b5f65,
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
                    'zoomOverlayBckgrndColor' : 0x000000,
                    'zoomOverlayAlpha' : 80,
                    'zoomGalleryPadding' : 10,
                    'zoomGalleryHoffset' : 0,
                    'zoomGalleryVoffset' : 0,
                    'zoomCloseImp' : "",
                    'zoomCloseWidth' : 22,
                    'zoomCloseHeight' : 22,
                    'zoomCloseHoffset' : 0,
                    'zoomCloseVoffset' : 0,
                    'rowContainHeight' : 500,
                    'tooltipWidth' : 150,
                    'tooltipBorderWidth' : 2,
                    'tooltipBorderColor' : 0xa6a8ab,
                    'tooltipBckgrndColor' : 0xffffff,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 18,
                    'tooltipFontColor' : 0x5b5f65,
                    'zoomImp' : "",
                    'zoomWidth' : 20,
                    'zoomHeight' : 20,
                    'zoomBorderWidth' : 1,
                    'zoomBorderColor' : 0xa6a8ab,
                    'zoomBckgrndColor' : 0xffffff,
                    'chartType' : "2D Pie Chart",
                    'rowSldrLabelVoffset' : -5,
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
                    'rowBtnPadding' : 5,
                    'rowBtnBorderWidthUp' : 1,
                    'rowBtnBorderWidthOver' : 1,
                    'rowBtnBorderWidthDown' : 2,
                    'rowBtnBorderColorUp' : 0xa6a8ab,
                    'rowBtnBorderColorOver' : 0x5b5f65,
                    'rowBtnBorderColorDown' : 0x5b5f65,
                    'rowBtnBckgrndColorOver' : 0xa6a8ab,
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
                    'rowBtnLabelColorOver' : 0x5b5f65,
                    'rowBtnLabelOverlayShowBckgrnd' : false,
                    'rowBtnLabelOverlayBckgrndColor' : 0xffffff,
                    'rowBtnLabelOverlayPadding' : 5,
                    'rowTxtBtnAdjustHeightType' : "none",
                    'rowRadChckLabelHalign' : "left",
                    'rowRadChckLabelWidth' : 150,
                    'rowRadChckLabelFontSize' : 18,
                    'rowRadChckLabelColorUp' : 0x5b5f65,
                    'rowRadChckLabelColorOver' : 0x5b5f65,
                    'rowRadChckLabelColorDown' : 0x5b5f65,
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
                    'rowKntrInputLabelVoffset' : 0,
                    'rowKntrInputLabelFontSize' : 18,
                    'rowKntrInputLabelColorUp' : 0x5b5f65,
                    'rowKntrInputLabelColorOver' : 0x5b5f65,
                    'rowKntrInputLabelColorDown' : 0x5b5f65,
                    'rowOtherInputHalign' : "left",
                    'rowOtherInputFontSize' : 16,
                    'rowOtherInputColor' : 0x5b5f65,
                    'rowOtherMsgWidth' : 100,
                    'rowOtherMinVal' : 1,
                    'rowOtherMaxVal' : 100,
                    'rowRadChckLabelHoffset' : 0,
                    'rowRadChckLabelVoffset' : 0,
                    'zoomGalleryBorderStyle' : "none",
                    'zoomGalleryBorderWidth' : 0,
                    'zoomGalleryBorderColor' : 0xa6a8ab,
                    'compIsMandatory' : false,
                    'compIsAutoNext' : false,
                    'rowSldrDirection' : "horizontal",
                    'rowSldrMaxVal' : 100,
                    'rowSldrPrecVal' : 0,
                    'rowSldrTrackWidth' : 310,
                    'rowSldrTrackHeight' : 12,
                    'rowSldrTrackBorderStyle' : "solid",
                    'rowSldrTrackBorderWidth' : 8,
                    'rowSldrTrackBorderRadius' : 24,
                    'rowSldrTrackBorderColor' : 0xf2f2f2,
                    'rowSldrTrackColor' : 0xd2d3d5,
                    'rowSldrTrackShowImp' : false,
                    'rowSldrTrackImp' : "",
                    'rowSldrShowLabel' : true,
                    'rowSldrLabelHalign' : "left",
                    'rowSldrLabelWidth' : 200,
                    'rowSldrLabelFontSize' : 18,
                    'rowSldrLabelColor' : 0x5b5f65,
                    'rowSldrLabelHoffset' : -10,
                    'rowSldrTickWidth' : 2,
                    'rowSldrTickHeight' : 7,
                    'rowSldrTickColor' : 0xf2f2f2,
                    'rowSldrTickLabCustomCnt' : 5,
                    'rowSldrTickLabWidth' : 80,
                    'rowSldrTickLabOffset' : -58,
                    'rowSldrTickLabFontSize' : 16,
                    'rowSldrTickLabColor' : 0x5b5f65,
                    'rowSldrHndleShowBckgrnd' : true,
                    'rowSldrHndleShowImg' : true,
                    'rowSldrHndleSnapType' : "none",
                    'rowSldrHndleWidth' : 51,
                    'rowSldrHndleHeight' : 62,
                    'rowSldrHndlePadding' : 0,
                    'rowSldrHndleBorderStyle' : "solid",
                    'rowSldrHndleBorderWidth' : 12,
                    'rowSldrHndleBorderRadius' : 40,
                    'rowSldrHndleBorderColorUp' : 0xf2f2f2,
                    'rowSldrHndleColorUp' : 0xd2d3d5,
                    'rowSldrHndleColorDown' : 0xffffff,
                    'rowSldrHndleShowImp' : true,
                    'rowSldrHndleLabDisplay' : false,
                    'rowSldrHndleLabFontSize' : 5,
                    'rowSldrHndleLabFontColor' : 0xffffff,
                    'rowSldrHndleLabInitTxt' : "",
                    'rowSldrHndleLabWidth' : 100,
                    'rowSldrHndleLabHoffset' : 0,
                    'rowSldrHndleLabVoffset' : 20,
                    'rowSldrShowEndImg' : false,
                    'rowSldrImgEndWidth' : 100,
                    'rowSldrImgEndHeight' : 100,
                    'rowSldrImgEndHoffset' : 0,
                    'rowSldrImgEndVoffset' : 0,
                    'chartPosition' : "right",
                    'chartLegendPosition' : "right",
                    'chartSize' : 94,
                    'chartFontSize' : 18,
                    'chartRemainText' : "Remaining",
                    'chartWidth' : 460,
                    'chartHeight' : 460,
                    'chartHoffset' : 0,
                    'chartVoffset' : 0,
                    'rowSldrHndleShowLabelBckgrnd' : false,
                    'rowSldrHndleLabBckgrndColor' : 0xffffff
                }
        }
}