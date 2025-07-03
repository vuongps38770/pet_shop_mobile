import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from 'app/config/axios';
import { CreateRatingDto, UpdateRatingDto, GetProductReviewsQuery } from 'src/presentation/dto/req/rating.req.dto';
import { RatingResDto } from 'src/presentation/dto/res/rating.respond.dto';

interface ReviewState {
  res: RatingResDto | null;
  loading: boolean;
  error?: string;
}

const initialState: ReviewState = {
  res: null,
  loading: false,
  error: undefined,
};

export const getProductReviews = createAsyncThunk<
  RatingResDto,
  GetProductReviewsQuery,
  { rejectValue: string }
>('review/getProductReviews', async (query, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    params.append('productId', query.productId);
    params.append('type', query.type);
    if (query.page) params.append('page', String(query.page));
    if (query.limit) params.append('limit', String(query.limit));
    const res = await axiosInstance.get(`/rating?${params.toString()}`);
    console.log(res.data.data);
    
    return res.data.data as RatingResDto;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
  }
});

export const createReview = createAsyncThunk<
  void,
  { dto: CreateRatingDto },
  { rejectValue: string }
>('review/create', async ({ dto }, { rejectWithValue }) => {
  try {
    await axiosInstance.post('/rating', dto);
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
  }
});

export const updateReview = createAsyncThunk<
  void,
  { id: string; dto: UpdateRatingDto },
  { rejectValue: string }
>('review/update', async ({ id, dto }, { rejectWithValue }) => {
  try {
    await axiosInstance.put(`/rating/${id}`, dto);
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
  }
});

export const deleteReview = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('review/delete', async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/rating/${id}`);
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
  }
});

export const rateReview = createAsyncThunk<
  { ratingId: string; action: 'LIKE' | 'DISLIKE' },
  { ratingId: string; action: 'LIKE' | 'DISLIKE' },
  { rejectValue: string }
>('review/rateReview', async ({ ratingId, action }) => {
  await axiosInstance.post('/rating/rate-post', { ratingId, action });
  return { ratingId, action };
});

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductReviews.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getProductReviews.fulfilled, (state, action: PayloadAction<RatingResDto>) => {
        state.res = action.payload;
        state.loading = false;
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(updateReview.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(deleteReview.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(rateReview.fulfilled, (state, action) => {
        const { ratingId, action: act } = action.payload;
        if (state.res && state.res.items) {
          const review = state.res.items.find(r => r._id === ratingId);
          if (review) {
            if (act === 'LIKE') {
              review.isLiked = true;
              review.isDisliked = false;
            } else if (act === 'DISLIKE') {
              review.isDisliked = true;
              review.isLiked = false;
            }
          }
        }
      });
  },
});

export default reviewSlice.reducer;
