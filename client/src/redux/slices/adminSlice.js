import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAuth } from './authSlice';

const BASE_URL = 'http://api.gettohire.com/api-v1';
// const BASE_URL = 'http://43.204.238.196:3000/api-v1';
// const BASE_URL = 'http://localhost:3000/api-v1';



export const signInAdmin = createAsyncThunk(
  'admin/signIn',
  async ({ username, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/signin/admin`, { username, password });
      dispatch(
        setAuth({
          userType: 'admin',
          token: response.data.token,
          userId: response.data.admin._id,
        })
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Sign in failed');
    }
  }
);


export const fetchCandidates = createAsyncThunk(
  'admin/fetchCandidates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/users`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch candidates');
    }
  }
);

export const deleteCandidate = createAsyncThunk(
  'admin/deleteCandidate',
  async (candidateId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/admin/users/${candidateId}`);
      return candidateId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete candidate');
    }
  }
);

export const fetchRestaurants = createAsyncThunk(
  'admin/fetchRestaurants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/restaurants`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurants');
    }
  }
);

export const addRestaurant = createAsyncThunk(
  'admin/addRestaurant',
  async (restaurantData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/restaurant-add`, restaurantData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add restaurant');
    }
  }
);

export const deleteRestaurant = createAsyncThunk(
  'admin/deleteRestaurant',
  async (restaurantId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/admin/restaurants/${restaurantId}`);
      return restaurantId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete restaurant');
    }
  }
);

export const fetchJobs = createAsyncThunk(
  'admin/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/jobs`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const createJob = createAsyncThunk(
  'admin/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/upload-job`, jobData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create job');
    }
  }
);

export const createAbroadJob = createAsyncThunk(
  'admin/createAbroadJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/upload-abroad-job`, jobData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create abroad job');
    }
  }
);

export const deleteJob = createAsyncThunk(
  'admin/deleteJob',
  async (jobId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/admin/jobs/${jobId}`);
      return jobId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete job');
    }
  }
);

export const fetchJobApplications = createAsyncThunk(
  'admin/fetchJobApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/applications`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job applications');
    }
  }
);

// Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    admin: null,
    token: null,
    loading: false,
    error: null,
    jobApplications: [],
    candidates: [],
    restaurants: [],
    jobs: [],
  },
  reducers: {
    logoutAdmin: (state) => {
      state.admin = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.candidates = [];
      state.restaurants = [];
      state.jobs = [];
      state.jobApplications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // signInAdmin
      .addCase(signInAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
      })
      .addCase(signInAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchCandidates
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteCandidate
      .addCase(deleteCandidate.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = state.candidates.filter(candidate => candidate._id !== action.payload);
      })
      .addCase(deleteCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchRestaurants
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addRestaurant
      .addCase(addRestaurant.pending, (state) => {
        state.loading = true;
      })
      .addCase(addRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants.push(action.payload);
      })
      .addCase(addRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteRestaurant
      .addCase(deleteRestaurant.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = state.restaurants.filter(restaurant => restaurant._id !== action.payload);
      })
      .addCase(deleteRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchJobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createJob
      .addCase(createJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createAbroadJob
      .addCase(createAbroadJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAbroadJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload);
      })
      .addCase(createAbroadJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteJob
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter(job => job._id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchJobApplications
      .addCase(fetchJobApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.jobApplications = action.payload;
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutAdmin } = adminSlice.actions;

export default adminSlice.reducer;