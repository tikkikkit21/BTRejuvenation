import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDarkModeSetting } from "../backend/userController";

const darkmodeSlice = createSlice({
    name: "darkmode",
    initialState: {
        isEnabled: false,
        loading: false
    },
    reducers: {
        setDarkMode(state, action) {
            console.log("action:", action);
            state.isEnabled = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchDarkModeSetting.pending, state => {
            state.loading = true
        });
        builder.addCase(fetchDarkModeSetting.fulfilled, (state, action) => {
            state.isEnabled = action.payload
            state.loading = false
        });
        builder.addCase(fetchDarkModeSetting.rejected, state => {
            state.loading = false
        });
    }
});

export const fetchDarkModeSetting = createAsyncThunk('settings/darkMode', async () => {
    return await getDarkModeSetting();
});

export const { setDarkMode } = darkmodeSlice.actions;
export default darkmodeSlice.reducer;
