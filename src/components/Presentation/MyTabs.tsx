import React, {FC} from 'react';
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
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
      console.log('Mytabs NewValue:',newValue)
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