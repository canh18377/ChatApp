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

export const searchUsers = createAsyncThunk(
  'user/searchUsers',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/user/getUsers/${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Lỗi khi tìm kiếm người dùng');
    }
  },
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/user/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Lỗi khi tìm kiếm người dùng');
    }
  },
);