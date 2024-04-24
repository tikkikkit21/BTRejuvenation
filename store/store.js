import { configureStore } from '@reduxjs/toolkit';
import darkModeReducer from './darkModeReducer';

export default configureStore({
    reducer: {
        darkMode: darkModeReducer
    }
});
