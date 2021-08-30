/**
 * ClicknFly Javascript File
 * Version : 1.2.0
 * Date : 2014-06-17
 *
 * ClicknFly Component.
 * BaseClassType : Single
 * Requires rowArray dataset.
 * Confluence Link : https://docs.gmi-mr.com/confluence/display/midev/ClicknFly+Component+Documentation
 *
 * Release 1.2.0
 * - compRTL is now automatically set for Dimensions and Decipher. QFactory utility method 'isSurveyRTL' is used
 * - made adjustments and bug fixes for RTL
 * - Updated MSPointer events per http://msdn.microsoft.com/en-us/library/dn304886(v=vs.85).aspx
 * - For QStudio Component Creation Window RTL display is turned off. Enabling RTL will move content to the right
 *   which is throwing off positioning
 * - Updated events to work better w/ touch scrolling
 *
 */

'use strict';
var ClicknFly = (function () {

    function ClicknFly() {
        this.qStudioVar = {
            isCompRTL : false,
            interact : true,
            isDC : false,
            params : this.initParams(),
            rowArray : [],
            rowAcceptedWgts : [
                "base",
                "kantarbase",
                "text",
                "radiocheck"
            ]
        };
    }

    ClicknFly.prototype = {

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
            return 'ClicknFly component description...';
        },

        // Component base class type
        baseClassType: function() {
            return 'single';
        },

        // Component question type
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

        initParams: function() {
            return {
                // Component Parameters
                compQuestionType: { name:"Component: Question Type", value:'Single Choice', description:"Component question type.", type:"combo", options:['Single Choice', 'Multiple Choice'], order: 1 },
                compContainPos: { name:"Component Contain: CSS Position", value:"relative", description:"CSS position property for component container element.", type:"combo", options:["absolute", "relative"], order: 4 },
                compIsMandatory: { name:"Component: Is Mandatory", value:false, description:"If set true, mandatory conditions must be met to complete exercise.", type:"bool", order:24 },
                compIsAutoNext: { name:"Component: Is AutoNext", value:false, description:"If set true and component is mandatory, frame will auto advance after mandatory conditions are met.", type:"bool", order:24 },
                compRTL: { name:"Component RTL: Enable", value:false, description:"If set true, component will be setup to support right-to-left languages.", type:"bool", order:24 },

                dkRadChckEnable: { name:"Don't Know RadChk: Enable", value:false, description:"If set true, last rowArray object will be used to create a RadioCheck widget button.", type:"bool", order:60 },
                dkRadChckImp: { name:"Don't Know RadChk: Import Bckgrnd", value:"", description:"Import image to use for button. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'dkbtn', wgtname:"radchkbtn_rad_url", order:75 },
                dkRadChckWidth: { name:"Don't Know RadChk: Bckgrnd Width", value:30, description:"Width used for import image, in pixels.", type:"number", min:5, wgtref: 'dkbtn', wgtname:"radchkbtn_rad_width", order:76 },
                dkRadChckHeight: { name:"Don't Know RadChk: Bckgrnd Height", value:30, description:"Height used for import image, in pixels.", type:"number", min:5, wgtref: 'dkbtn', wgtname:"radchkbtn_rad_height", order:77 },
                dkRadChckLabelHalign: { name:"Don't Know RadChk: Label Horz Alignment", value:'left', description:"Horizontal alignment of text in the button label field.", type:"combo", options:['left', 'right', 'center'], wgtref: 'dkbtn', wgtname:"radchkbtn_label_halign", order:73 },
                dkRadChckLabelWidth: { name:"Don't Know RadChk: Label Width", value:100, description:"Button label field width, in pixels.", type:"number", min:5, wgtref: 'dkbtn', wgtname:"radchkbtn_label_width", order:72 },
                dkRadChckLabelFontSize: { name:"Don't Know RadChk: Label Font Size", value:18, description:"Button label field font size.", type:"number", min:5, wgtref: 'dkbtn', wgtname:"radchkbtn_label_fontsize", order:74 },
                dkRadChckLabelColorUp: { name:"Don't Know RadChk: Label Font Color", value:0x5B5F65, description:"Button label font color.", type:"colour", wgtref: 'dkbtn', wgtname:"radchkbtn_label_fontcolor_up", order:56 },

                // Bucket Parameters
                bucketHoffset: { name:"Bucket: Left CSS Pos", value:0, description:"Left CSS position value used to offset bucket from its default location, in pixels.", type:"number", order:55 },
                bucketVoffset: { name:"Bucket: Top CSS Pos", value:0, description:"Top CSS position value used to offset bucket from its default location, in pixels.", type:"number", order:55 },
                bucketPrimBckgrndColor: { name:"Bucket: Primary Bckgrnd Color", value:0xFFFFFF, description:"Bucket primary color.", type:"colour", wgtref: 'bucket', wgtname:"bckgrnd_color", order: 15 },
                bucketSecBckgrndColor: { name:"Bucket: Secondary Bckgrnd Color", value:0xF2F2F2, description:"Bucket secondary color.", type:"colour", order: 15 },
                bucketBorderStyle: { name:"Bucket: Border Style", value:"solid", description:"Bucket CSS border style property.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'bucket', wgtname:"border_style", order: 12 },
                bucketBorderWidth: { name:"Bucket: Border Width", value:2, description:"Bucket border width, in pixels.", type:"number", min:0, wgtref: 'bucket', wgtname:"border_width", order: 13 },
                bucketBorderColor: { name:"Bucket: Border Color", value:0xA6A8AB, description:"Bucket border color.", type:"colour", wgtref: 'bucket', wgtname:"border_color", order: 14 },
                bucketShowImage: { name:"Bucket Image: Display", value:false, description:"If set true, bucket image will display on the right.", type:"bool", order:60 },
                bucketImageImp: { name:"Bucket Image: Import URL", value:"", description:"Bucket image URL.", type:"bitmapdata", order:64 },
                bucketImageWidth: { name:"Bucket Image: Width", value:150, description:"Bucket image width, in pixels", type:"number", min:30, order:30 },
                bucketImageUseZoom: { name:"Bucket Image: Enable Lightbox", value:false, description:"If set true, bucket image lightbox will be enabled.", type:"bool", order:60 },
                bucketShowSingleMarker: { name:"Bucket Single: Display Marker", value:true, description:"If set true, Single Choice bucket will display drop markers.", type:"bool", order:60 },
                bucketMultiAutoWidth: { name:"Bucket Multi: Autosize Bckgrnd Width", value:false, description:"If set true, bucket width will autosize to match row container width.", type:"bool", order:60 },
                bucketMultiWidth: { name:"Bucket Multi: Bckgrnd Width", value:550, description:"Bucket background width, in pixels.", type:"number", min:10, wgtref: 'bucket', wgtname:"width", order:30 },
                bucketMultiHeight: { name:"Bucket Multi: Bckgrnd Height", value:125, description:"Bucket background height, in pixels.", type:"number", min:10, wgtref: 'bucket', wgtname:"height", order:31 },
                bucketMultiHgap: { name:"Bucket Multi: Horz Btn Spacing", value:5, description:"The horizontal spacing of row buttons in a Multiple Choice bucket (in pixels).", type:"number", order: 8 },
                bucketMultiVgap: { name:"Bucket Multi: Vert Btn Spacing", value:5, description:"The vertical spacing of row buttons in a Multiple Choice bucket (in pixels).", type:"number", order: 9 },
                bucketMultiDropType: { name:"Bucket Multi: Row Drop Type", value:'anchor', description:"Select how row drops are animated.", type:"combo", options:['anchor', 'list', 'crop'], order:100 },
                bucketMultiContainType: { name:"Bucket Multi: Contain Type", value:'Grow', description:"Select how Multiple Choice bucket handles row overflow.", type:"combo", options:['Scroll', 'Grow'], order: 1 },
                bucketMultiCropWidth: { name:"Bucket Multi: Crop Animation Width", value:50, description:"Row drop cropping width, in pixels.", type:"number", min:5, order:102 },
                bucketMultiCropHeight: { name:"Bucket Multi: Crop Animation Height", value:50, description:"Row drop cropping height, in pixels.", type:"number", min:5, order:103 },

                // Row Container Parameters
                rowContainNumRowPerCol: { name:"Row Contain: Number of Rows Per Column", value:3, description:"Number of rows per column.", type:"number", min: 1, order: 9 },
                rowContainHgap: { name:"Row Contain: Horz Btn Spacing", value:50, description:"The horizontal spacing of row buttons, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"hgap", order: 8 },
                rowContainVgap: { name:"Row Contain: Vert Btn Spacing", value:10, description:"The vertical spacing of row buttons, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"vgap", order: 9 },
                rowContainOptHalign: { name:"Row Contain: Option Horz Alignment", value:'center', description:"", type:"combo", options:['left', 'center', 'right'], wgtref: 'rowcontain', wgtname:"option_halign", order:20 },

                // Row Button Background Parameters
                rowBtnDefaultType: { name:"Row Btn: Default Button Type", value:"Base", description:"Default button type used by component.", type:"combo", options:["Base", "Text", "RadioCheck"], order:29 },
                rowBtnWidth: { name:"Row Btn: Bckgrnd Width", value:85, description:"Button background width, in pixels", type:"number", min:10, wgtref: 'rowbtn', wgtname:"width", order:30 },
                rowBtnHeight: { name:"Row Btn: Bckgrnd Height", value:65, description:"Button background height, in pixels", type:"number", min:10, wgtref: 'rowbtn', wgtname:"height", order:31 },
                rowBtnPadding: { name:"Row Btn: Bckgrnd Padding", value:4, description:"Button background padding, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"padding", order:32 },
                rowBtnShowBckgrnd: { name:"Row Btn: Show Bckgrnd", value:true, description:"If set false, button background will not display.", type:"bool", wgtref: 'rowbtn', wgtname:"show_bckgrnd", order:42 },
                rowBtnBorderStyle: { name:"Row Btn: Border Style", value:"solid", description:"Button background CSS border style property.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'rowbtn', wgtname:"border_style", order:33 },
                rowBtnBorderRadius: { name:"Row Btn: Border Radius", value:0, description:"Button background border radius, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_radius", order:35 },
                rowBtnBorderWidthUp: { name:"Row Btn: Border Width", value:2, description:"Button background border width, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_width_up", order:34 },
                rowBtnBorderColorUp: { name:"Row Btn: Border UP Color", value:0xA6A8AB, description:"Button background border color in its default state.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_up", order:36 },
                rowBtnBorderColorOver: { name:"Row Btn: Border OVER Color", value:0x5B5F65, description:"Button background border color on mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_over", order:37 },
                rowBtnBorderColorDown: { name:"Row Btn: Border DOWN Color", value:0x5B5F65, description:"Button background border color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_down", order:38 },
                rowBtnBckgrndColorUp: { name:"Row Btn: Bckgrnd UP Color", value:0xF2F2F2, description:"Button background color in its default state.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_up", order:39 },
                rowBtnBckgrndColorOver: { name:"Row Btn: Bckgrnd OVER Color", value:0xA6A8AB, description:"Button background color on mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_over", order:40 },
                rowBtnBckgrndColorDown: { name:"Row Btn: Bckgrnd DOWN Color", value:0xFFBD1A, description:"Button background color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_down", order:41 },
                rowBtnShowImp: { name:"Row Btn: Show Import Bckgrnd", value:false, description:"If set true, button will display an imported image instead of a background color.", type:"bool", order:49 },
                rowBtnImpUp: { name:"Row Btn: Import UP Bckgrnd", value:"", description:"Import background image to use when button is in its default state.", type:"bitmapdata", order:43 },
                rowBtnImpOver: { name:"Row Btn: Import OVER Bckgrnd", value:"", description:"Import background image to use on button mouse over.", type:"bitmapdata", order:44 },
                rowBtnImpDown: { name:"Row Btn: Import DOWN Bckgrnd", value:"", description:"Import background image to use on button select.", type:"bitmapdata", order:45 },

                // Row Button Label Parameters
                rowBtnShowLabel: { name:"Row Label: Display", value:true, description:"If set false, button label will not display.", type:"bool", wgtref: 'rowbtn', wgtname:"show_label", order:60 },
                rowBtnLabelOvrWidth: { name:"Row Label: Overwrite Width", value:false, description:"", type:"bool", wgtref: 'rowbtn', wgtname:"label_ovr_width", order:60 },
                rowBtnLabelPlacement: { name:"Row Label: Placement", value:'bottom', description:"Button label placement in relation to its background element.", type:"combo", options:['top', 'bottom', 'bottom overlay', 'top overlay', 'center overlay'], wgtref: 'rowbtn', wgtname:"label_placement", order:51 },
                rowBtnLabelHalign: { name:"Row Label: Horz Alignment", value:'left', description:"Horizontal text alignment of button label field.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowbtn', wgtname:"label_halign", order:52 },
                rowBtnLabelWidth: { name:"Row Label: Custom Width", value:100, description:"", type:"number", min:10, wgtref: 'rowbtn', wgtname:"label_width", order:30 },
                rowBtnLabelHoffset: { name:"Row Label: Left CSS Pos", value:0, description:"Left CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"label_left", order:54 },
                rowBtnLabelVoffset: { name:"Row Label: Top CSS Pos", value:0, description:"Top CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"label_top", order:55 },
                rowBtnLabelFontSize: { name:"Row Label: Font Size", value:18, description:"Button label font size, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"label_fontsize", order:53 },
                rowBtnLabelColorUp: { name:"Row Label: UP Font Color", value:0x5B5F65, description:"Button label font color in the button’s default state.", type:"colour", wgtref: 'rowbtn', wgtname:"label_fontcolor_up", order:56 },
                rowBtnLabelColorOver: { name:"Row Label: OVER Font Color", value:0x5B5F65, description:"Button label font color on button mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"label_fontcolor_over", order:57 },
                rowBtnLabelColorDown: { name:"Row Label: DOWN Font Color", value:0x5B5F65, description:"Button label font color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"label_fontcolor_down", order:58 },
                rowBtnLabelOverlayShowBckgrnd: { name:"Row Label Overlay: Display Bckgrnd", value:true, description:"If set true, Overlay label will display a background color.", type:"bool", wgtref: 'rowbtn', wgtname:"show_label_bckgrnd", order:61 },
                rowBtnLabelOverlayBckgrndColor: { name:"Row Label Overlay: Bckgrnd Color", value:0xFFFFFF, description:"Overlay label background color.", type:"colour", wgtref: 'rowbtn', wgtname:"label_bckgrnd_color", order:59 },
                rowBtnLabelOverlayPadding: { name:"Row Label Overlay: Padding", value:4, description:"Overlay label padding, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"label_overlay_padding", order:32 },

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
                rowTxtBtnAdjustHeightType: { name:"Row Text: Auto Height Type", value:'none', description:"Select how the auto height feature for Text widgets is applied. When selecting the option all, the max height is calculated across all Text widgets and used as the button height.", type:"combo", options:['none', 'individual'], order:73 },
                rowRadChckImp: { name:"Row RadChk: Import Bckgrnd", value:"", description:"Import image to use for button. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"radchkbtn_rad_url", order:75 },
                rowRadChckWidth: { name:"Row RadChk: Bckgrnd Width", value:30, description:"Width used for import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"radchkbtn_rad_width", order:76 },
                rowRadChckHeight: { name:"Row RadChk: Bckgrnd Height", value:30, description:"Height used for import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"radchkbtn_rad_height", order:77 },
                rowRadChckLabelHalign: { name:"Row RadChk: Label Horz Alignment", value:'left', description:"Horizontal alignment of text in the button label field.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowbtn', wgtname:"radchkbtn_label_halign", order:73 },
                rowRadChckLabelWidth: { name:"Row RadChk: Label Width", value:100, description:"Button label field width, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"radchkbtn_label_width", order:72 },
                rowRadChckLabelFontSize: { name:"Row RadChk: Label Font Size", value:18, description:"Button label field font size.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"radchkbtn_label_fontsize", order:74 },
                rowRadChckLabelColorUp: { name:"Row RadChk: Label UP Font Color", value:0x5B5F65, description:"Button label font color in the button’s default state.", type:"colour", wgtref: 'rowbtn', wgtname:"radchkbtn_label_fontcolor_up", order:56 },
                rowRadChckLabelColorOver: { name:"Row RadChk: Label OVER Font Color", value:0x5B5F65, description:"Button label font color on button mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"radchkbtn_label_fontcolor_over", order:57 },
                rowRadChckLabelColorDown: { name:"Row RadChk: Label DOWN Font Color", value:0x5B5F65, description:"Button label font color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"radchkbtn_label_fontcolor_down", order:58 },

                // Row Animation Parameters
                rowBtnMouseOverDownShadow: { name:"Row Animation: OVER/DOWN Show Shadow", value:false, description:"If set true, button background will display a shadow on mouse over and when button is selected.", type:"bool", wgtref: 'rowbtn', wgtname:"mouseover_shadow", order:87 },

                // Tooltip Parameters
                rowBtnUseTooltip: { name:"Tooltip: Enable for Row Btn", value:false, description:"If set true and button has a description text, a tooltip will display on button mouse over.", type:"bool", order:92 },
                tooltipWidth: { name:"Tooltip: Bckgrnd Width", value:150, description:"Tooltip background width, in pixels.", type:"number", min:5, wgtref: 'tooltip', wgtname:"tooltip_width", order:93 },
                tooltipLabelHalign: { name:"Tooltip: Text Horz Alignment", value:'left', description:"Tooltip horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'tooltip', wgtname:"tooltip_halign", order:97 },
                tooltipFontSize: { name:"Tooltip: Font Size", value:18, description:"Tooltip font size.", type:"number", min:5, wgtref: 'tooltip', wgtname:"tooltip_fontsize", order:98 },
                tooltipFontColor: { name:"Tooltip: Font Color", value:0x5B5F65, description:"Tooltip font color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_fontcolor", order:99 },

                // Zoom Button Parameters
                zoomActionType: { name:"LightBox: Action Type", value:'click append widget', description:"User action type to display image gallery.", type:"combo", options:['click append image', 'click append widget', 'mouseover'], wgtref: 'ctz', wgtname:"action_type", order:52 },
                rowBtnUseZoom: { name:"LightBox: Enable for Row Btn", value:false, description:"If set true and button has an image, a click to zoom button will display.", type:"bool", order:100 },
                rowZoomHoffset: { name:"LightBox: Zoom Btn Left CSS Pos", value:0, description:"Left CSS position value used to offset zoom button from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"zoom_left", order:112 },
                rowZoomVoffset: { name:"LightBox: Zoom Btn Top CSS Pos", value:0, description:"Top CSS position value used to offset zoom button from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"zoom_top", order:113 },
                zoomImp: { name:"LightBox: Zoom Btn Import Image", value:"", description:"Zoom button imported image.", type:"bitmapdata", wgtref: 'ctz', wgtname:"zoom_import", order:109 },
                zoomWidth: { name:"LightBox: Zoom Btn Width", value:20, description:"Zoom button width, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"zoom_width", order:110 },
                zoomHeight: { name:"LightBox: Zoom Btn Height", value:20, description:"Zoom button height, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"zoom_height", order:111 },
                zoomCloseImp: { name:"LightBox: Close Btn Import Image", value:"", description:"Gallery Close button imported image.", type:"bitmapdata", wgtref: 'ctz', wgtname:"close_import", order:117 },
                zoomCloseWidth: { name:"LightBox: Close Btn Width", value:22, description:"Close button width, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"close_width", order:118 },
                zoomCloseHeight: { name:"LightBox: Close Btn Height", value:22, description:"Close button height, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"close_height", order:119 },
                zoomCloseHoffset: { name:"LightBox: Close Btn Left CSS Pos", value:0, description:"Left CSS position value used to offset close button from its default location, in pixels.", type:"number", wgtref: 'ctz', wgtname:"close_left", order:120 },
                zoomCloseVoffset: { name:"LightBox: Close Btn Top CSS Pos", value:0, description:"Top CSS position value used to offset close button from its default location, in pixels.", type:"number", wgtref: 'ctz', wgtname:"close_top", order:121 },

                /**********************************/
                // Additional Parameters
                /**********************************/
                rowKantBtnLabelWidth: { name:"Row KantarBase Btn: Label Width", value:100, description:"Button label field width, in pixels. If the actual label width ends up being less than the given value, the label width assigned will be the lesser of the two.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kantarbtn_label_width", order:71, display: false },
                rowRadChckLabelHoffset: { name:"Row RadChk Btn: Label Left CSS Pos", value:0, description:"Left CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"radchkbtn_label_left", order:54, display: false },
                rowRadChckLabelVoffset: { name:"Row RadChk Btn: Label Top CSS Pos", value:0, description:"Top CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"radchkbtn_label_top", order:55, display: false },
                tooltipBorderWidth: { name:"Tooltip: Border Width", value:2, description:"Tooltip background border width, in pixels.", type:"number", min:0, wgtref: 'tooltip', wgtname:"tooltip_border_width", order:94, display: false },
                tooltipBorderColor: { name:"Tooltip: Border Color", value:0xA6A8AB, description:"Tooltip background border color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_border_color", order:95, display: false },
                tooltipBckgrndColor: { name:"Tooltip: Bckgrnd Color", value:0xFFFFFF, description:"Tooltip background color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_bckgrnd_color", order:96, display: false },
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
                zoomBckgrndColor: { name:"LightBox: Zoom Btn Bckgrnd Color", value:0xFFFFFF, description:"Click to Zoom button background color.", type:"colour", wgtref: 'ctz', wgtname:"zoom_bckgrnd_color", order:116, display: false }
            };
        },

        /*
         * Call to create a group parameter objects -- accepted values are 'rowcontain', 'rowbtn', 'colcontain' and 'coldzone'.
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

        // Call to create component element
        create: function(parent) {
            // Component Controller Init Vars
            this.qControllerObj = {
                isCompAnswered : false,
                wgtArray : [],
                dkWgt : null,
                multiBucket : null,
                numOfCols : 0,
                grpInfo : {}
            };

            // Auto-set compRTL parameter based on Survey Platform RTL settings
            if (QUtility.isSurveyRTL()) {
                this.qStudioVar.params.compRTL.value = true;
            }

            // Disable RTL in QStudio Component Creation Window due to positioning issues
            this.qStudioVar.isCompRTL =
                (!(parent && parent.id === "componentDemoContainer")) ? this.qStudioVar.params.compRTL.value : false;

            var doc = document,
                that = this,
                dcProxy = this.qStudioVar.dcProxy,
                qControllerObj = this.qControllerObj,
                params = this.qStudioVar.params,
                rowArray = this.qStudioVar.rowArray,
                rowArrayLen = rowArray.length,
                maxWgtHeight = 0,
                basePadding = 10,
                bucketBorderWidth = (params.bucketBorderWidth.value >= 0) ? params.bucketBorderWidth.value : 1,
                isSingleChoice = (params.compQuestionType.value.toLowerCase().indexOf("single") !== -1),
                rowContainHgap = params.rowContainHgap.value,
                rowContainVgap = params.rowContainVgap.value,
                colRowCnt = (params.rowContainNumRowPerCol.value >= 1) ? params.rowContainNumRowPerCol.value : 4,
                toolTipConfigObj = this.paramObj('tooltip'),
                ctzConfigObj = this.paramObj('ctz'),
                rowBtnConfigObj = this.paramObj('rowbtn'),
                bucketConfigObj = this.paramObj('bucket'),
                compContain = doc.createElement("div"),
                compWrapContain = doc.createElement("div"),
                rowContain = null,
                colContain = doc.createElement("div"),
                bucketContain = doc.createElement("div"),
                markerContain = doc.createElement("div"),
                isMSTouch = QUtility.isMSTouch(),
                touchEnabled = QUtility.isTouchDevice(),
                eventStr = (!isMSTouch) ?
                    ((!touchEnabled) ? "click.clicknfly" : "touchstart.clicknfly touchend.clicknfly touchmove.clicknfly"):
                    ((!touchEnabled) ? "click.clicknfly" : ((window.PointerEvent) ? "pointerdown.clicknfly pointerup.clicknfly" : "MSPointerDown.clicknfly MSPointerUp.clicknfly")),
                isTouchMove = false;

            // QStudio hide survey next button
            if (this.isMandatory()) { dcProxy.hideNextButton(); }

            // Default settings
            if (params.bucketBorderStyle.value.toLowerCase() === "none") { bucketBorderWidth = 0; }
            if (rowContainHgap < 0) { rowContainHgap = 0; }
            if (rowContainVgap < 0) { rowContainVgap = 0; }
            if (basePadding < 0) { basePadding = 0; }
            if (params.dkRadChckEnable.value) { rowArrayLen -= 1; }
            if (colRowCnt >= rowArrayLen) { colRowCnt = rowArrayLen; }

            // Row Button settings
            rowBtnConfigObj.isRTL = that.qStudioVar.isCompRTL;
            rowBtnConfigObj.txtbtn_trim = (params.rowTxtBtnAdjustHeightType.value !== "none");
            rowBtnConfigObj.border_width_over = rowBtnConfigObj.border_width_up;
            rowBtnConfigObj.border_width_down = rowBtnConfigObj.border_width_up;

            // Init External Widgets
            toolTipConfigObj.isRTL = that.qStudioVar.isCompRTL;
            QStudioCompFactory.lightBoxFactory("basic", doc.body, ctzConfigObj);
            QStudioCompFactory.toolTipFactory("", doc.body, toolTipConfigObj);

            // Setup grpInfo object
            for (var i = 0; i<rowArrayLen; i+=1) {
                if (i % colRowCnt === 0) {
                    qControllerObj.grpInfo[qControllerObj.numOfCols] = {
                        rowArray : [],
                        responseArray : [],
                        bucketEle : null
                    };
                    qControllerObj.numOfCols += 1;
                }

                qControllerObj.grpInfo[qControllerObj.numOfCols-1].rowArray.push(rowArray[i]);
            }

            // Component Container CSS Style
            compContain.id = "ClicknFlyComponent";
            compContain.dir = (!that.qStudioVar.isCompRTL) ? 'ltr' :'rtl';
            compContain.className = "qclicknfly_component";
            compContain.style.position = params.compContainPos.value;
            compContain.style.width = "100%";
            compContain.style.height = "100%";
            parent = (parent && parent.nodeType === 1) ? parent : doc.body;
            parent.appendChild(compContain);

            // Setup Row Container
            var containConfig =  {
                position : "relative",
                padding : (isSingleChoice) ? basePadding : 0,
                autoWidth : true,
                autoHeight : true,
                hgap : rowContainHgap,
                vgap : rowContainVgap,
                left : 0,
                show_bckgrnd : false,
                border_style : "none",
                border_width : 0,
                option_halign : params.rowContainOptHalign.value,
                isRTL : that.qStudioVar.isCompRTL
            };

            rowContain = QStudioCompFactory.layoutFactory(
                "horizontal",
                compContain,
                containConfig
            );
            rowContain.container().className = "qclicknfly_row_container";
            rowContain.container().style.zIndex = 3000;
            rowContain.container().style.border = bucketBorderWidth + "px solid transparent";

            // Setup vertical containers to hold row groups
            delete containConfig.left;
            delete containConfig.hgap;
            for (var key in qControllerObj.grpInfo) {
                if (qControllerObj.grpInfo.hasOwnProperty(key)) {
                    // Create vertical container
                    var subContain = QStudioCompFactory.layoutFactory(
                            "vertical",
                            compContain,
                            containConfig
                        ),
                        grpRowArray = qControllerObj.grpInfo[key].rowArray;

                    // Add row to vertical container
                    for (var j = 0; j<grpRowArray.length; j+=1) {
                        var userDefType = jQuery.trim(grpRowArray[j].var1 || grpRowArray[j].type).toLowerCase(),
                            rowBtnType = params.rowBtnDefaultType.value,
                            rowWgt = null;

                        if (that.isRowTypeValid(userDefType)) { rowBtnType = userDefType; }
                        rowBtnConfigObj.isRadio = true;
                        rowBtnConfigObj.rowIndex = jQuery.inArray(grpRowArray[j], rowArray);
                        rowBtnConfigObj.id = grpRowArray[j].id || 'row_'+grpRowArray[j].rowIndex;
                        rowBtnConfigObj.label = grpRowArray[j].label;
                        rowBtnConfigObj.description = grpRowArray[j].description;
                        rowBtnConfigObj.image = grpRowArray[j].image;
                        rowBtnConfigObj.width = grpRowArray[j].width || params.rowBtnWidth.value;
                        rowBtnConfigObj.height = grpRowArray[j].height || params.rowBtnHeight.value;
                        rowBtnConfigObj.show_bckgrnd_import = (typeof grpRowArray[j].showImpBckgrnd === 'boolean') ?
                            grpRowArray[j].showImpBckgrnd : params.rowBtnShowImp.value;
                        rowBtnConfigObj.bckgrnd_import_up = grpRowArray[j].bckgrndUp || params.rowBtnImpUp.value;
                        rowBtnConfigObj.bckgrnd_import_over = grpRowArray[j].bckgrndOver || params.rowBtnImpOver.value;
                        rowBtnConfigObj.bckgrnd_import_down = grpRowArray[j].bckgrndDown || params.rowBtnImpDown.value;
                        rowBtnConfigObj.use_tooltip = (typeof grpRowArray[j].useTooltip === 'boolean') ?
                            grpRowArray[j].useTooltip : params.rowBtnUseTooltip.value;
                        rowBtnConfigObj.use_lightbox = (typeof grpRowArray[j].useZoom === 'boolean') ?
                            grpRowArray[j].useZoom : params.rowBtnUseZoom.value;

                        // Create Row Button Widget
                        rowWgt = QStudioCompFactory.widgetFactory(
                            rowBtnType,
                            compContain,
                            rowBtnConfigObj
                        );

                        rowWgt.widget().setAttribute("rowIndex", rowBtnConfigObj.rowIndex.toString()); // Store row array index
                        rowWgt.widget().setAttribute("grpIndex", key.toString());  // Store row group index
                        qControllerObj.wgtArray.push({
                            rowWgt : rowWgt,
                            rowWrap : subContain.add(rowWgt)
                        });

                        // Calculate max widget height
                        maxWgtHeight = Math.max(maxWgtHeight, $(rowWgt.widget()).outerHeight());
                    }

                    // Add vertical container to row container
                    rowContain.add(subContain.container());

                    // Create Drop Marker for Single Choice question type to append to bucketContain
                    if (isSingleChoice) {
                        // Drop Marker CSS Style
                        var dropMarker = doc.createElement("div"),
                            innerShadow = "inset 0 0 8px #888";

                        dropMarker.className = "qclicknfly_bucket_dropmarker";
                        dropMarker.style.position = "absolute";
                        dropMarker.style.width = ($(subContain.container()).outerWidth()) + "px";
                        if (params.bucketShowSingleMarker.value) {
                            dropMarker.style.backgroundColor = "#" + QUtility.paramToHex(params.bucketSecBckgrndColor.value);
                            dropMarker.style.mozBoxShadow = innerShadow;
                            dropMarker.style.webkitBoxShadow = innerShadow;
                            dropMarker.style.boxShadow = innerShadow;
                        }
                        markerContain.appendChild(dropMarker);
                        qControllerObj.grpInfo[key].bucketEle = dropMarker;
                    }
                }
            }

            // Setup colContain & bucketContain
            var bucketWidth = (isSingleChoice || params.bucketMultiAutoWidth.value) ?
                    $(rowContain.container()).width() - basePadding*2 : bucketConfigObj.width,
                bucketHeight = ((isSingleChoice) ? maxWgtHeight + basePadding*2 : bucketConfigObj.height);

            colContain.className = "qclicknfly_column_container";
            colContain.style.position = "relative";
            colContain.style.marginTop = params.bucketVoffset.value + "px";
            colContain.style[(!that.qStudioVar.isCompRTL) ? 'marginLeft' : 'marginRight'] = params.bucketHoffset.value + "px";
            colContain.style.height = "100%";
            colContain.style.width = "100%";
            compContain.appendChild(colContain);

            bucketContain.className = "qclicknfly_bucket_container";
            bucketContain.style.position = "relative";
            bucketContain.style.width = bucketWidth + "px";
            bucketContain.style.height = bucketHeight + "px";
            bucketContain.style.padding = basePadding + "px";
            bucketContain.style.borderStyle = params.bucketBorderStyle.value;
            bucketContain.style.borderWidth = bucketBorderWidth + "px";
            bucketContain.style.borderColor = "#"+QUtility.paramToHex(bucketConfigObj.border_color);
            bucketContain.style.backgroundColor = "#"+QUtility.paramToHex(bucketConfigObj.bckgrnd_color);
            colContain.appendChild(bucketContain);

            if (params.bucketShowImage.value && params.bucketImageImp.value.length > 0) {
                var buckImgContain = doc.createElement("div"),
                    buckImg = doc.createElement("img"),
                    bucketImgWidth = (params.bucketImageWidth.value >= 30) ? params.bucketImageWidth.value : 150;

                // Bucket Image Container CSS
                buckImgContain.style.position = "absolute";
                buckImgContain.style.width = bucketImgWidth + "px";
                buckImgContain.style.height = bucketContain.style.height;

                // Bucket Image CSS
                buckImg.style.position = "absolute";
                buckImg.style.visibility = "hidden";
                buckImg.style.maxWidth = buckImgContain.style.width;
                buckImg.style.maxHeight = buckImgContain.style.height;
                buckImg.src = params.bucketImageImp.value;

                // Append children
                buckImgContain.appendChild(buckImg);
                bucketContain.appendChild(buckImgContain);

                // Image event handlers
                $(buckImg).on("load.clicknfly", function(event) {
                    $(this).off("load.clicknfly");
                    doc.body.appendChild(buckImgContain);
                    var imgWidth = $(this).width(),
                        baseWgt = new QBaseBtn(bucketContain, {
                            width : imgWidth,
                            height : bucketHeight,
                            padding : 0,
                            //show_bckgrnd : false,
                            border_style : "none",
                            border_width_up : 0,
                            image : params.bucketImageImp.value,
                            use_lightbox : params.bucketImageUseZoom.value,
                            zoom_top : Math.round((parseInt(bucketContain.style.height, 10)-$(this).height())*0.5)
                        });

                    doc.body.removeChild(buckImgContain);
                    baseWgt.enabled(false, { alphaVal:100, enableExtEvt:true });
                    baseWgt.widget().className = "";
                    baseWgt.widget().style.position = "absolute";
                    baseWgt.widget().style.top = basePadding + "px";

                    // RTL Adjustments
                    baseWgt.widget().style[(!that.qStudioVar.isCompRTL) ? "left" : "right"] = (bucketWidth + basePadding*2) + "px";

                    // Resize bucketContain
                    bucketContain.style.width = (bucketWidth + imgWidth + basePadding) + "px";

                    if (qControllerObj.dkWgt) {
                        dkRadChk.widget().style[(!that.qStudioVar.isCompRTL) ? "left" : "right"] =
                            ($(bucketContain).outerWidth() - $(dkRadChk.widget()).outerWidth()) + "px";
                    }
                }).attr("src", params.bucketImageImp.value);

                $(buckImg).on("error.clicknfly", function() {
                    $(this).off("error.clicknfly");
                    bucketContain.removeChild(buckImgContain);
                });
            }

            // Setup Don't know option
            if (params.dkRadChckEnable.value) {
                var dkRadChk = new QRadioCheckBtn(colContain, {
                    id :  rowArray[rowArrayLen].id || 'row_'+rowArrayLen,
                    rowIndex : rowArrayLen,
                    isRTL : that.qStudioVar.isCompRTL,
                    label : rowArray[rowArrayLen].label,
                    isRadio : true,
                    radchkbtn_rad_url : params.dkRadChckImp.value,
                    radchkbtn_rad_width : params.dkRadChckWidth.value,
                    radchkbtn_rad_height : params.dkRadChckHeight.value,
                    radchkbtn_label_halign : params.dkRadChckLabelHalign.value,
                    radchkbtn_label_width : params.dkRadChckLabelWidth.value,
                    radchkbtn_label_fontsize : params.dkRadChckLabelFontSize.value,
                    radchkbtn_label_fontcolor_up : params.dkRadChckLabelColorUp.value,
                    radchkbtn_label_fontcolor_over : params.dkRadChckLabelColorUp.value,
                    radchkbtn_label_fontcolor_down : params.dkRadChckLabelColorUp.value
                });

                colContain.insertBefore(dkRadChk.widget(), bucketContain);
                qControllerObj.dkWgt = dkRadChk;
                dkRadChk.widget().className = "";
                dkRadChk.widget().style[(!that.qStudioVar.isCompRTL) ? "left" : "right"] =
                    ($(bucketContain).outerWidth() - $(dkRadChk.widget()).outerWidth()) + "px";
                dkRadChk.widget().style.marginBottom = "2px";
                if (bucketWidth<$(dkRadChk.widget()).outerWidth()) {
                    bucketWidth = $(dkRadChk.widget()).outerWidth();
                }

                // Don't know event handler
                $(dkRadChk.widget()).on(eventStr, function(event){
                    event.stopPropagation();
                    if (isMSTouch && touchEnabled && !event.originalEvent.isPrimary) { return; }
                    if (event.type !== "touchmove") {
                        if (event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                            if (!isTouchMove) { that.controllerTapDontKnow(); }
                        } else {
                            isTouchMove = false;
                        }
                    } else {
                        isTouchMove = true;
                    }
                });
            }

            // If question type is Single Choice...
            if (isSingleChoice) {
                // Bucket Container CSS Style
                markerContain.className = "qclicknfly_bucket_marker_container";
                markerContain.style.position = "absolute";
                bucketContain.appendChild(markerContain);

                var runningWidthTotal = 0;
                for (var k = 0; k<markerContain.children.length; k+=1) {
                    var dropMarker = markerContain.children[k],
                        prevMarker = markerContain.children[k-1];

                    runningWidthTotal +=  ((k > 0) ? ($(prevMarker).outerWidth() + rowContainHgap) : 0);
                    dropMarker.style.height = (maxWgtHeight + basePadding*2) + "px";
                    dropMarker.style[(!that.qStudioVar.isCompRTL) ? "left" : "right"] = runningWidthTotal + "px";
                }
            }

            // If question type is Multiple Choice...
            else {
                var bucketWgt = QStudioCompFactory.widgetFactory(
                    "basebucket",
                    bucketContain,
                    {
                        width : bucketWidth,
                        height : bucketHeight,
                        contain_padding : 10,
                        bckgrnd_color_up : params.bucketSecBckgrndColor.value,
                        hgap : params.bucketMultiHgap.value,
                        vgap : params.bucketMultiVgap.value,
                        border_style : "none",
                        bucket_animation : params.bucketMultiDropType.value,
                        grow_animation : (params.bucketMultiContainType.value.toLowerCase() === "scroll") ? "none" : "grow individual",
                        crop_width : params.bucketMultiCropWidth.value,
                        crop_height : params.bucketMultiCropHeight.value
                    }
                );

                // Remove default mouse enter/leave events
                bucketWgt.removeEvent(bucketWgt.widget(), "mouseenter.widget mouseleave.widget");

                // Record reference to bucket widget
                qControllerObj.multiBucket = bucketWgt;
            }

            //Event Handler
            $(compContain).on(eventStr, ".qwidget_button", function(event) {
                event.stopPropagation();
                if (isMSTouch && touchEnabled && !event.originalEvent.isPrimary) { return; }
                if (event.type !== "touchmove") {
                    if (event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                        if (isTouchMove) { return; }
                        var rowIndex = parseInt(event.currentTarget.getAttribute("rowIndex"),10);
                        that[(isSingleChoice) ? "controllerTapSingle" : "controllerTapMulti"](rowIndex);
                    } else {
                        isTouchMove = false;
                    }
                } else {
                    isTouchMove = true;
                }
            });
        },

        controllerTapDontKnow : function(animTime) {
            var params = this.qStudioVar.params,
                qControllerObj = this.qControllerObj,
                grpInfo = qControllerObj.grpInfo,
                dkWgt = qControllerObj.dkWgt,
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
                this.sendResponse(dkWgt.rowIndex(), true);
                this._setIsCompAnswered(true);
            }
        },

        controllerTapSingle : function(rowIndex, animTime, fromDK) {
            animTime = (!isNaN(animTime) && animTime >= 0) ? animTime : 500;
            var that = this,
                surveyScale = QUtility.getQStudioSurveyScale(),
                params = this.qStudioVar.params,
                qControllerObj = this.qControllerObj,
                grpInfo = qControllerObj.grpInfo,
                rowWgt = qControllerObj.wgtArray[rowIndex].rowWgt,
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
                curRowRespParent = qControllerObj.wgtArray[curRowResp.rowIndex()].rowWrap;
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
                this.sendResponse(curRowResp.rowIndex(), false);  // SEND DC RESPONSE

                // Animate
                $(curRowResp.widget()).stop();
                $(curRowResp.widget()).animate({
                    left : "",
                    top : ""
                }, animTime, function(){
                    curRowResp.enabled(true);
                });

                if (exit) {
                    if (!fromDK) { this._setIsCompAnswered(false); }
                    return;
                }
            } else if (qControllerObj.dkWgt && qControllerObj.dkWgt.isAnswered()) {
                qControllerObj.dkWgt.isAnswered(false);
                this.sendResponse(qControllerObj.dkWgt.rowIndex(), false);
            }

            // Set new bucket row response
            responseArray[0] = rowWgt;
            this.sendResponse(rowWgt.rowIndex(), true); // SEND DC RESPONSE
            this._setIsCompAnswered(this.checkMandatory());

            // Animate
            rowWgt.isAnswered(true);
            $(rowEle).stop();
            $(rowEle).animate({
                left : Math.round(($(bucketEle).offset().left - $(rowEle.parentNode).offset().left)*(1/surveyScale.a) + xLocOffset) + "px",
                top : Math.round(($(bucketEle).offset().top - $(rowEle.parentNode).offset().top)*(1/surveyScale.d) + yLocOffset) + "px"
            }, animTime, function(){
                bucketEle.appendChild(rowEle);
                rowEle.style[(!that.qStudioVar.isCompRTL) ? "left" : "right"] = xLocOffset + "px";
                rowEle.style.top = yLocOffset + "px";
                rowWgt.enabled(true);
            });
        },

        controllerTapMulti : function(rowIndex, animTime, fromDK) {
            animTime = (!isNaN(animTime) && animTime >= 0) ? animTime : 500;
            var that = this,
                surveyScale = QUtility.getQStudioSurveyScale(),
                params = this.qStudioVar.params,
                qControllerObj = this.qControllerObj,
                grpInfo = qControllerObj.grpInfo,
                rowWgt = qControllerObj.wgtArray[rowIndex].rowWgt,
                rowWrap = qControllerObj.wgtArray[rowIndex].rowWrap,
                rowEle = rowWgt.widget(),
                bucketWgt = qControllerObj.multiBucket,
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
                if (qControllerObj.dkWgt && qControllerObj.dkWgt.isAnswered()) {
                    qControllerObj.dkWgt.isAnswered(false);
                    this.sendResponse(qControllerObj.dkWgt.rowIndex(), false);
                }

                responseArray.push(rowWgt);
                this.sendResponse(rowWgt.rowIndex(), true); // SEND DC RESPONSE

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
                }, animTime, function() {
                    rowEle.style.marginLeft = 15 + "px";
                    $(rowEle).animate({
                        marginLeft : "",
                        top : "",
                        opacity : 1
                    }, animTime);
                    bucketWgt.add(rowWgt);
                    bucketGrow();
                    rowWgt.enabled(true);
                });
            } else {
                responseArray.splice(spliceIndex, 1);
                this.sendResponse(rowWgt.rowIndex(), false); // SEND DC RESPONSE

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

            if (!fromDK) { this._setIsCompAnswered(this.checkMandatory()); }
        },

        bindGrowCallBack: function(value) {
            if (typeof value === "function") {
                this._growCallBack = value;
            } else {
                return this._growCallBack;
            }
        },

        checkMandatory : function() {
            var qControllerObj = this.qControllerObj,
                dkWgt = qControllerObj.dkWgt,
                grpInfo = qControllerObj.grpInfo,
                numOfCols = qControllerObj.numOfCols,
                respCnt = 0;

            for (var grpIndex in grpInfo) {
                if (grpInfo.hasOwnProperty(grpIndex)) {
                    if (grpInfo[grpIndex].responseArray.length > 0) { respCnt += 1; }
                }
            }

            if (dkWgt && dkWgt.isAnswered()) { return true; }
            return (respCnt === numOfCols);
        },

        _setIsCompAnswered : function(value) {
            var qStudioVar = this.qStudioVar;
            if (typeof value === "boolean" && value !== this.qControllerObj.isCompAnswered) {
                console.log("_setIsCompAnswered: " + value);
                this.qControllerObj.isCompAnswered = value;
                if (this.isMandatory()) {
                    qStudioVar.dcProxy[(value) ? "showNextButton" : "hideNextButton"]();
                    if (value && this.isAutoNext()) { qStudioVar.dcProxy.next(); }
                }
            }
        },

        /*
         * DC Proxy send response 
         */
        sendResponse: function(rowIndex, ansVal) {
            console.log("sendResponse: " + rowIndex + " | " + ansVal);
            if (this.qStudioVar.isDC && typeof this.qStudioVar.dcProxy !== 'undefined') {
                this.qStudioVar.dcProxy.sendResponse({
                    eventType : (ansVal) ? "questionAnswered" : "questionUnAnswered",
                    responseType : this.questionType(),
                    rowID : this.qStudioVar.rowArray[rowIndex].rowVO.id,
                    answerValue : ansVal
                });
            }
        },

        /*
         * For use w/ Dimensions. Set row initial responses.
         * @param respArry{Array} - responses to set
         */
        setDimenResp: function(respArry) {
            if (jQuery.isArray(respArry)) {
                var rowArray = this.qStudioVar.rowArray,
                    params = this.qStudioVar.params,
                    dkEnable = params.dkRadChckEnable.value,
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

        /*
         * For use w/ Dimensions. Returns object containing row responses
         * @return {Object}
         */
        getDimenResp: function() {
            if (!this.qStudioVar.isDC) { return; }
            var valarray = [],
                json = { Response: { Value: valarray } },
                qControllerObj = this.qControllerObj,
                dkWgt = qControllerObj.dkWgt,
                grpInfo = qControllerObj.grpInfo,
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
