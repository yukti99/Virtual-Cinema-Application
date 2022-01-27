import axios from "axios";
import config from "../config";

const token = window.localStorage.getItem("jwt");


const apiClient = axios.create({
  baseURL: config.connection.apiGateway,
  headers: {
    Authorization: token,
  },
  withCredentials: false,
});

export const getEvent = async (id) => {
  const data = await apiClient.get(`/event/${id}`);
  return data;
};

export const postNewEvent = async (id, body) => {
  const newEvent = await apiClient.post(`/event/${id}`, body);
  return newEvent;
};

export const getEventsForUser = async () => {
  const userEvents = await apiClient.get(`/event`, {});
  return userEvents;
};

export const postEventMessage = async (body) => {
   const userMessage = await apiClient.post(`/message`, body);
   return userMessage;
};

export const getMessagesForEvent = async (eventID) => {
  const userEvents = await apiClient.get(`/message/${eventID}`);
  return userEvents;
};

export const getUserInfo = async () => {
  const userInfo = await apiClient.get(`/auth`)
  return userInfo
}

export const storeUserInfo = async () =>{
  const userInfo = await apiClient.post(`/auth`);
  return userInfo
}