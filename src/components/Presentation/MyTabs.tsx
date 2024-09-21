import React, {FC, useState, useEffect} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { DataSlideType } from './Slide';


interface MyTabsProps {
    dataPresentation: Array<DataSlideType>;
    slideActive: DataSlideType;
    setSlideActive: (slide: DataSlideType) => void;
}

const MyTabs:FC<MyTabsProps> = ({dataPresentation,setSlideActive,slideActive}) => {
    const [value, setValue] = useState(dataPresentation.findIndex((slide:DataSlideType) => slide._id === slideActive._id));
    const [slidesTabs, setSlidesTabs] = useState<Array<string>>(dataPresentation.map((slide) => slide.title));
    //console.log('Mytabs slidesTabs:',slidesTabs)

    useEffect(() => {
        setSlidesTabs(dataPresentation.map((slide) => slide.title));
    }, [dataPresentation]);

    useEffect(() => {
        setValue(dataPresentation.findIndex((slide:DataSlideType) => slide._id === slideActive._id));
    }, [slideActive]);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
      //console.log('Mytabs NewValue:',newValue)
      setSlideActive(dataPresentation[newValue]);
    };
  
    return (
      <Box 
      
      sx={{ 
        maxWidth: { xs: 320, sm: 480 }, 
        color: 'text.primary',
        bgcolor: 'background.paper',
        border: '1px solid #000',
        borderRadius: '5px',
        marginTop: '10px',
        backgroundColor: '#f5f5f5',
        }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {slidesTabs.map((slide) => (
            <Tab key={slide} label={slide} />
          ))}
          
        </Tabs>
      </Box>
    );
}

export default MyTabs