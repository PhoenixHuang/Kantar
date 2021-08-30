/**
 * qcdragndrop class
 * Inherits from SESurveyTool
 */
function qcdragndrop(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
qcdragndrop.prototype = Object.create(SESurveyTool.prototype);
qcdragndrop.prototype.type = function() {
    return "qcdragndrop";
}
qcdragndrop.prototype.getDependencies = function() {
    return [{
            'type': 'script',
            'url': surveyPage.path + 'lib/qstudio/qcreator/qcomponent/DragnDrop/DragnDrop.js'
        }
        //{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QFactory.js'},
        //{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QContainer.js'},
        //{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QWidget.js'} 
    ];
}
qcdragndrop.prototype.setInitialResponses = function() {

    if (typeof Storage !== "undefined") {
        var data = sessionStorage.getItem(this.questionName);

        if (typeof data != "undefined" && data != null) {
            var rowList = data.split('~');
            var rowListArray = new Array();
            for (var i = 0, l = rowList.length; i < l - 1; i++) {
                var rowListSplit = rowList[i].split('^');
                rowListArray.push(rowListSplit[1]);
            }
            var dimList = new Array();
            $.each(this.inputs.filter(":checked"), function(i, e) {
                var el = $(e);
                dimList.push(el.attr("colid"));
            });
            dimList = dimList.sort(function(a, b){return a-b});
            var dimResp = [];
            for (var i = 0, l = rowListArray.length; i < l; i++) {
                dimResp.push({
                    rowIndex: rowListArray[i],
                    rowColIndex: dimList[i],
                    colIndex: dimList[i]
                });
            }
        } else {
            var dimResp = [];
            $.each(this.inputs.filter(":checked"), function(i, e) {
                var el = $(e);

                dimResp.push({
                    rowIndex: el.attr("rowid"),
                    rowColIndex: el.attr("colid"),
                    colIndex: el.attr("colid")
                });
            });
        }
        this.component.setDimenResp(dimResp);
    } else {
        var dimResp = [];
        $.each(this.inputs.filter(":checked"), function(i, e) {
            var el = $(e);
            dimResp.push({
                rowIndex: el.attr("rowid"),
                rowColIndex: el.attr("colid"),
                colIndex: el.attr("colid")
            });
        });
        this.component.setDimenResp(dimResp);


    }

}
qcdragndrop.prototype.setResponses = function() {

    if (typeof Storage !== "undefined") {
        var response = this.getResponse();

        if (response == null) return;
        this.clearInputs(); // need to clear the responses before setting them.
        var that = this;
        var sessionData = "";
        $.each($(response.Value), function(i, e) {
            if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
                var row = e.split('^');
                var rowId = row[0];
                var resp = row[1];
                rowId = rowId.split("_");
                //alert(resp+"^"+rowId[0]);
                sessionData = sessionData + resp + "^" + rowId[0] + "~";
                that.subquestions[rowId[0]].inputs.filter('[value=' + resp + ']').val($.makeArray(resp));
            } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
                var row = e.split('^');
                var rowId = row[0].split('-');
                var resp = row[1];
                resp = resp.split("-");
                rowId1 = rowId[1].split("_");
                sessionData = sessionData + rowId[0] + '-' + resp[1] + "^" + rowId1[0] + "~";
                that.subquestions[rowId1[0]].inputs.filter('[value=' + rowId[0] + '-' + resp[1] + ']').val($.makeArray(rowId[0] + '-' + resp[1]));
            }
        });

        sessionStorage.setItem(this.questionName, sessionData);
    } else {
        var response = this.getResponse();
        if (response == null) return;
        this.clearInputs(); // need to clear the responses before setting them.
        var that = this;

        $.each($(response.Value), function(i, e) {
            if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
                var row = e.split('^');
                var rowId = row[0];
                var resp = row[1];
                rowId = rowId.split("_");
                that.subquestions[rowId[0]].inputs.filter('[value=' + resp + ']').val($.makeArray(resp));
            } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
                var row = e.split('^');
                var rowId = row[0].split('-');
                var resp = row[1];
                resp = resp.split("-");
                rowId1 = rowId[1].split("_");
                that.subquestions[rowId1[0]].inputs.filter('[value=' + rowId[0] + '-' + resp[1] + ']').val($.makeArray(rowId[0] + '-' + resp[1]));
            }
        });
    }
}
qcdragndrop.prototype.build = function() {
    this.component = new DragnDrop();
    this.finalparams = this.params();

    var rowArray = [],
        colArray = [],
        that = this;

    // Create questions and columns to build
    this.buildArraysFromGrid();

    // Build up row array
    $.each(this.subquestions, function(i, e) {
        var label = e.label;
        label.find('span').removeClass('mrQuestionText');
        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            var rowId = e.id
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            var subqid = e.inputs.filter('input[type!=text]').eq(0).attr("value");
            subqid = subqid.split("-");
            var rowId = subqid[0] + '-' + e.id
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
    $.each(this.columnheaders, function(i, e) {
        var label = $(e.label);
        //label.find("span").toggleClass('mrQuestionText mrSingle');
        label.find('span').removeClass('mrQuestionText');
        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        label.find("span").attr('style', '');

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

    if (this.getProperty("dndCustomSetup") === true) {
        this.autoWidth();

    }

    this.component.rowArray(rowArray);
    this.component.columnArray(colArray);
    this.component.baseTool = "dragndrop";
    this.setRuntimeProps();
    this.component.params(this.finalparams);
    $(".ui-widget-overlay").attr("style", "z-index: 99999 !important;");
    this.deferred.resolve();
}
qcdragndrop.prototype.autoWidth = function() {
    var that = this;	
	var autoparams = {
        rowContainType: "",
        dropType: "BUCKETS",
        rowBtnLabelDropFontShrink: 0,
        colImgType: "",
        rowBtnType: "TEXT",
        useRTL: false
    };

    var autoparams = {
        'compContainPos': "relative",
        'compPrimColumnFontFamily': "Arial, Helvetica, sans-serif",
        'compPrimRowFontFamily': "Arial, Helvetica, sans-serif",
        'compQuestionType': "Single",
        'compRTL': false,
        'rowContainType': "horizontal grid layout",
        'rowContainHeight': 500,
        'rowContainHoffset': 0,
        'rowContainVoffset': 0,
        'rowContainBckgrndDispType': "none",
        'rowContainBorderStyle': "none",
        'rowContainBorderWidth': 0,
        'rowContainBorderColor': 0xcccccc,
        'rowContainBckgrndColor': 0xcccccc,
        'rowContainHgap': 3,
        'rowContainImgImport': "",
        'rowContainImgImportHoffset': 0,
        'rowContainImgImportVoffset': 0,
        'rowContainShowLabel': false,
        'rowContainLabel': "Row Container Label",
        'rowContainLabelHalign': "left",
        'rowContainLabelFontSize': 18,
        'rowContainLabelPadding': 5,
        'rowContainLabelColor': 0x333333,
        'rowContainOptHalign': "left",
        'rowContainOptValign': "top",
        'rowContainVgap': 5,
        'rowBckgrndShowImp': false,
        'rowBckgrndImpUp': "",
        'rowBckgrndImpOver': "",
        'rowBckgrndImpDown': "",
        'rowShowStamp': false,
        'rowStampImp': "",
        'rowStampWidth': 30,
        'rowStampHeight': 30,
        'rowStampHoffset': 0,
        'rowStampVoffset': 0,
        'rowRadChckLabelHalign': "left",
        'rowRadChckLabelWidth': 100,
        'rowRadChckLabelFontSize': 16,
        'rowRadChckLabelColorUp': 0x555555,
        'rowRadChckLabelColorOver': 0x000000,
        'rowRadChckLabelColorDown': 0x000000,
        'rowRadChckLabelHoffset': 0,
        'rowRadChckLabelVoffset': 0,
        'rowBtnDefaultType': "Base",
        'rowBtnPadding': 2,
        'rowBtnShowBckgrnd': true,
        'rowBtnBorderRadius': 6,
        'rowBtnBorderStyle': "solid",
        'rowBtnBorderWidthUp': 2,
        'rowBtnBorderWidthOver': 4,
        'rowBtnBorderWidthDown': 0,
        'rowBtnBorderColorUp': 0xd2d3d5,
        'rowBtnBorderColorOver': 0x9fcc3b,
        'rowBtnBorderColorDown': 0xd2d3d5,
        'rowBtnBckgrndColorUp': 0xffffff,
        'rowBtnBckgrndColorOver': 0xffffff,
        'rowBtnBckgrndColorDown': 0xffffff,
        'rowBtnShowLabel': true,
        'rowBtnLabelOvrWidth': false,
        'rowBtnLabelPlacement': "bottom",
        'rowBtnLabelHalign': "center",
        'rowBtnLabelWidth': 100,
        'rowBtnLabelHoffset': 0,
        'rowBtnLabelVoffset': 0,
        'rowBtnLabelColorUp': 0x5b5f65,
        'rowBtnLabelColorOver': 0x5b5f65,
        'rowBtnLabelColorDown': 0x5b5f65,
		'rowBtnLabelFontSize': 18,
        'rowBtnLabelOverlayShowBckgrnd': false,
        'rowBtnLabelOverlayBckgrndColor': 0xeeeeee,
        'rowBtnLabelOverlayPadding': 4,
        'rowBtnImgHoffset': 0,
        'rowBtnImgVoffset': 0,
        'rowBtnUseZoom': false,
        'rowBtnMouseOverDownShadow': false,
        'rowBtnMouseOverScale': 100,
        'rowBtnDragAlpha': 50,
        'rowBtnUseTooltip': false,
        'colContainType': "horizontal layout",
        'colContainHeight': 500,
        'colContainHoffset': 0,
        'colContainOptHalign': "left",
        'colContainOptValign': "bottom",
        'colContainVgap': 2,
        'colContainBorderStyle': "solid",
        'colContainBorderWidth': 0,
        'colContainBorderColor': 0xffffff,
        'colContainBckgrndColor': 0xffffff,
        'colContainImgImportHoffset': 0,
        'colContainImgImport': "",
        'colContainPadding': 0,
        'colContainShowLabel': false,
        'colContainLabel': "Column Container Label",
        'colContainLabelHalign': "left",
        'colContainLabelFontSize': 18,
        'colContainLabelPadding': 5,
        'colContainLabelColor': 0x333333,
        'colDzoneDropAnimation': "crop",
        'colDzoneGrowAnimation': "grow all",
        'colDzoneBorderRadius': 0,
        'colDzoneBorderColorUp': 0xa6a8ab,
        'colDzoneBorderColorOver': 0xa6a8ab,
        'colDzoneBckgrndColorUp': 0xf2f2f2,
        'colDzoneBckgrndColorOver': 0xffffff,
        'colDzoneShowBckgrndImp': false,
        'colDzoneBckgrndImpUp': "",
        'colDzoneBckgrndImpOver': "",
        'colDzoneContainVgap': 0,
        'colDzoneShowBckgrnd': true,
        'colDzoneShowLabel': true,
        'colDzoneLabPlacement': "top overlay",
        'colDzoneLabHalign': "center",
        'colDzoneLabHoffset': 0,
        'colDzoneLabVoffset': 0,
        'colDzoneLabOverlayShowBckgrnd': true,
        'colDzoneLabOverlayPadding': 5,
        'colDzoneLabOverlayValign': "top",
        'colDzoneLabOverlaySyncHeight': true,
        'colDzoneLabColorUp': 0xffffff,
        'colDzoneLabColorOver': 0xffffff,
        'colDzoneHeight': 115,
        'colDzoneImgDispType': "none",
        'colDzoneImgWidth': 150,
        'colDzoneImgPadding': 10,
        'colDzoneImgHoffset': 0,
        'colDzoneImgVoffset': 0,
        'colDzoneUseTooltip': false,
        'colDzoneUseZoom': false,
        'colRadChckEnable': false,
        'colRadChckImp': "",
        'colRadChckWidth': 30,
        'colRadChckHeight': 30,
        'colRadChckHoffset': 0,
        'colRadChckVoffset': 0,
        'colRadChckLabelHalign': "left",
        'colRadChckLabelWidth': 100,
        'colRadChckLabelFontSize': 18,
        'colRadChckLabelColorUp': 0x5B5F65,
        'colRadChckLabelColorOver': 0x5B5F65,
        'colRadChckLabelColorDown': 0x5B5F65,
        'tooltipWidth': 100,
        'tooltipBorderWidth': 1,
        'tooltipBorderColor': 0xcccccc,
        'tooltipBckgrndColor': 0xf8f8f8,
        'tooltipLabelHalign': "left",
        'tooltipFontSize': 15,
        'tooltipFontColor': 0x000000,
        'zoomOverlayBckgrndColor': 0x000000,
        'zoomOverlayAlpha': 80,
        'zoomGalleryPadding': 10,
        'zoomGalleryHoffset': 0,
        'zoomGalleryVoffset': 0,
        'zoomGalleryBorderStyle': "solid",
        'zoomGalleryBorderWidth': 1,
        'zoomGalleryBorderColor': 0xcccccc,
        'zoomWidth': 20,
        'zoomHeight': 20,
        'zoomCloseWidth': 22,
        'zoomCloseHeight': 22,
        'zoomCloseHoffset': 0,
        'zoomCloseVoffset': 0,
        'zoomBorderWidth': 1,
        'zoomBorderColor': 0xcccccc,
        'zoomBckgrndColor': 0xf5f5f5,
        'zoomActionType': "click append image",
        'rowZoomHoffset': 0,
        'rowZoomVoffset': 0,
        'colZoomHoffset': 0,
        'colZoomVoffset': 0
    };
	
	
	
    switch (pageLayout.deviceType.toUpperCase()) {
        case "LARGETABLET":
        case "MEDIUMTABLET":
        case "SMALLTABLET":
        case "SMARTPHONETOUCH":

            //generic mobile options
            autoparams = $.extend(autoparams, {
                'rowBtnHeight': 80,
                'rowBtnWidth': 80,								
				'rowBtnPadding':2,
				'rowBtnLabelPlacement':"bottom",
				'rowBtnLabelFontSize': 13,
                'rowContainPadding': 0,
                'colContainVoffset': 20,
                'colDzoneLabFontSize': 14,
				'colDzoneLabOverlayBckgrndColor': 0x5b5f65,
				'colDzoneContainPadding':3
            });
			
            if (this.orientation == 0 || this.orientation == 180) {
                //portrait specific setup						
                autoparams = $.extend(autoparams, {
                    'rowContainHoffset': 4,	
                    'colContainHgap': -2,
                    'colDzoneBorderRadius': 12,
                    'colDzoneWidth': (this.getProperty("colDzoneAutoWidth"))?parseInt((that.getProperty("colContainWidth") - 0 - (2 * that.columnheaders.length)) / that.columnheaders.length, 10):145,
				    'colDzoneDropAnimation':"crop",
				    'rowBtnType':"TEXT",
				    'pWidthOffset':0,
				    'colCntMultiplier':2
                });
            } else {
                //landscape specific setup
                autoparams = $.extend(autoparams, {
                    'rowBtnHeight': 80,
                    'rowBtnWidth': 80,
                    'rowContainHoffset': 4,
                    'rowContainPadding': 10,
                    'colContainHgap': 2,
                    'colContainPadding': 20,
                    'colContainVoffset': -10,
                    'colDzoneBorderRadius': 6,
                    'colDzoneWidth': (this.getProperty("colDzoneAutoWidth"))?parseInt((that.getProperty("colContainWidth") - 20 - (6 * that.columnheaders.length)) / that.columnheaders.length, 10):115,
				    'colDzoneDropAnimation':"crop",
				    'rowBtnType':"TEXT",
				    'pWidthOffset':20,
				    'colCntMultiplier':6
                });
				if (that.customProps.hasOwnProperty("dropType")&&that.customProps.dropType.toUpperCase() === "SCALE") {
				  autoparams = $.extend(autoparams, {
                        'colDzoneHeight': 150
                    });
				}
            }
			
			if (that.customProps.hasOwnProperty("dropType")&&that.customProps.dropType.toUpperCase() === "SCALE") {
              
			   autoparams = $.extend(autoparams, {
                    'rowContainWidth': 768,
                    'colContainWidth': 768,
					'colContainHgap': 1,
                    'colDzoneCropWidth': 58,
                    'colDzoneCropHeight': 58,
                    'colDzoneContainPadding': 1,
                    'colDzoneWidth': 66,
					'colContainPadding': 0
                });
			  
            }
			
            break;

        case "PC":
        case "OTHERDEVICE":
        default:
            //generic PC options
            $.extend(autoparams, {
                'rowBtnHeight': 98,
                'rowBtnWidth': 98,
				'rowBtnLabelPlacement':"bottom",
                'rowContainPadding': 20,
                'rowContainHgap': 8,
                'rowContainVgap': 8,
                'rowBtnLabelFontSize': 14,
				'rowBtnPadding':2,
                'rowContainHoffset': 8,
                'colContainHgap': 2,
                'colContainPadding': 20,
                'colContainVoffset': -10,
                'colDzoneContainHgap': 2,
                'colDzoneBorderRadius': 6,
                'colDzoneLabFontSize': 14,
				'colDzoneContainPadding':3,
				'colDzoneLabOverlayBckgrndColor': 0x5b5f65,
                'colDzoneWidth':(this.getProperty("colDzoneAutoWidth"))? parseInt((that.getProperty("colContainWidth") - 40 - (6 * that.columnheaders.length)) / that.columnheaders.length, 10):156,
				'colDzoneDropAnimation':"crop",
				'rowBtnType':"TEXT",
				'pWidthOffset':40,
				'colCntMultiplier':6
            });
			if (that.customProps.hasOwnProperty("dropType")&&that.customProps.dropType.toUpperCase() === "SCALE") {

               autoparams = $.extend(autoparams, {
                    'rowContainWidth': 970,
                    'colContainWidth': 970,
                    'colContainVoffset': 15,
					'colContainPadding': 0,
					'colContainHgap':1,
                    'colDzoneCropWidth': 73,
                    'colDzoneCropHeight': 73,
                    'colDzoneContainPadding': 4,
                    'colDzoneWidth': 86,
                    'colDzoneLabFontSize': 12
                });
            }
    }
	
	if (that.customProps.hasOwnProperty("dropType")&&that.customProps.dropType.toUpperCase() === "SCALE") {
	  autoparams = $.extend(autoparams, {
            'colDzoneLabOverlayBckgrndColor': 0x505050,
            'rowTxtBtnAdjustHeightType': "all",
            'colContainBckgrndDispType': "import",
            'colDzoneShowBckgrnd': false,
            'colDzoneBorderStyle': "none",
            'colDzoneBorderWidthUp': 0,
            'colDzoneBorderWidthOver': 0,
            'rowBtnLabelFontSize': 14,
            'colContainHgap': 1,
            'colDzoneContainHgap': 0,
            'colDzoneContainPadding': 4,
            'colContainImgImportVoffset': 40,
			'colDzoneLabPlacement':'top overlay',
            'colDzoneLabOverlayValign':'top'			
        });
	
	}
	if(this.getProperty("compRTL"))
	var imageRtlExt="_rtl";
	else
	 var imageRtlExt="";
	
	if (that.customProps.hasOwnProperty("dropType")&&that.customProps.dropType.toUpperCase() === "SCALE") {
        if (that.customProps.hasOwnProperty("colImgType")&&that.customProps.colImgType.length > 0) {
            if (pageLayout.deviceType.toUpperCase() === "PC") {
                var imageExt = imageRtlExt + ".png";
            } else {
                var imageExt = "_mobile" + imageRtlExt + ".png";
            }
			var colContainImgImport="";
            if (that.customProps.colImgType.toUpperCase() === "LOVEHATE") {
				colContainImgImport = pageLayout.themePath+'se/images/dnd_scale_bar_affinity' + imageExt;
            } else if (that.customProps.colImgType.toUpperCase()  === "REDBLACK") {
				colContainImgImport = pageLayout.themePath+'se/images/dnd_scale_bar' + imageExt;
            } else if (that.customProps.colImgType.toUpperCase()  === "GREY") {
				colContainImgImport = pageLayout.themePath+'se/images/dnd_scale_bar_grey' + imageExt;
            }
			
			$.extend(autoparams, {
		     'colContainImgImport':colContainImgImport 
		    });
        }        
    }
	
	
	var columnWidth = 0;
	
	var rowBtnWidth = that.customProps.hasOwnProperty("rowBtnWidth")?that.customProps.rowBtnWidth:autoparams.rowBtnWidth//that.getProperty("rowBtnWidth");
    var rowBtnHeight =that.customProps.hasOwnProperty("rowBtnHeight")?that.customProps.rowBtnHeight:autoparams.rowBtnHeight //that.getProperty("rowBtnHeight");
	  
	 //overwrite width if defined in MDD
    $.each(that.customProps, function (key, value) {
        if (key.toLowerCase() === "rowbtnwidth") {
            rowBtnWidth = value;
        } else if (key.toLowerCase() === "rowbtnheight") {
            //only acceptable if using images
            if (that.getProperty("rowBtnType").toUpperCase() === "IMAGES") { rowBtnHeight = value; }
        } else if (key.toLowerCase() === "coldzonewidth") {
            columnWidth = value;
        }
    });
	
	if (columnWidth === 0) {
            columnWidth = parseInt((that.getProperty("colContainWidth") - autoparams.pWidthOffset - (autoparams.colCntMultiplier * that.columnheaders.length)) / that.columnheaders.length, 10);
        }
        var cropWidth = parseInt((columnWidth - 10), 10);
        if (cropWidth > rowBtnWidth) {
            cropWidth = parseInt((columnWidth - 20) / 2, 10);
            if (cropWidth > rowBtnWidth) {
                cropWidth = parseInt((columnWidth - 23) / 3, 10);
                if (cropWidth > rowBtnWidth) {
                    cropWidth = parseInt((columnWidth - 30) / 4, 10);
                }
            }
        }
        var cropHeight = cropWidth;
        if (rowBtnHeight !== rowBtnWidth) {
            cropHeight = Math.ceil(rowBtnHeight * (cropWidth / rowBtnWidth));
            dZoneVgap = parseInt(cropHeight * -0.33, 10);
        } else {
            dZoneVgap = parseInt(cropWidth * -0.33, 10);
        }
        
		
        //create even numbers of better visuals
        if (columnWidth % 2 == 1) { columnWidth--; }
        if (cropWidth % 2 == 1) { cropWidth--; }
        if (dZoneVgap % 2 == 1) { dZoneVgap--; }
        
        //apply settings for text buttons if needed
         if (that.customProps.hasOwnProperty("rowBtnDefaultType") && (that.customProps.rowBtnDefaultType.toLowerCase() === "text")) {
            dZoneVgap=2;
			rowBtnAutoHeight="all";			
        }
		else
		 rowBtnAutoHeight="none";
	    
		
	    
		 $.extend(autoparams, {
		 'colDzoneCropWidth':cropWidth-1,
		 'colDzoneCropHeight':cropHeight-1,
         'colDzoneContainVgap':dZoneVgap,
         'rowTxtBtnAdjustHeightType':rowBtnAutoHeight	 
		 });
	  

    for (var prop in autoparams) {
        this.finalparams.push({
            parameter: prop,
            paramvalue: autoparams[prop]
        })
        for (var i in that.customProps) {
            if (i.toLowerCase() == prop.toLowerCase()) {
                this.finalparams.push({
                    parameter: prop,
                    paramvalue: that.customProps[i]
                })
            }
        }
    }
	
	
    var currFontSize = that.customProps.hasOwnProperty("rowBtnLabelFontSize")?that.customProps.rowBtnLabelFontSize:autoparams.rowBtnLabelFontSize;
	//new property to allow for smaller font-size on dropped options
	if(that.customProps.hasOwnProperty("kntrFontAutoShrink")&& that.customProps.kntrFontAutoShrink===false){
		if (that.customProps.hasOwnProperty("rowBtnLabelDropFontShrink") && that.customProps.rowBtnLabelDropFontShrink > 0) {
			
			var rowBtnDroppedSize = currFontSize - parseInt(this.options.rowBtnLabelDropFontShrink, 10);
			currFontSize = rowBtnDroppedSize;
			if ($.isNumeric(rowBtnDroppedSize)) {
				var styleString = "<style>.qwidget_bucket .qwidget_bucket_widget_wrapper .qwidget_label { font-size: " + rowBtnDroppedSize + "px !important; }</style>";
				$(styleString).appendTo('head');
			}
		}
	}
	else{
    //re-size font in any boxes where the text is too big, and deal with font-sizes and mis-alignment issues
    $(document).on('SurveyEngineEvent', function (e) {

        if (e.eventType === "engine_complete") {
            //remove random dead image things in Firefox
            $('#QColumnContainer .qwidget_image_container .qwidget_image').each(function () {
                if ($(this).width() === 24 && $(this).height() === 24)
                    $(this).remove();
            });
        }  
        		
        if ((e.eventType === "mb_dragged") || (e.eventType === "engine_complete")) {
             
            if (rowBtnDroppedSize >= 10) {
                $('.qwidget_bucket .qwidget_bucket_widget_wrapper .qwidget_label').css('font-size', rowBtnDroppedSize + 'px');
            }			
            
            $('.qwidget_bucket .qwidget_bucket_widget_wrapper .qwidget_label').each(function () {	
                var DLBox = $(this); //dropped label box
                DLBox.css('word-wrap', 'normal'); //remove wrapping
                var maxHeight = DLBox.parent().height();
                var maxWidth = DLBox.parent().parent().width();
                var fontSize = parseInt(DLBox.css("fontSize"), 10);
                var boxHeight = DLBox.parents('.qwidget_background').height();
                var multiplier = 1;

                var initBoxWidth = DLBox.width();
                DLBox.width('auto');
                var boxWidth = DLBox.width();
                DLBox.width(initBoxWidth);

                if (((DLBox.height() >= boxHeight) || (boxWidth > DLBox.parents('.qwidget_background').width())) && (fontSize === currFontSize || (fontSize + 1) === currFontSize)) //+1 issue due to IE returning float
                {
                    multiplier = DLBox.parent().width() / DLBox.width();
					
                    newSize = (fontSize * (multiplier - 0.1));
                    var newStyle = "";
                    var styleArr = DLBox.attr('style').split(';');
                    for (var i = 0; i < styleArr.length; i++) {
                        if (styleArr[i].split(':')[0] !== 'font-size') {
                            newStyle += styleArr[i] + "; ";
                        }
                    }
                    DLBox.attr('style', 'font-size: ' + Math.floor(newSize) + 'px !important;');
                    
					while (DLBox.height() > maxHeight || DLBox.width() > maxWidth) {                       
						newSize -= 1;
                        DLBox.attr('style', 'font-size: ' + newSize + 'px !important;');
                        if (newSize < 8)
                            break;						
                    }
                   
					 if (that.orientation == 90 || that.orientation == -90) 
					 newSize=newSize-1;
					DLBox.attr('style', newStyle + ';font-size: ' + newSize + 'px !important;');

                    //fix left mis-alignment issue if needed
                    DLBox.parents('.qwidget_label_container').css('left', (((initBoxWidth - (DLBox.width())) / 2) + 2) + 'px');
                }
                //fix top mis-alignment (off-center) issue if needed
                DLBox.height('auto');
				DLBox.width(maxWidth);
                var newBoxHeight = ((boxHeight - (DLBox.height() + 1)) / 2);
                if (newBoxHeight > 0) //don't move up
                    DLBox.parents('.qwidget_label_container').css('top', newBoxHeight + 'px');					
            });
            $('.qwidget_bucket .qwidget_bucket_widget_wrapper .qwidget_label').css('word-wrap', 'break-word'); //re-insert in case 7px limit hit

           if (that.customProps.hasOwnProperty("dropType")&&that.customProps.dropType.toUpperCase() === "SCALE") {
                //dynamically move bar to below image based on grey box sizes
                var maxHeight = 0;
                $('.qwidget_bucket .qwidget_label_container .qwidget_label').each(function () {
                    if ($(this).height() > maxHeight)
                        maxHeight = $(this).height();
				});
				
                $('.qlayout_background_image').css('margin-top', maxHeight + 'px');
           }
        }
    });
 }

	
	
}


qcdragndrop.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + qcdragndrop.prototype.type()));
    switch (pageLayout.deviceType.toUpperCase()) {
        case "LARGETABLET":
        case "MEDIUMTABLET":
        case "SMALLTABLET":
        case "SMARTPHONETOUCH":
            if (this.orientation == 0 || this.orientation == 180)
                return {
                    'compContainPos': "relative",
                    'compRTL': false,
                    'rowContainType': "horizontal grid layout",
                    'rowContainWidth': 750,
                    'rowContainHeight': 500,
                    'rowContainPadding': 0,
                    'rowContainHgap': -2,
                    'rowContainVgap': -2,
                    'rowContainHoffset': 4,
                    'rowContainVoffset': 0,
                    'rowContainBckgrndDispType': "none",
                    'rowContainBorderStyle': "none",
                    'rowContainBorderWidth': 0,
                    //					'rowContainBorderColor' : 0xcccccc,
                    //					'rowContainBckgrndColor' : 0xcccccc,
                    'rowContainImgImport': "",
                    'rowContainImgImportHoffset': 0,
                    'rowContainImgImportVoffset': 0,
                    'rowContainShowLabel': false,
                    'rowContainLabel': "Row Container Label",
                    'rowContainLabelHalign': "left",
                    'rowContainLabelFontSize': 18,
                    'rowContainLabelPadding': 5,
                    //					'rowContainLabelColor' : 0x333333,
                    'rowBtnDefaultType': "Base",
                    'rowBtnWidth': 125,
                    'rowBtnHeight': 200,
                    'rowBtnPadding': 10,
                    'rowBtnShowBckgrnd': true,
                    'rowBtnBorderStyle': "solid",
                    'rowBtnBorderRadius': 12,
                    'rowBtnBorderWidthUp': 2,
                    'rowBtnBorderWidthOver': 4,
                    'rowBtnBorderWidthDown': 0,
                    //					'rowBtnBorderColorUp' : 0xd2d3d5,
                    //					'rowBtnBorderColorOver' : 0x9fcc3b,
                    //					'rowBtnBorderColorDown' : 0xd2d3d5,
                    //					'rowBtnBckgrndColorUp' : 0xffffff,
                    //					'rowBtnBckgrndColorOver' : 0xffffff,
                    //					'rowBtnBckgrndColorDown' : 0xffffff,
                    'rowBckgrndShowImp': false,
                    'rowBckgrndImpUp': "",
                    'rowBckgrndImpOver': "",
                    'rowBckgrndImpDown': "",
                    'rowBtnShowLabel': true,
                    'rowBtnLabelOvrWidth': false,
                    'rowBtnLabelPlacement': "bottom overlay",
                    'rowBtnLabelHalign': "center",
                    'rowBtnLabelWidth': 100,
                    'rowBtnLabelHoffset': 0,
                    'rowBtnLabelVoffset': 0,
                    'rowBtnLabelFontSize': 28,
                    //					'rowBtnLabelColorUp' : 0x5b5f65,
                    //					'rowBtnLabelColorOver' : 0x5b5f65,
                    //					'rowBtnLabelColorDown' : 0x5b5f65,
                    'rowBtnLabelOverlayShowBckgrnd': false,
                    //					'rowBtnLabelOverlayBckgrndColor' : 0xeeeeee,
                    'rowBtnLabelOverlayPadding': 4,
                    'rowBtnImgHoffset': 0,
                    'rowBtnImgVoffset': 0,
                    'rowShowStamp': false,
                    'rowStampImp': "",
                    'rowStampWidth': 30,
                    'rowStampHeight': 30,
                    'rowStampHoffset': 0,
                    'rowStampVoffset': 0,
                    'rowTxtBtnAdjustHeightType': "none",
                    'rowRadChckLabelHalign': "left",
                    'rowRadChckLabelWidth': 100,
                    'rowRadChckLabelFontSize': 16,
                    //					'rowRadChckLabelColorUp' : 0x555555,
                    //					'rowRadChckLabelColorOver' : 0x000000,
                    //					'rowRadChckLabelColorDown' : 0x000000,
                    'rowBtnMouseOverDownShadow': false,
                    'rowBtnMouseOverScale': 100,
                    'rowBtnDragAlpha': 50,
                    'rowBtnMouseDownAlpha': 100,
                    'colContainType': "horizontal layout",
                    'colContainWidth': 750,
                    'colContainHeight': 500,
                    'colContainPadding': 0,
                    'colContainHgap': -2,
                    'colContainVgap': -2,
                    'colContainHoffset': 0,
                    'colContainVoffset': 20,
                    'colContainBckgrndDispType': "none",
                    'colContainBorderStyle': "solid",
                    'colContainBorderWidth': 0,
                    //					'colContainBorderColor' : 0xffffff,
                    //					'colContainBckgrndColor' : 0xffffff,
                    'colContainImgImport': "",
                    'colContainImgImportHoffset': 0,
                    'colContainImgImportVoffset': 0,
                    'colContainShowLabel': false,
                    'colContainLabel': "Column Container Label",
                    'colContainLabelHalign': "left",
                    'colContainLabelFontSize': 18,
                    'colContainLabelPadding': 5,
                    //					'colContainLabelColor' : 0x333333,
                    'colDzoneDropAnimation': "crop",
                    'colDzoneGrowAnimation': "grow all",
                    'colDzoneCropWidth': 64,
                    'colDzoneCropHeight': 63,
                    'colDzoneContainHgap': 0,
                    'colDzoneContainVgap': 0,
                    'colDzoneContainPadding': 0,
                    'colDzoneWidth': 145,
                    'colDzoneHeight': 215,
                    'colDzoneShowBckgrnd': true,
                    'colDzoneBorderStyle': "solid",
                    'colDzoneBorderWidth': 2,
                    'colDzoneBorderRadius': 12,
                    //					'colDzoneBorderColorUp' : 0xa6a8ab,
                    //					'colDzoneBorderColorOver' : 0xa6a8ab,
                    //					'colDzoneBckgrndColorUp' : 0xf2f2f2,
                    //					'colDzoneBckgrndColorOver' : 0xffffff,
                    'colDzoneShowBckgrndImp': false,
                    'colDzoneBckgrndImpUp': "",
                    'colDzoneBckgrndImpOver': "",
                    'colDzoneShowLabel': true,
                    'colDzoneLabPlacement': "top",
                    'colDzoneLabHalign': "center",
                    'colDzoneLabHoffset': 0,
                    'colDzoneLabVoffset': 0,
                    'colDzoneLabFontSize': 28,
                    //					'colDzoneLabColorUp' : 0x5b5f65,
                    //					'colDzoneLabColorOver' : 0x5b5f65,
                    'colDzoneLabOverlayShowBckgrnd': false,
                    //					'colDzoneLabOverlayBckgrndColor' : 0xeeeeee,
                    'colDzoneLabOverlayPadding': 5,
                    'colDzoneLabOverlayValign': "center",
                    'colDzoneLabOverlaySyncHeight': true,
                    'colDzoneImgDispType': "none",
                    'colDzoneImgWidth': 150,
                    'colDzoneImgPadding': 10,
                    'colDzoneImgHoffset': 0,
                    'colDzoneImgVoffset': 0,
                    'rowBtnUseTooltip': false,
                    'colDzoneUseTooltip': false,
                    'tooltipWidth': 100,
                    'tooltipLabelHalign': "left",
                    'tooltipFontSize': 15,
                    //					'tooltipFontColor' : 0x000000,
                    'zoomActionType': "click append image",
                    'rowBtnUseZoom': false,
                    'rowZoomHoffset': 0,
                    'rowZoomVoffset': 0,
                    'colDzoneUseZoom': false,
                    'colZoomHoffset': 0,
                    'colZoomVoffset': 0,
                    'rowKantBtnLabelWidth': 100,
                    'rowRadChckLabelHoffset': 0,
                    'rowRadChckLabelVoffset': 0,
                    'tooltipBorderWidth': 1,
                    //					'tooltipBorderColor' : 0xcccccc,
                    //					'tooltipBckgrndColor' : 0xf8f8f8,
                    //					'zoomOverlayBckgrndColor' : 0x000000,
                    'zoomOverlayAlpha': 80,
                    'zoomGalleryPadding': 10,
                    'zoomGalleryHoffset': 0,
                    'zoomGalleryVoffset': 0,
                    'zoomGalleryBorderStyle': "solid",
                    'zoomGalleryBorderWidth': 1,
                    //					'zoomGalleryBorderColor' : 0xcccccc,
                    'zoomBorderWidth': 1,
                    //					'zoomBorderColor' : 0xcccccc,
                    //					'zoomBckgrndColor' : 0xf5f5f5,
                    'colContainOptValign': "bottom",
				    'dndCustomSetup':false,
				    'colDzoneAutoWidth':true
                }
            else
                return {
                    'rowBtnUseZoom': false,
                    //                    'rowBtnBckgrndColorDown' : 0xffffff,
                    'colContainLabel': "Column Container Label",
                    'rowContainLabel': "Row Container Label",
                    'rowBtnShowLabel': true,
                    'rowBtnUseTooltip': false,
                    'rowContainWidth': 738,
                    'rowContainType': "horizontal grid layout",
                    'rowContainPadding': 20,
                    'rowContainHgap': 2,
                    'rowContainVgap': 10,
                    'rowContainHoffset': 8,
                    'rowContainVoffset': 0,
                    'rowContainBorderStyle': "none",
                    'rowContainBorderWidth': 0,
                    //                    'rowContainBorderColor' : 0xcccccc,
                    //                    'rowContainBckgrndColor' : 0xcccccc,
                    'rowBtnDefaultType': "Base",
                    'rowBtnWidth': 60,
                    'rowBtnHeight': 75,
                    'rowBtnBorderStyle': "solid",
                    'rowBtnBorderRadius': 6,
                    'rowBtnShowBckgrnd': true,
                    //                    'rowBtnBckgrndColorUp' : 0xffffff,
                    'rowBtnLabelPlacement': "bottom overlay",
                    'rowBtnLabelHalign': "center",
                    'rowBtnLabelFontSize': 12,
                    'rowBtnLabelHoffset': 0,
                    'rowBtnLabelVoffset': 0,
                    //                    'rowBtnLabelColorUp' : 0x5b5f65,
                    //                    'rowBtnLabelColorDown' : 0x5b5f65,
                    'rowBtnImgHoffset': 0,
                    'rowBtnImgVoffset': 0,
                    'rowShowStamp': false,
                    'rowStampImp': "",
                    'rowStampWidth': 30,
                    'rowStampHeight': 30,
                    'rowStampHoffset': 0,
                    'rowStampVoffset': 0,
                    'rowKantBtnLabelWidth': 100,
                    'rowZoomHoffset': 0,
                    'rowZoomVoffset': 0,
                    //                    'zoomOverlayBckgrndColor' : 0x000000,
                    'zoomOverlayAlpha': 80,
                    'zoomGalleryPadding': 10,
                    'zoomGalleryHoffset': 0,
                    'zoomGalleryVoffset': 0,
                    'rowContainHeight': 500,
                    'rowBckgrndShowImp': false,
                    'rowBckgrndImpUp': "",
                    'rowBckgrndImpDown': "",
                    'colContainType': "horizontal layout",
                    'colContainWidth': 738,
                    'colContainHgap': 10,
                    'colContainVgap': 10,
                    'colContainHoffset': 0,
                    'colContainVoffset': -10,
                    'colContainBorderStyle': "solid",
                    'colContainBorderWidth': 0,
                    //                    'colContainBorderColor' : 0xcccccc,
                    //                    'colContainBckgrndColor' : 0xffffff,
                    'tooltipWidth': 100,
                    'tooltipBorderWidth': 1,
                    //                    'tooltipBorderColor' : 0xcccccc,
                    //                    'tooltipBckgrndColor' : 0xf8f8f8,
                    'tooltipLabelHalign': "left",
                    'tooltipFontSize': 15,
                    //                    'tooltipFontColor' : 0x000000,
                    'colZoomHoffset': 0,
                    'colZoomVoffset': 0,
                    'zoomBorderWidth': 1,
                    //                    'zoomBorderColor' : 0xcccccc,
                    //                    'zoomBckgrndColor' : 0xf5f5f5,
                    'compContainPos': "relative",
                    'compRTL': false,
                    'rowContainBckgrndDispType': "none",
                    'rowContainImgImport': "",
                    'rowContainImgImportHoffset': 0,
                    'rowContainImgImportVoffset': 0,
                    'rowContainShowLabel': false,
                    'rowContainLabelHalign': "left",
                    'rowContainLabelFontSize': 18,
                    'rowContainLabelPadding': 5,
                    //                    'rowContainLabelColor' : 0x333333,
                    'rowBtnPadding': 10,
                    'rowBtnBorderWidthUp': 2,
                    'rowBtnBorderWidthOver': 4,
                    'rowBtnBorderWidthDown': 0,
                    //                    'rowBtnBorderColorUp' : 0xd2d3d5,
                    //                    'rowBtnBorderColorOver' : 0x9fcc3b,
                    //                    'rowBtnBorderColorDown' : 0xd2d3d5,
                    //                    'rowBtnBckgrndColorOver' : 0xffffff,
                    'rowBtnLabelOvrWidth': false,
                    'rowBtnLabelWidth': 100,
                    //                    'rowBtnLabelColorOver' : 0x5b5f65,
                    'rowBtnLabelOverlayShowBckgrnd': false,
                    //                    'rowBtnLabelOverlayBckgrndColor' : 0xeeeeee,
                    'rowBtnLabelOverlayPadding': 4,
                    'rowTxtBtnAdjustHeightType': "none",
                    'rowRadChckLabelHalign': "left",
                    'rowRadChckLabelWidth': 100,
                    'rowRadChckLabelFontSize': 16,
                    //                    'rowRadChckLabelColorUp' : 0x555555,
                    //                    'rowRadChckLabelColorOver' : 0x000000,
                    //                    'rowRadChckLabelColorDown' : 0x000000,
                    'rowBtnMouseOverDownShadow': false,
                    'rowBtnMouseOverScale': 100,
                    'rowBtnMouseDownAlpha': 100,
                    'zoomActionType': "click append image",
                    'rowRadChckLabelHoffset': 0,
                    'rowRadChckLabelVoffset': 0,
                    'zoomGalleryBorderStyle': "solid",
                    'zoomGalleryBorderWidth': 1,
                    //                    'zoomGalleryBorderColor' : 0xcccccc,
                    'rowBckgrndImpOver': "",
                    'rowBtnDragAlpha': 50,
                    'colContainHeight': 500,
                    'colContainPadding': 20,
                    'colContainBckgrndDispType': "none",
                    'colContainImgImport': "",
                    'colContainImgImportHoffset': 0,
                    'colContainImgImportVoffset': 0,
                    'colContainShowLabel': false,
                    'colContainLabelHalign': "left",
                    'colContainLabelFontSize': 18,
                    'colContainLabelPadding': 5,
                    //                    'colContainLabelColor' : 0x333333,
                    'colDzoneDropAnimation': "crop",
                    'colDzoneGrowAnimation': "grow all",
                    'colDzoneCropWidth': 50,
                    'colDzoneCropHeight': 50,
                    'colDzoneContainHgap': 0,
                    'colDzoneContainVgap': 0,
                    'colDzoneContainPadding': 0,
                    'colDzoneWidth': 115,
                    'colDzoneHeight': 125,
                    'colDzoneShowBckgrnd': true,
                    'colDzoneBorderStyle': "solid",
                    'colDzoneBorderWidth': 2,
                    'colDzoneBorderRadius': 6,
                    //                    'colDzoneBorderColorUp' : 0xa6a8ab,
                    //                    'colDzoneBorderColorOver' : 0xa6a8ab,
                    //                    'colDzoneBckgrndColorUp' : 0xf2f2f2,
                    //                    'colDzoneBckgrndColorOver' : 0xffffff,
                    'colDzoneShowBckgrndImp': false,
                    'colDzoneBckgrndImpUp': "",
                    'colDzoneBckgrndImpOver': "",
                    'colDzoneShowLabel': true,
                    'colDzoneLabPlacement': "top",
                    'colDzoneLabHalign': "center",
                    'colDzoneLabHoffset': 0,
                    'colDzoneLabVoffset': -5,
                    'colDzoneLabFontSize': 18,
                    //                    'colDzoneLabColorUp' : 0x555555,
                    //                    'colDzoneLabColorOver' : 0x000000,
                    'colDzoneLabOverlayShowBckgrnd': false,
                    //                    'colDzoneLabOverlayBckgrndColor' : 0xeeeeee,
                    'colDzoneLabOverlayPadding': 5,
                    'colDzoneLabOverlayValign': "center",
                    'colDzoneLabOverlaySyncHeight': true,
                    'colDzoneImgDispType': "none",
                    'colDzoneImgWidth': 150,
                    'colDzoneImgPadding': 10,
                    'colDzoneImgHoffset': 0,
                    'colDzoneImgVoffset': 0,
                    'colDzoneUseTooltip': false,
                    'colDzoneUseZoom': false,
                    'colContainOptValign': "bottom",
				    'dndCustomSetup':false,
				    'colDzoneAutoWidth':true
                }
        case "PC":
        case "OTHERDEVICE":
        default:
            return {
                'rowBtnUseZoom': false,
                //                    'rowBtnBckgrndColorDown' : 0xffffff,
                'colContainLabel': "Column Container Label",
                'rowContainLabel': "Row Container Label",
                'rowBtnShowLabel': true,
                'rowBtnUseTooltip': false,
                'rowContainWidth': 970,
                'rowContainType': "horizontal grid layout",
                'rowContainPadding': 20,
                'rowContainHgap': 10,
                'rowContainVgap': 10,
                'rowContainHoffset': 8,
                'rowContainVoffset': 0,
                'rowContainBorderStyle': "none",
                'rowContainBorderWidth': 0,
                //                    'rowContainBorderColor' : 0xcccccc,
                //                    'rowContainBckgrndColor' : 0xcccccc,
                'rowBtnDefaultType': "Base",
                'rowBtnWidth': 132,
                'rowBtnHeight': 134,
                'rowBtnBorderStyle': "solid",
                'rowBtnBorderRadius': 6,
                'rowBtnShowBckgrnd': true,
                //                    'rowBtnBckgrndColorUp' : 0xffffff,
                'rowBtnLabelPlacement': "bottom overlay",
                'rowBtnLabelHalign': "center",
                'rowBtnLabelFontSize': 18,
                'rowBtnLabelHoffset': 0,
                'rowBtnLabelVoffset': 0,
                //                    'rowBtnLabelColorUp' : 0x5b5f65,
                //                    'rowBtnLabelColorDown' : 0x5b5f65,
                'rowBtnImgHoffset': 0,
                'rowBtnImgVoffset': 0,
                'rowShowStamp': false,
                'rowStampImp': "",
                'rowStampWidth': 30,
                'rowStampHeight': 30,
                'rowStampHoffset': 0,
                'rowStampVoffset': 0,
                'rowKantBtnLabelWidth': 100,
                'rowZoomHoffset': 0,
                'rowZoomVoffset': 0,
                //                    'zoomOverlayBckgrndColor' : 0x000000,
                'zoomOverlayAlpha': 80,
                'zoomGalleryPadding': 10,
                'zoomGalleryHoffset': 0,
                'zoomGalleryVoffset': 0,
                'rowContainHeight': 500,
                'rowBckgrndShowImp': false,
                'rowBckgrndImpUp': "",
                'rowBckgrndImpDown': "",
                'colContainType': "horizontal layout",
                'colContainWidth': 970,
                'colContainHgap': 10,
                'colContainVgap': 10,
                'colContainHoffset': 0,
                'colContainVoffset': -10,
                'colContainBorderStyle': "solid",
                'colContainBorderWidth': 0,
                //                    'colContainBorderColor' : 0xcccccc,
                //                    'colContainBckgrndColor' : 0xffffff,
                'tooltipWidth': 100,
                'tooltipBorderWidth': 1,
                //                    'tooltipBorderColor' : 0xcccccc,
                //                    'tooltipBckgrndColor' : 0xf8f8f8,
                'tooltipLabelHalign': "left",
                'tooltipFontSize': 15,
                //                    'tooltipFontColor' : 0x000000,
                'colZoomHoffset': 0,
                'colZoomVoffset': 0,
                'zoomBorderWidth': 1,
                //                    'zoomBorderColor' : 0xcccccc,
                //                    'zoomBckgrndColor' : 0xf5f5f5,
                'compContainPos': "relative",
                'compRTL': false,
                'rowContainBckgrndDispType': "none",
                'rowContainImgImport': "",
                'rowContainImgImportHoffset': 0,
                'rowContainImgImportVoffset': 0,
                'rowContainShowLabel': false,
                'rowContainLabelHalign': "left",
                'rowContainLabelFontSize': 18,
                'rowContainLabelPadding': 5,
                //                    'rowContainLabelColor' : 0x333333,
                'rowBtnPadding': 10,
                'rowBtnBorderWidthUp': 2,
                'rowBtnBorderWidthOver': 4,
                'rowBtnBorderWidthDown': 0,
                //                    'rowBtnBorderColorUp' : 0xd2d3d5,
                //                    'rowBtnBorderColorOver' : 0x9fcc3b,
                //                    'rowBtnBorderColorDown' : 0xd2d3d5,
                //                    'rowBtnBckgrndColorOver' : 0xffffff,
                'rowBtnLabelOvrWidth': false,
                'rowBtnLabelWidth': 100,
                //                    'rowBtnLabelColorOver' : 0x5b5f65,
                'rowBtnLabelOverlayShowBckgrnd': false,
                //                    'rowBtnLabelOverlayBckgrndColor' : 0xeeeeee,
                'rowBtnLabelOverlayPadding': 4,
                'rowTxtBtnAdjustHeightType': "none",
                'rowRadChckLabelHalign': "left",
                'rowRadChckLabelWidth': 100,
                'rowRadChckLabelFontSize': 16,
                //                    'rowRadChckLabelColorUp' : 0x555555,
                //                    'rowRadChckLabelColorOver' : 0x000000,
                //                    'rowRadChckLabelColorDown' : 0x000000,
                'rowBtnMouseOverDownShadow': false,
                'rowBtnMouseOverScale': 100,
                'rowBtnMouseDownAlpha': 100,
                'zoomActionType': "click append image",
                'rowRadChckLabelHoffset': 0,
                'rowRadChckLabelVoffset': 0,
                'zoomGalleryBorderStyle': "solid",
                'zoomGalleryBorderWidth': 1,
                //                    'zoomGalleryBorderColor' : 0xcccccc,
                'rowBckgrndImpOver': "",
                'rowBtnDragAlpha': 50,
                'colContainHeight': 500,
                'colContainPadding': 20,
                'colContainBckgrndDispType': "none",
                'colContainImgImport': "",
                'colContainImgImportHoffset': 0,
                'colContainImgImportVoffset': 0,
                'colContainShowLabel': false,
                'colContainLabelHalign': "left",
                'colContainLabelFontSize': 18,
                'colContainLabelPadding': 5,
                //                    'colContainLabelColor' : 0x333333,
                'colDzoneDropAnimation': "anchor",
                'colDzoneGrowAnimation': "grow all",
                'colDzoneCropWidth': 50,
                'colDzoneCropHeight': 50,
                'colDzoneContainHgap': 0,
                'colDzoneContainVgap': 0,
                'colDzoneContainPadding': 0,
                'colDzoneWidth': 156,
                'colDzoneHeight': 180,
                'colDzoneShowBckgrnd': true,
                'colDzoneBorderStyle': "solid",
                'colDzoneBorderWidth': 2,
                'colDzoneBorderRadius': 6,
                //                    'colDzoneBorderColorUp' : 0xa6a8ab,
                //                    'colDzoneBorderColorOver' : 0xa6a8ab,
                //                    'colDzoneBckgrndColorUp' : 0xf2f2f2,
                //                    'colDzoneBckgrndColorOver' : 0xffffff,
                'colDzoneShowBckgrndImp': false,
                'colDzoneBckgrndImpUp': "",
                'colDzoneBckgrndImpOver': "",
                'colDzoneShowLabel': true,
                'colDzoneLabPlacement': "top",
                'colDzoneLabHalign': "center",
                'colDzoneLabHoffset': 0,
                'colDzoneLabVoffset': -5,
                'colDzoneLabFontSize': 18,
                //                    'colDzoneLabColorUp' : 0x555555,
                //                    'colDzoneLabColorOver' : 0x000000,
                'colDzoneLabOverlayShowBckgrnd': false,
                //                    'colDzoneLabOverlayBckgrndColor' : 0xeeeeee,
                'colDzoneLabOverlayPadding': 5,
                'colDzoneLabOverlayValign': "center",
                'colDzoneLabOverlaySyncHeight': true,
                'colDzoneImgDispType': "none",
                'colDzoneImgWidth': 150,
                'colDzoneImgPadding': 10,
                'colDzoneImgHoffset': 0,
                'colDzoneImgVoffset': 0,
                'colDzoneUseTooltip': false,
                'colDzoneUseZoom': false,
                'colContainOptValign': "bottom",
				'dndCustomSetup':false,
				'colDzoneAutoWidth':true
            }
    }
}