import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from 'app/config/axios';
import { FilterOptions } from "src/presentation/dto/req/filter-option.req.dto";
import { CategoryRespondDto } from 'src/presentation/dto/res/category-respond.dto';
import { ProductPaginationRespondDto } from "src/presentation/dto/res/pagination-respond.dto";
import { ProductRespondSimplizeDto } from "src/presentation/dto/res/product-respond.dto";
import { RatingRespondDto } from "src/presentation/dto/res/rating-respond.dto";
import { VoucherRespondDto } from "src/presentation/dto/res/voucher-respond";
import { BlogRespondDto, BlogPaginationRespondDto } from "src/presentation/dto/res/blog-respond.dto";

export const fetchCategorySuggest = createAsyncThunk<CategoryRespondDto[]>(
  'explore/fetchCategorySuggest',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/category/suggest');
      return res.data.data as CategoryRespondDto[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Lỗi khi lấy danh mục');
    }
  }
);

export const fetchBanners = createAsyncThunk<string[]>(
  'explore/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/banner/image-banner');
      return res.data.data as string[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Lỗi khi lấy banner');
    }
  }
);

export const fetchSpecialRatings = createAsyncThunk<RatingRespondDto[]>(
  'explore/fetchSpecialRatings',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/rating/special');
      return res.data.data as RatingRespondDto[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Lỗi khi lấy đánh giá');
    }
  }
);

export const fetchHotVouchers = createAsyncThunk<VoucherRespondDto[]>(
  'explore/fetchHotVouchers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/voucher/hot');
      console.log(res.data);
      
      return res.data.data as VoucherRespondDto[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Lỗi khi lấy voucher hot');
    }
  }
);


export const fetchPages = createAsyncThunk<
    ProductPaginationRespondDto<ProductRespondSimplizeDto>,
    {page:number, limit:number},
    { rejectValue: string }
>('expolre/fetchProducts', async (filter: {page:number, limit:number}, { rejectWithValue }) => {
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

export const fetchPublishedBlogs = createAsyncThunk<BlogPaginationRespondDto<BlogRespondDto>>(
  'explore/fetchPublishedBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/blogs/status/published', {
      });
      return res.data.data as BlogPaginationRespondDto<BlogRespondDto>;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Lỗi khi lấy bài viết');
    }
  }
);

const exploreSlice = createSlice({
  name: 'explore',
  initialState: {
    categories: [] as CategoryRespondDto[],
    fetchCategoriesStatus: 'idle',
    fetchCategoriesError: null as string | null,
    banners: [] as string[],
    fetchBannersStatus: 'idle',
    fetchBannersError: null as string | null,
    ratings: [] as RatingRespondDto[],
    fetchRatingsStatus: 'idle',
    fetchRatingsError: null as string | null,
    hotVouchers: [] as VoucherRespondDto[],
    fetchHotVouchersStatus: 'idle',
    fetchHotVouchersError: null as string | null,
    products: [] as ProductRespondSimplizeDto[],
    fetchProductsStatus: 'idle',
    fetchProductsError: null as string | null,
    productsPagination: null as ProductPaginationRespondDto<ProductRespondSimplizeDto> | null,
    blogs: [] as BlogRespondDto[],
    fetchBlogsStatus: 'idle',
    fetchBlogsError: null as string | null,
  },
  reducers: {
    resetExploreState: (state) => {
      state.categories = [];
      state.fetchCategoriesStatus = 'idle';
      state.fetchCategoriesError = null;
      state.banners = [];
      state.fetchBannersStatus = 'idle';
      state.fetchBannersError = null;
      state.ratings = [];
      state.fetchRatingsStatus = 'idle';
      state.fetchRatingsError = null;
      state.hotVouchers = [];
      state.fetchHotVouchersStatus = 'idle';
      state.fetchHotVouchersError = null;
      state.products = [];
      state.fetchProductsStatus = 'idle';
      state.fetchProductsError = null;
      state.productsPagination = null;
      state.blogs = [];
      state.fetchBlogsStatus = 'idle';
      state.fetchBlogsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategorySuggest.pending, (state) => {
        state.fetchCategoriesStatus = 'pending';
        state.fetchCategoriesError = null;
      })
      .addCase(fetchCategorySuggest.fulfilled, (state, action) => {
        state.fetchCategoriesStatus = 'success';
        state.categories = action.payload;
      })
      .addCase(fetchCategorySuggest.rejected, (state, action) => {
        state.fetchCategoriesStatus = 'error';
        state.fetchCategoriesError = action.payload as string || 'Lỗi không xác định';
      })
      .addCase(fetchBanners.pending, (state) => {
        state.fetchBannersStatus = 'pending';
        state.fetchBannersError = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.fetchBannersStatus = 'success';
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.fetchBannersStatus = 'error';
        state.fetchBannersError = action.payload as string || 'Lỗi không xác định';
      })
      .addCase(fetchSpecialRatings.pending, (state) => {
        state.fetchRatingsStatus = 'pending';
        state.fetchRatingsError = null;
      })
      .addCase(fetchSpecialRatings.fulfilled, (state, action) => {
        state.fetchRatingsStatus = 'success';
        state.ratings = action.payload;
      })
      .addCase(fetchSpecialRatings.rejected, (state, action) => {
        state.fetchRatingsStatus = 'error';
        state.fetchRatingsError = action.payload as string || 'Lỗi không xác định';
      })
      .addCase(fetchHotVouchers.pending, (state) => {
        state.fetchHotVouchersStatus = 'pending';
        state.fetchHotVouchersError = null;
      })
      .addCase(fetchHotVouchers.fulfilled, (state, action) => {
        state.fetchHotVouchersStatus = 'success';
        state.hotVouchers = action.payload;
      })
      .addCase(fetchHotVouchers.rejected, (state, action) => {
        state.fetchHotVouchersStatus = 'error';
        state.fetchHotVouchersError = action.payload as string || 'Lỗi không xác định';
      })
      .addCase(fetchPages.pending, (state) => {
        state.fetchProductsStatus = 'pending';
        state.fetchProductsError = null;
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.fetchProductsStatus = 'success';
        state.productsPagination = action.payload;
        if (action.payload.page === 1) {
          state.products = action.payload.data || [];
        } else {
          state.products = [...state.products, ...(action.payload.data || [])];
        }
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.fetchProductsStatus = 'error';
        state.fetchProductsError = action.payload as string || 'Lỗi không xác định';
      })
      .addCase(fetchPublishedBlogs.pending, (state) => {
        state.fetchBlogsStatus = 'pending';
        state.fetchBlogsError = null;
      })
      .addCase(fetchPublishedBlogs.fulfilled, (state, action) => {
        state.fetchBlogsStatus = 'success';
        state.blogs = action.payload.blogs;
      })
      .addCase(fetchPublishedBlogs.rejected, (state, action) => {
        state.fetchBlogsStatus = 'error';
        state.fetchBlogsError = action.payload as string || 'Lỗi không xác định';
      });
  },
});

export default exploreSlice.reducer;
export const { resetExploreState } = exploreSlice.actions;