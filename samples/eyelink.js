/*
 * GazeJS - An implementation of the JavaScript bindings for Tobii Gaze SDK.
 * https://github.com/jiahansu/GazeJS
 *
 * Copyright (c) 2013-2015, Jia-Han Su (https://github.com/jiahansu)
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
var gazejs = require("../lib/gazejs"), my = require("myclass"),
        log4js = require("log4js"), log = log4js.getLogger("Calibration");
var eyeTracker = gazejs.createEyeTracker(gazejs.SR_EYELINK_SDK);
var calibrationListener = {
             onStart:function(tracker){log.info("start: ",tracker);},
             onEnd:function(tracker){
                 log.info("end: ",tracker);
                 eyeTracker.doDriftCorrect(function(){
                    log.info("End doDriftCorrect");
                    eyeTracker.startRecording("test.edf");
                    eyeTracker.start();
                });
             },
             onClear:function(tracker){log.info("clear: ",tracker);},
             onTargetErase:function(tracker){log.info("target erase: ",tracker);},
             onBeep:function(type,tracker){log.info("beep: ",type);},
             onTargetShow:function(x, y,tracker){log.info("show, x = ",x, ", y = ",y);}
         };
var trackeListener = {
    onConnect:function(){
        log.info("Library version: "+eyeTracker.getLibraryVersion());
        log.info("Model name: "+eyeTracker.getModelName());
        
        eyeTracker.startCalibration(calibrationListener);
        
        
        
        //eyeTracker.start();
    },
    onStart:function(){
        log.info("OnStart");
        
        
    },
    onStop:function(){
        log.info("OnStop");
    },
    onError:function(error){
        log.error(error);
    },
    onGazeData:function(gazeData){
        log.info(gazeData);
    }
};

eyeTracker.setListener(trackeListener);
eyeTracker.connect();

setTimeout(function(){
    eyeTracker.sendRecordMessage("Test message!!");
    eyeTracker.stop();
    eyeTracker.stopRecording("test.edf", function(bytes){
        eyeTracker.release();
        setTimeout(function(){
            process.exit();
        },0);
    });
},30000);




