// utils/axios.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8055",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
