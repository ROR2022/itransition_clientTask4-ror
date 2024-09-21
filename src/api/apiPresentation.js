import axios from "axios";
import { hostURL } from "../dataEnv/dataEnv";

export const getPresentations = async () => {
  try {
    const response = await axios.get(`${hostURL}/api/presentation`);
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
};

export const createPresentation = async (dataPresentation) => {
  try {
    const response = await axios.post(
      `${hostURL}/api/presentation`,
      dataPresentation
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
};

export const addSlidePresentation = async (idPresentation, idNewSlide) => {
  try {
    const response = await axios.put(
      `${hostURL}/api/presentation/${idPresentation}`,
      { newSlide: idNewSlide }
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
};

export const addUserToPresentation = async (idPresentation, nickname) => {
  try {
    const response = await axios.put(
      `${hostURL}/api/presentation/adduser/${idPresentation}`,
      { newUser: nickname }
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
}

export const editUserInPresentation = async (idPresentation, user,role) => {
  try {
    const response = await axios.put(
      `${hostURL}/api/presentation/edituser/${idPresentation}`,
      { user,role }
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
}

export const createSlide = async (dataSlide) => {
  try {
    const response = await axios.post(`${hostURL}/api/slide`, dataSlide);
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
};

export const getSlideById = async (idSlide) => {
  try {
    const response = await axios.get(`${hostURL}/api/slide/${idSlide}`);
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
}

export const createTextblock = async (dataTextblock) => {
  try {
    const response = await axios.post(
      `${hostURL}/api/textblock`,
      dataTextblock
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
}

export const addTextblockToSlide = async (idSlide, idTextblock) => {
  try {
    const response = await axios.put(
      `${hostURL}/api/slide/${idSlide}`,
      { newTextblock: idTextblock }
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
}

export const updateTextblock = async (idTextblock, dataTextblock) => {
  try {
    const response = await axios.patch(
      `${hostURL}/api/textblock/${idTextblock}`,
      dataTextblock
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    const tempError = error?.response?.data || error?.message;
    return { error: tempError };
  }
}