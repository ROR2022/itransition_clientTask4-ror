"use client";
import React, { useState, FC,useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { phoneUser } from "@/dataEnv/dataEnv";

const Contact: FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorForm, setErrorForm] = useState("");

  useEffect(() => {
    if (errorForm) {
      setTimeout(() => {
        setErrorForm("");
      }, 2000);
    }
  }, [errorForm]);

  const handleSubmit = () => {
    if (!name || !email || !message) {
      setErrorForm("Please fill all fields");
      return;
    }
    setErrorForm("");
    const phoneNumber = phoneUser; //
    const whatsappMessage = `Hi, I am ${name}. My email is ${email}. ${message}`;

    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 4,
          p: 3,
          bgcolor: "secondary.dark",
          borderRadius: 1,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Contact Me
        </Typography>
        <form noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="Message"
                variant="outlined"
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </Grid>
            <Grid size={{xs:12}}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
              >
                Send
              </Button>
              {errorForm && (
                <Typography 
                sx={{mt:2, textAlign:'center'}}
                variant="body2" color="error">
                  {errorForm}
                </Typography>
              )}
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default Contact;
