import React from 'react'

const VideoTask7 = () => {
  return (
    <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
        }}
    >
        
        <video src="/videoTask7.mp4" width={1000} height={800} controls></video>
    </div>
  )
}

export default VideoTask7