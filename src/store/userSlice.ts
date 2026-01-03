import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Buyers, Vendors, sampleBuyer } from '../entities';

interface userState {
    user: Vendors | Buyers;
}


const initialState: userState = { user: sampleBuyer };

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action: PayloadAction<{ field: string; value: any }>) => {
            const { field, value } = action.payload;
            state.user = { ...state.user, [field]: value };
        },
        addUser: (state, action: PayloadAction<Vendors | Buyers>) => {
            state.user = action.payload;
        }
    },
});

export const { updateUser, addUser } = userSlice.actions;

export default userSlice.reducer;
