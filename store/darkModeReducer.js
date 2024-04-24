import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDarkModeSetting } from "../backend/userController";

const darkmodeSlice = createSlice({
    name: "darkmode",
    initialState: {
        darkmode: false,
        loading: false
    },
    reducers: {
        setDarkMode(state, action) {
            console.log("action:", action);
            state.darkmode = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(getSetting.pending, state => {
            state.loading = true
        });
        builder.addCase(getSetting.fulfilled, (state, action) => {
            state.users = action.payload
            state.loading = false
        });
        builder.addCase(getSetting.rejected, state => {
            state.loading = false
        });
    }
});

const getSetting = createAsyncThunk('settings/darkMode', async () => {
    return await getDarkModeSetting();
});

export const { setDarkMode } = darkmodeSlice.actions;
export default darkmodeSlice.reducer;
