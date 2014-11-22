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
        Signature = bridjs.dc.Signature, DataTypes = require("./data_types");

module.exports = my.Class({
    STATIC: {
        /**
         * This type is used for the callback function that is registered with tobiigaze_add_gaze_data_listener. The callback function will be called when gaze
         * data is received from the eye tracker.
         * @param gaze_data     The received Gaze Data.
         * @param error_code    Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
         * @param user_data     Optional user supplied data that will be passed unmodified to the callback function. Can be NULL.
         */
        Listener: bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.GazeData),
                                        Signature.POINTER_TYPE/*bridjs.byPointer(DataTypes.GazeDataExtensions)*/, 
                                        Signature.POINTER_TYPE),
        //typedef void (TOBIIGAZE_CALL *tobiigaze_gaze_listener)(const struct tobiigaze_gaze_data *gaze_data, void *user_data);

        /**
         * This type is used for callback functions that are registered with several asynchronous commands that do not have any return data.
         * The callback function will be called when the command is completed.
         * @param error_code    Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
         * @param user_data     Optional user supplied data that will be passed unmodified to the callback function. Can be NULL.
         */
        AsyncCallback: bridjs.defineFunction(Signature.VOID_TYPE, Signature.UINT32_TYPE, Signature.POINTER_TYPE),
        //typedef void (TOBIIGAZE_CALL *tobiigaze_async_callback)(tobiigaze_error_code error_code, void *user_data);

        /**
         * This type is used for callback functions that are registered with several asynchronous commands that do not have any return data or an error code.
         * The callback function will be called when the command is completed.
         * @param user_data     Optional user supplied data that will be passed unmodified to the callback function. Can be NULL.
         */
        AsyncBasicCallback: bridjs.defineFunction(Signature.VOID_TYPE, Signature.POINTER_TYPE),
        //typedef void (TOBIIGAZE_CALL *tobiigaze_async_basic_callback)(void *user_data);

        /**
         * This type is used for the callback function that is registered with tobiigaze_get_display_area_async. The callback function will be called
         * when the command is completed.
         * @param display_area  The retrieved Display Area.
         * @param error_code    Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
         * @param user_data     Optional user supplied data that will be passed unmodified to the callback function. Can be NULL.
         */
        DisplayAreaCallback: bridjs.defineFunction(Signature.VOID_TYPE, Signature.POINTER_TYPE, Signature.UINT32_TYPE, Signature.POINTER_TYPE),
        //typedef void (TOBIIGAZE_CALL *tobiigaze_async_display_area_callback)(const struct tobiigaze_display_area *display_area, tobiigaze_error_code error_code, void *user_data);

        /**
         * This type is used for the callback function that is registered with tobiigaze_get_device_info_async. The callback function will be called
         * when the command is completed.
         * @param device_info   The retrieved device info.
         * @param error_code    Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
         * @param user_data     Optional user supplied data that will be passed unmodified to the callback function. Can be NULL.
         */
        AsyncDeviceInfoCallback: bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.DeviceInfo), Signature.UINT32_TYPE, Signature.POINTER_TYPE),
        //typedef void (TOBIIGAZE_CALL *tobiigaze_async_device_info_callback)(const struct tobiigaze_device_info *device_info, tobiigaze_error_code error_code, void *user_data);

        /**
         * This type is used for the callback function that is registered with tobiigaze_get_track_box_async. The callback function will be called
         * when the command is completed.
         * @param track_box     The retrieved Track Box.
         * @param error_code    Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
         * @param user_data     Optional user supplied data that will be passed unmodified to the callback function. Can be NULL.
         */
        AsyncTrackboxCallback: bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.TrackBox), Signature.UINT32_TYPE, Signature.POINTER_TYPE),
        //typedef void (TOBIIGAZE_CALL *tobiigaze_async_trackbox_callback)(const struct tobiigaze_track_box *track_box, tobiigaze_error_code error_code, void *user_data);

        /**
         * This type is used for the callback function that is registered with tobiigaze_get_calibration_async. The callback function will be called
         * when the command is completed.
         * @param calibration   The retrieved Calibration.
         * @param error_code    Will be set to TOBIIGAZE_ERROR_SUCCESS if operation was successful, otherwise to an error code. Can be NULL.
         * @param user_data     Optional user supplied data that will be passed unmodified to the callback function. Can be NULL.
         */
        AsyncCalibrationCallback: bridjs.defineFunction(Signature.VOID_TYPE, bridjs.byPointer(DataTypes.Calibration), Signature.UINT32_TYPE, Signature.POINTER_TYPE),
        //typedef void (TOBIIGAZE_CALL *tobiigaze_async_calibration_callback)(const struct tobiigaze_calibration *calibration, tobiigaze_error_code error_code, void *user_data);

        /**
         * This type is used for the callback function that is registered with tobiigaze_register_key_provider. The callback function will be called
         * when an eye tracker is to be unlocked.
         * @param realm_id      The realm of the eye tracker to provide the key for.
         * @param key           The key to use for unlocking the eye tracker.
         */
        KeyProviderCallback: bridjs.defineFunction(Signature.VOID_TYPE, Signature.UINT32_TYPE, bridjs.byPointer(DataTypes.Key))
                //typedef void (TOBIIGAZE_CALL *tobiigaze_key_provider_callback)(uint32_t realm_id, struct tobiigaze_key *key);
    }
});