import axios from "axios";
import { getToken } from "../utils/storage";




const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://192.168.1.4:5001/api",
});

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export default API;
