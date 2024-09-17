import React, { useState } from "react";
import { Typography, Button, TextField, Slider, Box } from "@mui/material";
import Draggable from "react-draggable";

interface TextBlock {
  id: number;
  text: string;
  fontSize: number;
  color: string;
  x: number;
  y: number;
}

const Slide = () => {
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);

  const addTextBlock = () => {
    const newTextBlock: TextBlock = {
      id: Date.now(),
      text: "Nuevo Texto",
      fontSize: 16,
      color: "#000",
      x: 0,
      y: 0,
    };
    setTextBlocks([...textBlocks, newTextBlock]);
  };

  const updateTextBlock = (id: number, updatedData: Partial<TextBlock>) => {
    //console.log('updateTextBlock: ', id, updatedData);
    setTextBlocks(
      textBlocks.map((block) =>
        block.id === id ? { ...block, ...updatedData } : block
      )
    );
  };

  return (
    <div
      style={{
        position: "relative",
        height: "500px",
        border: "1px solid #ccc",
      }}
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
          onClick={addTextBlock}
          sx={{ height: "40px", width: "200px" }}
        >
          + Text
        </Button>
        {selectedBlock !== null && (
          <>
            <h3 style={{ display: "none" }}>Editar Texto</h3>
            {/* <TextField
            label="Texto"
            value={textBlocks.find(block => block.id === selectedBlock)?.text || ''}
            onChange={(e) => updateTextBlock(selectedBlock, { text: e.target.value })}
            sx={{ maxWidth: '200px' }}
          /> */}
          <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
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
                updateTextBlock(selectedBlock, { fontSize: newValue as number })
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
        >
          <div
            onClick={() => setSelectedBlock(block.id)}
            style={{
              position: "absolute",
              cursor: "move",
              color: block.color,
              fontSize: block.fontSize,
            }}
          >
            <input
              type="text"
              value={block.text}
              onChange={(e) =>
                updateTextBlock(block.id, { text: e.target.value })
              }
              style={{
                border: selectedBlock === block.id ? "1px solid #000" : "none",
                padding: "5px",
                borderRadius: "5px",
                fontSize: block.fontSize,
                color: block.color,
                fontPalette: block.color,
              }}
            />

            {/* <Typography
            sx={{ 
                border: selectedBlock === block.id ? '1px solid #000' : 'none',
                padding: '5px',
                borderRadius: '5px',
                fontSize: block.fontSize,
            }}
            >
                {block.text}
            </Typography> */}
          </div>
        </Draggable>
      ))}
    </div>
  );
};

export default Slide;
