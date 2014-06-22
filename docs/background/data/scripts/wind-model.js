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
windModel.s_iCurVertexBuffer = null;


// ****************************************************************
windModel.Init = function()
{
    // enable vertex attribute arrays
    GL.enableVertexAttribArray(0);
    GL.enableVertexAttribArray(1);
    GL.enableVertexAttribArray(2);
};


// ****************************************************************
function windModel(afVertexData, aiIndexData)
{
    // save size values
    this.m_iNumVertices = afVertexData.length / 6;
    this.m_iNumIndices  = aiIndexData.length;

    // define index format
    this.m_iIndexFormat = (GL.bIsExperimental || (this.m_iNumVertices > 256)) ? GL.UNSIGNED_SHORT : GL.UNSIGNED_BYTE;

    // create vertex buffer
    this.m_iVertexBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.m_iVertexBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(afVertexData), GL.STATIC_DRAW);

    // create index buffer
    this.m_iIndexBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.m_iIndexBuffer);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, (this.m_iIndexFormat === GL.UNSIGNED_SHORT) ? new Uint16Array(aiIndexData) : new Uint8Array(aiIndexData), GL.STATIC_DRAW);

    // reset current vertex buffer
    windModel.s_iCurVertexBuffer = null;
}


// ****************************************************************
windModel.prototype.Destruct = function()
{
    // reset current vertex buffer
    if(windModel.s_iCurVertexBuffer === this.m_iVertexBuffer)
        windModel.s_iCurVertexBuffer = null;
        
    // delete vertex and index buffer
    GL.deleteBuffer(this.m_iVertexBuffer);
    GL.deleteBuffer(this.m_iIndexBuffer);
};


// ****************************************************************
windModel.prototype.Render = function()
{
    if(windModel.s_iCurVertexBuffer !== this.m_iVertexBuffer)
    {
        // enable vertex and index buffer
        windModel.s_iCurVertexBuffer = this.m_iVertexBuffer;
        GL.bindBuffer(GL.ARRAY_BUFFER,         this.m_iVertexBuffer);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.m_iIndexBuffer);

        // set attributes
        GL.vertexAttribPointer(0, 3, GL.FLOAT, false, 8*4, 0);
        GL.vertexAttribPointer(1, 2, GL.FLOAT, false, 8*4, 3*4);
        GL.vertexAttribPointer(2, 3, GL.FLOAT, false, 8*4, 5*4);
    }

    // draw the model
    GL.drawElements(GL.TRIANGLES, this.m_iNumIndices, this.m_iIndexFormat, 0);
};