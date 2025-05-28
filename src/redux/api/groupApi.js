import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../service/axios';

export const createGroup = createAsyncThunk('conversation/createGroup', async (data) => {
    try {
        const response = await axios.post(`/conversations/create-group`, data);
        return response.data;
    } catch (error) {
        console.error('Request failed:', error.response?.data || error.message);
        throw new Error(error.message || 'Lỗi không xác định');
    }
});
