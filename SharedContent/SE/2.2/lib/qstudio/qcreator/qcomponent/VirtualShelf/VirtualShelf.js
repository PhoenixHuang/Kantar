/**
 * VirtualShelf Javascript File
 * Version : 1.3.0
 * Date : 2014-11-13
 *
 * VirtualShelf Component.
 * BaseClassType : Single
 * Requires rowArray dataset.
 * Confluence Link : N/A
 *
 */
// TODO: For firefox replace all standard select dropdowns w/ custom due to scaling positioning bug
// TODO: Test multiple images for QStudio
var VirtualShelf = (function () {

    function VirtualShelf() {
        this.qStudioVar = {
            interact : true,
            isDC : false,
            params : this.initParams(),
            rowArray : [],
            selectArray : [],
            qtyArray : [],
            timeArray : []
        };
    }

    VirtualShelf.prototype = {

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

        // required for QStudio only
        selectArray: function() {
            var arg = arguments[0];

            if (typeof arg === 'undefined') {
                //console.log("Getting selectArray");
                return this.qStudioVar.selectArray;
            }

            if (jQuery.isArray(arg)) {
                //console.log("Setting selectArray");
                this.qStudioVar.selectArray = arg;
            }
        },

        // required for QStudio only
        qtyArray: function() {
            var arg = arguments[0];

            if (typeof arg === 'undefined') {
                //console.log("Getting qtyArray");
                return this.qStudioVar.qtyArray;
            }

            if (jQuery.isArray(arg)) {
                //console.log("Setting qtyArray");
                this.qStudioVar.qtyArray = arg;
            }
        },

        // required for QStudio only
        timeArray: function() {
            var arg = arguments[0];

            if (typeof arg === 'undefined') {
                //console.log("Getting timeArray");
                return this.qStudioVar.timeArray;
            }

            if (jQuery.isArray(arg)) {
                //console.log("Setting timeArray");
                this.qStudioVar.timeArray = arg;
            }
        },

        dimensions: function() {
            return [
                { name:"rowArray", prop:[
                    "label",
                    "image",
                    "description",
                    "price_count",
                    "width_height"
                ] },

                { name:"selectArray", prop:[
                    "label"
                ] },

                { name:"qtyArray", prop:[
                    "label"
                ] },

                { name:"timeArray", prop:[
                    "label"
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
            return 'VirtualShelf component description...';
        },

        baseClassType: function() {
            return "multiSubQ";
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
                "qcreator/qcore/QFactory.js"
            ];
        },

        subQDimensionArray: function() {
            return [
                { dimensionName:"selectArray", baseType:"single", questionType : this.questionType(), isMandatory : false },
                { dimensionName:"qtyArray", baseType:"single", questionType : "text", isMandatory : false },
                { dimensionName:"timeArray", baseType:"single", questionType : "text", isMandatory : false }
            ];
        },

        initParams: function() {
            return {
                // Component Parameters
                compQuestionType: { name:"Component: Question Type", value:'Multiple Choice', description:"Component question type.", type:"combo", options:['Single Choice', 'Multiple Choice', 'Multiple Soft Cap', 'Multiple Hard Cap'], order: 1 },
                compCapValueQtyMax: { name:"Component: Cap Value/Qty Max", value:10, description:"Restrict the number of button selections.", type:"number", min:2, order: 2 },
                compIsMandatory: { name:"Component: Is Mandatory", value:false, description:"If set true, mandatory conditions must be met to complete exercise.", type:"bool", order:24 },
                compRTL: { name:"Component: RTL Enable", value:false, description:"If set true, component will be setup to support right-to-left languages.", type:"bool", order:24 },
                compPrimFontFamily: { name:"Component: Font Family", value:"Arial, Helvetica, sans-serif", description:"Primary font used throughout component.", type:"string", order:19 },

                // Background Import Image
                bckgrndImgDisplay: { name:"Background Import Image: Display", value:false, description:"If set true, a background image will display behind the shelf items.", type:"bool", order:69 },
                bckgrndImgImport: { name:"Background Import Image", value:"", description:"Background image url.", type:"bitmapdata", order:64 },
                bckgrndImgWidth : { name:"Background Import Image: Width", value:600, description:"Background image width, in pixels.", type:"number", min:10, order:30 },
                bckgrndImgHeight : { name:"Background Import Image: Height", value:400, description:"Background image height in pixels.", type:"number", min:10, order:30 },
                bckgrndImgLeft: { name:"Background Import Image: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", order:67 },
                bckgrndImgTop: { name:"Background Import Image: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", order:68 },

                // Shelf Contain Parameters
                //shelfItemLeft: { name:"Shelf Contain: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", order:67 },
                //shelfItemTop: { name:"Shelf Contain: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", order:68 },
                shelfItemRowLevelHorizontalGap: { name:"Shelf Contain: Row Level Horz Spacing", value:"10", description:"Expects a string of numbers, comma-separated, to denote each rows horizontal spacing.", type:"string", order:19 },
                //shelfItemHorizontalGap: { name:"Shelf Contain: Item Horizontal Spacing", value:15, description:"The horizontal spacing of row buttons, in pixels.", type:"number", order: 8 },
                shelfItemVerticalGap: { name:"Shelf Contain: Item Vertical Spacing", value:15, description:"The vertical spacing of row buttons, in pixels.", type:"number", order: 9 },

                // Shelf Parameters
                shelfDispType: { name:"Shelf: Display Type", value:'vector', description:"Shelf background display type.", type:"combo", options:['vector', 'import', 'none'], order: 1 },
                shelfBckgrndImgImport: { name:"Shelf: Background Import Image", value:"", description:"Shelf imported background image.", type:"bitmapdata", order:64 },
                shelfWidth : { name:"Shelf: Width", value:600, description:"Shelf background width, in pixels.", type:"number", min:200, order:30 },
                shelfHeight : { name:"Shelf: Height", value:35, description:"Shelf background height, in pixels.", type:"number", min:5, order:30 },
                shelfLeftRightDepthSkew : { name:"Shelf: Depth Left Right Skew", value:80, description:"Shelf left and right depth angle. A larger number creates a longer depth.", type:"number", min:10, order:30 },
                shelfDepthHeight: { name:"Shelf: Depth Height", value:30, description:"Shelf depth height, in pixels.", type:"number", min:10, order:30 },
                shelfLeft: { name:"Shelf: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", order:67 },
                shelfTop: { name:"Shelf: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", order:68 },
                shelfBckgrndColor : { name:"Shelf: Background Color", value:0xFFBD1A, description:"Vector shelf background color.", type:"colour", order:36 },
                shelfBorderStyle: { name:"Shelf: Border Style", value:"solid", description:"Vector shelf CSS border style.", type:"combo", options:["solid", "dotted", "dashed", "none"], order: 12 },
                shelfBorderColor: { name:"Shelf: Border Color", value:0xA6A8AB, description:"Vector shelf border color.", type:"colour", order: 14 },
                shelfBorderWidth: { name:"Shelf: Border Width", value:2, description:"Vector shelf border width, in pixels.", type:"number", min:0, order: 13 },

                // Item Parameters
                itemViewDisplayPrice: { name:"Item View: Display Price", value:true, description:"If set true, a row price label/image will display.", type:"bool", order:69 },
                itemViewDisplayQty: { name:"Item View: Display Qty", value:true, description:"If set true, a row quantity dropdown will display.", type:"bool", order:69 },
                itemViewAllowZoom: { name:"Item View: Allow Zoom", value:false, description:"If set true, zoom feature will be enabled. If 'itemViewDisplayQty' is true, user must click row image to enable zoom feature. If 'itemViewDisplayQty' is false, zoom button will display.", type:"bool", order:69 },
                itemViewShowBoxShadow: { name:"Item View: Display Box Shadow", value:false, description:"If set true, a box shadow will appear on the row image. Ideal for rectangular shaped images.", type:"bool", order:69 },
                itemViewWidth : { name:"Item View: Width", value:125, description:"Row item width, in pixels.", type:"number", min:5, order:30 },
                itemViewHeight : { name:"Item View: Height", value:150, description:"Row item height, in pixels.", type:"number", min:5, order:30 },
                itemViewHorizontalGap: { name:"Item View: Stack Horizontal Spacing", value:10, description:"Row item copy horizontal spacing, in pixels.", type:"number", order: 8 },
                itemViewStackCnt: { name:"Item View: Stack Count", value:4, description:"Row item image stack count. This dictates how many image copies are placed behind one another.", type:"number", min:1, max:5, order:91 },
                itemViewSelectAlpha: { name:"Item View: Select Opacity", value:25, description:"Row item opacity on button select.", type:"number", min:0, max:100, order:91 },
                itemViewSelectBorderWidth: { name:"Item View: Select Border Width", value:2, description:"Item view selection border width, in pixels.", type:"number", min:0, order: 14 },
                itemViewSelectBorderStyle: { name:"Item View: Select Border Style", value:"solid", description:"Item view selection border CSS style.", type:"combo", options:["solid", "dotted", "dashed", "none"], order: 12 },
                itemViewSelectBorderColor: { name:"Item Price: Select Border Color", value:0xffbd1a, description:"Item view selection border color.", type:"colour", order: 14 },

                // Item Stamp Parameters
                itemViewShowStamp: { name:"Item Stamp: Display", value:false, description:"If set true, imported stamp will display when row item is selected.", type:"bool", order:69 },
                itemViewStamp: { name:"Item Stamp: Import Image", value:"", description:"Imported stamp image to use on item select.", type:"bitmapdata", order:64 },
                itemViewStampWidth: { name:"Item Stamp: Width", value:30, description:"Stamp image width, in pixels.", type:"number", min:5, order:65 },
                itemViewStampHeight: { name:"Item Stamp: Height", value:30, description:"Stamp image height, in pixels.", type:"number", min:5, order:66 },
                itemViewStampLeft: { name:"Item Stamp: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", order:67 },
                itemViewStampTop: { name:"Item Stamp: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", order:68 },

                // Item Price Parameters
                itemViewPriceLeft: { name:"Item Price: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", order:67 },
                itemViewPriceTop: { name:"Item Price: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", order:68 },
                itemViewPriceFontsize: { name:"Item Price: Font Size", value:18, description:"Item price font size, in pixels.", type:"number", min:5, order:65 },
                itemViewPriceColor: { name:"Item Price: Font Color", value:0x5B5F65, description:"Item price font color.", type:"colour", order: 14 },
                itemViewPriceBorderColor: { name:"Item Price: Border Color", value:0x5B5F65, description:"Item price border color.", type:"colour", order: 14 },
                itemViewPriceBorderWidth: { name:"Item Price: Border Width", value:2, description:"Item price border width, in pixels.", type:"number", min:0, order: 14 },

                // Item Qty Parameters
                itemViewQtyText: { name:"Item Qty: Text", value:"Qty:", description:"Row item quantity dropdown text.", type:"string", order:81 },
                itemViewQtyLeft: { name:"Item Qty: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", order:67 },
                itemViewQtyTop: { name:"Item Qty: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", order:68 },

                // Item Zoom Button Parameters
                itemViewZoomBtnText: { name:"Item Zoom Btn: Text", value:"Image Zoom", description:"Zoom button text.", type:"string", order:81 },
                itemViewZoomBtnLeft: { name:"Item Zoom Btn: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", order:67 },
                itemViewZoomBtnTop: { name:"Item Zoom Btn: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", order:68 },
                itemViewZoomBtnFontsize: { name:"Item Zoom Btn: Font Size", value:12, description:"Zoom button font size, in pixels.", type:"number", min:5, order:65 },
                itemViewZoomBtnColor: { name:"Item Zoom Btn: Font Color", value:0x9E9E9E, description:"Zoom button font color.", type:"colour", order: 14 },
                itemViewZoomBtnBorderColor: { name:"Item Zoom Btn: Border Color", value:0xCCCCCC, description:"Zoom button border color.", type:"colour", order: 14 },
                itemViewZoomBtnBorderWidth: { name:"Item Zoom Btn: Border Width", value:2, description:"Zoom button border width, in pixels.", type:"number", min:0, order: 14 },

                // Item Zoom View Parameters
                zoomViewWidth : { name:"Zoom View: Width", value:800, description:"Zoomed view width, in pixels.", type:"number", min:100, order:30 },
                zoomViewHeaderText: { name:"Zoom View: Header Text", value:"click image to close", description:"Zoomed view header text.", type:"string", order:81 },
                zoomViewDescrAlign: { name:"Zoom View: Descr Text Align", value:"left", description:"Zoomed view row description horizontal alignment.", type:"combo", options:["left", "right", "center"], order: 12 },
                zoomViewDescrFontsize: { name:"Zoom View: Descr Font Size", value:16, description:"Zoomed view row description font size, in pixels.", type:"number", min:5, order:65 },
                zoomViewDescrColor: { name:"Zoom View: Descr Font Color", value:0x5B5F65, description:"Zoomed view row description font color", type:"colour", order: 14 },

                // Item Remain Container Parameters
                itemRemainText: { name:"Item Remain: Text", value:"Item Remaining:", description:"'Item Remain' text.", type:"string", order:81 },
                itemRemainFontsize: { name:"Item Remain: Font Size", value:16, description:"'Item Remain' text font size, in pixels.", type:"number", min:5, order:65 },
                itemRemainLeft: { name:"Item Remain: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", order:67 },
                itemRemainTop: { name:"Item Remain: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", order:68 },

                // Cart View Parameters
                cartViewDisplay: { name:"Cart View: Display", value:true, description:"If set true, a 'View Cart' button will display which when clicked will display a cart breakdown.", type:"bool", order:69 },
                cartViewDisplayPrice: { name:"Cart View: Display Price", value:true, description:"If set true, row price will display on the cart breakdown.", type:"bool", order:69 },
                cartViewDisplayQty: { name:"Cart View: Display Qty", value:true, description:"If set true, row quantity dropdown will display on the cart breakdown.", type:"bool", order:69 },
                cartViewTotPrecision : { name:"Cart View: Total Value Precision", value:2, description:"Cart breakdown total value currency precision.", type:"number", min:0, order:30 },
                cartViewHeaderText: { name:"Cart View: Header Text", value:"Shopping Cart", description:"Cart breakdown header text.", type:"string", order:81 },
                cartViewQtyText: { name:"Cart View: Quantity Text", value:"Qty:", description:"Cart breakdown quantity text.", type:"string", order:81 },
                cartViewRemoveBtnText: { name:"Cart View: Remove Button Text", value:"Remove", description:"Cart breakdown 'Remove' button text.", type:"string", order:81 },
                cartViewItemTotalText: { name:"Cart View: Item Total Text", value:"Item Total: ", description:"Cart breakdown 'Item Total' text.", type:"string", order:81 },
                cartViewTotalText: { name:"Cart View: Total Text", value:"Total: ", description:"Cart breakdown 'Total' text.", type:"string", order:81 },
                cartViewBackBtnText: { name:"Cart View: Back Button Text", value:"Continue Shopping", description:"Cart breakdown 'Back' button text.", type:"string", order:81 },
                cartViewNextBtnText: { name:"Cart View: Next Button Text", value:"Checkout", description:"Cart breakdown 'Next' button text.", type:"string", order:81 },
                cartViewItemContainMaxHeight : { name:"Cart View: Item Container MaxHeight", value:400, description:"Cart breakdown row item container maximum height, in pixels.", type:"number", min:100, order:30 },
                cartViewLeft: { name:"Cart View: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", order:67 },
                cartViewTop: { name:"Cart View: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", order:68 },
                cartViewLabelFontsize: { name:"Cart View: Label Font Size", value:18, description:"Cart breakdown row label font size, in pixels.", type:"number", min:5, order:65 },
                cartViewPriceFontsize: { name:"Cart View: Price Font Size", value:18, description:"Cart breakdown row price font size, in pixels.", type:"number", min:5, order:65 },
                cartViewLabelColor: { name:"Cart View: Label Font Color", value:0x5B5F65, description:"Cart breakdown row label font color.", type:"colour", order: 14 },
                cartViewPriceColor: { name:"Cart View: Price Font Color", value:0xFF9100, description:"Cart breakdown row price font color.", type:"colour", order: 14 },

                // Cart Button Parameters
                cartViewBtnText: { name:"Cart Btn: Text", value:"View Cart", description:"'View Cart' button text.", type:"string", order:81 },
                cartViewBtnLeft: { name:"Cart Btn: Left CSS Pos", value:0, description:"Left CSS offset position, in pixels.", type:"number", order:67 },
                cartViewBtnTop: { name:"Cart Btn: Top CSS Pos", value:0, description:"Top CSS offset position, in pixels.", type:"number", order:68 }
            };
        },

        isMandatory: function() {
            if (this.qStudioVar.isDC && this.qStudioVar.dcProxy) {
                return !!this.qStudioVar.params.compIsMandatory.value;
            }

            return false;
        },

        // returns either 'soft', 'hard' or 'none' to indicate question capping type
        getCapType : function() {
            var qtype = this.qStudioVar.params.compQuestionType.value.toLowerCase(),
                capvalue = this.qStudioVar.params.compCapValueQtyMax.value,
                captype = "none";

            if (qtype.indexOf('soft') !== -1 && (capvalue > 1)) { captype = "soft"; }
            if (qtype.indexOf('hard') !== -1 && (capvalue > 1)) { captype = "hard"; }
            return captype;
        },

        bindExitCallback : function(value) {
            if (value && typeof value === "function") {
                this.qStudioVar.respRef.exitCallback = value;
            }
        },

        setParams : function(value, setDefaults) {
            setDefaults = (typeof setDefaults === "boolean" && setDefaults) ? true : false;
            for (var key in value) {
                if (this._configMap.hasOwnProperty(key)) {
                    var type = this._configMap[key].type,
                        options = this._configMap[key].options,
                        min = this._configMap[key].min,
                        userValue = (!setDefaults) ? value[key] : value[key].value;

                    switch (type) {
                        case "number" :
                            if (QUtility.isNumber(userValue)) {
                                if (QUtility.isNumber(min)) {
                                    if (userValue >= min) { this._params[key] = userValue; }
                                } else {
                                    this._params[key] = userValue;
                                }
                            }
                            break;
                        case "boolean" :
                            if (typeof userValue === "boolean") { this._params[key] = userValue; }
                            break;
                        case "string" :
                            if (QUtility.isString(userValue)) {
                                if (!options) {
                                    this._params[key] = jQuery.trim(userValue);
                                } else {
                                    for (var i = 0, len = options.length; i<len; i+=1) {
                                        if (jQuery.trim(options[i]).toLowerCase() === jQuery.trim(userValue).toLowerCase()) {
                                            this._params[key] = jQuery.trim(options[i]);
                                            break;
                                        }
                                    }
                                }
                            }
                            break;                        case "color" :
                        if (QUtility.paramToHex(userValue)) { this._params[key] = QUtility.paramToHex(userValue); }
                        break;
                        default :
                            break;
                    }
                }
            }
        },

        create: function(parent) {
            // Create response object to record component data
            this.qStudioVar.respRef = {
                timeDict : {},
                mandMet : false,
                shelfContain : undefined,
                itemViewArry : [],
                selectArray : []
            };

            // Auto-set compRTL parameter based on Survey Platform RTL settings
            if (QUtility.isSurveyRTL()) { this.qStudioVar.params.compRTL.value = true; }

            // Disable RTL in QStudio Component Creation Window due to positioning issues
            this.qStudioVar.isCompRTL = (!(parent && parent.id === "componentDemoContainer")) ? this.qStudioVar.params.compRTL.value : false;

            parent = (parent && parent.nodeType === 1) ? parent : document.body;
            var doc = document,
                that = this,
                respRef = this.qStudioVar.respRef,
                params = this.qStudioVar.params,
                shelfContain = doc.createElement("div"),
                compContain = doc.createElement("div"),
                cartBtnContain = doc.createElement("div"),
                cartIcon = doc.createElement("div"),
                cartLabel = doc.createElement("label"),
                cartModule = undefined,
                popoutModule = undefined,
                itemRemain = doc.createElement("label"),
                rowArrayConfig = [],
                i = 0, rLen = this.qStudioVar.rowArray.length,
                itemCnt = 0,
                cartLabelWidth = 0,
                cartLabelHeight = 0,
                isTouchDevice = QUtility.isTouchDevice(),
                isMSTouch = QUtility.isMSTouch(),
                eventClick = (!isMSTouch) ?
                    ((!isTouchDevice) ? "click.virtualshelf" : "touchstart.virtualshelf touchend.virtualshelf touchmove.virtualshelf"):
                    ((!isTouchDevice) ? "click.virtualshelf" : ((window.PointerEvent) ? "pointerdown.virtualshelf pointerup.virtualshelf" : "MSPointerDown.virtualshelf MSPointerUp.virtualshelf")),
                isTouchMove = false,
                cartBtnHeight = 40,
                cartBtnHasLabel = false,
                cartIconURL = "http://d2uw97zw06mzi0.cloudfront.net/assets/image/cart.png",
                ie8Int = undefined;

            // for QStudio we hide the next button
            if (this.isMandatory()) { this.qStudioVar.dcProxy.hideNextButton(); }

            // compContain CSS
            compContain.id = "VirtualShelfComponent";
            compContain.dir = (!this.qStudioVar.isCompRTL) ? 'ltr' :'rtl';
            compContain.className = "qvirtualshelf_component";
            compContain.style.position = "relative";
            compContain.style.width = "100%";
            compContain.style.height = "100%";
            parent = (parent && parent.nodeType === 1) ? parent : doc.body;
            parent.appendChild(compContain);
            respRef.compContain = compContain;

            // shelfContain CSS
            shelfContain.className = "qvs_shelf_container";
            shelfContain.style.position = "relative";
            shelfContain.style.width = params.shelfWidth.value + "px";
            shelfContain.style.height = "auto";
            compContain.appendChild(shelfContain);
            respRef.shelfContain = shelfContain;

            // Init Preloader
            respRef.preloader = new QPreloader();
            respRef.preloader.initModule(compContain);
            respRef.preloader.getLoader().style[(!this.qStudioVar.isCompRTL) ? 'left' :'right'] = (params.shelfWidth.value - 103)*0.5 + "px";
            respRef.preloader.getLoader().style.top = 50 + "px";

            // Init row object properties to pass to Item View
            for (i = 0; i < rLen; i += 1) {
                var rowArray_i = this.qStudioVar.rowArray[i],
                    price = "",
                    item_count = 1,
                    width = params.itemViewWidth.value,
                    height = params.itemViewHeight.value;

                // QStudio will have property price_count, whereas Dimensions Decipher can use price and item_count properties
                if (typeof rowArray_i.price_count === "string") {
                    rowArray_i.price_count = jQuery.trim(rowArray_i.price_count);
                    var priceCntSplit = rowArray_i.price_count.split("|");
                    if (jQuery.trim(priceCntSplit[0]).length > 0) { price = jQuery.trim(priceCntSplit[0]); }
                    if (jQuery.trim(priceCntSplit[1]) > 1) { item_count = jQuery.trim(priceCntSplit[1]); }
                }

                if (rowArray_i.price && rowArray_i.price.toString().length > 0) {
                    price = rowArray_i.price.toString();
                }

                if (rowArray_i.item_count && parseInt(rowArray_i.item_count, 10) >= 1) {
                    item_count = parseInt(rowArray_i.item_count, 10);
                }

                // QStudio will have property width_height, whereas Dimensions Decipher can use width and height properties
                if (typeof rowArray_i.width_height === "string") {
                    rowArray_i.width_height = jQuery.trim(rowArray_i.width_height);
                    var widthHeightSplit = rowArray_i.width_height.split("|");
                    if (jQuery.trim(widthHeightSplit[0]) >= 5) { width = parseInt(jQuery.trim(widthHeightSplit[0]), 10); }
                    if (jQuery.trim(widthHeightSplit[1]) >= 5) { height = parseInt(jQuery.trim(widthHeightSplit[1]), 10); }
                }

                if (rowArray_i.width && parseInt(rowArray_i.width, 10) >= 5) {
                    width = parseInt(rowArray_i.width, 10);
                }

                if (rowArray_i.height && parseInt(rowArray_i.height, 10) >= 5) {
                    height = parseInt(rowArray_i.height, 10);
                }

                // row object configuration
                rowArrayConfig.push({
                    id : rowArray_i.id,
                    isRTL : this.qStudioVar.isCompRTL,
                    primary_font_family : params.compPrimFontFamily.value,
                    index : i,
                    label : rowArray_i.label,
                    price : price,
                    description : rowArray_i.description,
                    image : rowArray_i.image,
                    price_image : rowArray_i.price_image,
                    display_price : params.itemViewDisplayPrice.value,
                    display_qty : params.itemViewDisplayQty.value,
                    allow_zoom : params.itemViewAllowZoom.value,
                    price_top : params.itemViewPriceTop.value,
                    price_left : params.itemViewPriceLeft.value,
                    price_border_color : params.itemViewPriceBorderColor.value,
                    price_border_width : params.itemViewPriceBorderWidth.value,
                    price_color : params.itemViewPriceColor.value,
                    price_fontsize : params.itemViewPriceFontsize.value,
                    qty_text : params.itemViewQtyText.value,
                    qty_limit : params.compCapValueQtyMax.value,
                    qty_top : params.itemViewQtyTop.value,
                    qty_left : params.itemViewQtyLeft.value,
                    zoom_text : params.itemViewZoomBtnText.value,
                    zoom_left : params.itemViewZoomBtnLeft.value,
                    zoom_top : params.itemViewZoomBtnTop.value,
                    zoom_border_color : params.itemViewZoomBtnBorderColor.value,
                    zoom_border_width : params.itemViewZoomBtnBorderWidth.value,
                    zoom_color : params.itemViewZoomBtnColor.value,
                    zoom_fontsize : params.itemViewZoomBtnFontsize.value,
                    stamp_show : params.itemViewShowStamp.value,
                    stamp : params.itemViewStamp.value,
                    stamp_width : params.itemViewStampWidth.value,
                    stamp_height : params.itemViewStampHeight.value,
                    stamp_top : params.itemViewStampTop.value,
                    stamp_left : params.itemViewStampLeft.value,
                    width : width,
                    height : height,
                    item_count : item_count,
                    item_stack_count : params.itemViewStackCnt.value,
                    item_gap : params.itemViewHorizontalGap.value,
                    select_alpha : params.itemViewSelectAlpha.value,
                    box_shadow_show : params.itemViewShowBoxShadow.value,
                    select_border_width : params.itemViewSelectBorderWidth.value,
                    select_border_style : params.itemViewSelectBorderStyle.value,
                    select_border_color : params.itemViewSelectBorderColor.value,
                    load_callback : function(itemView) {
                        itemCnt += 1;
                        if (itemCnt === rLen) {
                            // at this point all items have been created so we can now create the shelf
                            if (respRef.itemViewArry.length !== rLen) {
                                ie8Int = setInterval(function() {
                                    if (respRef.itemViewArry.length === rLen) {
                                        clearInterval(ie8Int);
                                        that.__createShelf();
                                        itemCnt = null;
                                    }
                                }, 20);
                            } else {
                                // at this point all items have been created so we can now create the shelf
                                that.__createShelf();
                                itemCnt = null;
                            }
                        }
                    },
                    dropdown_change_callback: function (itemView) {
                        that.manageChange(itemView);
                    },
                    dropdown_click_callback : function() {
                        if (that.getCapType() !== "none") {
                            // pass true to indicate we want to return the total quantity remaining value
                            return that.__getTotalRowQty(true);
                        }
                    },
                    zoombtn_callback: function (itemView) {
                        if (popoutModule) { popoutModule.show(itemView); }
                    }
                });
            }

            // create shelf item views
            for (i = 0; i < rLen; i+=1) {
                var itemView = new QVirtualShelfItem(compContain, rowArrayConfig[i]);
                itemView.item().setAttribute("rowIndex", i.toString());
                itemView.item().style.display = "none";
                respRef.itemViewArry.push(itemView);
            }

            // init popout zoom module
            if (params.itemViewAllowZoom.value) {
                popoutModule = new QVirtualShelfPopout(doc.body, {
                    isRTL : this.qStudioVar.isCompRTL,
                    primary_font_family : params.compPrimFontFamily.value,
                    header_text : params.zoomViewHeaderText.value,
                    width : params.zoomViewWidth.value,
                    descr_align : params.zoomViewDescrAlign.value,
                    descr_fontsize : params.zoomViewDescrFontsize.value,
                    descr_color : "#" + QUtility.paramToHex(params.zoomViewDescrColor.value)
                });
            }

            // itemRemain CSS
            if (this.getCapType() !== "none") {
                itemRemain.dir = (!this.qStudioVar.isCompRTL) ? 'LTR' :'RTL';
                itemRemain.className = "qvs_item_remain_container";
                itemRemain.style.position = "absolute";
                itemRemain.style[(!this.qStudioVar.isCompRTL) ? "left" : "right"] = params.itemRemainLeft.value + "px";
                itemRemain.style.top = params.itemRemainTop.value + "px";
                itemRemain.style.width = "auto";
                itemRemain.style.height = "auto";
                itemRemain.style.padding = "5px";
                itemRemain.style.fontSize = QUtility.convertPxtoEM(params.itemRemainFontsize.value) + "em";
                itemRemain.style.fontFamily = params.compPrimFontFamily.value;
                itemRemain.style.borderBottom = "2px solid #CCC";
                itemRemain.style.zIndex = 3998;
                $(itemRemain).text(params.itemRemainText.value + " " + params.compCapValueQtyMax.value);
                compContain.insertBefore(itemRemain, compContain.firstChild);
                respRef.itemRemain = itemRemain;
            }

            // init cart module and cart button
            if (params.cartViewDisplay.value) {
                // init cart module
                cartModule = new QVirtualShelfCart(compContain, {
                    isRTL: that.qStudioVar.isCompRTL,
                    cap_value : (that.getCapType() === "hard") ? params.compCapValueQtyMax.value : null,
                    primary_font_family: params.compPrimFontFamily.value,
                    total_precision: params.cartViewTotPrecision.value,
                    header_text: params.cartViewHeaderText.value,
                    qty_text : params.cartViewQtyText.value,
                    removebtn_text : params.cartViewRemoveBtnText.value,
                    total_text: params.cartViewTotalText.value,
                    item_text: params.cartViewItemTotalText.value,
                    backbtn_text: params.cartViewBackBtnText.value,
                    nextbtn_text: params.cartViewNextBtnText.value,
                    display_price : params.cartViewDisplayPrice.value,
                    display_qty : params.cartViewDisplayQty.value,
                    qty_limit : params.compCapValueQtyMax.value,
                    width: params.shelfWidth.value,
                    height: params.cartViewItemContainMaxHeight.value,
                    top: params.cartViewTop.value,
                    left: params.cartViewLeft.value,
                    padding: 10,
                    header_fontsize: params.cartViewLabelFontsize.value,
                    header_fontcolor: "#" + QUtility.paramToHex(params.cartViewLabelColor.value),
                    label_fontsize: params.cartViewLabelFontsize.value,
                    label_fontcolor: "#" + QUtility.paramToHex(params.cartViewLabelColor.value),
                    price_fontsize: params.cartViewPriceFontsize.value,
                    price_fontcolor: "#" + QUtility.paramToHex(params.cartViewPriceColor.value),
                    total_fontsize: params.cartViewLabelFontsize.value,
                    total_fontcolor: "#" + QUtility.paramToHex(params.cartViewLabelColor.value),
                    itemViewArry: respRef.itemViewArry,
                    back_callback: function () {
                        cartBtnContain.style.display = "block";
                        shelfContain.style.display = "block";
                        itemRemain.style.display = "block";
                    },
                    next_callback: function () {
                        if (that.qStudioVar.isDC && that.qStudioVar.dcProxy) {
                            that.qStudioVar.dcProxy.next();
                        } else {
                            // fire exit callback
                            if (respRef.exitCallback) { respRef.exitCallback(); }
                        }
                    },
                    remove_callback: function (itemView) {
                        (!params.itemViewDisplayQty.value) ?
                            that.manageClick(itemView) : that.manageChange(itemView);
                    },
                    dropdown_change_callback: function (rowIndex, qty) {
                        //that.manageChange(itemView);
                        that.sendQty(rowIndex, qty);
                    },
                    dropdown_click_callback : function() {
                        if (that.getCapType() !== "none") {
                            // pass true to indicate we want to return the total quantity remaining value
                            return that.__getTotalRowQty(true);
                        }
                    }
                });

                // append cart children
                cartBtnContain.appendChild(cartIcon);
                cartBtnContain.appendChild(cartLabel);
                compContain.insertBefore(cartBtnContain, compContain.firstChild);

                // cartLabel CSS
                cartLabel.dir = (!this.qStudioVar.isCompRTL) ? 'LTR' :'RTL';
                cartLabel.style.cssText += ';'.concat("-webkit-box-sizing: border-box");
                cartLabel.style.cssText += ';'.concat("-moz-box-sizing: border-box");
                cartLabel.style.cssText += ';'.concat("box-sizing: border-box");
                cartLabel.style.position = "relative";
                cartLabel.style.display = "inline-block";
                cartLabel.style.verticalAlign = "top";
                cartLabel.style.visibility = "hidden";
                cartLabel.style.fontSize = QUtility.convertPxtoEM(15) + "em";
                cartLabel.style.fontFamily = params.compPrimFontFamily.value;
                cartLabel.style.width = "auto";
                cartLabel.style.height = cartBtnHeight + "px";
                cartLabel.style.padding = 10 + "px";
                cartLabel.style.whiteSpace = "nowrap";
                cartLabel.style.textAlign = "center";
                cartLabel.style.cursor = "inherit";
                $(cartLabel).html(params.cartViewBtnText.value);
                doc.body.appendChild(cartLabel);
                if ($(cartLabel).width() > 0) {
                    cartBtnHasLabel = true;
                    cartLabelWidth = $(cartLabel).outerWidth();
                    cartLabelHeight = $(cartLabel).outerHeight();
                    cartLabel.style.width = cartLabelWidth + "px";
                    cartLabel.style.height = cartLabelHeight + "px";
                    cartBtnContain.appendChild(cartLabel);
                    cartLabel.style.visibility = "";
                }

                // cartBtnContain CSS
                cartBtnContain.className = "qvs_cart_button";
                cartBtnContain.style.position = "relative";
                cartBtnContain.style.marginBottom = "20px";
                cartBtnContain.style[(!this.qStudioVar.isCompRTL) ? 'left' :'right'] = (params.shelfWidth.value - (cartLabelWidth + 44) + params.cartViewBtnLeft.value) + "px";
                cartBtnContain.style.top = params.cartViewBtnTop.value + "px";
                cartBtnContain.style.width = (cartLabelWidth + 40) + "px";
                cartBtnContain.style.height = cartBtnHeight + "px";
                cartBtnContain.style.border = "2px solid #CCC";
                cartBtnContain.style.cursor = "default";
                cartBtnContain.style.zIndex = 3999;
                cartBtnContain.style.backgroundColor = "#FFFFFF";
                $(cartBtnContain).css({ opacity : 0.5 });
                respRef.cartBtnContain = cartBtnContain;

                // cartIcon CSS
                $(cartIcon).css( {
                    'box-sizing' : 'border-box',
                    'padding' : "2px",
                    'position' : "relative",
                    'display' : "inline-block",
                    'vertical-align' : "top",
                    'background-color' : "#e0e0d1",
                    'width' : 40 + "px",
                    'height' : cartBtnHeight + "px",
                    'border-right' : (cartBtnHasLabel) ? "2px solid #CCC" : "",
                    'background-repeat': 'no-repeat',
                    'background-size': 40 + 'px ' + cartBtnHeight + 'px',
                    'background-position': 'center',
                    'background-image': (QUtility.ieVersion() < 9) ?
                        "url(" + "" + ") " + 'url(' + cartIconURL + ')' : 'url(' + cartIconURL + ')',
                    'filter': "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + cartIconURL + ", sizingMethod='scale')"
                });

                // cart button click event
                $(cartBtnContain).on(eventClick, function (event) {
                    if (!respRef.selectArray.length) { return; }
                    if (event.type !== "touchmove") {
                        if (event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                            if (!isTouchMove) {
                                cartBtnContain.style.display = "none";
                                shelfContain.style.display = "none";
                                itemRemain.style.display = "none";
                                cartModule.show();
                            }
                        } else {
                            isTouchMove = false;
                        }
                    } else {
                        isTouchMove = true;
                    }
                });
            }

            // shelf item mouseover event
            /*if (!isTouchDevice) {
             // Init mouseenter/mouseleave event handlers
             $(shelfContain).on("mouseenter.qvirtualshop mouseleave.qvirtualshop", ".qvs_item_view", function(event) {
             var itemView = respRef.itemViewArry[parseInt(event.currentTarget.getAttribute("rowIndex"), 10)];
             itemView.toggleMouseOver(event.type === "mouseenter");
             });
             }*/

            // shelf item click event
            $(shelfContain).on(eventClick, ((!params.itemViewDisplayQty.value) ? ".qvs_item_view" : "qvs_item_product_container"), function(event) {
                if (event.type !== "touchmove") {
                    if (event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                        if (!isTouchMove) {
                            var evtCurTarget = (!params.itemViewDisplayQty.value) ? event.currentTarget : event.currentTarge.parentNode;
                            that.manageClick(respRef.itemViewArry[parseInt(evtCurTarget.getAttribute("rowIndex"), 10)]);
                        }
                    } else {
                        isTouchMove = false;
                    }
                } else {
                    isTouchMove = true;
                }
            });
        },

        __createShelf : function() {
            var respRef = this.qStudioVar.respRef,
                params = this.qStudioVar.params,
                i = 0, rLen = respRef.itemViewArry.length,
                edgeOffset = 8,
                xPos = edgeOffset,
                yPos = 0,
                maxChildHeight = 0,
                numOfShelves = 0,
                itemWidth = 0,
                itemHeight = 0,
                endOfRowWidth = 0,
                endOfRowHeight = 0,
                itemOffset = 10,
                horzGapArray = params.shelfItemRowLevelHorizontalGap.value.split(","),
                rowHorzGapDefault = QUtility.isNumber(horzGapArray[horzGapArray.length - 1]) ? parseInt(jQuery.trim(horzGapArray[horzGapArray.length - 1]), 10) : 10,
                rowHorzGap = QUtility.isNumber(horzGapArray[0]) ? parseInt(jQuery.trim(horzGapArray[0]), 10) : rowHorzGapDefault,
                surveyScale = QUtility.getQStudioSurveyScale();

            // remove preloader
            respRef.preloader.destroy();
            delete respRef.preloader;

            // add row items to shelves
            respRef.shelfContain.appendChild(this.__createShelfRow());
            for (i = 0; i < rLen; i += 1) {
                var itemView = respRef.itemViewArry[i];
                itemWidth = $(itemView.item()).outerWidth();
                itemHeight = $(itemView.item()).outerHeight();

                // Calculate item position
                if((endOfRowWidth + itemWidth) >= params.shelfWidth.value && xPos !== edgeOffset) {
                    xPos = edgeOffset;
                    yPos += endOfRowHeight + params.shelfItemVerticalGap.value;
                    maxChildHeight = 0;
                    numOfShelves += 1;
                    respRef.shelfContain.appendChild(this.__createShelfRow());
                    respRef.shelfContain.children[numOfShelves].style.top = yPos + "px";
                    rowHorzGap = QUtility.isNumber(horzGapArray[numOfShelves]) ? parseInt(jQuery.trim(horzGapArray[numOfShelves]), 10) : rowHorzGapDefault;
                }

                // Set Item CSS position
                itemView.item().style.position = "absolute";
                itemView.item().style.left = xPos + "px";
                itemView.item().style.bottom = "0px";
                itemView.item().style.display = "";

                // Update position vars
                xPos += (itemWidth + rowHorzGap);
                maxChildHeight = Math.max(maxChildHeight, itemHeight);
                endOfRowWidth = xPos + rowHorzGap;
                endOfRowHeight = (maxChildHeight + $(respRef.shelfContain.children[numOfShelves].children[1]).outerHeight());
                respRef.shelfContain.children[numOfShelves].firstChild.appendChild(itemView.item());
                respRef.shelfContain.children[numOfShelves].firstChild.style.width = endOfRowWidth + "px";
                respRef.shelfContain.children[numOfShelves].firstChild.style.height = maxChildHeight + "px";
                respRef.shelfContain.children[numOfShelves].style.width = params.shelfWidth.value + "px";
                respRef.shelfContain.children[numOfShelves].style.height = endOfRowHeight + "px";
                respRef.shelfContain.style.height = (yPos + endOfRowHeight) + "px";
                // horizontally center shelf items by default
                respRef.shelfContain.children[numOfShelves].firstChild.style.left =
                    ((params.shelfWidth.value - xPos - edgeOffset)*0.5) + "px";
            }

            // set product item stack offsets to give it perspective
            // the offset in the center of the shelf is 0 with it being +itemOffset to the left and -itemOffset to the right
            for (i = 0; i < rLen; i += 1) {
                var itemView = respRef.itemViewArry[i],
                    productContain = itemView.productContain();

                for (var stack = productContain.firstChild; stack; stack = stack.nextSibling) {
                    var baseValue = ($(stack).offset().left - $(respRef.shelfContain).offset().left)*(1/surveyScale.a) / this.qStudioVar.params.shelfWidth.value,
                        prevLeft = 0;

                    for (var j = stack.children.length - 1; j >= 0; j -= 1) {
                        if (j === stack.children.length - 1) {
                            stack.children[j].style.zIndex = i + 101;
                            continue;
                        }

                        var stackOffset = parseFloat(baseValue * (itemOffset - (-itemOffset)) + (-itemOffset))*-1;
                        stack.children[j].style.left = (prevLeft + stackOffset) + "px";
                        prevLeft += stackOffset;
                    }
                }
            }

            // init select timer
            respRef.selectTime = 0;
            respRef.selectTimer = setInterval(function() {
                respRef.selectTime += 20;
            }, 20);

            // bckgrndImg CSS
            if (params.bckgrndImgDisplay.value) {
                var bckgrndImg = document.createElement("div");
                bckgrndImg.className = "qvirtualshelf_shelf_background_image";
                $(bckgrndImg).css( {
                    'position' : 'absolute',
                    'top' : params.bckgrndImgTop.value + "px",
                    'left' : params.bckgrndImgLeft.value + "px",
                    'width' : params.bckgrndImgWidth.value + "px",
                    'height' : params.bckgrndImgHeight.value + "px", //$(respRef.shelfContain).outerHeight() + "px",
                    'background-repeat' : 'no-repeat',
                    'background-size' : params.bckgrndImgWidth.value + "px " + params.bckgrndImgHeight.value + "px", //$(respRef.shelfContain).outerHeight() + "px",
                    'background-position' : 'center',
                    'background-image' : (QUtility.ieVersion() < 9) ?
                        'url(' + params.bckgrndImgImport.value + ')' : 'url(' + params.bckgrndImgImport.value + ')',
                    'filter' : "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + params.bckgrndImgImport.value + ",sizingMethod='scale')"
                });

                respRef.shelfContain.insertBefore(bckgrndImg, respRef.shelfContain.firstChild);
                respRef.shelfContain.style.width = Math.max($(respRef.shelfContain).width(), params.bckgrndImgWidth.value + params.bckgrndImgLeft.value) + "px";
                respRef.shelfContain.style.height = Math.max($(respRef.shelfContain).height(), params.bckgrndImgHeight.value + params.bckgrndImgTop.value) + "px";
            }
        },

        __createShelfRow : function() {
            var params = this.qStudioVar.params,
                shelfDispType = params.shelfDispType.value.toLowerCase(),
                doc = document,
                rowContain = doc.createElement("div"),
                rowItemContain = doc.createElement("div"),
                rowShelfImg = doc.createElement("div");

            // rowContain CSS
            rowContain.dir = "LTR";
            rowContain.className = "qvirtualshelf_row_container";
            rowContain.style.position = "absolute";
            //rowContain.style.marginLeft = params.shelfItemLeft.value + "px";
            //rowContain.style.marginTop = params.shelfItemTop.value + "px";

            // rowItemContain CSS
            rowItemContain.className = "qvirtualshelf_row_item_container";
            rowItemContain.style.zIndex = 100;
            rowItemContain.style.position = "relative";
            rowItemContain.style.bottom = 0;
            rowContain.appendChild(rowItemContain);

            // rowShelfImg CSS
            rowShelfImg.className = "qvirtualshelf_row_shelf_image";
            rowShelfImg.style.zIndex = 10;
            rowShelfImg.style.position = "relative";
            rowShelfImg.style.left = params.shelfLeft.value + "px";
            rowShelfImg.style.top = params.shelfTop.value + "px";
            rowShelfImg.style.filter = "inherit";
            rowShelfImg.style.width = params.shelfWidth.value + "px";
            rowShelfImg.style.height = params.shelfHeight.value + "px";
            rowShelfImg.style.border = params.shelfBorderWidth.value + "px " + params.shelfBorderStyle.value + " #" + QUtility.paramToHex(params.shelfBorderColor.value);
            rowShelfImg.style.cssText += ';'.concat("-webkit-box-sizing: border-box");
            rowShelfImg.style.cssText += ';'.concat("-moz-box-sizing: border-box");
            rowShelfImg.style.cssText += ';'.concat("box-sizing: border-box");
            rowContain.appendChild(rowShelfImg);

            // hide shelf image
            if (shelfDispType === "none") {
                rowShelfImg.style.backgroundColor = "transparent";
                rowShelfImg.style.borderColor = "transparent";
            }

            // display shelf image; either color or import
            else {
                if (shelfDispType === "import") {
                    $(rowShelfImg).css( {
                        'background-repeat': 'no-repeat',
                        'background-size': params.shelfWidth.value + 'px ' + params.shelfHeight.value + 'px',
                        'background-position': 'center',
                        'background-image': (QUtility.ieVersion() < 9) ?
                            "url(" + "" + ") " + 'url(' + params.shelfBckgrndImgImport.value + ')' : 'url(' + params.shelfBckgrndImgImport.value + ')',
                        'filter': "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + params.shelfBckgrndImgImport.value + ", sizingMethod='scale')"
                    });

                } else {
                    rowShelfImg.style.backgroundColor = "#" + QUtility.paramToHex(params.shelfBckgrndColor.value);

                    // create div and style w/ css to give shelf depth
                    var shelfDepth = doc.createElement("div");
                    shelfDepth.style.position = "relative";
                    shelfDepth.style.width = params.shelfWidth.value + "px";
                    shelfDepth.style.height = 0 + "px";
                    shelfDepth.style.marginLeft = -params.shelfBorderWidth.value + "px";
                    shelfDepth.style.marginTop = (-params.shelfDepthHeight.value - params.shelfBorderWidth.value) + "px";
                    shelfDepth.style.borderLeft = params.shelfLeftRightDepthSkew.value + "px solid transparent";
                    shelfDepth.style.borderRight = params.shelfLeftRightDepthSkew.value + "px solid transparent";
                    shelfDepth.style.borderBottom = params.shelfDepthHeight.value + "px solid #CCC";
                    shelfDepth.style.cssText += ';'.concat("-webkit-box-sizing: border-box");
                    shelfDepth.style.cssText += ';'.concat("-moz-box-sizing: border-box");
                    shelfDepth.style.cssText += ';'.concat("box-sizing: border-box");
                    rowShelfImg.appendChild(shelfDepth);
                }
            }

            return rowContain;
        },

        __getTotalRowQty : function(getRemain) {
            var params = this.qStudioVar.params,
                selectArray = this.qStudioVar.respRef.selectArray,
                i = 0, sLen = selectArray.length,
                totalQty = 0;

            for (i; i < sLen; i += 1) {
                var itemView = selectArray[i];
                totalQty += itemView.qtyDropdown().selectedIndex;
            }

            return (typeof getRemain === "boolean" && getRemain) ? (params.compCapValueQtyMax.value - totalQty) : totalQty;
        },

        // for row item click
        manageClick : function(itemView) {
            var that = this,
                questionType = this.questionType(),
                respRef = this.qStudioVar.respRef,
                params = this.qStudioVar.params,
                totalQtyRemain = this.__getTotalRowQty(true),
                rowIndex = parseInt(itemView.item().getAttribute("rowIndex"), 10),
                itemIndex = jQuery.inArray(itemView, respRef.selectArray),
                itemSelectedIndex = itemView.qtyDropdown().selectedIndex;

            // send response helper function
            var sendMultiHelper = function() {
                // QStudio DC Response
                that.sendResponse(rowIndex, itemView.isAnswered());

                // QStudio DC Time
                clearInterval(respRef.selectTimer);
                that.sendTime(rowIndex, itemView.isAnswered() ? respRef.selectTime : "");

                // reset select timer
                respRef.selectTime = 0;
                respRef.selectTimer = setInterval(function() {
                    respRef.selectTime += 20;
                }, 20);
            };

            // adjust totalQtyRemain if itemView is answered
            if (itemView.isAnswered()) { totalQtyRemain += itemSelectedIndex; }

            // create capping condition
            var capCond = (((params.compCapValueQtyMax.value > 1) && (this.getCapType() !== "none")) ? (totalQtyRemain > 0) : true);

            // return if item quantity is 0
            if (itemSelectedIndex === 0) { return; }

            // Multi Choice response
            if (questionType === "multi") {
                // set itemView isAnswered
                itemView.isAnswered(!itemView.isAnswered());
                if (itemView.isAnswered()) {
                    if (!capCond) {
                        itemView.isAnswered(false);
                        return;
                    }

                    if (itemIndex === -1) {
                        // add to array
                        respRef.selectArray.push(itemView);
                        sendMultiHelper();
                    }
                } else {
                    if (itemIndex !== -1) {
                        // splice from array
                        respRef.selectArray.splice(itemIndex, 1);
                        sendMultiHelper();
                    }
                }

                // QStudio DC Qty; we always send quantity response regardless
                this.sendQty(rowIndex, itemView.isAnswered() ? itemSelectedIndex : "");
            }

            // Single Choice response
            else {
                var curSelect = respRef.selectArray[0],
                    curSelectRowIndex = (curSelect) ? (parseInt(curSelect.item().getAttribute("rowIndex"), 10)) : -1;

                // set itemView isAnswered
                itemView.isAnswered(!itemView.isAnswered());
                if (curSelect !== itemView) {
                    if (curSelect) {
                        // set curSelect isAnswered
                        curSelect.isAnswered(false);

                        // clear selectArray
                        respRef.selectArray = [];

                        // QStudio DC Response
                        this.sendResponse(curSelectRowIndex, false, true);

                        // QStudio DC Time
                        this.sendTime(curSelectRowIndex, "");

                        // QStudio DC Qty
                        this.sendQty(curSelectRowIndex, "", true);
                    }

                    respRef.selectArray.push(itemView);

                    // QStudio DC Response
                    this.sendResponse(rowIndex, true);

                    // QStudio DC Qty
                    this.sendQty(rowIndex, itemSelectedIndex);

                    // QStudio DC Time
                    clearInterval(respRef.selectTimer);
                    this.sendTime(rowIndex, respRef.selectTime);

                    // reset select timer
                    respRef.selectTime = 0;
                    respRef.selectTimer = setInterval(function() {
                        respRef.selectTime += 20;
                    }, 20);
                } else {
                    curSelect.isAnswered((!params.itemViewDisplayQty.value) ?  false : (curSelect.qtyDropdown().selectedIndex > 0));
                    // if curSelect is un-answered
                    if (!curSelect.isAnswered()) {
                        // clear selectArray
                        respRef.selectArray = [];

                        // QStudio DC Response
                        this.sendResponse(curSelectRowIndex, false, true);

                        // QStudio DC Time
                        clearInterval(respRef.selectTimer);
                        this.sendTime(curSelectRowIndex, "");

                        // reset select timer
                        respRef.selectTime = 0;
                        respRef.selectTimer = setInterval(function() {
                            respRef.selectTime += 20;
                        }, 20);
                    }

                    // QStudio DC Qty
                    this.sendQty(curSelectRowIndex, (curSelect.isAnswered()) ? curSelect.qtyDropdown().selectedIndex : "");
                }
            }
        },

        // for dropdowns and remove button (from Cart items)
        manageChange : function(itemView) {
            var that = this,
                questionType = this.questionType(),
                respRef = this.qStudioVar.respRef,
                params = this.qStudioVar.params,
                totalQtyRemain = this.__getTotalRowQty(true),
                rowIndex = parseInt(itemView.item().getAttribute("rowIndex"), 10),
                itemIndex = jQuery.inArray(itemView, respRef.selectArray),
                itemSelectedIndex = itemView.qtyDropdown().selectedIndex;

            // send response helper function
            var sendMultiHelper = function() {
                // QStudio DC Response
                that.sendResponse(rowIndex, itemView.isAnswered());

                // QStudio DC Time
                clearInterval(respRef.selectTimer);
                that.sendTime(rowIndex, itemView.isAnswered() ? respRef.selectTime : "");

                // reset select timer
                respRef.selectTime = 0;
                respRef.selectTimer = setInterval(function() {
                    respRef.selectTime += 20;
                }, 20);
            };

            // adjust totalQtyRemain if itemView is answered
            if (itemView.isAnswered()) { totalQtyRemain += itemSelectedIndex; }

            // create capping condition
            var capCond = (((params.compCapValueQtyMax.value > 1) && (this.getCapType() !== "none")) ? (totalQtyRemain > 0) : true);

            // Multi Choice response
            if (questionType === "multi") {
                // set itemView isAnswered
                itemView.isAnswered(itemSelectedIndex > 0);
                if (itemView.isAnswered()) {
                    if (!capCond) {
                        itemView.isAnswered(false);
                        return;
                    }

                    if (itemIndex === -1) {
                        // add to array
                        respRef.selectArray.push(itemView);
                        sendMultiHelper();
                    }
                } else {
                    if (itemIndex !== -1) {
                        // splice from array
                        respRef.selectArray.splice(itemIndex, 1);
                        sendMultiHelper();
                    }
                }

                // QStudio DC Qty; we always send quantity response regardless
                this.sendQty(rowIndex, itemView.isAnswered() ? itemSelectedIndex : "");
            }

            // Single Choice response
            else {
                var curSelect = respRef.selectArray[0],
                    curSelectRowIndex = (curSelect) ? (parseInt(curSelect.item().getAttribute("rowIndex"), 10)) : -1;

                // set itemView isAnswered
                itemView.isAnswered(!itemView.isAnswered());
                if (curSelect !== itemView) {
                    if (curSelect) {
                        // set curSelect isAnswered
                        curSelect.isAnswered(false);

                        // clear selectArray
                        respRef.selectArray = [];

                        // QStudio DC Response
                        this.sendResponse(curSelectRowIndex, false, true);

                        // QStudio DC Time
                        this.sendTime(curSelectRowIndex, "");

                        // QStudio DC Qty
                        this.sendQty(curSelectRowIndex, "", true);
                    }

                    respRef.selectArray.push(itemView);

                    // QStudio DC Response
                    this.sendResponse(rowIndex, true);

                    // QStudio DC Qty
                    this.sendQty(rowIndex, itemSelectedIndex);

                    // QStudio DC Time
                    clearInterval(respRef.selectTimer);
                    this.sendTime(rowIndex, respRef.selectTime);

                    // reset select timer
                    respRef.selectTime = 0;
                    respRef.selectTimer = setInterval(function() {
                        respRef.selectTime += 20;
                    }, 20);
                } else {
                    curSelect.isAnswered((!params.itemViewDisplayQty.value) ?  false : (curSelect.qtyDropdown().selectedIndex > 0));
                    // if curSelect is un-answered
                    if (!curSelect.isAnswered()) {
                        // clear selectArray
                        respRef.selectArray = [];

                        // QStudio DC Response
                        this.sendResponse(curSelectRowIndex, false, true);

                        // QStudio DC Time
                        clearInterval(respRef.selectTimer);
                        this.sendTime(curSelectRowIndex, "");

                        // reset select timer
                        respRef.selectTime = 0;
                        respRef.selectTimer = setInterval(function() {
                            respRef.selectTime += 20;
                        }, 20);
                    }

                    // QStudio DC Qty
                    this.sendQty(curSelectRowIndex, (curSelect.isAnswered()) ? curSelect.qtyDropdown().selectedIndex : "");
                }
            }
        },

        mandCondMet : function() {
            var params = this.qStudioVar.params,
                capType = this.getCapType(),
                totalQty = this.__getTotalRowQty(),
                capValue = (params.compCapValueQtyMax.value > 1) ? params.compCapValueQtyMax.value : -1,
                hardCond = (totalQty > 0 && totalQty === capValue),
                softCond = (totalQty > 0 && totalQty <= capValue);

            if (capType === "hard") {
                return hardCond;
            } else if (capType === "soft") {
                return softCond;
            }

            return (totalQty > 0);
        },

        sendResponse: function(rowIndex, ansVal, skipMandChck) {
            var respRef = this.qStudioVar.respRef,
                dcProxy = this.qStudioVar.dcProxy,
                mandCondMet = this.mandCondMet();

            console.log("Response: " + rowIndex + " | " + ansVal + " | " + mandCondMet);

            // toggle view cart button opacity and cursor css properties
            if (respRef.cartBtnContain) {
                respRef.cartBtnContain.style.cursor = (respRef.selectArray.length > 0) ? "pointer" : "default";
                $(respRef.cartBtnContain).css({ opacity : (respRef.selectArray.length > 0) ? 1 : 0.5 });
            }

            if (this.qStudioVar.isDC && typeof dcProxy !== 'undefined') {
                dcProxy.sendResponse({
                    eventType : (ansVal) ? "questionAnswered" : "questionUnAnswered",
                    responseType : this.questionType(),
                    rowID : this.qStudioVar.rowArray[rowIndex].rowVO.id,
                    answerValue : ansVal,
                    dimensionName : "selectArray"
                });

                if (!skipMandChck && this.isMandatory() && (respRef.mandMet !== mandCondMet)) {
                    respRef.mandMet = mandCondMet;
                    dcProxy[(respRef.mandMet) ? "showNextButton" : "hideNextButton"]();
                }
            } else {
                // assume decipher
                if (!skipMandChck && respRef.mandMet !== mandCondMet) {
                    respRef.mandMet = mandCondMet;
                    // fire exit callback
                    if (respRef.mandMet && respRef.exitCallback) { respRef.exitCallback(); }
                }
            }
        },

        sendQty: function(rowIndex, ansVal, skipMandChck) {
            var respRef = this.qStudioVar.respRef,
                dcProxy = this.qStudioVar.dcProxy,
                mandCondMet = this.mandCondMet();

            console.log("Qty: " + rowIndex + " | " + ansVal + " | " + mandCondMet);

            // update itemRemain
            if (respRef.itemRemain) {
                $(respRef.itemRemain).html(this.qStudioVar.params.itemRemainText.value + " " + this.__getTotalRowQty(true));
            }

            if (this.qStudioVar.isDC && typeof dcProxy !== 'undefined') {
                dcProxy.sendResponse({
                    eventType : "questionAnswered",
                    responseType : "text",
                    rowID : this.qStudioVar.rowArray[rowIndex].rowVO.id,
                    answerValue : ansVal.toString(),
                    dimensionName : "qtyArray"
                });

                if (!skipMandChck && this.isMandatory() && (respRef.mandMet !== mandCondMet)) {
                    respRef.mandMet = mandCondMet;
                    dcProxy[(respRef.mandMet) ? "showNextButton" : "hideNextButton"]();
                }
            } else {
                // assume decipher
                if (!skipMandChck && respRef.mandMet !== mandCondMet) {
                    respRef.mandMet = mandCondMet;
                    // fire exit callback
                    if (respRef.mandMet && respRef.exitCallback) { respRef.exitCallback(); }
                }
            }
        },

        sendTime: function(rowIndex, ansVal) {
            console.log("Time: " + rowIndex + " | " + ansVal);
            this.qStudioVar.respRef.timeDict[rowIndex] = ansVal;
            if (this.qStudioVar.isDC && typeof this.qStudioVar.dcProxy !== 'undefined') {
                this.qStudioVar.dcProxy.sendResponse({
                    eventType : "questionAnswered",
                    responseType : "text",
                    rowID : this.qStudioVar.rowArray[rowIndex].rowVO.id,
                    answerValue : ansVal.toString(),
                    dimensionName : "timeArray"
                });
            }
        },

        getDimenResp: function() {
            if (!this.qStudioVar.isDC) { return; }
            var respRef = this.qStudioVar.respRef,
                valarray = [],
                json = { Response: { Value: valarray } },
                i = 0, slen = respRef.selectArray.length;

            for (i = 0; i < slen; i += 1) {
                valarray.push({
                    id : respRef.selectArray[i].item().id,
                    qty : respRef.selectArray[i].qtyDropdown().selectedIndex,
                    time_ms : respRef.timeDict[respRef.selectArray[i].config().index]
                });
            }

            return json;
        }
    };

    return VirtualShelf;
})();

function QVirtualShelfItem(parent, configObj) {
    // Create shelf item shell
    var that = this,
        doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        item = doc.createElement("div"),
        productContain = doc.createElement("div"),
        price = doc.createElement("label"),
        priceImg = doc.createElement("img"),
        qtyContain = doc.createElement("div"),
        qtyLabel = doc.createElement("label"),
        qtyDropdown = doc.createElement("select"),
        zoomBtn = doc.createElement("label"),
        stamp = doc.createElement("div"),
        isTouchMove = false;

    // item CSS
    item.dir = "LTR";
    item.className = "qvs_item_view";
    item.style.position = "absolute";
    item.style.filter = "inherit";
    item.style.cursor = "pointer";
    item.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
    item.style.cssText += ';'.concat("-webkit-touch-callout: none;");
    item.style.cssText += ';'.concat("-ms-touch-action: none;");
    item.style.cssText += ';'.concat("-webkit-user-select: none;");
    item.style.cssText += ';'.concat("-khtml-user-select: none;");
    item.style.cssText += ';'.concat("-moz-user-select: none;");
    item.style.cssText += ';'.concat("-ms-user-select: none;");
    item.style.cssText += ';'.concat("-user-select: none;");

    // productContain CSS
    productContain.className = "qvs_item_product_container";
    productContain.style.position = "relative";
    productContain.style.filter = "inherit";

    // price CSS
    price.className = "qvs_item_price";
    price.style.cssText += ';'.concat("-webkit-box-sizing: border-box");
    price.style.cssText += ';'.concat("-moz-box-sizing: border-box");
    price.style.cssText += ';'.concat("box-sizing: border-box");
    price.style.position = "absolute";
    price.style.cursor = "default";
    price.style.filter = "inherit";
    price.style.whiteSpace = "nowrap";

    // priceImg CSS
    priceImg.className = "qvs_item_price_image";
    priceImg.style.position = "absolute";
    priceImg.style.cursor = "default";
    priceImg.style.filter = "inherit";

    // qtyContain css
    qtyContain.className = "qvs_item_quantity_container";
    qtyContain.style.position = "absolute";
    qtyContain.style.cursor = "default";
    qtyContain.style.filter = "inherit";

    // qtyLabel css
    qtyLabel.className = "qvs_item_quantity_label";
    qtyLabel.style.position = "absolute";
    qtyLabel.style.filter = "inherit";
    qtyLabel.style.whiteSpace = "nowrap";

    // qtyDropdown css
    qtyDropdown.className = "qvs_item_quantity_dropdown";
    qtyDropdown.style.cssText += ';'.concat("-webkit-box-sizing: border-box");
    qtyDropdown.style.cssText += ';'.concat("-moz-box-sizing: border-box");
    qtyDropdown.style.cssText += ';'.concat("box-sizing: border-box");
    qtyDropdown.style.position = "absolute";
    qtyDropdown.style.padding = 0; // to clear qstudio component designer css
    qtyDropdown.style.width = "auto"; // to clear qstudio component designer css
    qtyDropdown.style.top = 0; // to clear qstudio component designer css
    qtyDropdown.style.left = 0; // to clear qstudio component designer css
    qtyDropdown.style.filter = "inherit";

    // zoomBtn CSS
    zoomBtn.className = "qvs_item_zoom_button";
    zoomBtn.style.position = "absolute";
    zoomBtn.style.display = "block";
    zoomBtn.style.filter = "inherit";
    zoomBtn.style.cursor = "pointer";
    zoomBtn.style.left = "50%";

    // stamp CSS
    stamp.className = "qvs_item_stamp";
    stamp.style.position = "absolute";
    stamp.style.filter = "inherit";

    // append children
    qtyContain.appendChild(qtyLabel);
    qtyContain.appendChild(qtyDropdown);
    item.appendChild(productContain);
    item.appendChild(price);
    item.appendChild(qtyContain);
    item.appendChild(zoomBtn);
    item.appendChild(stamp);
    parentEle.appendChild(item);

    // init core vars
    this._events = {
        change : "change.qvs_item",
        click : (!QUtility.isMSTouch()) ?
            ((!QUtility.isTouchDevice()) ? "click.qvs_item mousedown.qvs_item mouseup.qvs_item" : "touchstart.qvs_item touchend.qvs_item touchmove.qvs_item"):
            ((!QUtility.isTouchDevice()) ? "click.qvs_item mousedown.qvs_item mouseup.qvs_item" : ((window.PointerEvent) ? "pointerdown.qvs_item pointerup.qvs_item" : "MSPointerDown.qvs_item MSPointerUp.qvs_item"))
    };
    this._widget = item;
    this._params = {};
    this._cache = {};
    this._cache._isAnswered = false;
    this._cache.nodes = {
        productContain : productContain,
        price : price,
        priceImg : priceImg,
        qtyLabel : qtyLabel,
        qtyDropdown : qtyDropdown,
        qtyContain : qtyContain,
        zoomBtn : zoomBtn,
        stamp : stamp
    };

    // this will in-turn call the update method to finalize construction
    this.config(configObj);

    // qtyDropdown click event
    $(qtyDropdown).on(this._events.click, function(event) {
        event.stopImmediatePropagation();

        // fire callback; we assume the dropdown_click_callback will return the qty remaining
        if (that._params.dropdown_click_callback) {
            if (event.type === "click" || event.type === "mouseup") { return; }
            var qtyRemain = that._params.dropdown_click_callback();
            if (QUtility.isNumber(qtyRemain)) {
                // adjust qtyRemain value if itemView is answered
                if (that.isAnswered()) { qtyRemain += that.qtyDropdown().selectedIndex; }

                // disable qtyDropdown options
                for (var i = 0; i < this.children.length; i += 1) {
                    var opt = this.children[i];
                    opt.disabled = ((qtyRemain > 0 && i > qtyRemain) || qtyRemain === 0);
                }
            }
        }
    });

    // qtyDropdown change event
    $(qtyDropdown).on(this._events.change, function(event) {
        // fire callback; we assume callback is manageChange method
        if (that._params.dropdown_change_callback) {
            that._params.dropdown_change_callback(that);
        }
    });

    // zoomBtn click event
    if (this._params.allow_zoom) {
        $((!this._params.display_qty) ? zoomBtn : productContain).on(this._events.click, function(event) {
            event.stopPropagation();
            if (event.type !== "touchmove") {
                if (event.type !== 'mousedown' && event.type !== 'mouseup' && event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                    if (isTouchMove) { return; }
                    // fire callback
                    if (that._params.zoombtn_callback) {
                        that._params.zoombtn_callback(that);
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
QVirtualShelfItem.prototype.initConfigMap = function() {
    if (this._configMap === undefined) {
        this._configMap = {
            isRTL : { value: false, type: "boolean" },
            display_price : { value: true, type: "boolean" },
            display_qty : { value: true, type: "boolean" },
            allow_zoom : { value: true, type: "boolean" },
            stamp_show : { value: false, type: "boolean" },
            box_shadow_show : { value: false, type: "boolean" },
            index : { value: -1, type: "number", min: 0 },
            width : { value: 85, type: "number", min: 1 },
            height : { value: 100, type: "number", min: 1 },
            item_count : { value: 1, type: "number", min: 1 },
            item_stack_count : { value: 4, type: "number", min: 1 },
            item_gap : { value: 10, type: "number", min: 1 },
            item_width_offset : { value: 3, type: "number", min: 0 },
            item_height_offset : { value: 2, type: "number", min: 0 },
            animate_duration : { value: 200, type: "number", min: 0 },
            select_alpha : { value: 100, type: "number", min: 0 },
            select_border_width : { value: 2, type: "number", min: 0 },
            select_border_style : { value: 'solid', type: "string", options:['none', 'solid', 'dotted', 'dashed'] },
            select_border_color : { value: 0xffbd1a, type: "color" },
            primary_font_family : { value: "", type: "string" },
            id : { value: "", type: "string" },
            label : { value: "", type: "string" },
            price : { value: "", type: "string" },
            description : { value: "", type: "string" },
            image : { value: "", type: "string" },
            // price parameters
            price_image : { value: "", type: "string" },
            price_image_width : { value: 50, type: "number", min: 1 },
            price_image_height : { value: 50, type: "number", min: 1 },
            price_top : { value: 0, type: "number" },
            price_left : { value: 0, type: "number" },
            price_padding : { value: 2, type: "number", min: 0 },
            price_fontsize : { value: 18, type: "number", min: 5 },
            price_border_width : { value: 1, type: "number", min: 0 },
            price_border_style : { value: 'solid', type: "string", options:['none', 'solid', 'dotted', 'dashed'] },
            price_bckgrnd_color : { value: 0xFFFFFF, type: "color" },
            price_border_color : { value: 0xCCCCCC, type: "color" },
            price_color : { value: 0x000000, type: "color" },
            // quantity parameters
            qty_limit : { value: 10, type: "number", min: 1 },
            qty_top : { value: 0, type: "number" },
            qty_left : { value: 0, type: "number" },
            qty_text : { value: "Qty:", type: "string" },
            // zoom button parameters
            zoom_top : { value: 0, type: "number" },
            zoom_left : { value: 0, type: "number" },
            zoom_fontsize : { value: 15, type: "number", min: 5 },
            zoom_border_width : { value: 1, type: "number", min: 0 },
            zoom_text : { value: "click to zoom", type: "string" },
            zoom_border_style : { value: 'solid', type: "string", options:['none', 'solid', 'dotted', 'dashed'] },
            zoom_border_color : { value: 0xCCCCCC, type: "color" },
            zoom_color : { value: 0x000000, type: "color" },
            // stamp parameters
            stamp_width : { value: 30, type: "number", min: 1 },
            stamp_height : { value: 30, type: "number", min: 1 },
            stamp_top : { value: 0, type: "number" },
            stamp_left : { value: 0, type: "number" },
            stamp : { value: "", type: "string" }
        };
    }
};
QVirtualShelfItem.prototype.config = function(value) {
    if (!this._widget) { return null; }

    // acts as getter
    if (typeof value !== 'object') {
        return this._params;
    }

    // acts as setter
    else {
        if (this._configMap === undefined) {
            // create the configMap
            this.initConfigMap();

            // set default parameters
            VirtualShelf.prototype.setParams.apply(this, [this._configMap, true]);
        }

        // set custom parameters
        VirtualShelf.prototype.setParams.apply(this, [value]);

        // init param callbacks
        this._params.load_callback = (value.load_callback && typeof value.load_callback === "function") ? value.load_callback : (this._params.load_callback || undefined);

        // init param callbacks
        this._params.dropdown_change_callback = (value.dropdown_change_callback && typeof value.dropdown_change_callback === "function") ? value.dropdown_change_callback : (this._params.dropdown_change_callback || undefined);
        this._params.dropdown_click_callback = (value.dropdown_click_callback && typeof value.dropdown_click_callback === "function") ? value.dropdown_click_callback : (this._params.dropdown_click_callback || undefined);
        this._params.zoombtn_callback = (value.zoombtn_callback && typeof value.zoombtn_callback === "function") ? value.zoombtn_callback : (this._params.zoombtn_callback || undefined);

        // parameter presets
        if (this._params.price_border_style === "none") {
            this._params.price_border_width = 0;
        }

        if (this._params.select_border_style === "none") {
            this._params.select_border_width = 0;
        }

        // update widget
        this.update();

        value = null;
        return this;
    }
};
QVirtualShelfItem.prototype.update = function() {
    if (!this._widget) { return false; }
    var that = this,
        doc = document,
        params = this._params,
        item = this._widget,
        cacheNodes = this._cache.nodes,
        imageArray = params.image.split(","),
        priceWidth = 0,
        priceHeight = 0,
        isPriceImg = false,
        qtyLabelWidth = 0,
        qtyLabelHeight = 0,
        qtyDropdownHeight = 0,
        qtyContainWidth = 0,
        zoomBtnWidth = 0,
        itemContainWidth = 0;

    var updateHelper = function() {
        // update qtyLabel
        if (params.display_qty && params.qty_text !== "") {
            cacheNodes.qtyLabel.style.fontFamily = params.primary_font_family;
            cacheNodes.qtyLabel.style.fontSize = QUtility.convertPxtoEM(14) + "em";
            $(cacheNodes.qtyLabel).html(params.qty_text);
            cacheNodes.qtyLabel.style.visibility = "hidden";
            doc.body.appendChild(cacheNodes.qtyLabel);
            qtyLabelWidth = $(cacheNodes.qtyLabel).outerWidth();
            qtyLabelHeight = $(cacheNodes.qtyLabel).outerHeight();
            cacheNodes.qtyContain.insertBefore(cacheNodes.qtyLabel, cacheNodes.qtyContain.firstChild);
            cacheNodes.qtyLabel.style.visibility = "";
        } else {
            if (cacheNodes.qtyLabel.parentNode && cacheNodes.qtyLabel.parentNode.nodeType === 1) {
                cacheNodes.qtyLabel.parentNode.removeChild(cacheNodes.qtyLabel);
            }
        }

        // update qtyDropdown; we update regardless because other dropdowns are dependent on its selectedIndex
        cacheNodes.qtyDropdown.style.fontFamily = params.primary_font_family;
        cacheNodes.qtyDropdown.style.fontSize = QUtility.convertPxtoEM(14) + "em";
        cacheNodes.qtyDropdown.style[(!params.isRTL) ? "marginLeft" : "marginRight"] = (qtyLabelWidth + ((qtyLabelWidth > 0) ? 5 : 0)) + "px";

        // remove previous dropdown
        while (cacheNodes.qtyDropdown.firstChild) {
            cacheNodes.qtyDropdown.removeChild(cacheNodes.qtyDropdown.firstChild)
        }

        // create new qtyDropdown options
        for (var i = 0; i <= params.qty_limit; i += 1) {
            var opt = doc.createElement("option");
            opt.id = "btn_id_" + i;
            opt.className = "qvs_item_dropdown_option";
            opt.value = i;
            opt.style.display = "block";
            $(opt).html(opt.value);
            cacheNodes.qtyDropdown.appendChild(opt);
        }

        // reset qtyDropdown selectedIndex
        that.qtyDropdown(true);
        // update qtyContain
        if (params.display_qty) {
            cacheNodes.qtyContain.style.visibility = "hidden";
            doc.body.appendChild(cacheNodes.qtyContain);
            qtyDropdownHeight = $(cacheNodes.qtyDropdown).outerHeight();
            qtyContainWidth =  $(cacheNodes.qtyDropdown).outerWidth(true);
            item.appendChild(cacheNodes.qtyContain);
            cacheNodes.qtyContain.style.visibility = "";
            cacheNodes.qtyContain.dir = (!params.isRTL) ? "LTR" : "RTL";
            cacheNodes.qtyContain.style.width = qtyContainWidth + "px";
            cacheNodes.qtyContain.style.height = Math.max(qtyLabelHeight, qtyDropdownHeight) + "px";
            // this is to account for spacing between price and quantity container since they're placed adjacent to one another
            if (priceWidth > 0) { priceWidth += 5; }
            cacheNodes.qtyContain.style[(!params.isRTL) ? "marginLeft" : "marginRight"] = (priceWidth + params.qty_left) + "px";
        } else {
            if (cacheNodes.qtyContain.parentNode && cacheNodes.qtyContain.parentNode.nodeType === 1) {
                cacheNodes.qtyContain.parentNode.removeChild(cacheNodes.qtyContain);
            }
        }

        // update zoomBtn; zoom button is only displayed if quantity dropdown is not displayed
        if (!params.display_qty && params.allow_zoom) {
            cacheNodes.zoomBtn.style.fontFamily = params.primary_font_family;
            cacheNodes.zoomBtn.style.visibility = "hidden";
            cacheNodes.zoomBtn.style.padding = "2px";
            cacheNodes.zoomBtn.style.whiteSpace = "nowrap";
            cacheNodes.zoomBtn.style.color = "#" + params.zoom_color;
            cacheNodes.zoomBtn.style.fontSize = QUtility.convertPxtoEM(params.zoom_fontsize) + "em";
            cacheNodes.zoomBtn.style.backgroundColor = "#FFF";
            cacheNodes.zoomBtn.style.border = params.zoom_border_width + "px " + params.zoom_border_style + " #" + params.zoom_border_color;
            $(cacheNodes.zoomBtn).html(params.zoom_text || "+");
            doc.body.appendChild(cacheNodes.zoomBtn);
            zoomBtnWidth = $(cacheNodes.zoomBtn).outerWidth();
            cacheNodes.zoomBtn.style.marginLeft = (-zoomBtnWidth*0.5 + params.zoom_left) + "px";
            item.appendChild(cacheNodes.zoomBtn);
            cacheNodes.zoomBtn.style.visibility = "";
        } else {
            if (cacheNodes.zoomBtn.parentNode && cacheNodes.zoomBtn.parentNode.nodeType === 1) {
                cacheNodes.zoomBtn.parentNode.removeChild(cacheNodes.zoomBtn);
            }
        }

        // update stamp
        if (params.stamp_show && params.stamp !== "") {
            item.appendChild(cacheNodes.stamp);
            $(cacheNodes.stamp).css( {
                'display' : "none",
                'z-index' : 1000,
                'width' : params.stamp_width + "px",
                'height' : params.stamp_height + "px",
                'background-repeat' : 'no-repeat',
                'background-size' : params.stamp_width + "px " + params.stamp_height + "px",
                'background-position' : 'center',
                'background-image' : (QUtility.ieVersion() < 9) ?
                    "url(" + "" + ") " + 'url(' + params.stamp + ')' : 'url(' + params.stamp + ')',
                'filter' : "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + params.stamp + ", sizingMethod='scale')"
            });
        } else {
            if (cacheNodes.stamp.parentNode && cacheNodes.stamp.parentNode.nodeType === 1) {
                cacheNodes.stamp.parentNode.removeChild(cacheNodes.stamp);
            }
        }

        // update productContain
        while (cacheNodes.productContain.firstChild) {
            cacheNodes.productContain.removeChild(cacheNodes.productContain.firstChild);
        }

        // create product stack
        var productStack = doc.createElement("div"),
            productImg = doc.createElement("img");

        // productStack CSS
        productStack.className = "qvs_item_stack";
        productStack.style.position = "absolute";
        productStack.style.filter = "inherit";
        cacheNodes.productContain.appendChild(productStack);

        // productImg CSS
        productImg.className = "qvs_item_image";
        productImg.style.position = "absolute";
        productImg.style.filter = "inherit";
        productImg.style.width = "auto";
        productImg.style.height = "auto";
        productImg.style.maxWidth = params.width + "px";
        productImg.style.maxHeight = params.height + "px";
        productImg.style.visibility = "hidden";
        productImg.src = imageArray[0];
        if (params.box_shadow_show) {
            productImg.style.MozBoxShadow =
                productImg.style.webkitBoxShadow =
                    productImg.style.boxShadow = "3px 0px 5px #888";
        }

        // productImg load event
        $(productImg).on("load.qvirtualshop", function() {
            var imgWidth = 0, imgHeight = 0,
                imgWidthOffset = 0, imgHeightOffset = 0,
                productContainWidth = 0;

            // remove listener
            $(this).off("load.qvirtualshop");

            // temporarily append image to body to set image dimensions
            doc.body.appendChild(this);
            imgWidth = $(this).width();
            imgHeight = $(this).height();
            imgWidthOffset = imgWidth;
            imgHeightOffset = imgHeight;
            this.style.width = imgWidth + "px";
            this.style.height = imgHeight + "px";

            // append image to productStack
            productStack.appendChild(this);
            productStack.style.width = imgWidth + "px";
            productStack.style.height = imgHeight + "px";
            this.style.visibility = "";

            // see if we need to clone productImg
            for (var i = 0; i < params.item_stack_count - 1; i += 1) {
                imgWidthOffset -= params.item_width_offset;
                imgHeightOffset -= params.item_height_offset;
                var imgClone = productImg.cloneNode(true);
                imgClone.style.top = -((i + 1) * 2) + "px";
                imgClone.style.width = imgWidthOffset + "px";
                imgClone.style.height = imgHeightOffset + "px";
                productStack.insertBefore(imgClone, productStack.firstChild);
            }

            // see if we need to clone productStack
            for (i = 1; i < params.item_count; i += 1) {
                var stackClone = productStack.cloneNode(true);
                stackClone.style.left = ((imgWidth + params.item_gap) * i) + "px";
                cacheNodes.productContain.appendChild(stackClone);
            }

            // set productContain dimensions
            productContainWidth = ((imgWidth + params.item_gap) * i) - params.item_gap;
            cacheNodes.productContain.style.width = productContainWidth + "px";
            cacheNodes.productContain.style.height = imgHeight + "px";
            itemContainWidth = Math.max(productContainWidth, zoomBtnWidth, (priceWidth + qtyContainWidth));

            // Position productContain
            cacheNodes.productContain.style.left = (itemContainWidth - productContainWidth)*0.5 + "px";

            // Position item stamp
            cacheNodes.stamp.style.top = ((imgHeight - params.stamp_height)*0.5 + params.stamp_top) + "px";
            cacheNodes.stamp.style[(!params.isRTL) ? "left" : "right"] = ((itemContainWidth - params.stamp_width)*0.5 + params.stamp_left) + "px";

            // Position price
            if (!isPriceImg) {
                cacheNodes.price.style[(!params.isRTL) ? "left" : "right"] = (itemContainWidth - priceWidth - ((params.display_qty) ? qtyContainWidth : 0)) * 0.5 + "px";
                cacheNodes.price.style.top = (imgHeight + params.price_top) + "px";
            } else {
                cacheNodes.priceImg.style[(!params.isRTL) ? "left" : "right"] = (itemContainWidth - priceWidth - ((params.display_qty) ? qtyContainWidth : 0)) * 0.5 + "px";
                cacheNodes.priceImg.style.top = (imgHeight + params.price_top) + "px";
            }

            // Position quantity contain
            cacheNodes.qtyContain.style.left = (itemContainWidth - qtyContainWidth - ((params.display_price) ? priceWidth : 0)) * 0.5 + "px";
            cacheNodes.qtyContain.style.top = (imgHeight + params.qty_top) + "px";

            // Position zoom button
            cacheNodes.zoomBtn.style.top = (imgHeight + priceHeight + params.zoom_top + 2) + "px";

            // set product item
            item.style.width = itemContainWidth + "px";
            item.style.height = imgHeight + "px";

            // fire callback; pass this reference
            if (params.load_callback) {
                params.load_callback(that);
            }
        }).attr("src", imageArray[0]);
    };

    // set item id
    item.id = params.id;

    // regarding price label and price image we only show 1 or the other, hence price visibility is delayed until after price_image is processed.
    // update price label
    if (params.display_price && params.price !== "") {
        cacheNodes.price.dir = (!params.isRTL) ? "LTR" : "RTL";
        cacheNodes.price.style.fontFamily = params.primary_font_family;
        cacheNodes.price.style.visibility = "hidden";
        cacheNodes.price.style.cursor = (!params.display_qty) ? "inherit" : "default";
        cacheNodes.price.style.color = "#" + params.price_color;
        cacheNodes.price.style.padding = params.price_padding + "px";
        cacheNodes.price.style.whiteSpace = "nowrap";
        cacheNodes.price.style.fontSize = QUtility.convertPxtoEM(params.price_fontsize) + "em";
        cacheNodes.price.style.backgroundColor = "#" + params.price_bckgrnd_color;
        cacheNodes.price.style.border = params.price_border_width + "px " + params.price_border_style + " #" + params.price_border_color;
        $(cacheNodes.price).html(params.price);
        doc.body.appendChild(cacheNodes.price);
        priceWidth = $(cacheNodes.price).outerWidth();
        priceHeight = $(cacheNodes.price).outerHeight();
        cacheNodes.price.style[(!params.isRTL) ? "left" : "right"] = params.price_left + "px";
        $(cacheNodes.price).insertAfter(item.firstChild);
    } else {
        if (cacheNodes.price.parentNode && cacheNodes.price.parentNode.nodeType === 1) {
            cacheNodes.price.parentNode.removeChild(cacheNodes.price);
        }
    }

    // update price image container
    // if price_image parameter is valid it will remove the price from display
    if (params.display_price && params.price_image.length > 0) {
        cacheNodes.priceImg.style.visibility = "hidden";
        cacheNodes.priceImg.style.cursor = (!params.display_qty) ? "inherit" : "default";
        cacheNodes.priceImg.style.width = "auto";
        cacheNodes.priceImg.style.height = "auto";
        cacheNodes.priceImg.style.maxWidth = params.price_image_width + "px";
        cacheNodes.priceImg.style.maxHeight = params.price_image_height + "px";
        cacheNodes.priceImg.src = params.price_image;

        // price image load event
        $(cacheNodes.priceImg).on("load.qvs_price_image", function(event) {
            var priceImgWidth = 0;
            $(this).off("load.qvs_price_image");
            doc.body.appendChild(cacheNodes.priceImg);
            priceImgWidth = $(cacheNodes.priceImg).outerWidth();
            $(cacheNodes.priceImg).insertAfter(item.firstChild);
            cacheNodes.priceImg.style.visibility = "";

            // remove price label
            if (cacheNodes.price.parentNode && cacheNodes.price.parentNode.nodeType === 1) {
                cacheNodes.price.parentNode.removeChild(cacheNodes.price);
            }

            // complete update
            isPriceImg = true;
            priceWidth = priceImgWidth;
            updateHelper();
        }).attr("src", params.price_image);

        // price image error event
        $(cacheNodes.priceImg).on("error.qvs_price_image", function(event) {
            $(this).off("error.qvs_price_image");
            // display price label
            cacheNodes.price.style.visibility = "";

            // remove price image
            if (cacheNodes.priceImg.parentNode && cacheNodes.priceImg.parentNode.nodeType === 1) {
                cacheNodes.priceImg.parentNode.removeChild(cacheNodes.priceImg);
            }

            // complete update
            updateHelper();
        }).attr("src", params.price_image);
    } else {
        // display price label
        cacheNodes.price.style.visibility = "";

        // remove price image
        if (cacheNodes.priceImg.parentNode && cacheNodes.priceImg.parentNode.nodeType === 1) {
            cacheNodes.priceImg.parentNode.removeChild(cacheNodes.priceImg);
        }

        // complete update
        updateHelper();
    }
};
QVirtualShelfItem.prototype.item = function() {
    if (!this._widget) { return null; }
    return this._widget;
};
QVirtualShelfItem.prototype.qtyDropdown = function(reset) {
    if (!this._widget) { return null; }
    if (typeof reset === "boolean" && reset) {
        // when the qty dropdown is displayed start with 0; else we start with 1
        this._cache.nodes.qtyDropdown.selectedIndex = (this._params.display_qty) ? 0 : 1;
    } else {
        return this._cache.nodes.qtyDropdown;
    }
};
QVirtualShelfItem.prototype.productContain = function() {
    if (!this._widget) { return null; }
    return this._cache.nodes.productContain;
};
QVirtualShelfItem.prototype.isAnswered = function(value) {
    if (!this._widget) { return null; }
    if (typeof value === "boolean" && this._cache._isAnswered !== value) {
        this._cache._isAnswered = value;
        if (!value) { this.qtyDropdown(true); }
        this.toggleSelect(value);
    }

    return this._cache._isAnswered;
};
QVirtualShelfItem.prototype.toggleMouseOver = function(value) {
    if (!this._widget || this._cache._isAnswered) { return false; }
    var params = this._params,
        cacheNodes = this._cache.nodes;
};
QVirtualShelfItem.prototype.toggleSelect = function(value) {
    if (!this._widget) { return false; }
    var params = this._params,
        cacheNodes = this._cache.nodes,
        updateStamp = (cacheNodes.stamp.parentNode &&  cacheNodes.stamp.parentNode.nodeType === 1),
        alphaValue = (value) ? params.select_alpha*.01 : 1,
        itemImg = cacheNodes.productContain.firstChild.children[cacheNodes.productContain.firstChild.children.length - 1];

    // update stamp
    if (updateStamp) { cacheNodes.stamp.style.display = (value) ? "block" : "none"; }

    // update productContain opacity
    $(cacheNodes.productContain).stop();
    $(cacheNodes.productContain).animate({
        opacity : alphaValue
    }, params.animate_duration);

    // put border around item image
    itemImg.style.border = (value) ? params.select_border_width + "px " + params.select_border_style + " #" + params.select_border_color : "";
    itemImg.style.marginLeft = (value) ? -params.select_border_width + "px" : "";
    itemImg.style.marginTop = itemImg.style.marginLeft;
};

// Virtual Shelf Cart Module
function QVirtualShelfCart(parent, configObj) {
    // Create shelf cart shell
    var that = this,
        doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        cartContain = doc.createElement("div"),
        header = doc.createElement("label"),
        itemContain = doc.createElement("div"),
        txtContain = doc.createElement("div"),
        itemTotalLabel = doc.createElement("label"),
        totalLabel = doc.createElement("label"),
        backBtn = doc.createElement("div"),
        nextBtn = undefined,
        isTouchMove = false;

    // cartContain CSS; display is set to none by default
    cartContain.className = "qvs_cart_view";
    cartContain.style.position = "relative";
    cartContain.style.display = "none";
    cartContain.style.top =
        cartContain.style.left =
            cartContain.style.right =
                cartContain.style.bottom = "0px";

    // header CSS
    header.className = "qvs_cart_header";
    header.style.cssText += ';'.concat("-webkit-box-sizing: border-box");
    header.style.cssText += ';'.concat("-moz-box-sizing: border-box");
    header.style.cssText += ';'.concat("box-sizing: border-box");
    header.style.position = "relative";
    header.style.overflow = "hidden";
    header.style.display = "block";
    header.style.width = "100%";
    header.style.whiteSpace = "nowrap";

    // itemContain CSS
    itemContain.className = "qvs_cart_item_container";
    itemContain.style.position = "relative";
    itemContain.style.width = "100%";

    // txtContain CSS
    txtContain.className = "qvs_cart_text_container";
    txtContain.style.cssText += ';'.concat("-webkit-box-sizing: border-box");
    txtContain.style.cssText += ';'.concat("-moz-box-sizing: border-box");
    txtContain.style.cssText += ';'.concat("box-sizing: border-box");
    txtContain.style.position = "relative";
    txtContain.style.width = "100%";

    // itemTotalLabel CSS
    itemTotalLabel.className = "qvs_cart_itemtotal_label";
    itemTotalLabel.style.position = "relative";
    itemTotalLabel.style.display = "block";
    itemTotalLabel.style.overflow = "hidden";
    itemTotalLabel.style.width = "100%";
    itemTotalLabel.style.whiteSpace = "nowrap";

    // totalLabel CSS
    totalLabel.className = "qvs_cart_total_label";
    totalLabel.style.position = "relative";
    totalLabel.style.display = "block";
    totalLabel.style.overflow = "hidden";
    totalLabel.style.width = "100%";
    totalLabel.style.whiteSpace = "nowrap";

    // backBtn CSS
    backBtn.className = "qvs_cart_back_button";
    backBtn.style.cssText += ';'.concat("-webkit-box-sizing: border-box");
    backBtn.style.cssText += ';'.concat("-moz-box-sizing: border-box");
    backBtn.style.cssText += ';'.concat("box-sizing: border-box");
    backBtn.style.position = "relative";
    backBtn.style.display = "inline-block";
    backBtn.style.verticalAlign = "top";
    backBtn.style.cursor = "pointer";

    // nextBtn CSS
    nextBtn = backBtn.cloneNode(true);
    nextBtn.className = "qvs_cart_next_button";

    // append children
    txtContain.appendChild(itemTotalLabel);
    txtContain.appendChild(totalLabel);
    cartContain.appendChild(header);
    cartContain.appendChild(itemContain);
    cartContain.appendChild(txtContain);
    cartContain.appendChild(backBtn);
    cartContain.appendChild(nextBtn);
    parentEle.appendChild(cartContain);

    // init core vars
    this._events = {
        change : "change.qvs_cart",
        click : (!QUtility.isMSTouch()) ?
            ((!QUtility.isTouchDevice()) ? "click.qvs_cart mousedown.qvs_cart mouseup.qvs_cart" : "touchstart.qvs_cart touchend.qvs_cart touchmove.qvs_cart"):
            ((!QUtility.isTouchDevice()) ? "click.qvs_cart mousedown.qvs_cart mouseup.qvs_cart" : ((window.PointerEvent) ? "pointerdown.qvs_cart pointerup.qvs_cart" : "MSPointerDown.qvs_cart MSPointerUp.qvs_cart"))
    };
    this._widget = cartContain;
    this._params = {};
    this._cache = {};
    this._cache._currency = "";         // currency sign used
    this._cache._isCurFront = true;     // is currency sign placed in front or rear
    this._cache._cartTotal = 0;         // total amount in cart
    this._cache._cartItemCnt = 0;       // item total amount in cart
    this._cache.nodes = {
        header : header,
        itemContain : itemContain,
        txtContain : txtContain,
        itemTotalLabel : itemTotalLabel,
        totalLabel : totalLabel,
        backBtn : backBtn,
        nextBtn : nextBtn
    };

    // this will in-turn call the update method to finalize construction
    this.config(configObj);

    // nextBtn/backBtn click event
    $([nextBtn, backBtn]).on(this._events.click, function(event) {
        event.stopPropagation();
        if (event.type !== "touchmove") {
            if (event.type !== 'mousedown' && event.type !== 'mouseup' && event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                if (isTouchMove) { return; }
                if (event.currentTarget === nextBtn) {
                    if (!nextBtn.enabled) { return; }
                    if (that._params.next_callback) { that._params.next_callback(); }
                } else {
                    that.hide();
                    if (that._params.back_callback) { that._params.back_callback(); }
                }
            } else {
                isTouchMove = false;
            }
        } else {
            isTouchMove = true;
        }
    });
}
QVirtualShelfCart.prototype.initConfigMap = function() {
    if (this._configMap === undefined) {
        this._configMap = {
            isRTL : { value: false, type: "boolean" },
            display_price : { value: true, type: "boolean" },
            display_qty : { value: true, type: "boolean" },
            width : { value: 600, type: "number", min: 1 },
            height : { value: 400, type: "number", min: 1 },
            padding : { value: 10, type: "number", min: 0 },
            top : { value: 0, type: "number" },
            left : { value: 0, type: "number" },
            cap_value : { value: -1, type: "number", min: 2 },
            total_precision : { value: 2, type: "number", min: 0 },
            qty_limit : { value: 10, type: "number", min: 1 },
            primary_font_family : { value: "", type: "string" },
            header_text : { value: "Shopping Cart", type: "string" },
            qty_text : { value: "Qty:", type: "string" },
            total_text : { value: "Total: ", type: "string" },
            item_text : { value: "Number of Items: ", type: "string" },
            backbtn_text : { value: "Continue Shopping ", type: "string" },
            nextbtn_text : { value: "Checkout", type: "string" },
            removebtn_text : { value: "Remove", type: "string" },
            header_fontsize : { value: 18, type: "number", min: 5 },
            label_fontsize : { value: 18, type: "number", min: 5 },
            price_fontsize : { value: 18, type: "number", min: 5 },
            total_fontsize : { value: 18, type: "number", min: 5 },
            header_fontcolor : { value: 0x000000, type: "color" },
            label_fontcolor : { value: 0x000000, type: "color" },
            price_fontcolor : { value: 0x000000, type: "color" },
            total_fontcolor : { value: 0x000000, type: "color" }
        };
    }
};
QVirtualShelfCart.prototype.config = function(value) {
    if (!this._widget) { return null; }

    // acts as getter
    if (typeof value !== 'object') {
        return this._params;
    }

    // acts as setter
    else {
        if (this._configMap === undefined) {
            // create the configMap
            this.initConfigMap();

            // set default parameters
            VirtualShelf.prototype.setParams.apply(this, [this._configMap, true]);
        }

        // set custom parameters
        VirtualShelf.prototype.setParams.apply(this, [value]);

        // init param itemViewArry; component will pass a reference to all item views constructed
        this._params.itemViewArry = (jQuery.isArray(value.itemViewArry)) ? value.itemViewArry :  (this._params.itemViewArry || undefined);

        // init param callbacks
        this._params.back_callback = (value.back_callback && typeof value.back_callback === "function") ? value.back_callback : (this._params.back_callback || undefined);
        this._params.next_callback = (value.next_callback && typeof value.next_callback === "function") ? value.next_callback : (this._params.next_callback || undefined);
        this._params.remove_callback = (value.remove_callback && typeof value.remove_callback === "function") ? value.remove_callback : (this._params.remove_callback || undefined);
        this._params.dropdown_change_callback = (value.dropdown_change_callback && typeof value.dropdown_change_callback === "function") ? value.dropdown_change_callback : (this._params.dropdown_change_callback || undefined);
        this._params.dropdown_click_callback = (value.dropdown_click_callback && typeof value.dropdown_click_callback === "function") ? value.dropdown_click_callback : (this._params.dropdown_click_callback || undefined);

        // update widget
        this.update();

        value = null;
        return this;
    }
};
QVirtualShelfCart.prototype.update = function() {
    if (!this._widget) { return false; }
    var params = this._params,
        cacheNodes = this._cache.nodes,
        cartContain = this._widget,
        displayHeader = (jQuery.trim(params.header_text).length > 0),
        displayTxtContain = (params.display_qty || params.display_price),
        btnHeight = 50,
        btnFontSize = 18;

    // update cartContain
    cartContain.dir = (!params.isRTL) ? "LTR" : "RTL";
    cartContain.style.width = params.width + "px";
    cartContain.style.height = "auto";
    cartContain.style.border = "2px solid #CCC";
    cartContain.style.backgroundColor = "#FFF";
    cartContain.style.fontFamily = params.primary_font_family;
    cartContain.style[(!params.isRTL) ? "left" : "right"] = params.left + "px";
    cartContain.style.top = params.top + "px";

    // update header
    if (displayHeader) {
        cacheNodes.header.style.display = (displayHeader) ? "block" : "none";
        cacheNodes.header.style.padding = (displayHeader) ? params.padding + "px" : "";
        cacheNodes.header.style.fontSize = QUtility.convertPxtoEM(params.header_fontsize) + "em";
        cacheNodes.header.style.color = "#" + params.header_fontcolor;
        cacheNodes.header.style.backgroundColor = "#EEE";
        $(cacheNodes.header).html(params.header_text);
        cartContain.insertBefore(cacheNodes.header, cartContain.firstChild);
    } else {
        if (cacheNodes.header.parentNode && cacheNodes.header.parentNode.nodeType === 1) {
            cacheNodes.header.parentNode.removeChild(cacheNodes.header);
        }
    }

    // update itemContain
    cacheNodes.itemContain.style.borderTop = (displayHeader) ? "2px solid #CCC" : "";
    cacheNodes.itemContain.style.maxHeight = params.height + "px";
    cacheNodes.itemContain.style.overflowX = "hidden";
    cacheNodes.itemContain.style.overflowY = "auto";

    // update txtContain
    cacheNodes.txtContain.style.display = (displayTxtContain) ? "block" : "none";
    cacheNodes.txtContain.style.borderTop = (displayTxtContain) ? "2px solid #CCC" : "";
    cacheNodes.txtContain.style.padding = (displayTxtContain) ? params.padding + "px" : "";
    cacheNodes.txtContain.style.height = "auto";
    cacheNodes.txtContain.style.textAlign = (!params.isRTL) ? "right" : "left";
    cacheNodes.txtContain.style.fontSize = QUtility.convertPxtoEM(params.total_fontsize) + "em";
    cacheNodes.txtContain.style.color = "#" + params.total_fontcolor;
    cacheNodes.txtContain.style.backgroundColor = "#EEE";

    // update itemTotalLabel
    cacheNodes.itemTotalLabel.style.display = (params.display_qty) ? "block" : "none";
    cacheNodes.itemTotalLabel.style.paddingBottom = (params.display_price) ? "4px" : "";
    $(cacheNodes.itemTotalLabel).html(params.item_text);

    // update totalLabel
    cacheNodes.totalLabel.style.display = (params.display_price) ? "block" : "none";
    $(cacheNodes.totalLabel).html(params.total_text + " " + params.itemViewArry[0].config().price);

    // update backBtn
    cacheNodes.backBtn.style.width = params.width*0.5 + "px";
    cacheNodes.backBtn.style.height = btnHeight + "px";
    cacheNodes.backBtn.style.lineHeight = btnHeight + "px";
    cacheNodes.backBtn.style.textAlign = "center";
    cacheNodes.backBtn.style.fontSize = QUtility.convertPxtoEM(btnFontSize) + "em";
    cacheNodes.backBtn.style.backgroundColor = "#f9bdbb";
    cacheNodes.backBtn.style.border = "2px solid #757575";
    cacheNodes.backBtn.style.borderRightWidth = "1px";
    $(cacheNodes.backBtn).html(params.backbtn_text);

    // update nextBtn
    cacheNodes.nextBtn.style.width = params.width*0.5 + "px";
    cacheNodes.nextBtn.style.height = btnHeight + "px";
    cacheNodes.nextBtn.style.lineHeight = btnHeight + "px";
    cacheNodes.nextBtn.style.textAlign = "center";
    cacheNodes.nextBtn.style.fontSize = QUtility.convertPxtoEM(btnFontSize) + "em";
    cacheNodes.nextBtn.style.backgroundColor = "#dce775";
    cacheNodes.nextBtn.style.border = "2px solid #757575";
    cacheNodes.nextBtn.style.borderLeftWidth = "1px";
    $(cacheNodes.nextBtn).html(params.nextbtn_text);

    // set whether nextBtn is enabled; This comes into play when cap_value is >= 2 and is a hard cap
    cacheNodes.nextBtn.enabled = !(params.cap_value >= 2);
    cacheNodes.nextBtn.style.cursor = (cacheNodes.nextBtn.enabled) ? "pointer" : "default";
    $(cacheNodes.nextBtn).css({ opacity : (cacheNodes.nextBtn.enabled) ? 1 : 0.5 });
};
QVirtualShelfCart.prototype.show = function() {
    if (!this._widget || !(jQuery.isArray(this._params.itemViewArry) && this._params.itemViewArry.length > 0)) { return false; }
    var cacheNodes = this._cache.nodes,
        cartContain = this._widget,
        params = this._params,
        itemViewArry = params.itemViewArry,
        i = 0, cLen = itemViewArry.length;

    // create cart item divs and add to itemContain
    for (i = 0; i < cLen; i += 1) {
        if (itemViewArry[i].isAnswered()) {
            var cartItem = this.createCartItem(itemViewArry[i]);
            if (cacheNodes.itemContain.children.length > 0) { cartItem.style.borderTop = "1px solid #CCC"; }
            cacheNodes.itemContain.appendChild(cartItem);
        }
    }

    // update nextBtn; This comes into play when cap_value is >= 2 and is a hard cap
    if ((params.cap_value >= 2) && (cacheNodes.nextBtn.enabled !== (params.cap_value === this._cache._cartItemCnt))) {
        cacheNodes.nextBtn.enabled = (params.cap_value === this._cache._cartItemCnt);
        cacheNodes.nextBtn.style.cursor = (cacheNodes.nextBtn.enabled) ? "pointer" : "default";
        $(cacheNodes.nextBtn).css({ opacity : (cacheNodes.nextBtn.enabled) ? 1 : 0.5 });
    }

    // update cartContain
    cartContain.style.display = "block";
    cartContain.style.height =
        ($(cacheNodes.header).outerHeight() +
            $(cacheNodes.itemContain).outerHeight() +
            $(cacheNodes.txtContain).outerHeight() +
            $(cacheNodes.backBtn).outerHeight()) + "px";
};
QVirtualShelfCart.prototype.hide = function() {
    if (!this._widget || this._widget.style.display === 'none') { return false; }
    // hide cart
    this._widget.style.display = "none";

    // reset values
    this._cache._cartTotal = 0;
    this._cache._cartItemCnt = 0;

    // remove current itemContain children
    $(this._cache.nodes.itemContain).scrollTop(0);
    while (this._cache.nodes.itemContain.children.length) {
        this._cache.nodes.itemContain.removeChild(this._cache.nodes.itemContain.firstChild);
    }
};
QVirtualShelfCart.prototype.createCartItem = function(itemView) {
    if (!(itemView && itemView instanceof QVirtualShelfItem)) { return false; }
    var that = this,
        doc = document,
        params = this._params,
        cacheNodes = this._cache.nodes,
        itemContain = doc.createElement("div"),
        thmbContain = doc.createElement("div"),
        thmbImg = doc.createElement("img"),
        txtContain = doc.createElement("div"),
        label = doc.createElement("label"),
        price = undefined,
        qtyContain = doc.createElement("div"),
        qtyLabel = doc.createElement("label"),
        qtyDropdown = doc.createElement("select"),
        removeBtn = doc.createElement("div"),
        itemParams = itemView.config(),
        itemIndex = itemParams.index,
        itemParamsPrice = jQuery.trim(itemParams.price),
        itemPrice = itemParamsPrice.match(/\d+/g),
        hasPrice = (itemPrice && itemPrice.length > 0),
        itemPriceNum = (hasPrice) ? parseFloat(itemPrice[0] + "." + itemPrice[1]) : 0,
        itemPadding = 10,
        txtPadding = 5,
        thmbWidth = 0,
        thmbHeight = 120,
        hasQtyLabel = (jQuery.trim(params.qty_text).length > 0),
        isTouchMove = false,
        imageArray = itemParams.image.split(",");

    // helper function to update cart item total and total text
    var updateCartText = function() {
        var totalStr = (that._cache._isCurFront) ?
            that._cache._currency + that._cache._cartTotal.toFixed(params.total_precision) : that._cache._cartTotal.toFixed(params.total_precision) + that._cache._currency;

        $(cacheNodes.itemTotalLabel).html(params.item_text + " " + that._cache._cartItemCnt);
        $(cacheNodes.totalLabel).html(params.total_text + " " + totalStr);
    };

    // itemContain css
    itemContain.className = "qvs_cart_item_view";
    itemContain.style.cssText += ';'.concat("-webkit-box-sizing: border-box");
    itemContain.style.cssText += ';'.concat("-moz-box-sizing: border-box");
    itemContain.style.cssText += ';'.concat("box-sizing: border-box");
    itemContain.style.position = "relative";
    itemContain.style.width = "100%";
    itemContain.style.height = "auto";
    itemContain.style.padding = itemPadding + "px";
    itemContain.style.fontFamily = params.primary_font_family;

    // thmbContain css
    thmbContain.style.position = "relative";
    thmbContain.style.display = "inline-block";
    thmbContain.style.verticalAlign = "top";
    (QUtility.ieVersion() !== 8) ?
        thmbContain.style.width = "20%":
        thmbContain.style.width = (params.width * 0.18) + "px";
    thmbContain.style.height = thmbHeight + "px";

    // thmbImg css
    thmbImg.style.cssText = "filter: inherit; width: auto; height: auto;";
    thmbImg.style.maxWidth = thmbContain.style.width;
    thmbImg.style.maxHeight = thmbContain.style.height;
    thmbImg.style.position = "absolute";
    thmbImg.style.visibility = "hidden";
    thmbImg.src = imageArray[0];
    $(thmbImg).on("load.qvs_cart_thumb", function() {
        $(this).off("load.qvs_cart_thumb");
        doc.body.appendChild(this);
        thmbWidth = $(thmbContain).outerWidth();
        this.style.maxWidth = thmbWidth + "px";
        this.style.left = (thmbWidth - $(this).width())*0.5 + "px";
        this.style.top = (thmbHeight - $(this).height())*0.5 + "px";
        thmbContain.appendChild(thmbImg);
        this.style.visibility = "";
    }).attr("src", imageArray[0]);

    // txtContain css
    txtContain.style.position = "relative";
    txtContain.style.display = "inline-block";
    txtContain.style.width = "80%";
    txtContain.style.verticalAlign = "top";
    txtContain.style.textAlign = (!params.isRTL) ? "right" : "left";

    // label css
    label.style.cssText += ';'.concat("-webkit-box-sizing: border-box");
    label.style.cssText += ';'.concat("-moz-box-sizing: border-box");
    label.style.cssText += ';'.concat("box-sizing: border-box");
    label.style.fontSize = QUtility.convertPxtoEM(params.label_fontsize) + "em";
    label.style.color = "#" + params.label_fontcolor;
    label.style.padding = txtPadding + "px";
    label.style.position = "relative";
    label.style.display = "block";
    label.style.whiteSpace = "nowrap";
    label.style.overflow = "hidden";
    label.style.borderBottom = (params.display_qty || params.display_price) ? "1px solid #EEEEEE" : "";
    $(label).html(itemParams.label);

    // price css
    price = label.cloneNode(true);
    price.style.borderBottom = (params.display_qty) ? "1px solid #EEEEEE" : "";
    price.style.fontSize = QUtility.convertPxtoEM(params.price_fontsize) + "em";
    price.style.color = "#" + params.price_fontcolor;
    $(price).html(itemParamsPrice);

    // qtyContain css
    qtyContain.style.cssText += ';'.concat("-webkit-box-sizing: border-box");
    qtyContain.style.cssText += ';'.concat("-moz-box-sizing: border-box");
    qtyContain.style.cssText += ';'.concat("box-sizing: border-box");
    qtyContain.style.padding = txtPadding + "px";
    qtyContain.style.fontSize = label.style.fontSize;
    qtyContain.style.color = label.style.color;

    // qtyLabel css
    if (hasQtyLabel) {
        qtyLabel.style.fontSize = QUtility.convertPxtoEM(14) + "em";
        qtyLabel.style.color = "#000";
        qtyLabel.style.position = "relative";
        qtyLabel.style.display = "inline-block";
        qtyLabel.style.verticalAlign = "top";
        qtyLabel.style.whiteSpace = "nowrap";
        $(qtyLabel).html(params.qty_text);
    }

    // qtyDropdown css
    qtyDropdown.style.position = "relative";
    qtyDropdown.style.display = "inline-block";
    qtyDropdown.style.verticalAlign = "top";
    qtyDropdown.style[(!params.isRTL) ? "marginLeft" : "marginRight"] = 5 + "px";
    qtyDropdown.style.fontSize = qtyLabel.style.fontSize;
    qtyDropdown.style.color = qtyLabel.style.color;
    qtyDropdown.style.padding = 0; // to clear qstudio component designer css
    qtyDropdown.style.width = "auto"; // to clear qstudio component designer css
    qtyDropdown.style.top = 0; // to clear qstudio component designer css
    qtyDropdown.style.left = 0; // to clear qstudio component designer css

    // create new qtyDropdown options
    for (var i = 0; i <= params.qty_limit; i+=1) {
        var opt = doc.createElement("option");
        opt.id = "btn_id_" + i;
        opt.className = "qvs_popout_dropdown_option";
        opt.value = i;
        opt.style.display = (i > 0) ? "block" : "none";
        $(opt).html(opt.value);
        qtyDropdown.appendChild(opt);
    }

    // removeBtn css
    removeBtn.style.cssText += ';'.concat("-webkit-box-sizing: border-box");
    removeBtn.style.cssText += ';'.concat("-moz-box-sizing: border-box");
    removeBtn.style.cssText += ';'.concat("box-sizing: border-box");
    removeBtn.style.position = "relative";
    removeBtn.style.display = "inline-block";
    removeBtn.style.border = "2px solid #CCC";
    removeBtn.style.color = "#FF5252";
    removeBtn.style.fontSize = QUtility.convertPxtoEM(15) + "em";
    removeBtn.style.width = "auto";
    removeBtn.style.height = "auto";
    removeBtn.style.padding = 4 + "px";
    removeBtn.style.whiteSpace = "nowrap";
    removeBtn.style.textAlign = "center";
    removeBtn.style.cursor = "pointer";
    $(removeBtn).html(params.removebtn_text || "-");

    // append children
    thmbContain.appendChild(thmbImg);
    if (hasQtyLabel) { qtyContain.appendChild(qtyLabel); }
    qtyContain.appendChild(qtyDropdown);
    txtContain.appendChild(label);
    if (params.display_price && hasPrice) { txtContain.appendChild(price); }
    if (params.display_qty) { txtContain.appendChild(qtyContain); }
    txtContain.appendChild(removeBtn);
    itemContain.appendChild(thmbContain);
    itemContain.appendChild(txtContain);

    // set dropdown selectedIndex
    qtyDropdown.selectedIndex = itemView.qtyDropdown().selectedIndex;

    // update _currency & _isCurFront
    if (this._cache._currency === "") {
        this._cache._currency = (itemParamsPrice.replace(/[0-9.]/g, ''));
        this._cache._isCurFront = (itemParamsPrice.indexOf(this._cache._currency) === 0);
    }

    // update _cartTotal & _cartItemCnt
    that._cache._cartTotal += (itemPriceNum * qtyDropdown.selectedIndex);
    that._cache._cartItemCnt += qtyDropdown.selectedIndex;

    // update cart text
    updateCartText();

    // qtyDropdown click event
    $(qtyDropdown).on(this._events.click, function(event) {
        event.stopImmediatePropagation();

        // fire callback; we assume the dropdown_click_callback will return the qty remaining
        if (that._params.dropdown_click_callback) {
            if (event.type === "click" || event.type === "mouseup") { return; }
            var curItemView = that._params.itemViewArry[itemIndex],
                qtyRemain = that._params.dropdown_click_callback();

            if (QUtility.isNumber(qtyRemain)) {
                // adjust qtyRemain value if itemView is answered
                if (curItemView.isAnswered()) { qtyRemain += curItemView.qtyDropdown().selectedIndex; }

                // disable qtyDropdown options
                for (var i = 0; i < this.children.length; i += 1) {
                    var opt = this.children[i];
                    opt.disabled = ((qtyRemain > 0 && i > qtyRemain) || qtyRemain === 0);
                }
            }
        }
    });

    // qtyDropdown change event
    $(qtyDropdown).on(this._events.change, function(event) {
        var curItemView = that._params.itemViewArry[itemIndex],
            curItemQty = curItemView.qtyDropdown().selectedIndex;

        // refund current item price and item count to cartTotal and cartItemCnt
        if (curItemQty >= 0) {
            that._cache._cartTotal -= (itemPriceNum * curItemQty);
            that._cache._cartItemCnt -= curItemQty;
        }

        // add new item price and item count to cartTotal and cartItemCnt
        that._cache._cartTotal += (itemPriceNum * this.selectedIndex);
        that._cache._cartItemCnt += this.selectedIndex;

        // update cart text
        updateCartText();

        // update curItemView qtyDropdown selectedIndex to match
        curItemView.qtyDropdown().selectedIndex = this.selectedIndex;

        // update nextBtn
        if ((params.cap_value >= 2) && (cacheNodes.nextBtn.enabled !== (params.cap_value === that._cache._cartItemCnt))) {
            cacheNodes.nextBtn.enabled = (params.cap_value === that._cache._cartItemCnt);
            cacheNodes.nextBtn.style.cursor = (cacheNodes.nextBtn.enabled) ? "pointer" : "default";
            $(cacheNodes.nextBtn).css({ opacity : (cacheNodes.nextBtn.enabled) ? 1 : 0.5 });
        }

        // fire dropdown callback; we assume the callback is sendQty method
        if (that._params.dropdown_change_callback) {
            that._params.dropdown_change_callback(
                curItemView.config().index,
                this.selectedIndex
            );
        }
    });

    // removeBtn event
    $(removeBtn).on(this._events.click, function(event) {
        event.stopPropagation();
        if (event.type !== "touchmove") {
            if (event.type !== 'mousedown' && event.type !== 'mouseup' && event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                if (isTouchMove) { return; }
                var curItemView = that._params.itemViewArry[itemIndex];

                // remove item view from itemContain
                itemContain.parentNode.removeChild(itemContain);

                // refund current item price and item count to cartTotal and cartItemCnt
                that._cache._cartTotal -= (itemPriceNum * qtyDropdown.selectedIndex);
                that._cache._cartItemCnt -= qtyDropdown.selectedIndex;

                // update cart text
                updateCartText();

                // reset qtyDropdown selectedIndex
                curItemView.qtyDropdown(true);

                // update nextBtn
                if ((params.cap_value >= 2) && (cacheNodes.nextBtn.enabled !== (params.cap_value === that._cache._cartItemCnt))) {
                    cacheNodes.nextBtn.enabled = (params.cap_value === that._cache._cartItemCnt);
                    cacheNodes.nextBtn.style.cursor = (cacheNodes.nextBtn.enabled) ? "pointer" : "default";
                    $(cacheNodes.nextBtn).css({ opacity : (cacheNodes.nextBtn.enabled) ? 1 : 0.5 });
                }

                // update cartContain height
                that._widget.style.height =
                    ($(cacheNodes.header).outerHeight() +
                        $(cacheNodes.itemContain).outerHeight() +
                        $(cacheNodes.txtContain).outerHeight() +
                        $(cacheNodes.backBtn).outerHeight()) + "px";

                // when there are no more item views hide cart module and fire back callback
                if (!cacheNodes.itemContain.children.length) {
                    that.hide();
                    if (that._params.back_callback) { that._params.back_callback(); }
                }

                // fire remove callback; we assume the callback is manageChange method
                if (that._params.remove_callback) {
                    that._params.remove_callback(curItemView);
                }
            } else {
                isTouchMove = false;
            }
        } else {
            isTouchMove = true;
        }
    });

    return itemContain;
};

// Virtual Shelf Popout Zoom Module
function QVirtualShelfPopout(parent, configObj) {
    // Create popout shell
    var that = this,
        doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        popout = doc.createElement("div"),
        overlay = doc.createElement("div"),
        content = doc.createElement("div"),
        header = doc.createElement("label"),
        contentImgContain = doc.createElement("div"),
        thumbContain = doc.createElement("div"),
        contentDescr = doc.createElement("label"),
        isTouchMove = false;

    // popout CSS; z-index set to 4900
    popout.className = "qvs_popout_view";
    popout.style.position = "absolute";
    popout.style.top = "0px";
    popout.style.left = "0px";
    popout.style.zIndex = 4000;
    popout.style.display = "none";

    // overlay CSS Style
    overlay.className = 'qvs_popout_overlay';
    overlay.style.cssText = "position: absolute; top: 0px; left: 0px; margin: 0px; padding: 0px";

    // content CSS Style
    content.className = 'qvs_popout_gallery';
    content.style.position = "absolute";
    content.style.MozBoxShadow =
        content.style.webkitBoxShadow =
            content.style.boxShadow = '1px 1px 8px #333';

    // header CSS
    header.className = "qvs_popout_header";
    header.style.cssText += ';'.concat("-webkit-box-sizing: border-box");
    header.style.cssText += ';'.concat("-moz-box-sizing: border-box");
    header.style.cssText += ';'.concat("box-sizing: border-box");
    header.style.position = "relative";
    header.style.display = "block";
    header.style.overflow = "hidden";
    header.style.width = "100%";
    header.style.whiteSpace = "nowrap";

    // contentImgContain css
    contentImgContain.className = "qvs_popout_image_container";
    contentImgContain.style.position = "relative";
    contentImgContain.style.display = "block";
    contentImgContain.style.width = "100%";

    // thumbContain css
    thumbContain.className = "qvs_popout_thumb_container";
    thumbContain.style.cssText += ';'.concat("-webkit-box-sizing: border-box");
    thumbContain.style.cssText += ';'.concat("-moz-box-sizing: border-box");
    thumbContain.style.cssText += ';'.concat("box-sizing: border-box");
    thumbContain.style.position = "relative";
    thumbContain.style.display = "block";
    thumbContain.style.overflow = "hidden";
    thumbContain.style.width = "100%";

    // contentDescr css
    contentDescr.className = "qvs_popout_description";
    contentDescr.style.cssText += ';'.concat("-webkit-box-sizing: border-box");
    contentDescr.style.cssText += ';'.concat("-moz-box-sizing: border-box");
    contentDescr.style.cssText += ';'.concat("box-sizing: border-box");
    contentDescr.style.position = "relative";
    contentDescr.style.display = "block";
    contentDescr.style.width = "100%";
    contentDescr.style.height = "auto";
    contentDescr.style.wordWrap = "break-word";
    contentDescr.style.whiteSpace = "normal";
    contentDescr.style.overflowX = "hidden";
    contentDescr.style.overflowY = "auto";

    // Append children
    content.appendChild(header);
    content.appendChild(contentImgContain);
    content.appendChild(thumbContain);
    content.appendChild(contentDescr);
    popout.appendChild(overlay);
    popout.appendChild(content);
    parentEle.appendChild(popout);

    // init core vars
    this._events = {
        mousewheel : "mousewheel.qvs_popout",
        mouseenter : "mouseenter.qvs_popout",
        resize : "resize.qvs_popout",
        change : "change.qvs_popout",
        click : (!QUtility.isMSTouch()) ?
            ((!QUtility.isTouchDevice()) ? "click.qvs_popout" : "touchstart.qvs_popout touchend.qvs_popout touchmove.qvs_popout"):
            ((!QUtility.isTouchDevice()) ? "click.qvs_popout" : ((window.PointerEvent) ? "pointerdown.qvs_popout pointerup.qvs_popout" : "MSPointerDown.qvs_popout MSPointerUp.qvs_popout"))
    };
    this._widget = popout;
    this._params = {};
    this._cache = {};
    this._cache._curImgThmb = undefined;
    this._cache._curItemView = undefined;
    this._cache._minContentWidth = 300;
    this._cache._minContentImgHeight = 260;
    this._cache._thumbContainHeight = 75;
    this._cache._containDescrHeight = 65;
    this._cache._curheaderHeight = 0;
    this._cache._curThumbContainHeight = 0;
    this._cache._curContainDescrHeight = 0;
    this._cache.nodes = {
        overlay : overlay,
        content : content,
        header : header,
        contentImgContain : contentImgContain,
        thumbContain : thumbContain,
        contentDescr : contentDescr
    };

    // this will in-turn call the update method to finalize construction
    this.config(configObj);

    // helper function to change highlighted thumbnail
    var thumbHelper = function(event) {
        // update contentImgContain img
        var contentImg = contentImgContain.firstChild;
        if (contentImg) {
            if (that._cache._curImgThmb) {
                that._cache._curImgThmb.style.borderColor = "#CCC";
                that._cache._curImgThmb = undefined;
            }
            that._cache._curImgThmb = event.currentTarget;
            that._cache._curImgThmb.style.borderColor = "#F44336";

            // update contentImg src & position
            contentImg.src = that._cache._curImgThmb.firstChild.src;
            contentImg.style[(!that._params.isRTL) ? "left" : "right"] = ($(contentImgContain).outerWidth() - $(contentImg).outerWidth())*0.5 + "px";
            contentImg.style.top = ($(contentImgContain).outerHeight() - $(contentImg).outerHeight())*0.5 + "px";
        }
    };

    // resize event
    $(window).on(this._events.resize, function() {
        that.resize();
        that.center();
    });

    // thumbContain mouseenter event
    if (!QUtility.isTouchDevice()) {
        $(thumbContain).on(this._events.mouseenter, ".qvs_popout_image_thumb", function(event) {
            thumbHelper(event);
        });
    } else {
        $(thumbContain).on(this._events.click, ".qvs_popout_image_thumb", function(event) {
            if (event.type !== "touchmove") {
                if (event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                    if (!isTouchMove) { thumbHelper(event); }
                } else {
                    isTouchMove = false;
                }
            } else {
                isTouchMove = true;
            }
        });
    }

    // contentImgContain events
    $([contentImgContain, header]).on(this._events.click, function(event) {
        event.stopPropagation();
        if (event.type !== "touchmove") {
            if (event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                if (isTouchMove) { return; }
                that.hide();
            } else {
                isTouchMove = false;
            }
        } else {
            isTouchMove = true;
        }
    });
}
QVirtualShelfPopout.prototype.initConfigMap = function() {
    if (this._configMap === undefined) {
        this._configMap = {
            isRTL : { value: false, type: "boolean" },
            width : { value: 600, type: "number", min: 1 },
            padding : { value: 10, type: "number", min: 0 },
            overlay_opacity : { value: 80, type: "number", min: 0 },
            descr_fontsize : { value: 16, type: "number", min: 5 },
            primary_font_family : { value: "", type: "string" },
            header_text : { value: "click image to close", type: "string" },
            descr_align : { value: 'left', type: "string", options:['left', 'right', 'center'] },
            bckgrnd_color : { value: 0xFFFFFF, type: "color" },
            overlay_color : { value: 0x000000, type: "color" },
            descr_color : { value: 0x000000, type: "color" }
        };
    }
};
QVirtualShelfPopout.prototype.config = function(value) {
    if (!this._widget) { return null; }

    // acts as getter
    if (typeof value !== 'object') {
        return this._params;
    }

    // acts as setter
    else {
        if (this._configMap === undefined) {
            // create the configMap
            this.initConfigMap();

            // set default parameters
            VirtualShelf.prototype.setParams.apply(this, [this._configMap, true]);
        }

        // set custom parameters
        VirtualShelf.prototype.setParams.apply(this, [value]);

        // update widget
        this.update();

        value = null;
        return this;
    }
};
QVirtualShelfPopout.prototype.update = function() {
    if (!this._widget) { return false; }
    var doc = document,
        params = this._params,
        cacheNodes = this._cache.nodes;

    // update overlay
    $(cacheNodes.overlay).css( {
        "background-color" : '#' + params.overlay_color,
        "width" : $(doc).width() + "px",
        "height" : $(doc).height() + "px",
        "opacity" : params.overlay_opacity * .01
    } );

    // update content
    cacheNodes.content.dir = (!params.isRTL) ? "LTR" : "RTL";
    cacheNodes.content.style.minWidth = this._cache._minContentWidth + "px";
    cacheNodes.content.style.maxWidth = params.width + "px";
    cacheNodes.content.style.height = "auto";
    cacheNodes.content.style.backgroundColor = "#" + params.bckgrnd_color;
    cacheNodes.content.style.fontFamily = params.primary_font_family;

    // update header
    if (params.header_text.length > 0) {
        cacheNodes.content.insertBefore(cacheNodes.header, cacheNodes.content.firstChild);
        cacheNodes.header.style.textAlign = "center";
        cacheNodes.header.style.fontSize = QUtility.convertPxtoEM(16) + "em";
        cacheNodes.header.style.color = "#555";
        cacheNodes.header.style.borderBottom = "2px solid #CCC";
        cacheNodes.header.style.padding = ((params.header_text.length > 0) ? 5 : 0) + "px";
        $(cacheNodes.header).html(params.header_text);
    } else {
        if (cacheNodes.header.parentNode && cacheNodes.header.parentNode.nodeType === 1) {
            cacheNodes.header.parentNode.removeChild(cacheNodes.header);
        }
    }

    // update contentImgContain
    cacheNodes.contentImgContain.style.minHeight = this._cache._minContentImgHeight + "px";

    // update thumbContain
    cacheNodes.thumbContain.style.height = this._cache._thumbContainHeight + "px";

    // update contentDescr
    cacheNodes.contentDescr.style.height = this._cache._containDescrHeight + "px";
    cacheNodes.contentDescr.style.borderTop = "2px solid #CCC";
    cacheNodes.contentDescr.style.fontSize = QUtility.convertPxtoEM(params.descr_fontsize) + "em";
    cacheNodes.contentDescr.style.textAlign = (!params.isRTL) ? params.descr_align : (params.descr_align !== "left") ? params.descr_align : "";
    cacheNodes.contentDescr.style.color = "#" + params.descr_color;
};
QVirtualShelfPopout.prototype.show = function(itemView) {
    if (!this._widget || !(itemView && itemView instanceof QVirtualShelfItem)) { return false; }
    var doc = document,
        params = this._params,
        popout = this._widget,
        cacheNodes = this._cache.nodes,
        itemParams = itemView.config(),
        img = doc.createElement("img"),
        imageArray = itemParams.image.split(","),
        contentImgWidth = 0,
        contentImgHeight = 0;

    // helper function to create thumbnails
    var createThumbHelper = function(image) {
        if (QUtility.isString(image) && jQuery.trim(image).length > 0) {
            // create thumbnail image and add to thumbContain
            var thmbContain = doc.createElement("div"),
                thmb = doc.createElement("img");

            // append children
            thmbContain.appendChild(thmb);
            cacheNodes.thumbContain.appendChild(thmbContain);

            // thmbContain css
            thmbContain.className = "qvs_popout_image_thumb";
            thmbContain.style.position = "relative";
            thmbContain.style.display = "inline-block";
            thmbContain.style.width = 46 + "px";
            thmbContain.style.height = 46 + "px";
            thmbContain.style.padding = 4 + "px";
            thmbContain.style.border = "1px solid #CCC";
            thmbContain.style.marginRight = 10 + "px";

            // thmb css
            thmb.style.cssText = "filter: inherit; width: auto; height: auto; margin: auto;";
            thmb.style.position = "absolute";
            thmb.style.maxWidth = thmbContain.style.width;
            thmb.style.maxHeight = thmbContain.style.height;
            thmb.style.top = thmb.style.left = thmb.style.bottom = thmb.style.right = 0;
            thmb.src = image;
        }
    };

    // prevent pinching and scaling on touch devices
    if (QUtility.isTouchDevice()) {
        if (this._cache.metaTag === undefined) {
            this._cache.metaTag = doc.createElement('meta');
            this._cache.metaTag.id = "qvirtualshelf_meta_scale";
            this._cache.metaTag.name = "viewport";
            doc.getElementsByTagName('head')[0].appendChild(this._cache.metaTag);
        }

        this._cache.metaTag.content = "width=device-width, user-scalable=no";
    }

    // display popout
    popout.style.display = "block";

    // record current itemView being displayed
    this._cache._curItemView = itemView;

    // record header height
    this._cache._curheaderHeight = $(cacheNodes.header).outerHeight();

    // remove previous images from thumbContain
    while (cacheNodes.thumbContain.firstChild) {
        cacheNodes.thumbContain.removeChild(cacheNodes.thumbContain.firstChild);
    }

    // check if we need thumbnails for additional images
    if (imageArray.length > 1) {
        // append thumbContain to content
        $(cacheNodes.thumbContain).insertAfter(cacheNodes.contentImgContain);

        // create thumbnails
        for (var i = 0; i < imageArray.length; i += 1) {
            createThumbHelper(imageArray[i]);
        }

        // highlight first thumbnail
        this._cache._curImgThmb = cacheNodes.thumbContain.firstChild;
        this._cache._curImgThmb.style.borderColor = "#F44336";
    } else {
        if (cacheNodes.thumbContain.parentNode && cacheNodes.thumbContain.parentNode.nodeType === 1) {
            cacheNodes.thumbContain.parentNode.removeChild(cacheNodes.thumbContain);
        }
    }

    // update thumbContain
    this._cache._curThumbContainHeight = ((imageArray.length > 1) ? this._cache._thumbContainHeight : 0);
    cacheNodes.thumbContain.style.height = this._cache._curThumbContainHeight + "px";
    cacheNodes.thumbContain.style.padding = ((imageArray.length > 1) ? params.padding : 0) + "px";

    // update contentDescr
    this._cache._curContainDescrHeight = ((itemParams.description.length > 0) ? this._cache._containDescrHeight : 0);
    cacheNodes.contentDescr.style.height = this._cache._curContainDescrHeight + "px";
    cacheNodes.contentDescr.style.padding = ((itemParams.description.length > 0) ? params.padding : 0) + "px";
    if (itemParams.description.length > 0) {
        cacheNodes.content.appendChild(cacheNodes.contentDescr);
        $(cacheNodes.contentDescr).html(itemParams.description);
    } else {
        if (cacheNodes.contentDescr.parentNode && cacheNodes.contentDescr.parentNode.nodeType === 1) {
            cacheNodes.contentDescr.parentNode.removeChild(cacheNodes.contentDescr);
        }
    }

    // call resize and center methods
    this.resize();
    this.center();

    // resize & record contentImg dimensions
    contentImgWidth = $(cacheNodes.contentImgContain).outerWidth();
    contentImgHeight = $(cacheNodes.contentImgContain).outerHeight();

    // update contentImgContain
    img.style.cssText = "filter: inherit; width: auto; height: auto;";
    img.style.cssText += ';'.concat("-webkit-box-sizing: border-box");
    img.style.cssText += ';'.concat("-moz-box-sizing: border-box");
    img.style.cssText += ';'.concat("box-sizing: border-box");
    img.style.padding = params.padding + "px";
    img.style.maxWidth = contentImgWidth + "px";
    img.style.maxHeight = contentImgHeight + "px";
    img.style.position = "absolute";
    img.style.visibility = "hidden";
    img.src = imageArray[0];
    $(img).on("load.qvirtualshelf", function() {
        $(this).off("load.qvirtualshelf");
        doc.body.appendChild(this);
        this.style[(!params.isRTL) ? "left" : "right"] = (contentImgWidth - $(this).outerWidth())*0.5 + "px";
        this.style.top = (contentImgHeight - $(this).outerHeight())*0.5 + "px";
        // remove previous images from contentImgContain
        while (cacheNodes.contentImgContain.firstChild) {
            cacheNodes.contentImgContain.removeChild(cacheNodes.contentImgContain.firstChild);
        }
        // append new image
        cacheNodes.contentImgContain.appendChild(this);
        this.style.visibility = "";
    }).attr("src", imageArray[0]);
};
QVirtualShelfPopout.prototype.hide = function() {
    if (!this._widget || this._widget.style.display === 'none') { return false; }
    this._widget.style.display = "none";
    var doc = document,
        cacheNodes = this._cache.nodes;

    // clear body style settings
    doc.body.style.height = this._cache._bodyStyle.height;
    doc.body.style.overflow = this._cache._bodyStyle.overflow;
    delete this._cache._bodyStyle;

    // remove mousewheel scrolling event
    $(doc.body).off(this._events.mousewheel);

    // housekeeping
    $(cacheNodes.contentDescr).scrollTop(0);
    if (this._cache._curItemView !== undefined) { this._cache._curItemView = undefined; }
    if (this._cache.metaTag) { this._cache.metaTag.content = "width=device-width, user-scalable=yes"; }
};
QVirtualShelfPopout.prototype.resize = function() {
    if (!this._widget || this._widget.style.display === 'none') { return false; }
    var doc = document,
        wind = window,
        cacheNodes = this._cache.nodes,
        img = cacheNodes.contentImgContain.firstChild,
        windWidth = $(wind).width(),
        windHeight = $(wind).height(),
        contentPadding = 25,
        contentWidth = Math.min((windWidth - contentPadding), this._params.width),
        contentImgHeight =
            (windHeight - contentPadding - this._cache._curheaderHeight - this._cache._curThumbContainHeight - this._cache._curContainDescrHeight);

    // temporarily add style to doc.body to prevent scrolling
    if (this._cache._bodyStyle === undefined) {
        this._cache._bodyStyle = {
            height : doc.body.style.height,
            overflow : doc.body.style.overflow
        };

        doc.body.style.height = "100%";
        doc.body.style.overflow = "hidden";

        // prevent mousewheel scrolling
        $(doc.body).on(this._events.mousewheel, function(event) {
            event.preventDefault();
        });
    }

    // set content width
    cacheNodes.content.style.width = contentWidth + "px";

    // set contentImgContain height
    cacheNodes.contentImgContain.style.height = contentImgHeight + "px";

    // set image max dimensions
    if (img) {
        img.style.maxWidth = Math.max(contentWidth, this._cache._minContentWidth) + "px";
        img.style.maxHeight = Math.max(contentImgHeight, this._cache._minContentImgHeight) + "px";
    }

    // set overlay dimensions
    cacheNodes.overlay.style.height = $(doc).height() + "px";
    cacheNodes.overlay.style.width = $(doc).width() + "px";
};
QVirtualShelfPopout.prototype.center = function() {
    if (!this._widget || this._widget.style.display === 'none') { return false; }
    var wind = window,
        cacheNodes = this._cache.nodes,
        img = cacheNodes.contentImgContain.firstChild,
        x = $(wind).scrollLeft() + ($(wind).width() / 2) - ($(cacheNodes.content).outerWidth() / 2),
        y = $(wind).scrollTop() + ($(wind).height() / 2) - ($(cacheNodes.content).outerHeight() / 2);

    // Position the box, horizontally/vertically, in the middle of the window
    if (x < 0) { x = 0; }
    if (y < 0) { y = 0; }

    // Set the adjusted position of the element
    cacheNodes.content.style.left = x + 'px';
    cacheNodes.content.style.top = y + "px";

    // set image position
    if (img) {
        img.style[(!this._params.isRTL) ? "left" : "right"] = ($(cacheNodes.contentImgContain).outerWidth() - $(img).outerWidth())*0.5 + "px";
        img.style.top = ($(cacheNodes.contentImgContain).outerHeight() - $(img).outerHeight())*0.5 + "px";
    }
};