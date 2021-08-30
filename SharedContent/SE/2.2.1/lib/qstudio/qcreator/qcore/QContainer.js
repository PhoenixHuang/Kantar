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
        showLabel = (params.show_label && params.label !== ""),
        isMSTouch = QUtility.isMSTouch(),
        isTouchDevice = QUtility.isTouchDevice(),
        isTouchMove = false,
        eventStr = (!isMSTouch) ?
            ((!isTouchDevice) ? "click.qverticallayout" : "touchstart.qverticallayout touchend.qverticallayout touchmove.qverticallayout"):
            ((!isTouchDevice) ? "click.qverticallayout" : ((window.PointerEvent) ? "pointerdown.qverticallayout pointerup.qverticallayout" : "MSPointerDown.qverticallayout MSPointerUp.qverticallayout"));

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
        $([navTop, navBottom]).on(eventStr, function(event) {
            event.stopPropagation();
            if (isMSTouch && isTouchDevice && !event.originalEvent.isPrimary) { return; }
            if (event.type !== "touchmove") {
                if (event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                    if (!isTouchMove) {
                        that[(event.currentTarget === navTop) ? "navBack" : "navNext"]();
                    }
                } else {
                    isTouchMove = false;
                }
            } else {
                isTouchMove = true;
            }
        });
    } else {
        // remove navigation container from DOM
        if (navContain.parentNode === container) {
            ofContain = defaultLayout.parentNode;
            navContain.parentNode.removeChild(navContain);

            // remove events
            $([navTop, navBottom]).off(eventStr);

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
                cache.maxWidth = Math.max(cache.maxWidth, $(child).outerWidth(true));
                cache.totalHeight += $(child).outerHeight(true) + ((!isFirstChild) ? params.vgap : 0);

                // If slider is enabled...
                if (params.enableSlider) {
                    var setIndex = (cache.totalHeight/(cache.setHeight + parseInt(defaultLayout.parentNode.style.height, 10)));
                    if (setIndex > 1) {
                        cache.setHeight = cache.totalHeight - $(child).outerHeight(true);
                        if (cache.setHeight > 0) { cache.navLoc.push(cache.setHeight); }
                    }
                }

                // horizontally align child wrappers
                if (params.option_halign !== "center") {
                    child_wrap.style[params.option_halign] = 0 + "px";
                } else {
                    for (var i = 0; i < defaultLayout.children.length; i+=1) {
                        var childWrp = defaultLayout.children[i];
                        childWrp.style.left = (cache.maxWidth - $(childWrp.children[0]).outerWidth(true))*0.5 + "px";
                    }
                }

                // set new defaultLayout dimensions
                defaultLayout.style.width = cache.maxWidth + "px";
                defaultLayout.style.height  = cache.totalHeight + "px";

                // set new layoutContain dimensions
                if (params.autoWidth) { layoutContain.style.width = cache.maxWidth + "px"; }
                if (params.autoHeight) { layoutContain.style.height = cache.totalHeight + "px"; }

                // set new container dimensions
                container.style.width = $(layoutContain).outerWidth() + "px";
                container.style.height = ($(layoutContain).outerHeight() + labHeight) + "px";

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
        showLabel = (params.show_label && params.label !== ""),
        isMSTouch = QUtility.isMSTouch(),
        isTouchDevice = QUtility.isTouchDevice(),
        isTouchMove = false,
        eventStr = (!isMSTouch) ?
            ((!isTouchDevice) ? "click.qhorizontallayout" : "touchstart.qhorizontallayout touchend.qhorizontallayout touchmove.qhorizontallayout"):
            ((!isTouchDevice) ? "click.qhorizontallayout" : ((window.PointerEvent) ? "pointerdown.qhorizontallayout pointerup.qhorizontallayout" : "MSPointerDown.qhorizontallayout MSPointerUp.qhorizontallayout"));

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
        $([navLeft, navRight]).on(eventStr, function(event) {
            event.stopPropagation();
            if (isMSTouch && isTouchDevice && !event.originalEvent.isPrimary) { return; }
            if (event.type !== "touchmove") {
                if (event.type !== 'touchstart' && event.type !== "pointerdown" && event.type !== "MSPointerDown") {
                    if (!isTouchMove) {
                        (!params.isRTL) ?
                            that[(event.currentTarget === navLeft) ? "navBack" : "navNext"]():
                            that[(event.currentTarget === navLeft) ? "navNext" : "navBack"]();
                    }
                } else {
                    isTouchMove = false;
                }
            } else {
                isTouchMove = true;
            }
        });
    } else {
        // remove navigation container from DOM
        if (navContain.parentNode === container) {
            ofContain = defaultLayout.parentNode;
            navContain.parentNode.removeChild(navContain);

            // remove events
            $([navLeft, navRight]).off(eventStr);

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
    appendToEnd = (typeof appendToEnd === "boolean" && appendToEnd) ? true : false;
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