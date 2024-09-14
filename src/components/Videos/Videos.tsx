import React from 'react'

const Videos = () => {
  return (
    <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
        }}
    >
        <video src="/video1Task4.mp4" width={600} height={800} controls></video>
        <video src="/video2Task4.mp4" width={600} height={800} controls></video>
    </div>
  )
}

export default Videos