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
define(["myclass","log4js", "../gaze_exception"], function(my, log4js, GazeException){
    
    
    var exports = my.Class({
        STATIC:{
            LIBRARY: "eyelink_core64.dll",
            GRAPHICS_LIBRARY: "eyelink_core_graphics64.dll"
        }
    });
    
    if(process.platform==="win32"){
        if(process.arch==="x86"){
            exports.LIBRARY = "eyelink_core.dll";
            exports.GRAPHICS_LIBRARY = "eyelink_core_graphics.dll";
        }else{
            exports.LIBRARY = "eyelink_core64.dll";
            exports.GRAPHICS_LIBRARY = "eyelink_core_graphics64.dll";
        }
    }else if(process.platform==="darwin"){
        exports.LIBRARY = "/Library/Frameworks/eyelink_core.framework/Versions/Current/eyelink_core";
        exports.GRAPHICS_LIBRARY = "/Library/Frameworks/eyelink_core_graphics.framework/Versions/Current/eyelink_core_graphics";
    }else if(process.platform==="linux"){
        exports.LIBRARY = "libeyelink_core.so";
        exports.GRAPHICS_LIBRARY = "libeyelink_core_graphics.so";
    }else{
        return new GazeException("Unsupported platform/arch: "+process.platform+'_'+process.arch);
    }
    
    return exports;
});
