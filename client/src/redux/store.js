import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import candidateReducer from './slices/candidateSlice';
import restaurantReducer from "./slices/restaurantSlice.js";
const store = configureStore({
  reducer: {
    restaurant: restaurantReducer,
    candidate: candidateReducer,
    admin:adminReducer,
  },
});

export default store;
