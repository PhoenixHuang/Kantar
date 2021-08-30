/**
 * toggle class
 * Inherits from SESurveyTool
 */
 
function toggle(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
toggle.prototype = Object.create(SESurveyTool.prototype);

toggle.prototype.type = function(){
    return "toggle";
}
toggle.prototype.getDependencies = function(){
    return [
		{'type':'stylesheet', 'url' :pageLayout.themePath + 'css/toggle.css' }
		
    ];
}

toggle.prototype.build = function(){
      
        this.deferred.resolve();		 
}

toggle.prototype.render = function(){
		var compRTL=this.getProperty("compRTL");
        this.componentContainer = $('<div>');
        this.componentContainer.append(this.label);
        this.componentContainer.attr('id','qc_'+this.questionFullName); //change to be more identifable with question?
        this.componentContainer.addClass('qcContainer');
		
        
		var optionalValues = [];
		var inputIds = [];
		var checkedState = '';
		 $.each(this.inputs, function(i, e) {
		    var el = $(e);
			label = el.parent().find('label').clone();
			optionalValues.push($.trim(label.text()));
			inputIds.push(this.id);
        });
		
		var opt1= $("#"+inputIds[0]);
		var opt2= $('#'+inputIds[1]);
		
		if(opt1.is(":checked") === false && opt2.is(":checked") === false){
			opt2.prop('checked',true);
		}
		var inputID=inputIds[0];
		if (opt1.is(":checked")) {
			checkedState = 'checked';
		}
		if (opt2.is(":checked")) {
			checkedState = '';
		}
		
		$('head').append('<style>.onoffswitch-inner'+inputID+':before {content: "'+optionalValues[0]+'";}.onoffswitch-inner'+inputID+':after {content: "'+optionalValues[1]+'";}</style>');
		
		var togglecontainer=$("<div>");
		togglecontainer.addClass('onoffswitch'+inputID+' onoffswitch');
		if(compRTL == true){
		togglecontainer.css( {"direction":"ltr","margin-right":"20px"} );
		}
		var input=$("<input>");
		input.attr('type','checkbox');
		input.attr('name','onoffswitch');
		input.addClass('onoffswitch-checkbox'+inputID+' onoffswitch-checkbox');
		input.attr('id','myonoffswitch'+inputID);
		input.prop('checked',checkedState);
		togglecontainer.append(input);
		
		var label=$("<label>"); 
		label.addClass('onoffswitch-label');
		label.attr('for','myonoffswitch'+inputID);
		
		var span1=$("<span>");
		span1.addClass('onoffswitch-inner'+inputID+' onoffswitch-inner onoffswitch-inner-add'+inputID+' onoffswitch-inner-add');
		label.append(span1);
		
		var span2=$("<label>");
		span2.addClass('onoffswitch-switch');
		label.append(span2);
		
		togglecontainer.append(label);
		
		this.component=togglecontainer;
		
        this.componentContainer.append(this.component);
		this.nativeContainer.after(this.componentContainer);
		$(".onoffswitch"+inputID).bind("click",function(){
           
			if ($(".onoffswitch-checkbox"+inputID).is(":checked")) {
				opt1.prop('checked',true);
				opt2.prop('checked',false);
            }
            else { 
				opt1.prop('checked',false);
				opt2.prop('checked',true);
            }
		});
		  
		this.nativeContainer.hide();
		
		if(compRTL == true){
			this.componentContainer.css( "direction", 'rtl' );
			//$( ".onoffswitch" ).css( {"direction":"ltr","margin-right":"20px"} );
		}
    }
	