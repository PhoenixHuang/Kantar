var radioBtnObjArr = new Array();
var othOptionsArr = new Array();
var preSelectedArr = new Array();
var dynamiclist1 = function()
{	
	this.hideTheMainObjs();		
}	
dynamiclist1.prototype.hideTheMainObjs = function ()
{
	try
	{
		var numOfQuestionsArr = inputQObjs.split(",");		
		var numOfOtherOptionsArr = otherOptionsInputStr.split("|");
		for(var eachOtherO=0;eachOtherO<numOfOtherOptionsArr.length;eachOtherO++)
		{
			var otherNameLabelSplitArr = numOfOtherOptionsArr[eachOtherO].split("$");
			othOptionsArr.push({OtherOptionName:otherNameLabelSplitArr[0],OtherOptionLabel:otherNameLabelSplitArr[1]})
		}
		for(var eachQ=0;eachQ<numOfQuestionsArr.length;eachQ++)
		{
			var eachCategoryName = "";
			if(pageQName!=null)
			{
				var eachCategoryName = "[name=_Q"+pageQName+"_Q"+numOfQuestionsArr[eachQ]+"_C]";
				var eachOtherCategoryName = "[name=_Q"+pageQName+"_Q"+numOfQuestionsArr[eachQ]+"_O"+othOptionsArr[eachQ].OtherOptionName+"]";
			}
			else
			{
				var eachCategoryName = "[name=_Q"+numOfQuestionsArr[eachQ]+"_C]";
				var eachOtherCategoryName = "[name=_Q"+numOfQuestionsArr[eachQ]+"_O"+othOptionsArr[eachQ].OtherOptionName+"]";
			}		
			var theListOfQCategories = $(eachCategoryName);
			var theListOfOthCategories = $(eachOtherCategoryName);				
			var otherTextStr = $(theListOfOthCategories[0]).val();	
			$(theListOfQCategories[0]).parent().parent().hide();							
			for(var eachQCat=0;eachQCat<theListOfQCategories.length;eachQCat++)
			{
				var eachRadioButtonLabel = $.trim($(theListOfQCategories[eachQCat]).next('label').text())
				eachRadioButtonLabel=eachRadioButtonLabel.split(",");
				radioBtnObjArr.push({RadioBtnObj:theListOfQCategories[eachQCat],RadioBtnLabel:eachRadioButtonLabel[0].toUpperCase(),RadioButtonID:numOfQuestionsArr[eachQ],RadioButtonName:eachCategoryName,RadioButtonOtherName:eachOtherCategoryName})
				//$(theListOfQCategories[eachQCat]).parent().hide();				
				if(otherTextStr=="")
				{
					if($(theListOfQCategories[eachQCat]).attr('checked') == 'checked')
					{					
						preSelectedArr.push({SelectedPreValue:eachRadioButtonLabel[0],SelectedObj:"#"+numOfQuestionsArr[eachQ]})
					}
				}				
			}
			this.createTheInputElements(theListOfQCategories[0],numOfQuestionsArr[eachQ],eachQ,otherTextStr);
		}		
		//updateLayout();
		this.loadTheAutoCompCSS();
		var nextOptionsStr = this.buildOptionsArr();
		var nextInputId = "#"+numOfQuestionsArr[0];
		makeThisWork(nextInputId,nextOptionsStr);
		if(preSelectedArr.length>0)
		{
			for(var eachPreVal=0;eachPreVal<preSelectedArr.length;eachPreVal++)
			{
				$(preSelectedArr[eachPreVal].SelectedObj).val(preSelectedArr[eachPreVal].SelectedPreValue);
				optionSelected(preSelectedArr[eachPreVal].SelectedPreValue,preSelectedArr[eachPreVal].SelectedObj,false);
			}
		}		
	}
	catch(err)
	{
		alert("Error at [dynamiclist.js] [hideTheMainObjs()] :: " + err)
	}
}
function formSubmitFun()
{
	try
	{
		var qSplitArr = inputQObjs.split(",");		
		for(var ni=0;ni<qSplitArr.length;ni++)
		{
			var thisQVal = $("#"+qSplitArr[ni]).val();
			
			if(thisQVal!="")
			{
				var result = $.grep(radioBtnObjArr, function(e,i){  return (e.RadioBtnLabel === thisQVal.toUpperCase()); });
				if(result.length>0)
				{
					$(result[0].RadioBtnObj).attr('checked', 'checked');
				}
				else
				{
					if(pageQName!=null)
					{
						var eachCategoryName = "[name=_Q"+pageQName+"_Q"+qSplitArr[ni]+"_C]";
						var eachOtherCategoryName = "[name=_Q"+pageQName+"_Q"+qSplitArr[ni]+"_O"+othOptionsArr[ni].OtherOptionName+"]";
					}
					else
					{
						var eachCategoryName = "[name=_Q"+qSplitArr[ni]+"_C]";
						var eachOtherCategoryName = "[name=_Q"+qSplitArr[ni]+"_O"+othOptionsArr[ni].OtherOptionName+"]";
					}			
					var theListOfQCategories = $(eachCategoryName);
					for(var eachQCat=0;eachQCat<theListOfQCategories.length;eachQCat++)
					{
						var otherRadioButtonLabel = $.trim($(theListOfQCategories[eachQCat]).next('label').text())
						if(otherRadioButtonLabel == othOptionsArr[ni].OtherOptionLabel)
						{
							$(theListOfQCategories[eachQCat]).attr('checked', 'checked');
							var theListOfOthCategories = $(eachOtherCategoryName);
							$(theListOfOthCategories[0]).val(thisQVal);
						}
					}
				}
			}
			else
			{
				var result = $.grep(radioBtnObjArr, function(e,i){ return (e.RadioButtonID === qSplitArr[ni]); });
				if(result.length>0)
				{
					var theListOfEmptyQCategories = $(result[0].RadioButtonName);
					for(var eachEmptyQCat=0;eachEmptyQCat<theListOfEmptyQCategories.length;eachEmptyQCat++)
					{
						$(theListOfEmptyQCategories[eachEmptyQCat]).attr('checked', false);
					}					
					var theListOfEmptyOthCategories = $(result[0].RadioButtonOtherName);
					$(theListOfEmptyOthCategories[0]).val("");
				}
			}
		}
	}
	catch(err)
	{
		alert("Error at [dynamiclist.js] [formSubmitFun()] :: " + err)
	}
}
function clearTheOtherSelectionValues()
{
	try
	{
		var qSplitArr = inputQObjs.split(",");		
		for(var ni=0;ni<qSplitArr.length;ni++)
		{
		var thisQVal = $("#"+qSplitArr[ni]).val();
		
			if(pageQName!="")
			{
				var eachCategoryName = "[name=_Q"+pageQName+"_Q"+qSplitArr[ni]+"_C]";
				var eachOtherCategoryName = "[name=_Q"+pageQName+"_Q"+qSplitArr[ni]+"_O"+othOptionsArr[ni].OtherOptionName+"]";
			}
			else
			{
				var eachCategoryName = "[name=_Q"+qSplitArr[ni]+"_C]";
				var eachOtherCategoryName = "[name=_Q"+qSplitArr[ni]+"_O"+othOptionsArr[ni].OtherOptionName+"]";
			}			
			var theListOfQCategories = $(eachCategoryName);
			for(var eachQCat=0;eachQCat<theListOfQCategories.length;eachQCat++)
			{
				var otherRadioButtonLabel = $.trim($(theListOfQCategories[eachQCat]).next('label').text())
				if(otherRadioButtonLabel == othOptionsArr[ni].OtherOptionLabel)
				{
					$(theListOfQCategories[eachQCat]).attr('checked', false);
					var theListOfOthCategories = $(eachOtherCategoryName);
					$(theListOfOthCategories[0]).val("");
				}
			}
		}		
	}
	catch(err)
	{
		alert("Error at [dynamiclist.js] [clearTheOtherSelectionValues()] :: " + err)
	}
}
function makeThisWork(inputID,inputOptionsStr)
{
	try
	{
		var inputDiv = $(inputID).autocomplete({
			width: $(inputID).width,
			minChars:parseInt(minCharsType),
			minLength:5,
			lookup: inputOptionsStr.split(','),			
			onSelect: function(value, data){ optionSelected(value,inputID,true); }
		});
		divCreatedArr.push({ObjName:inputID,Obj:inputDiv})
	}
	catch(err)
	{
		alert("Error at [dynamiclist.js] [makeThisWork()] :: " + err)
	}
}
function optionSelected(selValue,selectedInput,preBool)
{
	try
	{
		var selectedQ = selectedInput.substr(1,selectedInput.length);
		var qSplitArr = inputQObjs.split(",");		
		var qIndex = -1;
		for(var ni=0;ni<qSplitArr.length;ni++)
		{
			if(selectedQ == qSplitArr[ni])
			{
				qIndex = ni;				
				break;
			}
		}
		qIndex = qIndex + 1;
		if(qIndex < qSplitArr.length && qIndex != -1)
		{
			var nextInputName = "#"+qSplitArr[qIndex];
			var nextInputObj = document.getElementById(qSplitArr[qIndex]);		
			if(preBool)
			{
				nextInputObj.value = "";		
			}
			var nextOptionsStr = "";
			for(var showTheseVal=0;showTheseVal<qOptionsArr.length;showTheseVal++)
			{
				if(qIndex == qOptionsArr[showTheseVal].OptionIndex)
				{
					if(selValue == qOptionsArr[showTheseVal].OptionDependent)
					{
						nextOptionsStr = nextOptionsStr + qOptionsArr[showTheseVal].OptionName+",";
					}
				}
			}			
			nextOptionsStr = nextOptionsStr.substr(0,nextOptionsStr.length-1)
			var canCallFresh = true;
			var index = -1;
			for(var ni=0;ni<divCreatedArr.length;ni++)
			{
				if(nextInputName == divCreatedArr[ni].ObjName)
				{
					canCallFresh = false;
					index = ni;
					break;
				}
			}
			if(index == -1)
			{
				makeThisWork(nextInputName,nextOptionsStr)					
			}
			else
			{
				divCreatedArr[index].Obj.setOptions({ lookup: nextOptionsStr.split(',') });
			}								
		}
		var result = $.grep(radioBtnObjArr, function(e,i){ return (e.RadioBtnLabel === selValue.toUpperCase()); });
		if(result.length>0)
		{
			$(result[0].RadioBtnObj).attr('checked', 'checked');
		}	
		clearTheOtherSelectionValues();
	}
	catch(err)
	{
		alert("Error at [dynamiclist.js] [optionSelected()] :: " + err)
	}
}
dynamiclist1.prototype.createTheInputElements = function (refObj,qName,qIndex,defText)
{
	try
	{
		var createInput = document.createElement("input");   
		createInput.setAttribute("type","text");
		createInput.setAttribute("id",qName);
		createInput.setAttribute("name",qIndex);
		createInput.setAttribute("autocomplete","off");
		createInput.className = "text-input valid";         
		$(createInput).height(22)
		$(createInput).val(defText)
		$(refObj).parent().parent().parent().append(createInput);
	}
	catch(err)
	{
	alert("Error at [dynamiclist.js] [createTheInputElements()] :: " + err)
	}
}
dynamiclist1.prototype.buildOptionsArr = function ()
{
	try
	{
		var qOptions = optionsInputStr.split("|");	
		var nextOptionsStr	= "";	
		for(var eachOptionCat=0;eachOptionCat<qOptions.length;eachOptionCat++)
		{
			var qIndividualOptions = qOptions[eachOptionCat].split("^");			
			for(var eachInvOption=0;eachInvOption<qIndividualOptions.length;eachInvOption++)
			{
				if(eachOptionCat == 0)
				{
					nextOptionsStr = nextOptionsStr + qIndividualOptions[eachInvOption]+",";
				}
				else
				{
					var eachDependentSplit = qIndividualOptions[eachInvOption].split(",");
					qOptionsArr.push({OptionName:eachDependentSplit[0],OptionDependent:eachDependentSplit[1],OptionIndex:eachOptionCat});
				}
			}
		}
		nextOptionsStr = nextOptionsStr.substr(0,nextOptionsStr.length-1);
		return nextOptionsStr;
	}
	catch(err)
	{
		alert("Error at [dynamiclist.js] [buildOptionsArr()] :: " + err)
	}	
}
dynamiclist1.prototype.loadTheAutoCompCSS = function ()
{
	try
	{
		var css = document.createElement("style");
		css.type = "text/css";
		if(layoutType == "rtl")
		{
			if (navigator.appName != 'Microsoft Internet Explorer')  
			{
				css.innerHTML = ".autocomplete {background: none repeat scroll 0 0 #FFFFFF;border: 1px solid #999999;cursor: default;margin: -6px 6px 6px -6px;max-height: 350px;overflow: auto;text-align: right;}";
			}
			else if (navigator.appName == 'Microsoft Internet Explorer')  
			{				
				css.styleSheet.cssText = ".autocomplete {background: none repeat scroll 0 0 #FFFFFF;border: 1px solid #999999;cursor: default;margin: -6px 6px 6px -6px;max-height: 350px;overflow: auto;text-align: right;}";
			}
		}
		else
		{
			if (navigator.appName != 'Microsoft Internet Explorer')  
			{
				css.innerHTML = ".autocomplete {background: none repeat scroll 0 0 #FFFFFF;border: 1px solid #999999;cursor: default;margin: -6px 6px 6px -6px;max-height: 350px;overflow: auto;text-align: left;}";
			}
			else if (navigator.appName == 'Microsoft Internet Explorer')  
			{				
				css.styleSheet.cssText = ".autocomplete {background: none repeat scroll 0 0 #FFFFFF;border: 1px solid #999999;cursor: default;margin: -6px 6px 6px -6px;max-height: 350px;overflow: auto;text-align: left;}";
			}
		}
		document.body.appendChild(css);
	}
	catch(err)
	{
		alert("Error at [dynamiclist.js] [loadTheAutoCompCSS()] :: " + err)
	}
}
