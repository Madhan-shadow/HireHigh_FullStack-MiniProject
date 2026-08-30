import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data; // { message, token, role }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

const initialState = {
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { token, role } = action.payload;

        state.status = 'succeeded';
        state.loading = false;
        state.token = token;
        state.role = role;
        state.isAuthenticated = true;

        // T25 & T26
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded';
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;