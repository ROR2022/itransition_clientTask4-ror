import React from 'react'
import SelectConversation from './SelectConversation'
import MyConversations from './MyConversations'
import { useMediaQuery } from 'usehooks-ts'

const Conversations = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  return (
    <div
    style={{
        width: isMobile ? '100%' : '30%',
        height: '100vh',  
        }}

    >
        <SelectConversation />
        <MyConversations />
    </div>
  )
}

export default Conversations