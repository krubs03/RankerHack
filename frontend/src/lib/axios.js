import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VERCEL_BACKEND_URL,
  //baseUrl: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
  withCredentials: true,
});

export default instance;
