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
 *     * Neither the name of Jia-Han Su nor the
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
        CallbackTypes = require("./callback_types"), library;

if(process.arch==="x64"){
    library = "TobiiGazeCore64";
}else{
    library = "TobiiGazeCore32";
}

module.exports = bridjs.defineModule({
        /**
     * Creates an eye tracker instance.
     * @param url           An url identifying the eye tracker. Currently only the tet-tcp protocol is defined. Example: "tet-tcp://172.68.195.1".
     * @return              An eye tracker instance, or NULL if creation failed.
     * @param error_code    Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     */
    create:bridjs.defineFunction(bridjs.byPointer(DataTypes.EyeTracker), bridjs.byPointer(bridjs.NativeValue.char), Signature.POINTER_TYPE).bind("tobiigaze_create"),
    //TOBIIGAZE_API tobiigaze_eye_tracker* TOBIIGAZE_CALL tobiigaze_create(const char *url, tobiigaze_error_code *error_code);

    /**
     * Destroys an eye tracker instance. Must NOT be called from a callback.
     * @param eye_tracker   An eye tracker instance.
     * @param error_code    Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     */
    destroy:bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.EyeTracker)).bind("tobiigaze_destroy"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_destroy(tobiigaze_eye_tracker *eye_tracker);

    /**
    * Registers a callback that will return an error code when a spontaneous error occurs (an error not directly associated with a command). Most likely
     * this error is related to problems with the eye tracker communication and is unrecoverable.
     * @param eye_tracker   An eye tracker instance.
     * @param callback      A callback function that will be called on command completion.
     * @param user_data     Optional user supplied data that will be passed unmodified to the callback function. Can be NULL.
     */
    registerError:bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.EyeTracker), CallbackTypes.AsyncCallback,  Signature.POINTER_TYPE).
            bind("tobiigaze_register_error_callback"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_register_error_callback(tobiigaze_eye_tracker *eye_tracker, tobiigaze_async_callback callback, void *user_data);

    /**
     * Gets the version of the library.
     * @return   The version of the library on the form "1.0.2".
     */
    getVersion:bridjs.defineFunction(Signature.STRING_TYPE).bind("tobiigaze_get_version"),
    //TOBIIGAZE_API const char* TOBIIGAZE_CALL tobiigaze_get_version();

    /**
     * Sets the logging output filename and verbosity.
     * @param filename              The filename of the logfile.
     * @param log_level             The verbosity of the logging.
     * @return                      TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise an error code.
     */
    setLogging:bridjs.defineFunction(Signature.VOID_TYPE, Signature.STRING_TYPE, Signature.UINT32_TYPE, bridjs.byPointer(bridjs.NativeValue.uint32)).
            bind("tobiigaze_set_logging"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_set_logging(const char *filename, tobiigaze_log_level log_level, tobiigaze_error_code *error_code);

    /**
     * Connects to an eye tracker asynchronously.
     * @param eye_tracker   An eye tracker instance.
     * @param callback      A callback function that will be called on command completion.
     * @param user_data     Optional user supplied data that will be passed unmodified to the callback function. Can be NULL.
     */
    connectAsync:bridjs.defineFunction(Signature.VOID_TYPE,bridjs.byPointer( DataTypes.EyeTracker), CallbackTypes.AsyncCallback, Signature.POINTER_TYPE).
            bind("tobiigaze_connect_async"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_connect_async(tobiigaze_eye_tracker *eye_tracker, tobiigaze_async_callback callback, void *user_data);

    /**
     * Connects to an eye tracker synchronously.
     * @param eye_tracker   An eye tracker instance.
     * @param error_code    Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     */
    connect:bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.EyeTracker),  bridjs.byPointer(bridjs.NativeValue.uint32)).bind("tobiigaze_connect"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_connect(tobiigaze_eye_tracker *eye_tracker, tobiigaze_error_code *error_code);

    /**
     * Disonnects from an eye tracker asynchronously.
     * @param eye_tracker   An eye tracker instance.
     * @param callback      A callback function that will be called on command completion.
     * @param user_data     Optional user supplied data that will be passed unmodified to the callback function. Can be NULL.
     */
    disconnectAsync:bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.EyeTracker), CallbackTypes.AsyncCallback, Signature.POINTER_TYPE).
            bind("tobiigaze_disconnect_async"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_disconnect_async(tobiigaze_eye_tracker *eye_tracker, tobiigaze_async_basic_callback callback, void *user_data);

    /**
     * Disconnects from an eye tracker synchronously.
     * @param eye_tracker   An eye tracker instance.
     */
     disconnect:bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.EyeTracker)).bind("tobiigaze_disconnect"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_disconnect(tobiigaze_eye_tracker *eye_tracker);

    /**
     * Runs the event loop. This is a blocking call and must be called on a dedicated thread.
     * @param eye_tracker   An eye tracker instance.
     * @param error_code    Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     */
    runEventLoop:bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.EyeTracker), 
    bridjs.byPointer(bridjs.NativeValue.uint32)).bind("tobiigaze_run_event_loop"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_run_event_loop(tobiigaze_eye_tracker *eye_tracker, tobiigaze_error_code *error_code);

    /**
     * Breaks the event loop. This will make the blocking tobiigaze_run_event_loop call return. Must NOT be called from a callback.
     * @param eye_tracker   An eye tracker instance.
     */
    breakEventLoop:bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.EyeTracker)).bind("tobiigaze_break_event_loop"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_break_event_loop(tobiigaze_eye_tracker *eye_tracker);

    /**
     * Starts gaze tracking asynchronously.
     * @param eye_tracker     An eye tracker instance.
     * @param callback        A callback function that will be called on command completion (note that this is not the callback that will provide the actual gaze data).
     * @param gaze_callback   A callback function that will be called asynchronously when gaze data is available.
     * @param user_data       Optional user supplied data that will be passed unmodified to the callback function. Can be NULL.
     */
    startTrackingAsync:bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.EyeTracker), 
        CallbackTypes.AsyncCallback, CallbackTypes.Listener, Signature.POINTER_TYPE).bind("tobiigaze_start_tracking_async"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_start_tracking_async(tobiigaze_eye_tracker *eye_tracker, tobiigaze_async_callback callback, tobiigaze_gaze_listener gaze_callback, void *user_data);

    /**
     * Starts gaze tracking synchronously.
     * @param eye_tracker    An eye tracker instance.
     * @param gaze_callback  A callback function that will be called asynchronously when gaze data is available.
     * @param error_code     Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     * @param user_data      Optional user supplied data that will be passed unmodified to the callback function. Can be NULL.
     */
    startTracking:bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.EyeTracker), 
        CallbackTypes.Listener, bridjs.byPointer(bridjs.NativeValue.uint32), Signature.POINTER_TYPE).bind("tobiigaze_start_tracking"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_start_tracking(tobiigaze_eye_tracker *eye_tracker, tobiigaze_gaze_listener gaze_callback, tobiigaze_error_code *error_code, void *user_data);

    /**
     * Stops gaze tracking asynchronously.
     * @param eye_tracker   An eye tracker instance.
     * @param callback      A callback function that will be called on command completion.
     * @param user_data     Optional user supplied data that will be passed unmodified to the callback function. Can be NULL.
     */
    stopTrackingAsync:bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.EyeTracker),  
        CallbackTypes.AsyncCallback, Signature.POINTER_TYPE).bind("tobiigaze_stop_tracking_async"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_stop_tracking_async(tobiigaze_eye_tracker *eye_tracker, tobiigaze_async_callback callback, void *user_data);

    /**
     * Stops gaze tracking synchronously.
     * @param eye_tracker   An eye tracker instance.
     * @param error_code    Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     */
     stopTracking:bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.EyeTracker), 
        bridjs.byPointer(bridjs.NativeValue.uint32)).bind("tobiigaze_stop_tracking"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_stop_tracking(tobiigaze_eye_tracker *eye_tracker, tobiigaze_error_code *error_code);

    /**
     * Gets the device info, such as platform, versions etc, asynchronously.
     * @param eye_tracker   An eye tracker instance.
     * @param callback      A callback function that will be called on command completion.
     * @param user_data     Optional user supplied data that will be passed unmodified to the callback function. Can be NULL.
     */
    getDeviceInfoAsync:bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.EyeTracker), 
        CallbackTypes.AsyncDeviceInfoCallback, Signature.POINTER_TYPE).bind("tobiigaze_get_device_info_async"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_get_device_info_async(tobiigaze_eye_tracker *eye_tracker, tobiigaze_async_device_info_callback callback, void *user_data);

    /**
     * Gets the device info, such as platform, versions etc, synchronously.
     * @param eye_tracker   An eye tracker instance.
     * @param device_info   Device information out parameter.
     * @param error_code    Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     */
    getDeviceInfo:bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.EyeTracker), 
        bridjs.byPointer(DataTypes.DeviceInfo), bridjs.byPointer(bridjs.NativeValue.uint32)).bind("tobiigaze_get_device_info"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_get_device_info(tobiigaze_eye_tracker *eye_tracker, struct tobiigaze_device_info *device_info, tobiigaze_error_code *error_code);

    /**
     * Gets the track box asynchronously.
     * @param eye_tracker   An eye tracker instance.
     * @param callback      A callback function that will be called on command completion.
     * @param user_data     Optional user supplied data that will be passed unmodified to the callback function. Can be NULL.
     */
    getTrackBoxAsync:bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.EyeTracker),
        CallbackTypes.AsyncTrackboxCallback, Signature.POINTER_TYPE).bind("tobiigaze_get_track_box_async"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_get_track_box_async(tobiigaze_eye_tracker *eye_tracker, tobiigaze_async_trackbox_callback callback, void *user_data);

    /**
     * Gets the track box synchronously.
     * @param eye_tracker   An eye tracker instance.
     * @param track_box     Track box information out parameter.
     * @param error_code    Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     */
    getTrackBox:bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.EyeTracker), 
        bridjs.byPointer(DataTypes.TrackBox), bridjs.byPointer(bridjs.NativeValue.uint32)).bind("tobiigaze_get_track_box"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_get_track_box(tobiigaze_eye_tracker *eye_tracker, struct tobiigaze_track_box *track_box, tobiigaze_error_code *error_code);

    /**
     * Registers a callback providing a key for unlocking the eye tracker. The Tobii Gaze Core library unlocks developer edition
     * eye trackers automatically; this function can be used to unlock other eye trackers. Registering a key provider disables the built-in default key.
     * @param eye_tracker   An eye tracker instance.
     * @param callback      A callback function that will be called on command completion.
     * @param error_code    Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     */
    registerKeyProvider:bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.EyeTracker), 
        CallbackTypes.KeyProviderCallback, bridjs.byPointer(bridjs.NativeValue.uint32)).bind("tobiigaze_register_key_provider"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_register_key_provider(tobiigaze_eye_tracker *eye_tracker, tobiigaze_key_provider_callback callback, tobiigaze_error_code *error_code);

    /**
     * Returns the meaning of an error code.
     * @param error_code    An error code returned from TobiiGazeCore or TobiiGazeConfig.
     */
    getErrorMessage:bridjs.defineFunction(Signature.STRING_TYPE, Signature.UINT32_TYPE).bind("tobiigaze_get_error_message"),
    //TOBIIGAZE_API const char* TOBIIGAZE_CALL tobiigaze_get_error_message(tobiigaze_error_code error_code);
    
         /**
     * Collects information about all usb eye trackers currently connected to the machine.
     * @param device_infos          A pre-allocated array that will contain device information about the eye trackers.
     * @param device_infos_cap      The capacity of the device_infos array.
     * @param device_infos_size     The number of eye trackers found.
     * @param error_code            Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
     */
    listUsbEyeTrackers: bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.UsbDeviceInfo), Signature.UINT32_TYPE
    , bridjs.byPointer(bridjs.NativeValue.uint32), bridjs.byPointer(bridjs.NativeValue.uint32)).bind("tobiigaze_list_usb_eye_trackers"),
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_list_usb_eye_trackers(struct usb_device_info *device_infos, uint32_t device_infos_cap, uint32_t *device_infos_size, tobiigaze_error_code *error_code);
    /**
    * Gets the url to a connected eye tracker. If mutliple eye trackers are connected, an arbitary eye tracker will be returned.
    * @param url          Buffer where the url will be written to.
    * @param url_size     Size of the buffer in bytes.
    * @param error_code   Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
    */
   getConnectedEyeTracker:bridjs.defineFunction(Signature.VOID_TYPE,
        bridjs.byPointer(bridjs.NativeValue.char), Signature.UINT32_TYPE, bridjs.byPointer(bridjs.NativeValue.uint32)).bind("tobiigaze_get_connected_eye_tracker")
    //TOBIIGAZE_API void TOBIIGAZE_CALL tobiigaze_get_connected_eye_tracker(char *url, uint32_t url_size, tobiigaze_error_code *error_code);
}, library);


