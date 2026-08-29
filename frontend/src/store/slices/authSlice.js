import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

const storedToken = localStorage.getItem('token');
const storedRole = localStorage.getItem('role');
const storedUser = localStorage.getItem('user');

let parsedUser = null;

try {
  parsedUser = storedUser ? JSON.parse(storedUser) : null;
} catch (e) {
  parsedUser = null;
}

const initialState = {
  token: storedToken || null,
  role: storedRole || null,
  user: parsedUser,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          'Unable to login. Please check your credentials.'
      );
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.register(userData);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          'Unable to register. Please try again.'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.user = null;
      state.isAuthenticated = false;

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

      // ---------------- LOGIN ----------------

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const response = action.payload || {};

        /*
         * Support both possible backend/test response formats:
         *
         * Format 1:
         * {
         *   token: "...",
         *   user: {
         *     role: "CANDIDATE"
         *   }
         * }
         *
         * Format 2:
         * {
         *   token: "...",
         *   role: "CANDIDATE"
         * }
         */

        const token = response.token || response.accessToken || null;

        const user = response.user || null;

        const role =
          response.role ||
          user?.role ||
          response.userRole ||
          null;

        state.token = token;
        state.user = user;
        state.role = role;
        state.isAuthenticated = !!token;

        // T25 - Store authentication token
        if (token) {
          localStorage.setItem('token', token);
        }

        // T26 - Store user role
        if (role) {
          localStorage.setItem('role', role);
        }

        // Store user when available
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          'Unable to login. Please check your credentials.';
      })

      // ---------------- REGISTER ----------------

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          'Unable to register. Please try again.';
      });
  },
});

export const {
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;

