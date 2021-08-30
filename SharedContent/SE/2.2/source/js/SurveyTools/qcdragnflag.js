/**
 * qcdragnflag class
 * Inherits from SESurveyTool
 */
function qcdragnflag(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
qcdragnflag.prototype = Object.create(SESurveyTool.prototype);
qcdragnflag.prototype.type = function(){
    return "qcdragnflag";
}
qcdragnflag.prototype.getDependencies = function(){
    return [
        {'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcomponent/DragnFlag.js'},
        //{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QFactory.js'},
		//{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QContainer.js'},
		{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QWidget.js'} 
    ];
}
qcdragnflag.prototype.setInitialResponses = function (){
    console.log("setInitialResponses not implemented for " + this.type());
    return null;
}
qcdragnflag.prototype.setResponses = function (){
    var response = this.getResponse();
    if (response == null) return;
    this.clearInputs();
    var that = this;
    // TODO: Does this work with special responses?
    $.each($(response.Value), function(i, e) {
		var rowid=e.split("_");
        that.inputs.filter('[rowid='+rowid[0]+']').val($.makeArray(that.inputs[response[e].columnValue].value));
    });
}
qcdragnflag.prototype.build = function(){
        var rowArray = [],
            colArray = [],
            that = this;

        // Create questions and columns to build
        this.buildArraysFromGrid();

        // Build up row array
        $.each(this.subquestions, function (i, e) {
            var label = e.label;
            label.find('span').removeClass('mrQuestionText');
            label.find('.mrErrorText').remove();
            rowArray.push({
                id: e.id,
                label: label.html(),
                description: label.text(),
                image: e.image
            });
        });

        // Build up column array
        $.each(this.columnheaders, function (i, e) {
            var label = $(e.label);
            label.find('span').removeClass('mrQuestionText');
            label.find("span").attr('style','');
            label.find('.mrErrorText').remove();
            var image = label.find('img');
            image.remove();
            colArray.push({
                id: $(that.subquestions[0].inputs[i]).val(),
                label: label.html(),
                description: label.text(),
                image: image.attr('src'),
                isRadio: $(that.subquestions[0].inputs[i]).attr('isexclusive') == "true"
            });

            if (colArray[colArray.length-1].isRadio) {
                colArray[colArray.length-1].type = 'radiocheck';  // radio button
            }
        });

        this.component = new DragnFlag();
        this.component.rowArray(rowArray);
        this.component.columnArray(colArray);
        this.component.baseTool="dragnflag";
        this.setRuntimeProps();
        this.component.params(this.params());
        this.deferred.resolve();
}
qcdragnflag.prototype.toolOptions = function() {
        $.extend(this.options, eval("this.options."+qcdragnflag.prototype.type()));
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
                    'rowContainType' : "sequential layout",
                    'rowContainPadding' : 5,
                    'rowContainHgap' : 0,
                    'rowContainVgap' : 0,
                    'rowContainHoffset' : 0,
                    'rowContainVoffset' : 5,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 2,
//                    'rowContainBorderColor' : 0xcccccc,
//                    'rowContainBckgrndColor' : 0xffffff,
                    'rowBtnWidth' : 120,
                    'rowBtnHeight' : 140,
                    'rowBtnBorderStyle' : "solid",
//                    'rowBtnBckgrndColorUp' : 0xffffff,
                    'rowBtnLabelPlacement' : "bottom overlay",
                    'rowBtnLabelHalign' : "center",
                    'rowBtnLabelFontSize' : 22,
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
                    'rowZoomHoffset' : 0,
                    'rowZoomVoffset' : 0,
//                    'zoomOverlayBckgrndColor' : 0x000000,
                    'zoomOverlayAlpha' : 80,
                    'zoomGalleryPadding' : 10,
                    'zoomGalleryHoffset' : 0,
                    'zoomGalleryVoffset' : 0,
                    'rowContainHeight' : 500,
                    'tooltipWidth' : 100,
                    'tooltipBorderWidth' : 1,
//                    'tooltipBorderColor' : 0xcccccc,
//                    'tooltipBckgrndColor' : 0xf8f8f8,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 15,
//                    'tooltipFontColor' : 0x000000,
                    'zoomBorderWidth' : 1,
//                    'zoomBorderColor' : 0xcccccc,
//                    'zoomBckgrndColor' : 0xf5f5f5,
                    'compContainPos' : "relative",
                    'compRTL' : false,
                    'rowContainBckgrndDispType' : "none",
                    'rowContainImgImport' : "",
                    'rowContainImgImportHoffset' : 0,
                    'rowContainImgImportVoffset' : 0,
                    'rowContainShowLabel' : false,
                    'rowContainLabelHalign' : "left",
                    'rowContainLabelFontSize' : 18,
                    'rowContainLabelPadding' : 10,
//                    'rowContainLabelColor' : 0xa6a8ab,
                    'rowBtnPadding' : 10,
                    'rowBtnBorderWidthUp' : 2,
//                    'rowBtnBorderColorUp' : 0xd2d3d5,
//                    'rowBtnBorderColorOver' : 0xa6a8ab,
//                    'rowBtnBorderColorDown' : 0x9fcc3b,
//                    'rowBtnBckgrndColorOver' : 0xffffff,
//                    'rowBtnLabelColorOver' : 0x5b5f65,
                    'rowBtnLabelOverlayShowBckgrnd' : false,
//                    'rowBtnLabelOverlayBckgrndColor' : 0xeeeeee,
                    'rowBtnLabelOverlayPadding' : 10,
                    'zoomActionType' : "click append image",
                    'zoomGalleryBorderStyle' : "solid",
                    'zoomGalleryBorderWidth' : 1,
//                    'zoomGalleryBorderColor' : 0xcccccc,
                    'colSldrMinVal' : 0,
                    'colSldrMaxVal' : 100,
                    'colSldrPrecVal' : 0,
                    'colSldrTrackWidth' : 624,
                    'colSldrTrackHeight' : 18,
                    'colSldrTrackBorderStyle' : "solid",
                    'colSldrTrackBorderWidth' : 14,
                    'colSldrTrackBorderRadius' : 28,
//                    'colSldrTrackBorderColor' : 0xf2f2f2,
//                    'colSldrTrackColor' : 0xd2d3d5,
                    'colSldrTrackShowImp' : false,
                    'colSldrTrackImp' : "",
                    'colSldrTickWidth' : 2,
                    'colSldrTickHeight' : 10,
//                    'colSldrTickColor' : 0xa6a8ab,
                    'colSldrTickLabDispType' : "show all",
                    'colSldrTickLabWidth' : 80,
                    'colSldrTickLabOffset' : 10,
                    'colSldrTickLabFontSize' : 22,
//                    'colSldrTickLabColor' : 0x666666,
                    'colSldrTickLabCustomCnt' : 3,
                    'rowBtnDragAlpha' : 100,
                    'colSldrHoffset' : 0,
                    'colSldrVoffset' : 200,
                    'rowBtnFlagStickBaseHeight' : 40,
                    'rowBtnFlagStickGrowHeight' : 1,
//                    'rowBtnFlagStickCircColor' : 0x5b5f65,
                    'rowBtnShowValueLabel' : true,
                    'rowBtnValLabHalign' : "center",
                    'rowBtnValLabFontSize' : 15,
//                    'rowBtnValLabColor' : 0x5b5f65,
                    'rowBtnSelectAnimType' : "basic",
                    'rowBtnImageAnimWidth' : 116,
                    'rowBtnImageAnimHeight' : 126,
                    'rowBtnPinAnimSize' : 18,
                    'rowBtnValLabDispType' : "none"
				}
			    else
				return {
                    'rowBtnUseZoom' : false,
//                    'rowBtnBckgrndColorDown' : 0xffffff,
                    'rowContainLabel' : "Row Container Label",
                    'rowBtnShowLabel' : true,
                    'rowBtnUseTooltip' : false,
                    'rowContainWidth' : 768,
                    'rowContainType' : "sequential layout",
                    'rowContainPadding' : 20,
                    'rowContainHgap' : 2,
                    'rowContainVgap' : 0,
                    'rowContainHoffset' : 0,
                    'rowContainVoffset' : 5,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 2,
//                    'rowContainBorderColor' : 0xa6a8ab,
//                    'rowContainBckgrndColor' : 0xf2f2f2,
                    'rowBtnWidth' : 60,
                    'rowBtnHeight' : 60,
                    'rowBtnBorderStyle' : "solid",
//                    'rowBtnBckgrndColorUp' : 0xffffff,
                    'rowBtnLabelPlacement' : "bottom",
                    'rowBtnLabelHalign' : "center",
                    'rowBtnLabelFontSize' : 14,
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
                    'rowZoomHoffset' : 0,
                    'rowZoomVoffset' : 0,
//                    'zoomOverlayBckgrndColor' : 0x000000,
                    'zoomOverlayAlpha' : 80,
                    'zoomGalleryPadding' : 10,
                    'zoomGalleryHoffset' : 0,
                    'zoomGalleryVoffset' : 0,
                    'rowContainHeight' : 500,
                    'tooltipWidth' : 150,
                    'tooltipBorderWidth' : 2,
//                    'tooltipBorderColor' : 0xa6a8ab,
//                    'tooltipBckgrndColor' : 0xffffff,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 18,
//                    'tooltipFontColor' : 0x5b5f65,
                    'zoomBorderWidth' : 1,
//                    'zoomBorderColor' : 0xa6a8ab,
//                    'zoomBckgrndColor' : 0xffffff,
                    'colSldrMinVal' : 0,
                    'colSldrMaxVal' : 100,
                    'colSldrPrecVal' : 0,
                    'colSldrTrackWidth' : 620,
                    'colSldrTrackHeight' : 12,
                    'colSldrTrackBorderStyle' : "solid",
                    'colSldrTrackBorderWidth' : 10,
                    'colSldrTrackBorderRadius' : 20,
//                    'colSldrTrackBorderColor' : 0xf2f2f2,
//                    'colSldrTrackColor' : 0xd2d3d5,
                    'colSldrTrackShowImp' : false,
                    'colSldrTrackImp' : "",
                    'colSldrTickWidth' : 2,
                    'colSldrTickHeight' : 7,
//                    'colSldrTickColor' : 0x9fcc3b,
                    'colSldrTickLabDispType' : "show all",
                    'colSldrTickLabWidth' : 80,
                    'colSldrTickLabOffset' : 10,
                    'colSldrTickLabFontSize' : 14,
//                    'colSldrTickLabColor' : 0x5b5f65,
                    'compContainPos' : "relative",
                    'compRTL' : false,
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
//                    'rowBtnBorderColorUp' : 0xd2d3d5,
//                    'rowBtnBorderColorOver' : 0xa6a8ab,
//                    'rowBtnBorderColorDown' : 0x9fcc3b,
//                    'rowBtnBckgrndColorOver' : 0xffffff,
//                    'rowBtnLabelColorOver' : 0x5b5f65,
                    'rowBtnLabelOverlayShowBckgrnd' : false,
//                    'rowBtnLabelOverlayBckgrndColor' : 0xffffff,
                    'rowBtnLabelOverlayPadding' : 4,
                    'zoomActionType' : "click append image",
                    'zoomGalleryBorderStyle' : "none",
                    'zoomGalleryBorderWidth' : 0,
//                    'zoomGalleryBorderColor' : 0xa6a8ab,
                    'rowBtnDragAlpha' : 50,
                    'colSldrHoffset' : 0,
                    'colSldrVoffset' : 75,
                    'colSldrTickLabCustomCnt' : 3,
                    'rowBtnFlagStickBaseHeight' : 30,
                    'rowBtnFlagStickGrowHeight' : 1,
//                    'rowBtnFlagStickCircColor' : 0x5b5f65,
                    'rowBtnShowValueLabel' : true,
                    'rowBtnValLabHalign' : "center",
                    'rowBtnValLabFontSize' : 15,
//                    'rowBtnValLabColor' : 0x5b5f65,
                    'rowBtnSelectAnimType' : "basic",
                    'rowBtnImageAnimWidth' : 55,
                    'rowBtnImageAnimHeight' : 60,
                    'rowBtnPinAnimSize' : 12,
                    'rowBtnValLabDispType' : "none"
                }
			
            case "PC":
            case "OTHERDEVICE":
            default:
                return {
                    'rowBtnUseZoom' : false,
//                    'rowBtnBckgrndColorDown' : 0xffffff,
                    'rowContainLabel' : "Row Container Label",
                    'rowBtnShowLabel' : true,
                    'rowBtnUseTooltip' : false,
                    'rowContainWidth' : 870,
                    'rowContainType' : "horizontal grid layout",
                    'rowContainPadding' : 20,
                    'rowContainHgap' : 0,
                    'rowContainVgap' : 0,
                    'rowContainHoffset' : 0,
                    'rowContainVoffset' : 5,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 2,
//                    'rowContainBorderColor' : 0xa6a8ab,
//                    'rowContainBckgrndColor' : 0xf2f2f2,
                    'rowBtnWidth' : 110,
                    'rowBtnHeight' : 120,
                    'rowBtnBorderStyle' : "solid",
//                    'rowBtnBckgrndColorUp' : 0xffffff,
                    'rowBtnLabelPlacement' : "center",
                    'rowBtnLabelHalign' : "center",
                    'rowBtnLabelFontSize' : 16,
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
                    'rowZoomHoffset' : 0,
                    'rowZoomVoffset' : 0,
//                    'zoomOverlayBckgrndColor' : 0x000000,
                    'zoomOverlayAlpha' : 80,
                    'zoomGalleryPadding' : 10,
                    'zoomGalleryHoffset' : 0,
                    'zoomGalleryVoffset' : 0,
                    'rowContainHeight' : 500,
                    'tooltipWidth' : 150,
                    'tooltipBorderWidth' : 2,
//                    'tooltipBorderColor' : 0xa6a8ab,
//                    'tooltipBckgrndColor' : 0xffffff,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 18,
//                    'tooltipFontColor' : 0x5b5f65,
                    'zoomBorderWidth' : 1,
//                    'zoomBorderColor' : 0xa6a8ab,
//                    'zoomBckgrndColor' : 0xffffff,
                    'colSldrMinVal' : 0,
                    'colSldrMaxVal' : 100,
                    'colSldrPrecVal' : 0,
                    'colSldrTrackWidth' : 770,
                    'colSldrTrackHeight' : 12,
                    'colSldrTrackBorderStyle' : "solid",
                    'colSldrTrackBorderWidth' : 10,
                    'colSldrTrackBorderRadius' : 20,
//                    'colSldrTrackBorderColor' : 0xf2f2f2,
//                    'colSldrTrackColor' : 0xd2d3d5,
                    'colSldrTrackShowImp' : false,
                    'colSldrTrackImp' : "",
                    'colSldrTickWidth' : 2,
                    'colSldrTickHeight' : 7,
//                    'colSldrTickColor' : 0x9fcc3b,
                    'colSldrTickLabDispType' : "show all",
                    'colSldrTickLabWidth' : 80,
                    'colSldrTickLabOffset' : 10,
                    'colSldrTickLabFontSize' : 14,
//                    'colSldrTickLabColor' : 0x5b5f65,
                    'compContainPos' : "relative",
                    'compRTL' : false,
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
//                    'rowBtnBorderColorUp' : 0xd2d3d5,
//                    'rowBtnBorderColorOver' : 0xa6a8ab,
//                    'rowBtnBorderColorDown' : 0x9fcc3b,
//                    'rowBtnBckgrndColorOver' : 0xffffff,
//                    'rowBtnLabelColorOver' : 0x5b5f65,
                    'rowBtnLabelOverlayShowBckgrnd' : false,
//                    'rowBtnLabelOverlayBckgrndColor' : 0xffffff,
                    'rowBtnLabelOverlayPadding' : 4,
                    'zoomActionType' : "click append image",
                    'zoomGalleryBorderStyle' : "none",
                    'zoomGalleryBorderWidth' : 0,
//                    'zoomGalleryBorderColor' : 0xa6a8ab,
                    'rowBtnDragAlpha' : 50,
                    'colSldrHoffset' : 0,
                    'colSldrVoffset' : 120,
                    'colSldrTickLabCustomCnt' : 3,
                    'rowBtnFlagStickBaseHeight' : 40,
                    'rowBtnFlagStickGrowHeight' : 1,
//                    'rowBtnFlagStickCircColor' : 0x5b5f65,
                    'rowBtnShowValueLabel' : true,
                    'rowBtnValLabHalign' : "center",
                    'rowBtnValLabFontSize' : 15,
//                    'rowBtnValLabColor' : 0x5b5f65,
                    'rowBtnSelectAnimType' : "basic",
                    'rowBtnImageAnimWidth' : 55,
                    'rowBtnImageAnimHeight' : 60,
                    'rowBtnPinAnimSize' : 12,
                    'rowBtnValLabDispType' : "none"
                }
        }
}