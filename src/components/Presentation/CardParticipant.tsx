import React, { FC } from "react";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { IPresentation } from "./Presentation";
import { editUserInPresentation } from "@/api/apiPresentation";
import { ParticipantType } from "./Participants";



interface CardParticipantProps {
  dataParticipant: ParticipantType;
  presentationActive: IPresentation | null;
  nickNameUser: string;
  setIsUpdatingParticipant: (isUpdating: ParticipantType | null) => void;
}

const CardParticipant: FC<CardParticipantProps> = ({
  dataParticipant,
  presentationActive,
  nickNameUser,
  setIsUpdatingParticipant,
}) => {
  const { nickname, status, role } = dataParticipant;
  const userAuthor = presentationActive?.nickname;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewer = async() => {
    console.log("handleViewer");
    handleClose();
    try {
      const response = await editUserInPresentation(presentationActive?._id, nickname, "viewer");
      console.log(response);
      //hace falta emitir un evento para que el servidor actualice los participantes via websocket
      dataParticipant.role = "viewer";
      setIsUpdatingParticipant(dataParticipant);
    } catch (error) {
      console.log(error);
    }
  };
    const handleEditor = async() => {
        console.log("handleEditor");
        handleClose();
        try {
          const response = await editUserInPresentation(presentationActive?._id, nickname, "editor");
          console.log(response);
          dataParticipant.role = "editor";
          setIsUpdatingParticipant(dataParticipant);
        } catch (error) {
          console.log(error);
        }
    }
  return (
    <div
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "5px",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <RadioButtonUncheckedOutlinedIcon
          style={{
            color: status === "online" ? "green" : "red",
            fontSize: "14px",
          }}
        />
        <div>
          <Typography
            sx={{
              fontSize: "14px",
              color:
                role === "author"
                  ? "red"
                  : role === "editor"
                  ? "blue"
                  : role === "viewer"
                  ? "green"
                  : "black",
            }}
            variant="h6"
          >
            
              {nickname}
            
          </Typography>
        </div>
        {userAuthor === nickNameUser && (
          <>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <MoreVertIcon />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleViewer}>Viewer</MenuItem>
              <MenuItem onClick={handleEditor}>Editor</MenuItem>
            </Menu>
          </>
        )}
      </div>
    </div>
  );
};

export default CardParticipant;
