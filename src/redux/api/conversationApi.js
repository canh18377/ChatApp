import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../service/axios';

export const fetchConversations = createAsyncThunk('conversation/fetchConversations', async () => {
    try {
        const response = await axios.get(`/conversations`);
        return response.data;
    } catch (error) {
        console.error('Request failed:', error.response?.data || error.message);
        throw new Error(error.message || 'Lỗi không xác định');
    }
});
