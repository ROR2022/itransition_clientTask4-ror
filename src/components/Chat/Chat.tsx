"use client";
import React,{ useEffect} from "react";
import DataMainUser from "./DataMainUser";
import { ChatProvider } from "./context/ChatContext";
import ChatLayout from "./ChatLayout";
import { useContext } from "react";
import { ChatContext } from "./context/ChatContext";

const Chat = () => {
  const { dataUserChat } = useContext(ChatContext);
  
  useEffect(() => {
    
  },[dataUserChat._id]);

  return (
    <ChatProvider>
      {
        <div
          style={{
            backgroundColor: "#f5f5f5",
            height: "100%",
            width: "100%",
            marginBottom: "80px",
          }}
        >
          <DataMainUser />
          {dataUserChat._id === "" ? <p>No User</p> : 
          <ChatLayout />
          }
          
        </div>
      }
    </ChatProvider>
  );
};

export default Chat;
