import { fetchUsers, getCurrentMe, searchUsers } from '../api/userApi';
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    searchResults: [],
    me: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getCurrentMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentMe.fulfilled, (state, action) => {
        state.loading = false;
        state.me = action.payload;
      })
      .addCase(getCurrentMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.searchResults = [];
        state.error = action.payload;
      });
  },
});
export default userSlice.reducer;
