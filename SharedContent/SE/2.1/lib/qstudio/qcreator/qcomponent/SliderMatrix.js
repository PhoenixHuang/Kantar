/**
 * SliderMatrix Javascript File
 * Version : 1.2.0
 * Date : 2014-06-17
 *
 * Slider Matrix Component.
 * BaseClassType : Multi
 * Requires rowArray and columnArray datasets.
 * Confluence Link : https://docs.gmi-mr.com/confluence/display/midev/SliderMatrix+Component+Documentation
 *
 * Release 1.2.0
 * - compRTL is now automatically set for Dimensions and Decipher. QFactory utility method 'isSurveyRTL' is used
 * - made adjustments and bug fixes for RTL
 * - Added new parameter rowContainOptHalign which horizontally aligns row options. Options include 'left', 'right', & 'center'. Applies to vertical layout directions only
 * - Added new parameter rowContainOptValign which vertically aligns row options. Options include 'top', 'bottom', & 'middle'. Applies to horizontal layout directions only
 * - Added new parameter colContainOptHalign which horizontally aligns column options. Options include 'left', 'right', & 'center'. Applies to vertical layout directions only
 * - Added new parameter colContainOptValign which vertically aligns column options. Options include 'top', 'bottom', & 'middle'. Applies to horizontal layout directions only
 * - Updated MSPointer events per http://msdn.microsoft.com/en-us/library/dn304886(v=vs.85).aspx
 * - For QStudio Component Creation Window RTL display is turned off. Enabling RTL will move content to the right
 *   which is throwing off positioning
 * - Changed scrolling layout event behavior to align better w/ touch scrolling
 * - Updated events to work better w/ touch scrolling
 *
 */

'use strict';
var SliderMatrix = (function () {

    function SliderMatrix() {
        this.qStudioVar = {
            isCompRTL : false,
            interact : true,
            isDC : false,
            params : this.initParams(),
            rowArray : [],
            columnArray : [],
            rowAcceptedWgts : [
                "base",
                "kantarbase",
                "text",
                "label only",
                "none"
            ],
            colAcceptedWgts : [
                "base",
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

    SliderMatrix.prototype = {

        /*
         * Init component for DC mode. 
         * Can interact w/ component and records data.
         */
        renderDC: function(parent) {
            //console.log("DC Rendering on parent");
            this.qStudioVar.interact = true;
            this.qStudioVar.isDC = true;
            this.create(parent);
        },

        /*
         * Init component for SD mode. 
         * Can not interact w/ component and does not record data.
         */
        renderSD: function(parent) {
            //console.log("SD Rendering on parent");
            this.qStudioVar.interact = false;
            this.qStudioVar.isDC = false;
            this.create(parent);
        },

        /*
         * Init component for DEMO mode. 
         * Can interact w/ component but does not record data.
         */
        renderDEMO: function(parent) {
            //console.log("DEMO Rendering on parent");
            this.qStudioVar.interact = true;
            this.qStudioVar.isDC = false;
            this.create(parent);
        },

        // Get/Set qStudioVar.rowArray array
        rowArray: function() {
            var arg = arguments[0];

            // Return qStudioVar.rowArray array if no argument provided
            if (typeof arg === 'undefined') {
                //console.log("Getting rowArray");
                return this.qStudioVar.rowArray;
            }

            // Set qStudioVar.rowArray array if valid array provided
            if (jQuery.isArray(arg)) {
                //console.log("Setting rowArray");
                this.qStudioVar.rowArray = arg;
            }
        },

        // Get/Set qStudioVar.columnArray array
        columnArray: function() {
            var arg = arguments[0];

            // Return qStudioVar.columnArray array if no argument provided
            if (typeof arg === 'undefined') {
                //console.log("Getting columnArray");
                return this.qStudioVar.columnArray;
            }

            // Set qStudioVar.columnArray array if valid array provided
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

        /*
         * Get/Set qStudioVar.params object
         */
        params: function() {
            var arg = arguments[0];
            // Return qStudioVar.params object array if no argument provided
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

            // Set qStudioVar.params object if argument is valid array
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

        /*
         * Get/Set DC Proxy
         */
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

        // Component description
        description: function() {
            return 'SliderMatrix component description...';
        },

        // Component base class type
        baseClassType: function() {
            // Multi column base class type
            return 'multi';
        },

        // Component question type
        questionType: function() {
            var qtype = this.qStudioVar.params.compQuestionType.value.toLowerCase();
            if (qtype.indexOf('multiple') !== -1) { return 'multi'; }
            return 'single';
        },

        isAutoNextEnabled: function() {
            return (this.qStudioVar.params.rowContainAutoNext.value && this.questionType() === "single");
        },

        getLibraries: function() {
            return [
                "http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js",
                "qcreator/qcore/QFactory.js",
                "qcreator/qcore/QContainer.js",
                "qcreator/qcore/QWidget.js"
            ];
        },

        /*
         * Call to init default component parameters
         */
        initParams: function() {
            return {
                // Component Parameters  .
                compQuestionType: { name:"Component: Question Type", value:'Single Choice', description:"Component question type.", type:"combo", options:['Single Choice', 'Multiple Choice'], order: 1 },
                compContainPos: { name:"Component Contain: CSS Position", value:"relative", description:"CSS position property for component container element.", type:"combo", options:["absolute", "relative"], order: 4 },
                compRTL: { name:"Component RTL: Enable", value:false, description:"If set true, component will be setup to support right-to-left languages.", type:"bool", order:24 },

                // Row Container Parameters
                rowContainType: { name:"Row Contain: Layout Type", value:"vertical layout", description:"Layout template type applied to row buttons.", type:"combo", options:["horizontal grid layout", "vertical grid layout", "horizontal layout", "vertical layout", "horizontal scroll", "vertical scroll", "set layout"], order: 3 },
                rowContainWidth: { name:"Row Contain: Bckgrnd Width", value:800, description:"Row container background width, in pixels.", type:"number", min:50, wgtref: 'rowcontain', wgtname:"width", order: 5 },
                rowContainHeight: { name:"Row Contain: Bckgrnd Height", value:600, description:"Row container background height, in pixels.", type:"number", min:50, wgtref: 'rowcontain', wgtname:"height", order: 6 },
                rowContainPadding: { name:"Row Contain: Bckgrnd Padding", value:0, description:"Row container background padding, in pixels.", type:"number", min:0, wgtref: 'rowcontain', wgtname:"padding", order: 7 },
                rowContainAutoWidth: { name:"Row Contain: Autosize Bckgrnd Width", value:true, description:"If set true, row button container width will be automatically set.", type:"bool", wgtref: 'rowcontain', wgtname:"autoWidth", order:17 },
                rowContainAutoHeight: { name:"Row Contain: Autosize Bckgrnd Height", value:true, description:"If set true, row button container height will be automatically set.", type:"bool", wgtref: 'rowcontain', wgtname:"autoHeight", order:18 },
                rowContainHgap: { name:"Row Contain: Horz Btn Spacing", value:5, description:"The horizontal spacing of row buttons, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"hgap", order: 8 },
                rowContainVgap: { name:"Row Contain: Vert Btn Spacing", value:5, description:"The vertical spacing of row buttons, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"vgap", order: 9 },
                rowContainHoffset: { name:"Row Contain: Left CSS Pos", value:0, description:"Left CSS position value used to offset row button container from its default location, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"left", order: 10 },
                rowContainVoffset: { name:"Row Contain: Top CSS Pos", value:0, description:"Top CSS position value used to offset row button container from its default location, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"top", order: 11 },
                rowContainOptHalign: { name:"Row Contain: Option Horz Alignment", value:'left', description:"", type:"combo", options:['left', 'center', 'right'], wgtref: 'rowcontain', wgtname:"option_halign", order:20 },
                rowContainOptValign: { name:"Row Contain: Option Vert Alignment", value:'top', description:"", type:"combo", options:['top', 'middle', 'bottom'], wgtref: 'rowcontain', wgtname:"option_valign", order:20 },
                rowContainBckgrndDispType: { name:"Row Contain: Bckgrnd Display Type", value:"none", description:"Row container background display type.", type:"combo", options:["vector", "import", "none"], order: 3 },
                rowContainBorderStyle: { name:"Row Contain: Border Style", value:"none", description:"Row container CSS border style property.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'rowcontain', wgtname:"border_style", order: 12 },
                rowContainBorderWidth: { name:"Row Contain: Border Width", value:0, description:"Row container border width, in pixels.", type:"number", min:0, wgtref: 'rowcontain', wgtname:"border_width", order: 13 },
                rowContainBorderColor: { name:"Row Contain: Border Color", value:0xA6A8AB, description:"Row container border color.", type:"colour", wgtref: 'rowcontain', wgtname:"border_color", order: 14 },
                rowContainBckgrndColor: { name:"Row Contain: Bckgrnd Color", value:0xFFFFFF, description:"Row container background color.", type:"colour", wgtref: 'rowcontain', wgtname:"bckgrnd_color", order: 15 },
                rowContainImgImport: { name:"Row Contain: Import Bckgrnd", value:"", description:"Row container imported background image.", type:"bitmapdata", wgtref: 'rowcontain', wgtname:"bckgrnd_import", order:26 },
                rowContainImgImportHoffset: { name:"Row Contain: Import Bckgrnd Left CSS Pos", value:0, description:"Left CSS position value used to offset imported background image from its default location, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"bckgrnd_import_left", order:27 },
                rowContainImgImportVoffset: { name:"Row Contain: Import Bckgrnd Top CSS Pos", value:0, description:"Top CSS position value used to offset imported background image from its default location, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"bckgrnd_import_top", order:28 },
                rowContainShowLabel: { name:"Row Contain: Show Label", value:false, description:"If set true, row container label will display.", type:"bool", wgtref: 'rowcontain', wgtname:"show_label", order:24 },
                rowContainLabel: { name:"Row Contain: Label Text", value:"Row Container Label", description:"Row container label text.", type:"string", wgtref: 'rowcontain', wgtname:"label", order:19 },
                rowContainLabelHalign: { name:"Row Contain: Label Horz Alignment", value:'left', description:"Horizontal text alignment of row container label.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowcontain', wgtname:"label_halign", order:20 },
                rowContainLabelFontSize: { name:"Row Contain: Label Font Size", value:18, description:"Row container label font size, in pixels.", type:"number", min:5, wgtref: 'rowcontain', wgtname:"label_fontsize", order:21 },
                rowContainLabelPadding: { name:"Row Contain: Label Padding", value:4, description:"Row container label padding, in pixels.", type:"number", min:0, wgtref: 'rowcontain', wgtname:"label_padding", order:22 },
                rowContainLabelColor: { name:"Row Contain: Label Font Color", value:0x5B5F65, description:"Row container label font color.", type:"colour", wgtref: 'rowcontain', wgtname:"label_fontcolor", order:23 },
                rowContainSetRowPer: { name:"Set Layout: Number of Rows Per Set", value:3, description:"The number of row buttons per set.", type:"number", min:1, wgtref: 'rowcontain', wgtname:"num_per_row", order:18 },
                rowContainScrlAnimSpeed: { name:"Scroll Layout: Animation Speed", value:500, description:"Scrolling animation speed in milliseconds.", type:"number", min:100, wgtref: 'rowcontain', wgtname:"anim_speed", order:18 },
                rowContainScrlEndPos: { name:"Scroll Layout: Row Ending Offset", value:150, description:"How far rows should animate out after being viewed.", type:"number", wgtref: 'rowcontain', wgtname:"end_offset", order:21 },
                rowContainChldInitAlpha: { name:"Scroll/Set Layout: Row Starting Opacity", value:100, description:"Row opacity before it’s been viewed.", type:"number", max:100, wgtref: 'rowcontain', wgtname:"start_alpha", order:23 },
                rowContainChldEndAlpha: { name:"Scroll Layout: Row Ending Opacity", value:0, description:"Row opacity after it’s been viewed.", type:"number", max:100, wgtref: 'rowcontain', wgtname:"end_alpha", order:24 },
                rowContainChldEnableAlpha: { name:"Scroll Layout: Column Opacity during Scroll", value:50, description:"Column opacity while a new row is scrolling in.", type:"number", max:100, order:24 },
                rowContainGoOpaque: { name:"Scroll/Set Layout: Enable Opaque Feature", value:false, description:"If set true, opacity does not affect row backgrounds.", type:"bool", wgtref: 'rowcontain', wgtname:"go_opaque", order:25 },
                rowContainAutoNext: { name:"Scroll/Set Layout: AutoNext Row", value:true, description:"If set true, container will advance to next row once the current row is answered. Applies to Single Choice question type only.", type:"bool", order:25 },

                // Row Button Background Parameters
                rowBtnDefaultType: { name:"Row Btn: Default Button Type", value:"Base", description:"Default button type used by component.", type:"combo", options:["Base", "Text", "Label Only", "None"], order:29 },
                rowBtnWidth: { name:"Row Btn: Bckgrnd Width", value:125, description:"Button background width, in pixels", type:"number", min:10, wgtref: 'rowbtn', wgtname:"width", order:30 },
                rowBtnHeight: { name:"Row Btn: Bckgrnd Height", value:125, description:"Button background height, in pixels", type:"number", min:10, wgtref: 'rowbtn', wgtname:"height", order:31 },
                rowBtnPadding: { name:"Row Btn: Bckgrnd Padding", value:4, description:"Button background padding, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"padding", order:32 },
                rowBtnShowBckgrnd: { name:"Row Btn: Show Bckgrnd", value:true, description:"If set false, button background will not display.", type:"bool", wgtref: 'rowbtn', wgtname:"show_bckgrnd", order:42 },
                rowBtnBorderStyle: { name:"Row Btn: Border Style", value:"solid", description:"Button background CSS border style property.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'rowbtn', wgtname:"border_style", order:33 },
                rowBtnBorderRadius: { name:"Row Btn: Border Radius", value:0, description:"Button background border radius, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_radius", order:35 },
                rowBtnBorderWidthUp: { name:"Row Btn: Border UP Width", value:2, description:"Button background border width (in pixels) in its default state.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_width_up", order:34 },
                rowBtnBorderWidthDown: { name:"Row Btn: Border DOWN Width", value:2, description:"Button background border width (in pixels) when button is selected.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_width_down", order:34 },
                rowBtnBorderColorUp: { name:"Row Btn: Border UP Color", value:0xA6A8AB, description:"Button background border color in its default state.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_up", order:36 },
                rowBtnBorderColorDown: { name:"Row Btn: Border DOWN Color", value:0x5B5F65, description:"Button background border color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_down", order:38 },
                rowBtnBckgrndColorUp: { name:"Row Btn: Bckgrnd UP Color", value:0xF2F2F2, description:"Button background color in its default state.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_up", order:39 },
                rowBtnBckgrndColorDown: { name:"Row Btn: Bckgrnd DOWN Color", value:0xFFBD1A, description:"Button background color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_down", order:41 },
                rowBckgrndShowImp: { name:"Row Btn: Show Import Bckgrnd", value:false, description:"If set true, background will display an imported image instead of a background color.", type:"bool", order:49 },
                rowBckgrndImpUp: { name:"Row Btn: Import UP Bckgrnd", value:"", description:"Import background image to use when button is in its default state.", type:"bitmapdata", order:43 },
                rowBckgrndImpDown: { name:"Row Btn: Import DOWN Bckgrnd", value:"", description:"Import background image to use on button select.", type:"bitmapdata", order:45 },

                // Row Button Label Parameters
                rowBtnShowLabel: { name:"Row Label: Display", value:true, description:"If set false, button label will not display.", type:"bool", wgtref: 'rowbtn', wgtname:"show_label", order:60 },
                rowBtnLabelOvrWidth: { name:"Row Label: Overwrite Width", value:false, description:"", type:"bool", wgtref: 'rowbtn', wgtname:"label_ovr_width", order:60 },
                rowBtnLabelPlacement: { name:"Row Label: Placement", value:'bottom', description:"Button label placement in relation to its background element.", type:"combo", options:['top', 'bottom', 'bottom overlay', 'top overlay', 'center overlay'], wgtref: 'rowbtn', wgtname:"label_placement", order:51 },
                rowBtnLabelHalign: { name:"Row Label: Horz Alignment", value:'left', description:"Horizontal text alignment of button label field.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowbtn', wgtname:"label_halign", order:52 },
                rowBtnLabelWidth: { name:"Row Label: Custom Width", value:150, description:"", type:"number", min:10, wgtref: 'rowbtn', wgtname:"label_width", order:30 },
                rowBtnLabelHoffset: { name:"Row Label: Left CSS Pos", value:0, description:"Left CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"label_left", order:54 },
                rowBtnLabelVoffset: { name:"Row Label: Top CSS Pos", value:0, description:"Top CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"label_top", order:55 },
                rowBtnLabelFontSize: { name:"Row Label: Font Size", value:18, description:"Button label font size, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"label_fontsize", order:53 },
                rowBtnLabelColorUp: { name:"Row Label: UP Font Color", value:0x5B5F65, description:"Button label font color in the button’s default state.", type:"colour", wgtref: 'rowbtn', wgtname:"label_fontcolor_up", order:56 },
                rowBtnLabelColorDown: { name:"Row Label: DOWN Font Color", value:0x5B5F65, description:"Button label font color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"label_fontcolor_down", order:58 },
                rowBtnLabelOverlayShowBckgrnd: { name:"Row Label Overlay: Display Bckgrnd", value:true, description:"If set true, Overlay label will display a background color.", type:"bool", wgtref: 'rowbtn', wgtname:"show_label_bckgrnd", order:61 },
                rowBtnLabelOverlayBckgrndColor: { name:"Row Label Overlay: Bckgrnd Color", value:0xFFFFFF, description:"Overlay label background color.", type:"colour", wgtref: 'rowbtn', wgtname:"label_bckgrnd_color", order:59 },
                rowBtnLabelOverlayPadding: { name:"Row Label Overlay: Label Padding", value:4, description:"Overlay label padding, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"label_overlay_padding", order:32 },

                // Row Button Image Parameters
                rowBtnImgHoffset: { name:"Row Image: Left CSS Pos", value:0, description:"Left CSS position value used to offset button image from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"img_left", order:62 },
                rowBtnImgVoffset: { name:"Row Image: Top CSS Pos", value:0, description:"Top CSS position value used to offset button image from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"img_top", order:63 },

                // Row Button Stamp Parameters
                rowShowStamp: { name:"Row Stamp: Display", value:false, description:"If set true, imported stamp will display when button is selected.", type:"bool", wgtref: 'rowbtn', wgtname:"show_stamp", order:69 },
                rowStampImp: { name:"Row Stamp: Import Image", value:"", description:"Imported stamp image to use on button select.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"stamp_import", order:64 },
                rowStampWidth: { name:"Row Stamp: Width", value:30, description:"Stamp image width, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"stamp_width", order:65 },
                rowStampHeight: { name:"Row Stamp: Height", value:30, description:"Stamp image height, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"stamp_height", order:66 },
                rowStampHoffset: { name:"Row Stamp: Left CSS Pos", value:0, description:"Left CSS position value used to offset button stamp from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"stamp_left", order:67 },
                rowStampVoffset: { name:"Row Stamp: Top CSS Pos", value:0, description:"Top CSS position value used to offset button stamp from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"stamp_top", order:68 },

                // Row Button Specific Parameters
                rowTxtBtnAdjustHeightType: { name:"Row Text: Auto Height Type", value:'none', description:"Select how the auto height feature for Text widgets is applied. When selecting the option all, the max height is calculated across all Text widgets and used as the button height.", type:"combo", options:['none', 'individual', 'all'], order:73 },

                // Column Container Parameters
                colContainType: { name:"Column Contain: Layout Type", value:"horizontal layout", description:"Layout template type applied to column buttons.", type:"combo", options:["horizontal grid layout", "vertical grid layout", "horizontal layout", "vertical layout"], order: 3 },
                colContainWidth: { name:"Column Contain: Bckgrnd Width", value:800, description:"Column container background width, in pixels.", type:"number", min:50, wgtref: 'colcontain', wgtname:"width", order: 5 },
                colContainHeight: { name:"Column Contain: Bckgrnd Height", value:400, description:"Column container background height, in pixels.", type:"number", min:50, wgtref: 'colcontain', wgtname:"height", order: 6 },
                colContainPadding: { name:"Column Contain: Bckgrnd Padding", value:0, description:"Column container background padding, in pixels.", type:"number", min:0, wgtref: 'colcontain', wgtname:"padding", order: 7 },
                colContainHgap: { name:"Column Contain: Horz Btn Spacing", value:5, description:"The horizontal spacing of column buttons, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"hgap", order: 8 },
                colContainVgap: { name:"Column Contain: Vert Btn Spacing", value:5, description:"The vertical spacing of column buttons, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"vgap", order: 9 },
                colContainHoffset: { name:"Column Contain: Left CSS Pos", value:0, description:"Left CSS position value used to offset column button container from its default location, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"left", order: 10 },
                colContainVoffset: { name:"Column Contain: Top CSS Pos", value:0, description:"Top CSS position value used to offset column button container from its default location, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"top", order: 11 },
                colContainOptHalign: { name:"Column Contain: Option Horz Alignment", value:'left', description:"", type:"combo", options:['left', 'center', 'right'], wgtref: 'colcontain', wgtname:"option_halign", order:20 },
                colContainOptValign: { name:"Column Contain: Option Vert Alignment", value:'top', description:"", type:"combo", options:['top', 'middle', 'bottom'], wgtref: 'colcontain', wgtname:"option_valign", order:20 },
                colContainBckgrndDispType: { name:"Column Contain: Bckgrnd Display Type", value:"none", description:"Column container background display type.", type:"combo", options:["vector", "import", "none"], order: 3 },
                colContainBorderStyle: { name:"Column Contain: Border Style", value:"none", description:"Column container CSS border style property.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'colcontain', wgtname:"border_style", order: 12 },
                colContainBorderWidth: { name:"Column Contain: Border Width", value:0, description:"Column container border width, in pixels.", type:"number", min:0, wgtref: 'colcontain', wgtname:"border_width", order: 13 },
                colContainBorderColor: { name:"Column Contain: Border Color", value:0xA6A8AB, description:"Column container border color.", type:"colour", wgtref: 'colcontain', wgtname:"border_color", order: 14 },
                colContainBckgrndColor: { name:"Column Contain: Bckgrnd Color", value:0xFFFFFF, description:"Column container background color.", type:"colour", wgtref: 'colcontain', wgtname:"bckgrnd_color", order: 15 },
                colContainImgImport: { name:"Column Contain: Import Bckgrnd", value:"", description:"Column container imported background image.", type:"bitmapdata", wgtref: 'colcontain', wgtname:"bckgrnd_import", order:26 },
                colContainImgImportHoffset: { name:"Column Contain: Import Bckgrnd Left CSS Pos", value:0, description:"Left CSS position value used to offset imported background image from its default location, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"bckgrnd_import_left", order:27 },
                colContainImgImportVoffset: { name:"Column Contain: Import Bckgrnd Top CSS Pos", value:0, description:"Top CSS position value used to offset imported background image from its default location, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"bckgrnd_import_top", order:28 },
                colContainShowLabel: { name:"Column Contain: Show Label", value:false, description:"If set true, column container label will display.", type:"bool", wgtref: 'colcontain', wgtname:"show_label", order:24 },
                colContainLabel: { name:"Column Contain: Label Text", value:"Column Container Label", description:"Column layout container label text.", type:"string", wgtref: 'colcontain', wgtname:"label", order:19 },
                colContainLabelHalign: { name:"Column Contain: Label Horz Alignment", value:'left', description:"Horizontal text alignment of column container label.", type:"combo", options:['left', 'right', 'center'], wgtref: 'colcontain', wgtname:"label_halign", order:20 },
                colContainLabelFontSize: { name:"Column Contain: Label Font Size", value:18, description:"Column container label font size, in pixels.", type:"number", min:5, wgtref: 'colcontain', wgtname:"label_fontsize", order:21 },
                colContainLabelPadding: { name:"Column Contain: Label Padding", value:4, description:"Column container label padding, in pixels.", type:"number", min:0, wgtref: 'colcontain', wgtname:"label_padding", order:22 },
                colContainLabelColor: { name:"Column Contain: Label Font Color", value:0x5B5F65, description:"Column container label font color.", type:"colour", wgtref: 'colcontain', wgtname:"label_fontcolor", order:23 },

                // Column Slider Parameters
                colSldrDirection: { name:"Slider: Direction", value:"horizontal", description:"Slider direction.", type:"combo", options:["horizontal", "vertical"], wgtref: 'colsldr', wgtname:"direction", order:69 },
                colSlderAllowTrackClick: { name:"Slider Track: Allow Click", value:true, description:"If set true, user can also click the slider track to move handle.", type:"bool", wgtref: 'colsldr', wgtname:"allow_track_click", order:112 },
                colSldrTrackWidth: { name:"Slider Track: Bckgrnd Width", value:400, description:"Track width, in pixels.", type:"number", min:5, wgtref: 'colsldr', wgtname:"width", order:73 },
                colSldrTrackHeight: { name:"Slider Track: Bckgrnd Height", value:30, description:"Track height, in pixels.", type:"number", min:5, wgtref: 'colsldr', wgtname:"height", order:74 },
                colSldrTrackBorderStyle: { name:"Slider Track: Border Style", value:"solid", description:"Track CSS border style property.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'colsldr', wgtname:"track_border_style", order:75 },
                colSldrTrackBorderWidth: { name:"Slider Track: Border Width", value:2, description:"Track border width, in pixels.", type:"number", min:0, wgtref: 'colsldr', wgtname:"track_border_width", order:76 },
                colSldrTrackBorderRadius: { name:"Slider Track: Border Radius", value:0, description:"Track border radius, in pixels.", type:"number", min:0, wgtref: 'colsldr', wgtname:"track_border_radius", order:77 },
                colSldrTrackBorderColor: { name:"Slider Track: Border Color", value:0xA6A8AB, description:"Track border color.", type:"colour", wgtref: 'colsldr', wgtname:"track_border_color", order:78 },
                colSldrTrackColor: { name:"Slider Track: Bckgrnd Color", value:0xF2F2F2, description:"Track background color.", type:"colour", wgtref: 'colsldr', wgtname:"track_color", order:79 },
                colSldrTrackShowImp: { name:"Slider Track: Show Import", value:false, description:"If set true, track imported image will be displayed instead of track background color.", type:"bool", wgtref: 'colsldr', wgtname:"show_track_import", order:80 },
                colSldrTrackImp: { name:"Slider Track: Import Image", value:"", description:"Import track image to use.", type:"bitmapdata", wgtref: 'colsldr', wgtname:"track_import", order:81 },
                colSldrShowHighlight: { name:"Slider Highlight: Show Highlight", value:true, description:"If set true, track will display a highlight which scales as the user moves the slider handle.", type:"bool", wgtref: 'colsldr', wgtname:"show_highlight", order:82 },
                colSldrHighlightColor: { name:"Slider Highlight: Color", value:0xA6A8AB, description:"Track highlight color.", type:"colour", wgtref: 'colsldr', wgtname:"highlight_color", order:83 },
                colSldrTickShow: { name:"Slider Tick: Display", value:true, description:"If set true, slider tick(s) will display.", type:"bool", wgtref: 'colsldr', wgtname:"tick_show", order:80 },
                colSldrTickWidth: { name:"Slider Tick: Width", value:2, description:"Track tick width, in pixels.", type:"number", min:1, wgtref: 'colsldr', wgtname:"tick_width", order:84 },
                colSldrTickHeight: { name:"Slider Tick: Height", value:10, description:"Track tick height, in pixels.", type:"number", min:1, wgtref: 'colsldr', wgtname:"tick_height", order:85 },
                colSldrTickColor: { name:"Slider Tick: Color", value:0xFFBD1A, description:"Track tick color.", type:"colour", wgtref: 'colsldr', wgtname:"tick_color", order:86 },
                colSldrTickLabDispType: { name:"Slider Tick: Label Display Type", value:"show all", description:"Track tick label display type.", type:"combo", options:["show none", "show all", "show ends", "show three", "custom"], wgtref: 'colsldr', wgtname:"ticklabel_display_type", order:87 },
                colSldrTickLabCustomCnt: { name:"Slider Tick: Custom Label Count", value:5, description:"Number of tick labels to display if label display type is custom.", type:"number", min:1, order:36 },
                colSldrTickLabWidth: { name:"Slider Tick: Label Width", value:80, description:"Track tick label width, in pixels.", type:"number", min:5, wgtref: 'colsldr', wgtname:"ticklabel_width", order:88 },
                colSldrTickLabOffset: { name:"Slider Tick: Label Offset", value:0, description:"If slider direction is horizontal, value represents the Top CSS position property (in pixels). If direction is vertical, value represents the Left CSS position property (in pixels).", type:"number", wgtref: 'colsldr', wgtname:"ticklabel_offset", order:89 },
                colSldrTickLabFontSize: { name:"Slider Tick: Label Font Size", value:14, description:"Track tick label font size.", type:"number", min:5, wgtref: 'colsldr', wgtname:"ticklabel_fontsize", order:90 },
                colSldrTickLabColor: { name:"Slider Tick: Label Font Color", value:0x5B5F65, description:"Track tick label font color.", type:"colour", wgtref: 'colsldr', wgtname:"ticklabel_fontcolor", order:91 },
                colSldrHndleShowBckgrnd: { name:"Slider Handle: Show Bckgrnd", value:true, description:"If set false, slider handle background will not display.", type:"bool", wgtref: 'colsldr', wgtname:"show_handle_bckgrnd", order:112 },
                colSldrHndleShowImg: { name:"Slider Handle: Show Row Image", value:true, description:"If set true, row image will display on slider handle.", type:"bool", order:112 },
                colSldrHndleSnapType: { name:"Slider Handle: Snap Type", value:"none", description:"Slider handle snapping type.", type:"combo", options:["none", "snap before", "snap after"], wgtref: 'colsldr', wgtname:"snap_type", order:105 },
                colSldrHndleInitLoc: { name:"Slider Handle: Start Loc", value:0, description:"Slider handle starting position. Enter a value between 0 and 100, where each value represents an endpoint.", type:"number", min:0, max:100, wgtref: 'colsldr', wgtname:"handle_start_loc", order:93 },
                colSldrHndleWidth: { name:"Slider Handle: Bckgrnd Width", value:30, description:"Slider handle background width, in pixels.", type:"number", min:5, wgtref: 'colsldr', wgtname:"handle_width", order:94 },
                colSldrHndleHeight: { name:"Slider Handle: Bckgrnd Height", value:35, description:"Slider handle background height, in pixels.", type:"number", min:5, wgtref: 'colsldr', wgtname:"handle_height", order:95 },
                colSldrHndlePadding: { name:"Slider Handle: Bckgrnd Padding", value:2, description:"Slider handle background padding, in pixels.", type:"number", min:0, wgtref: 'colsldr', wgtname:"handle_padding", order:95 },
                colSldrHndleBorderStyle: { name:"Slider Handle: Border Style", value:"solid", description:"Slider handle CSS border style property.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'colsldr', wgtname:"handle_border_style", order:96 },
                colSldrHndleBorderWidth: { name:"Slider Handle: Border Width", value:2, description:"Slider handle border width, in pixels.", type:"number", min:0, wgtref: 'colsldr', wgtname:"handle_border_width", order:97 },
                colSldrHndleBorderRadius: { name:"Slider Handle: Border Radius", value:0, description:"Slider handle border radius, in pixels.", type:"number", min:0, wgtref: 'colsldr', wgtname:"handle_border_radius", order:98 },
                colSldrHndleBorderColorUp: { name:"Slider Handle: Border UP Color", value:0xA6A8AB, description:"Slider handle border color in its default state.", type:"colour", wgtref: 'colsldr', wgtname:"handle_border_color_up", order:99 },
                colSldrHndleBorderColorDown: { name:"Slider Handle: Border DOWN Color", value:0x5B5F65, description:"Slider handle border color on mouse down.", type:"colour", wgtref: 'colsldr', wgtname:"handle_border_color_down", order:99 },
                colSldrHndleColorUp: { name:"Slider Handle: Bckgrnd UP Color", value:0xF2F2F2, description:"Slider handle background color in its default state.", type:"colour", wgtref: 'colsldr', wgtname:"handle_color_up", order:100 },
                colSldrHndleColorDown: { name:"Slider Handle: Bckgrnd DOWN Color", value:0xFFBD1A, description:"Slider handle background color on mouse down.", type:"colour", wgtref: 'colsldr', wgtname:"handle_color_down", order:101 },
                colSldrHndleShowImp: { name:"Slider Handle: Show Import Image", value:false, description:"If set true, imported slider handle image will be displayed instead of handle background color.", type:"bool", wgtref: 'colsldr', wgtname:"show_handle_import", order:102 },
                colSldrHndleImpUp: { name:"Slider Handle: Import UP Image", value:"", description:"Import background image to use when slider handle is in its default state.", type:"bitmapdata", wgtref: 'colsldr', wgtname:"handle_import_up", order:103 },
                colSldrHndleImpDown: { name:"Slider Handle: Import DOWN Image", value:"", description:"Import background image to use on slider handle select.", type:"bitmapdata", wgtref: 'colsldr', wgtname:"handle_import_down", order:104 },
                colSldrHndleLabDispType: { name:"Slider Handle: Label Display Type", value:"column label", description:"Slider handle label display type.", type:"combo", options:["column value", "column label", "none"], wgtref: 'colsldr', wgtname:"handle_label_disptype", order:105 },
                colSldrHndleLabFontSize: { name:"Slider Handle: Label Font Size", value:16, description:"Slider handle label font size.", type:"number", min:5, wgtref: 'colsldr', wgtname:"handle_label_fontsize", order:106 },
                colSldrHndleLabFontColor: { name:"Slider Handle: Label Font Color", value:0x5B5F65, description:"Slider handle label font color.", type:"colour", wgtref: 'colsldr', wgtname:"handle_label_fontcolor", order:107 },
                colSldrHndleLabInitTxt: { name:"Slider Handle: Label Initial Text", value:"Click To Activate", description:"Slider handle label initial text.", type:"string", wgtref: 'colsldr', wgtname:"handle_label_inittxt", order:108 },
                // colSldrHndleLabWidth: { name:"Slider Handle: Label Width", value:125, description:"Slider handle label width, in pixels.", type:"number", min:5, wgtref: 'colsldr', wgtname:"handle_label_width", order:109 },
                colSldrHndleLabHoffset: { name:"Slider Handle: Label Left CSS Pos", value:0, description:"Left CSS position value used to offset slider handle label from its default location, in pixels.", type:"number", wgtref: 'colsldr', wgtname:"handle_label_left", order:110 },
                colSldrHndleLabVoffset: { name:"Slider Handle: Label Top CSS Pos", value:0, description:"Top CSS position value used to offset slider handle label from its default location, in pixels.", type:"number", wgtref: 'colsldr', wgtname:"handle_label_top", order:111 },
                colSldrImgDispType: { name:"Slider Image: Display Type", value:'none', description:"Select an image container display type.", type:"combo", options:['top', 'bottom', 'right', 'left', "none"], wgtref: 'colsldr', wgtname:"img_placement", order:40 },
                colSldrShowInitImg: { name:"Slider Image: Show Initial Image", value:false, description:"If set true, an initial image will display.", type:"bool", wgtref: 'colsldr', wgtname:"show_init_img", order:112 },
                colSldrImgContWidth: { name:"Slider Image: Width", value:100, description:"Width of image container, in pixels.", type:"number", min:10, wgtref: 'colsldr', wgtname:"img_width", order:113 },
                colSldrImgContHeight: { name:"Slider Image: Height", value:100, description:"Height of image container, in pixels.", type:"number", min:10, wgtref: 'colsldr', wgtname:"img_height", order:114 },
                colSldrImgContHoffset: { name:"Slider Image: Left CSS Pos", value:0, description:"Left CSS position value used to offset image container from its default location, in pixels.", type:"number", wgtref: 'colsldr', wgtname:"img_left", order:115 },
                colSldrImgContVoffset: { name:"Slider Image: Top CSS Pos", value:0, description:"Top CSS position value used to offset image container from its default location, in pixels.", type:"number", wgtref: 'colsldr', wgtname:"img_top", order:116 },
                colSldrShowEndImg: { name:"Slider End Image: Display", value:false, description:"If set true, end images will display separate from the image container.", type:"bool", wgtref: 'colsldr', wgtname:"show_end_img", order:112 },
                colSldrImgEndWidth: { name:"Slider End Image: Width", value:100, description:"Width of end images, in pixels.", type:"number", min:10, wgtref: 'colsldr', wgtname:"end_img_width", order:113 },
                colSldrImgEndHeight: { name:"Slider End Image: Height", value:100, description:"Height of end images, in pixels.", type:"number", min:10, wgtref: 'colsldr', wgtname:"end_img_height", order:114 },
                colSldrImgEndHoffset: { name:"Slider End Image: Left CSS Pos", value:0, description:"Left CSS position value used to offset end images from their default location, in pixels.", type:"number", wgtref: 'colsldr', wgtname:"end_img_left", order:115 },
                colSldrImgEndVoffset: { name:"Slider End Image: Top CSS Pos", value:0, description:"Top CSS position value used to offset end images from their default location, in pixels.", type:"number", wgtref: 'colsldr', wgtname:"end_img_top", order:116 },

                // Column Button Background Parameters
                colBtnDefaultType: { name:"Column Btn: Default Button Type", value:"Base", description:"Default button type used by component.", type:"combo", options:["Base", "Text", "RadioCheck"], order:29 },
                colBtnWidth: { name:"Column Btn: Bckgrnd Width", value:85, description:"Button background width, in pixels", type:"number", min:10, wgtref: 'colbtn', wgtname:"width", order:30 },
                colBtnHeight: { name:"Column Btn: Bckgrnd Height", value:85, description:"Button background height, in pixels", type:"number", min:10, wgtref: 'colbtn', wgtname:"height", order:31 },
                colBtnPadding: { name:"Column Btn: Bckgrnd Padding", value:4, description:"Button background padding, in pixels.", type:"number", min:0, wgtref: 'colbtn', wgtname:"padding", order:32 },
                colBtnShowBckgrnd: { name:"Column Btn: Show Bckgrnd", value:true, description:"If set false, button background will not display.", type:"bool", wgtref: 'colbtn', wgtname:"show_bckgrnd", order:42 },
                colBtnBorderStyle: { name:"Column Btn: Border Style", value:"solid", description:"Button background CSS border style property.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'colbtn', wgtname:"border_style", order:33 },
                colBtnBorderRadius: { name:"Column Btn: Border Radius", value:0, description:"Button background border radius, in pixels.", type:"number", min:0, wgtref: 'colbtn', wgtname:"border_radius", order:35 },
                colBtnBorderWidthUp: { name:"Column Btn: Border UP Width", value:2, description:"Button background border width (in pixels) in its default state.", type:"number", min:0, wgtref: 'colbtn', wgtname:"border_width_up", order:34 },
                colBtnBorderWidthOver: { name:"Column Btn: Border OVER Width", value:2, description:"Button background border width (in pixels) on mouse over.", type:"number", min:0, wgtref: 'colbtn', wgtname:"border_width_over", order:34 },
                colBtnBorderWidthDown: { name:"Column Btn: Border DOWN Width", value:2, description:"Button background border width (in pixels) when button is selected.", type:"number", min:0, wgtref: 'colbtn', wgtname:"border_width_down", order:34 },
                colBtnBorderColorUp: { name:"Column Btn: Border UP Color", value:0xA6A8AB, description:"Button background border color in its default state.", type:"colour", wgtref: 'colbtn', wgtname:"border_color_up", order:36 },
                colBtnBorderColorOver: { name:"Column Btn: Border OVER Color", value:0x5B5F65, description:"Button background border color on mouse over.", type:"colour", wgtref: 'colbtn', wgtname:"border_color_over", order:37 },
                colBtnBorderColorDown: { name:"Column Btn: Border DOWN Color", value:0x5B5F65, description:"Button background border color when button is selected.", type:"colour", wgtref: 'colbtn', wgtname:"border_color_down", order:38 },
                colBtnBckgrndColorUp: { name:"Column Btn: Bckgrnd UP Color", value:0xF2F2F2, description:"Button background color in its default state.", type:"colour", wgtref: 'colbtn', wgtname:"bckgrnd_color_up", order:39 },
                colBtnBckgrndColorOver: { name:"Column Btn: Bckgrnd OVER Color", value:0xA6A8AB, description:"Button background color on mouse over.", type:"colour", wgtref: 'colbtn', wgtname:"bckgrnd_color_over", order:40 },
                colBtnBckgrndColorDown: { name:"Column Btn: Bckgrnd DOWN Color", value:0xFFBD1A, description:"Button background color when button is selected.", type:"colour", wgtref: 'colbtn', wgtname:"bckgrnd_color_down", order:41 },
                colRadShowImp: { name:"Column Btn: Show Import RADIO Bckgrnd", value:false, description:"If set true, buttons which behave like Radio buttons will display an imported image instead of a background color.", type:"bool", order:49 },
                colRadImpUp: { name:"Column Btn: RADIO Import UP Bckgrnd", value:"", description:"Import background image to use when button is in its default state (for buttons which behave like Radio buttons).", type:"bitmapdata", order:43 },
                colRadImpOver: { name:"Column Btn: RADIO Import OVER Bckgrnd", value:"", description:"Import background image to use on button mouse over (for buttons which behave like Radio buttons).", type:"bitmapdata", order:44 },
                colRadImpDown: { name:"Column Btn: RADIO Import DOWN Bckgrnd", value:"", description:"Import background image to use on button select (for buttons which behave like Radio buttons).", type:"bitmapdata", order:45 },
                colChkShowImp: { name:"Column Btn: Show Import CHECK Bckgrnd", value:false, description:"If set true, buttons which behave like Checkbox buttons will display an imported image instead of a background color.", type:"bool", order:50 },
                colChkImpUp: { name:"Column Btn: CHECK Import UP Bckgrnd", value:"", description:"Import background image to use when button is in its default state (for buttons which behave like Checkbox buttons).", type:"bitmapdata", order:46 },
                colChkImpOver: { name:"Column Btn: CHECK Import OVER Bckgrnd", value:"", description:"Import background image to use on button mouse over (for buttons which behave like Checkbox buttons).", type:"bitmapdata", order:47 },
                colChkImpDown: { name:"Column Btn: CHECK Import DOWN Bckgrnd", value:"", description:"Import background image to use on button select (for buttons which behave like Checkbox buttons).", type:"bitmapdata", order:48 },

                // Column Button Label Parameters
                colBtnShowLabel: { name:"Column Label: Display", value:true, description:"If set false, button label will not display.", type:"bool", wgtref: 'colbtn', wgtname:"show_label", order:60 },
                colBtnLabelOvrWidth: { name:"Column Label: Overwrite Width", value:false, description:"", type:"bool", wgtref: 'colbtn', wgtname:"label_ovr_width", order:60 },
                colBtnLabelPlacement: { name:"Column Label: Placement", value:'bottom', description:"Button label placement in relation to its background element.", type:"combo", options:['top', 'bottom', 'bottom overlay', 'top overlay', 'center overlay'], wgtref: 'colbtn', wgtname:"label_placement", order:51 },
                colBtnLabelHalign: { name:"Column Label: Horz Alignment", value:'left', description:"Horizontal text alignment of button label field.", type:"combo", options:['left', 'right', 'center'], wgtref: 'colbtn', wgtname:"label_halign", order:52 },
                colBtnLabelWidth: { name:"Column Label: Custom Width", value:100, description:"", type:"number", min:10, wgtref: 'colbtn', wgtname:"label_width", order:30 },
                colBtnLabelHoffset: { name:"Column Label: Left CSS Pos", value:0, description:"Left CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"label_left", order:54 },
                colBtnLabelVoffset: { name:"Column Label: Top CSS Pos", value:0, description:"Top CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"label_top", order:55 },
                colBtnLabelFontSize: { name:"Column Label: Font Size", value:18, description:"Button label font size, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"label_fontsize", order:53 },
                colBtnLabelColorUp: { name:"Column Label: UP Font Color", value:0x5B5F65, description:"Button label font color in the button’s default state.", type:"colour", wgtref: 'colbtn', wgtname:"label_fontcolor_up", order:56 },
                colBtnLabelColorOver: { name:"Column Label: OVER Font Color", value:0x5B5F65, description:"Button label font color on button mouse over.", type:"colour", wgtref: 'colbtn', wgtname:"label_fontcolor_over", order:57 },
                colBtnLabelColorDown: { name:"Column Label: DOWN Font Color", value:0x5B5F65, description:"Button label font color when button is selected.", type:"colour", wgtref: 'colbtn', wgtname:"label_fontcolor_down", order:58 },
                colBtnLabelOverlayShowBckgrnd: { name:"Column Label Overlay: Display Bckgrnd", value:true, description:"If set true, Overlay label will display a background color.", type:"bool", wgtref: 'colbtn', wgtname:"show_label_bckgrnd", order:61 },
                colBtnLabelOverlayBckgrndColor: { name:"Column Label Overlay: Bckgrnd Color", value:0xFFFFFF, description:"Overlay label background color.", type:"colour", wgtref: 'colbtn', wgtname:"label_bckgrnd_color", order:59 },
                colBtnLabelOverlayPadding: { name:"Column Label Overlay: Label Padding", value:4, description:"Overlay label padding, in pixels.", type:"number", min:0, wgtref: 'colbtn', wgtname:"label_overlay_padding", order:32 },

                // Column Button Specific Parameters
                colRadChckImpRadio: { name:"Column RadChk: RADIO Import Bckgrnd", value:"", description:"Import image to use for Radio button types. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'colbtn', wgtname:"radchkbtn_rad_url", order:75 },
                colRadChckWidthRadio: { name:"Column RadChk: RADIO Bckgrnd Width", value:30, description:"Width used for Radio import image, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"radchkbtn_rad_width", order:76 },
                colRadChckHeightRadio: { name:"Column RadChk: RADIO Bckgrnd Height", value:30, description:"Height used for Radio import image, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"radchkbtn_rad_height", order:77 },
                colRadChckImpCheck: { name:"Column RadChk: CHECK Import Bckgrnd", value:"", description:"Import image to use for Checkbox button types. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'colbtn', wgtname:"radchkbtn_chk_url", order:78 },
                colRadChckWidthCheck: { name:"Column RadChk: CHECK Bckgrnd Width", value:30, description:"Width used for Checkbox import image, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"radchkbtn_chk_width", order:79 },
                colRadChckHeightCheck: { name:"Column RadChk: CHECK Bckgrnd Height", value:30, description:"Height used for Checkbox import image, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"radchkbtn_chk_height", order:80 },
                colRadChckLabelHalign: { name:"Column RadChk: Label Horz Alignment", value:'left', description:"Horizontal alignment of text in the button label field.", type:"combo", options:['left', 'right', 'center'], wgtref: 'colbtn', wgtname:"radchkbtn_label_halign", order:73 },
                colRadChckLabelWidth: { name:"Column RadChk: Label Width", value:100, description:"Button label field width, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"radchkbtn_label_width", order:72 },
                colRadChckLabelFontSize: { name:"Column RadChk: Label Font Size", value:18, description:"Button label field font size.", type:"number", min:5, wgtref: 'colbtn', wgtname:"radchkbtn_label_fontsize", order:74 },
                colRadChckLabelColorUp: { name:"Column RadChk: Label UP Font Color", value:0x5B5F65, description:"Button label font color in the button’s default state.", type:"colour", wgtref: 'colbtn', wgtname:"radchkbtn_label_fontcolor_up", order:56 },
                colRadChckLabelColorOver: { name:"Column RadChk: Label OVER Font Color", value:0x5B5F65, description:"Button label font color on button mouse over.", type:"colour", wgtref: 'colbtn', wgtname:"radchkbtn_label_fontcolor_over", order:57 },
                colRadChckLabelColorDown: { name:"Column RadChk: Label DOWN Font Color", value:0x5B5F65, description:"Button label font color when button is selected.", type:"colour", wgtref: 'colbtn', wgtname:"radchkbtn_label_fontcolor_down", order:58 },

                // Tooltip Parameters
                rowBtnUseTooltip: { name:"Tooltip: Enable for Row Btn", value:false, description:"If set true and button has a description text, a tooltip will display on button mouse over.", type:"bool", order:92 },
                colBtnUseTooltip: { name:"Tooltip: Enable for Column Btn", value:false, description:"If set true and button has a description text, a tooltip will display on button mouse over.", type:"bool", order:92 },
                tooltipWidth: { name:"Tooltip: Bckgrnd Width", value:150, description:"Tooltip background width, in pixels.", type:"number", min:5, wgtref: 'tooltip', wgtname:"tooltip_width", order:93 },
                tooltipLabelHalign: { name:"Tooltip: Label Horz Alignment", value:'left', description:"Horizontal text alignment of tooltip label.", type:"combo", options:['left', 'right', 'center'], wgtref: 'tooltip', wgtname:"tooltip_halign", order:97 },
                tooltipFontSize: { name:"Tooltip: Label Size", value:18, description:"Tooltip label font size.", type:"number", min:5, wgtref: 'tooltip', wgtname:"tooltip_fontsize", order:98 },
                tooltipFontColor: { name:"Tooltip: Label Color", value:0x5B5F65, description:"Tooltip label font color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_fontcolor", order:99 },

                /**********************************/
                // Additional Parameters
                /**********************************/
                colTxtBtnAdjustHeightType: { name:"Column Text: Height Sizing Type", value:'none', description:"", type:"combo", options:['none', 'individual', 'all'], order:73, display:false },
                colShowStamp: { name:"Column Stamp: Display", value:false, description:"If set true, imported stamp will display when button is selected.", type:"bool", wgtref: 'colbtn', wgtname:"show_stamp", order:69, display: false },
                colStampImp: { name:"Column Stamp: Import Image", value:"", description:"Imported stamp image to use on button select.", type:"bitmapdata", wgtref: 'colbtn', wgtname:"stamp_import", order:64, display: false },
                colStampWidth: { name:"Column Stamp: Width", value:30, description:"Stamp image width, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"stamp_width", order:65, display: false },
                colStampHeight: { name:"Column Stamp: Height", value:30, description:"Stamp image height, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"stamp_height", order:66, display: false },
                colStampHoffset: { name:"Column Stamp: Left CSS Pos", value:0, description:"Left CSS position value used to offset button stamp from its default location, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"stamp_left", order:67, display: false },
                colStampVoffset: { name:"Column Stamp: Top CSS Pos", value:0, description:"Top CSS position value used to offset button stamp from its default location, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"stamp_top", order:68, display: false },
                rowKantBtnLabelWidth: { name:"Row KantarBase Btn: Label Width", value:100, description:"Button label field width, in pixels. If the actual label width ends up being less than the given value, the label width assigned will be the lesser of the two.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kantarbtn_label_width", order:71, display: false },
                colRadChckLabelHoffset: { name:"Column RadChk Btn: Label Left CSS Pos", value:0, description:"Left CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"radchkbtn_label_left", order:54, display: false },
                colRadChckLabelVoffset: { name:"Column RadChk Btn: Label Top CSS Pos", value:0, description:"Top CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"radchkbtn_label_top", order:55, display: false },
                colKntrInputImpRadio: { name:"Column KantarInput Btn: RADIO Import Bckgrnd", value:"", description:"Import image to use for Radio button types. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'colbtn', wgtname:"kntrinputbtn_rad_url", order:75, display: false },
                colKntrInputWidthRadio: { name:"Column KantarInput Btn: RADIO Bckgrnd Width", value:30, description:"Width used for Radio import image, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"kntrinputbtn_rad_width", order:76, display: false },
                colKntrInputHeightRadio: { name:"Column KantarInput Btn: RADIO Bckgrnd Height", value:30, description:"Height used for Radio import image, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"kntrinputbtn_rad_height", order:77, display: false },
                colKntrInputImpCheck: { name:"Column KantarInput Btn: CHECK Import Bckgrnd", value:"", description:"Import image to use for Checkbox button types. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'colbtn', wgtname:"kntrinputbtn_chk_url", order:78, display: false },
                colKntrInputWidthCheck: { name:"Column KantarInput Btn: CHECK Bckgrnd Width", value:30, description:"Width used for Checkbox import image, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"kntrinputbtn_chk_width", order:79, display: false },
                colKntrInputHeightCheck: { name:"Column KantarInput Btn: CHECK Bckgrnd Height", value:30, description:"Height used for Checkbox import image, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"kntrinputbtn_chk_height", order:80, display: false },
                colKntrInputTxtAreaWidth: { name:"Column KantarInput Btn: Input Field Width", value:125, description:"Button input field width, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"kntrinputbtn_input_width", order:72, display: false },
                colKntrInputLabelHalign: { name:"Column KantarInput Btn: Label Horz Alignment", value:'left', description:"Horizontal alignment of text in the button label field.", type:"combo", options:['left', 'right', 'center'], wgtref: 'colbtn', wgtname:"kntrinputbtn_label_halign", order:73, display: false },
                colKntrInputLabelWidth: { name:"Column KantarInput Btn: Label Width", value:100, description:"Button label field width, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"kntrinputbtn_label_width", order:72, display: false },
                colKntrInputLabelHoffset: { name:"Column KantarInput Btn: Label Left CSS Pos", value:0, description:"Left CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"kntrinputbtn_label_left", order:54, display: false },
                colKntrInputLabelVoffset: { name:"Column KantarInput Btn: Label Top CSS Pos", value:0, description:"Top CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"kntrinputbtn_label_top", order:55, display: false },
                colKntrInputLabelFontSize: { name:"Column KantarInput Btn: Label Size", value:18, description:"Button label field font size.", type:"number", min:5, wgtref: 'colbtn', wgtname:"kntrinputbtn_label_fontsize", order:74, display: false },
                colKntrInputLabelColorUp: { name:"Column KantarInput Btn: Label UP Color", value:0x5B5F65, description:"Button label font color in the button’s default state.", type:"colour", wgtref: 'colbtn', wgtname:"kntrinputbtn_label_fontcolor_up", order:56, display: false },
                colKntrInputLabelColorOver: { name:"Column KantarInput Btn: Label OVER Color", value:0x5B5F65, description:"Button label font color on button mouse over.", type:"colour", wgtref: 'colbtn', wgtname:"kntrinputbtn_label_fontcolor_over", order:57, display: false },
                colKntrInputLabelColorDown: { name:"Column KantarInput Btn: Label DOWN Color", value:0x5B5F65, description:"Button label font color when button is selected.", type:"colour", wgtref: 'colbtn', wgtname:"kntrinputbtn_label_fontcolor_down", order:58, display: false },
                colOtherInputHalign: { name:"Column Other Btn: Input Horz Alignment", value:'left', description:"Horizontal text alignment of input field.", type:"combo", options:['left', 'right', 'center'], wgtref: 'colbtn', wgtname:"textarea_halign", order:52, display: false },
                colOtherInputFontSize: { name:"Column Other Btn: Input Font Size", value:16, description:"Input field font size, in pixels.", type:"number", min:5, wgtref: 'colbtn', wgtname:"textarea_fontsize", order:53, display: false },
                colOtherInputColor: { name:"Column Other Btn: Input Color", value:0x5B5F65, description:"Input field font color.", type:"colour", wgtref: 'colbtn', wgtname:"textarea_fontcolor", order:56, display: false },
                colOtherInitTxt: { name:"Column Other Btn: Default Text", value:"Please specify...", description:"Initial text to display in the input textarea.", type:"string", wgtref: 'colbtn', wgtname:"other_init_txt", order:81, display: false },
                colOtherInvalidMsg: { name:"Column Other Numeric Btn: Invalid Msg Text", value:"Number is invalid", description:"Message to display when an invalid number is inputted.", type:"string", wgtref: 'colbtn', wgtname:"other_msg_invalid", order:85, display: false },
                colOtherRangeMsg: { name:"Column Other Numeric Btn: Range Msg Text", value:"Number must be >= min & <= max", description:"Message to display when an inputted number is not within range. If the message contains the word min and/or max, they will be substituted for their respective numeric parameter values.", type:"string", wgtref: 'colbtn', wgtname:"other_msg_range", order:86, display: false },
                colOtherMsgWidth: { name:"Column Other Numeric Btn: Msg Width", value:100, description:"Width of error message label field, in pixels.", type:"number", min:5, order:84, display: false },
                colOtherMinVal: { name:"Column Other Numeric Btn: Min Input Value", value:1, description:"Minimum numeric input allowed.", type:"number", wgtref: 'colbtn', wgtname:"other_min", order:82, display: false },
                colOtherMaxVal: { name:"Column Other Numeric Btn: Max Input Value", value:100, description:"Maximum numeric input allowed.", type:"number", wgtref: 'colbtn', wgtname:"other_max", order:83, display: false },
                colKantBtnLabelWidth: { name:"Column KantarBase Btn: Label Width", value:100, description:"Button label field width, in pixels. If the actual label width ends up being less than the given value, the label width assigned will be the lesser of the two.", type:"number", min:5, wgtref: 'colbtn', wgtname:"kantarbtn_label_width", order:71, display: false },
                tooltipBorderWidth: { name:"Tooltip: Border Width", value:2, description:"Tooltip background border width, in pixels.", type:"number", min:0, wgtref: 'tooltip', wgtname:"tooltip_border_width", order:94, display: false },
                tooltipBorderColor: { name:"Tooltip: Border Color", value:0xA6A8AB, description:"Tooltip background border color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_border_color", order:95, display: false },
                tooltipBckgrndColor: { name:"Tooltip: Bckgrnd Color", value:0xFFFFFF, description:"Tooltip background color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_bckgrnd_color", order:96, display: false },
                zoomActionType: { name:"LightBox: Action Type", value:'click append image', description:"User action type to display image gallery.", type:"combo", options:['click append image', 'click append widget', 'mouseover'], wgtref: 'ctz', wgtname:"action_type", order:52, display: false },
                zoomOverlayBckgrndColor: { name:"LightBox: Overlay Color", value:0x000000, description:"Overlay background color to use when image gallery is displayed.", type:"colour", wgtref: 'ctz', wgtname:"overlay_bckgrnd_color", order:101, display: false },
                zoomOverlayAlpha: { name:"LightBox: Overlay Transparency", value:80, description:"The level of opacity set on the overlay background. The smaller the value the more transparent, the larger the value the less transparent.", type:"number", min:0, max:100, wgtref: 'ctz', wgtname:"overlay_alpha", order:102, display: false },
                zoomGalleryPadding: { name:"LightBox: Image Gallery Padding", value:10, description:"Image gallery padding, in pixels.", type:"number", min:0, wgtref: 'ctz', wgtname:"gallery_padding", order:103, display: false },
                zoomGalleryHoffset: { name:"LightBox: Image Gallery Left CSS Pos", value:0, description:"Left CSS position value used to offset image gallery from its default location, in pixels.", type:"number", wgtref: 'ctz', wgtname:"gallery_left", order:104, display: false },
                zoomGalleryVoffset: { name:"LightBox: Image Gallery Top CSS Pos", value:0, description:"Top CSS position value used to offset image gallery from its default location, in pixels.", type:"number", wgtref: 'ctz', wgtname:"gallery_top", order:105, display: false },
                zoomGalleryBorderStyle: { name:"LightBox: Image Gallery Border Style", value:"none", description:"Image gallery CSS border style property.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'ctz', wgtname:"gallery_border_style", order: 106, display: false },
                zoomGalleryBorderWidth: { name:"LightBox: Image Gallery Border Width", value:0, description:"Image gallery border width, in pixels.", type:"number", min:0, wgtref: 'ctz', wgtname:"gallery_border_width", order: 107, display: false },
                zoomGalleryBorderColor: { name:"LightBox: Image Gallery Border Color", value:0xA6A8AB, description:"Image gallery border color.", type:"colour", wgtref: 'ctz', wgtname:"gallery_border_color", order: 108, display: false },
                zoomBorderWidth: { name:"LightBox: Zoom Btn Border Width", value:1, description:"Click to Zoom button background border width, in pixels.", type:"number", min:0, wgtref: 'ctz', wgtname:"zoom_border_width", order:114, display: false },
                zoomBorderColor: { name:"LightBox: Zoom Btn Border Color", value:0xA6A8AB, description:"Click to Zoom button border color.", type:"colour", wgtref: 'ctz', wgtname:"zoom_border_color", order:115, display: false },
                zoomBckgrndColor: { name:"LightBox: Zoom Btn Bckgrnd Color", value:0xF2F2F2, description:"Click to Zoom button background color.", type:"colour", wgtref: 'ctz', wgtname:"zoom_bckgrnd_color", order:116, display: false },
                rowBtnUseZoom: { name:"LightBox: Enable for Row Btn", value:false, description:"If set true and button has an image, a click to zoom button will be displayed.", type:"bool", order:100, display: false },
                rowZoomHoffset: { name:"LightBox: Row Zoom Btn Left CSS Pos", value:0, description:"Left CSS position value used to offset click to zoom button from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"zoom_left", order:112, display: false },
                rowZoomVoffset: { name:"LightBox: Row Zoom Btn Top CSS Pos", value:0, description:"Top CSS position value used to offset click to zoom button from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"zoom_top", order:113, display: false },
                colBtnUseZoom: { name:"LightBox: Enable for Column Btn", value:false, description:"If set true and button has an image, a click to zoom button will be displayed.", type:"bool", order:93, display: false },
                colZoomHoffset: { name:"LightBox: Column Zoom Btn Left CSS Pos", value:0, description:"Left CSS position value used to offset click to zoom button from its default location, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"zoom_left", order:112, display: false },
                colZoomVoffset: { name:"LightBox: Column Zoom Btn Top CSS Pos", value:0, description:"Top CSS position value used to offset click to zoom button from its default location, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"zoom_top", order:113, display: false },
                zoomImp: { name:"LightBox: Zoom Btn Import Image", value:"", description:"Click to Zoom button imported icon image.", type:"bitmapdata", wgtref: 'ctz', wgtname:"zoom_import", order:109, display: false },
                zoomWidth: { name:"LightBox: Zoom Btn Width", value:20, description:"Click to Zoom button background width, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"zoom_width", order:110, display: false },
                zoomHeight: { name:"LightBox: Zoom Btn Height", value:20, description:"Click to Zoom button background height, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"zoom_height", order:111, display: false },
                zoomCloseImp: { name:"LightBox: Close Btn Import Image", value:"", description:"Image gallery close button imported icon image.", type:"bitmapdata", wgtref: 'ctz', wgtname:"close_import", order:117, display: false },
                zoomCloseWidth: { name:"LightBox: Close Btn Width", value:22, description:"Image gallery close button width, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"close_width", order:118, display: false },
                zoomCloseHeight: { name:"LightBox: Close Btn Height", value:22, description:"Image gallery close button height, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"close_height", order:119, display: false },
                zoomCloseHoffset: { name:"LightBox: Close Btn Left CSS Pos", value:0, description:"Left CSS position value used to offset image gallery close button from its default location, in pixels.", type:"number", wgtref: 'ctz', wgtname:"close_left", order:120, display: false },
                zoomCloseVoffset: { name:"LightBox: Close Btn Top CSS Pos", value:0, description:"Top CSS position value used to offset image gallery close button from its default location, in pixels.", type:"number", wgtref: 'ctz', wgtname:"close_top", order:121, display: false },
                colBtnMouseOverDownShadow: { name:"Column Animation: Mouse OVER/DOWN Show Shadow", value:false, description:"If set true, button background will display a shadow on mouse over and when button is selected.", type:"bool", wgtref: 'colbtn', wgtname:"mouseover_shadow", order:87, display: false },
                colBtnMouseOverBounce: { name:"Column Animation: Mouse OVER Bounce", value:false, description:"If set true, button does a slight bounce on mouse over.", type:"bool", wgtref: 'colbtn', wgtname:"mouseover_bounce", order:88, display: false },
                colBtnMouseOverScale: { name:"Column Animation: Mouse OVER Scale", value:100, description:"Button scale size on mouse over. Any value greater than 100 is above normal scale.", type:"number", min:0, wgtref: 'colbtn', wgtname:"mouseover_scale", order:89, display: false },
                colBtnMouseDownScale: { name:"Column Animation: Mouse DOWN Scale", value:100, description:"Button scale size on button selection. Any value greater than 100 is above normal scale.", type:"number", min:0, wgtref: 'colbtn', wgtname:"mousedown_scale", order:90, display: false },
                colBtnMouseDownAlpha: { name:"Column Animation: Mouse DOWN Transparency", value:100, description:"The level of button opacity on button selection. The smaller the value the more transparent, the larger the value the less transparent.", type:"number", min:0, max:100, wgtref: 'colbtn', wgtname:"mousedown_alpha", order:91, display: false },
                colBtnImgHoffset: { name:"Column Image: Left CSS Pos", value:0, description:"Left CSS position value used to offset button image from its default location, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"img_left", order:62, display: false },
                colBtnImgVoffset: { name:"Column Image: Top CSS Pos", value:0, description:"Top CSS position value used to offset button image from its default location, in pixels.", type:"number", wgtref: 'colbtn', wgtname:"img_top", order:63, display: false },
                colSldrMinVal: { name:"Slider: Min Value", value:0, description:"Minimum slider range value.", type:"number", wgtref: 'colsldr', wgtname:"min", order:70, display: false },
                colSldrMaxVal: { name:"Slider: Max Value", value:100, description:"Maximum slider range value.", type:"number", wgtref: 'colsldr', wgtname:"max", order:71, display: false },
                colSldrPrecVal: { name:"Slider: Precision Value", value:0, description:"Slider range value precision.", type:"number", min:0, wgtref: 'colsldr', wgtname:"precision", order:72, display: false },
                colSldrHndleShowLabelBckgrnd: { name:"Slider Handle: Show Label Bckgrnd", value:false, description:"If set true, handle label background will be displayed.", type:"bool", wgtref: 'colsldr', wgtname:"show_handle_label_bckgrnd", order:112, display: false },
                colSldrHndleLabBckgrndColor: { name:"Slider Handle: Label Bckgrnd Color", value:0xFFFFFF, description:"Slider handle label background color.", type:"colour", wgtref: 'colsldr', wgtname:"handle_label_bckgrnd_color", order:107, display: false }
            };
        },

        // Next Button binding for Scroll and Set Containers
        bindNavNext: function(nextNode, callback) {
            if (callback && typeof callback === 'function') {
                this._navNextCallBack = callback;
            }

            if (nextNode && nextNode.nodeType === 1) {
                this.qStudioVar.compNextBtn = nextNode;
                var that = this,
                    scrollCache = this._scrollLayoutCache,
                    setCache = this._setLayoutCache,
                    tapEvent = (!QUtility.isMSTouch()) ?
                        ((!QUtility.isTouchDevice()) ? "click.scrollmatrix mousedown.scrollmatrix" : "touchstart.scrollmatrix touchend.scrollmatrix touchmove.scrollmatrix"):
                        ((!QUtility.isTouchDevice()) ? "click.scrollmatrix mousedown.scrollmatrix" : ((window.PointerEvent) ? "pointerdown.scrollmatrix pointerup.scrollmatrix" : "MSPointerDown.scrollmatrix MSPointerUp.scrollmatrix")),
                    isTouchMove = false;

                if (scrollCache.contain) {
                    $(nextNode).on(tapEvent, function(event) {
                        event.stopImmediatePropagation();
                        if (that.qStudioVar.dcProxy && (event.type === "mousedown" || event.type === "click")) {
                            event.preventDefault();
                            $(this).css({ opacity : (this.enabled) ? 1 : 0.35 });
                        }

                        if (scrollCache.isScrolling || this.enabled === false) { return; }
                        if (event.type !== "touchmove") {
                            if (event.type !== 'mousedown' && event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                                if (isTouchMove) { return; }
                                var rowIndex = scrollCache.contain.scrollIndex(),
                                    row = that.qStudioVar.respRef[rowIndex].row;

                                if (row.isAnswered()) {
                                    if (scrollCache.contain.next() !== false) {
                                        that.scrollHelper();
                                    } else {
                                        // Limit Reached
                                        if (that._navNextCallBack) { that._navNextCallBack(); }
                                        if (that.qStudioVar.dcProxy) {
                                            that.qStudioVar.dcProxy.removeComponentBackButton(that.qStudioVar.compBackBtn);
                                            that.qStudioVar.dcProxy.removeComponentNextButton(that.qStudioVar.compNextBtn);
                                            that.qStudioVar.dcProxy.next();
                                        }
                                    }
                                }
                            } else {
                                isTouchMove = false;
                            }
                        } else {
                            isTouchMove = true;
                        }
                    });
                }

                else if (setCache.contain) {
                    $(nextNode).on(tapEvent, function(event) {
                        event.stopImmediatePropagation();
                        if (that.qStudioVar.dcProxy && (event.type === "mousedown" || event.type === "click")) {
                            event.preventDefault();
                            $(this).css({ opacity : (this.enabled) ? 1 : 0.35 });
                        }

                        if (this.enabled === false) { return; }
                        if (event.type !== "touchmove") {
                            if (event.type !== 'mousedown' && event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                                if (isTouchMove) { return; }
                                var setIndex = setCache.contain.setIndex();
                                if (setCache.setRefArray[setIndex].isAnswered) {
                                    if (setCache.contain.next() === false) {
                                        // Limit Reached
                                        if (that._navNextCallBack) { that._navNextCallBack(); }
                                        if (that.qStudioVar.dcProxy) {
                                            that.qStudioVar.dcProxy.removeComponentBackButton(that.qStudioVar.compBackBtn);
                                            that.qStudioVar.dcProxy.removeComponentNextButton(that.qStudioVar.compNextBtn);
                                            that.qStudioVar.dcProxy.next();
                                        }
                                    } else {
                                        that.toggleNavBtns();
                                    }
                                }
                            } else {
                                isTouchMove = false;
                            }
                        } else {
                            isTouchMove = true;
                        }
                    });
                }
            }
        },

        // Back Button binding for Scroll and Set Containers
        bindNavBack: function(backNode, callback) {
            if (callback && typeof callback === 'function') {
                this._navBackCallBack = callback;
            }

            if (backNode && backNode.nodeType === 1) {
                this.qStudioVar.compBackBtn = backNode;
                var that = this,
                    scrollCache = this._scrollLayoutCache,
                    setCache = this._setLayoutCache,
                    tapEvent = (!QUtility.isMSTouch()) ?
                        ((!QUtility.isTouchDevice()) ? "click.scrollmatrix mousedown.scrollmatrix" : "touchstart.scrollmatrix touchend.scrollmatrix touchmove.scrollmatrix"):
                        ((!QUtility.isTouchDevice()) ? "click.scrollmatrix mousedown.scrollmatrix" : ((window.PointerEvent) ? "pointerdown.scrollmatrix pointerup.scrollmatrix" : "MSPointerDown.scrollmatrix MSPointerUp.scrollmatrix")),
                    isTouchMove = false;

                if (scrollCache.contain) {
                    $(backNode).on(tapEvent, function(event) {
                        event.stopImmediatePropagation();
                        if (that.qStudioVar.dcProxy && (event.type === "mousedown" || event.type === "click")) {
                            event.preventDefault();
                            $(this).css({ opacity : (this.enabled) ? 1 : 0.35 });
                        }

                        if (scrollCache.isScrolling || this.enabled === false) { return; }
                        if (event.type !== "touchmove") {
                            if (event.type !== 'mousedown' && event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                                if (isTouchMove) { return; }
                                if (scrollCache.contain.back() !== false) {
                                    that.scrollHelper();
                                } else {
                                    // Limit Reached
                                    if (that._navBackCallBack) { that._navBackCallBack(); }
                                }
                            } else {
                                isTouchMove = false;
                            }
                        } else {
                            isTouchMove = true;
                        }
                    });
                }

                else if (setCache.contain) {
                    $(backNode).on(tapEvent, function(event) {
                        event.stopImmediatePropagation();
                        if (that.qStudioVar.dcProxy && (event.type === "mousedown" || event.type === "click")) {
                            event.preventDefault();
                            $(this).css({ opacity : (this.enabled) ? 1 : 0.35 });
                        }

                        if (this.enabled === false) { return; }
                        if (event.type !== "touchmove") {
                            if (event.type !== 'mousedown' && event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                                if (isTouchMove) { return; }
                                if (setCache.contain.back() === false) {
                                    // Limit Reached
                                    if (that._navBackCallBack) { that._navBackCallBack(); }
                                } else {
                                    that.toggleNavBtns();
                                }
                            } else {
                                isTouchMove = false;
                            }
                        } else {
                            isTouchMove = true;
                        }
                    });
                }
            }
        },

        toggleNavBtns : function() {
            if (!this.qStudioVar.dcProxy) { return; }
            var compNextBtn = this.qStudioVar.compNextBtn,
                compBackBtn = this.qStudioVar.compBackBtn,
                scrollCache = this._scrollLayoutCache,
                setCache = this._setLayoutCache;

            if (!scrollCache.contain && !setCache.contain) { return; }
            var index = (scrollCache.contain) ?
                    scrollCache.contain.scrollIndex() : setCache.contain.setIndex(),
                isAnswered = (scrollCache.contain) ?
                    this.qStudioVar.respRef[index].row.isAnswered() : setCache.setRefArray[index].isAnswered;

            if (compBackBtn) {
                compBackBtn.enabled = (index !== 0);
                compBackBtn.style.cursor = (compBackBtn.enabled) ? "pointer" : "default";
                $(compBackBtn).css({ opacity : (compBackBtn.enabled) ? 1 : 0.35 });
                if (!QUtility.isTouchDevice()) {
                    if (compBackBtn.enabled) {
                        $(compBackBtn).off("mouseenter.slidermatrix mouseleave.slidermatrix");
                    } else {
                        $(compBackBtn).on("mouseenter.slidermatrix mouseleave.slidermatrix", function(event) {
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
                        $(compNextBtn).off("mouseenter.slidermatrix mouseleave.slidermatrix");
                    } else {
                        $(compNextBtn).on("mouseenter.slidermatrix mouseleave.slidermatrix", function(event) {
                            event.preventDefault();
                            event.stopPropagation();
                            $(compNextBtn).css({ opacity : 0.35});
                        });
                    }
                }
            }
        },

        /*
         * Call to create a group parameter objects -- accepted values are 'rowcontain', 'rowbtn', 'colcontain' 'colsldr' and 'colbtn'.
         * @param wgtref{String} - parameter property indicating which group return parameter object applies to.
         * @return {Object} - group of parameter objects
         */
        paramObj: function(wgtref) {
            var params = this.qStudioVar.params,
                retParam = {};

            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    if (params[key].wgtref && params[key].wgtref.toLowerCase().indexOf(wgtref) !== -1) {
                        retParam[params[key].wgtname] = params[key].value;
                    }
                }
            }

            return retParam;
        },

        isRowTypeValid: function(value) {
            if (typeof value === "string" && jQuery.trim(value).length !== 0) {
                var len = this.qStudioVar.rowAcceptedWgts.length,
                    matchFound = false;

                for (var i=len; i--;) {
                    if (value === this.qStudioVar.rowAcceptedWgts[i]) {
                        matchFound = true;
                        break;
                    }
                }

                return matchFound;
            }

            return false;
        },

        isColTypeValid: function(value) {
            if (typeof value === "string" && jQuery.trim(value).length !== 0) {
                var len = this.qStudioVar.colAcceptedWgts.length,
                    matchFound = false;

                for (var i=len; i--;) {
                    if (value === this.qStudioVar.colAcceptedWgts[i]) {
                        matchFound = true;
                        break;
                    }
                }

                return matchFound;
            }

            return false;
        },

        // Call to create component element
        create: function(parent) {
            // Used in conjunction w/ component Controller
            this.qStudioVar.respRef = [];
            this._scrollLayoutCache = {
                timeout: null,
                isScrolling: false,
                contain: null
            };
            this._setLayoutCache = {
                setRefArray: [],
                contain: null
            };

            // Auto-set compRTL parameter based on Survey Platform RTL settings
            if (QUtility.isSurveyRTL()) {
                this.qStudioVar.params.compRTL.value = true;
            }

            // Disable RTL in QStudio Component Creation Window due to positioning issues
            this.qStudioVar.isCompRTL =
                (!(parent && parent.id === "componentDemoContainer")) ? this.qStudioVar.params.compRTL.value : false;

            var that = this,
                doc = document,
                scrollCache = this._scrollLayoutCache,
                setCache = this._setLayoutCache,
                interact = this.qStudioVar.interact,
                rowArray = this.qStudioVar.rowArray,
                columnArray = this.qStudioVar.columnArray,
                respRef = this.qStudioVar.respRef,
                params = this.qStudioVar.params,
                rowContainType = params.rowContainType.value.toLowerCase(),
                rowContainConfigObj = this.paramObj('rowcontain'),
                rowBtnConfigObj = this.paramObj('rowbtn'),
                colContainType = params.colContainType.value.toLowerCase(),
                colContainConfigObj = this.paramObj('colcontain'),
                colSldrConfigObj = this.paramObj('colsldr'),
                colBtnConfigObj = this.paramObj('colbtn'),
                toolTipConfigObj = this.paramObj('tooltip'),
                ctzConfigObj = this.paramObj('ctz'),
                touchEnabled = QUtility.isTouchDevice(),
                isMSTouch = QUtility.isMSTouch(),
                rowInitAlpha = params.rowContainChldInitAlpha.value,
                goOpaque = params.rowContainGoOpaque.value,
                isSetLayout = (rowContainType.indexOf("set") !== -1),
                sldrColumnArray = [],
                btnColumnArray = [],
                sldrTickLabDispType = params.colSldrTickLabDispType.value.toLowerCase(),
                numOfTicks = (sldrTickLabDispType !== "show three") ?
                    ((params.colSldrTickLabCustomCnt.value >= 1) ? params.colSldrTickLabCustomCnt.value : 1) : 3,
                overrideTicks = (sldrTickLabDispType === "custom" || sldrTickLabDispType === "show three"),
                tickIncrem = 0,
                tickLabArray = [],
                rowContainBckgrndDispType = params.rowContainBckgrndDispType.value.toLowerCase(),
                colContainBckgrndDispType = params.colContainBckgrndDispType.value.toLowerCase(),
                rowSyncTxtBtnHeight = (params.rowTxtBtnAdjustHeightType.value === "all"),
                rowSyncTxtBtnArray = [],
                rowMaxTxtBtnHeight = 0,
                colSyncTxtBtnHeight = (params.colTxtBtnAdjustHeightType.value === "all"),
                colSyncTxtBtnArray = [],
                colMaxTxtBtnHeight = 0,
                compContain = null;

            // Split Button and Slider Column Objects
            var btnFound = false;
            for (var i=0, clen=columnArray.length; i<clen; i+=1) {
                var colWgtType = jQuery.trim(columnArray[i].var1 || columnArray[i].type);
                if (colWgtType) {
                    colWgtType = colWgtType.toString().toLowerCase();
                    for (var j=0, len=this.qStudioVar.colAcceptedWgts.length; j<len; j+=1) {
                        if (colWgtType === this.qStudioVar.colAcceptedWgts[j].toLowerCase()) {
                            btnColumnArray = columnArray.slice(i);
                            btnFound = true;
                            break;
                        }
                    }

                    if (btnFound) { break; }
                }

                if (!btnFound) {
                    tickLabArray.push("");
                    sldrColumnArray.push(columnArray[i]);
                }
            }

            this.qStudioVar.sliderArray = sldrColumnArray;
            this.qStudioVar.btnArray = btnColumnArray;
            // Default question type to 'Single Choice' if no buttons are present
            if (btnColumnArray.length === 0) { params.compQuestionType.value = 'Single Choice'; }

            // Throw error if no Sliders are present
            if (sldrColumnArray.length === 0) { throw ("No Sliders present."); }

            // Create slider tick labels
            for (var i=0; i<sldrColumnArray.length; i+=1) {
                tickLabArray[i] = { label: "", image: sldrColumnArray[i].image };
            }
            tickIncrem = (numOfTicks > 1) ? (sldrColumnArray.length-1)/(numOfTicks-1) : 1;
            overrideTicks = (overrideTicks && (tickIncrem >= 1));
            if (overrideTicks) {
                for (var i=0; i<numOfTicks; i+=1) {
                    var index = Math.round(i*tickIncrem);
                    tickLabArray[index].label = sldrColumnArray[index].label;
                }
            }

            // Init External Widgets
            toolTipConfigObj.isRTL = that.qStudioVar.isCompRTL;
            QStudioCompFactory.lightBoxFactory("basic", doc.body, ctzConfigObj);
            QStudioCompFactory.toolTipFactory("", doc.body, toolTipConfigObj);
            QStudioCompFactory.msgDisplayFactory("", {
                errormsg_width: params.colOtherMsgWidth.value,
                errormsg_fontsize: 14,
                errormsg_fontcolor: 0xFF0000,
                errormsg_halign: "left",
                isRTL: that.qStudioVar.isCompRTL
            });

            // Row Container settings
            rowContainConfigObj.id = "QRowContainer";
            rowContainConfigObj.isRTL = that.qStudioVar.isCompRTL;
            rowContainConfigObj.show_bckgrnd = (rowContainBckgrndDispType === "vector");
            rowContainConfigObj.show_bckgrnd_import = (rowContainBckgrndDispType === "import");
            rowContainConfigObj.direction = (rowContainType.indexOf("vertical") !== -1) ? "vertical" : "horizontal";

            // Row Button settings
            rowBtnConfigObj.isRTL = that.qStudioVar.isCompRTL;
            rowBtnConfigObj.txtbtn_trim = (params.rowTxtBtnAdjustHeightType.value !== "none");

            // Column Container settings
            colContainConfigObj.id = "QColumnContainer";
            colContainConfigObj.isRTL = that.qStudioVar.isCompRTL;
            colContainConfigObj.direction = (colContainType.indexOf("vertical") !== -1) ? "vertical" : "horizontal";
            colContainConfigObj.position = "relative";
            colContainConfigObj.autoWidth = true;
            colContainConfigObj.autoHeight = true;
            colContainConfigObj.show_bckgrnd = (colContainBckgrndDispType === "vector");
            colContainConfigObj.show_bckgrnd_import = (colContainBckgrndDispType === "import");

            // Column Slider settings
            colSldrConfigObj.isRTL = that.qStudioVar.isCompRTL;

            // Column Button settings
            colBtnConfigObj.isRTL = that.qStudioVar.isCompRTL;
            colBtnConfigObj.txtbtn_trim = (params.colTxtBtnAdjustHeightType.value !== "none");

            // Component Container CSS Style
            compContain = doc.createElement("div");
            compContain.id = "SliderMatrixComponent";
            compContain.dir = (!that.qStudioVar.isCompRTL) ? 'ltr' :'rtl';
            compContain.className = "qslidermatrix_component";
            compContain.style.position = params.compContainPos.value;
            compContain.style.width = "100%";
            compContain.style.height = "100%";
            parent = (parent && parent.nodeType === 1) ? parent : doc.body;
            parent.appendChild(compContain);

            if (touchEnabled) {
                // To ensure open-ended widgets lose focus when user taps somewhere besides textarea
                $(doc.body).on((!isMSTouch) ? "touchstart.slidermatrix" : (window.PointerEvent) ? "pointerdown.slidermatrix" : "MSPointerDown.slidermatrix", function() {
                    document.activeElement.blur();
                });
            }

            // Create Default Matrix
            var createDefMatrix = function() {
                var rowContain = QStudioCompFactory.layoutFactory(
                        rowContainType.substr(0, rowContainType.indexOf('layout')-1),
                        compContain,
                        rowContainConfigObj
                    ),
                    horzContain = null,
                    colContain = null,
                    horzCntConfigObj = {
                        position: "relative",
                        border_width: 0,
                        show_bckgrnd: false,
                        padding: 0,
                        hgap: 35,
                        vgap: 0,
                        autoHeight: true,
                        autoWidth: true,
                        isRTL : that.qStudioVar.isCompRTL
                    };

                // Add Row Widgets to Row Container
                for (var i=0, rlen=rowArray.length; i<rlen; i+=1) {
                    /**
                     * horzContain wraps both a row and its corresponding columns. horzContain is then added to rowContain
                     */
                    var userDefType = jQuery.trim(rowArray[i].var1 || rowArray[i].type).toLowerCase(),
                        rowBtnType = params.rowBtnDefaultType.value,
                        rowWgt = null;

                    horzContain = QStudioCompFactory.layoutFactory(
                        colSldrConfigObj.direction,
                        compContain,
                        horzCntConfigObj
                    );

                    colContain = QStudioCompFactory.layoutFactory(
                        colContainType.substr(0, colContainType.indexOf('layout')-1),
                        compContain,
                        colContainConfigObj
                    );

                    // Create Column Slider & Bind to Column Container
                    colSldrConfigObj.rowIndex = i;
                    colSldrConfigObj.id = 'col_sldr';
                    if (params.colSldrHndleShowImg.value) { colSldrConfigObj.image = rowArray[i].image; }
                    colSldrConfigObj.tick_array = (!overrideTicks) ? sldrColumnArray : tickLabArray;
                    var colSldr = QStudioCompFactory.widgetFactory(
                        'baseslider',
                        compContain,
                        colSldrConfigObj
                    );

                    // Set whether slider should be enabled determined via render state.
                    colSldr.enabled((!isSetLayout) ?
                        interact : (i > 0) ? (rowInitAlpha===100) : true, (i > 0) ? rowInitAlpha : 100
                    );

                    // Add slider to column container
                    if (!colSyncTxtBtnHeight) { colContain.add(colSldr); }

                    // Create 'rowIndex' attribute for column widget
                    colSldr.widget().setAttribute('rowIndex', i.toString());

                    // Add callback function to fire after slider handle mouse up
                    (function(sldr) {
                        sldr.slideEnd(function() {
                            that.manageSlide(sldr);
                        });
                    }(colSldr));

                    // Set user defined type, but make sure its one of the accepted values
                    if (that.isRowTypeValid(userDefType)) { rowBtnType = userDefType; }

                    rowBtnConfigObj.rowIndex = i;
                    rowBtnConfigObj.id = rowArray[i].id || 'row_'+i;
                    rowBtnConfigObj.label = rowArray[i].label;
                    rowBtnConfigObj.description = rowArray[i].description;
                    rowBtnConfigObj.image = rowArray[i].image;
                    rowBtnConfigObj.width = rowArray[i].width || params.rowBtnWidth.value;
                    rowBtnConfigObj.height = rowArray[i].height || params.rowBtnHeight.value;
                    rowBtnConfigObj.show_bckgrnd_import = (typeof rowArray[i].showImpBckgrnd === 'boolean') ?
                        rowArray[i].showImpBckgrnd : params.rowBckgrndShowImp.value;
                    rowBtnConfigObj.bckgrnd_import_up = rowArray[i].bckgrndUp || params.rowBckgrndImpUp.value;
                    rowBtnConfigObj.bckgrnd_import_down = rowArray[i].bckgrndDown || params.rowBckgrndImpDown.value;
                    rowBtnConfigObj.use_tooltip = (typeof rowArray[i].useTooltip === 'boolean') ?
                        rowArray[i].useTooltip : params.rowBtnUseTooltip.value;
                    rowBtnConfigObj.use_lightbox = (typeof rowArray[i].useZoom === 'boolean') ?
                        rowArray[i].useZoom : params.rowBtnUseZoom.value;

                    // If row button is label only, preset a textbtn widget
                    if (rowBtnType.toLowerCase() === "label only") {
                        rowBtnType = "text";
                        rowBtnConfigObj.txtbtn_trim = true;
                        rowBtnConfigObj.show_bckgrnd = false;
                        rowBtnConfigObj.padding = 0;
                        rowBtnConfigObj.border_width = 0;
                        rowBtnConfigObj.label_halign = "right";
                    }

                    // Create Row Button Widget
                    rowWgt = QStudioCompFactory.widgetFactory(
                        rowBtnType,
                        compContain,
                        rowBtnConfigObj
                    );

                    // If set layout, disable all rows except for first. This requires respondents to answer the current row before moving onto the next.
                    // This can, however, be disabled if passed an alpha value of 100
                    if (isSetLayout) {
                        var setIndex = ((i - (i % params.rowContainSetRowPer.value))/params.rowContainSetRowPer.value);
                        if (i % params.rowContainSetRowPer.value !== 0) {
                            setCache.setRefArray[setIndex].rowCnt+=1;
                            rowWgt.enabled(false, {
                                alphaVal: rowInitAlpha,                            // if disabling, alpha value
                                goOpaque: goOpaque,                                // whether to enable opaque effect
                                enableExtEvt: (rowInitAlpha===100)                 // if we should allow external widget events such as tooltip and/or click to zoom if disabling
                            });
                        } else {
                            rowWgt.enabled(false, {
                                alphaVal: 100,                         // if disabling, alpha value
                                enableExtEvt: interact                 // if we should allow external widget events such as tooltip and/or click to zoom if disabling
                            });
                            setCache.setRefArray.push({
                                rowCnt: 1,          // Number of rows in the set
                                rowAnsCnt: 0,       // var to keep track of answered rows in a set
                                isAnswered: false,  // boolean flag to indicate whether all rows in a set have been answered
                                hasVisited: false   // boolean flag to indicate whether set has been visited (used to restrict autoNexting)
                            });
                        }
                    } else {
                        rowWgt.enabled(false, {
                            alphaVal: 100,                         // if disabling, alpha value
                            enableExtEvt: interact                 // if we should allow external widget events such as tooltip and/or click to zoom if disabling
                        });
                    }

                    // Check to see if user is on touch device and take appropriate action
                    rowWgt.touchEnabled(touchEnabled);

                    // Create 'rowIndex' attribute for row widget
                    rowWgt.widget().setAttribute('rowIndex', i.toString());

                    // Remove class name from row widget to not conflict w/ controller
                    rowWgt.widget().className = "";

                    // Set row widget CSS display prop
                    rowWgt.widget().style.display = (rowBtnType.toLowerCase() !== "none") ? "" : "none";

                    /**
                     * Create array object to use w/ component controller
                     */
                    respRef.push({
                        row: rowWgt,                        // Record row widget
                        horzContain: horzContain,           // Record horz container widget
                        colContain: colContain,             // Record column container widget
                        column: [colSldr],                  // Keeps track of row column widgets
                        sldrResp: {},                       // Keep track of slider responses
                        respArry: [],                       // Keeps track of selected row column widgets
                        oeRespArry: []                      // Keeps track of Other & Other Numeric column textarea inputs
                    });

                    // Add Column Widgets to Column Container
                    for (var j=0, clen=btnColumnArray.length; j<clen; j+=1) {
                        var userDefType = jQuery.trim(btnColumnArray[j].var1 || btnColumnArray[j].type).toLowerCase(),
                            isRadio = (btnColumnArray[j].var2 || btnColumnArray[j].isRadio),
                            colIndex = jQuery.inArray(btnColumnArray[j], columnArray),
                            colBtnType = params.colBtnDefaultType.value,
                            colWgt = null;

                        // Set user defined type, but make sure its one of the accepted values
                        if (that.isColTypeValid(userDefType)) { colBtnType = userDefType; }

                        colBtnConfigObj.rowIndex = i;
                        colBtnConfigObj.colIndex = colIndex;
                        colBtnConfigObj.id = btnColumnArray[j].id || 'col_'+colIndex;
                        colBtnConfigObj.isRadio = (that.questionType() === 'single') ||
                            (isRadio && isRadio.toString().toLowerCase().indexOf("true") !== -1);
                        colBtnConfigObj.label = btnColumnArray[j].label;
                        colBtnConfigObj.description = btnColumnArray[j].description;
                        colBtnConfigObj.image = btnColumnArray[j].image;
                        colBtnConfigObj.width = btnColumnArray[j].width || params.colBtnWidth.value;
                        colBtnConfigObj.height = btnColumnArray[j].height || params.colBtnHeight.value;
                        colBtnConfigObj.show_bckgrnd_import = (typeof btnColumnArray[j].showImpBckgrnd === 'boolean') ?
                            btnColumnArray[j].showImpBckgrnd : ((!colBtnConfigObj.isRadio) ? params.colChkShowImp.value : params.colRadShowImp.value);
                        colBtnConfigObj.bckgrnd_import_up = btnColumnArray[j].bckgrndUp ||
                            ((!colBtnConfigObj.isRadio) ? params.colChkImpUp.value : params.colRadImpUp.value);
                        colBtnConfigObj.bckgrnd_import_over = btnColumnArray[j].bckgrndOver ||
                            ((!colBtnConfigObj.isRadio) ? params.colChkImpOver.value : params.colRadImpOver.value);
                        colBtnConfigObj.bckgrnd_import_down = btnColumnArray[j].bckgrndDown ||
                            ((!colBtnConfigObj.isRadio) ? params.colChkImpDown.value : params.colRadImpDown.value);
                        colBtnConfigObj.use_tooltip = (typeof btnColumnArray[j].useTooltip === 'boolean') ?
                            btnColumnArray[j].useTooltip : params.colBtnUseTooltip.value;
                        colBtnConfigObj.use_lightbox = (typeof btnColumnArray[j].useZoom === 'boolean') ?
                            btnColumnArray[j].useZoom : params.colBtnUseZoom.value;

                        // Create Row Button Widget
                        colWgt = QStudioCompFactory.widgetFactory(
                            colBtnType,
                            compContain,
                            colBtnConfigObj
                        );

                        // If set layout, disable all row columns except for first. This requires respondents to answer the current row before moving onto the next.
                        // This can, however, be disabled if passed an alpha value of 100
                        if (isSetLayout && (i % params.rowContainSetRowPer.value !== 0)) {
                            colWgt.enabled(((rowInitAlpha === 100) && interact), {
                                alphaVal: rowInitAlpha,                            // if disabling, alpha value
                                goOpaque: goOpaque                                 // if disabling, whether to enable opaque effect
                            });
                        } else {
                            colWgt.enabled(interact, { alphaVal: 100 });
                        }

                        // Check to see if user is on touch device and take appropriate action
                        colWgt.touchEnabled(touchEnabled);

                        // Create 'rowIndex' attribute for column widget
                        colWgt.widget().setAttribute('rowIndex', i.toString());

                        // Create 'colIndex' attribute for column widget
                        colWgt.widget().setAttribute('colIndex', colIndex.toString());

                        // Store reference of column widget w/ controller array object
                        respRef[i].column[colIndex] = colWgt;

                        if (!colSyncTxtBtnHeight) {
                            // Add column widget to colContain
                            colContain.add(colWgt, !!btnColumnArray[j].ownRow);
                        } else {
                            if (colBtnType.toLowerCase() === "text") {
                                colSyncTxtBtnArray[colIndex] = colWgt;
                                // Record wigdet max height
                                colMaxTxtBtnHeight = Math.max(colMaxTxtBtnHeight, $(colWgt.widget()).outerHeight());
                            }
                        }
                    }

                    if (colSldrConfigObj.direction !== "vertical") {
                        if (!rowSyncTxtBtnHeight && !colSyncTxtBtnHeight) {
                            if (rowWgt.widget().style.display !== "none") { horzContain.add(rowWgt); }
                            horzContain.add(colContain.container());
                            rowContain.add(horzContain.container());
                        } else {
                            if (rowBtnType.toLowerCase() === "text") {
                                rowSyncTxtBtnArray[i] = rowWgt;
                                // Record wigdet max height
                                rowMaxTxtBtnHeight = Math.max(rowMaxTxtBtnHeight, $(rowWgt.widget()).outerHeight());
                            }
                        }
                    } else {
                        if (rowSyncTxtBtnHeight && rowBtnType.toLowerCase() === "text") {
                            rowSyncTxtBtnArray[i] = rowWgt;
                            // Record wigdet max height
                            rowMaxTxtBtnHeight = Math.max(rowMaxTxtBtnHeight, $(rowWgt.widget()).outerHeight());
                        }

                        if (!rowSyncTxtBtnHeight && !colSyncTxtBtnHeight) {
                            horzContain.add(colContain.container());
                            if (rowWgt.widget().style.display !== "none") { horzContain.add(rowWgt); }
                            rowContain.add(horzContain.container());
                        }
                    }
                }

                if (rowSyncTxtBtnHeight || colSyncTxtBtnHeight) {
                    for (var i=0, rlen=rowArray.length; i<rlen; i+=1) {
                        var horzContain = respRef[i].horzContain,
                            colContain = respRef[i].colContain,
                            rowWgt = respRef[i].row;

                        if (rowSyncTxtBtnArray[i]) {
                            rowWgt.config({
                                height : rowMaxTxtBtnHeight,
                                txtbtn_trim : false
                            });
                        }

                        for (var j=0, clen=columnArray.length; j<clen; j+=1) {
                            var colWgt = respRef[i].column[j];
                            if (colSyncTxtBtnArray[j]) {
                                colWgt.config({
                                    height : colMaxTxtBtnHeight,
                                    txtbtn_trim : false
                                });
                            }

                            // Add column widget to colContain
                            colContain.add(colWgt, !!columnArray[j].ownRow);
                        }

                        if (colSldrConfigObj.direction !== "vertical") {
                            if (rowWgt.widget().style.display !== "none") { horzContain.add(rowWgt); }
                            horzContain.add(colContain.container());
                            rowContain.add(horzContain.container());
                        } else {
                            horzContain.add(colContain.container());
                            if (rowWgt.widget().style.display !== "none") { horzContain.add(rowWgt); }
                            rowContain.add(horzContain.container());
                        }
                    }
                }

                // If set layout, record reference to layout
                if (isSetLayout) {
                    setCache.contain = rowContain;
                    // Take Control of QStudio Next/Back button to navigate Scrolling container
                    if (that.qStudioVar.dcProxy) {
                        that.qStudioVar.dcProxy.hideNextButton();
                        that.qStudioVar.dcProxy.hideBackButton();
                        that.bindNavNext(that.qStudioVar.dcProxy.createComponentNextButton());
                        that.bindNavBack(that.qStudioVar.dcProxy.createComponentBackButton());
                        that.toggleNavBtns();
                    }
                }

                // Add MOUSE CLICK, TOUCHSTART, & TOUCHEND EVENTS
                var eventStr = (!isMSTouch) ?
                        ((!touchEnabled) ? "click.slidermatrix" : "touchstart.slidermatrix touchend.slidermatrix touchmove.slidermatrix"):
                        ((!touchEnabled) ? "click.slidermatrix" : ((window.PointerEvent) ? "pointerdown.slidermatrix pointerup.slidermatrix" : "MSPointerDown.slidermatrix MSPointerUp.slidermatrix")),
                    txtEvent = ("oninput" in compContain) ? "input.slidermatrix" : "keyup.slidermatrix",
                    isTouchMove = false;

                $(compContain).on(eventStr, '.qwidget_button', function(event) {
                    event.stopPropagation();
                    var rowIndex = parseInt(event.currentTarget.getAttribute('rowIndex'), 10),
                        colIndex = parseInt(event.currentTarget.getAttribute('colIndex'), 10),
                        row = respRef[rowIndex].row,
                        col = respRef[rowIndex].column[colIndex],
                        controllerBool = null;

                    if (isMSTouch && touchEnabled && !event.originalEvent.isPrimary) { return; }
                    if (!col.enabled()) { return; }
                    if (event.type !== "touchmove") {
                        if (event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                            if (isTouchMove) { return; }
                            controllerBool = that.manageClick(col);
                            if (typeof controllerBool === 'boolean' && controllerBool !== row.isAnswered()) {
                                row.isAnswered(controllerBool);
                                if (isSetLayout) { that.setHelper(row); }
                            }
                        } else {
                            isTouchMove = false;
                        }
                    } else {
                        isTouchMove = true;
                    }
                });

                // Add CHANGE EVENT
                $(compContain).on(txtEvent, '.qwidget_button', function(event) {
                    var rowIndex = parseInt(event.currentTarget.getAttribute('rowIndex'), 10),
                        colIndex = parseInt(event.currentTarget.getAttribute('colIndex'), 10),
                        row = respRef[rowIndex].row,
                        col = respRef[rowIndex].column[colIndex],
                        controllerBool = null;

                    if (!col.enabled() || !col.isOther()) { return; }
                    controllerBool = that.manageChange(col);
                    if (typeof controllerBool === 'boolean' && controllerBool !== row.isAnswered()) {
                        row.isAnswered(controllerBool);
                        if (isSetLayout) { that.setHelper(row); }
                    }
                });
            };

            // Create Scroll Matrix
            var createScrollMatrix = function() {
                // Column Container Creation
                colContainConfigObj.position = "relative";
                var colWgtArray = [],
                    colContain = QStudioCompFactory.layoutFactory(
                        colContainType.substr(0, colContainType.indexOf('layout')-1),
                        compContain,
                        colContainConfigObj
                    );

                // Create Column Slider & Bind to Column Container
                colSldrConfigObj.id = 'col_sldr';
                colSldrConfigObj.image = rowArray[0].image;
                colSldrConfigObj.tick_array = (!overrideTicks) ? sldrColumnArray : tickLabArray;
                var colSldr = QStudioCompFactory.widgetFactory(
                    'baseslider',
                    compContain,
                    colSldrConfigObj
                );

                // Add callback function to fire after slider handle mouse up
                colSldr.slideEnd(function() {
                    that.manageSlide(colSldr);
                });

                // Set whether slider should be enabled determined via render state.
                colSldr.enabled(interact, 100);

                // Add slider to column container
                if (!colSyncTxtBtnHeight) { colContain.add(colSldr); }

                // Record reference of column slider to add to controller array object
                colWgtArray[0] = colSldr;

                for (var j=0, clen=btnColumnArray.length; j<clen; j+=1) {
                    var userDefType = jQuery.trim(btnColumnArray[j].var1 || btnColumnArray[j].type).toLowerCase(),
                        isRadio = (btnColumnArray[j].var2 || btnColumnArray[j].isRadio),
                        colBtnType = params.colBtnDefaultType.value,
                        colIndex = jQuery.inArray(btnColumnArray[j], columnArray),
                        colWgt = null;

                    // Set user defined type, but make sure its one of the accepted values
                    if (that.isColTypeValid(userDefType)) { colBtnType = userDefType; }

                    colBtnConfigObj.colIndex = colIndex;
                    colBtnConfigObj.id = btnColumnArray[j].id || 'col_'+colIndex;
                    colBtnConfigObj.isRadio = (that.questionType() === 'single') ||
                        (isRadio && isRadio.toString().toLowerCase().indexOf("true") !== -1);
                    colBtnConfigObj.label = btnColumnArray[j].label;
                    colBtnConfigObj.description = btnColumnArray[j].description;
                    colBtnConfigObj.image = btnColumnArray[j].image;
                    colBtnConfigObj.width = btnColumnArray[j].width || params.colBtnWidth.value;
                    colBtnConfigObj.height = btnColumnArray[j].height || params.colBtnHeight.value;
                    colBtnConfigObj.show_bckgrnd_import = (typeof btnColumnArray[j].showImpBckgrnd === 'boolean') ?
                        btnColumnArray[j].showImpBckgrnd : ((!colBtnConfigObj.isRadio) ? params.colChkShowImp.value : params.colRadShowImp.value);
                    colBtnConfigObj.bckgrnd_import_up = btnColumnArray[j].bckgrndUp ||
                        ((!colBtnConfigObj.isRadio) ? params.colChkImpUp.value : params.colRadImpUp.value);
                    colBtnConfigObj.bckgrnd_import_over = btnColumnArray[j].bckgrndOver ||
                        ((!colBtnConfigObj.isRadio) ? params.colChkImpOver.value : params.colRadImpOver.value);
                    colBtnConfigObj.bckgrnd_import_down = btnColumnArray[j].bckgrndDown ||
                        ((!colBtnConfigObj.isRadio) ? params.colChkImpDown.value : params.colRadImpDown.value);
                    colBtnConfigObj.use_tooltip = (typeof btnColumnArray[j].useTooltip === 'boolean') ?
                        btnColumnArray[j].useTooltip : params.colBtnUseTooltip.value;
                    colBtnConfigObj.use_lightbox = (typeof btnColumnArray[j].useZoom === 'boolean') ?
                        btnColumnArray[j].useZoom : params.colBtnUseZoom.value;

                    // Create Row Button Widget
                    colWgt = QStudioCompFactory.widgetFactory(
                        colBtnType,
                        compContain,
                        colBtnConfigObj
                    );

                    // Set whether column should be enabled determined via render state.
                    colWgt.enabled(interact, { alphaVal: 100 });

                    // Check to see if user is on touch device and take appropriate action
                    colWgt.touchEnabled(touchEnabled);

                    // Create 'colIndex' attribute for column widget
                    colWgt.widget().setAttribute('colIndex', colIndex.toString());

                    // Record reference of column widget to use w/ controller array object
                    colWgtArray[colIndex] = colWgt;

                    if (!colSyncTxtBtnHeight) {
                        // Add column widget to colContain
                        colContain.add(colWgt, !!btnColumnArray[j].ownRow);
                    } else {
                        if (colBtnType.toLowerCase() === "text") {
                            colSyncTxtBtnArray[colIndex] = colWgt;
                            // Record wigdet max height
                            colMaxTxtBtnHeight = Math.max(colMaxTxtBtnHeight, $(colWgt.widget()).outerHeight());
                        }
                    }
                }

                // Row Container Creation
                rowContainConfigObj.position = "relative";
                rowContainConfigObj.left +=  colContainConfigObj.left;
                var rowContain = QStudioCompFactory.layoutFactory(
                        "scroll",
                        compContain,
                        rowContainConfigObj
                    ),
                    firstRowHeight = null;

                // Record reference of rowContain
                scrollCache.contain = rowContain;

                // Move row container in front of column container (stacking context)
                compContain.insertBefore(rowContain.container(), colContain.container());

                // Add Row Widgets to Row Container
                for (var i=0, rlen=rowArray.length; i<rlen; i+=1) {
                    var userDefType = jQuery.trim(rowArray[i].var1 || rowArray[i].type).toLowerCase(),
                        rowBtnType = params.rowBtnDefaultType.value,
                        rowWgt = null;

                    // Set user defined type, but make sure its one of the accepted values
                    if (that.isRowTypeValid(userDefType)) { rowBtnType = userDefType; }

                    rowBtnConfigObj.rowIndex = i;
                    rowBtnConfigObj.id = rowArray[i].id || 'row_'+i;
                    rowBtnConfigObj.label = rowArray[i].label;
                    rowBtnConfigObj.description = rowArray[i].description;
                    rowBtnConfigObj.image = rowArray[i].image;
                    rowBtnConfigObj.width = rowArray[i].width || params.rowBtnWidth.value;
                    rowBtnConfigObj.height = rowArray[i].height || params.rowBtnHeight.value;
                    rowBtnConfigObj.show_bckgrnd_import = (typeof rowArray[i].showImpBckgrnd === 'boolean') ?
                        rowArray[i].showImpBckgrnd : params.rowBckgrndShowImp.value;
                    rowBtnConfigObj.bckgrnd_import_up = rowArray[i].bckgrndUp || params.rowBckgrndImpUp.value;
                    rowBtnConfigObj.bckgrnd_import_down = rowArray[i].bckgrndDown || params.rowBckgrndImpDown.value;
                    rowBtnConfigObj.use_tooltip = (typeof rowArray[i].useTooltip === 'boolean') ?
                        rowArray[i].useTooltip : params.rowBtnUseTooltip.value;
                    rowBtnConfigObj.use_lightbox = (typeof rowArray[i].useZoom === 'boolean') ?
                        rowArray[i].useZoom : params.rowBtnUseZoom.value;

                    // If row button is label only, preset a textbtn widget
                    if (rowBtnType.toLowerCase() === "label only") {
                        rowBtnType = "text";
                        rowBtnConfigObj.txtbtn_trim = true;
                        rowBtnConfigObj.show_bckgrnd = false;
                        rowBtnConfigObj.padding = 0;
                        rowBtnConfigObj.border_width = 0
                    }

                    // Create Row Button Widget
                    rowWgt = QStudioCompFactory.widgetFactory(
                        rowBtnType,
                        compContain,
                        rowBtnConfigObj
                    );

                    // If interact boolean flag is false, disable external events on row widget as it is set to true by default
                    if (i === 0) {
                        if (!interact) {
                            rowWgt.enabled(false, {
                                alphaVal: 100,
                                goOpaque: goOpaque,
                                enableExtEvt: false
                            });
                        }

                        firstRowHeight = $(rowWgt.widget()).outerHeight();
                    }

                    // Remove class name from row widget to not conflict w/ controller
                    rowWgt.widget().className = "";

                    // Check to see if user is on touch device and take appropriate action
                    rowWgt.touchEnabled(touchEnabled);

                    /**
                     * Create array object to use w/ component controller
                     */
                    respRef.push({
                        row: rowWgt,            // Record row widget
                        column: colWgtArray,    // Keeps track of row column widgets
                        sldrResp: {},           // Keep track of slider responses
                        respArry: [],           // Keeps track of selected row column widgets
                        oeRespArry: []          // Keeps track of Other & Other Numeric column textarea inputs
                    });

                    if (!rowSyncTxtBtnHeight) {
                        // Add row widget to horzContain
                        rowContain.add(rowWgt);
                    } else {
                        if (rowBtnType.toLowerCase() === "text") {
                            rowSyncTxtBtnArray[i] = rowWgt;
                            // Record wigdet max height
                            rowMaxTxtBtnHeight = Math.max(rowMaxTxtBtnHeight, $(rowWgt.widget()).outerHeight());
                        }
                    }
                }

                if (rowSyncTxtBtnHeight || colSyncTxtBtnHeight) {
                    for (var j=0, clen=columnArray.length; j<clen; j+=1) {
                        var colWgt = colWgtArray[j];
                        if (colSyncTxtBtnArray[j]) {
                            colWgt.config({
                                height : colMaxTxtBtnHeight,
                                txtbtn_trim : false
                            });
                        }

                        // Add column widget to colContain
                        colContain.add(colWgt, !!columnArray[j].ownRow);
                    }

                    for (var i=0, rlen=rowArray.length; i<rlen; i+=1) {
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

                // Position column container depending on scroll direction
                var rowContainWidth = $(rowContain.cache().nodes.layoutContain).outerWidth(),
                    colContainWidth = $(colContain.cache().nodes.layoutContain).outerWidth();

                colContain.container().style.zIndex = 3000;
                compContain.insertBefore(rowContain.container(), colContain.container());

                (!that.qStudioVar.isCompRTL) ?
                    (rowContain.container().style.left = (colContainWidth*0.5) + "px"):
                    (rowContain.container().style.left = (rowContainWidth - (colContainWidth*0.5)) + "px");

                // Take Control of QStudio Next/Back button to navigate Scrolling container
                if (that.qStudioVar.dcProxy) {
                    that.qStudioVar.dcProxy.hideNextButton();
                    that.qStudioVar.dcProxy.hideBackButton();
                    that.bindNavNext(that.qStudioVar.dcProxy.createComponentNextButton());
                    that.bindNavBack(that.qStudioVar.dcProxy.createComponentBackButton());
                    that.toggleNavBtns();
                } else {
                    if (rowContainConfigObj.direction === "vertical") {
                        compContain.style.overflow = "hidden";
                    }
                }

                // Add MOUSE CLICK, TOUCHSTART, & TOUCHEND EVENTS
                var eventStr = (!isMSTouch) ?
                        ((!touchEnabled) ? "click.slidermatrix" : "touchstart.slidermatrix touchend.slidermatrix touchmove.slidermatrix"):
                        ((!touchEnabled) ? "click.slidermatrix" : ((window.PointerEvent) ? "pointerdown.slidermatrix pointerup.slidermatrix" : "MSPointerDown.slidermatrix MSPointerUp.slidermatrix")),
                    txtEvent = ("oninput" in compContain) ? "input.slidermatrix" : "keyup.slidermatrix",
                    isTouchMove = false;

                $(compContain).on(eventStr, '.qwidget_button', function(event) {
                    event.stopPropagation();
                    var rowIndex = scrollCache.contain.scrollIndex(),
                        colIndex = parseInt(event.currentTarget.getAttribute('colIndex'), 10),
                        row = respRef[rowIndex].row,
                        col = respRef[rowIndex].column[colIndex];

                    if (isMSTouch && touchEnabled && !event.originalEvent.isPrimary) { return; }
                    if (!col.enabled()) { return; }
                    if (event.type !== "touchmove") {
                        if (event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                            if (isTouchMove) { return; }
                            row.isAnswered(that.manageClick(col));
                            if (that.isAutoNextEnabled()) {
                                if (row.isAnswered()) {
                                    if ((scrollCache.contain.next() !== false)) {
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
                                that.toggleNavBtns();
                            }
                        } else {
                            isTouchMove = false;
                        }
                    } else {
                        isTouchMove = true;
                    }
                });

                // Add CHANGE EVENT
                $(compContain).on(txtEvent, '.qwidget_button', function(event) {
                    var rowIndex = scrollCache.contain.scrollIndex(),
                        colIndex = parseInt(event.currentTarget.getAttribute('colIndex'), 10),
                        row = respRef[rowIndex].row,
                        col = respRef[rowIndex].column[colIndex];

                    if (!col.enabled() || !col.isOther()) { return; }
                    row.isAnswered(that.manageChange(col));

                    if (that.isAutoNextEnabled()) {
                        if (row.isAnswered()) {
                            if ((scrollCache.contain.next() !== false)) {
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
                        that.toggleNavBtns();
                    }
                });
            };

            // Create appropriate matrix container
            (rowContainType.indexOf('scroll') === -1) ? createDefMatrix() : createScrollMatrix();

            // Garbage collect config objects
            rowContainConfigObj = null;
            colContainConfigObj = null;
            rowBtnConfigObj = null;
            colBtnConfigObj = null;
            colSldrConfigObj = null;
        },

        scrollHelper: function() {
            var scrollCache = this._scrollLayoutCache,
                rowIndex = scrollCache.contain.scrollIndex(),
                rowRespObj = this.qStudioVar.respRef[rowIndex],
                sldr = rowRespObj.column[0],
                colArry = rowRespObj.column,
                otherInitTxt = this.qStudioVar.params.colOtherInitTxt.value,
                enableAlpha = this.qStudioVar.params.rowContainChldEnableAlpha.value,
                enableDelay = this.qStudioVar.params.rowContainScrlAnimSpeed.value,
                rlen = rowRespObj.respArry.length,
                clen = colArry.length;

            // Set slider handle image
            sldr._updateHandleImage(this.qStudioVar.rowArray[rowIndex].image);

            // Reset selected column widget(s) and temporarily disable
            if (scrollCache.isScrolling) { clearTimeout(scrollCache.timeout);}
            for (var i=0; i<clen; i+=1) {
                var colWgt = colArry[i];
                if (colWgt) {
                    if (rlen > 0 && colWgt.isAnswered()) { colWgt.isAnswered(false); }
                    if (colWgt.isOther && colWgt.isOther()) { colWgt.textarea(otherInitTxt); }
                    colWgt.enabled(false, { alphaVal: enableAlpha });
                }
            }

            // Set row responses
            if (rowRespObj.sldrResp.columnValue >= 0) {
                sldr.isAnswered(true, rowRespObj.sldrResp.location, false);
            } else {
                for (var i=0; i<rlen; i+=1) {
                    var colWgt = rowRespObj.respArry[i];
                    colWgt.isAnswered(true);
                    if (colWgt.isOther()) {
                        colWgt.textarea(rowRespObj.oeRespArry[colWgt.colIndex()]);
                    }
                }
            }

            // Re-enable column widget(s)
            if (enableDelay < 100) { enableDelay = 100; }
            scrollCache.isScrolling = true;
            scrollCache.timeout = setTimeout(function() {
                for (var i=0; i<clen; i+=1) {
                    var colWgt = colArry[i];
                    if (colWgt) {
                        if ((rlen === 0 && colWgt.type() === "button") ||
                            (!(rowRespObj.sldrResp.columnValue >= 0) && colWgt.type() === "slider"))  {
                            colWgt.isAnswered(false);
                        }
                        colWgt.enabled(true);
                    }
                }
                scrollCache.isScrolling = false;
            }, enableDelay);

            this.toggleNavBtns();
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
                                if (respRef[rowIndex].column[i]) {
                                    respRef[rowIndex].column[i].enabled(true, { goOpaque: goOpaque });
                                }
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
                            if (respRef[rowIndex].column[i]) {
                                respRef[rowIndex].column[i].enabled(true, { goOpaque: goOpaque });
                            }
                        }
                    }
                }

                if (autoNext && !setRefObj.hasVisited && setRefObj.isAnswered) {
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

            this.toggleNavBtns();
        },

        /*
         * Manage CLICK responses for Column Button Widgets
         * @param col {Object}: clicked column button widget
         * @param rIndex {Integer}: pass an optional row index value when setting responses (*used w/ Scroll Layout Containers)
         * @return {Boolean}: return true if column has been answered, false if unanswered
         */
        manageClick: function(col, rIndex) {
            // If method is passed a rIndex, we know its being called from setDimenResp
            rIndex = (typeof rIndex === 'number' && rIndex >= 0) ? rIndex : null;
            var fromSetDimenResp = (rIndex !== null),
                scrollCache = this._scrollLayoutCache,
                rowIndex = (rIndex === null) ?
                    ((!scrollCache.contain) ? col.rowIndex() : scrollCache.contain.scrollIndex()) : rIndex,
                colIndex = col.colIndex(),
                sldrResp = this.qStudioVar.respRef[rowIndex].sldrResp,
                respArry = this.qStudioVar.respRef[rowIndex].respArry,
                spliceInd = -1,
                inputValid = (!col.isOther()) ? true : col.isInputValid();

            if (!col.isAnswered()) {
                if (!inputValid) { return; }
                // Unselect currently selected button(s)
                if (col.isRadio()) {
                    while(respArry.length !== 0) {
                        respArry[0].isAnswered(false);
                        this.sendResponse(rowIndex, respArry[0].colIndex(), false);
                        this.qStudioVar.respRef[rowIndex].respArry.shift();
                    }
                } else {
                    var colRadio = respArry[0];
                    if (colRadio && colRadio.isRadio() && (fromSetDimenResp || colRadio.isAnswered())) {
                        colRadio.isAnswered(false);
                        this.sendResponse(rowIndex, colRadio.colIndex(), false);
                        this.qStudioVar.respRef[rowIndex].respArry = [];
                    }
                }

                // Unselect slider if currently answered
                if (sldrResp.columnValue >= 0) {
                    var sldr = this.qStudioVar.respRef[rowIndex].column[0];
                    sldr.isAnswered(false);
                    this.sendResponse(rowIndex, sldrResp.columnValue, false);
                    this.qStudioVar.respRef[rowIndex].sldrResp = {};
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
        },

        /*
         * Manage CHANGE responses for 'Other'/'Other Numeric' Column Button Widgets
         * @param col {Object}: changed column button widget
         * @param rIndex {Integer}: pass an optional row index value when setting responses (*used w/ Scroll Layout Containers)
         * @return {Boolean}: return true if column has been answered, false if unanswered
         */
        manageChange: function(col, rIndex) {
            // If method is passed a rIndex, we know its being called from setDimenResp
            rIndex = (typeof rIndex === 'number' && rIndex >= 0) ? rIndex : null;
            var fromSetDimenResp = (rIndex !== null),
                scrollCache = this._scrollLayoutCache,
                rowIndex = (rIndex === null) ?
                    ((!scrollCache.contain) ? col.rowIndex() : scrollCache.contain.scrollIndex()) : rIndex,
                colIndex = col.colIndex(),
                sldrResp = this.qStudioVar.respRef[rowIndex].sldrResp,
                respArry = this.qStudioVar.respRef[rowIndex].respArry,
                oeRespArry = this.qStudioVar.respRef[rowIndex].oeRespArry,
                spliceInd = -1,
                inputValid = col.isInputValid();

            // Record open-end response
            (inputValid) ?
                oeRespArry[colIndex] = col.textarea():
                oeRespArry[colIndex] = '';

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
                        var colRadio = respArry[0];
                        if (colRadio && colRadio.isRadio() && (fromSetDimenResp || colRadio.isAnswered())) {
                            colRadio.isAnswered(false);
                            this.sendResponse(rowIndex, colRadio.colIndex(), false);
                            this.qStudioVar.respRef[rowIndex].respArry = [];
                        }
                    }

                    // Unselect slider if currently answered
                    if (sldrResp.columnValue >= 0) {
                        var sldr = this.qStudioVar.respRef[rowIndex].column[0];
                        sldr.isAnswered(false);
                        this.sendResponse(rowIndex, sldrResp.columnValue, false);
                        this.qStudioVar.respRef[rowIndex].sldrResp = {};
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
                    } else{
                        col.isAnswered(false);
                        this.sendResponse(rowIndex, colIndex, false);
                        this.qStudioVar.respRef[rowIndex].respArry = [];
                        return false;
                    }
                }
            }
        },

        manageSlide: function(slider, rIndex) {
            // If method is passed a rIndex, we know its being called from setDimenResp
            //console.log(slider.rowIndex())
            rIndex = (typeof rIndex === 'number' && rIndex >= 0) ? rIndex : null;
            var fromSetDimenResp = (rIndex !== null),
                respRef = this.qStudioVar.respRef,
                scrollCache = this._scrollLayoutCache,
                setCache = this._setLayoutCache,
                params = this.qStudioVar.params,
                rowIndex = (!fromSetDimenResp) ?
                    ((!scrollCache.contain) ? slider.rowIndex() : scrollCache.contain.scrollIndex()) : rIndex,
                colIndex = slider._columnValue(),
                row = respRef[rowIndex].row,
                handleContain = slider.cache().nodes.handleContain,
                sldrResp = respRef[rowIndex].sldrResp,
                respArry = respRef[rowIndex].respArry;

            // Unselect currently selected row column button(s)
            while(respArry.length !== 0) {
                respArry[0].isAnswered(false);
                this.sendResponse(rowIndex, respArry[0].colIndex(), false);
                this.qStudioVar.respRef[rowIndex].respArry.shift();
            }

            // Unselect prior column slider column value
            if (sldrResp.columnValue >= 0) { this.sendResponse(rowIndex, sldrResp.columnValue, false); }

            // Set response
            this.sendResponse(rowIndex, colIndex, true);
            respRef[rowIndex].sldrResp = {
                columnValue: colIndex,
                rangeValue: slider._rangeValue(),
                location: handleContain[(params.colSldrDirection.value.toLowerCase() === 'horizontal') ? "lastX" : "lastY"]
            };

            // Set row as answered
            if (!fromSetDimenResp) {
                if (!row.isAnswered()) {
                    row.isAnswered(true);

                    // Set Container actions
                    if (setCache.contain) { this.setHelper(row); }

                    // Scroll Container actions
                    else if ((scrollCache.contain && this.isAutoNextEnabled()) && scrollCache.contain.next() !== false) {
                        this.scrollHelper();
                    }
                }
            }

            return true;
        },

        /*
         * DC Proxy send response 
         */
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

        setDimenResp: function(respArray) {
            if (jQuery.isArray(respArray) && respArray.length > 0) {
                var that = this,
                    respRef = this.qStudioVar.respRef,
                    sliderArray = this.qStudioVar.sliderArray,
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
                    if (isRowIndexValid(rowIndex)) { return (colIndex >= 0 && colIndex < that.qStudioVar.columnArray.length); }
                    return false;
                };

                // utility
                var answerRow = function(row, column, input) {
                    if (column) {
                        var controllerBool = null;
                        if (column.type().toLowerCase().indexOf("button") !== -1) {
                            if (!column.isOther()) {
                                controllerBool = that.manageClick(column, row.rowIndex());
                            } else {
                                column.textarea((typeof input === 'string') ? input : "test input...");
                                controllerBool = that.manageChange(column, row.rowIndex());
                                if (!controllerBool) {
                                    column.textarea(params.colOtherInitTxt.value);
                                }
                            }
                        } else if (column.type().toLowerCase() === "slider") {
                            controllerBool = that.manageSlide(column, row.rowIndex());
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

                                // Reset column answers for scrolling containers
                                if (scrollCache.contain) {
                                    for (var i = 0, clen = respRef[0].column.length; i<clen; i+=1) {
                                        var colWgt = respRef[0].column[i];
                                        if (colWgt) { colWgt.isAnswered(false); }
                                    }
                                }

                                if (isColIndexValid(rowIndex, colIndex)) {
                                    if (colIndex <= sliderArray.length - 1) {
                                        column = respRef[rowIndex].column[0];
                                        column.isAnswered(true, colIndex);
                                        answerRow(row, column);
                                    } else {
                                        var column = respRef[rowIndex].column[colIndex];
                                        answerRow(row, column, colObj[0].input);
                                    }
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

        /*
         * For use w/ Dimensions. Returns object containing row responses
         * @return {Object}
         */
        getDimenResp: function() {
            if (!this.qStudioVar.isDC) { return; }
            var valarray = [],
                json = { Response: { Value: valarray } };

            for (var i=0, rlen=this.qStudioVar.respRef.length; i<rlen; i+=1)
            {
                var respArry = this.qStudioVar.respRef[i].respArry,
                    oeRespArry = this.qStudioVar.respRef[i].oeRespArry,
                    sldrResp = this.qStudioVar.respRef[i].sldrResp,
                    row = this.qStudioVar.respRef[i].row,
                    sldr = this.qStudioVar.respRef[i].column[0],
                    row_id = row.widget().id;

                if (sldrResp.columnValue >= 0)
                {
                    var col_id = row_id + "^" + sldr.widget().id;
                    valarray.push(col_id);
                    json.Response[col_id] = {
                        columnValue: sldrResp.columnValue,
                        rangeValue: sldrResp.rangeValue
                    }
                } else {
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
            }

            return json;
        }
    };

    return SliderMatrix;

})();
