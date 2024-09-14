"use client";
import React,{useEffect} from 'react'
import { useSelector } from 'react-redux';
import { DataUser } from '@/redux/userSlice';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';

const MyHome = () => {
  const user: DataUser = useSelector((state:RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    //console.log('User:', user);
    if(!user.email){
      router.push('/login');
    }else{
      router.push('/admin');
    }
  }, [user]);
  return (
    <div
      style={{
        
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
      }}
    >
      <CircularProgress />
    </div>
  )
}

export default MyHome