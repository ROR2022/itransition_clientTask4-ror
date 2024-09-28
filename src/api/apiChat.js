import axios from "axios";
import { hostURL } from "../dataEnv/dataEnv";

export const createParticipant = async (dataParticipant) => {
  try {
    const response = await axios.post(
      `${hostURL}/api/participant`,
      dataParticipant
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
};

export const getParticipantByNickname = async (nickname) => {
  try {
    const response = await axios.get(
      `${hostURL}/api/participant/byNickname/${nickname}`
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
};

export const getParticipantById = async (idParticipant) => {
  try {
    const response = await axios.get(
      `${hostURL}/api/participant/${idParticipant}`
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
}

export const getParticipants = async () => {
  try {
    const response = await axios.get(`${hostURL}/api/participant`);
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
};

export const updateParticipant = async (idParticipant, dataParticipant) => {
  try {
    const response = await axios.patch(
      `${hostURL}/api/participant/${idParticipant}`,
      dataParticipant
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
};

export const createConversation = async (dataConversation) => {
  try {
    const response = await axios.post(
      `${hostURL}/api/conversation`,
      dataConversation
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
};

export const hideConversationInParticipant = async (dataHide) => {

  try {
    const response = await axios.put(
      `${hostURL}/api/participant/addhideConversation`,
      dataHide
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }

}

export const getConversationById = async (conversationId) => {
  try {
    const response = await axios.get(
      `${hostURL}/api/conversation/${conversationId}`
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
}

export const updateConversation = async (idConversation, dataConversation) => {
  try {
    const response = await axios.patch(
      `${hostURL}/api/conversation/${idConversation}`,
      dataConversation
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
};

export const deleteConversation = async (idConversation) => {
  try {
    const response = await axios.delete(`${hostURL}/api/conversation/${idConversation}`);
    return response?.data;
  }
  catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
};

export const getConversationsByParticipantId = async (participantId) => {
  try {
    console.log('getConversationsByParticipantId:..',participantId);
    const response = await axios.get(
      `${hostURL}/api/conversation/byParticipantId/${participantId}`
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
}

export const createMessage = async (dataMessage) => {
  try {
    const response = await axios.post(
      `${hostURL}/api/message`,
      dataMessage
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
}

export const addMessageToConversation = async (idConversation, idMessage) => {
  try {
    const response = await axios.put(
      `${hostURL}/api/conversation/addMessage?conversationId=${idConversation}&messageId=${idMessage}`
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
}

export const getMessageById = async (messageId) => {
  try {
    const response = await axios.get(
      `${hostURL}/api/message/${messageId}`
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
}
