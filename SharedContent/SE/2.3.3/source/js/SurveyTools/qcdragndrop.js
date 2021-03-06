/**
 * qcdragndrop class
 * Inherits from SESurveyTool
 */
function qcdragndrop(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
qcdragndrop.prototype = Object.create(SESurveyTool.prototype);
qcdragndrop.prototype.type = function(){
    return "qcdragndrop";
}
qcdragndrop.prototype.getDependencies = function(){
    return [
        {'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcomponent/DragnDrop.js'},
        //{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QFactory.js'},
		//{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QContainer.js'},
		{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QWidget.js'} 
    ];
}
qcdragndrop.prototype.setInitialResponses = function (){
    var dimResp = [];
    $.each(this.inputs.filter(":checked"), function(i,e) {
		var el = $(e);
        dimResp.push({rowIndex: el.attr("rowid"),rowColIndex:el.attr("colid"), colIndex:el.attr("colid")});
    });
    this.component.setDimenResp(dimResp);
}
qcdragndrop.prototype.setResponses = function (){
    var response = this.getResponse();
    if (response == null) return;
    this.clearInputs(); // need to clear the responses before setting them.
    var that = this;
     
    $.each($(response.Value), function(i,e) {
		var row = e.split('^');
        var rowId = row[0];
        var resp = row[1];
		rowId=rowId.split("_");
        that.subquestions[rowId[0]].inputs.filter('[value='+resp+']').val($.makeArray(resp));
		
    });
}
qcdragndrop.prototype.build = function(){
            var rowArray = [],
            colArray = [],
            that = this;

        // Create questions and columns to build
        this.buildArraysFromGrid();

        // Build up row array
        $.each(this.subquestions, function (i, e) {
            var label = e.label;
            label.find('span').removeClass('mrQuestionText');
			label.find("span").removeClass('mrSingleText');
            label.find("span").removeClass('mrMultipleText');
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
            //label.find("span").toggleClass('mrQuestionText mrSingle');
            label.find('span').removeClass('mrQuestionText');
			label.find("span").removeClass('mrSingleText');
            label.find("span").removeClass('mrMultipleText');
			label.find("span").attr('style','');

            var image = label.find('img');
            image.remove();

            label.find('.mrErrorText').remove();

            // TODO: Check for json property that we add for this as well
            var exclusiveBucket = $(that.subquestions[0].inputs[i]).attr("isexclusive") == "true";			
			colArray.push({
                id: $(that.subquestions[0].inputs[i]).val(),
                label: label.html(),
                description: label.text(),
                image: image.attr('src'),
                var1: ((exclusiveBucket) ? 1 : null)
            });
        });

        this.component = new DragnDrop();
        this.component.rowArray(rowArray);
        this.component.columnArray(colArray);
        this.component.baseTool="dragndrop";
        this.setRuntimeProps();
        this.component.params(this.params());
         $(".ui-widget-overlay").attr("style", "z-index: 99999 !important;");
        this.deferred.resolve();
}

qcdragndrop.prototype.toolOptions = function() {
        $.extend(this.options, eval("this.options."+qcdragndrop.prototype.type()));
		switch(pageLayout.deviceType.toUpperCase()) {
            case "LARGETABLET":
            case "MEDIUMTABLET":
            case "SMALLTABLET":
            case "SMARTPHONETOUCH":
			    if(this.orientation==0||this.orientation==180) 
				return  {
					'compContainPos' : "relative",
					'compRTL' : false,
					'rowContainType' : "horizontal grid layout",
					'rowContainWidth' : 768,
					'rowContainHeight' : 500,
					'rowContainPadding' : 0,
					'rowContainHgap' : -2,
					'rowContainVgap' : -2,
					'rowContainHoffset' : 4,
					'rowContainVoffset' : 0,
					'rowContainBckgrndDispType' : "none",
					'rowContainBorderStyle' : "none",
					'rowContainBorderWidth' : 0,
//					'rowContainBorderColor' : 0xcccccc,
//					'rowContainBckgrndColor' : 0xcccccc,
					'rowContainImgImport' : "",
					'rowContainImgImportHoffset' : 0,
					'rowContainImgImportVoffset' : 0,
					'rowContainShowLabel' : false,
					'rowContainLabel' : "Row Container Label",
					'rowContainLabelHalign' : "left",
					'rowContainLabelFontSize' : 18,
					'rowContainLabelPadding' : 5,
//					'rowContainLabelColor' : 0x333333,
					'rowBtnDefaultType' : "Base",
					'rowBtnWidth' : 125,
					'rowBtnHeight' : 200,
					'rowBtnPadding' : 10,
					'rowBtnShowBckgrnd' : true,
					'rowBtnBorderStyle' : "solid",
					'rowBtnBorderRadius' : 12,
					'rowBtnBorderWidthUp' : 2,
					'rowBtnBorderWidthOver' : 4,
					'rowBtnBorderWidthDown' : 0,
//					'rowBtnBorderColorUp' : 0xd2d3d5,
//					'rowBtnBorderColorOver' : 0x9fcc3b,
//					'rowBtnBorderColorDown' : 0xd2d3d5,
//					'rowBtnBckgrndColorUp' : 0xffffff,
//					'rowBtnBckgrndColorOver' : 0xffffff,
//					'rowBtnBckgrndColorDown' : 0xffffff,
					'rowBckgrndShowImp' : false,
					'rowBckgrndImpUp' : "" ,
					'rowBckgrndImpOver' : "",
					'rowBckgrndImpDown' : "",
					'rowBtnShowLabel' : true,
					'rowBtnLabelOvrWidth' : false,
					'rowBtnLabelPlacement' : "bottom overlay",
					'rowBtnLabelHalign' : "center",
					'rowBtnLabelWidth' : 100,
					'rowBtnLabelHoffset' : 0,
					'rowBtnLabelVoffset' : 0,
					'rowBtnLabelFontSize' : 28,
//					'rowBtnLabelColorUp' : 0x5b5f65,
//					'rowBtnLabelColorOver' : 0x5b5f65,
//					'rowBtnLabelColorDown' : 0x5b5f65,
					'rowBtnLabelOverlayShowBckgrnd' : false,
//					'rowBtnLabelOverlayBckgrndColor' : 0xeeeeee,
					'rowBtnLabelOverlayPadding' : 4,
					'rowBtnImgHoffset' : 0,
					'rowBtnImgVoffset' : 0,
					'rowShowStamp' : false,
					'rowStampImp' : "",
					'rowStampWidth' : 30,
					'rowStampHeight' : 30,
					'rowStampHoffset' : 0,
					'rowStampVoffset' : 0,
					'rowTxtBtnAdjustHeightType' : "none",
					'rowRadChckLabelHalign' : "left",
					'rowRadChckLabelWidth' : 100,
					'rowRadChckLabelFontSize' : 16,
//					'rowRadChckLabelColorUp' : 0x555555,
//					'rowRadChckLabelColorOver' : 0x000000,
//					'rowRadChckLabelColorDown' : 0x000000,
					'rowBtnMouseOverDownShadow' : false,
					'rowBtnMouseOverScale' : 100,
					'rowBtnDragAlpha' : 50,
					'rowBtnMouseDownAlpha' : 100,
					'colContainType' : "horizontal layout",
					'colContainWidth' : 768,
					'colContainHeight' : 500,
					'colContainPadding' : 0,
					'colContainHgap' : -2,
					'colContainVgap' : -2,
					'colContainHoffset' : 0,
					'colContainVoffset' : 20,
					'colContainBckgrndDispType' : "none",
					'colContainBorderStyle' : "solid",
					'colContainBorderWidth' : 0,
//					'colContainBorderColor' : 0xffffff,
//					'colContainBckgrndColor' : 0xffffff,
					'colContainImgImport' : "",
					'colContainImgImportHoffset' : 0,
					'colContainImgImportVoffset' : 0,
					'colContainShowLabel' : false,
					'colContainLabel' : "Column Container Label",
					'colContainLabelHalign' : "left",
					'colContainLabelFontSize' : 18,
					'colContainLabelPadding' : 5,
//					'colContainLabelColor' : 0x333333,
                    'colDzoneDropAnimation' : "crop",
                    'colDzoneGrowAnimation' : "grow all",
					'colDzoneCropWidth' : 64,
					'colDzoneCropHeight' : 63,
					'colDzoneContainHgap' : 0,
					'colDzoneContainVgap' : 0,
					'colDzoneContainPadding' : 0,
					'colDzoneWidth' : 145,
					'colDzoneHeight' : 215,
					'colDzoneShowBckgrnd' : true,
					'colDzoneBorderStyle' : "solid",
					'colDzoneBorderWidth' : 2,
					'colDzoneBorderRadius' : 12,
//					'colDzoneBorderColorUp' : 0xa6a8ab,
//					'colDzoneBorderColorOver' : 0xa6a8ab,
//					'colDzoneBckgrndColorUp' : 0xf2f2f2,
//					'colDzoneBckgrndColorOver' : 0xffffff,
					'colDzoneShowBckgrndImp' : false,
					'colDzoneBckgrndImpUp' : "",
					'colDzoneBckgrndImpOver' : "",
					'colDzoneShowLabel' : true,
					'colDzoneLabPlacement' : "top",
					'colDzoneLabHalign' : "center",
					'colDzoneLabHoffset' : 0,
					'colDzoneLabVoffset' : 0,
					'colDzoneLabFontSize' : 28,
//					'colDzoneLabColorUp' : 0x5b5f65,
//					'colDzoneLabColorOver' : 0x5b5f65,
					'colDzoneLabOverlayShowBckgrnd' : false,
//					'colDzoneLabOverlayBckgrndColor' : 0xeeeeee,
					'colDzoneLabOverlayPadding' : 5,
					'colDzoneLabOverlayValign' : "center",
					'colDzoneLabOverlaySyncHeight' : true,
					'colDzoneImgDispType' : "none",
					'colDzoneImgWidth' : 150,
					'colDzoneImgPadding' : 10,
					'colDzoneImgHoffset' : 0,
					'colDzoneImgVoffset' : 0,
					'rowBtnUseTooltip' : false,
					'colDzoneUseTooltip' : false,
					'tooltipWidth' : 100,
					'tooltipLabelHalign' : "left",
					'tooltipFontSize' : 15,
//					'tooltipFontColor' : 0x000000,
					'zoomActionType' : "click append image",
					'rowBtnUseZoom' : false,
					'rowZoomHoffset' : 0,
					'rowZoomVoffset' : 0,
					'colDzoneUseZoom' : false,
					'colZoomHoffset' : 0,
					'colZoomVoffset' : 0,
					'rowKantBtnLabelWidth' : 100,
					'rowRadChckLabelHoffset' : 0,
					'rowRadChckLabelVoffset' : 0,
					'tooltipBorderWidth' : 1,
//					'tooltipBorderColor' : 0xcccccc,
//					'tooltipBckgrndColor' : 0xf8f8f8,
//					'zoomOverlayBckgrndColor' : 0x000000,
					'zoomOverlayAlpha' : 80,
					'zoomGalleryPadding' : 10,
					'zoomGalleryHoffset' : 0,
					'zoomGalleryVoffset' : 0,
					'zoomGalleryBorderStyle' : "solid",
					'zoomGalleryBorderWidth' : 1,
//					'zoomGalleryBorderColor' : 0xcccccc,
					'zoomBorderWidth' : 1,
//					'zoomBorderColor' : 0xcccccc,
//					'zoomBckgrndColor' : 0xf5f5f5,
                    'colContainOptValign': "bottom"
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
                    'rowContainType' : "horizontal grid layout",
                    'rowContainPadding' : 20,
                    'rowContainHgap' : 2,
                    'rowContainVgap' : 10,
                    'rowContainHoffset' : 8,
                    'rowContainVoffset' : 0,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 0,
//                    'rowContainBorderColor' : 0xcccccc,
//                    'rowContainBckgrndColor' : 0xcccccc,
                    'rowBtnDefaultType' : "Base",
                    'rowBtnWidth' : 60,
                    'rowBtnHeight' : 75,
                    'rowBtnBorderStyle' : "solid",
                    'rowBtnBorderRadius' : 6,
                    'rowBtnShowBckgrnd' : true,
//                    'rowBtnBckgrndColorUp' : 0xffffff,
                    'rowBtnLabelPlacement' : "bottom overlay",
                    'rowBtnLabelHalign' : "center",
                    'rowBtnLabelFontSize' : 12,
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
                    'rowKantBtnLabelWidth' : 100,
                    'rowZoomHoffset' : 0,
                    'rowZoomVoffset' : 0,
//                    'zoomOverlayBckgrndColor' : 0x000000,
                    'zoomOverlayAlpha' : 80,
                    'zoomGalleryPadding' : 10,
                    'zoomGalleryHoffset' : 0,
                    'zoomGalleryVoffset' : 0,
                    'rowContainHeight' : 500,
                    'rowBckgrndShowImp' : false,
                    'rowBckgrndImpUp' : "",
                    'rowBckgrndImpDown' : "",
                    'colContainType' : "horizontal layout",
                    'colContainWidth' : 768,
                    'colContainHgap' : 10,
                    'colContainVgap' : 10,
                    'colContainHoffset' : 0,
                    'colContainVoffset' : -10,
                    'colContainBorderStyle' : "solid",
                    'colContainBorderWidth' : 0,
//                    'colContainBorderColor' : 0xcccccc,
//                    'colContainBckgrndColor' : 0xffffff,
                    'tooltipWidth' : 100,
                    'tooltipBorderWidth' : 1,
//                    'tooltipBorderColor' : 0xcccccc,
//                    'tooltipBckgrndColor' : 0xf8f8f8,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 15,
//                    'tooltipFontColor' : 0x000000,
                    'colZoomHoffset' : 0,
                    'colZoomVoffset' : 0,
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
                    'rowContainLabelPadding' : 5,
//                    'rowContainLabelColor' : 0x333333,
                    'rowBtnPadding' : 10,
                    'rowBtnBorderWidthUp' : 2,
                    'rowBtnBorderWidthOver' : 4,
                    'rowBtnBorderWidthDown' : 0,
//                    'rowBtnBorderColorUp' : 0xd2d3d5,
//                    'rowBtnBorderColorOver' : 0x9fcc3b,
//                    'rowBtnBorderColorDown' : 0xd2d3d5,
//                    'rowBtnBckgrndColorOver' : 0xffffff,
                    'rowBtnLabelOvrWidth' : false,
                    'rowBtnLabelWidth' : 100,
//                    'rowBtnLabelColorOver' : 0x5b5f65,
                    'rowBtnLabelOverlayShowBckgrnd' : false,
//                    'rowBtnLabelOverlayBckgrndColor' : 0xeeeeee,
                    'rowBtnLabelOverlayPadding' : 4,
                    'rowTxtBtnAdjustHeightType' : "none",
                    'rowRadChckLabelHalign' : "left",
                    'rowRadChckLabelWidth' : 100,
                    'rowRadChckLabelFontSize' : 16,
//                    'rowRadChckLabelColorUp' : 0x555555,
//                    'rowRadChckLabelColorOver' : 0x000000,
//                    'rowRadChckLabelColorDown' : 0x000000,
                    'rowBtnMouseOverDownShadow' : false,
                    'rowBtnMouseOverScale' : 100,
                    'rowBtnMouseDownAlpha' : 100,
                    'zoomActionType' : "click append image",
                    'rowRadChckLabelHoffset' : 0,
                    'rowRadChckLabelVoffset' : 0,
                    'zoomGalleryBorderStyle' : "solid",
                    'zoomGalleryBorderWidth' : 1,
//                    'zoomGalleryBorderColor' : 0xcccccc,
                    'rowBckgrndImpOver' : "",
                    'rowBtnDragAlpha' : 50,
                    'colContainHeight' : 500,
                    'colContainPadding' : 20,
                    'colContainBckgrndDispType' : "none",
                    'colContainImgImport' : "",
                    'colContainImgImportHoffset' : 0,
                    'colContainImgImportVoffset' : 0,
                    'colContainShowLabel' : false,
                    'colContainLabelHalign' : "left",
                    'colContainLabelFontSize' : 18,
                    'colContainLabelPadding' : 5,
//                    'colContainLabelColor' : 0x333333,
                    'colDzoneDropAnimation' : "crop",
                    'colDzoneGrowAnimation' : "grow all",
                    'colDzoneCropWidth' : 50,
                    'colDzoneCropHeight' : 50,
                    'colDzoneContainHgap' : 0,
                    'colDzoneContainVgap' : 0,
                    'colDzoneContainPadding' : 0,
                    'colDzoneWidth' : 115,
                    'colDzoneHeight' : 125,
                    'colDzoneShowBckgrnd' : true,
                    'colDzoneBorderStyle' : "solid",
                    'colDzoneBorderWidth' : 2,
                    'colDzoneBorderRadius' : 6,
//                    'colDzoneBorderColorUp' : 0xa6a8ab,
//                    'colDzoneBorderColorOver' : 0xa6a8ab,
//                    'colDzoneBckgrndColorUp' : 0xf2f2f2,
//                    'colDzoneBckgrndColorOver' : 0xffffff,
                    'colDzoneShowBckgrndImp' : false,
                    'colDzoneBckgrndImpUp' : "",
                    'colDzoneBckgrndImpOver' : "",
                    'colDzoneShowLabel' : true,
                    'colDzoneLabPlacement' : "top",
                    'colDzoneLabHalign' : "center",
                    'colDzoneLabHoffset' : 0,
                    'colDzoneLabVoffset' : -5,
                    'colDzoneLabFontSize' : 18,
//                    'colDzoneLabColorUp' : 0x555555,
//                    'colDzoneLabColorOver' : 0x000000,
                    'colDzoneLabOverlayShowBckgrnd' : false,
//                    'colDzoneLabOverlayBckgrndColor' : 0xeeeeee,
                    'colDzoneLabOverlayPadding' : 5,
                    'colDzoneLabOverlayValign' : "center",
                    'colDzoneLabOverlaySyncHeight' : true,
                    'colDzoneImgDispType' : "none",
                    'colDzoneImgWidth' : 150,
                    'colDzoneImgPadding' : 10,
                    'colDzoneImgHoffset' : 0,
                    'colDzoneImgVoffset' : 0,
                    'colDzoneUseTooltip' : false,
                    'colDzoneUseZoom' : false,
                    'colContainOptValign': "bottom"
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
                    'rowContainType' : "horizontal grid layout",
                    'rowContainPadding' : 20,
                    'rowContainHgap' : 10,
                    'rowContainVgap' : 10,
                    'rowContainHoffset' : 8,
                    'rowContainVoffset' : 0,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 0,
//                    'rowContainBorderColor' : 0xcccccc,
//                    'rowContainBckgrndColor' : 0xcccccc,
                    'rowBtnDefaultType' : "Base",
                    'rowBtnWidth' : 132,
                    'rowBtnHeight' : 134,
                    'rowBtnBorderStyle' : "solid",
                    'rowBtnBorderRadius' : 6,
                    'rowBtnShowBckgrnd' : true,
//                    'rowBtnBckgrndColorUp' : 0xffffff,
                    'rowBtnLabelPlacement' : "bottom overlay",
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
                    'rowKantBtnLabelWidth' : 100,
                    'rowZoomHoffset' : 0,
                    'rowZoomVoffset' : 0,
//                    'zoomOverlayBckgrndColor' : 0x000000,
                    'zoomOverlayAlpha' : 80,
                    'zoomGalleryPadding' : 10,
                    'zoomGalleryHoffset' : 0,
                    'zoomGalleryVoffset' : 0,
                    'rowContainHeight' : 500,
                    'rowBckgrndShowImp' : false,
                    'rowBckgrndImpUp' : "",
                    'rowBckgrndImpDown' : "",
                    'colContainType' : "horizontal layout",
                    'colContainWidth' : 970,
                    'colContainHgap' : 10,
                    'colContainVgap' : 10,
                    'colContainHoffset' : 0,
                    'colContainVoffset' : -10,
                    'colContainBorderStyle' : "solid",
                    'colContainBorderWidth' : 0,
//                    'colContainBorderColor' : 0xcccccc,
//                    'colContainBckgrndColor' : 0xffffff,
                    'tooltipWidth' : 100,
                    'tooltipBorderWidth' : 1,
//                    'tooltipBorderColor' : 0xcccccc,
//                    'tooltipBckgrndColor' : 0xf8f8f8,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 15,
//                    'tooltipFontColor' : 0x000000,
                    'colZoomHoffset' : 0,
                    'colZoomVoffset' : 0,
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
                    'rowContainLabelPadding' : 5,
//                    'rowContainLabelColor' : 0x333333,
                    'rowBtnPadding' : 10,
                    'rowBtnBorderWidthUp' : 2,
                    'rowBtnBorderWidthOver' : 4,
                    'rowBtnBorderWidthDown' : 0,
//                    'rowBtnBorderColorUp' : 0xd2d3d5,
//                    'rowBtnBorderColorOver' : 0x9fcc3b,
//                    'rowBtnBorderColorDown' : 0xd2d3d5,
//                    'rowBtnBckgrndColorOver' : 0xffffff,
                    'rowBtnLabelOvrWidth' : false,
                    'rowBtnLabelWidth' : 100,
//                    'rowBtnLabelColorOver' : 0x5b5f65,
                    'rowBtnLabelOverlayShowBckgrnd' : false,
//                    'rowBtnLabelOverlayBckgrndColor' : 0xeeeeee,
                    'rowBtnLabelOverlayPadding' : 4,
                    'rowTxtBtnAdjustHeightType' : "none",
                    'rowRadChckLabelHalign' : "left",
                    'rowRadChckLabelWidth' : 100,
                    'rowRadChckLabelFontSize' : 16,
//                    'rowRadChckLabelColorUp' : 0x555555,
//                    'rowRadChckLabelColorOver' : 0x000000,
//                    'rowRadChckLabelColorDown' : 0x000000,
                    'rowBtnMouseOverDownShadow' : false,
                    'rowBtnMouseOverScale' : 100,
                    'rowBtnMouseDownAlpha' : 100,
                    'zoomActionType' : "click append image",
                    'rowRadChckLabelHoffset' : 0,
                    'rowRadChckLabelVoffset' : 0,
                    'zoomGalleryBorderStyle' : "solid",
                    'zoomGalleryBorderWidth' : 1,
//                    'zoomGalleryBorderColor' : 0xcccccc,
                    'rowBckgrndImpOver' : "",
                    'rowBtnDragAlpha' : 50,
                    'colContainHeight' : 500,
                    'colContainPadding' : 20,
                    'colContainBckgrndDispType' : "none",
                    'colContainImgImport' : "",
                    'colContainImgImportHoffset' : 0,
                    'colContainImgImportVoffset' : 0,
                    'colContainShowLabel' : false,
                    'colContainLabelHalign' : "left",
                    'colContainLabelFontSize' : 18,
                    'colContainLabelPadding' : 5,
//                    'colContainLabelColor' : 0x333333,
                    'colDzoneDropAnimation' : "anchor",
                    'colDzoneGrowAnimation' : "grow all",
                    'colDzoneCropWidth' : 50,
                    'colDzoneCropHeight' : 50,
                    'colDzoneContainHgap' : 0,
                    'colDzoneContainVgap' : 0,
                    'colDzoneContainPadding' : 0,
                    'colDzoneWidth' : 156,
                    'colDzoneHeight' : 180,
                    'colDzoneShowBckgrnd' : true,
                    'colDzoneBorderStyle' : "solid",
                    'colDzoneBorderWidth' : 2,
                    'colDzoneBorderRadius' : 6,
//                    'colDzoneBorderColorUp' : 0xa6a8ab,
//                    'colDzoneBorderColorOver' : 0xa6a8ab,
//                    'colDzoneBckgrndColorUp' : 0xf2f2f2,
//                    'colDzoneBckgrndColorOver' : 0xffffff,
                    'colDzoneShowBckgrndImp' : false,
                    'colDzoneBckgrndImpUp' : "",
                    'colDzoneBckgrndImpOver' : "",
                    'colDzoneShowLabel' : true,
                    'colDzoneLabPlacement' : "top",
                    'colDzoneLabHalign' : "center",
                    'colDzoneLabHoffset' : 0,
                    'colDzoneLabVoffset' : -5,
                    'colDzoneLabFontSize' : 18,
//                    'colDzoneLabColorUp' : 0x555555,
//                    'colDzoneLabColorOver' : 0x000000,
                    'colDzoneLabOverlayShowBckgrnd' : false,
//                    'colDzoneLabOverlayBckgrndColor' : 0xeeeeee,
                    'colDzoneLabOverlayPadding' : 5,
                    'colDzoneLabOverlayValign' : "center",
                    'colDzoneLabOverlaySyncHeight' : true,
                    'colDzoneImgDispType' : "none",
                    'colDzoneImgWidth' : 150,
                    'colDzoneImgPadding' : 10,
                    'colDzoneImgHoffset' : 0,
                    'colDzoneImgVoffset' : 0,
                    'colDzoneUseTooltip' : false,
                    'colDzoneUseZoom' : false,
                    'colContainOptValign': "bottom"
                }
        }
}