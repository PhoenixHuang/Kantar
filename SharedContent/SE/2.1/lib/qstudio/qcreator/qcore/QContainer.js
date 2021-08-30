
/**
 * QContainer Javascript File
 * Version : 1.3.0
 * Date : 2014-07-09
 *
 * Constructs the following layouts...
 *  1. BaseLayout
 *  2. VerticalLayout
 *  3. HorizontalLayout
 *  4. SetLayout
 *  5. ScrollLayout
 *  6. SequentialLayout
 *
 * Release 1.2.0
 * - Changed how left/top container parameters work. Before position was set using top/left CSS styles.
 *   The position is now set using margin top/left CSS styles. This should help w/ sizing in Decipher/Dimensions so that templates aren’t thrown off.
 * - Margin is now included when calculating the size of a child to keep container sizing accurate
 * - Converted all label fontSize from px to em
 * - Changed how options in a sequential layout are displayed to better work w/ RTL
 * - Added new parameter isRTL
 *
 * Release 1.3.0
 * - For Base Layout you can now horizontally AND vertically align children
 *
 */

/**
 * QStudio Layout Abstract
 */

function QLayoutAbstract() {
    // Do not instantiate. Subclasses should inherit from QLayoutAbstract.
}
QLayoutAbstract.prototype = {
    config: function(value) {
        if (!this.container()) { return null; }
        if (typeof value !== 'object') {
            return this._params;
        }

        // Holds a record of option based parameters
        if (typeof this._params_restrict === "undefined") {
            this._params_restrict = {};
        }

        this._params.isRTL = (typeof value.isRTL !== 'undefined') ? !!value.isRTL :
            ((typeof this._params.isRTL === 'boolean') ? this._params.isRTL : false);
        this._params.id = (typeof value.id === 'string') ? value.id : this._params.id;
        this._params.label = (typeof value.label === 'string') ? value.label : (this._params.label || "");
        this._params.width = (parseInt(value.width, 10) >= 50) ? parseInt(value.width, 10) : (this._params.width || 800);
        this._params.height = (parseInt(value.height, 10) >= 50) ? parseInt(value.height, 10) : (this._params.height || 600);
        this._params.padding = (parseInt(value.padding, 10) >= 0) ? parseInt(value.padding, 10) :
            ((typeof this._params.padding === 'number') ? this._params.padding : 5);
        this._params.autoWidth = (typeof value.autoWidth !== 'undefined') ? !!value.autoWidth :
            ((typeof this._params.autoWidth === 'boolean') ? this._params.autoWidth : false);
        this._params.autoHeight = (typeof value.autoHeight !== 'undefined') ? !!value.autoHeight :
            ((typeof this._params.autoHeight === 'boolean') ? this._params.autoHeight : false);
        this._params.position = (function(that) {
            if (typeof value.position === 'string') {
                value.position = value.position.toLowerCase();
                if (value.position === 'absolute' ||
                    value.position === 'relative') {
                    that._params_restrict.position = value.position;
                }
            }
            return (that._params_restrict.position || 'relative');
        }(this));
        this._params.overflow = (function(that) {
            if (typeof value.overflow === 'string') {
                value.overflow = value.overflow.toLowerCase();
                if (value.overflow === 'hidden' ||
                    value.overflow === 'visible' ||
                    value.overflow === 'auto') {
                    that._params_restrict.overflow = value.overflow;
                }
            }
            return (that._params_restrict.overflow || 'auto');
        }(this));
        this._params.left = (Math.abs(parseInt(value.left, 10)) >= 0) ? parseInt(value.left, 10) :
            ((typeof this._params.left === 'number') ? this._params.left : 0);
        this._params.top = (Math.abs(parseInt(value.top, 10)) >= 0) ? parseInt(value.top, 10) :
            ((typeof this._params.top === 'number') ? this._params.top : 0);
        this._params.hgap = (Math.abs(parseInt(value.hgap, 10)) >= 0) ? parseInt(value.hgap, 10) :
            ((typeof this._params.hgap === 'number') ? this._params.hgap : 20);
        this._params.vgap = (Math.abs(parseInt(value.vgap, 10)) >= 0) ? parseInt(value.vgap, 10) :
            ((typeof this._params.vgap === 'number') ? this._params.vgap : 20);
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
            return (that._params_restrict.border_style || 'none');
        }(this));
        this._params.border_width = (parseInt(value.border_width, 10) >= 0) ? parseInt(value.border_width, 10) :
            ((typeof this._params.border_width === 'number') ? this._params.border_width : 0);
        if (this._params.border_style === "none") { this._params.border_width = 0; }
        this._params.border_radius = (parseInt(value.border_radius, 10) >= 0) ? parseInt(value.border_radius, 10) :
            ((typeof this._params.border_radius === 'number') ? this._params.border_radius : 0);
        this._params.border_color = QUtility.paramToHex(value.border_color) ||
            ((typeof this._params.border_color === 'string') ? this._params.border_color : 'CCCCCC');
        this._params.show_bckgrnd = (typeof value.show_bckgrnd !== 'undefined') ? !!value.show_bckgrnd :
            ((typeof this._params.show_bckgrnd === 'boolean') ? this._params.show_bckgrnd : false);
        this._params.bckgrnd_color = QUtility.paramToHex(value.bckgrnd_color) ||
            ((typeof this._params.bckgrnd_color === 'string') ? this._params.bckgrnd_color : 'F5F5F5');
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
        this._params.label_fontsize = (parseInt(value.label_fontsize, 10) >= 5) ? parseInt(value.label_fontsize, 10) : (this._params.label_fontsize || 16);
        this._params.label_fontcolor = QUtility.paramToHex(value.label_fontcolor) ||
            ((typeof this._params.label_fontcolor === 'string') ? this._params.label_fontcolor : '333333');
        this._params.label_padding = (parseInt(value.label_padding, 10) >= 0) ? parseInt(value.label_padding, 10) :
            ((typeof this._params.label_padding === 'number') ? this._params.label_padding : 2);
        this._params.show_bckgrnd_import = (typeof value.show_bckgrnd_import !== 'undefined') ? !!value.show_bckgrnd_import :
            ((typeof this._params.show_bckgrnd_import === 'boolean') ? this._params.show_bckgrnd_import : false);
        this._params.bckgrnd_import = (typeof value.bckgrnd_import === 'string') ? value.bckgrnd_import : (this._params.bckgrnd_import || "");
        this._params.bckgrnd_import_top = (Math.abs(parseInt(value.bckgrnd_import_top, 10)) >= 0) ? parseInt(value.bckgrnd_import_top, 10) :
            ((typeof this._params.bckgrnd_import_top === 'number') ? this._params.bckgrnd_import_top : 0);
        this._params.bckgrnd_import_left = (Math.abs(parseInt(value.bckgrnd_import_left, 10)) >= 0) ? parseInt(value.bckgrnd_import_left, 10) :
            ((typeof this._params.bckgrnd_import_left === 'number') ? this._params.bckgrnd_import_left : 0);

        this._params.option_valign = (function(that) {
            if (typeof value.option_valign === 'string') {
                value.option_valign = value.option_valign.toLowerCase();
                if (value.option_valign === 'top' ||
                    value.option_valign === 'middle' ||
                    value.option_valign === 'bottom') {
                    that._params_restrict.option_valign = value.option_valign;
                }
            }
            return (that._params_restrict.option_valign || 'top');
        }(this));
        this._params.option_halign = (function(that) {
            if (typeof value.option_halign === 'string') {
                value.option_halign = value.option_halign.toLowerCase();
                if (value.option_halign === 'left' ||
                    value.option_halign === 'center' ||
                    value.option_halign === 'right') {
                    that._params_restrict.option_halign = value.option_halign;
                }
            }
            return (that._params_restrict.option_halign || "left");
        }(this));

        value = null;
    },

    add: function () {
        return null;
    },

    remove: function() {
        return null;
    },

    query: function(value) {
        if (!this.container()) { return null; }
        var cache = this.cache();
        if (typeof value === 'number' && value >= 0 && value < cache.childArray.length-1) {
            return cache.childArray[value];
        }

        return cache.childArray;
    },

    cache: function() {
        return this._cache;
    },

    destroy: function() {
        if (!this.container()) { return null; }
        var childArray = this.query(),
            container = this.container();

        // Remove children
        while (childArray.length !== 0) {
            var child = childArray[0];
            if (child.widget) { child.destroy(); }
            childArray.shift();
        }
        container.parentNode.removeChild(container);

        // GC
        this._container = null;
        this._cache = {};
        this._params = {};

        return this;
    },

    container: function() {
        return this._container;
    },

    setLabel: function(value) {
        if (!this.container()) { return null; }
        var label = this.cache().nodes.label;
        if (label && (typeof value === "string" && value !== "")) {
            label.innerHTML = value;
        }
    }
};

/**
 * Base Layout: Children are laid out left to right, top to bottom.
 */
function QBaseLayout(parent, configObj) {
    this._container = null;
    this._params = {};
    this._cache = {};

    // Create Container Shell
    var doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        container = doc.createElement("div"),       // Main content container
        image = doc.createElement("div"),           // Content Background image
        label = doc.createElement("label"),         // Content label
        layoutContain = doc.createElement("div"),   // Content layout container
        defaultLayout = doc.createElement("div"),   // Default layout container
        ownRowLayout = doc.createElement("div");    // OwnRow layout container

    // Container CSS Style
    container.className = "qlayout_container";

    // Image CSS Style
    image.className = "qlayout_background_image";
    image.style.cssText = "position: absolute; filter: inherit;";

    // Label CSS Style
    label.className = "qlayout_label";
    label.style.cssText = "position: relative; filter: inherit;";

    // Layout Container CSS Style
    layoutContain.className = "qlayout_layout_container";
    layoutContain.style.cssText = "position: relative; filter: inherit;";

    // Default Layout CSS Style
    defaultLayout.className = "qlayout_default_layout";
    defaultLayout.style.cssText = "position: relative; zoom: 1;";

    // OwnRow Layout CSS Style
    ownRowLayout.className = "qlayout_ownrow_layout";
    ownRowLayout.style.cssText = "position: relative; zoom: 1;";

    // Append children
    layoutContain.appendChild(defaultLayout);
    layoutContain.appendChild(ownRowLayout);
    container.appendChild(image);
    container.appendChild(label);
    container.appendChild(layoutContain);
    parentEle.appendChild(container);

    // Init
    this._container = container;
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
        image: image,
        label: label,
        layoutContain: layoutContain,
        defaultLayout: defaultLayout,
        ownRowLayout: ownRowLayout
    };
    this.config(configObj || {});
}
QBaseLayout.prototype = new QLayoutAbstract();
QBaseLayout.prototype.config = function(value) {
    if (!this.container()) { return null; }
    if (typeof value !== 'object') {
        return QLayoutAbstract.prototype.config.call(this, value);
    }

    QLayoutAbstract.prototype.config.call(this, value);
    this._params.direction = (function(that) {
        if (typeof value.direction === 'string') {
            value.direction = value.direction.toLowerCase();
            if (value.direction === 'horizontal' ||
                value.direction === 'vertical') {
                that._params_restrict.direction = value.direction;
            }
        }
        return (that._params_restrict.direction || 'horizontal');
    }(this));

    // Update container
    this.update();
    value = null;
    return this;
};
QBaseLayout.prototype.update = function() {
    if (!this.container()) { return null; }
    var params = this.config(),
        cache = this.cache(),
        container = this.container(),
        image = cache.nodes.image,
        label = cache.nodes.label,
        layoutContain = cache.nodes.layoutContain;

    // Container CSS Style
    container.id = (params.id || "QBaseLayout");
    container.style.position = params.position;
    container.style.marginTop = params.top + "px";
    container.style[(!params.isRTL) ? 'marginLeft' : 'marginRight'] = params.left + "px";

    // Image CSS Style
    image.style.display = (params.show_bckgrnd_import && params.bckgrnd_import !== "") ? "block" : "none";
    image.style.top = params.bckgrnd_import_top + "px";
    image.style.left = params.bckgrnd_import_left + "px";
    if (params.bckgrnd_import !== "") {
        var doc = document,
            img = doc.createElement("img");

        $(img).on("load", function() {
            doc.body.appendChild(img);
            $(image).css({
                'top': params.bckgrnd_import_top + "px",
                'left': params.bckgrnd_import_left + "px",
                'width': $(this).width() + "px",
                'height': $(this).height() + "px",
                'background-image': 'url('+params.bckgrnd_import+')',
                'background-repeat': 'no-repeat',
                'background-size': 'cover',
                'background-position': '0% 0%'
            });
            doc.body.removeChild(this);
            $(this).off("load");
        }).attr("src", params.bckgrnd_import);
    }

    // Label CSS Style
    label.style.display =
        (params.show_label && params.label !== "") ? "block" : "none";
    label.style.textAlign = params.label_halign;
    label.style.whiteSpace = "normal";
    label.style.wordWrap = "break-word";
    label.style.fontSize = QUtility.convertPxtoEM(params.label_fontsize) + "em";
    label.style.width = (params.width + (params.padding + params.border_width - params.label_padding)*2) + "px";
    label.style.padding = params.label_padding + "px";
    label.style.height = "auto";
    label.style.color = "#" + params.label_fontcolor;
    label.innerHTML = params.label;
    label.style.backgroundColor = "#" + params.border_color;

    // Layout Container CSS Style
    layoutContain.style.width = params.width + "px";
    layoutContain.style.height = (!params.autoHeight) ? params.height + "px" : "";
    layoutContain.style.padding = params.padding + "px";
    layoutContain.style.overflowX = (!params.autoWidth) ? params.overflow : "visible";
    layoutContain.style.overflowY = (!params.autoHeight) ? params.overflow : "visible";
    layoutContain.style.borderStyle = params.border_style;
    layoutContain.style.borderWidth = params.border_width + "px";
    layoutContain.style.borderColor = '#' + params.border_color;
    layoutContain.style.backgroundColor =
        (params.show_bckgrnd && params.bckgrnd_color !== "") ? "#" + params.bckgrnd_color : "";
};
QBaseLayout.prototype.add = function(value, ownRow) {
    if (!this.container()) { return null; }
    var that = this,
        params = this.config(),
        cache = this.cache(),
        childArray = this.query(),
        container = this.container(),
        label = cache.nodes.label,
        layoutContain = cache.nodes.layoutContain,
        defaultLayout = cache.nodes.defaultLayout,
        ownRowLayout = cache.nodes.ownRowLayout,
        labHeight = (params.show_label && params.label !== '') ? $(label).outerHeight() : 0,
        isHorz = (params.direction.toLowerCase() === "horizontal");

    // If passed an array of values
    if (jQuery.isArray(value) && value.length > 0) {
        for (var i = 0, len = value.length; i<len; i+=1) {
            var val = value[i].child || value[i],
                ownrow = value[i].ownRow || false;

            helper(val, ownrow);
        }
    }

    // If passed one value
    else {
        return helper(value, ownRow);
    }

    // helper function
    function helper(target, ownrow) {
        if (target) {
            ownrow = (typeof ownrow === 'boolean' && ownrow) ? ownrow : false;
            // function to create child wrapper and append to appropriate layout
            var addHelper = function(child) {
                // Create child wrapper
                var child_wrap = document.createElement("div");
                child_wrap.className = "qlayout_child_wrapper";
                child_wrap.style.filter = "inherit";
                child_wrap.style.zoom = "1";
                // Append to appropriate layout
                if (!ownrow) {
                    child_wrap.appendChild(child);
                    if (!defaultLayout.children.length) {
                        // Create new row container
                        var row_contain = document.createElement("div");
                        row_contain.className = "qlayout_row_container";
                        row_contain.style.position = (isHorz) ? "relative" : "absolute";
                        row_contain.style[(!params.isRTL) ? "left" : "right"] = 0 + "px";
                        row_contain.style.top = 0 + "px";
                        defaultLayout.appendChild(row_contain);
                    }

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
                    //child_wrap.style.left = (cache.maxRowSize - childWidth)*0.5 + "px";

                    cache.ownRowMaxWidth = Math.max(cache.ownRowMaxWidth, childWidth);
                    ownRowLayout.style.width = cache.ownRowMaxWidth + "px";
                    ownRowLayout.style.height = (ownRowHeight + ownRowOffset + childHeight) + "px";
                    ownRowLayout.appendChild(child_wrap);
                }

                // Resize Layout Container Height
                var ownRowLen = ownRowLayout.children.length;
                if (params.autoHeight) {
                    var defLayoutHeight = $(defaultLayout).outerHeight(true),
                        ownRowHeight = (!ownRowLen) ? 0 : $(ownRowLayout).outerHeight(true);

                    layoutContain.style.height = (defLayoutHeight + ownRowHeight) + "px";
                }

                // Resize Layout Container Width
                if (params.autoWidth) {
                    var defLayoutWidth = $(defaultLayout).outerWidth(true),
                        ownRowWidth = (!ownRowLen) ? 0 : $(ownRowLayout).outerWidth(true);

                    label.style.width = (defLayoutWidth + (params.border_width + params.padding - params.label_padding)*2) + "px";
                    layoutContain.style.width = Math.max(defLayoutWidth, ownRowWidth) + "px";
                }

                // Set overall container dimensions
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
                    for (var i = 0; i < ownRowLen; i+=1) {
                        var curChild = ownRowLayout.children[i],
                            offset = ($(layoutContain).width() - $(curChild.children[0]).outerWidth()) *
                                ((params.option_halign === "center") ? 0.5 : 1);

                        curChild.style[(!params.isRTL) ? "marginLeft" : "marginRight"] = offset + "px";
                    }
                }

                return child_wrap;
            };

            // Accepts both normal nodes and widgets
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
QBaseLayout.prototype.remove = function(value) {
    if (!this.container()) { return null; }
    // Not implemented yet...
};
QBaseLayout.prototype._layoutChildHorizontally = function(child_wrap) {
    if (!this.container()) { return null; }
    var cache = this.cache(),
        params = this.config(),
        defaultLayout = cache.nodes.defaultLayout,
        child = child_wrap.children[0],
        childWidth = $(child).outerWidth(true),
        curRowContain = null,
        endOfRow = null;

    endOfRow = cache.xPosition + childWidth;
    if(endOfRow > params.width && cache.xPosition !== 0) {
        //next row if we're over the width,
        //but not if we're at xposition == 0
        cache.maxRowSize = Math.max(cache.maxRowSize, cache.xPosition-params.hgap);
        cache.xPosition = 0;
        cache.yPosition += cache.maxSize + params.vgap;
        cache.maxSize = 0;

        // Create new row container
        var row_contain = document.createElement("div");
        row_contain.className = "qlayout_row_container";
        row_contain.style.position = "relative";
        row_contain.style.marginTop = params.vgap + "px";
        //row_contain.style.width = "100%";
        //row_contain.style.height = "100%";
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
    if (!this.container()) { return null; }
    var cache = this.cache(),
        params = this.config(),
        defaultLayout = cache.nodes.defaultLayout,
        child = child_wrap.children[0],
        childHeight = $(child).outerHeight(true),
        curRowContain = null,
        endOfColumn = null;

    endOfColumn = cache.yPosition + childHeight;
    if(endOfColumn > params.height && cache.yPosition !== 0) {
        //next column if we're over the height,
        //but not if we're at yposition == 0
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
        //row_contain.style.width = "100%";
        //row_contain.style.height = "100%";
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

/**
 * Vertical Layout: Children are laid out top to bottom.
 */
function QVerticalLayout(parent, configObj) {
    this._container = null;
    this._params = {};
    this._cache = {};

    // Create Container Shell
    var doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        container = doc.createElement("div"),       // Main content container
        image = doc.createElement("div"),           // Content Background image
        label = doc.createElement("label"),           // Content label
        layoutContain = doc.createElement("div"),   // Content layout container
        defaultLayout = doc.createElement("div");   // Default layout container

    // Container CSS Style
    container.className = "qlayout_container";

    // Image CSS Style
    image.className = "qlayout_background_image";
    image.style.cssText = "position: absolute; filter: inherit;";

    // Label CSS Style
    label.className = "qlayout_label";
    label.style.cssText = "position: relative; filter: inherit;";

    // Layout Container CSS Style
    layoutContain.className = "qlayout_layout_container";
    layoutContain.style.cssText = "position: relative; filter: inherit;";

    // Default Layout CSS Style
    defaultLayout.className = "qlayout_default_layout";
    defaultLayout.style.cssText = "position: relative; filter: inherit; zoom: 1;";

    // Append children
    layoutContain.appendChild(defaultLayout);
    container.appendChild(image);
    container.appendChild(label);
    container.appendChild(layoutContain);
    parentEle.appendChild(container);

    // Init
    this._container = container;
    this._cache.childArray = [];
    this._cache.maxWidth = 0;
    this._cache.totalHeight = 0;
    this._cache.nodes = {
        image: image,
        label: label,
        layoutContain: layoutContain,
        defaultLayout: defaultLayout
    };
    this.config(configObj || {});
}
QVerticalLayout.prototype = new QLayoutAbstract();
QVerticalLayout.prototype.config = function(value) {
    if (!this.container()) { return null; }
    if (typeof value !== 'object') {
        return QLayoutAbstract.prototype.config.call(this, value);
    }

    QLayoutAbstract.prototype.config.call(this, value);

    // Update container
    this.update();
    value = null;
    return this;
};
QVerticalLayout.prototype.update = function() {
    if (!this.container()) { return null; }
    var params = this.config(),
        cache = this.cache(),
        container = this.container(),
        image = cache.nodes.image,
        layoutContain = cache.nodes.layoutContain,
        label = cache.nodes.label,
        scrollbar_offset = (!params.autoHeight) ? 20 : 0;

    // Container CSS Style
    container.id = (params.id || "QVerticalLayout");
    container.style.position = params.position;
    container.style.marginTop = params.top + "px";
    container.style[(!params.isRTL) ? 'marginLeft' : 'marginRight'] = params.left + "px";

    // Image CSS Style
    image.style.display = (params.show_bckgrnd_import && params.bckgrnd_import !== "") ? "block" : "none";
    image.style.top = params.bckgrnd_import_top + "px";
    image.style.left = params.bckgrnd_import_left + "px";
    if (params.bckgrnd_import !== "") {
        var doc = document,
            img = doc.createElement("img");

        $(img).on("load", function() {
            doc.body.appendChild(img);
            $(image).css({
                'top': params.bckgrnd_import_top + "px",
                'left': params.bckgrnd_import_left + "px",
                'width': $(this).width() + "px",
                'height': $(this).height() + "px",
                'background-image': 'url('+params.bckgrnd_import+')',
                'background-repeat': 'no-repeat',
                'background-size': 'cover',
                'background-position': '0% 0%'
            });
            doc.body.removeChild(this);
            $(this).off("load");
        }).attr("src", params.bckgrnd_import);
    }

    // Label CSS Style
    label.style.display =
        (params.show_label && params.label !== "") ? "block" : "none";
    label.style.whiteSpace = "normal";
    label.style.wordWrap = "break-word";
    label.style.textAlign = params.label_halign;
    label.style.fontSize = QUtility.convertPxtoEM(params.label_fontsize) + "em";
    label.style.width = (scrollbar_offset + params.width + (params.padding + params.border_width - params.label_padding)*2) + "px";
    label.style.padding = params.label_padding + "px";
    label.style.height = "auto";
    label.style.color = "#" + params.label_fontcolor;
    label.innerHTML = params.label;
    label.style.backgroundColor = "#" + params.border_color;

    // Layout Container CSS Style
    layoutContain.style.width = params.width + "px";
    layoutContain.style.height = (!params.autoHeight) ? params.height + "px" : "";
    layoutContain.style.padding =
        params.padding + "px " + (scrollbar_offset + params.padding) + "px " + params.padding + "px " + params.padding + "px";
    layoutContain.style.overflowX = (!params.autoWidth) ? params.overflow : "visible";
    layoutContain.style.overflowY = (!params.autoHeight) ? params.overflow : "visible";
    layoutContain.style.borderStyle = params.border_style;
    layoutContain.style.borderWidth = params.border_width + "px";
    layoutContain.style.borderColor = '#' + params.border_color;
    layoutContain.style.backgroundColor =
        (params.show_bckgrnd && params.bckgrnd_color !== "") ? "#" + params.bckgrnd_color : "";
};
QVerticalLayout.prototype.add = function(value) {
    if (!this.container()) { return null; }
    var params = this.config(),
        cache = this.cache(),
        childArray = this.query(),
        container = this.container(),
        label = cache.nodes.label,
        layoutContain = cache.nodes.layoutContain,
        defaultLayout = cache.nodes.defaultLayout,
        labHeight = (params.show_label && params.label !== '') ? $(label).outerHeight() : 0,
        scrollbar_offset = (!params.autoHeight) ? 20 : 0;

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
            // function to create child wrapper and append to appropriate layout
            var addHelper = function(child) {
                var child_wrap = document.createElement("div"),
                    queryLen = childArray.length;

                child_wrap.className = "qlayout_child_wrapper";
                child_wrap.style.filter = "inherit";
                child_wrap.style.position = "absolute";
                child_wrap.style.zoom = "1";
                child_wrap.style.top = cache.totalHeight + "px";
                if (queryLen > 1) { child_wrap.style.marginTop = params.vgap + "px"; }
                child_wrap.appendChild(child);
                defaultLayout.appendChild(child_wrap);

                // Calculate max child width and total layout height
                cache.maxWidth = Math.max(cache.maxWidth, $(child).outerWidth(true));
                cache.totalHeight += $(child).outerHeight(true) + ((queryLen > 1) ? params.vgap : 0);

                if (params.option_halign !== "center") {
                    child_wrap.style[params.option_halign] = 0 + "px";
                } else {
                    for (var i = 0; i < defaultLayout.children.length; i+=1) {
                        var childWrp = defaultLayout.children[i];
                        childWrp.style.left = (cache.maxWidth - $(childWrp.children[0]).outerWidth(true))*0.5 + "px";
                    }
                }

                // Resize layout, layoutContain, & label width
                defaultLayout.style.width = cache.maxWidth + "px";
                if (params.autoWidth) {
                    layoutContain.style.width = cache.maxWidth + "px";
                    label.style.width =
                        (cache.maxWidth + scrollbar_offset + (params.border_width + params.padding -params.label_padding)*2) + "px";
                }

                // Resize layout & layoutContain height
                defaultLayout.style.height = cache.totalHeight + "px";
                if (params.autoHeight) {
                    layoutContain.style.height = cache.totalHeight + "px";
                }

                // Set overall container dimensions
                container.style.width = $(layoutContain).outerWidth() + "px";
                container.style.height = ($(layoutContain).outerHeight() + labHeight) + "px";

                return child_wrap;
            };

            // Accepts both normal nodes and widgets
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
    if (!this.container()) { return null; }
};

/**
 * Horizontal Layout: Children are laid out left to right.
 */
function QHorizontalLayout(parent, configObj) {
    this._container = null;
    this._params = {};
    this._cache = {};

    // Create Container Shell
    var doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        container = doc.createElement("div"),       // Main content container
        image = doc.createElement("div"),           // Content Background image
        label = doc.createElement("label"),           // Content label
        layoutContain = doc.createElement("div"),   // Content layout container
        defaultLayout = doc.createElement("div");   // Default layout container

    // Container CSS Style
    container.className = "qlayout_container";

    // Image CSS Style
    image.className = "qlayout_background_image";
    image.style.cssText = "position: absolute; filter: inherit;";

    // Label CSS Style
    label.className = "qlayout_label";
    label.style.cssText = "position: relative; filter: inherit;";

    // Layout Container CSS Style
    layoutContain.className = "qlayout_layout_container";
    layoutContain.style.cssText = "position: relative; filter: inherit;";

    // Default Layout CSS Style
    defaultLayout.className = "qlayout_default_layout";
    defaultLayout.style.cssText = "position: relative; filter: inherit; zoom: 1;";

    // Append children
    layoutContain.appendChild(defaultLayout);
    container.appendChild(image);
    container.appendChild(label);
    container.appendChild(layoutContain);
    parentEle.appendChild(container);

    // Init
    this._container = container;
    this._cache.maxHeight = 0;
    this._cache.totalWidth = 0;
    this._cache.childArray = [];
    this._cache.nodes = {
        image: image,
        label: label,
        layoutContain: layoutContain,
        defaultLayout: defaultLayout
    };

    this.config(configObj || {});
}
QHorizontalLayout.prototype = new QLayoutAbstract();
QHorizontalLayout.prototype.config = function(value) {
    if (!this.container()) { return null; }
    if (typeof value !== 'object') {
        return QLayoutAbstract.prototype.config.call(this, value);
    }

    QLayoutAbstract.prototype.config.call(this, value);

    // Update container
    this.update();
    value = null;
    return this;
};
QHorizontalLayout.prototype.update = function() {
    if (!this.container()) { return null; }
    var params = this.config(),
        cache = this.cache(),
        container = this.container(),
        image = cache.nodes.image,
        layoutContain = cache.nodes.layoutContain,
        label = cache.nodes.label,
        scrollbar_offset = (!params.autoWidth) ? 20 : 0;

    // Container CSS Style
    container.id = (params.id || "QHorizontalLayout");
    container.style.position = params.position;
    container.style.marginTop = params.top + "px";
    container.style[(!params.isRTL) ? 'marginLeft' : 'marginRight'] = params.left + "px";

    // Image CSS Style
    image.style.display = (params.show_bckgrnd_import && params.bckgrnd_import !== "") ? "block" : "none";
    image.style.top = params.bckgrnd_import_top + "px";
    image.style.left = params.bckgrnd_import_left + "px";
    if (params.bckgrnd_import !== "") {
        var doc = document,
            img = doc.createElement("img");

        $(img).on("load", function() {
            doc.body.appendChild(img);
            $(image).css({
                'top': params.bckgrnd_import_top + "px",
                'left': params.bckgrnd_import_left + "px",
                'width': $(this).width() + "px",
                'height': $(this).height() + "px",
                'background-image': 'url('+params.bckgrnd_import+')',
                'background-repeat': 'no-repeat',
                'background-size': 'cover',
                'background-position': '0% 0%'
            });
            doc.body.removeChild(this);
            $(this).off("load");
        }).attr("src", params.bckgrnd_import);
    }

    // Label CSS Style
    label.style.display =
        (params.show_label && params.label !== "") ? "block" : "none";
    label.style.whiteSpace = "normal";
    label.style.wordWrap = "break-word";
    label.style.textAlign = params.label_halign;
    label.style.fontSize = QUtility.convertPxtoEM(params.label_fontsize) + "em";
    label.style.width = (params.width + (params.padding + params.border_width - params.label_padding)*2) + "px";
    label.style.padding = params.label_padding + "px";
    label.style.height = "auto";
    label.style.color = "#" + params.label_fontcolor;
    label.innerHTML = params.label;
    label.style.backgroundColor = "#" + params.border_color;

    // Layout Container CSS Style
    layoutContain.style.width = params.width + "px";
    layoutContain.style.height = (!params.autoHeight) ? params.height + "px" : "";
    layoutContain.style.padding =
        params.padding + "px " + params.padding + "px " + (scrollbar_offset + params.padding) + "px "  + params.padding + "px";
    layoutContain.style.overflowX = (!params.autoWidth) ? params.overflow : "visible";
    layoutContain.style.overflowY = (!params.autoHeight) ? params.overflow : "visible";
    layoutContain.style.borderStyle = params.border_style;
    layoutContain.style.borderWidth = params.border_width + "px";
    layoutContain.style.borderColor = '#' + params.border_color;
    layoutContain.style.backgroundColor =
        (params.show_bckgrnd && params.bckgrnd_color !== "") ? "#" + params.bckgrnd_color : "";
};
QHorizontalLayout.prototype.add = function(value) {
    if (!this.container()) { return null; }
    var params = this.config(),
        cache = this.cache(),
        childArray = this.query(),
        container = this.container(),
        label = cache.nodes.label,
        layoutContain = cache.nodes.layoutContain,
        defaultLayout = cache.nodes.defaultLayout,
        labHeight = (params.show_label && params.label !== '') ? $(label).outerHeight() : 0;

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
            // function to create child wrapper and append to appropriate layout
            var addHelper = function(child) {
                var queryLen = childArray.length,
                    child_wrap = document.createElement("div");

                child_wrap.className = "qlayout_child_wrapper";
                child_wrap.style.filter = "inherit";
                child_wrap.style.position = "absolute";
                child_wrap.style.zoom = "1";
                child_wrap.style[(!params.isRTL) ? "left" : "right"] = cache.totalWidth + "px";
                if (queryLen > 1) { child_wrap.style[(!params.isRTL) ? "marginLeft" : "marginRight"] = params.hgap + "px"; }
                child_wrap.appendChild(child);
                defaultLayout.appendChild(child_wrap);

                // Calculate max child height and total layout width
                cache.maxHeight = Math.max(cache.maxHeight, $(child).outerHeight(true));
                cache.totalWidth += $(child).outerWidth(true) + ((queryLen > 1) ? params.hgap : 0);

                if (params.option_valign !== "middle") {
                    child_wrap.style[params.option_valign] = 0 + "px";
                } else {
                    for (var i = 0; i < defaultLayout.children.length; i+=1) {
                        var childWrp = defaultLayout.children[i];
                        childWrp.style.top = (cache.maxHeight - $(childWrp.children[0]).outerHeight(true))*0.5 + "px";
                    }
                }

                // Resize layout, layoutContain, & label width
                defaultLayout.style.width = cache.totalWidth + "px";
                if (params.autoWidth) {
                    label.style.width =
                        (cache.totalWidth + (params.border_width + params.padding - params.label_padding)*2) + "px";
                    layoutContain.style.width = cache.totalWidth + "px";
                }

                // Resize layout & layoutContain height
                if (params.autoHeight) {
                    defaultLayout.style.height = cache.maxHeight + "px";
                    layoutContain.style.height = cache.maxHeight + "px";
                }

                // Set overall container dimensions
                container.style.width = $(layoutContain).outerWidth() + "px";
                container.style.height = ($(layoutContain).outerHeight() + labHeight) + "px";

                return child_wrap;
            };

            // Accepts both normal nodes and widgets
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
    if (!this.container()) { return null; }
};

/**
 * Set Layout: Children are laid out according to layout type
 */
function QSetLayout(parent, configObj) {
    this._container = null;
    this._params = {};
    this._cache = {};

    // Create Button Shell
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

    // Init
    this._container = container;
    this._cache.setIndex = 0;
    this._cache.childArray = [];
    this._cache.nodes = {
        layoutContain: layoutContain,
        setLayout: null
    };
    this.config(configObj || {});
}
QSetLayout.prototype = new QLayoutAbstract();
QSetLayout.prototype.config = function(value) {
    if (!this.container()) { return null; }
    if (typeof value !== 'object') {
        return QLayoutAbstract.prototype.config.call(this, value);
    }

    QLayoutAbstract.prototype.config.call(this, value);
    this._params.border_color = value.border_color;
    this._params.bckgrnd_color = value.bckgrnd_color;
    this._params.label_fontcolor = value.label_fontcolor;
    this._params.layout_type = (function(that) {
        if (typeof value.layout_type === 'string') {
            value.layout_type = value.layout_type.toLowerCase();
            if (value.layout_type === 'horizontal' ||
                value.layout_type === 'vertical' ||
                value.layout_type === 'horizontal grid' ||
                value.layout_type === 'vertical grid') {
                that._params_restrict.layout_type = value.layout_type;
            }
        }
        return (that._params_restrict.layout_type || 'vertical');
    }(this));
    this._params.num_per_row = (parseInt(value.num_per_row, 10) >= 0) ? parseInt(value.num_per_row, 10) :
        ((typeof this._params.num_per_row === 'number') ? this._params.num_per_row : 3);

    // Update container
    this.update();
    value = null;
    return this;
};
QSetLayout.prototype.update = function() {
    if (!this.container()) { return null; }
    var params = this.config(),
        container = this.container();

    // Container CSS Style
    container.id = (params.id || "QSetLayout");
    container.style.position = params.position;
    container.style.marginTop = params.top + "px";
    container.style[(!params.isRTL) ? 'marginLeft' : 'marginRight'] = params.left + "px";
};
QSetLayout.prototype.add = function(value) {
    if (!this.container()) { return null; }
    var that = this,
        params = this.config(),
        cache = this.cache(),
        childArray = this.query();

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
            // function to create child wrapper and append to appropriate layout
            var addHelper = function(child) {
                var queryLen = childArray.length-1;
                if ((queryLen !== 0) && (queryLen % params.num_per_row === 0)) {
                    // Don't pass offsets over
                    params.top = 0;
                    params.left = 0;
                    cache.nodes.setLayout = that._layoutFactory(params.layout_type);
                    cache.nodes.setLayout.container().style.display = "none";
                }

                if (!cache.nodes.setLayout) {
                    // Don't pass offsets over
                    params.top = 0;
                    params.left = 0;
                    cache.nodes.setLayout = that._layoutFactory(params.layout_type);
                }

                return cache.nodes.setLayout.add(child);
            };

            // Accepts both normal nodes and widgets
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
    if (!this.container()) { return null; }
};
QSetLayout.prototype.next = function() {
    if (!this.container()) { return null; }
    var cache = this.cache(),
        layoutContain = cache.nodes.layoutContain,
        setLayout = null;

    if (cache.setIndex >= 0 && (cache.setIndex < layoutContain.children.length-1)) {
        setLayout = this.setLayout();
        setLayout.style.display = "none";
        cache.setIndex+=1;
        setLayout = this.setLayout();
        setLayout.style.display = "block";
        return cache.setIndex;
    }

    return false;
};
QSetLayout.prototype.back = function() {
    if (!this.container()) { return null; }
    var cache = this.cache(),
        setLayout = null;

    if (cache.setIndex > 0) {
        setLayout = this.setLayout();
        setLayout.style.display = "none";
        cache.setIndex-=1;
        setLayout = this.setLayout();
        setLayout.style.display = "block";
        return cache.setIndex;
    }

    return false;
};
QSetLayout.prototype.setIndex = function() {
    if (!this.container()) { return null; }
    return this.cache().setIndex;
};
QSetLayout.prototype.setLayout = function() {
    if (!this.container()) { return null; }
    return this.cache().nodes.layoutContain.children[this.setIndex()];
};
QSetLayout.prototype._layoutFactory = function(type) {
    if (!this.container()) { return null; }
    var layoutContain = this.cache().nodes.layoutContain,
        params = this.config(),
        retLayout = null;

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

/**
 * Scroll Layout: Children are laid out either horizontally or vertically and animate into position
 */
function QScrollLayout(parent, configObj) {
    this._container = null;
    this._params = {};
    this._cache = {};

    // Create Button Shell
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

    // Init
    this._container = container;
    this._cache.maxSize = 0;
    this._cache.maxChildHeight = 0;
    this._cache.totalSize = 0;
    this._cache.scrollIndex = 0;
    this._cache.childArray = [];
    this._cache.nodes = {
        layoutContain: layoutContain,
        defaultLayout: defaultLayout
    };
    this.config(configObj || {});
}
QScrollLayout.prototype = new QLayoutAbstract();
QScrollLayout.prototype.config = function(value) {
    if (!this.container()) { return null; }
    if (typeof value !== 'object') {
        return QLayoutAbstract.prototype.config.call(this, value);
    }

    QLayoutAbstract.prototype.config.call(this, value);
    this._params.anim_speed = (parseInt(value.anim_speed, 10) >= 100) ? parseInt(value.anim_speed, 10) :
        ((typeof this._params.anim_speed === 'number') ? this._params.anim_speed : 800);
    this._params.end_offset = (parseInt(value.end_offset, 10) >= 0) ? parseInt(value.end_offset, 10) :
        ((typeof this._params.end_offset === 'number') ? this._params.end_offset : 50);
    this._params.direction = (function(that) {
        if (typeof value.direction === 'string') {
            value.direction = value.direction.toLowerCase();
            if (value.direction === 'horizontal' ||
                value.direction === 'vertical') {
                that._params_restrict.direction = value.direction;
            }
        }
        return (that._params_restrict.direction || 'horizontal');
    }(this));
    this._params.start_alpha = (parseInt(value.start_alpha, 10) >= 0) ? parseInt(value.start_alpha, 10) / 100 :
        ((typeof this._params.start_alpha === 'number') ? this._params.start_alpha : 1);
    this._params.end_alpha = (parseInt(value.end_alpha, 10) >= 0) ? parseInt(value.end_alpha, 10) / 100 :
        ((typeof this._params.end_alpha === 'number') ? this._params.end_alpha : 1);
    this._params.go_opaque = (typeof value.go_opaque !== 'undefined') ? !!value.go_opaque :
        ((typeof this._params.go_opaque === 'boolean') ? this._params.go_opaque : false);

    // Update container
    this.update();
    value = null;
    return this;
};
QScrollLayout.prototype.update = function() {
    if (!this.container()) { return null; }
    var params = this.config(),
        container = this.container();

    // Container CSS Style
    container.id = (params.id || "QScrollLayout");
    container.style.position = params.position;
    container.style.marginTop = params.top + "px";
    container.style[(!params.isRTL) ? 'marginLeft' : 'marginRight'] = params.left + "px";
};
QScrollLayout.prototype.add = function(value) {
    if (!this.container()) { return null; }
    var params = this.config(),
        cache = this.cache(),
        container = this.container(),
        layoutContain = cache.nodes.layoutContain,
        defaultLayout = cache.nodes.defaultLayout,
        childArray = this.query(),
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

            // Accepts both normal nodes and widgets
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
    if (!this.container()) { return null; }
};
QScrollLayout.prototype.next = function() {
    if (!this.container()) { return null; }
    var params = this.config(),
        cache = this.cache(),
        childArray = this.query(),
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
    if (!this.container()) { return null; }
    var params = this.config(),
        cache = this.cache(),
        childArray = this.query(),
        defaultLayout = cache.nodes.defaultLayout,
        isHorz = (params.direction.toLowerCase() === "horizontal"),
        wgt_child = null,
        child = null,
        child_wrap = null;

    var backHorzHelper = function() {
        wgt_child  = (childArray[cache.scrollIndex].widget) ? childArray[cache.scrollIndex] : null;
        child = childArray[cache.scrollIndex].widget() || childArray[cache.scrollIndex];
        child_wrap = child.parentNode;
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
            //$(child_wrap).css({ "opacity": 1 });
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
        child = childArray[cache.scrollIndex].widget() || childArray[cache.scrollIndex];
        child_wrap = child.parentNode;
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
            //$(child_wrap).css({ "opacity": 1 });
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
    if (!this.container()) { return null; }
    if (typeof value === "number" && (value >= 0 && (value < this.query().length))) {
        var curAnimSpeed = this.config().anim_speed;
        this.config().anim_speed = 0;
        for (var i=value; i--;) { this.next(); }
        this.config().anim_speed = curAnimSpeed;
        curAnimSpeed = null;
    } else {
        return this.cache().scrollIndex;
    }
};

/**
 * Sequential Layout: Children are shown sequentially
 */
function QSeqLayout(parent, configObj) {
    this._container = null;
    this._params = {};
    this._cache = {};

    // Create Container Shell
    var doc = document,
        parentEle = (parent && parent.nodeType === 1) ? parent : doc.body,
        container = doc.createElement("div");      // Main content container

    // Container CSS Style
    container.className = "qlayout_container";

    // Append children
    parentEle.appendChild(container);

    // Init
    this._container = container;
    this._cache.childArray = [];
    this._cache.nodes = {};
    this._cache.childMaxWidth = 0;
    this._cache.childMaxHeight = 0;
    this.config(configObj || {});
}
QSeqLayout.prototype = new QLayoutAbstract();
QSeqLayout.prototype.config = function(value) {
    if (!this.container()) { return null; }
    if (typeof value !== 'object') {
        return QLayoutAbstract.prototype.config.call(this, value);
    }

    QLayoutAbstract.prototype.config.call(this, value);

    // Update container
    this.update();
    value = null;
    return this;
};
QSeqLayout.prototype.update = function() {
    if (!this.container()) { return null; }
    var params = this.config(),
        cache = this.cache(),
        container = this.container();

    // Container CSS Style
    container.id = (params.id || "QSequentialLayout");
    container.dir = 'ltr';
    container.style.position = params.position;
    container.style.marginTop = params.top + "px";
    container.style[(!params.isRTL) ? 'marginLeft' : 'marginRight'] = params.left + "px";
};
QSeqLayout.prototype.add = function(value) {
    if (!this.container()) { return null; }
    var params = this.config(),
        cache = this.cache(),
        container = this.container(),
        childArray = this.query();

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
        var addToContain = function(target) {
            target.style.display = (childArray.length > 1) ? "none" : "block";
            var wrap = document.createElement("div"),
                targetWidth = $(target).outerWidth(),
                curMaxWidth = cache.childMaxWidth;

            wrap.appendChild(target);
            wrap.className = "qlayout_child_wrapper";
            wrap.style.position = "absolute";
            wrap.style.top = "0px";
            wrap.style.width = "0px";
            wrap.style.height = "0px";
            container.appendChild(wrap);
            cache.childMaxWidth = Math.max(targetWidth, cache.childMaxWidth);
            cache.childMaxHeight = Math.max($(target).outerHeight(), cache.childMaxHeight);
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

        // Accepts both normal nodes and widgets
        if (target.nodeType === 1) {
            if (jQuery.inArray(target, childArray) === -1) {
                childArray.push(target);
                return addToContain(target);
            }
        } else if (target instanceof QStudioDCAbstract) {
            if (jQuery.inArray(target, childArray) === -1) {
                childArray.push(target);
                return addToContain(target.widget());
            }
        }
    }
};
QSeqLayout.prototype.next = function() {
    var childArray = this.query(),
        nextRow = null;

    childArray.shift();
    nextRow = childArray[0];
    if (nextRow) {
        if (nextRow.widget) { nextRow = nextRow.widget(); }
        nextRow.style.zIndex = 1000;
        $(nextRow).fadeIn();
    }
};
QSeqLayout.prototype.back = function(value) {
    if (value) {
        var childArray = this.query(),
            curRow = childArray[0];

        if (curRow) {
            if (curRow.widget) { curRow = curRow.widget(); }
            curRow.style.zIndex = "auto";
            curRow.style.display = "none";
        }

        if (value.widget) { value = value.widget(); }
        childArray.unshift(value);
    }
};