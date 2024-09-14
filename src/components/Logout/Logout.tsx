"use client";

import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { setUser, initialState } from '@/redux/userSlice';
import { useLocalStorage } from 'usehooks-ts';
import { useDispatch } from 'react-redux';
import { LOCALSTORAGE_KEY } from '@/dataEnv/dataEnv';

const Logout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [, setStoredUser] = useLocalStorage(LOCALSTORAGE_KEY, null);


  const handleLogout = () => {
    dispatch(setUser(initialState));
    setStoredUser(null);
    router.push('/login');
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      height="80vh"
      sx={{ backgroundColor: 'GrayText' }}
    >
      <Typography variant="h6" gutterBottom>
      Sure you want to log out?
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleLogout}
      >
        Logout
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => router.push('/')}
        sx={{ mt: 2 }}
      >
        Cancel
      </Button>
    </Box>
  );
};

export default Logout;
