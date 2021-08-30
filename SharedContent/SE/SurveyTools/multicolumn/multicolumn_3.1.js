/**
 * autosum class
 * Inherits from SESurveyTool
 */
function multicolumn(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
multicolumn.prototype = Object.create(SESurveyTool.prototype);
multicolumn.prototype.type = function() {
    return "multicolumn";
}
multicolumn.prototype.getDependencies = function() {
    return [];
}


multicolumn.prototype.setResponses = function() {

}

multicolumn.prototype.build = function() {


    //Categorical question
    var cells = this.nativeContainer.find("span[id^='Cell.']");
    var metatype = this.getProperty("metatype");
    var rules = "col-xs-12";
    if (metatype.indexOf("multicolumn") != -1) {

        var xs_colcount = this.getProperty("xscolcount");
        var sm_colcount = this.getProperty("smcolcount");
        var md_colcount = this.getProperty("mdcolcount");
        var lg_colcount = this.getProperty("lgcolcount");
        var xl_colcount = this.getProperty("xlcolcount");
		
		var textalign = this.getProperty("textalign");
		var othertextalign = this.getProperty("othertextalign");
		
        var xs_col = "";
        if (xs_colcount == 1) {
            xs_col = "col-xs-12";
        } else if (xs_colcount == 2) {
            xs_col = "col-xs-6";
        } else if (xs_colcount == 3) {
            xs_col = "col-xs-4";
        } else if (xs_colcount == 4) {
            xs_col = "col-xs-3";
        } else if (xs_colcount == 6) {
            xs_col = "col-xs-2";
        } else if (xs_colcount == 12) {
            xs_col = "col-xs-1";
        } else {
            xs_col = "col-xs-12";
        }

        var sm_col = "";
        if (sm_colcount == 1) {
            sm_col = "col-sm-12";
        } else if (sm_colcount == 2) {
            sm_col = "col-sm-6";
        } else if (sm_colcount == 3) {
            sm_col = "col-sm-4";
        } else if (sm_colcount == 4) {
            sm_col = "col-sm-3";
        } else if (sm_colcount == 6) {
            sm_col = "col-sm-2";
        } else if (sm_colcount == 12) {
            sm_col = "col-sm-1";
        } else {
            sm_col = "col-sm-12";
        }

        var md_col = "";
        if (md_colcount == 1) {
            md_col = "col-md-12";
        } else if (md_colcount == 2) {
            md_col = "col-md-6";
        } else if (md_colcount == 3) {
            md_col = "col-md-4";
        } else if (md_colcount == 4) {
            md_col = "col-md-3";
        } else if (md_colcount == 6) {
            md_col = "col-md-2";
        } else if (md_colcount == 12) {
            md_col = "col-md-1";
        } else {
            md_col = "col-md-6";
        }

        var lg_col = "";
        if (lg_colcount == 1) {
            lg_col = "col-lg-12";
        } else if (lg_colcount == 2) {
            lg_col = "col-lg-6";
        } else if (lg_colcount == 3) {
            lg_col = "col-lg-4";
        } else if (lg_colcount == 4) {
            lg_col = "col-lg-3";
        } else if (lg_colcount == 6) {
            lg_col = "col-lg-2";
        } else if (lg_colcount == 12) {
            lg_col = "col-lg-1";
        } else {
            lg_col = "col-lg-4";
        }

        var xl_col = "";
        if (xl_colcount == 1) {
            xl_col = "col-xl-12";
        } else if (xl_colcount == 2) {
            xl_col = "col-xl-6";
        } else if (xl_colcount == 3) {
            xl_col = "col-xl-4";
        } else if (xl_colcount == 4) {
            xl_col = "col-xl-3";
        } else if (xl_colcount == 6) {
            xl_col = "col-xl-2";
        } else if (xl_colcount == 12) {
            xl_col = "col-xl-1";
        } else {
            xl_col = "col-xl-3";
        }

        rules = xs_col + " " + sm_col + " " + md_col + " " + lg_col + " " + xl_col;

    } else {
        if (cells.length > 2) {
            rules = "col-md-4 col-sm-6 col-xs-12";
        }
    }


    cells.each(function() {
        $(this).wrap('<div class="' + rules + ' col-border waves-effect waves-light"></div>');

        //Other question style
        if ($(this).children('input').attr("otherid") != "") {
            var otherText = ($(this).find('label').eq(0).text()).trim();
            $(this).find('label').attr('style', 'display: none !important;');
            $(this).find('input[type="text"][otherinput="true"]').wrap('<div class="md-form" style="padding: 0rem 0.3rem;"></div>');
            var otherTextId = $(this).find('input[type="text"]').attr('id');
            $(this).find('input[type="text"]').after("<label for='" + otherTextId + "'>" + otherText + "</label>");
            $(this).find('.md-form label').attr('style', 'text-align:'+othertextalign+';');
        }
        if ($(this).children('input').attr("isexclusive") == "true" || $(this).children('input').attr("otherid") != "") {
            $(this).parent().removeClass(makeRemoveClassHandler(/^col-/));
            $(this).parent().addClass('col-xs-12 col-border');
        }
		
    });
    this.nativeContainer.find(".col-border").wrapAll("<div class='flex-row row'></div>");
	
	this.nativeContainer.find('span[id*="Cell."]').css('text-align',textalign);

    this.deferred.resolve();

}

function makeRemoveClassHandler(regex) {
    return function(index, classes) {
        return classes.split(/\s+/).filter(function(el) {
            return regex.test(el);
        }).join(' ');
    }
}

multicolumn.prototype.render = function() {}


multicolumn.prototype.toolOptions = function() {
	$.extend(this.options, eval("this.options." + multicolumn.prototype.type()));
    return {
        'textalign': "center",
		'othertextalign': "left"
    }
}