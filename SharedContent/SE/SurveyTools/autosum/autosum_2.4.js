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
    return [

    ];
}


autosum.prototype.setResponses = function() {



}
var qc = 0; // question count
autosum.prototype.build = function() {

var autosumtype = this.getProperty("autosumType");
    var rowsumcolor = this.getProperty("rowsumcolor");
    var columnsumcolor = this.getProperty("columnsumcolor");
    var grandtotalcolor = this.getProperty("grandtotalcolor");
	var autosumtextcolor= this.getProperty("autosumtextcolor");
    var autosumlabel = this.getProperty("autosumlabel");
    var autosumlabelfontweight = this.getProperty("autosumlabelfontweight");
	var autosumlabelfontsize = this.getProperty("autosumlabelfontsize");


    // Getting table Object from DOM
    var $table = this.nativeContainer.find('table tbody');

	$table.find('#col_total').remove();
	$table.find('.row_total').remove();

    // Finding autosum type using table rows & columns for without slice question
    var colCount = $table.find('tr:first > td').length;
    var rowCount = $table.find('tr').length;

    if (colCount <= 2) {
        autosumtype = "column"
    }
    if (rowCount <= 2) {
        autosumtype = "row"
    }

	
    // Duplicate last row and appending as last row to table for calculate column sums
	$table.find('#col_total').remove();
    var tds = '<tr id="col_total">' + $table.find('tr:last').html() + '</tr>';
    $table.append(tds);


    // Updating selectors for column sums
    var cc = 0; // column count
    $table.find('tr:last td input').each(function() {
        $(this).attr({
            "id": "col_total_" + qc + "_" + cc,
            "name": "col_total_" + qc + "_" + cc,
            "class": "col_total"
        });
        $(this).prop("readonly", true);
		$(this).prop("tabindex", -1);
        cc++;
    });


    // Duplicate last column and appending as last column to table for calculate row sums
	$table.find('.row_total').remove();
    var rc = 0; // row count
    $table.find('tr').each(function() {
        $(this).append('<td class="row_total">' + $(this).find('td:last').html() + '</td>');

        // Updating selectors for row sums
        $(this).find('td:last input').attr({
            "id": "row_total_" + qc + "_" + rc,
            "name": "row_total_" + qc + "_" + rc
        });
        $(this).find('td:last input').prop("readonly", true);
		$(this).find('td:last input').prop("tabindex", -1);
        rc++;
    });


    //Row sum, column sum labels
    if($table.find('tr:first td:last span').length < 1){
		$table.find('tr:first td:last').html("").append($("<span>"))
	}
    $table.find('tr:first td:last span').text(autosumlabel).css({
		"font-size": autosumlabelfontsize+"px",
        "font-weight": autosumlabelfontweight
    });
	if($table.find('tr:last td:first span').length < 1){
		$table.find('tr:last td:first').html("").append($("<span>"))
	}
    $table.find('tr:last td:first span').text(autosumlabel).css({
		"font-size": autosumlabelfontsize+"px",
        "font-weight": autosumlabelfontweight
    });

    // Updating selectors for Grand sum
    $table.find('tr:last td:last input').attr({
        "name": "grand_total",
        "id": "grand_total",
        "class": "grand_total"
    });

    // Column sum bgcolor & border
    $table.find('tr:last td input').each(function() {
        $(this).css({
            "background-color": columnsumcolor,
            "border-color": columnsumcolor,
			"color":autosumtextcolor,
			"border-style": "solid"
        });
    });

 
 


    // Row sum bgcolor & border
    $table.find('tr').each(function() {
        $(this).find('td:last input').css({
            "background-color": rowsumcolor,
            "border-color": rowsumcolor,
			"color":autosumtextcolor,
			"border-style": "solid"
        });
    });


    var that = this;

    $(this.inputs.filter("input[type=text]")).keyup(function() {
        that.autosumInputs($table);
        that.autosumPositions($table, colCount, rowCount);
    }).blur(function() {
        that.autosumInputs($table);
        that.autosumPositions($table, colCount, rowCount);
    });

    this.autosumInputs($table);


    // Hide row sums when autosumType is column
    if (autosumtype == "column") {
        $table.find('tr').each(function() {
            $(this).find('td:last input').css({
                "display": "none"
            });
        });
		
        $table.find('tr:first td:last span').css("display", "none");
    }

    // Hide column sums when autosumType is row
    if (autosumtype == "row") {
        $table.find('tr:last td input').each(function() {
            $(this).css({
                "display": "none"
            });
        });
        $table.find('tr:last td:first span').css("display", "none");
    }

    // Grand sum bgcolor & border
    $table.find('tr:last td:last input').css({
        "background-color": grandtotalcolor,
		"border-color": rowsumcolor,
		"color":autosumtextcolor,
		"border-style": "solid",
        "display": "block"
    });

    // Hide Grand total for with out slice questions 
    if (colCount <= 2 || rowCount <= 2) {
        $table.find('tr:last td:last input').css("display", "none");
    }
    this.autosumPositions($table, colCount, rowCount);
    
	//$(".autosumPos").draggable(); // We are added dragging feature just for testing 
    //this.nativeContainer.hide();
    qc++;
	
	
	this.componentContainer = $('<div>');
    this.componentContainer.attr('id','qc_'+this.questionName); //change to be more identifable with question?
    this.componentContainer.addClass('qcContainer');
    this.nativeContainer.after(this.componentContainer);
	this.componentContainer.hide();
	
    this.deferred.resolve();

}

autosum.prototype.render = function() {
	
}



autosum.prototype.autosumPositions = function($table, colCount, rowCount) {

    var rowsumcolor = this.getProperty("rowsumcolor");
    var columnsumcolor = this.getProperty("columnsumcolor");
    var grandtotalcolor = this.getProperty("grandtotalcolor");	
	var autosumtextcolor= this.getProperty("autosumtextcolor");
    var autosumlabel = this.getProperty("autosumlabel");
    var autosumlabelfontweight = this.getProperty("autosumlabelfontweight");
	var autosumlabelfontsize = this.getProperty("autosumlabelfontsize");
    var totalposition = this.getProperty("position");

    if (colCount <= 2 || rowCount <= 2) {

        // Applying Above & Below for without slice questions

        $table.find('tr:last td:last input').css("display", "none");

        var grandTotalVal = 0;
        var colorCode = ""

        // Getting column total value and hiding from table
        if (colCount <= 2) {
            grandTotalVal = $table.find('tr:last td:eq(1) input').val();
            colorCode = columnsumcolor;
            if (totalposition == 'above' || totalposition == 'below') {
                $table.find('tr:last').hide();
            }
        }

        // Getting row total value and hiding from table
        if (rowCount <= 2) {
            grandTotalVal = $table.find('tr:eq(1) td:last input').val();
            colorCode = rowsumcolor;
            if (totalposition == 'above' || totalposition == 'below') {
                $table.find('tr').each(function() {
                    $(this).find('td:last').hide();
                });
            }
        }
        var positionString = "<div class='autosumPos'><span style='font-weight: " + autosumlabelfontweight + "; font-size: "+autosumlabelfontsize+"px;'>" + autosumlabel + "</span>:<span style='background-color: " + colorCode + ";color:"+autosumtextcolor+"'>" + grandTotalVal + "</span></div>";
        if (totalposition == 'above') {
            this.nativeContainer.find('.autosumPos').remove();
            this.nativeContainer.find('table').before(positionString);
        } else if (totalposition == 'below') {
            this.nativeContainer.find('.autosumPos').remove();
            this.nativeContainer.find('table').after(positionString);
        }
    } else {

        // Applying Above & Below for with slice questions
        var colorCode = grandtotalcolor;
        var grandTotalVal = $table.find('tr:last td:last input').val();
        var positionString = "<div class='autosumPos'><span style='font-weight: " + autosumlabelfontweight + "; font-size: "+autosumlabelfontsize+"px;'>" + autosumlabel + "</span>:<span style='background-color: " + colorCode + ";color:"+autosumtextcolor+"'>" + grandTotalVal + "</span></div>";

        if (totalposition == 'above') {
            this.nativeContainer.find('.autosumPos').remove();
            this.nativeContainer.find('table').before(positionString);
            $table.find('tr:last td:last input').css("display", "none");
        } else if (totalposition == 'below') {
            this.nativeContainer.find('.autosumPos').remove();
            this.nativeContainer.find('table').after(positionString);
            $table.find('tr:last td:last input').css("display", "none");
        }
    }

}
autosum.prototype.autosumInputs = function($table) {

    var decimalpositions = this.getProperty("decimalpositions");
	var decimalseparater = this.getProperty("decimalseparater");

    // calculate row totals
    $table.find('tr').each(function() {
        var td = $(this).find('td');
        var totalrows = 0.00;
		
        for (var i = 1; i < td.length - 1; i++) {
			
            var inputval = $(this).find('td:eq(' + i + ') input').val();
			
            if (typeof inputval != 'undefined') {
				console.log("inputval:"+inputval);
				if(inputval == ""){
					inputval = 0;
				}
				inputval = inputval.toString();
				inputval = inputval.replace(decimalseparater, ".");
                if (decimalpositions <= 0) {
                    totalrows = parseFloat(totalrows) + Math.floor(parseFloat(inputval));
                } else {
                    totalrows = parseFloat(totalrows) + parseFloat(inputval);
                }
				
            }
        }
		
		totalrows = parseFloat(totalrows).toFixed(decimalpositions);
		totalrows = totalrows.toString();
		totalrows = totalrows.replace(".", decimalseparater);
        $(this).find('td:eq(' + (td.length - 1) + ') input').val(totalrows);
    });

    // calculate col totals

    var $dataRows = $table.find("tr:not('#col_total, .tr:first')");

    var totals = [];
    $dataRows.each(function() {
        totals.push(0.00);
    });
    $dataRows.each(function() {
        $(this).find('td input').each(function(i) {
			var tempVal = ($(this).val()).toString();
			tempVal = tempVal.replace(decimalseparater, ".");
			tempVal = parseFloat(tempVal);
            if (!isNaN(tempVal)) {
                if (decimalpositions <= 0) {
                    totals[i] = parseFloat(totals[i]) + Math.floor(tempVal);
                } else {
                    totals[i] = parseFloat(totals[i]) + tempVal;
                }
            }

        });
    });

    $table.find("#col_total td input").each(function(i) {
		var grandTotalVal = parseFloat(totals[i]).toFixed(decimalpositions);
		grandTotalVal = grandTotalVal.toString();
		grandTotalVal = grandTotalVal.replace(".", decimalseparater);
        $(this).val(grandTotalVal);
    });

}
autosum.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + autosum.prototype.type()));
    switch (pageLayout.deviceType.toUpperCase()) {
        case "LARGETABLET":
        case "MEDIUMTABLET":
        case "SMALLTABLET":
        case "SMARTPHONETOUCH":
            if (this.orientation == 0 || this.orientation == 180) {
                return {
                    'autosumType': "multi",
//                    'rowsumcolor': "transparent",
//                    'columnsumcolor': "transparent",
//                    'grandtotalcolor': "transparent",
                    'decimalpositions': 0,
                    'autosumlabel': "Sum",
                    'autosumlabelfontweight': "bold",
					'autosumlabelfontsize': 36,
                    'position': "table",
					'decimalseparater':"."
                }
            } else {
                return {
                    'autosumType': "multi",
//                    'rowsumcolor': "transparent",
//                    'columnsumcolor': "transparent",
//                    'grandtotalcolor': "transparent",
                    'decimalpositions': 0,
                    'autosumlabel': "Sum",
                    'autosumlabelfontweight': "bold",
					'autosumlabelfontsize': 18,
                    'position': "table",
					'decimalseparater':"."
                }
            }
        case "PC":
        case "OTHERDEVICE":
        default:
            return {
                'autosumType': "multi",
//                'rowsumcolor': "transparent",
//                'columnsumcolor': "transparent",
//                'grandtotalcolor': "transparent",
                'decimalpositions': 0,
                'autosumlabel': "Sum",
                'autosumlabelfontweight': "bold",
				'autosumlabelfontsize': 18,
                'position': "table",
				'decimalseparater':"."
            }
    }
}