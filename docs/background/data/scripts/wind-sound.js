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
windSound.s_pContext = null;   // audio context


// ****************************************************************
windSound.Init = function()
{
    // disable sound on offline-execution
    if(window.location.protocol.substr(0, 4) === "file") return;

    // create audio context
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    if(window.AudioContext) windSound.s_pContext = new AudioContext();
};


// ****************************************************************
function windSound(sURL)
{
    if(!windSound.s_pContext) return;

    // create asynchronous request to load a sound file
    var pRequest = new XMLHttpRequest();
    pRequest.open("GET", sURL, true);
    pRequest.responseType = "arraybuffer";

    // decode asynchronously when finished
    var pThis = this;
    pRequest.onload = function()
    {
        windSound.s_pContext.decodeAudioData(pRequest.response, function(pBuffer)
        {
            // save finished sound buffer
            pThis.m_pBuffer = pBuffer;
        }, function(){});
    };

    // send request
    pRequest.send();

    // create gain node (volume control) and connect to context destination
    this.m_pGain = windSound.s_pContext.createGain();
    this.m_pGain.connect(windSound.s_pContext.destination);
}


// ****************************************************************
windSound.prototype.Play = function(fPitch)
{
    if(!windSound.s_pContext) return;
    if(!g_bSound) return;

    // create new sound source (# tried to create a source pool, but somehow they can only be used once)
    var pSource = windSound.s_pContext.createBufferSource();

    // set buffer and connect to gain node
    pSource.buffer = this.m_pBuffer;
    pSource.connect(this.m_pGain);

    // play the sound
    pSource.playbackRate.value = (fPitch ? fPitch : 1.0) + 0.05*(Math.random()-0.5);
    pSource.start(0);
};


// ****************************************************************
windSound.prototype.SetVolume = function(fVolume)
{
    if(!windSound.s_pContext) return;
    this.m_pGain.gain.value = fVolume;
};
