import axios from "axios";

const api = axios.create({
  baseURL: "https://hospital-mini-erp.onrender.com/api",
});

export default api;