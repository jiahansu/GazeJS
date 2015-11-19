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
define(["bridjs", "myclass"], function(bridjs,my){
    var exports, Signature = bridjs.Signature;
    var ELINKADDRSIZE = 16,SAMPLE_TYPE = 200, CONTROL_BUFFER = 36, ELINKADDR = 
            bridjs.defineArray(Signature.char, ELINKADDRSIZE), ELNAMESIZE = 0,
            IEVENT = bridjs.defineStruct({
                time: bridjs.structField(Signature.uint32, 0),//UINT32 	time;          	/*!< effective time of event */
                type: bridjs.structField(Signature.int16, 1),//INT16  	type;          	/*!< event type */
                read:  bridjs.structField(Signature.uint16, 2),//UINT16 	read;          	/*!< flags which items were included */
                eye:  bridjs.structField(Signature.int16, 3),//INT16  	eye;           	/*!< eye: 0=left,1=right */
                sttime:  bridjs.structField(Signature.uint32, 4),//UINT32 	sttime;			/*!< start times */
                entime:  bridjs.structField(Signature.uint32, 5),//UINT32	entime;    		/*!< end times */
                hstx:  bridjs.structField(Signature.int16, 6),//INT16  	hstx;			/*!< starting point x */
                hsty:  bridjs.structField(Signature.int16, 7),//INT16	hsty;        	/*!< starting point y */
                gstx:  bridjs.structField(Signature.int16, 8),//INT16  	gstx; 			/*!< starting point x */
                gsty:  bridjs.structField(Signature.int16, 9),//INT16	gsty;        	/*!< starting point y */
                sta:  bridjs.structField(Signature.uint16, 10),//UINT16 	sta;
                henx:  bridjs.structField(Signature.int16, 11),//INT16  	henx;			/*!< ending point x */
                heny:  bridjs.structField(Signature.int16, 12),//INT16	heny;        	/*!< ending point y */
                genx:  bridjs.structField(Signature.int16, 13),//INT16  	genx;			/*!< ending point x */
                geny:  bridjs.structField(Signature.int16, 14),//INT16 	geny;        	/*!< ending point y */
                ena:  bridjs.structField(Signature.uint16, 15),//UINT16 	ena;
                havx:  bridjs.structField(Signature.int16, 16),//INT16  	havx;			/*!< average x */
                havy:  bridjs.structField(Signature.int16, 17),//INT16 	havy;        	/*!< average y */
                gavx:  bridjs.structField(Signature.int16, 18),//INT16  	gavx;			/*!< average x */
                gavy:  bridjs.structField(Signature.int16, 19),//INT16	gavy;        	/*!< average y */
                ava:  bridjs.structField(Signature.uint16, 20),//UINT16 	ava;           	/*!< also used as accumulator */
                avel:  bridjs.structField(Signature.int16, 21),//INT16 	avel;          	/*!< avg velocity accum */
                pvel:  bridjs.structField(Signature.int16, 22),//INT16 	pvel;          	/*!< peak velocity accum */
                svel:  bridjs.structField(Signature.int16, 23),//INT16 	svel;			/*!< start velocity */
                evel:  bridjs.structField(Signature.int16, 24),//INT16 	evel;       	/*!< end velocity */
                supd_x:  bridjs.structField(Signature.int16, 25),//INT16 	supd_x;			/*!< start units-per-degree x */
                eupd_x:  bridjs.structField(Signature.int16, 26),//INT16	eupd_x;   		/*!< end units-per-degree y */
                supd_y:  bridjs.structField(Signature.int16, 27),//INT16 	supd_y;			/*!< start units-per-degree y */
                eupd_y:  bridjs.structField(Signature.int16, 28),//INT16 	eupd_y;   		/*!< end units-per-degree y */
                status:  bridjs.structField(Signature.uint16, 29)//UINT16	status;       	/*!< error, warning flags */
            }), 
            FEVENT = bridjs.defineStruct({
                time: bridjs.structField(Signature.uint32, 0),//UINT32 	time;          	/*!< effective time of event */
                type: bridjs.structField(Signature.int16, 1),//INT16  	type;          	/*!< event type */
                read:  bridjs.structField(Signature.uint16, 2),//UINT16 	read;          	/*!< flags which items were included */
                eye:  bridjs.structField(Signature.int16, 3),//INT16  	eye;           	/*!< eye: 0=left,1=right */
                sttime:  bridjs.structField(Signature.uint32, 4),//UINT32 	sttime;			/*!< start times */
                entime:  bridjs.structField(Signature.uint32, 5),//UINT32	entime;    		/*!< end times */
                hstx:  bridjs.structField(Signature.float, 6),//INT16  	hstx;			/*!< starting point x */
                hsty:  bridjs.structField(Signature.float, 7),//INT16	hsty;        	/*!< starting point y */
                gstx:  bridjs.structField(Signature.float, 8),//INT16  	gstx; 			/*!< starting point x */
                gsty:  bridjs.structField(Signature.float, 9),//INT16	gsty;        	/*!< starting point y */
                sta:  bridjs.structField(Signature.float, 10),//UINT16 	sta;
                henx:  bridjs.structField(Signature.float, 11),//INT16  	henx;			/*!< ending point x */
                heny:  bridjs.structField(Signature.float, 12),//INT16	heny;        	/*!< ending point y */
                genx:  bridjs.structField(Signature.float, 13),//INT16  	genx;			/*!< ending point x */
                geny:  bridjs.structField(Signature.float, 14),//INT16 	geny;        	/*!< ending point y */
                ena:  bridjs.structField(Signature.float, 15),//UINT16 	ena;
                havx:  bridjs.structField(Signature.float, 16),//INT16  	havx;			/*!< average x */
                havy:  bridjs.structField(Signature.float, 17),//INT16 	havy;        	/*!< average y */
                gavx:  bridjs.structField(Signature.float, 18),//INT16  	gavx;			/*!< average x */
                gavy:  bridjs.structField(Signature.float, 19),//INT16	gavy;        	/*!< average y */
                ava:  bridjs.structField(Signature.float, 20),//UINT16 	ava;           	/*!< also used as accumulator */
                avel:  bridjs.structField(Signature.float, 21),//INT16 	avel;          	/*!< avg velocity accum */
                pvel:  bridjs.structField(Signature.float, 22),//INT16 	pvel;          	/*!< peak velocity accum */
                svel:  bridjs.structField(Signature.float, 23),//INT16 	svel;			/*!< start velocity */
                evel:  bridjs.structField(Signature.float, 24),//INT16 	evel;       	/*!< end velocity */
                supd_x:  bridjs.structField(Signature.float, 25),//INT16 	supd_x;			/*!< start units-per-degree x */
                eupd_x:  bridjs.structField(Signature.float, 26),//INT16	eupd_x;   		/*!< end units-per-degree y */
                supd_y:  bridjs.structField(Signature.float, 27),//INT16 	supd_y;			/*!< start units-per-degree y */
                eupd_y:  bridjs.structField(Signature.float, 28),//INT16 	eupd_y;   		/*!< end units-per-degree y */
                status:  bridjs.structField(Signature.uint16, 29)//UINT16	status;       	/*!< error, warning flags */
            }),
            DEVENT = bridjs.defineStruct({
                time: bridjs.structField(Signature.double, 0),//UINT32 	time;          	/*!< effective time of event */
                type: bridjs.structField(Signature.int16, 1),//INT16  	type;          	/*!< event type */
                read:  bridjs.structField(Signature.uint16, 2),//UINT16 	read;          	/*!< flags which items were included */
                eye:  bridjs.structField(Signature.int16, 3),//INT16  	eye;           	/*!< eye: 0=left,1=right */
                sttime:  bridjs.structField(Signature.double, 4),//UINT32 	sttime;			/*!< start times */
                entime:  bridjs.structField(Signature.double, 5),//UINT32	entime;    		/*!< end times */
                hstx:  bridjs.structField(Signature.float, 6),//INT16  	hstx;			/*!< starting point x */
                hsty:  bridjs.structField(Signature.float, 7),//INT16	hsty;        	/*!< starting point y */
                gstx:  bridjs.structField(Signature.float, 8),//INT16  	gstx; 			/*!< starting point x */
                gsty:  bridjs.structField(Signature.float, 9),//INT16	gsty;        	/*!< starting point y */
                sta:  bridjs.structField(Signature.float, 10),//UINT16 	sta;
                henx:  bridjs.structField(Signature.float, 11),//INT16  	henx;			/*!< ending point x */
                heny:  bridjs.structField(Signature.float, 12),//INT16	heny;        	/*!< ending point y */
                genx:  bridjs.structField(Signature.float, 13),//INT16  	genx;			/*!< ending point x */
                geny:  bridjs.structField(Signature.float, 14),//INT16 	geny;        	/*!< ending point y */
                ena:  bridjs.structField(Signature.float, 15),//UINT16 	ena;
                havx:  bridjs.structField(Signature.float, 16),//INT16  	havx;			/*!< average x */
                havy:  bridjs.structField(Signature.float, 17),//INT16 	havy;        	/*!< average y */
                gavx:  bridjs.structField(Signature.float, 18),//INT16  	gavx;			/*!< average x */
                gavy:  bridjs.structField(Signature.float, 19),//INT16	gavy;        	/*!< average y */
                ava:  bridjs.structField(Signature.float, 20),//UINT16 	ava;           	/*!< also used as accumulator */
                avel:  bridjs.structField(Signature.float, 21),//INT16 	avel;          	/*!< avg velocity accum */
                pvel:  bridjs.structField(Signature.float, 22),//INT16 	pvel;          	/*!< peak velocity accum */
                svel:  bridjs.structField(Signature.float, 23),//INT16 	svel;			/*!< start velocity */
                evel:  bridjs.structField(Signature.float, 24),//INT16 	evel;       	/*!< end velocity */
                supd_x:  bridjs.structField(Signature.float, 25),//INT16 	supd_x;			/*!< start units-per-degree x */
                eupd_x:  bridjs.structField(Signature.float, 26),//INT16	eupd_x;   		/*!< end units-per-degree y */
                supd_y:  bridjs.structField(Signature.float, 27),//INT16 	supd_y;			/*!< start units-per-degree y */
                eupd_y:  bridjs.structField(Signature.float, 28),//INT16 	eupd_y;   		/*!< end units-per-degree y */
                status:  bridjs.structField(Signature.uint16, 29)//UINT16	status;       	/*!< error, warning flags */
            }),
            
            IMESSAGE = bridjs.defineStruct({
                time:bridjs.structField(Signature.uint32, 0),//UINT32 time;       	/*!< time message logged */
                type:bridjs.structField(Signature.int16, 1),//INT16  type;       	/*!< event type: usually MESSAGEEVENT */
                length:bridjs.structField(Signature.uint16, 2),//UINT16 length;     	/*!< length of message */
                text: bridjs.structArrayField(Signature.char,260, 3)//byte   text[260];  	/*!< message contents (max length 255) */
               }),
            IOEVENT = bridjs.defineStruct({
                time: bridjs.structField(Signature.uint32, 0),//UINT32 time;       	/*!< time logged */
                type: bridjs.structField(Signature.int16, 1),//INT16  type;       	/*!< event type: */
                data: bridjs.structField(Signature.uint16, 2)//UINT16 data;       	/*!< coded event data */
            }),
            FSAMPLE = bridjs.defineStruct({
                time: bridjs.structField(Signature.uint32, 0),  //UINT32 	time;         	/*!< time of sample */
                type: bridjs.structField(Signature.int16, 1),//INT16  	type;           /*!< always SAMPLE_TYPE */
                flags: bridjs.structField(Signature.uint16, 2),//UINT16 	flags;         	/*!< flags to indicate contents */
                px: bridjs.structArrayField(Signature.float,2, 3),//INT16  	px[2];			/*!< pupil x */
                py: bridjs.structArrayField(Signature.float,2, 4),//INT16  	py[2];    		/*!< pupil y */
                hx: bridjs.structArrayField(Signature.float,2, 5),//INT16  	hx[2];			/*!< headref x */
                hy: bridjs.structArrayField(Signature.float,2, 6),//INT16  	hy[2];    		/*!< headref y */
                pa: bridjs.structArrayField(Signature.float,2, 7),//UINT16 	pa[2];          /*!< pupil size or area */
                gx: bridjs.structArrayField(Signature.float,2, 8),//INT16  	gx[2];			/*!< screen gaze x */
                gy: bridjs.structArrayField(Signature.float,2, 9),//INT16  	gy[2];     		/*!< screen gaze y */
                rx: bridjs.structField(Signature.float, 10),//INT16  	rx;				/*!< screen pixels per degree */
                ry: bridjs.structField(Signature.float, 11),//INT16  	ry;           	/*!< screen pixels per degree */
                status: bridjs.structField(Signature.uint16, 12),//UINT16 	status;         /*!< tracker status flags    */
                input: bridjs.structField(Signature.uint16, 13),//UINT16 	input;          /*!< extra (input word)      */
                buttons: bridjs.structField(Signature.uint16, 14),//UINT16 	buttons;        /*!< button state & changes  */
                htype: bridjs.structField(Signature.int16, 15),//INT16  	htype;          /*!< head-tracker data type (0=none) */
                hdata: bridjs.structArrayField(Signature.int16,8, 16)//,INT16  hdata[8];        /*!< head-tracker data */
            }),
            ISAMPLE = bridjs.defineStruct({
                time: bridjs.structField(Signature.uint32, 0),  //UINT32 	time;         	/*!< time of sample */
                type: bridjs.structField(Signature.int16, 1),//INT16  	type;           /*!< always SAMPLE_TYPE */
                flags: bridjs.structField(Signature.uint16, 2),//UINT16 	flags;         	/*!< flags to indicate contents */
                px: bridjs.structArrayField(Signature.int16,2, 3),//INT16  	px[2];			/*!< pupil x */
                py: bridjs.structArrayField(Signature.int16,2, 4),//INT16  	py[2];    		/*!< pupil y */
                hx: bridjs.structArrayField(Signature.int16,2, 5),//INT16  	hx[2];			/*!< headref x */
                hy: bridjs.structArrayField(Signature.int16,2, 6),//INT16  	hy[2];    		/*!< headref y */
                pa: bridjs.structArrayField(Signature.uint16,2, 7),//UINT16 	pa[2];          /*!< pupil size or area */
                gx: bridjs.structArrayField(Signature.int16,2, 8),//INT16  	gx[2];			/*!< screen gaze x */
                gy: bridjs.structArrayField(Signature.int16,2, 9),//INT16  	gy[2];     		/*!< screen gaze y */
                rx: bridjs.structField(Signature.int16, 10),//INT16  	rx;				/*!< screen pixels per degree */
                ry: bridjs.structField(Signature.int16, 11),//INT16  	ry;           	/*!< screen pixels per degree */
                status: bridjs.structField(Signature.uint16, 12),//UINT16 	status;         /*!< tracker status flags    */
                input: bridjs.structField(Signature.uint16, 13),//UINT16 	input;          /*!< extra (input word)      */
                buttons: bridjs.structField(Signature.uint16, 14),//UINT16 	buttons;        /*!< button state & changes  */
                htype: bridjs.structField(Signature.int16, 15),//INT16  	htype;          /*!< head-tracker data type (0=none) */
                hdata: bridjs.structArrayField(Signature.int16,8, 16)//,INT16  hdata[8];        /*!< head-tracker data */
            }),
            ALL_DATA = bridjs.defineUnion({
                ie : {type:IEVENT, order:0},
                im : {type:IMESSAGE, order:1},
                io : {type: IOEVENT, order:2},
                fs : {type: ISAMPLE, order:2}
            }),
            
            ELINKNODE = bridjs.defineStruct({
                addr: bridjs.structField(ELINKADDR, 0),//ELINKADDR addr; /*!< address of the remote  or local tracker */
                name: bridjs.structArrayField(Signature.char,ELNAMESIZE,1)// char name[ELNAMESIZE]; /*!< name of the remote  or local tracker */
            });
    exports= my.Class({
        STATIC:{
                    /*********** EYE DATA FORMATS **********/
        /**********************************************************************************
         * ALL fields use MISSING_DATA when value was not read, EXCEPT for <buttons>,     *
         * <time>, <sttime> and <entime>, which use 0. This is true for both floating     *
         * point or integer variables. Both samples and events may have several fields    *
         * that have not been updated. These fields may be detected from the content      *
         * flags, or by testing the field value against these constants:                  *
         **********************************************************************************/
        /*! 
        @defgroup gendataflags General Data Constants 
        @ingroup messaging
        @{
        */
            MISSING_DATA: -32768,     /*!< data is missing (integer) */
            MISSING:      -32768,			/*!< data is missing (integer) */
            INaN :         32768,				/*!< data is missing (integer) */

        /**********************************************************************************
         * binocular data needs to ID the eye for events
         * samples need to index the data
         * These constants are used as eye identifiers
         **********************************************************************************/

            LEFT_EYE:     0,		/*!< Index and ID of left eye */
            RIGHT_EYE:    1,		/*!< Index and ID of right eye */
            LEFTEYEI:     0,		/*!< Index and ID of left eye */
            RIGHTEYEI:    1,		/*!< Index and ID of right eye */
            LEFT:         0,		/*!< Index and ID of left eye */
            RIGHT:        1,		/*!< Index and ID of right eye */
            BINOCULAR:    2,		/*!< Data for both eyes available */
            
            /********* EYE SAMPLE DATA FORMATS *******/
            /*! 
            @defgroup sampledataflags Sample Data Flags
            @ingroup messaging

            The SAMPLE struct contains data from one 4-msec eye-tracker sample. The <flags>
            field has a bit for each type of data in the sample. Fields not read have 0
            flag bits, and are set to MISSING_DATA flags to define what data is included
            in each sample.  There is one bit for each type.  Total data for samples
            in a block is indicated by these bits in the <sam_data> field of ILINKDATA or
            EDF_FILE, and is updated by the STARTSAMPLES control event.

            @{
            */




           SAMPLE_LEFT:      0x8000,  /*!< Data for left eye */
           SAMPLE_RIGHT:     0x4000,  /*!< Data for right eye */

           SAMPLE_TIMESTAMP: 0x2000,  /*!< Time stamp for sample. bit always set for link sample, used to compress files */

           SAMPLE_PUPILXY:   0x1000,  /*!< Pupil x,y pair */
           SAMPLE_HREFXY:    0x0800,  /*!< Head-referenced x,y pair */
           SAMPLE_GAZEXY:    0x0400,  /*!< Gaze x,y pair */
           SAMPLE_GAZERES:   0x0200,  /*!< Gaze res (x,y pixels per degree) pair */
           SAMPLE_PUPILSIZE: 0x0100,  /*!< Pupil size */
           SAMPLE_STATUS:    0x0080,  /*!< Error flags */
           SAMPLE_INPUTS:    0x0040,  /*!< Input data port */
           SAMPLE_BUTTONS:   0x0020,  /*!< Button state: LSBy state, MSBy changes */

           SAMPLE_HEADPOS:   0x0010,  /*!< Head-position: byte tells # words */
           SAMPLE_TAGGED:    0x0008,  /*!< Reserved variable-length tagged */
           SAMPLE_UTAGGED:   0x0004,  /*!< User-defineabe variable-length tagged */
           SAMPLE_ADD_OFFSET: 0x0002 /*!< If this flag is set for the sample add .5ms to the sample time */,
           
           ISAMPLE: ISAMPLE,
            /*! @ingroup messaging
            \brief Floating-point sample

            The EyeLink tracker measures eye position 250, 500, 1000 or 2000 times per second depending on
            the tracking mode you are working with, and computes true gaze position on the display
            using the head camera data. This data is stored in the EDF file, and made available
            through the link in as little as 3 milliseconds after a physical eye movement.
            Samples can be read from the link by eyelink_get_float_data() or eyelink_newest_float_sample().

            If sample rate is 2000hz, two samples with same time stamp possible. If SAMPLE_ADD_OFFSET is set on the
            flags, add .5 ms to get the real time. Convenient FLOAT_TIME can also be used.
            */
            FSAMPLE: FSAMPLE,
            
            /*! @ingroup messaging
            \brief Floating-point sample with floating point time

            The EyeLink tracker measures eye position 250, 500, 1000 or 2000 times per second depending on
            the tracking mode you are working with, and computes true gaze position on the display
            using the head camera data. This data is stored in the EDF file, and made available
            through the link in as little as 3 milliseconds after a physical eye movement.
            Samples can be read from the link by eyelink_get_double_data() or eyelink_newest_double_sample().

            */
           DSAMPLE: bridjs.defineStruct({
                time: bridjs.structField(Signature.double, 0),  //UINT32 	time;         	/*!< time of sample */
                type: bridjs.structField(Signature.int16, 1),//INT16  	type;           /*!< always SAMPLE_TYPE */
                flags: bridjs.structField(Signature.uint16, 2),//UINT16 	flags;         	/*!< flags to indicate contents */
                px: bridjs.structArrayField(Signature.float,2, 3),//INT16  	px[2];			/*!< pupil x */
                py: bridjs.structArrayField(Signature.float,2, 4),//INT16  	py[2];    		/*!< pupil y */
                hx: bridjs.structArrayField(Signature.float,2, 5),//INT16  	hx[2];			/*!< headref x */
                hy: bridjs.structArrayField(Signature.float,2, 6),//INT16  	hy[2];    		/*!< headref y */
                pa: bridjs.structArrayField(Signature.float,2, 7),//UINT16 	pa[2];          /*!< pupil size or area */
                gx: bridjs.structArrayField(Signature.float,2, 8),//INT16  	gx[2];			/*!< screen gaze x */
                gy: bridjs.structArrayField(Signature.float,2, 9),//INT16  	gy[2];     		/*!< screen gaze y */
                rx: bridjs.structField(Signature.float, 10),//INT16  	rx;				/*!< screen pixels per degree */
                ry: bridjs.structField(Signature.float, 11),//INT16  	ry;           	/*!< screen pixels per degree */
                status: bridjs.structField(Signature.uint16, 12),//UINT16 	status;         /*!< tracker status flags    */
                input: bridjs.structField(Signature.uint16, 13),//UINT16 	input;          /*!< extra (input word)      */
                buttons: bridjs.structField(Signature.uint16, 14),//UINT16 	buttons;        /*!< button state & changes  */
                htype: bridjs.structField(Signature.int16, 15),//INT16  	htype;          /*!< head-tracker data type (0=none) */
                hdata: bridjs.structArrayField(Signature.int16,8, 16)//,INT16  hdata[8];        /*!< head-tracker data */
            }),
            
            /*! 
            @internal
            Used to access raw online data.
            */
            FSAMPLE_RAW: bridjs.defineStruct({
                struct_size: bridjs.structField(Signature.uint32, 0),  //UINT32 	time;         	/*!< time of sample */
                
                raw_pupil: bridjs.structArrayField(Signature.float,2, 1),//INT16  	px[2];			/*!< pupil x */
                raw_cr: bridjs.structArrayField(Signature.float,2, 2),//INT16  	py[2];    		/*!< pupil y */
                pupil_area: bridjs.structField(Signature.uint32, 3),//INT16  	rx;				/*!< screen pixels per degree */
                cr_area: bridjs.structField(Signature.uint32, 4),//INT16  	rx;				/*!< screen pixels per degree */
                pupil_dimension: bridjs.structArrayField(Signature.uint32,2, 5),//,INT16  hdata[8];        /*!< head-tracker data */
                cr_dimension: bridjs.structArrayField(Signature.uint32,2, 6),//,INT16  hdata[8];        /*!< head-tracker data */
                window_position: bridjs.structArrayField(Signature.uint32,2, 7),//,INT16  hdata[8];        /*!< head-tracker data */
                pupil_cr: bridjs.structArrayField(Signature.float,2, 8),//,INT16  hdata[8];        /*!< head-tracker data */
                
                cr_area2: bridjs.structField(Signature.uint32, 9),
                raw_cr2: bridjs.structArrayField(Signature.float,2, 2)
            }),
            
            /******** EVENT DATA FORMATS *******/

            /**********************************************************************************
             * ALL fields use MISSING_DATA when value was not read,
             * EXCEPT for <buttons>, <time>, <sttime> and <entime>, which use 0.
             * This is true for both floating point or integer variables.
             **********************************************************************************/
            /*! @ingroup messaging
\bri        ef Integer eye-movement events */
            IEVENT:  IEVENT,
            /*!@ingroup messaging
            \brief Floating-point eye event

           The EyeLink tracker analyzes the eye-position samples during recording to
           detect saccades, and accumulates data on saccades and fixations. Events
           are produced to mark the start and end of saccades, fixations and blinks.
           When both eyes are being tracked, left and right eye events are produced,
           as indicated in the eye field of the FEVENT structure.

           Start events contain only the start time, and optionally the start eye
           or gaze position. End events contain the start and end time, plus summary
           data on saccades and fixations. This includes start and end and average
           measures of position and pupil size, plus peak and average velocity in
           degrees per second.


           */
            FEVENT:  FEVENT,
            /*!@ingroup messaging
            \brief Floating-point eye event with floating point time

           The EyeLink tracker analyzes the eye-position samples during recording to
           detect saccades, and accumulates data on saccades and fixations. Events
           are produced to mark the start and end of saccades, fixations and blinks.
           When both eyes are being tracked, left and right eye events are produced,
           as indicated in the eye field of the FEVENT structure.

           Start events contain only the start time, and optionally the start eye
           or gaze position. End events contain the start and end time, plus summary
           data on saccades and fixations. This includes start and end and average
           measures of position and pupil size, plus peak and average velocity in
           degrees per second.


           */
            DEVENT:  DEVENT,
            
            /*!@ingroup messaging
            \brief Message events: usually text but may contain binary data

            A message event is created by your experiment program, and placed in the EDF file.
            It is possible to enable the sending of these messages back through the link,
            although there is rarely a reason to do this. Although this method might be
            used to determine the tracker time (the time field of a message event will indicate
            when the message was received by the tracker), the use of eyelink_request_time()
            and eyelink_read_time() is more efficient for retrieving the current time from the
            eye tracker's timestamp clock. The eye tracker time is rarely needed in any case,
            and would only be useful to compute link transport delays.
            */
           
           IMESSAGE: IMESSAGE,
           /*!@ingroup messaging
            \brief Message events: usually text but may contain binary data with floating point time.

            A message event is created by your experiment program, and placed in the EDF file.
            It is possible to enable the sending of these messages back through the link,
            although there is rarely a reason to do this. Although this method might be
            used to determine the tracker time (the time field of a message event will indicate
            when the message was received by the tracker), the use of eyelink_request_time()
            and eyelink_read_time() is more efficient for retrieving the current time from the
            eye tracker's timestamp clock. The eye tracker time is rarely needed in any case,
            and would only be useful to compute link transport delays.
            */
           DMESSAGE: bridjs.defineStruct({
            time:bridjs.structField(Signature.double, 0),//UINT32 time;       	/*!< time message logged */
            type:bridjs.structField(Signature.int16, 1),//INT16  type;       	/*!< event type: usually MESSAGEEVENT */
            length:bridjs.structField(Signature.uint16, 2),//UINT16 length;     	/*!< length of message */
            text: bridjs.structArrayField(Signature.char,260, 3)//byte   text[260];  	/*!< message contents (max length 255) */
           }),
           
           /*! @ingroup messaging
            \brief Button, input, other simple events

            BUTTONEVENT and INPUTEVENT types are the simplest events, reporting
            changes in button status or in the input port data. The time field
            records the timestamp of the eye-data sample where the change occurred,
            although the event itself is usually sent before that sample. The data
            field contains the data after the change, in the same format as in the
            FSAMPLE structure.

            Button events from the link are rarely used; monitoring buttons with one
            of eyelink_read_keybutton(), eyelink_last_button_press(), or
            eyelink_button_states() is preferable, since these can report button
            states at any time, not just during recording.
            */
            IOEVENT:IOEVENT,
            
            /*! @ingroup messaging
            \brief Button, input, other simple events with floating point time.

            BUTTONEVENT and INPUTEVENT types are the simplest events, reporting
            changes in button status or in the input port data. The time field
            records the timestamp of the eye-data sample where the change occurred,
            although the event itself is usually sent before that sample. The data
            field contains the data after the change, in the same format as in the
            FSAMPLE structure.

            Button events from the link are rarely used; monitoring buttons with one
            of eyelink_read_keybutton(), eyelink_last_button_press(), or
            eyelink_button_states() is preferable, since these can report button
            states at any time, not just during recording.
            */
            DIOEVENT:bridjs.defineStruct({
                time: bridjs.structField(Signature.double, 0),//UINT32 time;       	/*!< time logged */
                type: bridjs.structField(Signature.int16, 1),//INT16  type;       	/*!< event type: */
                data: bridjs.structField(Signature.uint16, 2)//UINT16 data;       	/*!< coded event data */
            }),
            
            /************ COMPOSITE DATA BUFFERS ***********/
            /*! @ingroup messaging
            \brief Union of message, io event and integer sample and integer event.
            */
            ALL_DATA: ALL_DATA,
            /*
            typedef union {
                IEVENT    ie;
                IMESSAGE  im;
                IOEVENT   io;
                ISAMPLE   is;
            } ALL_DATA ;*/
            /*! @ingroup messaging
            \brief Union of message, io event and float sample and float event.
            */
           ALLF_DATA:  bridjs.defineUnion({
                fe : {type:FEVENT, order:0},
                im : {type:IMESSAGE, order:1},
                io : {type: IOEVENT, order:2},
                fs : {type: FSAMPLE, order:2}
            }),
           /*! @ingroup messaging
            \brief Union of message, io event and double sample and double event.
            */
           /*
            typedef union {
                DEVENT    fe;
                DMESSAGE  im;
                DIOEVENT  io;
                DSAMPLE   fs;
            } ALLD_DATA ;*/
            ALLD_DATA: DEVENT,
            
            /********** SAMPLE, EVENT BUFFER TYPE CODES ***********/
            /*!
            @defgroup sample_event_type Eyelink Sample and Event Type Identifiers
            @ingroup messaging
            These codes can be used to identify the type of event or sample.
            @{
            */
            SAMPLE_TYPE : SAMPLE_TYPE, /*!< The type code for samples */

            /************* EVENT TYPE CODES ************/
                        /* buffer = IEVENT, FEVENT, btype = IEVENT_BUFFER */
            STARTPARSE     : 1,     /* these only have time and eye data */
            ENDPARSE       : 2,
            BREAKPARSE     : 10,


            /* EYE DATA: contents determined by evt_data */
            /* and by "read" data item */
            /* all use IEVENT format */
            STARTBLINK     : 3,    /*!< Event is a start blink event */
            ENDBLINK       : 4,   /*!< Event is an end blink event */
            STARTSACC      : 5,	/*!< Event is a start saccade event */
            ENDSACC        : 6,	/*!< Event is an end saccade event */
            STARTFIX       : 7,	/*!< Event is a start fixation event */
            ENDFIX         : 8,	/*!< Event is an end fixation event */
            FIXUPDATE      : 9,	/*!< Event is a fixation update event */

              /* buffer = (none, directly affects state), btype = CONTROL_BUFFER */
                         /* control events: all put data into */
                         /* the EDF_FILE or ILINKDATA status  */
            STARTSAMPLES    : 15,  /*!< Start of events in block */
            ENDSAMPLES      : 16,  /*!< End of samples in block */
            STARTEVENTS     : 17,  /*!< Start of events in block */
            ENDEVENTS       : 18,  /*!< End of events in block */


                /* buffer = IMESSAGE, btype = IMESSAGE_BUFFER */
            MESSAGEEVENT     : 24,  /*!< User-definable text or data */


                /* buffer = IOEVENT, btype = IOEVENT_BUFFER */
            BUTTONEVENT      : 25,  /*!< Button state change */
            INPUTEVENT       :  28,  /*!< Change of input port */

            LOST_DATA_EVENT  : 0x3F,   /*!< NEW: Event flags gap in data stream */
            /*!
            @}
            */


            /**********************************************************************************
             * This type can help in detecting event type or in allocating storage, but does
             * not differentiate between integer and floating-point versions of data.
             * BUFFER TYPE id's: in "last_data_buffer_type"
            **********************************************************************************/
            ISAMPLE_BUFFER   : SAMPLE_TYPE,      /* old alias */
            IEVENT_BUFFER    : 66,
            IOEVENT_BUFFER   : 8,
            IMESSAGE_BUFFER  : 250,
            CONTROL_BUFFER   : CONTROL_BUFFER,
            ILINKDATA_BUFFER : CONTROL_BUFFER,  /* old alias */


            /************* CONSTANTS FOR EVENTS ************/



            /*!
            @defgroup readdataflags Read Data Flags
            @ingroup messaging
            The "read" flag contents in IEVENT
            @{
            */


                /* time data */
            READ_ENDTIME    : 0x0040,     /*!< end time (start time always read) */

                            /* non-position eye data: */
            READ_GRES       : 0x0200,     /*!< gaze resolution xy */
            READ_SIZE       : 0x0080,     /*!< pupil size */
            READ_VEL        : 0x0100,     /*!< velocity (avg, peak) */
            READ_STATUS     : 0x2000,     /*!< status (error word) */

            READ_BEG        : 0x0001,     /*!< event has start data for vel,size,gres */
            READ_END        : 0x0002,     /*!< event has end data for vel,size,gres */
            READ_AVG        : 0x0004,     /*!< event has avg pupil size, velocity */

                            /* position eye data */
            READ_PUPILXY    : 0x0400,    /*!< pupilxy REPLACES gaze, href data if read */
            READ_HREFXY     : 0x0800,
            READ_GAZEXY     : 0x1000,

            READ_BEGPOS     : 0x0008,    /*!< position data for these parts of event */
            READ_ENDPOS     : 0x0010,
            READ_AVGPOS     : 0x0020,


                           /* RAW FILE/LINK CODES: REVERSE IN R/W */
            FRIGHTEYE_EVENTS: 0x8000, /*!< has right eye events */
            FLEFTEYE_EVENTS : 0x4000, /*!< has left eye events */


            /*!
            @}
            */

            /*!
            @defgroup eventtypeflags Data Type Flags
            @ingroup messaging
            The "event_types" flag in ILINKDATA or EDF_FILE
            tells what types of events were written by tracker

            @{
            */


            LEFTEYE_EVENTS  : 0x8000, /*!< has left eye events */
            RIGHTEYE_EVENTS : 0x4000, /*!< has right eye events */
            BLINK_EVENTS    : 0x2000, /*!< has blink events */
            FIXATION_EVENTS : 0x1000, /*!< has fixation events */
            FIXUPDATE_EVENTS: 0x0800, /*!< has fixation updates */
            SACCADE_EVENTS  : 0x0400, /*!< has saccade events */
            MESSAGE_EVENTS  : 0x0200, /*!< has message events */
            BUTTON_EVENTS   : 0x0040, /*!< has button events */
            INPUT_EVENTS    : 0x0020, /*!< has input port events */

            /*!
            @}
            */

            /*!
            @defgroup eventdataflags Event Data Flags
            @ingroup messaging
            The "event_data" flags in ILINKDATA or EDF_FILE tells what
            types of data were included in events by tracker.

            @{
            */

            EVENT_VELOCITY  : 0x8000,  /*!< has velocity data */
            EVENT_PUPILSIZE : 0x4000,  /*!< has pupil size data */
            EVENT_GAZERES   : 0x2000,  /*!< has gaze resolution */
            EVENT_STATUS    : 0x1000,  /*!< has status flags */

            EVENT_GAZEXY    : 0x0400,  /*!< has gaze xy position */
            EVENT_HREFXY    : 0x0200,  /*!< has head-ref xy position */
            EVENT_PUPILXY   : 0x0100,  /*!< has pupil xy position */

            FIX_AVG_ONLY    : 0x0008,  /*!< only avg. data to fixation evts */
            START_TIME_ONLY : 0x0004,  /*!< only start-time in start events */

            PARSEDBY_GAZE   : 0x00C0,  /*!< events were generated using GAZE*/
            PARSEDBY_HREF   : 0x0080,  /*!< events were generated using HREF*/
            PARSEDBY_PUPIL  : 0x0040,  /*!< events were generated using PUPIL*/

            /*!
            @}
            */

            /************ LINK STATE DATA ************/

                /* the data on current state of link read and SIMTSR   */
                /* For EDF file state, see EDFFILE.H for EDF_FILE type */
            ILINKDATAVERSION: 2,

            ELNAMESIZE      : ELNAMESIZE,    /*!< max. tracker or remote name size   */
            ELREMBUFSIZE    : 420,   /*!< max. remote-to-remote message size */
            ELINKADDRSIZE   : ELINKADDRSIZE,    /*!< Node address (format varies) */
            ELINKADDR       : ELINKADDR,
            
            /*! \brief Name and address for connection.

            Name and address for connection or ping */
            ELINKNODE:ELINKNODE,
            
            /*! \brief Class to represent tracker status.

            Class to represent tracker status information such as time stamps, flags, tracker addresses and so on.
            */
            ILINKDATA: bridjs.defineStruct({
                time        : bridjs.structField(Signature.uint32, 0),//UINT32 time;        	/*!< time of last control event */
                version     : bridjs.structField(Signature.uint32, 1),//UINT32 version;     	/*!< structure version */

                samrate     : bridjs.structField(Signature.uint16, 2),//UINT16 samrate;     	/*!< 10*sample rate (0 if no samples, 1 if nonconstant) */
                samdiv      : bridjs.structField(Signature.uint16, 3),//UINT16 samdiv;      	/*!< sample "divisor" (min msec between samples) */

                prescaler   : bridjs.structField(Signature.uint16, 4),//UINT16 prescaler;   	/*!< amount to divide gaze x,y,res by */
                vprescaler  : bridjs.structField(Signature.uint16, 5),//UINT16 vprescaler;  	/*!< amount to divide velocity by */
                pprescaler  : bridjs.structField(Signature.uint16, 6),//UINT16 pprescaler;  	/*!< pupil prescale (1 if area, greater if diameter) */
                hprescaler  : bridjs.structField(Signature.uint16, 7),//UINT16 hprescaler;  	/*!< head-distance prescale (to mm) */

                sample_data : bridjs.structField(Signature.uint16, 8),//UINT16 sample_data;     /*!< 0 if off, else all flags */
                event_data  : bridjs.structField(Signature.uint16, 9),//UINT16 event_data;    	/*!< 0 if off, else all flags */
                event_types : bridjs.structField(Signature.uint16, 10),//UINT16 event_types;     /*!< 0 if off, else event-type flags */

                in_sample_block : bridjs.structField(Signature.char, 11),//byte in_sample_block;   /*!< set if in block with samples */
                in_event_block  : bridjs.structField(Signature.char, 12),//byte in_event_block;    /*!< set if in block with events */
                have_left_eye   : bridjs.structField(Signature.char,13),//byte have_left_eye;     /*!< set if any left-eye data expected */
                have_right_eye  : bridjs.structField(Signature.char,14),//byte have_right_eye;    /*!< set if any right-eye data expected */

                last_data_gap_types   : bridjs.structField(Signature.uint16,15),//UINT16 last_data_gap_types;    	/*!< flags what we lost before last item */
                last_data_buffer_type : bridjs.structField(Signature.uint16,16),//UINT16 last_data_buffer_type;   /*!< buffer-type code */
                last_data_buffer_size : bridjs.structField(Signature.uint16,17),//UINT16 last_data_buffer_size;   /*!< buffer size of last item */

                control_read          : bridjs.structField(Signature.uint16,18),//UINT16 control_read;   	/*!< set if control event read with last data */
                first_in_block        : bridjs.structField(Signature.uint16,19),//UINT16 first_in_block; 	/*!< set if control event started new block */

                last_data_item_time   : bridjs.structField(Signature.uint32,20),//UINT32 last_data_item_time;    	/*!< time field of item */
                last_data_item_type   : bridjs.structField(Signature.uint16,21),//UINT16 last_data_item_type;     /*!< type: 100=sample, 0=none, else event type */
                last_data_item_contents : bridjs.structField(Signature.uint16,22),//UINT16 last_data_item_contents; /*!< content: &lt;read&gt; (IEVENT), &lt;flags&gt; (ISAMPLE) */

                last_data_item        : bridjs.structField(ALL_DATA,23),//ALL_DATA last_data_item;    	/*!< buffer containing last item */

                block_number          : bridjs.structField(Signature.uint32,24),//UINT32 block_number; 	/*!< block in file */
                block_sample          : bridjs.structField(Signature.uint32,25),//UINT32 block_sample;    /*!< samples read in block so far */
                block_event           : bridjs.structField(Signature.uint32,26),//UINT32 block_event;    	/*!< events (excl. control read in block */

                           /* RESTORES DROPPED SAMPLE DATA */
                last_resx             : bridjs.structField(Signature.uint16,27),//  UINT16 last_resx;       /*!< updated by samples only */
                last_resy             : bridjs.structField(Signature.uint32,28),//UINT16 last_resy;       /*!< updated by samples only */
                last_pupil            : bridjs.structArrayField(Signature.uint16,2,29),//UINT16 last_pupil[2];  	/*!< updated by samples only */
                last_status           : bridjs.structField(Signature.uint16,30),//UINT16 last_status;     /*!< updated by samples, events */

                        /* LINK-SPECIFIC DATA */

                queue_samples         : bridjs.structField(Signature.uint16,31),//UINT16 queued_samples;  /*!< number of items in queue */
                queued_events         : bridjs.structField(Signature.uint16,32),// UINT16 queued_events;   /*!< includes control events */

                queue_size            : bridjs.structField(Signature.uint16,33),//UINT16 queue_size;      /*!< total queue buffer size */
                queue_free            : bridjs.structField(Signature.uint16,34),//UINT16 queue_free;      /*!< unused bytes in queue */

                last_rcve_time        : bridjs.structField(Signature.uint32,35),//UINT32 last_rcve_time;  /*!< time tracker last sent packet */

                samples_on            : bridjs.structField(Signature.char,36),//byte   samples_on;      /*!< data type rcve enable (switch) */
                events_on             : bridjs.structField(Signature.char,37),//byte   events_on;

                packet_flags          : bridjs.structField(Signature.uint16,38),//UINT16 packet_flags;    /*!< status flags from data packet */

                link_flags            : bridjs.structField(Signature.uint16,39),//UINT16 link_flags;      /*!< status flags from link packet header */
                state_flags           : bridjs.structField(Signature.uint16,40),//UINT16 state_flags;     /*!< tracker error state flags */
                link_dstatus          : bridjs.structField(Signature.char,41),//byte   link_dstatus;    /*!< tracker data output state */
                link_pendcmd          : bridjs.structField(Signature.char,42),//byte   link_pendcmd;    /*!< tracker commands pending  */
                breserved             : bridjs.structField(Signature.uint16,43),/*UINT16 reserved;        /*!< 0 for EyeLink I or original EyeLink API DLL.
                                             EYELINK II ONLY: MSB set if read
                                             crmode<<8 + file_filter<<4 + link_filter
                                             crmode = 0 if pupil, else pupil-CR
                                             file_filter, link_filter: 0, 1, or 2
                                             for level of heuristic filter applied      */

                        /* zero-term. strings: names for connection */
                        /* if blank, connects to any tracker    */
                our_name             : bridjs.structArrayField(Signature.char,40,44),//char our_name[40];      /*!< a name for our machine       */
                our_address          : bridjs.structField(ELINKADDR,45),//ELINKADDR our_address;
                eye_name             : bridjs.structArrayField(Signature.char,40,46),//char eye_name[40];      /*!< name of tracker connected to */
                eye_address          : bridjs.structField(ELINKADDR,47),//ELINKADDR eye_address;

                ebroadcast_address   : bridjs.structField(ELINKADDR,48),//ELINKADDR ebroadcast_address; /*!< Broadcast address for eye trackers */
                rbroadcast_address   : bridjs.structField(ELINKADDR,49),//ELINKADDR rbroadcast_address; /*!< Broadcast address for remotes */

                polling_remotes      : bridjs.structField(Signature.uint16,50),//UINT16 polling_remotes; /*!< 1 if polling remotes, else polling trackers */
                polling_responses    : bridjs.structField(Signature.uint16,51),//UINT16 poll_responses;  /*!< total nodes responding to polling */
                nodes                : bridjs.structArrayField(ELINKNODE,4,52)//ELINKNODE nodes[4];     /*!< data on nodes */
            }),
                /* packet_flags: */
            PUPIL_DIA_FLAG    : 0x0001,  /*!< set if pupil is diameter (else area) */
            HAVE_SAMPLES_FLAG : 0x0002,  /*!< set if we have samples */
            HAVE_EVENTS_FLAG  : 0x0004,  /*!< set if we have events */

            HAVE_LEFT_FLAG    : 0x8000,  /*!< set if we have left-eye data */
            HAVE_RIGHT_FLAG   : 0x4000,  /*!< set if we have right-eye data */

    /* dropped events or samples preceding a read item */
    /* are reported using these flag bits in "last_data_gap_types" */
    /* Dropped control events are used to update */
    /* the link state prior to discarding. */
            DROPPED_SAMPLE   : 0x8000,
            DROPPED_EVENT    : 0x4000,
            DROPPED_CONTROL  : 0x2000,

        /* <link_dstatus> FLAGS */
            DFILE_IS_OPEN    : 0x80,      /*!< disk file active */
            DFILE_EVENTS_ON  : 0x40,      /*!< disk file writing events */
            DFILE_SAMPLES_ON : 0x20,      /*!< disk file writing samples */
            DLINK_EVENTS_ON  : 0x08,      /*!< link sending events */
            DLINK_SAMPLES_ON : 0x04,      /*!< link sending samples */
            DRECORD_ACTIVE   : 0x01,      /*!< in active recording mode */

        /* <link_flags> flags */
            COMMAND_FULL_WARN: 0x01,     /*!< too many commands: pause */
            MESSAGE_FULL_WARN: 0x02,     /*!< too many messages: pause */
            LINK_FULL_WARN   : 0x04,     /*!< link, command, or message load */
            FULL_WARN        : 0x0F,     /*!< test mask for any warning */

            LINK_CONNECTED   : 0x10,     /*!< link is connected */
            LINK_BROADCAST   : 0x20,     /*!< link is broadcasting */
            LINK_IS_TCPIP    : 0x40,     /*!< link is TCP/IP (else packet) */


/************ STATUS FLAGS (samples and events) ****************/

/*!
@}
*/

/*!
@defgroup elmarker Eyelink II/Eyelink I Marker flags
@ingroup messaging
@{
*/
            LED_TOP_WARNING          : 0x0080,    /*!< marker is in border of image*/
            LED_BOT_WARNING          : 0x0040,    /*!< marker is in border of image*/
            LED_LEFT_WARNING         : 0x0020,    /*!< marker is in border of image*/
            LED_RIGHT_WARNING        : 0x0010,    /*!< marker is in border of image*/
            HEAD_POSITION_WARNING    : 0x00F0,    /*!< head too far from calibr??? */

            LED_EXTRA_WARNING        : 0x0008,    /*!< glitch or extra markers */
            LED_MISSING_WARNING      : 0x0004,    /*!< <2 good data points in last 100 msec)*/
            HEAD_VELOCITY_WARNING    : 0x0001,    /*!< head moving too fast*/

            CALIBRATION_AREA_WARNING : 0x0002,  /*!< pupil out of good mapping area*/

            MATH_ERROR_WARNING       : 0x2000,  /*!< math error in proc. sample */
/*!
@}
*/







/*!
@defgroup elii Eyelink II specific flags
@ingroup messaging
@{
*/

/*!
    This sample interpolated to preserve sample rate
    usually because speed dropped due to missing pupil
 */
            INTERP_SAMPLE_WARNING    : 0x1000,
/*!
    Pupil interpolated this sample
    usually means pupil loss or
    500 Hz sample with CR but no pupil
*/
            INTERP_PUPIL_WARNING     : 0x8000,

            /* all CR-related errors */
            CR_WARNING               : 0x0F00, /*!< CR related warning for one or both eyes*/
            CR_LEFT_WARNING          : 0x0500, /*!< CR related warning for left eye*/
            CR_RIGHT_WARNING         : 0x0A00, /*!< CR related warning for right eye*/

            /* CR is actually lost */
            CR_LOST_WARNING          : 0x0300, /*!< CR is actually lost for one or both eyes*/
            CR_LOST_LEFT_WARNING     : 0x0100, /*!< CR is actually lost for left eye*/
            CR_LOST_RIGHT_WARNING    : 0x0200, /*!< CR is actually lost for right eye*/

            /* this sample has interpolated/held CR */
            CR_RECOV_WARNING         : 0x0C00, /*!<  this sample has interpolated/held CR for one or both eyes*/
            CR_RECOV_LEFT_WARNING    : 0x0400, /*!<  this sample has interpolated/held CR for left eye*/
            CR_RECOV_RIGHT_WARNING   : 0x0800, /*!<  this sample has interpolated/held CR for right eye*/


/*!
@}
*/

/*!
@defgroup el1000remote Eyelink 1000 Remote specific target status flags
@ingroup messaging
These are available through the HTARGET data type
( htype==0xB4, hdata = tx, ty, distance, flags
where tx, ty range from 0 to 10000
distance = 10*mm

Here is an example of getting target flags over the link.
@remark This example only applicable to EyeLink 1000 Remote


<pre>
\code
#include <stdio.h>
#include <core_expt.h>

void printHTarget(INT16 hdata[8])
{
	INT16 v = hdata[3];
	printf("\rTarget x=%d y=%d distance=%d flags=%x", hdata[0],hdata[1],hdata[2],hdata[3]);
	if(v & TFLAG_MISSING)  printf(" TFLAG_MISSING");
	if(v & TFLAG_ANGLE)    printf(" TFLAG_ANGLE");
	if(v & TFLAG_NEAREYE)  printf(" TFLAG_NEAREYE");
	if(v & TFLAG_CLOSE)    printf(" TFLAG_CLOSE");
	if(v & TFLAG_FAR)      printf(" TFLAG_FAR");
	if(v & TFLAG_T_TSIDE)  printf(" TFLAG_T_TSIDE");
	if(v & TFLAG_T_BSIDE)  printf(" TFLAG_T_BSIDE");
	if(v & TFLAG_T_LSIDE)  printf(" TFLAG_T_LSIDE");
	if(v & TFLAG_T_RSIDE)  printf(" TFLAG_T_RSIDE");
	if(v & TFLAG_E_TSIDE)  printf(" TFLAG_E_TSIDE");
	if(v & TFLAG_E_BSIDE)  printf(" TFLAG_E_BSIDE");
	if(v & TFLAG_E_LSIDE)  printf(" TFLAG_E_LSIDE");
	if(v & TFLAG_E_RSIDE)  printf(" TFLAG_E_RSIDE");
}

int main(int argc, char ** argv)
{
    if(open_eyelink_connection(0) !=0) // connect to the tracker
		return 0;

	// tell tracker to send HTARGET data
	eyecmd_printf("link_sample_data  = LEFT,RIGHT,GAZE,HREF,HTARGET,GAZERES,AREA,PUPIL,STATUS");

	// start recording
	if(start_recording(0,0,1,1) != 0)
	{
		INT16 eye_used = eyelink_eye_available();  // find which eye is available
		UINT32 st = current_time();
		while(st+20000>current_time()) // record for 20 seconds
		{

			ALLF_DATA f1;
			if(eyelink_newest_float_sample(&f1)>0) // get the newest float sample
			{
				printHTarget(f1.fs.hdata); // print the flags
			}
		}
		stop_recording(); // stop recording
	}
	else
	{
		printf("failed to start recording \n");
	}
	close_eyelink_system(); // close the connection
	return 1;

}
\endcode
</pre>

Example code to access sample status flags.
<pre>
\code
#include <stdio.h>
#include <core_expt.h>


void printStatus(UINT32 time,UINT16 v)
{
	printf("Status :%d %x\t",time,v);
	if(v & HPOS_TOP_WARNING)      printf("HPOS_TOP_WARNING ");
	if(v & HPOS_BOT_WARNING )     printf("HPOS_BOT_WARNING ");
	if(v & HPOS_LEFT_WARNING)     printf("HPOS_LEFT_WARNING ");
	if(v & HPOS_RIGHT_WARNING)    printf("HPOS_RIGHT_WARNING ");
	if(v & HPOS_WARNING)		  printf("HPOS_WARNING ");
	if(v & HPOS_ANGLE_WARNING  )  printf("HPOS_ANGLE_WARNING ");
	if(v & HPOS_MISSING_WARNING ) printf("HPOS_MISSING_WARNING ");
	if(v & HPOS_DISTANCE_WARNING )printf("HPOS_DISTANCE_WARNING ");

	printf("\n");
}



int main(int argc, char ** argv)
{
    if(open_eyelink_connection(0) !=0) // connect to the tracker
		return 0;

	// tell tracker to send HTARGET data
	eyecmd_printf("link_sample_data  = LEFT,RIGHT,GAZE,HREF,HTARGET,GAZERES,AREA,PUPIL,STATUS");

	// start recording
	if(start_recording(0,0,1,1) != 0)
	{
		INT16 eye_used = eyelink_eye_available();  // find which eye is available
		UINT32 st = current_time();
		while(st+20000>current_time()) // record for 20 seconds
		{

			ALLF_DATA f1;
			if(eyelink_newest_float_sample(&f1)>0) // get the newest float sample
			{
				printStatus(f1.fs.time,f1.fs.status); // print the flags
			}
		}
		stop_recording(); // stop recording
	}
	else
	{
		printf("failed to start recording \n");
	}
	close_eyelink_system(); // close the connection
	return 1;

}
\endcode
</pre>

@{
*/

// SAMPLE STATUS BITS:
// These are for eye or target at edges
//
            HPOS_TOP_WARNING      : 0x0080,    /*!<  Marker is in top border of image*/
            HPOS_BOT_WARNING      : 0x0040,    /*!<  Marker is in bottom border of image*/
            HPOS_LEFT_WARNING     : 0x0020,    /*!<  Marker is in left border of image*/
            HPOS_RIGHT_WARNING    : 0x0010,    /*!<  Marker is in right border of image*/
            HPOS_WARNING          : 0x00F0,             /*!<  Head too far from calibration */
//
// These flag target conditions:
//                                //
            HPOS_ANGLE_WARNING    : 0x0008,   /*!< Target at too great an angle for accuracy*/
            HPOS_MISSING_WARNING  : 0x0004,   /*!< Target is missing*/
            HPOS_DISTANCE_WARNING : 0x0001,   /*!< Target too close or too far*/




//
//  TARGET WARNINGS
            TFLAG_MISSING         : 0x4000,    /*!< Target missing*/
            TFLAG_ANGLE           : 0x2000,    /*!< Extreme target angle*/
            TFLAG_NEAREYE         : 0x1000,    /*!< Target near eye so windows overlapping*/
//  DISTANCE WARNINGS (limits set by remote_distance_warn_range command)
            TFLAG_CLOSE           : 0x0800,    /*!< distance vs. limits*/
            TFLAG_FAR             : 0x0400,
// TARGET TO CAMERA EDGE  (margin set by remote_edge_warn_pixels command)
            TFLAG_T_TSIDE         : 0x0080,    /*!< Target near top edge of image */
            TFLAG_T_BSIDE         : 0x0040,    /*!< Target near bottom edge of image */
            TFLAG_T_LSIDE         : 0x0020,    /*!< Target near left edge of image */
            TFLAG_T_RSIDE         : 0x0010,    /*!< Target near right edge of image */
// EYE TO CAMERA EDGE  (margin set by remote_edge_warn_pixels command)
            TFLAG_E_TSIDE         : 0x0008,    /*!< Eye near top edge of image */
            TFLAG_E_BSIDE         : 0x0004,    /*!< Eye near bottom edge of image */
            TFLAG_E_LSIDE         : 0x0002,    /*!< Eye near left edge of image */
            TFLAG_E_RSIDE         : 0x0001    /*!< Eye near right edge of image */
/*!
@}
*/
        }
    });
    
    return exports;
});
