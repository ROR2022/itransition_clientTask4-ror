"use client"
import React from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
//import icons of linkedin, github, hackerrank, portfolio and cv 
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { FaHackerrank } from 'react-icons/fa';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkIcon from '@mui/icons-material/Work';
import Link from 'next/link';
import { userSettingsLinks } from '@/dataEnv/dataEnv';
import Tooltip from "@mui/material/Tooltip";

const listIcons = [
  <LinkedInIcon key={Math.random()*100} />,
  <GitHubIcon key={Math.random()*100}/>,
  <FaHackerrank key={Math.random()*100}/>,
  <DescriptionIcon key={Math.random()*100}/>,
  <WorkIcon key={Math.random()*100}/>
]


const MyFooter = () => {
  
  return(
  <div>
       <AppBar position="fixed"  sx={{bgcolor:'primary.main', top: 'auto', bottom: 0 }}>
        <Toolbar sx={{justifyContent:'center'}}>
          {userSettingsLinks.map((item, index) => (
            <IconButton key={Math.random()*1000} color="inherit" aria-label="open drawer">
            <Tooltip title={item.title} arrow>
            <Link href={item.url||'#'} style={{color:'inherit'}}>
              {listIcons[index]}
            </Link>
            </Tooltip>
          </IconButton>
          ))}
          
        </Toolbar>
      </AppBar> 
    </div>
  )

}

export default MyFooter