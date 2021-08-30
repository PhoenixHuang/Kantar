function columnGrid(cols){
	var no_of_questions = $('.questionContainer').length;
	var rows = no_of_questions;
	
	if((no_of_questions%cols) != 0){
	var devide_val = no_of_questions / cols;
	var dec_before = devide_val.toString().split(".")[0];
	rows = parseInt(dec_before) + 1;
	}else{
	rows = no_of_questions / cols;
	}
	mytable = $('<table border=0></table>').attr({ id: "basicTable" });
	var q=1;
    	var tr = [];

    for (var i = 0; i < rows; i++) {
        var row = $('<tr></tr>').attr({ class: ["class1", "class2", "class3"].join(' ') }).appendTo(mytable);
        for (var j = 0; j < cols; j++) {
			if(q < no_of_questions){
			$('<td></td>').html('<div class="questionContainer">'+$(".questionContainer:eq("+q+")").html()+'</div>').appendTo(row);
				q++;
			}else{
			$('<td></td>').html('').appendTo(row);
			}
        }
	
    }
	$("#questions").html('<div></div><span class="mrQuestionText" style=""></span>');
    mytable.appendTo("#questions");
	}