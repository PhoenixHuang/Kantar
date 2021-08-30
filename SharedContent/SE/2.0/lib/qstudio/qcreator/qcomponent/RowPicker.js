/**
 * RowPicker Javascript File
 * Version : 1.2.0
 * Date : 2014-06-17
 *
 * RowPicker Component.
 * BaseClassType : Single
 * Requires rowArray dataset.
 * Confluence Link : https://docs.gmi-mr.com/confluence/display/midev/RowPicker+Component+Documentation
 *
 * Release 1.2.0
 * - compRTL is now automatically set for Dimensions and Decipher. QFactory utility method 'isSurveyRTL' is used
 * - Added new parameter rowContainOptHalign which horizontally aligns row options. Options include 'left', 'right', & 'center'. Applies to vertical layout directions only
 * - Added new parameter rowContainOptValign which vertically aligns row options. Options include 'top', 'bottom', & 'middle'. Applies to horizontal layout directions only
 * - Updated MSPointer events per http://msdn.microsoft.com/en-us/library/dn304886(v=vs.85).aspx
 * - For QStudio Component Creation Window RTL display is turned off. Enabling RTL will move content to the right
 *   which is throwing off positioning
 * - Updated events to work better w/ touch scrolling
 *
 */

'use strict';
var RowPicker = (function () {

    function RowPicker() {
        this.qStudioVar = {
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
                    "var1",             // Row object button type
                    "var2"              // Row object isRadio prop
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
            return 'RowPicker component description...';  
        },
        
        // Component base class type
        baseClassType: function() {
            // single column base class type
            return 'single';
        },
        
        // Component question type
        questionType: function() {
            var qtype = this.qStudioVar.params.compQuestionType.value.toLowerCase();
            if (qtype.indexOf('multiple') !== -1) { return 'multi'; }
            return 'single';
        },

        capType : function() {
            var qtype = this.qStudioVar.params.compQuestionType.value.toLowerCase(),
                capvalue = this.qStudioVar.params.compCapValue.value,
                captype = "none";

            if (qtype.indexOf('soft') !== -1 && (capvalue > 1)) { captype = "soft"; }
            if (qtype.indexOf('hard') !== -1 && (capvalue > 1)) { captype = "hard"; }
            return captype;
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
                // Component Parameters
                compQuestionType: { name:"Component: Question Type", value:'Multiple Choice', description:"Component question type.", type:"combo", options:['Single Choice', 'Multiple Choice', 'Multiple Soft Cap', 'Multiple Hard Cap'], order: 1 },
                compCapValue: { name:"Component: Cap Value", value:0, description:"Restricts the number of button selections to the value assigned. Question type must be 'Multiple Choice' and value entered must be >= 2.", type:"number", min:2, order: 2 },
                compContainPos: { name:"Component Contain: CSS Position", value:"relative", description:"CSS position property for component container element.", type:"combo", options:["absolute", "relative"], order: 4 },
                compRTL: { name:"Component RTL: Enable", value:false, description:"If set true, component will be setup to support right-to-left languages.", type:"bool", order:24 },

                // Row Container Parameters
                rowContainType: { name:"Row Contain: Layout Type", value:"horizontal grid layout", description:"Layout template type applied to row buttons.", type:"combo", options:["horizontal grid layout", "vertical grid layout", "horizontal layout", "vertical layout"], order: 3 },
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

                // Row Button Background Parameters
                rowBtnDefaultType: { name:"Row Btn: Default Button Type", value:"Base", description:"Default button type used by component.", type:"combo", options:["Base", "Text", "RadioCheck", "Flow", "KantarBase"], order:29 },
                rowBtnWidth: { name:"Row Btn: Bckgrnd Width", value:100, description:"Button background width, in pixels", type:"number", min:10, wgtref: 'rowbtn', wgtname:"width", order:30 },
                rowBtnHeight: { name:"Row Btn: Bckgrnd Height", value:100, description:"Button background height, in pixels", type:"number", min:10, wgtref: 'rowbtn', wgtname:"height", order:31 },
                rowBtnPadding: { name:"Row Btn: Bckgrnd Padding", value:4, description:"Button background padding, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"padding", order:32 },
                rowBtnShowBckgrnd: { name:"Row Btn: Show Bckgrnd", value:true, description:"If set false, button background will not display.", type:"bool", wgtref: 'rowbtn', wgtname:"show_bckgrnd", order:42 },
                rowBtnBorderStyle: { name:"Row Btn: Border Style", value:"solid", description:"Button background CSS border style property.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'rowbtn', wgtname:"border_style", order:33 },
                rowBtnBorderRadius: { name:"Row Btn: Border Radius", value:0, description:"Button background border radius, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_radius", order:35 },
                rowBtnBorderWidthUp: { name:"Row Btn: Border UP Width", value:2, description:"Button background border width (in pixels) in its default state.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_width_up", order:34 },
                rowBtnBorderWidthOver: { name:"Row Btn: Border OVER Width", value:2, description:"Button background border width (in pixels) on mouse over.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_width_over", order:34 },
                rowBtnBorderWidthDown: { name:"Row Btn: Border DOWN Width", value:2, description:"Button background border width (in pixels) when button is selected.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_width_down", order:34 },
                rowBtnBorderColorUp: { name:"Row Btn: Border UP Color", value:0xA6A8AB, description:"Button background border color in its default state.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_up", order:36 },
                rowBtnBorderColorOver: { name:"Row Btn: Border OVER Color", value:0x5B5F65, description:"Button background border color on mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_over", order:37 },
                rowBtnBorderColorDown: { name:"Row Btn: Border DOWN Color", value:0x5B5F65, description:"Button background border color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_down", order:38 },
                rowBtnBckgrndColorUp: { name:"Row Btn: Bckgrnd UP Color", value:0xF2F2F2, description:"Button background color in its default state.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_up", order:39 },
                rowBtnBckgrndColorOver: { name:"Row Btn: Bckgrnd OVER Color", value:0xA6A8AB, description:"Button background color on mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_over", order:40 },
                rowBtnBckgrndColorDown: { name:"Row Btn: Bckgrnd DOWN Color", value:0xFFBD1A, description:"Button background color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_down", order:41 },
                rowRadShowImp: { name:"Row Btn: Show Import RADIO Bckgrnd", value:false, description:"If set true, buttons which behave like Radio buttons will display an imported image instead of a background color.", type:"bool", order:49 },
                rowRadImpUp: { name:"Row Btn: RADIO Import UP Bckgrnd", value:"", description:"Import background image to use when button is in its default state (for buttons which behave like Radio buttons).", type:"bitmapdata", order:43 },
                rowRadImpOver: { name:"Row Btn: RADIO Import OVER Bckgrnd", value:"", description:"Import background image to use on button mouse over (for buttons which behave like Radio buttons).", type:"bitmapdata", order:44 },
                rowRadImpDown: { name:"Row Btn: RADIO Import DOWN Bckgrnd", value:"", description:"Import background image to use on button select (for buttons which behave like Radio buttons).", type:"bitmapdata", order:45 },
                rowChkShowImp: { name:"Row Btn: Show Import CHECK Bckgrnd", value:false, description:"If set true, buttons which behave like Checkbox buttons will display an imported image instead of a background color.", type:"bool", order:50 },
                rowChkImpUp: { name:"Row Btn: CHECK Import UP Bckgrnd", value:"", description:"Import background image to use when button is in its default state (for buttons which behave like Checkbox buttons).", type:"bitmapdata", order:46 },
                rowChkImpOver: { name:"Row Btn: CHECK Import OVER Bckgrnd", value:"", description:"Import background image to use on button mouse over (for buttons which behave like Checkbox buttons).", type:"bitmapdata", order:47 },
                rowChkImpDown: { name:"Row Btn: CHECK Import DOWN Bckgrnd", value:"", description:"Import background image to use on button select (for buttons which behave like Checkbox buttons).", type:"bitmapdata", order:48 },

                // Row Button Label Parameters
                rowBtnShowLabel: { name:"Row Label: Display", value:true, description:"If set false, button label will not display.", type:"bool", wgtref: 'rowbtn', wgtname:"show_label", order:60 },
                rowBtnLabelOvrWidth: { name:"Row Label: Overwrite Width", value:false, description:"", type:"bool", wgtref: 'rowbtn', wgtname:"label_ovr_width", order:60 },
                rowBtnLabelPlacement: { name:"Row Label: Placement", value:'bottom', description:"Button label placement in relation to its background element.", type:"combo", options:['top', 'bottom', 'bottom overlay', 'top overlay', 'center overlay'], wgtref: 'rowbtn', wgtname:"label_placement", order:51 },
                rowBtnLabelHalign: { name:"Row Label: Horz Alignment", value:'left', description:"Horizontal text alignment of button label field.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowbtn', wgtname:"label_halign", order:52 },
                rowBtnLabelWidth: { name:"Row Label: Custom Width", value:125, description:"", type:"number", min:10, wgtref: 'rowbtn', wgtname:"label_width", order:30 },
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
                rowKantBtnLabelWidth: { name:"Row KantarBase Btn: Label Width", value:125, description:"Button label field width, in pixels. If the actual label width ends up being less than the given value, the label width assigned will be the lesser of the two.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kantarbtn_label_width", order:71 },
                rowTxtBtnAdjustHeightType: { name:"Row Text: Auto Height Type", value:'all', description:"Select how the auto height feature for Text widgets is applied. When selecting the option all, the max height is calculated across all Text widgets and used as the button height.", type:"combo", options:['none', 'individual', 'all'], order:73 },
                rowRadChckImpRadio: { name:"Row RadChk: RADIO Import Bckgrnd", value:"", description:"Import image to use for Radio button types. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"radchkbtn_rad_url", order:75 },
                rowRadChckWidthRadio: { name:"Row RadChk: RADIO Bckgrnd Width", value:30, description:"Width used for Radio import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"radchkbtn_rad_width", order:76 },
                rowRadChckHeightRadio: { name:"Row RadChk: RADIO Bckgrnd Height", value:30, description:"Height used for Radio import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"radchkbtn_rad_height", order:77 },
                rowRadChckImpCheck: { name:"Row RadChk: CHECK Import Bckgrnd", value:"", description:"Import image to use for Checkbox button types. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"radchkbtn_chk_url", order:78 },
                rowRadChckWidthCheck: { name:"Row RadChk: CHECK Bckgrnd Width", value:30, description:"Width used for Checkbox import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"radchkbtn_chk_width", order:79 },
                rowRadChckHeightCheck: { name:"Row RadChk: CHECK Bckgrnd Height", value:30, description:"Height used for Checkbox import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"radchkbtn_chk_height", order:80 },
                rowRadChckLabelHalign: { name:"Row RadChk: Label Horz Alignment", value:'left', description:"Horizontal alignment of text in the button label field.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowbtn', wgtname:"radchkbtn_label_halign", order:73 },
                rowRadChckLabelWidth: { name:"Row RadChk: Label Width", value:150, description:"Button label field width, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"radchkbtn_label_width", order:72 },
                rowRadChckLabelFontSize: { name:"Row RadChk: Label Font Size", value:18, description:"Button label field font size.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"radchkbtn_label_fontsize", order:74 },
                rowRadChckLabelColorUp: { name:"Row RadChk: Label UP Font Color", value:0x5B5F65, description:"Button label font color in the button’s default state.", type:"colour", wgtref: 'rowbtn', wgtname:"radchkbtn_label_fontcolor_up", order:56 },
                rowRadChckLabelColorOver: { name:"Row RadChk: Label OVER Font Color", value:0x5B5F65, description:"Button label font color on button mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"radchkbtn_label_fontcolor_over", order:57 },
                rowRadChckLabelColorDown: { name:"Row RadChk: Label DOWN Font Color", value:0x5B5F65, description:"Button label font color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"radchkbtn_label_fontcolor_down", order:58 },

                // Row Animation Parameters
                rowBtnReverseScaleAlpha: { name:"Row Animation: Enable Single Choice Reverse", value:false, description:"If set true and question type is Single Choice, all unselected buttons will be affected by the DOWN Scale and Transparency parameters when a button is selected.", type:"bool", order:49 },
                rowBtnMouseOverDownShadow: { name:"Row Animation: OVER/DOWN Show Shadow", value:false, description:"If set true, button background will display a shadow on mouse over and when button is selected.", type:"bool", wgtref: 'rowbtn', wgtname:"mouseover_shadow", order:87 },
                rowBtnMouseOverBounce: { name:"Row Animation: OVER Bounce", value:false, description:"If set true, button does a slight bounce on mouse over.", type:"bool", wgtref: 'rowbtn', wgtname:"mouseover_bounce", order:88 },
                rowBtnMouseOverScale: { name:"Row Animation: OVER State Scale", value:100, description:"Button scale size on mouse over. Any value greater than 100 is above normal scale.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"mouseover_scale", order:89 },
                rowBtnMouseDownScale: { name:"Row Animation: DOWN State Scale", value:100, description:"Button scale size on button selection. Any value greater than 100 is above normal scale.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"mousedown_scale", order:90 },
                rowBtnMouseDownAlpha: { name:"Row Animation: DOWN State Transparency", value:100, description:"Button opacity on button selection. The smaller the value the more transparent, the larger the value the less transparent.", type:"number", min:0, max:100, wgtref: 'rowbtn', wgtname:"mousedown_alpha", order:91 },

                // Tooltip Parameters
                rowBtnUseTooltip: { name:"Tooltip: Enable for Row Btn", value:false, description:"If set true and button has a description text, a tooltip will display on button mouse over.", type:"bool", order:92 },
                tooltipWidth: { name:"Tooltip: Bckgrnd Width", value:150, description:"Tooltip background width, in pixels.", type:"number", min:5, wgtref: 'tooltip', wgtname:"tooltip_width", order:93 },
                tooltipLabelHalign: { name:"Tooltip: Text Horz Alignment", value:'left', description:"Tooltip horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'tooltip', wgtname:"tooltip_halign", order:97 },
                tooltipFontSize: { name:"Tooltip: Font Size", value:18, description:"Tooltip font size.", type:"number", min:5, wgtref: 'tooltip', wgtname:"tooltip_fontsize", order:98 },
                tooltipFontColor: { name:"Tooltip: Font Color", value:0x5B5F65, description:"Tooltip font color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_fontcolor", order:99 },

                // Zoom Button Parameters
                zoomActionType: { name:"LightBox: Action Type", value:'click append image', description:"User action type to display image gallery.", type:"combo", options:['click append image', 'click append widget', 'mouseover'], wgtref: 'ctz', wgtname:"action_type", order:52 },
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
                rowKntrInputImpRadio: { name:"Row KantarInput Btn: RADIO Import Bckgrnd", value:"", description:"Import image to use for Radio button types. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"kntrinputbtn_rad_url", order:75, display: false },
                rowKntrInputWidthRadio: { name:"Row KantarInput Btn: RADIO Bckgrnd Width", value:30, description:"Width used for Radio import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_rad_width", order:76, display: false },
                rowKntrInputHeightRadio: { name:"Row KantarInput Btn: RADIO Bckgrnd Height", value:30, description:"Height used for Radio import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_rad_height", order:77, display: false },
                rowKntrInputImpCheck: { name:"Row KantarInput Btn: CHECK Import Bckgrnd", value:"", description:"Import image to use for Checkbox button types. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"kntrinputbtn_chk_url", order:78, display: false },
                rowKntrInputWidthCheck: { name:"Row KantarInput Btn: CHECK Bckgrnd Width", value:30, description:"Width used for Checkbox import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_chk_width", order:79, display: false },
                rowKntrInputHeightCheck: { name:"Row KantarInput Btn: CHECK Bckgrnd Height", value:30, description:"Height used for Checkbox import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_chk_height", order:80, display: false },
                rowKntrInputTxtAreaWidth: { name:"Row KantarInput Btn: Input Field Width", value:125, description:"Button input field width, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_input_width", order:72, display: false },
                rowKntrInputLabelHalign: { name:"Row KantarInput Btn: Label Horz Alignment", value:'left', description:"Horizontal alignment of text in the button label field.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_halign", order:73, display: false },
                rowKntrInputLabelWidth: { name:"Row KantarInput Btn: Label Width", value:150, description:"Button label field width, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_width", order:72, display: false },
                rowKntrInputLabelHoffset: { name:"Row KantarInput Btn: Label Left CSS Pos", value:0, description:"Left CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_left", order:54, display: false },
                rowKntrInputLabelVoffset: { name:"Row KantarInput Btn: Label Top CSS Pos", value:0, description:"Top CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_top", order:55, display: false },
                rowKntrInputLabelFontSize: { name:"Row KantarInput Btn: Label Size", value:18, description:"Button label field font size.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_fontsize", order:74, display: false },
                rowKntrInputLabelColorUp: { name:"Row KantarInput Btn: Label UP Color", value:0x5B5F65, description:"Button label font color in the button’s default state.", type:"colour", wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_fontcolor_up", order:56, display: false },
                rowKntrInputLabelColorOver: { name:"Row KantarInput Btn: Label OVER Color", value:0x5B5F65, description:"Button label font color on button mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_fontcolor_over", order:57, display: false },
                rowKntrInputLabelColorDown: { name:"Row KantarInput Btn: Label DOWN Color", value:0x5B5F65, description:"Button label font color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_fontcolor_down", order:58, display: false },
                rowOtherShowLabel: { name:"Row Other Btn: Display Label", value:false, description:"If set false, button label will not display.", type:"bool", order:60, display: false },
                rowOtherInputHalign: { name:"Row Other Btn: Input Horz Alignment", value:'left', description:"Horizontal text alignment of input field.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowbtn', wgtname:"textarea_halign", order:52, display: false },
                rowOtherInputFontSize: { name:"Row Other Btn: Input Font Size", value:16, description:"Input field font size, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"textarea_fontsize", order:53, display: false },
                rowOtherInputColor: { name:"Row Other Btn: Input Color", value:0x5B5F65, description:"Input field font color.", type:"colour", wgtref: 'rowbtn', wgtname:"textarea_fontcolor", order:56, display: false },
                rowOtherInitTxt: { name:"Row Other Btn: Default Text", value:"Please specify...", description:"Initial text to display in the input textarea.", type:"string", wgtref: 'rowbtn', wgtname:"other_init_txt", order:81, display: false },
                rowOtherInvalidMsg: { name:"Row Other Numeric Btn: Invalid Msg Text", value:"Number is invalid", description:"Message to display when an invalid number is inputted.", type:"string", wgtref: 'rowbtn', wgtname:"other_msg_invalid", order:85, display: false },
                rowOtherRangeMsg: { name:"Row Other Numeric Btn: Range Msg Text", value:"Number must be >= min & <= max", description:"Message to display when an inputted number is not within range. If the message contains the word min and/or max, they will be substituted for their respective numeric parameter values.", type:"string", wgtref: 'rowbtn', wgtname:"other_msg_range", order:86, display: false },
                rowOtherMsgWidth: { name:"Row Other Numeric Btn: Msg Width", value:100, description:"Width of error message label field, in pixels.", type:"number", min:5, order:84, display: false },
                rowOtherMinVal: { name:"Row Other Numeric Btn: Min Input Value", value:1, description:"Minimum numeric input allowed.", type:"number", wgtref: 'rowbtn', wgtname:"other_min", order:82, display: false },
                rowOtherMaxVal: { name:"Row Other Numeric Btn: Max Input Value", value:100, description:"Maximum numeric input allowed.", type:"number", wgtref: 'rowbtn', wgtname:"other_max", order:83, display: false },
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
         * Call to create a group parameter objects -- accepted values are 'rowcontain' and 'tooltip'.
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
            // Used in conjunction w/ component Controller
            this.qStudioVar.respRef = {
                row: [],        // Stores a reference of each row in component
                respArry: [],   // Stores row responses
                hardCapMet : false
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
                respRef = this.qStudioVar.respRef,
                params = this.qStudioVar.params,
                dcProxy = this.qStudioVar.dcProxy,
                rowArray = this.qStudioVar.rowArray,
                rowContainType = params.rowContainType.value.toLowerCase(),
                rowContainConfigObj = this.paramObj('rowcontain'),
                rowBtnConfigObj = this.paramObj('rowbtn'),
                toolTipConfigObj = this.paramObj('tooltip'),
                ctzConfigObj = this.paramObj('ctz'),
                touchEnabled = QUtility.isTouchDevice(),
                isMSTouch = QUtility.isMSTouch(),
                compContain = null,
                rowContain = null,
                rowContainBckgrndDispType = params.rowContainBckgrndDispType.value.toLowerCase(),
                syncTxtBtnHeight = (params.rowTxtBtnAdjustHeightType.value === "all"),
                syncTxtBtnArray = [],
                maxTxtBtnHeight = 0;

            // Init External Widgets
            toolTipConfigObj.isRTL = that.qStudioVar.isCompRTL;
            QStudioCompFactory.lightBoxFactory("basic", doc.body, ctzConfigObj);
            QStudioCompFactory.toolTipFactory("", doc.body, toolTipConfigObj);
            QStudioCompFactory.msgDisplayFactory("", {
                errormsg_width: params.rowOtherMsgWidth.value,
                errormsg_fontsize: 14,
                errormsg_fontcolor: 0xFF0000,
                errormsg_halign: "left",
                isRTL: that.qStudioVar.isCompRTL
            });

            // If component is setup for Hard Capping, make sure to hide QStudio Survey Next button
            if (this.capType() === "hard" && this.qStudioVar.isDC && dcProxy) {
                dcProxy.hideNextButton();
            }

            // Row Container settings
            params.rowBtnReverseScaleAlpha.value = (this.questionType() === "single" && params.rowBtnReverseScaleAlpha.value);
            rowContainConfigObj.id = "QRowContainer";
            rowContainConfigObj.isRTL = that.qStudioVar.isCompRTL;
            rowContainConfigObj.show_bckgrnd = (rowContainBckgrndDispType === "vector");
            rowContainConfigObj.show_bckgrnd_import = (rowContainBckgrndDispType === "import");
            rowContainConfigObj.direction = (rowContainType.indexOf("vertical") !== -1) ? "vertical" : "horizontal";

            // Row Button settings
            rowBtnConfigObj.isRTL = that.qStudioVar.isCompRTL;
            rowBtnConfigObj.txtbtn_trim = (params.rowTxtBtnAdjustHeightType.value !== "none");
            rowBtnConfigObj.reverse_scale = params.rowBtnReverseScaleAlpha.value;

            // Component Container CSS Style
            compContain = doc.createElement("div");
            compContain.id = "RowPickerComponent";
            compContain.dir = (!that.qStudioVar.isCompRTL) ? 'ltr' :'rtl';
            compContain.className = "qrowpicker_component";
            compContain.style.position = params.compContainPos.value;
            compContain.style.width = "100%";
            compContain.style.height = "100%";
            parent = (parent && parent.nodeType === 1) ? parent : doc.body;
            parent.appendChild(compContain);

            if (touchEnabled) {
                // To ensure open-ended widgets lose focus when user taps somewhere besides textarea
                $(doc.body).on((!isMSTouch) ? "touchstart.rowpicker" : (window.PointerEvent) ? "pointerdown.rowpicker" : "MSPointerDown.rowpicker", function() {
                    document.activeElement.blur();
                });
            }

            // Row Container Init
            rowContain = QStudioCompFactory.layoutFactory(
                rowContainType.substr(0, rowContainType.indexOf('layout')-1),
                compContain,
                rowContainConfigObj
            );

            // Add Row Widgets to Row Container
            for (var i=0, rlen=rowArray.length; i<rlen; i+=1) {
                var userDefType = jQuery.trim(rowArray[i].var1 || rowArray[i].type).toLowerCase(),
                    isRadio = (rowArray[i].var2 || rowArray[i].isRadio),
                    rowBtnType = params.rowBtnDefaultType.value,
                    rowWgt = null;

                // Set user defined type, but make sure its one of the accepted values
                if (that.isRowTypeValid(userDefType)) { rowBtnType = userDefType; }

                rowBtnConfigObj.show_label = params[(rowBtnType.toLowerCase().indexOf("other") === -1) ? "rowBtnShowLabel" : "rowOtherShowLabel"].value;
                rowBtnConfigObj.rowIndex = i;
                rowBtnConfigObj.id = rowArray[i].id || 'row_'+i;
                rowBtnConfigObj.isRadio =
                    (this.questionType() === 'single') || (isRadio && isRadio.toString().toLowerCase().indexOf("true") !== -1);
                rowBtnConfigObj.label = rowArray[i].label;
                rowBtnConfigObj.description = rowArray[i].description;
                rowBtnConfigObj.image = rowArray[i].image;
                rowBtnConfigObj.width = rowArray[i].width || params.rowBtnWidth.value;
                rowBtnConfigObj.height = rowArray[i].height || params.rowBtnHeight.value;
                rowBtnConfigObj.show_bckgrnd_import = (typeof rowArray[i].showImpBckgrnd === 'boolean') ?
                    rowArray[i].showImpBckgrnd : ((!rowBtnConfigObj.isRadio) ? params.rowChkShowImp.value : params.rowRadShowImp.value);
                rowBtnConfigObj.bckgrnd_import_up = rowArray[i].bckgrndUp ||
                    ((!rowBtnConfigObj.isRadio) ? params.rowChkImpUp.value : params.rowRadImpUp.value);
                rowBtnConfigObj.bckgrnd_import_over = rowArray[i].bckgrndOver ||
                    ((!rowBtnConfigObj.isRadio) ? params.rowChkImpOver.value : params.rowRadImpOver.value);
                rowBtnConfigObj.bckgrnd_import_down = rowArray[i].bckgrndDown ||
                    ((!rowBtnConfigObj.isRadio) ? params.rowChkImpDown.value : params.rowRadImpDown.value);
                rowBtnConfigObj.use_tooltip = (typeof rowArray[i].useTooltip === 'boolean') ?
                    rowArray[i].useTooltip : params.rowBtnUseTooltip.value;
                rowBtnConfigObj.use_lightbox = (typeof rowArray[i].useZoom === 'boolean') ?
                    rowArray[i].useZoom : params.rowBtnUseZoom.value;

                // Create Row Button Widget
                rowWgt = QStudioCompFactory.widgetFactory(
                    rowBtnType,
                    compContain,
                    rowBtnConfigObj
                );

                // Set whether row should be enabled determined via render state.
                rowWgt.enabled(this.qStudioVar.interact, { alphaVal: 100 });

                // Check to see if user is on touch device and take appropriate action
                rowWgt.touchEnabled(touchEnabled);

                // Create 'rowIndex' attribute for row widget
                rowWgt.widget().setAttribute('rowIndex', i.toString());

                // Store reference of Row Widget for use w/ Controller
                respRef.row.push(rowWgt);

                if (!syncTxtBtnHeight) {
                    // Add to row container
                    rowContain.add(rowWgt, !!rowArray[i].ownRow);
                } else {
                    if (rowBtnType.toLowerCase() === "text") {
                        syncTxtBtnArray[i] = rowWgt;
                        // Record wigdet max height
                        maxTxtBtnHeight = Math.max(maxTxtBtnHeight, $(rowWgt.widget()).outerHeight());
                    }
                }
            }

            // If syncing widget button height; Applies to text button widgets
            if (syncTxtBtnHeight) {
                for (var i=0, rlen=rowArray.length; i<rlen; i+=1) {
                    var rowWgt = respRef.row[i];
                    if (syncTxtBtnArray[i]) {
                        rowWgt.config({
                            height : maxTxtBtnHeight,
                            txtbtn_trim : false
                        });
                    }

                    // Add to row container
                    rowContain.add(rowWgt, !!rowArray[i].ownRow);
                }
            }

            rowContainConfigObj = null;
            rowBtnConfigObj = null;

            /*
             * COMPONENT EVENT HANDLERS
             */

            // Add MOUSE CLICK, TOUCHSTART, & TOUCHEND EVENTS
            var eventStr = (!isMSTouch) ?
                    ((!touchEnabled) ? "click.rowpicker" : "touchstart.rowpicker touchend.rowpicker touchmove.rowpicker"):
                    ((!touchEnabled) ? "click.rowpicker" : ((window.PointerEvent) ? "pointerdown.rowpicker pointerup.rowpicker" : "MSPointerDown.rowpicker MSPointerUp.rowpicker")),
                txtEvent = ("oninput" in compContain) ? "input.rowpicker" : "keyup.rowpicker",
                isTouchMove = false;

            $(compContain).on(eventStr, '.qwidget_button', function(event) {
                event.stopPropagation();
                var row = respRef.row[event.currentTarget.getAttribute('rowIndex')];
                if (isMSTouch && touchEnabled && !event.originalEvent.isPrimary) { return; }
                if (!row.enabled()) { return; }
                if (event.type !== "touchmove") {
                    if (event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                        if (!isTouchMove) { that.manageClick(row); }
                    } else {
                        isTouchMove = false;
                    }
                } else {
                    isTouchMove = true;
                }
            });

            // Add CHANGE EVENT
            $(compContain).on(txtEvent, '.qwidget_button', function(event) {
                //console.log("CHANGE EVENT");
                var row = respRef.row[event.currentTarget.getAttribute('rowIndex')];
                if (!row.enabled()) { return; }
                if (row.isOther()) { that.manageChange(row); }
            });
        },

        reverseAnim: function() {
            var rowRespRef = this.qStudioVar.respRef.row;
            for (var i = 0, ilen = rowRespRef.length; i<ilen; i+=1) {
                var rowwgt = rowRespRef[i];
                rowwgt.reverseAnim(!rowwgt.isAnswered());
            }
        },

        /*
         * Manage CLICK responses for Row Button Widgets
         * @param row {Object}: clicked row button widget
         */
        manageClick: function(row) {
            var dcProxy = this.qStudioVar.dcProxy,
                respRef = this.qStudioVar.respRef,
                rowIndex = row.rowIndex(),
                isRevAnim = this.qStudioVar.params.rowBtnReverseScaleAlpha.value,
                capType = this.capType(),
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
                if (isRevAnim) { this.reverseAnim(); }
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
        
        /*
         * Manage CHANGE responses for 'Other'/'Other Numeric' Row Button Widgets
         * @param row {Object}: changed row button widget
         */
        manageChange: function(row) {
            var dcProxy = this.qStudioVar.dcProxy,
                respRef = this.qStudioVar.respRef,
                rowIndex = row.rowIndex(),
                isRevAnim = this.qStudioVar.params.rowBtnReverseScaleAlpha.value,
                capType = this.capType(),
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
                    if (isRevAnim) { this.reverseAnim(); }
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
                        if (isRevAnim) { this.reverseAnim(); }
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
        
        /*
         * DC Proxy send CLICK response 
         */
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
        
        /*
         * For use w/ Dimensions. Set row initial responses. 
         * @param respArry{Array} - responses to set
         */
        setDimenResp: function(respArry)
        {
            if (jQuery.isArray(respArry)) {
                var respRef = this.qStudioVar.respRef,
                    params = this.qStudioVar.params;
                    
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
                                row.textarea(params.rowOtherInitTxt.value); 
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
            var respRef = this.qStudioVar.respRef,
                valarray = [],
                json = { Response: { Value: valarray } };

            for (var i=0, rlen=respRef.respArry.length; i<rlen; i+=1)
            {
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