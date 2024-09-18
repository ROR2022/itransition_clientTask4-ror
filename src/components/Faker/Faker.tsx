"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Box,
  Slider,
  TextField,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import { getFakeUsers } from "@/api/apiUser";
import TableFakeUsers from "./TableFakeUsers";
import { useMediaQuery } from "usehooks-ts";

// Define the possible regions
const REGIONS = ["Mexico", "USA", "Germany"];

interface DataFakerType {
  region: string;
  errorRate: number;
  seed: string;
  page: number;
  limit: number;
}

export interface DataFakeUser {
  id: string;
  name: string;
  address: string;
  secondaryAddress: string;
  city: string;
  phone: string;
}

export default function Faker() {
  const [region, setRegion] = useState<string>(REGIONS[0]);
  const [errorRate, setErrorRate] = useState<number>(0);
  const [errorRateText, setErrorRateText] = useState<string>("0");
  const [seed, setSeed] = useState<string>("");
  //const [randomSeed, setRandomSeed] = useState<number | null>(null);
  const [dataFakeUsers, setDataFakeUsers] = useState<DataFakeUser[]>([]);
  const [isChangingParams, setIsChangingParams] = useState<boolean>(false);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [dataFaker, setDataFaker] = useState<DataFakerType>({
    region: REGIONS[0],
    errorRate: 0,
    seed: "",
    page: 1,
    limit: 20,
  });
  const [scrollY, setScrollY] = useState(0);
  //eslint-disable-next-line
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    //console.log('currentScrollY:',currentScrollY);
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;
    if (currentScrollY + windowHeight >= fullHeight) {
      console.log("Bottom of the page");
      handleGenerateData();
    }

    if (currentScrollY > scrollY) {
      setIsScrollingDown(true);
    } else {
      setIsScrollingDown(false);
    }

    setScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", () => {
      //console.log('User is scrolling...');
      //const scrollHeight = document.documentElement.scrollHeight
      //const  innerHeight= window.innerHeight;
      //console.log('scrollHeight:',scrollHeight);
      //console.log('innerHeight:',innerHeight);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollY]);

  useEffect(() => {
    if(dataFakeUsers.length === 0){
    handleGenerateData();
    }
  }, []);

  useEffect(() => {
    setIsChangingParams(true);
  }, [seed]);

  useEffect(() => {}, [dataFaker]);

  useEffect(() => {
    setIsChangingParams(true);
  }, [errorRate]);

  useEffect(() => {
    setIsChangingParams(true);
  }, [region]);

  useEffect(() => {
    if(isChangingParams===true){
      handleGenerateData();
    }
  },[isChangingParams]);

  const handleRegionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRegion(event.target.value as string);
    setDataFaker({ ...dataFaker, region: String(event.target.value) });
    //handleGenerateData();
  };

  const handleErrorRateChange = (event: Event, newValue: number | number[]) => {
    setErrorRate(newValue as number);
    setErrorRateText(((newValue as number)).toString());
    setDataFaker({ ...dataFaker, errorRate: Number(newValue) });
    //handleGenerateData();
  };

  const handleErrorRateTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const parsedValue = Number(value);
    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 1000) {
      setErrorRate(parsedValue);
      setErrorRateText(value);
    }
    setDataFaker({ ...dataFaker, errorRate: parsedValue });
    //handleGenerateData();
  };

  const handleSeedChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSeed(event.target.value);
    setDataFaker({ ...dataFaker, seed: event.target.value });
    //setRandomSeed(Number(event.target.value));
    //handleGenerateData();
  };

  const generateRandomSeed = () => {
    const newSeed = Math.floor(Math.random() * 1000000).toString();
    setSeed(newSeed);
    //setRandomSeed(Number(newSeed));
    setDataFaker({ ...dataFaker, seed: newSeed });
    //handleGenerateData();
    return newSeed;
  };

  const handleGenerateData = async () => {
    //console.log("Generating data...");
    if (dataFaker.seed === "") {
      setDataFaker({ ...dataFaker, seed: generateRandomSeed() });
    }
    try {
      //console.log("dataFaker:", dataFaker);
      if (isChangingParams===true) {
        setDataFaker({ ...dataFaker, page: 1, limit: 20 });
        const tempDataFaker = { ...dataFaker, page: 1, limit: 20 };
        const response = await getFakeUsers(tempDataFaker);
        setDataFakeUsers([...response]);
        setIsChangingParams(false);
      }else{
      const response = await getFakeUsers(dataFaker);
      setDataFaker({ ...dataFaker, page: dataFaker.page + 1, limit: 10 });
      setDataFakeUsers([...dataFakeUsers, ...response]);
      }
      
      //console.log("response fakerData:", response);

      
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Typography
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px",
        }}
        variant="h5"
        gutterBottom
      >
        Fake Data Generator
      </Typography>
      <Box
        mx="auto"
        sx={{
          width: "100vw",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
        }}
      >
        <TextField
          select
          label="Select Region"
          value={region}
          onChange={handleRegionChange}
          margin="normal"
        >
          {REGIONS.map((region) => (
            <MenuItem key={region} value={region}>
              {region}
            </MenuItem>
          ))}
        </TextField>

        <Box
          mt={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            variant="subtitle1"
            gutterBottom
          >
            Number of Errors per Record
          </Typography>

          <Box display="flex" alignItems="center">
            <Slider
              value={errorRate}
              min={0}
              max={10}
              step={1}
              onChange={handleErrorRateChange}
              valueLabelDisplay="auto"
              aria-labelledby="error-rate-slider"
              sx={{
                flexGrow: 1,
                minWidth: "200px",
              }}
            />
            <TextField
              type="number"
              value={errorRateText}
              onChange={handleErrorRateTextChange}
              slotProps={{
                input: { inputProps: { min: 0, max: 1000 } },
              }}
              sx={{
                ml: 2,
                minWidth: "80px",
              }}
            />
          </Box>
        </Box>

        <Box display="flex" alignItems="center" flexDirection={"column"}>
          <Typography variant="subtitle1" gutterBottom>
            Seed Value
          </Typography>
          <TextField value={seed} onChange={handleSeedChange} margin="normal" />
          <Button
            variant="contained"
            color="primary"
            onClick={generateRandomSeed}
            sx={{ ml: 2 }}
          >
            Random
          </Button>
        </Box>

        <Button
          onClick={handleGenerateData}
          variant="contained"
          color="secondary"
          sx={{ mt: 2, display: "none" }}
        >
          Generate Data
        </Button>
      </Box>
      {dataFakeUsers.length > 0 && (
        <TableFakeUsers
          dataFakeUsers={dataFakeUsers}
          handleGenerateData={handleGenerateData}
        />
      )}
    </>
  );
}
