import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "app/config/axios";
import { FilterOptions } from "src/presentation/dto/req/filter-option.req.dto";
import { ProductRespondSimplizeDto, ProductSuggestionDto } from "src/presentation/dto/res/product-respond.dto";



type HomeState = {
    popularProductList: ProductRespondSimplizeDto[],
    fetchPopularProductListStatus: 'pending' | 'error' | 'success' | 'idle',
    personalizedSuggestions: ProductSuggestionDto[],
    fetchPersonalizedSuggestionsStatus: 'pending' | 'error' | 'success' | 'idle',
    popularSuggestions: ProductSuggestionDto[],
    fetchPopularSuggestionsStatus: 'pending' | 'error' | 'success' | 'idle',
}

const initialState: HomeState = {
    fetchPopularProductListStatus: 'idle',
    popularProductList: [],
    personalizedSuggestions: [],
    fetchPersonalizedSuggestionsStatus: 'idle',
    popularSuggestions: [],
    fetchPopularSuggestionsStatus: 'idle',
}

const SLICE_NAME = 'home_slice'


export const getPoPularProduct = createAsyncThunk<ProductRespondSimplizeDto[]>(
    "home/product",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('products/getProducts', {
                params: { limit: 4 } as FilterOptions
            })
            return res.data.data.data as ProductRespondSimplizeDto[]
        } catch (error) {
            return rejectWithValue(error)
        }

    }
)

export const getPersonalizedSuggestions = createAsyncThunk<ProductSuggestionDto[]>(
    "home/personalizedSuggestions",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('products/suggestions', {
                params: { type: 'personalized' }
            })
            return res.data.data as ProductSuggestionDto[];
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getPopularSuggestions = createAsyncThunk<ProductSuggestionDto[]>(
    "home/popularSuggestions",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('products/suggestions', {
                params: { type: 'popular' }
            })
            return res.data.data as ProductSuggestionDto[];
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const homeSlice = createSlice(
    {
        name: SLICE_NAME,
        initialState,
        reducers: {

        },
        extraReducers:(builder)=>{
            builder
            .addCase(getPoPularProduct.fulfilled, (state, action) => {
                state.popularProductList = action.payload;
                state.fetchPopularProductListStatus='success'
            })
            .addCase(getPoPularProduct.pending, (state, action) => {
                state.fetchPopularProductListStatus='pending'
            })
            // personalized suggestions
            .addCase(getPersonalizedSuggestions.pending, (state) => {
                state.fetchPersonalizedSuggestionsStatus = 'pending';
            })
            .addCase(getPersonalizedSuggestions.fulfilled, (state, action) => {
                state.personalizedSuggestions = action.payload;
                state.fetchPersonalizedSuggestionsStatus = 'success';
            })
            .addCase(getPersonalizedSuggestions.rejected, (state) => {
                state.fetchPersonalizedSuggestionsStatus = 'error';
            })
            // popular suggestions
            .addCase(getPopularSuggestions.pending, (state) => {
                state.fetchPopularSuggestionsStatus = 'pending';
            })
            .addCase(getPopularSuggestions.fulfilled, (state, action) => {
                state.popularSuggestions = action.payload;
                state.fetchPopularSuggestionsStatus = 'success';
            })
            .addCase(getPopularSuggestions.rejected, (state) => {
                state.fetchPopularSuggestionsStatus = 'error';
            })
        }
    }
)

export default homeSlice.reducer
export const {} = homeSlice.actions

