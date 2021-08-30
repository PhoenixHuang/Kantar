/**
 * autosum class
 * Inherits from SESurveyTool
 */
function responsivegrid(questionContainers, json, globalOpts) {

    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
responsivegrid.prototype = Object.create(SESurveyTool.prototype);
responsivegrid.prototype.type = function() {
    return "responsivegrid";
}
responsivegrid.prototype.getDependencies = function() {
    return [{
        'type': 'stylesheet',
        'url': surveyPage.path + 'lib/KO/responsivegrid/1.0/basictable.css'
    }, {
        'type': 'script',
        'url': surveyPage.path +'lib/KO/responsivegrid/1.0/jquery.basictable.min.js'
    }];
}


responsivegrid.prototype.setResponses = function() {

}

responsivegrid.prototype.build = function() {

    var $table = this.nativeContainer.find('table');
    var $firstTR = $table.find('tr:first').html();
    $table.find('tr:first').remove();
    $table.prepend("<thead>" + $firstTR + "</thead>");
    $table.find('thead tr:first td:first').prepend('<div class="mrQuestionText" style="width: 100%;"> &nbsp; &nbsp; &nbsp;</div>');
    $table.basictable({
        tableWrapper: true
    });


    $table.find('tr').each(function() {

        $(this).find('td:first').css({
            "width": ""
        });
    });

    $table.find('tr:first td').each(function() {

        $(this).css({
            "width": ""
        });
    });

    this.deferred.resolve();

}

responsivegrid.prototype.render = function() {

}

responsivegrid.prototype.toolOptions = function() {
    $.extend(this.options, this.options.responsivegrid);

    return {}
}