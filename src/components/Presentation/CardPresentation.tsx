import React, {FC} from 'react'
//import SlideshowIcon from '@mui/icons-material/Slideshow';
//import Image from 'next/image';
import { IPresentation } from './Presentation';
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import { addUserToPresentation } from '@/api/apiPresentation';


interface CardPresentationProps {
  dataPresentation: IPresentation;
  setPresentationActive: (data: IPresentation) => void; 
  nickNameUser: string;
}

const logos=[
  '/presentationLogo.png',
  '/presentationLogo2.png',
  '/presentationLogo3.png',
  '/presentationLogo4.jpg',
  '/presentationLogo5.png',
]

//logos[Math.floor(Math.random() * logos.length)]
//'https://cataas.com/cat'

const CardPresentation:FC<CardPresentationProps> = ({dataPresentation, setPresentationActive, nickNameUser}) => {
  const {title, description, nickname, _id} = dataPresentation;
  const handleSelectPresentation = async() => {
    //console.log('selected row:', row);
    if(nickname === nickNameUser){
      setPresentationActive(dataPresentation); 
      return;
    }
    
    //es necesario checar si el usuario no es el autor de la presentacion 
    //entonces se debe agregar al usuario a la presentacion como viewer
    try {
      const res = await addUserToPresentation(_id, nickNameUser);
      console.log('res addUserToPresentation:', res);
      const tempUsers = dataPresentation.users;
      const isUser = tempUsers?.find(user=>user.nickname===nickNameUser);
      if(!isUser) dataPresentation?.users?.push({nickname:nickNameUser, role:'viewer'});
      setPresentationActive(dataPresentation);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div
    style={{cursor:'pointer'}}
    onClick={handleSelectPresentation}
    >
    <Card 
    
    sx={{ width: 250 }}>
      <CardMedia
        sx={{ 
          objectFit: 'contain',
          height: 140,
        }}
        image={logos[Math.floor(Math.random() * logos.length)]}
        title="PresentationLogo"
      />
      <CardContent>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {_id}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      </CardContent>
      <CardActions
      sx={{display:'none'}}
      >
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
    </div>
  )
}

export default CardPresentation