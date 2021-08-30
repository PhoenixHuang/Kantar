//var console = window.console || { log: function() {} };
var QUtility = {
    getBtnIsRadio: function(dataSetObj, retBool) {
        retBool = !!(typeof retBool === "boolean" && retBool);
        if (typeof dataSetObj.var2 === "boolean") {
            return dataSetObj.var2;
        } else if (typeof dataSetObj.isRadio === "boolean") {
            return dataSetObj.isRadio;
        } else if (QUtility.isString(dataSetObj.var2)) {
            dataSetObj.var2 = jQuery.trim(dataSetObj.var2).toLowerCase();
            if (dataSetObj.var2 === "true")  { return true; }
            if (dataSetObj.var2 === "false")  { return false; }
        } else if (QUtility.isString(dataSetObj.isRadio)) {
            dataSetObj.isRadio = jQuery.trim(dataSetObj.isRadio).toLowerCase();
            if (dataSetObj.isRadio === "true")  { return true; }
            if (dataSetObj.isRadio === "false")  { return false; }
        }

        return retBool;
    },

    isDebugMode : function isDebugMode(value) {
        if (!isDebugMode._isDebugMode) {
            isDebugMode._isDebugMode = (typeof value === "boolean") ? value : false;
            if (!isDebugMode._isDebugMode) {
                console.log = function() {};
            } else {
                console = window.console || { log: function() {} };
            }
        }

        return isDebugMode._isDebugMode;
    },

    isiPhone : function() {
        return /(iPhone|iPod)/g.test( navigator.userAgent );
    },

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

    isNumber : function(value) {
        return (!isNaN(parseFloat(value)) && isFinite(value));
    },

    // Considers empty string a string
    isString : function(value) {
        return (typeof value === "string");
    },

    isTouchDevice : function fnIsTouchDevice() {
        if (!fnIsTouchDevice._isTouchDevice) {
            fnIsTouchDevice._isTouchDevice = (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
            // If false but isMSTouch return true
            if (!fnIsTouchDevice._isTouchDevice && this.isMSTouch() && ((navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))) {
                fnIsTouchDevice._isTouchDevice = true;
            }
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
    },

    setConfigMap : function(arg_map) {
        var input_map = arg_map.input_map,
            config_map = arg_map.config_map,
            key_name;

        for ( key_name in input_map ){
            if ( input_map.hasOwnProperty( key_name ) ){
                if ( config_map.hasOwnProperty( key_name ) ){
                    config_map[key_name] = input_map[key_name];
                }
            }
        }

        arg_map = null;
    },

    jQueryAddEasing : function jQueryAddEasing() {
        if (!jQueryAddEasing._easingAdded) {
            jQueryAddEasing._easingAdded = true;
            // t: current time, b: begInnIng value, c: change In value, d: duration
            $.easing.jswing = $.easing.swing;
            $.extend($.easing, {
                def: 'easeOutQuad',
                swing: function (x, t, b, c, d) {
                    //alert($.easing.default);
                    return $.easing[$.easing.def](x, t, b, c, d);
                },
                easeInQuad: function (x, t, b, c, d) {
                    return c*(t/=d)*t + b;
                },
                easeOutQuad: function (x, t, b, c, d) {
                    return -c *(t/=d)*(t-2) + b;
                },
                easeInOutQuad: function (x, t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t + b;
                    return -c/2 * ((--t)*(t-2) - 1) + b;
                },
                easeInCubic: function (x, t, b, c, d) {
                    return c*(t/=d)*t*t + b;
                },
                easeOutCubic: function (x, t, b, c, d) {
                    return c*((t=t/d-1)*t*t + 1) + b;
                },
                easeInOutCubic: function (x, t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t + b;
                    return c/2*((t-=2)*t*t + 2) + b;
                },
                easeInQuart: function (x, t, b, c, d) {
                    return c*(t/=d)*t*t*t + b;
                },
                easeOutQuart: function (x, t, b, c, d) {
                    return -c * ((t=t/d-1)*t*t*t - 1) + b;
                },
                easeInOutQuart: function (x, t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                    return -c/2 * ((t-=2)*t*t*t - 2) + b;
                },
                easeInQuint: function (x, t, b, c, d) {
                    return c*(t/=d)*t*t*t*t + b;
                },
                easeOutQuint: function (x, t, b, c, d) {
                    return c*((t=t/d-1)*t*t*t*t + 1) + b;
                },
                easeInOutQuint: function (x, t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                    return c/2*((t-=2)*t*t*t*t + 2) + b;
                },
                easeInSine: function (x, t, b, c, d) {
                    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
                },
                easeOutSine: function (x, t, b, c, d) {
                    return c * Math.sin(t/d * (Math.PI/2)) + b;
                },
                easeInOutSine: function (x, t, b, c, d) {
                    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
                },
                easeInExpo: function (x, t, b, c, d) {
                    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
                },
                easeOutExpo: function (x, t, b, c, d) {
                    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
                },
                easeInOutExpo: function (x, t, b, c, d) {
                    if (t==0) return b;
                    if (t==d) return b+c;
                    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
                },
                easeInCirc: function (x, t, b, c, d) {
                    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
                },
                easeOutCirc: function (x, t, b, c, d) {
                    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
                },
                easeInOutCirc: function (x, t, b, c, d) {
                    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
                },
                easeInElastic: function (x, t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                },
                easeOutElastic: function (x, t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
                },
                easeInOutElastic: function (x, t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
                },
                easeInBack: function (x, t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c*(t/=d)*t*((s+1)*t - s) + b;
                },
                easeOutBack: function (x, t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                },
                easeInOutBack: function (x, t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
                },
                easeInBounce: function (x, t, b, c, d) {
                    return c - $.easing.easeOutBounce (x, d-t, 0, c, d) + b;
                },
                easeOutBounce: function (x, t, b, c, d) {
                    if ((t/=d) < (1/2.75)) {
                        return c*(7.5625*t*t) + b;
                    } else if (t < (2/2.75)) {
                        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                    } else if (t < (2.5/2.75)) {
                        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                    } else {
                        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                    }
                },
                easeInOutBounce: function (x, t, b, c, d) {
                    if (t < d/2) return $.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
                    return $.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
                }
            });
        }
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

    convertPxtoEM : function(px) {
        // assume 1em = 16pixel
        return (px / 16);
    },

    paramToHex: function(value) {
        if (this.isNumber(value)) {
            (this.isString(value)) ?
                value = parseInt(value, 16).toString(16):
                value = value.toString(16);

            while(value.length < 6) { value = "0" + value; }
        }

        if (this.isString(value)) {
            value = jQuery.trim(value.toLowerCase());
            if (value.charAt(0) === "#") { value = value.substring(1); }
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
                configObj = configObj || {};
                configObj.label_trim = false;
                widget = new QFlowBtn(parent, configObj);
                break;
            case "kantarbase":
                configObj = configObj || {};
                configObj.label_trim = true;
                widget = new QFlowBtn(parent, configObj);
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
        QLightBoxManager = qLightBoxSingleton.getInstance(parent, configObj);
    },

    toolTipFactory: function(type, parent, configObj) {
        QToolTipManager = qToolTipSingleton.getInstance(parent, configObj);
    },

    msgDisplayFactory: function(type, configObj) {
        QMsgDisplayManager = qMsgDisplaySingleton.getInstance(configObj);
    }
};

// Preloader Widget used in components
function QPreloader() {
    var that = this;

    // init configMap
    this.configMap = {
        width : 101,
        height : 20
    };

    // will store ref to loader element
    this.preloader = undefined;

    return {
        configModule : function(configObj) {
            QUtility.setConfigMap({
                input_map    : configObj,
                config_map   : that.configMap
            });
        },

        initModule : function(parent) {
            if (that.preloader) { return false; }
            parent = (parent && parent.nodeType === 1) ? parent : document.body;
            // create preloader and append to parent
            that.preloader = that.create();
            parent.appendChild(that.preloader);
            return true;
        },

        getLoader : function() {
            return that.preloader;
        },

        destroy : function() {
            if (!that.preloader) { return false; }
            that.preloader.parentNode.removeChild(that.preloader);
            that.preloader = undefined;
            return true;
        }
    };
}
QPreloader.prototype.create = function() {
    var doc = document,
        loader = doc.createElement("div"),
        background = doc.createElement("div"),
        barContain = doc.createElement("div"),
        bar = undefined,
        barCnt = 10,
        barWidth = 10,
        colorArry = [
            "#b0120a",
            "#c41411",
            "#d01716",
            "#dd191d",
            "#e51c23",
            "#e84e40",
            "#f36c60",
            "#f69988",
            "#f9bdbb",
            "#fde0dc"
        ],
        animateCnt = 0,
        animateLeft = true,
        animTime = 150,
        helperAnim = undefined;

    // Loader container css
    loader.className = "qpreloader";
    loader.style.position = "absolute";
    loader.style.zIndex = 5000;

    // Background css
    background.style.position = "relative";
    background.style.width = this.configMap.width + "px";
    background.style.height = this.configMap.height + "px";
    background.style.border = "1px solid #bdbdbd";
    background.style.backgroundColor = "#f5f5f5";

    // Bar container css
    barContain.style.position = "relative";
    barContain.style.width = "100%";
    barContain.style.height = "100%";

    // Create bars to animate and append to barContain
    for (var i = 0; i<barCnt; i+=1) {
        bar = doc.createElement("div");
        bar.id = "bar_id_" + i;
        $(bar).css({
            opacity : 0,
            position : "absolute",
            top : "1px",
            left : (1 + (i*barWidth)) + "px",
            width : (barWidth - 1) + "px",
            height : (this.configMap.height - 2) + "px",
            backgroundColor : colorArry[i]
        });
        barContain.appendChild(bar);
    }

    // Append children
    background.appendChild(barContain);
    loader.appendChild(background);

    // Loop animation
    helperAnim = function(bar, duration, isLeft) {
        var alpha = (isLeft) ? 1 : 0;
        setTimeout(function() {
            $(bar).animate({ opacity : alpha }, animTime, function() {
                animateCnt++;
                if (animateCnt === barCnt) {
                    animateCnt = 0;
                    animateLeft = !animateLeft;
                    for (var j = 0; j<barCnt; j+=1) {
                        var bar_j = barContain.children[(animateLeft) ? j : (barCnt - 1 - j)];
                        helperAnim(bar_j, j*animTime, animateLeft);
                    }
                }
            });
        }, duration);
    };

    // Init animation
    for (var i = 0; i<barCnt; i+=1) {
        bar = barContain.children[i];
        helperAnim(bar, i*animTime, animateLeft);
    }

    return loader;
};

// QStudio Layout Abstract
function QLayoutAbstract() {}
QLayoutAbstract.prototype = {
    initConfigMap : function() {
        if (this._configMap === undefined) {
            this._configMap = {
                isRTL : { value: false, type: "boolean" },
                id : { value: "", type: "string" },
                label : { value: "", type: "string" },
                width : { value: 800, type: "number", min: 50 },
                height : { value: 600, type: "number", min: 50 },
                padding : { value: 10, type: "number", min: 0 },
                autoWidth : { value: true, type: "boolean" },
                autoHeight : { value: true, type: "boolean" },
                primary_font_family : { value: "", type: "string" },
                secondary_font_family : { value: "", type: "string" },
                position : { value: 'relative', type: "string", options:['absolute', 'relative'] },
                overflow : { value: 'auto', type: "string", options:['hidden', 'visible', 'auto'] },
                left : { value: 0, type: "number" },
                top : { value: 0, type: "number" },
                hgap : { value: 16, type: "number" },
                vgap : { value: 16, type: "number" },
                border_style : { value: 'none', type: "string", options:['solid', 'none', 'dotted', 'dashed'] },
                border_width : { value: 0, type: "number", min: 0 },
                border_radius : { value: 0, type: "number", min: 0 },
                border_color : { value: 0xCCCCCC, type: "color" },
                show_bckgrnd : { value: false, type: "boolean" },
                bckgrnd_color : { value: 0xFFFFFF, type: "color" },
                show_label : { value: false, type: "boolean" },
                label_halign : { value: 'left', type: "string", options:['left', 'right', 'center'] },
                label_fontsize : { value: 18, type: "number", min: 10 },
                label_fontcolor : { value: 0x333333, type: "color" },
                label_padding : { value: 4, type: "number", min: 0 },
                show_bckgrnd_import : { value: false, type: "boolean" },
                bckgrnd_import : { value: "", type: "string" },
                bckgrnd_import_top : { value: 0, type: "number" },
                bckgrnd_import_left : { value: 0, type: "number" },
                option_valign : { value: 'top', type: "string", options:['top', 'middle', 'bottom'] },
                option_halign : { value: 'left', type: "string", options:['left', 'center', 'right'] }
            };
        }
    },

    setParams : function(value, setDefaults) {
        setDefaults = (typeof setDefaults === "boolean" && setDefaults);
        for (var key in value) {
            if (this._configMap.hasOwnProperty(key)) {
                var type = this._configMap[key].type,
                    options = this._configMap[key].options,
                    min = this._configMap[key].min,
                    userValue = (!setDefaults) ? value[key] : value[key].value;

                switch (type) {
                    case "number" :
                        if (QUtility.isNumber(userValue)) {
                            userValue = Number(userValue);
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
                        if (QUtility.isString(userValue) && userValue.length > 0) {
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
                        break;
                    case "color" :
                        if (QUtility.paramToHex(userValue)) { this._params[key] = QUtility.paramToHex(userValue); }
                        break;
                    default :
                        break;
                }
            }
        }
    },

    add: function () {
        return null;
    },

    remove: function() {
        return null;
    },

    query: function(value) {
        if (!this._container) { return null; }
        if (QUtility.isNumber(value) && value >= 0 && value < this._cache.childArray.length-1) {
            return this._cache.childArray[value];
        }

        return this._cache.childArray;
    },

    cache: function() {
        return this._cache;
    },

    destroy: function() {
        if (!this._container) { return null; }

        // Remove children
        while (this._cache.childArray.length !== 0) {
            var child = this._cache.childArray[0];
            if (child.widget) { child.destroy(); }
            this._cache.childArray.shift();
        }

        this._container.parentNode.removeChild(this._container);

        // GC
        this._container = null;
        this._cache = {};
        this._params = {};

        return this;
    },

    container: function() {
        return this._container;
    }
};

// Base Layout: Children are laid out left to right, top to bottom.
function QBaseLayout(parent, configObj) {
    // create layout shell
    var doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        container = doc.createElement("div"),       // Main content container
        image = doc.createElement("div"),           // Content Background image
        label = doc.createElement("label"),         // Content label
        layoutContain = doc.createElement("div"),   // Content layout container
        defaultLayout = doc.createElement("div"),   // Default layout container
        ownRowLayout = doc.createElement("div");    // OwnRow layout container

    // container element
    container.className = "qlayout_container";

    // container background image element
    image.className = "qlayout_background_image";
    image.style.cssText = "position: absolute; filter: inherit; display: none;";

    // container label element
    label.className = "qlayout_label";
    label.style.cssText = "position: relative; filter: inherit; display: none;";

    // layout container element
    layoutContain.className = "qlayout_layout_container";
    layoutContain.style.cssText = "position: relative; filter: inherit;";

    // default layout element; this element will house added elements
    defaultLayout.className = "qlayout_default_layout";
    defaultLayout.style.cssText = "position: relative; filter: inherit; zoom: 1;";

    // ownrow layout element; this element will hold elements whose ownRow property is true
    ownRowLayout.className = "qlayout_ownrow_layout";
    ownRowLayout.style.cssText = "position: relative; zoom: 1;";

    // Append children
    layoutContain.appendChild(defaultLayout);
    container.appendChild(image);
    container.appendChild(label);
    container.appendChild(layoutContain);
    parentEle.appendChild(container);

    // Init core vars
    this._container = container;
    this._params = {};
    this._cache = {};
    this._cache.ownRowMaxWidth = 0;
    this._cache.maxRowWidth = 0;
    this._cache.maxRowHeight = 0;
    this._cache.maxSize = 0;
    this._cache.maxRowSize = 0;
    this._cache.maxColSize = 0;
    this._cache.xPosition = 0;
    this._cache.yPosition = 0;
    this._cache.childArray = [];
    this._cache.nodes = {
        image : image,
        label : label,
        layoutContain : layoutContain,
        defaultLayout : defaultLayout,
        ownRowLayout : ownRowLayout
    };

    // call config which in-turn will call update to finalize construction
    this.config(configObj || {});
}
QBaseLayout.prototype = new QLayoutAbstract();
QBaseLayout.prototype.config = function(value) {
    if (!this._container) { return null; }

    // acts as getter
    if (typeof value !== 'object') {
        return this._params;
    }

    // acts as setter
    else {
        if (this._configMap === undefined) {
            // create the configMap
            this.initConfigMap();

            // add additional layout specific params
            this._configMap.direction = { value: 'horizontal', type: "string", options:['horizontal', 'vertical'] };

            // set default parameters
            this.setParams(this._configMap, true);
        }

        // set custom parameters
        this.setParams(value);

        // parameter presets
        if (this._params.border_style === "none") {
            this._params.border_width = 0;
            this._params.border_radius = 0;
        }

        // Update container
        this.update();

        value = null;
        return this;
    }
};
QBaseLayout.prototype.update = function() {
    if (!this._container) { return null; }
    var doc = document,
        params = this._params,
        cache = this._cache,
        container = this._container,
        image = cache.nodes.image,
        label = cache.nodes.label,
        layoutContain = cache.nodes.layoutContain,
        defaultLayout = cache.nodes.defaultLayout,
        ownRowLayout = cache.nodes.ownRowLayout,
        showImage = (params.show_bckgrnd_import && params.bckgrnd_import !== ""),
        showLabel = (params.show_label && params.label !== "");

    // Container CSS Style
    container.id = (params.id || "QBaseLayout");
    container.style.position = params.position;
    container.style.marginTop = params.top + "px";
    container.style[(!params.isRTL) ? 'marginLeft' : 'marginRight'] = params.left + "px";

    // Background Image CSS Style
    if (showImage) {
        // create temp img to see if image url is valid
        var img = doc.createElement("img");
        img.style.position = "absolute";
        img.style.left = "-5000px";
        img.style.top = "-5000px";
        img.style.visibility = "hidden";
        doc.body.appendChild(img);

        // img error event
        $(img).on("error.qbaselayout", function() {
            $(this).off("error.qbaselayout");
            doc.body.removeChild(this);
            // remove image from container
            if (image.parentNode && image.parentNode.nodeType === 1) {
                image.parentNode.removeChild(image);
            }
        });

        // img load event
        $(img).on("load.qbaselayout", function() {
            $(this).off("load.qbaselayout");
            // since img is valid we can proceed to update image div
            $(image).css({
                'display': "block",
                'top': params.bckgrnd_import_top + "px",
                'left': params.bckgrnd_import_left + "px",
                'width': $(this).width() + "px",
                'height': $(this).height() + "px",
                'background-image': 'url(' + params.bckgrnd_import + ')',
                'background-repeat': 'no-repeat',
                'background-position': '0% 0%'
            });

            // append image to container
            container.insertBefore(image, container.firstChild);
            doc.body.removeChild(this);
        }).attr("src", params.bckgrnd_import);
    } else {
        if (image.parentNode && image.parentNode.nodeType === 1) {
            image.parentNode.removeChild(image);
        }
    }

    // Label CSS Style
    if (showLabel) {
        container.insertBefore(label, layoutContain);
        label.dir = (!params.isRTL) ? "LTR" : "RTL";
        label.style.cssText += ';'.concat("-webkit-box-sizing: border-box;");
        label.style.cssText += ';'.concat("-moz-box-sizing: border-box;");
        label.style.cssText += ';'.concat("box-sizing: border-box;");
        label.style.display = "block";
        label.style.whiteSpace = "normal";
        label.style.wordWrap = "break-word";
        label.style.fontFamily = params.primary_font_family;
        label.style.textAlign = (!params.isRTL) ? params.label_halign : (params.label_halign !== "left") ? params.label_halign : "";
        label.style.fontSize = QUtility.convertPxtoEM(params.label_fontsize) + "em";
        label.style.width = "100%";
        label.style.height = "auto";
        label.style.padding = params.label_padding + "px";
        label.style.height = "auto";
        label.style.color = "#" + params.label_fontcolor;
        label.style.backgroundColor = "#" + params.border_color;
        $(label).html(params.label);
    } else {
        if (label.parentNode && label.parentNode.nodeType === 1) {
            label.parentNode.removeChild(label);
        }
    }

    // Layout Container CSS Style
    layoutContain.style.width = params.width + "px";
    layoutContain.style.height = (!params.autoHeight) ? params.height + "px" : "";
    layoutContain.style.padding = params.padding + "px";
    layoutContain.style.overflowX = (!params.autoWidth) ? params.overflow : "visible";
    layoutContain.style.overflowY = (!params.autoHeight) ? params.overflow : "visible";
    layoutContain.style.border = params.border_width + "px " + params.border_style + ' #' + params.border_color;
    layoutContain.style.backgroundColor = (params.show_bckgrnd && params.bckgrnd_color !== "") ? "#" + params.bckgrnd_color : "";

    // set defaultLayout dimensions
    defaultLayout.style.height = layoutContain.style.height;
    defaultLayout.style.width = layoutContain.style.width;

    // set ownRowLayout dimensions
    ownRowLayout.style.height = "";
    ownRowLayout.style.width = "";

    // set container dimensions
    container.style.width = $(layoutContain).outerWidth() + "px";
    container.style.height = ($(layoutContain).outerHeight() + $(label).outerHeight()) + "px";
};
QBaseLayout.prototype.add = function(value, ownRow) {
    if (!this._container) { return null; }
    var that = this,
        doc = document,
        params = this._params,
        cache = this._cache,
        container = this._container,
        childArray = this._cache.childArray,
        label = cache.nodes.label,
        layoutContain = cache.nodes.layoutContain,
        defaultLayout = cache.nodes.defaultLayout,
        ownRowLayout = cache.nodes.ownRowLayout,
        isHorz = (params.direction.toLowerCase() === "horizontal");

    // If passed an array of values
    if (jQuery.isArray(value) && value.length > 0) {
        for (var i = 0, len = value.length; i<len; i+=1) {
            var val = value[i].child || value[i],
                ownrow = value[i].ownRow || false;

            helper(val, ownrow);
        }
    } else {
        // If passed one value
        return helper(value, ownRow);
    }

    // helper function
    function helper(target, ownrow) {
        if (target) {
            // if ownrow is true add child to ownRowLayout; else defaultLayout
            ownrow = (typeof ownrow === 'boolean' && ownrow) ? ownrow : false;

            // function to create child wrapper and append to appropriate layout
            var addHelper = function(child) {
                // create child wrapper
                var labHeight = ($(label).outerHeight() >= 0) ? $(label).outerHeight() : 0,
                    child_wrap = doc.createElement("div");

                child_wrap.className = "qlayout_child_wrapper";
                child_wrap.style.filter = "inherit";
                child_wrap.style.zoom = "1";

                // Append to appropriate layout
                if (!ownrow) {
                    child_wrap.appendChild(child);
                    if (!defaultLayout.children.length) {
                        // Create new row container
                        var row_contain = doc.createElement("div");
                        row_contain.className = "qlayout_row_container";
                        row_contain.style.position = (isHorz) ? "relative" : "absolute";
                        row_contain.style[(!params.isRTL) ? "left" : "right"] = 0 + "px";
                        row_contain.style.top = 0 + "px";
                        defaultLayout.appendChild(row_contain);
                    }

                    // call appropriate layout method
                    (isHorz) ?
                        that._layoutChildHorizontally(child_wrap):
                        that._layoutChildVertically(child_wrap);
                } else {
                    var childWidth = $(child).outerWidth(true),
                        childHeight = $(child).outerHeight(true),
                        ownRowLen = ownRowLayout.children.length,
                        ownRowHeight = $(ownRowLayout).height(),
                        ownRowOffset = 0;

                    // Create child wrapper
                    child_wrap.style.position = "relative";
                    child_wrap.appendChild(child);

                    if (!ownRowLen) {
                        ownRowLayout.style.marginTop = 15 + "px";
                    } else {
                        ownRowOffset = params.vgap;
                        child_wrap.style.marginTop = params.vgap + "px";
                    }

                    child_wrap.style.width = childWidth + "px";
                    child_wrap.style.height = childHeight + "px";
                    cache.ownRowMaxWidth = Math.max(cache.ownRowMaxWidth, childWidth);
                    ownRowLayout.style.width = cache.ownRowMaxWidth + "px";
                    ownRowLayout.style.height = (ownRowHeight + ownRowOffset + childHeight) + "px";
                    ownRowLayout.appendChild(child_wrap);
                    if (!(ownRowLayout.parentNode && ownRowLayout.parentNode.nodeType === 1)) {
                        layoutContain.appendChild(ownRowLayout);
                    }
                }

                // set new layoutContain dimensions
                var ownRowLen = ownRowLayout.children.length;
                if (params.autoHeight) {
                    var defLayoutHeight = $(defaultLayout).outerHeight(true),
                        ownRowHeight = (!ownRowLen) ? 0 : $(ownRowLayout).outerHeight(true);

                    layoutContain.style.height = (defLayoutHeight + ownRowHeight) + "px";
                }

                if (params.autoWidth) {
                    var defLayoutWidth = $(defaultLayout).outerWidth(true),
                        ownRowWidth = (!ownRowLen) ? 0 : $(ownRowLayout).outerWidth(true);

                    layoutContain.style.width = Math.max(defLayoutWidth, ownRowWidth) + "px";
                }

                // set new container dimensions
                container.style.width = $(layoutContain).outerWidth() + "px";
                container.style.height = ($(layoutContain).outerHeight() + labHeight) + "px";

                // Horizontal alignment of children
                if (isHorz) {
                    if (params.option_halign === "center" || (params.isRTL && params.option_halign === "left") || (!params.isRTL && params.option_halign === "right")) {
                        for (var i = 0; i < defaultLayout.children.length; i+=1) {
                            var rowContain = defaultLayout.children[i],
                                offset = ($(layoutContain).width() - $(rowContain).outerWidth(true)) *
                                    ((params.option_halign === "center") ? 0.5 : 1);

                            for (var j = 0; j < rowContain.children.length; j+=1) {
                                var curChild = rowContain.children[j];
                                curChild.style[(!params.isRTL) ? "marginLeft" : "marginRight"] = offset + "px";
                            }
                        }
                    }
                } else {
                    if (params.option_valign !== "top") {
                        for (var i = 0; i < defaultLayout.children.length; i+=1) {
                            var rowContain = defaultLayout.children[i],
                                offset = ($(defaultLayout).height() - $(rowContain).outerHeight(true)) *
                                    ((params.option_valign === "middle") ? 0.5 : 1);

                            for (var j = 0; j < rowContain.children.length; j+=1) {
                                var curChild = rowContain.children[j];
                                curChild.style.marginTop = offset + "px";
                            }
                        }
                    }
                }

                if (ownRowLen > 0) {
                    if (params.option_halign === "center" || (params.isRTL && params.option_halign === "left") || (!params.isRTL && params.option_halign === "right")) {
                        for (var i = 0; i < ownRowLen; i += 1) {
                            var curChild = ownRowLayout.children[i],
                                offset = ($(layoutContain).width() - $(curChild.children[0]).outerWidth()) * ((params.option_halign === "center") ? 0.5 : 1);

                            curChild.style[(!params.isRTL) ? "marginLeft" : "marginRight"] = offset + "px";
                        }
                    }
                }

                return child_wrap;
            };

            // Accepts both html elements and widgets
            if (target.nodeType === 1) {
                if (jQuery.inArray(target, childArray) === -1) {
                    childArray.push(target);
                    return addHelper(target);
                }
            } else if (target instanceof QStudioDCAbstract) {
                if (jQuery.inArray(target, childArray) === -1) {
                    childArray.push(target);
                    return addHelper(target.widget());
                }
            }
        }
    }
};
QBaseLayout.prototype.remove = function() {
    // currently set to remove all widgets in childArray
    if (!this._container) { return null; }
    var defaultLayout = this._cache.nodes.defaultLayout,
        ownRowLayout = this._cache.nodes.ownRowLayout;

    while (this._cache.childArray.length) {
        var childWgt = this._cache.childArray[0],
            childEle = (childWgt.widget) ? childWgt.widget() : childWgt,
            childWrap = childEle.parentNode;

        childWrap.removeChild(childEle);
        this._cache.childArray.shift();
    }

    while (defaultLayout.firstChild) {
        defaultLayout.removeChild(defaultLayout.firstChild);
    }

    while (ownRowLayout.firstChild) {
        ownRowLayout.removeChild(ownRowLayout.firstChild);
    }

    // reset cache variables
    this._cache.ownRowMaxWidth = 0;
    this._cache.maxRowWidth = 0;
    this._cache.maxRowHeight = 0;
    this._cache.maxSize = 0;
    this._cache.maxRowSize = 0;
    this._cache.maxColSize = 0;
    this._cache.xPosition = 0;
    this._cache.yPosition = 0;
};
QBaseLayout.prototype._layoutChildHorizontally = function(child_wrap) {
    if (!this._container) { return null; }
    var cache = this._cache,
        params = this._params,
        defaultLayout = cache.nodes.defaultLayout,
        child = child_wrap.children[0],
        childWidth = $(child).outerWidth(true),
        curRowContain = undefined,
        endOfRow = cache.xPosition + childWidth;

    if(endOfRow > params.width && cache.xPosition !== 0) {
        cache.maxRowSize = Math.max(cache.maxRowSize, cache.xPosition-params.hgap);
        cache.xPosition = 0;
        cache.yPosition += cache.maxSize + params.vgap;
        cache.maxSize = 0;

        // Create new row container
        var row_contain = document.createElement("div");
        row_contain.className = "qlayout_row_container";
        row_contain.style.position = "relative";
        row_contain.style.marginTop = params.vgap + "px";
        defaultLayout.appendChild(row_contain);
    }

    child_wrap.style.position = "absolute";
    child_wrap.style[(!params.isRTL) ? "left" : "right"] = cache.xPosition + "px";

    cache.xPosition += childWidth + params.hgap;
    cache.maxSize = Math.max(cache.maxSize, $(child).outerHeight(true));
    cache.maxRowSize = Math.max(cache.maxRowSize, cache.xPosition - params.hgap);

    curRowContain = defaultLayout.children[defaultLayout.children.length-1];
    curRowContain.appendChild(child_wrap);
    curRowContain.style.height = cache.maxSize + "px";
    curRowContain.style.width = (cache.xPosition - params.hgap) + "px";

    // Calculate max row container width
    cache.maxRowWidth = Math.max(cache.maxRowWidth, (cache.xPosition - params.hgap));

    // Vertical alignment of children
    if (params.option_valign !== "middle") {
        child_wrap.style[params.option_valign] = 0 + "px";
    } else {
        for (var i = 0; i < curRowContain.children.length; i+=1) {
            var childWrp = curRowContain.children[i];
            childWrp.style.top = (cache.maxSize - $(childWrp.children[0]).outerHeight(true))*0.5 + "px";
        }
    }

    defaultLayout.style.height = (cache.yPosition + cache.maxSize) + "px";
    defaultLayout.style.width = ((params.autoWidth) ? cache.maxRowWidth : params.width) + "px";
};
QBaseLayout.prototype._layoutChildVertically = function(child_wrap) {
    if (!this._container) { return null; }
    var cache = this._cache,
        params = this._params,
        defaultLayout = cache.nodes.defaultLayout,
        child = child_wrap.children[0],
        childHeight = $(child).outerHeight(true),
        curRowContain = undefined,
        endOfColumn = cache.yPosition + childHeight;

    if(endOfColumn > params.height && cache.yPosition !== 0) {
        cache.maxColSize = Math.max(cache.maxColSize, cache.yPosition-params.vgap);
        cache.yPosition = 0;
        cache.xPosition += cache.maxSize + params.hgap;
        cache.maxSize = 0;

        // Create new row container
        var row_contain = document.createElement("div");
        row_contain.className = "qlayout_row_container";
        row_contain.style.position = "absolute";
        row_contain.style.top = 0 + "px";
        row_contain.style[(!params.isRTL) ? "left" : "right"] = cache.xPosition + "px";
        defaultLayout.appendChild(row_contain);
    }

    child_wrap.style.position = "absolute";
    child_wrap.style.top = cache.yPosition + "px";

    cache.yPosition += childHeight + params.vgap;
    cache.maxSize = Math.max(cache.maxSize, $(child).outerWidth(true));
    cache.maxColSize = Math.max(cache.maxColSize, cache.yPosition - params.vgap);

    curRowContain = defaultLayout.children[defaultLayout.children.length-1];
    curRowContain.appendChild(child_wrap);
    curRowContain.style.width = cache.maxSize + "px";
    curRowContain.style.height = (cache.yPosition - params.vgap) + "px";

    // Calculate max row container height
    cache.maxRowHeight = Math.max(cache.maxRowHeight, (cache.yPosition - params.vgap));

    // Horizontal alignment of children
    if (params.option_halign !== "center") {
        child_wrap.style[params.option_halign] = 0 + "px";
    } else {
        for (var i = 0; i < curRowContain.children.length; i+=1) {
            var childWrp = curRowContain.children[i];
            childWrp.style.left = (cache.maxSize - $(childWrp.children[0]).outerWidth(true))*0.5 + "px";
        }
    }

    defaultLayout.style.width = (cache.xPosition + cache.maxSize) + "px";
    defaultLayout.style.height = ((params.autoHeight) ? cache.maxRowHeight : params.height) + "px";
};

// Vertical Layout: Children are laid out top to bottom.
function QVerticalLayout(parent, configObj) {
    // add easing functions to use w/ jquery animate
    QUtility.jQueryAddEasing();

    // create layout shell
    var doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        container = doc.createElement("div"),
        image = doc.createElement("div"),
        label = doc.createElement("label"),
        navContain = doc.createElement("div"),
        navTop = doc.createElement("div"),
        navTopCircle = doc.createElement("div"),
        navBottom = doc.createElement("div"),
        navBotCircle = doc.createElement("div"),
        navBtnSize = 48,
        navCircSize = 45,
        layoutContain = doc.createElement("div"),
        defaultLayout = doc.createElement("div");

    function arrowFactory(isTop) {
        var arrw = doc.createElement("div"),
            arrw_size = 20;

        arrw.style.position = "absolute";
        arrw.style.width = 0;
        arrw.style.height = 0;
        arrw.style.borderLeft = arrw_size + "px solid transparent";
        arrw.style.borderRight = arrw_size + "px solid transparent";
        arrw.style[(isTop) ? "borderBottom" : "borderTop"] = arrw_size + "px solid #eeeeee";
        arrw.style.marginTop = (((isTop) ? -1 : 1) * 5) + "px";
        arrw.style.left = (navCircSize*2 - arrw_size*2)*0.5 + "px";
        arrw.style.top = (navCircSize - arrw_size)*0.5 + "px";
        return arrw;
    }

    // container element
    container.className = "qlayout_container";
    container.style.cssText += ';'.concat("-webkit-user-select: none;");
    container.style.cssText += ';'.concat("-khtml-user-select: none;");
    container.style.cssText += ';'.concat("-moz-user-select: none;");
    container.style.cssText += ';'.concat("-ms-user-select: none;");
    container.style.cssText += ';'.concat("-user-select: none;");

    // container background image element
    image.className = "qlayout_background_image";
    image.style.cssText = "position: absolute; filter: inherit; display: none;";

    // container label element
    label.className = "qlayout_label";
    label.style.cssText = "position: relative; filter: inherit; display: none;";

    // navigation container element
    navContain.className = "qlayout_navigation_container";
    navContain.style.cssText = "position: absolute; filter: inherit;";
    navContain.style.left = 0;
    navContain.style.top = 0;

    // navigation top wrapper
    navTop.className = "qlayout_navigation_top_button";
    navTop.style.position = "absolute";
    navTop.style.filter = "inherit";
    navTop.style.width = "100%";
    navTop.style.height = navBtnSize + 'px';
    navTop.style.backgroundColor = "#eeeeee";

    // navigation top circle
    $(navTopCircle).css({
        'position' : 'absolute',
        'display' : 'none',
        'filter' : 'inherit',
        'height' : navCircSize + 'px',
        'width' : navCircSize*2 + 'px',
        'border-radius' : '0 0 ' + navCircSize*2 + 'px ' + navCircSize*2 + 'px',
        'background' : "#bdbdbd"
    });
    navTopCircle.appendChild(arrowFactory(true));

    // navigation bottom wrapper
    navBottom.className = "qlayout_navigation_bottom_button";
    navBottom.style.position = "absolute";
    navBottom.style.filter = "inherit";
    navBottom.style.width = "100%";
    navBottom.style.height = navTop.style.height;
    navBottom.style.backgroundColor = navTop.style.backgroundColor;

    // navigation bottom circle
    $(navBotCircle).css({
        'position' : 'absolute',
        'display' : 'none',
        'top' : (navBtnSize - navCircSize) + "px",
        'filter' : 'inherit',
        'height' : navCircSize + 'px',
        'width' : navCircSize*2 + 'px',
        'border-radius' : navCircSize*2 + 'px ' + navCircSize*2 + 'px 0 0',
        'background' : "#bdbdbd"
    });
    navBotCircle.appendChild(arrowFactory(false));

    // layout container element
    layoutContain.className = "qlayout_layout_container";
    layoutContain.style.cssText = "position: relative; filter: inherit;";

    // default layout element; this element will house added elements
    defaultLayout.className = "qlayout_default_layout";
    defaultLayout.style.cssText = "position: relative; filter: inherit; zoom: 1;";

    // Append children
    layoutContain.appendChild(defaultLayout);
    navTop.appendChild(navTopCircle);
    navBottom.appendChild(navBotCircle);
    navContain.appendChild(navTop);
    navContain.appendChild(navBottom);
    container.appendChild(image);
    container.appendChild(label);
    container.appendChild(layoutContain);
    parentEle.appendChild(container);

    // Init core vars
    this._container = container;
    this._params = {};
    this._cache = {};
    this._cache.setHeight = 0;
    this._cache.initNav = false;
    this._cache.navLoc = [];
    this._cache.navIndex = 0;
    this._cache.childArray = [];
    this._cache.maxWidth = 0;
    this._cache.totalHeight = 0;
    this._cache.nodes = {
        image : image,
        label : label,
        navContain : navContain,
        navTop : navTop,
        navBottom : navBottom,
        layoutContain : layoutContain,
        defaultLayout : defaultLayout
    };

    // call config which in-turn will call update to finalize construction
    this.config(configObj || {});
}
QVerticalLayout.prototype = new QLayoutAbstract();
QVerticalLayout.prototype.config = function(value) {
    if (!this._container) { return null; }

    // acts as getter
    if (typeof value !== 'object') {
        return this._params;
    }

    // acts as setter
    else {
        if (this._configMap === undefined) {
            // create the configMap
            this.initConfigMap();

            // add additional layout specific params
            this._configMap.enableSlider = { value: false, type: "boolean" };

            // set default parameters
            this.setParams(this._configMap, true);
        }

        // set custom parameters
        this.setParams(value);

        // parameter presets
        if (this._params.border_style === "none") {
            this._params.border_width = 0;
            this._params.border_radius = 0;
        }

        if (this._params.enableSlider) {
            this._params.autoWidth = true;
            this._params.autoHeight = true;
        }

        // Update container
        this.update();

        value = null;
        return this;
    }
};
QVerticalLayout.prototype.update = function() {
    if (!this._container) { return null; }
    var that = this,
        doc = document,
        params = this._params,
        cache = this._cache,
        container = this._container,
        image = cache.nodes.image,
        label = cache.nodes.label,
        navContain = cache.nodes.navContain,
        navTop = cache.nodes.navTop,
        navBottom = cache.nodes.navBottom,
        layoutContain = cache.nodes.layoutContain,
        defaultLayout = cache.nodes.defaultLayout,
        ofContain = undefined,
        showImage = (params.show_bckgrnd_import && params.bckgrnd_import !== ""),
        showLabel = (params.show_label && params.label !== "");

    // Container CSS Style
    container.id = (params.id || "QVerticalLayout");
    container.style.position = params.position;
    container.style.marginTop = params.top + "px";
    container.style[(!params.isRTL) ? 'marginLeft' : 'marginRight'] = params.left + "px";

    // Background Image CSS Style
    if (showImage) {
        // create temp img to see if image url is valid
        var img = doc.createElement("img");
        img.style.position = "absolute";
        img.style.left = "-5000px";
        img.style.top = "-5000px";
        img.style.visibility = "hidden";
        doc.body.appendChild(img);

        // img error event
        $(img).on("error.qverticallayout", function() {
            $(this).off("error.qverticallayout");
            doc.body.removeChild(this);
            // remove image from container
            if (image.parentNode && image.parentNode.nodeType === 1) {
                image.parentNode.removeChild(image);
            }
        });

        // img load event
        $(img).on("load.qverticallayout", function() {
            $(this).off("load.qverticallayout");
            // since img is valid we can proceed to update image div
            $(image).css({
                'display': "block",
                'top': params.bckgrnd_import_top + "px",
                'left': params.bckgrnd_import_left + "px",
                'width': $(this).width() + "px",
                'height': $(this).height() + "px",
                'background-image': 'url(' + params.bckgrnd_import + ')',
                'background-repeat': 'no-repeat',
                'background-position': '0% 0%'
            });

            // append image to container
            container.insertBefore(image, container.firstChild);
            doc.body.removeChild(this);
        }).attr("src", params.bckgrnd_import);
    } else {
        if (image.parentNode && image.parentNode.nodeType === 1) {
            image.parentNode.removeChild(image);
        }
    }

    // Label CSS Style
    if (showLabel) {
        container.insertBefore(label, layoutContain);
        label.dir = (!params.isRTL) ? "LTR" : "RTL";
        label.style.cssText += ';'.concat("-webkit-box-sizing: border-box;");
        label.style.cssText += ';'.concat("-moz-box-sizing: border-box;");
        label.style.cssText += ';'.concat("box-sizing: border-box;");
        label.style.display = "block";
        label.style.whiteSpace = "normal";
        label.style.wordWrap = "break-word";
        label.style.fontFamily = params.primary_font_family;
        label.style.textAlign = (!params.isRTL) ? params.label_halign : (params.label_halign !== "left") ? params.label_halign : "";
        label.style.fontSize = QUtility.convertPxtoEM(params.label_fontsize) + "em";
        label.style.width = "100%";
        label.style.height = "auto";
        label.style.padding = params.label_padding + "px";
        label.style.height = "auto";
        label.style.color = "#" + params.label_fontcolor;
        label.style.backgroundColor = "#" + params.border_color;
        $(label).html(params.label);
    } else {
        if (label.parentNode && label.parentNode.nodeType === 1) {
            label.parentNode.removeChild(label);
        }
    }

    // Layout Container CSS Style
    layoutContain.style.width = params.width + "px";
    layoutContain.style.height = (!params.autoHeight) ? params.height + "px" : "";
    layoutContain.style.padding = params.padding + "px";
    layoutContain.style.overflowX = (!params.autoWidth) ? params.overflow : "visible";
    layoutContain.style.overflowY = (!params.autoHeight) ? params.overflow : "visible";
    layoutContain.style.border = params.border_width + "px " + params.border_style + ' #' + params.border_color;
    layoutContain.style.backgroundColor = (params.show_bckgrnd && params.bckgrnd_color !== "") ? "#" + params.bckgrnd_color : "";

    // Navigation Container CSS Style
    if (params.enableSlider) {
        var navBtnSize = parseInt(navTop.style.height, 10);

        // set navigation half circle background colors to params.border_color
        navTop.children[0].style.backgroundColor = '#' + params.border_color;
        navBottom.children[0].style.backgroundColor = '#' + params.border_color;
        navBottom.style.top = (params.height + params.padding*2 - navBtnSize) + "px";
        navContain.style.zIndex = 5000;
        navContain.style.left = params.border_width + "px";
        navContain.style.display = "none";
        layoutContain.style.overflow = "hidden";
        container.appendChild(navContain);  // append navContain to container

        // create an overflow container and append to layoutContain
        // append defaultLayout to overflow container
        ofContain = doc.createElement("div");
        ofContain.className = "qlayout_layout_overflow_container";
        ofContain.style.position = "absolute";
        ofContain.style.width = params.width + "px";
        ofContain.style.height = (params.height - navBtnSize*2) + "px";
        ofContain.style.overflow = "hidden";
        ofContain.appendChild(defaultLayout);
        layoutContain.appendChild(ofContain);

        // navigation events
        $([navTop, navBottom]).on("click.qverticallayout", function(event) {
            event.stopPropagation();
            that[(event.currentTarget === navTop) ? "navBack" : "navNext"]();
        });
    } else {
        // remove navigation container from DOM
        if (navContain.parentNode === container) {
            ofContain = defaultLayout.parentNode;
            navContain.parentNode.removeChild(navContain);

            // remove events
            $([navTop, navBottom]).off("click.qverticallayout");

            // remove overflow container
            layoutContain.removeChild(ofContain);
            layoutContain.appendChild(defaultLayout);
        }
    }

    // set defaultLayout dimensions
    defaultLayout.style.height = "";
    defaultLayout.style.width = "";

    // set container dimensions
    container.style.width = $(layoutContain).outerWidth() + "px";
    container.style.height = ($(layoutContain).outerHeight() + $(label).outerHeight()) + "px";
};
QVerticalLayout.prototype.updateNavigation = function() {
    var cache = this._cache,
        navTop = cache.nodes.navTop,
        navBottom = cache.nodes.navBottom,
        navLocLen = cache.navLoc.length;

    if (navLocLen === 0) { return; }
    if (!cache.initNav) { cache.initNav = true; }
    navBottom.children[0].style.display = (cache.navIndex < cache.navLoc.length) ? "block" : "none";
    navBottom.style.cursor = (cache.navIndex < cache.navLoc.length) ? "pointer" : "";
    navTop.children[0].style.display = (cache.navIndex > 0) ? "block" : "none";
    navTop.style.cursor = (cache.navIndex > 0) ? "pointer" : "";
};
QVerticalLayout.prototype.navNext = function() {
    var cache = this._cache,
        defaultLayout = cache.nodes.defaultLayout,
        navLocLen = cache.navLoc.length;

    if (cache.navIndex <= (navLocLen - 1)) {
        cache.navIndex += 1;

        $(defaultLayout).stop(false, false);
        $(defaultLayout).animate({
            top : -cache.navLoc[cache.navIndex - 1]
        }, { duration : 1000, easing : "easeOutExpo" });

        this.updateNavigation();
    }
};
QVerticalLayout.prototype.navBack = function() {
    var cache = this._cache,
        defaultLayout = cache.nodes.defaultLayout,
        navLoc = undefined;

    if (cache.navIndex > 0) {
        cache.navIndex -= 1;
        navLoc = cache.navLoc[cache.navIndex - 1];

        $(defaultLayout).stop(false, false);
        $(defaultLayout).animate({
            top : (navLoc) ? -navLoc : 0
        }, { duration : 1000, easing : "easeOutExpo" });

        this.updateNavigation();
    }
};
QVerticalLayout.prototype.add = function(value) {
    if (!this._container) { return null; }
    var that = this,
        params = this._params,
        cache = this._cache,
        container = this._container,
        childArray = this._cache.childArray,
        label = cache.nodes.label,
        layoutContain = cache.nodes.layoutContain,
        navContain = cache.nodes.navContain,
        navTop = cache.nodes.navTop,
        navBottom = cache.nodes.navBottom,
        defaultLayout = cache.nodes.defaultLayout;

    // If passed an array of values
    if (jQuery.isArray(value) && value.length > 0) {
        for (var i = 0, len = value.length; i<len; i+=1) {
            helper(value[i].child || value[i]);
        }
    } else {
        // If passed one value
        return helper(value);
    }

    // helper function
    function helper(target) {
        if (target) {
            // function to create child wrapper and append to appropriate layout
            var addHelper = function(child) {
                var labHeight = ($(label).outerHeight() >= 0) ? $(label).outerHeight() : 0,
                    isFirstChild = (childArray.length === 1),
                    child_wrap = document.createElement("div");

                // create child wrapper & append to defaultLayout
                child_wrap.className = "qlayout_child_wrapper";
                child_wrap.style.filter = "inherit";
                child_wrap.style.position = "absolute";
                child_wrap.style.zoom = "1";
                child_wrap.style.top = cache.totalHeight + "px";
                if (!isFirstChild) { child_wrap.style.marginTop = params.vgap + "px"; }
                child_wrap.appendChild(child);  // append child to child wrapper
                defaultLayout.appendChild(child_wrap);

                // Calculate max child width and total layout height
                cache.maxWidth = (params.autoWidth) ? Math.max(cache.maxWidth, $(child).outerWidth(true)) : $(layoutContain).width();
                cache.totalHeight += $(child).outerHeight(true) + ((!isFirstChild) ? params.vgap : 0);

                // If slider is enabled...
                if (params.enableSlider) {
                    var setIndex = (cache.totalHeight/(cache.setHeight + parseInt(defaultLayout.parentNode.style.height, 10)));
                    if (setIndex > 1) {
                        cache.setHeight = cache.totalHeight - $(child).outerHeight(true);
                        if (cache.setHeight > 0) { cache.navLoc.push(cache.setHeight); }
                    }
                }

                // set new defaultLayout dimensions
                defaultLayout.style.width = "100%";//cache.maxWidth + "px";
                defaultLayout.style.height  = cache.totalHeight + "px";

                // set new layoutContain dimensions
                if (params.autoWidth) { layoutContain.style.width = cache.maxWidth + "px"; }
                if (params.autoHeight) { layoutContain.style.height = cache.totalHeight + "px"; }

                // set new container dimensions
                container.style.width = $(layoutContain).outerWidth() + "px";
                container.style.height = ($(layoutContain).outerHeight() + labHeight) + "px";

                // horizontally align child wrappers
                if (params.option_halign !== "center") {
                    child_wrap.style[params.option_halign] = 0 + "px";
                } else {
                    var containWidth = $(layoutContain).width();
                    for (var i = 0; i < defaultLayout.children.length; i+=1) {
                        var childWrp = defaultLayout.children[i];
                        childWrp.style.left = (containWidth - $(childWrp.children[0]).outerWidth(true))*0.5 + "px";
                    }
                }


                // if slider enabled...
                if (params.enableSlider) {
                    if (params.autoHeight && (cache.totalHeight >= params.height)) {
                        // navigation should now display
                        // turn autoHeight to false
                        navContain.style.display = "block";
                        defaultLayout.parentNode.style.marginTop = navTop.style.height;
                        layoutContain.style.height = params.height + "px";
                        params.autoHeight = false;
                    }

                    navContain.style.width = (cache.maxWidth + params.padding*2) + "px";
                    navContain.style.top = (labHeight + params.border_width) + "px";
                    navTop.children[0].style.left = (parseInt(navContain.style.width, 10) - parseInt(navTop.children[0].style.width, 10))*0.5 + "px";
                    navBottom.children[0].style.left = navTop.children[0].style.left;

                    // set new overflow container width
                    defaultLayout.parentNode.style.width = defaultLayout.style.width;

                    // update navigation
                    if (!cache.initNav) { that.updateNavigation(); }
                }

                return child_wrap;
            };

            // Accepts both html elements and widgets
            if (target.nodeType === 1) {
                if (jQuery.inArray(target, childArray) === -1) {
                    childArray.push(target);
                    return addHelper(target);
                }
            } else if (target instanceof QStudioDCAbstract) {
                if (jQuery.inArray(target, childArray) === -1) {
                    childArray.push(target);
                    return addHelper(target.widget());
                }
            }
        }
    }
};
QVerticalLayout.prototype.remove = function() {
    if (!this._container) { return null; }
    // currently set to remove all widgets in childArray
    if (!this._container) { return null; }
    var defaultLayout = this._cache.nodes.defaultLayout;
    while (this._cache.childArray.length) {
        var childWgt = this._cache.childArray[0],
            childEle = (childWgt.widget) ? childWgt.widget() : childWgt,
            childWrap = childEle.parentNode;

        childWrap.removeChild(childEle);
        this._cache.childArray.shift();
    }

    while (defaultLayout.firstChild) {
        defaultLayout.removeChild(defaultLayout.firstChild);
    }

    // reset cache variables
    this._cache.setHeight = 0;
    this._cache.initNav = false;
    this._cache.navLoc = [];
    this._cache.navIndex = 0;
    this._cache.maxWidth = 0;
    this._cache.totalHeight = 0;
};

// Horizontal Layout: Children are laid out left to right.
function QHorizontalLayout(parent, configObj) {
    // add easing functions to use w/ jquery animate
    QUtility.jQueryAddEasing();

    // create layout shell
    var doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        container = doc.createElement("div"),
        image = doc.createElement("div"),
        label = doc.createElement("label"),
        navContain = doc.createElement("div"),
        navLeft = doc.createElement("div"),
        navLeftCircle = doc.createElement("div"),
        navRight = doc.createElement("div"),
        navRightCircle = doc.createElement("div"),
        navBtnSize = 48,
        navCircSize = 45,
        layoutContain = doc.createElement("div"),
        defaultLayout = doc.createElement("div");

    function arrowFactory(isLeft) {
        var arrw = doc.createElement("div"),
            arrw_size = 20;

        arrw.style.position = "absolute";
        arrw.style.width = 0;
        arrw.style.height = 0;
        arrw.style.borderTop = arrw_size + "px solid transparent";
        arrw.style.borderBottom = arrw_size + "px solid transparent";
        arrw.style[(isLeft) ? "borderRight" : "borderLeft"] = arrw_size + "px solid #eeeeee";
        arrw.style.marginLeft = (((isLeft) ? -1 : 1) * 5) + "px";
        arrw.style.left = (navCircSize - arrw_size)*0.5 + "px";
        arrw.style.top = (navCircSize*2 - arrw_size*2)*0.5 + "px";
        return arrw;
    }

    // container element
    container.className = "qlayout_container";
    container.style.cssText += ';'.concat("-webkit-user-select: none;");
    container.style.cssText += ';'.concat("-khtml-user-select: none;");
    container.style.cssText += ';'.concat("-moz-user-select: none;");
    container.style.cssText += ';'.concat("-ms-user-select: none;");
    container.style.cssText += ';'.concat("-user-select: none;");

    // container background image element
    image.className = "qlayout_background_image";
    image.style.cssText = "position: absolute; filter: inherit; display: none;";

    // container label element
    label.className = "qlayout_label";
    label.style.cssText = "position: relative; filter: inherit; display: none;";

    // navigation container element
    navContain.className = "qlayout_navigation_container";
    navContain.dir = "ltr";
    navContain.style.cssText = "position: absolute; filter: inherit;";
    navContain.style.left = 0;
    navContain.style.top = 0;

    // navigation left wrapper
    navLeft.className = "qlayout_navigation_left_button";
    navLeft.style.position = "absolute";
    navLeft.style.filter = "inherit";
    navLeft.style.width = navBtnSize + 'px';
    navLeft.style.height = "100%";
    navLeft.style.backgroundColor = "#eeeeee";

    // navigation left circle
    $(navLeftCircle).css({
        'position' : 'absolute',
        'display' : 'none',
        'filter' : 'inherit',
        'height' : navCircSize*2 + 'px',
        'width' : navCircSize + 'px',
        'border-radius' : '0 ' + navCircSize*2 + 'px ' + navCircSize*2 + 'px 0',
        'background' : "#bdbdbd"
    });
    navLeftCircle.appendChild(arrowFactory(true));

    // navigation right wrapper
    navRight.className = "qlayout_navigation_bottom_button";
    navRight.style.position = "absolute";
    navRight.style.filter = "inherit";
    navRight.style.width = navBtnSize + 'px';
    navRight.style.height = "100%";
    navRight.style.backgroundColor = navLeft.style.backgroundColor;

    // navigation right circle
    $(navRightCircle).css({
        'position' : 'absolute',
        'display' : 'none',
        'left' : (navBtnSize - navCircSize) + "px",
        'filter' : 'inherit',
        'height' : navCircSize*2 + 'px',
        'width' : navCircSize + 'px',
        'border-radius' : navCircSize*2 + 'px 0 0 ' + navCircSize*2 + 'px',
        'background' : "#bdbdbd"
    });
    navRightCircle.appendChild(arrowFactory(false));

    // layout container element
    layoutContain.className = "qlayout_layout_container";
    layoutContain.style.cssText = "position: relative; filter: inherit;";

    // default layout element; this element will house added elements
    defaultLayout.className = "qlayout_default_layout";
    defaultLayout.style.cssText = "position: relative; filter: inherit; zoom: 1;";

    // Append children
    layoutContain.appendChild(defaultLayout);
    navLeft.appendChild(navLeftCircle);
    navRight.appendChild(navRightCircle);
    navContain.appendChild(navLeft);
    navContain.appendChild(navRight);
    container.appendChild(image);
    container.appendChild(label);
    container.appendChild(layoutContain);
    parentEle.appendChild(container);

    // Init core vars
    this._container = container;
    this._params = {};
    this._cache = {};
    this._cache.setWidth = 0;
    this._cache.initNav = false;
    this._cache.navLoc = [];
    this._cache.navIndex = 0;
    this._cache.maxHeight = 0;
    this._cache.totalWidth = 0;
    this._cache.childArray = [];
    this._cache.nodes = {
        image : image,
        label : label,
        navContain : navContain,
        navLeft : navLeft,
        navRight : navRight,
        layoutContain : layoutContain,
        defaultLayout : defaultLayout
    };

    // call config which in-turn will call update to finalize construction
    this.config(configObj || {});
}
QHorizontalLayout.prototype = new QLayoutAbstract();
QHorizontalLayout.prototype.config = function(value) {
    if (!this._container) { return null; }

    // acts as getter
    if (typeof value !== 'object') {
        return this._params;
    }

    // acts as setter
    else {
        if (this._configMap === undefined) {
            // create the configMap
            this.initConfigMap();

            // add additional layout specific params
            this._configMap.enableSlider = { value: false, type: "boolean" };

            // set default parameters
            this.setParams(this._configMap, true);
        }

        // set custom parameters
        this.setParams(value);

        // parameter presets
        if (this._params.border_style === "none") {
            this._params.border_width = 0;
            this._params.border_radius = 0;
        }

        if (this._params.enableSlider) {
            this._params.autoWidth = true;
            this._params.autoHeight = true;
        }

        // Update container
        this.update();

        value = null;
        return this;
    }
};
QHorizontalLayout.prototype.update = function() {
    if (!this._container) { return null; }
    var that = this,
        doc = document,
        params = this._params,
        cache = this._cache,
        container = this._container,
        image = cache.nodes.image,
        label = cache.nodes.label,
        navContain = cache.nodes.navContain,
        navLeft = cache.nodes.navLeft,
        navRight = cache.nodes.navRight,
        layoutContain = cache.nodes.layoutContain,
        defaultLayout = cache.nodes.defaultLayout,
        ofContain = undefined,
        showImage = (params.show_bckgrnd_import && params.bckgrnd_import !== ""),
        showLabel = (params.show_label && params.label !== "");

    // Container CSS Style
    container.id = (params.id || "QHorizontalLayout");
    container.style.position = params.position;
    container.style.marginTop = params.top + "px";
    container.style[(!params.isRTL) ? 'marginLeft' : 'marginRight'] = params.left + "px";

    // Background Image CSS Style
    if (showImage) {
        // create temp img to see if image url is valid
        var img = doc.createElement("img");
        img.style.position = "absolute";
        img.style.left = "-5000px";
        img.style.top = "-5000px";
        img.style.visibility = "hidden";
        doc.body.appendChild(img);

        // img error event
        $(img).on("error.qhorizontallayout", function() {
            $(this).off("error.qhorizontallayout");
            doc.body.removeChild(this);
            // remove image from container
            if (image.parentNode && image.parentNode.nodeType === 1) {
                image.parentNode.removeChild(image);
            }
        });

        // img load event
        $(img).on("load.qhorizontallayout", function() {
            $(this).off("load.qhorizontallayout");
            // since img is valid we can proceed to update image div
            $(image).css({
                'display': "block",
                'top': params.bckgrnd_import_top + "px",
                'left': params.bckgrnd_import_left + "px",
                'width': $(this).width() + "px",
                'height': $(this).height() + "px",
                'background-image': 'url(' + params.bckgrnd_import + ')',
                'background-repeat': 'no-repeat',
                'background-position': '0% 0%'
            });

            // append image to container
            container.insertBefore(image, container.firstChild);
            doc.body.removeChild(this);
        }).attr("src", params.bckgrnd_import);
    } else {
        if (image.parentNode && image.parentNode.nodeType === 1) {
            image.parentNode.removeChild(image);
        }
    }

    // Label CSS Style
    if (showLabel) {
        container.insertBefore(label, layoutContain);
        label.dir = (!params.isRTL) ? "LTR" : "RTL";
        label.style.cssText += ';'.concat("-webkit-box-sizing: border-box;");
        label.style.cssText += ';'.concat("-moz-box-sizing: border-box;");
        label.style.cssText += ';'.concat("box-sizing: border-box;");
        label.style.display = "block";
        label.style.whiteSpace = "normal";
        label.style.wordWrap = "break-word";
        label.style.fontFamily = params.primary_font_family;
        label.style.textAlign = (!params.isRTL) ? params.label_halign : (params.label_halign !== "left") ? params.label_halign : "";
        label.style.fontSize = QUtility.convertPxtoEM(params.label_fontsize) + "em";
        label.style.width = "100%";
        label.style.height = "auto";
        label.style.padding = params.label_padding + "px";
        label.style.height = "auto";
        label.style.color = "#" + params.label_fontcolor;
        label.style.backgroundColor = "#" + params.border_color;
        $(label).html(params.label);
    } else {
        if (label.parentNode && label.parentNode.nodeType === 1) {
            label.parentNode.removeChild(label);
        }
    }

    // Layout Container CSS Style
    layoutContain.style.width = params.width + "px";
    layoutContain.style.height = (!params.autoHeight) ? params.height + "px" : "";
    layoutContain.style.padding = params.padding + "px";
    layoutContain.style.overflowX = (!params.autoWidth) ? params.overflow : "visible";
    layoutContain.style.overflowY = (!params.autoHeight) ? params.overflow : "visible";
    layoutContain.style.border = params.border_width + "px " + params.border_style + ' #' + params.border_color;
    layoutContain.style.backgroundColor = (params.show_bckgrnd && params.bckgrnd_color !== "") ? "#" + params.bckgrnd_color : "";

    // Navigation Container CSS Style
    if (params.enableSlider) {
        var navBtnSize = parseInt(navLeft.style.width, 10);

        // rtl adjustments...
        if (params.isRTL) {
            navLeft.style.cursor = 'pointer';
            navLeft.children[0].style.display = "block";
            navRight.style.cursor = '';
            navRight.children[0].style.display = "none";
        }

        // set navigation half circle background colors to params.border_color
        navLeft.children[0].style.backgroundColor = '#' + params.border_color;
        navRight.children[0].style.backgroundColor = '#' + params.border_color;
        navRight.style.left = (params.width + params.padding*2 - navBtnSize) + "px";
        navContain.style.zIndex = 5000;
        navContain.style.left = params.border_width + "px";
        navContain.style.display = "none";
        layoutContain.style.overflow = "hidden";
        container.appendChild(navContain);  // append navContain to container

        // create an overflow container and append to layoutContain
        // append defaultLayout to overflow container
        ofContain = doc.createElement("div");
        ofContain.className = "qlayout_layout_overflow_container";
        ofContain.style.position = "absolute";
        ofContain.style.width = (params.width - navBtnSize*2) + "px";
        ofContain.style.overflow = "hidden";
        ofContain.appendChild(defaultLayout);
        layoutContain.appendChild(ofContain);

        // navigation events
        $([navLeft, navRight]).on("click.qhorizontallayout", function(event) {
            event.stopPropagation();
            (!params.isRTL) ?
                that[(event.currentTarget === navLeft) ? "navBack" : "navNext"]():
                that[(event.currentTarget === navLeft) ? "navNext" : "navBack"]();
        });
    } else {
        // remove navigation container from DOM
        if (navContain.parentNode === container) {
            ofContain = defaultLayout.parentNode;
            navContain.parentNode.removeChild(navContain);

            // remove events
            $([navLeft, navRight]).off("click.qhorizontallayout");

            // remove overflow container
            layoutContain.removeChild(ofContain);
            layoutContain.appendChild(defaultLayout);
        }
    }

    // set defaultLayout dimensions
    defaultLayout.style.height = "";
    defaultLayout.style.width = "";

    // set container dimensions
    container.style.width = $(layoutContain).outerWidth() + "px";
    container.style.height = ($(layoutContain).outerHeight() + $(label).outerHeight()) + "px";
};
QHorizontalLayout.prototype.updateNavigation = function() {
    var cache = this._cache,
        navLeft = (!this._params.isRTL) ? cache.nodes.navLeft : cache.nodes.navRight,
        navRight = (!this._params.isRTL) ? cache.nodes.navRight : cache.nodes.navLeft,
        navLocLen = cache.navLoc.length;

    if (navLocLen === 0) { return; }
    if (!cache.initNav) { cache.initNav = true; }
    navRight.children[0].style.display = (cache.navIndex < cache.navLoc.length) ? "block" : "none";
    navRight.style.cursor = (cache.navIndex < cache.navLoc.length) ? "pointer" : "";
    navLeft.children[0].style.display = (cache.navIndex > 0) ? "block" : "none";
    navLeft.style.cursor = (cache.navIndex > 0) ? "pointer" : "";
};
QHorizontalLayout.prototype.navNext = function() {
    var cache = this._cache,
        defaultLayout = cache.nodes.defaultLayout,
        navLocLen = cache.navLoc.length;

    if (cache.navIndex <= (navLocLen - 1)) {
        cache.navIndex += 1;

        $(defaultLayout).stop(false, false);
        $(defaultLayout).animate({
            left : ((!this._params.isRTL) ? -1 : 1) * cache.navLoc[cache.navIndex - 1]
        }, { duration : 1000, easing : "easeOutExpo" });

        this.updateNavigation();
    }
};
QHorizontalLayout.prototype.navBack = function() {
    var cache = this._cache,
        defaultLayout = cache.nodes.defaultLayout,
        navLoc = undefined;

    if (cache.navIndex > 0) {
        cache.navIndex -= 1;
        navLoc = cache.navLoc[cache.navIndex - 1];

        $(defaultLayout).stop(false, false);
        $(defaultLayout).animate({
            left : (navLoc) ? ((!this._params.isRTL) ? -1 : 1) * navLoc : 0
        }, { duration : 1000, easing : "easeOutExpo" });

        this.updateNavigation();
    }
};
QHorizontalLayout.prototype.add = function(value) {
    if (!this._container) { return null; }
    var that = this,
        params = this._params,
        cache = this._cache,
        container = this._container,
        childArray = this._cache.childArray,
        label = cache.nodes.label,
        layoutContain = cache.nodes.layoutContain,
        navContain = cache.nodes.navContain,
        navLeft = cache.nodes.navLeft,
        navRight = cache.nodes.navRight,
        defaultLayout = cache.nodes.defaultLayout;

    // If passed an array of values
    if (jQuery.isArray(value) && value.length > 0) {
        for (var i = 0, len = value.length; i<len; i+=1) {
            helper(value[i].child || value[i]);
        }
    } else {
        // If passed one value
        return helper(value);
    }

    // helper function
    function helper(target) {
        if (target) {
            // function to create child wrapper and append to appropriate layout
            var addHelper = function(child) {
                var labHeight = ($(label).outerHeight() >= 0) ? $(label).outerHeight() : 0,
                    isFirstChild = (childArray.length === 1),
                    child_wrap = document.createElement("div");

                // create child wrapper & append to defaultLayout
                child_wrap.className = "qlayout_child_wrapper";
                child_wrap.style.filter = "inherit";
                child_wrap.style.position = "absolute";
                child_wrap.style.zoom = "1";
                child_wrap.style[(!params.isRTL) ? "left" : "right"] = cache.totalWidth + "px";
                if (!isFirstChild) { child_wrap.style[(!params.isRTL) ? "marginLeft" : "marginRight"] = params.hgap + "px"; }
                child_wrap.appendChild(child);  // append child to child wrapper
                defaultLayout.appendChild(child_wrap);

                // Calculate max child height and total layout width
                cache.maxHeight = Math.max(cache.maxHeight, $(child).outerHeight(true));
                cache.totalWidth += $(child).outerWidth(true) + ((!isFirstChild) ? params.hgap : 0);

                // If slider is enabled...
                if (params.enableSlider) {
                    var setIndex = (cache.totalWidth/(cache.setWidth + parseInt(defaultLayout.parentNode.style.width, 10)));
                    if (setIndex > 1) {
                        cache.setWidth = cache.totalWidth - $(child).outerWidth(true);
                        if (cache.setWidth > 0) { cache.navLoc.push(cache.setWidth); }
                    }
                }

                // vertically align child wrappers
                if (params.option_valign !== "middle") {
                    child_wrap.style[params.option_valign] = 0 + "px";
                } else {
                    for (var i = 0; i < defaultLayout.children.length; i+=1) {
                        var childWrp = defaultLayout.children[i];
                        childWrp.style.top = (cache.maxHeight - $(childWrp.children[0]).outerHeight(true))*0.5 + "px";
                    }
                }

                // set new defaultLayout dimensions
                defaultLayout.style.width = cache.totalWidth + "px";
                defaultLayout.style.height  = cache.maxHeight + "px";

                // set new layoutContain dimensions
                if (params.autoWidth) { layoutContain.style.width = cache.totalWidth + "px"; }
                if (params.autoHeight) { layoutContain.style.height = cache.maxHeight + "px"; }

                // set new container dimensions
                container.style.width = $(layoutContain).outerWidth() + "px";
                container.style.height = ($(layoutContain).outerHeight() + labHeight) + "px";

                // if navigation is enabled...
                if (params.enableSlider) {
                    if (params.autoWidth && (parseInt(defaultLayout.style.width, 10) >= params.width)) {
                        // navigation should now display
                        // turn autoWidth to false
                        navContain.style.display = "block";
                        defaultLayout.parentNode.style[(!params.isRTL) ? 'marginLeft' : 'marginRight'] = navLeft.style.width;
                        layoutContain.style.width = params.width + "px";
                        params.autoWidth = false;
                    }

                    navContain.style.height = (cache.maxHeight + params.padding*2) + "px";
                    navContain.style.top = (labHeight + params.border_width) + "px";
                    navLeft.children[0].style.top = (parseInt(navContain.style.height, 10) - parseInt(navLeft.children[0].style.height, 10))*0.5 + "px";
                    navRight.children[0].style.top = navLeft.children[0].style.top;

                    // set new overflow container height
                    defaultLayout.parentNode.style.height = defaultLayout.style.height;

                    // update navigation
                    if (!cache.initNav) { that.updateNavigation(); }
                }

                return child_wrap;
            };

            // Accepts both html elements and widgets
            if (target.nodeType === 1) {
                if (jQuery.inArray(target, childArray) === -1) {
                    childArray.push(target);
                    return addHelper(target);
                }
            } else if (target instanceof QStudioDCAbstract) {
                if (jQuery.inArray(target, childArray) === -1) {
                    childArray.push(target);
                    return addHelper(target.widget());
                }
            }
        }
    }
};
QHorizontalLayout.prototype.remove = function() {
    if (!this._container) { return null; }
    // currently set to remove all widgets in childArray
    if (!this._container) { return null; }
    var defaultLayout = this._cache.nodes.defaultLayout;
    while (this._cache.childArray.length) {
        var childWgt = this._cache.childArray[0],
            childEle = (childWgt.widget) ? childWgt.widget() : childWgt,
            childWrap = childEle.parentNode;

        childWrap.removeChild(childEle);
        this._cache.childArray.shift();
    }

    while (defaultLayout.firstChild) {
        defaultLayout.removeChild(defaultLayout.firstChild);
    }

    // reset cache variables
    this._cache.setWidth = 0;
    this._cache.initNav = false;
    this._cache.navLoc = [];
    this._cache.navIndex = 0;
    this._cache.maxHeight = 0;
    this._cache.totalWidth = 0;
};

// Set Layout: Children are laid out according to layout type
function QSetLayout(parent, configObj) {
    // create layout shell
    var doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        container = doc.createElement("div"),
        layoutContain = doc.createElement("div");

    // Container CSS Style
    container.className = "qlayout_container";

    // Layout Container CSS Style
    layoutContain.className = "qlayout_layout_container";
    layoutContain.style.cssText = "position: relative; filter: inherit;";

    // Append children
    container.appendChild(layoutContain);
    parentEle.appendChild(container);

    // Init core vars
    this._container = container;
    this._params = {};
    this._cache = {};
    this._cache.setIndex = 0;
    this._cache.setArray = [];
    this._cache.childArray = [];
    this._cache.nodes = {
        layoutContain : layoutContain,
        setLayout : undefined
    };

    // call config which in-turn will call update to finalize construction
    this.config(configObj || {});
}
QSetLayout.prototype = new QLayoutAbstract();
QSetLayout.prototype.config = function(value) {
    if (!this._container) { return null; }

    // acts as getter
    if (typeof value !== 'object') {
        return this._params;
    }

    // acts as setter
    else {
        if (this._configMap === undefined) {
            // create the configMap
            this.initConfigMap();

            // add additional layout specific params
            this._configMap.direction = { value: 'horizontal', type: "string", options:['horizontal', 'vertical'] };
            this._configMap.layout_type = { value: 'vertical', type: "string", options:['horizontal', 'vertical', 'horizontal grid', 'vertical grid'] };
            this._configMap.num_per_row = { value: 3, type: "number", min: 1 };

            // set default parameters
            this.setParams(this._configMap, true);
        }

        // set custom parameters
        this.setParams(value);

        // parameter presets
        if (this._params.border_style === "none") {
            this._params.border_width = 0;
            this._params.border_radius = 0;
        }

        this._params.border_color = value.border_color;
        this._params.bckgrnd_color = value.bckgrnd_color;
        this._params.label_fontcolor = value.label_fontcolor;

        // Update container
        this.update();

        value = null;
        return this;
    }
};
QSetLayout.prototype.update = function() {
    if (!this._container) { return null; }
    var params = this._params,
        container = this._container;

    // Container CSS Style
    container.id = (params.id || "QSetLayout");
    container.style.position = params.position;
    container.style.marginTop = params.top + "px";
    container.style[(!params.isRTL) ? 'marginLeft' : 'marginRight'] = params.left + "px";
};
QSetLayout.prototype.add = function(value) {
    if (!this._container) { return null; }
    var that = this,
        params = this._params,
        cache = this._cache,
        childArray = this._cache.childArray;

    // If passed an array of values
    if (jQuery.isArray(value) && value.length > 0) {
        for (var i = 0, len = value.length; i<len; i+=1) {
            helper(value[i].child || value[i]);
        }
    }

    // If passed one value
    else {
        return helper(value);
    }

    // helper function
    function helper(target) {
        if (target) {
            var addHelper = function(child) {
                var queryLen = childArray.length-1;
                if ((queryLen !== 0) && (queryLen % params.num_per_row === 0)) {
                    cache.nodes.setLayout = that._layoutFactory(params.layout_type);
                    cache.nodes.setLayout.container().style.display = "none";
                    cache.setArray.push(cache.nodes.setLayout);
                }

                if (!cache.nodes.setLayout) {
                    cache.nodes.setLayout = that._layoutFactory(params.layout_type);
                    cache.setArray.push(cache.nodes.setLayout);

                }

                return cache.nodes.setLayout.add(child);
            };

            // Accepts both html elements and widgets
            if (target.nodeType === 1) {
                if (jQuery.inArray(target, childArray) === -1) {
                    childArray.push(target);
                    return addHelper(target);
                }
            } else if (target instanceof QStudioDCAbstract) {
                if (jQuery.inArray(target, childArray) === -1) {
                    childArray.push(target);
                    return addHelper(target.widget());
                }
            }
        }
    }
};
QSetLayout.prototype.remove = function() {
    if (!this._container) { return null; }
    while (this._cache.setArray.length) {
        var setLayout = this._cache.setArray[0],
            setLayoutParent = setLayout.container().parentNode;

        setLayout.remove();
        setLayoutParent.removeChild(setLayout.container());
        this._cache.setArray.shift();
    }

    // reset cache variables
    this._cache.nodes.setLayout = undefined;
    this._cache.setIndex = 0;
    this._cache.childArray = [];
};
QSetLayout.prototype.next = function() {
    if (!this._container) { return null; }
    var cache = this._cache,
        layoutContain = cache.nodes.layoutContain,
        setLayout = null;

    if (cache.setIndex >= 0 && (cache.setIndex < layoutContain.children.length-1)) {
        setLayout = this.setLayout();
        setLayout.style.display = "none";
        cache.setIndex+=1;
        setLayout = this.setLayout();
        $(setLayout).stop(false, false);
        $(setLayout).fadeIn();
        return cache.setIndex;
    }

    return false;
};
QSetLayout.prototype.back = function() {
    if (!this._container) { return null; }
    var cache = this._cache,
        setLayout = null;

    if (cache.setIndex > 0) {
        setLayout = this.setLayout();
        setLayout.style.display = "none";
        cache.setIndex-=1;
        setLayout = this.setLayout();
        $(setLayout).stop(false, false);
        $(setLayout).fadeIn();
        return cache.setIndex;
    }

    return false;
};
QSetLayout.prototype.setIndex = function(value) {
    if (!this._container) { return null; }
    // when setting, assume we are starting from 0
    if (QUtility.isNumber(value) && (value >= 0 && (value < this._cache.setArray.length))) {
        for (var i=value; i--;) { this.next(); }
    } else {
        return this._cache.setIndex;
    }
};
QSetLayout.prototype.setLayout = function() {
    if (!this._container) { return null; }
    return this._cache.nodes.layoutContain.children[this._cache.setIndex];
};
QSetLayout.prototype._layoutFactory = function(type) {
    if (!this._container) { return null; }
    var layoutContain = this._cache.nodes.layoutContain,
        params = this._params,
        retLayout = null;

    // Don't pass offsets over
    params.top = 0;
    params.left = 0;
    switch (type.toLowerCase()) {
        case "horizontal grid":
            params.direction = "horizontal";
            retLayout = new QBaseLayout(layoutContain, params);
            break;
        case "vertical grid":
            params.direction = "vertical";
            retLayout = new QBaseLayout(layoutContain, params);
            break;
        case "horizontal":
            retLayout = new QHorizontalLayout(layoutContain, params);
            break;
        default:
            retLayout = new QVerticalLayout(layoutContain, params);
            break;
    }

    return retLayout;
};

// Scroll Layout: Children are laid out either horizontally or vertically and animate into position
function QScrollLayout(parent, configObj) {
    // create layout shell
    var doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        container = doc.createElement("div"),       // Main content container
        layoutContain = doc.createElement("div"),   // Content layout container
        defaultLayout = doc.createElement("div");   // Default layout container

    // Container CSS Style
    container.className = "qlayout_container";
    container.style.filter = "inherit";

    // Layout Container CSS Style
    layoutContain.className = "qlayout_layout_container";
    layoutContain.style.cssText = "position: absolute; filter: inherit;";

    // Default Layout CSS Style
    defaultLayout.className = "qlayout_default_layout";
    defaultLayout.style.cssText = "position: relative; filter: inherit;";

    // Append children
    layoutContain.appendChild(defaultLayout);
    container.appendChild(layoutContain);
    parentEle.appendChild(container);

    // Init core vars
    this._container = container;
    this._params = {};
    this._cache = {};
    this._cache.maxSize = 0;
    this._cache.maxChildHeight = 0;
    this._cache.totalSize = 0;
    this._cache.scrollIndex = 0;
    this._cache.childArray = [];
    this._cache.nodes = {
        layoutContain : layoutContain,
        defaultLayout : defaultLayout
    };

    // call config which in-turn will call update to finalize construction
    this.config(configObj || {});
}
QScrollLayout.prototype = new QLayoutAbstract();
QScrollLayout.prototype.config = function(value) {
    if (!this._container) { return null; }

    // acts as getter
    if (typeof value !== 'object') {
        return this._params;
    }

    // acts as setter
    else {
        if (this._configMap === undefined) {
            // create the configMap
            this.initConfigMap();

            // add additional layout specific params
            this._configMap.direction = { value: 'horizontal', type: "string", options:['horizontal', 'vertical'] };
            this._configMap.anim_speed = { value: 800, type: "number", min: 0 };
            this._configMap.end_offset = { value: 100, type: "number", min: 0 };
            this._configMap.start_alpha = { value: 100, type: "number", min: 0 };
            this._configMap.end_alpha = { value: 100, type: "number", min: 0 };
            this._configMap.go_opaque = { value: false, type: "boolean" };

            // set default parameters
            this.setParams(this._configMap, true);
        }

        // set custom parameters
        this.setParams(value);

        // parameter presets
        if (this._params.border_style === "none") {
            this._params.border_width = 0;
            this._params.border_radius = 0;
        }

        this._params.start_alpha = this._params.start_alpha / 100;
        this._params.end_alpha = this._params.end_alpha / 100;


        // Update container
        this.update();

        value = null;
        return this;
    }
};
QScrollLayout.prototype.update = function() {
    if (!this._container) { return null; }
    var params = this._params,
        container = this._container;

    // Container CSS Style
    container.id = (params.id || "QScrollLayout");
    container.style.position = params.position;
    container.style.marginTop = params.top + "px";
    container.style[(!params.isRTL) ? 'marginLeft' : 'marginRight'] = params.left + "px";
};
QScrollLayout.prototype.add = function(value) {
    if (!this._container) { return null; }
    var params = this._params,
        cache = this._cache,
        container = this._container,
        childArray = this._cache.childArray,
        layoutContain = cache.nodes.layoutContain,
        defaultLayout = cache.nodes.defaultLayout,
        isHorz = (params.direction.toLowerCase() === "horizontal");

    // If passed an array of values
    if (jQuery.isArray(value) && value.length > 0) {
        for (var i = 0, len = value.length; i<len; i+=1) {
            helper(value[i].child || value[i]);
        }
    }

    // If passed one value
    else {
        return helper(value);
    }

    // helper function
    function helper(target) {
        if (target) {
            var addHorizontalHelper = function(child, isWidget) {
                var queryLen = childArray.length,
                    child_wrap = document.createElement("div"),
                    childWidth = $(child).outerWidth();

                child_wrap.className = "qlayout_child_wrapper";
                child_wrap.style.filter = "inherit";
                child_wrap.style.position = "absolute";
                child_wrap.style.zoom = "1";
                child_wrap.style.left = ((queryLen > 1) ? (cache.totalSize + params.hgap) : cache.totalSize) + "px";
                child_wrap.style.zIndex = 1000 - queryLen;
                child_wrap.appendChild(child);

                if (childArray.length === 1) {
                    defaultLayout.appendChild(child_wrap);
                    defaultLayout.style.left = -(childWidth*0.5) + "px";
                } else {
                    defaultLayout.insertBefore(child_wrap, defaultLayout.children[0]);
                    if (!isWidget) { $(child_wrap).css({ 'opacity': params.start_alpha }); }
                }

                // Record child wrapper starting loc to use w/ animation
                child_wrap.startLoc = cache.totalSize;

                // Calculate max child height and total layout width
                cache.maxSize = Math.max(cache.maxSize, $(child).outerHeight());
                cache.totalSize += childWidth + ((queryLen > 1) ? params.hgap : 0);

                if (params.option_valign !== "middle") {
                    child_wrap.style[params.option_valign] = 0 + "px";
                } else {
                    for (var i = 0; i < defaultLayout.children.length; i+=1) {
                        var childWrp = defaultLayout.children[i];
                        childWrp.style.top = (cache.maxSize - $(childWrp.children[0]).outerHeight())*0.5 + "px";
                    }
                }

                // Resize
                defaultLayout.style.width = (cache.totalSize + ((QUtility.ieVersion() !== 7) ? params.padding : 0)) + "px";
                defaultLayout.style.height = cache.maxSize + "px";
                layoutContain.style.width = defaultLayout.style.width;
                layoutContain.style.height = defaultLayout.style.height;
                container.style.width = layoutContain.style.width;
                container.style.height = layoutContain.style.height;
                return child_wrap;
            };

            var addVerticalHelper = function(child, isWidget) {
                var queryLen = childArray.length,
                    child_wrap = document.createElement("div"),
                    childWidth = $(child).outerWidth(),
                    childHeight = $(child).outerHeight();

                child_wrap.className = "qlayout_child_wrapper";
                child_wrap.style.filter = "inherit";
                child_wrap.style.position = "absolute";
                child_wrap.style.zoom = "1";
                child_wrap.style.top = ((queryLen > 1) ? (cache.totalSize + params.vgap) : cache.totalSize) + "px";
                child_wrap.style.zIndex = 1000 - queryLen;
                child_wrap.appendChild(child);

                if (childArray.length === 1) {
                    defaultLayout.appendChild(child_wrap);
                } else {
                    defaultLayout.insertBefore(child_wrap, defaultLayout.children[0]);
                    if (!isWidget) { $(child_wrap).css({ 'opacity': params.start_alpha }); }
                }

                // Record child wrapper starting loc to use w/ animation
                child_wrap.startLoc = cache.totalSize;

                // Calculate max child height and total layout width
                cache.maxSize = Math.max(cache.maxSize, childWidth);
                cache.totalSize += childHeight + ((queryLen > 1) ? params.vgap : 0);
                cache.maxChildHeight = Math.max(cache.maxChildHeight, childHeight);

                if (params.option_halign !== "center") {
                    child_wrap.style[params.option_halign] = 0 + "px";
                } else {
                    for (var i = 0; i < defaultLayout.children.length; i+=1) {
                        var childWrp = defaultLayout.children[i];
                        childWrp.style.left = (cache.maxSize - $(childWrp.children[0]).outerWidth())*0.5 + "px";
                    }
                }

                // Resize
                defaultLayout.style.left = -cache.maxSize*0.5 + "px";
                defaultLayout.style.width = cache.maxSize + "px";
                defaultLayout.style.height = (cache.totalSize + ((QUtility.ieVersion() !== 7) ? params.padding : 0)) + "px";
                layoutContain.style.width = defaultLayout.style.width;
                layoutContain.style.height = defaultLayout.style.height;
                container.style.width = layoutContain.style.width;
                container.style.height = cache.maxChildHeight + "px";
                return child_wrap;
            };

            // Accepts both html elements and widgets
            if (target.nodeType === 1) {
                if (jQuery.inArray(target, childArray) === -1) {
                    childArray.push(target);
                    return (isHorz) ? addHorizontalHelper(target, false) : addVerticalHelper(target, false);
                }
            } else if (target instanceof QStudioDCAbstract) {
                if (jQuery.inArray(target, childArray) === -1) {
                    childArray.push(target);
                    target.enabled(false, {
                        alphaVal: (childArray.length > 1) ? params.start_alpha*100 : 100,
                        goOpaque: params.go_opaque,
                        enableExtEvt: (childArray.length === 1)
                    });
                    return (isHorz) ? addHorizontalHelper(target.widget(), true) : addVerticalHelper(target.widget(), true);
                }
            }
        }
    }
};
QScrollLayout.prototype.remove = function() {
    if (!this._container) { return null; }
    var defaultLayout = this._cache.nodes.defaultLayout;
    while (this._cache.childArray.length) {
        var childWgt = this._cache.childArray[0],
            childEle = (childWgt.widget) ? childWgt.widget() : childWgt,
            childWrap = childEle.parentNode;

        childWrap.removeChild(childEle);
        this._cache.childArray.shift();
    }

    while (defaultLayout.firstChild) {
        defaultLayout.removeChild(defaultLayout.firstChild);
    }

    // reset cache variables
    this._cache.maxSize = 0;
    this._cache.maxChildHeight = 0;
    this._cache.totalSize = 0;
    this._cache.scrollIndex = 0;
};
QScrollLayout.prototype.next = function() {
    if (!this._container) { return null; }
    var params = this._params,
        cache = this._cache,
        childArray = this._cache.childArray,
        defaultLayout = cache.nodes.defaultLayout,
        isHorz = (params.direction.toLowerCase() === "horizontal"),
        wgt_child = null,
        child = null,
        child_wrap = null,
        prev_child_wrap = null;

    var nextHorzHelper = function() {
        wgt_child  = (childArray[cache.scrollIndex].widget) ? childArray[cache.scrollIndex] : null;
        child = childArray[cache.scrollIndex].widget() || childArray[cache.scrollIndex];
        child_wrap = child.parentNode;
        prev_child_wrap = child_wrap;
        if (wgt_child) {
            wgt_child.enabled(false, {
                isAnimate: true,
                animSpeed : params.anim_speed,
                alphaVal: params.end_alpha*100,
                goOpaque: params.go_opaque
            });
        }

        cache.scrollIndex+=1;
        wgt_child  = (childArray[cache.scrollIndex].widget) ? childArray[cache.scrollIndex] : null;
        child = childArray[cache.scrollIndex].widget() || childArray[cache.scrollIndex];
        child_wrap = child.parentNode;
        if (wgt_child) {
            wgt_child.enabled(false, {
                alphaVal: 100,
                goOpaque: params.go_opaque,
                enableExtEvt: true
            });
        } else {
            $(child_wrap).css({ "opacity": 1 });
        }

        // Animate default layout container
        $(defaultLayout).animate({
            "left": (-($(child_wrap).outerWidth()*0.5) - child_wrap.startLoc - params.hgap) + "px"
        }, params.anim_speed);

        // Animate previous child wrapper
        $(prev_child_wrap).animate({
            "left": "-=" + (params.end_offset*2) + "px"
        }, params.anim_speed);

        return cache.scrollIndex;
    };

    var nextVertHelper = function() {
        wgt_child  = (childArray[cache.scrollIndex].widget) ? childArray[cache.scrollIndex] : null;
        child = childArray[cache.scrollIndex].widget() || childArray[cache.scrollIndex];
        child_wrap = child.parentNode;
        prev_child_wrap = child_wrap;
        if (wgt_child) {
            wgt_child.enabled(false, {
                isAnimate: true,
                animSpeed : params.anim_speed,
                alphaVal: params.end_alpha*100,
                goOpaque: params.go_opaque
            });
        }

        cache.scrollIndex+=1;
        wgt_child  = (childArray[cache.scrollIndex].widget) ? childArray[cache.scrollIndex] : null;
        child = childArray[cache.scrollIndex].widget() || childArray[cache.scrollIndex];
        child_wrap = child.parentNode;
        if (wgt_child) {
            wgt_child.enabled(false, {
                alphaVal: 100,
                goOpaque: params.go_opaque,
                enableExtEvt: true
            });
        } else {
            $(child_wrap).css({ "opacity": 1 });
        }

        // Animate default layout container
        $(defaultLayout).animate({
            "top": (-child_wrap.startLoc - params.vgap) + "px"
        }, params.anim_speed);

        // Animate previous child wrapper
        $(prev_child_wrap).animate({
            "top": "-=" + (params.end_offset*2) + "px"
        }, params.anim_speed);

        return cache.scrollIndex;
    };

    if (cache.scrollIndex >= 0 && (cache.scrollIndex < childArray.length-1)) {
        return ((isHorz) ? nextHorzHelper() : nextVertHelper());
    }

    return false;
};
QScrollLayout.prototype.back = function() {
    if (!this._container) { return null; }
    var params = this._params,
        cache = this._cache,
        childArray = this._cache.childArray,
        defaultLayout = cache.nodes.defaultLayout,
        isHorz = (params.direction.toLowerCase() === "horizontal"),
        wgt_child = null,
        child = null,
        child_wrap = null;

    var backHorzHelper = function() {
        wgt_child  = (childArray[cache.scrollIndex].widget) ? childArray[cache.scrollIndex] : null;
        if (wgt_child) {
            wgt_child.enabled(false, {
                alphaVal: params.start_alpha*100,
                goOpaque: params.go_opaque
            });
        }

        cache.scrollIndex-=1;
        wgt_child  = (childArray[cache.scrollIndex].widget) ? childArray[cache.scrollIndex] : null;
        child = childArray[cache.scrollIndex].widget() || childArray[cache.scrollIndex];
        child_wrap = child.parentNode;
        if (wgt_child) {
            wgt_child.enabled(false, {
                isAnimate: true,
                animSpeed : params.anim_speed,
                alphaVal: 100,
                goOpaque: params.go_opaque,
                enableExtEvt: true
            });
        } else {
            $(child_wrap).animate({ "opacity": 1 }, params.anim_speed);
        }

        // Animate default layout container
        $(defaultLayout).animate({
            "left": (-($(child_wrap).outerWidth()*0.5) - child_wrap.startLoc - ((cache.scrollIndex > 0) ? params.hgap : 0)) + "px"
        }, params.anim_speed);

        // Animate previous child wrapper
        $(child_wrap).animate({
            "left": "+=" + (params.end_offset*2) + "px"
        }, params.anim_speed);

        return cache.scrollIndex;
    };

    var backVertHelper = function() {
        wgt_child  = (childArray[cache.scrollIndex].widget) ? childArray[cache.scrollIndex] : null;
        if (wgt_child) {
            wgt_child.enabled(false, {
                alphaVal: params.start_alpha*100,
                goOpaque: params.go_opaque
            });
        }

        cache.scrollIndex-=1;
        wgt_child  = (childArray[cache.scrollIndex].widget) ? childArray[cache.scrollIndex] : null;
        child = childArray[cache.scrollIndex].widget() || childArray[cache.scrollIndex];
        child_wrap = child.parentNode;
        if (wgt_child) {
            wgt_child.enabled(false, {
                isAnimate: true,
                animSpeed : params.anim_speed,
                alphaVal: 100,
                goOpaque: params.go_opaque,
                enableExtEvt: true
            });
        } else {
            $(child_wrap).animate({ "opacity": 1 }, params.anim_speed);
        }

        // Animate default layout container
        $(defaultLayout).animate({
            "top": (-child_wrap.startLoc - ((cache.scrollIndex > 0) ? params.vgap : 0)) + "px"
        }, params.anim_speed);

        // Animate previous child wrapper
        $(child_wrap).animate({
            "top": "+=" + (params.end_offset*2) + "px"
        }, params.anim_speed);

        return cache.scrollIndex;
    };

    if (cache.scrollIndex > 0) {
        return ((isHorz) ? backHorzHelper() : backVertHelper());
    }

    return false;
};
QScrollLayout.prototype.scrollIndex = function(value) {
    if (!this._container) { return null; }
    // when setting, assume we are starting from 0
    if (QUtility.isNumber(value) && (value >= 0 && (value < this._cache.childArray.length))) {
        var curAnimSpeed = this._params.anim_speed;
        this._params.anim_speed = 0;
        for (var i=value; i--;) { this.next(); }
        this._params.anim_speed = curAnimSpeed;
    } else {
        return this._cache.scrollIndex;
    }
};

// Sequential Layout: Children are shown sequentially
function QSeqLayout(parent, configObj) {
    // create layout shell
    var doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        container = doc.createElement("div");

    // Container CSS Style
    container.className = "qlayout_container";

    // Append children
    parentEle.appendChild(container);

    // Init core vars
    this._container = container;
    this._params = {};
    this._cache = {};
    this._cache.childArray = [];
    this._cache.nodes = {};
    this._cache.childMaxWidth = 0;
    this._cache.childMaxHeight = 0;

    // call config which in-turn will call update to finalize construction
    this.config(configObj || {});
}
QSeqLayout.prototype = new QLayoutAbstract();
QSeqLayout.prototype.config = function(value) {
    if (!this._container) { return null; }

    if (typeof value !== 'object') {
        return this._params;
    } else {
        if (this._configMap === undefined) {
            // create the configMap
            this.initConfigMap();

            // set default parameters
            this.setParams(this._configMap, true);
        }

        // set custom parameters
        this.setParams(value);

        // parameter presets
        if (this._params.border_style === "none") {
            this._params.border_width = 0;
            this._params.border_radius = 0;
        }

        // Update container
        this.update();

        value = null;
        return this;
    }
};
QSeqLayout.prototype.update = function() {
    if (!this._container) { return null; }
    var params = this._params,
        container = this._container;

    // Container CSS Style
    container.id = (params.id || "QSequentialLayout");
    container.dir = 'ltr';
    container.style.position = params.position;
    container.style.marginTop = params.top + "px";
    container.style[(!params.isRTL) ? 'marginLeft' : 'marginRight'] = params.left + "px";
};
QSeqLayout.prototype.add = function(value) {
    if (!this._container) { return null; }
    var cache = this._cache,
        container = this._container,
        childArray = this._cache.childArray;

    // If passed an array of values
    if (jQuery.isArray(value) && value.length > 0) {
        for (var i = 0, len = value.length; i<len; i+=1) {
            addHelper(value[i]);
        }
    }

    // If passed one value
    else {
        return addHelper(value);
    }

    // helper function
    function addHelper(target) {
        var addToContain = function(wgt) {
            var wgtEle = (wgt.widget) ? wgt.widget() : wgt,
                wrap = document.createElement("div"),
                targetWidth = $(wgtEle).outerWidth(),
                curMaxWidth = cache.childMaxWidth;

            wgtEle.style.display = (childArray.length > 1 && (jQuery.inArray(wgt, childArray) !== -1)) ? "none" : "block";
            wrap.appendChild(wgtEle);
            wrap.className = "qlayout_child_wrapper";
            wrap.style.position = "absolute";
            wrap.style.top = "0px";
            wrap.style.width = "0px";
            wrap.style.height = "0px";
            container.appendChild(wrap);
            cache.childMaxWidth = Math.max(targetWidth, cache.childMaxWidth);
            cache.childMaxHeight = Math.max($(wgtEle).outerHeight(), cache.childMaxHeight);
            container.style.width = cache.childMaxWidth + "px";
            container.style.height = cache.childMaxHeight + "px";
            if (curMaxWidth !== cache.childMaxWidth) {
                for (var i=0; i<container.children.length-1; i+=1) {
                    var child_wrp = container.children[i];
                    child_wrp.style.left =
                        (cache.childMaxWidth - $(child_wrp.children[0]).outerWidth())*0.5 + "px";

                }
            } else {
                wrap.style.left = (cache.childMaxWidth - targetWidth)*0.5 + "px";
            }

            return wrap;
        };

        // Accepts both html elements and widgets
        if (jQuery.inArray(target, childArray) === -1) {
            // need to check whether target widget is answered for update purposes
            if (!(target.widget && target.isAnswered())) {
                childArray.push(target);
            }
            return addToContain(target);
        }
    }
};
QSeqLayout.prototype.remove = function() {
    if (!this._container) { return null; }
    while (this._cache.childArray.length) {
        var childWgt = this._cache.childArray[0],
            childEle = (childWgt.widget) ? childWgt.widget() : childWgt,
            childWrap = childEle.parentNode,
            childWrapParent = childWrap.parentNode;

        childWrap.removeChild(childEle);
        childWrapParent.removeChild(childWrap);
        this._cache.childArray.shift();
    }

    // reset cache variables
    this._cache.childMaxWidth = 0;
    this._cache.childMaxHeight = 0;
    this._cache.childArrayNav = [];
};
QSeqLayout.prototype.next = function() {
    if (!this._container) { return null; }
    this._cache.childArray.shift();
    var nextRow = this._cache.childArray[0];
    if (nextRow) {
        this._cache.nextRow = nextRow;
        if (nextRow.widget) { nextRow = nextRow.widget(); }
        nextRow.style.zIndex = 1000;
        $(nextRow).stop();
        $(nextRow).fadeIn();
    }
};
QSeqLayout.prototype.back = function(value, appendToEnd) {
    // appendToEnd boolean supports DragnDrop component when a bucket's response is returned (i.e. question type 'Restrict')
    if (!this._container) { return null; }
    appendToEnd = (typeof appendToEnd === "boolean" && appendToEnd);
    if (value) {
        if (!appendToEnd) {
            var curRow = this._cache.childArray[0];
            if (curRow) {
                if (curRow.widget) { curRow = curRow.widget(); }
                curRow.style.zIndex = "auto";
                curRow.style.display = "none";
            }

            this._cache.childArray.unshift(value);
        } else {
            this._cache.childArray.push(value);
            if (value.widget) { value = value.widget(); }
            value.style.zIndex = (this._cache.childArray.length > 1) ? "auto" : 1000;
            value.style.display = (this._cache.childArray.length > 1) ? "none" : "block";
        }
    }
};

// QStudio Asset Factory
function QStudioAssetFactory() {}
// for each asset a valid html element must be passed; configObj is optional
QStudioAssetFactory.prototype.assetUpdate = {
    radioBckgrnd : function(bckgrnd, configObj) {
        if (!(bckgrnd && bckgrnd.nodeType === 1)) { return false; }

        var doc = document,
            formBtn = bckgrnd.firstChild,
            params = {};

        params.isRadio = (typeof configObj.isRadio === "boolean") ? configObj.isRadio : true;
        params.bckgrnd_import_up = (QUtility.isString(configObj.bckgrnd_import_up)) ? jQuery.trim(configObj.bckgrnd_import_up) : "";
        params.width = (QUtility.isNumber(configObj.width) && configObj.width >= 1) ? configObj.width : 30;
        params.height = (QUtility.isNumber(configObj.height) && configObj.height >= 1) ? configObj.height : 30;

        // update background element
        bckgrnd.className = "qwidget_background";
        bckgrnd.style.position = "absolute";
        bckgrnd.style.filter = "inherit";
        bckgrnd.style.border = "0px none transparent";

        // Use browser radio/check button
        if (params.bckgrnd_import_up === "") {
            // create form button if one is not present
            if (!formBtn) { formBtn = doc.createElement("input"); }

            // update form button
            formBtn.type = (params.isRadio) ? "radio" : "checkbox";
            formBtn.style.visibility = "hidden";
            formBtn.style.cursor = "inherit";
            formBtn.style.width = "auto";
            formBtn.style.height = "auto";
            formBtn.style.margin = 0;
            formBtn.style.padding = "0";
            formBtn.style.top = "0";
            formBtn.style.left = "0";
            formBtn.style.right = "0";
            formBtn.style.bottom = "0";

            // append to body to get form button dimensions
            doc.body.appendChild(formBtn);
            bckgrnd.style.width = $(formBtn).outerWidth() + "px";
            bckgrnd.style.height = $(formBtn).outerHeight() + "px";
            bckgrnd.appendChild(formBtn);
            formBtn.style.visibility = "";
        }

        // Use custom radio/check button
        else {
            // remove form button if one is present
            if (formBtn) { bckgrnd.removeChild(formBtn); }
            $(bckgrnd).css( {
                'width' : params.width + 'px',
                'height' : params.height + 'px',
                'background-repeat' : 'no-repeat',
                'background-position' : "50% 50%",
                'background-image' : 'url(' + params.bckgrnd_import_up + ')'
            });
        }

        params = null; //GC
        return true;
    },

    baseBckgrnd : function(bckgrnd, configObj) {
        if (!(bckgrnd && bckgrnd.nodeType === 1)) { return false; }

        var params = {};
        params.show_bckgrnd = (typeof configObj.show_bckgrnd === "boolean") ? configObj.show_bckgrnd : true;
        params.show_bckgrnd_import = (typeof configObj.show_bckgrnd_import === "boolean") ? configObj.show_bckgrnd_import : false;
        params.bckgrnd_import_up = (QUtility.isString(configObj.bckgrnd_import_up)) ? jQuery.trim(configObj.bckgrnd_import_up) : "";
        params.width = (QUtility.isNumber(configObj.width) && configObj.width >= 1) ? configObj.width : 100;
        params.height = (QUtility.isNumber(configObj.height) && configObj.height >= 1) ? configObj.height : 100;
        params.padding = (QUtility.isNumber(configObj.padding) && configObj.padding >= 0) ? configObj.padding : 4;
        params.border_width_up = (QUtility.isNumber(configObj.border_width_up) && configObj.border_width_up >= 0) ? configObj.border_width_up : 2;
        params.border_radius = (QUtility.isNumber(configObj.border_radius) && configObj.border_radius >= 0) ? configObj.border_radius : 0;
        params.border_style = (QUtility.isString(configObj.border_style)) ? jQuery.trim(configObj.border_style).toLowerCase() : "none";
        params.border_color_up = (QUtility.paramToHex(configObj.border_color_up)) ? QUtility.paramToHex(configObj.border_color_up) : "A6A8AB";
        params.bckgrnd_color_up = (QUtility.paramToHex(configObj.bckgrnd_color_up)) ? QUtility.paramToHex(configObj.bckgrnd_color_up) : "F2F2F2";

        // provide defaults if incorrect options provided
        if (params.border_style !== "none" && params.border_style !== "solid" && params.border_style !== "dotted" && params.border_style !== "dashed") { params.border_style = "solid"; }

        // update background element
        bckgrnd.className = "qwidget_background";
        bckgrnd.style.position = "absolute";
        bckgrnd.style.display = "block";
        bckgrnd.style.filter = "inherit";
        bckgrnd.style.width = params.width + "px";
        bckgrnd.style.height = params.height + "px";
        bckgrnd.style.padding = params.padding + "px";
        bckgrnd.style.border = params.border_width_up + "px " + params.border_style + " #" + params.border_color_up;
        bckgrnd.style.borderRadius =
            bckgrnd.style.webkitBorderRadius =
                bckgrnd.style.mozBorderRadius = params.border_radius + "px";

        // hide background
        if (!params.show_bckgrnd) {
            bckgrnd.style.backgroundColor = "transparent";
            bckgrnd.style.borderColor = "transparent";
        }

        // display background; either color or import
        else {
            if (params.show_bckgrnd_import) {
                $(bckgrnd).css( {
                    'background-repeat': 'no-repeat',
                    'background-size': "100% 100%",
                    'background-position': 'center',
                    'background-image': (QUtility.ieVersion() < 9) ?
                        "url(" + "" + ") " + 'url(' + params.bckgrnd_import_up + ')' : 'url(' + params.bckgrnd_import_up + ')',
                    'filter': "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + params.bckgrnd_import_up + ", sizingMethod='scale')"
                });
            } else {
                bckgrnd.style.backgroundColor = "#" + params.bckgrnd_color_up;
            }
        }

        params = null; // GC
        return true;
    },

    image : function(imageContain, configObj) {
        if (!(imageContain && imageContain.nodeType === 1)) { return false; }

        var that = this,
            doc = document,
            image = imageContain.firstChild,
            params = {};

        params.callback_success = (typeof configObj.callback_success === "function") ? configObj.callback_success : undefined;
        params.callback_error = (typeof configObj.callback_error === "function") ? configObj.callback_error : undefined;
        params.image = (QUtility.isString(configObj.image) && jQuery.trim(configObj.image) !== "") ? jQuery.trim(configObj.image) : (navigator.userAgent.search("Firefox") === -1) ? "" : "''";
        params.width = (QUtility.isNumber(configObj.width) && configObj.width >= 1) ? configObj.width : 100;
        params.height = (QUtility.isNumber(configObj.height) && configObj.height >= 1) ? configObj.height : 100;
        params.img_left = (QUtility.isNumber(configObj.img_left)) ? configObj.img_left : 0;
        params.img_top = (QUtility.isNumber(configObj.img_top)) ? configObj.img_top : 0;

        // update image container
        imageContain.className = "qwidget_image_container";
        imageContain.style.position = "absolute";
        imageContain.style.filter = (QUtility.ieVersion() > 9) ? "inherit" : "none";
        imageContain.style.width = params.width + "px";
        imageContain.style.height = params.height + "px";
        imageContain.style.marginLeft = params.img_left + "px";
        imageContain.style.marginTop = params.img_top + "px";
        imageContain.style.display = "none";

        // update image element
        image.className = "qwidget_image";
        image.style.position = "absolute";
        image.style.filter = "inherit";
        image.style.visibility = "hidden";
        image.style.width = "auto";
        image.style.height = "auto";
        image.style.maxWidth = imageContain.style.width;
        image.style.maxHeight = imageContain.style.height;
        image.src = params.image;

        // attach image to body to get dimensions
        var getDimenHelper = function(image, imageContain) {
            // Temporarily append to body to set image & imageContain dimensions
            doc.body.appendChild(image);
            image.style.width = $(image).width() + "px";
            image.style.height = $(image).height() + "px";
            imageContain.style.width = image.style.width;
            imageContain.style.height = image.style.height;

            // append image to imageContain & display
            (!imageContain.firstChild) ?
                imageContain.appendChild(image):
                imageContain.insertBefore(image, imageContain.firstChild);
            imageContain.style.display = "block";
            image.style.visibility = "";
        };

        if (!image.complete || !(image.getAttribute("imgInit") === "true")) {
            // create img init attribute and set to true indicating this is the first time image has been created
            image.setAttribute("imgInit", "true");

            // image error event
            $(image).on("error.qbuttoncreator", function () {
                $(this).off("error.qbuttoncreator");

                // Call error callback
                if (typeof params.callback_error === "function") {
                    params.callback_error.call(that, this);
                }

                params = null; //GC
                return false;
            });

            // image load event
            $(image).on("load.qbuttoncreator", function() {
                $(this).off("load.qbuttoncreator");

                // prevent image select dragging
                image.ondragstart = function () { return false; };
                getDimenHelper(image, imageContain);

                // Call success callback
                if (typeof params.callback_success === "function") {
                    params.callback_success.call(that, this);
                }

                params = null; //GC
                return true;
            }).attr("src", params.image);
        } else {
            getDimenHelper(image, imageContain);
            if (typeof params.callback_success === "function") {
                params.callback_success.call(that, image);
            }
        }
    },

    label : function(labelContain, configObj) {
        if (!(labelContain && labelContain.nodeType === 1)) { return false; }

        var doc = document,
            label = labelContain.firstChild,
            calcLabWidth = 0,
            params = {};

        params.isRTL = (typeof configObj.isRTL === "boolean") ? configObj.isRTL : false;
        params.show_label = (typeof configObj.show_label === "boolean") ? configObj.show_label : true;
        params.label_trim = (typeof configObj.label_trim === "boolean") ? configObj.label_trim : false;
        params.label = (QUtility.isString(configObj.label)) ? jQuery.trim(configObj.label) : "";
        params.label_width = (QUtility.isNumber(configObj.label_width) && configObj.label_width >= 1) ? configObj.label_width : 100;
        params.label_height = (QUtility.isNumber(configObj.label_height) && configObj.label_height >= 1) ? configObj.label_height : "auto";
        params.label_padding = (QUtility.isNumber(configObj.label_padding) && configObj.label_padding >= 0) ? configObj.label_padding : 0;
        params.label_left = (QUtility.isNumber(configObj.label_left)) ? configObj.label_left : 0;
        params.label_top = (QUtility.isNumber(configObj.label_top)) ? configObj.label_top : 0;
        params.label_halign = (QUtility.isString(configObj.label_halign)) ? jQuery.trim(configObj.label_halign.toLowerCase()) : "left";
        params.label_fontsize = (QUtility.isNumber(configObj.label_fontsize) && configObj.label_fontsize >= 5) ? configObj.label_fontsize : 18;
        params.label_fontcolor_up = (QUtility.paramToHex(configObj.label_fontcolor_up)) ? QUtility.paramToHex(configObj.label_fontcolor_up) : "5B5F65";
        params.white_space = (QUtility.isString(configObj.white_space)) ? jQuery.trim(configObj.white_space.toLowerCase()) : "normal";
        params.label_box_sizing = (QUtility.isString(configObj.label_box_sizing)) ? jQuery.trim(configObj.label_box_sizing.toLowerCase()) : "content-box";
        params.label_font_family = (QUtility.isString(configObj.label_font_family)) ? jQuery.trim(configObj.label_font_family.toLowerCase()) : "";

        // provide defaults if incorrect options provided
        if (params.label_halign !== "left" && params.label_halign !== "right" && params.label_halign !== "center") { params.label_halign = "left"; }
        if (params.white_space !== "normal" && params.white_space !== "nowrap" && params.white_space !== "inherit") { params.white_space = "normal"; }
        if (params.label_box_sizing !== "content-box" && params.label_box_sizing !== "padding-box" && params.label_box_sizing !== "border-box") { params.label_box_sizing = "content-box"; }

        // update label container
        labelContain.className = "qwidget_label_container";
        labelContain.style.position = "absolute";
        labelContain.style.filter = (QUtility.ieVersion() > 9) ? "inherit" : "none";
        labelContain.style.marginLeft = params.label_left + "px";
        labelContain.style.marginTop = params.label_top + "px";
        //labelContain.style.backgroundColor = "#FFF000";

        // update label element
        if (params.show_label && params.label.length > 0) {
            var labelContainWidth = 0,
                labelContainHeight = 0,
                labelHeight = 0;

            label.className = "qwidget_label";
            label.dir = (!params.isRTL) ? "LTR" : "RTL";
            label.style.cssText += ';'.concat("-webkit-box-sizing: " + params.label_box_sizing);
            label.style.cssText += ';'.concat("-moz-box-sizing: " + params.label_box_sizing);
            label.style.cssText += ';'.concat("box-sizing: " + params.label_box_sizing);
            label.style.filter = (QUtility.ieVersion() > 9) ? "inherit" : "none";
            label.style.visibility = "hidden";
            label.style.cursor = "inherit";
            label.style.wordWrap = "break-word";
            label.style.position = "absolute";
            label.style.fontFamily = params.label_font_family;
            label.style.whiteSpace = params.white_space;
            label.style.fontSize = QUtility.convertPxtoEM(params.label_fontsize) + "em";
            label.style.textAlign = (!params.isRTL) ? params.label_halign : (params.label_halign !== "left") ? params.label_halign : "";
            label.style.color = "#" + params.label_fontcolor_up;
            label.style.width = params.label_width + "px";
            label.style.height = (!QUtility.isNumber(params.label_height)) ? params.label_height :  params.label_height + "px";
            // label.style.lineHeight = "100%"; // REMOVE FOR KANTAR
            label.style.padding = params.label_padding + "px";
            $(label).html(params.label);

            // Temporarily append label to doc.body to get label dimensions
            doc.body.appendChild(label);
            if (params.label_trim) {
                label.style.width = "auto";
                calcLabWidth = $(label).width() + 5; // 5 is small buffer
                label.style.width = ((calcLabWidth > params.label_width) ? params.label_width : calcLabWidth) + "px";
            }

            // record label dimensions
            labelContainWidth = $(label).outerWidth();
            labelContainHeight = $(label).outerHeight();
            labelHeight = $(label).height();

            // set label/labelContain dimensions & display
            label.style.height = ((params.label_box_sizing === "content-box") ? labelHeight : labelContainHeight) + "px";
            labelContain.style.width = labelContainWidth + "px";
            labelContain.style.height = labelContainHeight + "px";
            labelContain.appendChild(label);
            label.style.visibility = "";

            params = null; //GC
            return true;
        }

        params = null; //GC
        return false;
    },

    textarea : function(textarea, configObj) {
        if (!(textarea && textarea.nodeType === 1)) { return false; }

        var evtCount = "keyup.count_widget blur.count_widget",
            params = {};

        params.isRTL = (typeof configObj.isRTL === "boolean") ? configObj.isRTL : false;
        params.other_init_txt = (QUtility.isString(configObj.other_init_txt)) ? jQuery.trim(configObj.other_init_txt) : "";
        params.textarea_width = (QUtility.isNumber(configObj.textarea_width) && configObj.textarea_width >= 1) ? configObj.textarea_width : 80;
        params.textarea_height = (QUtility.isNumber(configObj.textarea_height) && configObj.textarea_height >= 1) ? configObj.textarea_height : 80;
        params.textarea_halign = (QUtility.isString(configObj.textarea_halign)) ? jQuery.trim(configObj.textarea_halign.toLowerCase()) : "left";
        params.textarea_fontsize = (QUtility.isNumber(configObj.textarea_fontsize) && configObj.textarea_fontsize >= 5) ? configObj.textarea_fontsize : 16;
        params.textarea_fontcolor = (QUtility.paramToHex(configObj.textarea_fontcolor)) ? QUtility.paramToHex(configObj.textarea_fontcolor) : "5B5F65";
        params.textarea_font_family = (QUtility.isString(configObj.textarea_font_family)) ? jQuery.trim(configObj.textarea_font_family.toLowerCase()) : "";
        params.max_char = (QUtility.isNumber(configObj.max_char) && configObj.max_char >= 5) ? configObj.max_char : null;

        // provide defaults if incorrect options provided
        if (params.textarea_halign !== "left" && params.textarea_halign !== "right" && params.textarea_halign !== "center") { params.textarea_halign = "left"; }

        // update textarea element
        textarea.className = "qwidget_textarea";
        textarea.dir = (!params.isRTL) ? "LTR" : "RTL";
        textarea.style.position = "absolute";
        textarea.style.filter = (QUtility.ieVersion() > 9) ? "inherit" : "none";
        textarea.style.overflow = "hidden";
        textarea.style.border = "2px solid #BBB";
        textarea.style.margin = "0px";
        textarea.style.padding = "4px";
        textarea.style.whiteSpace = "normal";
        textarea.style.backgroundColor = "#FFFFFF";
        textarea.style.resize = "none";
        textarea.style.fontFamily = params.textarea_font_family;
        textarea.value =
            textarea.defaultValue = params.other_init_txt;
        textarea.style.textAlign = (!params.isRTL) ? params.textarea_halign : (params.textarea_halign !== "left") ? params.textarea_halign : "";
        textarea.style.fontSize = QUtility.convertPxtoEM(params.textarea_fontsize) + "em";
        textarea.style.color = "#" + params.textarea_fontcolor;
        textarea.style.width = params.textarea_width + "px";
        textarea.style.height = params.textarea_height + "px";
        textarea.style.cssText += ';'.concat("-webkit-box-sizing: border-box;");
        textarea.style.cssText += ';'.concat("-moz-box-sizing: border-box;");
        textarea.style.cssText += ';'.concat("box-sizing: border-box;");

        // See about adding a maxChar counter for textArea
        if (params.max_char > 0) {
            if ("maxLength" in textarea) {
                textarea.maxLength = params.max_char;
            } else {
                this.addEvent(textarea, evtCount, function(event) {
                    if(this.value.length > params.max_char) {
                        this.value = this.value.substr(0, params.max_char);
                        return false;
                    }
                });
            }
        } else {
            ("maxLength" in textarea) ?
                textarea.removeAttribute("maxLength"):
                this.removeEvent(textarea, evtCount);
        }

        return true;
    },

    stamp : function(stamp, configObj) {
        if (!(stamp && stamp.nodeType === 1)) { return false; }

        var params = {};
        params.show_stamp = (typeof configObj.show_stamp === "boolean") ? configObj.show_stamp : true;
        params.stamp_import = (QUtility.isString(configObj.stamp_import)) ? jQuery.trim(configObj.stamp_import) : "";
        params.stamp_width = (QUtility.isNumber(configObj.stamp_width) && configObj.stamp_width >= 1) ? configObj.stamp_width : 100;
        params.stamp_height = (QUtility.isNumber(configObj.stamp_height) && configObj.stamp_height >= 1) ? configObj.stamp_height : 100;

        // update stamp element
        stamp.className = "qwidget_stamp";
        stamp.style.display = "none";
        if (params.show_stamp && params.stamp_import !== "") {
            $(stamp).css( {
                'position' : "absolute",
                'width' : params.stamp_width + "px",
                'height' : params.stamp_height + "px",
                'background-repeat' : 'no-repeat',
                'background-size' : params.stamp_width + "px " + params.stamp_height + "px",
                'background-position' : 'center',
                'background-image' : (QUtility.ieVersion() < 9) ?
                    "url(" + "" + ") " + 'url(' + params.stamp_import + ')' : 'url(' + params.stamp_import + ')',
                'filter' : "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + params.stamp_import + ", sizingMethod='scale')"
            });

            params = null; //GC
            return true;
        }

        params = null; //GC
        return false;
    }
};

// QStudio DC Abstract
function QStudioDCAbstract() {}
QStudioDCAbstract.prototype = {
    widget: function() {
        return this._widget;
    },

    config: function() {
        return this._params;
    },

    cache: function() {
        return this._cache;
    },

    type: function() {
        return "";
    },

    setParams : function(value, setDefaults) {
        setDefaults = (typeof setDefaults === "boolean" && setDefaults);
        for (var key in value) {
            if (this._configMap.hasOwnProperty(key)) {
                var type = this._configMap[key].type,
                    options = this._configMap[key].options,
                    min = this._configMap[key].min,
                    userValue = (!setDefaults) ? value[key] : value[key].value;

                switch (type) {
                    case "number" :
                        if (QUtility.isNumber(userValue)) {
                            userValue = Number(userValue);
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
                        break;
                    case "color" :
                        if (QUtility.paramToHex(userValue)) { this._params[key] = QUtility.paramToHex(userValue); }
                        break;
                    default :
                        break;
                }
            }
        }
    },

    destroy : function() {
        if (!this._widget) { return false; }

        // Remove events
        this.removeEvent(this._widget);
        for (var key in this._cache.nodes) {
            if (this._cache.nodes.hasOwnProperty(key) && this._cache.nodes[key]) {
                if (key === "zoomBtn") {
                    qLightBoxSingleton.getInstance().removeWgt(this);
                } else {
                    this.removeEvent(this._cache.nodes[key]);
                }

            }
        }

        // Remove widget
        if (this._widget.parentNode && this._widget.parentNode.nodeType === 1) {
            this._widget.parentNode.removeChild(this._widget);
        }

        // Garbage collect
        this._widget = undefined;
        this._params = {};
        this._cache = {};

        return this;
    },

    rowIndex : function(value) {
        if (!this._widget) { return false; }
        if (QUtility.isNumber(value) && value >= 0) { this._params.rowIndex = value; }
        return this._params.rowIndex;
    },

    colIndex : function(value) {
        if (!this._widget) { return false; }
        if (QUtility.isNumber(value) && value >= 0) { this._params.colIndex = value; }
        return this._params.colIndex;
    },

    isDrag: function fnIsDrag(value) {
        if (fnIsDrag.dragBool === undefined) {
            fnIsDrag.dragBool = false;
        }

        if (typeof value === 'boolean') {
            fnIsDrag.dragBool = value;
            if (value) { qToolTipSingleton.getInstance().hide(); }
        }

        return fnIsDrag.dragBool;
    },

    isTouchMove: function fnIsTouchMove(value) {
        if (fnIsTouchMove.touchBool === undefined) {
            fnIsTouchMove.touchBool = false;
        }

        if (typeof value === 'boolean' && fnIsTouchMove.touchBool !== value) {
            fnIsTouchMove.touchBool = value;
        }

        return fnIsTouchMove.touchBool;
    },

    addEvent : function(elem, type, fn) {
        if (!this._widget || !((elem && elem.nodeType === 1) && (QUtility.isString(type) && type.length > 0) && (typeof fn === 'function'))) { return false; }
        $(elem).on(type, fn);
        return true;
    },

    removeEvent : function(elem, type) {
        if (!this._widget || (!(elem && elem.nodeType === 1))) { return false; }
        (QUtility.isString(type) && type.length > 0) ? $(elem).off(type) : $(elem).off();
        return true;
    }
};

// QStudio Button Abstract
function QStudioBtnAbstract() {
    this._events = {
        hover : "mouseenter.widget mouseleave.widget"
    };
}
QStudioBtnAbstract.prototype = new QStudioDCAbstract();
QStudioBtnAbstract.prototype.initConfigMap = function() {
    if (this._configMap === undefined) {
        this._configMap = {
            isRTL : { value: false, type: "boolean" },
            isRadio : { value: false, type: "boolean" },
            id : { value: "", type: "string" },
            primary_font_family : { value: "", type: "string" },
            secondary_font_family : { value: "", type: "string" },
            image : { value: "", type: "string" },
            label : { value: "", type: "string" },
            description : { value: "", type: "string" },
            rowIndex : { value: -1, type: "number", min: 0 },
            colIndex : { value: -1, type: "number", min: 0 },
            width : { value: 125, type: "number", min: 1 },
            height : { value: 100, type: "number", min: 1 },
            padding : { value: 10, type: "number", min: 0 },
            border_style : { value: 'solid', type: "string", options:['none', 'solid', 'dotted', 'dashed'] },
            border_width_up : { value: 2, type: "number", min: 0 },
            border_width_over : { value: 4, type: "number", min: 0 },
            border_width_down : { value: 2, type: "number", min: 0 },
            border_radius : { value: 0, type: "number", min: 0 },
            border_color_up : { value: 0x757575, type: "color" },
            border_color_over : { value: 0x616161, type: "color" },
            border_color_down : { value: 0x424242, type: "color" },
            show_bckgrnd : { value: true, type: "boolean" },
            show_bckgrnd_import : { value: false, type: "boolean" },
            bckgrnd_color_up : { value: 0xfafafa, type: "color" },
            bckgrnd_color_over : { value: 0xffecb3, type: "color" },
            bckgrnd_color_down : { value: 0xffd54f, type: "color" },
            bckgrnd_import_up : { value: "", type: "string" },
            bckgrnd_import_over : { value: "", type: "string" },
            bckgrnd_import_down : { value: "", type: "string" },
            img_top : { value: 0, type: "number" },
            img_left : { value: 0, type: "number" },
            show_stamp : { value: false, type: "boolean" },
            stamp_import : { value: "", type: "string" },
            stamp_width : { value: 50, type: "number", min: 1 },
            stamp_height : { value: 50, type: "number", min: 1 },
            stamp_top : { value: 0, type: "number" },
            stamp_left : { value: 0, type: "number" },
            show_label : { value: true, type: "boolean" },
            label_ovr_width : { value: false, type: "boolean" },
            show_label_bckgrnd : { value: true, type: "boolean" },
            label_placement : { value: 'bottom', type: "string", options:['top', 'bottom', 'top overlay', 'bottom overlay', 'center overlay'] },
            label_halign : { value: 'left', type: "string", options:['left', 'right', 'center'] },
            label_bckgrnd_color : { value: 0xfafafa, type: "color" },
            label_fontsize : { value: 16, type: "number", min: 5 },
            label_fontcolor_up : { value: 0x000000, type: "color" },
            label_fontcolor_over : { value: 0x000000, type: "color" },
            label_fontcolor_down : { value: 0x000000, type: "color" },
            label_width : { value: 100, type: "number", min: 1 },
            label_left : { value: 0, type: "number" },
            label_top : { value: 0, type: "number" },
            reverse_scale : { value: false, type: "boolean" },
            mouseover_shadow : { value: false, type: "boolean" },
            mouseover_bounce : { value: false, type: "boolean" },
            mouseover_scale : { value: 100, type: "number", min: 0 },
            mousedown_alpha : { value: 100, type: "number", min: 0 },
            mousedown_scale : { value: 100, type: "number", min: 0 },
            use_tooltip : { value: false, type: "boolean" },
            use_lightbox : { value: false, type: "boolean" }
        };
    }
};
QStudioBtnAbstract.prototype.initEvents = function() {
    var that = this;

    // add mouseenter/mouseleave event for widget
    this.addEvent(this._widget, this._events.hover, function(event) {
        that.toggleMouseEnter(event.type === "mouseenter");
    });
};
QStudioBtnAbstract.prototype.config = function() {};
QStudioBtnAbstract.prototype.type = function(){
    return "button";
};
QStudioBtnAbstract.prototype.bucket = function(value) {
    if (!this._widget) { return null; }
    // Allow null value to indicate empty bucket
    if (value instanceof QStudioBucketAbstract && value.add || value === null) {
        this._cache._bucket = value;
    }

    return this._cache._bucket;
};
QStudioBtnAbstract.prototype.isRadio = function(value) {
    if (!this._widget) { return null; }
    if (typeof value === 'boolean' && this._params.isRadio !== value) {
        this._params.isRadio = value;
    }

    return this._params.isRadio;
};
QStudioBtnAbstract.prototype.isOther = function() {
    return false;
};
QStudioBtnAbstract.prototype.isRating = function(value) {
    if (!this._widget) { return null; }
    if (typeof value === 'boolean' && this._cache._ratingBool !== value) {
        this._cache._ratingBool = value;
    }

    return !!this._cache._ratingBool;
};
QStudioBtnAbstract.prototype.isAnswered = function(value) {
    if (!this._widget) { return null; }
    if (typeof value === 'boolean' && (this._cache._answerBool !== value || this._cache._ratingBool)) {
        this._cache._answerBool = value;
        this.toggleMouseDown(value);
    }

    return !!this._cache._answerBool;
};
QStudioBtnAbstract.prototype.enabled = function(value, configObj) {
    if (!this._widget) { return null; }
    if (typeof value === 'boolean') {
        // Init config object
        configObj = configObj || {};
        configObj = {
            isAnimate : (typeof configObj.isAnimate === "boolean") ? configObj.isAnimate : false,
            animSpeed : (typeof configObj.animSpeed === "number" && configObj.animSpeed >= 100) ? configObj.animSpeed : 800,
            goOpaque : (typeof configObj.goOpaque === "boolean") ? configObj.goOpaque : false,
            // if set true and button is disabled, feature module events will still fire (i.e tooltip and click to zoom)
            enableExtEvt : (typeof configObj.enableExtEvt === "boolean") ? configObj.enableExtEvt : false,
            alphaVal : (!value) ?
                ((parseInt(configObj.alphaVal, 10) >= 0) ? parseInt(configObj.alphaVal, 10) : 50) :
                (this._cache._answerBool) ? this._params.mousedown_alpha : 100
        };

        var cacheNodes = this._cache.nodes;
        var opacityHelper = function(ele) {
            (!configObj.isAnimate) ?
                $(ele).css({ "opacity" : ((configObj.alphaVal < 100) ? configObj.alphaVal *.01 : "") }):
                $(ele).animate({ "opacity": configObj.alphaVal *.01 }, configObj.animSpeed);
        };

        this._cache._enableBool = value;
        this._cache._enableExtEvt = configObj.enableExtEvt;
        // cache the latest configuration settings for disabled widget state
        if (!this._cache._enableBool) {
            this._cache._enabConfigObj = configObj;
        }

        // set element css styles
        cacheNodes.wrap.style.cursor = (value) ? 'pointer' : 'default';
        if (!this._cache._enableBool) { cacheNodes.wrap.style.zIndex = "auto"; }
        if (cacheNodes.textarea) { cacheNodes.textarea.disabled = !value; }
        if (cacheNodes.formBtn) { cacheNodes.formBtn.disabled = !this._cache._enableBool; }

        // Opacity setting for widget elements
        if (!(QUtility.ieVersion() === 8)) {
            if (!(configObj.goOpaque)) {
                opacityHelper(cacheNodes.wrap);
            } else {
                for (var child = cacheNodes.wrap.firstChild; child; child = child.nextSibling) {
                    if (child !== cacheNodes.background) {
                        opacityHelper(child);
                    }
                }

                for (var child = cacheNodes.background.firstChild; child; child = child.nextSibling) {
                    opacityHelper(child);
                }
            }
        } else {
            for (var key in cacheNodes) {
                if (cacheNodes.hasOwnProperty(key) && cacheNodes[key] && key !== 'wrap' && ((configObj.goOpaque) ? key !== 'background' : true)) {
                    opacityHelper(cacheNodes[key]);
                }
            }
        }
    }

    return !!this._cache._enableBool;
};
QStudioBtnAbstract.prototype.touchEnabled = function(value) {
    if (!this._widget) { return null; }
    if (typeof value === 'boolean' && value && (this._cache._touchEnableBool !== value)) {
        this._cache._touchEnableBool = value;
        // If passed true, disable mouse hover events
        if (this._cache._touchEnableBool) {
            this.removeEvent(
                this._widget,
                this._events.hover
            );

            if (this._params.use_tooltip) {
                qToolTipSingleton.getInstance().removeWgt(this);
            }
        }
    }

    return !!(this._cache._touchEnableBool);
};
QStudioBtnAbstract.prototype.toggleMouseEnter = function(value) {
    // Widget mouseover zIndex is 2000
    if (!this._widget ||
        this.isDrag() ||
        this._cache._isDown ||
        !(this._cache._enableBool && (!this._cache._answerBool || this._cache._ratingBool))) { return null; }

    var params = this._params,
        cacheNodes = this._cache.nodes,
        updateLabel = (cacheNodes.labelContain && cacheNodes.labelContain.parentNode && cacheNodes.labelContain.parentNode.nodeType === 1),
        updateImage = (cacheNodes.imageContain && cacheNodes.imageContain.parentNode && cacheNodes.imageContain.parentNode.nodeType === 1),
        updateStamp = (cacheNodes.stamp && cacheNodes.stamp.parentNode && cacheNodes.stamp.parentNode.nodeType === 1),
        border_offset = this._params.border_width_over - this._params.border_width_up,
        border_color = (value) ? this._params.border_color_over : this._params.border_color_up,
        border_width = (value) ? this._params.border_width_over : this._params.border_width_up,
        bckgrnd_color = (value) ? this._params.bckgrnd_color_over : this._params.bckgrnd_color_up,
        bckgrnd_import = (value) ? this._params.bckgrnd_import_over : this._params.bckgrnd_import_up,
        fontcolor = (value) ? this._params.label_fontcolor_over : this._params.label_fontcolor_up,
        scale_val = (value) ? this._params.mouseover_scale * .01 :
            ((this._params.reverse_scale && this._cache._isAnimReversed) ? this._params.mousedown_scale * .01 : 1);

    // update background
    if (this._params.show_bckgrnd) {
        cacheNodes.background.style.borderColor = '#' + border_color;
        cacheNodes.background.style.borderWidth = border_width + "px";
        if (!this._params.show_bckgrnd_import) {
            cacheNodes.background.style.backgroundColor = '#' + bckgrnd_color;
        } else {
            cacheNodes.background.style.backgroundImage = (QUtility.ieVersion() < 9) ?
                "url(" + "" + ") " + "url(" + bckgrnd_import + ")" : "url(" + bckgrnd_import + ")";
            cacheNodes.background.style.filter = (!this._cache._isAnimReversed) ?
                "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + bckgrnd_import + ", sizingMethod='scale')":
                "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + bckgrnd_import + ", sizingMethod='scale') progid:DXImageTransform.Microsoft.Alpha(Opacity="+this._params.mousedown_alpha+")";
        }

        // background shadow
        if (this._params.mouseover_shadow) {
            cacheNodes.background.style.MozBoxShadow =
                cacheNodes.background.style.webkitBoxShadow =
                    cacheNodes.background.style.boxShadow = (value) ? '1px 1px 5px #888' : '';
        }
    }

    // update label
    if (updateLabel) {
        cacheNodes.label.style.color = '#' + fontcolor;
        // this currently applies to base widget types w/ top or bottom label placements
        if (cacheNodes.labelContain.parentNode === cacheNodes.wrap) {
            cacheNodes.labelContain.style.marginLeft = (value && (border_offset !== 0)) ? (border_offset + params.label_left) + "px" : params.label_left + "px";
            if (this._params.label_placement === "bottom") {
                cacheNodes.labelContain.style.marginTop =
                    (value && (border_offset !== 0)) ? (((border_offset >= 0) ? border_offset : border_offset*2) + params.label_top) + "px" : params.label_top + "px";
            } else if (this._params.label_placement === "top") {
                cacheNodes.labelContain.style.marginTop =
                    (value && (border_offset !== 0)) ? (((border_offset >= 0) ? border_offset : 0) + params.label_top) + "px" : params.label_top + "px";
            }
        }
    }

    // update image
    if (updateImage) { cacheNodes.imageContain.style.borderColor = '#' + border_color; }

    // update stamp
    if (updateStamp) {
        cacheNodes.stamp.style.marginLeft = (value && (border_offset !== 0)) ? border_offset + "px" : "";
        cacheNodes.stamp.style.marginTop = (value && (border_offset !== 0)) ? border_offset + "px" : "";
    }

    // update wrap
    cacheNodes.wrap.style.marginLeft = (value && (border_offset !== 0)) ? -border_offset + "px" : "";
    cacheNodes.wrap.style.marginTop = (value && (border_offset !== 0)) ? -border_offset + "px" : "";
    cacheNodes.wrap.style.zIndex = (value) ? 2000 : 'auto';

    // wrap scale animation *css3
    $(cacheNodes.wrap).css({
        'transform' : (scale_val !== 1) ? 'scale(' + scale_val + ',' + scale_val + ')' : ""
    });

    // wrap bounce animation
    if (this._params.mouseover_bounce) {
        if (value) {
            $(cacheNodes.wrap).animate({"top" : "2px" }, 170, function() {
                $(this).animate({"top" : "" }, 200);
            });
        } else {
            $(cacheNodes.wrap).stop();
            cacheNodes.wrap.style.top = "";
        }
    }
};
QStudioBtnAbstract.prototype.toggleMouseDown = function(value) {
    // Widget select zIndex is 1999
    if (!this._widget) { return null; }
    this._cache._isDown = value;        // Set isDown boolean
    var params = this._params,
        cacheNodes = this._cache.nodes,
        updateLabel = (cacheNodes.labelContain && cacheNodes.labelContain.parentNode && cacheNodes.labelContain.parentNode.nodeType === 1),
        updateImage = (cacheNodes.imageContain && cacheNodes.imageContain.parentNode && cacheNodes.imageContain.parentNode.nodeType === 1),
        updateStamp = (cacheNodes.stamp && cacheNodes.stamp.parentNode && cacheNodes.stamp.parentNode.nodeType === 1),
        border_offset = this._params.border_width_down - this._params.border_width_up,
        border_color = (value) ? this._params.border_color_down : this._params.border_color_up,
        border_width = (value) ? this._params.border_width_down : this._params.border_width_up,
        bckgrnd_color = (value) ? this._params.bckgrnd_color_down : this._params.bckgrnd_color_up,
        bckgrnd_import = (value) ? this._params.bckgrnd_import_down : this._params.bckgrnd_import_up,
        fontcolor = (value) ? this._params.label_fontcolor_down : this._params.label_fontcolor_up,
        scale_val = (value) ? this._params.mousedown_scale * .01 : 1,
        alpha_val = (value) ? this._params.mousedown_alpha * .01 : 1;

    // update background
    if (this._params.show_bckgrnd) {
        cacheNodes.background.style.borderColor = '#' + border_color;
        cacheNodes.background.style.borderWidth = border_width + "px";
        if (!this._params.show_bckgrnd_import) {
            cacheNodes.background.style.backgroundColor = '#' + bckgrnd_color;
        } else {
            cacheNodes.background.style.backgroundImage = (QUtility.ieVersion() < 9) ?
            "url(" + "" + ") " + "url(" + bckgrnd_import + ")" : "url(" + bckgrnd_import + ")";
            cacheNodes.background.style.filter = "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+bckgrnd_import+", sizingMethod='scale')";
        }

        // background shadow
        if (this._params.mouseover_shadow) {
            cacheNodes.background.style.MozBoxShadow =
                cacheNodes.background.style.webkitBoxShadow =
                    cacheNodes.background.style.boxShadow = (value) ? '1px 1px 5px #888' : '';
        }
    }

    // update label
    if (updateLabel) {
        cacheNodes.label.style.color = '#' + fontcolor;
        // this currently applies to base widget types w/ top or bottom label placements
        if (cacheNodes.labelContain.parentNode === cacheNodes.wrap) {
            cacheNodes.labelContain.style.marginLeft = (value && (border_offset !== 0)) ? (border_offset + params.label_left) + "px" : params.label_left + "px";
            if (this._params.label_placement === "bottom") {
                cacheNodes.labelContain.style.marginTop =
                    (value && (border_offset !== 0)) ? (((border_offset >= 0) ? border_offset : border_offset*2) + params.label_top) + "px" : params.label_top + "px";
            } else if (this._params.label_placement === "top") {
                cacheNodes.labelContain.style.marginTop =
                    (value && (border_offset !== 0)) ? (((border_offset >= 0) ? border_offset : 0) + params.label_top) + "px" : params.label_top + "px";
            }
        }
    }

    // update image
    if (updateImage) { cacheNodes.imageContain.style.borderColor = '#' + border_color; }

    // update stamp
    if (updateStamp) {
        cacheNodes.stamp.style.display = (value) ? 'block' : 'none';
        // stamp border offsets
        if (updateStamp) {
            cacheNodes.stamp.style.marginLeft = (value && (border_offset !== 0)) ? border_offset + "px" : "";
            cacheNodes.stamp.style.marginTop = (value && (border_offset !== 0)) ? border_offset + "px" : "";
        }
    }

    // update wrap
    cacheNodes.wrap.style.marginLeft = (value && (border_offset !== 0)) ? -border_offset + "px" : "";
    cacheNodes.wrap.style.marginTop = (value && (border_offset !== 0)) ? -border_offset + "px" : "";
    cacheNodes.wrap.style.zIndex = (value) ? 1999 : 'auto';

    // wrap animation
    if (!this._params.reverse_scale) {
        // wrap scale animation *css3
        $(cacheNodes.wrap).css({
            'transform' : (scale_val !== 1) ? 'scale(' + scale_val + ',' + scale_val + ')' : ""
        });

        // Button opacity animation; exclude stamp
        if (this._cache._enableBool) {
            if (!(QUtility.ieVersion() === 8)) {
                for (var child = cacheNodes.wrap.firstChild; child; child = child.nextSibling) {
                    if (child !== cacheNodes.stamp) {
                        $(child).css({ "opacity" : (alpha_val < 1) ? alpha_val : "" });
                    }
                }
            } else {
                for (var key in cacheNodes) {
                    if (cacheNodes.hasOwnProperty(key) && cacheNodes[key] && key !== 'wrap' && key !== 'stamp') {
                        $(cacheNodes[key]).css({ "opacity" : (alpha_val < 1) ? alpha_val : "" });
                    }
                }
            }
        }
    }
};
QStudioBtnAbstract.prototype.reverseAnim = function(value) {
    if (!this._widget || !this._params.reverse_scale) { return null; }
    var cacheNodes = this._cache.nodes,
        scale_val = (value) ? this._params.mousedown_scale * .01 : 1,
        alpha_val = (value) ? this._params.mousedown_alpha * .01 : 1;

    // cache whether animation has been reversed
    this._cache._isAnimReversed = value;

    // wrap scale animation
    if (value) { cacheNodes.wrap.style.zIndex = "auto"; }
    $(cacheNodes.wrap).css({
        'transform' : (scale_val !== 1) ? 'scale(' + scale_val + ',' + scale_val + ')' : ""
    });

    // Set opacity on all elements except stamp
    if (!(QUtility.ieVersion() === 8)) {
        for (var child = cacheNodes.wrap.firstChild; child; child = child.nextSibling) {
            if (child !== cacheNodes.stamp) {
                $(child).css({ "opacity" : (alpha_val < 1) ? alpha_val : "" });
            }
        }
    } else {
        for (var key in cacheNodes) {
            if (cacheNodes.hasOwnProperty(key) && cacheNodes[key] && key !== 'wrap' && key !== 'stamp') {
                $(cacheNodes[key]).css({ "opacity" : (alpha_val < 1) ? alpha_val : "" });
            }
        }
    }
};

// QStudio Input Button Abstract
function QStudioInputBtnAbstract() {
    var isTouchDevice = QUtility.isTouchDevice(),
        isMSTouch = QUtility.isMSTouch();

    this._events = {
        hover : "mouseenter.widget mouseleave.widget",
        focus_blur : "focus.widget blur.widget",
        down : (!isMSTouch) ?
            "mousedown.widget touchstart.widget" :
            ((window.PointerEvent) ? "pointerdown.widget" : "MSPointerDown.widget"),
        up : (!isMSTouch) ?
            "mouseup.widget touchend.widget" :
            ((window.PointerEvent) ? "pointerup.widget" : "MSPointerUp.widget"),
        move : (!isMSTouch) ?
            "touchmove.widget" :
            ((window.PointerEvent) ? "pointermove.widget" : "MSPointerMove.widget"),
        cancel : (!isMSTouch) ?
            "touchcancel.widget" :
            ((window.PointerEvent) ? "pointercancel.widget" : "MSPointerCancel.widget")
    };
}
QStudioInputBtnAbstract.prototype = new QStudioDCAbstract();
QStudioInputBtnAbstract.prototype.initConfigMap = function() {
    QStudioBtnAbstract.prototype.initConfigMap.call(this);
    delete this._configMap.show_label;
    this._configMap.label_placement = { value: 'bottom', type: "string", options:['top', 'bottom'] };
    this._configMap.textarea_halign = { value: 'left', type: "string", options:['left', 'right', 'center'] };
    this._configMap.textarea_fontsize = { value: 14, type: "number", min: 5 };
    this._configMap.textarea_fontcolor = { value: 0x212121, type: "color" };
    this._configMap.allow_click = { value: true, type: "boolean" };
    this._configMap.other_show_label = { value: true, type: "boolean" };
    this._configMap.other_init_txt = { value: "Please specify", type: "string" };
    this._configMap.other_msg_invalid = { value: "Number is not valid", type: "string" };
    this._configMap.other_msg_range = { value: "Number is not within range", type: "string" };
    this._configMap.other_min = { value: 0, type: "number" };
    this._configMap.other_max = { value: 9999, type: "number" };
    this._configMap.max_char = { value: null, type: "number", min: 1 };
};
QStudioInputBtnAbstract.prototype.initEvents = function() {
    var that = this,
        doc = document,
        widget = this._widget,
        wrap = this._cache.nodes.wrap,
        textarea = this._cache.nodes.textarea;

    var cleanup = function() {
        // remove touchcancel, touchend & touchmove events
        $([wrap, textarea]).off(that._events.cancel);
        $([wrap, textarea]).off(that._events.up);
        $(doc.body).off(that._events.move);
        $(doc.body).off(that._events.up);
    };

    // Add TextArea click event
    // Because of mobile browser ghost clicking (http://ariatemplates.com/blog/2014/05/ghost-clicks-in-mobile-browsers/)
    // we allow touchend to propagate up and call the mouseup event. The side-effect will be the 300ms delay
    $([wrap, textarea]).on(this._events.down, function(event) {
        if (event.currentTarget === textarea) {
            event.stopPropagation();
        }

        if (that.isInputValid()) {
            return;
        }

        if (event.type === "mousedown" || event.type === "touchstart" || event.type === "pointerdown" || event.type === "MSPointerDown") {
            var startX = (event.originalEvent.touches) ? event.originalEvent.touches[0].clientX : null,
                startY = (event.originalEvent.touches) ? event.originalEvent.touches[0].clientY : null;

            if (startX !== null && startY !== null) {
                // touchcancel event
                $([wrap, textarea]).on(that._events.cancel, function(event) {
                    event.stopPropagation();
                    cleanup();
                });

                // touchmove event
                $(doc.body).on(that._events.move, function(event) {
                    event.stopPropagation();
                    cleanup();

                });
            } else {
                $(doc.body).on(that._events.up, function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    cleanup();
                });
            }

            // touchend event
            $([wrap, textarea]).on(that._events.up, function(event) {
                event.stopPropagation();
                var eventType = event.type.toLowerCase();
                if (eventType.indexOf("pointerup") !== -1 || eventType === "mouseup") {
                    cleanup();

                    // click handler
                    that.preSelect(true);
                    textarea.focus();
                }
            });
        }
    });

    // add mouseenter/mouseleave event for widget
    this.addEvent(widget, this._events.hover, function(event) {
        that.toggleMouseEnter(event.type === "mouseenter");
    });

    // Add TextArea 'focus' & 'blur' events
    this.addEvent(textarea, this._events.focus_blur, function(event) {
        event.stopPropagation();
        if (!that.isAnswered() && !that.isInputValid()) {
            that.textarea((event.type === 'focus') ? '' : that._params.other_init_txt);
            if (event.type === 'blur') {
                that.preSelect(false);
                if (that.isNumeric()) {
                    this.style.borderColor = '#BBB';
                    qMsgDisplaySingleton.getInstance().hide();
                }
            }
        }
    });
};
QStudioInputBtnAbstract.prototype.config = function() {};
QStudioInputBtnAbstract.prototype.type = function() {
    return "input button";
};
QStudioInputBtnAbstract.prototype.textarea = function(value) {
    if (!this._widget) { return null; }
    if (QUtility.isString(value) || QUtility.isNumber(value)) {
        this._cache.nodes.textarea.value = value;
    }

    return this._cache.nodes.textarea.value;
};
QStudioInputBtnAbstract.prototype.isNumeric = function(value) {
    if (!this._widget) { return null; }
    if (typeof value === 'boolean' && this._cache._isNumeric !== value) {
        this._cache._isNumeric = value;
        var that = this,
            background = this._cache.nodes.background,
            textarea = this._cache.nodes.textarea,
            txtEvent = (QUtility.isTouchDevice() && "oninput" in textarea) ?
                "input.widget" : "keydown.widget keyup.widget";

        // Add TextArea 'keydown' & 'keyup' events
        if (this._cache._isNumeric) {
            this.addEvent(textarea, txtEvent, function(event) {
                if (event.type === 'keydown') {
                    event.stopPropagation();
                    var keyCode = event.which || event.keyCode;
                    if (keyCode !== 8 &&                          // Backspace
                        keyCode !== 37 &&                         // Left arrow
                        keyCode !== 39 &&                         // Right arrow
                        keyCode !== 46 &&                         // Delete
                        (keyCode !== 109 && keyCode !== 189) &&   // Negative sign
                        keyCode !== 110 &&                        // Numpad Decimal
                        keyCode !== 190) {                        // Period
                        if (keyCode < 48 || (keyCode > 57 && keyCode < 96) || (keyCode > 105)) { event.preventDefault(); }
                    }
                } else {
                    var isInputValid = that.isInputValid();
                    if (isInputValid === null || isNaN(isInputValid)) {
                        // Range error if isInputValid is null
                        // Invalid number if inputValid is NaN
                        this.style.borderColor = '#FF0000';
                        qMsgDisplaySingleton.getInstance().show(
                            (isInputValid === null) ? that._params.other_msg_range : that._params.other_msg_invalid,  // text
                            background,                                                             // target
                            $(textarea).position().left,                                            // left
                                $(textarea).position().top + $(textarea).outerHeight() - 5              // top
                        );
                    } else if (isInputValid) {
                        this.style.borderColor = '#BBB';    // default border color
                        qMsgDisplaySingleton.getInstance().hide();
                    }
                }
            });
        } else {
            textarea.blur();
            this.removeEvent(textarea, txtEvent);
            if (qMsgDisplaySingleton.getInstance().isShowing()) {
                textarea.style.borderColor = '#BBB';
                qMsgDisplaySingleton.getInstance().hide();
            }
        }
    }

    return this._cache._isNumeric;
};
QStudioInputBtnAbstract.prototype.isInputValid = function() {
    if (!this._widget) { return null; }
    var input = jQuery.trim(this._cache.nodes.textarea.value.toLowerCase()),
        inputValid = (input.length > 0 && input !== this._cache.nodes.textarea.defaultValue.toLowerCase());

    if (this.isNumeric()) {
        if (input.length === 0) {
            qMsgDisplaySingleton.getInstance().hide();
            return false;
        }

        // Return null if number is valid but not within range
        // Return NaN if there is a valid input but input is not a number
        // Return false if textarea is blank
        if (inputValid && QUtility.isNumber(input)) {
            // Number is less than minimum
            if (QUtility.isNumber(this._params.other_min) && input < this._params.other_min) {
                return null;
            }

            // Number is greater than maximum
            if (QUtility.isNumber(this._params.other_max) && input > this._params.other_max) {
                return null;
            }

            // Number is within range
            return true;
        } else {
            return (inputValid) ? NaN : false;
        }
    } else {
        return inputValid;
    }
};
QStudioInputBtnAbstract.prototype.isRadio = function(value) {
    return QStudioBtnAbstract.prototype.isRadio.call(this, value);
};
QStudioInputBtnAbstract.prototype.isOther = function() {
    return true;
};
QStudioInputBtnAbstract.prototype.isRating = function() {
    return false;
};
QStudioInputBtnAbstract.prototype.isAnswered = function(value) {
    var retBool = QStudioBtnAbstract.prototype.isAnswered.call(this, value);
    if (!retBool) {
        this.preSelect((document.activeElement === this._cache.nodes.textarea));
    };
    return retBool;
};
QStudioInputBtnAbstract.prototype.enabled = function(value, configObj) {
    return QStudioBtnAbstract.prototype.enabled.apply(this, [value, configObj]);
};
QStudioInputBtnAbstract.prototype.touchEnabled = function(value) {
    return QStudioBtnAbstract.prototype.touchEnabled.call(this, value);
};
QStudioInputBtnAbstract.prototype.toggleMouseEnter = function(value) {
    return QStudioBtnAbstract.prototype.toggleMouseEnter.call(this, value);
};
QStudioInputBtnAbstract.prototype.toggleMouseDown = function(value) {
    return QStudioBtnAbstract.prototype.toggleMouseDown.call(this, value);
};
QStudioInputBtnAbstract.prototype.reverseAnim = function(value) {
    return QStudioBtnAbstract.prototype.reverseAnim.call(this, value);
};


// QStudio Bucket Abstract
function QStudioBucketAbstract() {
    this._events = {
        hover : "mouseenter.widget mouseleave.widget"
    };
}
QStudioBucketAbstract.prototype = new QStudioDCAbstract();
QStudioBucketAbstract.prototype.initConfigMap = function() {
    if (this._configMap === undefined) {
        this._configMap = {
            isRTL : { value: false, type: "boolean" },
            id : { value: "", type: "string" },
            primary_font_family : { value: "", type: "string" },
            secondary_font_family : { value: "", type: "string" },
            image : { value: "", type: "string" },
            label : { value: "", type: "string" },
            description : { value: "", type: "string" },
            rowIndex : { value: -1, type: "number", min: 0 },
            colIndex : { value: -1, type: "number", min: 0 },
            capvalue : { value: -1, type: "number", min: 0 },   // a capvalue of 0 will hide the bucket
            bucket_animation : { value: 'anchor', type: "string", options:['anchor', 'list', 'fade', 'crop'] },
            grow_animation : { value: 'none', type: "string", options:['none', 'grow all', 'grow individual'] },
            contain_padding : { value: 10, type: "number", min: 0 },
            hgap : { value: 20, type: "number" },
            vgap : { value: 20, type: "number" },
            width : { value: 225, type: "number", min: 1 },
            height : { value: 200, type: "number", min: 1 },
            border_style : { value: 'solid', type: "string", options:['none', 'solid', 'dotted', 'dashed'] },
            border_radius : { value: 0, type: "number", min: 0 },
            border_width_up : { value: 2, type: "number", min: 0 },
            border_width_over : { value: 2, type: "number", min: 0 },
            border_color_up : { value: 0x757575, type: "color" },
            border_color_over : { value: 0x616161, type: "color" },
            show_bckgrnd : { value: true, type: "boolean" },
            show_bckgrnd_import : { value: false, type: "boolean" },
            bckgrnd_color_up : { value: 0xfafafa, type: "color" },
            bckgrnd_color_over : { value: 0xdddddd, type: "color" },
            bckgrnd_import_up : { value: "", type: "string" },
            bckgrnd_import_over : { value: "", type: "string" },
            show_label : { value: true, type: "boolean" },
            show_label_bckgrnd : { value: true, type: "boolean" },
            label_overlay_padding : { value: 4, type: "number", min: 0 },
            label_placement : { value: 'top overlay', type: "string", options:['top', 'bottom', 'top overlay', 'bottom overlay'] },
            label_halign : { value: 'left', type: "string", options:['left', 'right', 'center'] },
            label_overlay_valign : { value: 'center', type: "string", options:['top', 'bottom', 'center'] },
            label_bckgrnd_color : { value: 0xfafafa, type: "color" },
            label_fontsize : { value: 16, type: "number", min: 5 },
            label_fontcolor_up : { value: 0x000000, type: "color" },
            label_fontcolor_over : { value: 0x000000, type: "color" },
            label_height : { value: null, type: "number", min: 1 },
            label_left : { value: 0, type: "number" },
            label_top : { value: 0, type: "number" },
            img_placement : { value: 'none', type: "string", options:['none', 'left', 'right', 'center'] },
            img_top : { value: 0, type: "number" },
            img_left : { value: 0, type: "number" },
            img_width : { value: 100, type: "number", min: 1 },
            img_padding : { value: 10, type: "number", min: 0 },
            use_tooltip : { value: false, type: "boolean" },
            use_lightbox : { value: false, type: "boolean" },
            zoom_left : { value: 0, type: "number" },
            zoom_top : { value: 0, type: "number" },
            crop_width : { value: 50, type: "number", min: 1 },
            crop_height : { value: 50, type: "number", min: 1 },
            list_label_fontsize : { value: 12, type: "number", min: 5 }
        };
    }
};
QStudioBucketAbstract.prototype.initEvents = function() {
    var that = this;

    // add mouseenter/mouseleave event for widget
    this.addEvent(this._widget, this._events.hover, function(event) {
        that.toggleMouseEnter(event.type === "mouseenter");
    });
};
QStudioBucketAbstract.prototype.config = function(value) {};
QStudioBucketAbstract.prototype.type = function() {
    return "bucket";
};
QStudioBucketAbstract.prototype.capvalue = function() {
    if (!this._widget) { return false; }
    return this._params.capvalue;
};
QStudioBucketAbstract.prototype.query = function() {
    if (!this._widget) { return false; }
    return this._cache.bucketArray;
};
QStudioBucketAbstract.prototype.enabled = function(value, configObj) {
    if (!this._widget) { return false; }
    if (typeof value === 'boolean') {
        // Init config object
        configObj = configObj || {};
        configObj = {
            enableExtEvt : (typeof configObj.enableExtEvt === "boolean") ? configObj.enableExtEvt : false,
            alphaVal : (!value) ? ((parseInt(configObj.alphaVal, 10) >= 0) ? parseInt(configObj.alphaVal, 10) : 50) : 100
        };

        this._cache._enableBool = value;
        this._cache._enableExtEvt = configObj.enableExtEvt;
        // cache the latest configuration settings for disabled widget state
        if (!this._cache._enableBool) {
            this._cache._enabConfigObj = configObj;
        }

        if (!(QUtility.ieVersion() === 8)) {
            $(this._cache.nodes.wrap).css({ "opacity": (configObj.alphaVal < 100) ? configObj.alphaVal * .01 : "" });
        } else {
            for (var key in this._cache.nodes) {
                if (this._cache.nodes.hasOwnProperty(key) && this._cache.nodes[key] && key !== 'wrap') {
                    $(this._cache.nodes[key]).css({ "opacity" : (configObj.alphaVal < 100) ? configObj.alphaVal * .01 : "" });
                }
            }
        }

        // set enabled on drop container widgets
        for (var i= 0, len=this._cache.bucketArray.length; i<len; i+=1) {
            this._cache.bucketArray[i].enabled(value, configObj);
        }
    }

    return !!this._cache._enableBool;
};
QStudioBucketAbstract.prototype.touchEnabled = function(value) {
    if (!this._widget) { return false; }
    if (typeof value === 'boolean' && value && (this._cache._touchEnableBool !== value)) {
        this._cache._touchEnableBool = value;
        // If passed true, disable mouse hover events
        if (this._cache._touchEnableBool) {
            this.removeEvent(
                this._widget,
                this._events.hover
            );

            if (this._params.use_tooltip) {
                qToolTipSingleton.getInstance().removeWgt(this);
            }
        }
    }

    return !!(this._cache._touchEnableBool);
};
QStudioBucketAbstract.prototype.toggleMouseEnter = function(value) {
    // Widget mouseover zIndex is 2000
    if (!this._widget ||
        !(this._cache._enableBool)) { return null; }

    var cacheNodes = this._cache.nodes,
        params = this._params,
        updateLabel = (cacheNodes.labelContain && cacheNodes.labelContain.parentNode && cacheNodes.labelContain.parentNode.nodeType === 1),
        border_width = (value) ? this._params.border_width_over : this._params.border_width_up,
        border_offset = this._params.border_width_over - this._params.border_width_up,
        border_color = (value) ? this._params.border_color_over : this._params.border_color_up,
        bckgrnd_color = (value) ? this._params.bckgrnd_color_over : this._params.bckgrnd_color_up,
        bckgrnd_import = (value) ? this._params.bckgrnd_import_over : this._params.bckgrnd_import_up,
        fontcolor = (value) ? this._params.label_fontcolor_over : this._params.label_fontcolor_up;

    // Background CSS settings
    if (this._params.show_bckgrnd) {
        cacheNodes.background.style.borderColor = '#' + border_color;
        cacheNodes.background.style.borderWidth = border_width + "px";
        if (!this._params.show_bckgrnd_import) {
            cacheNodes.background.style.backgroundColor = '#' + bckgrnd_color;
        } else {
            cacheNodes.background.style.backgroundImage = (QUtility.ieVersion() < 9) ?
                "url(" + "" + ") " + "url(" + bckgrnd_import + ")" : "url(" + bckgrnd_import + ")";
            cacheNodes.background.style.filter = "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + bckgrnd_import + ", sizingMethod='scale')";
        }
    }

    if (this._params.isImgLeftRight) { cacheNodes.imageContain.style.borderColor = '#' + border_color; }

    // Label CSS settings
    if (updateLabel) {
        cacheNodes.label.style.color = '#' + fontcolor;
        // this currently applies to base bucket widget type w/ top or bottom label placements
        if (cacheNodes.labelContain.parentNode === cacheNodes.wrap) {
            cacheNodes.labelContain.style.marginLeft = (value && (border_offset !== 0)) ? (border_offset + params.label_left) + "px" : params.label_left + "px";
            if (this._params.label_placement === "bottom") {
                cacheNodes.labelContain.style.marginTop =
                    (value && (border_offset !== 0)) ? (((border_offset >= 0) ? border_offset : border_offset*2) + params.label_top) + "px" : params.label_top + "px";
            } else if (this._params.label_placement === "top") {
                cacheNodes.labelContain.style.marginTop =
                    (value && (border_offset !== 0)) ? (((border_offset >= 0) ? border_offset : 0) + params.label_top) + "px" : params.label_top + "px";
            }
        }
    }

    // wrap border offsets
    cacheNodes.wrap.style.marginLeft = (value && (border_offset !== 0)) ? -border_offset + "px" : "";
    cacheNodes.wrap.style.marginTop = (value && (border_offset !== 0)) ? -border_offset + "px" : "";
    cacheNodes.wrap.style.zIndex = (value) ? 2000 : 'auto';
};
QStudioBucketAbstract.prototype.add = function(value) {
    if (!this._widget) { return null; }
    // value must be a valid button widget
    if (value.bucket && (value.type() === "button")) {
        QStudioBucketAbstract.prototype.animType[this._params.bucket_animation].apply(this, [
            value,
            false   // indicates we are adding
        ]);

        // See if we need to grow background height as items are added
        if (this._params.grow_animation === "grow individual") {
            this.resizeContainHeight(this._cache.yPosition + this._cache.maxSize + this._params.contain_padding*2);
        }

        return true;
    }

    return false;
};
QStudioBucketAbstract.prototype.remove = function(value) {
    if (!this._widget) { return null; }
    // value must be a valid button widget
    if (value.bucket && (value.type() === "button")) {
        QStudioBucketAbstract.prototype.animType[this._params.bucket_animation].apply(this, [
            value,
            true        // indicates we are removing
        ]);

        // See if we need to grow background height as items are removed
        if (this._params.grow_animation === "grow individual") {
            this.resizeContainHeight(this._cache.yPosition + this._cache.maxSize + this._params.contain_padding*2);
        }

        return true;
    }

    return false;
};
QStudioBucketAbstract.prototype.animType = {
    anchor : function(value, isRemove) {
        var dropContain = this._cache.nodes.dropContain;
        // If we are adding to dropContain
        if (!isRemove) {
            // Clear any position settings on widget
            value.widget().style.top = "";
            value.widget().style.left = "";

            var child_wrap = undefined;
            if (value.bucket() !== this) {
                // Remove value from any previous buckets
                if (value.bucket()) { value.bucket().remove(value); }
                value.bucket(this);
                this.query().push(value);

                // we need to calculate widget dimensions in the down state & use those values to size child_wrap div
                var widgetWidth = $(value.widget()).outerWidth() - value.config().border_width_up*2 + value.config().border_width_down* 2,
                    widgetHeight = $(value.widget()).outerHeight() - value.config().border_width_up*2 + value.config().border_width_down*2;

                // remove margins from wrap if they are present; margins are present if border widths vary between up & down state
                if (value.cache().nodes.wrap) {
                    value.cache().nodes.wrap.style.marginLeft = "";
                    value.cache().nodes.wrap.style.marginTop = "";
                }

                // Create a wrapper for widget
                child_wrap = document.createElement("div");
                child_wrap.className = "qwidget_bucket_widget_wrapper";
                child_wrap.style.width = widgetWidth + "px";
                child_wrap.style.height = widgetHeight + "px";
                child_wrap.appendChild(value.widget());
                dropContain.appendChild(child_wrap);

                // Position child_wrap in dropContain
                this.__layoutContainerChild(child_wrap);
            } else {
                child_wrap = dropContain.children[jQuery.inArray(value, this.query())];
                child_wrap.appendChild(value.widget());
            }

            return value;
        }

        // If we are removing from dropContain
        else {
            var spliceIndex = jQuery.inArray(value, this.query());
            if (spliceIndex !== -1) {
                // cleanup
                dropContain.removeChild(dropContain.children[spliceIndex]);
                this.query().splice(spliceIndex, 1);
                this.__containerUpdate();
                value.bucket(null);
                return value;
            }

            return false;
        }
    },

    fade : function(value, isRemove) {
        var dropContain = this._cache.nodes.dropContain;
        // If we are adding to dropContain
        if (!isRemove) {
            // Clear current position settings
            value.widget().style.top = "";
            value.widget().style.left = "";

            var child_wrap = undefined;
            // Add to dropContain
            if (value.bucket() !== this) {
                this.query().push(value);
                value.bucket(this);
                value.enabled(false, { alphaVal: 100 });

                // we need to calculate widget dimensions in the down state & use those values to size child_wrap div
                var widgetWidth = $(value.widget()).outerWidth() - value.config().border_width_up*2 + value.config().border_width_down* 2,
                    widgetHeight = $(value.widget()).outerHeight() - value.config().border_width_up*2 + value.config().border_width_down*2;

                // remove margins from wrap if they are present; margins are present if border widths vary between up & down state
                if (value.cache().nodes.wrap) {
                    value.cache().nodes.wrap.style.marginLeft = "";
                    value.cache().nodes.wrap.style.marginTop = "";
                }

                // Create a wrapper for widget
                // child_wrap zIndex is 2000
                child_wrap = document.createElement("div");
                child_wrap.className = "qwidget_bucket_widget_wrapper";
                child_wrap.style.position = "absolute";
                child_wrap.style.left = (($(dropContain).outerWidth() - widgetWidth) * 0.5) + "px";
                child_wrap.style.zIndex = 2000;
                child_wrap.style.opacity = "inherit";
                child_wrap.style.filter = "inherit";
                child_wrap.style.width = widgetWidth + "px";
                child_wrap.style.height = widgetHeight + "px";
                child_wrap.appendChild(value.widget());
                dropContain.appendChild(child_wrap);

                // Fade wrapper out
                $(child_wrap).fadeOut(500, function() {
                    child_wrap.style.display = "none";
                });

                return value;
            }
        }

        // If we are removing from dropContain
        else {
            var spliceIndex = jQuery.inArray(value, this.query());
            if (spliceIndex !== -1) {
                // cleanup
                dropContain.removeChild(dropContain.children[spliceIndex]);
                this.query().splice(spliceIndex, 1);
                if (!value.enabled()) { value.enabled(true); }
                value.bucket(null);
                return value;
            }

            return false;
        }
    },

    list : function(value, isRemove) {
        var dropContain = this._cache.nodes.dropContain;
        // If we are adding to dropContain
        if (!isRemove) {
            // Clear current position settings
            value.widget().style.top = "";
            value.widget().style.left = "";

            var child_wrap = null;
            if (value.bucket() !== this) {
                // Remove value from any previous buckets
                if (value.bucket()) { value.bucket().remove(value); }
                value.bucket(this);
                this.query().push(value);

                // Create a wrapper for widget
                child_wrap = document.createElement("div");
                child_wrap.className = "qwidget_bucket_widget_wrapper";
                child_wrap.appendChild(value.widget());
                dropContain.appendChild(child_wrap);

                // Create a new text widget
                var textWgt = new QTextBtn(value.widget(), {
                        primary_font_family : value.config().primary_font_family,
                        isRTL : value.config().isRTL,
                        label: (value.config().label || "..."),
                        txtbtn_trim: true,
                        width: $(dropContain).width() - 8,
                        padding: 2,
                        border_width_up: 2,
                        use_tooltip: false,
                        border_color_up: parseInt(value.config().border_color_down, 16),
                        bckgrnd_color_up: parseInt(value.config().bckgrnd_color_down, 16),
                        label_fontsize: this._params.list_label_fontsize,
                        label_halign: value.config().label_halign,
                        label_fontcolor_up: parseInt(value.config().label_fontcolor_down, 16)
                    }),
                    valueWgtWidth = value.widget().style.width,
                    valueWgtHeight = value.widget().style.height;

                // set '...' as empty string
                if ($(textWgt.cache().nodes.label).html() === "...") { $(textWgt.cache().nodes.label).html(""); }

                // store reference of newly created widget
                value.cache().nodes.bucketListWgt = textWgt;

                // remove current widget wrap & add new wrap
                value.widget().removeChild(value.cache().nodes.wrap);
                value.widget().removeChild(textWgt.widget());
                value.widget().appendChild(textWgt.cache().nodes.wrap);

                // set value widget dimensions to match new widget dimensions
                value.widget().style.width = textWgt.widget().style.width;
                value.widget().style.height = textWgt.widget().style.height;
                value.widget().style.cursor = "pointer";

                // temporarily store original value widget dimensions on newly created widget
                textWgt.widget().style.width = valueWgtWidth;
                textWgt.widget().style.height = valueWgtHeight;

                // Set child wrapper dimensions
                child_wrap.style.width = $(value.widget()).outerWidth() + "px";
                child_wrap.style.height = $(value.widget()).outerHeight() + "px";

                // Position child_wrap in dropContain
                this.__layoutContainerChild(child_wrap);
            } else {
                child_wrap = dropContain.children[jQuery.inArray(value, this.query())];
                child_wrap.appendChild(value.widget());
            }

            return value;
        }

        // If we are removing from dropContain
        else {
            var spliceIndex = jQuery.inArray(value, this.query());
            if (spliceIndex !== -1) {
                // remove created widget wrapper from value widget and restore to its normal look & size
                value.widget().removeChild(value.cache().nodes.bucketListWgt.cache().nodes.wrap);
                value.widget().appendChild(value.cache().nodes.wrap);
                value.widget().style.width = value.cache().nodes.bucketListWgt.widget().style.width;
                value.widget().style.height = value.cache().nodes.bucketListWgt.widget().style.height;
                value.widget().style.cursor = "";

                // remove reference to created widget since it is no longer needed
                delete value.cache().nodes.bucketListWgt;

                // cleanup
                dropContain.removeChild(dropContain.children[spliceIndex]);
                this.query().splice(spliceIndex, 1);
                this.__containerUpdate();
                value.bucket(null);
                return value;
            }

            return false;
        }
    },

    crop : function(value, isRemove) {
        var dropContain = this._cache.nodes.dropContain;
        // If we are adding to dropContain
        if (!isRemove) {
            // Clear current position settings
            value.widget().style.top = "";
            value.widget().style.left = "";

            var child_wrap = null;
            if (value.bucket() !== this) {
                // Remove value from any previous buckets
                if (value.bucket()) { value.bucket().remove(value); }
                value.bucket(this);
                this.query().push(value);

                // Create a wrapper for widget
                child_wrap = document.createElement("div");
                child_wrap.className = "qwidget_bucket_widget_wrapper";
                child_wrap.appendChild(value.widget());
                dropContain.appendChild(child_wrap);

                var hasImage = (value.cache().nodes.imageContain &&
                        value.cache().nodes.imageContain.firstChild &&
                        value.cache().nodes.imageContain.parentNode &&
                        value.cache().nodes.imageContain.parentNode.nodeType === 1),
                    wgt = undefined,
                    valueWgtWidth = value.widget().style.width,
                    valueWgtHeight = value.widget().style.height,
                    btnClass = (hasImage) ? QBaseBtn : QTextBtn;

                // Create a new base or text widget
                wgt = new btnClass(value.widget(), {
                    primary_font_family : value.config().primary_font_family,
                    isRTL : value.config().isRTL,
                    label: value.config().label,
                    image: value.config().image,
                    show_label : !hasImage,
                    show_bckgrnd : value.config().show_bckgrnd,
                    width: this._params.crop_width,
                    height : this._params.crop_height,
                    padding: 2,
                    border_width_up: 1,
                    use_tooltip: false,
                    use_lightbox : false,
                    border_color_up: parseInt(value.config().border_color_down, 16),
                    bckgrnd_color_up: parseInt(value.config().bckgrnd_color_down, 16),
                    label_fontsize: value.config().label_fontsize,
                    label_halign: value.config().label_halign,
                    label_fontcolor_up: parseInt(value.config().label_fontcolor_down, 16)
                });

                // store reference of newly created widget
                value.cache().nodes.bucketListWgt = wgt;

                // remove current widget wrap & add new wrap
                value.widget().removeChild(value.cache().nodes.wrap);
                value.widget().removeChild(wgt.widget());
                value.widget().appendChild(wgt.cache().nodes.wrap);

                // set value widget dimensions to match new widget dimensions
                value.widget().style.width = wgt.widget().style.width;
                value.widget().style.height = wgt.widget().style.height;
                value.widget().style.cursor = "pointer";

                // temporarily store original value widget dimensions on newly created widget
                wgt.widget().style.width = valueWgtWidth;
                wgt.widget().style.height = valueWgtHeight;

                // Set child wrapper dimensions
                child_wrap.style.width = $(value.widget()).outerWidth() + "px";
                child_wrap.style.height = $(value.widget()).outerHeight() + "px";

                // Position child_wrap in dropContain
                this.__layoutContainerChild(child_wrap);
            } else {
                child_wrap = dropContain.children[jQuery.inArray(value, this.query())];
                child_wrap.appendChild(value.widget());
            }

            return value;
        }

        // If we are removing from dropContain
        else {
            var spliceIndex = jQuery.inArray(value, this.query());
            if (spliceIndex !== -1) {
                // remove created widget wrapper from value widget and restore to its normal look & size
                value.widget().removeChild(value.cache().nodes.bucketListWgt.cache().nodes.wrap);
                value.widget().appendChild(value.cache().nodes.wrap);
                value.widget().style.width = value.cache().nodes.bucketListWgt.widget().style.width;
                value.widget().style.height = value.cache().nodes.bucketListWgt.widget().style.height;
                value.widget().style.cursor = "";

                // remove reference to created widget since it is no longer needed
                delete value.cache().nodes.bucketListWgt;

                // cleaup
                dropContain.removeChild(dropContain.children[spliceIndex]);
                this.query().splice(spliceIndex, 1);
                this.__containerUpdate();
                value.bucket(null);
                return value;
            }
        }
    }
};
QStudioBucketAbstract.prototype.resizeContainHeight = function(value) {
    if (!this._widget) { return null; }
    value = (QUtility.isNumber(value) && (value > this._params.height)) ? value : this._params.height;
    var params = this._params,
        cacheNodes = this._cache.nodes,
        isOverlayLabel = (params.label_placement.indexOf("overlay") !== -1),
        labContainHeight = $(cacheNodes.labelContain).outerHeight();

    // Adjust background & imageContain height
    (!params.show_bckgrnd_import) ?
        cacheNodes.background.style.height = (value + ((isOverlayLabel) ? labContainHeight : 0)) + "px":
        $(cacheNodes.background).css({
            'height': (value + ((isOverlayLabel) ? labContainHeight : 0)) + "px",
            'background-size': (((!params.isImgLeftRight) ? params.width : (params.width + params.img_width)) + params.padding*2) + 'px ' + ((value + ((isOverlayLabel) ? labContainHeight : 0)) + params.padding*2) + 'px'
        });

    if (params.isImgLeftRight) { cacheNodes.imageContain.style.height = value + "px"; }

    // If labelContain is placed at bottom, adjust position as the bucket is resized
    if (params.label_placement.indexOf("bottom") !== -1) {
        (!isOverlayLabel) ?
            cacheNodes.labelContain.style.top = (value + params.border_width_up*2) + "px":
            cacheNodes.labelContain.style.top = value + "px";
    }

    // Set wrapper and widget height
    cacheNodes.wrap.style.height =
        ($(cacheNodes.background).height() + params.border_width_up*2 + ((!isOverlayLabel) ? labContainHeight : 0)) + "px";
    this._widget.style.height = cacheNodes.wrap.style.height;

    return true;
};
QStudioBucketAbstract.prototype.getBucketContainHeight = function() {
    if (!this._widget) { return null; }
    return $(this._cache.nodes.dropContain).outerHeight();
};
QStudioBucketAbstract.prototype.__layoutContainerChild = function(child_wrap) {
    if (!this._widget) { return null; }
    var containWidth = $(this._cache.nodes.dropContain).width(),
        childWrapWidth = $(child_wrap).outerWidth(),
        childWrapHeight = $(child_wrap).outerHeight();

    if(((this._cache.xPosition + childWrapWidth) > containWidth) && (this._cache.xPosition !== 0)) {
        this._cache.maxRowSize = Math.max(this._cache.maxRowSize, this._cache.xPosition - this._params.hgap);
        this._cache.xPosition = 0;
        this._cache.yPosition += this._cache.maxSize + this._params.vgap;
        this._cache.maxSize = 0;
    }

    child_wrap.style.position = "absolute";
    child_wrap.style.top = (this._cache.yPosition + this._params.contain_padding) + "px";
    child_wrap.style.left = (this._cache.xPosition + this._params.contain_padding) + "px";

    this._cache.xPosition += childWrapWidth + this._params.hgap;
    this._cache.maxSize = Math.max(this._cache.maxSize, childWrapHeight);
    this._cache.maxRowSize = Math.max(this._cache.maxRowSize, this._cache.xPosition - this._params.hgap);

    // update dropContain height on grow animation
    if (this._params.grow_animation !== "none") {
        this._cache.nodes.dropContain.style.height = Math.max(
            (this._cache.yPosition + this._cache.maxSize + this._params.contain_padding*2),
            this._params.height
        ) + "px";
    }
};
QStudioBucketAbstract.prototype.__containerUpdate = function() {
    if (!this._widget) { return null; }
    this._cache.maxSize = 0;
    this._cache.maxRowSize = 0;
    this._cache.maxColSize = 0;
    this._cache.xPosition = 0;
    this._cache.yPosition = 0;

    // Calling this method will setup dropContain children left/top positions
    var dropContain = this._cache.nodes.dropContain,
        i = 0, dLen = dropContain.children.length;

    if (dLen > 0) {
        for (i= 0; i<dLen; i+=1) {
            this.__layoutContainerChild(dropContain.children[i]);
        }
    } else {
        dropContain.style.height = this._params.height + "px";
    }

    return true;
};

// QStudio Slider Abstract
function QStudioSliderAbstract() {
    this._events = {
        click : "click.widget",
        down : (!QUtility.isMSTouch()) ?
            ("mousedown.widget touchstart.widget") : ((window.PointerEvent) ? "pointerdown.widget" : "MSPointerDown.widget"),
        move : (!QUtility.isMSTouch()) ?
            ("mousemove.widget touchmove.widget") : ((window.PointerEvent) ? "pointermove.widget" : "MSPointerMove.widget"),
        up : (!QUtility.isMSTouch()) ?
            ("mouseup.widget touchend.widget") : ((window.PointerEvent) ? "pointerup.widget" : "MSPointerUp.widget")
    };
}
QStudioSliderAbstract.prototype = new QStudioDCAbstract();
QStudioSliderAbstract.prototype.initEvents = function() {
    var doc = document,
        that = this,
        cacheNodes = this._cache.nodes,
        isMSTouch = QUtility.isMSTouch(),
        isTouchDevice = QUtility.isTouchDevice();

    // slider handle events
    this.addEvent(cacheNodes.handleContain, this._events.down, function(event) {
        event.preventDefault();
        event.stopPropagation();

        if ((isMSTouch && isTouchDevice && !event.originalEvent.isPrimary) || !that._cache._enableBool || that.isDrag()) { return; }

        // set isDrag true to prevent users from interacting w/ another slider simultaneously
        that.isDrag(true);

        // slider init
        that.slideInit(event);

        // move event
        $(doc).on(that._events.move, function(event) {
            event.preventDefault();

            // slider move
            that.slideMove(event);
        });

        // up event
        $(doc).on(that._events.up, function(event) {
            that.isDrag(false);
            $(doc).off(that._events.move);
            $(doc).off(that._events.up);

            // slider end
            that.slideEnd(event);

            // delete surveyScale on up event
            delete that._params.surveyScale;
        });
    });

    // slider track event
    $(cacheNodes.track).on(this._events.click, function(event) {
        event.stopPropagation();
        if (!that._params.allow_track_click || !that.enabled() || event.target.className.indexOf("handle") > -1) { return; }
        that.slideInit(event, true);    // pass true to indicate method is being called from a track click
        that.slideMove(event);
        that.slideEnd(event);
    });
};
QStudioSliderAbstract.prototype.initConfigMap = function() {
    if (this._configMap === undefined) {
        this._configMap = {
            isRTL : { value: false, type: "boolean" },
            id : { value: "", type: "string" },
            primary_font_family : { value: "", type: "string" },
            secondary_font_family : { value: "", type: "string" },
            image : { value: "", type: "string" },
            label : { value: "", type: "string" },
            rowIndex : { value: -1, type: "number", min: 0 },
            colIndex : { value: -1, type: "number", min: 0 },
            direction : { value: 'horizontal', type: "string", options:['horizontal', 'vertical'] },
            max : { value: 100, type: "number" },
            min : { value: 0, type: "number" },
            precision : { value: 0, type: "number", min: 0 },
            allow_track_click : { value: true, type: "boolean" },
            widget_border_style : { value: 'none', type: "string", options:['none', 'solid', 'dotted', 'dashed'] },
            widget_border_width : { value: 0, type: "number", min: 0 },
            widget_border_color : { value: 0xCCCCCC, type: "color" },
            snap_type : { value: 'none', type: "string", options:['none', 'snap before', 'snap after'] },
            handle_start_loc : { value: 0, type: "number", min: 0 },
            show_label : { value: true, type: "boolean" },
            label_halign : { value: 'left', type: "string", options:['left', 'right', 'center'] },
            label_fontsize : { value: 16, type: "number", min: 5 },
            label_fontcolor : { value: 0x000000, type: "color" },
            label_width : { value: 100, type: "number", min: 1 },
            label_left : { value: 0, type: "number" },
            label_top : { value: 0, type: "number" },
            show_label_background : { value: false, type: "boolean" },
            label_background_color : { value: 0xEEEEEE, type: "color" },
            width : { value: 400, type: "number", min: 1 },
            height : { value: 40, type: "number", min: 1 },
            track_border_style : { value: 'solid', type: "string", options:['none', 'solid', 'dotted', 'dashed'] },
            track_border_width : { value: 2, type: "number", min: 0 },
            track_border_radius : { value: 0, type: "number", min: 0 },
            track_border_color : { value: 0x757575, type: "color" },
            track_color : { value: 0xfafafa, type: "color" },
            show_track_import : { value: false, type: "boolean" },
            track_import : { value: "", type: "string" },
            show_highlight : { value: true, type: "boolean" },
            highlight_color : { value: 0xffd54f, type: "color" },
            tick_show : { value: true, type: "boolean" },
            tick_width : { value: 10, type: "number", min: 1 },
            tick_height : { value: 10, type: "number", min: 1 },
            tick_color : { value: 0xff0000, type: "color" },
            ticklabel_display_type : { value: 'show all', type: "string", options:['show none', 'show ends', 'show all'] },
            ticklabel_width : { value: 50, type: "number", min: 1 },
            ticklabel_offset : { value: 0, type: "number" },
            ticklabel_fontsize : { value: 12, type: "number", min: 5 },
            ticklabel_fontcolor : { value: 0x000000, type: "color" },
            show_handle_bckgrnd : { value: true, type: "boolean" },
            handle_width : { value: 50, type: "number", min: 1 },
            handle_height : { value: 50, type: "number", min: 1 },
            handle_padding : { value: 4, type: "number", min: 0 },
            handle_border_style : { value: 'solid', type: "string", options:['none', 'solid', 'dotted', 'dashed'] },
            handle_border_width : { value: 2, type: "number", min: 0 },
            handle_border_radius : { value: 0, type: "number", min: 0 },
            handle_border_color_up : { value: 0x757575, type: "color" },
            handle_border_color_down : { value: 0x424242, type: "color" },
            handle_color_up : { value: 0xfafafa, type: "color" },
            handle_color_down : { value: 0xffd54f, type: "color" },
            show_handle_import : { value: false, type: "boolean" },
            handle_import_up : { value: "", type: "string" },
            handle_import_down : { value: "", type: "string" },
            handle_label_disptype : { value: 'none', type: "string", options:['column label', 'column value', 'range value', 'none'] },
            handle_label_fontsize : { value: 14, type: "number", min: 5 },
            handle_label_fontcolor : { value: 0x000000, type: "color" },
            handle_label_bckgrnd_color : { value: 0xf5f5f5, type: "color" },
            handle_label_inittxt : { value: "", type: "string" },
            handle_label_width : { value: 125, type: "number", min: 1 },
            handle_label_left : { value: 0, type: "number" },
            handle_label_top : { value: 0, type: "number" },
            show_handle_label_bckgrnd : { value: false, type: "boolean" },
            img_placement : { value: 'none', type: "string", options:['none', 'top', 'bottom', 'left', 'right'] },
            img_auto_center : { value: false, type: "boolean" },
            show_init_img : { value: false, type: "boolean" },
            img_width : { value: 150, type: "number", min: 1 },
            img_height : { value: 150, type: "number", min: 1 },
            img_left : { value: 0, type: "number" },
            img_top : { value: 0, type: "number" },
            show_end_img : { value: false, type: "boolean" },
            end_img_width : { value: 100, type: "number", min: 1 },
            end_img_height : { value: 100, type: "number", min: 1 },
            end_img_left : { value: 0, type: "number" },
            end_img_top : { value: 0, type: "number" }
        };
    }
};
QStudioSliderAbstract.prototype.config = function(value) {};
QStudioSliderAbstract.prototype.type = function() {
    return "slider";
};
QStudioSliderAbstract.prototype.enabled = function(value, alphaValue) {
    if (!this._widget) { return null; }
    if (typeof value === 'boolean') {
        this._cache._enableBool = value;
        alphaValue = (!value) ? ((parseInt(alphaValue, 10) >= 0) ? parseInt(alphaValue, 10) : 50) : 100;
        // cache the latest alphaValue for disabled widget state
        if (!this._cache._enableBool) {
            this._cache._enabAlphaValue = alphaValue;
        }

        // handle container cursor prop
        this._cache.nodes.handleContain.style.cursor = (value) ? 'pointer' : 'default';

        // set element opacity
        if (!(QUtility.ieVersion() === 8)) {
            $(this._cache.nodes.wrap).css({ "opacity": (alphaValue < 100) ? alphaValue * .01 : "" });
        } else {
            for (var key in this._cache.nodes) {
                if (this._cache.nodes.hasOwnProperty(key) && this._cache.nodes[key] && key !== "wrap") {
                    $(this._cache.nodes[key]).css({ "opacity": (alphaValue < 100) ? alphaValue * .01 : "" });
                }
            }

            for (var child = this._cache.nodes.tickContain.firstChild; child; child = child.nextSibling) {
                if (child.children[1]) {
                    $(child.children[1]).css({ "opacity": (alphaValue < 100) ? alphaValue * .01 : "" });
                    var tickLabel = child.children[1].firstChild;
                    if (tickLabel) { $(tickLabel).css({ "opacity": (alphaValue < 100) ? alphaValue * .01 : "" }); }
                }
            }
        }
    }

    return !!this._cache._enableBool;
};
QStudioSliderAbstract.prototype.isAnswered = function(value, location, isLocColumnVal) {
    if (!this._widget) { return null; }
    if (typeof value === "boolean") {
        this._cache._answerBool = value;
        var handleContain = this._cache.nodes.handleContain,
            handle = this._cache.nodes.handle,
            handleDivide = this._cache.nodes.handleDivide,
            handle_import = (value) ? this._params.handle_import_down : this._params.handle_import_up,
            handle_color = (value) ? this._params.handle_color_down : this._params.handle_color_up,
            border_color = (value) ? this._params.handle_border_color_down : this._params.handle_border_color_up,
            lastVar = (!this._params.isVertical) ? 'lastX' : 'lastY',
            stylePos = (!this._params.isVertical) ? 'left' : 'top';

        // Handle background change
        if (this._params.show_handle_bckgrnd) {
            if (!this._params.show_handle_import) {
                handle.style.borderColor = "#" + border_color;
                handle.style.backgroundColor = "#" + handle_color;
            } else {
                handle.style.backgroundImage = (QUtility.ieVersion() < 9) ? "url(" + "" + ") " + "url(" + handle_import + ")" : "url(" + handle_import + ")";
                handle.style.filter = "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+handle_import+", sizingMethod='scale')";
            }

            if (handleDivide) { handleDivide.style.backgroundColor = "#" + QUtility.paramToHex(border_color); }
        }

        // If slider is unanswered
        if (!value) {
            // Reset handle location & lastX/lastY
            handleContain.style[stylePos] = this._params.handleInitLoc + "px";
            handleContain[lastVar] = this._params.handleInitLoc;

            // Reset highlight, handleLabel value, and image displayed
            this._handleLabelChange(true);
            this._highlightChange(true);
            this._imageChange(true);
        }

        // If slider is answered
        else {
            isLocColumnVal = (typeof isLocColumnVal === "boolean") ? isLocColumnVal : true;
            // If we are passed a valid location for the handleContain...
            if (!isLocColumnVal) {
                if (QUtility.isNumber(location) && (location >= 0 && location <= this._params.trackSize)) {
                    handleContain.style[stylePos] = location + "px";
                    handleContain[lastVar] = location;
                    if (this._params.snap_type !== "none") { this._handleSnap(); }
                    this._handleLabelChange();
                    this._highlightChange();
                    this._imageChange();
                }
            } else {
                if (QUtility.isNumber(location) && location >= 0 && location < this._params.tick_array.length) {
                    this._handleSnap(location);
                    this._handleLabelChange();
                    this._highlightChange();
                    this._imageChange();
                }
            }
        }
    }

    return !!this._cache._answerBool;
};
QStudioSliderAbstract.prototype.slideInit = function(event, fromTrack) {
    if (!this._widget) { return null; }
    // Check to see if event is a callback
    if (typeof event === 'function') {
        this._cache._initCallBack = event;
        return;
    }

    fromTrack = (typeof fromTrack === "boolean" && fromTrack);
    event = (event.type.indexOf("touch") !== -1 && event.originalEvent.targetTouches) ?
        event.originalEvent.targetTouches[0] : ((!QUtility.isMSTouch()) ? event : event.originalEvent);

    var params = this._params,
        cacheNodes = this._cache.nodes,
        lastVar = (!this._params.isVertical) ? 'lastX' : 'lastY',
        dragVar = (!this._params.isVertical) ? 'dragX' : 'dragY',
        pageVar = (!this._params.isVertical) ? 'pageX' : 'pageY',
        scrollOffset = (($(params.survey_contain).scrollTop() !== null) ? $(params.survey_contain).scrollTop() : 0) +
            (($(params.layout_contain).scrollTop() !== null) ? $(params.layout_contain).scrollTop() : 0);

    // record surveyScale on down event
    this._params.surveyScale = (!this._params.isVertical) ?
        QUtility.getQStudioSurveyScale().a : QUtility.getQStudioSurveyScale().d;

    if (!fromTrack) {
        cacheNodes.handleContain[dragVar] =
            event[pageVar] - (cacheNodes.handleContain[lastVar] * this._params.surveyScale);
    } else {
        cacheNodes.handleContain[dragVar] =
            $(cacheNodes.track).offset()[(!this._params.isVertical) ? "left" : "top"] + (this._params.track_border_width * this._params.surveyScale);
    }
    cacheNodes.handleContain[dragVar] += scrollOffset;

    this._handleLabelChange();
    this._highlightChange();
    this._imageChange();

    // Set slider as answered
    if (!this._cache._answerBool) { this.isAnswered(true); }

    // Fire callback if valid
    if (this._cache._initCallBack) { this._cache._initCallBack.call(this); }
};
QStudioSliderAbstract.prototype.slideMove = function(event) {
    if (!this._widget) { return null; }
    // Check to see if event is a callback
    if (typeof event === 'function') {
        this._cache._moveCallBack = event;
        return;
    }

    event = (event.type.indexOf("touch") !== -1 && event.originalEvent.targetTouches) ?
        event.originalEvent.targetTouches[0] : ((!QUtility.isMSTouch()) ? event : event.originalEvent);

    var params = this._params,
        cacheNodes = this._cache.nodes,
        lastVar = (!this._params.isVertical) ? 'lastX' : 'lastY',
        dragVar = (!this._params.isVertical) ? 'dragX' : 'dragY',
        pageVar = (!this._params.isVertical) ? 'pageX' : 'pageY',
        styleVar = (!this._params.isVertical) ? 'left' : 'top',
        scrollOffset = (($(params.survey_contain).scrollTop() !== null) ? $(params.survey_contain).scrollTop() : 0) +
            (($(params.layout_contain).scrollTop() !== null) ? $(params.layout_contain).scrollTop() : 0),
        moveLoc = (event[pageVar] - cacheNodes.handleContain[dragVar] + scrollOffset) * (1/this._params.surveyScale);

    if (moveLoc < this._cache._minLoc) { moveLoc = this._cache._minLoc; }
    if (moveLoc > this._cache._maxLoc) { moveLoc = this._cache._maxLoc; }

    cacheNodes.handleContain.style[styleVar] = moveLoc + "px";
    cacheNodes.handleContain[lastVar] = moveLoc;

    if (this._params.snap_type === "snap before") { this._handleSnap(); }
    this._handleLabelChange();
    this._highlightChange();
    this._imageChange();

    // Fire callback if valid
    if (this._cache._moveCallBack) { this._cache._moveCallBack.call(this); }
};
QStudioSliderAbstract.prototype.slideEnd = function(event) {
    if (!this._widget) { return null; }
    // Check to see if event is a callback
    if (typeof event === 'function') {
        this._cache._endCallBack = event;
        return;
    }

    // If handle is set to snap after moving
    if (this._params.snap_type === "snap after") {
        this._handleSnap();
        this._handleLabelChange();
        this._highlightChange();
        this._imageChange();
    }

    // Fire callback if valid
    if (this._cache._endCallBack) { this._cache._endCallBack.call(this); }
};
QStudioSliderAbstract.prototype.setHandleBounds = function(value) {
    if (!this._widget) { return null; }
    if (value && (QUtility.isNumber(value.minLoc) || QUtility.isNumber(value.maxLoc))) {
        // Set handle min dragging location
        if (value.minLoc >= 0 && value.minLoc <= this._params.trackSize) {
            this._cache._minLoc = value.minLoc;
        }

        // Set handle max dragging location
        if (value.maxLoc <= this._params.trackSize && value.maxLoc >= 0) {
            this._cache._maxLoc = value.maxLoc;
        }
    }
};
QStudioSliderAbstract.prototype.value = function() {
    if (!this._widget) { return null; }
    var tLen = this._params.tick_array.length,
        tickArray = (!(this._params.isVertical || this._params.isRTL)) ? this._params.tick_array : this._params.tick_array.concat([]).reverse();

    switch(this._params.handle_label_disptype) {
        case 'column value':
            return this._columnValue();
        case 'column label':
            if (tLen > 0) {
                var columnValue = (!this._params.isVertical && !this._params.isRTL) ? this._columnValue() : tLen - 1 - this._columnValue(),
                    label = (columnValue >= 0) ?
                        ((tickArray[columnValue].label !== undefined) ?
                            tickArray[columnValue].label : tickArray[columnValue]).toString() : "";

                return jQuery.trim(label);
            }

            return "";
        case 'range value':
            return this._rangeValue();
        default:
            return "";
    }
};
QStudioSliderAbstract.prototype._baseValue = function() {
    if (!this._widget) { return null; }
    var handleContain = this._cache.nodes.handleContain,
        lastVar = (!this._params.isVertical) ? 'lastX' : 'lastY',
        sizeVar = (!this._params.isVertical) ? 'width' : 'height';

    if (!this._params.isVertical && this._params.isRTL) {
        return ((this._params[sizeVar] - handleContain[lastVar]) / this._params[sizeVar]);
    }

    return (handleContain[lastVar] / this._params[sizeVar]);
};
QStudioSliderAbstract.prototype._rangeValue = function() {
    if (!this._widget) { return null; }
    var baseValue = (!this._params.isVertical) ? this._baseValue() : 1 - this._baseValue();
    return parseFloat(((baseValue * (this._params.max - this._params.min) + this._params.min).toFixed(this._params.precision)));
};
QStudioSliderAbstract.prototype._columnValue = function() {
    if (!this._widget) { return null; }
    var baseValue = (!this._params.isVertical) ? this._baseValue() : 1 - this._baseValue(),
        tLen = this._params.tick_array.length;

    if (tLen <= 1) { return 0; }
    return Math.round(baseValue * (tLen - 1));
};
QStudioSliderAbstract.prototype._handleLabelChange = function(reset) {
    if (!this._widget || (this._params.handle_label_disptype === "none")) { return null; }
    // See if we need to reset handleLabel
    if (typeof reset === 'boolean' && reset) {
        $(this._cache.nodes.handleLabel).html(this._params.handle_label_inittxt);
        return;
    }

    $(this._cache.nodes.handleLabel).html(this.value());
};
QStudioSliderAbstract.prototype._highlightChange = function(reset) {
    if (!this._widget || !this._params.show_highlight) { return null; }
    var highlight = this._cache.nodes.highlight,
        maxSizeValue = parseFloat(highlight.style[(!this._params.isVertical) ? 'maxWidth' : 'maxHeight']);

    // See if we need to reset highlight
    if (typeof reset === 'boolean' && reset) {
        highlight.style[(!this._params.isVertical) ? 'width' : 'height'] = "0px";
        return;
    }

    if (!this._params.isVertical) {
        highlight.style.width = (this._baseValue() * maxSizeValue) + "px";
        if (this._params.isRTL) {
            highlight.style.left = (maxSizeValue - (this._baseValue() * maxSizeValue)) + "px";
        }
    } else {
        highlight.style.height = (maxSizeValue - (this._baseValue() * maxSizeValue)) + "px";
        highlight.style.top = (this._baseValue() * maxSizeValue) + "px";
    }
};
QStudioSliderAbstract.prototype._handleSnap = function(value) {
    if (!this._widget) { return null; }
    // Snap to nearest track tick
    var handleContain = this._cache.nodes.handleContain,
        tickContain = this._cache.nodes.tickContain,
        tLen = this._params.tick_array.length,
        tickIndex = (QUtility.isNumber(value) && value >= 0 && value < tLen) ? value : ((!this._params.isVertical && !this._params.isRTL) ?
            this._columnValue() : tLen - 1 - this._columnValue()),
        stylePos = (!this._params.isVertical) ? 'left' : 'top',
        lastVar = (!this._params.isVertical) ? 'lastX' : 'lastY',
        tickWrap = tickContain.children[tickIndex],
        moveLoc = parseFloat(tickWrap.style[stylePos]);

    if (moveLoc < this._cache._minLoc) { moveLoc = this._cache._minLoc; }
    if (moveLoc > this._cache._maxLoc) { moveLoc = this._cache._maxLoc; }
    handleContain[lastVar] = moveLoc;
    handleContain.style[stylePos] = moveLoc + "px";
};
QStudioSliderAbstract.prototype._imageChange = function(reset) {
    if (!this._widget || !this._params.show_img) { return null; }
    var columnValue = (!this._params.isVertical && !this._params.isRTL) ?
        this._columnValue() : this._params.tick_array.length - 1 - this._columnValue();

    // reset image container image
    if (typeof reset === "boolean" && reset) {
        // hide current imgIndex image
        if (this._cache.nodes.imageContain.children[this._cache._imgIndex]) {
            this._cache.nodes.imageContain.children[this._cache._imgIndex].style.display = "none";
            this._cache._imgIndex = -1;
        }

        var curImg = this._cache.nodes.imageContain.children[columnValue];
        if (curImg) {
            if (!this._params.show_init_img) {
                curImg.style.display = "none";
            } else {
                curImg.style.display = "block";
                this._cache._imgIndex = columnValue;
            }
        }

        return;
    }

    if (columnValue !== this._cache._imgIndex) {
        var prevImg = this._cache.nodes.imageContain.children[this._cache._imgIndex],
            curImg = this._cache.nodes.imageContain.children[columnValue];

        if (prevImg) { prevImg.style.display = "none"; }
        if (curImg) { curImg.style.display = "block"; }
        this._cache._imgIndex = columnValue;
    }
};
QStudioSliderAbstract.prototype._updateHandleImage =  function(image) {
    if (!this._widget || (!(QUtility.isString(image)))) { return null; }
    var cacheNodes = this._cache.nodes,
        params = this._params,
        handleWidth = $(cacheNodes.handle).outerWidth(),
        handleHeight = $(cacheNodes.handle).outerHeight(),
        handleMargLeft = parseInt(cacheNodes.handle.style.marginLeft, 10),
        handleMargTop = parseInt(cacheNodes.handle.style.marginTop, 10);

    //  update handle image
    QStudioAssetFactory.prototype.assetUpdate.image.apply(this, [cacheNodes.handleImageContain, {
        image : image,
        width : params.handle_width,
        height : params.handle_height,
        // callback would fire on successful load
        callback_success: function () {
            // set image className so handle children are recognized during event handling
            cacheNodes.handleImg.className = "qwidget_slider_handle_image";

            // position handleImageContain
            cacheNodes.handleImageContain.style.left = (handleMargLeft + (handleWidth - $(cacheNodes.handleImageContain).width()) * 0.5) + "px";
            cacheNodes.handleImageContain.style.top = (handleMargTop + (handleHeight - $(cacheNodes.handleImageContain).height()) * 0.5) + "px";

            // Append handleImageContain to handleContain; make handleImageContain the second child
            cacheNodes.handleContain.insertBefore(cacheNodes.handleImageContain, cacheNodes.handle.nextSibling);
        },
        // callback would fire when an error is encountered
        callback_error: function() {
            // remove handleImageContain from handleContain
            if (cacheNodes.handleImageContain.parentNode && cacheNodes.handleImageContain.parentNode.nodeType === 1) {
                cacheNodes.handleImageContain.parentNode.removeChild(cacheNodes.handleImageContain);
            }
        }
    }]);
};
QStudioSliderAbstract.prototype._updateTickLabel =  function(tickArray) {
    // currently used when tick label display type is set to 'row ends'
    if (!this._widget || (!(jQuery.isArray(tickArray) && tickArray.length > 0))) { return null; }
    var doc = document,
        cacheNodes = this._cache.nodes,
        params = this._params,
        i = 0, tLen = cacheNodes.tickContain.children.length,
        tickSpacing = (params[(!params.isVertical) ? "width" : "height"] / (tLen - 1));

    tickArray = (!(params.isVertical || params.isRTL)) ? tickArray : tickArray.concat([]).reverse();
    for (i = 0; i < tLen; i += 1) {
        // tickWrap contains a tick div and a tickLabelContain div; the tickLabelContain div contains a tickLabel label
        var tickWrap = cacheNodes.tickContain.children[i],
            tickLabelContain = tickWrap.lastChild,
            tickLabel = doc.createElement("label"),
            tickLabelWidth = 0,
            tickLabelHeight = 0,
            updateTickLabel = false;

        // if tickLabelContain is valid, remove from tickWrap since we will recreate
        if (tickLabelContain.firstChild) {
            tickWrap.removeChild(tickLabelContain);
        }

        // update tick label
        tickLabelContain = doc.createElement("div");
        tickLabelContain.appendChild(tickLabel);
        updateTickLabel = QStudioAssetFactory.prototype.assetUpdate.label.apply(this, [tickLabelContain, {
            label_trim : true,
            label_font_family : params.secondary_font_family,
            isRTL : params.isRTL,
            label : jQuery.trim(((tickArray[i].label !== undefined) ? tickArray[i].label : tickArray[i]).toString()),
            label_width : (!params.isVertical) ? Math.min(params.ticklabel_width, tickSpacing) : params.ticklabel_width,
            label_halign : (!params.isVertical) ? "center" : "left",
            label_fontsize : params.ticklabel_fontsize,
            label_fontcolor_up : params.ticklabel_fontcolor
        }]);

        // finish tick label setup
        if (updateTickLabel && tickLabel.style.display !== "none") {
            // append tickLabelContain to tickWrap
            tickWrap.appendChild(tickLabelContain);

            // record tickLabel dimensions
            tickLabelWidth = $(tickLabel).width();
            tickLabelHeight = $(tickLabel).height();

            // for vertical direction, don't let tick label height exceed tickSpacing
            if (params.isVertical && (tickLabelHeight > tickSpacing)) {
                tickLabelContain.style.height = tickSpacing + "px";
                tickLabel.style.height = tickSpacing + "px";
                tickLabel.style.overflow = "hidden";
                tickLabelHeight = tickSpacing;
            }

            // position tickLabelContain; hardcode 2 into offsets so labels don't hug the track
            if (!params.isVertical) {
                tickLabelContain.style.marginTop = (params.track_border_width + params.height + params.ticklabel_offset + 2) + "px";
                tickLabelContain.style.marginLeft = (-tickLabelWidth * 0.5) + "px";
            } else {
                tickLabelContain.style.marginTop = (-tickLabelHeight * 0.5) + "px";
                tickLabelContain.style.marginLeft = (params.track_border_width + params.width + params.ticklabel_offset + 2) + "px";
            }
        }
    }
};

// Base Button Widget
function QBaseBtn(parent, configObj) {
    // Create Button Shell
    var doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        widget = doc.createElement("div"),
        wrap = doc.createElement("div"),
        background = doc.createElement("div"),
        imageContain = doc.createElement("div"),
        image = doc.createElement("img"),
        labelContain = doc.createElement("div"),
        label = doc.createElement("label"),
        stamp = doc.createElement("div");

    // Widget CSS Style
    widget.className = "qwidget_button";
    widget.dir = "LTR";
    widget.style.cssText += ';'.concat("position: relative; filter: inherit;");
    widget.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
    widget.style.cssText += ';'.concat("-webkit-touch-callout: none;");
    widget.style.cssText += ';'.concat("-webkit-user-select: none;");
    widget.style.cssText += ';'.concat("-khtml-user-select: none;");
    widget.style.cssText += ';'.concat("-moz-user-select: none;");
    widget.style.cssText += ';'.concat("-ms-user-select: none;");
    widget.style.cssText += ';'.concat("-user-select: none;");

    // Wrapper CSS Style
    wrap.className = "qwidget_button_wrapper";
    wrap.style.position = "absolute";
    wrap.style.filter = "inherit";

    // Append children
    imageContain.appendChild(image);
    labelContain.appendChild(label);
    background.appendChild(imageContain);
    background.appendChild(labelContain);
    wrap.appendChild(background);
    wrap.appendChild(stamp);
    widget.appendChild(wrap);
    parentEle.appendChild(widget);

    // Init core vars
    this._widget = widget;
    this._params = {};
    this._cache = {};
    this._cache.nodes = {
        wrap : wrap,
        background : background,
        imageContain : imageContain,
        image : image,
        labelContain : labelContain,
        label : label,
        stamp : stamp
    };

    // this in-turn will call the update method to finalize construction
    this.config(configObj || {});

    // enable widget by default
    this.enabled(true);

    // init widget events
    this.initEvents();
}
QBaseBtn.prototype = new QStudioBtnAbstract();
QBaseBtn.prototype.config = function(value) {
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

            // add additional widget specific params
            this._configMap.label_overlay_padding = { value: 4, type: "number", min: 0 };
            this._configMap.zoom_top = { value: 0, type: "number", min: 0 };
            this._configMap.zoom_left = { value: 0, type: "number", min: 0 };

            // set default parameters
            this.setParams(this._configMap, true);
        }

        // set custom parameters
        this.setParams(value);

        // parameter presets
        if (this._params.border_style === "none" || !this._params.show_bckgrnd) {
            this._params.border_width_up = 0;
            this._params.border_width_over = 0;
            this._params.border_width_down = 0;
            this._params.border_radius = 0;
        }

        this._params.label_font_family = this._params.primary_font_family;
        if (this._params.label_placement.indexOf("overlay") !== -1) {
            this._params.label_width = (this._params.width + this._params.padding*2 - this._params.label_overlay_padding*2);
            if (this._params.label_width <= 0) {
                this._params.label_overlay_padding = 0;
                this._params.label_width = this._params.width + this._params.padding*2;
            }
            this._params.label_padding = this._params.label_overlay_padding;
            this._params.label_trim = false;
        } else {
            this._params.label_width = (!this._params.label_ovr_width) ? this._params.width : this._params.label_width;
            this._params.label_padding = 0;
            this._params.label_trim = this._params.label_ovr_width;
        }

        // update widget
        this.update();

        // set button state
        if (this._cache._answerBool) { this.toggleMouseDown(true); }

        // check to see if widget state was previously disabled
        if ((this._cache._enableBool === false) && this._cache._enabConfigObj) {
            this.enabled(false, this._cache._enabConfigObj);
        }

        // add mouseenter event for widget tooltip
        if (!this._cache._touchEnableBool) {
            qToolTipSingleton.getInstance()[(this._params.use_tooltip) ? "addWgt" : "removeWgt"](this);
        }

        value = null;
        return this;
    }
};
QBaseBtn.prototype.update = function()  {
    if (!this._widget) { return false; }
    var params = this._params,
        cacheNodes = this._cache.nodes,
        widget = this._widget,
        isTopBotLabel = (params.label_placement === 'top' || params.label_placement === 'bottom'),
        isOverlayLabel = (params.label_placement.indexOf("overlay") !== -1),
        bckgrndWidth = 0,
        bckgrndHeight = 0,
        updateLabel = false,
        updateStamp = false,
        labContainWidth = 0,
        labContainHeight = 0,
        stampOffset = 0;

    // update background
    QStudioAssetFactory.prototype.assetUpdate.baseBckgrnd.apply(this, [cacheNodes.background, params]);

    // set overflow hidden on background
    cacheNodes.background.style.overflow = (params.show_bckgrnd) ? "hidden" : "";

    // Record background dimensions
    bckgrndWidth = $(cacheNodes.background).outerWidth();
    bckgrndHeight = $(cacheNodes.background).outerHeight();

    // update label container
    updateLabel = QStudioAssetFactory.prototype.assetUpdate.label.apply(this, [cacheNodes.labelContain, params]);
    if (updateLabel) {
        // Record labelContain dimensions
        labContainWidth = $(cacheNodes.labelContain).outerWidth();
        labContainHeight = $(cacheNodes.labelContain).outerHeight();

        // If label placement is overlay type...
        if (isOverlayLabel) {
            // append labelContain to background for overlay label placements
            cacheNodes.background.appendChild(cacheNodes.labelContain);

            var hex_rgb = QUtility.hexToRgb(params.label_bckgrnd_color),
                rgb_str = hex_rgb.r+','+hex_rgb.g+','+hex_rgb.b;

            // See about adding a label background color
            cacheNodes.labelContain.style.backgroundColor = (params.show_label_bckgrnd) ? ((QUtility.ieVersion() <= 8) ?
                '#' + params.label_bckgrnd_color : 'rgba('+rgb_str+', 0.85)') : "";

            // If label height exceeds background height...
            if (labContainHeight > (params.height + params.padding*2)) {
                labContainHeight = (params.height + params.padding*2);
                cacheNodes.labelContain.style.height = labContainHeight + "px";
                cacheNodes.label.style.height = (labContainHeight - params.label_overlay_padding*2) + "px";
                cacheNodes.label.style.overflow = "hidden";
            }
        } else {
            // append labelContain to wrap before background element
            cacheNodes.wrap.insertBefore(cacheNodes.labelContain, cacheNodes.background);
        }

        // Position label
        switch (params.label_placement) {
            // For overlay label types
            // Adjust left & top positions
            case "bottom overlay" :
                cacheNodes.labelContain.style.left = 0 + "px";
                cacheNodes.labelContain.style.top = (params.height + params.padding * 2 - labContainHeight) + "px";
                break;
            case "top overlay" :
                cacheNodes.labelContain.style.left = 0 + "px";
                cacheNodes.labelContain.style.top = 0 + "px";
                break;
            case "center overlay" :
                cacheNodes.labelContain.style.left = 0 + "px";
                cacheNodes.labelContain.style.top = (params.height + params.padding * 2 - labContainHeight) * 0.5 + "px";
                break;
            case "top" :
                cacheNodes.labelContain.style.left = (params.border_width_up + params.padding) + "px";
                cacheNodes.labelContain.style.top = 0 + "px";
                cacheNodes.background.style.top = labContainHeight + "px";
                stampOffset = labContainHeight;
                break;
            default : // case "bottom"
                cacheNodes.labelContain.style.left = (params.border_width_up + params.padding) + "px";
                cacheNodes.labelContain.style.top = bckgrndHeight + "px";
                break;
        }
    } else {
        if (cacheNodes.labelContain.parentNode && cacheNodes.labelContain.parentNode.nodeType === 1) {
            cacheNodes.labelContain.parentNode.removeChild(cacheNodes.labelContain);
        }
    }

    // Call appropriate lightbox method
    qLightBoxSingleton.getInstance()[(params.use_lightbox) ? "addWgt" : "removeWgt"](this, {
        zoom_left : params.zoom_left,
        zoom_top : params.zoom_top
    });

    // update image container
    QStudioAssetFactory.prototype.assetUpdate.image.apply(this, [cacheNodes.imageContain, {
        image: params.image,
        width: params.width,
        height: params.height,
        img_top: params.img_top,
        img_left: params.img_left,
        // callback would fire on successful load
        callback_success: function () {
            // By default, horizontally & vertically center imageContain to background
            cacheNodes.imageContain.style.top = (params.padding + (params.height - $(cacheNodes.imageContain).height()) * 0.5) + "px";
            cacheNodes.imageContain.style.left = (params.padding + (params.width - $(cacheNodes.imageContain).width()) * 0.5) + "px";

            // Append imageContain to background; make the imageContain the first child
            (cacheNodes.background.firstChild) ?
                cacheNodes.background.insertBefore(cacheNodes.imageContain, cacheNodes.background.firstChild):
                cacheNodes.background.appendChild(cacheNodes.imageContain);
        },
        // callback would fire when an error is encountered
        callback_error: function() {
            if (cacheNodes.imageContain.parentNode && cacheNodes.imageContain.parentNode.nodeType === 1) {
                cacheNodes.imageContain.parentNode.removeChild(cacheNodes.imageContain);
            }
        }
    }]);

    // update stamp
    updateStamp = QStudioAssetFactory.prototype.assetUpdate.stamp.apply(this, [cacheNodes.stamp, params]);
    if (updateStamp) {
        // horizontally & vertically center stamp to background
        cacheNodes.wrap.appendChild(cacheNodes.stamp);
        cacheNodes.stamp.style.left = ((bckgrndWidth - $(cacheNodes.stamp).outerWidth())*0.5 + params.stamp_left) + "px";
        cacheNodes.stamp.style.top = (stampOffset + (bckgrndHeight - $(cacheNodes.stamp).outerHeight())*0.5 + params.stamp_top) + "px";
    } else {
        if (cacheNodes.stamp.parentNode && cacheNodes.stamp.parentNode.nodeType === 1) {
            cacheNodes.stamp.parentNode.removeChild(cacheNodes.stamp);
        }
    }

    // Set wrapper dimensions
    cacheNodes.wrap.style.width = (Math.max(bckgrndWidth, labContainWidth)) + "px";
    cacheNodes.wrap.style.height = (bckgrndHeight + ((isTopBotLabel) ?  labContainHeight : 0)) + "px";

    // Set widget dimensions
    widget.id = params.id;
    widget.style.width = cacheNodes.wrap.style.width;
    widget.style.height = cacheNodes.wrap.style.height;
};

// Flow Button Widget
function QFlowBtn(parent, configObj) {
    // Create Button Shell
    var doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        widget = doc.createElement("div"),
        wrap = doc.createElement("div"),
        background = doc.createElement("div"),
        imageContain = doc.createElement("div"),
        image = doc.createElement("img"),
        labelContain = doc.createElement("div"),
        label = doc.createElement("label"),
        stamp = doc.createElement("div");

    // Widget CSS Style
    widget.className = "qwidget_button";
    widget.dir = "LTR";
    widget.style.cssText += ';'.concat("position: relative; filter: inherit;");
    widget.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
    widget.style.cssText += ';'.concat("-webkit-touch-callout: none;");
    widget.style.cssText += ';'.concat("-webkit-user-select: none;");
    widget.style.cssText += ';'.concat("-khtml-user-select: none;");
    widget.style.cssText += ';'.concat("-moz-user-select: none;");
    widget.style.cssText += ';'.concat("-ms-user-select: none;");
    widget.style.cssText += ';'.concat("-user-select: none;");

    // Wrapper CSS Style
    wrap.className = "qwidget_button_wrapper";
    wrap.style.position = "absolute";
    wrap.style.filter = "inherit";

    // Append children
    imageContain.appendChild(image);
    labelContain.appendChild(label);
    background.appendChild(imageContain);
    background.appendChild(labelContain);
    wrap.appendChild(background);
    wrap.appendChild(stamp);
    widget.appendChild(wrap);
    parentEle.appendChild(widget);

    // Init core vars
    this._widget = widget;
    this._params = {};
    this._cache = {};
    this._cache.nodes = {
        wrap : wrap,
        background : background,
        imageContain : imageContain,
        image : image,
        labelContain : labelContain,
        label : label,
        stamp : stamp
    };

    // this in-turn will call the update method to finalize construction
    this.config(configObj || {});

    // enable widget by default
    this.enabled(true);

    // init widget events
    this.initEvents();
}
QFlowBtn.prototype = new QStudioBtnAbstract();
QFlowBtn.prototype.config = function(value) {
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

            // add additional widget specific params
            this._configMap.zoom_top = { value: 0, type: "number", min: 0 };
            this._configMap.zoom_left = { value: 0, type: "number", min: 0 };
            this._configMap.label_trim = { value: false, type: "boolean" };
            this._configMap.image_scale = { value: 38, type: "number", min: 10 };

            // set default parameters
            this.setParams(this._configMap, true);
        }

        // set custom parameters
        this.setParams(value);

        // parameter presets
        if (this._params.border_style === "none" || !this._params.show_bckgrnd ) {
            this._params.border_width_up = 0;
            this._params.border_width_over = 0;
            this._params.border_width_down = 0;
            this._params.border_radius = 0;
        }

        this._params.imgWidth = Math.round(this._params.width * (this._params.image_scale * .01));
        this._params.label_font_family = this._params.primary_font_family;
        this._params.label_width = this._params.width - this._params.border_width_up - this._params.imgWidth;
        this._params.label_padding = this._params.padding;
        this._params.label_box_sizing = "border-box";

        // update widget
        this.update();

        // set button state
        if (this._cache._answerBool) { this.toggleMouseDown(true); }

        // check to see if widget state was previously disabled
        if ((this._cache._enableBool === false) && this._cache._enabConfigObj) {
            this.enabled(false, this._cache._enabConfigObj);
        }

        // add mouseenter event for widget tooltip
        if (!this._cache._touchEnableBool) {
            qToolTipSingleton.getInstance()[(this._params.use_tooltip) ? "addWgt" : "removeWgt"](this);
        }

        value = null;
        return this;
    }
};
QFlowBtn.prototype.update = function() {
    if (!this._widget) { return false; }
    var that = this,
        params = this._params,
        cacheNodes = this._cache.nodes,
        widget = this._widget,
        bckgrndWidth = 0,
        bckgrndHeight = 0,
        updateLabel = false,
        updateStamp = false,
        labContainHeight = 0,
        labContainWidth = 0;

    // update background
    QStudioAssetFactory.prototype.assetUpdate.baseBckgrnd.apply(this, [cacheNodes.background, {
        show_bckgrnd : params.show_bckgrnd,
        show_bckgrnd_import : params.show_bckgrnd_import,
        width : params.width,
        height : params.height,
        padding : 0,
        border_width_up : params.border_width_up,
        border_radius : params.border_radius,
        border_style : params.border_style,
        border_color_up : params.border_color_up,
        bckgrnd_color_up : params.bckgrnd_color_up,
        bckgrnd_import_up : params.bckgrnd_import_up
    }]);

    // set overflow hidden on background
    cacheNodes.background.style.overflow = (params.show_bckgrnd) ? "hidden" : "";

    // Record background dimensions
    bckgrndWidth = $(cacheNodes.background).outerWidth();
    bckgrndHeight = $(cacheNodes.background).outerHeight();

    // Call appropriate lightbox method
    qLightBoxSingleton.getInstance()[(params.use_lightbox) ? "addWgt" : "removeWgt"](this, {
        zoom_left : params.zoom_left,
        zoom_top : params.zoom_top
    });

    // update image container
    QStudioAssetFactory.prototype.assetUpdate.image.apply(this, [cacheNodes.imageContain, {
        image: params.image,
        width: ((params.imgWidth - params.padding*2) >= 0) ? params.imgWidth - params.padding*2 : params.imgWidth,
        height: ((params.height - params.padding*2) >= 0) ? params.height - params.padding*2 : params.height,
        img_left : 0, img_top : 0,
        // callback would fire on successful load
        callback_success: function () {
            // By default, horizontally & vertically center imageContain to background
            cacheNodes.image.style.left = (((params.imgWidth - $(cacheNodes.image).width()) * 0.5) + params.img_left) + "px";
            cacheNodes.image.style.top = (((params.height - $(cacheNodes.image).height()) * 0.5) + params.img_top) +  "px";
            cacheNodes.imageContain.style.width = params.imgWidth + "px";
            cacheNodes.imageContain.style.height = params.height + "px";
            if (cacheNodes.zoomBtn && (cacheNodes.zoomBtn.parentNode === cacheNodes.imageContain)) {
                cacheNodes.zoomBtn.style.left = cacheNodes.image.style.left;
                cacheNodes.zoomBtn.style.top = cacheNodes.image.style.top;
            }
        },
        // callback would fire when an error is encountered
        callback_error: function() {
            if (params.use_lightbox) { qLightBoxSingleton.getInstance().removeWgt(this); }
            cacheNodes.imageContain.style.display = "block";
            cacheNodes.imageContain.style.width = params.imgWidth + "px";
            cacheNodes.imageContain.style.height = params.height + "px";
        }
    }]);
    cacheNodes.imageContain.style.borderRight = params.border_width_up + "px " + params.border_style + " #" + params.border_color_up;

    // update label container
    updateLabel = QStudioAssetFactory.prototype.assetUpdate.label.apply(that, [cacheNodes.labelContain, params]);

    if (updateLabel) {
        // append labelContain to background
        cacheNodes.background.appendChild(cacheNodes.labelContain);

        // Record labelContain dimensions
        labContainWidth = $(cacheNodes.labelContain).outerWidth();
        labContainHeight = $(cacheNodes.labelContain).outerHeight();

        // If label height is greater than background height...
        if (labContainHeight > params.height) {
            labContainHeight = params.height;
            cacheNodes.labelContain.style.height = labContainHeight + "px";
            cacheNodes.label.style.height = labContainHeight + "px";
            cacheNodes.label.style.overflow = "hidden";
        }

        // Position label
        cacheNodes.labelContain.style.left = (params.imgWidth + params.border_width_up) + "px";
        switch (params.label_placement) {
            case "bottom" :
                cacheNodes.labelContain.style.top =  (params.height - labContainHeight) + "px";
                break;
            case "top" :
                cacheNodes.labelContain.style.top =  "";
                break;
            default :
                cacheNodes.labelContain.style.top =  (params.height - labContainHeight)*0.5 + "px";
                break;
        }
    } else {
        if (cacheNodes.labelContain.parentNode && cacheNodes.labelContain.parentNode.nodeType === 1) {
            cacheNodes.labelContain.parentNode.removeChild(cacheNodes.labelContain);
        }
    }

    // Update parameter width since label width can vary depending on trimming
    if (params.label_trim) {
        params.width = (updateLabel) ? (params.imgWidth + labContainWidth) : params.imgWidth;
        (!params.show_bckgrnd_import) ?
            cacheNodes.background.style.width = params.width + "px":
            $(cacheNodes.background).css({
                'width': params.width + "px",
                'background-size': (params.width + params.padding * 2) + 'px ' + (params.height + params.padding * 2) + 'px'
            });

        // re-record background width after adjustments
        bckgrndWidth = $(cacheNodes.background).outerWidth();
    }

    // update stamp
    updateStamp = QStudioAssetFactory.prototype.assetUpdate.stamp.apply(this, [cacheNodes.stamp, params]);
    if (updateStamp) {
        cacheNodes.wrap.appendChild(cacheNodes.stamp);
        // horizontally & vertically center stamp to background
        cacheNodes.stamp.style.left =
            ((bckgrndWidth - $(cacheNodes.stamp).outerWidth())*0.5 + params.stamp_left) + "px";
        cacheNodes.stamp.style.top =
            ((bckgrndHeight - $(cacheNodes.stamp).outerHeight())*0.5 + params.stamp_top) + "px";
    } else {
        if (cacheNodes.stamp.parentNode && cacheNodes.stamp.parentNode.nodeType === 1) {
            cacheNodes.stamp.parentNode.removeChild(cacheNodes.stamp);
        }
    }

    // Set wrapper dimensions
    cacheNodes.wrap.style.width = bckgrndWidth + "px";
    cacheNodes.wrap.style.height = bckgrndHeight + "px";

    // Set widget dimensions
    widget.id = params.id;
    widget.style.width = cacheNodes.wrap.style.width;
    widget.style.height = cacheNodes.wrap.style.height;
};

// Text Button Widget
function QTextBtn(parent, configObj) {
    // Create Button Shell
    var doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        widget = doc.createElement("div"),
        wrap = doc.createElement("div"),
        background = doc.createElement("div"),
        labelContain = doc.createElement("div"),
        label = doc.createElement("label"),
        stamp = doc.createElement("div");

    // Widget CSS Style
    widget.className = "qwidget_button";
    widget.dir = "LTR";
    widget.style.cssText += ';'.concat("position: relative; filter: inherit;");
    widget.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
    widget.style.cssText += ';'.concat("-webkit-touch-callout: none;");
    widget.style.cssText += ';'.concat("-webkit-user-select: none;");
    widget.style.cssText += ';'.concat("-khtml-user-select: none;");
    widget.style.cssText += ';'.concat("-moz-user-select: none;");
    widget.style.cssText += ';'.concat("-ms-user-select: none;");
    widget.style.cssText += ';'.concat("-user-select: none;");

    // Wrapper CSS Style
    wrap.className = "qwidget_button_wrapper";
    wrap.style.position = "absolute";
    wrap.style.filter = "inherit";

    // Append children
    labelContain.appendChild(label);
    background.appendChild(labelContain);
    wrap.appendChild(background);
    wrap.appendChild(stamp);
    widget.appendChild(wrap);
    parentEle.appendChild(widget);

    // Init core vars
    this._widget = widget;
    this._params = {};
    this._cache = {};
    this._cache.nodes = {
        wrap : wrap,
        background : background,
        labelContain : labelContain,
        label : label,
        stamp : stamp
    };

    // this in-turn will call the update method to finalize construction
    this.config(configObj || {});

    // enable widget by default
    this.enabled(true);

    // init widget events
    this.initEvents();
}
QTextBtn.prototype = new QStudioBtnAbstract();
QTextBtn.prototype.config = function(value) {
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

            // add additional widget specific params
            this._configMap.txtbtn_trim = { value: false, type: "boolean" };

            // set default parameters
            this.setParams(this._configMap, true);
        }

        // set custom parameters
        this.setParams(value);

        // parameter presets
        if (this._params.border_style === "none" || !this._params.show_bckgrnd ) {
            this._params.border_width_up = 0;
            this._params.border_width_over = 0;
            this._params.border_width_down = 0;
            this._params.border_radius = 0;
        }

        this._params.show_label = true;
        this._params.label_font_family = this._params.primary_font_family;
        this._params.label_width = this._params.width;
        this._params.label_padding = 0;
        this._params.label_trim = false;

        // update widget
        this.update();

        // set button state
        if (this._cache._answerBool) {
            this.toggleMouseDown(true);
        }

        // check to see if widget state was previously disabled
        if ((this._cache._enableBool === false) && this._cache._enabConfigObj) {
            this.enabled(false, this._cache._enabConfigObj);
        }

        // add mouseenter event for widget tooltip
        if (!this._cache._touchEnableBool) {
            qToolTipSingleton.getInstance()[(this._params.use_tooltip) ? "addWgt" : "removeWgt"](this);
        }

        value = null;
        return this;
    }
};
QTextBtn.prototype.update = function() {
    if (!this._widget) { return false; }
    var params = this._params,
        cacheNodes = this._cache.nodes,
        widget = this._widget,
        updateLabel = false,
        updateStamp = false,
        bckgrndWidth = 0,
        bckgrndHeight = 0,
        labContainHeight = 0;

    // update background
    QStudioAssetFactory.prototype.assetUpdate.baseBckgrnd.apply(this, [cacheNodes.background, params]);

    // set overflow hidden on background
    cacheNodes.background.style.overflow = (params.show_bckgrnd) ? "hidden" : "";

    // Record background dimensions
    bckgrndWidth = $(cacheNodes.background).outerWidth();
    bckgrndHeight = $(cacheNodes.background).outerHeight();

    // update label container
    updateLabel = QStudioAssetFactory.prototype.assetUpdate.label.apply(this, [cacheNodes.labelContain, params]);
    if (updateLabel) {
        // append labelContain to background
        cacheNodes.background.appendChild(cacheNodes.labelContain);

        // Record labelContain dimensions
        labContainHeight = $(cacheNodes.labelContain).outerHeight();

        if (!params.txtbtn_trim) {
            // If label height exceeds background height...
            if (labContainHeight > params.height) {
                labContainHeight = params.height;
                cacheNodes.labelContain.style.height = labContainHeight + "px";
                cacheNodes.label.style.height = labContainHeight + "px";
                cacheNodes.label.style.overflow = "hidden";
            }

            // Vertically center label to background by default
            cacheNodes.labelContain.style.top = (params.height + params.padding*2 - labContainHeight)*0.5 + "px";
        }

        // if txtbtn_trim is true, set background height to match label height
        else {
            cacheNodes.labelContain.style.top = "";
        }
    } else {
        if (cacheNodes.labelContain.parentNode && cacheNodes.labelContain.parentNode.nodeType === 1) {
            cacheNodes.labelContain.parentNode.removeChild(cacheNodes.labelContain);
        }
    }

    // update background/param height if txtbtn_trim is true
    if (params.txtbtn_trim) {
        params.height = labContainHeight;
        (!params.show_bckgrnd_import) ?
            cacheNodes.background.style.height = labContainHeight + "px":
            $(cacheNodes.background).css({
                'height': labContainHeight + "px",
                'background-size': (params.width + params.padding * 2) + 'px ' + (labContainHeight + params.padding * 2) + 'px'
            });

        // re-record background height after adjustments
        bckgrndHeight = $(cacheNodes.background).outerHeight();
    }

    // update stamp
    updateStamp = QStudioAssetFactory.prototype.assetUpdate.stamp.apply(this, [cacheNodes.stamp, params]);
    if (updateStamp) {
        cacheNodes.wrap.appendChild(cacheNodes.stamp);
        // horizontally & vertically center stamp to background
        cacheNodes.stamp.style.left =
            ((bckgrndWidth - $(cacheNodes.stamp).outerWidth())*0.5 + params.stamp_left) + "px";
        cacheNodes.stamp.style.top =
            ((bckgrndHeight - $(cacheNodes.stamp).outerHeight())*0.5 + params.stamp_top) + "px";
    } else {
        if (cacheNodes.stamp.parentNode && cacheNodes.stamp.parentNode.nodeType === 1) {
            cacheNodes.stamp.parentNode.removeChild(cacheNodes.stamp);
        }
    }

    // Set wrapper dimensions
    cacheNodes.wrap.style.width = bckgrndWidth + "px";
    cacheNodes.wrap.style.height = bckgrndHeight + "px";

    // Set widget dimensions
    widget.id = params.id;
    widget.style.width = cacheNodes.wrap.style.width;
    widget.style.height = cacheNodes.wrap.style.height;
};

// RadioCheck Button Widget
function QRadioCheckBtn(parent, configObj) {
    // Create Button Shell
    var doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        widget = doc.createElement("div"),
        wrap = doc.createElement("div"),
        background = doc.createElement("div"),
        labelContain = doc.createElement("div"),
        label = doc.createElement("label");

    // Widget CSS Style
    widget.className = "qwidget_button";
    widget.dir = "LTR";
    widget.style.cssText += ';'.concat("position: relative; filter: inherit;");
    widget.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
    widget.style.cssText += ';'.concat("-webkit-touch-callout: none;");
    widget.style.cssText += ';'.concat("-webkit-user-select: none;");
    widget.style.cssText += ';'.concat("-khtml-user-select: none;");
    widget.style.cssText += ';'.concat("-moz-user-select: none;");
    widget.style.cssText += ';'.concat("-ms-user-select: none;");
    widget.style.cssText += ';'.concat("-user-select: none;");

    // Wrapper CSS Style
    wrap.className = "qwidget_button_wrapper";
    wrap.style.position = "absolute";
    wrap.style.filter = "inherit";

    // Append children
    labelContain.appendChild(label);
    wrap.appendChild(background);
    wrap.appendChild(labelContain);
    widget.appendChild(wrap);
    parentEle.appendChild(widget);

    // Init core vars
    this._widget = widget;
    this._params = {};
    this._cache = {};
    this._cache.nodes = {
        wrap : wrap,
        background : background,
        labelContain : labelContain,
        label : label
    };

    // this will in-turn call the update method to finalize construction
    this.config(configObj || {});

    // enable widget by default
    this.enabled(true);

    // init widget events
    this.initEvents();
}
QRadioCheckBtn.prototype = new QStudioBtnAbstract();
QRadioCheckBtn.prototype.config = function(value) {
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

            // add additional widget specific params
            this._configMap.radchkbtn_rad_url = { value: "", type: "string" };
            this._configMap.radchkbtn_chk_url = { value: "", type: "string" };
            this._configMap.radchkbtn_rad_width = { value: 30, type: "number", min: 1 };
            this._configMap.radchkbtn_rad_height = { value: 30, type: "number", min: 1 };
            this._configMap.radchkbtn_chk_width = { value: 30, type: "number", min: 1 };
            this._configMap.radchkbtn_chk_height = { value: 30, type: "number", min: 1 };
            this._configMap.radchkbtn_label_trim = { value: false, type: "boolean" };
            this._configMap.radchkbtn_label_width = { value: 100, type: "number", min: 1 };
            this._configMap.radchkbtn_label_left = { value: 0, type: "number" };
            this._configMap.radchkbtn_label_top = { value: 0, type: "number" };
            this._configMap.radchkbtn_label_fontsize = { value: 16, type: "number", min: 5 };
            this._configMap.radchkbtn_label_fontcolor_up = { value: 0x000000, type: "color" };
            this._configMap.radchkbtn_label_fontcolor_over = { value: 0x000000, type: "color" };
            this._configMap.radchkbtn_label_fontcolor_down = { value: 0x000000, type: "color" };
            this._configMap.radchkbtn_label_halign = { value: 'left', type: "string", options:['left', 'right', 'center'] };

            // set default parameters
            this.setParams(this._configMap, true);
        }

        // set custom parameters
        this.setParams(value);

        // parameter presets
        this._params.bckgrnd_import_up = (this._params.isRadio) ? this._params.radchkbtn_rad_url : this._params.radchkbtn_chk_url;
        this._params.width = (this._params.isRadio) ? this._params.radchkbtn_rad_width : this._params.radchkbtn_chk_width;
        this._params.height = (this._params.isRadio) ? this._params.radchkbtn_rad_height : this._params.radchkbtn_chk_height;
        this._params.label_font_family = this._params.primary_font_family;
        this._params.label_trim = this._params.radchkbtn_label_trim;
        this._params.label_width = this._params.radchkbtn_label_width;
        this._params.label_left = this._params.radchkbtn_label_left;
        this._params.label_top = this._params.radchkbtn_label_top;
        this._params.label_fontsize = this._params.radchkbtn_label_fontsize;
        this._params.label_fontcolor_up = this._params.radchkbtn_label_fontcolor_up;
        this._params.label_fontcolor_over = this._params.radchkbtn_label_fontcolor_over;
        this._params.label_fontcolor_down = this._params.radchkbtn_label_fontcolor_down;
        this._params.label_halign = this._params.radchkbtn_label_halign;
        this._params.label_padding = 0;
        this._params.show_label = true;

        // update widget
        this.update();

        // set button state
        if (this._cache._answerBool) { this.toggleMouseDown(true); }

        // check to see if widget state was previously disabled
        if ((this._cache._enableBool === false) && this._cache._enabConfigObj) {
            this.enabled(false, this._cache._enabConfigObj);
        }

        // add mouseenter event for widget tooltip
        if (!this._cache._touchEnableBool) {
            qToolTipSingleton.getInstance()[(this._params.use_tooltip) ? "addWgt" : "removeWgt"](this);
        }

        value = null;
        return this;
    }
};
QRadioCheckBtn.prototype.update = function() {
    if (!this._widget) { return false; }
    var that = this,
        params = this._params,
        cacheNodes = this._cache.nodes,
        widget = this._widget,
        bckgrndWidth = 0,
        bckgrndHeight = 0,
        updateLabel = false,
        offset = 0,
        labContainWidth = 0,
        labContainHeight = 0;

    // update background
    QStudioAssetFactory.prototype.assetUpdate.radioBckgrnd.apply(this, [cacheNodes.background, params]);
    if (cacheNodes.background.firstChild) {
        cacheNodes.formBtn = cacheNodes.background.firstChild;
        cacheNodes.formBtn.onclick = function(){
            this.checked = that.isAnswered();
        };
    }

    // Record background dimensions
    bckgrndWidth = $(cacheNodes.background).outerWidth();
    bckgrndHeight = $(cacheNodes.background).outerHeight();

    // update label
    updateLabel = QStudioAssetFactory.prototype.assetUpdate.label.apply(this, [cacheNodes.labelContain, params]);
    if (updateLabel) {
        cacheNodes.wrap.appendChild(cacheNodes.labelContain);

        // Record labelContain dimensions
        labContainWidth = $(cacheNodes.labelContain).outerWidth();
        labContainHeight = $(cacheNodes.labelContain).outerHeight();
        offset = 4; // hard coded

        // RTL adjustments
        (params.isRTL) ?
            cacheNodes.background.style.left = (labContainWidth + offset) + "px":
            cacheNodes.labelContain.style.left = (bckgrndWidth + offset) + "px";
    } else {
        if (cacheNodes.labelContain.parentNode && cacheNodes.labelContain.parentNode.nodeType === 1) {
            cacheNodes.labelContain.parentNode.removeChild(cacheNodes.labelContain);
        }
    }

    // Set wrapper dimensions
    cacheNodes.wrap.style.width = (bckgrndWidth + labContainWidth + offset) + "px";
    cacheNodes.wrap.style.height = Math.max(bckgrndHeight, labContainHeight) + "px";

    // Set widget dimensions
    widget.id = params.id;
    widget.style.width = cacheNodes.wrap.style.width;
    widget.style.height = cacheNodes.wrap.style.height;
};
QRadioCheckBtn.prototype.toggleMouseEnter = function(value) {
    if (!this._widget ||
        this.isDrag() ||
        this._cache._isDown ||
        !(this._cache._enableBool && (!this._cache._answerBool || this._cache._ratingBool))) { return null; }

    var cacheNodes = this._cache.nodes,
        updateLabel = (cacheNodes.labelContain && cacheNodes.labelContain.parentNode && cacheNodes.labelContain.parentNode.nodeType === 1),
        fontcolor = (value) ? this._params.label_fontcolor_over : this._params.label_fontcolor_up;

    // Background settings
    if (!cacheNodes.formBtn) {
        cacheNodes.background.style.backgroundPosition = (value) ? '0% 50%' : '50% 50%';
    }

    // Label CSS settings
    if (updateLabel) { cacheNodes.label.style.color = '#' + fontcolor; }

    // Widget bounce animation
    if (this._params.mouseover_bounce) {
        if (value) {
            $(cacheNodes.wrap).animate({"top" : "2px" }, 170, function() {
                $(this).animate({"top" : "" }, 200);
            });
        } else {
            $(cacheNodes.wrap).stop();
            cacheNodes.wrap.style.top = "";
        }
    }
};
QRadioCheckBtn.prototype.toggleMouseDown = function(value) {
    if (!this._widget) { return null; }
    this._cache._isDown = value;        // Set isDown boolean
    var cacheNodes = this._cache.nodes,
        updateLabel = (cacheNodes.labelContain && cacheNodes.labelContain.parentNode && cacheNodes.labelContain.parentNode.nodeType === 1),
        fontcolor = (value) ? this._params.label_fontcolor_down : this._params.label_fontcolor_up,
        alpha_val = (value) ? this._params.mousedown_alpha * .01 : 1;

    // Background settings
    if (!cacheNodes.formBtn) {
        cacheNodes.background.style.backgroundPosition = (value) ? '100% 50%' : '50% 50%';
    } else {
        cacheNodes.formBtn.checked = value;
    }

    // Label CSS settings
    if (updateLabel) { cacheNodes.label.style.color = '#' + fontcolor; }

    // Button opacity animation
    if (!this._params.reverse_scale && this._cache._enableBool) {
        if (!(QUtility.ieVersion() === 8)) {
            $(cacheNodes.wrap).css({ "opacity" : (alpha_val < 1) ? alpha_val : "" });
        } else {
            for (var key in cacheNodes) {
                if (cacheNodes.hasOwnProperty(key) && cacheNodes[key] && key !== 'wrap' && key !== 'stamp') {
                    $(cacheNodes[key]).css({ "opacity" : (alpha_val < 1) ? alpha_val : "" });
                }
            }
        }
    }
};
QRadioCheckBtn.prototype.reverseAnim = function(value) {
    if (!this._widget || !this._params.reverse_scale) { return null; }
    var cacheNodes = this._cache.nodes,
        scale_val = (value) ? this._params.mousedown_scale * .01 : 1,
        alpha_val = (value) ? this._params.mousedown_alpha * .01 : 1;

    // cache whether animation has been reversed
    this._cache._isAnimReversed = value;

    // wrap scale animation
    if (value) { cacheNodes.wrap.style.zIndex = "auto"; }
    $(cacheNodes.wrap).css({
        'transform' : (scale_val !== 1) ? 'scale(' + scale_val + ',' + scale_val + ')' : "",
        'transform-origin' : (scale_val !== 1) ? "top" : ""
    });

    // Set opacity on all elements except stamp
    if (!(QUtility.ieVersion() === 8)) {
        for (var child = cacheNodes.wrap.firstChild; child; child = child.nextSibling) {
            if (child !== cacheNodes.stamp) {
                $(child).css({ "opacity" : (alpha_val < 1) ? alpha_val : "" });
            }
        }
    } else {
        for (var key in cacheNodes) {
            if (cacheNodes.hasOwnProperty(key) && cacheNodes[key] && key !== 'wrap' && key !== 'stamp') {
                $(cacheNodes[key]).css({ "opacity" : (alpha_val < 1) ? alpha_val : "" });
            }
        }
    }
};

// Base Input Button Widget
function QBaseInputBtn(parent, configObj) {
    // Create Button Shell
    var doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        widget = doc.createElement("div"),
        wrap = doc.createElement("div"),
        background = doc.createElement("div"),
        textarea = doc.createElement("textarea"),
        labelContain = doc.createElement("div"),
        label = doc.createElement("label"),
        stamp = doc.createElement("div");

    // Widget CSS Style
    widget.className = "qwidget_button";
    widget.dir = "LTR";
    widget.style.cssText += ';'.concat("position: relative; filter: inherit;");
    widget.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
    widget.style.cssText += ';'.concat("-webkit-touch-callout: none;");
    widget.style.cssText += ';'.concat("-webkit-user-select: none;");
    widget.style.cssText += ';'.concat("-khtml-user-select: none;");
    widget.style.cssText += ';'.concat("-moz-user-select: none;");
    widget.style.cssText += ';'.concat("-ms-user-select: none;");
    widget.style.cssText += ';'.concat("-user-select: none;");

    // Wrapper CSS Style
    wrap.className = "qwidget_button_wrapper";
    wrap.style.position = "absolute";
    wrap.style.filter = "inherit";

    // Append children
    labelContain.appendChild(label);
    background.appendChild(textarea);
    wrap.appendChild(labelContain);
    wrap.appendChild(background);
    wrap.appendChild(stamp);
    widget.appendChild(wrap);
    parentEle.appendChild(widget);

    // Init core vars
    this._widget = widget;
    this._params = {};
    this._cache = {};
    this._cache.nodes = {
        wrap : wrap,
        background : background,
        textarea : textarea,
        labelContain : labelContain,
        label : label,
        stamp : stamp
    };

    // this will in-turn call the update method to finalize construction
    this.config(configObj || {});

    // enable widget by default
    this.enabled(true);

    // init widget events
    this.initEvents();
}
QBaseInputBtn.prototype = new QStudioInputBtnAbstract();
QBaseInputBtn.prototype.config = function(value) {
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
            this.setParams(this._configMap, true);
        }

        // set custom parameters
        this.setParams(value);

        // parameter presets
        if (this._params.border_style === "none" || !this._params.show_bckgrnd ) {
            this._params.border_width_up = 0;
            this._params.border_width_over = 0;
            this._params.border_width_down = 0;
            this._params.border_radius = 0;
        }

        var minRegExp = /\bmin\b/ig,
            maxRegExp = /\bmax\b/ig,
            inputOffset = 15,
            curTextAreaVal = this.textarea();

        if (inputOffset > this._params.width || inputOffset > this._params.height) { inputOffset = 0; }
        this._params.label_font_family = this._params.primary_font_family;
        this._params.label_width = (!this._params.label_ovr_width) ? this._params.width : this._params.label_width;
        this._params.label_padding = 0;
        this._params.label_trim = this._params.label_ovr_width;
        this._params.show_label = this._params.other_show_label;
        this._params.textarea_width = this._params.width - inputOffset;
        this._params.textarea_height = this._params.height - inputOffset;
        this._params.textarea_font_family = this._params.secondary_font_family;

        // Replace the words 'min' and 'max' in the range message w/ the actual values
        if (QUtility.isNumber(this._params.other_min)) {
            this._params.other_msg_range = this._params.other_msg_range.replace(minRegExp, this._params.other_min);
        }

        if (QUtility.isNumber(this._params.other_min)) {
            this._params.other_msg_range = this._params.other_msg_range.replace(maxRegExp, this._params.other_max);
        }

        // update widget
        this.update();

        // set button state
        if (this._cache._answerBool) {
            this.toggleMouseDown(true);
            this.textarea(curTextAreaVal);
        }

        // check to see if widget state was previously disabled
        if ((this._cache._enableBool === false) && this._cache._enabConfigObj) {
            this.enabled(false, this._cache._enabConfigObj);
        }

        // add mouseenter event for widget tooltip
        if (!this._cache._touchEnableBool) {
            qToolTipSingleton.getInstance()[(this._params.use_tooltip) ? "addWgt" : "removeWgt"](this);
        }

        value = null;
        return this;
    }
};
QBaseInputBtn.prototype.update = function() {
    if (!this._widget) { return false; }
    var params = this._params,
        cacheNodes = this._cache.nodes,
        widget = this._widget,
        bckgrndWidth = 0,
        bckgrndHeight = 0,
        updateLabel = false,
        updateStamp = false,
        labContainHeight = 0,
        labContainWidth = 0,
        stampOffset = 0;

    // update background
    QStudioAssetFactory.prototype.assetUpdate.baseBckgrnd.apply(this, [cacheNodes.background, params]);

    // Record background dimensions
    bckgrndWidth = $(cacheNodes.background).outerWidth();
    bckgrndHeight = $(cacheNodes.background).outerHeight();

    // update textarea
    QStudioAssetFactory.prototype.assetUpdate.textarea.apply(this,  [cacheNodes.textarea, params]);

    // Horizontally and vertically center textarea to background
    cacheNodes.textarea.style.left = (params.width + params.padding*2 - $(cacheNodes.textarea).outerWidth())*0.5 + "px";
    cacheNodes.textarea.style.top = (params.height + params.padding*2 - $(cacheNodes.textarea).outerHeight())*0.5 + "px";

    // update label
    updateLabel = QStudioAssetFactory.prototype.assetUpdate.label.apply(this,  [cacheNodes.labelContain, params]);
    if (updateLabel) {
        cacheNodes.wrap.insertBefore(cacheNodes.labelContain, cacheNodes.background);

        // Record labelContain dimensions
        labContainWidth = $(cacheNodes.labelContain).outerWidth();
        labContainHeight = $(cacheNodes.labelContain).outerHeight();

        // Position label
        cacheNodes.labelContain.style.left = (params.border_width_up + params.padding) + "px";
        switch (params.label_placement) {
            case "top" :
                cacheNodes.labelContain.style.top = 0 + "px";
                cacheNodes.background.style.top = labContainHeight + "px";
                stampOffset = labContainHeight;
                break;
            default : // case "bottom"
                cacheNodes.labelContain.style.top = bckgrndHeight + "px";
                break;
        }
    } else {
        if (cacheNodes.labelContain.parentNode && cacheNodes.labelContain.parentNode.nodeType === 1) {
            cacheNodes.labelContain.parentNode.removeChild(cacheNodes.labelContain);
        }
    }

    // update stamp
    updateStamp = QStudioAssetFactory.prototype.assetUpdate.stamp.apply(this, [cacheNodes.stamp, params]);
    if (updateStamp) {
        cacheNodes.wrap.appendChild(cacheNodes.stamp);
        // horizontally & vertically center stamp to background
        cacheNodes.stamp.style.left =
            ((bckgrndWidth - $(cacheNodes.stamp).outerWidth())*0.5 + params.stamp_left) + "px";
        cacheNodes.stamp.style.top =
            (stampOffset + (bckgrndHeight - $(cacheNodes.stamp).outerHeight())*0.5 + params.stamp_top) + "px";
    } else {
        if (cacheNodes.stamp.parentNode && cacheNodes.stamp.parentNode.nodeType === 1) {
            cacheNodes.stamp.parentNode.removeChild(cacheNodes.stamp);
        }
    }

    // Set wrapper dimensions
    cacheNodes.wrap.style.width = (Math.max(bckgrndWidth, labContainWidth)) + "px";
    cacheNodes.wrap.style.height = (bckgrndHeight + labContainHeight) + "px";

    // Set widget dimensions
    widget.id = params.id;
    widget.style.width = cacheNodes.wrap.style.width;
    widget.style.height = cacheNodes.wrap.style.height;
};
QBaseInputBtn.prototype.preSelect = function(value) {
    // Widget select zIndex is 1999
    if (!this._widget) { return null; }
    this._cache._isDown = value;        // Set isDown boolean
    var params = this._params,
        cacheNodes = this._cache.nodes,
        updateLabel = (cacheNodes.labelContain && cacheNodes.labelContain.parentNode && cacheNodes.labelContain.parentNode.nodeType === 1),
        updateImage = (cacheNodes.imageContain && cacheNodes.imageContain.parentNode && cacheNodes.imageContain.parentNode.nodeType === 1),
        border_offset = this._params.border_width_down - this._params.border_width_up,
        border_color = (value) ? this._params.border_color_down : this._params.border_color_up,
        border_width = (value) ? this._params.border_width_down : this._params.border_width_up,
        bckgrnd_color = (value) ? this._params.bckgrnd_color_down : this._params.bckgrnd_color_up,
        bckgrnd_import = (value) ? this._params.bckgrnd_import_down : this._params.bckgrnd_import_up,
        fontcolor = (value) ? this._params.label_fontcolor_down : this._params.label_fontcolor_up;

    // update background
    if (this._params.show_bckgrnd) {
        cacheNodes.background.style.borderColor = '#' + border_color;
        cacheNodes.background.style.borderWidth = border_width + "px";
        if (!this._params.show_bckgrnd_import) {
            cacheNodes.background.style.backgroundColor = '#' + bckgrnd_color;
        } else {
            cacheNodes.background.style.backgroundImage = (QUtility.ieVersion() < 9) ?
            "url(" + "" + ") " + "url(" + bckgrnd_import + ")" : "url(" + bckgrnd_import + ")";
            cacheNodes.background.style.filter = "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+bckgrnd_import+", sizingMethod='scale')";
        }

        // background shadow
        if (this._params.mouseover_shadow) {
            cacheNodes.background.style.MozBoxShadow =
                cacheNodes.background.style.webkitBoxShadow =
                    cacheNodes.background.style.boxShadow = (value) ? '1px 1px 5px #888' : '';
        }
    }

    // update label
    if (updateLabel) {
        cacheNodes.label.style.color = '#' + fontcolor;
        // this currently applies to base widget types w/ top or bottom label placements
        if (cacheNodes.labelContain.parentNode === cacheNodes.wrap) {
            cacheNodes.labelContain.style.marginLeft = (value && (border_offset !== 0)) ? (border_offset + params.label_left) + "px" : params.label_left + "px";
            if (this._params.label_placement === "bottom") {
                cacheNodes.labelContain.style.marginTop =
                    (value && (border_offset !== 0)) ? (((border_offset >= 0) ? border_offset : border_offset*2) + params.label_top) + "px" : params.label_top + "px";
            } else if (this._params.label_placement === "top") {
                cacheNodes.labelContain.style.marginTop =
                    (value && (border_offset !== 0)) ? (((border_offset >= 0) ? border_offset : 0) + params.label_top) + "px" : params.label_top + "px";
            }
        }
    }

    // update image
    if (updateImage) { cacheNodes.imageContain.style.borderColor = '#' + border_color; }

    // update wrap
    cacheNodes.wrap.style.marginLeft = (value && (border_offset !== 0)) ? -border_offset + "px" : "";
    cacheNodes.wrap.style.marginTop = (value && (border_offset !== 0)) ? -border_offset + "px" : "";
    cacheNodes.wrap.style.zIndex = (value) ? 1999 : 'auto';

    // give textarea focus/blur
    cacheNodes.textarea[(value) ? 'focus' : 'blur']();
};

// Kantar Input Button Widget
function QKantarInputBtn(parent, configObj) {
    // Create Button Shell
    var doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        widget = doc.createElement("div"),
        wrap = doc.createElement("div"),
        background = doc.createElement("div"),
        labelContain = doc.createElement("div"),
        label = doc.createElement("label"),
        textarea = doc.createElement("textarea");

    // Widget CSS Style
    widget.className = "qwidget_button";
    widget.dir = "LTR";
    widget.style.cssText += ';'.concat("position: relative; filter: inherit;");
    widget.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
    widget.style.cssText += ';'.concat("-webkit-touch-callout: none;");
    widget.style.cssText += ';'.concat("-webkit-user-select: none;");
    widget.style.cssText += ';'.concat("-khtml-user-select: none;");
    widget.style.cssText += ';'.concat("-moz-user-select: none;");
    widget.style.cssText += ';'.concat("-ms-user-select: none;");
    widget.style.cssText += ';'.concat("-user-select: none;");

    // Wrapper CSS Style
    wrap.className = "qwidget_button_wrapper";
    wrap.style.position = "absolute";
    wrap.style.filter = "inherit";

    // Append children
    labelContain.appendChild(label);
    wrap.appendChild(background);
    wrap.appendChild(labelContain);
    wrap.appendChild(textarea);
    widget.appendChild(wrap);
    parentEle.appendChild(widget);

    // Init core vars
    this._params = {};
    this._cache = {};
    this._widget = widget;
    this._cache.nodes = {
        wrap : wrap,
        background : background,
        labelContain : labelContain,
        label : label,
        textarea : textarea
    };

    // call config which in-turn will call update to finalize construction
    this.config(configObj || {});   // This will trigger update method to be called

    // enable widget by default
    this.enabled(true);

    // init widget events
    this.initEvents();
}
QKantarInputBtn.prototype = new QStudioInputBtnAbstract();
QKantarInputBtn.prototype.config = function(value) {
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

            // add additional widget specific params
            this._configMap.kntrinputbtn_rad_url = { value: "", type: "string" };
            this._configMap.kntrinputbtn_chk_url = { value: "", type: "string" };
            this._configMap.kntrinputbtn_rad_width = { value: 30, type: "number", min: 1 };
            this._configMap.kntrinputbtn_rad_height = { value: 30, type: "number", min: 1 };
            this._configMap.kntrinputbtn_chk_width = { value: 30, type: "number", min: 1 };
            this._configMap.kntrinputbtn_chk_height = { value: 30, type: "number", min: 1 };
            this._configMap.kntrinputbtn_input_width = { value: 100, type: "number", min: 1 };
            this._configMap.kntrinputbtn_label_width = { value: 100, type: "number", min: 1 };
            this._configMap.kntrinputbtn_label_left = { value: 0, type: "number" };
            this._configMap.kntrinputbtn_label_top = { value: 0, type: "number" };
            this._configMap.kntrinputbtn_label_fontsize = { value: 16, type: "number", min: 5 };
            this._configMap.kntrinputbtn_label_fontcolor_up = { value: 0x000000, type: "color" };
            this._configMap.kntrinputbtn_label_fontcolor_over = { value: 0x000000, type: "color" };
            this._configMap.kntrinputbtn_label_fontcolor_down = { value: 0x000000, type: "color" };
            this._configMap.kntrinputbtn_label_halign = { value: 'left', type: "string", options:['left', 'right', 'center'] };

            // set default parameters
            this.setParams(this._configMap, true);
        }

        // set custom parameters
        this.setParams(value);

        // parameter presets
        this._params.bckgrnd_import_up = (this._params.isRadio) ? this._params.kntrinputbtn_rad_url : this._params.kntrinputbtn_chk_url;
        this._params.width = (this._params.isRadio) ? this._params.kntrinputbtn_rad_width : this._params.kntrinputbtn_chk_width;
        this._params.height = (this._params.isRadio) ? this._params.kntrinputbtn_rad_height : this._params.kntrinputbtn_chk_height;
        this._params.textarea_font_family = this._params.secondary_font_family;
        this._params.textarea_width = this._params.kntrinputbtn_input_width;
        this._params.textarea_height = this._params.height;
        this._params.label_font_family = this._params.primary_font_family;
        this._params.label_trim = true;
        this._params.label_width = this._params.kntrinputbtn_label_width;
        this._params.label_left = this._params.kntrinputbtn_label_left;
        this._params.label_top = this._params.kntrinputbtn_label_top;
        this._params.label_fontsize = this._params.kntrinputbtn_label_fontsize;
        this._params.label_fontcolor_up = this._params.kntrinputbtn_label_fontcolor_up;
        this._params.label_fontcolor_over = this._params.kntrinputbtn_label_fontcolor_over;
        this._params.label_fontcolor_down = this._params.kntrinputbtn_label_fontcolor_down;
        this._params.label_halign = this._params.kntrinputbtn_label_halign;
        this._params.label_padding = 0;
        this._params.show_label = true;

        var minRegExp = /\bmin\b/ig,
            maxRegExp = /\bmax\b/ig,
            curTextAreaVal = this.textarea();

        // Replace the words 'min' and 'max' in the range message w/ the actual values
        if (QUtility.isNumber(this._params.other_min)) {
            this._params.other_msg_range = this._params.other_msg_range.replace(minRegExp, this._params.other_min);
        }

        if (QUtility.isNumber(this._params.other_min)) {
            this._params.other_msg_range = this._params.other_msg_range.replace(maxRegExp, this._params.other_max);
        }

        // update widget
        this.update();

        // set button state
        if (this._cache._answerBool) {
            this.toggleMouseDown(true);
            this.textarea(curTextAreaVal);
        }

        // check to see if widget state was previously disabled
        if ((this._cache._enableBool === false) && this._cache._enabConfigObj) {
            this.enabled(false, this._cache._enabConfigObj);
        }

        // add mouseenter event for widget tooltip
        if (!this._cache._touchEnableBool) {
            qToolTipSingleton.getInstance()[(this._params.use_tooltip) ? "addWgt" : "removeWgt"](this);
        }

        value = null;
        return this;
    }
};
QKantarInputBtn.prototype.update = function() {
    if (!this._widget) { return false; }
    var that = this,
        params = this._params,
        cacheNodes = this._cache.nodes,
        widget = this._widget,
        bckgrndWidth = 0,
        bckgrndHeight = 0,
        offset = 4, // hard coded
        updateLabel = false,
        labContainWidth = 0,
        labContainHeight = 0,
        inputWidth = 0,
        inputHeight = 0;

    // update background
    QStudioAssetFactory.prototype.assetUpdate.radioBckgrnd.apply(this, [cacheNodes.background, params]);
    if (cacheNodes.background.firstChild) {
        cacheNodes.formBtn = cacheNodes.background.firstChild;
        cacheNodes.formBtn.onclick = function(event){
            event.preventDefault();
            //this.checked = that.isAnswered();
        };
    }

    // Record background dimensions
    bckgrndWidth = $(cacheNodes.background).outerWidth();
    bckgrndHeight = $(cacheNodes.background).outerHeight();

    // update label
    updateLabel = QStudioAssetFactory.prototype.assetUpdate.label.apply(this, [cacheNodes.labelContain, params]);
    if (updateLabel) {
        cacheNodes.wrap.appendChild(cacheNodes.labelContain);

        // Record labelContain dimensions
        labContainWidth = $(cacheNodes.labelContain).outerWidth();
        labContainHeight = $(cacheNodes.labelContain).outerHeight();
    } else {
        if (cacheNodes.labelContain.parentNode && cacheNodes.labelContain.parentNode.nodeType === 1) {
            cacheNodes.labelContain.parentNode.removeChild(cacheNodes.labelContain);
        }
    }

    // set textarea params & update textarea
    QStudioAssetFactory.prototype.assetUpdate.textarea.apply(this, [cacheNodes.textarea, params]);

    // Record textarea dimensions
    inputWidth = $(cacheNodes.textarea).outerWidth();
    inputHeight = $(cacheNodes.textarea).outerHeight();

    // RTL adjustments for textarea & label
    if (params.isRTL) {
        cacheNodes.background.style.left = (inputWidth + labContainWidth + ((updateLabel) ? offset*2 : offset)) + "px";
        if (updateLabel) { cacheNodes.labelContain.style.left = (inputWidth + offset) + "px"; }
        cacheNodes.textarea.style.left = "";
    } else {
        if (updateLabel) { cacheNodes.labelContain.style.left = (bckgrndWidth + offset) + "px"; }
        cacheNodes.textarea.style.left = (bckgrndWidth + labContainWidth + ((updateLabel) ? offset*2 : offset)) + "px";
    }

    // Set wrapper dimensions
    cacheNodes.wrap.style.width = (bckgrndWidth + labContainWidth + inputWidth + ((updateLabel) ? offset*2 : offset)) + "px";
    cacheNodes.wrap.style.height = Math.max(bckgrndHeight, labContainHeight, inputHeight) + "px";
    cacheNodes.wrap.style.visibility = "";

    // Set widget dimensions
    widget.id = params.id;
    widget.style.width = cacheNodes.wrap.style.width;
    widget.style.height = cacheNodes.wrap.style.height;
};
QKantarInputBtn.prototype.toggleMouseEnter = function(value) {
    return QRadioCheckBtn.prototype.toggleMouseEnter.call(this, value);
};
QKantarInputBtn.prototype.toggleMouseDown = function(value) {
    return QRadioCheckBtn.prototype.toggleMouseDown.call(this, value);
};
QKantarInputBtn.prototype.reverseAnim = function(value) {
    return QRadioCheckBtn.prototype.reverseAnim.call(this, value);
};
QKantarInputBtn.prototype.preSelect = function(value) {
    if (!this._widget) { return null; }
    this._cache._isDown = value;        // Set isDown boolean
    var cacheNodes = this._cache.nodes,
        updateLabel = (cacheNodes.labelContain && cacheNodes.labelContain.parentNode && cacheNodes.labelContain.parentNode.nodeType === 1),
        fontcolor = (value) ? this._params.label_fontcolor_down : this._params.label_fontcolor_up,
        alpha_val = (value) ? this._params.mousedown_alpha * .01 : 1;

    // Background settings
    if (!cacheNodes.formBtn) {
        cacheNodes.background.style.backgroundPosition = (value) ? '100% 50%' : '50% 50%';
    } else {
        cacheNodes.formBtn.checked = value;
    }

    // Label CSS settings
    if (updateLabel) { cacheNodes.label.style.color = '#' + fontcolor; }

    // Button opacity animation
    if (!this._params.reverse_scale && this._cache._enableBool) {
        if (!(QUtility.ieVersion() === 8)) {
            $(cacheNodes.wrap).css({ "opacity" : (alpha_val < 1) ? alpha_val : "" });
        } else {
            for (var key in cacheNodes) {
                if (cacheNodes.hasOwnProperty(key) && cacheNodes[key] && key !== 'wrap' && key !== 'stamp') {
                    $(cacheNodes[key]).css({ "opacity" : (alpha_val < 1) ? alpha_val : "" });
                }
            }
        }
    }

    // give textarea focus/blur
    cacheNodes.textarea[(value) ? 'focus' : 'blur']();
};

// Flag Button Widget
function QBaseFlagBtn(parent, configObj) {
    // Create Button Shell
    var doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        widget = doc.createElement("div"),
        valueLabel = doc.createElement("label"),
        flagStick = doc.createElement("div"),
        flagCircle = doc.createElement("div");

    // Widget CSS Style
    widget.dir = "LTR";
    widget.className = "qwidget_button";
    widget.style.cssText += ';'.concat("position: relative; filter: inherit;");
    widget.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
    widget.style.cssText += ';'.concat("-webkit-touch-callout: none;");
    widget.style.cssText += ';'.concat("-webkit-user-select: none;");
    widget.style.cssText += ';'.concat("-khtml-user-select: none;");
    widget.style.cssText += ';'.concat("-moz-user-select: none;");
    widget.style.cssText += ';'.concat("-ms-user-select: none;");
    widget.style.cssText += ';'.concat("-user-select: none;");

    // Value Label CSS Style
    valueLabel.className = "qwidget_button_valuelabel";
    valueLabel.style.cssText = "position: absolute; filter: inherit;";

    // Flag Stick CSS Style
    flagStick.className = "qwidget_button_flagstick";
    flagStick.style.cssText = "position: relative; filter: inherit;";

    // Flag Circle CSS Style
    flagCircle.className = "qwidget_button_flagcircle";
    flagCircle.style.cssText = "position: relative; filter: inherit;";

    // Append children
    widget.appendChild(valueLabel);
    widget.appendChild(flagStick);
    widget.appendChild(flagCircle);
    parentEle.appendChild(widget);

    // Init core vars
    this._widget = widget;
    this._params = {};
    this._cache = {};
    this._cache.pinInfo = {
        pinWidth : undefined,
        pinHeight : undefined,
        baseWidth : undefined,
        baseHeight : undefined
    };
    this._cache.nodes = {
        valueLabel : valueLabel,
        flagStick : flagStick,
        flagCircle : flagCircle,
        btnWidget : undefined,
        background : undefined,
        imageContain : undefined,
        labelContain : undefined,
        label : undefined,
        stamp : undefined
    };

    // this will in-turn call the update method to finalize construction
    this.config(configObj || {});

    // enable widget by default
    this.enabled(true);

    // init widget events
    this.initEvents();
}
QBaseFlagBtn.prototype = new QStudioBtnAbstract();
QBaseFlagBtn.prototype.config = function(value) {
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

            // add additional widget specific params
            this._configMap.flagstick_height = { value: 50, type: "number", min: 0 };
            this._configMap.value_label_halign = { value: 'center', type: "string", options:['left', 'right', 'center'] };
            this._configMap.value_label_fontsize = { value: 16, type: "number", min: 5 };
            this._configMap.value_label_fontcolor = { value: 0x000000, type: "color" };
            this._configMap.flagcircle_color = { value: 0xFF0000, type: "color" };
            this._configMap.show_value_label = { value: true, type: "boolean" };
            this._configMap.select_anim_type = { value: 'basic', type: "string", options:['basic', 'image', 'pin'] };
            this._configMap.btn_widget_type = { value: 'base', type: "string", options:['base', 'text', 'flow'] };
            this._configMap.image_select_anim_width = { value: 50, type: "number", min: 1 };
            this._configMap.image_select_anim_height = { value: 50, type: "number", min: 1 };
            this._configMap.pin_select_anim_size = { value: 12, type: "number", min: 5 };

            // set default parameters
            this.setParams(this._configMap, true);
        }

        // set custom parameters
        this.setParams(value);

        // update widget
        this.update(value);

        // set button state
        if (this._cache._answerBool) {
            this.animType[this._params.select_anim_type].select.call(this, (value));
        }

        // check to see if widget state was previously disabled
        if ((this._cache._enableBool === false) && this._cache._enabConfigObj) {
            this.enabled(false, this._cache._enabConfigObj);
        }

        // add mouseenter event for widget tooltip
        if (!this._cache._touchEnableBool) {
            qToolTipSingleton.getInstance()[(this._params.use_tooltip) ? "addWgt" : "removeWgt"](this);
        }

        value = null;
        return this;
    }
};
QBaseFlagBtn.prototype.update = function(value) {
    if (!this._widget) { return null; }
    var params = this._params,
        cacheNodes = this._cache.nodes,
        widget = this._widget,
        flagCircleSize = 11,
        btnEle = undefined;

    // Set config defaults for button widget
    value.use_tooltip = false;
    value.border_width_down =
        value.border_width_over =
            value.border_width_up;

    // Allow only top or bottom overlay label placement for base widget
    if (params.btn_widget_type === "base" && !(value.label_placement === "top overlay" || value.label_placement === "bottom overlay")) {
        value.label_placement = "bottom overlay";
    }

    // remove previous btnWidget (if any)
    if (cacheNodes.btnWidget && cacheNodes.btnWidget.widget().parentNode && cacheNodes.btnWidget.widget().parentNode.nodeType === 1) {
        cacheNodes.btnWidget.widget().parentNode.removeChild(cacheNodes.btnWidget.widget());
    }

    // create new btnWidget
    cacheNodes.btnWidget = QStudioCompFactory.widgetFactory(
        params.btn_widget_type,
        widget,
        value
    );
    btnEle = cacheNodes.btnWidget.widget();
    btnEle.className = "";

    // Remove mouseenter/mouseleave event from btnEle since its already applied on widget
    this.removeEvent.apply(cacheNodes.btnWidget, [btnEle, this._events.hover]);

    // Set btnEle children position to "relative" for easier positioning w/ flag and valueLabel
    // **exclude stamp
    btnEle.style.position = "relative";
    for (var child = btnEle.firstChild; child; child = child.nextSibling) {
        if (child !== cacheNodes.btnWidget.cache().nodes.stamp) {
            child.style.position = "relative";
        }
    }

    // Update cache node references
    cacheNodes.background = cacheNodes.btnWidget.cache().nodes.background;
    cacheNodes.imageContain = cacheNodes.btnWidget.cache().nodes.imageContain;
    cacheNodes.labelContain = cacheNodes.btnWidget.cache().nodes.labelContain;
    cacheNodes.label = cacheNodes.btnWidget.cache().nodes.label;
    cacheNodes.stamp = cacheNodes.btnWidget.cache().nodes.stamp;

    // valueLabel CSS settings
    if (params.show_value_label) {
        cacheNodes.valueLabel.style.fontFamily = params.primary_font_family;
        cacheNodes.valueLabel.style.display = "none";
        cacheNodes.valueLabel.style.wordWrap = "break-word";
        cacheNodes.valueLabel.dir = (!params.isRTL) ? "LTR" : "RTL";
        cacheNodes.valueLabel.style.whiteSpace = "normal";
        cacheNodes.valueLabel.style.textAlign = (!params.isRTL) ? params.value_label_halign :
            (params.value_label_halign !== "left") ? params.value_label_halign : "";
        cacheNodes.valueLabel.style.fontSize = params.value_label_fontsize + "px";
        cacheNodes.valueLabel.style.width = parseFloat(btnEle.style.width) + "px";
        cacheNodes.valueLabel.style.height = "auto";
        cacheNodes.valueLabel.style.color = "#" + params.value_label_fontcolor;
        cacheNodes.valueLabel.style.backgroundColor = "transparent";
        widget.insertBefore(cacheNodes.valueLabel, btnEle);
    } else {
        if (cacheNodes.valueLabel.parentNode && cacheNodes.valueLabel.parentNode.nodeType === 1) {
            cacheNodes.valueLabel.parentNode.removeChild(cacheNodes.valueLabel);
        }
    }

    // flagStick CSS settings
    cacheNodes.flagStick.style.display = (params.flagstick_height>0) ? "" : "none";
    cacheNodes.flagStick.style.width = "5px";
    cacheNodes.flagStick.style.height = params.flagstick_height + "px";
    cacheNodes.flagStick.style.borderWidth = "0px 0px 5px 5px";
    cacheNodes.flagStick.style.borderStyle = "solid";
    cacheNodes.flagStick.style.borderColor = "transparent #" + params.border_color_up;
    cacheNodes.flagStick.style.left = ((parseFloat(btnEle.style.width) - flagCircleSize*0.5)*0.5) + "px";
    btnEle.appendChild(cacheNodes.flagStick);

    // flagCircle CSS settings
    cacheNodes.flagCircle.style.borderRadius =
        cacheNodes.flagCircle.style.webkitBorderRadius =
            cacheNodes.flagCircle.style.mozBorderRadius = "50%";
    cacheNodes.flagCircle.style.backgroundColor = "#" + params.flagcircle_color;
    cacheNodes.flagCircle.style.width = flagCircleSize + "px";
    cacheNodes.flagCircle.style.height = flagCircleSize + "px";
    cacheNodes.flagCircle.style.top = (-flagCircleSize*0.5) + "px";
    cacheNodes.flagCircle.style.left = (parseFloat(cacheNodes.flagStick.style.left)-(flagCircleSize*0.5) + 2) + "px";
    cacheNodes.flagCircle.style.visibility = "hidden";
    btnEle.appendChild(cacheNodes.flagCircle);

    // Set widget dimensions
    widget.id = params.id;
    widget.style.width = btnEle.style.width;
    widget.style.height = ($(btnEle).outerHeight() + $(cacheNodes.flagStick).outerHeight()) + "px";

    // record base widget dimensions for use w/ pin animation
    this._cache.pinInfo.baseWidth = parseInt(widget.style.width, 10);
    this._cache.pinInfo.baseHeight = parseInt(widget.style.height, 10);

    // update pin
    if (cacheNodes.pin) {
        var pin = cacheNodes.pin.firstChild,
            arrw = cacheNodes.pin.children[1];

        pin.style.borderColor = "#" + params.border_color_up;
        arrw.style.borderColor = "#" + params.border_color_up + " transparent";
    }
};
QBaseFlagBtn.prototype.enabled = function(value, configObj) {
    if (!this._widget) { return null; }
    if (typeof value === 'boolean') {
        var params = this._params,
            cacheNodes = this._cache.nodes,
            widget = this._widget;

        // call enabled method on btnWidget
        cacheNodes.btnWidget.enabled(value, configObj);

        // Init config object
        configObj = configObj || {};
        configObj = {
            isAnimate : (typeof configObj.isAnimate === "boolean") ? configObj.isAnimate : false,
            animSpeed : (typeof configObj.animSpeed === "number" && configObj.animSpeed >= 100) ? configObj.animSpeed : 800,
            goOpaque : (typeof configObj.goOpaque === "boolean") ? configObj.goOpaque : false,
            enableExtEvt : (typeof configObj.enableExtEvt === "boolean") ? configObj.enableExtEvt : false,
            alphaVal : (!this._cache._enableBool) ?
                ((parseInt(configObj.alphaVal, 10) >= 0) ? parseInt(configObj.alphaVal, 10) : 50) :
                (this._cache._answerBool) ? params.mousedown_alpha*100 : 100
        };
        this._cache._enableBool = value;
        this._cache._enableExtEvt = configObj.enableExtEvt;
        if (!this._cache._enableBool) {
            // cache the latest configuration settings for disabled widget state
            this._cache._enabConfigObj = configObj;
            widget.style.zIndex = "auto";
        }

        // Enable/disable button state
        widget.style.cursor = (this._cache._enableBool) ? 'pointer' : 'default';
        if (!configObj.isAnimate) {
            $([cacheNodes.valueLabel, cacheNodes.flagStick, cacheNodes.flagCircle]).css( { "opacity": ((configObj.alphaVal < 100) ? configObj.alphaVal *.01 : "") } );
        } else {
            $([cacheNodes.valueLabel, cacheNodes.flagStick, cacheNodes.flagCircle]).animate(
                { "opacity": configObj.alphaVal *.01 }, configObj.animSpeed
            );
        }
    }

    return !!this._cache._enableBool;
};
QBaseFlagBtn.prototype.valueLabel = function(value) {
    if (!this._widget || !this._params.show_value_label || !(QUtility.isString(value) || QUtility.isNumber(value))) { return false; }
    var cacheNodes = this._cache.nodes;
    $(cacheNodes.valueLabel).html(value);
    cacheNodes.valueLabel.style.display = (value !== "") ? "block" : "none";
    cacheNodes.valueLabel.style.top = (-$(cacheNodes.valueLabel).outerHeight()) + "px";
    if (cacheNodes.pin) {
        cacheNodes.valueLabel.style.marginTop = -4 + "px";
        cacheNodes.valueLabel.style.left = ($(cacheNodes.pin).outerWidth() - $(cacheNodes.valueLabel).outerWidth())*0.5 + "px";
    }

    return true;
};
QBaseFlagBtn.prototype.flagStickHeight = function(value) {
    if (!this._widget) { return false; }
    var widget = this._widget,
        flagStick = this._cache.nodes.flagStick,
        btnEle = this._cache.nodes.btnWidget.widget();

    if(QUtility.isNumber(value) && value >= this.config().flagstick_height) {
        flagStick.style.height = value + "px";
        widget.style.height = ($(btnEle).outerHeight() + value) + "px";
    }

    return (flagStick.style.display !== "none") ? parseInt(flagStick.style.height, 10) : 0;
};
QBaseFlagBtn.prototype.toggleMouseEnter = function(value) {
    // Widget mouseover zIndex is 2000
    if (!this._widget ||
        this.isDrag() ||
        !this._cache._enableBool ||
        this._cache._answerBool) { return null; }

    var params = this._params,
        cacheNodes = this._cache.nodes,
        widget = this._widget,
        border_color = (value) ? params.border_color_over : params.border_color_up;

    cacheNodes.flagStick.style.borderColor = "transparent #" + border_color;
    cacheNodes.btnWidget.toggleMouseEnter(value);
    widget.style.zIndex = (value) ? 2000 : 'auto';
};
QBaseFlagBtn.prototype.isAnswered = function(value) {
    if (!this._widget) { return false; }
    if (typeof value === 'boolean' && this._cache._answerBool !== value) {
        this._cache._answerBool = value;
        this.animType[this._params.select_anim_type].select.call(this, (value));
    }

    return !!this._cache._answerBool;
};
QBaseFlagBtn.prototype.animType = {
    basic : {
        select : function(value) {
            var params = this._params,
                cacheNodes = this._cache.nodes,
                border_color = (value) ? params.border_color_down : params.border_color_up;

            cacheNodes.flagStick.style.borderColor = "transparent #" + border_color;
            if (!value) { cacheNodes.flagStick.style.height = params.flagstick_height + "px"; }
            cacheNodes.flagCircle.style.visibility = (value) ? "" : "hidden";
            cacheNodes.btnWidget.toggleMouseDown(value);
        },

        down : function(value) {
            // do nothing
        }
    },
    image : {
        select : function(value) {
            QBaseFlagBtn.prototype.animType.basic.select.call(this, value);
        },

        down : function(value) {
            var params = this._params,
                cacheNodes = this._cache.nodes,
                widget = this._widget,
                btnEle = cacheNodes.btnWidget.widget(),
                flagCircleSize = 11;

            if ((cacheNodes.btnWidget.config().width !== ((value) ? params.image_select_anim_width : params.width)) ||
                (cacheNodes.btnWidget.config().height !== ((value) ? params.image_select_anim_height : params.height))) {
                cacheNodes.btnWidget.config({
                    //show_label : (value && params.btn_widget_type.toLowerCase() === "base") ? false : true,
                    use_lightbox : (value) ? false : params.use_lightbox,
                    bckgrnd_color_up : (value) ? params.bckgrnd_color_over : params.bckgrnd_color_up,
                    border_color_up : (value) ? params.border_color_over : params.border_color_up,
                    label_color_up : (value) ? params.label_color_over : params.label_color_up,
                    bckgrnd_import_up : (value) ? params.bckgrnd_import_over : params.bckgrnd_import_up,
                    width : (value) ? params.image_select_anim_width : params.width,
                    height : (value) ? params.image_select_anim_height : params.height
                });
            }

            cacheNodes.labelContain.style.display = (value && params.btn_widget_type.toLowerCase() === "base") ? "none" : "block";
            cacheNodes.flagStick.style.left = ((parseFloat(btnEle.style.width) - flagCircleSize * 0.5) * 0.5) + "px";
            cacheNodes.flagCircle.style.left = (parseFloat(cacheNodes.flagStick.style.left) - (flagCircleSize * 0.5) + 2) + "px";
            cacheNodes.valueLabel.style.width = parseFloat(btnEle.style.width) + "px";

            // Set widget dimensions
            widget.style.width = btnEle.style.width;
            widget.style.height = ($(btnEle).outerHeight() + $(cacheNodes.flagStick).outerHeight()) + "px";
        }
    },
    pin : {
        hover : function(value) {
            var cacheNodes = this._cache.nodes,
                btnClone = cacheNodes.pin.children[2];

            $(btnClone).stop(false, true);
            $(btnClone)[(value) ? "fadeIn" : "hide"]((value) ? 300 : 0);
            btnClone.style.zIndex = (value) ? 2000 : "auto";
        },

        select : function(value) {
            var params = this._params,
                cacheNodes = this._cache.nodes,
                pin = cacheNodes.pin.firstChild,
                arrw = cacheNodes.pin.children[1],
                border_color = (value) ? params.border_color_down : params.border_color_up;

            pin.style.borderColor = "#" + border_color;
            arrw.style.borderColor = "#" + border_color + " transparent";
        },

        down : function(value) {
            var cacheNodes = this._cache.nodes,
                widget = this.widget(),
                btnEle = cacheNodes.btnWidget.widget(),
                pin = this._pinCreate();

            if (value && !QUtility.isTouchDevice()) { QBaseFlagBtn.prototype.animType.pin.hover.call(this, false); }
            btnEle.style.display = (value) ? "none" : "";
            cacheNodes.flagStick.style.display = (value) ? "none" : "";
            cacheNodes.flagCircle.style.display = (value) ? "none" : "";
            pin.style.display = (value) ? "" : "none";
            widget.style.width = ((value) ? this._cache.pinInfo.pinWidth : this._cache.pinInfo.baseWidth) + "px";
            widget.style.height = ((value) ? this._cache.pinInfo.pinHeight : this._cache.pinInfo.baseHeight) + "px";
        }
    }
};
QBaseFlagBtn.prototype._pinCreate = function() {
    if (!this._cache.nodes.pin) {
        var that = this,
            doc = document,
            params = this._params,
            cacheNodes = this._cache.nodes,
            widget = this._widget,
            btnEle = cacheNodes.btnWidget.widget(),
            btnClone = undefined,
            btnHeight = $(cacheNodes.background).outerHeight(),
            size = ((params.pin_select_anim_size & 1) === 0) ? params.pin_select_anim_size : params.pin_select_anim_size + 1,
            radius = size*3,
            arrw_width = size + Math.round((size*0.5)),
            arrw_height = Math.round(size*2.5),
            contain = doc.createElement("div"),
            pin = doc.createElement("div"),
            arrw = doc.createElement("div");

        // Prep btn widget before cloning
        btnEle.style.height = btnHeight + "px";
        cacheNodes.flagStick.style.display = "none";
        cacheNodes.flagCircle.style.display = "none";
        btnClone = btnEle.cloneNode(true);

        // Container CSS
        contain.className = "qwidget_button_pin";
        contain.style.position = "absolute";
        contain.style.cursor = "pointer";

        // Pin Head CSS
        pin.style.width = size + "px";
        pin.style.height = size + "px";
        pin.style.border = size + "px solid #" + params.border_color_up;
        pin.style.borderBottom = 0;
        pin.style.borderRadius =
            pin.style.webkitBorderRadius =
                pin.style.mozBorderRadius =
                    radius + "px " + radius + "px 0 0";
        pin.style.background = "#FFF";

        // Bottom Arrow CSS
        arrw.style.width = "0px";
        arrw.style.height = "0px";
        arrw.style.borderWidth = arrw_height + "px " + arrw_width + "px 0";
        arrw.style.borderStyle = "solid";
        arrw.style.borderColor = "#" + params.border_color_up + " transparent";
        arrw.style.marginTop = -1 + "px";

        // Append children
        contain.appendChild(pin);
        contain.appendChild(arrw);
        contain.appendChild(btnClone);
        widget.appendChild(contain);

        // Event handler
        if (!QUtility.isTouchDevice()) {
            $(contain).on("mouseenter.dragnflag.pin mouseleave.dragnflag.pin", function(event) {
                if (that.isDrag()) { return; }
                QBaseFlagBtn.prototype.animType.pin.hover.call(that, event.type === "mouseenter");
            });
        }

        // record pin instance in cache
        this._cache.nodes.pin = contain;

        // record pin info in cache
        this._cache.pinInfo.pinWidth = radius;
        this._cache.pinInfo.pinHeight = size*2 + arrw_height;

        // btnClone CSS
        $(btnClone).hide();
        btnClone.style.position = "absolute";
        btnClone.style.top = (-btnHeight - 2) + "px";
        btnClone.style.left = ((radius - parseInt(widget.style.width, 10))*0.5) + "px";
    }

    return this._cache.nodes.pin;
};

// Base Bucket Widget
function QBaseBucket(parent, configObj) {
    // Create Bucket Shell
    var doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        widget = doc.createElement("div"),
        wrap = doc.createElement("div"),
        background = doc.createElement("div"),
        imageContain = doc.createElement("div"),
        image = doc.createElement("img"),
        labelContain = doc.createElement("div"),
        label = doc.createElement("label"),
        dropContain = doc.createElement("div");

    // Widget CSS Style
    widget.className = "qwidget_bucket";
    widget.dir = "LTR";
    widget.style.cssText += ';'.concat("position: relative; filter: inherit;");
    widget.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
    widget.style.cssText += ';'.concat("-webkit-touch-callout: none;");
    widget.style.cssText += ';'.concat("-webkit-user-select: none;");
    widget.style.cssText += ';'.concat("-khtml-user-select: none;");
    widget.style.cssText += ';'.concat("-moz-user-select: none;");
    widget.style.cssText += ';'.concat("-ms-user-select: none;");
    widget.style.cssText += ';'.concat("-user-select: none;");

    // Wrapper CSS Style
    wrap.className = "qwidget_bucket_wrapper";
    wrap.style.position = "absolute";
    wrap.style.filter = "inherit";

    // Container CSS Style
    dropContain.className = "qwidget_bucket_drop_container";
    dropContain.style.position = "absolute";
    dropContain.style.filter = (QUtility.ieVersion() > 9) ? "inherit" : "";
    dropContain.style.cssText += ';'.concat("-webkit-box-sizing: border-box;");
    dropContain.style.cssText += ';'.concat("-moz-box-sizing: border-box;");
    dropContain.style.cssText += ';'.concat("box-sizing: border-box;");

    // Append Children
    imageContain.appendChild(image);
    labelContain.appendChild(label);
    background.appendChild(imageContain);
    background.appendChild(dropContain);
    background.appendChild(labelContain);
    wrap.appendChild(background);
    widget.appendChild(wrap);
    parentEle.appendChild(widget);

    // Init core vars
    this._widget = widget;
    this._params = {};
    this._cache = {};
    this._cache.bucketArray = [];
    this._cache.maxSize = 0;
    this._cache.maxRowSize = 0;
    this._cache.maxColSize = 0;
    this._cache.xPosition = 0;
    this._cache.yPosition = 0;
    this._cache.nodes = {
        wrap : wrap,
        background : background,
        imageContain : imageContain,
        image : image,
        dropContain : dropContain,
        labelContain : labelContain,
        label : label
    };

    // call config which in-turn will call update to finalize construction
    this.config(configObj || {});

    // enable widget by default
    this.enabled(true);

    // init widget events
    this.initEvents();
}
QBaseBucket.prototype = new QStudioBucketAbstract();
QBaseBucket.prototype.config = function(value) {
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
            this.setParams(this._configMap, true);
        }

        // if bucket contains responses remove before updating params
        while (this._cache.bucketArray.length > 0) {
            if (this._cache.bucketArrayCopy === undefined) { this._cache.bucketArrayCopy = this._cache.bucketArray.slice(); }
            this.remove(this._cache.bucketArray[0]);
        }

        // set custom parameters
        this.setParams(value);

        // parameter presets
        if (this._params.capvalue === undefined) { this._params.capvalue = -1; }
        this._params.show_img = (this._params.img_placement !== "none");
        this._params.isImgLeftRight = (this._params.img_placement === "left" || this._params.img_placement === "right");
        this._params.padding = 0;

        if (this._params.border_style === "none" || !this._params.show_bckgrnd ) {
            this._params.border_width_up = 0;
            this._params.border_width_over = 0;
            this._params.border_radius = 0;
        }

        if (this._params.label_placement.indexOf("overlay") !== -1) {
            this._params.label_width = (this._params.width + this._params.padding*2 - this._params.label_overlay_padding*2);
            if (this._params.label_width <= 0) {
                this._params.label_overlay_padding = 0;
                this._params.label_width = this._params.width + this._params.padding*2;
            }
            this._params.label_padding = this._params.label_overlay_padding;
            this._params.label_trim = false;
        } else {
            this._params.label_width = this._params.width;
            this._params.label_padding = 0;
            this._params.label_trim = false;
        }

        if (this._params.img_placement === "center") { this._params.img_width = this._params.width }
        if (this._params.isImgLeftRight) { this._params.label_width += this._params.img_width; }
        if (this._params.bucket_animation === "fade") { this._params.grow_animation = "none"; }

        // update widget
        this.update();

        // check to see if widget state was previously disabled
        if ((this._cache._enableBool === false) && this._cache._enabConfigObj) {
            this.enabled(false, this._cache._enabConfigObj);
        }

        // add mouseenter event for widget tooltip
        if (!this._cache._touchEnableBool) {
            qToolTipSingleton.getInstance()[(this._params.use_tooltip) ? "addWgt" : "removeWgt"](this);
        }

        value = null;
        return this;
    }
};
QBaseBucket.prototype.update = function() {
    if (!this._widget) { return false; }
    var cacheNodes = this._cache.nodes,
        params = this._params,
        widget = this._widget,
        bckgrndWidth = 0,
        bckgrndHeight = 0,
        imgPlacement = params.img_placement,
        isOverlayLabel = (params.label_placement.indexOf("overlay") !== -1),
        updateLabel = false,
        labContainHeight = 0;

    // update dropContain
    cacheNodes.dropContain.style.width = params.width + "px";
    if (imgPlacement === "left") {
        cacheNodes.dropContain.style.width = (params.width - params.border_width_up) + "px";
        cacheNodes.dropContain.style.left = (params.img_width + params.border_width_up) + "px";
    }
    cacheNodes.dropContain.style.height = params.height + "px";
    cacheNodes.dropContain.style.padding = params.contain_padding + "px";
    cacheNodes.dropContain.style.overflowY = (params.bucket_animation.toLowerCase() !== "fade" &&
        params.grow_animation.toLowerCase() === "none") ? "auto" : "hidden";
    cacheNodes.dropContain.style.overflowX = "hidden";

    // update background
    QStudioAssetFactory.prototype.assetUpdate.baseBckgrnd.apply(this, [cacheNodes.background, params]);
    cacheNodes.background.style.overflow = (params.show_bckgrnd) ? "hidden" : "";

    // Record background dimensions
    if (params.isImgLeftRight) {
        (!params.show_bckgrnd_import) ?
            cacheNodes.background.style.width = (params.width + params.img_width) + "px":
            $(cacheNodes.background).css({
                'width': (params.width + params.img_width) + "px",
                'background-size': ((params.width + params.img_width) + params.padding*2) + 'px ' + (params.height + params.padding*2) + 'px'
            });
    }
    bckgrndWidth = $(cacheNodes.background).outerWidth();
    bckgrndHeight = $(cacheNodes.background).outerHeight();

    // update labelContain
    updateLabel = QStudioAssetFactory.prototype.assetUpdate.label.apply(this, [cacheNodes.labelContain, {
        label_font_family : params.primary_font_family,
        isRTL : params.isRTL,
        show_label : params.show_label,
        label_trim : params.label_trim,
        label : params.label,
        label_width : params.label_width,
        label_padding : params.label_padding,
        label_left : params.label_left,
        label_top : params.label_top,
        label_halign : params.label_halign,
        label_fontsize : params.label_fontsize,
        label_fontcolor_up : params.label_fontcolor_up
    }]);

    if (updateLabel) {
        // this supports DragnDrop component when overlay label height is sync'd
        if (QUtility.isNumber(params.label_height)) {
            cacheNodes.labelContain.style.height = (params.label_height + params.label_padding*2) + "px";
        }

        // record labelContain height
        labContainHeight = $(cacheNodes.labelContain).height();

        // If label placement is overlay type...
        if (isOverlayLabel) {
            // append labelContain to background
            cacheNodes.background.appendChild(cacheNodes.labelContain);

            var hex_rgb = QUtility.hexToRgb(params.label_bckgrnd_color),
                rgb_str = hex_rgb.r+','+hex_rgb.g+','+hex_rgb.b;

            cacheNodes.labelContain.style.backgroundColor = (params.show_label_bckgrnd) ? ((QUtility.ieVersion() <= 8) ?
                '#' + params.label_bckgrnd_color : 'rgba('+rgb_str+', 1)') : "";

            // Update background height to account for labelContain height
            (!params.show_bckgrnd_import) ?
                cacheNodes.background.style.height = (params.height + labContainHeight) + "px":
                $(cacheNodes.background).css({
                    'height': (params.height + labContainHeight) + "px",
                    'background-size': (((!params.isImgLeftRight) ? params.width : (params.width + params.img_width)) + params.padding*2) + 'px ' + ((params.height + labContainHeight) + params.padding*2) + 'px'
                });

            // re-record background height after adjustments
            bckgrndHeight = $(cacheNodes.background).outerHeight();

            // Label Vertical Alignment
            switch(params.label_overlay_valign) {
                case "bottom":
                    cacheNodes.label.style.top = (labContainHeight - $(cacheNodes.label).outerHeight()) + "px";
                    break;
                case "center":
                    cacheNodes.label.style.top = (labContainHeight - $(cacheNodes.label).outerHeight())*0.5 + "px";
                    break;
                default: // top
                    cacheNodes.label.style.top = 0 + "px";
                    break;
            }
        } else {
            // append labelContain to wrap before background element
            cacheNodes.wrap.insertBefore(cacheNodes.labelContain, cacheNodes.background);
        }

        // position elements
        switch (params.label_placement) {
            case "top" :
                cacheNodes.labelContain.style.left = params.border_width_up + "px";
                cacheNodes.labelContain.style.top = 0 + "px";
                cacheNodes.background.style.top = labContainHeight + "px";
                break;
            case "bottom overlay" :
                // Adjust left & top positions
                cacheNodes.labelContain.style.left = 0 + "px";
                cacheNodes.labelContain.style.top = (params.height + params.padding*2) + "px";
                break;
            case "top overlay" :
                // Adjust left & top positions
                cacheNodes.labelContain.style.left = 0 + "px";
                cacheNodes.labelContain.style.top = 0 + "px";

                // Adjust imageContain & dropContain top position
                cacheNodes.imageContain.style.top = labContainHeight + "px";
                cacheNodes.dropContain.style.top = labContainHeight + "px";
                break;
            default : // case "bottom"
                cacheNodes.labelContain.style.left = params.border_width_up + "px";
                cacheNodes.labelContain.style.top = bckgrndHeight + "px";
                break;
        }
    } else {
        if (cacheNodes.labelContain.parentNode && cacheNodes.labelContain.parentNode.nodeType === 1) {
            cacheNodes.labelContain.parentNode.removeChild(cacheNodes.labelContain);
        }
    }

    // Call appropriate lightbox method
    qLightBoxSingleton.getInstance()[(params.use_lightbox && params.isImgLeftRight) ? "addWgt" : "removeWgt"](this, {
        zoom_left : params.zoom_left,
        zoom_top : params.zoom_top
    });

    // update imageContain
    QStudioAssetFactory.prototype.assetUpdate.image.apply(this, [cacheNodes.imageContain, {
        image : (params.show_img) ? params.image : "",
        width : ((params.img_width - params.img_padding*2) >= 0) ? params.img_width - params.img_padding*2 : params.img_width,
        height : ((params.height - params.img_padding*2) >= 0) ? params.height - params.img_padding*2 : params.height,
        img_left : 0, img_top : 0,
        // callback would fire on successful load
        callback_success : function() {
            // Position image
            cacheNodes.imageContain.style.width =
                ((imgPlacement !== "right") ? params.img_width : (params.img_width - params.border_width_up)) + "px";
            cacheNodes.imageContain.style.height = params.height + "px";
            cacheNodes.image.style.left = ((($(cacheNodes.imageContain).width() - $(cacheNodes.image).width())*0.5) + params.img_left) + "px";
            cacheNodes.image.style.top = ((($(cacheNodes.imageContain).height() - $(cacheNodes.image).height())*0.5) + params.img_top) + "px";

            // Append imageContain to background; make the imageContain the first child
            (cacheNodes.background.firstChild) ?
                cacheNodes.background.insertBefore(cacheNodes.imageContain, cacheNodes.background.firstChild):
                cacheNodes.background.appendChild(cacheNodes.imageContain);

            // position zoom button
            if (cacheNodes.zoomBtn) {
                cacheNodes.zoomBtn.style.left = cacheNodes.image.style.left;
                cacheNodes.zoomBtn.style.top = cacheNodes.image.style.top;
            }
        },
        // callback would fire when an error is encountered
        callback_error: function() {
            if (params.isImgLeftRight) {
                if (cacheNodes.zoomBtn) { cacheNodes.zoomBtn.style.display = "none"; }
                cacheNodes.imageContain.style.display = "block";
                cacheNodes.imageContain.style.width =
                    ((imgPlacement !== "right") ? params.img_width : (params.img_width - params.border_width_up)) + "px";
                cacheNodes.imageContain.style.height = params.height + "px";

                // Append imageContain to background; make the imageContain the first child
                (cacheNodes.background.firstChild) ?
                    cacheNodes.background.insertBefore(cacheNodes.imageContain, cacheNodes.background.firstChild):
                    cacheNodes.background.appendChild(cacheNodes.imageContain);

                // Remove image element since it's not needed
                if (cacheNodes.imageContain.firstChild) {
                    cacheNodes.imageContain.removeChild(cacheNodes.imageContain.firstChild);
                }
            } else {
                if (cacheNodes.imageContain.parentNode && cacheNodes.imageContain.parentNode.nodeType === 1) {
                    cacheNodes.imageContain.parentNode.removeChild(cacheNodes.imageContain);
                }
            }
        }
    }]);

    // see about adding borders for imageContain
    if (params.isImgLeftRight) {
        cacheNodes.imageContain.style[(imgPlacement === "left") ? "borderRight" : "borderLeft"] =
            params.border_width_up + "px " + params.border_style + " #" + params.border_color_up;
        if (imgPlacement === "right") { cacheNodes.imageContain.style.left = params.width + "px"; }
    } else {
        cacheNodes.imageContain.style.borderLeft = "";
        cacheNodes.imageContain.style.borderRight = "";
    }

    // Set wrapper dimensions
    cacheNodes.wrap.style.display = (parseInt(params.capvalue, 10) !== 0) ? "block" : "none";
    cacheNodes.wrap.style.width = bckgrndWidth + "px";
    cacheNodes.wrap.style.height = (bckgrndHeight + ((!isOverlayLabel) ? labContainHeight : 0)) + "px";
    cacheNodes.wrap.style.visibility = "";

    // Set widget dimensions
    widget.id = params.id;
    widget.style.width = cacheNodes.wrap.style.width;
    widget.style.height = cacheNodes.wrap.style.height;

    // re-add drops under new param settings
    if (this._cache.bucketArrayCopy) {
        while (this._cache.bucketArrayCopy.length > 0) {
            this.add(this._cache.bucketArrayCopy.shift());
        }
        delete this._cache.bucketArrayCopy;
    }
};

// Base Slider Widget
function QBaseSlider(parent, configObj) {
    // Create Slider Shell
    var doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        widget = doc.createElement("div"),
        wrap = doc.createElement("div"),
        labelContain = doc.createElement("div"),
        label = doc.createElement("label"),
        imageContain = doc.createElement("div"),
        sliderImageWrap = doc.createElement("div"),
        ltEndImgContain = doc.createElement("div"),
        ltImgEle = doc.createElement("img"),
        rbEndImgContain = doc.createElement("div"),
        rbImgEle = doc.createElement("img"),
        trackContain = doc.createElement("div"),
        track = doc.createElement("div"),
        highlight = doc.createElement("div"),
        tickContain = doc.createElement("div"),
        handleContain = doc.createElement("div"),
        handle = doc.createElement("div"),
        handleImageContain = doc.createElement("div"),
        handleImg = doc.createElement("img"),
        handleLabelContain = doc.createElement("div"),
        handleLabel = doc.createElement("label");

    // Widget CSS Style
    widget.className = "qwidget_slider";
    widget.dir = "LTR";
    widget.style.cssText += ';'.concat("position: relative; filter: inherit;");
    widget.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
    widget.style.cssText += ';'.concat("-webkit-touch-callout: none;");
    widget.style.cssText += ';'.concat("-webkit-user-select: none;");
    widget.style.cssText += ';'.concat("-khtml-user-select: none;");
    widget.style.cssText += ';'.concat("-moz-user-select: none;");
    widget.style.cssText += ';'.concat("-ms-user-select: none;");
    widget.style.cssText += ';'.concat("-user-select: none;");

    // Wrapper CSS Style
    wrap.className = "qwidget_slider_wrapper";
    wrap.style.position = "absolute";
    wrap.style.filter = "inherit";

    // Slider/ImageContainer Wrapper CSS Style
    sliderImageWrap.className = "qwidget_slider_image_container_wrapper";
    sliderImageWrap.style.position = "relative";
    sliderImageWrap.style.filter = "inherit";

    // TrackContain CSS Style
    trackContain.className = "qwidget_slider_track_container";
    trackContain.style.position = "relative";
    trackContain.style.filter = "inherit";
    trackContain.style.zIndex = "1";

    // HandleContain CSS Style
    handleContain.className = "qwidget_slider_handle_container";
    handleContain.style.position = "absolute";
    handleContain.style.filter = "inherit";
    handleContain.style.cssText += ';'.concat("-ms-touch-action: none;");
    handleContain.style.cssText += ';'.concat("touch-action: none;");

    // TickContain CSS Style
    tickContain.style.position = "absolute";
    tickContain.style.filter = "inherit";

    // ImageContain CSS Style
    imageContain.className = "qwidget_slider_image_container";
    imageContain.style.position = "absolute";
    imageContain.style.filter = "inherit";
    imageContain.style.zIndex = "0";

    // Append children
    ltEndImgContain.appendChild(ltImgEle);
    rbEndImgContain.appendChild(rbImgEle);
    handleImageContain.appendChild(handleImg);
    handleLabelContain.appendChild(handleLabel);
    handleContain.appendChild(handle);
    handleContain.appendChild(handleImageContain);
    handleContain.appendChild(handleLabelContain);
    labelContain.appendChild(label);
    track.appendChild(highlight);
    track.appendChild(tickContain);
    trackContain.appendChild(track);
    trackContain.appendChild(handleContain);
    trackContain.appendChild(ltEndImgContain);
    trackContain.appendChild(rbEndImgContain);
    sliderImageWrap.appendChild(trackContain);
    sliderImageWrap.appendChild(imageContain);
    wrap.appendChild(labelContain);
    wrap.appendChild(sliderImageWrap);
    widget.appendChild(wrap);
    parentEle.appendChild(widget);

    // Init core vars
    this._widget = widget;
    this._params = {};
    this._cache = {};
    this._cache._minLoc = 0;
    this._cache._maxLoc = 0;
    this._cache.nodes = {
        wrap : wrap,
        sliderImageWrap : sliderImageWrap,
        ltEndImgContain : ltEndImgContain,
        ltImgEle : ltImgEle,
        rbEndImgContain : rbEndImgContain,
        rbImgEle : rbImgEle,
        labelContain : labelContain,
        label : label,
        imageContain : imageContain,
        trackContain : trackContain,
        track : track,
        highlight : highlight,
        tickContain : tickContain,
        handleContain : handleContain,
        handle : handle,
        handleImageContain : handleImageContain,
        handleImg : handleImg,
        handleLabelContain : handleLabelContain,
        handleLabel : handleLabel
    };

    // call config which in-turn will call update to finalize construction
    this.config(configObj || {});   // This will trigger update method to be called

    // enable widget by default
    this.enabled(true);

    // init widget events
    this.initEvents();
}
QBaseSlider.prototype = new QStudioSliderAbstract();
QBaseSlider.prototype.config = function(value) {
    if (!this._widget) { return null; }

    // acts as getter
    if (typeof value !== 'object') {
        return this._params;
    }

    // acts as setter
    else {
        // if slider has been answered store current range value and re-set after update is complete
        if (this._cache._answerBool) {
            this._cache.curRangeValue = this._rangeValue();
        }

        if (this._configMap === undefined) {
            // create the configMap
            this.initConfigMap();

            // set default parameters
            this.setParams(this._configMap, true);
        }

        // set custom parameters
        this.setParams(value);

        // parameter presets
        this._params.tick_array = (jQuery.isArray(value.tick_array)) ? value.tick_array : (this._params.tick_array || []);
        // the parameters survey_contain & layout_contain are used to account for container scrolling
        this._params.survey_contain = (value.survey_contain && value.survey_contain.nodeType === 1) ? value.survey_contain : (this._params.survey_contain || undefined);
        this._params.layout_contain = (value.layout_contain && value.layout_contain.nodeType === 1) ? value.layout_contain : (this._params.layout_contain || undefined);

        this._params.isVertical = (this._params.direction === "vertical");
        this._params.trackSize = this._params[(!this._params.isVertical) ? 'width' : 'height'];
        this._params.show_img = (this._params.img_placement !== "none");

        if (this._params.handle_start_loc > 100) { this._params.handle_start_loc = 100; }
        this._params.handleInitLoc =
            (((!(this._params.isVertical || this._params.isRTL)) ? this._params.handle_start_loc : (100 - this._params.handle_start_loc)) * 0.01) * this._params.trackSize;

        if (this._params.track_border_style === "none") {
            this._params.track_border_width = 0;
            this._params.track_border_radius = 0;
        }

        if (this._params.widget_border_style === "none") {
            this._params.widget_border_width = 0;
        }

        if (this._params.show_handle_import) {
            this._params.handle_border_style = "none";
            this._params.handle_border_width = 0;
            this._params.handle_border_radius = 0;
        }

        // set slider handle min/max drag bounds
        this.setHandleBounds({
            minLoc : 0,
            maxLoc : this._params.trackSize
        });

        // update widget
        this.update();

        // check to see if widget state was previously disabled
        if ((this._cache._enableBool === false) && QUtility.isNumber(this._cache._enabAlphaValue)) {
            this.enabled(false, this._cache._enabAlphaValue);
        }

        value = null;
        return this;
    }
};
QBaseSlider.prototype.update = function() {
    if (!this._widget) { return false; }
    var doc = document,
        params = this._params,
        widget = this._widget,
        cacheNodes = this._cache.nodes,
        stylePos = (!params.isVertical) ? "left" : "top",
        styleSize = (!params.isVertical) ? "width" : "height",
        trackContainWidth = 0,
        trackContainHeight = 0,
        trackPadding = (params.widget_border_style !== "none" && params.widget_border_width > 0) ? 10 : 0,
        hliteWidth = ((params.width - 6) > 0) ? (params.width - 6) : params.width,
        hliteHeight = ((params.height - 6) > 0) ? (params.height - 6) : params.height,
        handleWidth = 0,
        handleHeight = 0,
        handleMargLeft = 0,
        handleMargTop = 0,
        handleLabelWidth = 0,
        handleLabelHeight = 0,
        i = 0, tLen = params.tick_array.length,
        tickArray = (!(params.isVertical || params.isRTL)) ? params.tick_array : params.tick_array.concat([]).reverse(),
        tickSpacing = (params[styleSize] / (tLen - 1)),
        ltTickLabSize = 0, // left/top tick label size
        rbTickLabSize = 0,   // right/bottom tick label size
        maxTickLabWidth = 0,
        maxTickLabHeight = 0,
        updateTickLabel = false,
        maxLeftMargin = 0,
        maxRightMargin = 0,
        maxTopMargin = 0,
        maxBotMargin = 0,
        updateLabel = false,
        labelContainWidth = 0,
        labelContainHeight = 0,
        imgContainWidth = (params.img_width + trackPadding*2),
        imgContainHeight = (params.img_height + trackPadding*2);

    // update track
    QStudioAssetFactory.prototype.assetUpdate.baseBckgrnd.apply(this, [cacheNodes.track, {
        show_bckgrnd_import : params.show_track_import,
        width : params.width,
        height : params.height,
        padding : 0,
        border_width_up : params.track_border_width,
        border_radius : params.track_border_radius,
        border_style : params.track_border_style,
        border_color_up : params.track_border_color,
        bckgrnd_color_up : params.track_color,
        bckgrnd_import_up : params.track_import
    }]);

    // update highlight
    if (params.show_highlight) {
        QStudioAssetFactory.prototype.assetUpdate.baseBckgrnd.apply(this, [cacheNodes.highlight, {
            width : hliteWidth,
            height : hliteHeight,
            padding : 0,
            border_width_up : 0,
            border_radius : params.track_border_radius,
            bckgrnd_color_up : params.highlight_color
        }]);

        // append highlight to track
        (cacheNodes.track.firstChild) ?
            cacheNodes.track.insertBefore(cacheNodes.highlight, cacheNodes.track.firstChild):
            cacheNodes.track.appendChild(cacheNodes.highlight);

        cacheNodes.highlight.style.filter = (!params.show_track_import) ? "inherit" : "none";
        cacheNodes.highlight.style.maxWidth = cacheNodes.highlight.style.width;
        cacheNodes.highlight.style.maxHeight = cacheNodes.highlight.style.height;
        cacheNodes.highlight.style.marginTop = (params.height - $(cacheNodes.highlight).outerHeight())*0.5 + "px";
        cacheNodes.highlight.style.marginLeft = (params.width - $(cacheNodes.highlight).outerWidth())*0.5 + "px";
        cacheNodes.highlight.style[styleSize] = "0px";
    } else {
        // remove highlight from track
        if (cacheNodes.highlight.parentNode && cacheNodes.highlight.parentNode.nodeType === 1) {
            cacheNodes.highlight.parentNode.removeChild(cacheNodes.highlight);
        }
    }

    // update handle
    QStudioAssetFactory.prototype.assetUpdate.baseBckgrnd.apply(this, [cacheNodes.handle, {
        show_bckgrnd : (!params.show_handle_import) ? params.show_handle_bckgrnd : true,
        show_bckgrnd_import : params.show_handle_import,
        bckgrnd_import_up : params.handle_import_up,
        width : params.handle_width,
        height : params.handle_height,
        padding : params.handle_padding,
        border_width_up : params.handle_border_width,
        border_radius : params.handle_border_radius,
        border_style : params.handle_border_style,
        border_color_up : params.handle_border_color_up,
        bckgrnd_color_up : params.handle_color_up
    }]);

    // record handle dimensions
    handleWidth = $(cacheNodes.handle).outerWidth();
    handleHeight = $(cacheNodes.handle).outerHeight();

    // record handle margins
    handleMargLeft = (((!params.isVertical) ? 0 : params.width) - handleWidth)*0.5 + params.track_border_width;
    handleMargTop = (((!params.isVertical) ? params.height : 0) - handleHeight)*0.5 + params.track_border_width;

    // Offset handle position to give it a centered look
    cacheNodes.handle.style.marginLeft = handleMargLeft + "px";
    cacheNodes.handle.style.marginTop = handleMargTop + "px";

    // create/update handle divider line
    if (!params.show_handle_import && params.show_handle_bckgrnd) {
        if (cacheNodes.handleDivide === undefined) { cacheNodes.handleDivide = doc.createElement("div"); }
        cacheNodes.handleDivide.style.position = "absolute";
        cacheNodes.handleDivide.style.width = (!params.isVertical) ? "1px" : cacheNodes.handle.style.width;
        cacheNodes.handleDivide.style.height = (!params.isVertical) ? cacheNodes.handle.style.height : "1px";
        cacheNodes.handleDivide.style.left = (!params.isVertical) ? ((params.handle_width + params.handle_padding*2 - 1)*0.5 + "px") : "";
        cacheNodes.handleDivide.style.top = (params.isVertical) ? ((params.handle_height + params.handle_padding*2 - 1)*0.5 + "px") : "";
        cacheNodes.handleDivide.style.backgroundColor = "#" + QUtility.paramToHex(params.handle_border_color_up);
        cacheNodes.handle.appendChild(cacheNodes.handleDivide);
    } else {
        if (cacheNodes.handleDivide && cacheNodes.handleDivide.parentNode && cacheNodes.handleDivide.parentNode.nodeType === 1) {
            cacheNodes.handleDivide.parentNode.removeChild(cacheNodes.handleDivide);
        }
    }

    // update handleLabel
    // label will have a fixed width w/ overflow set to hidden
    if (params.handle_label_disptype !== "none") {
        QStudioAssetFactory.prototype.assetUpdate.label.apply(this, [cacheNodes.handleLabelContain, {
            label_font_family : params.primary_font_family,
            isRTL : params.isRTL,
            label_width : params.handle_label_width,
            label : params.handle_label_inittxt || "Click to Activate",
            label_fontsize : params.handle_label_fontsize,
            label_fontcolor_up : params.handle_label_fontcolor,
            label_top : params.handle_label_top,
            label_left : params.handle_label_left,
            label_halign : "center",
            white_space : "nowrap"
        }]);

        // set label overflow to hidden for the slider handle
        cacheNodes.handleLabel.style.overflow = "hidden";

        // append handleLabelContain to handleContain
        cacheNodes.handleContain.appendChild(cacheNodes.handleLabelContain);

        // record handleLabel dimensions
        handleLabelHeight = $(cacheNodes.handleLabel).outerHeight();
        handleLabelWidth = $(cacheNodes.handleLabel).outerWidth();

        // position handleLabelContain
        cacheNodes.handleLabelContain.style.left = (handleMargLeft + (handleWidth - handleLabelWidth)*0.5) + "px";
        cacheNodes.handleLabelContain.style.top = (handleMargTop - handleLabelHeight) + "px";
        cacheNodes.handleLabelContain.style.backgroundColor =
            (params.show_handle_label_bckgrnd) ? "#" + params.handle_label_bckgrnd_color : "transparent";
        $(cacheNodes.handleLabel).html(params.handle_label_inittxt);
    } else {
        // remove handleLabelContain from handleContain
        if (cacheNodes.handleLabelContain.parentNode && cacheNodes.handleLabelContain.parentNode.nodeType === 1) {
            cacheNodes.handleLabelContain.parentNode.removeChild(cacheNodes.handleLabelContain);
        }
    }

    //  update handle image
    this._updateHandleImage(params.image);

    // set handleContain position and lastX/lastY value; lastX/lastY is used for dragging
    cacheNodes.handleContain.style.filter = (!params.show_track_import) ? "inherit" : "none";
    cacheNodes.handleContain.style[(!params.isVertical) ? "top" : "left"] = 0 + "px";
    cacheNodes.handleContain.style[stylePos] = params.handleInitLoc + "px";
    cacheNodes.handleContain[(!params.isVertical) ? "lastX" : "lastY"] = params.handleInitLoc;

    // update tickContain
    // before update we need to remove previous images from imageContain & previous ticks from tickContain
    while (cacheNodes.imageContain.firstChild) { cacheNodes.imageContain.removeChild(cacheNodes.imageContain.firstChild); }
    while (cacheNodes.tickContain.firstChild) { cacheNodes.tickContain.removeChild(cacheNodes.tickContain.firstChild); }
    cacheNodes.tickContain.style.filter = (!params.show_track_import) ? "inherit" : "none";
    // Create tick and tick label
    for (i; i < tLen; i+=1) {
        var tickWrap = doc.createElement("div"),
            tick = doc.createElement("div"),
            tickLabelContain = doc.createElement("div"),
            tickLabel = doc.createElement("label"),
            tickLabelWidth = 0,
            tickLabelHeight = 0;

        // Tick wrapper CSS settings
        tickWrap.className = "qwidget_slider_tick_wrapper";
        tickWrap.style.position = "absolute";
        tickWrap.style.filter = "inherit";
        tickWrap.style[(!params.isVertical) ? "left" : "top"] = (i * tickSpacing) + "px";
        cacheNodes.tickContain.appendChild(tickWrap);       // append tickWrap to tickContain

        // Tick CSS settings
        tick.className = "qwidget_slider_tick";
        tick.style.position = "absolute";
        tick.style.filter = "inherit";
        tick.style.width = params.tick_width + "px";
        tick.style.height = params.tick_height + "px";
        tick.style.backgroundColor = "#" + params.tick_color;
        tick.style.marginLeft = (!params.isVertical) ? (-params.tick_width * 0.5) + "px" : "";
        tick.style.marginBottom = (!params.isVertical) ? (params.track_border_width + params.tick_height*0.5) + "px" : "";
        tick.style.marginTop = (!params.isVertical) ? "" : (-params.tick_height * 0.5) + "px";
        tick.style[(!params.isVertical) ? "top" : "left"] =
            (params[(!params.isVertical) ? "height" : "width"] - params[(!params.isVertical) ? "tick_height" : "tick_width"])*0.5 + "px";
        if (!params.tick_show || i === 0 || i === (tLen-1)) { tick.style.visibility = "hidden"; }
        tickWrap.appendChild(tick);     // append tick to tickWrap

        // update tick label
        tickLabelContain.appendChild(tickLabel);
        updateTickLabel = QStudioAssetFactory.prototype.assetUpdate.label.apply(this, [tickLabelContain, {
            label_trim : true,
            label_font_family : params.secondary_font_family,
            isRTL : params.isRTL,
            label : jQuery.trim(((tickArray[i].label !== undefined) ? tickArray[i].label : tickArray[i]).toString()),
            //  label_width : (!params.isVertical) ? Math.min(params.ticklabel_width, tickSpacing) : params.ticklabel_width,
            label_width : params.ticklabel_width,
            label_halign : (!params.isVertical) ? "center" : "left",
            label_fontsize : params.ticklabel_fontsize,
            label_fontcolor_up : params.ticklabel_fontcolor
        }]);

        // update classNames
        tickLabelContain.className = "qwidget_slider_tick_label_container";
        tickLabel.className = "qwidget_slider_tick_label";
        tickLabel.style.display = ((params.ticklabel_display_type === "show ends" && (i !== 0 && i !== tLen-1))
            || params.ticklabel_display_type === "show none") ? "none" : "block";

        // finish tick label setup
        if (updateTickLabel && tickLabel.style.display !== "none") {
            // append tickLabelContain to tickWrap
            tickWrap.appendChild(tickLabelContain);

            // record tickLabel dimensions
            tickLabelWidth = $(tickLabel).width();
            tickLabelHeight = $(tickLabel).height();

            // for vertical direction, don't let tick label height exceed tickSpacing
            if (params.isVertical && (tickLabelHeight > tickSpacing)) {
                tickLabelContain.style.height = tickSpacing + "px";
                tickLabel.style.height = tickSpacing + "px";
                tickLabel.style.overflow = "hidden";
                tickLabelHeight = tickSpacing;
            }

            // position tickLabelContain; hardcode 2 into offsets so labels don't hug the track
            if (!params.isVertical) {
                tickLabelContain.style.marginTop = (params.track_border_width + params.height + params.ticklabel_offset + 2) + "px";
                tickLabelContain.style.marginLeft = (-tickLabelWidth * 0.5) + "px";
            } else {
                tickLabelContain.style.marginTop = (-tickLabelHeight * 0.5) + "px";
                tickLabelContain.style.marginLeft = (params.track_border_width + params.width + params.ticklabel_offset + 2) + "px";
            }

            // for horizontal sliders we need to calculate the left and right tick label width
            // for vertical sliders we need to calculate the top and bottom tick label height
            if (i == 0) {
                ltTickLabSize = (!params.isVertical) ? tickLabelWidth : tickLabelHeight;
            } else if (i === tLen - 1) {
                rbTickLabSize = (!params.isVertical) ? tickLabelWidth : tickLabelHeight;
            }

            // Calculate max tick label width/height; will use these values later when sizing the slider
            maxTickLabWidth = Math.max(maxTickLabWidth, tickLabelWidth);
            maxTickLabHeight = Math.max(maxTickLabHeight, tickLabelHeight);
        }

        // setup images for imageContain
        if (params.show_img) {
            var imgWrap = doc.createElement("div"),
                imgEle = doc.createElement("img");

            imgWrap.id = "qwidget_slider_imgwrap_" + i;
            imgWrap.appendChild(imgEle);
            cacheNodes.imageContain.appendChild(imgWrap);
            // update imgWrap
            QStudioAssetFactory.prototype.assetUpdate.image.apply(this, [imgWrap, {
                image: tickArray[i].image,
                width: params.img_width,
                height: params.img_height,
                // callback would fire on successful load
                callback_success: function (image) {
                    if (image) {
                        var columnValue = (!params.isVertical && !params.isRTL) ? this._columnValue() : tLen - 1 - this._columnValue(),
                            image_id = parseInt(image.parentNode.id.replace( /^\D+/g, ''), 10);

                        image.parentNode.style.filter = "inherit";
                        image.parentNode.style.left = ((imgContainWidth - $(image).width())*0.5 + params.img_left) + "px";
                        image.parentNode.style.top = ((imgContainHeight - $(image).height())*0.5 + params.img_top) + "px";
                        image.parentNode.style.display = "none";

                        if ((this.isAnswered() || params.show_init_img) && (image_id === columnValue)) {
                            image.parentNode.style.display = "block";
                            this._cache._imgIndex = columnValue;
                        }
                    }
                },
                // callback would fire when an error is encountered
                callback_error: function(image) {
                    if (image && image.parentNode && image.parentNode.nodeType === 1) {
                        image.parentNode.style.filter = "inherit";
                        image.parentNode.removeChild(image);
                    }
                }
            }]);
        }
    }

    // adjust maxTickLabelWidth/maxTickLabHeight to account for offsets
    (!params.isVertical) ?
        maxTickLabHeight += params.ticklabel_offset:
        maxTickLabWidth += params.ticklabel_offset;

    // record max margin offset values
    maxLeftMargin = Math.max(
        (!params.isVertical) ? (ltTickLabSize * 0.5) - params.track_border_width : -1,
            handleMargLeft * -1,
            (handleMargLeft + (handleWidth - handleLabelWidth)*0.5) * -1
    );
    maxRightMargin = Math.max(
        (!params.isVertical) ? (rbTickLabSize * 0.5) - params.track_border_width : maxTickLabWidth,
            handleMargLeft * -1,
            (handleMargLeft + (handleWidth - handleLabelWidth)*0.5) * -1
    );
    maxTopMargin = Math.max(
        (!params.isVertical) ? -1 : (ltTickLabSize * 0.5) - params.track_border_width,
            handleMargTop * -1,
            (handleMargTop - handleLabelHeight) * -1
    );
    maxBotMargin = Math.max(
        (!params.isVertical) ? maxTickLabHeight : (rbTickLabSize * 0.5) - params.track_border_width,
            handleMargTop * -1
    );

    if (maxLeftMargin < 0) { maxLeftMargin = 0; }
    if (maxRightMargin < 0) { maxRightMargin = 0; }
    if (maxTopMargin < 0) { maxTopMargin = 0; }
    if (maxBotMargin < 0) { maxBotMargin = 0; }

    // offset track position
    cacheNodes.track.style.marginLeft = maxLeftMargin + "px";
    cacheNodes.track.style.marginTop = maxTopMargin + "px";

    // set trackContain dimensions
    cacheNodes.trackContain.style.width = ($(cacheNodes.track).outerWidth(true) + maxRightMargin) + "px";
    cacheNodes.trackContain.style.height = ($(cacheNodes.track).outerHeight(true) + maxBotMargin) + "px";
    // see about adding trackContain padding
    cacheNodes.trackContain.style.padding = trackPadding + "px";

    // updating end images
    // we always include end image dimensions as part of the overall trackContain dimensions
    if (params.show_end_img) {
        var leftImage = tickArray[0] ? tickArray[0].image : undefined,
            hasLeftImage = (QUtility.isString(leftImage) && leftImage.length > 0),
            rightImage = tickArray[tickArray.length - 1] ? tickArray[tickArray.length - 1].image : undefined,
            hasRightImage = (QUtility.isString(rightImage) && rightImage.length > 0),
            endImgWidth = (!params.isVertical) ?
                (((hasLeftImage) ? params.end_img_width : 0) + ((hasRightImage) ? params.end_img_width : 0)):
                ((hasLeftImage || hasRightImage) ? params.end_img_width : 0),
            endImgHeight = (params.isVertical) ?
                (((hasLeftImage) ? params.end_img_height : 0) + ((hasRightImage) ? params.end_img_height : 0)):
                ((hasLeftImage || hasRightImage) ? params.end_img_height : 0);

        if (hasLeftImage) {
            cacheNodes.trackContain.appendChild(cacheNodes.ltEndImgContain);
            cacheNodes.ltEndImgContain.style.width = params.end_img_width + "px";
            cacheNodes.ltEndImgContain.style.height = params.end_img_height + "px";

            // update left/top end image
            QStudioAssetFactory.prototype.assetUpdate.image.apply(this, [cacheNodes.ltEndImgContain, {
                image: leftImage,
                width: params.end_img_width,
                height: params.end_img_height,
                // callback would fire on successful load
                callback_success: function () {
                    cacheNodes.ltImgEle.style.marginLeft = ((!params.isVertical) ? -params.end_img_left : params.end_img_left) + "px";
                    cacheNodes.ltImgEle.style.marginTop = ((!params.isVertical) ? params.end_img_top : -params.end_img_top) + "px";
                    cacheNodes.ltImgEle.style.left = (params.end_img_width - $(cacheNodes.ltImgEle).width()) * 0.5 + "px";
                    cacheNodes.ltImgEle.style.top = (params.end_img_height - $(cacheNodes.ltImgEle).height()) * 0.5 + "px";
                },
                // callback would fire when an error is encountered
                callback_error: function () {
                    cacheNodes.ltEndImgContain.removeChild(cacheNodes.ltImgEle);
                }
            }]);
        } else {
            if (cacheNodes.ltEndImgContain.parentNode && cacheNodes.ltEndImgContain.parentNode.nodeType === 1) {
                cacheNodes.ltEndImgContain.parentNode.removeChild(cacheNodes.ltEndImgContain);
            }
        }

        if (hasRightImage) {
            cacheNodes.trackContain.appendChild(cacheNodes.rbEndImgContain);
            cacheNodes.rbEndImgContain.style.width = params.end_img_width + "px";
            cacheNodes.rbEndImgContain.style.height = params.end_img_height + "px";

            // update right/bottom end image
            QStudioAssetFactory.prototype.assetUpdate.image.apply(this, [cacheNodes.rbEndImgContain, {
                image: rightImage,
                width: params.end_img_width,
                height: params.end_img_height,
                // callback would fire on successful load
                callback_success: function () {
                    cacheNodes.rbImgEle.style.marginLeft = params.end_img_left + "px";
                    cacheNodes.rbImgEle.style.marginTop = params.end_img_top + "px";
                    cacheNodes.rbImgEle.style.left = (params.end_img_width - $(cacheNodes.rbImgEle).width())*0.5 + "px";
                    cacheNodes.rbImgEle.style.top = (params.end_img_height - $(cacheNodes.rbImgEle).height())*0.5 + "px";
                },
                // callback would fire when an error is encountered
                callback_error: function() {
                    cacheNodes.rbEndImgContain.removeChild(cacheNodes.rbImgEle);
                }
            }]);
        } else {
            if (cacheNodes.rbEndImgContain.parentNode && cacheNodes.rbEndImgContain.parentNode.nodeType === 1) {
                cacheNodes.rbEndImgContain.parentNode.removeChild(cacheNodes.rbEndImgContain);
            }
        }

        // record trackContain base width and height
        var trackHeight = $(cacheNodes.trackContain).height(),
            trackWidth = $(cacheNodes.trackContain).width();

        // set additional css
        if (!params.isVertical) {
            // if a left image is present...
            if (hasLeftImage) {
                cacheNodes.track.style.left = (params.end_img_width + trackPadding) + "px";
            }

            // if a right image is present...
            if (hasRightImage) {
                cacheNodes.rbEndImgContain.style.left =
                    (((hasLeftImage) ? params.end_img_width : 0) + trackPadding + trackWidth) + "px";
            }

            if (hasLeftImage || hasRightImage) {
                if (params.end_img_height > trackHeight) {
                    cacheNodes.track.style.top = ((params.end_img_height - trackHeight)*0.5 + trackPadding) + "px";
                } else {
                    cacheNodes.ltEndImgContain.style.top = ((trackHeight - params.end_img_height) * 0.5 + trackPadding) + "px";
                    cacheNodes.rbEndImgContain.style.top = cacheNodes.ltEndImgContain.style.top;
                }
            }

            // set trackContain dimensions
            cacheNodes.trackContain.style.width = (endImgWidth + trackWidth) + "px";
            cacheNodes.trackContain.style.height = Math.max(trackHeight, endImgHeight) + "px";
        } else {
            // if a top image is present...
            if (hasLeftImage) {
                cacheNodes.track.style.top = (params.end_img_height + trackPadding) + "px";
            }

            // if a bottom image is present...
            if (hasRightImage) {
                cacheNodes.rbEndImgContain.style.top =
                    (((hasLeftImage) ? params.end_img_height : 0) + trackPadding + trackHeight) + "px";
            }

            if (hasLeftImage || hasRightImage) {
                if (params.end_img_width > trackWidth) {
                    cacheNodes.track.style.left = ((params.end_img_width - trackWidth) * 0.5 + trackPadding) + "px";
                } else {
                    cacheNodes.ltEndImgContain.style.left = ((trackWidth - params.end_img_width) * 0.5 + trackPadding) + "px";
                    cacheNodes.rbEndImgContain.style.left = cacheNodes.ltEndImgContain.style.left;
                }
            }

            // set trackContain dimensions
            cacheNodes.trackContain.style.width = Math.max(trackWidth, endImgWidth) + "px";
            cacheNodes.trackContain.style.height = (endImgHeight + trackHeight) + "px";
        }
    } else {
        // clear any previous track positioning due to end image placement
        cacheNodes.track.style.left = "";
        cacheNodes.track.style.top = "";

        if (cacheNodes.ltEndImgContain.parentNode && cacheNodes.ltEndImgContain.parentNode.nodeType === 1) {
            cacheNodes.ltEndImgContain.parentNode.removeChild(cacheNodes.ltEndImgContain);
        }

        if (cacheNodes.rbEndImgContain.parentNode && cacheNodes.rbEndImgContain.parentNode.nodeType === 1) {
            cacheNodes.rbEndImgContain.parentNode.removeChild(cacheNodes.rbEndImgContain);
        }
    }

    // record track container dimensions (including margin)
    trackContainWidth = $(cacheNodes.trackContain).outerWidth(true);
    trackContainHeight = $(cacheNodes.trackContain).outerHeight(true);

    // set sliderImageWrap dimensions
    cacheNodes.sliderImageWrap.style.width = trackContainWidth + "px";
    cacheNodes.sliderImageWrap.style.height = trackContainHeight + "px";

    // update imageContain
    if (params.show_img) {
        cacheNodes.imageContain.style.width = imgContainWidth + "px";
        cacheNodes.imageContain.style.height = imgContainHeight + "px";
        // append imageContain to sliderImageWrap
        cacheNodes.sliderImageWrap.appendChild(cacheNodes.imageContain);

        // set sliderImageWrap dimensions
        cacheNodes.sliderImageWrap.style.width = (params.img_placement === "left" ||params.img_placement === "right") ?
            (imgContainWidth + trackContainWidth) + "px" : Math.max(trackContainWidth, imgContainWidth) + "px";
        cacheNodes.sliderImageWrap.style.height = (params.img_placement === "left" ||params.img_placement === "right") ?
            Math.max(trackContainHeight, imgContainHeight) + "px": (imgContainHeight + trackContainHeight) + "px";

        // position elements
        cacheNodes.imageContain.style.left = "0";
        cacheNodes.imageContain.style.top = "0";
        cacheNodes.trackContain.style.left = "";
        cacheNodes.trackContain.style.top = "";
        switch (params.img_placement) {
            case "left" :
                cacheNodes.imageContain.style.position = "absolute";
                cacheNodes.trackContain.style.left = imgContainWidth + "px";
                if (params.img_auto_center) {
                    (trackContainHeight < imgContainHeight) ?
                        cacheNodes.trackContain.style.top = (imgContainHeight - trackContainHeight)*0.5 + "px":
                        cacheNodes.imageContain.style.top = (trackContainHeight - imgContainHeight)*0.5 + "px";
                }
                break;
            case "right" :
                cacheNodes.imageContain.style.position = "absolute";
                cacheNodes.imageContain.style.left = trackContainWidth + "px";
                if (params.img_auto_center) {
                    (trackContainHeight < imgContainHeight) ?
                        cacheNodes.trackContain.style.top = (imgContainHeight - trackContainHeight) * 0.5 + "px" :
                        cacheNodes.imageContain.style.top = (trackContainHeight - imgContainHeight) * 0.5 + "px";
                }
                break;
            case "top" :
                cacheNodes.imageContain.style.position = "relative";
                if (params.img_auto_center) {
                    (trackContainWidth < imgContainWidth) ?
                        cacheNodes.trackContain.style.left = (imgContainWidth - trackContainWidth) * 0.5 + "px" :
                        cacheNodes.imageContain.style.left = (trackContainWidth - imgContainWidth) * 0.5 + "px";
                }
                // append imageContain before trackContain in sliderImageWrap
                cacheNodes.sliderImageWrap.insertBefore(cacheNodes.imageContain, cacheNodes.trackContain);
                break;
            case "bottom" :
                cacheNodes.imageContain.style.position = "relative";
                if (params.img_auto_center) {
                    (trackContainWidth < imgContainWidth) ?
                        cacheNodes.trackContain.style.left = (imgContainWidth - trackContainWidth) * 0.5 + "px" :
                        cacheNodes.imageContain.style.left = (trackContainWidth - imgContainWidth) * 0.5 + "px";
                }
                break;
            default :
                break;
        }
    } else {
        if (cacheNodes.imageContain.parentNode && cacheNodes.imageContain.parentNode.nodeType === 1) {
            cacheNodes.imageContain.parentNode.removeChild(cacheNodes.imageContain);
        }
    }

    // update slider label, but do it after you set trackContain dimensions
    updateLabel = QStudioAssetFactory.prototype.assetUpdate.label.apply(this, [cacheNodes.labelContain, {
        label_font_family : params.primary_font_family,
        isRTL : params.isRTL,
        show_label : params.show_label,
        label : params.label,
        label_width : $(cacheNodes.sliderImageWrap).outerWidth() - 10,
        label_padding : 5,
        label_top : 0,
        label_left : 0,
        label_halign :  params.label_halign,
        label_fontsize : params.label_fontsize,
        label_fontcolor_up : params.label_fontcolor
    }]);

    if (updateLabel) {
        // append labelContain to wrap
        (cacheNodes.wrap.firstChild) ?
            cacheNodes.wrap.insertBefore(cacheNodes.labelContain, cacheNodes.wrap.firstChild):
            cacheNodes.wrap.appendChild(cacheNodes.labelContain);

        // labelContain css settings
        cacheNodes.labelContain.style.backgroundColor =
            (params.show_label_background) ? "#" + params.label_background_color : "transparent";
        cacheNodes.labelContain.style.position = "relative";

        // only add border if offsets are not placed on label
        if (params.label_top === 0 && params.label_left === 0) {
            cacheNodes.labelContain.style.borderBottom =
                params.widget_border_width + "px " + params.widget_border_style + " #" + params.widget_border_color;
        } else {
            cacheNodes.labelContain.style.left = params.label_left + "px";
            cacheNodes.labelContain.style.top = params.label_top + "px";
        }

        // record labelContain dimensions
        labelContainWidth = $(cacheNodes.labelContain).outerWidth();
        labelContainHeight = $(cacheNodes.labelContain).outerHeight();
    } else {
        // remove labelContain from wrap
        if (cacheNodes.labelContain.parentNode && cacheNodes.labelContain.parentNode.nodeType === 1) {
            cacheNodes.labelContain.parentNode.removeChild(cacheNodes.labelContain);
        }
    }

    // position handleContain relative to track
    var trackLeft = (!QUtility.isNumber(parseFloat(cacheNodes.track.style.left))) ? trackPadding : parseFloat(cacheNodes.track.style.left),
        trackTop = (!QUtility.isNumber(parseFloat(cacheNodes.track.style.top))) ? trackPadding : parseFloat(cacheNodes.track.style.top);

    cacheNodes.handleContain.style.marginLeft = (trackLeft + maxLeftMargin) + "px";
    cacheNodes.handleContain.style.marginTop = (trackTop + maxTopMargin) + "px";

    // set wrapper dimensions
    cacheNodes.wrap.style.width = cacheNodes.sliderImageWrap.style.width;
    cacheNodes.wrap.style.height = (labelContainHeight + parseFloat(cacheNodes.sliderImageWrap.style.height)) + "px";

    // Set widget dimensions
    widget.id = params.id;
    widget.style.width = cacheNodes.wrap.style.width;
    widget.style.height = cacheNodes.wrap.style.height;
    widget.style.borderWidth = params.widget_border_width + "px";
    widget.style.borderStyle = params.widget_border_style;
    widget.style.borderColor = "#" + params.widget_border_color;

    // Override existing classNames
    cacheNodes.ltEndImgContain.className = "qwidget_slider_left_top_end_image_container";
    cacheNodes.rbEndImgContain.className = "qwidget_slider_right_bottom_end_image_container";
    cacheNodes.track.className = "qwidget_slider_track";
    cacheNodes.highlight.className = "qwidget_slider_highlight";
    cacheNodes.tickContain.className = "qwidget_slider_tick_container";
    cacheNodes.handle.className = "qwidget_slider_handle";
    cacheNodes.handleImageContain.className = "qwidget_slider_handle_image_container";
    cacheNodes.handleLabelContain.className = "qwidget_slider_handle_label_container";
    cacheNodes.handleLabel.className = "qwidget_slider_handle_label";

    // check if we need to re-set slider responses
    if (this._cache.curRangeValue !== undefined) {
        this.isAnswered(true, (params.trackSize * (this._cache.curRangeValue/100)), false);
        delete this._cache.curRangeValue;
    }
};

// LightBox Singleton; z-index 4800
var qLightBoxSingleton = (function () {
    var instance,
        wgtArray = [];

    function QLightBox(parent, configObj) {
        // Create module shell
        var that = this,
            doc = document,
            parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
            lightBox = doc.createElement("div"),
            wrap = doc.createElement("div"),
            overlay = doc.createElement("div"),
            gallery = doc.createElement("div"),
            imgContain = doc.createElement("div"),
            galleryVertHelper = doc.createElement("div"),
            closeBtn = doc.createElement("div"),
            isTouchDevice = QUtility.isTouchDevice(),
            isMSTouch = QUtility.isMSTouch();

        // Container CSS Style
        lightBox.id = "QWidgetLightBox";
        lightBox.dir = "LTR";
        lightBox.className = 'qwidget_lightbox';
        lightBox.style.cssText = "" +
            "position: fixed; " +
            "top: 0px; " +
            "left: 0px; " +
            "margin: 0px; " +
            "padding: 0px; " +
            "width: 100%; " +
            "height: 100%; " +
            "display: none; " +
            "z-index: 4800;";

        // Wrapper CSS Style
        wrap.className = "qwidget_lightbox_wrapper";
        wrap.style.cssText = "" +
            "position: absolute; " +
            "top: 0px; " +
            "left: 0px; " +
            "width: 100%; " +
            "height: 100%; ";

        // Overlay CSS Style
        overlay.className = 'qwidget_lightbox_overlay';
        overlay.style.cssText = "" +
            "position: absolute; " +
            "top: 0px; " +
            "left: 0px; " +
            "width: 100%; " +
            "height: 100%; ";

        // Gallery Container CSS Style
        galleryVertHelper.style.verticalAlign = "middle";
        galleryVertHelper.style.display = "inline-block";
        galleryVertHelper.style.height = "100%";
        gallery.className = 'qwidget_lightbox_gallery';
        gallery.style.cssText = "" +
            "text-align: center; " +
            "opacity: 0; " +
            "width: 100%; " +
            "height: 100%; " +
            "transition: opacity .5s; " +
            "-webkit-transition: opacity .5s; " +
            "position: relative; " +
            "-webkit-user-select: none; " +
            "-khtml-user-select: none; " +
            "-moz-user-select: none; " +
            "-ms-user-select: none; " +
            "user-select: none;";

        // Image Container CSS Style
        imgContain.style.cssText += ';'.concat("position: relative");
        imgContain.style.cssText += ';'.concat("filter: inherit");
        imgContain.style.cssText += ';'.concat("width: auto");
        imgContain.style.cssText += ';'.concat("height: auto;");
        imgContain.style.cssText += ';'.concat("max-width: 95%");
        imgContain.style.cssText += ';'.concat("max-height: 95%");
        imgContain.style.cssText += ';'.concat("display: inline-block");
        imgContain.style.cssText += ';'.concat("vertical-align: middle");
        imgContain.style.cssText += ';'.concat("-webkit-box-sizing: border-box");
        imgContain.style.cssText += ';'.concat("-moz-box-sizing: border-box");
        imgContain.style.cssText += ';'.concat("box-sizing: border-box");
        imgContain.style.backgroundColor = "#F5F5F5";

        // Close Button CSS Style
        closeBtn.className = 'qwidget_lightbox_close_button';
        closeBtn.style.cssText = "" +
            "position: absolute; " +
            "top: 0px; " +
            "right: 0px; " +
            "cursor: pointer;";

        // Append children
        imgContain.appendChild(closeBtn);
        gallery.appendChild(imgContain);
        gallery.appendChild(galleryVertHelper);
        wrap.appendChild(overlay);
        wrap.appendChild(gallery);
        lightBox.appendChild(wrap);
        parentEle.appendChild(lightBox);

        // init core vars
        this._events = {
            resize : "resize.lightbox",
            hover : "mouseenter.lightbox mouseleave.lightbox",
            down : (!isMSTouch) ?
                "mousedown.lightbox touchstart.lightbox" :
                ((window.PointerEvent) ? "pointerdown.lightbox" : "MSPointerDown.lightbox"),
            up : (!isMSTouch) ?
                "mouseup.lightbox touchend.lightbox" :
                ((window.PointerEvent) ? "pointerup.lightbox" : "MSPointerUp.lightbox"),
            move : (!isMSTouch) ?
                "touchmove.lightbox" :
                ((window.PointerEvent) ? "pointermove.lightbox" : "MSPointerMove.lightbox"),
            cancel : (!isMSTouch) ?
                "touchcancel.lightbox" :
                ((window.PointerEvent) ? "pointercancel.lightbox" : "MSPointerCancel.lightbox")
        };
        this._widget = lightBox;
        this._params = {};
        this._cache = {};
        this._cache.nodes = {
            galleryVertHelper: galleryVertHelper,
            wrap: wrap,
            overlay: overlay,
            gallery: gallery,
            imgContain: imgContain,
            closeBtn: closeBtn
        };

        // this will in-turn call the update method to finalize construction
        this.config(configObj);

        // add click/tap event
        $(lightBox).on("click.lightbox", function(event) {
            event.stopPropagation();
            // click handler
            that.hide();
        });
    }
    QLightBox.prototype.initConfigMap = function() {
        if (this._configMap === undefined) {
            this._configMap = {
                overlay_bckgrnd_color : { value: 0x000000, type: "color" },
                overlay_alpha : { value: 83, type: "number", min: 0 },
                gallery_top : { value: 0, type: "number" },
                gallery_left : { value: 0, type: "number" },
                gallery_border_style : { value: 'solid', type: "string", options:['none', 'solid', 'dotted', 'dashed'] },
                gallery_border_width : { value: 2, type: "number", min: 0 },
                gallery_border_color : { value: 0xCCCCCC, type: "color" },
                close_top : { value: 0, type: "number" },
                close_left : { value: 0, type: "number" },
                close_import : { value: "", type: "string" },
                close_width : { value: 45, type: "number", min: 1 },
                close_height : { value: 45, type: "number", min: 1 },
                gallery_padding : { value: 10, type: "number", min: 0 },
                gallery_autosize : { value: true, type: "boolean" },
                gallery_max_width : { value: 500, type: "number", min: 1 },
                gallery_max_height : { value: 500, type: "number", min: 1 },
                action_type : { value: 'click append image', type: "string", options:['click append image', 'click append widget', 'mouseover'] },
                zoom_width : { value: 45, type: "number", min: 1 },
                zoom_height : { value: 45, type: "number", min: 1 },
                zoom_border_width : { value: 1, type: "number", min: 0 },
                zoom_bckgrnd_color : { value: 0xF5F5F5, type: "color" },
                zoom_border_color : { value: 0xCCCCCC, type: "color" },
                zoom_import : { value: "", type: "string" }
            };
        }
    };
    QLightBox.prototype.config = function(value) {
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
                QStudioDCAbstract.prototype.setParams.apply(this, [this._configMap, true]);
            }

            // set custom parameters
            QStudioDCAbstract.prototype.setParams.apply(this, [value]);

            // parameter presets
            if (this._params.gallery_border_style === "none") {
                this._params.gallery_border_width = 0;
            }

            // update widget
            this.update();

            value = null;
            return this;
        }
    };
    QLightBox.prototype.update = function() {
        if (!this._widget) { return false; }
        var params = this._params,
            cacheNodes = this._cache.nodes;

        // update overlay
        $(cacheNodes.overlay).css( {
            "background-color" : '#' + params.overlay_bckgrnd_color,
            "opacity" : params.overlay_alpha * .01
        } );

        // update closeBtn
        $(cacheNodes.closeBtn).css({
            'width' : params.close_width + "px",
            'height' : params.close_height + "px",
            'margin-top' : params.close_top + "px",
            'margin-left' : params.close_left + "px",
            //'margin-left' : (params.close_left - params.close_width) + "px",
            'background-repeat': 'no-repeat',
            'background-position': 'center',
            'background-size': params.close_width + 'px ' + params.close_height + 'px',
            'background-image': (QUtility.ieVersion() < 9) ?
                "url(" + "" + ") " + 'url(' + params.close_import + ')' : 'url(' + params.close_import + ')',
            'filter': "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + params.close_import + ", sizingMethod='scale')"
        });

        cacheNodes.imgContain.style.padding = params.gallery_padding + "px";
        cacheNodes.imgContain.style.border = params.gallery_border_width + "px " + params.gallery_border_style + " #" + params.gallery_border_color;

    };
    QLightBox.prototype.addWgt = function(wgt, configObj, parent) {
        if (!this._widget || !(wgt && wgt instanceof QStudioDCAbstract && wgt.type() !== "slider")) { return false; }
        if (jQuery.inArray(wgt, wgtArray) === -1) {
            configObj = configObj || {};
            configObj.zoom_top = (QUtility.isNumber(configObj.zoom_top)) ? configObj.zoom_top : 0;
            configObj.zoom_left = (QUtility.isNumber(configObj.zoom_left)) ? configObj.zoom_left : 0;
            var that = this,
                params = this._params;

            if (params.action_type !== "mouseover") {
                // Check to see if there is an existing zoomBtn on the widget. If so, update existing one, else create new one
                var doc = document,
                    zoomBtn = (wgt.cache().nodes.zoomBtn) ? wgt.cache().nodes.zoomBtn : doc.createElement("div");

                zoomBtn.className = 'qwidget_lightbox_zoom_button';
                $(zoomBtn).css( {
                    'z-index': 877,
                    'position' : "absolute",
                    'top' : 0,
                    'left' : 0,
                    'width' : params.zoom_width + "px",
                    'height' : params.zoom_height + "px",
                    'border' : params.zoom_border_width + "px solid #" + params.zoom_border_color,
                    'margin-top' : configObj.zoom_top + "px",
                    'margin-left' : configObj.zoom_left + "px",
                    'background-color' : "#" + params.zoom_bckgrnd_color,
                    'background-repeat': 'no-repeat',
                    'background-position': 'center',
                    'background-size': params.zoom_width + 'px ' + params.zoom_height + 'px',
                    'background-image': (QUtility.ieVersion() < 9) ?
                        "url(" + "" + ") " + 'url(' + params.zoom_import + ')' : 'url(' + params.zoom_import + ')',
                    'filter': "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + params.zoom_import + ", sizingMethod='scale')"
                });

                // store reference of wgt in wgtArray
                wgtArray.push(wgt);

                // store zoombtn reference on widget cache.nodes
                wgt.cache().nodes.zoomBtn = zoomBtn;

                // append zoombtn to widget
                if (!parent) {
                    (params.action_type === "click append widget") ?
                        wgt.cache().nodes.background.appendChild(zoomBtn):       // Append zoom button to background
                        wgt.cache().nodes.imageContain.appendChild(zoomBtn);     // Append zoom button to imageContain
                } else {
                    parent.appendChild(zoomBtn);     // Append zoom button to passed parent
                }

                // helper function for zoomBtn event
                var cleanup = function() {
                    // remove all possible events for zoomBtn
                    $(zoomBtn).off(that._events.cancel);
                    $(zoomBtn).off(that._events.up);
                    $(doc.body).off(that._events.move);
                    $(doc.body).off(that._events.up);
                };

                // add click/tap event
                $(zoomBtn).on(that._events.down, function(event) {
                    event.stopPropagation();
                    if ((!wgt.enabled() && !wgt.cache()._enableExtEvt) || wgt.isDrag()) { return; }
                    if (event.type === "mousedown" || event.type === "touchstart" || event.type === "pointerdown" || event.type === "MSPointerDown") {
                        var startX = (event.originalEvent.touches) ? event.originalEvent.touches[0].clientX : null,
                            startY = (event.originalEvent.touches) ? event.originalEvent.touches[0].clientY : null;

                        if (startX !== null && startY !== null) {
                            // touchcancel event
                            $(zoomBtn).on(that._events.cancel, function(event) {
                                event.stopPropagation();
                                cleanup();
                            });

                            // touchmove event
                            $(doc.body).on(that._events.move, function(event) {
                                event.stopPropagation();
                                cleanup();
                            });
                        } else {
                            $(doc.body).on(that._events.up, function(event) {
                                event.preventDefault();
                                event.stopPropagation();
                                cleanup();
                            });
                        }

                        // touchend event
                        $(zoomBtn).on(that._events.up, function(event) {
                            event.stopPropagation();
                            var eventType = event.type.toLowerCase();
                            if (eventType.indexOf("pointerup") !== -1 || eventType === "mouseup") {
                                cleanup();

                                // click handler
                                that.show(wgt);
                            }
                        });
                    }
                });

                return zoomBtn;
            } else {
                wgt.addEvent(wgt.widget(), this._events.hover, function(event) {
                    event.stopPropagation();
                    if (wgt.isDrag()) { return false; }
                    (event.type === "mouseenter") ?
                        that.show(wgt) : that.hide();
                });
            }
        }
    };
    QLightBox.prototype.removeWgt = function(wgt) {
        if (!this._widget || !(wgt && wgt instanceof QStudioDCAbstract && wgt.type() !== "slider")) { return false; }
        // If zoom button is present remove click event, else remove hover event from widget
        var spliceIndex = jQuery.inArray(wgt, wgtArray);
        if (spliceIndex !== -1) {
            var zoomBtn = wgt.cache().nodes.zoomBtn;
            if (zoomBtn) {
                $(zoomBtn).off(this._events.down);
                zoomBtn.parentNode.removeChild(zoomBtn);
                delete wgt.cache().nodes.zoomBtn;
            } else {
                wgt.removeEvent(wgt.widget(), this._events.hover);
            }

            wgtArray.splice(spliceIndex, 1);
        }
    };
    QLightBox.prototype.show = function(wgt) {
        if (!this._widget || !(QUtility.isString(wgt.config().image) && jQuery.trim(wgt.config().image).length !== 0)) { return false; }

        var doc = document,
            lightBox = this._widget,
            params = this._params,
            cacheNodes = this._cache.nodes,
            img = document.createElement("img"),
            isActionMouseOver = (params.action_type === "mouseover");

        // if mouseover event no need to display overlay and close button
        //cacheNodes.overlay.style.display = (!isActionMouseOver) ? "block" : "none";
        //cacheNodes.closeBtn.style.display = (!isActionMouseOver) ? "block" : "none";

        // remove previous image from container
        var images = cacheNodes.imgContain.getElementsByTagName('img');
        for (var i = 0, image; image = images[i]; i++) {
            cacheNodes.imgContain.removeChild(image);
        }

        // prevent scrolling
        this._cache._bodyStyle = {
            bodyOverflow: doc.body.style.overflow,
            bodyHeight: doc.body.style.height
        };

        //var top = (doc.documentElement && doc.documentElement.scrollTop) || doc.body.scrollTop;
        //lightBox.style.marginTop = top + "px";
        $(doc).on("touchmove.qlightbox", function(event){ event.preventDefault(); });
        doc.documentElement.style.overflow = "hidden";
        doc.body.style.overflow = "hidden";
        doc.body.style.height = "100%";

        // image css style
        img.style.cssText += ';'.concat("filter: inherit");
        img.style.cssText += ';'.concat("width: auto");
        img.style.cssText += ';'.concat("height: auto;");
        img.style.cssText += ';'.concat("max-width: 100%");
        img.style.cssText += ';'.concat("max-height: 100%");
        img.src = wgt.config().image;

        // at this stage image complete will always be true so need to load
        // append new image
        (cacheNodes.imgContain.firstChild) ?
            cacheNodes.imgContain.insertBefore(img, cacheNodes.imgContain.firstChild):
            cacheNodes.imgContain.appendChild(img);

        // position gallery image and fade in
        lightBox.style.display = "block";
        setTimeout(function() {
            cacheNodes.gallery.style.opacity = 1;
        }, 0);
    };
    QLightBox.prototype.hide = function() {
        if (!this._widget || this._widget.style.display === 'none') { return false; }
        this._widget.style.display = "none";
        this._cache.nodes.gallery.style.opacity = "0";
        var doc = document;
        doc.documentElement.style.overflow = "";
        doc.body.style.overflow = this._cache._bodyStyle.bodyOverflow;
        doc.body.style.height = this._cache._bodyStyle.bodyHeight;
        $(doc).off("touchmove.qlightbox");
        delete this._cache._bodyStyle;
    };
    QLightBox.prototype.resize = function() {
        if (!this._widget || this._widget.style.display === 'none') { return false; }
        // deprecated
    };
    QLightBox.prototype.center = function() {
        if (!this._widget || this._widget.style.display === 'none') { return false; }
        // deprecated
    };
    QLightBox.prototype.widget = function() {
        return this._widget;
    };

    return {
        getInstance: function(parent, configObj) {
            if (instance === undefined) {
                instance = new QLightBox(parent, configObj);
            } else {
                if (typeof configObj === 'object') {
                    instance.config(configObj);
                }
            }

            return instance;
        },
        destroy: function() {
            if (instance === undefined) { return false; }

            // Remove event listeners
            $(instance._widget).off(instance._events.down);
            $(window).off(instance._events.resize);

            // Remove module
            instance._widget.parentNode.removeChild(instance._widget);

            // remove all instances of zoom button OR events from registered widgets
            while(wgtArray.length) {
                instance.removeWgt(wgtArray[0]);
            }

            // GC
            instance = undefined;
        }
    }
}());

// Tooltip Singleton; z-index 4000
var qToolTipSingleton = (function () {
    var instance,
        wgtArray = [];

    function QToolTip(parent, configObj) {
        // Create module shell
        var doc = document,
            parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
            toolTip = doc.createElement("div");

        // Tooltip CSS Style
        toolTip.id = "QWidgetTooltip";
        toolTip.className = 'qwidget_tooltip';
        toolTip.style.position = "absolute";
        toolTip.style.marginLeft = "-10px";
        toolTip.style.whiteSpace = "normal";
        toolTip.style.wordWrap = "break-word";
        toolTip.style.padding = "4px";
        toolTip.style.display = "none";
        toolTip.style.zIndex = 4000;
        toolTip.style.MozBoxShadow =
            toolTip.style.webkitBoxShadow =
                toolTip.style.boxShadow = '1px 1px 8px #333';
        toolTip.style.cssText += ';'.concat(
                "pointer-events: none; " +
                "-webkit-user-select: none; " +
                "-khtml-user-select: none; " +
                "-moz-user-select: none; " +
                "-ms-user-select: none; " +
                "user-select: none;"
        );

        // Append toolTip
        parentEle.appendChild(toolTip);

        // init core vars
        this._events = {
            mouseenter : "mouseenter.tooltip",
            mousemove : "mousemove.tooltip",
            mouseleave : "mouseleave.tooltip"

        };
        this._widget = toolTip;
        this._params = {};

        // this will in-turn call the update method to finalize construction
        this.config(configObj);

    }
    QToolTip.prototype.initConfigMap = function() {
        if (this._configMap === undefined) {
            this._configMap = {
                primary_font_family : { value: "", type: "string" },
                isRTL : { value: false, type: "boolean" },
                tooltip_bckgrnd_color : { value: 0xF5F5F5, type: "color" },
                tooltip_border_width : { value: 2, type: "number", min: 0 },
                tooltip_border_color : { value: 0xCCCCCC, type: "color" },
                tooltip_fontsize : { value: 16, type: "number", min: 5 },
                tooltip_fontcolor : { value: 0x333333, type: "color" },
                tooltip_halign : { value: 'left', type: "string", options:['left', 'center', 'right'] },
                tooltip_width : { value: 150, type: "number", min: 1 }
            };
        }
    };
    QToolTip.prototype.config = function(value) {
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
                QStudioDCAbstract.prototype.setParams.apply(this, [this._configMap, true]);
            }

            // set custom parameters
            QStudioDCAbstract.prototype.setParams.apply(this, [value]);

            // update widget
            this.update();

            value = null;
            return this;
        }
    };
    QToolTip.prototype.update = function() {
        if (!this._widget) { return false; }
        var params = this._params,
            toolTip = this._widget;

        toolTip.dir = (!params.isRTL) ? "LTR" : "RTL";
        toolTip.style.border = params.tooltip_border_width + 'px solid #' + params.tooltip_border_color;
        toolTip.style.backgroundColor = '#' + params.tooltip_bckgrnd_color;
        toolTip.style.width = params.tooltip_width + 'px';
        toolTip.style.fontFamily = params.primary_font_family;
        toolTip.style.textAlign = (!params.isRTL) ? params.tooltip_halign : (params.tooltip_halign !== "left") ? params.tooltip_halign : "";
        toolTip.style.fontSize = QUtility.convertPxtoEM(params.tooltip_fontsize) + "em";
        toolTip.style.color = '#' + params.tooltip_fontcolor;
    };
    QToolTip.prototype.addWgt = function(wgt) {
        if (!this._widget || !(wgt && wgt instanceof QStudioDCAbstract && wgt.type() !== "slider")) { return false; }
        if (jQuery.inArray(wgt, wgtArray) === -1) {
            var that = this,
                toolTip = this._widget,
                description = jQuery.trim(wgt.config().description);

            // add tooltip event for widget
            if (description !== "") {
                // record reference of wgt in wgtArray
                wgtArray.push(wgt);

                // mouseenter event
                wgt.addEvent(wgt.widget(), this._events.mouseenter, function(event) {
                    if (wgt.isDrag() || (!wgt.enabled() && !wgt.cache()._enableExtEvt)) {
                        that.hide();
                        return false;
                    }

                    $(toolTip).html(description);
                    toolTip.style.top = event.pageY + "px";
                    toolTip.style.left = event.pageX + "px";
                    if (toolTip.style.display === "none") {
                        toolTip.style.display = "block";
                        toolTip.style.width = "auto";
                        if ($(toolTip).width() >= that._params.tooltip_width) { toolTip.style.width = that._params.tooltip_width + "px"; }
                        toolTip.style.marginTop = (-$(toolTip).outerHeight() - 10) + "px";
                    }

                    // mousemove event
                    $(wgt.widget()).on(that._events.mousemove, function(event) {
                        if (wgt.isDrag() || (!wgt.enabled() && !wgt.cache()._enableExtEvt)) {
                            $(wgt.widget()).off(that._events.mousemove);
                            $(wgt.widget()).off(that._events.mouseleave);
                            that.hide();
                            return false;
                        }

                        toolTip.style.top = event.pageY + "px";
                        toolTip.style.left = event.pageX + "px";
                    });

                    // mouseleave event
                    $(wgt.widget()).on(that._events.mouseleave, function() {
                        $(wgt.widget()).off(that._events.mousemove);
                        $(wgt.widget()).off(that._events.mouseleave);
                        that.hide();
                    });

                });
            }
        }
    };
    QToolTip.prototype.removeWgt = function(wgt) {
        if (!this._widget || !(wgt && wgt instanceof QStudioDCAbstract && wgt.type() !== "slider")) { return false; }
        var spliceIndex = jQuery.inArray(wgt, wgtArray);
        if (spliceIndex !== -1) {
            // remove tooltip event from widget & wgtArray
            wgt.removeEvent(wgt.widget(), this._events.mouseenter);
            wgtArray.splice(spliceIndex, 1);

        }
    };
    QToolTip.prototype.hide = function() {
        if (!this._widget || (this._widget.style.display === "none")) { return false; }
        var toolTip = this._widget;
        toolTip.style.display = "none";
        toolTip.style.top = "";
        toolTip.style.left = "";
        toolTip.style.marginTop = "";
        $(toolTip).html("");
        return true;
    };
    QToolTip.prototype.widget = function() {
        return this._widget;
    };

    return {
        getInstance: function(parent, configObj) {
            if (instance === undefined) {
                instance = new QToolTip(parent, configObj);
            } else {
                if (typeof configObj === 'object') {
                    instance.config(configObj);
                }
            }

            return instance;
        },
        destroy: function() {
            if (instance === undefined) { return false; }

            // Remove module
            instance._widget.parentNode.removeChild(instance._widget);

            // remove all events from registered widgets
            while(wgtArray.length) {
                instance.removeWgt(wgtArray[0]);
            }

            // GC
            instance = undefined;
        }
    }
}());

// Message Display Singleton; z-index 3000
var qMsgDisplaySingleton = (function () {
    var instance;

    function QMsgDisplay(configObj) {
        // Create module shell
        var doc = document,
            msgEle = doc.createElement('div'),
            msgLabel = doc.createElement('label'),
            arrwOuter = doc.createElement('div'),
            arrwInner = doc.createElement('div');

        // Message CSS Style
        msgEle.id = 'QWidgetErrorMsg';
        msgEle.className = 'qwidget_message_display';
        msgEle.style.position = "absolute";
        msgEle.style.display = "none";
        msgEle.style.padding = "4px";
        msgEle.style.border = "1px solid #AAA";
        msgEle.style.backgroundColor = "#FFFFFF";
        msgEle.style.zIndex = 3000;
        msgEle.style.wordWrap = "break-word";
        msgEle.style.MozBoxShadow =
            msgEle.style.webkitBoxShadow =
                msgEle.style.boxShadow = '1px 1px 8px #333';

        // Message Label CSS Style
        msgLabel.style.whiteSpace = "normal";

        // Outer Carrot CSS Style
        arrwOuter.style.cssText =
            "position: absolute; " +
            "top: " + ((QUtility.ieVersion() !== 7) ? '-12px;' : '-27px;') + " left: 5px; " +
            "border-width: 0 12px 12px; " +
            "border-style: solid; " +
            "border-color: #AAA transparent; " +
            "width: 0;";

        // Inner Carrot CSS Style
        arrwInner.style.cssText =
            "position: absolute; " +
            "top: " + ((QUtility.ieVersion() !== 7) ? '-11px;' : '-26px;') + " left: 6px; " +
            "border-width: 0 11px 11px; " +
            "border-style: solid; " +
            "border-color: #FFF transparent; " +
            "width: 0;";

        // Append children
        msgEle.appendChild(msgLabel);
        msgEle.appendChild(arrwOuter);
        msgEle.appendChild(arrwInner);

        // init core vars
        this._widget = msgEle;
        this._params = {};
        this._cache = {};
        this._cache.isShowing = false;

        // this will in-turn call the update method to finalize construction
        this.config(configObj);
    }
    QMsgDisplay.prototype.initConfigMap = function() {
        if (this._configMap === undefined) {
            this._configMap = {
                primary_font_family : { value: "", type: "string" },
                isRTL : { value: false, type: "boolean" },
                errormsg_fontsize : { value: 16, type: "number", min: 5 },
                errormsg_fontcolor : { value: 0xFF0000, type: "color" },
                errormsg_halign : { value: 'left', type: "string", options:['left', 'center', 'right'] },
                errormsg_width : { value: 150, type: "number", min: 1 }
            };
        }
    };
    QMsgDisplay.prototype.config = function(value) {
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
                QStudioDCAbstract.prototype.setParams.apply(this, [this._configMap, true]);
            }

            // set custom parameters
            QStudioDCAbstract.prototype.setParams.apply(this, [value]);

            // update widget
            this.update();

            value = null;
            return this;
        }
    };
    QMsgDisplay.prototype.update = function() {
        if (!this._widget) { return false; }
        var params = this._params,
            msgEle = this._widget;

        msgEle.dir = (!params.isRTL) ? "LTR" : "RTL";
        msgEle.style.width = params.errormsg_width + 'px';
        msgEle.style.fontFamily = params.primary_font_family;
        msgEle.style.fontSize = QUtility.convertPxtoEM(params.errormsg_fontsize) + 'em';
        msgEle.style.color = '#' + params.errormsg_fontcolor;
        msgEle.style.textAlign = (!params.isRTL) ? params.errormsg_halign : (params.errormsg_halign !== "left") ? params.errormsg_halign : "";
    };
    QMsgDisplay.prototype.show = function(text, target, left, top) {
        if (!this._widget || !((QUtility.isString(text) && text.length > 0) && (target && target.nodeType === 1))) { return false; }
        left = (QUtility.isNumber(left)) ? left : 10;
        top = (QUtility.isNumber(top)) ? top : $(target).outerHeight();
        var msgEle = this._widget,
            msgLabel = msgEle.firstChild;

        if (msgEle.style.display === 'none' || $(msgLabel).html() !== text) {
            if (msgEle.parentNode !== target) { target.appendChild(msgEle); }
            $(msgLabel).html(text);
            msgEle.style.left = left + "px";
            msgEle.style.top = top + "px";
            msgEle.style.display = "block";
            msgEle.style.width = this._params.errormsg_width + 'px';
            msgLabel.style.width = "auto";
            var labelWidth = $(msgLabel).width();
            (labelWidth >= this._params.errormsg_width) ?
                msgLabel.style.width = this._params.errormsg_width + "px":
                msgEle.style.width = labelWidth + "px";

            this._cache.isShowing = true;
            return true;
        }

        return false;
    };
    QMsgDisplay.prototype.hide = function() {
        if (!this._widget || (this._widget.style.display === "none")) { return false; }
        var msgEle = this._widget,
            msgLabel = msgEle.firstChild;

        msgEle.style.display = "none";
        $(msgLabel).html("");
        if (msgEle.parentNode && msgEle.parentNode.nodeType === 1) { msgEle.parentNode.removeChild(msgEle); }
        this._cache.isShowing = false;
        return true;
    };
    QMsgDisplay.prototype.isShowing = function() {
        return this._cache.isShowing;
    };
    QMsgDisplay.prototype.widget = function() {
        return this._widget;
    };

    return {
        getInstance: function(configObj) {
            if (instance === undefined) {
                instance = new QMsgDisplay(configObj);
            } else {
                if (typeof configObj === 'object') {
                    instance.config(configObj);
                }
            }

            return instance;
        },
        destroy: function() {
            if (instance === undefined) { return false; }

            // Remove module
            instance._widget.parentNode.removeChild(instance._widget);

            // GC
            instance = undefined;
        }
    }
}());