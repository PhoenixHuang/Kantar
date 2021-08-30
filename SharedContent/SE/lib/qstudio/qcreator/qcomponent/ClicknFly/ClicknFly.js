/**
 * ClicknFly Javascript File
 * Version : 1.3.1
 * Date : 2014-26-09
 *
 * ClicknFly Component.
 * BaseClassType : Single
 * Requires rowArray dataset.
 * Confluence Link : https://docs.gmi-mr.com/confluence/display/midev/ClicknFly+Component+Documentation
 *
 */

var ClicknFly = (function () {

    function ClicknFly() {
        this.qStudioVar = {
            isUpdating : false,
            isCompRTL : false,
            interact : true,
            isDC : false,
            params : this.initParams(),
            rowArray : [],
            rowAcceptedWgts : [
                "base",
                "flow",
                "kantarbase",
                "text",
                "radiocheck"
            ]
        };
    }

    ClicknFly.prototype = {
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
                    "var1"             // Row object button type
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
                            paramwgtname: this.qStudioVar.params[i].wgtname
                        };
                        if (this.qStudioVar.params[i].order) { o.paramorder = this.qStudioVar.params[i].order; }
                        if (this.qStudioVar.params[i].min) { o.parammin = this.qStudioVar.params[i].min; }
                        if (this.qStudioVar.params[i].max) { o.parammax = this.qStudioVar.params[i].max; }
                        if (this.qStudioVar.params[i].step) { o.paramstep = this.qStudioVar.params[i].step; }
                        if (this.qStudioVar.params[i].options) { o.paramoptions = this.qStudioVar.params[i].options; }
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
            return 'ClicknFly component description...';
        },

        baseClassType: function() {
            return 'single';
        },

        questionType: function() {
            return 'multi';
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
                compQuestionType: { name:"Component: Question Type", value:'Single Choice', description:"Component question type.", type:"combo", options:['Single Choice', 'Multiple Choice'], order: 1 },
                compContainPos: { name:"Component: CSS Position", value:"relative", description:"Component container CSS position.", type:"combo", options:["absolute", "relative"], order: 4 },
                compIsMandatory: { name:"Component: Is Mandatory", value:false, description:"If set true, mandatory conditions must be met to complete exercise.", type:"bool", order:24 },
                compIsAutoNext: { name:"Component: Is AutoNext", value:false, description:"If set true and component is mandatory, frame will auto advance after mandatory conditions are met.", type:"bool", order:24 },
                compRTL: { name:"Component: RTL Enable", value:false, description:"If set true, component will be setup to support right-to-left languages.", type:"bool", order:24 },
                compPrimFontFamily: { name:"Component: Primary Font Family", value:"Arial, Helvetica, sans-serif", description:"Font used for button and layout labels.", type:"string", order:19 },

                // Bucket Parameters
                bucketHoffset: { name:"Bucket: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", order:55 },
                bucketVoffset: { name:"Bucket: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", order:55 },
                bucketPrimBckgrndColor: { name:"Bucket: Primary Bckgrnd Color", value:0xFFFFFF, description:"Bucket primary color.", type:"colour", wgtref: 'bucket', wgtname:"bckgrnd_color", order: 15 },
                bucketSecBckgrndColor: { name:"Bucket: Secondary Bckgrnd Color", value:0xF2F2F2, description:"Bucket secondary color.", type:"colour", order: 15 },
                bucketBorderStyle: { name:"Bucket: Border Style", value:"solid", description:"Bucket CSS border style.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'bucket', wgtname:"border_style", order: 12 },
                bucketBorderWidth: { name:"Bucket: Border Width", value:2, description:"Bucket border width, in pixels.", type:"number", min:0, wgtref: 'bucket', wgtname:"border_width", order: 13 },
                bucketBorderColor: { name:"Bucket: Border Color", value:0xd2d3d5, description:"Bucket border color.", type:"colour", wgtref: 'bucket', wgtname:"border_color", order: 14 },
                bucketShowImage: { name:"Bucket Image: Display", value:false, description:"If set true, bucket image will display on the right.", type:"bool", order:60 },
                bucketImageImp: { name:"Bucket Image: Import URL", value:"", description:"Bucket image URL.", type:"bitmapdata", order:64 },
                bucketImageWidth: { name:"Bucket Image: Width", value:150, description:"Bucket image width, in pixels", type:"number", min:30, order:30 },
                bucketImageUseZoom: { name:"Bucket Image: Enable Lightbox", value:false, description:"If set true, bucket lightbox feature will be enabled.", type:"bool", order:60 },
                bucketShowSingleMarker: { name:"Bucket Single: Display Marker", value:true, description:"If set true, a single-Bucket will display drop markers.", type:"bool", order:60 },
                bucketMultiAutoWidth: { name:"Bucket Multi: Autosize Bckgrnd Width", value:false, description:"If set true, multi-Bucket width will match the row container width.", type:"bool", order:60 },
                bucketMultiWidth: { name:"Bucket Multi: Bckgrnd Width", value:550, description:"Multi-Bucket background width, in pixels.", type:"number", min:10, wgtref: 'bucket', wgtname:"width", order:30 },
                bucketMultiHeight: { name:"Bucket Multi: Bckgrnd Height", value:125, description:"Multi-Bucket background height, in pixels.", type:"number", min:10, wgtref: 'bucket', wgtname:"height", order:31 },
                bucketMultiHgap: { name:"Bucket Multi: Horz Btn Spacing", value:10, description:"The horizontal spacing of row buttons in a multi-Bucket (in pixels).", type:"number", order: 8 },
                bucketMultiVgap: { name:"Bucket Multi: Vert Btn Spacing", value:10, description:"The vertical spacing of row buttons in a multi-Bucket (in pixels).", type:"number", order: 9 },
                bucketMultiDropType: { name:"Bucket Multi: Row Drop Type", value:'anchor', description:"Select how row drops are animated in a multi-Bucket.", type:"combo", options:['anchor', 'list', 'crop'], order:100 },
                bucketMultiContainType: { name:"Bucket Multi: Contain Type", value:'Grow', description:"Select how a multi-Bucket handles row overflow.", type:"combo", options:['Scroll', 'Grow'], order: 1 },
                bucketMultiCropWidth: { name:"Bucket Multi: Crop Animation Width", value:50, description:"Row crop animation width, in pixels.", type:"number", min:5, order:102 },
                bucketMultiCropHeight: { name:"Bucket Multi: Crop Animation Height", value:50, description:"Row crop animation height, in pixels.", type:"number", min:5, order:103 },

                // RadioCheck Parameters
                dkRadChckEnable: { name:"Row Don't Know: Enable", value:false, description:"If set true, last rowArray object will be used to create a RadioCheck widget button.", type:"bool", order:60 },
                dkRadChckImp: { name:"Row Don't Know: Import Bckgrnd", value:"", description:"Import image to use for button. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'dkbtn', wgtname:"radchkbtn_rad_url", order:75 },
                dkRadChckWidth: { name:"Row Don't Know: Bckgrnd Width", value:30, description:"Width used for import image, in pixels.", type:"number", min:5, wgtref: 'dkbtn', wgtname:"radchkbtn_rad_width", order:76 },
                dkRadChckHeight: { name:"Row Don't Know: Bckgrnd Height", value:30, description:"Height used for import image, in pixels.", type:"number", min:5, wgtref: 'dkbtn', wgtname:"radchkbtn_rad_height", order:77 },
                dkRadChckLabelHalign: { name:"Row Don't Know: Label Horz Alignment", value:'left', description:"Button label horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'dkbtn', wgtname:"radchkbtn_label_halign", order:73 },
                dkRadChckLabelWidth: { name:"Row Don't Know: Label Width", value:100, description:"Button label width, in pixels.", type:"number", min:5, wgtref: 'dkbtn', wgtname:"radchkbtn_label_width", order:72 },
                dkRadChckLabelFontSize: { name:"Row Don't Know: Label Font Size", value:18, description:"Button label font size, in pixels.", type:"number", min:5, wgtref: 'dkbtn', wgtname:"radchkbtn_label_fontsize", order:74 },
                dkRadChckLabelColorUp: { name:"Row Don't Know: Label Font Color", value:0x5B5F65, description:"Button label font color.", type:"colour", wgtref: 'dkbtn', wgtname:"radchkbtn_label_fontcolor_up", order:56 },

                // Row Container Parameters
                rowContainNumRowPerCol: { name:"Row Contain: Number of Rows Per Column", value:3, description:"Number of rows per column.", type:"number", min: 1, order: 9 },
                rowContainHgap: { name:"Row Contain: Horz Btn Spacing", value:30, description:"The horizontal spacing of row buttons, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"hgap", order: 8 },
                rowContainVgap: { name:"Row Contain: Vert Btn Spacing", value:10, description:"The vertical spacing of row buttons, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"vgap", order: 9 },
                rowContainOptHalign: { name:"Row Contain: Option Horz Alignment", value:'center', description:"Row option horizontal alignment.", type:"combo", options:['left', 'center', 'right'], wgtref: 'rowcontain', wgtname:"option_halign", order:20 },

                // Row Button Background Parameters
                rowBtnDefaultType: { name:"Row Btn: Default Button Type", value:"Base", description:"Default button type used by component.", type:"combo", options:["Base", "Text", "RadioCheck", "Flow", "KantarBase"], order:29 },
                rowBtnWidth: { name:"Row Btn: Bckgrnd Width", value:100, description:"Button background width, in pixels", type:"number", min:10, wgtref: 'rowbtn', wgtname:"width", order:30 },
                rowBtnHeight: { name:"Row Btn: Bckgrnd Height", value:100, description:"Button background height, in pixels", type:"number", min:10, wgtref: 'rowbtn', wgtname:"height", order:31 },
                rowBtnPadding: { name:"Row Btn: Bckgrnd Padding", value:4, description:"Button background padding, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"padding", order:32 },
                rowBtnShowBckgrnd: { name:"Row Btn: Show Bckgrnd", value:true, description:"If set false, button background will not display.", type:"bool", wgtref: 'rowbtn', wgtname:"show_bckgrnd", order:42 },
                rowBtnBorderStyle: { name:"Row Btn: Border Style", value:"solid", description:"Button background CSS border style.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'rowbtn', wgtname:"border_style", order:33 },
                rowBtnBorderRadius: { name:"Row Btn: Border Radius", value:0, description:"Button background border radius, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_radius", order:35 },
                rowBtnBorderWidthUp: { name:"Row Btn: Border Width", value:2, description:"Button background border width, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_width_up", order:34 },
                rowBtnBorderColorUp: { name:"Row Btn: Border UP Color", value:0xd2d3d5, description:"Button background border color in its default state.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_up", order:36 },
                rowBtnBorderColorOver: { name:"Row Btn: Border OVER Color", value:0xa6a8ab, description:"Button background border color on mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_over", order:37 },
                rowBtnBorderColorDown: { name:"Row Btn: Border DOWN Color", value:0xffbd1a, description:"Button background border color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_down", order:38 },
                rowBtnBckgrndColorUp: { name:"Row Btn: Bckgrnd UP Color", value:0xffffff, description:"Button background color in its default state.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_up", order:39 },
                rowBtnBckgrndColorOver: { name:"Row Btn: Bckgrnd OVER Color", value:0xffffff, description:"Button background color on mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_over", order:40 },
                rowBtnBckgrndColorDown: { name:"Row Btn: Bckgrnd DOWN Color", value:0xffffff, description:"Button background color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_down", order:41 },
                rowBtnShowImp: { name:"Row Btn: Show Import Bckgrnd", value:false, description:"If set true, button will display an imported background image.", type:"bool", wgtref: 'rowbtn', wgtname:"show_bckgrnd_import", order:49 },
                rowBtnImpUp: { name:"Row Btn: Import UP Bckgrnd", value:"", description:"Import background image to use when button is in its default state.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"bckgrnd_import_up", order:43 },
                rowBtnImpOver: { name:"Row Btn: Import OVER Bckgrnd", value:"", description:"Import background image to use on button mouse over.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"bckgrnd_import_over", order:44 },
                rowBtnImpDown: { name:"Row Btn: Import DOWN Bckgrnd", value:"", description:"Import background image to use on button select.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"bckgrnd_import_down", order:45 },

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

                // Row Button Specific Parameters
                rowTxtBtnAdjustHeightType: { name:"Row Text: Auto Height Type", value:'none', description:"Select how the auto height feature for Text widget is applied. The option 'individual' will be the most space saving as each widget is cropped individually.", type:"combo", options:['none', 'individual'], order:73 },
                rowRadChckImp: { name:"Row RadChk: Import Bckgrnd", value:"", description:"Import image to use for button. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"radchkbtn_rad_url", order:75 },
                rowRadChckWidth: { name:"Row RadChk: Bckgrnd Width", value:30, description:"Width of import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"radchkbtn_rad_width", order:76 },
                rowRadChckHeight: { name:"Row RadChk: Bckgrnd Height", value:30, description:"Height of import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"radchkbtn_rad_height", order:77 },
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
                switch (value) {
                    case 'rowcontain' :
                        configObj.id = "QRowContainer";
                        configObj.position = "relative";
                        configObj.padding = (this.qStudioVar.params.compQuestionType.value.toLowerCase().indexOf("single") !== -1) ? 10 : 0;
                        configObj.autoWidth = true;
                        configObj.autoHeight = true;
                        configObj.hgap = (this.qStudioVar.params.rowContainHgap.value >= 0) ? this.qStudioVar.params.rowContainHgap.value : 0;
                        configObj.vgap = (this.qStudioVar.params.rowContainVgap.value >= 0) ? this.qStudioVar.params.rowContainVgap.value : 0;
                        configObj.left = 0;
                        configObj.show_bckgrnd = false;
                        configObj.border_style = "none";
                        configObj.border_width = 0;
                        break;
                    case 'rowbtn'  :
                        configObj.txtbtn_trim = (this.qStudioVar.params.rowTxtBtnAdjustHeightType.value !== "none");
                        configObj.border_width_over = configObj.border_width_up;
                        configObj.border_width_down = configObj.border_width_up;
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

        __setIsCompAnswered : function(value) {
            var respRef = this.qStudioVar.respRef;
            if (typeof value === "boolean" && value !== respRef.isCompAnswered) {
                console.log("__setIsCompAnswered: " + value);
                respRef.isCompAnswered = value;
                if (this.isMandatory()) {
                    this.qStudioVar.dcProxy[(value) ? "showNextButton" : "hideNextButton"]();
                    if (value && this.isAutoNext()) { this.qStudioVar.dcProxy.next(); }
                }
            }
        },

        __mandatoryMet : function() {
            var respRef = this.qStudioVar.respRef,
                dkWgt = respRef.dkWgt,
                grpInfo = respRef.grpInfo,
                numOfCols = respRef.numOfCols,
                respCnt = 0;

            for (var grpIndex in grpInfo) {
                if (grpInfo.hasOwnProperty(grpIndex)) {
                    if (grpInfo[grpIndex].responseArray.length > 0) { respCnt += 1; }
                }
            }

            if (dkWgt && dkWgt.isAnswered()) { return true; }
            return (respCnt === numOfCols);
        },

        bindGrowCallBack: function(value) {
            if (typeof value === "function") {
                this._growCallBack = value;
            } else {
                return this._growCallBack;
            }
        },

        isMandatory: function() {
            if (this.qStudioVar.isDC && this.qStudioVar.dcProxy) {
                return !!this.qStudioVar.params.compIsMandatory.value;
            }

            return false;
        },

        isAutoNext: function() {
            if (this.qStudioVar.isDC && this.qStudioVar.dcProxy && this.isMandatory()) {
                return !!this.qStudioVar.params.compIsAutoNext.value;
            }

            return false;
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
            this.qStudioVar.isUpdating = false;

            // Component Controller Init Vars
            this.qStudioVar.respRef = {
                radChkEnabled : this.qStudioVar.params.dkRadChckEnable.value,
                isCompAnswered : false,
                wgtArray : [],
                dkWgt : null,
                multiBucket : null,
                numOfCols : 0,
                grpInfo : {}
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
                isMSTouch = QUtility.isMSTouch(),
                compContain = doc.createElement("div"),
                eventDown = (!isMSTouch) ?
                    "mousedown.clicknfly touchstart.clicknfly" :
                    ((window.PointerEvent) ? "pointerdown.clicknfly" : "MSPointerDown.clicknfly"),
                eventUp = (!isMSTouch) ?
                    "mouseup.clicknfly touchend.clicknfly" :
                    ((window.PointerEvent) ? "pointerup.clicknfly" : "MSPointerUp.clicknfly"),
                eventMove = (!isMSTouch) ?
                    "touchmove.clicknfly" :
                    ((window.PointerEvent) ? "pointermove.clicknfly" : "MSPointerMove.clicknfly"),
                eventCancel = (!isMSTouch) ?
                    "touchcancel.clicknfly" :
                    ((window.PointerEvent) ? "pointercancel.clicknfly" : "MSPointerCancel.clicknfly"),
                touchCoordArray = [];

            // Init feature modules
            QStudioCompFactory.lightBoxFactory("basic", doc.body, this.getLightBoxParams(true));
            QStudioCompFactory.toolTipFactory("", doc.body, this.getToolTipParams(true));

            // QStudio hide survey next button
            if (this.isMandatory()) { dcProxy.hideNextButton(); }

            // Component Container CSS Style
            compContain.id = "ClicknFlyComponent";
            compContain.dir = (!this.qStudioVar.isCompRTL) ? 'ltr' :'rtl';
            compContain.className = "qclicknfly_component";
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
                "horizontal",
                compContain,
                this.getRowContainParams(true)
            );
            this.qStudioVar.rowContain.container().style.zIndex = 3000;

            // Init column container
            this.qStudioVar.colContain = doc.createElement("div");
            this.qStudioVar.colContain.className = "qclicknfly_column_container";
            this.qStudioVar.colContain.style.position = "relative";
            this.qStudioVar.colContain.style.height = "100%";
            this.qStudioVar.colContain.style.width = "100%";
            compContain.appendChild(this.qStudioVar.colContain);

            // Init bucket container
            this.qStudioVar.bucketContain = doc.createElement("div");
            this.qStudioVar.bucketContain.className = "qclicknfly_bucket_container";
            this.qStudioVar.bucketContain.style.position = "relative";
            this.qStudioVar.colContain.appendChild(this.qStudioVar.bucketContain);

            // Init marker container
            this.qStudioVar.markerContain = doc.createElement("div");
            this.qStudioVar.markerContain.className = "qclicknfly_bucket_marker_container";
            this.qStudioVar.markerContain.style.position = "absolute";

            // Init bucket image container
            this.qStudioVar.bucketImgContain = doc.createElement("div");
            this.qStudioVar.bucketImgContain.className = "qclicknfly_bucket_image_container";

            // Init bucket image element
            this.qStudioVar.bucketImgEle = doc.createElement("img");
            this.qStudioVar.bucketImgEle.className = "qclicknfly_bucket_image";
            this.qStudioVar.bucketImgContain.appendChild(this.qStudioVar.bucketImgEle);

            // init component setup
            this.update(true);

            // helper function for row buttons to remove all events
            var cleanup = function(rowEle) {
                $(rowEle).off(eventUp);
                $(rowEle).off(eventCancel);
                $(doc).off(eventMove);
                $(doc).off(eventUp);
            };

            // add click/tap event
            $(compContain).on(eventDown, '.qwidget_button', function(event) {
                event.stopPropagation();
                var rowEle = event.currentTarget,
                    rowIndex = parseInt(rowEle.getAttribute('rowIndex'), 10),
                    row = respRef.wgtArray[rowIndex].rowWgt,
                    controllerType = (params.compQuestionType.value.toLowerCase().indexOf("single") !== -1) ?
                        "controllerTapSingle" : "controllerTapMulti";

                if ((!row.enabled()) || that.qStudioVar.isUpdating) { return; }
                if (event.type === "mousedown" || event.type === "touchstart" || event.type === "pointerdown" || event.type === "MSPointerDown") {
                    var startX = (event.originalEvent.touches) ? event.originalEvent.touches[0].clientX : null,
                        startY = (event.originalEvent.touches) ? event.originalEvent.touches[0].clientY : null;

                    if (startX !== null && startY !== null) {
                        // touchcancel event
                        $(rowEle).on(eventCancel, function(event) {
                            event.stopPropagation();
                            cleanup(rowEle);
                        });

                        // touchmove event
                        $(doc).on(eventMove, function(event) {
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

                        // push touch start coordinates into touchCoordArray
                        if (startX !== null && startY !== null) {
                            touchCoordArray.push(startX, startY);
                            setTimeout(function () {
                                touchCoordArray.splice(0, 2);
                            }, 700);
                        }

                        // click handler
                        that[controllerType](rowIndex);
                    });
                }
            });

            // radiocheck add click/tap event
            if (respRef.dkWgt) {
                var dkEle = respRef.dkWgt.widget();
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
                                cleanup(dkEle);
                            });

                            // touchmove event
                            $(doc).on(eventMove, function(event) {
                                event.stopPropagation();
                                cleanup(dkEle);
                            });
                        } else {
                            $(doc).on(eventUp, function(event) {
                                event.preventDefault();
                                event.stopPropagation();
                                cleanup(dkEle);
                            });
                        }

                        // touchend event
                        $(dkEle).on(eventUp, function(event) {
                            event.preventDefault();
                            event.stopPropagation();
                            cleanup(dkEle);

                            // push touch start coordinates into touchCoordArray
                            if (startX !== null && startY !== null) {
                                touchCoordArray.push(startX, startY);
                                setTimeout(function () {
                                    touchCoordArray.splice(0, 2);
                                }, 700);
                            }

                            // click handler
                            that.controllerTapDontKnow();
                        });
                    }
                });
            }

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
        },

        update: function(init) {
            var that = this,
                doc = document,
                respRef = this.qStudioVar.respRef,
                params = this.qStudioVar.params,
                isTouchDevice = QUtility.isTouchDevice(),
                compContain = this.qStudioVar.compContain,
                rowContain = this.qStudioVar.rowContain,
                bucketImgContain = this.qStudioVar.bucketImgContain,
                markerContain = this.qStudioVar.markerContain,
                bucketContain = this.qStudioVar.bucketContain,
                colContain = this.qStudioVar.colContain,
                bucketPadding = 10,
                bucketBorderWidth = (params.bucketBorderStyle.value.toLowerCase() !== "none" && params.bucketBorderWidth.value >= 0) ? params.bucketBorderWidth.value : 0,
                colRowCnt = (params.rowContainNumRowPerCol.value >= 1) ? params.rowContainNumRowPerCol.value : 4,
                maxWgtHeight = 0,
                i = 0, rlen = (!respRef.radChkEnabled) ? this.qStudioVar.rowArray.length : this.qStudioVar.rowArray.length - 1,
                wgtCnt = 0,
                isCompQSingle = (params.compQuestionType.value.toLowerCase().indexOf("single") !== -1),
                subContainConfig = this.getRowContainParams(true);

            // do not allow colRowCnt to exceed rlen value
            if (colRowCnt >= rlen) { colRowCnt = rlen; }

            // prep grpInfo object
            respRef.grpInfo = {};
            respRef.numOfCols = 0;
            for (i = 0; i < rlen; i += 1) {
                if (i % colRowCnt === 0) {
                    respRef.grpInfo[respRef.numOfCols] = {
                        rowArray : [],
                        responseArray : [],
                        bucketEle : null
                    };
                    respRef.numOfCols += 1;
                }

                respRef.grpInfo[respRef.numOfCols - 1].rowArray.push(this.qStudioVar.rowArray[i]);
            }

            if (!init) {
                this.qStudioVar.isUpdating = true;
                qToolTipSingleton.getInstance().hide();

                // remove all widgets from rowContain & update
                rowContain.remove();
                rowContain.config(this.getRowContainParams(true));

                // remove current drop markers from markerContain
                while (markerContain.firstChild) {
                    markerContain.removeChild(markerContain.firstChild);
                }
            }
            this.qStudioVar.rowContain.container().style.border = bucketBorderWidth + "px solid transparent";

            // Setup vertical containers to hold row groups
            delete subContainConfig.left;
            delete subContainConfig.hgap;
            for (var key in respRef.grpInfo) {
                if (respRef.grpInfo.hasOwnProperty(key)) {
                    // Create vertical container
                    var subContain =  QStudioCompFactory.layoutFactory(
                            "vertical",
                            compContain,
                            subContainConfig
                        ),
                        grpRowArray = respRef.grpInfo[key].rowArray;

                    // Add row to vertical container
                    for (i = 0; i < grpRowArray.length; i += 1) {
                        var rowObject = grpRowArray[i],
                            userDefType = jQuery.trim(rowObject.var1 || rowObject.type).toLowerCase(),
                            wgtNameObj = this.getRowBtnParams(true),
                            rowBtnType = params.rowBtnDefaultType.value.toLowerCase(),
                            rowWgt = undefined;

                        // check if user defined type is a valid row widget
                        if (this.getAcceptedRowWidgets(userDefType) === true) { rowBtnType = userDefType; }

                        // set widget params
                        wgtNameObj.isRadio = true;
                        wgtNameObj.rowIndex = jQuery.inArray(grpRowArray[i], this.qStudioVar.rowArray);
                        wgtNameObj.id = rowObject.id || 'row_' + wgtNameObj.rowIndex;
                        wgtNameObj.label = rowObject.label;
                        wgtNameObj.description = rowObject.description;
                        wgtNameObj.image = rowObject.image;

                        // set widget button level params
                        this.__setRowBtnLevelParams(rowObject, wgtNameObj);

                        if (init) {
                            // Create Row Button Widget
                            rowWgt = QStudioCompFactory.widgetFactory(
                                rowBtnType,
                                compContain,
                                wgtNameObj
                            );

                            rowWgt.enabled(true);
                            rowWgt.touchEnabled(isTouchDevice);

                            // Store reference of Row Widget & Row Wrap for use w/ controller
                            respRef.wgtArray.push({
                                rowWgt : rowWgt,
                                rowWrap : subContain.add(rowWgt)
                            });
                        } else {
                            rowWgt = respRef.wgtArray[wgtCnt].rowWgt;

                            // update Row Button Widget
                            rowWgt.config(wgtNameObj);

                            // add to subContain & increment wgtCnt
                            respRef.wgtArray[wgtCnt].rowWrap = subContain.add(rowWgt);
                            wgtCnt += 1;

                            // if row widget is answered, push to appropriate responseArray
                            if (rowWgt.isAnswered()) { respRef.grpInfo[key].responseArray.push(rowWgt); }
                        }

                        // Create 'rowIndex' attribute for row widget for use w/ controller
                        rowWgt.widget().setAttribute("rowIndex", wgtNameObj.rowIndex.toString());

                        // Create 'grpIndex' attribute for row widget for use w/ controller
                        rowWgt.widget().setAttribute("grpIndex", key.toString());  // Store row group index

                        // Calculate max widget height
                        maxWgtHeight = Math.max(maxWgtHeight, $(rowWgt.widget()).outerHeight());
                    }

                    // Add vertical container to row container
                    rowContain.add(subContain.container());

                    // Create Drop Marker for Single Choice question type to append to bucketContain
                    if (isCompQSingle) {
                        // Drop Marker CSS Style
                        var dropMarker = doc.createElement("div");
                        dropMarker.className = "qclicknfly_bucket_dropmarker";
                        dropMarker.style.position = "absolute";
                        dropMarker.style.width = ($(subContain.container()).outerWidth()) + "px";
                        dropMarker.style.backgroundColor = (params.bucketShowSingleMarker.value) ? "#" + QUtility.paramToHex(params.bucketSecBckgrndColor.value) : "transparent";
                        dropMarker.style.mozBoxShadow =
                            dropMarker.style.webkitBoxShadow =
                                dropMarker.style.boxShadow = (params.bucketShowSingleMarker.value) ? "inset 0 0 8px #888" : "";
                        markerContain.appendChild(dropMarker);
                        respRef.grpInfo[key].bucketEle = dropMarker;
                    }
                }
            }

            // Init column container
            var bucketWidth = (isCompQSingle || params.bucketMultiAutoWidth.value) ?
                    $(this.qStudioVar.rowContain.container()).width() - bucketPadding*2 : params.bucketMultiWidth.value,
                bucketHeight = ((isCompQSingle) ? maxWgtHeight + bucketPadding*2 : params.bucketMultiHeight.value);

            // colContain css
            colContain.style.marginTop = params.bucketVoffset.value + "px";
            colContain.style[(!that.qStudioVar.isCompRTL) ? 'marginLeft' : 'marginRight'] = params.bucketHoffset.value + "px";

            // bucketContain css
            bucketContain.style.width = bucketWidth + "px";
            bucketContain.style.height = bucketHeight + "px";
            bucketContain.style.padding = bucketPadding + "px";
            bucketContain.style.borderStyle = params.bucketBorderStyle.value;
            bucketContain.style.borderWidth = bucketBorderWidth + "px";
            bucketContain.style.borderColor = "#" + QUtility.paramToHex(params.bucketBorderColor.value);
            bucketContain.style.backgroundColor = "#" + QUtility.paramToHex(params.bucketPrimBckgrndColor.value);

            // setup drop markers for single choice question type
            // setup a bucket widget for multiple choice question type
            if (isCompQSingle) {
                if (respRef.multiBucket && respRef.multiBucket.widget().parentNode && respRef.multiBucket.widget().parentNode.nodeType === 1){
                    respRef.multiBucket.widget().parentNode.removeChild(respRef.multiBucket.widget());
                }

                var runningWidthTotal = 0;
                // position drop markers
                for (var k = 0; k < markerContain.children.length; k += 1) {
                    var dropMarker = markerContain.children[k],
                        prevMarker = markerContain.children[k - 1];

                    runningWidthTotal += ((k > 0) ? ($(prevMarker).outerWidth() + rowContain.config().hgap) : 0);
                    dropMarker.style.height = (maxWgtHeight + bucketPadding*2) + "px";
                    dropMarker.style[(!that.qStudioVar.isCompRTL) ? "left" : "right"] = runningWidthTotal + "px";

                    if (!init && respRef.grpInfo[k].responseArray[0]) {
                        var rowWgt = respRef.grpInfo[k].responseArray[0],
                            rowEle = rowWgt.widget();

                        dropMarker.appendChild(rowEle);
                        rowEle.style[(!that.qStudioVar.isCompRTL) ? "left" : "right"] = (($(dropMarker).outerWidth() - $(rowEle).outerWidth())*0.5) + "px";
                        rowEle.style.top = (($(dropMarker).outerHeight() - $(rowEle).outerHeight())*0.5) + "px";
                    }
                }

                // append markerContain to bucketContain
                bucketContain.appendChild(markerContain);
            } else {
                if (markerContain.parentNode && markerContain.parentNode.nodeType === 1) {
                    markerContain.parentNode.removeChild(markerContain);
                }

                // Record reference to bucket widget
                var multiBucketConfig = {
                    width : bucketWidth,
                    height : bucketHeight,
                    contain_padding : 4,
                    bckgrnd_color_up : params.bucketSecBckgrndColor.value,
                    hgap : params.bucketMultiHgap.value,
                    vgap : params.bucketMultiVgap.value,
                    border_style : "none",
                    bucket_animation : params.bucketMultiDropType.value,
                    grow_animation : (params.bucketMultiContainType.value.toLowerCase() === "scroll") ? "none" : "grow individual",
                    crop_width : params.bucketMultiCropWidth.value,
                    crop_height : params.bucketMultiCropHeight.value
                };

                if (init) {
                    respRef.multiBucket = QStudioCompFactory.widgetFactory(
                        "basebucket",
                        bucketContain,
                        multiBucketConfig
                    );
                } else {
                    respRef.multiBucket.config(multiBucketConfig);

                    // append multiBucket widget to bucketContain
                    bucketContain.appendChild(respRef.multiBucket.widget());

                    if (params.bucketMultiContainType.value.toLowerCase() !== "scroll") {
                        respRef.multiBucket.widget().parentNode.style.height = $(respRef.multiBucket.widget()).outerHeight() + "px";
                        if (that.bindGrowCallBack()) { that.bindGrowCallBack()(); }
                    }
                }
            }

            // Init radiocheck widget
            if (respRef.radChkEnabled) {
                var dkConfig = this.__getParamObj("dkbtn", true);
                dkConfig.id = this.qStudioVar.rowArray[rlen].id || 'row_' + rlen;
                dkConfig.rowIndex = rlen;
                dkConfig.isRTL = this.qStudioVar.isCompRTL;
                dkConfig.label = this.qStudioVar.rowArray[rlen].label;
                dkConfig.isRadio = true;
                dkConfig.radchkbtn_label_trim = true;

                // init radiocheck widget
                if (init) {
                    respRef.dkWgt = new QRadioCheckBtn(colContain, dkConfig);
                    respRef.dkWgt.enabled(true);
                    respRef.dkWgt.touchEnabled(isTouchDevice);
                    respRef.dkWgt.widget().className = "";
                    respRef.dkWgt.widget().style.marginBottom = "2px";
                } else {
                    respRef.dkWgt.config(dkConfig);
                }

                // horizontally position radiocheck widget
                respRef.dkWgt.widget().style[(!that.qStudioVar.isCompRTL) ? "left" : "right"] = ($(bucketContain).outerWidth() - $(respRef.dkWgt.widget()).outerWidth()) + "px";

                // add widget to colContain
                colContain.insertBefore(respRef.dkWgt.widget(), bucketContain);

                // adjust bucketWidth var in case it happens to be smaller than radiocheck widget
                if (bucketWidth < $(respRef.dkWgt.widget()).outerWidth()) {
                    bucketWidth = $(respRef.dkWgt.widget()).outerWidth();
                }
            } else {
                if (respRef.dkWgt && respRef.dkWgt.widget().parentNode && respRef.dkWgt.widget().parentNode.nodeType === 1){
                    respRef.dkWgt.widget().parentNode.removeChild(respRef.dkWgt.widget());
                }
            }

            // see about adding a bucket image
            if (params.bucketShowImage.value && params.bucketImageImp.value.length > 0) {
                var bucketImgWidth = (params.bucketImageWidth.value >= 30) ? params.bucketImageWidth.value : 150;
                // update image container
                QStudioAssetFactory.prototype.assetUpdate.image.apply(this, [bucketImgContain, {
                    image: params.bucketImageImp.value,
                    width: bucketImgWidth,
                    height: bucketHeight,
                    // callback would fire on successful load
                    callback_success: function () {
                        // position bucketImgContain
                        bucketImgContain.style.top = (bucketHeight + bucketPadding*2 - $(bucketImgContain).outerHeight())*0.5 + "px";
                        bucketImgContain.style[(!that.qStudioVar.isCompRTL) ? "left" : "right"] = (bucketWidth + bucketPadding*2) + "px";

                        // Append bucketImgContain to bucketContain
                        bucketContain.appendChild(bucketImgContain);

                        // Resize bucketContain width
                        bucketContain.style.width = (bucketWidth + $(bucketImgContain).outerWidth() + bucketPadding) + "px";

                        // if radiocheck is present, re-position
                        if (respRef.dkWgt) {
                            respRef.dkWgt.widget().style[(!that.qStudioVar.isCompRTL) ? "left" : "right"] = ($(bucketContain).outerWidth() - $(respRef.dkWgt.widget()).outerWidth()) + "px";
                        }
                    },
                    // callback would fire when an error is encountered
                    callback_error: function() {
                        if (bucketImgContain.parentNode && bucketImgContain.parentNode.nodeType === 1) {
                            bucketImgContain.parentNode.removeChild(bucketImgContain);
                        }
                    }
                }]);
            } else {
                if (bucketImgContain.parentNode && bucketImgContain.parentNode.nodeType === 1) {
                    bucketImgContain.parentNode.removeChild(bucketImgContain);
                }
            }
        },

        controllerTapDontKnow : function(animTime) {
            var params = this.qStudioVar.params,
                respRef = this.qStudioVar.respRef,
                grpInfo = respRef.grpInfo,
                dkWgt = respRef.dkWgt,
                grpRespArray = null,
                isSingleChoice = (params.compQuestionType.value.toLowerCase().indexOf("single") !== -1);

            // Answer widget
            if (!dkWgt.isAnswered()) {
                for (var grpIndex in grpInfo) {
                    if (grpInfo.hasOwnProperty(grpIndex)) {
                        grpRespArray = grpInfo[grpIndex].responseArray;
                        for (var i=0; i<grpRespArray.length; i+=1) {
                            this[(isSingleChoice) ? "controllerTapSingle" : "controllerTapMulti"](grpRespArray[i].rowIndex(), animTime, true);
                            if (!isSingleChoice) { i-=1; }
                        }
                    }
                }

                dkWgt.isAnswered(true);
                this.sendResponse(dkWgt, true);
                this.__setIsCompAnswered(true);
            }
        },

        controllerTapSingle : function(rowIndex, animTime, fromDK) {
            animTime = (!isNaN(animTime) && animTime >= 0) ? animTime : 500;
            var that = this,
                surveyScale = QUtility.getQStudioSurveyScale(),
                respRef = this.qStudioVar.respRef,
                grpInfo = respRef.grpInfo,
                rowWgt = respRef.wgtArray[rowIndex].rowWgt,
                rowEle = rowWgt.widget(),
                grpIndex = parseInt(rowEle.getAttribute("grpIndex"), 10),
                responseArray = grpInfo[grpIndex].responseArray,
                curRowResp = responseArray[0],
                curRowRespParent = null,
                bucketEle = grpInfo[grpIndex].bucketEle,
                xLocOffset = ($(bucketEle).outerWidth() - $(rowEle).outerWidth())*0.5,
                yLocOffset = ($(bucketEle).outerHeight() - $(rowEle).outerHeight())*0.5,
                exit = false;

            if (!rowWgt.enabled()) { return; }
            rowWgt.enabled(false, {alphaVal:100});
            // Check to see if bucketEle currently has a row occupied.
            // If so, unanswer and send back to home location
            if (curRowResp) {
                curRowRespParent = respRef.wgtArray[curRowResp.rowIndex()].rowWrap;
                // If selected row is the one currently occupied
                if (curRowResp === rowWgt) {
                    grpInfo[grpIndex].responseArray = [];
                    exit = true;
                }

                // Unanswer current row
                curRowRespParent.appendChild(curRowResp.widget());
                curRowResp.widget().style[(!that.qStudioVar.isCompRTL) ? "left" : "right"] = "";
                curRowResp.widget().style.left =
                    Math.round(($(bucketEle).offset().left - $(curRowRespParent).offset().left)*(1/surveyScale.a) +
                        ($(bucketEle).outerWidth() - $(curRowResp.widget()).outerWidth())*0.5) + "px";
                curRowResp.widget().style.top =
                    Math.round(($(bucketEle).offset().top - $(curRowRespParent).offset().top)*(1/surveyScale.d) +
                        ($(bucketEle).outerHeight() - $(curRowResp.widget()).outerHeight())*0.5) + "px";
                curRowResp.isAnswered(false);
                this.sendResponse(curRowResp, false);  // SEND DC RESPONSE

                // Animate
                $(curRowResp.widget()).stop();
                $(curRowResp.widget()).animate({
                    left : "",
                    top : ""
                }, { duration: animTime, easing: "swing", complete: function(){
                    curRowResp.enabled(true);
                }});

                if (exit) {
                    if (!fromDK) { this.__setIsCompAnswered(false); }
                    return;
                }
            } else if (respRef.dkWgt && respRef.dkWgt.isAnswered()) {
                respRef.dkWgt.isAnswered(false);
                this.sendResponse(respRef.dkWgt, false);
            }

            // Set new bucket row response
            responseArray[0] = rowWgt;
            this.sendResponse(rowWgt, true); // SEND DC RESPONSE
            this.__setIsCompAnswered(this.__mandatoryMet());

            // Animate
            rowWgt.isAnswered(true);
            $(rowEle).stop();
            $(rowEle).animate({
                left : Math.round(($(bucketEle).offset().left - $(rowEle.parentNode).offset().left)*(1/surveyScale.a) + xLocOffset) + "px",
                top : Math.round(($(bucketEle).offset().top - $(rowEle.parentNode).offset().top)*(1/surveyScale.d) + yLocOffset) + "px"
            }, { duration: animTime, easing: "swing", complete: function(){
                bucketEle.appendChild(rowEle);
                rowEle.style[(!that.qStudioVar.isCompRTL) ? "left" : "right"] = xLocOffset + "px";
                rowEle.style.top = yLocOffset + "px";
                rowWgt.enabled(true);
            }});
        },

        controllerTapMulti : function(rowIndex, animTime, fromDK) {
            animTime = (!isNaN(animTime) && animTime >= 0) ? animTime : 500;
            var that = this,
                surveyScale = QUtility.getQStudioSurveyScale(),
                params = this.qStudioVar.params,
                respRef = this.qStudioVar.respRef,
                grpInfo = respRef.grpInfo,
                rowWgt = respRef.wgtArray[rowIndex].rowWgt,
                rowWrap = respRef.wgtArray[rowIndex].rowWrap,
                rowEle = rowWgt.widget(),
                bucketWgt = respRef.multiBucket,
                grpIndex = parseInt(rowEle.getAttribute("grpIndex"), 10),
                responseArray = grpInfo[grpIndex].responseArray,
                spliceIndex = jQuery.inArray(rowWgt, responseArray),
                yLocBase = ($(bucketWgt.widget()).offset().top - $(rowEle).offset().top)*(1/surveyScale.d),
                xLocOffset = ($(bucketWgt.widget()).offset().left - $(rowEle).offset().left)*(1/surveyScale.a),
                ieVersion = QUtility.ieVersion();

            var bucketGrow = function() {
                if (params.bucketMultiContainType.value.toLowerCase() !== "scroll") {
                    bucketWgt.widget().parentNode.style.height = $(bucketWgt.widget()).outerHeight() + "px";
                    if (that.bindGrowCallBack()) { that.bindGrowCallBack()(); }
                }
            };

            if (!rowWgt.enabled()) { return; }
            rowWgt.enabled(false, {alphaVal:100});

            // Set new bucket row response
            if (spliceIndex === -1) {
                if (respRef.dkWgt && respRef.dkWgt.isAnswered()) {
                    respRef.dkWgt.isAnswered(false);
                    this.sendResponse(respRef.dkWgt, false);
                }

                responseArray.push(rowWgt);
                this.sendResponse(rowWgt, true); // SEND DC RESPONSE

                // Animate
                rowWgt.isAnswered(true);

                // FOR IE8 OPACITY BUG
                if (ieVersion === 8) {
                    $(rowWgt.cache().nodes.wrap).animate({
                        opacity : 0
                    }, animTime, function() {
                        $(rowWgt.cache().nodes.wrap).animate({
                            opacity : 1
                        }, animTime);
                    });
                }

                $(rowEle).animate({
                    top : yLocBase + "px",
                    left : xLocOffset + "px",
                    opacity : 0
                }, { duration: animTime, easing: "swing", complete: function() {
                    rowEle.style.marginLeft = 15 + "px";
                    $(rowEle).animate({
                        marginLeft : "",
                        top : "",
                        opacity : 1
                    }, animTime);
                    bucketWgt.add(rowWgt);
                    bucketGrow();
                    rowWgt.enabled(true);
                }});
            } else {
                responseArray.splice(spliceIndex, 1);
                this.sendResponse(rowWgt, false); // SEND DC RESPONSE

                // Animate
                bucketWgt.remove(rowWgt);
                bucketGrow();
                rowWgt.isAnswered(false);
                rowWrap.appendChild(rowEle);

                $(rowEle).css({
                    opacity : 0,
                    marginLeft : 15 + "px",
                    display : "block"
                });


                $(rowEle).animate({
                    marginLeft : "",
                    opacity : 1
                }, animTime, function(){
                    rowWgt.enabled(true);
                });
            }

            if (!fromDK) { this.__setIsCompAnswered(this.__mandatoryMet()); }
        },

        sendResponse: function(rowWgt, ansVal) {
            var rowIndex = rowWgt.rowIndex();
            console.log("sendResponse: " + rowIndex + " | " + ansVal);

            // Kantar custom 'dragging' event
            $.event.trigger({
                type : "KantarCompEvent",
                eventType : (ansVal) ? "kantar_answered" : "kantar_unanswered",
                row : rowWgt.widget(),
                column : null,
                action: "set_response"
            });

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
                var rowArray = this.qStudioVar.rowArray,
                    params = this.qStudioVar.params,
                    dkEnable = this.qStudioVar.respRef.radChkEnabled,
                    isSingleChoice = (params.compQuestionType.value.toLowerCase().indexOf("single") !== -1);

                while(respArry.length !== 0) {
                    var rowIndex = parseInt(respArry[0].rowIndex, 10);
                    if (rowIndex >= 0 && rowIndex < rowArray.length) {
                        if (!dkEnable) {
                            this[(isSingleChoice) ? "controllerTapSingle" : "controllerTapMulti"](rowIndex, 0);
                        } else {
                            if (rowIndex === rowArray.length-1) {
                                this.controllerTapDontKnow(0);
                            } else {
                                this[(isSingleChoice) ? "controllerTapSingle" : "controllerTapMulti"](rowIndex, 0);
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
            var valarray = [],
                json = { Response: { Value: valarray } },
                respRef = this.qStudioVar.respRef,
                dkWgt = respRef.dkWgt,
                grpInfo = respRef.grpInfo,
                grpRespArray = null,
                params = this.qStudioVar.params,
                isSingleChoice = (params.compQuestionType.value.toLowerCase().indexOf("single") !== -1);

            for (var grpIndex in grpInfo) {
                if (grpInfo.hasOwnProperty(grpIndex)) {
                    grpRespArray = grpInfo[grpIndex].responseArray;
                    if (isSingleChoice) {
                        if (grpRespArray.length === 0) {
                            valarray.push("");
                        } else {
                            for (var i=0; i<grpRespArray.length; i+=1) {
                                valarray.push(grpRespArray[i].widget().id);
                            }
                        }
                    } else {
                        for (var i=0; i<grpRespArray.length; i+=1) {
                            valarray.push(grpRespArray[i].widget().id);
                        }
                    }
                }
            }

            if (dkWgt && dkWgt.isAnswered()) {
                valarray.push(dkWgt.widget().id);
            }

            return json;
        }
    };

    return ClicknFly;

})();
