import { configureStore } from '@reduxjs/toolkit';
import darkModeReducer from './darkModeReducer';
import refreshFrequencyReducer from './refreshFrequencyReducer';

export default configureStore({
    reducer: {
        darkMode: darkModeReducer,
        refreshFrequency: refreshFrequencyReducer
    }
});
