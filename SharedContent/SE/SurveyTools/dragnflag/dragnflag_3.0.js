/**
 * dragnflag class
 * Inherits from SESurveyTool
 */
function dragnflag(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
dragnflag.prototype = Object.create(SESurveyTool.prototype);
dragnflag.prototype.type = function() {
    return "dragnflag";
}
dragnflag.prototype.getDependencies = function() {
    return [];
}
dragnflag.prototype.setInitialResponses = function() {
    console.log("setInitialResponses not implemented for " + this.type());
    return null;
}
dragnflag.prototype.setResponses = function() {
    if (this.response == null) return;
    this.clearInputs(); // need to clear the responses before setting them.
    var that = this;
    console.log(this.response);
    $.each(this.response, function(i, e) {
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            $.each(e, function(j, f) {
                var inputs = that.subquestions[i].inputs;
                var multi = inputs.filter('input[type=checkbox]');
                if (multi) inputs.filter('[value=' + f.id + ']').val($.makeArray(f.id));
                else inputs.val($.makeArray(f.id));
                if (inputs.filter('[value=' + f.id + ']').attr('otherid') != '') {
                    that.inputs.filter('[id=' + inputs.filter('[value=' + f.id + ']').attr('otherid') + ']').val(f.value);
                }
            });
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            $.each(e, function(j, f) {
                var inputs = that.subquestions[i].inputs;

                var multi = inputs[0].type == "checkbox";
                if (multi) inputs.filter('[value=' + that.subquestions[i].inputs[0].value.split("-")[0] + "-" + f.id.split("-")[1] + ']').val($.makeArray(that.subquestions[i].inputs[0].value.split("-")[0] + "-" + f.id.split("-")[1]));
                else inputs.filter('[value=' + that.subquestions[i].inputs[0].value.split("-")[0] + "-" + f.id.split("-")[1] + ']').val($.makeArray(that.subquestions[i].inputs[0].value.split("-")[0] + "-" + f.id.split("-")[1]));
                if (typeof f.uitype != "undefined" && f.uitype == "input") {
                    $("#" + that.subquestions[i].inputs[0].id.split("-")[0] + "-" + f.id.split("-")[1] + "-open").val(f.value);
                }
            });
        }
    });
}
dragnflag.prototype.build = function() {
    if(this.getProperty("hidenextbutton"))
    $(".tempNext").hide();
    var rowArray = [],
        columnArray = [],
        that = this;

    // Create questions and columns to build
    this.buildArraysFromGrid();

    // Build up row array
    $.each(this.subquestions, function(i, e) {
        var label = e.label;
        var initResponseId = [];
        label.find('span').removeClass('mrQuestionText');
        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            var rowId = e.id
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            var subqid = e.inputs.filter('input[type!=text]').eq(0).attr("value");
            subqid = subqid.split("-");
            var rowId = subqid[0] + '-' + e.id
        }
        label.find('.mrErrorText').remove();
        $.each(e.inputs, function(j, f) {
            if ($(f).is(":checked")) {
                if ($(f).attr('otherid') != '')
                    initResponseId.push({
                        index: parseInt($(f).attr("colid")),
                        value: e.inputs.filter('[id=' + $(f).attr('otherid') + ']').val()
                    });
                else
                    initResponseId.push({
                        index: parseInt($(f).attr("colid"))
                    });
            }
        });
        rowArray.push({
            id: rowId,
            title: label.html(),
            //subtitle: label.text(),
            description: label.text(),
            image: e.image,
            defaultChecked: initResponseId
        });
    });

    // Build up column array
    $.each(this.columnheaders, function(i, e) {
        var label = $(e.label);
        label.find('span').removeClass('mrQuestionText');
        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        label.find("span").attr('style', '');
        label.find('.mrErrorText').remove();
        var image = label.find('img');
        image.hide();
        columnArray.push({
            id: $(that.subquestions[0].inputs[i]).val(),
            title: label.text(),
            //subtitle: "Lorem ipsum",
            description: label.text(),
            image: image.attr('src')
        });
	});
	
	if(this.options.column.tracktype=="zone"){
	     var color=this.getProperty("slidercolors");
		 color=color.split("$");
		 $.each( color, function( key, value ) {
            //alert( key + ": " + value );
			columnArray[key].seccolor=value;
		});		 
	}	 

    var container = document.getElementById("container_" + this.questionFullName);
    this.response = [];
    var that = this;
    container.style.minHeight = "500px"
    this.toolParams = {
        rowArray: rowArray,
        columnArray: columnArray,
        onSelect: function(selectArray, mandBool, isDefault) {
            console.log(selectArray);
            console.log("mandBool: " + mandBool);
            console.log("isDefault: " + isDefault);
            that.response = selectArray;
			if(that.getProperty("hidenextbutton")){
			   if(selectArray[that.subquestions.length-1].length>0){
			    $(".tempNext").show();
			   }
			}
        }
    }
    new QArts.DragnFlag($.extend(this.toolParams, this.options), container);
    this.deferred.resolve();

}
dragnflag.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + dragnflag.prototype.type()));
    return {
        row: {
            uitype: "img pin",
            animtype: 'bottom',
            //pricolor:"#9FCC3B",
            //pridarkcolor:"#327E04",
            //prilightcolor:"#dbe5db",
            extrasmall: {
                scale: 65
            },
            small: {
                scale: 65
            },
            medium: {
                scale: 80
            },
            large: {
                scale: 80
            },
            extralarge: {
                scale: 80
            }
        },
        column: {
            //pricolor:"#9FCC3B",
            //pridarkcolor:"#327E04",
            //prilightcolor:"#dbe5db",
            extrasmall: {
                vgap: 250,
                displayimg: true
            },
            small: {
                vgap: 250,
                displayimg: true
            },
            medium: {
                vgap: 300,
                displayimg: true
            },
            large: {
                vgap: 400,
                displayimg: true
            },
            extralarge: {
                vgap: 400,
                displayimg: true
            }
        },
		hidenextbutton: false
    }
}