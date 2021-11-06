        var options = { 
			controls: true, 
			width: 980, 
			height: 560,
			controlBar: {
				playToggle: {
      				replay: false
    			},
				fullscreenToggle: false
				},
			disablePictureInPicture:true,
			progressControl:false,
			autoplay:true
			};

		videojs('myvideo', options, function onPlayerReady() {
            var player=this;
			//this.play();
			// How about an event listener?
			//this.on('ended', function () {
			//	videojs.log('Awww...over so soon?!');
			//});

			//this.on("playing", function(){
			//	console.log("˓Ƶ²¥·Ɩ΢)
			//});
			player.preroll({
                src:"https://cdn.jsdelivr.net/gh/phoenixhuang/kantar/das.m3u8",
                type:"application/x-mpegURL"
              });
			
			
		});
		
		
        //player.ads(); // initialize videojs-contrib-ads
       
        // request ads whenever there's new video content
        //player.on('contentchanged', function() {
          // in a real plugin, you might fetch your ad inventory here
        //  player.trigger('adsready');
        //});

        //player.on('readyforpreroll', function() {
        //  player.ads.startLinearAdMode();
          // play your linear ad content
          // in this example, we use a static mp4
        //  player.src('kitteh.mp4');

          // send event when ad is playing to remove loading spinner
        //  player.one('adplaying', function() {
        //    player.trigger('ads-ad-started');
        //  });

          // resume content when all your linear ads have finished
        //  player.one('adended', function() {
        //    player.ads.endLinearAdMode();
        //  });
        //});

        //player.trigger('adsready');
