import axios from 'axios';

// This will use the environment variable VITE_API_URL if it's set,
// otherwise it will default to an empty string.
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Create an axios instance that will use the correct base URL.
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`
});



export const fetchConversations = async () => {
    // This will request '/api/conversations' in development
    // and 'https://...onrender.com/api/conversations' in production
    const { data } = await api.get('/conversations');
    return data;
};

export const fetchMessagesByWaId = async (waId) => {
    const { data } = await api.get(`/messages/${waId}`);
    return data;
};

export const postMessage = async (waId, messageBody) => {
    const { data } = await api.post('/messages', {
        wa_id: waId,
        body: messageBody,
    });
    return data;
};