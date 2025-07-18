import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'app/config/axios';

export const uploadFiles = createAsyncThunk(
  'upload/uploadFiles',
  async (files: { uri: string; type: string; name: string }[], { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', {
          uri: file.uri,
          type: file.type,
          name: file.name,
        } as any);
      });
      const res = await axios.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(
        res.data.data.urls
      );
      
      return res.data.data.urls as string[];
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Lỗi upload file');
    }
  }
);

interface UploadState {
  loading: boolean;
  error: string | null;
  urls: string[];
}

const initialState: UploadState = {
  loading: false,
  error: null,
  urls: [],
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    clearUpload(state) {
      state.loading = false;
      state.error = null;
      state.urls = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFiles.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.loading = false;
        state.urls = action.payload;
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Lỗi upload file';
      });
  },
});

export const { clearUpload } = uploadSlice.actions;
export default uploadSlice.reducer;
