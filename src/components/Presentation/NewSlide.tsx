import React, {FC, useState} from 'react'
import { IPresentation } from './Presentation';
import { DataSlideType } from './Slide';
import { Box, Button, TextField } from '@mui/material';
import { createSlide, addSlidePresentation } from '@/api/apiPresentation';

interface NewSlideProps {
    presentationActive: IPresentation;
    setSlideActive: (slideActive: DataSlideType) => void;
    dataPresentation: DataSlideType[];
    setDataPresentation: (data: DataSlideType[]) => void;
    setReloadDataPresentation: (reloadDataPresentation: string|null) => void;
    }

const NewSlide:FC<NewSlideProps> = ({presentationActive,setSlideActive,dataPresentation,setDataPresentation, setReloadDataPresentation}) => {
    const [titleNewSlide, setTitleNewSlide] = useState('');
    const [descriptionNewSlide, setDescriptionNewSlide] = useState('');

    const handleCreateSlide = async() => {
        try {
            const dataSlide = {
                title: titleNewSlide,
                description: descriptionNewSlide,
                presentationId: presentationActive._id
            }
            const response = await createSlide(dataSlide);
            console.log('response createSlide:', response);
            //actualizar la presentcion para que incluya el nuevo slide
            if(response._id){
            const responsePresentation = await addSlidePresentation(presentationActive._id, response._id);
            console.log('responseAddSlidePresentation:', responsePresentation);
            setReloadDataPresentation(presentationActive?._id||null);
            }
            setTitleNewSlide('');
            setDescriptionNewSlide('');
            setSlideActive(response);
            setDataPresentation([...dataPresentation, response]);
        }
        catch (error) {
            console.error(error);
        }

    }
  return (
    <div>
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            padding: '5px'
        }}
        >
        <TextField
        id="outlined-basic"
        label="Title"
        variant="outlined"
        value={titleNewSlide}
        onChange={(e) => setTitleNewSlide(e.target.value)}
        />
        <TextField
        id="outlined-basic"
        label="Description"
        variant="outlined"
        value={descriptionNewSlide}
        onChange={(e) => setDescriptionNewSlide(e.target.value)}
        />
        <Button
        variant="contained"
        color="success"
        onClick={handleCreateSlide}
        disabled=
        {titleNewSlide === '' || descriptionNewSlide === ''}
        >
            New Slide
        </Button>
        </Box>
    </div>
  )
}

export default NewSlide