/**
 * LinkedSlider Javascript File
 * Version : 1.2.0
 * Date : 2014-06-17
 *
 * LinkedSlider Component.
 * BaseClassType : Single
 * Requires rowArray dataset.
 * Confluence Link : https://docs.gmi-mr.com/confluence/display/midev/LinkedSlider+Component+Documentation
 *
 * Release 1.2.0
 * - compRTL is now automatically set for Dimensions and Decipher. QFactory utility method 'isSurveyRTL' is used
 * - made adjustments and bug fixes for RTL
 * - Added new parameter rowContainOptHalign which horizontally aligns row options. Options include 'left', 'right', & 'center'. Applies to vertical layout directions only
 * - Added new parameter rowContainOptValign which vertically aligns row options. Options include 'top', 'bottom', & 'middle'. Applies to horizontal layout directions only
 * - Updated MSPointer events per http://msdn.microsoft.com/en-us/library/dn304886(v=vs.85).aspx
 * - Added new public method bindGoogleInitCallback to set a callback function to fire when Google charts is finished loading
 * - For QStudio Component Creation Window RTL display is turned off. Enabling RTL will move content to the right
 *   which is throwing off positioning
 * - Updated events to work better w/ touch scrolling
 *
 */

'use strict';
var LinkedSlider = (function () {
    
    function LinkedSlider() {
        this.qStudioVar = {
            _googleLoadCallback : undefined,
            isCompRTL : false,
            interact : true,
            isDC : false,
            params : this.initParams(),
            rowArray : [],
            rowAcceptedWgts : [
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
    
    LinkedSlider.prototype = {
        
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
                    "var2"              // Slider color
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
            return 'LinkedSlider component description...';  
        },
        
        // Component base class type
        baseClassType: function() {
            // Single column base class type
            return 'single';
        },
        
        // Component question type
        questionType: function() {
            return 'text';
        },
        
        getLibraries: function() {
            return [
                "http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js",
                "https://www.google.com/jsapi",
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
            
        /*
         * Call to init default component parameters
         */
        initParams: function() {
            return {
                // Component Parameters
                compContainPos: { name:"Component Contain: CSS Position", value:"relative", description:"CSS position property for component container element.", type:"combo", options:["absolute", "relative"], order: 4 },
                compIsMandatory: { name:"Component: Is Mandatory", value:false, description:"If set true, mandatory conditions must be met to complete exercise.", type:"bool", order:24 },
                compIsAutoNext: { name:"Component: Is AutoNext", value:false, description:"If set true and component is mandatory, frame will auto advance after mandatory conditions are met.", type:"bool", order:24 },
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

                // Row Slider Parameters
                rowSldrDirection: { name:"Slider: Direction", value:"horizontal", description:"Slider direction.", type:"combo", options:["horizontal", "vertical"], wgtref: 'rowsldr', wgtname:"direction", order:69 },
                rowSldrMaxVal: { name:"Slider: Max Pool Value", value:100, description:"Maximum value allowed for the sum all sliders.", type:"number", min:1, wgtref: 'rowsldr', wgtname:"max", order:71 },
                rowSldrPrecVal: { name:"Slider: Precision Value", value:0, description:"Slider value precision.", type:"number", min:0, wgtref: 'rowsldr', wgtname:"precision", order:72 },
                rowSldrTrackWidth: { name:"Slider Track: Bckgrnd Width", value:400, description:"Track width, in pixels.", type:"number", min:5, wgtref: 'rowsldr', wgtname:"width", order:73 },
                rowSldrTrackHeight: { name:"Slider Track: Bckgrnd Height", value:30, description:"Track height, in pixels.", type:"number", min:5, wgtref: 'rowsldr', wgtname:"height", order:74 },
                rowSldrTrackBorderStyle: { name:"Slider Track: Border Style", value:"solid", description:"Track CSS border style property.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'rowsldr', wgtname:"track_border_style", order:75 },
                rowSldrTrackBorderWidth: { name:"Slider Track: Border Width", value:2, description:"Track border width, in pixels.", type:"number", min:0, wgtref: 'rowsldr', wgtname:"track_border_width", order:76 },
                rowSldrTrackBorderRadius: { name:"Slider Track: Border Radius", value:0, description:"Track border radius, in pixels.", type:"number", min:0, wgtref: 'rowsldr', wgtname:"track_border_radius", order:77 },
                rowSldrTrackBorderColor: { name:"Slider Track: Border Colour", value:0xA6A8AB, description:"Track border color.", type:"colour", wgtref: 'rowsldr', wgtname:"track_border_color", order:78 },
                rowSldrTrackColor: { name:"Slider Track: Bckgrnd Colour", value:0xF2F2F2, description:"Track background color.", type:"colour", wgtref: 'rowsldr', wgtname:"track_color", order:79 },
                rowSldrTrackShowImp: { name:"Slider Track: Show Import", value:false, description:"If set true, track imported image will be displayed instead of track background color.", type:"bool", wgtref: 'rowsldr', wgtname:"show_track_import", order:80 },
                rowSldrTrackImp: { name:"Slider Track: Import Image", value:"", description:"Import track image to use.", type:"bitmapdata", wgtref: 'rowsldr', wgtname:"track_import", order:81 },
                rowSldrShowLabel: { name:"Slider Label: Display", value:true, description:"If set false, slider label will not display.", type:"bool", wgtref: 'rowsldr', wgtname:"show_label", order:62 },
                rowSldrLabelHalign: { name:"Slider Label: Horz Alignment", value:'left', description:"Horizontal alignment of slider label.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowsldr', wgtname:"label_halign", order:63 },
                rowSldrLabelWidth: { name:"Slider Label: Width", value:200, description:"Slider label width, in pixels. Recognized on vertical sliders only.", type:"number", min:5, wgtref: 'rowsldr', wgtname:"label_width", order:64 },
                rowSldrLabelFontSize: { name:"Slider Label: Font Size", value:18, description:"Slider label font size.", type:"number", min:5, wgtref: 'rowsldr', wgtname:"label_fontsize", order:65 },
                rowSldrLabelColor: { name:"Slider Label: Font Color", value:0x5B5F65, description:"Slider label font color.", type:"colour", wgtref: 'rowsldr', wgtname:"label_fontcolor", order:66 },
                rowSldrLabelHoffset: { name:"Slider Label: Left CSS Pos", value:0, description:"Left CSS position value used to offset slider label from its default location, in pixels.", type:"number", wgtref: 'rowsldr', wgtname:"label_left", order:67 },
                rowSldrLabelVoffset: { name:"Slider Label: Top CSS Pos", value:0, description:"Top CSS position value used to offset slider label from its default location, in pixels.", type:"number", wgtref: 'rowsldr', wgtname:"label_top", order:68 },
                rowSldrTickWidth: { name:"Slider Tick: Width", value:2, description:"Track tick width, in pixels.", type:"number", min:1, wgtref: 'rowsldr', wgtname:"tick_width", order:84 },
                rowSldrTickHeight: { name:"Slider Tick: Height", value:10, description:"Track tick height, in pixels.", type:"number", min:1, wgtref: 'rowsldr', wgtname:"tick_height", order:85 },
                rowSldrTickColor: { name:"Slider Tick: Colour", value:0x5B5F65, description:"Track tick color.", type:"colour", wgtref: 'rowsldr', wgtname:"tick_color", order:86 },
                rowSldrTickLabCustomCnt: { name:"Slider Tick: Custom Label Count", value:5, description:"Number of tick labels to display on slider track.", type:"number", min:0, order:36 },
                rowSldrTickLabWidth: { name:"Slider Tick: Label Width", value:80, description:"Track tick label width, in pixels.", type:"number", min:5, wgtref: 'rowsldr', wgtname:"ticklabel_width", order:88 },
                rowSldrTickLabOffset: { name:"Slider Tick: Label Offset", value:0, description:"If slider direction is horizontal, track tick label top CSS position from default location, in pixels. If slider direction is vertical, track tick label left offset from default location, in pixels.", type:"number", wgtref: 'rowsldr', wgtname:"ticklabel_offset", order:89 },
                rowSldrTickLabFontSize: { name:"Slider Tick: Label Font Size", value:14, description:"Track tick label font size.", type:"number", min:5, wgtref: 'rowsldr', wgtname:"ticklabel_fontsize", order:90 },
                rowSldrTickLabColor: { name:"Slider Tick: Label Color", value:0x5B5F65, description:"Track tick label font color.", type:"colour", wgtref: 'rowsldr', wgtname:"ticklabel_fontcolor", order:91 },
                rowSldrHndleShowBckgrnd: { name:"Slider Handle: Show Bckgrnd", value:true, description:"If set false, slider handle background will not display.", type:"bool", wgtref: 'rowsldr', wgtname:"show_handle_bckgrnd", order:112 },
                rowSldrHndleShowImg: { name:"Slider Handle: Show Image", value:true, description:"If set true, row image will be displayed on slider handle.", type:"bool", order:112 },
                rowSldrHndleSnapType: { name:"Slider Handle: Snap Type", value:"none", description:"Slider handle snapping type.", type:"combo", options:["none", "snap before", "snap after"], wgtref: 'rowsldr', wgtname:"snap_type", order:105 },
                rowSldrHndleWidth: { name:"Slider Handle: Bckgrnd Width", value:30, description:"Slider handle background width, in pixels.", type:"number", min:5, wgtref: 'rowsldr', wgtname:"handle_width", order:94 },
                rowSldrHndleHeight: { name:"Slider Handle: Bckgrnd Height", value:35, description:"Slider handle background height, in pixels.", type:"number", min:5, wgtref: 'rowsldr', wgtname:"handle_height", order:95 },
                rowSldrHndlePadding: { name:"Slider Handle: Bckgrnd Padding", value:2, description:"Slider handle background padding, in pixels.", type:"number", min:0, wgtref: 'rowsldr', wgtname:"handle_padding", order:95 },
                rowSldrHndleBorderStyle: { name:"Slider Handle: Border Style", value:"solid", description:"Slider handle CSS border style property.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'rowsldr', wgtname:"handle_border_style", order:96 },
                rowSldrHndleBorderWidth: { name:"Slider Handle: Border Width", value:2, description:"Width of the slider handle border, in pixels.", type:"number", min:0, wgtref: 'rowsldr', wgtname:"handle_border_width", order:97 },
                rowSldrHndleBorderRadius: { name:"Slider Handle: Border Radius", value:0, description:"Handle border radius, in pixels.", type:"number", min:0, wgtref: 'rowsldr', wgtname:"handle_border_radius", order:98 },
                rowSldrHndleBorderColorUp: { name:"Slider Handle: Border UP Colour", value:0xA6A8AB, description:"Slider handle border color.", type:"colour", wgtref: 'rowsldr', wgtname:"handle_border_color_up", order:99 },
                rowSldrHndleColorUp: { name:"Slider Handle: Bckgrnd UP Colour", value:0xF2F2F2, description:"Slider handle background color in its default state.", type:"colour", wgtref: 'rowsldr', wgtname:"handle_color_up", order:100 },
                rowSldrHndleColorDown: { name:"Slider Handle: Bckgrnd DOWN Colour", value:0xA6A8AB, description:"Slider handle background color on mouse down.", type:"colour", wgtref: 'rowsldr', wgtname:"handle_color_down", order:101 },
                rowSldrHndleShowImp: { name:"Slider Handle: Show Import Image", value:false, description:"If set true, imported slider handle image will be displayed instead of handle background color.", type:"bool", wgtref: 'rowsldr', wgtname:"show_handle_import", order:102 },
                rowSldrHndleImpUp: { name:"Slider Handle: Import UP Image", value:"", description:"Import background image to use when slider handle is in its default state.", type:"bitmapdata", wgtref: 'rowsldr', wgtname:"handle_import_up", order:103 },
                rowSldrHndleImpDown: { name:"Slider Handle: Import DOWN Image", value:"", description:"Import background image to use on slider handle select.", type:"bitmapdata", wgtref: 'rowsldr', wgtname:"handle_import_down", order:104 },
                rowSldrHndleLabDisplay: { name:"Slider Handle: Show Label", value:true, description:"If set true, slider handle label will display showing the current range value.", type:"bool", order:80 },
                rowSldrHndleLabFontSize: { name:"Slider Handle: Label Font Size", value:16, description:"Slider handle label font size.", type:"number", min:5, wgtref: 'rowsldr', wgtname:"handle_label_fontsize", order:106 },
                rowSldrHndleLabFontColor: { name:"Slider Handle: Label Font Colour", value:0x5B5F65, description:"Slider handle label font color.", type:"colour", wgtref: 'rowsldr', wgtname:"handle_label_fontcolor", order:107 },
                rowSldrHndleLabInitTxt: { name:"Slider Handle: Label Initial Text", value:"Click To Activate", description:"Slider handle label initial text.", type:"string", wgtref: 'rowsldr', wgtname:"handle_label_inittxt", order:108 },
                rowSldrHndleLabWidth: { name:"Slider Handle: Label Width", value:125, description:"Width of slider handle label, in pixels.", type:"number", min:5, wgtref: 'rowsldr', wgtname:"handle_label_width", order:109 },
                rowSldrHndleLabHoffset: { name:"Slider Handle: Label Left CSS Pos", value:0, description:"Left CSS position value used to offset slider handle label from its default location, in pixels.", type:"number", wgtref: 'rowsldr', wgtname:"handle_label_left", order:110 },
                rowSldrHndleLabVoffset: { name:"Slider Handle: Label Top CSS Pos", value:0, description:"Top CSS position value used to offset slider handle label from its default location, in pixels.", type:"number", wgtref: 'rowsldr', wgtname:"handle_label_top", order:111 },
                rowSldrShowEndImg: { name:"Slider Row Image: Display", value:false, description:"If set true, row image will display left of the slider.", type:"bool", wgtref: 'rowsldr', wgtname:"show_end_img", order:112 },
                rowSldrImgEndWidth: { name:"Slider Row Image: Width", value:100, description:"Width of row image, in pixels.", type:"number", min:10, wgtref: 'rowsldr', wgtname:"end_img_width", order:113 },
                rowSldrImgEndHeight: { name:"Slider Row Image: Height", value:100, description:"Height of row image, in pixels.", type:"number", min:10, wgtref: 'rowsldr', wgtname:"end_img_height", order:114 },
                rowSldrImgEndHoffset: { name:"Slider Row Image: Left CSS Pos", value:0, description:"Left CSS position value used to offset row image from their default location, in pixels.", type:"number", wgtref: 'rowsldr', wgtname:"end_img_left", order:115 },
                rowSldrImgEndVoffset: { name:"Slider Row Image: Top CSS Pos", value:0, description:"Top CSS position value used to offset row image from their default location, in pixels.", type:"number", wgtref: 'rowsldr', wgtname:"end_img_top", order:116 },

                // Row Button Background Parameters
                rowBtnDefaultType: { name:"Row Btn: Default Button Type", value:"Base", description:"Default button type used by component.", type:"combo", options:["Base", "Text", "RadioCheck"], order:29 },
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
                rowBtnLabelOverlayPadding: { name:"Row Label Overlay: Label Padding", value:4, description:"Overlay label padding, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"label_overlay_padding", order:32 },

                // Row Button Stamp Parameters
                rowShowStamp: { name:"Row Stamp: Display", value:false, description:"If set true, imported stamp will display when button is selected.", type:"bool", wgtref: 'rowbtn', wgtname:"show_stamp", order:69 },
                rowStampImp: { name:"Row Stamp: Import Image", value:"", description:"Imported stamp image to use on button select.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"stamp_import", order:64 },
                rowStampWidth: { name:"Row Stamp: Width", value:30, description:"Stamp image width, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"stamp_width", order:65 },
                rowStampHeight: { name:"Row Stamp: Height", value:30, description:"Stamp image height, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"stamp_height", order:66 },
                rowStampHoffset: { name:"Row Stamp: Left CSS Pos", value:0, description:"Left CSS position value used to offset button stamp from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"stamp_left", order:67 },
                rowStampVoffset: { name:"Row Stamp: Top CSS Pos", value:0, description:"Top CSS position value used to offset button stamp from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"stamp_top", order:68 },

                // Row Button Specific Parameters
                rowTxtBtnAdjustHeightType: { name:"Row Text: Auto Height Type", value:'none', description:"Select how the auto height feature for Text widgets is applied. When selecting the option all, the max height is calculated across all Text widgets and used as the button height.", type:"combo", options:['none', 'individual', 'all'], order:73 },
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

                // Tooltip Parameters
                rowBtnUseTooltip: { name:"Tooltip: Enable for Row Btn", value:false, description:"If set true and button has a description text, a tooltip will display on button mouse over.", type:"bool", order:92 },
                tooltipWidth: { name:"Tooltip: Bckgrnd Width", value:150, description:"Tooltip background width, in pixels.", type:"number", min:5, wgtref: 'tooltip', wgtname:"tooltip_width", order:93 },
                tooltipLabelHalign: { name:"Tooltip: Text Horz Alignment", value:'left', description:"Tooltip horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'tooltip', wgtname:"tooltip_halign", order:97 },
                tooltipFontSize: { name:"Tooltip: Font Size", value:18, description:"Tooltip font size.", type:"number", min:5, wgtref: 'tooltip', wgtname:"tooltip_fontsize", order:98 },
                tooltipFontColor: { name:"Tooltip: Font Color", value:0x5B5F65, description:"Tooltip font color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_fontcolor", order:99 },

                // Google Chart Parameters
                chartType: { name:"Chart Type", value:"None", description:"Google chart type.", type:"combo", options:["Donut", "2D Pie Chart", "3D Pie Chart", "None"], order: 15 },
                chartPosition: { name:"Chart Position", value:"left", description:"Google chart position with regards to the row container.", type:"combo", options:["left", "right", "top", "bottom"], order: 15 },
                chartLegendPosition: { name:"Chart Legend Position", value:"none", description:"Google chart legend position.", type:"combo", options:["none", "left", "right", "top", "bottom"], order: 15 },
                chartSize: { name:"Chart Size", value:85, description:"Sizes the actual chart.", type:"number", min:50, max: 100, order:90 },
                chartFontSize: { name:"Chart Font Size", value:16, description:"Chart font size.", type:"number", min:5, order:98 },
                chartRemainText: { name:"Chart 'Remaining' Text", value:"% Remaining", description:"Text used to represent percent remaining.", type:"string", order: 17 },
                chartWidth: { name:"Chart Contain Width", value:500, description:"Chart container width, in pixels.", type:"number", min:50, wgtref: 'chart', wgtname:"width", order: 18 },
                chartHeight: { name:"Chart Contain Height", value:500, description:"Chart container height, in pixels.", type:"number", min:50, wgtref: 'chart', wgtname:"height", order: 19 },
                chartHoffset: { name:"Chart Contain Horz Offset", value:0, description:"Left CSS position value used to offset chart container from its default location, in pixels.", type:"number", wgtref: 'chart', wgtname:"left", order: 20 },
                chartVoffset: { name:"Chart Contain Vert Offset", value:0, description:"Top CSS position value used to offset chart container from its default location, in pixels.", type:"number", wgtref: 'chart', wgtname:"top", order: 21 },

                /**********************************/
                // Additional Parameters
                /**********************************/
                rowSldrHndleShowLabelBckgrnd: { name:"Slider Handle: Show Label Bckgrnd", value:false, description:"If set true, handle label background will be displayed.", type:"bool", wgtref: 'rowsldr', wgtname:"show_handle_label_bckgrnd", order:112, display:false },
                rowSldrHndleLabBckgrndColor: { name:"Slider Handle: Label Bckgrnd Colour", value:0xFFFFFF, description:"Slider handle label background color.", type:"colour", wgtref: 'rowsldr', wgtname:"handle_label_bckgrnd_color", order:107, display:false },
                rowBtnImgHoffset: { name:"Row Image: Left CSS Pos", value:0, description:"Left CSS position value used to offset button image from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"img_left", order:62, display:false },
                rowBtnImgVoffset: { name:"Row Image: Top CSS Pos", value:0, description:"Top CSS position value used to offset button image from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"img_top", order:63, display:false },
                rowBtnMouseOverDownShadow: { name:"Row Animation: Mouse OVER/DOWN Show Shadow", value:false, description:"If set true, button background will display a shadow on mouse over and when button is selected.", type:"bool", wgtref: 'rowbtn', wgtname:"mouseover_shadow", order:87, display:false },
                rowBtnMouseOverBounce: { name:"Row Animation: Mouse OVER Bounce", value:false, description:"If set true, button does a slight bounce on mouse over.", type:"bool", wgtref: 'rowbtn', wgtname:"mouseover_bounce", order:88, display:false },
                rowBtnMouseOverScale: { name:"Row Animation: Mouse OVER Scale", value:100, description:"Button scale size on mouse over. Any value greater than 100 is above normal scale.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"mouseover_scale", order:89, display:false },
                rowBtnMouseDownScale: { name:"Row Animation: Mouse DOWN Scale", value:100, description:"Button scale size on button selection. Any value greater than 100 is above normal scale.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"mousedown_scale", order:90, display:false },
                rowBtnMouseDownAlpha: { name:"Row Animation: Mouse DOWN Transparency", value:100, description:"The level of button opacity on button selection. The smaller the value the more transparent, the larger the value the less transparent.", type:"number", min:0, max:100, wgtref: 'rowbtn', wgtname:"mousedown_alpha", order:91, display:false },
                rowRadChckLabelHoffset: { name:"Row RadChk Btn: Label Left CSS Pos", value:0, description:"Left CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"radchkbtn_label_left", order:54, display:false },
                rowRadChckLabelVoffset: { name:"Row RadChk Btn: Label Top CSS Pos", value:0, description:"Top CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"radchkbtn_label_top", order:55, display:false },
                rowKntrInputImpRadio: { name:"Row KantarInput Btn: RADIO Import Bckgrnd", value:"", description:"Import image to use for Radio button types. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"kntrinputbtn_rad_url", order:75, display:false },
                rowKntrInputWidthRadio: { name:"Row KantarInput Btn: RADIO Bckgrnd Width", value:30, description:"Width used for Radio import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_rad_width", order:76, display:false },
                rowKntrInputHeightRadio: { name:"Row KantarInput Btn: RADIO Bckgrnd Height", value:30, description:"Height used for Radio import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_rad_height", order:77, display:false },
                rowKntrInputImpCheck: { name:"Row KantarInput Btn: CHECK Import Bckgrnd", value:"", description:"Import image to use for Checkbox button types. Only 1 image sprite should be used.", type:"bitmapdata", wgtref: 'rowbtn', wgtname:"kntrinputbtn_chk_url", order:78, display:false },
                rowKntrInputWidthCheck: { name:"Row KantarInput Btn: CHECK Bckgrnd Width", value:30, description:"Width used for Checkbox import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_chk_width", order:79, display:false },
                rowKntrInputHeightCheck: { name:"Row KantarInput Btn: CHECK Bckgrnd Height", value:30, description:"Height used for Checkbox import image, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_chk_height", order:80, display:false },
                rowKntrInputTxtAreaWidth: { name:"Row KantarInput Btn: Input Field Width", value:125, description:"Button input field width, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_input_width", order:72, display:false },
                rowKntrInputLabelHalign: { name:"Row KantarInput Btn: Label Horz Alignment", value:'left', description:"Horizontal alignment of text in the button label field.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_halign", order:73, display:false },
                rowKntrInputLabelWidth: { name:"Row KantarInput Btn: Label Width", value:150, description:"Button label field width, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_width", order:72, display:false },
                rowKntrInputLabelHoffset: { name:"Row KantarInput Btn: Label Left CSS Pos", value:0, description:"Left CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_left", order:54, display:false },
                rowKntrInputLabelVoffset: { name:"Row KantarInput Btn: Label Top CSS Pos", value:0, description:"Top CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_top", order:55, display:false },
                rowKntrInputLabelFontSize: { name:"Row KantarInput Btn: Label Size", value:18, description:"Button label field font size.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_fontsize", order:74, display:false },
                rowKntrInputLabelColorUp: { name:"Row KantarInput Btn: Label UP Color", value:0x5B5F65, description:"Button label font color in the button’s default state.", type:"colour", wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_fontcolor_up", order:56, display:false },
                rowKntrInputLabelColorOver: { name:"Row KantarInput Btn: Label OVER Color", value:0x5B5F65, description:"Button label font color on button mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_fontcolor_over", order:57, display:false },
                rowKntrInputLabelColorDown: { name:"Row KantarInput Btn: Label DOWN Color", value:0x5B5F65, description:"Button label font color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"kntrinputbtn_label_fontcolor_down", order:58, display:false },
                rowOtherInputHalign: { name:"Row Other Btn: Input Horz Alignment", value:'left', description:"Horizontal text alignment of input field.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowbtn', wgtname:"textarea_halign", order:52, display:false },
                rowOtherInputFontSize: { name:"Row Other Btn: Input Font Size", value:16, description:"Input field font size, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"textarea_fontsize", order:53, display:false },
                rowOtherInputColor: { name:"Row Other Btn: Input Color", value:0x5B5F65, description:"Input field font color.", type:"colour", wgtref: 'rowbtn', wgtname:"textarea_fontcolor", order:56, display:false },
                rowOtherInitTxt: { name:"Row Other Btn: Default Text", value:"Please specify...", description:"Initial text to display in the input textarea.", type:"string", wgtref: 'rowbtn', wgtname:"other_init_txt", order:81, display:false },
                rowOtherInvalidMsg: { name:"Row Other Numeric Btn: Invalid Msg Text", value:"Number is invalid", description:"Message to display when an invalid number is inputted.", type:"string", wgtref: 'rowbtn', wgtname:"other_msg_invalid", order:85, display:false },
                rowOtherRangeMsg: { name:"Row Other Numeric Btn: Range Msg Text", value:"Number must be >= min & <= max", description:"Message to display when an inputted number is not within range. If the message contains the word min and/or max, they will be substituted for their respective numeric parameter values.", type:"string", wgtref: 'rowbtn', wgtname:"other_msg_range", order:86, display:false },
                rowOtherMsgWidth: { name:"Row Other Numeric Btn: Msg Width", value:100, description:"Width of error message label field, in pixels.", type:"number", min:5, order:84, display:false },
                rowOtherMinVal: { name:"Row Other Numeric Btn: Min Input Value", value:1, description:"Minimum numeric input allowed.", type:"number", wgtref: 'rowbtn', wgtname:"other_min", order:82, display:false },
                rowOtherMaxVal: { name:"Row Other Numeric Btn: Max Input Value", value:100, description:"Maximum numeric input allowed.", type:"number", wgtref: 'rowbtn', wgtname:"other_max", order:83, display:false },
                rowKantBtnLabelWidth: { name:"Row KantarBase Btn: Label Width", value:100, description:"Button label field width, in pixels. If the actual label width ends up being less than the given value, the label width assigned will be the lesser of the two.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kantarbtn_label_width", order:71, display:false },
                tooltipBorderWidth: { name:"Tooltip: Border Width", value:2, description:"Tooltip background border width, in pixels.", type:"number", min:0, wgtref: 'tooltip', wgtname:"tooltip_border_width", order:94, display:false },
                tooltipBorderColor: { name:"Tooltip: Border Color", value:0xA6A8AB, description:"Tooltip background border color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_border_color", order:95, display:false },
                tooltipBckgrndColor: { name:"Tooltip: Bckgrnd Color", value:0xFFFFFF, description:"Tooltip background color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_bckgrnd_color", order:96, display:false },
                zoomActionType: { name:"LightBox: Action Type", value:'click append image', description:"User action type to display image gallery.", type:"combo", options:['click append image', 'click append widget', 'mouseover'], wgtref: 'ctz', wgtname:"action_type", order:52, display:false },
                zoomOverlayBckgrndColor: { name:"LightBox: Overlay Color", value:0x000000, description:"Overlay background color to use when image gallery is displayed.", type:"colour", wgtref: 'ctz', wgtname:"overlay_bckgrnd_color", order:101, display:false },
                zoomOverlayAlpha: { name:"LightBox: Overlay Transparency", value:80, description:"The level of opacity set on the overlay background. The smaller the value the more transparent, the larger the value the less transparent.", type:"number", min:0, max:100, wgtref: 'ctz', wgtname:"overlay_alpha", order:102, display:false },
                zoomGalleryPadding: { name:"LightBox: Image Gallery Padding", value:10, description:"Image gallery padding, in pixels.", type:"number", min:0, wgtref: 'ctz', wgtname:"gallery_padding", order:103, display:false },
                zoomGalleryHoffset: { name:"LightBox: Image Gallery Left CSS Pos", value:0, description:"Left CSS position value used to offset image gallery from its default location, in pixels.", type:"number", wgtref: 'ctz', wgtname:"gallery_left", order:104, display:false },
                zoomGalleryVoffset: { name:"LightBox: Image Gallery Top CSS Pos", value:0, description:"Top CSS position value used to offset image gallery from its default location, in pixels.", type:"number", wgtref: 'ctz', wgtname:"gallery_top", order:105, display:false },
                zoomGalleryBorderStyle: { name:"LightBox: Image Gallery Border Style", value:"none", description:"Image gallery CSS border style property.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'ctz', wgtname:"gallery_border_style", order: 106, display:false },
                zoomGalleryBorderWidth: { name:"LightBox: Image Gallery Border Width", value:0, description:"Image gallery border width, in pixels.", type:"number", min:0, wgtref: 'ctz', wgtname:"gallery_border_width", order: 107, display:false },
                zoomGalleryBorderColor: { name:"LightBox: Image Gallery Border Color", value:0xA6A8AB, description:"Image gallery border color.", type:"colour", wgtref: 'ctz', wgtname:"gallery_border_color", order: 108, display:false },
                zoomBorderWidth: { name:"LightBox: Zoom Btn Border Width", value:1, description:"Click to Zoom button background border width, in pixels.", type:"number", min:0, wgtref: 'ctz', wgtname:"zoom_border_width", order:114, display:false },
                zoomBorderColor: { name:"LightBox: Zoom Btn Border Color", value:0xA6A8AB, description:"Click to Zoom button border color.", type:"colour", wgtref: 'ctz', wgtname:"zoom_border_color", order:115, display:false },
                zoomBckgrndColor: { name:"LightBox: Zoom Btn Bckgrnd Color", value:0xFFFFFF, description:"Click to Zoom button background color.", type:"colour", wgtref: 'ctz', wgtname:"zoom_bckgrnd_color", order:116, display:false },
                rowBtnUseZoom: { name:"LightBox: Enable for Row Btn", value:false, description:"If set true and button has an image, a click to zoom button will be displayed.", type:"bool", order:100, display:false },
                zoomImp: { name:"LightBox: Zoom Btn Import Image", value:"", description:"Click to Zoom button imported icon image.", type:"bitmapdata", wgtref: 'ctz', wgtname:"zoom_import", order:109, display:false },
                zoomWidth: { name:"LightBox: Zoom Btn Width", value:20, description:"Click to Zoom button width, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"zoom_width", order:110, display:false },
                zoomHeight: { name:"LightBox: Zoom Btn Height", value:20, description:"Click to Zoom button height, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"zoom_height", order:111, display:false },
                rowZoomHoffset: { name:"LightBox: Zoom Btn Left CSS Pos", value:0, description:"Left CSS position value used to offset click to zoom button from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"zoom_left", order:112, display:false },
                rowZoomVoffset: { name:"LightBox: Zoom Btn Top CSS Pos", value:0, description:"Top CSS position value used to offset click to zoom button from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"zoom_top", order:113, display:false },
                zoomCloseImp: { name:"LightBox: Close Btn Import Image", value:"", description:"Image gallery close button imported icon image.", type:"bitmapdata", wgtref: 'ctz', wgtname:"close_import", order:117, display:false },
                zoomCloseWidth: { name:"LightBox: Close Btn Width", value:22, description:"Image gallery close button width, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"close_width", order:118, display:false },
                zoomCloseHeight: { name:"LightBox: Close Btn Height", value:22, description:"Image gallery close button height, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"close_height", order:119, display:false },
                zoomCloseHoffset: { name:"LightBox: Close Btn Left CSS Pos", value:0, description:"Left CSS position value used to offset image gallery close button from its default location, in pixels.", type:"number", wgtref: 'ctz', wgtname:"close_left", order:120, display:false },
                zoomCloseVoffset: { name:"LightBox: Close Btn Top CSS Pos", value:0, description:"Top CSS position value used to offset image gallery close button from its default location, in pixels.", type:"number", wgtref: 'ctz', wgtname:"close_top", order:121, display:false }
            };
        },

        bindGoogleInitCallback : function(value) {
            if (typeof value === "function") {
                this.qStudioVar._googleLoadCallback = value;
            } else {
                return this.qStudioVar._googleLoadCallback;
            }
        },
        
        /*
         * Call to create a group parameter objects -- accepted values are 'rowcontain', 'rowsldr', and 'rowbtn'.
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
                isCompAnswered : false,
                chartInit : false,
                sldrTotal: 0,       // Keeps track of slider group total
                rowRefArry: [],     // Stores a reference of each row in component
                btnRespArry: [],    // Stores row button responses
                sldrRespArry: []    // Stores row slider responses
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
                dcProxy = this.qStudioVar.dcProxy,
                interact = this.qStudioVar.interact,
                rowArray = this.qStudioVar.rowArray,
                respRef = this.qStudioVar.respRef,
                params = this.qStudioVar.params,
                rowContainType = params.rowContainType.value.toLowerCase(),
                rowContainConfigObj = this.paramObj('rowcontain'),
                rowSldrConfigObj = this.paramObj('rowsldr'),
                rowBtnConfigObj = this.paramObj('rowbtn'),
                toolTipConfigObj = this.paramObj('tooltip'),
                ctzConfigObj = this.paramObj('ctz'),
                touchEnabled = QUtility.isTouchDevice(),
                isMSTouch = QUtility.isMSTouch(),
                maxValue = params.rowSldrMaxVal.value,
                rowContainBckgrndDispType = params.rowContainBckgrndDispType.value.toLowerCase(),
                sldrRowArray = [],
                btnRowArray = [],
                syncTxtBtnHeight = (params.rowTxtBtnAdjustHeightType.value === "all"),
                syncTxtBtnArray = [],
                maxTxtBtnHeight = 0,
                rowContain = null,
                compContain = null,
                chartConfigObj = this.paramObj('chart'),
                chartSize = (params.chartSize.value >= 50 && params.chartSize.value <= 100) ? params.chartSize.value : 85,
                chartPosition = params.chartPosition.value.toLowerCase(),
                chartType = params.chartType.value.toLowerCase(),
                chartRemainText = params.chartRemainText.value,
                chartContain = null,
                chartDataArry = [],
                chartGoogle = null;

            // QStudio hide survey next button
            if (this.isMandatory()) { dcProxy.hideNextButton(); }

            // Split Button and Slider Column Objects
            var btnFound = false;
            for (var i=0, rlen=rowArray.length; i<rlen; i+=1) {
                var rowWgtType = jQuery.trim(rowArray[i].var1 || rowArray[i].type);
                if (rowWgtType) {
                    rowWgtType = rowWgtType.toString().toLowerCase();
                    for (var j=0, len=this.qStudioVar.rowAcceptedWgts.length; j<len; j+=1) {
                        if (rowWgtType === this.qStudioVar.rowAcceptedWgts[j].toLowerCase()) {
                            btnRowArray = rowArray.slice(i);
                            btnFound = true;
                            break;
                        }
                    }

                    if (btnFound) { break; }
                }

                if (!btnFound) {
                    sldrRowArray.push(rowArray[i]);
                }
            }

            // Throw error if no Sliders are present
            if (sldrRowArray.length === 0) { throw ("No Sliders present."); }

            // Google Chart Utility functions
            this.googleUtility = {
                init: function() {
                    // Init Google Chart Data Array
                    chartDataArry = [['label', 'range'], [chartRemainText, maxValue-respRef.sldrTotal]];
                    for (var i= 0, rlen= rowArray.length; i<rlen; i+=1) {
                        var row = respRef.rowRefArry[i].row;
                        row.enabled(true);
                        if (row.type() === "slider") {
                            chartConfigObj.colors.push(rowArray[i].var2);
                            chartDataArry.push([rowArray[row.rowIndex()].label, 0]);
                        }
                    }

                    /** GOOGLE API **/
                    // Init Google Chart
                    chartGoogle = new google.visualization.PieChart(chartContain);
                    chartGoogle.draw(google.visualization.arrayToDataTable(chartDataArry), chartConfigObj);
                    respRef.chartInit = true;

                    if (respRef.cacheResp) {
                        that.setDimenResp(respRef.cacheResp);
                        delete respRef.cacheResp;
                    }

                    if (that.bindGoogleInitCallback()) { that.bindGoogleInitCallback()(); }
                },

                update: function(rowIndex, rangeValue) {
                    chartDataArry[1] = [chartRemainText, maxValue-respRef.sldrTotal];
                    chartDataArry[rowIndex+2] = [rowArray[rowIndex].label, rangeValue];
                    chartGoogle.draw(google.visualization.arrayToDataTable(chartDataArry), chartConfigObj);
                },

                reset: function()  {
                    chartDataArry = [['label', 'range'], [chartRemainText, maxValue-respRef.sldrTotal]];
                    for (var i=0; i<slen; i+=1) {
                        chartDataArry.push([rowArray[i].label, 0]);
                    }
                    /** GOOGLE API **/
                    chartGoogle.draw(google.visualization.arrayToDataTable(chartDataArry), chartConfigObj);
                }
            };

            // Chart settings
            if (chartType === "donut") { chartConfigObj.pieHole = 0.4; }
            chartConfigObj.backgroundColor = "transparent";
            chartConfigObj.fontSize = params.chartFontSize.value;
            chartConfigObj.colors = [ "#AAAAAA" ];
            chartConfigObj.is3D = (chartType.indexOf('3d') !== -1);
            chartConfigObj.pieSliceText = "percentage";
            chartConfigObj.chartArea = {
                width : chartSize+"%",
                height : chartSize+"%"
            };
            chartConfigObj.legend = {
                alignment : 'center',
                position : params.chartLegendPosition.value.toLowerCase()
            };

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

            // Row Container settings
            if (params.rowContainBorderStyle.value.toLowerCase() === "none") { params.rowContainBorderWidth.value = 0; }
            rowContainConfigObj.id = "QRowContainer";
            rowContainConfigObj.isRTL = that.qStudioVar.isCompRTL;
            rowContainConfigObj.show_bckgrnd = (rowContainBckgrndDispType === "vector");
            rowContainConfigObj.show_bckgrnd_import = (rowContainBckgrndDispType === "import");
            rowContainConfigObj.direction = (rowContainType.indexOf("vertical") !== -1) ? "vertical" : "horizontal";

            // Row Slider settings
            rowSldrConfigObj.isRTL = that.qStudioVar.isCompRTL;
            rowSldrConfigObj.handle_label_disptype = (params.rowSldrHndleLabDisplay.value) ? 'range value' : 'none';
            rowSldrConfigObj.min = 0;
            rowSldrConfigObj.end_img_left *= -1;

            // Row Button settings
            rowBtnConfigObj.isRTL = that.qStudioVar.isCompRTL;
            rowBtnConfigObj.txtbtn_trim = (params.rowTxtBtnAdjustHeightType.value !== "none");

            // Create slider tick labels
            var createTickArray = function(tickLabCustomCnt) {
                var tickLabArray = [],
                    tickIncrem = 0,
                    tickLabCnt = (!(tickLabCustomCnt > 1)) ?
                        ((params.rowSldrTickLabCustomCnt.value >=0) ? params.rowSldrTickLabCustomCnt.value : 0) : tickLabCustomCnt;

                tickIncrem = (tickLabCnt > 1) ? maxValue/(tickLabCnt-1) : 1;
                if (tickIncrem >= 1) {
                    for (var i=0; i<tickLabCnt; i+=1) {
                        tickLabArray.push({ label : Math.round(tickIncrem * i).toString(), image : undefined });
                    }
                }

                return tickLabArray;
            };

            // Component Container CSS Style
            compContain = doc.createElement("div");
            compContain.id = "LinkedSliderComponent";
            compContain.dir = (!that.qStudioVar.isCompRTL) ? 'ltr' :'rtl';
            compContain.className = "qlinkedslider_component";
            compContain.style.position = params.compContainPos.value;
            compContain.style.width = "100%";
            compContain.style.height = "100%";
            parent = (parent && parent.nodeType === 1) ? parent : doc.body;
            parent.appendChild(compContain);

            if (touchEnabled) {
                // To ensure open-ended widgets lose focus when user taps somewhere besides textarea
                $(doc.body).on((!isMSTouch) ? "touchstart.linkedslider" : (window.PointerEvent) ? "pointerdown.linkedslider" : "MSPointerDown.linkedslider", function() {
                    document.activeElement.blur();
                });
            }

            // Row Container Init
            rowContain = QStudioCompFactory.layoutFactory(
                rowContainType.substr(0, rowContainType.indexOf('layout')-1),
                compContain,
                rowContainConfigObj
            );

            // Create Row Sliders and add to Row Container
            for (var i=0, slen=sldrRowArray.length; i<slen; i+=1) {
                sldrRowArray[i].var2 = QUtility.paramToHex(sldrRowArray[i].var2);
                if (sldrRowArray[i].var2 === false) {
                    sldrRowArray[i].var2 = (0x1000000+(Math.random())*0xFFFFFF).toString(16).substr(1,6);
                }

                rowSldrConfigObj.rowIndex = i;
                rowSldrConfigObj.id = sldrRowArray[i].id || 'row_'+i;
                rowSldrConfigObj.label = sldrRowArray[i].label;
                rowSldrConfigObj.highlight_color = sldrRowArray[i].var2;
                rowSldrConfigObj.handle_border_color_down = sldrRowArray[i].var2;
                rowSldrConfigObj.tick_array = createTickArray(parseInt(sldrRowArray[i].var1, 10));
                if (params.rowSldrShowEndImg.value) { rowSldrConfigObj.tick_array[0].image = sldrRowArray[i].image; }
                if (params.rowSldrHndleShowImg.value) { rowSldrConfigObj.image = sldrRowArray[i].image; }

                // Create Row Slider Widget
                var rowWgt = QStudioCompFactory.widgetFactory(
                    'baseslider',
                    compContain,
                    rowSldrConfigObj
                );

                rowWgt.enabled((interact && chartType === 'none'), 35);

                // Create 'rowIndex' attribute for Row Widget
                rowWgt.widget().setAttribute('rowIndex', i.toString());

                // Add callback functions to slider
                (function(sldr) {
                    sldr.slideInit(function() {
                        var rowIndex = sldr.rowIndex(),
                            trackSize = (params.rowSldrDirection.value.toLowerCase() === "horizontal") ?
                                params.rowSldrTrackWidth.value : params.rowSldrTrackHeight.value,
                            ctrlRangeVal = respRef.rowRefArry[rowIndex].rangeValue,
                            loc = null;

                        if (ctrlRangeVal === null) { ctrlRangeVal = 0; }
                        loc = ((maxValue - respRef.sldrTotal + ctrlRangeVal) / maxValue) * trackSize;
                        (params.rowSldrDirection.value.toLowerCase() === "horizontal" && !that.qStudioVar.isCompRTL) ?
                            sldr.setHandleBounds({ maxLoc: loc }):
                            sldr.setHandleBounds({ minLoc: trackSize-loc });
                    });

                    sldr.slideMove(function() {
                        var rowIndex = sldr.rowIndex(),
                            rangeValue = sldr._rangeValue(),
                            ctrlRangeVal = respRef.rowRefArry[rowIndex].rangeValue;

                        if (params.rowSldrHndleSnapType.value.toLowerCase() !== "snap after") {
                            respRef.rowRefArry[rowIndex].rangeValue = rangeValue;
                            if (ctrlRangeVal !== null) { respRef.sldrTotal -= ctrlRangeVal; }
                            respRef.sldrTotal += rangeValue;
                        }
                    });

                    sldr.slideEnd(function() {
                        if (params.rowSldrHndleSnapType.value.toLowerCase() === "snap after") {
                            var rowIndex = sldr.rowIndex(),
                                rangeValue = sldr._rangeValue(),
                                ctrlRangeVal = respRef.rowRefArry[rowIndex].rangeValue;

                            respRef.rowRefArry[rowIndex].rangeValue = sldr._rangeValue();
                            if (ctrlRangeVal !== null) { respRef.sldrTotal -= ctrlRangeVal; }
                            respRef.sldrTotal += rangeValue;
                        }

                        that.manageSlide(sldr);
                        if (chartType !== 'none') {
                            var rowIndex = sldr.rowIndex(),
                                rangeValue = sldr._rangeValue();

                            that.googleUtility.update(rowIndex, rangeValue);
                        }
                    });
                }(rowWgt));

                // Add to row container
                if (!syncTxtBtnHeight) { rowContain.add(rowWgt); }

                // Store reference of Row Widget for use w/ Controller
                respRef.rowRefArry.push({
                    row: rowWgt,
                    rangeValue: null
                });
            }

            // Create Row Buttons and add to Row Container
            for (var i=0, blen=btnRowArray.length; i<blen; i+=1) {
                var userDefType = jQuery.trim(btnRowArray[i].var1 || btnRowArray[i].type).toLowerCase(),
                    isRadio = true,
                    rowBtnType = params.rowBtnDefaultType.value,
                    rowIndex = jQuery.inArray(btnRowArray[i], rowArray),
                    rowWgt = null;

                // Set user defined type, but make sure its one of the accepted values
                if (that.isRowTypeValid(userDefType)) { rowBtnType = userDefType; }
                if (typeof btnRowArray[i].var2 === "boolean") { isRadio = btnRowArray[i].var2; }
                if (typeof btnRowArray[i].isRadio === "boolean") { isRadio = btnRowArray[i].isRadio; }

                rowBtnConfigObj.rowIndex = rowIndex;
                rowBtnConfigObj.id = btnRowArray[i].id || 'row_'+rowIndex;
                rowBtnConfigObj.isRadio = (isRadio && isRadio.toString().toLowerCase().indexOf("true") !== -1);
                rowBtnConfigObj.label = btnRowArray[i].label;
                rowBtnConfigObj.description = btnRowArray[i].description;
                rowBtnConfigObj.image = btnRowArray[i].image;
                rowBtnConfigObj.width = btnRowArray[i].width || params.rowBtnWidth.value;
                rowBtnConfigObj.height = btnRowArray[i].height || params.rowBtnHeight.value;
                rowBtnConfigObj.show_bckgrnd_import = (typeof btnRowArray[i].showImpBckgrnd === 'boolean') ?
                    btnRowArray[i].showImpBckgrnd : ((!rowBtnConfigObj.isRadio) ? params.rowChkShowImp.value : params.rowRadShowImp.value);
                rowBtnConfigObj.bckgrnd_import_up = btnRowArray[i].bckgrndUp ||
                    ((!rowBtnConfigObj.isRadio) ? params.rowChkImpUp.value : params.rowRadImpUp.value);
                rowBtnConfigObj.bckgrnd_import_over = btnRowArray[i].bckgrndOver ||
                    ((!rowBtnConfigObj.isRadio) ? params.rowChkImpOver.value : params.rowRadImpOver.value);
                rowBtnConfigObj.bckgrnd_import_down = btnRowArray[i].bckgrndDown ||
                    ((!rowBtnConfigObj.isRadio) ? params.rowChkImpDown.value : params.rowRadImpDown.value);
                rowBtnConfigObj.use_tooltip = (typeof btnRowArray[i].useTooltip === 'boolean') ?
                    btnRowArray[i].useTooltip : params.rowBtnUseTooltip.value;
                rowBtnConfigObj.use_lightbox = (typeof btnRowArray[i].useZoom === 'boolean') ?
                    btnRowArray[i].useZoom : params.rowBtnUseZoom.value;

                // Create Row Button Widget
                rowWgt = QStudioCompFactory.widgetFactory(
                    rowBtnType,
                    compContain,
                    rowBtnConfigObj
                );

                // Set whether row should be enabled determined via render state.
                rowWgt.enabled((interact && chartType === 'none'), { alphaVal: 35 });

                // Check to see if user is on touch device and take appropriate action
                rowWgt.touchEnabled(touchEnabled);

                // Create 'rowIndex' attribute for row widget
                rowWgt.widget().setAttribute('rowIndex', rowIndex.toString());

                // Store reference of Row Widget for use w/ Controller
                respRef.rowRefArry.push({
                    row: rowWgt
                });

                if (!syncTxtBtnHeight) {
                    // Add to row container
                    rowContain.add(rowWgt, !!btnRowArray[i].ownRow);
                } else {
                    if (rowBtnType.toLowerCase() === "text") {
                        syncTxtBtnArray[rowIndex] = rowWgt;
                        // Record wigdet max height
                        maxTxtBtnHeight = Math.max(maxTxtBtnHeight, $(rowWgt.widget()).outerHeight());
                    }
                }
            }

            // If syncing widget button height; Applies to text button widgets
            if (syncTxtBtnHeight) {
                for (var i=0, rlen=rowArray.length; i<rlen; i+=1) {
                    var rowWgt = respRef.rowRefArry[i].row;
                    if (syncTxtBtnArray[i]) {
                        rowWgt.config({
                            height : maxTxtBtnHeight,
                            txtbtn_trim : false
                        });
                    }

                    // Add to row container
                    rowContain.add(rowWgt, (rowWgt.type() === "button" && !!rowArray[i].ownRow));
                }
            }

            // LOAD Google Chart
            if (chartType !== 'none' && interact) {
                // Chart Container DIV
                var chartPadding = (chartSize <= 95) ? 0 : 10;
                chartConfigObj.width -= chartPadding*2;
                chartConfigObj.height -= chartPadding*2;
                chartContain = doc.createElement('div');
                chartContain.className = 'linksldr_chart_container';
                chartContain.style.color = '#555';
                chartContain.style.position = 'relative';
                chartContain.style.width = chartConfigObj.width + 'px';
                chartContain.style.height = chartConfigObj.height + 'px';
                chartContain.style.padding = chartPadding + 'px';
                chartContain.style.borderStyle = params.rowContainBorderStyle.value;
                chartContain.style.borderWidth = params.rowContainBorderWidth.value + "px";
                chartContain.style.borderColor = "#" + QUtility.paramToHex(params.rowContainBorderColor.value);

                var rowContainBorder = params.rowContainBorderWidth.value,
                    fullRowContainWidth = parseInt(rowContain.container().style.width, 10),
                    fullRowContainHeight = parseInt(rowContain.container().style.height, 10),
                    rowContainWidth = fullRowContainWidth - rowContainBorder*2 - chartPadding*2,
                    rowContainHeight = fullRowContainHeight - rowContainBorder*2 - chartPadding*2;

                switch (chartPosition) {
                    case "top" :
                        chartConfigObj.width = rowContainWidth;
                        chartContain.style.width = rowContainWidth + 'px';
                        chartContain.style.marginTop = chartConfigObj.top + 'px';
                        chartContain.style[(!that.qStudioVar.isCompRTL) ? "marginLeft" : "marginRight"] = chartConfigObj.left + 'px';
                        rowContain.container().style.marginTop = (rowContainConfigObj.top - rowContainBorder) + "px";
                        compContain.insertBefore(chartContain, rowContain.container());
                        break;
                    case "bottom" :
                        chartConfigObj.width = rowContainWidth;
                        chartContain.style.width = rowContainWidth + 'px';
                        chartContain.style[(!that.qStudioVar.isCompRTL) ? "marginLeft" : "marginRight"] = chartConfigObj.left + 'px';
                        chartContain.style.marginTop = (chartConfigObj.top - rowContainBorder) + "px";
                        compContain.appendChild(chartContain);
                        break;
                    case "right" :
                        chartConfigObj.height = rowContainHeight;
                        chartContain.style.height = rowContainHeight + 'px';

                        if (!that.qStudioVar.isCompRTL) {
                            chartContain.style.marginLeft =
                                (rowContainWidth + rowContainBorder + chartConfigObj.left + rowContainConfigObj.left + chartPadding*2) + 'px';
                        } else {
                            chartContain.style.marginRight = chartConfigObj.left + "px";
                            rowContain.container().style.marginRight =
                                (chartConfigObj.width + rowContainBorder + chartConfigObj.left + rowContainConfigObj.left + chartPadding*2) + 'px';
                        }

                        if (chartConfigObj.top < rowContainConfigObj.top) {
                            compContain.insertBefore(chartContain, rowContain.container());
                            rowContain.container().style.marginTop = -($(rowContain.container()).outerHeight() - rowContainConfigObj.top) + 'px';
                        } else {
                            chartContain.style.marginTop = (chartConfigObj.top - $(rowContain.container()).outerHeight(true)) + 'px';
                            compContain.appendChild(chartContain);
                        }
                        break;
                    default :
                        chartConfigObj.height = rowContainHeight;
                        chartContain.style.height = rowContainHeight + 'px';

                        if (!that.qStudioVar.isCompRTL) {
                            chartContain.style.marginLeft = chartConfigObj.left + 'px';
                            rowContain.container().style.marginLeft =
                                (chartConfigObj.width + rowContainBorder + chartConfigObj.left + rowContainConfigObj.left + chartPadding*2) + 'px';
                        } else {
                            chartContain.style.marginRight =
                                (rowContainWidth + rowContainBorder + chartConfigObj.left + rowContainConfigObj.left + chartPadding*2) + 'px';
                        }

                        if (chartConfigObj.top < rowContainConfigObj.top) {
                            compContain.insertBefore(chartContain, rowContain.container());
                            rowContain.container().style.marginTop = -($(rowContain.container()).outerHeight() - rowContainConfigObj.top) + 'px';
                        } else {
                            chartContain.style.marginTop = (chartConfigObj.top - $(rowContain.container()).outerHeight(true)) + 'px';
                            compContain.appendChild(chartContain);
                        }
                        break;
                }

                var preload = new QPreloader();
                preload.initModule(chartContain);
                preload.getLoader().style.left = ((parseInt(chartContain.style.width, 10)-101)*0.5)+"px";
                preload.getLoader().style.top = 10 + "px";

                /** GOOGLE API **/
                google.load("visualization", "1", { packages:["corechart"], callback: that.googleUtility.init });
            }

            // Add MOUSE CLICK, TOUCHSTART, & TOUCHEND EVENTS
            var eventStr = (!isMSTouch) ?
                    ((!touchEnabled) ? "click.linkedslider" : "touchstart.linkedslider touchend.linkedslider touchmove.linkedslider"):
                    ((!touchEnabled) ? "click.linkedslider" : ((window.PointerEvent) ? "pointerdown.linkedslider pointerup.linkedslider" : "MSPointerDown.linkedslider MSPointerUp.linkedslider")),
                txtEvent = ("oninput" in compContain) ? "input.linkedslider" : "keyup.linkedslider",
                isTouchMove = false;

            $(compContain).on(eventStr, '.qwidget_button', function(event) {
                event.stopPropagation();
                var row = respRef.rowRefArry[event.currentTarget.getAttribute('rowIndex')].row;
                if (isMSTouch && touchEnabled && !event.originalEvent.isPrimary) { return; }
                if (!row.enabled()) { return; }

                if (event.type !== "touchmove") {
                    if (event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                        if (isTouchMove) { return; }
                        that.manageClick(row);
                        if (row.isAnswered() && chartType !== 'none') { that.googleUtility.reset(); }
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
                var row = respRef.rowRefArry[event.currentTarget.getAttribute('rowIndex')].row;
                if (!row.enabled()) { return; }
                if (row.isOther()) {
                    that.manageChange(row);
                    if (row.isAnswered() && chartType !== 'none') { that.googleUtility.reset(); }
                }
            });
        },

        manageSlide: function(slider) {
            var respRef = this.qStudioVar.respRef,
                rangeValue = slider._rangeValue(),
                rowIndex = slider.rowIndex();

            // Unselect currently selected row column button(s)
            while(respRef.btnRespArry.length !== 0) {
                respRef.btnRespArry[0].isAnswered(false);
                this.sendResponse(respRef.btnRespArry[0].rowIndex(), "");
                respRef.btnRespArry.shift();
            }

            // Answer slider
            this.sendResponse(rowIndex, rangeValue);
            respRef.rowRefArry[rowIndex].rangeValue = rangeValue;
            this._setIsCompAnswered(respRef.sldrTotal === this.qStudioVar.params.rowSldrMaxVal.value);

            // Push slider to sldrRespArry
            if (jQuery.inArray(slider, respRef.sldrRespArry) === -1) {
                respRef.sldrRespArry.push(slider);
            }

            return true;
        },

         /*
         * Manage CLICK responses for Row Button Widgets
         * @param row {Object}
         */
        manageClick: function(row) {
            var rowIndex = row.rowIndex(),
                respRef = this.qStudioVar.respRef,
                spliceInd = -1,
                inputValid = (!row.isOther()) ? true : row.isInputValid();
            
            if (!row.isAnswered()) { 
                if (!inputValid) { return; }
                // Unselect currently selected button(s)
                if (row.isRadio()) {
                    while(respRef.btnRespArry.length !== 0) {
                        respRef.btnRespArry[0].isAnswered(false);
                        this.sendResponse(respRef.btnRespArry[0].rowIndex(), "");
                        respRef.btnRespArry.shift();                   
                    }
                } else {
                    var rowRadio = respRef.btnRespArry[0];
                    if (rowRadio && rowRadio.isRadio() && rowRadio.isAnswered()) {
                        rowRadio.isAnswered(false);
                        this.sendResponse(rowRadio.rowIndex(), "");
                        respRef.btnRespArry = [];
                    }
                }
                
                // Unselect slider(s) if currently answered
                respRef.sldrTotal = 0;
                while(respRef.sldrRespArry.length !== 0) {
                    var sldr = respRef.sldrRespArry[0];
                    sldr.isAnswered(false);
                    respRef.rowRefArry[sldr.rowIndex()].rangeValue = null;
                    this.sendResponse(sldr.rowIndex(), "");
                    respRef.sldrRespArry.shift();                   
                }
                
                row.isAnswered(true);
                this.sendResponse(rowIndex, (row.isOther()) ? row.textarea() : this.qStudioVar.rowArray[rowIndex].label);
                respRef.btnRespArry.push(row);
                this._setIsCompAnswered(true);
                return true; 
            } else {
                if (!row.isRadio()) {
                    spliceInd = jQuery.inArray(row, respRef.btnRespArry);
                    if (spliceInd !== -1) {
                        row.isAnswered(false);
                        this.sendResponse(rowIndex, "");
                        respRef.btnRespArry.splice(spliceInd, 1);
                        this._setIsCompAnswered(respRef.btnRespArry.length > 0);
                        return (respRef.btnRespArry.length > 0);
                    }
                } 
            }                                     
        },
        
        /*
         * Manage CHANGE responses for 'Other' Row Button Widgets
         * @param row {Object}
         */
        manageChange: function(row) {
            var rowIndex = row.rowIndex(),
                respRef = this.qStudioVar.respRef,
                spliceInd = -1,
                inputValid = row.isInputValid();
                
            if (inputValid) { 
                if (!row.isAnswered()) {
                    // Unselect currently selected button(s)
                    if (row.isRadio()) {
                        while(respRef.btnRespArry.length !== 0) {
                            respRef.btnRespArry[0].isAnswered(false);
                            this.sendResponse(respRef.btnRespArry[0].rowIndex(), "");
                            respRef.btnRespArry.shift();                   
                        }
                    } else {
                        var rowRadio = respRef.btnRespArry[0];
                        if (rowRadio && rowRadio.isRadio() && rowRadio.isAnswered()) {
                            rowRadio.isAnswered(false);
                            this.sendResponse(rowRadio.rowIndex(), "");
                            respRef.btnRespArry = [];
                        }
                    }
                    
                    // Unselect slider(s) if currently answered
                    respRef.sldrTotal = 0;
                    while(respRef.sldrRespArry.length !== 0) {
                        var sldr = respRef.sldrRespArry[0];
                        sldr.isAnswered(false);
                        respRef.rowRefArry[sldr.rowIndex()].rangeValue = null;
                        this.sendResponse(sldr.rowIndex(), "");
                        respRef.sldrRespArry.shift();                   
                    }
                    
                    row.isAnswered(true);
                    respRef.btnRespArry.push(row);
                    this._setIsCompAnswered(true);
                }
                this.sendResponse(rowIndex, row.textarea());
                return true;
            } else {
                if (row.isAnswered()) {
                    if (!row.isRadio()) {
                        spliceInd = jQuery.inArray(row, respRef.btnRespArry);
                        if (spliceInd !== -1) {
                            row.isAnswered(false);
                            this.sendResponse(rowIndex, "");
                            respRef.btnRespArry.splice(spliceInd, 1);
                            this._setIsCompAnswered(respRef.btnRespArry.length > 0);
                            return (respRef.btnRespArry.length > 0); 
                        }
                    } else{
                        row.isAnswered(false);   
                        this.sendResponse(rowIndex, "");
                        respRef.btnRespArry = [];
                        this._setIsCompAnswered(false);
                        return false;
                    }
                }
            }                   
        },

        _setIsCompAnswered : function(value) {
            var qStudioVar = this.qStudioVar;
            if (typeof value === "boolean" && value !== qStudioVar.respRef.isCompAnswered) {
                console.log("_setIsCompAnswered: " + value);
                qStudioVar.respRef.isCompAnswered = value;
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
            console.log("sendResponse: " + rowIndex + ", " + ansVal);
            if (this.qStudioVar.isDC && this.qStudioVar.dcProxy) {
                this.qStudioVar.dcProxy.sendResponse({
                    eventType : (jQuery.trim(ansVal).length > 0) ? "questionAnswered" : "questionUnAnswered",
                    responseType : this.questionType(),
                    rowID : this.qStudioVar.rowArray[rowIndex].rowVO.id,
                    answerValue : ansVal.toString()
                });
            }
        },
        
        /*
         * For use w/ Dimensions. Returns object containing row responses
         * @return {Object}
         */
        getDimenResp: function() {
            if (!this.qStudioVar.isDC) { return; }
            var respRef = this.qStudioVar.respRef,
                respArry = (respRef.sldrRespArry.length > 0) ? respRef.sldrRespArry : respRef.btnRespArry,
                valarray = [],
                json = { Response: { Value: valarray } };

            for (var i=0, rlen=respArry.length; i<rlen; i+=1)
            {
                var row = respArry[i],
                    row_id = row.widget().id,
                    rangeValue = respRef.rowRefArry[row.rowIndex()].rangeValue;

                valarray.push(row_id);
                if (row.type() === 'input button' && row.isOther()) {
                    json.Response[row_id] = row.textarea();
                } else if (row.type() === 'slider') {
                    json.Response[row_id] = {
                        rangeValue: rangeValue
                    }
                }                
            }                                
            
            return json;         
        },

        setDimenResp: function(respArray) {
            if (jQuery.isArray(respArray) && respArray.length > 0) {
                var that = this,
                    respRef = this.qStudioVar.respRef,
                    rowRefArry = respRef.rowRefArry,
                    params = this.qStudioVar.params,
                    chartType = params.chartType.value.toLowerCase(),
                    isHorz = (params.rowSldrDirection.value.toLowerCase() === "horizontal"),
                    trackSize = (isHorz) ?
                        params.rowSldrTrackWidth.value : params.rowSldrTrackHeight.value;

                if (chartType !== "none" && !respRef.chartInit) {
                    respRef.cacheResp = respArray;
                    return;
                }

                while (respArray.length !== 0) {
                    var index = respArray[0].index,
                        input = respArray[0].input;

                    //console.log(index + " | " + input);
                    if (rowRefArry[index].row.type() === "slider") {
                        if (typeof input === "number" && input >= 0) {
                            rowRefArry[index].row.slideInit({
                                type: "",
                                pageX: (!that.qStudioVar.isCompRTL) ? 0 : trackSize,
                                pageY: trackSize,
                                originalEvent: {
                                    pageX: (!that.qStudioVar.isCompRTL) ? 0 : trackSize,
                                    pageY: trackSize
                                }
                            });

                            rowRefArry[index].row.slideMove({
                                type: "",
                                pageX: (isHorz) ?
                                    ((!that.qStudioVar.isCompRTL) ? Math.round((input *.01)*trackSize) : trackSize-Math.round((input *.01)*trackSize)) : 0,
                                pageY: (!isHorz) ? trackSize-Math.round((input *.01)*trackSize) : 0,
                                originalEvent: {
                                    isPrimary: true,
                                    pageX: (isHorz) ?
                                        ((!that.qStudioVar.isCompRTL) ? Math.round((input *.01)*trackSize) : trackSize-Math.round((input *.01)*trackSize)) : 0,
                                    pageY: (!isHorz) ? trackSize-Math.round((input *.01)*trackSize) : 0
                                }
                            });

                            rowRefArry[index].row.slideEnd();
                        }
                    } else {
                        if (!rowRefArry[index].row.isOther()) {
                            this.manageClick(rowRefArry[index].row);
                        } else {
                            rowRefArry[index].row.textarea(input);
                            this.manageChange(rowRefArry[index].row);
                        }

                    }

                    respArray.shift();
                }
            }
        }
    };
    
    return LinkedSlider;
    
})();