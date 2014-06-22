//////////////////////////////////////////////////////////
//*----------------------------------------------------*//
//| Part of the Wind Engine (http://www.maus-games.at) |//
//*----------------------------------------------------*//
//| Released under the zlib License                    |//
//| More information available in the readme file      |//
//*----------------------------------------------------*//
//////////////////////////////////////////////////////////
"use strict";


// ****************************************************************
windShader.s_iCurProgram = null;


// ****************************************************************
windShader.Init = function()
{
};


// ****************************************************************
function windShader(sVertexShader, sFragmentShader)
{
    // create vertex shader
    this.m_iVertexShader = GL.createShader(GL.VERTEX_SHADER);
    GL.shaderSource(this.m_iVertexShader, sVertexShader);
    GL.compileShader(this.m_iVertexShader);

    // create fragment shader
    this.m_iFragmentShader = GL.createShader(GL.FRAGMENT_SHADER);
    GL.shaderSource(this.m_iFragmentShader, sFragmentShader);
    GL.compileShader(this.m_iFragmentShader);

    // attach shaders to program object
    this.m_iProgram = GL.createProgram();
    GL.attachShader(this.m_iProgram, this.m_iVertexShader);
    GL.attachShader(this.m_iProgram, this.m_iFragmentShader);

    // bind specific attributes
    GL.bindAttribLocation(this.m_iProgram, 0, "a_v3Position");
    GL.bindAttribLocation(this.m_iProgram, 1, "a_v2Texture");
    GL.bindAttribLocation(this.m_iProgram, 2, "a_v3Normal");

    // link program
    GL.linkProgram(this.m_iProgram);

    // check for errors
    if(!GL.getShaderParameter(this.m_iVertexShader, GL.COMPILE_STATUS))
        alert("Vertex Shader Error: " + GL.getShaderInfoLog(this.m_iVertexShader));

    if(!GL.getShaderParameter(this.m_iFragmentShader, GL.COMPILE_STATUS))
        alert("Fragment Shader Error: " + GL.getShaderInfoLog(this.m_iFragmentShader));

    if(!GL.getProgramParameter(this.m_iProgram, GL.LINK_STATUS))
        alert("Program Error: " + GL.getProgramInfoLog(this.m_iProgram));

    // retrieve uniform locations
    this.m_iUniformModelViewProj = GL.getUniformLocation(this.m_iProgram, "u_m4ModelViewProj");
    this.m_iUniformModelView     = GL.getUniformLocation(this.m_iProgram, "u_m4ModelView");
    this.m_iUniformNormal        = GL.getUniformLocation(this.m_iProgram, "u_m3Normal");
    this.m_iUniformColor         = GL.getUniformLocation(this.m_iProgram, "u_v4Color");
}


// ****************************************************************
windShader.prototype.Destruct = function()
{
    // reset current shader
    if(windShader.s_iCurProgram === this.m_iProgram)
        windShader.s_iCurProgram = null;

    // detach and delete shaders
    GL.detachShader(this.m_iProgram, this.m_iVertexShader);
    GL.detachShader(this.m_iProgram, this.m_iFragmentShader);
    GL.deleteShader(this.m_iVertexShader);
    GL.deleteShader(this.m_iFragmentShader);

    // delete shader-program
    GL.deleteProgram(this.m_iProgram);
};


// ****************************************************************
windShader.prototype.Enable = function()
{
    if(windShader.s_iCurProgram !== this.m_iProgram)
    {
        // enable program
        windShader.s_iCurProgram = this.m_iProgram;
        GL.useProgram(this.m_iProgram);
    }
};


// ****************************************************************
windShader.Disable = function()
{
    if(windShader.s_iCurProgram !== null)
    {
        // disable program
        windShader.s_iCurProgram = null;
        GL.useProgram(null);
    }
};