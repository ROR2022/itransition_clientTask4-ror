import React, {FC, useState, useEffect} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { DataSlideType } from './Slide';


interface MyTabsProps {
    dataPresentation: Array<DataSlideType>;
    slideActive: DataSlideType;
    setSlideActive: React.Dispatch<React.SetStateAction<DataSlideType>>;
}

const MyTabs:FC<MyTabsProps> = ({dataPresentation,setSlideActive,slideActive}) => {
    const [value, setValue] = useState(dataPresentation.findIndex((slide) => slide.id === slideActive.id));
    const [slidesTabs, setSlidesTabs] = useState<Array<string>>(dataPresentation.map((slide) => slide.title));
    console.log('Mytabs slidesTabs:',slidesTabs)

    useEffect(() => {
        setSlidesTabs(dataPresentation.map((slide) => slide.title));
    }, [dataPresentation]);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
      console.log('Mytabs NewValue:',newValue)
      setSlideActive(dataPresentation[newValue]);
    };
  
    return (
      <Box sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: 'background.paper' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Item One" />
          <Tab label="Item Two" />
          <Tab label="Item Three" />
          <Tab label="Item Four" />
          <Tab label="Item Five" />
          <Tab label="Item Six" />
          <Tab label="Item Seven" />
        </Tabs>
      </Box>
    );
}

export default MyTabs