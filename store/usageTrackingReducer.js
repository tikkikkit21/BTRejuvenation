import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTrackingPermission } from "../backend/userController";

const usageTrackingSlice = createSlice({
    name: "usagetracking",
    initialState: {
        isEnabled: false,
        loading: false
    },
    reducers: {
        updateUsageTracking(state, action) {
            console.log("state:", state);
            console.log("action:", action);
            state.isEnabled = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchUsageTrackingSetting.pending, state => {
            state.loading = true
        });
        builder.addCase(fetchUsageTrackingSetting.fulfilled, (state, action) => {
            state.isEnabled = action.payload
            state.loading = false
        });
        builder.addCase(fetchUsageTrackingSetting.rejected, state => {
            state.loading = false
        });
    }
});

export const fetchUsageTrackingSetting = createAsyncThunk('settings/usageTracking', async () => {
    return await getTrackingPermission();
});

export const { updateUsageTracking } = usageTrackingSlice.actions;
export default usageTrackingSlice.reducer;
