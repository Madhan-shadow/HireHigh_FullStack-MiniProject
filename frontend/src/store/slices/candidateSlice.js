import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import candidateService from '../../services/candidateService';

const initialState = {
  profile: null,
  loaded: false,
  loading: false,
  error: null,
};

export const fetchCandidateProfile = createAsyncThunk(
  'candidate/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await candidateService.getMyProfile();
    } catch (err) {
      // No profile yet for a brand new candidate — not fatal.
      return rejectWithValue(null);
    }
  }
);

export const saveCandidateProfile = createAsyncThunk(
  'candidate/saveProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      return await candidateService.updateMyProfile(profileData);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || 'Could not save your profile.'
      );
    }
  }
);

const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    setCandidateProfile: (state, action) => {
      state.profile = action.payload;
      state.loaded = true;
    },
    clearCandidateProfile: (state) => {
      state.profile = null;
      state.loaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.profile = action.payload;
      })
      .addCase(fetchCandidateProfile.rejected, (state) => {
        state.loading = false;
        state.loaded = true;
      })
      .addCase(saveCandidateProfile.pending, (state) => {
        state.error = null;
      })
      .addCase(saveCandidateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loaded = true;
      })
      .addCase(saveCandidateProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setCandidateProfile, clearCandidateProfile } = candidateSlice.actions;
export default candidateSlice.reducer;