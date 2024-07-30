import axios from "axios";

const baseUrl = process.env.REACT_APP_API_BASE_URL;
const chatUrl = `${baseUrl}/api/chat`;
const adminChatUrl = `${baseUrl}/api/admin/chat`;

export const startChat = async () => {
    const response = await axios.post(`${chatUrl}/start`);
    return response.data;
  };

export const sendMessage = async (stompClient, messageRequest) => {
    if(stompClient && stompClient.connected) {
        stompClient.send("/app/chat/send", {}, JSON.stringify(messageRequest));
    }
};

export const fetchAllChats = async () => {
    const response = await axios.get(`${adminChatUrl}/all`);
    return response.data;
};

export const fetchChatMessages = async (chatId) => {
    const response = await axios.get(`${adminChatUrl}/${chatId}`);
    return response.data;
};

export const endChat = async (chatId) => {
    const response = await axios.post(`${adminChatUrl}/end/${chatId}`);
    return response.data;
};

export const archiveChat = async (chatId, memo) => {
    const response = await axios.post(`${adminChatUrl}/archive`, { chatId, memo });
    return response.data;
};