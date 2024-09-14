import React from 'react'

const Videos = () => {
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
        <h2
            style={{
                marginBottom: '20px',
            }}
        >Video 1</h2>
        <video src="/video1Task4.mp4" width={800} height={1000} controls></video>
        <h2
            style={{
                marginBottom: '20px',
            }}
        >Video 2</h2>
        <video src="/video2Task4.mp4" width={800} height={1000} controls></video>
    </div>
  )
}

export default Videos