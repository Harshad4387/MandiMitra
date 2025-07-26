import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://lh6zvgwv-3000.inc1.devtunnels.ms/api",
  withCredentials: true,
});