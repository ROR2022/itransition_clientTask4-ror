import React from 'react'
import dynamic from 'next/dynamic'
//import Chat from '@/components/Chat/Chat'
const Chat = dynamic(() => import('@/components/Chat/Chat'), { ssr: false })

const page = () => {
  return (
    <div>
        <Chat />
    </div>
  )
}

export default page