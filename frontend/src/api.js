import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; 

export const askQuestion = async (question) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ask`, {
      question: question,
      session_id: '12346',
    });

    return response.data;
  } catch (error) {
    console.error('API error:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchConversations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/conversations`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch conversations:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchConversationHistory = async (sessionId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/session/${sessionId}/claude-history`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch conversation ${sessionId}:`, error.response?.data || error.message);
    throw error;
  }
};
