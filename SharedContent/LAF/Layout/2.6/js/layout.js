var preloadScript = [];
var loadScript = [];
var pageLayout;
var engErrorMessage = 'There was an error loading the page.  Please contact the survey administrator.';
var revertToHTML = false;
var isRTL;
var isstudio;

//TODO: fix form.submit() when multiple submit buttons by creating a submit function to always click next

$(document).ready(function() {
    try {
        isstudio = location.href.search(/question\.htm/i) > 0;
        isRTL = checkRTL('css/laf_rtl.css');
		if (typeof qJSON != 'undefined') {
			if (isRTL) {
				 $.each(qJSON, function(index, json) {
					json.CustomProps["isRTL"] = true;
					json.CustomProps["RTL"] = true;
					json.CustomProps["compRTL"] = true;
					json.CustomProps["row$rtl"] = true;
					json.CustomProps["column$rtl"] = true;
				});				
			}
		}
        $(".container").show();
        pageLayout = new layout(); // create the global survey page.
        pageLayout.init();
		$( ".mrNext" ).on( "click", function() {
		  $( this ).attr('disabled','disabled');
		  var that = this;
		setTimeout(function(){ $(that).removeAttr("disabled"); }, 2000);
		   $("form").submit();
		});

    } catch (err) {
        handleSurveyEngineError(err);
    }
});

/**
 * In case a console.log message gets in here
 * @private
 */
var console = window.console || {
    log: function() {}
};

/**
 * Object.create not supported in IE8 or below
 * @private
 */
if (Object.create === undefined) {
    Object.create = function(o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}


var layout = function() {

    this.form = $('form');
    this.menu = $('#menuButtons');
    this.navigations = $('#surveyButtons').css("display","block");
    this.next = this.navigations.find('.mrNext');
    this.prev = this.navigations.find('.mrPrev');
    this.tempNext = this.next, this.tempPrev = this.prev;
    this.content = $('#questions');
    this.questions = this.content.find('div.questionContainer');
	//this.sharedContent = (navigator.onLine) ? "https://multimedia.kantaroperations.com/8016F8B/origin.tns-global.com/solutions/iatools/dev/" : $('#sharedContent').attr('src').replace(/\\/g, '/');
    this.sharedContent = $('#sharedContent').attr('src').replace(/\\/g, '/');
    this.imageCache = this.resolveImageCache().replace(/\\/g, '/'); //todo: check that this works with server locations \\konapmri033
    this.synch = "/synch/projects/" + projectName + "/";
    this.themePath = (typeof tJSON == 'undefined') ? this.sharedContent + "LAF/Themes/default/1.0/" : ((typeof tJSON.themeSource == 'undefined') ? this.sharedContent + "LAF/Themes" : ((tJSON.themeSource.toLowerCase().substring(0, 4) == 'http') ? "" : this.imageCache) + tJSON.themeSource) + "/" + tJSON.themeName + "/" + tJSON.themeVersion + "/";
    this.interviewer = (sampleSource == 'IPL01');
    this.TIB = null;
    this.loader = null;
    this.infoSource = $('#infoPanel');
    this.footer1 = $('.footer1'), this.footer2 = $('.footer2');
    this.allInputs = $([]), this.img = $('img'), this.table = $("table");
    this.deviceType = (typeof deviceType != 'undefined' ? deviceType : "UNKNOWN").toUpperCase();
    this.showonly = ($('input[type=hidden][name=I\\.ShowOnly]').length > 0);
	this.answerTypes = 0;
}

layout.prototype = {
    init: function() {

        this.secure();
        this.setupNavs();
        this.createLoader();
        this.updateMenu();
        this.moveErrors();
        this.addAttributes();
        this.v3Styles();
        this.applyThemes();
        if (isRTL) {
            this.applyRTLStyle();
        }
        this.TIB = new testPanel(isTest);
        var imagesLoaded = this.preloadImages();
        var that = this;
        $.when(imagesLoaded).always(function() {
            that.evaluateScripts(preloadScript, that.build, that);
        })


    },
    secure: function() {
        if (isTest) return;
        if (typeof isDebug != 'undefined')
            if (parseInt(isDebug, 10) > 0) return;
        document.oncontextmenu = function() {
            return false
        };
        var body = $('body');
        body.addClass("noselect");
        body.prop('unselectable', 'on');
        if (typeof document.onselectstart != "undefined") {
            document.onselectstart = function(e) {
                var evt = (evt) ? evt : ((window.event) ? event : null);
                if (evt) {
                    var target = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
                    if (target) {
                        switch (target.tagName.toLowerCase()) {
                            case "input":
                            case "textarea":
                            case "select":
                                return true;
                            default:
                                return false;
                        }
                    }
                }
                return false;
            }
        }
    },
    lazyLoad: function(dependencies, callback, context) {
        var defer = [];
        while (dependencies.length > 0) {
            var objDepend = dependencies.shift();
            objDepend.url = this.resolveFilePath(objDepend.url);
            if (typeof engVersion != "undefined")
                objDepend.url = objDepend.url + ((objDepend.url.indexOf("?") == -1) ? "?" : "&") + 'p=' + projectName + '&rid=' + serial + '&SE=' + engVersion + '&deviceType=' + this.deviceType.toUpperCase();
            if (objDepend.type == "script") {
                defer.push(
                    jQuery.ajax({
                        type: "GET",
                        context: this,
                        url: objDepend.url,
                        error: function() {
                            console.log("error loading: " + objDepend.url)
                        },
                        dataType: objDepend.type,
                        cache: true,
                        crossDomain: true
                    })
                );
            } else if (objDepend.type == "stylesheet") {
                $("head").append("<link>");
                var css = $("head").children(":last");
                css.attr({
                    rel: "stylesheet",
                    type: "text/css",
                    href: objDepend.url
                });
            }
        }
        $.when.apply(context, defer).always(function() {
            callback.apply(context)
        });
    },
    resolveFilePath: function(stringVal) {
        stringVal = stringVal.replace(/\[%ImageCacheBase%\]/gi, pageLayout.imageCache);
        stringVal = stringVal.replace(/\[%SharedContentBase%\]/gi, pageLayout.sharedContent);
        stringVal = stringVal.replace(/\[%synchBase%\]/gi, pageLayout.synch);
        return stringVal;
    },
    updateMenu: function() {
        if (this.menu.find('.help').attr("href") == "") {
            $('.tempHelp').remove();
        }
        if (this.menu.find('.privacy').attr("href") == "") {
            $('.tempPrivacy').remove();
        }
        var subMenus = this.menu.find('a');
        if (subMenus.length > 0) {
            $('.tempMenuButtons').show();
            if ($('.tempHelp').length > 0) {
                $(".tempHelp").click(function() {
                    window.open($(".help").attr('href'), '_blank');
                });
            }
            if ($('.tempPrivacy').length > 0) {
                $(".tempPrivacy").click(function() {
                    window.open($(".privacy").attr('href'), '_blank');
                });
            }
        }
    },
    menuClick: function() {
        var that = this.menu;
        this.menu.addClass('hand');
        var ulmenu = this.menu.find('ul');
        if (deviceType != "PC") {
            ulmenu.insertBefore($('#survey'));
        }
        this.menu.click(function() {
            ulmenu.slideToggle(400);
        });
    },
    moveErrors: function() {
        var errors = $('.mrErrorText');
        errors.each(function() {
            var jThis = $(this);
            var qText = null;
            var parent = jThis.parent();
            var isParentDIV = (parent[0].nodeName == "DIV");
            var qContainer = (isParentDIV) ? parent.parent() : parent.closest('tr');
            qText = qContainer.find('.mrQuestionText:first');
            if (qText) {
                jThis.append($("<br>"));
                qText.prepend(jThis);
                if (isParentDIV) parent.remove();
            }
        });
    },
    setupNavs: function() {
        this.next.attr('value', "");
        this.prev.attr('value', "");
        if (this.next.length > 0 && this.prev.length > 0) {
            this.next.css('width', '50%');
            this.prev.css('width', '50%');
        }
    },
    createLoader: function() {
        this.loader = $('<div id="loader"><div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div>');
        this.content.after(this.loader);
        this.showLoader();
    },
    showLoader: function() {
        this.content.hide();
        this.footer1.hide();
        this.loader.show();
    },
    hideLoader: function() {
        this.loader.hide();
        this.content.show();
        this.footer1.show();
    },
    build: function() {
        //customButtons.init();
        this.convertEndLink('mrEndLink');
        this.evaluateScripts(loadScript, this.render, this);
    },
    render: function() {

        this.setCursorInOpens();
        this.TIB.init();
        this.hideLoader();
        console.log("page ready");
		
    },
    preloadImages: function() {
        var defer = new $.Deferred();
        var images = pageLayout.getDocumentImages();
        var promises = [];
        var failedImages = [];
        $(images).each(function() {
            var deferImage = new $.Deferred();
            var image = document.createElement('img');
            image.onload = function() {
                deferImage.resolve();
            };
            image.onerror = function() {
                failedImages.push(this.src);
                deferImage.resolve();
            };
            image.onabort = function() {
                deferImage.resolve();
            };
            image.src = this;

            promises.push(deferImage.promise());
        });
        $.when.apply(this, promises).then(function() {
            if (failedImages.length > 0) pageLayout.infoSource.append($('<div>').attr('id', 'imageErrorsURLs').text(failedImages.toString()));
            defer.resolve();
        });
        return defer.promise();
    },
    getDocumentImages: function() {
        var images = [];
        $(document.images).each(function(i, e) {
            if (this.src != '')
                if (this.src.indexOf("aspx?") != -1 || this.src.indexOf("?") == -1)
                    if (this.src.indexOf(".swf") == -1 && this.src.indexOf("#") == -1) {
                        images.push(this.src);
                    }
        });
        return images;
    },
    evaluateScripts: function(scripts, callback, context) {
        var promises = [];
        console.log(scripts);
        while (scripts.length > 0) {
            var theScript = scripts.shift();

            if (typeof theScript == "function") {
                console.log('Executing function');
                promises.push(theScript());
            } else {
                console.log('Executing ' + theScript);
                promises.push(eval(theScript));
            }
        }
        $.when.apply(this, promises).always(function() {
            callback.apply(context)
        });
    },
    resolveImageCache: function() {
        var imageCacheArray, tempICBase;
        if (typeof imageCacheBaseString == 'undefined') return "";
        tempICBase = imageCacheBaseString; //by deafult they are the same UNLESS multiple questions on page
        tempICBase = tempICBase.replace(/-- unknown ----- unknown --\//, ""); //fix es-us language issue
        tempICBase = tempICBase.replace(/&amp;/g, "&"); //update escaped & to be actual character, needed for chrome/opera/safari

        if (tempICBase.charAt(1) == ':') { //loaded from a mapped drive letter
            imageCacheArray = tempICBase.split("/" + tempICBase.substr(0, 2))
            if (imageCacheArray.length > 1)
                tempICBase = imageCacheArray[0] + "/";
            return tempICBase;
        }
        if (tempICBase.indexOf("http://") == 0) { //loaded with an http:// reference
            imageCacheArray = tempICBase.split("http://")
            if (imageCacheArray.length > 1)
                tempICBase = "http://" + imageCacheArray[1];
            return tempICBase;
        }

        if (tempICBase.indexOf("\\\\") == 0) { //loaded from a sever share
            imageCacheArray = tempICBase.split("\\\\");
            if (imageCacheArray.length > 1) tempICBase = "\\\\" + imageCacheArray[1];
            return tempICBase;
        }

        if (tempICBase.indexOf("//") > 0) {
            imageCacheArray = tempICBase.split("//");
            tempICBase = imageCacheArray[0] + "/";
            return tempICBase;
        }
        return tempICBase;
    },
    addAttributes: function() {
        var that = this;
        this.createQuestionContainers();
        this.questions = $('.questionContainer');
        this.questions.each(function(i, e) {
            var container = $(this);
            var subContainers = container.find('.questionContainer');
            var hasOther = false;
            for (var z = 0; z < subContainers.length; z++) {
                var subInputs = subContainers.eq(z).find(':input, textarea');
                if (subInputs.length > 0) {
                    firstInputID = subInputs.eq(0).attr('id');
                    if (firstInputID.indexOf("_O") != -1) {
                        hasOther = true;
                        break;
                    }
                }
            }
            if (subContainers.length > 0 && !hasOther) return;
            var qName = null;
            var isGrid = false;
            var inputs = null;
            inputs = container.find(':input');
            inputs.each(function(i, b) {
                var jInput = $(this);
                qName = that.processInputAttributes(jInput, inputs, that);
                if (i == 0) {
                    isGrid = that.isGridInput(jInput);
                    that.setQuestionName(container, qName, isGrid);
                }
            });
            that.allInputs = that.allInputs.add(inputs);
        });
        this.questions.each(function() {
            var jThis = $(this);
            if (!jThis.attr("questionname")) {
                var nameArray = jThis.find('.questionContainer').eq(0).attr('questionname');
                if (nameArray == null) return;
                nameArray = nameArray.split('.');
                jThis.attr('questionname', nameArray.slice(0, nameArray.length - 1).join('.'));
            }
            jThis.find('[otherid]:not([otherid=""])').parent().find('input[type="text"]').attr('otherinput', 'true');
        });
       var page = this.content.children('.mrQuestionText');
        if (page.length == 0) return;
        var childName = page.siblings('.questionContainer').eq(0).attr("questionname");

        if (childName) {
            var nameArray = childName.split(".");
            var blockName = nameArray.slice(0, nameArray.length - 1).join('.');
            var innerQ = page.siblings('.questionContainer[questionname^="' + blockName + '."]');
            if (innerQ.length > 0) {
				$("#questions").contents().wrapAll("<div class='questionContainer' questionname='"+blockName+"'></div>");
              /*  var newQC = $('<div>').addClass('questionContainer').attr('questionname', blockName);
                page.before(newQC);
                newQC.append(page).append(innerQ);
                this.questions = this.questions.add(newQC);*/
            }
        }

    },
    isGridInput: function(jInput) {
        var inputType = jInput[0].nodeName.toLowerCase();
        if (inputType == 'input') inputType = jInput.attr('type').toLowerCase();
        var labelMatch = 'label[for=' + jInput.attr('id') + ']';
        switch (inputType) {
            case "radio":
            case "checkbox":
                var label = jInput.parent().find(labelMatch);
                if (label.length > 0) return false; //grid standard inputs don't have labels
                var id = jInput.attr('id');
                if (id.indexOf("_F") == -1) return true; //if input not a code and no label it is a grid
                var codeParent = jInput.parent().parent();
                if (codeParent[0].nodeName.toLowerCase() == "td") return true; //if code and its container is cell it is a grid
                return false; //get here all grid tests fail
            case "text":
            case "textarea":
                var parentTable = jInput.closest('table');
                if (parentTable.length == 0) return false; //no containing table, no grid
                if (parentTable.find(labelMatch).length == 0) return true; //if no label of text, its a grid
                return false;
            case "option":
            case "select":
                var parent = jInput.parent();
                if (parent[0].nodeName.toLowerCase() == "td") return true; //assuming if parent is td then grid
                return false; //get here, no grid
        }
        return false;
    },
    createQuestionContainers: function() {
        this.questions.find('span > .mrQuestionText').parent().addClass('questionContainer');
        this.questions.find('span > label > .mrQuestionText').parent().parent().addClass('questionContainer');
    },
    processInputAttributes: function(jInput, inputs, that) {
        var isCat, isCode, isOth, type, qName;
        var jID = jInput.attr("id");
        if (typeof jID === "undefined") return qName = "";
        isCat = (jID.indexOf("_C") > 0);
        jInput.attr("openendid", "");
        jInput.attr("iscode", "");
        jInput.attr("otherid", "");
        jInput.attr("isexclusive", that.isExclusive(jInput.attr("value"))); //determine if exclusive

        if (isCat) type = "_C";
        if (!isCat) {
            isCode = (jID.indexOf("_X") > 0);
            isOth = (jID.indexOf("_O") > 0);
            if (isCode) type = "_X";
            if (isOth) type = "_O";
            if (isCode) {
                jInput.attr("openendid", jID.split("_X")[0]); //set otherid to other (text box) question ID if exists
                jInput.attr("iscode", true); //set flag if code category
            }
            if (isOth) {
                var othCat = inputs.filter("input[id='" + jID.replace(type, "_C") + "']");
                othCat.attr("otherid", jID);
            }
        }
        qName = that.resolveHTMLValueToMDDName(jInput.attr("name"), type);
        jInput.attr("questionname", qName); //set questionname attribute for grouping later
        return qName;
    },
    setQuestionName: function(container, qName, isGrid) {
        if (isGrid) {
            var nameArray = qName.split('.');
            qName = nameArray.slice(0, nameArray.length - 2).join('.');
        }
        container.attr("questionname", qName);
        nameArray = qName.split('.');
        return nameArray.slice(0, nameArray.length - 1).join('.');
    },
    isExclusive: function(name) {
        if (name == null) return false; //no name no exclusive
        name = name.toUpperCase(); //remove case sensitivity
        name = this.resolveHTMLValueToMDDName(name); //remove special SPSS formatting
        return (name == "NA" || name == "REF" || name == "DK" || name == "NONE" || name == "DONTKNOW" || name.charAt(name.length - 1) == "@"); //check against standard names
    },
    resolveHTMLValueToMDDName: function(htmlName, delimiter) {
        //http://pic.dhe.ibm.com/infocenter/spssdc/v6r0m1/topic/com.spss.ddl/mrscriptbasic_langref_namingconventions.htm
        //http://pic.dhe.ibm.com/infocenter/spssdc/v6r0m1/topic/com.spss.ddl/mrintover_html_player_elements.htm
        htmlName = htmlName.replace(/__/g, "~"); //replace __ with ~.  __ represents _ in any name (used so flags below could be used with an underscore without confusion). Replacing with ~ to remove _ from name so other replacements can be done.
        htmlName = htmlName.replace(/_D/g, "@"); //replace _D with @ (@ is used to denote exclusive mention)
        htmlName = htmlName.replace(/_H/g, "#"); //replace _D with @ (@ is used to denote exclusive mention)
        htmlName = htmlName.replace(/_S/g, "."); //replace _S with a dot (used when namespacing)
        htmlName = htmlName.replace(/^\s+|\s+$/g, ''); //trim string of leading and trailing spaces
        if (delimiter == "_O") htmlName = htmlName.replace(delimiter, '.'); //trim string of leading and trailing spaces
        if (htmlName.indexOf("_Q") == 0) htmlName = htmlName.replace(/_Q/g, ".").substr(1);
        if (delimiter) htmlName = htmlName.split(delimiter)[0];
        return htmlName.replace(/~/g, "_");
    },
    convertEndLink: function(id) {
        var endLink = $('#' + id);
        if (endLink.length == 0) return;
        var href = endLink.attr("href")
        var arrUrl = [href.substring(0, href.indexOf("?", 0)), href.substring(href.indexOf("?", 0) + 1, href.length)];
        endLink.addClass('none');

        var hasNavs = (this.footer1.find('input').length > 0)
        if (hasNavs) {
            this.content.children().addClass('none');
            $('.endText').parent().removeClass('none');
        } else {
            $('input').filter(':hidden').remove();
            this.form.attr('action', arrUrl[0]);
            this.form.attr('method', "get");
        }

        this.TIB.createPassback(href);

        if (arrUrl.length > 1) {
            var urlParams = arrUrl[1].split('&');
            for (var i = 0; i < urlParams.length; i++) {
                var nameValue = urlParams[i].split('=');
                this.TIB.addPassbackRow(nameValue);
                var inputTag = "<input type='hidden' name='" + nameValue[0] + "' value='" + unescape(nameValue[1]) + "' />";
                if (!hasNavs) this.form.append(inputTag);
            }
        }

        var mrButtonText = endLink.text();
        if (mrButtonText == '') mrButtonText = "Submit"
        var submitButton = "<input type='submit' id='endLinkButton' class='btn theme-bg-color theme-standard-font-color3' value='" + mrButtonText + "' />";
        submitButton = endLink.after(submitButton).next()
        if (!hasNavs)
            this.next = submitButton;
        else
            submitButton.prop('disabled', true);
		
		submitButton.parent().parent().css("padding","32px");
    },
    setCursorInOpens: function() {
        if (cursorInOpens != 1) return;
        var textInputs = this.allInputs.filter('.mrEdit').filter(':visible');
        if (textInputs.length == 0) return;
        for (var i = 0; i < textInputs.length; i++) {
            var jInput = textInputs.eq(i); //get jquery object
            if (!jInput.attr("disabled")) { //make sure its not disabled
                if (jInput.attr("id").indexOf("_O") == -1) { //make sure not an other specify
                    try { //just in case an error is thrown
                        jInput.focus(); //try to add focus
                        window.scrollTo(0, 0); //scroll to top just in case text area is off screen
                    } catch (err) {
                        //die gracefully
                    }
                    return;
                }
            }
        }

    },
    /**
     * Gets the height of arbitrary text
     * @param {string} - Text value
     * @returns {integer} height
     */
    textHeight: function(value) {
        var html_calc = $('<span>' + $(value).html() + '</span>');
        html_calc.css('font-size', $(value).css('font-size')).hide();
        html_calc.prependTo('body');
        var height = html_calc.height();
        html_calc.remove();
        return height;
    },
    /**
     * Gets the width of arbitrary text
     * @param {string} - Text value
     * @returns {integer} height
     */
    textWidth: function(value) {
        var html_calc = $('<span>' + $(value).html() + '</span>');
        html_calc.css('font-size', $(value).css('font-size')).hide();
        html_calc.prependTo('body');
        var width = html_calc.width();
        html_calc.remove();
        return width;
    },
    /**
     * Gets the size of an image
     * @param {string} - Image src location
     * @returns {{width: number, height: number}}
     */
    imgSize: function(img) {
        var $img = $(img);
        if (typeof $img.attr('src') == 'undefined') return {
            'width': 0,
            'height': 0
        }
        if ($img.prop('naturalWidth') == undefined) {
            var $tmpImg = $('<img/>').attr('src', $img.attr('src'));
            $img.prop('naturalWidth', $tmpImg[0].width);
            $img.prop('naturalHeight', $tmpImg[0].height);
        }
        return {
            'width': $img.prop('naturalWidth'),
            'height': $img.prop('naturalHeight')
        }
    },
    /**
     * Gets image dimensions
     * @param imgsrc
     * @param usezoom
     * @param zoomscale
     * @param defwidth
     * @param defheight
     * @returns {{width: number, height: number}}
     */
    imageDimensions: function(imgsrc, usezoom, zoomscale, defwidth, defheight) {
        var w = 0,
            h = 0;
        var imgsz = pageLayout.imgSize(imgsrc); // get the native image size.

        if (usezoom) { // Check for zoomscale first.
            if (zoomscale !== null && !isNaN(zoomscale)) {
                w = imgsz.width * zoomscale;
                h = imgsz.height * zoomscale;
            } else {
                w = imgsz.width * surveyPage.options.zoomScale;
                h = imgsz.height * surveyPage.options.zoomScale;
            }
        } else { // If zoom isn't used then check defaultt nwidth/height - if not, the native image size is used.
            w = (defwidth != null && !isNaN(defwidth)) ? defwidth : w;
            h = (defheight != null && !isNaN(defheight)) ? defheight : h;
        }
        w = ((w <= 0) ? imgsz.width : w);
        h = ((h <= 0) ? imgsz.height : h);
        return {
            'width': w,
            'height': h
        };
    },
    v3Styles: function() {
        if (isstudio) {
			this.next.css("background", "url("+this.themePath + "images/Next.png) no-repeat center").css("background-size","46px 46px");
			this.prev.css("background", "url("+this.themePath + "images/Prev.png) no-repeat center").css("background-size","46px 46px");
			if (isRTL) {
				this.next.css("background", "url("+this.themePath + "images/Prev.png) no-repeat center").css("background-size","46px 46px");
				this.prev.css("background", "url("+this.themePath + "images/Next.png) no-repeat center").css("background-size","46px 46px");
			}
        }
		this.prev.attr("tabindex", "1");
        //MDB form styles
        this.img.addClass("img-responsive img-fluid waves-effect waves-light");
        this.allInputs.not("select").addClass("form-control");

        this.table.addClass("table table-bordered");

        this.allInputs.filter('select').css("display","block");
        this.allInputs.filter('textarea').attr("type", "text").attr("rows", "2").addClass("md-textarea");
        this.allInputs.filter('textarea').autogrow();

        this.allInputs.filter("input[type=radio]").addClass("with-gap");
        this.table.css("display", "table");
        this.table.find(".mrGridQuestionText, .mrGridCategoryText").css("width", "");


        this.footer1.addClass("z-depth-1");
        this.footer2.addClass("z-depth-1");
		
		//Stop submit on openend submit
		$('input[type=text], input[type=password], input[type=email], input[type=url], input[type=time], input[type=date], input[type=datetime-local], input[type=tel], input[type=number], input[type=search-md]').on('keydown', function(event) {
			if (event.keyCode == 13) {
				event.preventDefault();
				event.stopImmediatePropagation();
				event.stopPropagation();
				return false;
			}
		});
		
		

        //Question deviders question text and question component
        var blockQuestionsCount = $('div.questionContainer').find('div.questionContainer').length;
        if (blockQuestionsCount > 0) {
            // This code for Block question
			$('head').append("<style>[id^='container_'] {min-height: 0rem !important;}.question-component {min-height: 0rem;}<\/style>");
			
            $('div.questionContainer:eq(0) > .mrQuestionText').wrap('<div class="col-sm-12 question-text z-depth-1" style="margin-bottom: 1px;"></div>');
            questionsContainers = $('div.questionContainer > div.questionContainer');

            // Grouping first 4 elements as Question text elements and applying classes
            questionsContainers.each(function() {
                //Question text
                var a = $(this).children();
                for (var i = 0; i < 4; i += 4) {
                    a.slice(i, i + 4).wrapAll('<div class="col-sm-12 question-text z-depth-1"></div>');
                }
                //Question component
                for (var i = 4; i < a.length; i += a.length) {
                    a.slice(i, i + a.length).wrapAll('<div class="col-sm-12 question-component z-depth-1"></div>');
                }

                var questionFullName = $(this).attr('questionname');
				if(typeof questionFullName != "undefined"){
					var questionNameArray = questionFullName.split(".");
					if (questionNameArray.length > 1) {
						$(this).after('<div id="container_' + questionNameArray[1] + '" class="col-sm-12"></div>');
					} else {
						$(this).after('<div id="container_' + questionFullName + '" class="col-sm-12"></div>');
					}
					$(this).after('<div id="container_' + questionFullName + '" class="col-sm-12"></div>');
				}
            });
        } else {
            questionsContainers = $('div.questionContainer');
			var pageQuestionsCount  = $('div.questionContainer').length;
			if(pageQuestionsCount > 1){
				$('head').append("<style>[id^='container_'] {min-height: 0rem !important;}.question-component {min-height: 0rem;}<\/style>");
			}else{				 
				 setTimeout(function(){ 
					$('[id^="container_"]').each(function(index) {
						if ($.trim($(this).html()) != '') {
							$('head').append("<style>[id^='container_']{min-height: 15rem;}<\/style>");
						}
					});
				}, 500);
				if(window.orientation == "90" || window.orientation == "-90"){
					$('head').append("<style>.question-component {min-height: 7.5rem;}<\/style>");
					if (typeof qJSON != 'undefined'){
						if ((typeof qJSON[0].CustomProps.metaType != 'undefined' || typeof qJSON[0].CustomProps.flaMetaType != 'undefined') && $.trim($("[id^='container_']").html()) != "") {
							$('head').append("<style>[id^='container_']{min-height: 7.5rem;}<\/style>");
						}
					}
				}
				window.addEventListener("orientationchange", function() {
					if(window.orientation == "90" || window.orientation == "-90"){
						$('head').append("<style>.question-component {min-height: 7.5rem;}<\/style>");
						if (typeof qJSON != 'undefined'){
							if ((typeof qJSON[0].CustomProps.metaType != 'undefined' || typeof qJSON[0].CustomProps.flaMetaType != 'undefined') && $.trim($("[id^='container_']").html()) != "") {
								$('head').append("<style>[id^='container_']{min-height: 7.5rem;}<\/style>");
							}
						}
					}else{
						$('head').append("<style>.question-component {min-height: 15rem;}<\/style>");
						if (typeof qJSON != 'undefined'){
							if ((typeof qJSON[0].CustomProps.metaType != 'undefined' || typeof qJSON[0].CustomProps.flaMetaType != 'undefined') && $.trim($("[id^='container_']").html()) != "") {
								$('head').append("<style>[id^='container_']{min-height: 15rem;}<\/style>");
							}
						}
					}
				});
			 }
            // Grouping first 4 elements as Question text elements and applying classes
            questionsContainers.each(function() {
                //Question text
                var a = $(this).children();
                for (var i = 0; i < 4; i += 4) {
                    a.slice(i, i + 4).wrapAll('<div class="col-sm-12 question-text z-depth-1"></div>');
                }
                //Question component
                for (var i = 4; i < a.length; i += a.length) {
                    a.slice(i, i + a.length).wrapAll('<div class="col-sm-12 question-component z-depth-1"></div>');
                }

                var questionName = $(this).attr('questionname');
                $(this).after('<div id="container_' + questionName + '" class="col-sm-12"></div>');
            });
        }

        var vc = 0;
        $('input[iscode="true"]').each(function() {
            $(this).next('label').andSelf().wrapAll('<span id="Cell.0.' + vc + '" style=""></span>');
            vc++;
        });


        //Table styles
        this.table.find("tbody tr td").each(function() {
            var inputID = $(this).find('input').attr('id');
            $(this).append("<label for='" + inputID + "'></label>");
        });
		
		

        var multicolumn = false; var dynamicgrid = false;
        if (typeof qJSON != 'undefined') {
            $.each(qJSON, function(index, json) {
                if (typeof json.CustomProps.metaType != 'undefined'||typeof json.CustomProps.flaMetaType != 'undefined') {
                    if (typeof json.CustomProps.metaType != 'undefined')
					 var metaTypeArray = (json.CustomProps.metaType.toLowerCase()).split(",");
					else if (typeof json.CustomProps.flaMetaType != 'undefined')
					 var metaTypeArray = (json.CustomProps.flaMetaType.toLowerCase()).split(",");
					
                    for (var j = 0; j < metaTypeArray.length; j++) {
                        if (metaTypeArray[j] == 'multicolumn') {
                            multicolumn = true;
                        }
						
						if (metaTypeArray[j] == 'dynamicgrid') {
                            dynamicgrid = true;
                        }
                    }
                }
            });
        }

        if (!multicolumn) {
            this.defaultCategoricalRules();
        }
		
		/* This login is for dynamicgrid navigation buttons*/
		if (typeof engVersion != 'undefined' && (engVersion==3.0 || engVersion==3.1)  && dynamicgrid) {

		   $("#surveyButtons").html('<div class="previousNavButton text-xs-center"><a class="tempPrev"><i class="fa fa-chevron-left fa-1x"></i></a><input type="submit" name="_NPrev" class="mrPrev hidden" style="" value="Previous" alt="Previous"></div><div class="nextNavButton text-xs-center"><a class="tempNext"><i class="fa fa-chevron-right fa-1x"></i></a><input type="submit" name="_NNext" class="mrNext hidden" style="" value="Next" alt="Next"></div>');
			
			this.next = $('.mrNext'); this.prev = $('.mrPrev'); this.tempNext = $(".tempNext"), this.tempPrev = $(".tempPrev")
			$(".nextNavButton").addClass("theme-bg-color");
			$(".previousNavButton ").addClass("theme-standard-bg-color2 theme-standard-font-color1");
			var footerNavNext = $(".nextNavButton").find("a");
			footerNavNext.addClass("theme-standard-font-color3 hoverable");
			footerNavNext.hover(function() {
				$(this).removeClass("theme-standard-font-color3").addClass("theme-standard-font-color1");
			}, function() {
				$(this).removeClass("theme-standard-font-color1").addClass("theme-standard-font-color3");
			});

			var footerNavPrev = $(".previousNavButton").find("a");
			footerNavPrev.addClass("theme-standard-font-color1 hoverable");
			this.tempNext.click(function() {
                pageLayout.next.click()
            });
			this.tempPrev.click(function() {
                pageLayout.prev.click()
            });
			
        }
		/* CLOSE dynamicgrid navigation buttons logic*/



        var questions = this.questions;
		
        //Grid headers question error issue

        $('table tbody tr').each(function() {
            $errorSpan = $(this).find('td[rowspan][id^="Cell.0."] .mrQuestionText .mrErrorText').clone();
            $errorSpanLength = $(this).find('td[rowspan][id^="Cell.0."] .mrQuestionText .mrErrorText').length;
            if ($errorSpanLength > 0) {
                $(this).find('td[rowspan][id^="Cell.0."] .mrQuestionText .mrErrorText').remove();
                $(this).find('td[id^="Cell.1."] .mrQuestionText').prepend($errorSpan);
            }
        });

        $("td[id^='Cell.']").on('click', function(e) {
            if (($(this).find('input[iscode="true"]')).length < 1) {
                var checkbox = $(this).find("input[type='checkbox'][otherid='']");
                checkbox.prop("checked", !checkbox.prop("checked"));

                var radio = $(this).find("input[type='radio'][otherid='']");
                radio.prop("checked", true);

                var questionname = checkbox.attr('questionname');
                var isexclusive = checkbox.attr('isexclusive');
                // DK, None of these			
                if (isexclusive == "true") {
                    console.log('checkbox - isexclusive');
                    questions.find('input[type="checkbox"][questionname="' + questionname + '"]:not([isexclusive="true"])').attr('checked', false);
                    questions.find('input[type="checkbox"][questionname="' + questionname + '"]:not([isexclusive="true"])').prop('checked', false);
                    questions.find('input[type="text"][otherinput="true"]').val('');
                } else {
                    questions.find('input[type="checkbox"][questionname="' + questionname + '"][isexclusive="true"]').attr('checked', false);
                    questions.find('input[type="checkbox"][questionname="' + questionname + '"][isexclusive="true"]').prop('checked', false);
                }
            }
        });



        questions.find("input[type='radio']").change(function() {
            var questionname = $(this).attr('questionname');
			
            var otherid = $(this).attr('otherid');
            if (otherid == "") {
                questions.find('input[type="text"][questionname^="' + questionname + '"][otherinput="true"]').val('');
            }

        });

        questions.find("input[type='checkbox']").change(function() {
            //console.log('checkbox');
            var questionname = $(this).attr('questionname');
            var isexclusive = $(this).attr('isexclusive');
            // DK, None of these			
            if (isexclusive == "true") {
                questions.find('input[type="checkbox"][questionname="' + questionname + '"]:not([isexclusive="true"])').attr('checked', false);
                questions.find('input[type="checkbox"][questionname="' + questionname + '"]:not([isexclusive="true"])').prop('checked', false);
                questions.find('input[type="text"][otherinput="true"]').val('');
            } else {
                questions.find('input[type="checkbox"][questionname="' + questionname + '"][isexclusive="true"]').attr('checked', false);
                questions.find('input[type="checkbox"][questionname="' + questionname + '"][isexclusive="true"]').prop('checked', false);
            }
        });


        //Other question logic

        $("input[type='text'][otherinput='true']").keyup(function() {
            var inputlen = $(this).val();
            var otherid = $(this).attr('id');
            var questionNameArray = $(this).attr('questionname').split(".");
            questionNameArray.pop();
            var questionName = questionNameArray.join('.');
            if (inputlen.length > 0) {
                $("input[questionname='" + questionName + "'][otherid='" + otherid + "']").prop('checked', true);
                $("input[questionname='" + questionName + "'][otherid='" + otherid + "']").attr('checked', true);
                $("input[questionname='" + questionName + "'][isexclusive='true']").prop('checked', false);
                $("input[questionname='" + questionName + "'][isexclusive='true']").attr('checked', false);
            } else {
                $("input[questionname='" + questionName + "'][otherid='" + otherid + "']").prop('checked', false);
                $("input[questionname='" + questionName + "'][otherid='" + otherid + "']").attr('checked', false);
            }
        });


        var blockQuestionsCount = $('div.questionContainer').find('div.questionContainer').length;
        if (blockQuestionsCount > 0) {
            eachQuestion = $('div.questionContainer > div.questionContainer');
        } else {
            eachQuestion = $('div.questionContainer');
        }

        eachQuestion.each(function() {

            //Inputs placeholders
            var ph = $(this).find(".mrQuestionText span[ph]").attr('ph');
            if (typeof ph != "undefined") {
                $(this).find("input[type=date], input[type=datetime-local], input[type=email], input[type=number], input[type=password], input[type=search-md], input[type=tel], input[type=text]:not(input[type='text'][otherinput='true']), input[type=time], input[type=url], textarea.md-textarea").each(function() {
                    $(this).attr("placeholder", ph);
                });
            }

            //Inputs MD inside labels
            var ilabel = $(this).find(".mrQuestionText span[ilabel]").attr('ilabel');
            if (typeof ilabel != "undefined") {
                $(this).find("input[type=date], input[type=datetime-local], input[type=email], input[type=number], input[type=password], input[type=search-md], input[type=tel], input[type=text]:not(input[type='text'][otherinput='true']), input[type=time], input[type=url], textarea.md-textarea").each(function() {
                    $(this).wrap('<div class="md-form"></div>');
                    $(this).after("<label for='" + $(this).attr('id') + "'>" + ilabel + "</label>");
                });
            }

            // numerickeypad layout feature
            var numerickeypad = $(this).find(".mrQuestionText span[numerickeypad]").attr('numerickeypad');
            if (numerickeypad == 'true' && (pageLayout.deviceType == "LARGETABLET" || pageLayout.deviceType == "MEDIUMTABLET" || pageLayout.deviceType == "SMALLTABLET" || pageLayout.deviceType == "SMARTPHONETOUCH")) {
				$("form").attr("novalidate", "true");
                $(this).find("input[type='text']").attr("type", "number");
            }

        });
		
		//Empty question text remove grey bar
		$(".mrQuestionText").each(function() {
			if($(this).is(':empty') || $.trim( $(this).text()) == null || $.trim( $(this).text()) == ""){
				$(this).closest('.question-text').hide().addClass('no-question-text');
				$(this).closest('.question-text').next().removeClass( "z-depth-1" );
				$(this).closest('.questionContainer').prevUntil('.questionContainer').prev().find('.question-component').removeClass( "z-depth-1" );
			}
		});
		
		
		//Fixed question  
		if($('.sticky').length > 0){
			var stickyOffset = $('.sticky').closest('.question-text').offset().top;

			$(window).scroll(function(){
			  var sticky = $('.sticky').closest('.question-text'),
				  scroll = $(window).scrollTop();

			  if (scroll > stickyOffset) sticky.addClass('fixed');
			  else sticky.removeClass('fixed');
			});
		}

        // Image zoom code for Global level

        if ($(".imagezoom").length > 0) {
            $('form').after('<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button><button class="pswp__button pswp__button--share" title="Share"></button><button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button><button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>');

            $('.imagezoom').each(function() {
                $(this).css('position', 'relative').find('img').css({
                    'display': 'inline',
                    'margin': '15px 15px 0px 0px'
                }).after('<span class="imgZoom theme-font-color" style="position: absolute; right: 0px; cursor: pointer; padding: 2px;"><i class="fa fa-search-plus" aria-hidden="true"></i></span>');
            });

            // build items array
            var items = [];
            var that = this;

            $("body").on("click", ".imgZoom, .imagezoom", function(e) {
                e.stopPropagation();
                e.preventDefault();
                items = [];
                items.length = 0;
                var img = new Image();
                img.src = $(this).parent().find("img").attr('src');
                items.push({
                    src: $(this).parent().find("img").attr('src'),
                    w: img.width,
                    h: img.height
                });
                var pswpElement = document.querySelectorAll('.pswp')[0];
                var options = {
                    history: false,
                    focus: false,
                    shareEl: false,
                    showAnimationDuration: 0,
                    hideAnimationDuration: 0
                };
                var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
                gallery.init();
            });
        }


        if ($("[data-toggle='popover']").length > 0) {
            $('[data-toggle="popover"]').html("").css({
                "display": "inline",
                "margin": "5px 10px"
            }).append('<i class="fa fa-info-circle fa-1x theme-font-color" aria-hidden="true"></i>');


            var cssPath = this.sharedContent + "LAF/Lib/css/1.0/jquery.webui-popover.min.css";

            var pLayout = this;

            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = cssPath;
            link.addEventListener('load', pLayout.postLoadCss);
            document.head.appendChild(link);

        }

        //Jagged hidden elements
        this.allInputs.each(function(index) {
            if (this.style.visibility == 'hidden') {
                $(this).next('label').css("visibility", "hidden");
            }
        });

    },
    applyThemes: function() {
		
        $(".question-text").addClass("theme-standard-bg-color2 theme-standard-font-color1");

        this.prev.addClass("theme-standard-bg-color2 theme-standard-font-color1 hoverable");

        this.next.addClass("theme-bg-color theme-standard-font-color3 hoverable");
        this.next.hover(function() {
            $(this).removeClass("theme-standard-font-color3").addClass("theme-standard-font-color1");
        }, function() {
            $(this).removeClass("theme-standard-font-color1").addClass("theme-standard-font-color3");
        });

        var footerMenuButton = this.footer2.find("a.menuButton, .tempMenuButtons .dropup .dropdown-menu a");
        footerMenuButton.addClass("theme-standard-font-color1");

        this.footer2.find("a.menuButton i").addClass("hoverable");
        this.footer2.find(" .tempMenuButtons .dropup .dropdown-menu a").addClass("hoverable");
    },
    postLoadCss: function() {
        var scriptPath = pageLayout.sharedContent + "LAF/Lib/js/1.0/jquery.webui-popover.min.js";
        var script = document.createElement('script');
        script.src = scriptPath;
        script.addEventListener('load', pageLayout.postLoadJS);
        document.head.appendChild(script);
    },
    postLoadJS: function() {

        $("[data-toggle='popover']").webuiPopover({content:'Content',type:'html',width:254});

        $("body").on("mousedown touchstart", "[data-toggle='popover']", function() {
            $(this).webuiPopover({content:'Content',type:'html',width:254});
        });
		window.addEventListener("resize", function() {
		  $("[data-toggle='popover']").webuiPopover('hide');
		}, false);
		

        /*
        Default options
        {
        	placement:'auto',//values: auto,top,right,bottom,left,top-right,top-left,bottom-right,bottom-left,auto-top,auto-right,auto-bottom,auto-left,horizontal,vertical
        	container: document.body,// The container in which the popover will be added (i.e. The parent scrolling area). May be a jquery object, a selector string or a HTML element. See https://jsfiddle.net/1x21rj9e/1/
        	width:'auto',//can be set with  number
        	height:'auto',//can be set with  number
        	trigger:'click',//values:  click,hover,manual(handle events by your self),sticky(always show after popover is created);
        	selector:false,// jQuery selector, if a selector is provided, popover objects will be delegated to the specified. 
        	style:'',// Not to be confused with inline `style=""`, adds a classname to the container for styling, prefixed by `webui-popover-`. Default '' (light theme), 'inverse' for dark theme
        	animation:null, //pop with animation,values: pop,fade (only take effect in the browser which support css3 transition)
        	delay: {//show and hide delay time of the popover, works only when trigger is 'hover',the value can be number or object
        		show: null,
        		hide: 300
        	},
        	async: {
        		type:'GET', // ajax request method type, default is GET
        		before: function(that, xhr) {},//executed before ajax request
        		success: function(that, data) {}//executed after successful ajax request
        		error: function(that, xhr, data) {} //executed after error ajax request
        	},
        	cache:true,//if cache is set to false,popover will destroy and recreate
        	multi:false,//allow other popovers in page at same time
        	arrow:true,//show arrow or not
        	title:'',//the popover title, if title is set to empty string,title bar will auto hide
        	content:'',//content of the popover,content can be function
        	closeable:false,//display close button or not
        	direction:'', // direction of the popover content default is ltr ,values:'rtl';
        	padding:true,//content padding
        	type:'html',//content type, values:'html','iframe','async'
        	url:'',//if type equals 'html', value should be jQuery selecor.  if type equels 'async' the plugin will load content by url.
        	backdrop:false,//if backdrop is set to true, popover will use backdrop on open
        	dismissible:true, // if popover can be dismissed by  outside click or escape key
        	autoHide:false, // automatic hide the popover by a specified timeout, the value must be false,or a number(1000 = 1s).
        	offsetTop:0,  // offset the top of the popover
        	offsetLeft:0,  // offset the left of the popover
        	onShow: function($element) {}, // callback after show
        	onHide: function($element) {}, // callback after hide
        }*/
    },
    defaultCategoricalRules: function() {
        //Categorical question
        var cells = this.questions.find("span[id^='Cell.']");
        if (cells.length == 1 || cells.length == 2) {
            cells.each(function() {
				$(this).attr("tabindex","0").on("keypress", function(e) {
					$(this).find("label").click();
				});
				if (detectIE()) {
					$(this).wrap('<div class="col-xs-12 col-border"></div>');
				}else{
					$(this).wrap('<div class="col-xs-12 col-border waves-effect waves-light"></div>');
				}
                //Other question style
                if ($(this).children('input').attr("otherid") != "") {
                    $(this).parent().removeClass("col-md-4 col-sm-6");
                    var otherText = ($(this).find('label').eq(0).text()).trim();
                    $(this).find('span').addClass('col-xs-12');
                    $(this).find('label').html("").attr('style', 'display: none !important;');
                    $(this).find('input[type="text"][otherinput="true"]').wrap('<div class="md-form"></div>');
                    var otherTextId = $(this).find('input[type="text"]').attr('id');
                    $(this).find('input[type="text"]').after("<label for='" + otherTextId + "'>" + otherText + "</label>");
                    $(this).find('.md-form label').attr('style', 'text-align:left;');
                }
                if ($(this).children('input').attr("isexclusive") == "true") {
                    $(this).parent().removeClass("col-md-4 col-sm-6");
                }
            });
        }
        if (cells.length > 2) {
            cells.each(function() {
				$(this).attr("tabindex","0").on("keypress", function(e) {
					$(this).find("label").click();
				});
				if (detectIE()) {
					$(this).wrap('<div class="col-md-4 col-sm-6 col-xs-12 col-border"></div>');
				}else{
					$(this).wrap('<div class="col-md-4 col-sm-6 col-xs-12 col-border waves-effect waves-light"></div>');
				}   
                //Other question style
                if ($(this).children('input').attr("otherid") != "") {
                    $(this).parent().removeClass("col-md-4 col-sm-6");
                    var otherText = ($(this).find('label').eq(0).text()).trim();
                    $(this).find('span').addClass('col-xs-12');
                    $(this).find('label').html("").attr('style', 'display: none !important;');
                    $(this).find('input[type="text"][otherinput="true"]').wrap('<div class="md-form"></div>');
                    var otherTextId = $(this).find('input[type="text"]').attr('id');
                    $(this).find('input[type="text"]').after("<label for='" + otherTextId + "'>" + otherText + "</label>");
                    $(this).find('.md-form label').attr('style', 'text-align:left;');
                }
                if ($(this).children('input').attr("isexclusive") == "true") {
                    $(this).parent().removeClass("col-md-4 col-sm-6");
                }
				//$(this).find("label span img").parent().addClass("catContent").contents().wrap('<div class="col-xs-12"></div>');
				//$(this).find("label span img").parent().addClass("catImg").next().addClass("catText");
				
            });

            var blockQuestionsCount = $('div.questionContainer').find('div.questionContainer').length;
            if (blockQuestionsCount > 0) {
                questionsContainers = $('div.questionContainer > div.questionContainer');
                questionsContainers.each(function() {
                    if (($(this).find('.col-border input[iscode="true"]')).length < 1) {
                        $(this).find(".col-border").wrapAll("<div class='flex-row row'></div>");
                    }
                });
            } else {
                questionsContainers = $('div.questionContainer');
                questionsContainers.each(function() {
                    if (($(this).find('.col-border input[iscode="true"]')).length < 1) {
                        $(this).find(".col-border").wrapAll("<div class='flex-row row'></div>");
                    }
                });
            }

            //this.questions.find(".col-border").wrapAll("<div class='flex-row row'></div>");
        }
    },
    applyRTLStyle: function() {
        $('.container').attr("dir", "rtl");
        this.prev.attr('value', "");
        this.next.attr('value', "");

        var temp1 = $(".tempMenuButtons").detach();
        temp1.insertAfter(".logo");
        $(".tempMenuButtons").removeClass("text-xs-left").addClass("text-xs-right");
        $(".dropdown-menu").removeClass(" dropdown-menu-left").addClass("dropdown-menu-right");
    }
}

/**
 * Any errors in with the Engine will be handled here
 */
function handleSurveyEngineError(error, callback) {
    $.event.trigger({
        type: 'SurveyEngineEvent',
        eventType: 'engine_error',
        message: 'There was an error: ' + error.message
    });
    var msg = engErrorMessage + "\n\nError message: " + error.message;
    var htmlMsg = "<p class='mrErrorText'><br/>" + msg.replace('\n', '<br/>') + "</p>";
    if (!revertToHTML) {
        $('form').hide();
        $('body').prepend(htmlMsg);
        alert(msg);
    } else {
        if (callback !== null) callback()
    }
    console.log(msg);
    return false;
}


// Textarea auto resize event
$.fn.autogrow = function() {
    return this.each(function() {
        var textarea = this;
        $.fn.autogrow.resize(textarea);
        $(textarea).focus(function() {
            textarea.interval = setInterval(function() {
                $.fn.autogrow.resize(textarea);
            }, 200);
        }).blur(function() {
            clearInterval(textarea.interval);
        });
    });
};
$.fn.autogrow.resize = function(textarea) {
    var lineHeight = parseInt($(textarea).css('line-height'), 8);
    var lines = textarea.value.split('\n');
    var columns = textarea.cols;
    var lineCount = 0;
    $.each(lines, function() {
        lineCount += Math.ceil(this.length / columns) || 1;
    });
    var height = lineHeight * (lineCount + 1);
    $(textarea).css('height', height);
};

// RTL Functions

function checkRTL(fileName) {
    var found = false;
    var headString = ($("head").html()).toString();
    var n = headString.search(fileName);
    if (0 < n) {
        found = true;
    }
    return found;
}




function loadModel(callback, context) {
    callback.apply(context)
    return
}

function detectIE() {
  var ua = window.navigator.userAgent;

  // Test values; Uncomment to check result …

  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

  // Edge 12 (Spartan)
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

  // Edge 13
  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}

var testPanel = function(tester) {
    this.isTest = tester;
    this.infoSource = pageLayout.infoSource;
    this.banner = $('<div>').attr("id", "testPanel").css('display', 'none');
    this.panelModal = $('<div class="modal fade" id="testModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">Interview Details</h4></div><div class="modal-body" id="modalBody"></div></div></div></div>');

    this.passback = null;
};
testPanel.prototype = {
    init: function() {
        loadModel(this.build, this);
    },
    build: function() {
        var that = this;
        if (this.isTest) this.show();
        var innerTest = $('<div>').attr("id", "innerTest").addClass("theme-bg-color ").text("Test - v" + projectVersion);
        this.banner.append(innerTest).appendTo("body");
        this.panelModal.appendTo("body")
        this.modal = $('#modalBody');
        this.modal.append(this.createProjectDetails());
        this.modal.append(this.infoSource.find('#passbackTable'));
        this.modal.append(this.processQuotas());
        this.modal.append(this.processImageErrors(innerTest));
        this.modal.append(this.processRoutingErrors(innerTest));
        var testTables = this.modal.find('.testTable');
        testTables.removeClass('none');
        this.rowHighlight(testTables.find('tr'));
        innerTest.click(function() {
            that.panelModal.modal('toggle')
        });
        if (innerTest.find('.errorCount').length)
            innerTest.removeClass('theme-bg-color').addClass('animated shake errorBackground');
    },
    hide: function() {
        this.banner.hide();
    },
    show: function() {
        this.banner.show();
    },
    rowHighlight: function(jRows) {
        jRows.hover(function() {
            $(this).addClass('rowHighlight')
        }, function() {
            $(this).removeClass('rowHighlight')
        });
    },
    processImageErrors: function(notifyContainer) {
        var that = this;
        var errorContainer = this.infoSource.find('#imageErrorsURLs')
        if (errorContainer.length == 0) return;
        var imageErrors = errorContainer.text().split(",");
        if (imageErrors.length) {
            var errorCount = imageErrors.length;
            if (isstudio) {
                var errorNotify = $(' <img> ').attr("src", pageLayout.themePath + "images/image.png").css({
                    "float": "left",
                    "width": "20px"
                });
            } else {
                var errorNotify = $(' <i> ').addClass("fa fa-file-image-o").attr("aria-hidden", "true").css('float', 'left');
            }
            notifyContainer.append(errorNotify);
            notifyContainer.append($('<span>').addClass('errorCount').text(errorCount).css('margin-left', '5px'));

            var imageErrorTable = this.createTestTable('imageErrors', 'Image Errors');
            imageErrorTable.append(this.createRowHead('th', ['Location']));
            $(imageErrors).each(function() {
                imageErrorTable.append(that.createRow('td', [this]));
            });

            return imageErrorTable;
        }
    },
    createProjectDetails: function() {
        var projectDetailsTable = this.createTestTable('projectDetails', 'Respondent Details');
        projectDetailsTable.append(this.createRowHead('th', ['Object', 'Value']));
        projectDetailsTable.append(this.createRow('td', ['Project', projectName + " v" + projectVersion]));
        projectDetailsTable.append(this.createRow('td', ['Server', location.host]));
        projectDetailsTable.append(this.createRow('td', ['Serial', serial]));
        projectDetailsTable.append(this.createRow('td', ['PID', id]));
        projectDetailsTable.append(this.createRow('td', ['comp', '{' + comp + '}']));
        projectDetailsTable.append(this.createRow('td', ['Debug', isDebug]));
        var savePoint = $('input[name="I\.SavePoint"]');
        projectDetailsTable.append(this.createRow('td', ['Question', ((savePoint.length > 0) ? savePoint.val() : "End Screen")]));
        return projectDetailsTable;
    },
    processQuotas: function() {
        var jQuotas = $('#quotaPath');
        if (jQuotas.length == 0) return;
        var quotaTables = $('<div>');
        var quotaPaths = jQuotas.text().split("~");
        for (var i = 0; i < quotaPaths.length; i++) {
            var quotas = quotaPaths[i].split(';');
            quotas.pop();
            if (quotas.length) {
                var caption = '';
                if (quotaPaths.length > 1) caption = (i == 0) ? "Initial " : i + 1 + " ";
                var quotaTable = this.createTestTable('quotaPathTable', caption + 'Quota Path');
                quotaTable.append(this.createRowHead('th', ['Quota Group', 'Pass', 'Variable={checked values}->{result values}']));
                for (var x = 0; x < quotas.length; x++) {
                    var pattern = /(.*)\((.*)\)\[(.*)\]/;
                    var qGroup = quotas[x].replace(pattern, "\$1");
                    var qPass = quotas[x].replace(pattern, "\$2");
                    var variableValues = quotas[x].replace(pattern, "\$3").replace(/:/g, " = ").replace(/\},/g, "}<br/>");
                    var quotaRow = this.createRow('td', [qGroup, qPass, variableValues])
                    if (qPass.toLowerCase() == "false") quotaRow.addClass('quotaFail');
                    quotaTable.append(quotaRow)
                }
                quotaTables.append(quotaTable);
            }
        }
        return quotaTables;
    },
    processRoutingErrors: function(notifyContainer) {
        var routingErrors = $('.routingError');
        var that = this;
        if (routingErrors.length) {
            if (isstudio) {
                var errorNotify = $(' <img> ').attr("src", pageLayout.themePath + "images/alert.png").css({
                    "float": "left",
                    "width": "20px"
                });
            } else {
                var errorNotify = $(' <i> ').addClass("fa fa-exclamation-triangle").attr("aria-hidden", "true").css('float', 'left');
            }
            notifyContainer.append(errorNotify);
            notifyContainer.append($('<span>').addClass('errorCount').text(routingErrors.length).css('margin-left', '5px'));
            var errorsTable = this.createTestTable('errorsTable', 'Routing Errors');
            errorsTable.append(this.createRowHead('th', ['Last Question', 'Line #', 'Additional Info', 'Error Message']));
            routingErrors.each(function() {
                errorsTable.append(that.createRow('td', this.innerHTML.split("::")))
            });
            return errorsTable;
        }
    },
    createRow: function(type, cells) {
        if (cells.length > 0) {
            var tempRow = $('<tr>');
            for (var i = 0; i < cells.length; i++)
                tempRow.append($('<' + type + '>').html(cells[i]));
            return tempRow;
        } else {
            return null;
        }
    },
    createRowHead: function(type, cells) {
        if (cells.length > 0) {
            var tempRow = $('<tr>');
            for (var i = 0; i < cells.length; i++)
                tempRow.append($('<' + type + '>').html(cells[i]));
            var tempHead = $('<thead>').addClass("theme-bg-color").append(tempRow);
            return tempHead;
        } else {
            return null;
        }
    },
    createTestTable: function(id, caption) {

        var tempTable = $('<table>').attr('id', id).addClass('testTable table table-bordered table-responsive').addClass('none').css("display", "table");
        if (typeof(caption) != 'undefined') {
            var tempCaption = $('<caption>').html(caption);
            tempTable.append(tempCaption);
        }
        return tempTable;
    },
    createPassback: function(link) {
        this.passback = this.createTestTable('passbackTable', "Passback<br/><div class='linkShow'>" + link + "</div>");
        this.passback.append(this.createRowHead('th', ['Parameter', 'Value']));
        this.passback.append(this.createRow('td', ['<b>base URL</b>', link.split("?")[0] + '?']));
        this.infoSource.append(this.passback);
    },
    addPassbackRow: function(arrParam) {
        this.passback.append(this.createRow('td', arrParam));
    }
}