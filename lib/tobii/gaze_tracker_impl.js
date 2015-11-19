/*
 * GazeJS - An implementation of the JavaScript bindings for Tobii Gaze SDK.
 * https://github.com/jiahansu/GazeJS
 *
 * Copyright (c) 2013-2013, Jia-Han Su (https://github.com/jiahansu)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Olivier Chafik nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY JIA-HAN SU AND CONTRIBUTORS ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE REGENTS AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var my = require("myclass"), bridjs = require("bridjs"),
        log4js = require("log4js"), log = log4js.getLogger("TobiiGazeImpl"),
        TobiiGaze = require("./gaze"),
        ErrorCodes = require("./error_codes"),
        DataTypes = require("./data_types"),
        GazeException = require("../gaze_exception"),
        CallbackTypes = require("./callback_types"),
        gaze = null, GazeTracker = require("../gaze_tracker"),
        NANO_TO_SECONDS = (1.0 / (1000 * 1000 * 1000));

module.exports = my.Class(GazeTracker,{
    constructor: function() {
        var self = this;
        
        if(gaze===null || gaze === undefined){
            gaze = new TobiiGaze(); 
        }
        
        this.eyeTracker = null;
        //this.screenBounds = null;//new DataTypes.Rect();
        this.status = module.exports.IDLE;
        this.releaseAfterStopped = false;
        this.listener = null;
        this.gazeStartSeconds = 0;
        this.onStopTrackingCallback = bridjs.newCallback(CallbackTypes.AsyncCallback, function(errorCode, userData) {
            self.checkError(errorCode);
            self.onStopTracking();
        });
        this.onDisconnectCallback = bridjs.newCallback(CallbackTypes.AsyncBasicCallback, function(userData) {
            self.onDisconnect();
        });
        this.onErrorCallback = bridjs.newCallback(CallbackTypes.AsyncCallback, function(errorCode, userData) {
            var message = gaze.getErrorMessage(errorCode);

            log.error("OnError: " + gaze.getErrorMessage(errorCode));
            self.onError(message);
        });
        this.onConnectCallback = bridjs.newCallback(CallbackTypes.AsyncCallback, function(errorCode, userData) {
            self.checkError(errorCode);

            self.onConnect();
        });
        this.onDeviceInfoCallback = bridjs.newCallback(CallbackTypes.AsyncDeviceInfoCallback, function(deviceInfo, errorCode, userData) {
            self.checkError(errorCode);

            log.debug("OnDeviceInof, serial number = " + bridjs.toString(deviceInfo.serialNumber));
        });

        this.onStartTrackingCallback = bridjs.newCallback(CallbackTypes.AsyncCallback, function(errorCode, userData) {
            self.checkError(errorCode);
            self.onStart();
        });

        this.onGazeDataCallback = bridjs.newCallback(CallbackTypes.Listener, function(gazeData, extensions, userData) {
            var left = gazeData.left.gazePointOnDisplayNormalized,
                    right = gazeData.right.gazePointOnDisplayNormalized,
                    status = gazeData.trackingStatus, leftEye, rightEye, 
                    center = {x:0, y:0}, count = 0;;

            if ((status === DataTypes.Status.TRACKING_STATUS_BOTH_EYES_TRACKED ||
                    status === DataTypes.Status.TRACKING_STATUS_ONLY_LEFT_EYE_TRACKED ||
                    status === DataTypes.Status.TRACKING_STATUS_ONE_EYE_TRACKED_PROBABLY_LEFT) && 
                    left.x!==undefined && left.y!==undefined) {
                leftEye = {x: left.x /* self.screenBounds.right*/, y: left.y /** self.screenBounds.bottom*/};
                center.x+=leftEye.x;
                center.y+=leftEye.y;
                ++count;
            }

            if ((status === DataTypes.Status.TRACKING_STATUS_BOTH_EYES_TRACKED ||
                    status === DataTypes.Status.TRACKING_STATUS_ONLY_RIGHT_EYE_TRACKED ||
                    status === DataTypes.Status.TRACKING_STATUS_ONE_EYE_TRACKED_PROBABLY_RIGHT) 
                    && right.x!==undefined && right.y!==undefined) {
                rightEye = {x: right.x /* self.screenBounds.right*/, y: right.y /* self.screenBounds.bottom*/};
                center.x += rightEye.x;
                center.y+=rightEye.y;
                ++count;
            }
            if(count>=1){
                center.x /= count;
                center.y /=count;
            }else{
                center = undefined;
            }
            self.onGazeData({left:leftEye, right:rightEye, prefered:center, 
                timeSeconds: self.getTrackingTimeSeconds()});
        });
    },
    getTrackingTimeSeconds:function(){
        return this.timeSeconds()-this.gazeStartSeconds;
    },
    timeSeconds:function(){
        var time = process.hrtime();

        return time[0] + (time[1] * NANO_TO_SECONDS);
    },
    setListener:function(listener){
        this.listener = listener;  
    },
    warn:function(e){
        log.warn(e);
      
        if(e.stack){
            log.warn(e.stack);
        }
    },
    onError: function(message) {
        var self = this;

        if (this.listener && typeof (this.listener.onError) === "function") {
            try {
                this.listener.onError(new GazeException(message));
            } catch (e) {
                this.warn(e);
            }
        }
        this.status = module.exports.ERROR;
        setTimeout(function() {
            self.stop();
        }, 0);
    },
    onGazeData:function(gazeData){
        if(this.listener && typeof(this.listener.onGazeData)==="function"){
            try{
                this.listener.onGazeData(gazeData);
            }catch(e){
                this.warn(e);
            }
        }
    },
    onStart:function(){
        this.status = module.exports.STARTED;
        this.gazeStartSeconds = this.timeSeconds();
        log.debug("OnStart");
         
        if(this.listener && typeof(this.listener.onStart)==="function"){
            try{
                this.listener.onStart();
            }catch(e){
                this.warn(e);
            }
        }
    },
    
    onConnect: function() {
        log.info("OnConnect");

        this.status = module.exports.INITED;

        if (this.listener && typeof (this.listener.onConnect) === "function") {
            try {
                this.listener.onConnect(this);
            } catch (e) {
                this.warn(e);
            }
        }

        gaze.getDeviceInfoAsync(this.eyeTracker, this.onDeviceInfoCallback, null);
    },
    onDisconnect: function () {
        var self = this;

        log.debug("onDisconnection");
        gaze.breakEventLoop(this.eyeTracker);

        this.status = module.exports.IDLE;

        setTimeout(function () {
            if (self.eyeTracker) {
                gaze.destroy(self.eyeTracker);
                self.eyeTracker = null;
            }
            log.debug("Release EyeTracker done");
        }, 0);
    },
    checkError: function(errorCode) {
        var value;

        if (typeof (errorCode) === "number") {
            value = errorCode;
        } else {
            value = errorCode.get();
        }

        if (value !== ErrorCodes.SUCCESS) {
            var message = gaze.getErrorMessage(value);
            
            this.onError(message);
            
            throw new GazeException("Gaze error :" + message);
        }
    },
    init: function() {
        return this.connect();
    },
    connect : function() {
        if (this.status === module.exports.IDLE) {
            var errorCode = new bridjs.NativeValue.uint32(),
                    modelUrl = new Buffer(DataTypes.Constants.DEVICE_INFO_MAX_MODEL_LENGTH),
                    eventLoopErrorCode = new bridjs.NativeValue.uint32(), self = this;

            //config.init(bridjs.byPointer(errorCode));
            //this.checkError(errorCode);

            gaze.getConnectedEyeTracker(modelUrl, DataTypes.Constants.DEVICE_INFO_MAX_MODEL_LENGTH,
                bridjs.byPointer(errorCode));
            this.checkError(errorCode);    

            log.debug("Tobii EyeTracker Model name: " + bridjs.toString(modelUrl));
            log.debug("Tobii Gaze SDK version: " + gaze.getVersion());

            //config.getScreenBoundsPixels(modelUrl, bridjs.byPointer(screenBounds),
            //bridjs.byPointer(errorCode));
            //this.checkError(errorCode);

            //this.screenBounds = {left: screenBounds.left, right: screenBounds.right, 
            //   top:screenBounds.top, bottom: screenBounds.bottom};

            this.eyeTracker = gaze.create(modelUrl, bridjs.byPointer(errorCode));
            this.checkError(errorCode);

            gaze.setLogging("tobii_gaze_impl_log.txt", DataTypes.LogLevel.OFF, bridjs.byPointer(errorCode));
            this.checkError(errorCode);


            log.debug("runEventLoop++");
            bridjs.async(gaze).runEventLoop(this.eyeTracker,
                    bridjs.byPointer(eventLoopErrorCode), function () {
                        self.checkError(eventLoopErrorCode);
                        log.debug("gaze.runEventLoop() returned");
                    });
            log.debug("runEventLoop--");

            /*Delay execution to workaround strange crash issue*/
            setTimeout(function () {
                gaze.registerError(self.eyeTracker, self.onErrorCallback, null);
                gaze.connectAsync(self.eyeTracker, self.onConnectCallback, null);
            }, 16);
            
        } else {
            throw new GazeException("Illegal status to init tracker: " + this.status);
        }
    },
    start: function() {
        if (this.status === module.exports.INITED || this.status === module.exports.STOPPED) {
            var self = this;
            this.status = module.exports.STARTING;
            
            gaze.startTrackingAsync(this.eyeTracker, this.onStartTrackingCallback, this.onGazeDataCallback, null);

        } else {
            throw new GazeException("Illegal status to start tracker: " + this.status);
        }
    },
    onStopTracking: function() {
        
        this.status = module.exports.STOPPED;
        log.debug("OnStop");

        if (this.listener && typeof (this.listener.onStop) === "function") {
            try {
                this.listener.onStop();
            } catch (e) {
                this.warn(e);
            }
        }

        if (this.releaseAfterStopped) {
            this.releaseAfterStopped = false;
            this.release();
        }
    },
    stop: function() {
        if (this.status === module.exports.STARTED) {
            this.status = module.exports.STOPPING;
            gaze.stopTrackingAsync(this.eyeTracker, this.onStopTrackingCallback, null);
        }else{
            throw new GazeException("Illegal status to stop tracker: " + this.status);
        }
    },
    release: function() {
        if (this.status === module.exports.STOPPED ||
                this.status === module.exports.STARTED || 
                this.status === module.exports.INITED ||
                this.status === module.exports.ERROR) {
            if (this.status === module.exports.STARTED) {
                this.releaseAfterStopped = true;
                this.stop();
            } else {
                log.info("Release eyeTracker: " + this.eyeTracker);
                this.releaseAfterStopped = false;
                gaze.disconnectAsync(this.eyeTracker, this.onDisconnectCallback, null);
            }
        } else {
            throw new GazeException("Illegal status to release tracker: " + this.status);
        }
    },
    
    getLibraryVersion:function(){
        gaze.getVersion();
    },
    
    getModelName:function(){
        if (this.status !== module.exports.IDLE) {
            var modelUrl = new Buffer(DataTypes.Constants.DEVICE_INFO_MAX_MODEL_LENGTH);
            var errorCode = new bridjs.NativeValue.uint32();

            gaze.getConnectedEyeTracker(modelUrl, DataTypes.Constants.DEVICE_INFO_MAX_MODEL_LENGTH,
                bridjs.byPointer(errorCode));
            this.checkError(errorCode);
            
            return bridjs.toString(modelUrl);    
        }else{
            throw new GazeException("Please init tracker before getModelName(), status = "+this.status);
        }
    },
    
    getStatus:function(){
        return this.status;
    }
});