import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://api.gettohire.com/api-v1';
// const BASE_URL = 'http://43.204.238.196:3000/api-v1';
// const BASE_URL = 'http://localhost:3000/api-v1';

// Utility function to get the auth token from the state
const getAuthToken = (getState) => {
  const state = getState();
  return state.candidate.token;
};

// Async Thunks
export const registerCandidate = createAsyncThunk(
  'candidate/register',
  async (candidateData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register/candidate`, candidateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginCandidate = createAsyncThunk(
  'candidate/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/signin/candidate`, credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCandidateDetails = createAsyncThunk(
  'candidate/fetchDetails',
  async (userId, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);
    console.log('Fetching candidate details for userId:', userId);
    try {
      const response = await axios.post(`${BASE_URL}/candidates/get-user`, { userId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred');
    }
  }
);

export const updateCandidateProfile = createAsyncThunk(
  'candidate/updateProfile',
  async (profileData, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);
    try {
      const response = await axios.put(`${BASE_URL}/candidates/update-user`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred');
    }
  }
);

export const fetchAppliedJobs = createAsyncThunk(
  'candidate/fetchAppliedJobs',
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
        console.error('Unexpected response structure:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'An error occurred'
      );
    }
  }
);

export const fetchJobPosts = createAsyncThunk(
  'candidate/fetchJobPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/candidates/find-jobs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job posts:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred');
    }
  }
);



export const applyJob = createAsyncThunk(
  'candidate/applyJob',
  async (applicationData, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);
    try {
      const response = await axios.post(`${BASE_URL}/candidates/apply-job`, applicationData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error applying for job:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred');
    }
  }
);
const candidateSlice = createSlice({
  name: 'candidate',
  initialState: {
    appliedJobs: [],
    jobPosts: [],
    jobDetails: null,
    token: null,
    userId: null,
    details: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
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
    }
  },  extraReducers: (builder) => {
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
        console.log('Login successful:', action.payload);
        if (action.payload && action.payload.token && action.payload.user && action.payload.user._id) {
          state.loading = false;
          state.token = action.payload.token;
          state.details = action.payload.user;
          state.userId = action.payload.user._id;
        
        } else {
          state.loading = false;
          state.error = 'Invalid response from server';
        }
      })
      .addCase(loginCandidate.rejected, (state, action) => {
        console.log('Login failed:', action.payload);
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
        state.error = action.payload || 'Failed to fetch applied jobs';
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
        // Remove the applied job from jobPosts
        state.jobPosts = state.jobPosts.filter(job => job._id !== action.payload._id);
      })
      .addCase(applyJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutCandidate } = candidateSlice.actions;

export const { clearError } = candidateSlice.actions;
export default candidateSlice.reducer;