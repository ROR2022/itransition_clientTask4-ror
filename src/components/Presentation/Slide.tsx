"use client";
import React, { useState, useRef, FC, useEffect } from "react";
import { Button } from "@mui/material";
import Draggable from "react-draggable";
import TextControls from "./TextControls";
import Participants, { ParticipantType } from "./Participants";
import {
  createTextblock,
  addTextblockToSlide,
  updateTextblock,
} from "@/api/apiPresentation";
import { IPresentation } from "./Presentation";

export interface TextBlock {
  _id?: string;
  text: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  fontStyle: string;
  backgoundColor: string;
  textAlign: string;
  x: number;
  y: number;
  slideId?: string;
}

export interface DataSlideType {
  _id: string;
  title: string;
  description: string;
  textblocks: TextBlock[];
  presentationId: string;
}

interface SlideProps {
  dataSlide: DataSlideType;
  setDataPresentation: (data: DataSlideType[]) => void;
  dataPresentation: DataSlideType[];
  presentationActive: IPresentation | null;
  nickNameUser: string;
  myParticipants: ParticipantType[];
  setIsUpdatingParticipant: (isUpdating: ParticipantType | null) => void;
  isEditor: boolean;
  setReloadDataSlide: (reloadDataSlide: string) => void;
  isAuthor: boolean;
}

const Slide: FC<SlideProps> = ({
  dataSlide,
  setDataPresentation,
  dataPresentation,
  presentationActive,
  nickNameUser,
  myParticipants,
  setIsUpdatingParticipant,
  isEditor,
  setReloadDataSlide,
  isAuthor,
}) => {
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([
    ...(dataSlide.textblocks || []),
  ]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [isViewer, setIsViewer] = useState(
    !isEditor && !isAuthor ? true : false
  );
  //const [isEditor, setIsEditor] = useState(false);
  //const [isUpdating, setIsUpdating] = useState(false);
  const myContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isEditor && !isAuthor) {
      setIsViewer(true);
    }else{
      setIsViewer(false);
    }
  }, [isEditor]);

  useEffect(() => {
  }, [isViewer]);

  useEffect(() => {
  }, [isAuthor]);

  useEffect(() => {
    console.log("myParticipants:", myParticipants);
  }, [myParticipants]);

  useEffect(() => {
    setTextBlocks([...(dataSlide.textblocks || [])]);
    //setSelectedBlock(null);
  }, [dataSlide]);

  useEffect(() => {
    console.log("Actualizando dataPresentation:");
    if (selectedBlock !== null) {
      const myTextBlock = textBlocks.find(
        (block) => block._id === selectedBlock
      );
      if (myTextBlock) {
        
          updateDataSlide(myTextBlock._id||"");
        
      }
    }
  }, [dataPresentation]);

  const updateDataSlide = async (myBlockId: string) => {
    //if (isUpdating) return;
    try {
      const myBlock:TextBlock | undefined = textBlocks.find((block) => block._id === myBlockId);
      if (!myBlock) return;
      const { _id, ...dataBlock } = myBlock;
      //setIsUpdating(true);
      const res = await updateTextblock(_id, dataBlock);
      console.log("res updateTextBlock: ", res);
      //const res2 = await getDataSlide();
      //console.log("res2 getDataSlide: ", res2);
      //setIsUpdating(false);
      setReloadDataSlide(dataSlide._id);
    } catch (error) {
      console.log(error);
    }
  };

  //_id: String(Date.now()),
  const addTextBlock = async () => {
    const newTextBlock: TextBlock = {
      text: "New Text",
      fontSize: 16,
      color: "#000000",
      fontFamily: "Arial",
      fontStyle: "normal",
      backgoundColor: "#ffffff",
      textAlign: "center",
      x: 0,
      y: 0,
      slideId: dataSlide._id,
    };
    try {
      const res = await createTextblock(newTextBlock);
      console.log("res createTextBlock: ", res);
      if (res._id && dataSlide._id) {
        newTextBlock._id = res._id;
        const res2 = await addTextblockToSlide(dataSlide._id, res._id);
        console.log("res2 addTextblockToSlide: ", res2);
      }
    } catch (err) {
      console.log(err);
    }
    setTextBlocks([...textBlocks, newTextBlock]);
  };

  const updateTextBlock = (id: string, updatedData: Partial<TextBlock>) => {
    setTextBlocks(
      textBlocks.map((block) =>
        block._id === id ? { ...block, ...updatedData } : block
      )
    );

    const newDataSlide = {
      ...dataSlide,
      textBlocks: textBlocks.map((block) =>
        block._id === id ? { ...block, ...updatedData } : block
      ),
    };
    const newDataPresentation = [...dataPresentation];
    const index = newDataPresentation.findIndex(
      (slide) => slide._id === dataSlide._id
    );
    newDataPresentation[index] = newDataSlide;
    setDataPresentation([...newDataPresentation]);
  };

  //rows={Math.min(10, Math.ceil(block.text.split("\n").length + 1))}

  return (
    <>
      {(isEditor || isAuthor) && (
        <Button
          variant="contained"
          color="success"
          onClick={addTextBlock}
          sx={{ height: "40px", width: "100px", marginTop: "10px", marginBottom: "10px" }}
        >
          + Text
        </Button>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        {selectedBlock !== null && (isEditor || isAuthor) && (
          <TextControls
            selectedBlock={selectedBlock}
            textBlocks={textBlocks}
            updateTextBlock={updateTextBlock}
          />
        )}

        <div
          style={{
            position: "relative",
            height: "1000px",
            width: "100vw",
            border: "1px solid #ccc",
            overflow: "auto",
            marginBottom: "150px",
          }}
          ref={myContainer}
        >
          {textBlocks.map((block) => (
            <Draggable
              key={block._id}
              position={{ x: block.x, y: block.y }}
              onStop={(_, data) =>
                updateTextBlock(block._id || "", { x: data.x, y: data.y })
              }
              bounds="parent"
            >
              <div
                onClick={() => setSelectedBlock(block._id || null)}
                style={{
                  position: "absolute",
                  cursor: "move",
                  padding: "5px",
                  margin: "5px",
                }}
              >
                <textarea
                  disabled={isViewer}
                  id={block._id || ""}
                  value={block.text}
                  onChange={(e) => {
                    updateTextBlock(block._id || "", { text: e.target.value });
                    setSelectedBlock(block._id || null);
                  }}
                  style={{
                    border:
                      selectedBlock === block._id ? "1px solid #000" : "none",
                    margin: "5px",
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    paddingLeft: "5px",
                    paddingRight: "5px",
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
        <Participants
          myParticipants={myParticipants}
          presentationActive={presentationActive}
          nickNameUser={nickNameUser}
          setIsUpdatingParticipant={setIsUpdatingParticipant}
        />
      </div>
    </>
  );
};

export default Slide;
