/**
 * LinkedSlider Javascript File
 * Version : 1.3.1
 * Date : 2014-09-26
 *
 * LinkedSlider Component.
 * BaseClassType : Single
 * Requires rowArray dataset.
 * Confluence Link : https://docs.gmi-mr.com/confluence/display/midev/LinkedSlider+Component+Documentation
 *
 */

var LinkedSlider = (function () {
    
    function LinkedSlider() {
        this.qStudioVar = {
            _googleLoadCallback : undefined,
            isUpdating : false,
            isCompAnswered : false,
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
                "radiocheck",
                "other",
                "other numeric",
                "kantarother",
                "kantarother numeric"
            ]
        };
    }
    
    LinkedSlider.prototype = {
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
            return 'LinkedSlider component description...';  
        },
        
        baseClassType: function() {
            // Single column base class type
            return 'single';
        },
        
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

        initParams: function() {
            return {
                // Component Parameters
                compContainPos: { name:"Component: CSS Position", value:"relative", description:"Component container CSS position.", type:"combo", options:["absolute", "relative"], order: 4 },
                compIsMandatory: { name:"Component: Is Mandatory", value:false, description:"If set true, mandatory conditions must be met to complete exercise.", type:"bool", order:24 },
                compIsAutoNext: { name:"Component: Is AutoNext", value:false, description:"If set true and component is mandatory, frame will auto advance after mandatory conditions are met.", type:"bool", order:24 },
                compRTL: { name:"Component: RTL Enable", value:false, description:"If set true, component will be setup to support right-to-left languages.", type:"bool", order:24 },
                compPrimFontFamily: { name:"Component: Primary Font Family", value:"Arial, Helvetica, sans-serif", description:"Font used for slider, button and layout labels.", type:"string", order:19 },
                compSecFontFamily: { name:"Component: Secondary Font Family", value:"‘Arial Narrow’, sans-serif", description:"Font used for slider tick labels and textarea inputs.", type:"string", order:19 },
                compDefaultColors: { name:"Component: Slider Default Colors", value:"0xF7964C, 0xB6CC42, 0x71C379, 0x6BB3B0, 0x647EBE, 0xF26354", description:"Comma separated list of slider default colors.", type:"string", order:19 },

                // Google Chart Parameters
                chartType: { name:"Google Chart: Type", value:"None", description:"Google chart type.", type:"combo", options:["Donut", "2D Pie Chart", "3D Pie Chart", "None"], order: 15 },
                chartPosition: { name:"Google Chart: Position", value:"left", description:"Google chart position w/ relation to the row container.", type:"combo", options:["left", "right", "top", "bottom"], order: 15 },
                chartLegendPosition: { name:"Google Chart: Legend Position", value:"none", description:"Google chart legend position.", type:"combo", options:["none", "left", "right", "top", "bottom"], order: 15 },
                chartSize: { name:"Google Chart: Size", value:85, description:"Size of the google chart. Number is percent based with 100 representing normal scale.", type:"number", min:50, max: 100, order:90 },
                chartFontSize: { name:"Google Chart: Font Size", value:16, description:"Chart font size, in pixels.", type:"number", min:5, order:98 },
                chartRemainText: { name:"Google Chart: 'Remaining' Text", value:"% Remaining", description:"Text used to represent percent remaining.", type:"string", order: 17 },
                chartWidth: { name:"Google Chart: Contain Width", value:500, description:"Chart container width, in pixels.", type:"number", min:50, order: 18 },
                chartHeight: { name:"Google Chart: Contain Height", value:500, description:"Chart container height, in pixels.", type:"number", min:50, order: 19 },
                chartHoffset: { name:"Google Chart: Contain Horz Offset", value:0, description:"Left CSS offset position, in pixels.", type:"number", order: 20 },
                chartVoffset: { name:"Google Chart: Contain Vert Offset", value:0, description:"Top CSS offset position, in pixels.", type:"number", order: 21 },

                // Row Container Parameters
                rowContainType: { name:"Row Contain: Layout Type", value:"horizontal grid layout", description:"Layout template applied to row sliders and buttons.", type:"combo", options:["horizontal grid layout", "vertical grid layout", "horizontal layout", "vertical layout"], order: 3 },
                rowContainWidth: { name:"Row Contain: Bckgrnd Width", value:800, description:"Row container background width, in pixels.", type:"number", min:50, wgtref: 'rowcontain', wgtname:"width", order: 5 },
                rowContainHeight: { name:"Row Contain: Bckgrnd Height", value:600, description:"Row container background height, in pixels.", type:"number", min:50, wgtref: 'rowcontain', wgtname:"height", order: 6 },
                rowContainPadding: { name:"Row Contain: Bckgrnd Padding", value:10, description:"Row container background padding, in pixels.", type:"number", min:0, wgtref: 'rowcontain', wgtname:"padding", order: 7 },
                rowContainAutoWidth: { name:"Row Contain: Autosize Bckgrnd Width", value:true, description:"If set true, row container width will be automatically set.", type:"bool", wgtref: 'rowcontain', wgtname:"autoWidth", order:17 },
                rowContainAutoHeight: { name:"Row Contain: Autosize Bckgrnd Height", value:true, description:"If set true, row container height will be automatically set.", type:"bool", wgtref: 'rowcontain', wgtname:"autoHeight", order:18 },
                rowContainHgap: { name:"Row Contain: Horz Btn Spacing", value:10, description:"The horizontal spacing of row sliders and buttons, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"hgap", order: 8 },
                rowContainVgap: { name:"Row Contain: Vert Btn Spacing", value:10, description:"The vertical spacing of row sliders and buttons, in pixels.", type:"number", wgtref: 'rowcontain', wgtname:"vgap", order: 9 },
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
                rowContainLabelColor: { name:"Row Contain: Label Font Color", value:0x5b5f65, description:"Row container label font color.", type:"colour", wgtref: 'rowcontain', wgtname:"label_fontcolor", order:23 },

                // Row Slider Parameters
                rowSldrBorderStyle: { name:"Slider: Border Style", value:"none", description:"Slider CSS border style.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'rowsldr', wgtname:"widget_border_style", order: 12 },
                rowSldrBorderWidth: { name:"Slider: Border Width", value:2, description:"Slider border width, in pixels.", type:"number", min:0, wgtref: 'rowsldr', wgtname:"widget_border_width", order: 13 },
                rowSldrBorderColor: { name:"Slider: Border Color", value:0xd2d3d5, description:"Slider border color.", type:"colour", wgtref: 'rowsldr', wgtname:"widget_border_color", order: 14 },
                rowSldrDirection: { name:"Slider: Direction", value:"horizontal", description:"Slider direction.", type:"combo", options:["horizontal", "vertical"], wgtref: 'rowsldr', wgtname:"direction", order:69 },
                rowSldrMaxVal: { name:"Slider: Max Pool Value", value:100, description:"Maximum value allowed for the sum of all sliders.", type:"number", min:1, wgtref: 'rowsldr', wgtname:"max", wgexclude: true, order:71 },
                rowSldrPrecVal: { name:"Slider: Precision Value", value:0, description:"Slider precision value.", type:"number", min:0, wgtref: 'rowsldr', wgtname:"precision", order:72 },
                rowSldrShowLabel: { name:"Slider Label: Display", value:true, description:"If set false, slider label will not display.", type:"bool", wgtref: 'rowsldr', wgtname:"show_label", order:62 },
                rowSldrLabelHalign: { name:"Slider Label: Horz Alignment", value:'left', description:"Slider label horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowsldr', wgtname:"label_halign", order:63 },
                rowSldrLabelFontSize: { name:"Slider Label: Font Size", value:18, description:"Slider label font size, in pixels.", type:"number", min:5, wgtref: 'rowsldr', wgtname:"label_fontsize", order:65 },
                rowSldrLabelColor: { name:"Slider Label: Font Color", value:0x5B5F65, description:"Slider label font color.", type:"colour", wgtref: 'rowsldr', wgtname:"label_fontcolor", order:66 },
                rowSldrShowLabelBckgrnd: { name:"Slider Label: Show Background Color", value:false, description:"If set true, slider label background will display.", type:"bool", wgtref: 'rowsldr', wgtname:"show_label_background", order:24 },
                rowSldrLabelBckgrndColor: { name:"Slider Label: Bckgrnd Color", value:0xEFEFEF, description:"Slider label background color.", type:"colour", wgtref: 'rowsldr', wgtname:"label_background_color", order: 15 },
                rowSldrLabelHoffset: { name:"Slider Label: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'rowsldr', wgtname:"label_left", order:67 },
                rowSldrLabelVoffset: { name:"Slider Label: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'rowsldr', wgtname:"label_top", order:68 },
                rowSldrTrackWidth: { name:"Slider Track: Bckgrnd Width", value:400, description:"Track width, in pixels.", type:"number", min:5, wgtref: 'rowsldr', wgtname:"width", order:73 },
                rowSldrTrackHeight: { name:"Slider Track: Bckgrnd Height", value:40, description:"Track height, in pixels.", type:"number", min:5, wgtref: 'rowsldr', wgtname:"height", order:74 },
                rowSldrTrackBorderStyle: { name:"Slider Track: Border Style", value:"solid", description:"Track CSS border style.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'rowsldr', wgtname:"track_border_style", order:75 },
                rowSldrTrackBorderWidth: { name:"Slider Track: Border Width", value:2, description:"Track border width, in pixels.", type:"number", min:0, wgtref: 'rowsldr', wgtname:"track_border_width", order:76 },
                rowSldrTrackBorderRadius: { name:"Slider Track: Border Radius", value:0, description:"Track border radius, in pixels.", type:"number", min:0, wgtref: 'rowsldr', wgtname:"track_border_radius", order:77 },
                rowSldrTrackBorderColor: { name:"Slider Track: Border Colour", value:0xd2d3d5, description:"Track border color.", type:"colour", wgtref: 'rowsldr', wgtname:"track_border_color", order:78 },
                rowSldrTrackColor: { name:"Slider Track: Bckgrnd Colour", value:0xFFFFFF, description:"Track background color.", type:"colour", wgtref: 'rowsldr', wgtname:"track_color", order:79 },
                rowSldrTrackShowImp: { name:"Slider Track: Show Import", value:false, description:"If set true, track imported image will display.", type:"bool", wgtref: 'rowsldr', wgtname:"show_track_import", order:80 },
                rowSldrTrackImp: { name:"Slider Track: Import Image", value:"", description:"Import track image to use.", type:"bitmapdata", wgtref: 'rowsldr', wgtname:"track_import", order:81 },
                rowSldrTickWidth: { name:"Slider Tick: Width", value:2, description:"Track tick width, in pixels.", type:"number", min:1, wgtref: 'rowsldr', wgtname:"tick_width", order:84 },
                rowSldrTickHeight: { name:"Slider Tick: Height", value:10, description:"Track tick height, in pixels.", type:"number", min:1, wgtref: 'rowsldr', wgtname:"tick_height", order:85 },
                rowSldrTickColor: { name:"Slider Tick: Colour", value:0x5B5F65, description:"Track tick color.", type:"colour", wgtref: 'rowsldr', wgtname:"tick_color", order:86 },
                rowSldrTickLabCustomCnt: { name:"Slider Tick: Custom Label Count", value:3, description:"Number of tick labels to display on slider track.", type:"number", min:0, order:36 },
                rowSldrTickLabWidth: { name:"Slider Tick: Label Width", value:80, description:"Track tick label width, in pixels.", type:"number", min:5, wgtref: 'rowsldr', wgtname:"ticklabel_width", order:88 },
                rowSldrTickLabOffset: { name:"Slider Tick: Label Offset", value:0, description:"For 'horizontal' slider direction, top CSS offset position. For 'vertical' slider direction, left CSS offset position. (both in pixels)", type:"number", wgtref: 'rowsldr', wgtname:"ticklabel_offset", order:89 },
                rowSldrTickLabFontSize: { name:"Slider Tick: Label Font Size", value:14, description:"Track tick label font size, in pixels.", type:"number", min:5, wgtref: 'rowsldr', wgtname:"ticklabel_fontsize", order:90 },
                rowSldrTickLabColor: { name:"Slider Tick: Label Color", value:0x5B5F65, description:"Track tick label font color.", type:"colour", wgtref: 'rowsldr', wgtname:"ticklabel_fontcolor", order:91 },
                rowSldrHndleShowBckgrnd: { name:"Slider Handle: Show Bckgrnd", value:true, description:"If set false, slider handle background will not display.", type:"bool", wgtref: 'rowsldr', wgtname:"show_handle_bckgrnd", order:112 },
                rowSldrHndleShowImg: { name:"Slider Handle: Show Row Image", value:false, description:"If set true, row image will display on slider handle.", type:"bool", order:112 },
                rowSldrHndleSnapType: { name:"Slider Handle: Snap Type", value:"none", description:"Slider handle snapping type.", type:"combo", options:["none", "snap before", "snap after"], wgtref: 'rowsldr', wgtname:"snap_type", order:105 },
                rowSldrHndleWidth: { name:"Slider Handle: Bckgrnd Width", value:45, description:"Slider handle background width, in pixels.", type:"number", min:5, wgtref: 'rowsldr', wgtname:"handle_width", order:94 },
                rowSldrHndleHeight: { name:"Slider Handle: Bckgrnd Height", value:50, description:"Slider handle background height, in pixels.", type:"number", min:5, wgtref: 'rowsldr', wgtname:"handle_height", order:95 },
                rowSldrHndlePadding: { name:"Slider Handle: Bckgrnd Padding", value:2, description:"Slider handle background padding, in pixels.", type:"number", min:0, wgtref: 'rowsldr', wgtname:"handle_padding", order:95 },
                rowSldrHndleBorderStyle: { name:"Slider Handle: Border Style", value:"solid", description:"Slider handle CSS border style.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'rowsldr', wgtname:"handle_border_style", order:96 },
                rowSldrHndleBorderWidth: { name:"Slider Handle: Border Width", value:2, description:"Slider handle border width, in pixels.", type:"number", min:0, wgtref: 'rowsldr', wgtname:"handle_border_width", order:97 },
                rowSldrHndleBorderRadius: { name:"Slider Handle: Border Radius", value:0, description:"Slider handle border radius, in pixels.", type:"number", min:0, wgtref: 'rowsldr', wgtname:"handle_border_radius", order:98 },
                rowSldrHndleBorderColorUp: { name:"Slider Handle: Border Colour", value:0xd2d3d5, description:"Slider handle border color.", type:"colour", wgtref: 'rowsldr', wgtname:"handle_border_color_up", order:99 },
                rowSldrHndleColorUp: { name:"Slider Handle: Bckgrnd UP Colour", value:0xFFFFFF, description:"Slider handle background color in its default state.", type:"colour", wgtref: 'rowsldr', wgtname:"handle_color_up", order:100 },
                rowSldrHndleColorDown: { name:"Slider Handle: Bckgrnd DOWN Colour", value:0xFFFFFF, description:"Slider handle background color on select.", type:"colour", wgtref: 'rowsldr', wgtname:"handle_color_down", order:101 },
                rowSldrHndleShowImp: { name:"Slider Handle: Show Import Image", value:false, description:"If set true, imported slider handle image will display.", type:"bool", wgtref: 'rowsldr', wgtname:"show_handle_import", order:102 },
                rowSldrHndleImpUp: { name:"Slider Handle: Import UP Image", value:"", description:"Import background image to use when slider handle is in its default state.", type:"bitmapdata", wgtref: 'rowsldr', wgtname:"handle_import_up", order:103 },
                rowSldrHndleImpDown: { name:"Slider Handle: Import DOWN Image", value:"", description:"Import background image to use on slider handle select.", type:"bitmapdata", wgtref: 'rowsldr', wgtname:"handle_import_down", order:104 },
                rowSldrHndleLabDisplay: { name:"Slider Handle: Show Label", value:true, description:"If set true, slider handle label will display.", type:"bool", order:80 },
                rowSldrHndleLabFontSize: { name:"Slider Handle: Label Font Size", value:16, description:"Slider handle label font size, in pixels.", type:"number", min:5, wgtref: 'rowsldr', wgtname:"handle_label_fontsize", order:106 },
                rowSldrHndleLabFontColor: { name:"Slider Handle: Label Font Colour", value:0x5B5F65, description:"Slider handle label font color.", type:"colour", wgtref: 'rowsldr', wgtname:"handle_label_fontcolor", order:107 },
                rowSldrHndleLabInitTxt: { name:"Slider Handle: Label Initial Text", value:"Click To Activate", description:"Slider handle label initial text.", type:"string", wgtref: 'rowsldr', wgtname:"handle_label_inittxt", order:108 },
                rowSldrHndleLabWidth: { name:"Slider Handle: Label Width", value:125, description:"Slider handle label width, in pixels.", type:"number", min:5, wgtref: 'rowsldr', wgtname:"handle_label_width", order:109 },
                rowSldrHndleShowLabelBckgrnd: { name:"Slider Handle: Label Bckgrnd Display", value:false, description:"If set true, handle label background will display.", type:"bool", wgtref: 'rowsldr', wgtname:"show_handle_label_bckgrnd", order:112, display:false },
                rowSldrHndleLabBckgrndColor: { name:"Slider Handle: Label Bckgrnd Colour", value:0xFFFFFF, description:"Slider handle label background color.", type:"colour", wgtref: 'rowsldr', wgtname:"handle_label_bckgrnd_color", order:107, display:false },
                rowSldrHndleLabHoffset: { name:"Slider Handle: Label Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'rowsldr', wgtname:"handle_label_left", order:110 },
                rowSldrHndleLabVoffset: { name:"Slider Handle: Label Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'rowsldr', wgtname:"handle_label_top", order:111 },
                rowSldrShowEndImg: { name:"Slider Row Image: Display", value:false, description:"If set true, row image will display left of the slider.", type:"bool", wgtref: 'rowsldr', wgtname:"show_end_img", order:112 },
                rowSldrImgEndWidth: { name:"Slider Row Image: Width", value:100, description:"Width of slider row image, in pixels.", type:"number", min:10, wgtref: 'rowsldr', wgtname:"end_img_width", order:113 },
                rowSldrImgEndHeight: { name:"Slider Row Image: Height", value:100, description:"Height of slider row image, in pixels.", type:"number", min:10, wgtref: 'rowsldr', wgtname:"end_img_height", order:114 },
                rowSldrImgEndHoffset: { name:"Slider Row Image: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", wgtref: 'rowsldr', wgtname:"end_img_left", order:115 },
                rowSldrImgEndVoffset: { name:"Slider Row Image: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", wgtref: 'rowsldr', wgtname:"end_img_top", order:116 },

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
                rowBtnBckgrndColorUp: { name:"Row Btn: Bckgrnd UP Color", value:0xffffff, description:"Button background color in its default state.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_up", order:39 },
                rowBtnBckgrndColorOver: { name:"Row Btn: Bckgrnd OVER Color", value:0xffffff, description:"Button background color on mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_over", order:40 },
                rowBtnBckgrndColorDown: { name:"Row Btn: Bckgrnd DOWN Color", value:0xffffff, description:"Button background color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_down", order:41 },
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
                        if (configObj.border_style.toLowerCase() === "none") { configObj.border_width = 0; }
                        break;
                    case 'rowbtn' :
                        configObj.reverse_scale = (this.questionType() === "single" && this.qStudioVar.params.rowBtnReverseScaleAlpha.value);
                        configObj.txtbtn_trim = (this.qStudioVar.params.rowTxtBtnAdjustHeightType.value !== "none");
                        break;
                    case 'rowsldr' :
                        configObj.id = 'QRowBaseSlider';
                        configObj.survey_contain = this.qStudioVar.surveyContain;
                        configObj.layout_contain = this.qStudioVar.rowContain.cache().nodes.layoutContain;
                        configObj.min = 0;
                        configObj.handle_label_disptype = (this.qStudioVar.params.rowSldrHndleLabDisplay.value) ? 'range value' : 'none';
                        configObj.end_img_left *= -1;
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

        __setSldrLevelParams: function(rowObject, wgtNameObj) {
            var paramNameObj = this.getRowSldrParams();
            for (var key in rowObject) {
                if (rowObject.hasOwnProperty(key)) {
                    if (paramNameObj.hasOwnProperty(key)) {
                        if (!paramNameObj[key].wgtexclude) {
                            this.__validateParam(paramNameObj, wgtNameObj, rowObject, key);
                        }
                    }
                }
            }
        },

        __initGoogleChart: function() {
            var that = this,
                params = this.qStudioVar.params,
                respRef = this.qStudioVar.respRef,
                rowArray = this.qStudioVar.rowArray,
                i = 0, rlen = rowArray.length;

            // init chart configurations
            respRef.chartConfigObj.backgroundColor = "transparent";
            respRef.chartConfigObj.colors = [ "#AAAAAA" ];
            respRef.chartConfigObj.pieSliceText = "percentage";

            this.googleUtility = {
                init: function() {
                    // Init Google Chart Data Array
                    respRef.chartDataArry = [['label', 'range'], [params.chartRemainText.value, params.rowSldrMaxVal.value - respRef.sldrTotal]];
                    for (i = 0; i < rlen; i += 1) {
                        var row = respRef.rowRefArry[i].row;
                        row.enabled(true);
                        if (row.type() === "slider") {
                            respRef.chartConfigObj.colors.push(rowArray[i].var2);
                            respRef.chartDataArry.push([rowArray[row.rowIndex()].label, 0]);
                        }
                    }

                    respRef.chartGoogle = new google.visualization.PieChart(that.qStudioVar.chartContain);
                    respRef.chartGoogle.draw(google.visualization.arrayToDataTable(respRef.chartDataArry), respRef.chartConfigObj);
                    respRef.chartInit = true;

                    // for setDimenResp
                    if (respRef.cacheResp) {
                        that.setDimenResp(respRef.cacheResp);
                        delete respRef.cacheResp;
                    }

                    // check if we need to fire callback
                    if (that.bindGoogleInitCallback()) { that.bindGoogleInitCallback()(); }
                },

                update: function(rowIndex, rangeValue) {
                    respRef.chartDataArry[1] = [params.chartRemainText.value, params.rowSldrMaxVal.value - respRef.sldrTotal];
                    respRef.chartDataArry[rowIndex+2] = [rowArray[rowIndex].label, rangeValue];
                    respRef.chartGoogle.draw(google.visualization.arrayToDataTable(respRef.chartDataArry), respRef.chartConfigObj);
                },

                reset: function()  {
                    respRef.chartDataArry = [['label', 'range'], [params.chartRemainText.value, params.rowSldrMaxVal.value - respRef.sldrTotal]];
                    for (i = 0; i < that.qStudioVar.sliderArray.length; i += 1) {
                        respRef.chartDataArry.push([rowArray[i].label, 0]);
                    }

                    respRef.chartGoogle.draw(google.visualization.arrayToDataTable(respRef.chartDataArry), respRef.chartConfigObj);
                }
            };

            // Chart Container CSS Style
            this.qStudioVar.chartContain = document.createElement("div");
            this.qStudioVar.chartContain.className = 'linksldr_chart_container';
            this.qStudioVar.chartContain.style.color = '#555';
            this.qStudioVar.chartContain.style.position = 'relative';

            // update google chart
            this.__updateGoogleChart();

            // will eventually get overwritten when google charts loads
            var preload = new QPreloader();
            preload.initModule(this.qStudioVar.chartContain);
            preload.getLoader().style.left = (respRef.chartConfigObj.width - 103)*0.5 + "px";
            preload.getLoader().style.top = 10 + "px";

            /** GOOGLE API **/
            google.load("visualization", "1", { packages:["corechart"], callback: this.googleUtility.init });
        },

        __updateGoogleChart: function() {
            var params = this.qStudioVar.params,
                respRef = this.qStudioVar.respRef,
                compContain = this.qStudioVar.compContain,
                rowContain = this.qStudioVar.rowContain,
                chartPos = params.chartPosition.value.toLowerCase(),
                chartPadding = (params.chartSize.value <= 95) ? 0 : 10,
                chartContain = this.qStudioVar.chartContain,
                rowContainParams = rowContain.config(),
                rowContainWidth = parseInt(rowContain.container().style.width, 10) - rowContainParams.border_width*2 - chartPadding*2,
                rowContainHeight = parseInt(rowContain.container().style.height, 10) - rowContainParams.border_width*2 - chartPadding* 2,
                chartRowConfig = {
                    padding : 0,
                    hgap : 0,
                    autoWidth : true,
                    autoHeight : true
                };

            // Google Chart configurations
            respRef.chartConfigObj.width = params.chartWidth.value;
            respRef.chartConfigObj.height = params.chartHeight.value;
            respRef.chartConfigObj.left = params.chartHoffset.value;
            respRef.chartConfigObj.top = params.chartVoffset.value;
            respRef.chartConfigObj.fontSize = params.chartFontSize.value;
            respRef.chartConfigObj.is3D = (params.chartType.value.toLowerCase().indexOf('3d') !== -1);
            respRef.chartConfigObj.chartArea = {
                width : params.chartSize.value + "%",
                height : params.chartSize.value + "%"
            };
            respRef.chartConfigObj.legend = {
                alignment : 'center',
                position : params.chartLegendPosition.value.toLowerCase()
            };
            if (params.chartType.value.toLowerCase() === "donut") { respRef.chartConfigObj.pieHole = 0.4; }

            // update chartContain
            chartContain.style.width = respRef.chartConfigObj.width + 'px';
            chartContain.style.height = respRef.chartConfigObj.height + 'px';
            chartContain.style.padding = chartPadding + 'px';
            chartContain.style.border = rowContainParams.border_width + "px " + rowContainParams.border_style + " #" + QUtility.paramToHex(rowContainParams.border_color);
            chartContain.style[(!this.qStudioVar.isCompRTL) ? "left" : "right"] = respRef.chartConfigObj.left + 'px';
            chartContain.style.top = respRef.chartConfigObj.top + "px";
            if (respRef.chartRowContain) {
                respRef.chartRowContain.destroy();
                respRef.chartRowContain = null;
            }

            // chartContain position
            if (chartPos === "left" || chartPos === "right") {
                respRef.chartConfigObj.width -= chartPadding * 2;
                respRef.chartConfigObj.height = rowContainHeight;
                chartContain.style.height = rowContainHeight + "px";

                // setup horizontal container
                respRef.chartRowContain = QStudioCompFactory.layoutFactory(
                    "horizontal",
                    compContain,
                    chartRowConfig
                );

                if (params.chartPosition.value.toLowerCase() === "right") {
                    respRef.chartRowContain.add(rowContain.container());
                    respRef.chartRowContain.add(chartContain);
                } else {
                    respRef.chartRowContain.add(chartContain);
                    respRef.chartRowContain.add(rowContain.container());
                }
            } else {
                respRef.chartConfigObj.width = rowContainWidth;
                respRef.chartConfigObj.height -= chartPadding * 2;
                chartContain.style.width = rowContainWidth + "px";
                (chartPos === "top") ?
                    compContain.insertBefore(chartContain, rowContain.container()):
                    compContain.appendChild(chartContain);
            }
        },

        __getBtnIsRadio: function(dataSetObj) {
            if (typeof dataSetObj.var2 === "boolean") {
                return dataSetObj.var2;
            } else if (typeof dataSetObj.isRadio === "boolean") {
                return dataSetObj.isRadio;
            }

            // default all button widget isRadio prop to true
            return true;
        },

        __setIsCompAnswered : function(value) {
            var qStudioVar = this.qStudioVar;
            if (typeof value === "boolean" && value !== qStudioVar.isCompAnswered) {
                console.log("__setIsCompAnswered: " + value);
                qStudioVar.isCompAnswered = value;
                if (this.isMandatory()) {
                    qStudioVar.dcProxy[(value) ? "showNextButton" : "hideNextButton"]();
                    if (value && this.isAutoNext()) { qStudioVar.dcProxy.next(); }
                }
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

        bindGoogleInitCallback : function(value) {
            if (typeof value === "function") {
                this.qStudioVar._googleLoadCallback = value;
            } else {
                return this.qStudioVar._googleLoadCallback;
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

        // returns an object list of row slider parameters
        getRowSldrParams : function(wgtName) {
            return this.__getParamObj("rowsldr", wgtName);
        },

        // returns an object list of tooltip parameters
        getToolTipParams : function(wgtName) {
            return this.__getParamObj("tooltip", wgtName);
        },

        // returns an object list of lightbox parameters
        getLightBoxParams : function(wgtName) {
            return this.__getParamObj("ctz", wgtName);
        },

        create: function(parent, surveyContain) {
            // reset certain qStudioVar vars everytime create is called
            this.qStudioVar.isCompAnswered = false;
            this.qStudioVar.isUpdating = false;
            this.qStudioVar.sliderArray = [];
            this.qStudioVar.btnArray = [];

            // used w/ component controller; reset everytime create method is called
            this.qStudioVar.respRef = {
                chartRowContain : null,
                chartInit : false,
                chartConfigObj : {},
                chartDataArry : [],
                chartGoogle : null,
                sldrTotal: 0,       // Keeps track of slider group total
                rowRefArry: [],     // Stores a reference of each row in component
                btnRespArry: [],    // Stores row button responses
                sldrRespArry: []    // Stores row slider responses
            };

            // record reference of surveyContain
            this.qStudioVar.surveyContain = surveyContain;

            // Auto-set compRTL parameter based on Survey Platform RTL settings
            if (QUtility.isSurveyRTL()) { this.qStudioVar.params.compRTL.value = true; }

            // Disable RTL in QStudio Component Creation Window due to positioning issues
            this.qStudioVar.isCompRTL = (!(parent && parent.id === "componentDemoContainer")) ? this.qStudioVar.params.compRTL.value : false;

            var that = this,
                doc = document,
                params = this.qStudioVar.params,
                respRef = this.qStudioVar.respRef,
                dcProxy = this.qStudioVar.dcProxy,
                rowArray = this.qStudioVar.rowArray,
                compContain = doc.createElement("div"),
                chartType = params.chartType.value.toLowerCase(),
                isTouchDevice = QUtility.isTouchDevice(),
                eventDown = "mousedown.linkedslider touchstart.linkedslider",
                eventUp = "mouseup.linkedslider touchend.linkedslider",
                eventMove = "touchmove.linkedslider",
                txtEvent = ("oninput" in compContain) ? "input.linkedslider" : "keyup.linkedslider",
                touchCoordArray = [],
                i = 0, rlen = rowArray.length,
                btnSliceIndex = -1;

            // To fix IE9 bug where input event does not fire on backspace/del
            if (QUtility.ieVersion() <= 9) { txtEvent = "keyup.linkedslider"; }

            // Split Button and Slider Row Objects
            // store button objects in btnArray
            // store slider objects in sliderArray
            for (i; i < rlen; i += 1) {
                var rowWgtType = jQuery.trim(rowArray[i].var1 || rowArray[i].type).toLowerCase();
                if (this.getAcceptedRowWidgets(rowWgtType) === true) {
                    // from this point on assume row objects are buttons
                    this.qStudioVar.btnArray = rowArray.slice(i);
                    btnSliceIndex = i;
                    break;
                }
            }

            if (btnSliceIndex !== -1) {
                this.qStudioVar.sliderArray = rowArray.slice(0, btnSliceIndex);
                if (!this.qStudioVar.sliderArray.length) {
                    throw new Error("ERROR: No slider widgets present.");
                }
            } else {
                // means we have no buttons
                this.qStudioVar.sliderArray = rowArray;
            }

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

            // QStudio hide survey next button
            if (this.isMandatory()) { dcProxy.hideNextButton(); }

            // Component Container CSS Style
            compContain.id = "LinkedSliderComponent";
            compContain.dir = (!this.qStudioVar.isCompRTL) ? 'ltr' :'rtl';
            compContain.className = "qlinkedslider_component";
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
                params.rowContainType.value.toLowerCase().substr(0, params.rowContainType.value.toLowerCase().indexOf('layout')-1),
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
                    row = respRef.rowRefArry[rowEle.getAttribute('rowIndex')].row,
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
                    if (row.isAnswered() && chartType !== 'none') { that.googleUtility.reset(); }
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
                var row = respRef.rowRefArry[event.currentTarget.getAttribute('rowIndex')].row;
                if (!row.enabled() || !row.isOther() || that.qStudioVar.isUpdating) { return; }
                that.manageChange(row);
                if (row.isAnswered() && chartType !== 'none') { that.googleUtility.reset(); }
            });
        },

        // updates existing widget(s) and layout type
        update: function(init) {
            // if init is true, we are creating for the first time, else updating
            var that = this,
                compContain = this.qStudioVar.compContain,
                rowContain = this.qStudioVar.rowContain,
                respRef = this.qStudioVar.respRef,
                params = this.qStudioVar.params,
                chartType = params.chartType.value.toLowerCase(),
                rowSyncTxtBtnHeight = (params.rowTxtBtnAdjustHeightType.value === "all"),
                rowSyncTxtBtnArray = [],
                rowMaxTxtBtnHeight = 0,
                i = 0,
                slen = this.qStudioVar.sliderArray.length,
                blen = this.qStudioVar.btnArray.length,
                numOfTicks = params.rowSldrTickLabCustomCnt.value,
                tickIncrem = (numOfTicks > 1) ? (params.rowSldrMaxVal.value)/(numOfTicks - 1) : 1,
                tickLabArray = [],
                defColorArray = params.compDefaultColors.value.split(",");

            // Create slider tick labels
            for (i = 0; i < numOfTicks; i += 1) {
                tickLabArray.push({ label : Math.round(tickIncrem * i).toString() });
            }

            if (!init) {
                this.qStudioVar.isUpdating = true;
                qToolTipSingleton.getInstance().hide();

                // trigger upEvent to prevent dragging while updating
                $(document).trigger("mouseup.widget touchend.widget");

                // remove all widgets from rowContain & update
                rowContain.remove();
                rowContain.config(this.getRowContainParams(true));
            }

            // row widget slider create/update
            for (i = 0; i < slen; i += 1) {
                var rowObject = this.qStudioVar.sliderArray[i],
                    wgtNameObj = this.getRowSldrParams(true),
                    rowWgt = null;

                // generate random color if user defined is not valid
                rowObject.var2 = QUtility.paramToHex(rowObject.var2);
                if (rowObject.var2 === false) {
                    if (QUtility.paramToHex(defColorArray[i])) {
                        // use default color
                        rowObject.var2 = QUtility.paramToHex(defColorArray[i]);
                    } else {
                        // generate random color
                        rowObject.var2 = (0x1000000+(Math.random())*0xFFFFFF).toString(16).substr(1,6);
                    }
                }

                // set base widget params
                wgtNameObj.rowIndex = i;
                wgtNameObj.id = rowObject.id || 'row_' + i;
                wgtNameObj.label = rowObject.label;
                wgtNameObj.highlight_color = rowObject.var2;
                wgtNameObj.handle_border_color_down = rowObject.var2;
                wgtNameObj.image = (params.rowSldrHndleShowImg.value) ? rowObject.image : "";

                // see if we need to set button level params
                this.__setSldrLevelParams(rowObject, wgtNameObj);

                // set after button level params are set
                if (wgtNameObj.show_end_img) { tickLabArray[0].image = this.qStudioVar.sliderArray[i].image; }
                wgtNameObj.tick_array = tickLabArray;

                if (init) {
                    rowWgt = QStudioCompFactory.widgetFactory(
                        "baseslider",
                        compContain,
                        wgtNameObj
                    );

                    //rowWgt.enabled(true);
                    rowWgt.enabled((chartType === 'none'), 35);

                    // Create 'rowIndex' attribute for row widget for use w/ controller
                    rowWgt.widget().setAttribute('rowIndex', i.toString());

                    // Store reference of Row Widget for use w/ controller
                    respRef.rowRefArry.push({
                        row : rowWgt,
                        rangeValue : null
                    });

                    // Add callback functions to slider
                    (function(sldr) {
                        sldr.slideInit(function() {
                            var rowIndex = sldr.rowIndex(),
                                trackSize = (sldr.config().direction.toLowerCase() === "horizontal") ? sldr.config().width : sldr.config().height,
                                ctrlRangeVal = (QUtility.isNumber(respRef.rowRefArry[rowIndex].rangeValue)) ? respRef.rowRefArry[rowIndex].rangeValue : 0,
                                loc = ((params.rowSldrMaxVal.value - respRef.sldrTotal + ctrlRangeVal) / params.rowSldrMaxVal.value) * trackSize;

                            (sldr.config().direction.toLowerCase() === "horizontal" && !that.qStudioVar.isCompRTL) ?
                                sldr.setHandleBounds({ maxLoc: loc }):
                                sldr.setHandleBounds({ minLoc: trackSize - loc });
                        });

                        sldr.slideMove(function() {
                            var rowIndex = sldr.rowIndex(),
                                rangeValue = sldr._rangeValue(),
                                ctrlRangeVal = respRef.rowRefArry[rowIndex].rangeValue;

                            if (sldr.config().snap_type.toLowerCase() !== "snap after") {
                                respRef.rowRefArry[rowIndex].rangeValue = rangeValue;
                                if (ctrlRangeVal !== null) { respRef.sldrTotal -= ctrlRangeVal; }
                                respRef.sldrTotal += rangeValue;
                            }
                        });

                        sldr.slideEnd(function() {
                            if (sldr.config().snap_type.toLowerCase() === "snap after") {
                                var rowIndex = sldr.rowIndex(),
                                    rangeValue = sldr._rangeValue(),
                                    ctrlRangeVal = respRef.rowRefArry[rowIndex].rangeValue;

                                respRef.rowRefArry[rowIndex].rangeValue = sldr._rangeValue();
                                if (ctrlRangeVal !== null) { respRef.sldrTotal -= ctrlRangeVal; }
                                respRef.sldrTotal += rangeValue;
                            }

                            that.manageSlide(sldr);

                            // update google charts
                            if (chartType !== 'none') {
                                that.googleUtility.update(sldr.rowIndex(), sldr._rangeValue());
                            }
                        });
                    }(rowWgt));
                } else {
                    rowWgt = respRef.rowRefArry[i].row;
                    // update Row Button Widget
                    rowWgt.config(wgtNameObj);
                }

                if (!rowSyncTxtBtnHeight) {
                    // Add row widget to rowContain
                    rowContain.add(rowWgt);
                }
            }

            // row widget button create/update
            for (i = 0; i < blen; i += 1) {
                var rowObject = this.qStudioVar.btnArray[i],
                    userDefType = jQuery.trim(rowObject.var1 || rowObject.type).toLowerCase(),
                    wgtNameObj = this.getRowBtnParams(true),
                    rowBtnType = params.rowBtnDefaultType.value.toLowerCase(),
                    rowIndex = jQuery.inArray(rowObject, this.qStudioVar.rowArray),
                    rowWgt = null;

                // check if user defined type is a valid row widget
                if (this.getAcceptedRowWidgets(userDefType) === true) { rowBtnType = userDefType; }

                // set widget params
                wgtNameObj.isRadio = QUtility.getBtnIsRadio(rowObject, true);
                wgtNameObj.rowIndex = rowIndex;
                wgtNameObj.id = rowObject.id || 'row_' + rowIndex;
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

                    rowWgt.enabled((chartType === 'none'),  { alphaVal: 35 });
                    rowWgt.touchEnabled(QUtility.isTouchDevice());

                    // Create 'rowIndex' attribute for row widget for use w/ controller
                    rowWgt.widget().setAttribute('rowIndex', rowIndex.toString());

                    // Store reference of Row Widget for use w/ controller
                    respRef.rowRefArry.push({ row: rowWgt });
                } else {
                    rowWgt = respRef.rowRefArry[rowIndex].row;
                    // update Row Button Widget
                    rowWgt.config(wgtNameObj);
                }

                // if we are sync'ing text button heights add to row container after calculating max text button height
                if (!rowSyncTxtBtnHeight) {
                    // Add to row container now
                    rowContain.add(rowWgt, !!rowObject.ownRow);
                } else {
                    if (rowBtnType === "text") {
                        rowSyncTxtBtnArray[rowIndex] = rowWgt;
                        rowMaxTxtBtnHeight = Math.max(rowMaxTxtBtnHeight, $(rowWgt.cache().nodes.background).height());
                    }
                }
            }

            // If syncing widget button height; Applies to text button widgets
            if (rowSyncTxtBtnHeight) {
                for (i = 0; i < (blen + slen); i += 1) {
                    var rowWgt = respRef.rowRefArry[i].row;
                    if (rowSyncTxtBtnArray[i]) {
                        rowWgt.config({
                            height : rowMaxTxtBtnHeight,
                            txtbtn_trim : false
                        });
                    }

                    // Add to row container
                    rowContain.add(rowWgt, (rowWgt.type() === "button" && !!this.qStudioVar.rowArray[i].ownRow));
                }
            }

            // update google chart
            if (chartType !== "none") {
                this[(!init) ? "__updateGoogleChart" : "__initGoogleChart"]();
                // if updating we also need to update chartGoogle object
                if (!init) {
                    respRef.chartDataArry[1][0] = params.chartRemainText.value;
                    respRef.chartGoogle.draw(google.visualization.arrayToDataTable(respRef.chartDataArry), respRef.chartConfigObj);
                }
            }

            this.qStudioVar.isUpdating = false;
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
            this.__setIsCompAnswered(respRef.sldrTotal === this.qStudioVar.params.rowSldrMaxVal.value);

            // Push slider to sldrRespArry
            if (jQuery.inArray(slider, respRef.sldrRespArry) === -1) {
                respRef.sldrRespArry.push(slider);
            }

            return true;
        },

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
                this.__setIsCompAnswered(true);
                return true; 
            } else {
                if (!row.isRadio()) {
                    spliceInd = jQuery.inArray(row, respRef.btnRespArry);
                    if (spliceInd !== -1) {
                        row.isAnswered(false);
                        this.sendResponse(rowIndex, "");
                        respRef.btnRespArry.splice(spliceInd, 1);
                        this.__setIsCompAnswered(respRef.btnRespArry.length > 0);
                        return (respRef.btnRespArry.length > 0);
                    }
                } 
            }                                     
        },

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
                    this.__setIsCompAnswered(true);
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
                            this.__setIsCompAnswered(respRef.btnRespArry.length > 0);
                            return (respRef.btnRespArry.length > 0); 
                        }
                    } else{
                        row.isAnswered(false);   
                        this.sendResponse(rowIndex, "");
                        respRef.btnRespArry = [];
                        this.__setIsCompAnswered(false);
                        return false;
                    }
                }
            }                   
        },

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

        // used by Dimensions to set responses
        setDimenResp: function(respArray) {
            if (jQuery.isArray(respArray) && respArray.length > 0) {
                var that = this,
                    respRef = this.qStudioVar.respRef,
                    rowRefArry = respRef.rowRefArry,
                    params = this.qStudioVar.params,
                    chartType = params.chartType.value.toLowerCase();

                if (chartType !== "none" && !respRef.chartInit) {
                    respRef.cacheResp = respArray;
                    return;
                }

                while (respArray.length !== 0) {
                    var index = respArray[0].index,
                        input = respArray[0].input;

                    if (rowRefArry[index].row.type() === "slider") {
                        var isHorz = (rowRefArry[index].row.config().direction.toLowerCase() === "horizontal"),
                            trackSize = rowRefArry[index].row.config().trackSize;

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
                                pageX: (isHorz) ? ((!that.qStudioVar.isCompRTL) ? Math.round((input * .01) * trackSize) : trackSize - Math.round((input * .01) * trackSize)) : 0,
                                pageY: (!isHorz) ? trackSize-Math.round((input *.01)*trackSize) : 0,
                                originalEvent: {
                                    isPrimary: true,
                                    pageX: (isHorz) ? ((!that.qStudioVar.isCompRTL) ? Math.round((input * .01) * trackSize) : trackSize - Math.round((input * .01) * trackSize)) : 0,
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
        },

        // used by Dimensions to get responses
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
        }
    };
    
    return LinkedSlider;
    
})();