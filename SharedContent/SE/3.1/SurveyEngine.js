/**
 * @property {SurveyPage} surveyPage The SurveyPage object. Initialized by {@link initSurveyEngine}
 * @see initSurveyEngine
 * @see SurveyPage
 */
var surveyPage;
/**
 * @property {SurveyTool} firstQues - The first survey tool built. Same as surveyPage.questions[0].
 * @see SurveyPage#questions
 */
var firstQues;
/**
 * @property {SurveyTool} lastQues - The last survey tool built.  Same as surveyPage.questions[surveyPage.questions.length-1].
 * @see SurveyPage#questions
 */
var lastQues;

/**
 * Initializes the survey engine.
 * Loads the data and renders the survey tools
 */
function initSurveyEngine() {
    try {
        surveyPage = new SurveyPage(); // create the global survey page.
        surveyPage.init();
        return surveyPage.deferred.promise();
    } catch (err) {
        handleSurveyEngineError(err);
    }
}

/**
 * Represents the survey page questions that have components.
 *
 * Creates a Survey Page object
 * @constructor
 */
var SurveyPage = function() {
    /** @property {SurveyTool[]} questions - Survey tools */
    this.questions = [];
    /** @property {JSON[]} qJSON - original qJSON generated by MDD */
    this.surveyData = qJSON;
    /** @property {jQueryObject[]} questionContainers - All the question containers */
    this.questionContainers = pageLayout.questions;
    /** @property {String} path - location of current survey engine version */
    this.path = pageLayout.sharedContent + "SE/"; //updated for tool versioning
    /** @property {String} imagesPath - location of survey engine images */
    this.imagesPath = pageLayout.themePath + "se/images/";
    /** @property {String} toolsPath - location of survey tools  */
    this.toolsPath = this.path + "SurveyTools/"; //updated for tool versioning
    /** @property {String} toolVersion - interactive tool version  */
    this.toolVersion;
    /** @property {Deferred} deferred - jQuery deferred object used to identify with the engine is done */
    this.deferred = new $.Deferred();
    this.options = {};
    this.opCoStyles = {};
	this.themeRuleSetprops={};
}
SurveyPage.prototype = {
    /**
     * Initialize the  SurveyPage
     */
    init: function() {
        $.event.trigger({
            type: 'SurveyEngineEvent',
            eventType: 'engine_init',
            message: 'Survey Engine initialize called'
        });
        try {
            this.initThemeOptions();
            if (typeof surveyPlatform != "undefined" && surveyPlatform == "Nfield") {
                $(".mrClear").click(function() {
                    window.setTimeout(function() {
                        $(surveyPage.questions).each(function(i, q) {
                            q.componentContainer.remove();
                        });
                        initSurveyEngine();
                    }, 500);
                });
            }
        } catch (err) {
            handleSurveyEngineError(err);
        }
    },

    /**
     * Loads default options for the survey page theme // TODO: Will expect SurveyEngineOptions.js from LAF.. must update LAF first.  Cross Domain needed for mrStudio
     */
    initThemeOptions: function() {
        $.event.trigger({
            type: 'SurveyEngineEvent',
            eventType: 'engine_loadThemeOptions',
            message: 'Survey Engine loading theme Options'
        });
        var that = this;
        var updateOptions = function(data) {
            $.extend(true, that.options, data);
			surveyPage.themeRuleSetprops=data;
			
			var opcodatasetpath = false;	
			$.each(that.surveyData, function(index, json) {
				var thisPath;
				for (var i in json.CustomProps) {
					if (i.toLowerCase() == "opcodatasetpath") {
						opcodatasetpath = true;
						if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
							var url = pageLayout.resolveFilePath(pageLayout.imageCache + json.CustomProps[i]);
						} else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
							var url = pageLayout.resolveFilePath(pageLayout.sharedContent + pageLayout.themePath.substring(pageLayout.themePath.indexOf("LAF")) + "se/SurveyEngineOptions.js");
						}

						var opcostyles = function(data) {
							that.opCoStyles = data;
							that.loadDependencies();
						}

						$.when(
							jQuery.ajax({
								type: "GET",
								url: url,
								jsonpCallback: 'opcoToolOptions',
								contentType: "application/json",
								dataType: "jsonp",
								crossDomain: true
							})
						).then(opcostyles);
					}
				}

			});
			if(opcodatasetpath == false){
				that.loadDependencies(); // Dependencies will be loaded only once Theme Config Received
			}
        }
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            var url = pageLayout.resolveFilePath(pageLayout.themePath + "se/SurveyEngineOptions.js");
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            var url = pageLayout.resolveFilePath(pageLayout.sharedContent + pageLayout.themePath.substring(pageLayout.themePath.indexOf("LAF")) + "se/SurveyEngineOptions.js");
        }

        $.when(
            jQuery.ajax({
                type: "GET",
                url: url,
                jsonpCallback: 'surveyEngineOptions',
                contentType: "application/json",
                dataType: "jsonp",
                crossDomain: true
            })
        ).then(updateOptions);
    },
    /**
     * Loads dependencies for all of the survey tools on the page
     */
    loadDependencies: function() {
        $.event.trigger({
            type: 'SurveyEngineEvent',
            eventType: 'engine_dependencies',
            message: 'Survey Engine loading dependencies'
        });
        var that = this;
        var dependencies = [];
        var manifestpath;

        $.each(that.surveyData, function(index, json) {
            var thisPath;
            for (var i in json.CustomProps) {
                if (i.toLowerCase() == "opcodatasetpath") {
                    if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
                        var url = pageLayout.resolveFilePath(pageLayout.imageCache + json.CustomProps[i]);
                    } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
                        var url = pageLayout.resolveFilePath(pageLayout.sharedContent + pageLayout.themePath.substring(pageLayout.themePath.indexOf("LAF")) + "se/SurveyEngineOptions.js");
                    }

                    var opcostyles = function(data) {
                        that.opCoStyles = data;
                    }

                    $.when(
                        jQuery.ajax({
                            type: "GET",
                            url: url,
                            jsonpCallback: 'opcoToolOptions',
                            contentType: "application/json",
                            dataType: "jsonp",
                            crossDomain: true
                        })
                    ).then(opcostyles);
                }
            }

        });

        (typeof manifestLoc == "undefined" || manifestLoc == "") ? manifestpath = pageLayout.sharedContent + "SE/" + engVersion + "/manifest.js": manifestpath = pageLayout.imageCache + manifestLoc + "manifest.js";

        $.when(
            jQuery.ajax({
                type: "GET",
                url: manifestpath,
                jsonpCallback: 'manifest',
                contentType: "application/json",
                dataType: "jsonp",
                crossDomain: true
            })
        ).then(addversion);


        function addversion(data) {
            that.toolVersion = data;
            var customToolFlag = false;
            $.each(that.surveyData, function(index, json) {
                var thisPath;
                for (var i in json.CustomProps) {
                    if (i.toLowerCase() == "toolpath") {
					   if(typeof json.CustomProps.flaMetaType!="undefined")
					    thisPath = pageLayout.resolveFilePath(json.CustomProps[i]) + "//" + json.CustomProps.flaMetaType.toLowerCase() + '.js';
					   else if(typeof json.CustomProps.metaType!="undefined")
                        thisPath = pageLayout.resolveFilePath(json.CustomProps[i]) + "//" + json.CustomProps.metaType.toLowerCase() + '.js';
						dependencies.push({
                                'url': thisPath,
                                'type': 'script'
                            });
                        customToolFlag = true;
                        break;
                    }
                }
                if (customToolFlag == false) {
                     if(typeof json.CustomProps.metaType != 'undefined'||typeof json.CustomProps.flaMetaType != 'undefined'){
						if(typeof json.CustomProps.metaType != 'undefined')
						 var metaTypeArray = (json.CustomProps.metaType.toLowerCase()).split(",");
						else if(typeof json.CustomProps.flaMetaType != 'undefined')
						  var metaTypeArray = (json.CustomProps.flaMetaType.toLowerCase()).split(",");
						for (var j = 0; j < metaTypeArray.length; j++) {
							thisPath = that.toolsPath + metaTypeArray[j] + "/" + metaTypeArray[j] + "_" + data[metaTypeArray[j]].version + '.js';
							dependencies.push({
								'url': thisPath,
								'type': 'script'
							});
						}
					}
					//Allowing featureType also
					if(typeof json.CustomProps.featureType != 'undefined'){
						var featureTypeArray = (json.CustomProps.featureType.toLowerCase()).split(",");
						for (var j = 0; j < featureTypeArray.length; j++) {
							thisPath = that.toolsPath + featureTypeArray[j] + "/" + featureTypeArray[j] + "_" + data[featureTypeArray[j]].version + '.js';
							dependencies.push({
								'url': thisPath,
								'type': 'script'
							});
						}
					}

                }
                if (index == that.surveyData.length - 1)
                    pageLayout.lazyLoad(dependencies, that.loadQuestions, that);
            });
        }
    },
    /**
     * Instantiates and loads the questions
     */
    loadQuestions: function() {
        $.event.trigger({
            type: 'SurveyEngineEvent',
            eventType: 'engine_loadquestions',
            message: 'Survey Engine loadQuestions called'
        });
        var that = this;
        var promises = [];
        $.each(this.surveyData, function(index, json) {
            if(typeof json.CustomProps.metaType != 'undefined'||typeof json.CustomProps.flaMetaType != 'undefined'){
				if(typeof json.CustomProps.metaType != 'undefined')
				var metaTypeArray = (json.CustomProps.metaType.toLowerCase()).split(",");
				else if(typeof json.CustomProps.flaMetaType != 'undefined')
				var metaTypeArray = (json.CustomProps.flaMetaType.toLowerCase()).split(",");
				for (var k = 0; k < metaTypeArray.length; k++) {
					var temp = metaTypeArray[k];
					var q = new window[temp](that.questionContainers, json, that.options);
					promises.push(q.create());
					that.questions.push(q);
				}
			}
			//Allowing featureType also
			if(typeof json.CustomProps.featureType != 'undefined'){
				var featureTypeArray = (json.CustomProps.featureType.toLowerCase()).split(",");
				for (var k = 0; k < featureTypeArray.length; k++) {
					var temp = featureTypeArray[k];
					var q = new window[temp](that.questionContainers, json, that.options);
					promises.push(q.create());
					that.questions.push(q);
				}
			}
        });
        $.when.apply(this, promises).always(function() {
            that.render.apply(that)
        });
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
        $.event.trigger({
            type: 'SurveyEngineEvent',
            eventType: 'engine_complete',
            message: 'Survey Engine render completed'
        });
        $.when.apply(this, promises).always(function() {
            that.fixButtonText()
        });
    },
    /**
     * Applies a fix for text position when using a custom image for input
     */
    fixButtonText: function() {
        $(this.questions).each(function(i, q) {
            if (q.componentContainer == null) return;
            var buttons = q.componentContainer.find('.qwidget_button_background');
            buttons.each(function() {
                var jThis = $(this);
                if (jThis.css('background-image') != "none") {
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
    setResponsesAndSubmit: function(doSubmit) {
        var allowSubmit = true;
        $.event.trigger({
            type: 'SurveyEngineEvent',
            eventType: 'engine_submit',
            message: 'Survey Engine submit responses called'
        });
        $(surveyPage.questions).each(function(i, q) {
            q.setResponses();
        });
        return allowSubmit; // submit the page
    }
};


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
     * @param {Array} - Array of question containers
     * @param {json} - The question json
     * @param {object} - Global options from survey page
     */
    init: function(questionContainers, json, globalOpts) {
        /** @property {Deferred} deferred - The jQuery deferred object used to identify when the tool is done */
        this.deferred = new $.Deferred();
        /** @property {JSON} json - The json string passed to the HTML page from Dimensions for THIS tool*/
        this.json = json;
        /** @property {JSON} options - All combined survey tool options (global options+tool options+custom properties) */
        this.options = $.extend({}, globalOpts);
        /** @property {string} questionName - The question name in dot notation */
        this.questionName = json.QuestionName.replace(/\[\{/gi, ".").replace(/\]|\]\}/gi, "").replace(/\[/gi, "._");
        /** @property {string} questionFullName - The question full name in dot notation*/
        this.questionFullName = json.QuestionFullName.replace(/\[\{/gi, ".").replace(/\]|\]\}/gi, "").replace(/\[/gi, "._");
        /** @property {JSON} customProps - The custom properties for the tool from the MDD */
        this.customProps = json.CustomProps;
        /** @property {int|date} minVal - The minimum value for this question */
        this.minVal = (isNaN(json.min)) ? json.min : +json.min;
        /** @property {int|date} maxVal - The maximum value for this question */
        this.maxVal = (isNaN(json.max)) ? json.max : +json.max;
        /** @property {object} component - Set to the resulting tool. For GMI this will be the QStudio, for custom tools it will be the jQuery oject containing the tool. */
        this.component = null;
        /** @property {JQuery} componentContainer - The jQuery object that the component is appended to for rendering */
        this.componentContainer = null;
        /** @property {jQuery} nativeContainer - jQuery DOM object containing the original question */
        this.nativeContainer = this.getNativeContainer(questionContainers);
        /** @property {Array} subquestions - Sub questions for grid based questions */
        this.subquestions = [];
        /** @property {Array} columnheaders - Column headers for grid based questions */
        this.columnheaders = [];
        if(typeof this.nativeContainer!="undefined"){
		/** @property {JQuery} label - Question text */
        this.label = this.getLabel();
        /** @property {jQuery} inputs - All inputs pertaining to this question */
        this.inputs = this.getInputs();
		}
        this.config();
    },
    /**
     * A simple string tool name used as an identifier
     * @returns {string}
     */
    type: function() {
        return "";
    },
    /**
     * Sets the dependencies for this survey tool.
     *
     * Dependencies are usually javascript and css files required to build the survey tool
     */
    getDependencies: function() {},
    /**
     * Gets a property (case insensitive) from the list of supplied options.  If not options are supplied it defaults to base options
     * @param {string} - The property name to look for
     * @param {object} [objProps] - An object containing the properties
     * @returns {string|null}
     */
    getProperty: function(propName, objProps) {
        if (typeof objProps == 'undefined' || objProps == null) objProps = this.options;
        for (var i in objProps) {
            if (i.toLowerCase() == propName.toLowerCase()) return objProps[i];
        }
        return null;
    },


    /**
     * Set the initial response for the survey tool
     */
    setInitialResponses: function() {},
    /**
     * Set properties based on runtime logic and values
     */
    setRuntimeProps: function() {},
    /**
     * Set the responses from the component into the html form tags
     */
    setResponses: function() {},
    /**
     * Creates a set of subquestions from a grid question.
     */
    buildArraysFromGrid: function() {
        var that = this;

        // ranking grid headers are just count of iputs
        $.each(this.nativeContainer.find('tr'), function(i, e) {
            var el = $(e);
            var inputs = $(e).find('input');
            if (inputs.length <= 0) {
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
    makeSubQuestion: function(el, inputs) {
        var rowLabel = el.find('td:first span');
        var rowImg = el.find('img')
        rowImg.hide();
        var rowType = inputs.eq(0).attr('type');

        // Set a rowid and colid - to help with set initial responses later.
        inputs.attr("rowid", String(this.subquestions.length));
        $.each(inputs, function(colid, input) {
            $(input).attr("colid", String(colid));
        });

        this.subquestions.push({
            'id': String(this.subquestions.length),
            'type': rowType,
            'label': rowLabel,
            'image': rowImg.attr('src'),
            'inputs': inputs
        });
    },
    /**
     * Gets the response from the component in a Dimensions format
     * @returns {object|null} Response object or null if component is null
     */
    getResponse: function() {
        if (this.component != null) {
            var dimResp = this.component.getDimenResp();
            return (dimResp) ? dimResp.Response : null;
        }
        return null;
    },
    /**
     * Helper to set an other specify response
     * @param {array} - The response array with value to be set based on the otherid
     */
    setOtherSpecify: function(response) {
        var that = this;
        $.each(this.inputs.filter(":checked"), function(i, e) {
            if ($(e).attr('otherid') != '') {
                that.inputs.filter('[id=' + $(e).attr('otherid') + ']').val(response[$(e).val()]);
            }
        });
    },
    /**
     * Helper to clear all of the existing form inputs
     */
    clearInputs: function() {
        $.each(this.inputs, function() {
            switch (this.type) {
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
    create: function() {
        var dependencies = [];
        /*dependencies.push({
		        'type':'script',
                'url':surveyPage.path + '3.0/lib/qarts/qcreator/qcore/app_dev.js'
            });*/

        $.each(this.getDependencies(), function(i, e) {
            dependencies.push({
                'type': e.type,
                'url': e.url
            });
        });
        pageLayout.lazyLoad(dependencies, this.build, this);
        return this.deferred.promise();
    },
    /**
     * Builds the survey tool
     */
    build: function() {},
    /**
     * Renders the survey tool to the container
     */
    render: function() {
        $.event.trigger({
            type: 'SurveyEngineEvent',
            eventType: 'surveytool_prerender',
            message: 'Survey Tool render called'
        });
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id', 'qc_' + this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
        this.nativeContainer.after(this.componentContainer);
        this.nativeContainer.hide();
        this.setInitialResponses();
        $.event.trigger({
            type: 'SurveyEngineEvent',
            eventType: 'surveytool_postrender',
            message: 'Survey Tool render completed'
        });
		
		$( '[id^="container_"]' ).each(function( index ) {
			if($.trim($(this).html()) != ''){
				$(this).css("min-height","15rem");
			}
		});
    },
    /**
     * Sets the global, custom and tool specific options for this survey tool
     */
    config: function() {
        $.event.trigger({
            type: 'SurveyEngineEvent',
            eventType: 'surveytool_config',
            message: 'Survey Tool config called'
        });
        var that = this;
        $.extend(true, this.options, this.toolOptions());
        var defprop = this.toolOptions();
        for (var prop in defprop) {
            for (var innerprop in defprop[prop])
                that.options[prop][innerprop] = defprop[prop][innerprop]
        }

        //OpCo sets will be pushed here
        $.extend(true, this.options, surveyPage.opCoStyles);
        for (var i in that.customProps) {
            var splitparam = i.split("$")

            $.each(splitparam, function(key, value) {
                splitparam[key] = value.toLowerCase();
                if (value.toLowerCase() == "rowgrid")
                    splitparam[key] = "rowGrid"
                if (value.toLowerCase() == "columngrid")
                    splitparam[key] = "columnGrid"
            });
            if (splitparam.length == 1)
                this.options[splitparam[0]] = this.customProps[i];
            else if (splitparam.length == 2)
                this.options[splitparam[0]][splitparam[1]] = this.customProps[i];
            else if (splitparam.length == 3){
			     if(splitparam[1].toLowerCase()=="all"){				 
				    splitparam[1]="extrasmall";
					this.options[splitparam[0]][splitparam[1]][splitparam[2]] = this.customProps[i];
					splitparam[1]="small";
					this.options[splitparam[0]][splitparam[1]][splitparam[2]] = this.customProps[i];
					splitparam[1]="medium";
					this.options[splitparam[0]][splitparam[1]][splitparam[2]] = this.customProps[i];
					splitparam[1]="large";
					this.options[splitparam[0]][splitparam[1]][splitparam[2]] = this.customProps[i];
					splitparam[1]="extralarge";
					this.options[splitparam[0]][splitparam[1]][splitparam[2]] = this.customProps[i];
					 
				 }else{
				   this.options[splitparam[0]][splitparam[1]][splitparam[2]] = this.customProps[i];
				 }
			}
			
			//console.log(eval("this.options[splitparam[0]].extrasmall."+[splitparam[2]));	
        }
        $.extend(this.options, this.customProps);
        // convert the options to case insensitive
        var compParamsList = [];
        var paramsArray = defprop;
        for (var prop in this.options) {
            compParamsList.push(prop);
        }
        for (var prop in this.customProps) {

            var compProp = $.grep(compParamsList, function(o) {
                return o.toLowerCase() == prop.toLowerCase();
            });
            if (compProp.length == 1) this.options[compProp[0]] = this.customProps[prop];
        }

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
    setColor: function(obj, name) {
        obj[name] = parseInt(obj[name]);
    },
    /**
     * Formats the survey tool options into the qstudio based format
     * @returns {object}
     */
    params: function() {
        // TODO: Consider moving to build area instead for case insensitive
        // convert the options into qstudio params (case insensitive)
        $.event.trigger({
            type: 'SurveyEngineEvent',
            eventType: 'surveytool_preparams',
            message: 'Survey Tool params called'
        });
        var compParamsList = [];
        var paramsArray = this.component.params();
        for (var i = 0, tot = paramsArray.length; i < tot; i++) {
            compParamsList.push(paramsArray[i].parameter);
        }

        for (var prop in this.customProps) {
            var compProp = $.grep(compParamsList, function(o) {
                return o.toLowerCase() == prop.toLowerCase();
            });
            if (compProp.length == 1) this.options[compProp[0]] = this.options[prop];
        }

        var params = [];
        for (var prop in this.options) {
            if (prop.toLowerCase().indexOf("color") > -1) this.setColor(this.options, prop);
            params.push({
                parameter: prop,
                paramvalue: this.options[prop]
            })
        }
        $.event.trigger({
            type: 'SurveyEngineEvent',
            eventType: 'surveytool_postparams',
            message: 'Survey Tool params completed'
        });
        return params;
    },
    /**
     * Gets the question label from the native container
     * @returns {string}
     */
    getLabel: function() {
        return this.nativeContainer.find('.mrQuestionText').parent().eq(0).clone();
        //return this.nativeContainer.find('.mrQuestionText').eq(0).clone();
    },
    /**
     * Gets the inputs for this question from the native container
     * @returns {array}
     */
    getInputs: function() {
        return this.nativeContainer.find(':input');
    },
    /**
     * Gets the native container for this question
     */
    getNativeContainer: function(allQuestionContainers) {
        for (var i = 0; i < allQuestionContainers.length; i++) {
            var jThis = allQuestionContainers.eq(i);
            var name = jThis.attr("questionname");
            if (name == this.questionFullName || name == this.questionName)
                return jThis;
        }
        for (var i = 0; i < allQuestionContainers.length; i++) {
            if (typeof allQuestionContainers.eq(i).attr("questionname") != "undefined") {
                var jThis = allQuestionContainers.eq(i);
                var page = jThis.attr("questionname").split('.');
                var name = page.slice(1).join(".");
                if (name == this.questionFullName || name == this.questionName)
                    return jThis;
            }
        }
        console.log("No Question Container Found for " + this.questionFullName);
    },

    /**
     * Sets the tool specific properties.
     */
    toolOptions: function() {}
}