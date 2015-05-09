/*
 * BridJS - Dynamic and blazing-fast native interop for JavaScript.
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
var gazejs = require("../lib/gazejs"), bridjs = require("bridjs"),
        errorCode = new bridjs.NativeValue.uint32(),
        //config = gazejs.tobii.config,
        gaze = gazejs.tobii.gaze,
        dataTypes = gazejs.tobii.dataTypes, log4js = require("log4js"),
        log = log4js.getLogger("GazeJSTest"),
        modelUrl = new Buffer(dataTypes.Constants.DEVICE_INFO_MAX_MODEL_LENGTH),
        eyeTracker, eventLoopErrorCode = new bridjs.NativeValue.uint32();

var onConnectCallback,onStopTrackingCallback,onDeviceInfoCallback,onStartTrackingCallback,
    onGazeDataCallback;

function startTracking(){
    gaze.getDeviceInfoAsync(eyeTracker, onDeviceInfoCallback,null);
    gaze.startTrackingAsync(eyeTracker, onStartTrackingCallback, onGazeDataCallback, null);
    
    setTimeout(function(){
        stopTracking();
    }, 5000);
    //tobiigaze_start_tracking_async(eye_tracker, &start_tracking_callback, &on_gaze_data, 0);
}

function stopTracking(){
    gaze.stopTrackingAsync(eyeTracker,onStopTrackingCallback, null);
}

function destroy() {
    log.info("Destroy eyeTracker: "+eyeTracker);
    
    if (eyeTracker) {
        gaze.destroy(bridjs.byPointer(eyeTracker));
    }

    //config.free();

    console.log("done");
}

onConnectCallback = gazejs.newCallback(gazejs.tobii.callbackTypes.AsyncCallback, function(errorCode, userData) {
    gazejs.checkError(errorCode);

    log.info("OnConnect");
    startTracking();
    /*
    setTimeout(function() {
        //gaze.stopTrackingAsync(bridjs.byPointer(eyeTracker), onStopCallback, null);
    }, 3000);*/
});

onStopTrackingCallback = gazejs.newCallback(gazejs.tobii.callbackTypes.AsyncCallback, function(errorCode, userData) {
    gazejs.checkError(errorCode);
    gaze.disconnectAsync(eyeTracker,onDisconnectCallback, null);
    log.info("OnStop");
});

onDeviceInfoCallback = gazejs.newCallback(gazejs.tobii.callbackTypes.AsyncDeviceInfoCallback, function(deviceInfo, errorCode, userData){
    gazejs.checkError(errorCode);
    
    log.info("OnDeviceInof, serial number = "+gazejs.toString(deviceInfo.serialNumber));
});

onStartTrackingCallback = gazejs.newCallback(gazejs.tobii.callbackTypes.AsyncCallback, function(errorCode, userData){
    //log.info(userData);
    gazejs.checkError(errorCode);
    
    log.info("OnStartTracking");
});

onErrorCallback = gazejs.newCallback(gazejs.tobii.callbackTypes.AsyncCallback, function(errorCode, userData) {
    log.info("OnError: "+gaze.getErrorMessage(errorCode));
    
    setTimeout(destroy, 0);
});

onGazeDataCallback = gazejs.newCallback(gazejs.tobii.callbackTypes.Listener, function(gazeData, extensions,userData) {
    var left = gazeData.left.gazePointOnDisplayNormalized;
    
    log.info("OnGazeData: "+left.x+", "+left.y+", "+left.z);
});

onDisconnectCallback = gazejs.newCallback(gazejs.tobii.callbackTypes.AsyncBasicCallback, function(userData) {
    log.info("onDisconnectCallback");
    gaze.breakEventLoop(bridjs.byPointer(eyeTracker));
});

try {
    //config.init(bridjs.byPointer(errorCode));
    //gazejs.checkError(errorCode);

     gaze.getConnectedEyeTracker(modelUrl, dataTypes.Constants.DEVICE_INFO_MAX_MODEL_LENGTH,
            bridjs.byPointer(errorCode));
    gazejs.checkError(errorCode);     
    log.info("Model name: " + gazejs.toString(modelUrl));

    log.info("Natvie library version: " + gaze.getVersion());

    eyeTracker = gaze.create(modelUrl, bridjs.byPointer(errorCode));
    gazejs.checkError(errorCode);
    
    gaze.setLogging("log.txt", dataTypes.LogLevel.OFF, bridjs.byPointer(errorCode));
    gazejs.checkError(errorCode);
    
    gazejs.async(gaze).runEventLoop(bridjs.byPointer(eyeTracker),
        bridjs.byPointer(eventLoopErrorCode), function(){
        gazejs.checkError(eventLoopErrorCode);
        log.info("gaze.runEventLoop() returned");
        
        destroy();
    });
    
    /*Delay execution to workaround strange crash issue*/
    setTimeout(function(){
        gaze.registerError(bridjs.byPointer(eyeTracker), onErrorCallback, null);
        gaze.connectAsync(bridjs.byPointer(eyeTracker), onConnectCallback, null);
    },16);
} catch (e) {
    log.error(e);

    destroy();
}

//destroy();


