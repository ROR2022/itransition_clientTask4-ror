"use client";
import React, { useState, useEffect } from "react";
import Slide from "./Slide";
import { DataSlideType } from "./Slide";
import MyTabs from "./MyTabs";

const dataPresentationTmp = [
  {
    id: "Slide1",
    title: "Slide 1",
    description: "Description 1",
    textBlocks: [
      {
        id: "Text1",
        text: "Hello World",
        fontSize: 16,
        color: "#000000",
        fontFamily: "Arial",
        fontStyle: "normal",
        backgoundColor: "#ffffff",
        textAlign: "center",
        x: 0,
        y: 0,
      },
    ],
  },
  {
    id: "Slide2",
    title: "Slide 2",
    description: "Description 2",
    textBlocks: [
      {
        id: "Text2",
        text: "Hello World 2",
        fontSize: 16,
        color: "#000000",
        fontFamily: "Arial",
        fontStyle: "normal",
        backgoundColor: "#ffffff",
        textAlign: "center",
        x: 0,
        y: 0,
      },
    ],
  },
  
];

const Presentation = () => {
  const [dataPresentation, setDataPresentation] =
    useState<Array<DataSlideType>>(dataPresentationTmp);
    const [slideActive, setSlideActive] = useState<DataSlideType>(dataPresentation[0]);
  return (
    <div>
      <MyTabs dataPresentation={dataPresentation} slideActive={slideActive} setSlideActive={setSlideActive}/>
      {slideActive && <Slide dataSlide={slideActive} setDataPresentation={setDataPresentation} dataPresentation={dataPresentation} />}
    </div>
  );
};

export default Presentation;
