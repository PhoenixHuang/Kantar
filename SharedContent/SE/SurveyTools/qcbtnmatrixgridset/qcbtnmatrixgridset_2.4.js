/**
 * qcbtnmatrixgridset class
 * Inherits from SESurveyTool
 */
function qcbtnmatrixgridset(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
qcbtnmatrixgridset.prototype = Object.create(SESurveyTool.prototype);
qcbtnmatrixgridset.prototype.type = function(){
    return "qcbtnmatrixgridset";
}
qcbtnmatrixgridset.prototype.getDependencies = function(){
    return [
        {'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcomponent/BtnMatrix/BtnMatrix.js'}
        //{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QFactory.js'},
		//{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QContainer.js'},
		//{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QWidget.js'} 
    ];
}
qcbtnmatrixgridset.prototype.setInitialResponses = function (){
    var dimResp = [];
    $.each(this.subquestions, function(rowid, e) {
        var colResp = [];
        $.each(e.inputs.filter(":checked"), function(i, e) {
            colResp.push({index:$(e).attr("colid")});
        });
        dimResp.push({rowIndex: rowid, colIndex:colResp});
    });
    this.component.setDimenResp(dimResp);
}
qcbtnmatrixgridset.prototype.setResponses = function (){
    console.log("Set responses");
    var response = this.getResponse();
    if (response == null) return;
    console.log("Set responses2");
    this.clearInputs(); // need to clear the responses before setting them.
    var that = this;

    $.each($(response.Value), function(i,e) { // Sets categories
        if(typeof surveyPlatform=="undefined"){      // This code belongs to Dimensions
			var resp = e.split('^');
			var inputs = that.subquestions[resp[0]].inputs;
			var multi = inputs.filter('input[type=checkbox]');
			if (multi) inputs.filter('[value='+resp[1]+']').val($.makeArray(resp[1]));
			else inputs.val($.makeArray(resp[1]));
		}else if(surveyPlatform=="Nfield"){     // This code belongs to Nfield
			var resp = e.split('^');
			var resp1=resp[0].split('-');
			var inputs = that.subquestions[resp1[1]].inputs;
			var temp = resp[1].split('-');
			inputs.filter('[value='+resp1[0]+'-'+temp[1]+']').val($.makeArray(resp1[0]+'-'+temp[1]));
			if (inputs.filter('[value='+resp[1]+']').attr('otherid') != '') {
				that.inputs.filter('[id='+inputs.filter('[value='+resp[1]+']').attr('otherid')+']').val(response[e]);
			}
		}
    });

}
qcbtnmatrixgridset.prototype.build = function(){
        this.component = new BtnMatrix();
		var finalparams=this.params();
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
            label.find('span').removeClass('mrQuestionText');
			label.find("span").removeClass('mrSingleText');
            label.find("span").removeClass('mrMultipleText');
            label.find("span").attr('style','');

            var image = label.find('img');
            image.remove();
			
			//alert($(that.subquestions[0].inputs[i]).val() +"-->"+ label.text());
			
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

        
        this.component.rowArray(rowArray);
        this.component.columnArray(colArray);
        this.component.baseTool="btnmatrix";
        this.component.params(finalparams);
        this.deferred.resolve();
}
qcbtnmatrixgridset.prototype.toolOptions = function() {
        $.extend(this.options, eval("this.options."+qcbtnmatrixgridset.prototype.type()));
		switch(pageLayout.deviceType.toUpperCase()) {
            case "LARGETABLET":
            case "MEDIUMTABLET":
            case "SMALLTABLET":
            case "SMARTPHONETOUCH":
			    if(this.orientation==0||this.orientation==180) 
                return  {
						'compQuestionType': "Single Choice",
						'rowContainType': "set layout",
						'rowBtnUseZoom': false,
						'rowContainLabel': "",
						'rowBtnShowLabel': true,
						'rowBtnUseTooltip': false,
						'rowContainWidth': 0,
						'rowContainPadding': 0,
						'rowContainHgap': 20,
						'rowContainVgap': 20,
						'rowContainHoffset': 0,
						'rowContainVoffset': 0,
						'rowBtnDefaultType': "Label only",
						'rowBtnWidth': 185,
						'rowBtnHeight': 100,
						'rowBtnBorderStyle': "solid",
						'rowBtnBorderRadius': 5,
						'rowBtnLabelPlacement': "bottom",
						'rowBtnLabelHalign': "right",
						'rowBtnLabelFontSize': 15,
						'rowBtnLabelHoffset': 0,
						'rowBtnLabelVoffset': 0,
//						'rowBtnLabelColorUp': 0x555555,
//						'rowBtnLabelColorDown': 0x555555,
						'rowBtnImgHoffset': 0,
						'rowBtnImgVoffset': 0,
						'rowShowStamp': false,
						'rowStampWidth': 30,
						'rowStampHeight': 30,
						'rowStampHoffset': 0,
						'rowStampVoffset': 0,
						'rowKantBtnLabelWidth': 100,
						'rowZoomHoffset': 0,
						'rowZoomVoffset': 0,
//						'zoomOverlayBckgrndColor': 0x000000,
						'zoomOverlayAlpha': 88,
						'zoomGalleryPadding': 10,
						'zoomGalleryHoffset': 0,
						'zoomGalleryVoffset': 0,
						'zoomCloseWidth': 22,
						'zoomCloseHeight': 22,
						'zoomCloseHoffset': 0,
						'zoomCloseVoffset': 0,
						'rowContainHeight': 0,
						'rowBckgrndShowImp': false,
						'rowBckgrndImpUp': "",
						'rowBckgrndImpDown': "",
						'colContainType': "horizontal layout",
						'colContainWidth': 600,
						'colContainHgap': 2,
						'colContainVgap': 20,
						'colContainHoffset': 0,
						'colContainVoffset': 0,
						'colContainBorderStyle': "solid",
						'colContainBorderWidth': 0,
//						'colContainBorderColor': 0xcccccc,
//						'colContainBckgrndColor': 0xffffff,
						'tooltipWidth': 100,
						'tooltipBorderWidth': 1,
//						'tooltipBorderColor': 0xcccccc,
//						'tooltipBckgrndColor': 0xf5f5f5,
						'tooltipLabelhalign': "left",
						'tooltipfontsize': 12,
//						'tooltipfontColor': 0x555555,
						'zoomWidth': 20,
						'zoomHeight': 20,
						'colZoomHoffset': 0,
						'colZoomVoffset': 0,
						'zoomBorderWidth': 1,
//						'zoomBorderColor': 0xcccccc,
//						'zoomBckgrndColor': 0xf5f5f5,
						'rowContainSetRowPer': 5,
						'rowContainScrlEndPos': -300,
						'rowContainChldInitAlpha': 0,
						'rowContainChldEndAlpha': 100,
						'rowContainAutoNext': true,
						'colBtnDefaultType': "Text",
						'colBtnWidth': 95,
						'colBtnHeight': 50,
						'colBtnBorderStyle': "solid",
						'colBtnBorderRadius': 0,
						'colBtnShowBckgrnd': true,
						'colRadShowImp': false,
						'colChkShowImp': false,
//						'colBtnBckgrndColorUp': 0xf5f5f5,
//						'colBtnBckgrndColorOver': 0x9FCC3B,
//						'colBtnBckgrndColorDown': 0x9FCC3B,
						'colRadImpUp': "",
						'colRadImpover': "",
						'colRadImpDown': "",
						'colChkImpUp': "",
						'colChkImpover': "",
						'colChkImpDown': "",
						'colBtnShowLabel': true,
						'colBtnLabelPlacement': "bottom",
						'colBtnLabelHalign': "center",
						'colBtnLabelFontSize': 15,
						'colBtnLabelHoffset': 0,
						'colBtnLabelVoffset': 0,
//						'colBtnLabelColorUp': 0x333333,
//						'colBtnLabelColorOver': 0xffffff,
//						'colBtnLabelColorDown': 0xffffff,
						'colBtnImgHoffset': 0,
						'colBtnImgVoffset': 0,
						'colShowStamp': false,
						'colStampWidth': 30,
						'colStampHeight': 30,
						'colStampHoffset': 0,
						'colStampVoffset': 0,
						'colkantBtnLabelWidth': 100,
						'colRadChckLabelWidth': 100,
						'colRadChckWidthRadio': 30,
						'colRadChckHeightRadio': 30,
						'colRadChckWidthcheck': 30,
						'colRadChckHeightcheck': 30,
						'colOtherInitTxt': "Please specify...",
						'colOtherMinVal': 1,
						'colOtherMaxVal': 100,
						'colOtherMsgWidth': 100,
						'colOtherInvalidMsg': "Number is invalid",
						'colOtherRangeMsg': "Number must be >= min & <= max",
						'colBtnMouseOverDownShadow': false,
						'colBtnMouseOverBounce': false,
						'colBtnMouseOverScale': 100,
						'colBtnMouseDownScale': 100,
						'colBtnMouseDownAlpha': 100,
						'colBtnUseTooltip': false,
						'colBtnUseZoom': false,
						'rowContainGoOpaque': false,
//						'colBtnBorderColorOver': 0x9FCC3B,
//						'colBtnBorderColorDown': 0x9FCC3B,
						'rowContainShowBckgrnd': false,
//						'rowBtnLabelBckgrndColor': 0xf2f2f2,
						'rowTxtBtnBckgrndTrim': false,
						'zoomGalleryMaxWidth': 500,
						'zoomGalleryMaxHeight': 500,
						'compCapValue': 0,
						'rowContainPos': "relative",
						'colContainShowBckgrnd': false,
						'colBtnBorderWidth': 1,
//						'colBtnLabelBckgrndColor': 0xf2f2f2,
						'colTxtBtnBckgrndTrim': false,
						'compClickType': "Default",
//						'rowBtnBckgrndColorDown': 0xfce6c9,
						'colContainLabel': "",
						'rowContainBorderStyle': "solid",
						'rowContainBorderWidth': 0,
//						'rowContainBorderColor': 0xcccccc,
//						'rowContainBckgrndColor': 0xf5f5f5,
						'rowBtnBorderWidth': 1,
//						'rowBtnBorderColor': 0xcccccc,
						'rowBtnShowBckgrnd': false,
//						'rowBtnBckgrndColorUp': 0xf5f5f5,
						'rowBtnLabelPadding': 2,
						'rowBtnImgPadding': 5,
						'rowContainScrlInitPos': 500,
						'rowContainScrlDispPos': 220,
						'rowContainChildOpaq': 100,
//						'colBtnBorderColor': 0xcccccc,
						'colBtnImgPadding': 5,
						'colBtnLabelPadding': 2,
						'colBtnBorderWidthDown': 2,
						'colBtnBorderWidthOver': 2,
						'colBtnPadding':4
				}
			else
                return {
						'compQuestionType': "Single Choice",
						'rowContainType': "set layout",
						'rowBtnUseZoom': false,
						'rowContainLabel': "",
						'rowBtnShowLabel': true,
						'rowBtnUseTooltip': false,
						'rowContainWidth': 0,
						'rowContainPadding': 0,
						'rowContainHgap': 20,
						'rowContainVgap': 20,
						'rowContainHoffset': 0,
						'rowContainVoffset': 0,
						'rowBtnDefaultType': "Label only",
						'rowBtnWidth': 185,
						'rowBtnHeight': 100,
						'rowBtnBorderStyle': "solid",
						'rowBtnBorderRadius': 5,
						'rowBtnLabelPlacement': "bottom",
						'rowBtnLabelHalign': "right",
						'rowBtnLabelFontSize': 15,
						'rowBtnLabelHoffset': 0,
						'rowBtnLabelVoffset': 0,
//						'rowBtnLabelColorUp': 0x555555,
//						'rowBtnLabelColorDown': 0x555555,
						'rowBtnImgHoffset': 0,
						'rowBtnImgVoffset': 0,
						'rowShowStamp': false,
						'rowStampWidth': 30,
						'rowStampHeight': 30,
						'rowStampHoffset': 0,
						'rowStampVoffset': 0,
						'rowKantBtnLabelWidth': 100,
						'rowZoomHoffset': 0,
						'rowZoomVoffset': 0,
//						'zoomOverlayBckgrndColor': 0x000000,
						'zoomOverlayAlpha': 88,
						'zoomGalleryPadding': 10,
						'zoomGalleryHoffset': 0,
						'zoomGalleryVoffset': 0,
						'zoomCloseWidth': 22,
						'zoomCloseHeight': 22,
						'zoomCloseHoffset': 0,
						'zoomCloseVoffset': 0,
						'rowContainHeight': 0,
						'rowBckgrndShowImp': false,
						'rowBckgrndImpUp': "",
						'rowBckgrndImpDown': "",
						'colContainType': "horizontal layout",
						'colContainWidth': 600,
						'colContainHgap': 2,
						'colContainVgap': 20,
						'colContainHoffset': 0,
						'colContainVoffset': 0,
						'colContainBorderStyle': "solid",
						'colContainBorderWidth': 0,
//						'colContainBorderColor': 0xcccccc,
//						'colContainBckgrndColor': 0xffffff,
						'tooltipWidth': 100,
						'tooltipBorderWidth': 1,
//						'tooltipBorderColor': 0xcccccc,
//						'tooltipBckgrndColor': 0xf5f5f5,
						'tooltipLabelhalign': "left",
						'tooltipfontsize': 12,
//						'tooltipfontColor': 0x555555,
						'zoomWidth': 20,
						'zoomHeight': 20,
						'colZoomHoffset': 0,
						'colZoomVoffset': 0,
						'zoomBorderWidth': 1,
//						'zoomBorderColor': 0xcccccc,
//						'zoomBckgrndColor': 0xf5f5f5,
						'rowContainSetRowPer': 5,
						'rowContainScrlEndPos': -300,
						'rowContainChldInitAlpha': 0,
						'rowContainChldEndAlpha': 100,
						'rowContainAutoNext': true,
						'colBtnDefaultType': "Text",
						'colBtnWidth': 95,
						'colBtnHeight': 50,
						'colBtnBorderStyle': "solid",
						'colBtnBorderRadius': 0,
						'colBtnShowBckgrnd': true,
						'colRadShowImp': false,
						'colChkShowImp': false,
//						'colBtnBckgrndColorUp': 0xf5f5f5,
//						'colBtnBckgrndColorOver': 0x9FCC3B,
//						'colBtnBckgrndColorDown': 0x9FCC3B,
						'colRadImpUp': "",
						'colRadImpover': "",
						'colRadImpDown': "",
						'colChkImpUp': "",
						'colChkImpover': "",
						'colChkImpDown': "",
						'colBtnShowLabel': true,
						'colBtnLabelPlacement': "bottom",
						'colBtnLabelHalign': "center",
						'colBtnLabelFontSize': 15,
						'colBtnLabelHoffset': 0,
						'colBtnLabelVoffset': 0,
//						'colBtnLabelColorUp': 0x333333,
//						'colBtnLabelColorOver': 0xffffff,
//						'colBtnLabelColorDown': 0xffffff,
						'colBtnImgHoffset': 0,
						'colBtnImgVoffset': 0,
						'colShowStamp': false,
						'colStampWidth': 30,
						'colStampHeight': 30,
						'colStampHoffset': 0,
						'colStampVoffset': 0,
						'colkantBtnLabelWidth': 100,
						'colRadChckLabelWidth': 100,
						'colRadChckWidthRadio': 30,
						'colRadChckHeightRadio': 30,
						'colRadChckWidthcheck': 30,
						'colRadChckHeightcheck': 30,
						'colOtherInitTxt': "Please specify...",
						'colOtherMinVal': 1,
						'colOtherMaxVal': 100,
						'colOtherMsgWidth': 100,
						'colOtherInvalidMsg': "Number is invalid",
						'colOtherRangeMsg': "Number must be >= min & <= max",
						'colBtnMouseOverDownShadow': false,
						'colBtnMouseOverBounce': false,
						'colBtnMouseOverScale': 100,
						'colBtnMouseDownScale': 100,
						'colBtnMouseDownAlpha': 100,
						'colBtnUseTooltip': false,
						'colBtnUseZoom': false,
						'rowContainGoOpaque': false,
//						'colBtnBorderColorOver': 0x9FCC3B,
//						'colBtnBorderColorDown': 0x9FCC3B,
						'rowContainShowBckgrnd': false,
//						'rowBtnLabelBckgrndColor': 0xf2f2f2,
						'rowTxtBtnBckgrndTrim': false,
						'zoomGalleryMaxWidth': 500,
						'zoomGalleryMaxHeight': 500,
						'compCapValue': 0,
						'rowContainPos': "relative",
						'colContainShowBckgrnd': false,
						'colBtnBorderWidth': 1,
//						'colBtnLabelBckgrndColor': 0xf2f2f2,
						'colTxtBtnBckgrndTrim': false,
						'compClickType': "Default",
//						'rowBtnBckgrndColorDown': 0xfce6c9,
						'colContainLabel': "",
						'rowContainBorderStyle': "solid",
						'rowContainBorderWidth': 0,
//						'rowContainBorderColor': 0xcccccc,
//						'rowContainBckgrndColor': 0xf5f5f5,
						'rowBtnBorderWidth': 1,
//						'rowBtnBorderColor': 0xcccccc,
						'rowBtnShowBckgrnd': false,
//						'rowBtnBckgrndColorUp': 0xf5f5f5,
						'rowBtnLabelPadding': 2,
						'rowBtnImgPadding': 5,
						'rowContainScrlInitPos': 500,
						'rowContainScrlDispPos': 220,
						'rowContainChildOpaq': 100,
//						'colBtnBorderColor': 0xcccccc,
						'colBtnImgPadding': 5,
						'colBtnLabelPadding': 2,
						'colBtnBorderWidthDown': 2,
						'colBtnBorderWidthOver': 2,
						'colBtnPadding':4
                }			
            case "PC":
            case "OTHERDEVICE":
            default:
                return {
						'compQuestionType': "Single Choice",
						'rowContainType': "set layout",
						'rowBtnUseZoom': false,
						'rowContainLabel': "",
						'rowBtnShowLabel': true,
						'rowBtnUseTooltip': false,
						'rowContainWidth': 0,
						'rowContainPadding': 0,
						'rowContainHgap': 20,
						'rowContainVgap': 20,
						'rowContainHoffset': 0,
						'rowContainVoffset': 0,
						'rowBtnDefaultType': "Label only",
						'rowBtnWidth': 185,
						'rowBtnHeight': 100,
						'rowBtnBorderStyle': "solid",
						'rowBtnBorderRadius': 5,
						'rowBtnLabelPlacement': "bottom",
						'rowBtnLabelHalign': "right",
						'rowBtnLabelFontSize': 15,
						'rowBtnLabelHoffset': 0,
						'rowBtnLabelVoffset': 0,
//						'rowBtnLabelColorUp': 0x555555,
//						'rowBtnLabelColorDown': 0x555555,
						'rowBtnImgHoffset': 0,
						'rowBtnImgVoffset': 0,
						'rowShowStamp': false,
						'rowStampWidth': 30,
						'rowStampHeight': 30,
						'rowStampHoffset': 0,
						'rowStampVoffset': 0,
						'rowKantBtnLabelWidth': 100,
						'rowZoomHoffset': 0,
						'rowZoomVoffset': 0,
//						'zoomOverlayBckgrndColor': 0x000000,
						'zoomOverlayAlpha': 88,
						'zoomGalleryPadding': 10,
						'zoomGalleryHoffset': 0,
						'zoomGalleryVoffset': 0,
						'zoomCloseWidth': 22,
						'zoomCloseHeight': 22,
						'zoomCloseHoffset': 0,
						'zoomCloseVoffset': 0,
						'rowContainHeight': 0,
						'rowBckgrndShowImp': false,
						'rowBckgrndImpUp': "",
						'rowBckgrndImpDown': "",
						'colContainType': "horizontal layout",
						'colContainWidth': 600,
						'colContainHgap': 2,
						'colContainVgap': 20,
						'colContainHoffset': 0,
						'colContainVoffset': 0,
						'colContainBorderStyle': "solid",
						'colContainBorderWidth': 0,
//						'colContainBorderColor': 0xcccccc,
//						'colContainBckgrndColor': 0xffffff,
						'tooltipWidth': 100,
						'tooltipBorderWidth': 1,
//						'tooltipBorderColor': 0xcccccc,
//						'tooltipBckgrndColor': 0xf5f5f5,
						'tooltipLabelhalign': "left",
						'tooltipfontsize': 12,
//						'tooltipfontColor': 0x555555,
						'zoomWidth': 20,
						'zoomHeight': 20,
						'colZoomHoffset': 0,
						'colZoomVoffset': 0,
						'zoomBorderWidth': 1,
//						'zoomBorderColor': 0xcccccc,
//						'zoomBckgrndColor': 0xf5f5f5,
						'rowContainSetRowPer': 5,
						'rowContainScrlEndPos': -300,
						'rowContainChldInitAlpha': 0,
						'rowContainChldEndAlpha': 100,
						'rowContainAutoNext': true,
						'colBtnDefaultType': "Text",
						'colBtnWidth': 100,
						'colBtnHeight': 50,
						'colBtnBorderStyle': "solid",
						'colBtnBorderRadius': 0,
						'colBtnShowBckgrnd': true,
						'colRadShowImp': false,
						'colChkShowImp': false,
//						'colBtnBckgrndColorUp': 0xf5f5f5,
//						'colBtnBckgrndColorOver': 0x9FCC3B,
//						'colBtnBckgrndColorDown': 0x9FCC3B,
						'colRadImpUp': "",
						'colRadImpover': "",
						'colRadImpDown': "",
						'colChkImpUp': "",
						'colChkImpover': "",
						'colChkImpDown': "",
						'colBtnShowLabel': true,
						'colBtnLabelPlacement': "bottom",
						'colBtnLabelHalign': "center",
						'colBtnLabelFontSize': 15,
						'colBtnLabelHoffset': 0,
						'colBtnLabelVoffset': 0,
//						'colBtnLabelColorUp': 0x333333,
//						'colBtnLabelColorOver': 0xffffff,
//						'colBtnLabelColorDown': 0xffffff,
						'colBtnImgHoffset': 0,
						'colBtnImgVoffset': 0,
						'colShowStamp': false,
						'colStampWidth': 30,
						'colStampHeight': 30,
						'colStampHoffset': 0,
						'colStampVoffset': 0,
						'colkantBtnLabelWidth': 100,
						'colRadChckLabelWidth': 100,
						'colRadChckWidthRadio': 30,
						'colRadChckHeightRadio': 30,
						'colRadChckWidthcheck': 30,
						'colRadChckHeightcheck': 30,
						'colOtherInitTxt': "Please specify...",
						'colOtherMinVal': 1,
						'colOtherMaxVal': 100,
						'colOtherMsgWidth': 100,
						'colOtherInvalidMsg': "Number is invalid",
						'colOtherRangeMsg': "Number must be >= min & <= max",
						'colBtnMouseOverDownShadow': false,
						'colBtnMouseOverBounce': false,
						'colBtnMouseOverScale': 100,
						'colBtnMouseDownScale': 100,
						'colBtnMouseDownAlpha': 100,
						'colBtnUseTooltip': false,
						'colBtnUseZoom': false,
						'rowContainGoOpaque': false,
//						'colBtnBorderColorOver': 0x9FCC3B,
//						'colBtnBorderColorDown': 0x9FCC3B,
						'rowContainShowBckgrnd': false,
//						'rowBtnLabelBckgrndColor': 0xf2f2f2,
						'rowTxtBtnBckgrndTrim': false,
						'zoomGalleryMaxWidth': 500,
						'zoomGalleryMaxHeight': 500,
						'compCapValue': 0,
						'rowContainPos': "relative",
						'colContainShowBckgrnd': false,
						'colBtnBorderWidth': 1,
//						'colBtnLabelBckgrndColor': 0xf2f2f2,
						'colTxtBtnBckgrndTrim': false,
						'compClickType': "Default",
//						'rowBtnBckgrndColorDown': 0xfce6c9,
						'colContainLabel': "",
						'rowContainBorderStyle': "solid",
						'rowContainBorderWidth': 0,
//						'rowContainBorderColor': 0xcccccc,
//						'rowContainBckgrndColor': 0xf5f5f5,
						'rowBtnBorderWidth': 1,
//						'rowBtnBorderColor': 0xcccccc,
						'rowBtnShowBckgrnd': false,
//						'rowBtnBckgrndColorUp': 0xf5f5f5,
						'rowBtnLabelPadding': 2,
						'rowBtnImgPadding': 5,
						'rowContainScrlInitPos': 500,
						'rowContainScrlDispPos': 220,
						'rowContainChildOpaq': 100,
//						'colBtnBorderColor': 0xcccccc,
						'colBtnImgPadding': 5,
						'colBtnLabelPadding': 2,
						'colBtnBorderWidthDown': 2,
						'colBtnBorderWidthOver': 2,
						'colBtnPadding':4
                }
        }
}