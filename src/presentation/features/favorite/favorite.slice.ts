import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from 'app/config/axios';
import { ProductRespondSimplizeDto } from 'src/presentation/dto/res/product-respond.dto';

export type FavoriteState = {
    items: ProductRespondSimplizeDto[];
    getFavoriteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    addToFavoriteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    removeFromFavoriteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string;
    favoriteIds: string[]; 
    backupFavoriteIds?: string[]; 
};

const initialState: FavoriteState = {
    items: [],
    getFavoriteStatus: 'idle',
    addToFavoriteStatus: 'idle',
    removeFromFavoriteStatus: 'idle',
    error: undefined,
    favoriteIds: [],
    backupFavoriteIds: undefined,
};

export const getFavoriteList = createAsyncThunk<
    ProductRespondSimplizeDto[],
    void,
    { rejectValue: string }
>('favorite/get-list', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('favorite/get-favorite-list');
        return res.data.data as ProductRespondSimplizeDto[];
    } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
    }
});

export const getFavoriteListIds = createAsyncThunk<
    string[], 
    void,
    { rejectValue: string }
>('favorite/get-list-ids', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('favorite/get-favorite-list-ids'); 
        return res.data.data as string[];
    } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
    }
});

export const addToFavorite = createAsyncThunk<
    void,
    { productId: string},
    { rejectValue: string }
>('favorite/add', async ({ productId }, { rejectWithValue }) => {
    try {
        await axiosInstance.post('favorite/add-to-favorite', { productId });
        return;
    } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
    }
});

export const removeFromFavorite = createAsyncThunk<
    void,
    string,
    { rejectValue: string }
>('favorite/remove', async (productId, { rejectWithValue }) => {
    try {
        await axiosInstance.delete('favorite/remove-from-favorite', { data: { productId } });
        return;
    } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
    }
});


/**
 *      // giải thích logic revert cho các con vợ xíu:
 *       khi fetch thì có 3 trang thái: loading, success, error
 *       -khi loading bắt đầu lưu cái data cũ (nếu có) vào backup
 *       -khi success thì xóa backup
 *       -khi error thì nếu có backup thì revert về cái data cũ
 *       ___      ___ ___  ___  ________  ________   ________          ________  ________     
 *      |\  \    /  /|\  \|\  \|\   __  \|\   ___  \|\   ____\        |\   ___ \|\_____  \    
 *      \ \  \  /  / | \  \\\  \ \  \|\  \ \  \\ \  \ \  \___|        \ \  \_|\ \\|___/  /|   
 *       \ \  \/  / / \ \  \\\  \ \  \\\  \ \  \\ \  \ \  \  ___       \ \  \ \\ \   /  / /   
 *        \ \    / /   \ \  \\\  \ \  \\\  \ \  \\ \  \ \  \|\  \       \ \  \_\\ \ /  /_/__  
 *         \ \__/ /     \ \_______\ \_______\ \__\\ \__\ \_______\       \ \_______\\________\
 *          \|__|/       \|_______|\|_______|\|__| \|__|\|_______|        \|_______|\|_______|
 */
const favoriteSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        clearFavorite(state) {
            state.items = [];
            state.getFavoriteStatus = 'idle';
            state.addToFavoriteStatus = 'idle';
            state.removeFromFavoriteStatus = 'idle';
            state.error = undefined;
            state.favoriteIds = [];
            state.backupFavoriteIds = undefined;
        },
        resetFavoriteStatus(state) {
            state.getFavoriteStatus = 'idle';
            state.addToFavoriteStatus = 'idle';
            state.removeFromFavoriteStatus = 'idle';
            state.error = undefined;
            state.favoriteIds = [];
            state.backupFavoriteIds = undefined;
        },
    },
    extraReducers: (builder) => {
        builder
            // getFavoriteList
            .addCase(getFavoriteList.pending, (state) => {
                state.getFavoriteStatus = 'loading';
                state.error = undefined;
            })
            .addCase(getFavoriteList.fulfilled, (state, action: PayloadAction<ProductRespondSimplizeDto[]>) => {
                state.getFavoriteStatus = 'succeeded';
                state.items = action.payload;
                state.favoriteIds = action.payload.map(item => item._id); 
            })
            .addCase(getFavoriteList.rejected, (state, action) => {
                state.getFavoriteStatus = 'failed';
                state.error = action.payload as string;
            })


            .addCase(getFavoriteListIds.pending, (state) => {

            })
            .addCase(getFavoriteListIds.fulfilled, (state, action: PayloadAction<string[]>) => {
                state.favoriteIds = action.payload; 
            })
            .addCase(getFavoriteListIds.rejected, (state, action) => {
                state.error = action.payload as string; 
            })

            // addToFavorite (Optimistic Update)
            .addCase(addToFavorite.pending, (state, action) => {
                state.addToFavoriteStatus = 'loading';
                state.error = undefined;
                state.backupFavoriteIds = state.favoriteIds; 
                const { productId } = action.meta.arg;
                state.favoriteIds = [...state.favoriteIds, productId];
            })
            .addCase(addToFavorite.fulfilled, (state) => {
                state.addToFavoriteStatus = 'succeeded';
                state.backupFavoriteIds = undefined; 
            })
            .addCase(addToFavorite.rejected, (state, action) => {
                state.addToFavoriteStatus = 'failed';
                state.error = action.payload as string;
                if (state.backupFavoriteIds) {
                    state.favoriteIds = state.backupFavoriteIds;
                }

                state.backupFavoriteIds = undefined; 
            })






            // removeFromFavorite 
            .addCase(removeFromFavorite.pending, (state, action) => {
                state.removeFromFavoriteStatus = 'loading';
                state.error = undefined;
                const productId = action.meta.arg;
                state.backupFavoriteIds = state.favoriteIds;
                state.favoriteIds = state.favoriteIds.filter(id => id !== productId);
            })
            .addCase(removeFromFavorite.fulfilled, (state) => {
                state.removeFromFavoriteStatus = 'succeeded';
                state.backupFavoriteIds = undefined;
            })
            .addCase(removeFromFavorite.rejected, (state, action) => {
                state.removeFromFavoriteStatus = 'failed';
                state.error = action.payload as string;
                if (state.backupFavoriteIds) {
                    state.favoriteIds = state.backupFavoriteIds;
                }
            });
    },
});

export const { clearFavorite, resetFavoriteStatus } = favoriteSlice.actions;
export default favoriteSlice.reducer;
