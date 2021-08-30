/**
 * @version v38 fix for Negative values
 */


var FreeHandApplication = function(){
	
	var propertiesObj = new Object();
	
	var img;
	var isMouseDown = false;
	var canvasObj;
	var context;
	var capturedBoxNums = [];
	var rows,columns;
	var pathPositions = []
	var totalPaths = 0;
	var pathObj=new Object();
	var showGrid = false;
	var consideringSize = .7;
	var moved = false;
	var pre_x=0;
	var pre_y=0;
	var x1=0
	var y1=0
	
	//properties
	var color;
	var developerMode;
	var gridLineColor;
	var imgPath;
	var imgWidth;
	var imgHeight;
	var boxSize;
	var lineWidth;
	var autoDimensions;
	
	function init(props)
	{
		propertiesObj = props
		setProperties()
		addingCSSStyles()
		updateSize()
		//control the body elements
		controllingBodyElements();
		loadImg()
		//configure mouse events
		configureListeners();
		//Map the touch events with Mouse events
		configureTouchListeners();
	}
	function controllingBodyElements()
	{
		canvasObj = document.getElementById(propertiesObj.canvasID)
		if(typeof(G_vmlCanvasManager) != 'undefined')
		{
			G_vmlCanvasManager.initElement(canvasObj);
			
		}
		context=canvasObj.getContext("2d");
	
		var clearBtn = document.getElementById(propertiesObj.clearButton);
		var noopnbtn=document.getElementById(propertiesObj.noOpnButton);
		
		$(clearBtn).bind("click",clearCanvas)
		$(noopnbtn).bind("click",clearAndSubmit)
		
		var gridBtn = document.getElementById(propertiesObj.showGridButton);
		$(gridBtn).bind("click",visibleGrid);
		
		if(!developerMode)
		{
			gridBtn.style.display = "none"
			document.getElementById(propertiesObj.dataTextArea).style.display = "none"
		}
		
		if(propertiesObj.noopnbtnhide=="true")
		{
			noopnbtn.style.display = "none"
			
		}
		document.getElementById(propertiesObj.parentID).style.visibility = "hidden"
	
	}
	function setProperties()
	{
		//properties = {"imgPath":"http://cdn.tns-global.com/Multimedia/AP/UI/3.jpg" , "imgWidth":"400" , "imgHeight":"400" , "cellSize":"20" , "drawColor":"#00CCFF" , "alpha":"0.5" , "lineWidth":"5" , "cursorPath":"http://cdn.tns-global.com/Multimedia/AP/UI/pen2.ico" , "debuggerMode":"false" , "gridColor":"#000000" , "canvasID":"KOFHCanvas" , "imagePreloader":"KOFHpreloader" , "clearButton":"KOFHclearBtn" , "showGridButton":"KOFHshowGrid" , "dataTextArea":"KOFHdata" , "jsQid":"_QOE"}
		//console.log("This is setProerpties Function")
		if(!propertiesObj.imgPath || propertiesObj.imgPath=="")
		alert("Image path is missing or not defined");
		else
		imgPath = propertiesObj.imgPath+'&#38;'+new Date().getTime(); //Adding Time stamp to the Image url which forces to load from sever
		imgWidth = propertiesObj.imgWidth || propertiesObj.defImgWidth;
		imgHeight = propertiesObj.imgHeight || propertiesObj.defImgHeight;
		lineWidth = propertiesObj.lineWidth || propertiesObj.defLineWidth;
		boxSize = propertiesObj.cellSize*1 || propertiesObj.defCellSize*1;
		developerMode = (propertiesObj.debuggerMode == "true") ? true : false;
		cursorPath = propertiesObj.cursorPath;
		gridLineColor = propertiesObj.gridColor || "#000000";
		
		var alpha = propertiesObj.alpha || propertiesObj.defAlpha; 
		color = hexToRgba(propertiesObj.drawColor || "#00ccff",alpha);
		
		autoDimensions = (propertiesObj.autoDimensions == "true") ? true : false;
		
		//alert(color)
	}
	function addingCSSStyles()
        {
               var styleElement = document.createElement("style");
               styleElement.type = "text/css";
               //var cssText = "canvas {cursor : url("+cursorPath+"),default !important ; }"
               var cssText 
               if(navigator.userAgent.toUpperCase().indexOf("MSIE") > 0)
               {
                       cssText= "canvas {cursor : url("+cursorPath+"),default !important ; }"
               }
               else
               {
               cssText= "canvas {cursor : url("+cursorPath+") 0 30 ,default !important ; }"
               }
               if (styleElement.styleSheet) {
                       styleElement.styleSheet.cssText = cssText
               } else {
                       styleElement.appendChild(document.createTextNode(cssText));
               }
               document.body.appendChild(styleElement);
        }

	function updateSize()
	{
		if(autoDimensions)
		{
			//total area before considering resolution
			var oldWidth = imgWidth;
			var oldHeight = imgHeight;
			var oldBoxSize = boxSize;
			//Calculate the width and height based on the screen resolution considering aspect ratio
			var ratio = imgWidth/imgHeight
			var width = window.innerWidth || document.documentElement.clientWidth;
			var height = window.innerHeight || document.documentElement.clientHeight;
			if(width> height)
			{
				imgHeight = Math.floor(height*consideringSize);
				imgWidth = Math.floor(ratio*imgHeight);						
			}
			else
			{
				imgWidth = Math.floor(width*consideringSize);
				imgHeight = Math.floor(imgWidth/ratio);
			}
			boxSize =  Math.floor((imgWidth/oldWidth)*oldBoxSize)
			/* round off the width and heights based on bozSize*/
			imgWidth = (oldWidth/oldBoxSize)*boxSize
			imgHeight = (oldHeight/oldBoxSize)*boxSize
		
		
		}
		
		//calculate the columns and rows		
		columns = Math.floor(imgWidth/boxSize);
		rows = Math.floor(imgHeight/boxSize);
		
		//alert(columns);
	}
	//Clear the canvas
	function clearCanvas()
	{
			canvasObj.width = canvasObj.width
			pathPositions = new Array();
			totalPaths = 0;
			createReqThings();
	}
	//Clear and submit on noopinionbtn click
	function clearAndSubmit()
	{
	  clearCanvas()
	  //document.getElementById(propertiesObj.dataTextArea).value = "NoOpinion"
	  
	  document.getElementsByName(propertiesObj.jsQid)[0].value = "NoOpinion"
	  document.forms[0].submit();
	}
	//control the grid visibility
	function visibleGrid()
	{
		if(showGrid)
		{
			document.getElementById(propertiesObj.showGridButton).value = "Show Grid"
			showGrid = false
		}
		else
		{
			document.getElementById(propertiesObj.showGridButton).value = "Hide Grid"
			showGrid = true
		}
		canvasObj.width = canvasObj.width
		createReqThings(showGrid);
		
		//redraw the paths
		drawPaths();
		
	}
	//redraw the paths
	function drawPaths()
	{
		//alert(pathPositions[0].positions[0]._x)
		for(var i=0; i<pathPositions.length; i++)
		{
			
			if(pathPositions[i].move == true)
			{
				var totalXYs = pathPositions[i].positions.length
				
				//context.moveTo(pathPositions[i].positions[0]._x, pathPositions[i].positions[0]._y);
				//alert(totalXYs)
				for(var j=0;j<totalXYs-1; j++)
				{
					
					context.beginPath();
					context.moveTo(pathPositions[i].positions[j]._x, pathPositions[i].positions[j]._y);
					context.lineTo(pathPositions[i].positions[j+1]._x, pathPositions[i].positions[j+1]._y);
					context.lineCap = "round";
//					context.lineJoin = "round";
					context.lineWidth = lineWidth;
					context.strokeStyle = color;
					context.fillStyle = color;
					context.closePath();
					context.stroke();
					
					hittedBoxNumber(pathPositions[i].positions[j]._x, pathPositions[i].positions[j]._y)
				}
				hittedBoxNumber(pathPositions[i].positions[totalXYs-1]._x, pathPositions[i].positions[totalXYs-1]._y)
			}
			else
			{
				context.beginPath();
				context.arc(pathPositions[i].positions[0]._x, pathPositions[i].positions[0]._y, lineWidth/2+1, 0, 2 * Math.PI, false);
				context.fillStyle = color;
				context.fill();
				hittedBoxNumber(pathPositions[i].positions[0]._x, pathPositions[i].positions[0]._y);
			}
		}
	}
	//load image onto canvas and update the canvas size based on screen resolution
	function loadImg() {
						
		img = new Image();
		img.onload = function() {
			
			document.getElementById(propertiesObj.parentID).style.visibility = "visible"
		    document.getElementById(propertiesObj.imagePreloader).style.display = "none"
			canvasObj.width = imgWidth; 
			canvasObj.style.width = canvasObj.width + 'px'; 
			canvasObj.height = imgHeight; 
		 	canvasObj.style.height = canvasObj.height + 'px'; 
		 	clearCanvas()
			//createReqThings()
		};
		img.onerror=function() {
		
		 alert("Image not found");
		};
		img.src = imgPath;
	
	}
	function createReqThings()
	{
		context.drawImage(img, 0, 0,imgWidth,imgHeight);
		if(showGrid)
		{
			createGrid()
		}
		
		capturedBoxNums = [];
		updateValues();
	}
	function createGrid()
	{
		context.beginPath();
		context.lineWidth = 1;
		for (var x = 0.5; x < imgWidth; x += boxSize) {
				 context.moveTo(x, 0);
				 context.lineTo(x, imgHeight);
		}
		for (var y = 0.5; y < imgHeight; y += boxSize) {
				 context.moveTo(0, y);
				 context.lineTo(imgWidth, y);
		}
		context.strokeStyle = gridLineColor
		context.stroke();
			
	}
	
	/*function mouseEnter_canvasObj(e)
	{
		pathStart(e)
		if(isMouseDown)
		{	
			draw(e);
		}
	}*/
	function click_canvasObj(e)
	{
		if(!moved)
		{
			letsStartDraw(e)
		}
	}
	function mousedown_canvasObj(e)
	{
	     $(canvasObj).bind("mousemove",mouseMove_canvasObj) 
		//path count
		pathStart(e);
		isMouseDown = true
	}
	function pathStart(e)
	{
		totalPaths++;
		moved = false
		
		//var coordinates = getXY(e);	
		
		var coordinates = getXY(e);	
		
		x1 = coordinates[0]-canvasObj.offsetLeft+1
		y1 = coordinates[1]-canvasObj.offsetTop	
		
		//store the positions, for recreating the paths
		pathObj = new Object();
		pathObj.move = false
		pathObj.positions = [];
		pathObj.positions.push({_x:x1,_y:y1})
		pathPositions.push(pathObj);
	}
	function mouseMove_canvasObj(e)
	{
		//document.getElementById('canvas').style.cursor = 'url(pen2.ico),default !important ;'
		//document.getElementById('canvas').style.cursor = "cursor: url(cursor.cur);"
	       
		if(isMouseDown)
		{	
			//window.alert(e.pageX+"------PageX")
			 pre_x=x1;
			pre_y=y1;
		var coordinates = getXY(e);	
		
		x1 = coordinates[0]-canvasObj.offsetLeft+1
		y1 = coordinates[1]-canvasObj.offsetTop	
		
			draw(e);
		}
	}
	function mouseLeave_document(e)
	{
		
		$(canvasObj).unbind("mousemove",mouseMove_canvasObj)
	}
	function mouseUp_document(e)
	{
		$(canvasObj).unbind("mousemove",mouseMove_canvasObj)
		isMouseDown = false
		//moved = true;
		
	}
	function mouseOver_canvasObj(e)
	{
		
		if(isMouseDown)
		{
		   totalPaths++;
				
		 pathStart(e)
		 $(canvasObj).bind("mousemove",mouseMove_canvasObj) 
		}
		
	}
	function letsStartDraw(e)
	{
		
		
		var coordinates = getXY(e);	
		
		var x = coordinates[0]-canvasObj.offsetLeft+1
		var y = coordinates[1]-canvasObj.offsetTop
		//Intial draw before movement in Mouse
		context.beginPath();
		context.arc(x, y, lineWidth/2+1, 0, 2 * Math.PI, false);
		context.fillStyle = color;
		context.fill();
		
		hittedBoxNumber(x,y)
	}
	function draw(e){
		moved = true;
		
		hittedBoxNumber(x1,y1)

        context.beginPath();
        context.moveTo(pre_x, pre_y);		
		context.lineTo(x1, y1);
		context.lineCap = "round";
		//context.lineJoin = "round";
		context.lineWidth = lineWidth;
		context.strokeStyle = color;
		context.closePath();
		context.stroke();
		
		//if mouse has a movement, then 'move' value should be 'true'
		pathObj.move = true;
		pathObj.positions.push({_x:x1,_y:y1})
		pathPositions[totalPaths-1] = pathObj;
		
		
	}
	function hittedBoxNumber(x,y)
	{
		
		var boxNum =  Math.floor(x/boxSize) + Math.floor(y/boxSize)*columns + 1
		if(boxNum<= rows*columns && boxNum>0)
		capturedBoxNums.push(boxNum)
		
		//remove duplicate elements 
		var finalData = removeDuplicates(capturedBoxNums)
		capturedBoxNums = finalData;
	
		//alert(capturedBoxNums)
		
		updateValues()
		
	}
	
	function updateValues()
	{
		var data = capturedBoxNums.length > 0 ? capturedBoxNums : ""
		data=data.toString()
		if(!developerMode)
		{
			document.getElementById(propertiesObj.dataTextArea).value = data
		}
		document.getElementsByName(propertiesObj.jsQid)[0].value = data.slice(0,4000)
		
		document.getElementsByName(propertiesObj.jsQid1)[0].value = data.slice(4000,8000)
		
		document.getElementsByName(propertiesObj.jsQid2)[0].value = data.slice(8000,12000)
		
		document.getElementsByName(propertiesObj.jsQid3)[0].value = data.slice(12000,16000)
		
		document.getElementsByName(propertiesObj.jsQid4)[0].value = data.slice(16000,20000)

document.getElementsByName(propertiesObj.jsQid5)[0].value = data.slice(20000,24000)
document.getElementsByName(propertiesObj.jsQid6)[0].value = data.slice(24000,28000)
document.getElementsByName(propertiesObj.jsQid7)[0].value = data.slice(28000,32000)
document.getElementsByName(propertiesObj.jsQid8)[0].value = data.slice(32000,36000)
document.getElementsByName(propertiesObj.jsQid9)[0].value = data.slice(36000,40000)

	}
	
	
	
	
	/*function click_canvasObj(e)
	{
		//create the dot/cirle when click on the image
		
		var coordinates = getXY(e);		
		context.beginPath();
		context.arc(coordinates[0]-canvasObj.offsetLeft, coordinates[1]-canvasObj.offsetTop, lineWidth/2, 0, 2 * Math.PI, false);
		context.fillStyle = color;
		context.fill();
	}*/
	function getXY(e)
	{
		var x,y;
		
		if(typeof e == "undefined")
		{
			x = event.clientX
			y = event.clientY
		}
		else
		{
			x = e.pageX
			y = e.pageY
		}
		return [x,y];
	}
	function touchHandler(event)
	{
		//document.getElementById("data").value = "ENETERED Function"
	    var touches = event.changedTouches;
	    first = touches[0];
	    
	    if(event.touches.length <= 1)
	    {
	    	
		    type = "";
		   
		    switch(event.type)
		    {
		        case "touchstart": type ="mousedown"; moved=false; break;
		        case "touchmove":  type="mousemove"; moved=true;break;        
		        case "touchend":   type="mouseup"; break;
		      //  case "touchcancel": type="mouseup"; break;
		        case "touchleave": type="mouseleave"; break;
		        default: return;
		    }
		    
		    if(!moved && type == "mouseup")
		    {
		    	type = "click"
		    }
			//document.getElementById("data").value = type != "" ? type : "NOEVENT";
		   
		    
		    var simulatedEvent = document.createEvent("MouseEvent");
		    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
		                              first.screenX, first.screenY, 
		                              first.clientX, first.clientY, false, 
		                              false, false, false, 0/*left*/, null);
		
		    first.target.dispatchEvent(simulatedEvent);
		 	event.preventDefault();
		   
	    //return false;
	    }
	    else
	    {
	    	moved = true;
	    }
	  //  alert(touches.length+"---Total Touches")
	}
	
	function configureTouchListeners() 
	{
	    canvasObj.ontouchstart = touchHandler
	    canvasObj.ontouchmove = touchHandler
	    canvasObj.ontouchend = touchHandler
	    canvasObj.ontouchcancel = touchHandler  
	    canvasObj.ontouchleave = touchHandler  
	     canvasObj.ontouchenter = touchHandler  
	 	//document.ontouchcancel = touchHandler 
	  //  document.ontouchstart = touchHandler
	}
	function configureListeners (){
			
		$(canvasObj).bind("mouseleave",mouseLeave_document)
	    $(canvasObj).bind("mouseover ",mouseOver_canvasObj)
		$(canvasObj).bind("mousedown",mousedown_canvasObj)
		$(canvasObj).bind("mousemove",mouseMove_canvasObj)
		$(canvasObj).bind("mouseup",mouseUp_document)
		$(canvasObj).bind("click",click_canvasObj)
		//$(canvasObj).bind("mouseenter ",mouseEnter_canvasObj)
		$(document).bind("mouseup",mouseUp_document)
		
		document.onselectstart = function(){ return false; }
		//$('canvas').bind("mouseleave", mouseUp_document(e))
		
	}
	return {
        init : init
                     
    }
    
      
    //utility functions
    
    //removing duplicate items from an array
    function removeDuplicates(originalArray)
	{
	    var lookup = []
	    var uniqueArr = []
	    var num
	    for(var idx=0;idx < originalArray.length;idx++)
	    {
            num=originalArray[idx];
            if(!lookup[num])
            {
                uniqueArr.push(num);
                lookup[num]=true;
            }
	    }
	    return (uniqueArr);
	}
	function hexToRgb(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	}
	function hexToRgba(hex,alpha)
	{
		var rgbObj =  hexToRgb(hex);
		return "rgba("+rgbObj.r+","+rgbObj.g+","+rgbObj.b+","+alpha+")";
	}
}