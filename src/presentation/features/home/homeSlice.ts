import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "app/config/axios";
import { FilterOptions } from "src/presentation/dto/req/filter-option.req.dto";
import { ProductRespondSimplizeDto } from "src/presentation/dto/res/product-respond.dto";



type HomeState = {
    popularProductList: ProductRespondSimplizeDto[],
    fetchPopularProductListStatus: 'pending' | 'error' | 'success' | 'idle'
}

const initialState: HomeState = {
    fetchPopularProductListStatus: 'idle',
    popularProductList: []
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
        }
    }
)

export default homeSlice.reducer
export const {} = homeSlice.actions

