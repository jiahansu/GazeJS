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
        Signature = bridjs.Signature,
        DataTypes = require("./data_types"), 
        ErrorCodes = require("./error_codes"),
        CallbackTypes = require("./callback_types"), ConfigAsyncCallback, library;

if(process.arch==="x64"){
    library = "TobiiGazeConfig64";
}else{
    library = "TobiiGazeConfig32";
}

module.exports = bridjs.defineModule({
    MAX_EYE_TRACKER_URL_LENGTH:256,
    MAX_USER_PROFILE_LENGTH:256,
    /**
     * Load the required components and inits the interface. This must be the very first call to TobiiGazeConfig.
     * @param error_code   Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     */
    init:bridjs.defineFunction(Signature.VOID_TYPE,bridjs.byPointer(bridjs.NativeValue.uint32)).bind("tobiigaze_config_init"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_config_init(tobiigaze_error_code *error_code);
    
    /**
     * Frees loaded components.
     */
    free:bridjs.defineFunction(Signature.VOID_TYPE).bind("tobiigaze_config_free"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_config_free();
    
    /**
     * Validates the system eye tracking configuration.
     * @param error_code   Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     */
    validate:bridjs.defineFunction(Signature.VOID_TYPE,bridjs.byPointer(bridjs.NativeValue.uint32)).bind("tobiigaze_config_validate"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_config_validate(tobiigaze_error_code *error_code);
    
    /**
     * Gets the url for the default system eye tracker.
     * @param url          Buffer where the url will be written to.
     * @param url_size     Size of the buffer in bytes.
     * @param error_code   Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     */
    getDefaultEyeTrackerUrl: bridjs.defineFunction(Signature.VOID_TYPE,
        bridjs.byPointer(bridjs.NativeValue.char), Signature.UINT32_TYPE, bridjs.byPointer(bridjs.NativeValue.uint32)).bind("tobiigaze_config_get_default_eye_tracker_url"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_config_get_default_eye_tracker_url(char *url, uint32_t url_size, tobiigaze_error_code *error_code);
    
        /**
     * Gets the name of the current user profile.
     * @param user_profile        Buffer where the user profile name will be written to.
     * @param user_profile_size   Size of the buffer in bytes.
     * @param error_code          Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     */
    getCurrentUserProfile: bridjs.defineFunction(Signature.VOID_TYPE,
        bridjs.byPointer(bridjs.NativeValue.char), Signature.UINT32_TYPE, bridjs.byPointer(bridjs.NativeValue.uint32)).bind("tobiigaze_config_get_current_user_profile"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_config_get_current_user_profile(char *user_profile, uint32_t user_profile_size, tobiigaze_error_code *error_code);
    
    /**
     * Prepares the eye tracker according to the system eye tracking configuration asynchronously.
     * @param url            An url identifying the system eye tracker. Needed as eye tracker pointer itself contains no information about url.
     * @param eye_tracker    An eye tracker instance.
     * @param user_profile   A user profile.
     * @param callback       A callback function that will be called on command completion.
     * @param user_data      Optional user supplied data that will be passed unmodified to the callback function. Can be NULL.
     */
    prepareEyeTrackerAsync: bridjs.defineFunction(Signature.VOID_TYPE,
        Signature.STRING_TYPE,Signature.STRING_TYPE, bridjs.byPointer(DataTypes.EyeTracker),
        CallbackTypes.AsyncCallback, Signature.POINTER_TYPE).bind("tobiigaze_config_prepare_eye_tracker_async"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_config_prepare_eye_tracker_async(const char *url, const char *user_profile, tobiigaze_eye_tracker *eye_tracker, tobiigaze_config_async_callback callback, void *user_data);
    
     /**
     * Prepares the eye tracker according to the system eye tracking configuration synchronously.
     * @param url            An url identifying the system eye tracker. Needed as eye tracker pointer itself contains no information about url.
     * @param eye_tracker    An eye tracker instance.
     * @param user_profile   A user profile.
     * @param error_code     Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     */
    prepareEyeTracker: bridjs.defineFunction(Signature.VOID_TYPE,
        Signature.STRING_TYPE,Signature.STRING_TYPE, bridjs.byPointer(DataTypes.EyeTracker),
        bridjs.byPointer(bridjs.NativeValue.uint32)).bind("tobiigaze_config_prepare_eye_tracker"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_config_prepare_eye_tracker(const char *url, const char *user_profile, tobiigaze_eye_tracker *eye_tracker, tobiigaze_error_code *error_code);
    
     /**
     * Launches the control panel for eye tracking in a separate process.
     * @param error_code   Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     */
    launchControlPanel:bridjs.defineFunction(Signature.VOID_TYPE,
        bridjs.byPointer(bridjs.NativeValue.uint32)).bind("tobiigaze_config_launch_control_panel"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_config_launch_control_panel(tobiigaze_error_code *error_code);
    
        /**
     * Gets the bounds of the screen on which an eye tracker is mounted, in pixels, measured from the top left corner of the primary screen.
     * (In a multi-monitor setup, all the monitors are combined into a single virtual screen.)
     * @param url           An url identifying the system eye tracker.
     * @param bounds        Will receive the screen bounds in pixels.
     * @param error_code    Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     */
    getScreenBoundsPixels:bridjs.defineFunction(Signature.VOID_TYPE,
        bridjs.byPointer(bridjs.NativeValue.char),bridjs.byPointer(DataTypes.Rect),bridjs.byPointer(bridjs.NativeValue.uint32)).bind("tobiigaze_config_get_screen_bounds_pixels"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_config_get_screen_bounds_pixels(const char *url, struct tobiigaze_rect *bounds, tobiigaze_error_code *error_code);
     /**
     * Gets the display area in millimeters.
     * @param url            An url identifying the system eye tracker.
     * @param configuration  Will receive the display area.
     * @param error_code     Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     */
    getDisplayArea:bridjs.defineFunction(Signature.VOID_TYPE,bridjs.byPointer(bridjs.NativeValue.char),
        bridjs.byPointer(DataTypes.DisplayArea),bridjs.byPointer(bridjs.NativeValue.uint32)).bind("tobiigaze_config_get_display_area"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_config_get_display_area(const char *url, struct tobiigaze_display_area *display_area, tobiigaze_error_code *error_code);
    
     /**
     * Gets the eye(s) to be tracked according to the current user profile.
     * @param user_profile   A user profile.
     * @param tracked_eyes   Will receive the eye(s) to be tracked.
     * @param error_code     Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     */
    getTrackedEyes:bridjs.defineFunction(Signature.VOID_TYPE,bridjs.byPointer(bridjs.NativeValue.char),
        bridjs.byPointer(bridjs.NativeValue.uint32),bridjs.byPointer(bridjs.NativeValue.uint32)).bind("tobiigaze_config_get_tracked_eyes"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_config_get_tracked_eyes(const char *user_profile, tobiigaze_tracked_eyes *tracked_eyes, tobiigaze_error_code *error_code);
    
     /**
     * Sets the logging output filename and verbosity.
     * @param filename            The filename of the logfile.
     * @param log_level           The verbosity of the logging.
     * @param error_code          Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     */
    setLogging:bridjs.defineFunction(Signature.VOID_TYPE,Signature.STRING_TYPE,
        Signature.UINT32_TYPE,bridjs.byPointer(bridjs.NativeValue.uint32)).bind("tobiigaze_config_set_logging"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_config_set_logging(const char *filename, tobiigaze_log_level log_level, tobiigaze_error_code *error_code);
    
    /**
     * Gets the version of the library.
     * @return   The version of the library on the form "1.0.2".
     */
    getVersion:bridjs.defineFunction(Signature.STRING_TYPE).bind("tobiigaze_config_get_version")
    //TOBIIGAZE_API const char* TOBIIGAZE_CALL tobiigaze_config_get_version();
},library);

ConfigAsyncCallback = bridjs.defineFunction(Signature.VOID_TYPE,Signature.UINT32_TYPE, Signature.POINTER_TYPE);

module.exports.TrackedEyes = my.Class({
    STATIC:{
        BOTH_EYES:0,
        LEFT_EYE_ONLY:1,
        RIGHT_EYE_ONLY:2
    }
});

module.exports.ConfigAsyncCallback = ConfigAsyncCallback;
