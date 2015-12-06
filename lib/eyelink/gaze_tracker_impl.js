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

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

// Functions which will be available to external callers
define(["myclass", "log4js", "bridjs","../gaze_exception", "./core_expt",
    "./eyelink", "../gaze_tracker", "./eyetypes", "fs", "./eye_data", "./date_format"], 
        function(my, log4js, bridjs, GazeException, core_expt, EyeLink, GazeTracker, eyetypes, fs, eye_data, DateFormat){
 var loggerName = "GazeTracker";
 var log, eyelinkCore = new core_expt(),
         eyelink = new EyeLink(), 
         micro =new eyetypes.MICRO(), hookFunctions = new core_expt.HOOKFCNS2();

        
        log = log4js.getLogger(loggerName);

 var pollGazeData = function(tracker){
        if(eyelink.newestFloatSample(null)>0){
            var leftEye, rightEye, center = {x:0,y:0}, x, y, count=0, fs, 
                    screenWidth = tracker.hostScreenCoords[2], screenHeight= tracker.hostScreenCoords[3];
            
            eyelink.newestFloatSample(bridjs.byPointer(tracker.eyeData));
            fs = tracker.eyeData.fs;
            
            if((tracker.eyeUsed===eye_data.LEFT_EYE || tracker.eyeUsed===eye_data.BINOCULAR) ){
                x = fs.gx.get(eye_data.LEFT_EYE);
                y = fs.gy.get(eye_data.LEFT_EYE);

                if (x!==eye_data.MISSING_DATA && y!==eye_data.MISSING_DATA) {
                    leftEye = {x: x/screenWidth /* self.screenBounds.right*/, screenHey: y/screenHeight /** self.screenBounds.bottom*/};
                    center.x+=leftEye.x;
                    center.y+=leftEye.y;
                    ++count;
                }
                }
            if((tracker.eyeUsed===eye_data.RIGHT_EYE || tracker.eyeUsed===eye_data.BINOCULAR) ){
                x = fs.gx.get(eye_data.RIGHT_EYE);
                y = fs.gy.get(eye_data.RIGHT_EYE);
                
                if (x!==eye_data.MISSING_DATA && y!==eye_data.MISSING_DATA) {
                    rightEye = {x: x/screenWidth /* self.screenBounds.right*/, y: y/screenHeight /* self.screenBounds.bottom*/};
                    center.x += rightEye.x;
                    center.y+=rightEye.y;
                    ++count;
                }
            }
            if(count>=1){
                center.x /= count;
                center.y /=count;
            }else{
                center = undefined;
            }
            
            tracker.onGazeData({left:leftEye, right:rightEye, prefered:center, 
                timeSeconds: fs.time/1000.0});
        }
    };


var exports = my.Class(GazeTracker,{
    constructor: function() {
        exports.Super.call();
        this.hostScreenCoords = null;
        this.status = GazeTracker.IDLE;
        this.edfName = "gazejs.edf";
        this.recording = false;
        this.gazeDataInterval = null;
        this.eyeUsed = eye_data.BINOCULAR;
        this.eyeData = new eye_data.ALLF_DATA();
        this.sampleRate = 1000;
        
        bridjs.fill(this.eyeData, 0);
    },
    setSampleRate:function(sampleRate){
        var self = this;
        
        this.sampleRate =sampleRate;
        
        if(this.status===GazeTracker.STARTED && this.sampleRate>0){
            clearinterval(this.gazeDataInterval);
            this.gazeDataInterval = setInterval(function(){pollGazeData(self);},1000/this.sampleRate);
        }
    },
    setRecordFileName:function(name){
        this.edfName = name;
    },
    getTrackingTimeSeconds:function(){
        return this.timeSeconds()-this.gazeStartSeconds;
    },
    timeSeconds:function(){
      eyelink.currentMicro(bridjs.byPointer(micro));  

      return (micro.msec/1000.0) + (micro.usec/(1000000.0));
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
        
        log.error("OnError: ",message);
        
        //this.onStop();
        
        if (this.listener && typeof (this.listener.onError) === "function") {
            try {
                this.listener.onError(new GazeException(message), this);
            } catch (e) {
                this.warn(e);
            }
        }
        this.status = exports.ERROR;
        setTimeout(function() {
            if(self.status === GazeTracker.STARTED){
                self.stop();
            }
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
        var self = this;
        
        this.status = exports.STARTED;
        this.gazeStartSeconds = this.timeSeconds();
        this.eyeUsed = eyelink.eyeAvailable();
         
        log.info("OnStart");
        
        if(this.listener && typeof(this.listener.onStart)==="function"){
            try{
                this.listener.onStart(this);
            }catch(e){
                this.warn(e);
            }
        }
        if(this.sampleRate>0){
            this.gazeDataInterval = setInterval(function(){pollGazeData(self);},1000/this.sampleRate);
        }
    },
    
    pollGazeData:function(){
        if(this.status===exports.STARTED){
            pollGazeData(this);
        }else{
            throw new GazeException("Illegal status to connect tracker: " + this.status);
        }
    },
    
    onConnect:function(){
        var self = this;
        
        this.status = exports.CONNECTED;
        
        if(this.listener && typeof(this.listener.onConnect)==="function"){
            try{
                this.listener.onConnect(this);
            }catch(e){
                this.warn(e);
            }
        }
        
        
        
        function dataFileAppender (loggingEvent) {
            
            self.logToDataFile(loggingEvent);
        }
        
        log4js.addAppender(dataFileAppender, loggerName);
        
        log.info("OnConnect");
    },
    
    logToDataFile:function(loggingEvent){
        if (this.status !== exports.IDLE && this.status !== exports.ERROR) {
            if (loggingEvent.level.level > log4js.levels.DEBUG.level) {
                var layout = ['[',DateFormat.asString(loggingEvent.startTime),']',' ','[',loggingEvent.level.levelStr,']',
                    ' GazeJS - ', 
                    Array.isArray(loggingEvent.data) ? loggingEvent.data.join('') : loggingEvent.data];

                //console.log(layout.join(''));
                //console.log(loggingEvent);
                eyelinkCore.eyemsgPrintf("%s",layout.join(''));
            }
        }
    },
    
    startRecording:function(edfName){
        if(!this.recording){
            if (this.status !== exports.IDLE && this.status !== exports.ERROR) {
                if(eyelink.isConnected()){
                    if(typeof(edfName)==="string" && edfName){
                        this.edfName = edfName;
                    }
                    if(eyelinkCore.openDataFile(this.edfName)===0){
                        log.debug("Success to open data file: "+ this.edfName);
                        
                        if(eyelinkCore.startRecording(1, 1, 1, 1)===0){
                            this.recording = true;
                        }else{
                            throw new GazeException("Fail to start recording");
                        }
                        
                    }else{
                        this.edfName = null;
                        throw new GazeException("Fail to open host data file: "+edfName);
                    }
                }else{
                    this.onError("Eyetracker is disconnected");
                }
            } else {
                throw new GazeException("Illegal status to start tracker: " + this.status);
            }
        }else{
            throw new GazeException("Data file is opened");
        }
        
    },
    
    stopRecording:function(path, callback){
        if(this.recording){
            if(typeof(this.edfName)==="string"){
                var self = this;
                
                if(typeof(path)!=="string"){
                    throw new GazeException("Invalid path: "+path);
                }
                
                if(fs.existsSync(path)){
                    log.warn("Detect "+path+" is exist, delete it!!");
                    fs.unlinkSync(path);
                }

                eyelinkCore.stopRecording();
                
                log.debug("Start to transfer data file");
                bridjs.async(eyelinkCore).receiveDataFile(this.edfName, path, 0,function(bytes){
                    self.recording = false;        
                    log.info("Transfer ", bytes, "bytes to ",path);
                    
                    if(typeof(callback)==="function"){
                        try{
                            callback(bytes);
                        }catch(e){
                            log.warn(e);
                        }
                    }
                });
                
            }
        }else{
            throw new GazeException("No recording");
        }
    },
    
    connect:function(address){
        var strBuffer = new Buffer(256), self = this, i;
        
        if (this.status === exports.IDLE) {
        
            bridjs.async(eyelinkCore).openEyelinkConnection(0, function(b){
                if(!b){

                        if(eyelink.readRequest("screen_pixel_coords")===EyeLink.OK_RESULT){
                            setTimeout(function(){
                                if(eyelink.readReply(strBuffer)===EyeLink.OK_RESULT){

                                    self.hostScreenCoords = bridjs.toString(strBuffer).split(',');

                                    for(i=0;i<self.hostScreenCoords.length;++i){
                                        self.hostScreenCoords[i] = parseFloat(self.hostScreenCoords[i]);
                                    }

                                    self.onConnect();
                                }else{
                                    self.onError("Fail to read reply");
                                }
                            },500);
                        }else{
                            self.onError("Fail to read request");
                        }
                }else{
                    self.onError("Fail to connect eyetracker with address: "+address);
                }
            });
        }else{
             throw new GazeException("Illegal status to connect tracker: " + this.status);
        }
        
    },
    onStop: function() {
        log.debug("onDisconnection");
        
        log.info("OnStop");
        
        if(this.status===exports.STARTED){
        
            if(this.listener && typeof(this.listener.onStop)==="function"){
                try{
                    this.listener.onStop();
                }catch(e){
                    this.warn(e);
                }
            }
        }
        //eyelinkCore.closeEyelinkConnection();
        this.status = exports.STOPPED;
        
        if(this.releaseAfterStopped){
            this.release();
        }
    },
    doDriftCorrect:function(callback){
        if(typeof(callback)==="function"){
            log.info("Start doDriftCorrect");
            if(eyelink.isConnected()){
                bridjs.async(eyelinkCore).doDriftCorrectf(this.hostScreenCoords[2]/2, this.hostScreenCoords[3]/2 , 0, 0, callback);
            }else{
                this.onError("Eyetracker is disconnected");
            }
        }else{
            throw new GazeException("callback is not a function: " + callback);
        }
    },
    start: function(edfName) {
        if (this.status === exports.CONNECTED) {
            if(eyelink.isConnected()){
                var self = this;
                
                this.status = exports.STARTING;
                
                bridjs.async(eyelink).waitForBlockStart(500, 1, 0,function(r){
                    if(r!==0){
                        self.onStart();
                    }else{
                        self.onError("Fail to wait block start: "+r);
                    }
                });
                
                
            }else{
                this.onError("Eyetracker is disconnected");
            }
        } else {
            throw new GazeException("Illegal status to start tracker: " + this.status);
        }
    },
    stop: function() {
        if (this.status === exports.STARTED) {
            this.status = exports.STOPPING;
            
            if(this.gazeDataInterval){
                clearInterval(this.gazeDataInterval);
                this.gazeDataInterval = null;
            }
            this.onStop(); 
        }else if(this.status !== GazeTracker.CONNECTED){
            throw new GazeException("Illegal status to stop tracker: " + this.status);
        }
    },
    release: function() {
        if (this.status === exports.STOPPED ||
                this.status === exports.STARTED || 
                this.status === exports.CONNECTED || 
                this.status === exports.CALIBRATING ||
                this.status === exports.ERROR) {
            if (this.status === exports.STARTED) {
                this.releaseAfterStopped = true;
                this.stop();
            } else {
                log.info("Start to release eyetracker: " + this);
                
                this.releaseAfterStopped = false;
                
                eyelinkCore.closeEyelinkConnection();
                //config.free();
                this.status = exports.IDLE;
                
                log.info("Release EyeTracker done");
            }
        } else {
            throw new GazeException("Illegal status to release tracker: " + this.status);
        }
    },
    
    getLibraryVersion:function(){
       return -1;
    },
    
    getModelName:function(){
        if (this.status !== exports.IDLE) {
            var strBuffer = new Buffer(256), ret;
            
            ret = eyelink.getTrackerVersion(strBuffer);

            if (ret <= 0) {
                this.onError(GazeException("Invalid tracker version: ", ret));
            } else {
                return bridjs.toString(strBuffer);
            }
        }else{
            throw new GazeException("Please init tracker before getModelName(), status = "+this.status);
        }
    },
    
    getStatus:function(){
        return this.status;
    },
    
    startCalibration:function(listener){
        
        if(this.status!==GazeTracker.IDLE && this.status!==GazeTracker.ERROR){
            if(eyelink.isConnected()){
                if(listener){
                    var self = this, oldStatus = this.status;

                    bridjs.fill(hookFunctions,0);

                    hookFunctions.major = 1;
                    hookFunctions.minor = 0;

                    hookFunctions.setup_cal_display_hook = bridjs.newCallback(bridjs.defineFunction("INT16  (*setup_cal_display_hook)(void *userData)"),function(userData){

                        try{
                            listener.onStart(self);
                        }catch(e){
                            log.warn(e);
                        }

                        return 0;
                    });

                    hookFunctions.exit_cal_display_hook = bridjs.newCallback(bridjs.defineFunction("INT16  (*exit_cal_display_hook)(void *userData)"),function(userData){
                        log.debug("exit_cal_display_hook");

                        return 0;
                    });

                    hookFunctions.clear_cal_display_hook = bridjs.newCallback(bridjs.defineFunction("INT16  (*clear_cal_display_hook)(void *userData)"),function(userData){
                        try{
                            listener.onClear(self);
                        }catch(e){
                            log.warn(e);
                        }
                        return 0;
                    });

                    hookFunctions.erase_cal_target_hook = bridjs.newCallback(bridjs.defineFunction("INT16  (*erase_cal_target_hook)(void *userData)"),function(userData){
                        try{
                            listener.onTargetErase(self);
                        }catch(e){
                            log.warn(e);
                        }
                        return 0;
                    });

                    hookFunctions.play_target_beep_hook= bridjs.newCallback(bridjs.defineFunction("INT16  (*play_target_beep_hook)(void *userData, int beepType)"),function(userData, beepType){
                        try{
                            listener.onBeep(beepType,self);
                        }catch(e){
                            log.warn(e);
                        }
                        return 0;
                    });

                    hookFunctions.draw_cal_target_hook = bridjs.newCallback(bridjs.defineFunction("INT16   (*draw_cal_target_hook)(void *userData,float x, float y)"),function(userData, x, y){
                        try{
                            listener.onTargetShow(x/self.hostScreenCoords[2],y/self.hostScreenCoords[3], self);
                        }catch(e){
                            log.warn(e);
                        }
                        return 0;
                    });

                    this.status = GazeTracker.CALIBRATING;

                    eyelinkCore.setupGraphicHookFunctionsV2(bridjs.byPointer(hookFunctions));

                    bridjs.async(eyelinkCore).doTrackerSetup(function(){
                        log.info("End doTrackerSetup");

                        self.status = oldStatus;

                        try{
                            listener.onEnd(self);
                        }catch(e){
                            log.warn(e);
                        }
                    });
                }else{
                    throw new GazeException("Invalid listener: "+listener);
                }
            }else{
                this.onError("Eyetracker is disconnected");
            }
        }else{
            throw new GazeException("Illegal status: "+this.status);
        }
    },
    
    sendRecordMessage:function(message){
        if(this.status!==GazeTracker.IDLE && this.status!==GazeTracker.ERROR){
            eyelinkCore.eyemsgPrintf("%s",message);
            //log.debug("Send record message: \n"+message);
        }else{
            throw new GazeException("Illegal status: "+this.status);
        }
        
    }
});

return exports;

});