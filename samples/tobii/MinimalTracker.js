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
var callbackTypes = require("../../lib//tobii/callback_types"), bridjs = require("bridjs"),
        errorCode = new bridjs.NativeValue.uint32(),
        ErrorCodes = require("../../lib/tobii/error_codes"), 
        TobiiGaze = require("../../lib/tobii/gaze"),
        gaze = new TobiiGaze(),
        dataTypes = require("../../lib/tobii/data_types"), log4js = require("log4js"),
        log = log4js.getLogger("GazeJSTest"),
        modelUrl = new Buffer(dataTypes.Constants.DEVICE_INFO_MAX_MODEL_LENGTH),
        eyeTracker, eventLoopErrorCode = new bridjs.NativeValue.uint32();

var onConnectCallback,onStopTrackingCallback,onDeviceInfoCallback,onStartTrackingCallback,
    onGazeDataCallback;

var checkError = function (errorCode) {
    var value;

    if (typeof (errorCode) === "number") {
        value = errorCode;
    } else {
        value = errorCode.get();
    }

    if (value !== ErrorCodes.SUCCESS) {
        throw new GazeException("Gaze error :" + gaze.getErrorMessage(value));
    }
}

function startTracking(){
    var deviceInfo = new dataTypes.DeviceInfo();
    
    gaze.connect(eyeTracker, bridjs.byPointer(errorCode));
    checkError(errorCode);
    
    gaze.getDeviceInfo(eyeTracker, bridjs.byPointer(deviceInfo),bridjs.byPointer(errorCode));
    checkError(errorCode);
    
    log.info("OnDeviceInof, serial number = "+bridjs.toString(deviceInfo.serialNumber));
    
    gaze.startTracking(eyeTracker,onGazeDataCallback,bridjs.byPointer(errorCode), null);
    checkError(errorCode);
    
    setTimeout(function(){
        stopTracking();
    }, 20000);
    //tobiigaze_start_tracking_async(eye_tracker, &start_tracking_callback, &on_gaze_data, 0);
}

function stopTracking(){
    gaze.stopTracking(eyeTracker,bridjs.byPointer(errorCode));
    checkError(errorCode);
    
    gaze.disconnect(eyeTracker);
    
    gaze.breakEventLoop((eyeTracker));
}

function destroy() {
    log.info("Destroy eyeTracker: "+eyeTracker);
    
    if (eyeTracker) {
        gaze.destroy((eyeTracker));
    }

    //config.free();

    log.info("done");
    
    process.exit();
}


onErrorCallback = bridjs.newCallback(callbackTypes.AsyncCallback, function(errorCode, userData) {
    log.info("OnError: "+gaze.getErrorMessage(errorCode));
    
    setTimeout(destroy, 0);
});

onGazeDataCallback = bridjs.newCallback(callbackTypes.Listener, function(gazeData, extensions, userData) {
    var left = gazeData.left.gazePointOnDisplayNormalized, right = gazeData.right.gazePointOnDisplayNormalized;
    
    log.info("Left eye: "+left.x+", "+left.y+", "+left.z+"; Right eye: "+right.x+", "+right.y+", "+right.z);
});

try {
    //config.init(bridjs.byPointer(errorCode));
   // gazejs.checkError(errorCode);
    gaze.getConnectedEyeTracker(modelUrl, dataTypes.Constants.DEVICE_INFO_MAX_MODEL_LENGTH,
            bridjs.byPointer(errorCode));
    checkError(errorCode);        
    //config.getDefaultEyeTrackerUrl(modelUrl, dataTypes.Constants.DEVICE_INFO_MAX_MODEL_LENGTH,
    //        bridjs.byPointer(errorCode));
    //gazejs.checkError(errorCode);
    //modelUrl.write("--auto\0");
    log.info("Model name: " + bridjs.toString(modelUrl));

    log.info("Natvie library version: " + gaze.getVersion());

    eyeTracker = gaze.create(modelUrl, bridjs.byPointer(errorCode));
    checkError(errorCode);
    
    gaze.setLogging("log.txt", dataTypes.LogLevel.OFF, bridjs.byPointer(errorCode));
    checkError(errorCode);
    log.info("Start event loop");
    bridjs.async(gaze).runEventLoop((eyeTracker),
        bridjs.byPointer(eventLoopErrorCode), function(){
        checkError(eventLoopErrorCode);
        log.info("gaze.runEventLoop() returned");
        
        destroy();
    });
    
    /*Delay execution to workaround strange crash issue*/
    setTimeout(function(){
        gaze.registerError((eyeTracker), onErrorCallback, null);
        startTracking();
    },16);
} catch (e) {
    log.error(e);

    destroy();
}

//destroy();


