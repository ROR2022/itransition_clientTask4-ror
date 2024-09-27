import { Box, IconButton, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import {
  createMessage,
  addMessageToConversation,
  getConversationsByParticipantId,
} from "@/api/apiChat";
import { useContext } from "react";
import { ChatContext } from "./context/ChatContext";
import { IConversation } from "./MyConversations";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const FooterConversation = () => {
  const [messageTmp, setMessageTmp] = useState("");
  const [imageTmp, setImageTmp] = useState<File|null>(null);
  const {
    conversationActive,
    dataUserChat,
    setUserConversations,
    setConversationActive,
    initConversationActive,
    setEmitingMessage,
    setImageMessage,
  } = useContext(ChatContext);

  useEffect(() => {
    if(imageTmp!==null){
      handleCreateImageMessage();
    }
  }, [imageTmp]);

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

  const handleCreateImageMessage = () => {
    console.log("Creating Image Message", imageTmp);
    setImageTmp(null);
  }
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageTmp(e.target.files[0]);
      //setMessageTmp(e.target.files[0].name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setImageMessage({
          content: base64Image as string,
          sender: dataUserChat.nickname,
          reciver: conversationActive.participants[0]._id === dataUserChat._id
          ? conversationActive.participants[1].nickname
          : conversationActive.participants[0].nickname,
        })
      };
      const imageUrl=reader.readAsDataURL(e.target.files[0]);
      console.log("Image URL:",imageUrl);
    }
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
        <IconButton>
          <label htmlFor="upload-photo">
          <AddPhotoAlternateIcon color="info" />
          </label>
          <input
            style={{ display: 'none' }}
            id="upload-photo"
            name="upload-photo"
            type="file"
            onChange={handleImageChange}
          />
        </IconButton>
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
