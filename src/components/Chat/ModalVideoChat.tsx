import { Box, Modal } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import Peer, {SignalData} from "simple-peer";
import { useContext } from "react";
import { ChatContext, ISignalData, IVideoCall } from "./context/ChatContext";
//import { send } from "process";

const styleModal = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface ModalVideoChatProps {
  isOpenModal: boolean;
  setIsOpenModal: (value: boolean) => void;
  dataParticipantsVideoChat: { sender: string; reciver: string };
}

const ModalVideoChat: FC<ModalVideoChatProps> = ({
  isOpenModal,
  setIsOpenModal,
  dataParticipantsVideoChat,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
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
    // Obtener el acceso a la cámara y micrófono
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = currentStream;
        }
      });

    return () => {
      // Limpiar el stream al desmontar el componente
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (isAnsweringVideoCall.signal !== null) {
      
      setIsAnsweringVideoCall(initDataVideoCall);
    }
  }, [isAnsweringVideoCall]);

  useEffect(() => {
    if (incomingVideoSignal.signal !== null) {
      answerCall(incomingVideoSignal.signal, incomingVideoSignal.sender, incomingVideoSignal.reciver);
      setIncomingVideoSignal(initDataVideoCall);
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
      const dataCall:IVideoCall = {
        signal: data as ISignalData,
        sender: dataParticipantsVideoChat.sender,
        reciver: dataParticipantsVideoChat.reciver,
      };
      setIsMakingVideoCall({ ...dataCall });
    });

    peer.on("stream", (otherStream) => {
      if (otherVideoRef.current) {
        otherVideoRef.current.srcObject = otherStream;
      }
    });

    peerRef.current = peer;
  };

  const answerCall = (signalData: SignalData, sender:string, reciver:string) => {
    if (!stream) return;
    const peer = new Peer({ initiator: false, trickle: false, stream });
    console.log("Answer Call:", signalData);
    peer.on("signal", (data) => {
      // Enviar respuesta al servidor
      setPeerVideoSignal({ signal: data as ISignalData,sender,reciver });
    });

    peer.signal(signalData);

    peer.on("stream", (otherStream) => {
      if (otherVideoRef.current) {
        otherVideoRef.current.srcObject = otherStream;
      }
    });

    peerRef.current = peer;
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  return (
    <Modal
      open={isOpenModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styleModal}>
        <div>
          <video ref={myVideoRef} autoPlay muted style={{ width: "300px" }} />
          <video ref={otherVideoRef} autoPlay style={{ width: "300px" }} />
          <button onClick={startCall}>Iniciar llamada</button>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalVideoChat;
