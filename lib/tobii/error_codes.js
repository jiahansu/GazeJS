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
var my = require("myclass");

module.exports = my.Class({
    STATIC: {
        // Success
        SUCCESS: 0,
        // Generic errors
        UNKNOWN: 1,
        OUT_OF_MEMORY: 2,
        BUFFER_TOO_SMALL: 3,
        // Sync function errors
        TIMEOUT: 100,
        OPERATION_ABORTED: 101,
        // Transport errors
        INVALID_URL: 200,
        ENDPOINT_NAME_LOOKUP_FAILED: 201,
        ENDPOINT_CONNECT_FAILED: 202,
        DEVICE_COMMUNICATION_ERROR: 203,
        // Protocol errors
        PROTOCOL_DECODING_ERROR: 300,
        // Config errors
        CONFIG_NOT_INITIALIZED: 400,
        CONFIG_TOBII_EYE_TRACKING_NOT_AVAILABLE: 401,
        CONFIG_TOBII_EYE_TRACKING_INCOMPATIBLE: 402,
        CONFIG_INCOMPLETE: 403,
        CONFIG_INVALID: 404,
        // Errors from eye tracker firmware
        FW_ERROR_UNKNOWN_OPERATION: 0x20000500,
        FW_ERROR_UNSUPPORTED_OPERATION: 0x20000501,
        FW_ERROR_OPERATION_FAILED: 0x20000502,
        FW_ERROR_INVALID_PAYLOAD: 0x20000503,
        FW_ERROR_UNKNOWN_ID: 0x20000504,
        FW_ERROR_UNAUTHORIZED: 0x20000505,
        FW_ERROR_EXTENSION_REQUIRED: 0x20000506,
        FW_ERROR_INTERNAL_ERROR: 0x20000507,
        FW_ERROR_STATE_ERROR: 0x20000508,
        FW_ERROR_INVALID_PARAMETER: 0x20000509,
        FW_ERROR_OPERATION_ABORTED: 0x2000050A
    }
});


