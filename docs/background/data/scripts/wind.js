////////////////////////////////////////////////////////////////////////////////////
//*------------------------------------------------------------------------------*//
//|     _    _ _____ _   _ _____      ______ _   _  _____ _____ _   _ ______     |//
//|    | |  | |_   _| \ | |  __ \    |  ____| \ | |/ ____|_   _| \ | |  ____|    |//
//|    | |  | | | | |  \| | |  | |   | |__  |  \| | |  __  | | |  \| | |__       |//
//|    | |/\| | | | |     | |  | |   |  __| |     | | |_ | | | |     |  __|      |//
//|    \  /\  /_| |_| |\  | |__| |   | |____| |\  | |__| |_| |_| |\  | |____     |//
//|     \/  \/|_____|_| \_|_____/    |______|_| \_|\_____|_____|_| \_|______|    |//
//|                                                                              |//
//*------------------------------------------------------------------------------*//
////////////////////////////////////////////////////////////////////////////////////
//*------------------------------------------------------------------------------*//
//| Wind Engine v0.0.1a (http://www.maus-games.at)                               |//
//*------------------------------------------------------------------------------*//
//| Copyright (c) 2014 Martin Mauersics                                          |//
//|                                                                              |//
//| This software is provided 'as-is', without any express or implied            |//
//| warranty. In no event will the authors be held liable for any damages        |//
//| arising from the use of this software.                                       |//
//|                                                                              |//
//| Permission is granted to anyone to use this software for any purpose,        |//
//| including commercial applications, and to alter it and redistribute it       |//
//| freely, subject to the following restrictions:                               |//
//|                                                                              |//
//|   1. The origin of this software must not be misrepresented; you must not    |//
//|   claim that you wrote the original software. If you use this software       |//
//|   in a product, an acknowledgment in the product documentation would be      |//
//|   appreciated but is not required.                                           |//
//|                                                                              |//
//|   2. Altered source versions must be plainly marked as such, and must not be |//
//|   misrepresented as being the original software.                             |//
//|                                                                              |//
//|   3. This notice may not be removed or altered from any source               |//
//|   distribution.                                                              |//
//*------------------------------------------------------------------------------*//
////////////////////////////////////////////////////////////////////////////////////
"use strict";
var WIND = {};


// ****************************************************************
// get URL parameters
var asQueryParam = function()
{
    var asOutput = {};
    var asList   = window.location.search.substring(1).split("&");

    // loop through all parameters
    for(var i = 0; i < asList.length; ++i)
    {
        // seperate key from value
        var asPair = asList[i].split("=");

        // insert value into map
        if(typeof asOutput[asPair[0]] === "undefined")
            asOutput[asPair[0]] = asPair[1];                          // create new entry
        else if(typeof asOutput[asPair[0]] === "string")
            asOutput[asPair[0]] = [asOutput[asPair[0]], asPair[1]];   // extend into array
        else
            asOutput[asPair[0]].push(asPair[1]);                      // append to array
    }

    return asOutput;
}();


// ****************************************************************
var GL  = null;                           // WebGL context
var TEX = null;                           // texture context

WIND.g_pCanvas  = null;                   // main canvas
WIND.g_pTexture = null;                   // texture canvas
WIND.g_pAudio   = null;                   // audio stream

WIND.g_pMenuLogo    = null;               // main logo
WIND.g_pMenuHeader  = null;               // game header
WIND.g_pMenuOption1 = null;               // menu option first
WIND.g_pMenuOption2 = null;               // menu option second
WIND.g_pMenuRight   = null;               // text bottom right
WIND.g_pMenuLeft    = null;               // text bottom left
WIND.g_pMenuVideo   = null;               // text top right
WIND.g_pMenuAudio   = null;               // text top left
WIND.g_pMenuStart   = null;               // button start
WIND.g_pMenuEnd     = null;               // button end
WIND.g_pMenuFull    = null;               // button fullscreen
WIND.g_pMenuQuality = null;               // button quality
WIND.g_pMenuMusic   = null;               // button music
WIND.g_pMenuSound   = null;               // button sound

WIND.g_mProjection = mat4.create();       // global projection matrix
WIND.g_mCamera     = mat4.create();       // global camera matrix

WIND.g_vCamPosition    = vec3.create();   // camera position
WIND.g_vCamTarget      = vec3.create();   // camera target
WIND.g_vCamOrientation = vec3.create();   // camera orientation

WIND.g_vMousePos   = vec2.create();       // current position of the cursor [-V/2, V/2]
WIND.g_fMouseRect  = vec2.create();       // transformed canvas-rect values required for mouse position calculations
WIND.g_fMouseRange = 0.0;                 // mouse position range factor

WIND.g_fSaveTime  = 0.0;                  // saved time value to calculate last frame time
WIND.g_fTotalTime = 0.0;                  // total time since start of the application
WIND.g_fTime      = 0.0;                  // last frame time

WIND.g_iMusicCurrent = 0;                 // current music file

WIND.g_bQuality = true;                   // current quality level
WIND.g_bMusic   = true;                   // current music status
WIND.g_bSound   = true;                   // current sound status

WIND.g_iRequestID = 0;                    // ID from requestAnimationFrame()

WIND.g_mMatrix = mat4.create();           // pre-allocated general purpose matrix
WIND.g_vVector = vec4.create();           // pre-allocated general purpose vector


// ****************************************************************
WIND.Init = function()
{
    // retrieve main canvas
    WIND.g_pCanvas = document.getElementById("canvas");

    // define WebGL context properties (with stencil buffer)
    var abProperty = {alpha : true, depth : true, stencil : false, antialias : true,
                      premultipliedAlpha : true, preserveDrawingBuffer : false};

    // retrieve WebGL context
    GL = WIND.g_pCanvas.getContext("webgl", abProperty);
    if(!GL)
    {
        GL = WIND.g_pCanvas.getContext("experimental-webgl", abProperty);
        if(!GL)
        {
            // show error page
            document.body.style.background = "#FAFAFF";
            document.body.innerHTML = "<p style='font: bold 16px sans-serif; position: absolute; left: 50%; top: 50%; width: 400px; height: 140px; margin: -70px 0 0 -200px; text-align: center;'>" +
                                      "<img src='data/images/webgl_logo.png' alt='WebGL' width='163' height='75' /><br/>" +
                                      "Your browser sucks and doesn't support WebGL.<br/>" +
                                      "Visit <a href='http://get.webgl.org/' style='color: blue;'>http://get.webgl.org/</a> for more information.</p>";
            return;
        }

        // save experimental WebGL status
        GL.bIsExperimental = true;
    }
    else GL.bIsExperimental = false;

    // retrieve texture canvas and 2d context
    WIND.g_pTexture = document.getElementById("texture");
    TEX = WIND.g_pTexture.getContext("2d");

    // setup system components
    WIND.SetupVideo();
    WIND.SetupAudio();
    WIND.SetupInput();
    WIND.SetupMenu();
    WIND.SetupRefresh();

    // init resource classes
    windModel.Init();
    windTexture.Init();
    windShader.Init();
    windSound.Init();

    // resize everything dynamically
    document.body.onresize = WIND.Resize;
    WIND.Resize();

    // init application
    APP.Init();

    // start engine (requestAnimationFrame in Move())
    WIND.Move();
};


// ****************************************************************
window.addEventListener("beforeunload", function()   // WIND.Exit()
{
    if(!GL) return;

    // exit application
    APP.Exit();

    // cancel last animation frame
    window.cancelAnimationFrame(WIND.g_iRequestID);
}, false);


// ****************************************************************
WIND.Render = function(iNewTime)
{
    // calculate elapsed and total time
    var fNewSaveTime = iNewTime * 0.001;
    var fNewTime     = Math.abs(fNewSaveTime - WIND.g_fSaveTime);
    WIND.g_fSaveTime      = fNewSaveTime;

    // smooth out inconsistent framerates
    WIND.g_fTime       = (fNewTime > 0.125) ? 0.0 : (0.85*WIND.g_fTime + 0.15*fNewTime);
    WIND.g_fTotalTime += WIND.g_fTime;

    // clear framebuffer
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    // render application
    APP.Render();

    // move engine
    WIND.Move();
}


// ****************************************************************
WIND.Move = function()
{
    // move application
    APP.Move();
    
    // update camera matrix
    mat4.lookAt(WIND.g_mCamera, WIND.g_vCamPosition, WIND.g_vCamTarget, WIND.g_vCamOrientation);

    // request next frame
    GL.flush(); // just in case, but not required
    WIND.g_iRequestID = requestAnimationFrame(WIND.Render, WIND.g_pCanvas);
}


// ****************************************************************
WIND.SetupVideo = function()
{
    // enable depth testing
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    GL.polygonOffset(1.1, 4.0);
    GL.clearDepth(1.0);

    // enable culling
    GL.enable(GL.CULL_FACE);
    GL.cullFace(GL.BACK);
    GL.frontFace(GL.CCW);

    // enable alpha blending
    GL.enable(GL.BLEND);
    GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);

    // reset scene
    GL.clearColor(0.0, 0.0, 0.0, 1.0);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
};
    
    
// ****************************************************************
WIND.SetupAudio = function()
{
    if(!APP.MUSIC_LIST.length) return;

    // retrieve audio stream and load first music file
    WIND.g_pAudio     = document.getElementById("stream");
    WIND.g_pAudio.src = APP.MUSIC_LIST[WIND.g_iMusicCurrent];

    // add event for endless music loop
    WIND.g_pAudio.addEventListener("ended", function()
    {
        // play next music file
        if(++WIND.g_iMusicCurrent >= APP.MUSIC_LIST.length) WIND.g_iMusicCurrent = 0;
        this.src = APP.MUSIC_LIST[WIND.g_iMusicCurrent];
        this.play();
    });
};


// ****************************************************************
WIND.SetupInput = function()
{
    // implement mouse event movement
    document.addEventListener("mousemove", function(pCursor)
    {
        // set mouse position relative to the canvas
        WIND.g_vMousePos[0] = pCursor.clientX*WIND.g_fMouseRange - WIND.g_fMouseRect[0];
        WIND.g_vMousePos[1] = pCursor.clientY*WIND.g_fMouseRange - WIND.g_fMouseRect[1];

        return true;
    }, false);

    // implement touch event movement
    document.addEventListener("touchmove", function(pEvent)
    {
        // get touch input
        pEvent.preventDefault();
        var pTouch = pEvent.touches[0];
        if(pEvent.touches.length >= 3) APP.PauseGame(true);

        // set mouse position relative to the canvas
        WIND.g_vMousePos[0] = pTouch.pageX*WIND.g_fMouseRange - WIND.g_fMouseRect[0];
        WIND.g_vMousePos[1] = pTouch.pageY*WIND.g_fMouseRange - WIND.g_fMouseRect[1];
    }, false);

    // implement pause
    document.addEventListener("keydown", function(pEvent)
    {
        pEvent   = window.event || pEvent;
        var iKey = pEvent.charCode || pEvent.keyCode;

        // check for enter, escape and whitespace
        if(iKey === 13 || iKey === 27 || iKey === 32)
            APP.PauseGame(true);
        else
            APP.KeyDown(iKey);
    }, false);

    // implement auto-pause if window-focus is lost
    window.addEventListener("blur", function() {APP.PauseGame(true);}, false);
};


// ****************************************************************
WIND.SetupMenu = function()
{
    // get all menu elements
    WIND.g_pMenuLogo    = document.getElementById("logo");
    WIND.g_pMenuHeader  = document.getElementById("text-header");
    WIND.g_pMenuOption1 = document.getElementById("text-option-1");
    WIND.g_pMenuOption2 = document.getElementById("text-option-2");
    WIND.g_pMenuRight   = document.getElementById("text-bottom-right");
    WIND.g_pMenuLeft    = document.getElementById("text-bottom-left");
    WIND.g_pMenuVideo   = document.getElementById("text-top-right");
    WIND.g_pMenuAudio   = document.getElementById("text-top-left");
    WIND.g_pMenuStart   = document.getElementById("start");
    WIND.g_pMenuEnd     = document.getElementById("end");
    WIND.g_pMenuFull    = document.getElementById("fullscreen");
    WIND.g_pMenuQuality = document.getElementById("quality");
    WIND.g_pMenuMusic   = document.getElementById("music");
    WIND.g_pMenuSound   = document.getElementById("sound");

    // implement start button
    WIND.g_pMenuStart.addEventListener("mousedown", function()
    {
        // call start function
        APP.StartGame();
    }, false);

    // implement fullscreen button
    WIND.g_pMenuFull.addEventListener("click", function()
    {
        if(document.fullscreenElement       || document.mozFullScreenElement ||
           document.webkitFullscreenElement || document.msFullscreenElement)
        {
            // disable fullscreen mode
                 if(document.exitFullscreen)       document.exitFullscreen();
            else if(document.mozCancelFullScreen)  document.mozCancelFullScreen();
            else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
            else if(document.msExitFullscreen)     document.msExitFullscreen();
        }
        else
        {
            var pDoc = document.documentElement;
            
            // enable fullscreen mode
                 if(pDoc.requestFullscreen)       pDoc.requestFullscreen();
            else if(pDoc.mozRequestFullScreen)    pDoc.mozRequestFullScreen();
            else if(pDoc.webkitRequestFullscreen) pDoc.webkitRequestFullscreen();
            else if(pDoc.msRequestFullscreen)     pDoc.msRequestFullscreen();
        }
    }, false);

    // implement quality button
    WIND.g_pMenuQuality.addEventListener("mousedown", function()
    {
        WIND.g_bQuality = !WIND.g_bQuality;
        this.style.color = WIND.g_bQuality ? "" : "#444444";

        // call change function
        APP.ChangeOptionQuality(WIND.g_bQuality);
    }, false);

    // implement volume buttons
    WIND.g_pMenuMusic.addEventListener("mousedown", function()
    {
        WIND.g_bMusic = !WIND.g_bMusic;
        this.style.color = WIND.g_bMusic ? "" : "#444444";

        // call change function
        APP.ChangeOptionMusic(WIND.g_bMusic);
    }, false);
    WIND.g_pMenuSound.addEventListener("mousedown", function()
    {
        WIND.g_bSound = !WIND.g_bSound;
        this.style.color = WIND.g_bSound ? "" : "#444444";

        // call change function
        APP.ChangeOptionSound(WIND.g_bSound);
    }, false);

    // adjust back button
    WIND.g_pMenuOption2.innerHTML = "<font id='end'><a href='javascript:history.go(-" + (asQueryParam["launcher"] ? 2 : 1) + ")'>Go Back</a></font>";
};


// ****************************************************************
WIND.SetupRefresh = function()
{
    var iLastTime = 0;
    var asVendor  = ["moz", "webkit", "ms", "o"];

    // unify different animation functions
    for(var i = 0; i < asVendor.length && !window.requestAnimationFrame; ++i)
    {
        window.requestAnimationFrame = window[asVendor[i] + "RequestAnimationFrame"];
        window.cancelAnimationFrame  = window[asVendor[i] + "CancelAnimationFrame"] || window[asVendor[i] + "CancelRequestAnimationFrame"];
    }

    // implement alternatives on missing animation functions
    if(!window.requestAnimationFrame)
    {
        window.requestAnimationFrame = function(pCallback)
        {
            var iCurTime = new Date().getTime();
            var iTime    = Math.max(0, 16 - (iCurTime - iLastTime));

            iLastTime = iCurTime + iTime;
            return window.setTimeout(function() {pCallback(iLastTime);}, iTime);
        };
        window.cancelAnimationFrame = function(iID) {clearTimeout(iID);};
    }
};


// ****************************************************************
WIND.Resize = function()
{
    // resize canvas
    WIND.g_pCanvas.width  = window.innerWidth  - (asQueryParam["launcher"] ? 2 : 0);
    WIND.g_pCanvas.height = window.innerHeight - (asQueryParam["launcher"] ? 2 : 0);
    if(asQueryParam["launcher"] ) WIND.g_pCanvas.style.marginTop = "1px";

    // resize font
    document.body.style.fontSize = (WIND.g_pCanvas.height/800.0) * 100.0 + "%";

    // center logo
    WIND.g_pMenuLogo.style.marginLeft = -WIND.g_pMenuLogo.naturalWidth/WIND.g_pMenuLogo.naturalHeight * WIND.g_pCanvas.height*0.18*0.5 + "px";

    // resize menu
    var sWidth = WIND.g_pCanvas.width + "px";
    WIND.g_pMenuHeader.style.width  = sWidth;
    WIND.g_pMenuOption1.style.width = sWidth;
    WIND.g_pMenuOption2.style.width = sWidth;
    
    var sMargin = -WIND.g_pCanvas.width*0.5 + "px";
    WIND.g_pMenuHeader.style.marginLeft  = sMargin;
    WIND.g_pMenuOption1.style.marginLeft = sMargin;
    WIND.g_pMenuOption2.style.marginLeft = sMargin;

    // set viewport and projection matrix
    GL.viewport(0, 0, WIND.g_pCanvas.width, WIND.g_pCanvas.height);
    mat4.perspective(WIND.g_mProjection, Math.PI*0.35, WIND.g_pCanvas.width / WIND.g_pCanvas.height, 0.1, 1000.0);

    // calculate mouse values
    var oRect = WIND.g_pCanvas.getBoundingClientRect();
    WIND.g_fMouseRange   = 1.0 / WIND.g_pCanvas.height;
    WIND.g_fMouseRect[0] = (oRect.left + (oRect.right  - oRect.left)/2) * WIND.g_fMouseRange;
    WIND.g_fMouseRect[1] = (oRect.top  + (oRect.bottom - oRect.top )/2) * WIND.g_fMouseRange;
    
    // call resize callback
    APP.Resize();
};


// ****************************************************************
WIND.CURSOR_AUTO      = 0;
WIND.CURSOR_CROSSHAIR = 1;
WIND.SetCursor = function(iCursor)
{
    // change cursor to crosshair
    document.body.style.cursor = (iCursor === WIND.CURSOR_CROSSHAIR) ? "crosshair" : "auto";
};


// ****************************************************************
WIND.SetElementOpacity = function(pElement, fOpacity)
{
    // set opacity of element and remove it completely when low
    pElement.style.opacity = fOpacity;
    pElement.style.display = (fOpacity <= 0.01) ? "none" : "block";
};


// ****************************************************************
WIND.SetElementEnabled = function(pElement, bEnabled)
{
    // set interaction behavior of element
    pElement.style.pointerEvents = bEnabled ? "auto" : "none";
};


// ****************************************************************
function ReadFile(sURL)
{
    // create synchronous request to read a file
    var pRequest = new XMLHttpRequest();
    pRequest.open("GET", sURL, false);
    pRequest.send();

    // return file content
    return pRequest.response;
}


// ****************************************************************
function Reflect(vOutput, vVelocity, vNormal)
{
    var fDot = vec2.dot(vVelocity, vNormal);
    if(fDot > 0.0) return;

    // calculate reflection vector
    fDot *= 2.0;
    vOutput[0] = vVelocity[0] - vNormal[0]*fDot;
    vOutput[1] = vVelocity[1] - vNormal[1]*fDot;
}


// ****************************************************************
function Signf(fValue)              {return (fValue < 0.0) ? -1.0 : 1.0;}
function Clamp(fValue, fFrom, fTo)  {return Math.min(Math.max(fValue, fFrom), fTo);}
function IntToString(iValue, iSize) {return ('000000000' + iValue).substr(-iSize);}
function CompareArray(a, b, s)      {for(var i = 0; i < s; ++i) if(a[i] !== b[i]) return false; return true;}