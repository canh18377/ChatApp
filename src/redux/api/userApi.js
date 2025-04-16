import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../service/axios';

export const fetchUsers = createAsyncThunk('user/fetchUsers', async () => {
  try {
    const response = await axios.get(`/`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Lỗi không xác định');
  }
});

export const getCurrentMe = createAsyncThunk('user/fetchMe', async () => {
  try {
    const response = await axios.get(`/user/me`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Lỗi không xác định');
  }
});

