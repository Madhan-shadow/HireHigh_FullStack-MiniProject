import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

const storedToken =
  localStorage.getItem('token');

const storedRole =
  localStorage.getItem('role');

const storedUser =
  localStorage.getItem('user');

let parsedUser = null;

try {
  parsedUser = storedUser
    ? JSON.parse(storedUser)
    : null;
} catch (error) {
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

// ======================================================
// LOGIN
// ======================================================

export const login = createAsyncThunk(
  'auth/login',
  async (
    credentials,
    { rejectWithValue }
  ) => {
    try {
      const response =
        await authService.login(
          credentials
        );

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
  async (
    userData,
    { rejectWithValue }
  ) => {
    try {
      const response =
        await authService.register(
          userData
        );

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

      // ==================================================
      // LOGIN PENDING
      // ==================================================

      .addCase(
        login.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      // ==================================================
      // T25 + T26
      // ==================================================

      .addCase(
        login.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          const response =
            action.payload || {};

          const token =
            response.token;

          const role =
            response.role;

          state.token =
            token || null;

          state.role =
            role || null;

          state.isAuthenticated =
            !!token;

          // T25
          if (token) {
            localStorage.setItem(
              'token',
              token
            );
          }

          // T26
          if (role) {
            localStorage.setItem(
              'role',
              role
            );
          }
        }
      )

      // ==================================================
      // LOGIN FAILED
      // ==================================================

      .addCase(
        login.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            'Unable to login. Please check your credentials.';
        }
      )

      // ==================================================
      // REGISTER
      // ==================================================

      .addCase(
        register.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        register.fulfilled,
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )

      .addCase(
        register.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            'Unable to register. Please try again.';
        }
      );
  },
});

export const {
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;