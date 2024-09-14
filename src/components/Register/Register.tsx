"use client";
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Container, Avatar } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { dataAvatares } from '@/dataEnv/dataEnv';
import { registerUser } from '@/api/apiUser';
import ModalRegister from './ModalRegister';
import Link from 'next/link';


const Register = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<string|null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [verificationId, setVerificationId] = useState<string|null>(null);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      avatar: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(4, 'Name must be at least 4 characters')
        .required('User name is required'),
      email: Yup.string()
        .email('Not a valid email')
        .required('Email is required'),
      password: Yup.string()
        .min(1, 'Password must be at least 1 character')
        .required('Password is required'), 
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Password confirmation is required'),
      avatar: Yup.string()
        .required('Avatar is required'),
    }),
    onSubmit: async (values) => {
      console.log('Data form:', values);
      //eslint-disable-next-line
      const { confirmPassword, ...data } = values;
      try {
        const response = await registerUser(data);
        console.log('Response:', response);
        const { verification } = response;
        if (verification) {
          console.log('Verification code:', verification);
          setVerificationId(verification);
          setOpenModal(true);
        }
      } catch (error) {
        console.error('Error register:', error);
      }
    },
  });

  const handleAvatarClick = (avatar:string) => {
    setSelectedAvatar(avatar);
    formik.setFieldValue('avatar', avatar);
  };

  return (
    <Container 
    style={{ marginBottom: '50px' }}
    maxWidth="sm">
      <ModalRegister 
        open={openModal}
        handleClose={() => setOpenModal(false)}
        verificationId={verificationId||''}
      />
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        height="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <Typography variant="body2" gutterBottom>
          ¿Already registered?{' '}
          <Link href="/login">
            <span>Login now</span>
          </Link>
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="username"
            name="username"
            label="Name"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            margin="normal"
            variant="outlined"
          />

          <Typography variant="h6" gutterBottom>
            Select an avatar
          </Typography>
          <Grid container spacing={2}>
            {dataAvatares.map((avatar, index) => (
              <Grid size={{xs:3}} key={index}>
                <Avatar
                  src={avatar.url}
                  alt={`avatar-${index}`}
                  sx={{
                    width: 56,
                    height: 56,
                    cursor: 'pointer',
                    border: selectedAvatar === avatar.title ? '2px solid #3f51b5' : 'none',
                  }}
                  onClick={() => handleAvatarClick(avatar.title)}
                />
              </Grid>
            ))}
          </Grid>
          {formik.touched.avatar && formik.errors.avatar && (
            <Typography color="error" variant="body2">
              {formik.errors.avatar}
            </Typography>
          )}

          <Button 
            color="primary" 
            variant="contained" 
            fullWidth 
            type="submit" 
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
