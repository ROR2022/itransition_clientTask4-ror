import React, { useEffect } from "react";
import CardConversation from "./CardConversation";
import { useContext } from "react";
import { ChatContext } from "./context/ChatContext";
import { getConversationsByParticipantId } from "@/api/apiChat";

export interface IParticipant {
  _id: string;
  nickname: string;
  avatar: string;
  online?: boolean;
  hideConversations?: Array<string>;
}

export interface IMessage {
  _id: string;
  message: string;
  sender: IParticipant;
  reciver: IParticipant;
  updatedAt: Date;
  conversation?: IConversation;
}

export interface IConversation {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  participants: Array<IParticipant>;
  messages: Array<IMessage>;
}

/* const dataConversationTmp = {
  _id: "conversation1",
  createdAt: new Date(),
  updatedAt: new Date(),
  participants: [
    {
      _id: "user1",
      nickname: "Juan",
      avatar: "/avatar1.png",
    },
    {
      _id: "user2",
      nickname: "Pedro",
      avatar: "/avatar3.png",
    },
  ],
  messages: [
    {
      _id: "message1",
      message: "Hola",
      sender: {
        _id: "user1",
        nickname: "Juan",
        avatar: "/avatar1.png",
      },
      updatedAt: new Date(),
    },
    {
      _id: "message2",
      message: "Hola, como estas?",
      sender: {
        _id: "user2",
        nickname: "Pedro",
        avatar: "/avatar3.png",
      },
      updatedAt: new Date(),
    },
  ],
}; */

const MyConversations = () => {
  const {
    dataUserChat,
    setUserConversations,
    setConversationActive,
    initConversationActive,
    userConversations,
    conversationActive,
  } = useContext(ChatContext);
  //const [conversations, setConversations] = useState([dataConversationTmp]);
  //console.log('dataUserChat:',dataUserChat);
  useEffect(() => {
    if (dataUserChat._id !== "") {
      //console.log("Fetching Conversations for:", dataUserChat);
      fetchConversations();
    } else {
      setUserConversations([]);
    }
  }, [dataUserChat]);

  useEffect(() => {
    if (userConversations.length === 0) {
      setConversationActive(initConversationActive);
    }
    const findConversation = userConversations.find(
      (conversation) => conversation._id === conversationActive._id
    );
    if (!findConversation) {
      setConversationActive(initConversationActive);
    } else {
      if (
        findConversation.messages.length !== 0 &&
        conversationActive.messages.length
      ) {
        setConversationActive(findConversation);
      }
    }
  }, [userConversations]);

  /* useEffect(() => {
    fetchConversations();
  }, []); */

  const fetchConversations = async () => {
    if (dataUserChat._id === "") {
      console.log("No Conversations for:", dataUserChat);
      return;
    }
    try {
      const res = await getConversationsByParticipantId(dataUserChat._id);
      //console.log('All Conversations of:',dataUserChat._id,res);
      //filter conversations with hideConversations
      const tempConversations = [] as IConversation[];
      //console.log("hideConversations:", dataUserChat.hideConversations);
      //console.log("dataConversations res:", res);
      

      if (!res||res.length === 0||res.error) {
        setUserConversations([]);
        return;
      }
      res?.forEach((conversation: IConversation) => {
        const findConversation = dataUserChat.hideConversations?.find(
          (hideConversation) =>
            String(hideConversation) === String(conversation._id)
        );
        const isAlreadyInConversations = tempConversations.find(repeatedConversation => repeatedConversation._id === conversation._id);
        if (!findConversation&&!isAlreadyInConversations) {
          tempConversations.push(conversation);
        }
      });
      //console.log("tempConversations:", tempConversations);
      setUserConversations(tempConversations);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        height: "90%",
        width: "100%",
        border: ".5px solid #ccc",
        paddingTop: "5px",
        background:
          "radial-gradient(circle, rgba(221,221,221,1) 0%, rgba(0,212,255,1) 52%, rgba(221,221,221,1) 100%)",
      }}
    >
      {userConversations?.length === 0 && <p>No Conversations</p>}
      {userConversations?.map((conversation) => (
        <CardConversation
          key={conversation._id}
          dataConversation={conversation}
        />
      ))}
    </div>
  );
};

export default MyConversations;
