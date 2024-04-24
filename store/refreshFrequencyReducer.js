import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRefreshFrequencySetting } from "../backend/userController";

const refreshFrequencySlice = createSlice({
    name: "refreshfrequency",
    initialState: {
        time: 30,
        loading: false
    },
    reducers: {
        updateRefreshFrequency(state, action) {
            console.log("state:", state);
            console.log("action:", action);
            state.time = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchRefreshFrequencySetting.pending, state => {
            state.loading = true
        });
        builder.addCase(fetchRefreshFrequencySetting.fulfilled, (state, action) => {
            state.time = action.payload
            state.loading = false
        });
        builder.addCase(fetchRefreshFrequencySetting.rejected, state => {
            state.loading = false
        });
    }
});

export const fetchRefreshFrequencySetting = createAsyncThunk('settings/refreshFrequency', async () => {
    return await getRefreshFrequencySetting();
});

export const { updateRefreshFrequency } = refreshFrequencySlice.actions;
export default refreshFrequencySlice.reducer;
