import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://mandimitra.onrender.com/api",
  withCredentials: true,
});