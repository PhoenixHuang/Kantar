/**
 * DragnFlag Javascript File
 * Version : 1.3.1
 * Date : 2014-26-09
 *
 * DragnFlag Component.
 * BaseClassType : Multi
 * Requires rowArray and columnArray datasets.
 * Confluence Link : https://docs.gmi-mr.com/confluence/display/midev/DragnFlag+Component+Documentation
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
                "flow",
                "kantarbase",
                "text"
            ]
        };
    }

    DragnFlag.prototype = {
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
                    "var1"              // Row object button type
                ] },
                { name:"columnArray", prop:[
                    "label"            // Column object label
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
            return 'DragnFlag component description...';
        },

        baseClassType: function() {
            // Multi column base class type
            return 'multi';
        },

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

        initParams: function() {
            return {
                // Component Parameters
                compQuestionType: { name:"Component: Question Type", value:'Single Choice', description:"Component question type.", type:"combo", options:['Single Choice', 'Multiple Choice'], order: 1 },
                compContainPos: { name:"Component: CSS Position", value:"relative", description:"Component container CSS position.", type:"combo", options:["absolute", "relative"], order: 4 },
                compRTL: { name:"Component: RTL Enable", value:false, description:"If set true, component will be setup to support right-to-left languages.", type:"bool", order:24 },
                compPrimRowFontFamily: { name:"Component: Row Font Family", value:"Arial, Helvetica, sans-serif", description:"Font used for row buttons and layout labels.", type:"string", order:19 },
                compPrimColumnFontFamily: { name:"Component: Column Font Family", value:"Arial, Helvetica, sans-serif", description:"Font used for column tick labels.", type:"string", order:19 },

                // Column Slider Parameters
                colSldrMinVal: { name:"Slider: Min Value", value:0, description:"Minimum slider range value.", type:"number", wgtref: 'colsldr', wgtname:"min", order:70 },
                colSldrMaxVal: { name:"Slider: Max Value", value:100, description:"Maximum slider range value.", type:"number", wgtref: 'colsldr', wgtname:"max", order:71 },
                colSldrPrecVal: { name:"Slider: Precision Value", value:0, description:"Slider range precision value.", type:"number", min:0, wgtref: 'colsldr', wgtname:"precision", order:72 },
                colSldrHoffset: { name:"Slider: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", order:56 },
                colSldrVoffset: { name:"Slider: Top CSS Pos", value:150, description:"Top CSS offset position, in pixels.", type:"number", order:57 },
                colSldrTrackWidth: { name:"Slider Track: Bckgrnd Width", value:500, description:"Track width, in pixels.", type:"number", min:5, wgtref: 'colsldr', wgtname:"width", order:73 },
                colSldrTrackHeight: { name:"Slider Track: Bckgrnd Height", value:40, description:"Track height, in pixels.", type:"number", min:5, wgtref: 'colsldr', wgtname:"height", order:74 },
                colSldrTrackBorderStyle: { name:"Slider Track: Border Style", value:"solid", description:"Track CSS border style.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'colsldr', wgtname:"track_border_style", order:75 },
                colSldrTrackBorderWidth: { name:"Slider Track: Border Width", value:2, description:"Track border width, in pixels.", type:"number", min:0, wgtref: 'colsldr', wgtname:"track_border_width", order:76 },
                colSldrTrackBorderRadius: { name:"Slider Track: Border Radius", value:0, description:"Track border radius, in pixels.", type:"number", min:0, wgtref: 'colsldr', wgtname:"track_border_radius", order:77 },
                colSldrTrackBorderColor: { name:"Slider Track: Border Colour", value:0xd2d3d5, description:"Track border color.", type:"colour", wgtref: 'colsldr', wgtname:"track_border_color", order:78 },
                colSldrTrackColor: { name:"Slider Track: Bckgrnd Colour", value:0xFFFFFF, description:"Track background color.", type:"colour", wgtref: 'colsldr', wgtname:"track_color", order:79 },
                colSldrTrackShowImp: { name:"Slider Track: Show Import", value:false, description:"If set true, track imported image will display.", type:"bool", wgtref: 'colsldr', wgtname:"show_track_import", order:80 },
                colSldrTrackImp: { name:"Slider Track: Import Image", value:"", description:"Import track image to use.", type:"bitmapdata", wgtref: 'colsldr', wgtname:"track_import", order:81 },
                colSldrTickWidth: { name:"Slider Tick: Width", value:2, description:"Track tick width, in pixels.", type:"number", min:1, wgtref: 'colsldr', wgtname:"tick_width", order:84 },
                colSldrTickHeight: { name:"Slider Tick: Height", value:10, description:"Track tick height, in pixels.", type:"number", min:1, wgtref: 'colsldr', wgtname:"tick_height", order:85 },
                colSldrTickColor: { name:"Slider Tick: Colour", value:0xffbd1a, description:"Track tick color.", type:"colour", wgtref: 'colsldr', wgtname:"tick_color", order:86 },
                colSldrTickLabDispType: { name:"Slider Tick: Label Display Type", value:"show all", description:"Track tick label display type.", type:"combo", options:["show none", "show all", "show ends", "show three", "custom"], wgtref: 'colsldr', wgtname:"ticklabel_display_type", order:87 },
                colSldrTickLabCustomCnt: { name:"Slider Tick: Custom Label Count", value:3, description:"Number of tick labels to display on slider track.", type:"number", min:1, order:36 },
                colSldrTickLabWidth: { name:"Slider Tick: Label Width", value:80, description:"Track tick label width, in pixels.", type:"number", min:5, wgtref: 'colsldr', wgtname:"ticklabel_width", order:88 },
                colSldrTickLabOffset: { name:"Slider Tick: Label Offset", value:0, description:"Top CSS offset position, in pixels.", type:"number", min:5, wgtref: 'colsldr', wgtname:"ticklabel_offset", order:89 },
                colSldrTickLabFontSize: { name:"Slider Tick: Label Font Size", value:14, description:"Track tick label font size, in pixels.", type:"number", min:5, wgtref: 'colsldr', wgtname:"ticklabel_fontsize", order:90 },
                colSldrTickLabColor: { name:"Slider Tick: Label Color", value:0x5B5F65, description:"Track tick label font color.", type:"colour", wgtref: 'colsldr', wgtname:"ticklabel_fontcolor", order:91 },

                // Column RadioCheck Parameters
                colRadChckEnable: { name:"Column Don't Know: Enable", value:false, description:"If set true, last columnArray object will be used to create a RadioCheck widget button.", type:"bool", order:60 },
                colRadChckShowImpRadio: { name:"Column Don't Know: Show Import Bckgrnd", value:false, description:"If set true, button will display an imported background image.", type:"bool", wgtref: 'dkbtn', wgtname:"radchkbtn_rad_show_import", order:49 },
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

                // Row Container Parameters
                rowContainType: { name:"Row Contain: Layout Type", value:"horizontal grid layout", description:"Layout template applied to row buttons.", type:"combo", options:["horizontal grid layout", "vertical grid layout", "horizontal layout", "vertical layout", "sequential layout"], order: 3 },
                rowContainWidth: { name:"Row Contain: Bckgrnd Width", value:800, description:"Row container background width, in pixels.", type:"number", min:50, wgtref: 'rowcontain', wgtname:"width", order: 5 },
                rowContainHeight: { name:"Row Contain: Bckgrnd Height", value:600, description:"Row container background height, in pixels.", type:"number", min:50, wgtref: 'rowcontain', wgtname:"height", order: 6 },
                rowContainPadding: { name:"Row Contain: Bckgrnd Padding", value:0, description:"Row container background padding, in pixels.", type:"number", min:0, wgtref: 'rowcontain', wgtname:"padding", order: 7 },
                rowContainHgap: { name:"Row Contain: Horz Btn Spacing", value:10, description:"The horizontal spacing of row buttons, in pixels.", type:"number", min: 0, wgtref: 'rowcontain', wgtname:"hgap", order: 8 },
                rowContainVgap: { name:"Row Contain: Vert Btn Spacing", value:10, description:"The vertical spacing of row buttons, in pixels.", type:"number", min: 0, wgtref: 'rowcontain', wgtname:"vgap", order: 9 },
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
                rowContainLabel: { name:"Row Contain: Label Text", value:"Please drag and drop onto the slider bar below.", description:"Row container label text.", type:"string", wgtref: 'rowcontain', wgtname:"label", order:19 },
                rowContainLabelHalign: { name:"Row Contain: Label Horz Alignment", value:'left', description:"Row container label horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowcontain', wgtname:"label_halign", order:20 },
                rowContainLabelFontSize: { name:"Row Contain: Label Font Size", value:18, description:"Row container label font size, in pixels.", type:"number", min:5, wgtref: 'rowcontain', wgtname:"label_fontsize", order:21 },
                rowContainLabelPadding: { name:"Row Contain: Label Padding", value:4, description:"Row container label padding, in pixels.", type:"number", min:0, wgtref: 'rowcontain', wgtname:"label_padding", order:22 },
                rowContainLabelColor: { name:"Row Contain: Label Font Color", value:0x5B5F65, description:"Row container label font color.", type:"colour", wgtref: 'rowcontain', wgtname:"label_fontcolor", order:23 },

                // Row Button Background Parameters
                rowBtnDefaultType: { name:"Row Btn: Default Button Type", value:"Base", description:"Default button type used by component.", type:"combo", options:["Base", "Flow", "KantarBase", "Text"], order:29 },
                rowBtnWidth: { name:"Row Btn: Bckgrnd Width", value:100, description:"Button background width, in pixels", type:"number", min:10, wgtref: 'rowbtn', wgtname:"width", order:30 },
                rowBtnHeight: { name:"Row Btn: Bckgrnd Height", value:100, description:"Button background height, in pixels", type:"number", min:10, wgtref: 'rowbtn', wgtname:"height", order:31 },
                rowBtnPadding: { name:"Row Btn: Bckgrnd Padding", value:4, description:"Button background padding, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"padding", order:32 },
                rowBtnBorderStyle: { name:"Row Btn: Border Style", value:"solid", description:"Button background CSS border style.", type:"combo", options:["solid", "dotted", "dashed", "none"], wgtref: 'rowbtn', wgtname:"border_style", order:33 },
                rowBtnBorderWidthUp: { name:"Row Btn: Border UP Width", value:2, description:"Button background border width, in pixels.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"border_width_up", order:34 },
                rowBtnBorderColorUp: { name:"Row Btn: Border UP Color", value:0xd2d3d5, description:"Button background border color in its default state.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_up", order:36 },
                rowBtnBorderColorOver: { name:"Row Btn: Border OVER Color", value:0xa6a8ab, description:"Button background border color on mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_over", order:37 },
                rowBtnBorderColorDown: { name:"Row Btn: Border DOWN Color", value:0xffbd1a, description:"Button background border color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"border_color_down", order:38 },
                rowBtnBckgrndColorUp: { name:"Row Btn: Bckgrnd UP Color", value:0xFFFFFF, description:"Button background color in its default state.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_up", order:39 },
                rowBtnBckgrndColorOver: { name:"Row Btn: Bckgrnd OVER Color", value:0xFFFFFF, description:"Button background color on mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_over", order:40 },
                rowBtnBckgrndColorDown: { name:"Row Btn: Bckgrnd DOWN Color", value:0xFFFFFF, description:"Button background color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"bckgrnd_color_down", order:41 },
                rowBtnFlagStickBaseHeight: { name:"Row Btn: FlagStick Base Height", value:40, description:"Flag stick height in button's default state.", type:"number", min:0, wgtref: 'rowbtn', wgtname:"flagstick_height", order:46 },
                rowBtnFlagStickGrowHeight: { name:"Row Btn: FlagStick Grow Height", value:40, description:"Flag stick max growth height.", type:"number", min:1, order:46 },
                rowBtnFlagStickCircColor: { name:"Row Btn: FlagStick Circle Colour", value:0x5B5F65, description:"Flag stick circle color.", type:"colour", wgtref: 'rowbtn', wgtname:"flagcircle_color", order:35 },

                // Row Button Label Parameters
                rowBtnShowLabel: { name:"Row Label: Display", value:true, description:"If set false, button label will not display.", type:"bool", wgtref: 'rowbtn', wgtname:"show_label", order:60 },
                rowBtnLabelPlacement: { name:"Row Label: Placement", value:'bottom', description:"Button label placement.", type:"combo", options:['bottom', 'top', 'center'], wgtref: 'rowbtn', wgtname:"label_placement", order:51 },
                rowBtnLabelHalign: { name:"Row Label: Horz Alignment", value:'left', description:"Button label horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowbtn', wgtname:"label_halign", order:52 },
                rowBtnLabelFontSize: { name:"Row Label: Font Size", value:18, description:"Button label font size, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"label_fontsize", order:53 },
                rowBtnLabelColorUp: { name:"Row Label: UP Font Color", value:0x5B5F65, description:"Button label font color in the button’s default state.", type:"colour", wgtref: 'rowbtn', wgtname:"label_fontcolor_up", order:56 },
                rowBtnLabelColorOver: { name:"Row Label: OVER Font Color", value:0x5B5F65, description:"Button label font color on button mouse over.", type:"colour", wgtref: 'rowbtn', wgtname:"label_fontcolor_over", order:57 },
                rowBtnLabelColorDown: { name:"Row Label: DOWN Font Color", value:0x5B5F65, description:"Button label font color when button is selected.", type:"colour", wgtref: 'rowbtn', wgtname:"label_fontcolor_down", order:58 },
                rowBtnLabelOverlayShowBckgrnd: { name:"Row Label Overlay: Display Bckgrnd", value:true, description:"If set true, overlay label will display a background color.", type:"bool", wgtref: 'rowbtn', wgtname:"show_label_bckgrnd", order:61 },
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

                // Row Button Value Label Parameters
                rowBtnValLabDispType: { name:"Row Value Label: Display Type", value:"column label", description:"Type of data to display in the value label.", type:"combo", options:["column value", "column label", "range value", "none"], order:105 },
                rowBtnValLabHalign: { name:"Row Value Label: Horz Alignment", value:'center', description:"Value label horizontal text alignment.", type:"combo", options:['left', 'right', 'center'], wgtref: 'rowbtn', wgtname:"value_label_halign", order:45 },
                rowBtnValLabFontSize: { name:"Row Value Label: Font Size", value:18, description:"Value label font size, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"value_label_fontsize", order:46 },
                rowBtnValLabColor: { name:"Row Value Label: Font Color", value:0x5B5F65, description:"Value label font color.", type:"colour", wgtref: 'rowbtn', wgtname:"value_label_fontcolor", order:49 },

                // Row Animation Parameters
                rowBtnSelectAnimType: { name:"Row Animation: Type", value:"basic", description:"Select how row buttons are animated on drag/drop.", type:"combo", options:["basic", "image", "pin"], wgtref: 'rowbtn', wgtname:"select_anim_type", wgtexclude:true, order: 3 },
                rowBtnImageAnimWidth: { name:"Row Animation: Image Width", value:50, description:"Image animation row width, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"image_select_anim_width", wgtexclude:true,  order:76 },
                rowBtnImageAnimHeight: { name:"Row Animation: Image Height", value:50, description:"Image animation row height, in pixels.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"image_select_anim_height", wgtexclude:true,  order:76 },
                rowBtnPinAnimSize: { name:"Row Animation: Pin Size", value:12, description:"Pin animation pin size.", type:"number", min:5, wgtref: 'rowbtn', wgtname:"pin_select_anim_size", wgtexclude:true, order:76 },
                rowBtnDragAlpha: { name:"Row Animation: Drag Transparency", value:100, description:"Button opacity during row drag.", type:"number", min:50, max:100, order:76 },

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
                    case 'rowbtn' :
                        configObj.show_value_label = (this.qStudioVar.params.rowBtnValLabDispType.value.toLowerCase() !== "none");
                        break;
                    case 'colsldr' :
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
                                if (QUtility.isNumber(rowObject[key])) {
                                    wgtNameObj[key] = rowObject[key];
                                }
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

        // returns an object list of column slider parameters
        getColumnSldrParams : function(wgtName) {
            return this.__getParamObj("colsldr", wgtName);
        },

        // returns an object list of tooltip parameters
        getToolTipParams : function(wgtName) {
            return this.__getParamObj("tooltip", wgtName);
        },

        // returns an object list of lightbox parameters
        getLightBoxParams : function(wgtName) {
            return this.__getParamObj("ctz", wgtName);
        },

        // Call to create component element
        create: function(parent, surveyContain) {
            this.qStudioVar.surveyContain = surveyContain;

            // used w/ component controller; reset everytime create method is called
            this.qStudioVar.respRef = {
                eventCache : undefined,
                radChkEnabled : this.qStudioVar.params.colRadChckEnable.value,
                stickGrowHeight : this.qStudioVar.params.rowBtnFlagStickGrowHeight.value,
                selectAnimType : this.qStudioVar.params.rowBtnSelectAnimType.value.toLowerCase(),
                isLayoutSeq : false,
                rowArry : [],
                colArry : []
            };

            // Auto-set compRTL parameter based on Survey Platform RTL settings
            if (QUtility.isSurveyRTL()) { this.qStudioVar.params.compRTL.value = true; }

            // Disable RTL in QStudio Component Creation Window due to positioning issues
            this.qStudioVar.isCompRTL = (!(parent && parent.id === "componentDemoContainer")) ? this.qStudioVar.params.compRTL.value : false;

            var that = this,
                doc = document,
                respRef = this.qStudioVar.respRef,
                params = this.qStudioVar.params,
                rowContainType = jQuery.trim(params.rowContainType.value).toLowerCase(),
                sliderParams = this.getColumnSldrParams(true),
                isTouchDevice = QUtility.isTouchDevice(),
                isMSTouch = QUtility.isMSTouch(),
                isMulti = (this.questionType() === 'multi'),
                clen = (!respRef.radChkEnabled) ? this.qStudioVar.columnArray.length : this.qStudioVar.columnArray.length - 1,
                compContain = doc.createElement("div"),
                curPinSelect = null,
                downEvent = (!isMSTouch) ?
                    ("mousedown.dragnflag touchstart.dragnflag") :
                    ((isTouchDevice) ? ((window.PointerEvent) ? "pointerdown.dragnflag" : "MSPointerDown.dragnflag") : "mousedown.dragnflag"),
                moveEvent = (!isMSTouch) ?
                    ("mousemove.dragnflag touchmove.dragnflag") :
                    ((isTouchDevice) ? ((window.PointerEvent) ? "pointermove.dragnflag" : "MSPointerMove.dragnflag") : "mousemove.dragnflag"),
                upEvent = (!isMSTouch) ?
                    ("mouseup.dragnflag touchend.dragnflag") :
                    ((isTouchDevice) ? ((window.PointerEvent) ? "pointerup.dragnflag" : "MSPointerUp.dragnflag") : "mouseup.dragnflag");

            // Init feature modules
            QStudioCompFactory.lightBoxFactory("basic", doc.body, this.getLightBoxParams(true));
            QStudioCompFactory.toolTipFactory("", doc.body, this.getToolTipParams(true));

            // Do not allow sequential layout for Multi question type
            respRef.isLayoutSeq = (!isMulti && (rowContainType.indexOf("sequential") !== -1));
            if ((rowContainType.indexOf("sequential") !== -1) && !respRef.isLayoutSeq) {
                params.rowContainType.value = "horizontal grid layout";
                rowContainType = params.rowContainType.value;
            }

            // if row selection animation is 'pin' set rowBtnFlagStickGrowHeight param to 0
            if (respRef.selectAnimType === "pin") { params.rowBtnFlagStickGrowHeight.value = 0; }

            // Component Container CSS Style
            compContain.id = "DragnFlagComponent";
            compContain.dir = (!this.qStudioVar.isCompRTL) ? 'ltr' :'rtl';
            compContain.className = "qdragnflag_component";
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
                rowContainType.substr(0, rowContainType.toLowerCase().indexOf('layout')-1),
                compContain,
                this.getRowContainParams(true)
            );

            // set it so rowContain sits above colContain
            this.qStudioVar.rowContain.container().style.zIndex = 3000;

            // Init slider container
            var slider = doc.createElement("div"),
                trackContain = doc.createElement("div"),
                track = doc.createElement("div"),
                tickContain = doc.createElement("div");

            // append children
            track.appendChild(tickContain);
            trackContain.appendChild(track);
            slider.appendChild(trackContain);
            compContain.appendChild(slider);
            this.qStudioVar.slider = slider;
            this.qStudioVar.trackContain = trackContain;
            this.qStudioVar.tickContain = tickContain;

            // Slider CSS Style
            slider.className = "qwidget_slider";
            slider.dir = "LTR";
            slider.style.cssText += ';'.concat("position: relative; filter: inherit;");
            slider.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
            slider.style.cssText += ';'.concat("-webkit-touch-callout: none;");
            slider.style.cssText += ';'.concat("-ms-touch-action: none;");
            slider.style.cssText += ';'.concat("-webkit-user-select: none;");
            slider.style.cssText += ';'.concat("-khtml-user-select: none;");
            slider.style.cssText += ';'.concat("-moz-user-select: none;");
            slider.style.cssText += ';'.concat("-ms-user-select: none;");
            slider.style.cssText += ';'.concat("-user-select: none;");

            // TrackContain CSS Style
            trackContain.className = "qwidget_slider_track_container";
            trackContain.style.position = "relative";
            trackContain.style.filter = "inherit";

            // TickContain CSS Style
            tickContain.style.position = "absolute";
            tickContain.style.filter = "inherit";

            // init component setup
            this.update(true);

            // down, move, up events
            $(compContain).on(downEvent, '.qwidget_button', function(event) {
                event.stopPropagation();
                event.preventDefault();
                if (isMSTouch && isTouchDevice && !event.originalEvent.isPrimary) { return; }
                var touchEvent = (event.type.indexOf("touch") !== -1 && event.originalEvent.targetTouches) ?
                        event.originalEvent.targetTouches[0] : ((!isMSTouch) ? event : event.originalEvent),
                    rowNode = event.currentTarget,
                    colIndex = parseInt(rowNode.getAttribute('colIndex'), 10),
                    rowIndex = (!isMulti) ? parseInt(rowNode.getAttribute('rowIndex'), 10) : (parseInt(rowNode.getAttribute('rowIndex'), 10) * clen) + colIndex,
                    rowWgt = respRef.rowArry[rowIndex].row,
                    rowWrap = respRef.rowArry[rowIndex].wrap,
                    columnValue = respRef.rowArry[rowIndex].columnValue,
                    baseValue = null,
                    flagStickRangeVal = null,
                    rangeValue = null,
                    isTouchMove = false,
                    surveyScale = QUtility.getQStudioSurveyScale(),
                    scrollOffset = ($(surveyContain).scrollTop() !== null) ? $(surveyContain).scrollTop() : 0,
                    rowWidth = 0,
                    rowHeight = 0,
                    rowWrapLeftOffset = $(rowWrap).offset().left*(1/surveyScale.a),
                    rowWrapTopOffset = $(rowWrap).offset().top*(1/surveyScale.d),
                    flagStickBaseHeight = rowWgt.config().flagstick_height;

                if (rowWgt.enabled()) {
                    QStudioDCAbstract.prototype.isDrag(true);

                    // set row animation on down
                    rowWgt.animType[respRef.selectAnimType].down.call(rowWgt, (true));

                    // calculate row dimensions, but after we set the row animation
                    rowWidth =  $((respRef.selectAnimType !== "pin") ? rowWgt.cache().nodes.background : rowWgt.cache().nodes.pin).outerWidth();
                    rowHeight =  $((respRef.selectAnimType !== "pin") ? rowWgt.cache().nodes.background : rowWgt.cache().nodes.pin).outerHeight();

                    // set row element css
                    $(rowNode).css({
                        'z-index' : 2000,
                        'opacity': (params.rowBtnDragAlpha.value >= 50 && params.rowBtnDragAlpha.value < 100) ? (params.rowBtnDragAlpha.value *.01) : ""
                    });

                    // Set dragx/dragY values
                    rowNode.dragX = touchEvent.pageX - parseInt(rowNode.getAttribute("lastX"), 10)*(surveyScale.a);
                    rowNode.dragY = touchEvent.pageY - parseInt(rowNode.getAttribute("lastY"), 10)*(surveyScale.d);

                    // For non-basic respRef.selectAnimType we want to center the row object when dragged and not answered
                    if (respRef.selectAnimType !== "basic" && !rowWgt.isAnswered()) {
                        rowNode.dragX = (rowWrapLeftOffset + (rowWidth*0.5))*(surveyScale.a);
                        rowNode.dragY = (rowWrapTopOffset + scrollOffset + (rowHeight*0.5))*(surveyScale.d);
                        rowNode.style.left = ((touchEvent.pageX - rowNode.dragX)*(1/surveyScale.a)) + "px";
                        rowNode.style.top = ((touchEvent.pageY - rowNode.dragY + scrollOffset)*(1/surveyScale.d)) + "px";
                    }

                    if (rowWgt.isAnswered()) { rowNode.dragY += scrollOffset; }

                    // Add 'mouseMove' event handler
                    $(doc).on(moveEvent, function(event) {
                        event.preventDefault();
                        var scrollOffset = ($(surveyContain).scrollTop() !== null) ? $(surveyContain).scrollTop() : 0,
                            touchEvent = (event.type.indexOf("touch") !== -1 && event.originalEvent.targetTouches) ?
                                event.originalEvent.targetTouches[0] : ((!isMSTouch) ? event : event.originalEvent);

                        // create eventCache object
                        if (respRef.eventCache === undefined) {
                            var surveyScale = QUtility.getQStudioSurveyScale(),
                                rowWrapLeftOffset = $(rowWrap).offset().left*(1/surveyScale.a),
                                rowWrapTopOffset = $(rowWrap).offset().top*(1/surveyScale.d),
                                trackLeftOffset = $(track).offset().left*(1/surveyScale.a),
                                trackTopOffset = $(track).offset().top*(1/surveyScale.d),
                                rowWidth =  $((respRef.selectAnimType !== "pin") ? rowWgt.cache().nodes.background : rowWgt.cache().nodes.pin).outerWidth(),
                                rowHeight =  $((respRef.selectAnimType !== "pin") ? rowWgt.cache().nodes.background : rowWgt.cache().nodes.pin).outerHeight();

                            if (respRef.selectAnimType === "pin") { rowHeight -= 6; }
                            respRef.eventCache = {
                                surveyScale : surveyScale,
                                sliderParams : that.getColumnSldrParams(true),
                                rowWrapLeftOffset : rowWrapLeftOffset,
                                rowWrapTopOffset : rowWrapTopOffset,
                                trackLeftOffset : trackLeftOffset,
                                trackTopOffset : trackTopOffset,
                                rowWidth : rowWidth,
                                rowHeight : rowHeight,
                                trackBounds : {
                                    left : trackLeftOffset - rowWrapLeftOffset - rowWidth*0.5 + sliderParams.track_border_width,
                                    right : trackLeftOffset - rowWrapLeftOffset - rowWidth*0.5 + $(track).width() + sliderParams.track_border_width,
                                    top : (trackTopOffset - rowWrapTopOffset - rowHeight - rowWgt.flagStickHeight() - 5) + scrollOffset + sliderParams.track_border_width,
                                    bottom : trackTopOffset - rowWrapTopOffset + scrollOffset + sliderParams.track_border_width + sliderParams.height
                                }
                            };
                        }

                        // For touchEnabled and pin animation
                        if (isTouchDevice && respRef.selectAnimType === "pin" && curPinSelect) {
                            var prevRowNode = curPinSelect.parentNode,
                                prevRowIndex = parseInt(prevRowNode.getAttribute('rowIndex'), 10),
                                prevColIndex = parseInt(prevRowNode.getAttribute('colIndex'), 10),
                                prevRowWgt = respRef.rowArry[(!isMulti) ? prevRowIndex : (prevRowIndex * clen) + prevColIndex].row;

                            prevRowWgt.animType.pin.hover.call(prevRowWgt, false);
                            curPinSelect = null;
                        }

                        isTouchMove = true;
                        if (touchEvent.pageX < 0) { touchEvent.pageX = 0; }
                        if (touchEvent.pageY < 0) { touchEvent.pageY = 0; }
                        var ex = (touchEvent.pageX - rowNode.dragX)*(1/respRef.eventCache.surveyScale.a),
                            ey = ((touchEvent.pageY - rowNode.dragY) + scrollOffset)*(1/respRef.eventCache.surveyScale.d);

                        if (!rowWgt.isAnswered()) {
                            rowNode.style.top = ey + "px";
                        } else {
                            if (ex < respRef.eventCache.trackBounds.left) { ex = respRef.eventCache.trackBounds.left; }
                            else if (ex > respRef.eventCache.trackBounds.right) { ex = respRef.eventCache.trackBounds.right; }
                        }
                        rowNode.style.left = ex + "px";

                        // If row is on the scale
                        if (ex >= respRef.eventCache.trackBounds.left && ex <= respRef.eventCache.trackBounds.right && ey >= respRef.eventCache.trackBounds.top && ey <= respRef.eventCache.trackBounds.bottom) {
                            if (!rowWgt.isAnswered()) { rowWgt.isAnswered(true); }
                            // Set baseValue, flagStickRangeVal, rangeValue & columnValue variables
                            baseValue = (ex - respRef.eventCache.sliderParams.track_border_width + (respRef.eventCache.rowWrapLeftOffset - respRef.eventCache.trackLeftOffset) + respRef.eventCache.rowWidth*0.5);
                            if (baseValue < 0) { baseValue = 0; }
                            if (baseValue > respRef.eventCache.sliderParams.width) { baseValue = respRef.eventCache.sliderParams.width; }
                            rangeValue = parseFloat(((baseValue/respRef.eventCache.sliderParams.width) * (respRef.eventCache.sliderParams.max - respRef.eventCache.sliderParams.min) + respRef.eventCache.sliderParams.min).toFixed(respRef.eventCache.sliderParams.precision));
                            flagStickRangeVal = parseInt(((baseValue/respRef.eventCache.sliderParams.width) * respRef.stickGrowHeight).toFixed(0), 10);
                            columnValue = Math.round((baseValue/respRef.eventCache.sliderParams.width) * (clen - 1));
                            if (that.qStudioVar.isCompRTL) {
                                rangeValue = parseFloat(((baseValue/respRef.eventCache.sliderParams.width) * (respRef.eventCache.sliderParams.min - respRef.eventCache.sliderParams.max) + respRef.eventCache.sliderParams.max).toFixed(respRef.eventCache.sliderParams.precision));
                                flagStickRangeVal = respRef.stickGrowHeight - flagStickRangeVal;
                                columnValue = clen - 1 - columnValue;
                            }

                            // set value label text
                            switch(params.rowBtnValLabDispType.value.toLowerCase()) {
                                case "column label":
                                    rowWgt.valueLabel(that.qStudioVar.columnArray[columnValue].label);
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

                            // set flagstick height
                            rowWgt.flagStickHeight(flagStickBaseHeight + flagStickRangeVal);

                            // lock row widget onto slider
                            rowWgt.widget().style.top =
                                ((respRef.eventCache.trackTopOffset - respRef.eventCache.rowWrapTopOffset) -
                                    respRef.eventCache.rowHeight - rowWgt.flagStickHeight() + respRef.eventCache.sliderParams.track_border_width + (respRef.eventCache.sliderParams.height - 10)*0.5) + "px";
                        }

                        // If row is off the scale
                        else {
                            if (rowWgt.isAnswered()) {
                                rowWgt.isAnswered(false);
                                rowWgt.valueLabel("");
                                if (!isTouchDevice && respRef.selectAnimType !== "pin") { rowWgt.toggleMouseEnter(true); }
                            }

                            // Reset baseValue, flagStickRangeVal, rangeValue & columnValue variables
                            baseValue = null;
                            flagStickRangeVal = null;
                            rangeValue = null;
                            columnValue = null;
                        }

                        // Set lastX and lastY rowNode attributes
                        rowNode.setAttribute("lastX", parseInt(rowNode.style.left, 10).toString());
                        rowNode.setAttribute("lastY", parseInt(rowNode.style.top, 10).toString());
                    });

                    // Add 'mouseUp' event handler
                    $(doc).on(upEvent, function(event) {
                        QStudioDCAbstract.prototype.isDrag(false);
                        $(doc).off(moveEvent);
                        $(doc).off(upEvent);

                        // set row element css
                        $(rowNode).css({
                            'z-index' : "auto",
                            'opacity': ""
                        });

                        // destroy eventCache object
                        respRef.eventCache = undefined;

                        // If row has not been answered
                        if (!rowWgt.isAnswered()) {
                            // Return row to home location
                            rowWgt.animType[respRef.selectAnimType].down.call(rowWgt, (false));
                            rowNode.setAttribute("lastX", "0");
                            rowNode.setAttribute("lastY", "0");
                            rowNode.style.left = 0;
                            rowNode.style.top = 0;

                            // See if we need to unanswer row
                            if (respRef.rowArry[rowIndex].columnValue !== -1) {
                                var rowRemRefArray = respRef.colArry[respRef.rowArry[rowIndex].columnValue].rowRefArry;
                                rowRemRefArray.splice(jQuery.inArray(rowWrap, rowRemRefArray), 1);
                                that.sendResponse(rowWgt.rowIndex(), respRef.rowArry[rowIndex].columnValue, false);
                                respRef.rowArry[rowIndex].rangeValue = -1;
                                respRef.rowArry[rowIndex].columnValue = -1;
                                if (respRef.isLayoutSeq) { that.qStudioVar.rowContain.back(rowWgt); }
                            }
                        }

                        // If row has been answered
                        else {
                            var rowRefArray = respRef.colArry[columnValue].rowRefArry;
                            if (jQuery.inArray(rowWrap, rowRefArray) === -1) {
                                // Set row response
                                if (respRef.isLayoutSeq && respRef.rowArry[rowIndex].columnValue === -1) { that.qStudioVar.rowContain.next(); }
                                if (respRef.rowArry[rowIndex].columnValue >= 0 && respRef.rowArry[rowIndex].columnValue !== columnValue) {
                                    // edit rowRefArray accordingly
                                    var rowRemRefArray = respRef.colArry[respRef.rowArry[rowIndex].columnValue].rowRefArry;
                                    rowRemRefArray.splice(jQuery.inArray(rowWrap, rowRemRefArray), 1);

                                    // Un-answer current response
                                    that.sendResponse(rowWgt.rowIndex(), respRef.rowArry[rowIndex].columnValue, false);
                                }

                                // check if we need to clear radiocheck option
                                if (respRef.radChkEnabled) { that.manageClick(true); }

                                // set row response
                                rowRefArray.push(rowWrap);
                                that.sendResponse(rowWgt.rowIndex(), columnValue, true);
                                respRef.rowArry[rowIndex].rangeValue = rangeValue;
                                respRef.rowArry[rowIndex].columnValue = columnValue;
                                // If question type is multi, show next row in rowWrap
                                if (isMulti && (rowWrap.children[colIndex + 1])) {
                                    rowWrap.children[colIndex + 1].style.display = "block";
                                }
                            } else if (respRef.rowArry[rowIndex].columnValue !== columnValue) {
                                // Return row to home location
                                rowWgt.animType[respRef.selectAnimType].down.call(rowWgt, (false));
                                rowNode.setAttribute("lastX", "0");
                                rowNode.setAttribute("lastY", "0");
                                rowNode.style.left = 0;
                                rowNode.style.top = 0;
                                rowWgt.isAnswered(false);
                                rowWgt.valueLabel("");

                                // See if we need to unanswer row
                                if (respRef.rowArry[rowIndex].columnValue !== -1) {
                                    var rowRemRefArray = respRef.colArry[respRef.rowArry[rowIndex].columnValue].rowRefArry;
                                    rowRemRefArray.splice(jQuery.inArray(rowWrap, rowRemRefArray), 1);
                                    that.sendResponse(rowWgt.rowIndex(), respRef.rowArry[rowIndex].columnValue, false);
                                    respRef.rowArry[rowIndex].rangeValue = -1;
                                    respRef.rowArry[rowIndex].columnValue = -1;
                                    if (respRef.isLayoutSeq) { that.qStudioVar.rowContain.back(rowWgt); }
                                }
                            } else {
                                respRef.rowArry[rowIndex].rangeValue = rangeValue;
                            }
                        }

                        // For touchEnabled and pin animation
                        if (isTouchDevice && respRef.selectAnimType === "pin" && !isTouchMove) {
                            var pin = rowWgt.cache().nodes.pin;
                            if (pin !== curPinSelect) {
                                if (curPinSelect) {
                                    var prevRowNode = curPinSelect.parentNode,
                                        prevRowIndex = parseInt(prevRowNode.getAttribute('rowIndex'), 10),
                                        prevColIndex = parseInt(prevRowNode.getAttribute('colIndex'), 10),
                                        prevRowWgt = respRef.rowArry[(!isMulti) ? prevRowIndex : (prevRowIndex * clen) + prevColIndex].row;

                                    prevRowWgt.animType.pin.hover.call(prevRowWgt, false);
                                }

                                rowWgt.animType.pin.hover.call(rowWgt, true);
                                curPinSelect = pin;
                            } else {
                                rowWgt.animType.pin.hover.call(rowWgt, false);
                                curPinSelect = null;
                            }
                        }
                    });
                }
            });

            if (respRef.dkWgt) {
                var dkEle = respRef.dkWgt.widget(),
                    eventDown = (!isMSTouch) ?
                        "mousedown.dragnflag touchstart.dragnflag" :
                        ((window.PointerEvent) ? "pointerdown.dragnflag" : "MSPointerDown.dragnflag"),
                    eventUp = (!isMSTouch) ?
                        "mouseup.dragnflag touchend.dragnflag" :
                        ((window.PointerEvent) ? "pointerup.dragnflag" : "MSPointerUp.dragnflag"),
                    eventMove = (!isMSTouch) ?
                        "touchmove.dragnflag" :
                        ((window.PointerEvent) ? "pointermove.dragnflag" : "MSPointerMove.dragnflag"),
                    eventCancel = (!isMSTouch) ?
                        "touchcancel.dragnflag" :
                        ((window.PointerEvent) ? "pointercancel.dragnflag" : "MSPointerCancel.dragnflag"),
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
                    if (event.type === "touchstart" || event.type === "pointerdown" || event.type === "MSPointerDown") {
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

                            if (startX !== null && startY !== null) {
                                // push touch start coordinates into touchCoordArray
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

                            if (Math.abs(event.screenX - x) < 10 && Math.abs(event.screenY - y) < 10) {
                                event.stopPropagation();
                                event.preventDefault();
                            }
                        }
                    }, true);
                }
            }
        },

        update : function(init) {
            var doc = document,
                respRef = this.qStudioVar.respRef,
                params = this.qStudioVar.params,
                rowContain = this.qStudioVar.rowContain,
                compContain = this.qStudioVar.compContain,
                isMSTouch = QUtility.isMSTouch(),
                isTouchDevice = QUtility.isTouchDevice(),
                isMulti = (this.questionType() === 'multi'),
                i = 0, rlen = this.qStudioVar.rowArray.length,
                j = 0, clen = (!respRef.radChkEnabled) ? this.qStudioVar.columnArray.length : this.qStudioVar.columnArray.length - 1,
                upEvent = (!isMSTouch) ? ((isTouchDevice) ? "touchend.dragnflag" : "mouseup.dragnflag") :
                    ((isTouchDevice) ? ((window.PointerEvent) ? "pointerup.dragnflag" : "MSPointerUp.dragnflag") : "mouseup.dragnflag");

            if (!init) {
                this.qStudioVar.isUpdating = true;
                qToolTipSingleton.getInstance().hide();

                // trigger upEvent to prevent dragging while updating
                $(doc).trigger(upEvent);

                // remove all widgets from rowContain & update
                rowContain.remove();
                rowContain.config(this.getRowContainParams(true));
            }

            // create/update row widgets
            for (i = 0; i < rlen; i += 1) {
                var rowObject = this.qStudioVar.rowArray[i],
                    userDefType = jQuery.trim(rowObject.var1 || rowObject.type).toLowerCase(),
                    wgtNameObj = this.getRowBtnParams(true),
                    rowBtnType = params.rowBtnDefaultType.value.toLowerCase(),
                    rowWgt = undefined,
                    rowWrap = undefined;

                // check if user defined type is a valid row widget
                if (this.getAcceptedRowWidgets(userDefType) === true) { rowBtnType = userDefType; }

                // set widget params
                wgtNameObj.rowIndex = i;
                wgtNameObj.colIndex = 0;
                wgtNameObj.id = (!isMulti) ? (rowObject.id || 'row_' + i) : (rowObject.id + '_' + 0 || 'row_' + i + '_' + 0);
                wgtNameObj.label = rowObject.label;
                wgtNameObj.description = rowObject.description;
                wgtNameObj.image = rowObject.image;
                wgtNameObj.btn_widget_type = rowBtnType;

                // for base button widget set label placement to overlay type
                if (rowBtnType === "base") { wgtNameObj.label_placement += " overlay"; }

                // set widget button level params
                this.__setRowBtnLevelParams(rowObject, wgtNameObj);

                if (init) {
                    rowWgt = QStudioCompFactory.widgetFactory(
                        "flagbtn",
                        compContain,
                        wgtNameObj
                    );

                    rowWgt.enabled(true);
                    rowWgt.touchEnabled(isTouchDevice);

                    // Create 'rowIndex' & 'colIndex' attributes for row widget for use w/ controller
                    rowWgt.widget().setAttribute('rowIndex', i.toString());
                    rowWgt.widget().setAttribute('colIndex', "0");

                    // Init row widget for dragging
                    rowWgt.widget().style.cssText += ';'.concat("-ms-touch-action: none;");
                    rowWgt.widget().style.cssText += ';'.concat("touch-action: none;");
                    rowWgt.widget().style.position = "absolute";
                    rowWgt.widget().style.left = 0;
                    rowWgt.widget().style.top = 0;
                    rowWgt.widget().setAttribute("lastX", "0");
                    rowWgt.widget().setAttribute("lastY", "0");

                    // add row widget to row Container
                    rowWrap = this.qStudioVar.rowContain.add(rowWgt);

                    // Store reference of Row Widget for use w/ controller
                    respRef.rowArry.push({
                        row: rowWgt,
                        wrap : rowWrap,
                        rangeValue: -1,
                        columnValue: -1
                    });
                } else {
                    rowWgt = respRef.rowArry[(!isMulti) ? i : i * clen].row;

                    // record current flag height and value label
                    if (rowWgt.isAnswered()) {
                        respRef.rowArry[(!isMulti) ? i : i * clen].rowFlagHeight = rowWgt.flagStickHeight();
                        respRef.rowArry[(!isMulti) ? i : i * clen].rowValueLabel = $(rowWgt.cache().nodes.valueLabel).html();
                    }

                    // update Row Button Widget
                    rowWgt.config(wgtNameObj);

                    // add row widget to row Container
                    rowWrap = this.qStudioVar.rowContain.add(rowWgt);
                    respRef.rowArry[(!isMulti) ? i : i * clen].wrap = rowWrap;
                }

                // set rowWrap dimensions
                if (!respRef.isLayoutSeq) {
                    rowWrap.style.width = $(rowWgt.widget()).outerWidth() + "px";
                    rowWrap.style.height = $(rowWgt.widget()).outerHeight() + "px";
                }

                // Create Row Button(s) and add to Wrapper
                if (isMulti) {
                    for (j = 1; j < clen; j += 1) {
                        wgtNameObj.colIndex = j;
                        wgtNameObj.id = rowObject.id + '_' + j || 'row_' + i + '_' + j;

                        if (init) {
                            // Create Row Button Widget
                            rowWgt = QStudioCompFactory.widgetFactory(
                                "flagbtn",
                                rowWrap,
                                wgtNameObj
                            );

                            rowWgt.enabled(true);
                            rowWgt.touchEnabled(isTouchDevice);

                            // Create 'rowIndex' & 'colIndex' attributes for row widget for use w/ controller
                            rowWgt.widget().setAttribute('rowIndex', i.toString());
                            rowWgt.widget().setAttribute('colIndex', j.toString());

                            // Init row widget for dragging
                            rowWgt.widget().style.cssText += ';'.concat("-ms-touch-action: none;");
                            rowWgt.widget().style.cssText += ';'.concat("touch-action: none;");
                            rowWgt.widget().style.display = "none";
                            rowWgt.widget().style.position = "absolute";
                            rowWgt.widget().style.left = 0;
                            rowWgt.widget().style.top = 0;
                            rowWgt.widget().setAttribute("lastX", "0");
                            rowWgt.widget().setAttribute("lastY", "0");

                            // Store reference of Row Widget for use w/ controller
                            respRef.rowArry.push({
                                row: rowWgt,
                                wrap : rowWrap,
                                rangeValue: -1,
                                columnValue: -1
                            });
                        } else {
                            rowWgt = respRef.rowArry[(i * clen) + j].row;

                            // record current flag height and value label
                            if (rowWgt.isAnswered()) {
                                respRef.rowArry[(i * clen) + j].rowFlagHeight = rowWgt.flagStickHeight();
                                respRef.rowArry[(i * clen) + j].rowValueLabel = $(rowWgt.cache().nodes.valueLabel).html();
                            }

                            // update Row Button Widget
                            rowWgt.config(wgtNameObj);

                            // append row widget to rowWrap
                            rowWrap.appendChild(rowWgt.widget());
                            respRef.rowArry[(i * clen) + j].wrap = rowWrap;
                        }
                    }
                }
            }

            var slider = this.qStudioVar.slider,
                trackContain = this.qStudioVar.trackContain,
                track = trackContain.firstChild,
                tickContain = this.qStudioVar.tickContain,
                sliderParams = this.getColumnSldrParams(true),
                sldrTickLabDispType = sliderParams.ticklabel_display_type.toLowerCase(),
                numOfTicks = (sldrTickLabDispType !== "show three") ? ((params.colSldrTickLabCustomCnt.value >= 1) ? params.colSldrTickLabCustomCnt.value : 1) : 3,
                tickIncrem = (numOfTicks > 1) ? (clen - 1)/(numOfTicks - 1) : 1,
                overrideTicks = ((sldrTickLabDispType === "custom" || sldrTickLabDispType === "show three") && (tickIncrem >= 1)),
                tickSpacing = sliderParams.width / (clen - 1),
                tickLabArray = [],
                maxTickLabHeight = 0,
                ltTickLabSize = 0,
                rbTickLabSize = 0;

            if (overrideTicks) {
                // first clear all tick labels
                for (var k = 0; k < clen; k += 1) {
                    tickLabArray[k] = { label: "" };
                }

                // then add the ones necessary
                for (var k = 0; k < numOfTicks; k += 1) {
                    var index = Math.round(k*tickIncrem);
                    tickLabArray[index].label = this.qStudioVar.columnArray[index].label;
                }
            } else {
                tickLabArray = (!respRef.radChkEnabled) ?
                    this.qStudioVar.columnArray : this.qStudioVar.columnArray.slice(0, clen);
            }

            // reverse scale for rtl setup
            if (this.qStudioVar.isCompRTL) { tickLabArray = tickLabArray.concat([]).reverse(); }

            // slider css
            slider.style.marginTop = params.colSldrVoffset.value + "px";
            slider.style[(!this.qStudioVar.isCompRTL) ? 'marginLeft' : 'marginRight'] = params.colSldrHoffset.value + "px";

            // update track
            QStudioAssetFactory.prototype.assetUpdate.baseBckgrnd.apply(this, [track, {
                show_bckgrnd_import : sliderParams.show_track_import,
                width : sliderParams.width,
                height : sliderParams.height,
                padding : 0,
                border_width_up : sliderParams.track_border_width,
                border_radius : sliderParams.track_border_radius,
                border_style : sliderParams.track_border_style,
                border_color_up : sliderParams.track_border_color,
                bckgrnd_color_up : sliderParams.track_color,
                bckgrnd_import_up : sliderParams.track_import
            }]);

            // Create/update tick and tick label
            while (tickContain.firstChild) { tickContain.removeChild(tickContain.firstChild); }
            for (i = 0; i < clen; i += 1) {
                var tickWrap = doc.createElement("div"),
                    tick = doc.createElement("div"),
                    tickLabelContain = doc.createElement("div"),
                    tickLabel = doc.createElement("label"),
                    tickLabelWidth = 0,
                    tickLabelHeight = 0,
                    updateTickLabel = false;

                // Tick wrapper CSS settings
                tickWrap.className = "qwidget_slider_tick_wrapper";
                tickWrap.style.position = "absolute";
                tickWrap.style.filter = "inherit";
                tickWrap.style.left = (i * tickSpacing) + "px";
                tickContain.appendChild(tickWrap);       // append tickWrap to tickContain

                // Tick CSS settings
                tick.className = "qwidget_slider_tick";
                tick.style.position = "absolute";
                tick.style.filter = "inherit";
                tick.style.width = sliderParams.tick_width + "px";
                tick.style.height = sliderParams.tick_height + "px";
                tick.style.backgroundColor = "#" + QUtility.paramToHex(sliderParams.tick_color);
                tick.style.marginLeft = (-sliderParams.tick_width * 0.5) + "px";
                tick.style.marginBottom = (sliderParams.track_border_width + sliderParams.tick_height*0.5) + "px";
                tick.style.top = (sliderParams.height - sliderParams.tick_height)*0.5 + "px";
                if (i === 0 || i === (clen-1)) { tick.style.visibility = "hidden"; }
                tickWrap.appendChild(tick);     // append tick to tickWrap

                // update tick label
                tickLabelContain.appendChild(tickLabel);
                updateTickLabel = QStudioAssetFactory.prototype.assetUpdate.label.apply(this, [tickLabelContain, {
                    label_trim : true,
                    label_font_family : params.compPrimColumnFontFamily.value,
                    isRTL : this.qStudioVar.isCompRTL,
                    label : jQuery.trim(tickLabArray[i].label),
                    label_width : Math.min(sliderParams.ticklabel_width, tickSpacing),
                    label_halign : "center",
                    label_fontsize : sliderParams.ticklabel_fontsize,
                    label_fontcolor_up : sliderParams.ticklabel_fontcolor
                }]);

                // update classNames
                tickLabelContain.className = "qwidget_slider_tick_label_container";
                tickLabel.className = "qwidget_slider_tick_label";
                tickLabel.style.display = ((sliderParams.ticklabel_display_type === "show ends" && (i !== 0 && i !== clen - 1))
                    || sliderParams.ticklabel_display_type === "show none") ? "none" : "block";

                // finish tick label setup
                if (updateTickLabel) {
                    // append tickLabelContain to tickWrap
                    tickWrap.appendChild(tickLabelContain);

                    // record tickLabel dimensions
                    tickLabelWidth = $(tickLabel).width();
                    tickLabelHeight = $(tickLabel).height();

                    // position tickLabelContain
                    tickLabelContain.style.marginTop = (sliderParams.track_border_width + sliderParams.height + sliderParams.ticklabel_offset) + "px";
                    tickLabelContain.style.marginLeft = (-tickLabelWidth * 0.5) + "px";

                    // for horizontal sliders we need to calculate the left and right tick label width
                    if (i == 0) {
                        ltTickLabSize = tickLabelWidth;
                    } else if (i === clen - 1) {
                        rbTickLabSize = tickLabelWidth;
                    }

                    // Calculate max tick label height
                    maxTickLabHeight = Math.max(maxTickLabHeight, tickLabelHeight);
                }

                if (init) {
                    // This array will be used to prevent rows from being dropped in same column
                    respRef.colArry.push({
                        rowRefArry: []
                    });
                }
            }

            // set track left margin
            track.style.marginLeft = ((ltTickLabSize * 0.5) - sliderParams.track_border_width) + "px";

            // set trackContain dimensions
            trackContain.style.width = ($(track).outerWidth() +
                ((ltTickLabSize * 0.5) - sliderParams.track_border_width) + ((rbTickLabSize * 0.5) - sliderParams.track_border_width)) + "px";
            trackContain.style.height =
                ($(track).outerHeight() + maxTickLabHeight) + "px";

            // set slider dimensions
            slider.style.width = $(trackContain).outerWidth() + "px";
            slider.style.height = $(trackContain).outerHeight() + "px";

            // Position row container and slider container so that they're horizontally centered to one another
            var rowContainWidth = $(this.qStudioVar.rowContain.container()).outerWidth(),
                sliderWidth = $(slider).outerWidth(true);

            if (rowContainWidth > sliderWidth) {
                slider.style[(!this.qStudioVar.isCompRTL) ? 'left' : 'right'] =
                    (rowContainWidth - sliderWidth)*0.5 + "px";
            } else {
                this.qStudioVar.rowContain.container().style[(!this.qStudioVar.isCompRTL) ? 'left' : 'right'] =
                    (sliderWidth - rowContainWidth)*0.5 + "px";
            }

            // set row responses, but after we update the slider since the track position can change
            if (!init) {
                var surveyScale = QUtility.getQStudioSurveyScale();
                for (i = 0; i < respRef.rowArry.length; i += 1) {
                    var rowWgt = respRef.rowArry[i].row,
                        rowWgtWrap = respRef.rowArry[i].wrap,
                        rowRangeValue = respRef.rowArry[i].rangeValue,
                        rowWidth = 0,
                        rowHeight = 0;

                    if (rowWgt.isAnswered()) {
                        rowWgt.flagStickHeight(respRef.rowArry[i].rowFlagHeight);
                        rowWgt.animType[respRef.selectAnimType].down.call(rowWgt, (true));
                        rowWgt.animType[respRef.selectAnimType].select.call(rowWgt, (true));
                        rowWidth = $((respRef.selectAnimType !== "pin") ? rowWgt.cache().nodes.background : rowWgt.cache().nodes.pin).outerWidth();
                        rowHeight = $((respRef.selectAnimType !== "pin") ? rowWgt.cache().nodes.background : rowWgt.cache().nodes.pin).outerHeight();
                        if (respRef.selectAnimType === "pin") { rowHeight -= 6; }
                        rowWgt.widget().style.left =
                            ($(track).offset().left*(1/surveyScale.a) + sliderParams.track_border_width - $(rowWgtWrap).offset().left*(1/surveyScale.a) - rowWidth*0.5 + ((rowRangeValue*0.01) * sliderParams.width)) + "px";
                        rowWgt.widget().style.top =
                            ($(track).offset().top*(1/surveyScale.d) - $(rowWgtWrap).offset().top*(1/surveyScale.d) - rowHeight - rowWgt.flagStickHeight() + (sliderParams.height *.5 - sliderParams.track_border_width)) + "px";
                        rowWgt.widget().setAttribute("lastX", parseInt(rowWgt.widget().style.left, 10).toString());
                        rowWgt.widget().setAttribute("lastY", parseInt(rowWgt.widget().style.top, 10).toString());
                        rowWgt.valueLabel(respRef.rowArry[i].rowValueLabel);
                        delete respRef.rowArry[i].rowFlagHeight;
                        delete respRef.rowArry[i].rowValueLabel;
                    }
                }
            }

            // create/update radiocheck widget
            if (respRef.radChkEnabled) {
                var dkConfig = this.__getParamObj("dkbtn", true);
                dkConfig.id = this.qStudioVar.columnArray[clen].id || 'col_' + clen;
                dkConfig.colIndex = clen;
                dkConfig.isRTL = this.qStudioVar.isCompRTL;
                dkConfig.label = this.qStudioVar.columnArray[clen].label;
                dkConfig.isRadio = true;
                dkConfig.radchkbtn_label_trim = true;

                // init radiocheck widget
                if (init) {
                    respRef.dkWgt = new QRadioCheckBtn(slider, dkConfig);
                    respRef.dkWgt.enabled(true);
                    respRef.dkWgt.touchEnabled(QUtility.isTouchDevice());
                    respRef.dkWgt.widget().className = "";
                    respRef.dkWgt.widget().style.marginBottom = "5px";
                    respRef.dkWgt.widget().style.position = "relative";
                } else {
                    respRef.dkWgt.config(dkConfig);
                }

                respRef.dkWgt.widget().style.height = $(respRef.dkWgt.widget()).outerHeight(true) + "px";
                respRef.dkWgt.widget().style.top = parseInt(dkConfig.top, 10) + "px";
                (!this.qStudioVar.isCompRTL) ?
                    respRef.dkWgt.widget().style.left = ($(slider).outerWidth() - $(respRef.dkWgt.widget()).outerWidth() + sliderParams.track_border_width + parseInt(dkConfig.left, 10)) + "px":
                    respRef.dkWgt.widget().style.left = (-sliderParams.track_border_width + parseInt(dkConfig.left, 10)) + "px";

                // add widget to compContain
                slider.appendChild(respRef.dkWgt.widget());

                // adjust slider height
                slider.style.height = ($(trackContain).outerHeight() + $(respRef.dkWgt.widget()).outerHeight()) + "px";
            } else {
                if (respRef.dkWgt && respRef.dkWgt.widget().parentNode && respRef.dkWgt.widget().parentNode.nodeType === 1){
                    respRef.dkWgt.widget().parentNode.removeChild(respRef.dkWgt.widget());
                }
            }
        },

        manageClick : function(reset) {
            reset = !!(typeof reset === "boolean" && reset);
            var respRef = this.qStudioVar.respRef,
                dkWgt = respRef.dkWgt,
                rlen = respRef.rowArry.length;

            // we will check to see if radiocheck widget is answered; if so, we need to clear row responses and reset radiocheck widget
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
                    var rowWgt = this.qStudioVar.respRef.rowArry[i].row,
                        rowNode = rowWgt.widget(),
                        rowWrap = this.qStudioVar.respRef.rowArry[i].wrap;

                    if (rowWgt.isAnswered()) {
                        // Return row to home location
                        rowWgt.animType[this.qStudioVar.params.rowBtnSelectAnimType.value.toLowerCase()].down.call(rowWgt, (false));
                        rowNode.setAttribute("lastX", "0");
                        rowNode.setAttribute("lastY", "0");
                        rowNode.style.left = 0;
                        rowNode.style.top = 0;
                        rowWgt.isAnswered(false);
                        rowWgt.valueLabel("");
                        rowWgt.toggleMouseEnter(false);

                        // See if we need to unanswer row
                        if (respRef.rowArry[i].columnValue !== -1) {
                            var rowRemRefArray = respRef.colArry[respRef.rowArry[i].columnValue].rowRefArry;
                            rowRemRefArray.splice(jQuery.inArray(rowWrap, rowRemRefArray), 1);
                            this.sendResponse(rowWgt.rowIndex(), respRef.rowArry[i].columnValue, false);
                            respRef.rowArry[i].rangeValue = -1;
                            respRef.rowArry[i].columnValue = -1;
                            if (respRef.isLayoutSeq) { this.qStudioVar.rowContain.back(rowWgt); }
                        }
                    }

                    if (rowWgt.colIndex() === 0) {
                        this.sendResponse(rowWgt.rowIndex(), dkWgt.colIndex(), true);
                    }
                }

                dkWgt.isAnswered(true);
            }
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

        // used by Dimensions to get responses
        getDimenResp: function() {
            if (!this.qStudioVar.isDC) { return; }
            var respRef = this.qStudioVar.respRef,
                isMulti = (this.questionType() === "multi"),
                valarray = [],
                rlen = this.qStudioVar.rowArray.length,
                clen = (!respRef.radChkEnabled) ? this.qStudioVar.columnArray.length : this.qStudioVar.columnArray.length - 1,
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