import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import { addAlert } from './alertSlice';

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

const storedToken = localStorage.getItem('token');
const storedRole = localStorage.getItem('role');
const storedUser = localStorage.getItem('user');

const initialState = {
  token: storedToken || null,
  role: storedRole || null,
  user: storedUser ? safeParse(storedUser) : null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

// Per SRS: AuthResponseDto = { token, user }, and UserResponseDto mirrors
// SystemUser, so role lives on user.role.
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      const { token, user } = data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('user', JSON.stringify(user));
      return { token, user };
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'Unable to login. Please check your credentials.';
      dispatch(addAlert(message, 'error'));
      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      dispatch(addAlert('Account created successfully.', 'success'));
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'Unable to register. Please try again.';
      dispatch(addAlert(message, 'error'));
      return rejectWithValue(message);
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
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;