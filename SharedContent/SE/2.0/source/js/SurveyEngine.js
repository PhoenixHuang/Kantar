var surveyPage;
var firstQues;
var lastQues;

/**
 * Initializes the survey engine.
 * Loads the data and renders the survey tools
 */
function initSurveyEngine() {
    try {
        surveyPage = new SurveyPage();  // create the global survey page.
        surveyPage.init();
        return surveyPage.deferred.promise();
    } catch(err) {
        handleSurveyEngineError(err);
    }
}

/**
 * Represents the survey page questions that have components.
 *
 * Creates a Survey Page object
 * @constructor
 */
var SurveyPage = function () {
    this.questions = [];
    this.surveyData = qJSON;
    this.questionContainers = pageLayout.questions;
    this.path = pageLayout.sharedContent + "SE/" + engVersion + "/";
    this.imagesPath = this.path + "source/images/";
    this.toolsPath = this.path + "source/js/SurveyTools/";
    this.deferred = new $.Deferred();
}
SurveyPage.prototype = {
    /**
     * Initialize the  SurveyPage
     */
    init: function() {
        $.event.trigger({type:'SurveyEngineEvent', eventType: 'engine_init', message: 'Survey Engine initialize called'});
        try {
            this.options = this.initOptions();
            this.loadDependencies();
        } catch(err) {
            handleSurveyEngineError(err);
        }
    },
    /**
     * Loads dependencies for all of the survey tools on the page
     */
    loadDependencies: function(){
        $.event.trigger({type:'SurveyEngineEvent', eventType: 'engine_dependencies', message: 'Survey Engine loading dependencies'});
        var that = this;
        var dependencies = [];
        $.each(this.surveyData,function(index,json){
            var thisPath = ((json.CustomProps.hasOwnProperty("toolPath")) ? pageLayout.resolveFilePath(json.CustomProps.toolPath) + "//" : that.toolsPath) + json.CustomProps.flaMetaType.toLowerCase() + '.js';
            dependencies.push({
                'url':thisPath,
                'type':'script'
            });
        });
        pageLayout.lazyLoad(dependencies, this.loadQuestions,this);
    },
    /**
     * Instantiates and loads the questions
     */
    loadQuestions: function() {
        $.event.trigger({type:'SurveyEngineEvent', eventType:'engine_loadquestions', message:'Survey Engine loadQuestions called'});
        var that = this;
        var promises = [];
        $.each(this.surveyData,function(index,json){
            var q = new window[json.CustomProps.flaMetaType.toLowerCase()](that.questionContainers,json,that.options);
            promises.push(q.create());
            that.questions.push(q);
        });
        $.when.apply(this,promises).always(function(){that.render.apply(that)});
    },
    /**
     * Renders all of the survey tools on the page
     */
    render: function() {
        var promises = [];
        var that = this;
        firstQues = this.questions[0];
        $(this.questions).each(function(i, q) {
            promises.push(q.render());
            lastQues = q;
        });

        $("form").submit(surveyPage.setResponsesAndSubmit);
        $.event.trigger({type:'SurveyEngineEvent', eventType: 'engine_complete', message: 'Survey Engine render completed'});
        $.when.apply(this,promises).always(function(){that.fixButtonText()});
    },
    /**
     * Applies a fix for text position when using a custom image for input
     */
    fixButtonText: function(){
        //TODO: investigate using a qstudio param for this instead vcoloffset?
        $(this.questions).each(function(i,q){
            if (q.componentContainer == null) return;
            var buttons = q.componentContainer.find('.qwidget_button_background');
            buttons.each(function(){
                var jThis = $(this);
                if (jThis.css('background-image') != "none"){
                    var text = jThis.next().find('span').eq(0);
                    text.addClass('cbText');
                }
            });
        });
        this.deferred.resolve();
    },
    /**
     * Saves the responses back to the original form elements and submits
     */
    setResponsesAndSubmit:function(doSubmit) {
        var allowSubmit = true;
        $.event.trigger({type:'SurveyEngineEvent', eventType: 'engine_submit', message: 'Survey Engine submit responses called'});
        $(surveyPage.questions).each(function(i, q) {
            q.setResponses();
        });
        return allowSubmit;  // submit the page
    }
};
/**
 * Sets up the default options for the survey page
 */
SurveyPage.prototype.initOptions = function() {
    var options = {
        "rowRadChckImpRadio": this.imagesPath + "radioBtnSprite.png",
        "rowRadChckWidthRadio" : 25,
        "rowRadChckHeightRadio" : 25,
        "rowRadChckImpCheck" : this.imagesPath + "checkBtnSprite.png",
        "rowRadChckWidthCheck" : 25,
        "rowRadChckHeightCheck" : 25,
        "colRadChckImpRadio": this.imagesPath + "radioBtnSprite.png",
        "colRadChckWidthRadio" : 25,
        "colRadChckHeightRadio" : 25,
        "colRadChckImpCheck" : this.imagesPath + "checkBtnSprite.png",
        "colRadChckWidthCheck" : 25,
        "colRadChckHeightCheck" : 25,
        "rowKntrInputImpRadio" : this.imagesPath + "radioBtnSprite.png",
        "rowKntrInputWidthRadio" : 25,
        "rowKntrInputHeightRadio" : 25,
        "colKntrInputImpRadio" : this.imagesPath + "radioBtnSprite.png",
        "colKntrInputWidthRadio" : 25,
        "colKntrInputHeightRadio" : 25,
        "rowKntrInputImpCheck" : this.imagesPath + "checkBtnSprite.png",
        "rowKntrInputWidthCheck" : 25,
        "rowKntrInputHeightCheck" : 25,
        "colKntrInputImpCheck" : this.imagesPath + "checkBtnSprite.png",
        "colKntrInputWidthCheck" : 25,
        "colKntrInputHeightCheck" : 25,
        "dkRadChckImp" : this.imagesPath + "radioBtnSprite.png",
        "dkRadChckWidth" : 25,
        "dkRadChckHeight" : 25,
        "colRadImpUp" : this.imagesPath + "star_off.png",
        "colRadImpOver" : this.imagesPath + "star_on.png",
        "colRadImpDown" : this.imagesPath + "star_on.png",
        "colChkImpUp" : this.imagesPath + "star_off.png",
        "colChkImpOver" : this.imagesPath + "star_on.png",
        "colChkImpDown" : this.imagesPath + "star_on.png",
        "colSldrHndleImpUp" : this.imagesPath + "handle_up_51x62.png",
        "colSldrHndleImpDown" : this.imagesPath + "handle_down_51x62.png",
        "rowSldrHndleImpUp" : this.imagesPath + "linkd_handle_up_51x62.png",
        "rowSldrHndleImpDown" : this.imagesPath + "linkd_handle_up_down_51x62.png",
        "rowOtherInitTxt": "",
        "colOtherInitTxt": "",
        "zoomIcon": this.imagesPath + "zoomIcon.png",
        "closeIcon": this.imagesPath + "closeIcon.png",
        "zoomScale": 0.8,
        "zoomImp": this.imagesPath + "zoomIcon.png",
        "rowZoomImp": this.imagesPath + "zoomIcon.png",
        "colZoomImp": this.imagesPath + "zoomIcon.png",
        "zoomCloseWidth": 29,
        "zoomCloseHeight": 29,
        "zoomCloseImp": this.imagesPath +"closeIcon.png",
        "zoomCloseHoffset": 2,
        "zoomCloseVoffset": -2,
        "zoomOverlayBckgrndColor": 0x000000,
        "zoomOverlayAlpha": 80
    }

    switch(pageLayout.deviceType) {
        case "LARGETABLET":
        case "MEDIUMTABLET":
        case "SMALLTABLET":
        case "SMARTPHONETOUCH":
            options.rowRadChckImpRadio = this.imagesPath + "mobile/radioBtnSprite.png";
            options.rowRadChckWidthRadio = 50;
            options.rowRadChckHeightRadio = 50;
            options.rowRadChckImpCheck = this.imagesPath + "mobile/checkBtnSprite.png";
            options.rowRadChckWidthCheck = 50;
            options.rowRadChckHeightCheck = 50;
            options.colRadChckImpRadio = this.imagesPath + "mobile/radioBtnSprite.png";
            options.colRadChckWidthRadio = 50;
            options.colRadChckHeightRadio = 50;
            options.colRadChckImpCheck = this.imagesPath + "mobile/checkBtnSprite.png";
            options.colRadChckWidthCheck = 50;
            options.colRadChckHeightCheck = 50;
            options.rowKntrInputImpRadio = this.imagesPath + "mobile/radioBtnSprite.png";
            options.rowKntrInputWidthRadio = 50;
            options.rowKntrInputHeightRadio = 50;
            options.colKntrInputImpRadio = this.imagesPath + "mobile/radioBtnSprite.png";
            options.colKntrInputWidthRadio = 50;
            options.colKntrInputHeightRadio = 50;
            options.rowKntrInputImpCheck = this.imagesPath + "mobile/checkBtnSprite.png";
            options.rowKntrInputWidthCheck = 50;
            options.rowKntrInputHeightCheck = 50;
            options.colKntrInputImpCheck = this.imagesPath + "mobile/checkBtnSprite.png";
            options.colKntrInputWidthCheck = 50;
            options.colKntrInputHeightCheck = 50;
            options.dkRadChckImp = this.imagesPath + "mobile/radioBtnSprite.png";
            options.dkRadChckWidth = 50;
            options.dkRadChckHeight = 50;
    }
    return options;
}

/**
 * SESurveyTool Base Class for all survey tools
 *
 * Do not instantiate.
 * @constructor
 */
function SESurveyTool() { /* Do not instantiate */ }
SESurveyTool.prototype = {
    /**
     * Initialize the SurveyTool
     * @param {array} - Array of question containers
     * @param {json} - The question json
     * @param {object} - Global options from survey page
     */
    init : function(questionContainers, json, globalOpts) {
		this.deferred = new $.Deferred();
        this.json = json;
        this.options = $.extend({},globalOpts);
        this.questionName = json.QuestionName.replace(/\[\{/gi,".").replace(/\]|\]\}/gi,"").replace(/\[/gi,"._");
        this.questionFullName = json.QuestionFullName.replace(/\[\{/gi,".").replace(/\]|\]\}/gi,"").replace(/\[/gi,"._");
        this.customProps = json.CustomProps;
        this.minVal = (isNaN(json.min)) ? json.min : +json.min;
        this.maxVal = (isNaN(json.max)) ? json.max : +json.max;
        this.component = null;
        this.componentContainer = null;
        this.nativeContainer = this.getNativeContainer(questionContainers);
        this.subquestions = [];
        this.columnheaders = [];
        this.label = this.getLabel();
        this.inputs = this.getInputs();
        this.config();
    },
    /**
     * A simple string tool name used as an identifier
     * @returns {string}
     */
    type : function(){
        return "";
    },
    /**
     * Sets the dependencies for this survey tool.
     *
     * Dependencies are usually javascript and css files required to build the survey tool
     */
    getDependencies: function(){},
    /**
     * Gets a property (case insensitive) from the list of supplied options.  If not options are supplied it defaults to base options
     * @param {string} - The property name to look for
     * @param {object} [objProps] - An object containing the properties
     * @returns {string|null}
     */
    getProperty: function(propName, objProps) {
        if (typeof objProps == 'undefined' || objProps == null) objProps = this.options;
        for (var i in objProps) {
            if (i.toLowerCase()==propName.toLowerCase()) return objProps[i];
        }
        return null;
    },
    /**
     * Set the initial response for the survey tool
     */
    setInitialResponses: function (){},
    /**
     * Set properties based on runtime logic and values
     */
    setRuntimeProps :  function () {},
    /**
     * Set the responses from the component into the html form tags
     */
    setResponses: function (){},
    /**
     * Creates a set of subquestions from a grid question.
     */
    buildArraysFromGrid: function () {
        var that = this;

        // ranking grid headers are just count of iputs
        $.each(this.nativeContainer.find('tr'), function(i, e) {
            var el = $(e);
            var inputs = $(e).find('input');
            if (inputs.length<=0) {
                $.each(el.find('td.mrGridQuestionText'), function(x, td) {
                    that.columnheaders.push({
                        'id': String(that.columnheaders.length),
                        'label': td
                    });
                });
            } else {
                that.makeSubQuestion(el, inputs);
            }
        });
    },
    /**
     * Makes a subquestion from the element and a set of inputs
     * @param {object} jQuery element based off of dom element
     * @returns {array} Array of inputs for this survey tool
     */
    makeSubQuestion : function(el, inputs) {
        var rowLabel = el.find('td:first span');
        var rowImg = el.find('img')
        rowImg.remove();
        var rowType = inputs.eq(0).attr('type');

        // Set a rowid and colid - to help with set initial responses later.
        inputs.attr("rowid", String(this.subquestions.length));
        $.each(inputs, function(colid, input){
            $(input).attr("colid", String(colid));
        });

        this.subquestions.push({
            'id': String(this.subquestions.length),
            'type':rowType,
            'label':rowLabel,
            'image':rowImg.attr('src'),
            'inputs': inputs
        });
    },
    /**
     * Gets the response from the component in a Dimensions format
     * @returns {object|null} Response object or null if component is null
     */
    getResponse : function() {
        if (this.component!=null) {
            var dimResp = this.component.getDimenResp();
            return (dimResp) ? dimResp.Response : null;
        }
        return null;
    },
    /**
     * Helper to set an other specify response
     * @param {array} - The response array with value to be set based on the otherid
     */
    setOtherSpecify : function(response) {
        var that = this;
        $.each(this.inputs.filter(":checked"), function(i, e) {
            if ($(e).attr('otherid') != '') {
                that.inputs.filter('[id='+$(e).attr('otherid')+']').val(response[$(e).val()]);
            }
        });
    },
    /**
     * Helper to clear all of the existing form inputs
     */
    clearInputs : function() {
        $.each(this.inputs, function() {
            switch(this.type) {
                case 'password':
                case 'select-multiple':
                case 'select-one':
                case 'text':
                case 'textarea':
                    $(this).val('');
                    break;
                case 'checkbox':
                case 'radio':
                    this.checked = false;
            }
        });
    },
    /**
     * Loads the dependencies in a lazy load fashion
     * @returns {object} A deferred promise object
     */
    create: function(){
        pageLayout.lazyLoad(this.getDependencies(),this.build,this);
        return this.deferred.promise();
    },
    /**
     * Builds the survey tool
     */
    build: function(){},
    /**
     * Renders the survey tool to the container
     */
    render:function(){
        $.event.trigger({type:'SurveyEngineEvent', eventType: 'surveytool_prerender', message: 'Survey Tool render called'});
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
        this.nativeContainer.after(this.componentContainer);
        if (pageLayout.showonly)
            this.component.renderSD(this.componentContainer.get(0));
        else
            this.component.renderDC(this.componentContainer.get(0));
        this.nativeContainer.hide();
        this.setInitialResponses();
        $.event.trigger({type:'SurveyEngineEvent', eventType: 'surveytool_postrender', message: 'Survey Tool render completed'});
    },
    /**
     * Sets the global, custom and tool specific options for this survey tool
     */
    config: function() {
        $.event.trigger({type:'SurveyEngineEvent', eventType: 'surveytool_config', message: 'Survey Tool config called'});
        $.extend(this.options,this.toolOptions());
        $.extend(this.options,this.customProps);
        for (var prop in this.options) {
            if (typeof this.options[prop] === "string")
                this.options[prop] = pageLayout.resolveFilePath(this.options[prop]);
        }

    },
    /**
     * Helper function which updates a property value to the int representation
     * @param {object} Object which contains the property
     * @param {string} Property name
     */
    setColor: function(obj, name){
        obj[name] = parseInt(obj[name]);
    },
    /**
     * Formats the survey tool options into the qstudio based format
     * @returns {object}
     */
    params: function() {
        // TODO: Consider moving to build area instead for case insensitive
        // convert the options into qstudio params (case insensitive)
        $.event.trigger({type:'SurveyEngineEvent', eventType: 'surveytool_preparams', message: 'Survey Tool params called'});
        var compParamsList = [];
        var paramsArray = this.component.params();
        for (var i=0, tot=paramsArray.length; i < tot; i++) {
            compParamsList.push(paramsArray[i].parameter);
        }

        for (var prop in this.customProps) {
            var compProp = $.grep(compParamsList, function(o) {
                return o.toLowerCase()==prop.toLowerCase();
            });
            if (compProp.length == 1) this.options[compProp[0]] = this.options[prop];
        }

        var params = [];
        for (var prop in this.options) {
            if (prop.toLowerCase().indexOf("color")>-1) this.setColor(this.options, prop);
            params.push({ parameter : prop, paramvalue: this.options[prop]})
        }
        $.event.trigger({type:'SurveyEngineEvent', eventType: 'surveytool_postparams', message: 'Survey Tool params completed'});
        return params;
    },
    /**
     * Gets the question label from the native container
     * @returns {string}
     */
    getLabel : function() {
        return this.nativeContainer.find('.mrQuestionText').eq(0).clone();
    },
    /**
     * Gets the inputs for this question from the native container
     * @returns {array}
     */
    getInputs : function (){
        return this.nativeContainer.find(':input');
    },
    /**
     * Gets the native container for this question
     */
    getNativeContainer : function (allQuestionContainers) {
        for(var i=0;i<allQuestionContainers.length;i++){
            var jThis = allQuestionContainers.eq(i);
            var name = jThis.attr("questionname");
            if (name == this.questionFullName || name == this.questionName)
                return jThis;
        }
        for(var i=0;i<allQuestionContainers.length;i++){
            var jThis = allQuestionContainers.eq(i);
            var page = jThis.attr("questionname").split('.');
            var name = page.slice(1).join(".");
            if (name == this.questionFullName || name == this.questionName)
                return jThis;
        }
        console.log("No Question Container Found for " + this.questionFullName);
    },
    /**
     * Sets the tool specific properties.
     */
    toolOptions : function() {}
}
