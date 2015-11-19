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
define(["bridjs", "myclass", "log4js", "./eyelink", "./config", "./eye_data", "./core_expt"], function (bridjs, my, log4js, eyelink, config, eyeData, core_expt) {
    var Signature = bridjs.Signature, exports,log = log4js.getLogger("sdl_expt"), 
            SDL_Color, SDL_Surface, SDL_Palette, SDL_PixelFormat, SDL_Rect, CCDBS, getExButtonStates;
            
    CCDBS = bridjs.defineStruct({ // calibration control device button state structure
	userdata:{type:"void*", order:0},   // user data passed in with enable_external_calibration_device
	buttons:{type:"char[256]", order:1},  // set button[i] to 1 for pressed 0 to released
	internal:{type:"void*", order:2}   // for internal use.
    });        
            
    SDL_Rect = bridjs.defineStruct({
        x: {type:"int", order:0},
        y: {type:"int", order:1},
        w: {type:"int", order:2},
        h: {type:"int", order:3}
    }); 
            
    SDL_Color = bridjs.defineStruct({
        r: {type:"uint8", order:0},
        g: {type:"uint8", order:1},
        b: {type:"uint8", order:2},
        a: {type:"uint8", order:3}
    }); 
    
    SDL_Palette = bridjs.defineStruct({
        ncolors: {type:"int", order:0},
        colors: {type:bridjs.byPointer(SDL_Color), order:1},
        version: {type:"uint32", order:2},
        refcount: {type:"int", order:3}
    });
    
    SDL_PixelFormat = bridjs.defineStruct({
        format:       {type:"uint32", order:0},
        colors:       {type:bridjs.byPointer(SDL_Palette), order:1},
        BitsPerPixel: {type:"uint8", order:2},
        BytesPerPixel:{type:"uint8", order:3},
        padding:      {type:"uint8[2]", order:4},
        Rmask:        {type:"uint32", order:5},
        Gmask:        {type:"uint32", order:6},
        Bmask:        {type:"uint32", order:7},
        Amask:        {type:"uint32", order:8},
        Rloss:        {type:"uint8", order:9},
        Gloss:        {type:"uint8", order:10},
        Bloss:        {type:"uint8", order:11},
        Aloss:        {type:"uint8", order:12},
        Rshift:       {type:"uint8", order:13},
        Gshift:       {type:"uint8", order:14},
        Bshift:       {type:"uint8", order:15},
        Ashift:       {type:"uint8", order:16},
        refcount:     {type:"int", order:17},
        next:         {type:Signature.pointer, order:18}
    }); 
    
    SDL_Surface = bridjs.defineStruct({
        flags:      {type:"UIINT32", order:0},              /**< Read-only */
        format:     {type:bridjs.byPointer( SDL_PixelFormat), order:0},     /**< Read-only */
        w:         {type:"int", order:2}, 
        h:         {type:"int", order:3},                   /**< Read-only */
        pitch:      {type:"int", order:4},                  /**< Read-only */
        pixels:     {type:"void*", order:5},               /**< Read-write */

        /** Application data associated with the surface */
        userdata:   {type:"void*", order:6},             /**< Read-write */

        /** information needed for surfaces requiring locks */
        locked:    {type:"int", order:7},                 /**< Read-only */
        lock_data: {type:"void*", order:8},            /**< Read-only */

        /** clipping information */
        clip_rect:  {type:SDL_Rect, order:9},          /**< Read-only */

        /** info for fast blit mapping to other surfaces */
        map:     {type:"void*", order:10},//struct SDL_BlitMap *map;    /**< Private */

        /** Reference count -- used when freeing surface */
        refcount: {type:"int", order:11}              /**< Read-mostly */
    }); 
    
    getExButtonStates = bridjs.defineFunction("int (ELCALLBACK *getExButtonStates)(CCDBS *)", {CCDBS:CCDBS})
    
    exports = bridjs.defineModule({
        STATIC: {
           SDL_Color:SDL_Color,
           SDL_Surface:SDL_Surface,
           SDL_Rect: SDL_Rect,
           SDL_Palette: SDL_Palette,
           SDL_PixelFormat:SDL_PixelFormat,
           CCDBS: CCDBS,
           getExButtonStates:getExButtonStates
        },
        constructor: function () {
            try{
               
            }catch(e){
                log.info(e);
            }
        },
        /*! Passes the colors of the display background and fixation target to the
                EXPTSPPT library.  During calibration, camera image display, and drift
                correction, the display background should match the brightness of the
                experimental stimuli as closely as possible, in order to maximize tracking
                accuracy.  This function passes the colors of the display background and
                fixation target to the EXPTSPPT library.  This also prevents flickering of
                the display at the beginning and end of drift correction.

                @param fg Color used for drawing calibration target.
                @param bg Color used for drawing calibration background.

                \b Example: See \c do_tracker_setup()

                \sa \c do_tracker_setup()
         */
        setCalibrationColors: bridjs.defineFunction("void  ELCALLTYPE  set_calibration_colors(SDL_Color *fg, SDL_Color* bg)", {SDL_Color:SDL_Color}),
        /*! The standard calibration and drift correction target is a disk (for
	peripheral delectability) with a central "hole" target (for accurate
	fixation).  The sizes of these features may be set with this function.

  	@param diameter Size of outer disk, in pixels.
	@param holesize Size of central feature.  If \c &lt;holesize&gt; is \c 0,
					no central feature will be drawn.

	\b Example: See \c do_tracker_setup()

	\sa \c do_tracker_setup()
        */
        setTargetSize:  bridjs.defineFunction("void  ELCALLTYPE  set_target_size(UINT16 diameter, UINT16 holesize)"),//void  ELCALLTYPE  set_target_size(UINT16 diameter, UINT16 holesize);
    
        /*! Selects the sounds to be played during \c do_tracker_setup(), including
	calibration, validation and drift correction.  These events are the
	display or movement of the target, successful conclusion of calibration
	or good validation, and failure or interruption of calibration or validation.

	@remarks If no sound card is installed, the sounds are produced as "beeps"
	from the PC speaker.  Otherwise, sounds can be selected by passing a string.
	If the string is "" (empty), the default sounds are played.  If the string
	is "off", no sound will be played for that event.  Otherwise, the string
	should be the name of a .WAV file to play.
	@param ontarget Sets sound to play when target moves.
	@param ongood Sets sound to play on successful operation.
	@param onbad Sets sound to play on failure or interruption.

	\b Example: See \c do_tracker_setup()

	\sa \c do_tracker_setup() and \c set_dcorr_sounds()
        */
        setCalSounds: bridjs.defineFunction("void  ELCALLTYPE  set_cal_sounds(char *ontarget, char *ongood, char *onbad)"),
        
        /*! Selects the sounds to be played during \c do_drift_correct().  These events
	are the display or movement of the target, successful conclusion of drift
	correction, and pressing the 'ESC' key to start the Setup menu.

	@remarks If no sound card is installed, the sounds are produced as "beeps"
	from the PC speaker.  Otherwise, sounds can be selected by passing a string.
	If the string is "" (empty), the default sounds are played.  If the string
	is "off", no sound will be played for that event.  Otherwise, the string
	should be the name of a .WAV file to play.
	@param ontarget Sets sound to play when target moves.
	@param ongood Sets sound to play on successful operation.
	@param onbad Sets sound to play on failure or interruption.

	\b Example: See \c do_tracker_setup()

	\sa \c do_tracker_setup() and \c set_cal_sounds()
        */
        setDcorrSounds: bridjs.defineFunction("void  ELCALLTYPE  set_dcorr_sounds(char *ontarget, char *ongood, char *onbad)"),
        
        /*!
 	To adjust camera image position. By default the camera is placed at the
 	centre of the screen.

	@param left Left position.
	@param top Top position.
	@param right Right position.
	@param bottom Bottom position.
        */
        setCameraImagePosition: bridjs.defineFunction("INT16 ELCALLTYPE  set_camera_image_position(INT16 left, INT16 top,INT16 right, INT16 bottom)"),
        
        /*! Measures parameters of the current display mode, and fills a \c DISPLAYINFO
	structure with the data.  This process may take over 100 milliseconds, as
	it measures actual refresh rate.  The returned data can be used to compute
	sizes for drawing, and to check that the current display mode matches the
	requirements of the experiment.  A global \c DISPLAYINFO structure called
	dispinfo should be set up at the start of the program if you wish to use
	the \c SCRWIDTH and \c SCRHEIGHT macros.

	@remarks This is the contents of the \c DISPLAYINFO structure:
	\code
	typedef struct
	{
	     INT32 left;      // left of display
	     INT32 top;       // top of display
	     INT32 right;     // right of display
	     INT32 bottom;    // bottom of display
	     INT32 width;     // width of display
	     INT32 height;    // height of display
	     INT32 bits;      // bits per pixel
	     INT32 palsize;   // total entries in palette (0 if not indexed)
	     INT32 palrsvd;   // number of static entries in palette
	     INT32 pages;     // pages supported
	     float refresh;   // refresh rate in Hz
	     INT32 winnt;     // 0 for 9x/Me, 1 for NT, 2 for 2000, 3 for XP
	} DISPLAYINFO;
	\endcode
	If refresh cannot be measured, the "refresh" field will contain a value less than 40.
	@param di Pointer to \c DISPLAYINFO structure to fill.
        */
        getDisplayInformation: bridjs.defineFunction("void  ELCALLTYPE  get_display_information(DISPLAYINFO *di)", {DISPLAYINFO:core_expt.DISPLAYINFO}),
        
        /*! You must always create a borderless, full-screen window for your experiment.
	This function registers the window with EXPTSPPT so it may be used for
	calibration and drift correction.  The window should not be destroyed until
	it is released with \c close_expt_graphics(). This window will be subclassed
	(some messages intercepted) during calibration and drift correction.

	@param hwnd Handle of window that is to be used for calibration and drift
				correction.  If \c NULL is passed in, SDL initialized and 
				requested display mode is set.
	@param info \c NULL or pointer to a \c DISPLAYINFO structure to fill with
				display mode data.  If \c NULL is passed in, current display mode is
				used.
	@return \c 0 if success, \c -1 if error occurred internally.
	
	Default initialization of eyelinkn_core_library:
	\code
	int defaultGraphicsSetup()
	{
		DISPLAYINFO disp;
		memset(&disp,0,sizeof(DISPLAYINFO));
		
		disp.width =640;
		disp.height = 480;
		disp.bits =32;
		disp.refresh = 60;
		if(init_expt_graphics(NULL, &disp))
		{
			printf("init_expt_graphics failed \n");
			return -1;
		}
		return 0;
	}
	\endcode
	
	
	Custom initialization of SDL can be done in the following manner. 
	\code
	int customGraphicsSetup()
	{
		SDL_Surface *mainwindow = NULL;
		if ( SDL_Init(SDL_INIT_VIDEO) < 0 ) // initialize SDL
		{
			printf("Couldn't initialize SDL: %s!",SDL_GetError());
			return -1;
		}
		
		mainwindow = SDL_SetVideoMode(800,600,32,SDL_SWSURFACE|SDL_FULLSCREEN); // set video mode
		if(!mainwindow)
		{
			printf("Failed to set video mode: %s! ",SDL_GetError());
			return -1;
		}
		if(init_expt_graphics(mainwindow, NULL)) // tell core graphics to use the set video mode.
			return -1;
		return 0;
	}
	@remark eyelink_core_graphics library does not support OPENGL.
	\endcode

        */
        initExptGraphics: bridjs.defineFunction("INT16 ELCALLTYPE  init_expt_graphics(SDL_Surface * hwnd, DISPLAYINFO *info)", {SDL_Surface: SDL_Surface,DISPLAYINFO:core_expt.DISPLAYINFO}),
        

        /*! Call this function at the end of the experiment or before destroying the
                window registered with \c init_expt_graphics().  This call will disable
                calibration and drift correction until a new window is registered.
         */
        closeExptGraphics: bridjs.defineFunction("void  ELCALLTYPE  close_expt_graphics(void)"),
        
        /*! This function saves the entire bitmap as a .BMP, .JPG, .PNG, or .TIF file,
	and transfers the image to tracker as backdrop for gaze cursors (See
	\c bitmap_save() and \c bitmap_to_backdrop() for more information).

	@param hbm Handle to the bitmap image.
	@param xs Specifies the x-coordinate of the upper-left corner of the source
				bitmap.
	@param ys Specifies the y-coordinate of the upper-left corner of the source
				bitmap.
	@param width Specify the width of the source image to be copied  (set to \c 0
				to use all).
	@param height Specify the height of the source image to be copied  (set to
				\c 0 to use all).
	@param fname Name of the image file to be saved.  Currently, only .PNG, .BMP,
				.JPG, and .TIF files are saved.
	@param path Directory or drive path in quotes ("." for current directory).
	@param sv_options Use \c SV_NOREPLACE if not to replace an existing file;
				use \c SV_MAKEPATH to create a new path.
	@param xd Specifies the x-coordinate of the upper-left corner of the tracker
				screen.
	@param yd Specifies the y-coordinate of the upper-left corner of the tracker
				screen.
	@param bx_options Set with a bitwise OR of the following constants:
				\c BX_MAXCONTRAST: Maximizes contrast for clearest image;
				\c BX_AVERAGE: averages combined pixels;
				\c BX_DARKEN: chooses darkest (keep thin dark lines);
				\c BX_LIGHTEN: chooses darkest (keep thin white lines);
				\c BX_NODITHER: disables dithering to get clearest text;
				\c BX_GREYSCALE: converts to grayscale.
	@return \c 0 if successful, \c -1 if couldn't save, \c -2 if couldn't transfer
        */
        sdlBitmapSaveAndBackdrop: bridjs.defineFunction("int ELCALLTYPE sdl_bitmap_save_and_backdrop(SDL_Surface * hbm, INT16 xs, INT16 ys, INT16 width, INT16 height,char *fname, char *path, INT16 sv_options,INT16 xd, INT16 yd, UINT16 bx_options)", {SDL_Surface: SDL_Surface}),
        
        /*! This function transfers the bitmap to the tracker PC as backdrop for gaze cursors.
	The field "bx_options", set with bitwise OR of the following constants, determines
	how bitmap is processed: \c BX_AVERAGE (averaging combined pixels), \c BX_DARKEN
	(choosing darkest and keep thin dark lines), and \c BX_LIGHTEN (choosing darkest
	and keep thin white lines) control how bitmap size is reduced to fit tracker display;
	\c BX_MAXCONTRAST maximizes contrast for clearest image; \c BX_NODITHER disables
	the dithering of the image; \c BX_GREYSCALE converts the image to grayscale
	(grayscale works best for EyeLink I, text, etc.)

	@param hbm Handle to the bitmap image.
	@param xs Specifies the x-coordinate of the upper-left corner of the source bitmap.
	@param ys Specifies the y-coordinate of the upper-left corner of the source bitmap.
	@param width Specify the width of the source image to be copied  (set to \c 0 to
				use all).
	@param height Specify the height of the source image to be copied  (set to \c 0 to
				use all).
	@param xd Specifies the x-coordinate of the upper-left corner of the tracker screen.
	@param yd Specifies the y-coordinate of the upper-left corner of the tracker screen.
	@param bx_options Set with a bitwise OR of the following constants:
				\c BX_MAXCONTRAST: Maximizes contrast for clearest image;
				\c BX_AVERAGE: averages combined pixels;
				\c BX_DARKEN: chooses darkest (keep thin dark lines);
				\c BX_LIGHTEN: chooses darkest (keep thin white lines);
				\c BX_NODITHER: disables dithering to get clearest text;
				\c BX_GREYSCALE: converts to grayscale.
	@return \c 0 if successful, else \c -1 or \c -2;
        */
        sdlBitmapToBackdrop: bridjs.defineFunction("int ELCALLTYPE sdl_bitmap_to_backdrop(SDL_Surface * hbm, INT16 xs, INT16 ys,INT16 width, INT16 height,INT16 xd, INT16 yd, UINT16 bx_options)", 
                            {SDL_Surface:SDL_Surface}),
        
        /*! This function saves the entire bitmap or selected part of a bitmap in an image file
	(with an extension of .png, .bmp, .jpg, or .tif). It creates the specified file if
	this file does not exist.  If the file exists, it replaces the file unless
	\c SV_NOREPLACE is specified in the field of "sv_options". The directory to which
	the file will be written is specified in the path field.

	@param hbm Handle to the bitmap image.
	@param xs Specifies the x-coordinate of the upper-left corner of the source bitmap.
	@param ys Specifies the y-coordinate of the upper-left corner of the source bitmap.
	@param width Specify the width of the source image to be copied  (set to \c 0 to use all).
	@param height Specify the height of the source image to be copied  (set to \c 0 to use all).
	@param fname Name of the image file to be saved.  Currently, only .PNG, .BMP, .JPG,
				and .TIF files are saved.
	@param path Directory or drive path in quotes ("." for current directory).
	@param sv_options Use \c SV_NOREPLACE if not to replace an existing file; use \c SV_MAKEPATH to create a new path.
	@return \c 0 if successful, else \c -1.
        */
        sdlBitmapSave: bridjs.defineFunction("int ELCALLTYPE sdl_bitmap_save(SDL_Surface * hbm, INT16 xs, INT16 ys, INT16 width, INT16 height,char *fname, char *path, INT16 sv_options)",{SDL_Surface:SDL_Surface}), 
        /*!
	Allow one to set arbituary target in place of circle target. Eg. a custom cursor.
	@param surface
        */
        setCalTargetSurface: bridjs.defineFunction("void ELCALLBACK set_cal_target_surface(SDL_Surface *surface)",{SDL_Surface:SDL_Surface}),
        
        /*!
	Allow one to set arbituary background in place of flat background
 	@param surface
        */
        setCalBackgroundSurface: bridjs.defineFunction("void ELCALLBACK set_cal_background_surface(SDL_Surface *surface)",{SDL_Surface:SDL_Surface}),
        
        /*!
	Removes the custom background. equivalent of calling set_cal_background_surface(NULL);
        */
        resetBackgroundSurface: bridjs.defineFunction("void ELCALLBACK reset_background_surface()"),
        
        /*! @internal
        */
        disableCustombackgroundOnImagemode: bridjs.defineFunction("void ELCALLBACK disable_custombackground_on_imagemode()"),// disables the use of custom background on image mode.
    
        /*!
	Allow one to set target with animation.  The expected video can be loadable using VFW(type 1 avi) also,
	both audio and video streams must be present. The audio stream must be of pcm type.

	@param aviname  Name of the avi to use
	@param playCount How many time to loop through the video. Specify -1 to loop indefinitely.
	@options for future use.
        */
       setCalAnimationTarget: bridjs.defineFunction("int ELCALLBACK set_cal_animation_target(const char *aviName,int playCount, int options)"),
       /*!
	Enables non keyboard devices to be used for calibration control.
 	@param[in] buttonStatesfcn   callback function reads the device and returns appropriate data.
	@remark: Use EXTERNAL_DEV_NONE to disable the device.
			 Use EXTERNAL_DEV_CEDRUS for built-in cedrus device support.

	@param[in] config - A character string of the config file content or config file name. Whether the  config is 
	the content or a file name is determined by looking for a new line character. If there is a new line character the
	content is assumed.  To use the default config, 
	set the parameter to NULL. The default config will be:
	@code
        # User mode definition
        # [MODE n] 
        # Defines a 'user' mode, where n is the mode ID
        # Valid Commands for user mode:
        #	TEXT_LINE "This is a line of text"
        # 	DISPLAY_IMAGE
        # 	BUTTON id button_command [command args]
        # 		Valid BUTTON button_commands:
        # 			NO_ACTION
        #
        # 			AUTO_THRESH
        # 			PUPIL_THRESH_UP
        # 			PUPIL_THRESH_DOWN
        # 			CR_THRESH_UP
        # 			CR_THRESH_DOWN
        #
        # 			START_CALIBRATION
        # 			START_VALIDATION
        #			START_DRIFT_CORRECT
        #
        # 			GOTO_MODE
        # 			EXIT
        #
        # 			NEXT_IMAGE (only makes sense when DISPLAY_IMAGE is set for mode)
        # 			PREV_IMAGE (only makes sense when DISPLAY_IMAGE is set for mode)
        #
        # Predefined modes
        # [MODE C] 
        # Calibration mode
        # Valid Commands
        # 	REDO_LAST_TARGET
        # 	ACCEPT_TARGET
        #
        # [MODE V]
        # Validation mode
        # Valid Commands
        # 	REDO_LAST_TARGET
        # 	ACCEPT_TARGET
        #
        # [MODE D]
        # Drift Correction mode
        # Valid Commands
        # 	ACCEPT_TARGET

        [MODE 1]
        TEXT_LINE "EyeLink Setup:"
        TEXT_LINE "1 -> View Camera Images"
        TEXT_LINE "2 -> Start Calibration"
        TEXT_LINE "3 -> Start Validation"
        TEXT_LINE "4 -> Exit EyeLink Setup"

        BUTTON 1 GOTO_MODE 2
        BUTTON 2 GOTO_MODE C
        BUTTON 3 GOTO_MODE V
        BUTTON 4 EXIT




        [MODE 2]
        TEXT_LINE "Camera Views:"
        TEXT_LINE "1 -> Next Camera View"
        TEXT_LINE "2 -> Previous Camera View"
        TEXT_LINE "3 -> Go To Pupil Threshold Adjustment Mode"
        TEXT_LINE "4 -> Exit EyeLink Setup"


        BUTTON 1 NEXT_IMAGE
        BUTTON 2 PREV_IMAGE
        BUTTON 3 GOTO_MODE 3
        BUTTON 4 EXIT
        DISPLAY_IMAGE TRUE


        [MODE 3]
        TEXT_LINE "Pupil Threshold Adjustment:"
        TEXT_LINE "1 -> Increase Threshold"
        TEXT_LINE "2 -> Decrease Threshold"
        TEXT_LINE "3 -> Auto Threshold"
        TEXT_LINE "4 -> Go To CR Threshold Adjustment Mode"

        BUTTON 1 PUPIL_THRESH_UP
        BUTTON 2 PUPIL_THRESH_DOWN
        BUTTON 3 AUTO_THRESH
        BUTTON 4 GOTO_MODE 4
        DISPLAY_IMAGE TRUE


        [MODE 4]
        TEXT_LINE "CR Threshold Adjustment:"
        TEXT_LINE "1 -> Increase Threshold" 
        TEXT_LINE "2 -> Decrease Threshold" 
        TEXT_LINE "3 -> Auto Threshold" 
        TEXT_LINE "4 -> Go To EyeLink Setup Mode" 


        BUTTON 1 CR_THRESH_UP
        BUTTON 2 CR_THRESH_DOWN
        BUTTON 3 AUTO_THRESH
        BUTTON 4 GOTO_MODE 1
        DISPLAY_IMAGE TRUE


        [MODE C]
        BUTTON 1 ACCEPT_TARGET
        BUTTON 2 REDO_LAST_TARGE
        BUTTON 4 EXIT

        [MODE V]
        BUTTON 1 ACCEPT_TARGET
        BUTTON 2 REDO_LAST_TARGE
        BUTTON 4 EXIT

        [MODE D]
        BUTTON 1 ACCEPT_TARGET
        BUTTON 4 EXIT

                @endcode

                @param[in] userData  user data to pass back in the callback.
                @return 1 upon success, 0 otherwise


         */
        enableExternalCalibrationDevice: bridjs.defineFunction("int ELCALLTYPE enable_external_calibration_device(getExButtonStates buttonStatesfcn, const char * config, void *userData)", {getExButtonStates:getExButtonStates}),
    
        /*
        for internal use only.  Do not use this function.
        */
        setCalFont: bridjs.defineFunction("void ELCALLBACK set_cal_font(const char * fontPath, int size)")
    }, config.GRAPHICS_LIBRARY);
    return exports;
});
