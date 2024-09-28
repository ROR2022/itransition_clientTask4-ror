import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { ChatContext } from "@/components/Chat/context/ChatContext";
import { Typography } from "@mui/material";
import { getConversationById, getMessageById } from "@/api/apiChat";
import { IMessage } from "./MyConversations";
import Image from "next/image";
//import { format } from 'path';

const ContentConversation = () => {
  const {
    dataUserChat,
    conversationActive,
    userConversations,
    setConversationActive,
    initConversationActive,
    imageMessage,
    imageRecived
  } = useContext(ChatContext);
  const { messages, updatedAt } = conversationActive || {
    messages: [],
    updatedAt: new Date(),
  };
  const [dataMessages, setDataMessages] = useState<IMessage[]>([]);
  const [imageTmp, setImageTmp] = useState(imageMessage.content);
  const [imageRecivedTmp, setImageRecivedTmp] = useState(imageRecived.content);
  const { nickname } = dataUserChat;

  useEffect(() => {
    if (conversationActive?._id !== "") {
      fetchConversation();
    }
  }, []);

  useEffect(() => {
    if(imageMessage.content !== ''){
        console.log('ContentConversation imageMessage:',imageMessage);
      setImageTmp(imageMessage.content);
    }
  }, [imageMessage]);

    useEffect(() => {
        if(imageRecived.content !== ''){
            console.log('ContentConversation imageRecived:',imageRecived);
        setImageRecivedTmp(imageRecived.content);
        }
    }, [imageRecived]);

  useEffect(() => {
    //console.log('conversationActive:',conversationActive);
    //console.log('Messages:',messages);
    if (
      (conversationActive?._id !== "" && dataMessages.length === 0) ||
      messages.length !== dataMessages.length
    ) {
      fetchDataMessages();
    }
  }, [conversationActive]);

  useEffect(() => {
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

  useEffect(() => {}, [dataMessages]);

  const fetchDataMessages = async () => {
    try {
      const tempMessages = conversationActive.messages;
      const res = tempMessages.map(async (message) => {
        const res = await getMessageById(message._id);
        return res;
      });
      //console.log('res dataMessages:',res);
      Promise.all(res).then((dataMessages) => {
        //console.log('dataMessages:',dataMessages);
        setDataMessages(dataMessages);
        window.scrollTo(0, document.body.scrollHeight);
      });
      //setDataMessages(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchConversation = async () => {
    try {
      const res = await getConversationById(conversationActive._id);
      setConversationActive(res);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date: Date) => {
    if (!date || !(date instanceof Date)) return "";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    const parsedDate = typeof date === "string" ? new Date(date) : date;

    if (isNaN(parsedDate.getTime())) {
      return "Fecha inválida";
    }
    if (!Intl.DateTimeFormat) return date.toString();
    const result = new Intl.DateTimeFormat("es-MX", options)?.format(
      (date as Date) || new Date()
    );
    return result;
  };

  //if(conversationActive?._id === '') return <p>No conversation</p>;

  return (
    <div
      style={{
        overflowY: "auto",
        height: "80%",
        background:
          "radial-gradient(circle, rgba(221,221,221,1) 0%, rgba(0,212,255,1) 52%, rgba(221,221,221,1) 100%)",
      }}
    >
      {conversationActive?._id === "" ? (
        <p>No conversation</p>
      ) : (
        <div>
          <Typography
            variant="h6"
            style={{
              textAlign: "center",
              padding: "10px",
              margin: "0px",
              fontSize: "12px",
              color: "#666",
            }}
          >
            {formatDate(new Date(updatedAt||''))}
          </Typography>
          {dataMessages.map((dataMessage) => {
            const { message, sender } = dataMessage;
            const isMe = sender?.nickname === nickname;
            return (
              <div
                key={dataMessage._id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "initial",
                  alignItems: isMe ? "flex-end" : "flex-start",
                  gap: "0px",
                  padding: "5px",
                }}
              >
                <div
                  style={{
                    backgroundColor: isMe ? "#ccc" : "#74bc5f",
                    padding: "10px",
                    borderRadius: "10px",
                  }}
                >
                  <p
                    style={{
                      margin: "0px",
                      padding: "0px",
                    }}
                  >
                    {message}
                  </p>
                </div>
                <p
                  style={{
                    margin: "0px",
                    padding: "0px",
                    fontSize: "10px",
                    color: "#666",
                  }}
                >
                  {sender?.nickname}
                </p>
              </div>
            );
          })}
          {imageTmp && (
            <div
                style={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    gap: "0px",
                    padding: "0px",
                }}
            >
            <Image
                src={imageTmp}
                alt="image"
                width={200}
                height={200}
                style={{
                    width: "100px",
                    height: "auto",
                
                }}
            />
            </div>
          )}
          {imageRecivedTmp && (
            <div
                style={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    gap: "0px",
                    padding: "0px",
                }}
            >
            <Image
                src={imageRecivedTmp}
                alt="image"
                width={200}
                height={200}
                style={{
                    width: "100px",
                    height: "auto",
                
                }}
            />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentConversation;
