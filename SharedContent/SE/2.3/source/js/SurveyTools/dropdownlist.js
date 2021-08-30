/**
 * dropdownlist class
 * Inherits from SESurveyTool
 */
function dropdownlist(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
dropdownlist.prototype = Object.create(SESurveyTool.prototype);
dropdownlist.prototype.type = function(){
    return "dropdownlist";
}
dropdownlist.prototype.getDependencies = function(){
    return [
		{'type':'stylesheet', 'url' : surveyPage.path + 'lib/KO/DropDownList/dropdownlist.css'},
		{'type':'script', 'url' : surveyPage.path + 'lib/KO/DropDownList/jquery.selecty.js'}
		
    ];
}

dropdownlist.prototype.setResponses = function (){
	var $select = this.componentContainer.find('select');
	$("#"+$select.val()).attr("checked",true);
   
}

dropdownlist.prototype.build = function(){
		var defaulttext = this.getProperty("defaulttext");
		var dropdown = $("<select></select>");
		dropdown.append("<option disabled='true' selected='true'>"+defaulttext+"</option>");
		 $.each(this.inputs, function (i, e) {
			
            var el = $(e);
            var elType = (el).attr('type');
			var elId = (el).attr('id');
            if (elType == 'text' || elType == 'textarea') return true;

            label = el.parent().find('label').text();
			
			if ($(e).is(":checked")) {
			   var selectedId = $(e).attr("id");
			   dropdown.append("<option value='"+elId+"' selected='true'>" + label + "</option>");
			}else{
			   dropdown.append("<option value='"+elId+"'>" + label + "</option>");
			}
        });
		this.component = dropdown;
		
		
        this.deferred.resolve();		 
}

dropdownlist.prototype.render = function(){

		this.componentContainer = $('<div></div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		this.componentContainer.append("<br/><br/>");
		this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer);
		
		var compRTL = this.getProperty("compRTL");
		var dropdownbackcolor = this.getProperty("backcolor");
		var dropdowntextcolor = this.getProperty("textcolor");
		var dropdownlistbackcolor = this.getProperty("listbackcolor");
		var dropdownlistitembackcolor = this.getProperty("listitembackcolor");
		var dropdownlisttextcolor = this.getProperty("listtextcolor");
		var dropdownlistitemtextcolor = this.getProperty("listitemtextcolor");
		var dropdownarrowcolor = this.getProperty("arrowcolor");
	
        // Getting select Object from DOM
		var $select = this.componentContainer.find('select');
		
		var selected_text = $select.find("option:selected").text();
		
		
		$select.attr({"class": "selecty"});
		$select.selecty();
		
		var $selecty_select = this.componentContainer.find('.selecty-select');
		
		
		$selecty_select.css({"color": dropdowntextcolor,"background-color": dropdownbackcolor})
		
		var $selecty_arrow = this.componentContainer.find('.selecty-select > .selecty-arrow');
		$selecty_arrow.css({"color": dropdownarrowcolor})
		
		var $selecty_container = this.componentContainer.find('.selecty-container');
		
		$selecty_container.find("ul > li").not("li[disabled]").css({"color": dropdownlisttextcolor,"background-color": dropdownlistbackcolor});
		
		$selecty_container.find("li[disabled]").css({"background-color": dropdownlistbackcolor});
		
		$selecty_container.find("ul > li").not("li[disabled]").hover(function() {
			$(this).css({"color": dropdownlistitemtextcolor,"background-color": dropdownlistitembackcolor})
		 },function(){
			$(this).css({"color": dropdownlisttextcolor,"background-color": dropdownlistbackcolor})
		 });
		
		if(compRTL == true){
			this.componentContainer.css({"direction": "rtl"});
		}
        this.nativeContainer.hide();
    }
	
	
	dropdownlist.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + dropdownlist.prototype.type()));
    switch (pageLayout.deviceType.toUpperCase()) {
        case "LARGETABLET":
        case "MEDIUMTABLET":
        case "SMALLTABLET":
        case "SMARTPHONETOUCH":
            if (this.orientation == 0 || this.orientation == 180) {
                return {
					'compRTL':false,
					'defaulttext': 'Please Choose One',
					'backcolor':'#9FCC3B',
					'textcolor':'#fff',
					'arrowcolor':'#ccc',
					'listbackcolor':'#fff',
					'listitembackcolor':'#988',
					'listtextcolor':'#000',
					'listitemtextcolor':'#fff'
                }
            } else {
                return {
                    'compRTL':false,
					'defaulttext': 'Please Choose One',
					'backcolor':'#9FCC3B',
					'textcolor':'#fff',
					'arrowcolor':'#ccc',
					'listbackcolor':'#fff',
					'listitembackcolor':'#988',
					'listtextcolor':'#000',
					'listitemtextcolor':'#fff'
                }
            }
        case "PC":
        case "OTHERDEVICE":
        default:
            return {
             		'compRTL':false,
					'defaulttext': 'Please Choose One',
					'backcolor':'#9FCC3B',
					'textcolor':'#fff',
					'arrowcolor':'#ccc',
					'listbackcolor':'#fff',
					'listitembackcolor':'#988',
					'listtextcolor':'#000',
					'listitemtextcolor':'#fff'
            }
    }
}