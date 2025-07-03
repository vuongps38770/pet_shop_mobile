import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'app/config/axios';

export interface FcmState {
    status: 'idle' | 'loading' | 'success' | 'error';
}

const initialState: FcmState = {
    status: 'idle',
};

export const updateFcmToken = createAsyncThunk(
    'fcm/updateToken',
    async (
        {
            token,
            userAgent,
        }: { token: string; userAgent: string },
        thunkAPI
    ) => {
        try {
            const res = await axiosInstance.post(
                '/fcm-token/update',
                {
                    'userAgent': userAgent,
                    'fcm-token': token,
                },
            );
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);

export const fcmTokenSlice = createSlice({
    name: 'fcm',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateFcmToken.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateFcmToken.fulfilled, (state) => {
                state.status = 'success';
            })
            .addCase(updateFcmToken.rejected, (state) => {
                state.status = 'error';
            });
    },
});

export default fcmTokenSlice.reducer;
