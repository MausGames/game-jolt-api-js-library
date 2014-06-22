//////////////////////////////////////////////////////
//*------------------------------------------------*//
//| Part of Experiments (http://www.maus-games.at) |//
//*------------------------------------------------*//
//| Released under the zlib License                |//
//| More information available in the readme file  |//
//*------------------------------------------------*//
//////////////////////////////////////////////////////
"use strict";


// ****************************************************************
var APP = {};
APP.MUSIC_LIST = {};


// ****************************************************************
APP.pResource = {};

APP.pResource.afVertexData =
[-1.0, -1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
 -1.0,  1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,
  1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0,
  1.0,  1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0];
                      
APP.pResource.aiIndexData =
[0, 2, 1, 1, 2, 3];

APP.pResource.sMainVertexShader =
"attribute vec3 a_v3Position;"                +
"attribute vec2 a_v2Texture;"                 +
"varying   vec2 v_v2TexCoord;"                +
""                                            +
"void main()"                                 +
"{"                                           +
"    gl_Position  = vec4(a_v3Position, 1.0);" +
"    v_v2TexCoord = a_v2Texture;"             +
"}";

APP.pResource.sMainFragmentShader =
"precision mediump float;"                                                                                                                  +
""                                                                                                                                          +
"uniform sampler2D u_s2Texture;"                                                                                                            +
"uniform sampler2D u_s2Background;"                                                                                                         +
"uniform float     u_fAspectRatio;"                                                                                                         +
"varying vec2      v_v2TexCoord;"                                                                                                           +
""                                                                                                                                          +
"void main()"                                                                                                                               +
"{"                                                                                                                                         +
"    vec2 v2Axis1 = vec2(0.003, 0.003 * u_fAspectRatio);"                                                                                   +
""                                                                                                                                          +
"    float v1 = texture2D(u_s2Texture, v_v2TexCoord + vec2(-v2Axis1.x, 0.0)).r;"                                                            +
"    float v2 = texture2D(u_s2Texture, v_v2TexCoord + vec2( v2Axis1.x, 0.0)).r;"                                                            +
"    float v3 = texture2D(u_s2Texture, v_v2TexCoord + vec2( 0.0,-v2Axis1.y)).r;"                                                            +
"    float v4 = texture2D(u_s2Texture, v_v2TexCoord + vec2( 0.0, v2Axis1.y)).r;"                                                            +
""                                                                                                                                          +
"    vec3  v3Norm   = normalize(cross(vec3(0.25, 0.0, v1-v2), vec3(0.0, 0.25, v3-v4)));"                                                    +
"    float fValue   = v1 + v2 + v3 + v4;"                                                                                                   +
"    float fCoordX2 = v_v2TexCoord.x * 2.0;"                                                                                                +
""                                                                                                                                          +
"    vec3 v3Color     = texture2D(u_s2Background, (vec2(v_v2TexCoord.x * u_fAspectRatio, v_v2TexCoord.y) - v3Norm.xy*0.025)*2.5).rgb;"      +
"    vec3 v3TrueColor = mix(v3Color.rgb, mix(v3Color.gbr, v3Color.brg, clamp(fCoordX2-1.0, 0.0, 1.0)), clamp(fCoordX2, 0.0, 1.0));"         +
"         v3TrueColor = mix(mix(vec3(1.0), v3TrueColor, clamp(fValue-0.0, 0.0, 1.0)), vec3(1.0), clamp((abs(v3Norm.x)+abs(v3Norm.y))*0.8-0.1, 0.0, 1.0));" +
""                                                                                                                                          +
"    gl_FragColor = vec4(v3TrueColor, 1.0);"                                                                                                +
"}";

APP.pResource.sCursorVertexShader =
"attribute vec3 a_v3Position;"                                +
"attribute vec2 a_v2Texture;"                                 +
"uniform   mat4 u_m4ModelView;"                               +
"varying   vec2 v_v2TexCoord;"                                +
""                                                            +
"void main()"                                                 +
"{"                                                           +
"    gl_Position  = u_m4ModelView * vec4(a_v3Position, 1.0);" +
"    v_v2TexCoord = a_v2Texture - vec2(0.5);"                 +
"}";

APP.pResource.sCursorFragmentShader =
"precision mediump float;"                                                                 +
""                                                                                         +
"uniform sampler2D u_s2Texture;"                                                           +
"uniform float     u_fStrength;"                                                           +
"varying vec2      v_v2TexCoord;"                                                          +
""                                                                                         +
"void main()"                                                                              +
"{"                                                                                        +
"    float fLengthSq = dot(v_v2TexCoord, v_v2TexCoord);"                                   +
"    gl_FragColor    = vec4(vec3(1.0), smoothstep(0.185, 0.16, fLengthSq) * u_fStrength);" +
"}";

APP.pResource.sSmoothVertexShader =
"attribute vec3 a_v3Position;"                +
"attribute vec2 a_v2Texture;"                 +
"varying   vec2 v_v2TexCoord;"                +
""                                            +
"void main()"                                 +
"{"                                           +
"    gl_Position  = vec4(a_v3Position, 1.0);" +
"    v_v2TexCoord = a_v2Texture;"             +
"}";

APP.pResource.sSmoothFragmentShader =
"precision mediump float;"                                                                                                 +
""                                                                                                                         +
"uniform sampler2D u_s2Texture;"                                                                                           +
"uniform float     u_fAspectRatio;"                                                                                        +
"varying vec2      v_v2TexCoord;"                                                                                          +
""                                                                                                                         +
"void main()"                                                                                                              +
"{"                                                                                                                        +
"    float fRand = 0.2 * (0.6 + 0.4*(mod(fract(sin(dot(v_v2TexCoord.xy, vec2(12.9898,78.233))) * 43758.5453), 1.0)-0.5));" +
"    vec2 v2Axis1 = vec2(0.01, 0.01 * u_fAspectRatio) * fRand;"                                                            +
"    vec2 v2Axis2 = v2Axis1 * 0.71;"                                                                                       +
""                                                                                                                         +
"    float v1 = texture2D(u_s2Texture, v_v2TexCoord + vec2( v2Axis1.x, 0.0)).r;"                                           +
"    float v2 = texture2D(u_s2Texture, v_v2TexCoord + vec2(-v2Axis1.x, 0.0)).r;"                                           +
"    float v3 = texture2D(u_s2Texture, v_v2TexCoord + vec2( 0.0, v2Axis1.y)).r;"                                           +
"    float v4 = texture2D(u_s2Texture, v_v2TexCoord + vec2( 0.0,-v2Axis1.y)).r;"                                           +
""                                                                                                                         +
"    float v5 = texture2D(u_s2Texture, v_v2TexCoord + vec2( v2Axis2.x, v2Axis2.y)).r;"                                     +
"    float v6 = texture2D(u_s2Texture, v_v2TexCoord + vec2(-v2Axis2.x, v2Axis2.y)).r;"                                     +
"    float v7 = texture2D(u_s2Texture, v_v2TexCoord + vec2( v2Axis2.x,-v2Axis2.y)).r;"                                     +
"    float v8 = texture2D(u_s2Texture, v_v2TexCoord + vec2(-v2Axis2.x,-v2Axis2.y)).r;"                                     +
""                                                                                                                         +
"    float fValue = max(max(max(v1, v2), max(v3, v4)), max(max(v5, v6), max(v7, v8)));"                                    +
"    fValue = (fValue * 0.8 + (v1 + v2 + v3 + v4 + v5 + v6 + v7 + v8) * 0.125 * 0.2);"                                     +
""                                                                                                                         +
"    gl_FragColor = vec4(vec3(fValue - 0.0018), 1.0) * 0.985;"                                                             +
"}";


// ****************************************************************
APP.Init = function()
{
    // load default model
    this.pModel = new windModel(APP.pResource.afVertexData, APP.pResource.aiIndexData);

    // load background texture
    this.pTexture = null;

    var pImage = new Image();
    pImage.onload = function()
    {
        APP.pTexture = new windTexture(pImage);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.REPEAT);
        pImage = null;
    };
    pImage.src = "data/images/floor.png";

    // load all shaders
    this.pShader = {};

    this.pShader.pMain = new windShader(APP.pResource.sMainVertexShader, APP.pResource.sMainFragmentShader);
    this.pShader.pMain.m_iUniformAspectRatio = GL.getUniformLocation(this.pShader.pMain.m_iProgram, "u_fAspectRatio");
    this.pShader.pMain.m_iUniformBackground  = GL.getUniformLocation(this.pShader.pMain.m_iProgram, "u_s2Background");

    this.pShader.pCursor = new windShader(APP.pResource.sCursorVertexShader, APP.pResource.sCursorFragmentShader);
    this.pShader.pCursor.m_iUniformStrength = GL.getUniformLocation(this.pShader.pCursor.m_iProgram, "u_fStrength");

    this.pShader.pSmooth = new windShader(APP.pResource.sSmoothVertexShader, APP.pResource.sSmoothFragmentShader);
    this.pShader.pSmooth.m_iUniformAspectRatio = GL.getUniformLocation(this.pShader.pSmooth.m_iProgram, "u_fAspectRatio");

    // setup cursor data
    this.pCursor = {};
    this.pCursor.vOldCursor      = vec2.create();
    this.pCursor.vDifference     = vec2.create();
    this.pCursor.mTransform      = mat4.create();
    this.pCursor.vMathCurCursor  = vec2.create();
    this.pCursor.vMathOldCursor  = vec2.create();
    this.pCursor.vMathDifference = vec2.create();

    // setup random timer
    this.fTimer = 0.0;

    // disable depth testing
    GL.disable(GL.DEPTH_TEST);
};


// ****************************************************************
APP.Exit = function()
{
    // delete all resources
    this.pModel.Destruct();
    this.pTexture.Destruct();
    this.pShader.pMain.Destruct();
    this.pShader.pCursor.Destruct();
    this.pShader.pSmooth.Destruct();
    this.pFrameBuffer.apBuffer[0].Destruct();
    this.pFrameBuffer.apBuffer[1].Destruct();
};


// ****************************************************************
APP.Render = function()
{
    if(!this.pTexture) return;

    // enable the main shader-program
    this.pShader.pMain.Enable();
    GL.uniform1f(this.pShader.pMain.m_iUniformAspectRatio, this.fAspectRatio);
    GL.uniform1i(this.pShader.pMain.m_iUniformBackground, 1);

    // enable current framebuffer texture and background texture
    this.pFrameBuffer.apBuffer[this.pFrameBuffer.iCurBuffer].m_pTexture.Enable();
    GL.activeTexture(GL.TEXTURE1);
    this.pTexture.Enable();
    GL.activeTexture(GL.TEXTURE0);
    
    // render the model
    this.pModel.Render();
};


// ****************************************************************
APP.Move = function()
{
    if(!this.pTexture) return;
    
    // handle un-positioned cursors
    if(!WIND.g_vMousePos[0]) return;
    if(!this.pCursor.vOldCursor[0]) vec2.copy(this.pCursor.vOldCursor, WIND.g_vMousePos);

    // update both framebuffers
    this.pFrameBuffer.apBuffer[1 - this.pFrameBuffer.iCurBuffer].Enable();
    {
        // enable the cursor shader-program
        this.pShader.pCursor.Enable();

        // copy and transform old and new cursor position
        vec2.copy(this.pCursor.vMathCurCursor, WIND.g_vMousePos);
        vec2.copy(this.pCursor.vMathOldCursor, this.pCursor.vOldCursor);

        this.pCursor.vMathCurCursor[0] *= this.fAspectRatioRev;
        this.pCursor.vMathOldCursor[0] *= this.fAspectRatioRev;

        // calculate cursor difference
        vec2.sub(this.pCursor.vDifference, this.pCursor.vMathCurCursor, this.pCursor.vMathOldCursor);

        var fLength = vec2.squaredLength(this.pCursor.vDifference);
        if(fLength > 0.00002)
        {
            fLength = Math.sqrt(fLength) * 1.4;

            // calculate scale and rotation of the cursor object
            vec2.copy(this.pCursor.vMathDifference, this.pCursor.vDifference);
            var vDir = this.pCursor.vMathDifference;

            vec2.normalize(vDir, vDir);
            vDir[0] *= this.fAspectRatio;
            
            mat4.identity   (this.pCursor.mTransform, this.pCursor.mTransform);
            mat4.scale      (this.pCursor.mTransform, this.pCursor.mTransform, [this.fAspectRatioRev, 1.0, 1.0]);
            mat4.rotateZ_alt(this.pCursor.mTransform, this.pCursor.mTransform, vDir);
            mat4.scale      (this.pCursor.mTransform, this.pCursor.mTransform, [fLength, Math.min(fLength, 0.01), 1.0]);

            // calculate position between old and new cursor position
            vec2.copy(this.pCursor.vMathDifference, this.pCursor.vDifference);
            var vPos = this.pCursor.vMathDifference;
            
            vec2.mul(vPos, vPos, [0.5, 0.5]);
            vec2.add(vPos, vPos, this.pCursor.vMathOldCursor);
            vec2.mul(vPos, vPos, [2.0, -2.0]);

            mat4.translate(this.pCursor.mTransform, this.pCursor.mTransform, [vPos[0], vPos[1], 0.0]);

            // send required uniforms
            GL.uniformMatrix4fv(this.pShader.pCursor.m_iUniformModelView, false, this.pCursor.mTransform);
            GL.uniform1f(this.pShader.pCursor.m_iUniformStrength, (fLength < 0.007) ? 0.0 : 1.0);

            // render the model
            this.pModel.Render();

            // save new cursor position
            vec2.copy(this.pCursor.vOldCursor, WIND.g_vMousePos);
        }

//        // create random cursor objects
//        this.fTimer += WIND.g_fTime;
//        if(this.fTimer >= 1.0)
//        {
//            this.fTimer -= Math.random();
//
//            // transform the random cursor object
//            mat4.identity (this.pCursor.mTransform, this.pCursor.mTransform);
//            mat4.scale    (this.pCursor.mTransform, this.pCursor.mTransform, [this.fAspectRatioRev, 1.0, 1.0]);
//            mat4.scale    (this.pCursor.mTransform, this.pCursor.mTransform, [0.05, 0.05, 1.0]);
//            mat4.translate(this.pCursor.mTransform, this.pCursor.mTransform, [Math.random()*2.0-1.0, Math.random()*2.0-1.0, 0.0]);
//
//            // send required uniforms
//            GL.uniformMatrix4fv(this.pShader.pCursor.m_iUniformModelView, false, this.pCursor.mTransform);
//            GL.uniform1f(this.pShader.pCursor.m_iUniformStrength, 1.0);
//
//            // render the model
//            this.pModel.Render();
//        }
    }
    this.pFrameBuffer.apBuffer[this.pFrameBuffer.iCurBuffer].Enable();
    {
        // enable the smooth shader-program
        this.pShader.pSmooth.Enable();
        GL.uniform1f(this.pShader.pSmooth.m_iUniformAspectRatio, this.fAspectRatio);

        // enable the other framebuffer texture
        this.pFrameBuffer.apBuffer[1 - this.pFrameBuffer.iCurBuffer].m_pTexture.Enable();

        // render the model
        this.pModel.Render();
    }
    windFrameBuffer.Disable();

    // flip both framebuffers (ping-pong)
    this.pFrameBuffer.iCurBuffer = 1 - this.pFrameBuffer.iCurBuffer;
};


// ****************************************************************
APP.KeyDown             = function(iKey)    {};
APP.StartGame           = function()        {};
APP.PauseGame           = function(bStatus) {};
APP.ChangeOptionQuality = function(bStatus) {};
APP.ChangeOptionMusic   = function(bStatus) {};
APP.ChangeOptionSound   = function(bStatus) {};


// ****************************************************************
APP.Resize = function()
{
    // calculate aspect ratio values
    this.fAspectRatio    = window.innerWidth  / window.innerHeight;
    this.fAspectRatioRev = window.innerHeight / window.innerWidth;

    // load and adjust framebuffers
    if(!this.pFrameBuffer)
    {
        this.pFrameBuffer            = {};
        this.pFrameBuffer.apBuffer   = [null, null];
        this.pFrameBuffer.iCurBuffer = 0;
    }
    else
    {
        this.pFrameBuffer.apBuffer[0].Destruct();
        this.pFrameBuffer.apBuffer[1].Destruct();
    }
    this.pFrameBuffer.apBuffer[0] = new windFrameBuffer(window.innerWidth, window.innerHeight);
    this.pFrameBuffer.apBuffer[1] = new windFrameBuffer(window.innerWidth, window.innerHeight);
};


// ****************************************************************
mat4.rotateZ_alt = function(out, a, vec2) 
{
    var s = -vec2[1],
        c =  vec2[0],
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};
