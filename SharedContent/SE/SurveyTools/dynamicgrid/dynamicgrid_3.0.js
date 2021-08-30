/**
 * dynamicgrid class
 * Inherits from SESurveyTool
 */
function dynamicgrid(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
    this.singlePunchCount = 0;
}
dynamicgrid.prototype = Object.create(SESurveyTool.prototype);
dynamicgrid.prototype.type = function() {
    return "dynamicgrid";
}
dynamicgrid.prototype.getDependencies = function() {
    return [];
}
dynamicgrid.prototype.setInitialResponses = function() {

}
dynamicgrid.prototype.setResponses = function() {
    if (this.response == null) return;
    this.clearInputs(); // need to clear the responses before setting them.
    var that = this;
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
dynamicgrid.prototype.build = function() {
    var rowArray = [],
        colArray = [],
        that = this;
    // Create questions and columns to build
    this.buildArraysFromGrid();

    // Build up row array

    $.each(this.subquestions, function(i, e) {
        var initResponseId = [];
        var label = e.label;
        label.find('span').removeClass('mrQuestionText');
        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');

        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            var idVal = e.id
			that.flag=0;
            $.each(e.inputs, function(j, f) {
                if ($(f).is(":checked")) {
				    that.flag=1;
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
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            var subqid = e.inputs.filter('input[type!=text]').eq(0).attr("value");
            subqid = subqid.split("-");
            var idVal = subqid[0] + '-' + e.id;
			that.flag=0;
            $.each(e.inputs, function(j, f) {
                if ($(f).is(":checked")) {
				     that.flag=1;
                    if ($("#" + f.id + "-open").length != 0)
                        initResponseId.push({
                            index: parseInt($(f).attr("colid")),
                            value: $("#" + f.id + "-open").val()
                        });
                    else
                        initResponseId.push({
                            index: parseInt($(f).attr("colid"))
                        });
                }
            });
        }
        var rowHasImg = (typeof e.image != 'undefined');
        rowArray.push({
            id: idVal,
            title: label.html(),
            //subtitle: label.text(),
            description: label.text(),
            image: e.image,
            defaultChecked:initResponseId
        });
    });

    // Build up column array

    $.each(this.columnheaders, function(i, e) {

        // Match columnheader Index to inputs Index by removing type=text
        var inputs = that.subquestions[0].inputs.filter('input[type!=text]')

        var label = $(e.label);

        label.find('span').removeClass('mrQuestionText');
        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        var image = label.find('img');


        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            var isexclusive = $(inputs[i]).attr('isexclusive') == "true";
            var labelTxt = label.html()
            var descriptionTxt = label.html()
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            var ex = label.text().split("|")[1]
            if (typeof ex != "undefined")
                ex = ex.trim();
            if (typeof ex != "undefined" && ex.toLowerCase() == "exclusive")
                var isexclusive = true;
            var labelTxt = label.html().split("|")[0]
            var descriptionTxt = label.text().split("|")[0]
        }

        //var isexclusive = $(inputs[i]).attr('isexclusive') == "true";
        var isradio = $(inputs[i]).attr('type') == "radio";
		that.radio= isradio;
        var colHasImg = (typeof image.attr('src') != 'undefined');
        colArray.push({
            id: $(inputs[i]).val(),
            title: descriptionTxt,
            //subtitle: "PG Golden State Warriors",
            image: image.attr('src'),
            isRadio: (isexclusive || isradio)
        });
		
		

        if (isexclusive) {
            //colArray[colArray.length-1].uitype= 'default'
            colArray[colArray.length - 1].extrasmall = {
                    width: 100
                },
                colArray[colArray.length - 1].small = {
                    width: 100
                },
                colArray[colArray.length - 1].medium = {
                    width: 100
                },
                colArray[colArray.length - 1].large = {
                    width: 100
                },
                colArray[colArray.length - 1].extralarge = {
                    width: 100
                }
        }
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            if ($(inputs[i]).attr('otherid') != '') {
                colArray[colArray.length - 1].uitype = 'input',
                    extrasmall = {
                        width: 100
                    },
                    small = {
                        width: 100
                    },
                    medium = {
                        width: 100
                    },
                    large = {
                        width: 100
                    },
                    extralarge = {
                        width: 100
                    }
            }
        } else if (surveyPlatform == "Nfield") {
            if (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim().indexOf("other") > -1) {
                colArray[colArray.length - 1].type = 'kantarother';
                colArray[colArray.length - 1].ownRow = true;
                hasOther = true;
            }

        }
    });
    this.deferred.resolve();
    this.bindNavigations()

    var container = document.getElementById("container_" + this.questionFullName);
    this.sample = [];
    var that = this;
    this.response = [];
    this.toolParams = {
        rowArray: rowArray,
        columnArray: colArray,
        onSelect: function(selectArray, mandBool) {
            console.log(selectArray, mandBool);
            that.response = selectArray;			 
             if(selectArray[that.subquestions.length-1].length>0){			   
			   if (that.radio && that.flag==0){
                 pageLayout.next.click();
			   }
			 }
        },
		onNavSelect:function(scrollIndex) {
		    console.log(scrollIndex);
			if(scrollIndex==0){
			  $(".tempPrev").click();
			}if(scrollIndex==rowArray.length-1){
			  $(".tempNext").click();
			}
		      
		},
        next: document.getElementById("dgNext"),
        back: document.getElementById("dgPrev")
    }
	
	
    new QArts.ScrollMatrix($.extend(this.toolParams, this.options), container);
	$(".nextNavButton").css("width","50%");
}

dynamicgrid.prototype.navNextButton = function() {
    if (typeof navNextButton === "string") return navNextButton;
    return "<a id='dgNext' class='hoverable theme-standard-font-color3' style='display: block;'><i class='fa fa-chevron-right fa-1x' style='padding-top: 1.1rem;padding-bottom: 1.1rem;'></i></a>";
}
dynamicgrid.prototype.navPrevButton = function() {
    if (typeof navPrevButton === "string") return navPrevButton;
    return '<a id="dgPrev" class="theme-standard-font-color1 hoverable" style="display: block;"><i class="fa fa-chevron-left fa-1x" style="padding-top: 1.1rem;padding-bottom: 1.1rem;"></i></a>';
}
dynamicgrid.prototype.bindNavigations = function() {
    $('[name=_NNext]').hide();
    $('[name=_NPrev]').hide();
    $('.tempNext').hide();
    $('.tempPrev').hide();


    if (typeof surveyPlatform != "undefined" && surveyPlatform == "Nfield") { // This code belongs to Nfield
        $('[name=button-next]').hide();
        $('[name=button-back]').hide();
    }


    $('.nextNavButton').append(this.navNextButton());
    
    var showdgprev = this.getProperty("showDGprev");
    if (showdgprev == null || (showdgprev != null && showdgprev == true)) {
        $('.previousNavButton').append(this.navPrevButton());
        //Hiding the previous button
        if (!isTest && this.inputs.filter('[type=checkbox]').length > 0) {
            //disable previous button for DG grids
            if (typeof surveyPlatform != "undefined" && surveyPlatform == "Nfield") { // This code belongs to Nfield
                $("[name='_NPrev'][type=button]").css('display', 'none');
            }
            $("[name='button-back'][type=button]").css('display', 'none');
        }        
     }


}


dynamicgrid.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + dynamicgrid.prototype.type()));
    return {
        row: {
            basecolor: "#fafafa",
            captype: 'none',
            capvalue: 3,
            uitype: 'default',
            animtype: 'default',
            extrasmall: {
                displayimg: true,
                center: false
            },
            small: {
                displayimg: true,
                center: false
            },
            medium: {
                displayimg: true,
                center: true
            },
            large: {
                displayimg: true,
                center: true
            },
            extralarge: {
                displayimg: true,
                center: true
            }
            //titlecolor: "#FF0000"
        },
        column: {
            uitype: "default",
            animtype: 'bottom',
            inputonly: true,
			extrasmall: {},
            small: {},
            medium: {},
            large: {},
            extralarge: {}
                //pricolor:"#9FCC3B",
                //pridarkcolor:"#9FCC3B"
        },
        rowGrid: {
            extrasmall: {
                width: 100
            },
            small: {
                width: 100
            },
            medium: {
                width: 100
            },
            large: {
                width: 100
            },
            extralarge: {
                width: 100
            }
        },
        columnGrid: {
            extrasmall: {
                width: 100,
                hgap: 0,
                vgap: 0
            },
            small: {
                width: 100,
                hgap: 0,
                vgap: 0
            },
            medium: {
                width: 25,
                hgap: 0,
                vgap: 0
            },
            large: {
                width: 25,
                hgap: 0,
                vgap: 0
            },
            extralarge: {
                width: 25,
                hgap: 0,
                vgap: 0
            }
        }
    }
}