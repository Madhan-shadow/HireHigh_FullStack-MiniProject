import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

const storedToken = localStorage.getItem('token');
const storedRole = localStorage.getItem('role');
const storedUser = localStorage.getItem('user');

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

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
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
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
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

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const response = action.payload || {};

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
          response.user?.role ||
          response.user?.userRole ||
          null;

        const user = response.user || null;

        state.token = token;
        state.role = role;
        state.user = user;
        state.isAuthenticated = !!token;

        /*
         * T25
         * Store authentication token
         */
        if (token) {
          localStorage.setItem('token', token);
        }

        /*
         * T26
         * Store user role
         */
        if (role) {
          localStorage.setItem('role', role);
        }

        /*
         * Store user if available
         */
        if (user) {
          localStorage.setItem(
            'user',
            JSON.stringify(user)
          );
        }
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          'Unable to login. Please check your credentials.';
      })

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