import { FC, useEffect, useRef, useState } from "react";
import Peer, { SignalData } from "simple-peer";
import { useContext } from "react";
import { ChatContext, ISignalData, IVideoCall } from "./context/ChatContext";
import { Button } from "@mui/material";
import { CircularProgress } from "@mui/material";
import Image from "next/image";

interface IVideoChat {
  dataParticipantsVideoChat: { sender: string; reciver: string };
}

const VideoChat: FC<IVideoChat> = ({ dataParticipantsVideoChat }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReciver, setIsReciver] = useState(false);
  const [isOtherStream, setIsOtherStream] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  //const [otherVideo, setOtherVideo] = useState<MediaStream | null>(null);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const otherVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance | null>(null);
  const {
    setIsMakingVideoCall,
    isAnsweringVideoCall,
    setIsAnsweringVideoCall,
    incomingVideoSignal,
    setIncomingVideoSignal,
    peerVideoSignal,
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
    console.log("isOtherStream:", isOtherStream);
  }, [isOtherStream]);

  useEffect(() => {
    if (peerVideoSignal.signal !== null) {
      console.log("VideoChat peerVideoSignal:", peerVideoSignal);
      answerCall(
        peerVideoSignal.signal,
        peerVideoSignal.sender,
        peerVideoSignal.reciver
      );
      setPeerVideoSignal(initDataVideoCall);
    } else {
      //console.log('VideoChat no signal peerVideoSignal:');
    }
  }, [peerVideoSignal]);

  useEffect(() => {
    if (isAnsweringVideoCall.signal !== null) {
      console.log("ModalVideoChat isAnsweringCall:", isAnsweringVideoCall);
      //setStream(isAnsweringVideoCall.signal);
      /* answerCall(
            isAnsweringVideoCall.signal,
            isAnsweringVideoCall.sender,
            isAnsweringVideoCall.reciver
        ); */
      peerRef.current?.signal(isAnsweringVideoCall.signal);
      setLoading(false);
      setHideButton(true);
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
    setLoading(true);

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
      setLoading(false);
      setHideButton(true);
    });

    peer.on("stream", (otherStream) => {
      console.log("Start call Other Stream:", otherStream);
      if (otherVideoRef.current) {
        otherVideoRef.current.srcObject = otherStream;
        setIsOtherStream(true);
      }
    });

    peerRef.current = peer;
  };

  const answerCall = (
    signalData: SignalData | null,
    sender: string,
    reciver: string
  ) => {
    if (!stream) return;
    setLoading(true);
    setHideButton(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    console.log("Answer Call:", signalData);
    console.log(sender, reciver);
    peer.on("signal", (data) => {
      // Enviar respuesta al servidor
      console.log("VideoChat Answer Signal:", data);
      setPeerVideoSignal({ signal: data as SignalData, sender, reciver });
      setLoading(false);
    });

    if (signalData) peer.signal(signalData);

    peer.on("stream", (otherStream) => {
      console.log("Answer call Other Stream:", otherStream);
      if (otherVideoRef.current) {
        otherVideoRef.current.srcObject = otherStream;
        setIsOtherStream(true);

        setIncomingVideoSignal(initDataVideoCall);
        setLoading(false);
      }
    });

    peerRef.current = peer;
  };
  return (
    <div
      style={{
        maxHeight: "80vh",
        maxWidth: "90vw",
        overflow: "auto",
      }}
    >
      <video ref={myVideoRef} width={180} autoPlay />
      {isOtherStream && (
        <>
          <p>Other Stream:</p>
        </>
      )}
      <video ref={otherVideoRef} width={320} autoPlay />

      {!hideButton && isReciver && (
        <>
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',
            }}
        >
            <Image
                src="/telephone1.png"
                alt="Video Call"
                width={40}
                height={40}
                style={{
                    width: "150px",
                    height: "auto",
                }}
            />
            <audio src="/ring-ring.mp3" autoPlay loop />
            </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              answerCall(
                incomingVideoSignal.signal,
                incomingVideoSignal.sender,
                incomingVideoSignal.reciver
              )
            }
          >
            {loading ? (
              <CircularProgress sx={{ color: "white" }} size={20} />
            ) : (
              "Answer VideoCall"
            )}
          </Button>
        </>
      )} 
      {!hideButton && !isReciver &&
      (
        <>
          <Button variant="contained" color="primary" onClick={startCall}>
            {loading ? (
              <CircularProgress sx={{ color: "white" }} size={20} />
            ) : (
              "Start VideoCall"
            )}
          </Button>
        </>
      )}
    </div>
  );
};

export default VideoChat;
