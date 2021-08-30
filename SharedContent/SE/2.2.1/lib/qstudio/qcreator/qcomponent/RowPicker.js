/**
 * RowPicker Javascript File
 * Version : 1.3.0
 * Date : 2014-26-09
 *
 * RowPicker Component.
 * BaseClassType : Single
 * Requires rowArray dataset.
 * Confluence Link : https://docs.gmi-mr.com/confluence/display/midev/RowPicker+Component+Documentation
 *
 */

var RowPicker = (function () {

    function RowPicker() {
        this.qStudioVar = {
            isUpdating : false,
            isCompRTL : false,
            interact : true,
            isDC : false,
            params : this.initParams(),
            rowArray : [],
            rowAcceptedWgts : [
                "base",
                "kantarbase",
                "flow",
                "text",
                "radiocheck",
                "other",
                "other numeric",
                "kantarother",
                "kantarother numeric"
            ]
        };
    }
    
    RowPicker.prototype = {
        ///////////////////////////////////
        /** QStudio required code begin **/
        ///////////////////////////////////

        renderDC: function(parent) {
            //console.log("DC Rendering on parent");
            this.qStudioVar.interact = true;
            this.qStudioVar.isDC = true;
            this.create(parent);
        },

        renderSD: function(parent) {
            //console.log("SD Rendering on parent");
            this.qStudioVar.interact = false;
            this.qStudioVar.isDC = false;
            this.create(parent);                
        },

        renderDEMO: function(parent) {
            //console.log("DEMO Rendering on parent");
            this.qStudioVar.interact = true;
            this.qStudioVar.isDC = false;
            this.create(parent); 
        },

        rowArray: function() {
            var arg = arguments[0];
            if (typeof arg === 'undefined') {
                //console.log("Getting rowArray");
                return this.qStudioVar.rowArray; 
            }
            
            if (jQuery.isArray(arg)) {
                //console.log("Setting rowArray");
                this.qStudioVar.rowArray = arg;  
            } 
        },

        dimensions: function() {
            return [ 
                { name:"rowArray", prop:[ 
                    "label",            // Row object label 
                    "image",            // Row object image url
                    "description",      // Row object description
                    "var1",             // Row object button type
                    "var2"              // Row object isRadio prop
                ] }
            ];
        },

        params: function() {
            var arg = arguments[0];            
            if (typeof arg === 'undefined') {
                //console.log("Getting paramaters");   
                var parArr = [],
                    orderParams = QUtility.orderParams(this.qStudioVar.params);

                for (var i in orderParams) {
                    if (orderParams.hasOwnProperty(i)) {
                        var o = {
                            parameter: i,
                            paramvalue: this.qStudioVar.params[i].value,
                            paramdescription: this.qStudioVar.params[i].description,
                            paramtype: this.qStudioVar.params[i].type,
                            paramname: this.qStudioVar.params[i].name,
                            paramwgtref: this.qStudioVar.params[i].wgtref,
                            paramwgtname: this.qStudioVar.params[i].wgtname,
                            paramdisplay: this.qStudioVar.params[i].display
                        };
                        if (this.qStudioVar.params[i].order) { o.paramorder = this.qStudioVar.params[i].order; }
                        if (this.qStudioVar.params[i].min) { o.parammin = this.qStudioVar.params[i].min; }
                        if (this.qStudioVar.params[i].max) { o.parammax = this.qStudioVar.params[i].max; }
                        if (this.qStudioVar.params[i].step) { o.paramstep = this.qStudioVar.params[i].step; }
                        if (this.qStudioVar.params[i].options) { o.paramoptions = this.qStudioVar.params[i].options; }
                        if (this.qStudioVar.params[i].display) { o.paramdisplay = this.qStudioVar.params[i].display; }
                        parArr.push(o)
                    }
                }
                return parArr;
            }
            
            if (jQuery.isArray(arg)) {
                //console.log("Setting paramaters");   
                for (var i=0, argLen=arg.length; i<argLen; i+=1) {
                    var o = this.qStudioVar.params[arg[i].parameter] || {};
                    this.qStudioVar.params[arg[i].parameter] = o;
                    if (typeof arg[i].paramvalue !== 'undefined') { o.value = arg[i].paramvalue; }
                    if (typeof arg[i].paramdescription !== 'undefined') { o.description = arg[i].paramdescription; }
                    if (typeof arg[i].paramtype !== 'undefined') {
                        o.type = arg[i].paramtype;
                        if (o.type.toLowerCase() === "number" && typeof o.value === "string") {
                            o.value = parseInt(o.value, 10);
                        }
                    }
                    if (typeof arg[i].paramname !== 'undefined') { o.name = arg[i].paramname; }
                    if (typeof arg[i].paramwgtref !== 'undefined') { o.wgtref = arg[i].paramwgtref; }
                    if (typeof arg[i].paramwgtname !== 'undefined') { o.wgtname = arg[i].paramwgtname; }
                    if (typeof arg[i].paramorder !== 'undefined') { o.order = arg[i].paramorder; }
                    if (typeof arg[i].paramdisplay !== 'undefined') { o.display = arg[i].paramdisplay; }
                    if (typeof arg[i].parammin !== 'undefined') { o.min = arg[i].parammin; }
                    if (typeof arg[i].parammax !== 'undefined') { o.max = arg[i].parammax; }
                    if (typeof arg[i].paramstep !== 'undefined') { o.step = arg[i].paramstep; }
                    if (typeof arg[i].paramoptions !== 'undefined') { o.options = arg[i].paramoptions; }
                }
            } 
        },

        dcProxy: function() {
            var arg = arguments[0];
            if (typeof arg === 'undefined') { 
                //console.log("Getting DC Proxy");
                return this.qStudioVar.dcProxy;
            } else {
                //console.log("Setting DC Proxy");
                this.qStudioVar.dcProxy = arg;
            }
        },

        description: function() {
            return 'RowPicker component description...';  
        },

        baseClassType: function() {
            // single column base class type
            return 'single';
        },

        questionType: function() {
            var qtype = this.qStudioVar.params.compQuestionType.value.toLowerCase();
            if (qtype.indexOf('multiple') !== -1) { return 'multi'; }
            return 'single';
        },

        getLibraries: function() {
            return [
                "http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js",
                "qcreator/qcore/QFactory.js", 
                "qcreator/qcore/QContainer.js", 
                "qcreator/qcore/QWidget.js"
            ];
        },

        initParams: function() {
            return {
                // Component Parameters
                compQuestionType: { name:"Component: Question Type", value:'Multiple Choice', description:"Component question type.", type:"combo", options:['Single Choice', 'Multiple Choice', 'Multiple Soft Cap', 'Multiple Hard Cap'], order: 1 },
                compCapValue: { name:"Component: Cap Value", value:0, description:"Restrict the number of button selections.", type:"number", min:2, order: 2 },
                compContainPos: { name:"Component: CSS Position", value:"relative", description:"Component container CSS position.", type:"combo", options:["absolute", "relative"], order: 4 },
                compRTL: { name:"Component: RTL Enable", value:false, description:"If set true, component will be setup to support right-to-left languages.", type:"bool", order:24 },
                compPrimFontFamily: { name:"Component: Primary Font Family", value:"Arial, Helvetica, sans-serif", description:"Font used for button and layout labels.", type:"string", order:19 },
                compSecFontFamily: { name:"Component: Secondary Font Family", value:"‘Arial Narrow’, sans-serif", description:"Font used for textarea inputs.", type:"string", order:19 },

                // Row Container Parameters
                rowContainType: { name:"Row Contain: Layout Type", value:"horizontal grid layout", description:"Layout template applied to row buttons.", type:"combo", options:["horizontal grid layout", "vertical grid layout", "horizontal layout", "vertical layout"], order: 3 },
                rowContainWidth: { name:"Row Contain: Bckgrnd Width", value:800, description:"Row container background width, in pixels.", type:"number", min:50, wgtref: 'rowcontain', wgtname:"width", order: 5 },
                rowContainHeight: { name:"Row Contain: Bckgrnd Height", value:600, description:"Row container background height, in pixels.", type:"number", min:50, wgtref: 'rowcontain', wgtname:"height", order: 6 },
                rowContainPadding: { name:"Row Contain: Bckgrnd Padding", value:10, description:"Row container background padding, in pixels.", type:"number", min:0, wgtref: 'rowcontain', wgtname:"padding", order: 7 },
                rowContainAutoWidth: { name:"Row Contain: Autosize Bckgrnd Width", value:true, description:"If set true, row container width will be automatically set.", type:"bool", wgtref: 'rowcontain', wgtname:"autoWidth", order:17 },
                rowContainAutoHeight: { name:"Row Contain: Autosize Bckgrnd Height", value:true, description:"If set true, row container height will be automatically set.", type:"bool", wgtref: 'rowcontain', wgtname:"autoHeight", order:18 },
                rowContainHgap: { name:"Row Contain: Horz Btn Spacing", value:10, description:"The horizontal spacing of row buttons, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"hgap", order: 8 },
                rowContainVgap: { name:"Row Contain: Vert Btn Spacing", value:10, description:"The vertical spacing of row buttons, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"vgap", order: 9 },
                rowContainHoffset: { name:"Row Contain: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"left", order: 10 },
                rowContainVoffset: { name:"Row Contain: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"top", order: 11 },
                rowContainOptHalign: { name:"Row Contain: Option Horz Alignment", value:'left', description:"Row option horizontal alignment.", type:"combo", options:['left', 'center', 'right'], wgtref: 'rowcontain', wgtname:"option_halign", order:20 },
                rowContainOptValign: { name:"Row Contain: Option Vert Alignment", value:'top', description:"Row option vertical alignment.", type:"combo", options:['top', 'middle', 'bottom'], wgtref: 'rowcontain', wgtname:"option_valign", order:20 },
                rowContainBckgrndDispType: { name:"Row Contain: Bckgrnd Display Type", value:"vector", description:"Row container background display type.", type:"combo", options:["vector", "import", "none"], order: 3 },
                rowContainBorderStyle: { name:"Row Contain: Border Style", value:"none", description:"Row container CSS border style.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'rowcontain', wgtname:"border_style", order: 12 },
                rowContainBorderWidth: { name:"Row Contain: Border Width", value:1, description:"Row container border width, in pixels.", type:"number", min:0, wgtref: 'rowcontain', wgtname:"border_width", order: 13 },
                rowContainBorderColor: { name:"Row Contain: Border Color", value:0xd2d3d5, description:"Row container border color.", type:"colour", wgtref: 'rowcontain', wgtname:"border_color", order: 14 },
                rowContainBckgrndColor: { name:"Row Contain: Bckgrnd Color", value:0xFFFFFF, description:"Row container background color.", type:"colour", wgtref: 'rowcontain', wgtname:"bckgrnd_color", order: 15 },
                rowContainImgImport: { name:"Row Contain: Import Bckgrnd", value:"", description:"Row container imported background image.", type:"bitmapdata", wgtref: 'rowcontain', wgtname:"bckgrnd_import", order:26 },
                rowContainImgImportHoffset: { name:"Row Contain: Import Bckgrnd Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"bckgrnd_import_left", order:27 },
                rowContainImgImportVoffset: { name:"Row Contain: Import Bckgrnd Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"bckgrnd_import_top", order:28 },
                rowContainShowLabel: { name:"Row Contain: Show Label", value:false, description:"If set true, row container label will display.", type:"bool", wgtref: 'rowcontain', wgtname:"show_label", order:24 },
                rowContainLabel: { name:"Row Contain: Label Text", value:"Please make your selection(s)", description:"Row container label text.", type:"string", wgtref: 'rowcontain', wgtname:"label", order:19 },
                rowContainLabelHalign: { name:"Row Contain: Label Horz Alignment", value:'left', description:"Row container label horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowcontain', wgtname:"label_halign", order:20 },
                rowContainLabelFontSize: { name:"Row Contain: Label Font Size", value:18, description:"Row container label font size, in pixels.", type:"number", min:5, wgtref: 'rowcontain', wgtname:"label_fontsize", order:21 },
                rowContainLabelPadding: { name:"Row Contain: Label Padding", value:4, description:"Row container label padding, in pixels.", type:"number", min:0, wgtref: 'rowcontain', wgtname:"label_padding", order:22 },
                rowContainLabelColor: { name:"Row Contain: Label Font Color", value:0x5B5F65, description:"Row container label font color.", type:"colour", wgtref: 'rowcontain', wgtname:"label_fontcolor", order:23 },

                // Row Button Background Parameters
                rowBtnDefaultType: { name:"Row Btn: Default Button Type", value:"Base", description:"Default button type used by component.", type:"combo", options:["Base", "Text", "RadioCheck", "Flow", "KantarBase"], order:29 },
                rowBtnWidth: { name:"Row Btn: Bckgrnd Width", value:100, description:"Button background width, in pixels", type:"number", min:10, wgtref: 'rowbtn', wgtname:"width", order:30 },
                rowBtnHeight: { name:"Row Btn: Bckgrnd Height", value:100, description:"Button background height, in pixels", type:"number", min:10, wgtref: 'rowbtn', wgtname:"height", order:31 },
                rowBtnPadding: { name:"Row Btn: Bckgrnd Padding", value:4, description:"Button background padding, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"padding", order:32 },
                rowBtnShowBckgrnd: { name:"Row Btn: Show Bckgrnd", value:true, description:"If set false, button background will not display.", type:"bool", wgtref: 'rowbtn', wgtname:"show_bckgrnd", order:42 },
                rowBtnBorderStyle: { name:"Row Btn: Border Style", value:"solid", description:"Button background CSS border style.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'rowbtn', wgtname:"border_style", order:33 },
                rowBtnBorderRadius: { name:"Row Btn: Border Radius", value:0, description:"Button background border radius, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_radius", order:35 },
                rowBtnBorderWidthUp: { name:"Row Btn: Border UP Width", value:2, description:"Button background border width (in pixels) in its default state.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_width_up", order:34 },
                rowBtnBorderWidthOver: { name:"Row Btn: Border OVER Width", value:3, description:"Button background border width (in pixels) on mouse over.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_width_over", order:34 },
                rowBtnBorderWidthDown: { name:"Row Btn: Border DOWN Width", value:2, description:"Button background border width (in pixels) when button is selected.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_width_down", order:34 },
                rowBtnBorderColorUp: { name:"Row Btn: Border UP Color", value:0xd2d3d5, description:"Button background border color in its default state.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_up", order:36 },
                rowBtnBorderColorOver: { name:"Row Btn: Border OVER Color", value:0xa6a8ab, description:"Button background border color on mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_over", order:37 },
                rowBtnBorderColorDown: { name:"Row Btn: Border DOWN Color", value:0xffbd1a, description:"Button background border color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_down", order:38 },
                rowBtnBckgrndColorUp: { name:"Row Btn: Bckgrnd UP Color", value:0xFFFFFF, description:"Button background color in its default state.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_up", order:39 },
                rowBtnBckgrndColorOver: { name:"Row Btn: Bckgrnd OVER Color", value:0xFFFFFF, description:"Button background color on mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_over", order:40 },
                rowBtnBckgrndColorDown: { name:"Row Btn: Bckgrnd DOWN Color", value:0xFFFFFF, description:"Button background color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_down", order:41 },
                rowRadShowImp: { name:"Row Btn: Show Import RADIO Bckgrnd", value:false, description:"If set true, buttons which behave like Radio buttons will display an imported background image.", type:"bool", wgtref: 'rowbtn', wgtname:"show_bckgrnd_import", order:49 },
                rowRadImpUp: { name:"Row Btn: RADIO Import UP Bckgrnd", value:"", description:"Import background image to use when button is in its default state.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"bckgrnd_import_up", order:43 },
                rowRadImpOver: { name:"Row Btn: RADIO Import OVER Bckgrnd", value:"", description:"Import background image to use on button mouse over.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"bckgrnd_import_over", order:44 },
                rowRadImpDown: { name:"Row Btn: RADIO Import DOWN Bckgrnd", value:"", description:"Import background image to use on button select.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"bckgrnd_import_down", order:45 },
                rowChkShowImp: { name:"Row Btn: Show Import CHECK Bckgrnd", value:false, description:"If set true, buttons which behave like Checkbox buttons will display an imported background image.", type:"bool", wgtref: 'rowbtn', wgtname:"show_bckgrnd_import", order:50 },
                rowChkImpUp: { name:"Row Btn: CHECK Import UP Bckgrnd", value:"", description:"Import background image to use when button is in its default state", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"bckgrnd_import_up", order:46 },
                rowChkImpOver: { name:"Row Btn: CHECK Import OVER Bckgrnd", value:"", description:"Import background image to use on button mouse over.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"bckgrnd_import_over", order:47 },
                rowChkImpDown: { name:"Row Btn: CHECK Import DOWN Bckgrnd", value:"", description:"Import background image to use on button select.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"bckgrnd_import_down", order:48 },

                // Row Button Label Parameters
                rowBtnShowLabel: { name:"Row Label: Display", value:true, description:"If set false, button label will not display.", type:"bool", wgtref: 'rowbtn', wgtname:"show_label", order:60 },
                rowBtnLabelOvrWidth: { name:"Row Label: Overwrite Width", value:false, description:"If set true, a custom label width can be set.", type:"bool", wgtref: 'rowbtn', wgtname:"label_ovr_width", order:60 },
                rowBtnLabelWidth: { name:"Row Label: Custom Width", value:125, description:"Custom label width, in pixels.", type:"number", min:10, wgtref: 'rowbtn', wgtname:"label_width", order:30 },
                rowBtnLabelPlacement: { name:"Row Label: Placement", value:'bottom', description:"Button label placement.", type:"combo", options:['top', 'bottom', 'bottom overlay', 'top overlay', 'center overlay'], wgtref: 'rowbtn', wgtname:"label_placement", order:51 },
                rowBtnLabelHalign: { name:"Row Label: Horz Alignment", value:'left', description:"Button label horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowbtn', wgtname:"label_halign", order:52 },
                rowBtnLabelHoffset: { name:"Row Label: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"label_left", order:54 },
                rowBtnLabelVoffset: { name:"Row Label: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"label_top", order:55 },
                rowBtnLabelFontSize: { name:"Row Label: Font Size", value:18, description:"Button label font size, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"label_fontsize", order:53 },
                rowBtnLabelColorUp: { name:"Row Label: UP Font Color", value:0x5B5F65, description:"Button label font color in the button’s default state.", type:"colour", wgtref: 'rowbtn', wgtname:"label_fontcolor_up", order:56 },
                rowBtnLabelColorOver: { name:"Row Label: OVER Font Color", value:0x5B5F65, description:"Button label font color on button mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"label_fontcolor_over", order:57 },
                rowBtnLabelColorDown: { name:"Row Label: DOWN Font Color", value:0x5B5F65, description:"Button label font color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"label_fontcolor_down", order:58 },
                rowBtnLabelOverlayShowBckgrnd: { name:"Row Label Overlay: Display Bckgrnd", value:true, description:"If set true, overlay labels will display a background color.", type:"bool", wgtref: 'rowbtn', wgtname:"show_label_bckgrnd", order:61 },
                rowBtnLabelOverlayBckgrndColor: { name:"Row Label Overlay: Bckgrnd Color", value:0xFFFFFF, description:"Overlay label background color.", type:"colour", wgtref: 'rowbtn', wgtname:"label_bckgrnd_color", order:59 },
                rowBtnLabelOverlayPadding: { name:"Row Label Overlay: Padding", value:4, description:"Overlay label padding, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"label_overlay_padding", order:32 },

                // Row Button Image Parameters
                rowBtnImgHoffset: { name:"Row Image: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"img_left", order:62 },
                rowBtnImgVoffset: { name:"Row Image: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"img_top", order:63 },

                // Row Button Stamp Parameters
                rowShowStamp: { name:"Row Stamp: Display", value:false, description:"If set true, imported stamp will display when button is selected.", type:"bool", wgtref: 'rowbtn', wgtname:"show_stamp", order:69 },
                rowStampImp: { name:"Row Stamp: Import Image", value:"", description:"Imported stamp image to use on button select.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"stamp_import", order:64 },
                rowStampWidth: { name:"Row Stamp: Width", value:30, description:"Stamp image width, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"stamp_width", order:65 },
                rowStampHeight: { name:"Row Stamp: Height", value:30, description:"Stamp image height, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"stamp_height", order:66 },
                rowStampHoffset: { name:"Row Stamp: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"stamp_left", order:67 },
                rowStampVoffset: { name:"Row Stamp: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"stamp_top", order:68 },

                // Row Input Button Specific Parameters
                rowOtherShowLabel: { name:"Row Other: Display Label", value:true, description:"If set false, button label will not display.", type:"bool",  wgtref: 'rowbtn', wgtname:"other_show_label", order:60, display: false },
                rowOtherInputHalign: { name:"Row Other: TextArea Horz Alignment", value:'left', description:"Textarea input horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowbtn', wgtname:"textarea_halign", order:52, display: false },
                rowOtherInputFontSize: { name:"Row Other: TextArea Font Size", value:16, description:"Textarea input font size, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"textarea_fontsize", order:53, display: false },
                rowOtherInputColor: { name:"Row Other: TextArea Color", value:0x5B5F65, description:"Textarea input font color.", type:"colour", wgtref: 'rowbtn', wgtname:"textarea_fontcolor", order:56, display: false },
                rowOtherInitTxt: { name:"Row Other: TextArea Default Text", value:"Please specify", description:"Initial text to display in the textarea input.", type:"string", wgtref: 'rowbtn', wgtname:"other_init_txt", order:81, display: false },
                rowOtherInvalidMsg: { name:"Row Other Numeric: Invalid Msg Text", value:"Number is invalid", description:"Message to display when an invalid number is entered.", type:"string", wgtref: 'rowbtn', wgtname:"other_msg_invalid", order:85, display: false },
                rowOtherRangeMsg: { name:"Row Other Numeric: Range Msg Text", value:"Number must be >= min & <= max", description:"Message to display when a number is not within range. If the message contains the word min and/or max they will be substituted with their numeric parameter values.", type:"string", wgtref: 'rowbtn', wgtname:"other_msg_range", order:86, display: false },
                rowOtherMsgWidth: { name:"Row Other Numeric: Msg Width", value:150, description:"Width of error message label, in pixels.", type:"number", min:5, order:84, display: false },
                rowOtherMinVal: { name:"Row Other Numeric: Min Input Value", value:1, description:"Minimum numeric input allowed.", type:"number", wgtref: 'rowbtn', wgtname:"other_min", order:82, display: false },
                rowOtherMaxVal: { name:"Row Other Numeric: Max Input Value", value:100, description:"Maximum numeric input allowed.", type:"number", wgtref: 'rowbtn', wgtname:"other_max", order:83, display: false },

                // Row Button Specific Parameters
                rowTxtBtnAdjustHeightType: { name:"Row Text: Auto Height Type", value:'none', description:"Select how the auto height feature for Text widget is applied. When selecting the option 'all', the max height is calculated across all Text widgets and used as the button height. The option 'individual' will be the most space saving as each widget is cropped individually.", type:"combo", options:['none', 'individual', 'all'], order:73 },
                rowRadChckImpRadio: { name:"Row RadChk: RADIO Import Bckgrnd", value:"", description:"Import image to use for Radio button types. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"radchkbtn_rad_url", order:75 },
                rowRadChckWidthRadio: { name:"Row RadChk: RADIO Bckgrnd Width", value:30, description:"Width used for Radio import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"radchkbtn_rad_width", order:76 },
                rowRadChckHeightRadio: { name:"Row RadChk: RADIO Bckgrnd Height", value:30, description:"Height used for Radio import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"radchkbtn_rad_height", order:77 },
                rowRadChckImpCheck: { name:"Row RadChk: CHECK Import Bckgrnd", value:"", description:"Import image to use for Checkbox button types. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"radchkbtn_chk_url", order:78 },
                rowRadChckWidthCheck: { name:"Row RadChk: CHECK Bckgrnd Width", value:30, description:"Width used for Checkbox import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"radchkbtn_chk_width", order:79 },
                rowRadChckHeightCheck: { name:"Row RadChk: CHECK Bckgrnd Height", value:30, description:"Height used for Checkbox import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"radchkbtn_chk_height", order:80 },
                rowRadChckLabelHalign: { name:"Row RadChk: Label Horz Alignment", value:'left', description:"Button label horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowbtn', wgtname:"radchkbtn_label_halign", order:73 },
                rowRadChckLabelWidth: { name:"Row RadChk: Label Width", value:125, description:"Button label width, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"radchkbtn_label_width", order:72 },
                rowRadChckLabelHoffset: { name:"Row RadChk: Label Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"radchkbtn_label_left", order:54, display: false },
                rowRadChckLabelVoffset: { name:"Row RadChk: Label Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"radchkbtn_label_top", order:55, display: false },
                rowRadChckLabelFontSize: { name:"Row RadChk: Label Font Size", value:18, description:"Button label font size, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"radchkbtn_label_fontsize", order:74 },
                rowRadChckLabelColorUp: { name:"Row RadChk: Label UP Font Color", value:0x5B5F65, description:"Button label font color in the button’s default state.", type:"colour", wgtref: 'rowbtn', wgtname:"radchkbtn_label_fontcolor_up", order:56 },
                rowRadChckLabelColorOver: { name:"Row RadChk: Label OVER Font Color", value:0x5B5F65, description:"Button label font color on button mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"radchkbtn_label_fontcolor_over", order:57 },
                rowRadChckLabelColorDown: { name:"Row RadChk: Label DOWN Font Color", value:0x5B5F65, description:"Button label font color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"radchkbtn_label_fontcolor_down", order:58 },
                rowKntrInputImpRadio: { name:"Row KantarInput: RADIO Import Bckgrnd", value:"", description:"Import image to use for Radio button types. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"kntrinputbtn_rad_url", order:75, display: false },
                rowKntrInputWidthRadio: { name:"Row KantarInput: RADIO Bckgrnd Width", value:30, description:"Width used for Radio import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_rad_width", order:76, display: false },
                rowKntrInputHeightRadio: { name:"Row KantarInput: RADIO Bckgrnd Height", value:30, description:"Height used for Radio import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_rad_height", order:77, display: false },
                rowKntrInputImpCheck: { name:"Row KantarInput: CHECK Import Bckgrnd", value:"", description:"Import image to use for Checkbox button types. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"kntrinputbtn_chk_url", order:78, display: false },
                rowKntrInputWidthCheck: { name:"Row KantarInput: CHECK Bckgrnd Width", value:30, description:"Width used for Checkbox import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_chk_width", order:79, display: false },
                rowKntrInputHeightCheck: { name:"Row KantarInput: CHECK Bckgrnd Height", value:30, description:"Height used for Checkbox import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_chk_height", order:80, display: false },
                rowKntrInputTxtAreaWidth: { name:"Row KantarInput: TextArea Width", value:125, description:"Button textarea input width, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_input_width", order:72, display: false },
                rowKntrInputLabelHalign: { name:"Row KantarInput: Label Horz Alignment", value:'left', description:"Button label horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_halign", order:73, display: false },
                rowKntrInputLabelWidth: { name:"Row KantarInput: Label Width", value:125, description:"Button label width, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_width", order:72, display: false },
                rowKntrInputLabelHoffset: { name:"Row KantarInput: Label Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_left", order:54, display: false },
                rowKntrInputLabelVoffset: { name:"Row KantarInput: Label Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_top", order:55, display: false },
                rowKntrInputLabelFontSize: { name:"Row KantarInput: Label Size", value:18, description:"Button label font size, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_fontsize", order:74, display: false },
                rowKntrInputLabelColorUp: { name:"Row KantarInput: Label UP Color", value:0x5B5F65, description:"Button label font color in the button’s default state.", type:"colour", wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_fontcolor_up", order:56, display: false },
                rowKntrInputLabelColorOver: { name:"Row KantarInput: Label OVER Color", value:0x5B5F65, description:"Button label font color on button mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_fontcolor_over", order:57, display: false },
                rowKntrInputLabelColorDown: { name:"Row KantarInput: Label DOWN Color", value:0x5B5F65, description:"Button label font color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_fontcolor_down", order:58, display: false },

                // Row Animation Parameters
                rowBtnReverseScaleAlpha: { name:"Row Animation: Enable Single Choice Reverse", value:false, description:"If set true and question type is Single Choice, all unselected buttons will be affected by the DOWN Scale and Transparency parameters when a button is selected.", type:"bool", order:49 },
                rowBtnMouseOverDownShadow: { name:"Row Animation: OVER/DOWN Show Shadow", value:false, description:"If set true, button background will display a shadow on mouse over and select states.", type:"bool", wgtref: 'rowbtn', wgtname:"mouseover_shadow", order:87 },
                rowBtnMouseOverBounce: { name:"Row Animation: OVER Bounce", value:false, description:"If set true, button does a slight bounce on mouse over.", type:"bool", wgtref: 'rowbtn', wgtname:"mouseover_bounce", order:88 },
                rowBtnMouseOverScale: { name:"Row Animation: OVER State Scale", value:100, description:"Button scale on mouse over.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"mouseover_scale", order:89 },
                rowBtnMouseDownScale: { name:"Row Animation: DOWN State Scale", value:100, description:"Button scale on button selection.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"mousedown_scale", order:90 },
                rowBtnMouseDownAlpha: { name:"Row Animation: DOWN State Transparency", value:100, description:"Button opacity on button selection.", type:"number", min:0, max:100, wgtref: 'rowbtn', wgtname:"mousedown_alpha", order:91 },

                // Tooltip Parameters
                rowBtnUseTooltip: { name:"Tooltip: Enable for Row Btn", value:false, description:"If set true and widget has a description, the tooltip feature will be enabled.", type:"bool", wgtref: 'rowbtn', wgtname:"use_tooltip", order:92 },
                tooltipWidth: { name:"Tooltip: Bckgrnd Width", value:150, description:"Tooltip background width, in pixels.", type:"number", min:5, wgtref: 'tooltip', wgtname:"tooltip_width", order:93 },
                tooltipLabelHalign: { name:"Tooltip: Text Horz Alignment", value:'left', description:"Tooltip horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'tooltip', wgtname:"tooltip_halign", order:97 },
                tooltipFontSize: { name:"Tooltip: Font Size", value:18, description:"Tooltip font size, in pixels.", type:"number", min:5, wgtref: 'tooltip', wgtname:"tooltip_fontsize", order:98 },
                tooltipFontColor: { name:"Tooltip: Font Color", value:0x5B5F65, description:"Tooltip font color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_fontcolor", order:99 },
                tooltipBorderWidth: { name:"Tooltip: Border Width", value:2, description:"Tooltip border width, in pixels.", type:"number", min:0, wgtref: 'tooltip', wgtname:"tooltip_border_width", order:94, display: false },
                tooltipBorderColor: { name:"Tooltip: Border Color", value:0xd2d3d5, description:"Tooltip border color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_border_color", order:95, display: false },
                tooltipBckgrndColor: { name:"Tooltip: Bckgrnd Color", value:0xFFFFFF, description:"Tooltip background color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_bckgrnd_color", order:96, display: false },

                // LightBox Parameters
                rowBtnUseZoom: { name:"LightBox: Enable for Row Btn", value:false, description:"If set true and widget has an image, the lightbox feature will be enabled.", type:"bool", wgtref: 'rowbtn', wgtname:"use_lightbox", order:100 },
                zoomActionType: { name:"LightBox: Action Type", value:'click append image', description:"User action type to display image.", type:"combo", options:['click append image', 'click append widget', 'mouseover'], wgtref: 'ctz', wgtname:"action_type", order:52 },
                rowZoomHoffset: { name:"LightBox: Zoom Btn Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"zoom_left", order:112 },
                rowZoomVoffset: { name:"LightBox: Zoom Btn Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"zoom_top", order:113 },
                zoomImp: { name:"LightBox: Zoom Btn Import Image", value:"", description:"Zoom button imported image.", type:"bitmapdata", wgtref: 'ctz', wgtname:"zoom_import", order:109 },
                zoomWidth: { name:"LightBox: Zoom Btn Width", value:20, description:"Zoom button width, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"zoom_width", order:110 },
                zoomHeight: { name:"LightBox: Zoom Btn Height", value:20, description:"Zoom button height, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"zoom_height", order:111 },
                zoomBorderWidth: { name:"LightBox: Zoom Btn Border Width", value:1, description:"Zoom button border width, in pixels.", type:"number", min:0, wgtref: 'ctz', wgtname:"zoom_border_width", order:114, display: false },
                zoomBorderColor: { name:"LightBox: Zoom Btn Border Color", value:0xd2d3d5, description:"Zoom button border color.", type:"colour", wgtref: 'ctz', wgtname:"zoom_border_color", order:115, display: false },
                zoomBckgrndColor: { name:"LightBox: Zoom Btn Bckgrnd Color", value:0xFFFFFF, description:"Zoom button background color.", type:"colour", wgtref: 'ctz', wgtname:"zoom_bckgrnd_color", order:116, display: false },
                zoomCloseImp: { name:"LightBox: Close Btn Import Image", value:"", description:"Close button imported image.", type:"bitmapdata", wgtref: 'ctz', wgtname:"close_import", order:117 },
                zoomCloseWidth: { name:"LightBox: Close Btn Width", value:22, description:"Close button width, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"close_width", order:118 },
                zoomCloseHeight: { name:"LightBox: Close Btn Height", value:22, description:"Close button height, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"close_height", order:119 },
                zoomCloseHoffset: { name:"LightBox: Close Btn Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'ctz', wgtname:"close_left", order:120 },
                zoomCloseVoffset: { name:"LightBox: Close Btn Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'ctz', wgtname:"close_top", order:121 },
                zoomOverlayBckgrndColor: { name:"LightBox: Overlay Color", value:0x000000, description:"Overlay background color.", type:"colour", wgtref: 'ctz', wgtname:"overlay_bckgrnd_color", order:101, display: false },
                zoomOverlayAlpha: { name:"LightBox: Overlay Transparency", value:80, description:"Overlay background opacity.", type:"number", min:0, max:100, wgtref: 'ctz', wgtname:"overlay_alpha", order:102, display: false },
                zoomGalleryPadding: { name:"LightBox: Image Padding", value:10, description:"Image gallery padding, in pixels.", type:"number", min:0, wgtref: 'ctz', wgtname:"gallery_padding", order:103, display: false },
                zoomGalleryHoffset: { name:"LightBox: Image Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'ctz', wgtname:"gallery_left", order:104, display: false },
                zoomGalleryVoffset: { name:"LightBox: Image Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'ctz', wgtname:"gallery_top", order:105, display: false },
                zoomGalleryBorderStyle: { name:"LightBox: Image Border Style", value:"none", description:"Image gallery CSS border style.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'ctz', wgtname:"gallery_border_style", order: 106, display: false },
                zoomGalleryBorderWidth: { name:"LightBox: Image Border Width", value:0, description:"Image gallery border width, in pixels.", type:"number", min:0, wgtref: 'ctz', wgtname:"gallery_border_width", order: 107, display: false },
                zoomGalleryBorderColor: { name:"LightBox: Image Border Color", value:0xd2d3d5, description:"Image gallery border color.", type:"colour", wgtref: 'ctz', wgtname:"gallery_border_color", order: 108, display: false }
            };
        },

        ///////////////////////////////////
        /** QStudio required code end **/
        ///////////////////////////////////

        __getParamObj: function(value, wgtName) {
            var configObj = {};
            for (var key in this.qStudioVar.params) {
                if (this.qStudioVar.params.hasOwnProperty(key)) {
                    if (this.qStudioVar.params[key].wgtref && this.qStudioVar.params[key].wgtref.toLowerCase().indexOf(value) !== -1) {
                        (!wgtName) ?
                            configObj[key] = {
                                value : this.qStudioVar.params[key].value,
                                type : this.qStudioVar.params[key].type,
                                options : this.qStudioVar.params[key].options,
                                min : this.qStudioVar.params[key].min,
                                wgtname : this.qStudioVar.params[key].wgtname,
                                wgtexclude : !!this.qStudioVar.params[key].wgtexclude
                            } : configObj[this.qStudioVar.params[key].wgtname] = this.qStudioVar.params[key].value;
                    }
                }
            }

            // additional parameter presets
            if (wgtName) {
                configObj.isRTL = this.qStudioVar.isCompRTL;
                configObj.primary_font_family = this.qStudioVar.params.compPrimFontFamily.value;
                configObj.secondary_font_family = this.qStudioVar.params.compSecFontFamily.value;
                switch (value) {
                    case 'rowcontain' :
                        configObj.id = "QRowContainer";
                        configObj.show_bckgrnd = (this.qStudioVar.params.rowContainBckgrndDispType.value.toLowerCase() === "vector");
                        configObj.show_bckgrnd_import = (this.qStudioVar.params.rowContainBckgrndDispType.value.toLowerCase() === "import");
                        configObj.direction = (this.qStudioVar.params.rowContainType.value.toLowerCase().indexOf("vertical") !== -1) ? "vertical" : "horizontal";
                        break;
                    case 'rowbtn' :
                        configObj.reverse_scale = (this.questionType() === "single" && this.qStudioVar.params.rowBtnReverseScaleAlpha.value);
                        configObj.txtbtn_trim = (this.qStudioVar.params.rowTxtBtnAdjustHeightType.value !== "none");
                        break;
                    default :
                        break;
                }
            }

            return configObj;
        },

        __validateParam: function(paramNameObj, wgtNameObj, configObj, key) {
            var type = paramNameObj[key].type,
                options = paramNameObj[key].options,
                min = paramNameObj[key].min,
                userValue = configObj[key];

            switch (type) {
                case "number" :
                    if (QUtility.isNumber(userValue)) {
                        if (QUtility.isNumber(min)) {
                            if (userValue >= min) { wgtNameObj[paramNameObj[key].wgtname] = userValue; }
                        } else {
                            wgtNameObj[paramNameObj[key].wgtname] = userValue;
                        }
                    }
                    break;
                case "bool" :
                    if (typeof userValue === "boolean") { wgtNameObj[paramNameObj[key].wgtname] = userValue; }
                    break;
                case "string" :
                    if (QUtility.isString(userValue)) { wgtNameObj[paramNameObj[key].wgtname] = userValue; }
                    break;
                case "combo" :
                    if (jQuery.isArray(options) && options.length > 0) {
                        for (var i = 0, len = options.length; i < len; i += 1) {
                            if (jQuery.trim(options[i]).toLowerCase() === jQuery.trim(userValue).toLowerCase()) {
                                wgtNameObj[paramNameObj[key].wgtname] = jQuery.trim(options[i]);
                                break;
                            }
                        }
                    }
                    break;
                case "colour" :
                    if (QUtility.paramToHex(userValue)) { wgtNameObj[paramNameObj[key].wgtname] = userValue; }
                    break;
                default :
                    break;
            }
        },

        __setRowBtnLevelParams: function(rowObject, wgtNameObj) {
            var paramNameObj = this.getRowBtnParams();
            for (var key in rowObject) {
                if (rowObject.hasOwnProperty(key) && (rowObject[key] !== null && rowObject[key] !== undefined)) {
                    if (paramNameObj.hasOwnProperty(key)) {
                        if (!paramNameObj[key].wgtexclude) {
                            switch (key) {
                                case "rowRadShowImp" :
                                    if (wgtNameObj.isRadio && typeof rowObject[key] === 'boolean') { wgtNameObj['show_bckgrnd_import'] = rowObject[key]; }
                                    break;
                                case "rowChkShowImp" :
                                    if (!wgtNameObj.isRadio && typeof rowObject[key] === 'boolean') { wgtNameObj['show_bckgrnd_import'] = rowObject[key]; }
                                    break;
                                case "rowRadImpUp" :
                                case "rowChkImpUp" :
                                    if (QUtility.isString(rowObject[key]) && rowObject[key].length > 0) {
                                        if ((key === "rowRadImpUp" && wgtNameObj.isRadio) || (key === "rowChkImpUp" && !wgtNameObj.isRadio)) {
                                            wgtNameObj['bckgrnd_import_up'] = rowObject[key];
                                        }
                                    }
                                    break;
                                case "rowRadImpOver" :
                                case "rowChkImpOver" :
                                    if (QUtility.isString(rowObject[key]) && rowObject[key].length > 0) {
                                        if ((key === "rowRadImpOver" && wgtNameObj.isRadio) || (key === "rowChkImpOver" && !wgtNameObj.isRadio)) {
                                            wgtNameObj['bckgrnd_import_over'] = rowObject[key];
                                        }
                                    }
                                    break;
                                case "rowRadImpDown" :
                                case "rowChkImpDown" :
                                    if (QUtility.isString(rowObject[key]) && rowObject[key].length > 0) {
                                        if ((key === "rowRadImpDown" && wgtNameObj.isRadio) || (key === "rowChkImpDown" && !wgtNameObj.isRadio)) {
                                            wgtNameObj['bckgrnd_import_down'] = rowObject[key];
                                        }
                                    }
                                    break;
                                default :
                                    this.__validateParam(paramNameObj, wgtNameObj, rowObject, key);
                                    break;
                            }
                        }
                    } else {
                        // deprecated keys
                        switch (key) {
                            case "width" :
                            case "height" :
                                if (QUtility.isNumber(rowObject[key])) { wgtNameObj[key] = rowObject[key]; }
                                break;
                            case "useTooltip" :
                                if (typeof rowObject[key] === "boolean") { wgtNameObj['use_tooltip'] = rowObject[key]; }
                                break;
                            case "useZoom" :
                                if (typeof rowObject[key] === "boolean") { wgtNameObj['use_lightbox'] = rowObject[key]; }
                                break;
                            case "showImpBckgrnd" :
                                if (typeof rowObject[key] === 'boolean') { wgtNameObj['show_bckgrnd_import'] = rowObject[key]; }
                                break;
                            case "bckgrndUp" :
                                if (QUtility.isString(rowObject[key]) && rowObject[key].length > 0) { wgtNameObj['bckgrnd_import_up'] = rowObject[key]; }
                                break;
                            case "bckgrndOver" :
                                if (QUtility.isString(rowObject[key]) && rowObject[key].length > 0) { wgtNameObj['bckgrnd_import_over'] = rowObject[key]; }
                                break;
                            case "bckgrndDown" :
                                if (QUtility.isString(rowObject[key]) && rowObject[key].length > 0) { wgtNameObj['bckgrnd_import_down'] = rowObject[key]; }
                                break;
                            default :
                                break;
                        }
                    }
                }
            }
        },

        __reverseAnim: function(reset) {
            var rowRespRef = this.qStudioVar.respRef.row,
                i = 0, rlen = rowRespRef.length;

            for (i; i<rlen; i+=1) {
                var rowwgt = rowRespRef[i];
                (!reset) ?
                    rowwgt.reverseAnim(!rowwgt.isAnswered()):
                    rowwgt.reverseAnim(false);
            }
        },

        // returns either 'soft', 'hard' or 'none' to indicate question capping type
        getCapType : function() {
            var qtype = this.qStudioVar.params.compQuestionType.value.toLowerCase(),
                capvalue = this.qStudioVar.params.compCapValue.value,
                captype = "none";

            if (qtype.indexOf('soft') !== -1 && (capvalue > 1)) { captype = "soft"; }
            if (qtype.indexOf('hard') !== -1 && (capvalue > 1)) { captype = "hard"; }
            return captype;
        },

        // returns an array of accepted row widgets;
        // pass an optional string argument to see if its an accepted widget type
        getAcceptedRowWidgets : function(value) {
            if (QUtility.isString(value) && jQuery.trim(value.toLowerCase()).length > 0) {
                var matchFound = false;
                for (var i = this.qStudioVar.rowAcceptedWgts.length; i--;) {
                    if (value === this.qStudioVar.rowAcceptedWgts[i]) {
                        matchFound = true;
                        break;
                    }
                }

                return matchFound;
            }

            return this.qStudioVar.rowAcceptedWgts;
        },

        // returns an object list of row button parameters
        // list can be in 1 of 2 formats.
        // If nothing is passed or wgtName is false, the list will be compiled using parameter names and will include the associated value and its exclude property.
        // If an exclude property is set true, it will not be allowed to be set as a button level parameter
        // If wgtName is true, the list will be compiled using widget specific names and will include the associated value
        getRowBtnParams : function(wgtName) {
            return this.__getParamObj("rowbtn", wgtName);
        },

        // returns an object list of row container parameters
        getRowContainParams : function(wgtName) {
            return this.__getParamObj("rowcontain", wgtName);
        },

        // returns an object list of tooltip parameters
        getToolTipParams : function(wgtName) {
            return this.__getParamObj("tooltip", wgtName);
        },

        // returns an object list of lightbox parameters
        getLightBoxParams : function(wgtName) {
            return this.__getParamObj("ctz", wgtName);
        },

        create: function(parent) {
            // reset isUpdating boolean everytime create is called
            this.qStudioVar.isUpdating = false;

            // used w/ component controller; reset everytime create method is called
            this.qStudioVar.respRef = {
                row: [],
                respArry: [],
                hardCapMet : false
            };

            // Auto-set compRTL parameter based on Survey Platform RTL settings
            if (QUtility.isSurveyRTL()) { this.qStudioVar.params.compRTL.value = true; }

            // Disable RTL in QStudio Component Creation Window due to positioning issues
            this.qStudioVar.isCompRTL = (!(parent && parent.id === "componentDemoContainer")) ? this.qStudioVar.params.compRTL.value : false;

            var that = this,
                doc = document,
                respRef = this.qStudioVar.respRef,
                params = this.qStudioVar.params,
                dcProxy = this.qStudioVar.dcProxy,
                isTouchDevice = QUtility.isTouchDevice(),
                compContain = doc.createElement("div"),
                eventDown = "mousedown.rowpicker touchstart.rowpicker",
                eventUp = "mouseup.rowpicker touchend.rowpicker",
                eventMove = "touchmove.rowpicker",
                txtEvent = ("oninput" in compContain) ? "input.rowpicker" : "keyup.rowpicker",
                touchCoordArray = [];

            // To fix IE9 bug where input event does not fire on backspace/del
            if (QUtility.ieVersion() <= 9) { txtEvent = "keyup.rowpicker"; }

            // Init feature modules
            QStudioCompFactory.lightBoxFactory("basic", doc.body, this.getLightBoxParams(true));
            QStudioCompFactory.toolTipFactory("", doc.body, this.getToolTipParams(true));
            QStudioCompFactory.msgDisplayFactory("", {
                errormsg_width: params.rowOtherMsgWidth.value,
                errormsg_fontsize: 16,
                errormsg_fontcolor: 0xFF0000,
                errormsg_halign: "left",
                isRTL: this.qStudioVar.isCompRTL
            });

            // If component is setup for Hard Capping, make sure to hide QStudio Survey Next button
            if (this.qStudioVar.isDC && dcProxy && this.getCapType() === "hard") { dcProxy.hideNextButton(); }

            // Component Container CSS Style
            compContain.id = "RowPickerComponent";
            compContain.dir = (!this.qStudioVar.isCompRTL) ? 'ltr' :'rtl';
            compContain.className = "qrowpicker_component";
            compContain.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(255, 255, 255, 0);");
            compContain.style.cssText += ';'.concat("-webkit-tap-highlight-color: transparent;");
            compContain.style.position = params.compContainPos.value;
            compContain.style.width = "100%";
            compContain.style.height = "100%";
            parent = (parent && parent.nodeType === 1) ? parent : doc.body;
            parent.appendChild(compContain);
            this.qStudioVar.compContain = compContain;

            // Init row container
            this.qStudioVar.rowContain = QStudioCompFactory.layoutFactory(
                params.rowContainType.value.toLowerCase().substr(0, params.rowContainType.value.toLowerCase().indexOf('layout') - 1),
                compContain,
                this.getRowContainParams(true)
            );

            // init rowContain setup
            this.update(true);

            // helper function for row buttons to remove all events
            var cleanup = function(rowEle) {
                $(rowEle).off(eventUp);
                $(doc).off(eventMove);
                $(doc).off(eventUp);
            };

            // add click/tap event
            $(compContain).on(eventDown, '.qwidget_button', function(event) {
                event.stopPropagation();
                var rowEle = event.currentTarget,
                    row = respRef.row[parseInt(rowEle.getAttribute('rowIndex'), 10)],
                    startX = (event.originalEvent.touches) ? event.originalEvent.touches[0].pageX : null,
                    startY = (event.originalEvent.touches) ? event.originalEvent.touches[0].pageY : null;

                if ((!row.enabled()) || that.qStudioVar.isUpdating) { return; }
                row.toggleMouseEnter(false);

                if (startX !== null && startY !== null) {
                    // push touch start coordinates into touchCoordArray
                    touchCoordArray.push(startX, startY);
                    setTimeout(function () {
                        touchCoordArray.splice(0, 2);
                    }, 700);

                    // touchmove event
                    $(doc).on(eventMove, function (event) {
                        event.stopPropagation();
                        cleanup(rowEle);
                    });
                } else {
                    $(doc).on(eventUp, function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        cleanup(rowEle);
                    });
                }

                // touchend event
                $(rowEle).on(eventUp, function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    cleanup(rowEle);

                    // click handler
                    that.manageClick(row);
                });
            });

            // We add a mousedown event listener to compContain, listening on the capture phase.
            // When our listener is invoked, we try to determine if the click was a result of a tap that we already
            // handled, and if so we call preventDefault and stopPropagation on it.
            if (isTouchDevice && compContain.addEventListener) {
                compContain.addEventListener("mousedown", function(event) {
                    if (event.eventPhase !== 1) { return false; }
                    for (var i = 0; i < touchCoordArray.length; i += 2) {
                        var x = touchCoordArray[i],
                            y = touchCoordArray[i + 1];

                        if (Math.abs(event.pageX - x) < 10 && Math.abs(event.pageY - y) < 10) {
                            event.stopPropagation();
                            event.preventDefault();
                        }
                    }
                }, true);
            }

            // add textarea event
            $(compContain).on(txtEvent, '.qwidget_button', function(event) {
                event.stopPropagation();
                var row = respRef.row[event.currentTarget.getAttribute('rowIndex')];
                if (!row.enabled() || !row.isOther() || that.qStudioVar.isUpdating) { return; }
                that.manageChange(row);
            });
        },

        // updates existing widget(s) and layout type
        update: function(init) {
            // if init is true, we are creating for the first time, else updating
            var compContain = this.qStudioVar.compContain,
                rowContain = this.qStudioVar.rowContain,
                respRefRowArray = this.qStudioVar.respRef.row,
                rowArray = this.qStudioVar.rowArray,
                params = this.qStudioVar.params,
                syncTxtBtnHeight = (params.rowTxtBtnAdjustHeightType.value === "all"),
                syncTxtBtnArray = [],
                maxTxtBtnHeight = 0,
                i = 0, rlen = rowArray.length;

            if (!init) {
                this.qStudioVar.isUpdating = true;
                qToolTipSingleton.getInstance().hide();

                // remove all widgets from rowContain & update
                rowContain.remove();
                rowContain.config(this.getRowContainParams(true));
            }

            // create/update row widgets
            for (i; i < rlen; i += 1) {
                var rowObject = rowArray[i],
                    userDefType = jQuery.trim(rowObject.var1 || rowObject.type).toLowerCase(),
                    wgtNameObj = this.getRowBtnParams(true),
                    rowBtnType = params.rowBtnDefaultType.value.toLowerCase(),
                    rowWgt = undefined;

                // check if user defined type is a valid row widget
                if (this.getAcceptedRowWidgets(userDefType) === true) { rowBtnType = userDefType; }

                // set widget params
                wgtNameObj.isRadio = ((this.questionType() === 'single') || QUtility.getBtnIsRadio(rowObject));
                wgtNameObj.rowIndex = i;
                wgtNameObj.id = rowObject.id || 'row_' + i;
                wgtNameObj.label = rowObject.label;
                wgtNameObj.description = rowObject.description;
                wgtNameObj.image = rowObject.image;
                wgtNameObj.show_bckgrnd_import = (wgtNameObj.isRadio) ? params.rowRadShowImp.value : params.rowChkShowImp.value;
                wgtNameObj.bckgrnd_import_up = (wgtNameObj.isRadio) ? params.rowRadImpUp.value : params.rowChkImpUp.value;
                wgtNameObj.bckgrnd_import_over = (wgtNameObj.isRadio) ? params.rowRadImpOver.value : params.rowChkImpOver.value;
                wgtNameObj.bckgrnd_import_down = (wgtNameObj.isRadio) ? params.rowRadImpDown.value : params.rowChkImpDown.value;

                // set widget button level params
                this.__setRowBtnLevelParams(rowObject, wgtNameObj);

                if (init) {
                    rowWgt = QStudioCompFactory.widgetFactory(
                        rowBtnType,
                        compContain,
                        wgtNameObj
                    );

                    rowWgt.enabled(true);
                    rowWgt.touchEnabled(QUtility.isTouchDevice());

                    // Create 'rowIndex' attribute for row widget for use w/ controller
                    rowWgt.widget().setAttribute('rowIndex', i.toString());

                    // Store reference of Row Widget for use w/ controller
                    respRefRowArray.push(rowWgt);
                } else {
                    rowWgt = respRefRowArray[i];
                    // update Row Button Widget
                    rowWgt.config(wgtNameObj);
                }

                // if we are sync'ing text button heights add to row container after calculating max text button height
                if (!syncTxtBtnHeight) {
                    // Add to row container now
                    rowContain.add(rowWgt, !!rowObject.ownRow);
                } else {
                    if (rowBtnType === "text") {
                        syncTxtBtnArray[i] = rowWgt;
                        maxTxtBtnHeight = Math.max(maxTxtBtnHeight, $(rowWgt.cache().nodes.background).height());
                    }
                }
            }

            if (syncTxtBtnHeight) {
                for (i = 0; i < rlen; i += 1) {
                    // set text widget new height
                    if (syncTxtBtnArray[i]) {
                        respRefRowArray[i].config({
                            height : maxTxtBtnHeight,
                            txtbtn_trim : false
                        });
                    }

                    // Add to row container
                    rowContain.add(respRefRowArray[i], !!rowArray[i].ownRow);
                }
            }

            this.qStudioVar.isUpdating = false;
        },

        manageClick: function(row) {
            var dcProxy = this.qStudioVar.dcProxy,
                respRef = this.qStudioVar.respRef,
                rowIndex = row.rowIndex(),
                isRevAnim = this.qStudioVar.params.rowBtnReverseScaleAlpha.value,
                capType = this.getCapType(),
                capVal = this.qStudioVar.params.compCapValue.value,
                capCond = false,
                spliceInd = -1,
                inputValid = (!row.isOther()) ? true : row.isInputValid();

            if (!row.isAnswered()) {
                if (!inputValid) { return; }
                // Unselect currently selected button(s)
                if (row.isRadio()) {
                    while(respRef.respArry.length !== 0) {
                        respRef.respArry[0].isAnswered(false);
                        this.sendResponse(respRef.respArry[0].rowIndex(), false);
                        respRef.respArry.shift();
                    }
                } else {
                    capCond = (capType !== "none" && capVal > 1) ? (respRef.respArry.length < capVal) : true;
                    if (!capCond) { return; }
                    var rowRadio = respRef.respArry[0];
                    if (rowRadio && rowRadio.isRadio() && rowRadio.isAnswered()) {
                        rowRadio.isAnswered(false);
                        this.sendResponse(rowRadio.rowIndex(), false);
                        respRef.respArry = [];
                    }
                }

                row.isAnswered(true);
                this.sendResponse(rowIndex, true);
                respRef.respArry.push(row);
                if (isRevAnim) { this.__reverseAnim(); }
            } else {
                if (!row.isRadio()) {
                    spliceInd = jQuery.inArray(row, respRef.respArry);
                    if (spliceInd !== -1) {
                        row.isAnswered(false);
                        this.sendResponse(rowIndex, false);
                        respRef.respArry.splice(spliceInd, 1);
                    }
                }
            }

            if (capType === "hard" && this.qStudioVar.isDC && dcProxy) {
                var hardCapMet = (respRef.respArry.length === capVal || row.isRadio() && respRef.respArry.length > 0);
                if (respRef.hardCapMet !== hardCapMet) {
                    respRef.hardCapMet = hardCapMet;
                    dcProxy[(hardCapMet) ? "showNextButton" : "hideNextButton"]();
                }
            }
        },
        
        manageChange: function(row) {
            var dcProxy = this.qStudioVar.dcProxy,
                respRef = this.qStudioVar.respRef,
                rowIndex = row.rowIndex(),
                isRevAnim = this.qStudioVar.params.rowBtnReverseScaleAlpha.value,
                capType = this.getCapType(),
                capVal = this.qStudioVar.params.compCapValue.value,
                capCond = false,
                spliceInd = -1,
                inputValid = row.isInputValid();

            if (inputValid) {
                if (!row.isAnswered()) {
                    if (row.isRadio()) {
                        while(respRef.respArry.length !== 0) {
                            respRef.respArry[0].isAnswered(false);
                            this.sendResponse(respRef.respArry[0].rowIndex(), false);
                            respRef.respArry.shift();
                        }
                    } else {
                        capCond = (capType !== "none" && capVal > 1) ? (respRef.respArry.length < capVal) : true;
                        if (!capCond) { return; }
                        var rowRadio = respRef.respArry[0];
                        if (rowRadio && rowRadio.isRadio() && rowRadio.isAnswered()) {
                            rowRadio.isAnswered(false);
                            this.sendResponse(rowRadio.rowIndex(), false);
                            respRef.respArry = [];
                        }
                    }

                    row.isAnswered(true);
                    this.sendResponse(rowIndex, true);
                    respRef.respArry.push(row);
                    if (isRevAnim) { this.__reverseAnim(); }
                }
            } else {
                if (row.isAnswered()) {
                    if (!row.isRadio()) {
                        spliceInd = jQuery.inArray(row, respRef.respArry);
                        if (spliceInd !== -1) {
                            row.isAnswered(false);
                            this.sendResponse(rowIndex, false);
                            respRef.respArry.splice(spliceInd, 1);
                        }
                    } else{
                        row.isAnswered(false);
                        this.sendResponse(rowIndex, false);
                        respRef.respArry = [];
                        if (isRevAnim) { this.__reverseAnim(true); }
                    }
                }
            }

            if (capType === "hard" && this.qStudioVar.isDC && dcProxy) {
                var hardCapMet = (respRef.respArry.length === capVal || row.isRadio() && respRef.respArry.length > 0);
                if (respRef.hardCapMet !== hardCapMet) {
                    respRef.hardCapMet = hardCapMet;
                    dcProxy[(hardCapMet) ? "showNextButton" : "hideNextButton"]();
                }
            }
        },

        sendResponse: function(rowIndex, ansVal) {
            console.log(rowIndex + " | " + ansVal);
            if (this.qStudioVar.isDC && typeof this.qStudioVar.dcProxy !== 'undefined') {
                this.qStudioVar.dcProxy.sendResponse({
                    eventType : (ansVal) ? "questionAnswered" : "questionUnAnswered",
                    responseType : this.questionType(),
                    rowID : this.qStudioVar.rowArray[rowIndex].rowVO.id,
                    answerValue : ansVal
                });
            }
        },

        // used by Dimensions to set responses
        setDimenResp: function(respArry) {
            if (jQuery.isArray(respArry)) {
                var respRef = this.qStudioVar.respRef;
                while(respArry.length !== 0) {
                    var rowIndex = parseInt(respArry[0].rowIndex, 10),
                        rowInput = respArry[0].input || "test input...",
                        row = null;

                    if (rowIndex >= 0 && rowIndex < respRef.row.length) {
                        // Get the row widget reference
                        row = respRef.row[rowIndex];
                        // Depending on row type, route to proper controller method
                        if (!row.isOther()) {
                            this.manageClick(row);
                        } else {
                            row.textarea(rowInput);
                            this.manageChange(row);
                            if (!row.isAnswered()) {
                                row.textarea(row.cache().nodes.textarea.defaultValue);
                            }
                        }
                    }

                    respArry.shift();
                }
            }
        },

        // used by Dimensions to get responses
        getDimenResp: function() {
            if (!this.qStudioVar.isDC) { return; }
            var respRef = this.qStudioVar.respRef,
                valarray = [],
                json = { Response: { Value: valarray } };

            for (var i=0, rlen=respRef.respArry.length; i<rlen; i+=1) {
                var row = respRef.respArry[i],
                    row_id = row.widget().id;

                valarray.push(row_id);
                if (row.isOther()) {
                    json.Response[row_id] = row.textarea();
                }
            }

            return json;
        }
    };
    
    return RowPicker;
    
})();