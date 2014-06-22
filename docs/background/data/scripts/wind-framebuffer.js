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
windFrameBuffer.s_iCurFrameBuffer = null;


// ****************************************************************
windFrameBuffer.Init = function()
{
};


// ****************************************************************
function windFrameBuffer(iWidth, iHeight, bKeepBound)
{
    // create framebuffer
    this.m_iFrameBuffer = GL.createFramebuffer();
    GL.bindFramebuffer(GL.FRAMEBUFFER, this.m_iFrameBuffer);
    
    // create texture
    this.iWidth  = WIND.g_pTexture.width  = iWidth;
    this.iHeight = WIND.g_pTexture.height = iHeight;
    this.m_pTexture = new windTexture(WIND.g_pTexture);
    
    // attach texture as color buffer
    this.m_pTexture.Enable();
    GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, this.m_pTexture.m_iTexture, 0);
    
    // check for valid framebuffer
    var iError = GL.checkFramebufferStatus(GL.FRAMEBUFFER);
    if(iError !== GL.FRAMEBUFFER_COMPLETE)
        alert("Frame Buffer Error: " + iError);
    
    // set or reset current framebuffer
    if(bKeepBound) windFrameBuffer.s_iCurFrameBuffer = this.m_iFrameBuffer;
    else GL.bindFramebuffer(GL.FRAMEBUFFER, windFrameBuffer.s_iCurFrameBuffer);
}


// ****************************************************************
windFrameBuffer.prototype.Destruct = function()
{
    // reset current framebuffer
    if(windFrameBuffer.s_iCurFrameBuffer === this.m_iFrameBuffer)
        windFrameBuffer.s_iCurFrameBuffer = null;
        
    // delete texture and framebuffer
    this.m_pTexture.Destruct();
    GL.deleteFramebuffer(this.m_iFrameBuffer);
};


// ****************************************************************
windFrameBuffer.prototype.Enable = function()
{
    if(windFrameBuffer.s_iCurFrameBuffer !== this.m_iFrameBuffer)
    {
        // enable framebuffer
        windFrameBuffer.s_iCurFrameBuffer = this.m_iFrameBuffer;
        GL.bindFramebuffer(GL.FRAMEBUFFER, this.m_iFrameBuffer);
        
        // set viewport
        GL.viewport(0, 0, this.iWidth, this.iHeight);
    }
};


// ****************************************************************
windFrameBuffer.Disable = function()
{
    if(windFrameBuffer.s_iCurFrameBuffer !== null)
    {
        // disable framebuffer
        windFrameBuffer.s_iCurFrameBuffer = null;
        GL.bindFramebuffer(GL.FRAMEBUFFER, null);
        
        // reset viewport
        GL.viewport(0, 0, WIND.g_pCanvas.width, WIND.g_pCanvas.height);
    }
};