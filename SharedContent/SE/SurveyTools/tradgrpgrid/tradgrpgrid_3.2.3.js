/**  
 * tradgrpgrid class
 * Inherits from SESurveyTool
 */
function tradgrpgrid(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
tradgrpgrid.prototype = Object.create(SESurveyTool.prototype);
tradgrpgrid.prototype.type = function() {
    return "tradgrpgrid";
}
tradgrpgrid.prototype.getDependencies = function() {
		return [];
}
tradgrpgrid.prototype.setInitialResponses = function() {

}
tradgrpgrid.prototype.setResponses = function() {
   if (this.response == null) return;
    this.clearInputs(); // need to clear the responses before setting them.
    var that = this;
//alert(that.subquestions.length);
	//$.each(this.subquestions, function(i, e) {
		$.each(this.response, function(i, e) {
			$.each(e, function(j, f) {
				$('input').filter('[value=' + f.id + ']').eq(i).val($.makeArray(f.id));
			});
		});
	
}
tradgrpgrid.prototype.build = function() {
    pageLayout.content.show();
	this.isstudio = location.href.search(/question\.htm/i) > 0;
    var captype = this.options.row.captype;
    var capvalue = this.options.row.capvalue;
    if (captype == 'min' || captype == 'hard') {
        pageLayout.next.hide();
    }

		
	this.buildArraysFromGrid();

    var rowArray = [],
        colArray = [],
        that = this;
		var rowtitleList = this.nativeContainer.find("span.mrQuestionTable").first();
		
		$.each(rowtitleList.find("span[id^='Cell.']"), function(i, e) {
				rowArray.push({
					id: $(e).find('input').val(),
					title:  $(e).find('.mrSingleText,.mrMultipleText').html(),
					image: $(e).find('img').attr('src')
				});
		});
		var colIsRadio = true;
		$.each(this.subquestions, function(i, e) {
			var grouplabel = e.label;
			grouplabel.find("span").remove();
			var grouptitle=($.trim(grouplabel.text()).length==0)?$.trim(grouplabel.text()):$.trim(grouplabel.html());
			var groupimage = grouplabel.find('img');
			groupimage.hide();
			colIsRadio = $(e.inputs[0]).attr('type') == "radio"
			$.each(that.columnheaders, function(j, e) {
				var label = $(e.label);
				label.find("span").attr('style', '');

				var image = label.find('img');
				image.hide();
				
				if($.trim(label.text()).length==0)
				 var colLabel = $.trim(label.text());
				else 
				  var colLabel = $.trim(label.html());
				colArray.push({
					grouptitle:grouptitle,
					title: colLabel,
					groupimage: groupimage.attr('src'),
					image: image.attr('src'),
					isRadio: colIsRadio || colIsRadio
				});
				
			});
			
		});
	
		
        
     

   
	//this.deferred.resolve();
	
    if (this.questionFullName.indexOf(".") >= 0)
        var container = document.getElementById("container_" + this.questionName);
    else
        var container = document.getElementById("container_" + this.questionFullName);
    this.response = [];
    var that = this;
	if(that.getProperty('rowGrid$all$gridtype')=="pagination"){
		if(!(that.subquestions.length==1))
		that.bindNavigations()
	}
    this.toolParams = {
        rowArray: rowArray,
        columnArray: colArray,
         onSelect: function(selectArray, mandBool) {
				console.log(selectArray, mandBool);
				that.response = selectArray;
				that.mandBool=mandBool;
				if(mandBool){
					if (colIsRadio) {
						pageLayout.next.click();
					}
				}
        },
        onNavSelect: function(scrollIndex) {
		   console.log(scrollIndex);
			if (rowArray.length>1&&scrollIndex == 0) {
                pageLayout.prev.click();
            }
			if(that.mandBool){
				if (scrollIndex == rowArray.length - 1) {
					pageLayout.next.click();
				}
			}

        },
		next: (that.subquestions.length==1)?pageLayout.next:document.getElementById("dgNext"),
        back: (that.subquestions.length==1)?pageLayout.prev:document.getElementById("dgPrev")
    }
	if(this.getProperty('rowGrid$all$gridtype')=="pagination"){
		that.toolParams.next=(that.subquestions.length==1)?pageLayout.next:document.getElementById("dgNext")
		that.toolParams.back= (that.subquestions.length==1)?pageLayout.prev:document.getElementById("dgPrev")
	}
   
	
	// Code for studio
    if (this.isstudio) {
        $("#dgNext").hover(
            function() {
                $(this).html("<img src='" + pageLayout.themePath + "images/Hover.png' height='56'>");
            },
            function() {
                $(this).html("<img src='" + pageLayout.themePath + "images/Next.png' height='56'>");
            }
        );
    }else{
		$("#dgNext").hover(function() {
				$(this).removeClass("theme-standard-font-color3").addClass("theme-standard-font-color1");
			}, function() {
				$(this).removeClass("theme-standard-font-color1").addClass("theme-standard-font-color3");
			});
	}
	

    new QArts.TradGrpGrid($.extend(true, this.toolParams, this.options), container);
	
	 this.deferred.resolve();
	if($('.nextNavButton').length > 0)
		$(".nextNavButton").css("width", "50%");
	else
		$("#surveyButtons #dgNext, #surveyButtons #dgPrev").css({"width":"50%","text-align": "center","float":"right"});
		
	//$(".__flexgrid_row").css("padding","0px");	
	if($('.nextNavButton').length > 0)
		$(".nextNavButton").css("width", "50%");
	else
		$("#surveyButtons #dgNext, #surveyButtons #dgPrev").css({"width":"50%","text-align": "center","float":"right"});
}

tradgrpgrid.prototype.navNextButton = function() {
	if($('.nextNavButton').length > 0)
		var themeNextBGColor = "";
	else
		var themeNextBGColor = "theme-bg-color";
	
    if (typeof navNextButton === "string") return navNextButton;
    if (this.isstudio) {
        return "<a id='dgNext' class='"+themeNextBGColor+" hoverable theme-standard-font-color3' style='display: block;'><img src='" + pageLayout.themePath + "images/Next.png' height='56'></a>";
    } else {
        return "<a id='dgNext' class='"+themeNextBGColor+" hoverable theme-standard-font-color3' style='display: block;'><i class='fa fa-chevron-right fa-1x' style='padding-top: 1.1rem;padding-bottom: 1.1rem;'></i></a>";
    }

}
tradgrpgrid.prototype.navPrevButton = function() {
	
	if($('.previousNavButton').length > 0)
			var themePrevBGColor = "";
		else
			var themePrevBGColor = "theme-standard-bg-color2";
	
    if (typeof navPrevButton === "string") return navPrevButton;
    if (this.isstudio) {
        return '<a id="dgPrev" class="'+themePrevBGColor+' theme-standard-font-color1 hoverable" style="display: block;"><img src="' + pageLayout.themePath + 'images/Prev.png" height="56"></a>';
    } else {
        return '<a id="dgPrev" class="'+themePrevBGColor+' theme-standard-font-color1 hoverable" style="display: block;"><i class="fa fa-chevron-left fa-1x" style="padding-top: 1.1rem;padding-bottom: 1.1rem;"></i></a>';
    }

}
tradgrpgrid.prototype.bindNavigations = function() {
    $('[name=_NNext]').hide();
    $('[name=_NPrev]').hide();
    $('.tempNext').hide();
    $('.tempPrev').hide();


    if (typeof surveyPlatform != "undefined" && surveyPlatform == "Nfield") { // This code belongs to Nfield
        $('[name=button-next]').hide();
        $('[name=button-back]').hide();
    }

    var showdgprev = this.getProperty("showDGprev");
    if (showdgprev == null || (showdgprev != null && showdgprev == true)) {
		if($('.previousNavButton').length > 0)
			$('.previousNavButton').append(this.navPrevButton());
		else
			$('#surveyButtons').append(this.navPrevButton());
        //Hiding the previous button
        if (!isTest && this.inputs.filter('[type=checkbox]').length > 0) {
            //disable previous button for DG grids
            if (typeof surveyPlatform != "undefined" && surveyPlatform == "Nfield") { // This code belongs to Nfield
                $("[name='_NPrev'][type=button]").css('display', 'none');
            }
            $("[name='button-back'][type=button]").css('display', 'none');
        }
    }
	if($('.nextNavButton').length > 0)
		$('.nextNavButton').append(this.navNextButton());
	else
		$('#surveyButtons').append(this.navNextButton());



}


tradgrpgrid.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + tradgrpgrid.prototype.type()));
    return {
        row: {
            extrasmall: {
            },
            small: {
            },
            medium: {
            },
            large: {
            },
            extralarge: {
            }
        },
        column: {
            //enablezoom:true,
            extrasmall: {
            },
            small: {
            },
            medium: {
            },
            large: {
            },
            extralarge: {
            }            
        },
        rowGrid: {
		    
            extrasmall: {
            },
            small: {
            },
            medium: {
            },
            large: {
            },
            extralarge: {
            }
        },
        columnGrid: {
            extrasmall: {
            },
            small: {
            },
            medium: {
            },
            large: {
            },
            extralarge: {
            }
        },
		
    }
}