import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

const Error = () => {
  return (
    <Alert severity="error" sx={{ mt: 2 }}>
      <AlertTitle>Error</AlertTitle>
      The resource you are trying to get is not available or it does not exist.
    </Alert>
  );
};

export default Error;
