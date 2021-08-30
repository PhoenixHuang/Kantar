var intouchCalQInputTextboxObj = null;
var intouchCalParentObj = null;
var intouchDatePicker = null;
var intouchDatePickerNavConfig = null;

//window.onload = intouchCalendarInit; //The classic window onload event for Date Picker.

function intouchCalendarInit() 
{
	try
	{
		if(intouchCal == null) 
		{ 
			intouchCal = new intouchcalendar(); // Initializing the Intouch Calendar javaScript object.			
			var qInputTextboxArr = document.getElementsByName(qName); //Accessing the Dimensions Text Input Box through the Question Name (qName) variable. 
			intouchCalQInputTextboxObj = qInputTextboxArr[0]; 				
			//To differentiate between the Local and Global (Dimensions) testing platform
			if(document.getElementById("questions"))
			{
				intouchCalParentObj = document.getElementById("questions");	
			}
			else
			{
				intouchCalParentObj = document.body;	
			}		
			//Disabling and Enabling the text boxes for Restricted and Unrestricted Date picker Components using the vairable 'enableDisableTextInput'
			disableEnableTheInputText();			
			buildIntouchCalendar(); 

			if(!intouchCalQInputTextboxObj.readOnly)
			{
				applyTheInputMaskForIntouchCalendar();
				$(intouchCalQInputTextboxObj).focus()
				if(reqValidation == "true")
				{
					$(intouchCalQInputTextboxObj).blur(function() {
						intouchCal.checkDateEntered();
					});
				}
			}
		}	
	}
	catch(err)
	{
		alert("[setTheCalendarIcon][intouchCalendarInit] :: " + err.message)
	}
}
function disableEnableTheInputText()
{   
    
	try
	{
		if(enableDisableTextInput!='') 
		{ 
			if(enableDisableTextInput=='false') 
			{ 
				intouchCalQInputTextboxObj.readOnly  = true; 
				intouchCalQInputTextboxObj.enabled = false;
				intouchCalQInputTextboxObj.style.background = "#CCC";
				intouchCalQInputTextboxObj.setAttribute("onfocus","this.blur()");
			} 
		} 
		else
		{  
			if(minDate!='' || maxDate!='') 
			{ 
				intouchCalQInputTextboxObj.readOnly  = true;
				intouchCalQInputTextboxObj.enabled = false;
				intouchCalQInputTextboxObj.style.background = "#CCC";
				intouchCalQInputTextboxObj.setAttribute("onfocus","this.blur()");
			} 
		}
		//Since we can't provide the refrence of Image Paths directly in the External CSS File, the below function takes care of this requirement.
		loadTheDynamicCSSForDatePicker(intouchCalParentObj);
	}
	catch(err)
	{
		alert("[setTheCalendarIcon][disableEnableTheInputText] :: " + err.message)
	}
}
function loadTheDynamicCSSForDatePicker(parObj)
{
	try
	{
		var cssStr = "";
		var css = document.createElement("style");
		css.type = "text/css";	
		
		cssStr = cssStr + ".yui-skin-sam .yui-calcontainer .calclose{background:url('"+spritesPath+"') no-repeat 0 -300px;width:25px;height:15px;top:.4em;right:.4em;cursor:pointer}";
			
		cssStr = cssStr + ".yui-skin-sam .yui-calendar .calnavleft{background:url('"+spritesPath+"') no-repeat 0 -450px;width:25px;height:15px;top:0;bottom:0;left:-10px;margin-left:.4em;cursor:pointer}";
		
		cssStr = cssStr + ".yui-skin-sam .yui-calendar .calnavright{background:url('"+spritesPath+"') no-repeat 0 -500px;width:25px;height:15px;top:0;bottom:0;right:-10px;margin-right:.4em;cursor:pointer}";
		
		cssStr = cssStr + ".yui-skin-sam .yui-calcontainer .yui-cal-nav .yui-cal-nav-btn{border:1px solid #808080;background:url('"+spritesPath+"') repeat-x 0 0;background-color:#ccc;margin:auto .15em}";
		
		cssStr = cssStr + ".yui-skin-sam .yui-calcontainer .yui-cal-nav .yui-cal-nav-btn.yui-default{border:1px solid #304369;background-color:#426fd9;background:url('"+spritesPath+"') repeat-x 0 -1400px}";
		
		if (navigator.appName != 'Microsoft Internet Explorer')  
		{						
			css.innerHTML = cssStr;
		}
		else if (navigator.appName == 'Microsoft Internet Explorer')  
		{				
			css.styleSheet.cssText = cssStr;
		}		
		parObj.appendChild(css);
		var bodyObj = document.getElementsByTagName("body");
		bodyObj[0].className="yui-skin-sam";		
		createIntouchCalendarIcon();
	}
	catch(err)
	{
		alert("Error at [setTheIntouchCalendar.js] [loadTheDynamicCSSForDatePicker()] :: " + err)
	}
}
function createIntouchCalendarIcon()
{
	try
	{		
		/* The parent Span Tag which HOLDS the calendar Image Icon. The Click Event is registered to this object.*/
		var calSpanTag = document.createElement('span');
		calSpanTag.setAttribute('id', "CalAnchor");   
		calSpanTag.style.position = "absolute";				
		$(calSpanTag).click(function() {
			if(intouchCal != null) 
			{ 
				$("#intouchcalSpan").show();
				$("#intouchcal").show();
			}
		});
		$(".questionContainer").append(calSpanTag);
		
		/* To add the Calendar Image for the above SPAN tag*/
		var calIconObj = createImgTagForIntouch(calIconPath,"Cal")	
		calSpanTag.appendChild(calIconObj);  		
		calIconObj.style.position = "relative";
		calIconObj.style.top = "-5px";
		calIconObj.style.left = "3px";
		
		/* Similar as above image, we have a span parent for the Calendar Holder Div. The only change is: Earlier is for Image and this is for DIV*/
		var calDivSpanTag = document.createElement('span');		
		calDivSpanTag.setAttribute('id', "intouchcalSpan");
		calDivSpanTag.style.position = "absolute";
		$(".questionContainer").append(calDivSpanTag);
		
		/* The respective div where the Calendar will publish*/
		var calDivTag = document.createElement('div');
		calDivTag.setAttribute('id', "intouchcal");
		if(calLayout=="rtl")
		{
			calDivTag.setAttribute('style', "direction: rtl");
		}
		calDivSpanTag.appendChild(calDivTag);		
		calDivTag.style.position = "relative";
		calDivTag.style.left = 28 +"px";// 28 is given as static number here. This can be made parameter driven so that using this parameter we can adjust the space between Calendar Icon and The Calendar Div.

        $(".questionContainer").css({height:"500px"})		
	}
	catch(err)
	{
		alert("[setTheCalendarIcon][createCalIcon] :: " + err.message)
	}
}
function buildIntouchCalendar()
{	
	try
	{		
		if(!intouchDatePickerNavConfig)
		{
			if(needYearNav=="true")
			{
				intouchDatePickerNavConfig = { 
				  strings : { 
					  month: selMonthText, 
					  year: yearText, 
					  submit: submitText, 
					  cancel: cancelText, 
					  invalidYear: invalidYearText 
				  }, 
				  monthFormat: YAHOO.widget.Calendar.SHORT, 
				  initialFocus: "month" 
				};
			}
			else
			{
				intouchDatePickerNavConfig = false;
			}
			YAHOO.namespace("example.calendar"); 					
			YAHOO.example.calendar.init = function() 
			{
				if(minDate !="" && maxDate !="" & pageDate !="")
				{
					intouchDatePicker = new YAHOO.widget.Calendar("intouchcal",{navigator:intouchDatePickerNavConfig,mindate:minDate,maxdate:maxDate,pagedate:pageDate,close:true,title:calTitle}); 
				}
				else if(pageDate !="")
				{
					intouchDatePicker = new YAHOO.widget.Calendar("intouchcal",{navigator:intouchDatePickerNavConfig,close:true,title:calTitle,pagedate:pageDate}); 
				}
				else
				{
					intouchDatePicker = new YAHOO.widget.Calendar("intouchcal",{navigator:intouchDatePickerNavConfig,close:true,title:calTitle}); 
				}
				
				var monthLongArr = monthsLong.split(",");
				intouchDatePicker.cfg.setProperty("MONTHS_LONG",monthLongArr);
				var monthShortArr = monthsShort.split(",");
				intouchDatePicker.cfg.setProperty("MONTHS_SHORT",monthShortArr);
				var daysShortArr = daysShort.split(",");
				intouchDatePicker.cfg.setProperty("WEEKDAYS_SHORT",daysShortArr);
				intouchDatePicker.render(); 				
				intouchDatePicker.selectEvent.subscribe(intouchDateSelected); 				
				intouchDatePicker.showNavEvent.subscribe(applyToNavIntouchCustomColors); 	
				intouchDatePicker.renderEvent.subscribe(applyIntouchCustomColors); 		
				intouchDatePicker.changePageEvent.subscribe(applyIntouchCustomColors); 				
				applyIntouchCustomColors();									
			}			
			YAHOO.util.Event.onDOMReady(YAHOO.example.calendar.init);
			$("#intouchcalSpan").hide();
		}		
	}
	catch(err)
	{
		alert("[setTheCalendarIcon][displayCalendar] :: " + err.message)
	}
}
function intouchDateSelected()
{
	try
	{
		var dateFormatSpliArr = dateFormat.split("/");		
		var arrDates = intouchDatePicker.getSelectedDates();
		var date = arrDates[0];
		var displayMonth = date.getMonth() + 1;displayMonth = String(displayMonth).length == 1 ? "0"+String(displayMonth) : displayMonth 
		var displayYear = date.getFullYear();
		var displayDate = date.getDate();displayDate = String(displayDate).length == 1 ? "0"+String(displayDate) : displayDate
		
		var outputStr = "";
		for(var dateF=0;dateF<dateFormatSpliArr.length;dateF++)
		{
			switch(dateFormatSpliArr[dateF])
			{
				case "mm":
				outputStr += displayMonth+"/"
				break;
				case "dd":
				outputStr += displayDate+"/"
				break;
				case "yyyy":
				outputStr += displayYear+"/"
				break;
			}
		}
		
		pageDate = displayMonth+"/"+displayYear;
		outputStr = outputStr.substr(0,outputStr.length-1)		
		intouchCalQInputTextboxObj.value = outputStr;		
		$("#intouchcalSpan").hide();
	}
	catch(err)
	{
		alert("[intouchcalendar][dateSelected] :: " + err.message)
	}
}
function applyIntouchCustomColors()
{
	try
	{
		var mainDivObj = document.getElementById("intouchcal");
		mainDivObj.style.backgroundColor = calBGColor;	
		for(var ni=0;ni<=6;ni++)
		{
			var eachDay = "calweekdaycell"+ni
			var weekdayObj = document.getElementById(eachDay);
			if(ni%2==0)
			{
				weekdayObj.style.backgroundColor = alcolColor1;
			}
			else
			{
				weekdayObj.style.backgroundColor = alcolColor2;
			}		
		}
		var eachDateCnt = 0;
		for(var nj=0;nj<6;nj++)
		{
			for(var nk=0;nk<7;nk++)
			{
				var eachDay = "intouchcal_t_cell"+eachDateCnt
				var datedayObj = document.getElementById(eachDay);
				var thisChild = datedayObj.getElementsByTagName("A")[0];			
				if(thisChild)
				{
					thisChild.style.color = dateTextColor
				}
				if(nk%2==0)
				{
					datedayObj.style.backgroundColor = alcolColor1
				}
				else
				{
					datedayObj.style.backgroundColor = alcolColor2
				}
				eachDateCnt++;
			}
		}
	}
	catch(err)
	{
		alert("[setTheCalendarIcon][applyIntouchCustomColors] :: " + err.message)
	}
}
function applyToNavIntouchCustomColors()
{
	try
	{
		if (document.getElementsByClassName)
		{
			var navObj = document.getElementsByClassName("yui-cal-nav")[0];
			navObj.style.backgroundColor = calBGColor;	
		}
		else
		{
			var navObj = this.intouchGetElementsByClass("yui-cal-nav"); 
			navObj[0].style.backgroundColor = calBGColor;	
		}
	}
	catch(err)
	{
		alert("[setTheCalendarIcon][applyToNavIntouchCustomColors] :: " + err.message)
	}
}

function applyTheInputMaskForIntouchCalendar()
{
	try
	{
		var numericDateFormat = "";
		switch(dateFormat)
		{
			case "mm/dd/yyyy":
			numericDateFormat = "99/99/9999";
			break;
			case "dd/mm/yyyy":
			numericDateFormat = "99/99/9999";
			break;
			case "yyyy/mm/dd":
			numericDateFormat = "9999/99/99";
			break;
			case "yyyy/dd/mm":
			numericDateFormat = "9999/99/99";
			break;
			case "dd/yyyy/mm":
			numericDateFormat = "99/9999/99";
			break;
			case "mm/yyyy/dd":
			numericDateFormat = "99/9999/99";
			break;
		}
		
		$(intouchCalQInputTextboxObj).mask(numericDateFormat, {placeholder:dateFormat});
	}
	catch(err)
	{
		alert("[setTheCalendarIcon][applyTheInputMaskForIntouchCalendar] :: " + err.message)
	}	
}
/***********************************************************************************************************/
/************************************** UTILITY FUNCTIONS **************************************************/	
/**********************************************************************************************************/

/* A utility function which can be used to create/load the dynamic images*/
function createImgTagForIntouch(src, alt) 
{
	try
	{
		var img= document.createElement('img');
		img.style.cursor = "pointer";
		img.src= src;
		if (alt!=null) img.alt= alt;
		return img;
	}
	catch(err)
	{
		alert("[setTheCalendarIcon][createImgTagForIntouch] :: " + err.message)
	}
}
function intouchGetElementsByClass(cName) 
{
    var matchedArray = [];
	var ele = document.getElementsByTagName("*");
	var pattern = new RegExp("(^| )" + cName + "( |$)");
	for (i in ele) 
	{
		if ( pattern.test( ele[i].className ) ) 
		{
			matchedArray.push( ele[i] )
		}
	}	
	return matchedArray;
}