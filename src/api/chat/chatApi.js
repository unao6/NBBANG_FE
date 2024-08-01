import axios from "axios";
import axiosInterceptors from "../axiosInterceptors.js";

const chatUrl = '/api/chat';
const adminChatUrl = '/api/admin/chat';

export const startChat = async () => {
    try {
        const response = await axiosInterceptors.post(`${chatUrl}/start`);
        return response.data;
    } catch (error) {
        console.error('Error in startChat:', error.response ? error.response.data : error.message);
        throw error;
    }
  };

export const sendMessage = async (stompClient, messageRequest) => {
    if(stompClient && stompClient.connected) {
        stompClient.send("/app/chat/send", {}, JSON.stringify(messageRequest));
    }
};

export const fetchAllChats = async () => {
    const response = await axiosInterceptors.get(`${adminChatUrl}/all`);
    return response.data;
};

export const fetchChatMessages = async (chatId) => {
    const response = await axiosInterceptors.get(`${adminChatUrl}/${chatId}`);
    return response.data;
};

export const endChat = async (chatId) => {
    const response = await axiosInterceptors.post(`${adminChatUrl}/end/${chatId}`);
    return response.data;
};

export const archiveChat = async (chatId, memo) => {
    const response = await axiosInterceptors.post(`${adminChatUrl}/archive`, { chatId, memo });
    return response.data;
};