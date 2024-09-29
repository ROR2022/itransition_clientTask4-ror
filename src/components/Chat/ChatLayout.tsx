import { Box, useMediaQuery } from "@mui/material";
import React, { useContext, useEffect } from "react";
import Conversations from "./Conversations";
import MainConversation from "./MainConversation";
import ChatContext from "./context/ChatContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";

const ChatLayout = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const {
    dataUserChat,
    conversationActive,
    setConversationActive,
    initConversationActive,
  } = useContext(ChatContext);

  useEffect(() => {
    //console.log(dataUserChat);
  }, [conversationActive]);
  useEffect(() => {
    console.log('dataUserChat:',dataUserChat);
  }, [dataUserChat]);
  return (
    <>
      {dataUserChat&&dataUserChat._id === "" ? (
        <p>No User</p>
      ) : (
        <Box
          sx={{
            display: isMobile ? "block" : "flex",
            justifyContent: "center",
            height: "100%",
            overflow: "hidden",
            width: "100%",
            paddingRight: "10px",
          }}
        >
          {isMobile ? (
            conversationActive?._id === "" ? (
              <Conversations />
            ) : (
              <>
                <IconButton
                  sx={{ position: "absolute", top: "15vh", left: "80%" }}
                  onClick={() => setConversationActive(initConversationActive)}
                >
                  <ArrowBackIcon />
                </IconButton>

                <MainConversation />
              </>
            )
          ) : (
            <>
              <Conversations />
              <MainConversation />
            </>
          )}
        </Box>
      )}
    </>
  );
};

export default ChatLayout;
