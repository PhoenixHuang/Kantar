/**
 * BtnMatrix Javascript File
 * Version : 1.3.1
 * Date : 2014-09-29
 *
 * Button Matrix Component.
 * BaseClassType : Multi
 * Requires rowArray and columnArray datasets.
 * Confluence Link : https://docs.gmi-mr.com/confluence/display/midev/BtnMatrix+Component+Documentation
 *
 */

var BtnMatrix = (function () {

    function BtnMatrix() {
        this.qStudioVar = {
            isUpdating : false,
            isCompRTL : false,
            interact : true,
            isDC : false,
            params : this.initParams(),
            touchCoordArray : [],
            rowArray : [],
            columnArray : [],
            rowAcceptedWgts : [
                "base",
                "flow",
                "kantarbase",
                "text",
                "label only",
                "none"
            ],
            colAcceptedWgts : [
                "base",
                "flow",
                "kantarbase",
                "text",
                "radiocheck",
                "other",
                "other numeric",
                "kantarother",
                "kantarother numeric"
            ]
        };
    }

    BtnMatrix.prototype = {
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

        columnArray: function() {
            var arg = arguments[0];

            if (typeof arg === 'undefined') {
                //console.log("Getting columnArray");
                return this.qStudioVar.columnArray;
            }

            if (jQuery.isArray(arg)) {
                //console.log("Setting columnArray");
                this.qStudioVar.columnArray = arg;
            }
        },

        dimensions: function() {
            return [
                { name:"rowArray", prop:[
                    "label",            // Row object label
                    "image",            // Row object image url
                    "description",      // Row object description
                    "var1"              // Row object button type
                ] },
                { name:"columnArray", prop:[
                    "label",            // Column object label
                    "image",            // Column object image url
                    "description",      // Column object description
                    "var1",             // Column object button type
                    "var2"              // Column object isRadio prop
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
            return 'BtnMatrix component description...';
        },

        baseClassType: function() {
            // multi column base class type
            return 'multi';
        },

        questionType: function() {
            var qtype = this.qStudioVar.params.compQuestionType.value.toLowerCase(),
                clicktype = this.qStudioVar.params.compClickType.value.toLowerCase();

            if (clicktype !== 'rating' && qtype.indexOf('multiple') !== -1) { return 'multi'; }
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
                compQuestionType: { name:"Component: Question Type", value:'Multiple Choice', description:"Component question type. ", type:"combo", options:['Single Choice', 'Multiple Choice'], order:1 },
                compCapValue: { name:"Component: Cap Value", value:0, description:"Restrict the number of button selections. Question type must be 'Multiple Choice' and value >= 2.", type:"number", min:0, order:2 },
                compClickType: { name:"Component: Click Behavior", value:'default', description:"Component column click behavior.", type:"combo", options:['default', 'rating'], order:3 },
                compContainPos: { name:"Component: CSS Position", value:"relative", description:"Component container CSS position.", type:"combo", options:["absolute", "relative"], order: 4 },
                compRTL: { name:"Component: RTL Enable", value:false, description:"If set true, component will be setup to support right-to-left languages.", type:"bool", order:24 },
                compPrimFontFamily: { name:"Component: Primary Font Family", value:"Arial, Helvetica, sans-serif", description:"Font used for button and layout labels.", type:"string", order:19 },
                compSecFontFamily: { name:"Component: Secondary Font Family", value:"‘Arial Narrow’, sans-serif", description:"Font used for textarea inputs.", type:"string", order:19 },

                // Row Container Parameters
                rowContainType: { name:"Row Contain: Layout Type", value:"vertical layout", description:"Layout template applied to row buttons.", type:"combo", options:["horizontal grid layout", "vertical grid layout", "horizontal layout", "vertical layout", "horizontal scroll", "vertical scroll", "set layout", "vertical column label"], order: 3 },
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
                rowContainBckgrndDispType: { name:"Row Contain: Bckgrnd Display Type", value:"none", description:"Row container background display type.", type:"combo", options:["vector", "import", "none"], order: 3 },
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
                rowContainSetRowPer: { name:"Set Layout: Number of Rows Per Set", value:3, description:"Number of row buttons per set.", type:"number", min:1, wgtref: 'rowcontain', wgtname:"num_per_row", order:18 },
                rowContainScrlAnimSpeed: { name:"Scroll Layout: Animation Speed", value:500, description:"Scrolling animation speed, in milliseconds.", type:"number", min:100, wgtref: 'rowcontain', wgtname:"anim_speed", order:18 },
                rowContainScrlEndPos: { name:"Scroll Layout: Row Ending Offset", value:100, description:"How far a row should animate left/top after being shown.", type:"number", wgtref: 'rowcontain', wgtname:"end_offset", order:21 },
                rowContainChldInitAlpha: { name:"Scroll/Set Layout: Row Starting Opacity", value:50, description:"Row opacity before it’s been shown.", type:"number", max:100, wgtref: 'rowcontain', wgtname:"start_alpha", order:23 },
                rowContainChldEndAlpha: { name:"Scroll Layout: Row Ending Opacity", value:50, description:"Row opacity after it’s been shown.", type:"number", max:100, wgtref: 'rowcontain', wgtname:"end_alpha", order:24 },
                rowContainChldEnableAlpha: { name:"Scroll Layout: Column Opacity during Scroll", value:50, description:"Column opacity while a new row is scrolling in.", type:"number", max:100, order:24 },
                rowContainGoOpaque: { name:"Scroll/Set Layout: Enable Opaque Feature", value:false, description:"If set true, opacity does not affect row backgrounds.", type:"bool", wgtref: 'rowcontain', wgtname:"go_opaque", order:25 },
                rowContainAutoNext: { name:"Scroll/Set Layout: AutoNext Row", value:false, description:"If set true, container will advance to next row once the current row is answered. Question type must be 'Single Choice'.", type:"bool", order:25 },
                rowContainNonMand: { name:"Scroll/Set Layout: Make Non-Mandatory", value:false, description:"If set true, users can navigate a set or scroll layout w/out answering a row option.", type:"bool", order:25 },

                // Row Button Background Parameters
                rowBtnDefaultType: { name:"Row Btn: Default Button Type", value:"Base", description:"Default row button type used by component.", type:"combo", options:["Base", "Text", "Flow", "KantarBase", "Label Only", "None"], order:29 },
                rowBtnWidth: { name:"Row Btn: Bckgrnd Width", value:125, description:"Button background width, in pixels", type:"number", min:10, wgtref: 'rowbtn', wgtname:"width", order:30 },
                rowBtnHeight: { name:"Row Btn: Bckgrnd Height", value:125, description:"Button background height, in pixels", type:"number", min:10, wgtref: 'rowbtn', wgtname:"height", order:31 },
                rowBtnPadding: { name:"Row Btn: Bckgrnd Padding", value:4, description:"Button background padding, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"padding", order:32 },
                rowBtnShowBckgrnd: { name:"Row Btn: Show Bckgrnd", value:true, description:"If set false, button background will not display.", type:"bool", wgtref: 'rowbtn', wgtname:"show_bckgrnd", order:42 },
                rowBtnBorderStyle: { name:"Row Btn: Border Style", value:"solid", description:"Button background CSS border style.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'rowbtn', wgtname:"border_style", order:33 },
                rowBtnBorderRadius: { name:"Row Btn: Border Radius", value:0, description:"Button background border radius, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_radius", order:35 },
                rowBtnBorderWidthUp: { name:"Row Btn: Border UP Width", value:2, description:"Button background border width (in pixels) in its default state.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_width_up", order:34 },
                rowBtnBorderWidthDown: { name:"Row Btn: Border DOWN Width", value:2, description:"Button background border width (in pixels) when button is selected.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_width_down", order:34 },
                rowBtnBorderColorUp: { name:"Row Btn: Border UP Color", value:0xd2d3d5, description:"Button background border color in its default state.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_up", order:36 },
                rowBtnBorderColorDown: { name:"Row Btn: Border DOWN Color", value:0xffbd1a, description:"Button background border color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_down", order:38 },
                rowBtnBckgrndColorUp: { name:"Row Btn: Bckgrnd UP Color", value:0xFFFFFF, description:"Button background color in its default state.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_up", order:39 },
                rowBtnBckgrndColorDown: { name:"Row Btn: Bckgrnd DOWN Color", value:0xFFFFFF, description:"Button background color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_down", order:41 },
                rowBckgrndShowImp: { name:"Row Btn: Show Import Bckgrnd", value:false, description:"If set true, button will display an imported background image.", type:"bool", wgtref: 'rowbtn', wgtname:"show_bckgrnd_import", order:49 },
                rowBckgrndImpUp: { name:"Row Btn: Import UP Bckgrnd", value:"", description:"Import background image to use when button is in its default state.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"bckgrnd_import_up", order:43 },
                rowBckgrndImpDown: { name:"Row Btn: Import DOWN Bckgrnd", value:"", description:"Import background image to use on button select.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"bckgrnd_import_down", order:45 },

                // Row Button Label Parameters
                rowBtnShowLabel: { name:"Row Label: Display", value:true, description:"If set false, button label will not display.", type:"bool", wgtref: 'rowbtn', wgtname:"show_label", order:60 },
                rowBtnLabelOvrWidth: { name:"Row Label: Overwrite Width", value:false, description:"If set true, a custom label width can be set.", type:"bool", wgtref: 'rowbtn', wgtname:"label_ovr_width", order:60 },
                rowBtnLabelWidth: { name:"Row Label: Custom Width", value:125, description:"Custom label width, in pixels.", type:"number", min:10, wgtref: 'rowbtn', wgtname:"label_width", order:30 },
                rowBtnLabelPlacement: { name:"Row Label: Placement", value:'bottom overlay', description:"Button label placement.", type:"combo", options:['top', 'bottom', 'bottom overlay', 'top overlay', 'center overlay'], wgtref: 'rowbtn', wgtname:"label_placement", order:51 },
                rowBtnLabelHalign: { name:"Row Label: Horz Alignment", value:'left', description:"Button label horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowbtn', wgtname:"label_halign", order:52 },
                rowBtnLabelHoffset: { name:"Row Label: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"label_left", order:54 },
                rowBtnLabelVoffset: { name:"Row Label: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"label_top", order:55 },
                rowBtnLabelFontSize: { name:"Row Label: Font Size", value:18, description:"Button label font size, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"label_fontsize", order:53 },
                rowBtnLabelColorUp: { name:"Row Label: UP Font Color", value:0x5B5F65, description:"Button label font color in the button’s default state.", type:"colour", wgtref: 'rowbtn', wgtname:"label_fontcolor_up", order:56 },
                rowBtnLabelColorDown: { name:"Row Label: DOWN Font Color", value:0x5B5F65, description:"Button label font color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"label_fontcolor_down", order:58 },
                rowBtnLabelOverlayShowBckgrnd: { name:"Row Label Overlay: Display Bckgrnd", value:true, description:"If set true, overlay labels will display a background color.", type:"bool", wgtref: 'rowbtn', wgtname:"show_label_bckgrnd", order:61 },
                rowBtnLabelOverlayBckgrndColor: { name:"Row Label Overlay: Bckgrnd Color", value:0xFFFFFF, description:"Overlay label background color.", type:"colour", wgtref: 'rowbtn', wgtname:"label_bckgrnd_color", order:59 },
                rowBtnLabelOverlayPadding: { name:"Row Label Overlay: Label Padding", value:4, description:"Overlay label padding, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"label_overlay_padding", order:32 },

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

                // Row Button Specific Parameters
                rowTxtBtnAdjustHeightType: { name:"Row Text: Auto Height Type", value:'none', description:"Select how the auto height feature for Text widget is applied. When selecting the option 'all', the max height is calculated across all Text widgets and used as the button height. The option 'individual' will be the most space saving as each widget is cropped individually.", type:"combo", options:['none', 'individual', 'all'], order:73 },

                // Column Container Parameters
                colContainType: { name:"Column Contain: Layout Type", value:"horizontal layout", description:"Layout template applied to column buttons.", type:"combo", options:["horizontal grid layout", "vertical grid layout", "horizontal layout", "vertical layout"], order: 3 },
                colContainWidth: { name:"Column Contain: Bckgrnd Width", value:700, description:"Column container background width, in pixels.", type:"number", min:50, wgtref: 'colcontain', wgtname:"width", order: 5 },
                colContainHeight: { name:"Column Contain: Bckgrnd Height", value:400, description:"Column container background height, in pixels.", type:"number", min:50, wgtref: 'colcontain', wgtname:"height", order: 6 },
                colContainHgap: { name:"Column Contain: Horz Btn Spacing", value:10, description:"The horizontal spacing of column buttons, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"hgap", order: 8 },
                colContainVgap: { name:"Column Contain: Vert Btn Spacing", value:10, description:"The vertical spacing of column buttons, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"vgap", order: 9 },
                colContainHoffset: { name:"Column Contain: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"left", order: 10 },
                colContainVoffset: { name:"Column Contain: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"top", order: 11 },
                colContainOptHalign: { name:"Column Contain: Option Horz Alignment", value:'left', description:"Column option horizontal alignment.", type:"combo", options:['left', 'center', 'right'], wgtref: 'colcontain', wgtname:"option_halign", order:20 },
                colContainOptValign: { name:"Column Contain: Option Vert Alignment", value:'top', description:"Column option vertical alignment.", type:"combo", options:['top', 'middle', 'bottom'], wgtref: 'colcontain', wgtname:"option_valign", order:20 },
                colContainBckgrndDispType: { name:"Column Contain: Bckgrnd Display Type", value:"vector", description:"Column container background display type.", type:"combo", options:["vector", "import", "none"], order: 3 },
                colContainBckgrndColor: { name:"Column Contain: Bckgrnd Color", value:0xFFFFFF, description:"Column container background color.", type:"colour", wgtref: 'colcontain', wgtname:"bckgrnd_color", order: 15 },
                colContainImgImport: { name:"Column Contain: Import Bckgrnd", value:"", description:"Column container imported background image.", type:"bitmapdata", wgtref: 'colcontain', wgtname:"bckgrnd_import", order:26 },
                colContainImgImportHoffset: { name:"Column Contain: Import Bckgrnd Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"bckgrnd_import_left", order:27 },
                colContainImgImportVoffset: { name:"Column Contain: Import Bckgrnd Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"bckgrnd_import_top", order:28 },

                // Column Button Background Parameters
                colBtnDefaultType: { name:"Column Btn: Default Button Type", value:"Text", description:"Default column button type used by component.", type:"combo", options:["Base", "Text", "Flow", "KantarBase", "RadioCheck"], order:29 },
                colBtnWidth: { name:"Column Btn: Bckgrnd Width", value:85, description:"Button background width, in pixels", type:"number", min:10, wgtref: 'colbtn', wgtname:"width", order:30 },
                colBtnHeight: { name:"Column Btn: Bckgrnd Height", value:85, description:"Button background height, in pixels", type:"number", min:10, wgtref: 'colbtn', wgtname:"height", order:31 },
                colBtnPadding: { name:"Column Btn: Bckgrnd Padding", value:10, description:"Button background padding, in pixels.", type:"number", min:0, wgtref: 'colbtn', wgtname:"padding", order:32 },
                colBtnShowBckgrnd: { name:"Column Btn: Show Bckgrnd", value:true, description:"If set false, button background will not display.", type:"bool", wgtref: 'colbtn', wgtname:"show_bckgrnd", order:42 },
                colBtnBorderStyle: { name:"Column Btn: Border Style", value:"solid", description:"Button background CSS border style.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'colbtn', wgtname:"border_style", order:33 },
                colBtnBorderRadius: { name:"Column Btn: Border Radius", value:0, description:"Button background border radius, in pixels.", type:"number", min:0, wgtref: 'colbtn', wgtname:"border_radius", order:35 },
                colBtnBorderWidthUp: { name:"Column Btn: Border UP Width", value:2, description:"Button background border width (in pixels) in its default state.", type:"number", min:0, wgtref: 'colbtn', wgtname:"border_width_up", order:34 },
                colBtnBorderWidthOver: { name:"Column Btn: Border OVER Width", value:3, description:"Button background border width (in pixels) on mouse over.", type:"number", min:0, wgtref: 'colbtn', wgtname:"border_width_over", order:34 },
                colBtnBorderWidthDown: { name:"Column Btn: Border DOWN Width", value:2, description:"Button background border width (in pixels) when button is selected.", type:"number", min:0, wgtref: 'colbtn', wgtname:"border_width_down", order:34 },
                colBtnBorderColorUp: { name:"Column Btn: Border UP Color", value:0xd2d3d5, description:"Button background border color in its default state.", type:"colour", wgtref: 'colbtn', wgtname:"border_color_up", order:36 },
                colBtnBorderColorOver: { name:"Column Btn: Border OVER Color", value:0xa6a8ab, description:"Button background border color on mouse over.", type:"colour", wgtref: 'colbtn', wgtname:"border_color_over", order:37 },
                colBtnBorderColorDown: { name:"Column Btn: Border DOWN Color", value:0xffbd1a, description:"Button background border color when button is selected.", type:"colour", wgtref: 'colbtn', wgtname:"border_color_down", order:38 },
                colBtnBckgrndColorUp: { name:"Column Btn: Bckgrnd UP Color", value:0xFFFFFF, description:"Button background color in its default state.", type:"colour", wgtref: 'colbtn', wgtname:"bckgrnd_color_up", order:39 },
                colBtnBckgrndColorOver: { name:"Column Btn: Bckgrnd OVER Color", value:0xFFFFFF, description:"Button background color on mouse over.", type:"colour", wgtref: 'colbtn', wgtname:"bckgrnd_color_over", order:40 },
                colBtnBckgrndColorDown: { name:"Column Btn: Bckgrnd DOWN Color", value:0xFFFFFF, description:"Button background color when button is selected.", type:"colour", wgtref: 'colbtn', wgtname:"bckgrnd_color_down", order:41 },
                colRadShowImp: { name:"Column Btn: Show Import RADIO Bckgrnd", value:false, description:"If set true, buttons which behave like Radio buttons will display an imported background image.", type:"bool", wgtref: 'colbtn', wgtname:"show_bckgrnd_import", order:49 },
                colRadImpUp: { name:"Column Btn: RADIO Import UP Bckgrnd", value:"", description:"Import background image to use when button is in its default state.", type:"bitmapdata", wgtref: 'colbtn', wgtname:"bckgrnd_import_up", order:43 },
                colRadImpOver: { name:"Column Btn: RADIO Import OVER Bckgrnd", value:"", description:"Import background image to use on button mouse over.", type:"bitmapdata", wgtref: 'colbtn', wgtname:"bckgrnd_import_over", order:44 },
                colRadImpDown: { name:"Column Btn: RADIO Import DOWN Bckgrnd", value:"", description:"Import background image to use on button select.", type:"bitmapdata", wgtref: 'colbtn', wgtname:"bckgrnd_import_down", order:45 },
                colChkShowImp: { name:"Column Btn: Show Import CHECK Bckgrnd", value:false, description:"If set true, buttons which behave like Checkbox buttons will display an imported background image.", type:"bool", wgtref: 'colbtn', wgtname:"show_bckgrnd_import", order:50 },
                colChkImpUp: { name:"Column Btn: CHECK Import UP Bckgrnd", value:"", description:"Import background image to use when button is in its default state.", type:"bitmapdata", wgtref: 'colbtn', wgtname:"bckgrnd_import_up", order:46 },
                colChkImpOver: { name:"Column Btn: CHECK Import OVER Bckgrnd", value:"", description:"Import background image to use on button mouse over.", type:"bitmapdata", wgtref: 'colbtn', wgtname:"bckgrnd_import_over", order:47 },
                colChkImpDown: { name:"Column Btn: CHECK Import DOWN Bckgrnd", value:"", description:"Import background image to use on button select.", type:"bitmapdata", wgtref: 'colbtn', wgtname:"bckgrnd_import_down", order:48 },

                // Column Button Label Parameters
                colBtnShowLabel: { name:"Column Label: Display", value:true, description:"If set false, button label will not display.", type:"bool", wgtref: 'colbtn', wgtname:"show_label", order:60 },
                colBtnLabelOvrWidth: { name:"Column Label: Overwrite Width", value:false, description:"If set true, a custom label width can be set.", type:"bool", wgtref: 'colbtn', wgtname:"label_ovr_width", order:60 },
                colBtnLabelWidth: { name:"Column Label: Custom Width", value:125, description:"Custom label width, in pixels.", type:"number", min:10, wgtref: 'colbtn', wgtname:"label_width", order:30 },
                colBtnLabelPlacement: { name:"Column Label: Placement", value:'bottom', description:"Button label placement.", type:"combo", options:['top', 'bottom', 'bottom overlay', 'top overlay', 'center overlay'], wgtref: 'colbtn', wgtname:"label_placement", order:51 },
                colBtnLabelHalign: { name:"Column Label: Horz Alignment", value:'left', description:"Button label horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'colbtn', wgtname:"label_halign", order:52 },
                colBtnLabelHoffset: { name:"Column Label: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"label_left", order:54 },
                colBtnLabelVoffset: { name:"Column Label: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"label_top", order:55 },
                colBtnLabelFontSize: { name:"Column Label: Font Size", value:18, description:"Button label font size, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"label_fontsize", order:53 },
                colBtnLabelColorUp: { name:"Column Label: UP Font Color", value:0x5B5F65, description:"Button label font color in the button’s default state.", type:"colour", wgtref: 'colbtn', wgtname:"label_fontcolor_up", order:56 },
                colBtnLabelColorOver: { name:"Column Label: OVER Font Color", value:0x5B5F65, description:"Button label font color on button mouse over.", type:"colour", wgtref: 'colbtn', wgtname:"label_fontcolor_over", order:57 },
                colBtnLabelColorDown: { name:"Column Label: DOWN Font Color", value:0x5B5F65, description:"Button label font color when button is selected.", type:"colour", wgtref: 'colbtn', wgtname:"label_fontcolor_down", order:58 },
                colBtnLabelOverlayShowBckgrnd: { name:"Column Label Overlay: Display Bckgrnd", value:true, description:"If set true, overlay labels will display a background color.", type:"bool", wgtref: 'colbtn', wgtname:"show_label_bckgrnd", order:61 },
                colBtnLabelOverlayBckgrndColor: { name:"Column Label Overlay: Bckgrnd Color", value:0xFFFFFF, description:"Overlay label background color.", type:"colour", wgtref: 'colbtn', wgtname:"label_bckgrnd_color", order:59 },
                colBtnLabelOverlayPadding: { name:"Column Label Overlay: Label Padding", value:4, description:"Overlay label padding, in pixels.", type:"number", min:0, wgtref: 'colbtn', wgtname:"label_overlay_padding", order:32 },

                // Column Button Image Parameters
                colBtnImgHoffset: { name:"Column Image: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"img_left", order:62 },
                colBtnImgVoffset: { name:"Column Image: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"img_top", order:63 },

                // Column Button Stamp Parameters
                colShowStamp: { name:"Column Stamp: Display", value:false, description:"If set true, imported stamp will display when button is selected.", type:"bool", wgtref: 'colbtn', wgtname:"show_stamp", order:69 },
                colStampImp: { name:"Column Stamp: Import Image", value:"", description:"Imported stamp image to use on button select.", type:"bitmapdata", wgtref: 'colbtn', wgtname:"stamp_import", order:64 },
                colStampWidth: { name:"Column Stamp: Width", value:30, description:"Stamp image width, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"stamp_width", order:65 },
                colStampHeight: { name:"Column Stamp: Height", value:30, description:"Stamp image height, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"stamp_height", order:66 },
                colStampHoffset: { name:"Column Stamp: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"stamp_left", order:67 },
                colStampVoffset: { name:"Column Stamp: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"stamp_top", order:68 },

                // Column Input Button Specific Parameters
                colOtherShowLabel: { name:"Column Other: Display Label", value:true, description:"If set false, button label will not display.", type:"bool",  wgtref: 'colbtn', wgtname:"other_show_label", order:60, display: false },
                colOtherInputHalign: { name:"Column Other: TextArea Horz Alignment", value:'left', description:"Textarea input horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'colbtn', wgtname:"textarea_halign", order:52, display: false },
                colOtherInputFontSize: { name:"Column Other: TextArea Font Size", value:16, description:"Textarea input font size, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"textarea_fontsize", order:53, display: false },
                colOtherInputColor: { name:"Column Other: TextArea Color", value:0x5B5F65, description:"Textarea input font color.", type:"colour", wgtref: 'colbtn', wgtname:"textarea_fontcolor", order:56, display: false },
                colOtherInitTxt: { name:"Column Other: TextArea Default Text", value:"Please specify", description:"Initial text to display in the textarea input.", type:"string", wgtref: 'colbtn', wgtname:"other_init_txt", order:81, display: false },
                colOtherInvalidMsg: { name:"Column Other Numeric: Invalid Msg Text", value:"Number is invalid", description:"Message to display when an invalid number is entered.", type:"string", wgtref: 'colbtn', wgtname:"other_msg_invalid", order:85, display: false },
                colOtherRangeMsg: { name:"Column Other Numeric: Range Msg Text", value:"Number must be >= min & <= max", description:"Message to display when a number is not within range. If the message contains the word min and/or max they will be substituted with their numeric parameter values.", type:"string", wgtref: 'colbtn', wgtname:"other_msg_range", order:86, display: false },
                colOtherMsgWidth: { name:"Column Other Numeric: Msg Width", value:100, description:"Width of error message label, in pixels.", type:"number", min:5, order:84, display: false },
                colOtherMinVal: { name:"Column Other Numeric: Min Input Value", value:1, description:"Minimum numeric input allowed.", type:"number", wgtref: 'colbtn', wgtname:"other_min", order:82, display: false },
                colOtherMaxVal: { name:"Column Other Numeric: Max Input Value", value:100, description:"Maximum numeric input allowed.", type:"number", wgtref: 'colbtn', wgtname:"other_max", order:83, display: false },

                // Column Button Specific Parameters
                colTxtBtnAdjustHeightType: { name:"Column Text: Auto Height Type", value:'none', description:"Select how the auto height feature for Text widget is applied. When selecting the option 'all', the max height is calculated across all Text widgets and used as the button height. The option 'individual' will be the most space saving as each widget is cropped individually.", type:"combo", options:['none', 'individual', 'all'], order:73 },
                colRadChckImpRadio: { name:"Column RadChk: RADIO Import Bckgrnd", value:"", description:"Import image to use for Radio button types. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'colbtn', wgtname:"radchkbtn_rad_url", order:75 },
                colRadChckWidthRadio: { name:"Column RadChk: RADIO Bckgrnd Width", value:30, description:"Width used for Radio import image, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"radchkbtn_rad_width", order:76 },
                colRadChckHeightRadio: { name:"Column RadChk: RADIO Bckgrnd Height", value:30, description:"Height used for Radio import image, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"radchkbtn_rad_height", order:77 },
                colRadChckImpCheck: { name:"Column RadChk: CHECK Import Bckgrnd", value:"", description:"Import image to use for Checkbox button types. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'colbtn', wgtname:"radchkbtn_chk_url", order:78 },
                colRadChckWidthCheck: { name:"Column RadChk: CHECK Bckgrnd Width", value:30, description:"Width used for Checkbox import image, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"radchkbtn_chk_width", order:79 },
                colRadChckHeightCheck: { name:"Column RadChk: CHECK Bckgrnd Height", value:30, description:"Height used for Checkbox import image, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"radchkbtn_chk_height", order:80 },
                colRadChckLabelHalign: { name:"Column RadChk: Label Horz Alignment", value:'left', description:"Button label horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'colbtn', wgtname:"radchkbtn_label_halign", order:73 },
                colRadChckLabelWidth: { name:"Column RadChk: Label Width", value:125, description:"Button label width, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"radchkbtn_label_width", order:72 },
                colRadChckLabelHoffset: { name:"Column RadChk Btn: Label Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"radchkbtn_label_left", order:54, display: false },
                colRadChckLabelVoffset: { name:"Column RadChk Btn: Label Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"radchkbtn_label_top", order:55, display: false },
                colRadChckLabelFontSize: { name:"Column RadChk: Label Font Size", value:18, description:"Button label font size, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"radchkbtn_label_fontsize", order:74 },
                colRadChckLabelColorUp: { name:"Column RadChk: Label UP Font Color", value:0x5B5F65, description:"Button label font color in the button’s default state.", type:"colour", wgtref: 'colbtn', wgtname:"radchkbtn_label_fontcolor_up", order:56 },
                colRadChckLabelColorOver: { name:"Column RadChk: Label OVER Font Color", value:0x5B5F65, description:"Button label font color on button mouse over.", type:"colour", wgtref: 'colbtn', wgtname:"radchkbtn_label_fontcolor_over", order:57 },
                colRadChckLabelColorDown: { name:"Column RadChk: Label DOWN Font Color", value:0x5B5F65, description:"Button label font color when button is selected.", type:"colour", wgtref: 'colbtn', wgtname:"radchkbtn_label_fontcolor_down", order:58 },
                colKntrInputImpRadio: { name:"Column KantarInput: RADIO Import Bckgrnd", value:"", description:"Import image to use for Radio button types. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'colbtn', wgtname:"kntrinputbtn_rad_url", order:75, display: false },
                colKntrInputWidthRadio: { name:"Column KantarInput: RADIO Bckgrnd Width", value:30, description:"Width used for Radio import image, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"kntrinputbtn_rad_width", order:76, display: false },
                colKntrInputHeightRadio: { name:"Column KantarInput: RADIO Bckgrnd Height", value:30, description:"Height used for Radio import image, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"kntrinputbtn_rad_height", order:77, display: false },
                colKntrInputImpCheck: { name:"Column KantarInput: CHECK Import Bckgrnd", value:"", description:"Import image to use for Checkbox button types. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'colbtn', wgtname:"kntrinputbtn_chk_url", order:78, display: false },
                colKntrInputWidthCheck: { name:"Column KantarInput: CHECK Bckgrnd Width", value:30, description:"Width used for Checkbox import image, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"kntrinputbtn_chk_width", order:79, display: false },
                colKntrInputHeightCheck: { name:"Column KantarInput: CHECK Bckgrnd Height", value:30, description:"Height used for Checkbox import image, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"kntrinputbtn_chk_height", order:8, display: false },
                colKntrInputTxtAreaWidth: { name:"Column KantarInput: TextArea Width", value:125, description:"Button textarea input width, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"kntrinputbtn_input_width", order:72, display: false },
                colKntrInputLabelHalign: { name:"Column KantarInput: Label Horz Alignment", value:'left', description:"Button label horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'colbtn', wgtname:"kntrinputbtn_label_halign", order:73, display: false },
                colKntrInputLabelWidth: { name:"Column KantarInput: Label Width", value:150, description:"Button label width, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"kntrinputbtn_label_width", order:72, display: false },
                colKntrInputLabelHoffset: { name:"Column KantarInput: Label Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"kntrinputbtn_label_left", order:54, display: false },
                colKntrInputLabelVoffset: { name:"Column KantarInput: Label Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"kntrinputbtn_label_top", order:55, display: false },
                colKntrInputLabelFontSize: { name:"Column KantarInput: Label Size", value:18, description:"Button label font size, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"kntrinputbtn_label_fontsize", order:74, display: false },
                colKntrInputLabelColorUp: { name:"Column KantarInput: Label UP Color", value:0x5B5F65, description:"Button label font color in the button’s default state.", type:"colour", wgtref: 'colbtn', wgtname:"kntrinputbtn_label_fontcolor_up", order:56, display: false },
                colKntrInputLabelColorOver: { name:"Column KantarInput: Label OVER Color", value:0x5B5F65, description:"Button label font color on button mouse over.", type:"colour", wgtref: 'colbtn', wgtname:"kntrinputbtn_label_fontcolor_over", order:57, display: false },
                colKntrInputLabelColorDown: { name:"Column KantarInput: Label DOWN Color", value:0x5B5F65, description:"Button label font color when button is selected.", type:"colour", wgtref: 'colbtn', wgtname:"kntrinputbtn_label_fontcolor_down", order:58, display: false },

                // Column Animation Parameters
                colBtnMouseOverDownShadow: { name:"Column Animation: OVER/DOWN Show Shadow", value:false, description:"If set true, button background will display a shadow on mouse over and select states.", type:"bool", wgtref: 'colbtn', wgtname:"mouseover_shadow", order:87 },
                colBtnMouseOverBounce: { name:"Column Animation: OVER Bounce", value:false, description:"If set true, button does a slight bounce on mouse over.", type:"bool", wgtref: 'colbtn', wgtname:"mouseover_bounce", order:88 },
                colBtnMouseOverScale: { name:"Column Animation: OVER Scale", value:100, description:"Button scale on mouse over. ", type:"number", min:0, wgtref: 'colbtn', wgtname:"mouseover_scale", order:89 },
                colBtnMouseDownScale: { name:"Column Animation: DOWN Scale", value:100, description:"Button scale on button selection.", type:"number", min:0, wgtref: 'colbtn', wgtname:"mousedown_scale", order:90 },
                colBtnMouseDownAlpha: { name:"Column Animation: DOWN Transparency", value:100, description:"Button opacity on button selection.", type:"number", min:0, max:100, wgtref: 'colbtn', wgtname:"mousedown_alpha", order:91 },

                // Tooltip Parameters
                rowBtnUseTooltip: { name:"Tooltip: Enable for Row Btn", value:false, description:"If set true and row widget has a description, the tooltip feature will be enabled.", type:"bool", wgtref: 'rowbtn', wgtname:"use_tooltip", order:92 },
                colBtnUseTooltip: { name:"Tooltip: Enable for Column Btn", value:false, description:"If set true and column widget has a description, the tooltip feature will be enabled.", type:"bool", wgtref: 'colbtn', wgtname:"use_tooltip", order:92 },
                tooltipWidth: { name:"Tooltip: Bckgrnd Width", value:150, description:"Tooltip background width, in pixels.", type:"number", min:5, wgtref: 'tooltip', wgtname:"tooltip_width", order:93 },
                tooltipLabelHalign: { name:"Tooltip: Label Horz Alignment", value:'left', description:"Tooltip horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'tooltip', wgtname:"tooltip_halign", order:97 },
                tooltipFontSize: { name:"Tooltip: Label Size", value:18, description:"Tooltip font size, in pixels.", type:"number", min:5, wgtref: 'tooltip', wgtname:"tooltip_fontsize", order:98 },
                tooltipFontColor: { name:"Tooltip: Label Color", value:0x5B5F65, description:"Tooltip font color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_fontcolor", order:99 },
                tooltipBorderWidth: { name:"Tooltip: Border Width", value:2, description:"Tooltip border width, in pixels.", type:"number", min:0, wgtref: 'tooltip', wgtname:"tooltip_border_width", order:94, display: false },
                tooltipBorderColor: { name:"Tooltip: Border Color", value:0xd2d3d5, description:"Tooltip border color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_border_color", order:95, display: false },
                tooltipBckgrndColor: { name:"Tooltip: Bckgrnd Color", value:0xFFFFFF, description:"Tooltip background color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_bckgrnd_color", order:96, display: false },

                // LightBox Parameters
                rowBtnUseZoom: { name:"LightBox: Enable for Row Btn", value:false, description:"If set true and row widget has an image, the lightbox feature will be enabled.", type:"bool", wgtref: 'rowbtn', wgtname:"use_lightbox", order:100 },
                colBtnUseZoom: { name:"LightBox: Enable for Column Btn", value:false, description:"If set true and column widget has an image, the lightbox feature will be enabled.", type:"bool", wgtref: 'colbtn', wgtname:"use_lightbox", order:93 },
                zoomActionType: { name:"LightBox: Action Type", value:'click append image', description:"User action type to display image.", type:"combo", options:['click append image', 'click append widget', 'mouseover'], wgtref: 'ctz', wgtname:"action_type", order:52 },
                rowZoomHoffset: { name:"LightBox: Row Zoom Btn Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"zoom_left", order:112 },
                rowZoomVoffset: { name:"LightBox: Row Zoom Btn Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"zoom_top", order:113 },
                colZoomHoffset: { name:"LightBox: Column Zoom Btn Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"zoom_left", order:112 },
                colZoomVoffset: { name:"LightBox: Column Zoom Btn Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"zoom_top", order:113 },
                zoomImp: { name:"LightBox: Zoom Btn Import Image", value:"", description:"Zoom button imported image.", type:"bitmapdata", wgtref: 'ctz', wgtname:"zoom_import", order:109 },
                zoomWidth: { name:"LightBox: Zoom Btn Width", value:20, description:"Zoom button background width, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"zoom_width", order:110 },
                zoomHeight: { name:"LightBox: Zoom Btn Height", value:20, description:"Zoom button background height, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"zoom_height", order:111 },
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
                        configObj.border_style = "none";
                        configObj.padding = 0;
                        break;
                    case 'colcontain' :
                        configObj.id = "QColumnContainer";
                        configObj.show_bckgrnd = (this.qStudioVar.params.colContainBckgrndDispType.value.toLowerCase() === "vector");
                        configObj.show_bckgrnd_import = (this.qStudioVar.params.colContainBckgrndDispType.value.toLowerCase() === "import");
                        configObj.direction = (this.qStudioVar.params.colContainType.value.toLowerCase().indexOf("vertical") !== -1) ? "vertical" : "horizontal";
                        configObj.position = "relative";
                        configObj.autoWidth = true;
                        configObj.autoHeight = true;
                        configObj.border_style = "none";
                        configObj.padding = 0;
                        break;
                    case 'rowbtn'  :
                        configObj.txtbtn_trim = (this.qStudioVar.params.rowTxtBtnAdjustHeightType.value !== "none");
                        break;
                    case 'colbtn'  :
                        configObj.txtbtn_trim = (this.qStudioVar.params.colTxtBtnAdjustHeightType.value !== "none");
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
                if (rowObject.hasOwnProperty(key)) {
                    if (paramNameObj.hasOwnProperty(key)) {
                        if (!paramNameObj[key].wgtexclude) {
                            this.__validateParam(paramNameObj, wgtNameObj, rowObject, key);
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

        __setColumnBtnLevelParams: function(colObject, wgtNameObj) {
            var paramNameObj = this.getColumnBtnParams();
            for (var key in colObject) {
                if (colObject.hasOwnProperty(key)) {
                    if (paramNameObj.hasOwnProperty(key)) {
                        if (!paramNameObj[key].wgtexclude) {
                            switch (key) {
                                case "colRadShowImp" :
                                    if (wgtNameObj.isRadio && typeof colObject[key] === 'boolean') { wgtNameObj['show_bckgrnd_import'] = colObject[key]; }
                                    break;
                                case "colChkShowImp" :
                                    if (!wgtNameObj.isRadio && typeof colObject[key] === 'boolean') { wgtNameObj['show_bckgrnd_import'] = colObject[key]; }
                                    break;
                                case "colRadImpUp" :
                                case "colChkImpUp" :
                                    if (QUtility.isString(colObject[key]) && colObject[key].length > 0) {
                                        if ((key === "colRadImpUp" && wgtNameObj.isRadio) || (key === "colChkImpUp" && !wgtNameObj.isRadio)) {
                                            wgtNameObj['bckgrnd_import_up'] = colObject[key];
                                        }
                                    }
                                    break;
                                case "colRadImpOver" :
                                case "colChkImpOver" :
                                    if (QUtility.isString(colObject[key]) && colObject[key].length > 0) {
                                        if ((key === "colRadImpOver" && wgtNameObj.isRadio) || (key === "colChkImpOver" && !wgtNameObj.isRadio)) {
                                            wgtNameObj['bckgrnd_import_over'] = colObject[key];
                                        }
                                    }
                                    break;
                                case "colRadImpDown" :
                                case "colChkImpDown" :
                                    if (QUtility.isString(colObject[key]) && colObject[key].length > 0) {
                                        if ((key === "colRadImpDown" && wgtNameObj.isRadio) || (key === "colChkImpDown" && !wgtNameObj.isRadio)) {
                                            wgtNameObj['bckgrnd_import_down'] = colObject[key];
                                        }
                                    }
                                    break;
                                default :
                                    this.__validateParam(paramNameObj, wgtNameObj, colObject, key);
                                    break;
                            }
                        }
                    } else {
                        // deprecated keys
                        switch (key) {
                            case "width" :
                            case "height" :
                                if (QUtility.isNumber(colObject[key])) { wgtNameObj[key] = colObject[key]; }
                                break;
                            case "useTooltip" :
                                if (typeof colObject[key] === "boolean") { wgtNameObj['use_tooltip'] = colObject[key]; }
                                break;
                            case "useZoom" :
                                if (typeof colObject[key] === "boolean") { wgtNameObj['use_lightbox'] = colObject[key]; }
                                break;
                            case "showImpBckgrnd" :
                                if (typeof colObject[key] === 'boolean') { wgtNameObj['show_bckgrnd_import'] = colObject[key]; }
                                break;
                            case "bckgrndUp" :
                                if (QUtility.isString(colObject[key]) && colObject[key].length > 0) { wgtNameObj['bckgrnd_import_up'] = colObject[key]; }
                                break;
                            case "bckgrndOver" :
                                if (QUtility.isString(colObject[key]) && colObject[key].length > 0) { wgtNameObj['bckgrnd_import_over'] = colObject[key]; }
                                break;
                            case "bckgrndDown" :
                                if (QUtility.isString(colObject[key]) && colObject[key].length > 0) { wgtNameObj['bckgrnd_import_down'] = colObject[key]; }
                                break;
                            default :
                                break;
                        }
                    }
                }
            }
        },

        __createDefaultMatrix: function() {
            // Create Default Matrix
            var that = this,
                doc = document,
                params = this.qStudioVar.params,
                respRef = this.qStudioVar.respRef,
                compContain = this.qStudioVar.compContain,
                eventDown = this.qStudioVar.events.down,
                eventUp = this.qStudioVar.events.up,
                eventMove = this.qStudioVar.events.move,
                eventCancel = this.qStudioVar.events.cancel,
                txtEvent = ("oninput" in compContain) ? "input.btnmatrix" : "keyup.btnmatrix",
                touchCoordArray = this.qStudioVar.touchCoordArray;

            // To fix IE9 bug where input event does not fire on backspace/del
            if (QUtility.ieVersion() <= 9) { txtEvent = "keyup.btnmatrix"; }

            // default click handler helper function
            var clickHandler = function(row, col) {
                var controllerBool = that.manageClick(col);
                if (typeof controllerBool === 'boolean' && controllerBool !== row.isAnswered()) {
                    row.isAnswered(controllerBool);
                    if (that._setLayoutCache.contain) {
                        that.setHelper(row);
                    }
                }
            };

            // record reference to rowContain
            this.qStudioVar.rowContain = QStudioCompFactory.layoutFactory(
                params.rowContainType.value.toLowerCase().substr(0, params.rowContainType.value.toLowerCase().indexOf('layout') - 1),
                compContain,
                this.getRowContainParams(true)
            );

            // record reference to set layout rowContain
            if (params.rowContainType.value.toLowerCase().indexOf("set") !== -1) {
                this._setLayoutCache.contain = this.qStudioVar.rowContain;
            }

            // init matrix setup
            this.__updateDefaultMatrix(true);

            // helper function for column buttons to remove all events
            var cleanup = function(colEle) {
                $(colEle).off(eventUp);
                $(colEle).off(eventCancel);
                $(doc).off(eventMove);
                $(doc).off(eventUp);
            };

            // add click/tap event
            $(compContain).on(eventDown, '.qwidget_button', function(event) {
                event.stopPropagation();
                var colEle = event.currentTarget,
                    colIndex = parseInt(colEle.getAttribute('colIndex'), 10),
                    rowIndex = parseInt(colEle.getAttribute('rowIndex'), 10),
                    row = respRef[rowIndex].row,
                    col = respRef[rowIndex].column[colIndex];

                if ((!col.enabled()) || that.qStudioVar.isUpdating) { return; }
                if (event.type === "mousedown" || event.type === "touchstart" || event.type === "pointerdown" || event.type === "MSPointerDown") {
                    var startX = (event.originalEvent.touches) ? event.originalEvent.touches[0].clientX : null,
                        startY = (event.originalEvent.touches) ? event.originalEvent.touches[0].clientY : null;

                    if (startX !== null && startY !== null) {
                        // touchcancel event
                        $(colEle).on(eventCancel, function(event) {
                            event.stopPropagation();
                            cleanup(colEle);
                        });

                        // touchmove event
                        $(doc).on(eventMove, function(event) {
                            event.stopPropagation();
                            cleanup(colEle);
                        });
                    } else {
                        $(doc).on(eventUp, function(event) {
                            event.preventDefault();
                            event.stopPropagation();
                            cleanup(colEle);
                        });
                    }

                    // touchend event
                    $(colEle).on(eventUp, function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        cleanup(colEle);

                        // push touch start coordinates into touchCoordArray
                        if (startX !== null && startY !== null) {
                            touchCoordArray.push(startX, startY);
                            setTimeout(function () {
                                touchCoordArray.splice(0, 2);
                            }, 700);
                        }

                        // click handler
                        clickHandler(row, col);
                    });
                }
            });

            // add textarea event
            $(compContain).on(txtEvent, '.qwidget_button', function(event) {
                var rowIndex = parseInt(event.currentTarget.getAttribute('rowIndex'), 10),
                    colIndex = parseInt(event.currentTarget.getAttribute('colIndex'), 10),
                    row = respRef[rowIndex].row,
                    col = respRef[rowIndex].column[colIndex],
                    controllerBool = null;

                if (!col.enabled() || !col.isOther() || that.qStudioVar.isUpdating) { return; }
                controllerBool = that.manageChange(col);
                if (typeof controllerBool === 'boolean' && controllerBool !== row.isAnswered()) {
                    row.isAnswered(controllerBool);
                    if (that._setLayoutCache.contain) { that.setHelper(row); }
                }
            });

            // for QStudio and set layoyuts -- take Control of survey Next/Back buttons to navigate layout
            if (this.qStudioVar.dcProxy && this._setLayoutCache.contain) {
                this.qStudioVar.dcProxy.hideNextButton();
                this.qStudioVar.dcProxy.hideBackButton();
                this.bindNavNext(that.qStudioVar.dcProxy.createComponentNextButton());
                this.bindNavBack(that.qStudioVar.dcProxy.createComponentBackButton());
                this.toggleQStudioNavBtns();
            }
        },

        __updateDefaultMatrix: function(init) {
            // if init is true, we are creating for the first time, else updating
            var compContain = this.qStudioVar.compContain,
                rowContain = this.qStudioVar.rowContain,
                respRef = this.qStudioVar.respRef,
                params = this.qStudioVar.params,
                horzContainConfigObj = {
                    position: "relative",
                    border_width: params.rowContainBorderWidth.value,
                    border_style: params.rowContainBorderStyle.value,
                    border_color: params.rowContainBorderColor.value,
                    show_bckgrnd: false,
                    padding: params.rowContainPadding.value,
                    hgap: 10,
                    autoHeight: true,
                    autoWidth: true,
                    isRTL : this.qStudioVar.isCompRTL
                },
                isRating = (params.compClickType.value.toLowerCase() === 'rating'),
                rowSyncTxtBtnHeight = (params.rowTxtBtnAdjustHeightType.value === "all"),
                rowSyncTxtBtnArray = [],
                rowMaxTxtBtnHeight = 0,
                colSyncTxtBtnHeight = (params.colTxtBtnAdjustHeightType.value === "all"),
                colSyncTxtBtnArray = [],
                colMaxTxtBtnHeight = 0,
                rowArray = this.qStudioVar.rowArray,
                i = 0, rlen = rowArray.length,
                columnArray = this.qStudioVar.columnArray,
                j = 0, clen = columnArray.length,
                curSetIndex = 0;

            if (!init) {
                this.qStudioVar.isUpdating = true;
                qToolTipSingleton.getInstance().hide();

                // reset setRefArray for set layouts
                if (this._setLayoutCache.contain) {
                    this._setLayoutCache.setRefArray = [];
                    curSetIndex = this._setLayoutCache.contain.setIndex();
                }

                // remove all widgets from rowContain & update
                rowContain.remove();
                rowContain.config(this.getRowContainParams(true));
            }

            // if layout type is 'vertical column label' we need to add a row to contain the column labels
            if (this.qStudioVar.isLayoutVertColLabel) {
                // create label horizontal layout
                var labHorzContainConfig = jQuery.extend({}, horzContainConfigObj);
                labHorzContainConfig.border_style = "none";
                labHorzContainConfig.padding = 0;
                var labelHorzContain = QStudioCompFactory.layoutFactory(
                    "horizontal",
                    compContain,
                    labHorzContainConfig
                );

                // create label column container
                var labColContainConfig = this.getColumnContainParams(true);
                labColContainConfig.option_valign = "bottom";
                labColContainConfig.show_bckgrnd = false;
                labColContainConfig.show_bckgrnd_import = false;
                var labelColContain = QStudioCompFactory.layoutFactory(
                    params.colContainType.value.toLowerCase().substr(0, params.colContainType.value.toLowerCase().indexOf('layout')-1),
                    compContain,
                    labColContainConfig
                );
            }

            // create/update row widget
            for (i; i<rlen; i+=1) {
                var rowObject = rowArray[i],
                    userDefType = jQuery.trim(rowObject.var1 || rowObject.type).toLowerCase(),
                    wgtNameObj = this.getRowBtnParams(true),
                    rowBtnType = params.rowBtnDefaultType.value.toLowerCase(),
                    rowWgt = undefined,
                    horzContain = undefined,
                    colContain = undefined;

                if (init) {
                    horzContain = QStudioCompFactory.layoutFactory(
                        "horizontal",
                        compContain,
                        horzContainConfigObj
                    );

                    colContain = QStudioCompFactory.layoutFactory(
                        params.colContainType.value.toLowerCase().substr(0, params.colContainType.value.toLowerCase().indexOf('layout')-1),
                        compContain,
                        this.getColumnContainParams(true)
                    );
                } else {
                    // remove all widgets from horzContain & update
                    horzContain = respRef[i].horzContain;
                    horzContain.remove();
                    horzContain.config(horzContainConfigObj);

                    // remove all widgets from colContain & update
                    colContain = respRef[i].colContain;
                    colContain.remove();
                    colContain.config(this.getColumnContainParams(true));
                }

                // check if user defined type is a valid row widget
                if (this.getAcceptedRowWidgets(userDefType) === true) { rowBtnType = userDefType; }

                // set widget params
                wgtNameObj.rowIndex = i;
                wgtNameObj.id = rowObject.id || 'row_' + i;
                wgtNameObj.label = rowObject.label;
                wgtNameObj.description = rowObject.description;
                wgtNameObj.image = rowObject.image;

                // set widget button level params
                this.__setRowBtnLevelParams(rowObject, wgtNameObj);

                // If row button is label only, preset a textbtn widget
                if (rowBtnType.toLowerCase() === "label only") {
                    rowBtnType = "text";
                    wgtNameObj.txtbtn_trim = true;
                    wgtNameObj.show_bckgrnd = false;
                    wgtNameObj.padding = 0;
                }

                if (init) {
                    rowWgt = QStudioCompFactory.widgetFactory(
                        rowBtnType,
                        compContain,
                        wgtNameObj
                    );

                    // If set layout, disable all rows except for first.
                    if (this._setLayoutCache.contain) {
                        if (i !== 0) {
                            rowWgt.enabled(false, {
                                alphaVal: params.rowContainChldInitAlpha.value,
                                goOpaque: params.rowContainGoOpaque.value,
                                enableExtEvt: (params.rowContainChldInitAlpha.value === 100)
                            });
                        } else {
                            rowWgt.enabled(false, {
                                alphaVal: 100,
                                goOpaque: params.rowContainGoOpaque.value,
                                enableExtEvt: true
                            });
                        }
                    } else {
                        rowWgt.enabled(false, { alphaVal: 100, enableExtEvt: true });
                    }
                    rowWgt.touchEnabled(QUtility.isTouchDevice());

                    // Create 'rowIndex' attribute for row widget for use w/ controller
                    rowWgt.widget().setAttribute('rowIndex', i.toString());

                    // Remove class name from row widgets to exclude from controller
                    rowWgt.widget().className = "";

                    // Set row widget CSS display prop
                    rowWgt.widget().style.display = (rowBtnType.toLowerCase() !== "none") ? "" : "none";

                    // Store reference of Row Widget for use w/ controller
                    respRef.push({
                        row: rowWgt,                        // Record row widget
                        horzContain: horzContain,           // Record horz container widget
                        colContain: colContain,             // Record column container widget
                        column: [],                         // Keeps track of row column widgets
                        respArry: [],                       // Keeps track of selected row column widgets
                        oeRespArry: []                      // Keeps track of Other & Other Numeric column textarea inputs
                    });
                } else {
                    rowWgt = respRef[i].row;
                    // update Row Button Widget
                    rowWgt.config(wgtNameObj);
                }

                // create/update set layout ref object
                if (this._setLayoutCache.contain) {
                    var setIndex = ((i - (i % params.rowContainSetRowPer.value))/params.rowContainSetRowPer.value);
                    if (i % params.rowContainSetRowPer.value !== 0) {
                        this._setLayoutCache.setRefArray[setIndex].rowCnt += 1;
                    } else {
                        this._setLayoutCache.setRefArray.push({
                            rowCnt: 1,          // Number of rows in the set
                            rowAnsCnt: 0,       // var to keep track of answered rows in a set
                            isAnswered: false,  // boolean flag to indicate whether all rows in a set have been answered
                            hasVisited: false   // boolean flag to indicate whether set has been visited (used to restrict autoNexting)
                        });
                    }

                    // if we're updating set rowAnsCnt, isAnswered, & hasVisited props
                    if (!init) {
                        if (rowWgt.isAnswered()) { this._setLayoutCache.setRefArray[setIndex].rowAnsCnt += 1 }
                        this._setLayoutCache.setRefArray[setIndex].isAnswered =
                            (this._setLayoutCache.setRefArray[setIndex].rowCnt === this._setLayoutCache.setRefArray[setIndex].rowAnsCnt);
                        this._setLayoutCache.setRefArray[setIndex].hasVisited =
                            (this._setLayoutCache.setRefArray[setIndex].rowAnsCnt > 0);
                    }
                }

                // create/update column widgets
                for (j = 0; j < clen; j += 1) {
                    var colObject = columnArray[j],
                        userDefType = jQuery.trim(colObject.var1 || colObject.type).toLowerCase(),
                        wgtNameObj = this.getColumnBtnParams(true),
                        colBtnType = params.colBtnDefaultType.value.toLowerCase(),
                        colWgt = undefined;

                    // check if user defined type is a valid column widget
                    if (this.getAcceptedColumnWidgets(userDefType) === true) { colBtnType = userDefType; }

                    // set base widget params
                    wgtNameObj.isRadio = ((this.questionType() === 'single' && !isRating) || QUtility.getBtnIsRadio(colObject));
                    wgtNameObj.rowIndex = i;
                    wgtNameObj.colIndex = j;
                    wgtNameObj.id = colObject.id || 'col_' + j;
                    wgtNameObj.label = colObject.label;
                    wgtNameObj.description = colObject.description;
                    wgtNameObj.image = colObject.image;
                    wgtNameObj.show_bckgrnd_import = (wgtNameObj.isRadio) ? params.colRadShowImp.value : params.colChkShowImp.value;
                    wgtNameObj.bckgrnd_import_up = (wgtNameObj.isRadio) ? params.colRadImpUp.value : params.colChkImpUp.value;
                    wgtNameObj.bckgrnd_import_over = (wgtNameObj.isRadio) ? params.colRadImpOver.value : params.colChkImpOver.value;
                    wgtNameObj.bckgrnd_import_down = (wgtNameObj.isRadio) ? params.colRadImpDown.value : params.colChkImpDown.value;

                    // see if we need to set button level params
                    this.__setColumnBtnLevelParams(colObject, wgtNameObj);

                    if (init) {
                        colWgt = QStudioCompFactory.widgetFactory(
                            colBtnType,
                            compContain,
                            wgtNameObj
                        );

                        // If set layout, disable all column buttons except for first row.
                        if (this._setLayoutCache.contain) {
                            if (i !== 0) {
                                colWgt.enabled((params.rowContainChldInitAlpha.value === 100), {
                                    alphaVal: params.rowContainChldInitAlpha.value,
                                    goOpaque: params.rowContainGoOpaque.value
                                });
                            } else {
                                colWgt.enabled(true, {
                                    alphaVal: 100,
                                    goOpaque: params.rowContainGoOpaque.value
                                });
                            }
                        }
                        colWgt.touchEnabled(QUtility.isTouchDevice());

                        // Create 'rowIndex' attribute for column widget for use w/ controller
                        // Create 'colIndex' attribute for column widget for use w/ controller
                        colWgt.widget().setAttribute('rowIndex', i.toString());
                        colWgt.widget().setAttribute('colIndex', j.toString());

                        // Store reference of Column Widget for use w/ controller
                        respRef[i].column.push(colWgt);

                        // Set whether column button is 'rating' type
                        if (isRating) {
                            colWgt.isRating(!colWgt.isRadio());
                            // If widget is rating type, remove default mouseenter/mouseleave events
                            if (colWgt.isRating()) { colWgt.removeEvent(colWgt.widget(), colWgt._events.hover); }
                        }
                    } else {
                        colWgt = respRef[i].column[j];
                        // update Column Button Widget
                        colWgt.config(wgtNameObj);
                    }

                    // if we are sync'ing text button heights add to column container after calculating max text button height
                    if (!colSyncTxtBtnHeight) {
                        // Add column widget to colContain
                        colContain.add(colWgt, !!colObject.ownRow);
                    } else {
                        if (colBtnType === "text") {
                            colSyncTxtBtnArray[j] = colWgt;
                            colMaxTxtBtnHeight = Math.max(colMaxTxtBtnHeight, $(colWgt.cache().nodes.background).height());
                        }
                    }

                    // create column widgets for label column container
                    if (this.qStudioVar.isLayoutVertColLabel && i === 0) {
                        var labelColConfigObj = jQuery.extend({}, wgtNameObj);
                        labelColConfigObj.show_bckgrnd_import = false;
                        labelColConfigObj.label =  wgtNameObj.label;
                        labelColConfigObj.txtbtn_trim = true;
                        var labelColWgt = QStudioCompFactory.widgetFactory(
                            "text",
                            compContain,
                            labelColConfigObj
                        );
                        labelColWgt.cache().nodes.background.style.backgroundColor = "transparent";
                        labelColWgt.cache().nodes.background.style.borderColor = "transparent";
                        labelColWgt.cache().nodes.label.style.top = -labelColConfigObj.padding + "px";
                        labelColWgt.widget().style.height = ($(labelColWgt.cache().nodes.label).height() + 2) + "px";
                        labelColWgt.widget().className = "";
                        labelColWgt.enabled(false, { alphaVal: 100 });

                        // Append labelColWgt to labelColContain
                        labelColContain.add(labelColWgt);
                    }
                }

                // create row widget for label horizontal layout
                if (this.qStudioVar.isLayoutVertColLabel && i === 0) {
                    var labelRowConfigObj = this.getRowBtnParams(true);
                    labelRowConfigObj.width = 1;
                    labelRowConfigObj.padding = 0;
                    labelRowConfigObj.label = "";
                    labelRowConfigObj.txtbtn_trim = true;
                    var labelRowWgt = QStudioCompFactory.widgetFactory(
                        "text",
                        compContain,
                        labelRowConfigObj
                    );
                    labelRowWgt.widget().className = "";
                    labelRowWgt.widget().style.display = "none";

                    // Append labelRowWgt to labelHorzContain
                    labelHorzContain.add(labelRowWgt);

                    // Append labelHorzContain & labelColContain to rowContain
                    labelHorzContain.add(labelColContain.container());

                    // set the vertical gap for rowContain to 0
                    rowContain.config({ vgap : 0 });
                    rowContain.add(labelHorzContain.container());
                } else {
                    if (rowContain.config().vgap !== params.rowContainVgap.value) {
                        rowContain.config({ vgap : params.rowContainVgap.value });
                    }
                }

                if (!rowSyncTxtBtnHeight && !colSyncTxtBtnHeight) {
                    // Add row widget to horzContain
                    if (rowWgt.widget().style.display !== "none") {
                        horzContain.add(rowWgt);
                    } else {
                        if (rowWgt.widget().parentNode && rowWgt.widget().parentNode.nodeType === 1) {
                            rowWgt.widget().parentNode.removeChild(rowWgt.widget());
                        }
                    }

                    // Add colContain to horzContain
                    horzContain.add(colContain.container());

                    // Add horzContain to rowContain
                    rowContain.add(horzContain.container());
                } else {
                    if (rowBtnType === "text") {
                        rowSyncTxtBtnArray[i] = rowWgt;
                        rowMaxTxtBtnHeight = Math.max(rowMaxTxtBtnHeight, $(rowWgt.cache().nodes.background).height());
                    }
                }
            }

            // for 'vertical column label' adjust label container position to account for border_width and padding
            if (this.qStudioVar.isLayoutVertColLabel && labelColContain) {
                labelColContain.container().style[(!this.qStudioVar.isCompRTL) ? "left" : "right"] = (-params.rowContainPadding.value - params.rowContainBorderWidth.value) + "px";
            }

            // if we need to sync either row and/or column button text widget height
            if (rowSyncTxtBtnHeight || colSyncTxtBtnHeight) {
                for (i = 0; i < rlen; i += 1) {
                    var horzContain = respRef[i].horzContain,
                        colContain = respRef[i].colContain,
                        rowWgt = respRef[i].row;

                    // set text widget new height
                    if (rowSyncTxtBtnArray[i]) {
                        rowWgt.config({
                            height : rowMaxTxtBtnHeight,
                            txtbtn_trim : false
                        });
                    }

                    for (j = 0; j < clen; j += 1) {
                        var colWgt = respRef[i].column[j];
                        // set text widget new height
                        if (colSyncTxtBtnArray[j]) {
                            colWgt.config({
                                height : colMaxTxtBtnHeight,
                                txtbtn_trim : false
                            });
                        }

                        // Add column widget to colContain
                        colContain.add(colWgt, !!columnArray[j].ownRow);
                    }

                    // Add row widget to horzContain
                    if (rowWgt.widget().style.display !== "none") {
                        horzContain.add(rowWgt);
                    } else {
                        if (rowWgt.widget().parentNode && rowWgt.widget().parentNode.nodeType === 1) {
                            rowWgt.widget().parentNode.removeChild(rowWgt.widget());
                        }
                    }

                    // Add colContain to horzContain
                    horzContain.add(colContain.container());

                    // Add horzContain to rowContain
                    rowContain.add(horzContain.container());
                }
            }

            // check if we need to goto to a previous set index (*for set layouts)
            if (this._setLayoutCache.contain && curSetIndex > 0) {
                this._setLayoutCache.contain.setIndex(curSetIndex);
            }

            this.qStudioVar.isUpdating = false;
        },

        __createScrollMatrix: function() {
            // Create Default Matrix
            var that = this,
                doc = document,
                params = this.qStudioVar.params,
                respRef = this.qStudioVar.respRef,
                compContain = this.qStudioVar.compContain,
                rowContainConfig = this.getRowContainParams(true),
                colContainConfig = this.getColumnContainParams(true),
                eventDown = this.qStudioVar.events.down,
                eventUp = this.qStudioVar.events.up,
                eventMove = this.qStudioVar.events.move,
                eventCancel = this.qStudioVar.events.cancel,
                txtEvent = ("oninput" in compContain) ? "input.btnmatrix" : "keyup.btnmatrix",
                touchCoordArray = this.qStudioVar.touchCoordArray;

            // To fix IE9 bug where input event does not fire on backspace/del
            if (QUtility.ieVersion() <= 9) { txtEvent = "keyup.btnmatrix"; }

            // scroll click handler helper function
            var clickHandler = function(row, col) {
                row.isAnswered(that.manageClick(col));
                if (that.isAutoNextEnabled()) {
                    if (row.isAnswered()) {
                        if ((that._scrollLayoutCache.contain.next() !== false)) {
                            that.scrollHelper();
                        } else {
                            if (that._navNextCallBack) { that._navNextCallBack(); }
                            if (that.qStudioVar.dcProxy) {
                                that.qStudioVar.dcProxy.removeComponentBackButton(that.qStudioVar.compBackBtn);
                                that.qStudioVar.dcProxy.removeComponentNextButton(that.qStudioVar.compNextBtn);
                                that.qStudioVar.dcProxy.next();
                            }
                        }
                    }
                } else {
                    that.toggleQStudioNavBtns();
                }
            };

            // init rowContain
            rowContainConfig.position = "relative";
            rowContainConfig.left += colContainConfig.left;
            this.qStudioVar.rowContain = QStudioCompFactory.layoutFactory(
                "scroll",
                compContain,
                rowContainConfig
            );

            // record reference to scroll layout rowContain
            this._scrollLayoutCache.contain = this.qStudioVar.rowContain;

            // init colContain
            colContainConfig.position = "relative";
            colContainConfig.padding = params.rowContainPadding.value;
            colContainConfig.border_style = params.rowContainBorderStyle.value;
            colContainConfig.border_width = params.rowContainBorderWidth.value;
            colContainConfig.border_color = params.rowContainBorderColor.value;
            colContainConfig.show_label = params.rowContainShowLabel.value;
            colContainConfig.label = params.rowContainLabel.value;
            colContainConfig.label_halign = params.rowContainLabelHalign.value;
            colContainConfig.label_fontsize = params.rowContainLabelFontSize.value;
            colContainConfig.label_padding = params.rowContainLabelPadding.value;
            colContainConfig.label_fontcolor = params.rowContainLabelColor.value;
            this.qStudioVar.colContain =  QStudioCompFactory.layoutFactory(
                params.colContainType.value.toLowerCase().substr(0, params.colContainType.value.toLowerCase().indexOf('layout')-1),
                compContain,
                colContainConfig
            );

            // for vertical scroll layout set compContain overflow to hidden (*exclude QStudio)
            compContain.style.overflow = (!this.qStudioVar.dcProxy && (rowContainConfig.direction === "vertical")) ? "hidden" : "";

            // init matrix setup
            this.__updateScrollMatrix(true);

            // helper function for column buttons to remove all events
            var cleanup = function(colEle) {
                $(colEle).off(eventUp);
                $(colEle).off(eventCancel);
                $(doc).off(eventMove);
                $(doc).off(eventUp);
            };

            // add click/tap event
            $(compContain).on(eventDown, '.qwidget_button', function(event) {
                event.stopPropagation();
                var colEle = event.currentTarget,
                    colIndex = parseInt(colEle.getAttribute('colIndex'), 10),
                    rowIndex = that._scrollLayoutCache.contain.scrollIndex(),
                    row = respRef[rowIndex].row,
                    col = respRef[rowIndex].column[colIndex];

                if ((!col.enabled()) || that.qStudioVar.isUpdating) { return; }
                if (event.type === "mousedown" || event.type === "touchstart" || event.type === "pointerdown" || event.type === "MSPointerDown") {
                    var startX = (event.originalEvent.touches) ? event.originalEvent.touches[0].clientX : null,
                        startY = (event.originalEvent.touches) ? event.originalEvent.touches[0].clientY : null;

                    if (startX !== null && startY !== null) {
                        // touchcancel event
                        $(colEle).on(eventCancel, function(event) {
                            event.stopPropagation();
                            cleanup(colEle);
                        });

                        // touchmove event
                        $(doc).on(eventMove, function(event) {
                            event.stopPropagation();
                            cleanup(colEle);
                        });
                    } else {
                        $(doc).on(eventUp, function(event) {
                            event.preventDefault();
                            event.stopPropagation();
                            cleanup(colEle);
                        });
                    }

                    // touchend event
                    $(colEle).on(eventUp, function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        cleanup(colEle);

                        // push touch start coordinates into touchCoordArray
                        if (startX !== null && startY !== null) {
                            touchCoordArray.push(startX, startY);
                            setTimeout(function () {
                                touchCoordArray.splice(0, 2);
                            }, 700);
                        }

                        // click handler
                        clickHandler(row, col);
                    });
                }
            });

            // add textarea event
            $(compContain).on(txtEvent, '.qwidget_button', function(event) {
                var rowIndex = that._scrollLayoutCache.contain.scrollIndex(),
                    colIndex = parseInt(event.currentTarget.getAttribute('colIndex'), 10),
                    row = respRef[rowIndex].row,
                    col = respRef[rowIndex].column[colIndex];

                if (!col.enabled() || !col.isOther() || that.qStudioVar.isUpdating) { return; }
                row.isAnswered(that.manageChange(col));
                if (that.isAutoNextEnabled()) {
                    if (row.isAnswered()) {
                        if ((that._scrollLayoutCache.contain.next() !== false)) {
                            that.scrollHelper();
                        } else {
                            if (that._navNextCallBack) { that._navNextCallBack(); }
                            if (that.qStudioVar.dcProxy) {
                                that.qStudioVar.dcProxy.removeComponentBackButton(that.qStudioVar.compBackBtn);
                                that.qStudioVar.dcProxy.removeComponentNextButton(that.qStudioVar.compNextBtn);
                                that.qStudioVar.dcProxy.next();
                            }
                        }
                    }
                } else {
                    that.toggleQStudioNavBtns();
                }
            });

            // for QStudio and scroll layoyuts -- take Control of survey Next/Back buttons to navigate layout
            if (this.qStudioVar.dcProxy) {
                this.qStudioVar.dcProxy.hideNextButton();
                this.qStudioVar.dcProxy.hideBackButton();
                this.bindNavNext(that.qStudioVar.dcProxy.createComponentNextButton());
                this.bindNavBack(that.qStudioVar.dcProxy.createComponentBackButton());
                this.toggleQStudioNavBtns();
            }
        },

        __updateScrollMatrix: function(init) {
            // if init is true, we are creating for the first time, else updating
            var compContain = this.qStudioVar.compContain,
                rowContain = this.qStudioVar.rowContain,
                colContain = this.qStudioVar.colContain,
                respRef = this.qStudioVar.respRef,
                params = this.qStudioVar.params,
                isRating = (params.compClickType.value.toLowerCase() === 'rating'),
                rowSyncTxtBtnHeight = (params.rowTxtBtnAdjustHeightType.value === "all"),
                rowSyncTxtBtnArray = [],
                rowMaxTxtBtnHeight = 0,
                colSyncTxtBtnHeight = (params.colTxtBtnAdjustHeightType.value === "all"),
                colSyncTxtBtnArray = [],
                colMaxTxtBtnHeight = 0,
                rowArray = this.qStudioVar.rowArray,
                i = 0, rlen = rowArray.length,
                columnArray = this.qStudioVar.columnArray,
                j = 0, clen = columnArray.length,
                curScrollIndex = 0;

            if (!init) {
                this.qStudioVar.isUpdating = true;
                qToolTipSingleton.getInstance().hide();
                var rowContainConfig = this.getRowContainParams(true),
                    colContainConfig = this.getColumnContainParams(true);

                // record current scroll index so we can go back to after updating
                curScrollIndex = this._scrollLayoutCache.contain.scrollIndex();

                // remove all widgets from rowContain & update
                rowContainConfig.position = "relative";
                rowContainConfig.left += colContainConfig.left;
                rowContain.remove();
                rowContain.config(rowContainConfig);

                // remove all widgets from colContain & update
                colContainConfig.position = "relative";
                colContainConfig.padding = params.rowContainPadding.value;
                colContainConfig.border_style = params.rowContainBorderStyle.value;
                colContainConfig.border_width = params.rowContainBorderWidth.value;
                colContainConfig.border_color = params.rowContainBorderColor.value;
                colContainConfig.show_label = params.rowContainShowLabel.value;
                colContainConfig.label = params.rowContainLabel.value;
                colContainConfig.label_halign = params.rowContainLabelHalign.value;
                colContainConfig.label_fontsize = params.rowContainLabelFontSize.value;
                colContainConfig.label_padding = params.rowContainLabelPadding.value;
                colContainConfig.label_fontcolor = params.rowContainLabelColor.value;
                colContain.remove();
                colContain.config(colContainConfig);
            }

            // column widget create/update
            for (j=0; j<clen; j+=1) {
                var colObject = columnArray[j],
                    userDefType = jQuery.trim(colObject.var1 || colObject.type).toLowerCase(),
                    wgtNameObj = this.getColumnBtnParams(true),
                    colBtnType = params.colBtnDefaultType.value.toLowerCase(),
                    colWgt = undefined;

                // check if user defined type is a valid column widget
                if (this.getAcceptedColumnWidgets(userDefType) === true) { colBtnType = userDefType; }

                // set widget params
                wgtNameObj.isRadio = ((this.questionType() === 'single' && !isRating) || QUtility.getBtnIsRadio(colObject));
                wgtNameObj.colIndex = j;
                wgtNameObj.id = colObject.id || 'col_' + j;
                wgtNameObj.label = colObject.label;
                wgtNameObj.description = colObject.description;
                wgtNameObj.image = colObject.image;
                wgtNameObj.show_bckgrnd_import = (wgtNameObj.isRadio) ? params.colRadShowImp.value : params.colChkShowImp.value;
                wgtNameObj.bckgrnd_import_up = (wgtNameObj.isRadio) ? params.colRadImpUp.value : params.colChkImpUp.value;
                wgtNameObj.bckgrnd_import_over = (wgtNameObj.isRadio) ? params.colRadImpOver.value : params.colChkImpOver.value;
                wgtNameObj.bckgrnd_import_down = (wgtNameObj.isRadio) ? params.colRadImpDown.value : params.colChkImpDown.value;

                // set widget button level params
                this.__setColumnBtnLevelParams(colObject, wgtNameObj);

                if (init) {
                    colWgt = QStudioCompFactory.widgetFactory(
                        colBtnType,
                        compContain,
                        wgtNameObj
                    );

                    colWgt.enabled(true);
                    colWgt.touchEnabled(QUtility.isTouchDevice());

                    // Create 'colIndex' attribute for column widget for use w/ controller
                    colWgt.widget().setAttribute('colIndex', j.toString());

                    // Store reference of Column Widget for use w/ controller
                    this._scrollLayoutCache.columnWgtArray.push(colWgt);

                    // Set whether column button is 'rating' type
                    if (isRating) {
                        colWgt.isRating(!colWgt.isRadio());
                        // If widget is rating type, remove default mouseenter/mouseleave events
                        if (colWgt.isRating()) {
                            colWgt.removeEvent(colWgt.widget(), colWgt._events.hover);
                        }
                    }
                } else {
                    colWgt = this._scrollLayoutCache.columnWgtArray[j];
                    // update Column Button Widget
                    colWgt.config(wgtNameObj);
                }

                if (!colSyncTxtBtnHeight) {
                    // Add column widget to colContain
                    colContain.add(colWgt, !!colObject.ownRow);
                } else {
                    if (colBtnType === "text") {
                        colSyncTxtBtnArray[j] = colWgt;
                        colMaxTxtBtnHeight = Math.max(colMaxTxtBtnHeight, $(colWgt.cache().nodes.background).height());
                    }
                }
            }

            // row widget create/update
            for (i; i<rlen; i+=1) {
                var rowObject = rowArray[i],
                    userDefType = jQuery.trim(rowObject.var1 || rowObject.type).toLowerCase(),
                    wgtNameObj = this.getRowBtnParams(true),
                    rowBtnType = params.rowBtnDefaultType.value.toLowerCase(),
                    rowWgt = undefined;

                // check if user defined type is a valid row widget
                if (this.getAcceptedRowWidgets(userDefType) === true) {
                    rowBtnType = userDefType;
                }

                // set base widget params
                wgtNameObj.rowIndex = i;
                wgtNameObj.id = rowObject.id || 'row_' + i;
                wgtNameObj.label = rowObject.label;
                wgtNameObj.description = rowObject.description;
                wgtNameObj.image = rowObject.image;

                // see if we need to set button level params
                this.__setRowBtnLevelParams(rowObject, wgtNameObj);

                // If row button is label only, preset a textbtn widget
                if (rowBtnType.toLowerCase() === "label only") {
                    rowBtnType = "text";
                    wgtNameObj.txtbtn_trim = true;
                    wgtNameObj.show_bckgrnd = false;
                    wgtNameObj.padding = 0;
                }

                if (init) {
                    rowWgt = QStudioCompFactory.widgetFactory(
                        rowBtnType,
                        compContain,
                        wgtNameObj
                    );

                    rowWgt.touchEnabled(QUtility.isTouchDevice());

                    // Create 'rowIndex' attribute for row widget for use w/ controller
                    rowWgt.widget().setAttribute('rowIndex', i.toString());

                    // Remove class name from row widgets to exclude from controller
                    rowWgt.widget().className = "";

                    // Store reference of Row Widget for use w/ controller
                    respRef.push({
                        row: rowWgt,
                        column: this._scrollLayoutCache.columnWgtArray,
                        respArry: [],
                        oeRespArry: []
                    });
                } else {
                    rowWgt = respRef[i].row;
                    // update Row Button Widget
                    rowWgt.config(wgtNameObj);
                }

                if (!rowSyncTxtBtnHeight) {
                    // Add row widget to rowContain
                    rowContain.add(rowWgt);
                } else {
                    if (rowBtnType === "text") {
                        rowSyncTxtBtnArray[i] = rowWgt;
                        rowMaxTxtBtnHeight = Math.max(rowMaxTxtBtnHeight, $(rowWgt.cache().nodes.background).height());
                    }
                }
            }

            if (colSyncTxtBtnHeight) {
                for (j = 0; j < clen; j += 1) {
                    var colWgt = this._scrollLayoutCache.columnWgtArray[j];
                    if (colSyncTxtBtnArray[j]) {
                        colWgt.config({
                            height: colMaxTxtBtnHeight,
                            txtbtn_trim: false
                        });
                    }

                    // Add column widget to colContain
                    colContain.add(colWgt, !!columnArray[j].ownRow);
                }
            }

            if (rowSyncTxtBtnHeight) {
                for (i = 0; i < rlen; i += 1) {
                    var rowWgt = respRef[i].row;
                    if (rowSyncTxtBtnArray[i]) {
                        rowWgt.config({
                            height : rowMaxTxtBtnHeight,
                            txtbtn_trim : false
                        });
                    }

                    // Add to row container
                    rowContain.add(rowWgt);
                }
            }

            // Position containers accordingly
            var rowContainWidth = $(rowContain.cache().nodes.layoutContain).outerWidth(),
                colContainWidth = $(colContain.cache().nodes.layoutContain).outerWidth();

            // colContain should sit above rowContain
            rowContain.container().style.zIndex = 888;
            colContain.container().style.zIndex = 3888;

            (!this.qStudioVar.isCompRTL) ?
                (rowContain.container().style.left = (colContainWidth * 0.5) + "px") :
                (rowContain.container().style.left = (rowContainWidth - (colContainWidth * 0.5)) + "px");

            if (rowContain.config().direction === "vertical" && (rowContainWidth >= colContainWidth)) {
                rowContain.container().style.left = "";
                rowContain.cache().nodes.defaultLayout.style.left = "";
                colContain.container().style[(!this.qStudioVar.isCompRTL) ? "left" : "right"] = (rowContainWidth - colContainWidth) * 0.5 + "px";
            }

            // check if we need to goto to a previous scroll index
            if (curScrollIndex > 0) {
                this._scrollLayoutCache.contain.scrollIndex(curScrollIndex);
            }

            this.qStudioVar.isUpdating = false;
        },

        __getBtnIsRadio: function(dataSetObj) {
            if (typeof dataSetObj.var2 === "boolean") {
                return dataSetObj.var2;
            } else if (typeof dataSetObj.isRadio === "boolean") {
                return dataSetObj.isRadio;
            }

            return false;
        },

        isAutoNextEnabled: function() {
            // auto next works w/ rating click behavior or single question type only
            var isRating = (this.qStudioVar.params.compClickType.value.toLowerCase() === 'rating');
            return (this.qStudioVar.params.rowContainAutoNext.value && (isRating || this.questionType() === 'single'));
        },

        // bind next button to work w/ scroll and set layouts
        bindNavNext: function(nextNode, callback) {
            if (callback && typeof callback === 'function') {
                this._navNextCallBack = callback;
            }

            if (nextNode && nextNode.nodeType === 1) {
                this.qStudioVar.compNextBtn = nextNode;
                var that = this,
                    scrollCache = this._scrollLayoutCache,
                    setCache = this._setLayoutCache,
                    eventClick = "click.btnmatrix",
                    isNonMand = that.qStudioVar.params.rowContainNonMand.value;

                // click handler helper functions
                var clickHandlerScroll = function() {
                    var rowIndex = scrollCache.contain.scrollIndex(),
                        row = that.qStudioVar.respRef[rowIndex].row;

                    if (row.isAnswered() || isNonMand) {
                        if (scrollCache.contain.next() !== false) {
                            that.scrollHelper();
                        } else {
                            // Limit Reached
                            if (that._navNextCallBack) {
                                that._navNextCallBack();
                            }

                            // QStudio specific
                            if (that.qStudioVar.dcProxy) {
                                that.qStudioVar.dcProxy.removeComponentBackButton(that.qStudioVar.compBackBtn);
                                that.qStudioVar.dcProxy.removeComponentNextButton(that.qStudioVar.compNextBtn);
                                that.qStudioVar.dcProxy.next();
                            }
                        }
                    }
                };

                var clickHandlerSet = function() {
                    var setIndex = setCache.contain.setIndex();
                    if (setCache.setRefArray[setIndex].isAnswered || isNonMand) {
                        if (setCache.contain.next() === false) {
                            // Limit Reached
                            if (that._navNextCallBack) {
                                that._navNextCallBack();
                            }

                            // QStudio specific
                            if (that.qStudioVar.dcProxy) {
                                that.qStudioVar.dcProxy.removeComponentBackButton(that.qStudioVar.compBackBtn);
                                that.qStudioVar.dcProxy.removeComponentNextButton(that.qStudioVar.compNextBtn);
                                that.qStudioVar.dcProxy.next();
                            }
                        } else {
                            that.toggleQStudioNavBtns();
                        }
                    }
                };

                // add click/tap event
                $(nextNode).off(eventClick);
                $(nextNode).on(eventClick, function(event) {
                    event.stopPropagation();
                    // *QStudio next button
                    if (that.qStudioVar.dcProxy) {
                        event.preventDefault();
                        $(this).css({ opacity : (this.enabled) ? 1 : 0.35 });
                    }

                    if ((scrollCache.contain && scrollCache.isScrolling) || this.enabled === false) { return; }
                    // click handler
                    if (scrollCache.contain) {
                        clickHandlerScroll();
                    } else if (setCache.contain) {
                        clickHandlerSet();
                    }
                });
            }
        },

        // bind back button to work w/ scroll and set layouts
        bindNavBack: function(backNode, callback) {
            if (callback && typeof callback === 'function') {
                this._navBackCallBack = callback;
            }

            if (backNode && backNode.nodeType === 1) {
                this.qStudioVar.compBackBtn = backNode;
                var that = this,
                    scrollCache = this._scrollLayoutCache,
                    setCache = this._setLayoutCache,
                    eventClick = "click.btnmatrix";

                // click handler helper functions
                var clickHandlerScroll = function() {
                    if (scrollCache.contain.back() !== false) {
                        that.scrollHelper();
                    } else {
                        // Limit Reached
                        if (that._navBackCallBack) {
                            that._navBackCallBack();
                        }
                    }
                };

                var clickHandlerSet = function() {
                    if (setCache.contain.back() === false) {
                        // Limit Reached
                        if (that._navBackCallBack) {
                            that._navBackCallBack();
                        }
                    } else {
                        that.toggleQStudioNavBtns();
                    }
                };

                // add click/tap event
                $(backNode).off(eventClick);
                $(backNode).on(eventClick, function(event) {
                    event.stopPropagation();
                    // *QStudio next button
                    if (that.qStudioVar.dcProxy) {
                        event.preventDefault();
                        $(this).css({ opacity : (this.enabled) ? 1 : 0.35 });
                    }

                    if ((scrollCache.contain && scrollCache.isScrolling) || this.enabled === false) { return; }
                    // click handler
                    if (scrollCache.contain) {
                        clickHandlerScroll();
                    } else if (setCache.contain) {
                        clickHandlerSet();
                    }
                });
            }
        },

        // QStudio next/back button toggle
        toggleQStudioNavBtns : function() {
            if (!this.qStudioVar.dcProxy) { return; }
            var compNextBtn = this.qStudioVar.compNextBtn,
                compBackBtn = this.qStudioVar.compBackBtn,
                scrollCache = this._scrollLayoutCache,
                setCache = this._setLayoutCache;

            if (!scrollCache.contain && !setCache.contain) { return; }
            var index = (scrollCache.contain) ? scrollCache.contain.scrollIndex() : setCache.contain.setIndex(),
                isAnswered = (scrollCache.contain) ? this.qStudioVar.respRef[index].row.isAnswered() : setCache.setRefArray[index].isAnswered;

            if (compBackBtn) {
                compBackBtn.enabled = (index !== 0);
                compBackBtn.style.cursor = (compBackBtn.enabled) ? "pointer" : "default";
                $(compBackBtn).css({ opacity : (compBackBtn.enabled) ? 1 : 0.35 });
                if (!QUtility.isTouchDevice()) {
                    if (compBackBtn.enabled) {
                        $(compBackBtn).off("mouseenter.btnmatrix mouseleave.btnmatrix");
                    } else {
                        $(compBackBtn).on("mouseenter.btnmatrix mouseleave.btnmatrix", function(event) {
                            event.preventDefault();
                            event.stopPropagation();
                            $(compBackBtn).css({ opacity : 0.35});
                        });
                    }
                }
            }

            if (compNextBtn) {
                compNextBtn.enabled = isAnswered;
                compNextBtn.style.cursor = (compNextBtn.enabled) ? "pointer" : "default";
                $(compNextBtn).css({ opacity : (compNextBtn.enabled) ? 1 : 0.35 });
                if (!QUtility.isTouchDevice()) {
                    if (compNextBtn.enabled) {
                        $(compNextBtn).off("mouseenter.btnmatrix mouseleave.btnmatrix");
                    } else {
                        $(compNextBtn).on("mouseenter.btnmatrix mouseleave.btnmatrix", function(event) {
                            event.preventDefault();
                            event.stopPropagation();
                            $(compNextBtn).css({ opacity : 0.35});
                        });
                    }
                }
            }
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

        // returns an array of accepted column widgets;
        // pass an optional string argument to see if its an accepted widget type
        getAcceptedColumnWidgets : function(value) {
            if (QUtility.isString(value) && jQuery.trim(value.toLowerCase()).length > 0) {
                var matchFound = false;
                for (var i = this.qStudioVar.colAcceptedWgts.length; i--;) {
                    if (value === this.qStudioVar.colAcceptedWgts[i]) {
                        matchFound = true;
                        break;
                    }
                }

                return matchFound;
            }

            return this.qStudioVar.colAcceptedWgts;
        },

        // returns an object list of row button parameters
        // list can be in 1 of 2 formats.
        // If nothing is passed or wgtName is false, the list will be compiled using parameter names and will include the associated value and its exclude property.
        // If an exclude property is set true, it will not be allowed to be set as a button level parameter
        // If wgtName is true, the list will be compiled using widget specific names and will include the associated value
        getRowBtnParams : function(wgtName) {
            return this.__getParamObj("rowbtn", wgtName);
        },

        getRowContainParams : function(wgtName) {
            return this.__getParamObj("rowcontain", wgtName);
        },

        // returns an object list of column button parameters
        // list can be in 1 of 2 formats.
        // If nothing is passed or wgtName is false, the list will be compiled using parameter names and will include the associated value and its exclude property.
        // If an exclude property is set true, it will not be allowed to be set as a button level parameter
        // If wgtName is true, the list will be compiled using widget specific names and will include the associated value
        getColumnBtnParams : function(wgtName) {
            return this.__getParamObj("colbtn", wgtName);
        },

        getColumnContainParams : function(wgtName) {
            return this.__getParamObj("colcontain", wgtName);
        },

        getToolTipParams : function(wgtName) {
            return this.__getParamObj("tooltip", wgtName);
        },

        getLightBoxParams : function(wgtName) {
            return this.__getParamObj("ctz", wgtName);
        },

        create: function(parent) {
            // reset isUpdating boolean everytime create is called
            this.qStudioVar.isUpdating = false;

            // used w/ component controller; reset everytime create method is called
            this.qStudioVar.respRef = [];
            this.qStudioVar.compNextBtn = undefined;
            this.qStudioVar.compBackBtn = undefined;

            // used for scrolling layouts
            this._scrollLayoutCache = {
                columnWgtArray: [],
                timeout: undefined,
                isScrolling: false,
                contain: undefined
            };

            // used for set layouts
            this._setLayoutCache = {
                setRefArray: [],
                contain: undefined
            };

            // Auto-set compRTL parameter based on Survey Platform RTL settings
            if (QUtility.isSurveyRTL()) { this.qStudioVar.params.compRTL.value = true; }

            // record whether row contain layout type is 'vertical column label'
            this.qStudioVar.isLayoutVertColLabel = (this.qStudioVar.params.rowContainType.value.toLowerCase() === "vertical column label");

            // Disable RTL in QStudio Component Creation Window due to positioning issues
            this.qStudioVar.isCompRTL = (!(parent && parent.id === "componentDemoContainer")) ? this.qStudioVar.params.compRTL.value : false;

            // reset touchCoordArray array
            this.qStudioVar.touchCoordArray = [];

            var that = this,
                doc = document,
                params = this.qStudioVar.params,
                respRef = this.qStudioVar.respRef,
                touchCoordArray = this.qStudioVar.touchCoordArray,
                isTouchDevice = QUtility.isTouchDevice(),
                isMSTouch = QUtility.isMSTouch(),
                compContain = doc.createElement("div"),
                isRating = (params.compClickType.value.toLowerCase() === 'rating'),
                clen = this.qStudioVar.columnArray.length;

            // create events object
            this.qStudioVar.events = {
                down : (!isMSTouch) ?
                    "mousedown.btnmatrix touchstart.btnmatrix" :
                    ((window.PointerEvent) ? "pointerdown.btnmatrix" : "MSPointerDown.btnmatrix"),
                up : (!isMSTouch) ?
                    "mouseup.btnmatrix touchend.btnmatrix" :
                    ((window.PointerEvent) ? "pointerup.btnmatrix" : "MSPointerUp.btnmatrix"),
                move : (!isMSTouch) ?
                    "touchmove.btnmatrix" :
                    ((window.PointerEvent) ? "pointermove.btnmatrix" : "MSPointerMove.btnmatrix"),
                cancel : (!isMSTouch) ?
                    "touchcancel.btnmatrix" :
                    ((window.PointerEvent) ? "pointercancel.btnmatrix" : "MSPointerCancel.btnmatrix")
            };

            // for 'vertical column label' layout...
            if (this.qStudioVar.isLayoutVertColLabel) {
                params.rowContainType.value = "vertical layout";
                params.colContainType.value = "horizontal layout";
                params.rowContainOptHalign.value = (!this.qStudioVar.isCompRTL) ? "right" : "left";
            }

            // Init feature modules
            QStudioCompFactory.lightBoxFactory("basic", doc.body, this.getLightBoxParams(true));
            QStudioCompFactory.toolTipFactory("", doc.body, this.getToolTipParams(true));
            QStudioCompFactory.msgDisplayFactory("", {
                errormsg_width: params.colOtherMsgWidth.value,
                errormsg_fontsize: 16,
                errormsg_fontcolor: 0xFF0000,
                errormsg_halign: "left",
                isRTL: this.qStudioVar.isCompRTL
            });

            // Component Container CSS Style
            compContain.id = "BtnMatrixComponent";
            compContain.dir = (!this.qStudioVar.isCompRTL) ? 'ltr' :'rtl';
            compContain.className = "qbtnmatrix_component";
            compContain.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(255, 255, 255, 0);");
            compContain.style.cssText += ';'.concat("-webkit-tap-highlight-color: transparent;");
            compContain.style.position = params.compContainPos.value;
            compContain.style.width = "100%";
            compContain.style.height = "100%";
            parent = (parent && parent.nodeType === 1) ? parent : doc.body;
            parent.appendChild(compContain);
            this.qStudioVar.compContain = compContain;

            // Create appropriate matrix container
            (this.qStudioVar.params.rowContainType.value.toLowerCase().indexOf('scroll') === -1) ?
                this.__createDefaultMatrix():
                this.__createScrollMatrix();

            // We add a mousedown event listener to compContain, listening on the capture phase.
            // When our listener is invoked, we try to determine if the click was a result of a tap that we already
            // handled, and if so we call preventDefault and stopPropagation on it.
            if (isTouchDevice && !isMSTouch && compContain.addEventListener) {
                compContain.addEventListener("mousedown", function(event) {
                    if (event.eventPhase !== 1) { return false; }
                    for (var i = 0; i < touchCoordArray.length; i += 2) {
                        var x = touchCoordArray[i],
                            y = touchCoordArray[i + 1];

                        if (Math.abs(event.screenX - x) < 10 && Math.abs(event.screenY - y) < 10) {
                            event.stopPropagation();
                            event.preventDefault();
                        }
                    }
                }, true);
            }

            // Add Rating mouseenter/mouseleave events
            if (!isTouchDevice && isRating) {
                $(compContain).on("mouseenter.btnmatrix.rating mouseleave.btnmatrix.rating", '.qwidget_button', function(event) {
                    event.stopPropagation();
                    var isMouseOver = (event.type === "mouseenter"),
                        rowIndex = (!that._scrollLayoutCache.contain) ?
                            parseInt(event.currentTarget.getAttribute('rowIndex'), 10) : that._scrollLayoutCache.contain.scrollIndex(),
                        colIndex = parseInt(event.currentTarget.getAttribute('colIndex'), 10),
                        respArry = respRef[rowIndex].respArry,
                        colWgtArray = respRef[rowIndex].column,
                        curColWgt = colWgtArray[colIndex],
                        curColRating = (respArry[0] && respArry[0].isRating()) ? respArry[0] : null,
                        toggleMouse = (curColRating) ? "toggleMouseDown" : "toggleMouseEnter",
                        colWgt_i = null;

                    if (!curColWgt.enabled() || !curColWgt.isRating()) { return; }
                    for (var i = 0; i < clen; i += 1) {
                        colWgt_i = colWgtArray[i];
                        if (colWgt_i.isRating()) {
                            (isMouseOver) ?
                                colWgt_i.toggleMouseEnter(isMouseOver && (i <= colIndex)) :
                                colWgt_i[toggleMouse]((curColRating) ? (i <= curColRating.colIndex()) : false);
                        }
                    }
                });
            }
        },

        // updates existing widget(s) and layout type
        update: function() {
            if (!this.qStudioVar.rowContain) { return; }
            (this.qStudioVar.params.rowContainType.value.toLowerCase().indexOf('scroll') === -1) ?
                this.__updateDefaultMatrix():
                this.__updateScrollMatrix();
        },

        scrollHelper: function() {
            var scrollCache = this._scrollLayoutCache,
                rowIndex = scrollCache.contain.scrollIndex(),
                rowRespObj = this.qStudioVar.respRef[rowIndex],
                colArry = rowRespObj.column,
                enableAlpha = this.qStudioVar.params.rowContainChldEnableAlpha.value,
                enableDelay = this.qStudioVar.params.rowContainScrlAnimSpeed.value,
                clen = colArry.length;

            // Reset selected column widget(s) and temporarily disable
            if (scrollCache.isScrolling) { clearTimeout(scrollCache.timeout);}
            for (var i=0; i<clen; i+=1) {
                var colWgt = colArry[i];
                colWgt.isAnswered(false);
                if (colWgt.isOther()) { colWgt.textarea(colWgt.config().other_init_txt); }
                colWgt.enabled(false, { alphaVal: enableAlpha });
            }

            // Re-enable column widget(s)
            if (enableDelay < 100) { enableDelay = 100; }
            scrollCache.isScrolling = true;
            scrollCache.timeout = setTimeout(function() {
                for (var i=0; i<clen; i+=1) {
                    var colWgt = colArry[i];
                    colWgt.enabled(true);
                    // set row responses
                    if (jQuery.inArray(colWgt, rowRespObj.respArry) !== -1) {
                        if (!colWgt.isRating()) {
                            colWgt.isAnswered(true);
                            if (colWgt.isOther()) {
                                colWgt.textarea(rowRespObj.oeRespArry[colWgt.colIndex()]);
                            }
                        } else {
                            for (var k=0; k<clen; k+=1) {
                                var col_k = colArry[k];
                                col_k.isAnswered((col_k.isRating() && k <= colWgt.colIndex()));
                            }
                        }
                    }
                }
                scrollCache.isScrolling = false;
            }, enableDelay);

            this.toggleQStudioNavBtns();
        },

        setHelper: function(row, setIndex) {
            // If method is passed a setIndex, we know its being called from setDimenResp
            var fromSetDimenResp = (setIndex >= 0),
                respRef = this.qStudioVar.respRef,
                setCache = this._setLayoutCache,
                setIndex = (!fromSetDimenResp) ? setCache.contain.setIndex() : setIndex,
                setRefObj = setCache.setRefArray[setIndex],
                rowIndex = row.rowIndex(),
                isRowAnswered = row.isAnswered(),
                goOpaque = this.qStudioVar.params.rowContainGoOpaque.value,
                autoNext = this.isAutoNextEnabled();

            // Check if all row's in set have been answered
            (isRowAnswered) ?
                ++setRefObj.rowAnsCnt:
                --setRefObj.rowAnsCnt;
            setRefObj.isAnswered =
                (setRefObj.rowAnsCnt === setRefObj.rowCnt);

            // Enable next row and column(s)
            if (isRowAnswered) {
                // Enable next row and columns
                // Method is being called by setDimenResp, hence need to mimic user selection
                if (typeof fromSetDimenResp === 'boolean' && fromSetDimenResp) {
                    if (respRef[rowIndex]) {
                        if (respRef[rowIndex].row) {
                            respRef[rowIndex].row.enabled(false, {
                                alphaVal: 100,
                                goOpaque: goOpaque,
                                enableExtEvt: true
                            });
                        }

                        if (respRef[rowIndex].column.length !== 0) {
                            for (var i=0, clen=respRef[rowIndex].column.length; i<clen; i+=1) {
                                respRef[rowIndex].column[i].enabled(true, { goOpaque: goOpaque });
                            }
                        }
                    }
                }

                rowIndex += 1;
                if (respRef[rowIndex]) {
                    if (respRef[rowIndex].row) {
                        respRef[rowIndex].row.enabled(false, {
                            alphaVal: 100,
                            goOpaque: goOpaque,
                            enableExtEvt: true
                        });
                    }

                    if (respRef[rowIndex].column.length !== 0) {
                        for (var i=0, clen=respRef[rowIndex].column.length; i<clen; i+=1) {
                            respRef[rowIndex].column[i].enabled(true, { goOpaque: goOpaque });
                        }
                    }
                }

                if ((autoNext || fromSetDimenResp) && !setRefObj.hasVisited && setRefObj.isAnswered) {
                    setRefObj.hasVisited = true;
                    if ((setCache.contain.next() === false)) {
                        if (this._navNextCallBack) { this._navNextCallBack(); }
                        if (this.qStudioVar.dcProxy) {
                            this.qStudioVar.dcProxy.removeComponentBackButton(this.qStudioVar.compBackBtn);
                            this.qStudioVar.dcProxy.removeComponentNextButton(this.qStudioVar.compNextBtn);
                            this.qStudioVar.dcProxy.next();
                        }
                    }
                }
            }

            this.toggleQStudioNavBtns();
        },

        manageClick: function(col, rIndex) {
            // If method is passed a rIndex, we know its being called from setDimenResp
            rIndex = (typeof rIndex === 'number' && rIndex >= 0) ? rIndex : null;
            var fromSetDimenResp = (rIndex !== null),
                scrollCache = this._scrollLayoutCache,
                rowIndex = (!fromSetDimenResp) ?
                    ((!scrollCache.contain) ? col.rowIndex() : scrollCache.contain.scrollIndex()) : rIndex,
                colIndex = col.colIndex(),
                respArry = this.qStudioVar.respRef[rowIndex].respArry,
                colArry = this.qStudioVar.respRef[rowIndex].column,
                isRating = (this.qStudioVar.params.compClickType.value.toLowerCase() === 'rating'),
                capVal = this.qStudioVar.params.compCapValue.value,
                clen = colArry.length,
                capCond = false,
                spliceInd = -1,
                inputValid = (!col.isOther()) ? true : col.isInputValid();

            // If Default Click Type
            if (!isRating) {
                if (!col.isAnswered()) {
                    if (!inputValid) { return; }
                    // Unselect currently selected button(s)
                    if (col.isRadio()) {
                        while(respArry.length !== 0) {
                            respArry[0].isAnswered(false);
                            //this.sendResponse(rowIndex, respArry[0].colIndex(), false);
                            this.sendResponse(rowIndex, respArry[0].colIndex(), false);
                            this.qStudioVar.respRef[rowIndex].respArry.shift();
                        }
                    } else {
                        capCond = (capVal > 1) ? (respArry.length < capVal) : true;
                        if (!capCond) { return; }
                        var colRadio = respArry[0];
                        if (colRadio && colRadio.isRadio() && (fromSetDimenResp || colRadio.isAnswered())) {
                            colRadio.isAnswered(false);
                            this.sendResponse(rowIndex, colRadio.colIndex(), false);
                            this.qStudioVar.respRef[rowIndex].respArry = [];
                        }
                    }

                    col.isAnswered(true);
                    this.sendResponse(rowIndex, colIndex, true);
                    this.qStudioVar.respRef[rowIndex].respArry.push(col);
                    return true;
                } else {
                    if (!col.isRadio()) {
                        spliceInd = jQuery.inArray(col, respArry);
                        if (spliceInd !== -1) {
                            col.isAnswered(false);
                            this.sendResponse(rowIndex, colIndex, false);
                            this.qStudioVar.respRef[rowIndex].respArry.splice(spliceInd, 1);
                            return (respArry.length > 0);
                        }
                    }
                }
            }

            // If Rating Click Type
            else {
                if (col.isRating()) {
                    if (jQuery.inArray(col, respArry) === -1) {
                        if (respArry[0]) {
                            respArry[0].isAnswered(false);
                            this.sendResponse(rowIndex, respArry[0].colIndex(), false);
                            this.qStudioVar.respRef[rowIndex].respArry = [];
                        }

                        for (var i=0; i<clen; i+=1) {
                            var col_i = colArry[i];
                            col_i.isAnswered(col_i.isRating() && i <= colIndex);
                        }

                        this.sendResponse(rowIndex, colIndex, true);
                        this.qStudioVar.respRef[rowIndex].respArry.push(col);
                        return true;
                    } else {
                        spliceInd = jQuery.inArray(col, respArry);
                        if (spliceInd !== -1) {
                            for (var i=0; i<clen; i+=1) {
                                var col_i = colArry[i];
                                if (col_i.isRating() && i <= colIndex) { col_i.isAnswered(false); }
                            }

                            this.sendResponse(rowIndex, colIndex, false);
                            this.qStudioVar.respRef[rowIndex].respArry = [];
                            return false;
                        }
                    }
                }

                else {
                    if (!inputValid) { return; }
                    if (respArry[0] !== col) {
                        var colResp = respArry[0];
                        if (colResp) {
                            if (colResp.isRating()) {
                                for (var i=0; i<clen; i+=1) {
                                    var col_i = colArry[i];
                                    if (col_i.isRating() && (fromSetDimenResp || col_i.isAnswered())) {
                                        col_i.isAnswered(false);
                                    }
                                }
                            } else {
                                colResp.isAnswered(false);
                            }


                            this.sendResponse(rowIndex, colResp.colIndex(), false);
                            this.qStudioVar.respRef[rowIndex].respArry = [];
                        }

                        col.isAnswered(true);
                        this.sendResponse(rowIndex, colIndex, true);
                        this.qStudioVar.respRef[rowIndex].respArry.push(col);
                        return true;
                    }
                }
            }
        },

        manageChange: function(col, rIndex) {
            // If method is passed a rIndex, we know its being called from setDimenResp
            rIndex = (typeof rIndex === 'number' && rIndex >= 0) ? rIndex : null;
            var fromSetDimenResp = (rIndex !== null),
                scrollCache = this._scrollLayoutCache,
                rowIndex = (!fromSetDimenResp) ?
                    ((!scrollCache.contain) ? col.rowIndex() : scrollCache.contain.scrollIndex()) : rIndex,
                colIndex = col.colIndex(),
                respArry = this.qStudioVar.respRef[rowIndex].respArry,
                colArry = this.qStudioVar.respRef[rowIndex].column,
                oeRespArry = this.qStudioVar.respRef[rowIndex].oeRespArry,
                isRating = (this.qStudioVar.params.compClickType.value.toLowerCase() === 'rating'),
                clen = colArry.length,
                capVal = this.qStudioVar.params.compCapValue.value,
                capCond = false,
                spliceInd = -1,
                inputValid = col.isInputValid();

            // Record open-end response
            (inputValid) ?
                oeRespArry[colIndex] = col.textarea():
                oeRespArry[colIndex] = '';

            // If Default Click Type
            if (!isRating) {
                if (inputValid) {
                    if (!col.isAnswered()) {
                        // Unselect currently selected button(s)
                        if (col.isRadio()) {
                            while(respArry.length !== 0) {
                                respArry[0].isAnswered(false);
                                this.sendResponse(rowIndex, respArry[0].colIndex(), false);
                                this.qStudioVar.respRef[rowIndex].respArry.shift();
                            }
                        } else {
                            capCond = (capVal > 1) ? (respArry.length < capVal) : true;
                            if (!capCond) { return; }
                            var colRadio = respArry[0];
                            if (colRadio && colRadio.isRadio() && (fromSetDimenResp || colRadio.isAnswered())) {
                                colRadio.isAnswered(false);
                                this.sendResponse(rowIndex, colRadio.colIndex(), false);
                                this.qStudioVar.respRef[rowIndex].respArry = [];
                            }
                        }

                        col.isAnswered(true);
                        this.sendResponse(rowIndex, colIndex, true);
                        this.qStudioVar.respRef[rowIndex].respArry.push(col);
                        return true;
                    }
                } else {
                    if (col.isAnswered()) {
                        if (!col.isRadio()) {
                            spliceInd = jQuery.inArray(col, respArry);
                            if (spliceInd !== -1) {
                                col.isAnswered(false);
                                this.sendResponse(rowIndex, colIndex, false);
                                this.qStudioVar.respRef[rowIndex].respArry.splice(spliceInd, 1);
                                return (respArry.length > 0);
                            }
                        } else {
                            col.isAnswered(false);
                            this.sendResponse(rowIndex, colIndex, false);
                            this.qStudioVar.respRef[rowIndex].respArry = [];
                            return false;
                        }
                    }
                }
            }

            // If Rating Click Type
            else {
                if (inputValid) {
                    if (respArry[0] !== col) {
                        var colResp = respArry[0];
                        if (colResp) {
                            if (colResp.isRating()) {
                                for (var i=0; i<clen; i+=1) {
                                    var col_i = colArry[i];
                                    if (col_i.isRating() && (fromSetDimenResp || col_i.isAnswered())) {
                                        col_i.isAnswered(false);
                                    }
                                }
                            } else {
                                colResp.isAnswered(false);
                            }

                            this.sendResponse(rowIndex, colResp.colIndex(), false);
                            this.qStudioVar.respRef[rowIndex].respArry = [];
                        }

                        col.isAnswered(true);
                        this.sendResponse(rowIndex, colIndex, true);
                        this.qStudioVar.respRef[rowIndex].respArry.push(col);
                        return true;
                    }
                } else{
                    if (col.isAnswered()) {
                        col.isAnswered(false);
                        this.sendResponse(rowIndex, colIndex, false);
                        this.qStudioVar.respRef[rowIndex].respArry = [];
                        return false;
                    }
                }
            }
        },

        sendResponse: function(rowIndex, columnIndex, ansVal) {
            var respRef = this.qStudioVar.respRef,
                rowWgt = respRef[rowIndex].row,
                colWgt = respRef[rowIndex].column[columnIndex];

            console.log(rowIndex + ", " + columnIndex + " | " + ansVal);

            // Kantar custom 'dragging' event
            $.event.trigger({
                type : "KantarCompEvent",
                eventType : (ansVal) ? "kantar_answered" : "kantar_unanswered",
                row :rowWgt.widget(),
                column : colWgt.widget(),
                action: "set_response"
            });

            if (this.qStudioVar.isDC && typeof this.qStudioVar.dcProxy !== 'undefined') {
                this.qStudioVar.dcProxy.sendResponse({
                    eventType : (ansVal) ? "questionAnswered" : "questionUnAnswered",
                    responseType : this.questionType(),
                    rowID : this.qStudioVar.rowArray[rowIndex].rowVO.id,
                    colID : this.qStudioVar.columnArray[columnIndex].columnVO.id,
                    answerValue : ansVal
                });
            }
        },

        // used by Dimensions to set responses
        setDimenResp: function(respArray) {
            if (jQuery.isArray(respArray) && respArray.length > 0) {
                var that = this,
                    respRef = this.qStudioVar.respRef,
                    params = this.qStudioVar.params,
                    scrollCache = this._scrollLayoutCache,
                    setCache = this._setLayoutCache,
                    gotoIndex = respArray[respArray.length-1].rowIndex;

                // utility
                var isRowIndexValid = function(rowIndex) {
                    return (rowIndex >= 0 && rowIndex < respRef.length);
                };

                // utility
                var isColIndexValid = function(rowIndex, colIndex) {
                    if (isRowIndexValid(rowIndex)) { return (colIndex >= 0 && colIndex < respRef[rowIndex].column.length); }
                    return false;
                };

                // utility
                var answerRow = function(row, column, input) {
                    if (column) {
                        var controllerBool = null;
                        if (!column.isOther()) {
                            controllerBool = that.manageClick(column, row.rowIndex());
                        } else {
                            column.textarea((typeof input === 'string') ? input : "test input...");
                            controllerBool = that.manageChange(column, row.rowIndex());
                            if (!controllerBool) {
                                column.textarea(column.config().other_init_txt);
                            }
                        }

                        if (typeof controllerBool === 'boolean' && controllerBool !== row.isAnswered()) {
                            row.isAnswered(controllerBool);
                            if (setCache.contain) {
                                var setIndex = parseInt(rowIndex / params.rowContainSetRowPer.value);
                                that.setHelper(row, setIndex);
                            }
                        }
                    }
                };

                while (respArray.length !== 0) {
                    var rowIndex = parseInt(respArray[0].rowIndex, 10),
                        colObj = respArray[0].colIndex;

                    if (isRowIndexValid(rowIndex)) {
                        var row = respRef[rowIndex].row;
                        if (jQuery.isArray(colObj) && colObj.length > 0) {
                            while (colObj.length !== 0) {
                                var colIndex = colObj[0].index;
                                if (isColIndexValid(rowIndex, colIndex)) {
                                    var column = respRef[rowIndex].column[colIndex];
                                    // Reset column answers for scrolling containers
                                    if (scrollCache.contain) {
                                        for (var i = 0, clen = respRef[0].column.length; i<clen; i+=1) {
                                            var colWgt = respRef[0].column[i];
                                            colWgt.isAnswered(false);
                                        }
                                    }

                                    answerRow(row, column, colObj[0].input);
                                }

                                colObj.shift();
                            }
                        }
                    }

                    respArray.shift();
                }

                // Set only the last response for scrolling layouts
                if (scrollCache.contain && gotoIndex >= 0) {
                    scrollCache.contain.scrollIndex(gotoIndex);
                    for (var i = 0, clen = respRef[gotoIndex].respArry.length; i<clen; i+=1) {
                        var colWgt = respRef[gotoIndex].respArry[i];
                        colWgt.isAnswered(true);
                    }
                }
            }
        },

        // used by Dimensions to get responses
        getDimenResp: function() {
            if (!this.qStudioVar.isDC) { return; }
            var valarray = [],
                json = { Response: { Value: valarray } };

            for (var i=0, rlen=this.qStudioVar.respRef.length; i<rlen; i+=1)
            {
                var respArry = this.qStudioVar.respRef[i].respArry,
                    oeRespArry = this.qStudioVar.respRef[i].oeRespArry,
                    row = this.qStudioVar.respRef[i].row,
                    row_id = row.widget().id;

                for (var j=0, jlen=respArry.length; j<jlen; j+=1)
                {
                    var col = respArry[j],
                        col_id = row_id + "^" + col.widget().id;

                    valarray.push(col_id);
                    if (col.isOther()) {
                        json.Response[col_id] = oeRespArry[col.colIndex()];
                    }
                }

            }

            return json;
        }
    };

    return BtnMatrix;

})();
