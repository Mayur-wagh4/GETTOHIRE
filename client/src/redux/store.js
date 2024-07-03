// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import authReducer from './slices/authSlice';
import candidateReducer from './slices/candidateSlice';
import restaurantReducer from './slices/restaurantSlice';

 const store = configureStore({
  reducer: {
    admin: adminReducer,
    candidate: candidateReducer,
    restaurant: restaurantReducer,
    auth: authReducer,
  },
});
export default store;