import { Box, IconButton, TextField } from "@mui/material";
import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import {
  createMessage,
  addMessageToConversation,
  getConversationsByParticipantId,
} from "@/api/apiChat";
import { useContext } from "react";
import { ChatContext } from "./context/ChatContext";
import { IConversation } from "./MyConversations";

const FooterConversation = () => {
  const [messageTmp, setMessageTmp] = useState("");
  const {
    conversationActive,
    dataUserChat,
    setUserConversations,
    setConversationActive,
    initConversationActive,
    setEmitingMessage
  } = useContext(ChatContext);

  const handleCreateMessage = async () => {
    console.log("Sending Message:", messageTmp);
    try {
      const dataMessageTmp = {
        message: messageTmp,
        sender: dataUserChat._id,
        reciver:
          conversationActive.participants[0]._id === dataUserChat._id
            ? conversationActive.participants[1]._id
            : conversationActive.participants[0]._id,
        conversation: conversationActive._id,
      };
      const resCreateMessage = await createMessage(dataMessageTmp);
      console.log("resCreateMessage:", resCreateMessage);
      const resAddMessageToConversation = await addMessageToConversation(
        conversationActive._id,
        resCreateMessage._id
      );
      console.log("resAddMessageToConversation:", resAddMessageToConversation);
      const resConversations = await getConversationsByParticipantId(
        dataUserChat._id
      );
      console.log("resConversations:", resConversations);
      //filter conversations with hideConversations
      const tempConversations = [] as IConversation[];
      resConversations.forEach((conversation: IConversation) => {
        const findConversation = dataUserChat.hideConversations?.find(
          (hideConversation) => hideConversation === conversation._id
        );
        if (!findConversation) {
          tempConversations.push(conversation);
        }
      });
      setUserConversations(tempConversations);
      const findConversation = tempConversations.find(
        (conversation: IConversation) =>
          conversation._id === conversationActive._id
      );
      if (findConversation) {
        setConversationActive(findConversation);
      } else {
        setConversationActive(initConversationActive);
      }
      setEmitingMessage(resCreateMessage);
      window.scrollTo(0, document.body.scrollHeight);
    } catch (error) {
      console.log(error);
    }

    setMessageTmp("");
  };
  return (
    <div
      style={{
        height: "10%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <TextField
          sx={{
            width: "80%",
          }}
          id="outlined-basic"
          label="Type a message"
          variant="outlined"
          size="small"
          value={messageTmp}
          onChange={(e) => setMessageTmp(e.target.value)}
        />
        <IconButton onClick={handleCreateMessage}>
          <SendIcon color="info" />
        </IconButton>
      </Box>
    </div>
  );
};

export default FooterConversation;
