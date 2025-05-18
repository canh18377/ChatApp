import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../service/axios';

export const fetchMessages = createAsyncThunk('message/fetchMessages', async (data) => {
    try {
        console.log(data)
        const response = await axios.get(`/message/${data.exist}/${data.exist ? data.conversationId : JSON.stringify(data.participants)}`);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Lỗi không xác định');
    }
});

export const saveImage = createAsyncThunk('message/saveImage', async (formData) => {
    try {
        const response = await axios.post(`/message/saveImg`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Lỗi không xác định');
    }
});
