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
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

// Functions which will be available to external callers
define(["myclass","../../lib/eyelink/core_expt", "log4js", "bridjs","../../lib/eyelink/sdl_expt",
    "../../lib/eyelink/eyelink","../../lib/gaze_exception"], 
        function(my,core_expt, log4js, bridjs,sdl_expt, EyeLink, GazeException){
            
    var log = log4js.getLogger("simple"), eyelinkCore = new core_expt(), 
    displayInfo = new core_expt.DISPLAYINFO(), eyelinkSDL = new sdl_expt(), 
    eyelink = new EyeLink(), strBuffer = new Buffer(256), hookFunctions = new core_expt.HOOKFCNS2(), 
    coordsStrArray, i;
    
    bridjs.fill(hookFunctions,0);
    
    hookFunctions.major = 1;
    hookFunctions.minor = 0;
    
    hookFunctions.setup_cal_display_hook = bridjs.newCallback(bridjs.defineFunction("INT16  (*setup_cal_display_hook)(void *userData)"),function(userData){
        log.info("setup_cal_display_hook");
        
        return 0;
    });
    
    hookFunctions.exit_cal_display_hook = bridjs.newCallback(bridjs.defineFunction("INT16  (*exit_cal_display_hook)(void *userData)"),function(userData){
        log.info("exit_cal_display_hook");
        
        return 0;
    });
    
    hookFunctions.clear_cal_display_hook = bridjs.newCallback(bridjs.defineFunction("INT16  (*clear_cal_display_hook)(void *userData)"),function(userData){
        log.info("clear_cal_display_hook");
        
        return 0;
    });
    
    hookFunctions.erase_cal_target_hook = bridjs.newCallback(bridjs.defineFunction("INT16  (*erase_cal_target_hook)(void *userData)"),function(userData){
        log.info("erase_cal_target_hook");
        
        return 0;
    });
    
    hookFunctions.play_target_beep_hook= bridjs.newCallback(bridjs.defineFunction("INT16  (*play_target_beep_hook)(void *userData, int beepType)"),function(userData, beepType){
        log.info("play_target_beep_hook: ", beepType);
        
        return 0;
    });
    
    hookFunctions.draw_cal_target_hook = bridjs.newCallback(bridjs.defineFunction("INT16   (*draw_cal_target_hook)(void *userData,float x, float y)"),function(userData, x, y){
        log.info("draw_cal_target_hook: ", x, ' ,',y);
        
        return 0;
    });
    
    //eyelinkCore.setEyelinkAddress("100.1.1.1");
    //log.info(eyelinkCore.openEyelinkConnection(0))
    if(!eyelinkCore.openEyelinkConnection(0)){
        var ret;
        
        log.info("Success to open connection");
        
        log.info("Connected: ",eyelink.isConnected());
    
        eyelinkSDL.getDisplayInformation(bridjs.byPointer(displayInfo));

        log.info("width: ", displayInfo.width, "height: ", displayInfo.height);

        log.info("Start test");
        
        ret = eyelink.getTrackerVersion(strBuffer);
        
        if(ret!==3){
            throw new GazeException("Invalid tracker version: ", ret);
        }
        
        log.info("Tracker version: ",bridjs.toString(strBuffer));
        
        eyelinkCore.setupGraphicHookFunctionsV2(bridjs.byPointer(hookFunctions));
        
        //hookFunctions.setup_cal_display_hook = null;
        
        //eyelinkCore.getAllHookFunctionsV2(bridjs.byPointer(hookFunctions));
        
        //log.info(hookFunctions.setup_cal_display_hook);
        
        eyelink.readRequest("screen_pixel_coords");
        eyelink.msecDelay(500);
        eyelink.readReply(strBuffer);
        
        log.info("Tracker coords reply: ",bridjs.toString(strBuffer));
        
        coordsStrArray = bridjs.toString(strBuffer).split(',');
        
        for(i=0;i<coordsStrArray.length;++i){
            coordsStrArray[i] = parseFloat(coordsStrArray[i]);
        }
        
        log.info("Tracker coords: ",coordsStrArray);
        
        log.info("Start setup");
        bridjs.async(eyelinkCore).doTrackerSetup(function(){
            log.info("End setup");
            
            log.info("End test");
            setTimeout(function(){
                eyelinkCore.closeEyelinkConnection();
                process.exit();
            },0);
            
        });
    }else{
        log.info("Fail to open connection");
        process.exit();
    }/* abort if we can't open link */
    
    
    
    
});


