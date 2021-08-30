var preloadScript = [];
var loadScript = [];
var pageLayout;
var engErrorMessage = 'There was an error loading the page.  Please contact the survey administrator.';
var revertToHTML = false;



//TODO: fix form.submit() when multiple submit buttons by creating a submit function to always click next

$(document).ready(function (){
    try {
        pageLayout = new layout();  // create the global survey page.
        pageLayout.init();
        //Hot fix for other text box alignment issue   
		if($.trim($('span[questionname*="Other"]').parent().find('label').text()).length<100)
		$('span[questionname*="Other"]').parent().css("display","inline-flex");
		
		var isRTL = checkRTL('css/laf_rtl.css');
		if(isRTL){
			applyRTLStyle();
		}
	} catch(err) {
        handleSurveyEngineError(err);
    }
});

/**
 * In case a console.log message gets in here
 * @private
 */
var console = window.console || { log: function() {} };

/**
 * Object.create not supported in IE8 or below
 * @private
 */
if( Object.create === undefined ) {
    Object.create = function(o) {
        function F(){}
        F.prototype = o;
        return new F();
    };
}

/**
 * Any errors in with the Engine will be handled here
 */
function handleSurveyEngineError(error, callback) {
    $.event.trigger({type:'SurveyEngineEvent', eventType:'engine_error', message: 'There was an error: ' + error.message});
    var msg = engErrorMessage + "\n\nError message: " + error.message;
    var htmlMsg="<p class='mrErrorText'><br/>"+msg.replace('\n','<br/>')+"</p>";
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

var layout = function(){
	this.form = $('form');
	this.navigations = $('#surveyButtons');
	this.menu = $('#kButton');
	this.next = this.navigations.find('.mrNext');
	this.prev = this.navigations.find('.mrPrev');
	this.content = $('#questions');
	this.questions = this.content.find('.questionContainer');
	this.sharedContent = $('#sharedContent').attr('src').replace(/\\/g,'/');
	this.imageCache = this.resolveImageCache().replace(/\\/g,'/'); //todo: check that this works with server locations \\konapmri033
    this.synch = "/synch/projects/" + projectName + "/";
	this.themePath = (typeof tJSON=='undefined') ? this.sharedContent+"LAF/Themes/green/1.0/" : ((typeof tJSON.themeSource=='undefined') ? this.sharedContent + "LAF/Themes" : ((tJSON.themeSource.toLowerCase().substring(0,4) == 'http') ? "" : this.imageCache) + tJSON.themeSource) + "/" + tJSON.themeName + "/" + tJSON.themeVersion + "/";
	this.interviewer = (sampleSource=='IPL01');
	this.TIB = null;
	this.loader = null;
	this.infoSource = $('#infoPanel');
    this.allInputs = $([]);
    this.deviceType = (typeof deviceType != 'undefined' ? deviceType : "UNKNOWN").toUpperCase();
    this.showonly = ($('input[type=hidden][name=I\\.ShowOnly]').length > 0);

}
layout.prototype = {
	init:function(){
        this.secure();
		this.createLoader();
		this.updateMenu();
		this.setupNavs();
		this.moveErrors();
		this.addAttributes();
        this.TIB = new testPanel(isTest);
        var imagesLoaded = this.preloadImages();
        var that = this;
        $.when(imagesLoaded).always(function(){that.evaluateScripts(preloadScript,that.build,that);})
	},
    secure: function() {
        if (isTest) return;
        if (typeof isDebug != 'undefined')
            if (parseInt(isDebug,10) > 0) return;
        document.oncontextmenu = function(){return false};
        var body = $('body');
        body.addClass("noselect");
        body.prop('unselectable','on');
        if (typeof document.onselectstart!="undefined") {
            document.onselectstart = function (e) {
				var evt = (evt) ? evt : ((window.event) ? event : null);
				if (evt) {
					var target = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
					if (target){
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
    lazyLoad:function(dependencies,callback,context){
        var defer = [];
        while (dependencies.length > 0) {
            var objDepend = dependencies.shift();
            objDepend.url = this.resolveFilePath(objDepend.url);
			objDepend.url=objDepend.url+((objDepend.url.indexOf("?")==-1)?"?":"&")+'p='+projectName+'&rid='+serial+'&SE='+engVersion+'&deviceType='+this.deviceType.toUpperCase();
            if (objDepend.type == "script") {
                defer.push(
                    jQuery.ajax({
                        type: "GET",
                        context: this,
                        url: objDepend.url,
                        error: function(){console.log("error loading: " + objDepend.url)},
                        dataType: objDepend.type,
                        cache: true,
                        crossDomain: true
                    })
                );
            } else if (objDepend.type == "stylesheet") {
                $("head").append("<link>");
                var css = $("head").children(":last");
                css.attr({
                    rel:  "stylesheet",
                    type: "text/css",
                    href: objDepend.url
                });
            }
        }
        $.event.trigger({type:'SurveyEngineEvent', eventType: 'engine_lazyload', message: 'Survey Engine lazyLoad completed'});
        $.when.apply(context,defer).always(function(){callback.apply(context)});
    },
    resolveFilePath: function(stringVal) {
        stringVal = stringVal.replace(/\[%ImageCacheBase%\]/gi, pageLayout.imageCache);
        stringVal = stringVal.replace(/\[%SharedContentBase%\]/gi, pageLayout.sharedContent);
        stringVal = stringVal.replace(/\[%synchBase%\]/gi, pageLayout.synch);
        return stringVal;
    },
	updateMenu: function(){
			var subMenus = this.menu.find('li');
			subMenus.each(function(){
				jThis = $(this);
				var hyper = jThis.find('a');
                if (hyper.length == 0 || hyper.attr("href") == "") jThis.remove();
			});
			subMenus = this.menu.find('li');
			if (subMenus.length>0){
                this.menu.show();
                this.menuClick();
            }
	},
	menuClick: function(){
		var that = this.menu;
		this.menu.addClass('hand');
		var ulmenu = this.menu.find('ul');
		if (deviceType != "PC") {
			ulmenu.insertBefore($('#survey'));
		}
		this.menu.click(function(){
			ulmenu.slideToggle(400);
		});
	},
	moveErrors: function(){
	    var errors = $('.mrErrorText');
        errors.each(function(){
            var jThis = $(this);
            var qText = null;
            var parent = jThis.parent();
            var isParentDIV = (parent[0].nodeName == "DIV");
            var qContainer = (isParentDIV)  ? parent.parent() : parent.closest('tr');
            qText = qContainer.find('.mrQuestionText:first');
            if (qText){
                jThis.append($("<br>"));
                qText.prepend(jThis);
                if (isParentDIV) parent.remove();
            }
        });
	},
	setupNavs:function(){
		var inputs = this.navigations.find('input');
		inputs.each(function(){
			var jThis = $(this)
			jThis.attr('oldValue',jThis.val());
			jThis.attr('value',"");
			jThis.addClass('hand');
		});
	},
	createLoader:function(){
		var loadImage = this.themePath + "images/ajax-loader.gif";
		this.loader = $('<div>').attr("id","loader").css('display','none');//('none');
		this.content.after(this.loader);
		this.loader.append($('<img>').attr('src',loadImage));
		this.showLoader();
	},
	showLoader:function(){
		this.content.hide();
		this.next.prop("disabled",true);
		this.loader.show();
	},
	hideLoader:function(){
		this.loader.hide();
		this.content.show();
		this.next.prop("disabled",false);
		
	},
	build:function(){
		customButtons.init();
		this.convertEndLink('mrEndLink');
		this.evaluateScripts(loadScript,this.render,this);
	},
	render: function(){
		this.hideLoader();
        this.setCursorInOpens();
        this.TIB.init();
        console.log("page ready");
	},
	preloadImages:function(){
		var defer = new $.Deferred();
		var images = pageLayout.getDocumentImages();
		var promises = [];
		var failedImages = [];
		$(images).each(function(){
			var deferImage = new $.Deferred();
			var image =  document.createElement('img');
			image.onload = function(){deferImage.resolve();};
			image.onerror = function(){failedImages.push(this.src);deferImage.resolve();};
			image.onabort = function(){deferImage.resolve();};
			image.src = this;
			
			promises.push(deferImage.promise());
		});
		$.when.apply(this,promises).then(function(){
			if (failedImages.length>0) pageLayout.infoSource.append($('<div>').attr('id','imageErrorsURLs').text(failedImages.toString()));
			defer.resolve();
		});
		return defer.promise();
	},
	getDocumentImages: function(){
		var images = [];
		$(document.images).each(function(i,e){
			if (this.src != '')
				if (this.src.indexOf("aspx?") != -1 || this.src.indexOf("?") == -1 )
					if (this.src.indexOf(".swf") == -1 && this.src.indexOf("#") == -1) {
						images.push(this.src);
					}
		});
		return images;
	},
	evaluateScripts: function (scripts, callback, context){
		var promises = [];
        console.log(scripts);
		while (scripts.length > 0)
		{
			var theScript = scripts.shift();

			if (typeof theScript == "function"){
                console.log('Executing function');
                promises.push(theScript());
            }else {
                console.log('Executing ' + theScript);
                promises.push(eval(theScript));
            }
		} 
		$.when.apply(this,promises).always(function(){callback.apply(context)});
	},
	resolveImageCache: function (){
		var imageCacheArray, tempICBase;
		if (typeof imageCacheBaseString == 'undefined')  return "";
		tempICBase = imageCacheBaseString; //by deafult they are the same UNLESS multiple questions on page
		tempICBase = tempICBase.replace(/-- unknown ----- unknown --\//,"");//fix es-us language issue
		tempICBase = tempICBase.replace(/&amp;/g,"&"); //update escaped & to be actual character, needed for chrome/opera/safari
			
		if (tempICBase.charAt(1) == ':'){ //loaded from a mapped drive letter
			imageCacheArray = tempICBase.split("/" + tempICBase.substr(0,2))
			if (imageCacheArray.length > 1)
				tempICBase = imageCacheArray[0] + "/";
			return tempICBase;
		}
		if (tempICBase.indexOf("http://") == 0){ //loaded with an http:// reference
			imageCacheArray = tempICBase.split("http://")
			if (imageCacheArray.length > 1)
				tempICBase = "http://" + imageCacheArray[1]; 
			return tempICBase;
		}
		
		if (tempICBase.indexOf("\\\\") == 0){ //loaded from a sever share
			imageCacheArray = tempICBase.split("\\\\");
			if (imageCacheArray.length > 1) tempICBase = "\\\\" + imageCacheArray[1];
			return tempICBase;
		}
		
		if (tempICBase.indexOf("//") > 0){
			imageCacheArray = tempICBase.split("//");
			tempICBase = imageCacheArray[0] + "/";
			return tempICBase;
		}
		return tempICBase;
	},
	addAttributes: function(){
		var that = this;
        this.createQuestionContainers();
        this.questions = $('.questionContainer');
        this.questions.each(function(i,e){
            var container = $(this);
            var subContainers = container.find('.questionContainer');
            var hasOther = false;
            for(var z=0;z<subContainers.length;z++){
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
            inputs.each(function (i, b) {
                var jInput = $(this);
                qName = that.processInputAttributes(jInput, inputs, that);
                if (i == 0) {
                    isGrid = that.isGridInput(jInput);
                    that.setQuestionName(container, qName, isGrid);
                }
            });
            that.allInputs = that.allInputs.add(inputs);
		});
        this.questions.each(function(){
            var jThis = $(this);
            if (!jThis.attr("questionname")){
                var nameArray = jThis.find('.questionContainer').eq(0).attr('questionname');
				if (nameArray == null) return;
				nameArray = nameArray.split('.');
                jThis.attr('questionname',nameArray.slice(0,nameArray.length-1).join('.'));
            }
        });
        var page = this.content.children('.mrQuestionText');
        if (page.length == 0) return;
        var childName = page.siblings('.questionContainer').eq(0).attr("questionname");
        if (childName) {
            var nameArray = childName.split(".");
            var blockName = nameArray.slice(0,nameArray.length-1).join('.');
            var innerQ = page.siblings('.questionContainer[questionname^="' + blockName + '."]');
            if (innerQ.length > 0){
                var newQC = $('<div>').addClass('questionContainer').attr('questionname',blockName);
                page.before(newQC);
                newQC.append(page).append(innerQ);
                this.questions = this.questions.add(newQC);
            }
        }
	},
    isGridInput: function(jInput){
        var inputType = jInput[0].nodeName.toLowerCase();
        if (inputType == 'input') inputType = jInput.attr('type').toLowerCase();
        var labelMatch = 'label[for='+jInput.attr('id')+']';
        switch(inputType){
            case "radio":
            case "checkbox":
                var label = jInput.parent().find(labelMatch);
                if (label.length > 0) return false; //grid standard inputs don't have labels
                var id = jInput.attr('id');
                if (id.indexOf("_F") == -1) return true;//if input not a code and no label it is a grid
                var codeParent = jInput.parent().parent();
                if (codeParent[0].nodeName.toLowerCase() == "td") return true; //if code and its container is cell it is a grid
                return false;//get here all grid tests fail
            case "text":
            case "textarea":
                var parentTable = jInput.closest('table');
                if (parentTable.length == 0) return false;//no containing table, no grid
                if (parentTable.find(labelMatch).length == 0) return true;//if no label of text, its a grid
                return false;
            case "option":
            case "select":
                var parent = jInput.parent();
                if (parent[0].nodeName.toLowerCase()=="td") return true; //assuming if parent is td then grid
                return false; //get here, no grid
        }
        return false;
    },
    createQuestionContainers: function(){
		this.questions.find('span > .mrQuestionText').parent().addClass('questionContainer');
		this.questions.find('span > label > .mrQuestionText').parent().parent().addClass('questionContainer');
    },
    processInputAttributes:function(jInput,inputs,that){
        var isCat,isCode,isOth,type,qName;
        var jID = jInput.attr("id");
		if (typeof jID === "undefined") return qName="";
        isCat = (jID.indexOf("_C") > 0);
        jInput.attr("openendid","");
        jInput.attr("iscode","");
        jInput.attr("otherid","");
        jInput.attr("isexclusive",that.isExclusive(jInput.attr("value"))); //determine if exclusive

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
        qName = that.resolveHTMLValueToMDDName(jInput.attr("name"),type);
        jInput.attr("questionname",qName); //set questionname attribute for grouping later
        return qName;
    },
    setQuestionName:function(container,qName,isGrid) {
        if (isGrid) {
            var nameArray = qName.split('.');
            qName = nameArray.slice(0, nameArray.length - 2).join('.');
        }
        container.attr("questionname",qName);
        nameArray = qName.split('.');
        return nameArray.slice(0,nameArray.length-1).join('.');
    },
	isExclusive: function(name){
        if (name==null) return false; //no name no exclusive
        name=name.toUpperCase(); //remove case sensitivity
        name=this.resolveHTMLValueToMDDName(name); //remove special SPSS formatting
        return(name=="NA" || name=="REF" || name=="DK" || name=="NONE" || name=="DONTKNOW" || name.charAt(name.length-1)=="@"); //check against standard names
    },
	resolveHTMLValueToMDDName: function  (htmlName,delimiter){
        //http://pic.dhe.ibm.com/infocenter/spssdc/v6r0m1/topic/com.spss.ddl/mrscriptbasic_langref_namingconventions.htm
        //http://pic.dhe.ibm.com/infocenter/spssdc/v6r0m1/topic/com.spss.ddl/mrintover_html_player_elements.htm
		htmlName = htmlName.replace(/__/g,"~"); //replace __ with ~.  __ represents _ in any name (used so flags below could be used with an underscore without confusion). Replacing with ~ to remove _ from name so other replacements can be done.
        htmlName = htmlName.replace(/_D/g,"@"); //replace _D with @ (@ is used to denote exclusive mention)
        htmlName = htmlName.replace(/_H/g,"#"); //replace _D with @ (@ is used to denote exclusive mention)
		htmlName = htmlName.replace(/_S/g,"."); //replace _S with a dot (used when namespacing)
		htmlName = htmlName.replace(/^\s+|\s+$/g, ''); //trim string of leading and trailing spaces
		if (delimiter=="_O") htmlName = htmlName.replace(delimiter, '.'); //trim string of leading and trailing spaces
        if (htmlName.indexOf("_Q")==0) htmlName = htmlName.replace(/_Q/g,".").substr(1);
        if (delimiter) htmlName = htmlName.split(delimiter)[0];
		return htmlName.replace(/~/g,"_");
	},
	convertEndLink: function(id){
		var endLink = $('#'+id);
		if (endLink.length == 0) return;
		var href = endLink.attr("href")
		var arrUrl = [href.substring(0,href.indexOf("?", 0)),href.substring(href.indexOf("?", 0)+1,href.length)];
		endLink.addClass('none');
		
		var hasNavs = (this.navigations.find('input').length > 0)
		if (hasNavs)
		{
			this.content.children().addClass('none');
			$('.endText').parent().removeClass('none');
		}else{
			$('input').filter(':hidden').remove();
			this.form.attr('action',arrUrl[0]);
			this.form.attr('method',"get");
		}

		this.TIB.createPassback(href);

		if (arrUrl.length > 1){
			var urlParams = arrUrl[1].split('&');
			for (var i=0;i<urlParams.length;i++) {
				var nameValue = urlParams[i].split('=');
				this.TIB.addPassbackRow(nameValue);
				var inputTag = "<input type='hidden' name='" + nameValue[0] + "' value='" + unescape(nameValue[1]) + "' />";
				if (!hasNavs) this.form.append(inputTag);
			}
		}
		
		var mrButtonText = endLink.text();
		if (mrButtonText == '')	mrButtonText = "Submit"
		var submitButton = "<input type='submit' id='endLinkButton' value='" + mrButtonText + "' />";
		submitButton = endLink.after(submitButton).next()
		if (!hasNavs)
			this.next = submitButton;
		else
			submitButton.prop('disabled',true);
	},
	setCursorInOpens: function(){
		if (cursorInOpens != 1) return;
		var textInputs = this.allInputs.filter('.mrEdit').filter(':visible');
        if (textInputs.length == 0) return;
        for (var i=0;i<textInputs.length;i++){
            var jInput = textInputs.eq(i);//get jquery object
            if (!jInput.attr("disabled")) { //make sure its not disabled
                if (jInput.attr("id").indexOf("_O")== -1) { //make sure not an other specify
                    try{//just in case an error is thrown
                        jInput.focus(); //try to add focus
                        window.scrollTo(0,0); //scroll to top just in case text area is off screen
                    }catch(err){
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
        html_calc.css('font-size',$(value).css('font-size')).hide();
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
    textWidth : function(value) {
        var html_calc = $('<span>' + $(value).html() + '</span>');
        html_calc.css('font-size',$(value).css('font-size')).hide();
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
    imgSize : function(img) {
        var $img = $(img);
        if (typeof $img.attr('src')== 'undefined') return {'width': 0, 'height': 0}
        if ($img.prop('naturalWidth') == undefined) {
            var $tmpImg = $('<img/>').attr('src', $img.attr('src'));
            $img.prop('naturalWidth', $tmpImg[0].width);
            $img.prop('naturalHeight', $tmpImg[0].height);
        }
        return { 'width': $img.prop('naturalWidth'), 'height': $img.prop('naturalHeight') }
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
    imageDimensions : function(imgsrc, usezoom, zoomscale, defwidth, defheight) {
        var w=0, h=0;
        var imgsz = pageLayout.imgSize(imgsrc);  // get the native image size.

        if (usezoom) {  // Check for zoomscale first.
            if (zoomscale!==null && !isNaN(zoomscale)) {
                w = imgsz.width * zoomscale;
                h = imgsz.height * zoomscale;
            } else {
                w = imgsz.width * surveyPage.options.zoomScale;
                h = imgsz.height * surveyPage.options.zoomScale;
            }
        } else { // If zoom isn't used then check defaultt nwidth/height - if not, the native image size is used.
            w = (defwidth!=null && !isNaN(defwidth)) ? defwidth : w;
            h = (defheight!=null && !isNaN(defheight)) ? defheight : h;
        }
        w = ((w<=0) ? imgsz.width : w);
        h = ((h<=0) ? imgsz.height: h);
        return {'width': w,'height': h};
    }
}

var customButtons = {
	init: function() {
        var inputs = pageLayout.allInputs.filter(':radio, :checkbox');
        inputs.addClass("styled");
        inputs.each(function(){
            var jThis = $(this); //get jquery object for this input
            var newSpan = $("<span>"); //create container for new button
			newSpan.css('visibility',jThis.css('visibility')); //set visibility to the same as the input
			var inputShown = (jThis.css('visibility') != 'hidden');
			var inputEnabled = !jThis.attr("disabled");
            var divSpacer = $("<div>");
            var label = jThis.next("label[for='"+ jThis.attr("id") +"']"); //get label
            var labelHeight = label.height(); //grab height before altering page
            var catContainerWidth = label.outerWidth(true); //grab width before altering page
            if (jThis.attr("otherid") != ""){ 
                label.children('span').addClass('otherPadding');
                catContainerWidth = label.outerWidth(true) + label.next().outerWidth(true);
            }
            if (jThis.attr("iscode") == "true") catContainerWidth = label.children('span').width(); //if its a code, need the width of the text since its not in a TD
            newSpan.addClass(this.type); //add class of the same name as input type
            (customButtons.isCheckbox(jThis) && jThis.attr("isexclusive") == "false") ? newSpan.addClass("check") : newSpan.addClass("radio")
            newSpan.attr("forinput",jThis.attr("id")); //add reference to input id for quick access
            newSpan.addClass("hand"); //make mouse a hand
            newSpan.html("&nbsp;"); //add a space so browsers treat it like text in flow
            jThis.before(newSpan); //add button container as sibling to input
            if (label.length > 0) {
                label.addClass("hand");
				label.addClass("cbText");
                label.attr("forinput",jThis.attr("id"));
                label.attr("for",""); //remove for from label to prevent browser from checking input box, jQuery will handle that
                divSpacer.html("&nbsp;");
                divSpacer.addClass("categoryVertSpacing"); // //TODO: do I need to add a space? Just add it and set height based in css?
                if (jThis.attr("iscode") == "true"){//if code
                    label.width(catContainerWidth); //set the label to the exact width of the text, prevents the entire page horizontally from selecting code
                    label.parent().children('.mrEdit').addClass('mrEditCodeSpacing');//add padding between text area and code
                }else{ //not a code, set the spacer to the width of the label + width of custom button
                    divSpacer.width(catContainerWidth + newSpan.outerWidth(true));
                }
                customButtons.getCategoryEndContainer(label).append(divSpacer); //not only spaces vertically but also fixes IE guillotine bug with images
                if ((newSpan.height()) < labelHeight) { //if the label height is taller than the button
					//TODO: is this necessary?!?! labelHeight is 0 because its hidden during these calculations. if we don't do it, label wraps under check box if taller than
                    newSpan.css("margin-bottom",labelHeight - newSpan.height() +  "px"); //make button container height the same as label
                }
            }else{ //if no label, assume grid or other method that doesn't require the button to line up with text
				newSpan.addClass((newSpan.hasClass("radio"))?"gridRadio":"gridCheck")
                if (newSpan.parent()[0].nodeName.toLowerCase() == "td") newSpan.parent().css('padding-right','0px');
            }
            if(inputEnabled && inputShown) { //if button is not disabled
                label.hover(customButtons.hover,customButtons.outHover); //add hover to label for button effect
                newSpan.hover(customButtons.hover,customButtons.outHover); //add hover to button for button effect
                label.click(customButtons.clicked); //add click to label to set button&input states
                newSpan.click(customButtons.clicked); //add click to button to set button&input states
            } else {
                if (!inputEnabled) newSpan.addClass("disabled"); //if disabled just add class to identify as disabled
                newSpan.removeClass("hand"); 
                label.removeClass("hand"); 
            }
            customButtons.resetButton(this,false); //reset the button to match state of this input
            jThis.change(customButtons.clear); //set change event on input to update all button states
        });
	},
    getCategoryEndContainer: function(category){
         if (category.length == 0) return category; //boolean
		 var thisParent = category.parent()
         if (thisParent.parent()[0].nodeName.toLowerCase() == "td") //if categoy is in a table cell then return table cell
             return thisParent;

		 if (thisParent.attr("id")!=null) {
		 	if (thisParent.prop("id").indexOf("Cell") == 0)
				return thisParent;
		 }
		return(category); //if code, just add the div to the label
    },
	hover: function() {
		var jThis = $(this); //grab this object (could be button or label)
        var jInput = (jThis[0].nodeName.toLowerCase() == "label") ? jThis.prev() : jThis.next(); //get input from jThis
		customButtons.buttonState(jInput.prev(),"Hover",true);
	},
    outHover: function(){
         var jThis = $(this);  //grab this object (could be button or label)
         var jInput = (jThis[0].nodeName.toLowerCase() == "label") ? jThis.prev() : jThis.next(); //get input from jThis
		 customButtons.buttonState(jInput.prev(),"Hover",false);
    },
	clicked: function() {
        var jThis = $(this);  //grab this object (could be button or label)
        var jInput = (jThis[0].nodeName.toLowerCase() == "label") ? jThis.prev() : jThis.next(); //get input from jThis
        if (customButtons.isCheckbox(jInput)) {
                //Exclusive uncheck/check logic only needed for checkboxes as radios work this way by default
                if (!jInput.is(":checked")) { //if current input NOT checked, it means the user wants it checked
                    var qInputs = $("[questionname='"+jInput.attr("questionname")+"']:checked"); //get all checked items for this question
                    if (jInput.attr("isexclusive")=="true" || (qInputs.length==1 && qInputs.attr("isexclusive")=="true")) { //if this item is exclusive OR if the current value is exclusive
                        qInputs.each(function(){
                        $(this).prop("checked",false); //remove check
                        });
                    }
                }
        }
        jInput.trigger('click'); //doesn't work in IE8+ if you don't follow up with resetButton because it does NOT fire change event for input
		customButtons.resetButton(jInput[0],true);
	},
	clear: function() {
         customButtons.resetButton(this,true); //reset all buttons to input states
	},
    resetButton: function(input, updateAll){
        var jThis = $(input); //get jQuery object of input
		var qInputs = jThis;
		if (updateAll) qInputs = (customButtons.isCheckbox(jThis)) ? $("[questionname='"+jThis.attr("questionname")+"']") : $(":radio[name='" + jThis.attr("name")+"']");
		qInputs.each(function(){
			var jThis = $(this);
			customButtons.buttonState(jThis.prev(),"Checked",jThis.is(":checked"));
		});

    },
	buttonState: function(button,state,add){
		var newClass = (button.hasClass("check") ? "check" : "radio") + state;
		if (add)
			button.addClass(newClass);
		else
			button.removeClass(newClass);
	},	
    isCheckbox: function(jInput){
         if (jInput.prop("type")!=null)
            return (jInput.attr("type").toLowerCase() == "checkbox"); //check if input type is checkbox
         return false
    }
}

function loadjQueryUI(callback,context){
	if (jQuery.ui){
        callback.apply(context)
        return
    }
    $("head").append("<link>");
    var css = $("head").children(":last");
	css.attr({
        rel:  "stylesheet",
        type: "text/css",
        href: pageLayout.themePath+"css/1.10.4/jquery-ui-custom.css"
    });
    jQuery.ajax({
        type: "GET",
		url:pageLayout.sharedContent+'LAF/Lib/jQueryUI/1.11.0/jquery-ui.min.js', 
        success: function(){callback.apply(context)},
        dataType: "script",
        cache: true
    });     
}

var testPanel = function(tester){
    this.isTest = tester;
    this.infoSource = pageLayout.infoSource;
    this.banner = $('<div>').attr("id","testPanel").css('display','none');
    this.modal = $('<div>').attr("id","testModal").attr("title","Interview Details").addClass("none");
    this.passback = null;
};
testPanel.prototype = {
    init: function(){
        loadjQueryUI(this.build, this);
    },
    build: function(){
        var that = this;
        if (this.isTest) this.show();
        var innerTest = $('<div>').attr("id","innerTest").addClass("ui-state-focus").text("Test - v" +projectVersion);
        this.banner.append(innerTest).append(this.modal).appendTo("body");
        this.modal.append(this.createProjectDetails());
        this.modal.append(this.infoSource.find('#passbackTable'));
        this.modal.append(this.processQuotas());
        this.modal.append(this.processImageErrors(innerTest));
        this.modal.append(this.processRoutingErrors(innerTest));
        var testTables = this.modal.find('.testTable');
        testTables.removeClass('none');
        this.rowHighlight(testTables.find('tr'));
        innerTest.click(function(){that.modal.dialog({modal:true,show:"slideDown",width:'auto'});});
        if (innerTest.find('.errorCount').length) innerTest.effect("shake",{times:5},750,function(){$(this).addClass('errorBackground');});

    },
    hide:function(){
        this.banner.hide();
    },
    show:function(){
		this.banner.show();
    },
    rowHighlight: function (jRows){
        jRows.hover(function(){$(this).addClass('rowHighlight')},function(){$(this).removeClass('rowHighlight')});
    },
    processImageErrors: function (notifyContainer){
        var that = this;
        var errorContainer = this.infoSource.find('#imageErrorsURLs')
        if (errorContainer.length == 0) return;
        var imageErrors = errorContainer.text().split(",");
        if (imageErrors.length){
            var errorCount = imageErrors.length;
            var errorNotify = $('<span>').addClass("ui-icon").addClass("ui-icon-image").css('float','left');
            notifyContainer.append(errorNotify);
            notifyContainer.append($('<span>').addClass('errorCount').text(errorCount));

            var imageErrorTable = this.createTestTable('imageErrors','Image Errors');
            imageErrorTable.append(this.createRow('th',['Location']));
            $(imageErrors).each(function(){
                imageErrorTable.append(that.createRow('td',[this]));
            });

            return imageErrorTable;
        }
    },
    createProjectDetails: function (){
        var projectDetailsTable = this.createTestTable('projectDetails','Respondent Details');
        projectDetailsTable.append(this.createRow('th',['Object','Value']));
        projectDetailsTable.append(this.createRow('td',['Project',projectName + " v"+projectVersion]));
        projectDetailsTable.append(this.createRow('td',['Server',location.host]));
        projectDetailsTable.append(this.createRow('td',['Serial',serial]));
        projectDetailsTable.append(this.createRow('td',['PID',id]));
        projectDetailsTable.append(this.createRow('td',['comp','{'+comp+'}']));
        projectDetailsTable.append(this.createRow('td',['Debug',isDebug]));
        var savePoint = $('input[name="I\.SavePoint"]');
        projectDetailsTable.append(this.createRow('td',['Question',((savePoint.length>0) ? savePoint.val() : "End Screen")]));
        return projectDetailsTable;
    },
    processQuotas: function (){
        var jQuotas = $('#quotaPath');
        if (jQuotas.length==0) return;
        var quotaTables=$('<div>');
        var quotaPaths = jQuotas.text().split("~");
        for (var i=0;i<quotaPaths.length;i++)
        {
            var quotas = quotaPaths[i].split(';');
            quotas.pop();
            if (quotas.length){
                var caption = '';
                if (quotaPaths.length>1)caption = (i==0) ? "Initial " : i+1 + " ";
                var quotaTable = this.createTestTable('quotaPathTable',caption + 'Quota Path');
                quotaTable.append(this.createRow('th',['Quota Group','Pass','Variable={checked values}->{result values}']));
                for (var x=0; x < quotas.length;x++){
                    var pattern = /(.*)\((.*)\)\[(.*)\]/;
                    var qGroup = quotas[x].replace(pattern,"\$1");
                    var qPass = quotas[x].replace(pattern,"\$2");
                    var variableValues = quotas[x].replace(pattern,"\$3").replace(/:/g," = ").replace(/\},/g,"}<br/>");
                    var quotaRow = this.createRow('td',[qGroup,qPass,variableValues])
                    if (qPass.toLowerCase() == "false") quotaRow.addClass('quotaFail');
                    quotaTable.append(quotaRow)
                }
                quotaTables.append(quotaTable);
            }
        }
        return quotaTables;
    },
    processRoutingErrors: function (notifyContainer){
        var routingErrors = $('.routingError');
        var that = this;
        if (routingErrors.length){
            var errorNotify = $('<span>').addClass("ui-icon").addClass("ui-icon-alert").css('float','left');
            notifyContainer.append(errorNotify);
            notifyContainer.append($('<span>').addClass('errorCount').text(routingErrors.length));
            var errorsTable = this.createTestTable('errorsTable','Routing Errors');
            errorsTable.append(this.createRow('th',['Last Question','Line #','Additional Info','Error Message']));
            routingErrors.each(function(){errorsTable.append(that.createRow('td',this.innerHTML.split("::")))});
            return errorsTable;
        }
    },
    createRow: function (type,cells){
        if (cells.length > 0){
            var tempRow = $('<tr>');
            for (var i=0;i<cells.length;i++)
                tempRow.append($('<'+type+'>').html(cells[i]));
            return tempRow;
        }else{
            return null;
        }
    },
    createTestTable: function (id,caption){

        var tempTable = $('<table>').attr('id',id).addClass('testTable').addClass('none');
        if (typeof(caption)!='undefined'){
            var tempCaption = $('<caption>').html(caption);
            tempTable.append(tempCaption);
        }
        return tempTable;
    },
    createPassback: function(link){
        this.passback = this.createTestTable('passbackTable',"Passback<br/><div class='linkShow'>"+link+"</div>");
        this.passback.append(this.createRow('th',['Parameter','Value']));
        this.passback.append(this.createRow('td',['<b>base URL</b>',link.split("?")[0]+'?']));
        this.infoSource.append(this.passback);
    },
    addPassbackRow: function(arrParam){
        this.passback.append(this.createRow('td',arrParam));
    }
}


// RTL Functions

function checkRTL(fileName) {
    var found = false;
	var headString = ($("head").html()).toString();
	var n = headString.search(fileName);
	if(0 < n){
		found = true;
	}
	return found;
}

function applyRTLStyle(){
	var inputlenght = $("#standardnav input").length;
	if(inputlenght > 1){
		$("#standardnav input").first().attr("name","_NNext");
		$("#standardnav input").first().attr("class","mrNext hand");
		$("#standardnav input").first().attr("alt","Next");
		$("#standardnav input").first().attr("oldvalue","Next");
		
		$("#standardnav input").last().attr("name","_NPrev");
		$("#standardnav input").last().attr("class","mrPrev hand");
		$("#standardnav input").last().attr("alt","Previous");
		$("#standardnav input").last().attr("oldvalue","Previous");
		
	}else{
		
		
	}
	
	$('.mrPrev').attr('style', 'background-position: -150px -62px !important');
	
	$(".mrPrev").hover(function() {
	  $(this).attr('style', 'background-position: -300px -62px !important');
	}, function(){
       $(this).attr('style', 'background-position: -150px -62px !important');
    });
	$('.mrPrev').mousedown(function() {
	  $(this).attr('style', 'background-position: -450px -62px !important');
	});
	
	$('.mrPrev:disabled').attr('style', 'background-position: 0px -62px !important');
	
	
	
	
	$('.mrNext').attr('style', 'background-position: -150px 0px !important');
	
	$(".mrNext").hover(function() {
	  $(this).attr('style', 'background-position: -300px 0px !important');
	}, function(){
       $(this).attr('style', 'background-position: -150px 0px !important');
    });
	$('.mrNext').mousedown(function() {
	  $(this).attr('style', 'background-position: -450px 0px !important');
	});
	
	$('.mrNext:disabled').attr('style', 'background-position: 0px 0px !important');
	
}
