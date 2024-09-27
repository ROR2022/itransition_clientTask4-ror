"use client";
"use context";
import { createContext, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { IConversation, IMessage, IParticipant } from "../MyConversations";
import { SignalData } from "simple-peer";

export const initDataUser: IParticipant = {
  _id: "",
  nickname: "",
  avatar: "",
};

const initConversationActive = {
  _id: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  participants: [] as IParticipant[],
  messages: [] as IMessage[],
};

const initUserConversations = [] as IConversation[];
const initMessage = {
  _id: "",
  message: "",
  sender: {
    _id: "",
    nickname: "",
    avatar: "",
  },
  reciver: {
    _id: "",
    nickname: "",
    avatar: "",
  },
  updatedAt: new Date(),
};

export type TimageMessage = {
  content: string;
  sender: string;
  reciver: string;
};


const initImageMessage: TimageMessage = {
  content: '',
  sender: '',
  reciver: '',
}

export type ISignalData = SignalData;

export interface IVideoCall {
  signal: ISignalData | null;
  sender: string;
  reciver: string;
}

 const initDataVideoCall: IVideoCall = {
  signal: null,
  sender: "",
  reciver: "",
};

const initVideoSignal: IVideoCall = {
  signal: null,
  sender: "",
  reciver: "",
};

export const ChatContext = createContext({
  dataUserChat: initDataUser,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDataUserChat: (_dataUser: IParticipant) => {},
  conversationActive: initConversationActive,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setConversationActive: (_conversationActive: IConversation) => {},
  userConversations: initUserConversations,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUserConversations: (_userConversations: IConversation[]) => {},
  chatParticipants: [] as IParticipant[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setChatParticipants: (_chatParticipants: IParticipant[]) => {},
  emitingMessage: initMessage,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setEmitingMessage: (_emitingMessage: IMessage) => {},
  usersOnline: [] as string[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUsersOnline: (_usersOnline: string[]) => {},
  isMakingVideoCall: initDataVideoCall,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setIsMakingVideoCall: (_isMakingVideoCall: IVideoCall) => {},
  isAnsweringVideoCall: initDataVideoCall,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setIsAnsweringVideoCall: (_isAnsweringVideoCall: IVideoCall) => {},
  incomingVideoSignal: initVideoSignal,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setIncomingVideoSignal: (_incomingVideoSignal: IVideoCall) => {},
  peerVideoSignal: initVideoSignal,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setPeerVideoSignal: (_peerVideoSignal: IVideoCall) => {},
  imageMessage: initImageMessage,
  setImageMessage: (_imageMessage: TimageMessage) => {console.log('imageMessage')},
  imageRecived: initImageMessage,
  setImageRecived: (_imageRecived: TimageMessage) => {console.log('imageRecived')},
  initImageMessage,
  initVideoSignal,
  initDataUser,
  initMessage,
  initDataVideoCall,
  initConversationActive,
});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [dataUserChat, setDataUserChat] = useLocalStorage<IParticipant>(
    "dataUserChat",
    initDataUser
  );
  const [conversationActive, setConversationActive] =
    useLocalStorage<IConversation>(
      "conversationActive",
      initConversationActive
    );
  const [userConversations, setUserConversations] = useLocalStorage<
    IConversation[]
  >("userConversations", initUserConversations);
  const [chatParticipants, setChatParticipants] = useLocalStorage<
    IParticipant[]
  >("chatParticipants", []);
  const [emitingMessage, setEmitingMessage] = useLocalStorage<IMessage>(
    "emitingMessage",
    initMessage
  );
  const [usersOnline, setUsersOnline] = useState<string[]>([]);
  const [isMakingVideoCall, setIsMakingVideoCall] =
    useState<IVideoCall>(initDataVideoCall);
  const [isAnsweringVideoCall, setIsAnsweringVideoCall] =
    useState<IVideoCall>(initDataVideoCall);
  const [incomingVideoSignal, setIncomingVideoSignal] =
    useState<IVideoCall>(initVideoSignal);
  const [peerVideoSignal, setPeerVideoSignal] =
    useState<IVideoCall>(initVideoSignal);

    const [imageMessage, setImageMessage] = useState<TimageMessage>(initImageMessage);
    const [imageRecived, setImageRecived] = useState<TimageMessage>(initImageMessage);

  useEffect(() => {}, [dataUserChat]);

  return (
    <ChatContext.Provider
      value={{
        dataUserChat,
        setDataUserChat,
        conversationActive,
        setConversationActive,
        userConversations,
        setUserConversations,
        chatParticipants,
        setChatParticipants,
        emitingMessage,
        setEmitingMessage,
        usersOnline,
        setUsersOnline,
        isMakingVideoCall,
        setIsMakingVideoCall,
        isAnsweringVideoCall,
        setIsAnsweringVideoCall,
        incomingVideoSignal,
        setIncomingVideoSignal,
        peerVideoSignal,
        setPeerVideoSignal,
        imageMessage,
        setImageMessage,
        imageRecived,
        setImageRecived,
        initImageMessage,
        initVideoSignal,
        initDataUser,
        initMessage,
        initDataVideoCall,
        initConversationActive,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
