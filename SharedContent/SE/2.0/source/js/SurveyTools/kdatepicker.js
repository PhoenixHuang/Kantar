/**
 * kdatepicker class
 * Inherits from SESurveyTool
 */
function kdatepicker(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
kdatepicker.prototype = Object.create(SESurveyTool.prototype);
kdatepicker.prototype.type = function(){
    return "kdatepicker";
}
kdatepicker.prototype.getDependencies = function(){
    return [
        // {'type':'script', 'url' : surveyPage.path + 'lib/jquery/jquery-ui.js'},
        // {'type':'stylesheet', 'url' : surveyPage.path + 'lib/KO/kdatepicker/kdatepicker.css'}
        {'type':'script', 'url' : 'http://ajax.googleapis.com/ajax/libs/jqueryui/' + jQueryUIVersion +'/jquery-ui.min.js'},
        {'type':'stylesheet', 'url' : 'http://ajax.googleapis.com/ajax/libs/jqueryui/' + jQueryUIVersion + '/themes/' + jQueryUICSS + '/jquery-ui.min.css'}
    ];
}
kdatepicker.prototype.build = function(){

    this.config()

    // TODO Deal with different Date formats
    var lang = document.documentElement.lang

    // TODO - If more then 1 datepicker it fails.. Need to fix
    // console.log(this.inputs.attr('id'))

    this.inputs.datepicker({
//        dateFormat : 'dd/mm/yy',
        showOtherMonths: true,
        minDate : this.minVal,  // TODO - Date is formatted as server, but jQuery is US Format.
        maxDate : this.maxVal,  // TODO - Date is formatted as server, but jQuery is US Format.
        changeMonth : (this.getProperty("dpChangeMonth") != true) ? false : true,
        changeYear : (this.getProperty("dpChangeYear") != true) ? false : true,
        dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    });

    this.deferred.resolve();

}
kdatepicker.prototype.render = function (){
    // Nothing
}
kdatepicker.prototype.toolOptions = function() {
    switch(pageLayout.deviceType.toUpperCase()) {
        case "LARGETABLET":
        case "MEDIUMTABLET":
        case "SMALLTABLET":
        case "SMARTPHONETOUCH":
            return  {
            }
        case "PC":
        case "OTHERDEVICE":
        default:
            return {
            }
    }
}