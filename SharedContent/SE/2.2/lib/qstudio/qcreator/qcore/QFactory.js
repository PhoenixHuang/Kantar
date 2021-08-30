var console = window.console || { log: function() {} };
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
