import axios from "axios";

// Create an instance of axios with a custom config
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Use environment variable for the base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
