
var JWPlayer = function () {
    this.properties;
	this.playlist=[];
    this.width;
    this.height ;
    this.minWidth ;
    this.minHeight ;
    this.consideringSize = .7;
    this.ratio;
    this.output = '';
    this.container = $("#videocontainer");
    this.playerpopup;
    this.playerdiv;
    this.currentPLIndex = 0;
	
	
}

JWPlayer.prototype = {
	init: function(props) {
        this.intialize();
        this.properties = props;
      if (this.properties.hidenext) 
	   pageLayout.next.hide();
		
		//if there are no controls, then video to play automatically 
        if (!this.properties.controls) {
            this.properties.autoplay = true
        }

        //if playButton is true, then controls should be false
        if (this.properties.playButton) {
            this.properties.controls = false;
            //added for IE9
            this.properties.autoplay = false;
        }

        // Create player elements
        this.playerpopup = $("<div class='player-skin' align='justify'/>");
        this.playerdiv = $("<div id='" + this.properties.playername + "' class='videoplayer' readonly='true'/>");

        
		this.playerpopup.append(this.playerdiv);
        this.container.append(this.playerpopup);
        this.center(this.properties.width,this.playerpopup);
        this.setProperties();

        this.startvideo();
    },
	
	center : function (playerwidth,element) {
    element.css("position","absolute");
    if (this.properties.playerposition.toLowerCase()=="center") {
		element.css("left",  (($("#survey").width()-(playerwidth+30))/2)+"px");		
    }
   },

    intialize:function() {
        videoPlaySeq = [];
        videoPlaySeqsArr = [];
        duration = [];
        this.output = '';
    },

     setProperties:function() {
		totalVideos = this.properties.source.split(",")

        for (ii = 0; ii < totalVideos.length; ii++) {
            var source = {
                "sources": []
            };
            var url = totalVideos[ii];
            url = url.substring(url.toLowerCase().indexOf("multimedia"));
            var initialtype = url.replace(/^.*\.([0-9a-z]+)$/i, "$1");
            source["sources"].push({
                "file": "http://wpc.16f8b.edgecastcdn.net/8316F8B/origin.tns-global.com/" + url + ".m3u8"
            });

            source["sources"].push({
                "file": "rtmp://wpc.16f8b.edgecastcdn.net/8216F8B/origin.tns-global.com/" + url + ".f4m"
            });

            this.playlist.push(source);
        }

        this.width = this.properties.width;
        this.height = this.properties.height;

        /*playerpopup.css({
            "width": width,
            "height": height
        });
        container.css({
            "height": height
        });*/
		this.updateDimensions();
        var that=this;
        $(window).resize(function() {
            that.updateDimensions();
        });
    },

    updateDimensions: function() {
        /*var nativeWidth = properties.maxwidth;
            var nativeHeight = properties.maxheight;
            var ratios = properties.aspectratio.indexOf(":") > 0 ? properties.aspectratio.split(":") : [16, 9];
            var windowWidth = $(window).width();
            var windowHeight = $(window).height();
			//alert(windowWidth+"-->"+windowHeight);
			//alert(window.innerWidth +"-->"+window.innerHeight)
            var aspect = ratios[1] / ratios[0];
            if ($.isEmptyObject(jwplayer(properties.playername).getMeta()) === false) {
                nativeWidth = jwplayer(properties.playername).getMeta().width;
                nativeHeight = jwplayer(properties.playername).getMeta().height;
                aspect = nativeHeight / nativeWidth;
            }
            if (nativeHeight > windowHeight) {
                nativeHeight = windowHeight;
                nativeWidth = nativeHeight / aspect;
            }
            
            nativeWidth = nativeHeight / aspect;
            playerpopup.css({
                "max-width":Math.min(properties.maxwidth, properties.maxheight / aspect),
                "max-height":Math.min(properties.maxheight, properties.maxwidth * aspect),
                "width":nativeWidth,
                "height":nativeHeight,
                "min-width":properties.minwidth,
                "min-height":properties.minheight,
                "margin-top":properties.playerposition === "center" ? 0 : properties.playermargintop,
            });
			
			container.css({
			    "height": parseInt(nativeHeight+30) 
			});*/

        var winWidth = window.innerWidth || document.documentElement.clientWidth;
        var winHeight = window.innerHeight || document.documentElement.clientHeight;

        this.height =Math.floor(winHeight * this.consideringSize);
        this.width = Math.floor(winWidth * this.consideringSize);
        
        var ratios = this.properties.aspectratio.indexOf(":") > 0 ? this.properties.aspectratio.split(":") : [16, 9];
        this.ratio = ratios[0] / ratios[1];
        if (this.ratio >= 1) {
            this.height = Math.floor(this.width / this.ratio);
        } else {
            this.width = Math.floor(this.height / this.ratio);
        }

        //cannot be less than minimum values
        if (this.width < this.minWidth) {
            this.width = this.minWidth;
            this.height = Math.floor(this.width / this.ratio);
        }

        if (this.height < this.minHeight) {
            this.height = this.minHeight;
            this.width = Math.floor(this.ratio * this.height);
        }

        this.playerpopup.css({
            "max-width": Math.min(this.properties.maxwidth, this.properties.width),
            "max-height": Math.min(this.properties.maxheight, this.properties.height),
            "width": this.width,
            "height": this.height,
            "min-width": this.properties.minwidth,
            "min-height": this.properties.minheight
                //"margin-top":properties.playerposition === "center" ? 0 : properties.playermargintop,
        });
		
		this.center(Math.min(this.width, this.properties.width),this.playerpopup);
        this.container.css({
            "height": Math.min(this.height, this.properties.height) +20
        });
    },

    onPlaylistItem: function(item) {

        this.currentPLIndex = item.index;

    },
	onFullscreen: function() {

       console.log(jwplayer().getFullscreen());

    },
	onPlaylistComplete: function(that) {

	    that.doSubmit();

    },

    onComplete:function(item) {
	/*alert(item.index)
        //if (typeof jwplayer(that.properties.playername).getPlaylistIndex === "function") {
            //if (typeof jwplayer(that.properties.playername).getPlaylist === "function") {
                if (this.currentPLIndex === item.getPlaylist().length - 1) {
                    that.doSubmit();
                }
            //}
        //}*/
    },

    doSubmit: function() {
        $("#_Q0").val("Done");
		if (this.properties.hidenext) 
	        pageLayout.next.show();
		
        if (this.properties.autosubmit)
            pageLayout.next.click();
    },

     startvideo:function() {
	    var that=this;
        jwplayer(this.properties.playername).setup({
            'playlist': this.playlist,
            'controls': this.properties.controls,
            'hls.enabled': this.properties.hlsenabled,
            'aspectratio': this.properties.aspectratio,
            'primary': this.properties.primary,
            'stretching': this.properties.stretching,
            'rtmp': {
                'subscribe': this.properties.rtmpsubscribe,
                'bufferlength': this.properties.rtmpbufferlength
            },
            'width': "100%",
            //'height': this.properties.height,
            'autostart': this.properties.autoplay,
            'fallback': this.properties.fallback,
            'skin': this.properties.skin,
            'backcolor': '666666',
            'frontcolor': 'FFFFFF',
            'lightcolor': 'FFFFFF',
            'screencolor': '0f0f0f',
            events: {
                //onReady: onReady,
                //onTime: onTime,
                //onPlay: onPlay,
                //onPause: onPause,
                //onDisplayClick: onDisplayClick,
                onPlaylistItem: this.onPlaylistItem,
                onComplete: this.onComplete(that),
				//onFullscreen:this.onFullscreen,
				//onPlaylistComplete:this.onPlaylistComplete(that)
                    //onError: onError,
                    //onSetupError: onSetupError
            }
        });
    }
}

/*$.fn.center = function (playerwidth,properties) {
    this.css("position","absolute");
    if (properties.playerposition.toLowerCase()=="center") {
		this.css("left",  (($("#survey").width()-(playerwidth+30))/2)+"px");		
    }
    return this;
}*/