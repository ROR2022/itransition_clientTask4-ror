"use client";
import React from "react";
import DataMainUser from "./DataMainUser";
import { ChatProvider } from "./context/ChatContext";
import ChatLayout from "./ChatLayout";

const Chat = () => {
  
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
          
          <ChatLayout />
          
          
        </div>
      }
    </ChatProvider>
  );
};

export default Chat;
