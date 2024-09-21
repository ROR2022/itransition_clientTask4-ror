"use client";
import React,{useState,useEffect, FC} from 'react'
import CardParticipant from './CardParticipant'
import { IPresentation } from './Presentation';
//import { useLocalStorage } from 'usehooks-ts';



export interface ParticipantType {
    id: string;
    nickname: string;
    status: string;
    role: string;
    presentationActive: string;
    
}

/* const dataParticipantsTmp = [
    {
        id: "User1",
        nickName: "User1",
        status: "Online",
        role: "Viewer",
    },
    {
        id: "User2",
        nickName: "User2",
        status: "Offline",
        role: "Author",
    },
    {
        id: "User3",
        nickName: "User3",
        status: "Online",
        role: "Editor",
    },
    {
        id: "User4",
        nickName: "User4",
        status: "Offline",
        role: "Viewer",
    },
    {
        id: "User5",
        nickName: "User5",
        status: "Online",
        role: "Editor",
    },
] */

interface ParticipantsProps {
    myParticipants: ParticipantType[];
    presentationActive: IPresentation | null;
    nickNameUser: string;
    setIsUpdatingParticipant: (isUpdating: ParticipantType | null) => void;
}


const Participants:FC<ParticipantsProps> = ({
    myParticipants,
    presentationActive,nickNameUser,
    setIsUpdatingParticipant
}) => {
    const [dataParticipants, setDataParticipants] = useState(myParticipants)
    

    useEffect(() => {
        const tempParticipantsA = myParticipants.filter((participant) => participant.nickname !== nickNameUser)
        const tempParticipants=tempParticipantsA.filter((participant) => participant.presentationActive === presentationActive?._id)
        setDataParticipants(tempParticipants)
        console.log('myParticipants:',myParticipants)
    }, [myParticipants])

    useEffect(() => {
        console.log('dataParticipants:',dataParticipants)
    },[dataParticipants]);

    if(dataParticipants.length>0){
  return (
    <div
    style={{
        border: "1px solid #000",
        borderRadius: "5px",
        padding: "5px",
        height: "100%",
    }}
    >
        {dataParticipants.map((dataParticipant) => (
            <CardParticipant
            key={dataParticipant.id} 
            dataParticipant={dataParticipant} 
            presentationActive={presentationActive} 
            nickNameUser={nickNameUser}
            setIsUpdatingParticipant={setIsUpdatingParticipant}
            />
        ))}
    </div>
  )
}else{
    return null
}
}

export default Participants