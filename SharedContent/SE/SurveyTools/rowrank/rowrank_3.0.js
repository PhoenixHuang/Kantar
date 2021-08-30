/**
 * rowrank class
 * Inherits from SESurveyTool
 */
function rowrank(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
rowrank.prototype = Object.create(SESurveyTool.prototype);
rowrank.prototype.type = function(){
    return "rowrank";
}
rowrank.prototype.getDependencies = function(){
    return [
		//{'type':'script', 'url' : surveyPage.path + 'lib/qstudio/qcreator/qcore/QWidget.js'} 
    ];
}
rowrank.prototype.setInitialResponses = function (){
    
}
rowrank.prototype.setResponses = function (){
    
    if (this.result  == null) return;
    this.clearInputs();
    var that = this;
    $.each(this.result, function(i,e) {
			if(typeof e!="undefined")
            that.inputs.filter('input[name='+e.id+']').val(i+1);
    });
}
rowrank.prototype.build = function(){
        var rowArray = [],
            that = this;
        // Create questions to build
        this.buildArraysFromGrid();        

        // Build up row array
        $.each(this.subquestions, function (i, e) {
            var label = e.label;
            label.find('span').removeClass('mrQuestionText');
			label.find("span").removeClass('mrSingleText');
            label.find("span").removeClass('mrMultipleText');
			label.find('span').remove();//fix to remove error span tag from label
            rowArray.push({
                id: e.inputs[0].name,
				title: label.html(),
                //subtitle: label.text(),
                //description: "Lorem ipsum dolor sit amet, nec ad conceptam interpretaris, mea ne solet repudiandae. Laudem nost",
                image: e.image,
                //stamp: e.image,
                isRadio: false,
				defaultRank :e.inputs.val()
            });            
        });
        var container=document.getElementById("container_"+this.questionFullName);
		 this.result=[];
		  this.toolParams={
            rowArray: rowArray,
            onSelect: function(selectArray, mandBool) {
                console.log(selectArray, mandBool);
				that.result=selectArray;
            }            
          }
        this.deferred.resolve();
		new QArts.RowRank($.extend(this.toolParams,this.options), container);	
}


rowrank.prototype.toolOptions = function() {
   $.extend(this.options, eval("this.options."+rowrank.prototype.type()));
   return{
         row: {
                animtype: 'bottom',
                uitype: "stamp",
				//pricolor:"#9FCC3B",
				//pridarkcolor:"#9FCC3B",
				//prilightcolor:"#dbe5db",
                extrasmall: { displayimg: true, displaydescr: true, center: false },
                small: { displayimg: true, displaydescr: true, center: false },
                medium: { displayimg: true, displaydescr: true, center: true },
                large: { displayimg: true, displaydescr: true, center: true },
                extralarge: { displayimg: true, displaydescr: true, center: true }
            },
            grid: {
                extrasmall: { hgap: 0, vgap: 0 },
                small: { hgap: 0, vgap: 0 },
                medium: { width: 25, hgap: 0, vgap: 0 },
                large: { width: 25, hgap: 0, vgap: 0 },
                extralarge: { width: 25, hgap: 0, vgap: 0 }
            }  
   }
}