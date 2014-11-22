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
        Signature = bridjs.dc.Signature;

/**
 * This enum hold the different log levels.
 */
module.exports = my.Class({
});

module.exports.EyeTracker = bridjs.Signature.POINTER_TYPE;

/**
 * This enum hold the different log levels.
 */
module.exports.LogLevel = my.Class({
    STATIC: {
        OFF: 0,
        DEBUG: 1,
        INFO: 2,
        WARNING: 3,
        ERROR: 4
    }
});

/**
 * This enum hold various tobiigaze constants.
 */
module.exports.Constants = my.Class({
    STATIC: {
        DEVICE_INFO_MAX_SERIAL_NUMBER_LENGTH: 128,
        DEVICE_INFO_MAX_MODEL_LENGTH: 64,
        DEVICE_INFO_MAX_GENERATION_LENGTH: 64,
        DEVICE_INFO_MAX_FIRMWARE_LENGTH: 128,
        CALIBRATION_DATA_CAPACITY: 4 * 1024 * 1024,
        KEY_SIZE: 32,
        MAX_CALIBRATION_POINT_DATA_ITEMS: 512,
        USB_DEVICE_INFO_MAX_SIZE: 128,
        USB_DEVICE_ADDRESS_MAX_SIZE: 138,
        USB_MAX_DEVICES: 9,
        MAX_GAZE_DATA_EXTENSION_LENGTH:256,
        MAX_GAZE_DATA_EXTENSIONS: 32,
        MAX_CONFIG_KEY_LENGTH : 128
    }
});

/**
 * This enum hold the possible gaze tracking statuses.
 */
module.exports.Status = my.Class({
    STATIC: {
        TRACKING_STATUS_NO_EYES_TRACKED: 0,
        TRACKING_STATUS_BOTH_EYES_TRACKED: 1,
        TRACKING_STATUS_ONLY_LEFT_EYE_TRACKED: 2,
        TRACKING_STATUS_ONE_EYE_TRACKED_PROBABLY_LEFT: 3,
        TRACKING_STATUS_ONE_EYE_TRACKED_UNKNOWN_WHICH: 4,
        TRACKING_STATUS_ONE_EYE_TRACKED_PROBABLY_RIGHT: 5,
        TRACKING_STATUS_ONLY_RIGHT_EYE_TRACKED: 6
    }
});

/**
 * This enum hold the possible calibration point statuses.
 */
module.exports.PointStatus = my.Class({
    STATIC: {
        CALIBRATION_POINT_STATUS_FAILED_OR_INVALID: -1,
        CALIBRATION_POINT_STATUS_VALID_BUT_NOT_USED_IN_CALIBRATION: 0,
        CALIBRATION_POINT_STATUS_VALID_AND_USED_IN_CALIBRATION: 1
    }
});

/**
 * This struct holds Device Info that is fetched from the Eye Tracker. The char arrays holds null
 * terminated strings.
 * @field serial_number The serial number of the eye tracker.
 * @field model The eye tracker model, e.g. "REX_DEV_Laptop".
 * @field generation The eye tracker generation, e.g. G5.
 * @field firmware_version The eye tracker firmware version.
 */
module.exports.DeviceInfo = bridjs.defineStruct({
    serialNumber : bridjs.structArrayField(Signature.CHAR_TYPE,module.exports.Constants.DEVICE_INFO_MAX_SERIAL_NUMBER_LENGTH,0),//char serial_number[TOBIIGAZE_DEVICE_INFO_MAX_SERIAL_NUMBER_LENGTH];
    model : bridjs.structArrayField(Signature.CHAR_TYPE,module.exports.Constants.DEVICE_INFO_MAX_MODEL_LENGTH,1),//char model[TOBIIGAZE_DEVICE_INFO_MAX_MODEL_LENGTH];
    generation : bridjs.structArrayField(Signature.CHAR_TYPE,module.exports.Constants.DEVICE_INFO_MAX_GENERATION_LENGTH,2),//char generation[TOBIIGAZE_DEVICE_INFO_MAX_GENERATION_LENGTH];
    firmwareVersion : bridjs.structArrayField(Signature.CHAR_TYPE,module.exports.Constants.DEVICE_INFO_MAX_FIRMWARE_LENGTH,3)//char firmware_version[TOBIIGAZE_DEVICE_INFO_MAX_FIRMWARE_LENGTH];
});

/**
 * This struct holds eye tracker Calibration Data that is fetched from or sent to the Eye Tracker. The data array holds null
 * terminated strings.
 * @field data The calibration data.
 * @field actual_size The length of the calibration data.
 */

module.exports.Calibration = bridjs.defineStruct({
    data : bridjs.structArrayField(Signature.UINT8_TYPE,module.exports.Constants.CALIBRATION_DATA_CAPACITY,0),//uint8_t data[TOBIIGAZE_CALIBRATION_DATA_CAPACITY];
    actualSize : bridjs.structField(Signature.UINT32_TYPE,1)//uint32_t actual_size;
});

/**
 * This struct holds a two dimensional point.
 * @field x X coordinate.
 * @field y Y coordinate.
 */
module.exports.Point2d = bridjs.defineStruct({
    x : bridjs.structField(Signature.DOUBLE_TYPE,0),//double x;
    y : bridjs.structField(Signature.DOUBLE_TYPE,1)//double y;
});

/**
 * This struct holds a two dimensional point.
 * @field x X coordinate.
 * @field y Y coordinate.
 */
module.exports.Point2f = bridjs.defineStruct({
    x : bridjs.structField(Signature.FLOAT_TYPE,0),//double x;
    y : bridjs.structField(Signature.FLOAT_TYPE,1)//double y;
});

/**
 * This struct holds a three dimensional point.
 * @field x X coordinate.
 * @field y Y coordinate.
 * @field z Z coordinate.
 */
module.exports.Point3d = bridjs.defineStruct({
    x : bridjs.structField(Signature.DOUBLE_TYPE,0),//double x;
    y : bridjs.structField(Signature.DOUBLE_TYPE,1),//double y;
    z : bridjs.structField(Signature.DOUBLE_TYPE,2)//double y;
});


/**
 * This struct holds a rectangle.
 * @field left Specifies the x-coordinate of the upper-left corner of a rectangle.
 * @field top Specifies the y-coordinate of the upper-left corner of a rectangle.
 * @field right Specifies the x-coordinate of the lower-right corner of a rectangle.
 * @field bottom Specifies the y-coordinate of the lower-right corner of a rectangle.
 */
module.exports.Rect = bridjs.defineStruct({
    left : bridjs.structField(Signature.INT32_TYPE,0),//double x;
    top : bridjs.structField(Signature.INT32_TYPE,1),//double y;
    right : bridjs.structField(Signature.INT32_TYPE,2),//double y;
    bottom : bridjs.structField(Signature.INT32_TYPE,3)//double y;
});

/**
 * This struct holds gaze data for one eye.
 * @field eye_position_from_eye_tracker_mm
 * @field eye_position_in_track_box_normalized
 * @field gaze_point_from_eye_tracker_mm
 * @field gaze_point_on_display_normalized
 */
module.exports.DataEye = bridjs.defineStruct({
    eyePositionFromEyeTrackerMm: bridjs.structField(module.exports.Point3d, 0),
    eyePositionInTrackBoxNormalized: bridjs.structField(module.exports.Point3d, 1),
    gazePointFromEyeTrackerMm: bridjs.structField(module.exports.Point3d, 2),
    gazePointOnDisplayNormalized: bridjs.structField(module.exports.Point2d, 3)
});

/**
 * This struct holds gaze data reveiced from the eye tracker.
 * @field timestamp Timestamp for the gaze data
 * @field tracking_status The combined tracking status for both eyes.
 * @field left Gaze data for the left eye
 * @field right Gaze data for the right eye
 */
module.exports.GazeData = bridjs.defineStruct({
    timestamp : bridjs.structField(Signature.UINT64_TYPE,0),//uint64_t timestamp;
    trackingStatus : bridjs.structField(Signature.UINT32_TYPE,1),//tobiigaze_tracking_status tracking_status;
    left : bridjs.structField(module.exports.DataEye,2),//struct tobiigaze_gaze_data_eye left;
    right : bridjs.structField(module.exports.DataEye,3)//struct tobiigaze_gaze_data_eye right;
});

/**
 * This struct holds a track box.
 * @field front_upper_right_point
 * @field front_upper_left_point
 * @field front_lower_left_point
 * @field front_lower_right_point
 * @field back_upper_right_point
 * @field back_upper_left_point
 * @field back_lower_left_point
 * @field back_lower_right_point
 */
module.exports.TrackBox = bridjs.defineStruct({
    frontUpperRightPoint : bridjs.structField(module.exports.Point3d,0),//struct tobiigaze_point_3d front_upper_right_point;
    frontUpperLeftPoint : bridjs.structField(module.exports.Point3d,1),//struct tobiigaze_point_3d front_upper_left_point;
    frontLowerLeftPoint : bridjs.structField(module.exports.Point3d,2),//struct tobiigaze_point_3d front_lower_left_point;
    frontLowerRightPoint : bridjs.structField(module.exports.Point3d,3),//struct tobiigaze_point_3d front_lower_right_point;
    backUpperRightPoint : bridjs.structField(module.exports.Point3d,4),//struct tobiigaze_point_3d back_upper_right_point;
    backUpperLeftPoint : bridjs.structField(module.exports.Point3d,5),//struct tobiigaze_point_3d back_upper_left_point;
    backLowerLeftPoint : bridjs.structField(module.exports.Point3d,6),//struct tobiigaze_point_3d back_lower_left_point;
    backLowerRightPoint : bridjs.structField(module.exports.Point3d,7)//struct tobiigaze_point_3d back_lower_right_point;
});

/**
 * This struct holds a display area specification.
 * @field top_left
 * @field top_right
 * @field bottom_left
 */
module.exports.DisplayArea = bridjs.defineStruct({
    topLeft : bridjs.structField(module.exports.Point3d,0),//struct tobiigaze_point_3d top_left;
    topRight : bridjs.structField(module.exports.Point3d,1),//struct tobiigaze_point_3d top_right;
    bottomLeft : bridjs.structField(module.exports.Point3d,2) //struct tobiigaze_point_3d bottom_left;
});

/**
 * This struct hold a key for unlocking an eye tracker.
 * @field data  The key.
 */
module.exports.Key = bridjs.defineStruct({
    key : bridjs.structArrayField(Signature.UINT8_TYPE,module.exports.Constants.KEY_SIZE,0)//uint8_t data[TOBIIGAZE_KEY_SIZE];
});

module.exports.UsbDeviceInfo = bridjs.defineStruct({
    serialNumber : bridjs.structArrayField(Signature.CHAR_TYPE,module.exports.Constants.USB_DEVICE_INFO_MAX_SIZE,0),//char serial_number[TOBIIGAZE_DEVICE_INFO_MAX_SERIAL_NUMBER_LENGTH];
    model : bridjs.structArrayField(Signature.CHAR_TYPE,module.exports.Constants.USB_DEVICE_INFO_MAX_SIZE,1),//char model[TOBIIGAZE_DEVICE_INFO_MAX_MODEL_LENGTH];
    generation : bridjs.structArrayField(Signature.CHAR_TYPE,module.exports.Constants.USB_DEVICE_INFO_MAX_SIZE,2),//char generation[TOBIIGAZE_DEVICE_INFO_MAX_GENERATION_LENGTH];
    firmwareVersion : bridjs.structArrayField(Signature.CHAR_TYPE,module.exports.Constants.USB_DEVICE_INFO_MAX_SIZE,3)//char firmware_version[TOBIIGAZE_DEVICE_INFO_MAX_FIRMWARE_LENGTH];
});

/**
 * Contains data about a calibration point sample.
 * @field true_position       The point in normalized coordinates on the display area where the calibration stimulus was displayed.
 * @field left_map_position   The left eye gaze point in normalized coordinates on the display area after calibration.
 * @field left_status         Status code containing information about the validity and usage of the left eye data.
 * @field right_map_position  The right eye gaze point in normalized coordinates on the display area after calibration.
 * @field right_status        Status code containing information about the validity and usage of the right eye data.
 */
module.exports.PointData = bridjs.defineStruct({
    truePosition:bridjs.structField(module.exports.Point2f,0),//struct tobiigaze_point_2d_f true_position;
    leftMapPosition:bridjs.structField(module.exports.Point2f,1),//struct tobiigaze_point_2d_f left_map_position;
    leftStatus: bridjs.structField(Signature.INT32_TYPE,2),//tobiigaze_calibration_point_status left_status;
    rightMapPosition:bridjs.structField(module.exports.Point2f,3),//struct tobiigaze_point_2d_f right_map_position;
    rightStatus: bridjs.structField(Signature.INT32_TYPE,4)//tobiigaze_calibration_point_status right_status;*/
});

/**
* This struct holds a gaze data extension.
* @field column_id The id of the extension which uniquely identifies it.
* @field data The extension data. Use the helper functions in tobiigaze_ext.h to convert this data to types.
* @field actual_size The size of the data.
*/
module.exports.GazeDataExtension = bridjs.defineStruct({
    columnId:bridjs.structField(Signature.UINT32_TYPE,0),// uint32_t column_id
    data:bridjs.structArrayField(Signature.UINT8_TYPE,module.exports.Constants.MAX_GAZE_DATA_EXTENSION_LENGTH,1),//uint8_t data[TOBIIGAZE_MAX_GAZE_DATA_EXTENSION_LENGTH];
    actualSize:bridjs.structField(Signature.UINT32_TYPE,2)//uint32_t actual_size;
});

/**
* This struct holds a gaze data extension.
* @field extensions An array of extensions.
* @field actual_size The number of extensions.
*/
module.exports.GazeDataExtensions = bridjs.defineStruct({//struct tobiigaze_gaze_data_extensions
    extensions:bridjs.structArrayField(module.exports.GazeDataExtension,module.exports.Constants.MAX_GAZE_DATA_EXTENSIONS,0),//struct tobiigaze_gaze_data_extension extensions[TOBIIGAZE_MAX_GAZE_DATA_EXTENSIONS];
    actualSize:bridjs.structField(Signature.UINT32_TYPE,1)//uint32_t actual_size;
});