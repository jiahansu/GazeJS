GazeJS
======
Utilizing [BridJS api](http://bridj.googlecode.com) to implement JavaScript bindings for Tobii Gaze SDK

###Video Demonstration
[![EyeMining for Web](http://img.youtube.com/vi/lptzZq5zj1M/0.jpg)](http://www.youtube.com/watch?v=lptzZq5zj1M&feature)
###Installation
``` bash
npm install gazejs
```
###How to use
Download lastest [Tobii Gaze SDK](http://developer.tobii.com/?wpdmdl=85) and copy "TobiiGazeCore64.dll" to working directory
``` bash
var gazejs = require("gazejs")
var eyeTracker = gazejs.createEyeTracker(gazejs.TOBII_GAZE_SDK);
var listener = {
    onStart:function(){
        console.log("OnStart");
    },
    onStop:function(){
        console.log("OnStop");
    },
    onError:function(error){
        console.log(error);
    },
    onGazeData:function(gazeData){
        console.log(gazeData);
    }
};

eyeTracker.init();
eyeTracker.setListener(listener);

log.info("Library version: "+eyeTracker.getLibraryVersion());
log.info("Model name: "+eyeTracker.getModelName());

eyeTracker.start();

/*Stop eye tracking after 20 seconds*/
setTimeout(function(){
    eyeTracker.release();
},20000);

```
