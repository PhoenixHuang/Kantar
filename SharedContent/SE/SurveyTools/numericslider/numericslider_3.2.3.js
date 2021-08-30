/**  
 * numericslider class
 * Inherits from SESurveyTool
 */
function numericslider(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
numericslider.prototype = Object.create(SESurveyTool.prototype);
numericslider.prototype.type = function() {
    return "numericslider";
}
numericslider.prototype.getDependencies = function() {
    return [];
}
numericslider.prototype.setInitialResponses = function() {

}
numericslider.prototype.setResponses = function() {
    if (this.result == null) return;
    this.clearInputs();
    var that = this;

    $.each(this.result, function(i, e) {
		$.each(e, function(j, f) {
			that.inputs[i].value = f.value;
		})        
    })
}
numericslider.prototype.build = function() {
    pageLayout.content.show();
    var rowArray = [],
        that = this;
		
    // Create questions to build
    this.buildArraysFromGrid();

    // Build up row array
	var rs = {};
    var wordArray = [];
    rs.mWlen = 0, rs.mNumW = 0, rs.mALen = 0, rs.aAlen = 0, rs.aLen = 0, totalVal = 0;
    $.each(this.subquestions, function(i, e) {
        var label = e.label;
		var initResponseId = [];
        label.find('span').removeClass('mrQuestionText');
        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        label.find('span').remove(); //fix to remove error span tag from label
		//console.log(e.inputs[0].name);
		//alert(typeof parseFloat(e.inputs.val()));
		initResponseId.push({
                            //index: i,
                            //value: ((e.inputs.val()/that.getProperty("column$sldrmax"))*100) - (that.getProperty("column$sldrmin")*10)
							value: parseFloat(e.inputs.val())
                        });
        rowArray.push({
            id: e.inputs[0].name,
            title: label.html(),
            //subtitle: label.text(),
            //description: "Lorem ipsum dolor sit amet, nec ad conceptam interpretaris, mea ne solet repudiandae. Laudem nost",
            image: e.image,
            stamp: e.image,
            defaultChecked: initResponseId
        });
		/* Rule set calculations*/
        var ansString = $.trim(label.text());
        totalVal = totalVal + ansString.length;
        if (ansString.length > rs.mALen) {
            rs.mALen = ansString.length;
        }

        if($.trim(ansString) != ""){
			var ansStringSplit = $.trim(ansString).split(" ");
			if (ansStringSplit.length > rs.mNumW) {
				rs.mNumW = ansStringSplit.length;
			}
		}else{
			var ansStringSplit = [];
		}

        $.merge(wordArray, ansStringSplit);

        /* End Rule set calculations*/
    });
	
	if(wordArray.length > 0){
		rs.mWlen = (wordArray.sort(function(a, b) {
			return b.length - a.length;
		})[0]).length;
	}
    rs.aAlen = totalVal / rowArray.length;
    rs.aLen = rowArray.length;
    console.log(rs);
	var colArray = [];
    if(this.questionFullName.indexOf(".")>=0)
	 var container = document.getElementById("container_" + this.questionName);
	else
     var container = document.getElementById("container_" + this.questionFullName);
    this.result = [];
	
	 colArray.push({
            //title: 0,
            image: pageLayout.imageCache+ this.getProperty("sldrendimglt")//"https://cdn.onlinewebfonts.com/svg/img_410782.png"
        });
		colArray.push({
            //title: 1
        });
		
		colArray.push({
            //title: 100,
            image: pageLayout.imageCache+ this.getProperty("sldrendimgrt")//"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1200px-Heart_coraz%C3%B3n.svg.png"
        });
		
    this.toolParams = {
        rowArray: rowArray,
		columnArray: colArray,
        onSelect: function(selectArray, mandBool) {
            console.log(selectArray, mandBool);
            that.result = selectArray;
        }
    } 
	
	
	new QArts.GridMatrix($.extend(true, this.toolParams, this.options), container);
	this.deferred.resolve();
    
}
numericslider.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + numericslider.prototype.type()));
    return {
        row: {
            basecolor: "#fff",
            //captype: 'none',
            //capvalue: 3,
            uitype: 'default',
            animtype: 'top',
            delabelrt: "",
            delabellt: "",
            //enablezoom:true,
            extrasmall: {
                center: true,
                displayimg: true,
                displaydescr: false
            },
            small: {
                center: true,
                displayimg: true,
                displaydescr: false
            },
            medium: {
                center: true,
                displayimg: true,
                displaydescr: false
            },
            large: {
                center: true,
                displayimg: true,
                displaydescr: false
            },
            extralarge: {
                center: true,
                displayimg: true,
                displaydescr: false
            }
        },
        column: {
            uitype: "slider range",
            animtype: 'top',
			//sldrmin:1,
			//sldrmax:100,
            sldrdisplaysubtitle: true,			
			sldrinitpercent:50,
            //enablezoom:true,
            extrasmall: {
                sldrdisplayimg: true,
                center: true,
				sldrlabelcnt:0,
				sldrendlabelwidth:30
            },
            small: {
                sldrdisplayimg: true,
                center: true,
				sldrlabelcnt:0,
				sldrendlabelwidth:30
            },
            medium: {
                sldrdisplayimg: true,
                center: true,
				sldrlabelcnt:0
            },
            large: {
                sldrdisplayimg: true,
                center: true,
				sldrlabelcnt:0
            },
            extralarge: {
                sldrdisplayimg: true,
                center: true,
				sldrlabelcnt:0
            }
            //pricolor:"#9FCC3B",
            //pridarkcolor:"#9FCC3B",
            //prilightcolor:"#dbe5db",
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
                vgap: 0,
                padding: 0
            },
            small: {
                width: 100,
                hgap: 0,
                vgap: 0,
                padding: 0
            },
            medium: {
                width: 50,
                hgap: 0,
                vgap: 0,
                padding: 0
            },
            large: {
                width: 50,
                hgap: 0,
                vgap: 0,
                padding: 0
            },
            extralarge: {
                width: 50,
                hgap: 0,
                vgap: 0,
                padding: 0
            }
        },
        hidespecials: false
    }
}