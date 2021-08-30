/**
 * brandswipe class
 * Inherits from SESurveyTool
 */
function brandswipe(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
brandswipe.prototype = Object.create(SESurveyTool.prototype);
brandswipe.prototype.type = function(){
    return "brandswipe";
}
brandswipe.prototype.getDependencies = function(){
    return [
			{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcomponent/DragnDrop/DragnDrop.js'}
       // {'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcomponent/DragnDrop.js'},
        //{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QFactory.js'},
		//{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QContainer.js'},
		//{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QWidget.js'} 
    ];
}
brandswipe.prototype.setInitialResponses = function (){
    /*var dimResp = [];
    $.each(this.inputs.filter(":checked"), function(i,e) {
		var el = $(e);
        dimResp.push({rowIndex: el.attr("rowid"),rowColIndex:el.attr("colid"), colIndex:el.attr("colid")});
    });
    this.component.setDimenResp(dimResp);*/
}
brandswipe.prototype.setResponses = function (){
    var response = this.getResponse();
    if (response == null) return;
    this.clearInputs(); // need to clear the responses before setting them.
    var that = this;
     
    $.each($(response.Value), function(i,e) {
		if(typeof surveyPlatform=="undefined"){      // This code belongs to Dimensions
			var row = e.split('^');
			var rowId = row[0];
			var resp = row[1];
			rowId=rowId.split("_");
			that.subquestions[rowId[0]].inputs.filter('[value='+resp+']').val($.makeArray(resp));
		}else if(surveyPlatform=="Nfield"){     // This code belongs to Nfield
			var row = e.split('^');
			var rowId = row[0].split('-');
			var resp = row[1];
			resp=resp.split("-");
			rowId1=rowId[1].split("_");
			that.subquestions[rowId1[0]].inputs.filter('[value='+rowId[0]+'-'+resp[1]+']').val($.makeArray(rowId[0]+'-'+resp[1]));
		}
    });
}
brandswipe.prototype.build = function(){
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
			if(typeof surveyPlatform=="undefined"){      // This code belongs to Dimensions
				var rowId = e.id
			}else if(surveyPlatform=="Nfield"){     // This code belongs to Nfield
				var subqid=e.inputs.filter('input[type!=text]').eq(0).attr("value");
				subqid=subqid.split("-");
				var rowId = subqid[0]+'-'+e.id
			}
            label.find('.mrErrorText').remove();
            rowArray.push({

                id: rowId,
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
            //image.remove();
            image.hide();
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
		$("#surveyButtons").hide();
		var that=this;
		setInterval(function(){ 	
		var response = that.getResponse();
		if(that.subquestions.length==response.Value.length)
		 pageLayout.next.click();
		}, 500);
}

brandswipe.prototype.toolOptions = function() {
        $.extend(this.options, eval("this.options."+brandswipe.prototype.type()));
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
                    'rowBtnShowLabel' : false,
                    'rowBtnUseTooltip' : false,
                    'rowContainWidth' : 970,
                    'rowContainType' : "sequential layout",
                    'rowContainPadding' : 30,
                    'rowContainHgap' : 0,
                    'rowContainVgap' : 0,
                    'rowContainHoffset' : 0,
                    'rowContainVoffset' : 440,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 0,
                 //   'rowContainBorderColor' : 0xffffff,
               //    'rowContainBckgrndColor' : 0xffffff,
                    'rowBtnDefaultType' : "Base",
                    'rowBtnWidth' : 200,
                    'rowBtnHeight' : 202,
                    'rowBtnBorderStyle' : "none",
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
                    'colContainHgap' : 100,
                    'colContainVgap' : 10,
                    'colContainHoffset' : 0,
                    'colContainVoffset' : -550,
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
                    'zoomGalleryBorderStyle' : "none",
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
                    'colDzoneGrowAnimation' : "anchor",
                    'colDzoneCropWidth' : 1,
                    'colDzoneCropHeight' : 1,
                    'colDzoneContainHgap' : 0,
                    'colDzoneContainVgap' : 0,
                    'colDzoneContainPadding' : 1000,
                    'colDzoneWidth' : 310,
                    'colDzoneHeight' : 900,
                    'colDzoneShowBckgrnd' : true,
                    'colDzoneBorderStyle' : "none",
                    'colDzoneBorderWidth' : 2,
                    'colDzoneBorderRadius' : 6,
//                    'colDzoneBorderColorUp' : 0xa6a8ab,
//                    'colDzoneBorderColorOver' : 0xa6a8ab,
//                    'colDzoneBckgrndColorUp' : 0xf2f2f2,
//                    'colDzoneBckgrndColorOver' : 0xffffff,
                    'colDzoneShowBckgrndImp' : true,
                    'colDzoneBckgrndImpUp' : "",
                    'colDzoneBckgrndImpOver' : "",
                    'colDzoneShowLabel' : false,
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
                    'colDzoneImgDispType' : "center",
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
//                    'rowBtnBckgrndColorDown' : 0xffffff,
                    'colContainLabel' : "Column Container Label",
                    'rowContainLabel' : "Row Container Label",
                    'rowBtnShowLabel' : false,
                    'rowBtnUseTooltip' : false,
                    'rowContainWidth' : 970,
                    'rowContainType' : "sequential layout",
                    'rowContainPadding' : 30,
                    'rowContainHgap' : 0,
                    'rowContainVgap' : 0,
                    'rowContainHoffset' : 0,
                    'rowContainVoffset' : 0,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 0,
                 //   'rowContainBorderColor' : 0xffffff,
               //    'rowContainBckgrndColor' : 0xffffff,
                    'rowBtnDefaultType' : "Base",
                    'rowBtnWidth' : 200,
                    'rowBtnHeight' : 202,
                    'rowBtnBorderStyle' : "none",
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
                    'colContainHgap' : 100,
                    'colContainVgap' : 10,
                    'colContainHoffset' : 0,
                    'colContainVoffset' : -250,
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
                    'zoomGalleryBorderStyle' : "none",
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
                    'colDzoneGrowAnimation' : "anchor",
                    'colDzoneCropWidth' : 1,
                    'colDzoneCropHeight' : 1,
                    'colDzoneContainHgap' : 0,
                    'colDzoneContainVgap' : 0,
                    'colDzoneContainPadding' : 1000,
                    'colDzoneWidth' : 300,
                    'colDzoneHeight' : 300,
                    'colDzoneShowBckgrnd' : true,
                    'colDzoneBorderStyle' : "none",
                    'colDzoneBorderWidth' : 2,
                    'colDzoneBorderRadius' : 6,
//                    'colDzoneBorderColorUp' : 0xa6a8ab,
//                    'colDzoneBorderColorOver' : 0xa6a8ab,
//                    'colDzoneBckgrndColorUp' : 0xf2f2f2,
//                    'colDzoneBckgrndColorOver' : 0xffffff,
                    'colDzoneShowBckgrndImp' : true,
                    'colDzoneBckgrndImpUp' : "",
                    'colDzoneBckgrndImpOver' : "",
                    'colDzoneShowLabel' : false,
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
                    'colDzoneImgDispType' : "center",
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
                    'rowBtnShowLabel' : false,
                    'rowBtnUseTooltip' : false,
                    'rowContainWidth' : 970,
                    'rowContainType' : "sequential layout",
                    'rowContainPadding' : 30,
                    'rowContainHgap' : 0,
                    'rowContainVgap' : 0,
                    'rowContainHoffset' : 0,
                    'rowContainVoffset' : 100,
                    'rowContainBorderStyle' : "none",
                    'rowContainBorderWidth' : 0,
                 //   'rowContainBorderColor' : 0xffffff,
               //    'rowContainBckgrndColor' : 0xffffff,
                    'rowBtnDefaultType' : "Base",
                    'rowBtnWidth' : 200,
                    'rowBtnHeight' : 202,
                    'rowBtnBorderStyle' : "none",
                    'rowBtnBorderRadius' : 0,
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
                    'colContainHgap' : 100,
                    'colContainVgap' : 10,
                    'colContainHoffset' : 50,
                    'colContainVoffset' : -325,
                    'colContainBorderStyle' : "none",
                    'colContainBorderWidth' : 0,
//                    'colContainBorderColor' : 0xcccccc,
//                    'colContainBckgrndColor' : 0xffffff,
                    'tooltipWidth' : 0,
                    'tooltipBorderWidth' : 0,
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
                    'zoomGalleryBorderStyle' : "none",
                    'zoomGalleryBorderWidth' : 1,
//                    'zoomGalleryBorderColor' : 0xcccccc,
                    'rowBckgrndImpOver' : "",
                    'rowBtnDragAlpha' : 0,
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
                    'colDzoneGrowAnimation' : "none",
                    'colDzoneCropWidth' : 5,
                    'colDzoneCropHeight' : 5,
                    'colDzoneContainHgap' : 0,
                    'colDzoneContainVgap' : 0,
                    'colDzoneContainPadding' : 1000,
                    'colDzoneWidth' : 356,
                    'colDzoneHeight' : 450,
                    'colDzoneShowBckgrnd' : true,
                    'colDzoneBorderStyle' : "none",
                    'colDzoneBorderWidth' : 0,
                    'colDzoneBorderRadius' : 0,
//                    'colDzoneBorderColorUp' : 0xa6a8ab,
//                    'colDzoneBorderColorOver' : 0xa6a8ab,
//                    'colDzoneBckgrndColorUp' : 0xf2f2f2,
//                    'colDzoneBckgrndColorOver' : 0xffffff,
                    'colDzoneShowBckgrndImp' : true,
                    'colDzoneBckgrndImpUp' : "",
                    'colDzoneBckgrndImpOver' : "",
                    'colDzoneShowLabel' : false,
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
                    'colDzoneImgDispType' : "center",
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