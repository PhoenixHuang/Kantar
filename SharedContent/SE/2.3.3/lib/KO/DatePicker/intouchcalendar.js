var intouchcalendar = function() 
{	
	if(dateFormat == undefined || dateFormat == "")
	{
		dateFormat = "mm/dd/yyyy";
	}
	if(minDate == undefined || minDate == "")
	{
		minDate = "";
	}
	if(maxDate == undefined || maxDate == "")
	{
		maxDate = "";
	}
	if(pageDate == undefined || pageDate == "")
	{
		pageDate = "";
	}
	if(calTitle == undefined || calTitle == "")
	{
		calTitle = "";
	}
	if(needYearNav == undefined || needYearNav == "")
	{
		needYearNav = true;
	}
	if(qName == undefined || qName == "")
	{
		alert("qName property is mandatory");
	}	
	if(monthsLong == undefined || monthsLong == "")
	{
		monthsLong = "January, February, March, April, May, June, July, August, September, October, November, December";
	}	
	if(monthsShort == undefined || monthsShort == "")
	{
		monthsShort = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec"
	}	
	if(daysShort == undefined || daysShort == "")
	{
		daysShort = "Su,Mo,Tu,We,Th,Fr,Sa"
	}
	if(calBGColor == undefined || calBGColor == "")
	{
		calBGColor = "#bbcca0"
	}
	if(alcolColor1 == undefined || alcolColor1 == "")
	{
		alcolColor1 = "#eeeeee"
	}
	if(alcolColor2 == undefined || alcolColor2 == "")
	{
		alcolColor2 = "#ccd9b9"
	}
	if(dateTextColor == undefined || dateTextColor == "")
	{
		dateTextColor = "#000000"
	}
	if(selMonthText == undefined || selMonthText == "")
	{
		selMonthText = "Select Month"
	}
	if(yearText == undefined || yearText == "")
	{
		yearText = "Year"
	}
	if(submitText == undefined || submitText == "")
	{
		submitText = "OK"
	}
	if(cancelText == undefined || cancelText == "")
	{
		cancelText = "Cancel"
	}
	if(invalidYearText == undefined || invalidYearText == "")
	{
		invalidYearText = "Year Entered is Invalid"
	}
};		

intouchcalendar.prototype.checkDateEntered = function()	{			
	submitCheckScript.splice(0,submitCheckScript.length)
	var dateEntered = $(intouchCalQInputTextboxObj).val();
	if(dateEntered != "")
	{
		var checkDate = Date.parse(dateEntered);
		var bool = false;
		if (isNaN(checkDate)) 
		{
			bool = false;
		}
		var enteredDateSpliArr = dateEntered.split("/");			
		if(enteredDateSpliArr.length<3)
		{
			bool = false;
		}
		for(var dateF=0;dateF<enteredDateSpliArr.length;dateF++)
		{
			switch(dateFormat)
			{
				case "mm/dd/yyyy":
				var enteredMonth = enteredDateSpliArr[0];var enteredDay = enteredDateSpliArr[1];var enteredYear = enteredDateSpliArr[2];
				break;
				case "dd/mm/yyyy":
				var enteredMonth = enteredDateSpliArr[1];var enteredDay = enteredDateSpliArr[0];var enteredYear = enteredDateSpliArr[2];
				break;
				case "yyyy/mm/dd":
				var enteredMonth = enteredDateSpliArr[1];var enteredDay = enteredDateSpliArr[2];var enteredYear = enteredDateSpliArr[0];
				break;
				case "yyyy/dd/mm":
				var enteredMonth = enteredDateSpliArr[2];var enteredDay = enteredDateSpliArr[1];var enteredYear = enteredDateSpliArr[0];
				break;
				case "dd/yyyy/mm":
				var enteredMonth = enteredDateSpliArr[2];var enteredDay = enteredDateSpliArr[0];var enteredYear = enteredDateSpliArr[1];
				break;
				case "mm/yyyy/dd":
				var enteredMonth = enteredDateSpliArr[0];var enteredDay = enteredDateSpliArr[2];var enteredYear = enteredDateSpliArr[1];
				break;
			}
		}
		enteredMonth = parseInt(enteredMonth, 10);
		enteredDay = parseInt(enteredDay, 10);
		enteredYear = parseInt(enteredYear, 10);
		
		var checkDateType = new Date(enteredYear,enteredMonth-1,enteredDay);
		if (checkDateType.getFullYear() == enteredYear && checkDateType.getMonth() + 1 == enteredMonth && checkDateType.getDate() == enteredDay) 
		{
		  bool = true;			  
		} 
		else 
		{			
		  bool = false
		}			
		if(!bool)
		{
			submitCheckScript.push('false');
			alert("Invalid Date Entry");
		}		
		return bool;
	}
};


