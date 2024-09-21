import React,{ useEffect, useState,FC } from "react"
import { getPresentations, createPresentation} from "@/api/apiPresentation"
import { Box, Button, FormControl, FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import TablePresentations from "./TablePresentations";
import { IPresentation } from "./Presentation";
import CardsPresentations from "./CardsPresentations";
//import { DataSlideType } from "./Slide";


interface PresentationsType {
    setPresentationActive: (data: IPresentation) => void;
    nickNameUser: string;
}



const Presentations:FC<PresentationsType> = ({nickNameUser, setPresentationActive}) => {
    const [allPresentations, setAllPresentations] = useState([]);
    const [titleNewPresentation, setTitleNewPresentation] = useState('');
    const [descriptionNewPresentation, setDescriptionNewPresentation] = useState('');
    const [viewType, setViewType] = useState<string>('table');

    useEffect(() => {
        fetchPresentations();
    }, []);

    const fetchPresentations = async () => {
        try {
            const response = await getPresentations();
            console.log('response getPresentations:', response);
            setAllPresentations(response);
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleCreatePresentation = async () => {
        try {
            const dataPresentation = {
                title: titleNewPresentation,
                description: descriptionNewPresentation,
                author: nickNameUser+String(Date.now()),
                nickname: nickNameUser
            }
            const response = await createPresentation(dataPresentation);
            console.log('response createPresentation:', response);
            //setAllPresentations(response.data);
            setTitleNewPresentation('');
            setDescriptionNewPresentation('');
            //reload presentations
            fetchPresentations();
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
        value={titleNewPresentation}
        onChange={(e) => setTitleNewPresentation(e.target.value)}
        />
        <TextField
        id="outlined-basic"
        label="Description"
        variant="outlined"
        value={descriptionNewPresentation}
        onChange={(e) => setDescriptionNewPresentation(e.target.value)}
        />
        <Button
        variant="contained"
        color="success"
        onClick={handleCreatePresentation}
        disabled=
        {titleNewPresentation === '' || descriptionNewPresentation === ''}
        >
            New Presentation
        </Button>
        </Box>
        <FormControl>
      
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="table"
        name="radio-buttons-group"
        value={viewType}
        onChange={(event) => setViewType(event.target.value)}
        sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "10px",
        }}
      >
        
        <FormControlLabel value="table" control={<Radio />} label="Table" />
        <FormControlLabel value="cards" control={<Radio />} label="Cards" />
      </RadioGroup>
    </FormControl>
        {allPresentations.length > 0 && (

            viewType === 'table' ? (
            <TablePresentations
            nickNameUser={nickNameUser}
            dataPresentations={allPresentations}
            setPresentationActive={setPresentationActive}
            />
            ):(
                <CardsPresentations
                nickNameUser={nickNameUser}
                dataPresentations={allPresentations}
                setPresentationActive={setPresentationActive}
                />
            )
            
        )}
    </div>
  )
}

export default Presentations