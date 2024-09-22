"use client";
import React, { useState, useEffect } from "react";
import Slide from "./Slide";
import { DataSlideType } from "./Slide";
import MyTabs from "./MyTabs";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useLocalStorage } from "usehooks-ts";
import Presentations from "./Presentations";
import NewSlide from "./NewSlide";
import { getSlideById } from "@/api/apiPresentation";
//importar el icono de home de material ui
import HomeIcon from "@mui/icons-material/Home";
import WebSocketClient from "./WebSocketClient/WebSocketClient";

import { ParticipantType } from "./Participants";
//import { get } from "http";
//import { error } from "console";

/* const dataPresentationTmp = [
  {
    id: "Slide1",
    title: "Slide 1",
    description: "Description 1",
    textBlocks: [
      {
        id: "Text1",
        text: "Hello World",
        fontSize: 16,
        color: "#000000",
        fontFamily: "Arial",
        fontStyle: "normal",
        backgoundColor: "#ffffff",
        textAlign: "center",
        x: 0,
        y: 0,
      },
    ],
  },
  {
    id: "Slide2",
    title: "Slide 2",
    description: "Description 2",
    textBlocks: [
      {
        id: "Text2",
        text: "Hello World 2",
        fontSize: 16,
        color: "#000000",
        fontFamily: "Arial",
        fontStyle: "normal",
        backgoundColor: "#ffffff",
        textAlign: "center",
        x: 0,
        y: 0,
      },
    ],
  },
]; */

export interface IPresentation {
  _id?: string | undefined;
  author?: string | undefined;
  nickname?: string | undefined;
  users?: {nickname:string, role:string}[] | undefined;
  slides?: [] | undefined;
  title?: string | undefined;
  description?: string | undefined;
}

const Presentation = () => {
  const [dataPresentation, setDataPresentation] =
    useState<Array<DataSlideType>>([]);
    const [presentationActive, setPresentationActive] = useState<IPresentation|null>(null);
  const [slideActive, setSlideActive] = useState<DataSlideType|null>(
    dataPresentation[0]
  );
  const [nickName, setNickName] = useLocalStorage("nickNameUser", "");
  const [myNickName, setMyNickName] = useState(nickName);
  const [isEditor, setIsEditor] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  //const [presentationParticipants, setPresentationParticipants] = useLocalStorage<ParticipantType[]>('presentationParticipants', []);
  const [myParticipants, setMyParticipants] = useState<ParticipantType[]>([]);
  const [isUpdatingParticipant, setIsUpdatingParticipant] = useState<ParticipantType|null>(null);
  const [reloadDataSlide, setReloadDataSlide] = useState<string|null>(null);
  const [isFetchingDataSlide, setIsFetchingDataSlide] = useState<{presentationActive:string,slideActive:string}|null>(null);
  const [reloadDataPresentation, setReloadDataPresentation] = useState<string|null>(null);

  useEffect(()=>{
    //setPresentationParticipants([]);
    console.log('myParticipants:',myParticipants);
  },[myParticipants]);

  

  useEffect(() => {
    console.log("slideActive:", slideActive);
    //necesitamos checar si el array de textblocks no esta vacio para recuperar los datos de los textblocks
    /* if (slideActive && slideActive.textblocks.length > 0 && typeof slideActive.textblocks[0] === 'string') {
      //console.log("slideActive.textBlocks:", slideActive.textBlocks);
      getDataSlide();
    } */
    if(slideActive!==null) getDataSlide();
  }, [slideActive]);
  useEffect(() => {}, [isEditor]);
  useEffect(() => {}, [nickName]);
  useEffect(() => {}, [myNickName]);
  useEffect(() => {
    if (dataPresentation.length > 0) {
      if(!slideActive) setSlideActive(dataPresentation[0]);
      //console.log("dataPresentation:", dataPresentation);
    }
  }, [dataPresentation]);
  useEffect(() => {
    if (presentationActive) {
      //setDataPresentation(presentationActive.slides);
      console.log("presentationActive:", presentationActive);
      if (presentationActive&&presentationActive.slides &&presentationActive.slides.length > 0) {
        //setSlideActive(presentationActive.slides[0]);
        setDataPresentation(presentationActive.slides);
      }
      const userInPresentation = presentationActive?.users?.find(user=>user.nickname===nickName);
    if(presentationActive.nickname===nickName){
      setIsAuthor(true);
      setIsEditor(true);
    }else if(userInPresentation&&userInPresentation.role==='editor'){
      setIsEditor(true);
    }else{
      setIsEditor(false);
    }
    }
  }, [presentationActive]);

  useEffect(() => {
    //console.log('presentationActive.users:',presentationActive?.users);
    if(!isAuthor){
      const tempUsers = presentationActive?.users;
      //comparar si el usuario logeado es editor
      const userLogged = nickName;
      const userInPresentation = tempUsers?.find(user=>user.nickname===userLogged);
      if(userInPresentation&&userInPresentation.role==='editor'){
        setIsEditor(true);
        //getDataSlide();
      }else{
        setIsEditor(false);
      }
    }
    
  }, [presentationActive?.users]);
  useEffect(() => {
    if(isFetchingDataSlide!==null){
      onFetchingDataSlide(isFetchingDataSlide);
    }
  },[isFetchingDataSlide]);

  const handleNickName = () => {
    setNickName(myNickName);
  };

  const getDataSlide = async () => {
    if(!slideActive) return {error: 'No slide active'};
    try {
      const res = await getSlideById(slideActive?._id);
      console.log("res getDataSlide:", res);
      setSlideActive(res);
      return res;
    } catch (error) {
      console.log("error getDataSlide:", error);
    }
  }

  const onFetchingDataSlide = (objData:{presentationActive:string, slideActive:string}) => {
    if(!slideActive){
      setIsFetchingDataSlide(objData);
      return;
    }else{
      setIsFetchingDataSlide(null);
    }
    console.log('fetchDataSlide:',objData);
    console.log('presentationActive:',presentationActive?._id);
    console.log('slideActive:',slideActive);
    if(objData.presentationActive === presentationActive?._id&&objData.slideActive === slideActive?._id){
      //console.log('fetchDataSlide:',objData);
      //setReloadDataSlide('reload');
      console.log('fetchingDataSlide:....');
      getDataSlide();
    }
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "10px",
          gap: "10px",
        }}
      >
        <TextField
          id="outlined-basic"
          label="Nick Name"
          variant="outlined"
          value={myNickName}
          onChange={(e) => {
            const newValue = e.target.value;
            if (newValue.length <= 15) { // Limit nick name to 15 characters
              setMyNickName(newValue);
            }
          }}
        />
        <Button variant="contained" color="error" onClick={handleNickName}>
          Save Nick Name
        </Button>
      </Box>
      {nickName!=='' && (
        <div>
          
          <IconButton
          color="primary"
          onClick={()=>{
            setPresentationActive(null);
            setSlideActive(null);
            setDataPresentation([]);
          }}
          >
          <HomeIcon/>
          </IconButton>
          <Typography variant="h6" gutterBottom>
            Welcome: 
            <span
              style={{
                color: "blue",
                fontWeight: "bold",
                marginLeft: "10px",
              }}
            >
              {nickName}
            </span>
          </Typography>
          {presentationActive!==null && (
            <>
            <WebSocketClient
          nickNameUser={nickName}
          setMyParticipants={setMyParticipants}
          presentationActive={presentationActive}
          setPresentationActive={setPresentationActive}
          isUpdatingParticipant={isUpdatingParticipant}
          setIsUpdatingParticipant={setIsUpdatingParticipant}
          reloadDataSlide={reloadDataSlide}
          setReloadDataSlide={setReloadDataSlide}
          slideActive={slideActive}
          onFetchingDataSlide={onFetchingDataSlide}
          reloadDataPresentation={reloadDataPresentation}
          setReloadDataPresentation={setReloadDataPresentation}
          />
            <Typography variant="h6" gutterBottom>
            Presentation: 
            <span
              style={{
                color: "blue",
                fontWeight: "bold",
                marginLeft: "10px",
              }}
            >
              {presentationActive.title}
            </span>
          </Typography>
          {presentationActive.slides?.length=== 0 && (isEditor||isAuthor) &&!slideActive &&(
            <Typography 
            sx={{fontSize: "12px"}}
            color="info" variant="h6" gutterBottom>
              Please add a new slide to start the presentation
            </Typography>
          )}
          {isAuthor && (
            <NewSlide
              presentationActive={presentationActive}
              setSlideActive={setSlideActive}
              dataPresentation={dataPresentation}
              setDataPresentation={setDataPresentation}
              setReloadDataPresentation={setReloadDataPresentation}
            />
          )}
            
            </>
          )}
          {presentationActive===null &&(
            <Presentations
              setPresentationActive={setPresentationActive}
              nickNameUser={nickName}
            />
          )}
          {slideActive&& presentationActive &&(
            <>
              <MyTabs
                dataPresentation={dataPresentation}
                slideActive={slideActive}
                setSlideActive={setSlideActive}
              />
              {slideActive  &&(
                <Slide
                  dataSlide={slideActive}
                  setDataPresentation={setDataPresentation}
                  dataPresentation={dataPresentation}
                  presentationActive={presentationActive}
                  nickNameUser={nickName}
                  myParticipants={myParticipants}
                  setIsUpdatingParticipant={setIsUpdatingParticipant}
                  isEditor={isEditor}
                  setReloadDataSlide={setReloadDataSlide}
                  isAuthor={isAuthor}
                />
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Presentation;
