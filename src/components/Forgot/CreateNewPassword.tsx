import React, { useState, useEffect, FC } from "react";
import { updatedPassword } from "@/api/apiUser";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataResultVerification } from "./Forgot";

interface CreateNewPasswordProps {
  dataRecovery: { 
    email: string,
     myCode: string, 
     verificationId: string 
    };
}

const CreateNewPassword: FC<CreateNewPasswordProps> = ({ dataRecovery }) => {
  const [dataNewPassword, setDataNewPassword] = useState({
    password: "",
    confirmPassword: "",
    isValidPassword: false,
  });
  const [resultCreateVerification, setResultCreateVerification] = useState<DataResultVerification|null>(null);
  const router = useRouter();

  useEffect(() => {
    if (dataNewPassword.password.length > 0) {
      const isValid = validatePassword(dataNewPassword.password);
      setDataNewPassword({ ...dataNewPassword, isValidPassword: isValid });
    }
  }, [dataNewPassword.password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const tempDataRecovery = {
      ...dataRecovery,
      password: dataNewPassword.password,
    };
    try {
      console.log("tempDataRecovery:", tempDataRecovery);
      const result = await updatedPassword(tempDataRecovery);
      console.log("result updatedPassword:", result);
      setResultCreateVerification(result);
      if (result.success) {
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setResultCreateVerification({ success: false, message: "Error updating password" });
    }
  };

  const validatePassword = (password: string) => {
    // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
    //const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    //return regexPassword.test(password);
    return password.length >= 1;
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ bgcolor: "white", p: 4, borderRadius: 2, boxShadow: 3, maxWidth: 400, mx: "auto", mt: 4 }}
    >
      <Typography variant="h5" textAlign="center" gutterBottom>
        Update password
      </Typography>

      <TextField
        label="New password"
        type="password"
        value={dataNewPassword.password}
        onChange={(e) => setDataNewPassword({ ...dataNewPassword, password: e.target.value })}
        fullWidth
        margin="normal"
        placeholder="password"
      />

      <TextField
        label="Confirm password"
        type="password"
        value={dataNewPassword.confirmPassword}
        onChange={(e) => setDataNewPassword({ ...dataNewPassword, confirmPassword: e.target.value })}
        fullWidth
        margin="normal"
        placeholder="confirm password"
      />

      {!dataNewPassword.isValidPassword && dataNewPassword.password.length > 0 && (
        <Typography color="error" variant="body2">
          Password must be at least 1 character
        </Typography>
      )}

      {dataNewPassword.password !== dataNewPassword.confirmPassword && dataNewPassword.isValidPassword && (
        <Typography color="error" variant="body2">
          Passwords must match
        </Typography>
      )}

      <Box textAlign="center" mt={3}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!(dataNewPassword.password === dataNewPassword.confirmPassword && dataNewPassword.isValidPassword)}
        >
          Update password
        </Button>
      </Box>

      {resultCreateVerification?.message && (
        <Alert
          severity={resultCreateVerification?.success ? "success" : "error"}
          action={
            <IconButton color="inherit" size="small" onClick={() => setResultCreateVerification(null)}>
              <CloseIcon />
            </IconButton>
          }
          sx={{ mt: 3 }}
        >
          {resultCreateVerification?.message}
        </Alert>
      )}
    </Box>
  );
};

export default CreateNewPassword;
