import React, { useEffect } from 'react'
import HeaderConversation from './HeaderConversation'
import ContentConversation from './ContentConversation'
import FooterConversation from './FooterConversation'
import { useMediaQuery } from 'usehooks-ts'
import { useContext } from 'react'
import { ChatContext } from '@/components/Chat/context/ChatContext'

const MainConversation = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const {conversationActive,userConversations} = useContext(ChatContext);
  useEffect(() => {
  }, [userConversations,conversationActive])
  return (
    <div
    style={{
        width: isMobile ? '100%' : '70%',
        height: '100vh',
        background: 'radial-gradient(circle, rgba(221,221,221,1) 0%, rgba(0,212,255,1) 52%, rgba(221,221,221,1) 100%)'
      }}
    >
        <HeaderConversation />
        <ContentConversation />
        {conversationActive?._id === '' ? <p>No conversation</p> : <FooterConversation />}
        
    </div>
  )
}

export default MainConversation