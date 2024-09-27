import React, { FC, useEffect, useState } from "react";
import { IConversation } from "./MyConversations";
import { useContext } from "react";
import { ChatContext } from "@/components/Chat/context/ChatContext";
import Image from "next/image";
import { dataAvatares } from "@/dataEnv/dataEnv";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import {  deleteConversation } from "@/api/apiChat";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { HiOutlineStatusOffline } from "react-icons/hi";

interface ICardConversation {
  dataConversation: IConversation;
}

const CardConversation: FC<ICardConversation> = ({ dataConversation }) => {
  const [statusParticipant, setStatusParticipant] = useState(false);
  const {
    dataUserChat,
    setConversationActive,
    initConversationActive,
    userConversations,
    setUserConversations,
    usersOnline
  } = useContext(ChatContext);
  const { participants } = dataConversation;
  const participant =
    participants[1].nickname === dataUserChat.nickname
      ? participants[0]
      : participants[1] || { nickname: "", avatar: "" };
  const { nickname, avatar } = participant;

  const handleSelectConversation = () => {
    console.log("Selecting Conversation:", dataConversation);
    setConversationActive(dataConversation);
  };

  useEffect(() => {
    if(usersOnline.includes(participant.nickname)){
      //console.log('User Online:',participant.nickname);
      setStatusParticipant(true);
    }else{
      setStatusParticipant(false);
    }
  }, [usersOnline]);

  useEffect(() => {
    if (dataUserChat.nickname === "") {
      setConversationActive(initConversationActive);
    }
  }, [dataUserChat]);

  const handleDeleteConversation = async () => {
    console.log("Deleting Conversation:", dataConversation);
    try {
      const res = await deleteConversation(dataConversation._id);
      /* const dataHide={
        conversationId: dataConversation._id,
        nickname: dataUserChat.nickname
      }
      const res = await hideConversationInParticipant(dataHide); */
      console.log("Conversation Deleted:", res);
      const newConversations = userConversations.filter(
        (conversation) => conversation._id !== dataConversation._id
      );
      setUserConversations(newConversations);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      onClick={handleSelectConversation}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        justifyContent: "initial",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
        marginLeft: "10px",
        marginRight: "10px",
        boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
        borderRadius: "5px",
        height: "40px",
      }}
    >
      <Image
        style={{ borderRadius: "50%" }}
        src={
          dataAvatares.find((avatarObj) => avatarObj.title === avatar)?.url ||
          dataAvatares[0].url
        }
        alt="avatar"
        width={40}
        height={40}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "initial",
          alignItems: "initial",
          gap: "0px",
        }}
      >
        <h5
          style={{
            margin: "0px",
            padding: "0px",
          }}
        >
          {nickname}
          <span 
          style={{
            marginLeft: '5px'
          }}
          >
          {statusParticipant===true ? (
          <HiOutlineStatusOnline style={{ color: "green" }} />
        ) : (
          <HiOutlineStatusOffline style={{ color: "red" }} />
        )}
          </span>
        </h5>
        <p
          style={{
            margin: "0px",
            padding: "0px",
            fontSize: "12px",
            color: "gray",
          }}
        >
          {
            dataConversation.messages[dataConversation.messages.length - 1]
              ?.message
          }
        </p>
      </div>
      <Tooltip title="Delete Conversation">
        <IconButton
          onClick={handleDeleteConversation}
          sx={{ marginLeft: "auto" }}
        >
          <HighlightOffIcon sx={{ color: "red", fontSize: "12px" }} />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default CardConversation;
