/**
 * DragnFlag Javascript File
 * Version : 1.3.0
 * Date : 2014-07-11
 *
 * DragnFlag Component.
 * BaseClassType : Multi
 * Requires rowArray and columnArray datasets.
 * Confluence Link : https://docs.gmi-mr.com/confluence/display/midev/DragnFlag+Component+Documentation
 *
 * Release 1.2.0
 * - compRTL is now automatically set for Dimensions and Decipher. QFactory utility method 'isSurveyRTL' is used
 * - made adjustments and bug fixes for RTL
 * - Updated MSPointer events per http://msdn.microsoft.com/en-us/library/dn304886(v=vs.85).aspx
 * - For QStudio Component Creation Window RTL display is turned off. Enabling RTL will move content to the right
 *   which is throwing off positioning
 * - Limit rowContainHgap and rowContainVgap to 0. This is to avoid issues w/ stacking rows and having draggable area collisions
 * - Adjusted renderDC method to allow an optional argument, surveyContain. This is to fix a bug where the draggable row is out of sync when the row container has vertical scrolling enabled.
 *
 * Release 1.3.0
 * - Can now choose between BASE and TEXT widget for the flag button. Animations have been adjusted accordingly.
 * - When a row item is on the scale it will behave much like a typical slider where you can't drag past the endpoints.
 * - Removed rowBtnShowValueLabel parameter as it was redundant.  rowBtnValLabDispType parameter has option "none" which does the same thing. *Re-enabled rowBtnValLabDispType in QStudio.
 * - Re-enabled colSldrMinVal, colSldrMaxVal, and colSldrPrecVal parameters so non-QStudio platforms can set custom slider ranges
 * - Added new parameter compQuestionType. You can now set the question type to multi
 *
 */

var DragnFlag = (function () {

    function DragnFlag() {
        this.qStudioVar = {
            isCompRTL : false,
            interact: true,
            isDC: false,
            params: this.initParams(),
            rowArray: [],
            columnArray: [],
            rowAcceptedWgts : [
                "base",
                "text"
            ]
        };
    }

    DragnFlag.prototype = {

        /*
         * Init component for DC mode.
         * Can interact w/ component and records data.
         */
        renderDC: function(parent, surveyContain) {
            //console.log("DC Rendering on parent");
            this.qStudioVar.interact = true;
            this.qStudioVar.isDC = true;
            this.create(parent, surveyContain);
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
                    "label"            // Column object label
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
            return 'DragnFlag component description...';
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
                compQuestionType: { name:"Component: Question Type", value:'Single Choice', description:"Component question type.", type:"combo", options:['Single Choice', 'Multiple Choice'], order: 1 },
                compContainPos: { name:"Component Contain: CSS Position", value:"relative", description:"CSS position property for component container element.", type:"combo", options:["absolute", "relative"], order: 4 },
                compRTL: { name:"Component RTL: Enable", value:false, description:"If set true, component will be setup to support right-to-left languages.", type:"bool", order:24 },

                // Row Slider Parameters
                colSldrMinVal: { name:"Slider: Min Value", value:0, description:"Minimum slider range value.", type:"number", wgtref: 'colsldr', wgtname:"min", order:70 },
                colSldrMaxVal: { name:"Slider: Max Value", value:100, description:"Maximum slider range value.", type:"number", wgtref: 'colsldr', wgtname:"max", order:71 },
                colSldrPrecVal: { name:"Slider: Precision Value", value:0, description:"Slider range value precision.", type:"number", min:0, wgtref: 'colsldr', wgtname:"precision", order:72 },
                colSldrHoffset: { name:"Scale: Left CSS Pos", value:0, description:"Left CSS position value used to offset scale from its default location, in pixels.", type:"number", order:56 },
                colSldrVoffset: { name:"Scale: Top CSS Pos", value:150, description:"Top CSS position value used to offset scale from its default location, in pixels.", type:"number", order:57 },
                colSldrTrackWidth: { name:"Scale Track: Bckgrnd Width", value:500, description:"Track width, in pixels.", type:"number", min:5, wgtref: 'colsldr', wgtname:"width", order:73 },
                colSldrTrackHeight: { name:"Scale Track: Bckgrnd Height", value:30, description:"Track height, in pixels.", type:"number", min:5, wgtref: 'colsldr', wgtname:"height", order:74 },
                colSldrTrackBorderStyle: { name:"Scale Track: Border Style", value:"solid", description:"Track CSS border style property.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'colsldr', wgtname:"track_border_style", order:75 },
                colSldrTrackBorderWidth: { name:"Scale Track: Border Width", value:2, description:"Track border width, in pixels.", type:"number", min:0, wgtref: 'colsldr', wgtname:"track_border_width", order:76 },
                colSldrTrackBorderRadius: { name:"Scale Track: Border Radius", value:0, description:"Track border radius, in pixels.", type:"number", min:0, wgtref: 'colsldr', wgtname:"track_border_radius", order:77 },
                colSldrTrackBorderColor: { name:"Scale Track: Border Colour", value:0xA6A8AB, description:"Track border color.", type:"colour", wgtref: 'colsldr', wgtname:"track_border_color", order:78 },
                colSldrTrackColor: { name:"Scale Track: Bckgrnd Colour", value:0xF2F2F2, description:"Track background color.", type:"colour", wgtref: 'colsldr', wgtname:"track_color", order:79 },
                colSldrTrackShowImp: { name:"Scale Track: Show Import", value:false, description:"If set true, track imported image will be displayed instead of track background color.", type:"bool", wgtref: 'colsldr', wgtname:"show_track_import", order:80 },
                colSldrTrackImp: { name:"Scale Track: Import Image", value:"", description:"Import track image to use.", type:"bitmapdata", wgtref: 'colsldr', wgtname:"track_import", order:81 },
                colSldrTickWidth: { name:"Scale Tick: Width", value:2, description:"Track tick width, in pixels.", type:"number", min:1, wgtref: 'colsldr', wgtname:"tick_width", order:84 },
                colSldrTickHeight: { name:"Scale Tick: Height", value:10, description:"Track tick height, in pixels.", type:"number", min:1, wgtref: 'colsldr', wgtname:"tick_height", order:85 },
                colSldrTickColor: { name:"Scale Tick: Colour", value:0xFFBD1A, description:"Track tick color.", type:"colour", wgtref: 'colsldr', wgtname:"tick_color", order:86 },
                colSldrTickLabDispType: { name:"Scale Tick: Label Display Type", value:"show all", description:"Track tick label display type.", type:"combo", options:["show none", "show all", "show ends", "show three", "custom"], wgtref: 'colsldr', wgtname:"ticklabel_display_type", order:87 },
                colSldrTickLabCustomCnt: { name:"Scale Tick: Custom Label Count", value:3, description:"Number of tick labels to display on slider track.", type:"number", min:1, order:36 },
                colSldrTickLabWidth: { name:"Scale Tick: Label Width", value:80, description:"Track tick label width, in pixels.", type:"number", min:5, wgtref: 'colsldr', wgtname:"ticklabel_width", order:88 },
                colSldrTickLabOffset: { name:"Scale Tick: Label Offset", value:0, description:"Top CSS position value used to offset tick label from its default location, in pixels.", type:"number", min:5, wgtref: 'colsldr', wgtname:"ticklabel_offset", order:89 },
                colSldrTickLabFontSize: { name:"Scale Tick: Label Font Size", value:14, description:"Track tick label font size.", type:"number", min:5, wgtref: 'colsldr', wgtname:"ticklabel_fontsize", order:90 },
                colSldrTickLabColor: { name:"Scale Tick: Label Color", value:0x5B5F65, description:"Track tick label font color.", type:"colour", wgtref: 'colsldr', wgtname:"ticklabel_fontcolor", order:91 },

                // Row Container Parameters
                rowContainType: { name:"Row Contain: Layout Type", value:"horizontal grid layout", description:"Layout template type applied to row buttons.", type:"combo", options:["horizontal grid layout", "vertical grid layout", "horizontal layout", "vertical layout", "sequential layout"], order: 3 },
                rowContainWidth: { name:"Row Contain: Bckgrnd Width", value:800, description:"Row container background width, in pixels.", type:"number", min:50, wgtref: 'rowcontain', wgtname:"width", order: 5 },
                rowContainHeight: { name:"Row Contain: Bckgrnd Height", value:600, description:"Row container background height, in pixels.", type:"number", min:50, wgtref: 'rowcontain', wgtname:"height", order: 6 },
                rowContainPadding: { name:"Row Contain: Bckgrnd Padding", value:0, description:"Row container background padding, in pixels.", type:"number", min:0, wgtref: 'rowcontain', wgtname:"padding", order: 7 },
                rowContainHgap: { name:"Row Contain: Horz Btn Spacing", value:5, description:"The horizontal spacing of row buttons, in pixels.", type:"number", min: 0, wgtref: 'rowcontain', wgtname:"hgap", order: 8 },
                rowContainVgap: { name:"Row Contain: Vert Btn Spacing", value:5, description:"The vertical spacing of row buttons, in pixels.", type:"number", min: 0, wgtref: 'rowcontain', wgtname:"vgap", order: 9 },
                rowContainHoffset: { name:"Row Contain: Left CSS Pos", value:0, description:"Left CSS position value used to offset row button container from its default location, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"left", order: 10 },
                rowContainVoffset: { name:"Row Contain: Top CSS Pos", value:0, description:"Top CSS position value used to offset row button container from its default location, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"top", order: 11 },
                rowContainBckgrndDispType: { name:"Row Contain: Bckgrnd Display Type", value:"none", description:"Row container background display type.", type:"combo", options:["vector", "import", "none"], order: 3 },
                rowContainBorderStyle: { name:"Row Contain: Border Style", value:"none", description:"Row container CSS border style property.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'rowcontain', wgtname:"border_style", order: 12 },
                rowContainBorderWidth: { name:"Row Contain: Border Width", value:0, description:"Row container border width, in pixels.", type:"number", min:0, wgtref: 'rowcontain', wgtname:"border_width", order: 13 },
                rowContainBorderColor: { name:"Row Contain: Border Color", value:0xA6A8AB, description:"Row container border color.", type:"colour", wgtref: 'rowcontain', wgtname:"border_color", order: 14 },
                rowContainBckgrndColor: { name:"Row Contain: Bckgrnd Color", value:0xF2F2F2, description:"Row container background color.", type:"colour", wgtref: 'rowcontain', wgtname:"bckgrnd_color", order: 15 },
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
                rowBtnDefaultType: { name:"Row Btn: Default Button Type", value:"Base", description:"Default button type used by component.", type:"combo", options:["Base", "Text"], order:29 },
                rowBtnWidth: { name:"Row Btn: Bckgrnd Width", value:85, description:"Button background width, in pixels", type:"number", min:10, wgtref: 'rowbtn', wgtname:"width", order:30 },
                rowBtnHeight: { name:"Row Btn: Bckgrnd Height", value:75, description:"Button background height, in pixels", type:"number", min:10, wgtref: 'rowbtn', wgtname:"height", order:31 },
                rowBtnPadding: { name:"Row Btn: Bckgrnd Padding", value:4, description:"Button background padding, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"padding", order:32 },
                rowBtnBorderStyle: { name:"Row Btn: Border Style", value:"solid", description:"Button background CSS border style property.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'rowbtn', wgtname:"border_style", order:33 },
                rowBtnBorderWidthUp: { name:"Row Btn: Border UP Width", value:2, description:"Button background border width, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_width_up", order:34 },
                rowBtnBorderColorUp: { name:"Row Btn: Border UP Color", value:0xA6A8AB, description:"Button background border color in its default state.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_up", order:36 },
                rowBtnBorderColorOver: { name:"Row Btn: Border OVER Color", value:0x5B5F65, description:"Button background border color on mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_over", order:37 },
                rowBtnBorderColorDown: { name:"Row Btn: Border DOWN Color", value:0x5B5F65, description:"Button background border color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_down", order:38 },
                rowBtnBckgrndColorUp: { name:"Row Btn: Bckgrnd UP Color", value:0xF2F2F2, description:"Button background color in its default state.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_up", order:39 },
                rowBtnBckgrndColorOver: { name:"Row Btn: Bckgrnd OVER Color", value:0xA6A8AB, description:"Button background color on mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_over", order:40 },
                rowBtnBckgrndColorDown: { name:"Row Btn: Bckgrnd DOWN Color", value:0xFFBD1A, description:"Button background color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_down", order:41 },
                rowBtnFlagStickBaseHeight: { name:"Row Btn: FlagStick Base Height", value:40, description:"Flag stick height in button's default state.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"flagstick_height", order:46 },
                rowBtnFlagStickGrowHeight: { name:"Row Btn: FlagStick Grow Height", value:40, description:"Flag stick max growth height.", type:"number", min:1, order:46 },
                rowBtnFlagStickCircColor: { name:"Row Btn: FlagStick Circle Colour", value:0x5B5F65, description:"Flag stick circle color.", type:"colour", wgtref: 'rowbtn', wgtname:"flagcircle_color", order:35 },

                // Row Button Label Parameters
                rowBtnShowLabel: { name:"Row Label: Display", value:true, description:"If set false, button label will not .", type:"bool", wgtref: 'rowbtn', wgtname:"show_label", order:60 },
                rowBtnLabelPlacement: { name:"Row Label: Placement", value:'bottom', description:"Button label placement in relation to its background element.", type:"combo", options:['bottom', 'top', 'center'], wgtref: 'rowbtn', wgtname:"label_placement", order:51 },
                rowBtnLabelHalign: { name:"Row Label: Horz Alignment", value:'left', description:"Horizontal text alignment of button label field.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowbtn', wgtname:"label_halign", order:52 },
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

                // Row Button Value Label Parameters
                rowBtnValLabDispType: { name:"Row Btn: Value Label Display Type", value:"column label", description:"Type of data to display in the value label.", type:"combo", options:["column value", "column label", "range value", "none"], order:105 },
                rowBtnValLabHalign: { name:"Row Value Label: Horz Alignment", value:'center', description:"Horizontal text alignment of button value label.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowbtn', wgtname:"value_label_halign", order:45 },
                rowBtnValLabFontSize: { name:"Row Value Label: Font Size", value:18, description:"Button value label font size.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"value_label_fontsize", order:46 },
                rowBtnValLabColor: { name:"Row Value Label: Font Color", value:0x5B5F65, description:"Button value label font color.", type:"colour", wgtref: 'rowbtn', wgtname:"value_label_fontcolor", order:49 },

                // Row Animation Parameters
                rowBtnSelectAnimType: { name:"Row Animation: Transform Type", value:"basic", description:"Select how the row button should transform when selected.", type:"combo", options:["basic", "image", "pin"], wgtref: 'rowbtn', wgtname:"select_anim_type", order: 3 },
                rowBtnImageAnimWidth: { name:"Row Animation: Image Width", value:50, description:"Image width, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"image_select_anim_width", order:76 },
                rowBtnImageAnimHeight: { name:"Row Animation: Image Height", value:50, description:"Image height, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"image_select_anim_height", order:76 },
                rowBtnPinAnimSize: { name:"Row Animation: Pin Size", value:12, description:"Value represents the pin size. The smaller the value the smaller the pin and. The larger the value the larger the pin.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"pin_select_anim_size", order:76 },
                rowBtnDragAlpha: { name:"Row Animation: Drag Transparency", value:100, description:"Button opacity during button drag. The smaller the value the more transparent, the larger the value the less transparent.", type:"number", min:50, max:100, order:76 },

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
                zoomBckgrndColor: { name:"LightBox: Zoom Btn Bckgrnd Color", value:0xFFFFFF, description:"Click to Zoom button background color.", type:"colour", wgtref: 'ctz', wgtname:"zoom_bckgrnd_color", order:116, display: false }
            };
        },

        /*
         * Call to create a group parameter objects -- accepted values are 'rowcontain', 'rowbtn', and 'colsldr'.
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
        create: function(parent, surveyContain) {
            // Used in conjunction w/ component Controller
            this.qStudioVar.respRef = {
                rowArry : [],    // Stores a reference of each row in component
                colArry : []     // Stores a reference of each bucket in component
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
                rowArray = this.qStudioVar.rowArray,
                columnArray = this.qStudioVar.columnArray,
                clen = columnArray.length,
                rowContainType = params.rowContainType.value.toLowerCase(),
                rowContainConfigObj = this.paramObj('rowcontain'),
                rowBtnConfigObj = this.paramObj('rowbtn'),
                colSldrConfigObj = this.paramObj('colsldr'),
                toolTipConfigObj = this.paramObj('tooltip'),
                ctzConfigObj = this.paramObj('ctz'),
                touchEnabled = QUtility.isTouchDevice(),
                isMSTouch = QUtility.isMSTouch(),
                isMulti = (this.questionType() === "multi"),
                isSeq = (!isMulti && (rowContainType.indexOf("sequential") !== -1)),
                rowContainBckgrndDispType = params.rowContainBckgrndDispType.value.toLowerCase(),
                sldrTickLabDispType = params.colSldrTickLabDispType.value.toLowerCase(),
                numOfTicks = (sldrTickLabDispType !== "show three") ?
                    ((params.colSldrTickLabCustomCnt.value >= 1) ? params.colSldrTickLabCustomCnt.value : 1) : 3,
                tickIncrem = (numOfTicks > 1) ? (columnArray.length-1)/(numOfTicks-1) : 1,
                overrideTicks = ((sldrTickLabDispType === "custom" || sldrTickLabDispType === "show three") && (tickIncrem >= 1)),
                selectAnimType = params.rowBtnSelectAnimType.value.toLowerCase(),
                valDispType = params.rowBtnValLabDispType.value.toLowerCase(),
                tickLabArray = [],
                compContain = null,
                rowContain = null;

            // Scale Tick setup
            for (var i=0; i<clen; i+=1) { tickLabArray.push(columnArray[i].label); }
            if (overrideTicks) {
                for (var i=0; i<clen; i+=1) { tickLabArray[i] = ""; }
                for (var i=0; i<numOfTicks; i+=1) {
                    var index = Math.round(i*tickIncrem);
                    tickLabArray[index] = columnArray[index].label;
                }
            }

            if (that.qStudioVar.isCompRTL) { tickLabArray = tickLabArray.concat([]).reverse(); }

            // Set parameter defaults
            if (selectAnimType === "pin") { params.rowBtnFlagStickGrowHeight.value = 0; }

            // Init External Widgets
            toolTipConfigObj.isRTL = that.qStudioVar.isCompRTL;
            QStudioCompFactory.lightBoxFactory("basic", doc.body, ctzConfigObj);
            QStudioCompFactory.toolTipFactory("", doc.body, toolTipConfigObj);

            // Row Container settings
            rowContainConfigObj.id = "QRowContainer";
            rowContainConfigObj.isRTL = that.qStudioVar.isCompRTL;
            rowContainConfigObj.show_bckgrnd = (rowContainBckgrndDispType === "vector");
            rowContainConfigObj.show_bckgrnd_import = (rowContainBckgrndDispType === "import");
            rowContainConfigObj.direction = (rowContainType.indexOf("vertical") !== -1) ? "vertical" : "horizontal";
            rowContainConfigObj.autoWidth = true;
            rowContainConfigObj.autoHeight = true;
            if (rowContainConfigObj.hgap < 0) { rowContainConfigObj.hgap = 0;}
            if (rowContainConfigObj.vgap < 0) { rowContainConfigObj.vgap = 0;}

            // Row Button settings
            rowBtnConfigObj.isRTL = that.qStudioVar.isCompRTL;
            rowBtnConfigObj.label_placement += " overlay";
            rowBtnConfigObj.show_value_label = (valDispType !== "none");

            // Component Container CSS Style
            compContain = doc.createElement("div");
            compContain.id = "DragnFlagComponent";
            compContain.dir = (!that.qStudioVar.isCompRTL) ? 'ltr' :'rtl';
            compContain.className = "qdragnflag_component";
            compContain.style.position = params.compContainPos.value;
            compContain.style.width = "100%";
            compContain.style.height = "100%";
            parent = (parent && parent.nodeType === 1) ? parent : doc.body;
            parent.appendChild(compContain);

            // Do not allow sequential layout for Multi question type
            if ((rowContainType.indexOf("sequential") !== -1) && !isSeq) {
                rowContainConfigObj.direction = "horizontal";
                rowContainType = "grid";
            }

            // Row Container Init
            rowContain = QStudioCompFactory.layoutFactory(
                rowContainType.substr(0, rowContainType.indexOf('layout')-1),
                compContain,
                rowContainConfigObj
            );
            rowContain.container().style.zIndex = 1;

            // Add Row Widgets to Row Container
            for (var i=0, rlen=rowArray.length; i<rlen; i+=1) {
                var rowWgt = null, rowWrap = null,
                    rowBtnType = params.rowBtnDefaultType.value,
                    userDefType = jQuery.trim(rowArray[i].var1 || rowArray[i].type).toLowerCase();

                // Set user defined type, but make sure its one of the accepted values
                if (that.isRowTypeValid(userDefType)) { rowBtnType = userDefType; }

                rowBtnConfigObj.rowIndex = i;
                rowBtnConfigObj.id = (!isMulti) ?
                    (rowArray[i].id || 'row_' + i) :
                    (rowArray[i].id+'_'+0 || 'row_'+i+'_'+0);
                rowBtnConfigObj.label = rowArray[i].label;
                rowBtnConfigObj.description = rowArray[i].description;
                rowBtnConfigObj.image = rowArray[i].image;
                rowBtnConfigObj.width = rowArray[i].width || params.rowBtnWidth.value;
                rowBtnConfigObj.height = rowArray[i].height || params.rowBtnHeight.value;
                rowBtnConfigObj.use_tooltip = (typeof rowArray[i].useTooltip === 'boolean') ?
                    rowArray[i].useTooltip : params.rowBtnUseTooltip.value;
                rowBtnConfigObj.use_lightbox = (typeof rowArray[i].useZoom === 'boolean') ?
                    rowArray[i].useZoom : params.rowBtnUseZoom.value;
                rowBtnConfigObj.btn_widget_type = rowBtnType;

                // Create Row Button Widget
                rowWgt = QStudioCompFactory.widgetFactory(
                    "flagbtn",
                    compContain,
                    rowBtnConfigObj
                );
                rowWgt.widget().id = rowBtnConfigObj.id;

                // Set whether row should be enabled determined via render state.
                rowWgt.enabled(this.qStudioVar.interact, { alphaVal: 100 });

                // Check to see if user is on touch device and take appropriate action
                rowWgt.touchEnabled(touchEnabled);

                // Create 'rowIndex' attribute for row widget
                rowWgt.widget().setAttribute('rowIndex', i.toString());

                // Create 'colIndex' attribute for Row Widget
                rowWgt.widget().setAttribute('colIndex', "0");
                rowWgt.colIndex(0);

                // Add to row container
                rowWrap = rowContain.add(rowWgt);
                if (!isSeq) {
                    rowWrap.style.width = $(rowWgt.widget()).outerWidth() + "px";
                    rowWrap.style.height = $(rowWgt.widget()).outerHeight() + "px";
                }

                // Init Row Drag Vars
                rowWgt.widget().style.position = "absolute";
                rowWgt.widget().style.left = 0;
                rowWgt.widget().style.top = 0;
                rowWgt.widget().setAttribute("lastX", "0");
                rowWgt.widget().setAttribute("lastY", "0");

                // Store reference of Row Widget for use w/ Controller
                respRef.rowArry.push({
                    row: rowWgt,
                    wrap : rowWrap,
                    rangeValue: -1,
                    columnValue: -1
                });

                if (isMulti) {
                    for (var j=1; j<clen; j+=1) {
                        rowBtnConfigObj.id = rowArray[i].id+'_'+j || 'row_'+i+'_'+j;

                        // Create Row Button Widget
                        rowWgt = QStudioCompFactory.widgetFactory(
                            "flagbtn",
                            rowWrap,
                            rowBtnConfigObj
                        );
                        rowWgt.widget().id = rowBtnConfigObj.id;

                        // Set whether row should be enabled determined via render state.
                        rowWgt.enabled(this.qStudioVar.interact, { alphaVal: 100 });

                        // Check to see if user is on touch device and take appropriate action
                        rowWgt.touchEnabled(touchEnabled);

                        // Create 'rowIndex' attribute for row widget
                        rowWgt.widget().setAttribute('rowIndex', i.toString());

                        // Create 'colIndex' attribute for Row Widget
                        rowWgt.widget().setAttribute('colIndex', j.toString());
                        rowWgt.colIndex(j);

                        // Init Row Button Controller Properties
                        rowWgt.widget().style.display = "none";
                        rowWgt.widget().style.position = "absolute";
                        rowWgt.widget().style.left = 0;
                        rowWgt.widget().style.top = 0;
                        rowWgt.widget().setAttribute("lastX", "0");
                        rowWgt.widget().setAttribute("lastY", "0");

                        // Store reference of Row Widget for use w/ Controller
                        respRef.rowArry.push({
                            row: rowWgt,
                            wrap : rowWrap,
                            rangeValue: -1,
                            columnValue: -1
                        });
                    }
                }
            }

            // Create Slider Track
            var slider = null,
                trackContain = null,
                track = null,
                tickContain = null;

            // Widget CSS Style
            slider = doc.createElement("div");
            slider.className = "qwidget_slider";
            slider.style.cssText = "position: relative; z-index: 0; filter: inherit; -webkit-tap-highlight-color: rgba(0,0,0,0); -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";
            slider.style.marginTop = params.colSldrVoffset.value + "px";
            slider.style[(!that.qStudioVar.isCompRTL) ? 'marginLeft' : 'marginRight'] = params.colSldrHoffset.value + "px";
            if (QUtility.ieVersion() <= 8) { slider.onselectstart = function() { return false; }; }
            compContain.appendChild(slider);

            // Track Container CSS Style
            trackContain = doc.createElement("div");
            trackContain.className = "qwidget_slider_trackcontain";
            trackContain.style.cssText = "position: relative; filter: inherit;";
            slider.appendChild(trackContain);

            // Track CSS Style
            track = doc.createElement("div");
            track.className = "qwidget_slider_track";
            track.style.cssText = "position: absolute; top: 0px; left: 0px; filter: inherit;";
            track.style.width = colSldrConfigObj.width + "px";
            track.style.height = colSldrConfigObj.height + "px";
            if (!colSldrConfigObj.show_track_import) {
                track.style.borderRadius = track.style.webkitBorderRadius = track.style.mozBorderRadius = colSldrConfigObj.track_border_radius + "px";
                track.style.border = colSldrConfigObj.track_border_width + "px " + colSldrConfigObj.track_border_style + " #" + QUtility.paramToHex(colSldrConfigObj.track_border_color);
                track.style.backgroundColor = "#" + QUtility.paramToHex(colSldrConfigObj.track_color);
            } else {
                $(track).css( {
                    'background-repeat': 'no-repeat',
                    'background-size': (colSldrConfigObj.width + "px " + colSldrConfigObj.height + "px"),
                    'background-position': 'center',
                    'background-image': (QUtility.ieVersion() < 9) ?
                        "url(" + colSldrConfigObj.blank_gif + ") " + 'url('+colSldrConfigObj.track_import+')' : 'url('+colSldrConfigObj.track_import+')',
                    'filter': "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+colSldrConfigObj.track_import+",sizingMethod='scale')"
                });
            }
            trackContain.appendChild(track);

            // Tick Container CSS Style
            tickContain = doc.createElement("div");
            tickContain.className = "qwidget_slider_tickcontain";
            tickContain.dir = "LTR";
            tickContain.style.cssText = "position: absolute; top: 0px; left: 0px; filter: inherit;";
            trackContain.appendChild(tickContain);

            // Tick Container/Tick Label Container/Image Container CSS Style
            var i = 0,
                tick_wrap = null,
                tick = null,
                tick_label = null,
                tickgap = colSldrConfigObj.width / ((clen > 1) ? (clen - 1) : clen),
                track_border_width = (!colSldrConfigObj.show_track_import) ? colSldrConfigObj.track_border_width : 0,
                ticklab_width_offset = (colSldrConfigObj.ticklabel_width*0.5),
                max_ticklab_height = 0;

            for (i; i<clen; i+=1) {
                var tick_top = ((colSldrConfigObj.height - colSldrConfigObj.tick_height) * 0.5),
                    tick_left = ((tickgap * i) - colSldrConfigObj.tick_width * 0.5),
                    ticklab_height = null;

                // Tick Wrapper CSS Style
                tick_wrap = doc.createElement("div");
                tick_wrap.className = "qwidget_slider_tick_wrapper";
                tick_wrap.style.position = "absolute";
                tick_wrap.style.filter = "inherit";
                tick_wrap.style.top = (tick_top + track_border_width) + "px";
                tick_wrap.style.left = (tick_left + track_border_width) + "px";
                tickContain.appendChild(tick_wrap);

                // Tick CSS Style
                tick = doc.createElement("div");
                tick.className = "qwidget_slider_tick";
                tick.style.position = "absolute";
                tick.style.filter = "inherit";
                tick.style.width = colSldrConfigObj.tick_width + "px";
                tick.style.height = colSldrConfigObj.tick_height + "px";
                tick.style.visibility = (i > 0 && i < clen - 1) ? "" : "hidden";
                tick.style.backgroundColor = "#" + QUtility.paramToHex(colSldrConfigObj.tick_color);
                tick_wrap.appendChild(tick);

                // Tick label CSS Style
                tick_label = doc.createElement("label");
                tick_label.dir = (!that.qStudioVar.isCompRTL) ? "LTR" : "RTL";
                tick_label.className = "qwidget_slider_tick_label";
                tick_label.innerHTML = tickLabArray[i];
                tick_label.style.display =
                    ((colSldrConfigObj.ticklabel_display_type === "show ends" && (i !== 0 && i !== clen - 1))
                        || colSldrConfigObj.ticklabel_display_type === "show none") ? "none" : "block";
                tick_label.style.position = "absolute";
                tick_label.style.filter = "inherit";
                tick_label.style.overflow = 'hidden';
                tick_label.style.width = colSldrConfigObj.ticklabel_width + "px";
                tick_label.style.height = "auto";
                tick_label.style.fontSize = colSldrConfigObj.ticklabel_fontsize + "px";
                tick_label.style.color = '#' + QUtility.paramToHex(colSldrConfigObj.ticklabel_fontcolor);
                tick_label.style.textAlign = "center";
                tick_label.style.visibility = "hidden";
                doc.body.appendChild(tick_label);
                ticklab_height = Math.min($(tick_label).outerHeight(), tickgap);     // Record tick label height after appended to DOM
                max_ticklab_height = Math.max(max_ticklab_height, ticklab_height);   // Record max tick label height to use for sizing the slider track
                tick_wrap.appendChild(tick_label);
                tick_label.style.top = -tick_top + "px";
                tick_label.style.marginTop = (colSldrConfigObj.height + track_border_width + colSldrConfigObj.ticklabel_offset) + "px";
                tick_label.style.marginLeft = ((colSldrConfigObj.tick_width - colSldrConfigObj.ticklabel_width) * 0.5) + "px";
                tick_label.style.visibility = "";

                // This array will be used to prevent rows from being dropped in same column
                respRef.colArry.push({
                    rowRefArry: []
                });
            }

            // Position Track Container
            var margin_offset = Math.max.apply(Math, [
                ticklab_width_offset,
                track_border_width
            ]);
            trackContain.style.marginLeft =
                (margin_offset !== track_border_width) ? margin_offset-track_border_width + "px" : "";

            // Calculate slider height
            var height_offset = (max_ticklab_height + colSldrConfigObj.ticklabel_offset);
            trackContain.style.height = (height_offset + (colSldrConfigObj.height + track_border_width*2)) + "px";
            slider.style.height = trackContain.style.height;

            // Calculate slider width
            var width_offset = ((ticklab_width_offset) > track_border_width) ? track_border_width : 0;
            trackContain.style.width =
                (((margin_offset !== track_border_width) ? 0 : track_border_width) + colSldrConfigObj.width + margin_offset + width_offset) + "px";
            slider.style.width = trackContain.style.width;

            // Position row container and slider container so that they're horizontally centered to one another
            var rowContainWidth = $(rowContain.container()).outerWidth(),
                sliderWidth = $(trackContain).outerWidth(true);

            if (rowContainWidth > sliderWidth) {
                slider.style[(!that.qStudioVar.isCompRTL) ? 'left' : 'right'] =
                    (rowContainWidth - sliderWidth)*0.5 + "px";
            } else {
                rowContain.container().style[(!that.qStudioVar.isCompRTL) ? 'left' : 'right'] =
                    (sliderWidth - rowContainWidth)*0.5 + "px";
            }

            // utility to record track bounds
            var trackHeightOffset = params.colSldrTrackHeight.value*0.5 + track_border_width,
                trackWidth = params.colSldrTrackWidth.value,
                flagStickBaseHeight = params.rowBtnFlagStickBaseHeight.value,
                flagStickGrowHeight = params.rowBtnFlagStickGrowHeight.value,
                minVal = params.colSldrMinVal.value,
                maxVal = params.colSldrMaxVal.value,
                precVal = params.colSldrPrecVal.value;

            // Init drag events for row widgets
            var downEvent = (!isMSTouch) ? ((touchEnabled) ? "touchstart.dragnflag" : "mousedown.dragnflag") :
                    ((touchEnabled) ? ((window.PointerEvent) ? "pointerdown.dragnflag" : "MSPointerDown.dragnflag") : "mousedown.dragnflag"),
                moveEvent = (!isMSTouch) ? ((touchEnabled) ? "touchmove.dragnflag" : "mousemove.dragnflag") :
                    ((touchEnabled) ? ((window.PointerEvent) ? "pointermove.dragnflag" : "MSPointerMove.dragnflag") : "mousemove.dragnflag"),
                upEvent = (!isMSTouch) ? ((touchEnabled) ? "touchend.dragnflag" : "mouseup.dragnflag") :
                    ((touchEnabled) ? ((window.PointerEvent) ? "pointerup.dragnflag" : "MSPointerUp.dragnflag") : "mouseup.dragnflag"),
                rowSldrTopOffset = 4 * ((selectAnimType !== "pin") ? 1 : -1),
                curPinSelect = null,
                sizeCache = {
                    basic : {
                        width : null,
                        height : null
                    },
                    image : {
                        width : null,
                        height : null
                    },
                    pin : {
                        width : null,
                        height : null
                    }
                }, helperSizeCache = function(wgt) {
                    var ele = (selectAnimType !== "pin") ? wgt.cache().nodes.background : wgt.cache().nodes.pin;
                    if (!sizeCache[selectAnimType].width) { sizeCache[selectAnimType].width = $(ele).outerWidth(); }
                    if (!sizeCache[selectAnimType].height) { sizeCache[selectAnimType].height = $(ele).outerHeight(); }
                };

            $(compContain).on(downEvent, '.qwidget_button', function(event) {
                event.stopPropagation();
                if (!touchEnabled) { event.preventDefault(); }
                if (isMSTouch && touchEnabled && !event.originalEvent.isPrimary) { return; }
                var touchEvent = (event.type.indexOf("touch") !== -1 && event.originalEvent.targetTouches) ?
                        event.originalEvent.targetTouches[0] : ((!isMSTouch) ? event : event.originalEvent),
                    rowNode = event.currentTarget,
                    rowIndex = parseInt(rowNode.getAttribute('rowIndex'), 10),
                    colIndex = parseInt(rowNode.getAttribute('colIndex'), 10),
                    multiRowIndex = (rowIndex * clen) + colIndex,
                    finalRowIndex = (!isMulti) ? rowIndex : multiRowIndex,
                    rowWgt = respRef.rowArry[finalRowIndex].row,
                    rowWrap = respRef.rowArry[finalRowIndex].wrap,
                    columnValue = respRef.rowArry[finalRowIndex].columnValue,
                    sldrOffTop = null,
                    baseValue = null,
                    flagStickRangeVal = null,
                    rangeValue = null,
                    isTouchMove = false,
                    scrollOffset = $(surveyContain).scrollTop(),
                    surveyScale = QUtility.getQStudioSurveyScale();

                // Set track bounds
                scrollOffset = ((scrollOffset >= 0) ? scrollOffset : 0);
                rowNode._offsetLeft = $(rowWrap).offset().left*(1/surveyScale.a);
                rowNode._offsetTop = $(rowWrap).offset().top*(1/surveyScale.d) + scrollOffset;
                track.left = ($(track).offset().left*(1/surveyScale.a)) + track_border_width;
                track.right = track.left + $(track).width() - track_border_width;
                track.top = (scrollOffset + track_border_width + (($(track).offset().top)*(1/surveyScale.d)));
                track.bot = track.top + $(track).height() - track_border_width;

                // Set offsetLeft value on rowNode to use w/ anchoring to slider track
                sldrOffTop = scrollOffset - rowNode._offsetTop + (($(slider).offset().top)*(1/surveyScale.d));
                rowNode.offLeft = rowNode._offsetLeft - (($(track).offset().left)*(1/surveyScale.a));

                if (rowWgt.enabled()) {
                    // Pass method isDrag boolean true to indicate widget is being dragged
                    // This prevents mouse over behavior for other widgets
                    QStudioDCAbstract.prototype.isDrag(true);
                    rowNode.style.zIndex = 2000;
                    if (QUtility.ieVersion() === 7) { rowWrap.style.zIndex = 2000; }

                    // Set rowNode opacity on drag
                    if (params.rowBtnDragAlpha.value >= 50 && params.rowBtnDragAlpha.value < 100) {
                        $(rowNode).css({ 'opacity': (params.rowBtnDragAlpha.value *.01) });
                    }

                    rowWgt.animType[selectAnimType].down.call(rowWgt, (true));
                    helperSizeCache(rowWgt);
                    var sizeCacheWidth = sizeCache[selectAnimType].width,
                        sizeCacheHeight = sizeCache[selectAnimType].height,
                        leftLimit = (-rowNode._offsetLeft + track.left - sizeCacheWidth*0.5),
                        rightLimit = (-rowNode._offsetLeft + track.right + track_border_width - sizeCacheWidth*0.5),
                        topLimit = (- rowNode._offsetTop + track.top - sizeCacheHeight - rowWgt.flagStickHeight() - 5),
                        botLimit = (-rowNode._offsetTop + track.top + params.colSldrTrackHeight.value);

                    // Set dragx/dragY values
                    rowNode.dragX = touchEvent.pageX - parseInt(rowNode.getAttribute("lastX"), 10)*(surveyScale.a);
                    rowNode.dragY = touchEvent.pageY - parseInt(rowNode.getAttribute("lastY"), 10)*(surveyScale.d);
                    // For non-basic selectAnimType we want to center the row object when dragged and not answered
                    if (selectAnimType !== "basic" && !rowWgt.isAnswered()) {
                        rowNode.dragX = (rowNode._offsetLeft + (sizeCacheWidth*0.5))*(surveyScale.a);
                        rowNode.dragY = (rowNode._offsetTop + (sizeCacheHeight*0.5))*(surveyScale.d);
                        rowNode.style.left = ((touchEvent.pageX - rowNode.dragX)*(1/surveyScale.a)) + "px";
                        rowNode.style.top = ((touchEvent.pageY - rowNode.dragY + scrollOffset)*(1/surveyScale.d)) + "px";
                    }
                    if (rowWgt.isAnswered()) { rowNode.dragY += scrollOffset; }

                    // Add 'mouseMove' event handler
                    $(doc).on(moveEvent, function(event) {
                        event.preventDefault();
                        // For touchEnabled and pin animation
                        if (touchEnabled && selectAnimType === "pin" && curPinSelect) {
                            var prevRowNode = curPinSelect.parentNode,
                                prevRowIndex = parseInt(prevRowNode.getAttribute('rowIndex'), 10),
                                prevColIndex = parseInt(prevRowNode.getAttribute('colIndex'), 10),
                                prevRowWgt = respRef.rowArry[(!isMulti) ? prevRowIndex : (prevRowIndex * clen) + prevColIndex].row;

                            prevRowWgt.animType.pin.hover.call(prevRowWgt, false);
                            curPinSelect = null;
                        }

                        isTouchMove = true;
                        var scrollOffset = $(surveyContain).scrollTop(),
                            touchEvent = (event.type.indexOf("touch") !== -1 && event.originalEvent.targetTouches) ?
                                event.originalEvent.targetTouches[0] : ((!isMSTouch) ? event : event.originalEvent);

                        scrollOffset = ((scrollOffset >= 0) ? scrollOffset : 0);
                        if (touchEvent.pageX < 0) { touchEvent.pageX = 0; }
                        if (touchEvent.pageY < 0) { touchEvent.pageY = 0; }

                        var ex = (touchEvent.pageX - rowNode.dragX)*(1/surveyScale.a),
                            ey = ((touchEvent.pageY - rowNode.dragY) + scrollOffset)*(1/surveyScale.d);

                        if (!rowWgt.isAnswered()) {
                            rowNode.style.top = ey + "px";
                        } else {
                            if (ex < leftLimit) { ex = leftLimit; }
                            else if (ex > rightLimit) { ex = rightLimit; }
                        }
                        rowNode.style.left = ex + "px";

                        // Set lastX and lastY rowNode attributes
                        rowNode.setAttribute("lastX", ex.toString());
                        rowNode.setAttribute("lastY", ey.toString());

                        // If row is on the scale
                        if (ex >= leftLimit && ex <= rightLimit && ey >= topLimit && ey <= botLimit) {
                            if (!rowWgt.isAnswered()) { rowWgt.isAnswered(true); }
                            // Set baseValue, flagStickRangeVal, rangeValue & columnValue variables
                            baseValue = (ex - track_border_width + rowNode.offLeft + sizeCacheWidth*0.5);
                            if (baseValue < 0) { baseValue = 0; }
                            if (baseValue > trackWidth) { baseValue = trackWidth; }
                            rangeValue = parseInt(((baseValue/trackWidth) * (maxVal - minVal) + minVal).toFixed(precVal), 10);
                            flagStickRangeVal = parseInt(((baseValue/trackWidth) * flagStickGrowHeight).toFixed(0), 10);
                            columnValue = Math.round((baseValue/trackWidth) * (columnArray.length - 1));
                            if (that.qStudioVar.isCompRTL) {
                                rangeValue = parseInt(((baseValue/trackWidth) * (minVal - maxVal) + maxVal).toFixed(precVal), 10);
                                flagStickRangeVal = flagStickGrowHeight - flagStickRangeVal;
                                columnValue = clen - 1 - columnValue;
                            }

                            switch(valDispType) {
                                case "column label":
                                    rowWgt.valueLabel(columnArray[columnValue].label);
                                    break;
                                case "column value":
                                    rowWgt.valueLabel(columnValue);
                                    break;
                                case "none":
                                    rowWgt.valueLabel("");
                                    break;
                                default:
                                    rowWgt.valueLabel(rangeValue);
                                    break;
                            }

                            // Adjust Flag Stick height & set Row Top Position
                            rowWgt.flagStickHeight((flagStickBaseHeight + flagStickRangeVal));
                            rowNode.setAttribute("lastY", (sldrOffTop + trackHeightOffset - sizeCacheHeight - rowWgt.flagStickHeight() - rowSldrTopOffset).toString());
                            rowNode.style.top = parseInt(rowNode.getAttribute("lastY"),10) + "px";
                        }

                        // If row is off the scale
                        else {
                            if (rowWgt.isAnswered()) {
                                rowWgt.isAnswered(false);
                                rowWgt.valueLabel("");
                                if (!touchEnabled && selectAnimType !== "pin") { rowWgt.toggleMouseEnter(true); }
                            }

                            // Reset baseValue, flagStickRangeVal, rangeValue & columnValue variables
                            baseValue = null;
                            flagStickRangeVal = null;
                            rangeValue = null;
                            columnValue = null;
                        }
                    });

                    // Add 'mouseUp' event handler
                    $(doc).on(upEvent, function(event) {
                        // Remove 'mouseMove'/'mouseUp' event handlers
                        $(doc).off(moveEvent);
                        $(doc).off(upEvent);
                        QStudioDCAbstract.prototype.isDrag(false);
                        rowNode.style.zIndex = 'auto';
                        if (QUtility.ieVersion() === 7) { rowWrap.style.zIndex = "auto"; }

                        // Set rowNode opacity on drag
                        if (params.rowBtnDragAlpha.value >= 50 && params.rowBtnDragAlpha.value < 100) {
                            $(rowNode).css({ 'opacity': 1 });
                        }

                        // If row has not been answered
                        if (!rowWgt.isAnswered()) {
                            // Return row to home location
                            rowWgt.animType[selectAnimType].down.call(rowWgt, (false));
                            rowNode.setAttribute("lastX", "0");
                            rowNode.setAttribute("lastY", "0");
                            rowNode.style.left = 0;
                            rowNode.style.top = 0;

                            // See if we need to unanswer row
                            if (respRef.rowArry[finalRowIndex].columnValue !== -1) {
                                var rowRemRefArray = respRef.colArry[respRef.rowArry[finalRowIndex].columnValue].rowRefArry;
                                rowRemRefArray.splice(jQuery.inArray(rowWrap, rowRemRefArray), 1);
                                that.sendResponse(rowIndex, respRef.rowArry[finalRowIndex].columnValue, false);
                                respRef.rowArry[finalRowIndex].rangeValue = -1;
                                respRef.rowArry[finalRowIndex].columnValue = -1;
                                if (isSeq) { rowContain.back(rowWgt); }
                            }
                        }

                        // If row has been answered
                        else {
                            var rowRefArray = respRef.colArry[columnValue].rowRefArry;
                            if (jQuery.inArray(rowWrap, rowRefArray) === -1) {
                                // Set row response
                                if (isSeq && respRef.rowArry[finalRowIndex].columnValue === -1) { rowContain.next(); }
                                if (respRef.rowArry[finalRowIndex].columnValue >= 0 && respRef.rowArry[finalRowIndex].columnValue !== columnValue) {
                                    // edit rowRefArray accordingly
                                    var rowRemRefArray = respRef.colArry[respRef.rowArry[finalRowIndex].columnValue].rowRefArry;
                                    rowRemRefArray.splice(jQuery.inArray(rowWrap, rowRemRefArray), 1);

                                    // Un-answer current response
                                    that.sendResponse(rowIndex, respRef.rowArry[finalRowIndex].columnValue, false);
                                }

                                rowRefArray.push(rowWrap);
                                that.sendResponse(rowIndex, columnValue, true);
                                respRef.rowArry[finalRowIndex].rangeValue = rangeValue;
                                respRef.rowArry[finalRowIndex].columnValue = columnValue;
                                // If question type is multi, show next row in rowWrap
                                if (isMulti && (rowWrap.children[colIndex + 1])) {
                                    rowWrap.children[colIndex + 1].style.display = "block";
                                }
                            } else if (respRef.rowArry[finalRowIndex].columnValue !== columnValue) {
                                // Return row to home location
                                rowWgt.animType[selectAnimType].down.call(rowWgt, (false));
                                rowNode.setAttribute("lastX", "0");
                                rowNode.setAttribute("lastY", "0");
                                rowNode.style.left = 0;
                                rowNode.style.top = 0;
                                rowWgt.isAnswered(false);
                                rowWgt.valueLabel("");

                                // See if we need to unanswer row
                                if (respRef.rowArry[finalRowIndex].columnValue !== -1) {
                                    var rowRemRefArray = respRef.colArry[respRef.rowArry[finalRowIndex].columnValue].rowRefArry;
                                    rowRemRefArray.splice(jQuery.inArray(rowWrap, rowRemRefArray), 1);
                                    that.sendResponse(rowIndex, respRef.rowArry[finalRowIndex].columnValue, false);
                                    respRef.rowArry[finalRowIndex].rangeValue = -1;
                                    respRef.rowArry[finalRowIndex].columnValue = -1;
                                    if (isSeq) { rowContain.back(rowWgt); }
                                }
                            } else {
                                respRef.rowArry[finalRowIndex].rangeValue = rangeValue;
                            }
                        }

                        // For touchEnabled and pin animation
                        if (touchEnabled && selectAnimType === "pin" && !isTouchMove) {
                            var pin = rowWgt.cache().nodes.pin;
                            if (pin !== curPinSelect) {
                                if (curPinSelect) {
                                    var prevRowNode = curPinSelect.parentNode,
                                        prevRowIndex = parseInt(prevRowNode.getAttribute('rowIndex'), 10),
                                        prevColIndex = parseInt(prevRowNode.getAttribute('colIndex'), 10),
                                        prevRowWgt = respRef.rowArry[(!isMulti) ? prevRowIndex : (prevRowIndex * clen) + prevColIndex].row;

                                    prevRowWgt.animType.pin.hover.call(prevRowWgt, false);
                                }

                                //console.log("true");
                                rowWgt.animType.pin.hover.call(rowWgt, true);
                                curPinSelect = pin;
                            } else {
                                //console.log("false");
                                rowWgt.animType.pin.hover.call(rowWgt, false);
                                curPinSelect = null;
                            }
                        }
                    });
                }
            });

            // Garbage collect
            rowContainConfigObj = null;
            rowBtnConfigObj = null;
            colSldrConfigObj = null;
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

        getDimenResp: function() {
            if (!this.qStudioVar.isDC) { return; }
            var respRef = this.qStudioVar.respRef,
                isMulti = (this.questionType() === "multi"),
                valarray = [],
                rlen = this.qStudioVar.rowArray.length,
                clen = this.qStudioVar.columnArray.length,
                json = { Response: { Value: valarray } };

            if (isMulti) {
                for (var i=0; i<rlen; i+=1) {
                    for (var j=0; j<clen; j+=1) {
                        var row_id = respRef.rowArry[(i * clen) + j].row.widget().id,
                            rangeValue = respRef.rowArry[(i * clen) + j].rangeValue,
                            columnValue = respRef.rowArry[(i * clen) + j].columnValue;

                        if (columnValue !== -1) {
                            valarray.push(row_id);
                            json.Response[row_id] = {
                                rangeValue: rangeValue,
                                columnValue: columnValue
                            };
                        }
                    }
                }
            }

            else {
                for (var i=0; i<rlen; i+=1) {
                    var row_id = respRef.rowArry[i].row.widget().id,
                        rangeValue = respRef.rowArry[i].rangeValue,
                        columnValue = respRef.rowArry[i].columnValue;

                    if (columnValue !== -1) {
                        valarray.push(row_id);
                        json.Response[row_id] = {
                            rangeValue: rangeValue,
                            columnValue: columnValue
                        };
                    }
                }
            }

            return json;
        }
    };

    return DragnFlag;

})();
