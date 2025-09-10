import axios from 'axios';

// Use the correct backend URL for production
const baseURL = import.meta.env.VITE_API_URL || 'https://e-commerce-j50w.onrender.com';

const instance = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 30000 // 30 second timeout
});

export default instance;
