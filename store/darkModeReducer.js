import { createSlice } from "@reduxjs/toolkit"

const darkmodeSlice = createSlice({
    name: "darkmode",
    initialState: {
        darkmode: false
    },
    reducers: {
        setDarkMode(state, action) {
            console.log("action:", action);
            state.darkmode = action.payload
        }
    }
})

export const { setDarkMode } = darkmodeSlice.actions;
export default darkmodeSlice.reducer;
