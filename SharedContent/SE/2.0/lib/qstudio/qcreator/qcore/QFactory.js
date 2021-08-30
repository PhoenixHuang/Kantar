/**
 * QFactory Javascript File
 * Version : 1.2.0
 * Date : 2014-06-17
 *
 * Contains numerous utility functions.
 * Factory for widgets and layouts. Also creates a Preloader Widget.
 *
 * Release 1.2.0
 * - Added a new method isSurveyRTL to detect when Decipher/Dimensions has right-to-left enabled.
 * - Added a new method convertPxtoEM for use w/ label fields.
 * - Updated isTouchDevice method to use the same test in Modernizr 2.8.2 (touch test)
 * - Updated isMSTouch method per http://msdn.microsoft.com/en-us/library/dn304886(v=vs.85).aspx
 *
 */

'use strict';
var console = window.console || { log: function() {} };
var QUtility = {
    isSurveyRTL : function() {
        return (
            // Check on HTML element
            document.documentElement.dir.toLowerCase() === 'rtl' ||
            ((document.documentElement.currentStyle) ? document.documentElement.currentStyle['direction'].toLowerCase() === 'rtl' : false) ||
            ((typeof getComputedStyle !== "undefined") ? getComputedStyle(document.documentElement).getPropertyValue('direction').toLowerCase() === 'rtl' : false) ||
            // Check on Body element
            document.body.dir.toLowerCase() === 'rtl' ||
            ((document.body.currentStyle) ? document.body.currentStyle['direction'].toLowerCase() === 'rtl' : false) ||
            ((typeof getComputedStyle !== "undefined") ? getComputedStyle(document.body).getPropertyValue('direction').toLowerCase() === 'rtl' : false)
        );
    },

    convertPxtoEM : function(px) {
        // assume 1em = 16pixel
        return (px / 16);
    },

    isNumber : function(value) {
        return !!(!isNaN(parseFloat(value)) && isFinite(value));
    },

    // *Considers empty string a string
    isString : function(value) {
        return !!(typeof value === "string");
    },

    orderParams: function(value) {
        if (typeof value === "object") {
            var i = 1;
            for (var key in value) {
                if (value[key].order) { value[key].order = i; }
                i++;
            }

            return value;
        }

        return false;
    },

    paramToHex: function(value) {
        if (typeof value === "number") {
            value = value.toString(16);
            while(value.length < 6) { value = "0" + value; }
        }

        if (typeof value === "string") {
            value = jQuery.trim(value.toLowerCase());
            if (value.charAt(0) === "#") { value = value.substring(1); }
            // if (value.length > 6) { value = value.substring(0, 6); }
            if (!(/(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i.test(value))) { return false; }
            return value;
        }

        return false;
    },

    hexToRgb: function(value) {
        if (value === null || value === undefined) { return false; }
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 0, b: 0 };
    },

    utilSecToTime : function(value) {
        var minutes = (parseInt( value / 59 ) % 59).toFixed(0),
            seconds = (value % 59).toFixed(0);

        return (minutes < 10 ? "0" + minutes : minutes) + ":" +
            (seconds  < 10 ? "0" + seconds : seconds);
    },

    utilMilliToTime : function(value) {
        var minutes = ((parseInt( value / 60000) % 60000)%60).toFixed(0),
            seconds = (((parseInt( value / 1000) % 1000))%60).toFixed(0),
            milli = value % 1000;

        return (minutes < 10 ? "0" + minutes : minutes) + ":" +
            (seconds  < 10 ? "0" + seconds : seconds) + ":" +
            ((milli<100) ? ((milli<10) ? ("00" + milli) : ("0" + milli)) : milli);
    },

    setConfigMap : function(arg_map) {
        var input_map = arg_map.input_map,
            settable_map = arg_map.settable_map,
            config_map = arg_map.config_map,
            key_name, error;

        for ( key_name in input_map ){
            if ( input_map.hasOwnProperty( key_name ) ){
                if ( config_map.hasOwnProperty( key_name ) ){
                    config_map[key_name] = input_map[key_name];
                }
            }
        }

        arg_map = null;
    },

    isTouchDevice : function fnIsTouchDevice() {
        if (!fnIsTouchDevice._isTouchDevice) {
            fnIsTouchDevice._isTouchDevice = (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
        }

        return !!fnIsTouchDevice._isTouchDevice;
    },

    isMSTouch : function fnIsMSTouch() {
        if (!fnIsMSTouch._isMSTouch) {
            fnIsMSTouch._isMSTouch = (window.PointerEvent || window.MSPointerEvent);
        }

        return !!fnIsMSTouch._isMSTouch;
    },

    ieVersion: function fnIeVersion() {
        if (!fnIeVersion._ieVersion) {
            fnIeVersion._ieVersion =
                document.documentMode ||
                    ((navigator.appVersion.indexOf('MSIE')+1) ? parseFloat(navigator.appVersion.split('MSIE')[1]) : 999);
        }

        return fnIeVersion._ieVersion;
    },

    getQStudioSurveyScale : function fnScale() {
        var ele = $('.DropShadow')[0],
            matrix =
                $(ele).css('transform') ||
                $(ele).css('-moz-transform') ||
                $(ele).css('-o-transform') ||
                $(ele).css('-ms-transform') ||
                $(ele).css('-webkit-transform'),
            matrixPattern = /^\w*\((((\d+)|(\d*\.\d+)),\s*)*((\d+)|(\d*\.\d+))\)/i,
            matrixValue = [];

        if (matrixPattern.test(matrix)) { // When it satisfy the pattern.
            var matrixCopy = matrix.replace(/^\w*\(/, '').replace(')', '');
            matrixValue = matrixCopy.split(/\s*,\s*/);

            return {
                a : (matrixValue[0] >= 0) ? matrixValue[0] : 1, // X-scale
                d : (matrixValue[3] >= 0) ? matrixValue[3] : 1, // Y-scale,
                width : parseInt(ele.style.width, 10),
                height : parseInt(ele.style.height, 10)
            };
        }

        return { a : 1, d : 1 };
    }
};

var QLightBoxManager = null;
var QToolTipManager = null;
var QMsgDisplayManager = null;
var QStudioCompFactory = {
    // Widget Factory
    widgetFactory: function(type, parent, configObj) {
        type = (typeof type === 'string') ? type.toLowerCase() : "";
        var widget = null;
        switch (type) {
            case "other":
                widget = new QBaseInputBtn(parent, configObj);
                widget.isNumeric(false);
                break;
            case "other numeric":
                widget = new QBaseInputBtn(parent, configObj);
                widget.isNumeric(true);
                break;
            case "kantarother":
                widget = new QKantarInputBtn(parent, configObj);
                widget.isNumeric(false);
                break;
            case "kantarother numeric":
                widget = new QKantarInputBtn(parent, configObj);
                widget.isNumeric(true);
                break;
            case "basebucket":
                widget = new QBaseBucket(parent, configObj);
                break;
            case "baseslider":
                widget = new QBaseSlider(parent, configObj);
                break;
            case "radiocheck":
                widget = new QRadioCheckBtn(parent, configObj);
                break;
            case "text":
                widget = new QTextBtn(parent, configObj);
                break;
            case "flow":
                widget = new QFlowBtn(parent, configObj);
                break;
            case "kantarbase":
                widget = new QKantarBaseBtn(parent, configObj);
                break;
            case "flagbtn":
                widget = new QBaseFlagBtn(parent, configObj);
                break;
            default:
                widget = new QBaseBtn(parent, configObj);
                break;
        }

        type = null;
        return widget;
    },

    // Layout Factory
    layoutFactory: function(type, parent, configObj) {
        type = (typeof type === 'string') ? type.toLowerCase() : "";
        var layout = null;
        switch (type) {
            case "horizontal":
                layout = new QHorizontalLayout(parent, configObj);
                break;
            case "vertical":
                layout = new QVerticalLayout(parent, configObj);
                break;
            case "set":
                layout = new QSetLayout(parent, configObj);
                break;
            case "scroll":
                layout = new QScrollLayout(parent, configObj);
                break;
            case "sequential":
                layout = new QSeqLayout(parent, configObj);
                break;
            default:
                layout = new QBaseLayout(parent, configObj);
                break;
        }

        type = null;
        return layout;
    },

    lightBoxFactory: function(type, parent, configObj) {
        type = (typeof type === 'string') ? type.toLowerCase() : "";
        switch (type) {
            default:
                QLightBoxManager = QBaseLightBox.getInstance(parent, configObj);
                break;
        }

        type = null;
    },

    toolTipFactory: function(type, parent, configObj) {
        type = (typeof type === 'string') ? type.toLowerCase() : "";
        switch (type) {
            default:
                QToolTipManager = QBaseToolTip.getInstance(parent, configObj);
                break;
        }

        type = null;
    },

    msgDisplayFactory: function(type, configObj) {
        type = (typeof type === 'string') ? type.toLowerCase() : "";
        switch (type) {
            default:
                QMsgDisplayManager = QBaseMsgDisplay.getInstance(configObj);
                break;
        }

        type = null;
    }
};

// Preloader View
var QPreloader = function() {
    var that = this,
        initModule;

    this.configMap = {
        settable_map : {
            width : undefined,
            height : undefined
        },

        width : 101,
        height : 20
    };

    this.stateMap = {
        loader : undefined
    };

    initModule = function(parent) {
        if (that.stateMap.loader) { return false; }
        parent = (parent && parent.nodeType === 1) ? parent : document.body;
        that.stateMap.loader = that.create();
        parent.appendChild(that.stateMap.loader);
        return true;
    };

    return {
        configModule : function(configObj) {
            QUtility.setConfigMap({
                input_map    : configObj,
                settable_map : that.configMap.settable_map,
                config_map   : that.configMap
            });
        },
        initModule : initModule,
        getLoader : function() {
            return that.stateMap.loader;
        },
        destroy : function() {
            return that.destroy();
        }
    };
};
QPreloader.prototype = {
    create : function() {
        var doc = document,
            configMap = this.configMap,
            loader = doc.createElement("div"),
            background = doc.createElement("div"),
            barContain = doc.createElement("div"),
            bar = undefined,
            msg = doc.createElement("div"),
            barCnt = 10,
            barWidth = 10,
            colorArry = [
                "#f0ba91",
                "#f0b486",
                "#f0ad79",
                "#f0a66d",
                "#f1a164",
                "#f29b58",
                "#f3954d",
                "#f28d40",
                "#f38733",
                "#f37f26"
            ];

        // Loader css
        loader.className = "qpreloader";
        loader.style.position = "absolute";
        loader.style.zIndex = 5000;

        // Background css
        background.style.position = "relative";
        background.style.width = configMap.width + "px";
        background.style.height = configMap.height + "px";
        background.style.border = "2px solid #f37f26";
        background.style.backgroundColor = "#f5f5f5";

        // Bar container css
        barContain.style.position = "relative";
        barContain.style.width = configMap.width + "px";
        barContain.style.height = configMap.height + "px";

        // Bar css
        for (var i = 0; i<barCnt; i+=1) {
            bar = doc.createElement("div");
            bar.id = "bar_id_"+i;
            bar.style.position = "absolute";
            bar.style.top = "1px";
            bar.style.left = (1+(i*barWidth)) + "px";
            bar.style.width = (barWidth-1) + "px";
            bar.style.height = (configMap.height-2) + "px";
            bar.style.backgroundColor = colorArry[i];
            $(bar).css({ opacity:0 });
            barContain.appendChild(bar);
        }

        // Message css
        msg.style.position = "relative";
        msg.style.width = configMap.width + "px";
        msg.style.textAlign = "center";
        msg.style.color = "#555";
        msg.style.fontSize = 15 + "px";
        msg.style.display = "none";
        msg.innerHTML = "Loading...";

        // Append children
        background.appendChild(barContain);
        loader.appendChild(background);
        loader.appendChild(msg);

        // Loop animation
        var animateCnt = 0,
            animateLeft = true,
            helperAnim = undefined;

        helperAnim = function(bar, duration, isLeft) {
            var alpha = (isLeft) ? 1 : 0;
            setTimeout(function() {
                $(bar).animate({ opacity:alpha }, 200, function() {
                    animateCnt++;
                    if (animateCnt === barCnt) {
                        animateCnt = 0;
                        animateLeft = !animateLeft;
                        for (var j = 0; j<barCnt; j+=1) {
                            var bar_j = barContain.children[(animateLeft) ? j : (barCnt-1-j)];
                            helperAnim(bar_j, j*200, animateLeft);
                        }
                    }
                });
            }, duration);
        };

        for (var i = 0; i<barCnt; i+=1) {
            bar = barContain.children[i];
            helperAnim(bar, i*200, animateLeft);
        }

        return loader;
    },

    destroy : function() {
        if (!this.stateMap.loader) { return false; }
        this.stateMap.loader.parentNode.removeChild(this.stateMap.loader);
        this.stateMap.loader = undefined;
        return true;
    }
};