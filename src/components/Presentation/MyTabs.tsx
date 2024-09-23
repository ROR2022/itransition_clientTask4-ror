import React, { FC, useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { DataSlideType } from "./Slide";
import { getSlideById } from "@/api/apiPresentation";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import EditIcon from "@mui/icons-material/Edit";
import ModalTabs from "./ModalTabs";
import { IPresentation } from "./Presentation";

interface MyTabsProps {
  dataPresentation: Array<DataSlideType>;
  slideActive: DataSlideType;
  setSlideActive: (slide: DataSlideType | null) => void;
  isAuthor: boolean;
  setPresentationActive: (presentation: IPresentation) => void;
  setReloadDataPresentation: (reloadDataPresentation: string | null) => void;
}

export  interface DataModalType {
  action: string;
  slide: DataSlideType;
}

const MyTabs: FC<MyTabsProps> = ({
  dataPresentation,
  setSlideActive,
  slideActive,
  isAuthor,
  setPresentationActive,
  setReloadDataPresentation,
}) => {
  const [value, setValue] = useState(
    dataPresentation.findIndex(
      (slide: DataSlideType) => slide._id === slideActive._id
    )
  );
  const [slidesTabs, setSlidesTabs] = useState<Array<string>>(
    dataPresentation.map((slide) => slide.title)
  );
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [dataModal, setDataModal] = useState<DataModalType | null>(null);

  //console.log('Mytabs slidesTabs:',slidesTabs)

  useEffect(() => {
    setSlidesTabs(dataPresentation.map((slide) => slide.title));
  }, [dataPresentation]);

  useEffect(() => {
    const findIndexSlide=dataPresentation.findIndex(
      (slide: DataSlideType) => slide._id === slideActive._id
    )
    if(findIndexSlide!==-1){
      setValue(findIndexSlide);
    }else{
      setValue(0);
    }
    
  }, [slideActive]);

  useEffect(() => {
    const findSlideTab = slidesTabs[value];
    if(!findSlideTab){
      setValue(0);
    }
  }, [value]);

  useEffect(() => {
    const findSlideTab = slidesTabs[value];
    if(!findSlideTab){
      setValue(0);
    }
  },[slidesTabs]);

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setValue(newValue);

    console.log('Mytabs NewValue:',newValue)
    //setSlideActive(dataPresentation[newValue]);
    await fetchDataSlide(dataPresentation[newValue]._id);
  };

  const fetchDataSlide = async (id: string) => {
    try {
      const response = await getSlideById(id);
      setSlideActive(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeTitleSlide = () => {
    console.log("Changing Title Slide:", dataPresentation[value]);
    setIsOpenModal(true);
    setDataModal({ action: "edit", slide: dataPresentation[value] });
  };

  const handleDeleteSlide = () => {
    console.log("Deleting Slide:", dataPresentation[value]);
    setIsOpenModal(true);
    setDataModal({ action: "delete", slide: dataPresentation[value] });
  };

  return (
    <Box
      sx={{
        maxWidth: { xs: 320, sm: 480 },
        color: "text.primary",
        bgcolor: "background.paper",
        border: "1px solid #000",
        borderRadius: "5px",
        marginTop: "10px",
        backgroundColor: "#f5f5f5",
      }}
    >
      {isOpenModal && 
      <ModalTabs
      setSlideActive={setSlideActive}
      setReloadDataPresentation={setReloadDataPresentation}
      setPresentationActive={setPresentationActive} 
        dataModal={dataModal} 
      isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />}
{isAuthor&& slideActive && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  paddingTop: "5px",
                }}
              >
                <HighlightOffIcon
                  onClick={handleDeleteSlide}
                  style={{
                    color: "red",
                    fontSize: "14px", 
                    cursor: "pointer" }}
                />
                <EditIcon
                  onClick={handleChangeTitleSlide}
                  style={{
                    color: "blue",
                    fontSize: "14px", 
                    cursor: "pointer" }}
                />
              </div>
            )}
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        {slidesTabs.map((slide) => (
            <Tab key={slide}  label={slide} />          
        ))}
      </Tabs>
    </Box>
  );
};

export default MyTabs;
