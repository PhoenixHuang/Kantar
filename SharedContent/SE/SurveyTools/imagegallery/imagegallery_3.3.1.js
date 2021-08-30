/**  
 * imagegallery class
 * Inherits from SESurveyTool
 */
function imagegallery(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
imagegallery.prototype = Object.create(SESurveyTool.prototype);
imagegallery.prototype.type = function() {
    return "imagegallery";
}
imagegallery.prototype.getDependencies = function() {
     return [{
        'type': 'script',
        'url': surveyPage.path + 'lib/KO/imagegallery/1.1/imagegallery.js'
    }];
}
imagegallery.prototype.setInitialResponses = function() {

}
imagegallery.prototype.setResponses = function() {

}
imagegallery.prototype.build = function() {
    debugger;
    pageLayout.content.show();
    var that = this;
    var rowArray = [];
    var imgsrc, label;

    if (this.getProperty("hidenext") || this.getProperty("displaynextbuttontime") > 0) {
        pageLayout.next.hide();
        if (this.getProperty("displaynextbuttontime")) {
            setTimeout(function() {
                pageLayout.next.show();
            }, this.getProperty("displaynextbuttontime"))
        }
    }

    $.each(this.inputs, function(i, e) {
        var el = $(e);
        var otherVal = "";
        var defaultChecked = false;
        var elType = (el).attr('type');
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions
            if (elType == 'text' || elType == 'textarea') return true;
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield
            if (elType == 'text' || elType == 'textarea' || el.filter('textarea').attr("class") == "mrEdit") return true;
        }

        label = el.parent().find('label').clone();
        imgsrc = label.find('img');
        imgsrc.remove();

        label.find("span").removeClass('mrSingleText');
        label.find("span").removeClass('mrMultipleText');
        if (typeof surveyPlatform == "undefined") { // This code belongs to Dimensions

            var rowLabel = label.html()
            //var rowDescription = label.html()
            if ($.trim(label.text()).length == 0)
                var rowDescription = $.trim(label.text());
            else
                var rowDescription = $.trim(label.html());
            var rowIsRadio = ((elType == "radio" || el.attr('isexclusive') == "true") ? true : false)
        } else if (surveyPlatform == "Nfield") { // This code belongs to Nfield

            if (typeof label.text().split("|")[1] != "undefined" && label.text().split("|")[1].toLowerCase().trim() == "exclusive")
                var isexclusive = true
            var rowLabel = label.html().split("|")[0]
            var rowDescription = label.text().split("|")[0]
            if ($.trim(label.text().split("|")[0]).length == 0)
                var rowDescription = $.trim(label.text().split("|")[0]);
            else
                var rowDescription = $.trim(label.html().split("|")[0]);
            rowDescription = rowDescription.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            var rowIsRadio = ((elType == "radio" || isexclusive == true) ? true : false)
        }

        // Create the row array
        rowArray.push({
            id: el.attr('value'),
            title: rowDescription,
            //subtitle:rowDescription,
            //description:"Lorem ipsum dolor sit amet, nec ad conceptam interpretaris, mea ne solet repudiandae. Laudem nost",
            image: imgsrc.attr('src')
            //stamp:imgsrc.attr('src'),
            //isRadio: rowIsRadio
        });

    });
    this.deferred.resolve();
    if (this.questionFullName.indexOf(".") >= 0)
        var container = document.getElementById("container_" + this.questionName);
    else
        var container = document.getElementById("container_" + this.questionFullName);


    this.result = [];
    var that = this;
    this.toolParams = {
        rowArray: rowArray,
        //style: { maxWidth: '1000px' },
        onSelect: function(selectArray, mandBool, isDefault) {
            console.log("\n");
            console.log(selectArray);
            console.log("mandBool: s" + mandBool);
            console.log("isDefault: " + isDefault + "\n");

        },

        handleAutoNext: function() {
            console.log("handleAutoNext event called");
            if (that.getProperty("autosubmit")) {
                setTimeout(function() {
                    pageLayout.next.click();
                }, that.getProperty("autosubmittimedelay"))

            }
            if (that.getProperty("hidenext")) {
                pageLayout.next.show();
            }
        },
    }

    var IG = React.createElement(QArtsAddons.ImageGallery, $.extend(true, this.toolParams, this.options));
    ReactDOM.render(IG, container);

    $(container).css({
        "margin-top": "16px",
        "margin-bottom": "16px"
    });
    this.deferred.resolve();

}
imagegallery.prototype.toolOptions = function() {
    $.extend(this.options, this.options.imagegallery);
    return {
        'hidenext': false,
        'autosubmit': false,
        'autosubmittimedelay': 5000,
        'displaynextbuttontime': 0,
        row: {
            extrasmall: {},
            small: {},
            medium: {},
            large: {},
            extralarge: {}
        }
    }
}