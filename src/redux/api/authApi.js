import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../service/axios';

export const fetchLogin = createAsyncThunk('Login/fetchLogin', async (data) => {
    try {
        const response = await axios.post(`/auth/login`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Lỗi không xác định');
    }
});
export const fetchRegister = createAsyncThunk('register/fetchRegister', async (data) => {
    try {
        const response = await axios.post(`/auth/register`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Lỗi không xác định');
    }
});

