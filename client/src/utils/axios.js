import axios from 'axios';

// TODO: Replace with your actual deployed server URL
// The proper way is to set VITE_API_URL in Vercel environment variables
const baseURL = import.meta.env.VITE_API_URL || 'https://e-commerce-mwae.vercel.app/';

const instance = axios.create({
    baseURL,    
    withCredentials: true
});

export default instance; 