import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../service/axios';

export const fetchMessages = createAsyncThunk('message/fetchMessages', async (conversationId) => {
    try {
        const response = await axios.get(`/message/${conversationId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Lỗi không xác định');
    }
});
