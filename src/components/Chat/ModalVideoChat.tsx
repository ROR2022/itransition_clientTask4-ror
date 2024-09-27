import { Box, IconButton, Modal } from "@mui/material";
import { FC } from "react";
import VideoChat from "./VideoChat";
import CancelIcon from '@mui/icons-material/Cancel';


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
        <IconButton
            sx={{
                position: 'absolute',
                top: '0',
                right: '0',
            }}
            onClick={handleCloseModal}
        >
            <CancelIcon sx={{
                color: 'seagreen'
            }}/>
        </IconButton>
        <VideoChat dataParticipantsVideoChat={dataParticipantsVideoChat} />
      </Box>
    </Modal>
  );
};

export default ModalVideoChat;
