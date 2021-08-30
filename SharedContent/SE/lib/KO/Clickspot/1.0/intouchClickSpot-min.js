var ratio;
var intouchClickSpot = function() {
    try {
        var e, t, n, r, i, s, o, u;
		var that=this;
        this.currClickCnt = 0;
        this.spotCollectionArr = new Array;
        this.nextNavBtn = $("[name=_NNext]");
		$("#_Q0").val("");
        if (globalCheck) {
            //$("#_Q0").hide(); /*updateLayout();*/
            if (typeof autoSubmitMilliSec != "undefined" && autoSubmitMilliSec != "") pageLayout.tempNext.hide();
            if (typeof minClicks != "undefined" && minClicks != "") pageLayout.tempNext.hide();
        }
		this.loadTheClickSpotImage()	
		window.addEventListener("orientationchange", function() {
		 console.log("Orientation changed");
		 window.setTimeout(function() {
                        $("#CSClearBtn").unbind("click", intouchClickSpotApp.clearTheCanvas);
						$("#CSUndoBtn").unbind("click", intouchClickSpotApp.canvasUndo);
						$(intouchClickSpotApp.appCanvas).unbind("click", intouchClickSpotApp.spotTheClick);
						$("#_Q0").val("");
						 //intouchClickSpotApp.captureCSData();
						 //var preloaddata=$("#_Q0").val();
						 intouchClickSpotApp.clearTheCanvas();
						 intouchClickSpotApp.loadTheClickSpotImage();
                    }, 200);
		
		 
		});
    } catch (a) {
        alert("Error At [intouchClickSpot.js] [intouchClickSpot] :: " + a)
    }
};
intouchClickSpot.prototype.appendToTheBody = function() {
    try {
        $("#question").append("<center><div id='csPreloader'>Image loading...<div><img src='" + clickSpotPreloadImageSrc + "' id='preloader_image' ></div></div></center><center><div style='display:none' id='appHolder'><canvas id='CSCanvas' ></canvas></div><div><span><input id='CSClearBtn' type='button' value='Reset All'/><input id='CSUndoBtn' type='button' value='Undo Last'/></span></div></center>")
    } catch (e) {
        alert("Error At [intouchClickSpot.js] [appendToTheBody] :: " + e)
    }
};
intouchClickSpot.prototype.loadTheClickSpotImage = function() {
    try {
        var e = $("<img />");
        e.load(function() {
            if (useImageDimensions) {
				var consideringSize=0.7;
				var oldWidth = this.width;
				var oldHeight = this.height;
				//var oldBoxSize = boxSize;
				//Calculate the width and height based on the screen resolution considering aspect ratio
				ratio = this.width/this.height
				var width = window.innerWidth || document.documentElement.clientWidth;
				var height = window.innerHeight || document.documentElement.clientHeight;
				if(width> height)
				{
					this.height = Math.floor(height*consideringSize);
					this.width = Math.floor(ratio*this.height);						
				}
				else
				{
					this.width = Math.floor(width*consideringSize);
					this.height = Math.floor(this.width/ratio);
				}
				width_ratio = oldWidth / this.width;
				height_ratio = oldHeight / this.height;
				
				clickSpotAppWidth = this.width;
                clickSpotAppHeight = this.height
            }
            intouchClickSpotApp.createTheClickSpotCanvas();
            if (intouchClickSpotApp.clickSpotCanvasContext) {
                intouchClickSpotApp.imageObj = this;
                intouchClickSpotApp.clickSpotCanvasContext.drawImage(this, 0, 0, clickSpotAppWidth, clickSpotAppHeight)
            }
            //$("#csPreloader").hide();
			pageLayout.hideLoader()
            $("#appHolder").show();
            if (showReset == false) {
                $("#CSClearBtn").hide()
            }
            if (showUndo == false) {
                $("#CSUndoBtn").hide()
            }
            if (resetLabel != "") {
                $("#CSClearBtn").val(resetLabel)
            }
            if (undoLabel != "") {
                $("#CSUndoBtn").val(undoLabel)
            }
            $("#CSClearBtn").css({
                background: buttonBGColor,
                color: buttonTextColor
                //border: "solid 2px #FFF",
                //paddingLeft: "10px",
                //paddingRight: "10px",
                //paddingTop: "5px",
                //paddingBottom: "5px",
                //borderRadius: "5px"
            });
            $("#CSUndoBtn").css({
                background: buttonBGColor1,
                color: buttonTextColor
                //border: "solid 2px #FFF",
                //paddingLeft: "10px",
                //paddingRight: "10px",
                //paddingTop: "5px",
                //paddingBottom: "5px",
                //borderRadius: "5px"
            });
			
            if (globalCheck) { /*updateLayout();*/ /*setupHeader();*/
                if (typeof autoSubmitMilliSec != "undefined" && autoSubmitMilliSec != "") setTimeout(intouchClickSpotApp.csAutoSubmit, autoSubmitMilliSec);
                if ($("#_Q0").val() != "" && $("#_Q0").val() != "No Data Captured") {
					intouchClickSpotApp.loadPreData($("#_Q0").val())
                }
            }
        });
        e.attr("src", clickSpotImageSrc)
    } catch (t) {
        alert("Error At [intouchClickSpot.js] [loadTheClickSpotImage] :: " + t)
    }
};
intouchClickSpot.prototype.loadPreData = function(e) {
    try {
        var t = e.split(",");
        for (var n = 0; n < t.length; n++) {
            intouchClickSpotApp.currClickCnt++;
            if (intouchClickSpotApp.currClickCnt == parseInt(minClicks)) {
                pageLayout.tempNext.show();
            }
            var r = t[n].split("~");
            var i = new Object;
            i.csXPos = Number(r[1]);
            i.csYPos = Number(r[2]);
            i.csSpotRadius = spotRadius;
            i.csFillColor = spotFillColor;
            i.csStrokeWidth = spotStrokeWidth;
            i.csStrokeColor = spotStrokeColor;
            i.spotNum = String(r[0]);
            i.elapsedTime = String(r[3]);
            intouchClickSpotApp.spotCollectionArr.push(i);
            intouchClickSpotApp.createTheSpot(i)
        }
    } catch (s) {
        alert("Error At [intouchClickSpot.js] [csAutoSubmit] :: " + s)
    }
};
intouchClickSpot.prototype.csAutoSubmit = function() {
    try {
        intouchClickSpotApp.captureCSData();
        $(intouchClickSpotApp.appCanvas).unbind("click", intouchClickSpotApp.spotTheClick);
        document.forms[0].submit()
    } catch (e) {
        alert("Error At [intouchClickSpot.js] [csAutoSubmit] :: " + e)
    }
};
intouchClickSpot.prototype.createTheClickSpotCanvas = function() {
	try {
		this.appCanvas = document.getElementById("CSCanvas");
        this.appCanvas.onmouseover = function() {
            this.style.cursor = "crosshair"
        };
        if (typeof G_vmlCanvasManager != "undefined") {
            this.appCanvas = G_vmlCanvasManager.initElement(this.appCanvas);

        }
		this.clickSpotCanvasContext = this.appCanvas.getContext("2d");
		
        this.appCanvas.width = clickSpotAppWidth;
        this.appCanvas.height = clickSpotAppHeight;
        if (this.appCanvas.getContext) {
            var e = this.appCanvas.getContext("2d");
            $(this.appCanvas).bind("click", this.spotTheClick);
            $("#CSClearBtn").bind("click", this.clearTheCanvas);
            $("#CSClearBtn").attr("disabled", "disabled");
            $("#CSUndoBtn").bind("click", this.canvasUndo);
            $("#CSUndoBtn").attr("disabled", "disabled")
        }
        intouchClickSpotApp.startTimeInMS = (new Date).getTime()
    } catch (t) {
       alert("Error At [intouchClickSpot.js] [createTheClickSpotCanvas] :: " + t)
   }
    return e
};
intouchClickSpot.prototype.spotTheClick = function(e) {
    try {
        if (intouchClickSpotApp.currClickCnt < maxClicks) {
            if (typeof G_vmlCanvasManager != "undefined") {
                G_vmlCanvasManager.initElement(intouchClickSpotApp.appCanvas)
            }
            var t = intouchClickSpotApp.appCanvas.getBoundingClientRect();
            var n = t.left;
            var r = t.top;
            var i = document.documentElement.scrollLeft || document.body.scrollLeft;
            var s = document.documentElement.scrollTop || document.body.scrollTop;
            if (typeof e == "undefined") {
                var o = event.clientX - n - i;
                var u = event.clientY - r - s
            } else {
                var o = e.pageX - n - i;
                var u = e.pageY - r - s
            }
            intouchClickSpotApp.currClickCnt++;
            if (intouchClickSpotApp.currClickCnt == parseInt(minClicks)) {
                pageLayout.tempNext.show();
            }
            intouchClickSpotApp.elapsedTimeInMS =(new Date).getTime() - intouchClickSpotApp.startTimeInMS;
            var a = new Object;
            a.csXPos = o;
            a.csYPos = u;
            a.csSpotRadius = spotRadius;
            a.csFillColor = spotFillColor;
            a.csStrokeWidth = spotStrokeWidth;
            a.csStrokeColor = spotStrokeColor;
            a.spotNum = String(intouchClickSpotApp.currClickCnt);
            a.elapsedTime = String(intouchClickSpotApp.elapsedTimeInMS);
            intouchClickSpotApp.spotCollectionArr.push(a);
            intouchClickSpotApp.createTheSpot(a);
            intouchClickSpotApp.captureCSData()
        }
    } catch (f) {
        alert("Error At [intouchClickSpot.js] [spotTheClick] :: " + f)
    }
};
intouchClickSpot.prototype.createTheSpot = function(e) {
    try {
        this.clickSpotCanvasContext.fillStyle = e.csFillColor;
        this.clickSpotCanvasContext.beginPath();
        this.clickSpotCanvasContext.arc(e.csXPos, e.csYPos, e.csSpotRadius, 0, 2 * Math.PI);
        this.clickSpotCanvasContext.lineWidth = e.csStrokeWidth;
        this.clickSpotCanvasContext.strokeStyle = e.csStrokeColor;
        this.clickSpotCanvasContext.stroke();
        this.clickSpotCanvasContext.closePath();
        this.clickSpotCanvasContext.fill();
        this.clickSpotCanvasContext.font = spotTextFont;
        this.clickSpotCanvasContext.fillStyle = "white";
        this.clickSpotCanvasContext.textAlign = "center";
        this.clickSpotCanvasContext.fillText(e.spotNum, e.csXPos, e.csYPos + e.csSpotRadius / 4);
        $("#CSClearBtn").removeAttr("disabled");
        $("#CSUndoBtn").removeAttr("disabled")
    } catch (t) {
        alert("Error At [intouchClickSpot.js] [createTheSpot] :: " + t)
    }
};
intouchClickSpot.prototype.clearTheCanvas = function() {
    try {
        intouchClickSpotApp.clickSpotCanvasContext.clearRect(0, 0, intouchClickSpotApp.appCanvas.width, intouchClickSpotApp.appCanvas.height);
        intouchClickSpotApp.clickSpotCanvasContext.drawImage(intouchClickSpotApp.imageObj, 0, 0, clickSpotAppWidth, clickSpotAppHeight);
        intouchClickSpotApp.spotCollectionArr.splice(0, intouchClickSpotApp.spotCollectionArr.length);
        $("#CSClearBtn").attr("disabled", "disabled");
        $("#CSUndoBtn").attr("disabled", "disabled");
        intouchClickSpotApp.currClickCnt = 0;
        intouchClickSpotApp.captureCSData();
        if (typeof minClicks != "undefined" && minClicks != "") pageLayout.tempNext.hide();
    } catch (e) {
        alert("Error At [intouchClickSpot.js] [clearTheCanvas] :: " + e)
    }
};
intouchClickSpot.prototype.canvasUndo = function() {
    try {
        intouchClickSpotApp.spotCollectionArr.pop();
        intouchClickSpotApp.currClickCnt--;
        if (intouchClickSpotApp.currClickCnt < parseInt(minClicks)) pageLayout.tempNext.hide();
        intouchClickSpotApp.clickSpotCanvasContext.clearRect(0, 0, intouchClickSpotApp.appCanvas.width, intouchClickSpotApp.appCanvas.height);
        intouchClickSpotApp.clickSpotCanvasContext.drawImage(intouchClickSpotApp.imageObj, 0, 0, clickSpotAppWidth, clickSpotAppHeight);
        if (intouchClickSpotApp.spotCollectionArr.length != 0) {
            for (var e = 0; e < intouchClickSpotApp.spotCollectionArr.length; e++) {
                intouchClickSpotApp.createTheSpot(intouchClickSpotApp.spotCollectionArr[e])
            }
        } else {
            $("#CSClearBtn").attr("disabled", "disabled");
            $("#CSUndoBtn").attr("disabled", "disabled")
        }
        intouchClickSpotApp.captureCSData()
    } catch (t) {
        alert("Error At [intouchClickSpot.js] [canvasUndo] :: " + t)
    }
};
intouchClickSpot.prototype.captureCSData = function() {
    try {
        var e = "";
        if (intouchClickSpotApp.spotCollectionArr.length > 0) {
            for (var t = 0; t < intouchClickSpotApp.spotCollectionArr.length; t++) {
			    console.log(Math.round(intouchClickSpotApp.spotCollectionArr[t].csXPos*width_ratio)+"-->"+Math.round(intouchClickSpotApp.spotCollectionArr[t].csYPos*height_ratio) )
                e += intouchClickSpotApp.spotCollectionArr[t].spotNum + "~" + Math.round(intouchClickSpotApp.spotCollectionArr[t].csXPos*width_ratio) + "~" + Math.round(intouchClickSpotApp.spotCollectionArr[t].csYPos*height_ratio)  + "~" + intouchClickSpotApp.spotCollectionArr[t].elapsedTime + ","
            }
            e = e.substr(0, e.length - 1);
            $("#_Q0").val(e)
        } else {
            $("#_Q0").val("No Data Captured")
        }
    } catch (n) {
        alert("Error At [intouchClickSpot.js] [captureCSData] :: " + n)
    }
}