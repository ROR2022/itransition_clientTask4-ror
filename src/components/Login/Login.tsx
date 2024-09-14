"use client";
import React, {useState, useEffect} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { loginUser } from '@/api/apiUser';
import { useRouter } from 'next/navigation';
//importaremos el icono de close de material ui
import CloseIcon from '@mui/icons-material/Close';
import { useSelector, useDispatch } from "react-redux";
import { DataUser, setUser } from "@/redux/userSlice";
import { useLocalStorage } from "usehooks-ts";
//import { loginUser } from "@/api/rorUserApi";
import { LOCALSTORAGE_KEY } from "@/dataEnv/dataEnv";
import Link from 'next/link';
import CircularProgress from '@mui/material/CircularProgress';
import Cookies from 'js-cookie';
import { UserFromDB } from '../Admin/Admin';

interface ErrorResponseLogin{
    error?: {message?:string, error?:string};
    message?: string;
}

const Login = () => {
    const [responseLogin, setResponseLogin] = useState<UserFromDB|ErrorResponseLogin|null>(null);
    const user = useSelector((state: { user: DataUser }) => state.user);
    const [loading, setLoading] = useState(false);
    const [storedUser, setStoredUser] = useLocalStorage<DataUser>(
      LOCALSTORAGE_KEY,
      user
    );
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
      if(storedUser?.access_token) {
        
        Cookies.set('authToken', storedUser.access_token, { expires: 1 });
      }else{
        Cookies.remove('authToken');
      }
    }, [storedUser]);


  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Not a valid email')
        .required('Email is required'),
      password: Yup.string()
        .min(1, 'Password must be at least 1 character')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      console.log('Data form:', values);
      
      try {
        setLoading(true);
        const response = await loginUser(values);
        console.log('Res login:', response);
        setResponseLogin(response);
        //router.push('/');
        setTimeout(() => {
            setResponseLogin(null);
            if (response?.email) {
                router.push('/');
                dispatch(setUser(response));
                setStoredUser(response);
                
            }
            }, 2000);
            setLoading(false);
      } 
      //eslint-disable-next-line
      catch (errorRes:any) {
        console.error('Error login:', errorRes);
        setResponseLogin({ error:{error:errorRes.error,message:errorRes.message}, message: 'Error login' });
        setLoading(false);
      }
      
    },
  });
  

  return (
    <Container 
        sx={{ mt: 4 }}
    maxWidth="xs" >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Login
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
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
        <Button 
          color="primary" 
          variant="contained" 
          fullWidth 
          type="submit" 
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Login'}
          
        </Button>
      </form>
        {responseLogin?.error && (
            <Box display="flex">
            <Typography 
                sx={{ mt: 2 }}
                variant="body1" 
                align="center" 
                color={responseLogin.error ? 'error' : 'success'}
            >
            {
              //eslint-disable-next-line
            `${responseLogin.error?.error} ${responseLogin.error?.message}` || 'Error login'
            }
            </Typography>
            <Button 
                onClick={() => setResponseLogin(null)}
                variant={'text'}
                sx={{ mt: 2, color: 'GrayText' }}
                startIcon={<CloseIcon />}
            />
                
            
            </Box>
        )}
        {responseLogin?.email && (
            <Box display="flex">
            <Typography 
                sx={{ mt: 2, color: 'darkgreen', fontWeight: 'bold' }}
                variant="body1" 
                align="center" 
                color={'success'}
            >
            {`Welcome ${responseLogin.email}`}
            </Typography>
            <Button 
                onClick={() => setResponseLogin(null)}
                variant={'text'}
                sx={{ mt: 2, color: 'GrayText' }}
                startIcon={<CloseIcon />}
            />
            </Box>
            )}
        <Link href="/register">
            <Button 
                variant="outlined" 
                sx={{ mt: 2, color: 'secondary.main' }}
                fullWidth
            >
            Register Now
            </Button>
        </Link>
        <Link href="/forgot">
            <Button 
                variant="text" 
                sx={{ mt: 2, color: 'GrayText' }}
                fullWidth
            >
            Forgot Password?
            </Button>
        </Link>
        <Link href="/reactive">
            <Button 
                variant="text" 
                sx={{ mt: 2, color: 'GrayText' }}
                fullWidth
            >
            need to reactivate your account?
            </Button>
        </Link>
    </Container>
  );
};

export default Login;
