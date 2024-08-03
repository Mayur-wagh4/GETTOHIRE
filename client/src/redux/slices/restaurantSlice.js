import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setAuth } from "./authSlice";


const BASE_URL = import.meta.env.VITE_API_URL;

// Utility function to get the auth token from the state
const getAuthToken = (getState) => {
  const state = getState();
  return state.restaurant.token;
};

export const registerRestaurant = createAsyncThunk(
  "restaurant/register",
  async (restaurantData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/register/restaurant`,
        restaurantData
      );
      dispatch(
        setAuth({
          userType: "restaurant",
          token: response.data.token,
          userId: response.data.restaurant._id,
        })
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to register restaurant"
      );
    }
  }
);
export const loginRestaurant = createAsyncThunk(
  "restaurant/login",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/signin/restaurant`,
        credentials
      );
      dispatch(
        setAuth({
          userType: "restaurant",
          token: response.data.token,
          userId: response.data.restaurant._id,
        })
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to login");
    }
  }
);

export const fetchRestaurantDetails = createAsyncThunk(
  "restaurant/fetchDetails",
  async (_, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);
    try {
      const response = await axios.get(
        `${BASE_URL}/restaurants/get-restaurant-profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch restaurant details"
      );
    }
  }
);

export const updateRestaurantProfile = createAsyncThunk(
  "restaurant/updateProfile",
  async (profileData, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);
    try {
      const response = await axios.put(
        `${BASE_URL}/restaurants/update-restaurant-profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update restaurant profile"
      );
    }
  }
);
export const fetchRestaurantJobListings = createAsyncThunk(
  "restaurant/fetchJobListings",
  async (_, { getState, rejectWithValue }) => {
    const state = getState().restaurant;
    if (state.jobPostsFetched) {
      return state.jobPosts;
    }

    const token = getAuthToken(getState);

    try {
     
      const response = await axios.get(
        `${BASE_URL}/restaurants/get-restaurant-jobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
     
      
      return response.data;
    } catch (error) {
      console.error("Error fetching job listings:", error.response || error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch job listings"
      );
    }
  }
);
export const createJob = createAsyncThunk(
  "restaurant/createJob",
  async (jobData, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);
    try {
      const response = await axios.post(
        `${BASE_URL}/restaurants/upload-job`,
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create job");
    }
  }
);

export const createAbroadJob = createAsyncThunk(
  "restaurant/createAbroadJob",
  async (jobData, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);
    try {
      const response = await axios.post(
        `${BASE_URL}/restaurants/upload-abroad-job`,
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create abroad job"
      );
    }
  }
);

export const initiateJobPostPayment = createAsyncThunk(
  "restaurant/initiateJobPostPayment",
  async (paymentData, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);
    try {
      const response = await axios.post(
        `${BASE_URL}/restaurants/initiate-job-post-payment`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to initiate payment"
      );
    }
  }
);

export const checkPaymentStatus = createAsyncThunk(
  "restaurant/checkPaymentStatus",
  async (transactionId, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);
    try {
      const response = await axios.get(
        `${BASE_URL}/restaurants/check-payment-status/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to check payment status"
      );
    }
  }
);

// Restaurant Slice
const restaurantSlice = createSlice({
  name: "restaurant",
  initialState: {
    token: null,
    restaurantId: null,
    email: null,
    jobPosts: [],
    details: null,
    jobPostsFetched: false,
    detailsFetched: false,
    loading: false,
    error: null,
  },
  reducers: {
    logoutRestaurant: (state) => {
      state.token = null;
      state.restaurantId = null;
      state.email = null;
      state.jobPosts = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.restaurantId = action.payload.restaurant._id;
        state.email = action.payload.restaurant.email;
      })
      .addCase(registerRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to register restaurant";
      })
      .addCase(loginRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.restaurantId = action.payload.restaurant._id;
        state.email = action.payload.restaurant.email;
      })
      .addCase(loginRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to login";
      })
      .addCase(fetchRestaurantDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload.data;
        state.detailsFetched = true;
      })
      .addCase(fetchRestaurantDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch restaurant details";
      })
      .addCase(updateRestaurantProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRestaurantProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload.restaurant;
      })
      .addCase(updateRestaurantProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update restaurant profile";
      })
      .addCase(fetchRestaurantJobListings.pending, (state) => {
        if (!state.jobPostsFetched) {
          state.loading = true;
          state.error = null;
        }
      })
      .addCase(fetchRestaurantJobListings.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.jobPosts = action.payload || [];
        state.jobPostsFetched = true;
      })
      .addCase(fetchRestaurantJobListings.rejected, (state, action) => {
        if (!state.jobPostsFetched) {
          state.loading = false;
          state.error = action.payload || "Failed to fetch job listings";
          state.jobPosts = [];
          state.jobPostsFetched = false;
        }
      })
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobPosts.push(action.payload.job);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create job";
      })
      .addCase(createAbroadJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAbroadJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobPosts.push(action.payload.job);
      })
      .addCase(createAbroadJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create abroad job";
      })
      .addCase(initiateJobPostPayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(initiateJobPostPayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.paymentUrl = action.payload.paymentUrl;
        state.transactionId = action.payload.transactionId;
      })
      .addCase(initiateJobPostPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload || "Failed to initiate payment";
      })
      .addCase(checkPaymentStatus.pending, (state) => {
        state.paymentStatusLoading = true;
        state.paymentStatusError = null;
      })
      .addCase(checkPaymentStatus.fulfilled, (state, action) => {
        state.paymentStatusLoading = false;
        state.paymentStatus = action.payload.success ? "success" : "failed";
      })
      .addCase(checkPaymentStatus.rejected, (state, action) => {
        state.paymentStatusLoading = false;
        state.paymentStatusError =
          action.payload || "Failed to check payment status";
      });
  },
});

export const { logoutRestaurant } = restaurantSlice.actions;

export default restaurantSlice.reducer;
