import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Avatar, Box } from "@mui/material";
import Save from "@mui/icons-material/Save";
import Grid from "@mui/material/Grid2";
import { dataAvatares } from "@/dataEnv/dataEnv";
import Image from "next/image";
import { useContext } from "react";
import { ChatContext } from "./context/ChatContext";
import { getParticipantByNickname, createParticipant, updateParticipant, getParticipantById} from "@/api/apiChat"
import ChatWebSocket from "./ChatWebSocket";
//import { on } from "events";

const DataMainUser = () => {
  const { dataUserChat, setDataUserChat, setConversationActive,initConversationActive } = useContext(ChatContext);
  const [nickNameUser, setNickNameUser] = useState(dataUserChat.nickname);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(dataUserChat.avatar);
  const [hideAvatares, setHideAvatares] = useState(dataUserChat.nickname ? true : false);
  const [isSavedChanges, setIsSavedChanges] = useState(false);

  useEffect(() => {
    if(dataUserChat._id!==''){
      fetchDataUserChat();
    }
    
  },[]);

  const fetchDataUserChat = async() => {
    try {
      const res = await getParticipantById(dataUserChat._id);
      console.log('res:',res);
      setDataUserChat(res);
      setNickNameUser(res.nickname);
      setSelectedAvatar(res.avatar);
    } catch (error) {
      console.log(error);
    }
  }
  
  const handleSaveNickName = async() => {
    //console.log(nickNameUser);
    //console.log(selectedAvatar);
    setHideAvatares(true);
    
    try {
      const resGetParticipant = await getParticipantByNickname(nickNameUser);
      console.log('resGetParticipant:',resGetParticipant);
      if(!resGetParticipant){
        const dataParticipantTmp = {
          nickname: nickNameUser,
          avatar: selectedAvatar || dataAvatares[0].title,
          online: true,
        }
        const resCreateParticipant = await createParticipant(dataParticipantTmp);
        console.log('resCreateParticipant:',resCreateParticipant);
        setDataUserChat({
          ...dataUserChat,
          nickname: nickNameUser,
          avatar: selectedAvatar || dataAvatares[0].title,
          _id: resCreateParticipant._id,
        });
        setIsSavedChanges(true);
        setConversationActive(initConversationActive);
      }else{
        const dataParticipantTmp = {
          nickname: nickNameUser,
          avatar: selectedAvatar || dataAvatares[0].title,
          online: true,
        }
        const resUpdateParticipant = await updateParticipant(resGetParticipant._id, dataParticipantTmp);
        console.log('resUpdateParticipant:',resUpdateParticipant);
        setDataUserChat({
          ...dataUserChat,
          nickname: nickNameUser,
          avatar: selectedAvatar || dataAvatares[0].title,
          _id: resGetParticipant._id,
        });
        setIsSavedChanges(true);
        setConversationActive(initConversationActive);
      }

    } catch (error) {
      console.log(error);
    }
  };
  const handleAvatarClick = (title: string) => {
    setSelectedAvatar(title);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "initial",
        alignItems: "initial",
        padding: "10px",
        paddingLeft: "5vw",
        gap: "10px",
        background: 'radial-gradient(circle, rgba(221,221,221,1) 0%, rgba(0,212,255,1) 52%, rgba(221,221,221,1) 100%)'
      }}
    >
      {isSavedChanges||dataUserChat._id!=='' && (
        <ChatWebSocket/>
      )}
      <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'initial',
        alignItems: 'center',
        gap: '10px',
      }}
      >
      <Image
        style={{ borderRadius: "50%" }}
        src={selectedAvatar ? dataAvatares.find(avatar=>avatar.title===selectedAvatar)?.url||dataAvatares[0].url : dataAvatares[0].url}
        alt="avatar"
        width={40}
        height={40}
      />
      <Typography
      color="textSecondary"
      variant="h6" gutterBottom>
        {dataUserChat.nickname}
      </Typography>
      {!hideAvatares && (
        <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'initial',
          alignItems: 'center',
          gap: '10px',
        }}
        >
      <TextField
        label="NickName"
        value={nickNameUser}
        onChange={(e) => {
          if(e.target.value.length<=15)
          setNickNameUser(e.target.value)
        }
        }
      />
      <Button variant="contained" color="success" onClick={handleSaveNickName}>
        <Save />
      </Button>
      </Box>
      )}
      
      </Box>
      {hideAvatares && (
        <div
          
          style={{
            backgroundColor: "#3f51b5",
            color: "#fff",
            padding: "5px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "12px",
            width: "100px",
          }}
          onClick={() => setHideAvatares(false)}
        >
          Change DataLogin
        </div>
      )}
      {!hideAvatares && (
        <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'initial',
          alignItems: 'initial',
          gap: '10px',
        }}
        >
      <Typography
      sx={{
        textAlign: 'center',
        width: '300px',
        fontSize: '12px'}}
      color="textSecondary" 
      variant="h6" gutterBottom>
        Select an avatar
      </Typography>
      <Grid container 
      sx={{width: '300px'}}
      spacing={2}>
        {dataAvatares.map((avatar, index) => (
          <Grid size={{ xs: 2 }} key={index}>
            <Avatar
              src={avatar.url}
              alt={`avatar-${index}`}
              sx={{
                width: 36,
                height: 36,
                cursor: "pointer",
                border:
                  selectedAvatar === avatar.title
                    ? "2px solid #3f51b5"
                    : "none",
              }}
              onClick={() => handleAvatarClick(avatar.title)}
            />
          </Grid>
        ))}
      </Grid>
      </Box>
      )}
      
    </div>
  );
};

export default DataMainUser;
