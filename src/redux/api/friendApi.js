import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../service/axios';

// Gửi lời mời kết bạn
export const sendFriendRequest = createAsyncThunk(
    'friend/sendFriendRequest',
    async (recipientId, { rejectWithValue }) => {
        try {
            const response = await axios.post('/friend/send-request', { recipientId });
            return response.data;
        } catch (error) {
            console.error('Send friend request failed:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Chấp nhận lời mời kết bạn
export const acceptFriendRequest = createAsyncThunk(
    'friend/acceptFriendRequest',
    async (requestId, { rejectWithValue }) => {
        try {
            const response = await axios.put(`friend/accept/${requestId}`);
            return response.data;
        } catch (error) {
            console.error('Accept friend request failed:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Từ chối lời mời kết bạn
export const rejectFriendRequest = createAsyncThunk(
    'friend/rejectFriendRequest',
    async (requestId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/friend/reject/${requestId}`);
            return response.data;
        } catch (error) {
            console.error('Reject friend request failed:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Lấy danh sách bạn
export const fetchFriendList = createAsyncThunk(
    'friend/fetchFriendList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/friend/friends');
            return response.data;
        } catch (error) {
            console.error('Fetch friend list failed:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchReceivedRequests = createAsyncThunk(
    'friend/fetchReceivedRequests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/friend/requests/received');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Lấy danh sách đã gửi
export const fetchSentRequests = createAsyncThunk(
    'friend/fetchSentRequests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/friend/requests/sent');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);