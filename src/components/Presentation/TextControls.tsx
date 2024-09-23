import React, { FC, SyntheticEvent, useState, useEffect } from "react";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FontDownloadIcon from "@mui/icons-material/FontDownload";
import { TextBlock } from "./Slide";
import { IconButton, MenuItem, Slider, TextField } from "@mui/material";

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

interface TextControlsProps {
  selectedBlock: string | null;
  setSelectBlock: (id: string | null) => void;
  textBlocks: TextBlock[];
  updateTextBlock: (id: string, updatedData: Partial<TextBlock>) => void;
}

const TextControls: FC<TextControlsProps> = ({
  selectedBlock,
  setSelectBlock,
  textBlocks,
  updateTextBlock,
}) => {
  const [controlActive, setControlActive] = useState<string>("");

  useEffect(() => {
    const block = textBlocks.find((block) => block._id === selectedBlock);
    if (!block) {
      setControlActive("");
      setSelectBlock(null);
    }
      
    
  }, [textBlocks]);

  const handleControlActive = (e: SyntheticEvent) => {
    const name = e.currentTarget.getAttribute("id");
    if (controlActive === name) {
      setControlActive("");
    } else {
      setControlActive(name || "");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "initial",
        marginBottom: "10px",
        
        gap: "10px",
      }}
    >
      <IconButton
        id="size"
        style={{ cursor: "pointer" }}
        onClick={handleControlActive}
        disabled={selectedBlock === null}
      >
        <FormatSizeIcon />
      </IconButton>
      {controlActive === "size" && selectedBlock!==null && (
        <>
          <Slider
          disabled={selectedBlock === null}
            value={
              textBlocks.find((block) => block._id === selectedBlock)
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
            sx={{ width: "100px" }}
          />
        </>
      )}

      <IconButton
        id="color"
        style={{ cursor: "pointer" }}
        onClick={handleControlActive}
        disabled={selectedBlock === null}
      >
        <FormatColorTextIcon />
      </IconButton>
      {controlActive === "color" && selectedBlock !== null && (
        <TextField
          label="Color"
          type="color"
          value={
            textBlocks.find((block) => block._id === selectedBlock)?.color ||
            "#000000"
          }
          onChange={(e) =>
            updateTextBlock(selectedBlock, { color: e.target.value })
          }
          sx={{ width: "100px" }}
        />
      )}

      <IconButton
        id="background"
        style={{ cursor: "pointer" }}
        onClick={handleControlActive}
        disabled={selectedBlock === null}
      >
        <FormatColorFillIcon />
      </IconButton>
      {controlActive === "background" && selectedBlock !== null && (
        <TextField
          label="Background Color"
          type="color"
          value={
            textBlocks.find((block) => block._id === selectedBlock)
              ?.backgoundColor || "#ffffff"
          }
          onChange={(e) =>
            updateTextBlock(selectedBlock, {
              backgoundColor: e.target.value,
            })
          }
          sx={{ width: "100px" }}
        />
      )}

      <IconButton
        id="font"
        style={{ cursor: "pointer" }}
        onClick={handleControlActive}
        disabled={selectedBlock === null}
      >
        <FontDownloadIcon />
      </IconButton>
      {controlActive === "font" && selectedBlock !== null && (
        <TextField
          id="outlined-select-currency"
          select
          label="Font Family"
          sx={{ width: "100px" }}
          value={
            textBlocks.find((block) => block._id === selectedBlock)
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
      )}

      <IconButton
        id="style"
        style={{ cursor: "pointer" }}
        onClick={handleControlActive}
        disabled={selectedBlock === null}
      >
        <FormatItalicIcon />
      </IconButton>
      {controlActive === "style" && selectedBlock !== null && (
        <TextField
          id="outlined-select-currency"
          select
          label="Font Style"
          sx={{ width: "100px" }}
          value={
            textBlocks.find((block) => block._id === selectedBlock)?.fontStyle ||
            "normal"
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
      )}

      <IconButton
        id="align"
        style={{ cursor: "pointer" }}
        onClick={handleControlActive}
        disabled={selectedBlock === null}
      >
        <FormatAlignCenterIcon />
      </IconButton>
      {controlActive === "align" && selectedBlock !== null && (
        <TextField
          id="outlined-select-currency"
          select
          label="Text Align"
          sx={{ width: "100px" }}
          value={
            textBlocks.find((block) => block._id === selectedBlock)?.textAlign ||
            "center"
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
      )}
    </div>
  );
};

export default TextControls;
