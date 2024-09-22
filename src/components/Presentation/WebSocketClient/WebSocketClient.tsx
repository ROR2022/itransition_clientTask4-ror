import { useEffect, useState, FC } from "react";
import { io, Socket } from "socket.io-client";
import { Button, TextField } from "@mui/material";
import { hostURL } from "@/dataEnv/dataEnv";
//import { useLocalStorage } from "usehooks-ts";
import { ParticipantType } from "../Participants";
import { IPresentation } from "../Presentation";
import { DataSlideType } from "../Slide";
import { getPresentationById } from "@/api/apiPresentation";
//import { on } from "events";

let socket: Socket;

interface WebSocketClientProps {
  nickNameUser: string;
  setMyParticipants: (participants: ParticipantType[]) => void;
  presentationActive: IPresentation | null;
  isUpdatingParticipant: ParticipantType | null;
  setIsUpdatingParticipant: (isUpdating: ParticipantType | null) => void;
  setPresentationActive: (presentation: IPresentation | null) => void;
  reloadDataSlide: string | null;
  setReloadDataSlide: (reloadDataSlide: string|null) => void;
  slideActive: DataSlideType | null;
  onFetchingDataSlide: (data: {presentationActive:string, slideActive:string}) => void;
  reloadDataPresentation: string | null;
  setReloadDataPresentation: (reloadDataPresentation: string|null) => void;
}

const WebSocketClient: FC<WebSocketClientProps> = ({
  nickNameUser,
  setMyParticipants,
  presentationActive,
  isUpdatingParticipant,
  setIsUpdatingParticipant,
  setPresentationActive,
  reloadDataSlide,
  setReloadDataSlide,
  slideActive,
  onFetchingDataSlide,
  reloadDataPresentation,
  setReloadDataPresentation,
}) => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  //const [dataSlideTmp, setDataSlideTmp] = useState<DataSlideType | null>(null);

  useEffect(() => {
    // Conectando al servidor WebSocket
    socket = io(`${hostURL}`); // Cambia esta URL según la configuración de tu servidor

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("message", (data: string) => {
      console.log("Message from server:", data);
      setResponse(data); // Actualiza la respuesta del servidor
    });

    const dataJoin = {
      nickname: nickNameUser,
      role:
        presentationActive?.users?.find((user) => user.nickname === nickNameUser)
          ?.role || "viewer",
      status: "online",
      presentationActive: presentationActive?._id || "",
    };
    socket.emit("join", JSON.stringify(dataJoin));

    socket.on("joined", (data: []) => {
      console.log("newParticipants", data);
      setMyParticipants([...data]);
    });

    socket.on("left", (data: []) => {
      console.log("left:", data);
      //const newParticipants = myParticipants.filter((participant) => participant.id !== data);
      setMyParticipants([...data]);
    });

    socket.on("updatedParticipant", (data: ParticipantType[]) => {
      console.log("updatedParticipant:", data);
      setMyParticipants([...data]);
      const usersInPresentation:{ nickname: string, role: string }[] | undefined = presentationActive?.users;
      usersInPresentation?.forEach((actualUser:{ nickname: string, role: string }) => {
        const userUpdated = data.find(newUser=>newUser.nickname===actualUser.nickname);
        if(userUpdated){
          actualUser.role = userUpdated.role;
        }
      });
      const newPresentation = {
        ...presentationActive,
        users: usersInPresentation
      };
      setPresentationActive(newPresentation);
      
    });

    socket.on('fetchDataSlide', (data: string) => {
      const objData = JSON.parse(data);
      onFetchingDataSlide(objData);
    });

    socket.on("fetchDataPresentation", (presentationId: string) => {
      if (presentationActive?._id === presentationId) {
        onFetchingDataPresentation(presentationId);
      }
    });

    return () => {
      socket?.emit("leave", nickNameUser);
      socket?.disconnect();
      console.log("Disconnected from WebSocket server");
      setMyParticipants([]);
    };
  }, []);

  useEffect(() => {
    if (reloadDataPresentation !== null) {
      socket?.emit("reloadDataPresentation", presentationActive?._id);
      setReloadDataPresentation(null);
    }
  },[reloadDataPresentation]);

  useEffect(() => {
    if (isUpdatingParticipant !== null) {
      socket?.emit("updateParticipant", JSON.stringify(isUpdatingParticipant));
      setIsUpdatingParticipant(null);
    }
  }, [isUpdatingParticipant]);

  useEffect(() => {
    if (reloadDataSlide!==null) {
      const dataReload = {
        presentationActive: presentationActive?._id,
        slideActive: slideActive?._id,
      }
      socket?.emit("getDataSlide", JSON.stringify(dataReload));
      setReloadDataSlide(null);
    }
  }, [reloadDataSlide]);

  useEffect(() => {
    console.log("WebSocket slideActive:", slideActive);
    
  }, [slideActive]);

  
  const onFetchingDataPresentation = async (presentationId: string) => {
    try {
      const response = await getPresentationById(presentationId);
      console.log("response getPresentationById:", response);
      setPresentationActive(response);
    } catch (error) {
      console.error(error);
    }
  }

  

  const sendMessage = () => {
    socket?.emit("message", message); 
    setMessage(""); 
  };

  return (
    <div
      style={{
        display: "none",
      }}
    >
      <h2>WebSocket Client</h2>
      <TextField
        label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        variant="outlined"
      />
      <Button variant="contained" color="primary" onClick={sendMessage}>
        Send Message
      </Button>
      <p>Server Response: {response}</p>
    </div>
  );
};

export default WebSocketClient;
