"use client";
import React, { useState } from "react";
import { createReactiveVerification, reactiveAccount } from "@/api/apiUser";
import { IconButton, Box, Button, TextField, Typography, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";



const Reactive = () => {
    const [email, setEmail] = useState("");
    const [myCode, setMyCode] = useState("");
    const [resultCreateVerification, setResultCreateVerification] = useState<any>(null);
    const [verificationId, setVerificationId] = useState("");
    const router = useRouter();
    
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (regexEmail.test(email)) {
        console.log("Valid email");
        const result = await createReactiveVerification(email);
        if (result.verification) setVerificationId(result.verification);
        setResultCreateVerification(result);
      } else {
        console.log("Invalid email");
      }
    };
  
    const handleConfim = async () => {
      //console.log("dataReactive:", resultCreateVerification);
      //const { email, verificationId, myCode, } = dataReactive;
      const dataReactive = { 
        email,
        verificationId, 
        myCode 
      };
      try {
        const result = await reactiveAccount(dataReactive);
        console.log("result confirmVerification:", result);
        setResultCreateVerification(result);
        if (result.success) {
          setTimeout(() => {
            router.push("/login");
          }, 2000);
          
        }
      } catch (error) {
        console.log(error);
        setResultCreateVerification({ success: false, message: "Error confirm" });
      }
    };
  
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" bgcolor="grey.100">
        
          <Box component="form" onSubmit={handleSubmit} sx={{ bgcolor: "white", p: 4, borderRadius: 2, boxShadow: 3, maxWidth: 400 }}>
            <Typography variant="h5" textAlign="center" gutterBottom>
              Reactive account
            </Typography>
  
            {!resultCreateVerification?.success && (
              <>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  margin="normal"
                  error={!regexEmail.test(email)}
                  helperText={regexEmail.test(email) ? "" : "Invalid email"}
                />
  
                <Box textAlign="center" mt={2}>
                  <Button variant="contained" color="primary" type="submit">
                    Send
                  </Button>
                </Box>
              </>
            )}
  
            {resultCreateVerification?.message && (
              <Alert
                severity={resultCreateVerification?.success ? "success" : "error"}
                action={
                  <IconButton color="inherit" size="small" onClick={() => setResultCreateVerification(null)}>
                    <CloseIcon />
                  </IconButton>
                }
              >
                {resultCreateVerification?.message}
              </Alert>
            )}
  
            {resultCreateVerification?.success && (
              <>
                <Typography textAlign="center" mt={3} color="primary">
                  Check your email and enter the code
                </Typography>
  
                <TextField
                  label="Code"
                  value={myCode}
                  onChange={(e) => setMyCode(e.target.value)}
                  fullWidth
                  margin="normal"
                  placeholder="Enter the code"
                />
  
                <Box textAlign="center" mt={2}>
                  <Button variant="contained" color="success" onClick={handleConfim}>
                    Confirm
                  </Button>
                </Box>
              </>
            )}
          </Box>
    
      </Box>
    );
}

export default Reactive