/**
 * autosum class
 * Inherits from SESurveyTool
 */
function clicktosubmit(questionContainers, json, globalOpts) {

    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
clicktosubmit.prototype = Object.create(SESurveyTool.prototype);
clicktosubmit.prototype.type = function() {
    return "clicktosubmit";
}
clicktosubmit.prototype.getDependencies = function() {
    return [];
}


clicktosubmit.prototype.setResponses = function() {

}

clicktosubmit.prototype.build = function() {
    if(typeof this.nativeContainer!="undefined"){
    this.nativeContainer.find("input[type='radio']").click(function() {
        var otherid = $(this).attr('otherid');
        if (otherid == "") {
            pageLayout.next.click();
        }
    });
	}
    this.deferred.resolve();

}

clicktosubmit.prototype.render = function() {}


clicktosubmit.prototype.toolOptions = function() {
	$.extend(this.options,this.options.clicktosubmit);
            return {
				row: {
					extrasmall: {},
					small: {},
					medium: {},
					large: {},
					extralarge: {}
				},
				grid: {
					extrasmall: {},
					small: {},
					medium: {},
					large: {},
					extralarge: {}
				},
				column: {
					extrasmall: {},
					small: {},
					medium: {},
					large: {},
					extralarge: {}
				},
				rowGrid: {
					extrasmall: {},
					small: {},
					medium: {},
					large: {},
					extralarge: {}
				},
				columnGrid: {
					extrasmall: {},
					small: {},
					medium: {},
					large: {},
					extralarge: {}
				}
            }
}