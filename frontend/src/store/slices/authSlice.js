import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// ======================================================
// LOAD STORED AUTH DATA
// ======================================================

const storedToken = localStorage.getItem('token');
const storedRole = localStorage.getItem('role');
const storedUser = localStorage.getItem('user');

let parsedUser = null;

try {
  parsedUser = storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
  parsedUser = null;
}

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  token: storedToken || null,
  role: storedRole || null,
  user: parsedUser,

  isAuthenticated: !!storedToken,

  loading: false,
  error: null,
};

// ======================================================
// LOGIN
// ======================================================

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Unable to login. Please check your credentials.'
      );
    }
  }
);

// ======================================================
// REGISTER
// ======================================================

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Unable to register. Please try again.'
      );
    }
  }
);

// ======================================================
// SLICE
// ======================================================

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ================= LOGIN PENDING =================
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // ================= LOGIN SUCCESS (T25, T26) =================
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        // Unwrap in case the service returned the raw axios response
        // instead of response.data (defensive against that mistake).
        const raw = action.payload || {};
        const response = raw.data && (raw.token || raw.user) === undefined ? raw.data : raw;

        const user = response.user || response.data?.user || null;

        const token =
          response.token ||
          response.accessToken ||
          response.jwt ||
          response.data?.token ||
          response.data?.accessToken ||
          response.data?.jwt ||
          null;

        const role =
          response.role ||
          response.userRole ||
          response.data?.role ||
          response.data?.userRole ||
          user?.role ||
          user?.userRole ||
          null;

        state.token = token;
        state.role = role;
        state.user = user;
        state.isAuthenticated = !!token;

        // T25: persist token
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }

        // T26: persist role
        if (role) {
          localStorage.setItem('role', role);
        } else {
          localStorage.removeItem('role');
        }

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      })

      // ================= LOGIN FAILED =================
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to login. Please check your credentials.';
      })

      // ================= REGISTER PENDING =================
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // ================= REGISTER SUCCESS =================
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      // ================= REGISTER FAILED =================
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to register. Please try again.';
      });
  },
});

// ======================================================
// ACTIONS
// ======================================================

export const { logout, clearAuthError } = authSlice.actions;

// ======================================================
// REDUCER
// ======================================================

export default authSlice.reducer;