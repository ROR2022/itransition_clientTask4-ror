import React, { useState, FC, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import {confirmVerificationCode} from '@/api/apiUser';
import { setUser } from '@/redux/userSlice';
import { useDispatch } from 'react-redux';
import { useLocalStorage } from 'usehooks-ts';
import { LOCALSTORAGE_KEY } from '@/dataEnv/dataEnv';
import { useRouter } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import Cookies from 'js-cookie';
import { DataUser, initialState } from '@/redux/userSlice';

interface ModalRegisterProps {
    open: boolean;
    handleClose: () => void;
    verificationId: string;
    }


const ModalRegister:FC<ModalRegisterProps> = ({ open, handleClose, verificationId }) => {
  const [verificationCode, setVerificationCode] = useState('');
    const dispatch = useDispatch();
    const router = useRouter();
    const [storedUser, setLocalStorage] = useLocalStorage<DataUser>(LOCALSTORAGE_KEY, initialState);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if(storedUser?.access_token) {
        
        Cookies.set('authToken', storedUser.access_token, { expires: 1 });
      }else{
        Cookies.remove('authToken');
      }
    }, [storedUser]);

  const handleSubmit = async() => {
    
    console.log('Verification code captured:', verificationCode);
    
    try {
        setLoading(true);
      const response = await confirmVerificationCode(verificationId,verificationCode);
      console.log('Response:', response);
      
      const { success, dataUser } = response;
      if(success){
        dispatch(setUser(dataUser));
        setLocalStorage(dataUser);
        setTimeout(() => {
            router.push('/');
            setLoading(false);
            handleClose();
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error verification:', error);
        setLoading(false);
        //handleClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{
        maxWidth: '350px',
      }}
    >
      <Box 
        sx={{
          position: 'absolute',
          top: '50vh',
          left: '50vw',
          transform: 'translate(-50%, -50%)',
          maxWidth: '350px',
          width: '70vw',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Code Verification
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Enter the code sent to your email
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          id="verificationCode"
          label="Verification Code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          variant="outlined"
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          sx={{ mt: 2 }}
          fullWidth
          disabled={loading}
        >
            {loading ? <CircularProgress size={24} /> : 'Verify'}
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalRegister;
