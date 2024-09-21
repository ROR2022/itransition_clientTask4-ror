import axios from "axios";
import { hostURL } from "../dataEnv/dataEnv";

export const registerUser = async (user) => {
  try {
    console.log("Registering: ", user);
    const response = await axios.post(`${hostURL}/api/auth/register`, user);
    console.log("Response Register: ", response);
    return response?.data;
  } catch (error) {
    console.log("Error Registering", error);

    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
};

export const loginUser = async (user) => {
  try {
    const response = await axios.post(`${hostURL}/api/auth/login`, user);
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
};

export const confirmVerificationCode = async (verification, code) => {
  try {
    const response = await axios.post(`${hostURL}/api/verification/confirm`, {
      verification,
      code,
    });
    return response?.data;
  } catch (error) {
    console.log(error);

    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
};

export const createVerification = async (email) => {
  try {
    const response = await axios.post(`${hostURL}/api/verification`, { email });
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error.message;
    return { error: tempError };
  }
};

export const createReactiveVerification = async (email) => {
  try {
    const response = await axios.post(`${hostURL}/api/verification/reactive`, { email });
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error.message;
    return { error: tempError };
  }
}


export const updatedPassword = async (dataRecovery) => {
  try {
    const response = await axios.post(
      `${hostURL}/api/auth/recovery`,
      dataRecovery
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error.message;
    return { error: tempError };
  }
};

export const reactiveAccount = async (dataReactive) => {
  try {
    const response = await axios.post(
      `${hostURL}/api/auth/reactive`,
      dataReactive
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error.message;
    return { error: tempError };
  }
}

export const getDataUsers = async (token) => {
  try {
    const response = await axios.get(`${hostURL}/api/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error.message;
    return { error: tempError };
  }
}

export const updateActiveUsers = async (token, data) => {
  try {
    const response = await axios.put(`${hostURL}/api/user/updateActive`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error.message;
    return { error: tempError };
  }
}

export const deleteUsers = async (token, data) => {
  try {
    const response = await axios.post(`${hostURL}/api/user/deleteUsers`,data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error.message;
    return { error: tempError };
  }
}

export const getFakeUsers = async (dataFaker) => {
  const { seed, region, errorRate, page, limit}= dataFaker;
  try {
    const response = await axios.get(`${hostURL}/api/fakerdata?seed=${seed}&region=${region}&errorRate=${errorRate}&page=${page}&limit=${limit}`, dataFaker);
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error.message;
    return { error: tempError };
  }
}


