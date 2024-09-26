import React, { useState, useEffect } from "react";
import { getParticipants, createConversation } from "@/api/apiChat";
import { dataAvatares } from "@/dataEnv/dataEnv";
import Image from "next/image";
import { IConversation, IParticipant } from "./MyConversations";
import Select from "react-select";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { HiOutlineStatusOffline } from "react-icons/hi";
import { useContext } from "react";
import { ChatContext } from "./context/ChatContext";

const BadgeParticipant = ({ participant }: { participant: IParticipant }) => {
  const { usersOnline } = useContext(ChatContext);
  const [statusParticipant, setStatusParticipant] = useState(false);
  useEffect(() => {
    //console.log("Users Online:", usersOnline);
    //changeStatusParticipants();
    if(usersOnline.includes(participant.nickname)){
      setStatusParticipant(true);
    }else{
      setStatusParticipant(false);
    }
  }, [usersOnline]);
  /* const changeStatusParticipants = () => {
    participants.forEach((participant: any) => {
      const findParticipant = usersOnline.includes(participant.value);
    });
  } */
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "initial",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
        boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
        borderRadius: "5px",
        height: "20px",
      }}
    >
      <Image
        style={{ borderRadius: "50%" }}
        src={
          dataAvatares.find((avatar) => avatar.title === participant.avatar)
            ?.url || dataAvatares[0].url
        }
        alt="avatar"
        width={20}
        height={20}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "initial",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <span>{participant.nickname}</span>
        {statusParticipant===true ? (
          <HiOutlineStatusOnline style={{ color: "green" }} />
        ) : (
          <HiOutlineStatusOffline style={{ color: "red" }} />
        )}
      </div>
    </div>
  );
};

interface ISelectedOption {
  value: string;
  label: JSX.Element;
  id: string;
}

const SelectConversation = () => {
  const [participants, setParticipants] = useState([]);
  const [selectedOption, setSelectedOption] = useState<ISelectedOption|null>(null);
  const {
    dataUserChat,
    userConversations,
    setConversationActive,
    setUserConversations,
    conversationActive,
    initConversationActive,
  } = useContext(ChatContext);
  useEffect(() => {
    fetchParticipants();
  }, []);

  


  useEffect(() => {
    if (userConversations.length === 0 && conversationActive._id !== "") {
      //console.log("No Conversation Active:", conversationActive);
      setConversationActive(initConversationActive);
      setSelectedOption(null);
    }
  }, [userConversations]);

  

  const fetchParticipants = async () => {
    try {
      const res = await getParticipants();
      //console.log("All Participants:", res);
      const tempParticipants = res.map((participant: IParticipant) => {
        return {
          value: participant.nickname,
          label: <BadgeParticipant participant={participant} />,
          id: participant._id,
        };
      });
      setParticipants(tempParticipants);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeConversation = async (selectedOption: ISelectedOption|null) => {
    if (!selectedOption) {
      return;
    }
    console.log("Selected Conversation:", selectedOption);
    //console.log('UserConversations:',userConversations);
    setSelectedOption(selectedOption);
    try {
      let findConversation = null;
      userConversations.forEach((conversation: IConversation) => {
        const findParticipant = conversation.participants.find(
          (participant) => participant._id === selectedOption.id
        );
        if (findParticipant) {
          findConversation = conversation;
        }
      });
      //console.log("Find Conversation:", findConversation);
      //console.log('userConversations:',userConversations);
      //return;
      if (findConversation) {
        console.log("Conversation Found:", findConversation);
        setConversationActive(findConversation);
      } else {
        console.log("No Conversation Found:", findConversation);
        const dataConversation = {
          participants: [dataUserChat._id, selectedOption.id],
          messages: [],
        };
        const res = await createConversation(dataConversation);
        console.log("New Conversation:", res);
        setConversationActive(res);
        setUserConversations([...userConversations, res]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      style={{
        height: "10%",
        width: "100%",
        background: 'radial-gradient(circle, rgba(221,221,221,1) 0%, rgba(0,212,255,1) 52%, rgba(221,221,221,1) 100%)'
      }}
    >
      <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
        minWidth: "80%",
      }}
      >
      {participants.length > 0 && (
        <Select
        styles={{
          control: (styles) => ({
            ...styles,
            background:'radial-gradient(circle, rgba(221,221,221,1) 0%, rgba(0,212,255,1) 52%, rgba(221,221,221,1) 100%)',
            borderRadius: "5px",
            boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
            height: "50px",
            width: "100%",
            padding: "5px",
          }),
          option: (styles, { isDisabled, isFocused }) => {
            return {
              ...styles,
              backgroundColor: isFocused ? "#154bdb" : "#15dadb",
              color: "black",
              cursor: isDisabled ? "not-allowed" : "default",
              ":active": {
                ...styles[":active"],
                backgroundColor: "#154bdb",
              },
            };
          },
        }}
          value={selectedOption}
          onChange={handleChangeConversation}
          options={participants}
          placeholder="🔍 Search or start a new chat"
        />
      )}
      </div>
    </div>
  );
};

export default SelectConversation;
