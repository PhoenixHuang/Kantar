/**
 * slider class
 * Inherits from SESurveyTool
 */
function slider(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts)
}
slider.prototype = Object.create(SESurveyTool.prototype);
slider.prototype.type = function() {
    return "slider";
}
slider.prototype.slidertype = function() {
    return this.slidertype;
}
slider.prototype.getDependencies = function() {
    return [{
            'type': 'script',
            'url': surveyPage.path + 'lib/qstudio/qcreator/qcomponent/SliderMatrix/SliderMatrix.js'
        }
        //{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QFactory.js'},
        //{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QContainer.js'},
        //{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QWidget.js'} 
    ];
}
slider.prototype.setInitialResponses = function() {
    var dimResp = [];
    var that = this;
    var categoryCount = 0;
    // TODO: Check for text areas
    if (that.slidertype == 'numeric') { // numeric
        $.each(this.inputs.filter("input[type=text],:checked"), function(i, e) {
            if (e.type == "text") {
                if (that.getProperty("colSldrInverse") === true) {
                    dimResp.push({
                        rowIndex: 0,
                        colIndex: [{
                            index: (that.maxVal - that.minVal) - parseInt(e.value) + 1
                        }]
                    });
                } else
                    dimResp.push({
                        rowIndex: 0,
                        colIndex: [{
                            index: parseInt(e.value) - 1
                        }]
                    });
            } else {
                dimResp.push({
                    rowIndex: 0,
                    colIndex: [{
                        index: that.maxVal + categoryCount
                    }]
                });
                categoryCount++; // in case multiple categories
            }
        });
    } else { // categorical
        $.each(this.inputs.filter(":checked"), function(i, e) {
            dimResp.push({
                rowIndex: 0,
                colIndex: [{
                    index: parseInt($(e).attr("sldcolumnvalue"))
                }]
            });
        });
    }
    this.component.setDimenResp(dimResp);
}
slider.prototype.setResponses = function() {
    var response = this.getResponse();
    if (response == null) return;
    this.clearInputs(); // need to clear the responses before setting them.
    var that = this;
    $.each($(response.Value), function(i, e) {
        if (response[e] != null) {
            if (that.slidertype == 'numeric') {
                if (that.getProperty("colSldrInverse") === true) {
                    that.inputs.filter('input[type=text]').val((that.maxVal) - response[e].rangeValue + 1);
                } else
                    that.inputs.filter('input[type=text]').val(response[e].rangeValue);
            } else {
                that.inputs.val($.makeArray(that.inputs[response[e].columnValue].value));
            }
        } else {
            var resp = e.split('^');
            that.inputs.filter('input[type!=text]').val($.makeArray(resp[1]));
        }
    });
}
slider.prototype.build = function() {
    this.component = new SliderMatrix();
    var finalparams = this.params();
    var rowArray = [],
        colArray = [],
        that = this;

    this.exclusiveCount = 0;

    // For single sliders this produce empty arrays.
    this.buildArraysFromGrid();

    // Setup end images if required
    this.endImages = that.getProperty("colSldrShowEndImg") == true;
    if (this.endImages) {
        this.sliderEndImageLeft = this.getProperty("sliderEndImageLeft");
        this.sliderEndImageRight = this.getProperty("sliderEndImageRight");
    }

    // Set the type of slider
    if (this.inputs.eq(0).attr('type') == "text")
        this.slidertype = 'numeric';
    else
        this.slidertype = 'categorical';

    // Build up column array for numeric sliders.
    if (this.slidertype == 'numeric') {
        this.minVal = (this.getProperty("colSldrMinVal") != null) ? this.getProperty("colSldrMinVal") : ($.isArray(this.minVal) ? this.minVal[0] : this.minVal); //$.isArray(this.minVal) ? this.minVal[0] : this.minVal;
        this.maxVal = (this.getProperty("colSldrMaxVal") != null) ? this.getProperty("colSldrMaxVal") : ($.isArray(this.maxVal) ? this.maxVal[0] : this.maxVal); //$.isArray(this.maxVal) ? this.maxVal[0] : this.maxVal;

        if (this.minVal == null || this.maxVal == null) {
            handleSurveyEngineError(new Error("Unable to render a numeric slider without a minVal and maxVal property"));
            return false;
        }
        if (this.minVal == this.maxVal || this.minVal > this.maxVal || this.minVal < 0 || this.maxVal < 0) {
            handleSurveyEngineError(new Error("Unable to render a numeric slider - minVal and maxVal are equal, less than zero or reversed."));
            return false;
        }


        if (this.getProperty("colSldrInverse") === true) {
            for (var idx = this.maxVal; idx >= this.minVal; idx--) {
                colArray.push({
                    id: 'id' + idx,
                    label: idx.toString(),
                    description: idx.toString(),
                    image: '',
                    useZoom: false
                });
            }
        } else {
            for (var idx = this.minVal; idx <= this.maxVal; idx++) {
                colArray.push({
                    id: 'id' + idx,
                    label: idx.toString(),
                    description: idx.toString(),
                    image: '',
                    useZoom: false
                });
            }
        }
    }
    var sldr = this;
    // Add categories and special responses
    $.each(this.inputs.filter(":checkbox,:radio"), function(i, e) {
        var el = $(e);
        var label = el.parent().find('label').clone();
        var imagesrc = label.find('img');
        label.find("span").removeClass('mrQuestionText');
        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        if (that.endImages) imagesrc.remove(); // remove image from label if using end images
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            var colLabel = (sldr.slidertype == 'categorical') ? label.html() : label.eq(i).html()
            var colDescription = (sldr.slidertype == 'categorical') ? label.text() : label.eq(i).text()
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            var colLabel = (sldr.slidertype == 'categorical') ? label.html().split("|")[0] : label.eq(i).html()
            var colDescription = (sldr.slidertype == 'categorical') ? label.text().split("|")[0] : label.eq(i).text()
        }
        colArray.push({
            id: el.attr('value'),
            label: colLabel,
            description: colDescription,
            image: imagesrc.attr('src'),
            isRadio: ((el.attr('type') == "radio" || el.attr('isexclusive') == "true"))
        });
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            if (el.attr('isexclusive') == "true") {

                that.exclusiveCount++;
                colArray[colArray.length - 1].type = 'radiocheck';
                colArray[colArray.length - 1].ownRow = true;
                colArray[colArray.length - 1].description = '';
            }
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            if (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim() == "exclusive") {
                that.exclusiveCount++;
                colArray[colArray.length - 1].type = 'radiocheck';
                colArray[colArray.length - 1].ownRow = true;
                colArray[colArray.length - 1].description = '';
            }
        }
        // Add the slider column value for easy setting of initial responses
        el.attr("sldColumnValue", i);
    });

    // Check end images
    if (this.endImages) {
        if (this.sliderEndImageLeft && typeof(this.sliderEndImageLeft) != 'undefined') colArray[0].image = this.sliderEndImageLeft;
        if (this.sliderEndImageRight && typeof(this.sliderEndImageRight) != 'undefined') colArray[colArray.length - this.exclusiveCount - 1].image = this.sliderEndImageRight;
    }

    // Build up row array
    if (this.subquestions.length <= 0) {
        this.label.hide();
        if (that.getProperty("rowBtnDefaultType").toLowerCase() == "none")
            this.label.show();
        rowArray.push({
            id: "slider1",
            label: this.label.html(),
            description: "",
            image: "",
            type: that.getProperty("rowBtnDefaultType")
        });
    } else {
        $.each(this.subquestions, function(i, e) {
            var label = e.label;
            label.find('span').removeClass('mrQuestionText');
            label.find("span").removeClass('mrSingleText');
            label.find("span").removeClass('mrMultipleText');
            rowArray.push({
                id: e.id,
                label: label.html(),
                description: label.text(),
                image: e.image,
                var1: "Base"
            });
        });
    }
	
	// Slider Container move left only for mobile potrait and Slider EndText
	
	if (pageLayout.deviceType.toUpperCase() != "PC" && (this.orientation == 0 || this.orientation == 180) && this.getProperty("showSliderEndText")){
		if (!this.customProps.hasOwnProperty("colContainHoffset"))
			this.options.colContainHoffset = -50;
	}
	
    this.component.rowArray(rowArray);
    this.component.columnArray(colArray);
    this.component.baseTool = "slidermatrix";
    this.setRuntimeProps();
    this.component.params(this.params());
    this.deferred.resolve();


}

slider.prototype.render = function(){
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
	
	
    if (this.getProperty("sliderEndTextLeft").length > 0)
        leftText = this.getProperty("sliderEndTextLeft")
    if (this.getProperty("sliderEndTextRight").length > 0)
        rightText = this.getProperty("sliderEndTextRight")
    if (this.getProperty("compRTL")) {
        var tempHold = leftText;
        leftText = rightText;
        rightText = tempHold;
    }
	
    //label hate/love button text
    if (this.getProperty("showSliderEndText")) {

		var textWidth = this.getProperty("sliderEndTextWidth");
		var textHeight = this.getProperty("sliderEndTextHeight");
		var marginTop = this.getProperty("sliderEndTextMarginTop");
		var marginLeft = this.getProperty("sliderEndTextMarginLeft");
		var fontWeight = this.getProperty("sliderEndTextFontWeight");
		var fontSize = this.getProperty("sliderEndTextFontSize");
		
        if (this.componentContainer.find('.qwidget_slider_left_top_end_image_container').length > 0 && this.componentContainer.find('.qwidget_slider_right_bottom_end_image_container').length > 0) {
			var textWidth = this.getProperty("sliderEndTextWidth");
                    this.componentContainer.find('.qwidget_slider_left_top_end_image_container .qwidget_image').wrap("<div style='width:"+textWidth+"px;height:"+textHeight+"px;display:inline-block;position:relative;text-align:center;left:-"+marginLeft+"px;top:-"+marginTop+"px;font-weight:"+fontWeight+";font-size:"+fontSize+"px;color:#5b5f65;'>" + leftText + "<br/></div>");
             
			 
                    this.componentContainer.find('.qwidget_slider_right_bottom_end_image_container .qwidget_image').wrap("<div style='width:"+textWidth+"px;height:"+textHeight+"px;display:inline-block;position:relative;text-align:center;top:-"+marginTop+"px;font-weight:"+fontWeight+";font-size:"+fontSize+"px;color:#5b5f65;'>" + rightText + "<br/></div>");
                
        } else {
            //remove before adding, prevents issue with double text from multiple runs
			marginTop = parseInt(marginTop) + 35;
			marginLeft = parseInt(marginLeft) + 130;
            this.componentContainer.find('.leftTextBox').parent('div').remove();
            this.componentContainer.find('.rightTextBox').parent('div').remove();

            this.componentContainer.find('.qwidget_slider_wrapper .qwidget_slider_track .qwidget_slider_tick_container').before("<div style='display:inline-block;position:absolute;height:"+textHeight+"px;left:-"+marginLeft+"px;margin-top:-"+marginTop+"px;max-width:"+textWidth+"px;margin-left:20px;text-align:center;font-weight:"+fontWeight+";font-size:"+fontSize+"px;color:#5b5f65;'><span class='leftTextBox' style='position: relative'>" + leftText + "</span></div>");
            this.componentContainer.find('.qwidget_slider_wrapper .qwidget_slider_track .qwidget_slider_tick_container').after("<div style='display:inline-block;position:absolute;height:"+textHeight+"px;right:-"+marginLeft+"px;margin-top:-"+marginTop+"px;max-width:"+textWidth+"px;margin-right:20px;text-align:center;font-weight:"+fontWeight+";font-size:"+fontSize+"px;color:#5b5f65;'><span class='rightTextBox' style='position: relative'>" + rightText + "</span></div>");

            this.componentContainer.find('.leftTextBox').css('top', (80 - $('.leftTextBox').height()) / 2 + 'px');
            this.componentContainer.find('.rightTextBox').css('top', (80 - $('.rightTextBox').height()) / 2 + 'px');
        }
    }

}

slider.prototype.setRuntimeProps = function() {
    if (this.slidertype == 'numeric') {
        if (!this.customProps.hasOwnProperty("colSldrMinVal")) this.options.colSldrMinVal = parseInt(this.minVal);
        if (!this.customProps.hasOwnProperty("colSldrMaxVal")) this.options.colSldrMaxVal = parseInt(this.maxVal);
    }
    if (this.slidertype == 'categorical') {
        if (!this.customProps.hasOwnProperty("colSldrTickLabDispType")) this.options.colSldrTickLabDispType = "show all";
        //if (!this.customProps.hasOwnProperty("colSldrTickLabOffset")) this.options.colSldrTickLabOffset = 20;
    }
}
slider.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + slider.prototype.type()));
    switch (pageLayout.deviceType.toUpperCase()) {
        case "LARGETABLET":
        case "MEDIUMTABLET":
        case "SMALLTABLET":
        case "SMARTPHONETOUCH":
            if (this.orientation == 0 || this.orientation == 180)
                return {
                    'rowBtnUseZoom': false,
                    //	                    'rowBtnBckgrndColorDown' : "0xffffff",
                    'rowContainLabel': "Row Container Label",
                    'rowBtnShowLabel': true,
                    'rowBtnUseTooltip': false,
                    'rowContainWidth': 870,
                    'compQuestionType': "Single Choice",
                    'rowContainType': "horizontal grid layout",
                    'rowContainPadding': 0,
                    'rowContainHgap': 0,
                    'rowContainVgap': 0,
                    'rowContainHoffset': 50,
                    'rowContainVoffset': 40,
                    'rowContainBorderStyle': "none",
                    'rowContainBorderWidth': 0,
                    //	                    'rowContainBorderColor' : 0x5b5f65,
                    //	                    'rowContainBckgrndColor' : 0xffffff,
                    'rowBtnDefaultType': "None",
                    'rowBtnWidth': 155,
                    'rowBtnHeight': 142,
                    'rowBtnBorderStyle': "solid",
                    'rowBtnBorderRadius': 0,
                    'rowBtnShowBckgrnd': false,
                    //	                    'rowBtnBckgrndColorUp' : 0xffffff,
                    'rowBtnLabelPlacement': "bottom overlay",
                    'rowBtnLabelHalign': "center",
                    'rowBtnLabelFontSize': 28,
                    'rowBtnLabelHoffset': 0,
                    'rowBtnLabelVoffset': 0,
                    //	                    'rowBtnLabelColorUp' : 0x5b5f65,
                    //	                    'rowBtnLabelColorDown' : 0x5b5f65,
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
                    //	                    'zoomOverlayBckgrndColor' : 0x000000,
                    'zoomOverlayAlpha': 80,
                    'zoomGalleryPadding': 10,
                    'zoomGalleryHoffset': 0,
                    'zoomGalleryVoffset': 0,
                    'zoomCloseImp': "",
                    'zoomCloseWidth': 22,
                    'zoomCloseHeight': 22,
                    'zoomCloseHoffset': 0,
                    'zoomCloseVoffset': 0,
                    'rowContainHeight': 500,
                    'tooltipWidth': 100,
                    'tooltipBorderWidth': 1,
                    //	                    'tooltipBorderColor' : 0xcccccc,
                    //	                    'tooltipBckgrndColor' : 0xf8f8f8,
                    'tooltipLabelHalign': "left",
                    'tooltipFontSize': 15,
                    //	                    'tooltipFontColor' : 0x000000,
                    'zoomImp': "",
                    'zoomWidth': 20,
                    'zoomHeight': 20,
                    'zoomBorderWidth': 1,
                    //	                    'zoomBorderColor' : 0xcccccc,
                    //	                    'zoomBckgrndColor' : 0xf5f5f5,
                    'compContainPos': "relative",
                    'compRTL': false,
                    'rowContainAutoWidth': true,
                    'rowContainAutoHeight': true,
                    'rowContainBckgrndDispType': "none",
                    'rowContainImgImport': "",
                    'rowContainImgImportHoffset': 0,
                    'rowContainImgImportVoffset': 0,
                    'rowContainShowLabel': false,
                    'rowContainLabelHalign': "center",
                    'rowContainLabelFontSize': 18,
                    'rowContainLabelPadding': 5,
                    //	                    'rowContainLabelColor' : 0x333333,
                    'rowBtnPadding': 15,
                    'rowBtnBorderWidthUp': 0,
                    'rowBtnBorderWidthDown': 0,
                    //	                    'rowBtnBorderColorUp' : 0xa6a8ab,
                    //	                    'rowBtnBorderColorDown' : 0xffffff,
                    'rowBtnLabelOvrWidth': false,
                    'rowBtnLabelWidth': 150,
                    'rowBtnLabelOverlayShowBckgrnd': false,
                    //	                    'rowBtnLabelOverlayBckgrndColor' : 0xeeeeee,
                    'rowBtnLabelOverlayPadding': 5,
                    'rowTxtBtnAdjustHeightType': "none",
                    'zoomActionType': "click append image",
                    'zoomGalleryBorderStyle': "solid",
                    'zoomGalleryBorderWidth': 1,
                    //	                    'zoomGalleryBorderColor' : 0xcccccc,
                    'colContainLabel': "Column Container Label",
                    'rowBckgrndShowImp': false,
                    'rowBckgrndImpUp': "",
                    'rowBckgrndImpDown': "",
                    'colContainType': "horizontal grid layout",
                    'colContainWidth': 900,
                    'colContainHgap': 20,
                    'colContainVgap': 20,
                    'colContainHoffset': -25,
                    'colContainVoffset': 8,
                    'colContainBorderStyle': "solid",
                    'colContainBorderWidth': 0,
                    //	                    'colContainBorderColor' : 0xeeeeee,
                    //	                    'colContainBckgrndColor' : 0xffffff,
                    'colZoomHoffset': 0,
                    'colZoomVoffset': 0,
                    'rowContainSetRowPer': 5,
                    'rowContainScrlEndPos': 88,
                    'rowContainChldInitAlpha': 100,
                    'rowContainChldEndAlpha': 100,
                    'rowContainAutoNext': false,
                    'colBtnDefaultType': "Base",
                    'colBtnWidth': 86,
                    'colBtnHeight': 69,
                    'colBtnBorderStyle': "solid",
                    'colBtnBorderRadius': 0,
                    'colBtnShowBckgrnd': false,
                    'colRadShowImp': false,
                    'colChkShowImp': false,
                    //	                    'colBtnBckgrndColorUp' : 0xd2d3d5,
                    //	                    'colBtnBckgrndColorOver' : 0xffffff,
                    //	                    'colBtnBckgrndColorDown' : 0xffbd1a,
                    'colRadImpUp': "",
                    'colRadImpOver': "",
                    'colRadImpDown': "",
                    'colChkImpUp': "",
                    'colChkImpOver': "",
                    'colChkImpDown': "",
                    'colBtnShowLabel': false,
                    'colBtnLabelPlacement': "bottom",
                    'colBtnLabelHalign': "left",
                    'colBtnLabelFontSize': 15,
                    'colBtnLabelHoffset': 0,
                    'colBtnLabelVoffset': 0,
                    //	                    'colBtnLabelColorUp' : 0x555555,
                    //	                    'colBtnLabelColorOver' : 0x000000,
                    //	                    'colBtnLabelColorDown' : 0x000000,
                    'colBtnImgHoffset': 0,
                    'colBtnImgVoffset': 0,
                    'colShowStamp': false,
                    'colStampImp': "",
                    'colStampWidth': 61,
                    'colStampHeight': 49,
                    'colStampHoffset': 0,
                    'colStampVoffset': 0,
                    'colKantBtnLabelWidth': 100,
                    'colRadChckLabelWidth': 200,
                    'colOtherInitTxt': "Please specify...",
                    'colOtherMinVal': 1,
                    'colOtherMaxVal': 100,
                    'colOtherMsgWidth': 100,
                    'colBtnMouseOverDownShadow': false,
                    'colBtnMouseOverBounce': false,
                    'colBtnMouseOverScale': 100,
                    'colBtnMouseDownScale': 100,
                    'colBtnMouseDownAlpha': 100,
                    'colBtnUseTooltip': false,
                    'colBtnUseZoom': false,
                    'colBtnPadding': 4,
                    'colBtnBorderWidthUp': 1,
                    'colBtnBorderWidthOver': 1,
                    'colBtnBorderWidthDown': 1,
                    'colContainHeight': 500,
                    'colContainPadding': 10,
                    'colContainBckgrndDispType': "none",
                    'colContainImgImport': "",
                    'colContainImgImportHoffset': 0,
                    'colContainImgImportVoffset': 0,
                    'colContainShowLabel': false,
                    'colContainLabelHalign': "left",
                    'colContainLabelFontSize': 18,
                    'colContainLabelPadding': 5,
                    //	                    'colContainLabelColor' : 0x333333,
                    'rowContainScrlAnimSpeed': 800,
                    'rowContainChldEnableAlpha': 50,
                    'rowContainGoOpaque': false,
                    //	                    'colBtnBorderColorUp' : 0xa6a8ab,
                    //	                    'colBtnBorderColorOver' : 0xffbd1a,
                    //	                    'colBtnBorderColorDown' : 0xd2d3d5,
                    'colBtnLabelOvrWidth': false,
                    'colBtnLabelWidth': 100,
                    'colBtnLabelOverlayShowBckgrnd': true,
                    //	                    'colBtnLabelOverlayBckgrndColor' : 0xeeeeee,
                    'colBtnLabelOverlayPadding': 2,
                    'colTxtBtnAdjustHeightType': "none",
                    'colRadChckLabelHalign': "left",
                    'colRadChckLabelFontSize': 25,
                    //	                    'colRadChckLabelColorUp' : 0x555555,
                    //	                    'colRadChckLabelColorOver' : 0x000000,
                    //	                    'colRadChckLabelColorDown' : 0x000000,
                    'colRadChckLabelHoffset': 0,
                    'colRadChckLabelVoffset': 10,
                    'colKntrInputTxtAreaWidth': 125,
                    'colKntrInputLabelHalign': "left",
                    'colKntrInputLabelWidth': 200,
                    'colKntrInputLabelHoffset': 0,
                    'colKntrInputLabelVoffset': 10,
                    'colKntrInputLabelFontSize': 25,
                    //	                    'colKntrInputLabelColorUp' : 0x555555,
                    //	                    'colKntrInputLabelColorOver' : 0x000000,
                    //	                    'colKntrInputLabelColorDown' : 0x000000,
                    'colOtherInputHalign': "left",
                    'colOtherInputFontSize': 15,
                    //	                    'colOtherInputColor' : 0x555555,
                    'colSldrHndleLabDispType': "none",
                    'colSldrHndleShowImp': true,
                    'colSldrDirection': "horizontal",
                    //'colSldrMinVal' : 0,
                    //'colSldrMaxVal' : 100,
                    'colSldrPrecVal': 0,
                    'colSldrTrackWidth': 440,
                    'colSldrTrackHeight': 12,
                    'colSldrTrackBorderStyle': "solid",
                    'colSldrTrackBorderWidth': 14,
                    'colSldrTrackBorderRadius': 28,
                    //	                    'colSldrTrackBorderColor' : 0xf2f2f2,
                    //	                    'colSldrTrackColor' : 0xd2d3d5,
                    'colSldrTrackShowImp': false,
                    'colSldrTrackImp': "",
                    'colSldrShowHighlight': true,
                    //	                    'colSldrHighlightColor' : 0x9fcc3b,
                    'colSldrTickWidth': 2,
                    'colSldrTickHeight': 8,
                    //	                    'colSldrTickColor' : 0x9fcc3b,
                    'colSldrTickLabDispType': "show all",
                    'colSldrTickLabWidth': 80,
                    'colSldrTickLabOffset': -94,
                    'colSldrTickLabFontSize': 22,
                    //	                    'colSldrTickLabColor' : 0x5b5f65,
                    'colSldrHndleInitLoc': 0,
                    'colSldrHndleWidth': 67,
                    'colSldrHndleHeight': 90,
                    'colSldrHndleBorderStyle': "solid",
                    'colSldrHndleBorderWidth': 2,
                    'colSldrHndleBorderRadius': 5,
                    //	                    'colSldrHndleColorUp' : 0xd2d3d5,
                    //	                    'colSldrHndleColorDown' : 0xffbd1a,
                    'colSldrHndleLabFontSize': 14,
                    //	                    'colSldrHndleLabFontColor' : 0x5b5f65,
                    'colSldrHndleLabInitTxt': "",
                    'colSldrHndleLabHoffset': 0,
                    'colSldrHndleLabVoffset': 7,
                    'colSldrImgContWidth': 100,
                    'colSldrImgContHeight': 100,
                    'colSldrImgContHoffset': 0,
                    'colSldrImgContVoffset': 0,
                    'colSldrImgDispType': "none",
                    'colSldrTickLabCustomCnt': 5,
                    'colSldrTickHide': true,
                    'colSldrHndleShowBckgrnd': true,
                    'colSldrHndleShowImg': false,
                    'colSldrHndleSnapType': "none",
                    'colSldrHndlePadding': 5,
                    //	                    'colSldrHndleBorderColorUp' : 0xa6a8ab,
                    //	                    'colSldrHndleBorderColorDown' : 0x5b5f65,
                    'colSldrShowInitImg': false,
                    'colSldrShowEndImg': false,
                    'colSldrImgEndWidth': 100,
                    'colSldrImgEndHeight': 100,
                    'colSldrImgEndHoffset': 0,
                    'colSldrImgEndVoffset': 0,
                    'colSldrHndleShowLabelBckgrnd': false,
                    //	                    'colSldrHndleLabBckgrndColor' : 0xffffff,
                    'colSlderAllowTrackClick': true,
                    'sliderEndTextLeft': "",
                    'sliderEndTextRight': "",
                    'showSliderEndText': false,
					'sliderEndTextWidth': 100,
					'sliderEndTextHeight': 80,
					'sliderEndTextMarginTop':15,
					'sliderEndTextMarginLeft':0,
					'sliderEndTextFontWeight':600,
					'sliderEndTextFontSize':30
                }
            else
                return {
                    'rowBtnUseZoom': false,
                    //	                    'rowBtnBckgrndColorDown' : "0x9fcc3b",
                    'colContainLabel': "Column Container Label",
                    'rowContainLabel': "Row Container Label",
                    'rowBtnShowLabel': true,
                    'rowBtnUseTooltip': false,
                    'rowContainWidth': 970,
                    'compQuestionType': "Single Choice",
                    'rowContainType': "vertical layout",
                    'rowContainPadding': 20,
                    'rowContainHgap': 0,
                    'rowContainVgap': 5,
                    'rowContainHoffset': 50,
                    'rowContainVoffset': 10,
                    'rowContainBorderStyle': "none",
                    'rowContainBorderWidth': 0,
                    //	                    'rowContainBorderColor' : 0xf2f2f2,
                    //	                    'rowContainBckgrndColor' : 0xf2f2f2,
                    'rowBtnDefaultType': "None",
                    'rowBtnWidth': 88,
                    'rowBtnHeight': 88,
                    'rowBtnBorderStyle': "solid",
                    'rowBtnBorderRadius': 0,
                    'rowBtnShowBckgrnd': false,
                    //	                    'rowBtnBckgrndColorUp' : 0xf2f2f2,
                    'rowBtnLabelPlacement': "center overlay",
                    'rowBtnLabelHalign': "center",
                    'rowBtnLabelFontSize': 18,
                    'rowBtnLabelHoffset': 0,
                    'rowBtnLabelVoffset': 18,
                    //	                    'rowBtnLabelColorUp' : 0x5b5f65,
                    //	                    'rowBtnLabelColorDown' : 0x5b5f65,
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
                    //	                    'zoomOverlayBckgrndColor' : 0x000000,
                    'zoomOverlayAlpha': 80,
                    'zoomGalleryPadding': 10,
                    'zoomGalleryHoffset': 0,
                    'zoomGalleryVoffset': 0,
                    'zoomCloseImp': "",
                    'zoomCloseWidth': 22,
                    'zoomCloseHeight': 22,
                    'zoomCloseHoffset': 0,
                    'zoomCloseVoffset': 0,
                    'rowContainHeight': 500,
                    'rowBckgrndShowImp': false,
                    'rowBckgrndImpUp': "",
                    'rowBckgrndImpDown': "",
                    'colContainType': "horizontal grid layout",
                    'colContainWidth': 600,
                    'colContainHgap': 0,
                    'colContainVgap': 0,
                    'colContainHoffset': -30,
                    'colContainVoffset': 10,
                    'colContainBorderStyle': "none",
                    'colContainBorderWidth': 0,
                    //	                    'colContainBorderColor' : 0xa6a8ab,
                    //	                    'colContainBckgrndColor' : 0xffffff,
                    'tooltipWidth': 150,
                    'tooltipBorderWidth': 2,
                    //	                    'tooltipBorderColor' : "0xa6a8ab",
                    //	                    'tooltipBckgrndColor' : 0xffffff,
                    'tooltipLabelHalign': "left",
                    'tooltipFontSize': 18,
                    //	                    'tooltipFontColor' : 0x5b5f65,
                    'zoomImp': "",
                    'zoomWidth': 20,
                    'zoomHeight': 20,
                    'colZoomHoffset': 0,
                    'colZoomVoffset': 0,
                    'zoomBorderWidth': 1,
                    //	                    'zoomBorderColor' : 0xa6a8ab,
                    //	                    'zoomBckgrndColor' : 0xf2f2f2,
                    'rowContainSetRowPer': 3,
                    'rowContainScrlEndPos': 88,
                    'rowContainChldInitAlpha': 100,
                    'rowContainChldEndAlpha': 100,
                    'rowContainAutoNext': true,
                    'colBtnDefaultType': "Base",
                    'colBtnWidth': 86,
                    'colBtnHeight': 40,
                    'colBtnBorderStyle': "solid",
                    'colBtnBorderRadius': 0,
                    'colBtnShowBckgrnd': false,
                    'colRadShowImp': false,
                    'colChkShowImp': false,
                    //	                    'colBtnBckgrndColorUp' : 0xf2f2f2,
                    //	                    'colBtnBckgrndColorOver' : 0xa6a8ab,
                    //	                    'colBtnBckgrndColorDown' : 0xffbd1a,
                    'colRadImpUp': "",
                    'colRadImpOver': "",
                    'colRadImpDown': "",
                    'colChkImpUp': "",
                    'colChkImpOver': "",
                    'colChkImpDown': "",
                    'colBtnShowLabel': false,
                    'colBtnLabelPlacement': "bottom",
                    'colBtnLabelHalign': "left",
                    'colBtnLabelFontSize': 18,
                    'colBtnLabelHoffset': 0,
                    'colBtnLabelVoffset': 0,
                    //	                    'colBtnLabelColorUp' : 0x5b5f65,
                    //	                    'colBtnLabelColorOver' : 0x5b5f65,
                    //	                    'colBtnLabelColorDown' : 0x5b5f65,
                    'colBtnImgHoffset': 0,
                    'colBtnImgVoffset': 0,
                    'colShowStamp': false,
                    'colStampImp': "",
                    'colStampWidth': 30,
                    'colStampHeight': 30,
                    'colStampHoffset': 0,
                    'colStampVoffset': 0,
                    'colKantBtnLabelWidth': 100,
                    'colRadChckLabelWidth': 100,
                    'colOtherInitTxt': "Please specify...",
                    'colOtherMinVal': 1,
                    'colOtherMaxVal': 100,
                    'colOtherMsgWidth': 100,
                    'colBtnMouseOverDownShadow': false,
                    'colBtnMouseOverBounce': false,
                    'colBtnMouseOverScale': 100,
                    'colBtnMouseDownScale': 100,
                    'colBtnMouseDownAlpha': 100,
                    'colBtnUseTooltip': false,
                    'colBtnUseZoom': false,
                    'colBtnPadding': 5,
                    'colBtnBorderWidthUp': 2,
                    'colBtnBorderWidthOver': 2,
                    'colBtnBorderWidthDown': 2,
                    'colSldrHndleLabDispType': "none",
                    'colSldrHndleShowImp': true,
                    'colSldrDirection': "horizontal",
                    //'colSldrMinVal' : 0,
                    //'colSldrMaxVal' : 100,
                    'colSldrPrecVal': 0,
                    'colSldrTrackWidth': 440,
                    'colSldrTrackHeight': 12,
                    'colSldrTrackBorderStyle': "solid",
                    'colSldrTrackBorderWidth': 8,
                    'colSldrTrackBorderRadius': 24,
                    //	                    'colSldrTrackBorderColor' : 0xf2f2f2,
                    //	                    'colSldrTrackColor' : 0xd2d3d5,
                    'colSldrTrackShowImp': false,
                    'colSldrTrackImp': "",
                    'colSldrShowHighlight': true,
                    //	                    'colSldrHighlightColor' : 0x9fcc3b,
                    'colSldrTickWidth': 2,
                    'colSldrTickHeight': 2,
                    //	                    'colSldrTickColor' : 0x9fcc3b,
                    'colSldrTickLabDispType': "show all",
                    'colSldrTickLabWidth': 80,
                    'colSldrTickLabOffset': -67,
                    'colSldrTickLabFontSize': 16,
                    //	                    'colSldrTickLabColor' : 0x5b5f65,
                    'colSldrHndleInitLoc': 0,
                    'colSldrHndleWidth': 51,
                    'colSldrHndleHeight': 62,
                    'colSldrHndleBorderStyle': "solid",
                    'colSldrHndleBorderWidth': 12,
                    'colSldrHndleBorderRadius': 40,
                    //	                    'colSldrHndleColorUp' : 0xffffff,
                    //	                    'colSldrHndleColorDown' : 0xffffff,
                    'colSldrHndleLabFontSize': 16,
                    //	                    'colSldrHndleLabFontColor' : 0x5b5f65,
                    'colSldrHndleLabInitTxt': "",
                    'colSldrHndleLabHoffset': 0,
                    'colSldrHndleLabVoffset': 2,
                    'colSldrImgContWidth': 100,
                    'colSldrImgContHeight': 100,
                    'colSldrImgContHoffset': 0,
                    'colSldrImgContVoffset': 0,
                    'colSldrImgDispType': "none",
                    'compContainPos': "relative",
                    'compRTL': false,
                    'rowContainAutoWidth': true,
                    'rowContainAutoHeight': true,
                    'rowContainBckgrndDispType': "none",
                    'rowContainImgImport': "",
                    'rowContainImgImportHoffset': 0,
                    'rowContainImgImportVoffset': 0,
                    'rowContainShowLabel': false,
                    'rowContainLabelHalign': "left",
                    'rowContainLabelFontSize': 18,
                    'rowContainLabelPadding': 4,
                    //	                    'rowContainLabelColor' : 0x5b5f65,
                    'rowBtnPadding': 15,
                    'rowBtnBorderWidthUp': 2,
                    'rowBtnBorderWidthDown': 2,
                    //	                    'rowBtnBorderColorUp' : 0xa6a8ab,
                    //	                    'rowBtnBorderColorDown' : 0x5b5f65,
                    'rowBtnLabelOvrWidth': false,
                    'rowBtnLabelWidth': 150,
                    'rowBtnLabelOverlayShowBckgrnd': false,
                    //	                    'rowBtnLabelOverlayBckgrndColor' : 0xffffff,
                    'rowBtnLabelOverlayPadding': 5,
                    'rowTxtBtnAdjustHeightType': "none",
                    'zoomActionType': "click append image",
                    'zoomGalleryBorderStyle': "none",
                    'zoomGalleryBorderWidth': 0,
                    //	                    'zoomGalleryBorderColor' : 0xa6a8ab,
                    'colContainHeight': 400,
                    'colContainPadding': 0,
                    'colContainBckgrndDispType': "none",
                    'colContainImgImport': "",
                    'colContainImgImportHoffset': 0,
                    'colContainImgImportVoffset': 0,
                    'colContainShowLabel': false,
                    'colContainLabelHalign': "left",
                    'colContainLabelFontSize': 18,
                    'colContainLabelPadding': 4,
                    //	                    'colContainLabelColor' : 0x5b5f65,
                    'rowContainScrlAnimSpeed': 800,
                    'rowContainChldEnableAlpha': 50,
                    'rowContainGoOpaque': false,
                    //	                    'colBtnBorderColorUp' : 0xa6a8ab,
                    //	                    'colBtnBorderColorOver' : 0x5b5f65,
                    //	                    'colBtnBorderColorDown' : 0x5b5f65,
                    'colBtnLabelOvrWidth': false,
                    'colBtnLabelWidth': 100,
                    'colBtnLabelOverlayShowBckgrnd': false,
                    //	                    'colBtnLabelOverlayBckgrndColor' : 0xffffff,
                    'colBtnLabelOverlayPadding': 4,
                    'colTxtBtnAdjustHeightType': "none",
                    'colRadChckLabelHalign': "left",
                    'colRadChckLabelFontSize': 18,
                    //	                    'colRadChckLabelColorUp' : 0x5b5f65,
                    //	                    'colRadChckLabelColorOver' : 0x5b5f65,
                    //	                    'colRadChckLabelColorDown' : 0x5b5f65,
                    'colRadChckLabelHoffset': 0,
                    'colRadChckLabelVoffset': 2,
                    'colKntrInputTxtAreaWidth': 125,
                    'colKntrInputLabelHalign': "left",
                    'colKntrInputLabelWidth': 100,
                    'colKntrInputLabelHoffset': 0,
                    'colKntrInputLabelVoffset': 2,
                    'colKntrInputLabelFontSize': 18,
                    //	                    'colKntrInputLabelColorUp' : 0x5b5f65,
                    //	                    'colKntrInputLabelColorOver' : 0x5b5f65,
                    //	                    'colKntrInputLabelColorDown' : 0x5b5f65,
                    'colOtherInputHalign': "left",
                    'colOtherInputFontSize': 16,
                    //	                    'colOtherInputColor' : 0x5b5f65,
                    'colSldrTickLabCustomCnt': 5,
                    'colSldrTickHide': true,
                    'colSldrHndleShowBckgrnd': true,
                    'colSldrHndleShowImg': false,
                    'colSldrHndleSnapType': "none",
                    'colSldrHndlePadding': 0,
                    //	                    'colSldrHndleBorderColorUp' : 0xd2d3d5,
                    //	                    'colSldrHndleBorderColorDown' : 0x9ecc3b,
                    'colSldrShowInitImg': false,
                    'colSldrShowEndImg': false,
                    'colSldrImgEndWidth': 100,
                    'colSldrImgEndHeight': 100,
                    'colSldrImgEndHoffset': 0,
                    'colSldrImgEndVoffset': 0,
                    'colSldrHndleShowLabelBckgrnd': false,
                    //	                    'colSldrHndleLabBckgrndColor' : 0xffffff,
                    'colSlderAllowTrackClick': true,
                    'sliderEndTextLeft': "",
                    'sliderEndTextRight': "",
                    'showSliderEndText': false,
					'sliderEndTextWidth': 100,
					'sliderEndTextHeight': 80,
					'sliderEndTextMarginTop':10,
					'sliderEndTextMarginLeft':0,
					'sliderEndTextFontWeight':600,
					'sliderEndTextFontSize':18
                }

        case "PC":
        case "OTHERDEVICE":
        default:
            return {
                'rowBtnUseZoom': false,
                //	                    'rowBtnBckgrndColorDown' : "0x9fcc3b",
                'colContainLabel': "Column Container Label",
                'rowContainLabel': "Row Container Label",
                'rowBtnShowLabel': true,
                'rowBtnUseTooltip': false,
                'rowContainWidth': 970,
                'compQuestionType': "Single Choice",
                'rowContainType': "vertical layout",
                'rowContainPadding': 20,
                'rowContainHgap': 0,
                'rowContainVgap': 5,
                'rowContainHoffset': 20,
                'rowContainVoffset': 10,
                'rowContainBorderStyle': "none",
                'rowContainBorderWidth': 0,
                //	                    'rowContainBorderColor' : 0xf2f2f2,
                //	                    'rowContainBckgrndColor' : 0xf2f2f2,
                'rowBtnDefaultType': "None",
                'rowBtnWidth': 88,
                'rowBtnHeight': 88,
                'rowBtnBorderStyle': "solid",
                'rowBtnBorderRadius': 0,
                'rowBtnShowBckgrnd': false,
                //	                    'rowBtnBckgrndColorUp' : 0xf2f2f2,
                'rowBtnLabelPlacement': "top overlay",
                'rowBtnLabelHalign': "center",
                'rowBtnLabelFontSize': 18,
                'rowBtnLabelHoffset': 0,
                'rowBtnLabelVoffset': 18,
                //	                    'rowBtnLabelColorUp' : 0x5b5f65,
                //	                    'rowBtnLabelColorDown' : 0x5b5f65,
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
                //	                    'zoomOverlayBckgrndColor' : 0x000000,
                'zoomOverlayAlpha': 80,
                'zoomGalleryPadding': 10,
                'zoomGalleryHoffset': 0,
                'zoomGalleryVoffset': 0,
                'zoomCloseImp': "",
                'zoomCloseWidth': 22,
                'zoomCloseHeight': 22,
                'zoomCloseHoffset': 0,
                'zoomCloseVoffset': 0,
                'rowContainHeight': 500,
                'rowBckgrndShowImp': false,
                'rowBckgrndImpUp': "",
                'rowBckgrndImpDown': "",
                'colContainType': "horizontal grid layout",
                'colContainWidth': 600,
                'colContainHgap': 0,
                'colContainVgap': 0,
                'colContainHoffset': -30,
                'colContainVoffset': 10,
                'colContainBorderStyle': "none",
                'colContainBorderWidth': 0,
                //	                    'colContainBorderColor' : 0xa6a8ab,
                //	                    'colContainBckgrndColor' : 0xffffff,
                'tooltipWidth': 150,
                'tooltipBorderWidth': 2,
                //	                    'tooltipBorderColor' : "0xa6a8ab",
                //	                    'tooltipBckgrndColor' : 0xffffff,
                'tooltipLabelHalign': "left",
                'tooltipFontSize': 18,
                //	                    'tooltipFontColor' : 0x5b5f65,
                'zoomImp': "",
                'zoomWidth': 20,
                'zoomHeight': 20,
                'colZoomHoffset': 0,
                'colZoomVoffset': 0,
                'zoomBorderWidth': 1,
                //	                    'zoomBorderColor' : 0xa6a8ab,
                //	                    'zoomBckgrndColor' : 0xf2f2f2,
                'rowContainSetRowPer': 3,
                'rowContainScrlEndPos': 88,
                'rowContainChldInitAlpha': 100,
                'rowContainChldEndAlpha': 100,
                'rowContainAutoNext': true,
                'colBtnDefaultType': "Base",
                'colBtnWidth': 86,
                'colBtnHeight': 40,
                'colBtnBorderStyle': "solid",
                'colBtnBorderRadius': 0,
                'colBtnShowBckgrnd': false,
                'colRadShowImp': false,
                'colChkShowImp': false,
                //	                    'colBtnBckgrndColorUp' : 0xf2f2f2,
                //	                    'colBtnBckgrndColorOver' : 0xa6a8ab,
                //	                    'colBtnBckgrndColorDown' : 0xffbd1a,
                'colRadImpUp': "",
                'colRadImpOver': "",
                'colRadImpDown': "",
                'colChkImpUp': "",
                'colChkImpOver': "",
                'colChkImpDown': "",
                'colBtnShowLabel': false,
                'colBtnLabelPlacement': "bottom",
                'colBtnLabelHalign': "left",
                'colBtnLabelFontSize': 18,
                'colBtnLabelHoffset': 0,
                'colBtnLabelVoffset': 0,
                //	                    'colBtnLabelColorUp' : 0x5b5f65,
                //	                    'colBtnLabelColorOver' : 0x5b5f65,
                //	                    'colBtnLabelColorDown' : 0x5b5f65,
                'colBtnImgHoffset': 0,
                'colBtnImgVoffset': 0,
                'colShowStamp': false,
                'colStampImp': "",
                'colStampWidth': 30,
                'colStampHeight': 30,
                'colStampHoffset': 0,
                'colStampVoffset': 0,
                'colKantBtnLabelWidth': 100,
                'colRadChckLabelWidth': 100,
                'colOtherInitTxt': "Please specify...",
                'colOtherMinVal': 1,
                'colOtherMaxVal': 100,
                'colOtherMsgWidth': 100,
                'colBtnMouseOverDownShadow': false,
                'colBtnMouseOverBounce': false,
                'colBtnMouseOverScale': 100,
                'colBtnMouseDownScale': 100,
                'colBtnMouseDownAlpha': 100,
                'colBtnUseTooltip': false,
                'colBtnUseZoom': false,
                'colBtnPadding': 5,
                'colBtnBorderWidthUp': 2,
                'colBtnBorderWidthOver': 2,
                'colBtnBorderWidthDown': 2,
                'colSldrHndleLabDispType': "none",
                'colSldrHndleShowImp': true,
                'colSldrDirection': "horizontal",
                //'colSldrMinVal' : 0,
                //'colSldrMaxVal' : 100,
                'colSldrPrecVal': 0,
                'colSldrTrackWidth': 440,
                'colSldrTrackHeight': 12,
                'colSldrTrackBorderStyle': "solid",
                'colSldrTrackBorderWidth': 8,
                'colSldrTrackBorderRadius': 24,
                //	                    'colSldrTrackBorderColor' : 0xf2f2f2,
                //	                    'colSldrTrackColor' : 0xd2d3d5,
                'colSldrTrackShowImp': false,
                'colSldrTrackImp': "",
                'colSldrShowHighlight': true,
                //	                    'colSldrHighlightColor' : 0x9fcc3b,
                'colSldrTickWidth': 2,
                'colSldrTickHeight': 2,
                //	                    'colSldrTickColor' : 0x9fcc3b,
                'colSldrTickLabDispType': "show all",
                'colSldrTickLabWidth': 80,
                'colSldrTickLabOffset': -58,
                'colSldrTickLabFontSize': 16,
                //	                    'colSldrTickLabColor' : 0x5b5f65,
                'colSldrHndleInitLoc': 0,
                'colSldrHndleWidth': 41,
                'colSldrHndleHeight': 52,
                'colSldrHndleBorderStyle': "solid",
                'colSldrHndleBorderWidth': 12,
                'colSldrHndleBorderRadius': 40,
                //	                    'colSldrHndleColorUp' : 0xffffff,
                //	                    'colSldrHndleColorDown' : 0xffffff,
                'colSldrHndleLabFontSize': 16,
                //	                    'colSldrHndleLabFontColor' : 0x5b5f65,
                'colSldrHndleLabInitTxt': "",
                'colSldrHndleLabHoffset': 0,
                'colSldrHndleLabVoffset': 0,
                'colSldrImgContWidth': 100,
                'colSldrImgContHeight': 100,
                'colSldrImgContHoffset': 0,
                'colSldrImgContVoffset': 0,
                'colSldrImgDispType': "none",
                'compContainPos': "relative",
                'compRTL': false,
                'rowContainAutoWidth': true,
                'rowContainAutoHeight': true,
                'rowContainBckgrndDispType': "none",
                'rowContainImgImport': "",
                'rowContainImgImportHoffset': 0,
                'rowContainImgImportVoffset': 0,
                'rowContainShowLabel': false,
                'rowContainLabelHalign': "left",
                'rowContainLabelFontSize': 18,
                'rowContainLabelPadding': 4,
                //	                    'rowContainLabelColor' : 0x5b5f65,
                'rowBtnPadding': 15,
                'rowBtnBorderWidthUp': 2,
                'rowBtnBorderWidthDown': 2,
                //	                    'rowBtnBorderColorUp' : 0xa6a8ab,
                //	                    'rowBtnBorderColorDown' : 0x5b5f65,
                'rowBtnLabelOvrWidth': false,
                'rowBtnLabelWidth': 150,
                'rowBtnLabelOverlayShowBckgrnd': false,
                //	                    'rowBtnLabelOverlayBckgrndColor' : 0xffffff,
                'rowBtnLabelOverlayPadding': 5,
                'rowTxtBtnAdjustHeightType': "none",
                'zoomActionType': "click append image",
                'zoomGalleryBorderStyle': "none",
                'zoomGalleryBorderWidth': 0,
                //	                    'zoomGalleryBorderColor' : 0xa6a8ab,
                'colContainHeight': 400,
                'colContainPadding': 0,
                'colContainBckgrndDispType': "none",
                'colContainImgImport': "",
                'colContainImgImportHoffset': 0,
                'colContainImgImportVoffset': 0,
                'colContainShowLabel': false,
                'colContainLabelHalign': "left",
                'colContainLabelFontSize': 18,
                'colContainLabelPadding': 4,
                //	                    'colContainLabelColor' : 0x5b5f65,
                'rowContainScrlAnimSpeed': 800,
                'rowContainChldEnableAlpha': 50,
                'rowContainGoOpaque': false,
                //	                    'colBtnBorderColorUp' : 0xa6a8ab,
                //	                    'colBtnBorderColorOver' : 0x5b5f65,
                //	                    'colBtnBorderColorDown' : 0x5b5f65,
                'colBtnLabelOvrWidth': false,
                'colBtnLabelWidth': 100,
                'colBtnLabelOverlayShowBckgrnd': false,
                //	                    'colBtnLabelOverlayBckgrndColor' : 0xffffff,
                'colBtnLabelOverlayPadding': 4,
                'colTxtBtnAdjustHeightType': "none",
                'colRadChckLabelHalign': "left",
                'colRadChckLabelFontSize': 14,
                //	                    'colRadChckLabelColorUp' : 0x5b5f65,
                //	                    'colRadChckLabelColorOver' : 0x5b5f65,
                //	                    'colRadChckLabelColorDown' : 0x5b5f65,
                'colRadChckLabelHoffset': 0,
                'colRadChckLabelVoffset': 5,
                'colKntrInputTxtAreaWidth': 125,
                'colKntrInputLabelHalign': "left",
                'colKntrInputLabelWidth': 100,
                'colKntrInputLabelHoffset': 0,
                'colKntrInputLabelVoffset': 7,
                'colKntrInputLabelFontSize': 18,
                //	                    'colKntrInputLabelColorUp' : 0x5b5f65,
                //	                    'colKntrInputLabelColorOver' : 0x5b5f65,
                //	                    'colKntrInputLabelColorDown' : 0x5b5f65,
                'colOtherInputHalign': "left",
                'colOtherInputFontSize': 16,
                //	                    'colOtherInputColor' : 0x5b5f65,
                'colSldrTickLabCustomCnt': 5,
                'colSldrTickHide': true,
                'colSldrHndleShowBckgrnd': true,
                'colSldrHndleShowImg': false,
                'colSldrHndleSnapType': "none",
                'colSldrHndlePadding': 0,
                //	                    'colSldrHndleBorderColorUp' : 0xd2d3d5,
                //	                    'colSldrHndleBorderColorDown' : 0x9ecc3b,
                'colSldrShowInitImg': false,
                'colSldrShowEndImg': false,
                'colSldrImgEndWidth': 100,
                'colSldrImgEndHeight': 100,
                'colSldrImgEndHoffset': 0,
                'colSldrImgEndVoffset': 0,
                'colSldrHndleShowLabelBckgrnd': false,
                //	                    'colSldrHndleLabBckgrndColor' : 0xffffff,
                'colSlderAllowTrackClick': true,
                'sliderEndTextLeft': "",
                'sliderEndTextRight': "",
                'showSliderEndText': false,
				'sliderEndTextWidth': 100,
				'sliderEndTextHeight': 80,
				'sliderEndTextMarginTop':10,
				'sliderEndTextMarginLeft':0,
				'sliderEndTextFontWeight':600,
				'sliderEndTextFontSize':14
				
            }
    }
}