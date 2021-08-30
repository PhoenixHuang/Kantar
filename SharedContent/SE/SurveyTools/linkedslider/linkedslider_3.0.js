/**
 * linkedslider class
 * Inherits from SESurveyTool
 */
function linkedslider(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
linkedslider.prototype = Object.create(SESurveyTool.prototype);
linkedslider.prototype.type = function() {
    return "linkedslider";
}
linkedslider.prototype.getDependencies = function() {
    return [];
}
linkedslider.prototype.setInitialResponses = function() {

}
linkedslider.prototype.setResponses = function() {

    if (this.result == null) return;
    this.clearInputs();
    var that = this;

    $.each(this.result, function(i, e) {
        that.inputs.filter('input[name=' + e.id + ']').val(e.value);
    });
}
linkedslider.prototype.build = function() {
    var rowArray = [],
        that = this;
    // Create questions to build
    this.buildArraysFromGrid();

    // Build up row array
    $.each(this.subquestions, function(i, e) {
        var label = e.label;
        label.find('span').removeClass('mrQuestionText');
        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        label.find('span').remove(); //fix to remove error span tag from label
        rowArray.push({
            id: e.inputs[0].name,
            title: label.html(),
            //subtitle: label.text(),
            description: "Lorem ipsum dolor sit amet, nec ad conceptam interpretaris, mea ne solet repudiandae. Laudem nost",
            image: e.image,
            stamp: e.image,
            isRadio: true,
            defaultValue: e.inputs.val()
        });
    });
    var container = document.getElementById("container_" + this.questionFullName);
    this.result = [];
    this.toolParams = {
        rowArray: rowArray,
        onSelect: function(selectArray, mandBool) {
            console.log(selectArray, mandBool);
            that.result = selectArray;
        }
    }
    this.deferred.resolve();
    if (typeof this.options.row.maxpool != "undefined")
        this.options.row.maxPool = this.options.row.maxpool

    new QArts.LinkedSlider($.extend(this.toolParams, this.options), container);
}


linkedslider.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + linkedslider.prototype.type()));
    return {
        row: {
            suffix: "",
            animtype: 'left',
            //maxPool: 10,
            //pricolor:"#9FCC3B",
            //pridarkcolor:"#327E04",
            extrasmall: {
                dir: 'row',
                width: 125,
				displayimg:true
            },
            small: {
                dir: 'row',
                width: 150,
				displayimg:true
            },
            medium: {
                dir: 'row',
                width: 175,
				displayimg:true
            },
            large: {
                dir: 'row',
                width: 175,
				displayimg:true
            },
            extralarge: {
                dir: 'row',
                width: 175,
				displayimg:true
            }
        },
        grid: {
            extrasmall: {
                hgap: 0,
                vgap: 0
            },
            small: {
                hgap: 0,
                vgap: 0
            },
            medium: {
                width: 50,
                hgap: 0,
                vgap: 0
            },
            large: {
                width: 50,
                hgap: 0,
                vgap: 0
            },
            extralarge: {
                width: 50,
                hgap: 0,
                vgap: 0
            }
        }
    }
}