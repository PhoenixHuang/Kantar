/**
 * autosum class
 * Inherits from SESurveyTool
 */
function autosum(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
autosum.prototype = Object.create(SESurveyTool.prototype);
autosum.prototype.type = function() {
    return "autosum";
}
autosum.prototype.getDependencies = function() {
    return [{
        'type': 'stylesheet',
        'url': surveyPage.path + 'lib/KO/autosum/1.0/basictable.css'
    }, {
        'type': 'script',
        'url': surveyPage.path + 'lib/KO/autosum/1.0/jquery.basictable.min.js'
    }];
}


autosum.prototype.setResponses = function() {



}
var qc = 1; // question count
autosum.prototype.build = function() {

    var autosumtype = this.getProperty("autosumtype");
    var rowsumcolor = this.getProperty("rowsumcolor");
    var columnsumcolor = this.getProperty("columnsumcolor");
    var grandtotalcolor = this.getProperty("grandtotalcolor");
    var autosumtextcolor = this.getProperty("autosumtextcolor");
    var autosumlabel = this.getProperty("autosumlabel");
    var autosumlabelfontweight = this.getProperty("autosumlabelfontweight");
    var autosumlabelfontsize = this.getProperty("autosumlabelfontsize");
    var totaladduptovalue = this.getProperty("totaladduptovalue");
    var totalposition = this.getProperty("position");
    var responsivegrid = this.getProperty("responsivegrid");
    var headersbold = this.getProperty("headersbold");
    var tableborder = this.getProperty("tableborder");

    // Getting table Object from DOM
    var $table = this.nativeContainer.find('table');
    $table.attr("count", qc);

    if (headersbold) {
        this.nativeContainer.find(".table .mrGridQuestionText, .table .mrGridCategoryText").css('font-weight', 'bold');
    }
	if (tableborder == false) {
        $table.removeClass( "table-bordered" );
    }

    this.nativeContainer.find(".table .mrGridQuestionText, .table .mrGridCategoryText").css('width', '');
    this.nativeContainer.find("table td, table th").css('background-color', '');

    // Finding autosum type using table rows & columns for without slice question
    var colCount = $table.find('tr:first > td').length;
    var rowCount = $table.find('tr').length;

    // Duplicate last row and appending as last row to table for calculate column sums
    $table.find('#col_total').remove();

    //This condition for Grid headers
    if ($table.find('tr td[rowspan]').length > 0) {
        var tds = '<tr id="col_total"><td></td>' + $table.find('tr:last').html() + '</tr>';
        $table.append(tds);
        $table.find('tr:last td:eq(1)').html("");
    } else {
        var tds = '<tr id="col_total">' + $table.find('tr:last').html() + '</tr>';
        $table.append(tds);
    }




    // Updating selectors for column sums
    var cc = 1; // column count
    $table.find('tr:last td input').each(function() {
        $(this).attr({
            "id": "col_total_" + qc + "_" + cc,
            "name": "col_total_" + qc + "_" + cc,
            "class": "col_total form-control"
        });
        $(this).prop("readonly", true);
        $(this).prop("tabindex", -1);
        $(this).next('label').remove();
        cc++;
    });




    // Duplicate last column and appending as last column to table for calculate row sums
    $table.find('.row_total').remove();
    var rc = 1; // row count
    $table.find('tr').each(function() {
        $(this).append('<td>' + $(this).find('td:last').html() + '</td>');

        // Updating selectors for row sums
        $(this).find('td:last input').attr({
            "id": "row_total_" + qc + "_" + rc,
            "name": "row_total_" + qc + "_" + rc,
            "class": "row_total form-control"
        });
        $(this).find('td:last input').prop("readonly", true);
        $(this).find('td:last input').prop("tabindex", -1);
        $(this).find('td:last input + label').remove();
        rc++;
    });



    //Row sum, column sum labels
    if ($table.find('tr:first td:last span').length < 1) {
        $table.find('tr:first td:last').html("").append($("<span>"))
    }
    if ($table.find(".mrGridQuestionText").length > 0) {
        $table.find('tr:first td:last span').text(autosumlabel).css({
            "font-size": autosumlabelfontsize + "px",
            "font-weight": autosumlabelfontweight
        });
    }
    if ($table.find('tr:last td:first span').length < 1) {
        $table.find('tr:last td:first').html("").append($("<span>"))
    }
    $table.find('tr:last td:first span').text(autosumlabel).css({
        "font-size": autosumlabelfontsize + "px",
        "font-weight": autosumlabelfontweight
    });


    // Updating selectors for Grand sum
    $table.find('tr:last td:last input').attr({
        "name": "grand_total_" + qc,
        "id": "grand_total_" + qc,
        "class": "form-control grand_total_" + qc
    });


    // Column sum bgcolor & border
    $table.find('tr:last td input').each(function() {
        $(this).css({
            "background-color": columnsumcolor,
            "border-color": columnsumcolor,
            "color": autosumtextcolor,
            "border-style": "solid"
        });
    });




    // Row sum bgcolor & border
    $table.find('tr').each(function() {
        $(this).find('td:last input').css({
            "background-color": rowsumcolor,
            "border-color": rowsumcolor,
            "color": autosumtextcolor,
            "border-style": "solid"
        });
    });


    // Grand sum bgcolor & border
    $table.find('tr:last td:last input').css({
        "background-color": grandtotalcolor,
        "border-color": grandtotalcolor,
        "color": autosumtextcolor,
        "border-style": "solid",
        "display": "block"
    });



    // Hide row sums when autosumType is column
    if (autosumtype == "column") {
        $table.find('tr:first td:last span').css("display", "none");

        $table.find('tr').each(function() {
            $(this).find('td:last').addClass('hidden');
        });
    }


    // Hide column sums when autosumType is row
    if (autosumtype == "row") {
        $table.find('tr:last td:first span').css("display", "none");

        $table.find('tr:last').addClass('hidden');
    }


    var that = this;

    $(this.inputs.filter("input[type=text], input[type=number]")).keyup(function() {
        that.autosumInputs($table);
    }).blur(function() {
        that.autosumInputs($table);
    });

    this.autosumInputs($table);


    // Applying Above & Below for with slice questions
    var grandTotalVal = $table.find('#grand_total_' + qc).val();
    var positionString = "<div class='autosumPos_" + qc + "'><span style='font-weight: " + autosumlabelfontweight + "; font-size: " + autosumlabelfontsize + "px;'>" + autosumlabel + "</span>:<span class='sumval' style='background-color: " + grandtotalcolor + ";color:" + autosumtextcolor + "'>" + grandTotalVal + "</span></div>";

    if (totalposition == 'above') {
        $table.find('.autosumPos').remove();
        $table.before(positionString);
        $table.find('tr:last td:last input').css("display", "none");
    } else if (totalposition == 'below') {
        $table.find('.autosumPos').remove();
        $table.after(positionString);
        $table.find('tr:last td:last input').css("display", "none");
    }


    //$(".table td, .table th").css('padding','0.3rem');


    // Default disabled when totaladduptovalue morethan 0
    if (totaladduptovalue > 0) {
        pageLayout.tempNext.hide();
    }

    //$(".autosumPos").draggable(); // We are added dragging feature just for testing 

    //Hide multiple error messages

    $table.find('.mrErrorText').hide();
    $table.find('tr').each(function() {
        $(this).find('td:first .mrQuestionText .mrErrorText:first').show();
    });


    qc++;

    if (responsivegrid == true) {
        $table.basictable({
            tableWrapper: true
        });

        if (isMobile.any()) {
            if ($table.find(".mrGridQuestionText").length > 0) {
                $table.find('tr:first').remove();
            }
        }
    }

    this.deferred.resolve();
}

autosum.prototype.render = function() {

}

autosum.prototype.autosumInputs = function($table) {

    var decimalpositions = this.getProperty("decimalpositions");
    var decimalseparater = this.getProperty("decimalseparater");
    var totaladduptovalue = this.getProperty("totaladduptovalue");

    // calculate row totals
    $table.find('tr').each(function() {
        var td = $(this).find('td');
        var totalrows = 0.00;

        for (var i = 0; i < td.length - 1; i++) {

            var inputrowval = $(this).find('td:eq(' + i + ') input').val();
            if (typeof inputrowval != 'undefined') {
                if (inputrowval == "") {
                    totalrows = parseFloat(totalrows) + 0.00;
                } else {
                    inputrowval = inputrowval.replace(decimalseparater, ".");
                    totalrows = parseFloat(totalrows) + parseFloat(inputrowval);
                }
            }
        }

        var afterDecimalRows = totalrows.toFixed(decimalpositions);
        if (afterDecimalRows != 'NaN') {
            $(this).find('td:eq(' + (td.length - 1) + ') input').val(afterDecimalRows.replace(".", decimalseparater));
        }
    });

    // calculate col totals

    var colCount = $table.find('tr:first > td').length;
    var rowCount = $table.find('tr').length;
    for (var i = 0; i < colCount; i++) {
        var colTotal = 0.00;
        for (var j = 0; j < rowCount - 1; j++) {
            var inputVal = $table.find('tr:eq(' + j + ') td:eq(' + i + ') input').val();
            if (typeof inputVal != 'undefined') {
                if (inputVal == "") {
                    colTotal = parseFloat(colTotal) + 0.00;
                } else {
                    inputVal = inputVal.replace(decimalseparater, ".");
                    colTotal = parseFloat(colTotal) + parseFloat(inputVal);
                }

            }
        }
        var afterDecimal = colTotal.toFixed(decimalpositions);
        if (afterDecimal != 'NaN') {
            $table.find('tr:eq(' + j + ') td:eq(' + i + ') input').val(afterDecimal.replace(".", decimalseparater));
        }
    }
    var tableCount = $table.attr('count');
    var grandTotalVal = $table.find('#grand_total_' + tableCount).val();
    $('.autosumPos_' + tableCount + ' .sumval').html(grandTotalVal);

    if (totaladduptovalue > 0) {
        var grandTotal = grandTotalVal.replace(decimalseparater, ".")
        if (totaladduptovalue == grandTotal) {
            pageLayout.tempNext.show();
        } else {
            pageLayout.tempNext.hide();
        }
    }
}
autosum.prototype.toolOptions = function() {
    $.extend(this.options,this.options.autosum);
    return {
        'autosumtype': "multi",
        'decimalpositions': 0,
        'autosumlabel': "Sum",
        'autosumlabelfontweight': "bold",
        'autosumlabelfontsize': 18,
        'position': "table",
        'decimalseparater': ".",
        'totaladduptovalue': 0,
        'headersbold': true,
        'tableborder': true,
        'responsivegrid': false
    }

}

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};