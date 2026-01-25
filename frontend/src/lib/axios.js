import axios from "axios";

//Axios => Simplifies API communications
const instance = axios.create({
  baseURL: import.meta.env.VERCEL_BACKEND_URL,
  //baseUrl: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
  withCredentials: true,
});

export default instance;
