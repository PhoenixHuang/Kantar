
var FacerecorderMRAPI = (function () {
    var that;
    var js_source = null;
    var portal_path = null;
    var oval_frame_id = "facerecorder_oval_frame";

    var initialized = false;
    var recording = false;
    var upload_waiting = false;
    var webrtc_fallback = true;

    var session_token = null;
    var local_stream = null;
    var media_recorder = null;
    var recorded_chunks = [];

    // video stream attributes
    var stream_min_width = 320;
    var stream_min_height = 240;
    var stream_max_width = 640;
    var stream_max_height = 480;

    var api_key = null;
    var webrtc_host = null;
    var webrtc_secure = false;
    var show_oval_overlay = null;
    var facevideo_container_id = null;
    var facevideo_container = null;
    var oval_frame = null;
    var facevideo_node = null;

    var project_code = null;
    var movie_id = null;
    var participant_id = null;
    var opt_in_status = null;
    var completion_status = null;
    var exposure = 0;
    var session_type = "test";
    var auto_start_session = null;
    var auto_start_streaming = null;
    var auto_upload_session = null;

    // store these items as WebSessionInfo k/v pairs
    var session_metadata = null;

    var session_started_success_callback = null;
    var session_started_failure_callback = null;
    var streaming_started_success_callback = null;
    var streaming_started_failure_callback = null;
    var session_uploaded_success_callback = null;
    var session_uploaded_failure_callback = null;
    var session_uploaded_progress_callback = null;

    var get_option = function(name, options_hash, default_value) {
        if (options_hash[name] != null && (typeof options_hash[name] != 'undefined')) {
            return options_hash[name];
        }
        return default_value;
    };

    var require = function(file, success_callback, failure_callback) {
        var node = document.createElement("script");
        node.type = "text/javascript";
        node.src = file;

        node.onload = success_callback;
        node.onerror = function(err) {
            console.log("Error loading js file: " + file);
            failure_callback("Error loading js file: " + file);
        };

        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(node, s);
    };

    var recording_config = function(success_callback, failure_callback) {
        var req = new XMLHttpRequest();
        var url = portal_path + "pub/api/v1/websession/recording_config/" + encodeURIComponent(project_code);
        var form_data = new FormData();
        form_data.append("key", api_key);
        req.addEventListener("load", function() {
            if (req.status == 200) {
                var json = JSON.parse(req.responseText);
                webrtc_host = json["webrtcHost"];
                webrtc_secure = json["webrtcSecure"];
                session_type = json["sessionType"];
                success_callback();
            }
            else {
                if (req.status == 404) {
                    failure_callback("Could not find project with project_code " + project_code);
                }
                else {
                    failure_callback("An error occurred calling recording config API. HTTP Status: " + req.status);
                }
            }
        });
        req.open('GET', url);
        req.send(form_data);
    };

    var camera_denied = function(callback) {
        var req = new XMLHttpRequest();
        var url = portal_path + "pub/api/v1/websession/start/" + encodeURIComponent(project_code);
        var form_data = new FormData();
        form_data.append("key", api_key);
        form_data.append("k.fileExtension", (media_recorder ? "webm" : "mkv"));
        form_data.append("k.participantId", participant_id);
        form_data.append("k.cameraStatus", "DENIED");
        form_data.append("k.webcam", "FOUND");
        form_data.append("k.movieid", movie_id);
        form_data.append("k.exposure", exposure);
        form_data.append("k.sessionType", session_type);
        form_data.append("k.facerecorderVersion", (media_recorder ? "mrapi" : "webrtc"));

        if (session_metadata) {
            for (k in session_metadata) {
                form_data.append("k." + k, session_metadata[k]);
            }
        }

        req.addEventListener("load", callback);
        req.open('POST', url);
        req.send(form_data);
    };

    var store_participant_info = function(callback) {
        var req = new XMLHttpRequest();
        var url = portal_path + "pub/api/v1/websession/store/" + encodeURIComponent(project_code) + "/participant/" + encodeURIComponent(participant_id);
        var form_data = new FormData();
        form_data.append("key", api_key);
        form_data.append("k.completionStatus", completion_status);
        form_data.append("k.optinStatus", opt_in_status);
        form_data.append("pid", participant_id);
        req.addEventListener("load", callback);
        req.open('POST', url);
        req.send(form_data);

    };

    //
    // Read user specified options and validate
    //
    var init_options = function(options, success_callback, failure_callback) {
        api_key = get_option('api_key', options, null);
        show_oval_overlay = get_option('show_oval_overlay', options, true);
        facevideo_container_id = get_option('facevideo_container_id', options, null);
        project_code = get_option('project_code', options, null);
        movie_id = get_option('movie_id', options, null);
        participant_id = get_option('participant_id', options, null);
        opt_in_status = get_option('opt_in_status', options, 'RecordAndDoNotShare');
        completion_status = get_option('completion_status', options, 'Not Complete');
        exposure = get_option('exposure', options, 1);
        auto_start_session = get_option('auto_start_session', options, true);
        auto_start_streaming = get_option('auto_start_streaming', options, true);
        auto_upload_session = get_option('auto_upload_session', options, true);
        session_started_success_callback = get_option('session_started_success_callback', options, null);
        session_started_failure_callback = get_option('session_started_failure_callback', options, null);
        streaming_started_success_callback = get_option('streaming_started_success_callback', options, null);
        streaming_started_failure_callback = get_option('streaming_started_failure_callback', options, null);
        session_uploaded_success_callback = get_option('session_uploaded_success_callback', options, null);
        session_uploaded_failure_callback = get_option('session_uploaded_failure_callback', options, null);
        session_uploaded_progress_callback = get_option('session_uploaded_progress_callback', options, null);
        session_metadata = get_option('metadata', options, null);

        // advanced options
        stream_min_width = get_option('stream_min_width', options, stream_min_width);
        stream_min_height = get_option('stream_min_height', options, stream_min_height);
        stream_max_width = get_option('stream_max_width', options, stream_max_width);
        stream_max_height = get_option('stream_max_height', options, stream_max_height);

        if (parseInt(exposure) == NaN) {
            failure_callback("Exposure must be an integer.");
            return;
        }
        exposure = parseInt(exposure);

        if (!facevideo_container_id) {
            failure_callback("Parameter facevideo_container_id is required.");
            return;
        }

        facevideo_container = document.getElementById(facevideo_container_id);
        if (!facevideo_container) {
            failure_callback("Could not find facevideo container node for id: " + facevideo_container_id);
            return;
        }

        if (!project_code) {
            failure_callback("Project Code is required.");
            return;
        }

        if (!movie_id) {
            failure_callback("Movie ID is required.");
            return;
        }

        if (!participant_id) {
            failure_callback("Participant ID is required.");
            return;
        }

        if (auto_start_session && (!session_started_success_callback || !session_started_failure_callback)) {
            failure_callback("Session started success and failure callback functions are required");
            return;
        }

        if (auto_start_streaming && (!streaming_started_success_callback || !streaming_started_failure_callback)) {
            failure_callback("Streaming started success and failure callback functions are required");
            return;
        }

        if (auto_upload_session && (!session_uploaded_success_callback || !session_uploaded_failure_callback)) {
            failure_callback("Session uploaded success and failure callback functions are required");
            return;
        }

        success_callback();
    }

    //
    // Create the facerecorder video node and oval overlay
    //
    var insert_face_recorder = function() {
        oval_frame = document.createElement("img");
        oval_frame.id = oval_frame_id;
        oval_frame.src = portal_path + "images/webrtc/cameraMask.png";
        oval_frame.style.position = "absolute";
        oval_frame.style.visibility = show_oval_overlay ? "visible" : "hidden";
        facevideo_container.appendChild(oval_frame);

        facevideo_node = document.createElement("video");
        facevideo_node.style.width = "320px";
        facevideo_node.style.height = "240px";
        facevideo_node.style.backgroundColor = "black";
        // setting autoplay to true to workaround a Chrome Android bug where the camera check doesn't work without wifi
        facevideo_node.autoplay = true;
        facevideo_container.appendChild(facevideo_node);
    }

    var facevideo_canplay = function() {
        console.log("CAN PLAY EVENT");
        facevideo_node.play();
    }

    var facevideo_playing = function(success_callback) {
        console.log("PLAYING EVENT");
        initialized = true;
        success_callback();

        if (auto_start_session) {
            that.start_session({}, session_started_success_callback, session_started_failure_callback);
        }
    }

    var init_media_recorder = function(options, success_callback, failure_callback) {

        var init_options_success = function() {
            insert_face_recorder();

            var recording_config_success = function() {

                // if the user specified session type, use that value
                // instead of the ones returned in the JSON
                session_type = get_option('session_type', options, session_type);

                var playing_callback = function() {
                    facevideo_node.removeEventListener("playing", playing_callback);
                    facevideo_playing(success_callback)
                };

                facevideo_node.addEventListener("canplay", facevideo_canplay);
                facevideo_node.addEventListener("playing", playing_callback);
                facevideo_node.src = window.URL.createObjectURL(local_stream);
            };

            recording_config(recording_config_success, failure_callback);
        };

        init_options(options, init_options_success, failure_callback);

    }

    var init_webrtc = function(options, success_callback, failure_callback) {
        // Callback after succesfully including erizo.js
        var js_callback = function() {

            // Callback after succesfully getting access to camera
            var get_media_success = function() {

                var recording_config_success = function() {

                    // if the user specified webrtc host/secure or session type, use those values
                    // instead of the ones returned in the JSON
                    webrtc_host = get_option('webrtc_host', options, webrtc_host);
                    webrtc_secure = get_option('webrtc_secure', options, webrtc_secure);
                    session_type = get_option('session_type', options, session_type);

                    var playing_callback = function() {
                        facevideo_node.removeEventListener("playing", playing_callback);
                        facevideo_playing(success_callback)
                    };

                    facevideo_node.addEventListener("canplay", facevideo_canplay);
                    facevideo_node.addEventListener("playing", playing_callback);
                    facevideo_node.src = window.URL.createObjectURL(local_stream.stream);
                };

                recording_config(recording_config_success, failure_callback);
            };

            var init_options_success = function() {
                insert_face_recorder();

                var videoSize = [stream_min_width, stream_min_height, stream_max_width, stream_max_height];
                local_stream = Erizo.Stream({audio: false, video: true, data: false, screen: null, videoSize: videoSize});
                local_stream.addEventListener("access-accepted", function () {
                    console.log("access-accepted callback");
                    get_media_success();
                });
                local_stream.addEventListener("access-denied", function() {
                    console.log("access-denied callback");
                    camera_denied(function() { failure_callback("Camera access denied."); });
                });

                local_stream.init();
            };

            init_options(options, init_options_success, failure_callback);
        };

        require(js_source + 'erizo.js', js_callback, failure_callback);
    }

    return {
        init : function(options, success_callback, failure_callback) {
            that = this;
            webrtc_fallback = get_option('webrtc_fallback', options, true);

            // get the host of this JS file so we can load other assets
            // and talk to the API
            var src_element = document.querySelector("script[src*='facerecorder-mrapi.js']");
            if (src_element) {
               // js_source = src_element.src.replace('facerecorder-mrapi.js', '');
				js_source = 'https://labs-portal.affectiva.com/portal/js/webrtc/';
                portal_path = js_source.replace('js/webrtc/', '');
            }
            else {
                failure_callback("Could not find script tag with src facerecorder-mrapi.js");
                return;
            }


            var js_callback = function() {

                var get_media_success = function(stream) {
                    // initialize the media recorder
                    // if it fails, fallback to webrtc if specified, else error
                    local_stream = stream;

                    try {
                        media_recorder = new MediaRecorder(stream);
                        var recorder_data_available = function(event) {
                            if (event && event.data) {
                                recorded_chunks.push(event.data);
                            }
                        };
                        media_recorder.addEventListener("dataavailable", recorder_data_available);
                        init_media_recorder(options, success_callback, failure_callback);
                    } catch (e) {
                        if (webrtc_fallback) {
                            init_webrtc(options, success_callback, failure_callback);
                        }
                        else {
                            failure_callback('Exception while creating MediaRecorder: ' + e);
                            return;
                        }
                    }

                }

                var media_constraints = {
                    "audio": false,
                    "video": {
                        "mandatory": {
                            "minWidth": stream_min_width,
                            "maxWidth": stream_max_width,
                            "minHeight": stream_min_height,
                            "maxHeight": stream_max_height
                        },
                        "optional": []
                    }
                };
                var get_media_fail = function(e) {
                    camera_denied(function() { failure_callback("Camera access denied."); });
                };

                AdapterJS.webRTCReady(function(isUsingPlugin) {
                    //isUsingPlugin: true if the WebRTC plugin is being used, false otherwise
                    getUserMedia(media_constraints, get_media_success, get_media_fail);
                });

            }

           // require(js_source + 'adapterjs/0.13.x/adapter.min.js', js_callback, failure_callback);
		   require('https://labs-portal.affectiva.com/portal/js/webrtc/adapterjs/0.13.x/adapter.min.js', js_callback, failure_callback);

        },

        start_session : function(options, success_callback, failure_callback) {
            if (!initialized) {
                failure_callback("Cannot start a session before successful init.");
                return;
            }

            if (recording) {
                failure_callback("Cannot start a new session while recording.");
                return;
            }

            if (upload_waiting) {
                failure_callback("Cannot start a new session when there is a session waiting to be uploaded");
                return;
            }

            // user can specify new opt-in and completion status here
            opt_in_status = get_option('opt_in_status', options, opt_in_status);
            completion_status = get_option('completion_status', options, completion_status);

            var movie_id_override = get_option('movie_id', options, null);
            var exposure_override = get_option('exposure', options, null);
            if (exposure_override && (parseInt(exposure_override) == NaN)) {
                failure_callback("Exposure must be an integer.");
                return;
            }

            var req = new XMLHttpRequest();
            var url = portal_path + "pub/api/v1/websession/start/" + get_option('project_code', options, project_code);
            var form_data = new FormData();
            form_data.append("key", api_key);
            form_data.append("k.fileExtension", (media_recorder ? "webm" : "mkv"));
            form_data.append("k.participantId", participant_id);
            form_data.append("k.cameraStatus", "GRANTED");
            form_data.append("k.webcam", "FOUND");
            form_data.append("k.sessionType", get_option('session_type', options, session_type));
            form_data.append("k.facerecorderVersion", (media_recorder ? "mrapi" : "webrtc"));

            if (session_metadata) {
                for (k in session_metadata) {
                    form_data.append("k." + k, session_metadata[k]);
                }
            }

            //
            // User can specify a new movie id or exposure as parameters to start session. If they
            // are present, use those and override the ones set in init()
            //
            if (movie_id_override && (movie_id_override != movie_id)) {
                exposure = (exposure_override) ? parseInt(exposure_override) : 1;
                movie_id = movie_id_override;
            }
            else {
                exposure = (exposure_override) ? parseInt(exposure_override) : exposure;
            }

            form_data.append("k.movieid", movie_id);
            form_data.append("k.exposure", exposure);

            req.addEventListener("load", function() {
                if (req.status == 200) {
                    var json = JSON.parse(req.responseText);
                    if (json.message == "ok") {
                        session_token = json.sessionToken;
                        success_callback(session_token);

                        if (auto_start_streaming) {
                            that.start_recording(streaming_started_success_callback, streaming_started_failure_callback);
                        }
                    }
                    else {
                        // Media Id parameter does not match
                        failure_callback(json.message);
                    }
                }
                else {
                    if (req.status == 404) {
                        failure_callback("Could not find project with project_code " + project_code);
                    }
                    else {
                        failure_callback("An error occurred calling start session API. HTTP Status: " + req.status);
                    }
                }
            });

            req.addEventListener("error", function() {
                console.log("ERROR STARTING SESSION");
                failure_callback("An error occurred calling start session API.");
            });

            req.open('POST', url);
            req.send(form_data);

        },

        start_recording : function(success_callback, failure_callback) {
            if (!initialized || !session_token) {
                failure_callback("Cannot start recording without a started session.");
                return;
            }

            if (recording) {
                failure_callback("Recording has already been started");
                return;
            }

            if (upload_waiting) {
                failure_callback("Cannot start a new session when there is a session waiting to be uploaded");
                return;
            }

            if (media_recorder) {
                media_recorder.start();
                success_callback();
            }
            else {
                room_token = JSON.stringify({
                    id: session_token,
                    host: webrtc_host,
                    secure: webrtc_secure
                });
                room = Erizo.Room({token: room_token});
                room.addEventListener("room-connected", function (roomEvent) {
                    console.log("room-connected callback");
                    room.publish(local_stream, {maxVideoBW: 3000});
                });
                room.addEventListener("room-disconnected", function(roomEvent) {
                    console.log("room disconnected");
                    if (recording) {
                      // this probably means the socket disconnect server side
                      recording = false;
                      session_token = null;
                      failure_callback('Fatal: room-disconnect while recording');
                    }
                });
                room.addEventListener("stream-added", function (streamEvent) {
                    room.startRecording(local_stream, function(id) {
                        recording = true;
                        recording_id = id;
                        success_callback();
                      });
                });
                room.addEventListener("stream-failed", function (streamEvent){
                    console.log("STREAM FAILED, DISCONNECTION");
                    room.disconnect();
                    failure_callback("Error creating recording stream.");
                });

                room.connect();
            }

            recording = true;

        },

        stop_recording : function(success_callback, failure_callback) {
            if (!recording) {
                failure_callback("Cannot stop recording - it was never started.");
                return;
            }

            var last_frame = (new Date()).getTime();

            var store_info_callback = function() {
                success_callback();
                if (auto_upload_session) {
                    that.upload_session(session_uploaded_success_callback, session_uploaded_failure_callback, session_uploaded_progress_callback);
                }
            }

            var store_last_frame = function(callback) {
                that.store_session_info({last_frame: last_frame}, callback);
            }

            if (media_recorder) {
                media_recorder.stop();
                upload_waiting = true;
                store_last_frame(function() { store_participant_info(store_info_callback) });
            }
            else {
                room.stopRecording(function(success, error) {
                    console.log("stop recording callback");
                    recording = false;

                    exposure++;
                    if (success) {
                        store_last_frame(function() {
                            store_participant_info( function() {
                                session_token = null;
                                store_info_callback();
                            });
                        });
                    } else {
                        session_token = null;
                        failure_callback("Stop recording failure callback was called:", error);
                    }
                    room.disconnect();
                    return;
                });
            }

            recording = false;

        },

        upload_session : function(success_callback, failure_callback, progress_callback) {
            if (!media_recorder) {
                success_callback();
            }
            else {
                if (!session_token) {
                    failure_callback("Cannot upload session without a started session.");
                    return;
                }

                var req = new XMLHttpRequest();
                if (progress_callback && req.upload) {
                    // attach progress event callback
                    req.upload.addEventListener("progress", function(evt) {
                        progress_callback(evt);
                    });
                }
                var url = portal_path + "pub/api/v1/websession/upload/" + encodeURIComponent(session_token)
                var form_data = new FormData();
                form_data.append("key", api_key);
                var video = new Blob(recorded_chunks, {type: "video/webm"});
                form_data.append("video", video);
                req.addEventListener("load", function() {
                    if (req.status == 200) {

                        // on success reset
                        upload_waiting = false;
                        session_token = null;
                        recorded_chunks = [];
                        exposure++;

                        success_callback();
                    } else if (req.status == 404) {
                        failure_callback("Could not find web session");
                    } else {
                        var json = JSON.parse(req.responseText);
                        console.log(json);
                        failure_callback("An error occurred calling recording config API. HTTP Status: " + req.status);
                    }
                });
                req.open('POST', url);
                req.send(form_data);
            }
        },

        store_first_frame : function(callback) {
            if (typeof callback != "function") {
                callback = function() { return };
            }

            var first_frame = (new Date()).getTime();
            this.store_session_info({first_frame: first_frame}, callback);
        },

        store_session_info : function(items, callback) {
            var req = new XMLHttpRequest();
            var url = portal_path + "pub/api/v1/websession/store/" + encodeURIComponent(session_token) + "?";

            for (var key in items) {
                url += "k." + encodeURIComponent(key) + "=" + encodeURIComponent(items[key]) + "&";
            }
            url += "key=" + (api_key ? encodeURIComponent(api_key) : "");

            req.addEventListener("load", callback);
            req.open("GET", url);
            req.send();
        },

        next_exposure : function(failure_callback) {
            if (!auto_start_session || !auto_start_streaming) {
                failure_callback("next_exposure() method can only be used in conjunction with auto start session and auto start streaming.");
                return;
            }

            this.stop_recording( function() {
                var start_new_session = function() {
                    that.start_session({}, session_started_success_callback, session_started_failure_callback);
                };
                setTimeout(start_new_session, 1000);
            }, failure_callback);
        },

        show_oval : function() {
            var oval = document.getElementById(oval_frame_id);
            if (oval) {
                oval.style.visibility = "visible";
            }
        },

        hide_oval : function() {
            var oval = document.getElementById(oval_frame_id);
            if (oval) {
                oval.style.visibility = "hidden";
            }
        },

        detach_camera : function() {
            var stream = (media_recorder) ? local_stream : local_stream.stream;
            if (stream && (typeof stream.getTracks != "undefined")) {
                var tracks = stream.getTracks();
                tracks.forEach( function(track, idx, arr) {
                    track.stop();
                });
            }
        }
    };
})();
