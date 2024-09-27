import React,{useState,useEffect} from 'react'
import { useContext } from 'react'
import { ChatContext } from '@/components/Chat/context/ChatContext'
import { dataAvatares } from '@/dataEnv/dataEnv'
import Image from 'next/image'
import VideoChatIcon from '@mui/icons-material/VideoChat';
import ModalVideoChat from './ModalVideoChat'

const HeaderConversation = () => {
  const {dataUserChat,conversationActive, incomingVideoSignal} = useContext(ChatContext);
  const {participants} = conversationActive || {participants: []};
  const [participant, setParticipant] = useState({nickname: '', avatar: ''});
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [dataParticipantsVideoChat, setDataParticipantsVideoChat] = useState({sender: '', reciver: ''});
  //const participant = participants[1].nickname===dataUserChat.nickname?participants[0]:participants[1] || {nickname: '', avatar: ''};
  //if(conversationActive?._id === '') return <p>No dataParticipant</p>;
  //console.log('ConversationActive:',conversationActive);
  //console.log('HeaderConversation participant:',participant);
  useEffect(() => {
    if(conversationActive?._id === '' || participants?.length===0) return;
    if(participants&&participants.length>0){
    const participantTmp = participants[1].nickname===dataUserChat.nickname?participants[0]:participants[1] || {nickname: '', avatar: ''};
    setParticipant(participantTmp);
    }
  },[conversationActive])

  useEffect(() => {
    if(incomingVideoSignal.signal!==null){
      setIsOpenModal(true);
    }
  },[incomingVideoSignal])

  const handleVideoChat = () => {
    const dataParticipants={
      sender: dataUserChat.nickname,
      reciver: participant.nickname,
    }
    console.log('Video Chat:',dataParticipants);
    setDataParticipantsVideoChat(dataParticipants);
    setIsOpenModal(true);
  }

  return (
    <div
    style={{
      height: '10%',
      background: 'radial-gradient(circle, rgba(221,221,221,1) 0%, rgba(0,212,255,1) 52%, rgba(221,221,221,1) 100%)'
    }}
    >
      {conversationActive?._id === '' ? <p>No Conversation</p> : 
      <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
      }}
      >
        <ModalVideoChat
        dataParticipantsVideoChat={dataParticipantsVideoChat} 
        isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal}/>
      <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'initial',
        alignItems: 'center',
        gap: '10px',
        padding: '10px',
        height: '40px',
      }}
      >
        <Image
        style={{ borderRadius: '50%' }}
        src={dataAvatares.find(avatar => avatar.title === participant.avatar)?.url || dataAvatares[0].url}
        alt="avatar"
        width={40}
        height={40}
        />
        <h5>{participant.nickname}</h5>
        </div>
        <div
        style={{
          marginRight: '20px',
        }}
        >
          <VideoChatIcon 
          onClick={handleVideoChat}
          style={{
            color: 'green',
            cursor: 'pointer'}}/>
        </div>
        </div>
      }
    </div>
  )
}

export default HeaderConversation