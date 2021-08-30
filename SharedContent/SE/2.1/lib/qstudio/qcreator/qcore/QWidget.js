/**
 * QWidget Javascript File
 * Version : 1.3.0
 * Date : 2014-07-14
 *
 * Constructs the following widgets...
 * - Button Widgets
 *   1. BaseBtn
 *   2. TextBtn
 *   3. RadioCheckBtn
 *   4. BaseFlagBtn
 *   5. KantarBaseBtn
 *   6. BaseInputBtn
 *   7. KantarInputBtn
 *
 * - Bucket Widgets
 *   1. BaseBucket
 *
 * - Slider Widgets
 *   1. BaseSlider
 *
 * - Dropdown Widget
 *
 * - Feature Modules
 *   1. Lightbox
 *   2. Tooltip
 *   3. MsgDisplay
 *
 * Release 1.2.0
 * - Made adjustments so Decipher/Dimensions RTL settings don’t interfere w/ a widget’s look and feel.
 * - Fixed sizing bug when buckets were set to grow
 * - Converted all label fontSize from px to em
 * - Updated MSPointer events per http://msdn.microsoft.com/en-us/library/dn304886(v=vs.85).aspx
 * - Changed BaseSlider track events to work better w/ touch scrolling
 * - Removed navigation feature from Lightbox
 * - Fixed bug w/ QBaseInputBtn and QKantarInputBtn widgets where the keyup event wasn't firing on Android
 *   devices when backspace was pressed. This was interfering w/ unanswering the widget.
 *
 * Release 1.3.0
 * - Added new parameter max_char to input widgets to limit textarea characters. A number >= 1 is valid. Setting to 0 will remove the restriction.
 * - Added new parameter bckgrnd_import_sprite so users can use an image sprite to set the button backgrounds. Does not apply to KantarBase button and Text button widgets
 * - Amended QBaseFlagBtn widget. It now uses QBaseBtn or QTextBtn for the button widget.
 * - Amended QBaseBtn and QTextBtn widget regarding label overflow. Overflow will now be hidden whereas before it was visible.
 *
 */


/**
 * QStudio DC Abstract
 */

function QStudioDCAbstract() {
    // Do not instantiate. Subclasses should inherit from QStudioDCAbstract.
}
QStudioDCAbstract.prototype = {
    init: function() {
        if (!this._widget) {
            this._widget = null;
            this._params = {};
            this._cache = {};
        }
    },

    // Returns widget element
    widget: function() {
        return this._widget;
    },

    // Returns config object which represents widget parameters
    config: function() {
        return this._params;
    },

    // Returns cache object
    cache: function() {
        return this._cache;
    },

    // Returns widget type (i.e. button, bucket, slider, etc.)
    type: function() {
        return "";
    },

    destroy: function() {
        if (!this.widget()) { return false; }
        var widget = this.widget(),
            zoomBtn = this.cache().nodes.zoomBtn,
            lightBoxInstance = QBaseLightBox.getInstance();

        // Remove events
        this.removeEvent(widget);

        // Remove widget and zoomBtn (if present)
        if (widget.parentNode) { widget.parentNode.removeChild(widget); }
        if (zoomBtn && lightBoxInstance) { lightBoxInstance.remove(this); }

        // GC
        this._widget = null;
        this._params = {};
        this._cache = {};

        return this;
    },

    // Acts as both setter/getter
    rowIndex: function(value) {
        if (!this.widget()) { return -1; }
        var params = this.config();
        if (value >= 0) { params.rowIndex = value; }
        return params.rowIndex;
    },

    // Acts as both setter/getter
    colIndex: function(value) {
        if (!this.widget()) { return -1; }
        var params = this.config();
        if (value >= 0) { params.colIndex = value; }
        return params.colIndex;
    },

    // Acts as both setter/getter
    isDrag: function fnIsDrag(value) {
        if (!fnIsDrag.dragBool) { fnIsDrag.dragBool = false; }
        if (typeof value === 'boolean' && fnIsDrag.dragBool !== value) {
            fnIsDrag.dragBool = value;
            if (value && QBaseToolTip.getInstance()) { QBaseToolTip.getInstance().hide(); }
        }

        return fnIsDrag.dragBool;
    },

    // Acts as both setter/getter
    isTouchMove: function fnIsTouchMove(value) {
        if (!fnIsTouchMove.touchBool) { fnIsTouchMove.touchBool = false; }
        if (typeof value === 'boolean' && fnIsTouchMove.touchBool !== value) {
            fnIsTouchMove.touchBool = value;
        }

        return fnIsTouchMove.touchBool;
    },

    addEvent: function(elem, type, fn) {
        if (!this.widget()) { return false; }
        if ((elem && elem.nodeType === 1) && (typeof type === 'string') && (typeof fn === 'function')) {
            var cache = this.cache(),
                types = type.split(" "),
                uniqueElem = false;

            // utility function
            var isElemUnique = function(t) {
                if (cache.handlers[t]) {
                    var handlers = cache.handlers[t],
                        len = handlers.length;

                    for (var n = 0; n < len; n++) {
                        if (handlers[n].elem === elem) {
                            return false;
                        }
                    }

                    return true;
                }
            };

            // utility function
            var addType = function(t) {
                var _namespace = (t.indexOf(".") !== -1) ? t.substr(t.indexOf(".")+1, t.length) : null;

                if (!cache.nextGuid) { cache.nextGuid = 1; }
                if (!cache.handlers) { cache.handlers = {}; }
                if (!cache.handlers[t]) { cache.handlers[t] = []; }
                if (!fn.guid) { fn.guid = cache.nextGuid++; }
                if (_namespace !== null && !cache.handlers[_namespace]) { cache.handlers[_namespace] = []; }

                uniqueElem = isElemUnique(t);
                cache.handlers[t].push({
                    elem: elem,
                    fn: fn
                });

                if (!cache.dispatcher) {
                    cache.dispatcher = function (type, event) {
                        var handlers = cache.handlers[type];
                        if (handlers) {
                            for (var n = 0; n < handlers.length; n++) {
                                if (handlers[n].elem === this) {
                                    handlers[n].fn.call(this, event);
                                }
                            }
                        }
                    };
                }

                if ((cache.handlers[t].length === 1) || uniqueElem) {
                    $(elem).on(t, jQuery.proxy(cache.dispatcher, elem, t));
                }
            };

            if (types.length > 1) {
                while (types.length !== 0) {
                    addType(types[0]);
                    types.shift();
                }
            } else {
                addType(type);
            }
        }
    },

    removeEvent: function(elem, type, fn) {
        if (!this.widget()) { return false; }
        if (!(elem && elem.nodeType === 1)) {  return false; }
        if (!this.cache().handlers) { return false; }
        var cache = this.cache();

        // utility function
        var isEmpty = function(object) {
            for (var prop in object) { return false; }
            return true;
        };

        // utility function
        var cleanUp = function(ele, t) {
            var handlers = cache.handlers[t];

            if (handlers) {
                for (var n = 0; n < handlers.length; n++) {
                    if (handlers[n].elem === ele) {
                        $(ele).off(t, jQuery.proxy(cache.dispatcher, elem, t));
                        handlers.splice(n--, 1);
                    }
                }
            }

            if (handlers.length === 0) {
                delete cache.handlers[type];
            }

            if (isEmpty(cache.handlers)) {
                delete cache.handlers;
                delete cache.dispatcher;
            }
        };

        // utility function
        var removeType = function(t) {
            cleanUp(elem,t);
        };

        if (!type) {
            for (var t in cache.handlers) {
                if (cache.handlers.hasOwnProperty(t)) {
                    removeType(t);
                }
            }
            return;
        }

        var types = type.split(" "),
            handlers = null;

        if (types.length > 1) {
            while (types.length !== 0) {
                if (cache.handlers) {
                    handlers = cache.handlers[types[0]];
                    if (handlers && !fn) {
                        removeType(types[0]);
                    }
                }
                types.shift();
            }
            if (!fn) { return; }
        } else {
            handlers = cache.handlers[type];
            if (!handlers) { return; }
            if (!fn) {
                removeType(type);
                return;
            }
        }

        if (fn.guid) {
            for (var n = 0; n < handlers.length; n++) {
                if (handlers[n].guid === fn.guid) {
                    handlers.splice(n--, 1);
                }
            }
        }

        cleanUp(elem, type);
    }
};

/**
 * QStudio Button Abstract --> Extends QStudioDCAbstract
 */
function QStudioBtnAbstract() {
    // Do not instantiate. Subclasses should inherit from QStudioBtnAbstract.
}
QStudioBtnAbstract.prototype = new QStudioDCAbstract();
QStudioBtnAbstract.prototype.config = function(value) {
    if (!this.widget()) { return null; }
    if (typeof value !== 'object') {
        return this._params;
    }

    // Holds a record of option based parameters
    if (typeof this._params_restrict === "undefined") {
        this._params_restrict = {};
    }

    // Set parameters
    this._params.id = (typeof value.id === 'string') ? value.id : (this._params.id || "QWidgetBtn");
    this._params.label = (typeof value.label === 'string') ? value.label : (this._params.label || "");
    this._params.description = (typeof value.description === 'string') ? value.description : (this._params.description || "");
    this._params.image = (typeof value.image === 'string') ? value.image : (this._params.image || "");
    this._params.rowIndex = (parseInt(value.rowIndex, 10) >= 0) ? parseInt(value.rowIndex, 10) :
        ((typeof this._params.rowIndex === 'number') ? this._params.rowIndex : null);
    this._params.colIndex = (parseInt(value.colIndex, 10) >= 0) ? parseInt(value.colIndex, 10) :
        ((typeof this._params.colIndex === 'number') ? this._params.colIndex : null);
    this._params.isRadio = (typeof value.isRadio !== 'undefined') ? !!value.isRadio :
        ((typeof this._params.isRadio === 'boolean') ? this._params.isRadio : false);
    this._params.isRTL = (typeof value.isRTL !== 'undefined') ? !!value.isRTL :
        ((typeof this._params.isRTL === 'boolean') ? this._params.isRTL : false);
    this._params.width = (parseInt(value.width, 10) >= 10) ? parseInt(value.width, 10) : (this._params.width || 100);
    this._params.height = (parseInt(value.height, 10) >= 10) ? parseInt(value.height, 10) : (this._params.height || 100);
    this._params.padding = (parseInt(value.padding, 10) >= 0) ? parseInt(value.padding, 10) :
        ((typeof this._params.padding === 'number') ? this._params.padding : 5);
    this._params.border_style = (function(that) {
        if (typeof value.border_style === 'string') {
            value.border_style = value.border_style.toLowerCase();
            if (value.border_style === 'solid' ||
                value.border_style === 'none' ||
                value.border_style === 'dotted' ||
                value.border_style === 'dashed') {
                that._params_restrict.border_style = value.border_style;
            }
        }
        return (that._params_restrict.border_style || 'solid');
    }(this));
    this._params.border_width_up = (parseInt(value.border_width_up, 10) >= 0) ? parseInt(value.border_width_up, 10) :
        ((typeof this._params.border_width_up === 'number') ? this._params.border_width_up : 1);
    this._params.border_width_over = (parseInt(value.border_width_over, 10) >= 0) ? parseInt(value.border_width_over, 10) :
        ((typeof this._params.border_width_over === 'number') ? this._params.border_width_over : 1);
    this._params.border_width_down = (parseInt(value.border_width_down, 10) >= 0) ? parseInt(value.border_width_down, 10) :
        ((typeof this._params.border_width_down === 'number') ? this._params.border_width_down : 1);
    if (this._params.border_style === "none") {
        this._params.border_width_up = 0;
        this._params.border_width_over = 0;
        this._params.border_width_down = 0;
    }
    this._params.border_radius = (parseInt(value.border_radius, 10) >= 0) ? parseInt(value.border_radius, 10) :
        ((typeof this._params.border_radius === 'number') ? this._params.border_radius : 0);
    this._params.border_color_up = QUtility.paramToHex(value.border_color_up) ||
        ((typeof this._params.border_color_up === 'string') ? this._params.border_color_up : 'CCCCCC');
    this._params.border_color_over = QUtility.paramToHex(value.border_color_over) ||
        ((typeof this._params.border_color_over === 'string') ? this._params.border_color_over : 'CCCCCC');
    this._params.border_color_down = QUtility.paramToHex(value.border_color_down) ||
        ((typeof this._params.border_color_down === 'string') ? this._params.border_color_down : 'CCCCCC');
    this._params.show_bckgrnd = (typeof value.show_bckgrnd !== 'undefined') ? !!value.show_bckgrnd :
        ((typeof this._params.show_bckgrnd === 'boolean') ? this._params.show_bckgrnd : true);
    this._params.show_bckgrnd_import = (typeof value.show_bckgrnd_import !== 'undefined') ? !!value.show_bckgrnd_import :
        ((typeof this._params.show_bckgrnd_import === 'boolean') ? this._params.show_bckgrnd_import : false);
    this._params.bckgrnd_color_up = QUtility.paramToHex(value.bckgrnd_color_up) ||
        ((typeof this._params.bckgrnd_color_up === 'string') ? this._params.bckgrnd_color_up : 'F5F5F5');
    this._params.bckgrnd_color_over = QUtility.paramToHex(value.bckgrnd_color_over) ||
        ((typeof this._params.bckgrnd_color_over === 'string') ? this._params.bckgrnd_color_over : 'CCCCCC');
    this._params.bckgrnd_color_down = QUtility.paramToHex(value.bckgrnd_color_down) ||
        ((typeof this._params.bckgrnd_color_down === 'string') ? this._params.bckgrnd_color_down : 'EEEEEE');
    this._params.bckgrnd_import_up = (typeof value.bckgrnd_import_up === 'string') ? value.bckgrnd_import_up : (this._params.bckgrnd_import_up || "");
    this._params.bckgrnd_import_over = (typeof value.bckgrnd_import_over === 'string') ? value.bckgrnd_import_over : (this._params.bckgrnd_import_over || "");
    this._params.bckgrnd_import_down = (typeof value.bckgrnd_import_down === 'string') ? value.bckgrnd_import_down : (this._params.bckgrnd_import_down || "");
    this._params.bckgrnd_import_sprite = (typeof value.bckgrnd_import_sprite === 'string') ? value.bckgrnd_import_sprite : (this._params.bckgrnd_import_sprite || "");
    this._params.img_top = (Math.abs(parseInt(value.img_top, 10)) >= 0) ? parseInt(value.img_top, 10) :
        ((typeof this._params.img_top === 'number') ? this._params.img_top : 0);
    this._params.img_left = (Math.abs(parseInt(value.img_left, 10)) >= 0) ? parseInt(value.img_left, 10) :
        ((typeof this._params.img_left === 'number') ? this._params.img_left : 0);
    this._params.show_stamp = (typeof value.show_stamp !== 'undefined') ? !!value.show_stamp :
        ((typeof this._params.show_stamp === 'boolean') ? this._params.show_stamp : false);
    this._params.stamp_import = (typeof value.stamp_import === 'string') ? value.stamp_import : (this._params.stamp_import || "");
    this._params.stamp_width = (parseInt(value.stamp_width, 10) >= 5) ? parseInt(value.stamp_width, 10) : (this._params.stamp_width || 50);
    this._params.stamp_height = (parseInt(value.stamp_height, 10) >= 5) ? parseInt(value.stamp_height, 10) : (this._params.stamp_height || 50);
    this._params.stamp_top = (Math.abs(parseInt(value.stamp_top, 10)) >= 0) ? parseInt(value.stamp_top, 10) :
        ((typeof this._params.stamp_top === 'number') ? this._params.stamp_top : 0);
    this._params.stamp_left = (Math.abs(parseInt(value.stamp_left, 10)) >= 0) ? parseInt(value.stamp_left, 10) :
        ((typeof this._params.stamp_left === 'number') ? this._params.stamp_left : 0);
    this._params.show_label = (typeof value.show_label !== 'undefined') ? !!value.show_label :
        ((typeof this._params.show_label === 'boolean') ? this._params.show_label : true);
    this._params.label_ovr_width = (typeof value.label_ovr_width !== 'undefined') ? !!value.label_ovr_width :
        ((typeof this._params.label_ovr_width === 'boolean') ? this._params.label_ovr_width : false);
    this._params.show_label_bckgrnd = (typeof value.show_label_bckgrnd !== 'undefined') ? !!value.show_label_bckgrnd :
        ((typeof this._params.show_label_bckgrnd === 'boolean') ? this._params.show_label_bckgrnd : true);
    this._params.label_placement = (function(that) {
        if (typeof value.label_placement === 'string') {
            value.label_placement = value.label_placement.toLowerCase();
            if (value.label_placement === 'top' ||
                value.label_placement === 'top overlay' ||
                value.label_placement === 'center overlay' ||
                value.label_placement === 'bottom' ||
                value.label_placement === 'bottom overlay') {
                that._params_restrict.label_placement = value.label_placement;
            }
        }
        return (that._params_restrict.label_placement || 'bottom');
    }(this));
    this._params.label_halign = (function(that) {
        if (typeof value.label_halign === 'string') {
            value.label_halign = value.label_halign.toLowerCase();
            if (value.label_halign === 'left' ||
                value.label_halign === 'right' ||
                value.label_halign === 'center') {
                that._params_restrict.label_halign = value.label_halign;
            }
        }
        return (that._params_restrict.label_halign || 'left');
    }(this));
    this._params.label_bckgrnd_color = QUtility.paramToHex(value.label_bckgrnd_color) ||
        ((typeof this._params.label_bckgrnd_color === 'string') ? this._params.label_bckgrnd_color : 'F5F5F5');
    this._params.label_fontsize = (parseInt(value.label_fontsize, 10) >= 5) ? parseInt(value.label_fontsize, 10) : (this._params.label_fontsize || 14);
    this._params.label_fontcolor_up = QUtility.paramToHex(value.label_fontcolor_up) ||
        ((typeof this._params.label_fontcolor_up === 'string') ? this._params.label_fontcolor_up : '333333');
    this._params.label_fontcolor_over = QUtility.paramToHex(value.label_fontcolor_over) ||
        ((typeof this._params.label_fontcolor_over === 'string') ? this._params.label_fontcolor_over : '333333');
    this._params.label_fontcolor_down = QUtility.paramToHex(value.label_fontcolor_down) ||
        ((typeof this._params.label_fontcolor_down === 'string') ? this._params.label_fontcolor_down : '333333');
    this._params.label_width = (parseInt(value.label_width, 10) >= 10) ? parseInt(value.label_width, 10) : (this._params.label_width || 100);
    this._params.label_left = (Math.abs(parseInt(value.label_left, 10)) >= 0) ? parseInt(value.label_left, 10) :
        ((typeof this._params.label_left === 'number') ? this._params.label_left : 0);
    this._params.label_top = (Math.abs(parseInt(value.label_top, 10)) >= 0) ? parseInt(value.label_top, 10) :
        ((typeof this._params.label_top === 'number') ? this._params.label_top : 0);
    this._params.reverse_scale = (typeof value.reverse_scale !== 'undefined') ? !!value.reverse_scale :
        ((typeof this._params.reverse_scale === 'boolean') ? this._params.reverse_scale : false);
    this._params.mouseover_shadow = (typeof value.mouseover_shadow !== 'undefined') ? !!value.mouseover_shadow :
        ((typeof this._params.mouseover_shadow === 'boolean') ? this._params.mouseover_shadow : false);
    this._params.mouseover_bounce = (typeof value.mouseover_bounce !== 'undefined') ? !!value.mouseover_bounce :
        ((typeof this._params.mouseover_bounce === 'boolean') ? this._params.mouseover_bounce : false);
    // Values should be between 0 and 100 for scale and alpha values
    this._params.mouseover_scale = (parseInt(value.mouseover_scale, 10) >= 0) ? parseInt(value.mouseover_scale, 10) / 100 :
        ((typeof this._params.mouseover_scale === 'number') ? this._params.mouseover_scale : 1);
    this._params.mousedown_alpha = (parseInt(value.mousedown_alpha, 10) >= 0) ? parseInt(value.mousedown_alpha, 10) / 100 :
        ((typeof this._params.mousedown_alpha === 'number') ? this._params.mousedown_alpha : 1);
    this._params.mousedown_scale = (parseInt(value.mousedown_scale, 10) >= 0) ? parseInt(value.mousedown_scale, 10) / 100 :
        ((typeof this._params.mousedown_scale === 'number') ? this._params.mousedown_scale : 1);
    this._params.use_tooltip = (typeof value.use_tooltip !== 'undefined') ? !!value.use_tooltip :
        ((typeof this._params.use_tooltip === 'boolean') ? this._params.use_tooltip : false);
    this._params.use_lightbox = (typeof value.use_lightbox !== 'undefined') ? !!value.use_lightbox :
        ((typeof this._params.use_lightbox === 'boolean') ? this._params.use_lightbox : false);
    // For IE8 Transparent png bug fix
    this._params.blank_gif = (typeof value.blank_gif === 'string') ? value.blank_gif : (this._params.blank_gif || "");

    value = null;
};
QStudioBtnAbstract.prototype.type = function() {
    return "button";
};
QStudioBtnAbstract.prototype.isRadio = function(value) {
    if (!this.widget()) { return null; }
    var params = this.config();
    if (typeof value === 'boolean' && params.isRadio !== value) {
        params.isRadio = value;
    }

    return params.isRadio;
};
QStudioBtnAbstract.prototype.isOther = function() {
    if (!this.widget()) { return null; }
    return false;
};
QStudioBtnAbstract.prototype.isRating = function(value) {
    if (!this.widget()) { return null; }
    var cache = this.cache();
    if (typeof value === 'boolean' && cache._ratingBool !== value) {
        cache._ratingBool = value;
    }

    return cache._ratingBool;
};
QStudioBtnAbstract.prototype.isAnswered = function(value) {
    if (!this.widget()) { return null; }
    var cache = this.cache();
    if (typeof value === 'boolean' && (cache._answerBool !== value || this.isRating())) {
        cache._answerBool = value;
        this.toggleMouseDown(value);
    }

    return cache._answerBool;
};
QStudioBtnAbstract.prototype.enabled = function(value, configObj) {
    if (!this.widget()) { return null; }
    var cache = this.cache();
    if (typeof value === 'boolean') {
        var params = this.config(),
            wrap = cache.nodes.wrap,
            label = cache.nodes.label,
            formBtn = cache.nodes.formBtn;

        cache._enableBool = value;
        // Init config object
        configObj = configObj || {};
        configObj = {
            isAnimate : (typeof configObj.isAnimate === "boolean") ? configObj.isAnimate : false,
            animSpeed : (typeof configObj.animSpeed === "number" && configObj.animSpeed >= 100) ? configObj.animSpeed : 800,
            goOpaque : (typeof configObj.goOpaque === "boolean") ? configObj.goOpaque : false,
            enableExtEvt : (typeof configObj.enableExtEvt === "boolean") ? configObj.enableExtEvt : false,
            alphaVal : (!cache._enableBool) ?
                ((parseInt(configObj.alphaVal, 10) >= 0) ? parseInt(configObj.alphaVal, 10) : 50) :
                (this.isAnswered()) ? params.mousedown_alpha*100 : 100
        };

        if (!cache._enableBool) {
            // Record whether we should still allow external events when widget is disabled
            cache._enableExtEvt = configObj.enableExtEvt;
            wrap.style.zIndex = "auto";
        }

        // Enable/disable button state
        wrap.style.cursor = (cache._enableBool) ? 'pointer' : 'default';
        if (label) { label.style.cursor = (cache._enableBool) ? 'pointer' : 'default'; }
        if (formBtn) { formBtn.disabled = (!cache._enableBool); }
        for (var key in cache.nodes) {
            if (cache.nodes.hasOwnProperty(key)) {
                var cond = (configObj.goOpaque) ? (key !== "background" && key !== "wrap") : (key !== "wrap");
                if (cond) {
                    var node = cache.nodes[key];
                    if (!configObj.isAnimate) {
                        $(node).css( { "opacity": configObj.alphaVal *.01 } );
                    } else {
                        $(node).animate( { "opacity": configObj.alphaVal *.01 }, configObj.animSpeed );
                    }
                }
            }
        }
    }

    return cache._enableBool;
};
QStudioBtnAbstract.prototype.touchEnabled = function(value) {
    if (!this.widget()) { return null; }
    var cache = this.cache();
    if (typeof value === 'boolean' && cache._touchEnableBool !== value) {
        cache._touchEnableBool = value;
        if (cache._touchEnableBool) {
            this.removeEvent(this.widget(), "mouseenter.widget mouseleave.widget mouseenter.tooltip");
            if (cache.nodes.zoomBtn) {
                this.removeEvent(cache.nodes.zoomBtn, "click.lightbox mousedown.lightbox");
            }
        }
    }

    return cache._touchEnableBool;
};
QStudioBtnAbstract.prototype.bucket = function(value) {
    if (!this.widget()) { return null; }
    var cache = this.cache();
    // Accept null to void any previous buckets
    if (value instanceof QStudioBucketAbstract && value.add || value === null) {
        cache._bucket = value;
    }

    return cache._bucket;
};
QStudioBtnAbstract.prototype.toggleMouseEnter = function(value) {
    if (!this.widget() || this.isDrag() || this.cache().isDown) { return null; }
    if (this.enabled() && (!this.isAnswered() || this.isRating())) {
        var params = this.config(),
            cache = this.cache(),
            wrap = cache.nodes.wrap,
            background = cache.nodes.background,
            label = cache.nodes.label,
            imageContain = cache.nodes.imageContain,
            textarea = cache.nodes.textarea,
            border_color = (value) ? params.border_color_over : params.border_color_up,
            border_width = (value) ? params.border_width_over : params.border_width_up,
            border_offset = params.border_width_over - params.border_width_up,
            bckgrnd_color = (value) ? params.bckgrnd_color_over : params.bckgrnd_color_up,
            bckgrnd_import = (value) ? params.bckgrnd_import_over : params.bckgrnd_import_up,
            fontcolor = (value) ? params.label_fontcolor_over : params.label_fontcolor_up,
            scale_val = (value) ? params.mouseover_scale : 1;

        // Background changes
        background.style.borderColor = '#' + border_color;
        background.style.borderWidth = border_width + "px";
        if (!params.show_bckgrnd_import) {
            background.style.backgroundColor = '#' + bckgrnd_color;
        } else {
            if (!(params.bckgrnd_import_sprite !== "")) {
                background.style.backgroundImage = (QUtility.ieVersion() < 9) ?
                    "url(" + params.blank_gif + ") " + "url(" + bckgrnd_import + ")" : "url(" + bckgrnd_import + ")";
                background.style.filter = "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+bckgrnd_import+",sizingMethod='scale')";
            } else {
                background.style.backgroundPosition = (value) ? '0% 50%' : '50% 50%';
            }
        }

        // Background shadow
        if (params.mouseover_shadow) {
            background.style.MozBoxShadow = (value) ? '3px 5px 3px #888' : '';
            background.style.webkitBoxShadow = (value) ? '3px 5px 3px #888' : '';
            background.style.boxShadow = (value) ? '3px 5px 3px #888' : '';
        }

        // Label color changes
        label.style.color = '#' + fontcolor;

        // Button 'mouseOver' scale animation *CSS3 only
        if (!params.reverse_scale) {
            $(wrap).css({
                'transform': (scale_val !== 1) ? 'scale('+scale_val+','+scale_val+')' : "",
                'z-index': (value) ? 2000 : 'auto'
            });
        } else {
            wrap.style.zIndex = (value) ? 2000 : 'auto';
        }

        // Widget bounce animation
        if (params.mouseover_bounce) {
            if (value) {
                $(wrap).animate({"top": "2px" }, 170, function() {
                    $(this).animate({"top": "" }, 200);
                });
            } else {
                $(wrap).stop();
                wrap.style.top = "";
            }
        }

        // Border margin offsets
        if (border_offset !== 0) {
            label.style.marginLeft = (value) ? border_offset + "px" : "";
            if (this instanceof QBaseBtn && params.label_placement.indexOf("overlay") !== -1) {
                label.style.marginTop = (value) ? -border_offset + "px" : "";
            } else if (this instanceof QTextBtn || this instanceof QKantarBaseBtn || this instanceof QFlowBtn) {
                label.style.marginTop = (value) ? border_offset + "px" : "";
            }

            if (imageContain) {
                imageContain.style.marginLeft = (value) ? border_offset + "px" : "";
                imageContain.style.marginTop = (value) ? border_offset + "px" : "";
            }

            if (textarea) {
                textarea.style.marginLeft = (value) ? border_offset + "px" : "";
                textarea.style.marginTop = (value) ? border_offset + "px" : "";
            }

            wrap.style.marginLeft = (value) ? -border_offset + "px" : "";
            wrap.style.marginTop = (value) ? -border_offset + "px" : ""
        }
    }
};
QStudioBtnAbstract.prototype.toggleMouseDown = function(value) {
    if (!this.widget()) { return null; }
    this._cache.isDown = value;
    var params = this.config(),
        cache = this.cache(),
        wrap = cache.nodes.wrap,
        background = cache.nodes.background,
        label = cache.nodes.label,
        imageContain = cache.nodes.imageContain,
        textarea = cache.nodes.textarea,
        stamp = cache.nodes.stamp,
        border_color = (value) ? params.border_color_down : params.border_color_up,
        border_width = (value) ? params.border_width_down : params.border_width_up,
        border_offset = params.border_width_down - params.border_width_up,
        bckgrnd_color = (value) ? params.bckgrnd_color_down : params.bckgrnd_color_up,
        bckgrnd_import = (value) ? params.bckgrnd_import_down : params.bckgrnd_import_up,
        fontcolor = (value) ? params.label_fontcolor_down : params.label_fontcolor_up,
        scale_val = (value) ? params.mousedown_scale : 1,
        alpha_val = (value) ? params.mousedown_alpha : 1,
        isEnabled = this.enabled();

    // Background change
    background.style.borderColor = '#' + border_color;
    background.style.borderWidth = border_width + "px";
    if (!params.show_bckgrnd_import) {
        background.style.backgroundColor = '#' + bckgrnd_color;
    } else {
        if (!(params.bckgrnd_import_sprite !== "")) {
            background.style.backgroundImage = (QUtility.ieVersion() < 9) ?
                "url(" + params.blank_gif + ") " + "url(" + bckgrnd_import + ")" : "url(" + bckgrnd_import + ")";
            background.style.filter = (isEnabled) ?
                "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+bckgrnd_import+",sizingMethod='scale') progid:DXImageTransform.Microsoft.Alpha(Opacity="+alpha_val*100+")":
                "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+bckgrnd_import+",sizingMethod='scale')";
        } else {
            background.style.backgroundPosition = (value) ? '100% 50%' : '50% 50%';
        }
    }

    // Background shadow
    if (params.mouseover_shadow) {
        background.style.MozBoxShadow = (value) ? '3px 5px 3px #888' : '';
        background.style.webkitBoxShadow = (value) ? '3px 5px 3px #888' : '';
        background.style.boxShadow = (value) ? '3px 5px 3px #888' : '';
    }

    // Label color change
    label.style.color = '#' + fontcolor;

    // Stamp visibility toggle
    if (stamp && params.show_stamp) {
        stamp.style.display = (value) ? 'block' : 'none';
    }

    // Button scale animation
    if (!params.reverse_scale) {
        $(wrap).css({
            'transform': (scale_val !== 1) ? 'scale('+scale_val+','+scale_val+')' : "",
            'z-index': (value) ? 1999 : 'auto'
        });
    } else {
        wrap.style.zIndex = (value) ? 1999 : 'auto';
    }

    // Button opacity animation
    if (isEnabled) {
        for (var key in cache.nodes) {
            if (cache.nodes.hasOwnProperty(key)) {
                var node = cache.nodes[key];
                if (node !== stamp && node !== wrap) {
                    $(node).css( { "opacity": alpha_val } );
                }
            }
        }
    }

    // Border margin offsets
    if (border_offset !== 0) {
        label.style.marginLeft = (value) ? border_offset + "px" : "";
        if (this instanceof QBaseBtn && params.label_placement.indexOf("overlay") !== -1) {
            label.style.marginTop = (value) ? -border_offset + "px" : "";
        } else if (this instanceof QTextBtn || this instanceof QKantarBaseBtn || this instanceof QFlowBtn) {
            label.style.marginTop = (value) ? border_offset + "px" : "";
        }

        if (imageContain) {
            imageContain.style.marginLeft = (value) ? border_offset + "px" : "";
            imageContain.style.marginTop = (value) ? border_offset + "px" : "";
        }

        if (textarea) {
            textarea.style.marginLeft = (value) ? border_offset + "px" : "";
            textarea.style.marginTop = (value) ? border_offset + "px" : "";
        }

        // Stamp visibility toggle
        if (stamp && params.show_stamp) {
            stamp.style.marginLeft = (value) ? border_offset + "px" : "";
            stamp.style.marginTop = (value) ? border_offset + "px" : "";
        }

        wrap.style.marginLeft = (value) ? -border_offset + "px" : "";
        wrap.style.marginTop = (value) ? -border_offset + "px" : ""
    }
};
QStudioBtnAbstract.prototype.reverseAnim = function(value) {
    if (!this.widget()) { return null; }
    if (!this.config().reverse_scale) { return null; }
    var params = this.config(),
        cache = this.cache(),
        wrap = cache.nodes.wrap,
        stamp = cache.nodes.stamp,
        scale_val = (value) ? params.mousedown_scale : 1,
        alpha_val = (value) ? params.mousedown_alpha : 1;

    $(wrap).css({
        'transform': 'scale('+scale_val+','+scale_val+')',
        'transform-origin': "top"
    });

    for (var key in cache.nodes) {
        if (cache.nodes.hasOwnProperty(key)) {
            var node = cache.nodes[key];
            if (node !== stamp && node !== wrap) {
                $(node).css( { "opacity": alpha_val } );
            }
        }
    }
};

/**
 * Base Button Widget --> Extends QStudioBtnAbstract
 */
function QBaseBtn(parent, configObj) {
    // Init
    this.init();

    // Create Button Shell
    var that = this,
        doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        widget = doc.createElement("div"),
        wrap = doc.createElement("div"),
        background = doc.createElement("div"),
        imageContain = doc.createElement("div"),
        image = doc.createElement("img"),
        label = doc.createElement("label"),
        stamp = doc.createElement("div");

    // Widget CSS Style
    widget.className = "qwidget_button";
    widget.dir = "LTR";
    widget.style.cssText += ';'.concat("position: relative;");
    widget.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
    widget.style.cssText += ';'.concat("-webkit-touch-callout: none;");
    widget.style.cssText += ';'.concat("-ms-touch-action: none;");
    widget.style.cssText += ';'.concat("-webkit-user-select: none;");
    widget.style.cssText += ';'.concat("-khtml-user-select: none;");
    widget.style.cssText += ';'.concat("-moz-user-select: none;");
    widget.style.cssText += ';'.concat("-ms-user-select: none;");
    widget.style.cssText += ';'.concat("-user-select: none;");

    // Wrapper CSS Style
    wrap.className = "qwidget_button_wrapper";
    wrap.style.position = "absolute";

    // Background CSS Style
    background.className = "qwidget_button_background";
    background.style.cssText = "position: absolute; filter: inherit;";

    // Image Container CSS Style
    imageContain.className = "qwidget_button_image_container";
    imageContain.style.cssText = "position: absolute; filter: inherit;";

    // Image CSS Style
    image.className = "qwidget_button_image";
    image.style.cssText = "position: absolute; filter: inherit; width: auto; height: auto; max-width: 100%; max-height: 100%;";

    // Label CSS Style
    label.className = "qwidget_button_label";
    label.style.cssText = "position: absolute; filter: inherit;";
    if (QUtility.ieVersion() <= 8) { label.style.filter = ""; }    // Fix for IE8 Opacity/ClearType bug

    // Stamp CSS Style
    stamp.className = "qwidget_button_stamp";
    stamp.style.cssText = "position: absolute; filter: inherit; display: none;";

    // Append children
    imageContain.appendChild(image);
    wrap.appendChild(background);
    wrap.appendChild(imageContain);
    wrap.appendChild(label);
    wrap.appendChild(stamp);
    widget.appendChild(wrap);
    parentEle.appendChild(widget);

    // Setup
    this._widget = widget;
    this._cache.nodes = {
        wrap: wrap,
        background: background,
        imageContain: imageContain,
        image: image,
        label: label,
        stamp: stamp
    };
    this.config(configObj || {});   // This will trigger update method to be called
    this.enabled(true);

    // Add "mouseenter" & "mouseleave" events
    this.addEvent(widget, "mouseenter.widget mouseleave.widget", function(event) {
        that.toggleMouseEnter(event.type === "mouseenter");
    });

    // Add "mouseenter" event for Tooltip
    if (this._params.use_tooltip) {
        this.addEvent(widget, "mouseenter.tooltip", jQuery.proxy(QBaseToolTip.getInstance().toolTipMouseEvent, that));
    }
}
QBaseBtn.prototype = new QStudioBtnAbstract();
QBaseBtn.prototype.config = function(value) {
    if (typeof value !== 'object') {
        return QStudioBtnAbstract.prototype.config.call(this, value);
    }

    QStudioBtnAbstract.prototype.config.call(this, value);
    this._params.label_overlay_padding = (Math.abs(parseInt(value.label_overlay_padding, 10)) >= 0) ? parseInt(value.label_overlay_padding, 10) :
        ((typeof this._params.label_overlay_padding === 'number') ? this._params.label_overlay_padding : 2);
    this._params.zoom_top = (Math.abs(parseInt(value.zoom_top, 10)) >= 0) ? parseInt(value.zoom_top, 10) :
        ((typeof this._params.zoom_top === 'number') ? this._params.zoom_top : 0);
    this._params.zoom_left = (Math.abs(parseInt(value.zoom_left, 10)) >= 0) ? parseInt(value.zoom_left, 10) :
        ((typeof this._params.zoom_left === 'number') ? this._params.zoom_left : 0);

    // Update widget
    this.update();
    value = null;
    return this;
};
QBaseBtn.prototype.update = function() {
    if (!this.widget()) { return null; }
    var that = this,
        doc = document,
        lightBoxInstance = QBaseLightBox.getInstance(),
        cache = this.cache(),
        params = this.config(),
        widget = this.widget(),
        wrap = cache.nodes.wrap,
        background = cache.nodes.background,
        imageContain = cache.nodes.imageContain,
        image = cache.nodes.image,
        label = cache.nodes.label,
        stamp = cache.nodes.stamp,
        border_width = params.border_width_up,
        border_radius = params.border_radius,
        paramWidth = params.width,
        paramHeight = params.height,
        bckgrndWidth = 0,
        bckgrndHeight = 0,
        labelOffset = 0,
        labHeight = 0;

    // Set widget ID
    widget.id = params.id;

    // Background CSS Style
    background.style.cssText = "position: relative; filter: inherit;";
    background.style.width = paramWidth + "px";
    background.style.height = paramHeight + "px";
    background.style.padding = params.padding + "px";
    background.style.visibility = (params.show_bckgrnd) ? "visible" : "hidden";
    background.style.borderRadius = background.style.webkitBorderRadius = background.style.mozBorderRadius = border_radius + "px";
    background.style.border = border_width + "px " + params.border_style + " #" + params.border_color_up;
    if (!params.show_bckgrnd_import) {
        background.style.backgroundColor = "#" + params.bckgrnd_color_up;
    } else {
        if (!(params.bckgrnd_import_sprite !== "")) {
            $(background).css( {
                'background-repeat': 'no-repeat',
                'background-size': "100% 100%",
                'background-position': "50% 50%",
                'background-image': (QUtility.ieVersion() < 9) ?
                    "url(" + params.blank_gif + ") " + 'url(' + params.bckgrnd_import_up + ')' : 'url(' + params.bckgrnd_import_up + ')',
                'filter': "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + params.bckgrnd_import_up + ",sizingMethod='scale')"
            });
        } else {
            // For single sprite images
            paramWidth = params.width - params.padding*2;
            paramHeight = params.height - params.padding*2;
            background.style.width = paramWidth + "px";
            background.style.height = paramHeight + "px";
            background.style.backgroundPosition = "50% 50%";
            background.style.backgroundRepeat = "no-repeat";
            background.style.backgroundImage = "url(" + params.bckgrnd_import_sprite + ")";
        }
    }

    // Record background dimensions
    bckgrndWidth = $(background).outerWidth();
    bckgrndHeight = $(background).outerHeight();

    // Label CSS Style
    label.style.display = (params.show_label && (jQuery.trim(params.label).length > 0)) ? "block" : "none";
    if (label.style.display !== "none") {
        label.dir = (!params.isRTL) ? "LTR" : "RTL";
        label.style.fontSize = QUtility.convertPxtoEM(params.label_fontsize) + "em";
        label.style.wordWrap = "break-word";
        label.style.whiteSpace = "normal";
        label.style.textAlign = (!params.isRTL) ? params.label_halign : "";
        label.style.width = ((!params.label_ovr_width) ?
            ((params.label_placement.indexOf("overlay") === -1) ? paramWidth : bckgrndWidth - border_width*2 - params.label_overlay_padding*2) : params.label_width) + "px";
        label.style.padding =
            (params.label_placement.indexOf("overlay") === -1) ? "" : params.label_overlay_padding + "px";
        label.style.height = "auto";
        label.style.color = "#" + params.label_fontcolor_up;
        label.style.visibility = "hidden";
        label.innerHTML = params.label;
        // Temporarily append label to doc.body to calculate label height
        doc.body.appendChild(label);
        labHeight = $(label).outerHeight();
        // Append back to widget
        (params.label_placement === 'top') ?
            wrap.insertBefore(label, background) : wrap.insertBefore(label, stamp);
        label.style.position = "relative";
        if (params.label_placement.indexOf("overlay") === -1) {
            if (params.label_placement === "top") { labelOffset = labHeight; }
            label.style.top = params.label_top + "px";
            label.style.left = (params.label_left + params.padding + border_width) + "px";
        } else {
            var hex_rgb = QUtility.hexToRgb(params.label_bckgrnd_color),
                rgb_str = hex_rgb.r+','+hex_rgb.g+','+hex_rgb.b;

            if (labHeight > paramHeight) {
                label.style.height = (bckgrndHeight - border_width*2 - params.label_overlay_padding*2) + "px";
                label.style.overflow = "hidden";
                labHeight = (bckgrndHeight - border_width*2);
            }

            label.style.backgroundColor = (params.show_label_bckgrnd) ? ((QUtility.ieVersion() <= 8) ?
                '#' + params.label_bckgrnd_color : 'rgba('+rgb_str+', 0.85)') : "";
            label.style.left = border_width + "px";
            switch (params.label_placement) {
                case "top overlay":
                    label.style.top = (-bckgrndHeight + border_width + params.label_top) + "px";
                    label.style.borderTopLeftRadius = label.style.WebkitBorderTopLeftRadius = label.style.mozBorderTopLeftRadius = (border_radius - border_width) + "px";
                    label.style.borderTopRightRadius = label.style.WebkitBorderTopRightRadius = label.style.mozBorderTopRightRadius = (border_radius - border_width) + "px";
                    break;
                case "center overlay":
                    label.style.top = ((-bckgrndHeight - labHeight)*0.5 + params.label_top) + "px";
                    break;
                default:
                    label.style.top = (-labHeight - border_width + params.label_top) + "px";//-(bckgrndHeight - border_width) + "px";
                    label.style.borderBottomLeftRadius = label.style.WebkitBorderBottomLeftRadius = label.style.mozBorderBottomLeftRadius = (border_radius - border_width) + "px";
                    label.style.borderBottomRightRadius = label.style.WebkitBorderBottomRightRadius = label.style.mozBorderBottomRightRadius = (border_radius - border_width) + "px";
                    break;
            }

            labHeight = 0;
        }

        label.style.visibility = "";
    }

    // Stamp CSS Style
    if (params.show_stamp && jQuery.trim(params.stamp_import) !== "") {
        $(stamp).css( {
            'top': (((bckgrndHeight - params.stamp_height) * 0.5) + params.stamp_top + labelOffset) + "px",
            'left': (((bckgrndWidth - params.stamp_width) * 0.5) + params.stamp_left) + "px",
            'width': params.stamp_width + "px",
            'height': params.stamp_height + "px",
            'background-repeat': 'no-repeat',
            'background-size': params.stamp_width + "px " + params.stamp_height + "px",
            'background-position': 'center',
            'background-image': (QUtility.ieVersion() < 9) ?
                "url(" + params.blank_gif + ") " + 'url('+params.stamp_import+')' : 'url('+params.stamp_import+')',
            'filter': "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+params.stamp_import+",sizingMethod='scale')"
        });
    }

    // See about adding a zoom image button
    if (params.use_lightbox) {
        var zoomBtn = lightBoxInstance.init(this),
            actionType = lightBoxInstance.config().action_type.toLowerCase();

        if (zoomBtn && zoomBtn.nodeType === 1) {
            zoomBtn.style.display = "none";
            zoomBtn.style.top = (1 + params.zoom_top) + "px";
            zoomBtn.style.left = (1 + params.zoom_left) + "px";
            if (!zoomBtn.parentNode) {
                if (actionType.indexOf("image") !== -1) {
                    imageContain.appendChild(zoomBtn);
                } else {
                    wrap.insertBefore(zoomBtn, stamp);
                    if (params.label_placement === 'top') {
                        zoomBtn.style.top = (1 + labHeight + params.zoom_top) + "px";
                    }
                }
            }
        }
    } else {
        if (lightBoxInstance) { lightBoxInstance.remove(this); }
    }

    // Image CSS Style
    if (jQuery.trim(params.image).length > 0) {
        imageContain.style.display = "block";
        imageContain.style.width = paramWidth + "px";
        imageContain.style.height = paramHeight + "px";
        if (QUtility.ieVersion() >= 999) { image.src = ""; }
        image.src = params.image;

        // On error
        $(image).on("error", function() {
            if (lightBoxInstance) { lightBoxInstance.remove(that); }
            $(this).off("error");
            imageContain.style.display = "none";
        });

        // On Load
        $(image).on("load", function() {
            // Image Container CSS Style
            imageContain.style.visibility = "hidden";
            imageContain.style.display = "block";
            imageContain.style.top = "-5000px";
            imageContain.style.left = "-5000px";

            // Temporarily append imageContain to doc.body to calculate image centering position
            doc.body.appendChild(imageContain);
            this.style.maxWidth = "100%";
            this.style.maxHeight = "100%";
            this.style.top = params.img_top + "px";
            this.style.left = params.img_left + "px";
            imageContain.style.top = (((bckgrndHeight - $(this).height()) * 0.5) + labelOffset) + "px";
            imageContain.style.left = (((bckgrndWidth - $(this).width()) * 0.5)) + "px";
            imageContain.style.width = $(this).width() + "px";
            imageContain.style.height = $(this).height() + "px";

            // Remove listener, add image back to background div, and remove temporary div
            $(this).on('dragstart.widget', function(event) { event.preventDefault(); });
            $(this).off("load");
            (params.label_placement !== "top") ?
                wrap.insertBefore(imageContain, wrap.children[1]) : wrap.insertBefore(imageContain, wrap.children[2]);
            imageContain.style.visibility = "";

            // Zoom Button display
            if (cache.nodes.zoomBtn) { cache.nodes.zoomBtn.style.display = "block"; }
        }).attr("src", params.image);
    } else {
        imageContain.style.display = "none";
    }

    // See if we need to set widget as answered
    if (this.isAnswered()) { this.toggleMouseDown(true); }

    // Set Widget dimensions
    wrap.style.width = Math.max(bckgrndWidth, $(label).outerWidth()) + "px";
    wrap.style.height = (bckgrndHeight + labHeight) + "px";
    widget.style.width = wrap.style.width;
    widget.style.height = wrap.style.height;
};

/**
 * Flow Button Widget --> Extends QStudioBtnAbstract
 */
function QFlowBtn(parent, configObj) {
    // Init
    this.init();

    // Create Button Shell
    var that = this,
        doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        widget = doc.createElement("div"),
        background = doc.createElement("div"),
        wrap = doc.createElement("div"),
        imageContain = doc.createElement("div"),
        image = doc.createElement("img"),
        label = doc.createElement("label"),
        stamp = doc.createElement("div");

    // Widget CSS Style
    widget.className = "qwidget_button";
    widget.dir = "LTR";
    widget.style.cssText += ';'.concat("position: relative;");
    widget.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
    widget.style.cssText += ';'.concat("-webkit-touch-callout: none;");
    widget.style.cssText += ';'.concat("-ms-touch-action: none;");
    widget.style.cssText += ';'.concat("-webkit-user-select: none;");
    widget.style.cssText += ';'.concat("-khtml-user-select: none;");
    widget.style.cssText += ';'.concat("-moz-user-select: none;");
    widget.style.cssText += ';'.concat("-ms-user-select: none;");
    widget.style.cssText += ';'.concat("-user-select: none;");

    // Wrapper CSS Style
    wrap.className = "qwidget_button_wrapper";
    wrap.style.position = "absolute";

    // Background CSS Style
    background.className = "qwidget_button_background";
    background.style.cssText = "position: absolute; filter: inherit;";

    // Image Container CSS Style
    imageContain.className = "qwidget_button_image_container";
    imageContain.style.cssText = "position: absolute; filter: inherit; visibility: hidden;";

    // Image CSS Style
    image.className = "qwidget_button_image";
    image.style.cssText = "position: absolute; filter: inherit; width: auto; height: auto; max-width: 100%; max-height: 100%;";

    // Label CSS Style
    label.className = "qwidget_button_label";
    label.style.cssText = "position: absolute; filter: inherit;";
    if (QUtility.ieVersion() <= 8) { label.style.filter = ""; }    // Fix for IE8 Opacity/ClearType bug

    // Stamp CSS Style
    stamp.className = "qwidget_button_stamp";
    stamp.style.cssText = "position: absolute; filter: inherit; display: none;";

    // Append children
    imageContain.appendChild(image);
    wrap.appendChild(background);
    wrap.appendChild(imageContain);
    wrap.appendChild(label);
    wrap.appendChild(stamp);
    widget.appendChild(wrap);
    parentEle.appendChild(widget);

    // Setup
    this._widget = widget;
    this._cache.nodes = {
        wrap: wrap,
        background: background,
        imageContain: imageContain,
        image: image,
        label: label,
        stamp: stamp
    };
    this.config(configObj || {});   // This will trigger update method to be called
    this.enabled(true);

    // Add "mouseenter" & "mouseleave" events
    this.addEvent(widget, "mouseenter.widget mouseleave.widget", function(event) {
        that.toggleMouseEnter(event.type === "mouseenter");
    });

    // Add "mouseenter" event for Tooltip
    if (this._params.use_tooltip) {
        this.addEvent(widget, "mouseenter.tooltip", jQuery.proxy(QBaseToolTip.getInstance().toolTipMouseEvent, that));
    }
}
QFlowBtn.prototype = new QStudioBtnAbstract();
QFlowBtn.prototype.config = function(value) {
    if (typeof value !== 'object') {
        return QStudioBtnAbstract.prototype.config.call(this, value);
    }

    QStudioBtnAbstract.prototype.config.call(this, value);
    this._params.zoom_top = (Math.abs(parseInt(value.zoom_top, 10)) >= 0) ? parseInt(value.zoom_top, 10) :
        ((typeof this._params.zoom_top === 'number') ? this._params.zoom_top : 0);
    this._params.zoom_left = (Math.abs(parseInt(value.zoom_left, 10)) >= 0) ? parseInt(value.zoom_left, 10) :
        ((typeof this._params.zoom_left === 'number') ? this._params.zoom_left : 0);
    this._params.img_scale = (parseInt(value.img_scale, 10) >= 35) ? parseInt(value.img_scale, 10) :
        ((typeof this._params.img_scale === 'number') ? this._params.img_scale : 35);

    // Update widget
    this.update();
    value = null;
    return this;
};
QFlowBtn.prototype.update = function() {
    if (!this.widget()) { return null; }
    var that = this,
        doc = document,
        lightBoxInstance = QBaseLightBox.getInstance(),
        cache = this.cache(),
        params = this.config(),
        widget = this.widget(),
        wrap = cache.nodes.wrap,
        background = cache.nodes.background,
        imageContain = cache.nodes.imageContain,
        image = cache.nodes.image,
        label = cache.nodes.label,
        stamp = cache.nodes.stamp,
        border_width = params.border_width_up,
        border_radius = params.border_radius,
        imgWidth = (params.img_scale/100)*params.width,
        paramWidth = params.width,
        paramHeight = params.height,
        bckgrndWidth = 0,
        bckgrndHeight = 0,
        labOffset = 3,
        labHeight = 0;

    // Wrap Setup
    wrap.style.display = "none";

    // Set widget ID
    widget.id = params.id;

    // Background Setup
    background.style.width = paramWidth + "px";
    background.style.height = paramHeight + "px";
    background.style.padding = params.padding + "px";
    background.style.visibility = (params.show_bckgrnd) ? "visible" : "hidden";
    background.style.borderRadius =
        background.style.webkitBorderRadius =
            background.style.mozBorderRadius = border_radius + "px";
    background.style.border = border_width + "px " + params.border_style + " #" + params.border_color_up;
    if (!params.show_bckgrnd_import) {
        background.style.backgroundColor = "#" + params.bckgrnd_color_up;
    } else {
        if (!(params.bckgrnd_import_sprite !== "")) {
            $(background).css( {
                'background-repeat': 'no-repeat',
                'background-size': "100% 100%",
                'background-position': "50% 50%",
                'background-image': (QUtility.ieVersion() < 9) ?
                    "url(" + params.blank_gif + ") " + 'url(' + params.bckgrnd_import_up + ')' : 'url(' + params.bckgrnd_import_up + ')',
                'filter': "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + params.bckgrnd_import_up + ",sizingMethod='scale')"
            });
        } else {
            // For single sprite images
            paramWidth = params.width - params.padding*2;
            paramHeight = params.height - params.padding*2;
            background.style.width = paramWidth + "px";
            background.style.height = paramHeight + "px";
            background.style.backgroundPosition = "50% 50%";
            background.style.backgroundRepeat = "no-repeat";
            background.style.backgroundImage = "url(" + params.bckgrnd_import_sprite + ")";
        }
    }

    // Record background dimensions
    bckgrndWidth = $(background).outerWidth();
    bckgrndHeight = $(background).outerHeight();

    // Label Setup
    label.dir = (!params.isRTL) ? "LTR" : "RTL";
    label.style.visibility = "hidden";
    label.style.top = (params.padding + border_width) + "px";
    label.style.left = (params.padding + border_width) + "px";
    label.style.whiteSpace = "normal";
    label.style.wordWrap = "break-word";
    label.style.textAlign = (!params.isRTL) ? params.label_halign : "";
    label.style.fontSize = QUtility.convertPxtoEM(params.label_fontsize) + "em";
    label.style.color = "#" + params.label_fontcolor_up;
    label.style.width = paramWidth + "px";
    label.style.height = "auto";
    //label.style.backgroundColor = "#ccc";
    label.innerHTML = params.label;
    doc.body.appendChild(label);
    labHeight = $(label).outerHeight();
    wrap.insertBefore(label, stamp);
    if (labHeight >= paramHeight) {
        label.style.height = paramHeight + "px";
        label.style.overflow = "hidden";
    } else {
        label.style.top = (((bckgrndHeight - labHeight)*0.5)) + "px";
    }

    // Image Setup
    if (jQuery.trim(params.image).length > 0) {
        imageContain.style.visibility = "hidden";
        imageContain.style.width = imgWidth + "px";
        imageContain.style.height = paramHeight + "px";
        imageContain.style.left = (params.padding + border_width) + "px";
        imageContain.style.top = (params.padding + border_width) + "px";
        image.src = params.image;

        // On error
        $(image).on("error", function() {
            if (lightBoxInstance) { lightBoxInstance.remove(that); }
            $(this).off("error");
            imageContain.style.display = "none";
            label.style.visibility = "";
        });

        // On load
        $(image).on("load", function() {
            doc.body.appendChild(imageContain);
            var imageWidth = $(this).width(),
                imageHeight = $(this).height();

            wrap.insertBefore(imageContain, wrap.children[1]);
            $(this).off("load");
            $(this).on('dragstart.widget', function(event) { event.preventDefault(); });
            imageContain.style.display = "block";
            imageContain.style.width = imageWidth + "px";
            imageContain.style.height = imageHeight + "px";
            imageContain.style.visibility = "";
            imageContain.style.top = ((bckgrndHeight - imageHeight)*0.5) + "px";
            label.style.width = (paramWidth - imageWidth - labOffset) + "px";
            label.style.left = (imageWidth + params.padding + labOffset + border_width) + "px";
            label.style.visibility = "";
            doc.body.appendChild(label);
            labHeight = $(label).outerHeight();
            wrap.insertBefore(label, stamp);
            if (labHeight >= paramHeight) {
                label.style.height = paramHeight + "px";
                label.style.overflow = "hidden";
                label.style.top = (params.padding + border_width) + "px";
            } else {
                label.style.top = (((bckgrndHeight - labHeight)*0.5)) + "px";
            }

            // Zoom button display
            if (cache.nodes.zoomBtn) { cache.nodes.zoomBtn.style.display = "block"; }
        }).attr("src", params.image);
    } else {
        imageContain.style.display = "none";
        label.style.visibility = "";
    }

    // Stamp CSS Style
    if (params.show_stamp && jQuery.trim(params.stamp_import) !== "") {
        $(stamp).css( {
            'top': (((bckgrndHeight - params.stamp_height) * 0.5) + params.stamp_top) + "px",
            'left': (((bckgrndWidth - params.stamp_width) * 0.5) + params.stamp_left) + "px",
            'width': params.stamp_width + "px",
            'height': params.stamp_height + "px",
            'background-repeat': 'no-repeat',
            'background-size': params.stamp_width + "px " + params.stamp_height + "px",
            'background-position': 'center',
            'background-image': (QUtility.ieVersion() < 9) ?
                "url(" + params.blank_gif + ") " + 'url(' + params.stamp_import + ')' : 'url(' + params.stamp_import + ')',
            'filter': "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + params.stamp_import + ", sizingMethod='scale')"
        });
    }

    // See about adding a zoom image button
    if (params.use_lightbox) {
        var zoomBtn = lightBoxInstance.init(this);
        if (zoomBtn && zoomBtn.nodeType === 1) {
            zoomBtn.style.display = "none";
            zoomBtn.style.top = (1 + params.zoom_top) + "px";
            zoomBtn.style.left = (1 + params.zoom_left) + "px";
            if (!zoomBtn.parentNode) {
                imageContain.appendChild(zoomBtn);
            }
        }
    } else {
        if (lightBoxInstance) { lightBoxInstance.remove(this); }
    }

    // See if we need to set widget as answered
    if (this.isAnswered()) { this.toggleMouseDown(true); }

    // Display again and set Widget dimensions
    wrap.style.display = "";
    wrap.style.width = bckgrndWidth + "px";
    wrap.style.height = bckgrndHeight + "px";
    widget.style.width = wrap.style.width;
    widget.style.height = wrap.style.height;
};

/**
 * Text Button Widget --> Extends QStudioBtnAbstract
 */
function QTextBtn(parent, configObj) {
    // Init
    this.init();

    // Create Button Shell
    var that = this,
        doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        widget = doc.createElement("div"),
        wrap = doc.createElement("div"),
        background = doc.createElement("div"),
        label = doc.createElement("label"),
        stamp = doc.createElement("div");

    // Widget CSS Style
    widget.className = "qwidget_button";
    widget.dir = "LTR";
    widget.style.cssText += ';'.concat("position: relative;");
    widget.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
    widget.style.cssText += ';'.concat("-webkit-touch-callout: none;");
    widget.style.cssText += ';'.concat("-ms-touch-action: none;");
    widget.style.cssText += ';'.concat("-webkit-user-select: none;");
    widget.style.cssText += ';'.concat("-khtml-user-select: none;");
    widget.style.cssText += ';'.concat("-moz-user-select: none;");
    widget.style.cssText += ';'.concat("-ms-user-select: none;");
    widget.style.cssText += ';'.concat("-user-select: none;");

    // Wrapper CSS Style
    wrap.className = "qwidget_button_wrapper";
    wrap.style.position = "absolute";

    // Background CSS Style
    background.className = "qwidget_button_background";
    background.style.cssText = "position: absolute; filter: inherit;";

    // Label CSS Style
    label.className = "qwidget_button_label";
    label.style.cssText = "position: absolute; filter: inherit; display: block;";
    if (QUtility.ieVersion() <= 8) { label.style.filter = ""; }    // Fix for IE8 Opacity/ClearType bug

    // Stamp CSS Style
    stamp.className = "qwidget_button_stamp";
    stamp.style.cssText = "position: absolute; filter: inherit; display: none;";

    // Append children
    wrap.appendChild(background);
    wrap.appendChild(label);
    wrap.appendChild(stamp);
    widget.appendChild(wrap);
    parentEle.appendChild(widget);

    // Setup
    this._widget = widget;
    this._cache.nodes = {
        wrap: wrap,
        background: background,
        label: label,
        stamp: stamp
    };
    this.config(configObj || {});   // This will trigger update method to be called
    this.enabled(true);

    // Add "mouseenter" & "mouseleave" events
    this.addEvent(widget, "mouseenter.widget mouseleave.widget", function(event) {
        that.toggleMouseEnter(event.type === "mouseenter");
    });

    // Add "mouseenter" event for Tooltip
    if (this._params.use_tooltip) {
        this.addEvent(widget, "mouseenter.tooltip", jQuery.proxy(QBaseToolTip.getInstance().toolTipMouseEvent, that));
    }
}
QTextBtn.prototype = new QStudioBtnAbstract();
QTextBtn.prototype.config = function(value) {
    if (typeof value !== 'object') {
        return QStudioBtnAbstract.prototype.config.call(this, value);
    }

    QStudioBtnAbstract.prototype.config.call(this, value);
    this._params.txtbtn_trim = (typeof value.txtbtn_trim !== 'undefined') ? !!value.txtbtn_trim :
        ((typeof this._params.txtbtn_trim === 'boolean') ? this._params.txtbtn_trim : false);

    // Update widget
    this.update();
    value = null;
    return this;
};
QTextBtn.prototype.update = function() {
    if (!this.widget()) { return null; }
    var doc = document,
        widget = this.widget(),
        params = this.config(),
        cache = this.cache(),
        wrap = cache.nodes.wrap,
        background = cache.nodes.background,
        stamp = cache.nodes.stamp,
        label = cache.nodes.label,
        border_width = params.border_width_up,
        bckgrndWidth = 0,
        bckgrndHeight = 0,
        labWidth = 0,
        labHeight = 0;

    // Set widget ID
    widget.id = params.id;

    // Label CSS Style
    label.dir = (!params.isRTL) ? "LTR" : "RTL";
    label.style.whiteSpace = "normal";
    label.style.textAlign = (!params.isRTL) ? params.label_halign : "";
    label.style.fontSize = QUtility.convertPxtoEM(params.label_fontsize) + "em";
    label.style.width = ((!params.label_ovr_width) ?
        ((!params.show_bckgrnd_import || (!(params.bckgrnd_import_sprite !== ""))) ? params.width : params.width - params.padding*2) :
        params.label_width) + "px";
    label.style.height = "auto";
    label.style.color = "#" + params.label_fontcolor_up;
    label.style.wordWrap = "break-word";
    // label.style.backgroundColor = "#FFF000";
    label.style.visibility = "hidden";
    label.innerHTML = params.label;
    // Temporarily append label to doc.body to calculate label width/height
    doc.body.appendChild(label);
    labWidth = $(label).width();
    labHeight = $(label).height();
    // Append back to widget
    wrap.insertBefore(label, stamp);
    label.style.visibility = "";

    // Background CSS Style
    background.style.cssText = "position: relative; filter: inherit;";
    background.style.width = params.width + "px";
    background.style.height = ((!params.txtbtn_trim) ? params.height : labHeight) + "px";
    background.style.padding = params.padding + "px";
    background.style.visibility = (params.show_bckgrnd) ? "visible" : "hidden";
    background.style.borderRadius = background.style.webkitBorderRadius = background.style.mozBorderRadius = params.border_radius + "px";
    background.style.border = border_width + "px " + params.border_style + " #" + params.border_color_up;
    if (!params.show_bckgrnd_import) {
        background.style.backgroundColor = "#" + params.bckgrnd_color_up;
    } else {
        if (!(params.bckgrnd_import_sprite !== "")) {
            $(background).css( {
                'background-repeat': 'no-repeat',
                'background-size': "100% 100%",
                'background-position': "50% 50%",
                'background-image': (QUtility.ieVersion() < 9) ?
                    "url(" + params.blank_gif + ") " + 'url(' + params.bckgrnd_import_up + ')' : 'url(' + params.bckgrnd_import_up + ')',
                'filter': "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + params.bckgrnd_import_up + ",sizingMethod='scale')"
            });
        } else {
            // For single sprite images do not allow resizing
            background.style.width = (params.width - params.padding*2) + "px";
            background.style.height = (params.height - params.padding*2) + "px";
            background.style.backgroundPosition = "50% 50%";
            background.style.backgroundRepeat = "no-repeat";
            background.style.backgroundImage = "url(" + params.bckgrnd_import_sprite + ")";
        }
    }

    if (!params.txtbtn_trim && labHeight > params.height) {
        label.style.height = params.height + "px";
        label.style.overflow = "hidden";
        labHeight = params.height;
    }

    // Record background dimensions
    bckgrndWidth = $(background).outerWidth();
    bckgrndHeight = $(background).outerHeight();

    // Position label
    label.style.left = (((bckgrndWidth - labWidth) * 0.5) + params.label_left) + "px";
    label.style.top = (((bckgrndHeight - labHeight) * 0.5) + params.label_top) + "px";

    // Stamp CSS Style
    if (params.show_stamp && jQuery.trim(params.stamp_import) !== "") {
        $(stamp).css( {
            'top': (((bckgrndHeight - params.stamp_height) * 0.5) + params.stamp_top) + "px",
            'left': (((bckgrndWidth - params.stamp_width) * 0.5) + params.stamp_left) + "px",
            'width': params.stamp_width + "px",
            'height': params.stamp_height + "px",
            'background-repeat': 'no-repeat',
            'background-size': params.stamp_width + "px " + params.stamp_height + "px",
            'background-position': 'center',
            'background-image': (QUtility.ieVersion() < 9) ?
                "url(" + params.blank_gif + ") " + 'url('+params.stamp_import+')' : 'url('+params.stamp_import+')',
            'filter': "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+params.stamp_import+",sizingMethod='scale')"
        });
    }

    // See if we need to set widget as answered
    if (this.isAnswered()) { this.toggleMouseDown(true); }

    // Set Widget dimensions
    wrap.style.width = Math.max(bckgrndWidth, $(label).outerWidth()) + "px";
    wrap.style.height = bckgrndHeight + "px";
    widget.style.width = wrap.style.width;
    widget.style.height = wrap.style.height;
};

/**
 * RadioCheck Button Widget --> Extends QStudioBtnAbstract
 */
function QRadioCheckBtn(parent, configObj) {
    // Init
    this.init();

    // Create Button Shell
    var that = this,
        doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        widget = doc.createElement("div"),
        wrap = doc.createElement("div"),
        background = doc.createElement("div"),
        label = doc.createElement("label");

    // Widget CSS Style
    widget.className = "qwidget_button";
    widget.dir = "LTR";
    widget.style.cssText += ';'.concat("position: relative;");
    widget.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
    widget.style.cssText += ';'.concat("-webkit-touch-callout: none;");
    widget.style.cssText += ';'.concat("-ms-touch-action: none;");
    widget.style.cssText += ';'.concat("-webkit-user-select: none;");
    widget.style.cssText += ';'.concat("-khtml-user-select: none;");
    widget.style.cssText += ';'.concat("-moz-user-select: none;");
    widget.style.cssText += ';'.concat("-ms-user-select: none;");
    widget.style.cssText += ';'.concat("-user-select: none;");

    // Wrapper CSS Style
    wrap.className = "qwidget_button_wrapper";
    wrap.style.position = "absolute";

    // Background CSS Style
    background.className = "qwidget_button_background";
    background.style.cssText = "position: absolute; filter: inherit;";

    // Label CSS Style
    label.className = "qwidget_button_label";
    label.style.cssText = "position: absolute; display: block; filter: inherit;";
    if (QUtility.ieVersion() <= 8) { label.style.filter = ""; }    // Fix for IE8 Opacity/ClearType bug

    // Append children
    wrap.appendChild(background);
    wrap.appendChild(label);
    widget.appendChild(wrap);
    parentEle.appendChild(widget);

    // Setup
    this._widget = widget;
    this._cache.nodes = {
        wrap: wrap,
        background: background,
        label: label
    };
    this.config(configObj || {});   // This will trigger update method to be called
    this.enabled(true);

    // Add "mouseenter" & "mouseleave" events
    this.addEvent(widget, "mouseenter.widget mouseleave.widget", function(event) {
        that.toggleMouseEnter(event.type === "mouseenter");
    });

    // Add "mouseenter" event for Tooltip
    if (this._params.use_tooltip) {
        this.addEvent(widget, "mouseenter.tooltip", jQuery.proxy(QBaseToolTip.getInstance().toolTipMouseEvent, that));
    }
}
QRadioCheckBtn.prototype = new QStudioBtnAbstract();
QRadioCheckBtn.prototype.config = function(value) {
    if (typeof value !== 'object') {
        return QStudioBtnAbstract.prototype.config.call(this, value);
    }

    QStudioBtnAbstract.prototype.config.call(this, value);
    this._params.radchkbtn_rad_url = (typeof value.radchkbtn_rad_url === 'string') ? value.radchkbtn_rad_url : (this._params.radchkbtn_rad_url || "");
    this._params.radchkbtn_chk_url = (typeof value.radchkbtn_chk_url === 'string') ? value.radchkbtn_chk_url : (this._params.radchkbtn_chk_url || "");
    this._params.radchkbtn_rad_width = (parseInt(value.radchkbtn_rad_width, 10) >= 5) ? parseInt(value.radchkbtn_rad_width, 10) : (this._params.radchkbtn_rad_width || 30);
    this._params.radchkbtn_rad_height = (parseInt(value.radchkbtn_rad_height, 10) >= 5) ? parseInt(value.radchkbtn_rad_height, 10) : (this._params.radchkbtn_rad_height || 30);
    this._params.radchkbtn_chk_width = (parseInt(value.radchkbtn_chk_width, 10) >= 5) ? parseInt(value.radchkbtn_chk_width, 10) : (this._params.radchkbtn_chk_width || 30);
    this._params.radchkbtn_chk_height = (parseInt(value.radchkbtn_chk_height, 10) >= 5) ? parseInt(value.radchkbtn_chk_height, 10) : (this._params.radchkbtn_chk_height || 30);
    this._params.radchkbtn_label_width = (parseInt(value.radchkbtn_label_width, 10) >= 5) ? parseInt(value.radchkbtn_label_width, 10) : (this._params.radchkbtn_label_width || 100);
    this._params.radchkbtn_label_left = (Math.abs(parseInt(value.radchkbtn_label_left, 10)) >= 0) ? parseInt(value.radchkbtn_label_left, 10) :
        ((typeof this._params.radchkbtn_label_left === 'number') ? this._params.radchkbtn_label_left : 0);
    this._params.radchkbtn_label_top = (Math.abs(parseInt(value.radchkbtn_label_top, 10)) >= 0) ? parseInt(value.radchkbtn_label_top, 10) :
        ((typeof this._params.radchkbtn_label_top === 'number') ? this._params.radchkbtn_label_top : 0);
    this._params.radchkbtn_label_fontsize = (parseInt(value.radchkbtn_label_fontsize, 10) >= 5) ? parseInt(value.radchkbtn_label_fontsize, 10) : (this._params.radchkbtn_label_fontsize || 14);
    this._params.radchkbtn_label_fontcolor_up = QUtility.paramToHex(value.radchkbtn_label_fontcolor_up) ||
        ((typeof this._params.radchkbtn_label_fontcolor_up === 'string') ? this._params.radchkbtn_label_fontcolor_up : '333333');
    this._params.radchkbtn_label_fontcolor_over = QUtility.paramToHex(value.radchkbtn_label_fontcolor_over) ||
        ((typeof this._params.radchkbtn_label_fontcolor_over === 'string') ? this._params.radchkbtn_label_fontcolor_over : '333333');
    this._params.radchkbtn_label_fontcolor_down = QUtility.paramToHex(value.radchkbtn_label_fontcolor_down) ||
        ((typeof this._params.radchkbtn_label_fontcolor_down === 'string') ? this._params.radchkbtn_label_fontcolor_down : '333333');
    this._params.radchkbtn_label_halign = (function(that) {
        if (typeof value.radchkbtn_label_halign === 'string') {
            value.radchkbtn_label_halign = value.radchkbtn_label_halign.toLowerCase();
            if (value.radchkbtn_label_halign === 'left' ||
                value.radchkbtn_label_halign === 'right' ||
                value.radchkbtn_label_halign === 'center') {
                that._params_restrict.radchkbtn_label_halign = value.radchkbtn_label_halign;
            }
        }
        return (that._params_restrict.radchkbtn_label_halign || 'left');
    }(this));

    // Update widget
    this.update();
    value = null;
    return this;
};
QRadioCheckBtn.prototype.update = function() {
    if (!this.widget()) { return null; }
    var doc = document,
        widget = this.widget(),
        params = this.config(),
        cache = this.cache(),
        wrap = cache.nodes.wrap,
        background = cache.nodes.background,
        label = cache.nodes.label,
        bckgrnd_url = (this.isRadio()) ? params.radchkbtn_rad_url : params.radchkbtn_chk_url,
        bckgrnd_width = (this.isRadio()) ? params.radchkbtn_rad_width : params.radchkbtn_chk_width,
        bckgrnd_height = (this.isRadio()) ? params.radchkbtn_rad_height : params.radchkbtn_chk_height,
        labPadding = 3,
        labWidth = 0,
        labHeight = 0;

    // Hide Widget while we update
    wrap.style.display = "none";

    // Set widget ID
    widget.id = params.id;

    // Label CSS Style
    label.dir = (!params.isRTL) ? "LTR" : "RTL";
    label.style.whiteSpace = "normal";
    label.style.wordWrap = "break-word";
    label.style.textAlign = (!params.isRTL) ? params.radchkbtn_label_halign : "";
    label.style.fontSize = QUtility.convertPxtoEM(params.radchkbtn_label_fontsize) + "em";
    label.style.width = "auto";
    label.style.height = "auto";
    label.style.color = "#" + params.radchkbtn_label_fontcolor_up;
    label.style[(!params.isRTL) ? "paddingLeft" : "paddingRight"] = labPadding + "px";
    //label.style.backgroundColor = "#CCC";
    label.style.visibility = "hidden";
    label.innerHTML = params.label;
    // Temporarily append label to doc.body to calculate label width/height
    doc.body.appendChild(label);
    labWidth = $(label).outerWidth();
    // Append back to widget
    label.style.width = ((labWidth < params.radchkbtn_label_width) ? labWidth : params.radchkbtn_label_width) + "px";
    labWidth = $(label).outerWidth();
    labHeight = $(label).outerHeight();
    wrap.appendChild(label);
    label.style.position = "relative";
    label.style.top = (params.radchkbtn_label_top - bckgrnd_height) +  "px";
    label.style.left = (((!params.isRTL) ? bckgrnd_width : 0) + params.radchkbtn_label_left) + "px";
    label.style.visibility = "";

    // Background CSS Style
    background.style.cssText = "position: relative; filter: inherit;";
    background.style.width = bckgrnd_width + "px";
    background.style.height = bckgrnd_height + "px";
    background.style.backgroundPosition = "50% 50%";
    background.style.backgroundRepeat = "no-repeat";
    background.style.backgroundImage = "url(" + bckgrnd_url + ")";
    background.style.left = (!params.isRTL) ? "" : labWidth + "px";
    background.style.border = "0px none";
    if (bckgrnd_url === "") {
        var inputFormBtn = doc.createElement("input");
        inputFormBtn.style.margin = 0;
        inputFormBtn.style.padding = 0;
        inputFormBtn.style.width = "100%";
        inputFormBtn.style.height = "100%";
        inputFormBtn.style.cursor = "inherit";
        inputFormBtn.type = (this.isRadio()) ? "radio" : "checkbox";
        inputFormBtn.disabled = this.enabled();
        background.appendChild(inputFormBtn);
        cache.nodes.formBtn = inputFormBtn;
    }

    // See if we need to set widget as answered
    if (this.isAnswered()) { this.toggleMouseDown(true); }

    // Display again and set Widget dimensions
    wrap.style.display = "";
    wrap.style.width = (bckgrnd_width + labWidth) +  "px";
    wrap.style.height = Math.max(labHeight, bckgrnd_height) +  "px";
    widget.style.width = wrap.style.width;
    widget.style.height = wrap.style.height;
};
QRadioCheckBtn.prototype.toggleMouseEnter = function(value) {
    if (!this.widget() || this.cache().isDown) { return null; }
    if (this.enabled() && !this.isAnswered()) {
        var params = this.config(),
            cache = this.cache(),
            wrap = cache.nodes.wrap,
            background = cache.nodes.background,
            label = cache.nodes.label,
            fontcolor = (value) ? params.radchkbtn_label_fontcolor_over : params.radchkbtn_label_fontcolor_up;

        // Imported background image change position
        background.style.backgroundPosition = (value) ? '0% 50%' : '50% 50%';

        // Label color change
        label.style.color = '#' + fontcolor;

        // Widget bounce animation
        if (params.mouseover_bounce) {
            if (value) {
                $(wrap).animate({"top": "2px" }, 170, function() {
                    $(this).animate({"top": "" }, 200);
                });
            } else {
                $(wrap).stop();
                wrap.style.top = "";
            }
        }
    }
};
QRadioCheckBtn.prototype.toggleMouseDown = function(value) {
    if (!this.widget()) { return null; }
    this._cache.isDown = value;
    var params = this.config(),
        cache = this.cache(),
        wrap = cache.nodes.wrap,
        background = cache.nodes.background,
        label = cache.nodes.label,
        fontcolor = (value) ? params.radchkbtn_label_fontcolor_down : params.radchkbtn_label_fontcolor_up,
        alpha_val = value ? params.mousedown_alpha : 1;

    if (cache.nodes.formBtn) {
        cache.nodes.formBtn.checked = value;
    } else {
        // Imported background image change position
        background.style.backgroundPosition = (value) ? '100% 50%' : '50% 50%';
    }

    // Label color change
    label.style.color = '#' + fontcolor;

    // Button opacity animation
    if (this.enabled()) {
        for (var key in cache.nodes) {
            if (cache.nodes.hasOwnProperty(key)) {
                var node = cache.nodes[key];
                if (node !== wrap) {
                    $(node).css( { "opacity": alpha_val } );
                }
            }
        }
    }
};

/**
 * KantarBase Button Widget --> Extends QStudioBtnAbstract
 */
function QKantarBaseBtn(parent, configObj) {
    // Init
    this.init();

    // Create Button Shell
    var that = this,
        doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        widget = doc.createElement("div"),
        wrap = doc.createElement("div"),
        background = doc.createElement("div"),
        imageContain = doc.createElement("div"),
        image = doc.createElement("img"),
        label = doc.createElement("label"),
        stamp = doc.createElement("div");

    // Widget CSS Style
    widget.className = "qwidget_button";
    widget.dir = "LTR";
    widget.style.cssText += ';'.concat("position: relative;");
    widget.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
    widget.style.cssText += ';'.concat("-webkit-touch-callout: none;");
    widget.style.cssText += ';'.concat("-ms-touch-action: none;");
    widget.style.cssText += ';'.concat("-webkit-user-select: none;");
    widget.style.cssText += ';'.concat("-khtml-user-select: none;");
    widget.style.cssText += ';'.concat("-moz-user-select: none;");
    widget.style.cssText += ';'.concat("-ms-user-select: none;");
    widget.style.cssText += ';'.concat("-user-select: none;");

    // Wrapper CSS Style
    wrap.className = "qwidget_button_wrapper";
    wrap.style.position = "relative";

    // Background CSS Style
    background.className = "qwidget_button_background";
    background.style.cssText = "position: relative; filter: inherit;";

    // Image Container CSS Style
    imageContain.className = "qwidget_button_image_container";
    imageContain.style.cssText = "position: absolute; filter: inherit;";

    // Image CSS Style
    image.className = "qwidget_button_image";
    image.style.cssText = "position: absolute; filter: inherit; width: auto; height: auto; max-width: 100%; max-height: 100%;";

    // Label CSS Style
    label.className = "qwidget_button_label";
    label.style.cssText = "position: absolute; display: block; filter: inherit;";
    if (QUtility.ieVersion() <= 8) { label.style.filter = ""; }    // Fix for IE8 Opacity/ClearType bug

    // Stamp CSS Style
    stamp.className = "qwidget_button_stamp";
    stamp.style.cssText = "position: absolute; filter: inherit; display: none;";

    // Append children
    imageContain.appendChild(image);
    wrap.appendChild(background);
    wrap.appendChild(imageContain);
    wrap.appendChild(label);
    wrap.appendChild(stamp);
    widget.appendChild(wrap);
    parentEle.appendChild(widget);

    // Setup
    this._widget = widget;
    this._cache.nodes = {
        wrap: wrap,
        background: background,
        imageContain: imageContain,
        image: image,
        label: label,
        stamp: stamp
    };
    this.config(configObj || {});   // This will trigger update method to be called
    this.enabled(true);

    // Add "mouseenter" & "mouseleave" events
    this.addEvent(widget, "mouseenter.widget mouseleave.widget", function(event) {
        that.toggleMouseEnter(event.type === "mouseenter");
    });

    // Add "mouseenter" event for Tooltip
    if (this._params.use_tooltip) {
        this.addEvent(widget, "mouseenter.tooltip", jQuery.proxy(QBaseToolTip.getInstance().toolTipMouseEvent, that));
    }
}
QKantarBaseBtn.prototype = new QStudioBtnAbstract();
QKantarBaseBtn.prototype.config = function(value) {
    if (typeof value !== 'object') {
        return QStudioBtnAbstract.prototype.config.call(this, value);
    }

    QStudioBtnAbstract.prototype.config.call(this, value);
    this._params.kantarbtn_label_width = (parseInt(value.kantarbtn_label_width, 10) > 0) ?
        parseInt(value.kantarbtn_label_width, 10) : (this._params.kantarbtn_label_width || 100);
    this._params.zoom_top = (Math.abs(parseInt(value.zoom_top, 10)) >= 0) ? parseInt(value.zoom_top, 10) :
        ((typeof this._params.zoom_top === 'number') ? this._params.zoom_top : 0);
    this._params.zoom_left = (Math.abs(parseInt(value.zoom_left, 10)) >= 0) ? parseInt(value.zoom_left, 10) :
        ((typeof this._params.zoom_left === 'number') ? this._params.zoom_left : 0);

    // Update widget
    this.update();
    value = null;
    return this;
};
QKantarBaseBtn.prototype.update = function() {
    if (!this.widget()) { return null; }
    var that = this,
        doc = document,
        lightBoxInstance = QBaseLightBox.getInstance(),
        widget = this.widget(),
        params = this.config(),
        cache = this.cache(),
        wrap = cache.nodes.wrap,
        background = cache.nodes.background,
        imageContain = cache.nodes.imageContain,
        image = cache.nodes.image,
        stamp = cache.nodes.stamp,
        label = cache.nodes.label,
        width_padding = params.width + params.padding * 2,
        height_padding = params.height + params.padding * 2,
        border_width = params.border_width_up,
        bgWidthOffset = 3,
        labHeight = 0,
        labWidth = 0;

    // Hide Widget while we update
    wrap.style.display = "none";

    // Set widget ID
    widget.id = params.id;

    // Label CSS Style
    label.style.display = (jQuery.trim(params.label).length > 0) ? "block" : "none";
    if (label.style.display !== "none") {
        label.dir = (!params.isRTL) ? "LTR" : "RTL";
        label.style.whiteSpace = "normal";
        label.style.wordWrap = "break-word";
        label.style.textAlign = (!params.isRTL) ? params.label_halign : "";
        label.style.fontSize = QUtility.convertPxtoEM(params.label_fontsize) + "em";
        label.style.height = "auto";
        label.style.width = "auto";
        label.style.color = "#" + params.label_fontcolor_up;
        //label.style.backgroundColor = "#CCC";
        label.style.visibility = "hidden";
        label.innerHTML = params.label;
        // Temporarily append label to doc.body to calculate label width/height
        doc.body.appendChild(label);
        labWidth = $(label).width();
        if (labWidth > params.kantarbtn_label_width) { labWidth = params.kantarbtn_label_width; }
        label.style.width = labWidth + "px";
        labHeight = $(label).height();
        // Append back to widget
        wrap.insertBefore(label, stamp);
        (params.label_placement === 'top') ?
            label.style.top = (border_width +  params.label_top) + "px":                                    // Top label placement
            label.style.top = ((border_width + height_padding - labHeight) + params.label_top) + 'px';      // Bottom label placement
        label.style.left = (width_padding + border_width + params.label_left) + "px";
        label.style.visibility = "";
    }

    // Background CSS Style
    params.bckgrnd_import_sprite = "";  // Widget does not support sprite image since the background requires resizing
    background.style.cssText = "position: relative; filter: inherit;";
    background.style.width = (labWidth + params.width + bgWidthOffset) + "px";
    background.style.height = params.height + "px";
    background.style.padding = params.padding + "px";
    background.style.borderRadius = background.style.webkitBorderRadius = background.style.mozBorderRadius = params.border_radius + "px";
    background.style.border = border_width + "px " + params.border_style + " #" + params.border_color_up;
    if (!params.show_bckgrnd_import) {
        background.style.backgroundColor = "#" + params.bckgrnd_color_up;
    } else {
        $(background).css( {
            'background-repeat': 'no-repeat',
            'background-size': "100% 100%", //(labWidth + width_padding + 'px ' + height_padding + 'px'),
            'background-position': "50% 50%",
            'background-image': (QUtility.ieVersion() < 9) ?
                "url(" + params.blank_gif + ") " + 'url(' + params.bckgrnd_import_up + ')' : 'url(' + params.bckgrnd_import_up + ')',
            'filter': "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + params.bckgrnd_import_up + ", sizingMethod='scale')"
        });
    }

    // Stamp CSS Style
    if (params.show_stamp && jQuery.trim(params.stamp_import) !== "") {
        $(stamp).css( {
            'top': (((height_padding + border_width*2 - params.stamp_height) * 0.5) + params.stamp_top) + "px",
            'left': (((labWidth + width_padding + border_width*2 - params.stamp_width) * 0.5) + params.stamp_left) + "px",
            'width': params.stamp_width + "px",
            'height': params.stamp_height + "px",
            'background-repeat': 'no-repeat',
            'background-size': params.stamp_width + "px " + params.stamp_height + "px",
            'background-position': 'center',
            'background-image': (QUtility.ieVersion() < 9) ?
                "url(" + params.blank_gif + ") " + 'url('+params.stamp_import+')' : 'url('+params.stamp_import+')',
            'filter': "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+params.stamp_import+",sizingMethod='scale')"
        });
    }

    // See about adding a zoom image button
    if (params.use_lightbox) {
        var zoomBtn = lightBoxInstance.init(this),
            actionType = lightBoxInstance.config().action_type.toLowerCase();

        if (zoomBtn && zoomBtn.nodeType === 1) {
            zoomBtn.style.display = "none";
            zoomBtn.style.top = (1 + params.zoom_top) + "px";
            zoomBtn.style.left = (1 + params.zoom_left) + "px";
            if (!zoomBtn.parentNode) {
                (actionType.indexOf("image") !== -1) ?
                    imageContain.appendChild(zoomBtn):
                    wrap.insertBefore(zoomBtn, stamp);
            }
        }
    } else {
        if (lightBoxInstance) { lightBoxInstance.remove(this); }
    }

    // Image CSS Style
    if (jQuery.trim(params.image) !== "") {
        imageContain.style.display = "none";
        imageContain.style.visibility = "hidden";
        image.src = params.image;

        // On error
        $(image).on("error", function() {
            if (lightBoxInstance) { lightBoxInstance.remove(that); }
            $(this).off("error");
            imageContain.style.display = "none";
        });

        // On Load
        $(image).on("load", function() {
            // Image Container CSS Style
            imageContain.style.display = "block";
            imageContain.style.top = "-5000px";
            imageContain.style.left = "-5000px";
            imageContain.style.width = params.width + "px";
            imageContain.style.height = params.height + "px";

            // Temporarily append imageContain to doc.body to calculate image centering position
            doc.body.appendChild(imageContain);
            this.style.maxWidth = params.width + "px";
            this.style.maxHeight = params.height + "px";
            this.style.top = params.img_top + "px";
            this.style.left =  params.img_left + "px";
            imageContain.style.top = (((height_padding + border_width*2 - $(this).height()) * 0.5)) + "px";
            imageContain.style.left = (((width_padding + border_width*2 - $(this).width()) * 0.5)) + "px";
            imageContain.style.width = $(this).width() + "px";
            imageContain.style.height = $(this).height() + "px";

            // Remove listener, add image back to background div, and remove temporary div
            $(this).on('dragstart.widget', function(event) { event.preventDefault(); });
            $(this).off("load");
            wrap.insertBefore(imageContain, wrap.children[1]);
            imageContain.style.visibility = "";

            // Zoom Button display
            if (cache.nodes.zoomBtn) { cache.nodes.zoomBtn.style.display = "block"; }
        }).attr("src", params.image);
    } else {
        imageContain.style.display = "none";
    }

    // See if we need to set widget as answered
    if (this.isAnswered()) { this.toggleMouseDown(true); }

    // Display again and set Widget dimensions
    wrap.style.display = "";
    wrap.style.width = $(background).outerWidth() + "px";
    wrap.style.height = $(background).outerHeight() + "px";
    widget.style.width = wrap.style.width;
    widget.style.height = wrap.style.height;
};

/**
 * QStudio Other Button Abstract --> Extends QStudioDCAbstract
 */
function QStudioInputBtnAbstract() {
    // Do not instantiate. Subclasses should inherit from QStudioInputBtnAbstract.
}
QStudioInputBtnAbstract.prototype = new QStudioDCAbstract();
QStudioInputBtnAbstract.prototype.destroy = function() {
    if (!this._widget) { return null; }
    var widget = this.widget(),
        cache = this.cache(),
        textarea = cache.nodes.textarea;

    // Remove events
    this.removeEvent(widget);
    this.removeEvent(textarea);

    // Remove widget
    if (widget.parentNode) { widget.parentNode.removeChild(widget); }

    // GC
    this._widget = null;
    this._cache = {};
    this._params = {};

    return this;
};
QStudioInputBtnAbstract.prototype.config = function(value) {
    if (!this.widget()) { return null; }
    if (typeof value !== 'object') {
        return QStudioBtnAbstract.prototype.config.call(this, value);
    }

    QStudioBtnAbstract.prototype.config.call(this, value);
    this._params.textarea_halign = (function(that) {
        if (typeof value.textarea_halign === 'string') {
            value.textarea_halign = value.textarea_halign.toLowerCase();
            if (value.textarea_halign === 'left' ||
                value.textarea_halign === 'right' ||
                value.textarea_halign === 'center') {
                that._params_restrict.textarea_halign = value.textarea_halign;
            }
        }
        return (that._params_restrict.textarea_halign || 'left');
    }(this));
    this._params.textarea_fontsize = (parseInt(value.textarea_fontsize, 10) >= 5) ? parseInt(value.textarea_fontsize, 10) : (this._params.textarea_fontsize || 14);
    this._params.textarea_fontcolor = QUtility.paramToHex(value.textarea_fontcolor) ||
        ((typeof this._params.textarea_fontcolor === 'string') ? this._params.textarea_fontcolor : '333333');
    this._params.allow_click = (typeof value.allow_click !== 'undefined') ? !!value.allow_click :
        ((typeof this._params.allow_click === 'boolean') ? this._params.allow_click : true);
    this._params.other_init_txt = (typeof value.other_init_txt === 'string') ? value.other_init_txt : (this._params.other_init_txt || "Please specify...");
    this._params.other_msg_invalid = (typeof value.other_msg_invalid === 'string') ? value.other_msg_invalid : (this._params.other_msg_invalid || "Number is not valid");
    this._params.other_msg_range = (typeof value.other_msg_range === 'string') ? value.other_msg_range : (this._params.other_msg_range || "Number is not within range");
    this._params.other_min = (Math.abs(parseInt(value.other_min, 10) >= 0)) ? parseInt(value.other_min, 10) :
        ((typeof this._params.other_min === 'number') ? this._params.other_min : null);
    this._params.other_max = (Math.abs(parseInt(value.other_max, 10) >= 0)) ? parseInt(value.other_max, 10) :
        ((typeof this._params.other_max === 'number') ? this._params.other_max : null);
    this._params.max_char = (Math.abs(parseInt(value.max_char, 10) > 0)) ? parseInt(value.max_char, 10) :
        ((typeof this._params.max_char === 'number') ? this._params.max_char : null);

    value = null;
};
QStudioInputBtnAbstract.prototype.type = function() {
    return "input button";
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
    return QStudioBtnAbstract.prototype.isAnswered.call(this, value);
};
QStudioInputBtnAbstract.prototype.enabled = function(value, configObj) {
    if (!this.widget()) { return null; }
    var cache = this.cache();
    if (typeof value === 'boolean') {
        var params = this.config(),
            wrap = cache.nodes.wrap,
            textarea = cache.nodes.textarea,
            label = cache.nodes.label,
            formBtn = cache.nodes.formBtn;

        cache._enableBool = value;
        // Init config object
        configObj = configObj || {};
        configObj = {
            isAnimate : (typeof configObj.isAnimate === "boolean") ? configObj.isAnimate : false,
            animSpeed : (typeof configObj.animSpeed === "number" && configObj.animSpeed >= 100) ? configObj.animSpeed : 800,
            goOpaque : (typeof configObj.goOpaque === "boolean") ? configObj.goOpaque : false,
            enableExtEvt : (typeof configObj.enableExtEvt === "boolean") ? configObj.enableExtEvt : false,
            alphaVal : (!cache._enableBool) ?
                ((parseInt(configObj.alphaVal, 10) >= 0) ? parseInt(configObj.alphaVal, 10) : 50) :
                (this.isAnswered()) ? params.mousedown_alpha*100 : 100
        };

        if (!cache._enableBool) {
            // Record whether we should still allow external events when widget is disabled
            cache._enableExtEvt = configObj.enableExtEvt;
            wrap.style.zIndex = "auto";
        }

        // Enable/disable button state
        wrap.style.cursor = (cache._enableBool) ? 'pointer' : 'default';
        if (label) { label.style.cursor = (cache._enableBool) ? 'pointer' : 'default'; }
        if (formBtn) { formBtn.disabled = (!cache._enableBool); }
        if (textarea) { textarea.disabled = !cache._enableBool; }
        for (var key in cache.nodes) {
            if (cache.nodes.hasOwnProperty(key)) {
                var cond = (configObj.goOpaque) ? (key !== "background" && key !== "wrap") : (key !== "wrap");
                if (cond) {
                    var node = cache.nodes[key];
                    if (!configObj.isAnimate) {
                        $(node).css( { "opacity": configObj.alphaVal *.01 } );
                    } else {
                        $(node).animate( { "opacity": configObj.alphaVal *.01 }, configObj.animSpeed );
                    }
                }
            }
        }
    }

    return cache._enableBool;
};
QStudioInputBtnAbstract.prototype.touchEnabled = function(value) {
    if (!this.widget()) { return null; }
    var cache = this.cache();
    if (typeof value === 'boolean' && cache._touchEnableBool !== value) {
        cache._touchEnableBool = value;
        if (cache._touchEnableBool) {
            this.removeEvent(this.widget(), "mouseenter.widget mouseleave.widget mouseenter.tooltip");
            this.removeEvent(cache.nodes.textarea, "click.widget mousedown.widget");
        }
    }

    return cache._touchEnableBool;
};
QStudioInputBtnAbstract.prototype.textarea = function(value) {
    if (!this.widget()) { return null; }
    var cache = this.cache(),
        textarea = cache.nodes.textarea;

    if (typeof value === 'string' || typeof value === 'number') {
        textarea.value = value;
    }

    return textarea.value;
};
QStudioInputBtnAbstract.prototype.isNumeric = function(value) {
    if (!this.widget()) { return null; }
    var cache = this.cache();
    if (typeof value === 'boolean' && cache._isNumeric !== value) {
        var that = this,
            msgDispInstance = QBaseMsgDisplay.getInstance(),
            widget = this.widget(),
            textarea = cache.nodes.textarea,
            txtEvent = (QUtility.isTouchDevice() && "oninput" in textarea) ? "input.widget" : "keydown.widget keyup.widget";

        // To fix IE9 bug where input event does not fire on backspace/del
        if (QUtility.ieVersion() <= 9) { txtEvent = "keydown.widget keyup.widget"; }

        cache._isNumeric = value;
        // Add TextArea 'keydown' & 'keyup' events
        if (cache._isNumeric) {
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
                        if (keyCode < 48) { event.preventDefault(); }
                        else if (keyCode > 57 && keyCode < 96) { event.preventDefault(); }
                        else if (keyCode > 105) { event.preventDefault(); }
                    }
                } else {
                    var isValid = that.isInputValid(),
                        top = $(textarea).outerHeight() + parseInt(textarea.style.top, 10) + 5,
                        left = parseInt(textarea.style.left, 10);

                    if (isValid === null) {
                        //console.log("** Show Range number error");
                        this.style.borderColor = '#FF0000';
                        msgDispInstance.show({
                            text: that._params.other_msg_range,
                            target: widget,
                            top: top,
                            left: left
                        });
                    } else if (isNaN(isValid)) {
                        //console.log("** Show Invalid number error");
                        this.style.borderColor = '#FF0000';
                        msgDispInstance.show({
                            text: that._params.other_msg_invalid,
                            target: widget,
                            top: top,
                            left: left
                        });
                    } else if (isValid) {
                        //console.log("--> Hide Error");
                        this.style.borderColor = '#BBB';
                        msgDispInstance.hide();
                    }
                }
            });
        } else {
            this.removeEvent(textarea, txtEvent);
            textarea.blur();
            if (msgDispInstance && msgDispInstance.isShowing()) {
                textarea.style.borderColor = '#BBB';
                msgDispInstance.hide();
            }
        }
    }

    return cache._isNumeric;
};
// return null if number is out of range
// return NaN if number is not valid
QStudioInputBtnAbstract.prototype.isInputValid = function() {
    if (!this.widget()) { return null; }
    var msgDispInstance = QBaseMsgDisplay.getInstance(),
        params = this.config(),
        cache = this.cache(),
        textarea = cache.nodes.textarea,
        input = textarea.value.toLowerCase(),
        inputValid = (jQuery.trim(input) !== '' && input !== textarea.defaultValue.toLowerCase());

    if (this.isNumeric()) {
        if (input.length === 0) {
            msgDispInstance.hide();
            return false;
        }

        if (inputValid && QUtility.isNumber(input)) {
            // Number is less than minimum
            if (input < params.other_min) { return null; }
            // Number is greater than maximum
            if (input > params.other_max) { return null; }
            return true;
        } else {
            return (inputValid) ? NaN : false;
        }
    } else {
        return inputValid;
    }
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

/**
 * Base Input Button Widget --> Extends QStudioInputBtnAbstract
 */
function QBaseInputBtn(parent, configObj) {
    // Init
    this.init();

    // Create Button Shell
    var that = this,
        doc = document,
        msgDispInstance = QBaseMsgDisplay.getInstance(),
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        widget = doc.createElement("div"),
        wrap = doc.createElement("div"),
        background = doc.createElement("div"),
        textarea = doc.createElement("textarea"),
        label = doc.createElement("label"),
        stamp = doc.createElement("div"),
        txtAreaEvent = (!QUtility.isMSTouch()) ?
            ((!QUtility.isTouchDevice()) ? "click.widget" : "touchstart.widget touchend.widget touchmove.widget"):
            ((!QUtility.isTouchDevice()) ? "click.widget" : ((window.PointerEvent) ? "pointerdown.widget pointerup.widget" : "MSPointerDown.widget MSPointerUp.widget")),
        isTouchMove = false;

    // Widget CSS Style
    widget.className = "qwidget_button";
    widget.dir = "LTR";
    widget.style.cssText += ';'.concat("position: relative; overflow: visible;");
    widget.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
    widget.style.cssText += ';'.concat("-webkit-touch-callout: none;");
    widget.style.cssText += ';'.concat("-ms-touch-action: none;");
    widget.style.cssText += ';'.concat("-webkit-user-select: none;");
    widget.style.cssText += ';'.concat("-khtml-user-select: none;");
    widget.style.cssText += ';'.concat("-moz-user-select: none;");
    widget.style.cssText += ';'.concat("-ms-user-select: none;");
    widget.style.cssText += ';'.concat("-user-select: none;");

    // Wrapper CSS Style
    wrap.className = "qwidget_button_wrapper";
    wrap.style.position = "relative";

    // Background CSS Style
    background.className = "qwidget_button_background";
    background.style.cssText = "position: relative; filter: inherit;";

    // Textarea CSS Style
    textarea.className = "qwidget_button_textarea";
    textarea.style.cssText = "position: absolute; filter: inherit; overflow: auto; border: 1px solid #BBB; margin: 0; padding: 0;";

    // Label CSS Style
    label.className = "qwidget_button_label";
    label.style.cssText = "position: absolute; filter: inherit;";
    if (QUtility.ieVersion() <= 8) { label.style.filter = ""; }    // Fix for IE8 Opacity/ClearType bug

    // Stamp CSS Style
    stamp.className = "qwidget_button_stamp";
    stamp.style.cssText = "position: absolute; filter: inherit; display: none;";

    // Append children
    wrap.appendChild(background);
    wrap.appendChild(textarea);
    wrap.appendChild(label);
    wrap.appendChild(stamp);
    widget.appendChild(wrap);
    parentEle.appendChild(widget);

    // Setup
    this._widget = widget;
    this._cache.nodes = {
        wrap: wrap,
        background: background,
        textarea: textarea,
        label: label,
        stamp: stamp
    };
    this.config(configObj || {});   // This will trigger update method to be called
    this.enabled(true);

    // Add "mouseenter" & "mouseleave" events
    this.addEvent(widget, "mouseenter.widget mouseleave.widget", function(event) {
        that.toggleMouseEnter(event.type === "mouseenter");
    });

    // Add "mouseenter" event for Tooltip
    if (this._params.use_tooltip) {
        this.addEvent(widget, "mouseenter.tooltip", jQuery.proxy(QBaseToolTip.getInstance().toolTipMouseEvent, that));
    }

    // Add TextArea events
    this.addEvent(textarea, txtAreaEvent, function(event) {
        event.stopPropagation();
        if (event.type !== "touchmove") {
            if (event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                if (!isTouchMove) { textarea.focus(); }
            } else {
                isTouchMove = false;
            }
        } else {
            isTouchMove = true;
        }
    });

    // Add TextArea 'focus' & 'blur' events
    this.addEvent(textarea, "focus.widget blur.widget", function(event) {
        event.stopPropagation();
        event.preventDefault();

        if (!that.isAnswered() && !that.isInputValid()) {
            that.textarea((event.type === 'focus') ? '' : that._params.other_init_txt);
            if (that.isNumeric() && event.type === 'blur') {
                this.style.borderColor = '#BBB';
                msgDispInstance.hide();
            }
        }
    });

    // See about adding a maxChar counter for textArea
    if ((this._params.max_char > 0) && !("maxLength" in textarea)) {
        $(textarea).on("keyup.count.widget blur.count.widget", function(event) {
            if(this.value.length > that._params.max_char) {
                this.value = this.value.substr(0, that._params.max_char);
                return false;
            }
        });
    }
}
QBaseInputBtn.prototype = new QStudioInputBtnAbstract();
QBaseInputBtn.prototype.config = function(value) {
    if (!this.widget()) { return null; }
    if (typeof value !== 'object') {
        return QStudioInputBtnAbstract.prototype.config.call(this, value);
    }

    QStudioInputBtnAbstract.prototype.config.call(this, value);

    // Update widget
    this.update();
    value = null;
    return this;
};
QBaseInputBtn.prototype.update = function() {
    if (!this.widget()) { return null; }
    var doc = document,
        widget = this.widget(),
        params = this.config(),
        cache = this.cache(),
        wrap = cache.nodes.wrap,
        background = cache.nodes.background,
        textarea = cache.nodes.textarea,
        label = cache.nodes.label,
        stamp = cache.nodes.stamp,
        border_width = params.border_width_up,
        paramWidth = params.width,
        paramHeight = params.height,
        bckgrndWidth = 0,
        bckgrndHeight = 0,
        txtarea_width = 0,
        txtarea_height = 0,
        minRegExp = /\bmin\b/ig,
        maxRegExp = /\bmax\b/ig,
        labHeight = 0,
        txtAreaEvent = (!QUtility.isMSTouch()) ?
            "click.widget touchstart.widget":
            (window.PointerEvent) ? "pointerdown.widget" : "MSPointerDown.widget";

    // Hide Widget while we update
    wrap.style.display = "none";

    // Set widget ID
    widget.id = params.id;

    // Replace the words 'min' and 'max' in the range message w/ the actual values
    if (typeof params.other_min === 'number') {
        params.other_msg_range = params.other_msg_range.replace(minRegExp, params.other_min);
    }
    if (typeof params.other_max === 'number') {
        params.other_msg_range = params.other_msg_range.replace(maxRegExp, params.other_max);
    }

    // Background CSS Style
    background.style.cssText = "position: relative; filter: inherit;";
    background.style.width = params.width + "px";
    background.style.height = params.height + "px";
    background.style.padding = params.padding + "px";
    background.style.visibility = (params.show_bckgrnd) ? "visible" : "hidden";
    background.style.borderRadius = background.style.webkitBorderRadius = background.style.mozBorderRadius = params.border_radius + "px";
    background.style.border = border_width + "px " + params.border_style + " #" + params.border_color_up;
    if (!params.show_bckgrnd_import) {
        background.style.backgroundColor = "#" + params.bckgrnd_color_up;
    } else {
        if (!(params.bckgrnd_import_sprite !== "")) {
            $(background).css( {
                'background-repeat': 'no-repeat',
                'background-size': "100% 100%",
                'background-position': "50% 50%",
                'background-image': (QUtility.ieVersion() < 9) ?
                    "url(" + params.blank_gif + ") " + 'url(' + params.bckgrnd_import_up + ')' : 'url(' + params.bckgrnd_import_up + ')',
                'filter': "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + params.bckgrnd_import_up + ",sizingMethod='scale')"
            });
        } else {
            // For single sprite images
            paramWidth = params.width - params.padding*2;
            paramHeight = params.height - params.padding*2;
            background.style.width = paramWidth + "px";
            background.style.height = paramHeight + "px";
            background.style.backgroundPosition = "50% 50%";
            background.style.backgroundRepeat = "no-repeat";
            background.style.backgroundImage = "url(" + params.bckgrnd_import_sprite + ")";
        }
    }

    // Record background dimensions
    bckgrndWidth = $(background).outerWidth();
    bckgrndHeight = $(background).outerHeight();

    // Label CSS Style
    label.style.display = (params.show_label) ? "block" : "none";
    if (params.show_label) {
        label.dir = (!params.isRTL) ? "LTR" : "RTL";
        label.style.whiteSpace = "normal";
        label.style.wordWrap = "break-word";
        label.style.textAlign = (!params.isRTL) ? params.label_halign : "";
        label.style.fontSize = QUtility.convertPxtoEM(params.label_fontsize) + "em";
        label.style.width = ((!params.label_ovr_width) ? paramWidth : params.label_width) + "px";
        label.style.height = "auto";
        label.style.color = "#" + params.label_fontcolor_up;
        //label.style.backgroundColor = "#CCC";
        label.style.visibility = "hidden";
        label.innerHTML = params.label;
        // Temporarily append label to doc.body to calculate label height
        doc.body.appendChild(label);
        labHeight = $(label).height();
        // Append back to widget
        (params.label_placement === 'top') ?
            wrap.insertBefore(label, background):
            wrap.insertBefore(label, stamp);
        label.style.position = "relative";
        label.style.top = params.label_top + "px";
        label.style.left = (params.label_left + params.padding + border_width) + "px";
        label.style.visibility = "";
    }

    // Adjust for uneven positioning of textarea w/ background
    txtarea_width = (paramWidth * 0.80);
    txtarea_height = (paramHeight * 0.80);
    if ((paramWidth & 1) !== (txtarea_width & 1)) { txtarea_width += 1; }
    if ((paramHeight & 1) !== (txtarea_height & 1)) { txtarea_height += 1; }

    // Textarea CSS Style
    if (!this.isInputValid()) { textarea.value = textarea.defaultValue = params.other_init_txt; }
    textarea.dir = (!params.isRTL) ? "LTR" : "RTL";
    textarea.style.whiteSpace = "normal";
    textarea.style.width = txtarea_width + "px";
    textarea.style.height = txtarea_height + "px";
    textarea.style.top = (((bckgrndHeight - txtarea_height-2) * 0.5) +
        ((params.label_placement === 'top') ? labHeight : 0)) + "px";
    textarea.style.left = (((bckgrndWidth - txtarea_width-2) * 0.5)) + "px";
    textarea.style.textAlign = (!params.isRTL) ? params.textarea_halign : "";
    textarea.style.fontSize = QUtility.convertPxtoEM(params.textarea_fontsize) + "em";
    textarea.style.color = "#" + params.textarea_fontcolor;
    textarea.style.backgroundColor = "#FFFFFF";
    textarea.style.resize = "none";
    // See about adding a maxChar counter for textArea
    if ((params.max_char > 0) && ("maxLength" in textarea)) {
        textarea.maxLength = params.max_char;
    }

    // Stamp CSS Style
    if (params.show_stamp && jQuery.trim(params.stamp_import) !== "") {
        $(stamp).css( {
            'top': (((bckgrndHeight - params.stamp_height) * 0.5) + params.stamp_top + ((params.label_placement === 'top') ? labHeight : 0)) + "px",
            'left': (((bckgrndWidth - params.stamp_width) * 0.5) + params.stamp_left) + "px",
            'width': params.stamp_width + "px",
            'height': params.stamp_height + "px",
            'background-repeat': 'no-repeat',
            'background-size': params.stamp_width + "px " + params.stamp_height + "px",
            'background-position': 'center',
            'background-image': (QUtility.ieVersion() < 9) ?
                "url(" + params.blank_gif + ") " + 'url('+params.stamp_import+')' : 'url('+params.stamp_import+')',
            'filter': "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+params.stamp_import+",sizingMethod='scale')"
        });
    }

    // See if we need to set widget as answered
    if (this.isAnswered()) { this.toggleMouseDown(true); }

    // Display again and set Widget dimensions
    wrap.style.display = "";
    wrap.style.width = (Math.max(bckgrndWidth, $(label).outerWidth())) + "px";
    wrap.style.height = (bckgrndHeight + labHeight) + "px";
    widget.style.width = wrap.style.width;
    widget.style.height = wrap.style.height;

    // See if we need to prevent click behavior
    if (!params.allow_click) {
        this.addEvent(widget, txtAreaEvent, function(event) {
            event.stopPropagation();
        });
    } else {
        this.removeEvent(widget, txtAreaEvent);
    }
};

/**
 * KantarInput Button Widget --> Extends QStudioInputBtnAbstract
 */
function QKantarInputBtn(parent, configObj) {
    // Init
    this.init();

    // Create Button Shell
    var that = this,
        doc = document,
        msgDispInstance = QBaseMsgDisplay.getInstance(),
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        widget = doc.createElement("div"),
        wrap = doc.createElement("div"),
        background = doc.createElement("div"),
        label = doc.createElement("label"),
        textarea = doc.createElement("textarea"),
        txtAreaEvent = (!QUtility.isMSTouch()) ?
            ((!QUtility.isTouchDevice()) ? "click.widget" : "touchstart.widget touchend.widget touchmove.widget"):
            ((!QUtility.isTouchDevice()) ? "click.widget" : ((window.PointerEvent) ? "pointerdown.widget pointerup.widget" : "MSPointerDown.widget MSPointerUp.widget")),
        isTouchMove = false;

    // Widget CSS Style
    widget.className = "qwidget_button";
    widget.dir = "LTR";
    widget.style.cssText += ';'.concat("position: relative; overflow: visible;");
    widget.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
    widget.style.cssText += ';'.concat("-webkit-touch-callout: none;");
    widget.style.cssText += ';'.concat("-ms-touch-action: none;");
    widget.style.cssText += ';'.concat("-webkit-user-select: none;");
    widget.style.cssText += ';'.concat("-khtml-user-select: none;");
    widget.style.cssText += ';'.concat("-moz-user-select: none;");
    widget.style.cssText += ';'.concat("-ms-user-select: none;");
    widget.style.cssText += ';'.concat("-user-select: none;");

    // Wrapper CSS Style
    wrap.className = "qwidget_button_wrapper";
    wrap.style.position = "relative";

    // Background CSS Style
    background.className = "qwidget_button_background";
    background.style.cssText = "position: relative; filter: inherit;";

    // Label CSS Style
    label.className = "qwidget_button_label";
    label.style.cssText = "position: absolute; display: block; filter: inherit;";
    if (QUtility.ieVersion() <= 8) { label.style.filter = ""; }    // Fix for IE8 Opacity/ClearType bug

    // Textarea CSS Style
    textarea.className = "qwidget_button_textarea";
    textarea.style.cssText = "position: absolute; filter: inherit; overflow: auto; border: 1px solid #BBB; margin: 0; padding: 0;";

    // Append children
    wrap.appendChild(background);
    wrap.appendChild(label);
    wrap.appendChild(textarea);
    widget.appendChild(wrap);
    parentEle.appendChild(widget);

    // Setup
    this._widget = widget;
    this._cache.nodes = {
        wrap: wrap,
        background: background,
        label: label,
        textarea: textarea
    };
    this.config(configObj || {});   // This will trigger update method to be called
    this.enabled(true);

    // Add "mouseenter" & "mouseleave" events
    this.addEvent(widget, "mouseenter.widget mouseleave.widget", function(event) {
        that.toggleMouseEnter(event.type === "mouseenter");
    });

    // Add "mouseenter" event for Tooltip
    if (this._params.use_tooltip) {
        this.addEvent(widget, "mouseenter.tooltip", jQuery.proxy(QBaseToolTip.getInstance().toolTipMouseEvent, that));
    }

    // Add TextArea events
    this.addEvent(textarea, txtAreaEvent, function(event) {
        event.stopPropagation();
        if (event.type !== "touchmove") {
            if (event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                if (!isTouchMove) { textarea.focus(); }
            } else {
                isTouchMove = false;
            }
        } else {
            isTouchMove = true;
        }
    });

    // Add TextArea 'focus' & 'blur' events
    this.addEvent(textarea, "focus.widget blur.widget", function(event) {
        event.stopPropagation();
        event.preventDefault();

        if (!that.isAnswered() && !that.isInputValid()) {
            that.textarea((event.type === 'focus') ? '' : that._params.other_init_txt);
            if (that.isNumeric() && event.type === 'blur') {
                this.style.borderColor = '#BBB';
                msgDispInstance.hide();
            }
        }
    });

    // See about adding a maxChar counter for textArea
    if ((this._params.max_char > 0) && !("maxLength" in textarea)) {
        $(textarea).on("keyup.count.widget blur.count.widget", function(event) {
            if(this.value.length > that._params.max_char) {
                this.value = this.value.substr(0, that._params.max_char);
                return false;
            }
        });
    }
}
QKantarInputBtn.prototype = new QStudioInputBtnAbstract();
QKantarInputBtn.prototype.config = function(value) {
    if (!this.widget()) { return null; }
    if (typeof value !== 'object') {
        return QStudioInputBtnAbstract.prototype.config.call(this, value);
    }

    QStudioInputBtnAbstract.prototype.config.call(this, value);
    this._params.kntrinputbtn_rad_url = (typeof value.kntrinputbtn_rad_url === 'string') ? value.kntrinputbtn_rad_url : (this._params.kntrinputbtn_rad_url || "");
    this._params.kntrinputbtn_chk_url = (typeof value.kntrinputbtn_chk_url === 'string') ? value.kntrinputbtn_chk_url : (this._params.kntrinputbtn_chk_url || "");
    this._params.kntrinputbtn_rad_width = (parseInt(value.kntrinputbtn_rad_width, 10) >= 5) ? parseInt(value.kntrinputbtn_rad_width, 10) : (this._params.kntrinputbtn_rad_width || 30);
    this._params.kntrinputbtn_rad_height = (parseInt(value.kntrinputbtn_rad_height, 10) >= 5) ? parseInt(value.kntrinputbtn_rad_height, 10) : (this._params.kntrinputbtn_rad_height || 30);
    this._params.kntrinputbtn_chk_width = (parseInt(value.kntrinputbtn_chk_width, 10) >= 5) ? parseInt(value.kntrinputbtn_chk_width, 10) : (this._params.kntrinputbtn_chk_width || 30);
    this._params.kntrinputbtn_chk_height = (parseInt(value.kntrinputbtn_chk_height, 10) >= 5) ? parseInt(value.kntrinputbtn_chk_height, 10) : (this._params.kntrinputbtn_chk_height || 30);
    this._params.kntrinputbtn_input_width = (parseInt(value.kntrinputbtn_input_width, 10) >= 5) ? parseInt(value.kntrinputbtn_input_width, 10) : (this._params.kntrinputbtn_input_width || 100);
    this._params.kntrinputbtn_label_width = (parseInt(value.kntrinputbtn_label_width, 10) >= 5) ? parseInt(value.kntrinputbtn_label_width, 10) : (this._params.kntrinputbtn_label_width || 100);
    this._params.kntrinputbtn_label_left = (Math.abs(parseInt(value.kntrinputbtn_label_left, 10)) >= 0) ? parseInt(value.kntrinputbtn_label_left, 10) :
        ((typeof this._params.kntrinputbtn_label_left === 'number') ? this._params.kntrinputbtn_label_left : 0);
    this._params.kntrinputbtn_label_top = (Math.abs(parseInt(value.kntrinputbtn_label_top, 10)) >= 0) ? parseInt(value.kntrinputbtn_label_top, 10) :
        ((typeof this._params.kntrinputbtn_label_top === 'number') ? this._params.kntrinputbtn_label_top : 0);
    this._params.kntrinputbtn_label_fontsize = (parseInt(value.kntrinputbtn_label_fontsize, 10) >= 5) ? parseInt(value.kntrinputbtn_label_fontsize, 10) : (this._params.kntrinputbtn_label_fontsize || 14);
    this._params.kntrinputbtn_label_fontcolor_up = QUtility.paramToHex(value.kntrinputbtn_label_fontcolor_up) ||
        ((typeof this._params.kntrinputbtn_label_fontcolor_up === 'string') ? this._params.kntrinputbtn_label_fontcolor_up : '333333');
    this._params.kntrinputbtn_label_fontcolor_over = QUtility.paramToHex(value.kntrinputbtn_label_fontcolor_over) ||
        ((typeof this._params.kntrinputbtn_label_fontcolor_over === 'string') ? this._params.kntrinputbtn_label_fontcolor_over : '333333');
    this._params.kntrinputbtn_label_fontcolor_down = QUtility.paramToHex(value.kntrinputbtn_label_fontcolor_down) ||
        ((typeof this._params.kntrinputbtn_label_fontcolor_down === 'string') ? this._params.kntrinputbtn_label_fontcolor_down : '333333');
    this._params.kntrinputbtn_label_halign = (function(that) {
        if (typeof value.kntrinputbtn_label_halign === 'string') {
            value.kntrinputbtn_label_halign = value.kntrinputbtn_label_halign.toLowerCase();
            if (value.kntrinputbtn_label_halign === 'left' ||
                value.kntrinputbtn_label_halign === 'right' ||
                value.kntrinputbtn_label_halign === 'center') {
                that._params_restrict.kntrinputbtn_label_halign = value.kntrinputbtn_label_halign;
            }
        }
        return (that._params_restrict.kntrinputbtn_label_halign || 'left');
    }(this));

    // Update widget
    this.update();
    value = null;
    return this;
};
QKantarInputBtn.prototype.update = function() {
    if (!this.widget()) { return null; }
    var that = this,
        doc = document,
        widget = this.widget(),
        params = this.config(),
        cache = this.cache(),
        wrap = cache.nodes.wrap,
        background = cache.nodes.background,
        label = cache.nodes.label,
        textarea = cache.nodes.textarea,
        bckgrnd_url = (this.isRadio()) ? params.kntrinputbtn_rad_url : params.kntrinputbtn_chk_url,
        bckgrnd_width = (this.isRadio()) ? params.kntrinputbtn_rad_width : params.kntrinputbtn_chk_width,
        bckgrnd_height = (this.isRadio()) ? params.kntrinputbtn_rad_height : params.kntrinputbtn_chk_height,
        txtAreaPadding = 3,
        labPadding = 3,
        labWidth = 0,
        labHeight = 0,
        txtAreaEvent = (!QUtility.isMSTouch()) ?
            "click.widget touchstart.widget":
            (window.PointerEvent) ? "pointerdown.widget" : "MSPointerDown.widget";

    // Hide Widget while we update
    wrap.style.display = "none";

    // Set widget ID
    widget.id = params.id;

    // Background CSS Style
    background.style.cssText = "position: relative; filter: inherit;";
    background.style.width = bckgrnd_width + "px";
    background.style.height = bckgrnd_height + "px";
    background.style.backgroundPosition = "50% 50%";
    background.style.backgroundRepeat = "no-repeat";
    background.style.backgroundImage = "url(" + bckgrnd_url + ")";
    if (bckgrnd_url === "") {
        var inputFormBtn = doc.createElement("input");
        inputFormBtn.style.margin = 0;
        inputFormBtn.style.padding = 0;
        inputFormBtn.style.width = "100%";
        inputFormBtn.style.height = "100%";
        inputFormBtn.style.cursor = "inherit";
        inputFormBtn.type = (this.isRadio()) ? "radio" : "checkbox";
        inputFormBtn.disabled = this.enabled();
        inputFormBtn.onclick = function() { this.checked = that.isAnswered(); };
        background.appendChild(inputFormBtn);
        cache.nodes.formBtn = inputFormBtn;
    }

    // Label CSS Style
    label.dir = (!params.isRTL) ? "LTR" : "RTL";
    label.style.whiteSpace = "normal";
    label.style.wordWrap = "break-word";
    label.style.textAlign = (!params.isRTL) ? params.kntrinputbtn_label_halign : "";
    label.style.fontSize = QUtility.convertPxtoEM(params.kntrinputbtn_label_fontsize) + "em";
    label.style.height = "auto";
    label.style.color = "#" + params.kntrinputbtn_label_fontcolor_up;
    label.style[(!params.isRTL) ? "paddingLeft" : "paddingRight"] = labPadding + "px";
    //label.style.backgroundColor = "#eee";
    label.style.visibility = "hidden";
    label.innerHTML = params.label;
    // Temporarily append label to doc.body to calculate label width/height
    doc.body.appendChild(label);
    labWidth = $(label).width();
    if (labWidth > params.kntrinputbtn_label_width) { labWidth = params.kntrinputbtn_label_width; }
    label.style.width = labWidth + "px";
    labHeight = $(label).outerHeight();
    // Append back to widget
    wrap.appendChild(label);
    label.style.visibility = "";

    // Textarea CSS Style
    if (!this.isInputValid()) { textarea.value = textarea.defaultValue = params.other_init_txt; }
    textarea.dir = (!params.isRTL) ? "LTR" : "RTL";
    textarea.style.whiteSpace = "normal";
    textarea.style.width = params.kntrinputbtn_input_width + "px";
    textarea.style.height = bckgrnd_height + "px";
    textarea.style[(!params.isRTL) ? "marginLeft" : "marginRight"] = txtAreaPadding + "px";
    textarea.style.textAlign = (!params.isRTL) ? params.textarea_halign : "";
    textarea.style.fontSize = QUtility.convertPxtoEM(params.textarea_fontsize) + "em";
    textarea.style.color = "#" + params.textarea_fontcolor;
    textarea.style.backgroundColor = "#FFFFFF";
    textarea.style.resize = "none";
    textarea.style.MozBoxShadow = '3px 2px 3px #CCC';
    textarea.style.webkitBoxShadow = '3px 2px 3px #CCC';
    textarea.style.boxShadow = '3px 2px 3px #CCC';
    textarea.style.overflowY = "hidden";
    // See about adding a maxChar counter for textArea
    if ((params.max_char > 0) && ("maxLength" in textarea)) {
        textarea.maxLength = params.max_char;
    }

    // Positioning
    background.style.left = (!params.isRTL) ?
        "" : (params.kntrinputbtn_input_width + txtAreaPadding + labWidth + labPadding + 3) + "px";
    label.style.top = params.kntrinputbtn_label_top + "px";
    label.style.left = (((!params.isRTL) ? bckgrnd_width : (params.kntrinputbtn_input_width + txtAreaPadding + labPadding)) + params.kntrinputbtn_label_left) + "px";
    textarea.style.top = "0px";
    textarea.style.left = (!params.isRTL) ? ((bckgrnd_width + labWidth + txtAreaPadding) + "px") : "";

    // See if we need to set widget as answered
    if (this.isAnswered()) { this.toggleMouseDown(true); }

    // Display again and set Widget dimensions
    wrap.style.display = "";
    wrap.style.width =
        (bckgrnd_width + labWidth + (params.kntrinputbtn_input_width+2) + txtAreaPadding + labPadding) +  "px";  // 2 comes from textarea border
    wrap.style.height = Math.max(labHeight, bckgrnd_height) +  "px";
    widget.style.width = wrap.style.width;
    widget.style.height = wrap.style.height;

    // See if we need to prevent click behavior
    if (!params.allow_click) {
        this.addEvent(widget, txtAreaEvent, function(event) {
            event.stopPropagation();
        });
    } else {
        this.removeEvent(widget, txtAreaEvent);
    }
};
QKantarInputBtn.prototype.toggleMouseEnter = function(value) {
    if (!this.widget()) { return null; }
    if (this.enabled() && !this.isAnswered()) {
        var params = this.config(),
            cache = this.cache(),
            wrap = cache.nodes.wrap,
            background = cache.nodes.background,
            label = cache.nodes.label,
            fontcolor = (value) ? params.kntrinputbtn_label_fontcolor_over : params.kntrinputbtn_label_fontcolor_up;

        // Imported background image change position
        background.style.backgroundPosition = (value) ? '0% 50%' : '50% 50%';

        // Label color change
        label.style.color = '#' + fontcolor;

        // Widget bounce animation
        if (params.mouseover_bounce) {
            if (value) {
                $(wrap).animate({"top": "2px" }, 170, function() {
                    $(this).animate({"top": "" }, 200);
                });
            } else {
                $(wrap).stop();
                wrap.style.top = "";
            }
        }
    }
};
QKantarInputBtn.prototype.toggleMouseDown = function(value) {
    if (!this.widget()) { return null; }
    var params = this.config(),
        cache = this.cache(),
        wrap = cache.nodes.wrap,
        background = cache.nodes.background,
        label = cache.nodes.label,
        fontcolor = (value) ? params.kntrinputbtn_label_fontcolor_down : params.kntrinputbtn_label_fontcolor_up,
        alpha_val = value ? params.mousedown_alpha : 1;

    if (cache.nodes.formBtn) {
        cache.nodes.formBtn.checked = value;
    } else {
        // Imported background image change position
        background.style.backgroundPosition = (value) ? '100% 50%' : '50% 50%';
    }

    // Label color change
    label.style.color = '#' + fontcolor;

    // Button opacity animation
    if (this.enabled()) {
        for (var key in cache.nodes) {
            if (cache.nodes.hasOwnProperty(key)) {
                var node = cache.nodes[key];
                if (node !== wrap) {
                    $(node).css( { "opacity": alpha_val } );
                }
            }
        }
    }
};

/**
 * Flag Button Widget --> Extends QStudioBtnAbstract
 */
function QBaseFlagBtn(parent, configObj) {
    // Init
    this.init();

    // Create Button Shell
    var that = this,
        doc = document,
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
    widget.style.cssText += ';'.concat("-ms-touch-action: none;");
    widget.style.cssText += ';'.concat("-webkit-user-select: none;");
    widget.style.cssText += ';'.concat("-khtml-user-select: none;");
    widget.style.cssText += ';'.concat("-moz-user-select: none;");
    widget.style.cssText += ';'.concat("-ms-user-select: none;");
    widget.style.cssText += ';'.concat("-user-select: none;");

    // Value Label CSS Style
    valueLabel.className = "qwidget_button_valuelabel";
    valueLabel.style.cssText = "position: absolute; filter: inherit; display: block;";
    if (QUtility.ieVersion() <= 8) { valueLabel.style.filter = ""; }    // Fix for IE8 Opacity/ClearType bug

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

    // Setup
    this._widget = widget;
    this._cache.nodes = {
        valueLabel: valueLabel,
        flagStick: flagStick,
        flagCircle: flagCircle,
        btnWidget: undefined,
        background: undefined,
        imageContain: undefined,
        image: undefined,
        label: undefined,
        stamp: undefined
    };
    this.config(configObj || {});   // This will trigger update method to be called
    this.enabled(true);

    // Add "mouseenter" & "mouseleave" events
    this.addEvent(widget, "mouseenter.widget mouseleave.widget", function(event) {
        if (!that.widget() || that.isDrag()) { return null; }
        that.toggleMouseEnter(event.type === "mouseenter");
    });

    // Add "mouseenter" event for Tooltip
    if (this._params.use_tooltip) {
        this.addEvent(widget, "mouseenter.tooltip", jQuery.proxy(QBaseToolTip.getInstance().toolTipMouseEvent, that));
    }
}
QBaseFlagBtn.prototype = new QStudioBtnAbstract();
QBaseFlagBtn.prototype.config = function(value) {
    if (typeof value !== 'object') {
        return QStudioBtnAbstract.prototype.config.call(this, value);
    }

    QStudioBtnAbstract.prototype.config.call(this, value);
    this._params.label_overlay_padding = (Math.abs(parseInt(value.label_overlay_padding, 10)) >= 0) ? parseInt(value.label_overlay_padding, 10) :
        ((typeof this._params.label_overlay_padding === 'number') ? this._params.label_overlay_padding : 2);
    this._params.flagstick_height = (parseInt(value.flagstick_height, 10) >= 0) ? parseInt(value.flagstick_height, 10) : (this._params.flagstick_height || 50);
    this._params.value_label_halign = (function(that) {
        if (typeof value.value_label_halign === 'string') {
            value.value_label_halign = value.value_label_halign.toLowerCase();
            if (value.value_label_halign === 'left' ||
                value.value_label_halign === 'right' ||
                value.value_label_halign === 'center') {
                that._params_restrict.value_label_halign = value.value_label_halign;
            }
        }
        return (that._params_restrict.value_label_halign || 'center');
    }(this));
    this._params.value_label_fontsize = (parseInt(value.value_label_fontsize, 10) > 0) ? parseInt(value.value_label_fontsize, 10) : (this._params.value_label_fontsize || 14);
    this._params.value_label_fontcolor = QUtility.paramToHex(value.value_label_fontcolor) ||
        ((typeof this._params.value_label_fontcolor === 'string') ? this._params.value_label_fontcolor : '333333');
    this._params.flagcircle_color = QUtility.paramToHex(value.flagcircle_color) ||
        ((typeof this._params.flagcircle_color === 'string') ? this._params.flagcircle_color : 'FF0000');
    this._params.zoom_top = (Math.abs(parseInt(value.zoom_top, 10)) >= 0) ? parseInt(value.zoom_top, 10) :
        ((typeof this._params.zoom_top === 'number') ? this._params.zoom_top : 0);
    this._params.zoom_left = (Math.abs(parseInt(value.zoom_left, 10)) >= 0) ? parseInt(value.zoom_left, 10) :
        ((typeof this._params.zoom_left === 'number') ? this._params.zoom_left : 0);
    this._params.show_value_label = (typeof value.show_value_label !== 'undefined') ? !!value.show_value_label :
        ((typeof this._params.show_value_label === 'boolean') ? this._params.show_value_label : true);
    this._params.select_anim_type = (function(that) {
        if (typeof value.select_anim_type === 'string') {
            value.select_anim_type = value.select_anim_type.toLowerCase();
            if (value.select_anim_type === 'basic' ||
                value.select_anim_type === 'image' ||
                value.select_anim_type === 'pin') {
                that._params_restrict.select_anim_type = value.select_anim_type;
            }
        }
        return (that._params_restrict.select_anim_type || 'basic');
    }(this));
    this._params.image_select_anim_width = (parseInt(value.image_select_anim_width, 10) > 0) ? parseInt(value.image_select_anim_width, 10) : (this._params.image_select_anim_width || 50);
    this._params.image_select_anim_height = (parseInt(value.image_select_anim_height, 10) > 0) ? parseInt(value.image_select_anim_height, 10) : (this._params.image_select_anim_height || 50);
    this._params.pin_select_anim_size = (parseInt(value.pin_select_anim_size, 10) >= 5) ? parseInt(value.pin_select_anim_size, 10) : (this._params.pin_select_anim_size || 12);
    this._params.btn_widget_type = (function(that) {
        if (typeof value.btn_widget_type === 'string') {
            value.btn_widget_type = value.btn_widget_type.toLowerCase();
            if (value.btn_widget_type === 'base' ||
                value.btn_widget_type === 'text') {
                that._params_restrict.btn_widget_type = value.btn_widget_type;
            }
        }
        return (that._params_restrict.btn_widget_type || 'base');
    }(this));

    // Update widget
    this.update(value);
    value = null;
    return this;
};
QBaseFlagBtn.prototype.update = function(value) {
    if (!this.widget()) { return false; }
    // Create Button Shell
    var params = this.config(),
        cache = this.cache(),
        widget = this._widget,
        valueLabel = cache.nodes.valueLabel,
        flagStick = cache.nodes.flagStick,
        flagCircle = cache.nodes.flagCircle,
        flagCircleSize = 11,
        btnWidget = undefined,
        btnEle = undefined;

    // Set config defaults for button widget
    value.use_tooltip = false;
    value.border_width_down =
        value.border_width_over =
            value.border_width_up;

    // Create button widget for the first time
    // *TODO Setup for updating
    if (cache.nodes.btnWidget === undefined) {
        btnWidget = QStudioCompFactory.widgetFactory(
            params.btn_widget_type,
            widget,
            value
        );
        btnEle = btnWidget.widget();
        btnEle.className = "";

        // Remove mouseenter/mouseleave event from btnEle since its already applied on widget
        this.removeEvent.apply(btnWidget, [btnEle, "mouseenter.widget mouseleave.widget"]);

        // Set btnEle children position to "relative" for easier positioning w/ flag and valueLabel
        // **exclude stamp
        btnEle.style.position = "relative";
        for (i = 0, len = btnEle.children.length; i<len; i+=1) {
            if (btnEle.children[i] !== btnWidget.cache().nodes.stamp) {
                btnEle.children[i].style.position = "relative";
            }
        }

        // Update cache node references
        cache.nodes.btnWidget = btnWidget;
        cache.nodes.background = btnWidget.cache().nodes.background;
        cache.nodes.imageContain = btnWidget.cache().nodes.imageContain;
        cache.nodes.image = btnWidget.cache().nodes.image;
        cache.nodes.label = btnWidget.cache().nodes.label;
        cache.nodes.stamp = btnWidget.cache().nodes.stamp;
    } else {
        btnWidget = cache.nodes.btnWidget;
        btnEle = btnWidget.widget();
        btnWidget.config(value);
    }

    // valueLabel CSS settings
    if (params.show_value_label) {
        valueLabel.style.display = "block";
        valueLabel.style.wordWrap = "break-word";
        valueLabel.dir = (!params.isRTL) ? "LTR" : "RTL";
        valueLabel.style.whiteSpace = "normal";
        valueLabel.style.textAlign = (!params.isRTL) ?
            params.value_label_halign :
            ((params.value_label_halign !== "left") ? params.value_label_halign : "");
        valueLabel.style.fontSize = params.value_label_fontsize + "px";
        valueLabel.style.width = parseFloat(btnEle.style.width) + "px";
        valueLabel.style.height = "auto";
        valueLabel.style.color = "#" + params.value_label_fontcolor;
        valueLabel.style.backgroundColor = "transparent"; //"#FFFFFF";
        //valueLabel.style.visibility = "hidden";
        widget.insertBefore(valueLabel, btnEle);
    } else {
        if (valueLabel.parentNode) { valueLabel.parentNode.removeChild(valueLabel); }
    }

    // flagStick CSS settings
    flagStick.style.display = (params.flagstick_height>0) ? "" : "none";
    flagStick.style.width = "5px";
    flagStick.style.height = params.flagstick_height + "px";
    flagStick.style.borderWidth = "0px 0px 5px 5px";
    flagStick.style.borderStyle = "solid";
    flagStick.style.borderColor = "transparent #" + params.border_color_up;
    flagStick.style.left = ((parseFloat(btnEle.style.width) - flagCircleSize*0.5)*0.5) + "px";
    btnEle.appendChild(flagStick);

    // flagCircle CSS settings
    flagCircle.style.borderRadius =
        flagCircle.style.webkitBorderRadius =
            flagCircle.style.mozBorderRadius = "50%";
    flagCircle.style.backgroundColor = "#" + params.flagcircle_color;
    flagCircle.style.width = flagCircleSize + "px";
    flagCircle.style.height = flagCircleSize + "px";
    flagCircle.style.top = (-flagCircleSize*0.5) + "px";
    flagCircle.style.left = (parseFloat(flagStick.style.left)-(flagCircleSize*0.5)+3) + "px";
    flagCircle.style.visibility = "hidden";
    btnEle.appendChild(flagCircle);

    // Set widget dimensions
    widget.style.width = btnEle.style.width;
    widget.style.height = ($(btnEle).outerHeight() + $(flagStick).outerHeight()) + "px";
};
QBaseFlagBtn.prototype.enabled = function(value, configObj) {
    if (!this.widget()) { return false; }
    var cache = this.cache();
    if (typeof value === 'boolean') {
        var params = this.config(),
            widget = this.widget(),
            valueLabel = cache.nodes.valueLabel,
            flagStick = cache.nodes.flagStick,
            flagCircle = cache.nodes.flagCircle,
            btnWidget = cache.nodes.btnWidget;

        btnWidget.enabled(value, configObj);
        cache._enableBool = value;

        // Init config object
        configObj = configObj || {};
        configObj = {
            isAnimate : (typeof configObj.isAnimate === "boolean") ? configObj.isAnimate : false,
            animSpeed : (typeof configObj.animSpeed === "number" && configObj.animSpeed >= 100) ? configObj.animSpeed : 800,
            goOpaque : (typeof configObj.goOpaque === "boolean") ? configObj.goOpaque : false,
            enableExtEvt : (typeof configObj.enableExtEvt === "boolean") ? configObj.enableExtEvt : false,
            alphaVal : (!cache._enableBool) ?
                ((parseInt(configObj.alphaVal, 10) >= 0) ? parseInt(configObj.alphaVal, 10) : 50) :
                (this.isAnswered()) ? params.mousedown_alpha*100 : 100
        };

        if (!cache._enableBool) {
            // Record whether we should still allow external events when widget is disabled
            cache._enableExtEvt = configObj.enableExtEvt;
        }

        // Enable/disable button state
        widget.style.cursor = (cache._enableBool) ? 'pointer' : 'default';
        if (!configObj.isAnimate) {
            $([valueLabel, flagStick, flagCircle]).css( { "opacity": configObj.alphaVal *.01 } );
        } else {
            $([valueLabel, flagStick, flagCircle]).animate( { "opacity": configObj.alphaVal *.01 }, configObj.animSpeed );
        }
    }

    return cache._enableBool;
};
QBaseFlagBtn.prototype.valueLabel = function(value) {
    if (!this.widget()) { return null; }
    if (!this._params.show_value_label) { return false; }
    if (typeof value === "string" || typeof value === "number") {
        var cache = this.cache(),
            valueLabel = cache.nodes.valueLabel;
        valueLabel.style.visibility = (value !== "") ? "" : "hidden";
        valueLabel.innerHTML = value;
        valueLabel.style.top = (-$(valueLabel).outerHeight()) + "px";
        if (cache.nodes.pin) {
            cache.nodes.valueLabel.style.marginTop = -4 + "px";
            cache.nodes.valueLabel.style.left =
                ($(cache.nodes.pin).outerWidth() - $(cache.nodes.valueLabel).outerWidth())*0.5 + "px";
        }
        return true;
    }

    return false;
};
QBaseFlagBtn.prototype.flagStickHeight = function(value) {
    if (!this.widget()) { return null; }
    var widget = this.widget(),
        flagStick = this.cache().nodes.flagStick,
        btnEle = this.cache().nodes.btnWidget.widget();

    if(typeof value === "number" && value >= this.config().flagstick_height) {
        flagStick.style.height = value + "px";
        widget.style.height = ($(btnEle).outerHeight() + value) + "px";
    }

    return (flagStick.style.display !== "none") ? parseInt(flagStick.style.height, 10) : 0;
};
QBaseFlagBtn.prototype.toggleMouseEnter = function(value) {
    if (this.enabled() && !this.isAnswered()) {
        var params = this.config(),
            cache = this.cache(),
            widget = this.widget(),
            flagStick = cache.nodes.flagStick,
            border_color = (value) ? params.border_color_over : params.border_color_up;

        flagStick.style.borderColor = "transparent #" + border_color;
        cache.nodes.btnWidget.toggleMouseEnter(value);
        widget.style.zIndex = (value) ? 2000 : 'auto';
    }
};
QBaseFlagBtn.prototype.isAnswered = function(value) {
    if (!this.widget()) { return null; }
    var cache = this.cache(),
        selectAnimType = this.config().select_anim_type;

    if (typeof value === 'boolean' && cache._answerBool !== value) {
        cache._answerBool = value;
        this.animType[selectAnimType].select.call(this, (value));
    }

    return cache._answerBool;
};
QBaseFlagBtn.prototype.animType = {
    basic : {
        select : function(value) {
            var params = this.config(),
                cache = this.cache(),
                flagStick = cache.nodes.flagStick,
                flagCircle = cache.nodes.flagCircle,
                border_color = (value) ? params.border_color_down : params.border_color_up;

            flagStick.style.borderColor = "transparent #" + border_color;
            if (!value) { flagStick.style.height = params.flagstick_height + "px"; }
            flagCircle.style.visibility = (value) ? "" : "hidden";
            cache.nodes.btnWidget.isAnswered(value);
        },

        down : function(value) {
            // do nothing
        }
    },
    image : {
        select : function(value) {
            var params = this.config(),
                cache = this.cache(),
                flagStick = cache.nodes.flagStick,
                flagCircle = cache.nodes.flagCircle,
                border_color = (value) ? params.border_color_down : params.border_color_up;

            flagStick.style.borderColor = "transparent #" + border_color;
            if (!value) { flagStick.style.height = params.flagstick_height + "px"; }
            flagCircle.style.visibility = (value) ? "" : "hidden";
            cache.nodes.btnWidget.isAnswered(value);
        },

        down : function(value) {
            var params = this.config(),
                cache = this.cache(),
                widget = this.widget(),
                btnWidget = cache.nodes.btnWidget,
                btnEle = btnWidget.widget(),
                flagStick = cache.nodes.flagStick,
                flagCircle = cache.nodes.flagCircle,
                valueLabel = cache.nodes.valueLabel,
                flagCircleSize = 11;

            if ((btnWidget.config().width !== ((value) ? params.image_select_anim_width : params.width)) ||
                (btnWidget.config().height !== ((value) ? params.image_select_anim_height : params.height))) {
                btnWidget.config({
                    use_lightbox : (value) ? false : params.use_lightbox,
                    bckgrnd_color_up : (value) ? params.bckgrnd_color_over : params.bckgrnd_color_up,
                    border_color_up : (value) ? params.border_color_over : params.border_color_up,
                    label_color_up : (value) ? params.label_color_over : params.label_color_up,
                    bckgrnd_import_up : (value) ? params.bckgrnd_import_over : params.bckgrnd_import_up,
                    width : (value) ? params.image_select_anim_width : params.width,
                    height : (value) ? params.image_select_anim_height : params.height
                });
            }

            // For text widget do not let text overflow background
            // For base widget hide label on down
            if (params.btn_widget_type.toLowerCase() === "text") {
                btnWidget.cache().nodes.wrap.style.overflow = "hidden";
            } else {
                btnWidget.cache().nodes.label.style.display = (value) ? "none" : "block";
            }

            flagStick.style.left = ((parseFloat(btnEle.style.width) - flagCircleSize*0.5)*0.5) + "px";
            flagCircle.style.left = (parseFloat(flagStick.style.left)-(flagCircleSize*0.5)+2) + "px";
            valueLabel.style.width = parseFloat(btnEle.style.width) + "px";

            // Set widget dimensions
            widget.style.width = btnEle.style.width;
            widget.style.height = ($(btnEle).outerHeight() + $(flagStick).outerHeight()) + "px";
        }
    },
    pin : {
        hover : function(value) {
            var cache = this.cache(),
                btnClone = cache.nodes.pin.children[2];

            $(btnClone).stop(false, true);
            $(btnClone)[(value) ? "fadeIn" : "hide"]();
            btnClone.style.zIndex = (value) ? 2000 : "auto";
        },

        select : function(value) {
            var params = this.config(),
                cache = this.cache(),
                pinContain = cache.nodes.pin,
                pin = pinContain.children[0],
                arrw = pinContain.children[1],
                border_color = (value) ? params.border_color_down : params.border_color_up;

            pin.style.borderColor = "#" + border_color;
            arrw.style.borderColor = "#" + border_color + " transparent";
        },

        down : function(value) {
            var params = this.config(),
                cache = this.cache(),
                widget = this.widget(),
                btnWidget = cache.nodes.btnWidget,
                btnEle = btnWidget.widget(),
                flagStick = cache.nodes.flagStick,
                flagCircle = cache.nodes.flagCircle,
                pin = this._pinCreate();

            if (value && !QUtility.isTouchDevice()) { QBaseFlagBtn.prototype.animType.pin.hover.call(this, false); }
            btnEle.style.display = (value) ? "none" : "";
            flagStick.style.display = (value) ? "none" : "";
            flagCircle.style.display = (value) ? "none" : "";
            pin.style.display = (value) ? "" : "none";
            widget.style.width = ((value) ? this.cache().pinSize.pinWidth : this.cache().pinSize.baseWidth) + "px";
            widget.style.height = ((value) ? this.cache().pinSize.pinHeight : this.cache().pinSize.baseHeight) + "px";
        }
    }
};
QBaseFlagBtn.prototype._pinCreate = function() {
    if (!this.cache().nodes.pin) {
        var that = this,
            doc = document,
            params = this.config(),
            cache = this.cache(),
            widget = this.widget(),
            btnWidget = cache.nodes.btnWidget,
            btnEle = btnWidget.widget(),
            btnClone = undefined,
            flagStick = cache.nodes.flagStick,
            flagCircle = cache.nodes.flagCircle,
            contain = doc.createElement("div"),
            pin = doc.createElement("div"),
            arrw = doc.createElement("div"),
            btnHeight = $(cache.nodes.background).outerHeight(),
            size = ((params.pin_select_anim_size & 1) === 0) ? params.pin_select_anim_size : params.pin_select_anim_size+1,
            radius = size*3,
            arrw_width = size + Math.round((size*0.5)),
            arrw_height = Math.round(size*2.5);

        // Prep btn widget before cloning
        btnEle.style.height = btnHeight + "px";
        flagStick.style.display = "none";
        flagCircle.style.display = "none";
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

        // Cache instance of pin
        cache.nodes.pin = contain;
        cache.pinSize = {
            pinWidth : radius,
            pinHeight : size*2 + arrw_height,
            baseWidth : parseInt(widget.style.width, 10),
            baseHeight : parseInt(widget.style.height, 10)
        };

        // btnClone CSS
        $(btnClone).hide();
        btnClone.style.position = "absolute";
        btnClone.style.top = (-btnHeight - 4) + "px";
        btnClone.style.left = ((radius - cache.pinSize.baseWidth)*0.5) + "px";
    }

    return this.cache().nodes.pin;
};

/**
 * QStudio Bucket Abstract --> Extends QStudioDCAbstract
 */
function QStudioBucketAbstract() {
    // Do not instantiate. Subclasses should inherit from QStudioBucketAbstract.
}
QStudioBucketAbstract.prototype = new QStudioDCAbstract();
QStudioBucketAbstract.prototype.config = function(value) {
    if (!this.widget()) { return null; }
    if (typeof value !== 'object') {
        return this._params;
    }

    // Holds a record of option based parameters
    if (typeof this._params_restrict === "undefined") {
        this._params_restrict = {};
    }

    this._params.id = (typeof value.id === 'string') ? value.id : (this._params.id || "QWidgetBucket");
    this._params.label = (typeof value.label === 'string') ? value.label : (this._params.label || "");
    this._params.description =  (typeof value.description === 'string') ? value.description : (this._params.description || "");
    this._params.image = (typeof value.image === 'string') ? value.image : (this._params.image || "");
    this._params.rowIndex = (parseInt(value.rowIndex, 10) >= 0) ? parseInt(value.rowIndex, 10) :
        ((typeof this._params.rowIndex === 'number') ? this._params.rowIndex : null);
    this._params.colIndex = (parseInt(value.colIndex, 10) >= 0) ? parseInt(value.colIndex, 10) :
        ((typeof this._params.colIndex === 'number') ? this._params.colIndex : null);
    this._params.isRTL = (typeof value.isRTL !== 'undefined') ? !!value.isRTL :
        ((typeof this._params.isRTL === 'boolean') ? this._params.isRTL : false);
    this._params.capvalue = (parseInt(value.capvalue, 10) >= 0) ?
        parseInt(value.capvalue, 10) : (this._params.capvalue !== undefined) ? this._params.capvalue : -1;
    this._params.bucket_animation = (function(that) {
        if (typeof value.bucket_animation === 'string') {
            value.bucket_animation = value.bucket_animation.toLowerCase();
            if (value.bucket_animation === 'anchor' ||
                value.bucket_animation === 'list' ||
                value.bucket_animation === 'fade' ||
                value.bucket_animation === 'crop') {
                that._params_restrict.bucket_animation = value.bucket_animation;
            }
        }
        return (that._params_restrict.bucket_animation || 'anchor');
    }(this));
    this._params.grow_animation = (function(that) {
        if (typeof value.grow_animation === 'string') {
            value.grow_animation = value.grow_animation.toLowerCase();
            if (value.grow_animation === 'none' ||
                value.grow_animation === 'grow all' ||
                value.grow_animation === 'grow individual') {
                that._params_restrict.grow_animation = value.grow_animation;
            }
        }
        return (that._params_restrict.grow_animation || 'none');
    }(this));
    this._params.contain_padding = (parseInt(value.contain_padding, 10) >= 0) ? parseInt(value.contain_padding, 10) :
        ((typeof this._params.contain_padding === 'number') ? this._params.contain_padding : 10);
    this._params.hgap = (Math.abs(parseInt(value.hgap, 10)) >= 0) ? parseInt(value.hgap, 10) :
        ((typeof this._params.hgap === 'number') ? this._params.hgap : 20);
    this._params.vgap = (Math.abs(parseInt(value.vgap, 10)) >= 0) ? parseInt(value.vgap, 10) :
        ((typeof this._params.vgap === 'number') ? this._params.vgap : 20);
    this._params.width = (parseInt(value.width, 10) >= 10) ? parseInt(value.width, 10) : (this._params.width || 100);
    this._params.height = (parseInt(value.height, 10) >= 10) ? parseInt(value.height, 10) : (this._params.height || 100);
    this._params.border_style = (function(that) {
        if (typeof value.border_style === 'string') {
            value.border_style = value.border_style.toLowerCase();
            if (value.border_style === 'solid' ||
                value.border_style === 'none' ||
                value.border_style === 'dotted' ||
                value.border_style === 'dashed') {
                that._params_restrict.border_style = value.border_style;
            }
        }
        return (that._params_restrict.border_style || 'solid');
    }(this));
    this._params.border_width = (parseInt(value.border_width, 10) >= 0) ? parseInt(value.border_width, 10) :
        ((typeof this._params.border_width === 'number') ? this._params.border_width : 1);
    if (this._params.border_style === "none") { this._params.border_width = 0; }
    this._params.border_radius = (parseInt(value.border_radius, 10) >= 0) ? parseInt(value.border_radius, 10) :
        ((typeof this._params.border_radius === 'number') ? this._params.border_radius : 0);
    this._params.border_color_up = QUtility.paramToHex(value.border_color_up) ||
        ((typeof this._params.border_color_up === 'string') ? this._params.border_color_up : 'CCCCCC');
    this._params.border_color_over = QUtility.paramToHex(value.border_color_over) ||
        ((typeof this._params.border_color_over === 'string') ? this._params.border_color_over : 'CCCCCC');
    this._params.show_bckgrnd = (typeof value.show_bckgrnd !== 'undefined') ? !!value.show_bckgrnd :
        ((typeof this._params.show_bckgrnd === 'boolean') ? this._params.show_bckgrnd : true);
    this._params.show_bckgrnd_import = (typeof value.show_bckgrnd_import !== 'undefined') ? !!value.show_bckgrnd_import :
        ((typeof this._params.show_bckgrnd_import === 'boolean') ? this._params.show_bckgrnd_import : false);
    this._params.bckgrnd_color_up = QUtility.paramToHex(value.bckgrnd_color_up) ||
        ((typeof this._params.bckgrnd_color_up === 'string') ? this._params.bckgrnd_color_up : 'F5F5F5');
    this._params.bckgrnd_color_over = QUtility.paramToHex(value.bckgrnd_color_over) ||
        ((typeof this._params.bckgrnd_color_over === 'string') ? this._params.bckgrnd_color_over : 'CCCCCC');
    this._params.bckgrnd_import_up = (typeof value.bckgrnd_import_up === 'string') ? value.bckgrnd_import_up : (this._params.bckgrnd_import_up || "");
    this._params.bckgrnd_import_over = (typeof value.bckgrnd_import_over === 'string') ? value.bckgrnd_import_over : (this._params.bckgrnd_import_over || "");
    this._params.show_label = (typeof value.show_label !== 'undefined') ? !!value.show_label :
        ((typeof this._params.show_label === 'boolean') ? this._params.show_label : true);
    this._params.label_placement = (function(that) {
        if (typeof value.label_placement === 'string') {
            value.label_placement = value.label_placement.toLowerCase();
            if (value.label_placement === 'top' ||
                value.label_placement === 'top overlay' ||
                value.label_placement === 'bottom' ||
                value.label_placement === 'bottom overlay') {
                that._params_restrict.label_placement = value.label_placement;
            }
        }
        return (that._params_restrict.label_placement || 'bottom');
    }(this));
    this._params.label_halign = (function(that) {
        if (typeof value.label_halign === 'string') {
            value.label_halign = value.label_halign.toLowerCase();
            if (value.label_halign === 'left' ||
                value.label_halign === 'right' ||
                value.label_halign === 'center') {
                that._params_restrict.label_halign = value.label_halign;
            }
        }
        return (that._params_restrict.label_halign || 'left');
    }(this));
    this._params.label_overlay_valign = (function(that) {
        if (typeof value.label_overlay_valign === 'string') {
            value.label_overlay_valign = value.label_overlay_valign.toLowerCase();
            if (value.label_overlay_valign === 'top' ||
                value.label_overlay_valign === 'bottom' ||
                value.label_overlay_valign === 'center') {
                that._params_restrict.label_overlay_valign = value.label_overlay_valign;
            }
        }
        return (that._params_restrict.label_overlay_valign || 'top');
    }(this));
    this._params.show_label_bckgrnd = (typeof value.show_label_bckgrnd !== 'undefined') ? !!value.show_label_bckgrnd :
        ((typeof this._params.show_label_bckgrnd === 'boolean') ? this._params.show_label_bckgrnd : true);
    this._params.label_bckgrnd_color = QUtility.paramToHex(value.label_bckgrnd_color) ||
        ((typeof this._params.label_bckgrnd_color === 'string') ? this._params.label_bckgrnd_color : 'F5F5F5');
    this._params.label_height = (parseInt(value.label_height, 10) > 0) ? parseInt(value.label_height, 10) : (this._params.label_height || "auto");
    this._params.label_fontsize = (parseInt(value.label_fontsize, 10) >= 5) ? parseInt(value.label_fontsize, 10) : (this._params.label_fontsize || 14);
    this._params.label_fontcolor_up = QUtility.paramToHex(value.label_fontcolor_up) ||
        ((typeof this._params.label_fontcolor_up === 'string') ? this._params.label_fontcolor_up : '333333');
    this._params.label_fontcolor_over = QUtility.paramToHex(value.label_fontcolor_over) ||
        ((typeof this._params.label_fontcolor_over === 'string') ? this._params.label_fontcolor_over : '333333');
    this._params.label_left = (Math.abs(parseInt(value.label_left, 10)) >= 0) ? parseInt(value.label_left, 10) :
        ((typeof this._params.label_left === 'number') ? this._params.label_left : 0);
    this._params.label_top = (Math.abs(parseInt(value.label_top, 10)) >= 0) ? parseInt(value.label_top, 10) :
        ((typeof this._params.label_top === 'number') ? this._params.label_top : 0);
    this._params.img_placement = (function(that) {
        if (typeof value.img_placement === 'string') {
            value.img_placement = value.img_placement.toLowerCase();
            if (value.img_placement === 'none' ||
                value.img_placement === 'left' ||
                value.img_placement === 'right' ||
                value.img_placement === 'center') {
                that._params_restrict.img_placement = value.img_placement;
            }
        }

        return (that._params_restrict.img_placement || 'center');
    }(this));
    this._params.show_img = (this._params.img_placement !== "none");
    /*this._params.show_img = (typeof value.show_img !== 'undefined') ? !!value.show_img :
     ((typeof this._params.show_img === 'boolean') ? this._params.show_img : false);*/
    this._params.img_top = (Math.abs(parseInt(value.img_top, 10)) >= 0) ? parseInt(value.img_top, 10) :
        ((typeof this._params.img_top === 'number') ? this._params.img_top : 0);
    this._params.img_left = (Math.abs(parseInt(value.img_left, 10)) >= 0) ? parseInt(value.img_left, 10) :
        ((typeof this._params.img_left === 'number') ? this._params.img_left : 0);
    this._params.img_width = (parseInt(value.img_width, 10) >= 5) ? parseInt(value.img_width, 10) : (this._params.img_width || 100);
    this._params.img_padding = (parseInt(value.img_padding, 10) >= 0) ? parseInt(value.img_padding, 10) :
        ((typeof this._params.img_padding === 'number') ? this._params.img_padding : 4);
    this._params.use_tooltip = (typeof value.use_tooltip !== 'undefined') ? !!value.use_tooltip :
        ((typeof this._params.use_tooltip === 'boolean') ? this._params.use_tooltip : false);
    this._params.use_lightbox = (typeof value.use_lightbox !== 'undefined') ? !!value.use_lightbox :
        ((typeof this._params.use_lightbox === 'boolean') ? this._params.use_lightbox : false);
    this._params.zoom_top = (Math.abs(parseInt(value.zoom_top, 10)) >= 0) ? parseInt(value.zoom_top, 10) :
        ((typeof this._params.zoom_top === 'number') ? this._params.zoom_top : 0);
    this._params.zoom_left = (Math.abs(parseInt(value.zoom_left, 10)) >= 0) ? parseInt(value.zoom_left, 10) :
        ((typeof this._params.zoom_left === 'number') ? this._params.zoom_left : 0);
    this._params.blank_gif = (typeof value.blank_gif === 'string') ? value.blank_gif : (this._params.blank_gif || "");
    this._params.crop_width = (parseInt(value.crop_width, 10) >= 5) ? parseInt(value.crop_width, 10) : (this._params.crop_width || 50);
    this._params.crop_height = (parseInt(value.crop_height, 10) >= 5) ? parseInt(value.crop_height, 10) : (this._params.crop_height || 50);

    // No need for grow animation if bucket animation is set to "fade"
    if (this._params.bucket_animation === "fade") { this._params.grow_animation = "none"; }

    value = null;
};
QStudioBucketAbstract.prototype.type = function() {
    return "bucket";
};
QStudioBucketAbstract.prototype.enabled = function(value, configObj) {
    if (!this.widget()) { return null; }
    var cache = this.cache();
    if (typeof value === 'boolean') {
        cache._enableBool = value;

        // Init config object
        configObj = configObj || {};
        configObj = {
            enableExtEvt : (typeof configObj.enableExtEvt === "boolean") ? configObj.enableExtEvt : false,
            alphaVal : (!cache._enableBool) ? ((parseInt(configObj.alphaVal, 10) >= 0) ? parseInt(configObj.alphaVal, 10) : 50) : 100
        };

        if (!cache._enableBool) {
            // Record whether we should still allow external events when widget is disabled
            cache._enableExtEvt = configObj.enableExtEvt;
        }

        for (var key in cache.nodes) {
            if (cache.nodes.hasOwnProperty(key)) {
                if (key !== "wrap") {
                    var node = cache.nodes[key];
                    $(node).css( { "opacity": configObj.alphaVal *.01 } );
                }
            }
        }
    }

    return cache._enableBool;
};
QStudioBucketAbstract.prototype.touchEnabled = function(value) {
    if (!this.widget()) { return null; }
    var cache = this.cache();
    if (typeof value === 'boolean' && cache._touchEnableBool !== value) {
        cache._touchEnableBool = value;
        if (cache._touchEnableBool) {
            this.removeEvent(this.widget(), "mouseenter.widget mouseleave.widget mouseenter.tooltip");
            if (cache.nodes.zoomBtn) {
                this.removeEvent(cache.nodes.zoomBtn, "click.lightbox mousedown.lightbox");
            }
        }
    }

    return cache._touchEnableBool;
};
QStudioBucketAbstract.prototype.capvalue = function(value) {
    if (!this.widget()) { return null; }
    var params = this.config();
    if (value > 1) { params.capvalue = value; }
    return params.capvalue;
};
QStudioBucketAbstract.prototype.toggleMouseEnter = function(value) {
    if (!this.widget()) { return null; }
    if (this.enabled()) {
        var params = this.config(),
            cache = this.cache(),
            background = cache.nodes.background,
            label = cache.nodes.label,
            border_color = (value) ? params.border_color_over : params.border_color_up,
            bckgrnd_color = (value) ? params.bckgrnd_color_over : params.bckgrnd_color_up,
            bckgrnd_import = (value) ? params.bckgrnd_import_over : params.bckgrnd_import_up,
            fontcolor = (value) ? params.label_fontcolor_over : params.label_fontcolor_up;

        // Background change
        if (!params.show_bckgrnd_import) {
            background.style.borderColor = '#' + border_color;
            background.style.backgroundColor = '#' + bckgrnd_color;
        } else {
            background.style.backgroundImage = (QUtility.ieVersion() < 9) ?
                "url(" + params.blank_gif + ") " + "url(" + bckgrnd_import + ")" : "url(" + bckgrnd_import + ")";
            background.style.filter = "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+bckgrnd_import+",sizingMethod='scale')";
        }

        // Label color change
        label.style.color = '#' + fontcolor;
    }
};
QStudioBucketAbstract.prototype.add = function(value) {
    if (!this.widget()) { return null; }
    // value must be a valid button widget
    if (value instanceof QStudioBtnAbstract && value.bucket) {
        var params = this.config(),
            growBucket = params.grow_animation.toLowerCase() === "grow individual",
            return_value = null;

        switch (params.bucket_animation.toLowerCase()) {
            case "fade":
                return_value = this._fadeAdd(value);
                break;
            case "list":
                return_value = this._listAdd(value);
                break;
            case "crop":
                return_value = this._cropAdd(value);
                break;
            default:
                return_value = this._anchorAdd(value);
                break;
        }

        // See about auto sizing background height to match container height
        if (growBucket) { this.resizeContainHeight(); }

        return return_value;
    }

    return false;
};
QStudioBucketAbstract.prototype.remove = function(value) {
    if (!this.widget()) { return null; }
    // value must be a valid button widget
    if (value instanceof QStudioBtnAbstract && value.bucket) {
        var params = this.config(),
            growBucket = params.grow_animation.toLowerCase() === "grow individual",
            return_value = null;

        switch (params.bucket_animation.toLowerCase()) {
            case "fade":
                return_value = this._fadeRemove(value);
                break;
            case "list":
                return_value = this._listRemove(value);
                break;
            case "crop":
                return_value = this._cropRemove(value);
                break;
            default:
                return_value = this._anchorRemove(value);
                break;
        }

        // See about auto sizing background height to match container height
        if (growBucket) { this.resizeContainHeight(); }

        return return_value;
    }

    return false;
};
QStudioBucketAbstract.prototype.query = function() {
    if (!this.widget()) { return null; }
    return this.cache().bucketArray;
};
QStudioBucketAbstract.prototype._fadeAdd = function(value) {
    if (!this.widget()) { return null; }
    // value must be a valid button widget
    if (value instanceof QStudioBtnAbstract && value.bucket) {
        //console.log("---> Fade Drop Anim");
        var bucketArray = this.query(),
            widget = value.widget(),
            container = this.cache().nodes.container;

        if (value.bucket() !== this) {
            bucketArray.push(value);
            value.bucket(this);
            value.enabled(false, { alphaVal: 100 });

            // Create wrapper for widget
            var wrapper = document.createElement("div"),
                widget_width = $(widget).outerWidth(),
                widget_height = $(widget).outerHeight();

            widget.style.top = "";
            widget.style.left = "";
            wrapper.className = "qwidget_bucket_wrapper";
            wrapper.style.width = widget_width + "px";
            wrapper.style.height = widget_height + "px";
            wrapper.style.left = (($(container).outerWidth() - widget_width) * 0.5) + "px";
            wrapper.style.position = "absolute";
            wrapper.style.verticalAlign = "top";
            wrapper.style.opacity = "inherit";
            wrapper.style.filter = "inherit";
            wrapper.style.zIndex = 2000;
            wrapper.appendChild(widget);
            container.appendChild(wrapper);

            // Fade wrapper out
            $(wrapper).fadeOut(500);

            return value;
        }
    }

    return false;
};
QStudioBucketAbstract.prototype._fadeRemove = function(value) {
    if (!this.widget()) { return null; }
    // value must be a valid button widget
    if (value instanceof QStudioBtnAbstract && value.bucket) {
        var bucketArray = this.query(),
            spliceIndex = jQuery.inArray(value, bucketArray),
            container = this.cache().nodes.container;

        if (spliceIndex !== -1) {
            // Remove widget from container
            container.removeChild(container.children[spliceIndex]);
            bucketArray.splice(spliceIndex, 1);
            if (!value.enabled()) { value.enabled(true); }

            // Cleanup
            value.bucket(null);
            return value;
        }
    }

    return false;
};
QStudioBucketAbstract.prototype._anchorAdd = function(value) {
    if (!this.widget()) { return null; }
    // value must be a valid button widget
    if (value instanceof QStudioBtnAbstract && value.bucket) {
        //console.log("---> Anchor Drop Anim");
        var bucketArray = this.query(),
            widget = value.widget(),
            container = this.cache().nodes.container,
            wrapper = null;

        // If new add
        widget.style.top = "";
        widget.style.left = "";
        if (value.bucket() !== this) {
            // Remove value from any previous buckets
            if (value.bucket()) { value.bucket().remove(value); }
            value.bucket(this);
            bucketArray.push(value);

            // Create wrapper for widget
            wrapper = document.createElement("div");
            wrapper.className = "qwidget_bucket_wrapper";
            wrapper.style.zoom = '1';
            container.appendChild(wrapper);
            wrapper.appendChild(widget);

            // Set wrapper dimensions
            wrapper.style.width = $(widget).outerWidth() + "px";
            wrapper.style.height = $(widget).outerHeight() + "px";
            this._layoutContainerChild(wrapper);
        } else {
            wrapper = container.children[jQuery.inArray(value, bucketArray)];
            wrapper.appendChild(widget);
        }

        return value;
    }

    return false;
};
QStudioBucketAbstract.prototype._anchorRemove = function(value) {
    if (!this.widget()) { return null; }
    // value must be a valid button widget
    if (value instanceof QStudioBtnAbstract && value.bucket) {
        var bucketArray = this.query(),
            spliceIndex = jQuery.inArray(value, bucketArray),
            container = this.cache().nodes.container;

        if (spliceIndex !== -1) {
            // Remove widget from container
            container.removeChild(container.children[spliceIndex]);
            bucketArray.splice(spliceIndex, 1);
            this._containerUpdate();

            // Cleanup
            value.bucket(null);
            return value;
        }
    }

    return false;
};
QStudioBucketAbstract.prototype._listAdd = function(value) {
    if (!this.widget()) { return null; }
    // value must be a valid button widget
    if (value instanceof QStudioBtnAbstract && value.bucket) {
        //console.log("---> List Bucket Anim");
        var bucketArray = this.query(),
            widget = value.widget(),
            value_params = value.config(),
            value_cache = value.cache(),
            container = this.cache().nodes.container,
            wrapper = null,
            txtBtn = null;

        if (value.bucket() !== this) {
            // Remove value from any previous buckets
            if (value.bucket()) { value.bucket().remove(value); }
            value.bucket(this);
            bucketArray.push(value);

            // Create wrapper for widget
            widget.style.display = "none";
            widget.style.top = "";
            widget.style.left = "";
            wrapper = document.createElement("div");
            wrapper.className = "qwidget_bucket_wrapper";
            wrapper.style.verticalAlign = "top";
            wrapper.style.zoom = '1';
            container.appendChild(wrapper);
            wrapper.appendChild(widget);

            // Create Text Button widget & append to wrapper
            if (!value_cache._bucketlink) {
                txtBtn = new QTextBtn(wrapper, {
                    isRTL : value_params.isRTL,
                    id: value_params.id,
                    label: value_params.label,
                    txtbtn_trim: true,
                    width: $(container).width()-6,
                    padding: 2,
                    border_width: 1,
                    use_tooltip: false,
                    border_color_up: parseInt(value_params.border_color_down, 16),
                    bckgrnd_color_up: parseInt(value_params.bckgrnd_color_down, 16),
                    bckgrnd_color_over: parseInt(value_params.bckgrnd_color_down, 16),
                    bckgrnd_color_down: parseInt(value_params.bckgrnd_color_down, 16),
                    label_fontsize: value_params.label_fontsize,
                    label_halign: value_params.label_halign,
                    label_fontcolor_up: parseInt(value_params.label_fontcolor_down, 16),
                    label_fontcolor_over: parseInt(value_params.label_fontcolor_down, 16),
                    label_fontcolor_down: parseInt(value_params.label_fontcolor_down, 16)
                });

                // Have the original widget copy a reference of the newly created Text Button
                value_cache._bucketlink = txtBtn;

                // set key widget attributes and apply them to newly created widget
                txtBtn.widget().setAttribute("rowIndex", widget.getAttribute("rowIndex"));
                txtBtn.widget().setAttribute("colIndex", widget.getAttribute("colIndex"));
                txtBtn.widget().setAttribute("grpIndex", widget.getAttribute("grpIndex"));
            } else {
                txtBtn = value_cache._bucketlink;
                txtBtn.widget().style.top = "";
                txtBtn.widget().style.left = "";
                wrapper.appendChild(txtBtn.widget());
            }

            // Set wrapper dimensions
            wrapper.style.width = $(txtBtn.widget()).outerWidth() + "px";
            wrapper.style.height = $(txtBtn.widget()).outerHeight() + "px";
            this._layoutContainerChild(wrapper);
        } else {
            wrapper = container.children[jQuery.inArray(value, bucketArray)];
            txtBtn = value_cache._bucketlink;
            txtBtn.widget().style.top = "";
            txtBtn.widget().style.left = "";
            wrapper.appendChild(txtBtn.widget());
        }

        return value;
    }

    return false;
};
QStudioBucketAbstract.prototype._listRemove = function(value) {
    if (!this.widget()) { return null; }
    // value must be a valid button widget
    if (value instanceof QStudioBtnAbstract && value.bucket) {
        var bucketArray = this.query(),
            spliceIndex = jQuery.inArray(value, bucketArray),
            value_cache = value.cache(),
            txtBtn = value_cache._bucketlink,
            container = this.cache().nodes.container;

        if (spliceIndex !== -1 && txtBtn) {
            // Remove widget from container
            txtBtn.widget().parentNode.removeChild(txtBtn.widget());
            container.removeChild(container.children[spliceIndex]);
            bucketArray.splice(spliceIndex, 1);
            this._containerUpdate();

            // Cleanup
            value.bucket(null);
            delete value_cache._bucketlink;
            return value;
        }
    }

    return false;
};
QStudioBucketAbstract.prototype._cropAdd = function(value) {
    if (!this.widget()) { return null; }
    // value must be a valid button widget
    if (value instanceof QStudioBtnAbstract && value.bucket) {
        //console.log("---> List Bucket Anim");
        var bucketArray = this.query(),
            widget = value.widget(),
            value_params = value.config(),
            value_cache = value.cache(),
            value_nodes = value_cache.nodes,
            params = this.config(),
            container = this.cache().nodes.container,
            wrapper = null,
            wgtBtn = null;

        if (value.bucket() !== this) {
            // Remove value from any previous buckets
            if (value.bucket()) { value.bucket().remove(value); }
            value.bucket(this);
            bucketArray.push(value);

            // Create wrapper for widget
            widget.style.display = "none";
            widget.style.top = "";
            widget.style.left = "";
            wrapper = document.createElement("div");
            wrapper.className = "qwidget_bucket_wrapper";
            wrapper.style.verticalAlign = "top";
            wrapper.style.zoom = '1';
            container.appendChild(wrapper);
            wrapper.appendChild(widget);

            // Create Button widget & append to wrapper
            if (!value_cache._bucketlink) {
                var useBase = !!(value_nodes.imageContain),
                    BtnClass = (useBase) ? QBaseBtn : QTextBtn;

                wgtBtn = new BtnClass(wrapper, {
                    isRTL : value_params.isRTL,
                    id: value_params.id,
                    label: value_params.label,
                    image: value_params.image,
                    txtbtn_trim: true,
                    width: params.crop_width,
                    height : params.crop_height,
                    padding: 2,
                    border_width: 1,
                    use_tooltip: false,
                    show_bckgrnd : value_params.show_bckgrnd,
                    show_label : !useBase,
                    border_color_up: parseInt(value_params.border_color_down, 16),
                    bckgrnd_color_up: parseInt(value_params.bckgrnd_color_down, 16),
                    bckgrnd_color_over: parseInt(value_params.bckgrnd_color_down, 16),
                    bckgrnd_color_down: parseInt(value_params.bckgrnd_color_down, 16),
                    label_fontsize: value_params.label_fontsize,
                    label_halign: value_params.label_halign,
                    label_fontcolor_up: parseInt(value_params.label_fontcolor_down, 16),
                    label_fontcolor_over: parseInt(value_params.label_fontcolor_down, 16),
                    label_fontcolor_down: parseInt(value_params.label_fontcolor_down, 16)
                });

                // Have the original widget copy a reference of the newly created Text Button
                value_cache._bucketlink = wgtBtn;

                // set key widget attributes and apply them to newly created widget
                wgtBtn.widget().setAttribute("rowIndex", widget.getAttribute("rowIndex"));
                wgtBtn.widget().setAttribute("colIndex", widget.getAttribute("colIndex"));
                wgtBtn.widget().setAttribute("grpIndex", widget.getAttribute("grpIndex"));
            } else {
                wgtBtn = value_cache._bucketlink;
                wgtBtn.widget().style.top = "";
                wgtBtn.widget().style.left = "";
                wrapper.appendChild(wgtBtn.widget());
            }

            // Set wrapper dimensions
            wrapper.style.width = $(wgtBtn.widget()).outerWidth() + "px";
            wrapper.style.height = $(wgtBtn.widget()).outerHeight() + "px";
            this._layoutContainerChild(wrapper);
        } else {
            wrapper = container.children[jQuery.inArray(value, bucketArray)];
            wgtBtn = value_cache._bucketlink;
            wgtBtn.widget().style.top = "";
            wgtBtn.widget().style.left = "";
            wrapper.appendChild(wgtBtn.widget());
        }

        return value;
    }

    return false;
};
QStudioBucketAbstract.prototype._cropRemove = function(value) {
    if (!this.widget()) { return null; }
    // value must be a valid button widget
    if (value instanceof QStudioBtnAbstract && value.bucket) {
        var bucketArray = this.query(),
            spliceIndex = jQuery.inArray(value, bucketArray),
            value_cache = value.cache(),
            wgtBtn = value_cache._bucketlink,
            container = this.cache().nodes.container;

        if (spliceIndex !== -1 && wgtBtn) {
            // Remove widget from container
            wgtBtn.widget().parentNode.removeChild(wgtBtn.widget());
            container.removeChild(container.children[spliceIndex]);
            bucketArray.splice(spliceIndex, 1);
            this._containerUpdate();

            // Cleanup
            value.bucket(null);
            delete value_cache._bucketlink;
            return value;
        }
    }

    return false;
};
QStudioBucketAbstract.prototype._layoutContainerChild = function(child_wrap) {
    if (!this.widget()) { return null; }
    var cache = this.cache(),
        params = this.config(),
        container = cache.nodes.container,
        containWidth = parseInt(container.style.width, 10),
        childWrapWidth = $(child_wrap).outerWidth(),
        endOfRow = null;

    endOfRow = cache.xPosition + childWrapWidth;
    if(endOfRow > containWidth && cache.xPosition !== params.contain_padding) {
        cache.maxRowSize = Math.max(cache.maxRowSize, cache.xPosition-params.hgap);
        cache.xPosition = params.contain_padding;
        cache.yPosition += cache.maxSize + params.vgap;
        cache.maxSize = 0;
    }

    child_wrap.style.position = "absolute";
    child_wrap.style.top = cache.yPosition + "px";
    child_wrap.style.left = cache.xPosition + "px";

    cache.xPosition += childWrapWidth + params.hgap;
    cache.maxSize = Math.max(cache.maxSize, $(child_wrap).outerHeight());
    cache.maxRowSize = Math.max(cache.maxRowSize, cache.xPosition-params.hgap);
};
QStudioBucketAbstract.prototype._containerUpdate = function() {
    if (!this.widget()) { return null; }
    // Call to update children wrapper margins
    var cache = this.cache(),
        params = this.config(),
        bucketContain = cache.nodes.container;

    cache.maxSize = 0;
    cache.maxRowSize = 0;
    cache.maxColSize = 0;
    cache.xPosition = params.contain_padding;
    cache.yPosition = params.contain_padding;
    if (bucketContain && bucketContain.children.length > 0) {
        for (var i= 0, clen=bucketContain.children.length; i<clen; i+=1) {
            var child_wrap = bucketContain.children[i];
            this._layoutContainerChild(child_wrap);
        }
    }

    return true;
};
QStudioBucketAbstract.prototype.resizeContainHeight = function(value) {
    if (!this.widget()) { return null; }
    var widget = this.widget(),
        params = this.config(),
        cache = this.cache();

    value = (typeof value === 'number' && value > params.height) ? value : null;
    var background = cache.nodes.background,
        container = cache.nodes.container,
        labelWrap = cache.nodes.labelWrap,
        isOverlay = (params.label_placement.indexOf("overlay") !== -1),
        bucketHeight = (value === null) ? this.getBucketContainHeight() : value,
        labHeight = (!isOverlay) ? $(labelWrap).outerHeight() : 0;

    widget.style.display = "none";
    background.style.height = (bucketHeight + params.contain_padding*2) + "px";
    container.style.height = bucketHeight + "px";
    //container.style.backgroundColor = "#fff000";
    if (params.label_placement.indexOf("top") === -1) {
        labelWrap.style.top =
            ((bucketHeight + params.contain_padding*2) +
                ((isOverlay) ? -$(labelWrap).outerHeight() - params.border_width : 0) +
                ((!params.show_bckgrnd_import) ? params.border_width*2 : 0)) + "px";
    }
    widget.style.height = ($(background).outerHeight() + labHeight) + "px";
    widget.style.display = "";
    // Force redraw for IE7
    if (QUtility.ieVersion() === 7) { container.className = container.className; }
    return true;
};
QStudioBucketAbstract.prototype.getBucketContainHeight = function() {
    if (!this.widget()) { return null; }
    var params = this.config(),
        cache = this.cache(),
        labelWrap = cache.nodes.labelWrap,
        bucketHeight = cache.yPosition + cache.maxSize - params.contain_padding,
        cutOff = (params.height - params.contain_padding*2);

    bucketHeight += ((params.label_placement.indexOf("overlay") !== -1) ? $(labelWrap).outerHeight() : 0);
    if (bucketHeight < cutOff) { bucketHeight = cutOff; }
    return bucketHeight;
};

/**
 * Base Bucket Widget --> Extends QStudioBucketAbstract
 */
function QBaseBucket(parent, configObj) {
    // Init
    this.init();

    // Create Dropzone Shell
    var that = this,
        doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        widget = doc.createElement("div"),
        wrap = doc.createElement("div"),
        background = doc.createElement("div"),
        imageContain = doc.createElement("div"),
        image = doc.createElement("img"),
        container = doc.createElement("div"),
        labelWrap = doc.createElement("div"),
        label = doc.createElement("label");

    // Widget CSS Style
    widget.className = "qwidget_bucket";
    widget.dir = "LTR";
    widget.style.cssText += ';'.concat("position: relative;");
    widget.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
    widget.style.cssText += ';'.concat("-webkit-touch-callout: none;");
    widget.style.cssText += ';'.concat("-ms-touch-action: none;");
    widget.style.cssText += ';'.concat("-webkit-user-select: none;");
    widget.style.cssText += ';'.concat("-khtml-user-select: none;");
    widget.style.cssText += ';'.concat("-moz-user-select: none;");
    widget.style.cssText += ';'.concat("-ms-user-select: none;");
    widget.style.cssText += ';'.concat("-user-select: none;");

    // Wrapper CSS Style
    wrap.className = "qwidget_bucket_wrapper";
    wrap.style.position = "relative";

    // Background CSS Style
    background.className = "qwidget_bucket_background";
    background.style.cssText = "position: relative; filter: inherit;";

    // Image Container CSS Style
    imageContain.className = "qwidget_bucket_imgcontain";
    imageContain.style.cssText = "position: absolute; filter: inherit;";

    // Image CSS Style
    image.className = "qwidget_button_image";
    image.style.cssText = "position: relative; filter: inherit; width: auto; height: auto; max-width: 100%; max-height: 100%;";

    // Container CSS Style
    container.className = "qwidget_bucket_container";
    container.style.cssText = "position: absolute; filter: inherit;";

    // Label Wrap CSS
    labelWrap.className = "qwidget_bucket_label_wrapper";
    labelWrap.style.cssText = "position: absolute; filter: inherit;";

    // Label CSS Style
    label.className = "qwidget_bucket_label";
    label.style.cssText = "position: absolute; display: block; filter: inherit;";
    if (QUtility.ieVersion() <= 8) { label.style.filter = ""; }    // Fix for IE8 Opacity/ClearType bug

    // Append Children
    labelWrap.appendChild(label);
    imageContain.appendChild(image);
    wrap.appendChild(background);
    wrap.appendChild(imageContain);
    wrap.appendChild(container);
    wrap.appendChild(labelWrap);
    widget.appendChild(wrap);
    parentEle.appendChild(widget);

    // Setup
    this._widget = widget;
    this._cache.bucketArray = [];
    this._cache.maxSize = 0;
    this._cache.maxRowSize = 0;
    this._cache.maxColSize = 0;
    this._cache.xPosition = 0;
    this._cache.yPosition = 0;
    this._cache.nodes = {
        wrap: wrap,
        background: background,
        imageContain: imageContain,
        image: image,
        container: container,
        labelWrap : labelWrap,
        label: label
    };
    this.config(configObj || {});   // This will trigger update method to be called
    this.enabled(true);

    // Add "mouseenter" & "mouseleave" events
    this.addEvent(widget, "mouseenter.widget mouseleave.widget", function(event) {
        that.toggleMouseEnter(event.type === "mouseenter");
    });

    // Add "mouseenter" event for Tooltip
    if (this._params.use_tooltip) {
        this.addEvent(widget, "mouseenter.tooltip", jQuery.proxy(QBaseToolTip.getInstance().toolTipMouseEvent, that));
    }
}
QBaseBucket.prototype = new QStudioBucketAbstract();
QBaseBucket.prototype.config = function(value) {
    if (!this.widget()) { return null; }
    if (typeof value !== 'object') {
        return QStudioBucketAbstract.prototype.config.call(this, value);
    }

    QStudioBucketAbstract.prototype.config.call(this, value);
    this._params.label_overlay_padding = (Math.abs(parseInt(value.label_overlay_padding, 10)) >= 0) ? parseInt(value.label_overlay_padding, 10) :
        ((typeof this._params.label_overlay_padding === 'number') ? this._params.label_overlay_padding : 2);

    // Update widget
    this.update();
    value = null;
    return this;
};
QBaseBucket.prototype.update = function() {
    if (!this.widget()) { return null; }
    var that = this,
        doc = document,
        lightBoxInstance = QBaseLightBox.getInstance(),
        widget = this.widget(),
        params = this.config(),
        cache = this.cache(),
        wrap = cache.nodes.wrap,
        background = cache.nodes.background,
        imageContain = cache.nodes.imageContain,
        image = cache.nodes.image,
        container = cache.nodes.container,
        labelWrap = cache.nodes.labelWrap,
        label = cache.nodes.label,
        img_width = (params.img_placement !== 'center') ? params.img_width : params.width,
        bckgrnd_width = params.width + ((params.img_placement !== 'center' && params.show_img) ? params.img_width : 0),
        border_width = (!params.show_bckgrnd_import) ? params.border_width : 0,
        border_radius = (!params.show_bckgrnd_import ) ? params.border_radius : 0,
        growBucket = params.grow_animation.toLowerCase() !== "none",
        labelOffset = 0,
        calcLabHeight = 0,
        cssLabHeight = 0;

    // Set cache xPos and yPos
    cache.xPosition = params.contain_padding;
    cache.yPosition = params.contain_padding;

    // Hide Widget while we update
    wrap.style.display = "none";

    // Set widget ID
    widget.id = params.id;

    // Background CSS Style
    background.style.cssText = "position: relative; filter: inherit;";
    background.style.width = bckgrnd_width + "px";
    background.style.height = params.height + "px";
    background.style.visibility = (params.show_bckgrnd) ? "visible" : "hidden";
    if (!params.show_bckgrnd_import) {
        background.style.borderRadius = background.style.webkitBorderRadius = background.style.mozBorderRadius = border_radius + "px";
        background.style.border = border_width + "px " + params.border_style + " #" + params.border_color_up;
        background.style.backgroundColor = "#" + params.bckgrnd_color_up;
    } else {
        $(background).css( {
            'background-repeat': 'no-repeat',
            'background-size': (bckgrnd_width + "px " + params.height + "px"),
            'background-position': 'center',
            'background-image': (QUtility.ieVersion() < 9) ?
                "url(" + params.blank_gif + ") " + 'url('+params.bckgrnd_import_up+')' : 'url('+params.bckgrnd_import_up+')',
            'filter': "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+params.bckgrnd_import_up+",sizingMethod='scale')"
        });
    }

    // Container CSS Style
    container.style.top = border_width + "px";
    container.style.left =
        (params.img_placement !== 'left' || !params.show_img) ? border_width + "px" : (border_width + params.img_width) + "px";
    container.style.width = (params.width - params.contain_padding * 2) + "px";
    container.style.height =
        (!growBucket) ? (params.height - params.contain_padding * 2) + "px" : "";
    container.style.padding = params.contain_padding + "px";
    container.style.overflowY = (params.bucket_animation !== "fade" && !growBucket) ? "auto" : "hidden";
    container.style.overflowX = "hidden";

    // Label CSS Style
    labelWrap.style.display = (params.show_label) ? "block" : "none";
    if (params.show_label) {
        labelWrap.style.position = "absolute";
        labelWrap.style.visibility = "hidden";
        label.dir = (!params.isRTL) ? "LTR" : "RTL";
        label.style.whiteSpace = "normal";
        label.style.wordWrap = "break-word";
        label.style.width =
            ((params.label_placement.indexOf("overlay") === -1) ? bckgrnd_width : bckgrnd_width - params.label_overlay_padding*2) + "px";
        label.style.height = "auto";
        label.style.textAlign = (!params.isRTL) ? params.label_halign : "";
        label.style.fontSize = QUtility.convertPxtoEM(params.label_fontsize) + "em";
        label.style.padding =
            (params.label_placement.indexOf("overlay") === -1) ? "" : params.label_overlay_padding + "px";
        label.style.color = "#" + params.label_fontcolor_up;
        //label.style.backgroundColor = "#CCC";
        label.innerHTML = params.label;
        // Temporarily append label to doc.body to calculate label height
        doc.body.appendChild(label);
        calcLabHeight = $(label).outerHeight();
        label.style.height =
            (typeof params.label_height === "number") ? params.label_height + "px" : params.label_height;
        cssLabHeight = $(label).outerHeight();
        // Append back to widget
        labelWrap.appendChild(label);
        (params.label_placement === 'top') ?
            wrap.insertBefore(labelWrap, background) : wrap.appendChild(labelWrap);
        if (params.label_placement.indexOf("overlay") === -1) {
            labelWrap.style.width = label.style.width;
            labelWrap.style.height = cssLabHeight + "px";
            if (params.label_placement === "top") {
                labelOffset = cssLabHeight;
                labelWrap.style.position = "relative";
                labelWrap.style.top = params.label_top + "px";
            } else {
                labelWrap.style.top = (params.height + params.label_top + border_width*2) + "px";
            }

            labelWrap.style.left = (params.label_left + border_width) + "px";
            container.style.marginTop = labelOffset + "px";
        } else {
            var hex_rgb = QUtility.hexToRgb(params.label_bckgrnd_color),
                rgb_str = hex_rgb.r+','+hex_rgb.g+','+hex_rgb.b,
                contain_height = 0;

            labelWrap.style.width = bckgrnd_width + "px";
            labelWrap.style.height = cssLabHeight + "px";
            labelWrap.style.backgroundColor = (params.show_label_bckgrnd) ? (QUtility.ieVersion() <= 8) ?
                '#' + params.label_bckgrnd_color : 'rgba('+rgb_str+', 0.85)' : "";
            labelWrap.style.left = border_width + "px";
            if (params.label_placement.indexOf("bottom") !== -1) {
                labelWrap.style.top = (params.height - cssLabHeight + border_width) + "px";
                labelWrap.style.borderBottomLeftRadius = labelWrap.style.WebkitBorderBottomLeftRadius = labelWrap.style.mozBorderBottomLeftRadius = (border_radius - border_width) + "px";
                labelWrap.style.borderBottomRightRadius = labelWrap.style.WebkitBorderBottomRightRadius = labelWrap.style.mozBorderBottomRightRadius = (border_radius - border_width) + "px";
                contain_height = (params.height - cssLabHeight - params.contain_padding * 2);
                container.style.height =
                    (!growBucket && contain_height > 0) ? contain_height + "px" : "";
            } else {
                labelWrap.style.top = border_width + "px";
                labelWrap.style.borderTopLeftRadius = labelWrap.style.WebkitBorderTopLeftRadius = labelWrap.style.mozBorderTopLeftRadius = (border_radius - border_width) + "px";
                labelWrap.style.borderTopRightRadius = labelWrap.style.WebkitBorderTopRightRadius = labelWrap.style.mozBorderTopRightRadius = (border_radius - border_width) + "px";
                container.style.top = (cssLabHeight + border_width) + "px";
                contain_height = (params.height - cssLabHeight - params.contain_padding * 2);
                container.style.height =
                    (!growBucket && contain_height > 0) ? contain_height + "px" : "";
            }

            // Label Vertical Alignment
            label.style.height = calcLabHeight + "px";
            switch(params.label_overlay_valign.toLowerCase()) {
                case "bottom":
                    label.style.top = (cssLabHeight - calcLabHeight) + "px";
                    break;
                case "center":
                    label.style.top = ((cssLabHeight - calcLabHeight)*0.5) + "px";
                    break;
                default:
                    break;
            }

            cssLabHeight = 0;
        }

        labelWrap.style.visibility = "";
    }

    // See about adding a zoom image button
    if (params.use_lightbox && params.img_placement !== "center" && params.show_img) {
        var zoomBtn = lightBoxInstance.init(this);
        if (zoomBtn && zoomBtn.nodeType === 1) {
            zoomBtn.style.display = "none";
            zoomBtn.style.top = (1 + params.zoom_top) + "px";
            zoomBtn.style.left = (1 + params.zoom_left) + "px";
            if (!zoomBtn.parentNode) { imageContain.appendChild(zoomBtn); }
        }
    } else {
        if (lightBoxInstance) { lightBoxInstance.remove(this); }
    }

    // Image CSS Style
    if (params.show_img && jQuery.trim(params.image) !== "") {
        imageContain.style.display = "none";
        imageContain.style.visibility = "hidden";
        image.src = params.image;

        // On error
        $(image).on("error", function() {
            if (lightBoxInstance) { lightBoxInstance.remove(that); }
            $(this).off("error");
            imageContain.style.display = "none";
        });

        // On Load
        $(image).on("load", function() {
            // Image Container CSS Style
            imageContain.style.display = "block";
            imageContain.style.top = "-5000px";
            imageContain.style.left = "-5000px";
            imageContain.style.width = (img_width - params.img_padding*2) + "px";
            imageContain.style.height = (params.height - params.img_padding*2) + "px";

            // Temporarily append imageContain to doc.body to calculate image centering position
            doc.body.appendChild(imageContain);
            this.style.maxWidth = (img_width - params.img_padding*2) + "px";
            this.style.maxHeight = (params.height - params.img_padding*2) + "px";
            this.style.top = (((params.height - $(this).height()) * 0.5) + labelOffset + params.img_top) + "px";
            this.style.left = (((img_width - $(this).width()) * 0.5) + params.img_left) + "px";

            // Remove listener, add image back to background div, and remove temporary div
            $(this).on('dragstart', function(event) { event.preventDefault(); });
            $(this).off("load");
            wrap.insertBefore(imageContain, container);
            imageContain.style.top = border_width + "px";
            imageContain.style.left = ((params.img_placement !== 'right') ?
                border_width : border_width + params.width) + "px";
            imageContain.style.visibility = "";

            // Position zoom button if one is present
            if (cache.nodes.zoomBtn) {
                var zoomBtn = cache.nodes.zoomBtn;
                zoomBtn.style.top = (params.zoom_top + parseInt(this.style.top, 10)) + "px";
                zoomBtn.style.left = (params.zoom_left + parseInt(this.style.left, 10)) + "px";
                zoomBtn.style.display = "block";
            }
        }).attr("src", params.image);
    } else {
        imageContain.style.display = "none";
    }

    // Display again and set Widget dimensions
    wrap.style.display = (params.capvalue !== 0) ? "" : "none";
    wrap.style.width = $(background).outerWidth() + "px";
    wrap.style.height = ($(background).outerHeight() + cssLabHeight) + "px";
    widget.style.width = wrap.style.width;
    widget.style.height = wrap.style.height;
};

/**
 * QStudio Slider Abstract --> Extends QStudioDCAbstract
 */
function QStudioSliderAbstract() {
    // Do not instantiate. Subclasses should inherit from QStudioSliderAbstract.
}
QStudioSliderAbstract.prototype = new QStudioDCAbstract();
QStudioSliderAbstract.prototype.config = function(value) {
    if (!this.widget()) { return null; }
    if (typeof value !== 'object') {
        return this._params;
    }

    // Holds a record of option based parameters
    if (!this._params_restrict) { this._params_restrict = {}; }

    // Track offset parameters

    this._params.id = (typeof value.id === 'string') ? value.id : (this._params.id || "QWidgetSlider");
    this._params.label = (typeof value.label === 'string') ? value.label : (this._params.label || "");
    this._params.image = (typeof value.image === 'string') ? value.image : (this._params.image || "");
    this._params.rowIndex = (parseInt(value.rowIndex, 10) >= 0) ? parseInt(value.rowIndex, 10) :
        ((typeof this._params.rowIndex === 'number') ? this._params.rowIndex : null);
    this._params.colIndex = (parseInt(value.colIndex, 10) >= 0) ? parseInt(value.colIndex, 10) :
        ((typeof this._params.colIndex === 'number') ? this._params.colIndex : null);
    this._params.isRTL = (typeof value.isRTL !== 'undefined') ? !!value.isRTL :
        ((typeof this._params.isRTL === 'boolean') ? this._params.isRTL : false);
    this._params.direction = (function(that) {
        if (typeof value.direction === 'string') {
            value.direction = value.direction.toLowerCase();
            if (value.direction === 'vertical' ||
                value.direction === 'horizontal') {
                that._params_restrict.direction = value.direction;
            }
        }
        return (that._params_restrict.direction || 'horizontal');
    }(this));
    this._params.max = (Math.abs(parseInt(value.max, 10)) >= 0) ? parseInt(value.max, 10) :
        ((typeof this._params.max === 'number') ? this._params.max : 100);
    this._params.min = (Math.abs(parseInt(value.min, 10)) >= 0) ? parseInt(value.min, 10) :
        ((typeof this._params.min === 'number') ? this._params.min : 0);
    this._params.precision = (Math.abs(parseInt(value.precision, 10)) >= 0) ? parseInt(value.precision, 10) :
        ((typeof this._params.precision === 'number') ? this._params.precision : 0);
    this._params.allow_track_click = (typeof value.allow_track_click !== 'undefined') ? !!value.allow_track_click :
        ((typeof this._params.allow_track_click === 'boolean') ? this._params.allow_track_click : true);
    this._params.snap_type = (function(that) {
        if (typeof value.snap_type === 'string') {
            value.snap_type = value.snap_type.toLowerCase();
            if (value.snap_type === 'none' ||
                value.snap_type === 'snap before' ||
                value.snap_type === 'snap after') {
                that._params_restrict.snap_type = value.snap_type;
            }
        }
        return (that._params_restrict.snap_type || 'none');
    }(this));
    this._params.handle_start_loc = (parseInt(value.handle_start_loc, 10) >= 0) ? parseInt(value.handle_start_loc, 10) :
        ((typeof this._params.handle_start_loc === 'number') ? this._params.handle_start_loc : 0);
    if (this._params.handle_start_loc > 100) { this._params.handle_start_loc = 100; }
    if (this._params.direction === "vertical" || this._params.isRTL) { this._params.handle_start_loc =  100 - this._params.handle_start_loc; }
    this._params.show_label = (typeof value.show_label !== 'undefined') ? !!value.show_label :
        ((typeof this._params.show_label === 'boolean') ? this._params.show_label : true);
    this._params.label_halign = (function(that) {
        if (typeof value.label_halign === 'string') {
            value.label_halign = value.label_halign.toLowerCase();
            if (value.label_halign === 'left' ||
                value.label_halign === 'right' ||
                value.label_halign === 'center') {
                that._params_restrict.label_halign = value.label_halign;
            }
        }
        return (that._params_restrict.label_halign || 'left');
    }(this));
    this._params.label_fontsize = (parseInt(value.label_fontsize, 10) >= 5) ? parseInt(value.label_fontsize, 10) : (this._params.label_fontsize || 14);
    this._params.label_fontcolor = QUtility.paramToHex(value.label_fontcolor) ||
        ((typeof this._params.label_fontcolor === 'string') ? this._params.label_fontcolor : '333333');
    this._params.label_width = (parseInt(value.label_width, 10) > 0) ? parseInt(value.label_width, 10) : (this._params.label_width || 100);
    this._params.label_left = (Math.abs(parseInt(value.label_left, 10)) >= 0) ? parseInt(value.label_left, 10) :
        ((typeof this._params.label_left === 'number') ? this._params.label_left : 0);
    this._params.label_top = (Math.abs(parseInt(value.label_top, 10)) >= 0) ? parseInt(value.label_top, 10) :
        ((typeof this._params.label_top === 'number') ? this._params.label_top : 0);
    /*this._params.show_img = (typeof value.show_img !== 'undefined') ? !!value.show_img :
     ((typeof this._params.show_img === 'boolean') ? this._params.show_img : false);*/
    this._params.img_placement = (function(that) {
        if (typeof value.img_placement === 'string') {
            value.img_placement = value.img_placement.toLowerCase();
            if (value.img_placement === 'none' ||
                value.img_placement === 'top' ||
                value.img_placement === 'bottom' ||
                value.img_placement === 'left' ||
                value.img_placement === 'right') {
                that._params_restrict.img_placement = value.img_placement;
            }
        }
        return (that._params_restrict.img_placement || 'none');
    }(this));
    this._params.show_img = (this._params.img_placement !== "none");
    this._params.show_init_img = (typeof value.show_init_img !== 'undefined') ? !!value.show_init_img :
        ((typeof this._params.show_init_img === 'boolean') ? this._params.show_init_img : false);
    this._params.img_width = (parseInt(value.img_width, 10) >= 10) ? parseInt(value.img_width, 10) : (this._params.img_width || 100);
    this._params.img_height = (parseInt(value.img_height, 10) >= 10) ? parseInt(value.img_height, 10) : (this._params.img_height || 100);
    this._params.img_top = (Math.abs(parseInt(value.img_top, 10)) >= 0) ? parseInt(value.img_top, 10) :
        ((typeof this._params.img_top === 'number') ? this._params.img_top : 0);
    this._params.img_left = (Math.abs(parseInt(value.img_left, 10)) >= 0) ? parseInt(value.img_left, 10) :
        ((typeof this._params.img_left === 'number') ? this._params.img_left : 0);
    this._params.show_end_img = (typeof value.show_end_img !== 'undefined') ? !!value.show_end_img :
        ((typeof this._params.show_end_img === 'boolean') ? this._params.show_end_img : false);
    this._params.end_img_width = (parseInt(value.end_img_width, 10) >= 10) ? parseInt(value.end_img_width, 10) : (this._params.end_img_width || 100);
    this._params.end_img_height = (parseInt(value.end_img_height, 10) >= 10) ? parseInt(value.end_img_height, 10) : (this._params.end_img_height || 100);
    this._params.end_img_top = (Math.abs(parseInt(value.end_img_top, 10)) >= 0) ? parseInt(value.end_img_top, 10) :
        ((typeof this._params.end_img_top === 'number') ? this._params.end_img_top : 0);
    this._params.end_img_left = (Math.abs(parseInt(value.end_img_left, 10)) >= 0) ? parseInt(value.end_img_left, 10) :
        ((typeof this._params.end_img_left === 'number') ? this._params.end_img_left : 0);
    this._params.width = (parseInt(value.width, 10) >= 5) ? parseInt(value.width, 10) : (this._params.width || 300);
    this._params.height = (parseInt(value.height, 10) >= 5) ? parseInt(value.height, 10) : (this._params.height || 20);
    this._params.track_border_style = (function(that) {
        if (typeof value.track_border_style === 'string') {
            value.track_border_style = value.track_border_style.toLowerCase();
            if (value.track_border_style === 'solid' ||
                value.track_border_style === 'none' ||
                value.track_border_style === 'dotted' ||
                value.track_border_style === 'dashed') {
                that._params_restrict.track_border_style = value.track_border_style;
            }
        }
        return (that._params_restrict.track_border_style || 'solid');
    }(this));
    this._params.track_border_width = (parseInt(value.track_border_width, 10) >= 0) ? parseInt(value.track_border_width, 10) :
        ((typeof this._params.track_border_width === 'number') ? this._params.track_border_width : 1);
    if (this._params.track_border_style === "none") {
        this._params.track_border_width = 0;
    }
    this._params.track_border_radius = (parseInt(value.track_border_radius, 10) >= 0) ? parseInt(value.track_border_radius, 10) :
        ((typeof this._params.track_border_radius === 'number') ? this._params.track_border_radius : 0);
    this._params.track_border_color = QUtility.paramToHex(value.track_border_color) ||
        ((typeof this._params.track_border_color === 'string') ? this._params.track_border_color : 'CCCCCC');
    this._params.track_color = QUtility.paramToHex(value.track_color) ||
        ((typeof this._params.track_color === 'string') ? this._params.track_color : 'F5F5F5');
    this._params.show_track_import = (typeof value.show_track_import !== 'undefined') ? !!value.show_track_import :
        ((typeof this._params.show_track_import === 'boolean') ? this._params.show_track_import : false);
    this._params.track_import = (typeof value.track_import === 'string') ? value.track_import : (this._params.track_import || "");
    this._params.show_highlight = (typeof value.show_highlight !== 'undefined') ? !!value.show_highlight :
        ((typeof this._params.show_highlight === 'boolean') ? this._params.show_highlight : true);
    this._params.highlight_color = QUtility.paramToHex(value.highlight_color) ||
        ((typeof this._params.highlight_color === 'string') ? this._params.highlight_color : '333333');
    this._params.tick_show = (typeof value.tick_show !== 'undefined') ? !!value.tick_show :
        ((typeof this._params.tick_show === 'boolean') ? this._params.tick_show : true);
    this._params.tick_array = (jQuery.isArray(value.tick_array)) ? value.tick_array : (this._params.tick_array || []);
    if (this._params.direction === "vertical" || this._params.isRTL) { this._params.tick_array =  this._params.tick_array.concat([]).reverse(); }
    this._params.tick_width = (parseInt(value.tick_width, 10) >= 1) ? parseInt(value.tick_width, 10) : (this._params.tick_width || 10);
    this._params.tick_height = (parseInt(value.tick_height, 10) >= 1) ? parseInt(value.tick_height, 10) : (this._params.tick_height || 10);
    this._params.tick_color = QUtility.paramToHex(value.tick_color) ||
        ((typeof this._params.tick_color === 'string') ? this._params.tick_color : 'FF0000');
    this._params.ticklabel_display_type = (function(that) {
        if (typeof value.ticklabel_display_type === 'string') {
            value.ticklabel_display_type = value.ticklabel_display_type.toLowerCase();
            if (value.ticklabel_display_type === 'show none' ||
                value.ticklabel_display_type === 'show ends' ||
                value.ticklabel_display_type === 'show all') {
                that._params_restrict.ticklabel_display_type = value.ticklabel_display_type;
            }
        }
        return (that._params_restrict.ticklabel_display_type || 'show all');
    }(this));
    this._params.ticklabel_width = (parseInt(value.ticklabel_width, 10) >= 5) ? parseInt(value.ticklabel_width, 10) : (this._params.ticklabel_width || 50);
    this._params.ticklabel_offset = (Math.abs(parseInt(value.ticklabel_offset, 10)) >= 0) ? parseInt(value.ticklabel_offset, 10) :
        ((typeof this._params.ticklabel_offset === 'number') ? this._params.ticklabel_offset : 0);
    this._params.ticklabel_fontsize = (parseInt(value.ticklabel_fontsize, 10) >= 5) ? parseInt(value.ticklabel_fontsize, 10) : (this._params.ticklabel_fontsize || 12);
    this._params.ticklabel_fontcolor = QUtility.paramToHex(value.ticklabel_fontcolor) ||
        ((typeof this._params.ticklabel_fontcolor === 'string') ? this._params.ticklabel_fontcolor : '333333');
    this._params.show_handle_bckgrnd = (typeof value.show_handle_bckgrnd !== 'undefined') ? !!value.show_handle_bckgrnd :
        ((typeof this._params.show_handle_bckgrnd === 'boolean') ? this._params.show_handle_bckgrnd : false);
    this._params.handle_width = (parseInt(value.handle_width, 10) >= 5) ? parseInt(value.handle_width, 10) : (this._params.handle_width || 30);
    this._params.handle_height = (parseInt(value.handle_height, 10) >= 5) ? parseInt(value.handle_height, 10) : (this._params.handle_height || 30);
    this._params.handle_padding = (parseInt(value.handle_padding, 10) >= 0) ? parseInt(value.handle_padding, 10) :
        ((typeof this._params.handle_padding === 'number') ? this._params.handle_padding : 5);
    this._params.handle_border_style = (function(that) {
        if (typeof value.handle_border_style === 'string') {
            value.handle_border_style = value.handle_border_style.toLowerCase();
            if (value.handle_border_style === 'solid' ||
                value.handle_border_style === 'none' ||
                value.handle_border_style === 'dotted' ||
                value.handle_border_style === 'dashed') {
                that._params_restrict.handle_border_style = value.handle_border_style;
            }
        }
        return (that._params_restrict.handle_border_style || 'solid');
    }(this));
    this._params.handle_border_width = (parseInt(value.handle_border_width, 10) >= 0) ? parseInt(value.handle_border_width, 10) :
        ((typeof this._params.handle_border_width === 'number') ? this._params.handle_border_width : 1);
    this._params.handle_border_radius = (parseInt(value.handle_border_radius, 10) >= 0) ? parseInt(value.handle_border_radius, 10) :
        ((typeof this._params.handle_border_radius === 'number') ? this._params.handle_border_radius : 0);
    this._params.handle_border_color_up = QUtility.paramToHex(value.handle_border_color_up) ||
        ((typeof this._params.handle_border_color_up === 'string') ? this._params.handle_border_color_up : '777777');
    this._params.handle_border_color_down = QUtility.paramToHex(value.handle_border_color_down) ||
        ((typeof this._params.handle_border_color_down === 'string') ? this._params.handle_border_color_down : '777777');
    this._params.handle_color_up = QUtility.paramToHex(value.handle_color_up) ||
        ((typeof this._params.handle_color_up === 'string') ? this._params.handle_color_up : 'AFC2AA');
    this._params.handle_color_down = QUtility.paramToHex(value.handle_color_down) ||
        ((typeof this._params.handle_color_down === 'string') ? this._params.handle_color_down : 'E54C10');
    this._params.show_handle_import = (typeof value.show_handle_import !== 'undefined') ? !!value.show_handle_import :
        ((typeof this._params.show_handle_import === 'boolean') ? this._params.show_handle_import : false);
    this._params.handle_import_up = (typeof value.handle_import_up === 'string') ? value.handle_import_up : (this._params.handle_import_up || "");
    this._params.handle_import_down = (typeof value.handle_import_down === 'string') ? value.handle_import_down : (this._params.handle_import_down || "");
    this._params.handle_label_disptype = (function(that) {
        if (typeof value.handle_label_disptype === 'string') {
            value.handle_label_disptype = value.handle_label_disptype.toLowerCase();
            if (value.handle_label_disptype === 'column label' ||
                value.handle_label_disptype === 'column value' ||
                value.handle_label_disptype === 'range value' ||
                value.handle_label_disptype === 'none') {
                that._params_restrict.handle_label_disptype = value.handle_label_disptype;
            }
        }
        return (that._params_restrict.handle_label_disptype || 'none');
    }(this));
    this._params.handle_label_fontsize = (parseInt(value.handle_label_fontsize, 10) >= 5) ? parseInt(value.handle_label_fontsize, 10) : (this._params.handle_label_fontsize || 12);
    this._params.handle_label_fontcolor = QUtility.paramToHex(value.handle_label_fontcolor) ||
        ((typeof this._params.handle_label_fontcolor === 'string') ? this._params.handle_label_fontcolor : '777777');
    this._params.handle_label_bckgrnd_color = QUtility.paramToHex(value.handle_label_bckgrnd_color) ||
        ((typeof this._params.handle_label_bckgrnd_color === 'string') ? this._params.handle_label_bckgrnd_color : 'F5F5F5');
    this._params.handle_label_inittxt = (typeof value.handle_label_inittxt === 'string') ? value.handle_label_inittxt : (this._params.handle_label_inittxt || "");
    this._params.handle_label_width = (parseInt(value.handle_label_width, 10) >= 5) ? parseInt(value.handle_label_width, 10) : (this._params.handle_label_width || 150);
    this._params.handle_label_top = (Math.abs(parseInt(value.handle_label_top, 10)) >= 0) ? parseInt(value.handle_label_top, 10) :
        ((typeof this._params.handle_label_top === 'number') ? this._params.handle_label_top : 0);
    this._params.handle_label_left = (Math.abs(parseInt(value.handle_label_left, 10)) >= 0) ? parseInt(value.handle_label_left, 10) :
        ((typeof this._params.handle_label_left === 'number') ? this._params.handle_label_left : 0);
    this._params.show_handle_label_bckgrnd = (typeof value.show_handle_label_bckgrnd !== 'undefined') ? !!value.show_handle_label_bckgrnd :
        ((typeof this._params.show_handle_label_bckgrnd === 'boolean') ? this._params.show_handle_label_bckgrnd : true);
    this._params.blank_gif = (typeof value.blank_gif === 'string') ? value.blank_gif : (this._params.blank_gif || "");
    this._params.survey_contain = (value.survey_contain && value.survey_contain.nodeType === 1) ? value.survey_contain : undefined;

    value = null;
};
QStudioSliderAbstract.prototype.type = function() {
    return "slider";
};
QStudioSliderAbstract.prototype.enabled = function(value, alphaVal) {
    if (!this.widget()) { return null; }
    var cache = this.cache();
    if (typeof value === 'boolean') {
        cache._enableBool = value;
        alphaVal = (value) ? 100 : ((parseInt(alphaVal, 10) >= 0) ? parseInt(alphaVal, 10) : 50);
        var wrap = cache.nodes.wrap,
            handleContain = cache.nodes.handleContain;

        if (handleContain) { handleContain.style.cursor = (value) ? 'pointer' : 'default'; }
        $(wrap).css({ 'opacity': alphaVal*.01 });
    }

    return cache._enableBool;
};
QStudioSliderAbstract.prototype.isAnswered = function(value, location, isColVal) {
    if (!this.widget()) { return null; }
    var cache = this.cache();
    if (typeof value === "boolean") {
        var params = this.config(),
            handleContain = cache.nodes.handleContain,
            handle = cache.nodes.handle,
            isHorz = (params.direction.toLowerCase() === "horizontal"),
            handle_import = (value) ? params.handle_import_down : params.handle_import_up,
            handle_color = (value) ? params.handle_color_down : params.handle_color_up,
            border_color = (value) ? params.handle_border_color_down : params.handle_border_color_up,
            sizeVar = (isHorz) ? 'width' : 'height',
            initVar = (isHorz) ? 'initX' : 'initY',
            lastVar = (isHorz) ? 'lastX' : 'lastY',
            styleVar = (isHorz) ? 'left' : 'top',
            track_size = params[sizeVar];

        // Record and store answer boolean
        cache._answerBool = value;

        // Handle change
        if (!params.show_handle_import) {
            handle.style.borderColor = "#" + border_color;
            handle.style.backgroundColor = "#" + handle_color;
        } else {
            handle.style.backgroundImage = 'url('+handle_import+')';
            handle.style.filter = "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+handle_import+",sizingMethod='scale')";
        }

        if (!value) {
            // Reset highlight
            this._highlightChange(true);

            // Reset handle label
            this._handleLabelChange(true);

            // Reset image
            if (params.show_img) { this._imageChange(true); }

            // Reset handle location
            handleContain.style[styleVar] = handleContain[initVar] + "px";
            handleContain[lastVar] = handleContain[initVar];
        } else {
            location = (typeof location === "number" && location >= 0) ? location : null;
            isColVal = (typeof isColVal === "boolean") ? isColVal : true;
            // Set handle location
            if (location !== null && (location >= 0 && location <= track_size)) {
                if (!isColVal) {
                    handleContain.style[styleVar] = location + "px";
                    handleContain[lastVar] = location;
                    if (params.snap_type.toLowerCase() !== "none") {
                        // Snap handle to nearest tick
                        this._handleSnap();
                    }
                } else {
                    this._handleSnap(location);
                }

            }

            // Set highlight
            this._highlightChange();

            // Set handle value
            this._handleLabelChange();

            // Set image
            if (params.show_img) { this._imageChange(); }
        }
    }

    return cache._answerBool;
};
QStudioSliderAbstract.prototype.value = function() {
    if (!this.widget()) { return null; }
    var params = this.config(),
        isHorz = (params.direction.toLowerCase() === 'horizontal'),
        tick_arry_len = params.tick_array.length;

    switch(params.handle_label_disptype.toLowerCase()) {
        case 'column value':
            return this._columnValue();
        case 'column label':
            if (jQuery.isArray(params.tick_array) && tick_arry_len > 0) {
                var columnVal = (isHorz && !params.isRTL) ? this._columnValue() : tick_arry_len - 1 - this._columnValue(),
                    label = (columnVal >= 0) ? (params.tick_array[columnVal].label || params.tick_array[columnVal]) : "";

                return (label.length > 0) ? label.toString() : "";
            }

            return "";
        case 'range value':
            return this._rangeValue();
        default:
            return "";
    }
};
QStudioSliderAbstract.prototype._updateHandleImage =  function(image) {
    var doc = document,
        params = this.config(),
        cache = this.cache(),
        handleContain = cache.nodes.handleContain,
        handle = cache.nodes.handle,
        handleImgContain = cache.nodes.handleImgContain,
        handleImg = handleImgContain.children[0],
        handleLabel = cache.nodes.handleLabel,
        handle_border_width = (!params.show_handle_import) ? params.handle_border_width : 0;

    // Handle Image CSS Style
    if (jQuery.trim(image).length > 0) {
        handleImgContain.style.display = "none";
        handleImgContain.style.visibility = "hidden";
        handleImgContain.style.marginTop = handle.style.marginTop;
        handleImgContain.style.marginLeft = handle.style.marginLeft;
        handleImg.src = image;

        // On Load
        $(handleImg).on("load", function() {
            // Image Container CSS Style
            handleImgContain.style.display = "block";
            handleImgContain.style.top = "-5000px";
            handleImgContain.style.left = "-5000px";
            handleImgContain.style.width = params.handle_width + "px";
            handleImgContain.style.height = params.handle_height + "px";

            // Temporarily append handleImgContain to doc.body to calculate image centering position
            doc.body.appendChild(handleImgContain);
            this.style.maxWidth = params.handle_width + "px";
            this.style.maxHeight = params.handle_height + "px";
            this.style.top = (((params.handle_height + handle_border_width*2 + params.handle_padding*2 - $(this).height()) * 0.5)) + "px";
            this.style.left = (((params.handle_width + handle_border_width*2 + params.handle_padding*2 - $(this).width()) * 0.5)) + "px";
            handleImgContain.style.top = 0 + "px";
            handleImgContain.style.left = 0 + "px";

            // Remove listener, add image back to background div, and remove temporary div
            $(this).on('dragstart.widget', function(event) { event.preventDefault(); });
            $(this).off("load");
            handleContain.insertBefore(handleImgContain, handleLabel);
            handleImgContain.style.visibility = "";
        }).attr("src", image);
    } else {
        handleImgContain.style.display = "none";
    }
};
QStudioSliderAbstract.prototype._baseValue = function() {
    if (!this.widget()) { return null; }
    var params = this.config(),
        cache = this.cache(),
        handleContain = cache.nodes.handleContain,
        isHorz = (params.direction.toLowerCase() === 'horizontal'),
        lastVar = (isHorz) ? 'lastX' : 'lastY',
        sizeVar = (isHorz) ? 'width' : 'height';

    if (isHorz && params.isRTL) {
        return ((params[sizeVar] - handleContain[lastVar]) / params[sizeVar]);
    }

    return (handleContain[lastVar] / params[sizeVar]);
};
QStudioSliderAbstract.prototype._rangeValue = function() {
    if (!this.widget()) { return null; }
    var params = this.config(),
        isHorz = (params.direction.toLowerCase() === 'horizontal'),
        baseValue = (isHorz) ? this._baseValue() : 1-this._baseValue();

    return parseFloat(((baseValue * (params.max - params.min) + params.min).toFixed(params.precision)));
};
QStudioSliderAbstract.prototype._columnValue = function() {
    if (!this.widget()) { return null; }
    var params = this.config(),
        isHorz = (params.direction.toLowerCase() === 'horizontal'),
        baseValue = (isHorz) ? this._baseValue() : 1-this._baseValue();

    if (!jQuery.isArray(params.tick_array)) { return; }
    var tick_array_len = params.tick_array.length;
    if (tick_array_len <= 1) { return 0; }

    return Math.round(baseValue * (tick_array_len - 1));
};
QStudioSliderAbstract.prototype.setHandleBounds = function(value) {
    if (!this.widget()) { return null; }
    // Set slider handle bounds
    if (typeof value === "object") {
        var params = this.config(),
            cache = this.cache(),
            trackSize = params[(params.direction.toLowerCase() === 'horizontal') ? 'width' : 'height'];

        if (typeof value.minLoc === "number" && (value.minLoc >= 0 && value.minLoc <= trackSize)) {
            cache._minLoc = value.minLoc;
        }

        if (typeof value.maxLoc === "number" && (value.maxLoc <= trackSize && value.maxLoc >= 0)) {
            cache._maxLoc = value.maxLoc;
        }
    }
};
QStudioSliderAbstract.prototype.destroy = function() {
    if (!this.widget()) { return null; }
    var cache = this._cache,
        widget = this._widget,
        handleContain = cache.nodes.handleContain,
        trackContain = cache.nodes.trackContain;

    // Remove events
    this.removeEvent(widget);
    this.removeEvent(handleContain);
    this.removeEvent(trackContain);

    // Remove widget
    if (widget.parentNode) { widget.parentNode.removeChild(widget); }

    // GC
    this._widget = null;
    this._cache = {};
    this._params = {};

    return this;
};
QStudioSliderAbstract.prototype.slideInit = function(event) {
    if (!this.widget()) { return null; }
    var cache = this.cache(),
        params = this.config(),
        isMSTouch = QUtility.isMSTouch();

    // Can optionally pass method a function to set as callback
    if (typeof event === 'function') {
        cache._initCallBack = event;
        return;
    }

    event = (event.type.indexOf("touch") !== -1 && event.originalEvent.targetTouches) ?
        event.originalEvent.targetTouches[0] : ((!isMSTouch) ? event : event.originalEvent);

    if (isMSTouch && !event.isPrimary) { return; }
    var handleContain = cache.nodes.handleContain,
        isHorz = (params.direction.toLowerCase() === 'horizontal'),
        surveyScale = (isHorz) ? QUtility.getQStudioSurveyScale().a : QUtility.getQStudioSurveyScale().d,
        lastVar = (isHorz) ? 'lastX' : 'lastY',
        dragVar = (isHorz) ? 'dragX' : 'dragY',
        pageVar = (isHorz) ? 'pageX' : 'pageY',
        surveyContainTop = $(params.survey_contain).scrollTop(),
        scrollContainTop = $(cache.nodes.scrollContain).scrollTop(),
        scrollOffset = ((surveyContainTop >= 0) ? surveyContainTop : 0) + ((scrollContainTop >= 0) ? scrollContainTop : 0);

    this._cache._surveyScale = surveyScale;
    handleContain[dragVar] = (scrollOffset + event[pageVar] - handleContain[lastVar]*surveyScale);
    if (!this.isAnswered()) { this.isAnswered(true); }

    // Change Handle label value
    this._handleLabelChange();

    // If assigned a callback, fire function
    if (cache._initCallBack) {
        cache._initCallBack.call(this);
    }
};
QStudioSliderAbstract.prototype.slideMove = function(event) {
    if (!this.widget()) { return null; }
    // Can optionally pass method a function to set as callback
    if (typeof event === 'function') {
        this.cache()._moveCallBack = event;
        return;
    }

    var isMSTouch = QUtility.isMSTouch();
    if (isMSTouch && !event.originalEvent.isPrimary) { return; }
    event = (event.type.indexOf("touch") !== -1 && event.originalEvent.targetTouches) ?
        event.originalEvent.targetTouches[0] : ((!isMSTouch) ? event : event.originalEvent);

    if (this._cache._surveyScale === undefined) {
        this._cache._surveyScale = (this.config().direction.toLowerCase() === 'horizontal') ?
            QUtility.getQStudioSurveyScale().a : QUtility.getQStudioSurveyScale().d;
    }
    var handleContain = this.cache().nodes.handleContain,
        params = this.config(),
        cache = this.cache(),
        isHorz = (params.direction.toLowerCase() === 'horizontal'),
        lastVar = (isHorz) ? 'lastX' : 'lastY',
        dragVar = (isHorz) ? 'dragX' : 'dragY',
        pageVar = (isHorz) ? 'pageX' : 'pageY',
        styleVar = (isHorz) ? 'left' : 'top',
        surveyContainTop = $(params.survey_contain).scrollTop(),
        scrollContainTop = $(cache.nodes.scrollContain).scrollTop(),
        scrollOffset = ((surveyContainTop >= 0) ? surveyContainTop : 0) + ((scrollContainTop >= 0) ? scrollContainTop : 0),
        moveLoc = (event[pageVar] - handleContain[dragVar] + scrollOffset)*(1/cache._surveyScale);

    if (moveLoc < cache._minLoc) { moveLoc = cache._minLoc; }
    if (moveLoc > cache._maxLoc) { moveLoc = cache._maxLoc; }
    handleContain[lastVar] = moveLoc;
    handleContain.style[styleVar] = moveLoc + "px";

    // Snap Before
    if (params.snap_type.toLowerCase() === 'snap before') {
        this._handleSnap();
    }

    // Set Image to display
    if (params.show_img) {
        this._imageChange();
    }

    // Change Handle label value
    this._handleLabelChange();

    // Change Highlight
    this._highlightChange();

    // If assigned a callback, fire function
    if (this.cache()._moveCallBack) {
        this.cache()._moveCallBack.call(this);
    }
};
QStudioSliderAbstract.prototype.slideEnd = function(event) {
    if (!this.widget()) { return null; }
    // Can optionally pass method a function to set as callback
    if (typeof event === 'function') {
        this.cache()._endCallBack = event;
        return;
    }

    delete this._cache._surveyScale;

    // Snap After
    if (this.config().snap_type.toLowerCase() === 'snap after') {
        this._handleSnap();

        // Change Handle label value
        this._handleLabelChange();

        // Change Highlight
        this._highlightChange();
    }

    // If assigned a callback, fire function
    if (this.cache()._endCallBack) {
        this.cache()._endCallBack.call(this);
    }
};
QStudioSliderAbstract.prototype._handleLabelChange = function(reset) {
    if (!this.widget()) { return null; }
    var cache = this.cache(),
        params = this.config(),
        handleLabel = cache.nodes.handleLabel,
        handle = cache.nodes.handle,
        handleContain = cache.nodes.handleContain,
        handleWidth = $(handle).outerWidth(),
        handleLabWidth = 0;

    // helper function to get handle label width of display is none
    var handleLabHelper = function() {
        handleLabWidth = $(handleLabel).outerWidth();
        if ($(handleLabel).width() === 0) {
            handleLabel.style.visibility = "hidden";
            document.body.appendChild(handleLabel);
            handleLabWidth = $(handleLabel).outerWidth();
            handleContain.appendChild(handleLabel);
            handleLabel.style.visibility = "";
        }

        handleLabel.style.marginLeft = (handleWidth - handleLabWidth)*0.5 + "px";
    };

    if (handleLabel) {
        if (typeof reset === 'boolean' && reset) {
            handleLabel.style.backgroundColor = (params.show_handle_label_bckgrnd && params.handle_label_inittxt !== "") ?
                "#" + params.handle_label_bckgrnd_color : "";
            handleLabel.innerHTML = params.handle_label_inittxt;
            handleLabHelper();
            return;
        }

        handleLabel.innerHTML = this.value();
        handleLabHelper();

        // Center handle label to handle only if label width is smaller than or equal to handle width
        handleLabel.style.marginLeft = ((handleWidth - handleLabWidth)*0.5) + "px";
        if (params.show_handle_label_bckgrnd && handleLabel.style.backgroundColor === "" && this.value() !== "") {
            handleLabel.style.backgroundColor = "#" +  params.handle_label_bckgrnd_color;
        }
    }
};
QStudioSliderAbstract.prototype._highlightChange = function(reset) {
    if (!this.widget()) { return null; }
    var cache = this.cache(),
        params = this.config(),
        highlight = cache.nodes.highlight,
        isHorz = (params.direction.toLowerCase() === 'horizontal'),
        sizeVar =  (isHorz) ? 'width' : 'height',
        highlight_max_size = parseInt(highlight.style[(isHorz) ? "maxWidth" : "maxHeight"], 10);

    if (highlight) {
        if (typeof reset === 'boolean' && reset) {
            highlight.style[sizeVar] = "0px";
            return;
        }

        if (!QUtility.isNumber(highlight_max_size)) { highlight_max_size = 0; }
        if (isHorz) {
            highlight.style[sizeVar] = (this._baseValue() * highlight_max_size) + "px";
            if (params.isRTL) { highlight.style.left = (highlight_max_size - (this._baseValue() * highlight_max_size)) + "px"; }
        } else {
            highlight.style[sizeVar] = (highlight_max_size - (this._baseValue() * highlight_max_size)) + "px";
            highlight.style.top  = ((this._baseValue() * highlight_max_size)) + "px";
        }
    }
};
QStudioSliderAbstract.prototype._handleSnap = function(value) {
    if (!this.widget()) { return null; }
    value = (typeof value === "number" && value >= 0 && value < this.config().tick_array.length) ? value : null;
    var cache = this.cache(),
        params = this.config(),
        isHorz = (params.direction.toLowerCase() === 'horizontal'),
        styleVar = (isHorz) ? 'left' : 'top',
        lastVar = (isHorz) ? 'lastX' : 'lastY',
        columnVal = (value === null) ? this._columnValue() : value,
        handleContain = cache.nodes.handleContain,
        tickContain = cache.nodes.tickContain,
        tick = tickContain.children[(isHorz && !params.isRTL) ? columnVal : params.tick_array.length-1-columnVal],
        tick_loc = (tick) ? parseInt(tick.style[styleVar], 10) : 0,
        tick_size = params[(isHorz) ? 'tick_width' : 'tick_height']*0.5,
        track_border_width = (!params.show_track_import) ? params.track_border_width : 0,
        moveLoc = null;

    if (!QUtility.isNumber(tick_loc)) { tick_loc = 0; }
    if (handleContain) {
        moveLoc = tick_loc + tick_size - track_border_width;

        // Check moveLoc against current _minLoc
        if (moveLoc < cache._minLoc) {
            moveLoc = cache._minLoc;
            if ((params.snap_type.toLowerCase().indexOf("snap") !== -1) && ((isHorz && params.isRTL) || !isHorz)) {
                if (moveLoc >= cache._minLoc) {
                    tick = tickContain.children[(isHorz) ? columnVal-1 : params.tick_array.length-1-columnVal+1];
                    tick_loc = (tick) ? parseInt(tick.style[styleVar], 10) : 0;
                    moveLoc = tick_loc + tick_size - track_border_width;
                }
            }
        }

        // Check moveLoc against current _maxLoc
        if (moveLoc > cache._maxLoc) {
            moveLoc = cache._maxLoc;
            if ((params.snap_type.toLowerCase().indexOf("snap") !== -1) && isHorz) {
                if (moveLoc >= cache._maxLoc) {
                    tick = tickContain.children[columnVal-1];
                    tick_loc = (tick) ? parseInt(tick.style[styleVar], 10) : 0;
                    moveLoc = tick_loc + tick_size - track_border_width;
                }
            }
        }

        handleContain[lastVar] = moveLoc;
        handleContain.style[styleVar] = moveLoc + "px";
    }
};
QStudioSliderAbstract.prototype._imageChange = function(reset) {
    if (!this.widget()) { return null; }
    var cache = this.cache(),
        params = this.config(),
        isHorz = (params.direction.toLowerCase() === 'horizontal'),
        columnVal = this._columnValue(),
        imageContain = cache.nodes.imageContain;

    if (imageContain && imageContain.children.length > 0) {
        if (typeof reset === 'boolean' && reset) {
            if (cache._sliderImage) { cache._sliderImage.style.display = "none"; }
            return;
        }

        this._imageChange(true);
        cache._sliderImage = imageContain.children[(isHorz && !params.isRTL) ? columnVal : params.tick_array.length-1-columnVal];
        cache._sliderImage.style.display = "block";
    }
};

/**
 * Base Slider --> Extends QStudioSliderAbstract
 */
function QBaseSlider(parent, configObj) {
    // Init
    this.init();

    // Create Slider Shell
    var that = this,
        doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        widget = doc.createElement("div"),
        label = doc.createElement("label"),
        wrap = doc.createElement("div"),
        imageContain = doc.createElement("div"),
        trackContain = doc.createElement("div"),
        track = doc.createElement("div"),
        highlight = doc.createElement("div"),
        tickContain = doc.createElement("div"),
        handleContain = doc.createElement("div"),
        handle = doc.createElement("div"),
        handleImgContain = doc.createElement("div"),
        handleImg = doc.createElement("img"),
        handleLabel = doc.createElement("label"),
        touchEnabled = QUtility.isTouchDevice(),
        isMSTouch = QUtility.isMSTouch(),
        clickEvent = (!isMSTouch) ?
            ((!touchEnabled) ? "click.widget" : "touchstart.widget touchend.widget touchmove.widget"):
            ((!touchEnabled) ? "click.widget" : ((window.PointerEvent) ? "pointerdown.widget pointerup.widget" : "MSPointerDown.widget MSPointerUp.widget")),
        downEvent = (!isMSTouch) ?
            ((!touchEnabled) ? "mousedown.widget" : "touchstart.widget"):
            ((window.PointerEvent) ? "pointerdown.widget" : "MSPointerDown.widget"),
        moveEvent = (!isMSTouch) ?
            ((!touchEnabled) ? "mousemove.widget" : "touchmove.widget"):
            ((window.PointerEvent) ? "pointermove.widget" : "MSPointerMove.widget"),
        upEvent = (!isMSTouch) ?
            ((!touchEnabled) ? "mouseup.widget" : "touchend.widget"):
            ((window.PointerEvent) ? "pointerup.widget" : "MSPointerUp.widget");

    // Widget CSS Style
    widget.className = "qwidget_slider";
    widget.dir = "LTR";
    widget.style.cssText += ';'.concat("position: relative;");
    widget.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
    widget.style.cssText += ';'.concat("-webkit-touch-callout: none;");
    widget.style.cssText += ';'.concat("-ms-touch-action: none;");
    widget.style.cssText += ';'.concat("-webkit-user-select: none;");
    widget.style.cssText += ';'.concat("-khtml-user-select: none;");
    widget.style.cssText += ';'.concat("-moz-user-select: none;");
    widget.style.cssText += ';'.concat("-ms-user-select: none;");
    widget.style.cssText += ';'.concat("-user-select: none;");

    // Wrapper CSS Style
    wrap.className = "qwidget_slider_wrapper";
    wrap.style.position = "relative";

    // Label CSS Style
    label.className = "qwidget_slider_label";
    label.style.cssText = "position: absolute; display: block; filter: inherit; z-index: 1;";
    if (QUtility.ieVersion() <= 8) { label.style.filter = ""; }    // Fix for IE8 Opacity/ClearType bug

    // Track Container CSS Style
    trackContain.className = "qwidget_slider_trackcontain";
    trackContain.style.cssText = "position: relative; filter: inherit; z-index: 2;";

    // Image Container CSS Style
    imageContain.className = "qwidget_slider_imgcontain";
    imageContain.style.cssText = "position: absolute; filter: inherit; z-index: 0;";

    // Track CSS Style
    track.className = "qwidget_slider_track";
    track.style.cssText = "position: absolute; top: 0px; left: 0px; filter: inherit;";

    // Highlight CSS Style
    highlight.className = "qwidget_slider_highlight";
    highlight.style.cssText = "position: absolute; top: 0px; left: 0px; filter: inherit;";

    // Tick Container CSS Style
    tickContain.className = "qwidget_slider_tickcontain";
    tickContain.style.cssText = "position: absolute; top: 0px; left: 0px; filter: inherit;";

    // Handle Container CSS Style
    handleContain.className = "qwidget_slider_handlecontain";
    handleContain.style.cssText = "position: absolute; top: 0px; left: 0px; filter: inherit;";

    // Handle CSS Style
    handle.className = "qwidget_slider_handle";
    handle.style.cssText = "position: absolute; filter: inherit;";

    // Handle Image Container CSS Style
    handleImgContain.className = "qwidget_slider_handle_image_container";
    handleImgContain.style.cssText = "position: absolute; filter: inherit;";

    // Handle Image CSS Style
    handleImg.className = "qwidget_slider_handle_image";
    handleImg.style.cssText = "position: absolute; filter: inherit; width: auto; height: auto; max-width: 100%; max-height: 100%;";

    // Handle Label CSS Style
    handleLabel.className = "qwidget_slider_handle_label";
    handleLabel.style.cssText = "position: absolute; white-space:nowrap; filter: inherit; cursor: inherit;";

    // Append children
    handleImgContain.appendChild(handleImg);
    handleContain.appendChild(handle);
    handleContain.appendChild(handleImgContain);
    handleContain.appendChild(handleLabel);
    trackContain.appendChild(track);
    trackContain.appendChild(highlight);
    trackContain.appendChild(tickContain);
    trackContain.appendChild(handleContain);
    wrap.appendChild(label);
    wrap.appendChild(trackContain);
    wrap.appendChild(imageContain);
    widget.appendChild(wrap);
    parentEle.appendChild(widget);

    // Setup
    this._widget = widget;
    this._cache.nodes = {
        scrollContain: $('.qlayout_layout_container')[0],
        wrap: wrap,
        label: label,
        trackContain: trackContain,
        imageContain: imageContain,
        track: track,
        highlight: highlight,
        tickContain: tickContain,
        handleContain: handleContain,
        handle: handle,
        handleImgContain: handleImgContain,
        handleLabel: handleLabel
    };
    this.config(configObj || {});   // This will trigger update method to be called
    this.enabled(true);

    // Add slider handle events
    this.addEvent(handleContain, downEvent, function(event) {
        event.preventDefault();
        event.stopPropagation();
        if (that.isDrag()) { return; }
        if (!that.enabled()) { return; }
        that.slideInit(event);
        that.isDrag(true);
        $(doc).on(moveEvent, function(event) {
            event.preventDefault();
            that.slideMove(event);
        });
        $(doc).on(upEvent, function(event) {
            $(doc).off(moveEvent);
            $(doc).off(upEvent);
            that.slideEnd(event);
            that.isDrag(false);
        });
    });

    // Add slider track event
    var isTouchMove = false;
    $([track, highlight, tickContain]).on(clickEvent, function(event) {
        var origEvent = event;
        event.stopPropagation();
        if (isMSTouch && touchEnabled && !event.originalEvent.isPrimary) { return; }
        if (!that.enabled()) { return; }
        event = (event.type.indexOf("touch") !== -1 && event.originalEvent.targetTouches) ?
            event.originalEvent.targetTouches[0] : ((!isMSTouch) ? event : event.originalEvent);

        var cache = that.cache(),
            params = that.config(),
            handleContain = cache.nodes.handleContain,
            trackContain = cache.nodes.trackContain,
            isHorz = (params.direction.toLowerCase() === 'horizontal'),
            dragVar = (isHorz) ? 'dragX' : 'dragY',
            surveyScale = (isHorz) ? QUtility.getQStudioSurveyScale().a : QUtility.getQStudioSurveyScale().d,
            track_border_width = (!params.show_track_import) ? params.track_border_width : 0,
            lastVar = (isHorz) ? 'lastX' : 'lastY',
            pageVar = (isHorz) ? 'pageX' : 'pageY',
            styleVar = (isHorz) ? 'left' : 'top',
            surveyContainTop = $(params.survey_contain).scrollTop(),
            scrollContainTop = $(cache.nodes.scrollContain).scrollTop(),
            scrollOffset = ((surveyContainTop >= 0) ? surveyContainTop : 0) + ((scrollContainTop >= 0) ? scrollContainTop : 0),
            moveLoc = 0;

        if (!params.allow_track_click) { return; }
        if (origEvent.type !== "touchmove") {
            if (origEvent.type !== 'touchstart' && origEvent.type !== "pointerdown" && origEvent.type !== "MSPointerDown") {
                if (isTouchMove) { return; }
                if (origEvent.type === "click") {
                    cache._surveyScale = surveyScale;
                    cache._pageLoc = event[pageVar];
                    cache._downEventObj = origEvent;
                }

                if (!that.isAnswered()) { that.isAnswered(true); }
                handleContain[dragVar] = scrollOffset + $(trackContain).offset()[(isHorz) ? "left" : "top"] + (track_border_width*surveyScale);
                moveLoc = (cache._pageLoc - handleContain[dragVar])*(1/cache._surveyScale);
                if (moveLoc < cache._minLoc) { moveLoc = cache._minLoc; }
                if (moveLoc > cache._maxLoc) { moveLoc = cache._maxLoc; }
                handleContain[lastVar] = moveLoc;
                handleContain.style[styleVar] = handleContain[lastVar] + "px";
                if (cache._initCallBack) { that.cache()._initCallBack.call(that); }
                that.slideMove(cache._downEventObj);
                that.slideEnd(cache._downEventObj);
                delete cache._pageLoc;
                delete cache._downEventObj;
            } else {
                cache._surveyScale = surveyScale;
                cache._pageLoc = event[pageVar];
                cache._downEventObj = origEvent;
                isTouchMove = false;
            }
        } else {
            isTouchMove = true;
        }
    });
}
QBaseSlider.prototype = new QStudioSliderAbstract();
QBaseSlider.prototype.config = function(value) {
    if (!this.widget()) { return null; }
    if (typeof value !== 'object') {
        return QStudioSliderAbstract.prototype.config.call(this, value);
    }

    QStudioSliderAbstract.prototype.config.call(this, value);

    // Update widget
    this.update();
    value = null;
    return this;
};
QBaseSlider.prototype.update = function() {
    if (!this.widget()) { return null; }
    var doc = document,
        widget = this.widget(),
        params = this.config(),
        cache = this.cache(),
        wrap = cache.nodes.wrap,
        label = cache.nodes.label,
        trackContain = cache.nodes.trackContain,
        track = cache.nodes.track,
        highlight = cache.nodes.highlight,
        tickContain = cache.nodes.tickContain,
        handleContain = cache.nodes.handleContain,
        handle = cache.nodes.handle,
        handleImgContain = cache.nodes.handleImgContain,
        handleLabel = cache.nodes.handleLabel,
        imageContain = cache.nodes.imageContain,
        isHorz = (params.direction.toLowerCase() === 'horizontal'),
        track_border_width = (!params.show_track_import) ? params.track_border_width : 0,
        handle_border_width = (!params.show_handle_import) ? params.handle_border_width : 0,
        highlight_padding = 6,
        label_width = (params.show_label) ? params.label_width : 0,
        label_height = 0,
        handle_label_width = 0,
        handle_label_height = 0,
        vert_ticklab_height = 0,
        max_ticklab_height = 0,
        total_track_width = params.width + track_border_width*2,
        total_track_height = params.height + track_border_width*2,
        end_img_offset_width = (params.show_end_img) ? params.end_img_width : 0,
        end_img_offset_height = (params.show_end_img) ? params.end_img_height : 0,
        end_img_offset_left = (params.show_end_img) ? ((isHorz) ? params.end_img_width : ((total_track_width - params.end_img_width)*0.5)) : 0,
        end_img_offset_top = (params.show_end_img) ? ((isHorz) ? ((total_track_height - params.end_img_height)*0.5) : params.end_img_height) : 0,
        initVar = (isHorz) ? 'initX' : 'initY',
        styleVar = (isHorz) ? 'left' : 'top',
        lastVar = (isHorz) ? 'lastX' : 'lastY',
        startLoc = ((params.handle_start_loc * 0.01) * params[(isHorz) ? "width" : "height"]);

    // Hide Widget while we update
    wrap.style.display = "none";

    // Set widget ID
    widget.id = params.id;

    // Adjust for possible uneven positioning between the track and handle
    // if ((params.width & 1) !== (params.handle_width & 1)) { params.width += 1; }
    // if ((params.height & 1) !== (params.handle_height & 1)) { params.height += 1; }

    // Track CSS Style
    track.style.cssText = "position: absolute; filter: inherit;";
    track.style.width = params.width + "px";
    track.style.height = params.height + "px";
    if (!params.show_track_import) {
        track.style.borderRadius = track.style.webkitBorderRadius = track.style.mozBorderRadius = params.track_border_radius + "px";
        track.style.border = track_border_width + "px " + params.track_border_style + " #" + params.track_border_color;
        track.style.backgroundColor = "#" + params.track_color;
    } else {
        $(track).css( {
            'background-repeat': 'no-repeat',
            'background-size': (params.width + "px " + params.height + "px"),
            'background-position': 'center',
            'background-image': (QUtility.ieVersion() < 9) ?
                "url(" + params.blank_gif + ") " + 'url('+params.track_import+')' : 'url('+params.track_import+')',
            'filter': "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+params.track_import+",sizingMethod='scale')"
        });
    }

    // Highlight CSS Style
    highlight.style.display = (params.show_highlight) ? "block" : "none";
    highlight.style.backgroundColor = "#" + params.highlight_color;
    highlight.style.maxWidth = (params.width - highlight_padding) + "px";
    highlight.style.maxHeight = (params.height - highlight_padding) + "px";
    highlight.style.width = (params.width - highlight_padding) + "px";
    highlight.style.height = (params.height - highlight_padding) + "px";
    highlight.style.marginLeft = (highlight_padding * 0.5 + track_border_width) + "px";
    highlight.style.marginTop = (highlight_padding * 0.5 + track_border_width) + "px";
    highlight.style.borderRadius = highlight.style.webkitBorderRadius = highlight.style.mozBorderRadius = params.track_border_radius + "px";
    (isHorz) ? highlight.style.width = "0px" : highlight.style.height = "0px";

    // Remove any previous children from tickContain and imageContain
   // tickContain.style.display = (params.tick_show) ? "block" : "none";
    while(tickContain.children.length !== 0) {
        tickContain.removeChild(tickContain.children[0]);
    }
    while(imageContain.children.length !== 0) {
        imageContain.removeChild(imageContain.children[0]);
    }

    // Tick Container/Tick Label Container/Image Container CSS Style
    var i = 0,
        len = params.tick_array.length,
        tick_wrap = null,
        tick = null,
        tick_label = null,
        img = null,
        tickgap = ((isHorz) ? params.width : params.height) / ((len > 1) ? (len - 1) : len);

    for (i; i<len; i+=1) {
        var tick_top = (isHorz) ? ((params.height - params.tick_height) * 0.5): ((tickgap * i) - params.tick_height * 0.5),
            tick_left = (isHorz) ? ((tickgap * i) - params.tick_width * 0.5): ((params.width - params.tick_width) * 0.5),
            ticklab_text = params.tick_array[i].label || params.tick_array[i];

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
        tick.style.width = params.tick_width + "px";
        tick.style.height = params.tick_height + "px";
        tick.style.visibility = (i > 0 && i < len - 1) ? "" : "hidden";
        tick.style.backgroundColor = (params.tick_show) ? "#" + params.tick_color : "transparent";
        tick_wrap.appendChild(tick);

        // Tick label CSS Style
        tick_label = doc.createElement("label");
        tick_label.dir = (!params.isRTL) ? "LTR" : "RTL";
        tick_label.style.whiteSpace = "normal";
        tick_label.className = "qwidget_slider_tick_label";
        tick_label.innerHTML = (ticklab_text.length > 0) ? ticklab_text.toString() : "";
        tick_label.style.display =
            ((params.ticklabel_display_type === "show ends" && (i !== 0 && i !== len - 1))
                || params.ticklabel_display_type === "show none") ? "none" : "block";
        tick_label.style.position = "absolute";
        tick_label.style.filter = "inherit";
        //tick_label.style.overflow = 'hidden';
        tick_label.style.width = params.ticklabel_width + "px";
        tick_label.style.height = "auto";
        tick_label.style.wordWrap = "break-word";
        tick_label.style.fontSize = QUtility.convertPxtoEM(params.ticklabel_fontsize) + "em";
        tick_label.style.color = '#' + params.ticklabel_fontcolor;
        tick_label.style.textAlign = (isHorz) ? "center" : "left";
        //tick_label.style.backgroundColor = "#FFF000"; /**TEST**/
        doc.body.appendChild(tick_label);
        vert_ticklab_height = Math.min($(tick_label).outerHeight(), tickgap);     // Record tick label height while appended to DOM
        max_ticklab_height = Math.max($(tick_label).outerHeight(), max_ticklab_height);   // Record max tick label height to use for sizing the slider
        tick_wrap.appendChild(tick_label);
        if (isHorz) {
            tick_label.style.top = -tick_top + "px";
            tick_label.style.marginTop = (params.height + track_border_width + params.ticklabel_offset) + "px";
            tick_label.style.marginLeft = ((params.tick_width - params.ticklabel_width) * 0.5) + "px";
        } else {
            tick_label.style.left = -tick_left + "px";
            tick_label.style.marginLeft = (params.width + track_border_width + params.ticklabel_offset) + "px";
            tick_label.style.height = vert_ticklab_height + "px";
            tick_label.style.marginTop = ((params.tick_height - vert_ticklab_height)*0.5) + "px";
        }

        // Image CSS Style
        if (params.show_img) {
            img = doc.createElement("img");
            img.className = "qwidget_slider_tick_image";
            img.style.display = "none";
            img.style.filter = "inherit";
            img.style.position = "absolute";
            img.style.width = "auto";
            img.style.height = "auto";
            img.style.maxWidth = params.img_width + "px";
            img.style.maxHeight = params.img_height + "px";
            img.style.marginTop = params.img_top + "px";
            img.style.marginLeft = params.img_left + "px";
            img.src = params.tick_array[i].image;
            imageContain.appendChild(img);
        }
    }

    // Handle Container CSS Style
    handleContain.style[styleVar] = startLoc + "px";
    handleContain[initVar] = startLoc;
    handleContain[lastVar] = startLoc;

    // Handle CSS Style
    var handle_size_offset = (isHorz) ?
            (((params.height + track_border_width*2) - (params.handle_height + handle_border_width*2 + params.handle_padding*2)) * 0.5):
            (((params.width + track_border_width*2) - (params.handle_width + handle_border_width*2+ params.handle_padding*2)) * 0.5),
        handle_margin_top = ((!isHorz) ? (-params.handle_height*0.5)-handle_border_width-params.handle_padding : handle_size_offset),
        handle_margin_left = ((isHorz) ? (-params.handle_width*0.5)-handle_border_width-params.handle_padding : handle_size_offset);

    handle.style.cssText = "position: relative; filter: inherit;";
    handle.style.width = params.handle_width + "px";
    handle.style.height = params.handle_height + "px";
    handle.style.padding = params.handle_padding + "px";
    handle.style.marginTop = (handle_margin_top + ((isHorz) ? 0 : track_border_width)) + "px";
    handle.style.marginLeft = (handle_margin_left + ((isHorz) ? track_border_width : 0)) + "px";
    handle.style.visibility = (!params.show_handle_bckgrnd && (jQuery.trim(params.image).length > 0)) ? "hidden" : "visible";
    if (!params.show_handle_import) {
        handle.style.borderRadius = handle.style.webkitBorderRadius = handle.style.mozBorderRadius = params.handle_border_radius + "px";
        handle.style.border = params.handle_border_width + "px " + params.handle_border_style + " #" + params.handle_border_color_up;
        handle.style.backgroundColor = "#" + params.handle_color_up;
    } else {
        $(handle).css( {
            'background-repeat': 'no-repeat',
            'background-size': (params.handle_width + "px " + params.handle_height + "px"),
            'background-position': 'center',
            'background-image': (QUtility.ieVersion() < 9) ?
                "url(" + params.blank_gif + ") " + 'url('+params.handle_import_up+')' : 'url('+params.handle_import_up+')',
            'filter': "inherit progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+params.handle_import_up+",sizingMethod='scale')"
        });
    }

    // Handle Image CSS Style
    this._updateHandleImage(params.image);

    // Handle Label CSS Style
    handleLabel.dir = (!params.isRTL) ? "LTR" : "RTL";
    handleLabel.innerHTML = params.handle_label_inittxt || "...";
    //handleLabel.style.width = params.handle_label_width + "px";
    handleLabel.style.height = 'auto';
    handleLabel.style.padding = "2px";
    handleLabel.style.fontSize = QUtility.convertPxtoEM(params.handle_label_fontsize) + 'em';
    handleLabel.style.color = '#' + params.handle_label_fontcolor;
    handleLabel.style.textAlign = (!params.isRTL) ? "left" : "";
    handleLabel.style.backgroundColor = (params.show_handle_label_bckgrnd && params.handle_label_inittxt !== "") ?
        "#" + params.handle_label_bckgrnd_color : "";
    doc.body.appendChild(handleLabel);
    handle_label_width = $(handleLabel).outerWidth();
    handle_label_height = $(handleLabel).outerHeight();
    handleContain.appendChild(handleLabel);
    handleLabel.innerHTML = params.handle_label_inittxt;
    handleLabel.style.top = ((handle_margin_top + params.handle_label_top + ((isHorz) ? 0 : track_border_width))-handle_label_height) + "px";
    handleLabel.style.left = (handle_margin_left + params.handle_label_left + ((isHorz) ? track_border_width : 0)) + "px";
    handleLabel.style.marginLeft = ((params.handle_width+params.handle_padding*2+handle_border_width*2- handle_label_width)*0.5) + "px";
    if (isHorz) { handle_size_offset -= handle_label_height; }

    // Label CSS Style
    label.dir = (!params.isRTL) ? "LTR" : "RTL";
    label.style.whiteSpace = "normal";
    label.style.wordWrap = "break-word";
    label.innerHTML = params.label;
    label.style.display = (params.show_label) ? "block" : "none";
    label.style.width = (isHorz) ? "auto" : (label_width + "px");
    label.style.height = "auto";
    label.style.top = params.label_top + "px";
    label.style.left = params.label_left + "px";
    label.style.fontSize = QUtility.convertPxtoEM(params.label_fontsize) + "em";
    label.style.color = "#" + params.label_fontcolor;
    label.style.textAlign = (!params.isRTL) ? params.label_halign : "";
    //label.style.backgroundColor = "#ccc";
    doc.body.appendChild(label);
    label_height = $(label).outerHeight();
    label.style.position = "relative";
    wrap.insertBefore(label, trackContain);

    // Image Container CSS Style
    imageContain.style.display = (params.show_img) ? "block" : "none";
    imageContain.style.width = params.img_width + "px";
    imageContain.style.height = params.img_height + "px";

    // End Image Display
    if (params.show_end_img) {
        var endImgContain = doc.createElement("div"),
            endImgLeft = doc.createElement("img"),
            endImgRight = doc.createElement("img");

        // End Image Container CSS
        endImgContain.className = "qwidget_slider_end_image_contain";
        endImgContain.style.position = "absolute";

        // Left End Image CSS
        endImgLeft.className = (isHorz) ? "qwidget_slider_end_image_left" : "qwidget_slider_end_image_bottom";
        endImgLeft.style.position = "absolute";
        endImgLeft.style.visibility = "hidden";
        endImgLeft.style.width = "auto";
        endImgLeft.style.height = "auto";
        endImgLeft.style.maxWidth = params.end_img_width + "px";
        endImgLeft.style.maxHeight = params.end_img_height + "px";
        endImgLeft.src = (isHorz) ? params.tick_array[0].image : params.tick_array[params.tick_array.length-1].image;
        $(endImgLeft).on("load", function() {
            $(this).off("load");
            var maxVal = 0,
                imgWidth = 0,
                imgHeight = 0;

            doc.body.appendChild(this);
            imgWidth = $(this).width();
            imgHeight = $(this).height();
            endImgContain.appendChild(this);

            if (isHorz) {
                maxVal = Math.max(
                    params.ticklabel_width*0.5,
                    (params.handle_width*0.5)+handle_border_width+params.handle_padding,
                    track_border_width
                );

                if (maxVal === track_border_width) { maxVal = track_border_width; }
                this.style.left = (-imgWidth-params.end_img_left-maxVal+track_border_width) + "px";
                this.style.top = (params.end_img_top+(total_track_height - imgHeight)*0.5) + "px";
            } else {
                maxVal = Math.max(
                    vert_ticklab_height*0.5,
                    (params.handle_height*0.5)+handle_border_width+params.handle_padding+handle_label_height,
                    track_border_width
                );
                if (maxVal === track_border_width) { maxVal = track_border_width; }
                this.style.left = (params.end_img_left + (total_track_width - imgWidth)*0.5) +  "px";
                this.style.top = (total_track_height+params.end_img_top+maxVal-track_border_width) + "px";
            }
            this.style.visibility = "";
        }).attr("src", endImgLeft.src);

        // Right End Image CSS
        endImgRight.className = (isHorz) ? "qwidget_slider_end_image_right" : "qwidget_slider_end_image_top";
        endImgRight.style.position = "absolute";
        endImgRight.style.visibility = "hidden";
        endImgRight.style.width = "auto";
        endImgRight.style.height = "auto";
        endImgRight.style.maxWidth = params.end_img_width + "px";
        endImgRight.style.maxHeight = params.end_img_height + "px";
        endImgRight.src = (isHorz) ? params.tick_array[params.tick_array.length-1].image : params.tick_array[0].image;
        $(endImgRight).on("load", function() {
            $(this).off("load");
            var maxVal = 0,
                imgWidth = 0,
                imgHeight = 0;

            doc.body.appendChild(this);
            imgWidth = $(this).width();
            imgHeight = $(this).height();
            endImgContain.appendChild(this);

            if (isHorz) {
                maxVal = Math.max(
                    params.ticklabel_width*0.5,
                    (params.handle_width*0.5)+handle_border_width+params.handle_padding,
                    track_border_width
                );
                if (maxVal === track_border_width) { maxVal = track_border_width; }
                this.style.left = (params.width+track_border_width*2+params.end_img_left+maxVal-track_border_width) + "px";
                this.style.top = (params.end_img_top+(total_track_height - imgHeight)*0.5) + "px";
            } else {
                maxVal = Math.max(
                    vert_ticklab_height*0.5,
                    (params.handle_height*0.5)+handle_border_width+params.handle_padding+handle_label_height,
                    track_border_width
                );
                if (maxVal === track_border_width) { maxVal = track_border_width; }
                this.style.left = (params.end_img_left + (total_track_width - imgWidth)*0.5) +  "px";
                this.style.top = (-imgHeight-params.end_img_top-maxVal+track_border_width) + "px";
            }
            this.style.visibility = "";
        }).attr("src", endImgRight.src);

        // Append children
        endImgContain.appendChild(endImgLeft);
        endImgContain.appendChild(endImgRight);
        trackContain.insertBefore(endImgContain, track);
    } else {
        var endImgContain = $(".qwidget_slider_end_image_contain", widget)[0];
        if (endImgContain) { endImgContain.parentNode.removeChild(endImgContain); }
    }

    // Set Track Container position & dimensions
    var offsetTopMaxVal = 0,
        offsetLeftMaxVal = 0,
        track_margin_top = 0,
        track_margin_left = 0,
        track_contain_width = (params.width + track_border_width*2),
        track_contain_height = 0,
        margin_offset = 0,
        handle_width_offset = (params.handle_width*0.5)+handle_border_width+params.handle_padding,
        handle_height_offset = (params.handle_height*0.5)+handle_border_width+params.handle_padding,
        ticklab_offset = (params.ticklabel_offset > 0) ? params.ticklabel_offset : 0,
        ticklab_width_offset = (params.ticklabel_width*0.5);

    // HORIZONTAL Position Track Container
    if (isHorz) {
        // Track Margin TOP
        offsetTopMaxVal = Math.max(
            Math.abs(end_img_offset_top),
            Math.abs(handle_size_offset),
            track_border_width
        );
        if (handle_size_offset < 0) {
            if (offsetTopMaxVal !== track_border_width) {
                track_margin_top = offsetTopMaxVal;
            } else {
                track_margin_top = -Math.min(handle_size_offset, end_img_offset_top);
            }
        }  else if ((end_img_offset_top < 0) && (handle_size_offset > 0)) {
            track_margin_top = -end_img_offset_top;
        }
        trackContain.style.marginTop = track_margin_top + "px";

        // Track Margin LEFT
        margin_offset = Math.max.apply(Math, [
            handle_width_offset,
            ticklab_width_offset,
            track_border_width
        ]);
        track_margin_left = (margin_offset - track_border_width);
        trackContain.style.marginLeft = (track_margin_left + end_img_offset_left) + "px";

        // Calculate Widget width
        track_contain_width = track_margin_left + total_track_width;
        trackContain.style.width = (track_contain_width + end_img_offset_width) + "px";

        // Auto adjust Label width for horizontal direction only
        label.style.width = (track_contain_width + track_margin_left) + "px";

        // Calculate Widget height
        var offsetArray = [
            (track_margin_top - handle_label_height),
            (max_ticklab_height + ticklab_offset)
        ];
        if (end_img_offset_top < 0) { offsetArray.push(end_img_offset_top*-1); }
        track_contain_height = (Math.max.apply(Math, offsetArray) + total_track_height);
        trackContain.style.height = track_contain_height + "px";
    }

    // VERTICAL Position Track Container
    else {
        // Track Margin LEFT
        offsetLeftMaxVal = Math.max(
            Math.abs(end_img_offset_left),
            Math.abs(handle_size_offset),
            track_border_width
        );
        if (handle_size_offset < 0) {
            if (offsetLeftMaxVal !== track_border_width) {
                track_margin_left = offsetLeftMaxVal;
            } else {
                track_margin_left = -Math.min(handle_size_offset, end_img_offset_left);
            }
        }  else if ((end_img_offset_left < 0) && (handle_size_offset > 0)) {
            track_margin_left = -end_img_offset_left;
        }
        trackContain.style.marginLeft = track_margin_left + "px";

        // Track Margin TOP
        var offsetArray = [
            handle_height_offset + handle_label_height,
            vert_ticklab_height*0.5,
            track_border_width
        ];
        margin_offset = Math.max.apply(Math, offsetArray);
        track_margin_top = margin_offset - track_border_width;
        trackContain.style.marginTop = (track_margin_top + end_img_offset_top) + "px";

        // Calculate Widget width
        track_contain_width += Math.max(track_margin_left, (ticklab_offset + params.ticklabel_width));
        trackContain.style.width = (((track_margin_left*2 + track_contain_width) > label_width) ?
            track_contain_width : label_width-track_margin_left) + "px";

        // Calculate Widget height
        track_contain_height = (track_margin_top + total_track_height);
        trackContain.style.height = (track_contain_height + end_img_offset_height) + "px";
    }

    // Position Image Container
    // Set widget dimensions
    wrap.style.display = "";
    var imageContain_width = (params.show_img) ? params.img_width : 0,
        imageContain_height = (params.show_img) ? params.img_height : 0,
        final_track_margin_left = parseInt(trackContain.style.marginLeft, 10),
        final_track_margin_top = parseInt(trackContain.style.marginTop, 10),
        final_track_contain_width = parseInt(trackContain.style.width, 10),
        final_track_contain_height = parseInt(trackContain.style.height, 10);

    switch (params.img_placement.toLowerCase()) {
        case "top":
            imageContain.style.position = "relative";
            wrap.insertBefore(imageContain, trackContain);
            widget.style.width = (final_track_margin_left + final_track_contain_width) + "px";
            widget.style.height = (label_height + final_track_contain_height + imageContain_height + final_track_margin_top) + "px";
            break;
        case "bottom":
            imageContain.style.position = "relative";
            widget.style.width = (final_track_margin_left + final_track_contain_width) + "px";
            widget.style.height = (label_height + final_track_contain_height + imageContain_height + final_track_margin_top) + "px";
            break;
        case "left":
            imageContain.style.top = "0px";
            trackContain.style.left = imageContain_width + "px";
            widget.style.width = (final_track_contain_width + imageContain_width + final_track_margin_left) + "px";
            widget.style.height = (Math.max((label_height + final_track_contain_height), imageContain_height) + final_track_margin_top) + "px";
            break;
        default:
            imageContain.style.top = "0px";
            imageContain.style.left = (final_track_margin_left + final_track_contain_width) + "px";
            widget.style.width = (final_track_contain_width + imageContain_width + final_track_margin_left) + "px";
            widget.style.height = (Math.max((label_height + final_track_contain_height), imageContain_height) + final_track_margin_top) + "px";
            break;
    }

    // Set slider handle bounds
    cache._minLoc = cache._minLoc || 0;
    cache._maxLoc = cache._maxLoc || (params[(isHorz) ? 'width' : 'height']);

    // See if we need to display initial slider image
    if (params.show_img && params.show_init_img) { this._imageChange(); }
};

/**
 * QDropdown Widget
 */
function QDropdown(rowArray) {
    var that = this,
        doc = document,
        init;

    this.configMap = {
        use_custom : false,
        is_multi : false,
        dropdown_width : 300,
        dropdown_height : 35,
        dropdown_padding : 5,
        dropdown_border_width : 1,
        dropdown_header_msg : "Make a selection",
        dropdown_header_fontsize : 18,
        dropdown_header_fontcolor : "#333",
        dropdown_bckgrnd_color : "#FFF",
        dropdown_border_color : "#CCC",
        dropdown_border_style : "dotted",
        arrw_color : "#f37f26",
        contain_height : 350,
        contain_btn_width : 100,
        contain_btn_height : 100,
        contain_btn_padding : 5,
        contain_btn_bckgrnd_color_up : "#F8F8F8",
        contain_btn_bckgrnd_color_over : "#353535",
        contain_btn_bckgrnd_color_down : "#353535",
        contain_btn_label_halign : "left",
        contain_btn_label_fontsize : 18,
        contain_btn_label_color_up : "#000",
        contain_btn_label_color_over : "#f37f26",
        contain_btn_label_color_down : "#f37f26"
    };

    this.stateMap = {
        rowArray : undefined,
        selectedIndex : undefined,
        is_dropdown_open : undefined,
        dropdown : undefined,
        container : undefined,
        headerContain : undefined
    };

    init = function(parent) {
        if (!(jQuery.isArray(rowArray) && rowArray.length>0)) { return; } // Need a valid array to create
        if (!that.stateMap.dropdown) {
            that.stateMap.rowArray = rowArray;
            that.stateMap.selectedIndex = (!that.configMap.is_multi) ? -1 : [];
            that.stateMap.is_dropdown_open = false;

            // Setup dropdown and add to parent
            var dropdown = (that.configMap.use_custom) ? that.createCustom() : that.createDefault();
            dropdown.className = "qwidget_dropdown";
            dropdown.style.cssText += ';'.concat("-webkit-tap-highlight-color: rgba(0,0,0,0);");
            dropdown.style.cssText += ';'.concat("-webkit-touch-callout: none;");
            dropdown.style.cssText += ';'.concat("-ms-touch-action: none;");
            dropdown.style.cssText += ';'.concat("-webkit-user-select: none;");
            dropdown.style.cssText += ';'.concat("-khtml-user-select: none;");
            dropdown.style.cssText += ';'.concat("-moz-user-select: none;");
            dropdown.style.cssText += ';'.concat("-ms-user-select: none;");
            dropdown.style.cssText += ';'.concat("-user-select: none;");

            parent = (parent && parent.nodeType === 1) ? parent : doc.body;
            parent.appendChild(dropdown);
        }
    };

    return {
        init : init,
        remove : function() { that.remove(); },
        config : function(input_map) {
            QUtility.setConfigMap({
                input_map    : input_map,
                settable_map : null,
                config_map   : that.configMap
            });
        },
        getDropdown : function() { return that.stateMap.dropdown; },
        getDropdownContain : function() { return that.stateMap.container; },
        getRowArray : function() { return that.stateMap.rowArray; },
        getSelectedIndex : function() { return that.stateMap.selectedIndex; }
    }
}
QDropdown.prototype = {
    remove : function() {
        var removeHandlers = function(ele) {
            $(ele).off();
            for (var i = 0, len = ele.children.length; i<len; i+=1) {
                $(ele.children[i]).off();
                removeHandlers(ele.children[i]);
            }
        };

        var stateMap = this.stateMap,
            dropdown = stateMap.dropdown;

        // Remove event handlers
        removeHandlers(dropdown);

        // Remove dropdown
        if (dropdown.parentNode) { dropdown.parentNode.removeChild(dropdown); }

        // Reset stateMap properties except rowArray
        for (var key in stateMap) {
            if (stateMap.hasOwnProperty(key) && key !== "rowArray") {
                stateMap[key] = undefined;
            }
        }
    },

    createDefault : function() {
        var that = this,
            doc = document,
            stateMap = this.stateMap,
            configMap = this.configMap,
            rowArray = stateMap.rowArray,
            dropdown = doc.createElement("select"),
            emptyOpt = doc.createElement("option"),
            touchEnabled = QUtility.isTouchDevice(),
            isMSTouch = QUtility.isMSTouch(),
            evt = (!isMSTouch) ?
                ((!touchEnabled) ? "click.qdropdown" : "touchend.qdropdown"):
                ((window.PointerEvent) ? "pointerup.qdropdown" : "MSPointerUp.qdropdown");

        // Dropdown CSS styles
        dropdown.style.position = "absolute";
        dropdown.style.width = configMap.dropdown_width + "px";
        dropdown.style.height = configMap.dropdown_height + "px";
        dropdown.style.padding = configMap.dropdown_padding + "px";
        dropdown.style.backgroundColor = configMap.dropdown_bckgrnd_color;
        dropdown.style.borderStyle = configMap.dropdown_border_style;
        dropdown.style.borderColor = configMap.dropdown_border_color;
        dropdown.style.borderWidth = configMap.dropdown_border_width + "px";
        dropdown.style.fontSize = QUtility.convertPxtoEM(configMap.dropdown_header_fontsize) + "em";
        // If is_multi true, dropdown height will be set to auto
        dropdown.multiple = !!configMap.is_multi;
        if (configMap.is_multi) { dropdown.style.height = "auto"; }

        // Create Option Elements
        if (configMap.is_multi) { emptyOpt.disabled = true; }
        emptyOpt.innerHTML = configMap.dropdown_header_msg;
        dropdown.appendChild(emptyOpt);
        for (var i = 0, len = rowArray.length; i<len; i+=1) {
            var opt = doc.createElement("option");
            opt.id = "btn_id_" + i;
            opt.className = "qwidget_dropdown_contain_button";
            opt.value = rowArray[i].label.toLowerCase();
            opt.innerHTML = rowArray[i].label;
            dropdown.appendChild(opt);
        }

        // Set stateMap variables
        stateMap.dropdown = dropdown;

        // Event handlers
        $(dropdown).on("change.qdropdown", function(event) {
            if (configMap.is_multi) {
                stateMap.selectedIndex = [];
                for (var i = 0, len = rowArray.length; i<len; i+=1) {
                    var opt_i = dropdown.children[i+1];
                    if (opt_i.selected) { stateMap.selectedIndex.push(i); }
                }

                return;
            }

            stateMap.selectedIndex = this.selectedIndex-1;
        });

        if (!configMap.is_multi) {
            $(dropdown).on(evt, function(event) {
                emptyOpt.disabled = true;
                $(this).off(evt);
            });
        }

        return dropdown;
    },

    createCustom : function() {
        // Create Dropdown
        var that = this,
            doc = document,
            stateMap = this.stateMap,
            configMap = this.configMap,
            rowArray = stateMap.rowArray,
            dropdown = doc.createElement("div"),
            headerContain = doc.createElement("div"),
            headerImgContain = doc.createElement("div"),
            headerImg = doc.createElement("img"),
            headerLabel = doc.createElement("label"),
            arrw_wrap = doc.createElement("div"),
            arrw_icon = doc.createElement("div"),
            container = doc.createElement("div"),
            headerlab_padding = 2,      // FIXED
            arrw_brd_style = "solid",   // FIXED
            arrw_brd_width = 1,         // FIXED
            arrw_size = (configMap.dropdown_height)*0.40,
            contain_shadow = "2px 3px 2px #DDD",
            icon_padding = 10,
            contain_total_height = 0,
            contain_resized = false,
            touchEnabled = QUtility.isTouchDevice(),
            isMSTouch = QUtility.isMSTouch(),
            wgtArray = [],
            evt = (!isMSTouch) ?
                ((!touchEnabled) ? "click.qdropdown" : "touchend.qdropdown"):
                ((window.PointerEvent) ? "pointerup.qdropdown" : "MSPointerUp.qdropdown");

        // Dropdown CSS styles
        dropdown.style.position = "absolute";
        dropdown.style.width = configMap.dropdown_width + "px";
        dropdown.style.height = configMap.dropdown_height + "px";
        dropdown.style.padding = configMap.dropdown_padding + "px";
        dropdown.style.backgroundColor = configMap.dropdown_bckgrnd_color;
        dropdown.style.borderStyle = configMap.dropdown_border_style;
        dropdown.style.borderColor = configMap.dropdown_border_color;
        dropdown.style.borderWidth = configMap.dropdown_border_width + "px";

        // Arrow Wrap CSS styles
        if (arrw_brd_width*2 > configMap.dropdown_height) { arrw_brd_width = 1; } // Adjust arrw_brd_width if it happens to be greater than configMap.dropdown_height
        arrw_wrap.style.position = "absolute";
        arrw_wrap.style.backgroundColor = configMap.dropdown_bckgrnd_color;
        arrw_wrap.style.borderStyle = arrw_brd_style;
        arrw_wrap.style.borderColor = configMap.dropdown_border_color;
        arrw_wrap.style.borderWidth = arrw_brd_width + "px";
        arrw_wrap.style.height = (configMap.dropdown_height - arrw_brd_width*2) + "px";
        arrw_wrap.style.width = configMap.dropdown_height + "px";
        arrw_wrap.style.left = (configMap.dropdown_width + configMap.dropdown_padding - configMap.dropdown_height - arrw_brd_width*2) + "px";

        // Arrow Icon CSS styles
        $(arrw_icon).css({
            'width': 0,
            'height': 0,
            'border-left': arrw_size+'px solid transparent',
            'border-right': arrw_size+'px solid transparent',
            'border-top': arrw_size+'px solid ' + configMap.arrw_color,
            'font-size': 0,
            'line-height': 0,
            'position': 'absolute',
            'left': (arrw_size)*0.25 + "px",
            'top': (configMap.dropdown_height-arrw_size)*0.5 + "px"
        });

        // Header Container CSS styles
        headerContain.style.position = "absolute";
        headerContain.style.width = (configMap.dropdown_width - configMap.dropdown_height - arrw_brd_width*2) + "px";
        headerContain.style.height = configMap.dropdown_height + "px";

        // Header Image Container CSS
        headerImgContain.style.position = "absolute";
        headerImgContain.style.width = configMap.dropdown_height + "px";
        headerImgContain.style.height = configMap.dropdown_height + "px";
        headerImgContain.style.display = "none";

        // Header Image CSS
        headerImg.style.position = "absolute";
        headerImg.style.maxWidth = configMap.dropdown_height + "px";
        headerImg.style.maxHeight = configMap.dropdown_height + "px";

        // Header Label CSS
        headerLabel.style.position = "absolute";
        headerLabel.style.padding = headerlab_padding + "px";
        headerLabel.style.width = (configMap.dropdown_width - configMap.dropdown_height - (arrw_brd_width + headerlab_padding)*2) + "px";
        headerLabel.style.height = (configMap.dropdown_height - headerlab_padding*2) + "px";
        headerLabel.style.lineHeight = headerLabel.style.height;
        headerLabel.style.fontSize = QUtility.convertPxtoEM(configMap.dropdown_header_fontsize) + "em";
        headerLabel.style.color = configMap.dropdown_header_fontcolor;
        headerLabel.style.whiteSpace = "nowrap";
        headerLabel.style.textAlign = "left";
        headerLabel.style.overflow = "hidden";
        headerLabel.innerHTML = configMap.dropdown_header_msg;
        //headerLabel.style.backgroundColor = "#FFF000";

        // Container CSS styles
        container.style.position = "absolute";
        container.style.width = (configMap.dropdown_width + configMap.dropdown_padding*2) + "px";
        container.style.height = "0px";
        container.style.backgroundColor = configMap.dropdown_bckgrnd_color;
        container.style.borderStyle = configMap.dropdown_border_style;
        container.style.borderColor = dropdown.style.borderColor;
        container.style.borderWidth = dropdown.style.borderWidth;
        container.style.top = (configMap.dropdown_height + configMap.dropdown_padding*2) + "px";
        container.style.left = -configMap.dropdown_border_width + "px";
        container.style.overflowY = "hidden";
        container.style.overflowX = "hidden";
        container.style.MozBoxShadow = contain_shadow;
        container.style.webkitBoxShadow = contain_shadow;
        container.style.boxShadow = contain_shadow;
        container.style.display = "none";

        // Create Option Elements
        configMap.contain_btn_width = configMap.dropdown_width + configMap.dropdown_padding*2;
        for (var i = 0, len = rowArray.length; i<len; i+=1) {
            var btnWidth = (configMap.contain_btn_width-configMap.contain_btn_padding*2);
            if (btnWidth <= 0) { btnWidth = 1; }
            var opt = new QFlowBtn(container, {
                id : "btn_id_" + i,
                label : rowArray[i].label,
                image : rowArray[i].image,
                width : btnWidth,
                height : configMap.contain_btn_height,
                padding : configMap.contain_btn_padding,
                border_style : "none",
                bckgrnd_color_up : configMap.contain_btn_bckgrnd_color_up,
                bckgrnd_color_over : configMap.contain_btn_bckgrnd_color_over,
                bckgrnd_color_down : configMap.contain_btn_bckgrnd_color_down,
                label_fontsize : configMap.contain_btn_label_fontsize,
                label_color_up : configMap.contain_btn_label_color_up,
                label_color_over : configMap.contain_btn_label_color_over,
                label_color_down : configMap.contain_btn_label_color_down,
                label_halign : configMap.contain_btn_label_halign
            });
            opt.widget().style.borderBottom = "1px solid #ccc";
            wgtArray.push(opt);
        }

        contain_total_height = parseInt(opt.widget().style.height, 10) * len;
        contain_resized = (configMap.contain_height > contain_total_height);
        // Resize container height
        if (contain_resized) {
            configMap.contain_height = contain_total_height;
            container.style.height = contain_total_height + "px";
        }

        // Append children
        headerImgContain.appendChild(headerImg);
        headerContain.appendChild(headerImgContain);
        headerContain.appendChild(headerLabel);
        arrw_wrap.appendChild(arrw_icon);
        dropdown.appendChild(headerContain);
        dropdown.appendChild(arrw_wrap);
        dropdown.appendChild(container);

        // Set stateMap variables
        stateMap.dropdown = dropdown;
        stateMap.container = container;
        stateMap.headerContain = headerContain;

        // Event handlers
        $(dropdown).on(evt, function(event) {
            if (!QStudioDCAbstract.prototype.isTouchMove()) {
                stateMap.is_dropdown_open = !stateMap.is_dropdown_open;
                // Show container if currently not visible
                if (container.style.display === "none") { container.style.display = "block"; }

                // Adjust animation height & speed based on dropdown container state
                var anim_height = (stateMap.is_dropdown_open) ? configMap.contain_height : 0,
                    anim_speed = (stateMap.is_dropdown_open) ? 500 : 200;

                // Animate Container
                $(container).stop().animate({
                    "height": anim_height + "px"
                }, anim_speed, function() {
                    if (!stateMap.is_dropdown_open) {
                        this.style.display = "none";
                    } else if (!contain_resized) {
                        this.style.overflowY = "auto";
                    }
                });
            }

            QStudioDCAbstract.prototype.isTouchMove(false);
        });

        $(container).on(evt, ".qwidget_button", function(event) {
            if (!QStudioDCAbstract.prototype.isTouchMove()) {
                if (configMap.is_multi) { event.stopPropagation(); }
                var btn_id = parseInt(event.currentTarget.id.substr(7), 10),
                    wgt = wgtArray[btn_id],
                    isSelect = (!configMap.is_multi) ?
                        (stateMap.selectedIndex !== btn_id):
                        (jQuery.inArray(btn_id, stateMap.selectedIndex) === -1);

                if (!isSelect && !configMap.is_multi) { return; }
                if (isSelect) {
                    if (!configMap.is_multi) {
                        if (stateMap.selectedIndex >= 0) { wgtArray[stateMap.selectedIndex].isAnswered(false); }
                        stateMap.selectedIndex = btn_id;
                    } else {
                        stateMap.selectedIndex.push(btn_id);
                    }

                    wgt.isAnswered(true);
                    that._updateHeader({
                        label : rowArray[btn_id].label,
                        image : rowArray[btn_id].image
                    });
                } else {
                    wgt.isAnswered(false);
                    stateMap.selectedIndex.splice(jQuery.inArray(btn_id, stateMap.selectedIndex), 1);
                    if (stateMap.selectedIndex[stateMap.selectedIndex.length-1] !== undefined) {
                        that._updateHeader({
                            label : rowArray[stateMap.selectedIndex[stateMap.selectedIndex.length-1]].label,
                            image : rowArray[stateMap.selectedIndex[stateMap.selectedIndex.length-1]].image
                        });
                    } else {
                        that._updateHeader(true);
                    }
                }
            }
        });

        if (touchEnabled) {
            $(container).on((!isMSTouch) ?
                ("touchmove.qdropdown touchcancel.qdropdown"):
                ((window.PointerEvent) ? "pointermove.qdropdown pointercancel.qdropdown" : "MSPointerMove.qdropdown MSPointerCancel.qdropdown"),
                function(event) {
                    event.stopPropagation();
                    QStudioDCAbstract.prototype.isTouchMove(event.type.toLowerCase().indexOf("move") !== -1);
                });
        }

        return dropdown;
    },

    _updateHeader : function(value) {
        var stateMap = this.stateMap,
            configMap = this.configMap,
            headerContain = stateMap.headerContain,
            headerImgContain = headerContain.children[0],
            headerImg = headerImgContain.children[0],
            headerLabel = headerContain.children[1];

        if (typeof value === "boolean" && value) {
            // Reset header image
            headerImgContain.style.display = "none";
            headerImg.style.top = "";
            headerImg.src = "";

            // Reset header label
            headerLabel.style.left = "";
            headerLabel.innerHTML = configMap.dropdown_header_msg;
            return true;
        }

        // Set header image
        value = value || {};
        headerImgContain.style.display = (value.image !== "") ? "block" : "none";
        if (headerImgContain.style.display !== "none") {
            headerImg.src = value.image;
            headerImg.style.top = ((configMap.dropdown_height - $(headerImg).height())*0.5) + "px";
            headerLabel.style.left = headerImgContain.style.width;
        } else {
            headerLabel.style.left = "";
        }

        // Set header label
        headerLabel.innerHTML = value.label;
    }
};

/**
 * LightBox Abstract
 */
function QLightBoxAbstract() {
    // Do not instantiate. Subclasses should inherit from QLightBoxAbstract.
}
QLightBoxAbstract.prototype = {
    config: function(value) {
        if (!this.lightBox()) { return null; }
        if (typeof value !== 'object') {
            return this._params;
        }

        // Holds a record of option based parameters
        if (!this._params_restrict) { this._params_restrict = {}; }

        this._params.action_type = (function(that) {
            if (typeof value.action_type === 'string') {
                value.action_type = value.action_type.toLowerCase();
                if (value.action_type === 'click append image' ||
                    value.action_type === 'click append widget' ||
                    value.action_type === 'mouseover') {
                    that._params_restrict.action_type = value.action_type;
                }
            }
            return (that._params_restrict.action_type || 'click append image');
        }(this));
        this._params.overlay_bckgrnd_color = QUtility.paramToHex(value.overlay_bckgrnd_color) ||
            ((typeof this._params.overlay_bckgrnd_color === 'string') ? this._params.overlay_bckgrnd_color : '000000');
        this._params.overlay_alpha = (parseInt(value.overlay_alpha, 10) >= 0) ? parseInt(value.overlay_alpha, 10) :
            ((typeof this._params.overlay_alpha === 'number') ? this._params.overlay_alpha : 83);
        this._params.gallery_padding = (parseInt(value.gallery_padding, 10) >= 0) ? parseInt(value.gallery_padding, 10) :
            ((typeof this._params.gallery_padding === 'number') ? this._params.gallery_padding : 10);
        this._params.gallery_autosize = (typeof value.gallery_autosize !== 'undefined') ? !!value.gallery_autosize :
            ((typeof this._params.gallery_autosize === 'boolean') ? this._params.gallery_autosize : true);
        this._params.gallery_max_width = (parseInt(value.gallery_max_width, 10) >= 10) ? parseInt(value.gallery_max_width, 10) : (this._params.gallery_max_width || 500);
        this._params.gallery_max_height = (parseInt(value.gallery_max_height, 10) >= 10) ? parseInt(value.gallery_max_height, 10) : (this._params.gallery_max_height || 500);
        this._params.gallery_top = (Math.abs(parseInt(value.gallery_top, 10)) >= 0) ? parseInt(value.gallery_top, 10) :
            ((typeof this._params.gallery_top === 'number') ? this._params.gallery_top : 0);
        this._params.gallery_left = (Math.abs(parseInt(value.gallery_left, 10)) >= 0) ? parseInt(value.gallery_left, 10) :
            ((typeof this._params.gallery_left === 'number') ? this._params.gallery_left : 0);
        this._params.gallery_border_style = (function(that) {
            if (typeof value.gallery_border_style === 'string') {
                value.gallery_border_style = value.gallery_border_style.toLowerCase();
                if (value.gallery_border_style === 'solid' ||
                    value.gallery_border_style === 'none' ||
                    value.gallery_border_style === 'dotted' ||
                    value.gallery_border_style === 'dashed') {
                    that._params_restrict.gallery_border_style = value.gallery_border_style;
                }
            }
            return (that._params_restrict.gallery_border_style || 'solid');
        }(this));
        this._params.gallery_border_width = (parseInt(value.gallery_border_width, 10) >= 0) ? parseInt(value.gallery_border_width, 10) :
            ((typeof this._params.gallery_border_width === 'number') ? this._params.gallery_border_width : 1);
        this._params.gallery_border_color = QUtility.paramToHex(value.gallery_border_color) ||
            ((typeof this._params.gallery_border_color === 'string') ? this._params.gallery_border_color : 'CCCCCC');
        this._params.close_top = (Math.abs(parseInt(value.close_top, 10)) >= 0) ? parseInt(value.close_top, 10) :
            ((typeof this._params.close_top === 'number') ? this._params.close_top : 0);
        this._params.close_left = (Math.abs(parseInt(value.close_left, 10)) >= 0) ? parseInt(value.close_left, 10) :
            ((typeof this._params.close_left === 'number') ? this._params.close_left : 0);
        this._params.close_import = (typeof value.close_import === 'string') ? value.close_import : (this._params.close_import || "");
        this._params.close_width = (parseInt(value.close_width, 10) >= 5) ? parseInt(value.close_width, 10) : (this._params.close_width || 22);
        this._params.close_height = (parseInt(value.close_height, 10) >= 5) ? parseInt(value.close_height, 10) : (this._params.close_height || 22);
        this._params.zoom_width = (parseInt(value.zoom_width, 10) >= 5) ? parseInt(value.zoom_width, 10) : (this._params.zoom_width || 20);
        this._params.zoom_height = (parseInt(value.zoom_height, 10) >= 5) ? parseInt(value.zoom_height, 10) : (this._params.zoom_height || 20);
        this._params.zoom_border_width = (parseInt(value.zoom_border_width, 10) >= 0) ? parseInt(value.zoom_border_width, 10) :
            ((typeof this._params.zoom_border_width === 'number') ? this._params.zoom_border_width : 1);
        this._params.zoom_bckgrnd_color = QUtility.paramToHex(value.zoom_bckgrnd_color) ||
            ((typeof this._params.zoom_bckgrnd_color === 'string') ? this._params.zoom_bckgrnd_color : 'F5F5F5');
        this._params.zoom_border_color = QUtility.paramToHex(value.zoom_border_color) ||
            ((typeof this._params.zoom_border_color === 'string') ? this._params.zoom_border_color : 'CCCCCC');
        this._params.zoom_import = (typeof value.zoom_import === 'string') ? value.zoom_import : (this._params.zoom_import || "");

        value = null;
    },

    lightBox: function() {
        return this._lightBox;
    },

    cache: function() {
        return this._cache;
    },

    show: function(wgtObj) {
        if (!this.lightBox()) { return null; }
        if (wgtObj && wgtObj instanceof QStudioDCAbstract && wgtObj.type() !== "slider") {
            var image = wgtObj.config().image;
            if (typeof image === 'string' && jQuery.trim(image).length !== 0) {
                var that = this,
                    cache = this.cache(),
                    gallery = cache.nodes.gallery,
                    galleryImg = cache.nodes.galleryImg,
                    overlay = cache.nodes.overlay,
                    closeBtn = cache.nodes.closeBtn,
                    img = document.createElement("img"),
                    zoomBtn = wgtObj.cache().nodes.zoomBtn;

                overlay.style.display = (zoomBtn) ? "block" : "none";
                closeBtn.style.display = (zoomBtn) ? "block" : "none";

                // Image load event
                $(img).on("load", function() {
                    // Remove old image if one is present
                    if (galleryImg.firstChild) { galleryImg.removeChild(galleryImg.firstChild); }
                    img.style.cssText = "width: auto; height: auto; max-width: 100%; max-height: 100%;";
                    galleryImg.appendChild(this);
                    that.lightBox().style.display = "";
                    $([gallery, galleryImg, this]).css({ "opacity": 0 });
                    that.resize();
                    that.center();
                    $(gallery).stop();
                    $([gallery, galleryImg, this]).animate({ "opacity": 1 }, 500);
                    $(this).off("load");
                }).attr("src", image);
            }
        }

        return false;
    },

    hide: function() {
        if (!this.lightBox()) { return null; }
        var lightBox = this.lightBox(),
            cache = this.cache(),
            gallery = cache.nodes.gallery;

        if (!gallery || lightBox.style.display === 'none') { return false; }
        lightBox.style.display = "none";
    },

    resize: function() {
        if (!this.lightBox()) { return null; }
        var wind = window,
            doc = document,
            cache = this.cache(),
            params = this.config(),
            lightBox = this.lightBox(),
            overlay = cache.nodes.overlay,
            gallery = cache.nodes.gallery,
            galleryImg = cache.nodes.galleryImg,
            closeBtn = cache.nodes.closeBtn,
            overlayHeight = $(doc).height(),
            overlayWidth = $(doc).width(),
            galleryHeight = (params.gallery_autosize) ? ($(wind).height() - params.gallery_padding - 10) : params.gallery_max_height,
            galleryWidth = (params.gallery_autosize) ? ($(wind).width() - params.gallery_padding - 10) : params.gallery_max_width;

        if (!gallery || lightBox.style.display === "none") { return false; }
        if (galleryHeight < 0) { galleryHeight = 0; }
        if (galleryWidth < 0) { galleryWidth = 0; }
        overlay.style.height = overlayHeight + "px";
        overlay.style.width = overlayWidth + "px";
        gallery.style.visibility = "hidden";
        galleryImg.style.height = galleryHeight + "px";
        galleryImg.style.width = galleryWidth + "px";
        gallery.style.height = ($(galleryImg.firstChild).height() + params.gallery_padding) + "px";
        gallery.style.width = ($(galleryImg.firstChild).width() + params.gallery_padding) + "px";
        closeBtn.style.left = gallery.style.width;
        gallery.style.visibility = "";
    },

    center: function() {
        if (!this.lightBox()) { return null; }
        var lightBox = this.lightBox(),
            cache = this.cache(),
            wrap = cache.nodes.wrap,
            gallery = cache.nodes.gallery;

        if (!gallery || lightBox.style.display === 'none') { return false; }
        var wind = window,
            x = $(wind).scrollLeft() + ($(wind).width() / 2) - ($(gallery).outerWidth() / 2),
            y = $(wind).scrollTop() + ($(wind).height() / 2) - ($(gallery).outerHeight() / 2);

        // Position the box, horizontally/vertically, in the middle of the window
        if (x < 0) { x = 0; }
        if (y < 0) { y = 0; }

        // Set the adjusted position of the element
        wrap.style.display = "none";
        gallery.style.left = x + 'px';
        gallery.style.top = y + "px";
        wrap.style.display = "";
    },

    init: function(wgtObj) {
        if (!this.lightBox()) { return null; }
        if (wgtObj && wgtObj instanceof QStudioDCAbstract && wgtObj.type() !== "slider") {
            var that = this,
                params = this.config(),
                wgtZoomBtn = wgtObj.cache().nodes.zoomBtn,
                wgtImgSrc = wgtObj.config().image;

            if (typeof wgtImgSrc !== "string" || jQuery.trim(wgtImgSrc).length === 0) { return null; }
            if (params.action_type !== "mouseover") {
                if (!wgtZoomBtn) { wgtObj.removeEvent(wgtObj.widget(), "mouseenter.lightbox mouseleave.lightbox"); }
                return this._createZoomButton(wgtObj);
            } else {
                if (wgtZoomBtn) {
                    wgtZoomBtn.parentNode.removeChild(wgtZoomBtn);
                    wgtObj.removeEvent(wgtZoomBtn);
                    delete wgtObj.cache().nodes.zoomBtn;
                }

                wgtObj.addEvent(wgtObj.widget(), "mouseenter.lightbox mouseleave.lightbox", jQuery.proxy(that._lightBoxMouseOver, wgtObj));
            }
        }

        return false;
    },

    remove: function(wgtObj) {
        if (!this.lightBox()) { return null; }
        if (wgtObj && wgtObj instanceof QStudioDCAbstract && (wgtObj.type() === "button" || wgtObj.type() === "bucket")) {
            var zoomBtn = wgtObj.cache().nodes.zoomBtn;
            if (zoomBtn) {
                zoomBtn.parentNode.removeChild(zoomBtn);
                wgtObj.removeEvent(zoomBtn);
                delete wgtObj.cache()._zoomBtn_isTouchMove;
                delete wgtObj.cache().nodes.zoomBtn;
            } else {
                wgtObj.removeEvent(wgtObj.widget(), "mouseenter.lightbox mouseleave.lightbox");
            }
        }

        return false;
    },

    destroy: function() {
        if (!this.lightBox()) { return null; }
        var doc = document,
            cache = this.cache(),
            overlay = cache.nodes.overlay,
            closeBtn = cache.nodes.closeBtn;

        // Remove event listeners
        if (overlay) { $(overlay).off(); }
        if (closeBtn) { $(closeBtn).off(); }
        $(window).off('resize.lightbox scroll.lightbox');

        // Remove lightBox
        this._lightBox.parentNode.removeChild(this._lightBox);

        // GC Vars
        this._lightBox = null;
        this._cache = {};
        this._params = {};

        return this;
    },

    _createZoomButton: function(wgtObj) {
        if (!this.lightBox()) { return null; }
        if (wgtObj && wgtObj instanceof QStudioDCAbstract && wgtObj.type() !== "slider") {
            var that = this,
                zoomBtn = wgtObj.cache().nodes.zoomBtn,
                params = this.config(),
                zoomEvent = (!QUtility.isMSTouch()) ?
                    ((!QUtility.isTouchDevice()) ? "click.lightbox mousedown.lightbox mouseup.lightbox" : "touchstart.lightbox touchend.lightbox touchmove.lightbox"):
                    ((!QUtility.isTouchDevice()) ? "click.lightbox mousedown.lightbox mouseup.lightbox" : ((window.PointerEvent) ? "pointerdown.lightbox pointerup.lightbox" : "MSPointerDown.lightbox MSPointerUp.lightbox"));

            if (!zoomBtn) {
                // Create new zoom button
                zoomBtn = document.createElement("div");
                zoomBtn.className = 'qwidget_lightbox_zoom_button';
                zoomBtn.style.filter = 'inherit';
                zoomBtn.style.position = 'absolute';
                zoomBtn.style.borderStyle = 'solid';
                zoomBtn.style.backgroundRepeat = 'no-repeat';
                zoomBtn.style.backgroundPosition = 'center';
                zoomBtn.style.width = params.zoom_width + "px";
                zoomBtn.style.height = params.zoom_height + "px";
                zoomBtn.style.borderWidth = params.zoom_border_width + "px";
                zoomBtn.style.borderColor = "#" + params.zoom_border_color;
                zoomBtn.style.backgroundColor = "#" + params.zoom_bckgrnd_color;
                zoomBtn.style.backgroundImage = 'url('+params.zoom_import+')';

                // Zoom button event
                wgtObj.cache().nodes.zoomBtn = zoomBtn;
                wgtObj.cache()._zoomBtn_isTouchMove = false;
                wgtObj.addEvent(zoomBtn, zoomEvent, jQuery.proxy(that._lightBoxZoomClick, wgtObj));
            } else {
                // Update existing zoom button
                zoomBtn.style.width = params.zoom_width + "px";
                zoomBtn.style.height = params.zoom_height + "px";
                zoomBtn.style.borderWidth = params.zoom_border_width + "px";
                zoomBtn.style.borderColor = "#" + params.zoom_border_color;
                zoomBtn.style.backgroundColor = "#" + params.zoom_bckgrnd_color;
                zoomBtn.style.backgroundImage = 'url('+params.zoom_import+')';
            }

            return zoomBtn;
        }

        return null;
    },

    _lightBoxZoomClick: function(event) {
        // Widget would be calling method via jQuery proxy
        if (!this.widget()) { return null; }
        event.stopPropagation();
        if (event.type !== "touchmove") {
            if (event.type !== "mousedown" && event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                if (this.cache()._zoomBtn_isTouchMove) { return; }
                if (!this.enabled() && !this.cache()._enableExtEvt) { return false; }
                QBaseLightBox.getInstance().show(this);
            } else {
                this.cache()._zoomBtn_isTouchMove = false;
            }
        } else {
            this.cache()._zoomBtn_isTouchMove = true;
        }
    },

    _lightBoxMouseOver: function(event) {
        // Widget would be calling method via jQuery proxy
        if (!this.widget()) { return null; }
        event.stopPropagation();
        event.preventDefault();
        if (this.isDrag()) { return false; }
        (event.type === "mouseenter") ?
            QBaseLightBox.getInstance().show(this) : QBaseLightBox.getInstance().hide();
    }
};

/**
 * Base Light Box Widget
 */
var QBaseLightBox = (function() {
    function BaseLightBox(parent, configObj) {
        this._lightBox = null;
        this._cache = {};
        this._params = {};

        var that = this,
            doc = document,
            lightBox = doc.createElement("div"),
            wrap = doc.createElement("div"),
            overlay = doc.createElement("div"),
            gallery = doc.createElement("div"),
            galleryImg = doc.createElement("div"),
            closeBtn = doc.createElement("div"),
            closeIcon = doc.createElement("div"),
            lboxEvent = (!QUtility.isMSTouch()) ?
                ((!QUtility.isTouchDevice()) ? "click.lightbox_overlay" : "touchstart.lightbox_overlay touchend.lightbox_overlay"):
                ((!QUtility.isTouchDevice()) ? "click.lightbox_overlay" : ((window.PointerEvent) ? "pointerdown.lightbox_overlay pointerup.lightbox_overlay" : "MSPointerDown.lightbox_overlay MSPointerUp.lightbox_overlay"));

        // Container CSS Style
        lightBox.id = "QWidgetLightBox";
        lightBox.dir = "LTR";
        lightBox.className = 'qwidget_lightbox';
        lightBox.style.cssText = "position: absolute; top: 0px; left: 0px; display: none; z-index: 4800;";

        // Wrapper CSS Style
        wrap.className = "qwidget_lightbox_wrapper";
        wrap.style.cssText = "position: absolute; top: 0px; left: 0px;";

        // Overlay CSS Style
        overlay.className = 'qwidget_lightbox_overlay';
        overlay.style.cssText = "position: absolute; top: 0px; left: 0px;";

        // Gallery Container CSS Style
        gallery.className = 'qwidget_lightbox_gallery';
        gallery.style.cssText = "position: absolute; cursor: default; overflow: hidden; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";

        // Gallery Image CSS Style
        galleryImg.className = 'qwidget_lightbox_gallery_image';
        galleryImg.style.position = "absolute";

        // Close Button CSS Style
        closeBtn.className = 'qwidget_lightbox_close_button';
        closeBtn.style.cssText = "position: absolute; cursor: pointer;";

        // Close Icon CSS Style
        closeIcon.style.cssText = "position: absolute; background-repeat: no-repeat; background-position: center;";

        // Append children
        closeBtn.appendChild(closeIcon);
        gallery.appendChild(galleryImg);
        gallery.appendChild(closeBtn);
        wrap.appendChild(overlay);
        wrap.appendChild(gallery);
        lightBox.appendChild(wrap);

        // Setup
        this._lightBox = lightBox;
        this._cache.nodes = {
            wrap: wrap,
            overlay: overlay,
            gallery: gallery,
            galleryImg: galleryImg,
            closeBtn: closeBtn,
            closeIcon: closeIcon
        };
        this.config(configObj || {});
        parent = (parent && parent.nodeType === 1) ? parent : doc.body;
        parent.appendChild(this._lightBox);

        // Add overlay and close button events
        $([overlay, closeBtn]).on(lboxEvent, function(event) {
            event.stopPropagation();
            if (event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                that.hide();
            }
        });

        // Readjust the position of the gallery every time the user scrolls the page or resizes the browser
        $(window).on('resize.lightbox scroll.lightbox', function(event) {
            if (that._lightBox.style.display === 'none') { return; }
            if (event.type === "resize" && that._params.gallery_autosize) { that.resize(); }
            that.center();
        });
    }
    BaseLightBox.prototype = new QLightBoxAbstract();
    BaseLightBox.prototype.config = function(value) {
        if (!this.lightBox()) { return false; }
        if (typeof value !== 'object') {
            return QLightBoxAbstract.prototype.config.call(this, value);
        }

        QLightBoxAbstract.prototype.config.call(this, value);

        // Update lightbox
        return this.update();
    };
    BaseLightBox.prototype.update = function() {
        if (!this.lightBox()) { return false; }
        var params = this.config(),
            cache = this.cache(),
            wrap = cache.nodes.wrap,
            overlay = cache.nodes.overlay,
            gallery = cache.nodes.gallery,
            galleryImg = cache.nodes.galleryImg,
            closeIcon = cache.nodes.closeIcon,
            windHeight = $(window).innerHeight(),
            windWidth = $(window).innerWidth(),
            alphaVal = params.overlay_alpha * .01;

        // Adjust for uneven padding
        if ((params.gallery_padding & 1) === 1) { params.gallery_padding += 1; }
        wrap.style.display = "none";

        // Overlay CSS Style
        $(overlay).css( {
            "background-color": '#' + params.overlay_bckgrnd_color,
            "opacity": alphaVal
        } );

        // Gallery Container CSS Style
        gallery.style.backgroundColor = (params.gallery_padding > 0) ? "#FFF" : "";
        gallery.style.borderStyle = params.gallery_border_style;
        gallery.style.borderWidth = params.gallery_border_width + "px";
        gallery.style.borderColor = "#" + params.gallery_border_color;
        gallery.style.marginTop = params.gallery_top + "px";
        gallery.style.marginLeft = params.gallery_left + "px";
        gallery.style.width = windWidth + "px";
        gallery.style.height = windHeight + "px";

        // Gallery Image CSS Style
        galleryImg.style.width = (windWidth - params.gallery_padding) + 'px';
        galleryImg.style.height = (windHeight - params.gallery_padding) + 'px';
        galleryImg.style.marginLeft = (params.gallery_padding * 0.5) + "px";
        galleryImg.style.marginTop = (params.gallery_padding * 0.5) + "px";

        // Create Close Button
        closeIcon.style.top = params.close_top + "px";
        closeIcon.style.left = (-params.close_width + params.close_left) + "px";
        closeIcon.style.width = params.close_width + "px";
        closeIcon.style.height = params.close_height + "px";
        closeIcon.style.backgroundImage = 'url('+params.close_import+')';

        wrap.style.display = "";
        return true;
    };

    // Private Properties
    var _instance = null;

    // Public API
    return {
        getInstance: function(parent, configObj) {
            (!_instance) ?
                _instance = new BaseLightBox(parent, configObj) : _instance.config(configObj);

            return _instance;
        }
    }
}());

/**
 * ToolTip Abstract
 */
function QToolTipAbstract() {
    // Do not instantiate. Subclasses should inherit from QToolTipAbstract.
}
QToolTipAbstract.prototype = {
    config: function(value) {
        if (!this.toolTip()) { return null; }
        if (typeof value !== 'object') {
            return this._params;
        }

        // Holds a record of option based parameters
        if (!this._params_restrict) { this._params_restrict = {}; }
        this._params.isRTL = (typeof value.isRTL !== 'undefined') ? !!value.isRTL :
            ((typeof this._params.isRTL === 'boolean') ? this._params.isRTL : false);
        this._params.tooltip_width = (parseInt(value.tooltip_width, 10) >= 5) ? parseInt(value.tooltip_width, 10) : (this._params.tooltip_width || 100);
        this._params.tooltip_bckgrnd_color = QUtility.paramToHex(value.tooltip_bckgrnd_color) ||
            ((typeof this._params.tooltip_bckgrnd_color === 'string') ? this._params.tooltip_bckgrnd_color : 'F5F5F5');
        this._params.tooltip_border_width = (parseInt(value.tooltip_border_width, 10) >= 0) ? parseInt(value.tooltip_border_width, 10) :
            ((typeof this._params.tooltip_border_width === 'number') ? this._params.tooltip_border_width : 1);
        this._params.tooltip_border_color = QUtility.paramToHex(value.tooltip_border_color) ||
            ((typeof this._params.tooltip_border_color === 'string') ? this._params.tooltip_border_color : 'CCCCCC');
        this._params.tooltip_fontsize = (parseInt(value.tooltip_fontsize, 10) >= 5) ? parseInt(value.tooltip_fontsize, 10) : (this._params.tooltip_fontsize || 14);
        this._params.tooltip_fontcolor = QUtility.paramToHex(value.tooltip_fontcolor) ||
            ((typeof this._params.tooltip_fontcolor === 'string') ? this._params.tooltip_fontcolor : '333333');
        this._params.tooltip_halign = (function(that) {
            if (typeof value.tooltip_halign === 'string') {
                value.tooltip_halign = value.tooltip_halign.toLowerCase();
                if (value.tooltip_halign === 'left' ||
                    value.tooltip_halign === 'right' ||
                    value.tooltip_halign === 'center') {
                    that._params_restrict.tooltip_halign = value.tooltip_halign;
                }
            }
            return (that._params_restrict.tooltip_halign || 'left');
        }(this));

        value = null;
    },

    toolTip: function() {
        return this._toolTip;
    },

    cache: function() {
        return this._cache;
    },

    show: function() {
        return undefined;
    },

    hide: function() {
        return undefined;
    },

    destroy: function() {
        if (!this.toolTip()) { return null; }

        // Remove toolTip
        if (this._toolTip.parentNode) { this._toolTip.parentNode.removeChild(this._toolTip); }

        // GC Vars
        this._toolTip = null;
        this._cache = {};
        this._params = {};

        return this;
    },

    toolTipMouseEvent: function(event) {

        // Widget would be calling method via jQuery proxy
        if (!this.widget()) { return null; }
        if (this.isDrag()) { return false; }
        var that = this,
            widget = this.widget(),
            params = this.config(),
            toolTipInstance = QBaseToolTip.getInstance();

        if (this.isDrag() || (!this.enabled() && !this.cache()._enableExtEvt)) {
            toolTipInstance.hide();
            return;
        }

        // utility function
        var cleanUp = function() {
            $(widget).off("mousemove", movefn);
            $(widget).off("mouseleave", leavefn);
            toolTipInstance.hide();
        };

        // "mousemove" event function
        var movefn = function(event) {
            if (that.isDrag() || (!that.enabled() && !that.cache()._enableExtEvt)) {
                cleanUp();
                return;
            }
            toolTipInstance.show({
                text: params.description,
                event: event
            });
        };

        // "mouseleave" event function
        var leavefn = function() {
            cleanUp();
        };

        toolTipInstance.show({
            text: params.description,
            event: event
        });
        $(widget).on("mousemove", movefn);
        $(widget).on("mouseleave", leavefn);
    }
};

/**
 * Base Tooltip Widget
 */
var QBaseToolTip = (function() {
    function BaseToolTip(parent, configObj) {
        this._toolTip = null;
        this._cache = {};
        this._params = {};

        var doc = document,
            toolTip = doc.createElement("div");

        // Container CSS Style
        toolTip.id = "QWidgetTooltip";
        toolTip.className = 'qwidget_tooltip';
        toolTip.style.cssText =
            "position: absolute; margin-left: -10px; display: none; pointer-events: none; z-index: 4000; padding: 3px; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";

        // Setup
        this._toolTip = toolTip;
        this.config(configObj || {});
        parent = (parent && parent.nodeType === 1) ? parent : doc.body;
        parent.appendChild(this._toolTip);
    }
    BaseToolTip.prototype = new QToolTipAbstract();
    BaseToolTip.prototype.config = function(value) {
        if (!this.toolTip()) { return null; }
        if (typeof value !== 'object') {
            return QToolTipAbstract.prototype.config.call(this, value);
        }

        QToolTipAbstract.prototype.config.call(this, value);

        // Update lightbox
        return this.update();
    };
    BaseToolTip.prototype.update = function() {
        if (!this.toolTip()) { return null; }
        var toolTip = this.toolTip(),
            params = this.config();

        toolTip.dir = (!params.isRTL) ? "LTR" : "RTL";
        toolTip.style.whiteSpace = "normal";
        toolTip.style.border = params.tooltip_border_width + 'px solid #' + params.tooltip_border_color;
        toolTip.style.backgroundColor = '#' + params.tooltip_bckgrnd_color;
        toolTip.style.width = params.tooltip_width + 'px';
        toolTip.style.textAlign = (!params.isRTL) ? params.tooltip_halign : "";
        toolTip.style.fontSize = QUtility.convertPxtoEM(params.tooltip_fontsize) + "em";
        toolTip.style.wordWrap = "break-word";
        toolTip.style.color = '#' + params.tooltip_fontcolor;
    };
    BaseToolTip.prototype.show = function(dispObj) {
        if (!this.toolTip()) { return null; }
        dispObj = dispObj || {};
        var text = (typeof dispObj.text === 'string' && jQuery.trim(dispObj.text).length !== 0) ? dispObj.text : "",
            event = (dispObj.event && dispObj.event.pageX && dispObj.event.pageY) ? dispObj.event : null;

        if (text !== "" && event !== null) {
            var toolTip = this.toolTip();
            //toolTip.innerHTML = text;
            $(toolTip).text(text);
            toolTip.style.top = event.pageY + "px";
            toolTip.style.left = event.pageX + "px";
            if (toolTip.style.marginTop === "") { toolTip.style.marginTop = (-$(toolTip).outerHeight() - 10) + "px"; }
            toolTip.style.display = "";
        }

        return false;
    };
    BaseToolTip.prototype.hide = function() {
        var toolTip = this.toolTip();
        if (!toolTip) { return null; }
        if (toolTip.style.display !== "none") {
            toolTip.style.display = "none";
            toolTip.innerHTML = "";
            toolTip.style.marginTop = "";
        }

        return false;
    };

    // Private Properties
    var _instance = null;

    // Public API
    return {
        getInstance: function(parent, configObj) {
            (!_instance) ?
                _instance = new BaseToolTip(parent, configObj) : _instance.config(configObj);

            return _instance;
        }
    }
}());

/**
 * Message Display Abstract
 */
function QMsgDisplayAbstract() {
    // Do not instantiate. Subclasses should inherit from QMsgDisplayAbstract.
}
QMsgDisplayAbstract.prototype = {
    config: function(value) {
        if (!this.msgDisplay()) { return null; }
        if (typeof value !== 'object') {
            return this._params;
        }

        // Holds a record of option based parameters
        if (!this._params_restrict) { this._params_restrict = {}; }
        this._params.isRTL = (typeof value.isRTL !== 'undefined') ? !!value.isRTL :
            ((typeof this._params.isRTL === 'boolean') ? this._params.isRTL : false);
        this._params.errormsg_width = (parseInt(value.errormsg_width, 10) >= 5) ? parseInt(value.errormsg_width, 10) : (this._params.errormsg_width || 100);
        this._params.errormsg_fontsize = (parseInt(value.errormsg_fontsize, 10) >= 5) ? parseInt(value.errormsg_fontsize, 10) : (this._params.errormsg_fontsize || 14);
        this._params.errormsg_fontcolor = QUtility.paramToHex(value.errormsg_fontcolor) ||
            ((typeof this._params.errormsg_fontcolor === 'string') ? this._params.errormsg_fontcolor : 'FF0000');
        this._params.errormsg_halign = (function(that) {
            if (typeof value.errormsg_halign === 'string') {
                value.errormsg_halign = value.errormsg_halign.toLowerCase();
                if (value.errormsg_halign === 'left' ||
                    value.errormsg_halign === 'right' ||
                    value.errormsg_halign === 'center') {
                    that._params_restrict.errormsg_halign = value.label_halign;
                }
            }
            return (that._params_restrict.errormsg_halign || 'left');
        }(this));

        value = null;
    },

    msgDisplay: function() {
        return this._msgDisplay;
    },

    cache: function() {
        return this._cache;
    },

    isShowing: function() {
        return this.cache().isShowing;
    },

    show: function() {
        return undefined;
    },

    hide: function() {
        return undefined;
    },

    destroy: function() {
        if (!this.msgDisplay()) { return null; }

        // Remove Message Display
        if (this._msgDisplay.parentNode) { this._msgDisplay.parentNode.removeChild(this._msgDisplay); }

        // GC Vars
        this._msgDisplay = null;
        this._cache = {};
        this._params = {};

        return this;
    }
};

/**
 * Base Msg Display Widget
 */
var QBaseMsgDisplay = (function() {
    function BaseMsgDisplay(configObj) {
        this._msgDisplay = null;
        this._cache = {};
        this._params = {};

        var doc = document,
            msgDisplay = doc.createElement('div'),
            label = doc.createElement('label'),
            arrwouter = doc.createElement('div'),
            arrwinner = doc.createElement('div');

        // Container CSS Style
        msgDisplay.id = 'QWidgetErrorMsg';
        msgDisplay.style.cssText = "position: absolute; display: none; padding: 3px; border: 2px solid #AAA; background-color: #FFF; z-index: 3000;";
        msgDisplay.style.MozBoxShadow = '3px 5px 3px #CCC';
        msgDisplay.style.webkitBoxShadow = '3px 5px 3px #CCC';
        msgDisplay.style.boxShadow = '3px 5px 3px #CCC';

        // Label CSS Style
        label.style.whiteSpace = "normal";

        // Container Outer Carrot DIV
        arrwouter.style.cssText =
            "position: absolute; top: " + ((QUtility.ieVersion() !== 7) ? '-14px;' : '-29px;') + " left: 5px; border-width: 0 12px 12px; border-style: solid; border-color: #AAA transparent; width: 0;";

        // Container Inner Carrot DIV
        arrwinner.style.cssText =
            "position: absolute; top: " + ((QUtility.ieVersion() !== 7) ? '-11px;' : '-26px;') + " left: 6px; border-width: 0 11px 11px; border-style: solid; border-color: #FFF transparent; width: 0;";

        // Append children
        msgDisplay.appendChild(label);
        msgDisplay.appendChild(arrwouter);
        msgDisplay.appendChild(arrwinner);

        // Setup
        this._msgDisplay = msgDisplay;
        this._cache.isShowing = false;
        this.config(configObj || {});
    }
    BaseMsgDisplay.prototype = new QMsgDisplayAbstract();
    BaseMsgDisplay.prototype.config = function(value) {
        if (!this.msgDisplay()) { return null; }
        if (typeof value !== 'object') {
            return QMsgDisplayAbstract.prototype.config.call(this, value);
        }

        QMsgDisplayAbstract.prototype.config.call(this, value);

        // Update widget
        return this.update();
    };
    BaseMsgDisplay.prototype.update = function() {
        if (!this.msgDisplay()) { return null; }
        var msgDisplay = this.msgDisplay(),
            params = this.config();

        msgDisplay.dir = (!params.isRTL) ? "LTR" : "RTL";
        msgDisplay.style.width = params.errormsg_width + 'px';
        msgDisplay.style.fontSize = QUtility.convertPxtoEM(params.errormsg_fontsize) + 'em';
        msgDisplay.style.color = '#' + params.errormsg_fontcolor;
        msgDisplay.style.wordWrap = "break-word";
        msgDisplay.style.textAlign = (!params.isRTL) ? params.errormsg_halign : "";
    };
    BaseMsgDisplay.prototype.show = function(dispObj) {
        if (!this.msgDisplay()) { return null; }
        dispObj = dispObj || {};
        var text = (typeof dispObj.text === 'string' && jQuery.trim(dispObj.text).length !== 0) ? dispObj.text : "",
            target = (dispObj.target && dispObj.target.nodeType === 1) ? dispObj.target : null;

        if (target !== null && text !== "") {
            var msgDisplay = this.msgDisplay(),
                msgLabel = msgDisplay.children[0],
                top = (QUtility.isNumber(dispObj.top)) ? dispObj.top : $(target).outerHeight(),
                left = (QUtility.isNumber(dispObj.left)) ? dispObj.left : 10;

            if (msgDisplay.style.display === 'none' || msgLabel.innerHTML !== text) {
                if (msgDisplay.parentNode !== target) { target.appendChild(msgDisplay); }
                msgLabel.innerHTML = text;
                msgDisplay.style.top = top + "px";
                msgDisplay.style.left = left + "px";
                msgDisplay.style.display = "";
                this.cache().isShowing = true;
            }
        }

        return false;
    };
    BaseMsgDisplay.prototype.hide = function() {
        var msgDisplay = this.msgDisplay();
        if (!msgDisplay) { return null; }
        if (msgDisplay.style.display !== "none") {
            var msgLabel = msgDisplay.children[0];
            msgDisplay.style.display = "none";
            msgLabel.innerHTML = "";
            if (msgDisplay.parentNode) {
                msgDisplay.parentNode.style.zIndex = "auto";
                // *IE7 zIndex Bug Fix*
                if (QUtility.ieVersion() === 7) { msgDisplay.parentNode.parentNode.style.zIndex = "auto"; }
                msgDisplay.parentNode.removeChild(msgDisplay);
            }
            this.cache().isShowing = false;
        }

        return false;
    };

    // Private Properties
    var _instance = null;

    // Public API
    return {
        getInstance: function(configObj) {
            (!_instance) ?
                _instance = new BaseMsgDisplay(configObj) : _instance.config(configObj);

            return _instance;
        }
    }
}());