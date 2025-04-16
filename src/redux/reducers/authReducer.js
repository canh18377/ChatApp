import { fetchLogin, fetchRegister } from '../api/authApi';
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        authenticated: false,
        loading: false,
        error: null,
        token: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.authenticated = true;
                state.token = action.payload
            })
            .addCase(fetchLogin.rejected, (state, action) => {
                state.loading = false;
                state.authenticated = false;
                state.error = action.error.message;
            })
            .addCase(fetchRegister.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRegister.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchRegister.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export default authSlice.reducer;
