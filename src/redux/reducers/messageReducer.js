import { fetchMessages, saveImage } from '../api/messageApi';
import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
    name: 'message',
    initialState: {
        messages: [],
        loading: false,
        error: null,
        imgUrl: "",
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(saveImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveImage.fulfilled, (state, action) => {
                state.loading = false;
                state.imgUrl = action.payload;
            })
            .addCase(saveImage.rejected, (state, action) => {
                state.loading = false;
            });
    },
});
export default messageSlice.reducer;
