import { FC, useEffect, useRef, useState } from "react";
import Peer, { SignalData } from "simple-peer";
import { useContext } from "react";
import { ChatContext, ISignalData, IVideoCall } from "./context/ChatContext";
import { Button } from "@mui/material";

interface IVideoChat {
  dataParticipantsVideoChat: { sender: string; reciver: string };
}

const VideoChat: FC<IVideoChat> = ({ dataParticipantsVideoChat }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReciver, setIsReciver] = useState(false);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const otherVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance | null>(null);
  const {
    setIsMakingVideoCall,
    isAnsweringVideoCall,
    setIsAnsweringVideoCall,
    incomingVideoSignal,
    setIncomingVideoSignal,
    initDataVideoCall,
    setPeerVideoSignal,
  } = useContext(ChatContext);

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStreamData) => {
        setStream(currentStreamData);
        currentStream = currentStreamData;
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = currentStreamData;
        }
      });

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
      currentStream?.getTracks().forEach((track) => track.stop());
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (isAnsweringVideoCall.signal !== null) {
      console.log("ModalVideoChat isAnsweringCall:", isAnsweringVideoCall);
      setIsAnsweringVideoCall(initDataVideoCall);
    }
  }, [isAnsweringVideoCall]);

  useEffect(() => {
    if (incomingVideoSignal.signal !== null) {
      /* answerCall(
        incomingVideoSignal.signal,
        incomingVideoSignal.sender,
        incomingVideoSignal.reciver
      );
      setIncomingVideoSignal(initDataVideoCall); */
      console.log("ModalVideoChat incomingVideoSignal:", incomingVideoSignal);
      setIsReciver(true);
    }
  }, [incomingVideoSignal]);

  const startCall = () => {
    if (!stream) return;
    const peer = new Peer({ initiator: true, trickle: false, stream });
    console.log("Start Call:", dataParticipantsVideoChat);
    peer.on("signal", (data) => {
      // Enviar señal al servidor (NestJS)
      // Ejemplo: socket.emit('call-user', data);
      console.log("Signal:", data);
      const dataCall: IVideoCall = {
        signal: data as ISignalData,
        sender: dataParticipantsVideoChat.sender,
        reciver: dataParticipantsVideoChat.reciver,
      };
      setIsMakingVideoCall({ ...dataCall });
    });

    peer.on("stream", (otherStream) => {
      console.log("Start call Other Stream:", otherStream);
      if (otherVideoRef.current) {
        otherVideoRef.current.srcObject = otherStream;
      }
    });

    peerRef.current = peer;
  };

  const answerCall = (
    signalData: SignalData|null,
    sender: string,
    reciver: string
  ) => {
    if (!stream) return;
    const peer = new Peer({ initiator: false, trickle: false, stream });
    console.log("Answer Call:", signalData);
    peer.on("signal", (data) => {
      // Enviar respuesta al servidor
      setPeerVideoSignal({ signal: data as ISignalData, sender, reciver });
      setIncomingVideoSignal(initDataVideoCall);
    });

    if (signalData)
    peer.signal(signalData);

    peer.on("stream", (otherStream) => {
      console.log("Answer call Other Stream:", otherStream);
      if (otherVideoRef.current) {
        otherVideoRef.current.srcObject = otherStream;
      }
    });

    peerRef.current = peer;
  };
  return (
    <div>
      

      {isReciver ? (
        <>
          <video ref={otherVideoRef} autoPlay style={{ width: "300px" }} />
          <Button variant="contained" color="primary" onClick={()=>answerCall(incomingVideoSignal.signal, incomingVideoSignal.sender,incomingVideoSignal.reciver)}>
            Answer VideoCall
          </Button>
        </>
      ) : (
        <>
        <video ref={myVideoRef} autoPlay muted style={{ width: "300px" }} />
        <Button variant="contained" color="primary" onClick={startCall}>
          Init VideoCall
        </Button>
        </>
      )}
    </div>
  );
};

export default VideoChat;
