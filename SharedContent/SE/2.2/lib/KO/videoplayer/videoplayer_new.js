function VideoPlayerApplication()
{
	function init(props)
	{
		
	}
	return 
	{
		init:init
	}
}
function VideoPlayer()
{
	var myPlayer;
	var properties;
	var currentplayertime=0;
	var skinDetails;
	
	var width = 300;
	var height = 150;
	
	var minWidth =  50;
	var minHeight = 50;
	
	var consideringSize = .7;
	
	var videoNumber = 0;
	var totalVideos;
	
	var videoPlaySeq;
	var videoPlaySeqsArr;
	var videoDuration;
	var ratio;
	var output='';
	var rateInterval;
	
	
	function init(props)	{
		//initiliaze properties
		 intialize();
		 properties = props
		 
		document.getElementById('_Q0').value='';
		
		//set video player priority
		_V_.options.techOrder = ["html5"];
		
		//if there are no controls, then video to play automatically 
		if(!properties.controls)
		{
			properties.autoplay = true
		}
		
		//if playButton is true, then controls should be false
		
		if(properties.playButton)
		{
			properties.controls = false;
			//added for IE9
			properties.autoplay = false;
		}
		
		createRequiredElements()
		setProperties()
		
		if(properties.WaterMark.isRequired)
		{
			addWaterMark()
		}
		
		//set background image initially
		if(properties.isSkinRequired)
		{
			$("#"+properties.videoParent).css("background",'url('+properties.skinImage+')')
		}
			
		
		updateVideoStyles();
		
		
		//Slider
		if(properties.slider)
		{
			updateSlider();
		}
		
		 //aspect ratio of video
		ratio = width/height
		
		updateDimensions();
		//event listeners
		myPlayer.addEvent("play",onPlay)
		myPlayer.addEvent("pause",onPause)
		myPlayer.addEvent("ended",videoEnded)	
		myPlayer.addEvent("error", function(e){console.log("error has occured")});
		myPlayer.addEvent("loadeddata",loadedToPlay)
		//$('.vjs-big-play-button').css({"display":"none"});
		myPlayer.addEvent("timeupdate",onTimeUpdate);
		myPlayer.addEvent("fullscreenchange",onFullScreenChange);
		
		
		if(properties.playButton)
		{
			document.getElementById(properties.videoParent).style.visibility = "hidden"
			myPlayer.pause();
			
		}
		if(properties.slider.visible)
		{
			document.getElementById("playText").innerHTML = "";
			document.getElementById("playBtn").style.width = "25px";
		}
		else
		{
			document.getElementById("slider").style.display = "none";
		}
		var playBtn = document.getElementById("playBtn");
		$(playBtn).bind("click",playVideo)
		
		if(!properties.output.visible)
		{ 
			
			document.getElementById(properties.output.id).style.visibility = "hidden"
		}
		
		if(!properties.navbtn)
		{
			document.getElementById(properties.navid).style.visibility = "hidden"
		}
	   document.getElementById(properties.output.id).style.height='5px' 
	}
	function playVideo()
	{
		myPlayer.play();
		document.getElementById("playBtn").style.visibility = "hidden";
		document.getElementById(properties.videoParent).style.visibility = "visible"
	}
	function updateSlider()
	{
		 $( "#slider-ui" ).slider({
            range: "min",
            min: properties.slider.min,
            max: properties.slider.max,
            value:properties.slider.value,
            step:properties.slider.step,
            slide: function( event, ui ) {}
        });
        if(properties.slider.start)
        {
        	$('#min').html(properties.slider.start)
        }
        
        if(properties.slider.end)
        {
        	$('#max').html(properties.slider.end)
        }
        
        if(properties.slider.middle)
        {
        	$('#mid').html(properties.slider.middle)
        }
	}
	function onFullScreenChange(e)
	{
		//update video margin left and top, based on fullscreen mode when skin is added to the video
		if(properties.isSkinRequired)
		{
			//var vp = document.getElementById(properties.videoID)
			
			if(this.isFullScreen)
			{
				$("#"+properties.videoID).css("top","0px");
			//	vp.style.left= "0px"
				$("#"+properties.videoID).css("left","0px");
			}
			else
			{
				$("#"+properties.videoID).css("top",skinDetails["top"]+"px");
				$("#"+properties.videoID).css("left",skinDetails["left"]+"px");
				//vp.style.top= skinDetails["top"]+"px"
				//vp.style.left= skinDetails["left"]+"px"
			}
		}
	}
	function onTimeUpdate()
	{
		videoPlaySeq.push(Math.round(myPlayer.currentTime()))
		//console.log(Math.round(myPlayer.currentTime()))
		timeUpdate.videoPlaySeq = videoPlaySeq
		document.dispatchEvent(timeUpdate);
		
	}
	function createRequiredElements()
	{
		//create video element
		var video = document.createElement("video");
		video.setAttribute("id",properties.videoID);
		video.setAttribute("preload","auto");
		video.setAttribute("class","video-js vjs-default-skin");
		//video.setAttribute("webkit-playsinline","webkit-playsinline");
		document.getElementById(properties.videoParent).appendChild(video);
		
		//$("#"+properties.videoID).css("min-width",minWidth)
		//$("#"+properties.videoID).css("min-height",minHeight)
		
		//hide the context menu of video
		$('video').bind('contextmenu', function() 
    	{
	        return false;
    	}); 
    	
    	
	}
	function loadedToPlay()
	{
		
		//console.log("Ready To Play")
		
		document.dispatchEvent(readyToPlay);
		
		if(videoNumber == 0)
		{
			intialize();
		}
		duration[videoNumber] = myPlayer.duration();
		//document.getElementById(properties.loadingID).style.visibility = "hidden"
		

	}
	/*function sliderUpdates()
	{
		var delimeter='';
		if(output != "" && output.slice(output.length-1,output.length) != "#")
		{
			delimeter = ",";
		}
		if(properties.slider.visible)
		{
			output += delimeter+Math.round(myPlayer.currentTime())+"$"+$( "#slider-ui" ).slider("value");
		}
		else
		{
			output += delimeter+Math.round(myPlayer.currentTime())+"$"+0;
		}
		document.getElementById(properties.output.id).value = output;
		
	}*/
	
	function sliderUpdates()
	{
			 		
		if( currentplayertime+0.01 < myPlayer.currentTime() )
		{
		          currentplayertime=myPlayer.currentTime()
		           //alert(myPlayer.currentTime())
					var delimeter='';
					if(output != "" && output.slice(output.length-1,output.length) != "#")
					{
						delimeter = ",";
					}
					if(properties.slider.visible)
					{
						output += delimeter+Math.round(myPlayer.currentTime())+"$"+$( "#slider-ui" ).slider("value");
					}
					else
					{
						output += delimeter+Math.round(myPlayer.currentTime())+"$"+0;
					}
					document.getElementById(properties.output.id).value = output;
					document.getElementById('_Q0').value=output;
		}
		 
	}	
	
	function intialize()
	{
		videoPlaySeq = [];
		videoPlaySeqsArr = [];
		duration = [];
		output='';
	}
	function setProperties()
	{
		myPlayer =  _V_(properties.videoID,properties)
		
		totalVideos = properties.source.mp4.split(",").length
		
		myPlayer.src([
		  { type: "video/mp4", src: properties.source.mp4.split(",")[0] },
		  { type: "video/webm", src: properties.source.webm.split(",")[0]  }
		]);
		
		width = properties.width || width
		height = properties.height || height
		myPlayer.width(width)
		myPlayer.height(height)
		
		//document.getElementById(properties.videoID).style.visibility = "hidden"
		
	}
	
	function addWaterMark()
	{
		var waterMark = document.createElement("div");
		waterMark.setAttribute("id","waterMark");
		
		//Here we can create the css class in the style sheet
		waterMark.setAttribute("style","font-weight:bold;background-color:"+(properties.WaterMark.backgroundColor || "#FF00FF" )+";opacity:0.7;font-size:18px;position: absolute; bottom: 100px; right:30px;z-index: 20; color:"+(properties.WaterMark.color || "white")+";");
	
		waterMark.innerHTML = properties.WaterMark.text;
		document.getElementById(properties.videoID).appendChild(waterMark);
	}
	
	//event callback functions


	function onPause()
	{
		clearInterval(rateInterval)
		pauseEvent.videoNumber = videoNumber+1
		document.dispatchEvent(pauseEvent);
		
	}
	function onPlay()
	{
		
		rateInterval = setInterval(sliderUpdates,properties.slider.ratingInterval)
		playEvent.videoNumber = videoNumber+1
		document.dispatchEvent(playEvent);

		//identify when play has started initially at '0' secs
		if(myPlayer.currentTime() == 0)
		{
			//console.log("video has started")
			startEvent.videoNumber = videoNumber+1
			document.dispatchEvent(startEvent);
			
		}
		//$('vjs-loading-spinner').css({"display":"none"});
	}
	
	//identify when video has ended
	function videoEnded(){
		//console.log("video has ended")
		
		videoPlaySeqsArr.push(videoPlaySeq);
		videoPlaySeq = [];
		
		endEvent.videoNumber = videoNumber+1
		document.dispatchEvent(endEvent);
		
		//next video
		clearInterval(rateInterval);
		if((videoNumber+1) < totalVideos)
		{
			output += "#";
			myPlayer.src([
			  { type: "video/mp4", src: properties.source.mp4.split(",")[videoNumber+1] },
			  { type: "video/webm", src: properties.source.webm.split(",")[videoNumber+1]  }
			]);
			videoNumber++;
			myPlayer.play();
		}
		else
		{
			
		 
			document.getElementById(properties.navid).style.visibility = "visible"
		    
			videoNumber = 0;
			document.dispatchEvent(allDone);
		}
	currentplayertime=0;	
	}
	
	function addSkin()
	{
		setSkinDimensions();
		
		//Video Parent
		var vpID = document.getElementById(properties.videoID)
		
		var vpStyle = vpID.getAttribute("style");

		
		$("#"+properties.videoID).css("position","absolute")
		$("#"+properties.videoID).css("top",skinDetails['top']+'px')
		$("#"+properties.videoID).css("left",skinDetails['left']+'px')
		//$("#"+properties.videoParent).css("width",(skinDetails["left"]+skinDetails["right"]+)+"px");
		//$("#"+properties.videoParent).css("height",(skinDetails["top"]+skinDetails["bottom"]+skinDetails["height"])+"px");
	
		
		$("#"+properties.videoParent).css("background-size",(skinDetails["left"]+skinDetails["right"]+skinDetails["width"])+"px "+(skinDetails["top"]+skinDetails["bottom"]+skinDetails["height"])+"px")
		$("#"+properties.videoParent).css("position","relative")
		$("#"+properties.videoParent).css("width",(skinDetails["left"]+skinDetails["right"]+skinDetails["width"])+"px");
		$("#"+properties.videoParent).css("height",(skinDetails["top"]+skinDetails["bottom"]+skinDetails["height"])+"px");
		$("#"+properties.videoParent).css("margin","auto")

		
	}
	function setSkinDimensions()
	{
		//alert($("#"+properties.videoID).css("width"));
		var changedWidthRatio = width/skinDetails.width; 
		var changedHeightRatio = height/skinDetails.height;
		
		for(var key in skinDetails)
		{
			if(key == "top" || key == "bottom" || key == "height")
			{
				skinDetails[key] = skinDetails[key]*changedHeightRatio
			}
			else
			{
				skinDetails[key] = skinDetails[key]*changedWidthRatio
			}
		}
	}
	
	function updateVideoStyles()
	{
		
			var styleElement = document.createElement("style");
			styleElement.type = "text/css";
			var cssText = ".vjs-default-skin .vjs-big-play-button{background :"+properties.playBtnBGColor+";}"
			if (styleElement.styleSheet) {
				styleElement.styleSheet.cssText = cssText
			} else {
				styleElement.appendChild(document.createTextNode(cssText));
			}
			document.body.appendChild(styleElement);
		
	}
	
	$(window).resize(function() {
 		
 		updateDimensions();
	});
	
	function updateDimensions()
	{
		
		var winWidth = window.innerWidth || document.documentElement.clientWidth;
		var winHeight = window.innerHeight || document.documentElement.clientHeight;
		
		if(properties.isSkinRequired)
		{
			skinDetails = properties.skinDetails;
			
			var skinHeight = Math.floor(winHeight*consideringSize);
			var skinWidth = Math.floor(winWidth*consideringSize);
			
			var changedWidthRatio = skinWidth/(skinDetails.width*1+skinDetails.left*1+skinDetails.right*1); 
			var changedHeightRatio = skinHeight/(skinDetails.height*1+skinDetails.top*1+skinDetails.bottom*1);
		
			for(var key in skinDetails)
			{
				if(key == "height")
				{
					height = skinDetails[key]*changedHeightRatio
				}
				if(key == "width")
				{
					width = skinDetails[key]*changedWidthRatio
				}
			}
			
			
		}
		
		else
		{
			height = Math.floor(winHeight*consideringSize);
			width = Math.floor(winWidth*consideringSize);
		}
		
		
		if(ratio >= 1)
		{
			height = Math.floor(width/ratio);
		}
		else
		{
			width = Math.floor(height/ratio);
		}
		
		//cannot be less than minimum values
		if(width<minWidth)
		{
			width = minWidth;
			height = Math.floor(width/ratio);
		}
		
		if(height<minHeight)
		{
			height = minHeight;
			width = Math.floor(ratio*height);
		}
		
		myPlayer.width(width)
		myPlayer.height(height)
		
		
		if(properties.isSkinRequired)
		{
			addSkin();
		}
	}
	
	// Video play sequence ( 1,2,3,55 ... meaning video played for 1,2,3 secs then user moves the playhead to 55th sec..etc )
	function getVideoPlaySeq(videoNumber)
	{
		try{
			//return videoPlaySeqsArr[vn];
			if(vn == undefined)
			{
				return videoPlaySeqsArr[0];
			}
			else
			{
				return videoPlaySeqsArr[videoNumber];
			}
		}
		catch(e)
		{
			console.log(e.message);
		}
	}
	
	//current Video Sequance
	function getCurrentVideoSeq()
	{
		
		return videoPlaySeq;
		
	}
	//Present video playhead position
	function currentTime()
	{
		return myPlayer.currentTime();
	}
	//Total Videos
	function getVideosCount()
	{
		return totalVideos;
	}
	//Video Duration
	function videoDuration(videoNumber)
	{
		try{
			
			if(vn == undefined)
			{
				return duration[0];
			}
			else
			{
				return duration[videoNumber];
			}
		}
		catch(e)
		{
			console.log(e.message);
		}
	}
	
	//pause the video
	function pause()
	{
		myPlayer.pause();
	}
	
	//play the video
	function play()
	{
		myPlayer.play();
	}
	
	//Custom event handlers
	function addEvent(eventName,callbackFn)
	{
		
		if(document.attachEvent)
		{
			document.attachEvent(eventName, function fn(e){callbackFn(e);})
		}
		else
		{
			document.addEventListener(eventName, function fn(e){callbackFn(e);})
		}
	}
	function removeEvent(eventName,callbackFn)
	{
		if(document.detachEvent)
		{
			document.detachEvent(eventName, function fn(e){callbackFn(e);})
		}
		else
		{
			document.removeEventListener(eventName, function fn(e){callbackFn(e);})
		}
	}
	
	var startEvent = document.createEvent('HTMLEvents');
	startEvent.videoNumber = "1"
	startEvent.initEvent('started', true, true);
		
	var endEvent = document.createEvent('HTMLEvents');
	endEvent.videoNumber = "1"
	endEvent.initEvent('ended', true, true);
	
	var timeUpdate = document.createEvent("HTMLEvents");
	timeUpdate.videoPlaySeq = videoPlaySeq
	timeUpdate.initEvent('onTimeUpdate', true, true);
	
	var readyToPlay = document.createEvent("HTMLEvents");
	readyToPlay.initEvent('readyToPlay', true, true);
	
	var allDone = document.createEvent("HTMLEvents");
	allDone.initEvent('allDone', true, true);
	
	var playEvent = document.createEvent("HTMLEvents");
	playEvent.videoNumber = "1"
	playEvent.initEvent('play', true, true);
	
	var pauseEvent = document.createEvent("HTMLEvents");
	pauseEvent.videoNumber = "1"
	pauseEvent.initEvent('pause', true, true);
	
	//private to public functions
	return 	{
		init:init,
		addEvent:addEvent,
		removeEvent:removeEvent,
		getVideoPlaySeq:getVideoPlaySeq,
		getCurrentVideoSeq:getCurrentVideoSeq,
		currentTime:currentTime,
		pause:pause,
		play:play,
		videoDuration:videoDuration,
		getVideosCount:getVideosCount
	}
}