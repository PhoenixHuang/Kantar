/**
 * DragnDrop Javascript File
 * Version : 1.2.0
 * Date : 2014-06-17
 *
 * DragnDrop Component.
 * BaseClassType : Multi
 * Requires rowArray and columnArray datasets.
 * Confluence Link : https://docs.gmi-mr.com/confluence/display/midev/DragnDrop+Component+Documentation
 *
 * Release 1.2.0
 * - compRTL is now automatically set for Dimensions and Decipher. QFactory utility method 'isSurveyRTL' is used
 * - made adjustments and bug fixes for RTL
 * - fixed bug when buckets were set to grow. The column container height was not being updated hence layout issues in Decipher/Dimensions
 * - Added new parameter colContainOptHalign which horizontally aligns column options. Options include 'left', 'right', & 'center'. Applies to vertical layout directions only
 * - Added new parameter colContainOptValign which vertically aligns column options. Options include 'top', 'bottom', & 'middle'. Applies to horizontal layout directions only
 * - Updated MSPointer events per http://msdn.microsoft.com/en-us/library/dn304886(v=vs.85).aspx
 * - For QStudio Component Creation Window RTL display is turned off. Enabling RTL will move content to the right
 *   which is throwing off positioning
 * - Updated events on QStudio Next button to work better w/ touch scrolling
 * - Limit rowContainHgap and rowContainVgap to 0. This is to avoid issues w/ stacking rows and having draggable area collisions
 * - Prevent column containers w/ vertical directions from bucket growing.
 * - Bucket growing now works w/ horizontal grid layouts for column container.
 *
 */

var DragnDrop = (function () {

    function DragnDrop() {
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
                "radiocheck"
            ]
        };
    }

    DragnDrop.prototype = {

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
            return 'DragnDrop component description...';
        },

        // Component base class type
        baseClassType: function() {
            // Multi column base class type
            return 'multi';
        },

        // Component question type
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

        /*
         * Call to init default component parameters
         */
        initParams: function() {
            return {
                // Component Parameters
                compQuestionType: { name:"Component: Question Type", value:'Single', description:"Component question type. ", type:"combo", options:['Single', 'Multi', 'Restrict'], order:1 },
                compContainPos: { name:"Component Contain: CSS Position", value:"relative", description:"CSS position property for component container element.", type:"combo", options:["absolute", "relative"], order: 4 },
                compRTL: { name:"Component RTL: Enable", value:false, description:"If set true, component will be setup to support right-to-left languages.", type:"bool", order:24 },

                // Row Container Parameters
                // Note: Container AutoSizes by default for this component since we dont want scrollbars appearing and clipped containers
                rowContainType: { name:"Row Contain: Layout Type", value:"horizontal grid layout", description:"Layout template type applied to row buttons.", type:"combo", options:["horizontal grid layout", "vertical grid layout", "horizontal layout", "vertical layout", "sequential layout"], order: 3 },
                rowContainWidth: { name:"Row Contain: Bckgrnd Width", value:800, description:"Row container background width, in pixels.", type:"number", min:50, wgtref: 'rowcontain', wgtname:"width", order: 5 },
                rowContainHeight: { name:"Row Contain: Bckgrnd Height", value:600, description:"Row container background height, in pixels.", type:"number", min:50, wgtref: 'rowcontain', wgtname:"height", order: 6 },
                rowContainPadding: { name:"Row Contain: Bckgrnd Padding", value:0, description:"Row container background padding, in pixels.", type:"number", min:0, wgtref: 'rowcontain', wgtname:"padding", order: 7 },
                rowContainHgap: { name:"Row Contain: Horz Btn Spacing", value:5, description:"The horizontal spacing of row buttons, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"hgap", order: 8 },
                rowContainVgap: { name:"Row Contain: Vert Btn Spacing", value:5, description:"The vertical spacing of row buttons, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"vgap", order: 9 },
                rowContainHoffset: { name:"Row Contain: Left CSS Pos", value:0, description:"Left CSS position value used to offset row button container from its default location, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"left", order: 10 },
                rowContainVoffset: { name:"Row Contain: Top CSS Pos", value:0, description:"Top CSS position value used to offset row button container from its default location, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"top", order: 11 },
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
                rowBckgrndShowImp: { name:"Row Btn: Show Import Bckgrnd", value:false, description:"If set true, background will display an imported image instead of a background color.", type:"bool", order:49 },
                rowBckgrndImpUp: { name:"Row Btn: Import UP Bckgrnd", value:"", description:"Import background image to use when button is in its default state.", type:"bitmapdata", order:43 },
                rowBckgrndImpOver: { name:"Row Btn: Import OVER Bckgrnd", value:"", description:"Import background image to use on button mouse over.", type:"bitmapdata", order:43 },
                rowBckgrndImpDown: { name:"Row Btn: Import DOWN Bckgrnd", value:"", description:"Import background image to use on button select.", type:"bitmapdata", order:45 },

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
                rowBtnMouseOverDownShadow: { name:"Row Animation: OVER/DOWN Show Shadow", value:false, description:"If set true, button background will display a shadow on mouse over and when button is selected.", type:"bool", wgtref: 'rowbtn', wgtname:"mouseover_shadow", order:87 },
                rowBtnMouseOverScale: { name:"Row Animation: OVER Scale", value:100, description:"Button scale size on mouse over. Any value greater than 100 is above normal scale.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"mouseover_scale", order:89 },
                rowBtnDragAlpha: { name:"Row Animation: Drag Transparency", value:50, description:"Button opacity during button drag. The smaller the value the more transparent, the larger the value the less transparent.", type:"number", min:50, max:100, order:76 },
                rowBtnMouseDownAlpha: { name:"Row Animation: DOWN State Transparency", value:100, description:"Button opacity on button selection. The smaller the value the more transparent, the larger the value the less transparent.", type:"number", min:0, max:100, wgtref: 'rowbtn', wgtname:"mousedown_alpha", order:91 },

                // Column Container Parameters
                // Note: Container AutoSizes by default for this component since we dont want scrollbars appearing and clipped containers
                colContainType: { name:"Column Contain: Layout Type", value:"horizontal layout", description:"Layout template type applied to column buckets.", type:"combo", options:["horizontal grid layout", "vertical grid layout", "horizontal layout", "vertical layout"], order: 3 },
                colContainWidth: { name:"Column Contain: Bckgrnd Width", value:800, description:"Column container background width, in pixels.", type:"number", min:50, wgtref: 'colcontain', wgtname:"width", order: 5 },
                colContainHeight: { name:"Column Contain: Bckgrnd Height", value:400, description:"Column container background height, in pixels.", type:"number", min:50, wgtref: 'colcontain', wgtname:"height", order: 6 },
                colContainPadding: { name:"Column Contain: Bckgrnd Padding", value:0, description:"Column container background padding, in pixels.", type:"number", min:0, wgtref: 'colcontain', wgtname:"padding", order: 7 },
                colContainHgap: { name:"Column Contain: Horz Btn Spacing", value:5, description:"The horizontal spacing of column buckets, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"hgap", order: 8 },
                colContainVgap: { name:"Column Contain: Vert Btn Spacing", value:5, description:"The vertical spacing of column buckets, in pixels.", type:"number", wgtref: 'colcontain', wgtname:"vgap", order: 9 },
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

                // Column Bucket
                colDzoneDropAnimation: { name:"Column Animation: Row Drop Type", value:'anchor', description:"Component bucket drop animation type.", type:"combo", options:['anchor', 'fade', 'list', 'crop'], wgtref: 'coldzone', wgtname:"bucket_animation", order:100 },
                colDzoneGrowAnimation: { name:"Column Animation: Bucket Grow Type", value:'none', description:"Component bucket grow animation type.", type:"combo", options:['none', 'grow individual', 'grow all'], wgtref: 'coldzone', wgtname:"grow_animation", order:101 },
                colDzoneCropWidth: { name:"Column Animation: Crop Width", value:50, description:"Row drop cropping width, in pixels.", type:"number", min:5, wgtref: 'coldzone', wgtname:"crop_width", order:102 },
                colDzoneCropHeight: { name:"Column Animation: Crop Height", value:50, description:"Row drop cropping height, in pixels.", type:"number", min:5, wgtref: 'coldzone', wgtname:"crop_height", order:103 },
                colDzoneContainHgap: { name:"Column Drop: Horz Spacing", value:5, description:"Horizontal spacing of dropped row buttons, in pixels.", type:"number", wgtref: 'coldzone', wgtname:"hgap", order:104 },
                colDzoneContainVgap: { name:"Column Drop: Vert Spacing", value:5, description:"Vertical spacing of dropped row buttons, in pixels.", type:"number", wgtref: 'coldzone', wgtname:"vgap", order:105 },
                colDzoneContainPadding: { name:"Column Drop: Container Padding", value:4, description:"Bucket drop container padding, in pixels.", type:"number", min:0, wgtref: 'coldzone', wgtname:"contain_padding", order:106 },
                colDzoneWidth: { name:"Column Bucket: Bckgrnd Width", value:150, description:"Bucket background width, in pixels.", type:"number", min:10, wgtref: 'coldzone', wgtname:"width", order:102 },
                colDzoneHeight: { name:"Column Bucket: Bckgrnd Height", value:125, description:"Bucket background height, in pixels.", type:"number", min:10, wgtref: 'coldzone', wgtname:"height", order:103 },
                colDzoneShowBckgrnd: { name:"Column Bucket: Show Bckgrnd", value:true, description:"If set false, bucket background will not display.", type:"bool", wgtref: 'coldzone', wgtname:"show_bckgrnd", order:114 },
                colDzoneBorderStyle: { name:"Column Bucket: Border Style", value:"solid", description:"Bucket background CSS border style property.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'coldzone', wgtname:"border_style", order:107 },
                colDzoneBorderWidth: { name:"Column Bucket: Border Width", value:2, description:"Bucket background border width, in pixels.", type:"number", wgtref: 'coldzone', wgtname:"border_width", order:108 },
                colDzoneBorderRadius: { name:"Column Bucket: Border Radius", value:0, description:"Bucket background border radius, in pixels.", type:"number", min:0, wgtref: 'coldzone', wgtname:"border_radius", order:109 },
                colDzoneBorderColorUp: { name:"Column Bucket: Border UP Colour", value:0xA6A8AB, description:"Bucket background border color in its default state.", type:"colour", wgtref: 'coldzone', wgtname:"border_color_up", order:110 },
                colDzoneBorderColorOver: { name:"Column Bucket: Border OVER Colour", value:0x5B5F65, description:"Bucket background border color on mouse over.", type:"colour", wgtref: 'coldzone', wgtname:"border_color_over", order:111 },
                colDzoneBckgrndColorUp: { name:"Column Bucket: Bckgrnd UP Colour", value:0xF2F2F2, description:"Bucket background color in its default state.", type:"colour", wgtref: 'coldzone', wgtname:"bckgrnd_color_up", order:112 },
                colDzoneBckgrndColorOver: { name:"Column Bucket: Bckgrnd OVER Colour", value:0xA6A8AB, description:"Bucket background color on mouse over.", type:"colour", wgtref: 'coldzone', wgtname:"bckgrnd_color_over", order:113 },
                colDzoneShowBckgrndImp: { name:"Column Bucket: Show Import Bckgrnd", value:false, description:"If set true, imported background images will be displayed instead of background colors.", type:"bool", wgtref: 'coldzone', wgtname:"show_bckgrnd_import", order:117 },
                colDzoneBckgrndImpUp: { name:"Column Bucket: Import UP Bckgrnd", value:"", description:"Import background image to use when bucket is in its default state.", type:"string", wgtref: 'coldzone', wgtname:"bckgrnd_import_up", order:115 },
                colDzoneBckgrndImpOver: { name:"Column Bucket: Import OVER Bckgrnd", value:"", description:"Import background image to use on bucket mouse over.", type:"string", wgtref: 'coldzone', wgtname:"bckgrnd_import_over", order:116 },
                colDzoneShowLabel: { name:"Column Label: Display", value:true, description:"If set false, bucket label will not display.", type:"bool", wgtref: 'coldzone', wgtname:"show_label", order:126 },
                colDzoneLabPlacement: { name:"Column Label: Placement", value:'top', description:"Bucket label placement in relation to its background element.", type:"combo", options:['top', 'bottom', 'bottom overlay', 'top overlay'], wgtref: 'coldzone', wgtname:"label_placement", order:118 },
                colDzoneLabHalign: { name:"Column Label: Horz Alignment", value:'left', description:"Horizontal text alignment for a bucket label field.", type:"combo", options:['left', 'right', 'center'], wgtref: 'coldzone', wgtname:"label_halign", order:119 },
                colDzoneLabHoffset: { name:"Column Label: Left CSS Pos", value:0, description:"Left CSS position value used to offset bucket label from its default location, in pixels.", type:"number", wgtref: 'coldzone', wgtname:"label_left", order:121 },
                colDzoneLabVoffset: { name:"Column Label: Top CSS Pos", value:0, description:"Top CSS position value used to offset bucket label from its default location, in pixels.", type:"number", wgtref: 'coldzone', wgtname:"label_top", order:122 },
                colDzoneLabFontSize: { name:"Column Label: Font Size", value:18, description:"Bucket label font size.", type:"number", min:5, wgtref: 'coldzone', wgtname:"label_fontsize", order:120 },
                colDzoneLabColorUp: { name:"Column Label: UP Font Color", value:0x5B5F65, description:"Bucket label font color in the bucket’s default state.", type:"colour", wgtref: 'coldzone', wgtname:"label_fontcolor_up", order:123 },
                colDzoneLabColorOver: { name:"Column Label: OVER Font Color", value:0x5B5F65, description:"Bucket label font color on bucket mouse over.", type:"colour", wgtref: 'coldzone', wgtname:"label_fontcolor_over", order:124 },
                colDzoneLabOverlayShowBckgrnd: { name:"Column Label Overlay: Display Bckgrnd", value:true, description:"If set true, Overlay label will display a background color.", type:"bool", wgtref: 'coldzone', wgtname:"show_label_bckgrnd", order:61 },
                colDzoneLabOverlayBckgrndColor: { name:"Column Label Overlay: Bckgrnd Color", value:0xFFFFFF, description:"Overlay label background color.", type:"colour", wgtref: 'coldzone', wgtname:"label_bckgrnd_color", order:125 },
                colDzoneLabOverlayPadding: { name:"Column Label Overlay: Padding", value:2, description:"Overlay label padding, in pixels.", type:"number", min:0, wgtref: 'coldzone', wgtname:"label_overlay_padding", order:32 },
                colDzoneLabOverlayValign: { name:"Column Label Overlay: Vert Alignment", value:'center', description:"Vertical text alignment for an overlay label field.", type:"combo", options:['top', 'bottom', 'center'], wgtref: 'coldzone', wgtname:"label_overlay_valign", order:119 },
                colDzoneLabOverlaySyncHeight: { name:"Column Label Overlay: Sync Height", value:false, description:"If set true, all overlay labels will be set to the calculated max label height.", type:"bool", order:127 },
                colDzoneImgDispType: { name:"Column Image: Display Type", value:'none', description:"Select where the image is placed in relation to the drop container.", type:"combo", options:['center', 'left', 'right', "none"], wgtref: 'coldzone', wgtname:"img_placement", order:40 },
                colDzoneImgWidth: { name:"Column Image: Width", value:100, description:"Image width, in pixels. Not applicable if image placement is center.", type:"number", min:25, wgtref: 'coldzone', wgtname:"img_width", order:129 },
                colDzoneImgPadding: { name:"Column Image: Padding", value:4, description:"Image padding, in pixels.", type:"number", min:0, wgtref: 'coldzone', wgtname:"img_padding", order:130 },
                colDzoneImgHoffset: { name:"Column Image: Left CSS Pos", value:0, description:"Left CSS position value used to offset bucket image from its default location, in pixels.", type:"number", wgtref: 'coldzone', wgtname:"img_left", order:131 },
                colDzoneImgVoffset: { name:"Column Image: Top CSS Pos", value:0, description:"Top CSS position value used to offset bucket image from its default location, in pixels.", type:"number", wgtref: 'coldzone', wgtname:"img_top", order:132 },

                // Tooltip Parameters
                rowBtnUseTooltip: { name:"Tooltip: Enable for Row Btn", value:false, description:"If set true and button has a description text, a tooltip will display on button mouse over.", type:"bool", order:92 },
                colDzoneUseTooltip: { name:"Tooltip: Enable for Column Bucket", value:false, description:"If set true and bucket has a description text, a tooltip will display on button mouse over.", type:"bool", order:112 },
                tooltipWidth: { name:"Tooltip: Bckgrnd Width", value:150, description:"Tooltip background width, in pixels.", type:"number", min:5, wgtref: 'tooltip', wgtname:"tooltip_width", order:93 },
                tooltipLabelHalign: { name:"Tooltip: Label Horz Alignment", value:'left', description:"Horizontal text alignment of tooltip label.", type:"combo", options:['left', 'right', 'center'], wgtref: 'tooltip', wgtname:"tooltip_halign", order:97 },
                tooltipFontSize: { name:"Tooltip: Label Size", value:18, description:"Tooltip label font size.", type:"number", min:5, wgtref: 'tooltip', wgtname:"tooltip_fontsize", order:98 },
                tooltipFontColor: { name:"Tooltip: Label Color", value:0x5B5F65, description:"Tooltip label font color.", type:"colour", wgtref: 'tooltip', wgtname:"tooltip_fontcolor", order:99 },

                // Zoom Button Parameters
                zoomActionType: { name:"LightBox: Action Type", value:'click append image', description:"User action type to display image gallery.", type:"combo", options:['click append image', 'click append widget', 'mouseover'], wgtref: 'ctz', wgtname:"action_type", order:52 },
                rowBtnUseZoom: { name:"LightBox: Enable for Row Btn", value:false, description:"If set true and button has an image, a click to zoom button will display.", type:"bool", order:100 },
                rowZoomHoffset: { name:"LightBox: Row Zoom Btn Left CSS Pos", value:0, description:"Left CSS position value used to offset click to zoom button from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"zoom_left", order:112 },
                rowZoomVoffset: { name:"LightBox: Row Zoom Btn Top CSS Pos", value:0, description:"Top CSS position value used to offset click to zoom button from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"zoom_top", order:113 },
                colDzoneUseZoom: { name:"LightBox: Enable for Column Bucket", value:true, description:"If set true and bucket has an image, a click to zoom button will display.", type:"bool", order:121 },
                colZoomHoffset: { name:"LightBox: Column Zoom Btn Left CSS Pos", value:0, description:"Left CSS position value used to offset zoom button from its default location, in pixels.", type:"number", wgtref: 'coldzone', wgtname:"zoom_left", order:112 },
                colZoomVoffset: { name:"LightBox: Column Zoom Btn Top CSS Pos", value:0, description:"Top CSS position value used to offset zoom button from its default location, in pixels.", type:"number", wgtref: 'coldzone', wgtname:"zoom_top", order:113 },
                zoomImp: { name:"LightBox: Zoom Btn Import Image", value:"", description:"Zoom button imported image.", type:"bitmapdata", wgtref: 'ctz', wgtname:"zoom_import", order:109 },
                zoomWidth: { name:"LightBox: Zoom Btn Width", value:20, description:"Zoom button background width, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"zoom_width", order:110 },
                zoomHeight: { name:"LightBox: Zoom Btn Height", value:20, description:"Zoom button background height, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"zoom_height", order:111 },
                zoomCloseImp: { name:"LightBox: Close Btn Import Image", value:"", description:"Gallery Close button imported image.", type:"bitmapdata", wgtref: 'ctz', wgtname:"close_import", order:117 },
                zoomCloseWidth: { name:"LightBox: Close Btn Width", value:22, description:"Close button width, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"close_width", order:118 },
                zoomCloseHeight: { name:"LightBox: Close Btn Height", value:22, description:"Close button height, in pixels.", type:"number", min:5, wgtref: 'ctz', wgtname:"close_height", order:119 },
                zoomCloseHoffset: { name:"LightBox: Close Btn Left CSS Pos", value:0, description:"Left CSS position value used to offset close button from its default location, in pixels.", type:"number", wgtref: 'ctz', wgtname:"close_left", order:120 },
                zoomCloseVoffset: { name:"LightBox: Close Btn Top CSS Pos", value:0, description:"Top CSS position value used to offset close button from its default location, in pixels.", type:"number", wgtref: 'ctz', wgtname:"close_top", order:121 },

                /**********************************/
                // Additional Parameters
                /**********************************/
                rowKantBtnLabelWidth: { name:"Row KantarBase Btn: Label Width", value:150, description:"Button label field width, in pixels. If the actual label width ends up being less than the given value, the label width assigned will be the lesser of the two.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"kantarbtn_label_width", order:71, display:false },
                rowRadChckLabelHoffset: { name:"Row RadChk Btn: Label Left CSS Pos", value:0, description:"Left CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"radchkbtn_label_left", order:54, display:false },
                rowRadChckLabelVoffset: { name:"Row RadChk Btn: Label Top CSS Pos", value:0, description:"Top CSS position value used to offset button label from its default location, in pixels.", type:"number", wgtref: 'rowbtn', wgtname:"radchkbtn_label_top", order:55, display:false },
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
                zoomBckgrndColor: { name:"LightBox: Zoom Btn Bckgrnd Color", value:0xFFFFFF, description:"Click to Zoom button background color.", type:"colour", wgtref: 'ctz', wgtname:"zoom_bckgrnd_color", order:116, display:false }
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

        bindGrowCallBack: function(value) {
            if (typeof value === "function") {
                this._growCallBack = value;
            } else {
                return this._growCallBack;
            }
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
                rowContain : undefined,
                colContain : undefined,
                compContain : undefined,
                rowArry: [],    // Stores a reference of each row in component
                colArry: []     // Stores a reference of each bucket in component
            };

            // Auto-set compRTL parameter based on Survey Platform RTL settings
            if (QUtility.isSurveyRTL()) {
                this.qStudioVar.params.compRTL.value = true;
            }

            // Disable RTL in QStudio Component Creation Window due to positioning issues
            this.qStudioVar.isCompRTL =
                (!(parent && parent.id === "componentDemoContainer")) ? this.qStudioVar.params.compRTL.value : false;

            var params = this.qStudioVar.params,
                rowContainType = params.rowContainType.value.toLowerCase(),
                colContainType = params.colContainType.value.toLowerCase();

            // Do not allow buckets to grow for vertical column container layouts
            if (colContainType.indexOf("vertical") !== -1 && params.colDzoneGrowAnimation.value !== "none") {
                params.colDzoneGrowAnimation.value = "none";
            }

            var that = this,
                doc = document,
                dcProxy = this.qStudioVar.dcProxy,
                rowArray = this.qStudioVar.rowArray,
                columnArray = this.qStudioVar.columnArray,
                colArryLen = columnArray.length,
                respRef = this.qStudioVar.respRef,
                compQType = params.compQuestionType.value.toLowerCase(),
                rowContainConfigObj = this.paramObj('rowcontain'),
                rowBtnConfigObj = this.paramObj('rowbtn'),
                colContainConfigObj = this.paramObj('colcontain'),
                colBucketConfigObj = this.paramObj('coldzone'),
                toolTipConfigObj = this.paramObj('tooltip'),
                ctzConfigObj = this.paramObj('ctz'),
                touchEnabled = QUtility.isTouchDevice(),
                isMSTouch = QUtility.isMSTouch(),
                isMulti = (this.questionType() === 'multi'),
                isSeq = (!isMulti && (rowContainType.indexOf("sequential") !== -1)),
                syncLabOverlayHeight = params.colDzoneLabOverlaySyncHeight.value,
                rowContainBckgrndDispType = params.rowContainBckgrndDispType.value.toLowerCase(),
                colContainBckgrndDispType = params.colContainBckgrndDispType.value.toLowerCase(),
                maxBucketLabHeight = 0,
                syncTxtBtnHeight = (params.rowTxtBtnAdjustHeightType.value === "all"),
                syncTxtBtnArray = [],
                maxTxtBtnHeight = 0,
                rowContain = null,
                colContain = null,
                compContain = null,
                downEvent = (!isMSTouch) ? ((touchEnabled) ? "touchstart.dragndrop" : "mousedown.dragndrop") :
                    ((touchEnabled) ? ((window.PointerEvent) ? "pointerdown.dragndrop" : "MSPointerDown.dragndrop") : "mousedown.dragndrop"),
                moveEvent = (!isMSTouch) ? ((touchEnabled) ? "touchmove.dragndrop" : "mousemove.dragndrop") :
                    ((touchEnabled) ? ((window.PointerEvent) ? "pointermove.dragndrop" : "MSPointerMove.dragndrop") : "mousemove.dragndrop"),
                upEvent = (!isMSTouch) ? ((touchEnabled) ? "touchend.dragndrop" : "mouseup.dragndrop") :
                    ((touchEnabled) ? ((window.PointerEvent) ? "pointerup.dragndrop" : "MSPointerUp.dragndrop") : "mouseup.dragndrop");

            // If component is setup for "Restrict", make sure to hijack control of QStudio Survey Next button
            if (compQType === "restrict" && this.qStudioVar.isDC && dcProxy) {
                var navBtnEvent = (!isMSTouch) ?
                        ((!touchEnabled) ? "click.dragndrop mousedown.dragndrop" : "touchstart.dragndrop touchend.dragndrop touchmove.dragndrop"):
                        ((!touchEnabled) ? "click.dragndrop mousedown.dragndrop" : ((window.PointerEvent) ? "pointerdown.dragndrop pointerup.dragndrop" : "MSPointerDown.dragndrop MSPointerUp.dragndrop")),
                    isTouchMove = false;

                dcProxy.hideNextButton();
                this.qStudioVar.restrictMet = false;
                this.qStudioVar.compNextBtn = dcProxy.createComponentNextButton();
                this.qStudioVar.compNextBtn.enabled = false;
                $(this.qStudioVar.compNextBtn).css({
                    cursor : "default",
                    opacity : 0.35
                });

                $(this.qStudioVar.compNextBtn).on("mouseenter.dragndrop mouseleave.dragndrop", function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $(this).css({ opacity : 0.35});
                });

                // Event handler for survey next button
                $(this.qStudioVar.compNextBtn).on(navBtnEvent, function(event) {
                    event.stopPropagation();
                    if (event.type === "mousedown" || event.type === "click") {
                        event.preventDefault();
                        $(this).css({ opacity : (this.enabled) ? 1 : 0.35 });
                    }

                    if (!this.enabled) { return false; }
                    if (event.type !== "touchmove") {
                        if (event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                            if (isTouchMove) { return; }
                            dcProxy.removeComponentNextButton(this);
                            dcProxy.next();
                        } else {
                            isTouchMove = false;
                        }
                    } else {
                        isTouchMove = true;
                    }
                });
            }

            // Init External Widgets
            toolTipConfigObj.isRTL = that.qStudioVar.isCompRTL;
            QStudioCompFactory.lightBoxFactory("basic", doc.body, ctzConfigObj);
            QStudioCompFactory.toolTipFactory("", doc.body, toolTipConfigObj);
            if (params.colDzoneDropAnimation.value.toLowerCase() === "fade") {
                params.colDzoneGrowAnimation.value = "none";
            }

            // Row Container settings
            rowContainConfigObj.id = "QRowContainer";
            rowContainConfigObj.isRTL = that.qStudioVar.isCompRTL;
            rowContainConfigObj.direction = (rowContainType.indexOf("vertical") !== -1) ? "vertical" : "horizontal";
            rowContainConfigObj.position = "relative";
            rowContainConfigObj.autoWidth = true;
            rowContainConfigObj.autoHeight = true;
            rowContainConfigObj.show_bckgrnd = (rowContainBckgrndDispType === "vector");
            rowContainConfigObj.show_bckgrnd_import = (rowContainBckgrndDispType === "import");
            if (isSeq) { rowContainConfigObj.left = colContainConfigObj.left; }
            if (rowContainConfigObj.hgap < 0) { rowContainConfigObj.hgap = 0;}
            if (rowContainConfigObj.vgap < 0) { rowContainConfigObj.vgap = 0;}

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

            // Column Bucket settings
            colBucketConfigObj.isRTL = that.qStudioVar.isCompRTL;

            // Component Container CSS Style
            compContain = doc.createElement("div");
            compContain.id = "DragnDropComponent";
            compContain.dir = (!that.qStudioVar.isCompRTL) ? 'ltr' :'rtl';
            compContain.className = "qdragndrop_component";
            compContain.style.position = params.compContainPos.value;
            compContain.style.width = "100%";
            compContain.style.height = "100%";
            this.qStudioVar.respRef.compContain = compContain;
            parent = (parent && parent.nodeType === 1) ? parent : doc.body;
            parent.appendChild(compContain);

            // Do not allow sequential layout for Multi question type
            if ((rowContainType.indexOf("sequential") !== -1) && !isSeq) {
                rowContainConfigObj.direction = "horizontal";
                rowContainType = "grid";
            }

            // Create Row Container
            rowContain = QStudioCompFactory.layoutFactory(
                rowContainType.substr(0, rowContainType.indexOf('layout')-1),
                compContain,
                rowContainConfigObj
            );
            rowContain.container().style.zIndex = 3000;
            this.qStudioVar.respRef.rowContain = rowContain;

            // Add Row Widgets to Row Container
            for (var i=0, rlen=rowArray.length; i<rlen; i+=1) {
                var userDefType = jQuery.trim(rowArray[i].var1 || rowArray[i].type).toLowerCase(),
                    isRadio = (rowArray[i].var2 || rowArray[i].isRadio),
                    rowBtnType = params.rowBtnDefaultType.value,
                    rowWgt = null;

                // Set user defined type, but make sure its one of the accepted values
                if (that.isRowTypeValid(userDefType)) { rowBtnType = userDefType; }

                rowBtnConfigObj.rowIndex = i;
                rowBtnConfigObj.id = rowArray[i].id+'_'+0 || 'row_'+i+'_'+0;
                rowBtnConfigObj.isRadio = (isRadio && isRadio.toString().toLowerCase().indexOf("true") !== -1);
                rowBtnConfigObj.label = rowArray[i].label;
                rowBtnConfigObj.description = rowArray[i].description;
                rowBtnConfigObj.image = rowArray[i].image;
                rowBtnConfigObj.width = rowArray[i].width || params.rowBtnWidth.value;
                rowBtnConfigObj.height = rowArray[i].height || params.rowBtnHeight.value;
                rowBtnConfigObj.show_bckgrnd_import = (typeof rowArray[i].showImpBckgrnd === 'boolean') ?
                    rowArray[i].showImpBckgrnd : params.rowBckgrndShowImp.value;
                rowBtnConfigObj.bckgrnd_import_up = rowArray[i].bckgrndUp || params.rowBckgrndImpUp.value;
                rowBtnConfigObj.bckgrnd_import_over = rowArray[i].bckgrndOver || params.rowBckgrndImpOver.value;
                rowBtnConfigObj.bckgrnd_import_down = rowArray[i].bckgrndDown || params.rowBckgrndImpDown.value;
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

                // Create 'colIndex' attribute for Row Widget
                rowWgt.widget().setAttribute('colIndex', "0");
                rowWgt.colIndex(0);

                // Store reference of Row Widget and its Wrapper Node for use w/ Controller
                respRef.rowArry.push({
                    wrap: null,
                    row: rowWgt
                });

                // Init Row Drag Vars
                rowWgt.widget().setAttribute("lastX", "0");
                rowWgt.widget().setAttribute("lastY", "0");

                if (syncTxtBtnHeight) {
                    if (rowBtnType.toLowerCase() === "text") {
                        syncTxtBtnArray[(!isMulti) ? i : i * colArryLen] = rowWgt;
                        // Record wigdet max height
                        maxTxtBtnHeight = Math.max(maxTxtBtnHeight, $(rowWgt.widget()).outerHeight());
                    }
                }

                // Create Row Button(s) and add to Wrapper
                if (isMulti) {
                    for (var j=1; j<colArryLen; j+=1) {
                        if (!rowBtnConfigObj.isRadio) {
                            rowBtnConfigObj.id = rowArray[i].id+'_'+j || 'row_'+i+'_'+j;
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

                            // Create 'colIndex' attribute for Row Widget
                            rowWgt.widget().setAttribute('colIndex', j.toString());
                            rowWgt.colIndex(j);

                            // Init Row Button Controller Properties
                            rowWgt.widget().style.display = 'none';
                            rowWgt.widget().setAttribute("lastX", "0");
                            rowWgt.widget().setAttribute("lastY", "0");
                        } else {
                            rowWgt = null;
                        }

                        // Store reference of Row Widget and its Wrapper Node for use w/ Controller
                        respRef.rowArry.push({
                            wrap: null,
                            row: rowWgt
                        });

                        if (syncTxtBtnHeight) {
                            if (rowBtnType.toLowerCase() === "text") {
                                syncTxtBtnArray[(i * colArryLen) + j] = rowWgt;
                            }
                        }
                    }
                }
            }

            // Add Row Widgets to Row Container
            for (var i=0, rlen=respRef.rowArry.length; i<rlen; i+=1) {
                if (!respRef.rowArry[i].row) { continue; }
                var rowWgt = respRef.rowArry[i].row,
                    rowIndex = parseInt(rowWgt.widget().getAttribute("rowIndex"), 10),
                    colIndex = parseInt(rowWgt.widget().getAttribute("colIndex"), 10),
                    rowWrap = null;

                if (syncTxtBtnArray[(!isMulti) ? rowIndex : (rowIndex * colArryLen) + colIndex]) {
                    rowWgt.config({
                        height : maxTxtBtnHeight,
                        txtbtn_trim : false
                    });
                }

                // Add to row container
                if (colIndex === 0) {
                    rowWrap = rowContain.add(rowWgt, !!rowArray[rowIndex].ownRow);
                } else {
                    rowWrap = respRef.rowArry[(rowIndex * colArryLen)].wrap;
                    rowWrap.appendChild(rowWgt.widget());
                }

                // Store reference of Row Widget and its Wrapper Node for use w/ Controller
                respRef.rowArry[i].wrap = rowWrap;
            }

            // Create Column Container
            colContain = QStudioCompFactory.layoutFactory(
                colContainType.substr(0, colContainType.indexOf('layout')-1),
                compContain,
                colContainConfigObj
            );
            this.qStudioVar.respRef.colContain = colContain;

            // Add Bucket(s) to Column Container
            for (var i= 0; i<colArryLen; i+=1) {
                colBucketConfigObj.id = columnArray[i].id || 'col_'+i;
                colBucketConfigObj.colIndex = i;
                colBucketConfigObj.label = columnArray[i].label;
                colBucketConfigObj.description = columnArray[i].description;
                colBucketConfigObj.image = columnArray[i].image;
                colBucketConfigObj.capvalue = (compQType !== 'restrict') ? columnArray[i].var1 : 1;
                colBucketConfigObj.width = columnArray[i].width || params.colDzoneWidth.value;
                colBucketConfigObj.height = columnArray[i].height || params.colDzoneHeight.value;
                colBucketConfigObj.show_bckgrnd_import = (typeof columnArray[i].showImpBckgrnd === 'boolean') ?
                    columnArray[i].showImpBckgrnd : params.colDzoneShowBckgrndImp.value;
                colBucketConfigObj.bckgrnd_import_up = columnArray[i].bckgrndUp || params.colDzoneBckgrndImpUp.value;
                colBucketConfigObj.bckgrnd_import_over = columnArray[i].bckgrndOver || params.colDzoneBckgrndImpOver.value;
                colBucketConfigObj.use_tooltip = (typeof columnArray[i].useTooltip === 'boolean') ?
                    columnArray[i].useTooltip : params.colDzoneUseTooltip.value;
                colBucketConfigObj.use_lightbox = (typeof columnArray[i].useZoom === 'boolean') ?
                    columnArray[i].useZoom : params.colDzoneUseZoom.value;

                // Create Column Dropzones and bind to Column Container
                var colWgt = QStudioCompFactory.widgetFactory(
                    'basebucket',
                    compContain,
                    colBucketConfigObj
                );

                // Set whether column should be enabled determined via render state.
                colWgt.enabled(this.qStudioVar.interact, { alphaVal: 100 });

                // Check to see if user is on touch device and take appropriate action
                colWgt.touchEnabled(touchEnabled);

                // Remove default mouse enter/leave events
                colWgt.removeEvent(colWgt.widget(), "mouseenter.widget mouseleave.widget");

                // Create 'colIndex' attribute for Column Widget
                colWgt.widget().setAttribute('colIndex', i.toString());

                // Add to row container
                var colWrap = colContain.add(colWgt),
                    colWrapParent = colWrap.parentNode;

                // Store reference of Column Widget for use w/ Controller
                respRef.colArry.push({
                    column: colWgt,
                    colWrap : colWrap,
                    colWrapParent : colWrapParent,
                    rowRefArry: []
                });

                // Calculate Max Bucket Label Height
                if (syncLabOverlayHeight) {
                    maxBucketLabHeight = Math.max($(colWgt.cache().nodes.label).height(), maxBucketLabHeight);
                }
            }

            // Sync Bucket label height to max label height
            if (syncLabOverlayHeight && (params.colDzoneLabPlacement.value.toLowerCase().indexOf("overlay") !== -1)) {
                for (var i= 0; i<colArryLen; i+=1) {
                    var colWgt = respRef.colArry[i].column;
                    colWgt.config({ label_height: maxBucketLabHeight });
                    colWgt.enabled(this.qStudioVar.interact, { alphaVal: 100 });
                }
            }

            if (isSeq) {
                rowContain.container().style[(!that.qStudioVar.isCompRTL) ? 'left' : 'right'] =
                    ($(colContain.container()).outerWidth() - $(rowContain.container()).outerWidth())*0.5 + "px";
            }

            // Init drag events for row widgets
            $(compContain).on(downEvent, '.qwidget_button', function(event) {
                event.stopPropagation();
                if (!touchEnabled) { event.preventDefault(); }
                if (isMSTouch && touchEnabled && !event.originalEvent.isPrimary) { return; }
                var touchEvent = (event.type.indexOf("touch") !== -1 && event.originalEvent.targetTouches) ?
                        event.originalEvent.targetTouches[0] : ((!isMSTouch) ? event : event.originalEvent),
                    rowNode = event.currentTarget,
                    surveyScale = QUtility.getQStudioSurveyScale(),
                    rowIndex = parseInt(rowNode.getAttribute('rowIndex'), 10),
                    colIndex = parseInt(rowNode.getAttribute('colIndex'), 10),
                    rowWgt = respRef.rowArry[(!isMulti) ? rowIndex : (rowIndex * colArryLen) + colIndex].row,
                    rowWrap = respRef.rowArry[(!isMulti) ? rowIndex : (rowIndex * colArryLen) + colIndex].wrap,
                    bucketOver = rowWgt.bucket();

                if (rowWgt.enabled()) {
                    // Pass method isDrag boolean true to indicate widget is being dragged
                    // This prevents mouse over behavior for other widgets
                    QStudioDCAbstract.prototype.isDrag(true);
                    rowNode.style.zIndex = 2000;
                    if (QUtility.ieVersion() === 7) {
                        rowWrap.style.zIndex = 2000;
                        rowWrap.parentNode.style.zIndex = 2000;
                    }

                    // Set rowNode opacity on drag
                    if (params.rowBtnDragAlpha.value >= 50 && params.rowBtnDragAlpha.value < 100) {
                        $(rowNode).css({ 'opacity': (params.rowBtnDragAlpha.value *.01) });
                    }

                    // If row is being dragged from within a bucket...
                    if (rowNode.parentNode !== rowWrap) {
                        // Append back to original wrapper when dragging
                        var dropX = (touchEvent.pageX - $(rowNode).offset().left),
                            dropY = (touchEvent.pageY - $(rowNode).offset().top);

                        rowWrap.appendChild(rowNode);
                        rowNode.dragX = $(rowNode).offset().left + dropX;
                        rowNode.dragY = $(rowNode).offset().top + dropY;
                        rowNode.style.top = ((touchEvent.pageY - rowNode.dragY)*(1/surveyScale.d)) + "px";
                        rowNode.style.left = ((touchEvent.pageX - rowNode.dragX)*(1/surveyScale.a)) + "px";
                    } else {
                        // Set rowNode dragX/dragY values to use w/ 'mouseMove'
                        rowNode.dragX = (touchEvent.pageX - parseInt(rowNode.getAttribute("lastX"), 10));
                        rowNode.dragY = (touchEvent.pageY - parseInt(rowNode.getAttribute("lastY"), 10));
                    }

                    $(doc).on(moveEvent, function(event) {
                        event.preventDefault();
                        var touchEvent = (event.type.indexOf("touch") !== -1 && event.originalEvent.targetTouches) ?
                            event.originalEvent.targetTouches[0] : ((!isMSTouch) ? event : event.originalEvent);

                        if (touchEvent.pageX < 0) { touchEvent.pageX = 0; }
                        if (touchEvent.pageY < 0) { touchEvent.pageY = 0; }
                        var ex = (touchEvent.pageX - rowNode.dragX),
                            ey = (touchEvent.pageY - rowNode.dragY);

                        // Move rowNode around!
                        rowNode.style.top = (ey*(1/surveyScale.d)) + "px";
                        rowNode.style.left = (ex*(1/surveyScale.a)) + "px";

                        // Set lastX and lastY rowNode attributes
                        rowNode.setAttribute("lastX", ex.toString());
                        rowNode.setAttribute("lastY", ey.toString());

                        // Determine which bucket we are currently over
                        for (var i=0; i<colArryLen; i+=1) {
                            var bucketWgt = respRef.colArry[i].column,
                                bucketNode = bucketWgt.widget();

                            bucketNode.left = $(bucketNode).offset().left;
                            bucketNode.right = bucketNode.left + ($(bucketNode).outerWidth()*surveyScale.a);
                            bucketNode.top = $(bucketNode).offset().top;
                            bucketNode.bot = bucketNode.top + ($(bucketNode).outerHeight()*surveyScale.d);
                            if (touchEvent.pageX >= bucketNode.left &&
                                touchEvent.pageX <= bucketNode.right &&
                                touchEvent.pageY >= bucketNode.top &&
                                touchEvent.pageY <= bucketNode.bot) {
                                bucketOver = bucketWgt;
                                bucketWgt.toggleMouseEnter(true);
                                break;
                            } else {
                                bucketOver = null;
                                bucketWgt.toggleMouseEnter(false);
                            }
                        }

                        for (var i=0; i<colArryLen; i+=1) {
                            var bucketWgt = respRef.colArry[i].column;
                            if (bucketOver !== bucketWgt) {
                                bucketWgt.toggleMouseEnter(false);
                            }
                        }

                    });

                    $(doc).on(upEvent, function(event) {
                        $(doc).off(moveEvent);
                        $(doc).off(upEvent);
                        QStudioDCAbstract.prototype.isDrag(false);
                        rowNode.style.zIndex = 'auto';
                        if (QUtility.ieVersion() === 7) {
                            rowWrap.style.zIndex = "auto";
                            rowWrap.parentNode.style.zIndex = "auto";
                        }

                        // Set rowNode opacity on drag
                        if (params.rowBtnDragAlpha.value >= 50 && params.rowBtnDragAlpha.value < 100) {
                            $(rowNode).css({ 'opacity': 1 });
                        }

                        // Call controller method
                        that.manageDrop(rowWgt, bucketOver);

                        // If question type is "restrict", check if we need to show QStudio survey next button
                        if (compQType === "restrict" && that.qStudioVar.isDC && dcProxy) {
                            var restrictMet = (that.getDimenResp().Response.Value.length === colArryLen);
                            if (that.qStudioVar.restrictMet !== restrictMet) {
                                that.qStudioVar.restrictMet = restrictMet;
                                that.qStudioVar.compNextBtn.enabled = restrictMet;
                                $(that.qStudioVar.compNextBtn).css({
                                    cursor : (restrictMet) ? "pointer" : "default",
                                    opacity : (restrictMet) ? 1 : 0.35
                                });

                                if (!touchEnabled) {
                                    if (that.qStudioVar.compNextBtn.enabled) {
                                        $(that.qStudioVar.compNextBtn).off("mouseenter.dragndrop mouseleave.dragndrop");
                                    } else {
                                        $(that.qStudioVar.compNextBtn).on("mouseenter.dragndrop mouseleave.dragndrop", function(event) {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            $(this).css({ opacity : 0.35});
                                        });
                                    }
                                }
                            }
                        }

                        if (bucketOver) {
                            bucketOver.toggleMouseEnter(false);
                            bucketOver = null;
                        }
                    });
                }
            });
        },

        growBuckets: function(growAll) {
            // Do not allow buckets to grow for vertical column container layouts
            var respRef = this.qStudioVar.respRef,
                params = this.qStudioVar.params,
                colArray = respRef.colArry,
                sizeArray = [],
                maxSize = 0,
                isGridLayout = (params.colContainType.value.toLowerCase().indexOf("grid") !== -1),
                layoutContain = respRef.colContain.cache().nodes.layoutContain,
                defaultLayout = respRef.colContain.cache().nodes.defaultLayout;

            if (growAll) {
                // Find max bucket height
                for (var i=0; i<colArray.length; i+=1) {
                    sizeArray.push(colArray[i].column.getBucketContainHeight());
                }
                sizeArray.push((params.colDzoneHeight.value));
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
                respRef.colContain.container().style.height = $(layoutContain).outerHeight(true) + "px";
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
                respRef.colContain.container().style.height = $(layoutContain).outerHeight(true) + "px";
            }
        },

        manageDrop: function(rowWgt, bucketWgt) {
            var params = this.qStudioVar.params,
                respRef = this.qStudioVar.respRef,
                rowContain = this.qStudioVar.respRef.rowContain,
                colArryLen = this.qStudioVar.columnArray.length,
                isMulti = (this.questionType() === 'multi'),
                rowContainType = params.rowContainType.value.toLowerCase(),
                isSeq = (!isMulti && (rowContainType.indexOf("sequential") !== -1)),
                growAnimation = params.colDzoneGrowAnimation.value,
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
                return respRef.rowArry[(!isMulti) ? rIndex : (rIndex * colArryLen) + cIndex].wrap;
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
                                bucketNode.style.left = '';
                                bucketNode.style.top = '';
                                bucketNode.style.display =
                                    (isMulti && bucketNode !== bucketWrap.children[0]) ? "none" : "block";

                                // Sequential layouts only
                                if (isSeq) { rowContain.back(bucketRow); }
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
                                rowRadioNode.style.left = '';
                                rowRadioNode.style.top = '';
                                rowRadioNode.style.display =
                                    (isMulti && rowRadioNode !== rowRadioWrap.children[0]) ? "none" : "block";

                                // Sequential layouts only
                                if (isSeq) { rowContain.back(rowRadioWgt); }
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
                            respNode.style.left = '';
                            respNode.style.top = '';
                            respNode.style.display =
                                (isMulti && respNode !== respNodeWrap.children[0]) ? "none" : "block";

                            // Sequential layouts only
                            if (isSeq) { rowContain.back(respWgt); }
                        }

                        // Add widget to bucket
                        bucketWgt.add(rowWgt);
                        // If question type is multi, show next row in rowWrap
                        if (isMulti && rowWrap.children[0]) {
                            rowWrap.children[0].style.display = "block";
                        }

                        // Set row as ANSWERED
                        rowWgt.isAnswered(true);
                        rowRefArry.push(rowWrap);
                        this.sendResponse(rowIndex, colIndex, true);        // *SEND RESPONSE

                        // See if we need to update bucket sizes
                        if (growAnimation.toLowerCase() !== "none") {
                            this.growBuckets(growAnimation.toLowerCase() === "grow all");
                            // Check if a callback was bound via bindGrowCallBack method
                            if (this.bindGrowCallBack()) { this.bindGrowCallBack()(); }
                        }

                        // Sequential layouts only
                        if (isSeq && !rowBucket) { rowContain.next(); }
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
                if (growAnimation.toLowerCase() !== "none") {
                    this.growBuckets(growAnimation.toLowerCase() === "grow all");
                    // Check if a callback was bound via bindGrowCallBack method
                    if (this.bindGrowCallBack()) { this.bindGrowCallBack()(); }
                }
            }
            // Return row to home location
            rowNode.setAttribute("lastX", "0");
            rowNode.setAttribute("lastY", "0");
            rowNode.style.left = "";
            rowNode.style.top = "";
            rowNode.style.display =
                (isMulti && rowNode !== rowWrap.children[0]) ? "none" : "block";

            // Sequential layouts only
            if (isSeq && rowBucket) { rowContain.back(rowWgt); }
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

        /*
         * For use w/ Dimensions. Set row initial responses.
         * @param respArry{Array} - responses to set
         */
        setDimenResp: function(respArry) {
            if (jQuery.isArray(respArry)) {
                var rowArray = this.qStudioVar.rowArray,
                    respRef = this.qStudioVar.respRef,
                    colArryLen = this.qStudioVar.columnArray.length,
                    params = this.qStudioVar.params;

                while(respArry.length !== 0)
                {
                    var isMulti = (this.questionType() === 'multi'),
                        rowIndex = parseInt(respArry[0].rowIndex, 10),
                        colIndex = parseInt(respArry[0].colIndex, 10),
                        row = null,
                        col = null;

                    if (rowIndex >= 0 && rowIndex < rowArray.length)
                    {
                        if (rowArray[rowIndex].isRadio || rowArray[rowIndex].var2) { isMulti = false; }
                        row = respRef.rowArry[(!isMulti) ? rowIndex : (rowIndex * colArryLen) + colIndex].row;
                        if (colIndex >= 0 && colIndex < respRef.colArry.length)
                        {
                            col = respRef.colArry[colIndex].column;
                            if (colIndex !== 0) { row.widget().style.display = ""; }
                            this.manageDrop(row, col);
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
                json = { Response: { Value: valarray } };

            for (var i=0, colArryLen=this.qStudioVar.respRef.colArry.length; i<colArryLen; i+=1)
            {
                var bucket = this.qStudioVar.respRef.colArry[i].column;
                for (var j=0, dlen=bucket.query().length; j<dlen; j+=1)
                {
                    var row_id = bucket.query()[j].widget().id,
                        col_id = bucket.widget().id;

                    valarray.push(row_id + "^" + col_id);
                }
            }

            return json;
        }
    };

    return DragnDrop;

})();