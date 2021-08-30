/**
 * DragnDrop Javascript File
 * Version : 1.3.1
 * Date : 2014-26-09
 *
 * DragnDrop Component.
 * BaseClassType : Multi
 * Requires rowArray and columnArray datasets.
 * Confluence Link : https://docs.gmi-mr.com/confluence/display/midev/DragnDrop+Component+Documentation
 *
 */

var DragnDrop = (function () {
    function DragnDrop() {
        this.qStudioVar = {
            isUpdating : false,
            isCompRTL : false,
            interact : true,
            isDC : false,
            params : this.initParams(),
            rowArray : [],
            columnArray : [],
            rowAcceptedWgts : [
                "base",
                "flow",
                "kantarbase",
                "text",
                "radiocheck"
            ]
        };
    }

    DragnDrop.prototype = {
        ///////////////////////////////////
        /** QStudio required code begin **/
        ///////////////////////////////////

        renderDC: function(parent, surveyContain) {
            //console.log("DC Rendering on parent");
            this.qStudioVar.interact = true;
            this.qStudioVar.isDC = true;
            this.create(parent, surveyContain);
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
                    "var1",             // Row object button type,
                    "var2"              // Row object isRadio prop
                ] },
                { name:"columnArray", prop:[
                    "label",            // Column object label
                    "image",            // Column object image url
                    "description",      // Column object description
                    "var1"              // Column object capping value
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
            return 'DragnDrop component description...';
        },

        baseClassType: function() {
            // Multi column base class type
            return 'multi';
        },

        questionType: function() {
            var qType = this.qStudioVar.params.compQuestionType.value.toLowerCase();
            if (qType.indexOf('multi') !== -1) { return 'multi'; }
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
                compQuestionType: { name:"Component: Question Type", value:'Single', description:"Component question type.", type:"combo", options:['Single', 'Multi', 'Restrict'], order:1 },
                compContainPos: { name:"Component: CSS Position", value:"relative", description:"Component container CSS position.", type:"combo", options:["absolute", "relative"], order: 4 },
                compRTL: { name:"Component: RTL Enable", value:false, description:"If set true, component will be setup to support right-to-left languages.", type:"bool", order:24 },
                compPrimRowFontFamily: { name:"Component: Row Font Family", value:"Arial, Helvetica, sans-serif", description:"Font used for row buttons and layout labels.", type:"string", order:19 },
                compPrimColumnFontFamily: { name:"Component: Column Font Family", value:"Arial, Helvetica, sans-serif", description:"Font used for column buckets and layout labels.", type:"string", order:19 },

                // Row Container Parameters
                rowContainType: { name:"Row Contain: Layout Type", value:"horizontal grid layout", description:"Layout template applied to row buttons.", type:"combo", options:["horizontal grid layout", "vertical grid layout", "horizontal layout", "vertical layout", "sequential layout"], order: 3 },
                rowContainWidth: { name:"Row Contain: Bckgrnd Width", value:800, description:"Row container background width, in pixels.", type:"number", min:50, wgtref: 'rowcontain', wgtname:"width", order: 5 },
                rowContainHeight: { name:"Row Contain: Bckgrnd Height", value:600, description:"Row container background height, in pixels.", type:"number", min:50, wgtref: 'rowcontain', wgtname:"height", order: 6 },
                rowContainPadding: { name:"Row Contain: Bckgrnd Padding", value:0, description:"Row container background padding, in pixels.", type:"number", min:0, wgtref: 'rowcontain', wgtname:"padding", order: 7 },
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
                rowContainLabel: { name:"Row Contain: Label Text", value:"Please drag and drop into the buckets below.", description:"Row container label text.", type:"string", wgtref: 'rowcontain', wgtname:"label", order:19 },
                rowContainLabelHalign: { name:"Row Contain: Label Horz Alignment", value:'left', description:"Row container label horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowcontain', wgtname:"label_halign", order:20 },
                rowContainLabelFontSize: { name:"Row Contain: Label Font Size", value:18, description:"Row container label font size, in pixels.", type:"number", min:5, wgtref: 'rowcontain', wgtname:"label_fontsize", order:21 },
                rowContainLabelPadding: { name:"Row Contain: Label Padding", value:4, description:"Row container label padding, in pixels.", type:"number", min:0, wgtref: 'rowcontain', wgtname:"label_padding", order:22 },
                rowContainLabelColor: { name:"Row Contain: Label Font Color", value:0x5B5F65, description:"Row container label font color.", type:"colour", wgtref: 'rowcontain', wgtname:"label_fontcolor", order:23 },

                // Row Button Background Parameters
                rowBtnDefaultType: { name:"Row Btn: Default Button Type", value:"Base", description:"Default button type used by component.", type:"combo", options:["Base", "Flow", "KantarBase", "Text", "RadioCheck"], order:29 },
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
                rowBtnBckgrndColorUp: { name:"Row Btn: Bckgrnd UP Color", value:0xffffff, description:"Button background color in its default state.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_up", order:39 },
                rowBtnBckgrndColorOver: { name:"Row Btn: Bckgrnd OVER Color", value:0xffffff, description:"Button background color on mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_over", order:40 },
                rowBtnBckgrndColorDown: { name:"Row Btn: Bckgrnd DOWN Color", value:0xffffff, description:"Button background color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_down", order:41 },
                rowBckgrndShowImp: { name:"Row Btn: Show Import Bckgrnd", value:false, description:"If set true, button will display an imported background image.", type:"bool", wgtref: 'rowbtn', wgtname:"show_bckgrnd_import", order:49 },
                rowBckgrndImpUp: { name:"Row Btn: Import UP Bckgrnd", value:"", description:"Import background image to use when button is in its default state.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"bckgrnd_import_up", order:43 },
                rowBckgrndImpOver: { name:"Row Btn: Import OVER Bckgrnd", value:"", description:"Import background image to use on button mouse over.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"bckgrnd_import_over", order:43 },
                rowBckgrndImpDown: { name:"Row Btn: Import DOWN Bckgrnd", value:"", description:"Import background image to use on button select.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"bckgrnd_import_down", order:45 },

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

                // Row Animation Parameters
                rowBtnMouseOverDownShadow: { name:"Row Animation: OVER/DOWN Show Shadow", value:false, description:"If set true, button background will display a shadow on mouse over and select states.", type:"bool", wgtref: 'rowbtn', wgtname:"mouseover_shadow", order:87 },
                rowBtnMouseOverScale: { name:"Row Animation: OVER Scale", value:100, description:"Button scale on mouse over.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"mouseover_scale", order:89 },
                rowBtnDragAlpha: { name:"Row Animation: Drag Transparency", value:100, description:"Button opacity during row drag.", type:"number", min:50, max:100, order:76 },

                // Column Container Parameters
                colContainType: { name:"Column Contain: Layout Type", value:"horizontal layout", description:"Layout template applied to column buckets.", type:"combo", options:["horizontal grid layout", "vertical grid layout", "horizontal layout", "vertical layout"], order: 3 },
                colContainWidth: { name:"Column Contain: Bckgrnd Width", value:700, description:"Column container background width, in pixels.", type:"number", min:50, wgtref: 'colcontain', wgtname:"width", order: 5 },
                colContainHeight: { name:"Column Contain: Bckgrnd Height", value:400, description:"Column container background height, in pixels.", type:"number", min:50, wgtref: 'colcontain', wgtname:"height", order: 6 },
                colContainPadding: { name:"Column Contain: Bckgrnd Padding", value:0, description:"Column container background padding, in pixels.", type:"number", min:0, wgtref: 'colcontain', wgtname:"padding", order: 7 },
                colContainHgap: { name:"Column Contain: Horz Btn Spacing", value:10, description:"The horizontal spacing of column buckets, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"hgap", order: 8 },
                colContainVgap: { name:"Column Contain: Vert Btn Spacing", value:10, description:"The vertical spacing of column buckets, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"vgap", order: 9 },
                colContainHoffset: { name:"Column Contain: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"left", order: 10 },
                colContainVoffset: { name:"Column Contain: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"top", order: 11 },
                colContainOptHalign: { name:"Column Contain: Option Horz Alignment", value:'left', description:"Column option horizontal alignment.", type:"combo", options:['left', 'center', 'right'], wgtref: 'colcontain', wgtname:"option_halign", order:20 },
                colContainOptValign: { name:"Column Contain: Option Vert Alignment", value:'top', description:"Column option vertical alignment.", type:"combo", options:['top', 'middle', 'bottom'], wgtref: 'colcontain', wgtname:"option_valign", order:20 },
                colContainBckgrndDispType: { name:"Column Contain: Bckgrnd Display Type", value:"none", description:"Column container background display type.", type:"combo", options:["vector", "import", "none"], order: 3 },
                colContainBorderStyle: { name:"Column Contain: Border Style", value:"none", description:"Column container CSS border style.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'colcontain', wgtname:"border_style", order: 12 },
                colContainBorderWidth: { name:"Column Contain: Border Width", value:0, description:"Column container border width, in pixels.", type:"number", min:0, wgtref: 'colcontain', wgtname:"border_width", order: 13 },
                colContainBorderColor: { name:"Column Contain: Border Color", value:0xd2d3d5, description:"Column container border color.", type:"colour", wgtref: 'colcontain', wgtname:"border_color", order: 14 },
                colContainBckgrndColor: { name:"Column Contain: Bckgrnd Color", value:0xFFFFFF, description:"Column container background color.", type:"colour", wgtref: 'colcontain', wgtname:"bckgrnd_color", order: 15 },
                colContainImgImport: { name:"Column Contain: Import Bckgrnd", value:"", description:"Column container imported background image.", type:"bitmapdata", wgtref: 'colcontain', wgtname:"bckgrnd_import", order:26 },
                colContainImgImportHoffset: { name:"Column Contain: Import Bckgrnd Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"bckgrnd_import_left", order:27 },
                colContainImgImportVoffset: { name:"Column Contain: Import Bckgrnd Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"bckgrnd_import_top", order:28 },
                colContainShowLabel: { name:"Column Contain: Show Label", value:false, description:"If set true, column container label will display.", type:"bool", wgtref: 'colcontain', wgtname:"show_label", order:24 },
                colContainLabel: { name:"Column Contain: Label Text", value:"Column Container Label", description:"Column container label text.", type:"string", wgtref: 'colcontain', wgtname:"label", order:19 },
                colContainLabelHalign: { name:"Column Contain: Label Horz Alignment", value:'left', description:"Column container label horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'colcontain', wgtname:"label_halign", order:20 },
                colContainLabelFontSize: { name:"Column Contain: Label Font Size", value:18, description:"Column container label font size, in pixels.", type:"number", min:5, wgtref: 'colcontain', wgtname:"label_fontsize", order:21 },
                colContainLabelPadding: { name:"Column Contain: Label Padding", value:4, description:"Column container label padding, in pixels.", type:"number", min:0, wgtref: 'colcontain', wgtname:"label_padding", order:22 },
                colContainLabelColor: { name:"Column Contain: Label Font Color", value:0x5B5F65, description:"Column container label font color.", type:"colour", wgtref: 'colcontain', wgtname:"label_fontcolor", order:23 },

                // Column Bucket Parameters
                colDzoneDropAnimation: { name:"Column Bucket: Row Drop Type", value:'anchor', description:"Bucket row drop animation type.", type:"combo", options:['anchor', 'fade', 'list', 'crop'], wgtref: 'coldzone', wgtname:"bucket_animation", wgtexclude:true, order:100 },
                colDzoneGrowAnimation: { name:"Column Bucket: Grow Type", value:'none', description:"Bucket grow animation type.", type:"combo", options:['none', 'grow individual', 'grow all'], wgtref: 'coldzone', wgtname:"grow_animation", wgtexclude:true, order:101 },
                colDzoneCropWidth: { name:"Column Bucket: Row Crop Width", value:50, description:"Row drop cropping width, in pixels.", type:"number", min:5, wgtref: 'coldzone', wgtname:"crop_width", order:102 },
                colDzoneCropHeight: { name:"Column Bucket: Row Crop Height", value:50, description:"Row drop cropping height, in pixels.", type:"number", min:5, wgtref: 'coldzone', wgtname:"crop_height", order:103 },
                colDzoneContainHgap: { name:"Column Bucket: Row Horz Spacing", value:5, description:"Horizontal spacing of row drops, in pixels.", type:"number", wgtref: 'coldzone', wgtname:"hgap", order:104 },
                colDzoneContainVgap: { name:"Column Bucket: Row Vert Spacing", value:5, description:"Vertical spacing of row drops, in pixels.", type:"number", wgtref: 'coldzone', wgtname:"vgap", order:105 },
                colDzoneContainPadding: { name:"Column Bucket: Drop Contain Padding", value:4, description:"Bucket drop container padding, in pixels.", type:"number", min:0, wgtref: 'coldzone', wgtname:"contain_padding", order:106 },
                colDzoneWidth: { name:"Column Bucket: Bckgrnd Width", value:200, description:"Bucket background width, in pixels.", type:"number", min:10, wgtref: 'coldzone', wgtname:"width", order:102 },
                colDzoneHeight: { name:"Column Bucket: Bckgrnd Height", value:150, description:"Bucket background height, in pixels.", type:"number", min:10, wgtref: 'coldzone', wgtname:"height", order:103 },
                colDzoneShowBckgrnd: { name:"Column Bucket: Show Bckgrnd", value:true, description:"If set false, bucket background will not display.", type:"bool", wgtref: 'coldzone', wgtname:"show_bckgrnd", order:114 },
                colDzoneBorderStyle: { name:"Column Bucket: Border Style", value:"solid", description:"Bucket background CSS border style.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'coldzone', wgtname:"border_style", order:107 },
                colDzoneBorderWidthUp: { name:"Column Bucket: Border UP Width", value:2, description:"Bucket background border width (in pixels) in its default state.", type:"number", wgtref: 'coldzone', wgtname:"border_width_up", order:108 },
                colDzoneBorderWidthOver: { name:"Column Bucket: Border OVER Width", value:3, description:"Bucket background border width (in pixels) on mouse over.", type:"number", wgtref: 'coldzone', wgtname:"border_width_over", order:108 },
                colDzoneBorderRadius: { name:"Column Bucket: Border Radius", value:0, description:"Bucket background border radius, in pixels.", type:"number", min:0, wgtref: 'coldzone', wgtname:"border_radius", order:109 },
                colDzoneBorderColorUp: { name:"Column Bucket: Border UP Colour", value:0xd2d3d5, description:"Bucket background border color in its default state.", type:"colour", wgtref: 'coldzone', wgtname:"border_color_up", order:110 },
                colDzoneBorderColorOver: { name:"Column Bucket: Border OVER Colour", value:0xa6a8ab, description:"Bucket background border color on mouse over.", type:"colour", wgtref: 'coldzone', wgtname:"border_color_over", order:111 },
                colDzoneBckgrndColorUp: { name:"Column Bucket: Bckgrnd UP Colour", value:0xFFFFFF, description:"Bucket background color in its default state.", type:"colour", wgtref: 'coldzone', wgtname:"bckgrnd_color_up", order:112 },
                colDzoneBckgrndColorOver: { name:"Column Bucket: Bckgrnd OVER Colour", value:0xFFFFFF, description:"Bucket background color on mouse over.", type:"colour", wgtref: 'coldzone', wgtname:"bckgrnd_color_over", order:113 },
                colDzoneShowBckgrndImp: { name:"Column Bucket: Show Import Bckgrnd", value:false, description:"If set true, bucket will display an imported background image.", type:"bool", wgtref: 'coldzone', wgtname:"show_bckgrnd_import", order:117 },
                colDzoneBckgrndImpUp: { name:"Column Bucket: Import UP Bckgrnd", value:"", description:"Import background image to use when bucket is in its default state.", type:"string", wgtref: 'coldzone', wgtname:"bckgrnd_import_up", order:115 },
                colDzoneBckgrndImpOver: { name:"Column Bucket: Import OVER Bckgrnd", value:"", description:"Import background image to use on bucket mouse over.", type:"string", wgtref: 'coldzone', wgtname:"bckgrnd_import_over", order:116 },
                colDzoneShowLabel: { name:"Column Label: Display", value:true, description:"If set false, bucket label will not display.", type:"bool", wgtref: 'coldzone', wgtname:"show_label", order:126 },
                colDzoneLabPlacement: { name:"Column Label: Placement", value:'top', description:"Bucket label placement.", type:"combo", options:['top', 'bottom', 'bottom overlay', 'top overlay'], wgtref: 'coldzone', wgtname:"label_placement", order:118 },
                colDzoneLabHalign: { name:"Column Label: Horz Alignment", value:'left', description:"Bucket label horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'coldzone', wgtname:"label_halign", order:119 },
                colDzoneLabHoffset: { name:"Column Label: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'coldzone', wgtname:"label_left", order:121 },
                colDzoneLabVoffset: { name:"Column Label: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'coldzone', wgtname:"label_top", order:122 },
                colDzoneLabFontSize: { name:"Column Label: Font Size", value:18, description:"Bucket label font size, in pixels.", type:"number", min:5, wgtref: 'coldzone', wgtname:"label_fontsize", order:120 },
                colDzoneLabColorUp: { name:"Column Label: UP Font Color", value:0x5B5F65, description:"Bucket label font color in the bucket’s default state.", type:"colour", wgtref: 'coldzone', wgtname:"label_fontcolor_up", order:123 },
                colDzoneLabColorOver: { name:"Column Label: OVER Font Color", value:0x5B5F65, description:"Bucket label font color on bucket mouse over.", type:"colour", wgtref: 'coldzone', wgtname:"label_fontcolor_over", order:124 },
                colDzoneLabOverlayShowBckgrnd: { name:"Column Label Overlay: Display Bckgrnd", value:true, description:"If set true, overlay label will display a background color.", type:"bool", wgtref: 'coldzone', wgtname:"show_label_bckgrnd", order:61 },
                colDzoneLabOverlayBckgrndColor: { name:"Column Label Overlay: Bckgrnd Color", value:0xEFEFEF, description:"Overlay label background color.", type:"colour", wgtref: 'coldzone', wgtname:"label_bckgrnd_color", order:125 },
                colDzoneLabOverlayPadding: { name:"Column Label Overlay: Padding", value:4, description:"Overlay label padding, in pixels.", type:"number", min:0, wgtref: 'coldzone', wgtname:"label_overlay_padding", order:32 },
                colDzoneLabOverlayValign: { name:"Column Label Overlay: Vert Alignment", value:'center', description:"Overlay label vertical text alignment.", type:"combo", options:['top', 'bottom', 'center'], wgtref: 'coldzone', wgtname:"label_overlay_valign", order:119 },
                colDzoneLabOverlaySyncHeight: { name:"Column Label Overlay: Sync Height", value:false, description:"If set true, the max height across all overlay labels will be used as the label height.", type:"bool", order:127 },
                colDzoneImgDispType: { name:"Column Image: Display Type", value:'none', description:"Select where the image is placed in relation to the drop container.", type:"combo", options:['center', 'left', 'right', "none"], wgtref: 'coldzone', wgtname:"img_placement", order:40 },
                colDzoneImgWidth: { name:"Column Image: Width", value:100, description:"Image width, in pixels. Not applicable if image placement is 'center'.", type:"number", min:10, wgtref: 'coldzone', wgtname:"img_width", order:129 },
                colDzoneImgPadding: { name:"Column Image: Padding", value:4, description:"Image padding, in pixels.", type:"number", min:0, wgtref: 'coldzone', wgtname:"img_padding", order:130 },
                colDzoneImgHoffset: { name:"Column Image: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'coldzone', wgtname:"img_left", order:131 },
                colDzoneImgVoffset: { name:"Column Image: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'coldzone', wgtname:"img_top", order:132 },

                // Column RadioCheck Parameters
                colRadChckEnable: { name:"Column Don't Know: Enable", value:false, description:"If set true, last columnArray object will be used to create a RadioCheck widget button.", type:"bool", order:60 },
                colRadChckImp: { name:"Column Don't Know: Import Bckgrnd", value:"", description:"Import image to use for button. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'dkbtn', wgtname:"radchkbtn_rad_url", order:75 },
                colRadChckWidth: { name:"Column Don't Know: Bckgrnd Width", value:30, description:"Width used for import image, in pixels.", type:"number", min:5, wgtref: 'dkbtn', wgtname:"radchkbtn_rad_width", order:76 },
                colRadChckHeight: { name:"Column Don't Know: Bckgrnd Height", value:30, description:"Height used for import image, in pixels.", type:"number", min:5, wgtref: 'dkbtn', wgtname:"radchkbtn_rad_height", order:77 },
                colRadChckHoffset: { name:"Column Don't Know: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'dkbtn', wgtname:"left", order:112 },
                colRadChckVoffset: { name:"Column Don't Know: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'dkbtn', wgtname:"top", order:113 },
                colRadChckLabelHalign: { name:"Column Don't Know: Label Horz Alignment", value:'left', description:"Button label horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'dkbtn', wgtname:"radchkbtn_label_halign", order:73 },
                colRadChckLabelWidth: { name:"Column Don't Know: Label Width", value:100, description:"Button label width, in pixels.", type:"number", min:5, wgtref: 'dkbtn', wgtname:"radchkbtn_label_width", order:72 },
                colRadChckLabelFontSize: { name:"Column Don't Know: Label Font Size", value:18, description:"Button label font size, in pixels.", type:"number", min:5, wgtref: 'dkbtn', wgtname:"radchkbtn_label_fontsize", order:74 },
                colRadChckLabelColorUp: { name:"Column Don't Know: Label UP Font Color", value:0x5B5F65, description:"Button label font color in the button’s default state.", type:"colour", wgtref: 'dkbtn', wgtname:"radchkbtn_label_fontcolor_up", order:56 },
                colRadChckLabelColorOver: { name:"Column Don't Know: Label OVER Font Color", value:0x5B5F65, description:"Button label font color on button mouse over.", type:"colour", wgtref: 'dkbtn', wgtname:"radchkbtn_label_fontcolor_over", order:57 },
                colRadChckLabelColorDown: { name:"Column Don't Know: Label DOWN Font Color", value:0x5B5F65, description:"Button label font color when button is selected.", type:"colour", wgtref: 'dkbtn', wgtname:"radchkbtn_label_fontcolor_down", order:58 },

                // Tooltip Parameters
                rowBtnUseTooltip: { name:"Tooltip: Enable for Row Btn", value:false, description:"If set true and row widget has a description, the tooltip feature will be enabled.", type:"bool", wgtref: 'rowbtn', wgtname:"use_tooltip", order:92 },
                colDzoneUseTooltip: { name:"Tooltip: Enable for Column Bucket", value:false, description:"If set true and column widget has a description, the tooltip feature will be enabled.", type:"bool", wgtref: 'coldzone', wgtname:"use_tooltip", order:112 },
                tooltipWidth: { name:"Tooltip: Bckgrnd Width", value:150, description:"Tooltip background width, in pixels.", type:"number", min:5, wgtref: 'tooltip', wgtname:"tooltip_width", order:93 },
                tooltipLabelHalign: { name:"Tooltip: Label Horz Alignment", value:'left', description:"Tooltip horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'tooltip', wgtname:"tooltip_halign", order:97 },
                tooltipFontSize: { name:"Tooltip: Label Size", value:18, description:"Tooltip font size, in pixels.", type:"number", min:5, wgtref: 'tooltip', wgtname:"tooltip_fontsize", order:98 },
                tooltipFontColor: { name:"Tooltip: Label Color", value:0x5B5F65, description:"Tooltip font color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_fontcolor", order:99 },
                tooltipBorderWidth: { name:"Tooltip: Border Width", value:2, description:"Tooltip border width, in pixels.", type:"number", min:0, wgtref: 'tooltip', wgtname:"tooltip_border_width", order:94, display:false },
                tooltipBorderColor: { name:"Tooltip: Border Color", value:0xd2d3d5, description:"Tooltip border color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_border_color", order:95, display:false },
                tooltipBckgrndColor: { name:"Tooltip: Bckgrnd Color", value:0xFFFFFF, description:"Tooltip background color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_bckgrnd_color", order:96, display:false },

                // LightBox Parameters
                rowBtnUseZoom: { name:"LightBox: Enable for Row Btn", value:false, description:"If set true and row widget has an image, the lightbox feature will be enabled.", type:"bool", wgtref: 'rowbtn', wgtname:"use_lightbox", order:100 },
                colDzoneUseZoom: { name:"LightBox: Enable for Column Bucket", value:false, description:"If set true and column widget has an image, the lightbox feature will be enabled.", type:"bool", wgtref: 'coldzone', wgtname:"use_lightbox", order:121 },
                zoomActionType: { name:"LightBox: Action Type", value:'click append image', description:"User action type to display image.", type:"combo", options:['click append image', 'click append widget', 'mouseover'], wgtref: 'ctz', wgtname:"action_type", order:52 },
                rowZoomHoffset: { name:"LightBox: Row Zoom Btn Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"zoom_left", order:112 },
                rowZoomVoffset: { name:"LightBox: Row Zoom Btn Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"zoom_top", order:113 },
                colZoomHoffset: { name:"LightBox: Column Zoom Btn Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'coldzone', wgtname:"zoom_left", order:112 },
                colZoomVoffset: { name:"LightBox: Column Zoom Btn Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'coldzone', wgtname:"zoom_top", order:113 },
                zoomImp: { name:"LightBox: Zoom Btn Import Image", value:"", description:"Zoom button imported image.", type:"bitmapdata", wgtref: 'ctz', wgtname:"zoom_import", order:109 },
                zoomWidth: { name:"LightBox: Zoom Btn Width", value:20, description:"Zoom button background width, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"zoom_width", order:110 },
                zoomHeight: { name:"LightBox: Zoom Btn Height", value:20, description:"Zoom button background height, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"zoom_height", order:111 },
                zoomBorderWidth: { name:"LightBox: Zoom Btn Border Width", value:1, description:"Zoom button border width, in pixels.", type:"number", min:0, wgtref: 'ctz', wgtname:"zoom_border_width", order:114, display:false },
                zoomBorderColor: { name:"LightBox: Zoom Btn Border Color", value:0xd2d3d5, description:"Zoom button border color.", type:"colour", wgtref: 'ctz', wgtname:"zoom_border_color", order:115, display:false },
                zoomBckgrndColor: { name:"LightBox: Zoom Btn Bckgrnd Color", value:0xFFFFFF, description:"Zoom button background color.", type:"colour", wgtref: 'ctz', wgtname:"zoom_bckgrnd_color", order:116, display:false },
                zoomCloseImp: { name:"LightBox: Close Btn Import Image", value:"", description:"Close button imported image.", type:"bitmapdata", wgtref: 'ctz', wgtname:"close_import", order:117 },
                zoomCloseWidth: { name:"LightBox: Close Btn Width", value:22, description:"Close button width, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"close_width", order:118 },
                zoomCloseHeight: { name:"LightBox: Close Btn Height", value:22, description:"Close button height, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"close_height", order:119 },
                zoomCloseHoffset: { name:"LightBox: Close Btn Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'ctz', wgtname:"close_left", order:120 },
                zoomCloseVoffset: { name:"LightBox: Close Btn Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'ctz', wgtname:"close_top", order:121 },
                zoomOverlayBckgrndColor: { name:"LightBox: Overlay Color", value:0x000000, description:"Overlay background color.", type:"colour", wgtref: 'ctz', wgtname:"overlay_bckgrnd_color", order:101, display:false },
                zoomOverlayAlpha: { name:"LightBox: Overlay Transparency", value:80, description:"Overlay background opacity.", type:"number", min:0, max:100, wgtref: 'ctz', wgtname:"overlay_alpha", order:102, display:false },
                zoomGalleryPadding: { name:"LightBox: Image Padding", value:10, description:"Image gallery padding, in pixels.", type:"number", min:0, wgtref: 'ctz', wgtname:"gallery_padding", order:103, display:false },
                zoomGalleryHoffset: { name:"LightBox: Image Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'ctz', wgtname:"gallery_left", order:104, display:false },
                zoomGalleryVoffset: { name:"LightBox: Image Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'ctz', wgtname:"gallery_top", order:105, display:false },
                zoomGalleryBorderStyle: { name:"LightBox: Image Border Style", value:"none", description:"Image gallery CSS border style.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'ctz', wgtname:"gallery_border_style", order: 106, display:false },
                zoomGalleryBorderWidth: { name:"LightBox: Image Border Width", value:0, description:"Image gallery border width, in pixels.", type:"number", min:0, wgtref: 'ctz', wgtname:"gallery_border_width", order: 107, display:false },
                zoomGalleryBorderColor: { name:"LightBox: Image Border Color", value:0xd2d3d5, description:"Image gallery border color.", type:"colour", wgtref: 'ctz', wgtname:"gallery_border_color", order: 108, display:false }
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
                configObj.primary_font_family = (value.toLowerCase().indexOf("row") !== -1) ?
                    this.qStudioVar.params.compPrimRowFontFamily.value : this.qStudioVar.params.compPrimColumnFontFamily.value;

                switch (value) {
                    case 'rowcontain' :
                        configObj.id = "QRowContainer";
                        configObj.show_bckgrnd = (this.qStudioVar.params.rowContainBckgrndDispType.value.toLowerCase() === "vector");
                        configObj.show_bckgrnd_import = (this.qStudioVar.params.rowContainBckgrndDispType.value.toLowerCase() === "import");
                        configObj.direction = (this.qStudioVar.params.rowContainType.value.toLowerCase().indexOf("vertical") !== -1) ? "vertical" : "horizontal";
                        configObj.position = "relative";
                        configObj.autoWidth = true;
                        configObj.autoHeight = true;
                        break;
                    case 'colcontain' :
                        configObj.id = "QColumnContainer";
                        configObj.show_bckgrnd = (this.qStudioVar.params.colContainBckgrndDispType.value.toLowerCase() === "vector");
                        configObj.show_bckgrnd_import = (this.qStudioVar.params.colContainBckgrndDispType.value.toLowerCase() === "import");
                        configObj.direction = (this.qStudioVar.params.colContainType.value.toLowerCase().indexOf("vertical") !== -1) ? "vertical" : "horizontal";
                        configObj.position = "relative";
                        configObj.autoWidth = true;
                        configObj.autoHeight = true;
                        break;
                    case 'rowbtn' :
                        configObj.txtbtn_trim = (this.qStudioVar.params.rowTxtBtnAdjustHeightType.value !== "none");
                        break;
                    case 'coldzone' :
                        // when updating we have to use the grow and drop animation parameters provided when first created
                        configObj.grow_animation = this.qStudioVar.respRef.growAnimation;
                        configObj.bucket_animation = this.qStudioVar.respRef.bucketAnimation;
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

        __setColumnBucketLevelParams: function(colObject, wgtNameObj) {
            var paramNameObj = this.getColumnBucketParams();
            for (var key in colObject) {
                if (colObject.hasOwnProperty(key)) {
                    if (paramNameObj.hasOwnProperty(key)) {
                        if (!paramNameObj[key].wgtexclude) {
                            this.__validateParam(paramNameObj, wgtNameObj, colObject, key);
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

        __growBuckets: function(growAll) {
            // Do not allow buckets to grow for vertical column container layouts
            var respRef = this.qStudioVar.respRef,
                params = this.qStudioVar.params,
                colArray = respRef.colArry,
                colContain = this.qStudioVar.colContain,
                sizeArray = [],
                maxSize = 0,
                isGridLayout = (params.colContainType.value.toLowerCase().indexOf("grid") !== -1),
                layoutContain = colContain.cache().nodes.layoutContain,
                defaultLayout = colContain.cache().nodes.defaultLayout;

            if (growAll) {
                // Find max bucket height
                for (var i=0; i<colArray.length; i+=1) {
                    sizeArray.push(colArray[i].column.getBucketContainHeight());
                }

                maxSize = Math.max.apply(Math, sizeArray);

                // Resize all buckets using maxSize
                for (var i=0; i<colArray.length; i+=1) {
                    colArray[i].column.resizeContainHeight(maxSize);
                }
            }

            if (isGridLayout) {
                var totalDefHeight = 0;
                // Find max child height within each subcontainer of defaultLayout
                for (var i=0; i<defaultLayout.children.length; i+=1) {
                    var defChild = defaultLayout.children[i];
                    for (var j=0; j<defChild.children.length; j+=1) {
                        sizeArray.push($(defChild.children[j].children[0]).outerHeight() + ((!growAll) ? ((params.colContainOptValign.value !== "bottom") ?
                            parseInt(defChild.children[j].style.top, 10):
                            parseInt(defChild.children[j].style.bottom, 10)) : 0));
                    }

                    maxSize = Math.max.apply(Math, sizeArray);
                    defChild.style.height = maxSize + "px";
                    totalDefHeight += $(defChild).outerHeight(true);
                    sizeArray = [];
                }
                layoutContain.style.height = totalDefHeight + "px";
                colContain.container().style.height = $(layoutContain).outerHeight(true) + "px";
            } else {
                // Find max child height within defaultLayout
                for (var i=0; i<defaultLayout.children.length; i+=1) {
                    var defChild = defaultLayout.children[i];
                    sizeArray.push($(defChild.children[0]).outerHeight() + ((!growAll) ? ((params.colContainOptValign.value !== "bottom") ?
                        parseInt(defChild.style.top, 10):
                        parseInt(defChild.style.bottom, 10)) : 0));
                }

                maxSize = Math.max.apply(Math, sizeArray);
                defaultLayout.style.height = maxSize + "px";
                layoutContain.style.height = $(defaultLayout).outerHeight(true) + "px";
                colContain.container().style.height = $(layoutContain).outerHeight(true) + "px";
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

        // returns an object list of column bucket parameters
        getColumnBucketParams : function(wgtName) {
            return this.__getParamObj("coldzone", wgtName);
        },

        // returns an object list of column container parameters
        getColumnContainParams : function(wgtName) {
            return this.__getParamObj("colcontain", wgtName);
        },

        // returns an object list of tooltip parameters
        getToolTipParams : function(wgtName) {
            return this.__getParamObj("tooltip", wgtName);
        },

        // returns an object list of lightbox parameters
        getLightBoxParams : function(wgtName) {
            return this.__getParamObj("ctz", wgtName);
        },

        bindGrowCallBack: function(value) {
            if (typeof value === "function") {
                this._growCallBack = value;
            } else {
                return this._growCallBack;
            }
        },

        create: function(parent, surveyContain) {
            // reset isUpdating boolean everytime create is called
            this.qStudioVar.isUpdating = false;

            // used w/ component controller; reset everytime create method is called
            this.qStudioVar.respRef = {
                radChkEnabled: this.qStudioVar.params.colRadChckEnable.value,
                isLayoutSeq: false,
                growAnimation: jQuery.trim(this.qStudioVar.params.colDzoneGrowAnimation.value).toLowerCase(),
                bucketAnimation: jQuery.trim(this.qStudioVar.params.colDzoneDropAnimation.value).toLowerCase(),
                rowArry: [],    // Stores a reference of each row in component
                colArry: []     // Stores a reference of each bucket in component
            };

            // Auto-set compRTL parameter based on Survey Platform RTL settings
            if (QUtility.isSurveyRTL()) {
                this.qStudioVar.params.compRTL.value = true;
            }

            // Disable RTL in QStudio Component Creation Window due to positioning issues
            this.qStudioVar.isCompRTL = (!(parent && parent.id === "componentDemoContainer")) ? this.qStudioVar.params.compRTL.value : false;

            var that = this,
                doc = document,
                respRef = this.qStudioVar.respRef,
                params = this.qStudioVar.params,
                dcProxy = this.qStudioVar.dcProxy,
                rowContainType = jQuery.trim(params.rowContainType.value).toLowerCase(),
                isTouchDevice = QUtility.isTouchDevice(),
                isMSTouch = QUtility.isMSTouch(),
                isMulti = (this.questionType() === 'multi'),
                i = 0, clen = (!respRef.radChkEnabled) ? this.qStudioVar.columnArray.length : this.qStudioVar.columnArray.length - 1,
                compContain = doc.createElement("div"),
                downEvent = (!isMSTouch) ?
                    ("mousedown.dragndrop touchstart.dragndrop") :
                    ((isTouchDevice) ? ((window.PointerEvent) ? "pointerdown.dragndrop" : "MSPointerDown.dragndrop") : "mousedown.dragndrop"),
                moveEvent = (!isMSTouch) ?
                    ("mousemove.dragndrop touchmove.dragndrop") :
                    ((isTouchDevice) ? ((window.PointerEvent) ? "pointermove.dragndrop" : "MSPointerMove.dragndrop") : "mousemove.dragndrop"),
                upEvent = (!isMSTouch) ?
                    ("mouseup.dragndrop touchend.dragndrop") :
                    ((isTouchDevice) ? ((window.PointerEvent) ? "pointerup.dragndrop" : "MSPointerUp.dragndrop") : "mouseup.dragndrop");

            // Init feature modules
            QStudioCompFactory.lightBoxFactory("basic", doc.body, this.getLightBoxParams(true));
            QStudioCompFactory.toolTipFactory("", doc.body, this.getToolTipParams(true));

            // If component is setup for "Restrict", hide QStudio Survey Next button
            if (params.compQuestionType.value.toLowerCase() === "restrict" && this.qStudioVar.isDC && dcProxy) {
                dcProxy.hideNextButton();
                this.qStudioVar.restrictMet = false;
            }

            // Do not allow buckets to grow for vertical column container layouts
            if (params.colContainType.value.toLowerCase().indexOf("vertical") !== -1 && respRef.growAnimation !== "none") {
                respRef.growAnimation = "none";
            }

            // No need to grow if drop animation is fade
            if (respRef.bucketAnimation === "fade") {
                respRef.growAnimation = "none";
            }

            // Do not allow sequential layout for Multi question type
            respRef.isLayoutSeq = (!isMulti && (rowContainType.indexOf("sequential") !== -1));
            if ((rowContainType.indexOf("sequential") !== -1) && !respRef.isLayoutSeq) {
                params.rowContainType.value = "horizontal grid layout";
                rowContainType = params.rowContainType.value;
            }

            // Component Container CSS Style
            compContain.id = "DragnDropComponent";
            compContain.dir = (!this.qStudioVar.isCompRTL) ? 'ltr' :'rtl';
            compContain.className = "qdragndrop_component";
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
                rowContainType.substr(0, rowContainType.toLowerCase().indexOf('layout') - 1),
                compContain,
                this.getRowContainParams(true)
            );

            // set it so rowContain sits above colContain
            this.qStudioVar.rowContain.container().style.zIndex = 3000;

            // Init column container
            this.qStudioVar.colContain = QStudioCompFactory.layoutFactory(
                params.colContainType.value.toLowerCase().substr(0, params.colContainType.value.toLowerCase().indexOf('layout')-1),
                compContain,
                this.getColumnContainParams(true)
            );

            // init matrix setup
            this.update(true);

            // drag events for row objects
            $(compContain).on(downEvent, '.qwidget_button', function(event) {
                event.stopPropagation();
                event.preventDefault();
                // for IE touch devices
                if (isMSTouch && isTouchDevice && !event.originalEvent.isPrimary) { return; }
                var touchEvent = (event.type.indexOf("touch") !== -1 && event.originalEvent.targetTouches) ?
                        event.originalEvent.targetTouches[0] : ((!isMSTouch) ? event : event.originalEvent),
                    rowNode = event.currentTarget,
                    surveyScale = QUtility.getQStudioSurveyScale(),
                    rowIndex = parseInt(rowNode.getAttribute('rowIndex'), 10),
                    colIndex = parseInt(rowNode.getAttribute('colIndex'), 10),
                    rowWgt = respRef.rowArry[(!isMulti) ? rowIndex : (rowIndex * clen) + colIndex].row,
                    rowWrap = respRef.rowArry[(!isMulti) ? rowIndex : (rowIndex * clen) + colIndex].wrap,
                    bucketOver = rowWgt.bucket();

                if (!rowWgt.enabled()) { return; }
                // indicate to qcore code we are dragging
                QStudioDCAbstract.prototype.isDrag(true);

                // set row element css
                $(rowNode).css({
                    'z-index' : 2000,
                    'opacity': (params.rowBtnDragAlpha.value >= 50 && params.rowBtnDragAlpha.value < 100) ? (params.rowBtnDragAlpha.value *.01) : ""
                });

                // If row is being dragged from within a bucket...
                if (rowNode.parentNode !== rowWrap) {
                    // Append back to original wrapper when dragging
                    var dropX = (touchEvent.pageX - $(rowNode).offset().left),
                        dropY = (touchEvent.pageY - $(rowNode).offset().top);

                    rowWrap.appendChild(rowNode);
                    rowNode.dragX = $(rowWrap).offset().left + dropX;
                    rowNode.dragY = $(rowWrap).offset().top + dropY;
                    rowNode.style.top = ((touchEvent.pageY - rowNode.dragY)*(1/surveyScale.d)) + "px";
                    rowNode.style.left = ((touchEvent.pageX - rowNode.dragX)*(1/surveyScale.a)) + "px";
                } else {
                    // Set rowNode dragX/dragY values to use w/ 'mouseMove'
                    rowNode.dragX = (touchEvent.pageX - parseInt(rowNode.getAttribute("lastX"), 10));
                    rowNode.dragY = (touchEvent.pageY - parseInt(rowNode.getAttribute("lastY"), 10));
                }
                rowNode.dragY += (($(surveyContain).scrollTop() !== null) ? $(surveyContain).scrollTop() : 0);

                // drag move event
                $(doc).on(moveEvent, function(event) {
                    event.preventDefault();
                    // check if we need to adjust event object for touches
                    event = (event.type.indexOf("touch") !== -1 && event.originalEvent.targetTouches) ?
                        event.originalEvent.targetTouches[0] : ((!isMSTouch) ? event : event.originalEvent);

                    if (event.pageX < 0) { event.pageX = 0; }
                    if (event.pageY < 0) { event.pageY = 0; }
                    var ex = (event.pageX - rowNode.dragX),
                        ey = (event.pageY - rowNode.dragY) + (($(surveyContain).scrollTop() !== null) ? $(surveyContain).scrollTop() : 0);

                    rowNode.style.top = (ey*(1/surveyScale.d)) + "px";
                    rowNode.style.left = (ex*(1/surveyScale.a)) + "px";

                    // Set lastX and lastY rowNode attributes
                    rowNode.setAttribute("lastX", ex.toString());
                    rowNode.setAttribute("lastY", ey.toString());

                    // Determine which bucket we are currently over
                    for (i = 0; i < clen; i+=1) {
                        var bucketWgt = respRef.colArry[i].column,
                            bucketNode = bucketWgt.widget();

                        // first set bucket corner positions
                        bucketNode.left = $(bucketNode).offset().left;
                        bucketNode.right = bucketNode.left + ($(bucketNode).outerWidth() * surveyScale.a);
                        bucketNode.top = $(bucketNode).offset().top;
                        bucketNode.bot = bucketNode.top + ($(bucketNode).outerHeight() * surveyScale.d);
                        if (event.pageX >= bucketNode.left &&
                            event.pageX <= bucketNode.right &&
                            event.pageY >= bucketNode.top &&
                            event.pageY <= bucketNode.bot) {
                            bucketOver = bucketWgt;
                            bucketWgt.toggleMouseEnter(true);
                            break;
                        } else {
                            bucketOver = null;
                            bucketWgt.toggleMouseEnter(false);
                        }
                    }

                    for (i = 0; i < clen; i+=1) {
                        var bucketWgt = respRef.colArry[i].column;
                        if (bucketOver !== bucketWgt) {
                            bucketWgt.toggleMouseEnter(false);
                        }
                    }
                });

                // drag up event
                $(doc).on(upEvent, function(event) {
                    $(doc).off(moveEvent);
                    $(doc).off(upEvent);

                    // indicate to qcore code we are no longer dragging
                    QStudioDCAbstract.prototype.isDrag(false);

                    // set row element css
                    $(rowNode).css({
                        'z-index' : "auto",
                        'opacity': ""
                    });

                    // Call controller method
                    if (respRef.radChkEnabled) { that.manageClick(true); }
                    that.manageDrop(rowWgt, bucketOver);

                    // If question type is "restrict", check if we need to show QStudio survey next button
                    if (params.compQuestionType.value.toLowerCase() === "restrict" && that.qStudioVar.isDC && dcProxy) {
                        var restrictMet = (that.getDimenResp().Response.Value.length === clen);
                        if (that.qStudioVar.restrictMet !== restrictMet) {
                            that.qStudioVar.restrictMet = restrictMet;
                            dcProxy[(that.qStudioVar.restrictMet) ? "showNextButton" : "hideNextButton"]();
                        }
                    }

                    if (bucketOver) {
                        bucketOver.toggleMouseEnter(false);
                        bucketOver = null;
                    }
                });
            });

            // radiocheck add click/tap event
            if (respRef.dkWgt) {
                var dkEle = respRef.dkWgt.widget(),
                    eventDown = (!isMSTouch) ?
                        "mousedown.dragndrop touchstart.dragndrop" :
                        ((window.PointerEvent) ? "pointerdown.dragndrop" : "MSPointerDown.dragndrop"),
                    eventUp = (!isMSTouch) ?
                        "mouseup.dragndrop touchend.dragndrop" :
                        ((window.PointerEvent) ? "pointerup.dragndrop" : "MSPointerUp.dragndrop"),
                    eventMove = (!isMSTouch) ?
                        "touchmove.dragndrop" :
                        ((window.PointerEvent) ? "pointermove.dragndrop" : "MSPointerMove.dragndrop"),
                    eventCancel = (!isMSTouch) ?
                        "touchcancel.dragndrop" :
                        ((window.PointerEvent) ? "pointercancel.dragndrop" : "MSPointerCancel.dragndrop"),
                    touchCoordArray = [];

                // helper function for row buttons to remove all events
                var cleanup = function() {
                    $(dkEle).off(eventUp);
                    $(dkEle).off(eventCancel);
                    $(doc).off(eventMove);
                    $(doc).off(eventUp);
                };

                $(dkEle).on(eventDown, function(event) {
                    event.stopPropagation();
                    if ((!respRef.dkWgt.enabled()) || that.qStudioVar.isUpdating) { return; }
                    if (event.type === "mousedown" || event.type === "touchstart" || event.type === "pointerdown" || event.type === "MSPointerDown") {
                        var startX = (event.originalEvent.touches) ? event.originalEvent.touches[0].clientX : null,
                            startY = (event.originalEvent.touches) ? event.originalEvent.touches[0].clientY : null;

                        if (startX !== null && startY !== null) {
                            // touchcancel event
                            $(dkEle).on(eventCancel, function(event) {
                                event.stopPropagation();
                                cleanup();
                            });

                            // touchmove event
                            $(doc).on(eventMove, function(event) {
                                event.stopPropagation();
                                cleanup();
                            });
                        } else {
                            $(doc).on(eventUp, function(event) {
                                event.preventDefault();
                                event.stopPropagation();
                                cleanup();
                            });
                        }


                        // touchend event
                        $(dkEle).on(eventUp, function(event) {
                            event.preventDefault();
                            event.stopPropagation();
                            cleanup();

                            // push touch start coordinates into touchCoordArray
                            if (startX !== null && startY !== null) {
                                touchCoordArray.push(startX, startY);
                                setTimeout(function () {
                                    touchCoordArray.splice(0, 2);
                                }, 700);
                            }

                            // click handler
                            that.manageClick();
                        });
                    }
                });

                // We add a mousedown event listener to compContain, listening on the capture phase.
                // When our listener is invoked, we try to determine if the click was a result of a tap that we already
                // handled, and if so we call preventDefault and stopPropagation on it.
                if (isTouchDevice && !isMSTouch && compContain.addEventListener) {
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
            }
        },

        update: function(init) {
            // if init is true, we are creating for the first time, else updating
            var compContain = this.qStudioVar.compContain,
                rowContain = this.qStudioVar.rowContain,
                colContain = this.qStudioVar.colContain,
                respRef = this.qStudioVar.respRef,
                rowArray = this.qStudioVar.rowArray,
                columnArray = this.qStudioVar.columnArray,
                params = this.qStudioVar.params,
                maxColBucketLabHeight = 0,
                syncColBucketArray = [],
                syncRowTxtBtnHeight = (params.rowTxtBtnAdjustHeightType.value === "all"),
                syncRowTxtBtnArray = [],
                maxRowTxtBtnHeight = 0,
                i = 0, rlen = rowArray.length,
                j = 0, clen = (!respRef.radChkEnabled) ? columnArray.length : columnArray.length - 1,
                isMulti = (this.questionType() === 'multi'),
                isRestrict = (params.compQuestionType.value.toLowerCase() === "restrict"),
                curChildArray = [],
                isMSTouch = QUtility.isMSTouch(),
                isTouchDevice = QUtility.isTouchDevice(),
                upEvent = (!isMSTouch) ? ((isTouchDevice) ? "touchend.dragndrop" : "mouseup.dragndrop") :
                    ((isTouchDevice) ? ((window.PointerEvent) ? "pointerup.dragndrop" : "MSPointerUp.dragndrop") : "mouseup.dragndrop");

            if (!init) {
                this.qStudioVar.isUpdating = true;
                qToolTipSingleton.getInstance().hide();

                // trigger upEvent to prevent dragging while updating
                $(document).trigger(upEvent);

                // store reference of current childArray for sequential layouts before updating
                if (respRef.isLayoutSeq) { curChildArray = rowContain.query().slice(); }

                // remove all widgets from rowContain & update
                rowContain.remove();
                rowContain.config(this.getRowContainParams(true));

                // remove all widgets from rowContain & update
                colContain.remove();
                colContain.config(this.getColumnContainParams(true));
            }

            // create/update row widgets
            for (i = 0; i < rlen; i += 1) {
                var rowObject = rowArray[i],
                    userDefType = jQuery.trim(rowObject.var1 || rowObject.type).toLowerCase(),
                    wgtNameObj = this.getRowBtnParams(true),
                    rowBtnType = params.rowBtnDefaultType.value.toLowerCase(),
                    rowWgt = undefined;

                // check if user defined type is a valid row widget
                if (this.getAcceptedRowWidgets(userDefType) === true) {
                    rowBtnType = userDefType;
                }

                // set widget params
                wgtNameObj.isRadio = QUtility.getBtnIsRadio(rowObject);
                wgtNameObj.rowIndex = i;
                wgtNameObj.colIndex = 0;
                wgtNameObj.id = rowObject.id + "_0" || 'row_' + i + "_0";
                wgtNameObj.label = rowObject.label;
                wgtNameObj.description = rowObject.description;
                wgtNameObj.image = rowObject.image;

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

                    // Create 'rowIndex' & 'colIndex' attributes for row widget for use w/ controller
                    rowWgt.widget().setAttribute('rowIndex', i.toString());
                    rowWgt.widget().setAttribute('colIndex', "0");

                    // Store reference of Row Widget for use w/ controller
                    respRef.rowArry.push({
                        wrap: null,
                        row: rowWgt
                    });

                    // Init row widget for dragging
                    rowWgt.widget().style.position = "absolute";
                    rowWgt.widget().style.left = 0;
                    rowWgt.widget().style.top = 0;
                    rowWgt.widget().setAttribute("lastX", "0");
                    rowWgt.widget().setAttribute("lastY", "0");
                } else {
                    rowWgt = respRef.rowArry[(!isMulti) ? i : i * clen].row;
                    // update Row Button Widget
                    rowWgt.config(wgtNameObj);
                }

                if (syncRowTxtBtnHeight) {
                    if (rowBtnType === "text") {
                        syncRowTxtBtnArray[(!isMulti) ? i : i * clen] = rowWgt;
                        maxRowTxtBtnHeight = Math.max(maxRowTxtBtnHeight, $(rowWgt.cache().nodes.background).height());
                    }
                }

                // Create Row Button(s) and add to Wrapper
                if (isMulti) {
                    for (j = 1; j < clen; j += 1) {
                        wgtNameObj.colIndex = j;
                        wgtNameObj.id = rowObject.id + '_' + j || 'row_' + i + '_' + j;
                        if (init) {
                            if (!wgtNameObj.isRadio) {
                                // Create Row Button Widget
                                rowWgt = QStudioCompFactory.widgetFactory(
                                    rowBtnType,
                                    compContain,
                                    wgtNameObj
                                );

                                rowWgt.enabled(true);
                                rowWgt.touchEnabled(QUtility.isTouchDevice());

                                // Create 'rowIndex' & 'colIndex' attributes for row widget for use w/ controller
                                rowWgt.widget().setAttribute('rowIndex', i.toString());
                                rowWgt.widget().setAttribute('colIndex', j.toString());

                                // Init row widget for dragging
                                rowWgt.widget().style.display = "none";
                                rowWgt.widget().style.position = "absolute";
                                rowWgt.widget().style.left = 0;
                                rowWgt.widget().style.top = 0;
                                rowWgt.widget().setAttribute("lastX", "0");
                                rowWgt.widget().setAttribute("lastY", "0");
                            } else {
                                rowWgt = null;
                            }

                            // Store reference of Row Widget for use w/ controller
                            respRef.rowArry.push({
                                wrap: null,
                                row: rowWgt
                            });
                        } else {
                            rowWgt = respRef.rowArry[(i * clen) + j].row;
                            // update Row Button Widget
                            if (rowWgt) { rowWgt.config(wgtNameObj); }
                        }

                        if (syncRowTxtBtnHeight) {
                            if (rowBtnType === "text") {
                                syncRowTxtBtnArray[(i * clen) + j] = rowWgt;
                            }
                        }
                    }
                }
            }

            // add row widgets to row container
            for (i = 0; i < respRef.rowArry.length; i += 1) {
                if (!respRef.rowArry[i].row) { continue; }
                var rowWgt = respRef.rowArry[i].row,
                    rowIndex = rowWgt.rowIndex(),
                    colIndex = rowWgt.colIndex(),
                    rowWrap = null;

                if (syncRowTxtBtnArray[(!isMulti) ? rowIndex : (rowIndex * clen) + colIndex]) {
                    rowWgt.config({
                        height : maxRowTxtBtnHeight,
                        txtbtn_trim : false
                    });
                }

                // Add to row container
                if (colIndex === 0) {
                    rowWrap = rowContain.add(rowWgt, !!rowArray[rowIndex].ownRow);
                    // if we're updating substitute new rowWrap w/ existing one since rowWrap is referenced in controller
                    if (!init) {
                        var rowWrapParent = rowWrap.parentNode,
                            rowWrapCSS = rowWrap.style.cssText;

                        rowWrapParent.removeChild(rowWrap);
                        rowWrap = respRef.rowArry[i].wrap;
                        rowWrap.appendChild(rowWgt.widget());
                        rowWrap.style.cssText = rowWrapCSS;
                        rowWrapParent.appendChild(rowWrap)
                    }
                } else {
                    rowWrap = respRef.rowArry[(rowIndex * clen)].wrap;
                    rowWrap.appendChild(rowWgt.widget());
                }

                // Set rowWrap dimensions
                if (!respRef.isLayoutSeq) {
                    rowWrap.style.width = $(rowWgt.widget()).outerWidth() + "px";
                    rowWrap.style.height = $(rowWgt.widget()).outerHeight() + "px";
                }

                // Store reference of Row Widget and its Wrapper Node for use w/ Controller
                if (init) { respRef.rowArry[i].wrap = rowWrap; }
            }

            // set current sequential layout to match curChildArray order
            if (!init && respRef.isLayoutSeq) {
                rowContain.cache().childArray = curChildArray;
                for (i = 0; i < rowContain.cache().childArray.length; i += 1) {
                    rowContain.cache().childArray[i].widget().style.display = (i !== 0) ? "none" : "block";
                }

                curChildArray = null;
            }

            // Add Bucket(s) to Column Container
            for (j = 0; j < clen; j += 1) {
                var colObject = columnArray[j],
                    wgtNameObj = this.getColumnBucketParams(true),
                    colWgt = undefined;

                // set widget params
                wgtNameObj.colIndex = j;
                wgtNameObj.id = colObject.id || 'col_' + j;
                wgtNameObj.label = colObject.label;
                wgtNameObj.description = colObject.description;
                wgtNameObj.image = colObject.image;
                wgtNameObj.capvalue = (!isRestrict) ? colObject.var1 : 1;

                // set widget button level params
                this.__setColumnBucketLevelParams(colObject, wgtNameObj);

                if (init) {
                    colWgt = QStudioCompFactory.widgetFactory(
                        "basebucket",
                        compContain,
                        wgtNameObj
                    );

                    colWgt.enabled(true);
                    colWgt.touchEnabled(QUtility.isTouchDevice());

                    // Create 'colIndex' attribute for column widget for use w/ controller
                    colWgt.widget().setAttribute('colIndex', j.toString());

                    // Store reference of Column Widget for use w/ controller
                    respRef.colArry.push({
                        column: colWgt,
                        rowRefArry: []
                    });
                } else {
                    colWgt = respRef.colArry[j].column;
                    // update Column Button Widget
                    colWgt.config(wgtNameObj);
                }

                // Calculate Max Bucket Label Height
                if (params.colDzoneLabOverlaySyncHeight.value) {
                    // if label placement is overlay type
                    if (wgtNameObj.label_placement.toLowerCase().indexOf("overlay") !== -1) {
                        syncColBucketArray[j] = colWgt;
                        maxColBucketLabHeight = Math.max($(colWgt.cache().nodes.label).height(), maxColBucketLabHeight);
                    }
                } else {
                    // Add to column container
                    colContain.add(colWgt);
                }
            }

            // Sync Bucket label height to max label height
            if (params.colDzoneLabOverlaySyncHeight.value) {
                for (j = 0; j < clen; j += 1) {
                    var colWgt = respRef.colArry[j].column;
                    if (syncColBucketArray[j]) {
                        colWgt.config({
                            label : columnArray[j].label || "...",
                            label_height: maxColBucketLabHeight
                        });
                        if (columnArray[j].label === "") { $(colWgt.cache().nodes.label).html(""); }
                    }

                    colContain.add(colWgt);
                }
            }

            // Init radiocheck widget
            if (respRef.radChkEnabled) {
                var dkConfig = this.__getParamObj("dkbtn", true);
                dkConfig.id = columnArray[clen].id || 'col_' + clen;
                dkConfig.colIndex = clen;
                dkConfig.isRTL = this.qStudioVar.isCompRTL;
                dkConfig.label = columnArray[clen].label;
                dkConfig.isRadio = true;
                dkConfig.radchkbtn_label_trim = true;

                if (init) {
                    // init radiocheck widget
                    var dkRadChk = new QRadioCheckBtn(compContain, dkConfig);
                    dkRadChk.enabled(true);
                    dkRadChk.touchEnabled(QUtility.isTouchDevice());
                    dkRadChk.widget().className = "";
                    dkRadChk.widget().style[(!this.qStudioVar.isCompRTL) ? "left" : "right"] =
                        ($(colContain.container()).outerWidth() + colContain.config().left - colContain.config().padding - $(dkRadChk.widget()).outerWidth() + parseInt(dkConfig.left, 10)) + "px";
                    dkRadChk.widget().style.top = (colContain.config().top + colContain.config().padding + parseInt(dkConfig.top, 10)) + "px";
                    dkRadChk.widget().style.marginBottom = "5px";
                    dkRadChk.widget().style.position = "relative";
                    dkRadChk.widget().style.height = $(dkRadChk.widget()).outerHeight(true) + "px";

                    // add widget to compContain
                    compContain.insertBefore(dkRadChk.widget(), colContain.container());

                    // record reference to widget for use w/ controller
                    respRef.dkWgt = dkRadChk;
                } else {
                    if (respRef.dkWgt) {
                        respRef.dkWgt.config(dkConfig);
                        respRef.dkWgt.widget().style[(!this.qStudioVar.isCompRTL) ? "left" : "right"] =
                            ($(colContain.container()).outerWidth() + colContain.config().left - colContain.config().padding - $(respRef.dkWgt.widget()).outerWidth() + parseInt(dkConfig.left, 10)) + "px";
                        respRef.dkWgt.widget().style.top = (colContain.config().top + colContain.config().padding + parseInt(dkConfig.top, 10)) + "px";
                        respRef.dkWgt.widget().style.height = $(respRef.dkWgt.widget()).outerHeight(true) + "px";
                    }
                }
            }

            // check if we need to grow buckets
            if (!init) { this.__growBuckets(respRef.growAnimation === "grow all"); }

            // if row layout is sequential, horizontally center both rowContain and colContain to one another
            if (respRef.isLayoutSeq) {
                var rowContainOuterWidth = $(rowContain.container()).outerWidth(),
                    colContainOuterWidth = $(colContain.container()).outerWidth();

                rowContain.container().style[(!this.qStudioVar.isCompRTL) ? 'marginLeft' : 'marginRight'] =
                    colContain.container().style[(!this.qStudioVar.isCompRTL) ? 'marginLeft' : 'marginRight'];

                if (colContainOuterWidth >= rowContainOuterWidth) {
                    rowContain.container().style[(!this.qStudioVar.isCompRTL) ? 'left' : 'right'] =
                        (colContainOuterWidth - rowContainOuterWidth)*0.5 + "px";
                } else {
                    colContain.container().style[(!this.qStudioVar.isCompRTL) ? 'left' : 'right'] =
                        (rowContainOuterWidth - colContainOuterWidth)*0.5 + "px";
                }
            }

            this.qStudioVar.isUpdating = false;
        },

        manageClick : function(reset) {
            reset = !!(typeof reset === "boolean" && reset);
            var respRef = this.qStudioVar.respRef,
                dkWgt = respRef.dkWgt,
                rlen = respRef.rowArry.length;

            // if reset is true, it is being called from before manageDrop is called
            // we will check to see if radiocheck widget is answered; if so, we need to clear
            // row responses and reset radiocheck widget
            if (reset) {
                if (dkWgt.isAnswered()) {
                    for (var i = 0; i < rlen; i += 1) {
                        var rowWgt = this.qStudioVar.respRef.rowArry[i].row;
                        if (rowWgt && rowWgt.colIndex() === 0) {
                            this.sendResponse(rowWgt.rowIndex(), dkWgt.colIndex(), false);
                        }
                    }

                    dkWgt.isAnswered(false);
                }
                return;
            }

            // if we are answering radiocheck widget, set row responses to radiocheck widget column index
            if (!dkWgt.isAnswered()) {
                // un-answer all buckets
                for (var i = 0; i < rlen; i += 1) {
                    var rowWgt = this.qStudioVar.respRef.rowArry[i].row;
                    if (rowWgt) {
                        if (rowWgt.isAnswered()) { this.manageDrop(rowWgt, null); }
                        if (rowWgt.colIndex() === 0) {
                            this.sendResponse(rowWgt.rowIndex(), dkWgt.colIndex(), true);
                        }
                    }
                }

                dkWgt.isAnswered(true);
            }
        },

        manageDrop: function(rowWgt, bucketWgt) {
            var respRef = this.qStudioVar.respRef,
                rowContain = this.qStudioVar.rowContain,
                clen = (!respRef.radChkEnabled) ? this.qStudioVar.columnArray.length : this.qStudioVar.columnArray.length - 1,
                isMulti = (this.questionType() === 'multi'),
                rowNode = rowWgt.widget(),
                rowBucket = rowWgt.bucket(),
                rowIndex = rowWgt.rowIndex(),
                colIndex = rowWgt.colIndex(),
                rowWrap = null,
                respWrapRef = null;

            // utility
            var getWrap = function(rIndex, cIndex) {
                rIndex = parseInt(rIndex, 10);
                cIndex = parseInt(cIndex, 10);
                return respRef.rowArry[(!isMulti) ? rIndex : (rIndex * clen) + cIndex].wrap;
            };

            // Get rowNode wrapper reference
            rowWrap = getWrap(rowIndex, colIndex);

            // If row dropped in a valid bucket...
            if (bucketWgt && bucketWgt instanceof QStudioBucketAbstract) {
                var colIndex = bucketWgt.colIndex(),
                    rowRefArry = respRef.colArry[colIndex].rowRefArry,
                    bucketQuery = bucketWgt.query(),
                    bucketCapVal = bucketWgt.capvalue();

                if (jQuery.inArray(rowWrap, rowRefArry) === -1) {
                    if (bucketCapVal === -1 || (bucketCapVal === 1 || bucketQuery.length < bucketCapVal)) {
                        // If row was dropped in another bucket
                        if (rowBucket) {
                            respWrapRef = respRef.colArry[rowBucket.colIndex()].rowRefArry;
                            respWrapRef.splice(jQuery.inArray(rowWrap, respWrapRef), 1);
                            this.sendResponse(rowIndex, rowBucket.colIndex(), false);      // *SEND RESPONSE
                        }

                        // If row is exclusive, remove all currently dropped rows
                        if (rowWgt.isRadio()) {
                            for (var i=0, drlen=bucketQuery.length; i<drlen; i+=1) {
                                var bucketRow = bucketQuery[0],
                                    bucketNode = bucketRow.widget(),
                                    bucketWrap =
                                        getWrap(bucketRow.rowIndex(), bucketRow.colIndex());

                                this.sendResponse(bucketRow.rowIndex(), colIndex, false);    // *SEND RESPONSE
                                rowRefArry.splice(jQuery.inArray(bucketWrap, rowRefArry), 1);
                                bucketWgt.remove(bucketRow);
                                bucketRow.isAnswered(false);
                                bucketWrap.appendChild(bucketNode);
                                bucketNode.setAttribute("lastX", "0");
                                bucketNode.setAttribute("lastY", "0");
                                bucketNode.style.left = 0;
                                bucketNode.style.top = 0;
                                bucketNode.style.display =
                                    (isMulti && bucketNode !== bucketWrap.children[0]) ? "none" : "block";

                                // Sequential layouts only
                                if (respRef.isLayoutSeq) {
                                    rowContain.back(bucketRow, true);
                                }
                            }
                        } else {
                            var rowRadioWgt = bucketQuery[0],
                                rowRadioNode = null,
                                rowRadioWrap = null;

                            if (rowRadioWgt && rowRadioWgt.isRadio()) {
                                rowRadioNode = rowRadioWgt.widget();
                                rowRadioWrap =
                                    getWrap(rowRadioWgt.rowIndex(), rowRadioWgt.colIndex());
                                this.sendResponse(rowRadioWgt.rowIndex(), colIndex, false);    // *SEND RESPONSE
                                rowRefArry.splice(jQuery.inArray(rowRadioWrap, rowRefArry), 1);
                                bucketWgt.remove(rowRadioWgt);
                                rowRadioWgt.isAnswered(false);
                                rowRadioWrap.appendChild(rowRadioNode);
                                rowRadioNode.setAttribute("lastX", "0");
                                rowRadioNode.setAttribute("lastY", "0");
                                rowRadioNode.style.left = 0;
                                rowRadioNode.style.top = 0;
                                rowRadioNode.style.display =
                                    (isMulti && rowRadioNode !== rowRadioWrap.children[0]) ? "none" : "block";

                                // Sequential layouts only
                                if (respRef.isLayoutSeq) {
                                    rowContain.back(rowRadioWgt, true);
                                }
                            }
                        }

                        // If bucket capvalue is set to 1 and a row is currently occupying bucket...
                        if (bucketCapVal === 1 && bucketQuery.length > 0) {
                            var respWgt = bucketQuery[0],
                                respNode = respWgt.widget(),
                                respNodeWrap =
                                    getWrap(respWgt.rowIndex(), respWgt.colIndex());

                            rowRefArry.splice(jQuery.inArray(respNodeWrap, rowRefArry), 1);
                            this.sendResponse(respWgt.rowIndex(), colIndex, false);   // *SEND RESPONSE
                            bucketWgt.remove(respWgt);
                            respWgt.isAnswered(false);
                            respNodeWrap.appendChild(respNode);
                            respNode.setAttribute("lastX", "0");
                            respNode.setAttribute("lastY", "0");
                            respNode.style.left = 0;
                            respNode.style.top = 0;
                            respNode.style.display =
                                (isMulti && respNode !== respNodeWrap.children[0]) ? "none" : "block";

                            // Sequential layouts only
                            if (respRef.isLayoutSeq) {
                                rowContain.back(respWgt, true);
                            }
                        }

                        // Set row as ANSWERED
                        rowWgt.isAnswered(true);
                        rowRefArry.push(rowWrap);
                        this.sendResponse(rowIndex, colIndex, true);        // *SEND RESPONSE

                        // Add widget to bucket
                        bucketWgt.add(rowWgt);
                        // If question type is multi, show next row in rowWrap
                        if (isMulti && rowWrap.children[0]) {
                            rowWrap.children[0].style.display = "block";
                        }

                        // See if we need to update bucket sizes
                        if (respRef.growAnimation !== "none") {
                            this.__growBuckets(respRef.growAnimation === "grow all");
                            // Check if a callback was bound via bindGrowCallBack method
                            if (this.bindGrowCallBack()) { this.bindGrowCallBack()(); }
                        }

                        // Sequential layouts only
                        if (respRef.isLayoutSeq && !rowBucket) { rowContain.next(); }

                        return;
                    }
                }

                // If row is dropped in same bucket
                else if (rowBucket === bucketWgt) {
                    bucketWgt.add(rowWgt);
                    return;
                }
            }

            // Set row as UNANSWERED
            if (rowBucket) {
                rowWgt.isAnswered(false);
                rowBucket.remove(rowWgt);
                respWrapRef = respRef.colArry[rowBucket.colIndex()].rowRefArry;
                respWrapRef.splice(jQuery.inArray(rowWrap, respWrapRef), 1);
                this.sendResponse(rowIndex, rowBucket.colIndex(), false);      // *SEND RESPONSE
                if (rowNode.parentNode !== rowWrap) { rowWrap.appendChild(rowNode); }

                // See if we need to update bucket sizes
                if (respRef.growAnimation !== "none") {
                    this.__growBuckets(respRef.growAnimation === "grow all");
                    // Check if a callback was bound via bindGrowCallBack method
                    if (this.bindGrowCallBack()) { this.bindGrowCallBack()(); }
                }
            }

            // Return row to home location
            rowNode.setAttribute("lastX", "0");
            rowNode.setAttribute("lastY", "0");
            rowNode.style.left = 0;
            rowNode.style.top = 0;
            rowNode.style.display =
                (isMulti && rowNode !== rowWrap.children[0]) ? "none" : "block";

            // Sequential layouts only
            if (respRef.isLayoutSeq && rowBucket) { rowContain.back(rowWgt); }
        },

        sendResponse: function(rowIndex, columnIndex, ansVal) {
            console.log(rowIndex + ", " + columnIndex + " | " + ansVal);
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
        setDimenResp: function(respArry) {
            if (jQuery.isArray(respArry)) {
                var rowArray = this.qStudioVar.rowArray,
                    respRef = this.qStudioVar.respRef,
                    clen = (!respRef.radChkEnabled) ? this.qStudioVar.columnArray.length : this.qStudioVar.columnArray.length - 1;

                while(respArry.length !== 0) {
                    var rowIndex = parseInt(respArry[0].rowIndex, 10),
                        rowColIndex = parseInt(respArry[0].rowColIndex, 10),
                        colIndex = parseInt(respArry[0].colIndex, 10),
                        row = null,
                        col = null;

                    if (rowIndex >= 0 && rowIndex < rowArray.length) {
                        // get row widget
                        if (this.questionType() === 'multi') {
                            if (!QUtility.getBtnIsRadio(rowArray[rowIndex])) {
                                if (QUtility.isNumber(rowColIndex) && rowColIndex >= 0 && rowColIndex < this.qStudioVar.columnArray.length) {
                                    row = respRef.rowArry[(rowIndex * clen) + rowColIndex].row;
                                }
                            } else {
                                row = respRef.rowArry[(rowIndex * clen)].row;
                            }
                        } else {
                            row = respRef.rowArry[rowIndex].row;
                        }

                        // get column widget
                        if (row && (colIndex >= 0 && colIndex < this.qStudioVar.columnArray.length)) {
                            if (!(respRef.radChkEnabled && colIndex === clen)) {
                                col = respRef.colArry[colIndex].column;
                                if (colIndex !== 0) { row.widget().style.display = ""; }
                                if (respRef.radChkEnabled) { this.manageClick(true); }
                                this.manageDrop(row, col);
                            } else {
                                this.manageClick();
                            }
                        }
                    }

                    respArry.shift();
                }

                // for sequential layouts we need to adjust rowContain query array & rowWgt display
                if (respRef.isLayoutSeq) {
                    this.qStudioVar.rowContain.cache().childArray = [];
                    for (var i = 0; i < respRef.rowArry.length; i += 1) {
                        var rowWgt = respRef.rowArry[i].row;
                        if (rowWgt.isAnswered()) {
                            rowWgt.widget().style.display = "block";
                        } else {
                            this.qStudioVar.rowContain.cache().childArray.push(rowWgt);
                            rowWgt.widget().style.display = "none";
                        }
                    }

                    // set first childArray display to block
                    var firstEle = this.qStudioVar.rowContain.cache().childArray[0];
                    if (firstEle) {
                        firstEle = (firstEle.widget) ? firstEle.widget() : firstEle;
                        firstEle.style.display = "block";
                    }
                }
            }
        },

        // used by Dimensions to get responses
        getDimenResp: function() {
            if (!this.qStudioVar.isDC) { return; }
            var valarray = [],
                json = { Response: { Value: valarray } },
                dkWgt = this.qStudioVar.respRef.dkWgt,
                i = 0, clen = this.qStudioVar.respRef.colArry.length,
                j = 0, rlen = this.qStudioVar.respRef.rowArry.length;

            if (!(dkWgt && dkWgt.isAnswered())) {
                for (i = 0; i < clen; i += 1) {
                    var bucket = this.qStudioVar.respRef.colArry[i].column;
                    for (j = 0; j < bucket.query().length; j += 1) {
                        var row_id = bucket.query()[j].widget().id,
                            col_id = bucket.widget().id;

                        valarray.push(row_id + "^" + col_id);
                    }
                }
            } else {
                for (i = 0; i < rlen; i += 1) {
                    var rowWgt = this.qStudioVar.respRef.rowArry[i].row;
                    if (rowWgt && rowWgt.colIndex() === 0) {
                        valarray.push(rowWgt.widget().id + "^" + dkWgt.widget().id);
                    }
                }
            }

            return json;
        }
    };

    return DragnDrop;

})();