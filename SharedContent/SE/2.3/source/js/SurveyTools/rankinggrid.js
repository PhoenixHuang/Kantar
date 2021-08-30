/**
 * rankinggrid class
 * Inherits from SESurveyTool
 */
function rankinggrid(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
rankinggrid.prototype = Object.create(SESurveyTool.prototype);
rankinggrid.prototype.type = function(){
    return "rankinggrid";
}
rankinggrid.prototype.getDependencies = function(){
    return [
        {'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcomponent/DragnDrop.js'},
        //{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QFactory.js'},
		//{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QContainer.js'},
		{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QWidget.js'} 
    ];
}
rankinggrid.prototype.setInitialResponses = function (){
    var dimResp = [];
    $.each(this.inputs.filter("input:text[value!='']"), function(i,e) {
        var el = $(e);
        dimResp.push({rowIndex: el.attr("rowid"), colIndex:el.val()-1});
    });
    this.component.setDimenResp(dimResp);
}
rankinggrid.prototype.setResponses = function (){
    var response = this.getResponse();
    if (response == null) return;
    this.clearInputs(); // need to clear the responses before setting them.
    var that = this;

    $.each($(response.Value), function(i,e) {
        var row = e.split('^');
        var rowId = row[0];
        var resp = row[1];
        var endPos = rowId.lastIndexOf('_');
        if (endPos>0) rowId = rowId.substr(0,endPos);
        that.subquestions[rowId].inputs.val($.makeArray(resp));
    });
}
rankinggrid.prototype.buildArraysFromGrid = function () {
    var that = this;

    // ranking grid headers are just count of iputs
    $.each(this.inputs, function(i, e) {
        that.columnheaders.push({
            'id': String(that.columnheaders.length),
            'label': i
        });
    });

    $.each(this.nativeContainer.find('tr'), function(i, e) {
        var el = $(e);
        if (that.gridorientation === "column") {
            if (i<=0) {// only process first row
                var nextRow = el.next('tr'); // need this for the inputs
                $.each(el.find('td'), function(x, d) {
                    var inputs = nextRow.find('td').eq(x).find('input');
                    that.makeSubQuestion($(d), inputs)
                });
            }
        } else {
            var inputs = $(e).find('input');
            that.makeSubQuestion(el, inputs);
        }
    });
}
rankinggrid.prototype.build = function(){
        var rowArray = [],
            colArray = [],
            that = this;

        // Determine if this is a col or row grid
        var firstRowInput = this.nativeContainer.find('tr:first input');
        if (firstRowInput.length > 0) this.gridorientation = "row"
        else this.gridorientation = "column";

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

        // Grab the top and bottom scale text if any
        this.topscaletext =  this.getProperty("topScaleTxt");
        this.bottomscaletxt = this.getProperty("bottomScaleTxt");

        // Build up column array
        $.each(this.columnheaders, function (i, e) {
            var label = "";
            if (i==0) label = that.topscaletext;
            if (i>=(that.columnheaders.length-1)) label = that.bottomscaletxt;
            colArray.push({
                id: String(parseInt(that.columnheaders[i].id)+1),
                label: label,
                description: label,
                var1: 1
            });
        });

        this.component = new DragnDrop();
        this.component.rowArray(rowArray);
        this.component.columnArray(colArray);
        this.component.baseTool="dragndrop";
        this.setRuntimeProps();
        this.component.params(this.params());
        this.deferred.resolve();
}
rankinggrid.prototype.toolOptions = function() {
        $.extend(this.options, eval("this.options."+rankinggrid.prototype.type()));
		switch(pageLayout.deviceType.toUpperCase()) {
            case "LARGETABLET":
            case "MEDIUMTABLET":
            case "SMALLTABLET":
            case "SMARTPHONETOUCH":
			    if(this.orientation==0||this.orientation==180) 
				return  {
                    'rowBtnUseZoom' : false,
//	                    'rowBtnBckgrndColorDown' : 0xffffff,
                    'rowContainLabel' : "Row Container Label",
                    'rowBtnShowLabel' : true,
                    'rowBtnUseTooltip' : false,
                    'rowContainWidth' : 768,
                    'rowContainType' : "horizontal grid layout",
                    'rowContainPadding' : 0,
                    'rowContainHgap' : -2,
                    'rowContainVgap' : -2,
                    'rowContainHoffset' : 4,
                    'rowContainVoffset' : 0,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 0,
//	                    'rowContainBorderColor' : 0xcccccc,
//	                    'rowContainBckgrndColor' : 0xcccccc,
                    'rowBtnDefaultType' : "Base",
                    'rowBtnWidth' : 125,
                    'rowBtnHeight' : 189,
                    'rowBtnBorderStyle' : "solid",
                    'rowBtnBorderRadius' : 12,
                    'rowBtnShowBckgrnd' : true,
//	                    'rowBtnBckgrndColorUp' : 0xffffff,
                    'rowBtnLabelPlacement' : "bottom overlay",
                    'rowBtnLabelHalign' : "center",
                    'rowBtnLabelFontSize' : 28,
                    'rowBtnLabelHoffset' : 0,
                    'rowBtnLabelVoffset' : 0,
//	                    'rowBtnLabelColorUp' : 0x5b5f65,
//	                    'rowBtnLabelColorDown' : 0xffffff,
                    'rowBtnImgHoffset' : 0,
                    'rowBtnImgVoffset' : -20,
                    'rowShowStamp' : false,
                    'rowStampImp' : "",
                    'rowStampWidth' : 30,
                    'rowStampHeight' : 30,
                    'rowStampHoffset' : 0,
                    'rowStampVoffset' : 0,
                    'rowKantBtnLabelWidth' : 100,
                    'rowZoomHoffset' : 0,
                    'rowZoomVoffset' : 0,
//	                    'zoomOverlayBckgrndColor' : 0x000000,
                    'zoomOverlayAlpha' : 80,
                    'zoomGalleryPadding' : 10,
                    'zoomGalleryHoffset' : 0,
                    'zoomGalleryVoffset' : 0,
                    'rowContainHeight' : 500,
                    'tooltipWidth' : 100,
                    'tooltipBorderWidth' : 1,
//	                    'tooltipBorderColor' : 0xcccccc,
//	                    'tooltipBckgrndColor' : 0xf8f8f8,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 15,
//	                    'tooltipFontColor' : 0x000000,
                    'zoomBorderWidth' : 1,
//	                    'zoomBorderColor' : 0xcccccc,
//	                    'zoomBckgrndColor' : 0xf5f5f5,
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
//	                    'rowContainLabelColor' : 0x333333,
                    'rowBtnPadding' : 10,
                    'rowBtnBorderWidthUp' : 2,
                    'rowBtnBorderWidthOver' : 4,
                    'rowBtnBorderWidthDown' : 0,
//	                    'rowBtnBorderColorUp' : 0xd2d3d5,
//	                    'rowBtnBorderColorOver' : 0x9fcc3b,
//	                    'rowBtnBorderColorDown' : 0xd2d3d5,
//	                    'rowBtnBckgrndColorOver' : 0xffffff,
                    'rowBtnLabelOvrWidth' : false,
                    'rowBtnLabelWidth' : 100,
//	                    'rowBtnLabelColorOver' : 0x5b5f65,
                    'rowBtnLabelOverlayShowBckgrnd' : false,
//	                    'rowBtnLabelOverlayBckgrndColor' : 0xeeeeee,
                    'rowBtnLabelOverlayPadding' : 4,
                    'rowTxtBtnAdjustHeightType' : "none",
                    'rowRadChckLabelHalign' : "left",
                    'rowRadChckLabelWidth' : 100,
                    'rowRadChckLabelFontSize' : 16,
//	                    'rowRadChckLabelColorUp' : 0x555555,
//	                    'rowRadChckLabelColorOver' : 0x000000,
//	                    'rowRadChckLabelColorDown' : 0x000000,
                    'rowBtnMouseOverDownShadow' : false,
                    'rowBtnMouseOverScale' : 100,
                    'rowBtnMouseDownAlpha' : 100,
                    'zoomActionType' : "click append image",
                    'rowRadChckLabelHoffset' : 0,
                    'rowRadChckLabelVoffset' : 0,
                    'zoomGalleryBorderStyle' : "solid",
                    'zoomGalleryBorderWidth' : 1,
//	                    'zoomGalleryBorderColor' : 0xcccccc,
                    'colContainLabel' : "Column Container Label",
                    'rowBckgrndShowImp' : false,
                    'rowBckgrndImpUp' : "",
                    'rowBckgrndImpDown' : "",
                    'colContainType' : "horizontal layout",
                    'colContainWidth' : 768,
                    'colContainHgap' : -2,
                    'colContainVgap' : -2,
                    'colContainHoffset' : 0,
                    'colContainVoffset' : 20,
                    'colContainBorderStyle' : "solid",
                    'colContainBorderWidth' : 0,
//	                    'colContainBorderColor' : 0xffffff,
//	                    'colContainBckgrndColor' : 0xffffff,
                    'colZoomHoffset' : 0,
                    'colZoomVoffset' : 0,
                    'colContainHeight' : 500,
                    'colContainPadding' : 0,
                    'colContainBckgrndDispType' : "none",
                    'colContainImgImport' : "",
                    'colContainImgImportHoffset' : 0,
                    'colContainImgImportVoffset' : 0,
                    'colContainShowLabel' : false,
                    'colContainLabelHalign' : "left",
                    'colContainLabelFontSize' : 18,
                    'colContainLabelPadding' : 5,
//	                    'colContainLabelColor' : 0x333333,
                    'rowBckgrndImpOver' : "",
                    'rowBtnDragAlpha' : 50,
                    'colDzoneDropAnimation' : "crop",
                    'colDzoneGrowAnimation' : "grow all",
                    'colDzoneCropWidth' : 100,
                    'colDzoneCropHeight' : 100,
                    'colDzoneContainHgap' : 0,
                    'colDzoneContainVgap' : 0,
                    'colDzoneContainPadding' : 8,
                    'colDzoneWidth' : 145,
                    'colDzoneHeight' : 125,
                    'colDzoneShowBckgrnd' : true,
                    'colDzoneBorderStyle' : "solid",
                    'colDzoneBorderWidth' : 2,
                    'colDzoneBorderRadius' : 12,
//	                    'colDzoneBorderColorUp' : 0xa6a8ab,
//	                    'colDzoneBorderColorOver' : 0xa6a8ab,
//	                    'colDzoneBckgrndColorUp' : 0xf2f2f2,
//	                    'colDzoneBckgrndColorOver' : 0xffffff,
                    'colDzoneShowBckgrndImp' : false,
                    'colDzoneBckgrndImpUp' : "",
                    'colDzoneBckgrndImpOver' : "",
                    'colDzoneShowLabel' : true,
                    'colDzoneLabPlacement' : "top",
                    'colDzoneLabHalign' : "center",
                    'colDzoneLabHoffset' : 0,
                    'colDzoneLabVoffset' : 0,
                    'colDzoneLabFontSize' : 28,
//	                    'colDzoneLabColorUp' : 0x5b5f65,
//	                    'colDzoneLabColorOver' : 0x5b5f65,
                    'colDzoneLabOverlayShowBckgrnd' : false,
//	                    'colDzoneLabOverlayBckgrndColor' : 0xeeeeee,
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
				else
				return {
                    'rowBtnUseZoom' : false,
//	                    'rowBtnBckgrndColorDown' : 0xffffff,
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
//	                    'rowContainBorderColor' : 0xcccccc,
//	                    'rowContainBckgrndColor' : 0xcccccc,
                    'rowBtnDefaultType' : "Base",
                    'rowBtnWidth' : 60,
                    'rowBtnHeight' : 75,
                    'rowBtnBorderStyle' : "solid",
                    'rowBtnBorderRadius' : 6,
                    'rowBtnShowBckgrnd' : true,
//	                    'rowBtnBckgrndColorUp' : 0xffffff,
                    'rowBtnLabelPlacement' : "bottom overlay",
                    'rowBtnLabelHalign' : "center",
                    'rowBtnLabelFontSize' : 14,
                    'rowBtnLabelHoffset' : 0,
                    'rowBtnLabelVoffset' : 0,
//	                    'rowBtnLabelColorUp' : 0x5b5f65,
//	                    'rowBtnLabelColorDown' : 0x5b5f65,
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
//	                    'zoomOverlayBckgrndColor' : 0x000000,
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
                    'colContainHgap' : 2,
                    'colContainVgap' : 10,
                    'colContainHoffset' : 0,
                    'colContainVoffset' : -10,
                    'colContainBorderStyle' : "solid",
                    'colContainBorderWidth' : 0,
//	                    'colContainBorderColor' : 0xcccccc,
//	                    'colContainBckgrndColor' : 0xffffff,
                    'tooltipWidth' : 100,
                    'tooltipBorderWidth' : 1,
//	                    'tooltipBorderColor' : 0xcccccc,
//	                    'tooltipBckgrndColor' : 0xf8f8f8,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 15,
//	                    'tooltipFontColor' : 0x000000,
                    'colZoomHoffset' : 0,
                    'colZoomVoffset' : 0,
                    'zoomBorderWidth' : 1,
//	                    'zoomBorderColor' : 0xcccccc,
//	                    'zoomBckgrndColor' : 0xf5f5f5,
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
//	                    'rowContainLabelColor' : 0x333333,
                    'rowBtnPadding' : 10,
                    'rowBtnBorderWidthUp' : 2,
                    'rowBtnBorderWidthOver' : 4,
                    'rowBtnBorderWidthDown' : 0,
//	                    'rowBtnBorderColorUp' : 0xd2d3d5,
//	                    'rowBtnBorderColorOver' : 0x9fcc3b,
//	                    'rowBtnBorderColorDown' : 0xd2d3d5,
//	                    'rowBtnBckgrndColorOver' : 0xffffff,
                    'rowBtnLabelOvrWidth' : false,
                    'rowBtnLabelWidth' : 100,
//	                    'rowBtnLabelColorOver' : 0x5b5f65,
                    'rowBtnLabelOverlayShowBckgrnd' : false,
//	                    'rowBtnLabelOverlayBckgrndColor' : 0xeeeeee,
                    'rowBtnLabelOverlayPadding' : 4,
                    'rowTxtBtnAdjustHeightType' : "none",
                    'rowRadChckLabelHalign' : "left",
                    'rowRadChckLabelWidth' : 100,
                    'rowRadChckLabelFontSize' : 16,
//	                    'rowRadChckLabelColorUp' : 0x555555,
//	                    'rowRadChckLabelColorOver' : 0x000000,
//	                    'rowRadChckLabelColorDown' : 0x000000,
                    'rowBtnMouseOverDownShadow' : false,
                    'rowBtnMouseOverScale' : 100,
                    'rowBtnMouseDownAlpha' : 100,
                    'zoomActionType' : "click append image",
                    'rowRadChckLabelHoffset' : 0,
                    'rowRadChckLabelVoffset' : 0,
                    'zoomGalleryBorderStyle' : "solid",
                    'zoomGalleryBorderWidth' : 1,
//	                    'zoomGalleryBorderColor' : 0xcccccc,
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
//	                    'colContainLabelColor' : 0x333333,
                    'colDzoneDropAnimation' : "anchor",
                    'colDzoneGrowAnimation' : "grow all",
                    'colDzoneCropWidth' : 50,
                    'colDzoneCropHeight' : 50,
                    'colDzoneContainHgap' : 0,
                    'colDzoneContainVgap' : 0,
                    'colDzoneContainPadding' : 0,
                    'colDzoneWidth' : 85,
                    'colDzoneHeight' : 85,
                    'colDzoneShowBckgrnd' : true,
                    'colDzoneBorderStyle' : "solid",
                    'colDzoneBorderWidth' : 2,
                    'colDzoneBorderRadius' : 6,
//	                    'colDzoneBorderColorUp' : 0xa6a8ab,
//	                    'colDzoneBorderColorOver' : 0xa6a8ab,
//	                    'colDzoneBckgrndColorUp' : 0xf2f2f2,
//	                    'colDzoneBckgrndColorOver' : 0xffffff,
                    'colDzoneShowBckgrndImp' : false,
                    'colDzoneBckgrndImpUp' : "",
                    'colDzoneBckgrndImpOver' : "",
                    'colDzoneShowLabel' : true,
                    'colDzoneLabPlacement' : "top",
                    'colDzoneLabHalign' : "center",
                    'colDzoneLabHoffset' : 0,
                    'colDzoneLabVoffset' : 0,
                    'colDzoneLabFontSize' : 18,
//	                    'colDzoneLabColorUp' : 0x555555,
//	                    'colDzoneLabColorOver' : 0x000000,
                    'colDzoneLabOverlayShowBckgrnd' : false,
//	                    'colDzoneLabOverlayBckgrndColor' : 0xeeeeee,
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
//	                    'rowBtnBckgrndColorDown' : 0xffffff,
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
//	                    'rowContainBorderColor' : 0xcccccc,
//	                    'rowContainBckgrndColor' : 0xcccccc,
                    'rowBtnDefaultType' : "Base",
                    'rowBtnWidth' : 132,
                    'rowBtnHeight' : 154,
                    'rowBtnBorderStyle' : "solid",
                    'rowBtnBorderRadius' : 6,
                    'rowBtnShowBckgrnd' : true,
//	                    'rowBtnBckgrndColorUp' : 0xffffff,
                    'rowBtnLabelPlacement' : "bottom overlay",
                    'rowBtnLabelHalign' : "center",
                    'rowBtnLabelFontSize' : 18,
                    'rowBtnLabelHoffset' : 0,
                    'rowBtnLabelVoffset' : 0,
//	                    'rowBtnLabelColorUp' : 0x5b5f65,
//	                    'rowBtnLabelColorDown' : 0x5b5f65,
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
//	                    'zoomOverlayBckgrndColor' : 0x000000,
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
//	                    'colContainBorderColor' : 0xcccccc,
//	                    'colContainBckgrndColor' : 0xffffff,
                    'tooltipWidth' : 100,
                    'tooltipBorderWidth' : 1,
//	                    'tooltipBorderColor' : 0xcccccc,
//	                    'tooltipBckgrndColor' : 0xf8f8f8,
                    'tooltipLabelHalign' : "left",
                    'tooltipFontSize' : 15,
//	                    'tooltipFontColor' : 0x000000,
                    'colZoomHoffset' : 0,
                    'colZoomVoffset' : 0,
                    'zoomBorderWidth' : 1,
//	                    'zoomBorderColor' : 0xcccccc,
//	                    'zoomBckgrndColor' : 0xf5f5f5,
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
//	                    'rowContainLabelColor' : 0x333333,
                    'rowBtnPadding' : 10,
                    'rowBtnBorderWidthUp' : 2,
                    'rowBtnBorderWidthOver' : 4,
                    'rowBtnBorderWidthDown' : 0,
//	                    'rowBtnBorderColorUp' : 0xd2d3d5,
//	                    'rowBtnBorderColorOver' : 0x9fcc3b,
//	                    'rowBtnBorderColorDown' : 0xd2d3d5,
//	                    'rowBtnBckgrndColorOver' : 0xffffff,
                    'rowBtnLabelOvrWidth' : false,
                    'rowBtnLabelWidth' : 100,
//	                    'rowBtnLabelColorOver' : 0x5b5f65,
                    'rowBtnLabelOverlayShowBckgrnd' : false,
//	                    'rowBtnLabelOverlayBckgrndColor' : 0xeeeeee,
                    'rowBtnLabelOverlayPadding' : 4,
                    'rowTxtBtnAdjustHeightType' : "none",
                    'rowRadChckLabelHalign' : "left",
                    'rowRadChckLabelWidth' : 100,
                    'rowRadChckLabelFontSize' : 16,
//	                    'rowRadChckLabelColorUp' : 0x555555,
//	                    'rowRadChckLabelColorOver' : 0x000000,
//	                    'rowRadChckLabelColorDown' : 0x000000,
                    'rowBtnMouseOverDownShadow' : false,
                    'rowBtnMouseOverScale' : 100,
                    'rowBtnMouseDownAlpha' : 100,
                    'zoomActionType' : "click append image",
                    'rowRadChckLabelHoffset' : 0,
                    'rowRadChckLabelVoffset' : 0,
                    'zoomGalleryBorderStyle' : "solid",
                    'zoomGalleryBorderWidth' : 1,
//	                    'zoomGalleryBorderColor' : 0xcccccc,
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
//	                    'colContainLabelColor' : 0x333333,
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
//	                    'colDzoneBorderColorUp' : 0xa6a8ab,
//	                    'colDzoneBorderColorOver' : 0xa6a8ab,
//	                    'colDzoneBckgrndColorUp' : 0xf2f2f2,
//	                    'colDzoneBckgrndColorOver' : 0xffffff,
                    'colDzoneShowBckgrndImp' : false,
                    'colDzoneBckgrndImpUp' : "",
                    'colDzoneBckgrndImpOver' : "",
                    'colDzoneShowLabel' : true,
                    'colDzoneLabPlacement' : "top",
                    'colDzoneLabHalign' : "center",
                    'colDzoneLabHoffset' : 0,
                    'colDzoneLabVoffset' : 0,
                    'colDzoneLabFontSize' : 18,
//	                    'colDzoneLabColorUp' : 0x555555,
//	                    'colDzoneLabColorOver' : 0x000000,
                    'colDzoneLabOverlayShowBckgrnd' : false,
//	                    'colDzoneLabOverlayBckgrndColor' : 0xeeeeee,
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