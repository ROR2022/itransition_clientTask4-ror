import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { hostURL } from "@/dataEnv/dataEnv";
import { useContext } from "react";
import { ChatContext } from "@/components/Chat/context/ChatContext";
import { getConversationsByParticipantId } from "@/api/apiChat";
import { IConversation } from "./MyConversations";

let chatSocket: Socket;

const ChatWebSocket = () => {
  const {
    conversationActive,
    dataUserChat,
    emitingMessage,
    setUsersOnline,
    setEmitingMessage,
    initMessage,
    setUserConversations,
    isMakingVideoCall,
    setIsMakingVideoCall,
    setIsAnsweringVideoCall,
    setIncomingVideoSignal,
    peerVideoSignal,
    setPeerVideoSignal,
    initDataVideoCall,
    imageMessage,
    setImageMessage,
    setImageRecived,
    initImageMessage
  } = useContext(ChatContext);

  useEffect(() => {
    chatSocket = io(`${hostURL}`, {
      query: {
        nickname: dataUserChat.nickname,
      },
    });

    chatSocket.on("connect", () => {
      //console.log("Connected to WebSocket server");
    });

    chatSocket.on("message", (data: string) => {
      console.log("Message from server:", data);
    });

    chatSocket.on("messageRecived", (data: string) => {
      console.log("Message Recived:", data);
      //const dataMessage = JSON.parse(data);
        fetchConversations();
    });

    const dataJoin = {
      conversationId: conversationActive._id,
      nickname: dataUserChat.nickname,
    };

    chatSocket.emit("join", JSON.stringify(dataJoin));

    chatSocket.on("joined", (data: []) => {
      //console.log("newParticipants", data);
      const tempUsersOnline = data.map((user: {nickname:string}) => user.nickname);
      setUsersOnline([...tempUsersOnline]);
      //setMyParticipants([...data]);
    });

    chatSocket.on("left", (data: []) => {
      console.log("left:", data);
      const tempUsersOnline = data.map((user: {nickname:string}) => user.nickname);
      setUsersOnline([...tempUsersOnline]);
    });

    chatSocket.on('call-made', (data) => {
      // Responde la llamada
      //answerCall(data.signal);
      setIncomingVideoSignal({...data});
    });

    chatSocket.on('call-answered', (data) => {
      // Establece la conexión P2P
      //peer.signal(data.signal);
      setIsAnsweringVideoCall({...data});
    });

    chatSocket.on('image-message-recived', (data) => {
      console.log("Image Message Recived:", data);
      setImageRecived(data);
      //fetchConversations();
    });

    return () => {
      chatSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (emitingMessage._id !== "") {
      handleEmitingMessage();
    }
  }, [emitingMessage]);

  useEffect(() => {
    if (isMakingVideoCall.signal !== null) {
      handleMakingVideoCall();
    }
  }, [isMakingVideoCall]);

  

  useEffect(() => {
    if (peerVideoSignal.signal !== null) {
      chatSocket?.emit('answer-call', peerVideoSignal);
      console.log("Peer Video Signal:", peerVideoSignal);
      setPeerVideoSignal(initDataVideoCall);
    }
  }, [peerVideoSignal]);

  useEffect(() => {
    if (imageMessage.content !== "") {
      chatSocket?.emit('image-message', imageMessage);
      console.log("Image Message:", imageMessage);
      setImageMessage(initImageMessage);
    }
  }, [imageMessage]);

  const fetchConversations = async () => {
    try {
      const res = await getConversationsByParticipantId(dataUserChat._id);
      console.log("All Conversations of:", dataUserChat._id, res);
      //filterConversations in hideConversations
      const tempConversations = [] as IConversation[];
      res.forEach((conversation: IConversation) => {
        const findConversation= dataUserChat.hideConversations?.find((hideConversation) => hideConversation===conversation._id);
        if(!findConversation){
          tempConversations.push(conversation);
        }
      });
      setUserConversations(tempConversations);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmitingMessage = () => {
    if (emitingMessage._id !== "") {
      console.log("Emiting Message:", emitingMessage);
      if (!chatSocket) console.log("... Socket is null ...", chatSocket);
      const dataEmitingMessage = {
        sender: emitingMessage.sender.nickname,
        reciver: emitingMessage.reciver.nickname,
        text: emitingMessage.message,
      };
      chatSocket?.emit("message", dataEmitingMessage);
      setEmitingMessage(initMessage);
    }
  };

  const handleMakingVideoCall = () => {
    chatSocket?.emit('call-user', isMakingVideoCall);
    console.log("ChatWebSocket Making Video Call:", isMakingVideoCall);
    setIsMakingVideoCall(initDataVideoCall);
  }

  

  return <div style={{ display: "none" }}>ChatWebSocket</div>;
};

export default ChatWebSocket;
