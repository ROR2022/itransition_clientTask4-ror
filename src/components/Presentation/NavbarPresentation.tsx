import { Button, IconButton, TextField, Typography } from '@mui/material';
import React,{FC} from 'react'
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from '@mui/material/Tooltip';
import SlideshowIcon from "@mui/icons-material/Slideshow";
import { IPresentation } from './Presentation';


interface NavbarPresentationProps {
    myNickName: string;
    setMyNickName: (value: string) => void;
    handleNickName: () => void;
    nickName: string;
    handleHome: () => void;
    presentationActive: IPresentation | null;
    }
const NavbarPresentation:FC<NavbarPresentationProps> = ({
    myNickName,setMyNickName,handleNickName,nickName,
    handleHome,
    presentationActive
}) => {
  return (
    <div
    style={{
        backgroundColor: "#f5f5f5",
        display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "10px",
          gap: "10px",
          padding: "10px",
    }}
    >
        <div
        style={{
            display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
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
            if (newValue.length <= 15) {
              // Limit nick name to 15 characters
              setMyNickName(newValue);
            }
          }}
        />
        <Tooltip title="Save Nick Name">
        <Button variant="contained" color="error" onClick={handleNickName}>
          <SaveIcon />
        </Button>
        </Tooltip>
        </div>
        {presentationActive!==null && (
            <>
        <Typography
                sx={{
                  fontSize: "12px",
                  color: "blue",
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  backgroundColor: "#f0f0f0",
                  width: '200px',
                  marginRight: 'auto',
                  marginLeft: 'auto',
                  padding: '5px',
                }}
                variant="h6"
                gutterBottom
              >
                <SlideshowIcon />
                <span>{presentationActive.title}</span>
              </Typography>
        </>
        )}
        {nickName && (
            <>
            <Typography
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                color: "blue",
                fontWeight: "bold",
                marginLeft: "10px",
              }}
              variant="h6"
              gutterBottom
            >
              <AccountCircleIcon />
              <span>{nickName}</span>
            </Typography>
            <IconButton color="primary" onClick={handleHome}>
              <HomeIcon 
                fontSize="large"
              />
            </IconButton>
            </>
        )}

        
        
        
    </div>
  )
}

export default NavbarPresentation