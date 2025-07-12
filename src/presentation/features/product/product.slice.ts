import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProductDetailRespondDTO } from 'src/presentation/dto/res/product-detail.dto';
import { RootState } from 'src/presentation/store/store';
import axiosInstance from 'app/config/axios';
import { ProductPaginationRespondDto } from 'src/presentation/dto/res/pagination-respond.dto';
import { ProductRespondSimplizeDto } from 'src/presentation/dto/res/product-respond.dto';
import { FilterOptions } from 'src/presentation/dto/req/filter-option.req.dto';
import { CategoryRespondDto } from 'src/presentation/dto/res/category-respond.dto';
import { string } from 'yup';

type ProductState = {
    currentProductDetail: ProductDetailRespondDTO | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';


    filterStatus: 'idle' | 'loading' | 'succeeded' | 'failed';


    pages: ProductPaginationRespondDto<ProductRespondSimplizeDto>
    error?: string;


    categories:CategoryRespondDto[]
};

const initialState: ProductState = {
    currentProductDetail: null,
    status: 'idle',
    error: undefined,
    pages: {},
    filterStatus: 'idle',
    categories:[]

};

export const fetchProductDetail = createAsyncThunk<
    ProductDetailRespondDTO,
    string,
    { rejectValue: string }
>('product/fetchDetail', async (productId, { rejectWithValue }) => {
    try {
        const respond = await axiosInstance.get(`products/getProduct/${productId}`);
        return respond.data.data as ProductDetailRespondDTO;
    } catch (error: any) {
        return rejectWithValue(
            error?.response?.data?.message || error.message || 'Lỗi không xác định'
        );
    }
});


export const fetchPages = createAsyncThunk<
    ProductPaginationRespondDto<ProductRespondSimplizeDto>,
    FilterOptions,
    { rejectValue: string }
>('product/fetchPages', async (filter: FilterOptions, { rejectWithValue }) => {
    try {
        const respond = await axiosInstance.get('products/getProducts', {
            params: filter
        });
        return respond.data.data as ProductPaginationRespondDto<ProductRespondSimplizeDto>;
    } catch (error: any) {
        return rejectWithValue(
            error?.response?.data?.message || error.message || 'Lỗi không xác định'
        );
    }
});


export const fetchCategorByType = createAsyncThunk<
    CategoryRespondDto[],
    void,
    { rejectValue: string }
>('product/fetchCategory', async (_, { rejectWithValue }) => {
    try {
        const respond = await axiosInstance.get('category/get-categories');
        console.log(respond.data.data);
        console.log("kjbhb");
        
        return respond.data.data as CategoryRespondDto[];
    } catch (error: any) {
        return rejectWithValue(
            error?.response?.data?.message || error.message || 'Lỗi không xác định'
        );
    }
})

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        clearProduct(state) {
            state.currentProductDetail = null;
            state.status = 'idle';
            state.error = undefined;
        },
        addToPages(state, action: PayloadAction<ProductPaginationRespondDto<ProductRespondSimplizeDto>>) {
            state.pages = action.payload
        }
        // addFilterAddtributes(
        //     state,
        //     action: PayloadAction<ProductPaginationRespondDto<ProductRespondSimplizeDto>>
        // ) {
        //     state.filter = action.payload;
        // },
        // clearFilter(state){
        //     state.filter={limit:10}
        // }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductDetail.pending, (state) => {
                state.status = 'loading';
                state.error = undefined;
            })
            .addCase(fetchProductDetail.fulfilled, (state, action: PayloadAction<ProductDetailRespondDTO>) => {
                state.status = 'succeeded';
                state.currentProductDetail = action.payload;
            })
            .addCase(fetchProductDetail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })



            .addCase(fetchCategorByType.fulfilled, (state, action: PayloadAction<CategoryRespondDto[]>) => {
                state.status = 'succeeded';
                state.categories = action.payload;
            })










            .addCase(fetchPages.fulfilled, (state, action) => {

                if (action.payload.page && action.payload.page > 1 && state.pages.data) {

                    state.pages = {
                        ...action.payload,
                        data: [
                            ...(state.pages.data ?? []),
                            ...(action.payload.data ?? [])
                        ],
                    };
                } else {
                    // Trang đầu, ghi đè
                    state.pages = action.payload;
                }
                state.filterStatus = 'succeeded'
            })
            .addCase(fetchPages.pending, (state) => {
                state.filterStatus = 'loading'
            })





    },
});

export const { clearProduct, addToPages } = productSlice.actions;
export default productSlice.reducer;

