import { createSlice } from '@reduxjs/toolkit';
import {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    fetchFriendList,
    fetchSentRequests,
    fetchReceivedRequests,
} from '../api/friendApi';

const initialState = {
    friends: [],
    sentRequests: [],
    receivedRequests: [],
    loading: false,
    error: null,
};

const friendSlice = createSlice({
    name: 'friend',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // --- Gửi lời mời ---
            .addCase(sendFriendRequest.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendFriendRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.sentRequests.push(action.payload);
            })
            .addCase(sendFriendRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // --- Chấp nhận lời mời ---
            .addCase(acceptFriendRequest.pending, (state) => {
                state.loading = true;
            })
            .addCase(acceptFriendRequest.fulfilled, (state, action) => {
                state.loading = false;
                // Xoá khỏi danh sách đã nhận
                state.receivedRequests = state.receivedRequests.filter(
                    (req) => req._id !== action.payload._id
                );
                // Thêm vào danh sách bạn bè
                state.friends.push(action.payload.friend);
            })
            .addCase(acceptFriendRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // --- Từ chối lời mời ---
            .addCase(rejectFriendRequest.pending, (state) => {
                state.loading = true;
            })
            .addCase(rejectFriendRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.receivedRequests = state.receivedRequests.filter(
                    (req) => req._id !== action.payload._id
                );
            })
            .addCase(rejectFriendRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // --- Lấy danh sách bạn ---
            .addCase(fetchFriendList.fulfilled, (state, action) => {
                state.friends = action.payload;
            })

            // --- Lấy lời mời đã gửi ---
            .addCase(fetchSentRequests.fulfilled, (state, action) => {
                state.sentRequests = action.payload;
            })

            // --- Lấy lời mời đã nhận ---
            .addCase(fetchReceivedRequests.fulfilled, (state, action) => {
                state.receivedRequests = action.payload;
            });
    },
});

export default friendSlice.reducer;