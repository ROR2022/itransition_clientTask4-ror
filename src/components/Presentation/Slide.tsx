import React, { useState, useRef, FC } from "react";
import {
  Typography,
  Button,
  TextField,
  Slider,
  Box,
  MenuItem,
} from "@mui/material";
import Draggable from "react-draggable";


export interface TextBlock {
  id: string;
  text: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  fontStyle: string;
  backgoundColor: string;
  textAlign: string;
  x: number;
  y: number;
}

const myfonts = [
  {
    value: "Arial",
    label: "Arial",
  },
  {
    value: "Verdana",
    label: "Verdana",
  },
  {
    value: "Courier New",
    label: "Courier New",
  },
  {
    value: "Georgia",
    label: "Georgia",
  },
  {
    value: "Palatino Linotype",
    label: "Palatino Linotype",
  },
  {
    value: "Times New Roman",
    label: "Times New Roman",
  },
];

const myStyles = [
  {
    value: "normal",
    label: "Normal",
  },
  {
    value: "italic",
    label: "Italic",
  },
  {
    value: "oblique",
    label: "Oblique",
  },
];

const myAligns = [
  {
    value: "left",
    label: "Left",
  },
  {
    value: "center",
    label: "Center",
  },
  {
    value: "right",
    label: "Right",
  },
];

export interface DataSlideType {
  id: string;
  title: string;
  description: string;
  textBlocks: TextBlock[];
}

interface SlideProps {
  dataSlide: DataSlideType;
  setDataPresentation: (data:DataSlideType[]) => void;
  dataPresentation: DataSlideType[];
}

const Slide:FC<SlideProps> = ({dataSlide, setDataPresentation, dataPresentation}) => {
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([...dataSlide.textBlocks]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const myContainer = useRef<HTMLDivElement>(null);
  

  const addTextBlock = () => {
    const newTextBlock: TextBlock = {
      id: Date.now(),
      text: "Nuevo Texto",
      fontSize: 16,
      color: "#000000",
      fontFamily: "Arial",
      fontStyle: "normal",
      backgoundColor: "#ffffff",
      textAlign: "center",
      x: 0,
      y: 0,
    };
    setTextBlocks([...textBlocks, newTextBlock]);
  };

  const updateTextBlock = (id: string, updatedData: Partial<TextBlock>) => {
    //console.log('updateTextBlock: ', id, updatedData);
    
    const widthContainer = myContainer.current?.offsetWidth || 0;
    const heightContainer = myContainer.current?.offsetHeight || 0;
    
    const maxPosibleWidth = widthContainer*.7;
    if(updatedData.x !== undefined){
      if(updatedData.x < 0){
        updatedData.x = 0;
      }else if(updatedData.x > maxPosibleWidth){
        updatedData.x = maxPosibleWidth;
      }
    }
    const maxPosibleHeight = heightContainer*.7;
    if(updatedData.y !== undefined){
      if(updatedData.y < 0){
        updatedData.y = 0;
      }else if(updatedData.y > maxPosibleHeight){
        updatedData.y = maxPosibleHeight;
      }
    }
  
    setTextBlocks(
      textBlocks.map((block) =>
        block.id === id ? { ...block, ...updatedData } : block
      )
    );

    const newDataSlide = {
      ...dataSlide,
      textBlocks: textBlocks.map((block) =>
        block.id === id ? { ...block, ...updatedData } : block
      )
    };
    const newDataPresentation = [...dataPresentation];
    const index = newDataPresentation.findIndex((slide) => slide.id === dataSlide.id);
    newDataPresentation[index] = newDataSlide;
    setDataPresentation([...newDataPresentation]);
  };

  return (
    <div
      style={{
        position: "relative",
        height: "500px",
        border: "1px solid #ccc",
      }}
      ref={myContainer}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Button
          variant="contained"
          color="success"
          onClick={addTextBlock}
          sx={{ height: "40px", width: "100px" }}
        >
          + Text
        </Button>
        {selectedBlock !== null && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography id="font-size-slider" gutterBottom>
                Font Size
              </Typography>
              <Slider
                value={
                  textBlocks.find((block) => block.id === selectedBlock)
                    ?.fontSize || 16
                }
                onChange={(_, newValue) =>
                  updateTextBlock(selectedBlock, {
                    fontSize: newValue as number,
                  })
                }
                aria-labelledby="font-size-slider"
                min={10}
                max={100}
                step={1}
                sx={{ width: "200px" }}
              />
            </div>
            <TextField
              label="Color"
              type="color"
              value={
                textBlocks.find((block) => block.id === selectedBlock)?.color ||
                "#000000"
              }
              onChange={(e) =>
                updateTextBlock(selectedBlock, { color: e.target.value })
              }
              sx={{ width: "200px" }}
            />

            <TextField
              label="Background Color"
              type="color"
              value={
                textBlocks.find((block) => block.id === selectedBlock)
                  ?.backgoundColor || "#ffffff"
              }
              onChange={(e) =>
                updateTextBlock(selectedBlock, {
                  backgoundColor: e.target.value,
                })
              }
              sx={{ width: "200px" }}
            />

            <TextField
              id="outlined-select-currency"
              select
              label="Font Family"
              sx={{ width: "100px" }}
              value={
                textBlocks.find((block) => block.id === selectedBlock)
                  ?.fontFamily || "Arial"
              }
              onChange={(e) =>
                updateTextBlock(selectedBlock, { fontFamily: e.target.value })
              }
            >
              {myfonts.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="outlined-select-currency"
              select
              label="Font Style"
              sx={{ width: "100px" }}
              value={
                textBlocks.find((block) => block.id === selectedBlock)
                  ?.fontStyle || "normal"
              }
              onChange={(e) =>
                updateTextBlock(selectedBlock, { fontStyle: e.target.value })
              }
            >
              {myStyles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="outlined-select-currency"
              select
              label="Text Align"
              sx={{ width: "100px" }}
              value={
                textBlocks.find((block) => block.id === selectedBlock)
                  ?.textAlign || "center"
              }
              onChange={(e) =>
                updateTextBlock(selectedBlock, { textAlign: e.target.value })
              }
            >
              {myAligns.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

          </>
        )}
      </Box>
      {textBlocks.map((block) => (
        <Draggable
          key={block.id}
          position={{ x: block.x, y: block.y }}
          onStop={(_, data) =>
            updateTextBlock(block.id, { x: data.x, y: data.y })
          }
          bounds="parent"
        >
          <div
            onClick={() => setSelectedBlock(block.id)}
            style={{
              position: "absolute",
              cursor: "move",
              color: block.color,
              fontSize: block.fontSize,
              fontFamily: block.fontFamily,
              fontStyle: block.fontStyle,
              backgroundColor: block.backgoundColor,
            }}
          >
            <textarea
              id={block.id.toString()}
              value={block.text}
              onChange={(e) =>
                updateTextBlock(block.id, { text: e.target.value })
              }
              rows={Math.min(10, Math.ceil(block.text.split("\n").length + 1))} 
              style={{
                border: selectedBlock === block.id ? "1px solid #000" : "none",
                paddingTop: "5px",
                paddingBottom: "5px",
                paddingLeft: "0px",
                paddingRight: "0px",
                textAlign: block.textAlign as "left" | "center" | "right",
                width: "auto",
                maxWidth: "80vw",
                height: "auto",
                maxHeight: "30vh",
                resize: "none", 
                borderRadius: "5px",
                fontSize: block.fontSize,
                color: block.color,
                fontFamily: block.fontFamily,
                fontStyle: block.fontStyle,
                backgroundColor: block.backgoundColor,

                overflowY: "auto", 
              }}
            />

            
          </div>
        </Draggable>
      ))}
    </div>
  );
};

export default Slide;
