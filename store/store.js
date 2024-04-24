import { configureStore } from '@reduxjs/toolkit';
import darkModeReducer from './darkModeReducer';
import refreshFrequencyReducer from './refreshFrequencyReducer';
import usageTrackingReducer from './usageTrackingReducer';

export default configureStore({
    reducer: {
        darkMode: darkModeReducer,
        refreshFrequency: refreshFrequencyReducer,
        usageTracking: usageTrackingReducer
    }
});
