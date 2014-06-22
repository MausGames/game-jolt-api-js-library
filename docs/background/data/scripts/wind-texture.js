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
windTexture.s_iCurTexture = null;


// ****************************************************************
windTexture.Init = function()
{
    // enable flipped texture loading
    GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);

    // disable dithering
    GL.disable(GL.DITHER);
};


// ****************************************************************
function windTexture(pTextureData)
{
    // create texture
    this.m_iTexture = GL.createTexture();
    GL.bindTexture(GL.TEXTURE_2D, this.m_iTexture);

    // load texture data
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S,     GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T,     GL.CLAMP_TO_EDGE);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, pTextureData);

    // set current texture
    windTexture.s_iCurTexture = this.m_iTexture;
}


// ****************************************************************
windTexture.prototype.Destruct = function()
{
    // reset current texture
    if(windTexture.s_iCurTexture === this.m_iTexture)
        windTexture.s_iCurTexture = null;
        
    // delete texture
    GL.deleteTexture(this.m_iTexture);
};


// ****************************************************************
windTexture.prototype.Enable = function()
{
    if(windTexture.s_iCurTexture !== this.m_iTexture)
    {
        // enable texture
        windTexture.s_iCurTexture = this.m_iTexture;
        GL.bindTexture(GL.TEXTURE_2D, this.m_iTexture);
    }
};


// ****************************************************************
windTexture.Disable = function()
{
    if(windTexture.s_iCurTexture !== null)
    {
        // disable texture
        windTexture.s_iCurTexture = null;
        GL.bindTexture(GL.TEXTURE_2D, null);
    }
};


// ****************************************************************
windTexture.prototype.Update = function(pTextureData)
{
    // this.Enable();
    GL.texSubImage2D(GL.TEXTURE_2D, 0, 0, 0, GL.RGBA, GL.UNSIGNED_BYTE, pTextureData);
    // this.Disable();
};