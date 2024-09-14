"use client"
import React,{useState, useEffect} from 'react'
import { getDataUsers } from '@/api/apiUser';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { DataUser } from '@/redux/userSlice';
import DataTable from './DataTable';
import { CircularProgress, Box } from '@mui/material';
import { setUser, initialState } from '@/redux/userSlice';
import { useLocalStorage } from 'usehooks-ts';
import { LOCALSTORAGE_KEY } from '@/dataEnv/dataEnv';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Alert, AlertTitle } from '@mui/material';


export interface UserFromDB {
  _id?: string;
  username?: string;
  email: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
  lastLogin?: Date;
  avatar?: string;
error?:boolean | {message?:string, error?:string};  
}


const Admin = () => {
    const [dataUsers, setDataUsers] = useState<Array<DataUser>>([]);
    const [loading, setLoading] = useState(false);
    const [noActiveMessage, setNoActiveMessage] = useState('');
    const user:DataUser = useSelector((state:RootState) => state.user);
    
    const [, setStoredUser] = useLocalStorage(LOCALSTORAGE_KEY, null);
    const router = useRouter();
    const dispatch = useDispatch();
    useEffect(()=>{
        
        if(user.email) {
          fetchData()
        }
    },[user])

    const fetchData = async() => {
      //console.log('User:', user);
      setLoading(true);
      const response:Array<UserFromDB> = await getDataUsers(user.access_token);
      //console.log('Response Admin DataUsers:', response);
      //check if user is active or not
      const myDataUser:UserFromDB|undefined= response.find((recoverUser:UserFromDB)=>recoverUser.email===user.email);
      //console.log('MyDataUser:', myDataUser); 
      if(myDataUser?.active!==true){
        //alert('You are not active');
        //proceed to logout
        setLoading(false);
        setNoActiveMessage('You are not active');
        dispatch(setUser(initialState));
        setStoredUser(null);
        setTimeout(()=>{
          router.push('/login');
          setNoActiveMessage('');
        },2000);
        
      }
      const tempDataUsers:Array<DataUser> = response.map((user:UserFromDB)=>{
        return {
          id:user._id,
          username:user.username,
          email:user.email,
          active:user.active,
          createdAt:user.createdAt,
          lastLogin:user.lastLogin,
          avatar:user.avatar
        }
      });
      setDataUsers([...tempDataUsers]);
      setLoading(false);
  }

  const handleReload = () => {
    fetchData();
  }
    
  return (
    <div style={{marginTop:'50px'}}>
      {noActiveMessage&&
       <Alert severity="error" sx={{ mt: 2 }}>
       <AlertTitle>Error</AlertTitle>
       {noActiveMessage}
     </Alert>

        }
        {loading&&
         <Box sx={{ 
          display: 'flex',  
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          backgroundColor: 'rgba(0,0,0,0.1)',
          }}>
         <CircularProgress />
         <p>Loading...</p>
       </Box>
        }
        {!loading&&noActiveMessage===''&&dataUsers.length>0&&
          <DataTable dataUsers={dataUsers} handleReload={handleReload}/>
        }
        
    </div>
  )
}

export default Admin