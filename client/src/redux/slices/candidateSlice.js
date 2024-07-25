import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// New payment-related async thunks
export const initiatePayment = createAsyncThunk(
  "candidate/initiatePayment",
  async (paymentData, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);
    try {
      const response = await axios.post(
        `${BASE_URL}/candidates/initiate-payment`,
        paymentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "An error occurred while initiating payment",
        }
      );
    }
  }
);
export const checkPaymentStatus = createAsyncThunk(
  "candidate/checkPaymentStatus",
  async (transactionId, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);
    try {
      const response = await axios.get(
        `${BASE_URL}/candidates/check-payment-status/${transactionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to check payment status" }
      );
    }
  }
);
// Utility function to get the auth token from the state
const getAuthToken = (getState) => {
  const state = getState();
  return state.candidate.token;
};

// Async Thunks
export const registerCandidate = createAsyncThunk(
  "candidate/register",
  async (candidateData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/register/candidate`,
        candidateData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginCandidate = createAsyncThunk(
  "candidate/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/signin/candidate`,
        credentials
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCandidateDetails = createAsyncThunk(
  "candidate/fetchDetails",
  async (userId, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);
    try {
      const response = await axios.post(
        `${BASE_URL}/candidates/get-user`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  }
);

export const updateCandidateProfile = createAsyncThunk(
  "candidate/updateProfile",
  async (profileData, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);
    try {
      const response = await axios.put(
        `${BASE_URL}/candidates/update-user`,
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
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  }
);

export const fetchAppliedJobs = createAsyncThunk(
  "candidate/fetchAppliedJobs",
  async (userId, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);
    try {
      const response = await axios.post(
        `${BASE_URL}/candidates/applied-jobs`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.appliedJobs)) {
        return response.data.appliedJobs;
      } else {
        return [];
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  }
);

export const fetchJobPosts = createAsyncThunk(
  "candidate/fetchJobPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/candidates/find-jobs`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  }
);

export const applyJob = createAsyncThunk(
  "candidate/applyJob",
  async (applicationData, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);
    try {
      const response = await axios.post(
        `${BASE_URL}/candidates/apply-job`,
        applicationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  }
);
const candidateSlice = createSlice({
  name: "candidate",
  initialState: {
    appliedJobs: [],
    jobPosts: [],
    jobDetails: null,
    token: null,
    userId: null,
    details: null,
    loading: false,
    error: null,
    paymentData: null,
    paymentStatus: null,
    paymentLoading: false,
    paymentError: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetPayment: (state) => {
      state.paymentData = null;
      state.paymentStatus = null;
      state.paymentError = null;
    },
    logoutCandidate: (state) => {
      state.token = null;
      state.userId = null;
      state.details = null;
      state.loading = false;
      state.error = null;
      state.appliedJobs = [];
      state.jobPosts = [];
      state.jobDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.details = action.payload.user;
        state.userId = action.payload.user._id;
      })
      .addCase(registerCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginCandidate.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(loginCandidate.fulfilled, (state, action) => {
        if (
          action.payload &&
          action.payload.token &&
          action.payload.user &&
          action.payload.user._id
        ) {
          state.loading = false;
          state.token = action.payload.token;
          state.details = action.payload.user;
          state.userId = action.payload.user._id;
        } else {
          state.loading = false;
          state.error = "Invalid response from server";
        }
      })
      .addCase(loginCandidate.rejected, (state, action) => {

        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCandidateDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload.data;
      })
      .addCase(fetchCandidateDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCandidateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload.candidate;
      })
      .addCase(updateCandidateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAppliedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppliedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedJobs = action.payload || [];
      })
      .addCase(fetchAppliedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch applied jobs";
        state.appliedJobs = action.payload;
      })
      .addCase(fetchJobPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.jobPosts = action.payload.jobs || [];
        state.totalJobs = action.payload.total || 0;
        state.currentPage = action.payload.page || 1;
        state.totalPages = action.payload.pages || 1;
      })
      .addCase(fetchJobPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(applyJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyJob.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedJobs.push(action.payload);
        state.successMessage = action.payload.message; 
        state.jobPosts = state.jobPosts.filter(
          (job) => job._id !== action.payload._id
        );
      })
      
      .addCase(applyJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(initiatePayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.paymentData = action.payload;
        state.paymentStatus = "INITIATED";
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload.message;
      })
      .addCase(checkPaymentStatus.pending, (state) => {
        state.paymentLoading = true;
      })
      .addCase(checkPaymentStatus.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.paymentStatus = action.payload.state;
        state.paymentData = { ...state.paymentData, ...action.payload };
      })
      .addCase(checkPaymentStatus.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload.message;
      });
  },
});

export const { logoutCandidate } = candidateSlice.actions;
export const { resetPayment } = candidateSlice.actions;

export const { clearError } = candidateSlice.actions;
export default candidateSlice.reducer;
