import axios from 'axios';

// Create an instance of axios
const api = axios.create();

export const fetchConversations = async () => {
    const { data } = await api.get('/api/conversations');
    return data;
};

export const fetchMessagesByWaId = async (waId) => {
    const { data } = await api.get(`/api/messages/${waId}`);
    return data;
};

export const postMessage = async (waId, messageBody) => {
    const { data } = await api.post('/api/messages', {
        wa_id: waId,
        body: messageBody,
    });
    return data;
};